import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Scroll,
  Feather,
  Bookmark,
  Share2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MALABAR_HERITAGE_ARTICLES } from '../../data/malabarHeritageArticles';

export default function HeritageArticlesSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
    // Prevent background body scroll when reader modal is active
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  const handleNextArticle = () => {
    if (!selectedArticle) return;
    const currentIndex = MALABAR_HERITAGE_ARTICLES.findIndex((a) => a.id === selectedArticle.id);
    const nextIndex = (currentIndex + 1) % MALABAR_HERITAGE_ARTICLES.length;
    setSelectedArticle(MALABAR_HERITAGE_ARTICLES[nextIndex]);
  };

  const handlePrevArticle = () => {
    if (!selectedArticle) return;
    const currentIndex = MALABAR_HERITAGE_ARTICLES.findIndex((a) => a.id === selectedArticle.id);
    const prevIndex = (currentIndex - 1 + MALABAR_HERITAGE_ARTICLES.length) % MALABAR_HERITAGE_ARTICLES.length;
    setSelectedArticle(MALABAR_HERITAGE_ARTICLES[prevIndex]);
  };

  const handleCopyCitation = (text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="pt-16 md:pt-24 border-t border-[#A91F35]/15 space-y-12">
      {/* Editorial Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto text-center space-y-4 px-4"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#A91F35]/20 shadow-2xs">
          <Scroll className="w-3.5 h-3.5 text-[#A91F35]" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
            HISTORICAL ANTHOLOGY
          </span>
        </div>

        <h3 className="text-3xl md:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight">
          Malabar Islamic Heritage & <span className="text-[#A91F35]">The Dars Tradition</span>
        </h3>

        <p className="text-sm md:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Explore five historically grounded editorial treatises chronicling the mosque-seminaries of Malabar, the intellectual lighthouse of Ponnani, classical manuscripts, and the living continuum of sacred scholarship in modern Kerala.
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-stone-500 pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Verified Archival Sources
          </span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center gap-1.5">
            <Feather className="w-4 h-4 text-[#A91F35]" />
            Scholarly Citations & Footnotes
          </span>
        </div>
      </motion.div>

      {/* Featured 5-Article Magazine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {MALABAR_HERITAGE_ARTICLES.map((article, idx) => {
          const isLargeFeatured = idx === 0 || idx === 1;

          return (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
              className={`group flex flex-col justify-between bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-[#A91F35]/35 transition-all duration-300 overflow-hidden ${
                isLargeFeatured && idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div>
                {/* Authentic Archival Image Card Header with Smooth Image Reveal */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <motion.img
                    src={article.image.url}
                    alt={article.title}
                    initial={{ scale: 1.06 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badge: Category & Period */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#A91F35] text-white shadow-md">
                      {article.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-200 border border-white/20">
                      {article.period}
                    </span>
                  </div>

                  {/* Image Source Attribution Pill */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-white/80">
                    <span className="truncate pr-2 font-mono text-[9px] bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      {article.image.credit}
                    </span>
                    <span className="shrink-0 flex items-center gap-1 font-bold text-amber-300">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Article Card Body */}
                <div className="p-6 sm:p-7 space-y-3">
                  <div className="text-[11px] font-bold text-[#A91F35] uppercase tracking-wider flex items-center gap-1.5">
                    <span>Part {idx + 1} of 5</span>
                    <span className="text-stone-300">•</span>
                    <span>Historical Monograph</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-serif font-black text-stone-900 group-hover:text-[#A91F35] transition-colors leading-snug">
                    {article.title}
                  </h4>

                  <p className="text-xs font-semibold text-stone-500 line-clamp-1 italic">
                    {article.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer: Read More Action */}
              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => handleOpenArticle(article)}
                  className="w-full py-3 px-4 rounded-2xl bg-stone-50 hover:bg-[#A91F35] text-stone-800 hover:text-white font-bold text-xs flex items-center justify-between transition-all duration-200 border border-stone-200/80 hover:border-[#A91F35] cursor-pointer group/btn"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#A91F35] group-hover/btn:text-white transition-colors" />
                    Read Full Article
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* FULL EDITORIAL ARTICLE READER MODAL OVERLAY                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 sm:my-8 text-stone-900"
            >
              {/* Sticky Top Reader Navigation Bar */}
              <div className="sticky top-0 z-30 bg-[#F7F3E9]/95 backdrop-blur-md border-b border-stone-200 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#A91F35] text-white flex items-center justify-center font-serif font-black text-sm">
                    {MALABAR_HERITAGE_ARTICLES.findIndex((a) => a.id === selectedArticle.id) + 1}
                  </div>
                  <div>
                    <h5 className="font-serif font-black text-xs sm:text-sm text-stone-900 truncate max-w-[200px] sm:max-w-md">
                      {selectedArticle.title}
                    </h5>
                    <span className="text-[10px] text-stone-500 font-semibold block">
                      Malabar Islamic Heritage • {selectedArticle.readTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCitation(window.location.href)}
                    className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-[#A91F35] hover:border-[#A91F35] transition-all cursor-pointer text-xs flex items-center gap-1.5"
                    title="Copy Article Link"
                  >
                    {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span className="hidden sm:inline text-[11px] font-bold">
                      {copiedLink ? 'Link Copied' : 'Share'}
                    </span>
                  </button>

                  <button
                    onClick={handleCloseArticle}
                    className="p-2 rounded-xl bg-stone-200/80 hover:bg-[#A91F35] hover:text-white text-stone-700 transition-all cursor-pointer"
                    title="Close Reader"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reader Scrollable Container */}
              <div className="p-6 sm:p-10 md:p-12 space-y-8 max-h-[85vh] overflow-y-auto">
                {/* Article Header Metadata */}
                <div className="space-y-4 border-b border-stone-200 pb-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-[#A91F35] text-white uppercase text-[10px] tracking-wider">
                      {selectedArticle.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px]">
                      Epoch: {selectedArticle.period}
                    </span>
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500 font-medium">{selectedArticle.readTime}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight">
                    {selectedArticle.title}
                  </h1>

                  <p className="text-base sm:text-xl font-serif italic text-stone-600 leading-relaxed">
                    {selectedArticle.subtitle}
                  </p>

                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-l-4 border-[#A91F35] text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                    <strong>Editorial Summary:</strong> {selectedArticle.lead}
                  </div>
                </div>

                {/* Primary Authentic Archival Photograph with Verified Source Box */}
                <div className="rounded-3xl overflow-hidden border border-stone-300 bg-white shadow-md">
                  <div className="relative aspect-[16/9] sm:aspect-[21/10] bg-stone-100">
                    <img
                      src={selectedArticle.image.url}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption & Complete Verification Attribution */}
                  <div className="p-5 sm:p-6 bg-stone-50 border-t border-stone-200 space-y-3">
                    <p className="text-xs sm:text-sm font-serif text-stone-800 leading-relaxed">
                      <strong>Figure:</strong> {selectedArticle.image.caption}
                    </p>

                    <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-stone-500">
                      <div className="space-y-1">
                        <div>
                          <strong className="text-stone-700">Source:</strong>{' '}
                          <a
                            href={selectedArticle.image.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#A91F35] hover:underline inline-flex items-center gap-1 font-semibold"
                          >
                            <span>{selectedArticle.image.sourceName}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div>
                          <strong className="text-stone-700">Attribution & License:</strong> {selectedArticle.image.credit} •{' '}
                          <span className="font-mono text-[10px]">{selectedArticle.image.license}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Authentic Image</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Article Content Body */}
                <div className="prose prose-stone max-w-none space-y-8 text-stone-800 leading-relaxed text-sm sm:text-base">
                  {selectedArticle.content.map((sec, sIdx) => (
                    <section key={sIdx} className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-900 border-b border-stone-200/60 pb-2">
                        {sec.heading}
                      </h3>
                      <div className="whitespace-pre-line text-stone-700 leading-relaxed text-xs sm:text-sm md:text-base">
                        {sec.body}
                      </div>
                    </section>
                  ))}
                </div>

                {/* Archival Citations & Scholarly Footnotes */}
                <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-stone-900">
                    <Bookmark className="w-5 h-5 text-[#A91F35]" />
                    <h4 className="font-serif font-black text-lg text-stone-900">
                      Scholarly Citations & Historical Bibliography
                    </h4>
                  </div>
                  <p className="text-xs text-stone-500">
                    The facts, dates, texts and biographical details in this monograph are grounded in standard historical references and university archival repositories:
                  </p>

                  <div className="space-y-3 pt-2 divide-y divide-stone-100">
                    {selectedArticle.citations.map((c, cIdx) => (
                      <div key={cIdx} className="pt-3 first:pt-0 text-xs text-stone-600 space-y-1">
                        <div className="font-bold text-stone-800">
                          {cIdx + 1}. {c.author} ({c.year}). <em>{c.work}</em>. {c.publisher || ''}
                        </div>
                        {c.note && <div className="text-stone-500 italic text-[11px]">{c.note}</div>}
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#A91F35] hover:underline text-[11px] font-mono"
                          >
                            <span>Access Source / Repository</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Navigation Between Articles */}
                <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={handlePrevArticle}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#A91F35]" />
                    Previous Monograph
                  </button>

                  <button
                    onClick={handleCloseArticle}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] cursor-pointer transition-all shadow-md"
                  >
                    Back to About Page
                  </button>

                  <button
                    onClick={handleNextArticle}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    Next Monograph
                    <ArrowRight className="w-4 h-4 text-[#A91F35]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
