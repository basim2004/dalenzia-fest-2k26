import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  Clock,
  Compass,
  Calendar,
  Sparkles,
  Filter
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerSchedule() {
  const [schedules, setSchedules] = useState(() => festivalStore.getProgrammeSchedules());
  const [programmes, setProgrammes] = useState(() => festivalStore.getProgrammes());
  const [stages, setStages] = useState(() => festivalStore.getProgrammeStages());
  const [guests, setGuests] = useState(() => festivalStore.getProgrammeGuests());

  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    programmeId: '',
    date: 'Dec 21, 2026',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    stageId: 'STG-01',
    guestId: '',
    coordinatorName: '',
    notes: ''
  });
  const [conflicts, setConflicts] = useState([]);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setSchedules([...festivalStore.getProgrammeSchedules()]);
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        s.title.toLowerCase().includes(q) ||
        s.programmeCode.toLowerCase().includes(q) ||
        s.venue.toLowerCase().includes(q);

      const matchesDate = selectedDate === 'all' || s.date === selectedDate;
      const matchesStage = selectedStage === 'all' || s.stageId === selectedStage;

      return matchesSearch && matchesDate && matchesStage;
    });
  }, [schedules, searchQuery, selectedDate, selectedStage]);

  const openCreateModal = () => {
    setEditingSchedule(null);
    const firstProg = programmes[0];
    setFormData({
      programmeId: firstProg?.id || '',
      date: 'Dec 21, 2026',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      stageId: stages[0]?.id || 'STG-01',
      guestId: '',
      coordinatorName: firstProg?.coordinatorName || 'Usthad Anas K.',
      notes: ''
    });
    setConflicts([]);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (sch) => {
    setEditingSchedule(sch);
    setFormData({
      programmeId: sch.programmeId,
      date: sch.date,
      startTime: sch.startTime,
      endTime: sch.endTime,
      stageId: sch.stageId || 'STG-01',
      guestId: sch.guestId || '',
      coordinatorName: sch.coordinatorName || '',
      notes: sch.notes || ''
    });
    setConflicts([]);
    setFormError('');
    setIsModalOpen(true);
  };

  // Conflict Check
  const checkConflicts = () => {
    const stageObj = stages.find(s => s.id === formData.stageId);
    const result = festivalStore.detectScheduleConflicts(
      {
        programmeId: formData.programmeId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        stage: stageObj?.name || formData.stageId,
        assignedGuestIds: formData.guestId ? [formData.guestId] : []
      },
      editingSchedule ? editingSchedule.id : null
    );
    setConflicts(result.conflicts || []);
    return result.hasConflicts;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const hasConflict = checkConflicts();
    if (hasConflict) {
      setFormError('Stage schedule conflict detected! Overlapping sessions on the same stage.');
      return;
    }

    try {
      if (editingSchedule) {
        festivalStore.updateProgrammeSchedule(editingSchedule.id, formData);
        showToast('Schedule session updated successfully!');
      } else {
        festivalStore.addProgrammeSchedule(formData);
        showToast('New session scheduled successfully!');
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save schedule session.');
    }
  };

  const handleDelete = (schId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the master schedule?`)) {
      return;
    }
    try {
      festivalStore.deleteProgrammeSchedule(schId);
      reloadData();
      showToast('Schedule session removed.');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Master Stage Schedule & Conflict Engine</h2>
          <p className="text-xs text-stone-500">Coordinate timelines across 5 festival stages with real-time overlap detection</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schedule by session title, code, or stage..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Dates (Day 01 & 02)</option>
            <option value="Dec 21, 2026">Dec 21, 2026 (Day 01)</option>
            <option value="Dec 22, 2026">Dec 22, 2026 (Day 02)</option>
            <option value="Dec 23, 2026">Dec 23, 2026 (Day 03)</option>
          </select>

          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Stages ({stages.length})</option>
            {stages.map(stg => (
              <option key={stg.id} value={stg.id}>{stg.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Time & Date</th>
                <th className="py-3 px-4">Stage / Venue</th>
                <th className="py-3 px-4">Session Title & Code</th>
                <th className="py-3 px-4">Session Coordinator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-400">
                    No scheduled sessions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-[#F7F3E9]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{sch.time}</div>
                      <div className="text-[10px] text-stone-400">{sch.date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-800">{sch.stageName || sch.venue}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{sch.stageId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{sch.title}</div>
                      <div className="text-[10px] text-[#A91F35] font-mono font-bold">{sch.programmeCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {sch.coordinatorName || 'Festival Secretariat'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sch.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {sch.status || 'Scheduled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(sch)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-[#A91F35]/10 transition-colors"
                          title="Edit Schedule"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sch.id, sch.title)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove Schedule"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Schedule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-lg w-full border border-stone-200 space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-[#A91F35]">
                  <CalendarDays className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingSchedule ? 'Modify Schedule Session' : 'Schedule Programme Session'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {conflicts.length > 0 && (
                <div className="p-3 bg-amber-50 text-amber-900 text-xs rounded-xl border border-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Stage Schedule Conflict Detected</span>
                  </div>
                  {conflicts.map((c, i) => (
                    <div key={i} className="text-[11px]">
                      • Overlaps with: <strong>{c.title}</strong> ({c.time} on {c.venue})
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Select Programme *</label>
                  <select
                    value={formData.programmeId}
                    onChange={(e) => {
                      const sel = programmes.find(p => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        programmeId: e.target.value,
                        coordinatorName: sel?.coordinatorName || formData.coordinatorName
                      });
                    }}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {programmes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.code} — {p.title} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Stage Arena / Venue *</label>
                  <select
                    value={formData.stageId}
                    onChange={(e) => {
                      setFormData({ ...formData, stageId: e.target.value });
                    }}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {stages.map(stg => (
                      <option key={stg.id} value={stg.id}>
                        {stg.name} (Capacity: {stg.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Festival Date *</label>
                    <select
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Dec 21, 2026">Dec 21, 2026</option>
                      <option value="Dec 22, 2026">Dec 22, 2026</option>
                      <option value="Dec 23, 2026">Dec 23, 2026</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Start Time *</label>
                    <input
                      type="text"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      placeholder="10:00 AM"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">End Time *</label>
                    <input
                      type="text"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      placeholder="12:00 PM"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Session Coordinator</label>
                  <input
                    type="text"
                    value={formData.coordinatorName}
                    onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                    placeholder="Coordinator Name"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={checkConflicts}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Run Conflict Check</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all"
                    >
                      {editingSchedule ? 'Save Changes' : 'Confirm Schedule'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
