import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Trophy,
  Award,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Crown,
  BookOpen,
  Flame,
  Moon,
  Feather,
  Mic,
  Music,
  UserCheck,
  ShieldCheck,
  ExternalLink,
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  UserPlus,
  UserMinus,
  Check,
  AlertTriangle,
  Phone,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';
import TeamCharterPdfModal from '../../components/TeamCharterPdfModal';

export default function TeamManagementView({ activeSection = 'teams' }) {
  // Store data state
  const [storeData, setStoreData] = useState(() => festivalStore.loadData());
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'allocations' | 'list' | 'reports'
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Search, Filter & Sort states for Team List
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [sortBy, setSortBy] = useState('rank'); // 'rank' | 'points' | 'name' | 'members'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState(null);
  const [teamDetailsSubTab, setTeamDetailsSubTab] = useState('overview'); // 'overview' | 'students' | 'competitions' | 'results' | 'leader'
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isChangeLeaderModalOpen, setIsChangeLeaderModalOpen] = useState(false);
  const [deletingTeamConfirm, setDeletingTeamConfirm] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Form States
  const [newTeamForm, setNewTeamForm] = useState({
    name: '',
    code: '',
    subname: '',
    leader: '',
    leaderContact: '',
    badge: '⭐',
    status: 'Active'
  });

  const [enrollStudentForm, setEnrollStudentForm] = useState({
    studentId: '',
    compCategory: 'General'
  });

  const [leaderForm, setLeaderForm] = useState({
    leader: '',
    leaderContact: '',
    leaderStatus: 'Active'
  });

  // Reload helper
  const reloadState = () => {
    setStoreData({ ...festivalStore.loadData() });
  };

  const showToast = (msg) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Team Statistics (Section 2)
  const teamStats = useMemo(() => {
    return festivalStore.getTeamStats();
  }, [storeData]);

  const teams = useMemo(() => {
    return festivalStore.getTeams();
  }, [storeData]);

  // Available unassigned students from registry
  const unassignedStudents = useMemo(() => {
    return (storeData.registeredStudents || []).filter(s => !s.teamId);
  }, [storeData.registeredStudents]);

  // Filtered, Sorted and Paginated Teams (Section 4)
  const processedTeams = useMemo(() => {
    let list = [...teams];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        t => t.name.toLowerCase().includes(q) ||
             t.code.toLowerCase().includes(q) ||
             t.subname.toLowerCase().includes(q) ||
             (t.leader && t.leader.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      list = list.filter(t => t.status === statusFilter);
    }

    // Sort
    list.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'points') {
        valA = a.points || 0;
        valB = b.points || 0;
      } else if (sortBy === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortBy === 'members') {
        valA = a.members || (a.students ? a.students.length : 0);
        valB = b.members || (b.students ? b.students.length : 0);
      } else {
        // default rank
        valA = a.rank || 999;
        valB = b.rank || 999;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [teams, searchQuery, statusFilter, sortBy, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(processedTeams.length / itemsPerPage) || 1;
  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedTeams.slice(start, start + itemsPerPage);
  }, [processedTeams, currentPage]);

  // Synchronize selected team details when master data updates
  useEffect(() => {
    if (selectedTeamDetails) {
      const updated = festivalStore.getTeamById(selectedTeamDetails.id);
      if (updated) setSelectedTeamDetails({ ...updated });
    }
  }, [storeData]);

  // =========================================================================
  // CRUD HANDLERS (Section 3, 4, 5, 6)
  // =========================================================================

  // Handle Add Team
  const handleAddTeamSubmit = (e) => {
    e.preventDefault();
    if (!newTeamForm.name.trim()) {
      alert('Please enter a team name.');
      return;
    }

    try {
      const res = festivalStore.addTeam(newTeamForm);
      reloadState();
      setIsAddTeamModalOpen(false);
      setNewTeamForm({
        name: '',
        code: '',
        subname: '',
        leader: '',
        leaderContact: '',
        badge: '⭐',
        status: 'Active'
      });
      showToast(`Team "${res.team.name}" (${res.team.code}) created successfully!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Edit Team Submit
  const handleEditTeamSubmit = (e) => {
    e.preventDefault();
    try {
      const res = festivalStore.updateTeam(editingTeam.id, {
        name: editingTeam.name,
        code: editingTeam.code,
        subname: editingTeam.subname,
        leader: editingTeam.leader,
        leaderContact: editingTeam.leaderContact,
        badge: editingTeam.badge,
        status: editingTeam.status
      });
      reloadState();
      setEditingTeam(null);
      showToast(`Team "${res.team.name}" details updated successfully!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Delete Team
  const handleDeleteTeam = (team, force = false) => {
    try {
      festivalStore.deleteTeam(team.id, force);
      reloadState();
      setDeletingTeamConfirm(null);
      if (selectedTeamDetails && selectedTeamDetails.id === team.id) {
        setSelectedTeamDetails(null);
      }
      showToast(`Team "${team.name}" was successfully removed.`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Enroll Student to Team
  const handleEnrollStudentSubmit = (e) => {
    e.preventDefault();
    if (!enrollStudentForm.studentId) {
      alert('Please select a student from the registry.');
      return;
    }

    try {
      festivalStore.addStudentToTeam({
        teamId: selectedTeamDetails.id,
        studentId: enrollStudentForm.studentId,
        competitionCategory: enrollStudentForm.compCategory
      });
      reloadState();
      setIsAddStudentModalOpen(false);
      setEnrollStudentForm({ studentId: '', compCategory: 'Literary Arena' });
      showToast('Student successfully enrolled into team roster!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Remove Student from Team
  const handleRemoveStudent = (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove student "${studentName}" from ${selectedTeamDetails.name}?`)) {
      try {
        festivalStore.removeStudentFromTeam(selectedTeamDetails.id, studentId);
        reloadState();
        showToast(`Student ${studentName} removed from team.`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Handle Change Team Leader
  const handleChangeLeaderSubmit = (e) => {
    e.preventDefault();
    try {
      festivalStore.updateTeamLeader(selectedTeamDetails.id, leaderForm);
      reloadState();
      setIsChangeLeaderModalOpen(false);
      showToast(`Team Leader for ${selectedTeamDetails.name} updated!`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SUB-NAVIGATION                                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#E6A916]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#A91F35] text-white flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-[#E6A916]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#A91F35] font-serif tracking-tight">
                  Team Management Module
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E6A916]/20 text-[#A91F35] border border-[#E6A916]/40 uppercase tracking-wider">
                  Official Registry
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Central administration for all 12 festival houses, leader appointments, student allocations and points.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#E6A916]" />
              <span>Export Official Charter PDF</span>
            </button>
            <button
              onClick={() => {
                const nextNum = (teams.length + 1).toString().padStart(2, '0');
                setNewTeamForm({
                  name: '',
                  code: `TM0${nextNum}`,
                  subname: '',
                  leader: '',
                  leaderContact: '+91 ',
                  badge: '⭐',
                  status: 'Active'
                });
                setIsAddTeamModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#A91F35]" />
              <span>Add New Team</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 text-xs font-bold overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard & Metrics', count: teamStats.totalTeams, icon: TrendingUp },
            { id: 'allocations', label: 'Team Allocation & Audit Trail', icon: ArrowUpDown },
            { id: 'list', label: 'Teams Directory', count: teams.length, icon: Users },
            { id: 'reports', label: 'Team Reports & Analytics', icon: Printer }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#A91F35] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-[#F7F3E9] hover:text-[#A91F35]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6A916]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-[#E6A916] text-[#A91F35]' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#A91F35] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#E6A916]/40 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-[#E6A916] animate-spin" />
            <span>{toastNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. SUB-VIEW 1: TEAM MANAGEMENT DASHBOARD (Section 2)                      */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {[
              { label: 'Total Teams', value: teamStats.totalTeams, sub: 'Registered Houses', color: '#A91F35', icon: Users },
              { label: 'Active Teams', value: teamStats.activeTeams, sub: 'Competing', color: '#047857', icon: CheckCircle2 },
              { label: 'Inactive Teams', value: teamStats.inactiveTeams, sub: 'Standby / Suspended', color: '#64748b', icon: Clock },
              { label: 'Total Members', value: teamStats.totalMembers, sub: 'Allocated Roster', color: '#4338ca', icon: UserCheck },
              { label: 'Teams w/o Leader', value: teamStats.teamsWithoutLeaders, sub: 'Requires Attention', color: '#e11d48', icon: AlertCircle },
              { label: 'Overall Points', value: teamStats.totalPoints.toLocaleString(), sub: 'Aggregate Score', color: '#E6A916', icon: Trophy }
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">{kpi.label}</span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: kpi.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-stone-900 font-serif tracking-tight">{kpi.value}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{kpi.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Performance & Distribution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Team Rankings & Points Overview */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#A91F35] font-serif">Overall Team Championship Standings</h3>
                  <p className="text-xs text-stone-500">Real-time point accumulation verified from official results</p>
                </div>
                <button
                  onClick={() => setActiveTab('list')}
                  className="text-xs font-bold text-[#A91F35] hover:text-[#E6A916] flex items-center gap-1"
                >
                  <span>View All Teams</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {teams.slice(0, 6).map((team, idx) => {
                  const maxPts = teams[0]?.points || 3000;
                  const pct = Math.round((team.points / maxPts) * 100);
                  return (
                    <div
                      key={team.id}
                      className="p-3.5 rounded-2xl bg-[#F7F3E9]/50 border border-stone-200/80 flex items-center justify-between gap-3 hover:border-[#E6A916] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                            idx === 0
                              ? 'bg-[#E6A916] text-[#A91F35]'
                              : idx === 1
                              ? 'bg-stone-300 text-stone-800'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {team.rank}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-stone-900">{team.name}</span>
                            <span className="text-[10px] text-stone-500">({team.subname})</span>
                            <span>{team.badge}</span>
                          </div>
                          <div className="text-[10px] text-stone-500">
                            Leader: <strong>{team.leader}</strong> • {team.members} Members
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:block w-32">
                          <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className="h-full bg-[#A91F35] transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black font-serif text-[#A91F35]">{team.points} pts</div>
                          <div className="text-[10px] text-stone-400">Rank #{team.rank}</div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTeamDetails(team);
                            setTeamDetailsSubTab('overview');
                          }}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-white hover:text-[#A91F35]"
                          title="View Team Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Member Distribution & Quick Actions */}
            <div className="space-y-6">
              {/* Team-wise Student Count Breakdown */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
                <h3 className="text-base font-bold text-[#A91F35] font-serif border-b border-stone-100 pb-2.5">
                  Member Distribution Overview
                </h3>
                <div className="space-y-2.5">
                  {teams.slice(0, 5).map((team) => (
                    <div key={team.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-stone-700">
                        <span>{team.name} ({team.code})</span>
                        <span className="font-mono text-[#A91F35]">{team.members} members</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-[#E6A916] rounded-full"
                          style={{ width: `${Math.min(100, Math.round((team.members / 100) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-stone-500 bg-[#F7F3E9] p-3 rounded-xl border border-stone-200">
                  <div className="font-bold text-[#A91F35] mb-0.5">Roster Quota Health:</div>
                  <div>Average squad size: <strong>72 candidates per team</strong>. Registry verification at 100%.</div>
                </div>
              </div>

              {/* Recent Team Audit Activities */}
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-2">
                  Recent Team Activities
                </h3>
                <div className="space-y-2 text-xs">
                  {(storeData.auditLogs || [])
                    .filter(l => l.action.includes('TEAM') || l.action.includes('STUDENT'))
                    .slice(0, 4)
                    .map((log) => (
                      <div key={log.id} className="pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between text-[10px] text-stone-400 mb-0.5">
                          <span className="font-bold text-[#A91F35]">{log.action}</span>
                          <span>{log.timestamp ? log.timestamp.slice(-5) : 'Just now'}</span>
                        </div>
                        <div className="text-[11px] font-medium text-stone-700">{log.details}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-VIEW 2: TEAMS DIRECTORY & LIST (Section 4)                         */}
      {/* ========================================================================= */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-5">
          {/* Controls: Search, Filter, Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by team name, code, region or leader..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#A91F35] bg-[#F7F3E9]/40"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#F7F3E9] p-1 rounded-xl text-xs font-bold text-stone-600">
                {['All', 'Active', 'Inactive'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      statusFilter === st ? 'bg-[#A91F35] text-white shadow-xs' : 'hover:text-[#A91F35]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 border border-stone-200 rounded-xl px-2.5 py-1.5 bg-white text-xs text-stone-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-bold text-[10px] uppercase text-stone-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs font-bold text-stone-800"
                >
                  <option value="rank">Current Rank</option>
                  <option value="points">Total Points</option>
                  <option value="name">Team Name</option>
                  <option value="members">Members Count</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="p-1 rounded text-stone-500 hover:text-[#A91F35]"
                  title="Toggle Asc/Desc"
                >
                  {sortOrder === 'asc' ? '▲' : '▼'}
                </button>
              </div>

              <button
                onClick={() => setIsAddTeamModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>New Team</span>
              </button>
            </div>
          </div>

          {/* Teams Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E9] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4">Team Code & Name</th>
                  <th className="py-3 px-4">Designated Leader</th>
                  <th className="py-3 px-4 text-center">Students</th>
                  <th className="py-3 px-4 text-center">Total Points</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedTeams.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-stone-400">
                      No teams match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-[#F7F3E9]/40 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                            team.rank === 1
                              ? 'bg-[#E6A916] text-[#A91F35]'
                              : team.rank === 2
                              ? 'bg-stone-300 text-stone-800'
                              : team.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {team.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{team.badge}</span>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-1.5">
                              <span>{team.name}</span>
                              <span className="text-[10px] font-mono text-[#A91F35] font-bold">({team.code})</span>
                            </div>
                            <div className="text-[11px] text-stone-500">{team.subname}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-800">{team.leader || 'Not Assigned'}</div>
                        <div className="text-[10px] text-stone-400">{team.leaderContact || 'No contact registered'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F3E9] text-stone-800 border border-stone-200">
                          {team.members} Members
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-black text-sm text-[#A91F35]">
                          {team.points} pts
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            team.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {team.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedTeamDetails(team);
                              setTeamDetailsSubTab('overview');
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-[#F7F3E9] hover:text-[#A91F35] transition-all"
                            title="View Team Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditingTeam({ ...team })}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-[#F7F3E9] hover:text-[#E6A916] transition-all"
                            title="Edit Team"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingTeamConfirm(team)}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                            title="Delete Team"
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

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2">
            <div>
              Showing {processedTeams.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, processedTeams.length)} of {processedTeams.length} teams
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-100"
              >
                Previous
              </button>
              <span className="px-2 font-bold text-stone-800">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-VIEW 3: TEAM REPORTS & ANALYTICS (Section 8)                       */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#A91F35] font-serif">Official Team Reports & Performance Ledger</h3>
              <p className="text-xs text-stone-500">Comprehensive exportable rosters, points breakdowns and ranking audit</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F7F3E9] text-[#A91F35] hover:bg-[#E6A916]/20 border border-[#A91F35]/20 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Print Ledger</span>
              </button>
              <button
                onClick={() => {
                  alert('Exported official Team Performance Ledger in CSV format.');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E9] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Team Code</th>
                  <th className="py-3 px-4">Team Name</th>
                  <th className="py-3 px-4">Subname / Region</th>
                  <th className="py-3 px-4">Team Leader</th>
                  <th className="py-3 px-4 text-center">Allocated Students</th>
                  <th className="py-3 px-4 text-center">Total Points</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F7F3E9]/40">
                    <td className="py-3 px-4 font-black text-xs font-serif text-[#A91F35]">#{t.rank}</td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">{t.code}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{t.name}</td>
                    <td className="py-3 px-4 text-stone-600">{t.subname}</td>
                    <td className="py-3 px-4 font-medium text-stone-800">{t.leader}</td>
                    <td className="py-3 px-4 text-center font-bold text-stone-800">{t.members}</td>
                    <td className="py-3 px-4 text-center font-black font-mono text-sm text-[#A91F35]">{t.points} pts</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-VIEW: TEAM ALLOCATION & AUDIT TRAIL                                */}
      {/* ========================================================================= */}
      {activeTab === 'allocations' && (
        <div className="space-y-6">
          {/* Header Action Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
                Festival Charter Reference: Dalenzia_Teams.pdf
              </span>
              <h2 className="text-xl font-serif font-black text-stone-900 mt-1">
                Centralized Team Allocation & Audit Trail
              </h2>
              <p className="text-xs text-stone-500">
                Authoritative team squads, category distributions and immutable audit trail of all allocations.
              </p>
            </div>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#E6A916]" />
              <span>Export Official Charter PDF</span>
            </button>
          </div>

          {/* Side-by-Side Team Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TEAM 1 */}
            {(() => {
              const t1 = teams.find(t => t.id === 'team-1') || teams[0];
              const t1Students = t1?.students || [];
              return (
                <div className="bg-white rounded-3xl border-2 border-[#A91F35]/30 overflow-hidden shadow-xs">
                  <div className="bg-[#A91F35] text-white p-5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#E6A916] bg-black/20 px-2.5 py-0.5 rounded-full">
                        Official House 1
                      </span>
                      <h3 className="text-2xl font-serif font-black mt-1">{t1?.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-serif font-black">{t1Students.length}</div>
                      <div className="text-[10px] text-white/80 font-bold uppercase">Members</div>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#A91F35] flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5" />
                        <span>Leader: <strong>(L) {t1?.leader}</strong></span>
                      </div>
                      <div className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#E6A916]" />
                        <span>Asst Leader: <strong>(AL) {t1?.asstLeader}</strong></span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-stone-500 font-bold">
                      ID: {t1?.id}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 border-b border-stone-200 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500 block font-medium">Senior</span>
                      <strong className="text-stone-900 text-xs">{t1?.countsByCategory?.Senior || 0}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500 block font-medium">Junior</span>
                      <strong className="text-stone-900 text-xs">{t1?.countsByCategory?.Junior || 0}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500 block font-medium">Sub-Jnr</span>
                      <strong className="text-stone-900 text-xs">{t1?.countsByCategory?.['Sub Junior'] || 0}</strong>
                    </div>
                  </div>

                  <div className="p-4 max-h-72 overflow-y-auto divide-y divide-stone-100 text-xs">
                    {t1Students.map((s, idx) => (
                      <div key={s.id} className="py-2 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-right font-mono font-bold text-stone-400">{idx + 1}</span>
                          <div>
                            <div className="font-bold text-stone-900">{s.name}</div>
                            <div className="text-[10px] text-stone-500 font-mono">Chest: {s.chestNo}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {s.classCategory}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* TEAM 2 */}
            {(() => {
              const t2 = teams.find(t => t.id === 'team-2') || teams[1];
              const t2Students = t2?.students || [];
              return (
                <div className="bg-white rounded-3xl border-2 border-[#E6A916]/40 overflow-hidden shadow-xs">
                  <div className="bg-[#E6A916] text-white p-5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-900 bg-white/30 px-2.5 py-0.5 rounded-full">
                        Official House 2
                      </span>
                      <h3 className="text-2xl font-serif font-black mt-1 text-stone-900">{t2?.name}</h3>
                    </div>
                    <div className="text-right text-stone-900">
                      <div className="text-2xl font-serif font-black">{t2Students.length}</div>
                      <div className="text-[10px] text-stone-800 font-bold uppercase">Members</div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#D97706] flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5" />
                        <span>Leader: <strong>(L) {t2?.leader}</strong></span>
                      </div>
                      <div className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A91F35]" />
                        <span>Asst Leader: <strong>(AL) {t2?.asstLeader}</strong></span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-stone-500 font-bold">
                      ID: {t2?.id}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 border-b border-stone-200 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500 block font-medium">Senior</span>
                      <strong className="text-stone-900 text-xs">{t2?.countsByCategory?.Senior || 0}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500 block font-medium">Junior</span>
                      <strong className="text-stone-900 text-xs">{t2?.countsByCategory?.Junior || 0}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500 block font-medium">Sub-Jnr</span>
                      <strong className="text-stone-900 text-xs">{t2?.countsByCategory?.['Sub Junior'] || 0}</strong>
                    </div>
                  </div>

                  <div className="p-4 max-h-72 overflow-y-auto divide-y divide-stone-100 text-xs">
                    {t2Students.map((s, idx) => (
                      <div key={s.id} className="py-2 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-right font-mono font-bold text-stone-400">{idx + 1}</span>
                          <div>
                            <div className="font-bold text-stone-900">{s.name}</div>
                            <div className="text-[10px] text-stone-500 font-mono">Chest: {s.chestNo}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {s.classCategory}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* AUDIT HISTORY TRAIL TABLE */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Official Team Allocation Audit History
                </h3>
                <p className="text-xs text-stone-500">
                  Comprehensive audit trail of additions, removals, reassignments, and leadership updates
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                {festivalStore.getTeamAllocationAuditLogs().length} Events Recorded
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-stone-700 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {festivalStore.getTeamAllocationAuditLogs().length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-stone-500">
                        No team allocation audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    festivalStore.getTeamAllocationAuditLogs().slice(0, 30).map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-stone-50/60">
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                          {log.timestamp || new Date().toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              (log.action || '').includes('ALLOCATED')
                                ? 'bg-emerald-100 text-emerald-800'
                                : (log.action || '').includes('REMOVED')
                                ? 'bg-red-100 text-red-800'
                                : (log.action || '').includes('REASSIGNED')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-800">
                          {log.actor || 'System'}
                        </td>
                        <td className="py-3 px-4 text-stone-700">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW TEAM MODAL (Section 3)                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddTeamModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#A91F35] text-white flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#E6A916]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif">Register New Festival Team</h3>
                    <p className="text-xs text-stone-500">Auto-generated unique code & leader credentials</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddTeamModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTeamSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Team Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Team M (Tirurangadi Central)"
                    value={newTeamForm.name}
                    onChange={(e) => setNewTeamForm({ ...newTeamForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Team Code (Auto-generated) *</label>
                    <input
                      type="text"
                      required
                      value={newTeamForm.code}
                      onChange={(e) => setNewTeamForm({ ...newTeamForm, code: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono font-bold focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Subname / Sub-region</label>
                    <input
                      type="text"
                      placeholder="e.g. Valley Crest"
                      value={newTeamForm.subname}
                      onChange={(e) => setNewTeamForm({ ...newTeamForm, subname: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Team Leader Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sayyid Haris"
                      value={newTeamForm.leader}
                      onChange={(e) => setNewTeamForm({ ...newTeamForm, leader: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Leader Mobile Contact</label>
                    <input
                      type="text"
                      placeholder="+91 98471 00000"
                      value={newTeamForm.leaderContact}
                      onChange={(e) => setNewTeamForm({ ...newTeamForm, leaderContact: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Team Badge / Emoji</label>
                    <select
                      value={newTeamForm.badge}
                      onChange={(e) => setNewTeamForm({ ...newTeamForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="⭐">⭐ Star</option>
                      <option value="👑">👑 Crown</option>
                      <option value="📖">📖 Book</option>
                      <option value="🔥">🔥 Flame</option>
                      <option value="🌙">🌙 Crescent</option>
                      <option value="🪶">🪶 Quill</option>
                      <option value="🏆">🏆 Trophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Team Status</label>
                    <select
                      value={newTeamForm.status}
                      onChange={(e) => setNewTeamForm({ ...newTeamForm, status: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsAddTeamModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] shadow-xs"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT TEAM MODAL (Section 4)                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-[#A91F35]" />
                  <h3 className="text-base font-bold text-stone-900 font-serif">Edit Team Information</h3>
                </div>
                <button
                  onClick={() => setEditingTeam(null)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditTeamSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Team Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.name}
                    onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Team Code *</label>
                    <input
                      type="text"
                      required
                      value={editingTeam.code}
                      onChange={(e) => setEditingTeam({ ...editingTeam, code: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 font-mono font-bold focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Subname / Region</label>
                    <input
                      type="text"
                      value={editingTeam.subname || ''}
                      onChange={(e) => setEditingTeam({ ...editingTeam, subname: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Leader Name</label>
                    <input
                      type="text"
                      value={editingTeam.leader || ''}
                      onChange={(e) => setEditingTeam({ ...editingTeam, leader: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Leader Contact</label>
                    <input
                      type="text"
                      value={editingTeam.leaderContact || ''}
                      onChange={(e) => setEditingTeam({ ...editingTeam, leaderContact: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Badge</label>
                    <select
                      value={editingTeam.badge}
                      onChange={(e) => setEditingTeam({ ...editingTeam, badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none"
                    >
                      <option value="⭐">⭐ Star</option>
                      <option value="👑">👑 Crown</option>
                      <option value="📖">📖 Book</option>
                      <option value="🔥">🔥 Flame</option>
                      <option value="🌙">🌙 Crescent</option>
                      <option value="🪶">🪶 Quill</option>
                      <option value="🏆">🏆 Trophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Status</label>
                    <select
                      value={editingTeam.status}
                      onChange={(e) => setEditingTeam({ ...editingTeam, status: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setEditingTeam(null)}
                    className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION MODAL WITH RECORD SAFETY CHECK (Section 4)   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {deletingTeamConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold font-serif text-stone-900">Delete Team Record?</h3>
              </div>

              <div className="text-xs text-stone-600 space-y-2">
                <p>
                  You are about to delete <strong>{deletingTeamConfirm.name} ({deletingTeamConfirm.code})</strong>.
                </p>
                {deletingTeamConfirm.students && deletingTeamConfirm.students.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <strong>Warning:</strong> This team currently has{' '}
                    <strong>{deletingTeamConfirm.students.length} assigned students</strong>. Deleting will unassign them back to the registry.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 text-xs">
                <button
                  onClick={() => setDeletingTeamConfirm(null)}
                  className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTeam(deletingTeamConfirm, true)}
                  className="px-5 py-2 rounded-xl font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: FULL TEAM DETAILS VIEW / PAGE (Section 5)                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedTeamDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[92vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-[#F7F3E9] border border-stone-200">
                    {selectedTeamDetails.badge}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black font-serif text-[#A91F35]">{selectedTeamDetails.name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#A91F35] text-white">
                        {selectedTeamDetails.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {selectedTeamDetails.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500">{selectedTeamDetails.subname} • Rank #{selectedTeamDetails.rank}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right sm:border-r border-stone-200 sm:pr-4">
                    <div className="text-lg font-black font-serif text-[#A91F35]">{selectedTeamDetails.points} pts</div>
                    <div className="text-[10px] text-stone-400">Total Accumulation</div>
                  </div>
                  <button
                    onClick={() => setSelectedTeamDetails(null)}
                    className="p-2 rounded-xl text-stone-400 hover:bg-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sub-tabs within Team Details */}
              <div className="flex items-center gap-1.5 border-b border-stone-100 pb-2 text-xs font-bold overflow-x-auto">
                {[
                  { id: 'overview', label: 'Team Overview' },
                  { id: 'students', label: `Enrolled Students (${selectedTeamDetails.students ? selectedTeamDetails.students.length : 0})` },
                  { id: 'competitions', label: 'Registered Competitions' },
                  { id: 'results', label: 'Published Laurels' },
                  { id: 'leader', label: 'Team Leader Portal' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setTeamDetailsSubTab(st.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                      teamDetailsSubTab === st.id
                        ? 'bg-[#A91F35] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-[#F7F3E9]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* DETAILS SUB-TAB 1: OVERVIEW */}
              {teamDetailsSubTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Squad Size</span>
                      <span className="text-lg font-black font-serif text-stone-900">{selectedTeamDetails.members} Members</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Championship Standing</span>
                      <span className="text-lg font-black font-serif text-[#A91F35]">Rank #{selectedTeamDetails.rank}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Current Points</span>
                      <span className="text-lg font-black font-serif text-emerald-700">{selectedTeamDetails.points} pts</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Team Status</span>
                      <span className="text-lg font-bold text-stone-800">{selectedTeamDetails.status}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                    <div className="font-bold text-stone-900 text-sm">Designated Leadership:</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-800">{selectedTeamDetails.leader}</div>
                        <div className="text-stone-500">{selectedTeamDetails.leaderContact}</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {selectedTeamDetails.leaderStatus || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS SUB-TAB 2: ENROLLED STUDENTS */}
              {teamDetailsSubTab === 'students' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                      Team Roster ({selectedTeamDetails.students ? selectedTeamDetails.students.length : 0} Enrolled)
                    </h3>
                    <button
                      onClick={() => setIsAddStudentModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C] flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#E6A916]" />
                      <span>Assign Registered Student</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F7F3E9] text-stone-700 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Chest No</th>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Classification</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {(!selectedTeamDetails.students || selectedTeamDetails.students.length === 0) ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-xs text-stone-400">
                              No students currently assigned to this team roster.
                            </td>
                          </tr>
                        ) : (
                          selectedTeamDetails.students.map((st) => (
                            <tr key={st.id} className="hover:bg-[#F7F3E9]/30">
                              <td className="py-2.5 px-3 font-mono font-bold text-[#A91F35]">{st.chestNo}</td>
                              <td className="py-2.5 px-3 font-bold text-stone-900">{st.name}</td>
                              <td className="py-2.5 px-3 text-stone-600">{st.category}</td>
                              <td className="py-2.5 px-3 text-stone-600">{st.compCategory || 'Literary'}</td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => handleRemoveStudent(st.id, st.name)}
                                  className="p-1 rounded text-stone-400 hover:text-rose-600"
                                  title="Remove student from team"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* DETAILS SUB-TAB 3: REGISTERED COMPETITIONS */}
              {teamDetailsSubTab === 'competitions' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                    Active Registered Events for this Team
                  </h3>
                  {(() => {
                    const comps = festivalStore.getTeamCompetitions(selectedTeamDetails.id);
                    if (comps.length === 0) {
                      return (
                        <div className="p-6 rounded-2xl bg-stone-50 text-center text-xs text-stone-400 border border-stone-200">
                          No competitions currently logged for this team squad.
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2">
                        {comps.map((c) => (
                          <div
                            key={c.id}
                            className="p-3.5 rounded-xl bg-[#F7F3E9]/50 border border-stone-200 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#A91F35]">{c.code}</span>
                                <span className="font-bold text-stone-900">{c.title}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-stone-200">
                                  {c.category}
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-500 mt-0.5">
                                Venue: {c.venue} • Scheduled: {c.date}, {c.time}
                              </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {c.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* DETAILS SUB-TAB 4: PUBLISHED LAURELS & POINTS */}
              {teamDetailsSubTab === 'results' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                    Official Competition Laurels & Awarded Points
                  </h3>
                  {(() => {
                    const res = festivalStore.getTeamResults(selectedTeamDetails.id);
                    if (res.length === 0) {
                      return (
                        <div className="p-6 rounded-2xl bg-stone-50 text-center text-xs text-stone-400 border border-stone-200">
                          No published competition results recorded yet for this team.
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2">
                        {res.map((r) => (
                          <div
                            key={r.id}
                            className="p-3.5 rounded-xl bg-[#F7F3E9]/50 border border-[#E6A916]/40 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                                  r.rank === 1
                                    ? 'bg-[#E6A916] text-[#A91F35]'
                                    : r.rank === 2
                                    ? 'bg-stone-300 text-stone-800'
                                    : 'bg-amber-700 text-white'
                                }`}
                              >
                                {r.rank}
                              </span>
                              <div>
                                <div className="font-bold text-stone-900">{r.competitionTitle}</div>
                                <div className="text-[11px] text-stone-600">
                                  Winner: <strong>{r.studentName}</strong> ({r.chestNo}) • {r.position}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-bold text-sm text-emerald-700">+{r.points} pts</div>
                              <div className="text-[10px] text-stone-400">Score: {r.score}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* DETAILS SUB-TAB 5: TEAM LEADER PORTAL */}
              {teamDetailsSubTab === 'leader' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F7F3E9] border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-stone-900 text-sm">Designated Team Leader</div>
                      <button
                        onClick={() => {
                          setLeaderForm({
                            leader: selectedTeamDetails.leader || '',
                            leaderContact: selectedTeamDetails.leaderContact || '',
                            leaderStatus: selectedTeamDetails.leaderStatus || 'Active'
                          });
                          setIsChangeLeaderModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                      >
                        Change Team Leader
                      </button>
                    </div>

                    <div className="pt-2 border-t border-stone-200 space-y-1">
                      <div><strong>Leader Name:</strong> {selectedTeamDetails.leader || 'Not Appointed'}</div>
                      <div><strong>Contact Phone:</strong> {selectedTeamDetails.leaderContact || 'N/A'}</div>
                      <div><strong>Portal Login Status:</strong> <span className="font-bold text-emerald-700">{selectedTeamDetails.leaderStatus || 'Active'}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: ENROLL STUDENT TO TEAM (Section 5)                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddStudentModalOpen && selectedTeamDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#A91F35]" />
                  <h3 className="text-base font-bold text-stone-900 font-serif">Enroll Student into {selectedTeamDetails.name}</h3>
                </div>
                <button
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEnrollStudentSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Select Candidate from Central Registry *
                  </label>
                  <select
                    required
                    value={enrollStudentForm.studentId}
                    onChange={(e) => setEnrollStudentForm({ ...enrollStudentForm, studentId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="">-- Choose unassigned student --</option>
                    {unassignedStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.chestNo}) — {s.classCategory}{s.auditNote ? ' [Audit Duplicate Flag]' : ''}
                      </option>
                    ))}
                  </select>
                  {unassignedStudents.length === 0 && (
                    <div className="text-[11px] text-amber-600 mt-1">
                      All registered candidates currently assigned to festival teams.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Competition Category</label>
                  <select
                    value={enrollStudentForm.compCategory}
                    onChange={(e) => setEnrollStudentForm({ ...enrollStudentForm, compCategory: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="General">General (Team Event)</option>
                    <option value="Stage">Stage Programme</option>
                    <option value="Off Stage">Off Stage Programme</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                  >
                    Confirm Enrollment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 6: CHANGE TEAM LEADER (Section 6)                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isChangeLeaderModalOpen && selectedTeamDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-base font-bold text-stone-900 font-serif">Assign Team Leader</h3>
                <button
                  onClick={() => setIsChangeLeaderModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleChangeLeaderSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Team Leader Name *</label>
                  <input
                    type="text"
                    required
                    value={leaderForm.leader}
                    onChange={(e) => setLeaderForm({ ...leaderForm, leader: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Leader Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={leaderForm.leaderContact}
                    onChange={(e) => setLeaderForm({ ...leaderForm, leaderContact: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Account Status</label>
                  <select
                    value={leaderForm.leaderStatus}
                    onChange={(e) => setLeaderForm({ ...leaderForm, leaderStatus: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending Invitation</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsChangeLeaderModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                  >
                    Save Leader
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Team Charter PDF Modal */}
      <TeamCharterPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
}
