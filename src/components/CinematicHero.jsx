import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Play, ChevronDown, Trophy, Users, Layers, Clock, Sparkles } from 'lucide-react';

// Lightweight Golden Sand Particles Canvas
function GoldenSandCanvas({ mouse }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = 75;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.7 + 0.25,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.6 + 0.25,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + (mouse?.current?.x || 0) * 0.15;

        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 169, 22, ${p.opacity})`;
        ctx.shadowColor = '#E6A916';
        ctx.shadowBlur = 4;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouse]);

  return <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />;
}

// Real-time Countdown Hook to Dec 21, 2026
function useFestivalCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 33, hours: 18, minutes: 27, seconds: 46 });

  useEffect(() => {
    const updateCountdown = () => {
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
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function CinematicHero({ onOpenTeaser }) {
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const countdown = useFestivalCountdown('2026-12-21T09:00:00+05:30');

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.current = { x: x * 2, y: -y * 2 };
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleOrientation = (e) => {
    if (e.beta !== null && e.gamma !== null) {
      const y = Math.min(Math.max(e.beta - 45, -20), 20) / 20;
      const x = Math.min(Math.max(e.gamma, -20), 20) / 20;
      mouse.current = { x, y: -y };
      setTilt({ x: x * 7, y: -y * 7 });
    }
  };

  useEffect(() => {
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[640px] lg:h-[88vh] lg:max-h-[820px] flex flex-col justify-between bg-[#F7F3E9] overflow-hidden pt-4 pb-4 select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Background Architectural Atmosphere & Falling Sand Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#E6A916]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#A91F35]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Golden Sand Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <GoldenSandCanvas mouse={mouse} />
        </div>
      </div>

      {/* Main Grid: Content (Left) & 3D Stage (Right) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* Left Column: Festival Information, Typography & Integrated Countdown */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col items-start space-y-5 text-left"
        >
          {/* Subtle Festival Eyebrow Badge (Festival Context Without Oversized Logo) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-[#A91F35] text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>Dalailussunna Dars Presents · 2K26 Edition</span>
          </div>

          {/* Main Headline: Festival Tagline in Prominent Editorial Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-serif font-black tracking-tight text-[#1c1917] leading-[1.18] max-w-xl">
            A New Era of Ideas, Learning and Creative Expression
          </h1>

          {/* Date & Venue Badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-[#1c1917]/85 pt-1">
            <div className="flex items-center gap-2 text-[#A91F35] font-bold">
              <Calendar className="w-4 h-4 text-[#E6A916]" />
              <span>21, 22, 23 DECEMBER 2026</span>
            </div>
            <span className="hidden sm:inline text-stone-300">•</span>
            <div className="flex items-center gap-2 text-[#A91F35] font-bold">
              <MapPin className="w-4 h-4 text-[#E6A916]" />
              <span>Dalailussunna Dars, Ayiroor</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#A91F35] hover:bg-[#8d182b] text-white text-xs md:text-sm font-bold tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all group"
            >
              <span>Explore Festival</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={onOpenTeaser}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white border border-[#A91F35]/25 text-[#A91F35] text-xs md:text-sm font-bold tracking-wide shadow-sm hover:shadow-md active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#A91F35] text-white flex items-center justify-center shadow-xs">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </div>
              <span>Watch Teaser</span>
            </button>
          </div>

          {/* Cohesive Festival Countdown Card (Visually Connected to Hero Content) */}
          <div className="w-full max-w-md pt-2">
            <div className="bg-gradient-to-br from-white/95 via-white/85 to-[#FAF6EE]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#A91F35]/15 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#A91F35]/10">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#A91F35] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>Festival Countdown</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-stone-500">
                  21 Dec 2026 · 09:00 AM IST
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#1c1917]">
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">DAYS</span>
                </div>
                <div className="flex flex-col border-l border-stone-200">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#1c1917]">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">HOURS</span>
                </div>
                <div className="flex flex-col border-l border-stone-200">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#1c1917]">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">MINS</span>
                </div>
                <div className="flex flex-col border-l border-stone-200">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#E6A916]">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">SECS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Main 3D NUEVA ERA Theme Visual (Hero's Main Attraction) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[500px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Main 3D Theme Studio Composition */}
          <div className="relative w-full max-w-[560px] flex flex-col items-center justify-center p-3 sm:p-5">
            
            {/* Ambient Radial Studio Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E6A916]/25 via-[#FAF6EE]/50 to-[#A91F35]/15 rounded-[40px] blur-3xl pointer-events-none" />

            {/* Premium 3D Theme Showcase Stage Card */}
            <div className="relative z-10 w-full bg-gradient-to-b from-white/95 via-[#FAF6EE]/85 to-[#F2EADC]/80 backdrop-blur-md rounded-[36px] p-6 sm:p-10 border border-[#A91F35]/15 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
              
              {/* Subtle top studio highlight line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E6A916] to-transparent opacity-60" />

              {/* Floating 3D NUEVA ERA Typography & Symbols Composition */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
                className="relative z-10 w-full flex items-center justify-center py-4"
              >
                <img
                  src="/assets/nueva_era_logo_full.png"
                  alt="NUEVA ERA - 3D Theme Visual"
                  className="w-full max-h-[260px] sm:max-h-[300px] object-contain drop-shadow-[0_20px_25px_rgba(169,31,53,0.2)] drop-shadow-[0_8px_12px_rgba(230,169,22,0.25)] transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </motion.div>

              {/* Realistic Contact Floor Shadow underneath the floating 3D composition */}
              <motion.div
                animate={{ scale: [1, 0.92, 1], opacity: [0.35, 0.22, 0.35] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
                className="w-4/5 h-6 bg-gradient-to-r from-transparent via-stone-900 to-transparent blur-md rounded-full mt-2 pointer-events-none"
              />

              {/* Elegant Theme Caption Bar */}
              <div className="mt-4 pt-3 border-t border-[#A91F35]/10 w-full flex items-center justify-between text-[11px] font-mono text-stone-600 font-bold">
                <span className="text-[#A91F35] tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E6A916] animate-pulse" />
                  Official Festival Theme
                </span>
                <span className="text-stone-500 tracking-wider">
                  The Awakening of Creative Flair
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar: 4 Metrics & Scroll Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full mt-6 pt-4 border-t border-[#A91F35]/15">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-base md:text-lg font-black text-[#A91F35] block leading-none">
                12+
              </span>
              <span className="text-[11px] font-bold text-stone-600">Competitions</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-base md:text-lg font-black text-[#A91F35] block leading-none">
                50+
              </span>
              <span className="text-[11px] font-bold text-stone-600">Guests of Honour</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-base md:text-lg font-black text-[#A91F35] block leading-none">
                20+
              </span>
              <span className="text-[11px] font-bold text-stone-600">Academic Sessions</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-base md:text-lg font-black text-[#A91F35] block leading-none">
                03
              </span>
              <span className="text-[11px] font-bold text-stone-600">Vibrant Days</span>
            </div>
          </div>
        </div>

        {/* Scroll To Explore Indicator */}
        <div className="flex justify-center items-center gap-2 mt-4 text-[11px] font-bold uppercase tracking-widest text-[#A91F35]">
          <span className="w-12 h-[1px] bg-[#A91F35]/30" />
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => {
              const aboutEl = document.getElementById('about');
              if (aboutEl) aboutEl.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Scroll to Explore</span>
            <ChevronDown className="w-4 h-4 text-[#E6A916]" />
          </motion.div>
          <span className="w-12 h-[1px] bg-[#A91F35]/30" />
        </div>
      </div>
    </section>
  );
}
