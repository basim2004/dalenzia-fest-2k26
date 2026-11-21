import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Eye, X, Award,
  Sparkles, Calendar, CheckCircle2
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentPosters() {
  const [posters, setPosters] = useState([]);
  const [activePoster, setActivePoster] = useState(null);

  useEffect(() => {
    try {
      const data = festivalStore.getPosters ? festivalStore.getPosters() : [];
      const published = data.filter((p) => p.status === 'Published' || p.isPublished);
      setPosters(published.length > 0 ? published : festivalStore.data?.resultPosters || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Official Posters & Circular Downloads
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Download ratified result posters, ceremonial banners, and official festival publications.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#E6A916]/20 text-[#A91F35] font-bold text-xs">
          {posters.length} Published Posters
        </span>
      </div>

      {/* Posters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posters.map((pos) => (
          <div
            key={pos.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Poster Thumbnail / Styling preview */}
            <div className="bg-gradient-to-br from-[#A91F35] to-[#7f1324] text-white p-6 aspect-4/3 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black uppercase">
                  {pos.category || 'Result Poster'}
                </span>
                <span className="text-[10px] text-white/70 font-mono">
                  {pos.competitionCode || pos.id}
                </span>
              </div>

              <div className="z-10 text-center py-2">
                <div className="text-lg font-serif font-black tracking-tight leading-snug">
                  {pos.competitionTitle || pos.title || 'Dalenzia Fest Official'}
                </div>
                <div className="text-[11px] text-[#E6A916] font-bold mt-1">
                  DALENZIA FEST 2K26 – NUEVA ERA
                </div>
              </div>

              <div className="z-10 flex items-center justify-between text-[10px] text-white/70 border-t border-white/10 pt-2">
                <span>{pos.date || '21, 22, 23 DECEMBER 2026'}</span>
                <span>{pos.venue || 'Bukhari Auditorium'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center justify-between gap-2 border-t border-stone-100">
              <button
                onClick={() => setActivePoster(pos)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => {
                  alert(`Downloading high-resolution poster for ${pos.competitionTitle || pos.title}...`);
                }}
                className="px-3 py-2 bg-[#A91F35] hover:bg-[#8e172a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {activePoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl relative"
            >
              <button
                onClick={() => setActivePoster(null)}
                className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif font-black text-base text-stone-900 mb-2">
                {activePoster.competitionTitle || activePoster.title}
              </h3>

              <div className="bg-gradient-to-br from-[#A91F35] to-[#6d111f] text-white p-6 rounded-2xl my-3 text-center space-y-4">
                <div className="text-xs text-[#E6A916] font-black uppercase tracking-widest">
                  Official Ratified Result Poster
                </div>
                <div className="text-xl font-serif font-black">
                  {activePoster.competitionTitle}
                </div>

                {activePoster.firstPrize && (
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
                    <div className="text-[#E6A916] font-bold">🥇 1st Prize Winner</div>
                    <div className="font-bold text-sm">{activePoster.firstPrize.name} ({activePoster.firstPrize.chestNo})</div>
                    <div className="text-white/80">{activePoster.firstPrize.teamName} • Score: {activePoster.firstPrize.score}</div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => setActivePoster(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#A91F35] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
