import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Trophy,
  Award,
  Crown,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';
import TeamCharterPdfModal from '../../components/TeamCharterPdfModal';

export default function TeamLeaderMyTeam({ teamId, onNavigateModule }) {
  const [team, setTeam] = useState(() => festivalStore.getTeamById(teamId));
  const [leaderProfile, setLeaderProfile] = useState(() => festivalStore.getTeamLeaderProfile(teamId));
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setTeam(festivalStore.getTeamById(teamId));
      setLeaderProfile(festivalStore.getTeamLeaderProfile(teamId));
    });
    return () => unsub();
  }, [teamId]);

  if (!team) {
    return <div className="p-8 text-center text-xs text-stone-500">Team squad details not found.</div>;
  }

  const students = team.students || [];
  const seniorCount = students.filter(s => (s.classCategory || s.category) === 'Senior').length;
  const juniorCount = students.filter(s => (s.classCategory || s.category) === 'Junior').length;
  const subJuniorCount = students.filter(s => (s.classCategory || s.category) === 'Sub Junior').length;

  const isTeam1 = teamId === 'team-1';
  const themeBg = isTeam1 ? 'bg-[#A91F35]' : 'bg-[#E6A916]';

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Senior':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Junior':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sub Junior':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. SQUAD OVERVIEW CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${themeBg} text-white flex items-center justify-center font-serif font-black text-2xl sm:text-3xl shadow-lg shrink-0`}
          >
            {team.badge || '👑'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2 py-0.5 rounded-full">
                Official Squad
              </span>
              <span className="text-xs font-mono font-bold text-stone-500">
                ID: {team.id} ({team.code})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              {team.name}
            </h1>
            <div className="text-xs text-stone-500 font-medium">
              Zone: <strong>Dalailussunna Dars, Ayiroor</strong> • Status:{' '}
              <strong className="text-emerald-700">{team.status}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="p-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#A91F35]" />
            <span>Charter PDF</span>
          </button>
          <div className="p-4 rounded-2xl bg-[#A91F35] text-white text-center flex-1 md:flex-none md:min-w-36 shadow-md">
            <div className="text-[10px] font-bold text-[#E6A916] uppercase tracking-wider">Total Strength</div>
            <div className="text-2xl font-serif font-black">
              {students.length} <span className="text-xs font-sans text-white/70">members</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS & LEADERSHIP WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Squad Strength */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Category Strength</div>
            <div className="text-xl font-serif font-black text-stone-900 mt-1">{students.length} Students</div>
            <div className="text-[11px] text-stone-500 mt-1 flex flex-wrap gap-1.5">
              <span>{seniorCount} Snr</span> • <span>{juniorCount} Jnr</span> •{' '}
              <span>{subJuniorCount} Sub-Jnr</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Team Leader */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Team Leader</div>
            <div className="text-base font-bold text-stone-900 mt-1">(L) {team.leader}</div>
            <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#A91F35]" />
              <span>{leaderProfile?.phone || team.leaderContact || '+91 98471 20001'}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#A91F35] flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        {/* Assistant Leader */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Assistant Leader</div>
            <div className="text-base font-bold text-stone-900 mt-1">(AL) {team.asstLeader || leaderProfile?.asstLeader || (teamId === 'team-1' ? 'Hafiz Hassan' : 'Irfan Edayyur')}</div>
            <div className="text-xs text-stone-500 mt-0.5">
              <span>Official Co-Adjudicator</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. SQUAD ROSTER TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-base text-stone-900">Enrolled Squad Roster</h3>
            <p className="text-xs text-stone-500">Official student candidates registered under {team.name}</p>
          </div>
          <button
            onClick={() => onNavigateModule && onNavigateModule('students')}
            className="px-4 py-2 rounded-2xl bg-[#A91F35] text-white hover:bg-[#8e192c] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Manage Candidates & Allocation</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Chest No</th>
                <th className="py-3 px-4">Student Candidate</th>
                <th className="py-3 px-4">Official Category</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No candidates currently in this team roster.
                  </td>
                </tr>
              ) : (
                students.map((s, idx) => {
                  const isLeader = s.id === team.leaderStudentId || s.name === team.leader;
                  const isAsstLeader = s.id === team.asstLeaderStudentId || s.name === team.asstLeader;

                  return (
                    <tr key={s.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 text-center font-mono font-bold text-stone-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{s.chestNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{s.name}</div>
                        <div className="text-[10px] text-stone-500 font-mono">ID: {s.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getCategoryBadgeClass(
                            s.classCategory
                          )}`}
                        >
                          {s.classCategory || 'Sub Junior'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isLeader ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#A91F35] text-white font-bold text-[10px]">
                            <Crown className="w-3 h-3 text-[#E6A916]" />
                            <span>Team Leader</span>
                          </span>
                        ) : isAsstLeader ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6A916] text-stone-900 font-bold text-[10px]">
                            <Shield className="w-3 h-3 text-[#A91F35]" />
                            <span>Asst Leader</span>
                          </span>
                        ) : (
                          <span className="text-stone-500 font-medium">Member</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Team Charter PDF Modal */}
      <TeamCharterPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        highlightTeamId={teamId}
      />
    </div>
  );
}
