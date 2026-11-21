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
  Calendar
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderSchedule() {
  const [schedules, setSchedules] = useState(() => festivalStore.getProgrammeSchedules());
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [venueFilter, setVenueFilter] = useState('all');

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setSchedules(festivalStore.getProgrammeSchedules());
    });
    return () => unsub();
  }, []);

  const venues = useMemo(() => {
    return Array.from(new Set(schedules.map(s => s.venue).filter(Boolean)));
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      const matchSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.venue || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.guestName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchDate = dateFilter === 'all' || s.date === dateFilter;
      const matchVenue = venueFilter === 'all' || s.venue === venueFilter;
      return matchSearch && matchDate && matchVenue;
    });
  }, [schedules, searchQuery, dateFilter, venueFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Official Master Schedule
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              21, 22, 23 DECEMBER 2026
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Festival Programme & Stage Schedule
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Live stage timelines, keynotes, and academic competition sessions scheduled across official festival arenas.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search session title, code or dignitary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Dates (21, 22, 23 DECEMBER 2026)</option>
            <option value="Dec 21, 2026">Day 1: Dec 21, 2026</option>
            <option value="Dec 22, 2026">Day 2: Dec 22, 2026</option>
                <option value="Dec 23, 2026">Day 3: Dec 23, 2026</option>
          </select>

          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Stages & Venues</option>
            {venues.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchedules.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            No schedule entries found matching criteria.
          </div>
        ) : (
          filteredSchedules.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
                    {item.date}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      item.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-900'
                        : item.status === 'Ongoing'
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm leading-tight">{item.title}</h3>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">{item.code}</div>
                </div>

                <div className="text-xs text-stone-600 space-y-1 bg-[#F7F3E9]/50 p-3 rounded-2xl border border-stone-200/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                    <span>{item.startTime} – {item.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                    <span className="truncate">{item.venue}</span>
                  </div>
                  {item.guestName && (
                    <div className="flex items-center gap-1.5 pt-1 border-t border-stone-200/40 text-stone-700">
                      <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Dignitary: <strong>{item.guestName}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
