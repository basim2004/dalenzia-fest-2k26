import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Radio, Music2, Sparkles, Disc3 } from 'lucide-react';

export const RADIO_PLAYLIST = [
  {
    id: 1,
    filename: "AI തലച്ചോർ ‘ഫ്രൈ’ ചെയ്യുന്നു ! Adv. MUHAMMED AJEER FACT & FOCUS RISALA UPDATE.mp3",
    title: "AI തലച്ചോർ ‘ഫ്രൈ’ ചെയ്യുന്നു ! Adv. MUHAMMED AJEER FACT & FOCUS RISALA UPDATE",
    src: "/assets/radio/audios/" + encodeURIComponent("AI തലച്ചോർ ‘ഫ്രൈ’ ചെയ്യുന്നു ! Adv. MUHAMMED AJEER FACT & FOCUS RISALA UPDATE.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("AI തലച്ചോർ ‘ഫ്രൈ’ ചെയ്യുന്നു ! Adv. MUHAMMED AJEER FACT & FOCUS RISALA UPDATE.mp3"),
  },
  {
    id: 2,
    filename: "AI മനുഷ്യരെ കൊന്നുകളയുമോ Adv MUHAMMAD AJEER RISALA UPDATE.mp3",
    title: "AI മനുഷ്യരെ കൊന്നുകളയുമോ Adv MUHAMMAD AJEER RISALA UPDATE",
    src: "/assets/radio/audios/" + encodeURIComponent("AI മനുഷ്യരെ കൊന്നുകളയുമോ Adv MUHAMMAD AJEER RISALA UPDATE.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("AI മനുഷ്യരെ കൊന്നുകളയുമോ Adv MUHAMMAD AJEER RISALA UPDATE.mp3"),
  },
  {
    id: 3,
    filename: "Ai യുഗത്തിലെ ഇസ്ലാം ഉസ്താദ് സുഹൈബ് ഹൈതമി Islamic Speech Malayalam.mp3",
    title: "Ai യുഗത്തിലെ ഇസ്ലാം ഉസ്താദ് സുഹൈബ് ഹൈതമി Islamic Speech Malayalam",
    src: "/assets/radio/audios/" + encodeURIComponent("Ai യുഗത്തിലെ ഇസ്ലാം ഉസ്താദ് സുഹൈബ് ഹൈതമി Islamic Speech Malayalam.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("Ai യുഗത്തിലെ ഇസ്ലാം ഉസ്താദ് സുഹൈബ് ഹൈതമി Islamic Speech Malayalam.mp3"),
  },
  {
    id: 4,
    filename: "AI യോടൊപ്പം വളർന്ന് ഹ്യുമാനിറ്റീസും ചർച്ചയായി IBM വീഡിയോ SALIM KODUR EXPLAINER RISALA UPDATE.mp3",
    title: "AI യോടൊപ്പം വളർന്ന് ഹ്യുമാനിറ്റീസും ചർച്ചയായി IBM വീഡിയോ SALIM KODUR EXPLAINER RISALA UPDATE",
    src: "/assets/radio/audios/" + encodeURIComponent("AI യോടൊപ്പം വളർന്ന് ഹ്യുമാനിറ്റീസും ചർച്ചയായി IBM വീഡിയോ SALIM KODUR EXPLAINER RISALA UPDATE.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("AI യോടൊപ്പം വളർന്ന് ഹ്യുമാനിറ്റീസും ചർച്ചയായി IBM വീഡിയോ SALIM KODUR EXPLAINER RISALA UPDATE.mp3"),
  },
  {
    id: 5,
    filename: "ആർട്ടിഫിഷ്യൽ ഇൻ്റലിജൻസ് എന്ന വലിയ ലോകം ZAINUL ABID M SALIM KODUR INSIGHT.mp3",
    title: "ആർട്ടിഫിഷ്യൽ ഇൻ്റലിജൻസ് എന്ന വലിയ ലോകം ZAINUL ABID M SALIM KODUR INSIGHT",
    src: "/assets/radio/audios/" + encodeURIComponent("ആർട്ടിഫിഷ്യൽ ഇൻ്റലിജൻസ് എന്ന വലിയ ലോകം ZAINUL ABID M SALIM KODUR INSIGHT.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("ആർട്ടിഫിഷ്യൽ ഇൻ്റലിജൻസ് എന്ന വലിയ ലോകം ZAINUL ABID M SALIM KODUR INSIGHT.mp3"),
  },
  {
    id: 6,
    filename: "എ ഐ കീഴടക്കിയാൽ ലോകം കീഴടക്കാമെന്ന് ട്രംപ് Adv MUHAMMAD AJEER FACT & FOCUS RISALA UPDATE.mp3",
    title: "എ ഐ കീഴടക്കിയാൽ ലോകം കീഴടക്കാമെന്ന് ട്രംപ് Adv MUHAMMAD AJEER FACT & FOCUS RISALA UPDATE",
    src: "/assets/radio/audios/" + encodeURIComponent("എ ഐ കീഴടക്കിയാൽ ലോകം കീഴടക്കാമെന്ന് ട്രംപ് Adv MUHAMMAD AJEER FACT & FOCUS RISALA UPDATE.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("എ ഐ കീഴടക്കിയാൽ ലോകം കീഴടക്കാമെന്ന് ട്രംപ് Adv MUHAMMAD AJEER FACT & FOCUS RISALA UPDATE.mp3"),
  },
  {
    id: 7,
    filename: "എ. ഐ പണി കളയുമോ കേരളത്തിന്റെ അവസരങ്ങൾ EP-02 Dr ASHRAF S OTHER VIEW RISALA UPDATE.mp3",
    title: "എ. ഐ പണി കളയുമോ കേരളത്തിന്റെ അവസരങ്ങൾ EP-02 Dr ASHRAF S OTHER VIEW RISALA UPDATE",
    src: "/assets/radio/audios/" + encodeURIComponent("എ. ഐ പണി കളയുമോ കേരളത്തിന്റെ അവസരങ്ങൾ EP-02 Dr ASHRAF S OTHER VIEW RISALA UPDATE.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("എ. ഐ പണി കളയുമോ കേരളത്തിന്റെ അവസരങ്ങൾ EP-02 Dr ASHRAF S OTHER VIEW RISALA UPDATE.mp3"),
  },
  {
    id: 8,
    filename: "എ.ഐ പഠനം; കേരളത്തിന്റെ സാധ്യതകൾ EP-01 Dr ASHRAF S BINOY THOMAS OTHER VIEW RISALA UPDATE.mp3",
    title: "എ.ഐ പഠനം; കേരളത്തിന്റെ സാധ്യതകൾ EP-01 Dr ASHRAF S BINOY THOMAS OTHER VIEW RISALA UPDATE",
    src: "/assets/radio/audios/" + encodeURIComponent("എ.ഐ പഠനം; കേരളത്തിന്റെ സാധ്യതകൾ EP-01 Dr ASHRAF S BINOY THOMAS OTHER VIEW RISALA UPDATE.mp3"),
    fallbackSrc: "/audios/" + encodeURIComponent("എ.ഐ പഠനം; കേരളത്തിന്റെ സാധ്യതകൾ EP-01 Dr ASHRAF S BINOY THOMAS OTHER VIEW RISALA UPDATE.mp3"),
  },
];

export default function FestivalRadioPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const currentTrack = RADIO_PLAYLIST[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Load and play when currentIndex changes while playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      setCurrentTime(0);
      if (isPlaying) {
        setIsLoading(true);
        audioRef.current.play().then(() => {
          setIsLoading(false);
        }).catch(() => {
          // If relative path fails, try fallback
          if (audioRef.current.src !== currentTrack.fallbackSrc) {
            audioRef.current.src = currentTrack.fallbackSrc;
            audioRef.current.play().finally(() => setIsLoading(false));
          } else {
            setIsLoading(false);
            setIsPlaying(false);
          }
        });
      }
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        // Retry with fallback
        if (audioRef.current.src !== currentTrack.fallbackSrc) {
          audioRef.current.src = currentTrack.fallbackSrc;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            setIsPlaying(false);
          }).finally(() => setIsLoading(false));
        } else {
          setIsPlaying(false);
          setIsLoading(false);
        }
      });
    }
  };

  const playTrack = (index) => {
    if (index === currentIndex) {
      togglePlay();
      return;
    }
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % RADIO_PLAYLIST.length;
    setCurrentIndex(nextIdx);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + RADIO_PLAYLIST.length) % RADIO_PLAYLIST.length;
    setCurrentIndex(prevIdx);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-gradient-to-b from-[#8C1428] via-[#741021] to-[#590B19] rounded-3xl p-5 md:p-8 border-2 border-[#E6A916]/40 shadow-2xl text-white select-none">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => {
          if (audioRef.current && audioRef.current.src !== currentTrack.fallbackSrc) {
            audioRef.current.src = currentTrack.fallbackSrc;
            if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
          }
        }}
        preload="metadata"
      />

      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#E6A916]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E6A916] text-[#A91F35] flex items-center justify-center shadow-lg font-black">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#E6A916] bg-black/30 px-2.5 py-0.5 rounded-full border border-[#E6A916]/30">
                DALENZIA RADIO BROADCAST
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight mt-0.5">
              Official Festival Radio & Audio Series
            </h3>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-[#E6A916]/30 text-xs font-semibold text-[#F7F3E9]">
          <Music2 className="w-3.5 h-3.5 text-[#E6A916]" />
          <span>8 Official Audio Episodes</span>
        </div>
      </div>

      {/* Main Console: Interactive Player Display */}
      <div className="my-6 bg-black/40 rounded-2xl p-5 md:p-6 border border-white/10 shadow-inner">
        {/* Top Track Info & Visualizer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Spinning Cassette Reel / Disc Indicator */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#A91F35] border-2 border-[#E6A916] flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.3 }}
                className="text-[#E6A916]"
              >
                <Disc3 className="w-8 h-8 md:w-10 md:h-10" />
              </motion.div>
              {isPlaying && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
              )}
            </div>

            {/* Title with authentic Malayalam font preservation */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-[#E6A916]">
                  EPISODE {String(currentIndex + 1).padStart(2, '0')} OF 08
                </span>
                {isPlaying && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6A916] text-[#A91F35] animate-pulse">
                    PLAYING
                  </span>
                )}
              </div>
              <p
                className="text-base md:text-lg font-bold text-white truncate mt-0.5"
                title={currentTrack.title}
              >
                {currentTrack.title}
              </p>
              <p className="text-xs text-white/70 truncate">
                Asset: {currentTrack.filename}
              </p>
            </div>
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end gap-1.5 h-8 px-3 py-1 bg-black/30 rounded-lg border border-white/10 self-start md:self-auto">
            {[45, 80, 60, 95, 30, 75, 90, 50, 85, 40, 70, 100].map((h, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [`${Math.max(15, (h * 0.4))}%`, `${h}%`, '20%'] } : { height: '20%' }}
                transition={{
                  repeat: isPlaying ? Infinity : 0,
                  duration: 0.8 + (i % 3) * 0.2,
                  ease: "easeInOut",
                  delay: i * 0.05
                }}
                className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-[#E6A916]' : 'bg-white/80'}`}
                style={{ height: '20%' }}
              />
            ))}
          </div>
        </div>

        {/* Scrubber Progress Bar */}
        <div className="mt-5 space-y-1.5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E6A916] hover:bg-white/30 transition-all"
          />
          <div className="flex justify-between text-[11px] font-mono text-white/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-3">
            {/* Previous Track */}
            <button
              onClick={handlePrev}
              aria-label="Previous Track"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white transition-all cursor-pointer border border-white/10 hover:border-[#E6A916]/50"
              title="Previous Audio"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause Track" : "Play Track"}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E6A916] to-[#f5c344] text-[#A91F35] font-black flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#A91F35] border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
              <span className="text-sm font-extrabold tracking-wide">
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </span>
            </button>

            {/* Next Track */}
            <button
              onClick={handleNext}
              aria-label="Next Track"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-white transition-all cursor-pointer border border-white/10 hover:border-[#E6A916]/50"
              title="Next Audio"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#E6A916] hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 md:w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#E6A916]"
            />
          </div>
        </div>
      </div>

      {/* Visible Interactive Playlist Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E6A916]" />
            <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-[#E6A916]">
              All Audio Episodes in Playlist (Click to Play)
            </h4>
          </div>
          <span className="text-xs text-white/60 font-mono">
            {RADIO_PLAYLIST.length} Tracks Detected
          </span>
        </div>

        {/* Playlist Items List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#E6A916] scrollbar-track-black/20">
          {RADIO_PLAYLIST.map((track, idx) => {
            const isThisTrackActive = idx === currentIndex;
            const isThisTrackPlaying = isThisTrackActive && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(idx)}
                className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isThisTrackActive
                    ? 'bg-gradient-to-r from-[#A91F35] to-[#741021] border-[#E6A916] shadow-lg shadow-black/40 scale-[1.01]'
                    : 'bg-black/20 hover:bg-black/40 border-white/10 hover:border-[#E6A916]/40'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Track Index or Play Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-xs transition-colors ${
                      isThisTrackActive
                        ? 'bg-[#E6A916] text-[#A91F35]'
                        : 'bg-white/10 text-white/70 group-hover:bg-[#E6A916] group-hover:text-[#A91F35]'
                    }`}
                  >
                    {isThisTrackPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </div>

                  {/* Title Display (Malayalam and English exactly as in filename) */}
                  <div className="min-w-0">
                    <p
                      className={`text-xs md:text-sm font-semibold truncate transition-colors ${
                        isThisTrackActive ? 'text-white font-bold' : 'text-white/90 group-hover:text-white'
                      }`}
                      title={track.title}
                    >
                      {track.title}
                    </p>
                    <p className="text-[10px] text-white/50 truncate font-mono">
                      Track {String(idx + 1).padStart(2, '0')} • MP3 Audio
                    </p>
                  </div>
                </div>

                {/* Right Badge / Status */}
                <div className="shrink-0 flex items-center gap-2">
                  {isThisTrackActive && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E6A916] text-[#A91F35]">
                      {isThisTrackPlaying ? 'Now Playing' : 'Selected'}
                    </span>
                  )}
                  <span
                    className={`text-xs font-mono transition-colors ${
                      isThisTrackActive ? 'text-[#E6A916]' : 'text-white/40 group-hover:text-white/70'
                    }`}
                  >
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
