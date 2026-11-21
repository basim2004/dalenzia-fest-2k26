import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Trophy, Award, Phone, Mail, UserCheck,
  Star, Shield, Sparkles, ChevronRight
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentTeam({ studentSession, onNavigate }) {
  const [teamData, setTeamData] = useState(null);
  const [allTeams, setAllTeams] = useState([]);

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentTeamDetails(studentId);
      setTeamData(data);
      setAllTeams(festivalStore.getTeams());
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  return (
    <div className="space-y-6">
      {/* Squad Header Banner */}
      <div className="bg-[#A91F35] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-serif font-black text-2xl shadow-md shrink-0">
              {teamData?.badge || '⭐'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold text-xs">
                  {teamData?.code || 'TA001'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs">
                  Rank #{teamData?.rank || 1}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight mt-1">
                {teamData?.name || studentSession?.teamName}
              </h2>
              <p className="text-xs text-white/80 font-medium">
                Official Festival Squad • Dalenzia Fest 2K26
              </p>
            </div>
          </div>

          <div className="bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right shrink-0">
            <div className="text-[10px] text-white/60 uppercase font-black tracking-wider">
              Championship Score
            </div>
            <div className="text-3xl font-serif font-black text-[#E6A916]">
              {teamData?.points || 0} <span className="text-sm font-sans text-white/80">pts</span>
            </div>
            <div className="text-[11px] text-white/70">
              {teamData?.teammates?.length ? teamData.teammates.length + 1 : 1} Registered Delegates
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Team Leader & Squad Teammates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team Leader Profile */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-[#A91F35]/10 text-[#A91F35]">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-black text-base text-stone-900">
              Team Leader
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-[#A91F35] flex items-center justify-center font-serif font-black text-lg">
                {teamData?.leader ? teamData.leader.charAt(0) : 'L'}
              </div>
              <div>
                <div className="font-bold text-stone-900 text-sm">{teamData?.leader || 'Official Leader'}</div>
                <div className="text-[11px] text-stone-500 font-medium">Head of Delegation</div>
              </div>
            </div>

            <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Contact
                </span>
                <span className="font-semibold text-stone-800">{teamData?.leaderContact || '+91 98471 20001'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Portal ID
                </span>
                <span className="font-mono text-stone-800">leader@dalenziafest.in</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-[11px] text-amber-800 leading-relaxed">
              <strong>Squad Notice:</strong> Contact your Team Leader for stage entry cards, rehearsal schedules, and group competition substitutions.
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Squad Roster (Teammates) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A91F35]/10 text-[#A91F35]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-black text-base text-stone-900">
                  Squad Teammates ({teamData?.teammates?.length || 0})
                </h3>
                <p className="text-[11px] text-stone-500">Fellow candidates enrolled in {teamData?.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teamData?.teammates?.map((tm) => (
              <div
                key={tm.id}
                className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#A91F35] font-serif font-bold text-xs flex items-center justify-center border border-stone-200 shadow-2xs">
                    {tm.name ? tm.name.charAt(0) : 'T'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">{tm.name}</div>
                    <div className="text-[10px] text-stone-500">{tm.classCategory} Category</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 font-mono font-bold text-[10px]">
                  {tm.chestNo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Championship Standings Preview */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E6A916]/20 text-[#A91F35]">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="font-serif font-black text-base text-stone-900">
              Championship Leaderboard
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-medium">12 Official Teams</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {allTeams.map((t, idx) => {
            const isMyTeam = t.id === teamData?.id;
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isMyTeam
                    ? 'border-[#A91F35] bg-[#A91F35]/5 ring-1 ring-[#A91F35] shadow-xs'
                    : 'border-stone-200/70 bg-stone-50/50'
                }`}
              >
                <div className="text-[10px] font-mono font-black text-stone-400 mb-0.5">#{idx + 1}</div>
                <div className={`text-xs font-bold truncate ${isMyTeam ? 'text-[#A91F35] font-black' : 'text-stone-800'}`}>
                  {t.name}
                </div>
                <div className="text-sm font-serif font-black text-[#E6A916] mt-0.5">
                  {t.points || 0} <span className="text-[9px] font-sans text-stone-500">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
