import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export default function PWAUpdateToast({ isOpen, onUpdate, onDismiss }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-[9999] pointer-events-auto"
        >
          <div className="bg-[#1c1917] text-white p-4 rounded-2xl shadow-2xl border-2 border-[#E6A916]/50 flex items-center gap-3.5 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-[#A91F35] flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-[#E6A916] animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white font-serif">
                New Update Available
              </h4>
              <p className="text-[11px] text-stone-300 line-clamp-1">
                Refresh to load the latest schedule, results and features.
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onUpdate}
                className="px-3.5 py-1.5 rounded-xl bg-[#E6A916] hover:bg-[#ffd166] text-[#A91F35] text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="w-7 h-7 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
