import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Calendar, Clock, MapPin, Eye, X,
  CheckCircle2, AlertCircle, FileText, Search,
  Filter, Sparkles, Shield
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentCompetitions({ studentSession }) {
  const [competitions, setCompetitions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeComp, setActiveComp] = useState(null);

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentCompetitions(studentId);
      setCompetitions(data);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'upcoming') {
      return matchesSearch && (comp.status === 'Upcoming' || comp.status === 'Registered');
    }
    if (filterStatus === 'completed') {
      return matchesSearch && (comp.status === 'Completed' || comp.status === 'Result Published');
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            My Registered Competitions
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Stage and non-stage arenas assigned to Chest No: <strong className="font-mono text-[#A91F35]">{studentSession?.chestNo}</strong>
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competitions..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#A91F35]"
            />
          </div>

          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'all' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
              }`}
            >
              All ({competitions.length})
            </button>
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'upcoming' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterStatus === 'completed' ? 'bg-white text-[#A91F35] shadow-xs' : 'text-stone-600'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Competitions Grid */}
      {filteredCompetitions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <Trophy className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif font-black text-stone-800">No competitions found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            You are currently registered for {competitions.length} competitions. Synchronize with your Team Leader for any pending entries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitions.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs hover:border-[#A91F35]/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-black text-xs">
                    {comp.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    comp.status === 'Result Published'
                      ? 'bg-amber-100 text-amber-800'
                      : comp.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {comp.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-black text-stone-900 text-sm leading-snug line-clamp-2">
                    {comp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                    <span className="font-semibold text-stone-700">{comp.category}</span>
                    <span>•</span>
                    <span>{comp.type} Entry</span>
                  </div>
                </div>

                <div className="bg-stone-50/80 p-3 rounded-2xl border border-stone-200/60 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{comp.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{comp.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{comp.venue}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveComp(comp)}
                className="w-full py-2 bg-stone-100 hover:bg-[#A91F35] hover:text-white text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Guidelines & Rules</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Guidelines Modal */}
      <AnimatePresence>
        {activeComp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-bold text-xs">
                    {activeComp.code}
                  </span>
                  <h3 className="font-serif font-black text-base text-stone-900 mt-1">
                    {activeComp.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveComp(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Venue</span>
                    <span className="font-bold text-stone-800">{activeComp.venue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Date & Time</span>
                    <span className="font-bold text-stone-800">{activeComp.date} • {activeComp.time}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-stone-800 mb-1 uppercase tracking-wider text-[11px]">
                    Official Competition Rules & Syllabus
                  </h4>
                  <p className="text-stone-600 bg-stone-50/70 p-3 rounded-xl border border-stone-200 leading-relaxed">
                    {activeComp.rules || 'Candidates must report to the stage green room 15 minutes prior to the announced bell time with their official Digital ID Card.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-800 mb-1 uppercase tracking-wider text-[11px]">
                    Judge Instructions & Stage Protocol
                  </h4>
                  <p className="text-stone-600 bg-stone-50/70 p-3 rounded-xl border border-stone-200 leading-relaxed">
                    {activeComp.instructions || 'Adjudication follows standard rubrics established by the Dalenzia Fest Academic Board.'}
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800">
                  <strong>Important:</strong> Chest numbers must remain visible throughout the performance. Zero reference books or mobile devices permitted on stage.
                </div>
              </div>

              <button
                onClick={() => setActiveComp(null)}
                className="mt-5 w-full py-2.5 bg-[#A91F35] text-white rounded-xl text-xs font-bold hover:bg-[#8e172a] transition-all"
              >
                Close Guidelines
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
