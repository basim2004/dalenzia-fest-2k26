import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function FestivalCountdownStage() {
  const [timeLeft, setTimeLeft] = useState({ days: 33, hours: 18, minutes: 27, seconds: 46 });

  useEffect(() => {
    const targetDate = new Date('2026-12-21T09:00:00+05:30');
    const update = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="countdown" className="relative bg-[#A91F35] text-white py-16 md:py-24 select-none overflow-hidden border-t border-[#E6A916]/30">
      {/* Background Decorative Mandala & Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 pointer-events-none">
        <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center space-y-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-xs font-black uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FESTIVAL COUNTDOWN</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
            The Festival Begins In
          </h2>

          <p className="text-sm font-bold text-[#E6A916] tracking-wide">
            Three Days, One Era
          </p>

          <p className="text-xs md:text-sm text-white/80 font-medium">
            Join the grand congregation at Dalailussunna Dars, Ayiroor on December 21–23, 2026.
          </p>
        </motion.div>

        {/* Hourglass & Real-time Numbers Composition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 pt-4"
        >
          
          {/* 3D Realistic Golden Hourglass */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="w-32 md:w-44 h-auto drop-shadow-2xl"
          >
            <img
              src="/assets/golden_hourglass.png"
              alt="Golden Hourglass"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* 4 Responsive Countdown Blocks */}
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-mono text-3xl md:text-5xl font-black text-white">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Days
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-mono text-3xl md:text-5xl font-black text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Hours
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-mono text-3xl md:text-5xl font-black text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Minutes
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-xl flex flex-col items-center min-w-[70px] md:min-w-[105px]">
              <span className="font-mono text-3xl md:text-5xl font-black text-[#E6A916]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#E6A916] font-bold mt-1">
                Seconds
              </span>
            </div>
          </div>

        </motion.div>

        {/* Closing Action */}
        <div className="pt-4">
          <a
            href="#register"
            onClick={() => {
              window.location.hash = '#register';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E6A916] text-[#A91F35] font-extrabold text-xs md:text-sm shadow-xl hover:bg-[#ffd166] active:scale-95 transition-all cursor-pointer"
          >
            <span>Register for Dalenzia Fest 2K26</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
