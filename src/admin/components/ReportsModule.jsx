import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Trophy,
  Calendar,
  Shield,
  FileText,
  Download,
  Printer,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  FileSpreadsheet,
  X,
  ExternalLink,
  Crown,
  Medal,
  Activity,
  Layers,
  PieChart,
  UserCheck,
  Building2,
  CalendarDays,
  Compass,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function ReportsModule({ activeSection }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Global & Tab Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [studentResultFilter, setStudentResultFilter] = useState('all');

  // Print & Modal State
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printReportType, setPrintReportType] = useState('overview');
  const [exportNotice, setExportNotice] = useState(null);

  // Load Data
  const refreshLiveStats = () => {
    setLoading(true);
    try {
      festivalStore.loadData();
      setLastUpdated(new Date());
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  // 1. Data queries
  const overviewData = useMemo(() => {
    return festivalStore.getFestivalAnalyticsOverview();
  }, [lastUpdated]);

  const teamReports = useMemo(() => {
    return festivalStore.getTeamPerformanceReports({
      teamId: selectedTeam,
      search: searchQuery
    });
  }, [lastUpdated, selectedTeam, searchQuery]);

  const studentReports = useMemo(() => {
    return festivalStore.getStudentPerformanceReports({
      teamId: selectedTeam,
      classCategory: selectedCategory !== 'all' ? selectedCategory : undefined,
      resultStatus: studentResultFilter,
      search: searchQuery
    });
  }, [lastUpdated, selectedTeam, selectedCategory, studentResultFilter, searchQuery]);

  const competitionReports = useMemo(() => {
    return festivalStore.getCompetitionReports({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      date: selectedDate !== 'all' ? selectedDate : undefined,
      search: searchQuery
    });
  }, [lastUpdated, selectedCategory, selectedStatus, selectedDate, searchQuery]);

  const judgeReports = useMemo(() => {
    return festivalStore.getJudgeActivityReports({
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      search: searchQuery
    });
  }, [lastUpdated, selectedStatus, searchQuery]);

  const programmeReports = useMemo(() => {
    return festivalStore.getProgrammeReports({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      date: selectedDate !== 'all' ? selectedDate : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      search: searchQuery
    });
  }, [lastUpdated, selectedCategory, selectedDate, selectedStatus, searchQuery]);

  const resultsData = useMemo(() => {
    return festivalStore.getResultScoringReports({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchQuery
    });
  }, [lastUpdated, selectedCategory, searchQuery]);

  const activityData = useMemo(() => {
    return festivalStore.getFestivalActivityReports();
  }, [lastUpdated]);

  const allTeams = useMemo(() => festivalStore.getTeams(), [lastUpdated]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTeam('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedDate('all');
    setStudentResultFilter('all');
  };

  // CSV Export Handler
  const exportToCsv = (type) => {
    let filename = `dalenzia_report_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    let headers = [];
    let rows = [];

    if (type === 'teams') {
      headers = ['Rank', 'Team Code', 'Team Name', 'Zone/Subname', 'Team Leader', 'Members', '1st Prizes', '2nd Prizes', '3rd Prizes', 'Total Points', 'Status'];
      rows = teamReports.map(t => [
        t.currentRank,
        t.teamCode,
        `"${t.teamName}"`,
        `"${t.subname || ''}"`,
        `"${t.leader || ''}"`,
        t.totalStudents,
        t.firstPositions,
        t.secondPositions,
        t.thirdPositions,
        t.totalPoints,
        t.status
      ]);
    } else if (type === 'students') {
      headers = ['Student ID', 'Chest No', 'Name', 'Team', 'Category', 'Registered Events', 'Prizes Count', 'Total Points'];
      rows = studentReports.map(s => [
        s.studentId,
        s.chestNo,
        `"${s.name}"`,
        `"${s.teamName}"`,
        s.classCategory,
        s.registeredCount,
        s.prizesCount,
        s.totalPoints
      ]);
    } else if (type === 'competitions') {
      headers = ['Code', 'Competition Title', 'Category', 'Venue', 'Date', 'Registered Participants', 'Evaluation Status', 'Assigned Judges', '1st Place', '2nd Place', '3rd Place'];
      rows = competitionReports.map(c => [
        c.code,
        `"${c.title}"`,
        `"${c.category}"`,
        `"${c.venue}"`,
        c.date,
        c.registeredParticipantsCount,
        c.evaluationStatus,
        c.assignedJudgesCount,
        c.winners[0] ? `"${c.winners[0].name} (${c.winners[0].teamName})"` : 'Pending',
        c.winners[1] ? `"${c.winners[1].name} (${c.winners[1].teamName})"` : 'Pending',
        c.winners[2] ? `"${c.winners[2].name} (${c.winners[2].teamName})"` : 'Pending'
      ]);
    } else if (type === 'judges') {
      headers = ['Judge ID', 'Name', 'Designation', 'Institution', 'Status', 'Assigned Evaluations', 'Submitted Evaluations', 'Pending Evaluations', 'Completion %'];
      rows = judgeReports.map(j => [
        j.judgeId,
        `"${j.name}"`,
        `"${j.designation}"`,
        `"${j.institution}"`,
        j.status,
        j.assignedCount,
        j.submittedCount,
        j.pendingCount,
        `${j.completionPercentage}%`
      ]);
    } else if (type === 'programmes') {
      headers = ['Code', 'Programme Title', 'Category', 'Date', 'Time', 'Venue', 'Status', 'Coordinator', 'Distinguished Guest'];
      rows = programmeReports.map(p => [
        p.code,
        `"${p.title}"`,
        `"${p.category}"`,
        p.date,
        `"${p.time}"`,
        `"${p.venue}"`,
        p.status,
        `"${p.coordinatorName || ''}"`,
        `"${p.guestName || ''}"`
      ]);
    } else if (type === 'results') {
      headers = ['Competition Code', 'Competition Title', 'Category', 'Position', 'Laureate Name', 'Chest No', 'Team', 'Score', 'Points Awarded'];
      rows = resultsData.winnersList.map(w => [
        w.competitionCode,
        `"${w.competitionTitle}"`,
        `"${w.category}"`,
        w.position,
        `"${w.name}"`,
        w.chestNo,
        `"${w.teamName}"`,
        `"${w.score}"`,
        w.points
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Exported ${type.toUpperCase()} report successfully!`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handlePrint = (reportType) => {
    setPrintReportType(reportType);
    setPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & METRICS CONTROL BAR                                       */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#A91F35] via-[#8B1A2C] to-[#5c0f1b] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <BarChart3 className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E6A916] text-[11px] font-bold tracking-wide uppercase border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Official Festival Intelligence & Audits</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white flex items-center gap-3">
              <span>Reports & Analytics</span>
              <span className="text-[#E6A916] text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 border border-[#E6A916]/30">
                ADM-REP-12
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
              Institutional intelligence dashboard aggregating real-time data across student rosters, team rankings, adjudication marks, programme timelines, and official verified laurels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshLiveStats}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => handlePrint(activeTab)}
              className="px-4 py-2 rounded-xl bg-[#E6A916] text-[#A91F35] hover:bg-[#f0b52b] text-xs font-black shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF Report</span>
            </button>

            <div className="relative group">
              <button className="px-3.5 py-2 rounded-xl bg-white text-[#A91F35] hover:bg-stone-100 text-xs font-black shadow-md flex items-center gap-1.5 transition-all">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#A91F35]" />
                <span>Export CSV</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Select Dataset
                </div>
                {[
                  { label: 'Team Rankings & Points', type: 'teams' },
                  { label: 'Student Participations', type: 'students' },
                  { label: 'Competition Status & Laurels', type: 'competitions' },
                  { label: 'Judge Evaluation Progress', type: 'judges' },
                  { label: 'Master Programme Schedules', type: 'programmes' },
                  { label: 'Official Published Laureates', type: 'results' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => exportToCsv(item.type)}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-[#F7F3E9] hover:text-[#A91F35] flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <Download className="w-3 h-3 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live sync pill */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry: <strong>Zero Simulation • Pure Verified Central Store</strong></span>
          </div>
          <span>Synchronized: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* Export notification alert */}
      <AnimatePresence>
        {exportNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{exportNotice}</span>
            </div>
            <button onClick={() => setExportNotice(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. SUB-TAB DOMAIN NAVIGATION                                              */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-x-auto select-none">
        {[
          { id: 'overview', label: 'Festival Overview', icon: PieChart },
          { id: 'teams', label: 'Team Performance', icon: Trophy },
          { id: 'students', label: 'Student Performance', icon: Users },
          { id: 'competitions', label: 'Competition Reports', icon: Medal },
          { id: 'judges', label: 'Judge Activity', icon: Shield },
          { id: 'programmes', label: 'Programme Reports', icon: CalendarDays },
          { id: 'results', label: 'Results & Laureates', icon: Award },
          { id: 'activity', label: 'Festival Activity', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#A91F35] text-white shadow-sm font-black'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6A916]' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. MULTI-CRITERIA FILTER CONTROLS (RESPONSIVE)                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab} by name, code, title, or keywords...`}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Team Filter */}
            {(activeTab === 'teams' || activeTab === 'students' || activeTab === 'overview' || activeTab === 'results') && (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Teams (12)</option>
                {allTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                ))}
              </select>
            )}

            {/* Category Filter */}
            {(activeTab === 'competitions' || activeTab === 'students' || activeTab === 'programmes' || activeTab === 'results') && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Classifications</option>
                <option value="Stage">Stage Programmes</option>
                <option value="Off Stage">Off Stage Programmes</option>
                <option value="General">General (Team Based)</option>
                {activeTab === 'students' && (
                  <>
                    <option value="Senior">Senior Division</option>
                    <option value="Junior">Junior Division</option>
                    <option value="Sub Junior">Sub Junior Division</option>
                  </>
                )}
              </select>
            )}

            {/* Status Filter */}
            {(activeTab === 'competitions' || activeTab === 'judges' || activeTab === 'programmes') && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Statuses</option>
                {activeTab === 'competitions' && (
                  <>
                    <option value="Published">Published Laurels</option>
                    <option value="Under Verification">Under Verification</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending Evaluation</option>
                  </>
                )}
                {activeTab === 'judges' && (
                  <>
                    <option value="Completed">Evaluation Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Pending">Pending Submission</option>
                  </>
                )}
                {activeTab === 'programmes' && (
                  <>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </>
                )}
              </select>
            )}

            {/* Date Filter */}
            {(activeTab === 'competitions' || activeTab === 'programmes') && (
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Festival Days</option>
                <option value="Dec 21, 2026">Day 01 (Dec 21, 2026)</option>
                <option value="Dec 22, 2026">Day 02 (Dec 22, 2026)</option>
              </select>
            )}

            {/* Student Result Filter */}
            {activeTab === 'students' && (
              <select
                value={studentResultFilter}
                onChange={(e) => setStudentResultFilter(e.target.value)}
                className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Students</option>
                <option value="awarded">Awarded Laureates Only</option>
                <option value="unawarded">Registered (Awaiting Result)</option>
              </select>
            )}

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="px-3 py-2 rounded-xl text-xs font-bold text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ACTIVE SUB-TAB CONTENT VIEW                                            */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 1: FESTIVAL OVERVIEW DASHBOARD                                        */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Primary 8 Festival Overview Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Students', value: overviewData.festivalOverview.totalStudents, sub: 'Registered', icon: Users, color: '#A91F35' },
              { label: 'Active Teams', value: overviewData.festivalOverview.totalTeams, sub: 'All Zones', icon: Trophy, color: '#b45309' },
              { label: 'Competitions', value: overviewData.festivalOverview.totalCompetitions, sub: '5 Arenas', icon: Medal, color: '#d97706' },
              { label: 'Programmes', value: overviewData.festivalOverview.totalProgrammes, sub: '4 Stages', icon: CalendarDays, color: '#4338ca' },
              { label: 'Judges', value: overviewData.festivalOverview.totalJudges, sub: `${overviewData.festivalOverview.activeJudges} Active`, icon: Shield, color: '#047857' },
              { label: 'Guests', value: overviewData.festivalOverview.totalProgrammeGuests, sub: 'Scholars', icon: UserCheck, color: '#7c3aed' },
              { label: 'Published Laurels', value: overviewData.festivalOverview.totalPublishedResults, sub: 'Verified', icon: Award, color: '#E6A916' },
              { label: 'Gallery Media', value: overviewData.festivalOverview.totalGalleryMedia, sub: 'Live Assets', icon: Activity, color: '#0284c7' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">{stat.label}</span>
                    <Icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div className="mt-2">
                    <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono">{stat.value}</div>
                    <div className="text-[10px] text-stone-400 font-medium">{stat.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3 Main Analytical Domain Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: Team Championship Leaderboard Overview */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#E6A916]" />
                  <h2 className="text-base font-bold text-stone-900 font-serif">Championship Leaderboard</h2>
                </div>
                <button
                  onClick={() => setActiveTab('teams')}
                  className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
                >
                  <span>Full Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Total Aggregate Points Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#A91F35] to-[#7f1425] text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-[#E6A916] uppercase">Aggregate Championship Score</div>
                  <div className="text-2xl font-black font-mono">{overviewData.teamOverview.totalTeamPoints.toLocaleString()} <span className="text-xs text-stone-300 font-normal">pts</span></div>
                </div>
                <div className="text-right text-[11px] text-stone-200">
                  <div>Avg: <strong>{overviewData.teamOverview.averageTeamPoints} pts</strong></div>
                  <div>12 Squads Total</div>
                </div>
              </div>

              {/* Top 5 Ranked Teams */}
              <div className="space-y-2">
                {overviewData.teamOverview.rankedTeams.slice(0, 5).map((t, idx) => (
                  <div
                    key={t.teamId}
                    className="p-3 rounded-xl bg-[#F7F3E9]/50 border border-stone-200/80 flex items-center justify-between hover:bg-[#F7F3E9] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                        idx === 0 ? 'bg-[#E6A916] text-[#A91F35]' : idx === 1 ? 'bg-stone-300 text-stone-800' : idx === 2 ? 'bg-amber-600/30 text-amber-900' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{t.teamName} <span className="text-[10px] font-mono text-stone-400">({t.teamCode})</span></div>
                        <div className="text-[10px] text-stone-500">{t.subname || 'Central Campus'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-black text-[#A91F35]">{t.points.toLocaleString()} pts</div>
                      <div className="text-[9px] text-stone-400">{t.firsts} Gold • {t.seconds} Silver • {t.thirds} Bronze</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Competition Category Breakdown (Donut Visualization) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-[#A91F35]" />
                  <h2 className="text-base font-bold text-stone-900 font-serif">Official Competitions Overview</h2>
                </div>
                <button
                  onClick={() => setActiveTab('competitions')}
                  className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
                >
                  <span>Events</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Category distribution bars */}
              <div className="space-y-3 pt-1">
                {overviewData.competitionOverview.categories.map((cat, idx) => {
                  const pct = Math.round((cat.count / overviewData.festivalOverview.totalCompetitions) * 100);
                  const colors = ['#A91F35', '#E6A916', '#047857', '#4338ca', '#b45309'];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800">{cat.name}</span>
                        <span className="text-[11px] font-mono font-semibold text-stone-500">{cat.count} Events ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: barColor }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-400">
                        <span>Participants Enrolled: {cat.registrations}</span>
                        <span>Published: {cat.publishedCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status summary pill */}
              <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <div className="font-black text-sm">{overviewData.competitionOverview.publishedResults}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Published Laurels</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
                  <div className="font-black text-sm">{overviewData.competitionOverview.pendingEvaluations}</div>
                  <div className="text-[10px] text-amber-600 font-medium">Awaiting Adjudication</div>
                </div>
              </div>
            </div>

            {/* Panel 3: Programme Schedule & Guests Overview */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#4338ca]" />
                  <h2 className="text-base font-bold text-stone-900 font-serif">Programme Operations</h2>
                </div>
                <button
                  onClick={() => setActiveTab('programmes')}
                  className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
                >
                  <span>Timeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Operational Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F7F3E9] border border-stone-200/80">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Scheduled</div>
                  <div className="text-xl font-black text-stone-900 font-mono mt-1">
                    {overviewData.programmeOverview.scheduledProgrammes}
                  </div>
                  <div className="text-[10px] text-stone-400">Day 01 & 02</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F3E9] border border-stone-200/80">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Completed</div>
                  <div className="text-xl font-black text-emerald-600 font-mono mt-1">
                    {overviewData.programmeOverview.completedProgrammes}
                  </div>
                  <div className="text-[10px] text-stone-400">Archived</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F3E9] border border-stone-200/80">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Guest Keynotes</div>
                  <div className="text-xl font-black text-[#7c3aed] font-mono mt-1">
                    {overviewData.festivalOverview.totalProgrammeGuests}
                  </div>
                  <div className="text-[10px] text-stone-400">Scholars & Dignitaries</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F3E9] border border-stone-200/80">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Adjudicators</div>
                  <div className="text-xl font-black text-[#047857] font-mono mt-1">
                    {overviewData.festivalOverview.totalJudges}
                  </div>
                  <div className="text-[10px] text-stone-400">Registered Panels</div>
                </div>
              </div>

              {/* Programme Category Pills */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="text-[11px] font-bold text-stone-500 uppercase">Programmes by Taxonomy</div>
                <div className="flex flex-wrap gap-1.5">
                  {overviewData.programmeOverview.categories.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold">
                      {c.name}: <strong>{c.count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 2: TEAM PERFORMANCE REPORT                                            */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          {/* Points Comparison Visual Bar Chart */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-stone-900 font-serif">Official Championship Points Comparison</h2>
                <p className="text-xs text-stone-500">Visual score breakdown across all 12 registered teams</p>
              </div>
              <button
                onClick={() => exportToCsv('teams')}
                className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] text-[#A91F35] text-xs font-bold hover:bg-[#A91F35] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Horizontal Bar Chart of Team Points */}
            <div className="space-y-2.5 pt-2">
              {teamReports.map((team, idx) => {
                const maxPoints = teamReports[0]?.totalPoints || 3000;
                const percentage = Math.max(8, Math.round((team.totalPoints / maxPoints) * 100));

                return (
                  <div key={team.teamId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-[11px] font-mono font-black text-stone-400">#{team.currentRank}</span>
                        <span className="font-bold text-stone-900">{team.teamName}</span>
                        <span className="text-[10px] font-mono text-stone-400">({team.teamCode})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-stone-400 hidden sm:inline">
                          {team.firstPositions} Gold • {team.secondPositions} Silver • {team.thirdPositions} Bronze
                        </span>
                        <span className="font-mono font-black text-[#A91F35]">{team.totalPoints.toLocaleString()} pts</span>
                      </div>
                    </div>
                    <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          background: idx === 0 ? 'linear-gradient(90deg, #E6A916, #b45309)' : idx === 1 ? 'linear-gradient(90deg, #A91F35, #7f1425)' : '#A91F35'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Team Performance Data Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-serif">Comprehensive Team Roster & Performance Ledger</h3>
              <span className="text-xs text-stone-400 font-medium">Showing {teamReports.length} Teams</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Team Name & Code</th>
                    <th className="py-3 px-4">Squad Leader</th>
                    <th className="py-3 px-4 text-center">Roster</th>
                    <th className="py-3 px-4 text-center">Registrations</th>
                    <th className="py-3 px-4 text-center">Laurels (1st / 2nd / 3rd)</th>
                    <th className="py-3 px-4 text-right">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {teamReports.map((t) => (
                    <tr key={t.teamId} className="hover:bg-[#F7F3E9]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-black">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                          t.currentRank === 1 ? 'bg-[#E6A916] text-[#A91F35] font-black' : t.currentRank === 2 ? 'bg-stone-200 text-stone-800' : t.currentRank === 3 ? 'bg-amber-100 text-amber-800' : 'text-stone-500'
                        }`}>
                          {t.currentRank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{t.teamName}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{t.teamCode} • {t.subname || 'Ayiroor'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-stone-800 font-semibold">{t.leader}</div>
                        <div className="text-[10px] text-stone-400">{t.leaderContact}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-stone-700">
                        {t.totalStudents}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-stone-700">
                        {t.totalCompetitionRegistrations}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200" title="First Prize">
                            🥇 {t.firstPositions}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-bold border border-stone-200" title="Second Prize">
                            🥈 {t.secondPositions}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold border border-orange-200" title="Third Prize">
                            🥉 {t.thirdPositions}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-[#A91F35] text-sm">
                        {t.totalPoints.toLocaleString()} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 3: STUDENT PERFORMANCE REPORT                                         */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Individual Student Performance Ledger</h3>
                <p className="text-xs text-stone-500">Student enrollment records, event participation slots, and official laureate awards</p>
              </div>
              <button
                onClick={() => exportToCsv('students')}
                className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] text-[#A91F35] text-xs font-bold hover:bg-[#A91F35] hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Chest No & ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Assigned Team</th>
                    <th className="py-3 px-4">Division</th>
                    <th className="py-3 px-4 text-center">Registered Events</th>
                    <th className="py-3 px-4 text-center">Laurels Won</th>
                    <th className="py-3 px-4 text-right">Awarded Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {studentReports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-stone-400">
                        No student records match the active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    studentReports.map((s) => (
                      <tr key={s.studentId} className="hover:bg-[#F7F3E9]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-[#A91F35] bg-[#A91F35]/10 px-2 py-0.5 rounded">
                            {s.chestNo}
                          </span>
                          <div className="text-[10px] text-stone-400 mt-0.5">{s.studentId}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{s.name}</div>
                          <div className="text-[10px] text-stone-500">{s.institution}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800">{s.teamName}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                            {s.classCategory}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-semibold text-stone-700">
                          {s.registeredCount} Events
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {s.prizesCount > 0 ? (
                            <div className="space-y-1">
                              {s.results.map((r, ri) => (
                                <span
                                  key={ri}
                                  className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6A916]/20 text-amber-900 border border-[#E6A916]/40"
                                >
                                  {r.position} ({r.points} pts)
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-stone-400 italic">No awards yet</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-[#A91F35]">
                          {s.totalPoints > 0 ? `${s.totalPoints} pts` : '—'}
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

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 4: COMPETITION REPORTS                                                */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'competitions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Festival Competitions & Evaluation Status</h3>
                <p className="text-xs text-stone-500">Adjudication tracking, assigned judges, and verified winner podiums</p>
              </div>
              <button
                onClick={() => exportToCsv('competitions')}
                className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] text-[#A91F35] text-xs font-bold hover:bg-[#A91F35] hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Event Code</th>
                    <th className="py-3 px-4">Competition Title</th>
                    <th className="py-3 px-4">Classification & Category</th>
                    <th className="py-3 px-4 text-center">Participants</th>
                    <th className="py-3 px-4 text-center">Judges</th>
                    <th className="py-3 px-4">Adjudication Status</th>
                    <th className="py-3 px-4">Verified Podium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {competitionReports.map((c) => (
                    <tr key={c.competitionId} className="hover:bg-[#F7F3E9]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#A91F35]">
                        {c.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{c.title}</div>
                        <div className="text-[10px] text-stone-400">{c.venue} • {c.date}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800">{c.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold">
                        {c.registeredParticipantsCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold">
                        {c.assignedJudgesCount} Judges
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.evaluationStatus === 'Published'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : c.evaluationStatus === 'Under Verification'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            c.evaluationStatus === 'Published' ? 'bg-emerald-500' : c.evaluationStatus === 'Under Verification' ? 'bg-amber-500' : 'bg-stone-400'
                          }`} />
                          <span>{c.evaluationStatus}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {c.winners.length > 0 ? (
                          <div className="space-y-0.5 text-[10px]">
                            <div className="font-bold text-stone-900">
                              🥇 {c.winners[0]?.name} <span className="text-stone-400 font-normal">({c.winners[0]?.teamName})</span>
                            </div>
                            {c.winners[1] && (
                              <div className="text-stone-700">
                                🥈 {c.winners[1]?.name} <span className="text-stone-400">({c.winners[1]?.teamName})</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-400 italic">Pending publication</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 5: JUDGE ACTIVITY REPORT                                              */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'judges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Adjudicator Panel Activity & Evaluation Tracking</h3>
                <p className="text-xs text-stone-500">Evaluation progress per registered judge without exposing confidential rubric sheets</p>
              </div>
              <button
                onClick={() => exportToCsv('judges')}
                className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] text-[#A91F35] text-xs font-bold hover:bg-[#A91F35] hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Judge ID</th>
                    <th className="py-3 px-4">Adjudicator Name</th>
                    <th className="py-3 px-4">Institution & Academic Title</th>
                    <th className="py-3 px-4 text-center">Assigned Events</th>
                    <th className="py-3 px-4 text-center">Submitted Sheets</th>
                    <th className="py-3 px-4">Completion Progress</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {judgeReports.map((j) => (
                    <tr key={j.judgeId} className="hover:bg-[#F7F3E9]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#A91F35]">
                        {j.judgeId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{j.name}</div>
                        <div className="text-[10px] text-stone-400">{j.qualification}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-stone-800">{j.institution}</div>
                        <div className="text-[10px] text-stone-400">{j.designation}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        {j.assignedCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                        {j.submittedCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono font-bold">
                            <span>{j.completionPercentage}%</span>
                            <span className="text-stone-400">{j.submittedCount}/{j.assignedCount}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#A91F35]"
                              style={{ width: `${j.completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          j.completionStatus === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : j.completionStatus === 'In Progress'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          <span>{j.completionStatus}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 6: PROGRAMME REPORTS                                                  */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'programmes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Master Festival Programme Operations</h3>
                <p className="text-xs text-stone-500">Stage timelines, keynote dignitaries, and operational status</p>
              </div>
              <button
                onClick={() => exportToCsv('programmes')}
                className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] text-[#A91F35] text-xs font-bold hover:bg-[#A91F35] hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Session Title</th>
                    <th className="py-3 px-4">Taxonomy</th>
                    <th className="py-3 px-4">Date & Timing</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Guest / Dignitary</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {programmeReports.map((p) => (
                    <tr key={p.programmeId} className="hover:bg-[#F7F3E9]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#A91F35]">
                        {p.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{p.title}</div>
                        {p.malayalamTitle && <div className="text-[10px] text-stone-400 font-serif">{p.malayalamTitle}</div>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800">{p.category}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-800">{p.date}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{p.time}</div>
                      </td>
                      <td className="py-3.5 px-4 text-stone-800">
                        {p.venue}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.guestName ? (
                          <div className="font-semibold text-[#7c3aed] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{p.guestName}</span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Festival Secretariat</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 7: RESULTS & LAUREATES REPORT                                         */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">Official Verified Laureates & Score Folio</h3>
                <p className="text-xs text-stone-500">Every official competition laureate and verified allocated championship points</p>
              </div>
              <button
                onClick={() => exportToCsv('results')}
                className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] text-[#A91F35] text-xs font-bold hover:bg-[#A91F35] hover:text-white transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Laureate Name & Chest No</th>
                    <th className="py-3 px-4">Representing Team</th>
                    <th className="py-3 px-4">Competition Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-right">Awarded Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {resultsData.winnersList.map((w, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F3E9]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs ${
                          w.rank === 1 ? 'bg-[#E6A916]/20 text-amber-900 border border-[#E6A916]/40 font-black' : w.rank === 2 ? 'bg-stone-100 text-stone-800 border border-stone-200' : 'bg-orange-50 text-orange-900 border border-orange-200'
                        }`}>
                          {w.rank === 1 ? '🥇 1st Prize' : w.rank === 2 ? '🥈 2nd Prize' : '🥉 3rd Prize'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{w.name}</div>
                        <div className="text-[10px] text-[#A91F35] font-mono font-bold">{w.chestNo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800">{w.teamName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-stone-900 font-semibold">{w.competitionTitle}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{w.competitionCode}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-stone-700">{w.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-stone-800">
                        {w.score}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-[#A91F35]">
                        +{w.points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 8: FESTIVAL ACTIVITY REPORT                                           */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 font-serif">Comprehensive Festival Audit Trail & Telemetry</h2>
              <p className="text-xs text-stone-500">Live operational ledger recording admin actions, mark entries, publications and circular dispatches</p>
            </div>

            <div className="space-y-3">
              {activityData.recentAuditTrail.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#A91F35] text-white text-[10px] font-bold">
                        {log.action}
                      </span>
                      <span className="text-xs font-bold text-stone-900">{log.user || 'Admin'}</span>
                    </div>
                    <div className="text-xs text-stone-600">{log.details}</div>
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 self-start sm:self-auto">
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DEDICATED PRINTABLE PDF MODAL (HIGH INSTITUTIONAL ACCURACY)            */}
      {/* ========================================================================= */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-300">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#A91F35] to-[#7f1425] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-[#E6A916]" />
                <div>
                  <h3 className="font-serif font-black text-base">Print Official Festival Report</h3>
                  <p className="text-[11px] text-stone-200">Format: Standard Institutional A4 • Print Preview</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-[#E6A916] text-[#A91F35] text-xs font-black hover:bg-[#f0b52b] transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Send to Printer</span>
                </button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 overflow-y-auto flex-1 bg-white text-stone-900 space-y-6 font-sans">
              {/* Official Header */}
              <div className="border-b-2 border-[#A91F35] pb-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/dalenzia_fest_logo.png"
                    alt="Dalenzia Fest Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <div>
                    <h1 className="text-xl font-serif font-black text-[#A91F35] tracking-tight">
                      DALENZIA FEST 2K26 – NUEVA ERA
                    </h1>
                    <div className="text-xs font-bold text-stone-700">Central Control Centre • Official Secretariat Audit</div>
                    <div className="text-[10px] text-stone-500">Dalailussunna Dars, Ayiroor, Malappuram, Kerala 679580</div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-600 font-mono">
                  <div>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div>Report: <strong>{printReportType.toUpperCase()}</strong></div>
                  <div>Ref: FEST-REP-2K26</div>
                </div>
              </div>

              {/* Report Summary Cards */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-[#F7F3E9] rounded-2xl border border-stone-200">
                <div>
                  <div className="text-[10px] text-stone-500 uppercase font-bold">Total Students</div>
                  <div className="text-lg font-black font-mono text-[#A91F35]">{overviewData.festivalOverview.totalStudents}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 uppercase font-bold">Total Teams</div>
                  <div className="text-lg font-black font-mono text-stone-900">{overviewData.festivalOverview.totalTeams}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 uppercase font-bold">Competitions</div>
                  <div className="text-lg font-black font-mono text-stone-900">{overviewData.festivalOverview.totalCompetitions}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500 uppercase font-bold">Championship Score</div>
                  <div className="text-lg font-black font-mono text-[#E6A916]">{overviewData.teamOverview.totalTeamPoints.toLocaleString()}</div>
                </div>
              </div>

              {/* Tabular Output in Print Preview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {printReportType === 'teams' ? 'Championship Team Rankings' : printReportType === 'students' ? 'Student Roster & Awards' : printReportType === 'results' ? 'Official Laureates' : 'Festival Summary Roster'}
                </h3>

                <table className="w-full text-left border-collapse text-xs border border-stone-200">
                  <thead>
                    <tr className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold uppercase text-[9px]">
                      <th className="p-2 border-r border-stone-200">Rank / ID</th>
                      <th className="p-2 border-r border-stone-200">Name / Title</th>
                      <th className="p-2 border-r border-stone-200">Squad / Venue</th>
                      <th className="p-2 border-r border-stone-200 text-center">Laurels</th>
                      <th className="p-2 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {teamReports.slice(0, 12).map((t, i) => (
                      <tr key={i} className="hover:bg-stone-50">
                        <td className="p-2 border-r border-stone-200 font-mono font-bold">#{t.currentRank} ({t.teamCode})</td>
                        <td className="p-2 border-r border-stone-200 font-bold">{t.teamName}</td>
                        <td className="p-2 border-r border-stone-200">{t.subname || 'Ayiroor'}</td>
                        <td className="p-2 border-r border-stone-200 text-center font-mono">
                          {t.firstPositions}G • {t.secondPositions}S • {t.thirdPositions}B
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-[#A91F35]">{t.totalPoints.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Secretariat Sign-off */}
              <div className="pt-12 border-t border-stone-200 grid grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="h-10 border-b border-stone-300 mx-auto w-36 mb-1" />
                  <div className="font-bold text-stone-800">Fest Controller</div>
                  <div className="text-[10px] text-stone-400">Dalenzia Fest Secretariat</div>
                </div>
                <div>
                  <div className="h-10 border-b border-stone-300 mx-auto w-36 mb-1" />
                  <div className="font-bold text-stone-800">Chief Adjudicator</div>
                  <div className="text-[10px] text-stone-400">Jury & Evaluation Board</div>
                </div>
                <div>
                  <div className="h-10 border-b border-stone-300 mx-auto w-36 mb-1" />
                  <div className="font-bold text-stone-800">Principal & Rector</div>
                  <div className="text-[10px] text-stone-400">Dalailussunna Dars, Ayiroor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
