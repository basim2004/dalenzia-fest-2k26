import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Trophy,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Award,
  Crown,
  Phone,
  UserCheck
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerTeams() {
  const [teams, setTeams] = useState(() => festivalStore.getTeams());
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    subname: '',
    leader: '',
    leaderContact: '',
    members: 80,
    status: 'Active'
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setTeams([...festivalStore.getTeams()]);
  };

  const filteredTeams = useMemo(() => {
    return teams.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === '' ||
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        (t.leader && t.leader.toLowerCase().includes(q)) ||
        (t.subname && t.subname.toLowerCase().includes(q))
      );
    });
  }, [teams, searchQuery]);

  const openCreateModal = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      code: `TM${String(teams.length + 1).padStart(3, '0')}`,
      subname: 'Ayiroor Central',
      leader: '',
      leaderContact: '+91 ',
      members: 50,
      status: 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      code: team.code,
      subname: team.subname || '',
      leader: team.leader || '',
      leaderContact: team.leaderContact || '',
      members: team.members || 50,
      status: team.status || 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingTeam) {
        festivalStore.updateTeam(editingTeam.id, formData);
        showToast(`Team ${formData.name} updated successfully!`);
      } else {
        festivalStore.addTeam(formData);
        showToast(`New team ${formData.name} created successfully!`);
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save team.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Championship Team Squads</h2>
          <p className="text-xs text-stone-500">12 official competing teams, squad leaders, and championship point tallies</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Squad</span>
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

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams by name, code, leader, or zone..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((team, idx) => (
          <div
            key={team.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-[#A91F35]/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black font-mono shadow-xs ${
                  team.rank === 1 ? 'bg-[#E6A916] text-[#A91F35]' : team.rank === 2 ? 'bg-stone-300 text-stone-800' : team.rank === 3 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                }`}>
                  #{team.rank || idx + 1}
                </span>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{team.name}</h3>
                  <div className="text-[10px] text-stone-400 font-mono">{team.code} • {team.subname || 'Ayiroor'}</div>
                </div>
              </div>

              <button
                onClick={() => openEditModal(team)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-stone-100 transition-colors"
                title="Edit Team"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Squad Leader</span>
                <span className="font-bold text-stone-800">{team.leader || 'Pending'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Contact Phone</span>
                <span className="font-mono text-stone-600">{team.leaderContact || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Roster Members</span>
                <span className="font-mono font-bold text-stone-900">{team.members || 0} Students</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Championship Score</span>
                <div className="text-base font-black font-mono text-[#A91F35]">{team.points || 0} pts</div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {team.status || 'Active'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Team Modal */}
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
                  <Users className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingTeam ? `Edit Squad (${editingTeam.name})` : 'Create New Team Squad'}
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
                  <label className="text-[11px] font-bold text-stone-600">Team Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Team Al-Hikmah"
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Team Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. TM013"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Zone / Campus</label>
                    <input
                      type="text"
                      value={formData.subname}
                      onChange={(e) => setFormData({ ...formData, subname: e.target.value })}
                      placeholder="e.g. Areekode East"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Squad Leader Name</label>
                    <input
                      type="text"
                      value={formData.leader}
                      onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                      placeholder="Leader Name"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Leader Phone</label>
                    <input
                      type="text"
                      value={formData.leaderContact}
                      onChange={(e) => setFormData({ ...formData, leaderContact: e.target.value })}
                      placeholder="+91 98471 xxxxx"
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
                    {editingTeam ? 'Save Changes' : 'Create Squad'}
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
