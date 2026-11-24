import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  X,
  Compass,
  Building2,
  Calendar
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import { unifiedLogin, unifiedChangePassword } from '../../services/unifiedAuthService';
import UnifiedPasswordModal from '../../components/auth/UnifiedPasswordModal';

export default function ConvenerLogin({ onLoginSuccess, onNavigatePublic }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // First-login password change state
  const [pendingSession, setPendingSession] = useState(null);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please provide both Convener username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await unifiedLogin(identifier, password, 'CONVENER');
      setIsLoading(false);

      if (res.success) {
        if (res.mustChangePassword) {
          setPendingSession({
            ...res.session,
            currentPasswordUsed: password
          });
          setShowFirstLoginModal(true);
          return;
        }

        sessionStorage.removeItem('dalenzia_admin_session');
        sessionStorage.setItem('dalenzia_convener_session', JSON.stringify(res.session));
        onLoginSuccess(res.session);
      } else {
        setError(res.error || 'Invalid credentials. Access restricted to authorized Festival Convener.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Authentication error.');
    }
  };

  const handleFirstTimePasswordSubmit = async ({ newPassword }) => {
    if (!pendingSession) return;
    await unifiedChangePassword('CONVENER', pendingSession.id, pendingSession.currentPasswordUsed, newPassword);
    const updatedSession = { ...pendingSession, mustChangePassword: false };
    delete updatedSession.currentPasswordUsed;
    setShowFirstLoginModal(false);
    sessionStorage.removeItem('dalenzia_admin_session');
    sessionStorage.setItem('dalenzia_convener_session', JSON.stringify(updatedSession));
    onLoginSuccess(updatedSession);
  };

  const handleSendReset = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setShowForgotPassword(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#A91F35] selection:text-white">
      {/* Background radial gradient */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#A91F35_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-stone-200/80 space-y-6"
        >
          {/* Logo & Convener Badge */}
          <div className="text-center space-y-3">
            <div className="h-16 w-auto mx-auto flex items-center justify-center">
              <img
                src="/assets/dalenzia_fest_logo.png"
                alt="Dalenzia Fest 2K26"
                className="h-full w-auto object-contain drop-shadow-sm"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[11px] font-bold border border-[#A91F35]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Official Convener Operational Portal</span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
                Convener Authentication
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Dalailussunna Dars, Ayiroor • Festival Secretariat Operations
              </p>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">
                Official Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter official username"
                  required
                  className="w-full bg-[#FAF7F0] pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] font-bold text-[#A91F35] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-[#FAF7F0] pl-10 pr-10 py-2.5 rounded-2xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-[#A91F35] hover:bg-[#8B1A2C] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Access Convener Operations</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
            {onNavigatePublic && (
              <button
                type="button"
                onClick={onNavigatePublic}
                className="hover:text-[#A91F35] transition-colors"
              >
                ← Return to Public Site
              </button>
            )}
            <span className="text-[10px] text-stone-400">Festival Dates: 21, 22, 23 DECEMBER 2026</span>
          </div>
        </motion.div>
      </div>

      {/* Mandatory First-Login Password Change Modal */}
      <UnifiedPasswordModal
        isOpen={showFirstLoginModal}
        isFirstLogin={true}
        portalTitle="Convener Operational Portal"
        userName={pendingSession?.user || "Festival Convener"}
        initialPasswordUsed={pendingSession?.currentPasswordUsed || ""}
        onSubmit={handleFirstTimePasswordSubmit}
        onClose={() => setShowFirstLoginModal(false)}
      />

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-sm w-full border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#A91F35]">
                  <KeyRound className="w-5 h-5 text-[#E6A916]" />
                  <h3 className="font-serif font-bold text-base text-stone-900">Reset Password</h3>
                </div>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your authorized Convener email. The festival system administrator will issue a secure recovery key.
              </p>

              {resetSent ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password recovery link dispatched to administrator.</span>
                </div>
              ) : (
                <form onSubmit={handleSendReset} className="space-y-3">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter authorized email address"
                    required
                    className="w-full bg-[#FAF7F0] px-4 py-2.5 rounded-2xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-2xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all"
                  >
                    Send Recovery Request
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
