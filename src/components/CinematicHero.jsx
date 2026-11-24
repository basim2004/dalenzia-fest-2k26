import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Play, ChevronDown, Trophy, Users, Layers, Clock, Sparkles } from 'lucide-react';
import festivalStore from '../admin/data/festivalStore';

// Responsive & Lightweight Golden Sand Particles Canvas
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

    // Optimized particle count based on screen width
    const isMobile = width < 768;
    const count = isMobile ? 40 : 80;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.6 + 0.2,
      driftAngle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.driftAngle += 0.015;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.driftAngle) * 0.35 + (mouse?.current?.x || 0) * 0.12;

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

export default function CinematicHero({ onOpenTeaser }) {
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [highlights, setHighlights] = useState(() => festivalStore.getFestivalHighlights());
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setHighlights(festivalStore.getFestivalHighlights());
    const unsub = festivalStore.subscribe(update);
    return () => unsub();
  }, []);

  // Mouse tilt tracking for desktop
  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.current = { x: x * 2, y: -y * 2 };
    setTilt({ x: x * 7, y: -y * 7 });
  };

  // Gyroscope orientation tracking for phone
  const handleOrientation = (e) => {
    if (shouldReduceMotion || e.beta === null || e.gamma === null) return;
    const y = Math.min(Math.max(e.beta - 45, -15), 15) / 15;
    const x = Math.min(Math.max(e.gamma, -15), 15) / 15;
    mouse.current = { x, y: -y };
    setTilt({ x: x * 5, y: -y * 5 });
  };

  useEffect(() => {
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [shouldReduceMotion]);

  // Motion variants for staged cinematic reveal
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[680px] lg:min-h-[88vh] flex flex-col justify-between bg-[#F7F3E9] overflow-hidden pt-6 pb-6 select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Background Architectural Atmosphere & Dynamic Motion Layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute top-1/4 right-1/4 w-[500px] lg:w-[750px] h-[500px] lg:h-[750px] bg-[#E6A916]/12 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
        <div className="absolute bottom-10 left-10 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#A91F35]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Concentric Golden Brand Geometry (Layered Parallax) */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] rounded-full border border-[#E6A916]/15 pointer-events-none"
          style={{
            transform: `translate(30%, -50%) rotate(${tilt.x * 3}deg)`,
            transition: 'transform 0.4s ease-out',
          }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[450px] h-[450px] lg:w-[700px] lg:h-[700px] rounded-full border border-[#A91F35]/10 border-dashed pointer-events-none animate-[spin_120s_linear_infinite]"
        />

        {/* Golden Sand Particles Canvas */}
        <div className="absolute inset-0 pointer-events-none">
          <GoldenSandCanvas mouse={mouse} />
        </div>
      </div>

      {/* Main Grid: Content (Left) & 3D Stage (Right) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        
        {/* Left Column: Festival Information & Typography */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="lg:col-span-6 flex flex-col items-start space-y-6 text-left"
        >
          {/* Subtle Festival Eyebrow Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/25 text-[#A91F35] text-xs font-black tracking-widest uppercase shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E6A916] animate-spin-slow" />
            <span>Dalailussunna Dars Presents · 2K26 Edition</span>
          </motion.div>

          {/* Main Headline: Festival Tagline in Prominent Editorial Typography */}
          <motion.div variants={fadeInUp} className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-serif font-black tracking-tight text-[#1c1917] leading-[1.15] max-w-xl">
              A New Era of Ideas, Learning and Creative Expression
            </h1>
            <p className="text-sm sm:text-base font-semibold text-[#A91F35] tracking-wide pt-1">
              Three Days, One Era
            </p>
          </motion.div>

          {/* Date & Venue Badges */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-[#1c1917]/85 pt-0.5">
            <div className="flex items-center gap-2 text-[#A91F35] font-bold">
              <Calendar className="w-4 h-4 text-[#E6A916]" />
              <span>December 21–23, 2026</span>
            </div>
            <span className="hidden sm:inline text-stone-300">•</span>
            <div className="flex items-center gap-2 text-[#A91F35] font-bold">
              <MapPin className="w-4 h-4 text-[#E6A916]" />
              <span>Dalailussunna Dars, Ayiroor</span>
            </div>
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#A91F35] hover:bg-[#8d182b] text-white text-xs md:text-sm font-bold tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all group"
            >
              <span>Explore Festival</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>

            <button
              onClick={onOpenTeaser}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/95 hover:bg-white border border-[#A91F35]/25 text-[#A91F35] text-xs md:text-sm font-bold tracking-wide shadow-sm hover:shadow-md active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#A91F35] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </div>
              <span>Watch Teaser</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column: Main 3D NUEVA ERA Theme Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[500px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: shouldReduceMotion ? 'none' : `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.18s ease-out',
          }}
        >
          {/* Main 3D Theme Studio Composition */}
          <div className="relative w-full max-w-[560px] flex flex-col items-center justify-center p-3 sm:p-5">
            
            {/* Ambient Radial Studio Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E6A916]/25 via-[#FAF6EE]/50 to-[#A91F35]/15 rounded-[40px] blur-3xl pointer-events-none" />

            {/* Premium 3D Theme Showcase Stage Card */}
            <div className="relative z-10 w-full bg-gradient-to-b from-white/95 via-[#FAF6EE]/90 to-[#F2EADC]/85 backdrop-blur-md rounded-[36px] p-6 sm:p-10 border border-[#A91F35]/15 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
              
              {/* Subtle top studio highlight line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E6A916] to-transparent opacity-70" />

              {/* Floating 3D NUEVA ERA Typography & Symbols Composition */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
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
                animate={shouldReduceMotion ? {} : { scale: [1, 0.92, 1], opacity: [0.35, 0.22, 0.35] }}
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full mt-6 pt-4 border-t border-[#A91F35]/15"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10 group-hover:scale-105 group-hover:border-[#E6A916]/50 transition-all">
              <Trophy className="w-5 h-5 text-[#A91F35]" />
            </div>
            <div>
              <span className="font-mono text-base md:text-lg font-black text-[#A91F35] block leading-none">
                {highlights.competitionsDisplay}
              </span>
              <span className="text-[11px] font-bold text-stone-600">Competitions</span>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10 group-hover:scale-105 group-hover:border-[#E6A916]/50 transition-all">
              <Users className="w-5 h-5 text-[#A91F35]" />
            </div>
            <div>
              <span className="font-mono text-xs md:text-sm font-black text-[#A91F35] block leading-tight">
                {highlights.isGuestsConfirmed ? highlights.guestsDisplay : 'TBA'}
              </span>
              <span className="text-[11px] font-bold text-stone-600">Guests of Honour</span>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10 group-hover:scale-105 group-hover:border-[#E6A916]/50 transition-all">
              <Layers className="w-5 h-5 text-[#A91F35]" />
            </div>
            <div>
              <span className="font-mono text-xs md:text-sm font-black text-[#A91F35] block leading-tight">
                {highlights.isSessionsConfigured ? highlights.sessionsDisplay : 'Coming Soon'}
              </span>
              <span className="text-[11px] font-bold text-stone-600">Academic Sessions</span>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#A91F35] border border-[#A91F35]/10 group-hover:scale-105 group-hover:border-[#E6A916]/50 transition-all">
              <Clock className="w-5 h-5 text-[#A91F35]" />
            </div>
            <div>
              <span className="font-mono text-base md:text-lg font-black text-[#A91F35] block leading-none">
                {highlights.vibrantDaysDisplay}
              </span>
              <span className="text-[11px] font-bold text-stone-600">Vibrant Days</span>
            </div>
          </div>
        </div>

        {/* Scroll To Explore Indicator with Motion Bounce */}
        <div className="flex justify-center items-center gap-2 mt-4 text-[11px] font-bold uppercase tracking-widest text-[#A91F35]">
          <span className="w-12 h-[1px] bg-[#A91F35]/30" />
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex items-center gap-1.5 cursor-pointer hover:text-[#8d182b] transition-colors"
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
      </motion.div>
    </section>
  );
}
