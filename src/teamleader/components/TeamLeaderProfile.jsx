import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Shield,
  KeyRound,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  Lock
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderProfile({ teamId, leaderSession, onLogout }) {
  const [profile, setProfile] = useState(() => festivalStore.getTeamLeaderProfile(teamId));
  const [phone, setPhone] = useState(profile.phone || '');
  const [email, setEmail] = useState(profile.email || '');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    try {
      festivalStore.updateTeamLeaderProfile(teamId, { phone, email });
      setProfile(festivalStore.getTeamLeaderProfile(teamId));
      showToast('Contact details updated successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }

    try {
      festivalStore.updateTeamLeaderPassword(teamId, oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-white ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-serif font-black text-2xl shadow-md">
            {profile.name.charAt(0)}
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2 py-0.5 rounded-full inline-block">
              Squad Leader Profile
            </div>
            <h2 className="text-xl font-serif font-black text-stone-900">{profile.name}</h2>
            <div className="text-xs text-stone-500">
              Assigned Team: <strong className="text-stone-800">{profile.teamName}</strong> ({profile.teamId})
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information Form */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
            <User className="w-4 h-4 text-[#A91F35]" />
            <span>Leader Contact Details</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-600 block mb-1">Squad Leader Name (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.name}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-stone-600 block mb-1">Official Portal Username (Protected)</label>
              <input
                type="text"
                disabled
                value={profile.loginUsername || (profile.teamId === 'team-1' ? 'noufal@teamleader' : 'hashim@teamleader')}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-stone-600 block mb-1">Authorized Team (Protected)</label>
              <input
                type="text"
                disabled
                value={`${profile.teamName} (${profile.teamId})`}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-stone-600 block mb-1">Assistant Leader Details (Protected)</label>
              <input
                type="text"
                disabled
                value={`${profile.asstLeader || (profile.teamId === 'team-1' ? 'Hafiz Hassan' : 'Irfan Edayyur')} • ${profile.asstLeaderStudentId || (profile.teamId === 'team-1' ? 'STU-1002' : 'STU-1008')}`}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Notification Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e192c] text-white font-bold shadow-xs transition-colors"
              >
                Save Contact Details
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Change Secret Password</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">New Password (Min 6 chars)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold shadow-xs transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
