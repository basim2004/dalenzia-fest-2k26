import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Calendar, Award, QrCode, Users, ArrowRight,
  Sparkles, CheckCircle2, Clock, MapPin, Megaphone,
  Download, Printer, AlertCircle, FileText, ChevronRight,
  GraduationCap, Star, LifeBuoy, Code2
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentDashboard({ studentSession, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [results, setResults] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [idCardData, setIdCardData] = useState(null);

  const studentId = studentSession?.id;

  const loadDashboardData = () => {
    if (!studentId) return;
    try {
      setStats(festivalStore.getStudentDashboardStats(studentId));
      setCompetitions(festivalStore.getStudentCompetitions(studentId));
      setProgrammes(festivalStore.getStudentProgrammes(studentId));
      setResults(festivalStore.getStudentPublishedResults(studentId));
      setAnnouncements(festivalStore.getStudentAnnouncements(studentId).slice(0, 3));
      setIdCardData(festivalStore.getStudentIdCardData(studentId));
    } catch (e) {
      console.error('Error loading student dashboard data:', e);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const unsub = festivalStore.subscribe(() => {
      loadDashboardData();
    });
    return () => unsub();
  }, [studentId]);

  return (
    <div className="space-y-6">
      {/* 1. HERO SQUAD & CANDIDATE BANNER */}
      <div className="bg-[#A91F35] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs uppercase tracking-wider shadow-xs">
                {studentSession?.classCategory || 'Student'} Category
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-white font-bold text-xs">
                {studentSession?.teamName} Squad
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/80 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Verified & Synchronized
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              {studentSession?.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
              Official delegate for <strong>{studentSession?.teamName}</strong> (Chest No: <strong className="font-mono text-[#E6A916]">{studentSession?.chestNo}</strong>). Track your assigned stage arenas, view jury standings, and inspect your official credentials.
            </p>
          </div>

          {/* Quick Team Standing Metric */}
          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center gap-5 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-white/60 uppercase font-black tracking-wider">
                Official Points Earned
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-black text-[#E6A916]">
                {stats?.totalPointsContributed || 0} <span className="text-sm font-sans font-medium text-white/80">pts</span>
              </div>
              <div className="text-[11px] text-white/70">
                Team Total: <strong>{stats?.teamPoints || 0} pts</strong> (Rank #{stats?.teamRank || 1})
              </div>
            </div>

            <button
              onClick={() => onNavigate('idcard')}
              className="p-3 bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] rounded-xl font-bold transition-all shadow-md active:scale-95 flex flex-col items-center justify-center gap-1 text-[11px]"
            >
              <QrCode className="w-5 h-5" />
              <span>Digital ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. LIVE KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Competitions', value: stats?.registeredCompetitionsCount || 0, sub: 'Stage Arenas', icon: Trophy, action: 'competitions' },
          { label: 'Programmes', value: stats?.registeredProgrammesCount || 0, sub: 'Sessions', icon: Calendar, action: 'programmes' },
          { label: 'Podium Laurels', value: stats?.publishedAwardsCount || 0, sub: 'Certified Medals', icon: Award, action: 'results' },
          { label: 'Points Earned', value: stats?.totalPointsContributed || 0, sub: 'Team Contribution', icon: Star, action: 'results' },
          { label: 'Squad Rank', value: `#${stats?.teamRank || 1}`, sub: stats?.teamName || 'Team', icon: Users, action: 'team' },
          { label: 'Announcements', value: announcements.length, sub: 'Circulars', icon: Megaphone, action: 'announcements' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(kpi.action)}
              className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs text-left hover:border-[#A91F35]/40 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider truncate">
                  {kpi.label}
                </span>
                <Icon className="w-4 h-4 text-[#A91F35] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl font-serif font-black text-stone-900 leading-tight">
                {kpi.value}
              </div>
              <div className="text-[10px] text-stone-400 font-medium truncate mt-0.5">
                {kpi.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. SHORTCUTS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'View Digital ID Card', desc: 'Badge with QR verification', icon: QrCode, action: 'idcard' },
          { label: 'My Personalized Schedule', desc: 'Timeline for 21, 22, 23 DECEMBER 2026', icon: Clock, action: 'schedule' },
          { label: 'Official Results & Laurels', desc: 'Certified published awards', icon: Award, action: 'results' },
          { label: 'My Squad Roster', desc: 'Teammates & standings', icon: Users, action: 'team' }
        ].map((sc, i) => {
          const Icon = sc.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigate(sc.action)}
              className="p-3.5 bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:border-[#E6A916] hover:bg-stone-50/80 transition-all text-left flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-[#A91F35]/10 text-[#A91F35] group-hover:bg-[#A91F35] group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-[#A91F35] transition-colors">
                  {sc.label}
                </div>
                <div className="text-[10px] text-stone-500 font-medium">
                  {sc.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. TWO-COLUMN OPERATIONAL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upcoming Competitions */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#A91F35]/10 text-[#A91F35]">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-base text-stone-900">
                  My Upcoming Competitions
                </h3>
              </div>
              <button
                onClick={() => onNavigate('competitions')}
                className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1"
              >
                <span>View All ({competitions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {competitions.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <Trophy className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-stone-600">No competition registrations yet</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Your Team Leader registers delegates for stage arenas</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {competitions.slice(0, 3).map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/70 hover:border-stone-300 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] font-mono font-bold text-[10px]">
                          {comp.code}
                        </span>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {comp.type}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-900 line-clamp-1">
                        {comp.title}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" /> {comp.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" /> {comp.venue}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      comp.status === 'Result Published'
                        ? 'bg-amber-100 text-amber-800'
                        : comp.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Certified Results & Awards */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#E6A916]/20 text-[#A91F35]">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-base text-stone-900">
                  Certified Official Results
                </h3>
              </div>
              <button
                onClick={() => onNavigate('results')}
                className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1"
              >
                <span>All Laurels ({results.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {results.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <Award className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-stone-600">No published results yet</p>
                <p className="text-[11px] text-stone-400 mt-0.5">Certified scores appear immediately upon Convener publishing</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {results.map((res, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#E6A916]/10 border border-[#E6A916]/30 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#A91F35]">
                          {res.badge}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {res.competitionCode}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-900 line-clamp-1">
                        {res.competitionTitle}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Score: <strong>{res.score}</strong> • Published: {res.publishedAt}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black font-serif text-[#A91F35]">
                        +{res.points} pts
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                        Official
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. DIGITAL ID CARD MINI-PREVIEW & BULLETINS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Important Announcements */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-stone-100 text-[#A91F35]">
                <Megaphone className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-black text-base text-stone-900">
                Festival Notices & Bulletins
              </h3>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-bold text-[#A91F35] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {announcements.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">No new circulars at this moment.</p>
            ) : (
              announcements.map((anc) => (
                <div
                  key={anc.id}
                  className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/60 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#A91F35]/10 text-[#A91F35] uppercase">
                        {anc.priority || 'Notice'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {anc.publishedAt || 'Dec 2026'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900">
                      {anc.title}
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-2">
                      {anc.content || anc.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Digital ID Widget */}
        <div className="bg-gradient-to-br from-[#A91F35] to-[#7f1324] text-white rounded-3xl p-6 shadow-md border border-white/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E6A916]">
                Digital Pass
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px]">
                {idCardData?.chestNo}
              </span>
            </div>

            <div>
              <div className="text-lg font-serif font-black">{idCardData?.studentName}</div>
              <div className="text-xs text-white/80 font-medium">{idCardData?.teamName} Squad</div>
              <div className="text-[10px] text-white/60 mt-0.5">{idCardData?.institution}</div>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
              <div>
                <div className="text-[9px] text-white/60 uppercase">Dates</div>
                <div className="font-bold text-[11px]">21, 22, 23 DECEMBER 2026</div>
              </div>
              <QrCode className="w-8 h-8 text-[#E6A916]" />
            </div>
          </div>

          <button
            onClick={() => onNavigate('idcard')}
            className="w-full mt-4 py-2.5 bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <span>Full ID Card & Print</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. STUDENT SUPPORT & ASSISTANCE GATEWAYS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Convener Helpdesk Summary */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#A91F35]/15 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-black uppercase tracking-wider">
              <LifeBuoy className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Official Festival Helpdesk</span>
            </div>
            <h4 className="font-serif font-black text-lg text-stone-900">
              IRFAN ERAMANGALAM
            </h4>
            <p className="text-xs text-stone-600 font-medium">
              Festival Convener · Official Secretariat Support
            </p>
            <p className="font-mono text-sm font-bold text-[#A91F35]">
              +91 90481 31562
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href="tel:+919048131562"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8D182B] transition-all"
            >
              Call Convener
            </a>
            <button
              onClick={() => onNavigate('helpdesk')}
              className="flex-1 text-center py-2 px-3 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition-all cursor-pointer"
            >
              Report a Problem
            </button>
          </div>
        </div>

        {/* Developer Support Summary */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#E6A916]/30 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6A916]/15 text-[#A91F35] text-[10px] font-black uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Developer Technical Support</span>
            </div>
            <h4 className="font-serif font-black text-lg text-stone-900">
              BASIM ASLAM
            </h4>
            <p className="text-xs text-stone-600 font-medium">
              Edayur · System Developer & Portal Technical Engine
            </p>
            <div className="flex flex-wrap items-center gap-x-4 text-xs font-mono font-bold text-stone-800">
              <span>+91 6282925271</span>
              <span>+91 8547931509</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate('devsupport')}
              className="w-full text-center py-2 px-3 rounded-xl bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>View Developer Support & QR Codes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
