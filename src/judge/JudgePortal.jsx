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
  LifeBuoy
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import ConvenerHelpdesk from '../components/ConvenerHelpdesk';

export default function JudgePortal({ onNavigateAdmin, onNavigatePublic }) {
  // Authentication state for individual judge
  // Default demo logged-in as Chief Adjudicator (JDG-1001)
  const [currentJudgeId, setCurrentJudgeId] = useState('JDG-1001');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginEmail, setLoginEmail] = useState('judge@dalenziafest.in');
  const [loginPassword, setLoginPassword] = useState('judge2k26');
  const [loginError, setLoginError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Store data
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());
  const [notificationToast, setNotificationToast] = useState(null);

  // Mark Entry Console State
  const [selectedCompForMarkEntry, setSelectedCompForMarkEntry] = useState(null);
  const [markSheetForm, setMarkSheetForm] = useState({});

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
  const handleLogin = (e) => {
    e.preventDefault();
    const foundJudge = storeData.judges.find(
      j => j.email.toLowerCase() === loginEmail.toLowerCase().trim()
    );

    if (foundJudge) {
      if (foundJudge.status !== 'Active') {
        setLoginError('Your judge account is currently inactive. Please contact the Fest Administrator.');
        return;
      }
      setCurrentJudgeId(foundJudge.id);
      setIsAuthenticated(true);
      setLoginError('');
      showToast(`Welcome, ${foundJudge.name}! Signed into Judge Portal.`);
    } else {
      setLoginError('Invalid judge credentials. Try judge@dalenziafest.in');
    }
  };

  // Handle Logout
  const handleLogout = () => {
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

  // Submit Mark Sheet
  const handleSubmitMarkSheet = (assignment) => {
    if (!window.confirm(`Submit final official marks for ${assignment.competitionTitle}? Once submitted, marks are locked unless Admin requests a correction.`)) {
      return;
    }

    const evalCriteria = assignment.evaluationCriteria || assignment.criteria || [];
    const participantsList = Array.isArray(assignment.participants) ? assignment.participants : [];

    const scoresPayload = participantsList.map(p => {
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
        teamId: p.teamId,
        teamName: p.teamName,
        criteriaMarks,
        total,
        remarks: pScores.remarks || 'Standard evaluation'
      };
    });

    try {
      festivalStore.submitJudgeEvaluation({
        assignmentId: assignment.id,
        competitionId: assignment.competitionId,
        judgeId: currentJudge.id,
        judgeName: currentJudge.name,
        scores: scoresPayload
      });
      refreshState();
      setActiveTab('submitted');
      showToast('Official mark sheet securely submitted to Admin Control Centre!');
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
              <label className="block font-bold text-stone-700 mb-1">Judge Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Secure Password / Access Token</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all shadow-md active:scale-95"
            >
              Sign In to Judge Portal
            </button>
          </form>

          <div className="p-3 rounded-xl bg-[#F7F3E9] border border-stone-200 text-stone-600 text-[11px] text-left">
            <div className="font-bold text-[#A91F35] mb-1">Demo Adjudicator Access:</div>
            <div>Email: <strong className="font-mono">judge@dalenziafest.in</strong></div>
            <div>Password: <strong className="font-mono">judge2k26</strong></div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <a href="#admin" className="hover:text-[#A91F35] font-bold">← Admin Portal</a>
            <a href="#home" className="hover:text-[#A91F35] font-bold">Public Website →</a>
          </div>
        </div>
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
                          <span>{prog.venue}</span>
                          <span>•</span>
                          <span>{prog.date}, {prog.time}</span>
                        </div>

                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-stone-600">
                            <strong>{prog.totalParticipants}</strong> Registered Participants
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
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. MY ASSIGNED PROGRAMMES                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'programmes' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-[#A91F35] font-serif">My Assigned Competitions & Rubrics</h3>
                <p className="text-xs text-stone-500">Official evaluation rules, scoring breakdown and candidate rosters</p>
              </div>

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
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            Venue: <strong>{prog.venue}</strong> • Schedule: <strong>{prog.date}, {prog.time}</strong>
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

                      <div className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200">
                        <div className="font-bold text-[#A91F35] mb-1">Adjudication Instructions:</div>
                        <p className="italic text-stone-600">"{prog.instructions}"</p>
                      </div>

                      {/* Criteria */}
                      <div>
                        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                          Criteria Breakdown (Max Total: {prog.totalMaxMarks} Marks)
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MARK ENTRY CONSOLE (Sections 6, 12 & 13)                                */}
          {/* ========================================================================= */}
          {activeTab === 'mark_entry' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-6">
              {/* Competition Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#A91F35] font-serif">Independent Mark Entry Console</h3>
                  <p className="text-xs text-stone-500">
                    Grade each participant across sanctioned criteria. Cannot view other judges' scores.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">Select Event:</span>
                  <select
                    value={selectedCompForMarkEntry}
                    onChange={(e) => setSelectedCompForMarkEntry(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-[#A91F35] bg-[#F7F3E9] focus:outline-none"
                  >
                    {myAssignedProgrammes.map((prog) => (
                      <option key={prog.competitionId} value={prog.competitionId}>
                        {prog.competitionTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Assignment Details */}
              {(() => {
                const currentAssignment = myAssignedProgrammes.find(
                  a => a.competitionId === selectedCompForMarkEntry
                ) || myAssignedProgrammes[0];

                if (!currentAssignment) {
                  return (
                    <div className="p-8 text-center text-xs text-stone-500">
                      No competitions currently selected.
                    </div>
                  );
                }

                const existingSheet = mySubmittedEvaluations.find(
                  e => e.competitionId === currentAssignment.competitionId
                );

                const isLocked = existingSheet && existingSheet.status !== 'Correction Requested';

                return (
                  <div className="space-y-5">
                    {/* Security Notice */}
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>
                          <strong>Strict Confidentiality:</strong> Your entries are encrypted. Peer judges cannot inspect your individual marks.
                        </span>
                      </div>
                      {isLocked && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          Evaluation Sheet Locked
                        </span>
                      )}
                    </div>

                    {/* Marking Matrix */}
                    <div className="overflow-x-auto rounded-2xl border border-stone-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#A91F35] text-white text-[10px] font-bold uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Chest No</th>
                            <th className="py-3 px-4">Participant Name</th>
                            <th className="py-3 px-4">Team</th>
                            {(currentAssignment.evaluationCriteria || currentAssignment.criteria || []).map((cr) => (
                              <th key={cr.id} className="py-3 px-3 text-center">
                                {cr.name} ({cr.maxMarks})
                              </th>
                            ))}
                            <th className="py-3 px-3 text-center">Total (100)</th>
                            <th className="py-3 px-4">Qualitative Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white">
                          {(currentAssignment.participants || []).map((p) => {
                            const pScores = markSheetForm[p.studentId] || {};
                            const total = calculateParticipantTotal(p.studentId, currentAssignment.evaluationCriteria || currentAssignment.criteria || []);

                            return (
                              <tr key={p.studentId} className="hover:bg-[#F7F3E9]/40">
                                <td className="py-3.5 px-4 font-mono font-black text-sm text-[#A91F35]">
                                  {p.chestNo}
                                </td>
                                <td className="py-3.5 px-4 font-bold text-stone-900">
                                  {p.name}
                                </td>
                                <td className="py-3.5 px-4 text-stone-600 font-medium">
                                  {p.teamName}
                                </td>

                                {/* Criteria Input Cells */}
                                {(currentAssignment.evaluationCriteria || currentAssignment.criteria || []).map((cr) => {
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
                                          handleMarkChange(p.studentId, cr.id, e.target.value, cr.maxMarks)
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
                                    placeholder="Enter feedback or observations..."
                                    value={pScores.remarks || ''}
                                    onChange={(e) => handleRemarksChange(p.studentId, e.target.value)}
                                    className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none ${
                                      isLocked
                                        ? 'bg-stone-100 text-stone-500 border-stone-200'
                                        : 'border-stone-200 focus:border-[#A91F35]'
                                    }`}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Submit Button Console */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <div className="text-xs text-stone-500">
                        {isLocked ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            <span>This mark sheet has been officially received and locked.</span>
                          </span>
                        ) : (
                          <span>Please verify all scores before dispatching to the Fest Controller.</span>
                        )}
                      </div>

                      {!isLocked && (
                        <button
                          onClick={() => handleSubmitMarkSheet(currentAssignment)}
                          className="px-6 py-2.5 rounded-2xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] shadow-md flex items-center gap-2 active:scale-95"
                        >
                          <Send className="w-4 h-4 text-[#E6A916]" />
                          <span>Submit Official Evaluation Sheet</span>
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
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-[#A91F35] font-serif">My Submitted Evaluation Sheets</h3>
                <p className="text-xs text-stone-500">Archived official submissions and secretariat verification status</p>
              </div>

              {mySubmittedEvaluations.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">
                  You haven't submitted any evaluation sheets yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {mySubmittedEvaluations.map((ev) => {
                    const comp = storeData.programmeAssignments.find(a => a.competitionId === ev.competitionId);
                    return (
                      <div
                        key={ev.id}
                        className="p-5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-2.5">
                          <div>
                            <div className="font-bold text-sm text-stone-900">
                              {comp ? comp.competitionTitle : ev.competitionId}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Submitted at: <strong>{ev.submittedAt}</strong> • Ref: <span className="font-mono">{ev.id}</span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              ev.status === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs bg-white rounded-xl border border-stone-200">
                            <thead className="bg-stone-50 text-stone-600 text-[10px] font-bold uppercase">
                              <tr>
                                <th className="py-2 px-3">Chest No</th>
                                <th className="py-2 px-3">Student Name</th>
                                <th className="py-2 px-3">Team</th>
                                <th className="py-2 px-3 text-center">Score Awarded</th>
                                <th className="py-2 px-3">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-stone-800">
                              {ev.scores.map((sc, idx) => (
                                <tr key={idx}>
                                  <td className="py-2 px-3 font-mono font-bold text-[#A91F35]">{sc.chestNo}</td>
                                  <td className="py-2 px-3 font-bold">{sc.name}</td>
                                  <td className="py-2 px-3 text-stone-600">{sc.teamName}</td>
                                  <td className="py-2 px-3 text-center font-black text-[#A91F35] font-mono">
                                    {sc.total} / 100
                                  </td>
                                  <td className="py-2 px-3 text-stone-600 italic">"{sc.remarks}"</td>
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
    </div>
  );
}
