import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  MapPin,
  User,
  Phone,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerActivities() {
  const [activities, setActivities] = useState(() => festivalStore.getOperationalActivities());
  const [stages, setStages] = useState(() => festivalStore.getProgrammeStages());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAct, setEditingAct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Logistics & Hospitality',
    date: 'Dec 21, 2026',
    time: '08:00 AM – 10:00 AM',
    venue: 'Campus Central Arena',
    responsiblePerson: '',
    phone: '',
    status: 'Pending',
    priority: 'Normal',
    internalRemarks: ''
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setActivities([...festivalStore.getOperationalActivities()]);
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        a.title.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.responsiblePerson && a.responsiblePerson.toLowerCase().includes(q)) ||
        (a.venue && a.venue.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [activities, searchQuery, selectedStatus]);

  const openCreateModal = () => {
    setEditingAct(null);
    setFormData({
      title: '',
      description: '',
      category: 'Logistics & Hospitality',
      date: 'Dec 21, 2026',
      time: '08:00 AM – 10:00 AM',
      venue: stages[0]?.name || 'Campus Central Arena',
      responsiblePerson: 'Usthad Anas K.',
      phone: '+91 98471 11223',
      status: 'Pending',
      priority: 'Normal',
      internalRemarks: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (act) => {
    setEditingAct(act);
    setFormData({
      title: act.title,
      description: act.description || '',
      category: act.category || 'Logistics & Hospitality',
      date: act.date || 'Dec 21, 2026',
      time: act.time || '',
      venue: act.venue || '',
      responsiblePerson: act.responsiblePerson || '',
      phone: act.phone || '',
      status: act.status || 'Pending',
      priority: act.priority || 'Normal',
      internalRemarks: act.internalRemarks || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingAct) {
        festivalStore.updateOperationalActivity(editingAct.id, formData);
        showToast(`Operational activity "${formData.title}" updated.`);
      } else {
        festivalStore.addOperationalActivity(formData);
        showToast(`New operational task "${formData.title}" logged.`);
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save activity.');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    try {
      festivalStore.updateOperationalActivityStatus(id, newStatus);
      reloadData();
      showToast(`Task status updated to ${newStatus}.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete task "${title}"?`)) {
      return;
    }
    try {
      festivalStore.deleteOperationalActivity(id);
      reloadData();
      showToast(`Activity "${title}" deleted.`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Operational Activities & Logistics (Paripadi)</h2>
          <p className="text-xs text-stone-500">Day-to-day festival operational tasks, volunteer briefings, and duty assignments</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log Operational Task</span>
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
            placeholder="Search operational tasks by title, lead coordinator, or venue..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-[#A91F35]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-bold text-[10px]">
                    {act.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    act.priority === 'Urgent'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : act.priority === 'Important'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {act.priority} Priority
                  </span>
                </div>
                <h3 className="font-bold text-stone-900 text-sm mt-1.5 line-clamp-1">{act.title}</h3>
                <div className="text-[10px] text-stone-400">{act.category}</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(act)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-stone-100 transition-colors"
                  title="Edit Task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(act.id, act.title)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              {act.description}
            </p>

            <div className="p-3 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">In-Charge</span>
                <span className="font-bold text-stone-800 line-clamp-1">{act.responsiblePerson}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Venue / Location</span>
                <span className="text-stone-700 line-clamp-1">{act.venue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Timing Window</span>
                <span className="font-mono text-stone-600 text-[11px]">{act.date} ({act.time})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <select
                value={act.status}
                onChange={(e) => handleStatusChange(act.id, e.target.value)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border focus:outline-none ${
                  act.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : act.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : act.status === 'Active'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>

              {act.phone && (
                <span className="text-[10px] text-stone-400 font-mono">
                  {act.phone}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
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
                  <ClipboardList className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingAct ? `Edit Operational Task (${editingAct.code})` : 'Log New Operational Activity'}
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
                  <label className="text-[11px] font-bold text-stone-600">Activity Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Volunteer Marshaling & Stage Security"
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Task Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    placeholder="Operational responsibilities and checklist..."
                    className="w-full bg-[#FAF7F0] p-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Logistics & Hospitality"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Responsible Person *</label>
                    <input
                      type="text"
                      value={formData.responsiblePerson}
                      onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                      placeholder="In-Charge Name"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98471 xxxxx"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Venue / Location</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Timing</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g. 08:00 AM – 10:00 AM"
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
                    {editingAct ? 'Update Task' : 'Save Task'}
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
