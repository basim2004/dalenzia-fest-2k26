import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  Sparkles,
  Clock,
  User,
  Shield,
  LifeBuoy,
  FileText,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';

export default function ConvenerHelpdesk({
  portalName = 'Portal User',
  userProfile = {},
  isConvenerView = false,
  compact = false
}) {
  const [userName, setUserName] = useState(userProfile.name || userProfile.user || '');
  const [category, setCategory] = useState('Technical Support / Portal Error');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showReportForm, setShowReportForm] = useState(!compact && !isConvenerView);

  // Convener Management View States
  const [tickets, setTickets] = useState(() => festivalStore.getHelpdeskTickets());
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [portalFilter, setPortalFilter] = useState('ALL');

  useEffect(() => {
    if (userProfile.name || userProfile.user) {
      setUserName(userProfile.name || userProfile.user);
    }
  }, [userProfile]);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setTickets(festivalStore.getHelpdeskTickets());
    });
    return () => unsub();
  }, []);

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const res = festivalStore.submitHelpdeskTicket({
          userName: userName.trim() || 'Portal User',
          userId: userProfile.id || userProfile.chestNo || 'ANON',
          portal: portalName,
          category,
          description: description.trim()
        });

        setIsSubmitting(false);
        if (res.success) {
          setSubmissionResult({
            success: true,
            ticketId: res.ticket.id,
            message: `Your issue has been logged into the Festival Secretariat database (Ticket #${res.ticket.id}). The Convener can review and act on it immediately.`
          });
          setDescription('');
        }
      } catch (err) {
        setIsSubmitting(false);
        setSubmissionResult({
          success: false,
          message: 'Failed to record helpdesk ticket. Please call or WhatsApp the Convener directly.'
        });
      }
    }, 400);
  };

  const handleUpdateStatus = (ticketId, newStatus) => {
    festivalStore.updateHelpdeskTicketStatus(ticketId, newStatus);
    setTickets(festivalStore.getHelpdeskTickets());
  };

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (portalFilter !== 'ALL' && t.portal !== portalFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. OFFICIAL CONVENER HELPDESK CONTACT CARD                                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-[#A91F35]/15 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-44 h-44 rounded-full bg-gradient-to-br from-[#E6A916]/15 to-[#A91F35]/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[11px] font-bold border border-[#A91F35]/20 uppercase tracking-wider">
              <LifeBuoy className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Official Festival Secretariat Support</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#A91F35] text-white flex items-center justify-center font-serif font-black text-lg shadow-md border-2 border-[#E6A916]/50">
                IE
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-stone-900 tracking-tight">
                  IRFAN ERAMANGALAM
                </h3>
                <p className="text-xs font-semibold text-[#A91F35]">
                  Festival Convener · Dalenzia Fest 2K26
                </p>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Dalailussunna Dars, Ayiroor
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Click to Call */}
            <a
              href="tel:+919048131562"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#E6A916]" />
              <span>+91 90481 31562</span>
            </a>

            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/919048131562?text=Hello%20Convener,%20I%20need%20assistance%20regarding%20Dalenzia%202K26"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Convener</span>
            </a>

            {/* Toggle Report Problem Form */}
            {!isConvenerView && (
              <button
                type="button"
                onClick={() => setShowReportForm(prev => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-300 hover:border-[#A91F35] text-stone-800 hover:text-[#A91F35] text-xs font-bold shadow-sm transition-all"
              >
                <AlertCircle className="w-4 h-4 text-[#A91F35]" />
                <span>{showReportForm ? 'Hide Report Form' : 'Report a Problem'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REPORT A PROBLEM FORM (FOR USERS IN NON-ADMIN PORTALS)                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isConvenerView && showReportForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-stone-200 space-y-5">
              <div className="border-b border-stone-100 pb-3">
                <h4 className="font-serif font-black text-base text-stone-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#A91F35]" />
                  <span>Report an Issue or Request Assistance</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Your report will be registered directly into the secretariat database for the Convener to resolve.
                </p>
              </div>

              {submissionResult && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-start gap-3 ${
                    submissionResult.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {submissionResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{submissionResult.message}</p>
                    {submissionResult.ticketId && (
                      <p className="text-[11px] text-emerald-700 font-mono mt-1">
                        Tracking Status: Pending Convener Review
                      </p>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* User Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      User Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your Full Name"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  {/* Portal Name (Auto-identified) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Identified Portal
                    </label>
                    <input
                      type="text"
                      value={portalName}
                      disabled
                      className="w-full bg-stone-100 px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#A91F35] cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Issue Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="Technical Support / Portal Error">Technical Support / Portal Error</option>
                    <option value="Schedule & Timeline Conflict">Schedule & Timeline Conflict</option>
                    <option value="Competition & Event Query">Competition & Event Query</option>
                    <option value="Mark Entry & Evaluation">Mark Entry & Evaluation</option>
                    <option value="Participant Calling & Stage">Participant Calling & Stage</option>
                    <option value="Student ID / Chest Number Query">Student ID / Chest Number Query</option>
                    <option value="Urgent Secretariat Assistance">Urgent Secretariat Assistance</option>
                  </select>
                </div>

                {/* Problem Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Problem Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Clearly explain the issue or query..."
                    required
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-normal text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#E6A916]" />
                    <span>{isSubmitting ? 'Registering Report...' : 'Submit Helpdesk Report'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. CONVENER PORTAL MANAGEMENT VIEW (WHEN isConvenerView IS TRUE)           */}
      {/* ========================================================================= */}
      {isConvenerView && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h4 className="font-serif font-black text-lg text-stone-900 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-[#A91F35]" />
                <span>Secretariat Helpdesk Reports</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Live issue requests submitted by judges, students, team leaders, and stage controllers.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAF7F0] px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800"
              >
                <option value="ALL">All Statuses ({tickets.length})</option>
                <option value="Pending">Pending ({tickets.filter(t => t.status === 'Pending').length})</option>
                <option value="In Progress">In Progress ({tickets.filter(t => t.status === 'In Progress').length})</option>
                <option value="Resolved">Resolved ({tickets.filter(t => t.status === 'Resolved').length})</option>
              </select>

              <select
                value={portalFilter}
                onChange={(e) => setPortalFilter(e.target.value)}
                className="bg-[#FAF7F0] px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800"
              >
                <option value="ALL">All Portals</option>
                <option value="Judge Portal">Judge Portal</option>
                <option value="Student Portal">Student Portal</option>
                <option value="Team Leader Portal">Team Leader Portal</option>
                <option value="Stage Controller">Stage Controller</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-10 bg-[#FAF7F0] rounded-2xl border border-dashed border-stone-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-bold text-stone-700">No helpdesk tickets in this filter.</p>
              <p className="text-[11px] text-stone-500 mt-0.5">All portal assistance requests are currently attended to.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map(t => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-[#FAF7F0]/60 hover:bg-[#FAF7F0] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-stone-200 text-stone-800 px-2 py-0.5 rounded-md">
                        {t.id}
                      </span>
                      <span className="text-xs font-bold text-[#A91F35]">
                        {t.portal}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs font-semibold text-stone-700">
                        {t.userName}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[11px] text-stone-500">
                        {t.formattedTime || new Date(t.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-stone-900">
                      Category: <span className="text-[#A91F35]">{t.category}</span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/80">
                      {t.description}
                    </p>
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex flex-col sm:flex-row items-end md:items-center gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : t.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {t.status}
                    </span>

                    <div className="flex items-center gap-1.5 pt-1">
                      {t.status !== 'In Progress' && t.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'In Progress')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-all"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {t.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'Resolved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all"
                        >
                          Resolve
                        </button>
                      )}
                      {t.status === 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'Pending')}
                          className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-[11px] font-bold transition-all"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
