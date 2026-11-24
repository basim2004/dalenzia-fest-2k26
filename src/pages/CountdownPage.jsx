import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Home, ChevronRight, Radio, Volume2, ArrowRight } from 'lucide-react';
import AmbientGoldParticles from '../components/AmbientGoldParticles';
import FestivalRadioPlayer from '../components/FestivalRadioPlayer';

export default function CountdownPage({ onNavigateHome, onNavigateRegister }) {
  const [timeLeft, setTimeLeft] = useState({ days: 26, hours: 15, minutes: 42, seconds: 22 });
  const [triggerRadio, setTriggerRadio] = useState(0);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const radioSectionRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-12-21T09:00:00+05:30');
    const update = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTapRadio = () => {
    setTriggerRadio((prev) => prev + 1);
    if (radioSectionRef.current) {
      radioSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tickerItems = [
    'Nueva Era',
    'December 21–23, 2026',
    'Dalenzia 2K26',
    'Thaqwa Juma Masjid Ayiroor',
    'Three Days, One Era',
    'Official Festival Radio Broadcast',
    'A New Era Begins',
  ];

  return (
    <div className="min-h-screen bg-[#A91F35] text-white selection:bg-[#E6A916] selection:text-[#A91F35] font-sans overflow-x-hidden relative">
      {/* Background Subtle Watermark Mandala & Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-10 pointer-events-none">
        <img
          src="/assets/mandala.png"
          alt=""
          className="w-full h-full object-contain animate-spin-slow"
        />
      </div>

      {/* Golden Ambient Particle Atmosphere */}
      <AmbientGoldParticles count={45} />

      {/* Top Breadcrumb Navigation */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <nav className="flex items-center gap-2 text-xs font-semibold text-white/70">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 hover:text-[#E6A916] transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-white/40" />
          <span className="text-[#E6A916] font-bold">Festival Countdown</span>
        </nav>
      </div>

      {/* Main Countdown & Hero Branding Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-12 text-center space-y-8 select-none">
        
        {/* Official Logos & Festival Identity Header */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* NUEVA ERA Theme Logo & DALENZIA FEST Logo */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 bg-black/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-[#E6A916]/30 shadow-xl">
            <div className="h-10 sm:h-12 flex items-center justify-center">
              <img
                src="/assets/nueva_era_logo.png"
                alt="Nueva Era"
                className="h-full w-auto object-contain drop-shadow"
              />
            </div>
            <div className="hidden sm:block w-px h-8 bg-[#E6A916]/40" />
            <div className="h-9 sm:h-11 flex items-center justify-center">
              <img
                src="/assets/dalenzia_fest_logo.png"
                alt="Dalenzia Fest"
                className="h-full w-auto object-contain drop-shadow"
              />
            </div>
          </div>

          {/* Festival Date & Venue Information */}
          <div className="space-y-1 text-center pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-xs font-black uppercase tracking-widest shadow-md">
              <Calendar className="w-3.5 h-3.5" />
              <span>2026 DECEMBER 21, 22, 23</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide pt-2">
              Thaqwa Juma Masjid Ayiroor
            </h2>
            <p className="text-xs md:text-sm text-white/80 font-medium">
              Venue : Masjidul Liwah, Kandu Bazaar, Puthanpalli, Ayiroor.
            </p>
          </div>
        </div>

        {/* 3D Realistic Golden Hourglass & 4 Countdown Blocks (Matching Reference Image 1) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 pt-4">
          
          {/* 3D Realistic Golden Hourglass */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="w-32 md:w-44 h-auto drop-shadow-2xl shrink-0"
          >
            <img
              src="/assets/golden_hourglass.png"
              alt="Golden Hourglass"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* 4 Responsive Countdown Blocks */}
          <div className="grid grid-cols-4 gap-3 md:gap-5">
            <div className="bg-[#7A1426]/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-[#E6A916]/40 shadow-2xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-serif text-3xl md:text-5xl font-bold text-white">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Days
              </span>
            </div>

            <div className="bg-[#7A1426]/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-[#E6A916]/40 shadow-2xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-serif text-3xl md:text-5xl font-bold text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Hours
              </span>
            </div>

            <div className="bg-[#7A1426]/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-[#E6A916]/40 shadow-2xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-serif text-3xl md:text-5xl font-bold text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Minutes
              </span>
            </div>

            <div className="bg-[#7A1426]/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-[#E6A916]/40 shadow-2xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-serif text-3xl md:text-5xl font-bold text-[#E6A916]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Seconds
              </span>
            </div>
          </div>

        </div>

        {/* TAP THE RADIO Interactive Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTapRadio}
            className="inline-flex items-center gap-2.5 px-8 py-3 rounded-full bg-[#A91F35] text-white border-2 border-[#E6A916] font-bold text-xs md:text-sm uppercase tracking-widest shadow-xl hover:bg-[#8C1428] transition-all cursor-pointer group"
          >
            <Radio className="w-4 h-4 text-[#E6A916] animate-pulse" />
            <span>{isRadioPlaying ? 'Radio Is Playing' : 'TAP THE RADIO ▶'}</span>
          </motion.button>
        </div>

      </section>

      {/* Radio Player & Audio Playlist Console (Matching Reference Image 1) */}
      <section ref={radioSectionRef} className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pb-16">
        <FestivalRadioPlayer
          triggerToggle={triggerRadio}
          onPlayStateChange={setIsRadioPlaying}
        />
      </section>

      {/* Cream Wave Band (Brand Element 13 from Asset HTML) */}
      <div className="w-full h-16 md:h-20 bg-[#F7F3E9] relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='24'%3E%3Cg fill='none' stroke='%23A91F35' stroke-width='1.4'%3E%3Cpath d='M0 6C10 0 20 0 30 6S50 12 60 6'/%3E%3Cpath d='M0 11C10 5 20 5 30 11S50 17 60 11'/%3E%3Cpath d='M0 16C10 10 20 10 30 16S50 22 60 16'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom 12px left 0',
          }}
        />
      </div>

      {/* Seamless Moving Marquee Ticker (Brand Element from Asset HTML) */}
      <div className="relative z-10 w-full overflow-hidden bg-[#7A1426] py-3 border-t border-[#E6A916]">
        <div className="flex w-max animate-ticker whitespace-nowrap text-xs md:text-sm font-bold uppercase tracking-widest text-white">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
            <span key={idx} className="flex items-center">
              <span className="mx-4">{item}</span>
              <span className="text-[#E6A916]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
