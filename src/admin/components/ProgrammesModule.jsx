import React, { useState, useMemo } from 'react';
import {
  Calendar, Clock, MapPin, Users, Award, Tag, Search, Filter,
  Plus, Edit2, Trash2, Eye, CheckCircle2, AlertCircle, X, Download,
  ChevronRight, RefreshCw, Sparkles, AlertTriangle, ShieldCheck,
  Check, Layers, FileText, ArrowUpDown, ExternalLink, UserCheck,
  Radio, Globe, Compass, Grid, List
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

const OFFICIAL_VENUES = [
  'Cordova Grand Stage (Stage 01)',
  'Al-Farabi Heritage Hall (Stage 02)',
  'Ibn Khaldun Academic Hall (Stage 03)',
  'Media Studio Preview Room',
  'Open Amphitheatre'
];

const FESTIVAL_DATES = [
  { label: 'Day 01 · Dec 21, 2026', value: 'Dec 21, 2026' },
  { label: 'Day 02 · Dec 22, 2026', value: 'Dec 22, 2026' },
  { label: 'Day 03 · Dec 23, 2026', value: 'Dec 23, 2026' }
];

const STATUS_CONFIG = {
  Scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  Upcoming: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  Ongoing: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', pulse: true },
  Completed: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300', dot: 'bg-stone-500' },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  Draft: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' }
};

