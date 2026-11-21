import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Radio, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StageSettings({ stageId, stageInfo, onLogout, onProfileUpdated }) {
  const [name, setName] = useState(stageInfo?.controllerName || '');
  const [phone, setPhone] = useState(stageInfo?.phone || '');
  const [profileMsg, setProfileMsg] = useState(null);

  // Password fields
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState(null);

  // Update profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileMsg(null);
    const res = festivalStore.updateStageControllerProfile(stageId, { name, phone });
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Stage Controller profile updated successfully.' });
      if (onProfileUpdated) onProfileUpdated();
      setTimeout(() => setProfileMsg(null), 3500);
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  // Change password
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    const res = festivalStore.updateStageControllerPassword(stageId, oldPass, newPass);
    if (res.success) {
      setPassMsg({ type: 'success', text: 'Password successfully changed!' });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassMsg(null), 3500);
    } else {
      setPassMsg({ type: 'error', text: res.error || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#A91F35] uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4 text-[#E6A916]" />
          <span>Stage Desk Preferences</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1c1917]">
          Stage Controller Account & Security
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Manage your assigned stage profile, credentials, and audio cues for {stageInfo?.name || 'this stage'}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#A91F35] flex items-center justify-center">
              <User className="w-5 h-5 text-[#E6A916]" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-stone-900">
                Stage Controller Profile
              </h3>
              <p className="text-xs text-stone-500">Official desk identity</p>
            </div>
          </div>

          {profileMsg && (
            <div className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Assigned Stage Venue</label>
              <input
                type="text"
                disabled
                value={`${stageInfo?.name || 'Stage'} (${stageId})`}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-bold text-stone-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Official Controller Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={stageInfo?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-mono text-stone-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Controller Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 font-bold text-stone-800 focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 font-mono text-stone-800 focus:outline-none focus:border-[#A91F35]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#A91F35] hover:bg-[#801426] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Save className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Password & Security Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#A91F35] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#E6A916]" />
              </div>
              <div>
                <h3 className="font-serif font-black text-base text-stone-900">
                  Update Security Password
                </h3>
                <p className="text-xs text-stone-500">Stage credentials protection</p>
              </div>
            </div>

            {passMsg && (
              <div className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold mb-4 ${
                passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Update Password</span>
              </button>
            </form>
          </div>

          {/* Logout at bottom */}
          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out of Stage Controller</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
