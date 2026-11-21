import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  Volume2, 
  VolumeX, 
  Eye, 
  Flame, 
  ArrowRight, 
  ShieldAlert, 
  Users,
  Clock,
  Printer
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

// Web Audio API synthesizer for live suspense and fanfare sound effects
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick(pitch = 600) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.4);
      });
    } catch {
      // Audio fallback silent
    }
  }
}

const sound = new SoundEngine();

export default function LiveRandomDraw({ stageId, stageInfo, preselectedCompId, onProceedToCalling }) {
  const [competitions, setCompetitions] = useState(() => festivalStore.getStageCompetitions(stageId));
  const [selectedCompId, setSelectedCompId] = useState(() => preselectedCompId || competitions[0]?.id || '');
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayRollCode, setDisplayRollCode] = useState('—');
  const [justDrawnResult, setJustDrawnResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const rollIntervalRef = useRef(null);

  // Update sound engine state
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  const selectedComp = useMemo(() => {
    return competitions.find(c => c.id === selectedCompId) || competitions[0] || null;
  }, [competitions, selectedCompId]);

  // Fetch or create draw session
  const session = useMemo(() => {
    if (!selectedComp) return null;
    return festivalStore.getOrCreateDrawSession(stageId, selectedComp.id, stageInfo?.name || 'Stage Controller');
  }, [selectedComp, stageId, refreshTrigger]);

  const codeAssignments = useMemo(() => {
    if (!selectedComp) return [];
    return festivalStore.getCompetitionCodeAssignments(selectedComp.id, stageId);
  }, [selectedComp, stageId, refreshTrigger]);

  const undrawnList = useMemo(() => {
    return codeAssignments.filter(c => !c.drawn);
  }, [codeAssignments]);

  const drawnResults = useMemo(() => {
    if (!session) return [];
    return session.drawnSequence || [];
  }, [session]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  // Execute Lucky Draw Animation and Atomic Backend Selection
  const handleStartDraw = () => {
    if (isSpinning) return;
    setErrorMessage(null);
    setJustDrawnResult(null);
    setShowCelebration(false);

    if (!session) {
      setErrorMessage('Draw session not initialized.');
      return;
    }

    if (undrawnList.length === 0) {
      setErrorMessage('All participants have already been drawn for this competition!');
      return;
    }

    // Ensure user interaction initializes audio context
    sound.init();

    // Generate idempotency key
    const idempotencyKey = `draw_${session.id}_${drawnResults.length + 1}_${Date.now()}`;

    // 1. Immediately request atomic result from store
    const response = festivalStore.executeRandomCodeDraw(session.id, idempotencyKey, stageInfo?.name || 'Stage Controller');

    if (!response.success) {
      setErrorMessage(response.error || 'Failed to draw participant code.');
      return;
    }

    const officialDrawn = response.drawnResult;

    // 2. Animate rolling wheel
    setIsSpinning(true);

    const allCodePool = codeAssignments.map(c => c.codeLetter);
    let speed = 60; // ms
    let elapsed = 0;
    const totalDuration = reducedMotion ? 600 : 2800; // ms animation time

    const tickPitchBase = 500;

    rollIntervalRef.current = setInterval(() => {
      elapsed += speed;
      // Pick random dummy code for animation visual effect
      const randomDummy = allCodePool[Math.floor(Math.random() * allCodePool.length)] || 'A-001';
      setDisplayRollCode(randomDummy);
      sound.playTick(tickPitchBase + (elapsed % 300));

      if (elapsed >= totalDuration) {
        clearInterval(rollIntervalRef.current);
        // Land on the official atomic result!
        setDisplayRollCode(officialDrawn.codeLetter);
        setIsSpinning(false);
        setJustDrawnResult(officialDrawn);
        setShowCelebration(true);
        sound.playFanfare();
        setRefreshTrigger(prev => prev + 1);
      }
    }, speed);
  };

  // Reset or Reopen Draw Session
  const handleResetSession = () => {
    if (!session) return;
    const reason = window.prompt('Enter authorized reason for resetting/reopening this Draw Session (Logged for Convener audit):');
    if (!reason || reason.trim() === '') return;

    const res = festivalStore.reopenOrResetDrawSession(session.id, reason.trim(), stageInfo?.name || 'Stage Controller');
    if (res.success) {
      setJustDrawnResult(null);
      setDisplayRollCode('—');
      setShowCelebration(false);
      setRefreshTrigger(prev => prev + 1);
      alert('Draw session has been reset. All participants re-queued into undrawn pool.');
    } else {
      alert(res.error || 'Failed to reset session.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A91F35] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#E6A916]" />
            <span>Official Stage Draw Protocol</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1c1917]">
            Live Random Code Draw Ceremony
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Official cryptographically unbiased random sequence selector for stage performances.
          </p>
        </div>

        {/* Toggles & Sound */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              soundEnabled ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}
            title="Toggle ceremony audio effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E6A916]" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`px-3 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              reducedMotion ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-100 border-stone-200 text-stone-600'
            }`}
            title="Toggle fast / reduced motion"
          >
            {reducedMotion ? 'Fast Spin' : 'Cinematic Spin'}
          </button>

          <button
            onClick={handleResetSession}
            disabled={drawnResults.length === 0}
            className="p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-all disabled:opacity-40"
            title="Reset / Reopen Draw Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Select Competition Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0">
            Active Competition:
          </span>
          <select
            value={selectedCompId}
            disabled={isSpinning}
            onChange={(e) => {
              setSelectedCompId(e.target.value);
              setJustDrawnResult(null);
              setDisplayRollCode('—');
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 font-bold text-xs text-stone-800 focus:outline-none focus:border-[#A91F35]"
          >
            {competitions.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-stone-500">
            <span>Pool Size:</span>
            <span className="font-mono text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md">{codeAssignments.length}</span>
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span>Drawn:</span>
            <span className="font-mono bg-emerald-100 px-2 py-0.5 rounded-md">{drawnResults.length}</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-700">
            <span>Remaining:</span>
            <span className="font-mono bg-amber-100 px-2 py-0.5 rounded-md">{undrawnList.length}</span>
          </span>
        </div>
      </div>

      {/* Main Draw Arena (Left Stage + Right Official Sequence Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Arena: 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Lucky Draw Wheel / Box */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1917] via-[#2d0d14] to-[#1a080d] text-white p-8 sm:p-10 border-2 border-[#E6A916]/30 shadow-2xl flex flex-col items-center justify-center text-center min-h-[420px]">
            {/* Top Stage & Category Badge */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs">
              <span className="px-3 py-1 rounded-full bg-black/40 border border-[#E6A916]/30 text-[#E6A916] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{stageInfo?.name || 'Stage 01'}</span>
              </span>

              <span className="text-[11px] font-mono text-stone-300">
                Draw Position: <span className="font-bold text-[#E6A916]">#{drawnResults.length + (isSpinning ? 1 : (justDrawnResult ? 0 : 1))}</span>
              </span>
            </div>

            {/* Glowing Golden Wheel Center */}
            <div className="my-8 relative">
              {/* Outer Glow Ring */}
              <div className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-[#E6A916]/30 flex items-center justify-center relative transition-all duration-300 ${
                isSpinning ? 'scale-105 border-[#E6A916] shadow-[0_0_50px_rgba(230,169,22,0.4)] animate-pulse' : ''
              }`}>
                {/* Secondary inner ring */}
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-dashed border-[#E6A916]/50 flex items-center justify-center bg-black/50 backdrop-blur-md">
                  {/* Huge Rolling Code */}
                  <span className={`font-mono font-black text-4xl sm:text-5xl tracking-widest transition-transform ${
                    isSpinning ? 'scale-110 text-amber-300 blur-[1px]' : 'text-[#E6A916]'
                  }`}>
                    {displayRollCode}
                  </span>
                </div>
              </div>

              {/* Decorative corner sparks */}
              <Sparkles className="w-6 h-6 text-[#E6A916] absolute -top-2 -right-2 animate-bounce" />
              <Sparkles className="w-5 h-5 text-amber-400 absolute -bottom-1 -left-1 opacity-70" />
            </div>

            {/* Status Text & Draw Buttons */}
            <div className="space-y-4 w-full max-w-sm">
              {isSpinning ? (
                <div className="text-xs font-bold text-amber-300 tracking-wider uppercase animate-pulse">
                  Selecting Random Code from Pool...
                </div>
              ) : undrawnList.length === 0 ? (
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All Participant Codes Drawn!</span>
                </div>
              ) : (
                <div className="text-xs text-stone-400">
                  {undrawnList.length} candidate codes remaining in pool.
                </div>
              )}

              {/* Draw Trigger Button */}
              <button
                onClick={handleStartDraw}
                disabled={isSpinning || undrawnList.length === 0}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E6A916] via-[#f3c242] to-[#c98e09] text-stone-900 font-serif font-black text-base shadow-xl hover:shadow-[0_0_30px_rgba(230,169,22,0.5)] active:scale-98 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {drawnResults.length === 0 ? 'START FIRST RANDOM DRAW' : 'DRAW NEXT PARTICIPANT CODE'}
                </span>
              </button>
            </div>
          </div>

          {/* Grand Reveal Card (Appears after winning draw) */}
          {justDrawnResult && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-2 border-[#E6A916] shadow-lg animate-fadeIn">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-[11px] uppercase tracking-wider">
                      Draw #{justDrawnResult.drawOrder}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      Official Stage Entry Sequence
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="font-mono font-black text-3xl sm:text-4xl text-[#A91F35]">
                      {justDrawnResult.codeLetter}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-stone-800">
                      {justDrawnResult.studentName}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg font-bold">
                      Team: {justDrawnResult.teamName || 'Independent'}
                    </span>
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg font-mono">
                      Admn: {justDrawnResult.admissionNo || '—'}
                    </span>
                    <span className="bg-stone-100 px-2.5 py-1 rounded-lg">
                      Time: {new Date(justDrawnResult.drawnAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#A91F35] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#E6A916]" />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Right Arena: 5 cols (Official Draw Sequence Roster) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 mb-4">
              <div>
                <h3 className="font-serif font-black text-base text-stone-900">
                  Official Stage Calling Sequence
                </h3>
                <p className="text-[11px] text-stone-500">
                  Permanent order established by live random draw
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-mono text-xs font-bold">
                {drawnResults.length} / {codeAssignments.length}
              </span>
            </div>

            {/* List of Drawn Sequence */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {drawnResults.length === 0 ? (
                <div className="py-16 text-center text-stone-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs">No participants drawn yet.</p>
                  <p className="text-[10px] text-stone-400">Click &ldquo;START RANDOM DRAW&rdquo; to begin ceremony.</p>
                </div>
              ) : (
                drawnResults.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/50 border border-stone-200/70 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#A91F35] text-white text-xs font-black flex items-center justify-center font-mono shrink-0">
                        #{item.drawOrder}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#A91F35]">
                            {item.codeLetter}
                          </span>
                          <span className="font-bold text-xs text-stone-800 line-clamp-1">
                            {item.studentName}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {item.teamName || 'Independent'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-stone-400 block">
                        {new Date(item.drawnAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Queued
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action to proceed to Participant Calling System */}
          <div className="pt-4 border-t border-stone-200/80 space-y-2">
            <button
              onClick={() => onProceedToCalling && onProceedToCalling(selectedCompId)}
              disabled={drawnResults.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-black shadow-md hover:shadow-lg transition-all disabled:opacity-40"
            >
              <span>PROCEED TO PARTICIPANT CALLING</span>
              <ArrowRight className="w-4 h-4 text-[#E6A916]" />
            </button>
            <p className="text-[10px] text-center text-stone-400">
              Draw order is immutable and will dictate stage entry calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
