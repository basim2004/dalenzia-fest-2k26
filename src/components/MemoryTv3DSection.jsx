import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  RotateCcw,
  Sparkles,
  Disc,
  Power,
  Tv,
  Film,
  Music,
  ChevronRight,
  ChevronLeft,
  Info,
  Radio,
  Sliders,
  SkipBack,
  SkipForward,
  Layers,
  Award
} from 'lucide-react';
import { VIDEO_HIGHLIGHTS_2K25 } from '../data/dalenzia2k25Data';

// ============================================================================
// RETRO WEB AUDIO API SYNTHESIZER
// Realistic mechanical sounds: Tray motor, Disc drop, Drive spin, Laser seek, CRT degauss
// ============================================================================
class RetroSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // 1. Motorized DVD Tray Opening Sound
  playTrayOpen() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Dual motor gear whir
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.35);
    osc.frequency.linearRampToValueAtTime(120, now + 0.6);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);

    // End stop mechanical latch
    setTimeout(() => {
      if (!this.ctx) return;
      const n = this.ctx.currentTime;
      const o2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      o2.type = 'triangle';
      o2.frequency.setValueAtTime(80, n);
      g2.gain.setValueAtTime(0.2, n);
      g2.gain.exponentialRampToValueAtTime(0.001, n + 0.08);
      o2.connect(g2);
      g2.connect(this.ctx.destination);
      o2.start(n);
      o2.stop(n + 0.08);
    }, 550);
  }

  // 2. Motorized DVD Tray Closing Sound
  playTrayClose() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.45);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // Final locking snap
    setTimeout(() => {
      this.playDiscDrop();
    }, 460);
  }

  // 3. Physical CD Drop / Clamping Click
  playDiscDrop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 4. Optical Disc Spin-up & Laser Seek
  playSpinUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // High speed spindle motor acceleration
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.7);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.85);

    // Laser head seek stepper chirps
    [0.2, 0.45, 0.65].forEach((delay) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const n = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(1200 + Math.random() * 400, n);
        g.gain.setValueAtTime(0.04, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.05);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(n);
        o.stop(n + 0.05);
      }, delay * 1000);
    });
  }

  // 5. Classic CRT Power-On Degauss & High-Voltage Hum
  playCrtPowerOn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Resonant degauss coil "THUMP"
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    // Flyback transformer 15kHz faint whistle
    const fly = this.ctx.createOscillator();
    const flyGain = this.ctx.createGain();
    fly.type = 'sine';
    fly.frequency.setValueAtTime(14500, now + 0.15);
    flyGain.gain.setValueAtTime(0.015, now + 0.15);
    flyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    fly.connect(flyGain);
    flyGain.connect(this.ctx.destination);
    fly.start(now + 0.15);
    fly.stop(now + 0.6);
  }

  // 6. CRT Power Off Pop
  playCrtPowerOff() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // 7. Tactical Button Beep
  playBeep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }
}

const soundEngine = new RetroSoundEngine();

