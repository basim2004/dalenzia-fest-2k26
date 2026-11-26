import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Download, X, Shield, Award, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';

export default function TeamCharterPdfModal({ isOpen, onClose, highlightTeamId = null }) {
  const printRef = useRef(null);
  const teams = festivalStore.getTeams();
  const team1 = teams.find(t => t.id === 'team-1') || teams[0];
  const team2 = teams.find(t => t.id === 'team-2') || teams[1];

  if (!isOpen) return null;

  // Filter out leaders from the numbered members list to match official PDF layout:
  // (L) Noufal, (AL) Hafiz Hassan on top, then 1..21 numbered members
  const getNumberedMembers = (team) => {
    if (!team || !team.students) return [];
    const leaderId = team.leaderStudentId || '';
    const asstId = team.asstLeaderStudentId || '';
    const leaderName = (team.leader || '').toLowerCase().trim();
    const asstName = (team.asstLeader || '').toLowerCase().trim();

    return team.students.filter(s => {
      const sId = (s.id || '').trim();
      const sName = (s.name || '').toLowerCase().trim();
      if (sId && (sId === leaderId || sId === asstId)) return false;
      if (sName === leaderName || sName === asstName) return false;
      return true;
    });
  };

  const team1Members = getNumberedMembers(team1);
  const team2Members = getNumberedMembers(team2);

  const handlePrint = () => {
    window.print();
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Senior':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Junior':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sub Junior':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 print:border-none print:shadow-none print:max-w-none print:rounded-none"
        >
          {/* Top Action Bar (Hidden in Print) */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between gap-4 print:hidden border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  DALENZIA FEST 2K26 • OFFICIAL TEAM CHARTER
                </h3>
                <p className="text-[11px] text-stone-400">
                  Authoritative team arrangement based on Dalenzia_Teams.pdf
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Team Charter Sheet */}
          <div
            ref={printRef}
            className="p-6 sm:p-10 bg-[#FAF7F2] text-[#1f191b] font-sans print:p-6 print:bg-white printable-team-charter"
          >
            {/* 1. Header with Official Logos & Festive Typography */}
            <div className="text-center space-y-2 mb-8 border-b border-stone-200 pb-6 print:border-stone-300">
              {/* Crest Logo */}
              <div className="flex justify-center mb-1">
                <img
                  src="/assets/dalenzia_fest_logo.png"
                  alt="Dars Crest"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>

              {/* Nueva Era Campaign Title */}
              <div className="flex flex-col items-center">
                <div className="font-serif font-black text-3xl sm:text-4xl text-[#E6A916] tracking-wider uppercase drop-shadow-xs">
                  NUEVA <span className="text-[#A91F35]">ERA</span>
                </div>
                <div className="text-[11px] sm:text-xs font-serif italic text-stone-600 tracking-widest mt-0.5">
                  A New Era Begins
                </div>
              </div>

              {/* Dalenzia Fest Title */}
              <div className="mt-2">
                <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#A91F35] tracking-tight">
                  Dalenzia <span className="text-[#E6A916]">Fest</span>
                </h1>
                <div className="text-[10px] font-black uppercase tracking-widest text-stone-500 mt-0.5">
                  Second Edition • 2K26
                </div>
              </div>

              {/* Festival Dates & Official Venue */}
              <div className="pt-2">
                <div className="inline-block px-4 py-1 rounded-full bg-[#A91F35] text-white text-xs sm:text-sm font-black tracking-wider">
                  2026 DEC 21, 22, 23 | MON, TUE, WED
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-stone-600 mt-2 max-w-xl mx-auto leading-relaxed">
                  Thaqwa Juma Masjid Ayiroor - Masjidul Liwah, Kandu Bazaar, Puthanpalli, Ayiroor
                </p>
              </div>
            </div>

            {/* 2. Two Column Team Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
              {/* ===================== TEAM 1 (CRIMSON) ===================== */}
              <div
                className={`rounded-2xl border-2 overflow-hidden bg-white shadow-xs transition-all ${
                  highlightTeamId === 'team-1' ? 'border-[#A91F35] ring-4 ring-[#A91F35]/20' : 'border-[#A91F35]/30'
                }`}
              >
                {/* Header Pill */}
                <div className="bg-[#A91F35] text-white py-3 px-4 text-center">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                    {team1?.name || 'TEAM 1'}
                  </h2>
                </div>

                {/* Leadership Section */}
                <div className="p-4 bg-rose-50/50 border-b border-rose-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#A91F35]">
                      (L) {team1?.leader || 'Noufal'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Senior
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#A91F35]">
                      (AL) {team1?.asstLeader || 'Hafiz Hassan'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Senior
                    </span>
                  </div>
                </div>

                {/* Numbered Members List */}
                <div className="divide-y divide-stone-100">
                  {team1Members.length > 0 ? (
                    team1Members.map((member, idx) => (
                      <div
                        key={member.id || idx}
                        className={`px-4 py-2 flex items-center justify-between text-xs sm:text-sm ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-right font-black text-stone-500 font-mono text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-stone-900">
                            {member.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                            member.classCategory
                          )}`}
                        >
                          {member.classCategory || 'Sub Junior'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-stone-400 italic">
                      No members allocated yet.
                    </div>
                  )}
                </div>

                {/* Footer Count */}
                <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] font-bold text-stone-600">
                  Total Squad Strength: {(team1?.students || []).length} Members
                </div>
              </div>

              {/* ===================== TEAM 2 (GOLDEN YELLOW) ===================== */}
              <div
                className={`rounded-2xl border-2 overflow-hidden bg-white shadow-xs transition-all ${
                  highlightTeamId === 'team-2' ? 'border-[#E6A916] ring-4 ring-[#E6A916]/20' : 'border-[#E6A916]/50'
                }`}
              >
                {/* Header Pill */}
                <div className="bg-[#E6A916] text-white py-3 px-4 text-center">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
                    {team2?.name || 'TEAM 2'}
                  </h2>
                </div>

                {/* Leadership Section */}
                <div className="p-4 bg-amber-50/50 border-b border-amber-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#D97706]">
                      (L) {team2?.leader || 'Hashim'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Senior
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#D97706]">
                      (AL) {team2?.asstLeader || 'Irfan Edayyur'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Senior
                    </span>
                  </div>
                </div>

                {/* Numbered Members List */}
                <div className="divide-y divide-stone-100">
                  {team2Members.length > 0 ? (
                    team2Members.map((member, idx) => (
                      <div
                        key={member.id || idx}
                        className={`px-4 py-2 flex items-center justify-between text-xs sm:text-sm ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-right font-black text-stone-500 font-mono text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-stone-900">
                            {member.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                            member.classCategory
                          )}`}
                        >
                          {member.classCategory || 'Sub Junior'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-stone-400 italic">
                      No members allocated yet.
                    </div>
                  )}
                </div>

                {/* Footer Count */}
                <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] font-bold text-stone-600">
                  Total Squad Strength: {(team2?.students || []).length} Members
                </div>
              </div>
            </div>

            {/* Official Certification Signature */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
              <div>
                <strong>Certified Official Roster</strong> • Dalenzia Fest 2K26 Academic Council
              </div>
              <div className="flex items-center gap-6">
                <span>Convener: Irfan Eramangalam</span>
                <span>General Secretary: Basim</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Print Specific CSS to ensure clean A4 formatting */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-team-charter, .printable-team-charter * {
            visibility: visible;
          }
          .printable-team-charter {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 10mm !important;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
