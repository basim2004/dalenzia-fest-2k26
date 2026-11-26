import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Trophy,
  Crown,
  Search,
  Filter,
  Sparkles,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderResults({ teamId }) {
  const [team, setTeam] = useState(() => festivalStore.getTeamById(teamId));
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setStoreData({ ...festivalStore.data });
      setTeam(festivalStore.getTeamById(teamId));
    });
    return () => unsub();
  }, [teamId]);

  // Only official published results where this team has podium placement or marks
  const publishedTeamResults = useMemo(() => {
    return festivalStore.getTeamOfficialPublishedResults(teamId);
  }, [teamId, storeData]);

  const filteredResults = useMemo(() => {
    return publishedTeamResults.filter(r => {
      const matchSearch =
        r.competitionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.competitionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.awards.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.chestNo.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [publishedTeamResults, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    return Array.from(new Set(publishedTeamResults.map(r => r.category).filter(Boolean)));
  }, [publishedTeamResults]);

  // Calculate medals breakdown
  const firsts = publishedTeamResults.flatMap(r => r.awards).filter(a => a.position === 'First Prize').length;
  const seconds = publishedTeamResults.flatMap(r => r.awards).filter(a => a.position === 'Second Prize').length;
  const thirds = publishedTeamResults.flatMap(r => r.awards).filter(a => a.position === 'Third Prize').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Official Certified Laurels
            </span>
            <span className="text-xs font-bold text-stone-500 font-mono">
              Squad: {team?.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Team Results & Official Positions
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Adjudicated podium results certified by Festival Convener and Jury Panel. Private draft evaluations are strictly protected.
          </p>
        </div>

        {/* Medal Podiums */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-center flex-1 md:flex-none">
            <div className="text-[10px] font-black text-amber-800 uppercase">🥇 1st Prize</div>
            <div className="text-xl font-serif font-black text-amber-900">{firsts}</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-2xl bg-stone-100 border border-stone-300 text-center flex-1 md:flex-none">
            <div className="text-[10px] font-black text-stone-700 uppercase">🥈 2nd Prize</div>
            <div className="text-xl font-serif font-black text-stone-800">{seconds}</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-2xl bg-amber-100/60 border border-amber-300 text-center flex-1 md:flex-none">
            <div className="text-[10px] font-black text-amber-900 uppercase">🥉 3rd Prize</div>
            <div className="text-xl font-serif font-black text-amber-950">{thirds}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search award by competition or candidate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Cards List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            <Award className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <div className="font-bold text-stone-700">No published results currently available for {team?.name}.</div>
            <div className="text-stone-400 mt-1">Official podium results will appear here as soon as Convener publishes certified marksheets.</div>
          </div>
        ) : (
          filteredResults.map(result => (
            <div
              key={result.posterId}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2 py-0.5 rounded-full">
                      {result.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-400">{result.competitionCode}</span>
                  </div>
                  <h3 className="text-base font-serif font-black text-stone-900 mt-1">
                    {result.competitionTitle}
                  </h3>
                  <div className="text-[11px] text-stone-500">
                    {result.venue} • Certified: {result.publishedAt}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold shrink-0 self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Officially Published</span>
                </span>
              </div>

              {/* Laurels Podium Grid for this competition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.awards.map((award, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-black text-stone-900 flex items-center gap-1">
                        <span>{award.prizeBadge}</span>
                        <span>{award.position}</span>
                      </div>
                      <div className="font-bold text-stone-900 text-sm">{award.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {award.chestNo ? `Chest: ${award.chestNo} | ` : ''}Score: {award.score}{award.grade ? ` | Grade: ${award.grade}` : ''}
                      </div>
                      {Array.isArray(award.memberNames) && award.memberNames.length > 0 && (
                        <div className="text-[10px] text-stone-500">Members: {award.memberNames.join(', ')}</div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-[#A91F35] text-white font-mono font-bold text-xs">
                        +{award.points} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
