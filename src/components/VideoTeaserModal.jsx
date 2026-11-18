import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

export default function VideoTeaserModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-[#1c1917] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#A91F35] text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E6A916]" />
              <span className="font-serif font-bold text-sm">
                Dalenzia Fest 2K26 · Official Theme Teaser
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            <video
              src="/assets/teaser.mp4"
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
