import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Lock, Mail, ArrowRight, ShieldCheck,
  AlertCircle, Sparkles, CheckCircle2, Globe, HelpCircle,
  UserCheck, Award, QrCode, Eye, EyeOff
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import { unifiedLogin, unifiedChangePassword } from '../../services/unifiedAuthService';
import UnifiedPasswordModal from '../../components/auth/UnifiedPasswordModal';

export default function StudentLogin({ onLoginSuccess, onNavigatePublic }) {
  const [chestNoOrEmail, setChestNoOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // First-login password change state
  const [pendingSession, setPendingSession] = useState(null);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await unifiedLogin(chestNoOrEmail, password, 'STUDENT');
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
          sessionStorage.setItem('dalenzia_student_session', JSON.stringify(res.session));
        }
        onLoginSuccess(res.session);
      } else {
        setError(res?.error || 'Invalid student credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Invalid student credentials.');
    }
  };

  const handleFirstTimePasswordSubmit = async ({ newPassword }) => {
    if (!pendingSession) return;
    await unifiedChangePassword('STUDENT', pendingSession.id, pendingSession.currentPasswordUsed, newPassword);
    const updatedSession = { ...pendingSession, mustChangePassword: false };
    delete updatedSession.currentPasswordUsed;
    setShowFirstLoginModal(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dalenzia_student_session', JSON.stringify(updatedSession));
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
            Student Portal
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
                <GraduationCap className="w-7 h-7" />
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
                Student Portal Login
              </h1>
              <p className="text-xs text-white/80 mt-1 max-w-xs font-medium">
                Dalailussunna Dars, Ayiroor • Dalenzia Fest 2K26
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
                  Authorized Username (username@student)
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={chestNoOrEmail}
                    onChange={(e) => setChestNoOrEmail(e.target.value)}
                    required
                    placeholder="e.g. stu1001@student or c101@student"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Password (Initial: Student ID)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-bold text-[#A91F35] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Official Student ID (e.g. STU-1001)"
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
                <span>{isLoading ? 'Authenticating...' : 'Enter Student Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Student Registry Notice */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <div className="p-3.5 rounded-2xl bg-[#F7F3E9] border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#A91F35]" />
                  <span>Standard Student Credentials</span>
                </div>
                <div>Username format: <strong className="font-mono text-stone-800">username@student</strong> (e.g. <span className="font-mono">stu1001@student</span>, <span className="font-mono">c101@student</span>).</div>
                <div>Initial Password: <strong className="font-mono text-stone-800">Your Official Student ID (e.g. STU-1001)</strong>. Must be changed upon first login.</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Mandatory First-Login Password Change Modal */}
      <UnifiedPasswordModal
        isOpen={showFirstLoginModal}
        isFirstLogin={true}
        portalTitle="Student Portal"
        userName={pendingSession?.name || "Student"}
        initialPasswordUsed={pendingSession?.currentPasswordUsed || ""}
        onSubmit={handleFirstTimePasswordSubmit}
        onClose={() => setShowFirstLoginModal(false)}
      />

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
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
              <h3 className="text-base font-serif font-black text-stone-900">Student Account Recovery</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Student accounts are securely managed by the Central Festival Registry. Default password is <span className="font-mono font-bold text-[#A91F35]">student2k26</span>. If you changed your password and forgot it, please contact the <strong>Festival Convener Secretariat</strong> or your official <strong>Team Leader</strong> to issue a password reset.
              </p>
              <button
                onClick={() => setShowForgotModal(false)}
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
        DALENZIA FEST 2K26 – NUEVA ERA • Student Portal • Dalailussunna Dars, Ayiroor
      </footer>
    </div>
  );
}
