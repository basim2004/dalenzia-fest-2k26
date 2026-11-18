import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import CinematicHero from './components/CinematicHero';
import AboutSection from './components/AboutSection';
import FestivalNumbers from './components/FestivalNumbers';
import FestivalDiscovery from './components/FestivalDiscovery';
import FestivalCountdownStage from './components/FestivalCountdownStage';
import FooterCinematic from './components/FooterCinematic';
import VideoTeaserModal from './components/VideoTeaserModal';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [isTeaserOpen, setIsTeaserOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans overflow-x-hidden">
      {/* Page Loader */}
      <AnimatePresence>
        {loading && <PageLoader onFinish={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Navigation */}
      <Navbar lang={lang} setLang={setLang} />

      {/* Homepage Main Flow */}
      <main>
        {/* Section 02 & 03: Cinematic Hero & Immersive Parallax Stage */}
        <CinematicHero onOpenTeaser={() => setIsTeaserOpen(true)} />

        {/* Section 04: About Dalenzia & Nueva Era Theme Concept */}
        <AboutSection />

        {/* Section 05: Dimensional Statistics with Animated Counters */}
        <FestivalNumbers />

        {/* Section 06: Festival Discovery (4 Navigation Gateways) */}
        <FestivalDiscovery />

        {/* Section 07: Realistic Animated Hourglass Countdown */}
        <FestivalCountdownStage />
      </main>

      {/* Section 08: Cinematic Editorial Footer */}
      <FooterCinematic />

      {/* Watch Teaser Modal */}
      <VideoTeaserModal
        isOpen={isTeaserOpen}
        onClose={() => setIsTeaserOpen(false)}
      />
    </div>
  );
}
