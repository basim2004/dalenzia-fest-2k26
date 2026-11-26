import React, { useState, useEffect } from 'react';
import ConvenerLogin from './components/ConvenerLogin';
import ConvenerLayout from './components/ConvenerLayout';
import ConvenerDashboard from './components/ConvenerDashboard';
import ConvenerStudents from './components/ConvenerStudents';
import ConvenerAssignments from './components/ConvenerAssignments';
import ConvenerTeams from './components/ConvenerTeams';
import ConvenerProgrammes from './components/ConvenerProgrammes';
import ConvenerEvents from './components/ConvenerEvents';
import ConvenerSchedule from './components/ConvenerSchedule';
import ConvenerGuests from './components/ConvenerGuests';
import ConvenerJudges from './components/ConvenerJudges';
import ConvenerVenues from './components/ConvenerVenues';
import ConvenerActivities from './components/ConvenerActivities';
import ConvenerReports from './components/ConvenerReports';
import ConvenerAuditLogs from './components/ConvenerAuditLogs';
import ConvenerResults from './components/ConvenerResults';
import ConvenerHelpdesk from '../components/ConvenerHelpdesk';
import HelpResourcesPage from '../pages/HelpResourcesPage';
import RegistrationDeskModule from '../components/RegistrationDesk/RegistrationDeskModule';

export default function ConvenerPortal({ onNavigatePublic }) {
  const [convenerSession, setConvenerSession] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('dalenzia_convener_session');
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
      if (hash.includes('students')) return 'students';
      if (hash.includes('assignments')) return 'assignments';
      if (hash.includes('teams')) return 'teams';
      if (hash.includes('programmes')) return 'programmes';
      if (hash.includes('results')) return 'results';
      if (hash.includes('events')) return 'events';
      if (hash.includes('schedule')) return 'schedule';
      if (hash.includes('guests')) return 'guests';
      if (hash.includes('judges')) return 'judges';
      if (hash.includes('venues')) return 'venues';
      if (hash.includes('activities')) return 'activities';
      if (hash.includes('reports')) return 'reports';
      if (hash.includes('audit')) return 'audit';
      if (hash.includes('help_resources') || hash.includes('resources')) return 'help_resources';
      if (hash.includes('helpdesk')) return 'helpdesk';
    }
    return 'dashboard';
  });

  const switchModule = (mod) => {
    setActiveModule(mod);
    if (typeof window !== 'undefined') {
      if (mod === 'dashboard') {
        window.location.hash = '#convener';
      } else {
        window.location.hash = `#convener/${mod}`;
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('registration')) setActiveModule('registration');
      else if (hash.includes('students')) setActiveModule('students');
      else if (hash.includes('assignments')) setActiveModule('assignments');
      else if (hash.includes('teams')) setActiveModule('teams');
      else if (hash.includes('programmes')) setActiveModule('programmes');
      else if (hash.includes('results')) setActiveModule('results');
      else if (hash.includes('events')) setActiveModule('events');
      else if (hash.includes('schedule')) setActiveModule('schedule');
      else if (hash.includes('guests')) setActiveModule('guests');
      else if (hash.includes('judges')) setActiveModule('judges');
      else if (hash.includes('venues')) setActiveModule('venues');
      else if (hash.includes('activities')) setActiveModule('activities');
      else if (hash.includes('reports')) setActiveModule('reports');
      else if (hash.includes('audit')) setActiveModule('audit');
      else if (hash.includes('help_resources') || hash.includes('resources')) setActiveModule('help_resources');
      else if (hash.includes('helpdesk')) setActiveModule('helpdesk');
      else if (hash === '#convener' || hash === '#convener/dashboard') setActiveModule('dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginSuccess = (session) => {
    setConvenerSession(session);
    setActiveModule('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dalenzia_convener_session');
    setConvenerSession(null);
  };

  // If unauthenticated, show dedicated Convener Login screen
  if (!convenerSession) {
    return <ConvenerLogin onLoginSuccess={handleLoginSuccess} onNavigatePublic={onNavigatePublic} />;
  }

  return (
    <ConvenerLayout
      activeModule={activeModule}
      setActiveModule={switchModule}
      convenerSession={convenerSession}
      onLogout={handleLogout}
      onViewPublicWebsite={onNavigatePublic}
    >
      {activeModule === 'dashboard' ? (
        <ConvenerDashboard onNavigateModule={switchModule} />
      ) : activeModule === 'registration' ? (
        <RegistrationDeskModule userSession={convenerSession} portalRole="convener" />
      ) : activeModule === 'students' ? (
        <ConvenerStudents />
      ) : activeModule === 'assignments' ? (
        <ConvenerAssignments />
      ) : activeModule === 'teams' ? (
        <ConvenerTeams />
      ) : activeModule === 'programmes' ? (
        <ConvenerProgrammes />
      ) : activeModule === 'events' ? (
        <ConvenerEvents />
      ) : activeModule === 'results' ? (
        <ConvenerResults />
      ) : activeModule === 'schedule' ? (
        <ConvenerSchedule />
      ) : activeModule === 'guests' ? (
        <ConvenerGuests />
      ) : activeModule === 'judges' ? (
        <ConvenerJudges />
      ) : activeModule === 'venues' ? (
        <ConvenerVenues />
      ) : activeModule === 'activities' ? (
        <ConvenerActivities />
      ) : activeModule === 'reports' ? (
        <ConvenerReports />
      ) : activeModule === 'helpdesk' ? (
        <ConvenerHelpdesk
          portalName="Convener Portal"
          userProfile={convenerSession}
          isConvenerView={true}
        />
      ) : activeModule === 'help_resources' ? (
        <HelpResourcesPage />
      ) : (
        <ConvenerAuditLogs />
      )}
    </ConvenerLayout>
  );
}
