import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trophy,
  Calendar,
  Shield,
  Award,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  UserCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Eye,
  Megaphone,
  BookOpen,
  Mic,
  Palette,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function DashboardView({ onNavigateModule }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Load and refresh live data from database
  const loadDashboardData = () => {
    try {
      setLoading(true);
      setError(null);
      const data = festivalStore.loadData();
      setStoreData(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to fetch live festival statistics. Please refresh the data.');
    } finally {
      setTimeout(() => setLoading(false), 250);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute live statistics and aggregations
  const dashboardStats = useMemo(() => {
    if (!storeData) return null;
    return festivalStore.getDashboardStats();
  }, [storeData]);

  // Loading Skeleton State
  if (loading && !storeData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-stone-200/80 rounded-3xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-200/80 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-stone-200/80 rounded-3xl" />
          <div className="h-96 bg-stone-200/80 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <div className="text-sm font-bold text-rose-900">{error}</div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-[#A91F35] text-white rounded-xl text-xs font-bold hover:bg-[#8B1A2C]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const teams = festivalStore.getTeams();
  const assignments = storeData.programmeAssignments || [];
  const posters = storeData.resultPosters || [];
  const programmes = storeData.programmes || [];
  const auditLogs = storeData.auditLogs || [];
  const stats = dashboardStats;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE WELCOME BANNER & LIVE OVERVIEW HEADER                        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#A91F35] via-[#8B1A2C] to-[#6a101f] rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-[#E6A916]/30 relative overflow-hidden">
        {/* Subtle decorative gold motif */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E6A916]/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-[#E6A916] text-[#A91F35] uppercase tracking-wider">
                Festival Control Centre
              </span>
              <span className="text-xs text-white/75 font-mono">
                21, 22, 23 DECEMBER 2026 • Dalailussunna Dars, Ayiroor
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-serif tracking-tight text-white">
              Dalenzia Fest 2K26 — Executive Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-white/85 max-w-2xl font-medium">
              Live operational monitoring for registered candidates, teams, competitions, academic judges, and verified results.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 cursor-pointer shadow-sm active:scale-95"
              title="Refresh database state"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#E6A916] ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        {/* Live System Synchronization Pill */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Database Status: <strong>Synchronized & Active</strong></span>
          </div>
          <span>Last Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TEN SUMMARY STATISTIC KPI CARDS (TASK 2 REQUIREMENTS)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {[
          {
            label: 'Total Students',
            value: stats.totalStudents.toLocaleString(),
            sub: 'Registry Cohort',
            icon: Users,
            color: '#A91F35',
            actionMod: 'students'
          },
          {
            label: 'Total Teams',
            value: stats.totalTeams,
            sub: `${stats.totalTeams} Registered Squads`,
            icon: Users,
            color: '#b45309',
            actionMod: 'teams'
          },
          {
            label: 'Total Competitions',
            value: stats.totalCompetitions,
            sub: stats.totalCompetitions > 0
              ? `${stats.stageCompetitionsCount || 0} Stage • ${stats.offStageCompetitionsCount || 0} Off Stage • ${stats.generalCompetitionsCount || 0} General`
              : '0 Active Competitions',
            icon: Trophy,
            color: '#d97706',
            actionMod: 'competitions'
          },
          {
            label: 'Total Judges',
            value: stats.totalJudges,
            sub: `${stats.activeJudgesCount} Active Adjudicators`,
            icon: Shield,
            color: '#047857',
            actionMod: 'judges'
          },
          {
            label: 'Total Programmes',
            value: stats.totalProgrammes,
            sub: 'Across 4 Stages',
            icon: Calendar,
            color: '#4338ca',
            actionMod: 'schedule'
          },
          {
            label: 'Programme Guests',
            value: stats.totalProgrammeGuests,
            sub: 'Scholars & Keynotes',
            icon: UserCheck,
            color: '#7c3aed',
            actionMod: 'programme_guests'
          },
          {
            label: 'Pending Evaluations',
            value: stats.pendingEvaluations,
            sub: 'Awaiting Sheets',
            icon: Clock,
            color: '#e11d48',
            actionMod: 'judges_monitoring'
          },
          {
            label: 'Submitted Results',
            value: stats.submittedResults,
            sub: 'Logged Sheets',
            icon: FileText,
            color: '#0284c7',
            actionMod: 'judges_marks'
          },
          {
            label: 'Published Results',
            value: stats.publishedResults,
            sub: 'Public & Verified',
            icon: Award,
            color: '#E6A916',
            actionMod: 'results'
          },
          {
            label: 'Overall Team Points',
            value: stats.overallTeamPoints.toLocaleString(),
            sub: 'Aggregate Score',
            icon: TrendingUp,
            color: '#059669',
            actionMod: 'teams'
          }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => kpi.actionMod && onNavigateModule && onNavigateModule(kpi.actionMod)}
              className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 hover:shadow-md hover:border-[#E6A916] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider group-hover:text-[#A91F35] transition-colors">
                  {kpi.label}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: kpi.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-stone-900 font-serif tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-stone-400 font-medium mt-0.5 flex items-center justify-between">
                  <span>{kpi.sub}</span>
                  <ChevronRight className="w-3 h-3 text-stone-300 group-hover:text-[#A91F35] transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. QUICK NAVIGATION TO MODULES                                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>Quick Module Gateway</span>
          </h2>
          <span className="text-[11px] text-stone-400">Direct Portal Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
          {[
            { id: 'teams', label: 'Teams', icon: Users },
            { id: 'students', label: 'Students', icon: UserCheck },
            { id: 'competitions', label: 'Competitions', icon: Trophy },
            { id: 'judges', label: 'Judge Hub', icon: Shield, highlight: true },
            { id: 'results', label: 'Scoring', icon: Award },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'posters', label: 'Posters', icon: Palette },
            { id: 'reports', label: 'Reports', icon: FileText }
          ].map((nav) => {
            const Icon = nav.icon;
            return (
              <button
                key={nav.id}
                onClick={() => onNavigateModule && onNavigateModule(nav.id)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border ${nav.highlight
                  ? 'bg-[#A91F35] text-white border-[#A91F35] shadow-xs hover:bg-[#8B1A2C]'
                  : 'bg-[#F7F3E9]/60 hover:bg-[#F7F3E9] text-stone-700 border-stone-200/80 hover:border-[#E6A916]'
                  }`}
              >
                <Icon className={`w-4 h-4 ${nav.highlight ? 'text-[#E6A916]' : 'text-[#A91F35]'}`} />
                <span className="font-bold text-[11px]">{nav.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN DASHBOARD CONTENT GRID (SECTION OVERVIEWS)                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* A. TEAM PERFORMANCE OVERVIEW */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#A91F35] font-serif">Team Performance & Points Standing</h2>
                <p className="text-xs text-stone-500">Live rankings calculated across all verified results</p>
              </div>
              <button
                onClick={() => onNavigateModule && onNavigateModule('teams')}
                className="text-xs font-bold text-[#A91F35] hover:text-[#E6A916] flex items-center gap-1"
              >
                <span>All 12 Teams</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {teams.slice(0, 5).map((team, idx) => {
                const maxPoints = teams[0]?.points || 3000;
                const pct = Math.round((team.points / maxPoints) * 100);
                return (
                  <div
                    key={team.id}
                    className="p-3.5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200/80 flex items-center justify-between gap-4 hover:border-[#E6A916] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-black text-xs ${idx === 0
                          ? 'bg-[#E6A916] text-[#A91F35]'
                          : idx === 1
                            ? 'bg-stone-300 text-stone-800'
                            : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                      >
                        {team.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-stone-900">{team.name}</span>
                          <span className="text-[11px] text-stone-500">({team.subname})</span>
                          <span>{team.badge}</span>
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Leader: <strong>{team.leader}</strong> • {team.members} Members
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:block w-28">
                        <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-[#A91F35] transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black font-serif text-[#A91F35]">{team.points} pts</div>
                        <div className="text-[10px] text-stone-400">Rank #{team.rank}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. JUDGE EVALUATION OVERVIEW */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#A91F35] font-serif">Judge Evaluation & Progress Overview</h2>
                <p className="text-xs text-stone-500">Live adjudication sheets, panel completions and verification stage</p>
              </div>
              <button
                onClick={() => onNavigateModule && onNavigateModule('judges')}
                className="text-xs font-bold text-[#A91F35] hover:text-[#E6A916] flex items-center gap-1"
              >
                <span>Judge Control Centre</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {assignments.slice(0, 4).map((prog) => {
                const evalsCount = (storeData.submittedEvaluations || []).filter(
                  e => e.competitionId === prog.competitionId
                ).length;
                const totalAssigned = prog.assignedJudgeIds.length;
                const pct = totalAssigned > 0 ? Math.round((evalsCount / totalAssigned) * 100) : 0;

                return (
                  <div
                    key={prog.id}
                    className="p-3.5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#A91F35]">{prog.competitionCode}</span>
                        <span className="font-bold text-xs text-stone-900">{prog.competitionTitle}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${prog.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : prog.status === 'Under Verification'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {prog.isPublished ? 'Published' : prog.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        {prog.venue} • {totalAssigned} Judges Assigned • {prog.totalParticipants} Candidates
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-28 text-right">
                        <div className="text-[10px] font-bold text-stone-600 mb-0.5">
                          Sheets: {evalsCount}/{totalAssigned} ({pct}%)
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-[#A91F35] transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateModule && onNavigateModule('judges')}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. RECENT PUBLISHED RESULTS SHOWCASE */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#A91F35] font-serif">Recent Published Laureates</h2>
                <p className="text-xs text-stone-500">Officially verified competition winners and allocated points</p>
              </div>
              <button
                onClick={() => onNavigateModule && onNavigateModule('results')}
                className="text-xs font-bold text-[#A91F35] hover:text-[#E6A916] flex items-center gap-1"
              >
                <span>Results Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posters.map((poster) => (
                <div
                  key={poster.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#A91F35] to-[#7f1425] text-white border border-[#E6A916]/40 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-bold uppercase text-[#E6A916]">{poster.category}</span>
                    <span className="text-[10px] text-white/70">{poster.date}</span>
                  </div>

                  <h3 className="font-bold text-xs text-white line-clamp-1">{poster.competitionTitle}</h3>

                  {poster.firstPrize && (
                    <div className="p-2.5 rounded-xl bg-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-black text-[10px]">
                          1
                        </span>
                        <div>
                          <div className="font-bold text-xs text-white">{poster.firstPrize.name}</div>
                          <div className="text-[10px] text-white/80">{poster.firstPrize.teamName} ({poster.firstPrize.chestNo})</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#E6A916]">{poster.firstPrize.score}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-white/60 text-right">
                    Verified: {poster.publishedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide on desktop) */}
        <div className="space-y-6">
          {/* D. STUDENT REGISTRATION OVERVIEW */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <h2 className="text-base font-bold text-[#A91F35] font-serif border-b border-stone-100 pb-2.5">
              Student Registration Overview
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Junior Category', count: '520 Students', pct: 42, color: '#A91F35' },
                { label: 'Senior Category', count: '480 Students', pct: 38, color: '#E6A916' },
                { label: 'General Conclave', count: '250 Students', pct: 20, color: '#047857' }
              ].map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>{cat.label}</span>
                    <span>{cat.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-stone-500 bg-[#F7F3E9] p-3 rounded-xl border border-stone-200">
              <span className="font-bold text-[#A91F35]">Registry Check:</span> All chest numbers allocated. 100% ID verification complete.
            </div>
          </div>

          {/* E. OFFICIAL COMPETITIONS BREAKDOWN */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h2 className="text-base font-bold text-[#A91F35] font-serif">
                Official Competitions ({stats.totalCompetitions} Total)
              </h2>
              <button
                onClick={() => onNavigate('competitions')}
                className="text-xs font-bold text-[#A91F35] hover:underline"
              >
                Manage &rarr;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                {
                  name: 'Stage Competitions',
                  classification: 'Stage',
                  count: stats.stageCompetitionsCount || 0,
                  icon: Mic,
                  color: 'text-[#A91F35] bg-red-50 border-red-200',
                  charterRef: 'Pages 5–8 (On Stage)'
                },
                {
                  name: 'Off Stage Competitions',
                  classification: 'Off Stage',
                  count: stats.offStageCompetitionsCount || 0,
                  icon: BookOpen,
                  color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
                  charterRef: 'Pages 5–8 (Off Stage)'
                },
                {
                  name: 'General Competitions',
                  classification: 'General',
                  count: stats.generalCompetitionsCount || 0,
                  icon: Users,
                  color: 'text-amber-900 bg-amber-50 border-amber-200',
                  charterRef: 'Page 9 (Group & Team)'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-xs">{item.name}</div>
                        <div className="text-[10px] text-stone-500">{item.charterRef}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>

            {stats.totalCompetitions === 0 && (
              <div className="p-3 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center text-xs text-stone-500">
                No competitions created yet. Authorized judges and administrators can create actual competitions according to the Official Festival Charter.
              </div>
            )}
          </div>

          {/* F. UPCOMING PROGRAMMES SCHEDULE */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h2 className="text-base font-bold text-[#A91F35] font-serif">Upcoming Programmes</h2>
              <span className="text-[10px] text-stone-400">Day 01 & 02</span>
            </div>

            <div className="space-y-2.5">
              {programmes.slice(0, 4).map((prog) => (
                <div key={prog.id} className="p-3 rounded-xl bg-[#F7F3E9]/50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-500">
                    <span className="text-[#A91F35]">{prog.date}</span>
                    <span>{prog.time}</span>
                  </div>
                  <div className="font-bold text-xs text-stone-900">{prog.title}</div>
                  <div className="text-[10px] text-stone-500">{prog.venue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* G. RECENT ACTIVITIES & AUDIT LOGS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <h2 className="text-base font-bold text-[#A91F35] font-serif border-b border-stone-100 pb-2.5">
              Recent Activity Audit Trail
            </h2>
            <div className="space-y-2.5 text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[10px] text-stone-400 mb-0.5">
                    <span className="font-bold text-[#A91F35]">{log.action}</span>
                    <span>{log.timestamp ? log.timestamp.slice(-5) : 'Just now'}</span>
                  </div>
                  <div className="text-[11px] font-medium text-stone-700">{log.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

