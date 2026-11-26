import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/AdminLayout';
import DashboardView from './components/DashboardView';
import TeamManagementView from './components/TeamManagementView';
import JudgeManagementModule from './components/JudgeManagementModule';
import StudentsModule from './components/StudentsModule';
import CompetitionsModule from './components/CompetitionsModule';
import ScoringCalculatorModule from './components/ScoringCalculatorModule';
import ProgrammesModule from './components/ProgrammesModule';
import GuestsModule from './components/GuestsModule';
import ScheduleModule from './components/ScheduleModule';
import GalleryModule from './components/GalleryModule';
import PostersModule from './components/PostersModule';
import AnnouncementsModule from './components/AnnouncementsModule';
import ReportsModule from './components/ReportsModule';
import SystemSettingsModule from './components/SystemSettingsModule';
import RegistrationDeskModule from '../components/RegistrationDesk/RegistrationDeskModule';

export default function AdminPortal({ onNavigatePublic }) {
  const [userSession, setUserSession] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('dalenzia_admin_session');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [activeModule, setActiveModule] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('registration')) return 'registration';
      if (hash.includes('teams')) return 'teams';
      if (hash.includes('judges')) return 'judges';
      if (hash.includes('students')) return 'students';
      if (hash.includes('competitions')) return 'competitions';
      if (hash.includes('results')) return 'results';
      if (hash.includes('guests')) return 'programme_guests';
      if (hash.includes('schedule')) return 'schedule';
      if (hash.includes('gallery')) return 'gallery';
      if (hash.includes('posters')) return 'posters';
      if (hash.includes('announcements')) return 'announcements';
      if (hash.includes('reports')) return 'reports';
      if (hash.includes('settings')) return 'settings';
      if (hash.includes('programme')) return 'programme';
    }
    return 'dashboard';
  });

  // Keep hash synchronized with active module
  const switchModule = (mod) => {
    setActiveModule(mod);
    if (typeof window !== 'undefined') {
      if (mod === 'dashboard') {
        window.location.hash = '#admin';
      } else {
        window.location.hash = `#admin/${mod}`;
      }
    }
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('registration')) setActiveModule('registration');
      else if (hash.includes('results')) setActiveModule('results');
      else if (hash.includes('guests')) setActiveModule('programme_guests');
      else if (hash.includes('schedule')) setActiveModule('schedule');
      else if (hash.includes('gallery')) setActiveModule('gallery');
      else if (hash.includes('posters')) setActiveModule('posters');
      else if (hash.includes('announcements')) setActiveModule('announcements');
      else if (hash.includes('reports')) setActiveModule('reports');
      else if (hash.includes('programme')) setActiveModule('programme');
      else if (hash.includes('competitions')) setActiveModule('competitions');
      else if (hash.includes('students')) setActiveModule('students');
      else if (hash.includes('teams')) setActiveModule('teams');
      else if (hash.includes('judges')) setActiveModule('judges');
      else if (hash === '#admin' || hash === '#admin/dashboard') setActiveModule('dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = (session) => {
    setUserSession(session);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dalenzia_admin_session');
    setUserSession(null);
  };

  // 1. If unauthenticated, always show the dedicated Developer & Admin Login screen
  if (!userSession) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Strict role authorization:
  // Verified administrator and convener roles may access Control Centre modules
  const ADMIN_AUTHORIZED_ROLES = ['super_admin', 'admin', 'developer', 'MAIN_ADMIN', 'result_mgr', 'reg_mgr', 'CONVENER', 'convener'];
  const isAuthorizedAdmin = userSession && (
    ADMIN_AUTHORIZED_ROLES.includes(userSession.role) ||
    ADMIN_AUTHORIZED_ROLES.includes(userSession.roleKey) ||
    userSession.portalRole === 'admin'
  );

  if (!isAuthorizedAdmin) {
    const rolePortalMap = {
      convener: { name: 'Convener Portal', hash: '#convener' },
      judge: { name: 'Judge Portal', hash: '#judge' },
      team_leader: { name: 'Team Leader Portal', hash: '#teamleader' },
      student: { name: 'Student Portal', hash: '#student' },
      stage_controller: { name: 'Stage Controller Portal', hash: '#stage' }
    };
    const targetPortal = rolePortalMap[userSession.role] || rolePortalMap[userSession.role?.toLowerCase()] || { name: 'Public Site', hash: '#home' };

    return (
      <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl border-2 border-rose-300 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black uppercase tracking-wider">
              403 Forbidden · Route Protected
            </span>
            <h2 className="font-serif font-black text-2xl text-stone-900 mt-2">
              Access Denied
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed mt-2">
              Your account ({userSession.user || userSession.email || 'Authenticated User'}) is not authorized for the Main Admin Control Centre. Access is strictly restricted to certified festival administrators.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                window.location.hash = targetPortal.hash;
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#A91F35] text-white text-xs font-bold shadow-md hover:bg-[#8D182B] transition-all cursor-pointer"
            >
              Return to {targetPortal.name}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('dalenzia_admin_session');
                setUserSession(null);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-all cursor-pointer"
            >
              Sign In with Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine which subtab for Judge Management
  const getJudgeSubTab = () => {
    if (activeModule === 'judges_list') return 'judges';
    if (activeModule === 'judges_assignments') return 'assignments';
    if (activeModule === 'judges_monitoring') return 'monitoring';
    if (activeModule === 'judges_marks') return 'marks';
    if (activeModule === 'judges_verification') return 'verification';
    if (activeModule === 'judges_posters') return 'posters';
    if (activeModule === 'judges_reports') return 'reports';
    return 'dashboard';
  };

  return (
    <AdminLayout
      activeModule={activeModule}
      setActiveModule={switchModule}
      userSession={userSession}
      onLogout={handleLogout}
      onViewPublicWebsite={onNavigatePublic}
    >
      {activeModule === 'dashboard' ? (
        <DashboardView onNavigateModule={(mod) => switchModule(mod)} />
      ) : activeModule === 'registration' || activeModule.startsWith('registration') ? (
        <RegistrationDeskModule userSession={userSession} portalRole="admin" />
      ) : activeModule.startsWith('judges') ? (
        <JudgeManagementModule initialTab={getJudgeSubTab()} />
      ) : activeModule === 'students' || activeModule.startsWith('students') ? (
        <StudentsModule activeSection={activeModule} />
      ) : activeModule === 'competitions' || activeModule.startsWith('competitions') ? (
        <CompetitionsModule activeSection={activeModule} />
      ) : activeModule === 'results' || activeModule.startsWith('results') ? (
        <ScoringCalculatorModule activeSection={activeModule} />
      ) : activeModule === 'programme_guests' || activeModule.startsWith('programme_guests') ? (
        <GuestsModule activeSection={activeModule} />
      ) : activeModule === 'schedule' || activeModule.startsWith('schedule') ? (
        <ScheduleModule activeSection={activeModule} />
      ) : activeModule === 'gallery' || activeModule.startsWith('gallery') ? (
        <GalleryModule activeSection={activeModule} />
      ) : activeModule === 'posters' || activeModule.startsWith('posters') ? (
        <PostersModule activeSection={activeModule} />
      ) : activeModule === 'announcements' || activeModule.startsWith('announcements') ? (
        <AnnouncementsModule activeSection={activeModule} />
      ) : activeModule === 'reports' || activeModule.startsWith('reports') ? (
        <ReportsModule activeSection={activeModule} />
      ) : activeModule === 'programme' || activeModule.startsWith('programme') ? (
        <CompetitionsModule activeSection={activeModule} />
      ) : activeModule === 'settings' || activeModule.startsWith('settings') ? (
        <SystemSettingsModule activeSection={activeModule} />
      ) : (
        <TeamManagementView activeSection={activeModule} />
      )}
    </AdminLayout>
  );
}
