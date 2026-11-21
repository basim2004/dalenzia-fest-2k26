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
  X
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function AdminLogin({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('admin@dalenziafest.in');
  const [password, setPassword] = useState('dalenzia2k26');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('super_admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please provide both username/email and password.');
      return;
    }

    setIsLoading(true);

    // Secure authentication check via backend store
    setTimeout(() => {
      setIsLoading(false);
      const res = festivalStore.verifyAdminLogin(identifier, password, role);
      if (res.success) {
        sessionStorage.removeItem('dalenzia_convener_session');
        sessionStorage.setItem('dalenzia_admin_session', JSON.stringify(res.session));
        onLoginSuccess(res.session);
      } else {
        setError(res.error || 'Invalid developer credentials. Access restricted.');
      }
    }, 500);
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
    <div className="min-h-screen bg-[#F7F3E9] flex flex-col justify-center items-center p-4 selection:bg-[#A91F35] selection:text-white font-sans relative overflow-hidden">
      {/* Background Decorative Architecture Watermark */}
      <div className="absolute right-[-10%] top-[-5%] w-[600px] opacity-5 pointer-events-none select-none">
        <img
          src="/assets/nueva_era_logo.png"
          alt="Theme Emblem"
          className="w-full object-contain filter grayscale"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#A91F35]/20 overflow-hidden relative z-10"
      >
        {/* Top Crimson Header with Official Logos */}
        <div className="bg-[#A91F35] p-6 text-center text-white relative">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img
              src="/assets/dalenzia_fest_logo.png"
              alt="Dalenzia Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="w-[1px] h-6 bg-[#E6A916]/40" />
            <img
              src="/assets/nueva_era_logo.png"
              alt="Nueva Era Logo"
              className="h-9 w-auto object-contain"
            />
          </div>

          <h2 className="text-xl font-serif font-black tracking-tight">
            Developer & Admin Console
          </h2>
          <p className="text-[11px] font-semibold text-[#E6A916] uppercase tracking-[0.2em] mt-1">
            DALENZIA FEST 2K26 · RESTRICTED ACCESS
          </p>

          <div className="absolute top-4 right-4 bg-[#E6A916]/20 border border-[#E6A916]/40 text-[#E6A916] text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>SECURE</span>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-[#1c1917]">
              Developer & System Administrator Login
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Enter your authorized developer or administrative credentials to access system controls.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Official Email or ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@dalenziafest.in"
                  className="w-full bg-[#FAF7F0] pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] font-bold text-[#A91F35] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF7F0] pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role-Based Selector for testing / multi-role */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Access Profile
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="super_admin">Super Admin (Full Festival Access)</option>
                <option value="result_mgr">Result & Tabulation Manager</option>
                <option value="reg_mgr">Registration Coordinator</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#A91F35] hover:bg-[#8B1A2C] text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-2 group"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Control Centre</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="pt-2 border-t border-stone-200 text-center">
            <p className="text-[11px] text-stone-500 font-medium">
              Demo Credentials: <span className="font-mono text-stone-800 font-bold">admin@dalenziafest.in</span> / <span className="font-mono text-stone-800 font-bold">dalenzia2k26</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border-2 border-[#A91F35]"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-serif font-bold text-[#1c1917]">
                  Reset Operator Password
                </h4>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {resetSent ? (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Password reset link sent to your registered email address.</span>
                </div>
              ) : (
                <form onSubmit={handleSendReset} className="space-y-4">
                  <p className="text-xs text-stone-600 font-medium">
                    Enter your verified administrator email address to receive secure OTP instructions.
                  </p>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter official email"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#A91F35] text-white hover:bg-[#8B1A2C]"
                    >
                      Send Reset Instructions
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
