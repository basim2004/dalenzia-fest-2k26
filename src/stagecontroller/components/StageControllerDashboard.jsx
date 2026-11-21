import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Volume2, Trophy, Users, CheckCircle2,
  AlertCircle, Clock, MapPin, Tv, ArrowRight,
  ShieldCheck, Play, Pause, ChevronRight, Mic2,
  Calendar, RefreshCw
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StageControllerDashboard({ 
  stageSession, 
  stageInfo, 
  stageId: propStageId, 
  onNavigate, 
  onNavigateTab, 
  onLaunchDraw, 
  onLaunchCalling 
}) {
  const [dashboard, setDashboard] = useState(null);

  const session = stageSession || stageInfo || {};
  const stageId = propStageId || session?.stageId || 'STG-01';
  const handleNav = (tab) => {
    if (onNavigate) onNavigate(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };
  const onNavigateHandler = handleNav;

  const loadData = () => {
    if (!stageId) return;
    try {
      const data = festivalStore.getStageControllerDashboard(stageId);
      setDashboard(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = festivalStore.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, [stageId]);

  const activeComp = dashboard?.activeCompetition;
  const nextComp = dashboard?.nextCompetition;
  const stats = dashboard?.stats;

  return (
    <div className="space-y-6">
      {/* 1. HERO STAGE CONTROL BANNER */}
      <div className="bg-[#A91F35] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs uppercase tracking-wider shadow-xs">
                STAGE {dashboard?.stageNumber || '01'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-white font-bold text-xs">
                {dashboard?.venue}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/80 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Operational Control
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              {dashboard?.stageName}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
              Stage Controller: <strong>{dashboard?.controllerName}</strong>. Manage random participant draws, stage entry calling, LED displays, and judge coordination.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('draw')}
              className="px-5 py-3 rounded-2xl bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Live Random Draw</span>
            </button>
            <button
              onClick={() => onNavigate('calling')}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/20 active:scale-95 flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Calling Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 7 LIVE OPERATIONAL KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Competitions', value: stats?.totalScheduled || 0, sub: 'Assigned', color: 'text-stone-900', action: 'competitions' },
          { label: 'Participants', value: stats?.totalParticipants || 0, sub: 'Registered', color: 'text-stone-900', action: 'codes' },
          { label: 'Drawn Codes', value: stats?.participantsDrawn || 0, sub: 'Order Ready', color: 'text-purple-700', action: 'draw' },
          { label: 'Called', value: stats?.participantsCalled || 0, sub: 'Announced', color: 'text-blue-700', action: 'calling' },
          { label: 'Completed', value: stats?.participantsCompleted || 0, sub: 'Performed', color: 'text-emerald-700', action: 'calling' },
          { label: 'Absent/Skip', value: stats?.participantsAbsent || 0, sub: 'Not Reported', color: 'text-rose-700', action: 'calling' },
          { label: 'Remaining', value: stats?.remainingParticipants || 0, sub: 'In Queue', color: 'text-[#A91F35]', action: 'calling' }
        ].map((kpi, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(kpi.action)}
            className="p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-[#A91F35]/40 hover:shadow-xs transition-all text-left"
          >
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider truncate">
              {kpi.label}
            </div>
            <div className={`text-xl font-serif font-black ${kpi.color} mt-0.5`}>
              {kpi.value}
            </div>
            <div className="text-[10px] text-stone-400 font-medium truncate mt-0.5">
              {kpi.sub}
            </div>
          </button>
        ))}
      </div>

      {/* 3. CURRENT STAGE ACTIVITY & UPCOMING SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Currently Running / Active Competition */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#A91F35]/10 text-[#A91F35]">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-stone-900">
                    Current Stage Activity
                  </h3>
                  <p className="text-[11px] text-stone-500">Active arena on {dashboard?.shortName}</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                activeComp?.operationalStatus === 'Ongoing'
                  ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                  : activeComp?.operationalStatus === 'Ready'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {activeComp?.operationalStatus || 'Upcoming'}
              </span>
            </div>

            {activeComp ? (
              <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-black text-xs">
                    {activeComp.competitionCode || activeComp.code}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{activeComp.time} • {activeComp.date}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif font-black text-lg text-stone-900">
                    {activeComp.competitionTitle || activeComp.title}
                  </h4>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Category: <strong>{activeComp.category}</strong> • Type: <strong>{activeComp.type}</strong> • Total Candidates: <strong>{activeComp.totalParticipants || activeComp.participants?.length || 0}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-200/60">
                  <button
                    onClick={() => onNavigate('draw')}
                    className="px-4 py-2 bg-[#A91F35] hover:bg-[#8e172a] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
                    <span>Conduct Random Draw</span>
                  </button>
                  <button
                    onClick={() => onNavigate('calling')}
                    className="px-4 py-2 bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Open Participant Calling</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400 text-xs">
                No active competition currently running on this stage.
              </div>
            )}
          </div>

          {/* Next Upcoming Competition Preview */}
          {nextComp && (
            <div className="p-3.5 bg-stone-50/60 rounded-2xl border border-stone-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Next Up</span>
                <span className="font-bold text-stone-800">{nextComp.title || nextComp.competitionTitle}</span>
              </div>
              <span className="font-mono text-stone-500">{nextComp.time}</span>
            </div>
          )}
        </div>

        {/* Right 1 Col: Assigned Judges Status */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-stone-900">
                    Assigned Judges ({dashboard?.assignedJudges?.length || 0})
                  </h3>
                  <p className="text-[11px] text-stone-500">Evaluators for current arena</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {dashboard?.assignedJudges?.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">No judges assigned yet.</p>
              ) : (
                dashboard?.assignedJudges?.map((jdg) => (
                  <div
                    key={jdg.id}
                    className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-900">{jdg.name}</div>
                      <div className="text-[10px] text-stone-500 font-medium">{jdg.category || 'Lead Adjudicator'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('judges')}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all text-center"
          >
            Full Judge Coordination
          </button>
        </div>
      </div>

      {/* 4. RECENT STAGE OPERATIONS STREAM */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E6A916]/20 text-[#A91F35]">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-black text-base text-stone-900">
              Recent Stage Operations & Calling Stream
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">Live Audit Trail</span>
        </div>

        <div className="space-y-2">
          {dashboard?.recentActivity?.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-4">No recent stage events recorded.</p>
          ) : (
            dashboard?.recentActivity?.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-stone-50/70 border border-stone-200/60 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-stone-800">{act.description || act.action}</div>
                  <div className="text-[10px] text-stone-400">By {act.actor}</div>
                </div>
                <span className="font-mono text-[10px] text-stone-400 shrink-0">
                  {act.timestamp ? act.timestamp.split('T')[1]?.substring(0, 5) : 'Just now'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
