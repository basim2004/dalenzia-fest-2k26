import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Eye,
  X,
  Sparkles,
  Users,
  Shield,
  Printer,
  ChevronRight,
  Phone,
  Crown
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import TeamCharterPdfModal from '../../components/TeamCharterPdfModal';

export default function TeamLeaderStudents({ teamId }) {
  const [team, setTeam] = useState(() => festivalStore.getTeamById(teamId));
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());

  // Search & Filter within team
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [addCategoryFilter, setAddCategoryFilter] = useState('all');
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState(null);

  // Remove confirmation modal
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [removeReason, setRemoveReason] = useState('');

  // Student Profile Detail Modal
  const [inspectStudent, setInspectStudent] = useState(null);

  // PDF Charter Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setStoreData({ ...festivalStore.data });
      setTeam(festivalStore.getTeamById(teamId));
    });
    return () => unsub();
  }, [teamId]);

  // Current squad students
  const squadStudents = useMemo(() => {
    return team?.students || [];
  }, [team]);

  // View SubTab: 'directory' | 'allocation'
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [sortBy, setSortBy] = useState('chestNo'); // 'chestNo' | 'name' | 'category' | 'id'

  // Central Registry All Students
  const allRegistryStudents = useMemo(() => {
    return festivalStore.getRegisteredStudents() || [];
  }, [storeData]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      Senior: squadStudents.filter(s => (s.classCategory || s.category) === 'Senior').length,
      Junior: squadStudents.filter(s => (s.classCategory || s.category) === 'Junior').length,
      'Sub Junior': squadStudents.filter(s => (s.classCategory || s.category) === 'Sub Junior').length
    };
  }, [squadStudents]);

  // Filtered squad students with sorting
  const filteredSquadStudents = useMemo(() => {
    let list = squadStudents.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.chestNo || '').toLowerCase().includes(q) ||
        (s.id || '').toLowerCase().includes(q);

      const sCat = (s.classCategory || s.category || '').toLowerCase();
      const matchCategory =
        categoryFilter === 'all' ||
        sCat === categoryFilter.toLowerCase();

      return matchSearch && matchCategory;
    });

    return list.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'category') return (a.classCategory || a.category || '').localeCompare(b.classCategory || b.category || '');
      if (sortBy === 'id') return (a.id || '').localeCompare(b.id || '');
      // default chestNo
      return (a.chestNo || '').localeCompare(b.chestNo || '', undefined, { numeric: true });
    });
  }, [squadStudents, searchQuery, categoryFilter, sortBy]);

  // Central registry allocation view list
  const filteredCentralStudents = useMemo(() => {
    return allRegistryStudents.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.chestNo || '').toLowerCase().includes(q) ||
        (s.id || '').toLowerCase().includes(q);

      const sCat = (s.classCategory || s.category || '').toLowerCase();
      const matchCategory =
        categoryFilter === 'all' ||
        sCat === categoryFilter.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [allRegistryStudents, searchQuery, categoryFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Sl No', 'Student ID', 'Chest No', 'Name', 'Official Category', 'Role', 'Team', 'Allocation Status'];
    const rows = squadStudents.map((s, idx) => [
      idx + 1,
      s.id,
      s.chestNo || 'N/A',
      `"${s.name}"`,
      s.classCategory || s.category || 'N/A',
      s.role || (s.isLeader ? 'Leader' : s.isAsstLeader ? 'Asst Leader' : 'Member'),
      team?.name || 'N/A',
      'Allocated'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(team?.name || 'team').replace(/\s+/g, '_')}_roster_dalenzia_2k26.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${team?.name} official roster (CSV)`);
  };

  // Direct Print
  const handlePrintRoster = () => {
    window.print();
  };

  // Available students in registry for adding
  const availableStudents = useMemo(() => {
    const unassigned = festivalStore.getUnassignedStudents(
      addCategoryFilter === 'all' ? null : addCategoryFilter,
      addSearchQuery
    );
    return unassigned;
  }, [addCategoryFilter, addSearchQuery, storeData]);

  const handleAddStudentToSquad = (e) => {
    e.preventDefault();
    if (!selectedStudentToAdd) {
      showToast('Please select an eligible student from the list.', 'error');
      return;
    }

    try {
      festivalStore.allocateStudentToTeam(
        teamId,
        selectedStudentToAdd.id,
        team?.leader ? `Team Leader (${team.leader})` : 'Team Leader'
      );
      showToast(
        `Student ${selectedStudentToAdd.name} (${selectedStudentToAdd.chestNo}) enrolled into ${team?.name}!`
      );
      setShowAddModal(false);
      setSelectedStudentToAdd(null);
      setAddSearchQuery('');
      setAddCategoryFilter('all');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const confirmRemoveStudent = () => {
    if (!studentToRemove) return;

    // Check if trying to remove leader or asst leader
    if (
      studentToRemove.id === team?.leaderStudentId ||
      studentToRemove.id === team?.asstLeaderStudentId
    ) {
      showToast('Team Leader and Assistant Leader cannot be removed from squad.', 'error');
      setStudentToRemove(null);
      return;
    }

    try {
      festivalStore.removeStudentFromTeam(
        teamId,
        studentToRemove.id,
        team?.leader ? `Team Leader (${team.leader})` : 'Team Leader',
        removeReason || 'Squad reorganization'
      );
      showToast(`Student ${studentToRemove.name} removed from squad.`);
      setStudentToRemove(null);
      setRemoveReason('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Senior':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Junior':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sub Junior':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  if (!team) {
    return (
      <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
        Team record not found or unauthorized team scope.
      </div>
    );
  }

  const isTeam1 = teamId === 'team-1';
  const themeBg = isTeam1 ? 'bg-[#A91F35]' : 'bg-[#E6A916]';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-white ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase text-white px-2.5 py-0.5 rounded-full ${themeBg}`}
            >
              {team.name}
            </span>
            <span className="text-xs font-bold text-stone-500 font-mono">
              Squad ID: {team.id} ({team.code})
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {squadStudents.length} Students Allocated
            </span>
          </div>

          <h1 className="text-2xl font-serif font-black text-stone-900">
            {team.name} • Team Allocation & Squad Management
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Crown className="w-3.5 h-3.5 text-[#A91F35]" />
              <span>Leader: <strong>(L) {team.leader}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <Shield className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Asst Leader: <strong>(AL) {team.asstLeader}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#A91F35]" />
            <span>Export Charter PDF</span>
          </button>

          <button
            onClick={() => {
              setAddSearchQuery('');
              setAddCategoryFilter('all');
              setSelectedStudentToAdd(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E6A916]" />
            <span>Add Student to Squad</span>
          </button>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-2xs">
          <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Senior</div>
          <div className="text-2xl font-serif font-black text-stone-900 mt-1">{categoryCounts.Senior}</div>
          <div className="text-[10px] text-stone-500 font-medium">Class Category</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs">
          <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Junior</div>
          <div className="text-2xl font-serif font-black text-stone-900 mt-1">{categoryCounts.Junior}</div>
          <div className="text-[10px] text-stone-500 font-medium">Class Category</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Sub Junior</div>
          <div className="text-2xl font-serif font-black text-stone-900 mt-1">{categoryCounts['Sub Junior']}</div>
          <div className="text-[10px] text-stone-500 font-medium">Class 5 to 9</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'directory'
                ? 'bg-[#A91F35] text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Team Member Directory ({squadStudents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('allocation')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'allocation'
                ? 'bg-[#A91F35] text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Central Student Allocation Pool ({allRegistryStudents.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintRoster}
            className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#A91F35]" />
            <span>Print Roster</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeSubTab === 'directory' ? "Search squad members by name, chest number or ID..." : "Search registry students by name, chest or ID..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
            >
              <option value="all">All Categories</option>
              <option value="senior">Senior</option>
              <option value="junior">Junior</option>
              <option value="sub junior">Sub Junior</option>
            </select>
          </div>

          {activeSubTab === 'directory' && (
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <span>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="chestNo">Chest Number</option>
                <option value="name">Candidate Name</option>
                <option value="category">Category</option>
                <option value="id">Student ID</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: SQUAD DIRECTORY TABLE */}
      {activeSubTab === 'directory' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
          {/* Printable Header - hidden on screen, visible on print */}
          <div className="hidden print:block p-6 text-center border-b border-stone-300">
            <h1 className="text-xl font-bold font-serif">DALENZIA FEST 2K26 – OFFICIAL SQUAD ROSTER</h1>
            <h2 className="text-sm font-bold text-stone-800 mt-1">{team.name} • 22 Official Members</h2>
            <p className="text-xs text-stone-500">Leader: {team.leader} | Asst Leader: {team.asstLeader}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Chest No</th>
                  <th className="py-3 px-4">Student Candidate</th>
                  <th className="py-3 px-4">Official Category</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSquadStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-stone-500">
                      No candidates found in team squad matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredSquadStudents.map((student, idx) => {
                    const isLeader = student.id === team.leaderStudentId || student.name === team.leader;
                    const isAsstLeader = student.id === team.asstLeaderStudentId || student.name === team.asstLeader;
                    const cat = student.classCategory || student.category || 'Sub Junior';

                    return (
                      <tr key={student.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4 text-center font-mono font-bold text-stone-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-600">
                          {student.id}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#A91F35] text-sm">
                          {student.chestNo}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{student.name}</div>
                          <div className="text-[10px] text-stone-400">Dalailussunna Dars, Ayiroor</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getCategoryBadgeClass(cat)}`}
                          >
                            {cat}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isLeader ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#A91F35] text-white font-bold text-[10px]">
                              <Crown className="w-3 h-3 text-[#E6A916]" />
                              <span>Team Leader</span>
                            </span>
                          ) : isAsstLeader ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6A916] text-stone-900 font-bold text-[10px]">
                              <Shield className="w-3 h-3 text-[#A91F35]" />
                              <span>Asst Leader</span>
                            </span>
                          ) : (
                            <span className="text-stone-500 font-medium text-[11px]">Member</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Allocated
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right print:hidden">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectStudent(student)}
                              className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              title="View student profile"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Profile</span>
                            </button>

                            {!isLeader && !isAsstLeader && (
                              <button
                                onClick={() => {
                                  setStudentToRemove(student);
                                  setRemoveReason('');
                                }}
                                className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Remove student from squad"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: CENTRAL STUDENT ALLOCATION & REGISTRY POOL */}
      {activeSubTab === 'allocation' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm font-serif">Central Student Registry Allocation Status</h3>
              <p className="text-[11px] text-stone-500">Every student must belong to exactly one official squad. Inter-team transfers require Convener authorization.</p>
            </div>
            <span className="text-xs font-mono font-bold text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
              {filteredCentralStudents.length} Students Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Chest No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Official Category</th>
                  <th className="py-3 px-4">Team Assignment</th>
                  <th className="py-3 px-4 text-right">Allocation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCentralStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-stone-500">
                      No central registry students matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCentralStudents.map((student, idx) => {
                    const isInMyTeam = student.teamId === team.id;
                    const isOtherTeam = Boolean(student.teamId && student.teamId !== team.id && student.teamId !== 'Unassigned');
                    const isUnassigned = !student.teamId || student.teamId === 'Unassigned';
                    const cat = student.classCategory || student.category || 'Sub Junior';

                    return (
                      <tr key={student.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4 text-center font-mono font-bold text-stone-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-600">
                          {student.id}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#A91F35] text-sm">
                          {student.chestNo}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{student.name}</div>
                          {student.auditNote && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold" title={student.auditNote}>
                              Audit Flagged
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getCategoryBadgeClass(cat)}`}
                          >
                            {cat}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isInMyTeam ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> {team.name}
                            </span>
                          ) : isOtherTeam ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200" title="Inter-team reassignment requires Convener authorization">
                              <Shield className="w-3 h-3 text-amber-700" /> {student.teamName || student.teamId}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                              Unallocated
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isInMyTeam ? (
                            <span className="text-[10px] text-stone-400 italic">Member of Your Squad</span>
                          ) : isOtherTeam ? (
                            <span className="text-[10px] text-stone-400 italic">Protected (Other Squad)</span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedStudentToAdd(student);
                                setShowAddModal(true);
                              }}
                              className="px-3 py-1 rounded-xl bg-[#A91F35] hover:bg-[#851627] text-white font-bold text-[11px] transition-all flex items-center gap-1 ml-auto shadow-2xs"
                            >
                              <Plus className="w-3 h-3 text-[#E6A916]" />
                              <span>Allocate to {team.name}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: ADD EXISTING STUDENT TO TEAM                                 */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-gradient-to-r from-[#A91F35] to-[#7f1525] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">Enroll Student to {team?.name}</h3>
                  <p className="text-[11px] text-white/80">
                    Select existing student from central registry (Zero Duplicates)
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudentToSquad} className="p-6 space-y-4 text-xs">
                {/* Search & Category Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Search Student</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Name, chest, ID..."
                        value={addSearchQuery}
                        onChange={(e) => setAddSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-none focus:border-[#A91F35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Filter Category</label>
                    <select
                      value={addCategoryFilter}
                      onChange={(e) => setAddCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="all">All Categories</option>
                      <option value="Senior">Senior</option>
                      <option value="Junior">Junior</option>
                      <option value="Sub Junior">Sub Junior</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Selection List */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">Available Unassigned Candidates</label>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {availableStudents.length} available
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-stone-200 rounded-2xl p-1.5 space-y-1">
                    {availableStudents.length === 0 ? (
                      <div className="p-6 text-center text-stone-500 text-xs">
                        No unassigned candidates found matching criteria.
                      </div>
                    ) : (
                      availableStudents.map(student => {
                        const isSelected = selectedStudentToAdd?.id === student.id;
                        return (
                          <div
                            key={student.id}
                            onClick={() => setSelectedStudentToAdd(student)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#A91F35]/10 border-[#A91F35] shadow-xs'
                                : 'hover:bg-[#F7F3E9] border-stone-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[#A91F35] text-white flex items-center justify-center font-bold text-xs">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
                                  <span>{student.name}</span>
                                  {student.auditNote && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-semibold" title={student.auditNote}>
                                      Typo Duplicate (Dalenzia_Teams.pdf)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-stone-500 font-mono">
                                  Chest: {student.chestNo} • ID: {student.id}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                                  student.classCategory
                                )}`}
                              >
                                {student.classCategory}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-white bg-[#A91F35] px-2 py-0.5 rounded-md">
                                  Selected ✓
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {selectedStudentToAdd && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                    Ready to allocate <strong>{selectedStudentToAdd.name}</strong> ({selectedStudentToAdd.chestNo}) into{' '}
                    <strong>{team?.name}</strong>. Their category <strong>{selectedStudentToAdd.classCategory}</strong>{' '}
                    will remain strictly unchanged.
                  </div>
                )}

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedStudentToAdd}
                    className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] disabled:opacity-50 text-white font-bold shadow-md transition-colors cursor-pointer"
                  >
                    Confirm & Enroll Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 2: CONFIRM REMOVAL FROM SQUAD                                   */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {studentToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-red-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-serif font-black text-base">Remove Student from Squad</h3>
                </div>
                <button
                  onClick={() => setStudentToRemove(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <p className="text-stone-700 leading-relaxed">
                  Are you sure you want to remove <strong>{studentToRemove.name}</strong> ({studentToRemove.chestNo})
                  from <strong>{team?.name}</strong>?
                </p>
                <p className="text-stone-500 text-[11px]">
                  The student will become unassigned and available for reassignment by Convener or Team Leaders.
                </p>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Reason for Removal (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Squad restructuring, mutual exchange..."
                    value={removeReason}
                    onChange={(e) => setRemoveReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentToRemove(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmRemoveStudent}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition-colors cursor-pointer"
                  >
                    Confirm Removal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MODAL 3: VIEW STUDENT PROFILE DETAILS                                 */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {inspectStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">{inspectStudent.name}</h3>
                  <p className="text-[11px] text-white/80">
                    Chest No: {inspectStudent.chestNo} • Squad: {team?.name}
                  </p>
                </div>
                <button
                  onClick={() => setInspectStudent(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Student ID:</span>
                    <span className="font-mono font-bold text-stone-900">{inspectStudent.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Class Category:</span>
                    <span className="font-bold text-[#A91F35]">{inspectStudent.classCategory || 'Sub Junior'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Assigned Team:</span>
                    <span className="font-bold text-stone-800">{team?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-semibold">Institution:</span>
                    <span className="font-semibold text-stone-800">Dalailussunna Dars, Ayiroor</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F7F3E9] text-[11px] text-stone-600">
                  Student is verified and allocated to <strong>{team?.name}</strong> for official events in DALENZIA FEST 2K26.
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectStudent(null)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Team Charter PDF Modal */}
      <TeamCharterPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        highlightTeamId={teamId}
      />
    </div>
  );
}
