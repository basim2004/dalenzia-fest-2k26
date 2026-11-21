import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Calendar,
  Shield,
  Award,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Clock,
  Compass,
  CheckCircle2,
  Layers,
  UserPlus,
  UserCheck,
  ChevronRight,
  Building2,
  CalendarDays,
  ClipboardList,
  LifeBuoy
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerDashboard({ onNavigateModule }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(() => festivalStore.getConvenerDashboardStats());
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const refreshStats = () => {
    setLoading(true);
    setTimeout(() => {
      setStats(festivalStore.getConvenerDashboardStats());
      setLastRefreshed(new Date());
      setLoading(false);
    }, 200);
  };

  const kpis = [
    { label: 'Students', value: stats.totalStudents, sub: 'Registered', icon: UserCheck, color: '#A91F35', mod: 'students' },
    { label: 'Teams', value: stats.totalTeams, sub: 'Championship', icon: Users, color: '#b45309', mod: 'teams' },
    { label: 'Programmes', value: stats.totalProgrammes, sub: 'Master Stages', icon: Calendar, color: '#4338ca', mod: 'programmes' },
    { label: 'Events', value: stats.totalEvents, sub: 'Competitions', icon: Trophy, color: '#d97706', mod: 'events' },
    { label: 'Judges', value: stats.totalJudges, sub: `${stats.activeJudges} Active`, icon: Shield, color: '#047857', mod: 'judges' },
    { label: 'Guests', value: stats.totalGuests, sub: 'VIP Scholars', icon: UserPlus, color: '#7c3aed', mod: 'guests' },
    { label: 'Stages', value: stats.totalStages, sub: 'Configured', icon: Compass, color: '#0284c7', mod: 'venues' },
    { label: 'Helpdesk', value: festivalStore.getHelpdeskTickets().filter(t => t.status === 'Pending').length, sub: 'Pending Issues', icon: LifeBuoy, color: '#e11d48', mod: 'helpdesk' }
  ];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HERO OPERATIONAL BANNER                                                */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#A91F35] via-[#8B1A2C] to-[#5c0f1b] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E6A916] text-[11px] font-bold tracking-wide uppercase border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Convener Operational Command • Live Secretariat Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white flex items-center gap-3">
              <span>Festival Operations Overview</span>
              <span className="text-[#E6A916] text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 border border-[#E6A916]/30">
                NUEVA ERA 2K26
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
              Unified day-to-day command centre for Dalailussunna Dars, Ayiroor. Oversee student participation, team allocations, master schedules, keynote dignitaries, and stage logistical readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshStats}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync System</span>
            </button>
          </div>
        </div>

        {/* Live System Synchronization Pill */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Database Status: <strong>Synchronized with Main Admin Panel</strong></span>
          </div>
          <span>Last Verified: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EIGHT OPERATIONAL KPI CARDS                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateModule && onNavigateModule(kpi.mod)}
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-[#A91F35]/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">{kpi.label}</span>
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <div className="mt-2">
                <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono">{kpi.value}</div>
                <div className="text-[10px] text-stone-400 font-medium">{kpi.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. OPERATIONAL ALERTS NOTIFICATION BANNER                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {stats.operationalAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 shadow-xs ${
              alert.type === 'warning'
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : alert.type === 'info'
                ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}
          >
            <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
              alert.type === 'warning' ? 'text-amber-600' : alert.type === 'info' ? 'text-blue-600' : 'text-emerald-600'
            }`} />
            <div className="space-y-0.5">
              <div className="font-bold">{alert.title}</div>
              <div className="text-[11px] opacity-90">{alert.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. QUICK ACTION SHORTCUTS (CONVENER OPERATIONS)                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-stone-900 font-serif">Quick Action Shortcuts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Register Student', icon: UserCheck, mod: 'students', color: '#A91F35' },
            { label: 'Event Assignments', icon: Layers, mod: 'assignments', color: '#d97706' },
            { label: 'Results & Publish', icon: Award, mod: 'results', color: '#A91F35' },
            { label: 'Add Programme', icon: Calendar, mod: 'programmes', color: '#4338ca' },
            { label: 'Invite Guest', icon: UserPlus, mod: 'guests', color: '#7c3aed' },
            { label: 'Schedule Session', icon: CalendarDays, mod: 'schedule', color: '#047857' },
            { label: 'Operational Tasks', icon: ClipboardList, mod: 'activities', color: '#b91c1c' }
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigateModule && onNavigateModule(act.mod)}
                className="p-3.5 rounded-2xl bg-[#F7F3E9]/60 hover:bg-[#F7F3E9] border border-stone-200/80 hover:border-[#A91F35]/40 transition-all text-left space-y-2 group"
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

      {/* ========================================================================= */}
      {/* 5. DUAL SPLIT: UPCOMING SESSIONS & RECENT ROSTER ENROLLMENTS              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upcoming Programmes */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#A91F35]" />
              <h3 className="text-base font-bold text-stone-900 font-serif">Upcoming Stage Programmes</h3>
            </div>
            <button
              onClick={() => onNavigateModule && onNavigateModule('programmes')}
              className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {stats.upcomingProgrammes.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200/80 flex items-center justify-between gap-3 hover:bg-[#F7F3E9] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#A91F35] text-white text-[10px] font-bold font-mono">
                      {p.code}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500">{p.date} • {p.time}</span>
                  </div>
                  <div className="text-xs font-bold text-stone-900 line-clamp-1">{p.title}</div>
                  <div className="text-[10px] text-stone-400">{p.venue}</div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold shrink-0">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Student Registrations */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#047857]" />
              <h3 className="text-base font-bold text-stone-900 font-serif">Recent Candidate Registrations</h3>
            </div>
            <button
              onClick={() => onNavigateModule && onNavigateModule('students')}
              className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
            >
              <span>View Registry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {stats.recentStudents.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200/80 flex items-center justify-between gap-3 hover:bg-[#F7F3E9] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#A91F35]/10 text-[#A91F35] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {s.chestNo}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{s.name}</div>
                    <div className="text-[10px] text-stone-500">{s.teamName} • {s.classCategory}</div>
                  </div>
                </div>

                <div className="text-right text-[10px] text-stone-400">
                  <div className="font-mono text-stone-600 font-bold">{s.id}</div>
                  <div>{s.registeredAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. RECENT OPERATIONAL AUDIT TRAIL                                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#b45309]" />
            <h3 className="text-base font-bold text-stone-900 font-serif">Recent Operational Change Trail</h3>
          </div>
          <button
            onClick={() => onNavigateModule && onNavigateModule('audit')}
            className="text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C] flex items-center gap-1"
          >
            <span>Full Audit Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {stats.recentActivities.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#FAF7F0] border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#A91F35] text-white text-[10px] font-bold">
                    {log.action}
                  </span>
                  <span className="font-bold text-stone-800">{log.performedBy || 'Convener'}</span>
                </div>
                <div className="text-stone-600 text-[11px]">{log.details}</div>
              </div>
              <div className="text-[10px] font-mono text-stone-400 self-start sm:self-auto shrink-0">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
