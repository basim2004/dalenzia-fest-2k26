import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, Trophy, Star, Sparkles, CheckCircle2,
  Calendar, MapPin, Printer, Download, Eye, X,
  ShieldCheck, AlertCircle
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentResults({ studentSession }) {
  const [results, setResults] = useState([]);
  const [selectedAward, setSelectedAward] = useState(null);

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentPublishedResults(studentId);
      setResults(data);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const totalPoints = results.reduce((acc, r) => acc + (r.points || 0), 0);

  return (
    <div className="space-y-6">
      {/* Laurels Summary Banner */}
      <div className="bg-[#A91F35] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs uppercase tracking-wider">
                Official Certified Laurels
              </span>
              <span className="text-xs text-white/80 font-mono">
                21, 22, 23 DECEMBER 2026
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              My Official Results & Laurels
            </h2>
            <p className="text-xs text-white/80 max-w-xl leading-relaxed">
              Officially published placements ratified by the Festival Convener Secretariat for Chest No: <strong className="font-mono text-[#E6A916]">{studentSession?.chestNo}</strong>. Draft judge marks remain strictly confidential.
            </p>
          </div>

          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 text-right shrink-0">
            <div className="text-[10px] text-white/60 uppercase font-black tracking-wider">
              Total Points Earned
            </div>
            <div className="text-3xl font-serif font-black text-[#E6A916]">
              {totalPoints} <span className="text-sm font-sans text-white/80">pts</span>
            </div>
            <div className="text-[11px] text-white/70">
              {results.length} Certified Podiums
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-2xs">
          <Award className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif font-black text-stone-800">No published results yet</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Evaluations are under adjudication by official scholars. Once the Festival Convener approves and publishes the official results, your awards and laurels will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((res, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border-2 border-[#E6A916]/50 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#A91F35] text-white font-serif font-black text-xs flex items-center gap-1.5 shadow-2xs">
                    <Award className="w-3.5 h-3.5 text-[#E6A916]" />
                    <span>{res.badge}</span>
                  </span>

                  <div className="text-right">
                    <span className="text-sm font-serif font-black text-[#A91F35]">
                      +{res.points} pts
                    </span>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {res.competitionCode}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-black text-base text-stone-900 leading-snug">
                    {res.competitionTitle}
                  </h3>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {res.category} Arena • {res.venue}
                  </div>
                </div>

                <div className="bg-[#F7F3E9] p-3.5 rounded-2xl border border-stone-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Official Score:</span>
                    <span className="font-bold text-stone-900">{res.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Official Grade:</span>
                    <span className="font-bold text-stone-900">{res.grade || 'Pending Admin Cutoffs'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Award Position:</span>
                    <span className="font-bold text-[#A91F35]">{res.position}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Points Contributed:</span>
                    <span className="font-bold text-emerald-700">+{res.points || 0} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Published Date:</span>
                    <span className="font-mono text-stone-600">{res.publishedAt}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAward(res)}
                className="w-full py-2.5 bg-[#A91F35] hover:bg-[#8e172a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>View Certificate of Honour</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedAward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-4 border-[#E6A916]/60 shadow-2xl relative text-center"
            >
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-10 w-auto mx-auto mb-2">
                <img
                  src="/assets/dalenzia_fest_logo.png"
                  alt="Dalenzia Fest"
                  className="h-full w-auto object-contain mx-auto"
                />
              </div>

              <div className="text-[10px] font-black uppercase tracking-widest text-[#A91F35] mb-2">
                Certificate of Academic & Cultural Excellence
              </div>

              <h3 className="text-xl font-serif font-black text-stone-900 mb-4">
                DALENZIA FEST 2K26 – NUEVA ERA
              </h3>

              <div className="p-5 bg-[#F7F3E9] rounded-2xl border border-stone-200/80 my-4 space-y-2 text-xs text-stone-700 leading-relaxed">
                <p>
                  This certifies that <strong>{studentSession?.name}</strong> (Chest No: <strong className="font-mono text-[#A91F35]">{studentSession?.chestNo}</strong>) representing <strong>{studentSession?.teamName}</strong> has achieved
                </p>
                <div className="text-lg font-serif font-black text-[#A91F35] py-1">
                  {selectedAward.badge}
                </div>
                <p>
                  in the competition <strong>{selectedAward.competitionTitle}</strong> with a verified final score of <strong>{selectedAward.score}</strong>.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-left text-[10px] text-stone-500">
                <div>
                  <div className="font-bold text-stone-800">Usthad Hashir Ali</div>
                  <div>Festival Convener</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-800">Dalailussunna Dars</div>
                  <div>Ayiroor, Kerala</div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedAward(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#A91F35] text-white font-bold hover:bg-[#8e172a] text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
