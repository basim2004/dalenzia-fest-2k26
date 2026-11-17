import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Sparkles } from 'lucide-react';
import guestsData from '../data/guests.json';

export default function GuestsSection({ lang }) {
  return (
    <section id="guests" className="max-w-md mx-auto px-4 py-8">
      {/* Eyebrow & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider mb-1">
          <Users className="w-3 h-3 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Dignitaries & Scholars' : 'വിശിഷ്ടാതിഥികൾ'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#A91F35]">
          {lang === 'en' ? 'Guests of Honor' : 'ക്ഷണിക്കപ്പെട്ട അതിഥികൾ'}
        </h2>
        <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
          {lang === 'en'
            ? 'Eminent scholars, cultural mentors, and patrons gracing Dalenzia 2K26'
            : 'മേളയെ ധന്യമാക്കാൻ എത്തുന്ന പ്രമുഖ വ്യക്തിത്വങ്ങൾ'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {guestsData.guests.map((guest, idx) => (
          <motion.div
            key={guest.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-2xl p-3 border border-[#A91F35]/10 shadow-sm flex flex-col items-center text-center group hover:border-[#A91F35]/30 transition-all"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-[#E6A916] p-0.5 group-hover:scale-105 transition-transform">
              <img
                src={guest.avatar}
                alt={guest.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider text-[#E6A916] bg-[#A91F35] px-2 py-0.5 rounded-full mb-1">
              {guest.tag}
            </span>

            <h3 className="text-xs font-bold text-[#1c1917] leading-tight">
              {lang === 'en' ? guest.name : guest.malayalam}
            </h3>

            <p className="text-[10px] text-stone-500 font-medium mt-0.5">
              {guest.title}
            </p>

            <span className="text-[9px] text-[#A91F35] font-semibold mt-1">
              {guest.role}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
