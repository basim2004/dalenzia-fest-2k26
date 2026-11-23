import React, { useState, useEffect } from 'react';
import TeamLeaderLogin from './components/TeamLeaderLogin';
import TeamLeaderLayout from './components/TeamLeaderLayout';
import TeamLeaderDashboard from './components/TeamLeaderDashboard';
import TeamLeaderMyTeam from './components/TeamLeaderMyTeam';
import TeamLeaderStudents from './components/TeamLeaderStudents';
import TeamLeaderCompetitions from './components/TeamLeaderCompetitions';
import TeamLeaderProgrammes from './components/TeamLeaderProgrammes';
import TeamLeaderResults from './components/TeamLeaderResults';
import TeamLeaderLeaderboard from './components/TeamLeaderLeaderboard';
import TeamLeaderSchedule from './components/TeamLeaderSchedule';
import TeamLeaderGuests from './components/TeamLeaderGuests';
import TeamLeaderAnnouncements from './components/TeamLeaderAnnouncements';
import TeamLeaderGallery from './components/TeamLeaderGallery';
import TeamLeaderPosters from './components/TeamLeaderPosters';
import TeamLeaderReports from './components/TeamLeaderReports';
import TeamLeaderProfile from './components/TeamLeaderProfile';
import ConvenerHelpdesk from '../components/ConvenerHelpdesk';
import { festivalStore } from '../admin/data/festivalStore';

export default function TeamLeaderPortal({ onNavigatePublic }) {
  const [leaderSession, setLeaderSession] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('dalenzia_teamleader_session');
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
      if (hash.includes('students')) return 'students';
      if (hash.includes('myteam') || hash.includes('squad')) return 'myteam';
      if (hash.includes('competitions')) return 'competitions';
      if (hash.includes('programmes')) return 'programmes';
      if (hash.includes('results')) return 'results';
      if (hash.includes('leaderboard')) return 'leaderboard';
      if (hash.includes('schedule')) return 'schedule';
      if (hash.includes('guests')) return 'guests';
      if (hash.includes('announcements')) return 'announcements';
      if (hash.includes('gallery')) return 'gallery';
      if (hash.includes('posters')) return 'posters';
      if (hash.includes('reports')) return 'reports';
      if (hash.includes('profile')) return 'profile';
      if (hash.includes('helpdesk')) return 'helpdesk';
    }
    return 'dashboard';
  });

  const switchModule = (mod) => {
    setActiveModule(mod);
    if (typeof window !== 'undefined') {
      if (mod === 'dashboard') {
        window.location.hash = '#teamleader';
      } else {
        window.location.hash = `#teamleader/${mod}`;
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('students')) setActiveModule('students');
      else if (hash.includes('myteam') || hash.includes('squad')) setActiveModule('myteam');
      else if (hash.includes('competitions')) setActiveModule('competitions');
      else if (hash.includes('programmes')) setActiveModule('programmes');
      else if (hash.includes('results')) setActiveModule('results');
      else if (hash.includes('leaderboard')) setActiveModule('leaderboard');
      else if (hash.includes('schedule')) setActiveModule('schedule');
      else if (hash.includes('guests')) setActiveModule('guests');
      else if (hash.includes('announcements')) setActiveModule('announcements');
      else if (hash.includes('gallery')) setActiveModule('gallery');
      else if (hash.includes('posters')) setActiveModule('posters');
      else if (hash.includes('reports')) setActiveModule('reports');
      else if (hash.includes('profile')) setActiveModule('profile');
      else if (hash.includes('helpdesk')) setActiveModule('helpdesk');
      else if (hash === '#teamleader' || hash === '#teamleader/dashboard' || hash === '#team') {
        setActiveModule('dashboard');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = (session) => {
    sessionStorage.setItem('dalenzia_teamleader_session', JSON.stringify(session));
    setLeaderSession(session);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.setItem('dalenzia_teamleader_session', 'logged_out');
    setLeaderSession(null);
  };

  // If unauthenticated, show dedicated Team Leader Login screen
  if (!leaderSession) {
    return <TeamLeaderLogin onLoginSuccess={handleLoginSuccess} onNavigatePublic={onNavigatePublic} />;
  }

  const teamId = leaderSession.teamId;

  return (
    <TeamLeaderLayout
      activeModule={activeModule}
      setActiveModule={switchModule}
      leaderSession={leaderSession}
      onLogout={handleLogout}
      onViewPublicWebsite={onNavigatePublic}
    >
      {activeModule === 'dashboard' ? (
        <TeamLeaderDashboard teamId={teamId} onNavigateModule={switchModule} />
      ) : activeModule === 'myteam' ? (
        <TeamLeaderMyTeam teamId={teamId} onNavigateModule={switchModule} />
      ) : activeModule === 'students' ? (
        <TeamLeaderStudents teamId={teamId} />
      ) : activeModule === 'competitions' ? (
        <TeamLeaderCompetitions teamId={teamId} />
      ) : activeModule === 'programmes' ? (
        <TeamLeaderProgrammes teamId={teamId} />
      ) : activeModule === 'results' ? (
        <TeamLeaderResults teamId={teamId} />
      ) : activeModule === 'leaderboard' ? (
        <TeamLeaderLeaderboard teamId={teamId} />
      ) : activeModule === 'schedule' ? (
        <TeamLeaderSchedule teamId={teamId} />
      ) : activeModule === 'guests' ? (
        <TeamLeaderGuests />
      ) : activeModule === 'announcements' ? (
        <TeamLeaderAnnouncements teamId={teamId} />
      ) : activeModule === 'gallery' ? (
        <TeamLeaderGallery />
      ) : activeModule === 'posters' ? (
        <TeamLeaderPosters />
      ) : activeModule === 'reports' ? (
        <TeamLeaderReports teamId={teamId} />
      ) : activeModule === 'helpdesk' ? (
        <ConvenerHelpdesk portalName="Team Leader Portal" userProfile={leaderSession} />
      ) : (
        <TeamLeaderProfile teamId={teamId} leaderSession={leaderSession} onLogout={handleLogout} />
      )}
    </TeamLeaderLayout>
  );
}