// ============================================================================
// INTERACTIVE 3D PROGRAMME CD COMPONENT
// Realistic 120mm optical disc with metallic rainbow diffraction & printed artwork
// ============================================================================
function ProgrammeCdDisc({ video, isSelected, isInserted, onClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 22, y: x * 22 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const thumbnailSrc =
    video.thumbnail ||
    `/assets/dalenzia2k25/video_thumbnails/${video.rawFilename.replace(/\.mp4$/i, '.jpg')}`;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group cursor-pointer select-none transition-all duration-300 p-2 ${
        isSelected ? 'scale-105 z-20' : 'hover:scale-102 hover:z-10'
      }`}
      style={{ perspective: '800px' }}
    >
      {/* 3D Rotating Compact Disc */}
      <div
        className="relative w-36 sm:w-44 md:w-48 aspect-square rounded-full transition-transform duration-200 ease-out shadow-xl"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(16px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
          boxShadow: isSelected
            ? '0 20px 35px -5px rgba(230,169,22,0.4), 0 0 25px rgba(169,31,53,0.3)'
            : '0 12px 24px -4px rgba(0,0,0,0.35)'
        }}
      >
        {/* Polycarbonate Optical Substrate Base with Conic Rainbow Diffraction */}
        <div
          className="absolute inset-0 rounded-full border border-white/40 overflow-hidden"
          style={{
            background:
              'conic-gradient(from 145deg at 50% 50%, #fef08a, #bbf7d0, #a5f3fc, #c7d2fe, #f5d0fe, #fbcfe8, #fed7aa, #fef08a)'
          }}
        >
          {/* Concentric Audio/Video Track Microgrooves */}
          <div
            className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                'repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 3px)'
            }}
          />

          {/* Shifting Dynamic Specular Rainbow Reflection */}
          <div
            className="absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none"
            style={{
              background: `linear-gradient(${
                115 + tilt.y * 3
              }deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0) 100%)`,
              opacity: isHovered ? 0.9 : 0.4
            }}
          />

          {/* Printed Sticker Art (Top Semi-Arc Label) */}
          <div className="absolute inset-x-2 top-2 h-[48%] rounded-t-full overflow-hidden border-b border-black/20 shadow-inner">
            <img
              src={thumbnailSrc}
              alt={video.title}
              className="w-full h-full object-cover filter contrast-105 brightness-95"
              onError={(e) => {
                e.target.src = '/assets/dalenzia2k25/video_thumbnails/closing cermony.jpg';
              }}
            />
            {/* Glossy Sticker Sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/40 pointer-events-none" />

            {/* Dalenzia 2K25 CD Stamp */}
            <div className="absolute top-2 inset-x-0 flex items-center justify-between px-3 text-[9px] font-black tracking-widest text-white drop-shadow-md">
              <span className="bg-[#A91F35]/90 px-1.5 py-0.5 rounded-sm">2K25</span>
              <span className="bg-[#E6A916]/90 text-stone-900 px-1 py-0.5 rounded-sm font-mono text-[8px]">
                DVD-VIDEO
              </span>
            </div>
          </div>

          {/* Bottom Printed Track Info Label */}
          <div className="absolute inset-x-2 bottom-2 h-[38%] rounded-b-full bg-gradient-to-t from-stone-900/90 via-stone-800/80 to-transparent flex flex-col items-center justify-end pb-2 px-3 text-center">
            <span className="text-[10px] sm:text-[11px] font-serif font-black text-[#FAF6EE] line-clamp-1 leading-tight drop-shadow-sm">
              {video.title}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 text-[8px] font-mono text-stone-300">
              <span className="uppercase text-[#E6A916] font-bold">{video.subCategory || video.category}</span>
              <span>•</span>
              <span>{video.sizeMB} MB</span>
            </div>
          </div>

          {/* Outer Clamping Ring */}
          <div className="absolute inset-[33%] rounded-full border border-white/60 bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
            {/* Mirrored Hub Ring */}
            <div className="w-[72%] h-[72%] rounded-full border border-stone-400 bg-gradient-to-tr from-stone-300 via-white to-stone-400 flex items-center justify-center shadow-sm">
              {/* Center Spindle Hole (See-Through) */}
              <div className="w-[45%] h-[45%] rounded-full bg-stone-950/95 border-2 border-stone-800/80 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Selected / Playing Pulse Badge */}
        {isInserted && (
          <div className="absolute -top-1 -right-1 z-30 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[9px] font-black tracking-wider uppercase shadow-lg animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>LOADED</span>
          </div>
        )}
      </div>

      {/* Under-Disc Shadow */}
      <div
        className="w-4/5 h-3 mx-auto mt-1 rounded-full bg-black/35 blur-xs transition-transform duration-200"
        style={{
          transform: isHovered ? 'scale(1.15) translateY(4px)' : 'scale(1) translateY(0)'
        }}
      />
    </div>
  );
}

// ============================================================================
// MAIN RETRO 3D MEMORY TV COMPONENT
// Bratz-Style Purple CRT TV with Built-in Motorized DVD Player & Interactive Controls
// ============================================================================
export default function MemoryTv3DSection() {
  // Video Selection & State
  const [selectedVideo, setSelectedVideo] = useState(() => VIDEO_HIGHLIGHTS_2K25[0]);
  const [insertedVideo, setInsertedVideo] = useState(() => VIDEO_HIGHLIGHTS_2K25[0]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Animation Sequence State Machine:
  // 'idle' | 'tray_opening' | 'disc_inserting' | 'tray_closing' | 'loading' | 'playing' | 'ejecting'
  const [animState, setAnimState] = useState('playing');
  const [isTvPowered, setIsTvPowered] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);
  const [volume, setVolume] = useState(0.85);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRemote, setShowRemote] = useState(false);
  const [videoError, setVideoError] = useState(null);

  // References
  const videoRef = useRef(null);
  const tvContainerRef = useRef(null);

  // Synchronize Sound Engine State
  useEffect(() => {
    soundEngine.enabled = isSfxEnabled;
  }, [isSfxEnabled]);

  // Video Categories & Counts
  const categories = useMemo(() => {
    const counts = { all: VIDEO_HIGHLIGHTS_2K25.length };
    VIDEO_HIGHLIGHTS_2K25.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return [
      { id: 'all', label: 'All Discs', count: counts.all, icon: Disc },
      { id: 'anthem', label: 'Anthem & Theme', count: counts.anthem || 0, icon: Music },
      { id: 'highlights', label: 'Festival Highlights', count: counts.highlights || 0, icon: Sparkles },
      { id: 'ceremony', label: 'Ceremony & Speeches', count: counts.ceremony || 0, icon: Award },
      { id: 'performances', label: 'Stage Performances', count: counts.performances || 0, icon: Film },
      { id: 'production', label: 'Behind The Scenes', count: counts.production || 0, icon: Layers }
    ];
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'all') return VIDEO_HIGHLIGHTS_2K25;
    return VIDEO_HIGHLIGHTS_2K25.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  // ==========================================================================
  // 6-STEP CINEMATIC CD INSERTION WORKFLOW
  // ==========================================================================
  const handleSelectCd = (video) => {
    if (insertedVideo?.id === video.id && animState === 'playing') {
      // Toggle play/pause if clicking the currently playing disc
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }
      return;
    }

    soundEngine.playBeep();
    setSelectedVideo(video);
    setVideoError(null);

    // If TV is off, power it on automatically
    if (!isTvPowered) {
      setIsTvPowered(true);
      soundEngine.playCrtPowerOn();
    }

    // Step 1: Open DVD Tray
    setAnimState('tray_opening');
    soundEngine.playTrayOpen();

    // Step 2: CD Insertion movement
    setTimeout(() => {
      setAnimState('disc_inserting');
      soundEngine.playDiscDrop();
    }, 600);

    // Step 3: Tray retracts
    setTimeout(() => {
      setAnimState('tray_closing');
      soundEngine.playTrayClose();
    }, 1250);

    // Step 4: Drive reads TOC & Laser scan
    setTimeout(() => {
      setAnimState('loading');
      setInsertedVideo(video);
      soundEngine.playSpinUp();
    }, 1800);

    // Step 5: Screen illuminates & Video playback commences
    setTimeout(() => {
      setAnimState('playing');
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 3100);
  };

  // Physical TV Power Toggle
  const handleTogglePower = () => {
    if (isTvPowered) {
      soundEngine.playCrtPowerOff();
      setIsTvPowered(false);
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
    } else {
      soundEngine.playCrtPowerOn();
      setIsTvPowered(true);
      if (videoRef.current && animState === 'playing') {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Physical DVD Tray Eject Button
  const handleEject = () => {
    soundEngine.playBeep();
    if (animState === 'tray_opening' || animState === 'ejecting') {
      // Close tray
      setAnimState('tray_closing');
      soundEngine.playTrayClose();
      setTimeout(() => {
        setAnimState('playing');
      }, 600);
    } else {
      // Eject tray
      if (videoRef.current) videoRef.current.pause();
      setIsPlaying(false);
      setAnimState('ejecting');
      soundEngine.playTrayOpen();
    }
  };

  // Next / Previous Disc Track navigation
  const handleNextDisc = () => {
    const currentIndex = filteredVideos.findIndex((v) => v.id === insertedVideo?.id);
    const nextIndex = (currentIndex + 1) % filteredVideos.length;
    handleSelectCd(filteredVideos[nextIndex]);
  };

  const handlePrevDisc = () => {
    const currentIndex = filteredVideos.findIndex((v) => v.id === insertedVideo?.id);
    const prevIndex = (currentIndex - 1 + filteredVideos.length) % filteredVideos.length;
    handleSelectCd(filteredVideos[prevIndex]);
  };

  // Video Time Updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setPlaybackTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const target = parseFloat(e.target.value);
    if (videoRef.current && !isNaN(target)) {
      videoRef.current.currentTime = target;
      setPlaybackTime(target);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isTrayOpen = animState === 'tray_opening' || animState === 'disc_inserting' || animState === 'ejecting';
  const isLoading = animState === 'loading';

  return (
    <section id="2k25-videos" className="py-16 md:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none">
      
      {/* Header Section with Retro Badge */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B2671]/15 border border-[#8B2671]/30 text-[#8B2671] text-xs font-black tracking-widest uppercase shadow-xs">
          <Tv className="w-4 h-4 text-[#E6A916]" />
          <span>DALENZIA 2K25 • THE MEMORY TV</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900 leading-tight">
          Interactive Retro DVD Television
        </h2>
        <p className="text-sm md:text-base text-stone-600 font-medium max-w-xl mx-auto">
          Choose any of the 27 original festival CDs below to watch the disc physically load into our early-2000s purple DVD TV!
        </p>

        {/* Action Pills & Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
          <button
            onClick={() => setIsSfxEnabled(!isSfxEnabled)}
            className={`px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isSfxEnabled
                ? 'bg-[#8B2671] text-white border-[#8B2671] shadow-sm'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
          >
            {isSfxEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#E6A916]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isSfxEnabled ? 'Retro Audio FX ON' : 'Audio FX Muted'}</span>
          </button>

          <button
            onClick={() => setShowRemote(!showRemote)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-700 font-bold border border-stone-300 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-[#8B2671]" />
            <span>{showRemote ? 'Hide Remote' : 'Show TV Remote'}</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 font-mono text-[11px] font-semibold">
            <Disc className="w-3.5 h-3.5 text-[#E6A916] animate-spin-slow" />
            <span>CD Vault: <strong>27 Discs</strong></span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* THE 3D RETRO TELEVISION APPARATUS (PURPLE CRT + INTEGRATED DVD TRAY) */}
      {/* ==================================================================== */}
      <div
        ref={tvContainerRef}
        className="relative max-w-4xl mx-auto flex flex-col items-center justify-center pt-2 pb-6"
        style={{ perspective: '1200px' }}
      >
        {/* Ambient CRT / Studio Glow */}
        <div className="absolute top-1/4 w-[420px] sm:w-[620px] h-[350px] sm:h-[480px] bg-[#942676]/20 rounded-[80px] blur-3xl pointer-events-none" />

        {/* ================================================================ */}
        {/* PHYSICAL TELEVISION CHASSIS (Deep Purple Bulbous Form)           */}
        {/* ================================================================ */}
        <div
          className="relative z-10 w-full max-w-[700px] bg-gradient-to-b from-[#942676] via-[#7B1E63] to-[#591448] rounded-[48px] sm:rounded-[64px] p-4 sm:p-7 shadow-[0_30px_70px_-15px_rgba(89,20,72,0.65),0_15px_25px_-5px_rgba(0,0,0,0.5)] border-4 sm:border-[6px] border-[#B83C94]/60 transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFullscreen ? 'none' : 'rotateX(2deg)'
          }}
        >
          {/* Top Carrying Grip & Chrome Edge Bevel */}
          <div className="absolute -top-3.5 inset-x-1/4 h-3.5 bg-gradient-to-r from-transparent via-[#B83C94] to-transparent rounded-t-xl opacity-80" />

          {/* Decorative Cute 2000s Bratz-Style Chrome Stars & Stickers on Purple Frame */}
          <div className="absolute top-4 left-6 text-white/30 text-xs font-black select-none pointer-events-none flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#FDE047]" />
            <span className="text-[10px] tracking-widest uppercase font-serif text-[#FDE047]/70">★ MEMORY TV ★</span>
          </div>

          <div className="absolute top-4 right-6 text-white/30 text-xs font-black select-none pointer-events-none flex items-center gap-1.5">
            <span className="text-[9px] font-mono tracking-widest text-white/60">STEREO / CRT-21</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
          </div>

          {/* Top Brand Plate */}
          <div className="flex justify-center mb-2.5">
            <div className="px-5 py-0.5 rounded-full bg-black/40 border border-white/20 shadow-inner flex items-center gap-2">
              <span className="font-serif font-black tracking-[0.25em] text-[#FDE047] text-xs sm:text-sm drop-shadow-md">
                DALENZIA
              </span>
              <span className="text-[9px] font-mono text-white/70 font-bold uppercase">2K25</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CURVED CRT GLASS DISPLAY UNIT                                 */}
          {/* ============================================================== */}
          <div className="relative w-full aspect-[4/3] max-h-[440px] bg-black rounded-[32px] sm:rounded-[44px] overflow-hidden border-[8px] sm:border-[12px] border-[#2A0823] shadow-[inset_0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(0,0,0,0.8)]">
            
            {/* Screen Glass Reflection Gradient & Curvature Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/12 pointer-events-none z-20 rounded-[28px]" />

            {/* Retro CRT Scanline Shader Overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-20 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1.5px, transparent 1.5px, transparent 3px)'
              }}
            />

            {/* CRT Screen Curvature Vignette */}
            <div
              className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_60px_rgba(0,0,0,0.85)]"
            />

            {/* ============================================================ */}
            {/* SCREEN STATE 1: TV IS POWERED OFF                           */}
            {/* ============================================================ */}
            {!isTvPowered && (
              <div className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center z-30">
                {/* Collapsing Phosphor Line */}
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_12px_#fff] animate-pulse" />
                <span className="text-[11px] font-mono text-stone-600 mt-3 uppercase tracking-widest">
                  STANDBY • PRESS POWER TO ACTIVATE
                </span>
              </div>
            )}

            {/* ============================================================ */}
            {/* SCREEN STATE 2: TRAY IS OPEN / EJECTED                      */}
            {/* ============================================================ */}
            {isTvPowered && isTrayOpen && (
              <div className="absolute inset-0 bg-[#0A1647] flex flex-col items-center justify-center z-25 text-white p-6 space-y-3">
                <div className="w-16 h-16 rounded-full border-4 border-dashed border-[#E6A916] flex items-center justify-center animate-[spin_8s_linear_infinite]">
                  <Disc className="w-8 h-8 text-[#E6A916]" />
                </div>
                <div className="text-center font-mono space-y-1">
                  <span className="text-xs font-black tracking-widest text-[#E6A916] uppercase block">
                    {animState === 'disc_inserting' ? 'INSERTING DISC...' : 'DISC TRAY OPEN'}
                  </span>
                  <p className="text-[11px] text-blue-200/80">
                    {selectedVideo ? selectedVideo.title : 'Select a CD from below'}
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SCREEN STATE 3: DVD LOADING & LASER SEEK SCREEN             */}
            {/* ============================================================ */}
            {isTvPowered && isLoading && (
              <div className="absolute inset-0 bg-[#061138] flex flex-col items-center justify-center z-25 text-white space-y-4 p-6">
                {/* Nostalgic DVD Video Logo */}
                <div className="flex flex-col items-center space-y-1 animate-bounce">
                  <span className="font-serif font-black tracking-widest text-2xl text-[#E6A916] drop-shadow-[0_0_15px_rgba(230,169,22,0.8)]">
                    DVD
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.4em] text-white font-bold">
                    VIDEO
                  </span>
                </div>

                {/* Laser Scanning Indicator */}
                <div className="w-48 h-1 bg-blue-950 rounded-full overflow-hidden border border-blue-500/40 relative">
                  <div className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-[#E6A916] to-transparent animate-[shimmer_1.2s_infinite]" />
                </div>

                <div className="font-mono text-center space-y-0.5">
                  <span className="text-[11px] font-bold text-blue-300 tracking-wider block">
                    READING TOC • LASER ALIGNMENT
                  </span>
                  <span className="text-[9px] text-blue-400/80">
                    TITLE: {insertedVideo?.title}
                  </span>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* SCREEN STATE 4: ACTIVE VIDEO PLAYBACK                        */}
            {/* ============================================================ */}
            {isTvPowered && (
              <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                {videoError ? (
                  <div className="text-center p-6 space-y-3 z-10">
                    <p className="text-red-400 font-mono text-xs">{videoError}</p>
                    <a
                      href={encodeURI(insertedVideo?.src || '')}
                      download
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E6A916] text-[#A91F35] font-bold text-xs shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Video File</span>
                    </a>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={encodeURI(insertedVideo?.src || '')}
                    className="w-full h-full object-contain bg-black"
                    playsInline
                    autoPlay
                    muted={isMuted}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleNextDisc}
                    onError={() => setVideoError(`Unable to stream codec: ${insertedVideo?.rawFilename}`)}
                  />
                )}

                {/* Retro CRT On-Screen Display (OSD) Overlay */}
                <div className="absolute top-3 left-4 z-20 flex items-center gap-2 pointer-events-none opacity-85">
                  <span className="px-2 py-0.5 rounded bg-black/60 border border-green-500/40 font-mono text-[10px] font-bold text-green-400 tracking-wider shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                    <span>{isPlaying ? 'PLAY ▶' : 'PAUSE ❚❚'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-[10px] text-[#FAF6EE]/90">
                    {formatTime(playbackTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="absolute top-3 right-4 z-20 pointer-events-none opacity-85">
                  <span className="px-2 py-0.5 rounded bg-black/60 border border-yellow-500/40 font-mono text-[9px] font-bold text-yellow-400 tracking-wider uppercase">
                    CH 01 • STEREO
                  </span>
                </div>

                {/* Subtitle / Title Bar at Bottom of CRT on Hover */}
                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white text-[11px]">
                    <span className="font-serif font-bold text-[#E6A916] truncate max-w-md">
                      {insertedVideo?.title}
                    </span>
                    <span className="font-mono text-[10px] text-stone-300 shrink-0">
                      {insertedVideo?.rawFilename}
                    </span>
                  </div>

                  {/* Scrubber Bar */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={playbackTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#E6A916]"
                    />
                  </div>

                  {/* On-Screen Quick Control Buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (videoRef.current) {
                            if (isPlaying) videoRef.current.pause();
                            else videoRef.current.play().catch(() => {});
                            setIsPlaying(!isPlaying);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      <button
                        onClick={handlePrevDisc}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title="Previous Disc"
                      >
                        <SkipBack className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={handleNextDisc}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title="Next Disc"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={encodeURI(insertedVideo?.src || '')}
                        download={insertedVideo?.rawFilename}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-1 text-[10px] font-mono"
                        title="Download MP4"
                      >
                        <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                        <span className="hidden sm:inline">Save</span>
                      </a>

                      <button
                        onClick={() => {
                          if (!document.fullscreenElement) {
                            tvContainerRef.current?.requestFullscreen?.();
                            setIsFullscreen(true);
                          } else {
                            document.exitFullscreen?.();
                            setIsFullscreen(false);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title="Toggle Fullscreen"
                      >
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* LOWER CONSOLE DECK: SPEAKERS, MOTORIZED TRAY & HARDWARE BUTTONS */}
          {/* ============================================================== */}
          <div className="mt-4 sm:mt-5 bg-gradient-to-b from-[#C8CCD2] via-[#E2E5E9] to-[#ACB2B9] rounded-[28px] sm:rounded-[36px] p-3 sm:p-5 border-2 border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.3)]">
            
            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
              
              {/* LEFT SPEAKER GRILLE */}
              <div className="col-span-3 sm:col-span-3 flex flex-col items-center justify-center">
                <div
                  className="w-full aspect-[4/3] rounded-2xl bg-[#282B30] border border-white/50 shadow-inner"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #555 1.5px, transparent 1.5px)',
                    backgroundSize: '6px 6px'
                  }}
                />
                <span className="text-[8px] font-mono font-bold text-stone-600 mt-1 uppercase tracking-wider">
                  LEFT SPK
                </span>
              </div>

              {/* CENTER: MOTORIZED DVD DISC TRAY */}
              <div className="col-span-6 sm:col-span-6 flex flex-col items-center">
                
                {/* Physical Tray Housing Slot */}
                <div className="relative w-full bg-[#181A1D] rounded-xl p-1.5 border border-black/80 shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)] overflow-visible">
                  
                  {/* Sliding Front Tray Plate (3D Motorized Motion) */}
                  <div
                    className={`relative w-full h-8 sm:h-10 rounded-lg bg-gradient-to-b from-[#4A153D] via-[#7B1E63] to-[#3B0E30] border border-[#B83C94]/60 shadow-md flex items-center justify-between px-3 transition-all duration-700 ease-in-out ${
                      isTrayOpen
                        ? 'translate-y-8 sm:translate-y-10 scale-105 shadow-[0_20px_35px_rgba(0,0,0,0.7)] ring-2 ring-[#E6A916]'
                        : 'translate-y-0 scale-100'
                    }`}
                  >
                    {/* Tray Status LED */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          isTrayOpen
                            ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                            : isLoading
                            ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-ping'
                            : isPlaying
                            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                            : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                        }`}
                      />
                      <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-widest text-[#FDE047] uppercase">
                        {isTrayOpen ? 'TRAY OPEN' : isLoading ? 'READING' : 'DVD-ROM'}
                      </span>
                    </div>

                    {/* Laser Spindle Hub Icon */}
                    <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center bg-black/40">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E6A916] animate-pulse" />
                    </div>

                    {/* Integrated Front Eject Button */}
                    <button
                      onClick={handleEject}
                      className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 active:scale-95 text-white font-mono text-[9px] font-black tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-xs border border-white/30"
                      title="Open/Close Tray"
                    >
                      <span>⏏</span>
                      <span className="hidden sm:inline">EJECT</span>
                    </button>
                  </div>

                  {/* Internal Laser Optical Pickup Well (Visible when tray slides open) */}
                  {isTrayOpen && (
                    <div className="absolute inset-x-2 top-2 h-6 bg-black rounded flex items-center justify-center z-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                        <span className="text-[7px] font-mono text-cyan-300 tracking-wider">
                          OPTICAL SENSOR ACTIVE
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full px-2 mt-1.5 text-[8px] font-mono text-stone-600 font-bold uppercase">
                  <span>DOLBY DIGITAL</span>
                  <span>COMPACT DISC</span>
                  <span>AUTO LOAD</span>
                </div>
              </div>

              {/* RIGHT SPEAKER GRILLE */}
              <div className="col-span-3 sm:col-span-3 flex flex-col items-center justify-center">
                <div
                  className="w-full aspect-[4/3] rounded-2xl bg-[#282B30] border border-white/50 shadow-inner"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, #555 1.5px, transparent 1.5px)',
                    backgroundSize: '6px 6px'
                  }}
                />
                <span className="text-[8px] font-mono font-bold text-stone-600 mt-1 uppercase tracking-wider">
                  RIGHT SPK
                </span>
              </div>
            </div>

            {/* HARDWARE BUTTONS & KNOBS ROW */}
            <div className="mt-4 pt-3 border-t border-stone-300/80 flex flex-wrap items-center justify-between gap-2 sm:gap-4 px-2">
              
              {/* Power Switch & Power LED */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePower}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/80 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                    isTvPowered
                      ? 'bg-gradient-to-b from-[#A91F35] to-[#781424] text-white shadow-[0_0_12px_rgba(169,31,53,0.6)]'
                      : 'bg-gradient-to-b from-stone-400 to-stone-600 text-stone-300'
                  }`}
                  title="TV Power On/Off"
                >
                  <Power className="w-4 h-4" />
                </button>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] font-mono font-bold text-stone-600">POWER</span>
                  <span className={`text-[8px] font-black ${isTvPowered ? 'text-emerald-700' : 'text-stone-500'}`}>
                    {isTvPowered ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>

              {/* Physical Playback Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-300/60 p-1 rounded-xl border border-white/60">
                <button
                  onClick={handlePrevDisc}
                  className="p-1.5 sm:p-2 rounded-lg bg-stone-100 hover:bg-white text-stone-800 shadow-xs active:scale-90 transition-all cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) videoRef.current.pause();
                      else videoRef.current.play().catch(() => {});
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-b from-[#8B2671] to-[#591448] text-white shadow-xs active:scale-90 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>

                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.pause();
                      videoRef.current.currentTime = 0;
                    }
                    setIsPlaying(false);
                  }}
                  className="p-1.5 sm:p-2 rounded-lg bg-stone-100 hover:bg-white text-stone-800 shadow-xs active:scale-90 transition-all cursor-pointer"
                  title="Stop"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  onClick={handleNextDisc}
                  className="p-1.5 sm:p-2 rounded-lg bg-stone-100 hover:bg-white text-stone-800 shadow-xs active:scale-90 transition-all cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Volume Slider Knob */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-stone-700 hover:text-stone-900 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    setIsMuted(false);
                    if (videoRef.current) videoRef.current.volume = v;
                  }}
                  className="w-16 sm:w-20 h-1.5 bg-stone-400 rounded-lg appearance-none cursor-pointer accent-[#8B2671]"
                  title="TV Speaker Volume"
                />
              </div>
            </div>
          </div>

          {/* Retro Television Feet */}
          <div className="absolute -bottom-4 left-10 w-10 sm:w-14 h-4 bg-gradient-to-b from-[#591448] to-[#2A0823] rounded-b-2xl border-2 border-[#B83C94]/40 shadow-lg" />
          <div className="absolute -bottom-4 right-10 w-10 sm:w-14 h-4 bg-gradient-to-b from-[#591448] to-[#2A0823] rounded-b-2xl border-2 border-[#B83C94]/40 shadow-lg" />
        </div>

        {/* ================================================================ */}
        {/* RETRO BRATZ TV REMOTE CONTROL (TOGGLEABLE DOCKED POPUP)          */}
        {/* ================================================================ */}
        <AnimatePresence>
          {showRemote && (
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className="absolute -right-4 sm:-right-8 top-10 z-40 w-44 sm:w-48 bg-gradient-to-b from-stone-100 via-white to-stone-200 rounded-3xl p-3.5 border-2 border-stone-300 shadow-[0_20px_35px_rgba(0,0,0,0.35)] select-none"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="font-serif font-black text-xs text-[#8B2671]">REMOTE</span>
                <button
                  onClick={() => setShowRemote(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Remote Keypad */}
              <div className="grid grid-cols-3 gap-1.5 py-3 text-center">
                <button
                  onClick={handleTogglePower}
                  className="p-2 rounded-xl bg-red-600 text-white font-bold text-[10px] shadow-xs active:scale-90"
                >
                  PWR
                </button>
                <button
                  onClick={handleEject}
                  className="p-2 rounded-xl bg-[#8B2671] text-white font-bold text-[10px] shadow-xs active:scale-90"
                >
                  ⏏
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-stone-300 text-stone-800 font-bold text-[10px] shadow-xs active:scale-90"
                >
                  MUTE
                </button>

                <button
                  onClick={handlePrevDisc}
                  className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] font-bold"
                >
                  ⏮
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) videoRef.current.pause();
                      else videoRef.current.play().catch(() => {});
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="p-2 rounded-xl bg-[#E6A916] text-[#A91F35] font-black text-[10px]"
                >
                  ⏯
                </button>
                <button
                  onClick={handleNextDisc}
                  className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] font-bold"
                >
                  ⏭
                </button>
              </div>

              {/* Number Shortcuts */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono font-bold text-stone-600">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      if (filteredVideos[num - 1]) handleSelectCd(filteredVideos[num - 1]);
                    }}
                    className="p-1 rounded bg-stone-100 hover:bg-[#8B2671] hover:text-white transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================================================================== */}
      {/* INTERACTIVE 3D PROGRAMME CD VAULT & BROWSING SHELF                   */}
      {/* ==================================================================== */}
      <div className="space-y-6 pt-4">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#8B2671] text-white shadow-md scale-105 ring-2 ring-[#E6A916]'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6A916]' : 'text-stone-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CD Jewel Racks (Horizontal Scrollable / Responsive Grid) */}
        <div className="bg-stone-100/80 rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <span className="text-[10px] font-black font-mono tracking-widest text-[#8B2671] uppercase block">
                SELECT A PROGRAMME CD TO INSERT
              </span>
              <h3 className="font-serif font-black text-lg text-stone-900">
                Original 2K25 Recorded Archive Discs
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-stone-500">
              Showing {filteredVideos.length} CDs
            </span>
          </div>

          {/* Interactive CD Collection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-h-[560px] overflow-y-auto p-2 scrollbar-thin">
            {filteredVideos.map((video) => (
              <ProgrammeCdDisc
                key={video.id}
                video={video}
                isSelected={selectedVideo?.id === video.id}
                isInserted={insertedVideo?.id === video.id}
                onClick={() => handleSelectCd(video)}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
