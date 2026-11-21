import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Users, CheckCircle2, AlertTriangle, AlertCircle,
  X, Search, Filter, Plus, Edit2, Trash2, Eye, Download, RefreshCw,
  Sparkles, ShieldCheck, Check, Layers, FileText, ChevronRight, ChevronLeft,
  ArrowRight, Flag, Mic, Award, BookOpen, Palette, Music, MoreVertical,
  CalendarDays, LayoutGrid, ListFilter, SlidersHorizontal, ArrowUpRight,
  Info, Bell, Play, CheckCheck, Ban, CornerUpRight
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

const STATUS_CONFIG = {
  Scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  Upcoming: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  Ongoing: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', animate: true },
  Completed: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300', dot: 'bg-stone-500' },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  Rescheduled: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' }
};

const FESTIVAL_DATES = [
  { value: 'Dec 21, 2026', label: 'Day 01 · Monday, Dec 21, 2026', short: 'Day 01 (Dec 21)' },
  { value: 'Dec 22, 2026', label: 'Day 02 · Tuesday, Dec 22, 2026', short: 'Day 02 (Dec 22)' },
  { value: 'Dec 23, 2026', label: 'Day 03 · Wednesday, Dec 23, 2026', short: 'Day 03 (Dec 23)' }
];

const STANDARD_TIMES = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
];

