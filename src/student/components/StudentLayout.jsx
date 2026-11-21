import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, QrCode, Users, Trophy, Calendar,
  CalendarDays, Award, Megaphone, Bell, Image, FileText,
  BarChart3, Settings, LogOut, Menu, X, ExternalLink,
  Globe, Shield, ChevronDown, CheckCircle2, Sparkles,
  GraduationCap, Clock, LifeBuoy, Code2
} from 'lucide-react';

export default function StudentLayout({
  activeModule,
  setActiveModule,
  studentSession,
  unreadCount = 0,
  onLogout,
  onViewPublicWebsite,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'My Dashboard', icon: LayoutDashboard },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'idcard', name: 'Digital ID Card', icon: QrCode, highlight: true },
    { id: 'team', name: 'My Team', icon: Users },
    { id: 'competitions', name: 'My Competitions', icon: Trophy },
    { id: 'programmes', name: 'My Programmes', icon: Calendar },
    { id: 'schedule', name: 'My Schedule', icon: CalendarDays },
    { id: 'results', name: 'My Results & Awards', icon: Award, highlight: true },
    { id: 'announcements', name: 'Announcements', icon: Megaphone },
    { id: 'notifications', name: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'gallery', name: 'Festival Gallery', icon: Image },
    { id: 'posters', name: 'Posters & Circulars', icon: FileText },
    { id: 'reports', name: 'Performance Report', icon: BarChart3 },
    { id: 'settings', name: 'Settings & Security', icon: Settings },
    { id: 'helpdesk', name: 'Convener Helpdesk', icon: LifeBuoy },
    { id: 'devsupport', name: 'Developer Support', icon: Code2, highlight: true }
  ];

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex font-sans selection:bg-[#A91F35] selection:text-white">
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#A91F35] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-68 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        {/* Top Branding Section */}
        <div className="p-4 sm:p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="h-11 w-auto">
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

          {/* Student Squad Pill */}
          <div className="mt-3.5 flex items-center justify-between bg-black/25 px-3 py-2 rounded-xl border border-white/10">
            <div className="truncate">
              <div className="text-[10px] text-white/60 uppercase font-black tracking-wider">
                Authorized Candidate
              </div>
              <div className="text-xs font-bold text-[#E6A916] truncate">
                {studentSession?.name || 'Student Candidate'}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#E6A916] text-[#A91F35] text-[11px] font-black font-mono shrink-0 shadow-xs">
              {studentSession?.chestNo || 'C-101'}
            </span>
          </div>
        </div>

        {/* Navigation Menu List */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto select-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-lg font-black'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#A91F35]' : 'text-white/70'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && !isActive && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && !item.badge && (
                  <span className="w-2 h-2 rounded-full bg-[#E6A916]" />
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
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

        {/* Bottom Silhouette & Student Info */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-serif font-black shrink-0">
              {studentSession?.name ? studentSession.name.charAt(0) : 'S'}
            </div>
            <div className="truncate">
              <div className="font-bold text-white truncate">{studentSession?.name || 'Student Candidate'}</div>
              <div className="text-[10px] text-white/60 truncate">{studentSession?.teamName || 'Squad Member'}</div>
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
                  ? `Welcome, ${studentSession?.name || 'Candidate'}`
                  : activeModule === 'profile'
                  ? 'My Student Profile'
                  : activeModule === 'idcard'
                  ? 'Official Digital Student ID Card'
                  : activeModule === 'team'
                  ? `${studentSession?.teamName || 'Team'} • Squad Overview`
                  : activeModule === 'competitions'
                  ? 'My Registered Competitions'
                  : activeModule === 'programmes'
                  ? 'My Festival Programmes'
                  : activeModule === 'schedule'
                  ? 'My Festival Schedule'
                  : activeModule === 'results'
                  ? 'My Certified Official Results'
                  : activeModule === 'announcements'
                  ? 'Student Bulletins & Notices'
                  : activeModule === 'notifications'
                  ? 'Student Notification Centre'
                  : activeModule === 'gallery'
                  ? 'Festival Media Gallery'
                  : activeModule === 'posters'
                  ? 'Official Posters & Downloads'
                  : activeModule === 'reports'
                  ? 'Personal Performance Dossier'
                  : 'Account & Security Settings'}
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Chest No: <strong className="font-mono text-[#A91F35]">{studentSession?.chestNo}</strong> • Team: <strong>{studentSession?.teamName}</strong> • {studentSession?.classCategory} Category
              </p>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveModule('notifications')}
              className="relative p-2 rounded-xl text-stone-600 hover:text-[#A91F35] hover:bg-stone-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A91F35] ring-2 ring-white" />
              )}
            </button>

            <button
              onClick={() => setActiveModule('idcard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E6A916]/15 hover:bg-[#E6A916]/25 text-[#A91F35] text-xs font-bold transition-colors border border-[#E6A916]/30"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Digital ID</span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-1.5 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#A91F35] text-white flex items-center justify-center font-serif font-black text-xs">
                  {studentSession?.name ? studentSession.name.charAt(0) : 'S'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-xs"
                  >
                    <div className="p-2 border-b border-stone-100">
                      <div className="font-bold text-stone-900 truncate">{studentSession?.name}</div>
                      <div className="text-[11px] text-stone-500 font-mono truncate">{studentSession?.chestNo}</div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveModule('profile');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-stone-700 hover:bg-stone-50 font-medium"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveModule('settings');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-stone-700 hover:bg-stone-50 font-medium"
                    >
                      <Settings className="w-4 h-4 text-stone-400" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Module Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
