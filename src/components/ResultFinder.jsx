import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Medal, Award, Sparkles, Filter, ChevronRight, Image } from 'lucide-react';
import resultsData from '../data/results.json';
import PosterModal from './PosterModal';

export default function ResultFinder({ lang }) {
  const [selectedCategory, setSelectedCategory] = useState(resultsData.categories[0].id);
  const currentCategory = resultsData.categories.find((c) => c.id === selectedCategory) || resultsData.categories[0];

  const [selectedItemId, setSelectedItemId] = useState(currentCategory.items[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeWinnerForPoster, setActiveWinnerForPoster] = useState(null);

  const currentItem = currentCategory.items.find((i) => i.id === selectedItemId) || currentCategory.items[0];

  const handleCategoryChange = (e) => {
    const newCatId = e.target.value;
    setSelectedCategory(newCatId);
    const cat = resultsData.categories.find((c) => c.id === newCatId);
    if (cat && cat.items.length > 0) {
      triggerSearch(cat.items[0].id);
    }
  };

  const handleItemChange = (e) => {
    triggerSearch(e.target.value);
  };

  const triggerSearch = (itemId) => {
    setIsLoading(true);
    setSelectedItemId(itemId);
    setTimeout(() => {
      setIsLoading(false);
    }, 450); // simulated quick search latency
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return {
        bg: 'bg-gradient-to-r from-[#E6A916] to-[#F59E0B]',
        text: 'text-white',
        border: 'border-[#E6A916]',
        label: lang === 'en' ? '1st Place' : 'ഒന്നാം സ്ഥാനം',
        icon: Trophy,
      };
    }
    if (rank === 2) {
      return {
        bg: 'bg-gradient-to-r from-slate-300 to-slate-400',
        text: 'text-slate-900',
        border: 'border-slate-300',
        label: lang === 'en' ? '2nd Place' : 'രണ്ടാം സ്ഥാനം',
        icon: Medal,
      };
    }
    return {
      bg: 'bg-gradient-to-r from-amber-600 to-amber-700',
      text: 'text-white',
      border: 'border-amber-600',
      label: lang === 'en' ? '3rd Place' : 'മൂന്നാം സ്ഥാനം',
      icon: Award,
    };
  };

  return (
    <section id="results" className="max-w-md mx-auto px-4 py-8">
      {/* Eyebrow & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider mb-1">
          <Trophy className="w-3 h-3 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Live Match Official Results' : 'ഔദ്യോഗിക മത്സര ഫലങ്ങൾ'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#A91F35]">
          {lang === 'en' ? 'Find the Result' : 'ഫലങ്ങൾ കണ്ടെത്താം'}
        </h2>
        <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
          {lang === 'en'
            ? 'Select category & competition to view announced rankings'
            : 'വിഭാഗവും ഇനവും തിരഞ്ഞെടുത്ത് വിജയികളെ അറിയാം'}
        </p>
      </div>

      {/* Filter Dropdowns Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#A91F35]/15 shadow-sm space-y-3 mb-6">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#A91F35] flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-[#E6A916]" />
            <span>{lang === 'en' ? '1. Select Category' : '1. വിഭാഗം'}</span>
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#A91F35]"
          >
            {resultsData.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.malayalam})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#A91F35] flex items-center gap-1.5">
            <Search className="w-3 h-3 text-[#E6A916]" />
            <span>{lang === 'en' ? '2. Select Competition Item' : '2. മത്സരം'}</span>
          </label>
          <select
            value={selectedItemId}
            onChange={handleItemChange}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#A91F35]"
          >
            {currentCategory.items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.malayalam})
              </option>
            ))}
          </select>
        </div>

        {currentItem && (
          <div className="pt-1 flex items-center justify-between text-[11px] text-[#1c1917]/60 font-medium">
            <span>{currentItem.stage}</span>
            <span className="text-[#A91F35] font-semibold">21, 22, 23 DECEMBER 2026</span>
          </div>
        )}
      </div>

      {/* Results Display Area */}
      <div>
        {isLoading ? (
          /* Loading Skeleton State */
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 py-4 text-xs font-semibold text-[#A91F35]">
              <div className="w-4 h-4 border-2 border-[#A91F35] border-t-transparent rounded-full animate-spin" />
              <span>{lang === 'en' ? 'Loading verified results...' : 'ഫലങ്ങൾ ലഭ്യമാക്കുന്നു...'}</span>
            </div>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse space-y-2"
              >
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-6 bg-stone-200 rounded w-2/3" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : currentItem?.winners?.length > 0 ? (
          /* Winner Cards Podium */
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-bold text-[#A91F35]">
                {currentItem.name} · {lang === 'en' ? 'Podium' : 'വിജയികൾ'}
              </span>
              <span className="text-[10px] font-bold text-[#E6A916] bg-[#A91F35] px-2 py-0.5 rounded-full">
                VERIFIED
              </span>
            </div>

            {currentItem.winners.map((winner, idx) => {
              const badge = getRankBadge(winner.rank);
              const Icon = badge.icon;
              return (
                <motion.div
                  key={winner.chestNo}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`relative overflow-hidden bg-white rounded-2xl p-4 border-2 ${badge.border} shadow-sm space-y-3`}
                >
                  {/* Top Bar: Rank & Chest No */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${badge.bg} ${badge.text}`}>
                        <Icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1c1917]/70 font-mono">
                        #{winner.chestNo}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-[#A91F35]">
                        Grade {winner.grade}
                      </span>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-[#E6A916]/20 text-[#b88209]">
                        +{winner.points} pts
                      </span>
                    </div>
                  </div>

                  {/* Contestant Details */}
                  <div>
                    <h3 className="text-lg font-bold text-[#1c1917] leading-snug">
                      {winner.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#A91F35] flex items-center gap-1 mt-0.5">
                      <span>Sector: {winner.sector}</span>
                    </p>
                  </div>

                  {/* CTA: Create Poster Generator */}
                  <div className="pt-1 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => setActiveWinnerForPoster(winner)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#A91F35] text-white text-xs font-bold shadow-sm hover:bg-[#8e192c] active:scale-95 transition-all"
                    >
                      <Image className="w-3.5 h-3.5 text-[#E6A916]" />
                      <span>{lang === 'en' ? 'Create Poster' : 'പോസ്റ്റർ തയ്യാറാക്കുക'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center text-xs text-stone-500 border border-stone-200">
            No results published yet for this category.
          </div>
        )}
      </div>

      {/* Poster Generator Modal */}
      {activeWinnerForPoster && (
        <PosterModal
          winner={activeWinnerForPoster}
          itemTitle={currentItem.name}
          categoryName={currentCategory.name}
          onClose={() => setActiveWinnerForPoster(null)}
          lang={lang}
        />
      )}
    </section>
  );
}
