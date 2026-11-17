import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import readingData from '../data/reading.json';

export default function ReadingSection({ lang }) {
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <section className="max-w-md mx-auto px-4 py-8">
      {/* Eyebrow & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-3 h-3 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Festival Souvenir & Literature' : 'വായനമുറി'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#A91F35]">
          {lang === 'en' ? 'Recommended Reading' : 'പ്രത്യേക ലേഖനങ്ങൾ'}
        </h2>
        <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
          {lang === 'en'
            ? 'Curated perspectives on Nueva Era, Dars history, and aesthetics'
            : 'ന്യൂവ എറയുടെ ആശയങ്ങളെക്കുറിച്ചുള്ള ചിന്തകൾ'}
        </p>
      </div>

      <div className="space-y-3">
        {readingData.articles.map((art, idx) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => setActiveArticle(art)}
            className="bg-white rounded-2xl p-4 border border-[#A91F35]/10 shadow-sm cursor-pointer hover:border-[#A91F35]/30 transition-all group"
          >
            <div className="flex items-center justify-between text-[10px] text-stone-500 font-semibold mb-1">
              <span className="text-[#A91F35] uppercase tracking-wider">
                {art.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E6A916]" />
                {art.readTime}
              </span>
            </div>

            <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-[#A91F35] transition-colors leading-snug">
              {lang === 'en' ? art.title : art.malayalam}
            </h3>

            <p className="text-xs text-stone-600 line-clamp-2 mt-1">
              {art.snippet}
            </p>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100 text-[11px]">
              <span className="text-stone-500 font-medium">{art.author}</span>
              <span className="text-[#A91F35] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Article Detail Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-[#1c1917]"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
                {activeArticle.category}
              </span>

              <h3 className="text-lg font-serif font-bold text-[#A91F35] mt-2 leading-snug">
                {lang === 'en' ? activeArticle.title : activeArticle.malayalam}
              </h3>

              <p className="text-xs text-stone-500 font-medium mt-1 mb-4">
                By {activeArticle.author} · {activeArticle.readTime}
              </p>

              <div className="text-xs text-stone-700 space-y-3 leading-relaxed border-t border-stone-100 pt-3 max-h-[50vh] overflow-y-auto pr-1">
                <p>{activeArticle.snippet}</p>
                <p>
                  As Dalailussunna Dars prepares for its second grand fest, Dalenzia 2K26, the community in Ayiroor and across Malappuram gathers to reflect on how classical wisdom illuminates the uncharted paths of tomorrow.
                </p>
                <p>
                  From Arabic calligraphy to competitive spoken eloquence, every art form presented in this festival embodies the spirit of Nueva Era: retaining sacred roots while speaking the dynamic language of modern youth.
                </p>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="w-full mt-4 py-2.5 px-4 bg-[#A91F35] text-white font-bold text-xs rounded-xl hover:bg-[#8e192c] transition-colors"
              >
                Done Reading
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
