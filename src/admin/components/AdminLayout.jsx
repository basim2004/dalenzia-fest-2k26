import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Layers,
  Trophy,
  UserCheck,
  Award,
  Calendar,
  Image,
  FileText,
  Megaphone,
  BarChart3,
  Globe,
  Settings,
  Shield,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Compass,
  GraduationCap,
  Radio,
  Tv,
  ClipboardCheck
} from 'lucide-react';

export default function AdminLayout({
  activeModule,
  setActiveModule,
  userSession,
  onLogout,
  onViewPublicWebsite,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isJudgeExpanded, setIsJudgeExpanded] = useState(() => activeModule.startsWith('judges'));

  React.useEffect(() => {
    if (activeModule.startsWith('judges')) {
      setIsJudgeExpanded(true);
    }
  }, [activeModule]);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'registration', name: 'Registration Desk', icon: ClipboardCheck, highlight: true },
    { id: 'teams', name: 'Teams', icon: Users },
    { id: 'students', name: 'Students', icon: UserCheck },
    { id: 'competitions', name: 'Competitions', icon: Trophy },
    {
      id: 'judges',
      name: 'Judge Management',
      icon: Shield,
      subItems: [
        { id: 'judges_list', name: 'Judge List' },
        { id: 'judges_assignments', name: 'Programme Assignments' },
        { id: 'judges_monitoring', name: 'Evaluation Monitoring' },
        { id: 'judges_marks', name: 'Submitted Marks' },
        { id: 'judges_verification', name: 'Result Verification' },
        { id: 'judges_posters', name: 'Result Posters' },
        { id: 'judges_reports', name: 'Judge Reports' }
      ]
    },
    { id: 'results', name: 'Results & Scoring', icon: Award },
    { id: 'programme', name: 'Programme', icon: Calendar },
    { id: 'programme_guests', name: 'Programme Guests', icon: Users },
    { id: 'schedule', name: 'Programme Schedule', icon: Calendar },
    { id: 'posters', name: 'Posters & Templates', icon: Image },
    { id: 'gallery', name: 'Gallery', icon: Image },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'settings', name: 'System Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex font-sans selection:bg-[#A91F35] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (REPLICATING DALENZIA FEST 2K26 ADMIN DASHBOARD MODEL)    */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#A91F35] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-68 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        {/* Top Branding Section with Official Logo */}
        <div className="p-4 sm:p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="h-11 sm:h-12 w-auto">
              <img
                src="/assets/dalenzia_fest_logo.png"
                alt="Dalenzia Fest 2K26"
                className="h-full w-auto object-contain"
              />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Menu List */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto select-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isJudgeModule = item.id === 'judges';
            const isActive = activeModule === item.id;
            const isChildActive = isJudgeModule && activeModule.startsWith('judges_');
            const isExpanded = isJudgeModule && isJudgeExpanded;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => {
                    if (isJudgeModule) {
                      setIsJudgeExpanded((prev) => !prev);
                      setActiveModule('judges');
                    } else {
                      setActiveModule(item.id);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#E6A916] text-[#A91F35] shadow-md font-black'
                      : isChildActive
                      ? 'text-white bg-white/10'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#A91F35]' : isChildActive ? 'text-[#E6A916]' : 'text-white/70'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#E6A916] animate-pulse" />
                  )}
                  {item.subItems && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-[#A91F35]' : 'text-white/60'}`} />
                  )}
                </button>

                {/* Sub-items for Judge Management (Section 14) */}
                {isJudgeModule && isExpanded && item.subItems && (
                  <div className="pl-6 pr-2 py-1 space-y-0.5 border-l-2 border-white/20 ml-4">
                    {item.subItems.map((sub) => {
                      const isSubActive = activeModule === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveModule(sub.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                            isSubActive
                              ? 'bg-[#E6A916] text-[#A91F35] font-black shadow-sm'
                              : 'text-white/75 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
            <a
              href="#convener"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-[#E6A916] group-hover:rotate-45 transition-transform" />
                <span className="flex items-center gap-2">
                  <span>Convener Portal</span>
                  <span className="text-[9px] bg-[#E6A916] text-[#A91F35] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
            </a>

            <a
              href="#teamleader"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#E6A916] group-hover:scale-110 transition-transform" />
                <span className="flex items-center gap-2">
                  <span>Team Leader Portal</span>
                  <span className="text-[9px] bg-[#E6A916] text-[#A91F35] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
            </a>

            <a
              href="#student"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-[#E6A916] group-hover:scale-110 transition-transform" />
                <span className="flex items-center gap-2">
                  <span>Student Portal</span>
                  <span className="text-[9px] bg-[#E6A916] text-[#A91F35] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
            </a>

            <a
              href="#stage"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4 text-[#E6A916] group-hover:scale-110 transition-transform" />
                <span className="flex items-center gap-2">
                  <span>Stage Controller</span>
                  <span className="text-[9px] bg-[#E6A916] text-[#A91F35] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Live</span>
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
            </a>

            <a
              href="#stagedisplay"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Tv className="w-4 h-4 text-[#E6A916] group-hover:scale-110 transition-transform" />
                <span className="flex items-center gap-2">
                  <span>Live Stage Display</span>
                  <span className="text-[9px] bg-[#E6A916] text-[#A91F35] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">LED</span>
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
            </a>

            <a
              href="#judge"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#E6A916]" />
                <span>Judge Portal</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
            </a>

            <button
              onClick={onViewPublicWebsite}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold text-[#E6A916] hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                <span>Public Website</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>

        {/* Bottom Silhouette & User Info */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-serif font-black shrink-0">
              A
            </div>
            <div className="truncate">
              <div className="font-bold text-white truncate">{userSession?.user || 'Super Admin'}</div>
              <div className="text-[10px] text-white/60 truncate">{userSession?.roleLabel || 'Administrator'}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (TOPBAR + MODULE CONTAINER)                         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-serif font-black text-[#1c1917] leading-tight">
                {activeModule.startsWith('judges')
                  ? 'Judge Management Control Centre'
                  : activeModule === 'teams'
                  ? 'Team Management'
                  : activeModule === 'students'
                  ? 'Student Management Control Centre'
                  : activeModule === 'competitions'
                  ? 'Competition Management Control'
                  : activeModule === 'results'
                  ? 'Results & Scoring Control Centre'
                  : activeModule === 'programme_guests' || activeModule.startsWith('programme_guests')
                  ? 'Programme Guest Management Control Centre'
                  : activeModule === 'schedule' || activeModule.startsWith('schedule')
                  ? 'Programme Schedule Control Centre'
                  : activeModule === 'gallery' || activeModule.startsWith('gallery')
                  ? 'Festival Gallery Control Centre'
                  : activeModule === 'posters' || activeModule.startsWith('posters')
                  ? 'Posters & Templates Management'
                  : activeModule === 'announcements' || activeModule.startsWith('announcements')
                  ? 'Announcements Management Control Centre'
                  : activeModule === 'reports' || activeModule.startsWith('reports')
                  ? 'Reports & Analytics Control Centre'
                  : activeModule === 'programme' || activeModule.startsWith('programme')
                  ? 'Programme Management Control Centre'
                  : 'Admin Control Centre'}
              </h1>
              <p className="text-[11px] font-semibold text-stone-500">
                {activeModule.startsWith('judges')
                  ? 'Adjudication Panels, Mark Sheets & Result Publication'
                  : activeModule === 'teams'
                  ? 'Teams, Students & Programme Overview'
                  : activeModule === 'students'
                  ? 'Student Registry, ID Cards, Team Squads & Competition Enrolment'
                  : activeModule === 'competitions'
                  ? 'Event Configurations, Syllabi, Arenas & Adjudication Sync'
                  : activeModule === 'results'
                  ? 'Multi-Judge Marksheet Aggregation, Verification, Team Points & Official Publishing'
                  : activeModule === 'programme_guests' || activeModule.startsWith('programme_guests')
                  ? 'Keynote Scholars, VIP Dignitaries, Invitation Workflows & Stage Alignments'
                  : activeModule === 'schedule' || activeModule.startsWith('schedule')
                  ? 'Master Session Timelines, Stage Allocations & Real-Time Conflict Detection'
                  : activeModule === 'gallery' || activeModule.startsWith('gallery')
                  ? 'Curated Photographic Albums, Video Broadcasts & Live Media Assets'
                  : activeModule === 'posters' || activeModule.startsWith('posters')
                  ? 'Official Festival Posters, Master Graphic Folios & Publication Templates'
                  : activeModule === 'announcements' || activeModule.startsWith('announcements')
                  ? 'Official Festival Circulars, Flash Alerts & Multi-Portal Notifications'
                  : activeModule === 'reports' || activeModule.startsWith('reports')
                  ? 'Institutional Intelligence, Team Performance Ledgers & Multi-Domain Audits'
                  : activeModule === 'programme' || activeModule.startsWith('programme')
                  ? 'Master Festival Schedule, Stage Timelines, Keynote Sessions & Ceremonies'
                  : 'Festival Management System'}
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center w-72 lg:w-96 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={
                activeModule === 'teams'
                  ? 'Search team, student or programme...'
                  : activeModule === 'programme_guests'
                  ? 'Search guest name, designation, institution or notes...'
                  : activeModule === 'schedule'
                  ? 'Search schedule, stage, date or coordinator...'
                  : activeModule === 'gallery'
                  ? 'Search photo, video, album, or category...'
                  : activeModule === 'posters'
                  ? 'Search poster, template, category or competition...'
                  : activeModule === 'announcements'
                  ? 'Search announcements, circulars, categories...'
                  : activeModule === 'reports'
                  ? 'Search reports, teams, students, events, judges...'
                  : activeModule === 'programme'
                  ? 'Search programme, code, venue or guest...'
                  : 'Search anything...'
              }
              className="w-full bg-[#FAF7F0] pl-10 pr-4 py-2 rounded-2xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35] transition-all"
            />
          </div>

          {/* Right Profile & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Access to Convener Portal */}
            <a
              href="#convener"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold shadow-xs transition-colors"
              title="Open Convener Operations Portal"
            >
              <Compass className="w-3.5 h-3.5 text-[#E6A916]" />
              <span className="hidden sm:inline">Convener Portal</span>
              <span className="sm:hidden">Convener</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </a>

            {/* Bell Icon with red badge */}
            <button className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A91F35]" />
            </button>

            <div className="h-6 w-[1px] bg-stone-200" />

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-stone-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-[#A91F35] text-white flex items-center justify-center font-serif font-black text-xs shadow-xs">
                  👤
                </div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-stone-900 leading-tight">
                    {activeModule === 'teams' ? 'Team Manager' : 'Super Admin'}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {activeModule === 'teams' ? 'Administrator' : 'Administrator'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs font-semibold"
                  >
                    <div className="px-4 py-2 border-b border-stone-100 text-stone-500">
                      Signed in as <br />
                      <span className="font-bold text-stone-900">{userSession?.email || 'admin@dalenziafest.in'}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveModule('settings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>System Settings</span>
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Module Content Container */}
        <main className="p-4 sm:p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
