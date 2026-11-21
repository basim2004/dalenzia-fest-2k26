import React, { useState, useEffect, useMemo } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Radio, 
  Clock, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';

const STAGES = [
  { id: 'STG-01', name: 'Cordova Grand Stage (Stage 01)' },
  { id: 'STG-02', name: 'Al-Farabi Heritage Hall (Stage 02)' },
  { id: 'STG-03', name: 'Ibn Khaldun Academic Hall (Stage 03)' },
  { id: 'STG-04', name: 'Media Studio Preview Room (Stage 04)' },
  { id: 'STG-05', name: 'Al-Andalus Quadrangle (Stage 05)' }
];

export default function LiveStageDisplay({ onNavigatePublic }) {
  const [selectedStageId, setSelectedStageId] = useState('STG-01');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayData, setDisplayData] = useState(() => festivalStore.getLiveStageDisplayData('STG-01'));

  // Live Clock updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live polling for stage updates every 1.5 seconds
  useEffect(() => {
    const fetchLatest = () => {
      const data = festivalStore.getLiveStageDisplayData(selectedStageId);
      setDisplayData(data);
    };
    fetchLatest();
    const interval = setInterval(fetchLatest, 1500);
    return () => clearInterval(interval);
  }, [selectedStageId]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const activeEntry = displayData?.activeCallingRecord;
  const nextUp = displayData?.nextUpCallingRecord;
  const comp = displayData?.competition;

  return (
    <div className="min-h-screen bg-[#0a0305] text-white flex flex-col justify-between p-4 sm:p-8 font-sans overflow-hidden select-none relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#A91F35]/20 via-[#E6A916]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#A91F35]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        {/* Crest & Title */}
        <div className="flex items-center gap-4">
          <div className="h-10">
            <img
              src="/assets/dalenzia_fest_logo.png"
              alt="Dalenzia Fest Logo"
              className="h-full w-auto object-contain"
            />
          </div>
          <span className="h-6 w-[1px] bg-white/20 hidden sm:block" />
          <div className="h-8 hidden sm:block">
            <img
              src="/assets/nueva_era_logo.png"
              alt="Nueva Era"
              className="h-full w-auto object-contain"
            />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">
              Live Stage Projection & Auditorium Display
            </p>
          </div>
        </div>

        {/* Stage Selector & Live Clock */}
        <div className="flex items-center gap-4">
          {/* Stage Dropdown */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-2xl backdrop-blur-md">
            <Flame className="w-4 h-4 text-[#E6A916]" />
            <select
              value={selectedStageId}
              onChange={(e) => setSelectedStageId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {STAGES.map(s => (
                <option key={s.id} value={s.id} className="bg-stone-900 text-white">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-sm font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl text-[#E6A916]">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Toggle Fullscreen (F11)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit / Public Website */}
          {onNavigatePublic && (
            <button
              onClick={onNavigatePublic}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 text-stone-400 hover:text-white transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Center Stage Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-6 text-center">
        {/* Active Competition Headline */}
        {comp ? (
          <div className="mb-6 space-y-1">
            <span className="px-4 py-1 rounded-full bg-[#E6A916]/10 border border-[#E6A916]/30 text-[#E6A916] text-xs font-black uppercase tracking-widest inline-block">
              {comp.code} • {comp.category}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-wide">
              {comp.title}
            </h2>
          </div>
        ) : (
          <div className="mb-6">
            <span className="px-4 py-1 rounded-full bg-white/10 text-stone-400 text-xs font-bold uppercase tracking-wider">
              {STAGES.find(s => s.id === selectedStageId)?.name || 'Stage Standby'}
            </span>
          </div>
        )}

        {/* Big Spotlight Display Box */}
        {activeEntry ? (
          <div className="w-full max-w-4xl p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl shadow-2xl space-y-6 animate-scaleUp">
            {/* Status Pulse Banner */}
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-emerald-500/30 to-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs sm:text-sm tracking-widest uppercase animate-pulse">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>
                {activeEntry.status === 'In Progress' ? 'NOW PERFORMING ON STAGE' :
                 activeEntry.status === 'Called' ? 'CALLED TO STAGE • ENTER NOW' :
                 'PARTICIPANT PRESENT ON STAGE'}
              </span>
            </div>

            {/* Giant Participant Code Typography */}
            <div className="py-2">
              <div className="font-mono font-black text-7xl sm:text-9xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] via-[#E6A916] to-[#b37e06] drop-shadow-[0_10px_25px_rgba(230,169,22,0.4)]">
                {activeEntry.codeLetter}
              </div>
            </div>

            {/* Participant Name & Team Badge */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-wide">
                {activeEntry.studentName}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="px-4 py-1.5 rounded-2xl bg-[#A91F35] text-white font-bold text-sm tracking-wider uppercase shadow-md">
                  {activeEntry.teamName || 'Independent Participant'}
                </span>
                <span className="px-3 py-1.5 rounded-2xl bg-white/10 text-stone-300 font-mono text-xs">
                  Stage Call #{activeEntry.callOrder || activeEntry.drawOrder}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Idle / Standby State */
          <div className="w-full max-w-3xl p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
            <Sparkles className="w-12 h-12 text-[#E6A916] mx-auto opacity-70 animate-bounce" />
            <h2 className="text-3xl font-serif font-black text-white">
              Stage Standby
            </h2>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              Awaiting next participant call from the stage controller desk.
            </p>
            <div className="text-xs font-mono text-amber-300 pt-2">
              Official Random Draw Sequence Preserved
            </div>
          </div>
        )}
      </main>

      {/* Bottom Up Next / On Deck Bar */}
      <footer className="relative z-10 border-t border-white/10 pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-[#E6A916] uppercase tracking-wider flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4" />
              <span>Next Up on Stage:</span>
            </span>

            {nextUp ? (
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-[#E6A916] bg-black/40 px-2.5 py-0.5 rounded-md border border-[#E6A916]/30">
                  {nextUp.codeLetter}
                </span>
                <span className="font-bold text-white">
                  {nextUp.studentName}
                </span>
                <span className="text-stone-400 hidden md:inline">
                  ({nextUp.teamName || 'Independent'})
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  • Queue #{nextUp.callOrder || nextUp.drawOrder}
                </span>
              </div>
            ) : (
              <span className="text-stone-400 italic">No upcoming participant queued</span>
            )}
          </div>

          <div className="text-[11px] text-stone-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-emerald-400 uppercase">Live Feed</span>
            </span>
            <span>•</span>
            <span>Dalailussunna Dars, Ayiroor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
