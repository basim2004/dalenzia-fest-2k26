import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Sparkles, UserCheck,
  Search, Filter, ChevronRight, ShieldCheck
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentProgrammes({ studentSession }) {
  const [programmes, setProgrammes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('all');

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentProgrammes(studentId);
      setProgrammes(data);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const filteredProgrammes = programmes.filter((prg) => {
    if (selectedDate === 'day1') return prg.date?.includes('21');
    if (selectedDate === 'day2') return prg.date?.includes('22');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            My Festival Programmes
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Keynotes, inaugural sessions, and cultural symposiums where you are registered or designated as a delegate.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setSelectedDate('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDate === 'all' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
            }`}
          >
            All Dates ({programmes.length})
          </button>
          <button
            onClick={() => setSelectedDate('day1')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDate === 'day1' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
            }`}
          >
            Dec 21 (Day 1)
          </button>
          <button
            onClick={() => setSelectedDate('day2')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              selectedDate === 'day2' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
            }`}
          >
            Dec 22 (Day 2)
          </button>
        </div>
      </div>

      {/* Programmes List */}
      {filteredProgrammes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif font-black text-stone-800">No programmes scheduled</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Check back as the Convener Secretariat finalizes additional stage schedules.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProgrammes.map((prg) => (
            <div
              key={prg.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs hover:border-[#E6A916]/80 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#E6A916]/20 text-[#A91F35] font-bold text-xs uppercase tracking-wider">
                    {prg.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{prg.registrationRole}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-black text-stone-900 text-base leading-snug">
                    {prg.title}
                  </h3>
                  {prg.malayalamTitle && (
                    <div className="text-xs text-[#A91F35] font-semibold mt-0.5">
                      {prg.malayalamTitle}
                    </div>
                  )}
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {prg.desc}
                  </p>
                </div>

                <div className="bg-stone-50/80 p-3 rounded-2xl border border-stone-200/60 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-semibold text-stone-800">{prg.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{prg.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{prg.venue}</span>
                  </div>
                </div>
              </div>

              {prg.coordinatorName && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Coordinator: <strong>{prg.coordinatorName}</strong></span>
                  <span className="font-mono text-stone-400">{prg.coordinatorPhone || ''}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
