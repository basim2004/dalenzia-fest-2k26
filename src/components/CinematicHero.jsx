import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Calendar, MapPin, ArrowRight, Play, ChevronDown, Trophy, Users, Layers, Clock } from 'lucide-react';

// Three.js Falling Gold Particles inside the Stage
function GoldenSandStream({ mouse }) {
  const pointsRef = useRef();
  const count = 160;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      spd[i] = 0.015 + Math.random() * 0.025;
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let y = positionsAttr.getY(i);
      y -= speeds[i] * 1.6;
      if (y < -3) {
        y = 3;
        positionsAttr.setX(i, (Math.random() - 0.5) * 5);
      }
      positionsAttr.setY(i, y);
    }
    positionsAttr.needsUpdate = true;

    // Subtle parallax camera response
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 0.4, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.current.y * 0.4, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#E6A916"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
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

        {/* Three.js Golden Sand Particles */}
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <GoldenSandStream mouse={mouse} />
          <Sparkles count={35} scale={6} size={2.2} speed={0.4} color="#E6A916" opacity={0.6} />
        </Canvas>
      </div>

      {/* Main Grid: Content (Left) & 3D Stage (Right) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* Left Column: Festival Identity, Typography & Countdown */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col items-start space-y-5 text-left"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#A91F35]" />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
              DALENZIA FEST 2K26
            </span>
          </div>

          {/* Master NUEVA ERA Artwork */}
          <div className="w-full max-w-[340px] md:max-w-[420px] py-1">
            <img
              src="/assets/nueva_era_logo.png"
              alt="NUEVA ERA - Official Fest Identity"
              className="w-full h-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Subheading / Tagline */}
          <h2 className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider sm:tracking-widest uppercase text-[#1c1917]/85 leading-snug sm:leading-relaxed max-w-sm md:max-w-md">
            A NEW ERA OF IDEAS, LEARNING AND CREATIVE EXPRESSION
          </h2>

          {/* Date & Venue Badges */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm font-semibold text-[#1c1917]/80 pt-1">
            <span className="flex items-center gap-2 text-[#A91F35]">
              <Calendar className="w-4 h-4 text-[#A91F35]" />
              December 21 – 22, 2026
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="flex items-center gap-2 text-[#A91F35]">
              <MapPin className="w-4 h-4 text-[#A91F35]" />
              Dalailussunna Dars, Ayiroor
            </span>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#A91F35] text-white text-xs md:text-sm font-bold tracking-wide shadow-lg hover:bg-[#8d182b] active:scale-95 transition-all group"
            >
              <span>Explore Festival</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={onOpenTeaser}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#A91F35]/25 text-[#A91F35] hover:bg-white text-xs md:text-sm font-bold tracking-wide shadow-sm active:scale-95 transition-all group"
            >
              <div className="w-5 h-5 rounded-full bg-[#A91F35] text-white flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
              </div>
              <span>Watch Teaser</span>
            </button>
          </div>

          {/* Floating Festival Countdown Card */}
          <div className="w-full max-w-sm mt-3 pt-2">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-[#A91F35]/15 shadow-sm space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#A91F35] block text-center">
                FESTIVAL STARTS IN
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col">
                  <span className="font-mono text-xl md:text-2xl font-black text-[#1c1917]">
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">DAYS</span>
                </div>
                <div className="flex flex-col border-l border-stone-200">
                  <span className="font-mono text-xl md:text-2xl font-black text-[#1c1917]">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">HOURS</span>
                </div>
                <div className="flex flex-col border-l border-stone-200">
                  <span className="font-mono text-xl md:text-2xl font-black text-[#1c1917]">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">MINUTES</span>
                </div>
                <div className="flex flex-col border-l border-stone-200">
                  <span className="font-mono text-xl md:text-2xl font-black text-[#E6A916]">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">SECONDS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: The 3D Architectural Portal, Dais, Hourglass & Crimson Silk */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] md:min-h-[500px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* The High-Resolution 3D Hero Artwork extracted directly from website models */}
          <div className="relative w-full max-w-[500px] h-auto flex items-center justify-center">
            {/* Ambient Backing Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E6A916]/20 to-[#A91F35]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Central 3D Stage Composition */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative z-10 w-full"
            >
              <img
                src="/assets/hero_3d_stage.png"
                alt="Dalenzia Fest 3D Stage"
                className="w-full h-auto object-contain rounded-3xl drop-shadow-2xl"
              />
            </motion.div>

            {/* Floating Pixel Cubes Accent */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 90, 180] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute -top-4 right-6 w-12 h-12 pointer-events-none z-20"
            >
              <img src="/assets/pixel_squares.png" alt="" className="w-full h-full object-contain" />
            </motion.div>
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
                02
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
