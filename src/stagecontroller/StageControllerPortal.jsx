import React, { useState, useEffect } from 'react';
import StageControllerLogin from './components/StageControllerLogin';
import StageControllerLayout from './components/StageControllerLayout';
import StageControllerDashboard from './components/StageControllerDashboard';
import StageScheduleView from './components/StageScheduleView';
import StageCompetitions from './components/StageCompetitions';
import CodeLetterManagement from './components/CodeLetterManagement';
import LiveRandomDraw from './components/LiveRandomDraw';
import ParticipantCalling from './components/ParticipantCalling';
import JudgeCoordination from './components/JudgeCoordination';
import StageReports from './components/StageReports';
import StageSettings from './components/StageSettings';
import ConvenerHelpdesk from '../components/ConvenerHelpdesk';
import { festivalStore } from '../admin/data/festivalStore';

const STAGE_SESSION_KEY = 'dalanzia_stage_controller_session';

export default function StageControllerPortal({ onNavigatePublic }) {
  // Session state
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STAGE_SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
  const [refreshProfileKey, setRefreshProfileKey] = useState(0);

  // Sync session to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem(STAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STAGE_SESSION_KEY);
    }
  }, [session]);

  const handleLoginSuccess = (controllerData) => {
    setSession(controllerData);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem(STAGE_SESSION_KEY);
  };

  // Navigations between modules
  const handleLaunchDraw = (competitionId) => {
    setSelectedCompetitionId(competitionId);
    setActiveTab('draw');
  };

  const handleLaunchCalling = (competitionId) => {
    setSelectedCompetitionId(competitionId);
    setActiveTab('calling');
  };

  const handleManageCodes = (competitionId) => {
    setSelectedCompetitionId(competitionId);
    setActiveTab('codes');
  };

  if (!session) {
    return (
      <StageControllerLogin 
        onLoginSuccess={handleLoginSuccess} 
        onNavigatePublic={onNavigatePublic} 
      />
    );
  }

  // Get live stage profile
  const stageProfile = festivalStore.getStageControllerProfile(session.stageId) || session;

  return (
    <StageControllerLayout
      activeTab={activeTab}
      activeModule={activeTab}
      setActiveTab={setActiveTab}
      setActiveModule={setActiveTab}
      stageInfo={stageProfile}
      stageSession={stageProfile}
      onLogout={handleLogout}
      onViewPublicWebsite={onNavigatePublic}
      onOpenLiveDisplay={() => window.open('#stagedisplay', '_blank')}
    >
      {activeTab === 'dashboard' && (
        <StageControllerDashboard
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
          onNavigate={setActiveTab}
          onNavigateTab={setActiveTab}
          onLaunchDraw={handleLaunchDraw}
          onLaunchCalling={handleLaunchCalling}
        />
      )}

      {activeTab === 'schedule' && (
        <StageScheduleView
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'competitions' && (
        <StageCompetitions
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
          onNavigate={setActiveTab}
          onNavigateTab={setActiveTab}
          onLaunchDraw={handleLaunchDraw}
          onLaunchCalling={handleLaunchCalling}
          onSelectCompForDraw={handleLaunchDraw}
          onSelectCompForCalling={handleLaunchCalling}
          onManageCodes={handleManageCodes}
        />
      )}

      {activeTab === 'codes' && (
        <CodeLetterManagement
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
          onNavigateToDraw={handleLaunchDraw}
        />
      )}

      {activeTab === 'draw' && (
        <LiveRandomDraw
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
          preselectedCompId={selectedCompetitionId}
          onProceedToCalling={handleLaunchCalling}
        />
      )}

      {activeTab === 'calling' && (
        <ParticipantCalling
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
          preselectedCompId={selectedCompetitionId}
        />
      )}

      {activeTab === 'judges' && (
        <JudgeCoordination
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
        />
      )}

      {activeTab === 'reports' && (
        <StageReports
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
        />
      )}

      {activeTab === 'settings' && (
        <StageSettings
          stageId={session.stageId}
          stageInfo={stageProfile}
          stageSession={stageProfile}
          onLogout={handleLogout}
          onProfileUpdated={() => setRefreshProfileKey(prev => prev + 1)}
        />
      )}

      {activeTab === 'helpdesk' && (
        <ConvenerHelpdesk
          portalName="Stage Controller Portal"
          userProfile={session}
        />
      )}
    </StageControllerLayout>
  );
}
