import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  Award,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Key,
  Eye,
  Check,
  AlertTriangle,
  Send,
  Download,
  Share2,
  ChevronRight,
  ChevronDown,
  Calendar,
  Sparkles,
  RefreshCw,
  X,
  ExternalLink,
  SlidersHorizontal,
  Printer,
  FileSpreadsheet,
  CheckCheck
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function JudgeManagementModule({ initialTab = 'dashboard' }) {
  // Navigation tabs matching Section 14
  const [activeTab, setActiveTab] = useState(initialTab);
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddJudgeModalOpen, setIsAddJudgeModalOpen] = useState(false);
  const [selectedJudgeProfile, setSelectedJudgeProfile] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssignmentForModal, setSelectedAssignmentForModal] = useState(null);
  const [correctionModalItem, setCorrectionModalItem] = useState(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [previewPosterItem, setPreviewPosterItem] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);

  // Assignment view sub-toggle: 'judge-wise' | 'programme-wise'
  const [assignmentViewMode, setAssignmentViewMode] = useState('programme-wise');

  // New Judge Form State
  const [newJudgeForm, setNewJudgeForm] = useState({
    name: '',
    designation: '',
    institution: '',
    phone: '',
    email: '',
    qualification: '',
    password: 'judge' + Math.floor(1000 + Math.random() * 9000)
  });

  // Assign Programme Form State
  const [assignForm, setAssignForm] = useState({
    competitionId: 'COMP-LIT-01',
    judgeIds: [],
    instructions: 'Grade strictly based on the official rubric. Maintain absolute confidentiality.'
  });

  // Refresh helper
  const refreshState = () => {
    setStoreData({ ...festivalStore.loadData() });
  };

  const showToast = (message) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // KPI Metrics
  const stats = useMemo(() => {
    return festivalStore.getJudgeStats();
  }, [storeData]);

  // Filtered Judges
  const filteredJudges = useMemo(() => {
    return (storeData.judges || []).filter(j => {
      const matchSearch =
        j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.designation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [storeData.judges, searchQuery, statusFilter]);

  // Handle Add Judge
  const handleAddJudgeSubmit = (e) => {
    e.preventDefault();
    if (!newJudgeForm.name || !newJudgeForm.email) {
      alert('Please provide judge name and email.');
      return;
    }
    try {
      const res = festivalStore.addJudge(newJudgeForm);
      refreshState();
      setIsAddJudgeModalOpen(false);
      setNewJudgeForm({
        name: '',
        designation: '',
        institution: '',
        phone: '',
        email: '',
        qualification: '',
        password: 'judge' + Math.floor(1000 + Math.random() * 9000)
      });
      showToast(`Judge ${res.judge.name} (${res.judge.id}) added with active credentials!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle Judge Status
  const handleToggleStatus = (judgeId) => {
    try {
      const res = festivalStore.toggleJudgeStatus(judgeId);
      refreshState();
      showToast(`Judge ${res.judge.name} status updated to ${res.judge.status}.`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Reset Credentials
  const handleResetCredentials = (judgeId) => {
    try {
      const res = festivalStore.resetJudgeCredentials(judgeId);
      refreshState();
      showToast(`Credentials reset successfully! Invitation token: ${res.token}`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Programme Assignment
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (assignForm.judgeIds.length === 0) {
      alert('Please select at least one judge for the adjudication panel.');
      return;
    }
    try {
      festivalStore.assignJudgesToProgramme({
        competitionId: assignForm.competitionId,
        judgeIds: assignForm.judgeIds,
        instructions: assignForm.instructions
      });
      refreshState();
      setIsAssignModalOpen(false);
      showToast(`Programme successfully assigned to ${assignForm.judgeIds.length} judges!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Request Correction
  const handleRequestCorrectionSubmit = () => {
    if (!correctionReason.trim()) {
      alert('Please specify the reason for mark sheet correction.');
      return;
    }
    try {
      festivalStore.requestCorrection(correctionModalItem.id, correctionReason);
      refreshState();
      setCorrectionModalItem(null);
      setCorrectionReason('');
      showToast('Correction request sent to Judge with audit trail logged.');
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Official Result Verification & Publication
  const handleVerifyAndPublish = (competitionId) => {
    if (window.confirm('Verify all judge marks and publish official results to Public Leaderboard & generate Award Poster?')) {
      try {
        const res = festivalStore.verifyAndPublishResult(competitionId);
        refreshState();
        showToast(`Official results & poster for ${res.assignment.competitionTitle} PUBLISHED!`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* TOP HEADER & SECTION SUB-NAVBAR (Section 14)                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#E6A916]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#A91F35] text-white flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6 text-[#E6A916]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#A91F35] font-serif tracking-tight">
                  Judge Management Control Centre
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6A916]/20 text-[#A91F35] border border-[#E6A916]/40 uppercase tracking-wider">
                  Admin Authorized
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Centralized adjudication governance, live mark-sheet cross tabulation & automated publication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="#judge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F7F3E9] text-[#A91F35] hover:bg-[#E6A916]/20 transition-all border border-[#A91F35]/20 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Open Judge Portal</span>
            </a>

            <button
              onClick={() => setIsAddJudgeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#E6A916]" />
              <span>Add New Judge</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar matching Section 14 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 scrollbar-none text-xs">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Shield },
            { id: 'judges', label: 'Judge List', count: storeData.judges.length, icon: Users },
            { id: 'assignments', label: 'Programme Assignments', count: storeData.programmeAssignments.length, icon: Calendar },
            { id: 'monitoring', label: 'Evaluation Monitoring', icon: Clock },
            { id: 'marks', label: 'Submitted Marks', count: storeData.submittedEvaluations.length, icon: FileText },
            { id: 'verification', label: 'Result Verification', icon: CheckCircle },
            { id: 'posters', label: 'Result Posters', count: storeData.resultPosters.length, icon: Award },
            { id: 'reports', label: 'Judge Reports', icon: Printer }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-[#F7F3E9] hover:text-[#A91F35]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6A916]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-[#E6A916] text-[#A91F35]' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

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

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: JUDGE MANAGEMENT DASHBOARD (Section 2)                        */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {[
              { label: 'Total Judges', value: stats.totalJudges, color: '#A91F35', icon: Users, sub: 'Registered' },
              { label: 'Active Judges', value: stats.activeJudges, color: '#047857', icon: CheckCircle, sub: 'Ready to evaluate' },
              { label: 'Assigned Programmes', value: stats.assignedProgrammes, color: '#b45309', icon: Calendar, sub: 'Across 4 stages' },
              { label: 'Pending Evaluations', value: stats.pendingEvaluations, color: '#e11d48', icon: Clock, sub: 'Action required' },
              { label: 'Submitted Results', value: stats.submittedResults, color: '#7c3aed', icon: FileText, sub: 'Logged sheets' },
              { label: 'Completed & Published', value: stats.completedEvaluations, color: '#E6A916', icon: Award, sub: 'Public verified' }
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/80 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">{kpi.label}</span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: kpi.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-stone-900 tracking-tight font-serif">{kpi.value}</div>
                  <div className="text-[10px] text-stone-400 font-medium mt-1">{kpi.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Banner & Adjudication Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Activity & Performance Summary */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#A91F35] font-serif">Judge Performance & Evaluation Overview</h3>
                  <p className="text-xs text-stone-500">Live progress across official academic adjudication panels</p>
                </div>
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className="text-xs font-bold text-[#A91F35] hover:text-[#E6A916] flex items-center gap-1"
                >
                  <span>Detailed Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3.5">
                {storeData.programmeAssignments.map((prog) => {
                  const evalsCount = storeData.submittedEvaluations.filter(e => e.competitionId === prog.competitionId).length;
                  const totalAssigned = prog.assignedJudgeIds.length;
                  const pct = totalAssigned > 0 ? Math.round((evalsCount / totalAssigned) * 100) : 0;
                  return (
                    <div
                      key={prog.id}
                      className="p-3.5 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200 hover:border-[#E6A916] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-stone-900">{prog.competitionTitle}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#A91F35] border border-stone-200">
                            {prog.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              prog.isPublished
                                ? 'bg-emerald-100 text-emerald-800'
                                : prog.status === 'Under Verification'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {prog.isPublished ? 'Published' : prog.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <span>{prog.venue}</span>
                          <span>•</span>
                          <span>{prog.totalParticipants} Participants</span>
                          <span>•</span>
                          <span>{totalAssigned} Judges Assigned</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-bold text-stone-600 mb-1">
                            <span>Sheets: {evalsCount}/{totalAssigned}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className="h-full bg-[#A91F35] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (prog.isPublished) {
                              const poster = storeData.resultPosters.find(p => p.competitionId === prog.competitionId);
                              if (poster) setPreviewPosterItem(poster);
                              else setActiveTab('posters');
                            } else {
                              setActiveTab('verification');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            prog.isPublished
                              ? 'bg-[#E6A916] text-[#A91F35] hover:bg-[#d4970f]'
                              : 'bg-[#A91F35] text-white hover:bg-[#8B1A2C]'
                          }`}
                        >
                          {prog.isPublished ? 'View Poster' : 'Review'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Recent Submissions */}
            <div className="space-y-4">
              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-[#A91F35] to-[#7f1425] rounded-3xl p-5 text-white shadow-md">
                <h4 className="text-sm font-bold font-serif mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E6A916]" />
                  <span>Adjudication Hub Actions</span>
                </h4>
                <p className="text-xs text-white/80 mb-4">
                  Direct administrative overrides and allocation triggers.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsAssignModalOpen(true);
                      setAssignForm({
                        competitionId: 'COMP-SPK-02',
                        judgeIds: [],
                        instructions: 'Adjudicate with objectivity and integrity.'
                      });
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold flex items-center justify-between"
                  >
                    <span>Assign Adjudication Panel</span>
                    <Plus className="w-4 h-4 text-[#E6A916]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('marks')}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold flex items-center justify-between"
                  >
                    <span>Inspect Raw Evaluation Sheets</span>
                    <FileText className="w-4 h-4 text-[#E6A916]" />
                  </button>

                  <button
                    onClick={() => setActiveTab('verification')}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold flex items-center justify-between"
                  >
                    <span>Verify & Publish Calculated Ranks</span>
                    <CheckCheck className="w-4 h-4 text-[#E6A916]" />
                  </button>
                </div>
              </div>

              {/* Recent Audit Actions */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Adjudication Audit Trail
                </h4>
                <div className="space-y-2.5">
                  {storeData.auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="text-[11px] pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-stone-400 font-medium mb-0.5">
                        <span className="font-bold text-[#A91F35]">{log.action}</span>
                        <span>{log.timestamp.slice(-5)}</span>
                      </div>
                      <p className="text-stone-700 font-medium">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: JUDGE ACCOUNT MANAGEMENT (Section 3)                          */}
      {/* ========================================================================= */}
      {activeTab === 'judges' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
          {/* Controls: Search, Filter, Add */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search judge by name, ID, qualification or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#A91F35] bg-[#F7F3E9]/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#F7F3E9] p-1 rounded-xl text-xs font-bold text-stone-600">
                {['All', 'Active', 'Inactive'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      statusFilter === st ? 'bg-[#A91F35] text-white shadow-xs' : 'hover:text-[#A91F35]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddJudgeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Add Judge</span>
              </button>
            </div>
          </div>

          {/* Judges Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E9] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Judge ID & Name</th>
                  <th className="py-3 px-4">Academic Designation & Institution</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4 text-center">Assigned</th>
                  <th className="py-3 px-4 text-center">Evaluation Status</th>
                  <th className="py-3 px-4 text-center">Account</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredJudges.map((judge) => {
                  const assignedCount = judge.assignedCompIds ? judge.assignedCompIds.length : 0;
                  const submittedCount = judge.submittedCompIds ? judge.submittedCompIds.length : 0;
                  return (
                    <tr key={judge.id} className="hover:bg-[#F7F3E9]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs"
                            style={{ backgroundColor: judge.avatarColor || '#A91F35' }}
                          >
                            {judge.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900">{judge.name}</div>
                            <div className="text-[10px] font-mono font-bold text-[#A91F35]">{judge.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800">{judge.designation}</div>
                        <div className="text-[11px] text-stone-500">{judge.institution}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px] text-stone-800">{judge.phone}</div>
                        <div className="text-[10px] text-stone-500">{judge.email}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E6A916]/20 text-[#A91F35] border border-[#E6A916]/40">
                          {assignedCount} Progs
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            judge.evaluationStatus === 'Completed' || judge.evaluationStatus === 'Submitted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : judge.evaluationStatus === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {judge.evaluationStatus || 'Not Started'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(judge.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            judge.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {judge.status === 'Active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedJudgeProfile(judge)}
                            title="View Judge Profile"
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-[#F7F3E9] hover:text-[#A91F35] transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleResetCredentials(judge.id)}
                            title="Reset Credentials & Send Token"
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-[#F7F3E9] hover:text-[#E6A916] transition-all"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('assignments');
                              setAssignForm({
                                competitionId: 'COMP-LIT-01',
                                judgeIds: [judge.id],
                                instructions: 'Standard adjudication protocol.'
                              });
                              setIsAssignModalOpen(true);
                            }}
                            title="Assign Programme"
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-[#F7F3E9] hover:text-[#A91F35] transition-all"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: PROGRAMME ASSIGNMENT SYSTEM (Section 4)                       */}
      {/* ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
          {/* View Mode Switcher: Judge-wise vs Programme-wise */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#A91F35] font-serif">Programme & Adjudicator Assignments</h3>
              <p className="text-xs text-stone-500">Configure multi-judge evaluation panels, rubrics and maximum scores</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F7F3E9] p-1 rounded-xl text-xs font-bold text-stone-600">
                <button
                  onClick={() => setAssignmentViewMode('programme-wise')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    assignmentViewMode === 'programme-wise' ? 'bg-[#A91F35] text-white shadow-xs' : 'hover:text-[#A91F35]'
                  }`}
                >
                  Programme-wise View
                </button>
                <button
                  onClick={() => setAssignmentViewMode('judge-wise')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    assignmentViewMode === 'judge-wise' ? 'bg-[#A91F35] text-white shadow-xs' : 'hover:text-[#A91F35]'
                  }`}
                >
                  Judge-wise View
                </button>
              </div>

              <button
                onClick={() => {
                  setAssignForm({
                    competitionId: 'COMP-SPK-02',
                    judgeIds: [],
                    instructions: 'Evaluate speech delivery, tone modulation, rhetorical strength and time discipline.'
                  });
                  setIsAssignModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Assign Panel</span>
              </button>
            </div>
          </div>

          {/* 1. Programme-wise Assignment View */}
          {assignmentViewMode === 'programme-wise' && (
            <div className="space-y-4">
              {storeData.programmeAssignments.map((asg) => {
                const assignedJudges = storeData.judges.filter(j => asg.assignedJudgeIds.includes(j.id));
                const submittedEvals = storeData.submittedEvaluations.filter(e => e.competitionId === asg.competitionId);

                return (
                  <div
                    key={asg.id}
                    className="p-5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 hover:border-[#E6A916]/80 transition-all space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#A91F35]">{asg.competitionCode}</span>
                          <h4 className="font-bold text-sm text-stone-900">{asg.competitionTitle}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E6A916]/20 text-[#A91F35] border border-[#E6A916]/40">
                            {asg.category}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-1 flex items-center gap-3">
                          <span>Venue: <strong>{asg.venue}</strong></span>
                          <span>•</span>
                          <span>Schedule: <strong>{asg.date}, {asg.time}</strong></span>
                          <span>•</span>
                          <span>Participants: <strong>{asg.totalParticipants} Candidates</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedAssignmentForModal(asg);
                            setAssignForm({
                              competitionId: asg.competitionId,
                              judgeIds: asg.assignedJudgeIds,
                              instructions: asg.instructions
                            });
                            setIsAssignModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3 h-3 text-stone-500" />
                          <span>Edit Panel</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('verification');
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] flex items-center gap-1.5"
                        >
                          <CheckCheck className="w-3 h-3 text-[#E6A916]" />
                          <span>Verify Marks</span>
                        </button>
                      </div>
                    </div>

                    {/* Assigned Judges List */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Assigned Adjudication Panel ({assignedJudges.length} Judges)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {assignedJudges.map((judge) => {
                          const hasSubmitted = submittedEvals.some(e => e.judgeId === judge.id);
                          return (
                            <div
                              key={judge.id}
                              className="p-3 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div
                                  className="w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: judge.avatarColor || '#A91F35' }}
                                >
                                  {judge.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="truncate">
                                  <div className="font-bold text-xs text-stone-900 truncate">{judge.name}</div>
                                  <div className="text-[10px] text-stone-500 truncate">{judge.institution}</div>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                                  hasSubmitted
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {hasSubmitted ? 'Submitted' : 'Pending'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Criteria Rubric */}
                    <div className="bg-white/80 p-3 rounded-xl border border-stone-200/80">
                      <div className="text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                        <span>Evaluation Rubric & Maximum Marks:</span>
                        <span className="font-mono text-[#A91F35]">Total: {asg.totalMaxMarks} Marks</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {asg.evaluationCriteria.map((cr) => (
                          <span
                            key={cr.id}
                            className="px-2.5 py-1 rounded-lg bg-[#F7F3E9] text-stone-800 text-[11px] font-medium border border-stone-200"
                          >
                            <strong>{cr.name}:</strong> {cr.maxMarks} pts
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Judge-wise Assignment View */}
          {assignmentViewMode === 'judge-wise' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storeData.judges.map((judge) => {
                const assignedProgs = storeData.programmeAssignments.filter(a =>
                  a.assignedJudgeIds.includes(judge.id)
                );
                return (
                  <div
                    key={judge.id}
                    className="p-4 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 hover:border-[#A91F35]/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl text-white font-bold text-xs flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: judge.avatarColor || '#A91F35' }}
                        >
                          {judge.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-stone-900">{judge.name}</h4>
                          <p className="text-[10px] text-stone-500">{judge.designation}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A91F35] text-white">
                        {assignedProgs.length} Programmes
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {assignedProgs.length === 0 ? (
                        <div className="text-xs text-stone-400 italic py-2">No programmes currently assigned.</div>
                      ) : (
                        assignedProgs.map((prog) => {
                          const hasSubmitted = storeData.submittedEvaluations.some(
                            e => e.competitionId === prog.competitionId && e.judgeId === judge.id
                          );
                          return (
                            <div
                              key={prog.id}
                              className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs flex items-center justify-between"
                            >
                              <div className="truncate pr-2">
                                <div className="font-bold text-stone-800 truncate">{prog.competitionTitle}</div>
                                <div className="text-[10px] text-stone-500">{prog.date} • {prog.venue}</div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  hasSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {hasSubmitted ? 'Submitted' : 'Pending'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: EVALUATION MONITORING (Section 5)                              */}
      {/* ========================================================================= */}
      {activeTab === 'monitoring' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#A91F35] font-serif">Live Adjudication Status & Completion Tracker</h3>
            <p className="text-xs text-stone-500">Real-time inspection of score entry progress across all festival stages</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E9] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Programme / Competition</th>
                  <th className="py-3 px-4">Panel Assigned</th>
                  <th className="py-3 px-4 text-center">Participants</th>
                  <th className="py-3 px-4 text-center">Sheets Submitted</th>
                  <th className="py-3 px-4">Completion Bar</th>
                  <th className="py-3 px-4 text-center">Current Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {storeData.programmeAssignments.map((prog) => {
                  const evalsCount = storeData.submittedEvaluations.filter(e => e.competitionId === prog.competitionId).length;
                  const totalAssigned = prog.assignedJudgeIds.length;
                  const pct = totalAssigned > 0 ? Math.round((evalsCount / totalAssigned) * 100) : 0;
                  const missingJudges = storeData.judges.filter(
                    j => prog.assignedJudgeIds.includes(j.id) &&
                    !storeData.submittedEvaluations.some(e => e.competitionId === prog.competitionId && e.judgeId === j.id)
                  );

                  return (
                    <tr key={prog.id} className="hover:bg-[#F7F3E9]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{prog.competitionTitle}</div>
                        <div className="text-[10px] text-stone-500">{prog.venue} • {prog.date}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {prog.assignedJudgeIds.map((jId) => {
                            const j = storeData.judges.find(item => item.id === jId);
                            if (!j) return null;
                            return (
                              <div
                                key={jId}
                                title={j.name}
                                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
                                style={{ backgroundColor: j.avatarColor || '#A91F35' }}
                              >
                                {j.name.slice(0, 1)}
                              </div>
                            );
                          })}
                        </div>
                        {missingJudges.length > 0 && (
                          <div className="text-[10px] text-rose-600 font-medium mt-1">
                            Pending: {missingJudges.map(m => m.name.split(' ')[0]).join(', ')}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-stone-800">
                        {prog.totalParticipants}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-[#A91F35]">
                        {evalsCount} / {totalAssigned}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-36">
                          <div className="flex justify-between text-[10px] font-bold text-stone-600 mb-1">
                            <span>{pct}% Completed</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className="h-full bg-[#A91F35] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            prog.isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : prog.status === 'Under Verification'
                              ? 'bg-amber-100 text-amber-800'
                              : prog.status === 'Submitted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prog.isPublished ? 'Published' : prog.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (prog.isPublished) {
                              const poster = storeData.resultPosters.find(p => p.competitionId === prog.competitionId);
                              if (poster) setPreviewPosterItem(poster);
                              else setActiveTab('posters');
                            } else {
                              setActiveTab('verification');
                            }
                          }}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all"
                        >
                          {prog.isPublished ? 'Poster' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: SUBMITTED MARKS MANAGEMENT (Section 6)                        */}
      {/* ========================================================================= */}
      {activeTab === 'marks' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#A91F35] font-serif">Submitted Evaluation Sheets & Scores</h3>
              <p className="text-xs text-stone-500">Cross-tabulated individual judge marks, remarks and discrepancy review</p>
            </div>
            <div className="text-xs font-bold text-[#A91F35] bg-[#F7F3E9] px-3.5 py-1.5 rounded-xl border border-[#A91F35]/20">
              Total Sheets Logged: {storeData.submittedEvaluations.length}
            </div>
          </div>

          <div className="space-y-4">
            {storeData.submittedEvaluations.map((ev) => {
              const comp = storeData.programmeAssignments.find(a => a.competitionId === ev.competitionId);
              return (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#A91F35] text-white text-xs font-bold flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#E6A916]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-900">{ev.judgeName}</span>
                          <span className="text-[10px] font-mono text-stone-500">({ev.judgeId})</span>
                        </div>
                        <div className="text-[11px] text-[#A91F35] font-bold">
                          {comp ? comp.competitionTitle : ev.competitionId}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 font-medium">Submitted: {ev.submittedAt}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          ev.status === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ev.status === 'Correction Requested'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ev.status}
                      </span>
                      <button
                        onClick={() => {
                          setCorrectionModalItem(ev);
                          setCorrectionReason('');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                      >
                        Request Correction
                      </button>
                    </div>
                  </div>

                  {/* Candidate Scores Breakdown */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-xl border border-stone-200">
                      <thead className="bg-stone-50 text-stone-600 text-[10px] font-bold uppercase border-b border-stone-200">
                        <tr>
                          <th className="py-2 px-3">Chest No</th>
                          <th className="py-2 px-3">Student Name</th>
                          <th className="py-2 px-3">Team</th>
                          <th className="py-2 px-3 text-center">Criteria Breakdown</th>
                          <th className="py-2 px-3 text-center">Total Score</th>
                          <th className="py-2 px-3">Judge Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-800">
                        {ev.scores.map((sc, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#A91F35]">{sc.chestNo}</td>
                            <td className="py-2.5 px-3 font-bold">{sc.name}</td>
                            <td className="py-2.5 px-3 text-[11px] text-stone-600">{sc.teamName}</td>
                            <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                              {sc.criteriaMarks ? (
                                <span className="text-stone-600">
                                  {Object.entries(sc.criteriaMarks).map(([k, v]) => `${k.toUpperCase()}:${v}`).join(' | ')}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-black text-xs text-[#A91F35]">
                              {sc.total} / 100
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-stone-600 italic">
                              "{sc.remarks || 'No remarks entered'}"
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 6: RESULT VERIFICATION & PUBLISHING (Sections 7 & 8)             */}
      {/* ========================================================================= */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="text-base font-bold text-[#A91F35] font-serif">Automated Result Calculation & Official Publishing</h3>
            <p className="text-xs text-stone-500">Cross-tabulate judge evaluations, verify ranks, resolve ties, and publish with 1 click</p>
          </div>

          <div className="space-y-6">
            {storeData.programmeAssignments.map((prog) => {
              const agg = festivalStore.calculateAggregatedResults(prog.competitionId);
              if (!agg) {
                return (
                  <div key={prog.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500 flex items-center justify-between">
                    <span><strong>{prog.competitionTitle}</strong>: Awaiting submitted mark sheets from assigned judges.</span>
                    <span className="text-stone-400">0 sheets submitted</span>
                  </div>
                );
              }

              return (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#A91F35]">{prog.competitionCode}</span>
                        <h4 className="font-bold text-sm text-stone-900">{prog.competitionTitle}</h4>
                        {prog.isPublished && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Officially Published
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Evaluations Received: <strong>{agg.judgesSubmitted} of {agg.totalJudgesAssigned} Judges</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifyAndPublish(prog.competitionId)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                          prog.isPublished
                            ? 'bg-[#E6A916] text-[#A91F35] hover:bg-[#d4970f]'
                            : 'bg-[#A91F35] text-white hover:bg-[#8B1A2C] active:scale-95'
                        }`}
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{prog.isPublished ? 'Re-publish & Update Leaderboard' : 'Verify & Publish Official Results'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Calculated Ranks Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-xl border border-stone-200">
                      <thead className="bg-[#A91F35] text-white text-[10px] font-bold uppercase">
                        <tr>
                          <th className="py-2.5 px-3 text-center">Rank</th>
                          <th className="py-2.5 px-3">Chest No</th>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Team</th>
                          <th className="py-2.5 px-3 text-center">Judge Scores Breakdown</th>
                          <th className="py-2.5 px-3 text-center">Average Score</th>
                          <th className="py-2.5 px-3 text-center">Team Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-800">
                        {agg.rankedParticipants.map((p) => {
                          const isTop = p.rank <= 3;
                          return (
                            <tr
                              key={p.studentId}
                              className={p.rank === 1 ? 'bg-amber-50/60 font-semibold' : ''}
                            >
                              <td className="py-3 px-3 text-center">
                                <span
                                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                                    p.rank === 1
                                      ? 'bg-[#E6A916] text-[#A91F35]'
                                      : p.rank === 2
                                      ? 'bg-stone-300 text-stone-800'
                                      : p.rank === 3
                                      ? 'bg-amber-700 text-white'
                                      : 'text-stone-500'
                                  }`}
                                >
                                  {p.rank}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-[#A91F35]">{p.chestNo}</td>
                              <td className="py-3 px-3 font-bold text-stone-900">{p.name}</td>
                              <td className="py-3 px-3 text-stone-600">{p.teamName}</td>
                              <td className="py-3 px-3 text-center font-mono text-[11px] text-stone-600">
                                {p.judgeScores.map(js => js.total).join(' + ')} = {p.totalSum}
                              </td>
                              <td className="py-3 px-3 text-center font-black text-xs text-[#A91F35]">
                                {p.averageScore} / 100
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-emerald-700">
                                {p.pointsAwarded > 0 ? `+${p.pointsAwarded} pts` : '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 7: RESULT POSTERS MANAGEMENT (Section 9)                         */}
      {/* ========================================================================= */}
      {activeTab === 'posters' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#A91F35] font-serif">Official Competition Result Posters</h3>
              <p className="text-xs text-stone-500">
                Editorial celebration posters featuring official Dalenzia branding & published laurels
              </p>
            </div>
            <div className="text-xs text-stone-500">
              {storeData.resultPosters.length} Posters Generated
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeData.resultPosters.map((poster) => (
              <div
                key={poster.id}
                className="bg-gradient-to-b from-[#A91F35] to-[#731221] rounded-3xl p-5 text-white shadow-lg border border-[#E6A916]/40 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Header Branding */}
                <div className="text-center border-b border-white/10 pb-4 mb-4">
                  <div className="text-[10px] tracking-widest uppercase font-bold text-[#E6A916]">
                    DALENZIA FEST 2K26 • NUEVA ERA
                  </div>
                  <h4 className="text-base font-black font-serif tracking-tight mt-1">
                    {poster.competitionTitle}
                  </h4>
                  <div className="text-[10px] text-white/70 mt-0.5">{poster.category} • {poster.date}</div>
                </div>

                {/* 1st, 2nd, 3rd Prize Showcase */}
                <div className="space-y-2.5 my-2">
                  {/* 1st Prize */}
                  {poster.firstPrize && (
                    <div className="p-3 rounded-2xl bg-white/10 border border-[#E6A916]/50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-black text-xs shadow-xs">
                          1
                        </span>
                        <div>
                          <div className="font-black text-xs text-white">{poster.firstPrize.name}</div>
                          <div className="text-[10px] text-white/80">{poster.firstPrize.teamName} ({poster.firstPrize.chestNo})</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-[#E6A916]">
                        {poster.firstPrize.score}
                      </span>
                    </div>
                  )}

                  {/* 2nd Prize */}
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
                      <span className="font-mono text-[11px] text-[#E6A916]/90">
                        {poster.secondPrize.score}
                      </span>
                    </div>
                  )}

                  {/* 3rd Prize */}
                  {poster.thirdPrize && (
                    <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-[10px]">
                          3
                        </span>
                        <div>
                          <div className="font-bold text-white text-[11px]">{poster.thirdPrize.name}</div>
                          <div className="text-[9px] text-white/70">{poster.thirdPrize.teamName}</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[#E6A916]/90">
                        {poster.thirdPrize.score}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-3">
                  <span className="text-[10px] text-white/60">Verified by Secretariat</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewPosterItem(poster)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#A91F35] hover:bg-stone-100 flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
                      title="Download / Print"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 8: JUDGE REPORTS & ANALYTICS (Section 11)                         */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#A91F35] font-serif">Official Adjudication Reports & Analytics</h3>
              <p className="text-xs text-stone-500">Exportable evaluation audits, judge attendance and scoring summaries</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F7F3E9] text-[#A91F35] hover:bg-[#E6A916]/20 border border-[#A91F35]/20 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Print Report</span>
              </button>
              <button
                onClick={() => {
                  alert('Exported Adjudication Report to CSV format.');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E9] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Judge ID</th>
                  <th className="py-3 px-4">Judge Name</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4 text-center">Assigned Events</th>
                  <th className="py-3 px-4 text-center">Submitted Sheets</th>
                  <th className="py-3 px-4 text-center">Completion Rate</th>
                  <th className="py-3 px-4 text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {storeData.judges.map((j) => {
                  const assignedCount = j.assignedCompIds ? j.assignedCompIds.length : 0;
                  const submittedCount = j.submittedCompIds ? j.submittedCompIds.length : 0;
                  const rate = assignedCount > 0 ? Math.round((submittedCount / assignedCount) * 100) : 100;
                  return (
                    <tr key={j.id} className="hover:bg-[#F7F3E9]/40">
                      <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{j.id}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">{j.name}</td>
                      <td className="py-3 px-4 text-stone-600">{j.institution}</td>
                      <td className="py-3 px-4 text-center font-bold">{assignedCount}</td>
                      <td className="py-3 px-4 text-center font-bold text-[#A91F35]">{submittedCount}</td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${rate === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {rate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold text-stone-700">{j.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW JUDGE MODAL (Section 3)                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddJudgeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#A91F35] text-white flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#E6A916]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif">Add New Judge & Create Account</h3>
                    <p className="text-xs text-stone-500">Auto-generated ID & secure credential provisioning</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddJudgeModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddJudgeSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Full Name with Scholastic Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sayyid Munawwar Ali"
                    value={newJudgeForm.name}
                    onChange={(e) => setNewJudgeForm({ ...newJudgeForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Professor of Classical Arabic"
                      value={newJudgeForm.designation}
                      onChange={(e) => setNewJudgeForm({ ...newJudgeForm, designation: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Institution / Council</label>
                    <input
                      type="text"
                      placeholder="e.g. Calicut University"
                      value={newJudgeForm.institution}
                      onChange={(e) => setNewJudgeForm({ ...newJudgeForm, institution: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 94470 12345"
                      value={newJudgeForm.phone}
                      onChange={(e) => setNewJudgeForm({ ...newJudgeForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="judge@dalenziafest.in"
                      value={newJudgeForm.email}
                      onChange={(e) => setNewJudgeForm({ ...newJudgeForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Academic Qualifications / Sanad</label>
                  <input
                    type="text"
                    placeholder="e.g. Ph.D, Sanad in Tajweed, Al-Azhar Specialization"
                    value={newJudgeForm.qualification}
                    onChange={(e) => setNewJudgeForm({ ...newJudgeForm, qualification: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#F7F3E9] border border-[#E6A916]/40 text-stone-700">
                  <div className="text-[11px] font-bold text-[#A91F35] mb-0.5">Secure Login Provisioning</div>
                  <div className="text-[11px] text-stone-600">
                    A secure password invitation will be dispatched to <strong>{newJudgeForm.email || 'the provided email'}</strong> upon submission.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsAddJudgeModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] shadow-md"
                  >
                    Create Judge Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: ASSIGN PROGRAMME / PANEL MODAL (Section 4)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#A91F35] text-white flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#E6A916]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif">Assign Programme to Judges</h3>
                    <p className="text-xs text-stone-500">Multi-judge panel allocation & rubric configuration</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select Competition / Programme</label>
                  <select
                    value={assignForm.competitionId}
                    onChange={(e) => setAssignForm({ ...assignForm, competitionId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  >
                    {storeData.programmeAssignments.map((prog) => (
                      <option key={prog.competitionId} value={prog.competitionId}>
                        {prog.competitionTitle} ({prog.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Select Adjudication Panel (Check multiple judges)
                  </label>
                  <div className="max-h-44 overflow-y-auto border border-stone-200 rounded-xl p-2 space-y-1.5 bg-[#F7F3E9]/30">
                    {storeData.judges.filter(j => j.status === 'Active').map((judge) => {
                      const isSelected = assignForm.judgeIds.includes(judge.id);
                      return (
                        <label
                          key={judge.id}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                            isSelected ? 'bg-[#A91F35] text-white' : 'hover:bg-white text-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setAssignForm({
                                    ...assignForm,
                                    judgeIds: [...assignForm.judgeIds, judge.id]
                                  });
                                } else {
                                  setAssignForm({
                                    ...assignForm,
                                    judgeIds: assignForm.judgeIds.filter(id => id !== judge.id)
                                  });
                                }
                              }}
                              className="accent-[#E6A916]"
                            />
                            <span className="font-bold text-xs">{judge.name}</span>
                          </div>
                          <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>
                            {judge.id}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Adjudication Instructions</label>
                  <textarea
                    rows={2}
                    value={assignForm.instructions}
                    onChange={(e) => setAssignForm({ ...assignForm, instructions: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] shadow-md"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW JUDGE PROFILE MODAL (Section 3)                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedJudgeProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white text-base shadow-sm"
                    style={{ backgroundColor: selectedJudgeProfile.avatarColor || '#A91F35' }}
                  >
                    {selectedJudgeProfile.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif">{selectedJudgeProfile.name}</h3>
                    <div className="text-xs text-[#A91F35] font-mono font-bold">{selectedJudgeProfile.id}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJudgeProfile(null)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="p-3 rounded-xl bg-[#F7F3E9] border border-stone-200 space-y-1.5">
                  <div><strong>Designation:</strong> {selectedJudgeProfile.designation}</div>
                  <div><strong>Institution:</strong> {selectedJudgeProfile.institution}</div>
                  <div><strong>Qualifications:</strong> {selectedJudgeProfile.qualification}</div>
                  <div><strong>Phone:</strong> {selectedJudgeProfile.phone}</div>
                  <div><strong>Email:</strong> {selectedJudgeProfile.email}</div>
                  <div><strong>Account Status:</strong> <span className="font-bold text-emerald-700">{selectedJudgeProfile.status}</span></div>
                </div>

                <div className="text-[11px] text-stone-500">
                  Assigned to <strong>{selectedJudgeProfile.assignedCompIds ? selectedJudgeProfile.assignedCompIds.length : 0}</strong> programmes.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setSelectedJudgeProfile(null)}
                  className="px-4 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: REQUEST CORRECTION MODAL (Section 6)                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {correctionModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-stone-900 font-serif">Request Score Correction</h3>
                </div>
                <button
                  onClick={() => setCorrectionModalItem(null)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-stone-600">
                  Send an official correction request to <strong>{correctionModalItem.judgeName}</strong> ({correctionModalItem.judgeId}) for mark sheet <strong>{correctionModalItem.id}</strong>.
                </p>

                <textarea
                  rows={3}
                  placeholder="Specify the reason or discrepancy noticed (e.g., criteria sum discrepancy or missing chest number evaluation)..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCorrectionModalItem(null)}
                  className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRequestCorrectionSubmit}
                  className="px-4 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs"
                >
                  Dispatch Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: POSTER PREVIEW MODAL (Section 9)                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewPosterItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900 font-serif">Official Result Poster Preview</h3>
                <button
                  onClick={() => setPreviewPosterItem(null)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Render Poster */}
              <div className="bg-gradient-to-b from-[#A91F35] via-[#8B1A2C] to-[#5a0c1a] rounded-3xl p-6 text-white text-center shadow-xl border-4 border-[#E6A916]">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#E6A916] mb-1">
                  DALENZIA FEST 2K26 • OFFICIAL AWARD POSTER
                </div>
                <div className="text-xs text-white/80 mb-4 font-serif">NUEVA ERA — SECOND EDITION</div>

                <div className="bg-white/10 p-3 rounded-2xl mb-5">
                  <h2 className="text-lg font-black font-serif text-white tracking-tight">
                    {previewPosterItem.competitionTitle}
                  </h2>
                  <div className="text-xs text-[#E6A916] font-bold mt-0.5">
                    {previewPosterItem.category} • {previewPosterItem.venue}
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  {previewPosterItem.firstPrize && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#E6A916]/20 to-transparent border border-[#E6A916] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-sm flex items-center justify-center">
                          1st
                        </span>
                        <div>
                          <div className="font-black text-sm text-white">{previewPosterItem.firstPrize.name}</div>
                          <div className="text-xs text-[#E6A916] font-bold">{previewPosterItem.firstPrize.teamName} ({previewPosterItem.firstPrize.chestNo})</div>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-black text-[#E6A916]">
                        {previewPosterItem.firstPrize.score}
                      </span>
                    </div>
                  )}

                  {previewPosterItem.secondPrize && (
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-stone-300 text-stone-900 font-bold text-xs flex items-center justify-center">
                          2nd
                        </span>
                        <div>
                          <div className="font-bold text-xs text-white">{previewPosterItem.secondPrize.name}</div>
                          <div className="text-[11px] text-white/70">{previewPosterItem.secondPrize.teamName} ({previewPosterItem.secondPrize.chestNo})</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#E6A916]">
                        {previewPosterItem.secondPrize.score}
                      </span>
                    </div>
                  )}

                  {previewPosterItem.thirdPrize && (
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                          3rd
                        </span>
                        <div>
                          <div className="font-bold text-xs text-white">{previewPosterItem.thirdPrize.name}</div>
                          <div className="text-[11px] text-white/70">{previewPosterItem.thirdPrize.teamName} ({previewPosterItem.thirdPrize.chestNo})</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-[#E6A916]">
                        {previewPosterItem.thirdPrize.score}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-white/70 flex justify-between items-center">
                  <span>Dalailussunna Dars, Ayiroor</span>
                  <span className="text-[#E6A916] font-bold">Published: {previewPosterItem.publishedAt}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>Download / Print Poster</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
