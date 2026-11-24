import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientGoldParticles from '../components/AmbientGoldParticles';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  Home,
  CheckCircle2,
  Sparkles as SparklesIcon,
  Download,
  Filter,
  Users,
  Trophy,
  Music,
  BookOpen,
  Mic,
  Scissors,
  Award,
  Radio,
  FileText,
  Printer,
  X,
  ExternalLink,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';

// Official 7 Confirmed Festival Events from Dalenzia Charter
const SCHEDULE_DATA = {
  day1: {
    dayId: 'day1',
    dayLabel: 'Day 01',
    dateLabel: 'Monday · December 21, 2026',
    dateShort: 'Dec 21, 2026',
    themeHighlight: 'Grand Inauguration Ceremony',
    programmes: [
      {
        id: 'EVT-D1-01',
        time: '07:00 PM – 09:30 PM',
        title: 'Inauguration',
        malayalam: 'ഉദ്ഘാടന സമ്മേളനം',
        category: 'ceremony',
        categoryLabel: 'Inauguration',
        venue: 'Main Stage',
        status: 'Confirmed',
        desc: 'Official Grand Inauguration Ceremony of Dalenzia Fest 2K26.',
        guest: 'Dignitary Council',
        icon: Award
      }
    ]
  },
  day2: {
    dayId: 'day2',
    dayLabel: 'Day 02',
    dateLabel: 'Tuesday · December 22, 2026',
    dateShort: 'Dec 22, 2026',
    themeHighlight: 'Cultural Programmes, Alumni Gathering & Burda Majlis',
    programmes: [
      {
        id: 'EVT-D2-01',
        time: '09:00 AM – 01:00 PM',
        title: 'Cultural Programmes',
        malayalam: 'സാംസ്കാരിക പരിപാടികൾ',
        category: 'cultural',
        categoryLabel: 'Cultural Programmes',
        venue: 'Main Stage',
        status: 'Confirmed',
        desc: 'Day 02 Morning Cultural Programmes & Presentations.',
        guest: 'Cultural Secretariat',
        icon: Music
      },
      {
        id: 'EVT-D2-02',
        time: '04:00 PM – 06:30 PM',
        title: 'Alumni Gathering',
        malayalam: 'പൂർവ്വ വിദ്യാർത്ഥി സംഗമം',
        category: 'sessions',
        categoryLabel: 'Alumni Gathering',
        venue: 'Main Stage',
        status: 'Confirmed',
        desc: 'Grand Dalenzia Alumni Gathering & Reunion.',
        guest: 'Alumni Association',
        icon: Users
      },
      {
        id: 'EVT-D2-03',
        time: '07:00 PM – 10:00 PM',
        title: 'Burda Majlis',
        malayalam: 'ബുർദ മജ്‌ലിസ്',
        category: 'cultural',
        categoryLabel: 'Burda Majlis',
        venue: 'Main Stage',
        status: 'Confirmed',
        desc: 'Spiritual Burda Majlis & Devotional Gathering.',
        guest: 'Sadath & Ulama Council',
        icon: Mic
      }
    ]
  },
  day3: {
    dayId: 'day3',
    dayLabel: 'Day 03',
    dateLabel: 'Wednesday · December 23, 2026',
    dateShort: 'Dec 23, 2026',
    themeHighlight: "Cultural Programmes, Parents' Meeting & Closing Ceremony",
    programmes: [
      {
        id: 'EVT-D3-01',
        time: '09:00 AM – 01:00 PM',
        title: 'Cultural Programmes',
        malayalam: 'സാംസ്കാരിക പരിപാടികൾ',
        category: 'cultural',
        categoryLabel: 'Cultural Programmes',
        venue: 'Main Stage',
        status: 'Confirmed',
        desc: 'Day 03 Cultural Showcase & Sessions.',
        guest: 'Cultural Board',
        icon: Music
      },
      {
        id: 'EVT-D3-02',
        time: '04:00 PM – 06:30 PM',
        title: "Parents' Meeting",
        malayalam: 'രക്ഷാകർതൃ സംഗമം',
        category: 'sessions',
        categoryLabel: "Parents' Meeting",
        venue: 'Main Stage',
        status: 'Confirmed',
        desc: 'Official Parents & Guardians Conclave.',
        guest: 'Institution Directorate',
        icon: Users
      },
      {
        id: 'EVT-D3-03',
        time: '08:00 PM – 10:30 PM',
        title: 'Closing Ceremony',
        malayalam: 'സമാപന സമ്മേളനം',
        category: 'ceremony',
        categoryLabel: 'Closing Ceremony',
        venue: 'Main Stage',
        status: 'Confirmed',
        desc: 'Grand Closing Ceremony, Valedictory Session & Trophy Awards.',
        guest: 'Executive Secretariat & Patrons',
        icon: Trophy
      }
    ]
  }
};

