import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderProgrammes({ teamId }) {
  const [team, setTeam] = useState(() => festivalStore.getTeamById(teamId));
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [selectedProgForReg, setSelectedProgForReg] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [regNotes, setRegNotes] = useState('');

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setStoreData({ ...festivalStore.data });
      setTeam(festivalStore.getTeamById(teamId));
    });
    return () => unsub();
  }, [teamId]);

  const teamStudents = useMemo(() => {
    return team?.students || [];
  }, [team]);

  const programmes = useMemo(() => {
    return festivalStore.getTeamProgrammesForRegistration(teamId);
  }, [teamId, storeData]);

  const filteredProgrammes = useMemo(() => {
    return programmes.filter(p => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [programmes, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    return Array.from(new Set(programmes.map(p => p.category).filter(Boolean)));
  }, [programmes]);

  const handleOpenRegistration = (prog) => {
    setSelectedProgForReg(prog);
    const existingIds = prog.registrationDetails?.studentIds || [];
    setSelectedStudentIds([...existingIds]);
    setRegNotes(prog.registrationDetails?.notes || '');
  };

  const handleConfirmRegistration = (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      showToast('Please select at least one delegate from your squad.', 'error');
      return;
    }

    try {
      festivalStore.registerTeamStudentForProgramme({
        teamId,
        programmeId: selectedProgForReg.id,
        studentIds: selectedStudentIds,
        notes: regNotes
      });
      showToast(`Registered delegation for ${selectedProgForReg.title}!`);
      setSelectedProgForReg(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCancelRegistration = (progId, progTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your squad registration for ${progTitle}?`)) return;

    try {
      festivalStore.cancelTeamProgrammeRegistration({ teamId, programmeId: progId });
      showToast(`Delegation registration cancelled for ${progTitle}.`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-white ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Festival Programmes
            </span>
            <span className="text-xs font-bold text-stone-500 font-mono">Squad: {team?.name}</span>
          </div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Programme Participation & Delegations
          </h2>
          <p className="text-xs text-stone-500">
            Enrol squad student delegates in official festival stages, symposia, and academic inaugurations.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programme, venue or code..."
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

      {/* Programme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProgrammes.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            No programmes found matching search.
          </div>
        ) : (
          filteredProgrammes.map(prog => {
            const isReg = prog.isRegistered;
            const regCount = prog.registrationDetails?.studentIds?.length || 0;

            return (
              <div
                key={prog.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
                      {prog.category}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isReg ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {isReg ? `Registered (${regCount} Delegates)` : 'Available'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-sm leading-tight">{prog.title}</h3>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">{prog.code}</div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {prog.desc}
                  </p>

                  <div className="text-xs text-stone-600 space-y-1 bg-[#F7F3E9]/50 p-3 rounded-2xl border border-stone-200/60">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span className="truncate">{prog.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span>{prog.date} • {prog.time}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  {isReg ? (
                    <button
                      onClick={() => handleCancelRegistration(prog.id, prog.title)}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      Cancel Delegation
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-400">Open to Delegations</span>
                  )}

                  <button
                    onClick={() => handleOpenRegistration(prog)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#E6A916]" />
                    <span>{isReg ? 'Edit Delegates' : 'Register Delegates'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL: REGISTER PROGRAMME DELEGATES                                   */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {selectedProgForReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-linear-to-r from-[#A91F35] to-[#7f1525] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Register Programme Delegation</h3>
                  <p className="text-[11px] text-white/80">{selectedProgForReg.title}</p>
                </div>
                <button
                  onClick={() => setSelectedProgForReg(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmRegistration} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <div><strong>Venue:</strong> {selectedProgForReg.venue}</div>
                  <div><strong>Date & Time:</strong> {selectedProgForReg.date} ({selectedProgForReg.time})</div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Select Delegation Members from {team?.name}:
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-2xl p-2 space-y-1">
                    {teamStudents.length === 0 ? (
                      <div className="p-4 text-center text-stone-500">
                        No students enrolled in squad roster yet.
                      </div>
                    ) : (
                      teamStudents.map(student => {
                        const isChecked = selectedStudentIds.includes(student.id);
                        return (
                          <label
                            key={student.id}
                            className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-[#A91F35]/10 border border-[#A91F35]/30'
                                : 'hover:bg-stone-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentIds([...selectedStudentIds, student.id]);
                                  } else {
                                    setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                                  }
                                }}
                                className="rounded text-[#A91F35] focus:ring-[#A91F35]"
                              />
                              <div>
                                <span className="font-bold text-stone-900">{student.name}</span>
                                <span className="text-[10px] text-stone-500 font-mono ml-1">
                                  ({student.chestNo})
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] text-stone-400 font-medium">
                              {student.category}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Delegation Notes (Optional)</label>
                  <input
                    type="text"
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    placeholder="e.g. Lead delegate, seating preference..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-800 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProgForReg(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedStudentIds.length === 0}
                    className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] disabled:opacity-50 text-white font-bold shadow-md transition-colors"
                  >
                    Confirm Delegation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
