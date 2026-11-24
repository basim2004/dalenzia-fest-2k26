import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import CinematicHero from './components/CinematicHero';
import AboutSection from './components/AboutSection';
import FestivalNumbers from './components/FestivalNumbers';
import FestivalCountdownStage from './components/FestivalCountdownStage';
import FooterCinematic from './components/FooterCinematic';
import VideoTeaserModal from './components/VideoTeaserModal';
import WhatsAppCommunitySection from './components/WhatsAppCommunitySection';
import InstagramShowcaseSection from './components/InstagramShowcaseSection';
import EventsPage from './pages/EventsPage';
import GuestsPage from './pages/GuestsPage';
import SchedulePage from './pages/SchedulePage';
import ResultsPage from './pages/ResultsPage';
import GalleryPage from './pages/GalleryPage';
import PostersPage from './pages/PostersPage';
import PreviousEditionPage from './pages/PreviousEditionPage';
import RegisterPage from './pages/RegisterPage';
import CountdownPage from './pages/CountdownPage';
import AdminPortal from './admin/AdminPortal';
import JudgePortal from './judge/JudgePortal';
import ConvenerPortal from './convener/ConvenerPortal';
import TeamLeaderPortal from './teamleader/TeamLeaderPortal';
import StudentPortal from './student/StudentPortal';
import StageControllerPortal from './stagecontroller/StageControllerPortal';
import LiveStageDisplay from './stagedisplay/LiveStageDisplay';

