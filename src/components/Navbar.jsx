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
            ? 'bg-[#F7F3E9]/95 backdrop-blur-md shadow-md py-2.5 border-b border-[#A91F35]/15'
            : 'bg-[#F7F3E9] py-3 border-b border-[#A91F35]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Left: Festival Identity Only (DALENZIA FEST) - strictly constrained */}
          <button
            onClick={handleLogoClick}
            className="flex items-center group focus:outline-none cursor-pointer text-left shrink-0"
            title="Dalenzia Fest 2K26"
            style={{ maxWidth: '145px', maxHeight: '36px' }}
          >
            {/* Official Dalenzia Fest Logo - strictly bounded dimensions */}
            <div className="flex items-center justify-start overflow-hidden" style={{ maxHeight: '32px', maxWidth: '140px' }}>
              <img
                src="/assets/dalenzia_fest_logo.png"
                alt="Dalenzia Fest 2K26"
                className="w-auto object-contain transition-transform group-hover:scale-105"
                style={{
                  maxHeight: '28px',
                  maxWidth: '135px',
                  width: 'auto',
                  height: '28px',
                  objectFit: 'contain',
                  display: 'block'
                }}
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
          <div className="flex items-center gap-2 sm:gap-3">
            <PWAInstallButton variant="navbar" />

            <button
              type="button"
              onClick={handleRegisterClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-extrabold tracking-wide shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Mobile Menu Button - aligned and compact */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-8 h-8 rounded-full bg-[#A91F35]/10 flex items-center justify-center text-[#A91F35] hover:bg-[#A91F35]/20 transition-colors focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed inset-0 z-50 bg-[#A91F35] text-[#F7F3E9] flex flex-col justify-between p-4 sm:p-6 overflow-y-auto lg:hidden"
          >
            <div className="relative z-10 space-y-3">
              {/* Clean Header Bar with Direct Close Button - No Duplicate Logo */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                <span className="text-xs font-serif font-black tracking-widest text-[#E6A916] uppercase">
                  DALENZIA MENU
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((item, idx) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.025 }}
                      onClick={() => handleLinkClick(item)}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors text-left text-sm font-semibold group cursor-pointer ${
                        isActive
                          ? 'bg-white/20 text-[#E6A916]'
                          : 'hover:bg-white/10 text-white/95'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#E6A916] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            <div className="relative z-10 border-t border-white/15 pt-3.5 space-y-2 mt-3">
              <PWAInstallButton variant="drawer" />

              <button
                type="button"
                onClick={handleRegisterClick}
                className="w-full py-2.5 px-4 bg-[#E6A916] text-[#A91F35] font-black text-xs uppercase tracking-wider rounded-xl text-center shadow-md block hover:bg-[#ffd166] transition-colors cursor-pointer"
              >
                Register Now ↗
              </button>

              {/* Authorized Login Options */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href="#convener"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#E6A916] text-white hover:text-[#A91F35] text-[10px] font-black tracking-wider uppercase border border-white/20 transition-all text-center flex-1"
                >
                  CONVENER
                </a>
                <a
                  href="#developer"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-[#E6A916]/20 hover:bg-[#E6A916] text-[#E6A916] hover:text-[#A91F35] text-[10px] font-black tracking-wider uppercase border border-[#E6A916]/40 transition-all text-center flex-1"
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
