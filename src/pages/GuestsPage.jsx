import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientGoldParticles from '../components/AmbientGoldParticles';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Home,
  CheckCircle2,
  Sparkles as SparklesIcon,
  X,
  Share2,
  Quote,
  ExternalLink,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  Info
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import OfficialFestivalDateVenue from '../components/OfficialFestivalDateVenue';

// Authentic Dalenzia Guests Data based on Official Model Showcase
const STATIC_GUESTS = [];

const GUEST_CATEGORIES = [
  { id: 'all', name: 'All Guests', count: 6 },
  { id: 'honour', name: 'Guests of Honour', count: 1 },
  { id: 'chief', name: 'Chief Guests', count: 1 },
  { id: 'speaker', name: 'Guest Speakers', count: 1 },
  { id: 'inaugural', name: 'Inaugural', count: 1 },
  { id: 'closing', name: 'Closing Ceremony', count: 1 }
];

export default function GuestsPage({ onNavigateHome, onNavigateEvents }) {
  const [guestsList, setGuestsList] = useState(() => festivalStore.getPublicGuests() || []);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setGuestsList(festivalStore.getPublicGuests() || []);
    });
    return unsub;
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filtered guest list
  const filteredGuests = useMemo(() => {
    if (activeCategory === 'all') return guestsList;
    return guestsList.filter((g) => (g.category || '').toLowerCase() === activeCategory.toLowerCase());
  }, [guestsList, activeCategory]);

  const featuredGuest = guestsList[0] || null;

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const scrollToGallery = () => {
    const el = document.querySelector('#guest-gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans overflow-x-hidden">
      
      {/* SECTION 01: GUEST HERO */}
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
            <span className="text-[#A91F35] font-bold">Guests of Honour</span>
          </div>

          {/* Subtle Edition Pill Badge (avoiding duplicate Dalenzia logo already present in Navbar) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-bold uppercase tracking-wider border border-[#A91F35]/20 shrink-0">
            <span>NUEVA ERA · 2K26</span>
          </div>
        </div>

        {/* Hero Headline & 3D Stage Composition */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#A91F35] text-white rounded-full text-xs font-extrabold tracking-widest uppercase shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>DALENZIA FEST 2K26 · EMINENT VOICES</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1c1917] tracking-tight leading-[1.12]">
              DISTINGUISHED <br />
              <span className="text-[#A91F35] italic">GUESTS</span> <br />
              <span className="text-[#E6A916]">Of Honour.</span>
            </h1>

            <p className="text-sm md:text-base text-[#1c1917]/80 leading-relaxed font-normal max-w-lg">
              The Minds Behind the Inspiration. Eminent Islamic scholars, academic thinkers, writers, and cultural dignitaries gracing the second edition arenas of Dalenzia Fest.
            </p>

            {/* Official Date & Venue Info */}
            <div className="pt-2 pb-1">
              <OfficialFestivalDateVenue align="left" size="sm" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={scrollToGallery}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A91F35] text-white hover:bg-[#8e172a] text-xs md:text-sm font-bold shadow-lg transition-all active:scale-95 group cursor-pointer"
              >
                <span>Explore Guest Profiles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => featuredGuest && setSelectedGuest(featuredGuest)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs md:text-sm font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Featured Keynote Profile</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
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
                src="/assets/guests/guests_hero_stage.png"
                alt="Dalenzia Guests of Honour 3D Stage - Royal Crimson Armchair, Studio Microphone, Arch & Hourglass"
                className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700"
              />
              
              {/* Bottom Subtle Overlay Ribbon */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#A91F35]/90 via-[#A91F35]/60 to-transparent p-4 flex items-center justify-between text-white text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#E6A916]" />
                  Eminent Scholars &amp; Thinkers
                </span>
                <span className="text-[#E6A916] font-bold">Keynote Conclave Arenas</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {guestsList.length === 0 ? (
        <section className="py-24 bg-white border-b border-[#A91F35]/15 text-center">
          <div className="max-w-xl mx-auto px-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#F7F3E9] text-[#A91F35] flex items-center justify-center mx-auto shadow-inner border border-[#A91F35]/15">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-black text-stone-900">
              Official Guest Directory In Preparation
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Dignitaries, keynote scholars, and honoured guests for DALENZIA FEST 2K26 – NUEVA ERA will be officially announced here as invitations and keynote slots are certified by the Festival Convener Board.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* SECTION 02: FEATURED GUEST OF HONOUR (Large Editorial Portrait) */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#E6A916]" />
              EDITORIAL SPOTLIGHT
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
              Featured Guest of Honour
            </h2>
            <p className="text-xs md:text-sm text-stone-600 font-medium">
              An intimate look at the scholarly leadership presiding over the opening keynote of Dalenzia Fest 2K26.
            </p>
          </div>

          {/* Museum-style Large Editorial Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl bg-gradient-to-br from-[#A91F35] to-[#7f1325] text-white p-6 md:p-12 shadow-2xl border border-[#E6A916]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden"
          >
            {/* Background Mandala Watermark */}
            <div className="absolute -bottom-20 -right-20 w-96 h-96 opacity-10 pointer-events-none">
              <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
            </div>

            {/* Left Portrait with 3D Architectural Double-Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-2 rounded-3xl bg-gradient-to-b from-[#E6A916] to-[#A91F35] shadow-2xl">
                <div className="relative w-64 md:w-80 h-72 md:h-96 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30">
                  <img
                    src={featuredGuest.image}
                    alt={featuredGuest.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-[#E6A916] text-[#A91F35] font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {featuredGuest.categoryLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Biography & Conclave Info */}
            <div className="lg:col-span-7 space-y-6 text-left relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#E6A916] uppercase tracking-widest block">
                  KEYNOTE SPEAKER · AL-AZHAR STAGE
                </span>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                  {featuredGuest.name}
                </h3>
                <p className="text-base text-[#E6A916] font-semibold">
                  {featuredGuest.designation} · {featuredGuest.malayalam}
                </p>
              </div>

              <p className="text-sm md:text-base text-white/90 leading-relaxed font-normal">
                {featuredGuest.bio}
              </p>

              {/* Keynote Session Box */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E6A916] uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>CONCLAVE ADDRESS</span>
                </div>
                <h4 className="text-base md:text-lg font-serif font-bold text-white">
                  "{featuredGuest.sessionTitle}"
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E6A916]" />
                    {featuredGuest.date} · {featuredGuest.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E6A916]" />
                    {featuredGuest.stage}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => featuredGuest && setSelectedGuest(featuredGuest)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs md:text-sm font-extrabold shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>View Complete Profile &amp; Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* SECTION 03 & 04: INTERACTIVE PORTRAIT CAROUSEL (Direct Model Replication) */}
      <section id="guest-gallery" className="py-16 md:py-24 bg-[#F7F3E9] relative overflow-hidden border-b border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          {/* Section Heading & Category Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#A91F35]/15 pb-6">
            <div className="space-y-2 text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A91F35] block">
                FESTIVAL RETINUE
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
                Guest Showcase Gallery
              </h2>
              <p className="text-xs md:text-sm text-stone-600 font-medium max-w-xl">
                Browse through official portraits, designations, and scheduled stage discourses.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {GUEST_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#A91F35] text-white shadow-sm scale-105'
                        : 'bg-white text-stone-700 hover:bg-[#A91F35]/10 hover:text-[#A91F35] border border-stone-200'
                    }`}
                  >
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

          {/* Interactive 3-Card Carousel replicating the official model image */}
          <div className="relative py-4">
            
            {/* Carousel Nav Arrows */}
            <div className="hidden md:flex items-center justify-between absolute top-1/2 -translate-y-1/2 -left-4 -right-4 z-20 pointer-events-none">
              <button
                onClick={handlePrevCarousel}
                className="w-12 h-12 rounded-full bg-[#A91F35] text-white hover:bg-[#8e172a] shadow-xl flex items-center justify-center pointer-events-auto transition-transform active:scale-95 cursor-pointer"
                aria-label="Previous Guest"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextCarousel}
                className="w-12 h-12 rounded-full bg-[#A91F35] text-white hover:bg-[#8e172a] shadow-xl flex items-center justify-center pointer-events-auto transition-transform active:scale-95 cursor-pointer"
                aria-label="Next Guest"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* 3 Authentic Cards Grid matching the official design layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Card 1: Dr. Ahmed Faris */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl bg-white border border-[#A91F35]/15 overflow-hidden shadow-md hover:shadow-xl hover:border-[#A91F35]/40 transition-all p-5 flex flex-col justify-between space-y-4 group cursor-pointer"
                onClick={() => setSelectedGuest(GUESTS[1])}
              >
                <div className="flex items-center gap-4">
                  {/* Portrait with Yellow Half-Moon Backdrop */}
                  <div className="relative w-28 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-[#F7F3E9] p-1 border border-stone-200">
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#E6A916]/80 -z-0" />
                    <img
                      src={GUESTS[1].image}
                      alt={GUESTS[1].name}
                      className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase">
                      {GUESTS[1].categoryLabel}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1c1917] group-hover:text-[#A91F35] transition-colors leading-tight">
                      {GUESTS[1].name}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">
                      {GUESTS[1].designation}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35] group-hover:translate-x-1 transition-transform">
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>

              {/* Card 2: Usthad Muhammed Rashid (CENTER, ELEVATED, CRIMSON CARD) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl bg-gradient-to-br from-[#A91F35] to-[#7f1325] text-white border-2 border-[#E6A916] overflow-hidden shadow-2xl p-6 flex flex-col justify-between space-y-5 relative group cursor-pointer md:-translate-y-2"
                onClick={() => setSelectedGuest(GUESTS[0])}
              >
                <div className="flex items-center gap-4">
                  {/* Portrait with Golden Backdrop */}
                  <div className="relative w-32 h-36 flex-shrink-0 rounded-2xl overflow-hidden bg-white/10 p-1 border border-white/30">
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#E6A916] -z-0" />
                    <img
                      src={GUESTS[0].image}
                      alt={GUESTS[0].name}
                      className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase shadow-sm">
                      {GUESTS[0].categoryLabel}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white tracking-tight leading-tight">
                      {GUESTS[0].name}
                    </h3>
                    <p className="text-xs text-[#E6A916] font-semibold">
                      {GUESTS[0].designation}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-[#E6A916] group-hover:translate-x-1 transition-transform">
                  <span>View Complete Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>

              {/* Card 3: Usthad Salman Saqafi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl bg-white border border-[#A91F35]/15 overflow-hidden shadow-md hover:shadow-xl hover:border-[#A91F35]/40 transition-all p-5 flex flex-col justify-between space-y-4 group cursor-pointer"
                onClick={() => setSelectedGuest(GUESTS[2])}
              >
                <div className="flex items-center gap-4">
                  {/* Portrait with Yellow Backdrop */}
                  <div className="relative w-28 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-[#F7F3E9] p-1 border border-stone-200">
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#E6A916]/80 -z-0" />
                    <img
                      src={GUESTS[2].image}
                      alt={GUESTS[2].name}
                      className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase">
                      {GUESTS[2].categoryLabel}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#1c1917] group-hover:text-[#A91F35] transition-colors leading-tight">
                      {GUESTS[2].name}
                    </h3>
                    <p className="text-xs text-stone-600 font-medium">
                      {GUESTS[2].designation}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35] group-hover:translate-x-1 transition-transform">
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>

            </div>

            {/* 5 Carousel Dots Indicator */}
            <div className="flex items-center justify-center gap-2 pt-8">
              {[0, 1, 2, 3, 4].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setCarouselIndex(dot % 3)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    carouselIndex === dot % 3
                      ? 'w-8 bg-[#A91F35]'
                      : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Slide ${dot + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Additional Official Committee Placeholders (Preserving strict Data Integrity) */}
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[2px] bg-[#A91F35]" />
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#A91F35]">
                ADDITIONAL INAUGURAL &amp; VALEDICTORY DELEGATIONS
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredGuests.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedGuest(g)}
                  className="rounded-3xl bg-white border border-dashed border-[#A91F35]/30 p-5 space-y-4 hover:border-[#A91F35] transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] text-[10px] font-extrabold uppercase">
                      {g.categoryLabel}
                    </span>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {g.date}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-serif font-bold text-[#1c1917]">
                      {g.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">
                      {g.designation}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {g.sessionTitle}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35]">
                    <span className="text-[11px] text-[#E6A916] font-semibold">
                      [Pending Committee Portrait]
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
        </>
      )}

      {/* SECTION 05: THE OFFICIAL QUOTE BANNER FROM THE MODEL */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#A91F35] via-[#8c182b] to-[#6d1120] text-white p-6 md:p-8 shadow-xl border border-[#E6A916]/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left: Nueva Era branding */}
            <div className="md:col-span-3 flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0 md:pr-4">
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-serif font-extrabold tracking-widest text-[#E6A916] block">
                  NUEVA
                </span>
                <span className="text-xl md:text-2xl font-serif font-extrabold tracking-widest text-white block">
                  ERA
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 w-6 h-6">
                <span className="w-2.5 h-2.5 bg-[#E6A916] rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-[#A91F35] border border-[#E6A916] rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-[#E6A916] rounded-[2px]" />
                <span className="w-2.5 h-2.5 bg-white rounded-[2px]" />
              </div>
            </div>

            {/* Middle: The Authentic Quote from the model */}
            <div className="md:col-span-6 flex items-center gap-3 text-left">
              <Quote className="w-8 h-8 text-[#E6A916] flex-shrink-0 opacity-80" />
              <p className="text-base md:text-xl font-serif italic text-white/95 leading-relaxed font-normal">
                "Conversations with minds that shape ideas, learning and society."
              </p>
            </div>

            {/* Right: Architectural Arches Vignette from the model */}
            <div className="md:col-span-3 flex justify-center md:justify-end">
              <div className="h-16 md:h-20 rounded-2xl overflow-hidden border border-white/30 shadow-md">
                <img
                  src="/assets/guests/vignette_arches.png"
                  alt="Classical Islamic Architectural Arches"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 06: CLOSING SCENE & CALL TO ACTION */}
      <section className="py-20 md:py-28 bg-[#A91F35] text-white relative overflow-hidden select-none">
        {/* Background Mandala Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 pointer-events-none">
          <img src="/assets/mandala.png" alt="" className="w-full h-full object-contain animate-spin-slow" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E6A916] block">
              THE FESTIVAL CALLING
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              INSPIRATION. KNOWLEDGE. A NEW ERA.
            </h2>
            <p className="text-xs md:text-sm text-white/80 max-w-lg mx-auto font-medium">
              Join distinguished scholars and over 5,000 attendees at Dalailussunna Dars, Ayiroor. Witness transformative discussions, academic excellence, and cultural illumination.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateEvents}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E6A916] text-[#A91F35] font-extrabold text-xs md:text-sm shadow-xl hover:bg-[#ffd166] active:scale-95 transition-all group cursor-pointer"
            >
              <span>EXPLORE THE FESTIVAL</span>
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

        </div>
      </section>

      {/* SECTION 05: GUEST DETAILS MODAL PANEL */}
      <AnimatePresence>
        {selectedGuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuest(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Profile Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#A91F35]/20 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-[#A91F35] to-[#7f1325] text-white p-6 md:p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedGuest.image ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#E6A916] bg-white p-0.5 flex-shrink-0 shadow-md">
                      <img
                        src={selectedGuest.image}
                        alt={selectedGuest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl border-2 border-[#E6A916] bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-[#E6A916]" />
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase">
                      {selectedGuest.categoryLabel}
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                      {selectedGuest.name}
                    </h3>
                    <p className="text-xs text-[#E6A916] font-semibold">
                      {selectedGuest.designation} · {selectedGuest.malayalam}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGuest(null)}
                  className="w-9 h-9 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer self-start"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-left">
                
                {/* Biography */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
                    SCHOLARLY BIOGRAPHY
                  </h4>
                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    {selectedGuest.bio}
                  </p>
                </div>

                {/* Festival Conclave Session */}
                <div className="bg-[#F7F3E9] p-5 rounded-2xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-[#A91F35] uppercase tracking-wider block">
                    FESTIVAL SESSION &amp; STAGE DISCOURSE
                  </span>
                  <h5 className="text-base font-serif font-bold text-[#1c1917]">
                    "{selectedGuest.sessionTitle}"
                  </h5>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-[#A91F35]">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedGuest.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {selectedGuest.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {selectedGuest.stage}
                    </span>
                  </div>
                </div>

                {/* Academic Credentials */}
                {selectedGuest.credentials && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
                      ACADEMIC CREDENTIALS &amp; DISTINCTIONS
                    </h4>
                    <div className="space-y-1.5">
                      {selectedGuest.credentials.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E6A916] flex-shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connect / Helpdesk CTA */}
                <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-stone-500">
                    Dalailussunna Dars, Ayiroor, Kerala
                  </span>

                  <a
                    href={`https://wa.me/916282925271?text=Hello%20Dalenzia%20Fest%202K26,%20I%20have%20an%20inquiry%20regarding%20the%20session%20by%20${encodeURIComponent(selectedGuest.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E6A916] text-[#A91F35] hover:bg-[#ffd166] text-xs font-extrabold shadow-md transition-all active:scale-95"
                  >
                    <span>Inquire About Session</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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