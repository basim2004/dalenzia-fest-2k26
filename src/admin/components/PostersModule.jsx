import React, { useState, useRef } from 'react';
import {
  Image,
  Download,
  Sparkles,
  Trophy,
  Crown,
  Type,
  Layout,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function PostersModule() {
  const [template, setTemplate] = useState('winner_portrait'); // 'winner_portrait', 'general_announcement'
  const [compTitle, setCompTitle] = useState('Junior Arabic Essay (LIT-JR-102)');
  const [candidateName, setCandidateName] = useState('Ahmad Rayan K.');
  const [chestNo, setChestNo] = useState('C-104');
  const [teamName, setTeamName] = useState('Areekode');
  const [position, setPosition] = useState('FIRST PLACE (GOLD)');
  const [points, setPoints] = useState('+10 PTS');
  const [downloading, setDownloading] = useState(false);

  const posterRef = useRef(null);

  const handleDownloadPoster = async () => {
    setDownloading(true);
    try {
      const htmlToImage = await import('html-to-image');
      if (posterRef.current) {
        const dataUrl = await htmlToImage.toPng(posterRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `dalenzia_poster_${chestNo}_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed generating poster PNG', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-black text-[#1c1917]">
            Poster & Dynamic Template Generator
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            Generate authentic high-resolution announcement and certificate posters with official Dalenzia branding.
          </p>
        </div>

        <button
          onClick={handleDownloadPoster}
          disabled={downloading}
          className="px-6 py-2.5 rounded-xl bg-[#A91F35] hover:bg-[#8B1A2C] text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md self-start sm:self-auto"
        >
          {downloading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Download className="w-4 h-4 text-[#E6A916]" />
              <span>Download High-Res PNG</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
          <h3 className="font-serif font-black text-lg text-[#1c1917] flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#A91F35]" />
            Poster Customizer
          </h3>

            <div className="space-y-1">
              <label className="text-stone-700">Template Style</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="winner_portrait">Winner Laurels Poster (Gold/Crimson)</option>
                <option value="general_announcement">Breaking Festival Announcement</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-stone-700">Competition Title</label>
              <input
                type="text"
                value={compTitle}
                onChange={(e) => setCompTitle(e.target.value)}
                className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-700">Candidate / Delegation Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-700">Chest Number</label>
                <input
                  type="text"
                  value={chestNo}
                  onChange={(e) => setChestNo(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700">Sector Contingent</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-stone-700">Position Achieved</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-700">Points Awarded</label>
                <input
                  type="text"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#A91F35]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Poster Preview Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="text-xs font-bold text-stone-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Interactive Live Poster Canvas Preview (Exact Output)</span>
            </div>

            {/* Actual Poster Canvas (Captured for PNG Download) */}
            <div
              ref={posterRef}
              className="w-full max-w-[440px] aspect-[4/5] bg-gradient-to-b from-[#FFFDF8] via-[#FDF8EC] to-[#F5ECE0] rounded-3xl p-8 border-4 border-[#E6A916] shadow-2xl relative flex flex-col justify-between text-center overflow-hidden"
            >
              {/* Corner Decorative Accents */}
              <div className="absolute top-3 left-3 text-[#E6A916] text-xl font-serif">✦</div>
              <div className="absolute top-3 right-3 text-[#E6A916] text-xl font-serif">✦</div>
              <div className="absolute bottom-3 left-3 text-[#E6A916] text-xl font-serif">✦</div>
              <div className="absolute bottom-3 right-3 text-[#E6A916] text-xl font-serif">✦</div>

              {/* Poster Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src="/assets/logo/dalanzia logo (1).png"
                    alt="Dalenzia Logo"
                    className="h-10 w-auto object-contain"
                  />
                  <span className="w-[1px] h-6 bg-[#A91F35]/30" />
                  <img
                    src="/assets/theme/nueva era.png"
                    alt="Nueva Era"
                    className="h-8 w-auto object-contain"
                  />
                </div>

                <div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#A91F35] bg-[#A91F35]/10 px-3 py-0.5 rounded-full inline-block">
                  OFFICIAL FESTIVAL WINNER
                </div>
              </div>

              {/* Middle Trophy & Candidate Spotlight */}
              <div className="my-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-[#A91F35] text-[#E6A916] border-2 border-[#E6A916] flex items-center justify-center shadow-lg">
                  <Crown className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#E6A916] bg-[#A91F35] px-4 py-1 rounded-full inline-block">
                    {position}
                  </div>
                  <h3 className="text-2xl font-serif font-black text-[#1c1917] pt-2">
                    {candidateName}
                  </h3>
                  <p className="text-xs font-semibold text-stone-600 font-mono">
                    {chestNo} · Sector: <span className="text-[#A91F35] font-bold">{teamName}</span>
                  </p>
                </div>

                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-300 max-w-xs mx-auto">
                  <div className="text-[11px] font-bold text-stone-700">
                    {compTitle}
                  </div>
                  <div className="text-sm font-serif font-black text-[#A91F35] pt-0.5">
                    Points Allocated: {points}
                  </div>
                </div>
              </div>

              {/* Poster Footer */}
              <div className="pt-4 border-t border-stone-300 flex items-center justify-between text-[9px] text-stone-500 font-semibold uppercase tracking-wider">
                <span>Dalenzia Fest 2K26</span>
                <span>Central Tabulation Council</span>
                <span>Ayiroor, Kerala</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
}
