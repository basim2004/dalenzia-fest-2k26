import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Trophy, Flag, Calendar } from 'lucide-react';

function StatCard({ icon: Icon, targetValue, suffix, label, delay }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const duration = 2200;
    const stepTime = 30;
    const step = Math.ceil(targetValue / (duration / stepTime));

    const interval = setInterval(() => {
      current += step;
      if (current >= targetValue) {
        setVal(targetValue);
        clearInterval(interval);
      } else {
        setVal(current);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [isInView, targetValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative bg-white rounded-3xl p-6 md:p-8 border border-[#A91F35]/15 shadow-md flex flex-col items-center text-center group hover:shadow-xl hover:border-[#A91F35]/35 transition-all"
    >
      {/* Decorative Gold Top Strip */}
      <div className="absolute top-0 left-6 right-6 h-1.5 bg-gradient-to-r from-[#A91F35] to-[#E6A916] rounded-full" />

      <div className="w-14 h-14 rounded-2xl bg-[#F7F3E9] flex items-center justify-center text-[#A91F35] mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-[#A91F35]" />
      </div>

      <div className="flex items-baseline justify-center gap-0.5">
        <span className="font-mono text-3xl md:text-5xl font-black text-[#A91F35]">
          {val.toLocaleString()}
        </span>
        <span className="font-mono text-2xl md:text-3xl font-extrabold text-[#E6A916]">
          {suffix}
        </span>
      </div>

      <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#1c1917]/75 mt-2">
        {label}
      </span>
    </motion.div>
  );
}

export default function FestivalNumbers() {
  const stats = [
    { id: 'participants', icon: Users, targetValue: 5000, suffix: '+', label: 'Total Participants', delay: 0.1 },
    { id: 'competitions', icon: Trophy, targetValue: 40, suffix: '+', label: 'Total Competitions', delay: 0.2 },
    { id: 'teams', icon: Flag, targetValue: 20, suffix: '+', label: 'Total Teams', delay: 0.3 },
    { id: 'days', icon: Calendar, targetValue: 2, suffix: '', label: 'Festival Days', delay: 0.4 },
  ];

  return (
    <section className="relative bg-[#F7F3E9] py-16 md:py-24 border-t border-[#A91F35]/15 select-none overflow-hidden">
      {/* Wave Line Divider Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A91F35] block">
            FESTIVAL DIMENSIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1c1917]">
            Scale of Dalenzia 2K26
          </h2>
          <p className="text-xs md:text-sm text-[#1c1917]/70">
            A grand convergence of talent, intellect and culture across two historic days in Ayiroor.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <StatCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
