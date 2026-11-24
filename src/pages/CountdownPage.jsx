import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, X, Disc3 } from 'lucide-react';
import { ASSETS } from './countdownAssets';
import { RADIO_PLAYLIST } from '../components/FestivalRadioPlayer';

export default function CountdownPage({ onNavigateHome }) {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 26, hours: 15, minutes: 16, seconds: 39 });

  // Audio & Animation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [hitPulse, setHitPulse] = useState(false);
  const [sparkPulse, setSparkPulse] = useState(false);
  const [eqHeights, setEqHeights] = useState(() => Array(14).fill(4));

  const audioRef = useRef(null);
  const cardRef = useRef(null);
  const stackRef = useRef(null);
  const popRef = useRef(0);
  const hasPtrRef = useRef(false);
  const mouseCoords = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });

  const currentTrack = RADIO_PLAYLIST[currentIndex];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Real-time Countdown updating every second to Dec 21, 2026
  useEffect(() => {
    const targetDate = new Date('2026-12-21T09:00:00+05:30');
    const update = () => {
      const diff = Math.max(0, +targetDate - +new Date());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3D Extruded Logo Perspective & Pointer / Gyroscope Tracking
  useEffect(() => {
    const card = cardRef.current;
    const stack = stackRef.current;
    if (!card || !stack) return;

    const onPointerMove = (e) => {
      const r = card.getBoundingClientRect();
      hasPtrRef.current = true;
      mouseCoords.current.ty = ((e.clientX - r.left) / r.width - 0.5) * 46;
      mouseCoords.current.tx = -((e.clientY - r.top) / r.height - 0.35) * 26;
    };

    const onPointerLeave = () => {
      hasPtrRef.current = false;
    };

    const onDeviceOrientation = (e) => {
      if (e.gamma == null) return;
      hasPtrRef.current = true;
      mouseCoords.current.ty = Math.max(-24, Math.min(24, e.gamma)) * 0.9;
      mouseCoords.current.tx = Math.max(-14, Math.min(14, (e.beta - 50) * -0.4));
    };

    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('deviceorientation', onDeviceOrientation);

    let animationFrameId;
    const loop = (t) => {
      const time = t / 1000;
      if (!hasPtrRef.current) {
        mouseCoords.current.ty = Math.sin(time * 0.9) * 22;
        mouseCoords.current.tx = -6 + Math.cos(time * 0.7) * 5;
      }
      mouseCoords.current.cx += (mouseCoords.current.tx - mouseCoords.current.cx) * 0.08;
      mouseCoords.current.cy += (mouseCoords.current.ty - mouseCoords.current.cy) * 0.08;
      popRef.current *= 0.88;

      stack.style.transform = `rotateX(${mouseCoords.current.cx}deg) rotateY(${mouseCoords.current.cy}deg) scale(${1 + popRef.current * 0.05}) translateZ(${popRef.current * 2}cqw)`;
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio track switching
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          if (audioRef.current.src !== currentTrack.fallbackSrc) {
            audioRef.current.src = currentTrack.fallbackSrc;
            audioRef.current.play().catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        });
      }
    }
  }, [currentIndex]);

  // Rhythm beat loop for EQ bars, speaker pumps & spark animation
  useEffect(() => {
    const bpm = 96;
    const intervalMs = (60000 / bpm) / 4;
    let step = 0;

    const timer = setInterval(() => {
      const s = step % 16;
      if (s % 4 === 0) {
        setHitPulse(true);
        popRef.current = 1;
        setTimeout(() => setHitPulse(false), 280);
      }
      if (s % 8 === 4) {
        setSparkPulse(true);
        setTimeout(() => setSparkPulse(false), 300);
      }

      // Animate 14 EQ bars
      const level = isPlaying ? 1 : 0.25;
      setEqHeights(Array.from({ length: 14 }, () => 2 + Math.random() * 8 * level));

      step++;
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        if (audioRef.current.src !== currentTrack.fallbackSrc) {
          audioRef.current.src = currentTrack.fallbackSrc;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          setIsPlaying(false);
        }
      });
    }
  };

  const selectTrack = (index) => {
    if (index === currentIndex) {
      toggleAudio();
      return;
    }
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % RADIO_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + RADIO_PLAYLIST.length) % RADIO_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const tickerItems = [
    'Nueva Era',
    'December 21–23, 2026',
    'Dalenzia 2K26',
    'Thaqwa Juma Masjid Ayiroor',
    'Three Days, One Era',
    'A new era begins',
  ];

  return (
    <div className="relative min-h-[100svh] bg-[#A91F35] text-white font-sans overflow-x-hidden select-none flex flex-col justify-between items-center">
      {/* Hidden Canonical Audio Engine */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleNext}
        preload="metadata"
      />

      {/* Embedded Original CSS Keyframes and Layout */}
      <style>{`
        :root {
          --crimson: #A91F35;
          --deep: #A91F35;
          --gold: #E6A916;
          --cream: #F7F3E9;
          --white: #FFFFFF;
        }

        #dz-radio-root {
          position: relative;
          min-height: 100svh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          overflow: hidden;
          padding-top: 4vh;
          background: var(--crimson);
        }

        #dz-radio-root::before {
          content: '';
          position: absolute;
          inset: 12px 12px 52px 12px;
          border: 1px solid var(--gold);
          opacity: .65;
          pointer-events: none;
          z-index: 1;
        }

        /* Circular Geometry: thin gold outlines */
        .dz-rings {
          position: absolute;
          left: 50%;
          top: 42%;
          width: 0;
          height: 0;
          z-index: 0;
        }
        .dz-rings i {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          border: 1px solid var(--gold);
          transform: translate(-50%, -50%);
        }
        .dz-rings i:nth-child(1) { width: 560px; height: 560px; opacity: .38; }
        .dz-rings i:nth-child(2) {
          width: 760px;
          height: 760px;
          opacity: .26;
          border-style: dashed;
          animation: dzspin 90s linear infinite;
        }
        .dz-rings i:nth-child(3) { width: 980px; height: 980px; opacity: .16; }
        @keyframes dzspin { to { transform: translate(-50%, -50%) rotate(360deg); } }

        /* Card */
        .dz-card {
          position: relative;
          z-index: 2;
          width: min(90vw, 440px);
          aspect-ratio: 400/600;
          container-type: inline-size;
          opacity: 1;
          transform: none;
          transition: opacity .9s ease, transform .9s cubic-bezier(.2,.8,.2,1);
        }
        .dz-arch {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 24px 40px rgba(0,0,0,.25));
        }
        .dz-body {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 21cqw;
        }
        .dz-logo {
          display: block;
          width: 36cqw;
          opacity: 1;
          transform: none;
          transition: opacity .8s ease .25s, transform .8s cubic-bezier(.2,.8,.2,1) .25s;
        }

        /* 3D Festival Title Panel */
        .dz-panel {
          position: relative;
          width: 78cqw;
          margin-top: 7cqw;
          opacity: 1;
          transition: opacity .9s ease .5s;
        }
        .dz-3d {
          position: relative;
          width: 100%;
          perspective: 800px;
        }
        .dz-stack {
          position: relative;
          width: 100%;
          aspect-ratio: 692/146;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .dz-stack img, .dz-stack b {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
        }
        .dz-stack b {
          -webkit-mask: var(--logo) center/100% 100% no-repeat;
          mask: var(--logo) center/100% 100% no-repeat;
        }
        .dz-info {
          width: 90cqw;
          margin: 3cqw 0 0 -6cqw;
          padding-top: 2cqw;
          border-top: .3cqw solid var(--gold);
          text-align: center;
          color: var(--crimson);
        }
        .dz-info p { margin: 0; line-height: 1.2; }
        .dz-info .l1 { font-weight: 700; font-size: 3.7cqw; letter-spacing: .12em; text-transform: uppercase; }
        .dz-info .l2 { font-weight: 600; font-size: 3cqw; letter-spacing: .1em; margin-top: .6cqw; }
        .dz-info .l3 { font-weight: 500; font-size: 2.5cqw; margin-top: .5cqw; white-space: nowrap; }

        /* Countdown Blocks */
        .dz-count { display: flex; gap: 2cqw; margin-top: 3.6cqw; }
        .dz-count div {
          background: var(--crimson);
          border-radius: 1.6cqw;
          width: 14.4cqw;
          padding: 1.5cqw 0 1.2cqw;
          text-align: center;
        }
        .dz-count b {
          display: block;
          font-family: 'DM Serif Display', serif;
          font-weight: 400;
          font-size: 6.6cqw;
          line-height: 1.1;
          color: var(--white);
        }
        .dz-count span {
          font-size: 2.1cqw;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
        }

        /* Pixel squares */
        .dz-pixels {
          position: absolute;
          right: 12px;
          top: 12px;
          width: min(24vw, 104px);
          aspect-ratio: 1;
          z-index: 3;
          pointer-events: none;
        }
        .dz-pixels i {
          position: absolute;
          display: block;
          background: var(--gold);
          animation: dzpx 2.6s ease-in-out infinite;
        }
        .dz-pixels i:nth-child(1) { width: 27%; height: 27%; right: 0; top: 0; }
        .dz-pixels i:nth-child(2) { width: 31%; height: 31%; right: 33%; top: 0; background: var(--cream); animation-delay: .4s; }
        .dz-pixels i:nth-child(3) { width: 21%; height: 21%; right: 0; top: 35%; animation-delay: .9s; }
        .dz-pixels i:nth-child(4) { width: 35%; height: 35%; right: 25%; top: 36%; background: var(--cream); animation-delay: 1.3s; }
        .dz-pixels i:nth-child(5) { width: 18%; height: 18%; right: 67%; top: 20%; animation-delay: 1.8s; }
        @keyframes dzpx { 0%, 100% { transform: scale(1); } 50% { transform: scale(.8); } }

        /* Radio Boombox */
        .dz-radio {
          position: absolute;
          left: 50%;
          bottom: -5cqw;
          width: 80cqw;
          transform: translateX(-50%);
          cursor: pointer;
          z-index: 4;
          user-select: none;
          -webkit-user-select: none;
        }
        .dz-radio svg { width: 100%; display: block; overflow: visible; transform-origin: 50% 100%; }
        .dz-radio.hit svg { animation: dzbounce .32s cubic-bezier(.3,1.6,.5,1); }
        @keyframes dzbounce {
          0% { transform: scale(1,1); }
          30% { transform: scale(1.035,.95); }
          100% { transform: scale(1,1); }
        }
        .dz-spk { transform-box: fill-box; transform-origin: center; }
        .dz-radio.hit .dz-spk { animation: dzpump .28s ease-out; }
        @keyframes dzpump { 0% { transform: scale(1); } 35% { transform: scale(1.09); } 100% { transform: scale(1); } }
        
        .dz-spark { opacity: 0; stroke: var(--gold); stroke-width: 4; fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .dz-radio.spark .dz-spark { animation: dzspark .3s steps(2) 1; }
        @keyframes dzspark { 0% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }

        .dz-reel { transform-box: fill-box; transform-origin: center; animation: dzrot 2.4s linear infinite; }
        .dz-radio:not(.on) .dz-reel { animation-duration: 9s; }
        @keyframes dzrot { to { transform: rotate(360deg); } }

        .dz-hint {
          position: absolute;
          left: 50%;
          top: -7.5cqw;
          transform: translateX(-50%);
          background: var(--crimson);
          color: var(--white);
          font-weight: 600;
          font-size: 2.9cqw;
          letter-spacing: .18em;
          text-transform: uppercase;
          padding: 1.3cqw 3.4cqw;
          border-radius: 99px;
          white-space: nowrap;
          animation: dzhint 1.6s ease-in-out infinite;
          box-shadow: 0 0 0 .5cqw var(--gold);
        }
        .dz-radio.on .dz-hint {
          background: var(--gold);
          color: var(--crimson);
        }
        @keyframes dzhint { 50% { transform: translateX(-50%) translateY(-1.6cqw); } }

        /* Footer Cream Band & Wavy Lines */
        .dz-strip {
          width: 100%;
          height: 13vh;
          min-height: 88px;
          position: relative;
          z-index: 1;
          background: var(--cream);
        }
        .dz-strip::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 16px;
          height: 24px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='24'%3E%3Cg fill='none' stroke='%23A91F35' stroke-width='1.4'%3E%3Cpath d='M0 6C10 0 20 0 30 6S50 12 60 6'/%3E%3Cpath d='M0 11C10 5 20 5 30 11S50 17 60 11'/%3E%3Cpath d='M0 16C10 10 20 10 30 16S50 22 60 16'/%3E%3C/g%3E%3C/svg%3E") repeat-x;
          animation: dzwave 3.2s linear infinite;
        }
        @keyframes dzwave { to { background-position-x: 60px; } }

        /* Bottom Marquee Ticker */
        .dz-ticker {
          position: relative;
          z-index: 5;
          width: 100%;
          overflow: hidden;
          background: var(--deep);
          padding: 11px 0;
          border-top: 1px solid var(--gold);
        }
        .dz-ticker div {
          display: inline-block;
          white-space: nowrap;
          animation: dztick 24s linear infinite;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--white);
        }
        .dz-ticker span { margin: 0 18px; }
        .dz-ticker span:nth-child(even) { color: var(--gold); }
        @keyframes dztick { to { transform: translateX(-50%); } }

        @media (prefers-reduced-motion: reduce) {
          .dz-rings i, .dz-strip::after, .dz-ticker div, .dz-reel, .dz-pixels i {
            animation: none !important;
          }
        }
      `}</style>

      {/* Floating Back to Home Button & Audio Playlist Toggle */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 hover:bg-black/70 text-[#E6A916] text-xs font-bold border border-[#E6A916]/40 backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95 ${
            isPlaylistOpen
              ? 'bg-[#E6A916] text-[#A91F35] border-white'
              : 'bg-black/40 hover:bg-black/70 text-white border-[#E6A916]/40'
          }`}
        >
          <ListMusic className="w-3.5 h-3.5 text-[#E6A916]" />
          <span>Playlist ({RADIO_PLAYLIST.length})</span>
        </button>
      </div>

      {/* Main Ticket-Style Stage (#dz-radio-root) */}
      <section id="dz-radio-root">
        {/* Decorative Rings */}
        <div className="dz-rings">
          <i />
          <i />
          <i />
        </div>

        {/* Decorative Pixel Squares */}
        <div className="dz-pixels">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        {/* The Vertical Ticket Card */}
        <div className="dz-card" id="dzCard" ref={cardRef}>
          {/* Arch Ticket SVG with Scalloped Edges */}
          <svg className="dz-arch" viewBox="0 0 400 600" aria-hidden="true">
            <path d="M20 600V200A180 180 0 0 1 380 200V600Z" fill="#F7F3E9" />
            <path
              d="M20 600V200A180 180 0 0 1 380 200V600"
              fill="none"
              stroke="#A91F35"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray="0 21"
            />
            <g fill="none" stroke="#A91F35" strokeOpacity=".07" strokeWidth="1.5">
              <path d="M40 300q60-40 120 0t120 0t80-20" />
              <path d="M40 340q60-40 120 0t120 0t80-20" />
              <path d="M40 260q60-40 120 0t120 0t80-20" />
              <path d="M60 220q60-30 110 0t110 0t60-10" />
            </g>
          </svg>

          {/* Ticket Body: Logos, Info & Live Countdown */}
          <div className="dz-body">
            {/* NUEVA ERA Theme Logo */}
            <img className="dz-logo" src={ASSETS.nueva} alt="Nueva Era" />

            {/* 3D Extruded DALENZIA FEST Logo */}
            <div className="dz-panel">
              <div className="dz-3d">
                <div
                  className="dz-stack"
                  ref={stackRef}
                  style={{ '--logo': `url(${ASSETS.dalenzia})` }}
                >
                  {Array.from({ length: 16 }).map((_, i) => (
                    <b
                      key={i}
                      style={{
                        background: 'rgb(230,169,22)',
                        transform: `translateZ(${-(16 - i) * 0.3}cqw)`,
                      }}
                    />
                  ))}
                  <img src={ASSETS.dalenzia} alt="Dalenzia Fest" />
                </div>
              </div>

              {/* Festival Date & Venue Information */}
              <div className="dz-info">
                <p className="l1">2026 DECEMBER 21, 22, 23</p>
                <p className="l2">Thaqwa Juma Masjid Ayiroor</p>
                <p className="l3">Venue : Masjidul Liwah, Kandu Bazaar, Puthanpalli, Ayiroor.</p>
              </div>
            </div>

            {/* 4 Live Countdown Blocks */}
            <div className="dz-count" id="dzCount">
              <div>
                <b>{String(timeLeft.days).padStart(2, '0')}</b>
                <span>Days</span>
              </div>
              <div>
                <b>{String(timeLeft.hours).padStart(2, '0')}</b>
                <span>Hrs</span>
              </div>
              <div>
                <b>{String(timeLeft.minutes).padStart(2, '0')}</b>
                <span>Min</span>
              </div>
              <div>
                <b>{String(timeLeft.seconds).padStart(2, '0')}</b>
                <span>Sec</span>
              </div>
            </div>
          </div>

          {/* Retro Boombox Radio Cassette Illustration with TAP THE RADIO Button */}
          <div
            className={`dz-radio ${isPlaying ? 'on' : ''} ${hitPulse ? 'hit' : ''} ${sparkPulse ? 'spark' : ''}`}
            id="dzRadio"
            role="button"
            aria-label="Play the festival radio"
            tabIndex={0}
            onClick={toggleAudio}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAudio();
              }
            }}
          >
            {/* Pulsing Hint / Button */}
            <div className="dz-hint" id="dzHint">
              {isPlaying ? 'PLAYING NOW ⏸' : 'TAP THE RADIO ▶'}
            </div>

            {/* Boombox SVG */}
            <svg viewBox="-24 0 348 200">
              <polyline className="dz-spark" points="-6,70 -18,84 -8,92 -20,108" />
              <polyline className="dz-spark" points="-10,128 -22,140 -12,150" />
              <polyline className="dz-spark" points="306,70 318,84 308,92 320,108" />
              <polyline className="dz-spark" points="310,128 322,140 312,150" />
              <path
                d="M76 40V22q0-10 10-10h128q10 0 10 10v18"
                fill="none"
                stroke="#E6A916"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <rect
                x="6"
                y="38"
                width="288"
                height="152"
                rx="18"
                fill="#A91F35"
                stroke="#E6A916"
                strokeWidth="5"
              />
              <rect
                x="20"
                y="50"
                width="260"
                height="28"
                rx="7"
                fill="#E6A916"
                stroke="#A91F35"
                strokeWidth="3"
              />
              <circle cx="40" cy="64" r="7" fill="#A91F35" />
              <circle cx="262" cy="64" r="7" fill="#A91F35" />
              <rect x="64" y="58" width="172" height="12" rx="3" fill="#A91F35" />

              {/* 14 Dynamic Equalizer Indicator Bars */}
              <g id="dzBars" fill="#FFFFFF">
                {eqHeights.map((h, i) => (
                  <rect
                    key={i}
                    x={68 + i * 11.6}
                    y={70 - h}
                    width={8}
                    height={h}
                    rx={1.5}
                  />
                ))}
              </g>

              {/* Left Speaker with Soundwave Rings */}
              <g className="dz-spk">
                <circle cx="66" cy="132" r="44" fill="#A91F35" stroke="#E6A916" strokeWidth="3" />
                <circle cx="66" cy="132" r="32" fill="none" stroke="#E6A916" strokeWidth="3" />
                <circle cx="66" cy="132" r="20" fill="#F7F3E9" />
                <path d="M60 121l17 11-17 11z" fill="#A91F35" />
              </g>

              {/* Right Speaker with Soundwave Rings */}
              <g className="dz-spk">
                <circle cx="234" cy="132" r="44" fill="#A91F35" stroke="#E6A916" strokeWidth="3" />
                <circle cx="234" cy="132" r="32" fill="none" stroke="#E6A916" strokeWidth="3" />
                <circle cx="234" cy="132" r="20" fill="#F7F3E9" />
                <path d="M228 121l17 11-17 11z" fill="#A91F35" />
              </g>

              {/* Cassette Tape Compartment */}
              <rect
                x="112"
                y="92"
                width="76"
                height="52"
                rx="8"
                fill="#F7F3E9"
                stroke="#A91F35"
                strokeWidth="3"
              />
              <rect x="120" y="100" width="60" height="22" rx="5" fill="#A91F35" />

              {/* Rotating Tape Reels */}
              <g className="dz-reel">
                <circle cx="136" cy="111" r="7" fill="#E6A916" />
                <path d="M136 105v12M130 111h12" stroke="#A91F35" strokeWidth="2" />
              </g>
              <g className="dz-reel">
                <circle cx="164" cy="111" r="7" fill="#E6A916" />
                <path d="M164 105v12M158 111h12" stroke="#A91F35" strokeWidth="2" />
              </g>

              {/* Cassette Window & Radio Tuning Dials */}
              <rect x="120" y="128" width="60" height="9" rx="3" fill="#A91F35" />
              <circle cx="150" cy="170" r="6" fill="#E6A916" stroke="#A91F35" strokeWidth="2" />
              <circle cx="130" cy="170" r="4" fill="#F7F3E9" />
              <circle cx="170" cy="170" r="4" fill="#F7F3E9" />
            </svg>
          </div>
        </div>

        {/* Cream Band with Animated Wave Separator Lines */}
        <div className="dz-strip" />

        {/* Continuous Moving Festival Information Marquee Ticker */}
        <div className="dz-ticker">
          <div>
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((t, idx) => (
              <React.Fragment key={idx}>
                <span>{t}</span>
                <span>✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Slide-Up Interactive Radio Playlist Drawer */}
      <AnimatePresence>
        {isPlaylistOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-x-0 bottom-0 z-50 max-w-2xl mx-auto p-4 sm:p-6 bg-gradient-to-b from-[#8C1428] to-[#590B19] rounded-t-3xl border-t-2 border-x-2 border-[#E6A916] shadow-2xl text-white backdrop-blur-xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E6A916]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center font-bold">
                  <Disc3 className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                    Official Festival Radio Series
                  </h4>
                  <p className="text-[10px] text-[#E6A916] font-semibold">
                    8 MP3 Audio Episodes from Assets Folder
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPlaylistOpen(false)}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Currently Playing Track Bar */}
            <div className="my-3 p-3 bg-black/40 rounded-xl border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#E6A916] font-bold text-[11px] uppercase tracking-wider">
                  EPISODE {currentIndex + 1} OF {RADIO_PLAYLIST.length}
                </span>
                <span className="text-white/70 text-[10px] font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold truncate text-white">
                {currentTrack.title}
              </p>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                    aria-label="Previous"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={toggleAudio}
                    className="px-4 py-1 rounded-full bg-[#E6A916] hover:bg-[#ffd166] text-[#A91F35] font-black text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-md"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                    aria-label="Next"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-stone-300 hover:text-white"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-stone-600 rounded-lg accent-[#E6A916] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Playlist of all 8 Authentic MP3 Episodes */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {RADIO_PLAYLIST.map((track, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(idx)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer text-xs ${
                      isActive
                        ? 'bg-[#E6A916] text-[#A91F35] font-bold shadow-md'
                        : 'bg-black/25 hover:bg-black/50 text-white/90 border border-white/5'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#A91F35] text-[#E6A916]' : 'bg-white/10 text-[#E6A916]'
                      }`}
                    >
                      {isActive && isPlaying ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </div>
                    <span className="truncate flex-1">{track.title}</span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-[#A91F35] text-[#E6A916]' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      EP 0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
