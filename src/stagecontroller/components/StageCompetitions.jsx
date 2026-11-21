import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Sparkles, Volume2, Hash, Clock,
  Calendar, MapPin, Users, CheckCircle2, AlertCircle,
  Play, Pause, Check, X, ShieldCheck, ChevronRight
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StageCompetitions({ 
  stageSession, 
  stageInfo, 
  stageId: propStageId, 
  onNavigate, 
  onNavigateTab, 
  onLaunchDraw, 
  onLaunchCalling, 
  onSelectCompForDraw, 
  onSelectCompForCalling 
}) {
  const [competitions, setCompetitions] = useState([]);
  const [toast, setToast] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const session = stageSession || stageInfo || {};
  const stageId = propStageId || session?.stageId || 'STG-01';
  const handleNav = (tab) => {
    if (onNavigate) onNavigate(tab);
    if (onNavigateTab) onNavigateTab(tab);
  };
  const handleDraw = (compId) => {
    if (onLaunchDraw) onLaunchDraw(compId);
    else if (onSelectCompForDraw) onSelectCompForDraw(compId);
    handleNav('draw');
  };
  const handleCalling = (compId) => {
    if (onLaunchCalling) onLaunchCalling(compId);
    else if (onSelectCompForCalling) onSelectCompForCalling(compId);
    handleNav('calling');
  };

  const loadData = () => {
    if (!stageId) return;
    try {
      const data = festivalStore.getStageCompetitions(stageId);
      setCompetitions(data);
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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleStatusChange = (competitionId, newStatus) => {
    setUpdatingId(competitionId);
    try {
      festivalStore.updateStageCompetitionStatus(competitionId, stageId, newStatus, stageSession?.name);
      showToast(`Operational status updated to ${newStatus}.`);
      loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Stage Competition Control
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Stage {stageSession?.stageNumber}: {stageSession?.shortName} • {competitions.length} Scheduled Arenas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] font-bold text-xs">
            {competitions.filter(c => c.operationalStatus === 'Ongoing').length} Ongoing
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
            {competitions.filter(c => c.operationalStatus === 'Completed').length} Completed
          </span>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitions.map((comp) => {
          const isOngoing = comp.operationalStatus === 'Ongoing';
          const isReady = comp.operationalStatus === 'Ready';

          return (
            <div
              key={comp.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                isOngoing
                  ? 'border-[#A91F35] ring-2 ring-[#A91F35]/20 shadow-md'
                  : 'border-stone-200/90 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-black text-xs">
                    {comp.competitionCode || comp.code}
                  </span>

                  {/* Operational Status Selector */}
                  <select
                    value={comp.operationalStatus}
                    onChange={(e) => handleStatusChange(comp.id, e.target.value)}
                    disabled={updatingId === comp.id}
                    className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ready">Ready</option>
                    <option value="Ongoing">Ongoing (Active)</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-serif font-black text-base text-stone-900 leading-snug">
                    {comp.competitionTitle || comp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <span className="font-semibold text-stone-700">{comp.category}</span>
                    <span>•</span>
                    <span>{comp.type} Entry</span>
                  </div>
                </div>

                {/* Logistics & Timings */}
                <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/60 grid grid-cols-2 gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{comp.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{comp.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span><strong>{comp.totalParticipants || comp.participants?.length || 0}</strong> Candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                    <span><strong>{comp.assignedJudgeIds?.length || 0}</strong> Judges</span>
                  </div>
                </div>

                {/* Calling Progress Bar */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-medium">Draw & Calling Progress:</span>
                    <span className="font-bold text-stone-800">
                      {comp.completedCount} / {comp.totalParticipants || comp.participants?.length || 0} Done
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-stone-500">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                      {comp.calledCount} Called
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {comp.presentCount} Present
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                      {comp.absentCount} Absent
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDraw(comp.id)}
                  className="flex-1 py-2 bg-[#A91F35] hover:bg-[#8e172a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>Random Draw</span>
                </button>

                <button
                  onClick={() => handleCalling(comp.id)}
                  className="flex-1 py-2 bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Call to Stage</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
