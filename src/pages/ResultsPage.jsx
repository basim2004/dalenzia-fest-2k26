import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientGoldParticles from '../components/AmbientGoldParticles';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Sparkles as SparklesIcon,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Share2,
  ExternalLink,
  Flame,
  Radio,
  FileText,
  X,
  Users,
  Star,
  Check,
  ChevronDown
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import { subscribeToTeams } from '../firebase/firebaseService';

export default function ResultsPage({
  onNavigateHome,
  onNavigateEvents,
  onNavigateGuests,
  onNavigateSchedule
}) {
  const [teamsList, setTeamsList] = useState(() => festivalStore.getTeams() || []);
  const [resultsList, setResultsList] = useState(() => festivalStore.getPublishedResultPosters() || []);
  const [announcements, setAnnouncements] = useState(() => {
    try {
      return festivalStore.getAnnouncements?.({ portalRole: 'public' }) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // 1. Subscribe to local festivalStore updates
    const unsubStore = festivalStore.subscribe(() => {
      setTeamsList(festivalStore.getTeams() || []);
      setResultsList(festivalStore.getPublishedResultPosters() || []);
      try {
        setAnnouncements(festivalStore.getAnnouncements?.({ portalRole: 'public' }) || []);
      } catch {
        setAnnouncements([]);
      }
    });

    // 2. Real-time Firebase team standings listener
    let unsubFirebaseTeams = () => {};
    try {
      unsubFirebaseTeams = subscribeToTeams((fbTeams) => {
        if (Array.isArray(fbTeams) && fbTeams.length > 0) {
          setTeamsList(fbTeams);
        }
      });
    } catch (e) {
      console.warn('Firebase team subscription fallback:', e);
    }

    return () => {
      if (typeof unsubStore === 'function') unsubStore();
      if (typeof unsubFirebaseTeams === 'function') unsubFirebaseTeams();
    };
  }, []);

  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard', 'results', 'matrix', 'honors'
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('overall'); // 'overall', 'day1', 'day2'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'individual', 'group'
  const [searchQuery, setSearchQuery] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic genuine team standings from approved scores
  const sortedTeams = useMemo(() => {
    return [...teamsList].sort((a, b) => (b.points || 0) - (a.points || 0));
  }, [teamsList]);

  const topTeam = sortedTeams[0] || { name: 'Dazzlers', points: 0, leader: 'Noufal', members: 22 };
  const secondTeam = sortedTeams[1] || { name: 'Dynamos', points: 0, leader: 'Hashim', members: 22 };
  const hasApprovedScores = (topTeam.points || 0) > 0 || (secondTeam.points || 0) > 0;
  const isPointsTied = (topTeam.points || 0) === (secondTeam.points || 0);
  const pointsLead = Math.abs((topTeam.points || 0) - (secondTeam.points || 0));

  // Dynamic student standings from approved results
  const studentStandings = useMemo(() => {
    try {
      const all = festivalStore.getStudentLeaderboard() || [];
      return all.filter(s => (s.points || 0) > 0);
    } catch {
      return [];
    }
  }, [resultsList]);

  // Filtered Results
  const filteredResults = useMemo(() => {
    return resultsList.filter((item) => {
      // Category match
      const matchesCat =
        categoryFilter === 'all' || item.category === categoryFilter;

      // Search match
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCat;

      const matchesQuery =
        item.eventTitle.toLowerCase().includes(query) ||
        item.malayalam.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.positions.some(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.chestNo.toLowerCase().includes(query) ||
            p.team.toLowerCase().includes(query)
        );

      return matchesCat && matchesQuery;
    });
  }, [categoryFilter, searchQuery]);

  const handleCopyShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrintPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Formulate dynamic ticker updates from official live announcements and verified published results
  const liveTickerUpdates = useMemo(() => {
    const items = [];

    // 1. Latest verified published results
    if (resultsList && resultsList.length > 0) {
      const latestResults = [...resultsList].reverse().slice(0, 3);
      latestResults.forEach(r => {
        const firstPos = r.positions && r.positions[0];
        if (firstPos) {
          items.push(`Official Result Declared: ${r.eventTitle} (${r.category || 'General'}) — 1st Place: ${firstPos.name} (${firstPos.team})`);
        } else {
          items.push(`Official Result Declared: ${r.eventTitle} (${r.category || 'General'})`);
        }
      });
    }

    // 2. Official verified announcements
    if (announcements && announcements.length > 0) {
      announcements.slice(0, 4).forEach(a => {
        if (a.title && !a.title.toLowerCase().includes('test')) items.push(a.title);
      });
    }

    // 3. Live team standings update - ONLY when approved points exist (never show 0-point standings as breaking news)
    if (hasApprovedScores && sortedTeams.length >= 2) {
      items.push(`Team Points Standings: ${sortedTeams[0].name} (${sortedTeams[0].points || 0} pts) • ${sortedTeams[1].name} (${sortedTeams[1].points || 0} pts)`);
    }

    return items;
  }, [resultsList, announcements, hasApprovedScores, sortedTeams]);

  return (
    <div className="relative min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans overflow-x-hidden">
      {/* SECTION 07: Top Live Breaking Ticker with Continuous Marquee Animation */}
      <div className="bg-[#A91F35] text-white py-2.5 px-4 shadow-md sticky top-[60px] md:top-[72px] z-40 border-y border-[#E6A916]/40 backdrop-blur-md overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm font-semibold tracking-wide">
          <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
            <span className="flex items-center gap-1.5 bg-[#E6A916] text-[#A91F35] text-[10px] uppercase font-black px-2 py-0.5 rounded-full shrink-0 shadow-sm animate-pulse z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A91F35]" />
              LIVE UPDATE
            </span>

            {/* Seamless Infinite Marquee Track */}
            <div className="relative flex-1 overflow-hidden select-none whitespace-nowrap mask-[linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]">
              {liveTickerUpdates.length > 0 ? (
                <div className="animate-marquee-live flex items-center gap-8 cursor-default">
                  {/* First segment */}
                  <div className="flex items-center gap-8 shrink-0">
                    {liveTickerUpdates.map((item, idx) => (
                      <span key={`first-${idx}`} className="flex items-center gap-8 text-white/95">
                        <span>{item}</span>
                        <span className="text-[#E6A916] font-bold">•</span>
                      </span>
                    ))}
                  </div>
                  {/* Duplicated segment for seamless infinite loop */}
                  <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
                    {liveTickerUpdates.map((item, idx) => (
                      <span key={`second-${idx}`} className="flex items-center gap-8 text-white/95">
                        <span>{item}</span>
                        <span className="text-[#E6A916] font-bold">•</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-white/90 text-xs font-medium tracking-wide">
                  Official results will be published here as soon as approved by the Tabulation Committee.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className="hidden sm:inline-flex items-center gap-1 text-[#E6A916] hover:text-white transition-colors shrink-0 font-bold ml-4 text-xs underline underline-offset-4 z-10 cursor-pointer"
          >
            View Live Standings →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 01: RESULTS HERO & 3D CHAMPIONSHIP STAGE                          */}
      {/* ========================================================================= */}
      <section className="relative py-8 md:py-12 px-4 md:px-8 border-b border-[#A91F35]/15 overflow-hidden">
        {/* Ambient Gold Particle Dust Atmosphere */}
        <AmbientGoldParticles count={65} />

        {/* Subtle Watermark Theme Mark */}
        <div className="absolute right-[-8%] top-10 w-96 md:w-[500px] opacity-5 pointer-events-none z-0 select-none">
          <img
            src="/assets/nueva_era_logo.png"
            alt="Nueva Era"
            className="w-full object-contain filter grayscale"
          />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#A91F35] uppercase mb-5">
            <button
              onClick={onNavigateHome}
              className="hover:underline flex items-center gap-1 transition-colors"
            >
              HOME
            </button>
            <ChevronRight className="w-3 h-3 text-[#A91F35]/60" />
            <span className="text-[#1c1917]/70">RESULTS & LIVE LEADERBOARD</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A91F35]/20 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#E6A916] animate-ping" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#A91F35]">
                  DALENZIA FEST 2K26 · SECOND EDITION
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black text-[#1c1917] tracking-tight leading-[1.08]">
                  THE RESULTS <br />
                  <span className="text-[#A91F35]">ARE IN.</span>
                </h1>
                <p className="text-lg md:text-xl font-serif italic text-[#A91F35] font-semibold">
                  Every Point Matters. Every Achievement Counts.
                </p>
                <p className="text-sm md:text-base text-[#1c1917]/75 font-normal max-w-xl leading-relaxed">
                  Real-time official standings, sector point tallies, and published contest results for Dalenzia Fest 2K26. Verified and updated continuously by the Central Tabulation Bureau.
                </p>
              </div>

              {/* Status Badge & Fast Action Pill */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className={`border text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm ${
                  resultsList.length > 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}>
                  {resultsList.length > 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Live Feed · {resultsList.length} Published</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Verified Results · Tabulation In Progress</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="bg-white hover:bg-stone-50 text-[#1c1917] border border-[#A91F35]/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#A91F35]" />
                  <span>Print Official Sheet</span>
                </button>

                <button
                  onClick={handleCopyShare}
                  className="bg-white hover:bg-stone-50 text-[#1c1917] border border-[#A91F35]/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#A91F35]" />
                      <span>Share Results</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Visual Column – Authentic 3D Championship Trophy Stage */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E6A916]/40 bg-gradient-to-b from-[#FAF7F0] to-[#EAE3D2] group"
              >
                {/* Authentic Cropped 3D Trophy Stage */}
                <img
                  src="/assets/results/results_hero_stage.png"
                  alt="Dalenzia Fest Official Championship Trophy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Soft Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Gold Crest Floating Card (Derived strictly from verified approved standings) */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#E6A916]/50 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#A91F35] flex items-center justify-center text-[#E6A916] shadow-sm">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#A91F35]">
                        CHAMPIONSHIP TROPHY 2K26
                      </div>
                      <div className="text-xs font-semibold text-stone-700">
                        {hasApprovedScores && !isPointsTied
                          ? `Lead: ${topTeam.name} (${topTeam.points || 0} PTS)`
                          : hasApprovedScores && isPointsTied
                          ? `Tied: ${topTeam.name} & ${secondTeam.name} (${topTeam.points || 0} PTS)`
                          : 'Standings: Dazzlers vs Dynamos'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      hasApprovedScores && !isPointsTied
                        ? 'text-emerald-700 bg-emerald-100'
                        : hasApprovedScores && isPointsTied
                        ? 'text-amber-800 bg-amber-100'
                        : 'text-stone-600 bg-stone-100'
                    }`}>
                      {hasApprovedScores && !isPointsTied
                        ? `+${pointsLead} PTS Lead`
                        : hasApprovedScores && isPointsTied
                        ? 'Level Points'
                        : 'Scores Pending'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Interactive Navigation Pills (Matching Official Model) */}
          <div className="mt-12 pt-8 border-t border-[#A91F35]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35]'
                }`}
              >
                <Trophy className="w-4 h-4 text-[#E6A916]" />
                <span>Leaderboard</span>
              </button>

              <button
                onClick={() => setActiveTab('results')}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
                  activeTab === 'results'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35]'
                }`}
              >
                <Award className="w-4 h-4 text-[#E6A916]" />
                <span>Results</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
                  activeTab === 'matrix'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35]'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-[#E6A916]" />
                <span>Squad Comparison</span>
              </button>

              <button
                onClick={() => setActiveTab('honors')}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
                  activeTab === 'honors'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35]'
                }`}
              >
                <Crown className="w-4 h-4 text-[#E6A916]" />
                <span>Individual Honors</span>
              </button>

              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35] transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#A91F35]" />
                <span>Downloads</span>
              </button>
            </div>

            {/* Quick Stats Summary */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                2 Official Squads
              </span>
              <span className="text-stone-300">|</span>
              <span>83 Official Programmes</span>
              <span className="text-stone-300">|</span>
              <span className="font-serif text-[#A91F35] font-bold">
                {resultsList.length > 0 ? `${resultsList.length} Results Published` : 'Official Results Center'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 02: LIVE FESTIVAL LEADERBOARD (PRIMARY LEADERBOARD STAGE)         */}
      {/* ========================================================================= */}
      <section id="leaderboard" className="py-16 md:py-24 px-4 md:px-8 border-b border-[#A91F35]/15 bg-white select-none">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header with Day Switchers */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#A91F35]" />
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
                  OFFICIAL LIVE STANDINGS
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1c1917] tracking-tight">
                Festival Team Leaderboard
              </h2>
              <p className="text-sm text-stone-600 font-medium">
                Live points tabulated across all literary, arts, scholastic conclaves and cultural stages.
              </p>
            </div>

            {/* Overall / Day 1 / Day 2 Filter Buttons */}
            <div className="inline-flex p-1.5 bg-[#F7F3E9] rounded-2xl border border-[#A91F35]/20 shadow-inner">
              <button
                onClick={() => setLeaderboardPeriod('overall')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  leaderboardPeriod === 'overall'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'text-stone-700 hover:text-[#A91F35]'
                }`}
              >
                Overall Points
              </button>
              <button
                onClick={() => setLeaderboardPeriod('day1')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  leaderboardPeriod === 'day1'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'text-stone-700 hover:text-[#A91F35]'
                }`}
              >
                Day 01 (Dec 21)
              </button>
              <button
                onClick={() => setLeaderboardPeriod('day2')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  leaderboardPeriod === 'day2'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'text-stone-700 hover:text-[#A91F35]'
                }`}
              >
                Day 02 (Dec 22)
              </button>
            </div>
          </div>

          {(() => {
            const dazzlers = teamsList.find(t => t.id === 'team-1' || t.name === 'Dazzlers') || teamsList[0] || { name: 'Dazzlers', points: 0, color: '#E6A916', leader: 'Noufal', members: 22 };
            const dynamos = teamsList.find(t => t.id === 'team-2' || t.name === 'Dynamos') || teamsList[1] || { name: 'Dynamos', points: 0, color: '#A91F35', leader: 'Hashim', members: 22 };
            
            const totalPoints = (dazzlers.points || 0) + (dynamos.points || 0);
            const dazzlersPct = totalPoints > 0 ? Math.round((dazzlers.points / totalPoints) * 100) : 50;
            const dynamosPct = totalPoints > 0 ? (100 - dazzlersPct) : 50;
            const pointsDiff = Math.abs((dazzlers.points || 0) - (dynamos.points || 0));
            const leaderName = (dazzlers.points || 0) > (dynamos.points || 0) ? 'Dazzlers' : ((dynamos.points || 0) > (dazzlers.points || 0) ? 'Dynamos' : 'Tied');

            const categoryStandings = festivalStore.getCategoryLeaderboard();
            const studentStandings = festivalStore.getStudentLeaderboard();

            return (
              <div className="space-y-10 pt-4">
                {/* 2-TEAM CHAMPIONSHIP SHOWDOWN (DAZZLERS VS DYNAMOS) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  
                  {/* DAZZLERS TEAM CARD (GOLD THEME) */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-[#FFFDF8] via-white to-amber-50/50 rounded-3xl p-6 md:p-8 border-4 border-[#E6A916] shadow-xl flex flex-col justify-between space-y-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="px-3 py-1 rounded-full bg-[#E6A916] text-stone-950 text-[10px] font-black uppercase tracking-wider">
                          SQUAD 01 • DAZZLERS
                        </span>
                        <h3 className="text-3xl font-serif font-black text-stone-900 mt-2">
                          {dazzlers.name}
                        </h3>
                        <p className="text-xs text-stone-600 font-medium">
                          Leader: <strong className="text-stone-900">{dazzlers.leader || 'Noufal'}</strong> • {dazzlers.members || 22} Registered Scholars
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-[#E6A916]/20 border-2 border-[#E6A916] flex items-center justify-center text-amber-700 shadow-sm">
                        <Crown className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#E6A916]/30 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Aggregate Points</div>
                        <div className="text-5xl font-serif font-black text-[#E6A916] mt-1">
                          {dazzlers.points || 0}
                          <span className="text-sm font-sans font-bold text-stone-500 ml-2">PTS</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1 text-xs text-stone-600">
                        <div>🥇 <strong>{dazzlers.firstPlaces || 0}</strong> Winners</div>
                        <div>🥈 <strong>{dazzlers.secondPlaces || 0}</strong> 2nd Places</div>
                        <div>🥉 <strong>{dazzlers.thirdPlaces || 0}</strong> 3rd Places</div>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 flex items-center justify-between pt-2 border-t border-stone-200">
                      <span>Official Squad Color: <strong>Gold (#E6A916)</strong></span>
                      {leaderName === 'Dazzlers' && pointsDiff > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Leading by +{pointsDiff} pts
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* DYNAMOS TEAM CARD (CRIMSON THEME) */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-[#FFFDF8] via-white to-rose-50/50 rounded-3xl p-6 md:p-8 border-4 border-[#A91F35] shadow-xl flex flex-col justify-between space-y-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="px-3 py-1 rounded-full bg-[#A91F35] text-white text-[10px] font-black uppercase tracking-wider">
                          SQUAD 02 • DYNAMOS
                        </span>
                        <h3 className="text-3xl font-serif font-black text-stone-900 mt-2">
                          {dynamos.name}
                        </h3>
                        <p className="text-xs text-stone-600 font-medium">
                          Leader: <strong className="text-stone-900">{dynamos.leader || 'Hashim'}</strong> • {dynamos.members || 22} Registered Scholars
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-[#A91F35]/20 border-2 border-[#A91F35] flex items-center justify-center text-[#A91F35] shadow-sm">
                        <Trophy className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-[#A91F35]/30 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Aggregate Points</div>
                        <div className="text-5xl font-serif font-black text-[#A91F35] mt-1">
                          {dynamos.points || 0}
                          <span className="text-sm font-sans font-bold text-stone-500 ml-2">PTS</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1 text-xs text-stone-600">
                        <div>🥇 <strong>{dynamos.firstPlaces || 0}</strong> Winners</div>
                        <div>🥈 <strong>{dynamos.secondPlaces || 0}</strong> 2nd Places</div>
                        <div>🥉 <strong>{dynamos.thirdPlaces || 0}</strong> 3rd Places</div>
                      </div>
                    </div>

                    <div className="text-xs text-stone-600 flex items-center justify-between pt-2 border-t border-stone-200">
                      <span>Official Squad Color: <strong>Crimson (#A91F35)</strong></span>
                      {leaderName === 'Dynamos' && pointsDiff > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Leading by +{pointsDiff} pts
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* LIVE DUAL SQUAD COMPARISON BAR */}
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span className="text-[#E6A916]">Dazzlers ({dazzlersPct}%)</span>
                    <span className="text-stone-500 uppercase font-mono text-[10px]">
                      {pointsDiff === 0 ? 'Teams Tied in Points' : `${leaderName} Lead by ${pointsDiff} Points`}
                    </span>
                    <span className="text-[#A91F35]">Dynamos ({dynamosPct}%)</span>
                  </div>
                  <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
                    <div style={{ width: `${dazzlersPct}%` }} className="bg-[#E6A916] transition-all duration-700" />
                    <div style={{ width: `${dynamosPct}%` }} className="bg-[#A91F35] transition-all duration-700" />
                  </div>
                </div>

                {/* CATEGORY BREAKDOWN TABLE */}
                <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-[#A91F35] uppercase tracking-wider">Official Breakdown</div>
                      <h4 className="text-lg font-serif font-black text-stone-900 mt-0.5">
                        Category Championship Standings (5 Official Categories)
                      </h4>
                    </div>
                    <span className="text-xs text-stone-500 font-medium">83 Total Programmes</span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-stone-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Total Events</th>
                          <th className="p-3.5">Published Results</th>
                          <th className="p-3.5 text-center text-[#E6A916]">Dazzlers Pts</th>
                          <th className="p-3.5 text-center text-[#A91F35]">Dynamos Pts</th>
                          <th className="p-3.5 text-right">Category Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {categoryStandings.map((c) => (
                          <tr key={c.category} className="hover:bg-stone-50/70 transition-colors">
                            <td className="p-3.5 font-bold font-serif text-stone-900 text-sm">
                              {c.category}
                            </td>
                            <td className="p-3.5 font-mono">{c.totalEvents} Events</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono text-[11px]">
                                {c.publishedEvents} / {c.totalEvents}
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-mono font-black text-sm text-[#E6A916]">
                              {c.dazzlersPoints}
                            </td>
                            <td className="p-3.5 text-center font-mono font-black text-sm text-[#A91F35]">
                              {c.dynamosPoints}
                            </td>
                            <td className="p-3.5 text-right font-bold">
                              {c.publishedEvents === 0 ? (
                                <span className="text-stone-400 italic text-[11px]">In Progress</span>
                              ) : c.leader === 'Tied' ? (
                                <span className="text-stone-600 text-[11px]">Level ({c.dazzlersPoints} pts)</span>
                              ) : (
                                <span className="text-emerald-700 text-[11px]">
                                  {c.leader} Leading
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* INDIVIDUAL STUDENT CHAMPIONSHIP STANDINGS */}
                {studentStandings.length > 0 && (
                  <div className="p-6 md:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black text-[#A91F35] uppercase tracking-wider">Candidate Honours</div>
                        <h4 className="text-lg font-serif font-black text-stone-900 mt-0.5">
                          Individual Scholar Championship Leaderboard
                        </h4>
                      </div>
                      <span className="text-xs text-stone-500 font-medium">Top Ranked Performers</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-stone-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                            <th className="p-3.5">Rank</th>
                            <th className="p-3.5">Candidate</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Team Squad</th>
                            <th className="p-3.5 text-center">Podium Finishes</th>
                            <th className="p-3.5 text-right">Individual Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-700">
                          {studentStandings.slice(0, 10).map((s, idx) => (
                            <tr key={s.id} className="hover:bg-stone-50/70 transition-colors">
                              <td className="p-3.5 font-bold font-mono">
                                <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold text-stone-900">{s.name}</div>
                                <div className="text-[10px] font-mono text-stone-500">Chest No: {s.chestNo}</div>
                              </td>
                              <td className="p-3.5 font-medium">{s.category}</td>
                              <td className="p-3.5 font-semibold text-stone-800">{s.teamName}</td>
                              <td className="p-3.5 text-center font-mono text-[11px]">
                                {s.firstPlaces}🥇 · {s.secondPlaces}🥈 · {s.thirdPlaces}🥉
                              </td>
                              <td className="p-3.5 text-right font-mono font-black text-sm text-[#A91F35]">
                                {s.points} PTS
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
    </div>
  </section>

      {/* ========================================================================= */}
      {/* SECTION 03: CATEGORY RESULTS EXPLORER (OFFICIAL CONTEST RESULTS)         */}
      {/* ========================================================================= */}
      <section id="results" className="py-16 md:py-24 px-4 md:px-8 border-b border-[#A91F35]/15 bg-[#F7F3E9]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#A91F35]" />
                <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
                  VERIFIED CONTEST RESULTS
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1c1917] tracking-tight">
                Category Results Archive
              </h2>
              <p className="text-sm text-stone-600 font-medium">
                Detailed scores, 1st/2nd/3rd prize winners, chest numbers and points allocated across all stages.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35]'
                }`}
              >
                All Competitions ({resultsList.length})
              </button>
              <button
                onClick={() => setCategoryFilter('individual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'individual'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35]'
                }`}
              >
                Individual Events
              </button>
              <button
                onClick={() => setCategoryFilter('group')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'group'
                    ? 'bg-[#A91F35] text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#A91F35]'
                }`}
              >
                Group & Team Events
              </button>
            </div>
          </div>

          {/* Search Bar for Results */}
          <div className="relative max-w-xl">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, chest number, event or team..."
              className="w-full bg-white pl-12 pr-4 py-3.5 rounded-2xl border border-stone-300 text-sm font-medium focus:outline-none focus:border-[#A91F35] shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results Grid Cards */}
          {filteredResults.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-300 space-y-3">
              <FileText className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-stone-700">
                {searchQuery ? `No published results match "${searchQuery}"` : 'Official Results Awaiting Publication'}
              </h3>
              <p className="text-xs text-stone-500">
                {searchQuery
                  ? 'Try searching for candidate name, chest number, squad (Dazzlers or Dynamos), or event title.'
                  : 'Certified competition results will appear here in real-time once verified by the Convener Secretariat.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredResults.map((result, idx) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-[#A91F35]/20 shadow-md hover:shadow-xl hover:border-[#A91F35]/40 transition-all space-y-6 flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold uppercase tracking-wider text-[#A91F35] bg-[#A91F35]/10 px-3 py-1 rounded-full">
                        {result.section} · {result.code}
                      </span>
                      <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {result.publishedTime}
                      </span>
                    </div>

                    <div className="pt-1">
                      <h3 className="text-2xl font-serif font-black text-[#1c1917]">
                        {result.eventTitle}
                      </h3>
                      <p className="text-xs font-semibold text-stone-500 font-serif">
                        {result.malayalam} · {result.categoryLabel}
                      </p>
                    </div>
                  </div>

                  {/* 3 Positions Podium List */}
                  <div className="space-y-3 pt-2">
                    {result.positions.map((p) => (
                      <div
                        key={p.pos}
                        className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                          p.rankNum === 1
                            ? 'bg-amber-50/80 border border-amber-300'
                            : p.rankNum === 2
                            ? 'bg-stone-50 border border-stone-200'
                            : 'bg-stone-50/50 border border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-serif text-xs font-black shadow-sm ${
                              p.rankNum === 1
                                ? 'bg-[#E6A916] text-[#A91F35]'
                                : p.rankNum === 2
                                ? 'bg-stone-300 text-stone-700'
                                : 'bg-amber-200 text-amber-900'
                            }`}
                          >
                            {p.rankNum === 1 ? '🥇' : p.rankNum === 2 ? '🥈' : '🥉'}
                          </span>

                          <div>
                            <div className="text-sm font-bold text-[#1c1917] flex items-center gap-2">
                              <span>{p.name}</span>
                              <span className="text-[10px] text-stone-500 font-mono">
                                ({p.chestNo})
                              </span>
                            </div>
                            <div className="text-xs text-stone-600 font-semibold">
                              Sector: <span className="text-[#A91F35] font-bold">{p.team}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-[#A91F35]">
                            +{p.pts} PTS
                          </div>
                          <div className="text-[10px] font-extrabold uppercase text-emerald-700">
                            Grade: {p.grade}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer Verification */}
                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tabulated & Confirmed
                    </span>
                    <button
                      onClick={() => setIsPdfModalOpen(true)}
                      className="font-bold text-[#A91F35] hover:underline flex items-center gap-1"
                    >
                      Official Certificate Sheet ↗
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04: OFFICIAL SQUAD PERFORMANCE COMPARISON MATRIX                  */}
      {/* ========================================================================= */}
      <section id="matrix" className="py-16 md:py-24 px-4 md:px-8 border-b border-[#A91F35]/15 bg-white select-none">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-[#A91F35]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
                PERFORMANCE BREAKDOWN
              </span>
              <span className="w-8 h-[2px] bg-[#A91F35]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1c1917] tracking-tight">
              Official Squad Medal Matrix
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              Comprehensive statistical evaluation of podium finishes, point distribution, and squad standings.
            </p>
          </div>

          {/* Matrix Table */}
          <div className="bg-[#FAF7F0] rounded-3xl overflow-hidden border border-[#A91F35]/15 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#A91F35] text-white text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-6">Rank</th>
                    <th className="py-4 px-6">Official Squad Contingent</th>
                    <th className="py-4 px-6 text-center">🥇 1st Place (Winner)</th>
                    <th className="py-4 px-6 text-center">🥈 2nd Place</th>
                    <th className="py-4 px-6 text-center">🥉 3rd Place</th>
                    <th className="py-4 px-6 text-right">Aggregate Score</th>
                    <th className="py-4 px-6 text-center">Championship Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm font-semibold text-stone-800">
                  {sortedTeams.map((team, idx) => {
                    const isLeader = idx === 0 && (team.points || 0) > 0 && pointsLead > 0;
                    return (
                      <tr
                        key={team.name}
                        className={`hover:bg-stone-100/80 transition-colors ${
                          idx === 0 ? 'bg-[#FFFDF8] font-bold' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <span
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-serif font-bold text-xs ${
                              isLeader
                                ? 'bg-[#E6A916] text-[#A91F35]'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-serif text-base text-[#1c1917]">
                            {team.name}
                          </div>
                          <div className="text-xs text-stone-500 font-serif">
                            Leader: {team.leader || 'Team Leader'} · {team.members || 22} Registered Scholars
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-bold text-amber-700">
                          {team.firstPlaces || 0}
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-bold text-stone-600">
                          {team.secondPlaces || 0}
                        </td>

                        <td className="py-4 px-6 text-center font-mono font-bold text-amber-900">
                          {team.thirdPlaces || 0}
                        </td>

                        <td className="py-4 px-6 text-right font-serif text-xl font-black text-[#A91F35]">
                          {team.points || 0} <span className="text-xs font-sans text-stone-500">PTS</span>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              isLeader
                                ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                                : (team.points || 0) === 0
                                ? 'bg-stone-100 text-stone-600'
                                : 'bg-[#E6A916]/20 text-[#A91F35]'
                            }`}
                          >
                            {isLeader
                              ? `Leading (+${pointsLead} pts)`
                              : (team.points || 0) === 0
                              ? 'Awaiting Results'
                              : isPointsTied
                              ? 'Level Points'
                              : 'Contending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 05: SPECIAL HONORS & INDIVIDUAL EXCELLENCE SPOTLIGHTS            */}
      {/* ========================================================================= */}
      <section id="honors" className="py-16 md:py-24 px-4 md:px-8 border-b border-[#A91F35]/15 bg-[#F7F3E9]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-[2px] bg-[#A91F35]" />
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#A91F35]">
                FESTIVAL SPECIAL HONORS
              </span>
              <span className="w-8 h-[2px] bg-[#A91F35]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1c1917] tracking-tight">
              Individual Laurels & Spotlights
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              Recognizing exceptional talent, individual aggregate mastery, and inspiring artistic distinction.
            </p>
          </div>

          {studentStandings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {studentStandings.slice(0, 3).map((scholar, idx) => (
                <motion.div
                  key={scholar.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-[#A91F35]/20 shadow-md flex flex-col justify-between space-y-6 relative group hover:shadow-2xl transition-all"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center shadow-md">
                      <Crown className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-1 rounded-full">
                        {idx === 0 ? 'TOP SCHOLAR HONOUR' : idx === 1 ? 'DISTINGUISHED ORATOR' : 'CREATIVE HONOUR'}
                      </span>
                      <h3 className="text-xl font-serif font-black text-[#1c1917] pt-1">
                        {scholar.name}
                      </h3>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#A91F35]/10 space-y-2">
                      <div className="text-lg font-serif font-bold text-[#A91F35]">
                        {scholar.points} PTS
                      </div>
                      <div className="text-xs font-semibold text-stone-600">
                        Chest No: <span className="font-mono text-stone-800">{scholar.chestNo}</span> · Squad: <span className="text-[#A91F35] font-bold">{scholar.teamName}</span>
                      </div>
                      <div className="text-xs text-stone-500 font-medium pt-1">
                        <span className="font-bold text-stone-700">Podiums:</span> {scholar.firstPlaces}🥇 · {scholar.secondPlaces}🥈 · {scholar.thirdPlaces}🥉
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200">
                    <p className="text-xs font-serif italic text-stone-600">
                      Ranked #{idx + 1} on the official individual championship leaderboard.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 md:p-14 text-center border border-[#A91F35]/20 shadow-md space-y-4 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 text-[#E6A916]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-black text-[#1c1917]">
                  Championship Laurels & Spotlights
                </h3>
                <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
                  Prestige titles including <strong>Kalaprathibha</strong>, <strong>Prabhashana Prathibha (Best Orator)</strong>, and <strong>Creative Innovator</strong> will be officially conferred upon the highest scoring candidates as results are certified by the Central Tabulation Bureau.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Awaiting Official Result Tabulation</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 08: OFFICIAL PDF RESULTS DOWNLOAD & PRINT VIEW (MODAL)           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPdfModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-10 shadow-2xl border-4 border-[#A91F35] relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable Official Results Certificate Layout */}
              <div id="printable-results" className="space-y-8 select-text">
                {/* Header with Fest Logo & Theme */}
                <div className="text-center space-y-3 pb-6 border-b-2 border-[#A91F35]/20">
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src="/assets/dalenzia_fest_logo.png"
                      alt="Dalenzia Fest Logo"
                      className="h-14 w-auto object-contain"
                    />
                    <img
                      src="/assets/nueva_era_logo.png"
                      alt="Nueva Era"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-black text-[#A91F35]">
                    DALENZIA FEST 2K26 · OFFICIAL RESULT BULLETIN
                  </h2>
                  <p className="text-xs font-semibold text-stone-600 uppercase tracking-widest">
                    Second Edition · 21, 22, 23 DECEMBER 2026 · Dalailussunna Dars, Ayiroor, Kerala
                  </p>
                </div>

                {/* Leaderboard Table Summary */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#A91F35] flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#E6A916]" />
                    Central Squad Standings
                  </h3>
                  <table className="w-full text-xs font-semibold border border-stone-300">
                    <thead className="bg-[#A91F35] text-white">
                      <tr>
                        <th className="p-2 text-left">Rank</th>
                        <th className="p-2 text-left">Squad Contingent</th>
                        <th className="p-2 text-center">1st</th>
                        <th className="p-2 text-center">2nd</th>
                        <th className="p-2 text-center">3rd</th>
                        <th className="p-2 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {sortedTeams.map((t, idx) => (
                        <tr key={t.name} className="hover:bg-stone-50">
                          <td className="p-2 font-bold">{idx + 1}</td>
                          <td className="p-2">{t.name}</td>
                          <td className="p-2 text-center">{t.firstPlaces || 0}</td>
                          <td className="p-2 text-center">{t.secondPlaces || 0}</td>
                          <td className="p-2 text-center">{t.thirdPlaces || 0}</td>
                          <td className="p-2 text-right font-bold text-[#A91F35]">{t.points || 0} PTS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Category Winners Excerpt */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#A91F35] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#E6A916]" />
                    Published Results Highlights
                  </h3>
                  <div className="space-y-2 text-xs">
                    {resultsList.length > 0 ? (
                      resultsList.slice(0, 4).map((r) => (
                        <div key={r.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-stone-800">{r.eventTitle}</span>
                            <span className="text-stone-500 ml-2">({r.code})</span>
                          </div>
                          <div className="text-right">
                            {r.positions && r.positions[0] ? (
                              <span className="font-bold text-[#A91F35]">
                                1st: {r.positions[0].name} ({r.positions[0].team})
                              </span>
                            ) : (
                              <span className="text-stone-500 italic">Result Certified</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs text-center italic">
                        Official result certificates will appear here once certified by the Convener Secretariat.
                      </div>
                    )}
                  </div>
                </div>

                {/* Signatory Footer */}
                <div className="pt-8 border-t border-stone-300 flex justify-between items-end text-xs text-stone-600">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-800">Convener, Tabulation Committee</div>
                    <div className="text-[11px] text-stone-500">Dalenzia Fest 2K26 Academic Council</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-bold text-[#A91F35]">OFFICIAL CERTIFIED COPY</div>
                    <div className="text-[11px] text-stone-400">Ayiroor · Malappuram · Kerala</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Close Preview
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#A91F35] text-white hover:bg-[#8B1A2C] transition-all flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4 text-[#E6A916]" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* SECTION 09: EDITORIAL CLOSING CTA & FOOTER                               */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-[#FAF7F0] to-[#EAE3D2] border-t border-[#A91F35]/20 select-none">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#A91F35]/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#E6A916]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#A91F35]">
              NUEVA ERA · SECOND EDITION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#1c1917] tracking-tight leading-tight">
            CELEBRATE EVERY ACHIEVEMENT. <br />
            <span className="text-[#A91F35]">A NEW ERA. COUNTLESS MEMORIES.</span>
          </h2>

          <p className="text-sm md:text-base text-stone-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Dalenzia Fest 2K26 salutes every participant, mentor and well-wisher who transformed these three days into an unforgettable arena of knowledge, devotion, and intellectual courage.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onNavigateEvents}
              className="px-8 py-3.5 rounded-full bg-[#A91F35] hover:bg-[#8B1A2C] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 group"
            >
              <span>Explore Events & Competitions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateHome}
              className="px-8 py-3.5 rounded-full bg-white hover:bg-stone-100 text-[#1c1917] border border-stone-300 font-extrabold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
