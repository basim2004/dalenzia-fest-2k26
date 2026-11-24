import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Phone,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import { unifiedLogin, unifiedChangePassword } from '../../services/unifiedAuthService';

export default function TeamLeaderLogin({ onLoginSuccess, onNavigatePublic }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // First-time password change modal state
  const [pendingSession, setPendingSession] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassLoading, setChangePassLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await unifiedLogin(emailOrUsername, password, 'TEAM_LEADER');
      if (res && res.success) {
        // If first login and must change password
        if (res.mustChangePassword) {
          setPendingSession({ ...res.session, currentPasswordUsed: password });
          setLoading(false);
          return;
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('dalenzia_teamleader_session', JSON.stringify(res.session));
        }
        onLoginSuccess(res.session);
      } else {
        setError(res?.error || 'Invalid Team Leader credentials.');
      }
    } catch (err) {
      setError(err.message || 'Invalid Team Leader credentials. Please check your username and phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleFirstTimePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangePassError('');

    if (!newPassword || newPassword.length < 6) {
      setChangePassError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePassError('New password and confirmation do not match.');
      return;
    }
    if (newPassword === pendingSession.phone || newPassword === pendingSession.currentPasswordUsed) {
      setChangePassError('New password cannot be your initial phone number.');
      return;
    }

    setChangePassLoading(true);
    try {
      await unifiedChangePassword(
        'TEAM_LEADER',
        pendingSession.teamId,
        pendingSession.currentPasswordUsed,
        newPassword
      );

      const finalSession = {
        ...pendingSession,
        mustChangePassword: false
      };
      delete finalSession.currentPasswordUsed;

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dalenzia_teamleader_session', JSON.stringify(finalSession));
      }
      onLoginSuccess(finalSession);
    } catch (err) {
      setChangePassError(err.message || 'Failed to update password.');
    } finally {
      setChangePassLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] flex flex-col justify-between text-[#1c1917] font-sans selection:bg-[#A91F35] selection:text-white">
      {/* Top Navbar */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 sm:h-12 w-auto">
            <img
              src="/assets/dalenzia_fest_logo.png"
              alt="Dalenzia Fest 2K26"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="hidden sm:block border-l border-stone-300 pl-3">
            <div className="text-xs font-black uppercase tracking-wider text-[#A91F35]">Team Leader Portal</div>
            <div className="text-[10px] text-stone-500 font-medium">Dalailussunna Dars, Ayiroor</div>
          </div>
        </div>

        <button
          onClick={onNavigatePublic}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-300 text-xs font-bold text-stone-700 hover:text-[#A91F35] hover:border-[#A91F35] bg-white transition-all shadow-xs"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center mx-auto shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
              Team Leader Login
            </h1>
            <p className="text-xs text-stone-500 font-medium max-w-xs mx-auto">
              Secure operational portal for authorized squad managers of DALENZIA FEST 2K26
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Leader Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="Enter team leader username"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8e192c] text-white font-extrabold tracking-wide shadow-lg shadow-[#A91F35]/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <span>{loading ? 'Authenticating Squad...' : 'Sign In to Squad Portal'}</span>
                <ArrowRight className="w-4 h-4 text-[#E6A916]" />
              </button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Mandatory First-Time Password Change Modal */}
      <AnimatePresence>
        {pendingSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-100 space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-serif">
                  First-Time Login Security Setup
                </h3>
                <p className="text-xs text-stone-600">
                  Welcome <strong>{pendingSession.user}</strong> ({pendingSession.teamName}). To secure your squad portal, please set your new secret password now.
                </p>
              </div>

              {changePassError && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{changePassError}</span>
                </div>
              )}

              <form onSubmit={handleFirstTimePasswordSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">New Password (Min 6 chars) *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new private password"
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new private password"
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changePassLoading}
                    className="w-full py-3 rounded-xl bg-[#A91F35] hover:bg-[#851627] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>{changePassLoading ? 'Setting New Password...' : 'Save Password & Enter Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 text-[#E6A916]" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-stone-400">
        DALENZIA FEST 2K26 – NUEVA ERA • Dalailussunna Dars, Ayiroor, Kerala
      </footer>
    </div>
  );
}
