import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Trophy, Hash, Sparkles, Volume2,
  Tv, ShieldCheck, FileText, Settings, LogOut, Menu,
  X, ExternalLink, Globe, Mic2, MapPin, Radio,
  Clock, Monitor, LifeBuoy
} from 'lucide-react';

export default function StageControllerLayout({
  activeModule,
  activeTab,
  setActiveModule,
  setActiveTab,
  stageSession,
  stageInfo,
  onLogout,
  onViewPublicWebsite,
  onOpenLiveDisplay,
  children
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Normalize active tab & setter
  const currentTab = activeModule || activeTab || 'dashboard';
  const handleTabChange = (tabId) => {
    if (setActiveModule) setActiveModule(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };
  const session = stageSession || stageInfo || {};

  const navigationItems = [
    { id: 'dashboard', name: 'Stage Dashboard', icon: LayoutDashboard },
    { id: 'competitions', name: 'Stage Competitions', icon: Trophy },
    { id: 'codes', name: 'Participant Code Letters', icon: Hash },
    { id: 'draw', name: 'Live Random Code Draw', icon: Sparkles, highlight: true },
    { id: 'calling', name: 'Participant Calling', icon: Volume2, highlight: true },
    { id: 'display', name: 'Live Stage Display (LED)', icon: Tv, highlight: true, isDisplay: true },
    { id: 'judges', name: 'Judge Coordination', icon: ShieldCheck },
    { id: 'reports', name: 'Stage Reports & Lists', icon: FileText },
    { id: 'settings', name: 'Stage Settings', icon: Settings },
    { id: 'helpdesk', name: 'Convener Helpdesk', icon: LifeBuoy, highlight: true }
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

          {/* Assigned Stage Banner Pill */}
          <div className="mt-3.5 bg-black/25 px-3 py-2.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/60 uppercase font-black tracking-wider">
                Authorized Stage
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-[10px] font-mono">
                STAGE {session?.stageNumber || '01'}
              </span>
            </div>
            <div className="text-xs font-bold text-white truncate mt-1">
              {session?.shortName || session?.stageName || 'Stage 01'}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/70 mt-0.5 truncate">
              <MapPin className="w-3 h-3 text-[#E6A916] shrink-0" />
              <span className="truncate">{session?.venue || 'Cordova Grand Stage'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu List */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto select-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isDisplay) {
                    if (onOpenLiveDisplay) onOpenLiveDisplay();
                    else window.open('#stagedisplay', '_blank');
                  } else {
                    handleTabChange(item.id);
                  }
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
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#E6A916] animate-pulse" />
                )}
                {item.isDisplay && (
                  <ExternalLink className="w-3.5 h-3.5 text-[#E6A916]" />
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
            <button
              onClick={onViewPublicWebsite || (() => { window.location.hash = '#home'; })}
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

        {/* Bottom Controller Info */}
        <div className="p-4 border-t border-white/10 bg-black/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-serif font-black shrink-0">
              {session?.name ? session.name.charAt(0) : 'C'}
            </div>
            <div className="truncate">
              <div className="font-bold text-white truncate">{session?.name || 'Stage Controller'}</div>
              <div className="text-[10px] text-white/60 truncate">Stage {session?.stageNumber || '01'} Controller</div>
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
                {currentTab === 'dashboard'
                  ? `${session?.shortName || session?.stageName || 'Stage'} • Operations Hub`
                  : currentTab === 'competitions'
                  ? 'Stage Competition Management'
                  : currentTab === 'codes'
                  ? 'Participant Code Letter Management'
                  : currentTab === 'draw'
                  ? 'Live Random Code Draw Session'
                  : currentTab === 'calling'
                  ? 'Participant Calling & Stage Entry'
                  : currentTab === 'judges'
                  ? 'Judge Coordination & Status'
                  : currentTab === 'reports'
                  ? 'Stage Reports & Calling Sheets'
                  : 'Stage Settings & Profile'}
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                21, 22, 23 DECEMBER 2026 • Assigned: <strong>Stage {session?.stageNumber || '01'}</strong> ({session?.venue || 'Cordova Grand Stage'}) • Controller: <strong>{session?.name || 'Official'}</strong>
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (onOpenLiveDisplay) onOpenLiveDisplay();
                else window.open('#stagedisplay', '_blank');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Display (LED)</span>
              <span className="sm:hidden">Display</span>
            </button>
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
