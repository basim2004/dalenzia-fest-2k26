import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Award,
  Calendar,
  Users,
  FileText,
  Bell,
  User,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Save,
  Send,
  Eye,
  Download,
  Key,
  ChevronRight,
  Menu,
  X,
  Lock,
  Edit2,
  LifeBuoy,
  Plus,
  Trash2,
  Search,
  RotateCcw
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import ConvenerHelpdesk from '../components/ConvenerHelpdesk';
import { unifiedLogin, unifiedChangePassword } from '../services/unifiedAuthService';
import UnifiedPasswordModal from '../components/auth/UnifiedPasswordModal';

export default function JudgePortal({ onNavigateAdmin, onNavigatePublic }) {
  // Authentication state for individual judge
  const [judgeSession, setJudgeSession] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('dalenzia_judge_session');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return null;
  });

  const [currentJudgeId, setCurrentJudgeId] = useState(() => judgeSession?.id || 'JDG-1001');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(judgeSession));
  const [loginEmail, setLoginEmail] = useState('judge01@judge');
  const [loginPassword, setLoginPassword] = useState('+91 98470 30001');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [pendingSession, setPendingSession] = useState(null);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Store data
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());
  const [notificationToast, setNotificationToast] = useState(null);

  // Mark Entry Console State
  const [selectedCompForMarkEntry, setSelectedCompForMarkEntry] = useState(null);
  const [markSheetForm, setMarkSheetForm] = useState({});

  // Dynamic Competition Creation Modal
  const [showCreateCompModal, setShowCreateCompModal] = useState(false);
  const [createCompForm, setCreateCompForm] = useState({
    name: '',
    classification: 'Stage', // 'Stage' | 'Off Stage' | 'General'
    type: 'Individual',
    category: 'Senior',
    maxMarks: 100
  });

  // Candidate Search & Selection State for Individual Mark Entry
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('');

  const [previewPoster, setPreviewPoster] = useState(null);

  const refreshState = () => {
    setStoreData({ ...festivalStore.loadData() });
  };

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Currently logged in judge object
  const currentJudge = useMemo(() => {
    return (storeData?.judges || []).find(j => j.id === currentJudgeId) || storeData?.judges?.[0] || {
      id: 'JDG-1001',
      name: 'Chief Adjudicator',
      designation: 'Festival Jury Head • 21, 22, 23 DECEMBER 2026',
      institution: 'Dalailussunna Dars, Ayiroor',
      phone: '+91 98470 30001',
      email: 'judge@dalenziafest.in'
    };
  }, [storeData?.judges, currentJudgeId]);

  // Assigned programmes strictly for THIS judge (Section 12 & 13)
  const myAssignedProgrammes = useMemo(() => {
    return (storeData?.programmeAssignments || []).filter(a =>
      Array.isArray(a.assignedJudgeIds) && a.assignedJudgeIds.includes(currentJudgeId)
    );
  }, [storeData?.programmeAssignments, currentJudgeId]);

  // My submitted evaluations
  const mySubmittedEvaluations = useMemo(() => {
    return (storeData?.submittedEvaluations || []).filter(e => e.judgeId === currentJudgeId);
  }, [storeData?.submittedEvaluations, currentJudgeId]);

  // Published posters for events THIS judge evaluated (Section 9 & 12)
  const myResultPosters = useMemo(() => {
    return (storeData?.resultPosters || []).filter(p =>
      Array.isArray(p.assignedJudgeIds) && p.assignedJudgeIds.includes(currentJudgeId)
    );
  }, [storeData?.resultPosters, currentJudgeId]);

  // My notifications
  const myNotifications = useMemo(() => {
    return (storeData?.notifications || []).filter(n => n.judgeId === currentJudgeId);
  }, [storeData?.notifications, currentJudgeId]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await unifiedLogin(loginEmail, loginPassword, 'JUDGE');
      if (res.success) {
        if (res.mustChangePassword) {
          setPendingSession({
            ...res.session,
            currentPasswordUsed: loginPassword
          });
          setShowFirstLoginModal(true);
          return;
        }

        setCurrentJudgeId(res.session.id);
        setJudgeSession(res.session);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('dalenzia_judge_session', JSON.stringify(res.session));
        }
        showToast(`Welcome, ${res.session.user}! Signed into Judge Portal.`);
      } else {
        setLoginError(res.error || 'Invalid credentials.');
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication error.');
    }
  };

  const handleFirstTimePasswordSubmit = async ({ newPassword }) => {
    if (!pendingSession) return;
    await unifiedChangePassword('JUDGE', pendingSession.id, pendingSession.currentPasswordUsed, newPassword);
    const updatedSession = { ...pendingSession, mustChangePassword: false };
    delete updatedSession.currentPasswordUsed;
    setShowFirstLoginModal(false);
    setCurrentJudgeId(updatedSession.id);
    setJudgeSession(updatedSession);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dalenzia_judge_session', JSON.stringify(updatedSession));
    }
    showToast(`Security credentials updated. Welcome, ${updatedSession.user}!`);
  };

  // Handle Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dalenzia_judge_session');
    }
    setJudgeSession(null);
    setIsAuthenticated(false);
  };

  // Handle Mark Entry Input Change
  const handleMarkChange = (studentId, criterionId, val, maxMarks) => {
    const num = Math.min(Math.max(0, Number(val) || 0), maxMarks);
    setMarkSheetForm(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [criterionId]: num
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setMarkSheetForm(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        remarks
      }
    }));
  };

  // Calculate row total for a candidate
  const calculateParticipantTotal = (studentId, criteria) => {
    const scores = markSheetForm[studentId] || {};
    return criteria.reduce((sum, cr) => sum + (scores[cr.id] || 0), 0);
  };

  // Handle Dynamic Competition Creation by Judge
  const handleCreateCompetition = (e) => {
    e.preventDefault();
    if (!createCompForm.name.trim()) {
      alert('Please enter a competition name.');
      return;
    }
    try {
      const isGeneral = createCompForm.classification === 'General';
      const newComp = festivalStore.createJudgeCompetition({
        name: createCompForm.name.trim(),
        classification: createCompForm.classification,
        type: isGeneral ? 'General' : createCompForm.type,
        category: isGeneral ? 'General' : createCompForm.category,
        judgeId: currentJudge.id,
        judgeName: currentJudge.name,
        maxMarks: Number(createCompForm.maxMarks) || 100
      });
      refreshState();
      setSelectedCompForMarkEntry(newComp.competitionId);
      setActiveTab('mark_entry');
      setShowCreateCompModal(false);
      setCreateCompForm({ name: '', classification: 'Stage', type: 'Individual', category: 'Senior', maxMarks: 100 });
      showToast(`Competition "${newComp.title}" created successfully!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Adding Student to Individual Competition
  const handleAddStudentCandidate = (assignment, studentId) => {
    if (!studentId) return;
    const student = (storeData.registeredStudents || []).find(s => s.id === studentId);
    if (!student) return;

    const participants = assignment.participants || [];
    if (participants.some(p => p.studentId === student.id)) {
      alert(`Student ${student.name} (${student.id}) is already added to this competition.`);
      return;
    }

    const team = (storeData.teams || []).find(t => t.id === student.teamId);
    const newEntry = {
      studentId: student.id,
      chestNo: student.chestNo || '',
      name: student.name,
      category: student.category || assignment.category,
      teamId: student.teamId,
      teamName: team ? (team.displayName || team.name) : (student.teamName || 'Unassigned')
    };

    assignment.participants = [...participants, newEntry];
    festivalStore.saveData();
    refreshState();
    setSelectedStudentToAdd('');
    showToast(`Added ${student.name} to competition.`);
  };

  // Handle Removing Student from Individual Competition
  const handleRemoveStudentCandidate = (assignment, studentId) => {
    assignment.participants = (assignment.participants || []).filter(p => p.studentId !== studentId);
    setMarkSheetForm(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });
    festivalStore.saveData();
    refreshState();
    showToast('Removed candidate from competition.');
  };

  // Submit Mark Sheet (Handles both Individual and General)
  const handleSubmitMarkSheet = (assignment) => {
    const isGeneral = (assignment.type || '').toLowerCase() === 'general' || (assignment.category || '').toLowerCase() === 'general';
    const evalCriteria = assignment.evaluationCriteria || assignment.criteria || [];

    let candidateList = [];
    if (isGeneral) {
      candidateList = (storeData.teams || []).map(t => ({
        teamId: t.id,
        teamName: t.displayName || t.name,
        name: t.displayName || t.name
      }));
    } else {
      candidateList = Array.isArray(assignment.participants) ? assignment.participants : [];
    }

    if (candidateList.length === 0) {
      alert(isGeneral ? 'No teams found for evaluation.' : 'Please add at least one candidate before submitting.');
      return;
    }

    if (!window.confirm(`Submit final official marks for ${assignment.competitionTitle}? Once submitted, marks are locked unless Convener or Admin requests a correction.`)) {
      return;
    }

    let scoresPayload = [];
    if (isGeneral) {
      scoresPayload = candidateList.map(t => {
        const pScores = markSheetForm[t.teamId] || {};
        const criteriaMarks = {};
        evalCriteria.forEach(cr => {
          criteriaMarks[cr.id] = pScores[cr.id] || 0;
        });
        const total = calculateParticipantTotal(t.teamId, evalCriteria);
        return {
          teamId: t.teamId,
          teamName: t.teamName,
          name: t.name,
          criteriaMarks,
          total,
          remarks: pScores.remarks || 'Team Evaluation'
        };
      });
    } else {
      scoresPayload = candidateList.map(p => {
        const pScores = markSheetForm[p.studentId] || {};
        const criteriaMarks = {};
        evalCriteria.forEach(cr => {
          criteriaMarks[cr.id] = pScores[cr.id] || 0;
        });
        const total = calculateParticipantTotal(p.studentId, evalCriteria);
        return {
          studentId: p.studentId,
          chestNo: p.chestNo,
          name: p.name,
          category: p.category || assignment.category,
          teamId: p.teamId,
          teamName: p.teamName,
          criteriaMarks,
          total,
          remarks: pScores.remarks || 'Individual Evaluation'
        };
      });
    }

    try {
      festivalStore.submitJudgeEvaluation({
        assignmentId: assignment.id,
        competitionId: assignment.competitionId,
        judgeId: currentJudge.id,
        judgeName: currentJudge.name,
        type: assignment.type,
        category: assignment.category,
        scores: scoresPayload
      });
      refreshState();
      setActiveTab('submitted');
      showToast('Official mark sheet securely submitted to Convener & Secretariat!');
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // 1. LOGIN SCREEN (If unauthenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F3E9] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-[#E6A916]/30 text-center space-y-5">
          <div className="h-12 w-auto mx-auto flex items-center justify-center">
            <img
              src="/assets/dalenzia_fest_logo.png"
              alt="Dalenzia Fest Logo"
              className="h-full w-auto object-contain"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[11px] font-bold border border-[#A91F35]/20">
              <Shield className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Official Adjudicator Portal</span>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Sign in with your designated official credentials to access assigned competitions.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Authorized Username (username@judge)
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="judge01@judge"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35] font-semibold text-stone-800"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Password (Initial: Registered Phone)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Registered Phone Number"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35] font-semibold text-stone-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? <Eye className="w-4 h-4 text-[#A91F35]" /> : <Lock className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Sign In to Judge Portal
            </button>
          </form>

          <div className="p-3 rounded-xl bg-[#F7F3E9] border border-stone-200 text-stone-600 text-[11px] text-left">
            <div className="font-bold text-[#A91F35] mb-1">Standard Judge Credentials:</div>
            <div>Username: <strong className="font-mono text-stone-800">judge01@judge</strong></div>
            <div>Initial Password: <strong className="font-mono text-stone-800">+91 98470 30001 (Phone)</strong></div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <a href="#admin" className="hover:text-[#A91F35] font-bold">← Admin Portal</a>
            <a href="#home" className="hover:text-[#A91F35] font-bold">Public Website →</a>
          </div>
        </div>

        {/* Mandatory First-Login Password Change Modal */}
        <UnifiedPasswordModal
          isOpen={showFirstLoginModal}
          isFirstLogin={true}
          portalTitle="Judge & Adjudication Portal"
          userName={pendingSession?.user || "Official Adjudicator"}
          initialPasswordUsed={pendingSession?.currentPasswordUsed || ""}
          onSubmit={handleFirstTimePasswordSubmit}
          onClose={() => setShowFirstLoginModal(false)}
        />
      </div>
    );
  }

  // =========================================================================
  // 2. MAIN JUDGE PORTAL APPLICATION LAYOUT
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex font-sans selection:bg-[#A91F35] selection:text-white">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#A91F35] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#E6A916]/40 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-[#E6A916] animate-spin" />
            <span>{notificationToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for Judge Navigation (Section 12) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#A91F35] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-68 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="h-10 sm:h-11">
              <img
                src="/assets/dalenzia_fest_logo.png"
                alt="Dalenzia Fest"
                className="h-full w-auto object-contain"
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded-lg text-white/80 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-xs"
              style={{ backgroundColor: currentJudge.avatarColor || '#E6A916' }}
            >
              {currentJudge.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="font-bold text-xs text-white truncate">{currentJudge.name}</div>
              <div className="text-[10px] text-[#E6A916] font-mono">{currentJudge.id} • Adjudicator</div>
            </div>
          </div>
        </div>

        {/* Navigation Items (Section 12) */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Shield },
            { id: 'programmes', label: 'My Assigned Programmes', count: myAssignedProgrammes.length, icon: Calendar },
            { id: 'mark_entry', label: 'Mark Entry Console', icon: Edit2 },
            { id: 'submitted', label: 'Submitted Results', count: mySubmittedEvaluations.length, icon: FileText },
            { id: 'posters', label: 'Published Result Posters', count: myResultPosters.length, icon: Award },
            { id: 'notifications', label: 'Notifications', count: myNotifications.filter(n => !n.read).length, icon: Bell },
            { id: 'profile', label: 'My Profile & Credentials', icon: User },
            { id: 'helpdesk', label: 'Convener Helpdesk', icon: LifeBuoy }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-md font-black'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-[#A91F35] text-white' : 'bg-[#E6A916] text-[#A91F35]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer controls & Switcher */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="text-[10px] text-white/60 mb-1">Switch View / Portal:</div>
          <a
            href="#admin"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <span>Admin Control Panel</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:bg-white/10 transition-all"
          >
            <span>Sign Out</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#A91F35] font-serif">
                Judge Portal • Adjudication Session
              </h2>
              <p className="text-[11px] text-stone-500">
                Official grading workspace for {currentJudge.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateCompModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E6A916] text-[#A91F35] hover:bg-[#d89708] flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create Competition</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F3E9] border border-[#E6A916]/40 text-xs font-bold text-[#A91F35]">
              <Lock className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Independent Evaluation Lock Active</span>
            </div>
            <a
              href="#home"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
            >
              Website
            </a>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-4 sm:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* 1. DASHBOARD TAB                                                          */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#A91F35] to-[#7f1425] rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6A916] text-[#A91F35] uppercase">
                      Official Adjudicator
                    </span>
                    <span className="text-xs text-white/80 font-mono">{currentJudge.id}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-serif">
                    Welcome, {currentJudge.name}
                  </h3>
                  <p className="text-xs text-white/80 max-w-xl">
                    {currentJudge.designation} — {currentJudge.institution}. Please evaluate participants according to the sanctioned classical criteria rubric.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('mark_entry')}
                  className="px-5 py-2.5 rounded-2xl bg-[#E6A916] text-[#A91F35] font-black text-xs hover:bg-[#d4970f] shadow-md shrink-0 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Open Mark Entry Console</span>
                </button>
              </div>

              {/* KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Assigned Programmes', val: myAssignedProgrammes.length, sub: 'Competitions', color: '#A91F35', icon: Calendar },
                  { label: 'Submitted Sheets', val: mySubmittedEvaluations.length, sub: 'Logged securely', color: '#047857', icon: CheckCircle },
                  { label: 'Published Posters', val: myResultPosters.length, sub: 'For your events', color: '#E6A916', icon: Award },
                  { label: 'Notifications', val: myNotifications.length, sub: 'From Secretariat', color: '#7c3aed', icon: Bell }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-stone-500 uppercase">{kpi.label}</span>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: kpi.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-stone-900 font-serif">{kpi.val}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{kpi.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Assigned Programmes Snapshot */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-[#A91F35] font-serif">Your Assigned Competitions</h4>
                    <p className="text-xs text-stone-500">Only competitions assigned to your account are accessible</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('programmes')}
                    className="text-xs font-bold text-[#A91F35] hover:text-[#E6A916] flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {myAssignedProgrammes.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <p className="font-semibold text-stone-700">No competition entries have been submitted yet.</p>
                    <button
                      onClick={() => setShowCreateCompModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                      <span>+ Create Competition</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myAssignedProgrammes.map((prog) => {
                      const hasSubmitted = mySubmittedEvaluations.some(e => e.competitionId === prog.competitionId);
                      return (
                        <div
                          key={prog.id}
                          className="p-4 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 hover:border-[#E6A916] transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#A91F35]">{prog.competitionCode}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                hasSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {hasSubmitted ? 'Marks Submitted' : 'Pending Entry'}
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-stone-900">{prog.competitionTitle}</h5>
                          <div className="text-xs text-stone-500 flex items-center gap-2">
                            <span className="font-bold text-stone-700">Type: {prog.type}</span>
                            <span>•</span>
                            <span>Category: {prog.category}</span>
                          </div>

                          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                            <span className="text-[11px] text-stone-600">
                              <strong>{prog.participants?.length || 0}</strong> Registered Candidates
                            </span>
                            <button
                              onClick={() => {
                                setSelectedCompForMarkEntry(prog.competitionId);
                                setActiveTab('mark_entry');
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                            >
                              {hasSubmitted ? 'View Mark Sheet' : 'Enter Marks'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. MY ASSIGNED PROGRAMMES                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'programmes' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#A91F35] font-serif">My Assigned Competitions & Rubrics</h3>
                  <p className="text-xs text-stone-500">Official evaluation rules, scoring breakdown and candidate rosters</p>
                </div>
                <button
                  onClick={() => setShowCreateCompModal(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>+ Create Competition</span>
                </button>
              </div>

              {myAssignedProgrammes.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-semibold text-stone-700">No competition entries have been submitted yet.</p>
                  <p className="text-stone-500">Create an authentic competition to begin entering marks.</p>
                  <button
                    onClick={() => setShowCreateCompModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                    <span>+ Create Competition</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAssignedProgrammes.map((prog) => {
                    const hasSubmitted = mySubmittedEvaluations.some(e => e.competitionId === prog.competitionId);
                    return (
                      <div
                        key={prog.id}
                        className="p-5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#A91F35]">{prog.competitionCode}</span>
                              <h4 className="font-bold text-sm text-stone-900">{prog.competitionTitle}</h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                {prog.type}
                              </span>
                            </div>
                            <div className="text-xs text-stone-600 mt-1 flex items-center gap-2">
                              <span>Category: <strong>{prog.category}</strong></span>
                              <span>•</span>
                              <span>Status: <strong>{prog.status}</strong></span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedCompForMarkEntry(prog.competitionId);
                              setActiveTab('mark_entry');
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                          >
                            {hasSubmitted ? 'Inspect Submitted Marks' : 'Open Mark Entry Form'}
                          </button>
                        </div>

                        {/* Criteria */}
                        <div>
                          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                            Criteria Breakdown (Max Total: {prog.totalMaxMarks || prog.maxMarks || 100} Marks)
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {(prog.evaluationCriteria || prog.criteria || []).map((cr) => (
                              <span
                                key={cr.id}
                                className="px-3 py-1 rounded-lg bg-white border border-stone-200 font-medium text-stone-800"
                              >
                                <strong>{cr.name}:</strong> {cr.maxMarks} Marks
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MARK ENTRY CONSOLE (Sections 6, 12 & 13)                                */}
          {/* ========================================================================= */}
          {activeTab === 'mark_entry' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-6">
              {/* Competition Selector & Create Competition CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#A91F35] font-serif">Independent Mark Entry Console</h3>
                  <p className="text-xs text-stone-500">
                    Grade each participant across sanctioned criteria. Cannot view other judges' scores.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowCreateCompModal(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E6A916] text-[#A91F35] hover:bg-[#d89708] flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Create Competition</span>
                  </button>

                  {myAssignedProgrammes.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-700">Select Event:</span>
                      <select
                        value={selectedCompForMarkEntry || (myAssignedProgrammes[0]?.competitionId || '')}
                        onChange={(e) => setSelectedCompForMarkEntry(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-[#A91F35] bg-[#F7F3E9] focus:outline-none"
                      >
                        {myAssignedProgrammes.map((prog) => (
                          <option key={prog.competitionId} value={prog.competitionId}>
                            {prog.competitionTitle} ({prog.type || 'Individual'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Assignment Details */}
              {(() => {
                const currentAssignment = myAssignedProgrammes.find(
                  a => a.competitionId === selectedCompForMarkEntry
                ) || myAssignedProgrammes[0];

                if (!currentAssignment) {
                  return (
                    <div className="p-12 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                      <p className="font-semibold text-stone-700">No competition entries have been submitted yet.</p>
                      <p className="text-stone-500">Create an authentic competition to begin entering marks.</p>
                      <button
                        onClick={() => setShowCreateCompModal(true)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                        <span>+ Create Competition</span>
                      </button>
                    </div>
                  );
                }

                const existingSheet = mySubmittedEvaluations.find(
                  e => e.competitionId === currentAssignment.competitionId
                );

                const isReturned = existingSheet && (existingSheet.status === 'RETURNED' || existingSheet.status === 'Correction Requested');
                const isApproved = existingSheet && (existingSheet.status === 'APPROVED' || existingSheet.status === 'Approved');
                const isLocked = existingSheet && !isReturned;

                const isGeneral = (currentAssignment.type || '').toLowerCase() === 'general' ||
                  (currentAssignment.category || '').toLowerCase() === 'general';
                const evalCriteria = currentAssignment.evaluationCriteria || currentAssignment.criteria || [];

                // Determine active candidates list
                let activeCandidatesList = [];
                if (isGeneral) {
                  activeCandidatesList = (storeData.teams || []).map(t => ({
                    teamId: t.id,
                    teamName: t.displayName || t.name,
                    name: t.displayName || t.name,
                    chestNo: t.code || t.id
                  }));
                } else {
                  activeCandidatesList = Array.isArray(currentAssignment.participants) ? currentAssignment.participants : [];
                }

                // Compute real-time leaderboard preview
                const sortedPreview = [...activeCandidatesList].map(cand => {
                  const idKey = isGeneral ? cand.teamId : cand.studentId;
                  const total = calculateParticipantTotal(idKey, evalCriteria);
                  return { ...cand, idKey, total };
                }).sort((a, b) => b.total - a.total);

                return (
                  <div className="space-y-5">
                    {/* Return for Correction Banner */}
                    {isReturned && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                          <div>
                            <div className="font-bold">
                              Evaluation Returned for Correction by {existingSheet.returnedByRole || 'Convener'} ({existingSheet.returnedByName || 'Secretariat'})
                            </div>
                            <div className="text-rose-700 mt-0.5">
                              Reason: <em>"{existingSheet.returnReason || existingSheet.correctionReason || 'Please review scores and resubmit'}"</em>
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-200 text-rose-800 uppercase self-start sm:self-center">
                          Revision Mode Active
                        </span>
                      </div>
                    )}

                    {/* Approved Banner */}
                    {isApproved && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Officially Certified:</strong> Approved by {existingSheet.approvedByRole === 'ADMIN' ? 'Admin' : 'Convener'} ({existingSheet.approvedByName || 'Secretariat'}) on {existingSheet.approvedAt ? new Date(existingSheet.approvedAt).toLocaleString() : 'N/A'}.
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-800 uppercase">
                          Locked & Approved
                        </span>
                      </div>
                    )}

                    {/* Event Info Bar */}
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-stone-900 text-sm">{currentAssignment.competitionTitle}</div>
                        <div className="text-stone-600 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[#A91F35] font-bold">{currentAssignment.competitionCode}</span>
                          <span>•</span>
                          <span>Type: <strong>{isGeneral ? 'General Team Event' : 'Individual Competition'}</strong></span>
                          <span>•</span>
                          <span>Category: <strong>{currentAssignment.category}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-700">
                          Scoring: {isGeneral ? '1st: 10, 2nd: 8, 3rd: 6 pts' : '1st: 3, 2nd: 2, 3rd: 1 pt'}
                        </span>
                      </div>
                    </div>

                    {/* Individual Candidate Search & Add Bar */}
                    {!isGeneral && !isLocked && (
                      <div className="p-4 rounded-2xl bg-[#F7F3E9] border border-[#E6A916]/40 space-y-3">
                        <div className="text-xs font-bold text-[#A91F35] flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5" />
                          <span>Search & Select Eligible Registered Students ({currentAssignment.category} Category)</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <div className="relative flex-1 w-full">
                            <input
                              type="text"
                              placeholder="Type name, chest no or student ID to filter..."
                              value={candidateSearchQuery}
                              onChange={(e) => setCandidateSearchQuery(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#A91F35] bg-white"
                            />
                          </div>
                          <select
                            value={selectedStudentToAdd}
                            onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                            className="w-full sm:w-80 px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#A91F35] bg-white"
                          >
                            <option value="">-- Choose Registered Student --</option>
                            {(storeData.registeredStudents || [])
                              .filter(s => {
                                if (currentAssignment.category && currentAssignment.category !== 'General') {
                                  if (s.category && s.category.toLowerCase() !== currentAssignment.category.toLowerCase()) return false;
                                }
                                if (!candidateSearchQuery.trim()) return true;
                                const q = candidateSearchQuery.toLowerCase();
                                return (s.name || '').toLowerCase().includes(q) ||
                                  (s.chestNo || '').toLowerCase().includes(q) ||
                                  (s.id || '').toLowerCase().includes(q);
                              })
                              .map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.chestNo ? `[${s.chestNo}] ` : ''}{s.name} ({s.category}) — {s.teamName || 'Team'}
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            disabled={!selectedStudentToAdd}
                            onClick={() => handleAddStudentCandidate(currentAssignment, selectedStudentToAdd)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                            <span>Add Candidate</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Marking Matrix */}
                    <div className="overflow-x-auto rounded-2xl border border-stone-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#A91F35] text-white text-[10px] font-bold uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">{isGeneral ? 'Team ID' : 'Chest No'}</th>
                            <th className="py-3 px-4">{isGeneral ? 'Team Name' : 'Participant Name'}</th>
                            {!isGeneral && <th className="py-3 px-4">Assigned Team</th>}
                            {evalCriteria.map((cr) => (
                              <th key={cr.id} className="py-3 px-3 text-center">
                                {cr.name} ({cr.maxMarks})
                              </th>
                            ))}
                            <th className="py-3 px-3 text-center">Total Score</th>
                            <th className="py-3 px-4">Qualitative Observations</th>
                            {!isGeneral && !isLocked && <th className="py-3 px-3 text-center">Action</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white">
                          {activeCandidatesList.length === 0 ? (
                            <tr>
                              <td colSpan={evalCriteria.length + (isGeneral ? 4 : 5)} className="py-8 text-center text-xs text-stone-500">
                                {isGeneral ? 'No teams assigned.' : 'No candidates added yet. Use the search bar above to add registered students.'}
                              </td>
                            </tr>
                          ) : (
                            activeCandidatesList.map((cand) => {
                              const idKey = isGeneral ? cand.teamId : cand.studentId;
                              const pScores = markSheetForm[idKey] || {};
                              const total = calculateParticipantTotal(idKey, evalCriteria);

                              return (
                                <tr key={idKey} className="hover:bg-[#F7F3E9]/40">
                                  <td className="py-3.5 px-4 font-mono font-black text-sm text-[#A91F35]">
                                    {cand.chestNo || cand.teamId}
                                  </td>
                                  <td className="py-3.5 px-4 font-bold text-stone-900">
                                    {cand.name}
                                    {!isGeneral && cand.category && (
                                      <span className="ml-2 text-[10px] text-stone-500 font-normal">
                                        ({cand.category})
                                      </span>
                                    )}
                                  </td>
                                  {!isGeneral && (
                                    <td className="py-3.5 px-4 text-stone-600 font-medium">
                                      {cand.teamName}
                                    </td>
                                  )}

                                  {/* Criteria Input Cells */}
                                  {evalCriteria.map((cr) => {
                                    const val = pScores[cr.id] !== undefined ? pScores[cr.id] : 0;
                                    return (
                                      <td key={cr.id} className="py-3.5 px-3 text-center">
                                        <input
                                          type="number"
                                          disabled={isLocked}
                                          min="0"
                                          max={cr.maxMarks}
                                          value={val}
                                          onChange={(e) =>
                                            handleMarkChange(idKey, cr.id, e.target.value, cr.maxMarks)
                                          }
                                          className={`w-16 px-2 py-1.5 rounded-lg border text-center font-mono font-bold text-xs focus:outline-none ${
                                            isLocked
                                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                                              : 'border-stone-300 focus:border-[#A91F35] bg-white'
                                          }`}
                                        />
                                      </td>
                                    );
                                  })}

                                  {/* Total Calculation */}
                                  <td className="py-3.5 px-3 text-center font-black text-sm font-mono text-[#A91F35]">
                                    {total}
                                  </td>

                                  {/* Remarks */}
                                  <td className="py-3.5 px-4">
                                    <input
                                      type="text"
                                      disabled={isLocked}
                                      placeholder="Feedback or observations..."
                                      value={pScores.remarks || ''}
                                      onChange={(e) => handleRemarksChange(idKey, e.target.value)}
                                      className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                                        isLocked
                                          ? 'bg-stone-100 text-stone-500 border-stone-200'
                                          : 'border-stone-200 focus:border-[#A91F35]'
                                      }`}
                                    />
                                  </td>

                                  {/* Remove Candidate */}
                                  {!isGeneral && !isLocked && (
                                    <td className="py-3.5 px-3 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveStudentCandidate(currentAssignment, cand.studentId)}
                                        className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                        title="Remove candidate"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Live Placement & Points Preview */}
                    {sortedPreview.length > 0 && (
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                          Live Placement & Position Points Preview (Subject to Official Approval)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {sortedPreview.slice(0, 3).map((item, idx) => {
                            const pts = isGeneral ? [10, 8, 6][idx] : [3, 2, 1][idx];
                            const labels = ['1st Place (Gold)', '2nd Place (Silver)', '3rd Place (Bronze)'];
                            return (
                              <div key={idx} className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-stone-900 block">{labels[idx]}: {item.name}</span>
                                  <span className="text-[10px] text-stone-500">Score: {item.total} pts</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-amber-100 text-amber-900 border border-amber-200">
                                  +{pts} pts
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submit Button Console */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
                      <div className="text-xs text-stone-500">
                        {isLocked ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            <span>This mark sheet has been officially submitted and locked.</span>
                          </span>
                        ) : (
                          <span>Please verify all scores before dispatching to Convener & Secretariat.</span>
                        )}
                      </div>

                      {!isLocked && (
                        <button
                          onClick={() => handleSubmitMarkSheet(currentAssignment)}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-2xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <Send className="w-4 h-4 text-[#E6A916]" />
                          <span>{isReturned ? 'Resubmit Corrected Mark Sheet' : 'Submit Official Evaluation Sheet'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. SUBMITTED RESULTS TAB                                                  */}
          {/* ========================================================================= */}
          {activeTab === 'submitted' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#A91F35] font-serif">My Submitted Evaluation Sheets</h3>
                  <p className="text-xs text-stone-500">Archived official submissions and secretariat verification status</p>
                </div>
                <button
                  onClick={() => setShowCreateCompModal(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>+ Create Competition</span>
                </button>
              </div>

              {mySubmittedEvaluations.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <FileText className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-semibold text-stone-700">No judge evaluations have been submitted yet.</p>
                  <button
                    onClick={() => {
                      if (myAssignedProgrammes.length > 0) {
                        setSelectedCompForMarkEntry(myAssignedProgrammes[0].competitionId);
                        setActiveTab('mark_entry');
                      } else {
                        setShowCreateCompModal(true);
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{myAssignedProgrammes.length > 0 ? 'Open Mark Entry Console' : '+ Create Competition'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mySubmittedEvaluations.map((ev) => {
                    const comp = (storeData.programmeAssignments || []).find(a => a.competitionId === ev.competitionId || a.id === ev.assignmentId);
                    const isApproved = ev.status === 'APPROVED' || ev.status === 'Approved';
                    const isReturned = ev.status === 'RETURNED' || ev.status === 'Correction Requested';

                    return (
                      <div
                        key={ev.id}
                        className="p-5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-2.5">
                          <div>
                            <div className="font-bold text-sm text-stone-900">
                              {comp ? comp.competitionTitle : (ev.competitionTitle || ev.competitionId)}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Submitted: <strong>{ev.submittedAt ? new Date(ev.submittedAt).toLocaleString() : 'Recently'}</strong> • Type: <strong>{ev.type || 'Individual'}</strong> • Ref: <span className="font-mono">{ev.id}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isApproved && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>{ev.approvedByRole === 'ADMIN' ? 'Approved by Admin' : 'Approved by Convener'}</span>
                              </span>
                            )}
                            {isReturned && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Returned for Correction</span>
                              </span>
                            )}
                            {!isApproved && !isReturned && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pending Approval</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Returned reason alert */}
                        {isReturned && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
                            <div>
                              <strong>Correction Reason ({ev.returnedByRole || 'Convener'}):</strong> "{ev.returnReason || ev.correctionReason}"
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCompForMarkEntry(ev.competitionId);
                                const preloaded = {};
                                (ev.scores || []).forEach(sc => {
                                  const key = sc.studentId || sc.teamId;
                                  if (key) {
                                    preloaded[key] = {
                                      ...(sc.criteriaMarks || {}),
                                      remarks: sc.remarks || ''
                                    };
                                  }
                                });
                                setMarkSheetForm(preloaded);
                                setActiveTab('mark_entry');
                              }}
                              className="px-3 py-1 bg-[#A91F35] text-white rounded-lg font-bold text-xs hover:bg-[#8B1A2C] shrink-0 ml-3"
                            >
                              Edit & Resubmit &rarr;
                            </button>
                          </div>
                        )}

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs bg-white rounded-xl border border-stone-200">
                            <thead className="bg-stone-50 text-stone-600 text-[10px] font-bold uppercase">
                              <tr>
                                <th className="py-2 px-3">{ev.type === 'General' ? 'Team' : 'Chest No'}</th>
                                <th className="py-2 px-3">{ev.type === 'General' ? 'Team Name' : 'Student Name'}</th>
                                {ev.type !== 'General' && <th className="py-2 px-3">Team</th>}
                                <th className="py-2 px-3 text-center">Score Awarded</th>
                                <th className="py-2 px-3">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-800">
                              {(ev.scores || []).map((sc, idx) => (
                                <tr key={idx}>
                                  <td className="py-2 px-3 font-mono font-bold text-[#A91F35]">{sc.chestNo || sc.teamId}</td>
                                  <td className="py-2 px-3 font-bold">{sc.name}</td>
                                  {ev.type !== 'General' && <td className="py-2 px-3 text-stone-600">{sc.teamName}</td>}
                                  <td className="py-2 px-3 text-center font-black text-[#A91F35] font-mono">
                                    {sc.total}
                                  </td>
                                  <td className="py-2 px-3 text-stone-600 italic">"{sc.remarks || 'Standard evaluation'}"</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. PUBLISHED RESULT POSTERS (Section 9 & 12)                               */}
          {/* ========================================================================= */}
          {activeTab === 'posters' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-[#A91F35] font-serif">Published Competition Posters</h3>
                <p className="text-xs text-stone-500">
                  Official result posters released by the Secretariat for competitions assigned to you
                </p>
              </div>

              {myResultPosters.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">
                  Official posters for your assigned competitions have not been published yet. Check back soon.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myResultPosters.map((poster) => (
                    <div
                      key={poster.id}
                      className="bg-gradient-to-b from-[#A91F35] to-[#731221] rounded-3xl p-6 text-white shadow-lg border-2 border-[#E6A916]/60 flex flex-col justify-between"
                    >
                      <div className="text-center border-b border-white/10 pb-3 mb-4">
                        <div className="text-[10px] tracking-widest uppercase font-bold text-[#E6A916]">
                          DALENZIA FEST 2K26 • AWARD POSTER
                        </div>
                        <h4 className="text-base font-black font-serif mt-1">{poster.competitionTitle}</h4>
                        <div className="text-[10px] text-white/70">{poster.venue} • {poster.date}</div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {poster.firstPrize && (
                          <div className="p-3 rounded-2xl bg-white/10 border border-[#E6A916] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-black text-xs">
                                1
                              </span>
                              <div>
                                <div className="font-black text-xs">{poster.firstPrize.name}</div>
                                <div className="text-[10px] text-white/80">{poster.firstPrize.teamName} ({poster.firstPrize.chestNo})</div>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-black text-[#E6A916]">
                              {poster.firstPrize.score}
                            </span>
                          </div>
                        )}

                        {poster.secondPrize && (
                          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-900 flex items-center justify-center font-bold text-[10px]">
                                2
                              </span>
                              <div>
                                <div className="font-bold text-white text-[11px]">{poster.secondPrize.name}</div>
                                <div className="text-[9px] text-white/70">{poster.secondPrize.teamName}</div>
                              </div>
                            </div>
                            <span className="font-mono text-[11px] text-[#E6A916]">
                              {poster.secondPrize.score}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-white/60">Published: {poster.publishedAt}</span>
                        <button
                          onClick={() => window.print()}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E6A916] text-[#A91F35] hover:bg-[#d4970f] flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Poster</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. NOTIFICATIONS TAB                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-[#A91F35] font-serif">Adjudication Alerts & Notices</h3>
                <p className="text-xs text-stone-500">Official directives from the Fest Secretariat and Controller</p>
              </div>

              <div className="space-y-3">
                {myNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-stone-900">{notif.title}</h4>
                        <span className="text-[10px] text-stone-400">{notif.date}</span>
                      </div>
                      <p className="text-xs text-stone-600">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. MY PROFILE TAB                                                         */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5 max-w-2xl">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-[#A91F35] font-serif">Adjudicator Profile & Credentials</h3>
                <p className="text-xs text-stone-500">Official records verified by Dalailussunna Academic Council</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F3E9] border border-stone-200">
                  <div
                    className="w-14 h-14 rounded-2xl text-white font-black text-lg flex items-center justify-center shadow-md"
                    style={{ backgroundColor: currentJudge.avatarColor || '#A91F35' }}
                  >
                    {currentJudge.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-stone-900 font-serif">{currentJudge.name}</h4>
                    <div className="text-xs font-mono font-bold text-[#A91F35]">{currentJudge.id}</div>
                    <div className="text-[11px] text-stone-500">{currentJudge.designation}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Institution</span>
                    <span className="font-bold text-stone-800">{currentJudge.institution}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Qualifications</span>
                    <span className="font-bold text-stone-800">{currentJudge.qualification}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Contact Phone</span>
                    <span className="font-bold font-mono text-stone-800">{currentJudge.phone}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Official Email</span>
                    <span className="font-bold text-stone-800">{currentJudge.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. CONVENER HELPDESK TAB */}
          {activeTab === 'helpdesk' && (
            <ConvenerHelpdesk
              portalName="Judge Portal"
              userProfile={currentJudge}
            />
          )}
        </main>
      </div>

      {/* Dynamic Competition Creation Modal */}
      {showCreateCompModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif">Create Official Competition</h3>
                <p className="text-xs text-stone-500">Add an authentic fest event for adjudication</p>
              </div>
              <button
                onClick={() => setShowCreateCompModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompetition} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Competition Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. English Elocution, Qur'an Hifz, Mappilappattu..."
                  value={createCompForm.name}
                  onChange={(e) => setCreateCompForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Official Classification *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Stage', label: 'Stage', sub: 'Pages 5–8 On Stage' },
                    { id: 'Off Stage', label: 'Off Stage', sub: 'Pages 5–8 Off Stage' },
                    { id: 'General', label: 'General', sub: 'Page 9 Team Items' }
                  ].map(cls => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setCreateCompForm(prev => ({
                        ...prev,
                        classification: cls.id,
                        category: cls.id === 'General' ? 'General' : (prev.category === 'General' ? 'Senior' : prev.category),
                        type: cls.id === 'General' ? 'General' : (prev.type === 'General' ? 'Individual' : prev.type)
                      }))}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        createCompForm.classification === cls.id
                          ? 'border-[#A91F35] bg-red-50/60 text-[#A91F35] font-black shadow-xs ring-1 ring-[#A91F35]'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 font-bold'
                      }`}
                    >
                      <div className="text-xs">{cls.label}</div>
                      <div className="text-[10px] text-stone-600 font-normal">{cls.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Competition Type</label>
                  {createCompForm.classification === 'General' ? (
                    <input
                      type="text"
                      disabled
                      value="General Team (10-8-6 Pts)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-bold"
                    />
                  ) : (
                    <select
                      value={createCompForm.type}
                      onChange={(e) => setCreateCompForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35] font-bold"
                    >
                      <option value="Individual">Individual (3-2-1 Pts)</option>
                      <option value="Group">Group (10-8-6 Pts)</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Student Category</label>
                  {createCompForm.classification === 'General' ? (
                    <input
                      type="text"
                      disabled
                      value="General (Dazzlers & Dynamos)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-bold"
                    />
                  ) : (
                    <select
                      value={createCompForm.category}
                      onChange={(e) => setCreateCompForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35] font-bold"
                    >
                      <option value="Minor">Minor (Class 5 to 9)</option>
                      <option value="Sub Junior">Sub Junior (Class 10)</option>
                      <option value="Junior">Junior (+1, +2)</option>
                      <option value="Senior">Senior (Degree)</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Assigned Official Judge</label>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 font-medium">
                  {currentJudge.name} ({currentJudge.id})
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Competition Status</label>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 font-bold">
                  Pending Evaluation
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCompModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A91F35] text-white font-bold hover:bg-[#8B1A2C] shadow-sm cursor-pointer"
                >
                  Create Competition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
