import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AmbientGoldParticles from './AmbientGoldParticles';
import { Search, Trophy, Calendar, MapPin, ChevronDown, Sparkles as SparklesIcon } from 'lucide-react';

// Countdown hook to Dec 21, 2026
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function Hero3D({ lang }) {
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHourglassFlipped, setIsHourglassFlipped] = useState(false);

  const countdown = useCountdown('2026-12-21T09:00:00+05:30');

  // Parallax Tilt Handlers
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.current = { x: x * 2, y: -y * 2 };
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleDeviceOrientation = (e) => {
    if (e.beta !== null && e.gamma !== null) {
      const y = Math.min(Math.max(e.beta - 45, -20), 20) / 20;
      const x = Math.min(Math.max(e.gamma, -20), 20) / 20;
      mouse.current = { x: x, y: -y };
      setTilt({ x: x * 10, y: -y * 10 });
    }
  };

  useEffect(() => {
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, []);

  // Periodic hourglass flip trigger
  useEffect(() => {
    const flipTimer = setInterval(() => {
      setIsHourglassFlipped((prev) => !prev);
    }, 6000);
    return () => clearInterval(flipTimer);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col justify-between items-center bg-[#F7F3E9] overflow-hidden px-4 pt-4 pb-8 min-h-[640px]"
      style={{ perspective: '1200px' }}
    >
      {/* Ambient Particle Background */}
      <AmbientGoldParticles count={65} />

      {/* Layer 1 (Back Depth: z = -40px): Slowly Rotating Cultural Mandala */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[500px] h-[340px] md:h-[500px] pointer-events-none opacity-20 z-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
        style={{
          transform: `translate(-50%, -50%) translateZ(-40px) rotateX(${tilt.y * 0.3}deg) rotateY(${tilt.x * 0.3}deg)`
        }}
      >
        <img
          src="/assets/mandala.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Top Meta Header: Edition pill & rotating circular motto ring */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-2 mt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#A91F35] text-white rounded-full text-[11px] font-semibold tracking-wider shadow-sm uppercase"
        >
          <SparklesIcon className="w-3 h-3 text-[#E6A916]" />
          <span>Second Edition · 2K26</span>
          <span className="w-1 h-1 rounded-full bg-[#E6A916]" />
          <span className="text-[#E6A916]">Nueva Era</span>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#A91F35] tracking-tight leading-tight">
          Dalenzia Fest
        </h1>

        <p className="text-xs md:text-sm font-medium text-[#1c1917]/75 max-w-xs">
          {lang === 'en'
            ? 'Where tradition and technology walk forward together.'
            : 'പാരമ്പര്യവും സാങ്കേതികവിദ്യയും കൈകോർക്കുന്ന പുതിയ യുഗം.'}
        </p>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-[#A91F35] pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#E6A916]" />
            21, 22, 23 DECEMBER 2026
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E6A916]" />
            Ayiroor, Malappuram
          </span>
        </div>
      </div>

      {/* Centerpiece: The Layered 3D Stage (Arch + Banner + Hourglass + Lamp + Plane + Vine) */}
      <div
        className="relative z-10 w-full max-w-[360px] h-[340px] my-3 flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Layer 2: Arch Portal (Back-Left, translateZ: -20px) */}
        <motion.div
          className="absolute -left-2 bottom-0 w-[170px] h-[255px] pointer-events-none drop-shadow-xl"
          style={{ transform: 'translateZ(-20px)' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <img
            src="/assets/arch_portal.png"
            alt="Arch Portal"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Laser Scanner Line translating over the Arch & Central Emblem */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#E6A916] to-transparent shadow-[0_0_12px_#E6A916] animate-laser-scan opacity-70" />
        </div>

        {/* Layer 3: Central Festival Banner (Center, translateZ: 0px) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[130px] h-[290px] drop-shadow-2xl z-10"
          style={{ transform: 'translateX(-50%) translateZ(0px)' }}
        >
          {/* Banner container with golden frame */}
          <div className="relative w-full h-full rounded-md overflow-hidden bg-[#A91F35] border-2 border-[#E6A916] shadow-xl flex flex-col justify-between p-2 text-center text-white">
            {/* Halftone texture */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#E6A916_1px,transparent_1px)] [background-size:6px_6px]" />

            <div className="relative z-10 pt-2">
              <span className="text-[10px] tracking-widest font-extrabold uppercase text-[#E6A916] block">
                FEST
              </span>
              <div className="py-2">
                <span
                  className="font-serif text-3xl font-extrabold tracking-wider text-[#E6A916] block select-none"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', margin: '0 auto', transform: 'rotate(180deg)' }}
                >
                  Dalenzia
                </span>
              </div>
            </div>

            <div className="relative z-10 border-t border-[#E6A916]/40 pt-1.5 pb-1 space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider block text-white/90 font-mono">
                21, 22, 23 DECEMBER 2026
              </span>
              <p className="text-[8px] font-bold text-[#E6A916] leading-tight">
                Dalailussunna Dars
              </p>
              <p className="text-[7px] text-white/70">Ayiroor, Malappuram</p>
            </div>
          </div>
        </div>

        {/* Layer 4: Botanical Vine (Right Edge, translateZ: +15px) */}
        <motion.div
          className="absolute right-4 top-4 w-[75px] h-[175px] pointer-events-none z-15"
          style={{ transform: 'translateZ(15px)' }}
          animate={{ rotate: [-1, 2, -1] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <img
            src="/assets/botanical_vine.png"
            alt="Vine"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </motion.div>

        {/* Layer 5: Traditional Lamp with Books (Front-Left, translateZ: +30px) */}
        <motion.div
          className="absolute left-1 bottom-1 w-[110px] h-[160px] pointer-events-none z-20"
          style={{ transform: 'translateZ(30px)' }}
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }}
        >
          <img
            src="/assets/lamp_books.png"
            alt="Lamp with Books"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          {/* Flickering flame glow */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#E6A916]/30 blur-md animate-pulse" />
        </motion.div>

        {/* Layer 6: 3D Golden Hourglass (Front-Right, translateZ: +40px) */}
        <motion.div
          className="absolute right-0 bottom-3 w-[100px] h-[175px] cursor-pointer z-30"
          style={{ transform: 'translateZ(40px)' }}
          animate={{
            rotate: isHourglassFlipped ? 180 : 0,
            scale: [1, 1.03, 1],
          }}
          transition={{
            rotate: { duration: 1.2, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
          onClick={() => setIsHourglassFlipped(!isHourglassFlipped)}
          title="Tap to flip the hourglass!"
        >
          <img
            src="/assets/golden_hourglass.png"
            alt="Golden Hourglass"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          {/* Subtle click me hint */}
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] bg-black/60 text-[#E6A916] px-1.5 py-0.5 rounded-full font-mono whitespace-nowrap opacity-75">
            TAP ME
          </span>
        </motion.div>

        {/* Layer 7: Flying Paper Plane along dynamic flight loop (translateZ: +55px) */}
        <motion.div
          className="absolute z-40 w-[95px] h-[75px] pointer-events-none"
          animate={{
            x: [-60, 40, -10, -60],
            y: [-30, -90, -40, -30],
            rotate: [15, 35, 10, 15],
            scale: [0.9, 1.1, 1, 0.9],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          style={{ transform: 'translateZ(55px)' }}
        >
          <img
            src="/assets/paper_plane.png"
            alt="Paper Plane"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Floating Pixel Squares */}
        <motion.div
          className="absolute top-2 left-6 w-9 h-9 pointer-events-none z-25 opacity-80"
          animate={{ y: [0, -8, 0], rotate: [0, 90, 180] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <img src="/assets/pixel_squares.png" alt="" className="w-full h-full object-contain" />
        </motion.div>
      </div>

      {/* Live Countdown Timer Grid */}
      <div className="relative z-10 w-full max-w-sm mt-1">
        <div className="grid grid-cols-4 gap-2 bg-white/70 backdrop-blur-md p-2.5 rounded-2xl border border-[#A91F35]/15 shadow-sm text-center">
          <div className="flex flex-col">
            <span className="font-mono text-xl md:text-2xl font-extrabold text-[#A91F35]">
              {String(countdown.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#1c1917]/60 font-semibold">
              {lang === 'en' ? 'Days' : 'ദിവസം'}
            </span>
          </div>
          <div className="flex flex-col border-l border-[#A91F35]/10">
            <span className="font-mono text-xl md:text-2xl font-extrabold text-[#A91F35]">
              {String(countdown.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#1c1917]/60 font-semibold">
              {lang === 'en' ? 'Hours' : 'മണിക്കൂർ'}
            </span>
          </div>
          <div className="flex flex-col border-l border-[#A91F35]/10">
            <span className="font-mono text-xl md:text-2xl font-extrabold text-[#A91F35]">
              {String(countdown.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#1c1917]/60 font-semibold">
              {lang === 'en' ? 'Mins' : 'മിനിറ്റ്'}
            </span>
          </div>
          <div className="flex flex-col border-l border-[#A91F35]/10">
            <span className="font-mono text-xl md:text-2xl font-extrabold text-[#E6A916]">
              {String(countdown.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#1c1917]/60 font-semibold">
              {lang === 'en' ? 'Secs' : 'സെക്കന്റ്'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Quick Action CTAs */}
      <div className="relative z-10 w-full max-w-sm flex items-center gap-2.5 mt-4">
        <a
          href="#results"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#A91F35] text-white rounded-xl font-bold text-xs shadow-md hover:bg-[#8d182b] active:scale-95 transition-all text-center"
        >
          <Search className="w-4 h-4 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Find Results' : 'ഫലം അറിയാം'}</span>
        </a>
        <a
          href="#leaderboard"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#A91F35] border-2 border-[#A91F35] rounded-xl font-bold text-xs shadow-sm hover:bg-[#A91F35]/5 active:scale-95 transition-all text-center"
        >
          <Trophy className="w-4 h-4 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Leaderboard' : 'പോയിന്റ് നില'}</span>
        </a>
      </div>

      {/* Decorative Wavy-line divider along foot */}
      <div className="w-full max-w-sm mt-4 opacity-70">
        <img src="/assets/wave_lines.png" alt="" className="w-full h-auto object-contain" />
      </div>
    </section>
  );
}
