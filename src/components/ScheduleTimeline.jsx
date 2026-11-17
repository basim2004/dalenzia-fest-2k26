import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, Radio } from 'lucide-react';
import scheduleData from '../data/schedule.json';

export default function ScheduleTimeline({ lang }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const currentDay = scheduleData.days[activeDayIdx];

  return (
    <section id="schedule" className="max-w-md mx-auto px-4 py-8">
      {/* Eyebrow & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider mb-1">
          <Calendar className="w-3 h-3 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Two-Day Program Flow' : 'ടൈംടേബിൾ'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#A91F35]">
          {lang === 'en' ? 'Festival Schedule' : 'പരിപാടി വിവരണം'}
        </h2>
        <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
          {lang === 'en'
            ? 'Complete timeline for Dec 21–22, 2026'
            : 'രണ്ട് ദിവസങ്ങളിലായി നടക്കുന്ന പരിപാടികളുടെ സമയക്രമം'}
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex bg-white rounded-2xl p-1 border border-[#A91F35]/15 shadow-sm mb-6">
        {scheduleData.days.map((day, idx) => (
          <button
            key={day.day}
            onClick={() => setActiveDayIdx(idx)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeDayIdx === idx
                ? 'bg-[#A91F35] text-white shadow-md'
                : 'text-[#1c1917]/70 hover:text-[#A91F35]'
            }`}
          >
            {day.day} · {day.date.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Timeline Nodes */}
      <div className="relative pl-6 space-y-4 border-l-2 border-[#A91F35]/20 ml-3">
        {currentDay.events.map((ev, idx) => {
          const isCompleted = ev.status === 'completed';
          const isLive = ev.status === 'live';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative bg-white rounded-2xl p-3.5 border border-[#A91F35]/10 shadow-sm"
            >
              {/* Timeline dot */}
              <div
                className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                  isLive
                    ? 'bg-[#E6A916] ring-4 ring-[#E6A916]/30'
                    : isCompleted
                    ? 'bg-[#A91F35]'
                    : 'bg-stone-300'
                }`}
              />

              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-[#A91F35] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E6A916]" />
                  {ev.time}
                </span>

                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isLive
                      ? 'bg-[#E6A916] text-[#A91F35] animate-pulse'
                      : isCompleted
                      ? 'bg-stone-100 text-stone-500'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#1c1917] leading-snug">
                {lang === 'en' ? ev.title : ev.malayalam}
              </h4>

              <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1">
                <MapPin className="w-3 h-3 text-[#A91F35]" />
                <span>{ev.stage}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
