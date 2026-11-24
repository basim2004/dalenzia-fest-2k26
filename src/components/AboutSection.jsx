import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Eye, Trophy, Users, Layers, Clock, ArrowRight } from 'lucide-react';
import festivalStore from '../admin/data/festivalStore';
import HeritageArticlesSection from './HeritageArticles/HeritageArticlesSection';

export default function AboutSection() {
  const [highlights, setHighlights] = useState(() => festivalStore.getFestivalHighlights());

  useEffect(() => {
    const updateHighlights = () => {
      setHighlights(festivalStore.getFestivalHighlights());
    };
    const unsubscribe = festivalStore.subscribe(updateHighlights);
    return () => unsubscribe();
  }, []);
  return (
    <section id="about" className="relative bg-[#F7F3E9] py-14 md:py-20 border-t border-[#A91F35]/15 select-none overflow-hidden">
      {/* Background Mandala Watermark */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] opacity-10 pointer-events-none">
        <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        {/* Editorial Festival Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
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

          <p className="text-sm md:text-base text-[#1c1917]/80 leading-relaxed font-normal max-w-2xl mx-auto">
            Dalenzia Fest 2K26 is the annual literary and creative festival of Dalailussunna Dars, Ayiroor. A vibrant platform that brings together learning, expression and cultural exploration.
          </p>

          <p className="text-xs md:text-sm text-[#1c1917]/70 leading-relaxed font-normal max-w-2xl mx-auto">
            Rooted in centuries-old classical Islamic educational traditions and propelled by the visionary theme <strong className="text-[#A91F35]">"Nueva Era"</strong>, the festival bridges sacred heritage with modern digital thought and student creativity.
          </p>

          {/* Date & Venue Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm font-bold text-[#1c1917] pt-2">
            <div className="flex items-center gap-2 text-[#A91F35]">
              <Calendar className="w-4 h-4" />
              <span>21, 22, 23 DECEMBER 2026</span>
            </div>
            <span className="text-stone-300">•</span>
            <div className="flex items-center gap-2 text-[#A91F35]">
              <MapPin className="w-4 h-4" />
              <span>Dalailussunna Dars, Ayiroor</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom 3-Card Grid: Theme, Vision & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Card 1: THEME Card (Deep Crimson) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-gradient-to-br from-[#A91F35] to-[#7f1325] text-white p-6 shadow-xl border border-[#E6A916]/30 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#E6A916]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E6A916]">
                  THEME
                </span>
              </div>

              <div className="h-14 py-1">
                <img
                  src="/assets/nueva_era_logo.png"
                  alt="Nueva Era"
                  className="h-full w-auto object-contain"
                />
              </div>

              <p className="text-xs md:text-sm text-white/90 font-medium leading-relaxed">
                A New Era of Ideas, Learning and Creative Expression.
              </p>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-[#E6A916] font-bold">
              <span>Nueva Era Concept</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 2: OUR VISION Card (Cream & Gold) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-white p-6 shadow-md border border-[#A91F35]/15 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#E6A916]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A91F35]">
                  OUR VISION
                </span>
              </div>

              {/* Vision Eye / Illuminating Crest */}
              <div className="w-14 h-14 rounded-2xl bg-[#F7F3E9] flex items-center justify-center text-[#E6A916] border border-[#A91F35]/10">
                <Eye className="w-8 h-8 text-[#E6A916]" />
              </div>

              <p className="text-xs md:text-sm text-[#1c1917]/80 font-medium leading-relaxed">
                To nurture a culture of knowledge, creativity and meaningful expression among students and the wider community.
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#A91F35] font-bold">
              <span>Dars Heritage & Beyond</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Card 3: FESTIVAL HIGHLIGHTS Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl bg-white p-6 shadow-md border border-[#A91F35]/15 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-[2px] bg-[#E6A916]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#A91F35]">
                  FESTIVAL HIGHLIGHTS
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
                    <Trophy className="w-4 h-4 text-[#E6A916]" />
                    Competitions
                  </span>
                  <span className="font-mono text-sm font-bold text-[#A91F35]">{highlights.competitionsDisplay}</span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
                    <Users className="w-4 h-4 text-[#E6A916]" />
                    Guests of Honour
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#A91F35] text-right">{highlights.guestsDisplay}</span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#1c1917]">
                    <Layers className="w-4 h-4 text-[#E6A916]" />
                    Sessions
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
              className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#A91F35] font-bold hover:underline transition-all cursor-pointer group"
            >
              <span>View Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

        </div>

        {/* Editorial Malabar Islamic Heritage & Dars Tradition Articles */}
        <HeritageArticlesSection />
      </div>
    </section>
  );
}
