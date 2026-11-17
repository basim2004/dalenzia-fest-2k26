import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Trophy, Layers, MapPin } from 'lucide-react';
import statsData from '../data/stats.json';

function CounterItem({ item, lang, icon: Icon }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = item.value;
    const duration = 2000;
    const incrementTime = 30;
    const step = Math.ceil(end / (duration / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, item.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-white rounded-2xl p-4 border border-[#A91F35]/10 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-shadow"
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A91F35] to-[#E6A916]" />

      <div className="w-10 h-10 rounded-xl bg-[#F7F3E9] flex items-center justify-center text-[#A91F35] mb-2 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-[#A91F35]" />
      </div>

      <div className="flex items-baseline gap-0.5">
        <span className="font-mono text-2xl md:text-3xl font-extrabold text-[#A91F35]">
          {count.toLocaleString()}
        </span>
        <span className="font-mono text-lg font-bold text-[#E6A916]">
          {item.suffix}
        </span>
      </div>

      <span className="text-xs font-semibold text-[#1c1917]/80 mt-0.5">
        {lang === 'en' ? item.label : item.malayalam}
      </span>
    </motion.div>
  );
}

export default function StatsGrid({ lang }) {
  const icons = [Layers, Users, Trophy, MapPin];

  return (
    <section className="max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-5">
        <span className="text-[11px] font-bold tracking-widest uppercase text-[#A91F35]">
          {lang === 'en' ? 'By The Numbers' : 'കണക്കുകളിലൂടെ'}
        </span>
        <h2 className="text-xl font-serif font-bold text-[#A91F35] mt-0.5">
          {lang === 'en' ? 'Festival Dimensions' : 'മേളയുടെ വ്യാപ്തി'}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statsData.counters.map((item, idx) => (
          <CounterItem
            key={item.id}
            item={item}
            lang={lang}
            icon={icons[idx % icons.length]}
          />
        ))}
      </div>
    </section>
  );
}
