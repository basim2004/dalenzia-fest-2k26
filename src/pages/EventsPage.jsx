import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientGoldParticles from '../components/AmbientGoldParticles';
import {
  Search,
  Filter,
  Trophy,
  Award,
  Crown,
  BookOpen,
  Palette,
  Film,
  Users,
  Music,
  HelpCircle,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  Home,
  CheckCircle2,
  Sparkles,
  Sparkles as SparklesIcon,
  X,
  Share2,
  Download,
  AlertCircle,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';

// Event Categories from Official Dalenzia Charter (Dalenzia_2K26_Festival_Charter_BW.pdf)
const CATEGORIES = [
  {
    id: 'all',
    name: 'All Official Events',
    malayalam: 'എല്ലാ ഇനങ്ങളും (83 ഇനങ്ങൾ)',
    icon: Layers,
    count: 83,
    description: 'Complete official festival portfolio comprising all 83 stage and off-stage programmes across 5 categories.'
  },
  {
    id: 'Minor',
    name: 'Minor',
    malayalam: 'മൈനർ (18 ഇനങ്ങൾ)',
    icon: BookOpen,
    count: 18,
    description: 'Foundation tier: 18 official programmes (9 On Stage, 9 Off Stage) for Minor candidates.'
  },
  {
    id: 'Sub-Junior',
    name: 'Sub-Junior',
    malayalam: 'സബ് ജൂനിയർ (19 ഇനങ്ങൾ)',
    icon: Sparkles,
    count: 19,
    description: 'Intermediate lower tier: 19 official programmes (11 On Stage, 8 Off Stage) for Sub-Junior candidates.'
  },
  {
    id: 'Junior',
    name: 'Junior',
    malayalam: 'ജൂനിയർ (18 ഇനങ്ങൾ)',
    icon: Award,
    count: 18,
    description: 'Intermediate upper tier: 18 official programmes (10 On Stage, 8 Off Stage) for Junior candidates.'
  },
  {
    id: 'Senior',
    name: 'Senior',
    malayalam: 'സീനിയർ (17 ഇനങ്ങൾ)',
    icon: Crown,
    count: 17,
    description: 'Advanced scholar tier: 17 official programmes (10 On Stage, 7 Off Stage) for Senior candidates.'
  },
  {
    id: 'General',
    name: 'General',
    malayalam: 'ജനറൽ (11 ഇനങ്ങൾ)',
    icon: Users,
    count: 11,
    description: 'Open & Ensemble tier: 11 official programmes (9 On Stage, 2 Off Stage; Group & Team items).'
  }
];

// Authentic Dalenzia Competition Callset
const STATIC_COMPETITIONS = [];

export default function EventsPage({ onNavigateHome }) {
  const [competitionsList, setCompetitionsList] = useState(() => festivalStore.getCompetitions() || []);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setCompetitionsList(festivalStore.getCompetitions() || []);
    });
    return unsub;
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'individual', 'group'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'closing'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter logic
  const filteredCompetitions = useMemo(() => {
    return competitionsList.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = (item.name || item.title || '').toLowerCase().includes(q);
        const matchesCat = (item.categoryName || item.category || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesStage = (item.stage || item.venue || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc && !matchesStage) return false;
      }
      return true;
    });
  }, [competitionsList, selectedCategory, typeFilter, statusFilter, searchQuery]);

  const featuredCompetitions = useMemo(() => {
    return competitionsList.filter((item) => item.featured);
  }, [competitionsList]);

  const scrollToExplorer = () => {
    const el = document.querySelector('#competition-explorer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans overflow-x-hidden">
      
      {/* SECTION 01: EVENTS HERO */}
      <section className="relative bg-[#F7F3E9] overflow-hidden pt-6 pb-16 select-none border-b border-[#A91F35]/15 space-y-8">
        
        {/* Ambient Golden Particle Atmosphere */}
        <AmbientGoldParticles count={65} />

        {/* Top Breadcrumb & Dual Logo */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 hover:text-[#A91F35] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#A91F35]" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-[#A91F35] font-bold">Events &amp; Competitions</span>
          </div>

          {/* Official Fest Logo lockup */}
          <div className="h-8 md:h-10">
            <img
              src="/assets/dalenzia_fest_logo.png"
              alt="Dalenzia Fest Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Hero Headline & 3D Architectural Stage Scene */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#A91F35] text-white rounded-full text-xs font-extrabold tracking-widest uppercase shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>DALENZIA FEST 2K26 · SECOND EDITION</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1c1917] tracking-tight leading-[1.12]">
              THE EVENTS <br />
              <span className="text-[#A91F35] italic">Every Talent</span> <br />
              <span className="text-[#E6A916]">Has a Stage.</span>
            </h1>

            <p className="text-sm md:text-base text-[#1c1917]/80 leading-relaxed font-normal max-w-lg">
              A vibrant line-up of literary, creative, debating and intellectual events that bring out the finest in student eloquence, analytical brilliance, and cultural expression.
            </p>

            {/* Date & Venue Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-semibold text-[#1c1917] pt-1">
              <span className="flex items-center gap-1.5 text-[#A91F35]">
                <Calendar className="w-4 h-4" />
                21, 22, 23 DECEMBER 2026
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1.5 text-[#A91F35]">
                <MapPin className="w-4 h-4" />
                Dalailussunna Dars, Ayiroor
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={scrollToExplorer}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A91F35] text-white hover:bg-[#8e172a] text-xs md:text-sm font-bold shadow-lg transition-all active:scale-95 group cursor-pointer"
              >
                <span>Explore 64 Competitions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://wa.me/918589951951?text=Hello%20Dalenzia%20Fest%202K26,%20I%20want%20to%20inquire%20about%20event%20registration."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs md:text-sm font-extrabold shadow-md transition-all active:scale-95 group"
              >
                <span>Register for Events</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right 3D Architectural Stage Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[540px] rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white group">
              <img
                src="/assets/events/events_hero_stage.png"
                alt="Dalenzia Events 3D Stage - Championship Trophy, Crimson Steps & Golden Hourglass"
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700"
              />
              
              {/* Bottom Subtle Overlay Ribbon */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#A91F35]/90 via-[#A91F35]/60 to-transparent p-4 flex items-center justify-between text-white text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#E6A916]" />
                  64 Competitive Arenas
                </span>
                <span className="text-[#E6A916] font-bold">4 Grand Festival Stages</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 02: EXPLORE CATEGORIES */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden border-b border-[#A91F35]/15">
        {/* Background Mandala Watermark */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-5 pointer-events-none">
          <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#E6A916]" />
              FESTIVAL DISCIPLINES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
              Explore Event Categories
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              Carefully structured domains providing each scholar with a specialized arena for eloquence, artistry, and scholarship.
            </p>
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    scrollToExplorer();
                  }}
                  className={`group relative rounded-3xl p-6 cursor-pointer border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                    isSelected
                      ? 'bg-[#A91F35] text-white border-[#E6A916] shadow-xl scale-[1.02]'
                      : 'bg-[#F7F3E9]/60 hover:bg-white text-[#1c1917] border-[#A91F35]/15 hover:border-[#A91F35]/40 hover:shadow-xl'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#E6A916] text-[#A91F35]'
                            : 'bg-[#A91F35] text-white group-hover:bg-[#E6A916] group-hover:text-[#A91F35]'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider ${
                          isSelected
                            ? 'bg-white/20 text-[#E6A916]'
                            : 'bg-[#A91F35]/10 text-[#A91F35]'
                        }`}
                      >
                        {cat.count} Competitions
                      </span>
                    </div>

                    <div>
                      <h3
                        className={`text-xl font-serif font-bold tracking-tight ${
                          isSelected ? 'text-white' : 'text-[#1c1917]'
                        }`}
                      >
                        {cat.name}
                      </h3>
                      <span
                        className={`text-xs font-semibold block mt-0.5 ${
                          isSelected ? 'text-[#E6A916]' : 'text-[#A91F35]'
                        }`}
                      >
                        {cat.malayalam}
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed line-clamp-3 font-normal ${
                        isSelected ? 'text-white/80' : 'text-stone-600'
                      }`}
                    >
                      {cat.description}
                    </p>
                  </div>

                  {/* Explore button inside card */}
                  <div
                    className={`pt-3 border-t flex items-center justify-between text-xs font-extrabold ${
                      isSelected
                        ? 'border-white/20 text-[#E6A916]'
                        : 'border-stone-200 text-[#A91F35] group-hover:translate-x-1 transition-transform'
                    }`}
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 03 & 04: COMPETITION COLLECTION & INTERACTIVE EXPLORER */}
      <section id="competition-explorer" className="py-16 md:py-24 bg-[#F7F3E9] relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#A91F35]/15 pb-6">
            <div className="space-y-2 text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A91F35] block">
                COMPETITION COLLECTION
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
                Interactive Event Explorer
              </h2>
              <p className="text-xs md:text-sm text-stone-600 font-medium max-w-xl">
                Filter by discipline, individual or group classification, and real-time registration status.
              </p>
            </div>

            {/* Results count pill */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="px-4 py-2 rounded-full bg-white border border-[#A91F35]/20 text-xs font-extrabold text-[#A91F35] shadow-sm">
                Showing {filteredCompetitions.length} of {competitionsList.length} Arenas
              </span>
            </div>
          </div>

          {/* Filter Controls Bar */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-[#A91F35]/15 space-y-5">
            
            {/* Search Input & Reset */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full flex-1">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by competition name, stage, or keywords (e.g. Arabic, Film, Debate)..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F7F3E9]/60 border border-stone-200 text-sm text-[#1c1917] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#A91F35]/30 focus:border-[#A91F35] transition-all font-medium"
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

              {/* Classification toggle (All / Individual / Group) */}
              <div className="flex items-center gap-1 bg-[#F7F3E9] p-1.5 rounded-2xl border border-stone-200 w-full md:w-auto">
                {[
                  { id: 'all', label: 'All Formats' },
                  { id: 'individual', label: 'Individual' },
                  { id: 'group', label: 'Group / Team' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTypeFilter(t.id)}
                    className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === t.id
                        ? 'bg-[#A91F35] text-white shadow-sm'
                        : 'text-stone-600 hover:text-[#A91F35]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#A91F35] text-white shadow-sm scale-105'
                        : 'bg-[#F7F3E9] text-stone-700 hover:bg-[#A91F35]/10 hover:text-[#A91F35] border border-stone-200/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Cards Grid */}
          {competitionsList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
              <Trophy className="w-12 h-12 text-[#A91F35] mx-auto opacity-40" />
              <h3 className="text-xl font-serif font-black text-[#1c1917]">
                Festival Competitions In Preparation
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Official competitions, criteria rubrics, guidelines, and arenas for DALENZIA FEST 2K26 – NUEVA ERA are currently being prepared by the Festival Convener Board.
              </p>
            </div>
          ) : filteredCompetitions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
              <AlertCircle className="w-12 h-12 text-[#A91F35] mx-auto opacity-40" />
              <h3 className="text-lg font-serif font-bold text-[#1c1917]">
                No competitions matched your filter criteria
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try selecting a different category or clearing the search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setTypeFilter('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2 rounded-full bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8e172a] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompetitions.map((comp, idx) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                  className="group rounded-3xl bg-white border border-[#A91F35]/15 overflow-hidden shadow-md hover:shadow-xl hover:border-[#A91F35]/40 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Visual Artwork Card */}
                  <div className="relative h-44 w-full bg-[#A91F35] overflow-hidden">
                    <img
                      src={comp.cardImage}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay for badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Category & Status badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold tracking-wide uppercase shadow-sm">
                        {comp.categoryName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold border border-white/20">
                        {comp.typeName}
                      </span>
                    </div>

                    {/* Stage Location Pin Badge */}
                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-[#E6A916]" />
                      <span>{comp.stage}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-[#1c1917] group-hover:text-[#A91F35] transition-colors leading-snug">
                        {comp.name}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    {/* Meta info pills */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="flex items-center gap-1 font-mono font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#A91F35]" />
                        {comp.duration}
                      </span>

                      <button
                        onClick={() => setActiveModalEvent(comp)}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#A91F35] hover:text-[#7f1325] transition-colors group-hover:translate-x-0.5 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 05: CINEMATIC FEATURED COMPETITIONS */}
      {featuredCompetitions.length > 0 && (
      <section className="py-16 md:py-24 bg-white relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
              <Trophy className="w-3.5 h-3.5 text-[#E6A916]" />
              LANDMARK ARENAS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
              Featured Championships
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              High-prestige marquee contests defining the spirit and intellectual caliber of Dalenzia Fest 2K26.
            </p>
          </div>

          {/* Featured Cards Alternating Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredCompetitions.slice(0, 4).map((feat, idx) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-3xl bg-gradient-to-br from-[#A91F35] to-[#7a1324] text-white p-6 md:p-8 shadow-xl border border-[#E6A916]/30 flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                {/* Background Artwork Snippet floating subtly */}
                <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                  <img src={feat.artImage} alt="" className="w-full h-full object-contain" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold tracking-widest uppercase">
                      FEATURED ARENA
                    </span>
                    <span className="text-xs text-[#E6A916] font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {feat.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                      {feat.name}
                    </h3>
                    <span className="text-xs text-[#E6A916] font-semibold block mt-0.5">
                      Stage: {feat.stage} · {feat.categoryName}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-white/85 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                {/* Key Judging Parameters & CTA */}
                <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#E6A916]" />
                    <span>Open for Dars Delegates</span>
                  </div>

                  <button
                    onClick={() => setActiveModalEvent(feat)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>View Arena Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
      )}

      {/* SECTION 06: HOW TO PARTICIPATE */}
      <section className="py-16 md:py-24 bg-[#F7F3E9] relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#E6A916]" />
              PARTICIPATION GUIDELINES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
              How to Participate
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              A 4-step streamlined roadmap for students and Dars delegations to register for Dalenzia Fest 2K26.
            </p>
          </div>

          {/* 4-Step Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Review Syllabus',
                malayalam: 'വിഷയം തിരഞ്ഞെടുക്കുക',
                desc: 'Browse the 64 competition categories, eligibility guidelines, and time rules suited to your discipline.'
              },
              {
                step: '02',
                title: 'Dars Endorsement',
                malayalam: 'സ്ഥാപന അനുമതി',
                desc: 'Consult your respective Dars Mudarris or delegation team leader to confirm official representation.'
              },
              {
                step: '03',
                title: 'Online Registration',
                malayalam: 'രജിസ്ട്രേഷൻ',
                desc: 'Submit student details, stage preferences, and team names through the official helpdesk portal.'
              },
              {
                step: '04',
                title: 'Stage Check-In',
                malayalam: 'വേദിയിൽ പ്രവേശനം',
                desc: 'Report to Dalailussunna Dars, Ayiroor on 21, 22, 23 DECEMBER 2026, receive your stage credentials and compete!'
              }
            ].map((s, idx) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl bg-white p-6 shadow-md border border-[#A91F35]/15 flex flex-col justify-between space-y-4 hover:border-[#A91F35]/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-serif font-bold text-lg shadow-sm">
                    {s.step}
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#1c1917]">
                      {s.title}
                    </h3>
                    <span className="text-xs text-[#A91F35] font-semibold block">
                      {s.malayalam}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-bold text-[#A91F35]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>Official Protocol</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 07: CLOSING CALL TO ACTION */}
      <section className="py-20 md:py-28 bg-[#A91F35] text-white relative overflow-hidden select-none">
        {/* Background Mandala Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 pointer-events-none">
          <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E6A916] block">
              THE INVITATION
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              YOUR TALENT. YOUR MOMENT. YOUR STAGE.
            </h2>
            <p className="text-xs md:text-sm text-white/80 max-w-lg mx-auto font-medium">
              Step into the arenas of Dalailussunna Dars, Ayiroor. Prove your eloquence, artistic vision, and scholarship in the celebration of Nueva Era.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={scrollToExplorer}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E6A916] text-[#A91F35] font-extrabold text-xs md:text-sm shadow-xl hover:bg-[#ffd166] active:scale-95 transition-all group cursor-pointer"
            >
              <span>EXPLORE COMPETITIONS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://wa.me/918589951951?text=Hello%20Dalenzia%20Fest%202K26,%20I%20would%20like%20to%20register%20for%20the%20competitions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs md:text-sm transition-all"
            >
              <SparklesIcon className="w-4 h-4 text-[#E6A916]" />
              <span>Register via WhatsApp</span>
            </a>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold text-xs md:text-sm transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </div>

          <div className="pt-4 text-xs text-white/70">
            <span>Official Helpdesk: +91 8589951951 • Dalailussunna Dars, Ayiroor, Malappuram</span>
          </div>

        </div>
      </section>

      {/* DETAIL MODAL FOR ANY COMPETITION */}
      <AnimatePresence>
        {activeModalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalEvent(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#A91F35]/20 flex flex-col max-h-[90vh]"
            >
              {/* Modal Visual Header Banner */}
              <div className="relative h-44 md:h-52 bg-[#A91F35] overflow-hidden flex-shrink-0">
                <img
                  src={activeModalEvent.cardImage}
                  alt={activeModalEvent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Close Button */}
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title & Badges on Header */}
                <div className="absolute bottom-4 left-5 right-5 space-y-1 text-white">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase">
                      {activeModalEvent.categoryName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold">
                      {activeModalEvent.typeName}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                    {activeModalEvent.name}
                  </h3>
                </div>
              </div>

              {/* Modal Body Content (Scrollable) */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left">
                
                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F3E9] p-4 rounded-2xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-500 block">Stage Arena</span>
                    <span className="font-bold text-[#A91F35]">{activeModalEvent.stage}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Duration</span>
                    <span className="font-bold text-[#1c1917]">{activeModalEvent.duration}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Classification</span>
                    <span className="font-bold text-[#1c1917]">{activeModalEvent.typeName}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Status</span>
                    <span className="font-bold text-[#A91F35]">{activeModalEvent.statusLabel}</span>
                  </div>
                </div>

                {/* Event Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
                    SYLLABUS &amp; DESCRIPTION
                  </h4>
                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    {activeModalEvent.description}
                  </p>
                </div>

                {/* Evaluation Criteria */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
                    JUDGING &amp; EVALUATION CRITERIA
                  </h4>
                  <div className="space-y-2">
                    {activeModalEvent.criteria.map((cr, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-[#E6A916] flex-shrink-0 mt-0.5" />
                        <span>{cr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registration CTA Footer */}
                <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">
                    Festival Date: 21, 22, 23 DECEMBER 2026
                  </span>

                  <a
                    href={`https://wa.me/918589951951?text=Hello%20Dalenzia%20Fest%202K26,%20I%20would%20like%20to%20register%20for%20the%20competition:%20${encodeURIComponent(activeModalEvent.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-extrabold shadow-md transition-all active:scale-95"
                  >
                    <span>Register for this Event</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}