const CATEGORIES = [
  { id: 'all', name: 'All Programmes' },
  { id: 'ceremony', name: 'Ceremonies' },
  { id: 'cultural', name: 'Cultural Events' },
  { id: 'sessions', name: 'Conclaves & Gatherings' },
  { id: 'competitions', name: 'Official Competitions' }
];

const GRAND_VENUES = [
  {
    name: 'Main Stage',
    malayalam: 'പ്രധാന വേദി',
    role: 'Central Festival Stage',
    desc: "Official ceremonial and cultural stage for Inauguration, Cultural Programmes, Alumni Gathering, Burda Majlis, Parents' Meeting, and Closing Ceremony.",
    capacity: 'Main Campus Auditorium'
  },
  {
    name: 'Academic Off-Stage Halls',
    malayalam: 'അക്കാദമിക് വേദികൾ',
    role: 'Competitions & Evaluations',
    desc: 'Designated academic halls for official Stage and Off-Stage contests according to the Festival Charter.',
    capacity: 'Academic Blocks'
  }
];

export default function SchedulePage({ onNavigateHome, onNavigateEvents, onNavigateGuests }) {
  const [activeDay, setActiveDay] = useState('day1');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [storeSchedules, setStoreSchedules] = useState(() => {
    try {
      const pub = festivalStore.getPublicProgrammeSchedule();
      return pub && pub.length > 0 ? pub : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (typeof festivalStore.subscribe === 'function') {
      const unsub = festivalStore.subscribe(() => {
        try {
          const pub = festivalStore.getPublicProgrammeSchedule();
          if (pub && pub.length > 0) setStoreSchedules(pub);
        } catch (e) {
          console.error(e);
        }
      });
      return unsub;
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentDayData = useMemo(() => {
    const base = SCHEDULE_DATA[activeDay];
    if (!storeSchedules || storeSchedules.length === 0) return base;

    const dayFilter = activeDay === 'day1' ? '21' : activeDay === 'day2' ? '22' : '23';
    const dayStoreList = storeSchedules.filter(s => String(s.date).includes(dayFilter));
    if (dayStoreList.length === 0) return base;

    const mappedProgrammes = dayStoreList.map((s) => {
      let cat = 'competitions';
      const c = (s.category || '').toLowerCase();
      if (c.includes('inaug') || c.includes('closing') || c.includes('ceremony')) cat = 'ceremony';
      else if (c.includes('guest') || c.includes('conclave') || c.includes('session')) cat = 'sessions';
      else if (c.includes('cultural') || c.includes('art')) cat = 'cultural';
      else if (c.includes('admin') || c.includes('recess')) cat = 'administrative';

      return {
        id: s.id,
        time: s.timeRange,
        title: s.programmeTitle,
        malayalam: s.malayalamTitle || '',
        category: cat,
        categoryLabel: s.category || 'General',
        venue: s.stage,
        status: s.status,
        desc: s.desc || '',
        guest: s.guests && s.guests.length > 0 ? s.guests.map(g => g.name).join(', ') : '',
        icon: cat === 'ceremony' ? Award : cat === 'sessions' ? Mic : Trophy
      };
    });

    return {
      ...base,
      programmes: mappedProgrammes
    };
  }, [activeDay, storeSchedules]);

  // Filter programmes based on category
  const filteredProgrammes = useMemo(() => {
    if (selectedCategory === 'all') return currentDayData.programmes;
    return currentDayData.programmes.filter((p) => p.category === selectedCategory);
  }, [currentDayData, selectedCategory]);

  const scrollToTimeline = () => {
    const el = document.querySelector('#programme-timeline');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans overflow-x-hidden">
      
      {/* SECTION 01: SCHEDULE HERO */}
      <section className="relative bg-[#F7F3E9] overflow-hidden pt-6 pb-16 select-none border-b border-[#A91F35]/15 space-y-8">
        
        {/* Golden Ambient Particle Atmosphere */}
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
            <button
              onClick={onNavigateEvents}
              className="hover:text-[#A91F35] transition-colors cursor-pointer"
            >
              Events
            </button>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-[#A91F35] font-bold">Programme Schedule</span>
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

        {/* Hero Headline & Information Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-2">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-5 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#A91F35] text-white rounded-full text-xs font-extrabold tracking-widest uppercase shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>DALENZIA FEST 2K26 · OFFICIAL TIMETABLE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#1c1917] tracking-tight leading-[1.12]">
              THE FESTIVAL <br />
              <span className="text-[#A91F35] italic">TIMELINE</span> <br />
              <span className="text-[#E6A916]">Three Days. One Era.</span>
            </h1>

            <p className="text-sm md:text-base text-[#1c1917]/80 leading-relaxed font-normal max-w-2xl">
              Three Days. Countless Moments. One NUEVA ERA. Explore the complete three-day schedule detailing session hours, stage venues, competitive rounds, and presidential ceremonies across Ayiroor.
            </p>

            {/* Date & Venue Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-semibold text-[#1c1917] pt-1">
              <span className="flex items-center gap-1.5 text-[#A91F35]">
                <Calendar className="w-4 h-4" />
                December 21–23, 2026
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1.5 text-[#A91F35]">
                <MapPin className="w-4 h-4" />
                Dalailussunna Dars, Ayiroor
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1.5 text-[#E6A916] font-bold">
                <Clock className="w-4 h-4" />
                3 Vibrant Days · 5 Grand Arenas
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={scrollToTimeline}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A91F35] text-white hover:bg-[#8e172a] text-xs md:text-sm font-bold shadow-lg transition-all active:scale-95 group cursor-pointer"
              >
                <span>View Full Timeline</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs md:text-sm font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Schedule (PDF)</span>
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 02 & 05: NOW & NEXT CONCLAVE MONITOR */}
      <section className="py-12 bg-white relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="rounded-3xl bg-gradient-to-br from-[#A91F35] to-[#7f1325] text-white p-6 md:p-8 shadow-xl border border-[#E6A916]/40 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E6A916] text-[#A91F35] flex items-center justify-center flex-shrink-0 shadow-md">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[#E6A916] text-[10px] font-extrabold uppercase tracking-wider">
                    TIMEZONE: ASIA/KOLKATA (IST)
                  </span>
                  <span className="text-[11px] text-white/80 font-mono">
                    Official Countdown Status
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                  Next Up: Inaugural Grand Conclave
                </h3>
                <p className="text-xs text-white/80 max-w-xl">
                  Opening session commences Monday, Dec 21, 2026 at 09:30 AM at Cordova Grand Stage with Dr. Ahmed Faris and distinguished Hadith scholars.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center w-full sm:w-auto">
                <span className="text-[10px] text-[#E6A916] font-extrabold uppercase block">VENUE</span>
                <span className="text-xs font-bold text-white">Cordova Stage</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center w-full sm:w-auto">
                <span className="text-[10px] text-[#E6A916] font-extrabold uppercase block">DATE</span>
                <span className="text-xs font-bold text-white">Dec 21 · 09:30 AM</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 03 & 04: DAY SELECTOR & INTERACTIVE TIMELINE */}
      <section id="programme-timeline" className="py-16 md:py-24 bg-[#F7F3E9] relative overflow-hidden border-b border-[#A91F35]/15">
        
        {/* Background Mandala Watermark */}
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] opacity-5 pointer-events-none">
          <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#E6A916]" />
              CHRONOLOGICAL FLOW
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
              Interactive Programme Timeline
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              Explore the official 3-day schedule across 21, 22, 23 DECEMBER 2026 to view the sequence of competitive arenas, keynote addresses, and evening cultural conclaves.
            </p>
          </div>

          {/* Interactive Three-Day Selector Tabs */}
          <div className="flex justify-center">
            <div className="bg-white p-2 rounded-3xl shadow-lg border border-[#A91F35]/15 flex items-center gap-2 max-w-lg w-full">
              {[
                { id: 'day1', label: 'DAY 01', date: 'DEC 21, 2026' },
                { id: 'day2', label: 'DAY 02', date: 'DEC 22, 2026' },
                { id: 'day3', label: 'DAY 03', date: 'DEC 23, 2026' }
              ].map((tab) => {
                const isActive = activeDay === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDay(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isActive
                        ? 'bg-[#A91F35] text-white shadow-md scale-[1.02]'
                        : 'text-stone-700 hover:text-[#A91F35] hover:bg-[#F7F3E9]'
                    }`}
                  >
                    <span className="text-sm font-serif font-bold tracking-wide">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold tracking-wider ${
                        isActive ? 'text-[#E6A916]' : 'text-stone-500'
                      }`}
                    >
                      {tab.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Header Banner */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#A91F35]/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-[#A91F35] uppercase tracking-wider block">
                {currentDayData.dayLabel} SCHEDULE
              </span>
              <h3 className="text-lg md:text-xl font-serif font-bold text-[#1c1917]">
                {currentDayData.dateLabel}
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {currentDayData.themeHighlight}
              </p>
            </div>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E6A916]/20 text-[#A91F35] hover:bg-[#E6A916]/30 text-xs font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print {currentDayData.dayLabel} PDF</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#A91F35] text-white shadow-sm scale-105'
                      : 'bg-white text-stone-700 hover:bg-[#A91F35]/10 hover:text-[#A91F35] border border-stone-200'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 md:pl-10 border-l-2 border-[#A91F35]/25 space-y-8 text-left">
            {filteredProgrammes.map((prog, idx) => {
              const Icon = prog.icon || Clock;

              return (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="relative group"
                >
                  {/* Timeline Node Bullet */}
                  <div className="absolute -left-[31px] md:-left-[47px] top-6 w-5 h-5 rounded-full bg-[#E6A916] border-4 border-[#A91F35] group-hover:scale-125 transition-transform shadow-md" />

                  {/* Schedule Card */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-[#A91F35]/15 hover:border-[#A91F35]/40 hover:shadow-xl transition-all space-y-4">
                    
                    {/* Top Row: Time & Category */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="font-mono text-sm md:text-base font-bold text-[#A91F35]">
                          {prog.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916]/20 text-[#A91F35] text-[10px] font-extrabold uppercase">
                          {prog.categoryLabel}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                          {prog.status}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h4 className="text-xl md:text-2xl font-serif font-bold text-[#1c1917] group-hover:text-[#A91F35] transition-colors">
                        {prog.title}
                      </h4>
                      <span className="text-xs text-[#A91F35] font-semibold block">
                        {prog.malayalam}
                      </span>
                      <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-normal pt-1">
                        {prog.desc}
                      </p>
                    </div>

                    {/* Bottom Metadata: Venue & Guests */}
                    <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#A91F35]" />
                        <span>{prog.venue}</span>
                      </div>

                      {prog.guest && (
                        <div className="flex items-center gap-1 text-[#A91F35] font-semibold">
                          <Users className="w-3.5 h-3.5" />
                          <span>{prog.guest}</span>
                        </div>
                      )}
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 06: VERIFIED GRAND VENUES & STAGE DIRECTORY */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
              <MapPin className="w-3.5 h-3.5 text-[#E6A916]" />
              FESTIVAL GROUNDS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
              Grand Stages &amp; Venues
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              Dalailussunna Dars, Perumpadappu, Ayiroor, Malappuram 679580, Kerala.
            </p>
          </div>

          {/* Venues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GRAND_VENUES.map((v, idx) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-3xl bg-[#F7F3E9]/60 hover:bg-white p-6 shadow-md border border-[#A91F35]/15 hover:border-[#A91F35]/40 hover:shadow-xl transition-all space-y-4 flex flex-col justify-between text-left group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#1c1917] group-hover:text-[#A91F35] transition-colors">
                      {v.name}
                    </h3>
                    <span className="text-xs text-[#A91F35] font-semibold block">
                      {v.malayalam}
                    </span>
                    <span className="text-[11px] text-[#E6A916] font-bold uppercase tracking-wider block mt-0.5">
                      {v.role}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] font-bold text-stone-500">
                  <span>{v.capacity}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 07: PROMINENT DOWNLOAD SCHEDULE BUTTON & MODAL */}
      <section className="py-16 bg-[#F7F3E9] relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center mx-auto shadow-xl">
            <Download className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-[#1c1917]">
              Download the Official Programme Brochure
            </h3>
            <p className="text-xs md:text-sm text-stone-600 max-w-lg mx-auto">
              Get the approved print-friendly PDF schedule containing detailed timings, room allotments, and guidelines for both festival days.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#A91F35] text-white hover:bg-[#8e172a] font-extrabold text-xs md:text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#E6A916]" />
              <span>DOWNLOAD PROGRAMME SCHEDULE (PDF)</span>
            </button>

            <button
              onClick={handlePrintSchedule}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#A91F35] hover:bg-stone-50 font-bold text-xs md:text-sm border border-[#A91F35]/20 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print View</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 08: CLOSING SECTION & CTA */}
      <section className="py-20 md:py-28 bg-[#A91F35] text-white relative overflow-hidden select-none">
        {/* Background Mandala Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 pointer-events-none">
          <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E6A916] block">
              FESTIVAL EPILOGUE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              EVERY MOMENT HAS A STORY. <br />
              <span className="text-[#E6A916]">EVERY MOMENT IS PART OF NUEVA ERA.</span>
            </h2>
            <p className="text-xs md:text-sm text-white/80 max-w-lg mx-auto font-medium">
              Join thousands of scholars, families, and thinkers across two unforgettable days of wisdom, expression, and cultural pride at Dalailussunna Dars, Ayiroor.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateEvents}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E6A916] text-[#A91F35] font-extrabold text-xs md:text-sm shadow-xl hover:bg-[#ffd166] active:scale-95 transition-all group cursor-pointer"
            >
              <span>EXPLORE FESTIVAL EVENTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs md:text-sm transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </button>
          </div>

          <div className="pt-4 text-xs text-white/70">
            <span>Official Helpline: +91 8589951951 • Dalailussunna Dars, Ayiroor, Malappuram</span>
          </div>

        </div>
      </section>

      {/* PRINT-FRIENDLY PDF SCHEDULE MODAL */}
      <AnimatePresence>
        {isPdfModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative z-10 w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#A91F35]/20 flex flex-col max-h-[90vh]"
            >
              {/* Header Banner */}
              <div className="bg-[#A91F35] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 bg-white p-1 rounded-lg">
                    <img
                      src="/assets/dalenzia_fest_logo.png"
                      alt="Dalenzia Fest"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">
                      Official Programme Timetable (PDF Preview)
                    </h3>
                    <p className="text-xs text-[#E6A916]">
                      Dalenzia Fest 2K26 · 21, 22, 23 DECEMBER 2026 · Ayiroor, Malappuram
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintSchedule}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    title="Print Document"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsPdfModalOpen(false)}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Content Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 text-left font-sans">
                
                {/* Notice */}
                <div className="bg-[#F7F3E9] p-4 rounded-2xl border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
                  <span>Authorized by Dalailussunna Dars Festival Secretariat, Ayiroor.</span>
                  <span className="font-mono text-[#A91F35] font-bold">Document Version 2.0</span>
                </div>

                {/* Day 01 Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-[#A91F35] pb-1">
                    <h4 className="text-base font-serif font-bold text-[#A91F35]">
                      DAY 01 – MONDAY, DECEMBER 21, 2026
                    </h4>
                    <span className="text-xs text-stone-500 font-semibold">Cordova &amp; Al-Azhar Stages</span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700">
                        <th className="p-2.5 font-bold">Time</th>
                        <th className="p-2.5 font-bold">Programme</th>
                        <th className="p-2.5 font-bold">Venue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {SCHEDULE_DATA.day1.programmes.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-2.5 font-mono font-bold text-[#A91F35] whitespace-nowrap">{p.time}</td>
                          <td className="p-2.5 font-semibold text-stone-900">{p.title}</td>
                          <td className="p-2.5 text-stone-600">{p.venue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Day 02 Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-[#A91F35] pb-1">
                    <h4 className="text-base font-serif font-bold text-[#A91F35]">
                      DAY 02 – TUESDAY, DECEMBER 22, 2026
                    </h4>
                    <span className="text-xs text-stone-500 font-semibold">Cordova, Granada &amp; Digital Lab</span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700">
                        <th className="p-2.5 font-bold">Time</th>
                        <th className="p-2.5 font-bold">Programme</th>
                        <th className="p-2.5 font-bold">Venue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {SCHEDULE_DATA.day2.programmes.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-2.5 font-mono font-bold text-[#A91F35] whitespace-nowrap">{p.time}</td>
                          <td className="p-2.5 font-semibold text-stone-900">{p.title}</td>
                          <td className="p-2.5 text-stone-600">{p.venue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Actions inside modal */}
                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Dalailussunna Dars, Ayiroor, Malappuram • Helpdesk: +91 8589951951
                  </span>

                  <button
                    onClick={handlePrintSchedule}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A91F35] text-white hover:bg-[#8e172a] text-xs font-bold transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Document / Save as PDF</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}