import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Award, Crown, Calculator, CheckCircle2, AlertCircle, Clock,
  Sparkles, ArrowRight, ShieldCheck, RefreshCw, Eye, Sliders, Check,
  Search, Filter, Download, Printer, AlertTriangle, X, ChevronRight,
  ChevronLeft, ArrowUpDown, FileText, Share2, Layers, UserCheck, Shield,
  History, RotateCcw, Edit2, CheckCheck
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';
import MarksConfigurationTab from './MarksConfigurationTab';

export default function ScoringCalculatorModule({ activeSection }) {
  // Navigation tabs: 'dashboard' | 'calculator' | 'verification' | 'publishing' | 'standings' | 'corrections' | 'reports'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('calc') || hash.includes('tabulation')) return 'calculator';
      if (hash.includes('verification') || hash.includes('verify')) return 'verification';
      if (hash.includes('publishing') || hash.includes('posters')) return 'publishing';
      if (hash.includes('standings') || hash.includes('points')) return 'standings';
      if (hash.includes('corrections') || hash.includes('history')) return 'corrections';
      if (hash.includes('reports')) return 'reports';
    }
    return 'dashboard';
  });

  // Core Store Data
  const [competitions, setCompetitions] = useState(() => festivalStore.getCompetitions());
  const [teams, setTeams] = useState(() => festivalStore.getTeams());
  const [scoringRules, setScoringRules] = useState(() => festivalStore.getScoringRules());
  const [stats, setStats] = useState(() => festivalStore.getResultsDashboardStats());
  const [evaluations, setEvaluations] = useState(() => festivalStore.getAllSubmittedEvaluations());
  const [posters, setPosters] = useState(() => festivalStore.getPublishedResultPosters());
  const [correctionHistory, setCorrectionHistory] = useState(() => festivalStore.getResultCorrectionHistory());

  // Calculator State
  const [selectedCompId, setSelectedCompId] = useState(() => {
    const comps = festivalStore.getCompetitions();
    return comps.length > 0 ? comps[0].id : '';
  });
  const [aggregationMode, setAggregationMode] = useState('average'); // 'average' | 'sum'
  const [tieBreakerRule, setTieBreakerRule] = useState('criteria_weight'); // 'criteria_weight' | 'highest_single_mark'

  // Modals state
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [activePoster, setActivePoster] = useState(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [activeCorrectionComp, setActiveCorrectionComp] = useState(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [activeEvalToReject, setActiveEvalToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // UI state
  const [successToast, setSuccessToast] = useState('');
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const refreshData = () => {
    setCompetitions(festivalStore.getCompetitions());
    setTeams(festivalStore.getTeams());
    setScoringRules(festivalStore.getScoringRules());
    setStats(festivalStore.getResultsDashboardStats());
    setEvaluations(festivalStore.getAllSubmittedEvaluations());
    setPosters(festivalStore.getPublishedResultPosters());
    setCorrectionHistory(festivalStore.getResultCorrectionHistory());
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const selectedComp = useMemo(() => {
    return competitions.find(c => c.id === selectedCompId || c.competitionId === selectedCompId) || competitions[0];
  }, [competitions, selectedCompId]);

  // Real-time calculated results using store engine
  const evaluatedResults = useMemo(() => {
    if (!selectedComp) return null;
    return festivalStore.calculateAggregatedResults(selectedComp.id, {
      aggregationMode,
      tieBreakerRule
    });
  }, [selectedComp, aggregationMode, tieBreakerRule, evaluations]);

  // Handle Verify Result
  const handleVerifyResult = (compId) => {
    try {
      festivalStore.verifyResult(compId, { adminNotes: 'Verified by Festival Secretariat' });
      showToast('Calculations and marks successfully verified!');
      refreshData();
    } catch (err) {
      alert(err.message || 'Verification failed.');
    }
  };

  // Handle Approve and Publish Result
  const handlePublishResult = (compId) => {
    try {
      const res = festivalStore.approveAndPublishResult(compId, {
        aggregationMode,
        tieBreakerRule,
        templateStyle: 'editorial_crimson'
      });
      if (res.success) {
        showToast(`Official results and poster published for ${res.assignment.competitionTitle}!`);
        refreshData();
      }
    } catch (err) {
      alert(err.message || 'Publishing failed.');
    }
  };

  // Open Correction Modal
  const handleOpenCorrection = (comp) => {
    setActiveCorrectionComp(comp);
    setCorrectionReason('');
    setFormError('');
    setIsCorrectionModalOpen(true);
  };

  // Submit Correction
  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    if (!correctionReason.trim()) {
      setFormError('Correction reason is mandatory.');
      return;
    }
    try {
      const res = festivalStore.correctPublishedResult(activeCorrectionComp.id, {
        reason: correctionReason,
        correctedParticipants: evaluatedResults ? evaluatedResults.rankedParticipants : []
      });
      if (res.success) {
        showToast('Result corrected and team points safely updated!');
        setIsCorrectionModalOpen(false);
        refreshData();
      }
    } catch (err) {
      setFormError(err.message || 'Correction failed.');
    }
  };

  // Open Reject Evaluation Modal
  const handleOpenReject = (evalItem) => {
    setActiveEvalToReject(evalItem);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  // Submit Reject Evaluation
  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    try {
      festivalStore.rejectResultEvaluation(activeEvalToReject.id, rejectReason);
      showToast('Evaluation sheet flagged for judge correction.');
      setIsRejectModalOpen(false);
      refreshData();
    } catch (err) {
      alert(err.message || 'Failed to request correction.');
    }
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Competition Code', 'Competition Title', 'Rank', 'Candidate', 'Chest No', 'Team', 'Score', 'Points Awarded'];
    const rows = [];

    competitions.forEach(c => {
      const agg = festivalStore.calculateAggregatedResults(c.id);
      if (agg && agg.rankedParticipants) {
        agg.rankedParticipants.forEach(p => {
          rows.push([
            `"${c.code || c.competitionCode}"`,
            `"${c.title || c.competitionTitle}"`,
            p.rank,
            `"${p.name}"`,
            `"${p.chestNo}"`,
            `"${p.teamName}"`,
            p.computedScore,
            p.pointsAwarded
          ]);
        });
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_results_tabulation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported complete tabulation results as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#A91F35] via-[#851627] to-[#5C0F1C] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold tracking-wider uppercase mb-3 text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              Central Tabulation & Scoring Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Results & Scoring Control
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl font-sans">
              Automated multi-judge mark aggregation, tie-break verification, idempotent team points allocation, and official poster publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Calculator className="w-4 h-4 text-stone-900" />
              Open Score Calculator
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition-all"
            >
              <Download className="w-4 h-4" />
              Export Tabulation (CSV)
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Results Dashboard', icon: Trophy },
            { id: 'scoring_rules', label: 'Marks & Grade Config', icon: Sliders },
            { id: 'calculator', label: 'Live Tabulation & Aggregation', icon: Calculator },
            { id: 'verification', label: `Verification Desk (${stats.resultsAwaitingVerification})`, icon: ShieldCheck },
            { id: 'publishing', label: `Posters & Publishing (${stats.publishedResults})`, icon: Award },
            { id: 'standings', label: 'Team Leaderboard', icon: Crown },
            { id: 'corrections', label: 'Correction History', icon: History },
            { id: 'reports', label: 'Official Reports', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${active
                  ? 'bg-white text-[#A91F35] shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#A91F35]' : 'text-stone-300'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: RESULTS DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 7 KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {[
              { label: 'Total Events', value: stats.totalCompetitions, sub: 'Festival Arenas', icon: Trophy, bg: 'bg-red-50 text-red-700' },
              { label: 'Logged Sheets', value: stats.totalEvaluations, sub: 'Judge Marksheets', icon: FileText, bg: 'bg-blue-50 text-blue-700' },
              { label: 'Verified Sheets', value: stats.submittedEvaluations, sub: 'Adjudicated', icon: CheckCheck, bg: 'bg-emerald-50 text-emerald-700' },
              { label: 'Pending Sheets', value: stats.pendingEvaluations, sub: 'Awaiting Entry', icon: Clock, bg: 'bg-amber-50 text-amber-700' },
              { label: 'Ready for Review', value: stats.resultsAwaitingVerification, sub: 'Awaiting Verification', icon: ShieldCheck, bg: 'bg-purple-50 text-purple-700' },
              { label: 'Published Posters', value: stats.publishedResults, sub: 'Official Live', icon: Award, bg: 'bg-teal-50 text-teal-700' },
              { label: 'Overall Points', value: stats.totalTeamPoints.toLocaleString(), sub: 'Allocated to Teams', icon: Crown, bg: 'bg-yellow-50 text-yellow-800' }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{card.label}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.bg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900">{card.value}</div>
                  <div className="text-[10px] text-stone-600 mt-0.5">{card.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Panels: Pending Verification & Recent Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Verification Panel */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Awaiting Verification & Publishing</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Competitions with judge marks submitted and ready for sign-off</p>
                </div>
                <button
                  onClick={() => setActiveTab('verification')}
                  className="text-xs font-bold text-[#A91F35] hover:underline"
                >
                  Verification Desk &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {competitions.filter(c => !c.isPublished && (evaluations.some(e => e.competitionId === c.competitionId || e.assignmentId === c.id) || c.status === 'Pending Approval')).length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                    No judge evaluations are awaiting approval. Competition setup is pending.
                  </div>
                ) : (
                  competitions.filter(c => !c.isPublished && (evaluations.some(e => e.competitionId === c.competitionId || e.assignmentId === c.id) || c.status === 'Pending Approval')).slice(0, 4).map(c => {
                    const evalsForComp = evaluations.filter(e => e.competitionId === c.competitionId || e.assignmentId === c.id);
                    const isApproved = c.status === 'APPROVED' || c.convenerApproved || c.adminApproved;
                    return (
                      <div key={c.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#A91F35] bg-red-100/60 px-2 py-0.5 rounded">
                              {c.code || c.competitionCode}
                            </span>
                            <span className="font-bold text-stone-900 text-xs">{c.title || c.competitionTitle}</span>
                            {isApproved && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                {c.approvedByRole === 'CONVENER' ? 'Approved by Convener' : 'Approved by Admin'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-1">
                            Type: {c.type || 'Individual'} • Category: {c.category} • {evalsForComp.length} Evaluation Sheet(s) Logged
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCompId(c.id);
                            setActiveTab('calculator');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#A91F35] hover:bg-[#851627] text-white text-xs font-bold shadow-sm transition-all"
                        >
                          Calculate &rarr;
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Published Results Laurels Showcase */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Recent Published Results</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Podium laureates officially broadcast to public leaderboard</p>
                </div>
                <button
                  onClick={() => setActiveTab('publishing')}
                  className="text-xs font-bold text-[#A91F35] hover:underline"
                >
                  View All Posters &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {posters.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/50 to-stone-50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-700" />
                        <span className="font-bold text-stone-900 text-xs">{p.competitionTitle}</span>
                      </div>
                      <div className="text-[11px] text-stone-700 mt-1.5 flex items-center gap-2">
                        <span className="font-bold text-amber-900">🥇 1st: {p.firstPrize?.name} ({p.firstPrize?.chestNo})</span>
                        <span className="text-stone-500">• {p.firstPrize?.teamName} ({p.firstPrize?.score})</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Published
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: OFFICIAL CHARTER MARKS & GRADE CONFIGURATION */}
      {/* ========================================================================= */}
      {activeTab === 'scoring_rules' && (
        <MarksConfigurationTab />
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE SCORE CALCULATOR & AGGREGATION */}
      {/* ========================================================================= */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          {/* Header Strip & Protocol Selector */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Live Adjudication Score Calculator</h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Multi-judge score aggregation, criteria weights, tie detection, and idempotent point calculation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                {selectedComp?.type === 'Group' ? 'Group Event (45 - 30 - 15)' : 'Individual Event (30 - 20 - 10)'}
              </span>
            </div>
          </div>

          {/* Control Bar: Select Competition & Calculation Protocols */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Target Competition</label>
              <select
                value={selectedCompId}
                onChange={(e) => setSelectedCompId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#A91F35]"
              >
                {competitions.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code || c.competitionCode} — {c.title || c.competitionTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Aggregation Protocol</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAggregationMode('average')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${aggregationMode === 'average'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                >
                  Mean Average (0–100)
                </button>
                <button
                  type="button"
                  onClick={() => setAggregationMode('sum')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${aggregationMode === 'sum'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    }`}
                >
                  Sum Total
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tie-Breaker Rule</label>
              <select
                value={tieBreakerRule}
                onChange={(e) => setTieBreakerRule(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="criteria_weight">Criterion 1 (Thematic Depth) Weight</option>
                <option value="highest_single_mark">Highest Single Judge Mark</option>
              </select>
            </div>
          </div>

          {/* Cross-Tabulated Marksheet Table */}
          {selectedComp?.convenerApproval && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Convener Approval Status:</strong> Approved and certified by {selectedComp.convenerApproval.approvedBy} on {new Date(selectedComp.convenerApproval.approvedAt).toLocaleString()} (Version v{selectedComp.convenerApproval.version}).
                </span>
              </div>
              {selectedComp.isOfficialPublished && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 uppercase">
                  Officially Published
                </span>
              )}
            </div>
          )}

          {evaluatedResults && evaluatedResults.rankedParticipants.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <span>Adjudication Cross-Tabulation ({evaluatedResults.judgesSubmitted} of {evaluatedResults.totalJudgesAssigned} Judge Sheets Logged)</span>
                  {evaluatedResults.hasTie && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                      Tie Detected & Resolved
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerifyResult(selectedComp.id)}
                    className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify Calculations
                  </button>
                  <button
                    onClick={() => handlePublishResult(selectedComp.id)}
                    className="px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Award className="w-4 h-4" />
                    Approve & Publish Official Result
                  </button>
                </div>
              </div>

              {/* Tie Warning Banner if equal scores detected */}
              {evaluatedResults.hasTie && (
                <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between text-amber-950 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black flex-shrink-0">
                      !
                    </div>
                    <div>
                      <div className="font-bold text-amber-900">Official Tie Detected</div>
                      <div className="text-[11px] text-amber-800">
                        Multiple candidates have achieved identical scores. Under festival charter rules, equal scores must be reviewed by the Convener before official publishing.
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-200 text-amber-900 font-extrabold text-[10px] uppercase tracking-wider flex-shrink-0">
                    Review Required
                  </span>
                </div>
              )}

              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3.5">Rank</th>
                      <th className="p-3.5">Candidate Details</th>
                      <th className="p-3.5">Team Squad</th>
                      <th className="p-3.5">Judge Evaluations</th>
                      <th className="p-3.5">Computed Score</th>
                      <th className="p-3.5">Grade</th>
                      <th className="p-3.5 text-right">Points Allocated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {evaluatedResults.rankedParticipants.map((p, idx) => {
                      const isPodium = idx < 3;
                      return (
                        <tr key={p.studentId} className={`hover:bg-stone-50/70 transition-colors ${isPodium ? 'bg-amber-50/20' : ''}`}>
                          <td className="p-3.5 font-bold font-mono">
                            <div className="flex flex-col items-center">
                              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${idx === 0
                                ? 'bg-amber-400 text-stone-900 shadow-sm'
                                : idx === 1
                                  ? 'bg-stone-200 text-stone-800'
                                  : idx === 2
                                    ? 'bg-amber-200 text-amber-900'
                                    : 'bg-stone-100 text-stone-600'
                                }`}>
                                {p.rank}
                              </span>
                              {p.isTie && (
                                <span className="mt-1 px-1.5 py-0.5 rounded bg-amber-500 text-white font-black text-[8px] uppercase tracking-wider animate-pulse">
                                  TIE
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-stone-900">{p.name}</div>
                            <div className="text-[10px] font-mono text-[#A91F35] font-bold">
                              Chest No: {p.chestNo} • ID: {p.studentId}
                            </div>
                          </td>
                          <td className="p-3.5 font-semibold text-stone-800">
                            {p.teamName}
                          </td>
                          <td className="p-3.5">
                            {p.judgeScores.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {p.judgeScores.map((js, jIdx) => (
                                  <span key={jIdx} className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-[10px] font-bold" title={`${js.judgeName}: ${js.total} pts`}>
                                    J{jIdx + 1}: {js.total}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] text-stone-400 italic">Awaiting evaluations</span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono font-black text-sm text-stone-900">
                            {p.computedScore}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${p.grade === 'A+'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.grade === 'A'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-stone-100 text-stone-700'
                              }`}>
                              {p.grade}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-black text-sm">
                            {p.pointsAwarded > 0 ? (
                              <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs">
                                +{p.pointsAwarded} pts
                              </span>
                            ) : (
                              <span className="text-stone-400 font-normal text-xs">0 pts</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
              No participants or judge evaluation sheets are logged for this competition yet.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RESULT VERIFICATION DESK */}
      {/* ========================================================================= */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: OFFICIAL RESULT PUBLISHING & POSTERS */}
      {/* ========================================================================= */}
      {activeTab === 'publishing' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Official Result Posters Gallery</h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Archived high-resolution award posters generated from verified adjudication marksheets.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Batch Posters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posters.map((poster) => (
              <div
                key={poster.id}
                className="p-5 rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-stone-900 via-stone-900 to-black text-white relative shadow-xl overflow-hidden flex flex-col justify-between"
                style={{ minHeight: '380px' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A91F35] via-[#E6A916] to-[#A91F35]" />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-black text-[10px]">
                        DF
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">DALENZIA FEST 2K26</div>
                        <div className="text-[8px] tracking-widest text-stone-400 uppercase font-sans">OFFICIAL RESULT BULLETIN</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      VERIFIED
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">{poster.competitionCode}</span>
                    <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">{poster.competitionTitle}</h3>
                    <p className="text-[10px] text-stone-400">{poster.venue}</p>
                  </div>

                  {/* Podium Laureates Strip */}
                  <div className="mt-4 space-y-2 pt-3 border-t border-white/10 text-xs">
                    {poster.firstPrize && (
                      <div className="p-2 rounded-xl bg-white/5 border border-amber-400/30 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-amber-300">🥇 1st: {poster.firstPrize.name}</div>
                          <div className="text-[10px] text-stone-300">{poster.firstPrize.chestNo} • {poster.firstPrize.teamName}</div>
                        </div>
                        <span className="font-mono font-bold text-xs text-amber-400">+{poster.firstPrize.points} pts</span>
                      </div>
                    )}
                    {poster.secondPrize && (
                      <div className="p-2 rounded-xl bg-white/5 border border-stone-500/30 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-stone-200">🥈 2nd: {poster.secondPrize.name}</div>
                          <div className="text-[10px] text-stone-300">{poster.secondPrize.chestNo} • {poster.secondPrize.teamName}</div>
                        </div>
                        <span className="font-mono font-bold text-xs text-stone-300">+{poster.secondPrize.points} pts</span>
                      </div>
                    )}
                    {poster.thirdPrize && (
                      <div className="p-2 rounded-xl bg-white/5 border border-amber-600/30 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-amber-200/80">🥉 3rd: {poster.thirdPrize.name}</div>
                          <div className="text-[10px] text-stone-300">{poster.thirdPrize.chestNo} • {poster.thirdPrize.teamName}</div>
                        </div>
                        <span className="font-mono font-bold text-xs text-amber-200/80">+{poster.thirdPrize.points} pts</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-stone-400">
                  <span>Published: {poster.publishedAt}</span>
                  <button
                    onClick={() => {
                      setActivePoster(poster);
                      setIsPosterModalOpen(true);
                    }}
                    className="font-bold text-amber-400 hover:underline"
                  >
                    Full Poster &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TEAM POINTS & STANDINGS */}
      {/* ========================================================================= */}
      {activeTab === 'standings' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Official Festival House Standings</h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Real-time cumulative points automatically updated upon each official competition publication.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
              Total Points In Play: {teams.reduce((a, b) => a + (b.points || 0), 0)} pts
            </span>
          </div>

          <div className="space-y-3">
            {festivalStore.getTeamLeaderboard().map((t, idx) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#A91F35]/30 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${idx === 0
                    ? 'bg-amber-400 text-stone-900 shadow-sm'
                    : idx === 1
                      ? 'bg-stone-200 text-stone-800'
                      : idx === 2
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <span>{t.displayName || t.name}</span>
                      <span className="font-mono text-xs text-stone-400">({t.code})</span>
                    </div>
                    <div className="text-xs text-stone-500">
                      Leader: {t.leader || 'Not Assigned'} • {t.members || 22} Scholars
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black font-mono text-[#A91F35]">{t.points || 0} pts</div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    Individual: <strong className="text-stone-700">{t.individualPoints || 0} pts</strong> • General: <strong className="text-stone-700">{t.generalPoints || 0} pts</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CORRECTION HISTORY & AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'corrections' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Result Correction & Version Audit Trail</h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Authorized adjustments to published marks with point recalculation logs and historical preservation.
              </p>
            </div>
          </div>

          {correctionHistory.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600" />
              <div className="font-bold text-stone-800">Zero Result Corrections Logged</div>
              <p>All official published results have maintained 100% integrity without administrative overrides.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {correctionHistory.map((h, i) => (
                <div key={i} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-stone-900">{h.competitionTitle}</div>
                    <span className="font-mono text-stone-500 text-[10px]">{h.timestamp}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700">
                    <span className="font-bold text-amber-900">Reason: </span>
                    <span>{h.reason}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 flex justify-between">
                    <span>Authorized by: <strong className="text-stone-800">{h.correctedBy}</strong></span>
                    <span>Log ID: {h.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: REPORTS & EXPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Official Scoring & Tabulation Reports</h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Export verified scorecards, points summaries, and official festival laureates rosters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Master Tabulation Sheet',
                desc: 'Detailed breakdown of all candidate marks across each assigned judge and competition arena.',
                action: handleExportCSV,
                btnLabel: 'Download Tabulation (CSV)'
              },
              {
                title: 'Official Published Winners Gazette',
                desc: 'Formal list of 1st, 2nd, and 3rd place podium winners across all completed festival competitions.',
                action: () => window.print(),
                btnLabel: 'Print Winners Gazette'
              },
              {
                title: 'Team Points & Standing Report',
                desc: 'Aggregate team standings with points allocated from individual and group competitions.',
                action: () => setActiveTab('standings'),
                btnLabel: 'View Standings'
              }
            ].map((rep, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{rep.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{rep.desc}</p>
                </div>
                <button
                  onClick={rep.action}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 hover:border-[#A91F35] text-stone-800 hover:text-[#A91F35] font-bold text-xs transition-all shadow-sm"
                >
                  {rep.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FULL POSTER PREVIEW */}
      {/* ========================================================================= */}
      {isPosterModalOpen && activePoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Official Result Poster</h3>
              <button
                onClick={() => setIsPosterModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-black text-white relative shadow-2xl border-2 border-amber-500/30 overflow-hidden text-center space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A91F35] via-[#E6A916] to-[#A91F35]" />

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-black uppercase text-amber-300 tracking-wider">
                  DALENZIA FEST 2K26 • NUEVA ERA
                </span>
                <div className="text-base font-bold text-white mt-2">{activePoster.competitionTitle}</div>
                <div className="text-[11px] text-stone-400 font-mono">{activePoster.competitionCode} • {activePoster.venue}</div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                {activePoster.firstPrize && (
                  <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-bold text-amber-300">🥇 1st Place (Gold)</div>
                      <div className="text-sm font-bold text-white">{activePoster.firstPrize.name}</div>
                      <div className="text-[10px] text-stone-400">{activePoster.firstPrize.chestNo} • {activePoster.firstPrize.teamName}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-amber-300">
                      <div>{activePoster.firstPrize.score}</div>
                      <div className="text-[10px] text-amber-400">+{activePoster.firstPrize.points} pts</div>
                    </div>
                  </div>
                )}

                {activePoster.secondPrize && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-stone-500/30 flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-bold text-stone-200">🥈 2nd Place (Silver)</div>
                      <div className="text-xs font-bold text-stone-100">{activePoster.secondPrize.name}</div>
                      <div className="text-[10px] text-stone-400">{activePoster.secondPrize.chestNo} • {activePoster.secondPrize.teamName}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-stone-200">
                      <div>{activePoster.secondPrize.score}</div>
                      <div className="text-[10px]">+{activePoster.secondPrize.points} pts</div>
                    </div>
                  </div>
                )}

                {activePoster.thirdPrize && (
                  <div className="p-2.5 rounded-xl bg-white/5 border border-amber-600/30 flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-bold text-amber-200/80">🥉 3rd Place (Bronze)</div>
                      <div className="text-xs font-bold text-stone-100">{activePoster.thirdPrize.name}</div>
                      <div className="text-[10px] text-stone-400">{activePoster.thirdPrize.chestNo} • {activePoster.thirdPrize.teamName}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-amber-200/80">
                      <div>{activePoster.thirdPrize.score}</div>
                      <div className="text-[10px]">+{activePoster.thirdPrize.points} pts</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[10px] text-stone-500 flex justify-between border-t border-white/10">
                <span>Verified by Festival Controller</span>
                <span>{activePoster.publishedAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Poster
              </button>
              <button
                onClick={() => {
                  showToast('Poster downloaded.');
                  setIsPosterModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Poster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RESULT CORRECTION WORKFLOW */}
      {/* ========================================================================= */}
      {isCorrectionModalOpen && activeCorrectionComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Authorize Result Correction</h3>
                <p className="text-xs text-stone-600 line-clamp-1">{activeCorrectionComp.title || activeCorrectionComp.competitionTitle}</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-700 mb-1">Official Reason for Correction *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g. Scrutiny committee re-evaluated Criterion 2 arithmetic slip in Judge Sheet 3."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div>• Old team points will be safely deducted and new points credited.</div>
                <div>• Version history will be preserved with your author signature.</div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-md"
                >
                  Confirm & Apply Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
