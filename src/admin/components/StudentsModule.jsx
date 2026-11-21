import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  BookOpen,
  Star, UserPlus, UserCheck, Search, Filter, Plus, Edit2, Trash2, Eye,
  Download, Printer, CheckCircle, AlertTriangle, X, Shield, ArrowUpDown,
  ChevronLeft, ChevronRight, QrCode, Phone, Mail, Building, Calendar,
  Award, Trophy, Sparkles, RefreshCw, FileText, Check, Copy, UserX
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function StudentsModule({ activeSection }) {
  // Navigation tabs: 'overview' | 'directory' | 'idcards' | 'reports'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('directory') || hash.includes('list')) return 'directory';
      if (hash.includes('idcards') || hash.includes('pass') || hash.includes('cards')) return 'idcards';
      if (hash.includes('reports') || hash.includes('roster')) return 'reports';
    }
    return 'overview';
  });

  // Core Data State from festivalStore
  const [stats, setStats] = useState(() => festivalStore.getStudentStats());
  const [teams, setTeams] = useState(() => festivalStore.getTeams());
  const [students, setStudents] = useState(() => festivalStore.getStudents());
  const [auditLogs, setAuditLogs] = useState(() => festivalStore.getAuditLogs());

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Multi-select state for bulk actions
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneEditStudent, setPhoneEditStudent] = useState(null);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Active student for modals
  const [activeStudent, setActiveStudent] = useState(null);
  const [activeStudentProfile, setActiveStudentProfile] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    chestNo: '',
    classCategory: 'Senior',
    teamId: '',
    dob: '2008-05-15',
    institution: 'Dalailussunna Dars, Ayiroor',
    phone: '',
    email: '',
    gender: 'Male',
    status: 'Active'
  });

  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  const [bulkTargetTeamId, setBulkTargetTeamId] = useState('');

  // Refresh data from festivalStore
  const refreshData = () => {
    setStats(festivalStore.getStudentStats());
    setTeams(festivalStore.getTeams());
    setStudents(festivalStore.getStudents({
      query: searchQuery,
      team: selectedTeamFilter,
      category: selectedCategoryFilter,
      status: selectedStatusFilter,
      sortBy,
      sortOrder
    }));
    setAuditLogs(festivalStore.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
  }, [searchQuery, selectedTeamFilter, selectedCategoryFilter, selectedStatusFilter, sortBy, sortOrder]);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Pagination calculations
  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return students.slice(start, start + itemsPerPage);
  }, [students, currentPage]);

  // Bulk selection toggles
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(paginatedStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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
      showToast(`Phone number updated for ${phoneEditStudent.name}`);
      setIsPhoneModalOpen(false);
      refreshData();
      if (activeStudentProfile && (activeStudentProfile.id === phoneEditStudent.id || activeStudentProfile.chestNo === phoneEditStudent.chestNo)) {
        setActiveStudentProfile(festivalStore.getStudentById(phoneEditStudent.id));
      }
    } catch (err) {
      setPhoneError(err.message || 'Failed to update phone number.');
    }
  };

  const handleNameChange = (val) => {
    const autoEmail = festivalStore.generateStudentEmail(val);
    setFormData(prev => ({
      ...prev,
      name: val,
      email: (!prev.email || prev.email.endsWith('@dalanzia.org')) ? autoEmail : prev.email
    }));
  };

  // Open Add Student Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      chestNo: '',
      classCategory: 'Junior',
      teamId: '',
      dob: '2008-05-15',
      institution: 'Dalailussunna Dars, Ayiroor',
      phone: '',
      email: '',
      gender: 'Male',
      status: 'Active'
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Submit Add Student
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = festivalStore.addStudent(formData);
      if (res.success) {
        showToast(`Student ${res.student.name} (${res.student.chestNo}) enrolled successfully!`);
        setIsAddModalOpen(false);
        refreshData();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to enroll student.');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (student) => {
    setActiveStudent(student);
    setFormData({
      name: student.name,
      chestNo: student.chestNo,
      classCategory: student.classCategory,
      teamId: student.teamId || '',
      dob: student.dob || '2008-05-15',
      institution: student.institution || 'Dalailussunna Dars, Ayiroor',
      phone: student.phone || '',
      email: student.email || '',
      gender: student.gender || 'Male',
      status: student.status || 'Active'
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Submit Edit Student
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = festivalStore.updateStudent(activeStudent.id, formData);
      if (res.success) {
        showToast(`Student record for ${res.student.name} updated successfully!`);
        setIsEditModalOpen(false);
        refreshData();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to update student.');
    }
  };

  // Open Profile Modal
  const handleOpenProfileModal = (student) => {
    const fullProfile = festivalStore.getStudentById(student.id);
    setActiveStudentProfile(fullProfile);
    setIsProfileModalOpen(true);
  };

  // Open ID Card Modal
  const handleOpenIdCardModal = (student) => {
    const fullProfile = festivalStore.getStudentById(student.id);
    setActiveStudentProfile(fullProfile);
    setIsIdCardModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (student) => {
    setActiveStudent(student);
    setForceDelete(false);
    setFormError('');
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    setFormError('');
    try {
      const res = festivalStore.deleteStudent(activeStudent.id, forceDelete);
      if (res.success) {
        showToast(`Student record ${activeStudent.name} removed successfully.`);
        setIsDeleteModalOpen(false);
        setSelectedStudentIds(prev => prev.filter(id => id !== activeStudent.id));
        refreshData();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to remove student record.');
    }
  };

  // Submit Bulk Assignment
  const handleBulkAssignSubmit = (e) => {
    e.preventDefault();
    if (!bulkTargetTeamId) return;
    try {
      const res = festivalStore.bulkAssignStudents(selectedStudentIds, bulkTargetTeamId);
      if (res.success) {
        showToast(`Successfully assigned ${res.count} students!`);
        setIsBulkModalOpen(false);
        setSelectedStudentIds([]);
        refreshData();
      }
    } catch (err) {
      alert(err.message || 'Bulk assignment failed.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Chest No', 'Full Name', 'Category', 'Team', 'DOB', 'Institution', 'Phone', 'Email', 'Events Count', 'Points', 'Status'];
    const rows = students.map(s => [
      `"${s.id}"`,
      `"${s.chestNo}"`,
      `"${s.name}"`,
      `"${s.classCategory}"`,
      `"${s.teamName}"`,
      `"${s.dob}"`,
      `"${s.institution}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      s.registeredEventsCount,
      s.totalPoints,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_students_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported complete student roster as CSV file.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#A91F35] via-[#851627] to-[#5C0F1C] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold tracking-wider uppercase mb-3 text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              Official Student Registry & Enrolment
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Student Management Control
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl font-sans">
              Centralized register of 1,250 student candidates, automated chest number issuance, squad assignments, ID card generation, and live festival participation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <UserPlus className="w-4 h-4 text-stone-900" />
              Enroll New Student
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition-all"
            >
              <Download className="w-4 h-4" />
              Export Roster (CSV)
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard & Metrics', icon: Users },
            { id: 'directory', label: `Student Registry (${stats.totalStudents})`, icon: UserCheck },
            { id: 'idcards', label: 'ID Card Studio', icon: QrCode },
            { id: 'reports', label: 'Rosters & Reports', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#A91F35] shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#A91F35]' : 'text-stone-300'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & REGISTRATION METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 8 Core KPI Cards (Official Live Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {[
              { label: 'Total Students', value: stats.totalStudents, sub: 'Enrolled in Portal', icon: Users, color: '#A91F35', bg: 'bg-red-50 text-red-700' },
              { label: 'Senior Count', value: stats.categoryBreakdown?.Senior || 0, sub: 'Senior Division', icon: Award, color: '#D97706', bg: 'bg-amber-50 text-amber-700' },
              { label: 'Junior Count', value: stats.categoryBreakdown?.Junior || 0, sub: 'Junior Division', icon: Sparkles, color: '#A91F35', bg: 'bg-rose-50 text-rose-700' },
              { label: 'Sub Junior Count', value: stats.categoryBreakdown?.SubJunior || 0, sub: 'Sub-Junior Division', icon: BookOpen, color: '#047857', bg: 'bg-emerald-50 text-emerald-700' },
              { label: 'Minor Count', value: stats.categoryBreakdown?.Minor || 0, sub: 'Minor Division', icon: Star, color: '#7C3AED', bg: 'bg-purple-50 text-purple-700' },
              { label: 'Assigned Students', value: stats.assignedStudents, sub: 'In Active Squads', icon: Trophy, color: '#2563EB', bg: 'bg-blue-50 text-blue-700' },
              { label: 'Unassigned Students', value: stats.unassignedStudents, sub: 'Unassigned Pool', icon: UserX, color: '#F59E0B', bg: 'bg-yellow-50 text-yellow-800' },
              { label: 'Active Candidates', value: stats.activeStudents, sub: 'Eligible for Stage', icon: UserCheck, color: '#10B981', bg: 'bg-teal-50 text-teal-700' }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 truncate" title={card.label}>{card.label}</span>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${card.bg}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-stone-900">{card.value}</div>
                  <div className="text-[9px] text-stone-600 mt-0.5 truncate">{card.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Visual Breakdowns: Category Distribution & Team Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Category Distribution</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Four official academic divisions across registered cohort</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                  4 Official Categories
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Senior Division', count: stats.categoryBreakdown?.Senior || 0, color: '#D97706', bg: 'bg-amber-600', sub: 'Degree Scholars' },
                  { name: 'Junior Division', count: stats.categoryBreakdown?.Junior || 0, color: '#A91F35', bg: 'bg-[#A91F35]', sub: '+1 & +2 Scholars' },
                  { name: 'Sub Junior Division', count: stats.categoryBreakdown?.SubJunior || 0, color: '#047857', bg: 'bg-emerald-600', sub: 'Class 10 Scholars' },
                  { name: 'Minor Division', count: stats.categoryBreakdown?.Minor || 0, color: '#7C3AED', bg: 'bg-purple-600', sub: 'Class 5 to 9 Scholars' }
                ].map((cat, idx) => {
                  const pct = stats.totalStudents > 0 ? Math.round((cat.count / stats.totalStudents) * 100) : 0;
                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-stone-800">{cat.name}</span>
                        <span className="text-stone-900">{cat.count} Students ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div className={`h-full rounded-full ${cat.bg}`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-stone-600">{cat.sub}</p>
                    </div>
                  );
                })}</div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Standard verification requires every student to hold an official Chest Number before entering arenas.</span>
              </div>
            </div>

            {/* Team Distribution Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Team Squad Strength & Distribution</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Real-time student count enrolled in each competing team</p>
                </div>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="text-xs font-bold text-[#A91F35] hover:underline"
                >
                  Manage Squads &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.teamDistribution.map((t) => (
                  <div
                    key={t.teamId}
                    className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#A91F35]/30 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase text-white shadow-sm"
                          style={{ backgroundColor: t.color || '#A91F35' }}
                        >
                          {t.code}
                        </span>
                        <span className="text-xs font-bold text-stone-900">{t.count} Members</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900">{t.teamName}</h4>
                      <p className="text-[11px] text-stone-600 mt-0.5">Leader: {t.leader || 'Not Assigned'}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[10px]">
                      <span className="text-stone-600">Squad Active</span>
                      <button
                        onClick={() => {
                          setSelectedTeamFilter(t.teamId);
                          setActiveTab('directory');
                        }}
                        className="font-bold text-[#A91F35] hover:underline"
                      >
                        View Roster
                      </button>
                    </div>
                  </div>
                ))}

                {/* Unassigned Pool Card */}
                <div className="p-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-200 text-amber-900">
                        WAITING
                      </span>
                      <span className="text-xs font-bold text-amber-900">{stats.unassignedStudents} Students</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900">Unassigned Pool</h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">Registered but not yet drafted into teams</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-amber-800 font-medium">Pending draft</span>
                    <button
                      onClick={() => {
                        setSelectedTeamFilter('unassigned');
                        setActiveTab('directory');
                      }}
                      className="font-bold text-amber-900 hover:underline"
                    >
                      Assign Now &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions Strip */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Fast Enrolment & ID Card Generation</div>
                    <div className="text-[11px] text-stone-600">Auto-assign chest numbers & print official QR badges</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all"
                  >
                    + Enroll Student
                  </button>
                  <button
                    onClick={() => setActiveTab('idcards')}
                    className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-100 transition-all"
                  >
                    ID Card Studio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDENT DIRECTORY & REGISTRY */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          {/* Filter, Search & Action Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by student name, chest number (C-101), student ID (STU-1001), phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Team Filter */}
              <select
                value={selectedTeamFilter}
                onChange={(e) => setSelectedTeamFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Teams</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                ))}
                <option value="unassigned">Unassigned Only</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Categories</option>
                <option value="Senior">Senior</option>
                <option value="Junior">Junior</option>
                <option value="Sub Junior">Sub Junior</option>
                <option value="Minor">Minor</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="name">Sort by Name</option>
                <option value="chestNo">Sort by Chest No</option>
                <option value="id">Sort by ID</option>
                <option value="registeredAt">Sort by Date</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulk Action Bar (when rows are selected) */}
          {selectedStudentIds.length > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-700" />
                <span>{selectedStudentIds.length} candidate{selectedStudentIds.length > 1 ? 's' : ''} selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#A91F35] text-white hover:bg-[#851627] transition-all text-xs"
                >
                  Bulk Assign to Team
                </button>
                <button
                  onClick={() => setSelectedStudentIds([])}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Student Directory Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={paginatedStudents.length > 0 && paginatedStudents.every(s => selectedStudentIds.includes(s.id))}
                      onChange={handleSelectAll}
                      className="rounded border-stone-300 text-[#A91F35] focus:ring-[#A91F35]"
                    />
                  </th>
                  <th className="p-3.5">Chest No</th>
                  <th className="p-3.5">Candidate Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Assigned Squad</th>
                  <th className="p-3.5">Arena Events</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-stone-600">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UserX className="w-8 h-8 text-stone-300" />
                        <span className="text-sm font-semibold">No students match your active filters.</span>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedTeamFilter('all');
                            setSelectedCategoryFilter('all');
                            setSelectedStatusFilter('all');
                          }}
                          className="text-xs text-[#A91F35] font-bold underline mt-1"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => {
                    const isSelected = selectedStudentIds.includes(s.id);
                    const assignedTeamObj = teams.find(t => t.id === s.teamId);
                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-stone-50/70 transition-colors ${isSelected ? 'bg-amber-50/40' : ''}`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(s.id)}
                            className="rounded border-stone-300 text-[#A91F35] focus:ring-[#A91F35]"
                          />
                        </td>
                        <td className="p-3.5 font-mono font-bold">
                          <span className="px-2.5 py-1 rounded-lg bg-red-50 text-[#A91F35] border border-red-200/60 font-black">
                            {s.chestNo}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#A91F35] to-[#E6A916] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-2">
                                <span>{s.name}</span>
                                <span className="text-[10px] font-mono text-stone-600">({s.id})</span>
                              </div>
                              <div className="text-[10px] text-stone-600 flex items-center gap-3 mt-0.5">
                                <span>{s.institution}</span>
                                {s.phone && <span>• {s.phone}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.classCategory === 'Junior'
                              ? 'bg-rose-100 text-rose-800'
                              : s.classCategory === 'Senior'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {s.classCategory}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {assignedTeamObj ? (
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: assignedTeamObj.color || '#A91F35' }}
                              />
                              <span className="font-bold text-stone-800">{assignedTeamObj.name}</span>
                              <span className="text-[10px] font-bold text-stone-600">({assignedTeamObj.code})</span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">
                              {s.registeredEventsCount} Registered
                            </span>
                            {s.prizesCount > 0 && (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px] flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                {s.prizesCount} Wins
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-500'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenProfileModal(s)}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900"
                              title="View Candidate Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenIdCardModal(s)}
                              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700"
                              title="Print / View ID Card"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(s)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-700"
                              title="Edit Candidate"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(s)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-700"
                              title="Remove Candidate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-bold text-stone-600">
            <div>
              Showing {students.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, students.length)} of {students.length} candidates
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="px-3 py-1 rounded-xl bg-stone-100 text-stone-800">
                Page {currentPage} of {totalPages}
              </div>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ID CARD STUDIO */}
      {/* ========================================================================= */}
      {activeTab === 'idcards' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Official Candidate ID Card Studio</h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Generate high-resolution official badges with QR verification for arena entry and stage clearance.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Batch ID Cards
            </button>
          </div>

          {/* Quick Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.slice(0, 6).map((student) => {
              const assignedTeam = teams.find(t => t.id === student.teamId);
              return (
                <div
                  key={student.id}
                  className="p-5 rounded-3xl border-2 border-amber-500/20 bg-gradient-to-br from-stone-900 via-stone-900 to-black text-white relative shadow-xl overflow-hidden flex flex-col justify-between"
                  style={{ minHeight: '360px' }}
                >
                  {/* Decorative golden accent lines */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A91F35] via-[#E6A916] to-[#A91F35]" />
                  
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-black text-[10px]">
                          DF
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-amber-400">DALENZIA FEST 2K26</div>
                          <div className="text-[8px] tracking-widest text-stone-400 uppercase font-sans">NUEVA ERA • STAGE PASS</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase bg-white/10 text-stone-300 border border-white/15">
                        {student.classCategory}
                      </span>
                    </div>

                    {/* Photo + Details Center */}
                    <div className="mt-5 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#A91F35] to-[#E6A916] p-0.5 shadow-lg">
                        <div className="w-full h-full rounded-[14px] bg-stone-900 flex items-center justify-center text-xl font-black text-amber-300">
                          {student.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">CHEST NO</div>
                        <div className="text-2xl font-black font-mono tracking-tight text-white">{student.chestNo}</div>
                        <div className="text-xs font-bold text-stone-200 line-clamp-1">{student.name}</div>
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-[10px]">
                      <div className="flex justify-between text-stone-400">
                        <span>Candidate ID:</span>
                        <span className="font-mono text-stone-200">{student.id}</span>
                      </div>
                      <div className="flex justify-between text-stone-400">
                        <span>Squad:</span>
                        <span className="font-bold text-amber-300">{student.teamName}</span>
                      </div>
                      <div className="flex justify-between text-stone-400">
                        <span>Institution:</span>
                        <span className="text-stone-300 truncate max-w-[150px]">{student.institution}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with QR & Seal */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center">
                        <QrCode className="w-full h-full text-stone-900" />
                      </div>
                      <div className="text-[8px] text-stone-400 leading-tight">
                        <div>OFFICIAL VERIFIED</div>
                        <div className="text-amber-400 font-mono">SEC-ID: {student.id}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenIdCardModal(student)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-900 text-[10px] font-bold hover:bg-amber-300 transition-all"
                    >
                      Full Pass &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ROSTERS & REPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Student Reports & Export Centre</h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Official printed rosters, squad allocations, and participation sheets for festival committee records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Master Student Roster',
                desc: `Complete list of all ${stats.totalStudents} enrolled candidates with chest numbers, categories and contact information.`,
                action: handleExportCSV,
                btnLabel: 'Download Full CSV'
              },
              {
                title: 'Team-Wise Squad Lists',
                desc: 'Students grouped by assigned competing team with squad leader assignments and member counts.',
                action: () => {
                  setSelectedTeamFilter('team-01');
                  setActiveTab('directory');
                },
                btnLabel: 'View Squad Registry'
              },
              {
                title: 'Unassigned Candidates Pool',
                desc: `${stats.unassignedStudents} candidates awaiting team allocation for competitive stages.`,
                action: () => {
                  setSelectedTeamFilter('unassigned');
                  setActiveTab('directory');
                },
                btnLabel: 'View Unassigned Pool'
              }
            ].map((rep, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{rep.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{rep.desc}</p>
                </div>
                <button
                  onClick={rep.action}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white border border-stone-300 hover:border-[#A91F35] text-stone-800 hover:text-[#A91F35] font-bold text-xs transition-all shadow-sm"
                >
                  {rep.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW STUDENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Enroll New Student</h3>
                  <p className="text-xs text-stone-600">Register festival candidate with automatic chest & email identifier</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-6 space-y-4">
              {/* Field 1 & 2: Full Name & Chest Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmad Rayan"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Chest Number <span className="text-[10px] text-stone-500 font-normal">(Auto if blank)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank for auto-generation (e.g. C-147)"
                    value={formData.chestNo}
                    onChange={(e) => setFormData({ ...formData, chestNo: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Field 3 & 4: Class Category & Team Assignment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Class Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.classCategory}
                    onChange={(e) => setFormData({ ...formData, classCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50 text-stone-800"
                  >
                    <option value="Senior">Senior</option>
                    <option value="Junior">Junior</option>
                    <option value="Sub Junior">Sub Junior</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Team Assignment
                  </label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50 text-stone-800"
                  >
                    <option value="">Unassigned (Pool)</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 5 & 6: Candidate Status & Institution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Candidate Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50 text-stone-800"
                  >
                    <option value="Active">Active (Eligible)</option>
                    <option value="Inactive">Inactive (On-Hold)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Institution / Campus</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Field 7 & 8: Phone Number (Optional) & Email Address (Auto-generated) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number <span className="text-[10px] text-stone-500 font-normal">(Optional - can be added later)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Leave blank or enter phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address <span className="text-[10px] text-stone-500 font-normal">(Auto-generated ID)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="auto-generated@dalanzia.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Generated identifier for system records & credentials.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-md active:scale-95"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STUDENT */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Edit Student Record</h3>
                  <p className="text-xs text-stone-600">Update profile, team squad & eligibility details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Chest Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.chestNo}
                    onChange={(e) => setFormData({ ...formData, chestNo: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.classCategory}
                    onChange={(e) => setFormData({ ...formData, classCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Team Squad</label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  >
                    <option value="">Unassigned Pool</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CANDIDATE PROFILE MODAL */}
      {/* ========================================================================= */}
      {isProfileModalOpen && activeStudentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A91F35] to-[#E6A916] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  {activeStudentProfile.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-stone-900">{activeStudentProfile.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-[#A91F35]">
                      {activeStudentProfile.chestNo}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 font-mono">
                    ID: {activeStudentProfile.id} • {activeStudentProfile.classCategory} Division
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-600 uppercase">Assigned Team</span>
                <div className="text-sm font-bold text-stone-900 mt-1 flex items-center gap-1.5">
                  {activeStudentProfile.team ? (
                    <>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: activeStudentProfile.team.color || '#A91F35' }}
                      />
                      <span>{activeStudentProfile.team.name}</span>
                    </>
                  ) : (
                    <span className="text-amber-700">Unassigned</span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-600 uppercase">Registered Events</span>
                <div className="text-sm font-bold text-purple-700 mt-1">
                  {activeStudentProfile.competitions?.length || 0} Competitions
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] font-bold text-stone-600 uppercase">Festival Laurels</span>
                <div className="text-sm font-bold text-amber-700 mt-1 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{activeStudentProfile.results?.length || 0} Prizes ({activeStudentProfile.totalPointsWon} Pts)</span>
                </div>
              </div>
            </div>

            {/* Profile Contact Grid */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-600 font-medium">Institution / Campus:</span>
                <span className="font-bold text-stone-900">{activeStudentProfile.institution}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-200/60">
                <span className="text-stone-600 font-medium">Phone Contact:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{activeStudentProfile.phone || 'Not Provided'}</span>
                  <button
                    onClick={() => handleOpenPhoneModal(activeStudentProfile)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#A91F35]/10 text-[#A91F35] hover:bg-[#A91F35] hover:text-white transition-colors"
                  >
                    {activeStudentProfile.phone ? 'UPDATE PHONE' : 'ADD PHONE NUMBER'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-600 font-medium">Email:</span>
                <span className="font-bold text-stone-900">{activeStudentProfile.email || 'Not Provided'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-600 font-medium">Registration Date:</span>
                <span className="font-bold text-stone-900">{activeStudentProfile.registeredAt}</span>
              </div>
            </div>

            {/* Registered Competitions Table */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-2">
                Registered Programme Participations ({activeStudentProfile.competitions?.length || 0})
              </h4>
              {activeStudentProfile.competitions?.length === 0 ? (
                <div className="p-4 rounded-2xl bg-stone-50 text-center text-xs text-stone-600">
                  Candidate is not yet enrolled in any competition events.
                </div>
              ) : (
                <div className="rounded-2xl border border-stone-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Event Code</th>
                        <th className="p-3">Programme Title</th>
                        <th className="p-3">Schedule</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {activeStudentProfile.competitions.map((c, i) => (
                        <tr key={i} className="hover:bg-stone-50">
                          <td className="p-3 font-mono font-bold text-[#A91F35]">{c.competitionCode}</td>
                          <td className="p-3 font-semibold text-stone-900">{c.competitionTitle}</td>
                          <td className="p-3 text-stone-600">{c.date} • {c.time}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Laurels & Honours Won */}
            {activeStudentProfile.results?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-2">
                  Official Honours & Prizes Won
                </h4>
                <div className="space-y-2">
                  {activeStudentProfile.results.map((r, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-amber-700" />
                        <div>
                          <div className="font-bold text-stone-900">{r.competitionTitle}</div>
                          <div className="text-[10px] text-amber-800 font-semibold">{r.rank} • Score: {r.score}</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-900 font-black text-xs">
                        +{r.points} Pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-stone-100">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  handleOpenIdCardModal(activeStudentProfile);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200 text-xs font-bold flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                Generate ID Pass
              </button>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FULL ID CARD MODAL */}
      {/* ========================================================================= */}
      {isIdCardModalOpen && activeStudentProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Official Candidate Pass</h3>
              <button
                onClick={() => setIsIdCardModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official ID Pass Badge */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white relative shadow-2xl border-2 border-amber-500/30 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A91F35] via-[#E6A916] to-[#A91F35]" />
              
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-3 h-3" />
                  DALENZIA FEST 2K26 • NUEVA ERA
                </div>
                <h4 className="text-xs font-mono tracking-widest text-stone-400 uppercase">OFFICIAL STAGE ENTRY PASS</h4>
              </div>

              <div className="mt-5 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#A91F35] to-[#E6A916] p-1 shadow-xl">
                  <div className="w-full h-full rounded-[14px] bg-stone-900 flex items-center justify-center text-3xl font-black text-amber-300">
                    {activeStudentProfile.name.charAt(0)}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">CHEST NO</span>
                  <div className="text-3xl font-black font-mono tracking-tight text-white">{activeStudentProfile.chestNo}</div>
                  <div className="text-base font-bold text-stone-100 mt-1">{activeStudentProfile.name}</div>
                  <div className="text-[11px] font-medium text-stone-400">{activeStudentProfile.institution}</div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-stone-400 block">Category:</span>
                  <span className="font-bold text-amber-300">{activeStudentProfile.classCategory}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <span className="text-stone-400 block">Assigned Squad:</span>
                  <span className="font-bold text-stone-200">{activeStudentProfile.teamName}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-white p-1">
                    <QrCode className="w-full h-full text-stone-900" />
                  </div>
                  <div className="text-[8px] text-stone-400 text-left">
                    <div className="font-bold text-stone-200">VERIFIED PASS</div>
                    <div className="font-mono text-amber-400">ID: {activeStudentProfile.id}</div>
                    <div>21, 22, 23 DECEMBER 2026</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-stone-500 uppercase font-mono">Authorized Seal</div>
                  <div className="text-[9px] font-serif italic text-amber-200">Fest Controller</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Pass
              </button>
              <button
                onClick={() => {
                  showToast('Candidate ID pass downloaded.');
                  setIsIdCardModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && activeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Confirm Candidate Removal</h3>
                <p className="text-xs text-stone-600">This action modifies festival records and squad allocations</p>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-stone-900">{activeStudent.name}</span> (<span className="font-mono font-bold text-[#A91F35]">{activeStudent.chestNo}</span>) from the festival registry?
            </p>

            {formError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
                <label className="flex items-center gap-2 mt-2 pt-2 border-t border-red-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceDelete}
                    onChange={(e) => setForceDelete(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-[11px] font-bold text-red-800">Force deletion & unlink associated marks</span>
                </label>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: BULK ASSIGN TO TEAM */}
      {/* ========================================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Bulk Squad Assignment</h3>
                <p className="text-xs text-stone-600">Assign {selectedStudentIds.length} selected candidates</p>
              </div>
            </div>

            <form onSubmit={handleBulkAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Team Squad *</label>
                <select
                  required
                  value={bulkTargetTeamId}
                  onChange={(e) => setBulkTargetTeamId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                >
                  <option value="">Select Target Team</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                  ))}
                  <option value="Unassigned">Move to Unassigned Pool</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-md"
                >
                  Apply Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
