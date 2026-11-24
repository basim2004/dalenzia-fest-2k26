import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Download,
  X,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Eye,
  Layers,
  Award,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { COMPETITION_RESULTS_2K25 } from '../data/dalenzia2k25Data';

export default function InteractiveResultPostersSection() {
  const [isExhibitionOpen, setIsExhibitionOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  const containerRef = useRef(null);
  const posters = COMPETITION_RESULTS_2K25 || [];
  const totalCount = posters.length;
  const currentPoster = posters[currentIndex] || posters[0];

  // Keyboard navigation when exhibition is active
  useEffect(() => {
    if (!isExhibitionOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        if (isZoomed) setIsZoomed(false);
        else handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExhibitionOpen, currentIndex, isZoomed]);

  const handleOpenExhibition = () => {
    setIsKeyPressed(true);
    setTimeout(() => {
      setIsKeyPressed(false);
      setIsExhibitionOpen(true);
      setIsCompleted(false);
      // Smooth scroll to view
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  };

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (isCompleted) {
      setIsCompleted(false);
      return;
    }
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setDirection(1);
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const handleClose = () => {
    setIsExhibitionOpen(false);
    setIsCompleted(false);
    setIsZoomed(false);
  };

  // 3D Presentation Slide Variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? 12 : -12,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? -12 : 12,
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div
      id="2k25-result-posters"
      ref={containerRef}
      className="relative w-full py-12 md:py-20 select-none overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {!isExhibitionOpen ? (
          /* ==================================================================== */
          /* STATE 1: PROMINENT 3D INTERACTIVE KEYCAP BUTTON (REFERENCE INSPIRED) */
          /* ==================================================================== */
          <motion.div
            key="button-stage"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl mx-auto px-4"
          >
            {/* The Creative Editorial Frame (Inspired by 'Stop Scrolling!' Artwork) */}
            <div className="relative bg-gradient-to-br from-[#8B1A2C] via-[#A91F35] to-[#681020] rounded-[36px] sm:rounded-[48px] p-6 sm:p-12 md:p-16 border-4 border-[#E6A916]/40 shadow-[0_25px_60px_-15px_rgba(169,31,53,0.5),0_15px_30px_rgba(0,0,0,0.3)] overflow-hidden text-center">
              
              {/* ASCII / Matrix Dot Grid Texture Overlay */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #FAF6EE 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px'
                }}
              />

              {/* Decorative Geometric Shapes & Corner Crop Marks */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#E6A916] pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#E6A916] pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#E6A916] pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#E6A916] pointer-events-none" />

              {/* Pixel Art Blocks (Blue & Yellow) from Reference */}
              <div className="absolute left-6 bottom-10 hidden sm:flex flex-col gap-1 pointer-events-none opacity-85">
                <div className="w-5 h-5 bg-[#3B82F6] rounded-xs shadow-xs" />
                <div className="flex gap-1">
                  <div className="w-5 h-5 bg-[#E6A916] rounded-xs shadow-xs" />
                  <div className="w-5 h-5 bg-[#E6A916] rounded-xs shadow-xs" />
                </div>
              </div>

              <div className="absolute right-6 top-8 hidden sm:flex flex-col items-end gap-1 pointer-events-none opacity-80 text-white/50 font-mono text-[9px]">
                <span>#CURATED_ARCHIVE</span>
                <span>VERIFIED_RESULTS_2K25</span>
              </div>

              {/* Angled Typography Title Card (Reference Concept) */}
              <div className="relative z-10 max-w-xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/30 border border-white/20 text-[#E6A916] font-mono text-xs font-bold tracking-widest uppercase shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E6A916] animate-spin-slow" />
                  <span>OFFICIAL MERIT ROLL • 2K25</span>
                </div>

                <div className="relative inline-block px-4 py-2">
                  {/* Subtle Rotated Background Highlight */}
                  <div className="absolute inset-0 bg-[#E6A916]/20 rounded-2xl -rotate-1 border border-[#E6A916]/30 pointer-events-none" />
                  <h3 className="relative font-serif font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight drop-shadow-md">
                    Reveal The Results!
                  </h3>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-[#FAF6EE]/90 font-medium max-w-md mx-auto leading-relaxed">
                  Your feed doesn't show the full story. Step inside the official cinematic exhibition of all <strong>{totalCount}</strong> competition scorecards.
                </p>
              </div>

              {/* ============================================================ */}
              {/* THE 3D PHYSICAL MECHANICAL KEYCAP BUTTON                     */}
              {/* ============================================================ */}
              <div className="relative z-10 pt-8 sm:pt-10 pb-4 flex flex-col items-center justify-center">
                
                {/* Contact Drop Shadow on the Floor */}
                <div
                  className={`w-36 sm:w-48 h-10 sm:h-12 bg-black/55 blur-md rounded-full transition-all duration-200 ${
                    isKeyPressed ? 'scale-90 opacity-40 translate-y-2' : 'scale-100 opacity-60'
                  }`}
                />

                {/* The 3D Sculpted Mechanical Keycap */}
                <motion.button
                  onClick={handleOpenExhibition}
                  whileHover={{ y: -4, scale: 1.03 }}
                  animate={
                    isKeyPressed
                      ? { y: 14, scale: 0.96 }
                      : { y: [0, -6, 0] }
                  }
                  transition={
                    isKeyPressed
                      ? { duration: 0.12 }
                      : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
                  }
                  className="relative -mt-10 sm:-mt-12 group cursor-pointer focus:outline-none"
                  style={{ perspective: '1000px' }}
                >
                  {/* Outer Keycap Casing (Matte PBT Plastic with Sloped Walls) */}
                  <div
                    className="relative w-36 sm:w-48 h-32 sm:h-40 bg-gradient-to-b from-[#EFE9DF] via-[#DED6C7] to-[#B3A997] rounded-3xl sm:rounded-4xl p-2.5 sm:p-3.5 border-2 border-white/80 shadow-[0_20px_35px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.9)] transition-all duration-150"
                    style={{
                      transform: 'rotateX(18deg) rotateY(-4deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Keycap Beveled Top Surface */}
                    <div className="relative w-full h-full bg-gradient-to-b from-white via-[#FAF6EE] to-[#E6DFD1] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-stone-200 shadow-[inset_0_2px_6px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center space-y-1 sm:space-y-2 group-hover:from-white group-hover:to-[#FAF3E0] transition-colors">
                      
                      {/* Embossed Play / Next Mechanical Symbol (▶❚❚ in Crimson) */}
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[#A91F35] drop-shadow-[0_2px_3px_rgba(169,31,53,0.4)]">
                        {/* Play Triangle */}
                        <div
                          className="w-0 h-0 border-y-[10px] sm:border-y-[13px] border-y-transparent border-l-[16px] sm:border-l-[20px] border-l-[#A91F35] filter drop-shadow-xs"
                        />
                        {/* Double Vertical Bars (Pause/Step) */}
                        <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-[#A91F35] rounded-xs shadow-xs" />
                        <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-[#A91F35] rounded-xs shadow-xs" />
                      </div>

                      {/* Keycap Bottom Label */}
                      <span className="font-mono text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-stone-600 group-hover:text-[#A91F35] transition-colors">
                        START • {totalCount} SHEETS
                      </span>
                    </div>

                    {/* Subtle Top Specular Sheen */}
                    <div className="absolute top-1 inset-x-4 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 rounded-full pointer-events-none" />
                  </div>
                </motion.button>
              </div>

              {/* Bottom Micro Action Prompt */}
              <div className="relative z-10 pt-2 flex items-center justify-center gap-2 text-white/80 font-mono text-xs font-semibold">
                <span>Click the key to start exhibition</span>
                <ArrowRight className="w-4 h-4 text-[#E6A916] animate-pulse" />
              </div>
            </div>
          </motion.div>
        ) : (
          /* ==================================================================== */
          /* STATE 2: CINEMATIC ONE-BY-ONE POSTER EXHIBITION GALLERY             */
          /* ==================================================================== */
          <motion.div
            key="exhibition-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl mx-auto px-3 sm:px-4 space-y-4"
          >
            {/* Top Presentation Bar */}
            <div className="bg-stone-900 text-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-stone-800 shadow-xl flex items-center justify-between gap-3">
              
              {/* Counter Pill (01 / 55) */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="px-3 py-1 rounded-xl bg-[#A91F35] border border-[#E6A916]/40 flex items-center gap-1.5 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span className="font-mono text-xs sm:text-sm font-black text-white">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
                  </span>
                </div>
                <div className="hidden sm:block text-left truncate max-w-xs">
                  <span className="font-serif font-bold text-xs text-stone-200 block truncate">
                    {currentPoster?.title || `Result Sheet #${currentIndex + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {currentPoster?.folder}
                  </span>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <a
                  href={encodeURI(currentPoster?.src || '')}
                  download={currentPoster?.filename || `Result_Sheet_${currentIndex + 1}.png`}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Download Original Poster"
                >
                  <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span className="hidden md:inline">Download</span>
                </a>

                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white transition-colors"
                  title="Zoom / Full View"
                >
                  {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleClose}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-red-900/60 text-white transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                  title="Close Exhibition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>

            {/* Main Stage: The One Floating Exhibition Poster */}
            <div className="relative w-full min-h-[460px] sm:min-h-[580px] md:min-h-[640px] bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 border border-stone-800 shadow-2xl flex items-center justify-center overflow-hidden">
              
              {/* Soft Ambient Spotlight Behind Poster */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-[#E6A916]/10 rounded-full blur-3xl" />
              </div>

              {/* Completion Screen (Shown when all 55 posters are viewed) */}
              {isCompleted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-6 sm:p-10 space-y-5 max-w-md mx-auto z-10"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#E6A916] to-amber-200 flex items-center justify-center shadow-lg">
                    <Trophy className="w-10 h-10 text-[#A91F35]" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#E6A916] uppercase block">
                      ARCHIVE EXHIBITION COMPLETE
                    </span>
                    <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
                      All {totalCount} Result Sheets Explored!
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300">
                      You have viewed every official competition score sheet from DALENZIA 2K25.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleRestart}
                      className="px-5 py-2.5 rounded-full bg-[#E6A916] text-[#A91F35] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Review from Sheet 01</span>
                    </button>

                    <button
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Exit Exhibition</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* The Singular Uncropped Result Poster Frame */
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentPoster?.id || currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative z-10 flex flex-col items-center justify-center max-w-full max-h-full cursor-zoom-in"
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    {/* The Poster Artwork (Strictly uncropped, object-contain) */}
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border-2 border-stone-700/60 bg-stone-950 p-1 group">
                      <img
                        src={currentPoster?.src}
                        alt={currentPoster?.title || `Result Sheet ${currentIndex + 1}`}
                        className="max-h-[460px] sm:max-h-[560px] md:max-h-[600px] w-auto max-w-full object-contain rounded-xl transition-transform duration-300"
                        loading="eager"
                      />

                      {/* Gentle Hover Hint */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-xl">
                        <span className="px-3 py-1.5 rounded-full bg-black/80 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg border border-white/20">
                          <Eye className="w-3.5 h-3.5 text-[#E6A916]" />
                          <span>Click to expand view</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Bottom Navigation Toolbar */}
            <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0 && !isCompleted}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  currentIndex === 0 && !isCompleted
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-[#A91F35] hover:bg-[#8d182b] text-white shadow-md active:scale-95'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Poster</span>
              </button>

              {/* Interactive Scrub Timeline */}
              <div className="flex-1 w-full max-w-md flex flex-col items-center gap-1 px-2">
                <input
                  type="range"
                  min="0"
                  max={totalCount - 1}
                  value={currentIndex}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value, 10);
                    if (!isNaN(idx)) {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                      setIsCompleted(false);
                    }
                  }}
                  className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#E6A916]"
                />
                <span className="text-[10px] font-mono text-stone-400">
                  Drag timeline or use Left / Right arrows
                </span>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E6A916] hover:bg-[#d89e13] text-[#A91F35] font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span>{currentIndex === totalCount - 1 ? 'Finish & Summary' : 'Next Poster'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* FULLSCREEN / ZOOM PREVIEW MODAL                                      */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isZoomed && currentPoster && (
          <div
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[92vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentPoster.src}
                alt={currentPoster.title}
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
              <div className="mt-3 flex items-center justify-between w-full text-white text-xs px-2">
                <span className="font-serif font-bold text-[#E6A916]">
                  {currentPoster.title} ({currentIndex + 1} of {totalCount})
                </span>
                <a
                  href={encodeURI(currentPoster.src)}
                  download={currentPoster.filename}
                  className="flex items-center gap-1 hover:text-[#E6A916] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
