import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function UnifiedPasswordModal({
  isOpen,
  isFirstLogin = true,
  portalTitle = "Portal",
  userName = "User",
  initialPasswordUsed = "",
  onSubmit,
  onClose
}) {
  const [currentPassword, setCurrentPassword] = useState(initialPasswordUsed || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (initialPasswordUsed && newPassword.trim() === initialPasswordUsed.trim()) {
      setError('New password cannot be your initial temporary credential.');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        currentPassword: currentPassword || initialPasswordUsed,
        newPassword
      });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#A91F35] text-white p-6 text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#E6A916] text-[#A91F35] flex items-center justify-center mx-auto mb-3 shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#E6A916] bg-black/20 px-3 py-0.5 rounded-full inline-block mb-1">
              {isFirstLogin ? "Mandatory First-Time Setup" : "Account Security"}
            </div>
            <h3 className="text-xl font-serif font-black">
              {isFirstLogin ? "Update Initial Password" : "Change Password"}
            </h3>
            <p className="text-xs text-white/80 mt-1 max-w-xs mx-auto">
              {isFirstLogin
                ? `Welcome, ${userName}. Please replace your initial temporary credential with a private password.`
                : `Update your secret password for ${portalTitle}.`}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isFirstLogin && (
              <div>
                <label className="block font-bold text-stone-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35] font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                New Password (Minimum 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new private password"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35] font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#A91F35] font-semibold"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              {!isFirstLogin && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2.5 rounded-xl bg-[#A91F35] hover:bg-[#8B1A2C] text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  !isFirstLogin && onClose ? 'w-1/2' : 'w-full'
                }`}
              >
                {isLoading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <span>{isFirstLogin ? "Save & Enter Portal" : "Update Password"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
