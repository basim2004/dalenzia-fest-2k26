import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UserCheck,
  Layers,
  Users,
  Calendar,
  Trophy,
  CalendarDays,
  UserPlus,
  Shield,
  Compass,
  ClipboardList,
  ClipboardCheck,
  FileText,
  Clock,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  KeyRound,
  CheckCircle2,
  Lock,
  ExternalLink,
  Award,
  GraduationCap,
  Radio,
  Tv,
  LifeBuoy
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerLayout({
  activeModule,
  setActiveModule,
  convenerSession,
  onLogout,
  onViewPublicWebsite,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Convener Dashboard', icon: LayoutDashboard },
    { id: 'registration', name: 'Registration Desk', icon: ClipboardCheck, highlight: true },
    { id: 'students', name: 'Student Registry', icon: UserCheck },
    { id: 'assignments', name: 'Event Assignments', icon: Layers },
    { id: 'teams', name: 'Team Squads', icon: Users },
    { id: 'programmes', name: 'Programmes', icon: Calendar },
    { id: 'events', name: 'Competitions & Events', icon: Trophy },
    { id: 'results', name: 'Results & Publishing', icon: Award, highlight: true },
    { id: 'schedule', name: 'Master Schedule', icon: CalendarDays },
    { id: 'guests', name: 'Guests Management', icon: UserPlus },
    { id: 'judges', name: 'Judge Management', icon: Shield },
    { id: 'venues', name: 'Venues & Stages', icon: Compass },
    { id: 'activities', name: 'Operational Activities', icon: ClipboardList },
    { id: 'reports', name: 'Operational Reports', icon: FileText },
    { id: 'audit', name: 'Activity Audit Trail', icon: Clock },
    { id: 'helpdesk', name: 'Convener Helpdesk', icon: LifeBuoy, highlight: true }
  ];

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    try {
      festivalStore.updateConvenerPassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1800);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex font-sans selection:bg-[#A91F35] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (CONVENER OPERATIONS NAVIGATION)                          */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#A91F35] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-68 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        {/* Top Branding Section */}
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

          <div className="mt-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black uppercase tracking-wider">
              Convener Portal
            </span>
            <span className="text-[10px] text-white/60 font-mono">21, 22, 23 DEC 2026</span>
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
                    ? 'bg-[#E6A916] text-[#A91F35] shadow-md font-black'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A91F35]' : 'text-white/70'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A91F35]" />
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
            <a
              href="#teamleader"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Team Leader Portal</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#E6A916]" />
            </a>

            <a
              href="#student"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Student Portal</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#E6A916]" />
            </a>

            <a
              href="#stage"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Stage Controller</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#E6A916]" />
            </a>

            <a
              href="#stagedisplay"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Tv className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Live Stage Display</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#E6A916]" />
            </a>

            <a
              href="#judge"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-[11px] font-bold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Judge Portal</span>
              </div>
              <ExternalLink className="w-3 h-3 text-[#E6A916]" />
            </a>
          </div>
        </nav>

        {/* Bottom User Profile Section */}
        <div className="p-3.5 border-t border-white/10 bg-black/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
              IE
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">
                {convenerSession?.user || 'Irfan Eramangalam'}
              </div>
              <div className="text-[10px] text-white/60 truncate">
                Festival Convener
              </div>
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
      {/* 2. MAIN CONTENT AREA                                                      */}
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
                {activeModule === 'dashboard'
                  ? 'Convener Operational Command'
                  : activeModule === 'students'
                  ? 'Student Registry Management'
                  : activeModule === 'assignments'
                  ? 'Student Event & Programme Assignments'
                  : activeModule === 'teams'
                  ? 'Team Squads & Rosters'
                  : activeModule === 'programmes'
                  ? 'Programme Operations Management'
                  : activeModule === 'events'
                  ? 'Competitions & Event Configurations'
                  : activeModule === 'schedule'
                  ? 'Master Schedule & Conflict Detection'
                  : activeModule === 'guests'
                  ? 'Programme Guests & Dignitaries'
                  : activeModule === 'judges'
                  ? 'Adjudicator Panel & Event Assignments'
                  : activeModule === 'venues'
                  ? 'Stage & Venue Configurations'
                  : activeModule === 'activities'
                  ? 'Operational Activities / Paripadi'
                  : activeModule === 'reports'
                  ? 'Convener Operational Reports'
                  : 'Operational Audit Trail'}
              </h1>
              <p className="text-[11px] font-semibold text-stone-500">
                DALENZIA FEST 2K26 – NUEVA ERA • Dalailussunna Dars, Ayiroor
              </p>
            </div>
          </div>

          {/* Right Profile & Notifications */}
          <div className="flex items-center gap-3 sm:gap-4">
            {onViewPublicWebsite && (
              <button
                onClick={onViewPublicWebsite}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:text-[#A91F35] hover:bg-stone-100 transition-colors"
              >
                <span>Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-stone-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-bold text-xs shadow-xs">
                  HA
                </div>
                <div className="hidden md:block text-left text-xs">
                  <div className="font-bold text-stone-800 leading-tight">
                    {convenerSession?.user || 'Usthad Hashir Ali'}
                  </div>
                  <div className="text-[10px] text-stone-400">Festival Convener</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <div className="text-xs font-bold text-stone-900">{convenerSession?.user}</div>
                      <div className="text-[10px] text-stone-500 font-mono">{convenerSession?.email}</div>
                      <div className="text-[10px] text-[#A91F35] font-bold mt-1">Role: Festival Convener</div>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setShowPasswordModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#F7F3E9] hover:text-[#A91F35] flex items-center gap-2"
                    >
                      <KeyRound className="w-4 h-4 text-stone-400" />
                      <span>Change Password</span>
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-sm w-full border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#A91F35]">
                  <KeyRound className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">Change Convener Password</h3>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passwordSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password updated successfully!</span>
                </div>
              ) : (
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-3">
                  {passwordError && (
                    <div className="p-2.5 bg-rose-50 text-rose-800 text-xs rounded-xl font-semibold">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">New Password (min 6 chars)</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2.5 rounded-2xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