export default function ProgrammesModule({ activeSection }) {
  // Navigation tabs: 'dashboard' | 'directory' | 'categories' | 'stages' | 'reports'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('categories') || hash.includes('category')) return 'categories';
      if (hash.includes('stages') || hash.includes('venues')) return 'stages';
      if (hash.includes('reports') || hash.includes('schedule')) return 'reports';
      if (hash.includes('directory') || hash.includes('list')) return 'directory';
    }
    return 'dashboard';
  });

  // Store state
  const [programmes, setProgrammes] = useState(() => festivalStore.getProgrammes());
  const [categories, setCategories] = useState(() => festivalStore.getProgrammeCategories());
  const [stats, setStats] = useState(() => festivalStore.getProgrammeDashboardStats());
  const [guests, setGuests] = useState(() => festivalStore.getProgrammeGuestsList());
  const [competitions, setCompetitions] = useState(() => festivalStore.getAvailableCompetitionsForProgramme());

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [calendarDay, setCalendarDay] = useState('Dec 21, 2026');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeProgDetails, setActiveProgDetails] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [progToDelete, setProgToDelete] = useState(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState('');
  const [formError, setFormError] = useState('');

  // Form states for Add/Edit Programme
  const [progForm, setProgForm] = useState({
    title: '',
    malayalamTitle: '',
    code: '',
    category: 'Inauguration',
    description: '',
    date: 'Dec 21, 2026',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    venue: OFFICIAL_VENUES[0],
    coordinatorName: '',
    coordinatorPhone: '',
    guestId: '',
    relatedCompId: '',
    status: 'Scheduled',
    isPublished: true,
    posterUrl: ''
  });

  // Form state for Category
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    code: '',
    description: '',
    color: '#A91F35',
    isActive: true
  });

  const refreshStoreData = () => {
    setProgrammes(festivalStore.getProgrammes());
    setCategories(festivalStore.getProgrammeCategories());
    setStats(festivalStore.getProgrammeDashboardStats());
    setGuests(festivalStore.getProgrammeGuestsList());
    setCompetitions(festivalStore.getAvailableCompetitionsForProgramme());
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered Programmes
  const filteredProgrammes = useMemo(() => {
    return festivalStore.getProgrammes({
      query: searchQuery,
      category: selectedCategory,
      date: selectedDate,
      status: selectedStatus,
      sortBy
    }).filter(p => selectedVenue === 'all' || p.venue === selectedVenue);
  }, [programmes, searchQuery, selectedCategory, selectedDate, selectedStatus, selectedVenue, sortBy]);

  // Open Add Programme Modal
  const openAddModal = () => {
    setEditingProg(null);
    setFormError('');
    setProgForm({
      title: '',
      malayalamTitle: '',
      code: '',
      category: categories[0]?.name || 'Inauguration',
      description: '',
      date: 'Dec 21, 2026',
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      venue: OFFICIAL_VENUES[0],
      coordinatorName: 'Sayyid Aslam Ayiroor',
      coordinatorPhone: '+91 98471 44556',
      guestId: '',
      relatedCompId: '',
      status: 'Scheduled',
      isPublished: true,
      posterUrl: '/assets/dalenzia_fest_logo.png'
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Programme Modal
  const openEditModal = (prog) => {
    setEditingProg(prog);
    setFormError('');
    setProgForm({
      title: prog.title || '',
      malayalamTitle: prog.malayalamTitle || '',
      code: prog.code || '',
      category: prog.category || categories[0]?.name || 'Inauguration',
      description: prog.desc || prog.description || '',
      date: prog.date || 'Dec 21, 2026',
      startTime: prog.startTime || '09:00 AM',
      endTime: prog.endTime || '10:30 AM',
      venue: prog.venue || OFFICIAL_VENUES[0],
      coordinatorName: prog.coordinatorName || '',
      coordinatorPhone: prog.coordinatorPhone || '',
      guestId: prog.guestId || '',
      relatedCompId: prog.relatedCompId || '',
      status: prog.status || 'Scheduled',
      isPublished: prog.isPublished !== undefined ? prog.isPublished : true,
      posterUrl: prog.posterUrl || ''
    });
    setIsAddEditModalOpen(true);
  };

  // Handle Save Programme (Create or Update)
  const handleSaveProgramme = (e) => {
    e.preventDefault();
    setFormError('');

    if (!progForm.title.trim()) {
      setFormError('Programme title is mandatory.');
      return;
    }
    if (!progForm.date) {
      setFormError('Please select a festival date.');
      return;
    }
    if (!progForm.venue) {
      setFormError('Please assign a venue / stage.');
      return;
    }

    try {
      if (editingProg) {
        festivalStore.updateProgramme(editingProg.id, {
          title: progForm.title,
          malayalamTitle: progForm.malayalamTitle,
          category: progForm.category,
          description: progForm.description,
          date: progForm.date,
          startTime: progForm.startTime,
          endTime: progForm.endTime,
          venue: progForm.venue,
          coordinatorName: progForm.coordinatorName,
          coordinatorPhone: progForm.coordinatorPhone,
          guestId: progForm.guestId || null,
          relatedCompId: progForm.relatedCompId || null,
          status: progForm.status,
          isPublished: progForm.isPublished,
          posterUrl: progForm.posterUrl
        });
        showToast(`Programme "${progForm.title}" updated successfully!`);
      } else {
        festivalStore.addProgramme({
          title: progForm.title,
          malayalamTitle: progForm.malayalamTitle,
          code: progForm.code,
          category: progForm.category,
          description: progForm.description,
          date: progForm.date,
          startTime: progForm.startTime,
          endTime: progForm.endTime,
          venue: progForm.venue,
          coordinatorName: progForm.coordinatorName,
          coordinatorPhone: progForm.coordinatorPhone,
          guestId: progForm.guestId || null,
          relatedCompId: progForm.relatedCompId || null,
          status: progForm.status,
          isPublished: progForm.isPublished,
          posterUrl: progForm.posterUrl
        });
        showToast(`New programme "${progForm.title}" created successfully!`);
      }
      refreshStoreData();
      setIsAddEditModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    }
  };

  // Open Details Modal
  const openDetailsModal = (prog) => {
    const full = festivalStore.getProgrammeById(prog.id);
    setActiveProgDetails(full || prog);
    setIsDetailsModalOpen(true);
  };

  // Quick Status Update
  const handleQuickStatusChange = (progId, newStatus) => {
    try {
      festivalStore.updateProgrammeStatus(progId, newStatus, 'Super Admin');
      showToast(`Status changed to ${newStatus}`);
      refreshStoreData();
      if (activeProgDetails && activeProgDetails.id === progId) {
        setActiveProgDetails(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Status change failed.');
    }
  };

  // Toggle Publish
  const handleTogglePublish = (progId) => {
    try {
      const res = festivalStore.toggleProgrammePublish(progId);
      showToast(`Public visibility: ${res.programme.isPublished ? 'Published' : 'Hidden'}`);
      refreshStoreData();
    } catch (err) {
      alert(err.message || 'Publish toggle failed.');
    }
  };

  // Delete Programme
  const handleDeleteConfirm = () => {
    if (!progToDelete) return;
    try {
      festivalStore.deleteProgramme(progToDelete.id);
      showToast(`Programme "${progToDelete.title}" deleted.`);
      refreshStoreData();
      setIsDeleteModalOpen(false);
      setProgToDelete(null);
    } catch (err) {
      alert(err.message || 'Delete operation failed.');
    }
  };

  // Category Management Handlers
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      code: '',
      description: '',
      color: '#A91F35',
      isActive: true
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      code: cat.code,
      description: cat.description || '',
      color: cat.color || '#A91F35',
      isActive: cat.isActive !== undefined ? cat.isActive : true
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        festivalStore.updateProgrammeCategory(editingCategory.id, categoryForm);
        showToast(`Category "${categoryForm.name}" updated!`);
      } else {
        festivalStore.addProgrammeCategory(categoryForm);
        showToast(`New category "${categoryForm.name}" created!`);
      }
      refreshStoreData();
      setIsCategoryModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save category.');
    }
  };

  const handleDeleteCategory = (catId, catName) => {
    try {
      festivalStore.deleteProgrammeCategory(catId);
      showToast(`Category "${catName}" removed.`);
      refreshStoreData();
    } catch (err) {
      alert(err.message || 'Failed to delete category.');
    }
  };

  const handleToggleCategoryStatus = (catId) => {
    try {
      festivalStore.toggleProgrammeCategoryStatus(catId);
      refreshStoreData();
    } catch (err) {
      alert(err.message);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Programme ID', 'Code', 'Title', 'Malayalam Title', 'Category', 'Date', 'Time', 'Venue', 'Coordinator', 'Guest', 'Related Competition', 'Status', 'Published'];
    const rows = filteredProgrammes.map(p => [
      `"${p.id}"`,
      `"${p.code || ''}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.malayalamTitle || '').replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      `"${p.date || ''}"`,
      `"${p.time || ''}"`,
      `"${p.venue || ''}"`,
      `"${p.coordinatorName || ''}"`,
      `"${p.guestName || ''}"`,
      `"${p.relatedComp || ''}"`,
      `"${p.status || ''}"`,
      `"${p.isPublished ? 'Yes' : 'No'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_fest_programmes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Official Programme Schedule CSV downloaded.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1917] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-[#E6A916] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER                                                           */}
      {/* ========================================================================= */}
      <div className="bg-[#A91F35] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Moroccan background motif overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E6A916] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Central Festival Programme Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
              Programme Management Control
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
              Master schedule administration, stage timeline allocation, guest dignitary alignments, and public festival broadcast for Dalenzia Fest 2K26.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E6A916] text-[#A91F35] font-black text-xs sm:text-sm shadow-md hover:bg-amber-400 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Programme</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Schedule (CSV)</span>
            </button>

            <button
              onClick={refreshStoreData}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
              title="Refresh Programme Store"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="mt-8 pt-4 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Programme Dashboard', icon: Calendar },
            { id: 'directory', label: `All Programmes (${programmes.length})`, icon: List },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Tag },
            { id: 'stages', label: 'Stage & Venue Timelines', icon: MapPin },
            { id: 'reports', label: 'Reports & Schedule Views', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#A91F35] shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTENT: PROGRAMME DASHBOARD                                      */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Statistics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { label: 'TOTAL PROGRAMMES', value: stats.totalProgrammes, sub: 'Festival Roster', icon: Calendar, color: 'text-stone-800' },
              { label: 'UPCOMING / SCHED.', value: stats.upcomingProgrammes, sub: 'Ready for Call', icon: Clock, color: 'text-amber-600' },
              { label: 'ONGOING NOW', value: stats.ongoingProgrammes, sub: 'Live on Stage', icon: Radio, color: 'text-emerald-600', pulse: stats.ongoingProgrammes > 0 },
              { label: 'COMPLETED', value: stats.completedProgrammes, sub: 'Successfully Held', icon: CheckCircle2, color: 'text-blue-600' },
              { label: 'SCHEDULED TODAY', value: stats.scheduledToday, sub: 'Day 1 Roster', icon: MapPin, color: 'text-[#A91F35]' },
              { label: 'CANCELLED / DRAFT', value: stats.cancelledProgrammes + stats.draftProgrammes, sub: 'Inactive/Review', icon: AlertTriangle, color: 'text-stone-500' }
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold tracking-wider text-stone-500 uppercase">{kpi.label}</span>
                    <Icon className={`w-4 h-4 ${kpi.color} ${kpi.pulse ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-serif font-black text-[#1c1917]">{kpi.value}</div>
                    <div className="text-[11px] font-semibold text-stone-400 mt-0.5">{kpi.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle Row: Category Breakdown & Stage Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Distribution (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-black text-[#1c1917]">Programme Category Overview</h3>
                  <p className="text-xs text-stone-500 font-medium">Distribution across official festival programme pillars</p>
                </div>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="text-xs font-bold text-[#A91F35] hover:underline inline-flex items-center gap-1"
                >
                  Manage Categories <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {stats.categoryBreakdown.map((cat, idx) => {
                  const pct = stats.totalProgrammes > 0 ? Math.round((cat.count / stats.totalProgrammes) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                        <span>{cat.count} Events ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Venue & Stage Distribution (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">5-Stage Venue Timelines</h3>
                <p className="text-xs text-stone-500 font-medium">Programmes scheduled per official festival stage</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {stats.venueDistribution.map((ven, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-7 h-7 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#A91F35] shrink-0 font-serif font-black text-xs">
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-stone-800 truncate">{ven.venue}</div>
                        <div className="text-[10px] text-stone-500">Official Festival Arena</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-black text-stone-800 shrink-0">
                      {ven.count} {ven.count === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Schedule Queue & Calendar Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">Upcoming Master Timeline</h3>
                <p className="text-xs text-stone-500 font-medium">Next chronological festival programmes scheduled across venues</p>
              </div>

              {/* Day Switcher */}
              <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
                {FESTIVAL_DATES.map(day => (
                  <button
                    key={day.value}
                    onClick={() => setCalendarDay(day.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      calendarDay === day.value
                        ? 'bg-[#A91F35] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {programmes
                .filter(p => p.date === calendarDay && p.status !== 'Cancelled')
                .slice(0, 6)
                .map(prog => {
                  const statusSt = STATUS_CONFIG[prog.status] || STATUS_CONFIG.Scheduled;
                  return (
                    <div
                      key={prog.id}
                      onClick={() => openDetailsModal(prog)}
                      className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-[#A91F35] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-stone-100 text-stone-700">
                            {prog.code || prog.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusSt.bg} ${statusSt.text} ${statusSt.border}`}>
                            {prog.status}
                          </span>
                        </div>

                        <h4 className="text-sm font-serif font-black text-stone-900 line-clamp-1">
                          {prog.title}
                        </h4>

                        <p className="text-xs text-stone-500 line-clamp-2">
                          {prog.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 text-[11px] font-semibold text-stone-600 space-y-1">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-[#E6A916]" />
                          <span>{prog.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-500 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                          <span className="truncate">{prog.venue}</span>
                        </div>
                        {prog.guestName && (
                          <div className="flex items-center gap-1.5 text-stone-500 truncate">
                            <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{prog.guestName}</span>
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
      {/* 3. TAB CONTENT: ALL PROGRAMMES DIRECTORY                                  */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programme, code, venue, coordinator..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Categories ({categories.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Festival Dates</option>
                  <option value="Dec 21, 2026">Day 01 · Dec 21, 2026</option>
                  <option value="Dec 22, 2026">Day 02 · Dec 22, 2026</option>
                      <option value="Dec 23, 2026">Day 03 · Dec 23, 2026</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Sub-Filters / Venue filter & count */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <div className="flex items-center gap-2">
                <span>Showing <strong>{filteredProgrammes.length}</strong> of {programmes.length} programmes</span>
                {searchQuery || selectedCategory !== 'all' || selectedDate !== 'all' || selectedStatus !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedDate('all');
                      setSelectedStatus('all');
                      setSelectedVenue('all');
                    }}
                    className="text-[#A91F35] font-bold hover:underline ml-2"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-stone-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-stone-700 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="date">Date & Time</option>
                  <option value="title">Programme Name</option>
                  <option value="id">Programme ID</option>
                  <option value="venue">Venue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Directory */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-black uppercase text-stone-500 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Code / ID</th>
                    <th className="py-3.5 px-4">Programme Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Venue</th>
                    <th className="py-3.5 px-4">Assigned Guest / Session</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Public</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {filteredProgrammes.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-stone-400">
                        <Calendar className="w-10 h-10 mx-auto mb-2 text-stone-300" />
                        <div className="font-serif text-base text-stone-700 font-bold">No programmes found matching criteria</div>
                        <div className="text-xs text-stone-400">Try modifying your filters or search terms.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredProgrammes.map(prog => {
                      const statusSt = STATUS_CONFIG[prog.status] || STATUS_CONFIG.Scheduled;
                      return (
                        <tr key={prog.id} className="hover:bg-amber-50/30 transition-colors">
                          {/* Code */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                              {prog.code || prog.id}
                            </span>
                          </td>

                          {/* Title */}
                          <td className="py-3.5 px-4 min-w-[200px]">
                            <button
                              onClick={() => openDetailsModal(prog)}
                              className="text-left font-serif font-black text-stone-900 hover:text-[#A91F35] transition-colors block text-sm"
                            >
                              {prog.title}
                            </button>
                            {prog.malayalamTitle && (
                              <div className="text-[11px] font-normal text-stone-400">
                                {prog.malayalamTitle}
                              </div>
                            )}
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
                              <Tag className="w-3 h-3 text-[#E6A916]" />
                              {prog.category}
                            </span>
                          </td>

                          {/* Date & Time */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-bold text-stone-800">{prog.date}</div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {prog.time}
                            </div>
                          </td>

                          {/* Venue */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-semibold text-stone-800 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                              <span className="truncate max-w-[160px]">{prog.venue}</span>
                            </div>
                          </td>

                          {/* Assigned Guest */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {prog.guestName ? (
                              <div className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate max-w-[160px]">{prog.guestName}</span>
                              </div>
                            ) : prog.relatedComp ? (
                              <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1 truncate max-w-[160px]">
                                <Award className="w-3 h-3 shrink-0" />
                                <span className="truncate">{prog.relatedComp}</span>
                              </div>
                            ) : (
                              <span className="text-stone-400 text-xs italic">General Roster</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={prog.status}
                              onChange={(e) => handleQuickStatusChange(prog.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusSt.bg} ${statusSt.text} ${statusSt.border} focus:outline-none cursor-pointer`}
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Upcoming">Upcoming</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Completed">Completed</option>
                              <option value="Draft">Draft</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Public Toggle */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleTogglePublish(prog.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                prog.isPublished
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                              }`}
                            >
                              {prog.isPublished ? 'Live' : 'Hidden'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                            <button
                              onClick={() => openDetailsModal(prog)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(prog)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit Programme"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setProgToDelete(prog);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Programme"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: PROGRAMME CATEGORY MANAGEMENT                             */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">Official Programme Categories</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Configure categories governing festival schedules, public filters, and event classifications.
                </p>
              </div>

              <button
                onClick={openAddCategoryModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#A91F35] text-white font-bold text-xs shadow-md hover:bg-[#8B1A2C] transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-stone-200/80 bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-serif font-black text-sm text-stone-900">{cat.name}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {cat.code}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2">
                      {cat.description || 'Official festival programme category.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-600">
                      {cat.programmeCount || 0} {(cat.programmeCount === 1) ? 'Programme' : 'Programmes'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCategoryStatus(cat.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: STAGE & VENUE TIMELINES                                   */}
      {/* ========================================================================= */}
      {activeTab === 'stages' && (
        <div className="space-y-6 animate-fade-in">
          {OFFICIAL_VENUES.map((venue, vIdx) => {
            const venueProgs = programmes.filter(p => p.venue === venue && p.status !== 'Cancelled');
            return (
              <div key={vIdx} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#A91F35] text-white flex items-center justify-center font-serif font-black text-xs shrink-0">
                      0{vIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-black text-stone-900">{venue}</h3>
                      <p className="text-xs text-stone-500 font-medium">{venueProgs.length} Scheduled Events Across Festival Days</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-700">
                    Active Festival Arena
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {venueProgs.length === 0 ? (
                    <div className="col-span-full py-6 text-center text-xs text-stone-400">
                      No events currently scheduled at this stage.
                    </div>
                  ) : (
                    venueProgs.map(prog => (
                      <div
                        key={prog.id}
                        onClick={() => openDetailsModal(prog)}
                        className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-[#A91F35] cursor-pointer transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-stone-500">{prog.date}</span>
                          <span className="text-[10px] font-bold text-[#A91F35] bg-red-50 px-2 py-0.5 rounded">
                            {prog.time}
                          </span>
                        </div>
                        <h4 className="text-xs font-serif font-black text-stone-900 truncate">
                          {prog.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span className="truncate">{prog.category}</span>
                          <span className="font-bold text-stone-700">{prog.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: REPORTS & EXPORTS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-serif font-black text-[#1c1917]">Festival Programme Reports & Archives</h3>
              <p className="text-xs text-stone-500 font-medium">
                Generate and download curated festival dossiers, date-wise itineraries, and category reports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Complete Festival Master Schedule', count: `${programmes.length} programmes`, desc: 'Full official roster across all 5 stages for Day 1 and Day 2.' },
                { title: 'Day 01 Programme Itinerary (Dec 21)', count: `${programmes.filter(p => p.date === 'Dec 21, 2026').length} programmes`, desc: 'Inauguration, Academic Conclaves & preliminary competition schedule.' },
                { title: 'Day 02 Programme Itinerary (Dec 22)', count: `${programmes.filter(p => p.date === 'Dec 22, 2026').length} programmes`, desc: 'Grand finals, Sufi Symphony cultural night and valedictory.' },
                { title: 'Competitions-Linked Programmes', count: `${programmes.filter(p => p.category === 'Competitions' || p.relatedCompId).length} events`, desc: 'Public sessions and colloquiums linked to competition management.' },
                { title: 'Keynote & Academic Conclave Dossier', count: `${programmes.filter(p => p.category === 'Academic Conclave').length} sessions`, desc: 'Scholastic addresses and guest lectures by visiting dignitaries.' },
                { title: 'Public Published Programmes', count: `${programmes.filter(p => p.isPublished).length} published`, desc: 'Active events broadcasted to students, parents and public visitors.' }
              ].map((rep, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Report #{idx + 1}</span>
                    <h4 className="text-sm font-serif font-black text-stone-900">{rep.title}</h4>
                    <p className="text-xs text-stone-500">{rep.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A91F35]">{rep.count}</span>
                    <button
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-100 transition-all shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: ADD / EDIT PROGRAMME                                            */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-serif font-black text-[#1c1917]">
                  {editingProg ? 'Edit Festival Programme' : 'Add New Festival Programme'}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {editingProg ? `Updating ${editingProg.code || editingProg.id}` : 'Create a new official festival event or stage schedule'}
                </p>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProgramme} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Programme Title (English) *</label>
                  <input
                    type="text"
                    value={progForm.title}
                    onChange={(e) => setProgForm({ ...progForm, title: e.target.value })}
                    placeholder="e.g. Grand Inauguration Ceremony & Lamp Lighting"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                    required
                  />
                </div>

                {/* Malayalam Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Malayalam Title (Optional)</label>
                  <input
                    type="text"
                    value={progForm.malayalamTitle}
                    onChange={(e) => setProgForm({ ...progForm, malayalamTitle: e.target.value })}
                    placeholder="e.g. ഉദ്ഘാടന സമ്മേളനം"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Programme Code */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Programme Code</label>
                  <input
                    type="text"
                    value={progForm.code}
                    onChange={(e) => setProgForm({ ...progForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. PRG-INA-01"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={progForm.category}
                    onChange={(e) => setProgForm({ ...progForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Festival Date *</label>
                  <select
                    value={progForm.date}
                    onChange={(e) => setProgForm({ ...progForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    {FESTIVAL_DATES.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Venue / Stage *</label>
                  <select
                    value={progForm.venue}
                    onChange={(e) => setProgForm({ ...progForm, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    {OFFICIAL_VENUES.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Start Time & End Time */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={progForm.startTime}
                    onChange={(e) => setProgForm({ ...progForm, startTime: e.target.value })}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={progForm.endTime}
                    onChange={(e) => setProgForm({ ...progForm, endTime: e.target.value })}
                    placeholder="e.g. 11:00 AM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Coordinator */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coordinator Name</label>
                  <input
                    type="text"
                    value={progForm.coordinatorName}
                    onChange={(e) => setProgForm({ ...progForm, coordinatorName: e.target.value })}
                    placeholder="e.g. Prof. K.V. Zaid"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coordinator Contact</label>
                  <input
                    type="text"
                    value={progForm.coordinatorPhone}
                    onChange={(e) => setProgForm({ ...progForm, coordinatorPhone: e.target.value })}
                    placeholder="e.g. +91 98470 11223"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Guest Alignment */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Assign Dignitary / Guest</label>
                  <select
                    value={progForm.guestId}
                    onChange={(e) => setProgForm({ ...progForm, guestId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="">No Guest Assigned (Open Event)</option>
                    {guests.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.designation})</option>
                    ))}
                  </select>
                </div>

                {/* Related Competition */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Link Associated Competition</label>
                  <select
                    value={progForm.relatedCompId}
                    onChange={(e) => setProgForm({ ...progForm, relatedCompId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="">None (Ceremony / General Session)</option>
                    {competitions.map(c => (
                      <option key={c.id} value={c.competitionId || c.id}>
                        {c.competitionCode} - {c.competitionTitle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Programme Status</label>
                  <select
                    value={progForm.status}
                    onChange={(e) => setProgForm({ ...progForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Public Visibility Toggle */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="pubToggle"
                    checked={progForm.isPublished}
                    onChange={(e) => setProgForm({ ...progForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#A91F35] rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="pubToggle" className="text-xs font-bold text-stone-800 cursor-pointer">
                    Publish immediately to public festival schedule & events
                  </label>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Programme Description</label>
                  <textarea
                    rows={3}
                    value={progForm.description}
                    onChange={(e) => setProgForm({ ...progForm, description: e.target.value })}
                    placeholder="Brief description of the event, keynotes, syllabus scope, or ceremonial highlights..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#A91F35] text-white font-black text-xs hover:bg-[#8B1A2C] shadow-md transition-all"
                >
                  {editingProg ? 'Save Changes' : 'Create Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: PROGRAMME DETAILS DRAWER                                        */}
      {/* ========================================================================= */}
      {isDetailsModalOpen && activeProgDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-stone-100 text-stone-800">
                  {activeProgDetails.code || activeProgDetails.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A91F35]/10 text-[#A91F35]">
                  {activeProgDetails.category}
                </span>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-serif font-black text-stone-900">{activeProgDetails.title}</h3>
                {activeProgDetails.malayalamTitle && (
                  <div className="text-sm text-stone-500 font-medium">{activeProgDetails.malayalamTitle}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Date</span>
                  <span className="font-bold text-stone-800">{activeProgDetails.date}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Timing</span>
                  <span className="font-bold text-stone-800">{activeProgDetails.time}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Venue</span>
                  <span className="font-bold text-stone-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A91F35]" />
                    {activeProgDetails.venue}
                  </span>
                </div>
              </div>

              {activeProgDetails.desc && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Programme Description</span>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                    {activeProgDetails.desc}
                  </p>
                </div>
              )}

              {/* Guest Card if aligned */}
              {activeProgDetails.guest ? (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Assigned Dignitary</span>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-serif font-black text-xs shrink-0">
                      {activeProgDetails.guest.name ? activeProgDetails.guest.name[0] : 'G'}
                    </div>
                    <div>
                      <div className="text-xs font-black text-stone-900">{activeProgDetails.guest.name}</div>
                      <div className="text-[11px] text-stone-600 font-medium">{activeProgDetails.guest.designation} · {activeProgDetails.guest.role}</div>
                    </div>
                  </div>
                </div>
              ) : activeProgDetails.guestName ? (
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Invited Guest</span>
                  <span className="font-bold text-stone-800">{activeProgDetails.guestName}</span>
                </div>
              ) : null}

              {/* Related Competition Card if aligned */}
              {activeProgDetails.relatedCompetition && (
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Associated Festival Arena</span>
                  <div className="text-xs font-black text-stone-900">{activeProgDetails.relatedCompetition.competitionTitle}</div>
                  <div className="text-[11px] text-stone-600">
                    Category: {activeProgDetails.relatedCompetition.category} · Stage: {activeProgDetails.relatedCompetition.venue}
                  </div>
                </div>
              )}

              {/* Coordinator */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <div>
                  <span className="font-bold text-stone-700">Coordinator: </span>
                  {activeProgDetails.coordinatorName || 'Secretariat Staff'}
                </div>
                {activeProgDetails.coordinatorPhone && (
                  <div className="font-mono text-stone-600">{activeProgDetails.coordinatorPhone}</div>
                )}
              </div>
            </div>

            {/* Quick Status Buttons */}
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400">Update Operational Status</span>
              <div className="grid grid-cols-3 gap-2">
                {['Scheduled', 'Ongoing', 'Completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleQuickStatusChange(activeProgDetails.id, st)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      activeProgDetails.status === st
                        ? 'bg-[#A91F35] text-white border-[#A91F35]'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    Set {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  openEditModal(activeProgDetails);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200"
              >
                Edit Programme
              </button>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#A91F35] text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: ADD / EDIT CATEGORY                                             */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-serif font-black text-[#1c1917]">
                {editingCategory ? 'Edit Programme Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Special Session"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Code (3-4 chars) *</label>
                <input
                  type="text"
                  value={categoryForm.code}
                  onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. WKS"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="w-9 h-9 rounded-xl border border-stone-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Scope and purpose of this festival category..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#A91F35] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="catActive" className="text-xs font-bold text-stone-700 cursor-pointer">
                  Category is Active and available in programme picker
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A91F35] text-white font-black text-xs hover:bg-[#8B1A2C]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL: DELETE CONFIRMATION                                            */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && progToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-serif font-black text-stone-900">Delete Programme?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete <strong>{progToDelete.title}</strong> ({progToDelete.code || progToDelete.id})? This action will remove it from festival schedules.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-700 shadow-md"
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
