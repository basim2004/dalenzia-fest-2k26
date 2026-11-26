import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, X, Check } from 'lucide-react';

export default function IOSInstallModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#A91F35]/20 overflow-hidden relative text-[#1c1917]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/icon-192x192.png"
                  alt="Dalenzia Fest App Icon"
                  className="w-12 h-12 rounded-2xl shadow-md border border-[#E6A916]/40 object-cover"
                />
                <div>
                  <h3 className="text-base font-serif font-black text-[#A91F35]">
                    Install Dalenzia Fest
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold">
                    Add to iPhone / iPad Home Screen
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step-by-step iOS Instructions */}
            <div className="py-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#A91F35]/10 text-[#A91F35] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-stone-800">
                    Tap the <span className="inline-flex items-center gap-1 font-black text-[#A91F35]"><Share className="w-3.5 h-3.5 inline" /> Share</span> button
                  </p>
                  <p className="text-stone-500">
                    Look at the bottom toolbar in Safari (or top right on iPad).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#A91F35]/10 text-[#A91F35] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-stone-800">
                    Select <span className="inline-flex items-center gap-1 font-black text-[#A91F35]"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</span>
                  </p>
                  <p className="text-stone-500">
                    Scroll down through the share sheet options.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-[#A91F35]/10 text-[#A91F35] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-stone-800">
                    Tap <span className="font-black text-[#A91F35]">Add</span> in the top right
                  </p>
                  <p className="text-stone-500">
                    The official 3D Dalenzia app icon will appear on your Home Screen!
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom confirmation */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8d182b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Got it</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