export default function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (
        hash.includes('admin') || hash.includes('developer') || hash.includes('convener') ||
        hash.includes('judge') || hash.includes('teamleader') ||
        hash.includes('student') || hash.includes('stage') ||
        hash.includes('previous') || hash.includes('dalenzia2k25') ||
        hash.includes('register') ||
        hash.includes('instagram') || hash.includes('community') || hash.includes('home') ||
        path.includes('admin') || path.includes('developer') || path.includes('convener') ||
        path.includes('judge') || path.includes('teamleader') ||
        path.includes('student') || path.includes('stage') ||
        path.includes('previous') || path.includes('dalenzia2k25') ||
        path.includes('register') ||
        path.includes('instagram') || path.includes('community')
      ) {
        return false;
      }
    }
    return true;
  });
  const [lang, setLang] = useState('en');
  const [isTeaserOpen, setIsTeaserOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#previous' || hash === '#dalenzia2k25' || hash === '#2k25' || hash.startsWith('#2k25') || hash.startsWith('#previous') || path === '/previous' || path === '/dalenzia2k25') return 'previous';
      if (hash === '#stagedisplay' || hash === '#display' || path === '/stagedisplay' || path === '/display') return 'stagedisplay';
      if (hash === '#stage' || hash === '#stagecontroller' || path === '/stage' || path === '/stagecontroller') return 'stage';
      if (hash === '#register' || hash.startsWith('#register') || path === '/register' || path.startsWith('/register')) return 'register';
      if (hash === '#student' || path === '/student') return 'student';
      if (hash === '#teamleader' || path === '/teamleader') return 'teamleader';
      if (hash === '#judge' || hash.startsWith('#judge') || path === '/judge' || path.startsWith('/judge')) return 'judge';
      if (hash === '#convener' || hash.startsWith('#convener/') || path === '/convener' || path.startsWith('/convener/')) return 'convener';
      if (hash === '#admin' || hash.startsWith('#admin/') || hash === '#developer' || hash.startsWith('#developer/') || path === '/admin' || path.startsWith('/admin/')) return 'admin';
      if (hash === '#results' || path === '/results') return 'results';
      if (hash === '#downloads' || path === '/downloads' || hash === '#posters' || path === '/posters') return 'downloads';
      if (hash === '#gallery' || path === '/gallery') return 'gallery';
      if (hash === '#schedule' || path === '/schedule') return 'schedule';
      if (hash === '#guests' || path === '/guests') return 'guests';
      if (hash === '#events' || path === '/events') return 'events';
      if (hash === '#countdown' || path === '/countdown') return 'countdown';
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      // 2K25 Previous Edition Historical Archive Route Guard
      if (
        hash === '#previous' ||
        hash === '#dalenzia2k25' ||
        hash === '#2k25' ||
        hash.startsWith('#2k25') ||
        hash.startsWith('#previous') ||
        path === '/previous' ||
        path === '/dalenzia2k25'
      ) {
        setCurrentPage('previous');
        return;
      }

      // 2K26 Operational Portals and Public Routes (Exact Matches Only)
      if (hash === '#stagedisplay' || hash === '#display' || path === '/stagedisplay' || path === '/display') {
        setCurrentPage('stagedisplay');
      } else if (hash === '#stage' || hash === '#stagecontroller' || path === '/stage' || path === '/stagecontroller') {
        setCurrentPage('stage');
      } else if (hash === '#register' || hash.startsWith('#register') || path === '/register' || path.startsWith('/register')) {
        setCurrentPage('register');
      } else if (hash === '#student' || path === '/student') {
        setCurrentPage('student');
      } else if (hash === '#teamleader' || path === '/teamleader') {
        setCurrentPage('teamleader');
      } else if (hash === '#judge' || hash.startsWith('#judge') || path === '/judge' || path.startsWith('/judge')) {
        setCurrentPage('judge');
      } else if (hash === '#convener' || hash.startsWith('#convener/') || path === '/convener' || path.startsWith('/convener/')) {
        setCurrentPage('convener');
      } else if (hash === '#admin' || hash.startsWith('#admin/') || hash === '#developer' || hash.startsWith('#developer/') || path === '/admin' || path.startsWith('/admin/')) {
        setCurrentPage('admin');
      } else if (hash === '#results' || path === '/results') {
        setCurrentPage('results');
      } else if (hash === '#downloads' || path === '/downloads' || hash === '#posters' || path === '/posters') {
        setCurrentPage('downloads');
      } else if (hash === '#gallery' || path === '/gallery') {
        setCurrentPage('gallery');
      } else if (hash === '#schedule' || path === '/schedule') {
        setCurrentPage('schedule');
      } else if (hash === '#guests' || path === '/guests') {
        setCurrentPage('guests');
      } else if (hash === '#events' || path === '/events') {
        setCurrentPage('events');
      } else if (hash === '#countdown' || path === '/countdown') {
        setCurrentPage('countdown');
      } else if (hash === '#home' || hash === '') {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigateToHome = () => {
    setCurrentPage('home');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToRegister = () => {
    setCurrentPage('register');
    window.location.hash = '#register';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToEvents = () => {
    setCurrentPage('events');
    window.location.hash = '#events';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToGuests = () => {
    setCurrentPage('guests');
    window.location.hash = '#guests';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSchedule = () => {
    setCurrentPage('schedule');
    window.location.hash = '#schedule';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToResults = () => {
    setCurrentPage('results');
    window.location.hash = '#results';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDownloads = () => {
    setCurrentPage('downloads');
    window.location.hash = '#downloads';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToGallery = () => {
    setCurrentPage('gallery');
    window.location.hash = '#gallery';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPrevious = () => {
    setCurrentPage('previous');
    window.location.hash = '#previous';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setCurrentPage('admin');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Live Stage Display is active, render the fullscreen LED wall & projector screen
  if (currentPage === 'stagedisplay') {
    return <LiveStageDisplay onNavigatePublic={navigateToHome} />;
  }

  // If Stage Controller Portal is active, render dedicated stage operations portal
  if (currentPage === 'stage') {
    return <StageControllerPortal onNavigatePublic={navigateToHome} />;
  }

  // If Student Portal is active, render dedicated student operational portal
  if (currentPage === 'student') {
    return <StudentPortal onNavigatePublic={navigateToHome} />;
  }

  // If Judge Portal is active, render dedicated individual judge grading portal
  if (currentPage === 'judge') {
    return <JudgePortal onNavigatePublic={navigateToHome} />;
  }

  // If Team Leader Portal is active, render dedicated team operational portal
  if (currentPage === 'teamleader') {
    return <TeamLeaderPortal onNavigatePublic={navigateToHome} />;
  }

  // If Convener Portal is active, render dedicated operational management portal
  if (currentPage === 'convener') {
    return <ConvenerPortal onNavigatePublic={navigateToHome} />;
  }

  // If Admin Portal is active, render the dedicated ERP Control Centre without public navbar/footer
  if (currentPage === 'admin') {
    return <AdminPortal onNavigatePublic={navigateToHome} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans overflow-x-hidden">
      {/* Page Loader */}
      <AnimatePresence>
        {loading && <PageLoader onFinish={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Page Switching */}
      {currentPage === 'register' ? (
        <RegisterPage onNavigateHome={navigateToHome} />
      ) : currentPage === 'downloads' || currentPage === 'posters' ? (
        <PostersPage
          onNavigateHome={navigateToHome}
          onNavigateEvents={navigateToEvents}
          onNavigateGuests={navigateToGuests}
          onNavigateSchedule={navigateToSchedule}
          onNavigateResults={navigateToResults}
          onNavigateGallery={navigateToGallery}
        />
      ) : currentPage === 'gallery' ? (
        <GalleryPage
          onNavigateHome={navigateToHome}
          onNavigateEvents={navigateToEvents}
          onNavigateGuests={navigateToGuests}
          onNavigateSchedule={navigateToSchedule}
          onNavigateResults={navigateToResults}
        />
      ) : currentPage === 'results' ? (
        <ResultsPage
          onNavigateHome={navigateToHome}
          onNavigateEvents={navigateToEvents}
          onNavigateGuests={navigateToGuests}
          onNavigateSchedule={navigateToSchedule}
        />
      ) : currentPage === 'schedule' ? (
        <SchedulePage
          onNavigateHome={navigateToHome}
          onNavigateEvents={navigateToEvents}
          onNavigateGuests={navigateToGuests}
        />
      ) : currentPage === 'guests' ? (
        <GuestsPage
          onNavigateHome={navigateToHome}
          onNavigateEvents={navigateToEvents}
        />
      ) : currentPage === 'events' ? (
        <EventsPage
          onNavigateHome={navigateToHome}
        />
      ) : currentPage === 'previous' ? (
        <PreviousEditionPage
          onNavigateHome={navigateToHome}
        />
      ) : currentPage === 'countdown' ? (
        <CountdownPage
          onNavigateHome={navigateToHome}
          onNavigateRegister={navigateToRegister}
        />
      ) : (
        <>
          {/* Homepage Main Flow */}
          <main>
            {/* Section 02 & 03: Cinematic Hero & Immersive Parallax Stage */}
            <CinematicHero onOpenTeaser={() => setIsTeaserOpen(true)} />

            {/* Section 04: About Dalenzia & Nueva Era Theme Concept */}
            <AboutSection />

            {/* Section 05: Dimensional Statistics with Animated Counters */}
            <FestivalNumbers />

            {/* Section 06: Realistic Animated Hourglass Countdown */}
            <FestivalCountdownStage />

            {/* Section 08: Follow Our Journey – Instagram Showcase & QR Codes */}
            <InstagramShowcaseSection />

            {/* Section 09: Join the Dalenzia Community (WhatsApp Group Integration) */}
            <WhatsAppCommunitySection editionBadge="DALENZIA 2K26 OFFICIAL COMMUNITY" />
          </main>

          {/* Section 09: Cinematic Editorial Footer */}
          <FooterCinematic />
        </>
      )}

      {/* Watch Teaser Modal */}
      <VideoTeaserModal
        isOpen={isTeaserOpen}
        onClose={() => setIsTeaserOpen(false)}
      />
    </div>
  );
}
