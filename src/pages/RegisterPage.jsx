import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  Users,
  UserCheck,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Home,
  ShieldCheck,
  Sparkles,
  QrCode,
  Download,
  Printer,
  Share2,
  Phone,
  Mail,
  User,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import RegistrationTicketCard from '../components/RegistrationDesk/RegistrationTicketCard';

export default function RegisterPage({ onNavigateHome }) {
  // Active Tab: 'student' (Option A: Existing Dars Student) or 'external' (Option B: External Delegate)
  const [activeTab, setActiveTab] = useState('student');

  // ==========================================
  // STATE: OPTION A (Existing Dars Student)
  // ==========================================
  const [studentInputId, setStudentInputId] = useState('');
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  const [studentSearchError, setStudentSearchError] = useState('');
  const [existingTicketWarning, setExistingTicketWarning] = useState(null);
  const [studentPhone, setStudentPhone] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);

  // ==========================================
  // STATE: OPTION B (External Participant)
  // ==========================================
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

  // ==========================================
  // STATE: POST-REGISTRATION TICKET MODAL
  // ==========================================
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [selectedStudentPassData, setSelectedStudentPassData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ------------------------------------------
  // HANDLER: Verify Existing Dars Student
  // ------------------------------------------
  const handleVerifyStudent = (e) => {
    if (e) e.preventDefault();
    setStudentSearchError('');
    setVerifiedStudent(null);
    setExistingTicketWarning(null);

    const term = studentInputId.trim();
    if (!term) {
      setStudentSearchError('Please enter your official Student ID (e.g. STU-1001) or Chest Number.');
      return;
    }

    setIsVerifyingStudent(true);
    setTimeout(() => {
      try {
        const students = festivalStore.getStudents();
        const cleanTerm = term.toLowerCase();
        const found = students.find(
          (s) =>
            s.id.toLowerCase() === cleanTerm ||
            s.chestNo.toLowerCase() === cleanTerm ||
            s.name.toLowerCase().includes(cleanTerm)
        );

        if (!found) {
          setStudentSearchError(`No candidate found matching "${term}" in Dalailussunna Dars student registry. If you are from another institution, please select the External Participant tab.`);
          setIsVerifyingStudent(false);
          return;
        }

        // Verify if active registration already exists
        const allRegistrations = festivalStore.getRegistrations();
        const duplicate = allRegistrations.find(
          (r) => r.studentId === found.id && r.status !== 'Cancelled'
        );

        setVerifiedStudent(found);
        setStudentPhone(found.phone || '');
        if (duplicate) {
          setExistingTicketWarning(duplicate);
        }
      } catch (err) {
        console.error(err);
        setStudentSearchError('Verification failed. Please check your Student ID and try again.');
      } finally {
        setIsVerifyingStudent(false);
      }
    }, 300);
  };

  // ------------------------------------------
  // HANDLER: Submit Existing Dars Student
  // ------------------------------------------
  const handleStudentRegistrationSubmit = (e) => {
    e.preventDefault();
    if (!verifiedStudent) return;

    if (existingTicketWarning) {
      setGeneratedTicket(existingTicketWarning);
      return;
    }

    setIsSubmitting(true);
    try {
      const reg = festivalStore.registerExistingStudent({
        studentId: verifiedStudent.id,
        phone: studentPhone,
        notes: studentNotes,
        registeredBy: 'Self (Public Registration)'
      });

      setGeneratedTicket(reg);
    } catch (err) {
      alert(err.message || 'Registration failed. Please contact festival helpdesk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------
  // HANDLER: Submit External Participant
  // ------------------------------------------
  const handleExternalRegistrationSubmit = (e) => {
    e.preventDefault();
    setExternalError('');

    if (!externalForm.name.trim()) {
      setExternalError('Full Name is required.');
      return;
    }
    if (!externalForm.institution.trim()) {
      setExternalError('Institution / Campus Name is required.');
      return;
    }
    if (!externalForm.phone.trim()) {
      setExternalError('Contact Phone / WhatsApp is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const reg = festivalStore.registerExternalParticipant({
        ...externalForm,
        registeredBy: 'Self (Public Registration)'
      });

      setGeneratedTicket(reg);
    } catch (err) {
      setExternalError(err.message || 'Registration submission failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // View authentic student ID Pass
  const handleViewStudentPass = (studentId) => {
    try {
      const passData = festivalStore.getStudentIdCardData(studentId);
      setSelectedStudentPassData(passData);
    } catch (e) {
      console.error(e);
      alert('Could not retrieve student pass.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] font-sans selection:bg-[#A91F35] selection:text-white pt-24 pb-20">
      {/* Background Subtle Gradient & Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E6A916_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ========================================================================= */}
        {/* 1. TOP NAVIGATION / RETURN TO WEBSITE BAR                                */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else {
                window.location.hash = '#home';
                window.location.reload();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-stone-700 hover:text-[#A91F35] text-xs font-bold border border-stone-200/90 shadow-2xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#A91F35] group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Festival Homepage</span>
          </button>

          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 font-bold hidden sm:inline-block">
            DALENZIA 2K26 • NUEVA ERA
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 2. PAGE HERO & OFFICIAL FESTIVAL DETAILS HEADER                           */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#8D182B] via-[#A91F35] to-[#701322] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-white/10">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6A916]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Admissions & Delegate Registration</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#F7F3E9] leading-tight">
                DALENZIA FEST 2K26 – PARTICIPANT REGISTRATION
              </h1>

              <p className="text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed">
                Be part of the celebration. Complete your registration to participate in <strong>DALENZIA FEST 2K26</strong>.
                Submit your official entry to receive your verified digital festival admission pass and credentials.
              </p>
            </div>

            {/* Official Logos Side-by-Side Lockup */}
            <div className="flex items-center gap-4 bg-white/10 p-3 sm:p-4 rounded-2xl border border-white/15 backdrop-blur-sm shrink-0">
              <div className="h-12 sm:h-14 w-auto flex items-center">
                <img
                  src="/assets/brand/official_dalenzia_fest_gold.png"
                  alt="Dalenzia Fest 2K26"
                  className="h-full w-auto object-contain filter drop-shadow-sm"
                  onError={(e) => {
                    e.target.src = '/assets/dalenzia_fest_logo.png';
                  }}
                />
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="h-10 sm:h-12 w-auto flex items-center">
                <img
                  src="/assets/brand/official_nueva_era_gold.png"
                  alt="Nueva Era"
                  className="h-full w-auto object-contain filter drop-shadow-sm"
                  onError={(e) => {
                    e.target.src = '/assets/brand/official_nueva_era_logo.png';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Festival Schedule & Venue Banner */}
          <div className="mt-8 pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#E6A916]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-white/60">Festival Dates</span>
                <span className="font-extrabold text-white">21, 22, 23 DECEMBER 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:col-span-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#E6A916] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-white/60">Official Venue</span>
                <span className="font-extrabold text-white">
                  Dalailussunna Dars, Ayiroor, Malappuram, Kerala
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. REGISTRATION OPTION SELECTION TABS                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tab A: Existing Dars Student */}
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
              activeTab === 'student'
                ? 'bg-white border-[#A91F35] shadow-xl ring-2 ring-[#A91F35]/20'
                : 'bg-white/70 border-stone-200/90 hover:bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'student'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                <GraduationCap className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Option A
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    Official Student
                  </span>
                </div>
                <h3 className="font-serif font-black text-lg text-stone-900">
                  Existing Dars Student
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  For registered Dalailussunna Dars candidates with an official Student ID (<code>STU-XXXX</code>).
                </p>
              </div>
            </div>

            {activeTab === 'student' && (
              <div className="absolute top-3 right-3 text-[#A91F35]">
                <CheckCircle2 className="w-5 h-5 fill-[#A91F35] text-white" />
              </div>
            )}
          </button>

          {/* Tab B: External Participant */}
          <button
            type="button"
            onClick={() => setActiveTab('external')}
            className={`p-5 rounded-3xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
              activeTab === 'external'
                ? 'bg-white border-[#A91F35] shadow-xl ring-2 ring-[#A91F35]/20'
                : 'bg-white/70 border-stone-200/90 hover:bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === 'external'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                <Users className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                    Option B
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    Guest Candidate
                  </span>
                </div>
                <h3 className="font-serif font-black text-lg text-stone-900">
                  External Participant
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  For scholars, college delegations, and participants from other educational institutions.
                </p>
              </div>
            </div>

            {activeTab === 'external' && (
              <div className="absolute top-3 right-3 text-[#A91F35]">
                <CheckCircle2 className="w-5 h-5 fill-[#A91F35] text-white" />
              </div>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. FORM SECTION: OPTION A – EXISTING DARS STUDENT                         */}
        {/* ========================================================================= */}
        {activeTab === 'student' && (
          <motion.div
            key="tab-student"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/90 space-y-6"
          >
            <div className="border-b border-stone-200/80 pb-4">
              <h2 className="font-serif font-black text-xl text-stone-900">
                Option A: Existing Dalailussunna Dars Student Registration
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Verify your institutional student record to claim your official DALENZIA FEST 2K26 Admission Ticket.
                Your authentic Student ID (<code>STU-XXXX</code>) is preserved intact.
              </p>
            </div>

            {/* Step 1: Verification Input */}
            <form onSubmit={handleVerifyStudent} className="space-y-3">
              <label className="block text-xs font-bold text-stone-700">
                Enter your Official Student ID or Chest Number:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={studentInputId}
                    onChange={(e) => setStudentInputId(e.target.value)}
                    placeholder="e.g. STU-1001, C-101, or your name..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 bg-stone-50 text-xs text-stone-900 font-mono font-bold uppercase placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVerifyingStudent}
                  className="px-6 py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4 text-[#E6A916]" />
                  <span>{isVerifyingStudent ? 'Verifying...' : 'Verify Student Record'}</span>
                </button>
              </div>

              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                <span>Example Student IDs: <code>STU-1001</code>, <code>STU-1005</code>, <code>STU-1015</code>, <code>STU-1025</code>...</span>
              </div>
            </form>

            {/* Search Error Banner */}
            {studentSearchError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-bold">Verification Notice</strong>
                  <p className="text-[11px] text-rose-800 leading-relaxed">{studentSearchError}</p>
                </div>
              </div>
            )}

            {/* Verified Student Details Card */}
            {verifiedStudent && (
              <div className="p-5 rounded-3xl bg-amber-50/80 border border-[#E6A916]/50 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Record Verified</span>
                    </span>
                    <span className="font-mono text-xs font-black text-[#A91F35]">
                      {verifiedStudent.id}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-stone-600">
                    Dalailussunna Dars, Ayiroor
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Student Name</span>
                    <h3 className="font-serif font-black text-2xl text-stone-900">
                      {verifiedStudent.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-600">
                      <span>Chest No: <strong className="text-[#A91F35]">{verifiedStudent.chestNo}</strong></span>
                      <span>Category: <strong>{verifiedStudent.classCategory}</strong></span>
                      <span>Squad: <strong>{verifiedStudent.teamName || 'Official Contingent'}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewStudentPass(verifiedStudent.id)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#A91F35]" />
                    <span>View Institutional ID Pass</span>
                  </button>
                </div>

                {/* Duplicate Registration Warning if Already Registered */}
                {existingTicketWarning ? (
                  <div className="p-4 rounded-2xl bg-amber-100/90 border border-amber-300 text-xs text-amber-950 space-y-2">
                    <div className="flex items-center gap-2 font-black text-[#A91F35]">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-[#A91F35]" />
                      <span>ACTIVE REGISTRATION ALREADY ON FILE</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-stone-700">
                      You are already officially registered for DALENZIA FEST 2K26 under Ticket ID{' '}
                      <strong className="font-mono font-black text-[#A91F35] bg-white px-2 py-0.5 rounded border border-amber-300">
                        {existingTicketWarning.ticketId}
                      </strong>.
                      To ensure security and prevent duplicates, multiple passes are not issued. You can view, download, print, or share your digital pass below.
                    </p>
                    <button
                      type="button"
                      onClick={() => setGeneratedTicket(existingTicketWarning)}
                      className="px-4 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm mt-1"
                    >
                      <QrCode className="w-4 h-4 text-[#E6A916]" />
                      <span>View My Digital Ticket Pass</span>
                    </button>
                  </div>
                ) : (
                  /* Step 2: Final Confirmation Form */
                  <form onSubmit={handleStudentRegistrationSubmit} className="pt-2 border-t border-amber-200/70 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          Contact Phone / WhatsApp (Optional):
                        </label>
                        <input
                          type="text"
                          value={studentPhone}
                          onChange={(e) => setStudentPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          Special Requirements / Desk Notes (Optional):
                        </label>
                        <input
                          type="text"
                          value={studentNotes}
                          onChange={(e) => setStudentNotes(e.target.value)}
                          placeholder="e.g. Dietary preferences, stage accommodation..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-black shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <Sparkles className="w-4 h-4 text-[#E6A916]" />
                        <span>{isSubmitting ? 'Generating Ticket...' : 'Confirm Registration & Issue Ticket (DLZ-2026)'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 5. FORM SECTION: OPTION B – EXTERNAL PARTICIPANT                          */}
        {/* ========================================================================= */}
        {activeTab === 'external' && (
          <motion.div
            key="tab-external"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/90 space-y-6"
          >
            <div className="border-b border-stone-200/80 pb-4">
              <h2 className="font-serif font-black text-xl text-stone-900">
                Option B: External Participant & Delegation Registration
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                For guests, intercollegiate delegates, and candidates from outside institutions.
                Issues an official <code>EXT-2026-XXXX</code> Festival Admission Pass.
              </p>
            </div>

            <form onSubmit={handleExternalRegistrationSubmit} className="space-y-4">
              {externalError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
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
                  placeholder="Enter your full official name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                />
              </div>

              {/* Institution & Academic Level Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">
                    Institution / College / School *
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

              {/* External Competition Status Card (Coming Soon) */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-center gap-2 font-black text-amber-800">
                  <Sparkles className="w-4 h-4 text-[#E6A916]" />
                  <span>EXTERNAL COMPETITIONS SELECTION: COMING SOON</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Inter-collegiate and open competition slot registrations will be announced soon. Submitting this registration form reserves your official festival entry ticket and delegate credentials in advance.
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  Additional Queries / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={externalForm.notes}
                  onChange={(e) => setExternalForm({ ...externalForm, notes: e.target.value })}
                  placeholder="e.g. Part of campus delegation, accommodation required..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35]"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-black shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-[#E6A916]" />
                  <span>{isSubmitting ? 'Registering...' : 'Complete External Registration & Issue Pass (EXT-2026)'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 6. POST-REGISTRATION DIGITAL TICKET CARD POPUP                            */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {generatedTicket && (
            <RegistrationTicketCard
              registration={generatedTicket}
              onClose={() => setGeneratedTicket(null)}
              onViewStudentPass={handleViewStudentPass}
            />
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* 7. AUTHENTIC DARS STUDENT ID PASS MODAL                                   */}
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
                    <UserCheck className="w-5 h-5 text-[#E6A916]" />
                    <span className="font-serif font-black text-sm text-[#F7F3E9]">
                      Official Institutional Student ID Card
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedStudentPassData(null)}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                  >
                    ✕
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
    </div>
  );
}
