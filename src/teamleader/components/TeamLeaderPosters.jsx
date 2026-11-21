import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Eye,
  X,
  Award,
  Sparkles,
  Trophy,
  Calendar
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderPosters() {
  const [posters, setPosters] = useState(() => festivalStore.getPosters());
  const [resultPosters, setResultPosters] = useState(() => festivalStore.getPublishedResultPosters());
  const [activeTab, setActiveTab] = useState('results'); // 'results' | 'general'
  const [previewPoster, setPreviewPoster] = useState(null);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setPosters(festivalStore.getPosters());
      setResultPosters(festivalStore.getPublishedResultPosters());
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Official Media & Downloads
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Festival Posters & Certified Result Sheets
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Download high-resolution official result posters, championship bulletins, and stage schedules for your squad.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-[#F7F3E9] p-1.5 rounded-2xl border border-stone-200 flex items-center gap-1">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'results' ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Official Result Posters ({resultPosters.length})
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'general' ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            Festival Circulars ({posters.length})
          </button>
        </div>
      </div>

      {/* Grid */}
      {activeTab === 'results' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resultPosters.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
              No official result posters published yet.
            </div>
          ) : (
            resultPosters.map(poster => (
              <div
                key={poster.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-5 bg-linear-to-br from-[#A91F35] to-[#7f1525] text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#E6A916]">
                      {poster.category || 'Official Result'}
                    </span>
                    <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md">
                      {poster.competitionCode}
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-base text-white leading-tight">
                    {poster.competitionTitle}
                  </h3>
                  <div className="text-[10px] text-white/70">Published: {poster.publishedAt}</div>
                </div>

                {/* Podium Summary */}
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span>🥇 1st: {poster.firstPrize?.name || '—'}</span>
                    <span className="font-mono text-[#A91F35]">{poster.firstPrize?.score}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-700 font-medium">
                    <span>🥈 2nd: {poster.secondPrize?.name || '—'}</span>
                    <span className="font-mono">{poster.secondPrize?.score}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 font-medium">
                    <span>🥉 3rd: {poster.thirdPrize?.name || '—'}</span>
                    <span className="font-mono">{poster.thirdPrize?.score}</span>
                  </div>
                </div>

                <div className="p-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewPoster(poster)}
                    className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Sheet</span>
                  </button>

                  <a
                    href="/assets/dalenzia_fest_logo.png"
                    download={`${poster.competitionCode}_Result_Poster.png`}
                    className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posters.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="aspect-16/9 bg-stone-100 flex items-center justify-center relative overflow-hidden">
                <img
                  src={p.previewUrl || p.fileUrl || '/assets/dalenzia_fest_logo.png'}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/assets/dalenzia_fest_logo.png'; }}
                />
              </div>

              <div className="p-4 space-y-1">
                <div className="text-[10px] font-black uppercase text-[#A91F35]">{p.category}</div>
                <h3 className="font-bold text-stone-900 text-sm">{p.title}</h3>
                <div className="text-[10px] text-stone-500 font-mono">Format: {p.format || 'High Res PNG'}</div>
              </div>

              <div className="p-4 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={p.fileUrl || '/assets/dalenzia_fest_logo.png'}
                  download={`${p.title}.png`}
                  className="w-full py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Poster</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Result Poster Preview Modal */}
      <AnimatePresence>
        {previewPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200"
            >
              <div className="p-5 bg-[#A91F35] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-base">{previewPoster.competitionTitle}</h3>
                  <p className="text-[11px] text-[#E6A916]">{previewPoster.competitionCode} • Certified Adjudication</p>
                </div>
                <button
                  onClick={() => setPreviewPoster(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="text-center space-y-1 border-b border-stone-100 pb-3">
                  <div className="text-[10px] font-mono text-stone-400">VENUE: {previewPoster.venue}</div>
                  <div className="font-bold text-stone-800">Date: {previewPoster.date} • Published: {previewPoster.publishedAt}</div>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-amber-800 uppercase">🥇 FIRST PRIZE</div>
                      <div className="font-bold text-stone-900 text-sm">{previewPoster.firstPrize?.name}</div>
                      <div className="text-[10px] text-stone-500">{previewPoster.firstPrize?.teamName} (Chest: {previewPoster.firstPrize?.chestNo})</div>
                    </div>
                    <div className="font-mono font-bold text-[#A91F35]">{previewPoster.firstPrize?.score}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-stone-100 border border-stone-300 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-stone-700 uppercase">🥈 SECOND PRIZE</div>
                      <div className="font-bold text-stone-900 text-sm">{previewPoster.secondPrize?.name}</div>
                      <div className="text-[10px] text-stone-500">{previewPoster.secondPrize?.teamName} (Chest: {previewPoster.secondPrize?.chestNo})</div>
                    </div>
                    <div className="font-mono font-bold text-stone-800">{previewPoster.secondPrize?.score}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-100/50 border border-amber-300 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-amber-900 uppercase">🥉 THIRD PRIZE</div>
                      <div className="font-bold text-stone-900 text-sm">{previewPoster.thirdPrize?.name}</div>
                      <div className="text-[10px] text-stone-500">{previewPoster.thirdPrize?.teamName} (Chest: {previewPoster.thirdPrize?.chestNo})</div>
                    </div>
                    <div className="font-mono font-bold text-stone-800">{previewPoster.thirdPrize?.score}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewPoster(null)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
