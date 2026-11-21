import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Trophy,
  Award,
  Sparkles,
  Shield,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderLeaderboard({ teamId }) {
  const [teams, setTeams] = useState(() => festivalStore.getTeams());

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setTeams(festivalStore.getTeams());
    });
    return () => unsub();
  }, []);

  const sortedTeams = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Championship Standings
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              Official Central Ledger
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Festival Leaderboard & Points Tally
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Live championship points computed dynamically by the verified scoring engine upon official publication of results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-bold">
            <Crown className="w-4 h-4 text-amber-600" />
            <span>Championship Trophy 2K26</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedTeams.slice(0, 3).map((t, idx) => {
          const isMyTeam = t.id === teamId;
          const medals = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];
          const borders = ['border-amber-300 bg-amber-50/40', 'border-stone-300 bg-stone-50/40', 'border-amber-200 bg-amber-50/20'];

          return (
            <div
              key={t.id}
              className={`p-6 rounded-3xl border-2 transition-all shadow-xs flex flex-col justify-between ${borders[idx]} ${
                isMyTeam ? 'ring-2 ring-[#A91F35]' : ''
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                    {medals[idx]}
                  </span>
                  {isMyTeam && (
                    <span className="text-[10px] font-black uppercase bg-[#A91F35] text-white px-2 py-0.5 rounded-full">
                      My Squad
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-serif font-black text-stone-900">{t.name}</h3>
                  <div className="text-xs text-stone-500">{t.subname || 'Ayiroor Central'} • Leader: {t.leader}</div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/80 flex items-center justify-between">
                <span className="text-xs text-stone-500">Official Points</span>
                <span className="text-2xl font-serif font-black text-[#A91F35]">
                  {t.points} <span className="text-xs font-sans text-stone-500">pts</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
            All 12 Participating Squads
          </h3>
          <span className="text-xs text-stone-500">Official Adjudicated Standings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Team Squad</th>
                <th className="py-3 px-4">Squad Leader</th>
                <th className="py-3 px-4">Roster Size</th>
                <th className="py-3 px-4 text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedTeams.map((t, idx) => {
                const isMyTeam = t.id === teamId;
                return (
                  <tr
                    key={t.id}
                    className={`transition-colors ${
                      isMyTeam ? 'bg-amber-50/60 font-medium' : 'hover:bg-stone-50/60'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-black text-xs ${
                          idx === 0
                            ? 'bg-[#E6A916] text-[#A91F35]'
                            : idx === 1
                            ? 'bg-stone-300 text-stone-800'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{t.name}</span>
                        {isMyTeam && (
                          <span className="text-[9px] font-black bg-[#A91F35] text-white px-2 py-0.5 rounded-full uppercase">
                            Your Squad
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500">{t.subname || 'Ayiroor'}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-700">{t.leader}</td>
                    <td className="py-3 px-4 text-stone-600">{t.students?.length || t.members || 0} Candidates</td>
                    <td className="py-3 px-4 text-right font-serif font-black text-[#A91F35] text-base">
                      {t.points} <span className="text-xs font-sans text-stone-400">pts</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
