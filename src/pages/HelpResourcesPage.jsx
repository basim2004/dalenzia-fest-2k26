import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Send,
  Shield,
  ChevronRight,
  ChevronDown,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  ArrowRight,
  Home
} from 'lucide-react';
import { OFFICIAL_DEVELOPER_CONTACT } from '../data/centralContactConfig';
import {
  submitPublicFeedback,
  getFeedbackSubmissions,
  updateFeedbackStatus,
  getHelpResources,
  uploadHelpResource,
  updateHelpResourceMetadata,
  deleteHelpResource
} from '../services/helpResourcesService';

export default function HelpResourcesPage({ onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact', 'guides', 'feedback', 'resources', 'admin_manage'

  // Contact Info
  const dev = OFFICIAL_DEVELOPER_CONTACT;

  // Authorization check for Admin / Convener controls initialized directly
  const [isAdminOrConvener] = useState(() => {
    try {
      const adminSession = sessionStorage.getItem('dalenzia_admin_session');
      const convenerSession = sessionStorage.getItem('dalenzia_convener_session');
      return Boolean(adminSession || convenerSession);
    } catch {
      return false;
    }
  });

  const [authorizedRole] = useState(() => {
    try {
      const adminSession = sessionStorage.getItem('dalenzia_admin_session');
      const convenerSession = sessionStorage.getItem('dalenzia_convener_session');
      if (adminSession) return 'Main Admin / Developer';
      if (convenerSession) return 'Festival Convener';
      return null;
    } catch {
      return null;
    }
  });

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    contact: '',
    category: 'General Suggestion',
    message: ''
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null); // { success, message }

  // Resources state
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  // Admin Management States
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedbackList, setLoadingFeedbackList] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'User Guide',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Step-by-step User Guides state
  const [expandedGuide, setExpandedGuide] = useState('guide-portal');

  // Load resources
  const loadResources = async () => {
    setLoadingResources(true);
    const data = await getHelpResources(isAdminOrConvener);
    setResources(data);
    setLoadingResources(false);
  };

  const loadFeedbackList = async () => {
    if (!isAdminOrConvener) return;
    setLoadingFeedbackList(true);
    const data = await getFeedbackSubmissions();
    setFeedbackList(data);
    setLoadingFeedbackList(false);
  };

  useEffect(() => {
    loadResources();
    if (isAdminOrConvener) {
      loadFeedbackList();
    }
  }, [isAdminOrConvener]);

  // Handle Feedback Submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    setFeedbackStatus(null);

    const res = await submitPublicFeedback(feedbackForm);
    setFeedbackSubmitting(false);

    if (res.success) {
      setFeedbackStatus({ success: true, message: res.message });
      setFeedbackForm({
        name: '',
        contact: '',
        category: 'General Suggestion',
        message: ''
      });
      if (isAdminOrConvener) {
        loadFeedbackList();
      }
    } else {
      setFeedbackStatus({ success: false, message: res.error || 'Failed to submit feedback.' });
    }
  };

  // Handle Resource Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.file) {
      setUploadError('Please choose a PDF or document file to upload.');
      return;
    }
    if (!uploadData.title.trim()) {
      setUploadError('Please provide a title for the document.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const res = await uploadHelpResource({
      file: uploadData.file,
      title: uploadData.title,
      description: uploadData.description,
      category: uploadData.category,
      author: authorizedRole || 'Administration'
    });

    setUploading(false);

    if (res.success) {
      setShowUploadModal(false);
      setUploadData({
        title: '',
        description: '',
        category: 'User Guide',
        file: null
      });
      loadResources();
    } else {
      setUploadError(res.error || 'Failed to upload document.');
    }
  };

  // Step-by-step guides data
  const userGuides = [
    {
      id: 'guide-portal',
      title: 'Portal Access & Role-Based Authentication',
      summary: 'How students, team leaders, judges, and conveners securely access their dashboards.',
      steps: [
        'Each authorized user logs in with their designated handle: username@portal (e.g. noufal@teamleader, judge01@judge, stu1001@student).',
        'Initial password for newly assigned credentials matches the registered phone number.',
        'Upon first login, the system prompts for a personal password update to protect account security.',
        'If you forget your credentials, contact the Developer Helpdesk or your designated Festival Convener.'
      ]
    },
    {
      id: 'guide-results',
      title: 'Live Stage Scores & Official Results Verification',
      summary: 'Checking real-time standings, category marks, and approved result publications.',
      steps: [
        'Navigate to the Results section from the top navigation bar or mobile drawer.',
        'Filter by category (Sub Junior, Junior, Senior, General) or search by competition name.',
        'Verified results display official marks awarded by judges and signed off by the Tabulation Desk.',
        'Official certificates and result posters can be previewed and downloaded directly in high resolution.'
      ]
    },
    {
      id: 'guide-pwa',
      title: 'Installing the App on Mobile (PWA & Offline Use)',
      summary: 'Add DALENZIA FEST 2K26 to your phone screen for instant standalone app launch.',
      steps: [
        'On Android Chrome: Tap the "Install App" button in the navigation header or mobile menu.',
        'On iOS Safari: Tap the Share icon (box with upward arrow) and select "Add to Home Screen".',
        'The app launches without browser bars and caches essential schedules and event listings for swift access.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] font-sans selection:bg-[#A91F35] selection:text-white pt-6 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================= */}
        {/* TOP HEADER: BRANDING & TITLE                             */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-[#A91F35] to-[#801426] text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-[#E6A916]/40 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 rounded-full bg-[#E6A916]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 text-[#E6A916] text-xs font-black uppercase tracking-wider border border-[#E6A916]/30">
                <LifeBuoy className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Centralized Support & Secretariat Documentation</span>
              </div>

              <div className="flex items-center gap-2">
                {isAdminOrConvener && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[11px] font-black uppercase tracking-wider shadow-sm">
                    <Shield className="w-3.5 h-3.5 text-[#A91F35]" />
                    <span>Authorized View: {authorizedRole}</span>
                  </div>
                )}
                {onNavigateHome && (
                  <button
                    onClick={onNavigateHome}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-[#E6A916]" />
                    <span>Return Home</span>
                  </button>
                )}
              </div>
            </div>

            <div className="max-w-2xl">
              <h1 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-tight">
                HELP & RESOURCES
              </h1>
              <p className="text-xs sm:text-sm text-[#F7F3E9]/85 mt-2 leading-relaxed">
                Official assistance center for DALENZIA FEST 2K26. Access technical support, step-by-step user guides, feedback submissions, and administrative documents.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'contact'
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Helpdesk Contact
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'guides'
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                User Guide
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'feedback'
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'resources'
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Resources & Documents
              </button>

              {isAdminOrConvener && (
                <button
                  onClick={() => setActiveTab('admin_manage')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'admin_manage'
                      ? 'bg-white text-[#A91F35] shadow-md font-black'
                      : 'bg-black/30 text-[#E6A916] border border-[#E6A916]/40 hover:bg-black/50'
                  }`}
                >
                  Admin & Feedback Inbox ({feedbackList.filter(f => f.status === 'New').length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION A: HELPDESK CONTACT                               */}
        {/* ========================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#A91F35]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#A91F35]">
                    Technical Support & System Helpdesk
                  </span>
                  <h2 className="font-serif font-black text-2xl text-stone-900 mt-1">
                    Official Developer Contact
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Direct technical channel for student portal bug reports, credentials, scoring engine inquiries, and app assistance.
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Support Channel Active</span>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Primary Channel */}
                <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-stone-200 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#A91F35] text-white text-[10px] font-black uppercase tracking-wider">
                        Primary Support Line
                      </span>
                      <span className="text-xs font-mono text-stone-400">Direct Line</span>
                    </div>

                    <div className="text-2xl font-mono font-black text-stone-900 tracking-wide pt-1">
                      {dev.primaryPhone}
                    </div>

                    <p className="text-xs text-stone-600 font-medium">
                      Direct voice call & WhatsApp chat with Lead System Architect {dev.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <a
                      href={dev.tel}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#E6A916]" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={dev.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Secondary Channel */}
                <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-stone-200 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black uppercase tracking-wider">
                        Secondary Support Line
                      </span>
                      <span className="text-xs font-mono text-stone-400">Alternative Line</span>
                    </div>

                    <div className="text-2xl font-mono font-black text-stone-900 tracking-wide pt-1">
                      {dev.secondaryPhone}
                    </div>

                    <p className="text-xs text-stone-600 font-medium">
                      Backup line for system technical emergencies & portal inquiries.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <a
                      href={dev.secondaryTel}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#E6A916]" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={dev.secondaryWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Email Support Bar */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#A91F35] shrink-0" />
                  <span>Official Email: <strong className="text-stone-900">{dev.email}</strong></span>
                </div>
                <a
                  href={`mailto:${dev.email}?subject=Dalenzia%20Fest%20Support%20Request`}
                  className="text-[#A91F35] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Send an Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION B: USER GUIDE                                     */}
        {/* ========================================================= */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#A91F35]/15 space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#A91F35]">
                  Documentation & Walkthroughs
                </span>
                <h2 className="font-serif font-black text-2xl text-stone-900 mt-1">
                  Website & Portal User Guides
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Step-by-step instructions for scholars, team leaders, judges, and visitors.
                </p>
              </div>

              {/* Accordion List */}
              <div className="space-y-3">
                {userGuides.map((guide) => {
                  const isOpen = expandedGuide === guide.id;
                  return (
                    <div
                      key={guide.id}
                      className="border border-stone-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedGuide(isOpen ? '' : guide.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-stone-50 hover:bg-stone-100/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center font-bold text-xs shrink-0">
                            <BookOpen className="w-4 h-4 text-[#A91F35]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-stone-900">
                              {guide.title}
                            </h3>
                            <p className="text-xs text-stone-500 font-normal">
                              {guide.summary}
                            </p>
                          </div>
                        </div>

                        {isOpen ? (
                          <ChevronDown className="w-5 h-5 text-stone-500 shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-stone-400 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-5 bg-white border-t border-stone-200 space-y-2.5 text-xs text-stone-700 leading-relaxed"
                          >
                            <ol className="list-decimal list-inside space-y-2 font-medium">
                              {guide.steps.map((st, idx) => (
                                <li key={idx} className="pl-1">
                                  <span>{st}</span>
                                </li>
                              ))}
                            </ol>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION C: FEEDBACK                                       */}
        {/* ========================================================= */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#A91F35]/15 space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#A91F35]">
                  Public Feedback & Suggestions
                </span>
                <h2 className="font-serif font-black text-2xl text-stone-900 mt-1">
                  Share Your Thoughts or Report an Issue
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Submissions are stored securely in the festival database and reviewed privately by the Festival Administration.
                </p>
              </div>

              {feedbackStatus && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
                    feedbackStatus.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {feedbackStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span>{feedbackStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Your Name <span className="text-stone-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      placeholder="e.g. Scholar / Visitor"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#A91F35] focus:outline-none text-xs bg-stone-50 font-medium"
                    />
                  </div>

                  {/* Contact (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Phone / Email <span className="text-stone-400 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackForm.contact}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, contact: e.target.value })}
                      placeholder="For a response if needed"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#A91F35] focus:outline-none text-xs bg-stone-50 font-medium"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Category
                  </label>
                  <select
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#A91F35] focus:outline-none text-xs bg-stone-50 font-medium"
                  >
                    <option value="General Suggestion">General Suggestion</option>
                    <option value="Website & PWA Experience">Website & PWA App Experience</option>
                    <option value="Portal Access / Login Issue">Portal Access / Login Issue</option>
                    <option value="Competition / Scoring Inquiry">Competition / Scoring Inquiry</option>
                    <option value="Schedule & Timing Feedback">Schedule & Timing Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Message or Suggestion <span className="text-[#A91F35]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    placeholder="Write your feedback, suggestion, or question here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#A91F35] focus:outline-none text-xs bg-stone-50 font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>{feedbackSubmitting ? 'Submitting...' : 'Send Feedback'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION D: RESOURCES & DOCUMENTS (PUBLIC + ADMIN CONTROLS) */}
        {/* ========================================================= */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#A91F35]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#A91F35]">
                    Downloads & Official Documents
                  </span>
                  <h2 className="font-serif font-black text-2xl text-stone-900 mt-1">
                    Resources & PDF Guides
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Download verified festival circulars, rulebooks, and student portal user manuals.
                  </p>
                </div>

                {isAdminOrConvener && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#E6A916]" />
                    <span>Upload New Resource</span>
                  </button>
                )}
              </div>

              {/* Documents List */}
              {loadingResources ? (
                <div className="text-center py-12 text-xs text-stone-400 font-medium">
                  Loading published resources...
                </div>
              ) : resources.length === 0 ? (
                /* Clean Empty State (Strictly no fake documents) */
                <div className="p-8 sm:p-12 text-center rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-[#A91F35]" />
                  </div>
                  <h4 className="font-serif font-bold text-base text-stone-800">
                    No Resources Published Yet
                  </h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Official festival guides, schedules, and document manuals will appear here once published by the administration.
                  </p>
                  {isAdminOrConvener && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E6A916] text-[#A91F35] font-bold text-xs shadow-xs hover:bg-[#ffd166] transition-all cursor-pointer mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload First Document</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#A91F35]/30 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider">
                            {res.category || 'Document'}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">
                            {res.fileSize || 'PDF'}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-stone-900 line-clamp-1">
                          {res.title}
                        </h4>

                        {res.description && (
                          <p className="text-xs text-stone-600 line-clamp-2">
                            {res.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                        <a
                          href={res.downloadUrl}
                          download={res.fileName || 'dalenzia_resource.pdf'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                          <span>Download PDF</span>
                        </a>

                        {isAdminOrConvener && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                updateHelpResourceMetadata(res.id, { published: !res.published });
                                loadResources();
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg"
                              title={res.published ? 'Unpublish' : 'Publish'}
                            >
                              {res.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-600" />}
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete "${res.title}"?`)) {
                                  await deleteHelpResource(res.id, res.storagePath);
                                  loadResources();
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                              title="Delete Resource"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION E: ADMIN & CONVENER MANAGEMENT INBOX               */}
        {/* ========================================================= */}
        {activeTab === 'admin_manage' && isAdminOrConvener && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#A91F35]/15 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#A91F35]">
                    Festival Secretariat Inbox
                  </span>
                  <h2 className="font-serif font-black text-2xl text-stone-900 mt-1">
                    Submitted Public Feedback & Inquiries
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Private inbox for {authorizedRole} to review suggestions and resolve reported issues.
                  </p>
                </div>

                <button
                  onClick={loadFeedbackList}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Refresh Feedback"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loadingFeedbackList ? (
                <div className="text-center py-12 text-xs text-stone-400">Loading inbox...</div>
              ) : feedbackList.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl text-xs text-stone-500">
                  No feedback submissions recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {feedbackList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{item.name}</span>
                          <span className="text-stone-400">•</span>
                          <span className="text-stone-500 font-mono">{item.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'New'
                                ? 'bg-rose-100 text-rose-800'
                                : item.status === 'Reviewed'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.status}
                          </span>
                          <select
                            value={item.status}
                            onChange={async (e) => {
                              await updateFeedbackStatus(item.id, e.target.value);
                              loadFeedbackList();
                            }}
                            className="text-[11px] font-bold bg-white border border-stone-200 rounded-lg px-2 py-1"
                          >
                            <option value="New">New</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-stone-800 leading-relaxed font-medium">
                        {item.message}
                      </div>

                      <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                        <span>Category: {item.category}</span>
                        <span>{new Date(item.createdAtIso).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* UPLOAD MODAL FOR AUTHORIZED ROLES                         */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUploadModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#A91F35]/20 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <h3 className="font-serif font-black text-xl text-stone-900">
                    Upload Official Help Document
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                  >
                    ✕
                  </button>
                </div>

                {uploadError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
                    {uploadError}
                  </div>
                )}

                <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 uppercase tracking-wider">
                      Document Title <span className="text-[#A91F35]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Student Portal User Guide 2K26"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#A91F35] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={uploadData.category}
                      onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#A91F35] focus:outline-none"
                    >
                      <option value="User Guide">User Guide</option>
                      <option value="Rules & Guidelines">Rules & Guidelines</option>
                      <option value="Schedule & Circular">Schedule & Circular</option>
                      <option value="ID Card & Desk Manual">ID Card & Desk Manual</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 uppercase tracking-wider">
                      Description <span className="text-stone-400 font-normal lowercase">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short summary of this document's contents..."
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-[#A91F35] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-700 uppercase tracking-wider">
                      Select PDF or Document File <span className="text-[#A91F35]">*</span>
                    </label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] || null })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-5 py-2.5 rounded-xl bg-[#A91F35] hover:bg-[#8D182B] text-white font-bold disabled:opacity-60"
                    >
                      {uploading ? 'Uploading...' : 'Publish Document'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
