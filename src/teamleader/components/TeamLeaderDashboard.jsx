import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Calendar,
  Award,
  Crown,
  CalendarDays,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Clock,
  Shield,
  CheckCircle2,
  Layers,
  UserCheck,
  ChevronRight,
  Megaphone,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderDashboard({ teamId, onNavigateModule }) {
  const [stats, setStats] = useState(() => festivalStore.getTeamLeaderDashboardStats(teamId));
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const refreshStats = () => {
    setLoading(true);
    setTimeout(() => {
      setStats(festivalStore.getTeamLeaderDashboardStats(teamId));
      setLastRefreshed(new Date());
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setStats(festivalStore.getTeamLeaderDashboardStats(teamId));
    });
    return () => unsub();
  }, [teamId]);

  return (
    <div className="space-y-6">
      {/* 1. HERO OPERATIONAL BANNER */}
      <div className="bg-linear-to-r from-[#A91F35] via-[#8B1A2C] to-[#5c0f1b] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E6A916] text-[11px] font-bold tracking-wide uppercase border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Squad Command Centre • {stats.teamName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white flex items-center gap-3">
              <span>{stats.teamName}</span>
              <span className="text-[#E6A916] text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-white/10 border border-[#E6A916]/30">
                RANK #{stats.currentTeamRank}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
              Official team portal for {stats.teamName} (Leader: <strong>{stats.teamLeaderName}</strong>). Manage student enrollment, competition registrations, track live jury standings, and view official festival results.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 text-center sm:text-right">
              <div className="text-[10px] text-[#E6A916] uppercase font-bold tracking-wider">Official Championship Points</div>
              <div className="text-3xl font-serif font-black text-white">{stats.currentTeamPoints} <span className="text-xs font-sans text-white/70">pts</span></div>
            </div>

            <button
              onClick={refreshStats}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all active:scale-95"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Sync Indicator */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Database Synchronized with Main Admin & Convener Portals</span>
          </div>
          <span>Last Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* 2. INSTITUTIONAL SQUAD ATTRIBUTES & ALLOCATION METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Team', value: stats.teamName, sub: `Code: ${stats.teamCode}`, icon: Shield, color: '#A91F35', mod: 'myteam' },
          { label: 'Leader', value: stats.teamLeaderName, sub: 'Squad Leader', icon: Crown, color: '#b45309', mod: 'profile' },
          { label: 'Asst Leader', value: stats.asstLeaderName, sub: 'Assistant Leader', icon: Crown, color: '#d97706', mod: 'profile' },
          { label: 'Total Members', value: `${stats.totalTeamMembers} / 22`, sub: 'Official Roster', icon: Users, color: '#A91F35', mod: 'students' },
          { label: 'Allocated', value: stats.allocatedStudents, sub: 'Active Squad', icon: UserCheck, color: '#047857', mod: 'students' },
          { label: 'Unallocated', value: stats.unallocatedStudents || 0, sub: 'In Registry', icon: AlertCircle, color: '#4338ca', mod: 'students' },
          { label: 'Profile', value: `${stats.profileCompletion}%`, sub: 'Setup Complete', icon: Sparkles, color: '#059669', mod: 'profile' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigateModule && onNavigateModule(kpi.mod)}
              className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-[#A91F35]/40 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{kpi.label}</span>
                <Icon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" style={{ color: kpi.color }} />
              </div>
              <div className="my-1.5">
                <div className="text-base sm:text-lg font-serif font-black text-stone-900 group-hover:text-[#A91F35] transition-colors truncate">
                  {kpi.value}
                </div>
                <div className="text-[10px] text-stone-400 font-medium truncate">{kpi.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2B. CATEGORY-WISE STUDENT BREAKDOWN CARD */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
              <Users className="w-4 h-4 text-[#A91F35]" />
              <span>Category-Wise Student Distribution ({stats.allocatedStudents} Allocated)</span>
            </h2>
            <p className="text-[11px] text-stone-500">Official Dalenzia 2K26 scholar category division</p>
          </div>
          <button
            onClick={() => onNavigateModule && onNavigateModule('students')}
            className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1"
          >
            <span>Full Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Minor Category</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 font-serif">{stats.categoryCounts?.Minor || 0}</span>
              <span className="text-[10px] text-stone-500">Students</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Sub Junior Category</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 font-serif">{stats.categoryCounts?.SubJunior || 0}</span>
              <span className="text-[10px] text-stone-500">Students</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">Junior Category</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 font-serif">{stats.categoryCounts?.Junior || 0}</span>
              <span className="text-[10px] text-stone-500">Students</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900">Senior Category</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 font-serif">{stats.categoryCounts?.Senior || 0}</span>
              <span className="text-[10px] text-stone-500">Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTION SHORTCUTS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 font-serif">Squad Management Shortcuts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Add Existing Student', icon: UserCheck, mod: 'students', color: '#A91F35' },
            { label: 'Register Competition', icon: Trophy, mod: 'competitions', color: '#d97706' },
            { label: 'Register Programme', icon: Calendar, mod: 'programmes', color: '#4338ca' },
            { label: 'View Published Results', icon: Award, mod: 'results', color: '#047857' },
            { label: 'Export Squad Reports', icon: FileSpreadsheet, mod: 'reports', color: '#0284c7' }
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigateModule && onNavigateModule(act.mod)}
                className="p-3.5 rounded-2xl bg-[#F7F3E9]/60 hover:bg-[#F7F3E9] border border-stone-200/80 hover:border-[#A91F35]/40 transition-all text-left space-y-2 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" style={{ color: act.color }} />
                </div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#A91F35] transition-colors">
                  {act.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DUAL SPLIT: RECENT SQUAD STUDENTS & RECENT REGISTRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Squad Members */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#A91F35]" />
              <h3 className="text-base font-bold text-stone-900 font-serif">Squad Members</h3>
            </div>
            <button
              onClick={() => onNavigateModule && onNavigateModule('students')}
              className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
            >
              <span>Manage Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {stats.recentStudents.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No students added yet. Click 'Manage Roster' to enroll students into your squad.
              </div>
            ) : (
              stats.recentStudents.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-2xl bg-[#F7F3E9]/40 border border-stone-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#A91F35] text-white flex items-center justify-center font-bold text-xs">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">{s.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Chest No: <strong className="text-[#A91F35]">{s.chestNo}</strong> | {s.category}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                    {s.compCategory || 'Active'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Competition Registrations */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900 font-serif">Registered Competitions</h3>
            </div>
            <button
              onClick={() => onNavigateModule && onNavigateModule('competitions')}
              className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {stats.recentRegistrations.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No competition registrations recorded yet. Click 'View All' to register candidates.
              </div>
            ) : (
              stats.recentRegistrations.map((comp) => (
                <div
                  key={comp.id}
                  className="p-3 rounded-2xl bg-[#F7F3E9]/40 border border-stone-200/80 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">{comp.competitionTitle}</div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      {comp.competitionCode} • {comp.venue}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    Enrolled
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. LATEST OFFICIAL RESULTS & AWARDS */}
      {stats.recentResults.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E6A916]" />
              <h3 className="text-base font-bold text-stone-900 font-serif">Latest Official Laurels & Podium Awards</h3>
            </div>
            <button
              onClick={() => onNavigateModule && onNavigateModule('results')}
              className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
            >
              <span>Full Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.recentResults.map((poster) => {
              const firstMatch = poster.firstPrize?.teamId === teamId;
              const secondMatch = poster.secondPrize?.teamId === teamId;
              const thirdMatch = poster.thirdPrize?.teamId === teamId;
              const medalText = firstMatch ? '🥇 1st Place' : secondMatch ? '🥈 2nd Place' : '🥉 3rd Place';
              const winnerName = firstMatch ? poster.firstPrize?.name : secondMatch ? poster.secondPrize?.name : poster.thirdPrize?.name;
              const points = firstMatch ? poster.firstPrize?.points : secondMatch ? poster.secondPrize?.points : poster.thirdPrize?.points;

              return (
                <div
                  key={poster.id}
                  className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-900">{medalText}</span>
                      <span className="text-[10px] font-mono text-stone-500">{poster.competitionCode}</span>
                    </div>
                    <div className="text-xs font-bold text-stone-900">{poster.competitionTitle}</div>
                    <div className="text-[10px] text-stone-600">Winner: <strong>{winnerName}</strong></div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-xl bg-[#A91F35] text-white font-mono font-bold text-xs">
                      +{points} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
