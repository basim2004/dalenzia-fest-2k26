import React, { useState, useEffect } from 'react';
import StudentLogin from './components/StudentLogin';
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './components/StudentDashboard';
import StudentProfile from './components/StudentProfile';
import StudentIdCard from './components/StudentIdCard';
import StudentTeam from './components/StudentTeam';
import StudentCompetitions from './components/StudentCompetitions';
import StudentProgrammes from './components/StudentProgrammes';
import StudentSchedule from './components/StudentSchedule';
import StudentResults from './components/StudentResults';
import StudentAnnouncements from './components/StudentAnnouncements';
import StudentNotifications from './components/StudentNotifications';
import StudentGallery from './components/StudentGallery';
import StudentPosters from './components/StudentPosters';
import StudentReports from './components/StudentReports';
import StudentSettings from './components/StudentSettings';
import DeveloperSupportSection from './components/DeveloperSupportSection';
import ConvenerHelpdesk from '../components/ConvenerHelpdesk';
import { festivalStore } from '../admin/data/festivalStore';

export default function StudentPortal({ onNavigatePublic }) {
  const [studentSession, setStudentSession] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('dalenzia_student_session');
        if (stored === 'logged_out') return null;
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
      if (hash.includes('profile')) return 'profile';
      if (hash.includes('idcard') || hash.includes('pass') || hash.includes('id')) return 'idcard';
      if (hash.includes('team') || hash.includes('squad')) return 'team';
      if (hash.includes('competitions') || hash.includes('events')) return 'competitions';
      if (hash.includes('programmes') || hash.includes('sessions')) return 'programmes';
      if (hash.includes('schedule') || hash.includes('timeline')) return 'schedule';
      if (hash.includes('results') || hash.includes('awards') || hash.includes('laurels')) return 'results';
      if (hash.includes('announcements') || hash.includes('circulars')) return 'announcements';
      if (hash.includes('notifications') || hash.includes('alerts')) return 'notifications';
      if (hash.includes('gallery') || hash.includes('media')) return 'gallery';
      if (hash.includes('posters') || hash.includes('downloads')) return 'posters';
      if (hash.includes('reports') || hash.includes('dossier')) return 'reports';
      if (hash.includes('settings') || hash.includes('password')) return 'settings';
      if (hash.includes('helpdesk')) return 'helpdesk';
      if (hash.includes('devsupport') || hash.includes('developer')) return 'devsupport';
    }
    return 'dashboard';
  });

  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  const refreshUnreadCount = () => {
    if (!studentSession?.id) return;
    try {
      const notifs = festivalStore.getStudentNotifications(studentSession.id);
      setUnreadNotifsCount(notifs.filter(n => !n.read).length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshUnreadCount();
  }, [studentSession?.id]);

  const switchModule = (mod) => {
    setActiveModule(mod);
    if (typeof window !== 'undefined') {
      if (mod === 'dashboard') {
        window.location.hash = '#student';
      } else {
        window.location.hash = `#student/${mod}`;
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('profile')) setActiveModule('profile');
      else if (hash.includes('idcard') || hash.includes('pass') || hash.includes('id')) setActiveModule('idcard');
      else if (hash.includes('team') || hash.includes('squad')) setActiveModule('team');
      else if (hash.includes('competitions') || hash.includes('events')) setActiveModule('competitions');
      else if (hash.includes('programmes') || hash.includes('sessions')) setActiveModule('programmes');
      else if (hash.includes('schedule') || hash.includes('timeline')) setActiveModule('schedule');
      else if (hash.includes('results') || hash.includes('awards') || hash.includes('laurels')) setActiveModule('results');
      else if (hash.includes('announcements') || hash.includes('circulars')) setActiveModule('announcements');
      else if (hash.includes('notifications') || hash.includes('alerts')) setActiveModule('notifications');
      else if (hash.includes('gallery') || hash.includes('media')) setActiveModule('gallery');
      else if (hash.includes('posters') || hash.includes('downloads')) setActiveModule('posters');
      else if (hash.includes('reports') || hash.includes('dossier')) setActiveModule('reports');
      else if (hash.includes('settings') || hash.includes('password')) setActiveModule('settings');
      else if (hash.includes('helpdesk')) setActiveModule('helpdesk');
      else if (hash.includes('devsupport') || hash.includes('developer')) setActiveModule('devsupport');
      else if (hash === '#student' || hash === '#students' || hash === '#student/dashboard') setActiveModule('dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = (session) => {
    sessionStorage.setItem('dalenzia_student_session', JSON.stringify(session));
    setStudentSession(session);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.setItem('dalenzia_student_session', 'logged_out');
    setStudentSession(null);
  };

  // If unauthenticated, render dedicated Student Login
  if (!studentSession) {
    return <StudentLogin onLoginSuccess={handleLoginSuccess} onNavigatePublic={onNavigatePublic} />;
  }

  return (
    <StudentLayout
      activeModule={activeModule}
      setActiveModule={switchModule}
      studentSession={studentSession}
      unreadCount={unreadNotifsCount}
      onLogout={handleLogout}
      onViewPublicWebsite={onNavigatePublic}
    >
      {activeModule === 'dashboard' && (
        <StudentDashboard studentSession={studentSession} onNavigate={switchModule} />
      )}
      {activeModule === 'profile' && (
        <StudentProfile studentSession={studentSession} />
      )}
      {activeModule === 'idcard' && (
        <StudentIdCard studentSession={studentSession} />
      )}
      {activeModule === 'team' && (
        <StudentTeam studentSession={studentSession} onNavigate={switchModule} />
      )}
      {activeModule === 'competitions' && (
        <StudentCompetitions studentSession={studentSession} />
      )}
      {activeModule === 'programmes' && (
        <StudentProgrammes studentSession={studentSession} />
      )}
      {activeModule === 'schedule' && (
        <StudentSchedule studentSession={studentSession} />
      )}
      {activeModule === 'results' && (
        <StudentResults studentSession={studentSession} />
      )}
      {activeModule === 'announcements' && (
        <StudentAnnouncements studentSession={studentSession} />
      )}
      {activeModule === 'notifications' && (
        <StudentNotifications studentSession={studentSession} onRefreshStats={refreshUnreadCount} />
      )}
      {activeModule === 'gallery' && (
        <StudentGallery />
      )}
      {activeModule === 'posters' && (
        <StudentPosters />
      )}
      {activeModule === 'reports' && (
        <StudentReports studentSession={studentSession} />
      )}
      {activeModule === 'settings' && (
        <StudentSettings studentSession={studentSession} onLogout={handleLogout} />
      )}
      {activeModule === 'helpdesk' && (
        <ConvenerHelpdesk portalName="Student Portal" userProfile={studentSession} />
      )}
      {activeModule === 'devsupport' && (
        <DeveloperSupportSection />
      )}
    </StudentLayout>
  );
}
