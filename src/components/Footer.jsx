import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, Globe, Heart } from 'lucide-react';

export default function Footer({ lang }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#A91F35] text-white pt-10 pb-8 overflow-hidden select-none">
      {/* Decorative Wavy-line border on top */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none opacity-40">
        <img src="/assets/wave_lines.png" alt="" className="w-full h-auto object-cover" />
      </div>

      <div className="max-w-md mx-auto px-6 relative z-10 space-y-6 text-center">
        {/* Emblem & Branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3.5 sm:gap-5 md:gap-6 bg-black/20 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-white/10 shadow-xs max-w-fit mx-auto">
            <div className="h-8 sm:h-9 md:h-10 lg:h-11 flex items-center justify-center shrink-0">
              <img
                src="/assets/dalenzia_fest_logo.png"
                alt="Dalenzia Fest"
                className="h-full w-auto object-contain"
              />
            </div>
            <span className="h-9 sm:h-11 md:h-14 w-[1px] bg-white/25 shrink-0" />
            <div className="h-13 sm:h-16 md:h-20 lg:h-[84px] flex items-center justify-center shrink-0">
              <img
                src="/assets/brand/official_nueva_era_reverse_white.png"
                alt="Nueva Era"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-[#E6A916] font-extrabold mt-0.5">
            SECOND EDITION · NUEVA ERA
          </span>
          <p className="text-xs text-white/80 max-w-xs">
            Where tradition and technology walk forward together.
          </p>
        </div>

        {/* Institution Info Card (Corrected verified data) */}
        <div className="bg-white/10 rounded-2xl p-4 border border-white/15 text-xs text-white/90 space-y-2 text-left">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#E6A916] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white">
                DALAILUSSUNNA DARS
              </span>
              <span>Perumpadappu, Ayiroor, Malappuram 679580, Kerala, India</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1 border-t border-white/10">
            <Phone className="w-4 h-4 text-[#E6A916] flex-shrink-0" />
            <a href="tel:+918589951951" className="font-mono hover:text-[#E6A916] transition-colors">
              +91 8589951951
            </a>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-[#E6A916] font-semibold">
            <span>Festival Dates:</span>
            <span className="text-white font-bold">21, 22, 23 DECEMBER 2026</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-white/80 font-medium">
          <a href="#hero" className="hover:text-[#E6A916] transition-colors">Home</a>
          <span>•</span>
          <a href="#results" className="hover:text-[#E6A916] transition-colors">Results</a>
          <span>•</span>
          <a href="#leaderboard" className="hover:text-[#E6A916] transition-colors">Leaderboard</a>
          <span>•</span>
          <a href="#venues" className="hover:text-[#E6A916] transition-colors">Venues</a>
          <span>•</span>
          <a href="#schedule" className="hover:text-[#E6A916] transition-colors">Schedule</a>
          <span>•</span>
          <a href="#theme" className="hover:text-[#E6A916] transition-colors">Theme Note</a>
        </div>

        {/* Back to top button */}
        <div className="pt-2">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E6A916] text-[#A91F35] text-xs font-bold shadow-md hover:bg-[#ffd166] active:scale-95 transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to Top</span>
          </button>
        </div>

        {/* Copyright & Credit */}
        <div className="pt-4 border-t border-white/15 text-[10px] text-white/60 space-y-1">
          <p>© 2026 Dalailussunna Dars, Ayiroor. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Crafted for Dalenzia 2K26 with <Heart className="w-3 h-3 text-[#E6A916] fill-current" /> by Tech Committee
          </p>
        </div>
      </div>
    </footer>
  );
}
