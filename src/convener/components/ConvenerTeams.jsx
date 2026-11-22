import React, { useState, useEffect, useMemo } from 'react';
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
  UserCheck,
  Printer,
  ArrowRightLeft,
  Shield,
  Filter,
  Eye,
  Sparkles
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import TeamCharterPdfModal from '../../components/TeamCharterPdfModal';

export default function ConvenerTeams() {
  const [teams, setTeams] = useState(() => festivalStore.getTeams());
  const [registeredStudents, setRegisteredStudents] = useState(() => festivalStore.getRegisteredStudents());
  const [allocationStats, setAllocationStats] = useState(() => festivalStore.getTeamAllocationStats());

  // Active view tab: 'overview' | 'roster' | 'transfer'
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filters for Roster
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Transfer / Reassign Modal State
  const [transferModalStudent, setTransferModalStudent] = useState(null);
  const [transferTargetTeamId, setTransferTargetTeamId] = useState('team-2');
  const [transferReason, setTransferReason] = useState('');

  // PDF Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setTeams(festivalStore.getTeams());
      setRegisteredStudents(festivalStore.getRegisteredStudents());
      setAllocationStats(festivalStore.getTeamAllocationStats());
    });
    return () => unsub();
  }, []);

  const team1 = teams.find(t => t.id === 'team-1') || teams[0];
  const team2 = teams.find(t => t.id === 'team-2') || teams[1];

  // Filtered students for unified roster
  const filteredStudents = useMemo(() => {
    return registeredStudents.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        (s.name || '').toLowerCase().includes(q) ||
        (s.chestNo || '').toLowerCase().includes(q) ||
        (s.id || '').toLowerCase().includes(q);

      const matchTeam =
        teamFilter === 'all' ||
        (teamFilter === 'unassigned' && (!s.teamId || s.teamId === 'Unassigned')) ||
        s.teamId === teamFilter;

      const matchCategory =
        categoryFilter === 'all' ||
        (s.classCategory || '').toLowerCase() === categoryFilter.toLowerCase();

      return matchSearch && matchTeam && matchCategory;
    });
  }, [registeredStudents, searchQuery, teamFilter, categoryFilter]);

  // Unassigned students
  const unassignedStudents = useMemo(() => {
    return registeredStudents.filter(s => !s.teamId || s.teamId === 'Unassigned');
  }, [registeredStudents]);

  // Handle Transfer / Reassignment
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferModalStudent || !transferTargetTeamId) return;

    try {
      festivalStore.allocateStudentToTeam(
        transferTargetTeamId,
        transferModalStudent.id,
        'Festival Convener'
      );
      const targetTeam = teams.find(t => t.id === transferTargetTeamId);
      showToast(
        `Transferred ${transferModalStudent.name} (${transferModalStudent.chestNo}) to ${targetTeam?.name || transferTargetTeamId} successfully!`
      );
      setTransferModalStudent(null);
      setTransferReason('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Quick 1-click allocation for unassigned students
  const handleQuickAllocate = (studentId, studentName, targetTeamId) => {
    try {
      festivalStore.allocateStudentToTeam(targetTeamId, studentId, 'Festival Convener');
      const targetTeam = teams.find(t => t.id === targetTeamId);
      showToast(`Enrolled ${studentName} into ${targetTeam?.name}!`);
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
      case 'Minor':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-5 right-5 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-white ${
              toastMessage.type === 'error' ? 'bg-red-600' : 'bg-emerald-700'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{toastMessage.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Convener Operations
            </span>
            <span className="text-xs font-bold text-stone-500 font-mono">
              Central Institutional Registry
            </span>
          </div>
          <h1 className="text-2xl font-serif font-black text-stone-900">
            Team Overview & Operational Allocation
          </h1>
          <p className="text-xs text-stone-500">
            Synchronized live data across Team Leaders, Convener Desk, Admin Control Centre, and Festival Leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#E6A916]" />
            <span>Export Team Charter PDF</span>
          </button>
        </div>
      </div>

      {/* Unassigned Students Alert Banner */}
      {unassignedStudents.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">
                {unassignedStudents.length} Student{unassignedStudents.length > 1 ? 's' : ''} Pending Team Allocation!
              </div>
              <div className="text-[11px] text-amber-800">
                These registered students have not yet been assigned to Team 1 or Team 2.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('roster');
              setTeamFilter('unassigned');
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            View Unassigned Students →
          </button>
        </div>
      )}

      {/* 4 Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Total Admitted</div>
          <div className="text-2xl font-serif font-black text-stone-900 mt-1">
            {allocationStats?.totalRegistered || 46}
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Students in Dars</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#A91F35]/20 shadow-2xs">
          <div className="text-[10px] font-bold text-[#A91F35] uppercase tracking-wider">TEAM 1 Strength</div>
          <div className="text-2xl font-serif font-black text-[#A91F35] mt-1">
            {(team1?.students || []).length}
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Leader: (L) {team1?.leader}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6A916]/40 shadow-2xs">
          <div className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">TEAM 2 Strength</div>
          <div className="text-2xl font-serif font-black text-[#D97706] mt-1">
            {(team2?.students || []).length}
          </div>
          <div className="text-[10px] text-stone-500 font-medium">Leader: (L) {team2?.leader}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Unassigned</div>
          <div className="text-2xl font-serif font-black text-emerald-800 mt-1">
            {unassignedStudents.length}
          </div>
          <div className="text-[10px] text-stone-500 font-medium">
            {unassignedStudents.length === 0 ? 'All 100% Allocated' : 'Needs Allocation'}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#A91F35] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Side-by-Side Team Comparison
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'roster'
              ? 'bg-[#A91F35] text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Unified Student Allocation Roster
        </button>
      </div>

      {/* TAB 1: SIDE-BY-SIDE TEAM COMPARISON */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TEAM 1 CARD */}
          <div className="bg-white rounded-3xl border-2 border-[#A91F35]/30 overflow-hidden shadow-xs">
            <div className="bg-[#A91F35] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#E6A916] bg-black/20 px-2 py-0.5 rounded-full">
                  Team 1 Official
                </span>
                <h2 className="text-2xl font-serif font-black mt-1">{team1?.name}</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-serif font-black">
                  {(team1?.students || []).length}
                </div>
                <div className="text-[10px] text-white/80 font-bold uppercase">Members</div>
              </div>
            </div>

            {/* Leadership Details */}
            <div className="p-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#A91F35] flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Leader: <strong>(L) {team1?.leader}</strong></span>
                </div>
                <div className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>Asst Leader: <strong>(AL) {team1?.asstLeader}</strong></span>
                </div>
              </div>
              <div className="text-right font-mono text-[11px] text-stone-500">
                Code: {team1?.code}
              </div>
            </div>

            {/* Category Distribution Pills */}
            <div className="p-3 bg-stone-50 border-b border-stone-200 grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Senior</span>
                <strong className="text-stone-900 text-xs">{team1?.countsByCategory?.Senior || 0}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Junior</span>
                <strong className="text-stone-900 text-xs">{team1?.countsByCategory?.Junior || 0}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Sub-Jnr</span>
                <strong className="text-stone-900 text-xs">{team1?.countsByCategory?.['Sub Junior'] || 0}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Minor</span>
                <strong className="text-stone-900 text-xs">{team1?.countsByCategory?.Minor || 0}</strong>
              </div>
            </div>

            {/* Members List */}
            <div className="p-4 max-h-96 overflow-y-auto divide-y divide-stone-100 text-xs">
              {(team1?.students || []).map((s, idx) => (
                <div key={s.id} className="py-2 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-right font-mono font-bold text-stone-400">{idx + 1}</span>
                    <div>
                      <div className="font-bold text-stone-900">{s.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">Chest: {s.chestNo}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        s.classCategory
                      )}`}
                    >
                      {s.classCategory}
                    </span>
                    <button
                      onClick={() => {
                        setTransferModalStudent(s);
                        setTransferTargetTeamId('team-2');
                      }}
                      className="p-1 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-rose-50 cursor-pointer"
                      title="Reassign to Team 2"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TEAM 2 CARD */}
          <div className="bg-white rounded-3xl border-2 border-[#E6A916]/40 overflow-hidden shadow-xs">
            <div className="bg-[#E6A916] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-stone-900 bg-white/30 px-2 py-0.5 rounded-full">
                  Team 2 Official
                </span>
                <h2 className="text-2xl font-serif font-black mt-1 text-stone-900">{team2?.name}</h2>
              </div>
              <div className="text-right text-stone-900">
                <div className="text-2xl font-serif font-black">
                  {(team2?.students || []).length}
                </div>
                <div className="text-[10px] text-stone-800 font-bold uppercase">Members</div>
              </div>
            </div>

            {/* Leadership Details */}
            <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#D97706] flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Leader: <strong>(L) {team2?.leader}</strong></span>
                </div>
                <div className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-[#A91F35]" />
                  <span>Asst Leader: <strong>(AL) {team2?.asstLeader}</strong></span>
                </div>
              </div>
              <div className="text-right font-mono text-[11px] text-stone-500">
                Code: {team2?.code}
              </div>
            </div>

            {/* Category Distribution Pills */}
            <div className="p-3 bg-stone-50 border-b border-stone-200 grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Senior</span>
                <strong className="text-stone-900 text-xs">{team2?.countsByCategory?.Senior || 0}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Junior</span>
                <strong className="text-stone-900 text-xs">{team2?.countsByCategory?.Junior || 0}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Sub-Jnr</span>
                <strong className="text-stone-900 text-xs">{team2?.countsByCategory?.['Sub Junior'] || 0}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-500 block font-medium">Minor</span>
                <strong className="text-stone-900 text-xs">{team2?.countsByCategory?.Minor || 0}</strong>
              </div>
            </div>

            {/* Members List */}
            <div className="p-4 max-h-96 overflow-y-auto divide-y divide-stone-100 text-xs">
              {(team2?.students || []).map((s, idx) => (
                <div key={s.id} className="py-2 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-right font-mono font-bold text-stone-400">{idx + 1}</span>
                    <div>
                      <div className="font-bold text-stone-900">{s.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">Chest: {s.chestNo}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        s.classCategory
                      )}`}
                    >
                      {s.classCategory}
                    </span>
                    <button
                      onClick={() => {
                        setTransferModalStudent(s);
                        setTransferTargetTeamId('team-1');
                      }}
                      className="p-1 rounded-lg text-stone-400 hover:text-[#A91F35] hover:bg-amber-50 cursor-pointer"
                      title="Reassign to Team 1"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNIFIED ROSTER TABLE */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate by name, chest no or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500 font-medium">Team:</span>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Teams</option>
                  <option value="team-1">Team 1 (Dazzlers)</option>
                  <option value="team-2">Team 2 (Dynamos)</option>
                  <option value="unassigned">Unassigned Only</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-500 font-medium">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Categories</option>
                  <option value="Senior">Senior</option>
                  <option value="Junior">Junior</option>
                  <option value="Sub Junior">Sub Junior</option>
                  <option value="Minor">Minor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Chest No</th>
                    <th className="py-3 px-4">Student Candidate</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Assigned Team</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-stone-500">
                        No students found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => {
                      const isUnassigned = !s.teamId || s.teamId === 'Unassigned';

                      return (
                        <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 px-4 text-center font-mono font-bold text-stone-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">
                            {s.chestNo}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900 flex items-center gap-1.5 flex-wrap">
                              <span>{s.name}</span>
                              {s.auditNote && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-100 text-amber-800 border border-amber-300 font-semibold" title={s.auditNote}>
                                  Typo Duplicate (Dalenzia_Teams.pdf)
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-500 font-mono">ID: {s.id}</div>
                            {s.auditNote && (
                              <div className="text-[10px] text-amber-700 italic mt-0.5 max-w-sm">{s.auditNote}</div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getCategoryBadgeClass(
                                s.classCategory
                              )}`}
                            >
                              {s.classCategory || 'Minor'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {isUnassigned ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200">
                                Unassigned
                              </span>
                            ) : s.teamId === 'team-1' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] font-bold text-[10px] border border-[#A91F35]/20">
                                TEAM 1
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916]/20 text-amber-900 font-bold text-[10px] border border-[#E6A916]/40">
                                TEAM 2
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isUnassigned ? (
                                <>
                                  <button
                                    onClick={() => handleQuickAllocate(s.id, s.name, 'team-1')}
                                    className="px-2.5 py-1 rounded-xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] font-bold text-[11px] transition-colors cursor-pointer"
                                  >
                                    + Team 1
                                  </button>
                                  <button
                                    onClick={() => handleQuickAllocate(s.id, s.name, 'team-2')}
                                    className="px-2.5 py-1 rounded-xl bg-[#E6A916] text-stone-900 hover:bg-[#d99f14] font-bold text-[11px] transition-colors cursor-pointer"
                                  >
                                    + Team 2
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setTransferModalStudent(s);
                                    setTransferTargetTeamId(s.teamId === 'team-1' ? 'team-2' : 'team-1');
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Reassign team"
                                >
                                  <ArrowRightLeft className="w-3 h-3 text-[#A91F35]" />
                                  <span>Transfer</span>
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
        </div>
      )}

      {/* ===================================================================== */}
      {/* REASSIGN / TRANSFER MODAL                                              */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {transferModalStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-[#A91F35] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-black text-base">Reassign Team Allocation</h3>
                </div>
                <button
                  onClick={() => setTransferModalStudent(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 text-sm">{transferModalStudent.name}</div>
                  <div className="text-[11px] text-stone-500 font-mono">
                    Chest No: {transferModalStudent.chestNo} • Category: {transferModalStudent.classCategory}
                  </div>
                  <div className="text-[11px] text-[#A91F35] font-semibold">
                    Current Team: {transferModalStudent.teamName || transferModalStudent.teamId || 'Unassigned'}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Team</label>
                  <select
                    value={transferTargetTeamId}
                    onChange={(e) => setTransferTargetTeamId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="team-1">TEAM 1 (Noufal & Hafiz Hassan)</option>
                    <option value="team-2">TEAM 2 (Hashim & Irfan Edayyur)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Reason for Transfer (Audit Trail)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balancing squad categories, approved mutual transfer..."
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Official Notice:</strong> Student category (<strong>{transferModalStudent.classCategory}</strong>)
                  will remain unchanged. This transfer will be logged with Convener credentials.
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferModalStudent(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8B1A2C] text-white font-bold shadow-md transition-colors cursor-pointer"
                  >
                    Confirm Reassignment
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
