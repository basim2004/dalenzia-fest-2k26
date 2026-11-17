import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Award, Flame, Calendar, MapPin, BookOpen, Users, Radio, Globe } from 'lucide-react';

export default function Navbar({ lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: lang === 'en' ? 'Home' : 'ഹോം', href: '#hero', icon: Flame },
    { name: lang === 'en' ? 'Results' : 'ഫലങ്ങൾ', href: '#results', icon: Award },
    { name: lang === 'en' ? 'Leaderboard' : 'പോയിന്റ് നില', href: '#leaderboard', icon: Flame },
    { name: lang === 'en' ? 'Venues & Stages' : 'വേദികൾ', href: '#venues', icon: MapPin },
    { name: lang === 'en' ? 'Schedule' : 'ടൈംടേബിൾ', href: '#schedule', icon: Calendar },
    { name: lang === 'en' ? 'Theme: Nueva Era' : 'തീം നോട്ട്', href: '#theme', icon: BookOpen },
    { name: lang === 'en' ? 'Dignitaries' : 'അതിഥികൾ', href: '#guests', icon: Users },
  ];

  const handleLinkClick = (href) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F3E9]/95 backdrop-blur-md shadow-md py-2.5 border-b border-[#A91F35]/15'
            : 'bg-[#F7F3E9] py-3.5 border-b border-[#A91F35]/10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Logo & Brand title */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-[#A91F35] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="/assets/golden_hourglass.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold tracking-tight text-[#A91F35] leading-none font-serif">
                DALENZIA <span className="text-[#E6A916] text-xs font-sans font-bold">2K26</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-[#A91F35]/70 uppercase">
                Dalailussunna Dars
              </span>
            </div>
          </a>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Live Results Beacon */}
            <a
              href="#results"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A91F35] text-white text-[11px] font-medium shadow-sm hover:bg-[#8e192c] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#E6A916] animate-ping" />
              <span className="font-semibold">{lang === 'en' ? 'RESULTS' : 'റിസൾട്ട്'}</span>
            </a>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="px-2.5 py-1 text-xs font-semibold rounded-full border border-[#A91F35]/25 text-[#A91F35] hover:bg-[#A91F35]/10 transition-colors"
              title="Toggle English / Malayalam"
            >
              {lang === 'en' ? 'മലയാളം' : 'EN'}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#A91F35]/10 text-[#A91F35] hover:bg-[#A91F35]/20 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Drawer Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-0 z-40 bg-[#A91F35] text-[#F7F3E9] flex flex-col justify-between p-6 pt-24 overflow-y-auto"
          >
            {/* Background watermark */}
            <div className="absolute -bottom-20 -right-20 opacity-10 pointer-events-none w-96 h-96">
              <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="border-b border-white/20 pb-4">
                <span className="text-xs uppercase tracking-widest text-[#E6A916] font-semibold">
                  Festival Navigation
                </span>
                <h3 className="text-2xl font-serif text-white mt-1">
                  Dalenzia Fest 2026
                </h3>
                <p className="text-xs text-white/70">
                  Theme: Nueva Era · Dalailussunna Dars, Ayiroor
                </p>
              </div>

              <nav className="flex flex-col space-y-3">
                {navLinks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleLinkClick(item.href)}
                      className="flex items-center gap-3.5 py-2.5 px-3 rounded-xl hover:bg-white/10 transition-colors text-left text-lg font-medium group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#E6A916] group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Menu Footer */}
            <div className="relative z-10 border-t border-white/20 pt-6 mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-white/80">
                <span>Dec 21–22, 2026</span>
                <span className="text-[#E6A916]">Ayiroor, Malappuram</span>
              </div>
              <div className="flex gap-2">
                <a
                  href="#poster-gen"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2.5 px-3 bg-[#E6A916] text-[#A91F35] font-bold text-xs rounded-xl shadow-md hover:bg-[#ffd166] transition-colors"
                >
                  Create Winner Poster
                </a>
                <a
                  href="tel:+918589951951"
                  className="py-2.5 px-4 bg-white/15 text-white font-medium text-xs rounded-xl hover:bg-white/25 transition-colors"
                >
                  Helpdesk
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
