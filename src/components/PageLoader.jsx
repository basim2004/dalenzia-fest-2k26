import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PageLoader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 420);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse 75% 65% at 50% 46%, #7A1222 0%, #520B16 55%, #35050D 100%)',
      }}
    >
      {/* Subtle warm center ambient aura */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#E6A916]/15 via-[#F2BA3B]/10 to-transparent blur-3xl opacity-75" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-xl w-full">
        {/* Main 3D DALENZIA Brand Presentation */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 0.92,
                  rotateX: 8,
                  y: 16,
                }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: [0.92, 1.02, 1.0],
                  rotateX: [8, -1.5, 0],
                  y: [16, -2, 0],
                }
          }
          transition={{
            duration: 1.8,
            times: [0, 0.65, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative flex flex-col items-center justify-center [perspective:1200px]"
        >
          {/* Official 3D Extruded Logo */}
          <div className="relative overflow-hidden py-3 px-4 flex items-center justify-center">
            <img
              src="/assets/brand/dalenzia_3d_official_logo.png"
              alt="DALENZIA"
              className="w-full max-w-[280px] sm:max-w-[420px] md:max-w-[480px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_22px_36px_rgba(0,0,0,0.65)] drop-shadow-[0_6px_14px_rgba(230,169,22,0.22)]"
              style={{ maxWidth: 'min(80vw, 420px)', maxHeight: '200px', height: 'auto', objectFit: 'contain' }}
            />

            {/* Subtle Metallic Sheen Sweep */}
            {!shouldReduceMotion && (
              <motion.div
                initial={{ x: '-140%', opacity: 0 }}
                animate={{ x: '240%', opacity: [0, 0.6, 0] }}
                transition={{ delay: 0.55, duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
              />
            )}
          </div>

          {/* Realistic Floor Reflection / Ambient Shadow */}
          <div
            className="w-44 sm:w-64 h-3 mx-auto -mt-2 bg-black/45 rounded-full blur-md pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>

        {/* Refined Minimalist Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-44 sm:w-56 mt-8 flex flex-col items-center"
        >
          <div className="w-full h-[3px] bg-black/35 rounded-full overflow-hidden border border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
            <div
              className="h-full bg-gradient-to-r from-[#C98B1A] via-[#F5C242] to-[#FFE28A] rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(245,194,66,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Clean Percentage Counter */}
          <div className="mt-2.5 text-[11px] font-mono tracking-widest text-[#FFF0B3]/80 font-medium">
            {progress}%
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
