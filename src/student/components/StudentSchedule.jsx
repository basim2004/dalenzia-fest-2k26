import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, MapPin, Trophy, Calendar,
  CheckCircle2, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentSchedule({ studentSession }) {
  const [schedule, setSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState('all');

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentSchedule(studentId);
      setSchedule(data);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const filteredItems = schedule.filter((item) => {
    if (selectedDay === 'day1') return item.date?.includes('21');
    if (selectedDay === 'day2') return item.date?.includes('22');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            My Personalized Festival Schedule
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Combined chronological timeline of your stage arenas and festival sessions across 21, 22, 23 DECEMBER 2026.
          </p>
        </div>

        {/* Day Filters */}
        <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setSelectedDay('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDay === 'all' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
            }`}
          >
            All Events ({schedule.length})
          </button>
          <button
            onClick={() => setSelectedDay('day1')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDay === 'day1' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
            }`}
          >
            Day 01 (Dec 21)
          </button>
          <button
            onClick={() => setSelectedDay('day2')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDay === 'day2' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
            }`}
          >
            Day 02 (Dec 22)
          </button>
        </div>
      </div>

      {/* Timeline View */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <CalendarDays className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif font-black text-stone-800">No scheduled sessions for this day</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Your schedule updates dynamically as new stage slots or programme registrations are confirmed.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#A91F35]/30 space-y-6 my-4 ml-4">
          {filteredItems.map((item, idx) => {
            const isComp = item.kind === 'Competition';
            return (
              <div key={item.id} className="relative group">
                {/* Timeline Node Dot */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full border-4 border-[#F7F3E9] flex items-center justify-center text-[10px] font-bold ${
                  isComp ? 'bg-[#A91F35] text-white' : 'bg-[#E6A916] text-[#A91F35]'
                }`}>
                  {isComp ? <Trophy className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                </div>

                {/* Event Card */}
                <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs hover:border-[#A91F35]/40 hover:shadow-xs transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        isComp ? 'bg-[#A91F35]/10 text-[#A91F35]' : 'bg-[#E6A916]/20 text-[#A91F35]'
                      }`}>
                        {item.kind}
                      </span>
                      <span className="text-xs font-bold text-stone-500 font-mono">
                        {item.subtitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-stone-700">
                      <span className="flex items-center gap-1 text-[#A91F35]">
                        <Clock className="w-3.5 h-3.5" /> {item.time}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-serif font-black text-stone-900">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.venue}</span>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto ${
                      item.status === 'Result Published'
                        ? 'bg-amber-100 text-amber-800'
                        : item.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
