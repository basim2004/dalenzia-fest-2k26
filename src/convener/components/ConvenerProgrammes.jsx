import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Clock,
  Compass,
  UserCheck
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerProgrammes() {
  const [programmes, setProgrammes] = useState(() => festivalStore.getProgrammes());
  const [stages, setStages] = useState(() => festivalStore.getProgrammeStages());
  const [guests, setGuests] = useState(() => festivalStore.getProgrammeGuests());
  const [categories, setCategories] = useState(() => festivalStore.getProgrammeCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    malayalamTitle: '',
    category: 'Ceremonial & Keynote',
    desc: '',
    date: 'Dec 21, 2026',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    venue: 'Cordova Grand Stage (Stage 01)',
    coordinatorName: '',
    coordinatorPhone: '',
    guestId: '',
    status: 'Scheduled'
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setProgrammes([...festivalStore.getProgrammes()]);
    setStages([...festivalStore.getProgrammeStages()]);
    setGuests([...festivalStore.getProgrammeGuests()]);
  };

  const filteredProgrammes = useMemo(() => {
    return programmes.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        (p.coordinatorName && p.coordinatorName.toLowerCase().includes(q)) ||
        (p.venue && p.venue.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesDate = selectedDate === 'all' || p.date === selectedDate;

      return matchesSearch && matchesCat && matchesDate;
    });
  }, [programmes, searchQuery, selectedCategory, selectedDate]);

  const openCreateModal = () => {
    setEditingProg(null);
    setFormData({
      title: '',
      malayalamTitle: '',
      category: categories[0]?.name || 'Ceremonial & Keynote',
      desc: '',
      date: 'Dec 21, 2026',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      venue: stages[0]?.name || 'Cordova Grand Stage (Stage 01)',
      coordinatorName: 'Usthad Anas K.',
      coordinatorPhone: '+91 98471 11223',
      guestId: '',
      status: 'Scheduled'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingProg(prog);
    setFormData({
      title: prog.title,
      malayalamTitle: prog.malayalamTitle || '',
      category: prog.category,
      desc: prog.desc || '',
      date: prog.date,
      startTime: prog.startTime || '10:00 AM',
      endTime: prog.endTime || '12:00 PM',
      venue: prog.venue,
      coordinatorName: prog.coordinatorName || '',
      coordinatorPhone: prog.coordinatorPhone || '',
      guestId: prog.guestId || '',
      status: prog.status || 'Scheduled'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingProg) {
        festivalStore.updateProgramme(editingProg.id, formData);
        showToast(`Programme "${formData.title}" updated.`);
      } else {
        festivalStore.addProgramme(formData);
        showToast(`New programme "${formData.title}" added to schedule.`);
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save programme.');
    }
  };

  const handleDelete = (progId, progTitle) => {
    if (!window.confirm(`Are you sure you want to remove programme "${progTitle}"?`)) {
      return;
    }
    try {
      festivalStore.deleteProgramme(progId);
      reloadData();
      showToast(`Programme "${progTitle}" deleted.`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Festival Programme Operations</h2>
          <p className="text-xs text-stone-500">Stage colloquiums, keynote lectures, ceremonies and symposiums</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Programme</span>
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

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programmes by title, code, venue or coordinator..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Dates</option>
            <option value="Dec 21, 2026">Dec 21, 2026 (Day 01)</option>
            <option value="Dec 22, 2026">Dec 22, 2026 (Day 02)</option>
            <option value="Dec 23, 2026">Dec 23, 2026 (Day 03)</option>
          </select>
        </div>
      </div>

      {/* Programme Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Session Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Stage / Venue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredProgrammes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-400">
                    No programmes match your filter query.
                  </td>
                </tr>
              ) : (
                filteredProgrammes.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F7F3E9]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#A91F35]">
                      {p.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{p.title}</div>
                      {p.malayalamTitle && <div className="text-[10px] text-stone-400 font-serif">{p.malayalamTitle}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">{p.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      <div className="font-bold">{p.date}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{p.time}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-800">
                      {p.venue}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-[#A91F35]/10 transition-colors"
                          title="Edit Programme"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Programme"
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

      {/* Create / Edit Modal */}
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
                  <Calendar className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingProg ? `Edit Programme (${editingProg.code})` : 'Create New Stage Programme'}
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

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Session Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Inaugural Colloquium & Keynote Symposium"
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Malayalam Title (Optional)</label>
                  <input
                    type="text"
                    value={formData.malayalamTitle}
                    onChange={(e) => setFormData({ ...formData, malayalamTitle: e.target.value })}
                    placeholder="e.g. ഉദ്ഘാടന സമ്മേളനം"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Date *</label>
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
                  <label className="text-[11px] font-bold text-stone-600">Venue Stage *</label>
                  <select
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Coordinator Name</label>
                    <input
                      type="text"
                      value={formData.coordinatorName}
                      onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Coordinator Phone</label>
                    <input
                      type="text"
                      value={formData.coordinatorPhone}
                      onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
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
                    {editingProg ? 'Save Changes' : 'Schedule Programme'}
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
