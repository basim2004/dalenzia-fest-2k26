import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic2, Lock, ArrowRight, ShieldCheck, AlertCircle,
  Globe, HelpCircle, Radio, Sparkles, MapPin, Tv,
  Eye, EyeOff
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import { unifiedLogin, unifiedChangePassword } from '../../services/unifiedAuthService';
import UnifiedPasswordModal from '../../components/auth/UnifiedPasswordModal';

export default function StageControllerLogin({ onLoginSuccess, onNavigatePublic }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // First-login password change state
  const [pendingSession, setPendingSession] = useState(null);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await unifiedLogin(emailOrUsername, password, 'STAGE_CONTROLLER');
      setIsLoading(false);

      if (res && res.success) {
        if (res.mustChangePassword) {
          setPendingSession({
            ...res.session,
            currentPasswordUsed: password
          });
          setShowFirstLoginModal(true);
          return;
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('dalenzia_stage_session', JSON.stringify(res.session));
          localStorage.setItem('dalanzia_stage_controller_session', JSON.stringify(res.session));
        }
        onLoginSuccess(res.session);
      } else {
        setError(res?.error || 'Invalid Stage Controller credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Invalid Stage Controller credentials.');
    }
  };

  const handleFirstTimePasswordSubmit = async ({ newPassword }) => {
    if (!pendingSession) return;
    await unifiedChangePassword('STAGE_CONTROLLER', pendingSession.id, pendingSession.currentPasswordUsed, newPassword);
    const updatedSession = { ...pendingSession, mustChangePassword: false };
    delete updatedSession.currentPasswordUsed;
    setShowFirstLoginModal(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dalenzia_stage_session', JSON.stringify(updatedSession));
      localStorage.setItem('dalanzia_stage_controller_session', JSON.stringify(updatedSession));
    }
    onLoginSuccess(updatedSession);
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
                  Authorized Username
                </label>
                <div className="relative">
                  <Radio className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                    placeholder="Enter stage controller username"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-[#A91F35] hover:bg-[#8e172a] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                <span>{isLoading ? 'Verifying...' : 'Access Stage Operations'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Mandatory First-Login Password Change Modal */}
      <UnifiedPasswordModal
        isOpen={showFirstLoginModal}
        isFirstLogin={true}
        portalTitle="Stage Controller Operations"
        userName={pendingSession?.name || "Stage Controller"}
        initialPasswordUsed={pendingSession?.currentPasswordUsed || ""}
        onSubmit={handleFirstTimePasswordSubmit}
        onClose={() => setShowFirstLoginModal(false)}
      />

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
                Stage Controllers manage designated stage schedules, live random code draws, participant calling, and stage displays. Please sign in with your authorized official credentials.
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
