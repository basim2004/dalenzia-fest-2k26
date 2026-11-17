import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Radio, Clock, Users } from 'lucide-react';
import venuesData from '../data/venues.json';

export default function StageMonitor({ lang }) {
  return (
    <section id="venues" className="max-w-md mx-auto px-4 py-8">
      {/* Eyebrow & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider mb-1">
          <MapPin className="w-3 h-3 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Live Stage Status' : 'വേദി തത്സമയം'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#A91F35]">
          {lang === 'en' ? 'Venues & Stages' : 'വേദികൾ'}
        </h2>
        <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
          {lang === 'en'
            ? 'Track ongoing performances and next lineup across 4 stages'
            : 'ഓരോ വേദിയിലും ഇപ്പോൾ നടക്കുന്നതും അടുത്തതുമായ ഇനങ്ങൾ'}
        </p>
      </div>

      <div className="space-y-3">
        {venuesData.venues.map((venue, idx) => (
          <motion.div
            key={venue.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-2xl p-4 border border-[#A91F35]/10 shadow-sm space-y-3 hover:border-[#A91F35]/30 transition-all"
          >
            {/* Header: Stage Number, Name & Live Beacon */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#A91F35] text-white font-mono text-[11px] font-bold flex items-center justify-center">
                  {venue.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1c1917]">
                    {lang === 'en' ? venue.name : venue.malayalam}
                  </h3>
                  <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {venue.capacity}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{venue.status}</span>
              </div>
            </div>

            {/* Current & Next Items */}
            <div className="space-y-2 text-xs">
              <div className="bg-[#F7F3E9] p-2.5 rounded-xl border border-[#A91F35]/10">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#A91F35] mb-0.5">
                  <Radio className="w-3 h-3 text-[#A91F35] animate-pulse" />
                  <span>{lang === 'en' ? 'HAPPENING NOW' : 'ഇപ്പോൾ നടക്കുന്നത്'}</span>
                </div>
                <p className="font-bold text-[#1c1917]">
                  {lang === 'en' ? venue.currentEvent : venue.currentMalayalam}
                </p>
              </div>

              <div className="flex items-center justify-between px-1 text-[11px] text-stone-600">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-[#E6A916]" />
                  <span>{lang === 'en' ? 'Up Next:' : 'അടുത്തത്:'}</span>
                </span>
                <span className="font-bold text-[#A91F35]">{venue.upNext}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
