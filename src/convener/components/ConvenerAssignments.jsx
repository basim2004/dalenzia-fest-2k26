import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Search,
  Plus,
  Filter,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  Trophy,
  Calendar,
  Sparkles
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerAssignments() {
  const [competitions, setCompetitions] = useState(() => festivalStore.getCompetitions());
  const [students, setStudents] = useState(() => festivalStore.getStudents());
  const [teams, setTeams] = useState(() => festivalStore.getTeams());
  const [selectedCompId, setSelectedCompId] = useState('all');
  const [selectedTeamId, setSelectedTeamId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetCompetitionId, setTargetCompetitionId] = useState(competitions[0]?.id || '');
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setCompetitions([...festivalStore.getCompetitions()]);
    setStudents([...festivalStore.getStudents()]);
  };

  // Flattened list of all registration entries across all competitions
  const allRegistrations = useMemo(() => {
    const list = [];
    competitions.forEach(c => {
      (c.participants || []).forEach(p => {
        list.push({
          competitionId: c.competitionId || c.id,
          competitionTitle: c.title || c.competitionTitle,
          competitionCode: c.code || c.competitionCode,
          category: c.category,
          venue: c.venue,
          date: c.date,
          studentId: p.studentId,
          chestNo: p.chestNo,
          name: p.name,
          teamId: p.teamId,
          teamName: p.teamName,
          registeredAt: p.registeredAt || '2026-12-01'
        });
      });
    });
    return list;
  }, [competitions]);

  const filteredRegistrations = useMemo(() => {
    return allRegistrations.filter(r => {
      const matchesComp = selectedCompId === 'all' || r.competitionId === selectedCompId;
      const matchesTeam = selectedTeamId === 'all' || r.teamId === selectedTeamId;
      const matchesSearch =
        searchQuery === '' ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.chestNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.competitionTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesComp && matchesTeam && matchesSearch;
    });
  }, [allRegistrations, selectedCompId, selectedTeamId, searchQuery]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setModalError('');

    try {
      festivalStore.registerParticipantForCompetition(targetCompetitionId, targetStudentId);
      reloadData();
      setIsAssignModalOpen(false);
      showToast('Candidate successfully registered for competition event!');
    } catch (err) {
      setModalError(err.message || 'Failed to register participant.');
    }
  };

  const handleRemoveRegistration = (competitionId, studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to cancel ${studentName}'s registration for this event?`)) {
      return;
    }
    try {
      festivalStore.removeParticipantFromCompetition(competitionId, studentId);
      reloadData();
      showToast(`Cancelled registration for ${studentName}.`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Student Event Assignments & Participation</h2>
          <p className="text-xs text-stone-500">Assign registered candidates to competition arenas and official stage programmes</p>
        </div>
        <button
          onClick={() => {
            setModalError('');
            setIsAssignModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Candidate to Event</span>
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, chest number, or event title..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Competitions ({competitions.length})</option>
            {competitions.map(c => (
              <option key={c.id || c.competitionId} value={c.competitionId || c.id}>
                {c.title || c.competitionTitle}
              </option>
            ))}
          </select>

          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Teams</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Registrations Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Active Event Enrolment Roster ({filteredRegistrations.length} slots)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Candidate & Chest</th>
                <th className="py-3 px-4">Assigned Team</th>
                <th className="py-3 px-4">Event / Competition</th>
                <th className="py-3 px-4">Category Arena</th>
                <th className="py-3 px-4">Venue & Date</th>
                <th className="py-3 px-4">Enrolment Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-400">
                    No active registrations match your filter query.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F3E9]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{r.name}</div>
                      <div className="text-[10px] font-mono font-bold text-[#A91F35]">{r.chestNo} • {r.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">{r.teamName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{r.competitionTitle}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{r.competitionCode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <div>{r.venue}</div>
                      <div className="text-[10px] text-stone-400">{r.date}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 font-mono text-[10px]">
                      {r.registeredAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemoveRegistration(r.competitionId, r.studentId, r.name)}
                        className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-colors"
                      >
                        Cancel Slot
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-[#A91F35]">
                  <Layers className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">Enrol Candidate in Event</h3>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {modalError && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Target Competition / Event *</label>
                  <select
                    value={targetCompetitionId}
                    onChange={(e) => setTargetCompetitionId(e.target.value)}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {competitions.map(c => (
                      <option key={c.id || c.competitionId} value={c.id || c.competitionId}>
                        {c.code || c.competitionCode} — {c.title || c.competitionTitle} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Select Student Candidate *</label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.chestNo} — {s.name} ({s.teamName} • {s.classCategory})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all"
                  >
                    Confirm Enrolment
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
