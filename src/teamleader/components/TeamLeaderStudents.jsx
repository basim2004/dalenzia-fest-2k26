import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Eye,
  X,
  Sparkles,
  Users,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderStudents({ teamId }) {
  const [team, setTeam] = useState(() => festivalStore.getTeamById(teamId));
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());

  // Search & Filter within team
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState(null);
  const [chosenCompCategory, setChosenCompCategory] = useState('Literary Arena');

  // Student Profile Detail Modal
  const [inspectStudent, setInspectStudent] = useState(null);

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

  // Current squad students
  const squadStudents = useMemo(() => {
    return team?.students || [];
  }, [team]);

  // Filtered squad students
  const filteredSquadStudents = useMemo(() => {
    return squadStudents.filter(s => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.chestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        categoryFilter === 'all' || (s.category || '').toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [squadStudents, searchQuery, categoryFilter]);

  // Available students in registry for adding
  const availableStudents = useMemo(() => {
    return festivalStore.searchAvailableStudentsForTeam(teamId, addSearchQuery);
  }, [teamId, addSearchQuery, storeData]);

  const handleAddStudentToSquad = (e) => {
    e.preventDefault();
    if (!selectedStudentToAdd) {
      showToast('Please select a student candidate from the list.', 'error');
      return;
    }

    try {
      festivalStore.assignStudentToTeamLeaderTeam(teamId, selectedStudentToAdd.id, {
        competitionCategory: chosenCompCategory
      });
      showToast(`Student ${selectedStudentToAdd.name} (${selectedStudentToAdd.chestNo}) enrolled into squad!`);
      setShowAddModal(false);
      setSelectedStudentToAdd(null);
      setAddSearchQuery('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemoveStudent = (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove candidate ${studentName} from your team squad?`)) return;

    try {
      festivalStore.removeStudentFromTeamLeaderTeam(teamId, studentId, 'Leader roster update');
      showToast(`Candidate ${studentName} removed from squad.`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
              Team Roster Management
            </span>
            <span className="text-xs font-bold text-stone-500 font-mono">
              Total Enrolled: {squadStudents.length} Students
            </span>
          </div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            {team?.name} • Student Candidates
          </h2>
          <p className="text-xs text-stone-500">
            Enroll existing registered students into your squad. Changes synchronize immediately across Admin, Convener, and Leaderboard.
          </p>
        </div>

        <button
          onClick={() => {
            setAddSearchQuery('');
            setSelectedStudentToAdd(null);
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E6A916]" />
          <span>Add Existing Student</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate by name, chest number or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Categories</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>

      {/* Squad Roster Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Chest No</th>
                <th className="py-3 px-4">Student Candidate</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Discipline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSquadStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No candidates found in team squad matching filters.
                  </td>
                </tr>
              ) : (
                filteredSquadStudents.map(student => (
                  <tr key={student.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#A91F35] text-sm">
                      {student.chestNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{student.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">ID: {student.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold text-stone-800 text-[10px]">
                        {student.category || 'Junior'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700">
                      {student.compCategory || 'Literary Arena'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectStudent(student)}
                          className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors flex items-center gap-1"
                          title="View student profile"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Profile</span>
                        </button>
                        <button
                          onClick={() => handleRemoveStudent(student.id, student.name)}
                          className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors flex items-center gap-1"
                          title="Remove student from squad"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: ADD EXISTING STUDENT TO TEAM                                 */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-linear-to-r from-[#A91F35] to-[#7f1525] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Enroll Student to {team?.name}</h3>
                  <p className="text-[11px] text-white/80">Search central institutional student registry (Zero Duplicates)</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudentToSquad} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Search Student Candidate
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Type name, chest number or student ID..."
                      value={addSearchQuery}
                      onChange={(e) => setAddSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                {/* Candidate Selection List */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Select Available Candidate
                  </label>
                  <div className="max-h-52 overflow-y-auto border border-stone-200 rounded-2xl p-1.5 space-y-1">
                    {availableStudents.length === 0 ? (
                      <div className="p-4 text-center text-stone-500 text-xs">
                        No students found matching search.
                      </div>
                    ) : (
                      availableStudents.map(student => {
                        const isSelected = selectedStudentToAdd?.id === student.id;
                        return (
                          <div
                            key={student.id}
                            onClick={() => {
                              if (student.canAdd) setSelectedStudentToAdd(student);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                              !student.canAdd
                                ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#A91F35]/10 border-[#A91F35] shadow-xs cursor-pointer'
                                : 'hover:bg-[#F7F3E9] border-stone-200 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#A91F35] text-white flex items-center justify-center font-bold text-xs">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-stone-900">{student.name}</div>
                                <div className="text-[10px] text-stone-500 font-mono">
                                  Chest: {student.chestNo} • {student.classCategory}
                                </div>
                              </div>
                            </div>

                            <div>
                              {student.isAlreadyInMyTeam ? (
                                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                  Already In Squad
                                </span>
                              ) : student.isAssignedToOtherTeam ? (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                                  Assigned ({student.teamName || 'Other Team'})
                                </span>
                              ) : isSelected ? (
                                <span className="text-[9px] font-bold text-white bg-[#A91F35] px-2 py-0.5 rounded-md">
                                  Selected ✓
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                                  Available
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {selectedStudentToAdd && (
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Primary Discipline Focus for {selectedStudentToAdd.name}
                    </label>
                    <select
                      value={chosenCompCategory}
                      onChange={(e) => setChosenCompCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Literary Arena">Literary Arena (Arabic/Malayalam/Urdu/English)</option>
                      <option value="Islamic Heritage">Islamic Heritage & Qirath</option>
                      <option value="Public Speaking">Public Speaking & Oratory</option>
                      <option value="Visual Arts">Visual Arts & Calligraphy</option>
                      <option value="Media & Cultural">Media, Documentaries & Cultural</option>
                      <option value="General Championship">General Championship</option>
                    </select>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedStudentToAdd}
                    className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] disabled:opacity-50 text-white font-bold shadow-md transition-colors"
                  >
                    Confirm & Enroll Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 2: VIEW STUDENT PROFILE DETAILS                                 */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {inspectStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">{inspectStudent.name}</h3>
                  <p className="text-[11px] text-white/80">Chest No: {inspectStudent.chestNo} • Squad: {team?.name}</p>
                </div>
                <button
                  onClick={() => setInspectStudent(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Student ID:</span>
                    <span className="font-mono font-bold text-stone-900">{inspectStudent.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Class Category:</span>
                    <span className="font-bold text-[#A91F35]">{inspectStudent.category || 'Junior'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Discipline:</span>
                    <span className="font-bold text-stone-800">{inspectStudent.compCategory || 'Literary Arena'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Institution:</span>
                    <span className="font-semibold text-stone-800">Dalailussunna Dars, Ayiroor</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F7F3E9] text-[11px] text-stone-600">
                  Candidate is registered for official events in DALENZIA FEST 2K26 under team squad <strong>{team?.name}</strong>.
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectStudent(null)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