export default function ScheduleModule({ activeSection }) {
  // Navigation tabs: 'dashboard' | 'daily' | 'weekly' | 'calendar' | 'timeline' | 'directory'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('daily')) return 'daily';
      if (hash.includes('weekly') || hash.includes('matrix')) return 'weekly';
      if (hash.includes('calendar')) return 'calendar';
      if (hash.includes('timeline') || hash.includes('stage')) return 'timeline';
      if (hash.includes('directory') || hash.includes('list')) return 'directory';
    }
    return 'dashboard';
  });

  // Daily view sub-filter (day1 vs day2)
  const [selectedDayTab, setSelectedDayTab] = useState('Dec 21, 2026');

  // Store data state
  const [schedules, setSchedules] = useState(() => festivalStore.getProgrammeSchedules());
  const [stages, setStages] = useState(() => festivalStore.getProgrammeStages());
  const [programmes, setProgrammes] = useState(() => festivalStore.getProgrammes());
  const [guests, setGuests] = useState(() => festivalStore.getProgrammeGuests());
  const [stats, setStats] = useState(() => festivalStore.getScheduleDashboardStats());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('time');

  // Modals & Drawers state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [activeDetailSchedule, setActiveDetailSchedule] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [scheduleToCancel, setScheduleToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // Form state for Create / Edit Schedule Entry
  const [formData, setFormData] = useState({
    programmeId: '',
    date: 'Dec 21, 2026',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    stage: 'Cordova Grand Stage (Stage 01)',
    stageId: 'STG-01',
    coordinatorName: '',
    coordinatorPhone: '',
    assignedGuestIds: [],
    notes: '',
    status: 'Scheduled',
    isPublished: true,
    overrideConflicts: false
  });
  const [formConflicts, setFormConflicts] = useState({ hasConflicts: false, hasErrors: false, conflicts: [] });
  const [formError, setFormError] = useState('');

  // Subscribe to store updates
  useEffect(() => {
    if (typeof festivalStore.subscribe === 'function') {
      const unsubscribe = festivalStore.subscribe(() => {
        refreshData();
      });
      return unsubscribe;
    }
  }, []);

  const refreshData = () => {
    setSchedules(festivalStore.getProgrammeSchedules());
    setStages(festivalStore.getProgrammeStages());
    setProgrammes(festivalStore.getProgrammes());
    setGuests(festivalStore.getProgrammeGuests());
    setStats(festivalStore.getScheduleDashboardStats());
  };

  // Run live conflict detection on form changes
  useEffect(() => {
    if (!isAddEditModalOpen) return;
    try {
      const result = festivalStore.detectScheduleConflicts(formData, editingSchedule ? editingSchedule.id : null);
      setFormConflicts(result);
    } catch (e) {
      console.warn('Conflict detection error:', e);
    }
  }, [formData, isAddEditModalOpen, editingSchedule]);

  // Open modal to add schedule
  const handleOpenAddModal = (presetProgrammeId = null) => {
    setEditingSchedule(null);
    setFormError('');
    const defaultProg = presetProgrammeId
      ? programmes.find(p => p.id === presetProgrammeId)
      : programmes.find(p => !schedules.some(s => s.programmeId === p.id && s.status !== 'Cancelled')) || programmes[0];

    const defaultGuestIds = defaultProg && defaultProg.assignedGuestIds
      ? defaultProg.assignedGuestIds
      : (defaultProg && defaultProg.guestId ? [defaultProg.guestId] : []);

    setFormData({
      programmeId: defaultProg ? defaultProg.id : '',
      date: (defaultProg && defaultProg.date) || 'Dec 21, 2026',
      startTime: (defaultProg && defaultProg.startTime) || '09:00 AM',
      endTime: (defaultProg && defaultProg.endTime) || '11:00 AM',
      stage: (defaultProg && defaultProg.venue) || 'Cordova Grand Stage (Stage 01)',
      stageId: 'STG-01',
      coordinatorName: (defaultProg && defaultProg.coordinatorName) || '',
      coordinatorPhone: (defaultProg && defaultProg.coordinatorPhone) || '',
      assignedGuestIds: defaultGuestIds,
      notes: '',
      status: 'Scheduled',
      isPublished: true,
      overrideConflicts: false
    });
    setIsAddEditModalOpen(true);
  };

  // Open modal to edit schedule
  const handleOpenEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setFormError('');
    setFormData({
      programmeId: schedule.programmeId,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      stage: schedule.stage,
      stageId: schedule.stageId || 'STG-01',
      coordinatorName: schedule.coordinatorName || '',
      coordinatorPhone: schedule.coordinatorPhone || '',
      assignedGuestIds: schedule.assignedGuestIds || [],
      notes: schedule.notes || '',
      status: schedule.status || 'Scheduled',
      isPublished: schedule.isPublished !== undefined ? schedule.isPublished : true,
      overrideConflicts: false
    });
    setIsAddEditModalOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.programmeId) {
      setFormError('Please select a programme.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setFormError('Please provide both Start Time and End Time.');
      return;
    }

    try {
      if (editingSchedule) {
        festivalStore.updateProgrammeSchedule(editingSchedule.id, formData, {
          overrideConflicts: formData.overrideConflicts,
          adminUser: 'Super Admin'
        });
      } else {
        festivalStore.addProgrammeSchedule(formData, {
          overrideConflicts: formData.overrideConflicts,
          adminUser: 'Super Admin'
        });
      }
      refreshData();
      setIsAddEditModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save schedule entry.');
    }
  };

  // Handle Complete session
  const handleCompleteSession = (scheduleId) => {
    try {
      festivalStore.completeProgrammeSchedule(scheduleId, 'Super Admin');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Cancel session
  const handleConfirmCancel = () => {
    if (!scheduleToCancel) return;
    try {
      festivalStore.cancelProgrammeSchedule(scheduleToCancel.id, cancelReason, 'Super Admin');
      refreshData();
      setIsCancelModalOpen(false);
      setScheduleToCancel(null);
      setCancelReason('');
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Delete session
  const handleConfirmDelete = () => {
    if (!scheduleToDelete) return;
    try {
      festivalStore.deleteProgrammeSchedule(scheduleToDelete.id, { force: true, adminUser: 'Super Admin' });
      refreshData();
      setIsDeleteConfirmOpen(false);
      setScheduleToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Export schedule to CSV
  const handleExportCSV = () => {
    const headers = ['Schedule ID', 'Programme Code', 'Programme Title', 'Category', 'Date', 'Start Time', 'End Time', 'Time Range', 'Stage / Venue', 'Assigned Guests', 'Status', 'Published'];
    const rows = schedules.map(s => [
      `"${s.id}"`,
      `"${s.programmeCode || ''}"`,
      `"${(s.programmeTitle || '').replace(/"/g, '""')}"`,
      `"${s.category || ''}"`,
      `"${s.date || ''}"`,
      `"${s.startTime || ''}"`,
      `"${s.endTime || ''}"`,
      `"${s.timeRange || ''}"`,
      `"${(s.stage || '').replace(/"/g, '""')}"`,
      `"${(s.guests || []).map(g => g.name).join('; ')}"`,
      `"${s.status || ''}"`,
      `"${s.isPublished ? 'Yes' : 'No'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_fest_2k26_master_schedule_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered schedules for directory & list view
  const filteredSchedules = useMemo(() => {
    return festivalStore.getProgrammeSchedules({
      date: selectedDateFilter,
      stage: selectedStageFilter,
      category: selectedCategoryFilter,
      status: selectedStatusFilter,
      query: searchQuery,
      sortBy
    });
  }, [schedules, selectedDateFilter, selectedStageFilter, selectedCategoryFilter, selectedStatusFilter, searchQuery, sortBy]);

  // Day-wise grouped schedules
  const day1Schedules = useMemo(() => {
    return schedules.filter(s => String(s.date).includes('21'));
  }, [schedules]);

  const day2Schedules = useMemo(() => {
    return schedules.filter(s => String(s.date).includes('22'));
  }, [schedules]);

  const day3Schedules = useMemo(() => {
    return schedules.filter(s => String(s.date).includes('23'));
  }, [schedules]);

  // Unscheduled programmes list
  const unscheduledProgrammesList = useMemo(() => {
    const scheduledIds = new Set(schedules.filter(s => s.status !== 'Cancelled').map(s => s.programmeId));
    return programmes.filter(p => !scheduledIds.has(p.id) && !p.isArchived);
  }, [programmes, schedules]);

  // Active conflicts list across entire schedule
  const globalConflicts = useMemo(() => {
    const list = [];
    schedules.forEach(s => {
      const check = festivalStore.detectScheduleConflicts(s, s.id);
      if (check.hasErrors) {
        list.push({ schedule: s, conflicts: check.conflicts.filter(c => c.severity === 'error') });
      }
    });
    return list;
  }, [schedules]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER WITH BRAND COLORS & SUB-NAV                                */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#A91F35] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-[#E6A916]/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-sm border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>OFFICIAL MASTER FESTIVAL SCHEDULE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
              Programme Schedule Control
            </h2>
            <p className="text-sm text-stone-200 max-w-2xl font-normal leading-relaxed">
              Master timeline administration, stage & arena allocations, live conflict detection radar, and public schedule broadcasting for Dalenzia Fest 2K26.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenAddModal()}
              className="px-5 py-2.5 rounded-2xl bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Schedule Entry</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              title="Export complete schedule to CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={refreshData}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Refresh Schedule Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Operational Sub-Tabs */}
        <div className="relative z-10 flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Schedule Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily View ({schedules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Full Festival Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Stage Timelines ({stages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Hourly Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Directory Table</span>
          </button>
        </div>
      </div>

      {/* Global Conflict Warning Banner if any conflicts exist */}
      {globalConflicts.length > 0 && (
        <div className="rounded-2xl bg-rose-50 border border-rose-300 p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-extrabold text-rose-800 text-sm">
              Schedule Conflict Detected ({globalConflicts.length} sessions affected)
            </h4>
            <p className="text-rose-700 mt-0.5">
              Overlapping venue bookings or double-booked guest commitments were detected in the schedule:
            </p>
            <ul className="list-disc list-inside mt-1.5 space-y-1 text-rose-800 font-medium">
              {globalConflicts.map(({ schedule, conflicts }) => (
                <li key={schedule.id}>
                  <strong>{schedule.programmeTitle} ({schedule.timeRange}, {schedule.stage}):</strong>{' '}
                  {conflicts.map(c => c.message).join('; ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB 1: SCHEDULE RADAR / DASHBOARD OVERVIEW                             */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 6 Central KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">TOTAL SESSIONS</span>
                <div className="w-8 h-8 rounded-xl bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-serif">
                  {stats.totalScheduledSessions}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Master Timeline</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">DAY 01 (DEC 21)</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-amber-800 font-serif">
                  {stats.todayProgrammes}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Inaugural & Contests</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">DAY 02 (DEC 22)</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-blue-800 font-serif">
                  {stats.day2Programmes}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Finals & Valedictory</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">UPCOMING</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-purple-800 font-serif">
                  {stats.upcomingProgrammes}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Ready for Call</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">UNSCHEDULED</span>
                <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-800 font-serif">
                  {stats.unscheduledProgrammes}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">In Programme Bank</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">CONFLICTS</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  stats.conflictingScheduleEntries > 0 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {stats.conflictingScheduleEntries > 0 ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
              </div>
              <div className="mt-3">
                <span className={`text-2xl sm:text-3xl font-black font-serif ${
                  stats.conflictingScheduleEntries > 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  {stats.conflictingScheduleEntries}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">
                  {stats.conflictingScheduleEntries > 0 ? 'Overlap Warning' : 'Conflict Free'}
                </p>
              </div>
            </div>

          </div>

          {/* Two Columns: Stage Distribution + Unscheduled Programmes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Stage Allocation Breakdown (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-serif font-black text-stone-900">
                    Stage & Arena Schedule Distribution
                  </h3>
                  <p className="text-xs text-stone-500">
                    Real-time allocation across the 5 official festival venues
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1"
                >
                  <span>Open Timelines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {stats.stageDistribution.map(stage => {
                  const pct = stats.totalScheduledSessions > 0
                    ? Math.round((stage.sessionCount / stats.totalScheduledSessions) * 100)
                    : 0;
                  return (
                    <div key={stage.id} className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-stone-200/60 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-3 h-10 rounded-full flex-shrink-0"
                          style={{ backgroundColor: stage.color }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {stage.name}
                          </h4>
                          <span className="text-[10px] text-stone-500 font-medium">
                            {stage.type} • Capacity: {stage.capacity}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-extrabold text-[#A91F35]">
                          {stage.sessionCount} Sessions
                        </span>
                        <div className="text-[10px] text-stone-400 font-semibold">
                          {pct}% of festival schedule
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unscheduled Programmes Quick Bank (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="text-base font-serif font-black text-stone-900">
                      Unscheduled Programme Bank
                    </h3>
                    <p className="text-xs text-stone-500">
                      Programmes defined in management awaiting a scheduled session
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[10px] font-extrabold">
                    {unscheduledProgrammesList.length} Pending
                  </span>
                </div>

                <div className="space-y-2.5 pt-3 max-h-[320px] overflow-y-auto pr-1">
                  {unscheduledProgrammesList.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="font-bold text-stone-800">All programmes are scheduled!</p>
                      <p className="text-[11px] text-stone-500">Every active programme has an official schedule entry.</p>
                    </div>
                  ) : (
                    unscheduledProgrammesList.map(prog => (
                      <div
                        key={prog.id}
                        className="p-3 rounded-2xl bg-[#FAF7F0] border border-stone-200/60 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-stone-200/80 text-stone-700 font-mono text-[9px] font-bold">
                              {prog.code}
                            </span>
                            <span className="text-[10px] font-extrabold text-[#A91F35]">
                              {prog.category}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-stone-900 truncate mt-1">
                            {prog.title}
                          </h4>
                        </div>

                        <button
                          onClick={() => handleOpenAddModal(prog.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#A91F35] text-white hover:bg-[#8e172a] text-[11px] font-bold flex items-center gap-1 cursor-pointer flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Festival Schedule Dates:</span>
                <span className="font-bold text-[#A91F35]">21, 22, 23 DECEMBER 2026</span>
              </div>
            </div>

          </div>

          {/* Chronological Highlights from Day 1 & Day 2 */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-serif font-black text-stone-900">
                  Festival Chronological Highlights
                </h3>
                <p className="text-xs text-stone-500">
                  Keynote assemblies, ceremonial lamp lighting, championships and valedictory
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDayTab('Dec 21, 2026')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDayTab === 'Dec 21, 2026'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Day 01 (Dec 21)
                </button>
                <button
                  onClick={() => setSelectedDayTab('Dec 22, 2026')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDayTab === 'Dec 22, 2026'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Day 02 (Dec 22)
                </button>
                <button
                  onClick={() => setSelectedDayTab('Dec 23, 2026')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDayTab === 'Dec 23, 2026'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Day 03 (Dec 23)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {(selectedDayTab === 'Dec 21, 2026' ? day1Schedules : selectedDayTab === 'Dec 22, 2026' ? day2Schedules : day3Schedules).map(item => {
                const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG.Scheduled;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FAF7F0] border border-stone-200/80 hover:border-[#A91F35]/40 transition-all shadow-xs flex flex-col justify-between space-y-3 cursor-pointer group"
                    onClick={() => {
                      setActiveDetailSchedule(item);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono text-[9px] font-bold text-stone-700">
                          {item.programmeCode}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-serif font-black text-stone-900 group-hover:text-[#A91F35] transition-colors mt-2 leading-snug">
                        {item.programmeTitle}
                      </h4>
                      {item.malayalamTitle && (
                        <p className="text-[11px] font-serif text-stone-500 font-medium">
                          {item.malayalamTitle}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-stone-200/60 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-[#A91F35]" />
                        <span>{item.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600 truncate">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="truncate">{item.stage}</span>
                      </div>
                      {item.guests && item.guests.length > 0 && (
                        <div className="flex items-center gap-1.5 text-stone-700 font-medium truncate pt-1">
                          <Users className="w-3.5 h-3.5 text-[#E6A916] flex-shrink-0" />
                          <span className="truncate text-[11px]">
                            {item.guests.map(g => g.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: DAILY VIEW (CHRONOLOGICAL DAY 1 & DAY 2 WITH FILTER)            */}
      {/* ========================================================================= */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-stone-900">
                Daily Programme Schedule
              </h3>
              <p className="text-xs text-stone-500">
                Chronological timeline of official festival programmes per day
              </p>
            </div>

            {/* Day Selector Buttons */}
            <div className="inline-flex p-1 bg-[#FAF7F0] rounded-2xl border border-stone-200">
              {FESTIVAL_DATES.map(day => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDayTab(day.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDayTab === day.value
                      ? 'bg-[#A91F35] text-white shadow-xs font-extrabold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Stream */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#A91F35]/20">
            {(selectedDayTab === 'Dec 21, 2026' ? day1Schedules : selectedDayTab === 'Dec 22, 2026' ? day2Schedules : day3Schedules).map(item => {
              const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG.Scheduled;
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 sm:-left-8 top-4 w-3.5 h-3.5 rounded-full bg-[#A91F35] border-2 border-white shadow-xs" />

                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-stone-200/80 hover:border-[#A91F35]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                    
                    {/* Time & Venue Column */}
                    <div className="md:w-56 flex-shrink-0 space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-bold text-[#A91F35]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="truncate">{item.stage}</span>
                      </div>
                    </div>

                    {/* Programme Details */}
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-stone-200/70 text-stone-700 font-mono text-[9px] font-bold">
                          {item.programmeCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#E6A916]/20 text-[#A91F35] text-[10px] font-extrabold">
                          {item.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-black text-stone-900 group-hover:text-[#A91F35] transition-colors leading-tight">
                        {item.programmeTitle}
                      </h4>

                      {item.desc && (
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {item.desc}
                        </p>
                      )}

                      {/* Assigned Guests Bar */}
                      {item.guests && item.guests.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                            Dignitaries:
                          </span>
                          {item.guests.map(g => (
                            <span
                              key={g.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-800"
                            >
                              <img
                                src={g.photoUrl || '/assets/guests/portrait_muhammed_rashid.png'}
                                alt={g.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span>{g.name}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200">
                      <button
                        onClick={() => {
                          setActiveDetailSchedule(item);
                          setIsDetailDrawerOpen(true);
                        }}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#A91F35] hover:border-[#A91F35] transition-colors cursor-pointer"
                        title="View Complete Session Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer"
                        title="Edit Schedule Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {item.status !== 'Completed' && (
                        <button
                          onClick={() => handleCompleteSession(item.id)}
                          className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Mark Programme as Completed"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setScheduleToCancel(item);
                          setIsCancelModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Cancel or Reschedule Session"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: FULL FESTIVAL MATRIX (WEEKLY/SPLIT VIEW)                         */}
      {/* ========================================================================= */}
      {activeTab === 'weekly' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-stone-900">
                Full 2-Day Festival Matrix
              </h3>
              <p className="text-xs text-stone-500">
                Side-by-side comparative festival grid organized by morning, afternoon, and evening phases
              </p>
            </div>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-3.5 py-1.5 rounded-xl bg-[#A91F35] text-white hover:bg-[#8e172a] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Day 1 Column */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#A91F35]/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-serif font-black text-[#A91F35]">
                    DAY 01 · Monday, Dec 21, 2026
                  </h4>
                  <p className="text-[11px] text-stone-600">Inauguration, Scholastic Conclaves &amp; Solo Arenas</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#A91F35] text-white text-[10px] font-extrabold">
                  {day1Schedules.length} Sessions
                </span>
              </div>

              <div className="space-y-3">
                {day1Schedules.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveDetailSchedule(item);
                      setIsDetailDrawerOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#A91F35] transition-all cursor-pointer shadow-xs space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#A91F35] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timeRange}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-stone-100 text-stone-700">
                        {item.stage}
                      </span>
                    </div>

                    <h5 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#A91F35] transition-colors">
                      {item.programmeTitle}
                    </h5>

                    {item.guests && item.guests.length > 0 && (
                      <p className="text-[11px] text-stone-500 font-medium">
                        Dignitary: {item.guests.map(g => g.name).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Day 2 Column */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E6A916]/40 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-serif font-black text-amber-800">
                    DAY 02 · Tuesday, Dec 22, 2026
                  </h4>
                  <p className="text-[11px] text-stone-600">Grand Finals, Conclave Symposia &amp; Valedictory</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold">
                  {day2Schedules.length} Sessions
                </span>
              </div>

              <div className="space-y-3">
                {day2Schedules.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveDetailSchedule(item);
                      setIsDetailDrawerOpen(true);
                    }}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#A91F35] transition-all cursor-pointer shadow-xs space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#A91F35] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timeRange}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-stone-100 text-stone-700">
                        {item.stage}
                      </span>
                    </div>

                    <h5 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#A91F35] transition-colors">
                      {item.programmeTitle}
                    </h5>

                    {item.guests && item.guests.length > 0 && (
                      <p className="text-[11px] text-stone-500 font-medium">
                        Dignitary: {item.guests.map(g => g.name).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 4: STAGE TIMELINES (SWIMLANES MATRIX)                               */}
      {/* ========================================================================= */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-stone-900">
                Stage &amp; Arena Swimlane Timelines
              </h3>
              <p className="text-xs text-stone-500">
                Visual stage occupancy across all 5 official arenas
              </p>
            </div>

            {/* Day Switcher */}
            <div className="inline-flex p-1 bg-[#FAF7F0] rounded-2xl border border-stone-200">
              {FESTIVAL_DATES.map(day => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDayTab(day.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDayTab === day.value
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {/* Swimlane Rows */}
          <div className="space-y-6">
            {stages.map(stage => {
              const stageSchedules = (selectedDayTab === 'Dec 21, 2026' ? day1Schedules : selectedDayTab === 'Dec 22, 2026' ? day2Schedules : day3Schedules)
                .filter(s => s.stage && s.stage.toLowerCase().includes(stage.shortName.toLowerCase()));

              return (
                <div key={stage.id} className="p-4 rounded-2xl bg-[#FAF7F0] border border-stone-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                      <h4 className="text-sm font-serif font-black text-stone-900">
                        {stage.name}
                      </h4>
                      <span className="text-[11px] text-stone-500 font-medium">
                        ({stage.type} • Capacity: {stage.capacity})
                      </span>
                    </div>

                    <span className="text-xs font-bold text-stone-600">
                      {stageSchedules.length} Sessions Scheduled
                    </span>
                  </div>

                  {stageSchedules.length === 0 ? (
                    <div className="py-4 text-center text-xs text-stone-400 font-medium bg-white rounded-xl border border-dashed border-stone-200">
                      No sessions booked on this stage for {selectedDayTab}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stageSchedules.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setActiveDetailSchedule(item);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-[#A91F35] transition-all cursor-pointer shadow-xs space-y-1.5 group"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#A91F35] font-mono">
                              {item.timeRange}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-stone-100 text-stone-700">
                              {item.status}
                            </span>
                          </div>
                          <h5 className="text-xs font-serif font-bold text-stone-900 group-hover:text-[#A91F35] transition-colors truncate">
                            {item.programmeTitle}
                          </h5>
                          {item.guests && item.guests.length > 0 && (
                            <p className="text-[10px] text-stone-500 truncate">
                              Dignitary: {item.guests.map(g => g.name).join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 5: HOURLY CALENDAR GRID                                            */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-stone-900">
                Hourly Schedule Calendar
              </h3>
              <p className="text-xs text-stone-500">
                Time-slot breakdown from 08:00 AM to 10:00 PM for official programme blocks
              </p>
            </div>

            <div className="inline-flex p-1 bg-[#FAF7F0] rounded-2xl border border-stone-200">
              {FESTIVAL_DATES.map(day => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDayTab(day.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDayTab === day.value
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {/* Time Block Rows */}
          <div className="space-y-3">
            {[
              { slot: '08:00 AM – 10:00 AM', label: 'Early Morning Phase' },
              { slot: '10:00 AM – 01:00 PM', label: 'Mid-Day Conclave Phase' },
              { slot: '01:00 PM – 02:00 PM', label: 'Noon Recess & Luncheon' },
              { slot: '02:00 PM – 05:00 PM', label: 'Afternoon Arena Contests' },
              { slot: '05:00 PM – 07:30 PM', label: 'Evening Conclaves & Finals' },
              { slot: '07:30 PM – 10:00 PM', label: 'Night Grand Assemblies' }
            ].map(block => {
              const currentList = selectedDayTab === 'Dec 21, 2026' ? day1Schedules : selectedDayTab === 'Dec 22, 2026' ? day2Schedules : day3Schedules;
              return (
                <div key={block.slot} className="p-4 rounded-2xl bg-[#FAF7F0] border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#A91F35] font-mono">
                      {block.slot}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500">
                      {block.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {currentList.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveDetailSchedule(item);
                          setIsDetailDrawerOpen(true);
                        }}
                        className="p-3 rounded-xl bg-white border border-stone-200 hover:border-[#A91F35] transition-all cursor-pointer shadow-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-[#A91F35]">{item.timeRange}</span>
                          <span className="text-stone-500 font-medium truncate">{item.stage}</span>
                        </div>
                        <h5 className="text-xs font-serif font-bold text-stone-900 truncate">
                          {item.programmeTitle}
                        </h5>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 6: SCHEDULE DIRECTORY TABLE (SEARCH, FILTER & ACTIONS)              */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-black text-stone-900">
                Official Programme Schedule Directory
              </h3>
              <p className="text-xs text-stone-500">
                Comprehensive tabular register with multi-criteria filtering and batch administrative actions
              </p>
            </div>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 rounded-xl bg-[#A91F35] text-white hover:bg-[#8e172a] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Schedule Entry</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programme, venue, guest..."
                className="w-full bg-[#FAF7F0] pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            {/* Date filter */}
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="bg-[#FAF7F0] px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
            >
              <option value="all">All Dates (2 Days)</option>
              <option value="Dec 21, 2026">Day 01 · Dec 21, 2026</option>
              <option value="Dec 22, 2026">Day 02 · Dec 22, 2026</option>
                      <option value="Dec 23, 2026">Day 03 · Dec 23, 2026</option>
            </select>

            {/* Stage filter */}
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="bg-[#FAF7F0] px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
            >
              <option value="all">All Stages &amp; Arenas</option>
              {stages.map(st => (
                <option key={st.id} value={st.name}>{st.shortName}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-[#FAF7F0] px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
            >
              <option value="all">All Schedule Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Sort filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF7F0] px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
            >
              <option value="time">Sort by Time (Chronological)</option>
              <option value="name">Sort by Programme Name</option>
              <option value="stage">Sort by Stage Venue</option>
            </select>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Programme &amp; Code</th>
                  <th className="py-3.5 px-4">Date &amp; Time Window</th>
                  <th className="py-3.5 px-4">Stage / Arena</th>
                  <th className="py-3.5 px-4">Assigned Guests</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400 font-medium">
                      No schedule entries match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map(item => {
                    const statusStyle = STATUS_CONFIG[item.status] || STATUS_CONFIG.Scheduled;
                    return (
                      <tr key={item.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                        {/* Programme info */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[10px] font-bold text-stone-500">
                              {item.programmeCode}
                            </span>
                            <h4 className="text-xs font-serif font-black text-stone-900">
                              {item.programmeTitle}
                            </h4>
                            <span className="text-[10px] text-stone-500 font-medium">
                              {item.category}
                            </span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#A91F35] font-mono text-[11px] block">
                              {item.timeRange}
                            </span>
                            <span className="text-[10px] text-stone-500 font-semibold">
                              {item.date}
                            </span>
                          </div>
                        </td>

                        {/* Stage */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                            <span className="font-bold text-stone-800 text-xs">
                              {item.stage}
                            </span>
                          </div>
                        </td>

                        {/* Guests */}
                        <td className="py-3.5 px-4">
                          {item.guests && item.guests.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-1">
                              {item.guests.map(g => (
                                <span
                                  key={g.id}
                                  className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-bold text-stone-700"
                                >
                                  {g.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">None assigned</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setActiveDetailSchedule(item);
                                setIsDetailDrawerOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-[#A91F35] hover:bg-white transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-white transition-colors cursor-pointer"
                              title="Edit Entry"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setScheduleToCancel(item);
                                setIsCancelModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                              title="Cancel Session"
                            >
                              <Ban className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL 1: CREATE OR EDIT SCHEDULE ENTRY WITH LIVE CONFLICT DETECTION     */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#A91F35] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6A916]">
                  {editingSchedule ? 'Modify Schedule Entry' : 'Schedule Existing Programme'}
                </span>
                <h3 className="text-xl font-serif font-black text-white mt-0.5">
                  {editingSchedule ? 'Edit Programme Schedule' : 'Create New Schedule Slot'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* LIVE CONFLICT RADAR ALERT BOX */}
              {formConflicts.hasConflicts && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Live Conflict Detection Radar</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-amber-900 font-medium pl-1">
                    {formConflicts.conflicts.map((c, i) => (
                      <li key={i} className={c.severity === 'error' ? 'text-rose-700 font-bold' : 'text-amber-800'}>
                        {c.message}
                      </li>
                    ))}
                  </ul>

                  {formConflicts.hasErrors && (
                    <div className="pt-2 border-t border-amber-200 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="overrideConflicts"
                        checked={formData.overrideConflicts}
                        onChange={(e) => setFormData({ ...formData, overrideConflicts: e.target.checked })}
                        className="rounded border-stone-300 text-[#A91F35] focus:ring-[#A91F35]"
                      />
                      <label htmlFor="overrideConflicts" className="text-[11px] font-bold text-amber-900 cursor-pointer">
                        Acknowledge &amp; override conflict warnings with administrative justification
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Programme Selection (Reusing Existing Records) */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1">
                  <span>Select Existing Programme</span>
                  <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.programmeId}
                  disabled={Boolean(editingSchedule)}
                  onChange={(e) => {
                    const selected = programmes.find(p => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      programmeId: e.target.value,
                      coordinatorName: selected ? selected.coordinatorName : formData.coordinatorName,
                      coordinatorPhone: selected ? selected.coordinatorPhone : formData.coordinatorPhone,
                      assignedGuestIds: selected && selected.assignedGuestIds ? selected.assignedGuestIds : formData.assignedGuestIds
                    });
                  }}
                  className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35] disabled:bg-stone-100"
                >
                  <option value="">-- Choose Programme from Registry --</option>
                  {programmes.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.title} ({p.category})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stone-500">
                  Programmes are defined in Programme Management. Schedule assigns dates, stages and time slots.
                </p>
              </div>

              {/* Date & Stage row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1">
                    <span>Programme Date</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {FESTIVAL_DATES.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1">
                    <span>Stage / Arena Venue</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => {
                      const stObj = stages.find(s => s.name === e.target.value);
                      setFormData({
                        ...formData,
                        stage: e.target.value,
                        stageId: stObj ? stObj.id : formData.stageId
                      });
                    }}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {stages.map(st => (
                      <option key={st.id} value={st.name}>
                        {st.name} (Cap: {st.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1">
                    <span>Start Time</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {STANDARD_TIMES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-800 flex items-center gap-1">
                    <span>End Time</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    {STANDARD_TIMES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assigned Guests Multi-Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-800">
                  Assigned Dignitaries &amp; Guests (from Programme Guest Management)
                </label>
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-stone-300 max-h-36 overflow-y-auto space-y-2">
                  {guests.map(g => {
                    const isChecked = formData.assignedGuestIds.includes(g.id);
                    return (
                      <label
                        key={g.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/80 hover:bg-stone-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  assignedGuestIds: [...formData.assignedGuestIds, g.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  assignedGuestIds: formData.assignedGuestIds.filter(id => id !== g.id)
                                });
                              }
                            }}
                            className="rounded border-stone-300 text-[#A91F35] focus:ring-[#A91F35]"
                          />
                          <img
                            src={g.photoUrl || '/assets/guests/portrait_muhammed_rashid.png'}
                            alt={g.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-stone-900">{g.name}</span>
                            <span className="text-[10px] text-stone-500 block">{g.designation}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-extrabold">
                          {g.category}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Coordinator info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-800">
                    Programme Coordinator (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.coordinatorName}
                    onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                    placeholder="e.g. Sayyid Aslam Ayiroor"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-800">
                    Coordinator Phone
                  </label>
                  <input
                    type="text"
                    value={formData.coordinatorPhone}
                    onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                    placeholder="+91 98471 00000"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
              </div>

              {/* Status & Public visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-800">Schedule Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 bg-[#FAF7F0] rounded-xl border border-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded border-stone-300 text-[#A91F35] focus:ring-[#A91F35]"
                    />
                    <span className="text-xs font-bold text-stone-800">
                      Publish session to Public Website
                    </span>
                  </label>
                </div>
              </div>

              {/* Administrative Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-stone-800">
                  Internal Administrative Notes (Private)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Private instructions, setup requirements, audio-visual technical rider..."
                  rows={2}
                  className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formConflicts.hasErrors && !formData.overrideConflicts}
                  className={`px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all cursor-pointer ${
                    formConflicts.hasErrors && !formData.overrideConflicts
                      ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                      : 'bg-[#A91F35] hover:bg-[#8e172a]'
                  }`}
                >
                  {editingSchedule ? 'Save Schedule Changes' : 'Confirm & Schedule Entry'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL 2: COMPLETE SESSION DOSSIER DRAWER                                */}
      {/* ========================================================================= */}
      {isDetailDrawerOpen && activeDetailSchedule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end p-0">
          <div className="bg-white h-full w-full max-w-lg shadow-2xl flex flex-col justify-between overflow-y-auto">
            
            <div className="p-6 space-y-6">
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold text-stone-400">
                    {activeDetailSchedule.id} • {activeDetailSchedule.programmeCode}
                  </span>
                  <h3 className="text-xl font-serif font-black text-stone-900 mt-1">
                    {activeDetailSchedule.programmeTitle}
                  </h3>
                  {activeDetailSchedule.malayalamTitle && (
                    <p className="text-xs font-serif text-stone-500 font-medium">
                      {activeDetailSchedule.malayalamTitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge & Publish Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  (STATUS_CONFIG[activeDetailSchedule.status] || STATUS_CONFIG.Scheduled).bg
                } ${(STATUS_CONFIG[activeDetailSchedule.status] || STATUS_CONFIG.Scheduled).text} ${(STATUS_CONFIG[activeDetailSchedule.status] || STATUS_CONFIG.Scheduled).border}`}>
                  {activeDetailSchedule.status}
                </span>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  activeDetailSchedule.isPublished
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  {activeDetailSchedule.isPublished ? 'Publicly Live' : 'Hidden from Public'}
                </span>
              </div>

              {/* Session Core Info */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-semibold">Date:</span>
                  <span className="font-extrabold text-stone-900">{activeDetailSchedule.date}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-semibold">Time Window:</span>
                  <span className="font-extrabold text-[#A91F35] font-mono">{activeDetailSchedule.timeRange}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-semibold">Stage / Venue:</span>
                  <span className="font-extrabold text-stone-900">{activeDetailSchedule.stage}</span>
                </div>
                {activeDetailSchedule.coordinatorName && (
                  <div className="flex items-center justify-between text-xs border-t border-stone-200/60 pt-2">
                    <span className="text-stone-500 font-semibold">Coordinator:</span>
                    <span className="font-bold text-stone-800">
                      {activeDetailSchedule.coordinatorName}{' '}
                      {activeDetailSchedule.coordinatorPhone && `(${activeDetailSchedule.coordinatorPhone})`}
                    </span>
                  </div>
                )}
              </div>

              {/* Dignitaries in session */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider">
                  Assigned Dignitaries &amp; Keynotes
                </h4>
                {activeDetailSchedule.guests && activeDetailSchedule.guests.length > 0 ? (
                  <div className="space-y-2">
                    {activeDetailSchedule.guests.map(g => (
                      <div key={g.id} className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={g.photoUrl || '/assets/guests/portrait_muhammed_rashid.png'}
                            alt={g.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <h5 className="text-xs font-bold text-stone-900">{g.name}</h5>
                            <span className="text-[10px] text-stone-500">{g.designation}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold">
                          {g.category}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">No dignitaries assigned to this slot.</p>
                )}
              </div>

              {/* Administrative Notes */}
              {activeDetailSchedule.notes && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <h4 className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider">
                    Internal Secretarial Notes
                  </h4>
                  <p className="text-xs text-stone-600 whitespace-pre-wrap">
                    {activeDetailSchedule.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Actions */}
            <div className="p-6 border-t border-stone-200 bg-[#FAF7F0] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleOpenEditModal(activeDetailSchedule);
                  setIsDetailDrawerOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:text-[#A91F35] font-bold text-xs transition-colors cursor-pointer"
              >
                Edit Entry
              </button>

              <div className="flex items-center gap-2">
                {activeDetailSchedule.status !== 'Completed' && (
                  <button
                    onClick={() => {
                      handleCompleteSession(activeDetailSchedule.id);
                      setIsDetailDrawerOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Mark Completed
                  </button>
                )}
                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#A91F35] hover:bg-[#8e172a] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL 3: CANCEL OR RESCHEDULE CONFIRMATION DIALOG                      */}
      {/* ========================================================================= */}
      {isCancelModalOpen && scheduleToCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ban className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-serif font-black text-stone-900">
                Cancel Programme Session?
              </h3>
              <p className="text-xs text-stone-500">
                You are about to cancel <strong>{scheduleToCancel.programmeTitle}</strong> on {scheduleToCancel.date} ({scheduleToCancel.timeRange}).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Reason for Cancellation</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Inclement weather, dignitary rescheduled, or moved to another stage..."
                rows={3}
                className="w-full bg-[#FAF7F0] p-3 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setScheduleToCancel(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
