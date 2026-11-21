import React, { useState, useMemo } from 'react';
import {
  Users, UserCheck, Calendar, Clock, MapPin, Award, Tag, Search,
  Filter, Plus, Edit2, Trash2, Eye, CheckCircle2, AlertCircle, X,
  Download, RefreshCw, Sparkles, AlertTriangle, ShieldCheck, Check,
  Layers, FileText, ExternalLink, Lock, Phone, Mail, Building,
  Compass, ArrowRight, UserPlus, Send, CheckCheck, Grid, List
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

const INVITATION_STATUS_CONFIG = {
  Confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  'Invitation Sent': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  'Invitation Pending': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  Declined: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' }
};

const PARTICIPATION_STATUS_CONFIG = {
  'Arrival Pending': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
  'Arrived on Campus': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  'Session Completed': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  'Did Not Attend': { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' }
};

export default function GuestsModule({ activeSection }) {
  // Navigation tabs: 'dashboard' | 'directory' | 'assignment' | 'invitations' | 'categories'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('assign')) return 'assignment';
      if (hash.includes('invitation')) return 'invitations';
      if (hash.includes('category') || hash.includes('categories')) return 'categories';
      if (hash.includes('directory') || hash.includes('list')) return 'directory';
    }
    return 'dashboard';
  });

  // Store state
  const [guests, setGuests] = useState(() => festivalStore.getProgrammeGuests());
  const [categories, setCategories] = useState(() => festivalStore.getGuestCategories());
  const [stats, setStats] = useState(() => festivalStore.getGuestDashboardStats());
  const [programmes, setProgrammes] = useState(() => festivalStore.getProgrammes());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedInvitationStatus, setSelectedInvitationStatus] = useState('all');
  const [selectedAssignmentStatus, setSelectedAssignmentStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeGuestProfile, setActiveGuestProfile] = useState(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [guestForAssignment, setGuestForAssignment] = useState(null);
  const [selectedProgIdsForAssignment, setSelectedProgIdsForAssignment] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);

  // Form states
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [guestForm, setProgGuestForm] = useState({
    name: '',
    malayalamName: '',
    designation: '',
    organization: '',
    category: 'Guest of Honour',
    shortBio: '',
    bio: '',
    photoUrl: '/assets/guests/portrait_muhammed_rashid.png',
    assignedProgrammeIds: [],
    sessionTitle: '',
    invitationStatus: 'Confirmed',
    participationStatus: 'Arrival Pending',
    arrivalDate: 'Dec 21, 2026',
    arrivalTime: '10:00 AM',
    contactPhone: '',
    contactEmail: '',
    specialNotes: '',
    credentialsText: '',
    isPublished: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    code: '',
    color: '#A91F35'
  });

  const refreshData = () => {
    setGuests(festivalStore.getProgrammeGuests());
    setCategories(festivalStore.getGuestCategories());
    setStats(festivalStore.getGuestDashboardStats());
    setProgrammes(festivalStore.getProgrammes());
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return festivalStore.getProgrammeGuests({
      query: searchQuery,
      category: selectedCategory,
      invitationStatus: selectedInvitationStatus,
      assignmentStatus: selectedAssignmentStatus,
      sortBy
    });
  }, [guests, searchQuery, selectedCategory, selectedInvitationStatus, selectedAssignmentStatus, sortBy]);

  // Open Add Guest Modal
  const openAddModal = () => {
    setEditingGuest(null);
    setFormError('');
    setProgGuestForm({
      name: '',
      malayalamName: '',
      designation: '',
      organization: 'Dalailussunna Dars, Ayiroor',
      category: categories[0]?.name || 'Guest of Honour',
      shortBio: '',
      bio: '',
      photoUrl: '/assets/guests/portrait_muhammed_rashid.png',
      assignedProgrammeIds: [],
      sessionTitle: '',
      invitationStatus: 'Confirmed',
      participationStatus: 'Arrival Pending',
      arrivalDate: 'Dec 21, 2026',
      arrivalTime: '10:00 AM',
      contactPhone: '',
      contactEmail: '',
      specialNotes: '',
      credentialsText: 'Senior Scholar\nAcademic Fellow',
      isPublished: true
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Guest Modal
  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setFormError('');
    setProgGuestForm({
      name: guest.name || '',
      malayalamName: guest.malayalamName || '',
      designation: guest.designation || '',
      organization: guest.organization || '',
      category: guest.category || categories[0]?.name || 'Guest of Honour',
      shortBio: guest.shortBio || '',
      bio: guest.bio || guest.shortBio || '',
      photoUrl: guest.photoUrl || '/assets/guests/portrait_muhammed_rashid.png',
      assignedProgrammeIds: Array.isArray(guest.assignedProgrammeIds) ? guest.assignedProgrammeIds : [],
      sessionTitle: guest.sessionTitle || '',
      invitationStatus: guest.invitationStatus || 'Confirmed',
      participationStatus: guest.participationStatus || 'Arrival Pending',
      arrivalDate: guest.arrivalDate || 'Dec 21, 2026',
      arrivalTime: guest.arrivalTime || '10:00 AM',
      contactPhone: guest.contactPhone || '',
      contactEmail: guest.contactEmail || '',
      specialNotes: guest.specialNotes || '',
      credentialsText: Array.isArray(guest.credentials) ? guest.credentials.join('\n') : '',
      isPublished: guest.isPublished !== undefined ? guest.isPublished : true
    });
    setIsAddEditModalOpen(true);
  };

  // Handle Save Guest (Create / Update)
  const handleSaveGuest = (e) => {
    e.preventDefault();
    setFormError('');

    if (!guestForm.name.trim()) {
      setFormError('Guest full name is mandatory.');
      return;
    }
    if (!guestForm.designation.trim()) {
      setFormError('Guest designation/position is required.');
      return;
    }

    const credentials = guestForm.credentialsText
      ? guestForm.credentialsText.split('\n').map(c => c.trim()).filter(Boolean)
      : [];

    try {
      if (editingGuest) {
        festivalStore.updateProgrammeGuest(editingGuest.id, {
          name: guestForm.name,
          malayalamName: guestForm.malayalamName,
          designation: guestForm.designation,
          organization: guestForm.organization,
          category: guestForm.category,
          shortBio: guestForm.shortBio,
          bio: guestForm.bio,
          photoUrl: guestForm.photoUrl,
          assignedProgrammeIds: guestForm.assignedProgrammeIds,
          sessionTitle: guestForm.sessionTitle,
          invitationStatus: guestForm.invitationStatus,
          participationStatus: guestForm.participationStatus,
          arrivalDate: guestForm.arrivalDate,
          arrivalTime: guestForm.arrivalTime,
          contactPhone: guestForm.contactPhone,
          contactEmail: guestForm.contactEmail,
          specialNotes: guestForm.specialNotes,
          credentials,
          isPublished: guestForm.isPublished
        });
        showToast(`Guest profile for "${guestForm.name}" updated!`);
      } else {
        festivalStore.addProgrammeGuest({
          name: guestForm.name,
          malayalamName: guestForm.malayalamName,
          designation: guestForm.designation,
          organization: guestForm.organization,
          category: guestForm.category,
          shortBio: guestForm.shortBio,
          bio: guestForm.bio,
          photoUrl: guestForm.photoUrl,
          assignedProgrammeIds: guestForm.assignedProgrammeIds,
          sessionTitle: guestForm.sessionTitle,
          invitationStatus: guestForm.invitationStatus,
          participationStatus: guestForm.participationStatus,
          arrivalDate: guestForm.arrivalDate,
          arrivalTime: guestForm.arrivalTime,
          contactPhone: guestForm.contactPhone,
          contactEmail: guestForm.contactEmail,
          specialNotes: guestForm.specialNotes,
          credentials,
          isPublished: guestForm.isPublished
        });
        showToast(`New guest profile created for "${guestForm.name}"!`);
      }
      refreshData();
      setIsAddEditModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    }
  };

  // Open Profile Drawer
  const openProfileDrawer = (guest) => {
    const full = festivalStore.getProgrammeGuestById(guest.id, { includePrivate: true });
    setActiveGuestProfile(full || guest);
    setIsProfileModalOpen(true);
  };

  // Open Quick Multi-Programme Assignment Modal
  const openAssignmentModal = (guest) => {
    setGuestForAssignment(guest);
    setSelectedProgIdsForAssignment(
      Array.isArray(guest.assignedProgrammeIds) ? [...guest.assignedProgrammeIds] : []
    );
    setIsAssignmentModalOpen(true);
  };

  // Save Programme Assignments
  const handleSaveAssignments = () => {
    if (!guestForAssignment) return;
    try {
      festivalStore.assignGuestToProgrammes(guestForAssignment.id, selectedProgIdsForAssignment);
      showToast(`Programme assignments updated for ${guestForAssignment.name}!`);
      refreshData();
      setIsAssignmentModalOpen(false);
      if (activeGuestProfile && activeGuestProfile.id === guestForAssignment.id) {
        const refreshed = festivalStore.getProgrammeGuestById(guestForAssignment.id, { includePrivate: true });
        setActiveGuestProfile(refreshed);
      }
    } catch (err) {
      alert(err.message || 'Assignment failed.');
    }
  };

  // Quick Invitation Status Update
  const handleQuickInvitationStatus = (guestId, newStatus) => {
    try {
      festivalStore.updateGuestInvitationStatus(guestId, newStatus, 'Super Admin');
      showToast(`Invitation status updated to ${newStatus}`);
      refreshData();
      if (activeGuestProfile && activeGuestProfile.id === guestId) {
        setActiveGuestProfile(prev => ({ ...prev, invitationStatus: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Update failed.');
    }
  };

  // Quick Participation Status Update
  const handleQuickParticipationStatus = (guestId, newStatus) => {
    try {
      festivalStore.updateGuestParticipationStatus(guestId, newStatus, 'Super Admin');
      showToast(`Arrival/Participation status: ${newStatus}`);
      refreshData();
      if (activeGuestProfile && activeGuestProfile.id === guestId) {
        setActiveGuestProfile(prev => ({ ...prev, participationStatus: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Update failed.');
    }
  };

  // Toggle Publish
  const handleTogglePublish = (guestId) => {
    try {
      const res = festivalStore.toggleGuestPublish(guestId);
      showToast(`Public visibility: ${res.guest.isPublished ? 'Published' : 'Hidden'}`);
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Guest Confirm
  const handleDeleteConfirm = () => {
    if (!guestToDelete) return;
    try {
      festivalStore.deleteProgrammeGuest(guestToDelete.id, { force: true });
      showToast(`Guest profile "${guestToDelete.name}" deleted.`);
      refreshData();
      setIsDeleteModalOpen(false);
      setGuestToDelete(null);
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  // Handle Save Category
  const handleSaveCategory = (e) => {
    e.preventDefault();
    try {
      festivalStore.addGuestCategory(categoryForm);
      showToast(`New category "${categoryForm.name}" created!`);
      refreshData();
      setIsCategoryModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save category.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Guest ID', 'Name', 'Malayalam Name', 'Designation', 'Organization', 'Category', 'Invitation Status', 'Participation Status', 'Arrival Date', 'Assigned Programmes Count', 'Public Published'];
    const rows = filteredGuests.map(g => [
      `"${g.id}"`,
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${(g.malayalamName || '').replace(/"/g, '""')}"`,
      `"${(g.designation || '').replace(/"/g, '""')}"`,
      `"${(g.organization || '').replace(/"/g, '""')}"`,
      `"${g.category || ''}"`,
      `"${g.invitationStatus || ''}"`,
      `"${g.participationStatus || ''}"`,
      `"${g.arrivalDate || ''}"`,
      `"${g.assignedProgrammeCount || 0}"`,
      `"${g.isPublished ? 'Yes' : 'No'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_fest_guest_dossier_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Official Guest Dossier CSV downloaded.');
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
        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none opacity-40" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E6A916] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Dignitary & Scholastic Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
              Programme Guest Management
            </h2>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
              Keynote scholars, academic conclave speakers, VIP invitation workflows, and stage session alignments for Dalenzia Fest 2K26.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E6A916] text-[#A91F35] font-black text-xs sm:text-sm shadow-md hover:bg-amber-400 active:scale-95 transition-all"
            >
              <UserPlus className="w-4 h-4 stroke-[3]" />
              <span>Add New Guest</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier (CSV)</span>
            </button>

            <button
              onClick={refreshData}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
              title="Refresh Guest Store"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="mt-8 pt-4 border-t border-white/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Guest Dashboard', icon: Users },
            { id: 'directory', label: `All Guests (${guests.length})`, icon: List },
            { id: 'assignment', label: 'Programme Assignment Matrix', icon: Calendar },
            { id: 'invitations', label: 'Invitation & Protocol Desk', icon: Send },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Tag }
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
      {/* 2. TAB CONTENT: GUEST DASHBOARD                                          */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Statistics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { label: 'TOTAL GUESTS', value: stats.totalGuests, sub: 'Confirmed & Invited', icon: Users, color: 'text-stone-800' },
              { label: 'CONFIRMED DIGNITARIES', value: stats.confirmedGuests, sub: 'Attendance Locked', icon: CheckCircle2, color: 'text-emerald-600' },
              { label: 'PENDING INVITATIONS', value: stats.pendingInvitations, sub: 'Awaiting Response', icon: Clock, color: 'text-amber-600' },
              { label: 'ASSIGNED TO STAGES', value: stats.assignedGuests, sub: 'Programmes Linked', icon: Calendar, color: 'text-[#A91F35]' },
              { label: 'UNASSIGNED GUESTS', value: stats.unassignedGuests, sub: 'Needs Session Slot', icon: AlertTriangle, color: 'text-purple-600' }
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold tracking-wider text-stone-500 uppercase">{kpi.label}</span>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-serif font-black text-[#1c1917]">{kpi.value}</div>
                    <div className="text-[11px] font-semibold text-stone-400 mt-0.5">{kpi.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle Row: Category Distribution & Invitation Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Breakdown (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-black text-[#1c1917]">Dignitary Category Breakdown</h3>
                  <p className="text-xs text-stone-500 font-medium">Distribution across official guest honorific tiers</p>
                </div>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="text-xs font-bold text-[#A91F35] hover:underline"
                >
                  View All Categories
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {stats.categoryBreakdown.map((cat, idx) => {
                  const pct = stats.totalGuests > 0 ? Math.round((cat.count / stats.totalGuests) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.name}
                        </span>
                        <span>{cat.count} Dignitaries ({pct}%)</span>
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

            {/* Invitation Status Tracker (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">Invitation & Protocol Status</h3>
                <p className="text-xs text-stone-500 font-medium">Real-time attendance confirmation tracker</p>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { label: 'Confirmed Dignitaries', count: stats.confirmedGuests, status: 'Confirmed', icon: CheckCircle2 },
                  { label: 'Invitations Pending / Sent', count: stats.pendingInvitations, status: 'Invitation Sent', icon: Clock },
                  { label: 'Declined / Regrets', count: stats.declinedInvitations, status: 'Declined', icon: X }
                ].map((item, idx) => {
                  const st = INVITATION_STATUS_CONFIG[item.status];
                  return (
                    <div key={idx} className={`p-4 rounded-2xl border ${st.bg} ${st.border} flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${st.text}`} />
                        <div>
                          <div className={`text-xs font-black ${st.text}`}>{item.label}</div>
                          <div className="text-[10px] text-stone-500 font-semibold">Official Protocol Pipeline</div>
                        </div>
                      </div>
                      <span className={`text-lg font-serif font-black ${st.text}`}>
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Keynote Guest Showcase Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">Keynote Scholars & Session Lineup</h3>
                <p className="text-xs text-stone-500 font-medium">Assigned stage conclaves and scholastic lectures</p>
              </div>
              <button
                onClick={() => setActiveTab('directory')}
                className="text-xs font-bold text-[#A91F35] hover:underline"
              >
                View Full Guest Directory &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {guests.slice(0, 4).map(guest => (
                <div
                  key={guest.id}
                  onClick={() => openProfileDrawer(guest)}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-[#A91F35] hover:shadow-md cursor-pointer transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 border-2 border-[#E6A916] shrink-0">
                        <img
                          src={guest.photoUrl}
                          alt={guest.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/assets/guests/portrait_muhammed_rashid.png';
                          }}
                        />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-[#A91F35] uppercase tracking-wider block">
                          {guest.category}
                        </span>
                        <h4 className="text-xs font-serif font-black text-stone-900 truncate">
                          {guest.name}
                        </h4>
                        <div className="text-[10px] text-stone-500 truncate">{guest.designation}</div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {guest.shortBio || guest.bio}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 text-[11px] font-semibold text-stone-500 space-y-1">
                    {guest.assignedProgrammes && guest.assignedProgrammes.length > 0 ? (
                      <div className="text-stone-800 font-bold flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-[#E6A916] shrink-0" />
                        <span className="truncate">{guest.assignedProgrammes[0].title}</span>
                      </div>
                    ) : (
                      <div className="text-purple-600 font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Yet to be assigned to stage</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB CONTENT: ALL GUESTS DIRECTORY                                     */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6 animate-fade-in">
          {/* Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guest name, designation, organization..."
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

              {/* Invitation Status Filter */}
              <div>
                <select
                  value={selectedInvitationStatus}
                  onChange={(e) => setSelectedInvitationStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Invitation Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Invitation Sent">Invitation Sent</option>
                  <option value="Invitation Pending">Invitation Pending</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              {/* Assignment Filter */}
              <div>
                <select
                  value={selectedAssignmentStatus}
                  onChange={(e) => setSelectedAssignmentStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                >
                  <option value="all">All Stage Assignments</option>
                  <option value="assigned">Assigned to Programme</option>
                  <option value="unassigned">Unassigned (Needs Slot)</option>
                </select>
              </div>
            </div>

            {/* Sub-Filters / Sort & Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-stone-500 font-semibold">
              <div>
                Showing <strong>{filteredGuests.length}</strong> of {guests.length} guest records
                {(searchQuery || selectedCategory !== 'all' || selectedInvitationStatus !== 'all' || selectedAssignmentStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedInvitationStatus('all');
                      setSelectedAssignmentStatus('all');
                    }}
                    className="text-[#A91F35] font-bold hover:underline ml-2"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-stone-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-stone-700 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="name">Full Name</option>
                  <option value="designation">Designation</option>
                  <option value="organization">Organization</option>
                  <option value="status">Invitation Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-black uppercase text-stone-500 tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Dignitary</th>
                    <th className="py-3.5 px-4">Designation & Institution</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Assigned Programmes</th>
                    <th className="py-3.5 px-4">Invitation Status</th>
                    <th className="py-3.5 px-4">Participation</th>
                    <th className="py-3.5 px-4">Public</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-400">
                        <Users className="w-10 h-10 mx-auto mb-2 text-stone-300" />
                        <div className="font-serif text-base text-stone-700 font-bold">No guest profiles found</div>
                        <div className="text-xs text-stone-400">Try adjusting your filters or search query.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map(guest => {
                      const invSt = INVITATION_STATUS_CONFIG[guest.invitationStatus] || INVITATION_STATUS_CONFIG['Invitation Pending'];
                      return (
                        <tr key={guest.id} className="hover:bg-amber-50/30 transition-colors">
                          {/* Photo & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 border border-[#E6A916] shrink-0">
                                <img
                                  src={guest.photoUrl}
                                  alt={guest.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/assets/guests/portrait_muhammed_rashid.png';
                                  }}
                                />
                              </div>
                              <div>
                                <button
                                  onClick={() => openProfileDrawer(guest)}
                                  className="text-left font-serif font-black text-stone-900 hover:text-[#A91F35] text-sm block"
                                >
                                  {guest.name}
                                </button>
                                {guest.malayalamName && (
                                  <div className="text-[11px] text-stone-400 font-normal">{guest.malayalamName}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Designation & Organization */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-800">{guest.designation}</div>
                            <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                              {guest.organization || 'Dars Academic Council'}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#A91F35]/10 text-[#A91F35]">
                              <Tag className="w-3 h-3 text-[#E6A916]" />
                              {guest.category}
                            </span>
                          </td>

                          {/* Assigned Programmes */}
                          <td className="py-3.5 px-4">
                            {guest.assignedProgrammes && guest.assignedProgrammes.length > 0 ? (
                              <div className="space-y-1">
                                {guest.assignedProgrammes.map(p => (
                                  <div
                                    key={p.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-bold mr-1 mb-1 border border-blue-200/60"
                                  >
                                    <Calendar className="w-3 h-3 text-blue-600" />
                                    <span className="truncate max-w-[150px]">{p.title}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>Unassigned</span>
                              </span>
                            )}
                          </td>

                          {/* Invitation Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={guest.invitationStatus}
                              onChange={(e) => handleQuickInvitationStatus(guest.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${invSt.bg} ${invSt.text} ${invSt.border} focus:outline-none cursor-pointer`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Invitation Sent">Invitation Sent</option>
                              <option value="Invitation Pending">Invitation Pending</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>

                          {/* Participation Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={guest.participationStatus || 'Arrival Pending'}
                              onChange={(e) => handleQuickParticipationStatus(guest.id, e.target.value)}
                              className="px-2.5 py-1 rounded-full text-[11px] font-bold border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none cursor-pointer"
                            >
                              <option value="Arrival Pending">Arrival Pending</option>
                              <option value="Arrived on Campus">Arrived on Campus</option>
                              <option value="Session Completed">Session Completed</option>
                              <option value="Did Not Attend">Did Not Attend</option>
                            </select>
                          </td>

                          {/* Public Toggle */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleTogglePublish(guest.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                guest.isPublished
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                              }`}
                            >
                              {guest.isPublished ? 'Live' : 'Hidden'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                            <button
                              onClick={() => openProfileDrawer(guest)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                              title="View Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openAssignmentModal(guest)}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                              title="Assign Programmes"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(guest)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Edit Guest"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setGuestToDelete(guest);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                              title="Delete Profile"
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
      {/* 4. TAB CONTENT: PROGRAMME ASSIGNMENT MATRIX                               */}
      {/* ========================================================================= */}
      {activeTab === 'assignment' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">Dignitary Programme Assignment Matrix</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Many-to-many relationship linking guests to festival sessions, conclaves and awards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {programmes.map(prog => {
                // Find all guests assigned to this programme
                const assignedGuests = guests.filter(g =>
                  Array.isArray(g.assignedProgrammeIds) && g.assignedProgrammeIds.includes(prog.id)
                );

                return (
                  <div
                    key={prog.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                          {prog.code || prog.id}
                        </span>
                        <span className="text-[11px] font-bold text-[#A91F35]">
                          {prog.time} · {prog.date}
                        </span>
                      </div>

                      <h4 className="text-sm font-serif font-black text-stone-900">{prog.title}</h4>
                      <div className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#A91F35]" />
                        <span>{prog.venue}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200/80 space-y-2">
                      <div className="text-[10px] font-extrabold uppercase text-stone-400">Assigned Dignitaries ({assignedGuests.length})</div>
                      {assignedGuests.length === 0 ? (
                        <div className="text-xs text-stone-400 italic">No guests assigned yet.</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {assignedGuests.map(g => (
                            <div
                              key={g.id}
                              onClick={() => openProfileDrawer(g)}
                              className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white border border-stone-200 text-xs font-bold text-stone-800 shadow-2xs cursor-pointer hover:border-[#A91F35]"
                            >
                              <img
                                src={g.photoUrl}
                                alt={g.name}
                                className="w-6 h-6 rounded-full object-cover"
                                onError={(e) => { e.target.src = '/assets/guests/portrait_muhammed_rashid.png'; }}
                              />
                              <span>{g.name}</span>
                            </div>
                          ))}
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
      {/* 5. TAB CONTENT: INVITATION & PROTOCOL DESK                                */}
      {/* ========================================================================= */}
      {activeTab === 'invitations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-serif font-black text-[#1c1917]">VIP Protocol & Hospitality Desk</h3>
              <p className="text-xs text-stone-500 font-medium">
                Confidential travel coordination, airport convoys, accommodation suites, and dietary requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guests.map(guest => (
                <div
                  key={guest.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-white space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-[#E6A916] shrink-0">
                        <img
                          src={guest.photoUrl}
                          alt={guest.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/assets/guests/portrait_muhammed_rashid.png'; }}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-black text-stone-900">{guest.name}</h4>
                        <div className="text-[11px] text-stone-500">{guest.designation}</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {guest.invitationStatus}
                    </span>
                  </div>

                  {/* Private Contact Information (Admin-Only) */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-800 tracking-wider">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>Confidential Administration Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Direct Phone</span>
                        <span className="font-mono font-bold">{guest.contactPhone || 'Private on File'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Official Email</span>
                        <span className="font-mono font-bold truncate block">{guest.contactEmail || 'Private on File'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Protocol Notes */}
                  {guest.specialNotes && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-stone-400">Protocol & Convoy Notes</span>
                      <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 leading-relaxed">
                        {guest.specialNotes}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div className="text-stone-500">
                      Arrival: <strong>{guest.arrivalDate || 'Dec 21, 2026'}</strong> ({guest.arrivalTime || 'TBD'})
                    </div>
                    <button
                      onClick={() => openProfileDrawer(guest)}
                      className="text-[#A91F35] font-bold hover:underline"
                    >
                      View Full Dossier &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: GUEST CATEGORIES                                          */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">Official Guest Categories</h3>
                <p className="text-xs text-stone-500 font-medium">Configure categories governing dignitary designations and public badges.</p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#A91F35] text-white font-bold text-xs shadow-md hover:bg-[#8B1A2C]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {categories.map(cat => (
                <div key={cat.id} className="p-4 rounded-2xl border border-stone-200 bg-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <div>
                      <div className="text-sm font-serif font-black text-stone-900">{cat.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono font-bold">{cat.code}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold">
                    {cat.guestCount || 0} Guests
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: ADD / EDIT GUEST PROFILE                                        */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-serif font-black text-[#1c1917]">
                  {editingGuest ? 'Edit Dignitary Profile' : 'Add New Dignitary / Guest'}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {editingGuest ? `Updating ${editingGuest.name} (${editingGuest.id})` : 'Register a keynote scholar or visiting dignitary'}
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

            <form onSubmit={handleSaveGuest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    value={guestForm.name}
                    onChange={(e) => setProgGuestForm({ ...guestForm, name: e.target.value })}
                    placeholder="e.g. Usthad Muhammed Rashid"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                    required
                  />
                </div>

                {/* Malayalam Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Malayalam Name (Optional)</label>
                  <input
                    type="text"
                    value={guestForm.malayalamName}
                    onChange={(e) => setProgGuestForm({ ...guestForm, malayalamName: e.target.value })}
                    placeholder="e.g. ഉസ്താദ് മുഹമ്മദ് റാഷിദ്"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Designation / Title *</label>
                  <input
                    type="text"
                    value={guestForm.designation}
                    onChange={(e) => setProgGuestForm({ ...guestForm, designation: e.target.value })}
                    placeholder="e.g. Scholar & Speaker"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                    required
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Organization / Institution</label>
                  <input
                    type="text"
                    value={guestForm.organization}
                    onChange={(e) => setProgGuestForm({ ...guestForm, organization: e.target.value })}
                    placeholder="e.g. Dars Academic Council, Ayiroor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Honorific Category *</label>
                  <select
                    value={guestForm.category}
                    onChange={(e) => setProgGuestForm({ ...guestForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Invitation Status */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Invitation Status</label>
                  <select
                    value={guestForm.invitationStatus}
                    onChange={(e) => setProgGuestForm({ ...guestForm, invitationStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Invitation Sent">Invitation Sent</option>
                    <option value="Invitation Pending">Invitation Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                {/* Photo URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Profile Photo Asset Path</label>
                  <input
                    type="text"
                    value={guestForm.photoUrl}
                    onChange={(e) => setProgGuestForm({ ...guestForm, photoUrl: e.target.value })}
                    placeholder="/assets/guests/portrait_muhammed_rashid.png"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Short Bio */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Short Biography (Public Preview)</label>
                  <textarea
                    rows={2}
                    value={guestForm.shortBio}
                    onChange={(e) => setProgGuestForm({ ...guestForm, shortBio: e.target.value })}
                    placeholder="Concise 1-2 sentence overview for cards..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Detailed Bio */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Scholastic Biography</label>
                  <textarea
                    rows={3}
                    value={guestForm.bio}
                    onChange={(e) => setProgGuestForm({ ...guestForm, bio: e.target.value })}
                    placeholder="Comprehensive academic and literary background..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                {/* Private Contact Section */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Confidential Administration Details (Hidden from Public Website)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Private Contact Phone</label>
                      <input
                        type="text"
                        value={guestForm.contactPhone}
                        onChange={(e) => setProgGuestForm({ ...guestForm, contactPhone: e.target.value })}
                        placeholder="+91 94471 28910"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Private Email</label>
                      <input
                        type="email"
                        value={guestForm.contactEmail}
                        onChange={(e) => setProgGuestForm({ ...guestForm, contactEmail: e.target.value })}
                        placeholder="guest@dalenziafest.in"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35] bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Protocol, Flight & Accommodation Notes</label>
                    <textarea
                      rows={2}
                      value={guestForm.specialNotes}
                      onChange={(e) => setProgGuestForm({ ...guestForm, specialNotes: e.target.value })}
                      placeholder="e.g. VIP Suite 1 reserved at Ayiroor Guest House; Convoy pickup from CCJ Airport at 03:00 PM."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35] bg-white"
                    />
                  </div>
                </div>

                {/* Public Publish Toggle */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="guestPub"
                    checked={guestForm.isPublished}
                    onChange={(e) => setProgGuestForm({ ...guestForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#A91F35] rounded focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="guestPub" className="text-xs font-bold text-stone-800 cursor-pointer">
                    Publish approved profile to public website Guests of Honour page
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#A91F35] text-white font-black text-xs hover:bg-[#8B1A2C] shadow-md"
                >
                  {editingGuest ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: GUEST PROFILE DOSSIER (DRAWER)                                   */}
      {/* ========================================================================= */}
      {isProfileModalOpen && activeGuestProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-stone-100 text-stone-800">
                  {activeGuestProfile.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A91F35]/10 text-[#A91F35]">
                  {activeGuestProfile.category}
                </span>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E6A916] bg-stone-100 shrink-0 shadow-md">
                  <img
                    src={activeGuestProfile.photoUrl}
                    alt={activeGuestProfile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/assets/guests/portrait_muhammed_rashid.png'; }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-black text-stone-900">{activeGuestProfile.name}</h3>
                  {activeGuestProfile.malayalamName && (
                    <div className="text-xs text-stone-500 font-medium">{activeGuestProfile.malayalamName}</div>
                  )}
                  <div className="text-xs font-bold text-[#A91F35] mt-0.5">
                    {activeGuestProfile.designation} · {activeGuestProfile.organization}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400">Scholastic Biography</span>
                <p className="text-xs text-stone-700 bg-stone-50/60 p-3 rounded-2xl border border-stone-100 leading-relaxed">
                  {activeGuestProfile.bio || activeGuestProfile.shortBio}
                </p>
              </div>

              {/* Assigned Programmes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Assigned Stage Programmes</span>
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      openAssignmentModal(activeGuestProfile);
                    }}
                    className="text-xs font-bold text-[#A91F35] hover:underline"
                  >
                    Manage Assignments
                  </button>
                </div>

                {activeGuestProfile.assignedProgrammes && activeGuestProfile.assignedProgrammes.length > 0 ? (
                  <div className="space-y-2">
                    {activeGuestProfile.assignedProgrammes.map(prog => (
                      <div key={prog.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-stone-900">{prog.title}</div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-[#E6A916]" />
                            <span>{prog.time} · {prog.date}</span>
                            <span>•</span>
                            <MapPin className="w-3 h-3 text-[#A91F35]" />
                            <span>{prog.venue}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-blue-200 text-blue-800">
                          {prog.code || prog.id}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>This dignitary is currently unassigned. Click "Manage Assignments" to link to a stage session.</span>
                  </div>
                )}
              </div>

              {/* Confidential Administration Dossier */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-900 tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Confidential Administration Dossier (Admin Only)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">Contact Phone</span>
                    <span className="font-mono font-bold">{activeGuestProfile.contactPhone || 'Private on File'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold">Official Email</span>
                    <span className="font-mono font-bold truncate block">{activeGuestProfile.contactEmail || 'Private on File'}</span>
                  </div>
                </div>
                {activeGuestProfile.specialNotes && (
                  <div className="pt-2 border-t border-amber-200 text-xs text-stone-700">
                    <span className="text-[10px] text-stone-400 block font-bold">VIP Logistics & Notes</span>
                    <div>{activeGuestProfile.specialNotes}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  openEditModal(activeGuestProfile);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs hover:bg-stone-200"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#A91F35] text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: MULTI-PROGRAMME ASSIGNMENT                                      */}
      {/* ========================================================================= */}
      {isAssignmentModalOpen && guestForAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-[#1c1917]">Assign Stage Programmes</h3>
                <p className="text-xs text-stone-500 font-medium">Select one or multiple festival programmes for {guestForAssignment.name}</p>
              </div>
              <button onClick={() => setIsAssignmentModalOpen(false)} className="p-1 rounded-lg text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {programmes.map(prog => {
                const isSelected = selectedProgIdsForAssignment.includes(prog.id);
                return (
                  <label
                    key={prog.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected ? 'bg-amber-50/50 border-[#A91F35]' : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProgIdsForAssignment([...selectedProgIdsForAssignment, prog.id]);
                          } else {
                            setSelectedProgIdsForAssignment(selectedProgIdsForAssignment.filter(id => id !== prog.id));
                          }
                        }}
                        className="w-4 h-4 text-[#A91F35] rounded focus:ring-0 cursor-pointer"
                      />
                      <div className="truncate">
                        <div className="text-xs font-serif font-black text-stone-900 truncate">{prog.title}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <span>{prog.date} · {prog.time}</span>
                          <span>•</span>
                          <span className="truncate">{prog.venue}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 shrink-0 ml-2">
                      {prog.code || prog.id}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignments}
                className="px-5 py-2 rounded-xl bg-[#A91F35] text-white font-black text-xs hover:bg-[#8B1A2C] shadow-md"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL: ADD GUEST CATEGORY                                             */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-serif font-black text-[#1c1917]">Create Guest Category</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Presidium Scholar"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Code (3-4 uppercase chars)</label>
                <input
                  type="text"
                  value={categoryForm.code}
                  onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. PRS"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Theme Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-stone-600">{categoryForm.color}</span>
                </div>
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
      {/* 11. MODAL: DELETE CONFIRMATION                                            */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && guestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-serif font-black text-stone-900">Delete Guest Profile?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete <strong>{guestToDelete.name}</strong> ({guestToDelete.id})? This will also remove their assignment from any linked festival programmes.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
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
