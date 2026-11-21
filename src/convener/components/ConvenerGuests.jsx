import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Mail,
  Building,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerGuests() {
  const [guests, setGuests] = useState(() => festivalStore.getProgrammeGuests());
  const [programmes, setProgrammes] = useState(() => festivalStore.getProgrammes());
  const [categories, setCategories] = useState(() => festivalStore.getGuestCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    institution: '',
    category: 'Islamic Scholars & Grand Muftis',
    invitationStatus: 'Confirmed',
    participationStatus: 'Keynote Speaker',
    phone: '',
    email: '',
    bio: '',
    internalNotes: '',
    assignedProgrammeIds: []
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setGuests([...festivalStore.getProgrammeGuests()]);
  };

  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        g.name.toLowerCase().includes(q) ||
        (g.institution && g.institution.toLowerCase().includes(q)) ||
        (g.designation && g.designation.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === 'all' || g.invitationStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [guests, searchQuery, selectedStatus]);

  const openCreateModal = () => {
    setEditingGuest(null);
    setFormData({
      name: '',
      designation: '',
      institution: '',
      category: categories[0]?.name || 'Islamic Scholars & Grand Muftis',
      invitationStatus: 'Confirmed',
      participationStatus: 'Keynote Speaker',
      phone: '',
      email: '',
      bio: '',
      internalNotes: '',
      assignedProgrammeIds: [programmes[0]?.id || 'PRG-001']
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      designation: guest.designation || '',
      institution: guest.institution || '',
      category: guest.category || categories[0]?.name,
      invitationStatus: guest.invitationStatus || 'Confirmed',
      participationStatus: guest.participationStatus || 'Keynote Speaker',
      phone: guest.phone || '',
      email: guest.email || '',
      bio: guest.bio || '',
      internalNotes: guest.internalNotes || '',
      assignedProgrammeIds: guest.assignedProgrammeIds || []
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingGuest) {
        festivalStore.updateProgrammeGuest(editingGuest.id, formData);
        showToast(`Guest profile for ${formData.name} updated.`);
      } else {
        festivalStore.addProgrammeGuest(formData);
        showToast(`New guest ${formData.name} added to roster.`);
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save guest.');
    }
  };

  const handleDelete = (guestId, guestName) => {
    if (!window.confirm(`Are you sure you want to remove guest ${guestName}?`)) {
      return;
    }
    try {
      festivalStore.deleteProgrammeGuest(guestId);
      reloadData();
      showToast(`Guest ${guestName} deleted.`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Keynote Guests & Dignitaries</h2>
          <p className="text-xs text-stone-500">Distinguished Islamic scholars, academicians, and stage keynote assignments</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Guest Dignitary</span>
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
            placeholder="Search guests by name, institution, or title..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Invitation Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Tentative">Tentative</option>
            <option value="Invited">Invited</option>
          </select>
        </div>
      </div>

      {/* Guests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-[#A91F35]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center font-bold text-xs shrink-0">
                  <Sparkles className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{guest.name}</h3>
                  <div className="text-[10px] text-stone-400 font-mono">{guest.id} • {guest.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(guest)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-stone-100 transition-colors"
                  title="Edit Guest"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(guest.id, guest.name)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Guest"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200/60 space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 font-medium">Designation & Institution</span>
                <div className="font-bold text-stone-800 line-clamp-1">{guest.designation}</div>
                <div className="text-[10px] text-stone-500">{guest.institution}</div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">Programme Assignments</span>
                <span className="font-mono font-bold text-stone-800">
                  {guest.assignedProgrammeIds?.length || 0} Sessions
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                guest.invitationStatus === 'Confirmed'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {guest.invitationStatus}
              </span>

              <span className="text-[10px] font-bold text-stone-500">
                {guest.participationStatus || 'Keynote Speaker'}
              </span>
            </div>
          </div>
        ))}
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
                  <UserPlus className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingGuest ? `Edit Guest (${editingGuest.name})` : 'Add Dignitary to Guest Roster'}
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
                  <label className="text-[11px] font-bold text-stone-600">Scholar / Guest Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sayyid Munawwar Ali Shihab Thangal"
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Designation *</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. President / Dean"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Institution / University *</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g. Darul Huda Islamic University"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Guest Category</label>
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
                    <label className="text-[11px] font-bold text-stone-600">Invitation Status</label>
                    <select
                      value={formData.invitationStatus}
                      onChange={(e) => setFormData({ ...formData, invitationStatus: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Tentative">Tentative</option>
                      <option value="Invited">Invited</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Biographical Synopsis</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="2"
                    placeholder="Brief background and scholarly achievements..."
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
                    {editingGuest ? 'Save Profile' : 'Save to Roster'}
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
