import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('sand'); // 'sand' -> 'logo' -> 'exit'

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 4;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 60 && stage === 'sand') {
      setStage('logo');
    }
    if (progress >= 100) {
      setTimeout(() => {
        onFinish();
      }, 500);
    }
  }, [progress, stage, onFinish]);

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

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Animated Hourglass / Logo */}
        <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, 180, 180, 360],
              scale: [1, 1.06, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
            className="w-24 h-24"
          >
            <img
              src="/assets/golden_hourglass.png"
              alt="Dalenzia Hourglass"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Falling sand golden particles */}
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6A916] animate-ping opacity-75" />
          </div>
        </div>

        {/* Festival Branding */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="inline-block px-3 py-1 bg-[#E6A916] text-[#A91F35] text-[11px] font-bold tracking-widest uppercase rounded-full shadow-md">
            Second Edition · 2K26
          </div>
          <h1 className="text-3xl font-serif tracking-wider text-[#F7F3E9] pt-2">
            DALENZIA
          </h1>
          <p className="text-sm tracking-[0.25em] text-[#E6A916] font-semibold">
            NUEVA ERA
          </p>
          <p className="text-xs text-white/70 tracking-wide pt-1">
            Dalailussunna Dars, Ayiroor
          </p>
        </motion.div>

        {/* Progress bar & percentage */}
        <div className="w-48 mt-8">
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E6A916] to-[#FFF0B3] rounded-full shadow-[0_0_10px_#E6A916]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-white/60 tracking-wider mt-2 font-mono">
            <span>ENTERING NUEVA ERA</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
