import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PageLoader({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 22);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        onFinish();
      }, 450);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#A91F35] text-white px-6 overflow-hidden select-none"
    >
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <img
          src="/assets/mandala.png"
          alt=""
          className="w-[120vw] max-w-[600px] h-auto animate-spin-slow"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        {/* Premium 3D Logo Composition */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.86,
            rotateX: 14,
            y: 20,
            filter: 'brightness(0.7) drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
          }}
          animate={{
            opacity: 1,
            scale: [0.86, 1.04, 1.0],
            rotateX: [14, -2, 0],
            y: [20, -4, 0],
            filter: [
              'brightness(0.7) drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
              'brightness(1.22) drop-shadow(0 25px 40px rgba(230,169,22,0.55))',
              'brightness(1.0) drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
            ],
          }}
          transition={{
            duration: 2.2,
            times: [0, 0.65, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mb-5 flex flex-col items-center justify-center [perspective:1000px]"
        >
          {/* 3D Extruded Logo Image with Sheen Light Ray */}
          <div className="relative overflow-hidden group py-2 px-3">
            <img
              src="/assets/dalenzia_3d_composition_perfect.png"
              alt="DALENZIA FEST 2K26 - NUEVA ERA"
              className="w-full max-w-[420px] sm:max-w-[500px] md:max-w-[560px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.55)]"
            />

            {/* Premium Metallic Sheen Sweep */}
            <motion.div
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '240%', opacity: [0, 0.75, 0] }}
              transition={{ delay: 0.6, duration: 1.3, ease: 'easeInOut' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
            />
          </div>

          {/* Golden glow shimmer effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.3] }}
            transition={{ delay: 0.5, duration: 1.6 }}
            className="absolute inset-0 -z-10 bg-radial from-[#E6A916]/25 to-transparent blur-2xl pointer-events-none"
          />
        </motion.div>

        {/* Festival Sub-Branding: Golden Pill Badge flanked by accent lines */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center space-y-2 w-full"
        >
          <div className="flex items-center justify-center gap-3 w-full max-w-md">
            <div className="h-[2px] flex-1 max-w-[60px] sm:max-w-[80px] bg-gradient-to-r from-transparent to-[#E6A916]" />
            <div className="px-5 py-1.5 bg-gradient-to-r from-[#b88209] via-[#E6A916] to-[#b88209] text-[#7e1425] text-[11px] sm:text-xs font-black tracking-widest uppercase rounded-full shadow-[0_4px_16px_rgba(230,169,22,0.4)] border border-[#FFF0B3]/50">
              SECOND EDITION · 2K26
            </div>
            <div className="h-[2px] flex-1 max-w-[60px] sm:max-w-[80px] bg-gradient-to-l from-transparent to-[#E6A916]" />
          </div>

          <p className="text-xs sm:text-sm text-white/90 tracking-wide font-medium drop-shadow">
            Dalailussunna Dars, Ayiroor
          </p>
        </motion.div>

        {/* Golden Glowing Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-56 sm:w-72 mt-7"
        >
          <div className="w-full h-2 bg-black/35 border border-[#E6A916]/50 rounded-full overflow-hidden p-[2px] shadow-[0_0_12px_rgba(230,169,22,0.25)]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#b88209] via-[#E6A916] to-[#FFF0B3] rounded-full shadow-[0_0_12px_#E6A916]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-white/80 tracking-widest mt-2 font-mono">
            <span>ENTERING NUEVA ERA</span>
            <span className="text-[#FFF0B3] font-bold">{progress}%</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
