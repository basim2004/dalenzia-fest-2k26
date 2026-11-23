import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  Trophy,
  Calendar,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StageScheduleView({ stageId, stageInfo, onNavigate }) {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [dayFilter, setDayFilter] = useState('all');

  const resolvedStageId = stageId || stageInfo?.stageId || stageInfo?.id || 'STG-01';
  const stageName = stageInfo?.stageName || stageInfo?.name || 'Assigned Stage';

  useEffect(() => {
    const loadSchedule = () => {
      if (!resolvedStageId) return;
      const items = festivalStore.getStageSchedule(resolvedStageId);
      setScheduleItems(items);
    };

    loadSchedule();
    const unsub = festivalStore.subscribe(loadSchedule);
    return () => unsub();
  }, [resolvedStageId]);

  const filteredItems = useMemo(() => {
    return scheduleItems.filter(item => {
      const itemDay = item.day || (String(item.date).includes('21') ? 'Day 01' : String(item.date).includes('22') ? 'Day 02' : 'Day 03');
      if (dayFilter === 'all') return true;
      return itemDay === dayFilter;
    });
  }, [scheduleItems, dayFilter]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Official Stage Schedule
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              21, 22, 23 DECEMBER 2026
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            {stageName} • Stage Session Schedule
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Live sequence of ceremonies, stage sessions, and assigned academic competitions for this stage console.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 bg-[#F7F3E9] px-3.5 py-1.5 rounded-xl border border-stone-200">
            Stage ID: <strong className="text-[#A91F35] font-mono">{resolvedStageId}</strong>
          </span>
        </div>
      </div>

      {/* 3-Day Filter Tabs */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-[#A91F35]/15 shadow-xs gap-1.5">
        {[
          { id: 'all', label: 'All Dates (Dec 21–23)' },
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

      {/* Schedule Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif font-black text-stone-800">Schedule Not Yet Available</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            No official sessions or competitions are currently configured for this stage. New events assigned by the Convener Secretariat will synchronize here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const isComp = Boolean(item.isCompetition);
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
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isComp ? 'bg-[#E6A916]/15 text-[#9E6D04]' : 'bg-[#A91F35]/10 text-[#A91F35]'
                      }`}
                    >
                      {isComp ? `${item.category} Competition` : 'Festival Session'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-sm leading-tight">{item.title}</h3>
                    {item.code && (
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">{item.code}</div>
                    )}
                  </div>

                  <div className="text-xs text-stone-600 space-y-1.5 bg-[#F7F3E9]/50 p-3 rounded-2xl border border-stone-200/60">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span>{item.time || item.timeRange || 'Official Festival Time'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span className="truncate">{item.venue || stageName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'Completed'
                        ? 'bg-stone-100 text-stone-600'
                        : item.status === 'Ongoing'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {item.status || 'Confirmed'}
                  </span>

                  {isComp && onNavigate && (
                    <button
                      onClick={() => onNavigate('calling')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#A91F35] hover:text-[#8B1A2C]"
                    >
                      <span>Stage Calling</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
