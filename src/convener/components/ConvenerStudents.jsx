import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Search,
  Plus,
  Filter,
  Trash2,
  Edit2,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  Users,
  Download,
  Phone,
  Mail,
  Building,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerStudents() {
  const [students, setStudents] = useState(() => festivalStore.getStudents());
  const [teams, setTeams] = useState(() => festivalStore.getTeams());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneEditStudent, setPhoneEditStudent] = useState(null);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    chestNo: '',
    classCategory: 'Senior',
    teamId: '',
    dob: '2007-05-15',
    institution: 'Dalailussunna Dars, Ayiroor',
    phone: '',
    email: '',
    gender: 'Male',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadData = () => {
    setStudents([...festivalStore.getStudents()]);
    setTeams([...festivalStore.getTeams()]);
  };

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.chestNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTeam = selectedTeam === 'all' || s.teamId === selectedTeam;
      const matchesCategory = selectedCategory === 'all' || (s.classCategory || '').toLowerCase().replace(/[\s-_]/g, '') === selectedCategory.toLowerCase().replace(/[\s-_]/g, '');

      return matchesSearch && matchesTeam && matchesCategory;
    });
  }, [students, searchQuery, selectedTeam, selectedCategory]);

  const openAddModal = () => {
    setFormData({
      name: '',
      chestNo: '',
      classCategory: 'Junior',
      teamId: teams[0]?.id || '',
      dob: '2007-05-15',
      institution: 'Dalailussunna Dars, Ayiroor',
      phone: '',
      email: '',
      gender: 'Male',
      status: 'Active'
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      chestNo: student.chestNo,
      classCategory: student.classCategory || 'Junior',
      teamId: student.teamId || '',
      dob: student.dob || '2007-05-15',
      institution: student.institution || 'Dalailussunna Dars, Ayiroor',
      phone: student.phone || '',
      email: student.email || '',
      gender: student.gender || 'Male',
      status: student.status || 'Active'
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleNameChange = (val) => {
    const autoEmail = festivalStore.generateStudentEmail(val);
    setFormData(prev => ({
      ...prev,
      name: val,
      email: (!prev.email || prev.email.endsWith('@dalanzia.org')) ? autoEmail : prev.email
    }));
  };

  const handleOpenPhoneModal = (student) => {
    setPhoneEditStudent(student);
    setPhoneInputValue(student.phone || '');
    setPhoneError('');
    setIsPhoneModalOpen(true);
  };

  const handleSavePhone = (e) => {
    e.preventDefault();
    if (!phoneEditStudent) return;
    try {
      festivalStore.updateStudentPhone(phoneEditStudent.id, phoneInputValue);
      setToastMessage(`Phone number updated for ${phoneEditStudent.name}`);
      setTimeout(() => setToastMessage(''), 3000);
      setIsPhoneModalOpen(false);
      reloadData();
    } catch (err) {
      setPhoneError(err.message || 'Failed to update phone number.');
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      festivalStore.addStudent(formData);
      reloadData();
      setIsAddModalOpen(false);
      showToast(`Student ${formData.name} added to registry successfully!`);
    } catch (err) {
      setFormError(err.message || 'Failed to add student.');
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      festivalStore.updateStudent(selectedStudent.id, formData);
      reloadData();
      setIsEditModalOpen(false);
      showToast(`Student ${formData.name} updated successfully!`);
    } catch (err) {
      setFormError(err.message || 'Failed to update student.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmation) return;
    try {
      festivalStore.deleteStudent(deleteConfirmation.id, false);
      reloadData();
      showToast(`Student ${deleteConfirmation.name} deleted.`);
      setDeleteConfirmation(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Student Registry & Enrollment</h2>
          <p className="text-xs text-stone-500">Official student candidates, ID allocations, and team squad memberships</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Candidate</span>
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
            placeholder="Search by student name, ID (STU-10xx), or chest number..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Teams ({teams.length})</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Categories</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="Sub Junior">Sub Junior</option>
            <option value="Minor">Minor</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Chest & ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Squad Team</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F7F3E9]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-[#A91F35] bg-[#A91F35]/10 px-2 py-0.5 rounded">
                        {s.chestNo}
                      </span>
                      <div className="text-[10px] text-stone-400 mt-0.5">{s.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{s.name}</div>
                      <div className="text-[10px] text-stone-400">{s.gender || 'Male'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-800">{s.teamName}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                        {s.classCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {s.institution}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{s.status || 'Active'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setIsProfileModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-[#A91F35]/10 transition-colors"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation(s)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Student"
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

      {/* Add / Edit Student Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-lg w-full border border-stone-200 space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-[#A91F35]">
                  <UserCheck className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {isAddModalOpen ? 'Register New Student Candidate' : `Edit Student Profile (${selectedStudent?.id})`}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Ahmad Rayan K."
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Chest Number (Optional)</label>
                    <input
                      type="text"
                      value={formData.chestNo}
                      onChange={(e) => setFormData({ ...formData, chestNo: e.target.value })}
                      placeholder="Auto-generated if empty"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Division / Class *</label>
                    <select
                      value={formData.classCategory}
                      onChange={(e) => setFormData({ ...formData, classCategory: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Senior">Senior</option>
                      <option value="Junior">Junior</option>
                      <option value="Sub Junior">Sub Junior</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Assigned Team Squad *</label>
                    <select
                      value={formData.teamId}
                      onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="">-- No Team (Unassigned) --</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600">Institution / Dars</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Contact Phone (Optional - can be added later)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98471 xxxxx"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@dalanzia.org"
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all"
                  >
                    {isAddModalOpen ? 'Save to Registry' : 'Update Candidate'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      {/* Add / Update Phone Modal */}
      <AnimatePresence>
        {isPhoneModalOpen && phoneEditStudent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-900">
                  <Phone className="w-4 h-4 text-[#A91F35]" />
                  <h3 className="font-bold text-sm">Add / Update Phone</h3>
                </div>
                <button
                  onClick={() => setIsPhoneModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 font-medium">
                Candidate: <span className="font-bold text-stone-900">{phoneEditStudent.name}</span> ({phoneEditStudent.chestNo})
              </p>

              {phoneError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold">
                  {phoneError}
                </div>
              )}

              <form onSubmit={handleSavePhone} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phoneInputValue}
                    onChange={(e) => setPhoneInputValue(e.target.value)}
                    placeholder="+91 98471 XXXXX"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    autoFocus
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Leave empty to clear or enter a contact number.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPhoneModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all"
                  >
                    Save Phone
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-sm w-full border border-stone-200 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-base text-stone-900">Confirm Candidate Removal</h3>
                <p className="text-xs text-stone-500">
                  Are you sure you want to remove <strong>{deleteConfirmation.name}</strong> ({deleteConfirmation.chestNo}) from the festival registry?
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
