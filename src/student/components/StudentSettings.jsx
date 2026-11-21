import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Lock, KeyRound, Shield, CheckCircle2,
  AlertCircle, LogOut, Bell, Eye, EyeOff
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentSettings({ studentSession, onLogout }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Notification Preferences
  const [stageAlerts, setStageAlerts] = useState(true);
  const [resultAlerts, setResultAlerts] = useState(true);
  const [teamBulletins, setTeamBulletins] = useState(true);

  const studentId = studentSession?.id;

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setIsUpdating(true);
    try {
      festivalStore.updateStudentPassword(studentId, oldPassword, newPassword);
      setSuccessMsg('Your portal password has been changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed updating password.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <h2 className="text-xl font-serif font-black text-stone-900">
          Account & Security Settings
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage your portal access credentials, security keys, and alert preferences.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="p-2 rounded-xl bg-[#A91F35]/10 text-[#A91F35]">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-black text-base text-stone-900">
              Update Student Portal Password
            </h3>
            <p className="text-[11px] text-stone-500">
              Change the password used to access your student records and digital pass.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Current Password
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password (default: student2k26)"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:border-[#A91F35]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                New Password (min 6 characters)
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:border-[#A91F35]"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:border-[#A91F35]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-stone-600">
              <input
                type="checkbox"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
                className="rounded text-[#A91F35] focus:ring-[#A91F35]"
              />
              <span>Show password characters</span>
            </label>

            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 bg-[#A91F35] hover:bg-[#8e172a] text-white rounded-xl font-bold transition-all shadow-xs"
            >
              {isUpdating ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-black text-base text-stone-900">
              Notification Preferences
            </h3>
            <p className="text-[11px] text-stone-500">
              Configure alert channels and push bulletins.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 cursor-pointer">
            <div>
              <div className="font-bold text-stone-800">Stage Call & Schedule Alerts</div>
              <div className="text-[11px] text-stone-500">Alerts when your stage green room reporting time is called.</div>
            </div>
            <input
              type="checkbox"
              checked={stageAlerts}
              onChange={(e) => setStageAlerts(e.target.checked)}
              className="rounded text-[#A91F35] focus:ring-[#A91F35] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 cursor-pointer">
            <div>
              <div className="font-bold text-stone-800">Official Result Publishing Alerts</div>
              <div className="text-[11px] text-stone-500">Immediate alerts when the Convener publishes ratified marks.</div>
            </div>
            <input
              type="checkbox"
              checked={resultAlerts}
              onChange={(e) => setResultAlerts(e.target.checked)}
              className="rounded text-[#A91F35] focus:ring-[#A91F35] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 cursor-pointer">
            <div>
              <div className="font-bold text-stone-800">Squad Circulars from Team Leader</div>
              <div className="text-[11px] text-stone-500">Notices sent specifically to your squad delegates.</div>
            </div>
            <input
              type="checkbox"
              checked={teamBulletins}
              onChange={(e) => setTeamBulletins(e.target.checked)}
              className="rounded text-[#A91F35] focus:ring-[#A91F35] w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Role Protection Information Card */}
      <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200/80 text-xs text-stone-600 flex items-start gap-3">
        <Shield className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-stone-800">Institutional Access Policy</div>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Your account is authenticated as an official Student Delegate. Protected system properties (Student ID, Assigned Squad, Adjudication Marks, Scoring Data) cannot be modified through the client portal.
          </p>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Student Portal</span>
        </button>
      </div>
    </div>
  );
}
