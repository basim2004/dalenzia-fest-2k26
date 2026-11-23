import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  Filter,
  Users,
  Sparkles,
  Calendar,
  Trophy,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderSchedule({ teamId }) {
  const [scheduleData, setScheduleData] = useState(() => festivalStore.getTeamLeaderSchedule(teamId));
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState('all'); // 'all' | 'Day 01' | 'Day 02' | 'Day 03'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'events' | 'competitions'

  useEffect(() => {
    const update = () => {
      setScheduleData(festivalStore.getTeamLeaderSchedule(teamId));
    };
    update();
    const unsub = festivalStore.subscribe(update);
    return () => unsub();
  }, [teamId]);

  const team = useMemo(() => {
    return (festivalStore.getTeams ? festivalStore.getTeams() : []).find(t => t.id === teamId) ||
           (teamId === 'team-1' ? { name: 'Dazzlers', code: 'DAZ' } : { name: 'Dynamos', code: 'DYN' });
  }, [teamId]);

  // Combine confirmed events and team competitions
  const allItems = useMemo(() => {
    const events = (scheduleData?.confirmedEvents || []).map(e => ({
      ...e,
      itemType: 'event',
      badgeLabel: 'Official Event',
      badgeBg: 'bg-[#A91F35]/10 text-[#A91F35]'
    }));
    const comps = (scheduleData?.teamCompetitions || []).map(c => ({
      ...c,
      itemType: 'competition',
      badgeLabel: `${c.category} Competition`,
      badgeBg: 'bg-[#E6A916]/15 text-[#9E6D04]'
    }));
    return [...events, ...comps];
  }, [scheduleData]);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchSearch =
        (item.title || item.programmeTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.code || item.programmeCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.venue || item.stage || '').toLowerCase().includes(searchQuery.toLowerCase());

      const itemDay = item.day || (String(item.date).includes('21') ? 'Day 01' : String(item.date).includes('22') ? 'Day 02' : 'Day 03');
      const matchDay = dayFilter === 'all' || itemDay === dayFilter;

      const matchType =
        typeFilter === 'all' ||
        (typeFilter === 'events' && item.itemType === 'event') ||
        (typeFilter === 'competitions' && item.itemType === 'competition');

      return matchSearch && matchDay && matchType;
    });
  }, [allItems, searchQuery, dayFilter, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Official Festival Schedule
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              21, 22, 23 DECEMBER 2026
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Festival Schedule & Team {team?.name ? `${team.name} Roster Timetable` : 'Timetable'}
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Synchronized master timeline of the 7 confirmed festival events and official competition slots for your team.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
            Team: <strong className="text-[#A91F35]">{team?.name || 'Assigned Squad'}</strong>
          </span>
        </div>
      </div>

      {/* Day Selector Navigation */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-[#A91F35]/15 shadow-xs gap-1.5">
        {[
          { id: 'all', label: 'All 3 Days (Dec 21–23)' },
          { id: 'Day 01', label: 'Day 01 • Dec 21' },
          { id: 'Day 02', label: 'Day 02 • Dec 22' },
          { id: 'Day 03', label: 'Day 03 • Dec 23' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setDayFilter(tab.id)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              dayFilter === tab.id
                ? 'bg-[#A91F35] text-white shadow-md'
                : 'text-stone-600 hover:text-[#A91F35] hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Type Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sessions or competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'all'
                ? 'bg-[#A91F35] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Items ({allItems.length})
          </button>
          <button
            onClick={() => setTypeFilter('events')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'events'
                ? 'bg-[#A91F35] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Official Events ({(scheduleData?.confirmedEvents || []).length})
          </button>
          <button
            onClick={() => setTypeFilter('competitions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === 'competitions'
                ? 'bg-[#A91F35] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Team Contests ({(scheduleData?.teamCompetitions || []).length})
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            <Clock className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <div className="font-bold text-stone-700 text-sm">Schedule Not Yet Available</div>
            <div className="text-stone-500 mt-1">No schedule entries found matching your selected filter.</div>
          </div>
        ) : (
          filteredItems.map(item => {
            const isEvent = item.itemType === 'event';
            const dayText = item.day || (String(item.date).includes('21') ? 'Day 01' : String(item.date).includes('22') ? 'Day 02' : 'Day 03');
            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between hover:border-[#E6A916] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
                      {dayText} • {item.date}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${item.badgeBg}`}>
                      {item.badgeLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-sm leading-tight">
                      {item.title || item.programmeTitle}
                    </h3>
                    {item.code && (
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">{item.code}</div>
                    )}
                  </div>

                  <div className="text-xs text-stone-600 space-y-1.5 bg-[#F7F3E9]/50 p-3 rounded-2xl border border-stone-200/60">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span>{item.time || item.timeRange || (item.startTime ? `${item.startTime} – ${item.endTime || ''}` : 'Official Time')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span className="truncate">{item.venue || item.stage || 'Main Stage'}</span>
                    </div>
                    {item.participantsCount !== undefined && (
                      <div className="flex items-center gap-1.5 pt-1 border-t border-stone-200/40 text-stone-700">
                        <Users className="w-3.5 h-3.5 text-[#E6A916] shrink-0" />
                        <span>Team Participants: <strong>{item.participantsCount} Scholar{item.participantsCount !== 1 ? 's' : ''}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Status: <strong className="text-emerald-700">{item.status || 'Confirmed'}</strong></span>
                  {isEvent && (
                    <span className="text-[#A91F35] font-semibold text-[10px]">Official Festival Event</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
