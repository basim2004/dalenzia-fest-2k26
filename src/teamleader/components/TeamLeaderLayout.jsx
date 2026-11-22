import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Shield,
  UserCheck,
  Trophy,
  Calendar,
  Award,
  Crown,
  CalendarDays,
  Users,
  Megaphone,
  Image,
  FileText,
  FileSpreadsheet,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Lock,
  KeyRound,
  GraduationCap,
  LifeBuoy
} from 'lucide-react';

export default function TeamLeaderLayout({
  activeModule,
  setActiveModule,
  leaderSession,
  onLogout,
  onViewPublicWebsite,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Squad Dashboard', icon: LayoutDashboard },
    { id: 'myteam', name: 'My Team Squad', icon: Shield },
    { id: 'students', name: 'Team Allocation', icon: UserCheck, highlight: true },
    { id: 'competitions', name: 'Competition Registration', icon: Trophy },
    { id: 'programmes', name: 'Programme Registration', icon: Calendar },
    { id: 'results', name: 'Team Results & Awards', icon: Award },
    { id: 'leaderboard', name: 'Festival Leaderboard', icon: Crown },
    { id: 'schedule', name: 'Master Schedule', icon: CalendarDays },
    { id: 'guests', name: 'Festival Dignitaries', icon: Users },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'gallery', name: 'Festival Gallery', icon: Image },
    { id: 'posters', name: 'Posters & Downloads', icon: FileText },
    { id: 'reports', name: 'Team Reports & Export', icon: FileSpreadsheet },
    { id: 'profile', name: 'Profile & Settings', icon: Settings },
    { id: 'helpdesk', name: 'Convener Helpdesk', icon: LifeBuoy, highlight: true }
  ];

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex font-sans selection:bg-[#A91F35] selection:text-white">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#A91F35] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-68 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        {/* Brand Header */}
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

          {/* Authorized Team Banner */}
          <div className="mt-3 p-2.5 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Authorized Squad</div>
              <div className="font-serif font-black text-sm text-[#E6A916]">{leaderSession?.teamName || 'Team Squad'}</div>
            </div>
            <span className="text-xs bg-[#E6A916] text-[#A91F35] font-black px-2 py-0.5 rounded-lg">
              {leaderSession?.teamCode || 'SQUAD'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto select-none">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-lg font-black'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#A91F35]' : 'text-white/70'}`} />
                  <span>{item.name}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#E6A916]" />
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
            <a
              href="#student"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2 rounded-2xl text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-[#E6A916]" />
                <span>Student Portal</span>
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

        {/* Bottom Silhouette & Leader Info */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-serif font-black shrink-0">
              {leaderSession?.user ? leaderSession.user.charAt(0) : 'L'}
            </div>
            <div className="truncate">
              <div className="font-bold text-white truncate">{leaderSession?.user || 'Team Leader'}</div>
              <div className="text-[10px] text-white/60 truncate">{leaderSession?.teamName} Leader</div>
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

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-black text-stone-900 leading-tight">
                {activeModule === 'dashboard'
                  ? `${leaderSession?.teamName || 'Team'} • Command Dashboard`
                  : activeModule === 'myteam'
                  ? 'Squad Profile & Roster Summary'
                  : activeModule === 'students'
                  ? 'Team Student Management'
                  : activeModule === 'competitions'
                  ? 'Competition Enrolment & Entries'
                  : activeModule === 'programmes'
                  ? 'Festival Programme Registrations'
                  : activeModule === 'results'
                  ? 'Published Official Results & Awards'
                  : activeModule === 'leaderboard'
                  ? 'Championship Leaderboard'
                  : activeModule === 'schedule'
                  ? 'Festival Event Schedule'
                  : activeModule === 'guests'
                  ? 'Festival Dignitaries'
                  : activeModule === 'announcements'
                  ? 'Festival Announcements & Circulars'
                  : activeModule === 'gallery'
                  ? 'Festival Media & Albums'
                  : activeModule === 'posters'
                  ? 'Official Result Posters & Downloads'
                  : activeModule === 'reports'
                  ? 'Squad Reports & Data Exports'
                  : 'Leader Profile & Settings'}
              </h1>
              <div className="text-[11px] text-stone-500 hidden sm:block">
                Authenticated Squad: <strong className="text-[#A91F35]">{leaderSession?.teamName}</strong> • Logged in as {leaderSession?.user}
              </div>
            </div>
          </div>

          {/* Right Profile Dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublicWebsite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:text-[#A91F35] hover:bg-stone-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-stone-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-bold text-xs shadow-xs">
                  {leaderSession?.user ? leaderSession.user.charAt(0) : 'L'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-bold text-stone-900 leading-tight">{leaderSession?.user}</div>
                  <div className="text-[10px] text-stone-500">{leaderSession?.teamName} Leader</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs font-semibold"
                  >
                    <div className="px-4 py-2 border-b border-stone-100 text-stone-500">
                      Signed in as <br />
                      <span className="font-bold text-stone-900">{leaderSession?.email}</span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveModule('profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Profile & Settings</span>
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

        {/* Content Body */}
        <main className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
