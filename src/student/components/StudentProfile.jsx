import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, Phone, Mail, Calendar, Building, Lock,
  Edit2, CheckCircle2, AlertCircle, HelpCircle, X,
  Save, RefreshCw, Send, Sparkles
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentProfile({ studentSession }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  
  // Correction Request Modal
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionField, setCorrectionField] = useState('name');
  const [proposedValue, setProposedValue] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);

  const studentId = studentSession?.id;

  const loadProfile = () => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentProfile(studentId);
      setProfile(data);
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setBio(data.bio || '');
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [studentId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    setError('');
    try {
      festivalStore.updateStudentProfile(studentId, { phone, email, bio });
      setIsEditing(false);
      showToast('Contact details successfully updated.');
      loadProfile();
    } catch (err) {
      setError(err.message || 'Failed updating profile.');
    }
  };

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingCorrection(true);
    try {
      festivalStore.requestStudentCorrection(studentId, {
        field: correctionField,
        currentVal: profile ? profile[correctionField] : '',
        proposedVal: proposedValue,
        reason: correctionReason
      });
      setIsCorrectionModalOpen(false);
      setProposedValue('');
      setCorrectionReason('');
      showToast('Correction ticket submitted to Festival Secretariat for review.');
    } catch (err) {
      setError(err.message || 'Failed submitting correction request.');
    } finally {
      setIsSubmittingCorrection(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#A91F35] text-white flex items-center justify-center font-serif font-black text-2xl shadow-md border-2 border-[#E6A916]">
              {profile?.name ? profile.name.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-bold text-xs">
                  {profile?.chestNo}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {profile?.status || 'Active'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 mt-1">
                {profile?.name}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {profile?.institution || 'Dalailussunna Dars, Ayiroor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsCorrectionModalOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Request Correction</span>
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e172a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Contact'}</span>
            </button>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Protected Institutional Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Protected Institutional Credentials</span>
            </h3>

            <div className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/60 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Chest Number</span>
                <span className="font-mono font-black text-stone-900">{profile?.chestNo}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Class Category</span>
                <span className="font-bold text-stone-800">{profile?.classCategory} Category</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Official Squad</span>
                <span className="font-bold text-[#A91F35]">{profile?.teamName}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                <span className="font-medium text-stone-800">{profile?.dob || '2008-05-15'}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Account Role</span>
                <span className="font-medium text-stone-800">Student Delegate (Dalailussunna Dars)</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 italic">
              * Protected credentials can only be amended by the Festival Convener or Admin Secretariat.
            </p>
          </div>

          {/* Contact & Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>Personal Contact Details</span>
            </h3>

            {isEditing ? (
              <form onSubmit={handleSaveContact} className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98471 ..."
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@dalanzia.org"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Student Bio / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio or festival interests..."
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#A91F35] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#8e172a]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Contact Details</span>
                </button>
              </form>
            ) : (
              <div className="space-y-3 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/60 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Contact Phone</span>
                  <span className="font-semibold text-stone-900">{profile?.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="font-semibold text-stone-900">{profile?.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Bio / Notes</span>
                  <span className="font-medium text-stone-700">{profile?.bio || 'Festival candidate at Dalenzia Fest 2K26.'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Registration Date</span>
                  <span className="font-medium text-stone-700">{profile?.registeredAt || 'Nov 2026'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Correction Request Modal */}
      <AnimatePresence>
        {isCorrectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="font-serif font-black text-base text-stone-900">
                  Request Official Correction
                </h3>
                <button
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCorrectionSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Select Field to Correct
                  </label>
                  <select
                    value={correctionField}
                    onChange={(e) => setCorrectionField(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:border-[#A91F35]"
                  >
                    <option value="name">Candidate Full Name</option>
                    <option value="dob">Date of Birth</option>
                    <option value="classCategory">Class Category</option>
                    <option value="gender">Gender</option>
                    <option value="teamName">Squad Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Proposed Correct Value
                  </label>
                  <input
                    type="text"
                    required
                    value={proposedValue}
                    onChange={(e) => setProposedValue(e.target.value)}
                    placeholder="Enter the correct value"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Reason / Official Justification
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    placeholder="Explain why this requires administrative correction..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:border-[#A91F35]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCorrectionModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCorrection}
                    className="px-4 py-2 rounded-xl bg-[#A91F35] text-white font-bold hover:bg-[#8e172a] flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingCorrection ? 'Submitting...' : 'Submit Request'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
