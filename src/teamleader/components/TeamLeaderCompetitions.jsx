import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  X,
  Sparkles,
  ChevronRight,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderCompetitions({ teamId }) {
  const [team, setTeam] = useState(() => festivalStore.getTeamById(teamId));
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Registration Modal State
  const [selectedCompForReg, setSelectedCompForReg] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [regEntryType, setRegEntryType] = useState('Individual');
  const [regNotes, setRegNotes] = useState('');

  // Toast
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

  // Team students available for participation
  const teamStudents = useMemo(() => {
    return team?.students || [];
  }, [team]);

  // Competitions with team registration status
  const competitions = useMemo(() => {
    return festivalStore.getTeamCompetitionsForRegistration(teamId);
  }, [teamId, storeData]);

  // Filtered competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter(c => {
      const matchSearch =
        c.competitionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.competitionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.venue || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'registered' && c.isRegistered) ||
        (statusFilter === 'available' && c.canRegister && !c.isRegistered);
      return matchSearch && matchCategory && matchStatus;
    });
  }, [competitions, searchQuery, categoryFilter, statusFilter]);

  // Category options
  const categories = useMemo(() => {
    return Array.from(new Set(competitions.map(c => c.category).filter(Boolean)));
  }, [competitions]);

  const handleOpenRegistration = (comp) => {
    setSelectedCompForReg(comp);
    setSelectedStudentIds([]);
    setRegEntryType(comp.type === 'Group' ? 'Group' : 'Individual');
    setRegNotes('');
  };

  const handleConfirmRegistration = (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      showToast('Please select at least one candidate from your squad.', 'error');
      return;
    }

    try {
      festivalStore.registerTeamStudentForCompetition({
        teamId,
        competitionId: selectedCompForReg.competitionId,
        studentIds: selectedStudentIds,
        entryType: regEntryType,
        notes: regNotes
      });
      showToast(`Successfully registered ${selectedStudentIds.length} candidate(s) for ${selectedCompForReg.competitionTitle}!`);
      setSelectedCompForReg(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCancelRegistration = (competitionId, studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to cancel the registration of ${studentName} for this event?`)) return;

    try {
      festivalStore.cancelTeamStudentCompetitionRegistration({
        teamId,
        competitionId,
        studentId
      });
      showToast(`Registration cancelled for candidate ${studentName}.`);
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
              Competition Portal
            </span>
            <span className="text-xs font-bold text-stone-500 font-mono">
              Squad: {team?.name}
            </span>
          </div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Competition Enrolment & Registration
          </h2>
          <p className="text-xs text-stone-500">
            Register your squad members for individual and group competitions created by Admin and Convener.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search competition, code or stage venue..."
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Registrations</option>
            <option value="registered">Registered</option>
            <option value="available">Available to Register</option>
          </select>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetitions.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            No competitions found matching filters.
          </div>
        ) : (
          filteredCompetitions.map(comp => {
            const isReg = comp.isRegistered;
            const participants = comp.teamParticipants || [];

            return (
              <div
                key={comp.id}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2 py-0.5 rounded-full">
                      {comp.category}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isReg
                          ? 'bg-emerald-100 text-emerald-900'
                          : comp.canRegister
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {isReg ? `Registered (${participants.length})` : comp.canRegister ? 'Open for Entry' : 'Closed'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-sm leading-tight">
                      {comp.competitionTitle}
                    </h3>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                      {comp.competitionCode} • {comp.type || 'Individual'} Entry
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1 bg-[#F7F3E9]/50 p-3 rounded-2xl border border-stone-200/60">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span className="truncate">{comp.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span>{comp.date} {comp.time ? `• ${comp.time}` : ''}</span>
                    </div>
                  </div>

                  {/* Registered Team Participants List */}
                  {participants.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Enrolled Squad Candidates:
                      </div>
                      {participants.map(p => (
                        <div key={p.studentId} className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-stone-50">
                          <span className="font-semibold text-stone-800">
                            <strong className="text-[#A91F35] font-mono mr-1">{p.chestNo}</strong>
                            {p.name}
                          </span>
                          {!comp.isEvaluated && (
                            <button
                              onClick={() => handleCancelRegistration(comp.competitionId, p.studentId, p.name)}
                              className="text-stone-400 hover:text-red-600"
                              title="Cancel candidate registration"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Max: {comp.maxParticipants || 15} entries
                  </span>

                  {comp.canRegister && (
                    <button
                      onClick={() => handleOpenRegistration(comp)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                      <span>{isReg ? 'Add More' : 'Register'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL: REGISTER SQUAD STUDENTS                                        */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {selectedCompForReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-linear-to-r from-[#A91F35] to-[#7f1525] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Enrol Squad in Competition</h3>
                  <p className="text-[11px] text-white/80">{selectedCompForReg.competitionTitle}</p>
                </div>
                <button
                  onClick={() => setSelectedCompForReg(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmRegistration} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                  <div><strong>Category:</strong> {selectedCompForReg.category} | <strong>Venue:</strong> {selectedCompForReg.venue}</div>
                  <div><strong>Date & Time:</strong> {selectedCompForReg.date} ({selectedCompForReg.time || 'TBD'})</div>
                  <div className="text-[11px] font-semibold text-[#A91F35]">
                    {selectedCompForReg.category === 'General' || selectedCompForReg.type === 'Group'
                      ? `Group / General Quota: ${selectedCompForReg.requiredMembers ? `${selectedCompForReg.requiredMembers} members per entry • ` : ''}Max 2 entries per team`
                      : `Individual Quota: Max 3 entries per team • Student limits: Sub Junior (4+5), Junior/Senior (5+6)`}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Select Eligible Candidates from {team?.name} Roster:
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-2xl p-2 space-y-1">
                    {(() => {
                      const compCat = (selectedCompForReg.category || 'General').toLowerCase().replace(/[\s_-]/g, '');
                      const eligibleStudents = teamStudents.filter(s => {
                        if (compCat === 'general' || selectedCompForReg.type === 'Group') return true;
                        const sCat = (s.classCategory || s.category || '').toLowerCase().replace(/[\s_-]/g, '');
                        return sCat === compCat;
                      });
                      if (eligibleStudents.length === 0) {
                        return (
                          <div className="p-4 text-center text-stone-500">
                            No eligible {selectedCompForReg.category} category students in your squad roster.
                          </div>
                        );
                      }
                      return eligibleStudents.map(student => {
                        const isAlreadyRegistered = (selectedCompForReg.teamParticipants || []).some(
                          p => p.studentId === student.id
                        );
                        const isChecked = selectedStudentIds.includes(student.id);

                        return (
                          <label
                            key={student.id}
                            className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                              isAlreadyRegistered
                                ? 'bg-stone-50 text-stone-400 cursor-not-allowed'
                                : isChecked
                                ? 'bg-[#A91F35]/10 border border-[#A91F35]/30 cursor-pointer'
                                : 'hover:bg-stone-50 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                disabled={isAlreadyRegistered}
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
                            {isAlreadyRegistered && (
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                Registered
                              </span>
                            )}
                          </label>
                        );
                      });
                    })()}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Registration Notes (Optional)</label>
                  <input
                    type="text"
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    placeholder="e.g. Lead speaker, slot timing preference..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-800 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCompForReg(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedStudentIds.length === 0}
                    className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] disabled:opacity-50 text-white font-bold shadow-md transition-colors"
                  >
                    Submit Enrolment
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
