import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  UserCheck,
  UserPlus,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  Download,
  Share2,
  Printer,
  FileSpreadsheet,
  History,
  ShieldAlert,
  AlertTriangle,
  Eye,
  RefreshCw,
  Building,
  GraduationCap,
  Sparkles,
  ChevronDown,
  X,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Check,
  Copy,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import RegistrationTicketCard from './RegistrationTicketCard';

export default function RegistrationDeskModule({ userSession, portalRole = 'admin' }) {
  // Real-time store state
  const [registrations, setRegistrations] = useState(() => festivalStore.getRegistrations());
  const [stats, setStats] = useState(() => festivalStore.getRegistrationStats());
  const [auditLogs, setAuditLogs] = useState(() => festivalStore.getRegistrationAuditLogs());
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toLocaleTimeString());

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isRegisterStudentModalOpen, setIsRegisterStudentModalOpen] = useState(false);
  const [isRegisterExternalModalOpen, setIsRegisterExternalModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedTicketRegistration, setSelectedTicketRegistration] = useState(null);
  const [selectedStudentPassData, setSelectedStudentPassData] = useState(null);

  // Student Search inside Register Student Modal
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentRegistrationNotes, setStudentRegistrationNotes] = useState('');
  const [studentDuplicateWarning, setStudentDuplicateWarning] = useState(null);

  // External Participant Form State
  const [externalForm, setExternalForm] = useState({
    name: '',
    institution: '',
    classCategory: 'Degree',
    phone: '',
    email: '',
    place: '',
    gender: 'Male',
    notes: ''
  });
  const [externalError, setExternalError] = useState('');

  // Ticket Verification Modal State
  const [verifySearchInput, setVerifySearchInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  // Subscribe to real-time store changes and cross-tab storage events
  useEffect(() => {
    const refreshData = () => {
      setRegistrations(festivalStore.getRegistrations());
      setStats(festivalStore.getRegistrationStats());
      setAuditLogs(festivalStore.getRegistrationAuditLogs());
      setLastSyncTime(new Date().toLocaleTimeString());
    };

    const unsubscribe = festivalStore.subscribe(refreshData);

    const handleStorageEvent = (e) => {
      if (e.key === 'dalenzia_registrations' || e.key === 'dalenzia_audit_logs') {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Filter registrations list
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // Type match
      const isStudent = reg.type === 'existing_student' || reg.type === 'Dars Student' || reg.type === 'student' || Boolean(reg.studentId);
      if (typeFilter === 'student' && !isStudent) return false;
      if (typeFilter === 'external' && isStudent) return false;

      // Status match
      if (statusFilter !== 'all' && reg.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      // Query match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        reg.ticketId?.toLowerCase().includes(q) ||
        reg.participantName?.toLowerCase().includes(q) ||
        reg.studentId?.toLowerCase().includes(q) ||
        reg.chestNo?.toLowerCase().includes(q) ||
        reg.institution?.toLowerCase().includes(q) ||
        reg.phone?.toLowerCase().includes(q) ||
        reg.place?.toLowerCase().includes(q)
      );
    });
  }, [registrations, typeFilter, statusFilter, searchQuery]);

  // Handle Dars Student search in Option A modal
  const matchingStudents = useMemo(() => {
    if (!studentSearchTerm.trim()) return [];
    return festivalStore.findStudentForRegistration(studentSearchTerm);
  }, [studentSearchTerm]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    // Check if duplicate registration exists
    const duplicate = registrations.find(
      (r) => r.studentId === student.id && r.status !== 'Cancelled'
    );
    if (duplicate) {
      setStudentDuplicateWarning(duplicate);
    } else {
      setStudentDuplicateWarning(null);
    }
  };

  const handleRegisterExistingStudentSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (studentDuplicateWarning) {
      alert(`Student ${selectedStudent.name} is already registered with Ticket ID ${studentDuplicateWarning.ticketId}. Duplicate registrations are prevented.`);
      return;
    }

    try {
      const reg = festivalStore.registerExistingStudent({
        studentId: selectedStudent.id,
        notes: studentRegistrationNotes,
        registeredBy: portalRole === 'convener' ? 'Convener' : 'Admin'
      });

      // Close modal and show ticket card
      setIsRegisterStudentModalOpen(false);
      setSelectedStudent(null);
      setStudentSearchTerm('');
      setStudentRegistrationNotes('');
      setSelectedTicketRegistration(reg);
    } catch (err) {
      alert(err.message || 'Failed to register student');
    }
  };

  // Handle External Participant submit in Option B modal
  const handleRegisterExternalSubmit = (e) => {
    e.preventDefault();
    setExternalError('');

    if (!externalForm.name.trim()) {
      setExternalError('Participant Full Name is required.');
      return;
    }
    if (!externalForm.institution.trim()) {
      setExternalError('Institution / Campus is required.');
      return;
    }
    if (!externalForm.phone.trim()) {
      setExternalError('Contact Phone / WhatsApp is required.');
      return;
    }

    try {
      const reg = festivalStore.registerExternalParticipant({
        ...externalForm,
        registeredBy: portalRole === 'convener' ? 'Convener' : 'Admin'
      });

      // Reset form, close modal, show ticket
      setExternalForm({
        name: '',
        institution: '',
        classCategory: 'Degree',
        phone: '',
        email: '',
        place: '',
        gender: 'Male',
        notes: ''
      });
      setIsRegisterExternalModalOpen(false);
      setSelectedTicketRegistration(reg);
    } catch (err) {
      setExternalError(err.message || 'Failed to register external participant');
    }
  };

  // Status Change Handlers
  const handleUpdateStatus = (ticketId, newStatus) => {
    try {
      festivalStore.updateRegistrationStatus(
        ticketId,
        newStatus,
        portalRole === 'convener' ? 'Convener' : 'Admin'
      );
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  // Reissue Ticket
  const handleReissueTicket = (ticketId) => {
    if (window.confirm(`Are you sure you want to reissue ticket for ${ticketId}? The previous ticket will be invalidated.`)) {
      try {
        const newTicket = festivalStore.reissueRegistrationTicket(
          ticketId,
          'Reissued by desk controller',
          portalRole === 'convener' ? 'Convener' : 'Admin'
        );
        setSelectedTicketRegistration(newTicket);
      } catch (err) {
        alert(err.message || 'Failed to reissue ticket');
      }
    }
  };

  // Verification lookup
  const handleVerifyTicketSubmit = (e) => {
    e.preventDefault();
    setVerifyError('');
    setVerifyResult(null);

    if (!verifySearchInput.trim()) {
      setVerifyError('Please enter a Ticket ID (e.g. DLZ-2026-0001) or Verification Code.');
      return;
    }

    const res = festivalStore.verifyTicket(verifySearchInput.trim());
    if (res.valid) {
      setVerifyResult(res.registration);
    } else {
      setVerifyError(res.message || 'Invalid ticket or record not found.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = festivalStore.exportRegistrationsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DALENZIA_2K26_REGISTRATIONS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View Authentic Student ID Pass
  const handleViewStudentPass = (studentId) => {
    try {
      const passData = festivalStore.getStudentIdCardData(studentId);
      setSelectedStudentPassData(passData);
    } catch (e) {
      console.error(e);
      alert('Could not load student pass data.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & OPERATIONAL BAR                                           */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#A91F35] via-[#8D182B] to-[#701322] text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Decorative Golden Ambient Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E6A916]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Centralized Admissions Hub</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold flex items-center gap-1.5 border border-white/10">
                <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Synchronized ({portalRole === 'convener' ? 'Convener Portal' : 'Main Admin'})</span>
              </span>

              <span className="text-white/60 text-[11px]">
                Updated: {lastSyncTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#F7F3E9]">
              Festival Registration Desk
            </h1>

            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
              Official candidate admissions and credential generation for <strong>DALENZIA FEST 2K26</strong>.
              Shared in real-time between Main Admin Panel and Convener Portal with dual logo verified digital tickets.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setStudentSearchTerm('');
                setSelectedStudent(null);
                setStudentDuplicateWarning(null);
                setIsRegisterStudentModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#E6A916] hover:bg-[#d49b14] text-[#A91F35] font-black text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>+ Register Dars Student</span>
            </button>

            <button
              onClick={() => {
                setExternalError('');
                setIsRegisterExternalModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-[#A91F35] font-black text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#A91F35]" />
              <span>+ Register External</span>
            </button>

            <button
              onClick={() => {
                setVerifySearchInput('');
                setVerifyResult(null);
                setVerifyError('');
                setIsVerifyModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#E6A916]" />
              <span>Verify QR / Ticket</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
              title="Export all registrations to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">CSV Export</span>
            </button>

            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="px-3 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
              title="View Audit Trail"
            >
              <History className="w-4 h-4 text-stone-300" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SIX DYNAMIC STATISTICS CARDS                                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Stat 1: Total Registrations */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Registrations
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-black text-stone-900">
            {stats.total}
          </div>
          <div className="text-[10px] text-stone-400 mt-1 font-semibold">
            All issued passes
          </div>
        </div>

        {/* Stat 2: Dars Students */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Dars Students
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#E6A916]/20 text-[#A91F35] flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-black text-[#A91F35]">
            {stats.existingStudents}
          </div>
          <div className="text-[10px] text-stone-400 mt-1 font-semibold">
            Internal candidates
          </div>
        </div>

        {/* Stat 3: External Participants */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              External Delegates
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-black text-blue-700">
            {stats.externalParticipants}
          </div>
          <div className="text-[10px] text-stone-400 mt-1 font-semibold">
            Guest institutions
          </div>
        </div>

        {/* Stat 4: Completed Registrations */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Confirmed / Active
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-black text-emerald-700">
            {stats.completed}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
            Ready for festival entry
          </div>
        </div>

        {/* Stat 5: Pending Registrations */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Pending
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-black text-amber-700">
            {stats.pending}
          </div>
          <div className="text-[10px] text-amber-600 mt-1 font-semibold">
            Awaiting desk check
          </div>
        </div>

        {/* Stat 6: Cancelled Registrations */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Cancelled
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-black text-rose-700">
            {stats.cancelled}
          </div>
          <div className="text-[10px] text-rose-600 mt-1 font-semibold">
            Revoked passes
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEARCH & FILTER CONTROLS BAR                                           */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by participant name, Ticket ID (DLZ-.../EXT-...), Student ID, phone, or institution..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
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
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-500 font-bold">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Registrations</option>
              <option value="student">Dars Students</option>
              <option value="external">External Delegates</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
            <span className="text-stone-500 font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed / Active</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <span className="text-xs font-bold text-stone-500 ml-1">
            Showing: <strong>{filteredRegistrations.length}</strong> of {registrations.length}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. REGISTRATIONS DATA TABLE & ACTION LIST                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-stone-600 font-bold border-b border-stone-200/80 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Participant & Details</th>
                <th className="py-3.5 px-4">Type & Category</th>
                <th className="py-3.5 px-4">Institution / Campus</th>
                <th className="py-3.5 px-4">Registered Info</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 px-4">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center mb-3">
                        <ClipboardCheck className="w-7 h-7" />
                      </div>
                      {registrations.length === 0 ? (
                        <>
                          <h4 className="font-serif font-black text-stone-800 text-base mb-1">
                            Registration Desk Active & Verified
                          </h4>
                          <p className="text-stone-500 text-xs leading-relaxed mb-4 text-center">
                            All development demo records have been cleaned. The registration desk is clear and ready to issue authentic admission passes for Dalailussunna Dars students and external delegates.
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                              onClick={() => setIsRegisterStudentModalOpen(true)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all cursor-pointer shadow-sm"
                            >
                              + Register Dars Student
                            </button>
                            <button
                              onClick={() => setIsRegisterExternalModalOpen(true)}
                              className="px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-all cursor-pointer"
                            >
                              + Register External
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="font-serif font-black text-stone-800 text-base mb-1">
                            No matching registration records
                          </h4>
                          <p className="text-stone-500 text-xs text-center">
                            No issued passes match your search query or filter selection.
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const isDarsStudent = reg.type === 'existing_student' || reg.type === 'Dars Student' || reg.type === 'student' || Boolean(reg.studentId);
                  const isCancelled = reg.status.toLowerCase() === 'cancelled';
                  const isPending = reg.status.toLowerCase() === 'pending';

                  return (
                    <tr key={reg.id || reg.ticketId} className="hover:bg-amber-50/30 transition-colors">
                      {/* Ticket ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#A91F35]">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedTicketRegistration(reg)}
                            className="hover:underline flex items-center gap-1 cursor-pointer"
                            title="Click to view full digital ticket card"
                          >
                            <span>{reg.ticketId}</span>
                            <Eye className="w-3 h-3 text-stone-400" />
                          </button>
                        </div>
                        <span className="block text-[9px] text-stone-400 font-mono mt-0.5">
                          {reg.verificationCode}
                        </span>
                      </td>

                      {/* Participant & Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-sm">
                          {reg.participantName}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                          {reg.chestNo && (
                            <span className="font-semibold text-[#A91F35]">
                              Chest: {reg.chestNo}
                            </span>
                          )}
                          {reg.studentId && (
                            <span className="font-mono text-stone-600">
                              ID: {reg.studentId}
                            </span>
                          )}
                          {reg.teamName && (
                            <span className="text-stone-600">
                              Team: {reg.teamName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isDarsStudent
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}
                        >
                          {isDarsStudent ? 'Dars Student' : 'External Delegate'}
                        </span>
                        {reg.classCategory && (
                          <span className="block text-[11px] text-stone-600 mt-1 font-medium">
                            {reg.classCategory}
                          </span>
                        )}
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <span className="block font-semibold text-stone-800 truncate" title={reg.institution}>
                          {reg.institution || 'Dalailussunna Dars, Ayiroor'}
                        </span>
                        <div className="text-[11px] text-stone-400 truncate">
                          {reg.place || reg.phone || reg.email || '—'}
                        </div>
                      </td>

                      {/* Registered Date & By */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <span className="block font-medium text-stone-700">
                          {reg.registeredAt || '2026-11-20'}
                        </span>
                        <span className="block text-stone-400 text-[10px]">
                          By: {reg.registeredBy || 'Admin'}
                        </span>
                      </td>

                      {/* Status & Change Dropdown */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={reg.status}
                          onChange={(e) => handleUpdateStatus(reg.ticketId, e.target.value)}
                          className={`text-[11px] font-black rounded-full px-2.5 py-1 border transition-all cursor-pointer focus:outline-none ${
                            isCancelled
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : isPending
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedTicketRegistration(reg)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#A91F35] hover:text-white text-stone-600 transition-all cursor-pointer"
                            title="View / Print Digital Ticket"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          {isDarsStudent && reg.studentId && (
                            <button
                              onClick={() => handleViewStudentPass(reg.studentId)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-[#E6A916] hover:text-[#A91F35] text-amber-800 transition-all cursor-pointer"
                              title="View Authentic Dars Student ID Pass"
                            >
                              <IdCard className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleReissueTicket(reg.ticketId)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all cursor-pointer"
                            title="Reissue New Ticket ID"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* 5. MODAL: REGISTER EXISTING DALENZIA DARS STUDENT (OPTION A)              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isRegisterStudentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200"
            >
              {/* Header */}
              <div className="bg-[#A91F35] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-black">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#F7F3E9]">
                      Register Dalailussunna Dars Student
                    </h3>
                    <p className="text-[11px] text-white/80">
                      Search by Student ID, Chest No, or Name • Preserves Authentic ID Record
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRegisterStudentModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleRegisterExistingStudentSubmit} className="p-6 space-y-5">
                {/* Search Bar for Dars Student */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Search Registered Dars Student:
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      placeholder="Type Student ID (STU-1001), Chest No (C-101), or Name..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                    />
                  </div>

                  {/* Autocomplete Results dropdown */}
                  {studentSearchTerm.trim() && matchingStudents.length > 0 && !selectedStudent && (
                    <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-xl bg-white shadow-lg divide-y divide-stone-100 mt-1">
                      {matchingStudents.map((stu) => (
                        <button
                          key={stu.id}
                          type="button"
                          onClick={() => handleSelectStudent(stu)}
                          className="w-full p-2.5 text-left text-xs hover:bg-amber-50 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div>
                            <span className="font-bold text-stone-900">{stu.name}</span>
                            <span className="text-[11px] text-stone-500 ml-2">
                              ({stu.id} • Chest {stu.chestNo})
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                            {stu.teamName || stu.classCategory}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {studentSearchTerm.trim() && matchingStudents.length === 0 && !selectedStudent && (
                    <p className="text-xs text-stone-400 italic mt-1">
                      No matching Dars students found for "{studentSearchTerm}".
                    </p>
                  )}
                </div>

                {/* Selected Student Card */}
                {selectedStudent && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#E6A916]/50 space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudent(null);
                        setStudentDuplicateWarning(null);
                      }}
                      className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#A91F35] text-white text-[10px] font-black uppercase">
                        Selected Student
                      </span>
                      <span className="font-mono text-xs font-bold text-[#A91F35]">
                        {selectedStudent.id}
                      </span>
                    </div>

                    <div className="font-serif font-black text-lg text-stone-900">
                      {selectedStudent.name}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-1 border-t border-amber-200/60">
                      <div>Chest No: <strong>{selectedStudent.chestNo}</strong></div>
                      <div>Squad: <strong>{selectedStudent.teamName}</strong></div>
                      <div>Category: <strong>{selectedStudent.classCategory}</strong></div>
                      <div>Institution: <strong>Dalailussunna Dars, Ayiroor</strong></div>
                    </div>
                  </div>
                )}

                {/* Duplicate Registration Warning */}
                {studentDuplicateWarning && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-900 space-y-2">
                    <div className="flex items-center gap-2 font-black text-rose-700">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>DUPLICATE REGISTRATION PREVENTED</span>
                    </div>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      This student is already officially registered with Ticket ID{' '}
                      <strong className="font-mono text-rose-900">{studentDuplicateWarning.ticketId}</strong>.
                      To prevent duplicate entries and maintain authentic records, multiple tickets cannot be generated.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterStudentModalOpen(false);
                        setSelectedTicketRegistration(studentDuplicateWarning);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Existing Registration Ticket</span>
                    </button>
                  </div>
                )}

                {/* Additional Desk Notes / Requirements */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Registration Desk Notes / Requirements (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={studentRegistrationNotes}
                    onChange={(e) => setStudentRegistrationNotes(e.target.value)}
                    placeholder="e.g. Special accommodation, food preferences, stage duty remarks..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsRegisterStudentModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedStudent || Boolean(studentDuplicateWarning)}
                    className="px-6 py-2.5 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm & Issue Ticket (DLZ-2026)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. MODAL: REGISTER EXTERNAL PARTICIPANT (OPTION B)                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isRegisterExternalModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200"
            >
              {/* Header */}
              <div className="bg-[#A91F35] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#A91F35] flex items-center justify-center font-black">
                    <UserPlus className="w-5 h-5 text-[#A91F35]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#F7F3E9]">
                      Register External Participant / Delegate
                    </h3>
                    <p className="text-[11px] text-white/80">
                      Issues dedicated EXT-2026 Ticket • Stored in External Collection
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRegisterExternalModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleRegisterExternalSubmit} className="p-6 space-y-4">
                {externalError && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{externalError}</span>
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Participant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={externalForm.name}
                    onChange={(e) => setExternalForm({ ...externalForm, name: e.target.value })}
                    placeholder="Enter delegate full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                  />
                </div>

                {/* Institution & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Institution / College / Campus *
                    </label>
                    <input
                      type="text"
                      required
                      value={externalForm.institution}
                      onChange={(e) => setExternalForm({ ...externalForm, institution: e.target.value })}
                      placeholder="e.g. Farook College, Kozhikode"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Class / Academic Level
                    </label>
                    <select
                      value={externalForm.classCategory}
                      onChange={(e) => setExternalForm({ ...externalForm, classCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35] cursor-pointer"
                    >
                      <option value="Degree">Degree / Undergraduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                      <option value="Higher Secondary">Higher Secondary (+2)</option>
                      <option value="Dars Student (Other)">External Dars Student</option>
                      <option value="General Delegate">General Delegate / Scholar</option>
                    </select>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Contact Phone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={externalForm.phone}
                      onChange={(e) => setExternalForm({ ...externalForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={externalForm.email}
                      onChange={(e) => setExternalForm({ ...externalForm, email: e.target.value })}
                      placeholder="delegate@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                    />
                  </div>
                </div>

                {/* Place / District & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Place / District
                    </label>
                    <input
                      type="text"
                      value={externalForm.place}
                      onChange={(e) => setExternalForm({ ...externalForm, place: e.target.value })}
                      placeholder="e.g. Malappuram / Kozhikode"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Gender
                    </label>
                    <select
                      value={externalForm.gender}
                      onChange={(e) => setExternalForm({ ...externalForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35] cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* External Competitions Announcement Notice */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-2 font-black text-amber-800">
                    <Sparkles className="w-4 h-4 text-[#E6A916]" />
                    <span>EXTERNAL COMPETITION SELECTION: COMING SOON</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    External inter-institutional competition slots and schedule are currently being finalized.
                    Completing registration secures the candidate’s official festival pass and gate entry ticket.
                  </p>
                </div>

                {/* Desk Remarks */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Desk Remarks / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={externalForm.notes}
                    onChange={(e) => setExternalForm({ ...externalForm, notes: e.target.value })}
                    placeholder="e.g. Accompanied by campus delegation..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsRegisterExternalModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-black shadow-md transition-all cursor-pointer"
                  >
                    Issue External Pass (EXT-2026)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 7. MODAL: TICKET / QR CODE VERIFICATION TOOL                             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isVerifyModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
            >
              {/* Header */}
              <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-black">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#F7F3E9]">
                      Ticket & QR Code Verification
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Rapid desk validation for entrance, syllabus kit & stage admission
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVerifyModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <form onSubmit={handleVerifyTicketSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      Enter Ticket ID or Verification Code:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={verifySearchInput}
                        onChange={(e) => setVerifySearchInput(e.target.value)}
                        placeholder="e.g. DLZ-2026-0001, EXT-2026-0001, or V-..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35] font-mono font-bold"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </form>

                {/* Error Banner */}
                {verifyError && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}

                {/* Success Result Card */}
                {verifyResult && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Valid Pass</span>
                      </span>
                      <span className="font-mono font-black text-sm text-[#A91F35]">
                        {verifyResult.ticketId}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 uppercase font-bold">
                        Participant
                      </span>
                      <h4 className="font-serif font-black text-xl text-stone-900 capitalize">
                        {verifyResult.participantName}
                      </h4>
                      <p className="text-xs text-stone-600">
                        {verifyResult.type} • {verifyResult.classCategory}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 pt-2 border-t border-emerald-200">
                      <div>Institution: <strong>{verifyResult.institution}</strong></div>
                      <div>Status: <strong className="text-emerald-700">{verifyResult.status}</strong></div>
                      {verifyResult.studentId && <div>Student ID: <strong>{verifyResult.studentId}</strong></div>}
                      {verifyResult.chestNo && <div>Chest No: <strong>{verifyResult.chestNo}</strong></div>}
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsVerifyModalOpen(false);
                          setSelectedTicketRegistration(verifyResult);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Full Pass</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 8. MODAL: REGISTRATION AUDIT TRAIL LOGS                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200"
            >
              <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-stone-800 text-[#E6A916] flex items-center justify-center font-black">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#F7F3E9]">
                      Registration Desk Audit Trail
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Chronological history of ticket generation, status updates & reissues
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAuditModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-stone-100 text-xs">
                {auditLogs.length === 0 ? (
                  <p className="text-center py-8 text-stone-400">No audit log records recorded yet.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#A91F35]">{log.action}</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono text-[10px]">
                            {log.ticketId || log.studentId}
                          </span>
                        </div>
                        <p className="text-stone-700 mt-0.5">{log.details}</p>
                      </div>
                      <div className="text-right shrink-0 text-stone-400 text-[10px]">
                        <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div>By: {log.user}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 9. MODAL: DIGITAL REGISTRATION TICKET CARD (HIGH CREATIVITY)             */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedTicketRegistration && (
          <RegistrationTicketCard
            registration={selectedTicketRegistration}
            onClose={() => setSelectedTicketRegistration(null)}
            onViewStudentPass={handleViewStudentPass}
          />
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 10. MODAL: VIEW AUTHENTIC DARS STUDENT ID PASS                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedStudentPassData && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#E6A916]/40"
            >
              <div className="bg-[#A91F35] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IdCard className="w-5 h-5 text-[#E6A916]" />
                  <span className="font-serif font-black text-sm text-[#F7F3E9]">
                    Official Institutional Student ID Card
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStudentPassData(null)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 text-center space-y-4 bg-[#FAF8F5]">
                <div className="h-10 w-auto mx-auto flex items-center justify-center">
                  <img
                    src="/assets/dalenzia_fest_logo.png"
                    alt="Dalenzia Fest 2K26"
                    className="h-full w-auto object-contain"
                  />
                </div>

                <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-[#E6A916] text-[#A91F35] font-serif font-black text-2xl flex items-center justify-center mx-auto shadow-inner">
                  {selectedStudentPassData.student?.name?.[0] || 'S'}
                </div>

                <div>
                  <h3 className="font-serif font-black text-2xl text-stone-900">
                    {selectedStudentPassData.student?.name}
                  </h3>
                  <p className="text-xs font-mono font-bold text-[#A91F35] mt-0.5">
                    ID: {selectedStudentPassData.student?.id} • Chest: {selectedStudentPassData.student?.chestNo}
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    Squad: <strong>{selectedStudentPassData.team?.name || 'Dalenzia Team'}</strong>
                  </p>
                  <p className="text-xs text-stone-500">
                    Category: {selectedStudentPassData.student?.classCategory}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>Campus:</span>
                    <strong>Dalailussunna Dars, Ayiroor</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification Code:</span>
                    <strong className="font-mono text-[#A91F35]">{selectedStudentPassData.verificationCode}</strong>
                  </div>
                </div>

                <p className="text-[10px] text-emerald-700 font-bold">
                  ✓ Authentic institutional candidate record preserved intact
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
