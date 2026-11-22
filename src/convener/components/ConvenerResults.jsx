import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Users,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Eye,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  Lock,
  Unlock,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  Sliders,
  Sparkles,
  Info,
  Calendar,
  MapPin,
  X,
  History,
  Download,
  Printer,
  ChevronDown,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerResults() {
  // Store data
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());

  // Active sub-tab
  // 'assignments' | 'tracking' | 'submitted' | 'judgewise' | 'review' | 'approval' | 'publish' | 'history'
  const [activeTab, setActiveTab] = useState('assignments');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected competition for detailed inspection
  const [selectedCompId, setSelectedCompId] = useState('COMP-SPK-02');

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showAdminCorrectionModal, setShowAdminCorrectionModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showJudgeSheetModal, setShowJudgeSheetModal] = useState(false);

  // Modal payload data
  const [assignForm, setAssignForm] = useState({
    competitionId: '',
    selectedJudgeIds: [],
    instructions: ''
  });
  const [returnTarget, setReturnTarget] = useState({
    competitionId: '',
    judgeId: '',
    judgeName: '',
    competitionTitle: '',
    reason: ''
  });
  const [adminCorrectionForm, setAdminCorrectionForm] = useState({
    competitionId: '',
    studentId: '',
    studentName: '',
    chestNo: '',
    oldScore: 0,
    newScore: '',
    reason: ''
  });
  const [approvalOptions, setApprovalOptions] = useState({
    aggregationMode: 'average',
    tieBreakerRule: 'criteria_weight',
    notes: '',
    allowIncompleteException: false
  });
  const [inspectJudgeSheet, setInspectJudgeSheet] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Subscribe to festivalStore changes
  useEffect(() => {
    const unsubscribe = festivalStore.subscribe(() => {
      setStoreData({ ...festivalStore.data });
    });
    return () => unsubscribe();
  }, []);

  // Compute live KPI statistics
  const stats = useMemo(() => {
    return festivalStore.getConvenerResultStats();
  }, [storeData]);

  // All competitions from programmeAssignments
  const competitions = useMemo(() => {
    return storeData.programmeAssignments || [];
  }, [storeData]);

  // All judges
  const allJudges = useMemo(() => {
    return storeData.judges || [];
  }, [storeData]);

  // Tracking rows
  const trackingList = useMemo(() => {
    return festivalStore.getJudgeEvaluationTracking();
  }, [storeData]);

  // Selected competition details & judge-wise evaluations
  const selectedCompData = useMemo(() => {
    if (!selectedCompId) return null;
    return festivalStore.getJudgeWiseEvaluations(selectedCompId);
  }, [selectedCompId, storeData]);

  // Published history
  const publishedHistory = useMemo(() => {
    return festivalStore.getPublishedResultsHistory();
  }, [storeData]);

  // Filtered competitions list
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(c => {
      const matchSearch =
        (c.competitionTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.competitionCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && (c.isOfficialPublished || c.isPublished)) ||
        (statusFilter === 'approved' && (c.convenerApproved || c.status === 'Approved by Convener') && !c.isOfficialPublished) ||
        (statusFilter === 'under_review' && c.status === 'Under Verification') ||
        (statusFilter === 'assigned' && c.assignedJudgeIds?.length > 0 && c.status !== 'Approved');
      return matchSearch && matchCategory && matchStatus;
    });
  }, [competitions, searchQuery, categoryFilter, statusFilter]);

  // Filtered tracking list
  const filteredTracking = useMemo(() => {
    return trackingList.filter(t => {
      const matchSearch =
        t.competitionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.competitionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.judgeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status.toLowerCase().includes(statusFilter.toLowerCase());
      return matchSearch && matchStatus;
    });
  }, [trackingList, searchQuery, statusFilter]);

  // Category options
  const categories = useMemo(() => {
    const set = new Set(competitions.map(c => c.category).filter(Boolean));
    return Array.from(set);
  }, [competitions]);

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  const handleOpenAssignModal = (comp) => {
    setAssignForm({
      competitionId: comp.competitionId,
      selectedJudgeIds: comp.assignedJudgeIds ? [...comp.assignedJudgeIds] : [],
      instructions: comp.instructions || ''
    });
    setShowAssignModal(true);
  };

  const handleSaveAssignments = (e) => {
    e.preventDefault();
    if (assignForm.selectedJudgeIds.length === 0) {
      showToast('Please select at least one judge for the competition.', 'error');
      return;
    }
    try {
      festivalStore.convenerAssignJudgesToCompetition({
        competitionId: assignForm.competitionId,
        judgeIds: assignForm.selectedJudgeIds,
        instructions: assignForm.instructions,
        assignedBy: 'Usthad Hashir Ali (Convener)'
      });
      showToast(`Assigned ${assignForm.selectedJudgeIds.length} judges successfully.`);
      setShowAssignModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemoveJudge = (competitionId, judgeId) => {
    if (!window.confirm(`Are you sure you want to remove Judge ${judgeId} from this competition?`)) return;
    try {
      festivalStore.convenerRemoveJudgeAssignment(competitionId, judgeId);
      showToast(`Judge removed from competition assignment.`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenReturnModal = (row) => {
    setReturnTarget({
      competitionId: row.competitionId,
      judgeId: row.judgeId,
      judgeName: row.judgeName,
      competitionTitle: row.competitionTitle,
      reason: ''
    });
    setShowReturnModal(true);
  };

  const handleConfirmReturnForCorrection = (e) => {
    e.preventDefault();
    if (!returnTarget.reason.trim()) {
      showToast('A formal correction reason is required.', 'error');
      return;
    }
    try {
      festivalStore.convenerReturnEvaluationForCorrection(returnTarget.competitionId, returnTarget.judgeId, {
        reason: returnTarget.reason.trim(),
        returnedBy: 'Usthad Hashir Ali (Convener)'
      });
      showToast(`Evaluation returned to ${returnTarget.judgeName} for correction.`);
      setShowReturnModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenAdminCorrection = (participant, compId) => {
    setAdminCorrectionForm({
      competitionId: compId,
      studentId: participant.studentId,
      studentName: participant.name,
      chestNo: participant.chestNo,
      oldScore: participant.finalScore || participant.averageScore || 0,
      newScore: participant.finalScore || participant.averageScore || 0,
      reason: ''
    });
    setShowAdminCorrectionModal(true);
  };

  const handleSaveAdminCorrection = (e) => {
    e.preventDefault();
    if (!adminCorrectionForm.reason.trim()) {
      showToast('A formal reason is strictly required for administrative score correction.', 'error');
      return;
    }
    if (isNaN(parseFloat(adminCorrectionForm.newScore))) {
      showToast('New score must be a valid number.', 'error');
      return;
    }
    try {
      festivalStore.convenerAdministrativeScoreCorrection(adminCorrectionForm.competitionId, {
        studentId: adminCorrectionForm.studentId,
        oldScore: adminCorrectionForm.oldScore,
        newScore: parseFloat(adminCorrectionForm.newScore),
        reason: adminCorrectionForm.reason.trim(),
        actor: 'Usthad Hashir Ali (Convener)'
      });
      showToast(`Administrative score adjustment saved and logged.`);
      setShowAdminCorrectionModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenApproveModal = (compId) => {
    setSelectedCompId(compId);
    setApprovalOptions({
      aggregationMode: 'average',
      tieBreakerRule: 'criteria_weight',
      notes: '',
      allowIncompleteException: false
    });
    setShowApproveModal(true);
  };

  const handleConfirmApprove = (e) => {
    e.preventDefault();
    try {
      festivalStore.convenerApproveResult(selectedCompId, {
        convenerId: 'CNV-01',
        convenerName: 'Usthad Hashir Ali',
        notes: approvalOptions.notes,
        aggregationMode: approvalOptions.aggregationMode,
        tieBreakerRule: approvalOptions.tieBreakerRule,
        allowIncompleteException: approvalOptions.allowIncompleteException
      });
      showToast(`Final result approved by Convener! Ready for official publishing.`);
      setShowApproveModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenPublishModal = (compId) => {
    setSelectedCompId(compId);
    setShowPublishModal(true);
  };

  const handleConfirmPublish = () => {
    try {
      festivalStore.convenerPublishOfficialResult(selectedCompId, {
        convenerId: 'CNV-01',
        convenerName: 'Usthad Hashir Ali',
        templateStyle: 'editorial_crimson'
      });
      showToast(`OFFICIAL RESULT PUBLISHED! Leaderboard, student & team portals updated.`);
      setShowPublishModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleInspectJudge = (evalObj, compTitle) => {
    setInspectJudgeSheet({ ...evalObj, competitionTitle: compTitle });
    setShowJudgeSheetModal(true);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-white ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-[#A91F35] via-[#8e192c] to-[#6d1322] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6A916]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Convener Operational Control</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
              Result Management & Final Publishing
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl font-medium">
              End-to-End Operational Workflow: Judge Assignment → Evaluation Tracking → Judge-wise Review → Final Approval → Official Result Publishing
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('assignments')}
              className="px-4 py-2 rounded-2xl bg-white text-[#A91F35] hover:bg-[#FAF7F0] text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Judges</span>
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className="px-4 py-2 rounded-2xl bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-black transition-all shadow-md flex items-center gap-2"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Publish Official Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Comps</span>
            <Trophy className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-serif font-black text-stone-900">{stats.totalCompetitions}</div>
          <div className="text-[10px] text-stone-500 mt-1">All festival events</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">With Judges</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-serif font-black text-blue-900">{stats.competitionsWithJudges}</div>
          <div className="text-[10px] text-blue-600 mt-1">Jury panels mapped</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Evals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-serif font-black text-amber-900">{stats.pendingJudgeEvaluations}</div>
          <div className="text-[10px] text-amber-600 mt-1">Awaiting marksheet</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Submitted Evals</span>
            <CheckCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-serif font-black text-indigo-900">{stats.submittedJudgeEvaluations}</div>
          <div className="text-[10px] text-indigo-600 mt-1">Sheets submitted</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Awaiting Review</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-serif font-black text-purple-900">{stats.resultsAwaitingConvenerReview}</div>
          <div className="text-[10px] text-purple-600 mt-1">Ready for Convener</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-serif font-black text-emerald-900">{stats.resultsApprovedByConvener}</div>
          <div className="text-[10px] text-emerald-600 mt-1">Locked for publish</div>
        </div>

        <div className="p-4 rounded-2xl bg-linear-to-br from-[#A91F35] to-[#7f1525] text-white shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#E6A916] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Published</span>
            <Award className="w-4 h-4 text-[#E6A916]" />
          </div>
          <div className="text-2xl font-serif font-black text-white">{stats.publishedOfficialResults}</div>
          <div className="text-[10px] text-white/80 mt-1">Official on leaderboards</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'assignments', name: 'Judge Assignments', icon: Users, badge: stats.competitionsWithJudges },
          { id: 'tracking', name: 'Submission Tracking', icon: Clock, badge: stats.pendingJudgeEvaluations },
          { id: 'submitted', name: 'Submitted Results', icon: CheckCheck, badge: stats.submittedJudgeEvaluations },
          { id: 'judgewise', name: 'Judge-wise Evaluations', icon: Shield },
          { id: 'review', name: 'Result Review', icon: FileText, badge: stats.resultsAwaitingConvenerReview },
          { id: 'approval', name: 'Final Approval', icon: CheckCircle2, badge: stats.resultsApprovedByConvener },
          { id: 'publish', name: 'Official Publishing', icon: Award, highlight: true },
          { id: 'history', name: 'Published History', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#A91F35] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#A91F35] hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6A916]' : 'text-stone-400'}`} />
              <span>{tab.name}</span>
              {typeof tab.badge === 'number' && (
                <span
                  className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#E6A916] text-[#A91F35]' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 1. TAB: JUDGE ASSIGNMENTS                                             */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search competition, code or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Statuses</option>
                <option value="assigned">Assigned</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Competitions Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Competition</th>
                    <th className="py-3 px-4">Category / Stage</th>
                    <th className="py-3 px-4">Assigned Jury</th>
                    <th className="py-3 px-4">Criteria</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCompetitions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-stone-500 font-medium">
                        No competitions found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCompetitions.map(comp => {
                      const assignedJudges = (comp.assignedJudgeIds || []).map(id =>
                        allJudges.find(j => j.id === id) || { id, name: id }
                      );
                      const isPublished = comp.isOfficialPublished || comp.isPublished;
                      const isApproved = comp.convenerApproved || comp.status === 'Approved by Convener';

                      return (
                        <tr key={comp.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{comp.competitionTitle}</div>
                            <div className="text-[10px] text-stone-500 font-mono">ID: {comp.competitionId} | Code: {comp.competitionCode}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-stone-800">{comp.category}</div>
                            <div className="text-[10px] text-stone-500">{comp.venue}</div>
                          </td>
                          <td className="py-3 px-4">
                            {assignedJudges.length === 0 ? (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                                No Judges Assigned
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {assignedJudges.map(j => (
                                  <span
                                    key={j.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-semibold border border-stone-200"
                                  >
                                    <Shield className="w-2.5 h-2.5 text-[#A91F35]" />
                                    <span>{j.name}</span>
                                    {!isPublished && (
                                      <button
                                        onClick={() => handleRemoveJudge(comp.competitionId, j.id)}
                                        className="text-stone-400 hover:text-red-600 ml-0.5"
                                        title="Remove judge"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    )}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-stone-600">
                            {comp.criteria ? `${comp.criteria.length} criteria defined` : 'Default rubrics'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isPublished
                                  ? 'bg-purple-100 text-purple-900'
                                  : isApproved
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : comp.status === 'Submitted' || comp.status === 'Under Verification'
                                  ? 'bg-blue-100 text-blue-900'
                                  : comp.status === 'Correction Requested'
                                  ? 'bg-amber-100 text-amber-900'
                                  : comp.assignedJudgeIds?.length > 0
                                  ? 'bg-stone-100 text-stone-800'
                                  : 'bg-red-100 text-red-900'
                              }`}
                            >
                              {isPublished ? 'Published' : isApproved ? 'Convener Approved' : comp.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenAssignModal(comp)}
                                className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors"
                                title="Assign or modify judges"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCompId(comp.competitionId);
                                  setActiveTab('judgewise');
                                }}
                                className="px-2.5 py-1 rounded-xl bg-[#A91F35]/10 hover:bg-[#A91F35] text-[#A91F35] hover:text-white font-bold transition-colors"
                                title="Inspect evaluations"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. TAB: JUDGE SUBMISSION TRACKING                                     */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search competition, judge name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Submission Statuses</option>
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="awaiting approval">Awaiting Approval</option>
                <option value="approved">Approved</option>
                <option value="returned for correction">Returned for Correction</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Judge</th>
                    <th className="py-3 px-4">Assigned Competition</th>
                    <th className="py-3 px-4">Progress / Pending</th>
                    <th className="py-3 px-4">Submission Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredTracking.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-stone-500 font-medium">
                        No judge tracking records found.
                      </td>
                    </tr>
                  ) : (
                    filteredTracking.map((row, idx) => {
                      return (
                        <tr key={`${row.competitionId}-${row.judgeId}-${idx}`} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900 flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-[#A91F35]" />
                              <span>{row.judgeName}</span>
                            </div>
                            <div className="text-[10px] text-stone-500">{row.judgeEmail}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-stone-900">{row.competitionTitle}</div>
                            <div className="text-[10px] text-stone-500">{row.venue} | {row.competitionCode}</div>
                          </td>
                          <td className="py-3 px-4">
                            {row.pendingParticipantsCount > 0 ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                {row.pendingParticipantsCount} / {row.totalParticipants} Candidates Pending
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                All {row.totalParticipants} Candidates Evaluated
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                row.status === 'Approved'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : row.status === 'Submitted' || row.status === 'Awaiting Approval'
                                  ? 'bg-blue-100 text-blue-900'
                                  : row.status === 'Returned for Correction'
                                  ? 'bg-red-100 text-red-900'
                                  : row.status === 'In Progress'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {row.status}
                            </span>
                            {row.correctionReason && (
                              <div className="text-[9px] text-red-700 font-semibold mt-0.5 max-w-xs truncate" title={row.correctionReason}>
                                Reason: {row.correctionReason}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-stone-500 text-[11px]">
                            {row.submittedAt || '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {row.canReturn && !row.isOfficialPublished && (
                                <button
                                  onClick={() => handleOpenReturnModal(row)}
                                  className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-colors"
                                  title="Return marksheet to judge for correction"
                                >
                                  Return
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedCompId(row.competitionId);
                                  setActiveTab('judgewise');
                                }}
                                className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors"
                              >
                                Review
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 3. TAB: SUBMITTED RESULTS & EVALUATIONS                               */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'submitted' && (
        <div className="space-y-4">
          {competitions.filter(c => (storeData.submittedEvaluations || []).some(e => e.competitionId === c.competitionId || e.assignmentId === c.id)).length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
              <CheckCheck className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-700">No competition entries have been submitted yet.</p>
              <p className="text-stone-500">Submitted judge evaluation sheets will appear here for review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitions
                .filter(c => (storeData.submittedEvaluations || []).some(e => e.competitionId === c.competitionId || e.assignmentId === c.id))
                .map(comp => {
                  const evals = (storeData.submittedEvaluations || []).filter(e => e.competitionId === comp.competitionId || e.assignmentId === comp.id);
                  const isApproved = comp.status === 'APPROVED' || comp.convenerApproved || comp.adminApproved;

                  return (
                    <div
                      key={comp.id}
                      className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#A91F35] bg-[#A91F35]/10 px-2 py-0.5 rounded-full">
                            {comp.category} • {comp.type || 'Individual'}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isApproved
                              ? (comp.approvedByRole === 'ADMIN' ? 'Approved by Admin' : 'Approved by Convener')
                              : `${evals.length} Evaluation Sheet(s)`}
                          </span>
                        </div>

                        <h3 className="font-bold text-stone-900 text-sm leading-tight">
                          {comp.competitionTitle}
                        </h3>
                        <div className="text-xs text-stone-500">
                          Code: <strong className="font-mono text-[#A91F35]">{comp.competitionCode}</strong>
                        </div>

                        {/* Submitted judges list */}
                        <div className="pt-2 border-t border-stone-100 space-y-1">
                          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            Judge Submissions:
                          </div>
                          {evals.map(e => (
                            <div key={e.id} className="flex items-center justify-between text-xs py-0.5">
                              <span className="text-stone-800 font-semibold">{e.judgeName}</span>
                              <span className="text-[10px] text-stone-500 font-mono">{e.submittedAt ? new Date(e.submittedAt).toLocaleTimeString() : 'Submitted'}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedCompId(comp.competitionId);
                            setActiveTab('judgewise');
                          }}
                          className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect Judge Sheets</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCompId(comp.competitionId);
                            setActiveTab('review');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Consolidated Review
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 4. TAB: JUDGE-WISE EVALUATIONS                                        */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'judgewise' && selectedCompData && (
        <div className="space-y-5">
          {/* Competition Selector & Summary */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">Select Competition:</span>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                >
                  {competitions.map(c => (
                    <option key={c.id} value={c.competitionId}>
                      {c.competitionCode} — {c.competitionTitle}
                    </option>
                  ))}
                </select>
              </div>

              <h2 className="text-lg font-serif font-black text-stone-900">
                {selectedCompData.assignment.competitionTitle}
              </h2>
              <div className="text-xs text-stone-500 flex items-center gap-3">
                <span>Category: <strong>{selectedCompData.assignment.category}</strong></span>
                <span>•</span>
                <span>Venue: <strong>{selectedCompData.assignment.venue}</strong></span>
                <span>•</span>
                <span>Date: <strong>{selectedCompData.assignment.date}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('review')}
                className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
              >
                Go to Review Screen
              </button>
              <button
                onClick={() => handleOpenApproveModal(selectedCompId)}
                className="px-4 py-2 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold transition-colors"
              >
                Approve Final Result
              </button>
            </div>
          </div>

          {/* Missing Judges Alert */}
          {selectedCompData.missingJudges.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Pending Submissions:</strong> {selectedCompData.missingJudges.length} assigned judge(s) have not submitted evaluations yet: {selectedCompData.missingJudges.map(j => j.name).join(', ')}.
                </span>
              </div>
            </div>
          )}

          {/* Individual Judge Evaluation Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">
              Submitted Marksheets by Assigned Jury
            </h3>

            {selectedCompData.judgeEvaluations.length === 0 ? (
              <div className="p-8 text-center text-stone-500 bg-white rounded-3xl border border-stone-200 text-xs">
                No evaluations submitted yet for this competition.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCompData.judgeEvaluations.map(ev => {
                  return (
                    <div
                      key={ev.id}
                      className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#A91F35]" />
                            <span className="font-bold text-stone-900 text-xs">{ev.judgeName}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              ev.status === 'Correction Requested'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {ev.status}
                          </span>
                        </div>

                        <div className="text-[10px] text-stone-500 font-mono">
                          Submitted: {ev.submittedAt || '—'}
                        </div>

                        {/* Candidates Scores Preview */}
                        <div className="border border-stone-200 rounded-2xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-stone-50 text-[10px] font-bold text-stone-500 uppercase border-b border-stone-200">
                              <tr>
                                <th className="p-2">Chest No</th>
                                <th className="p-2">Candidate</th>
                                <th className="p-2 text-right">Marks (/100)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                              {(ev.scores || []).map(sc => (
                                <tr key={sc.studentId}>
                                  <td className="p-2 font-mono font-bold text-[#A91F35]">{sc.chestNo}</td>
                                  <td className="p-2 font-medium text-stone-800">{sc.studentName}</td>
                                  <td className="p-2 text-right font-bold text-stone-900">{sc.total}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {ev.remarks && (
                          <div className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200 italic">
                            "{ev.remarks}"
                          </div>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => handleInspectJudge(ev, selectedCompData.assignment.competitionTitle)}
                          className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detailed Criteria Breakdown</span>
                        </button>

                        {ev.status !== 'Correction Requested' && (
                          <button
                            onClick={() =>
                              handleOpenReturnModal({
                                competitionId: selectedCompId,
                                judgeId: ev.judgeId,
                                judgeName: ev.judgeName,
                                competitionTitle: selectedCompData.assignment.competitionTitle
                              })
                            }
                            className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                          >
                            Return for Correction
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 5. TAB: CONVENER RESULT REVIEW                                        */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'review' && selectedCompData && (
        <div className="space-y-5">
          {/* Header Controls */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">Reviewing:</span>
                <select
                  value={selectedCompId}
                  onChange={(e) => setSelectedCompId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                >
                  {competitions.map(c => (
                    <option key={c.id} value={c.competitionId}>
                      {c.competitionCode} — {c.competitionTitle}
                    </option>
                  ))}
                </select>
              </div>
              <h2 className="text-lg font-serif font-black text-stone-900">
                {selectedCompData.assignment.competitionTitle}
              </h2>
              <div className="text-xs text-stone-500">
                Status: <strong className="text-[#A91F35]">{selectedCompData.assignment.status}</strong> |
                Judges: {selectedCompData.assignedJudges.length} assigned ({selectedCompData.judgeEvaluations.length} submitted)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenApproveModal(selectedCompId)}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Final Result</span>
              </button>
            </div>
          </div>

          {/* Consolidated Tabulation Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Consolidated Tabulation & Ranking
              </h3>
              <span className="text-xs text-stone-500">
                Calculated using Official Aggregation Engine
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Chest No</th>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4">Judge Scores</th>
                    <th className="py-3 px-4">Final Average</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Points</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedCompData.aggregatedResult?.rankedParticipants.map((p, idx) => {
                    const isPodium = idx < 3;
                    return (
                      <tr
                        key={p.studentId}
                        className={`hover:bg-stone-50/60 transition-colors ${
                          idx === 0 ? 'bg-amber-50/30 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-xs ${
                              idx === 0
                                ? 'bg-[#E6A916] text-[#A91F35]'
                                : idx === 1
                                ? 'bg-stone-300 text-stone-800'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'text-stone-500'
                            }`}
                          >
                            {p.rank}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{p.chestNo}</td>
                        <td className="py-3 px-4 font-bold text-stone-900">{p.name}</td>
                        <td className="py-3 px-4 font-semibold text-stone-700">{p.teamName}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {p.judgeScores.map((js, jIdx) => (
                              <span
                                key={jIdx}
                                className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-mono"
                                title={`${js.judgeName}: ${js.total}`}
                              >
                                {js.total}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900 text-sm">
                          {p.averageScore} <span className="text-[10px] font-normal text-stone-500">/ 100</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold text-stone-800 text-[10px]">
                            {p.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-[#A91F35]">
                          {p.pointsAwarded > 0 ? `+${p.pointsAwarded} pts` : '0'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenAdminCorrection(p, selectedCompId)}
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold"
                            title="Authorized administrative correction"
                          >
                            Adjust
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 6. TAB: FINAL APPROVAL                                                */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'approval' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <h3 className="font-serif font-black text-stone-900 text-base mb-1">
              Competitions Awaiting Convener Approval
            </h3>
            <p className="text-xs text-stone-500">
              Review consolidated jury evaluations, verify completeness, and lock approved versions before publishing.
            </p>
          </div>

          <div className="space-y-4">
            {competitions.filter(c => (storeData.submittedEvaluations || []).some(e => e.competitionId === c.competitionId || e.assignmentId === c.id)).length === 0 ? (
              <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="font-bold text-stone-700">No judge evaluations are awaiting approval.</p>
                <p className="text-stone-500">Submitted evaluations will appear here for review and certification.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitions
                  .filter(c => (storeData.submittedEvaluations || []).some(e => e.competitionId === c.competitionId || e.assignmentId === c.id))
                  .map(comp => {
                    const isApproved = comp.status === 'APPROVED' || comp.convenerApproved || comp.adminApproved || comp.status === 'Approved by Convener' || comp.status === 'Approved by Admin';
                    const isApprovedByAdmin = comp.approvedByRole === 'ADMIN' || comp.adminApproved;
                    const isApprovedByConvener = comp.approvedByRole === 'CONVENER' || comp.convenerApproved;
                    const isPublished = comp.isOfficialPublished || comp.isPublished;

                    return (
                      <div
                        key={comp.id}
                        className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
                              {comp.category} • {comp.type || 'Individual'}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                isPublished
                                  ? 'bg-purple-100 text-purple-900'
                                  : isApproved
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {isPublished
                                ? 'Published'
                                : isApprovedByAdmin
                                ? 'Approved by Admin'
                                : isApprovedByConvener
                                ? 'Approved by Convener'
                                : 'Awaiting Approval'}
                            </span>
                          </div>

                          <h4 className="font-bold text-stone-900 text-sm">{comp.competitionTitle}</h4>
                          <div className="text-xs text-stone-500">
                            Code: <strong className="font-mono text-[#A91F35]">{comp.competitionCode}</strong>
                          </div>

                          {isApproved && (
                            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900 text-[11px] space-y-0.5">
                              <div><strong>Approved by:</strong> {comp.approvedByName || (isApprovedByAdmin ? 'Main Admin' : 'Usthad Hashir Ali')}</div>
                              <div><strong>Timestamp:</strong> {comp.approvedAt ? new Date(comp.approvedAt).toLocaleString() : 'Recent'}</div>
                              <div><strong>Role:</strong> {isApprovedByAdmin ? 'Admin Approval' : 'Convener Approval'}</div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedCompId(comp.competitionId);
                              setActiveTab('review');
                            }}
                            className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                          >
                            Inspect Tabulation
                          </button>

                          <div className="flex items-center gap-2">
                            {!isApproved && (
                              <>
                                <button
                                  onClick={() => handleOpenApproveModal(comp.competitionId)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                                >
                                  Approve Result
                                </button>
                                <button
                                  onClick={() => {
                                    setReturnTarget({
                                      competitionId: comp.competitionId,
                                      judgeId: comp.assignedJudgeIds?.[0] || 'JDG-1001',
                                      judgeName: 'Assigned Judge',
                                      competitionTitle: comp.competitionTitle,
                                      reason: ''
                                    });
                                    setShowReturnModal(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                                >
                                  Return
                                </button>
                              </>
                            )}
                            {isApproved && !isPublished && (
                              <button
                                onClick={() => handleOpenPublishModal(comp.competitionId)}
                                className="px-3 py-1.5 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                              >
                                Publish Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 7. TAB: OFFICIAL RESULT PUBLISHING                                    */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'publish' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-3xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Official Publishing Portal</span>
              </div>
              <p className="text-xs text-stone-600">
                Publishing is a distinct second-step action after Convener Approval. Publishing pushes official results to Leaderboard, Student Portal and Public Website.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitions.filter(c => c.convenerApproved || c.status === 'Approved by Convener' || c.isOfficialPublished || c.isPublished).length === 0 ? (
              <div className="col-span-full p-8 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
                No competitions currently approved and awaiting publishing. Go to the <strong>Final Approval</strong> tab to review and approve results first.
              </div>
            ) : (
              competitions
                .filter(c => c.convenerApproved || c.status === 'Approved by Convener' || c.isOfficialPublished || c.isPublished)
                .map(comp => {
                  const isPublished = comp.isOfficialPublished || comp.isPublished;

                  return (
                    <div
                      key={comp.id}
                      className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
                            {comp.category}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                              isPublished ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {isPublished ? 'Officially Published' : 'Approved — Ready for Publish'}
                          </span>
                        </div>

                        <h4 className="font-bold text-stone-900 text-sm">{comp.competitionTitle}</h4>
                        <div className="text-xs text-stone-500">{comp.venue} | {comp.date}</div>

                        {/* Podium Snapshot */}
                        {comp.convenerApproval?.podiumSnapshot && (
                          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
                            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Podium Winners:</div>
                            <div className="flex items-center justify-between font-semibold">
                              <span>🥇 1st: {comp.convenerApproval.podiumSnapshot.first?.name}</span>
                              <span className="font-mono text-[#A91F35]">{comp.convenerApproval.podiumSnapshot.first?.averageScore}</span>
                            </div>
                            <div className="flex items-center justify-between text-stone-600">
                              <span>🥈 2nd: {comp.convenerApproval.podiumSnapshot.second?.name}</span>
                              <span className="font-mono">{comp.convenerApproval.podiumSnapshot.second?.averageScore}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedCompId(comp.competitionId);
                            setActiveTab('review');
                          }}
                          className="text-xs font-bold text-stone-600 hover:text-stone-900"
                        >
                          Inspect Result
                        </button>

                        {isPublished ? (
                          <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenPublishModal(comp.competitionId)}
                            className="px-4 py-2 rounded-2xl bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Publish Official Result</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 8. TAB: PUBLISHED RESULTS HISTORY                                     */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Official Published Results History & Versions
              </h3>
              <span className="text-xs text-stone-500">
                Immutable audit ledger of official festival publications
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Competition</th>
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">First Prize</th>
                    <th className="py-3 px-4">Second Prize</th>
                    <th className="py-3 px-4">Third Prize</th>
                    <th className="py-3 px-4">Published By</th>
                    <th className="py-3 px-4">Published Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {publishedHistory.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-stone-500 font-medium">
                        No published history entries found.
                      </td>
                    </tr>
                  ) : (
                    publishedHistory.map(h => (
                      <tr key={h.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{h.competitionTitle}</div>
                          <div className="text-[10px] text-stone-500">{h.competitionCode}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">v{h.version}</td>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {h.podium?.first?.name || '—'}
                          <div className="text-[10px] text-stone-500">{h.podium?.first?.teamName}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-800">
                          {h.podium?.second?.name || '—'}
                          <div className="text-[10px] text-stone-500">{h.podium?.second?.teamName}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-800">
                          {h.podium?.third?.name || '—'}
                          <div className="text-[10px] text-stone-500">{h.podium?.third?.teamName}</div>
                        </td>
                        <td className="py-3 px-4 text-stone-700 font-medium">{h.publishedBy}</td>
                        <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                          {new Date(h.publishedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: ASSIGN JUDGES                                                */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-linear-to-r from-[#A91F35] to-[#7f1525] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Assign Jury to Competition</h3>
                  <p className="text-[11px] text-white/80">Select one or multiple judges for evaluation</p>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAssignments} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Competition</label>
                  <select
                    value={assignForm.competitionId}
                    onChange={(e) => setAssignForm({ ...assignForm, competitionId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {competitions.map(c => (
                      <option key={c.id} value={c.competitionId}>
                        {c.competitionCode} — {c.competitionTitle}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Select Judges (Multiple Allowed)</label>
                  <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-2xl p-2 space-y-1">
                    {allJudges.map(judge => {
                      const isSelected = assignForm.selectedJudgeIds.includes(judge.id);
                      return (
                        <label
                          key={judge.id}
                          className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#A91F35]/10 border border-[#A91F35]/30' : 'hover:bg-stone-50'
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
                                    selectedJudgeIds: [...assignForm.selectedJudgeIds, judge.id]
                                  });
                                } else {
                                  setAssignForm({
                                    ...assignForm,
                                    selectedJudgeIds: assignForm.selectedJudgeIds.filter(id => id !== judge.id)
                                  });
                                }
                              }}
                              className="rounded text-[#A91F35] focus:ring-[#A91F35]"
                            />
                            <div>
                              <div className="font-bold text-stone-900">{judge.name}</div>
                              <div className="text-[10px] text-stone-500">{judge.designation || 'Jury Member'}</div>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-stone-400">{judge.id}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Special Instructions for Jury (Optional)</label>
                  <textarea
                    rows="3"
                    value={assignForm.instructions}
                    onChange={(e) => setAssignForm({ ...assignForm, instructions: e.target.value })}
                    placeholder="Enter specific grading rubrics, guidelines or stage cues..."
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] text-white font-bold shadow-md transition-colors"
                  >
                    Save Assignments
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 2: RETURN EVALUATION FOR CORRECTION                             */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-amber-600 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Return Evaluation for Correction</h3>
                  <p className="text-[11px] text-white/90">Authorizes judge to amend marks and resubmit</p>
                </div>
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmReturnForCorrection} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <div><strong>Competition:</strong> {returnTarget.competitionTitle}</div>
                  <div><strong>Judge:</strong> {returnTarget.judgeName} ({returnTarget.judgeId})</div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Formal Correction Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={returnTarget.reason}
                    onChange={(e) => setReturnTarget({ ...returnTarget, reason: e.target.value })}
                    placeholder="Clearly specify the required correction (e.g. Please review criteria 2 for candidate C-102 due to timing deduction mismatch)..."
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    This note will be transmitted to the judge's portal and logged permanently in the audit trail.
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition-colors"
                  >
                    Return Evaluation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 3: ADMINISTRATIVE SCORE CORRECTION                              */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showAdminCorrectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Administrative Score Adjustment</h3>
                  <p className="text-[11px] text-white/80">Authorized Convener override with immutable audit trail</p>
                </div>
                <button
                  onClick={() => setShowAdminCorrectionModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAdminCorrection} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-stone-100 rounded-2xl text-stone-800 space-y-1">
                  <div><strong>Participant:</strong> {adminCorrectionForm.studentName} ({adminCorrectionForm.chestNo})</div>
                  <div><strong>Current Computed Score:</strong> {adminCorrectionForm.oldScore} / 100</div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">New Score (/100)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    required
                    value={adminCorrectionForm.newScore}
                    onChange={(e) => setAdminCorrectionForm({ ...adminCorrectionForm, newScore: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Mandatory Justification / Committee Resolution <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={adminCorrectionForm.reason}
                    onChange={(e) => setAdminCorrectionForm({ ...adminCorrectionForm, reason: e.target.value })}
                    placeholder="Enter formal justification, resolution number or appeal decision..."
                    className="w-full p-3 rounded-xl border border-stone-300 font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminCorrectionModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold shadow-md transition-colors"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 4: FINAL APPROVAL                                               */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showApproveModal && selectedCompData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-linear-to-r from-emerald-700 to-emerald-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Approve Final Result</h3>
                  <p className="text-[11px] text-white/90">Certifies final ranks and locks approved version</p>
                </div>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmApprove} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold text-sm">{selectedCompData.assignment.competitionTitle}</div>
                  <div>Assigned Judges: {selectedCompData.assignedJudges.length} | Submitted: {selectedCompData.judgeEvaluations.length}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Aggregation Mode</label>
                    <select
                      value={approvalOptions.aggregationMode}
                      onChange={(e) => setApprovalOptions({ ...approvalOptions, aggregationMode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-emerald-700"
                    >
                      <option value="average">Average Score (/100)</option>
                      <option value="sum">Sum of Marks</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Tie-Breaker Rule</label>
                    <select
                      value={approvalOptions.tieBreakerRule}
                      onChange={(e) => setApprovalOptions({ ...approvalOptions, tieBreakerRule: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-emerald-700"
                    >
                      <option value="criteria_weight">Primary Criteria Weight</option>
                      <option value="highest_single_mark">Highest Single Mark</option>
                      <option value="shared">Shared Rank / Split Points</option>
                    </select>
                  </div>
                </div>

                {selectedCompData.missingJudges.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                    <div className="font-bold">⚠️ Warning: Missing Submissions</div>
                    <p className="text-[11px]">
                      {selectedCompData.missingJudges.length} judge(s) have not submitted their evaluation.
                    </p>
                    <label className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={approvalOptions.allowIncompleteException}
                        onChange={(e) => setApprovalOptions({ ...approvalOptions, allowIncompleteException: e.target.checked })}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-bold text-amber-900">Grant authorized emergency exception</span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Convener Endorsement Notes (Optional)</label>
                  <textarea
                    rows="2"
                    value={approvalOptions.notes}
                    onChange={(e) => setApprovalOptions({ ...approvalOptions, notes: e.target.value })}
                    placeholder="e.g. Verified by Festival Convener; all marks scrutinized."
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApproveModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-colors"
                  >
                    Approve Final Result
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 5: PUBLISH OFFICIAL RESULT                                      */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showPublishModal && selectedCompData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-linear-to-r from-[#A91F35] to-[#7f1525] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Confirm Official Publishing</h3>
                  <p className="text-[11px] text-white/90">This publishes results to the Public Festival Website</p>
                </div>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold text-sm">{selectedCompData.assignment.competitionTitle}</div>
                  <div>Category: {selectedCompData.assignment.category} | Venue: {selectedCompData.assignment.venue}</div>
                </div>

                {/* Podium Preview */}
                <div className="border border-stone-200 rounded-2xl p-4 space-y-2 bg-stone-50">
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Official Podium:</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-stone-900">
                      <span>🥇 First: {selectedCompData.aggregatedResult?.rankedParticipants[0]?.name}</span>
                      <span className="text-[#A91F35] font-mono">
                        {selectedCompData.aggregatedResult?.rankedParticipants[0]?.averageScore} / 100 (+30 pts)
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-medium text-stone-800">
                      <span>🥈 Second: {selectedCompData.aggregatedResult?.rankedParticipants[1]?.name}</span>
                      <span className="font-mono">
                        {selectedCompData.aggregatedResult?.rankedParticipants[1]?.averageScore} / 100 (+20 pts)
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-medium text-stone-700">
                      <span>🥉 Third: {selectedCompData.aggregatedResult?.rankedParticipants[2]?.name}</span>
                      <span className="font-mono">
                        {selectedCompData.aggregatedResult?.rankedParticipants[2]?.averageScore} / 100 (+10 pts)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-100 text-stone-600 text-[11px] space-y-1">
                  <div className="font-bold text-stone-900">Publishing Impacts:</div>
                  <div>✓ Team Leader Portal receives updated official standings.</div>
                  <div>✓ Student Portal unlocks digital certificates and marks.</div>
                  <div>✓ Team score points updated idempotently.</div>
                  <div>✓ Official result poster generated for Public Website.</div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPublish}
                    className="px-5 py-2 rounded-xl bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] font-black shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>Confirm & Publish</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 6: DETAILED MARKSHEET INSPECTION                                */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showJudgeSheetModal && inspectJudgeSheet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 max-h-[85vh] flex flex-col"
            >
              <div className="p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-serif font-black text-base">{inspectJudgeSheet.judgeName}</h3>
                  <p className="text-[11px] text-white/80">{inspectJudgeSheet.competitionTitle} — Marksheet Details</p>
                </div>
                <button
                  onClick={() => setShowJudgeSheetModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="flex items-center justify-between text-stone-500 font-mono text-[11px] border-b border-stone-200 pb-2">
                  <span>Judge ID: {inspectJudgeSheet.judgeId}</span>
                  <span>Submitted: {inspectJudgeSheet.submittedAt || '—'}</span>
                  <span>Status: <strong>{inspectJudgeSheet.status}</strong></span>
                </div>

                <div className="border border-stone-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-stone-50 text-[10px] font-bold text-stone-600 uppercase border-b border-stone-200">
                      <tr>
                        <th className="p-3">Chest No</th>
                        <th className="p-3">Candidate</th>
                        <th className="p-3">Team</th>
                        <th className="p-3 text-right">Total Marks</th>
                        <th className="p-3">Judge Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(inspectJudgeSheet.scores || []).map(sc => (
                        <tr key={sc.studentId}>
                          <td className="p-3 font-mono font-bold text-[#A91F35]">{sc.chestNo}</td>
                          <td className="p-3 font-bold text-stone-900">{sc.studentName}</td>
                          <td className="p-3 text-stone-600">{sc.teamName || '—'}</td>
                          <td className="p-3 text-right font-black text-stone-900 text-sm">{sc.total}</td>
                          <td className="p-3 text-stone-500 italic">{sc.remarks || 'No remarks'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {inspectJudgeSheet.remarks && (
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 italic">
                    <strong>Overall Jury Comments:</strong> "{inspectJudgeSheet.remarks}"
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setShowJudgeSheetModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
