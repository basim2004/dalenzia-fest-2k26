import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Quote, BookOpen, Compass, Clock, Zap } from 'lucide-react';

export default function ThemeSection({ lang }) {
  const words = [
    { en: 'KNOWLEDGE', ml: 'അറിവ്' },
    { en: 'NEW GENERATION', ml: 'പുതുതലമുറ' },
    { en: 'TIME', ml: 'കാലം' },
    { en: 'TRANSFORMATION', ml: 'പുരോഗതി' },
  ];

  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const activeWord = lang === 'en' ? words[currentWordIdx].en : words[currentWordIdx].ml;
    let timer;

    if (!isDeleting && displayText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentWordIdx((prev) => (prev + 1) % words.length);
    } else {
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting ? prev.slice(0, -1) : activeWord.slice(0, prev.length + 1)
        );
      }, isDeleting ? 40 : 100);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIdx, lang]);

  const pillars = [
    {
      title: 'Knowledge',
      malayalam: 'അറിവ്',
      desc: 'The lamp and the book: classical learning rooted in the centuries-old Dars tradition.',
      malDesc: 'വിളക്കും ഗ്രന്ഥങ്ങളും: ദർസ് പാരമ്പര്യത്തിൽ അധിഷ്ഠിതമായ വിജ്ഞാന പ്രകാശം.',
      img: '/assets/lamp_books.png',
      icon: BookOpen,
      color: '#A91F35',
    },
    {
      title: 'New Generation',
      malayalam: 'പുതുതലമുറ',
      desc: 'The paper plane: A young generation with high aspirations, taking off toward global horizons.',
      malDesc: 'പേപ്പർ വിമാനം: ആഗോള ചക്രവാളങ്ങളിലേക്ക് കുതിച്ചുയരുന്ന യുവതലമുറ.',
      img: '/assets/paper_plane.png',
      icon: Compass,
      color: '#E6A916',
    },
    {
      title: 'Time',
      malayalam: 'കാലം',
      desc: 'The golden hourglass: Every moment is a chance to begin again and transform.',
      malDesc: 'സുവർണ്ണ മണൽഘടികാരം: ഓരോ നിമിഷവും പുതിയ തുടക്കങ്ങൾക്കുള്ള അവസരമാണ്.',
      img: '/assets/golden_hourglass.png',
      icon: Clock,
      color: '#A91F35',
    },
    {
      title: 'Transformation',
      malayalam: 'പുരോഗതി',
      desc: 'Botanical vine & pixels: Growth that seamlessly carries Islamic cultural heritage into the digital age.',
      malDesc: 'പാരമ്പര്യത്തെയും ആധുനിക സാങ്കേതിക മുന്നേറ്റങ്ങളെയും സമന്വയിപ്പിക്കുന്ന പുരോഗതി.',
      img: '/assets/botanical_vine.png',
      icon: Zap,
      color: '#E6A916',
    },
  ];

  return (
    <section id="theme" className="max-w-md mx-auto px-4 py-8">
      {/* Eyebrow and Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3 h-3 text-[#E6A916]" />
          <span>{lang === 'en' ? 'Official Fest Theme' : 'ഔദ്യോഗിക മേള തീം'}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#A91F35]">
          Nueva Era · ന്യൂവ എറ
        </h2>
        <p className="text-xs text-[#1c1917]/70 font-medium mt-1">
          Spanish for "New Era" — Standing at a historical turning point.
        </p>
      </div>

      {/* Quote Banner with glitch/typewriter effect */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white rounded-2xl p-5 border border-[#A91F35]/15 shadow-sm text-center mb-6 overflow-hidden"
      >
        <div className="flex justify-center mb-2 text-[#E6A916]">
          <Quote className="w-8 h-8 opacity-40 rotate-180" />
        </div>

        <p className="font-serif text-base md:text-lg text-[#A91F35] font-semibold italic leading-snug">
          "A new era begins when tradition and technology walk forward together."
        </p>

        <p className="text-[11px] text-[#1c1917]/60 font-semibold uppercase tracking-wider mt-2">
          Brand Statement · Dalenzia 2K26
        </p>

        {/* Dynamic Glitch / Typewriter Box */}
        <div className="mt-4 pt-3 border-t border-[#A91F35]/10 flex items-center justify-center gap-2">
          <span className="text-[11px] text-[#1c1917]/70 font-mono uppercase tracking-wider">
            FOCUS:
          </span>
          <span className="px-2.5 py-1 bg-[#A91F35] text-[#E6A916] rounded-md font-mono text-xs font-bold tracking-wider min-w-[140px] text-center shadow-inner">
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
        </div>
      </motion.div>

      {/* 4 Pillars Grid with 3D Tilt Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A91F35] text-center mb-2">
          {lang === 'en' ? 'Four Pillars of Nueva Era' : 'ന്യൂവ എറയുടെ നാല് സ്തംഭങ്ങൾ'}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl p-3.5 border border-[#A91F35]/10 shadow-sm flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="w-full h-24 mb-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={pillar.img}
                      alt={pillar.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5 text-[#E6A916]" />
                    <h4 className="text-xs font-bold text-[#A91F35]">
                      {lang === 'en' ? pillar.title : pillar.malayalam}
                    </h4>
                  </div>
                </div>

                <p className="text-[10px] text-[#1c1917]/75 leading-tight pt-1">
                  {lang === 'en' ? pillar.desc : pillar.malDesc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
