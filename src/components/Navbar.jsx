import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Flame, Sparkles } from 'lucide-react';

export default function Navbar({ lang, setLang }) {
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
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Guests', href: '#guests' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Results', href: '#results' },
    { name: 'Countdown', href: '#countdown' },
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
            ? 'bg-[#F7F3E9]/95 backdrop-blur-md shadow-md py-3 border-b border-[#A91F35]/15'
            : 'bg-[#F7F3E9] py-4 border-b border-[#A91F35]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Left: Dual Brand Lockup (DALENZIA + NUEVA ERA) */}
          <a
            href="#hero"
            className="flex items-center gap-3 group focus:outline-none"
          >
            {/* Dalenzia Mark */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#A91F35] flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src="/assets/golden_hourglass.png"
                  alt="D"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-extrabold tracking-tight text-[#1c1917] font-serif leading-none">
                  Dalenzia
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#A91F35] uppercase">
                  Fest 2K26
                </span>
              </div>
            </div>

            {/* Elegant Divider */}
            <span className="h-6 w-[1.5px] bg-[#A91F35]/25 hidden sm:block" />

            {/* Official Nueva Era Theme Logo */}
            <div className="h-7 hidden sm:flex items-center">
              <img
                src="/assets/nueva_era_logo.png"
                alt="Nueva Era"
                className="h-full w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#A91F35]/15 shadow-sm">
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all ${
                  idx === 0
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'text-[#1c1917]/80 hover:text-[#A91F35] hover:bg-[#A91F35]/10'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Register Now CTA */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918589951951?text=Hello%20Dalenzia%20Fest%202K26,%20I%20would%20like%20to%20register."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-extrabold tracking-wide shadow-md transition-all active:scale-95 group"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

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
                <div className="h-9 mb-3">
                  <img src="/assets/nueva_era_logo.png" alt="Nueva Era" className="h-full w-auto object-contain brightness-0 invert" />
                </div>
                <h3 className="text-xl font-serif text-white font-bold">
                  Dalenzia Fest 2K26
                </h3>
                <p className="text-xs text-[#E6A916] font-semibold mt-0.5">
                  Second Edition · December 21–22, 2026
                </p>
                <p className="text-[11px] text-white/70">
                  Dalailussunna Dars, Ayiroor, Malappuram
                </p>
              </div>

              <nav className="flex flex-col space-y-2">
                {navLinks.map((item, idx) => (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => handleLinkClick(item.href)}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/10 transition-colors text-left text-base font-semibold group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#E6A916] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </motion.button>
                ))}
              </nav>
            </div>

            <div className="relative z-10 border-t border-white/20 pt-6 space-y-3">
              <a
                href="https://wa.me/918589951951?text=Hello%20Dalenzia%20Fest%202K26,%20I%20would%20like%20to%20register."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 px-4 bg-[#E6A916] text-[#A91F35] font-extrabold text-sm rounded-xl text-center shadow-lg block hover:bg-[#ffd166] transition-colors"
              >
                Register Now ↗
              </a>
              <div className="flex items-center justify-between text-xs text-white/70 pt-1">
                <span>Helpdesk: +91 8589951951</span>
                <span>Ayiroor, Kerala</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
