import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Trophy
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderLogin({ onLoginSuccess, onNavigatePublic }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const teams = festivalStore.getTeams() || [];

  const handleTeamQuickSelect = (tId) => {
    setSelectedTeamId(tId);
    const leaderProfile = festivalStore.getTeamLeaderProfile(tId);
    if (leaderProfile) {
      setEmailOrUsername(leaderProfile.email || `leader${tId.replace('team-', '')}@dalenziafest.in`);
      setPassword('leader2k26');
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = festivalStore.verifyTeamLeaderLogin(emailOrUsername, password);
      if (res && res.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('dalenzia_teamleader_session', JSON.stringify(res.session));
        }
        onLoginSuccess(res.session);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your team leader credentials.');
    } finally {
      setLoading(false);
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

          {/* Squad Quick Selector when squads exist */}
          {teams.length > 0 ? (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-600 block">
                Select Registered Squad:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {teams.slice(0, 8).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTeamQuickSelect(t.id)}
                    className={`p-1.5 rounded-xl border text-[10px] font-bold transition-all truncate ${
                      selectedTeamId === t.id
                        ? 'bg-[#A91F35] text-white border-[#A91F35] shadow-xs'
                        : 'bg-[#F7F3E9] text-stone-700 border-stone-200 hover:border-[#A91F35]/40'
                    }`}
                    title={`${t.name} (${t.leader})`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-800 text-[11px]">
              <span className="font-bold">No teams registered yet.</span> Squads can be created in the Main Admin or Convener Portal.
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Leader Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="e.g. leader1@dalenziafest.in"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35] focus:ring-1 focus:ring-[#A91F35]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8e192c] text-white font-extrabold tracking-wide shadow-lg shadow-[#A91F35]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>{loading ? 'Authenticating Squad...' : 'Sign In to Squad Portal'}</span>
                <ArrowRight className="w-4 h-4 text-[#E6A916]" />
              </button>
            </div>
          </form>

          {/* Official Instructions */}
          <div className="p-3.5 rounded-2xl bg-[#F7F3E9] border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#A91F35]" />
              <span>Official Squad Portal Access</span>
            </div>
            <div>Sign in with your assigned Team Leader credentials. For credential queries, contact the Festival General Convener.</div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-stone-400">
        DALENZIA FEST 2K26 – NUEVA ERA • Dalailussunna Dars, Ayiroor, Kerala
      </footer>
    </div>
  );
}
