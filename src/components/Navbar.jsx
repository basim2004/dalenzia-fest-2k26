import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import PWAInstallButton from './pwa/PWAInstallButton';

export default function Navbar({ lang, setLang, currentPage = 'home', setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Events', href: '#events', id: 'events' },
    { name: 'Guests', href: '#guests', id: 'guests' },
    { name: 'Schedule', href: '#schedule', id: 'schedule' },
    { name: 'Results', href: '#results', id: 'results' },
    { name: '2K25 Edition', href: '#previous', id: 'previous' },
    { name: 'Downloads', href: '#downloads', id: 'downloads' },
    { name: 'Help & Resources', href: '#help', id: 'help' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Countdown', href: '#countdown', id: 'countdown' },
  ];

  const handleRegisterClick = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    if (setCurrentPage) {
      setCurrentPage('register');
    }
    window.location.hash = '#register';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (link) => {
    setIsOpen(false);

    if (link.id === 'downloads' || link.id === 'posters') {
      if (setCurrentPage) {
        setCurrentPage('downloads');
        window.location.hash = '#downloads';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'gallery') {
      if (setCurrentPage) {
        setCurrentPage('gallery');
        window.location.hash = '#gallery';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'results') {
      if (setCurrentPage) {
        setCurrentPage('results');
        window.location.hash = '#results';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'schedule') {
      if (setCurrentPage) {
        setCurrentPage('schedule');
        window.location.hash = '#schedule';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'guests') {
      if (setCurrentPage) {
        setCurrentPage('guests');
        window.location.hash = '#guests';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'events') {
      if (setCurrentPage) {
        setCurrentPage('events');
        window.location.hash = '#events';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'previous') {
      if (setCurrentPage) {
        setCurrentPage('previous');
        window.location.hash = '#previous';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'countdown') {
      if (setCurrentPage) {
        setCurrentPage('countdown');
        window.location.hash = '#countdown';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'help') {
      if (setCurrentPage) {
        setCurrentPage('help');
        window.location.hash = '#help';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (link.id === 'home') {
      if (setCurrentPage) {
        setCurrentPage('home');
        window.location.hash = '#home';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // For other sections (events, guests, schedule, results, countdown)
    if (currentPage !== 'home' && setCurrentPage) {
      setCurrentPage('home');
      window.location.hash = link.href;
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }

    const element = document.querySelector(link.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (setCurrentPage) {
      setCurrentPage('home');
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F3E9]/95 backdrop-blur-md shadow-md py-3 border-b border-[#A91F35]/15'
            : 'bg-[#F7F3E9] py-4 border-b border-[#A91F35]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Left: Festival Identity Only (DALENZIA FEST) */}
          <button
            onClick={handleLogoClick}
            className="flex items-center group focus:outline-none cursor-pointer text-left"
            title="Dalenzia Fest 2K26"
          >
            {/* Official Dalenzia Fest Logo */}
            <div className="h-8 sm:h-9 md:h-10 flex items-center">
              <img
                src="/assets/dalenzia_fest_logo.png"
                alt="Dalenzia Fest 2K26"
                className="h-full w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#A91F35]/15 shadow-sm">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.name}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link);
                  }}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#A91F35] text-white shadow-sm'
                      : 'text-[#1c1917]/80 hover:text-[#A91F35] hover:bg-[#A91F35]/10'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Action: PWA Install & Register Now CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <PWAInstallButton variant="navbar" />

            <button
              type="button"
              onClick={handleRegisterClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-extrabold tracking-wide shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-[#A91F35]/10 flex items-center justify-center text-[#A91F35] hover:bg-[#A91F35]/20 transition-colors focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Full-Screen Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-0 z-40 bg-[#A91F35] text-[#F7F3E9] flex flex-col justify-between p-6 pt-24 overflow-y-auto lg:hidden"
          >
            {/* Background watermark */}
            <div className="absolute -bottom-16 -right-16 opacity-10 pointer-events-none w-96 h-96">
              <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="border-b border-white/20 pb-4">
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md mb-3">
                  <div className="h-9">
                    <img src="/assets/dalenzia_fest_logo.png" alt="Dalenzia Fest" className="h-full w-auto object-contain" />
                  </div>
                </div>
                <h3 className="text-lg font-serif text-white font-bold">
                  Dalenzia Fest 2K26
                </h3>
                <p className="text-xs text-[#E6A916] font-semibold mt-0.5">
                  Second Edition · 21, 22, 23 DECEMBER 2026
                </p>
                <p className="text-[11px] text-white/70">
                  Dalailussunna Dars, Ayiroor, Malappuram
                </p>
              </div>

              <nav className="flex flex-col space-y-2">
                {navLinks.map((item, idx) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => handleLinkClick(item)}
                      className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors text-left text-base font-semibold group ${
                        isActive
                          ? 'bg-white/20 text-[#E6A916]'
                          : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#E6A916] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            <div className="relative z-10 border-t border-white/20 pt-6 space-y-3">
              <PWAInstallButton variant="drawer" />

              <button
                type="button"
                onClick={handleRegisterClick}
                className="w-full py-3 px-4 bg-[#E6A916] text-[#A91F35] font-extrabold text-sm rounded-xl text-center shadow-lg block hover:bg-[#ffd166] transition-colors cursor-pointer"
              >
                Register Now ↗
              </button>

              {/* Authorized Login Options */}
              <div className="pt-2 flex items-center justify-center gap-2">
                <a
                  href="#convener"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#E6A916] text-white hover:text-[#A91F35] text-xs font-black tracking-wider uppercase border border-white/20 transition-all text-center flex-1"
                >
                  CONVENER
                </a>
                <a
                  href="#developer"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#E6A916]/20 hover:bg-[#E6A916] text-[#E6A916] hover:text-[#A91F35] text-xs font-black tracking-wider uppercase border border-[#E6A916]/40 transition-all text-center flex-1"
                >
                  DEVELOPER
                </a>
              </div>

              <div className="flex items-center justify-between text-xs text-white/70 pt-1">
                <a
                  href="#help"
                  onClick={() => {
                    setIsOpen(false);
                    if (setCurrentPage) {
                      setCurrentPage('help');
                      window.location.hash = '#help';
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-[#E6A916] transition-colors flex items-center gap-1 font-semibold text-white/90"
                >
                  <span>Help & Resources ↗</span>
                </a>
                <span>Ayiroor, Kerala</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
