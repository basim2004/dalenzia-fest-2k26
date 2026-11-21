import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic2, Lock, ArrowRight, ShieldCheck, AlertCircle,
  Globe, HelpCircle, Radio, Sparkles, MapPin, Tv
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StageControllerLogin({ onLoginSuccess, onNavigatePublic }) {
  const [emailOrUsername, setEmailOrUsername] = useState('controller1');
  const [password, setPassword] = useState('stage2k26');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const demoStages = [
    { id: 'controller1', stageId: 'STG-01', stageNumber: '01', name: 'Cordova Grand Stage', controller: 'Usthad Salman Farisi' },
    { id: 'controller2', stageId: 'STG-02', stageNumber: '02', name: 'Al-Farabi Heritage Hall', controller: 'Prof. Zakariyya Hudawi' },
    { id: 'controller3', stageId: 'STG-03', stageNumber: '03', name: 'Ibn Khaldun Academic Hall', controller: 'Usthad Zainul Abid' },
    { id: 'controller4', stageId: 'STG-04', stageNumber: '04', name: 'Media Studio Preview Room', controller: 'Usthad Bilal Shareef' },
    { id: 'controller5', stageId: 'STG-05', stageNumber: '05', name: 'Al-Andalus Exhibition Quadrangle', controller: 'Usthad Anas Faizy' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = festivalStore.verifyStageControllerLogin(emailOrUsername, password);
      if (result && result.session) {
        onLoginSuccess(result.session);
      }
    } catch (err) {
      setError(err.message || 'Invalid Stage Controller credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (stage) => {
    setEmailOrUsername(stage.id);
    setPassword('stage2k26');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] flex flex-col justify-between selection:bg-[#A91F35] selection:text-white font-sans">
      {/* Top Header Bar */}
      <header className="px-6 py-4 border-b border-stone-200/80 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-auto">
            <img
              src="/assets/dalenzia_fest_logo.png"
              alt="Dalenzia Fest 2K26"
              className="h-full w-auto object-contain"
            />
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] font-bold text-xs">
            Stage Operations Control
          </span>
        </div>

        <button
          onClick={onNavigatePublic}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] text-xs font-semibold transition-all shadow-2xs"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>
      </header>

      {/* Main Login Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-[#A91F35] text-white p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-black/20 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#E6A916] text-[#A91F35] flex items-center justify-center mb-3 shadow-md">
                <Mic2 className="w-7 h-7" />
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
                Stage Controller Portal
              </h1>
              <p className="text-xs text-white/80 mt-1 max-w-xs font-medium">
                21, 22, 23 DECEMBER 2026 • Live Random Code Draw & Calling
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Controller Username or Email
                </label>
                <div className="relative">
                  <Radio className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    placeholder="e.g. controller1 or controller1@dalenziafest.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-[11px] font-bold text-[#A91F35] hover:underline"
                  >
                    Help / Credentials
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter stage controller password"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-[#A91F35] hover:bg-[#8e172a] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-70"
              >
                <span>{isLoading ? 'Verifying...' : 'Access Stage Operations'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Stage Selector */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Select Assigned Stage
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Pass: stage2k26</span>
              </div>

              <div className="space-y-1.5">
                {demoStages.slice(0, 3).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleQuickSelect(st)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                      emailOrUsername.toLowerCase() === st.id
                        ? 'border-[#A91F35] bg-[#A91F35]/5 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#A91F35] text-white font-mono font-bold text-[10px]">
                        STAGE {st.stageNumber}
                      </span>
                      <div>
                        <div className="font-bold text-stone-900 text-xs truncate">{st.name}</div>
                        <div className="text-[10px] text-stone-500">{st.controller}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E6A916]/20 text-[#A91F35] flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-black text-stone-900">Stage Controller Access</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Stage Controllers manage designated stage schedules, live random code draws, participant calling, and stage displays. Default password for all stages is <span className="font-mono font-bold text-[#A91F35]">stage2k26</span>.
              </p>
              <button
                onClick={() => setShowHelpModal(false)}
                className="mt-5 w-full py-2.5 bg-[#A91F35] text-white rounded-xl text-xs font-bold hover:bg-[#8e172a] transition-all"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-200/60 bg-white/40">
        DALENZIA FEST 2K26 – NUEVA ERA • Stage Controller Operations • Dalailussunna Dars, Ayiroor
      </footer>
    </div>
  );
}
