import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import MarqueeTicker from './components/MarqueeTicker';
import StatsGrid from './components/StatsGrid';
import RegistrationBanner from './components/RegistrationBanner';
import ThemeSection from './components/ThemeSection';
import ResultFinder from './components/ResultFinder';
import Leaderboard from './components/Leaderboard';
import StageMonitor from './components/StageMonitor';
import ScheduleTimeline from './components/ScheduleTimeline';
import GuestsSection from './components/GuestsSection';
import ReadingSection from './components/ReadingSection';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en'); // 'en' or 'ml'

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans">
      {/* Initial Page Loading Sequence */}
      <AnimatePresence>
        {loading && <PageLoader onFinish={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Sticky Navigation */}
      <Navbar lang={lang} setLang={setLang} />

      {/* Main Content Sections */}
      <main className="overflow-x-hidden">
        {/* Layered 3D Hero */}
        <Hero3D lang={lang} />

        {/* Live Announcement Marquee Strip */}
        <MarqueeTicker lang={lang} />

        {/* Animated Numerical Counters */}
        <StatsGrid lang={lang} />

        {/* Registration Live Banner */}
        <RegistrationBanner lang={lang} />

        {/* Theme Note (Nueva Era) & 4 Pillars */}
        <ThemeSection lang={lang} />

        {/* Find the Result Engine & Winner Poster Generator */}
        <ResultFinder lang={lang} />

        {/* Live Sector Standings & Leaderboard */}
        <Leaderboard lang={lang} />

        {/* Stages & Venues Live Monitor */}
        <StageMonitor lang={lang} />

        {/* Program Schedule Timeline */}
        <ScheduleTimeline lang={lang} />

        {/* Guests of Honor & Dignitaries */}
        <GuestsSection lang={lang} />

        {/* Souvenir & Literature Reading */}
        <ReadingSection lang={lang} />
      </main>

      {/* Official Footer with Dars Credentials */}
      <Footer lang={lang} />
    </div>
  );
}
