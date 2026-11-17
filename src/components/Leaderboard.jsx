import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ChevronDown, ChevronUp, Flame, ShieldCheck } from 'lucide-react';
import leaderboardData from '../data/leaderboard.json';

export default function Leaderboard({ lang }) {
  const [expandedSector, setExpandedSector] = useState(null);
  const maxPoints = leaderboardData.sectors[0]?.points || 350;

  const toggleExpand = (rank) => {
    setExpandedSector(expandedSector === rank ? null : rank);
  };

  const top3 = leaderboardData.sectors.slice(0, 3);
  const rest = leaderboardData.sectors.slice(3);

  return (
    <section id="leaderboard" className="max-w-md mx-auto px-4 py-8">
      {/* Eyebrow & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider mb-1">
          <Flame className="w-3 h-3 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Live Sector Standings' : 'തത്സമയ പോയിന്റ് നില'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#A91F35]">
          {lang === 'en' ? 'Overall Leaderboard' : 'മേഖല പോയിന്റ് പട്ടിക'}
        </h2>
        <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
          {lang === 'en'
            ? 'Real-time score tally across all 12 participating sectors'
            : 'മേളയിലെ 12 മേഖലകളുടെ തത്സമയ മുന്നേറ്റം'}
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 gap-2 items-end mb-6 pt-6">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center mb-1 shadow-sm">
            2
          </div>
          <div className="w-full bg-white rounded-t-2xl p-2.5 border-t-4 border-slate-400 shadow-sm text-center flex flex-col justify-end min-h-[120px]">
            <span className="text-[10px] font-bold text-[#1c1917] line-clamp-1">
              {top3[1]?.name}
            </span>
            <span className="font-mono text-base font-extrabold text-[#A91F35] mt-1">
              {top3[1]?.points}
            </span>
            <span className="text-[8px] text-stone-500 font-semibold">POINTS</span>
          </div>
        </div>

        {/* 1st Place (Taller) */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-[#E6A916] text-[#A91F35] text-sm font-black flex items-center justify-center mb-1 shadow-md ring-2 ring-[#E6A916]/40">
            👑 1
          </div>
          <div className="w-full bg-white rounded-t-2xl p-2.5 border-t-4 border-[#E6A916] shadow-md text-center flex flex-col justify-end min-h-[145px] relative overflow-hidden">
            <span className="text-[11px] font-extrabold text-[#A91F35] line-clamp-1">
              {top3[0]?.name}
            </span>
            <span className="font-mono text-xl font-extrabold text-[#A91F35] mt-1">
              {top3[0]?.points}
            </span>
            <span className="text-[9px] text-[#E6A916] font-bold">CHAMPION</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-black flex items-center justify-center mb-1 shadow-sm">
            3
          </div>
          <div className="w-full bg-white rounded-t-2xl p-2.5 border-t-4 border-amber-600 shadow-sm text-center flex flex-col justify-end min-h-[105px]">
            <span className="text-[10px] font-bold text-[#1c1917] line-clamp-1">
              {top3[2]?.name}
            </span>
            <span className="font-mono text-base font-extrabold text-[#A91F35] mt-1">
              {top3[2]?.points}
            </span>
            <span className="text-[8px] text-stone-500 font-semibold">POINTS</span>
          </div>
        </div>
      </div>

      {/* Full Ranked Sector List with Animated Progress Bars */}
      <div className="space-y-2.5">
        {leaderboardData.sectors.map((sector) => {
          const isExpanded = expandedSector === sector.rank;
          const percentage = Math.round((sector.points / maxPoints) * 100);

          return (
            <div
              key={sector.rank}
              className="bg-white rounded-2xl p-3 border border-[#A91F35]/10 shadow-sm transition-all hover:border-[#A91F35]/25"
            >
              {/* Main Row */}
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => toggleExpand(sector.rank)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      sector.rank === 1
                        ? 'bg-[#E6A916] text-[#A91F35]'
                        : sector.rank === 2
                        ? 'bg-slate-200 text-slate-800'
                        : sector.rank === 3
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    #{sector.rank}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#1c1917]">
                      {lang === 'en' ? sector.name : sector.malayalam}
                    </h4>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {sector.gold} Gold · {sector.silver} Silver · {sector.bronze} Bronze
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="font-mono text-sm font-extrabold text-[#A91F35] block">
                      {sector.points}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-stone-400 font-semibold">
                      PTS
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    sector.rank === 1
                      ? 'bg-gradient-to-r from-[#A91F35] to-[#E6A916]'
                      : 'bg-[#A91F35]'
                  }`}
                />
              </div>

              {/* Expandable Breakdown Drawer */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-3 gap-2 text-center"
                >
                  <div className="bg-amber-50 p-1.5 rounded-xl border border-amber-200">
                    <span className="text-[9px] uppercase tracking-wider text-amber-800 font-bold block">
                      🥇 First
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-900">
                      {sector.gold}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[9px] uppercase tracking-wider text-slate-700 font-bold block">
                      🥈 Second
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {sector.silver}
                    </span>
                  </div>
                  <div className="bg-amber-50/50 p-1.5 rounded-xl border border-amber-200/50">
                    <span className="text-[9px] uppercase tracking-wider text-amber-900 font-bold block">
                      🥉 Third
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-950">
                      {sector.bronze}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
