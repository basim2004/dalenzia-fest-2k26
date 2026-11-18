import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, Award, ArrowUpRight } from 'lucide-react';

export default function FestivalDiscovery() {
  const destinations = [
    {
      id: 'events',
      title: 'Events & Competitions',
      tagline: 'LITERARY & CULTURAL ARENAS',
      desc: 'A vibrant line-up of literary, creative and intellectual events that bring out the best in talent, thought and expression.',
      img: '/assets/models/Dalenzia Fest Events & Competitions.png',
      cta: 'Explore Events ↗',
      accent: '#A91F35',
      href: '#events',
    },
    {
      id: 'guests',
      title: 'Guests of Honour',
      tagline: 'EMINENT VOICES',
      desc: 'Distinguished Islamic scholars, academic thinkers, authors and community leaders gracing the Dalenzia 2K26 stages.',
      img: '/assets/models/Guests of Honour Festival Showcase.png',
      cta: 'Meet the Guests ↗',
      accent: '#E6A916',
      href: '#guests',
    },
    {
      id: 'schedule',
      title: 'Programme Schedule',
      tagline: 'DECEMBER 21 – 22, 2026',
      desc: 'Explore the full two-day timeline detailing session hours, venue distributions, and ceremonial grand stages across Ayiroor.',
      img: '/assets/models/Dalenzia Fest 2K26 Programme Schedule.png',
      cta: 'View Schedule ↗',
      accent: '#A91F35',
      href: '#schedule',
    },
    {
      id: 'results',
      title: 'Results & Live Leaderboard',
      tagline: 'REAL-TIME STANDINGS',
      desc: 'Track verified results across 40+ categories, live sector score tallies, podium champions and instant certificate poster generation.',
      img: '/assets/models/Dalenzia Fest Results Leaderboard.png',
      cta: 'View Leaderboard ↗',
      accent: '#E6A916',
      href: '#results',
    },
  ];

  return (
    <section id="discovery" className="relative bg-[#F7F3E9] py-16 md:py-24 border-t border-[#A91F35]/15 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-[#A91F35]" />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
              FESTIVAL DISCOVERY
            </span>
            <span className="w-8 h-[2px] bg-[#A91F35]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
            Explore Dalenzia 2K26
          </h2>
          <p className="text-xs md:text-sm text-[#1c1917]/70 font-medium">
            Four specialized portals connecting students, parents, judges and visitors to every dimension of the festival.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#A91F35]/15 shadow-md flex flex-col justify-between group hover:shadow-2xl hover:border-[#A91F35]/35 transition-all"
            >
              {/* Card Visual Artwork Preview */}
              <div className="relative w-full h-56 md:h-64 overflow-hidden bg-stone-100">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 bg-[#A91F35] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  {card.tagline}
                </div>
              </div>

              {/* Card Body & CTA */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4 text-left">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1c1917] group-hover:text-[#A91F35] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#1c1917]/70 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-extrabold text-[#A91F35] group-hover:translate-x-1 transition-transform">
                    <span>{card.cta}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
