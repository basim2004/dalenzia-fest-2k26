import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Eye, Trophy, Users, Layers, Clock, ArrowRight, Hourglass } from 'lucide-react';
import festivalStore from '../admin/data/festivalStore';
import HeritageArticlesSection from './HeritageArticles/HeritageArticlesSection';

export default function AboutSection() {
  const [highlights, setHighlights] = useState(() => festivalStore.getFestivalHighlights());
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateHighlights = () => {
      setHighlights(festivalStore.getFestivalHighlights());
    };
    const unsubscribe = festivalStore.subscribe(updateHighlights);
    return () => unsubscribe();
  }, []);

  return (
    <section id="about" className="relative bg-[#F7F3E9] py-16 md:py-24 border-t border-[#A91F35]/15 select-none overflow-hidden">
      {/* Background Mandala Watermark with gentle rotation */}
      <div className="absolute -top-36 -left-36 w-[520px] h-[520px] opacity-10 pointer-events-none">
        <img
          src="/assets/mandala.png"
          alt=""
          className={`w-full h-full object-contain ${shouldReduceMotion ? '' : 'animate-spin-slow'}`}
        />
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#E6A916]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        {/* Editorial Festival Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#A91F35]" />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
              ABOUT DALENZIA
            </span>
            <span className="w-8 h-[2px] bg-[#A91F35]" />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight leading-tight">
            About the <span className="text-[#A91F35]">Festival</span>
          </h2>

          <p className="text-sm md:text-base font-bold text-[#A91F35] tracking-wide">
            Three Days, One Era
          </p>

          <p className="text-sm md:text-base text-[#1c1917]/85 leading-relaxed font-normal max-w-2xl mx-auto">
            Dalenzia Fest 2K26 is the annual literary and creative festival of Dalailussunna Dars, Ayiroor. A vibrant platform that brings together learning, expression and cultural exploration.
          </p>

          <p className="text-xs md:text-sm text-[#1c1917]/75 leading-relaxed font-normal max-w-2xl mx-auto">
            Rooted in centuries-old classical Islamic educational traditions and propelled by the visionary theme <strong className="text-[#A91F35]">"Nueva Era"</strong>, the festival bridges sacred heritage with modern digital thought and student creativity.
          </p>
        </motion.div>

        {/* Bottom 3-Card Grid: Theme (NUEVA ERA with Hourglass Motion), Vision & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
          
          {/* Card 1: THEME Card (Deep Crimson with Animated Hourglass & Logo Reveal) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
            className="relative rounded-3xl bg-gradient-to-br from-[#A91F35] via-[#8f182c] to-[#6e1020] text-white p-7 shadow-xl border border-[#E6A916]/35 flex flex-col justify-between space-y-5 overflow-hidden group"
          >
            {/* Ambient Background Aura */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#E6A916]/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-black/30 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar with Animated Hourglass Icon */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#E6A916]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6A916]">
                  OFFICIAL THEME
                </span>
              </div>

              {/* Animated Hourglass Motif (Theme Nueva Era) */}
              <motion.div
                animate={shouldReduceMotion ? {} : { rotate: [0, 180, 180, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", times: [0, 0.4, 0.6, 1] }}
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-[#E6A916]/40 flex items-center justify-center text-[#E6A916]"
              >
                <Hourglass className="w-4 h-4 text-[#E6A916]" />
              </motion.div>
            </div>

            {/* Official NUEVA ERA Logo Showcase with Hover Glow */}
            <div className="relative z-10 py-3 flex items-center justify-center">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-[240px] flex items-center justify-center"
              >
                <img
                  src="/assets/nueva_era_logo.png"
                  alt="Nueva Era Theme Logo"
                  className="h-16 md:h-18 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                />
              </motion.div>
            </div>

            {/* Theme Description */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-lg md:text-xl font-serif font-black text-white tracking-tight">
                NUEVA ERA · A New Era
              </h3>
              <p className="text-xs md:text-sm text-white/90 font-medium leading-relaxed">
                The Awakening of Creative Flair. Bridging sacred Islamic heritage with modern creative expression.
              </p>
            </div>

            <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-[#E6A916] font-bold">
              <span>Three Days, One Era</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.div>

          {/* Card 2: OUR VISION Card (Cream & Gold with Illuminating Crest) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
            className="relative rounded-3xl bg-white p-7 shadow-md border border-[#A91F35]/15 flex flex-col justify-between space-y-5 group hover:shadow-xl hover:border-[#A91F35]/35 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#E6A916]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A91F35]">
                  OUR VISION
                </span>
              </div>

              {/* Vision Eye / Illuminating Crest */}
              <div className="w-14 h-14 rounded-2xl bg-[#F7F3E9] flex items-center justify-center text-[#E6A916] border border-[#A91F35]/10 group-hover:scale-110 group-hover:bg-[#A91F35]/5 transition-all">
                <Eye className="w-7 h-7 text-[#E6A916]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-serif font-black text-[#1c1917] tracking-tight">
                  Knowledge & Integrity
                </h3>
                <p className="text-xs md:text-sm text-[#1c1917]/80 font-medium leading-relaxed">
                  To nurture a culture of knowledge, creativity and meaningful expression among students and the wider community across Malabar.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#A91F35] font-bold">
              <span>Dars Heritage & Beyond</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.div>

          {/* Card 3: FESTIVAL HIGHLIGHTS Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
            className="relative rounded-3xl bg-white p-7 shadow-md border border-[#A91F35]/15 flex flex-col justify-between space-y-5 group hover:shadow-xl hover:border-[#A91F35]/35 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[2px] bg-[#E6A916]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A91F35]">
                  FESTIVAL HIGHLIGHTS
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
                    <Trophy className="w-4 h-4 text-[#E6A916]" />
                    Competitions
                  </span>
                  <span className="font-mono text-sm font-bold text-[#A91F35]">{highlights.competitionsDisplay}</span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
                    <Users className="w-4 h-4 text-[#E6A916]" />
                    Guests of Honour
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#A91F35] text-right">{highlights.guestsDisplay}</span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
                    <Layers className="w-4 h-4 text-[#E6A916]" />
                    Academic Sessions
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#A91F35] text-right">{highlights.sessionsDisplay}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
                    <Clock className="w-4 h-4 text-[#E6A916]" />
                    Vibrant Days
                  </span>
                  <span className="font-mono text-sm font-bold text-[#A91F35]">{highlights.vibrantDaysDisplay}</span>
                </div>
              </div>
            </div>

            <a
              href="#schedule"
              className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#A91F35] font-bold hover:underline transition-all cursor-pointer group"
            >
              <span>View Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </a>
          </motion.div>

        </div>

        {/* Editorial Malabar Islamic Heritage & Dars Tradition Articles */}
        <HeritageArticlesSection />
      </div>
    </section>
  );
}
