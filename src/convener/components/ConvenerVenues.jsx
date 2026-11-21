import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  Users,
  Layers,
  MapPin
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerVenues() {
  const [stages, setStages] = useState(() => festivalStore.getProgrammeStages());
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    malayalamName: '',
    venue: '',
    type: 'Auditorium / Stage',
    capacity: 500,
    color: '#A91F35',
    locationDesc: 'Campus Central Arena'
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setStages([...festivalStore.getProgrammeStages()]);
  };

  const filteredStages = useMemo(() => {
    return stages.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === '' ||
        s.name.toLowerCase().includes(q) ||
        s.venue.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      );
    });
  }, [stages, searchQuery]);

  const openCreateModal = () => {
    setEditingStage(null);
    setFormData({
      name: '',
      shortName: '',
      malayalamName: '',
      venue: '',
      type: 'Ceremonial / Auditorium',
      capacity: 500,
      color: '#A91F35',
      locationDesc: 'Campus Main Grounds'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (stage) => {
    setEditingStage(stage);
    setFormData({
      name: stage.name,
      shortName: stage.shortName || stage.name,
      malayalamName: stage.malayalamName || '',
      venue: stage.venue,
      type: stage.type || 'Auditorium',
      capacity: stage.capacity || 500,
      color: stage.color || '#A91F35',
      locationDesc: stage.locationDesc || 'Campus Central Arena'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingStage) {
        festivalStore.updateProgrammeStage(editingStage.id, formData);
        showToast(`Stage "${formData.name}" updated successfully.`);
      } else {
        festivalStore.addProgrammeStage(formData);
        showToast(`New stage "${formData.name}" added to festival venues.`);
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save stage.');
    }
  };

  const handleToggleStatus = (stageId, currentStatus) => {
    try {
      festivalStore.toggleProgrammeStageStatus(stageId);
      reloadData();
      showToast('Stage operational status updated.');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (stageId, stageName) => {
    if (!window.confirm(`Are you sure you want to delete stage "${stageName}"?`)) {
      return;
    }
    try {
      festivalStore.deleteProgrammeStage(stageId);
      reloadData();
      showToast(`Stage "${stageName}" deleted.`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Festival Venues & Stage Arenas</h2>
          <p className="text-xs text-stone-500">Stage capacity configuration, acoustic profiles, and venue readiness</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stage</span>
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

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stages by name, venue or auditorium type..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStages.map((stg) => (
          <div
            key={stg.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-[#A91F35]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs text-white"
                  style={{ backgroundColor: stg.color || '#A91F35' }}
                >
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{stg.name}</h3>
                  <div className="text-[10px] text-stone-400 font-mono">{stg.code} • {stg.type}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(stg)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-stone-100 transition-colors"
                  title="Edit Stage"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(stg.id, stg.name)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Stage"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Auditorium Capacity</span>
                <span className="font-mono font-bold text-stone-900">{stg.capacity?.toLocaleString() || 500} Seats</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Location Setting</span>
                <span className="text-stone-800 line-clamp-1">{stg.locationDesc || 'Ayiroor Campus'}</span>
              </div>
              {stg.malayalamName && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Malayalam Tag</span>
                  <span className="font-serif text-[#A91F35] font-bold">{stg.malayalamName}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleStatus(stg.id, stg.status)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  stg.status === 'Maintenance'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${stg.status === 'Maintenance' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span>{stg.status || 'Active'}</span>
              </button>

              <span className="text-[10px] text-stone-400 font-medium">
                Official Stage
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-[#A91F35]">
                  <Compass className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingStage ? `Edit Stage (${editingStage.code})` : 'Add New Stage Arena'}
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
                  <label className="text-[11px] font-bold text-stone-600">Stage Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Al-Razi Science & Media Hall"
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Short Name</label>
                    <input
                      type="text"
                      value={formData.shortName}
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                      placeholder="e.g. Al-Razi Hall"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Seating Capacity *</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) })}
                      min="50"
                      max="5000"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Malayalam Name</label>
                    <input
                      type="text"
                      value={formData.malayalamName}
                      onChange={(e) => setFormData({ ...formData, malayalamName: e.target.value })}
                      placeholder="e.g. അൽ റാസി ഹാൾ"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Auditorium Type</label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g. Seminar Arena"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Location Description</label>
                  <input
                    type="text"
                    value={formData.locationDesc}
                    onChange={(e) => setFormData({ ...formData, locationDesc: e.target.value })}
                    placeholder="e.g. Academic Block, Ground Floor"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
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
                    {editingStage ? 'Save Changes' : 'Create Stage'}
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
