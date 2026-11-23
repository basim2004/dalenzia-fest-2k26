import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy, Search, Filter, Plus, Calendar, Clock, MapPin, Users,
  CheckCircle2, X, UserCheck, Edit2, Trash2, Eye, Shield, AlertTriangle,
  Award, Sparkles, Download, Printer, Check, RefreshCw, FileText,
  ChevronLeft, ChevronRight, ArrowUpDown, Layers, Settings, UserPlus,
  BookOpen, Mic, Palette, Film, HelpCircle, Music
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function CompetitionsModule({ activeSection }) {
  // Navigation tabs: 'overview' | 'directory' | 'registration' | 'judges' | 'reports'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('directory') || hash.includes('list')) return 'directory';
      if (hash.includes('registration') || hash.includes('enrolment')) return 'registration';
      if (hash.includes('judge') || hash.includes('rubric')) return 'judges';
      if (hash.includes('reports') || hash.includes('roster')) return 'reports';
    }
    return 'overview';
  });

  // Core Store Data
  const [stats, setStats] = useState(() => festivalStore.getCompetitionStats());
  const [competitions, setCompetitions] = useState(() => festivalStore.getCompetitions());
  const [students, setStudents] = useState(() => festivalStore.getStudents());
  const [judges, setJudges] = useState(() => festivalStore.getJudges());
  const [teams, setTeams] = useState(() => festivalStore.getTeams());

  // Charter Master State (83 Official Definitions)
  const [charterProgrammes, setCharterProgrammes] = useState(() => festivalStore.getCharterProgrammes());
  const [charterStats, setCharterStats] = useState(() => festivalStore.getCharterStats());
  const [charterSearch, setCharterSearch] = useState('');
  const [charterClassFilter, setCharterClassFilter] = useState('all');
  const [charterCatFilter, setCharterCatFilter] = useState('all');

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassificationFilter, setSelectedClassificationFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedVenueFilter, setSelectedVenueFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active items for modals
  const [activeComp, setActiveComp] = useState(null);
  const [activeCompDetails, setActiveCompDetails] = useState(null);
  const [detailsSubTab, setDetailsSubTab] = useState('basic'); // 'basic' | 'participants' | 'judges' | 'criteria' | 'results'

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    classification: 'Stage',
    category: 'Senior',
    type: 'Individual',
    venue: 'Cordova Grand Stage (Stage 01)',
    date: 'Dec 21, 2026',
    time: '10:00 AM',
    maxParticipants: 24,
    eligibility: 'Open',
    rules: '',
    description: '',
    status: 'Upcoming',
    totalMaxMarks: 100
  });

  // Form State for Enroll Participant
  const [enrollStudentId, setEnrollStudentId] = useState('');

  // Form State for Criteria
  const [criteriaList, setCriteriaList] = useState([
    { id: 'c1', name: 'Mastery & Articulation', maxMarks: 40 },
    { id: 'c2', name: 'Thematic Depth', maxMarks: 35 },
    { id: 'c3', name: 'Stage Presence & Timing', maxMarks: 25 }
  ]);

  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [forceDelete, setForceDelete] = useState(false);

  // Official Classification and Category lists strictly from Dalenzia 2K26 Festival Charter
  const classifications = [
    'All Classifications',
    'Stage',
    'Off Stage',
    'General'
  ];

  const categories = [
    'All Categories',
    'Minor',
    'Sub Junior',
    'Junior',
    'Senior',
    'General'
  ];

  // Official Venues List
  const venues = [
    'Cordova Grand Stage (Stage 01)',
    'Al-Farabi Heritage Hall (Stage 02)',
    'Ibn Khaldun Academic Hall (Stage 03)',
    'Media Studio Preview Room',
    'Open Amphitheatre'
  ];

  // Refresh data from festivalStore
  const refreshData = () => {
    setStats(festivalStore.getCompetitionStats());
    setCompetitions(festivalStore.getCompetitions({
      query: searchQuery,
      classification: selectedClassificationFilter,
      type: selectedTypeFilter,
      category: selectedCategoryFilter,
      status: selectedStatusFilter,
      sortBy,
      sortOrder
    }));
    setStudents(festivalStore.getStudents());
    setJudges(festivalStore.getJudges());
    setTeams(festivalStore.getTeams());
    setCharterProgrammes(festivalStore.getCharterProgrammes());
    setCharterStats(festivalStore.getCharterStats());
  };

  const filteredCharterProgrammes = useMemo(() => {
    return festivalStore.getCharterProgrammes({
      query: charterSearch,
      classification: charterClassFilter,
      category: charterCatFilter
    });
  }, [charterSearch, charterClassFilter, charterCatFilter, charterProgrammes]);

  const handleActivateFromCharter = (progId) => {
    const res = festivalStore.activateCharterProgramme(progId);
    if (res.success) {
      showToast(`Activated "${res.competition.title}" (${res.competition.code}) as competition!`);
      refreshData();
      setActiveTab('directory');
    } else {
      showToast(res.error || 'Could not activate competition');
    }
  };

  useEffect(() => {
    refreshData();
  }, [searchQuery, selectedClassificationFilter, selectedTypeFilter, selectedCategoryFilter, selectedStatusFilter, sortBy, sortOrder]);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Pagination calculations
  const totalPages = Math.ceil(competitions.length / itemsPerPage) || 1;
  const paginatedCompetitions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return competitions.slice(start, start + itemsPerPage);
  }, [competitions, currentPage]);

  // Open Add Competition Modal
  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      code: '',
      classification: 'Stage',
      category: 'Senior',
      type: 'Individual',
      venue: 'Cordova Grand Stage (Stage 01)',
      date: 'Dec 21, 2026',
      time: '10:00 AM',
      maxParticipants: 24,
      eligibility: 'Open',
      rules: 'Participants must report to green room 15 mins prior. Time limit 10 mins.',
      description: 'Official competitive event under Dalenzia Fest 2K26.',
      status: 'Upcoming',
      totalMaxMarks: 100
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Submit Add Competition
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = festivalStore.addCompetition(formData);
      if (res.success) {
        showToast(`Created competition: ${res.competition.competitionTitle} (${res.competition.competitionCode})`);
        setIsAddModalOpen(false);
        refreshData();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create competition.');
    }
  };

  // Open Edit Competition Modal
  const handleOpenEditModal = (comp) => {
    setActiveComp(comp);
    setFormData({
      title: comp.title || comp.competitionTitle,
      code: comp.code || comp.competitionCode,
      classification: comp.classification || (comp.category === 'General' ? 'General' : 'Stage'),
      category: comp.category || 'Senior',
      type: comp.type || 'Individual',
      venue: comp.venue,
      date: comp.date,
      time: comp.time,
      maxParticipants: comp.maxParticipants || 24,
      eligibility: comp.eligibility || 'Open',
      rules: comp.rules || '',
      description: comp.description || '',
      status: comp.status || 'Upcoming',
      totalMaxMarks: comp.totalMaxMarks || 100
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Submit Edit Competition
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = festivalStore.updateCompetition(activeComp.id, formData);
      if (res.success) {
        showToast(`Updated parameters for ${res.competition.competitionTitle}`);
        setIsEditModalOpen(false);
        refreshData();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to update competition.');
    }
  };

  // Open Details Modal
  const handleOpenDetailsModal = (comp) => {
    const fullDetails = festivalStore.getCompetitionById(comp.id);
    setActiveCompDetails(fullDetails);
    setDetailsSubTab('basic');
    setIsDetailsModalOpen(true);
  };

  // Open Enroll Participant Modal
  const handleOpenEnrollModal = (comp) => {
    setActiveComp(comp);
    setEnrollStudentId('');
    setFormError('');
    setIsEnrollModalOpen(true);
  };

  // Submit Enroll Participant
  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!enrollStudentId) {
      setFormError('Please select a student candidate.');
      return;
    }
    setFormError('');
    try {
      const res = festivalStore.registerParticipantForCompetition(activeComp.id, enrollStudentId);
      if (res.success) {
        showToast(`Enrolled ${res.participant.name} (${res.participant.chestNo}) into ${activeComp.title || activeComp.competitionTitle}!`);
        setIsEnrollModalOpen(false);
        refreshData();
        if (isDetailsModalOpen && activeCompDetails) {
          setActiveCompDetails(festivalStore.getCompetitionById(activeCompDetails.id));
        }
      }
    } catch (err) {
      setFormError(err.message || 'Failed to enroll participant.');
    }
  };

  // Handle Remove Participant
  const handleRemoveParticipant = (comp, studentId) => {
    if (!window.confirm('Remove candidate from this competition?')) return;
    try {
      festivalStore.removeParticipantFromCompetition(comp.id, studentId);
      showToast('Participant removed from competition.');
      refreshData();
      if (isDetailsModalOpen && activeCompDetails) {
        setActiveCompDetails(festivalStore.getCompetitionById(activeCompDetails.id));
      }
    } catch (err) {
      alert(err.message || 'Failed to remove participant.');
    }
  };

  // Open Criteria Modal
  const handleOpenCriteriaModal = (comp) => {
    setActiveComp(comp);
    setCriteriaList(
      comp.evaluationCriteria && comp.evaluationCriteria.length > 0
        ? JSON.parse(JSON.stringify(comp.evaluationCriteria))
        : [
            { id: 'c1', name: 'Mastery & Articulation', maxMarks: 40 },
            { id: 'c2', name: 'Thematic Depth', maxMarks: 35 },
            { id: 'c3', name: 'Stage Presence & Timing', maxMarks: 25 }
          ]
    );
    setFormError('');
    setIsCriteriaModalOpen(true);
  };

  // Submit Criteria Update
  const handleCriteriaSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    try {
      const res = festivalStore.updateEvaluationCriteria(activeComp.id, criteriaList, 100);
      if (res.success) {
        showToast(`Evaluation rubric updated for ${activeComp.title || activeComp.competitionTitle}`);
        setIsCriteriaModalOpen(false);
        refreshData();
        if (isDetailsModalOpen && activeCompDetails) {
          setActiveCompDetails(festivalStore.getCompetitionById(activeCompDetails.id));
        }
      }
    } catch (err) {
      setFormError(err.message || 'Criteria configuration failed.');
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (comp) => {
    setActiveComp(comp);
    setForceDelete(false);
    setFormError('');
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    setFormError('');
    try {
      const res = festivalStore.deleteCompetition(activeComp.id, forceDelete);
      if (res.success) {
        showToast(`Competition ${activeComp.title || activeComp.competitionTitle} deleted successfully.`);
        setIsDeleteModalOpen(false);
        refreshData();
      }
    } catch (err) {
      setFormError(err.message || 'Failed to delete competition.');
    }
  };

  // Quick Status Change
  const handleQuickStatusChange = (comp, newStatus) => {
    try {
      festivalStore.updateCompetitionStatus(comp.id, newStatus);
      showToast(`Status updated to ${newStatus}`);
      refreshData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Competition ID', 'Code', 'Title', 'Category', 'Type', 'Venue', 'Date', 'Time',
      'Registered Participants', 'Max Capacity', 'Assigned Judges Count', 'Status'
    ];
    const rows = competitions.map(c => [
      `"${c.competitionId || c.id}"`,
      `"${c.code}"`,
      `"${c.title}"`,
      `"${c.category}"`,
      `"${c.type}"`,
      `"${c.venue}"`,
      `"${c.date}"`,
      `"${c.time}"`,
      c.registeredCount,
      c.maxParticipants,
      c.assignedJudgesCount,
      `"${c.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_competitions_schedule_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported festival competition roster as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#A91F35] via-[#851627] to-[#5C0F1C] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold tracking-wider uppercase mb-3 text-amber-200">
              <Trophy className="w-3.5 h-3.5" />
              Official Competition Management System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Competition Management
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl font-sans">
              Official competition directory, classifications (Stage, Off Stage, General), student categories, adjudicators, and real-time festival marks sync.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 text-stone-900" />
              Add New Competition
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition-all"
            >
              <Download className="w-4 h-4" />
              Export Schedule (CSV)
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Dashboard & Classification Metrics', icon: Trophy },
            { id: 'charter', label: 'Charter Master List (83)', icon: BookOpen },
            { id: 'directory', label: `Competition Directory (${competitions.length})`, icon: Layers },
            { id: 'registration', label: 'Registration Monitoring', icon: UserCheck },
            { id: 'judges', label: 'Adjudicator & Rubric Sync', icon: Shield },
            { id: 'reports', label: 'Official Reports', icon: FileText }
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
      {/* TAB 1: OVERVIEW & CLASSIFICATION METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 8 Core KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {[
              { label: 'Total Events', value: stats.totalCompetitions, sub: 'Active in Engine', icon: Trophy, color: '#A91F35', bg: 'bg-red-50 text-red-700' },
              { label: 'Stage', value: stats.stageCount || 0, sub: 'Stage Programmes', icon: Mic, color: '#A91F35', bg: 'bg-rose-50 text-rose-700' },
              { label: 'Off Stage', value: stats.offStageCount || 0, sub: 'Off Stage Events', icon: BookOpen, color: '#047857', bg: 'bg-emerald-50 text-emerald-700' },
              { label: 'General', value: stats.generalCount || 0, sub: 'Team Competitions', icon: Sparkles, color: '#D97706', bg: 'bg-amber-50 text-amber-700' },
              { label: 'Individual', value: stats.individualCount || 0, sub: 'Solo Events (3-2-1 pts)', icon: Users, color: '#2563EB', bg: 'bg-blue-50 text-blue-700' },
              { label: 'Active / Live', value: stats.activeCount || 0, sub: 'Ongoing Now', icon: Clock, color: '#EA580C', bg: 'bg-orange-50 text-orange-700' },
              { label: 'Published', value: stats.completedCount || 0, sub: 'Results Verified', icon: CheckCircle2, color: '#059669', bg: 'bg-teal-50 text-teal-700' },
              { label: 'Candidates', value: stats.totalParticipants || 0, sub: 'Enrolled Entries', icon: UserCheck, color: '#7C3AED', bg: 'bg-purple-50 text-purple-700' }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{card.label}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${card.bg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900">{card.value}</div>
                  <div className="text-[10px] text-stone-600 mt-0.5">{card.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Visual Breakdowns: Classifications & Student Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Classification & Category Breakdown Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Official Classifications</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Charter structure: Stage, Off Stage, and General</p>
                </div>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="text-xs font-bold text-[#A91F35] hover:underline"
                >
                  View Directory &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Stage Programmes (Charter pp. 5–8)', count: stats.stageCount || 0, color: 'from-[#A91F35] to-rose-500' },
                  { name: 'Off Stage Programmes (Charter pp. 5–8)', count: stats.offStageCount || 0, color: 'from-emerald-600 to-teal-500' },
                  { name: 'General Programmes (Charter p. 9 - Team Based)', count: stats.generalCount || 0, color: 'from-amber-500 to-yellow-500' }
                ].map((item, idx) => {
                  const pct = stats.totalCompetitions > 0 ? Math.round((item.count / stats.totalCompetitions) * 100) : 0;
                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-stone-800">{item.name}</span>
                        <span className="text-stone-900">{item.count} Events ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Venue & Stage Allocation */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Active Stage & Venue Allocation</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Events scheduled across the 5 festival venues</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                  5 Stages
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(stats.venueBreakdown).map(([venue, count], idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-[#A91F35]/30 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                        <MapPin className="w-4 h-4 text-[#A91F35]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{venue}</div>
                        <div className="text-[10px] text-stone-500">Live Stage Venue</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-black font-mono">
                      {count} Events
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: CHARTER MASTER PROGRAMMES (83 DEFINITIONS) */}
      {/* ========================================================================= */}
      {activeTab === 'charter' && (
        <div className="space-y-6">
          {/* Charter Header & KPI Pills */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A91F35] text-white uppercase tracking-wider">
                    Official Festival Charter
                  </span>
                  <span className="text-xs text-stone-500 font-medium">Pages 5–9</span>
                </div>
                <h2 className="text-lg font-bold text-stone-900 mt-1 font-serif">
                  Programme Master Definitions (83 Items)
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Standardized festival programmes available to be activated into live competitions by authorized conveners and judges.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Custom Competition
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setCharterClassFilter('all')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  charterClassFilter === 'all'
                    ? 'border-[#A91F35] bg-[#A91F35]/5 ring-2 ring-[#A91F35]/20'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">All Definitions</div>
                <div className="text-xl font-black text-stone-900 font-mono mt-1">83</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Complete Charter Master</div>
              </div>

              <div
                onClick={() => setCharterClassFilter('Stage')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  charterClassFilter === 'Stage'
                    ? 'border-red-500 bg-red-50 ring-2 ring-red-400/20'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-red-700 tracking-wider flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Stage
                </div>
                <div className="text-xl font-black text-stone-900 font-mono mt-1">40</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Pages 5–8 (Minor: 9, Sub: 11, Jr: 10, Sr: 10)</div>
              </div>

              <div
                onClick={() => setCharterClassFilter('Off Stage')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  charterClassFilter === 'Off Stage'
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/20'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Off Stage
                </div>
                <div className="text-xl font-black text-stone-900 font-mono mt-1">32</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Pages 5–8 (Minor: 9, Sub: 8, Jr: 8, Sr: 7)</div>
              </div>

              <div
                onClick={() => setCharterClassFilter('General')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  charterClassFilter === 'General'
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400/20'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3" /> General (Team)
                </div>
                <div className="text-xl font-black text-stone-900 font-mono mt-1">11</div>
                <div className="text-[10px] text-stone-500 mt-0.5">Page 9 Team-Based Contests</div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search 83 Charter programmes by name, category, or code..."
                  value={charterSearch}
                  onChange={(e) => setCharterSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={charterCatFilter}
                  onChange={(e) => setCharterCatFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-700"
                >
                  <option value="all">All Categories (5)</option>
                  <option value="Minor">Minor (18)</option>
                  <option value="Sub Junior">Sub Junior (19)</option>
                  <option value="Junior">Junior (18)</option>
                  <option value="Senior">Senior (17)</option>
                  <option value="General">General (11)</option>
                </select>
                {(charterSearch || charterClassFilter !== 'all' || charterCatFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setCharterSearch('');
                      setCharterClassFilter('all');
                      setCharterCatFilter('all');
                    }}
                    className="px-2.5 py-2 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Programmes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCharterProgrammes.map((prog) => {
              const isConfigured = competitions.some(c => c.id === prog.id || c.code === prog.code);
              const classBadge = prog.classification === 'Stage'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : prog.classification === 'Off Stage'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200';

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/90 hover:border-[#A91F35]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[11px] font-bold text-stone-500">
                        #{prog.order} • {prog.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${classBadge}`}>
                        {prog.classification}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm font-serif">
                      {prog.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                        {prog.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px]">
                        {prog.type} {prog.requiredMembers ? `(${prog.requiredMembers} Members)` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      Charter Master
                    </span>
                    {isConfigured ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                      </span>
                    ) : (
                      <button
                        onClick={() => handleActivateFromCharter(prog.id)}
                        className="flex items-center gap-1 text-[11px] font-bold text-[#A91F35] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-all"
                      >
                        <Plus className="w-3 h-3" /> Configure Event
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCharterProgrammes.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
              <p className="text-sm font-semibold text-stone-600">No charter programmes match your search or filter.</p>
              <button
                onClick={() => {
                  setCharterSearch('');
                  setCharterClassFilter('all');
                  setCharterCatFilter('all');
                }}
                className="mt-2 text-xs font-bold text-[#A91F35] underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPETITION DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by competition title, code (LIT-JR-102), classification, category, or venue..."
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
              {/* Classification Filter */}
              <select
                value={selectedClassificationFilter}
                onChange={(e) => setSelectedClassificationFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                {classifications.map((c, i) => (
                  <option key={i} value={c === 'All Classifications' ? 'all' : c}>{c}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                {categories.map((c, i) => (
                  <option key={i} value={c === 'All Categories' ? 'all' : c}>{c}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="all">All Statuses</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing / Live</option>
                <option value="Under Verification">Under Verification</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="code">Sort by Code</option>
                <option value="totalParticipants">Sort by Candidates</option>
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

          {/* Master Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Competition Title</th>
                  <th className="p-3.5">Classification & Category</th>
                  <th className="p-3.5">Schedule & Stage</th>
                  <th className="p-3.5">Enrolled / Cap</th>
                  <th className="p-3.5">Adjudicators</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {paginatedCompetitions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-stone-600">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Trophy className="w-8 h-8 text-stone-300" />
                        <span className="text-sm font-semibold">No competitions match your active filters.</span>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedClassificationFilter('all');
                            setSelectedTypeFilter('all');
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
                  paginatedCompetitions.map((comp) => {
                    const isPublished = comp.isPublished || comp.status === 'Published';
                    return (
                      <tr key={comp.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-3.5 font-mono font-bold">
                          <span className="px-2.5 py-1 rounded-lg bg-red-50 text-[#A91F35] border border-red-200/60 font-black">
                            {comp.code}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-stone-900">{comp.title}</div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                            ID: {comp.competitionId || comp.id} • {comp.eligibility} Division
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              comp.classification === 'Stage'
                                ? 'bg-red-50 text-[#A91F35] border border-red-200'
                                : comp.classification === 'Off Stage'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {comp.classification || 'Stage'}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-stone-900">{comp.category}</span>
                              <span className="text-stone-400">•</span>
                              <span className="text-stone-500 font-medium">{comp.type}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-col gap-0.5 text-[11px]">
                            <span className="font-semibold text-stone-900">{comp.venue}</span>
                            <span className="text-stone-500">{comp.date} • {comp.time}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-purple-50 text-purple-700">
                              {comp.registeredCount} / {comp.maxParticipants}
                            </span>
                            <button
                              onClick={() => handleOpenEnrollModal(comp)}
                              className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700"
                              title="Enroll Scholar"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5">
                          {comp.assignedJudgesCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {comp.assignedJudgesCount} Assigned
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Needs Judges
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={comp.status}
                            onChange={(e) => handleQuickStatusChange(comp, e.target.value)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none ${
                              isPublished
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : comp.status === 'Ongoing'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                                : comp.status === 'Registration Open'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Registration Open">Registration Open</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Under Verification">Under Verification</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenDetailsModal(comp)}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900"
                              title="Full Competition Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenCriteriaModal(comp)}
                              className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-700"
                              title="Configure Evaluation Rubric"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(comp)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-700"
                              title="Edit Competition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(comp)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-700"
                              title="Delete / Archive"
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
              Showing {competitions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, competitions.length)} of {competitions.length} events
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
      {/* TAB 3: REGISTRATION MONITORING */}
      {/* ========================================================================= */}
      {activeTab === 'registration' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Competition Registration Monitoring</h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Monitor enrolled participants, squad allocations, and capacity across all official competitions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitions.map((comp) => (
              <div key={comp.id} className="p-5 rounded-3xl border border-stone-200 bg-stone-50/50 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#A91F35] bg-red-100/60 px-2 py-0.5 rounded">
                      {comp.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                      {comp.type}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 mt-2 line-clamp-1">{comp.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{comp.venue}</p>

                  {/* Registered Participants Count Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-stone-700">Enrolled Scholars</span>
                      <span className="text-stone-900">{comp.registeredCount} / {comp.maxParticipants} slots</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#A91F35]"
                        style={{ width: `${Math.min(100, Math.round((comp.registeredCount / comp.maxParticipants) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Roster Preview */}
                  <div className="mt-3 pt-3 border-t border-stone-200/60 space-y-1.5">
                    {comp.participants?.slice(0, 3).map((pt, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] text-stone-700">
                        <span className="font-semibold truncate max-w-[150px]">{pt.name}</span>
                        <span className="font-mono text-stone-500 text-[10px]">{pt.chestNo} • {pt.teamName}</span>
                      </div>
                    ))}
                    {comp.participants?.length > 3 && (
                      <div className="text-[10px] text-stone-500 italic">
                        +{comp.participants.length - 3} more candidate(s)
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEnrollModal(comp)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white border border-stone-300 hover:border-[#A91F35] text-stone-800 text-xs font-bold transition-all"
                  >
                    + Enroll Scholar
                  </button>
                  <button
                    onClick={() => handleOpenDetailsModal(comp)}
                    className="py-1.5 px-3 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all"
                  >
                    View Roster
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ADJUDICATOR & RUBRIC SYNC */}
      {/* ========================================================================= */}
      {activeTab === 'judges' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Adjudicator Panel & Evaluation Rubrics</h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Verify judge assignments and configure 100-mark evaluation rubrics synchronized with the Judge Portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitions.map((comp) => (
              <div key={comp.id} className="p-5 rounded-3xl border border-stone-200 bg-stone-50/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#A91F35] bg-red-100/60 px-2 py-0.5 rounded">
                      {comp.code}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-1">{comp.title}</h3>
                    <p className="text-xs text-stone-500">{comp.category} • {comp.venue}</p>
                  </div>
                  <button
                    onClick={() => handleOpenCriteriaModal(comp)}
                    className="p-2 rounded-xl bg-white border border-stone-200 hover:border-[#A91F35] text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-700" />
                    Configure Rubric
                  </button>
                </div>

                {/* Assigned Judges List */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Adjudication Panel ({comp.assignedJudgesCount} Judges)
                  </div>
                  {comp.assignedJudgesCount === 0 ? (
                    <div className="text-xs text-amber-700 flex items-center gap-2 font-semibold">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>No judges assigned yet. Please assign in Judge Management module.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {comp.assignedJudges?.map((j, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-stone-800">
                          <span className="font-bold">{j.name}</span>
                          <span className="text-[10px] text-stone-500">{j.designation || 'Official Adjudicator'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rubric Preview */}
                <div className="text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Evaluation Rubric (100 Marks Max)</div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {comp.evaluationCriteria?.map((crit, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 text-[10px] font-bold border border-purple-200/60">
                        {crit.name}: {crit.maxMarks}m
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: REPORTS & EXPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Official Competition Reports & Schedules</h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Printable schedules, participant allocations, and administrative records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Master Competition Schedule',
                desc: `Complete schedule of all ${competitions.length} competitions across all 5 festival stages with dates and times.`,
                action: handleExportCSV,
                btnLabel: 'Download Full CSV'
              },
              {
                title: 'Printable Competition Call Sheet',
                desc: 'Official printable running order of all stages, venues, and registered participants.',
                action: () => window.print(),
                btnLabel: 'Print Stage Call Sheet'
              },
              {
                title: 'Adjudicator Assignment Matrix',
                desc: 'Complete overview of assigned judges across all official festival competitions.',
                action: () => setActiveTab('judges'),
                btnLabel: 'View Judge Matrix'
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
      {/* MODAL 1: ADD NEW COMPETITION */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Create New Competition</h3>
                  <p className="text-xs text-stone-600">Configure parameters for the festival master schedule</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleAddSubmit} className="mt-6 space-y-4 text-xs font-semibold">
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                <label className="block text-amber-900 mb-1 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                    Load from Official Festival Charter (83 Master Items)
                  </span>
                  <span className="text-[10px] text-amber-700 font-normal">Optional Preset</span>
                </label>
                <select
                  onChange={(e) => {
                    const selId = e.target.value;
                    if (!selId) return;
                    const cp = charterProgrammes.find(p => p.id === selId);
                    if (cp) {
                      setFormData(prev => ({
                        ...prev,
                        title: cp.name,
                        code: cp.code,
                        classification: cp.classification,
                        category: cp.category,
                        type: cp.type,
                        description: `Official Festival Charter ${cp.category} ${cp.classification} programme: ${cp.name}.`
                      }));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                >
                  <option value="">-- Choose Official Programme Preset --</option>
                  <optgroup label="Stage Programmes (40)">
                    {charterProgrammes.filter(p => p.classification === 'Stage').map(p => (
                      <option key={p.id} value={p.id}>[{p.category}] {p.name} ({p.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Off Stage Programmes (32)">
                    {charterProgrammes.filter(p => p.classification === 'Off Stage').map(p => (
                      <option key={p.id} value={p.id}>[{p.category}] {p.name} ({p.code})</option>
                    ))}
                  </optgroup>
                  <optgroup label="General Programmes (11)">
                    {charterProgrammes.filter(p => p.classification === 'General').map(p => (
                      <option key={p.id} value={p.id}>[General] {p.name} ({p.code})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Competition Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classical Arabic Munadarah"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Code (Auto if blank)</label>
                  <input
                    type="text"
                    placeholder="e.g. STG-SR-101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Official Classification *</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => {
                      const nextClass = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        classification: nextClass,
                        category: nextClass === 'General' ? 'General' : (prev.category === 'General' ? 'Senior' : prev.category),
                        type: nextClass === 'General' ? 'Group' : prev.type
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  >
                    <option value="Stage">Stage Programme</option>
                    <option value="Off Stage">Off Stage Programme</option>
                    <option value="General">General Programme (Team)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Student Category *</label>
                  {formData.classification === 'General' ? (
                    <input
                      type="text"
                      disabled
                      value="General (Team Based)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-xs font-bold"
                    />
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                    >
                      <option value="Senior">Senior</option>
                      <option value="Junior">Junior</option>
                      <option value="Sub Junior">Sub Junior</option>
                      <option value="Minor">Minor</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Competition Type *</label>
                  {formData.classification === 'General' ? (
                    <input
                      type="text"
                      disabled
                      value="General Team (10-8-6 Pts)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-xs font-bold"
                    />
                  ) : (
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                    >
                      <option value="Individual">Individual (3-2-1 Pts)</option>
                      <option value="Group">Group / Team (10-8-6 Pts)</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Stage / Venue *</label>
                <select
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                >
                  {venues.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Date *</label>
                  <select
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  >
                    <option value="Dec 21, 2026">Dec 21, 2026 (Day 01)</option>
                    <option value="Dec 22, 2026">Dec 22, 2026 (Day 02)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Start Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Rules & Timing Synopsis</label>
                <textarea
                  rows="2"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-md"
                >
                  Create Competition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT COMPETITION */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Edit Competition Parameters</h3>
                  <p className="text-xs text-stone-600">Update event details, timing, and rules</p>
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

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-700 mb-1">Competition Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Official Classification *</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => {
                      const nextClass = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        classification: nextClass,
                        category: nextClass === 'General' ? 'General' : (prev.category === 'General' ? 'Senior' : prev.category),
                        type: nextClass === 'General' ? 'Group' : prev.type
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  >
                    <option value="Stage">Stage Programme</option>
                    <option value="Off Stage">Off Stage Programme</option>
                    <option value="General">General Programme (Team)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Student Category *</label>
                  {formData.classification === 'General' ? (
                    <input
                      type="text"
                      disabled
                      value="General (Team Based)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-xs font-bold"
                    />
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                    >
                      <option value="Senior">Senior</option>
                      <option value="Junior">Junior</option>
                      <option value="Sub Junior">Sub Junior</option>
                      <option value="Minor">Minor</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Competition Type *</label>
                  {formData.classification === 'General' ? (
                    <input
                      type="text"
                      disabled
                      value="General Team (10-8-6 Pts)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-xs font-bold"
                    />
                  ) : (
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                    >
                      <option value="Individual">Individual (3-2-1 Pts)</option>
                      <option value="Group">Group / Team (10-8-6 Pts)</option>
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Adjudication Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Registration Open">Registration Open</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Under Verification">Under Verification</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Stage / Venue</label>
                <select
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                >
                  {venues.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Date</label>
                  <select
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  >
                    <option value="Dec 21, 2026">Dec 21, 2026</option>
                    <option value="Dec 22, 2026">Dec 22, 2026</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
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
                  Save Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: COMPETITION DETAILS (5 Sub-Tabs) */}
      {/* ========================================================================= */}
      {isDetailsModalOpen && activeCompDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-red-100 text-[#A91F35] px-2.5 py-1 rounded-lg">
                    {activeCompDetails.code}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900">{activeCompDetails.title}</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  ID: {activeCompDetails.competitionId || activeCompDetails.id} • {activeCompDetails.category} • {activeCompDetails.venue}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'basic', label: 'Basic Info' },
                { id: 'participants', label: `Participants (${activeCompDetails.totalParticipants})` },
                { id: 'judges', label: `Adjudicators (${activeCompDetails.assignedJudges?.length || 0})` },
                { id: 'criteria', label: 'Evaluation Rubric' },
                { id: 'results', label: 'Published Laurels' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setDetailsSubTab(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    detailsSubTab === sub.id
                      ? 'bg-[#A91F35] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Basic Info */}
            {detailsSubTab === 'basic' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Type</span>
                    <div className="font-bold text-stone-900 mt-1">{activeCompDetails.type} Event</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Division</span>
                    <div className="font-bold text-stone-900 mt-1">{activeCompDetails.eligibility}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Date & Time</span>
                    <div className="font-bold text-stone-900 mt-1">{activeCompDetails.date} {activeCompDetails.time}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Status</span>
                    <div className="font-bold text-emerald-700 mt-1">{activeCompDetails.status}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900">Description</div>
                  <p className="text-stone-600 leading-relaxed">{activeCompDetails.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900">Rules & Instructions</div>
                  <p className="text-stone-600 leading-relaxed">{activeCompDetails.rules}</p>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Participants */}
            {detailsSubTab === 'participants' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-800">
                    Enrolled Scholars: {activeCompDetails.participants?.length || 0} / {activeCompDetails.maxParticipants}
                  </div>
                  <button
                    onClick={() => handleOpenEnrollModal(activeCompDetails)}
                    className="px-3 py-1.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Enroll Participant
                  </button>
                </div>

                {activeCompDetails.participants?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                    No participants enrolled in this event yet.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-stone-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 font-bold uppercase text-[10px] text-stone-600">
                        <tr>
                          <th className="p-3">Chest No</th>
                          <th className="p-3">Candidate Name</th>
                          <th className="p-3">Team Squad</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {activeCompDetails.participants.map((pt, i) => (
                          <tr key={i} className="hover:bg-stone-50">
                            <td className="p-3 font-mono font-bold text-[#A91F35]">{pt.chestNo}</td>
                            <td className="p-3 font-semibold text-stone-900">
                              <div>{pt.name}</div>
                              <div className="text-[10px] text-stone-400 font-mono">ID: {pt.studentId}</div>
                            </td>
                            <td className="p-3 font-medium text-stone-700">{pt.teamName}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRemoveParticipant(activeCompDetails, pt.studentId)}
                                className="p-1 rounded text-red-600 hover:bg-red-50"
                                title="Remove Candidate"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 3: Judges */}
            {detailsSubTab === 'judges' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-stone-800">
                  Assigned Adjudication Panel ({activeCompDetails.assignedJudges?.length || 0})
                </div>

                {activeCompDetails.assignedJudges?.length === 0 ? (
                  <div className="p-6 text-center text-xs text-amber-700 bg-amber-50 rounded-2xl border border-amber-200">
                    No judges currently assigned to this competition. Please configure in Judge Management.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCompDetails.assignedJudges.map((j, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#A91F35] text-white flex items-center justify-center font-bold text-xs">
                          {j.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-xs">{j.name}</div>
                          <div className="text-[10px] text-stone-500">{j.designation} • {j.institution}</div>
                          <div className="text-[9px] font-mono text-[#A91F35] mt-0.5">ID: {j.id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 4: Rubric */}
            {detailsSubTab === 'criteria' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-800">
                    Evaluation Criteria (Total: {activeCompDetails.totalMaxMarks || 100} Marks)
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleOpenCriteriaModal(activeCompDetails);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-bold"
                  >
                    Edit Rubric
                  </button>
                </div>

                <div className="space-y-2">
                  {activeCompDetails.evaluationCriteria?.map((crit, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{crit.name}</span>
                      <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 font-black font-mono">
                        {crit.maxMarks} Marks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 5: Results */}
            {detailsSubTab === 'results' && (
              <div className="space-y-4">
                {activeCompDetails.resultPoster ? (
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <Trophy className="w-4 h-4 text-amber-700" />
                      <span>Official Published Results Available</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {activeCompDetails.resultPoster.firstPrize && (
                        <div className="flex justify-between p-2 rounded-xl bg-white border border-amber-200">
                          <span className="font-bold text-stone-900">🥇 1st: {activeCompDetails.resultPoster.firstPrize.name} ({activeCompDetails.resultPoster.firstPrize.chestNo})</span>
                          <span className="font-bold text-amber-900">{activeCompDetails.resultPoster.firstPrize.teamName} • {activeCompDetails.resultPoster.firstPrize.score}</span>
                        </div>
                      )}
                      {activeCompDetails.resultPoster.secondPrize && (
                        <div className="flex justify-between p-2 rounded-xl bg-white border border-amber-200">
                          <span className="font-bold text-stone-900">🥈 2nd: {activeCompDetails.resultPoster.secondPrize.name} ({activeCompDetails.resultPoster.secondPrize.chestNo})</span>
                          <span className="font-bold text-amber-900">{activeCompDetails.resultPoster.secondPrize.teamName} • {activeCompDetails.resultPoster.secondPrize.score}</span>
                        </div>
                      )}
                      {activeCompDetails.resultPoster.thirdPrize && (
                        <div className="flex justify-between p-2 rounded-xl bg-white border border-amber-200">
                          <span className="font-bold text-stone-900">🥉 3rd: {activeCompDetails.resultPoster.thirdPrize.name} ({activeCompDetails.resultPoster.thirdPrize.chestNo})</span>
                          <span className="font-bold text-amber-900">{activeCompDetails.resultPoster.thirdPrize.teamName} • {activeCompDetails.resultPoster.thirdPrize.score}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                    Results are still under adjudication or tabulating.
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex items-center justify-end border-t border-stone-100">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ENROLL PARTICIPANT */}
      {/* ========================================================================= */}
      {isEnrollModalOpen && activeComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Enroll Candidate</h3>
                <p className="text-xs text-stone-600 line-clamp-1">{activeComp.title || activeComp.competitionTitle}</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-700 mb-1">Select Candidate *</label>
                <select
                  required
                  value={enrollStudentId}
                  onChange={(e) => setEnrollStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                >
                  <option value="">-- Choose Candidate from Registry --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.chestNo}) - {s.teamName} [{s.classCategory}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div>• Candidate must not already be enrolled in this event.</div>
                <div>• Capacity limit: {activeComp.registeredCount || 0} / {activeComp.maxParticipants || 24} spots taken.</div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-md"
                >
                  Confirm Enrolment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CONFIGURE EVALUATION CRITERIA */}
      {/* ========================================================================= */}
      {isCriteriaModalOpen && activeComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">Configure Rubric Criteria</h3>
                <p className="text-xs text-stone-600">{activeComp.title || activeComp.competitionTitle}</p>
              </div>
              <button
                onClick={() => setIsCriteriaModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCriteriaSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-3">
                {criteriaList.map((crit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Criterion Name"
                      value={crit.name}
                      onChange={(e) => {
                        const copy = [...criteriaList];
                        copy[idx].name = e.target.value;
                        setCriteriaList(copy);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                    <div className="flex items-center gap-1 w-24">
                      <input
                        type="number"
                        required
                        min="1"
                        max="100"
                        value={crit.maxMarks}
                        onChange={(e) => {
                          const copy = [...criteriaList];
                          copy[idx].maxMarks = parseInt(e.target.value, 10) || 0;
                          setCriteriaList(copy);
                        }}
                        className="w-16 px-2 py-2 rounded-xl border border-stone-200 text-xs text-center font-bold"
                      />
                      <span className="text-stone-500 font-mono">pts</span>
                    </div>
                    {criteriaList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCriteriaList(criteriaList.filter((_, i) => i !== idx))}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCriteriaList([...criteriaList, { id: `c${criteriaList.length + 1}`, name: 'New Criterion', maxMarks: 10 }])}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                >
                  + Add Criterion
                </button>
                <div className="text-xs font-bold">
                  Total Marks: <span className={criteriaList.reduce((a, b) => a + (b.maxMarks || 0), 0) === 100 ? 'text-emerald-700' : 'text-red-600'}>
                    {criteriaList.reduce((a, b) => a + (b.maxMarks || 0), 0)} / 100
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCriteriaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627]"
                >
                  Save Rubric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && activeComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Delete Competition</h3>
                <p className="text-xs text-stone-600">This modifies the festival master schedule</p>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-stone-900">{activeComp.title || activeComp.competitionTitle}</span> (<span className="font-mono font-bold text-[#A91F35]">{activeComp.code}</span>)?
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
                  <span className="text-[11px] font-bold text-red-800">Force deletion & unlink associated records</span>
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
    </div>
  );
}
