import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Plus, Search, Filter, Bell, AlertTriangle, CheckCircle,
  Clock, Archive, Eye, Edit3, Trash2, Pin, PinOff, Calendar, Users,
  BookOpen, Award, ArrowRight, Download, RefreshCw, X, ChevronRight,
  ChevronLeft, LayoutGrid, List, Sparkles, AlertCircle, FileText,
  Share2, ShieldAlert, Check, Radio, Send
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function AnnouncementsModule({ activeSection }) {
  // Navigation Tabs: 'dashboard' | 'announcements' | 'urgent_alerts'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('pinned_first');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Store Data States
  const [categories, setCategories] = useState(() => festivalStore.getAnnouncementCategories());
  const [announcements, setAnnouncements] = useState(() => festivalStore.getAnnouncements({ includeArchived: true }));
  const [stats, setStats] = useState(() => festivalStore.getAnnouncementDashboardStats());
  const [programmesList, setProgrammesList] = useState(() => festivalStore.data.programmes || []);
  const [competitionsList, setCompetitionsList] = useState(() => festivalStore.getCompetitions() || []);

  // Modals & Active Targets
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isExtendExpiryModalOpen, setIsExtendExpiryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newExpiryTime, setNewExpiryTime] = useState('11:59 PM');
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [actionErrorMsg, setActionErrorMsg] = useState(null);

  // Form State for Add / Edit
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'General Announcement',
    targetAudience: 'Everyone',
    priority: 'Normal',
    status: 'Published',
    publishDate: '',
    publishTime: '09:00 AM',
    expiryDate: '',
    expiryTime: '11:59 PM',
    relatedProgrammeId: '',
    relatedCompetitionId: '',
    featuredImageUrl: '',
    attachmentName: '',
    attachmentSize: '',
    isPinned: false
  });

  // Subscribe to live festival store changes
  useEffect(() => {
    if (typeof festivalStore.subscribe === 'function') {
      const unsub = festivalStore.subscribe(() => {
        setCategories(festivalStore.getAnnouncementCategories());
        setAnnouncements(festivalStore.getAnnouncements({ includeArchived: true }));
        setStats(festivalStore.getAnnouncementDashboardStats());
        setProgrammesList(festivalStore.data.programmes || []);
        setCompetitionsList(festivalStore.getCompetitions() || []);
      });
      return unsub;
    }
  }, []);

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setActionErrorMsg(msg);
      setTimeout(() => setActionErrorMsg(null), 4000);
    } else {
      setActionSuccessMsg(msg);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    }
  };

  // Filtered Announcements Computation
  const filteredAnnouncements = useMemo(() => {
    return festivalStore.getAnnouncements({
      category: selectedCategory,
      audience: selectedAudience,
      priority: activeTab === 'urgent_alerts' ? 'Urgent' : selectedPriority,
      status: selectedStatus,
      includeArchived: true,
      query: searchQuery,
      sortBy
    });
  }, [selectedCategory, selectedAudience, selectedPriority, selectedStatus, searchQuery, sortBy, activeTab, announcements]);

  // Paginated Announcements
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage) || 1;
  const paginatedAnnouncements = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAnnouncements.slice(start, start + itemsPerPage);
  }, [filteredAnnouncements, currentPage]);

  // Handle Form Submission (Create)
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showNotification('Announcement title is mandatory.', true);
      return;
    }

    try {
      const created = festivalStore.addAnnouncement(form);
      setIsAddModalOpen(false);
      showNotification(`Announcement "${created.title}" created successfully (${created.id}).`);
      setForm({
        title: '',
        summary: '',
        content: '',
        category: 'General Announcement',
        targetAudience: 'Everyone',
        priority: 'Normal',
        status: 'Published',
        publishDate: '',
        publishTime: '09:00 AM',
        expiryDate: '',
        expiryTime: '11:59 PM',
        relatedProgrammeId: '',
        relatedCompetitionId: '',
        featuredImageUrl: '',
        attachmentName: '',
        attachmentSize: '',
        isPinned: false
      });
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // Handle Form Submission (Update)
  const handleUpdateAnnouncement = (e) => {
    e.preventDefault();
    if (!selectedAnnouncement) return;

    try {
      const updated = festivalStore.updateAnnouncement(selectedAnnouncement.id, form);
      setSelectedAnnouncement(updated);
      setIsEditModalOpen(false);
      showNotification(`Announcement "${updated.title}" updated successfully.`);
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // Open Edit Modal with Pre-populated data
  const openEditModal = (ann) => {
    setSelectedAnnouncement(ann);
    setForm({
      title: ann.title || '',
      summary: ann.summary || '',
      content: ann.content || '',
      category: ann.category || 'General Announcement',
      targetAudience: ann.targetAudience || 'Everyone',
      priority: ann.priority || 'Normal',
      status: ann.status || 'Draft',
      publishDate: ann.publishDate || '',
      publishTime: ann.publishTime || '09:00 AM',
      expiryDate: ann.expiryDate || '',
      expiryTime: ann.expiryTime || '11:59 PM',
      relatedProgrammeId: ann.relatedProgrammeId || '',
      relatedCompetitionId: ann.relatedCompetitionId || '',
      featuredImageUrl: ann.featuredImageUrl || '',
      attachmentName: ann.attachmentName || '',
      attachmentSize: ann.attachmentSize || '',
      isPinned: Boolean(ann.isPinned)
    });
    setIsEditModalOpen(true);
  };

  // Actions
  const handlePublishToggle = (ann) => {
    try {
      const willPublish = ann.status !== 'Published';
      if (willPublish) {
        festivalStore.publishAnnouncement(ann.id);
        showNotification(`Published "${ann.title}".`);
      } else {
        festivalStore.unpublishAnnouncement(ann.id);
        showNotification(`Unpublished "${ann.title}" to Draft.`);
      }
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleTogglePin = (ann) => {
    try {
      festivalStore.togglePinAnnouncement(ann.id);
      showNotification(`Toggled pin state for "${ann.title}".`);
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleArchive = (ann) => {
    try {
      festivalStore.archiveAnnouncement(ann.id);
      showNotification(`Archived announcement "${ann.title}".`);
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleRestore = (ann) => {
    try {
      festivalStore.restoreAnnouncement(ann.id);
      showNotification(`Restored announcement "${ann.title}" to Draft.`);
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleDelete = () => {
    if (!selectedAnnouncement) return;
    try {
      festivalStore.deleteAnnouncement(selectedAnnouncement.id);
      setIsDeleteModalOpen(false);
      setIsPreviewModalOpen(false);
      showNotification(`Permanently deleted announcement "${selectedAnnouncement.title}".`);
      setSelectedAnnouncement(null);
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  const handleExtendExpiry = () => {
    if (!selectedAnnouncement || !newExpiryDate) {
      showNotification('Please select a valid expiry date.', true);
      return;
    }
    try {
      festivalStore.extendAnnouncementExpiry(selectedAnnouncement.id, newExpiryDate, newExpiryTime);
      setIsExtendExpiryModalOpen(false);
      showNotification(`Extended expiry for "${selectedAnnouncement.title}" to ${newExpiryDate}.`);
    } catch (err) {
      showNotification(err.message, true);
    }
  };

  // Export Announcements to CSV
  const handleExportCSV = () => {
    const headers = ['Announcement ID', 'Title', 'Category', 'Target Audience', 'Priority', 'Status', 'Publish Date', 'Expiry Date', 'Author', 'Views', 'Is Pinned'];
    const rows = filteredAnnouncements.map(a => [
      `"${a.id}"`,
      `"${(a.title || '').replace(/"/g, '""')}"`,
      `"${a.category || ''}"`,
      `"${a.targetAudience || ''}"`,
      `"${a.priority || ''}"`,
      `"${a.status || ''}"`,
      `"${a.publishDate || ''} ${a.publishTime || ''}"`,
      `"${a.expiryDate || 'N/A'}"`,
      `"${a.author || ''}"`,
      a.viewsCount || 0,
      a.isPinned ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_announcements_circulars_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported announcements catalog to CSV.');
  };

  // Helper badge renderers
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-red-600" /> Urgent
          </span>
        );
      case 'Important':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Sparkles className="w-3 h-3 text-amber-600" /> Important
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            Normal
          </span>
        );
    }
  };

  const getAudienceBadge = (audience) => {
    switch (audience) {
      case 'Everyone':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"><Users className="w-2.5 h-2.5" /> Everyone</span>;
      case 'Judges':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200"><Award className="w-2.5 h-2.5" /> Judges</span>;
      case 'Team Leaders':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200"><Users className="w-2.5 h-2.5" /> Team Leaders</span>;
      case 'Students':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"><BookOpen className="w-2.5 h-2.5" /> Students</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-[#A91F35] border border-red-200"><ShieldAlert className="w-2.5 h-2.5" /> Admin Only</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><CheckCircle className="w-2.5 h-2.5" /> Published</span>;
      case 'Scheduled':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300"><Clock className="w-2.5 h-2.5" /> Scheduled</span>;
      case 'Expired':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-600 border border-stone-300">Expired</span>;
      case 'Archived':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200"><Archive className="w-2.5 h-2.5" /> Archived</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-300">Draft</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Toast Notifications */}
      <AnimatePresence>
        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-900 text-white shadow-xl border border-emerald-500 text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {actionSuccessMsg}
          </motion.div>
        )}
        {actionErrorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-900 text-white shadow-xl border border-red-500 text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            {actionErrorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#8E1B2D] via-[#A91F35] to-[#681321] text-white p-6 md:p-8 shadow-lg border border-[#A91F35]/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider text-[#E6A916]">
              <Megaphone className="w-3.5 h-3.5 text-[#E6A916]" /> Official Secretariat Broadcast Control
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-serif">
              Announcements Management
            </h1>
            <p className="text-sm text-white/80 max-w-2xl leading-relaxed">
              Broadcast critical festival circulars, synchronize automated judge & team leader notifications, orchestrate scheduled press releases, and manage live flash alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E6A916] hover:bg-[#d4980f] text-[#1c1917] font-bold text-sm shadow-md transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 text-[#1c1917]" />
              New Announcement
            </button>
            <button
              onClick={handleExportCSV}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              title="Export Circulars CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Sub-Navigation */}
        <div className="mt-8 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#A91F35] shadow-md'
                : 'bg-white/10 text-white/90 hover:bg-white/15'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-white text-[#A91F35] shadow-md'
                : 'bg-white/10 text-white/90 hover:bg-white/15'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            All Announcements ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('urgent_alerts')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'urgent_alerts'
                ? 'bg-white text-red-700 shadow-md'
                : 'bg-white/10 text-white/90 hover:bg-white/15'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            Urgent Flash Alerts ({stats.urgentAnnouncements})
          </button>
        </div>
      </div>

      {/* Urgent Broadcast Live Flash Notice (Top pinned alert) */}
      {stats.urgentAnnouncements > 0 && (
        <div className="rounded-xl p-4 bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-200">Live Urgent Flash Broadcast</p>
              <h3 className="text-sm font-bold">
                {announcements.find(a => a.priority === 'Urgent' && a.status === 'Published')?.title || 'Urgent Festival Notification Active'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('announcements');
              setSelectedPriority('Urgent');
            }}
            className="px-3 py-1.5 rounded-lg bg-white text-red-800 text-xs font-bold shadow-sm hover:bg-stone-100 transition-colors cursor-pointer flex-shrink-0"
          >
            View Urgent ({stats.urgentAnnouncements})
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: DASHBOARD OVERVIEW */}
      {/* ============================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 6 Key Performance Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total</span>
                <span className="p-2 rounded-lg bg-red-50 text-[#A91F35]"><Megaphone className="w-4 h-4" /></span>
              </div>
              <p className="mt-3 text-2xl font-black text-stone-900">{stats.totalAnnouncements}</p>
              <span className="text-[11px] text-stone-500 font-medium">All circulars catalog</span>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Published</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700"><CheckCircle className="w-4 h-4" /></span>
              </div>
              <p className="mt-3 text-2xl font-black text-emerald-700">{stats.publishedAnnouncements}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Active in portals/site</span>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Scheduled</span>
                <span className="p-2 rounded-lg bg-blue-50 text-blue-700"><Clock className="w-4 h-4" /></span>
              </div>
              <p className="mt-3 text-2xl font-black text-blue-700">{stats.scheduledAnnouncements}</p>
              <span className="text-[11px] text-blue-600 font-medium">Auto-release queued</span>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Drafts</span>
                <span className="p-2 rounded-lg bg-stone-100 text-stone-700"><Edit3 className="w-4 h-4" /></span>
              </div>
              <p className="mt-3 text-2xl font-black text-stone-700">{stats.draftAnnouncements}</p>
              <span className="text-[11px] text-stone-500 font-medium">Internal review</span>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Expired</span>
                <span className="p-2 rounded-lg bg-stone-100 text-stone-500"><Clock className="w-4 h-4" /></span>
              </div>
              <p className="mt-3 text-2xl font-black text-stone-500">{stats.expiredAnnouncements}</p>
              <span className="text-[11px] text-stone-400 font-medium">Past expiry date</span>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Urgent Alerts</span>
                <span className="p-2 rounded-lg bg-red-100 text-red-600"><AlertTriangle className="w-4 h-4" /></span>
              </div>
              <p className="mt-3 text-2xl font-black text-red-600">{stats.urgentAnnouncements}</p>
              <span className="text-[11px] text-red-500 font-medium">High priority notices</span>
            </div>
          </div>

          {/* Audience Distribution Matrix */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Target Audience Reach</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div
                onClick={() => { setActiveTab('announcements'); setSelectedAudience('Everyone'); }}
                className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 cursor-pointer transition-all"
              >
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Everyone (Public)</span>
                <p className="text-xl font-black text-emerald-900 mt-1">{stats.audienceDistribution.everyone}</p>
              </div>

              <div
                onClick={() => { setActiveTab('announcements'); setSelectedAudience('Judges'); }}
                className="p-3 rounded-lg bg-purple-50/60 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all"
              >
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Official Judges</span>
                <p className="text-xl font-black text-purple-900 mt-1">{stats.audienceDistribution.judges}</p>
              </div>

              <div
                onClick={() => { setActiveTab('announcements'); setSelectedAudience('Team Leaders'); }}
                className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 hover:border-blue-400 cursor-pointer transition-all"
              >
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Team Leaders</span>
                <p className="text-xl font-black text-blue-900 mt-1">{stats.audienceDistribution.teamLeaders}</p>
              </div>

              <div
                onClick={() => { setActiveTab('announcements'); setSelectedAudience('Students'); }}
                className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 hover:border-amber-400 cursor-pointer transition-all"
              >
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Enrolled Students</span>
                <p className="text-xl font-black text-amber-900 mt-1">{stats.audienceDistribution.students}</p>
              </div>

              <div
                onClick={() => { setActiveTab('announcements'); setSelectedAudience('Admin Only'); }}
                className="p-3 rounded-lg bg-red-50/60 border border-red-200 hover:border-red-400 cursor-pointer transition-all"
              >
                <span className="text-[10px] font-bold text-[#A91F35] uppercase block">Admin Only</span>
                <p className="text-xl font-black text-[#A91F35] mt-1">{stats.audienceDistribution.adminOnly}</p>
              </div>
            </div>
          </div>

          {/* Recent Broadcasts Feed */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#A91F35]" />
                <h3 className="text-sm font-bold text-stone-900">Recent Official Circulars & Notices</h3>
              </div>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Circulars <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {stats.recentAnnouncements.map(ann => (
                <div
                  key={ann.id}
                  onClick={() => {
                    setSelectedAnnouncement(ann);
                    setIsPreviewModalOpen(true);
                  }}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-[#A91F35]/40 hover:bg-stone-50/80 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {ann.isPinned && (
                        <span className="p-1 rounded bg-amber-100 text-amber-800" title="Pinned Announcement">
                          <Pin className="w-3 h-3" />
                        </span>
                      )}
                      {getPriorityBadge(ann.priority)}
                      {getAudienceBadge(ann.targetAudience)}
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {ann.category}
                      </span>
                      {getStatusBadge(ann.status)}
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 truncate">{ann.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-1">{ann.summary}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-400 flex-shrink-0">
                    <span className="font-mono text-[11px]">{ann.publishDate}</span>
                    <span className="font-bold text-stone-600">{ann.viewsCount} reads</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(ann);
                      }}
                      className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 cursor-pointer"
                      title="Edit Announcement"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2 & 3: ALL ANNOUNCEMENTS & URGENT ALERTS */}
      {/* ============================================================== */}
      {(activeTab === 'announcements' || activeTab === 'urgent_alerts') && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search announcements by title, summary, content, category, author..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">
                  Showing <strong className="text-stone-900">{filteredAnnouncements.length}</strong> announcements
                </span>
                <div className="flex items-center p-0.5 rounded-lg bg-stone-100 border border-stone-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-[#A91F35] shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      viewMode === 'table' ? 'bg-white text-[#A91F35] shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
                    }`}
                    title="Table View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-2 border-t border-stone-100">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Categories ({categories.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Target Audience</label>
                <select
                  value={selectedAudience}
                  onChange={(e) => {
                    setSelectedAudience(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Audiences</option>
                  <option value="Everyone">Everyone</option>
                  <option value="Team Leaders">Team Leaders</option>
                  <option value="Students">Students</option>
                  <option value="Judges">Judges</option>
                  <option value="Admin Only">Admin Only</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Priority</label>
                <select
                  value={activeTab === 'urgent_alerts' ? 'Urgent' : selectedPriority}
                  disabled={activeTab === 'urgent_alerts'}
                  onChange={(e) => {
                    setSelectedPriority(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35] disabled:bg-stone-100"
                >
                  <option value="all">All Priorities</option>
                  <option value="Urgent">Urgent Only</option>
                  <option value="Important">Important</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                  <option value="Expired">Expired</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="pinned_first">Pinned Top</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Highest Priority</option>
                  <option value="views">Most Viewed</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid View Mode */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedAnnouncements.map(ann => (
                <div
                  key={ann.id}
                  className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md border transition-all flex flex-col justify-between ${
                    ann.priority === 'Urgent' ? 'border-red-300 ring-1 ring-red-100' : 'border-stone-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Badges Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {ann.isPinned && (
                          <span className="p-1 rounded bg-amber-100 text-amber-800" title="Pinned Announcement">
                            <Pin className="w-3 h-3" />
                          </span>
                        )}
                        {getPriorityBadge(ann.priority)}
                        {getAudienceBadge(ann.targetAudience)}
                        <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          {ann.category}
                        </span>
                      </div>
                      <div>
                        {getStatusBadge(ann.status)}
                      </div>
                    </div>

                    {/* Title & Summary */}
                    <div>
                      <h3
                        onClick={() => { setSelectedAnnouncement(ann); setIsPreviewModalOpen(true); }}
                        className="text-sm font-bold text-stone-900 hover:text-[#A91F35] transition-colors cursor-pointer leading-snug font-serif"
                      >
                        {ann.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                        {ann.summary}
                      </p>
                    </div>

                    {/* Associated metadata */}
                    <div className="space-y-1 text-[11px] text-stone-500">
                      {ann.relatedProgrammeTitle && (
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <BookOpen className="w-3 h-3 text-[#E6A916]" />
                          <span className="truncate">{ann.relatedProgrammeTitle}</span>
                        </div>
                      )}
                      {ann.relatedCompetitionTitle && (
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Award className="w-3 h-3 text-[#A91F35]" />
                          <span className="truncate">{ann.relatedCompetitionTitle}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Toolbar */}
                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div>
                      <span className="font-semibold text-stone-700 block">{ann.publishDate}</span>
                      <span className="text-[10px] text-stone-400">{ann.viewsCount} reads • By {ann.author}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelectedAnnouncement(ann); setIsPreviewModalOpen(true); }}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                        title="Preview Announcement"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(ann)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                        title="Edit Announcement"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleTogglePin(ann)}
                        className={`p-1.5 rounded-lg cursor-pointer ${
                          ann.isPinned ? 'bg-amber-100 text-amber-800' : 'hover:bg-stone-100 text-stone-600'
                        }`}
                        title={ann.isPinned ? 'Unpin' : 'Pin to Top'}
                      >
                        {ann.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handlePublishToggle(ann)}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          ann.status === 'Published'
                            ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {ann.status === 'Published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View Mode */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Title & Summary</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Audience</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Publish Date</th>
                      <th className="py-3 px-4">Expiry</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {paginatedAnnouncements.map(ann => (
                      <tr key={ann.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 max-w-sm">
                          <div className="flex items-center gap-1.5">
                            {ann.isPinned && <Pin className="w-3 h-3 text-amber-600 flex-shrink-0" />}
                            <span
                              onClick={() => { setSelectedAnnouncement(ann); setIsPreviewModalOpen(true); }}
                              className="font-bold text-stone-900 hover:text-[#A91F35] cursor-pointer truncate"
                            >
                              {ann.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">{ann.summary}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                            {ann.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getAudienceBadge(ann.targetAudience)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getPriorityBadge(ann.priority)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(ann.status)}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-stone-500 whitespace-nowrap">
                          {ann.publishDate}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-stone-400 whitespace-nowrap">
                          {ann.expiryDate || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedAnnouncement(ann); setIsPreviewModalOpen(true); }}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                              title="Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(ann)}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTogglePin(ann)}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 cursor-pointer"
                              title={ann.isPinned ? 'Unpin' : 'Pin'}
                            >
                              {ann.isPinned ? <PinOff className="w-3.5 h-3.5 text-amber-700" /> : <Pin className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-stone-200">
              <span className="text-xs text-stone-500 font-medium">
                Page <strong className="text-stone-900">{currentPage}</strong> of <strong className="text-stone-900">{totalPages}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === page ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD NEW ANNOUNCEMENT */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#A91F35] flex items-center justify-center font-bold">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif">Compose Festival Announcement</h3>
                    <p className="text-xs text-stone-500">Draft, schedule or publish official circulars and notices</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Announcement Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Schedule Calibration for Cordova Stage Inauguration"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Target Audience *</label>
                    <select
                      value={form.targetAudience}
                      onChange={(e) => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Everyone">Everyone (Public & All)</option>
                      <option value="Team Leaders">Team Leaders Only</option>
                      <option value="Students">Students Only</option>
                      <option value="Judges">Judges Only</option>
                      <option value="Admin Only">Admin Only (Internal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Priority Level *</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent (Flash Alert)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Short Summary (Shown in notification feeds) *</label>
                  <textarea
                    rows={2}
                    required
                    value={form.summary}
                    onChange={(e) => setForm(f => ({ ...f, summary: e.target.value }))}
                    placeholder="Brief 1-2 sentence executive summary..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Full Announcement Body</label>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Full detailed circular content, directives, guidelines and official sign-offs..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Scheduling & Expiry */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Publish Date</label>
                    <input
                      type="text"
                      value={form.publishDate}
                      onChange={(e) => setForm(f => ({ ...f, publishDate: e.target.value }))}
                      placeholder="e.g. Dec 21, 2026"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Publish Time</label>
                    <input
                      type="text"
                      value={form.publishTime}
                      onChange={(e) => setForm(f => ({ ...f, publishTime: e.target.value }))}
                      placeholder="e.g. 09:00 AM"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Expiry Date (Optional)</label>
                    <input
                      type="text"
                      value={form.expiryDate}
                      onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                      placeholder="e.g. Dec 22, 2026"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    >
                      <option value="Published">Publish Now</option>
                      <option value="Draft">Save as Draft</option>
                      <option value="Scheduled">Schedule Release</option>
                    </select>
                  </div>
                </div>

                {/* Relational Connections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Related Programme (Optional)</label>
                    <select
                      value={form.relatedProgrammeId}
                      onChange={(e) => setForm(f => ({ ...f, relatedProgrammeId: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="">None / General</option>
                      {programmesList.map(prg => (
                        <option key={prg.id} value={prg.id}>{prg.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Related Competition (Optional)</label>
                    <select
                      value={form.relatedCompetitionId}
                      onChange={(e) => setForm(f => ({ ...f, relatedCompetitionId: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                    >
                      <option value="">None / Non-competitive</option>
                      {competitionsList.map(comp => (
                        <option key={comp.id} value={comp.competitionId || comp.id}>{comp.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="addPinCheck"
                    checked={form.isPinned}
                    onChange={(e) => setForm(f => ({ ...f, isPinned: e.target.checked }))}
                    className="rounded text-[#A91F35] focus:ring-[#A91F35]"
                  />
                  <label htmlFor="addPinCheck" className="font-bold text-stone-700 cursor-pointer">
                    Pin this announcement to the top of active feeds
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-[#A91F35] hover:bg-[#8E1B2D] rounded-lg shadow-md cursor-pointer transition-colors"
                  >
                    Save & Broadcast Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 2: EDIT ANNOUNCEMENT */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isEditModalOpen && selectedAnnouncement && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif">Edit Announcement ({selectedAnnouncement.id})</h3>
                    <p className="text-xs text-stone-500">Update broadcast details and target audiences</p>
                  </div>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Target Audience</label>
                    <select
                      value={form.targetAudience}
                      onChange={(e) => setForm(f => ({ ...f, targetAudience: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50"
                    >
                      <option value="Everyone">Everyone</option>
                      <option value="Team Leaders">Team Leaders</option>
                      <option value="Students">Students</option>
                      <option value="Judges">Judges</option>
                      <option value="Admin Only">Admin Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Summary</label>
                  <textarea
                    rows={2}
                    value={form.summary}
                    onChange={(e) => setForm(f => ({ ...f, summary: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Content</label>
                  <textarea
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Publish Date</label>
                    <input
                      type="text"
                      value={form.publishDate}
                      onChange={(e) => setForm(f => ({ ...f, publishDate: e.target.value }))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Publish Time</label>
                    <input
                      type="text"
                      value={form.publishTime}
                      onChange={(e) => setForm(f => ({ ...f, publishTime: e.target.value }))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={form.expiryDate}
                      onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-600 block mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white"
                    >
                      <option value="Published">Published</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                      <option value="Expired">Expired</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editPinCheck"
                    checked={form.isPinned}
                    onChange={(e) => setForm(f => ({ ...f, isPinned: e.target.checked }))}
                    className="rounded text-[#A91F35]"
                  />
                  <label htmlFor="editPinCheck" className="font-bold text-stone-700 cursor-pointer">
                    Pin this announcement to the top of active feeds
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-[#A91F35] hover:bg-[#8E1B2D] rounded-lg shadow-md cursor-pointer transition-colors"
                  >
                    Update Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 3: ANNOUNCEMENT PREVIEW MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isPreviewModalOpen && selectedAnnouncement && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 my-8 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-400">{selectedAnnouncement.id}</span>
                  {selectedAnnouncement.isPinned && (
                    <span className="p-1 rounded bg-amber-100 text-amber-800" title="Pinned Announcement">
                      <Pin className="w-3 h-3" />
                    </span>
                  )}
                  {getPriorityBadge(selectedAnnouncement.priority)}
                  {getAudienceBadge(selectedAnnouncement.targetAudience)}
                  {getStatusBadge(selectedAnnouncement.status)}
                </div>
                <button onClick={() => setIsPreviewModalOpen(false)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Featured Image if present */}
              {selectedAnnouncement.featuredImageUrl && (
                <div className="rounded-xl overflow-hidden aspect-[16/7] bg-stone-100 border border-stone-200">
                  <img
                    src={selectedAnnouncement.featuredImageUrl}
                    alt={selectedAnnouncement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Category */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#A91F35] bg-red-50 px-2 py-0.5 rounded">
                  {selectedAnnouncement.category}
                </span>
                <h2 className="text-xl font-bold text-stone-900 font-serif leading-tight">
                  {selectedAnnouncement.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-stone-400 pt-1">
                  <span>Published: <strong>{selectedAnnouncement.publishDate} {selectedAnnouncement.publishTime}</strong></span>
                  {selectedAnnouncement.expiryDate && (
                    <span>• Expires: <strong>{selectedAnnouncement.expiryDate}</strong></span>
                  )}
                  <span>• By: <strong>{selectedAnnouncement.author}</strong></span>
                </div>
              </div>

              {/* Summary Highlight Box */}
              <div className="p-3.5 rounded-xl bg-stone-50 border-l-4 border-[#A91F35] text-xs text-stone-700 leading-relaxed font-medium">
                {selectedAnnouncement.summary}
              </div>

              {/* Full Content */}
              <div className="text-xs text-stone-700 leading-relaxed space-y-2 whitespace-pre-line pt-2 border-t border-stone-100">
                {selectedAnnouncement.content}
              </div>

              {/* Relational Metadata Badges */}
              {(selectedAnnouncement.relatedProgrammeTitle || selectedAnnouncement.relatedCompetitionTitle) && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
                  {selectedAnnouncement.relatedProgrammeTitle && (
                    <p className="flex items-center gap-1.5 text-stone-800">
                      <BookOpen className="w-3.5 h-3.5 text-[#E6A916]" />
                      <span>Associated Programme: <strong>{selectedAnnouncement.relatedProgrammeTitle}</strong></span>
                    </p>
                  )}
                  {selectedAnnouncement.relatedCompetitionTitle && (
                    <p className="flex items-center gap-1.5 text-stone-800">
                      <Award className="w-3.5 h-3.5 text-[#A91F35]" />
                      <span>Associated Competition: <strong>{selectedAnnouncement.relatedCompetitionTitle}</strong></span>
                    </p>
                  )}
                </div>
              )}

              {/* Attachment if present */}
              {selectedAnnouncement.attachmentName && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <div>
                      <p className="font-bold text-stone-900">{selectedAnnouncement.attachmentName}</p>
                      <p className="text-[10px] text-stone-500">{selectedAnnouncement.attachmentSize}</p>
                    </div>
                  </div>
                  <a
                    href={selectedAnnouncement.attachmentUrl || '#'}
                    download={selectedAnnouncement.attachmentName}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      openEditModal(selectedAnnouncement);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleTogglePin(selectedAnnouncement)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                  >
                    {selectedAnnouncement.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    {selectedAnnouncement.isPinned ? 'Unpin' : 'Pin to Top'}
                  </button>
                  <button
                    onClick={() => {
                      setNewExpiryDate(selectedAnnouncement.expiryDate || '');
                      setIsExtendExpiryModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Extend Expiry
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePublishToggle(selectedAnnouncement)}
                    className={`px-3 py-2 rounded-lg font-bold text-xs cursor-pointer text-white ${
                      selectedAnnouncement.status === 'Published'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {selectedAnnouncement.status === 'Published' ? 'Unpublish to Draft' : 'Publish to Target'}
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 4: EXTEND EXPIRY MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isExtendExpiryModalOpen && selectedAnnouncement && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Extend Circular Expiry</h3>
                  <p className="text-[11px] text-stone-500">{selectedAnnouncement.id}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">New Expiry Date *</label>
                  <input
                    type="text"
                    required
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    placeholder="e.g. Dec 25, 2026"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Expiry Time</label>
                  <input
                    type="text"
                    value={newExpiryTime}
                    onChange={(e) => setNewExpiryTime(e.target.value)}
                    placeholder="e.g. 11:59 PM"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => setIsExtendExpiryModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExtendExpiry}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#A91F35] hover:bg-[#8E1B2D] rounded-lg shadow-sm cursor-pointer transition-colors"
                  >
                    Confirm Extension
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* MODAL 5: DELETE CONFIRMATION MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedAnnouncement && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 font-serif">Permanently Delete Announcement?</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to delete <strong>"{selectedAnnouncement.title}"</strong> ({selectedAnnouncement.id})? This action cannot be reversed.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md cursor-pointer transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
