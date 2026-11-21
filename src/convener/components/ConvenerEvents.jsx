import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Medal,
  Users,
  Shield,
  Calendar,
  Compass
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerEvents() {
  const [competitions, setCompetitions] = useState(() => festivalStore.getCompetitions());
  const [stages, setStages] = useState(() => festivalStore.getProgrammeStages());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Literary Arena',
    type: 'Individual',
    venue: 'Ibn Khaldun Academic Hall (Stage 03)',
    date: 'Dec 21, 2026',
    time: '02:00 PM',
    maxParticipants: 24,
    rules: '',
    description: ''
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setCompetitions([...festivalStore.getCompetitions()]);
  };

  const filteredCompetitions = useMemo(() => {
    return competitions.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        (c.title || c.competitionTitle).toLowerCase().includes(q) ||
        (c.code || c.competitionCode).toLowerCase().includes(q) ||
        (c.venue && c.venue.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [competitions, searchQuery, selectedCategory]);

  const openCreateModal = () => {
    setEditingComp(null);
    setFormData({
      title: '',
      category: 'Literary Arena',
      type: 'Individual',
      venue: stages[0]?.name || 'Cordova Grand Stage (Stage 01)',
      date: 'Dec 21, 2026',
      time: '02:00 PM',
      maxParticipants: 24,
      rules: 'Standard official festival rubric applies.',
      description: 'Premier competitive festival event for enrolled scholars.'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (comp) => {
    setEditingComp(comp);
    setFormData({
      title: comp.title || comp.competitionTitle,
      category: comp.category,
      type: comp.type || 'Individual',
      venue: comp.venue,
      date: comp.date,
      time: comp.time,
      maxParticipants: comp.maxParticipants || 24,
      rules: comp.rules || '',
      description: comp.description || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingComp) {
        festivalStore.updateCompetition(editingComp.id || editingComp.competitionId, formData);
        showToast(`Competition event "${formData.title}" updated.`);
      } else {
        festivalStore.addCompetition(formData);
        showToast(`New competition event "${formData.title}" created.`);
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save competition event.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Competition & Event Operations</h2>
          <p className="text-xs text-stone-500">Event syllabus guidelines, stage arenas, participant rosters and judge alignment</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Competition Event</span>
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

      {/* Search and Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competitions by code, title, or arena..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Arenas</option>
            <option value="Literary Arena">Literary Arena</option>
            <option value="Islamic Heritage">Islamic Heritage</option>
            <option value="Public Speaking">Public Speaking</option>
            <option value="Visual Arts">Visual Arts</option>
            <option value="Media & Cultural">Media & Cultural</option>
          </select>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetitions.map((comp) => (
          <div
            key={comp.id || comp.competitionId}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-[#A91F35]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-bold text-[10px]">
                  {comp.code || comp.competitionCode}
                </span>
                <h3 className="font-bold text-stone-900 text-sm mt-1.5 line-clamp-1">
                  {comp.title || comp.competitionTitle}
                </h3>
                <div className="text-[10px] text-stone-400">{comp.category} • {comp.type || 'Individual'}</div>
              </div>

              <button
                onClick={() => openEditModal(comp)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-stone-100 transition-colors"
                title="Edit Event"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Stage & Venue</span>
                <span className="font-bold text-stone-800 line-clamp-1">{comp.venue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Date & Timing</span>
                <span className="font-mono text-stone-700">{comp.date} ({comp.time})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Enrolled Candidates</span>
                <span className="font-mono font-bold text-stone-900">
                  {comp.participants?.length || comp.registeredCount || 0} / {comp.maxParticipants || 24}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Assigned Jury</span>
                <span className="font-mono font-bold text-[#047857]">
                  {comp.assignedJudgeIds?.length || 0} Judges
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                comp.isPublished ? 'bg-emerald-50 text-emerald-800' : comp.status === 'Under Verification' ? 'bg-amber-50 text-amber-800' : 'bg-stone-100 text-stone-700'
              }`}>
                {comp.isPublished ? 'Published Result' : comp.status || 'Active'}
              </span>

              {comp.resultPoster && (
                <span className="text-[10px] font-bold text-[#E6A916]">
                  Podium Certified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Event Modal */}
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
                  <Trophy className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingComp ? `Edit Event (${editingComp.code || editingComp.competitionCode})` : 'Create New Competition Event'}
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
                  <label className="text-[11px] font-bold text-stone-600">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior English Extempore"
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Category Arena *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Literary Arena">Literary Arena</option>
                      <option value="Islamic Heritage">Islamic Heritage</option>
                      <option value="Public Speaking">Public Speaking</option>
                      <option value="Visual Arts">Visual Arts</option>
                      <option value="Media & Cultural">Media & Cultural</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Participation Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Individual">Individual (30 - 20 - 10)</option>
                      <option value="Group">Group Event (45 - 30 - 15)</option>
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
                    <label className="text-[11px] font-bold text-stone-600">Time *</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="02:00 PM"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Max Capacity</label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value, 10) })}
                      min="4"
                      max="60"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Stage Arena / Venue *</label>
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

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Rules & Rubric Guidelines</label>
                  <textarea
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    rows="2"
                    placeholder="Adjudication criteria and timing instructions..."
                    className="w-full bg-[#FAF7F0] p-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
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
                    {editingComp ? 'Update Event' : 'Save Event'}
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
