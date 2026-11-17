import React from 'react';
import { Sparkles, Radio, Award } from 'lucide-react';

export default function MarqueeTicker({ lang }) {
  const announcements = [
    { text: lang === 'en' ? '⚡ Live: High School Mappilapattu Results Declared!' : '⚡ ലൈവ്: ഹൈസ്കൂൾ മാപ്പിളപ്പാട്ട് ഫലം പ്രഖ്യാപിച്ചു!' },
    { text: lang === 'en' ? '🏆 Ayiroor Central takes the lead on points table with 348 points' : '🏆 അയിരൂർ സെൻട്രൽ 348 പോയിന്റോടെ മുന്നിൽ' },
    { text: lang === 'en' ? '📍 Stage 01: Senior Sufi Geetham Finals in progress' : '📍 വേദി 01: സീനിയർ സൂഫി ഗീതം ഫൈനൽ പുരോഗമിക്കുന്നു' },
    { text: lang === 'en' ? '🎨 Create your customized winner poster & share on WhatsApp' : '🎨 നിങ്ങളുടെ വിജയി പോസ്റ്റർ നിർമ്മിച്ച് വാട്സ്ആപ്പിൽ പങ്കിടാം' },
    { text: lang === 'en' ? '✨ Theme: Nueva Era — Where tradition meets digital innovation' : '✨ തീം: ന്യൂവ എറ — പാരമ്പര്യവും നവയുഗ സാങ്കേതികതയും' },
  ];

  return (
    <div className="relative bg-[#A91F35] text-white py-2 overflow-hidden border-y border-[#E6A916]/30 shadow-inner flex items-center select-none">
      <div className="flex-shrink-0 z-10 px-3 bg-[#A91F35] flex items-center gap-1.5 border-r border-white/20">
        <span className="w-2 h-2 rounded-full bg-[#E6A916] animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-[#E6A916]">
          {lang === 'en' ? 'LIVE' : 'ലൈവ്'}
        </span>
      </div>

      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="inline-flex items-center gap-8 animate-[marquee_25s_linear_infinite]">
          {announcements.concat(announcements).map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 text-xs font-medium text-white/90">
              <span>{item.text}</span>
              <span className="text-[#E6A916]">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
