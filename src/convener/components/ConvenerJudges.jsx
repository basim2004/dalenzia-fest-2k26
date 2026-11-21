import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  Layers,
  Phone,
  Mail,
  Building,
  UserCheck
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerJudges() {
  const [judges, setJudges] = useState(() => festivalStore.getJudges());
  const [competitions, setCompetitions] = useState(() => festivalStore.getCompetitions());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState(null);
  const [selectedJudgeForAssign, setSelectedJudgeForAssign] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    institution: '',
    phone: '',
    email: '',
    qualification: '',
    status: 'Active'
  });
  const [selectedCompIds, setSelectedCompIds] = useState([]);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setJudges([...festivalStore.getJudges()]);
    setCompetitions([...festivalStore.getCompetitions()]);
  };

  const filteredJudges = useMemo(() => {
    return judges.filter(j => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        j.name.toLowerCase().includes(q) ||
        (j.institution && j.institution.toLowerCase().includes(q)) ||
        (j.designation && j.designation.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === 'all' || j.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [judges, searchQuery, selectedStatus]);

  const openCreateModal = () => {
    setEditingJudge(null);
    setFormData({
      name: '',
      designation: 'Professor / Adjudicator',
      institution: 'Calicut University Department of Arabic',
      phone: '+91 94471 ',
      email: '',
      qualification: 'M.A, NET-JRF',
      status: 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (judge) => {
    setEditingJudge(judge);
    setFormData({
      name: judge.name,
      designation: judge.designation || '',
      institution: judge.institution || '',
      phone: judge.phone || '',
      email: judge.email || '',
      qualification: judge.qualification || '',
      status: judge.status || 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openAssignModal = (judge) => {
    setSelectedJudgeForAssign(judge);
    setSelectedCompIds(judge.assignedCompIds || []);
    setIsAssignModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingJudge) {
        festivalStore.updateJudge(editingJudge.id, formData);
        showToast(`Judge profile for ${formData.name} updated.`);
      } else {
        festivalStore.addJudge(formData);
        showToast(`New judge ${formData.name} added to adjudication panel.`);
      }
      reloadData();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save judge.');
    }
  };

  const handleResetPassword = (judgeId, judgeName) => {
    if (!window.confirm(`Reset login credentials for ${judgeName}? A temporary access code will be generated.`)) {
      return;
    }
    try {
      festivalStore.resetJudgeCredentials(judgeId);
      reloadData();
      showToast(`Credentials reset for ${judgeName}. Default temporary access restored.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = (judgeId, currentStatus) => {
    try {
      festivalStore.toggleJudgeStatus(judgeId);
      reloadData();
      showToast(`Judge status updated to ${currentStatus === 'Active' ? 'Suspended' : 'Active'}.`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Adjudicator Panel & Competition Assignments</h2>
          <p className="text-xs text-stone-500">Manage judging panels, credential resets, and event assignment allocations</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Adjudicator</span>
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
            placeholder="Search judges by name, institution, or qualification..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Adjudicators</option>
            <option value="Active">Active Panels</option>
            <option value="Inactive">Suspended / Inactive</option>
          </select>
        </div>
      </div>

      {/* Judges Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Judge ID</th>
                <th className="py-3 px-4">Adjudicator Name</th>
                <th className="py-3 px-4">Institution & Qualification</th>
                <th className="py-3 px-4 text-center">Assigned Events</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredJudges.map((j) => (
                <tr key={j.id} className="hover:bg-[#F7F3E9]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#A91F35]">
                    {j.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{j.name}</div>
                    <div className="text-[10px] text-stone-400">{j.designation}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-stone-800">{j.institution}</div>
                    <div className="text-[10px] text-stone-400">{j.qualification}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-[#047857] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {j.assignedCompIds?.length || 0} Competitions
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(j.id, j.status)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        j.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${j.status === 'Active' ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      <span>{j.status || 'Active'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(j)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-[#A91F35]/10 transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(j.id, j.name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Reset Credentials"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Judge Modal */}
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
                  <Shield className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {editingJudge ? `Edit Adjudicator (${editingJudge.name})` : 'Register New Adjudicator'}
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
                  <label className="text-[11px] font-bold text-stone-600">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Prof. Abdul Majeed Hudawi"
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Designation</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Dean of Islamic Epistemology"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Institution / Department</label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g. Calicut University"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 94471 xxxxx"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Email Address (Login ID)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="judge@dalenziafest.in"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Academic Qualifications & Specialization</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. Ph.D in Classical Arabic, M.Phil"
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
                    {editingJudge ? 'Update Adjudicator' : 'Save Adjudicator'}
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
