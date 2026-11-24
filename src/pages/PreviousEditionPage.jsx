import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Calendar,
  MapPin,
  Sparkles,
  Play,
  Film,
  Camera,
  Layers,
  ChevronRight,
  ExternalLink,
  Download,
  X,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Heart,
  Share2,
  Maximize2,
  ChevronLeft,
  Info,
  FileText,
  Newspaper,
  Volume2,
  Radio,
  Eye,
  Smartphone,
  Flame,
  Check,
  Music,
  CreditCard,
  IdCard,
  Compass,
  Globe,
  Tag,
  RotateCcw,
  TrendingUp,
  Zap
} from 'lucide-react';
import {
  EDITION_2K25_INFO,
  OFFICIAL_MAIN_POSTER_2K25,
  THEME_2K25_INFO,
  LOGO_LAUNCH_2K25,
  STAGE_CONCEPTS_2K25,
  THEME_SONG_2K25,
  CHAMPIONSHIP_2K25,
  KALA_PRATHIBHA_2K25,
  QAWWALI_HIGHLIGHT_2K25,
  DIGITAL_EXPERIENCE_2K25,
  OFFICIAL_BADGES_2K25,
  STUDENT_ID_CARDS_2K25,
  DALENZIA_2K25_ID_CARDS,
  STAGE_HIGHLIGHTS_2K25,
  PHOTO_GALLERY_2K25,
  VIDEO_HIGHLIGHTS_2K25,
  NEWS_BULLETIN_2K25,
  FESTIVAL_RECAP_2K25,
  INSTAGRAM_STORIES_2K25,
  OFFICIAL_TEAM_2K25,
  THANK_YOU_2K25,
  COMPETITION_RESULTS_2K25
} from '../data/dalenzia2k25Data';
import InteractiveStage3DViewer from '../components/InteractiveStage3DViewer';
import { STAGES_3D_DATA } from '../data/stage3DData';
import WhatsAppCommunitySection from '../components/WhatsAppCommunitySection';

export default function PreviousEditionPage({ onNavigateHome }) {
  // Stage 3D Active Selection
  const [selectedStage3DId, setSelectedStage3DId] = useState('stage-01');
  const activeStage3D = useMemo(() => {
    return STAGES_3D_DATA.find((s) => s.id === selectedStage3DId) || STAGES_3D_DATA[0];
  }, [selectedStage3DId]);

  // Theme Song Player Toggle (Inline YouTube Player vs Static Cover)
  const [isThemeSongPlaying, setIsThemeSongPlaying] = useState(false);

  // Photo Gallery Filter & Lightbox State
  const [photoCategory, setPhotoCategory] = useState('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  // Video Highlights Filter, Active Modal & Inline Player State
  const [videoCategory, setVideoCategory] = useState('all');
  const [videoSubCategory, setVideoSubCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [inlinePlayingVideoId, setInlinePlayingVideoId] = useState(null);

  // Results Search & Category Filter & Modal
  const [resultsSearch, setResultsSearch] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);

  // News Bulletin Active Article & View State
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [newsViewMode, setNewsViewMode] = useState('reader');

  // Instagram Story Viewer Active Index
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Universal Poster Lightbox Modal (for Any Uncropped Artwork)
  const [posterLightboxItem, setPosterLightboxItem] = useState(null);

  // Championship Journey Interactive Filter State ('all' | 'after-10' | 'after-20' | 'after-30' | 'after-45' | 'final-result')
  const [activeJourneyStage, setActiveJourneyStage] = useState('all');

  // Dedicated Kala Prathibha ID Card Modal (Front & Back Interactive Switcher)
  const [activeKalaPrathibhaIdCard, setActiveKalaPrathibhaIdCard] = useState(null);
  const [idCardSide, setIdCardSide] = useState('front'); // 'front' | 'back'

  // Horizontal Scroll Refs for Badges & ID Cards
  const badgesScrollRef = useRef(null);
  const idCardsScrollRef = useRef(null);

  // ID Cards Filter State ('ALL', 'DAZZLERS', 'DYNAMOS', 'KALA_PRATHIBHA')
  const [idCardFilter, setIdCardFilter] = useState('ALL');

  const scrollContainer = (ref, offset) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Safe internal historical archive section scroller (prevents route hijacking to 2K26)
  const scrollToArchiveSection = (sectionId) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtered ID Cards
  const displayedIdCards = useMemo(() => {
    if (idCardFilter === 'DAZZLERS') {
      return DALENZIA_2K25_ID_CARDS.filter(c => c.team.toLowerCase().includes('dazzlers'));
    }
    if (idCardFilter === 'DYNAMOS') {
      return DALENZIA_2K25_ID_CARDS.filter(c => c.team.toLowerCase().includes('dynamos'));
    }
    if (idCardFilter === 'KALA_PRATHIBHA') {
      return DALENZIA_2K25_ID_CARDS.filter(c => c.isKalaPrathibha);
    }
    return DALENZIA_2K25_ID_CARDS;
  }, [idCardFilter]);

  // General Photo Gallery (Excludes Prize Distribution photos to eliminate duplicate display)
  const generalGalleryPhotos = useMemo(() => {
    return PHOTO_GALLERY_2K25.filter(p => p.category !== 'prizes');
  }, []);

  // Photo Gallery Categories definition (Prize Distribution count updated to 0)
  const galleryCategories = [
    { id: 'all', label: 'All Photos', count: generalGalleryPhotos.length },
    { id: 'inaugural', label: 'Inauguration', count: generalGalleryPhotos.filter(p => p.category === 'inaugural').length },
    { id: 'programs', label: 'Stage Programmes', count: generalGalleryPhotos.filter(p => p.category === 'programs').length },
    { id: 'prizes', label: 'Prize Distribution', count: 0 },
    { id: 'closing', label: 'Closing Ceremony', count: generalGalleryPhotos.filter(p => p.category === 'closing').length },
    { id: 'celebrations', label: 'Team Moments', count: generalGalleryPhotos.filter(p => p.category === 'celebrations').length },
    { id: 'moments', label: 'Special Moments', count: generalGalleryPhotos.filter(p => p.category === 'moments').length }
  ];

  // Filtered Photos (Does not display Prize Distribution photos in this gallery)
  const filteredPhotos = useMemo(() => {
    if (photoCategory === 'prizes') return [];
    if (photoCategory === 'all') return generalGalleryPhotos;
    return generalGalleryPhotos.filter(p => p.category === photoCategory);
  }, [photoCategory, generalGalleryPhotos]);

  // Dynamic Video Category & SubCategory Counts (Calculated from Real 27 Videos)
  const videoCategoryCounts = useMemo(() => {
    const counts = {
      all: VIDEO_HIGHLIGHTS_2K25.length,
      anthem: 0,
      highlights: 0,
      ceremony: 0,
      performances: 0,
      production: 0
    };
    VIDEO_HIGHLIGHTS_2K25.forEach(v => {
      if (counts[v.category] !== undefined) {
        counts[v.category]++;
      }
    });
    return counts;
  }, []);

  const videoSubCategoryCounts = useMemo(() => {
    const counts = {};
    VIDEO_HIGHLIGHTS_2K25.forEach(v => {
      if (v.subCategory) {
        counts[v.subCategory] = (counts[v.subCategory] || 0) + 1;
      }
    });
    return counts;
  }, []);

  // Filtered Videos (Preserves User's Exact Highlight Sequence 01 to 11)
  const filteredVideos = useMemo(() => {
    let list = VIDEO_HIGHLIGHTS_2K25;
    if (videoCategory !== 'all') {
      list = list.filter(v => v.category === videoCategory);
    }
    if (videoSubCategory !== 'all') {
      list = list.filter(v => v.subCategory === videoSubCategory);
    }
    // Strictly preserve Highlight 01 to 11 sequence when viewing highlights or all
    if (videoCategory === 'highlights') {
      return [...list].sort((a, b) => (a.highlightNumber || 0) - (b.highlightNumber || 0));
    }
    return list;
  }, [videoCategory, videoSubCategory]);

  // Filtered Results
  const filteredResults = useMemo(() => {
    return COMPETITION_RESULTS_2K25.filter(r => {
      if (!resultsSearch.trim()) return true;
      const q = resultsSearch.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.filename.toLowerCase().includes(q) || r.folder.toLowerCase().includes(q);
    });
  }, [resultsSearch]);

  // Lightbox Next/Prev Handlers
  const handleNextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  // Dedicated Prize Distribution Moments of Honour Collection
  const prizePhotos = useMemo(() => {
    return PHOTO_GALLERY_2K25.filter(p => p.category === 'prizes');
  }, []);

  // Dedicated Lightbox State (-1 = Stage Flex Backdrop, 0..30 = Prize Photo)
  const [honourLightboxIndex, setHonourLightboxIndex] = useState(null);

  const handleNextHonour = () => {
    if (honourLightboxIndex === null) return;
    if (honourLightboxIndex === -1) {
      setHonourLightboxIndex(0);
    } else {
      setHonourLightboxIndex((honourLightboxIndex + 1) % prizePhotos.length);
    }
  };

  const handlePrevHonour = () => {
    if (honourLightboxIndex === null) return;
    if (honourLightboxIndex === -1) {
      setHonourLightboxIndex(prizePhotos.length - 1);
    } else if (honourLightboxIndex === 0) {
      setHonourLightboxIndex(prizePhotos.length - 1);
    } else {
      setHonourLightboxIndex(honourLightboxIndex - 1);
    }
  };

  // Keyboard navigation for The Moments of Honour Lightbox
  React.useEffect(() => {
    if (honourLightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setHonourLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        if (honourLightboxIndex === -1) setHonourLightboxIndex(0);
        else setHonourLightboxIndex((honourLightboxIndex + 1) % prizePhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        if (honourLightboxIndex === -1 || honourLightboxIndex === 0) setHonourLightboxIndex(prizePhotos.length - 1);
        else setHonourLightboxIndex(honourLightboxIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [honourLightboxIndex, prizePhotos.length]);

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans">
      
      {/* ========================================================================= */}
      {/* 0. STICKY TOP HEADER & BREADCRUMB                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-[60px] md:top-[72px] z-40 bg-[#F7F3E9]/95 backdrop-blur-md border-b border-[#A91F35]/10 py-2.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Breadcrumb & Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#A91F35] transition-colors cursor-pointer"
            >
              <span>← Back to 2K26</span>
            </button>
            <span className="h-4 w-[1px] bg-stone-300" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E6A916]" />
              <span className="font-serif font-black text-sm tracking-tight text-[#A91F35]">
                DALENZIA 2K25 ARCHIVES
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#A91F35]/10 text-[#A91F35] font-black px-2 py-0.5 rounded-full">
                First Edition
              </span>
            </div>
          </div>

          {/* Quick-Jump Navigation Pills */}
          <nav
            className="flex items-center gap-2 overflow-x-auto py-1 text-xs font-semibold no-scrollbar scrollbar-none select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-hero')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Main Poster
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-theme')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Theme
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-logolaunch')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Logo Launch
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-stagedesign')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Flame className="w-3 h-3 text-[#A91F35]" /> Stage Design
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-themesong')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Music className="w-3 h-3 text-[#E6A916]" /> Theme Song
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-results')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trophy className="w-3 h-3 text-[#E6A916]" /> Results
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-qawwali')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Qawwali
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-digitalweb')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3 h-3 text-[#2563EB]" /> Digital Web
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-badges')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Badges
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-idcards')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              ID Cards
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-gallery')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Gallery ({generalGalleryPhotos.length})
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-moments-of-honour')}
              className="px-3.5 py-1 rounded-full bg-[#A91F35] hover:bg-[#8e192c] text-white border border-[#E6A916]/50 shrink-0 transition-all font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Moments of Honour (31)</span>
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-videos')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Videos
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-news')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              News
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-stories')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3 h-3 text-[#A91F35]" /> Stories
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-team')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3 h-3 text-[#E6A916]" /> Official Team
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-gratitude')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] shrink-0 transition-colors cursor-pointer"
            >
              Gratitude
            </button>
            <button
              type="button"
              onClick={scrollToArchiveSection('2k25-community')}
              className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-[#25D366] text-stone-700 hover:text-[#25D366] shrink-0 transition-colors flex items-center gap-1 font-bold cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366]" /> WhatsApp
            </button>
          </nav>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 01 – DALENZIA 2K25 HERO & OFFICIAL MAIN POSTER (FIRST VISUAL PRIORITY)    */}
      {/* ========================================================================= */}
      <section id="2k25-hero" className="relative overflow-hidden bg-gradient-to-b from-[#A91F35] via-[#8B1A2C] to-[#5a0c1a] text-white py-16 md:py-24 px-4 md:px-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E6A916]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-black tracking-widest uppercase text-[#E6A916]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE INAUGURAL FIRST EDITION ARCHIVE</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-widest text-amber-200 block">
                OFFICIAL FESTIVAL IDENTITY
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight">
                DALENZIA 2K25
              </h1>
              <p className="text-xl sm:text-2xl font-serif font-bold text-[#E6A916] tracking-wide">
                Esencia Oculta · Spark the Flair Within
              </p>
            </div>

            <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium">
              Relive the historic foundation of Dalenzia Fest. Held on <strong>December 27–28, 2025</strong> at Dalailussunna Dars, Ayiroor, the first edition united scholars, candidates, and three regional Dars delegations in a landmark celebration of Islamic scholarship, eloquence, and arts.
            </p>

            {/* Quick Fact Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <div className="text-[10px] text-white/60 uppercase font-black">Dates</div>
                <div className="font-bold text-sm text-[#E6A916] mt-0.5">Dec 27–28, 2025</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <div className="text-[10px] text-white/60 uppercase font-black">Central Stage</div>
                <div className="font-bold text-sm text-white mt-0.5">Marrakech (വേദി 1)</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <div className="text-[10px] text-white/60 uppercase font-black">Host Dars</div>
                <div className="font-bold text-sm text-white mt-0.5">Ayiroor, Malappuram</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <div className="text-[10px] text-white/60 uppercase font-black">Overall Champions</div>
                <div className="font-bold text-sm text-[#E6A916] mt-0.5">DAZZLERS (1335 Pts)</div>
              </div>
            </div>

            {/* Action Buttons: Opens Historical 2K25 Content Directly */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToArchiveSection('2k25-stagedesign')}
                className="px-6 py-3 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Flame className="w-4 h-4 fill-[#A91F35]" />
                <span>Explore Stage Design</span>
              </button>
              <button
                type="button"
                onClick={scrollToArchiveSection('2k25-results')}
                className="px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#E6A916]" />
                <span>Championship Results</span>
              </button>
            </div>
          </motion.div>

          {/* Right: OFFICIAL MAIN POSTER – FIRST VISUAL PRIORITY (Full Uncropped Display with object-contain) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col items-center"
          >
            <div
              className="relative group cursor-pointer max-w-md w-full"
              onClick={() => setPosterLightboxItem({
                title: OFFICIAL_MAIN_POSTER_2K25.title,
                file: OFFICIAL_MAIN_POSTER_2K25.file,
                caption: `${OFFICIAL_MAIN_POSTER_2K25.malayalamTitle} • ${OFFICIAL_MAIN_POSTER_2K25.venues}`
              })}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-[#E6A916] via-amber-400 to-[#E6A916] rounded-3xl blur-md opacity-45 group-hover:opacity-85 transition-opacity" />
              <div className="relative bg-[#1c1917] rounded-3xl overflow-hidden border-2 border-[#E6A916] p-3 shadow-2xl flex flex-col items-center space-y-3">
                
                {/* Header Tag */}
                <div className="w-full flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E6A916] animate-pulse" />
                    <span className="font-serif font-black text-xs tracking-wider text-[#E6A916] uppercase">
                      OFFICIAL MAIN POSTER – DALENZIA 2K25
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">Verified Asset</span>
                </div>

                {/* The Exact Official Master Poster (Uncropped with object-contain) */}
                <div className="w-full bg-black rounded-2xl overflow-hidden p-2 flex items-center justify-center min-h-[440px] max-h-[560px]">
                  <img
                    src={OFFICIAL_MAIN_POSTER_2K25.file}
                    alt={OFFICIAL_MAIN_POSTER_2K25.title}
                    className="w-auto h-auto max-h-[540px] max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Footer Caption */}
                <div className="w-full px-2 pb-1 flex items-center justify-between text-xs text-white/90">
                  <div className="text-left">
                    <span className="font-serif font-bold text-white text-xs block">
                      {OFFICIAL_MAIN_POSTER_2K25.tagline}
                    </span>
                    <span className="text-[11px] text-white/60 font-mono">
                      {OFFICIAL_MAIN_POSTER_2K25.dates}
                    </span>
                  </div>
                  <span className="font-bold text-[#E6A916] flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1.5 rounded-full group-hover:bg-[#E6A916] group-hover:text-[#A91F35] transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Fullscreen</span>
                  </span>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 – THEME & IDENTITY                                                     */}
      {/* ========================================================================= */}
      <section id="2k25-theme" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#A91F35] block">
            PHILOSOPHICAL FOUNDATION
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
            Esencia Oculta · The Hidden Essence
          </h2>
          <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed">
            {THEME_2K25_INFO.conceptQuote}
          </p>
        </div>

        {/* Identity Presentation Cards (Two Clear, Balanced Highlights) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Card 1: Brand Framework & Emblem Mockup */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <div
                className="w-full h-80 sm:h-96 bg-stone-950 rounded-2xl overflow-hidden p-4 flex items-center justify-center cursor-pointer group"
                onClick={() => setPosterLightboxItem({
                  title: 'Brand Framework & Emblem Mockup',
                  file: THEME_2K25_INFO.logoFrameMockup,
                  caption: 'Official 2K25 Framed Emblem and Typography on Moroccan Crimson & Ochre'
                })}
              >
                <img
                  src={THEME_2K25_INFO.logoFrameMockup}
                  alt="Logo Frame Mockup"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-black uppercase text-[#A91F35] tracking-widest">Visual Identity &amp; Ethos</span>
                <h3 className="font-serif font-black text-xl text-stone-900">The Emblem &amp; Typography</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Modern geometric letterforms rooted in earthy ochre and Moroccan crimson, paired with the bilingual tagline "Spark the Flair Within" and the foundational philosophy "Becoming Essential".
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35]">
              <span>Framed Brand Mockup</span>
              <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          {/* Card 2: Theme Announcement Teaser Artwork */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <div
                className="w-full h-80 sm:h-96 bg-stone-950 rounded-2xl overflow-hidden p-4 flex items-center justify-center cursor-pointer group"
                onClick={() => setPosterLightboxItem({
                  title: 'Theme Song Launch Teaser Artwork',
                  file: THEME_2K25_INFO.themeComingAsset,
                  caption: 'Official "Theme Coming Soon" Broadside Poster'
                })}
              >
                <img
                  src={THEME_2K25_INFO.themeComingAsset}
                  alt="Theme Coming Announcement Poster"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-5 space-y-2">
                <span className="text-[10px] font-black uppercase text-[#A91F35] tracking-widest">Promotional Campaign</span>
                <h3 className="font-serif font-black text-xl text-stone-900">Theme Announcement</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  The monumental teaser countdown broadside featuring the vintage television, introducing the essence of faith, art, and the awakening of dormant creative flair.
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35]">
              <span>Broadside Teaser Artwork</span>
              <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 – THE OFFICIAL LOGO LAUNCH – MAJOR FEATURED SECTION                     */}
      {/* ========================================================================= */}
      <section id="2k25-logolaunch" className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#A91F35]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E6A916]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* Editorial Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6A916]/20 border border-[#E6A916]/40 text-[#E6A916] text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{LOGO_LAUNCH_2K25.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              {LOGO_LAUNCH_2K25.sectionTitle}
            </h2>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#E6A916]">
              {LOGO_LAUNCH_2K25.subtitle}
            </p>
            <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed">
              {LOGO_LAUNCH_2K25.description}
            </p>
          </div>

          {/* Large Editorial Two-Column Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Large Original Logo Launch Artwork (Placard Uncropped) */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                className="relative group cursor-pointer w-full max-w-xl bg-stone-950 rounded-3xl p-4 border-2 border-[#E6A916]/70 shadow-2xl overflow-hidden"
                onClick={() => setPosterLightboxItem({
                  title: LOGO_LAUNCH_2K25.sectionTitle,
                  file: LOGO_LAUNCH_2K25.artwork,
                  caption: 'Usthads and scholars officially releasing the DALENZIA 2K25 logo placard "Becoming Essential"'
                })}
              >
                <div className="w-full flex items-center justify-between pb-3 px-2 border-b border-stone-800 text-xs">
                  <span className="font-serif font-bold text-[#E6A916]">Original Unveiling Artwork</span>
                  <span className="font-mono text-stone-400 text-[11px]">Placard: "Becoming Essential"</span>
                </div>
                
                <div className="w-full bg-black rounded-2xl overflow-hidden p-3 flex items-center justify-center min-h-[460px] max-h-[580px]">
                  <img
                    src={LOGO_LAUNCH_2K25.artwork}
                    alt="Official Logo Launch"
                    className="max-h-[550px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                <div className="pt-3 px-2 flex items-center justify-between text-xs text-stone-300">
                  <span className="text-stone-400">Click to view high-resolution master release</span>
                  <span className="font-bold text-[#E6A916] flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Editorial Narrative & Historical Significance */}
            <div className="lg:col-span-5 text-left space-y-6">
              
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider inline-block">
                  Placard Ethos: "{LOGO_LAUNCH_2K25.tagline}"
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-snug">
                  Unveiling the Emblem of a Historic Cultural Movement
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium">
                  {LOGO_LAUNCH_2K25.significance}
                </p>
              </div>

              {/* Milestone Details Box */}
              <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-700 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#E6A916]">
                  <CheckCircle2 className="w-4 h-4 text-[#E6A916]" />
                  <span>Key Ceremonial Attendees</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  The ceremony brought together esteemed Usthads, Ayiroor Mahal leaders, DSSA representatives, and regional community patrons who pledged their wholehearted patronage to Dalenzia.
                </p>
              </div>

              <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-700 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#E6A916]">
                  <CheckCircle2 className="w-4 h-4 text-[#E6A916]" />
                  <span>The Ten Brand Symbols</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  The base of the official placard features ten indigenous geometric glyphs embodying Quranic calligraphy, illumination, eloquence, harmony, and academic devotion.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 – INTERACTIVE 3D STAGE SHOWCASE (STAGE ARCHITECTURE | 360° ROTATION)   */}
      {/* ========================================================================= */}
      <section id="2k25-stagedesign" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-[#A91F35] text-xs font-black tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>STAGE ARCHITECTURE • 360° ROTATION • MULTI-ANGLE VIEWING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
            EXPLORE THE STAGES OF DALENZIA 2K25
          </h2>
          <p className="text-base sm:text-lg font-serif font-bold text-[#A91F35]">
            Interactive 3D Stages of Marrakech &amp; Meknes
          </p>
          <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed">
            Discover the stage concepts that shaped the visual identity of DALENZIA 2K25. Explore each stage from every angle and experience the ideas behind the festival's stage design.
          </p>
        </div>

        {/* Dynamic Stage Switcher / Tabs Bar (Extensible for Stage 03+) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="bg-stone-200/80 p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-2 border border-stone-300 shadow-inner">
            {STAGES_3D_DATA.map((stg) => {
              const isSelected = selectedStage3DId === stg.id;
              return (
                <button
                  key={stg.id}
                  data-stage-id={stg.id}
                  onClick={() => setSelectedStage3DId(stg.id)}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-[#E6A916] shadow-lg border border-[#E6A916]/40 scale-[1.02]'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#E6A916] animate-pulse' : 'bg-stone-400'}`} />
                  <div className="text-left">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                      STAGE {stg.code}
                    </div>
                    <div className="font-serif font-black tracking-tight text-sm">
                      {stg.officialName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Presentation Showcase */}
        <div className="bg-stone-950 text-white rounded-[32px] p-5 sm:p-8 md:p-10 border-2 border-stone-800 shadow-2xl space-y-8">
          
          {/* Stage Header Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] font-mono text-[11px] font-black uppercase tracking-wider">
                  {activeStage3D.englishName}
                </span>
                <span className="px-3 py-1 rounded-full bg-stone-800 text-stone-300 font-mono text-[11px] font-bold">
                  {activeStage3D.category}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
                {activeStage3D.officialName}
              </h3>
              <p className="text-xs sm:text-sm font-serif font-bold text-[#E6A916]">
                {activeStage3D.subtitle}
              </p>
            </div>

            {/* Quick Helper Badge */}
            <div className="flex items-center gap-2 bg-stone-900 px-4 py-2 rounded-2xl border border-stone-800 text-xs text-stone-400 font-mono">
              <Sparkles className="w-4 h-4 text-[#E6A916]" />
              <span>360° Free Orbit • Drag / Scroll to Inspect</span>
            </div>
          </div>

          {/* Dedicated Interactive 3D Stage Viewer */}
          <div className="relative">
            <InteractiveStage3DViewer
              key={activeStage3D.id}
              stage={activeStage3D}
              onOpenLightbox={setPosterLightboxItem}
            />
          </div>

          {/* Architectural Heritage & Details Narrative Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* Left 7 Columns: Story, Verbatim History & Architectural Specs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-[#E6A916] tracking-wider uppercase flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>DESIGN PHILOSOPHY &amp; SPATIAL IDENTITY</span>
                </span>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  {activeStage3D.description}
                </p>
              </div>

              {/* Verbatim Historical Malayalam Inscription */}
              <div className="bg-stone-900/90 rounded-2xl p-5 border border-amber-500/20 space-y-3">
                <span className="text-[11px] font-bold text-[#E6A916] uppercase tracking-wider block border-b border-stone-800 pb-2">
                  പോസ്റ്ററിൽ നൽകിയിട്ടുള്ള ഔദ്യോഗിക വിവരണം (Verbatim Text):
                </span>
                <p className="text-stone-200 text-xs sm:text-sm leading-relaxed font-sans">
                  {activeStage3D.id === 'stage-01'
                    ? STAGE_CONCEPTS_2K25.marrakech.verbatimMalayalam
                    : STAGE_CONCEPTS_2K25.meknes.verbatimMalayalam}
                </p>
              </div>

              {/* 3D Geometric Key Elements Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-stone-400 tracking-wider uppercase block">
                  3D GEOMETRIC ARCHITECTURAL SPECIFICATION:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeStage3D.designElements.map((el, i) => (
                    <div key={i} className="bg-stone-900/70 p-3.5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-xs font-black text-white font-serif flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#E6A916]" />
                        {el.label}
                      </span>
                      <p className="text-[11px] text-stone-400 leading-normal">
                        {el.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Original Concept Poster & Visual Artboard Cards */}
            <div className="lg:col-span-5 space-y-5 text-left">
              
              {/* Official Concept Poster Card (Uncropped Portrait) */}
              <div
                className="bg-stone-900 rounded-2xl p-4 border border-stone-800 hover:border-[#E6A916] transition-all cursor-pointer group space-y-3"
                onClick={() => setPosterLightboxItem({
                  title: activeStage3D.englishName,
                  file: activeStage3D.conceptPoster,
                  caption: `${activeStage3D.officialName} • Official Stage Concept Poster`
                })}
              >
                <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
                  <span className="font-mono text-[#E6A916] font-bold">
                    {activeStage3D.id === 'stage-01' ? STAGE_CONCEPTS_2K25.marrakech.daysAgoBadge : STAGE_CONCEPTS_2K25.meknes.daysAgoBadge}
                  </span>
                  <span className="font-bold text-white">Original Concept Poster</span>
                </div>
                <div className="w-full h-72 sm:h-80 bg-stone-950 rounded-xl overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={activeStage3D.conceptPoster}
                    alt={activeStage3D.englishName}
                    className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                  <span>Click to expand uncropped artwork</span>
                  <Maximize2 className="w-3.5 h-3.5 text-[#E6A916]" />
                </div>
              </div>

              {/* Stage Visual Artboard Thumbnail Card */}
              <div
                className="bg-stone-900 rounded-2xl p-4 border border-stone-800 hover:border-[#E6A916] transition-all flex items-center gap-4 cursor-pointer group"
                onClick={() => setPosterLightboxItem({
                  title: `${activeStage3D.officialName} – Architectural Artboard`,
                  file: activeStage3D.artboard,
                  caption: `Digital design rendering of ${activeStage3D.officialName}`
                })}
              >
                <div className="w-24 h-18 bg-stone-950 rounded-xl overflow-hidden p-1.5 shrink-0 flex items-center justify-center border border-white/10">
                  <img
                    src={activeStage3D.artboard}
                    alt={activeStage3D.officialName}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-sm text-white truncate">Digital Stage Artboard</h4>
                  <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">View the 2D architectural master drawing</p>
                </div>
                <Maximize2 className="w-4 h-4 text-stone-400 group-hover:text-[#E6A916] ml-auto shrink-0 transition-colors" />
              </div>

            </div>

          </div>

          {/* Bottom Switcher Pill Bar for Convenient Navigation */}
          <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-stone-400 font-mono">
              SWITCH COMPETITIVE ARENA:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {STAGES_3D_DATA.map((stg) => (
                <button
                  key={stg.id}
                  data-stage-id={stg.id}
                  onClick={() => setSelectedStage3DId(stg.id)}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    selectedStage3DId === stg.id
                      ? 'bg-[#E6A916] text-stone-950'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  {stg.officialName}
                </button>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 05 – FEATURED THEME SONG                                                  */}
      {/* ========================================================================= */}
      <section id="2k25-themesong" className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#F7F3E9] via-amber-50/40 to-[#F7F3E9] border-y border-[#A91F35]/15">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-[#A91F35] text-xs font-black tracking-widest uppercase">
              <Music className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>OFFICIAL 2K25 THEME SONG</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
              Esencia Oculta – Official Anthem
            </h2>
            <p className="text-sm md:text-base text-stone-600 font-medium">
              Spark the Flair Within • The timeless musical anthem of Dalailussunna Dars, Ayiroor.
            </p>
          </div>

          {/* Centered Master Video Showcase (Responsive 16:9 Player) */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#E6A916] bg-black">
              
              {!isThemeSongPlaying ? (
                /* Static High-Resolution Artwork Cover with Big Play Button */
                <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden group cursor-pointer" onClick={() => setIsThemeSongPlaying(true)}>
                  <img
                    src={THEME_SONG_2K25.thumbnailAsset}
                    alt={THEME_SONG_2K25.title}
                    className="w-full h-full object-contain bg-stone-950 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex flex-col items-center justify-center p-6 text-white text-center">
                    
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center shadow-[0_0_30px_#E6A916] mb-4 group-hover:shadow-[0_0_50px_#E6A916] transition-shadow cursor-pointer"
                    >
                      <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-[#A91F35] translate-x-1" />
                    </motion.div>

                    <h3 className="text-lg sm:text-2xl font-serif font-black text-white drop-shadow-md">
                      Play Official Theme Song
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                      Click to load and play YouTube video embed
                    </p>
                    <span className="mt-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-mono font-bold text-[#E6A916]">
                      YouTube: -IkzZNY22nE
                    </span>
                  </div>
                </div>
              ) : (
                /* Live Responsive YouTube IFrame Embed (Horizontal Centered 16:9) */
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={`${THEME_SONG_2K25.youtubeEmbedUrl}?autoplay=1&rel=0`}
                    title="DALENZIA 2K25 Official Theme Song"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setIsThemeSongPlaying(false)}
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 z-10 cursor-pointer shadow-lg border border-white/20"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close Player</span>
                  </button>
                </div>
              )}

            </div>

            {/* Video Footer Actions & Details */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
              <div className="text-left">
                <span className="text-xs font-bold text-stone-500">Official Channel:</span>
                <span className="text-xs font-bold text-[#A91F35] ml-1.5">Dalailussunna official (@dssaofficial_ayr)</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={THEME_SONG_2K25.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 – RESULTS & CHAMPIONSHIP HIGHLIGHTS (PREMIUM ACHIEVEMENT SHOWCASE)      */}
      {/* ========================================================================= */}
      <section id="2k25-results" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-[#A91F35] text-xs font-black tracking-widest uppercase">
            <Trophy className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>HISTORICAL MERIT ROLL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
            Results &amp; Championship Showcase
          </h2>
          <p className="text-sm md:text-base text-stone-600 font-medium">
            Over 85 competitions across 4 categories culminate in a fierce points duel between Team Dazzlers and Team Dynamos.
          </p>
        </div>

        {/* Dedicated Championship Showcase: Large Side-by-Side Grand Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          
          {/* Winner: DAZZLERS – OVERALL CHAMPIONS */}
          <div className="relative bg-gradient-to-br from-[#E6A916]/20 via-amber-50/70 to-white rounded-[32px] p-6 sm:p-8 md:p-10 border-2 border-[#E6A916] shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Badge & Rank Ribbon */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6A916]/30">
                <span className="px-4 py-1.5 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  <Trophy className="w-4 h-4 fill-[#A91F35]" />
                  <span>1ST POSITION • OVERALL CHAMPIONS</span>
                </span>
                <span className="text-xs font-mono font-black text-[#A91F35] bg-white/80 px-3 py-1 rounded-full border border-[#E6A916]/40">
                  MAIDEN CROWN
                </span>
              </div>

              {/* Team Name & Prominent Score Header */}
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-stone-900 tracking-tight">
                    {CHAMPIONSHIP_2K25.winner.team}
                  </h3>
                  <p className="text-xs font-bold text-amber-900/80 uppercase tracking-wider mt-1 font-mono">
                    DALENZIA 2K25 FESTIVAL CHAMPIONS
                  </p>
                </div>
                <div className="flex items-baseline gap-1.5 bg-[#A91F35] text-white px-5 py-2.5 rounded-2xl shadow-lg border border-[#E6A916]">
                  <span className="font-mono font-black text-3xl sm:text-4xl text-[#E6A916]">
                    {CHAMPIONSHIP_2K25.winner.points}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                    Points
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                Dominating the senior Arabic elocution, choral presentations, and multilingual essays to clinch the maiden Dalenzia crown by a verified margin of 182 points.
              </p>
            </div>

            {/* Grand Winners Artwork Frame (Spacious Display Area, Uncropped with object-contain) */}
            <div
              className="w-full bg-stone-950 rounded-2xl overflow-hidden p-3 flex flex-col items-center justify-center cursor-pointer group border-2 border-stone-800 hover:border-[#E6A916] transition-all shadow-inner"
              onClick={() => setPosterLightboxItem({
                title: 'Team Dazzlers – Overall Champions 2K25',
                file: CHAMPIONSHIP_2K25.winner.photo,
                caption: 'Official Winners Poster: Team Dazzlers celebrating the 1335-point championship victory with teachers and scholars'
              })}
            >
              <div className="w-full pb-2 px-1 flex items-center justify-between text-xs text-stone-400">
                <span className="font-serif text-[#E6A916] font-bold">Official Winners Artwork</span>
                <span className="font-mono text-[11px] text-stone-400">Complete Group &amp; Silverware</span>
              </div>
              <div className="w-full min-h-[380px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center">
                <img
                  src={CHAMPIONSHIP_2K25.winner.photo}
                  alt="Winners Dazzlers"
                  className="max-h-[520px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="w-full pt-3 px-1 flex items-center justify-between text-xs text-stone-400 border-t border-stone-800">
                <span className="text-stone-300">Click to view full uncropped team portrait</span>
                <span className="flex items-center gap-1 font-bold text-[#E6A916]">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand High-Res</span>
                </span>
              </div>
            </div>
          </div>

          {/* Runner Up: DYNAMOS – CHAMPIONSHIP RUNNERS-UP */}
          <div className="relative bg-gradient-to-br from-[#A91F35]/15 via-rose-50/70 to-white rounded-[32px] p-6 sm:p-8 md:p-10 border-2 border-[#A91F35]/40 shadow-2xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Badge & Rank Ribbon */}
              <div className="flex items-center justify-between pb-3 border-b border-[#A91F35]/20">
                <span className="px-4 py-1.5 rounded-full bg-[#A91F35] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm">
                  <Award className="w-4 h-4 text-[#E6A916]" />
                  <span>2ND POSITION • CHAMPIONSHIP RUNNERS-UP</span>
                </span>
                <span className="text-xs font-mono font-black text-rose-900 bg-white/80 px-3 py-1 rounded-full border border-[#A91F35]/30">
                  HISTORIC RUN
                </span>
              </div>

              {/* Team Name & Prominent Score Header */}
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-stone-900 tracking-tight">
                    {CHAMPIONSHIP_2K25.runnerUp.team}
                  </h3>
                  <p className="text-xs font-bold text-rose-900/80 uppercase tracking-wider mt-1 font-mono">
                    DALENZIA 2K25 RUNNERS-UP
                  </p>
                </div>
                <div className="flex items-baseline gap-1.5 bg-stone-900 text-white px-5 py-2.5 rounded-2xl shadow-lg border border-stone-700">
                  <span className="font-mono font-black text-3xl sm:text-4xl text-amber-400">
                    {CHAMPIONSHIP_2K25.runnerUp.points}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                    Points
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                A spirited campaign through junior categories, Quran tajweed, and calligraphy that pushed the championship contest to the final hour with an exceptional 1153 points.
              </p>
            </div>

            {/* Grand Runners Artwork Frame (Spacious Display Area, Uncropped with object-contain) */}
            <div
              className="w-full bg-stone-950 rounded-2xl overflow-hidden p-3 flex flex-col items-center justify-center cursor-pointer group border-2 border-stone-800 hover:border-[#A91F35] transition-all shadow-inner"
              onClick={() => setPosterLightboxItem({
                title: 'Team Dynamos – Championship Runners-Up 2K25',
                file: CHAMPIONSHIP_2K25.runnerUp.photo,
                caption: 'Official Runners Poster: Team Dynamos claiming the runner-up silverware with 1153 points'
              })}
            >
              <div className="w-full pb-2 px-1 flex items-center justify-between text-xs text-stone-400">
                <span className="font-serif text-[#A91F35] font-bold">Official Runners Artwork</span>
                <span className="font-mono text-[11px] text-stone-400">Complete Group &amp; Silverware</span>
              </div>
              <div className="w-full min-h-[380px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center">
                <img
                  src={CHAMPIONSHIP_2K25.runnerUp.photo}
                  alt="Runners Dynamos"
                  className="max-h-[520px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="w-full pt-3 px-1 flex items-center justify-between text-xs text-stone-400 border-t border-stone-800">
                <span className="text-stone-300">Click to view full uncropped team portrait</span>
                <span className="flex items-center gap-1 font-bold text-[#E6A916]">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand High-Res</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. THE CHAMPIONSHIP JOURNEY (5-STAGE HISTORICAL PROGRESSION TIMELINE)       */}
        {/* ========================================================================= */}
        <div id="2k25-journey" className="space-y-12 pt-10 border-t-2 border-[#E6A916]/30">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6A916]/10 border border-[#E6A916]/40 text-[#A91F35] text-xs font-black tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>HISTORICAL CHRONOLOGY</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
              THE CHAMPIONSHIP JOURNEY
            </h3>
            <p className="text-base sm:text-lg text-stone-600 font-serif italic font-medium">
              Every point. Every moment. One unforgettable competition.
            </p>
            <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the dramatic, step-by-step points progression of DALENZIA 2K25 through its four official milestone posters, culminating in the grand championship reveal.
            </p>
          </div>

          {/* Chronological Points Progression Milestone Tracker */}
          <div className="bg-stone-900 rounded-3xl p-5 sm:p-6 md:p-8 border border-white/10 text-white shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-[#E6A916]" />
                <span className="font-serif font-bold text-sm tracking-wide text-white">Championship Points Progression</span>
              </div>
              <span className="text-[11px] font-mono text-white/60">5 Milestone Updates · 85 Competitions</span>
            </div>

            {/* Stage Quick Switcher / Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { id: 'after-10', stage: 'AFTER 10', dazzlers: 134, dynamos: 109, lead: 'Dazzlers +25', leadTeam: 'dazzlers' },
                { id: 'after-20', stage: 'AFTER 20', dazzlers: 270, dynamos: 276, lead: 'Dynamos +6 (Lead Shift!)', leadTeam: 'dynamos', isShift: true },
                { id: 'after-30', stage: 'AFTER 30', dazzlers: 443, dynamos: 390, lead: 'Dazzlers +53', leadTeam: 'dazzlers' },
                { id: 'after-45', stage: 'AFTER 45', dazzlers: 719, dynamos: 588, lead: 'Dazzlers +131', leadTeam: 'dazzlers' },
                { id: 'final-result', stage: 'FINAL STATUS', dazzlers: 1335, dynamos: 1153, lead: 'Champions (+182)', leadTeam: 'dazzlers', isFinal: true }
              ].map((m) => {
                const isSelected = activeJourneyStage === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveJourneyStage(activeJourneyStage === m.id ? 'all' : m.id)}
                    className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-[#E6A916] text-[#A91F35] border-[#E6A916] shadow-lg scale-[1.02]'
                        : m.isFinal
                        ? 'bg-gradient-to-b from-[#A91F35]/40 to-black/60 border-[#E6A916]/40 hover:border-[#E6A916] text-white'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                        isSelected ? 'text-[#A91F35]' : m.isFinal ? 'text-[#E6A916]' : 'text-white/70'
                      }`}>
                        {m.stage}
                      </span>
                      {m.isShift && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                          Shift
                        </span>
                      )}
                      {m.isFinal && (
                        <Trophy className="w-3.5 h-3.5 text-[#E6A916]" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span className={isSelected ? 'text-[#A91F35]' : 'text-amber-300'}>DZ: {m.dazzlers}</span>
                        <span className={isSelected ? 'text-[#A91F35]/80' : 'text-rose-300'}>DY: {m.dynamos}</span>
                      </div>
                      <div className={`text-[10px] font-bold ${
                        isSelected ? 'text-[#A91F35] font-black' : m.isShift ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {m.lead}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {activeJourneyStage !== 'all' && (
              <div className="text-center pt-1">
                <button
                  onClick={() => setActiveJourneyStage('all')}
                  className="text-xs font-bold text-[#E6A916] hover:text-white underline cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Show Complete Journey View (All 5 Stages)</span>
                </button>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* THE FOUR CHRONOLOGICAL PROGRESS POSTERS (AFTER 10, 20, 30, 45)             */}
          {/* ========================================================================= */}
          <div className="space-y-12">
            {[
              {
                id: 'after-10',
                stageNumber: 'STAGE 01',
                stageLabel: 'AFTER 10',
                title: 'The Opening Momentum',
                malayalamTag: 'ആദ്യ കാറ്റ് ദിശ മാറുന്നു',
                poster: '/assets/dalenzia2k25/journey/after-10.png',
                dazzlers: 134,
                dynamos: 109,
                leader: 'Dazzlers',
                margin: '+25 Points Lead',
                themeArt: 'Historic Coastal Lighthouse & Azure Sea',
                description: 'The competition begins with intense rivalry in junior recitations and essay writing. Team Dazzlers establishes the opening lead of 134 points against Dynamos\' 109 points, carrying a 25-point cushion.',
                accentColor: '#0ea5e9',
                bgGradient: 'from-sky-950/20 via-white to-amber-50/30'
              },
              {
                id: 'after-20',
                stageNumber: 'STAGE 02',
                stageLabel: 'AFTER 20',
                title: 'The Great Sea-Change',
                malayalamTag: 'ദലൻഡിയ കല കലങ്ങും',
                poster: '/assets/dalenzia2k25/journey/after-20.png',
                dazzlers: 270,
                dynamos: 276,
                leader: 'Dynamos',
                margin: '+6 Points Lead · Dramatic Lead Shift!',
                isLeadChange: true,
                themeArt: 'Traditional Fishing Boats Anchored in Harbor',
                description: 'A dramatic turnaround in the festival narrative! Team Dynamos unleashes a spirited counter-surge across choral presentations and Quranic eloquence, overtaking Dazzlers by 6 points (276 to 270) in the competition\'s sole lead change.',
                accentColor: '#f59e0b',
                bgGradient: 'from-amber-950/20 via-white to-rose-50/30'
              },
              {
                id: 'after-30',
                stageNumber: 'STAGE 03',
                stageLabel: 'AFTER 30',
                title: 'Reclaiming the Heritage',
                malayalamTag: 'സുവർണ്ണ പാരമ്പര്യം',
                poster: '/assets/dalenzia2k25/journey/after-30.png',
                dazzlers: 443,
                dynamos: 390,
                leader: 'Dazzlers',
                margin: '+53 Points Lead · Lead Reclaimed',
                themeArt: 'Kerala Heritage Terracotta Roof & Open Window',
                description: 'Dazzlers stage an authoritative comeback through senior elocutions and multilingual debates, pushing the tally to 443 against 390 and securing a commanding 53-point lead.',
                accentColor: '#ef4444',
                bgGradient: 'from-red-950/20 via-white to-amber-50/30'
              },
              {
                id: 'after-45',
                stageNumber: 'STAGE 04',
                stageLabel: 'AFTER 45',
                title: 'Twilight Before the Climax',
                malayalamTag: 'അന്തിമ പോരാട്ടം',
                poster: '/assets/dalenzia2k25/journey/after-45.png',
                dazzlers: 719,
                dynamos: 588,
                leader: 'Dazzlers',
                margin: '+131 Points Lead · Breakaway Margin',
                themeArt: 'Nocturnal Fest Archway & Golden Lanterns',
                description: 'Under the nocturnal lights of Ayiroor, Dazzlers break through the 700-point barrier with 719 points against Dynamos\' 588 points, opening an unassailable 131-point lead heading into the grand finale.',
                accentColor: '#6366f1',
                bgGradient: 'from-indigo-950/20 via-white to-stone-50'
              }
            ]
              .filter((st) => activeJourneyStage === 'all' || activeJourneyStage === st.id)
              .map((st, idx) => (
                <div
                  key={st.id}
                  className="bg-white rounded-[32px] p-6 sm:p-8 md:p-10 border-2 border-stone-200/90 hover:border-[#E6A916] transition-all shadow-xl space-y-6 text-left"
                >
                  {/* Stage Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1 rounded-full bg-stone-900 text-white font-mono font-black text-xs uppercase tracking-wider">
                        {st.stageNumber}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#E6A916]/20 text-[#A91F35] font-black text-xs font-mono border border-[#E6A916]/40">
                        {st.stageLabel}
                      </span>
                      {st.isLeadChange && (
                        <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm animate-pulse">
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>DRAMATIC LEAD SHIFT</span>
                        </span>
                      )}
                    </div>
                    {st.malayalamTag && (
                      <span className="font-serif font-black text-base text-[#A91F35]">
                        {st.malayalamTag}
                      </span>
                    )}
                  </div>

                  {/* 2-Column Side-by-Side: Original Poster on Left/Right, Detailed Breakdown Beside */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left: Original Progress Poster Frame (Uncropped, Spacious, Contain) */}
                    <div
                      className="lg:col-span-6 bg-stone-950 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-between cursor-pointer group border-2 border-stone-800 hover:border-[#E6A916] transition-all shadow-inner"
                      onClick={() => setPosterLightboxItem({
                        title: `Dalenzia 2K25 Progress Status: ${st.stageLabel}`,
                        file: st.poster,
                        caption: `${st.stageLabel}: Dazzlers ${st.dazzlers} Pts vs Dynamos ${st.dynamos} Pts • ${st.malayalamTag || st.title}`
                      })}
                    >
                      <div className="w-full pb-2 px-1 flex items-center justify-between text-xs text-stone-400">
                        <span className="font-serif text-[#E6A916] font-bold">Official Milestone Poster</span>
                        <span className="font-mono text-[11px] text-stone-400">{st.stageLabel} Team Point Status</span>
                      </div>
                      
                      <div className="w-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] flex items-center justify-center py-2">
                        <img
                          src={st.poster}
                          alt={st.stageLabel}
                          className="max-h-[540px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>

                      <div className="w-full pt-3 px-1 flex items-center justify-between text-xs text-stone-400 border-t border-stone-800">
                        <span className="text-stone-300">Click to view full uncropped original poster</span>
                        <span className="flex items-center gap-1 font-bold text-[#E6A916]">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Expand High-Res</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Stage Intel & Point Breakdown */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="space-y-2">
                        <h4 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
                          {st.title}
                        </h4>
                        <p className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider">
                          Visual Theme: {st.themeArt}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
                        {st.description}
                      </p>

                      {/* Side-by-side Score Duel Box */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className={`p-4 rounded-2xl border transition-all ${
                          st.dazzlers > st.dynamos
                            ? 'bg-amber-500/10 border-[#E6A916] shadow-sm'
                            : 'bg-stone-50 border-stone-200'
                        }`}>
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
                            <span>TEAM DAZZLERS</span>
                            {st.dazzlers > st.dynamos && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-[9px] uppercase">
                                Leader
                              </span>
                            )}
                          </div>
                          <div className="font-mono font-black text-3xl sm:text-4xl text-[#A91F35] mt-1">
                            {st.dazzlers}
                          </div>
                          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Points</span>
                        </div>

                        <div className={`p-4 rounded-2xl border transition-all ${
                          st.dynamos > st.dazzlers
                            ? 'bg-rose-500/10 border-rose-400 shadow-sm'
                            : 'bg-stone-50 border-stone-200'
                        }`}>
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
                            <span>TEAM DYNAMOS</span>
                            {st.dynamos > st.dazzlers && (
                              <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase">
                                Leader
                              </span>
                            )}
                          </div>
                          <div className="font-mono font-black text-3xl sm:text-4xl text-stone-900 mt-1">
                            {st.dynamos}
                          </div>
                          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Points</span>
                        </div>
                      </div>

                      {/* Margin Highlight Badge */}
                      <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">Stage Standing:</span>
                        <span className="font-bold text-stone-900 font-mono">
                          {st.margin}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
          </div>

          {/* ========================================================================= */}
          {/* THE GRAND CONCLUDING SHOWCASE: FINAL RESULT DALENZIA                       */}
          {/* ========================================================================= */}
          {(activeJourneyStage === 'all' || activeJourneyStage === 'final-result') && (
            <div className="relative bg-gradient-to-b from-stone-950 via-stone-900 to-black rounded-[36px] p-6 sm:p-10 md:p-12 border-2 border-[#E6A916] text-white shadow-2xl space-y-8 overflow-hidden text-left">
              
              {/* Decorative Golden Ambient Aura */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6A916]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#A91F35]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Showcase Banner Header */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs font-mono uppercase tracking-wider shadow-sm">
                      GRAND CONCLUSION
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono border border-white/20">
                      FINAL STATUS
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mt-2">
                    DALENZIA 2K25 FINAL RESULT
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E6A916] font-medium font-mono">
                    The Official Final Tally of the Second Edition
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-baseline gap-2 bg-[#A91F35] px-6 py-3 rounded-2xl border border-[#E6A916]/60 shadow-xl">
                    <Trophy className="w-5 h-5 text-[#E6A916]" />
                    <span className="font-serif font-black text-xl text-white">CHAMPIONS: DAZZLERS</span>
                  </div>
                </div>
              </div>

              {/* Large Central Display Area for FINAL RESULT DALENZIA.png */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* The Original Final Poster Frame */}
                <div
                  className="lg:col-span-7 bg-black rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-between cursor-pointer group border-2 border-[#E6A916]/60 hover:border-[#E6A916] transition-all shadow-2xl"
                  onClick={() => setPosterLightboxItem({
                    title: 'Dalenzia 2K25 Official Final Result Poster',
                    file: '/assets/dalenzia2k25/journey/final-result.png',
                    caption: 'Official Final Status: Dazzlers 1335 Points (Champions) vs Dynamos 1153 Points (Runners-Up) • Verified Tally'
                  })}
                >
                  <div className="w-full pb-2 px-1 flex items-center justify-between text-xs text-white/60">
                    <span className="font-serif text-[#E6A916] font-bold">Original Final Poster Asset</span>
                    <span className="font-mono text-[11px] text-white/50">FINAL RESULT DALENZIA.png</span>
                  </div>

                  <div className="w-full min-h-[420px] sm:min-h-[500px] md:min-h-[580px] flex items-center justify-center py-2">
                    <img
                      src="/assets/dalenzia2k25/journey/final-result.png"
                      alt="Dalenzia 2K25 Final Result"
                      className="max-h-[620px] w-auto max-w-full object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>

                  <div className="w-full pt-3 px-1 flex items-center justify-between text-xs text-white/60 border-t border-white/10">
                    <span className="text-white/80">Click to expand high-resolution final status poster</span>
                    <span className="flex items-center gap-1 font-bold text-[#E6A916]">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Expand High-Res</span>
                    </span>
                  </div>
                </div>

                {/* Final Championship Ledger & Proclamation */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 rounded-3xl bg-white/5 border border-[#E6A916]/40 space-y-4">
                    <div className="text-xs font-mono text-[#E6A916] uppercase font-bold tracking-wider">
                      Official Result Ledger
                    </div>

                    {/* Dazzlers Score Row */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#E6A916]/20 border border-[#E6A916]">
                      <div>
                        <div className="text-xs font-mono text-[#E6A916] font-black uppercase">1ST POSITION · OVERALL CHAMPIONS</div>
                        <div className="font-serif font-black text-2xl sm:text-3xl text-white">DAZZLERS</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-black text-3xl sm:text-4xl text-[#E6A916]">1335</div>
                        <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Points</span>
                      </div>
                    </div>

                    {/* Dynamos Score Row */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div>
                        <div className="text-xs font-mono text-white/60 font-black uppercase">2ND POSITION · RUNNERS-UP</div>
                        <div className="font-serif font-black text-2xl sm:text-3xl text-white">DYNAMOS</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-black text-3xl sm:text-4xl text-amber-200">1153</div>
                        <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Points</span>
                      </div>
                    </div>

                    {/* Margin Metric */}
                    <div className="pt-2 text-center text-xs font-mono text-white/70 flex items-center justify-between px-2">
                      <span>Victory Margin:</span>
                      <span className="font-black text-white text-sm">+182 Points</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                    Following two intense competition days across senior, junior, sub-junior, and minor arenas at Dalailussunna Dars, Ayiroor, <strong>Team Dazzlers</strong> lifted the maiden Dalenzia crown by an authoritative 182-point margin, while <strong>Team Dynamos</strong> concluded a heroic campaign with 1153 points.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* 3. INDIVIDUAL LAUREATES – THE FOUR KALA PRATHIBHAS (PROMINENT ACHIEVEMENT POSTERS) */}
        <div className="space-y-8 pt-4">
          <div className="text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-[#A91F35] text-xs font-black tracking-widest uppercase">
              <Award className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>INDIVIDUAL LAUREATES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900">
              THE FOUR KALA PRATHIBHAS
            </h3>
            <p className="text-sm sm:text-base font-serif font-bold text-[#A91F35]">
              Celebrating Outstanding Talent &amp; Achievement (കലാപ്രതിഭകൾ)
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-2xl">
              Honoring the four highest individual laureates across Senior, Junior, Sub-Junior, and Minor categories. Each laureate's original achievement poster is displayed prominently with full visual clarity.
            </p>
          </div>

          {/* Prominent Posters Grid: Balanced 2-Column Spacious Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            {KALA_PRATHIBHA_2K25.map((kp) => (
              <div
                key={kp.title}
                className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-stone-200/90 hover:border-[#E6A916] transition-all shadow-xl flex flex-col justify-between space-y-6"
              >
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-white bg-stone-900 px-3 py-1 rounded-full uppercase tracking-wider">
                      {kp.category} Category
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      Chest No. {kp.chestNo}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#A91F35] font-serif">
                    {kp.malayalamTitle}
                  </span>
                </div>

                {/* Primary Achievement Poster (Prominent, Full Width, Uncropped, Object-Contain) */}
                <div
                  onClick={() => setPosterLightboxItem({
                    title: `${kp.title}: ${kp.name}`,
                    file: kp.poster,
                    caption: `${kp.malayalamTitle} • ${kp.malayalamName} (${kp.team}) • Official Achievement Poster`
                  })}
                  className="w-full bg-stone-950 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-between cursor-pointer group/poster border-2 border-stone-800 hover:border-[#E6A916] transition-all shadow-inner"
                >
                  <div className="w-full pb-1 px-1 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span className="text-[#E6A916] font-bold">Achievement Poster</span>
                    <span>Click to view full size</span>
                  </div>
                  <div className="w-full flex-1 flex items-center justify-center min-h-[460px] sm:min-h-[520px] md:min-h-[580px] p-2">
                    <img
                      src={kp.poster}
                      alt={`${kp.name} - Official Kala Prathibha Poster`}
                      className="max-h-[580px] w-auto max-w-full object-contain rounded-xl group-hover/poster:scale-[1.01] transition-transform duration-300 shadow-xl"
                    />
                  </div>
                  <div className="w-full pt-2 px-1 flex items-center justify-between text-[11px] font-bold text-[#E6A916] border-t border-stone-800">
                    <span>Full Resolution Archive</span>
                    <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover/poster:text-[#E6A916]" />
                  </div>
                </div>

                {/* Achiever Details & Single ID Card Action Button */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md ${
                        kp.team.includes('Dazzlers')
                          ? 'text-amber-800 bg-amber-50 border border-amber-200'
                          : 'text-rose-800 bg-rose-50 border border-rose-200'
                      }`}>
                        {kp.team}
                      </span>
                      <span className="text-xs font-bold text-stone-500 font-mono">
                        Official Laureate Card #{kp.chestNo}
                      </span>
                    </div>
                    <h4 className="font-serif font-black text-xl sm:text-2xl text-stone-900">
                      {kp.name}
                    </h4>
                    <p className="text-sm font-bold text-[#A91F35] font-sans">
                      {kp.malayalamName || kp.name}
                    </p>
                  </div>

                  {/* ONLY ONE View ID Card Button */}
                  <div className="shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => {
                        setActiveKalaPrathibhaIdCard(kp);
                        setIdCardSide('front');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-[#E6A916]" />
                      <span>View ID Card</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competition Result Sheets Browser */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-xl font-serif font-black text-stone-900">
                Official Competition Arena Result Sheets (01–55)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Archived scorecards published by the Dalenzia 2K25 official scrutiny panel.
              </p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={resultsSearch}
                onChange={(e) => setResultsSearch(e.target.value)}
                placeholder="Search result sheet..."
                className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#A91F35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {filteredResults.slice(0, 24).map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedResult(r)}
                className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-[#A91F35] cursor-pointer group transition-all text-center space-y-2"
              >
                <div className="w-full h-32 bg-stone-950 rounded-xl overflow-hidden p-1 flex items-center justify-center">
                  <img
                    src={r.src}
                    alt={r.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="truncate">
                  <span className="font-serif font-bold text-xs text-stone-800 block truncate">{r.title}</span>
                  <span className="text-[10px] text-[#A91F35] font-mono font-bold block">{r.id}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredResults.length > 24 && (
            <div className="text-center pt-2">
              <p className="text-xs text-stone-500 font-medium">
                Showing first 24 of {filteredResults.length} competition sheets. Type in search box to find specific items.
              </p>
            </div>
          )}
        </div>

        {/* 4. COMPLETE STUDENT ID CARD GALLERY (ARCHIVE OF ALL 48 ORIGINAL PASSES) */}
        <div id="2k25-idcards" className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-stone-800 shadow-2xl space-y-8 text-left">
          
          {/* Header & Filter / Navigation Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-800">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6A916]/20 border border-[#E6A916]/40 text-[#E6A916] text-xs font-black tracking-widest uppercase">
                <IdCard className="w-3.5 h-3.5" />
                <span>OFFICIAL STUDENT ARCHIVE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight text-white">
                Complete 2K25 Student ID Card Gallery
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed">
                Every official participant credential issued for DALENZIA 2K25. Featuring individual candidate roll codes, team assignments (Dynamos 200 series &amp; Dazzlers 300 series), category allocations, and cryptographic QR matrix verification for stage scrutiny.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-stone-200 border border-white/10">
                  Total Cards: <strong className="text-[#E6A916]">{DALENZIA_2K25_ID_CARDS.length} Verified</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#A91F35]/30 text-rose-200 border border-[#A91F35]/40">
                  Team Dynamos: 24 Cards (200 Series)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#E6A916]/20 text-amber-200 border border-[#E6A916]/30">
                  Team Dazzlers: 24 Cards (300 Series)
                </span>
              </div>
            </div>

            {/* Filter Pills & Prev/Next Scroll Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Category / Team Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-950 border border-stone-800">
                {['ALL', 'DAZZLERS', 'DYNAMOS', 'KALA_PRATHIBHA'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setIdCardFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      idCardFilter === tab
                        ? 'bg-[#A91F35] text-white shadow-sm'
                        : 'text-stone-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab === 'ALL' ? `All (${DALENZIA_2K25_ID_CARDS.length})` : tab === 'DAZZLERS' ? 'Dazzlers (24)' : tab === 'DYNAMOS' ? 'Dynamos (24)' : 'Laureates (4)'}
                  </button>
                ))}
              </div>

              {/* Prev / Next Scroll Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollContainer(idCardsScrollRef, -360)}
                  className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 hover:border-[#E6A916] text-stone-200 hover:text-[#E6A916] flex items-center justify-center shadow-sm cursor-pointer transition-colors"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollContainer(idCardsScrollRef, 360)}
                  className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 hover:border-[#E6A916] text-stone-200 hover:text-[#E6A916] flex items-center justify-center shadow-sm cursor-pointer transition-colors"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scrolling Card Carousel with Swipe & Touch Support */}
          <div
            ref={idCardsScrollRef}
            className="flex items-stretch gap-5 overflow-x-auto pb-6 px-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {displayedIdCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setPosterLightboxItem({
                  title: `${card.name} – Candidate ID (${card.code})`,
                  file: card.file,
                  caption: `Chest No: ${card.chestNo} • ${card.team} • ${card.category} Category • Dalenzia 2K25 Verified Student Pass`
                })}
                className="w-72 sm:w-80 shrink-0 bg-stone-950 rounded-3xl p-4 sm:p-5 border border-stone-800 hover:border-[#E6A916] transition-all shadow-lg flex flex-col justify-between space-y-3 cursor-pointer group snap-center"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#E6A916] bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    {card.code}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    card.team.includes('Dazzlers')
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-rose-400/20 text-rose-300'
                  }`}>
                    {card.team}
                  </span>
                </div>

                {/* ID Card Display (Uncropped with object-contain) */}
                <div className="w-full h-44 sm:h-48 bg-black rounded-2xl overflow-hidden p-2 flex items-center justify-center border border-stone-800/80 group-hover:border-stone-700 transition-colors">
                  <img
                    src={card.file}
                    alt={card.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold">
                      {card.category} Category
                    </span>
                    {card.isKalaPrathibha && (
                      <span className="text-[10px] font-black text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded-md border border-amber-500/30">
                        ★ Laureate
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-black text-base text-white truncate group-hover:text-[#E6A916] transition-colors">
                    {card.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] font-bold text-[#E6A916]">
                  <span>Inspect Full Resolution Pass</span>
                  <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#E6A916]" />
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 07 – GENERAL QAWWALI – MAIN FESTIVAL PROGRAMME HIGHLIGHT                  */}
      {/* ========================================================================= */}
      <section id="2k25-qawwali" className="py-16 md:py-24 px-4 md:px-8 bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#E6A916]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#A91F35]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6A916]/20 border border-[#E6A916]/40 text-[#E6A916] text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{QAWWALI_HIGHLIGHT_2K25.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              {QAWWALI_HIGHLIGHT_2K25.sectionTitle}
            </h2>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#E6A916]">
              {QAWWALI_HIGHLIGHT_2K25.malayalamTitle} · {QAWWALI_HIGHLIGHT_2K25.timing}
            </p>
            <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed">
              {QAWWALI_HIGHLIGHT_2K25.description}
            </p>
          </div>

          {/* Large Editorial Presentation for General Qawwali */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Original Qawwali Artwork (Uncropped, Large Display Area) */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                className="w-full max-w-lg bg-stone-900 rounded-3xl p-3 border-2 border-[#E6A916]/80 shadow-2xl flex flex-col items-center cursor-pointer group"
                onClick={() => setPosterLightboxItem({
                  title: 'ജനറൽ ഖവാലി (General Qawwali Arena)',
                  file: QAWWALI_HIGHLIGHT_2K25.poster,
                  caption: 'The iconic night stage visual featuring the Ottoman Fez cap motif and festive Moroccan drapery'
                })}
              >
                <div className="w-full flex items-center justify-between pb-2 px-2 text-xs">
                  <span className="font-serif font-bold text-[#E6A916]">Marrakech Cultural Night Arena</span>
                  <span className="font-mono text-stone-400 text-[11px]">After Magrib Session</span>
                </div>
                
                <div className="w-full bg-black rounded-2xl overflow-hidden p-2 flex items-center justify-center min-h-[460px] max-h-[580px]">
                  <img
                    src={QAWWALI_HIGHLIGHT_2K25.poster}
                    alt="General Qawwali Artwork"
                    className="max-h-[560px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                <div className="w-full pt-3 px-2 flex items-center justify-between text-xs text-stone-400">
                  <span>Click for full stage artwork view</span>
                  <Maximize2 className="w-3.5 h-3.5 text-[#E6A916]" />
                </div>
              </div>
            </div>

            {/* Right: Cultural Features & Atmosphere */}
            <div className="lg:col-span-5 text-left space-y-6">
              
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider inline-block">
                  Sacred Music &amp; Devotional Poetry
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-snug">
                  An Unforgettable Night of Spiritual Ecstasy
                </h3>
                <p className="text-stone-300 text-sm leading-relaxed font-medium">
                  The General Qawwali session brought together hundreds of spectators under the night sky at Marrakech Stage. Accompanied by traditional percussion and harmonium, the vocalists chanted soul-stirring hymns in Arabic, Urdu, and Malayalam.
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-3">
                {QAWWALI_HIGHLIGHT_2K25.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-[#E6A916] shrink-0 mt-0.5" />
                    <span className="text-xs text-stone-200 font-medium leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 – THE DIGITAL DALENZIA EXPERIENCE (SPECIAL FEATURED HIGHLIGHT)          */}
      {/* ========================================================================= */}
      <section id="2k25-digitalweb" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-black tracking-widest uppercase">
            <Globe className="w-3.5 h-3.5" />
            <span>{DIGITAL_EXPERIENCE_2K25.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
            {DIGITAL_EXPERIENCE_2K25.sectionTitle}
          </h2>
          <p className="text-lg sm:text-xl font-serif font-bold text-[#A91F35]">
            {DIGITAL_EXPERIENCE_2K25.subtitle}
          </p>
          <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed">
            {DIGITAL_EXPERIENCE_2K25.description}
          </p>
        </div>

        {/* Editorial Layout: Original Digital Web Poster & Features */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Left: Original Digital Website Poster (Uncropped) */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              className="w-full max-w-md bg-stone-950 rounded-2xl overflow-hidden p-3 flex flex-col items-center cursor-pointer group border border-stone-800"
              onClick={() => setPosterLightboxItem({
                title: DIGITAL_EXPERIENCE_2K25.sectionTitle,
                file: DIGITAL_EXPERIENCE_2K25.poster,
                caption: 'Official Digital Website Poster of DALENZIA 2K25'
              })}
            >
              <div className="w-full flex items-center justify-between pb-2 px-1 text-xs text-stone-400">
                <span className="font-mono text-blue-400 font-bold">Web Platform Poster</span>
                <span className="font-bold text-white">Live Operations Portal</span>
              </div>
              <div className="w-full min-h-[460px] max-h-[580px] flex items-center justify-center p-1">
                <img
                  src={DIGITAL_EXPERIENCE_2K25.poster}
                  alt={DIGITAL_EXPERIENCE_2K25.sectionTitle}
                  className="max-h-[560px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="w-full pt-2 flex items-center justify-between text-xs text-stone-400">
                <span>Click to view full poster</span>
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Right: Web Milestones & Verified Visit Button */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono font-bold text-blue-600 tracking-wider">
                Digital Transformation in Traditional Dars
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 leading-snug">
                {DIGITAL_EXPERIENCE_2K25.headline}
              </h3>
            </div>

            <div className="space-y-3">
              {DIGITAL_EXPERIENCE_2K25.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-stone-700 font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            {/* Visit Web Archive Button */}
            <div className="pt-2">
              <a
                href={DIGITAL_EXPERIENCE_2K25.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md inline-flex cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>Visit 2K25 Digital Web Archive</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 09 – OFFICIAL FESTIVAL BADGES – CREDENTIAL SHOWCASE                        */}
      {/* ========================================================================= */}
      <section id="2k25-badges" className="py-16 md:py-24 px-4 md:px-8 bg-stone-100/70 border-y border-stone-200">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header & Carousel Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#A91F35] block">
                AUTHENTIC CREDENTIAL REGALIA
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-stone-900">
                {OFFICIAL_BADGES_2K25.sectionTitle}
              </h2>
              <p className="text-sm text-stone-600 font-medium">
                {OFFICIAL_BADGES_2K25.description}
              </p>
            </div>

            {/* Prev / Next Scroll Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollContainer(badgesScrollRef, -320)}
                className="w-10 h-10 rounded-full bg-white border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollContainer(badgesScrollRef, 320)}
                className="w-10 h-10 rounded-full bg-white border border-stone-200 hover:border-[#A91F35] text-stone-700 hover:text-[#A91F35] flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lanyard & Tag Style Badges Showcase (Horizontal Scrolling) */}
          <div
            ref={badgesScrollRef}
            className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-4 px-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {OFFICIAL_BADGES_2K25.badges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setPosterLightboxItem({
                  title: `${badge.role} – ${badge.title}`,
                  file: badge.file,
                  caption: `Official DALENZIA 2K25 Credential Badge • ${badge.category}`
                })}
                className="w-72 sm:w-80 shrink-0 bg-white rounded-3xl p-5 border border-stone-200/90 hover:border-[#A91F35] transition-all shadow-md flex flex-col justify-between space-y-4 cursor-pointer group snap-center"
              >
                {/* Lanyard Strap & Silver Clip Visual */}
                <div className="w-full flex flex-col items-center -mt-8">
                  {/* Ribbon Lanyard */}
                  <div
                    className="w-8 h-10 rounded-t-sm shadow-xs"
                    style={{ backgroundColor: badge.color }}
                  />
                  {/* Silver Metallic Clasp */}
                  <div className="w-10 h-4 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-500 rounded-sm border border-stone-400 shadow-sm flex items-center justify-center">
                    <div className="w-4 h-1.5 bg-stone-700 rounded-full" />
                  </div>
                </div>

                {/* Badge Artwork Frame (Uncropped with object-contain) */}
                <div className="w-full h-80 bg-stone-950 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
                  <img
                    src={badge.file}
                    alt={badge.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="text-left space-y-1">
                  <span
                    className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block text-white"
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.role}
                  </span>
                  <h4 className="font-serif font-black text-base text-stone-900 group-hover:text-[#A91F35] transition-colors">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium">{badge.category}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35]">
                  <span>View High-Res Credential</span>
                  <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#A91F35]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11 – STAGE ARCHITECTURE & PHOTO GALLERY (INAUGURAL INCLUDED IN GALLERY)    */}
      {/* ========================================================================= */}
      <section id="2k25-gallery" className="py-16 md:py-24 px-4 md:px-8 bg-white border-y border-[#A91F35]/15">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#A91F35] block">
              VISUAL CHRONICLES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
              Complete 2K25 Photo Gallery
            </h2>
            <p className="text-sm md:text-base text-stone-600 font-medium">
              {generalGalleryPhotos.length} authentic high-resolution moments from the inaugural edition, preserving every smile, performance, and prayer. Includes all inaugural assembly photographs.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {galleryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPhotoCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  photoCategory === cat.id
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  photoCategory === cat.id ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Photo Gallery Grid (Adaptive Uncropped Images with object-contain) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredPhotos.length === 0 ? (
              <div className="col-span-full py-12 px-4 text-center space-y-3 bg-stone-50 rounded-3xl border border-dashed border-stone-300">
                <p className="text-sm font-semibold text-stone-700">
                  All Prize Distribution photographs are exclusively curated in the dedicated Moments of Honour section below.
                </p>
                <button
                  type="button"
                  onClick={scrollToArchiveSection('2k25-moments-of-honour')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#A91F35] text-white text-xs font-bold shadow-sm hover:bg-[#8f182b] transition-all cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>View Featured Presentation Moments & Award Archive</span>
                </button>
              </div>
            ) : (
              filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="group relative bg-[#1c1917] rounded-2xl overflow-hidden shadow-xs cursor-pointer border border-stone-200 hover:border-[#E6A916] transition-all p-1 flex items-center justify-center min-h-[170px]"
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    className="max-h-48 w-auto max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white pointer-events-none">
                    <Maximize2 className="w-5 h-5 text-[#E6A916]" />
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11B – THE MOMENTS OF HONOUR (DEDICATED PRIZE DISTRIBUTION SHOWCASE)       */}
      {/* ========================================================================= */}
      <section id="2k25-moments-of-honour" className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-[#F7F3E9] via-amber-50/20 to-[#F7F3E9] border-y border-[#A91F35]/20 relative overflow-hidden">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E6A916]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#A91F35]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">

          {/* ===================================================================== */}
          {/* A. FEATURED INTRO & OFFICIAL STAGE FLEX ARTWORK IDENTITY              */}
          {/* ===================================================================== */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A91F35]/10 text-[#A91F35] font-black text-xs uppercase tracking-widest border border-[#A91F35]/20 shadow-xs">
              <Trophy className="w-4 h-4 text-[#E6A916]" />
              <span>OFFICIAL PRIZE DISTRIBUTION SHOWCASE</span>
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-stone-900">
              THE MOMENTS OF HONOUR
            </h2>

            <p className="text-base sm:text-xl font-serif italic text-[#A91F35] font-bold">
              Celebrating achievements, recognizing dedication and preserving unforgettable moments.
            </p>

            <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Preserving every presentation ceremony from Dalenzia 2K25. Every photograph in this dedicated archive was captured in front of the authentic Esencia Oculta stage flex, commemorating the literary, artistic, and moral triumphs of our students.
            </p>

            {/* Quick Metadata Pill Strip */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E6A916]/40 text-[#A91F35] text-xs font-bold shadow-xs">
                🏆 31 Original Prize Photographs
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold shadow-xs">
                📍 Taqwa Jumma Masjid · Masjidul Livah, Ayiroor
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold shadow-xs">
                🗓️ 27 & 28 December 2025
              </span>
            </div>
          </div>

          {/* 1. Large-Format Official Prize Distribution Flex Presentation */}
          <div className="max-w-5xl mx-auto space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E6A916]" />
                <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                  Visual Identity: Official 2K25 Stage Flex Artwork
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#A91F35] hidden sm:inline">
                Click to Expand Master High-Res (9000×4500px)
              </span>
            </div>

            <div
              onClick={() => setHonourLightboxIndex(-1)}
              className="group relative rounded-3xl overflow-hidden border-2 border-[#E6A916]/50 shadow-2xl bg-white p-2 sm:p-3 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-stone-100 flex items-center justify-center">
                <img
                  src="/assets/dalenzia2k25/badges and flex/dalenzia flex 2 stage.png"
                  alt="Official Dalenzia 2K25 Prize Distribution Stage Flex Artwork"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center shadow-lg">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-black/70 px-4 py-1.5 rounded-full border border-white/20">
                    View Full-Resolution Stage Flex
                  </span>
                </div>
              </div>

              <div className="pt-3 pb-1 px-3 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 gap-2 border-t border-stone-100 mt-2">
                <div className="flex items-center gap-2 font-bold text-[#A91F35]">
                  <span>DALENZIA 2K25 • ESENCIA OCULTA</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-600 font-medium">Stage Backdrop for all 31 Award Ceremonies</span>
                </div>
                <div className="text-[11px] font-mono text-stone-500">
                  Venue: Masjidul Livah Kandubazar, Ayiroor
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* B. FEATURED AWARD MOMENTS (CREATIVE LARGE-FORMAT EDITORIAL SHOWCASE)  */}
          {/* ===================================================================== */}
          <div className="space-y-6 pt-4">
            <div className="text-left space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#A91F35]">
                MOMENTS OF DISTINCTION
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
                Featured Presentation Moments
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                Highlighted milestone ceremonies, wide-angle stage honours, and landmark trophy awards.
              </p>
            </div>

            {/* Asymmetrical Large-Format Editorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Highlight 1: Grand Widescreen Stage Moment (C1) - 7 cols */}
              {prizePhotos.find(p => p.filename === 'C1.png') && (
                <div
                  onClick={() => {
                    const idx = prizePhotos.findIndex(p => p.filename === 'C1.png');
                    setHonourLightboxIndex(idx);
                  }}
                  className="md:col-span-7 group relative bg-[#1c1917] rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:border-[#E6A916] transition-all p-2 flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
                    <img
                      src="/assets/dalenzia2k25/frame/Prize Distribution/C1.png"
                      alt="Grand Widescreen Stage Presentation"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#A91F35]/90 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs">
                      Grand Stage Honour
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                      <Maximize2 className="w-8 h-8 text-[#E6A916]" />
                    </div>
                  </div>
                  <div className="p-3 text-left space-y-0.5">
                    <div className="text-xs font-bold text-[#E6A916]">
                      Grand Ceremonial Stage Assembly
                    </div>
                    <div className="text-[11px] text-white/70">
                      Scholars, patrons, and category winners gathered at the central podium.
                    </div>
                  </div>
                </div>
              )}

              {/* Highlight 2 & 3: Twin Portrait Spotlight Moments (t1 & t2) - 5 cols */}
              <div className="md:col-span-5 grid grid-cols-2 gap-4">
                {prizePhotos.find(p => p.filename === 't1.png') && (
                  <div
                    onClick={() => {
                      const idx = prizePhotos.findIndex(p => p.filename === 't1.png');
                      setHonourLightboxIndex(idx);
                    }}
                    className="group relative bg-[#1c1917] rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:border-[#E6A916] transition-all p-2 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
                      <img
                        src="/assets/dalenzia2k25/frame/Prize Distribution/t1.png"
                        alt="Trophy Presentation Moment"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                        <Maximize2 className="w-6 h-6 text-[#E6A916]" />
                      </div>
                    </div>
                    <div className="p-2 text-left space-y-0.5">
                      <div className="text-[11px] font-bold text-[#E6A916] truncate">
                        Memento Honour
                      </div>
                      <div className="text-[10px] text-white/70 truncate">
                        Official Presentation
                      </div>
                    </div>
                  </div>
                )}

                {prizePhotos.find(p => p.filename === 't2.png') && (
                  <div
                    onClick={() => {
                      const idx = prizePhotos.findIndex(p => p.filename === 't2.png');
                      setHonourLightboxIndex(idx);
                    }}
                    className="group relative bg-[#1c1917] rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:border-[#E6A916] transition-all p-2 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
                      <img
                        src="/assets/dalenzia2k25/frame/Prize Distribution/t2.png"
                        alt="Trophy Presentation Moment"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                        <Maximize2 className="w-6 h-6 text-[#E6A916]" />
                      </div>
                    </div>
                    <div className="p-2 text-left space-y-0.5">
                      <div className="text-[11px] font-bold text-[#E6A916] truncate">
                        Academic Distinction
                      </div>
                      <div className="text-[10px] text-white/70 truncate">
                        Trophy Presentation
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Highlight 4: Second Widescreen Moment (C2) - 6 cols */}
              {prizePhotos.find(p => p.filename === 'C2.png') && (
                <div
                  onClick={() => {
                    const idx = prizePhotos.findIndex(p => p.filename === 'C2.png');
                    setHonourLightboxIndex(idx);
                  }}
                  className="md:col-span-6 group relative bg-[#1c1917] rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:border-[#E6A916] transition-all p-2 flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
                    <img
                      src="/assets/dalenzia2k25/frame/Prize Distribution/C2.png"
                      alt="Stage Dais Felicitations"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                      <Maximize2 className="w-7 h-7 text-[#E6A916]" />
                    </div>
                  </div>
                  <div className="p-2.5 text-left">
                    <div className="text-xs font-bold text-[#E6A916]">Stage Felicitations & Felicitators Dais</div>
                    <div className="text-[11px] text-white/70">Dignitaries and teachers honouring the fest achievers.</div>
                  </div>
                </div>
              )}

              {/* Highlight 5: Third Widescreen Moment (C3) - 6 cols */}
              {prizePhotos.find(p => p.filename === 'C3.png') && (
                <div
                  onClick={() => {
                    const idx = prizePhotos.findIndex(p => p.filename === 'C3.png');
                    setHonourLightboxIndex(idx);
                  }}
                  className="md:col-span-6 group relative bg-[#1c1917] rounded-3xl overflow-hidden shadow-lg border border-stone-200 hover:border-[#E6A916] transition-all p-2 flex flex-col justify-between cursor-pointer"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/60 flex items-center justify-center">
                    <img
                      src="/assets/dalenzia2k25/frame/Prize Distribution/C3.png"
                      alt="Scholar Award Presentation"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                      <Maximize2 className="w-7 h-7 text-[#E6A916]" />
                    </div>
                  </div>
                  <div className="p-2.5 text-left">
                    <div className="text-xs font-bold text-[#E6A916]">Scholar & Achiever Memento Bestowal</div>
                    <div className="text-[11px] text-white/70">Revered Usthad presenting the crystal honour insignia.</div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ===================================================================== */}
          {/* C. COMPLETE PRIZE DISTRIBUTION PHOTO GALLERY (ALL 31 PHOTOGRAPHS)     */}
          {/* ===================================================================== */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-left border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#A91F35]">
                  ARCHIVE REGISTRY
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
                  Complete Award Presentation Archive
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  Every original photograph belonging to the 2K25 Prize Distribution ceremony (Total {prizePhotos.length} Moments).
                </p>
              </div>
              <div className="text-xs font-bold text-[#A91F35] bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs shrink-0">
                Displaying all {prizePhotos.length} of {prizePhotos.length} Moments
              </div>
            </div>

            {/* Responsive Grid for All 31 Genuine Prize-giving Photos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {prizePhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setHonourLightboxIndex(index)}
                  className="group relative bg-[#1c1917] rounded-2xl overflow-hidden shadow-xs cursor-pointer border border-stone-200 hover:border-[#E6A916] transition-all p-1 flex flex-col justify-between min-h-[190px]"
                >
                  <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-black/40 p-1">
                    <img
                      src={photo.src}
                      alt={`Dalenzia 2K25 Prize Distribution Moment ${index + 1}`}
                      loading="lazy"
                      className="max-h-52 w-auto max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white pointer-events-none">
                      <Maximize2 className="w-5 h-5 text-[#E6A916]" />
                    </div>
                  </div>

                  <div className="pt-2 pb-1 px-2 flex items-center justify-between text-[11px] text-white/80 border-t border-white/5">
                    <span className="font-bold text-[#E6A916]">
                      Moment #{String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      {photo.filename}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* D. CLOSING MEMORY                                                     */}
          {/* ===================================================================== */}
          <div className="pt-8">
            <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white via-[#F7F3E9] to-amber-50/60 border border-[#E6A916]/50 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-[#A91F35] text-[#E6A916] mx-auto flex items-center justify-center font-bold text-xl shadow-md">
                🏆
              </div>
              <blockquote className="text-base sm:text-xl font-serif italic text-stone-900 leading-relaxed font-bold max-w-2xl mx-auto">
                "Every award represents a moment of effort, dedication and achievement. These are the moments that made DALENZIA 2K25 memorable."
              </blockquote>
              <div className="pt-2 flex items-center justify-center gap-3 text-xs text-[#A91F35] font-black uppercase tracking-widest">
                <span className="h-[1px] w-10 bg-[#A91F35]/30" />
                <span>Dalenzia Fest 2K25 • Honour Archive</span>
                <span className="h-[1px] w-10 bg-[#A91F35]/30" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12 – VIDEO HIGHLIGHTS (FUNCTIONAL & CENTERED CINEMATIC ARCHIVES)           */}
      {/* ========================================================================= */}
      <section id="2k25-videos" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#A91F35] block">
            CINEMATIC ARCHIVES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
            Festival Video Highlights
          </h2>
          <p className="text-sm md:text-base text-stone-600 font-medium">
            27 original video recordings capturing speeches, choral melodies, crowd reactions, and behind-the-scenes energy.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
            <Film className="w-3.5 h-3.5 text-[#A91F35]" />
            <span>Showing <strong>{filteredVideos.length}</strong> of {VIDEO_HIGHLIGHTS_2K25.length} Videos</span>
          </div>
        </div>

        {/* Video Filters Container */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* 1. Primary Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Videos', count: videoCategoryCounts.all },
              { id: 'anthem', label: 'Anthem', count: videoCategoryCounts.anthem },
              { id: 'highlights', label: 'Highlights', count: videoCategoryCounts.highlights },
              { id: 'ceremony', label: 'Ceremony', count: videoCategoryCounts.ceremony },
              { id: 'performances', label: 'Performances', count: videoCategoryCounts.performances },
              { id: 'production', label: 'Production', count: videoCategoryCounts.production }
            ].map((cat) => {
              const isActive = videoCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setVideoCategory(cat.id);
                    setVideoSubCategory('all');
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#A91F35] text-white shadow-md scale-105'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Secondary Subcategory Pills (Contextual & Clean) */}
          {(() => {
            const availableSubCategories = [];
            if (videoCategory === 'ceremony') {
              availableSubCategories.push(
                { id: 'all', label: 'All Ceremony', count: videoCategoryCounts.ceremony },
                { id: 'Opening / Inauguration', label: 'Opening / Inauguration', count: videoSubCategoryCounts['Opening / Inauguration'] || 0 },
                { id: 'Closing Ceremony', label: 'Closing Ceremony', count: videoSubCategoryCounts['Closing Ceremony'] || 0 },
                { id: 'Award Ceremony', label: 'Award Ceremony', count: videoSubCategoryCounts['Award Ceremony'] || 0 },
                { id: 'Stage Programmes', label: 'Stage Programmes', count: videoSubCategoryCounts['Stage Programmes'] || 0 }
              );
            } else if (videoCategory === 'production') {
              availableSubCategories.push(
                { id: 'all', label: 'All Production', count: videoCategoryCounts.production },
                { id: 'Production Team', label: 'Production Team', count: videoSubCategoryCounts['Production Team'] || 0 },
                { id: 'Behind the Scenes', label: 'Behind the Scenes', count: videoSubCategoryCounts['Behind the Scenes'] || 0 }
              );
            } else if (videoCategory === 'all') {
              availableSubCategories.push(
                { id: 'all', label: 'All Types', count: VIDEO_HIGHLIGHTS_2K25.length },
                { id: 'Opening / Inauguration', label: 'Opening / Inauguration', count: videoSubCategoryCounts['Opening / Inauguration'] || 0 },
                { id: 'Closing Ceremony', label: 'Closing Ceremony', count: videoSubCategoryCounts['Closing Ceremony'] || 0 },
                { id: 'Award Ceremony', label: 'Award Ceremony', count: videoSubCategoryCounts['Award Ceremony'] || 0 },
                { id: 'Anthem', label: 'Anthem', count: videoSubCategoryCounts['Anthem'] || 0 },
                { id: 'Festival Highlights', label: 'Highlights', count: videoSubCategoryCounts['Festival Highlights'] || 0 },
                { id: 'Performances', label: 'Performances', count: videoSubCategoryCounts['Performances'] || 0 },
                { id: 'Stage Programmes', label: 'Stage Programmes', count: videoSubCategoryCounts['Stage Programmes'] || 0 },
                { id: 'Production Team', label: 'Production Team', count: videoSubCategoryCounts['Production Team'] || 0 },
                { id: 'Behind the Scenes', label: 'Behind the Scenes', count: videoSubCategoryCounts['Behind the Scenes'] || 0 }
              );
            } else if (videoCategory === 'highlights') {
              return (
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Preserved Festival Sequence · Continuous Experience (Highlight 01 – 11)</span>
                  </span>
                </div>
              );
            }

            if (availableSubCategories.length <= 1) return null;

            return (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
                  Subcategory:
                </span>
                {availableSubCategories.map((sub) => {
                  const isSubActive = videoSubCategory === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setVideoSubCategory(sub.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSubActive
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className={`px-1 rounded-full text-[9px] font-black ${
                        isSubActive ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {sub.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const encodedSrc = encodeURI(video.src);
            const isPlayingInline = inlinePlayingVideoId === video.id;

            return (
              <div
                key={video.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 hover:border-[#A91F35] transition-all shadow-sm flex flex-col justify-between space-y-4 text-left group"
              >
                <div
                  className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-950 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setVideoError(null);
                    if (isPlayingInline) {
                      setActiveVideo(video);
                    } else {
                      setInlinePlayingVideoId(video.id);
                    }
                  }}
                >
                  {isPlayingInline ? (
                    <div
                      className="w-full h-full relative bg-black flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <video
                        src={encodedSrc}
                        controls
                        autoPlay
                        playsInline
                        preload="auto"
                        className="w-full h-full object-contain"
                        onError={() => setVideoError(`Unable to play video: ${video.rawFilename}`)}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideo(video);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-xs flex items-center gap-1 z-20 cursor-pointer shadow-md transition-all"
                        title="Open Large Theater Player"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Authentic Video Cover Frame (Clickable directly to play) */}
                      <img
                        src={video.thumbnail || `/assets/dalenzia2k25/video_thumbnails/${video.rawFilename.replace(/\.mp4$/i, '.jpg')}`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors pointer-events-none" />
                      
                      {/* Subtle Interactive Tap/Hover Pill */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-xs font-semibold shadow-xl border border-white/20 flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Click to play video</span>
                        </span>
                      </div>

                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white/90">
                        {video.sizeMB} MB
                      </span>
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#A91F35] text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                        {video.subCategory || video.category}
                      </span>
                      {video.highlightNumber && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#E6A916] text-[#A91F35] text-[10px] font-black uppercase tracking-wider shadow-sm">
                          Highlight #{String(video.highlightNumber).padStart(2, '0')}
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-black text-base text-stone-900 leading-snug group-hover:text-[#A91F35] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-[11px] font-mono text-stone-500">{video.rawFilename}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setVideoError(null);
                        setInlinePlayingVideoId(video.id);
                      }}
                      className="hover:text-[#A91F35] flex items-center gap-1 cursor-pointer text-[#A91F35]"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isPlayingInline ? 'Playing Now' : 'Watch Video'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setVideoError(null);
                        setActiveVideo(video);
                      }}
                      className="hover:text-stone-900 flex items-center gap-1 cursor-pointer text-stone-400 hover:text-stone-700"
                      title="Open Large Theater Player"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span className="text-[11px]">Theater</span>
                    </button>
                  </div>
                  <a
                    href={encodedSrc}
                    download={video.rawFilename}
                    className="hover:text-stone-900 flex items-center gap-1 text-[11px]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 13 – NEWS BULLETIN (ALL 3 PRESS ARTICLES & ORIGINAL ARCHIVAL SCANS)       */}
      {/* ========================================================================= */}
      <section id="2k25-news" className="py-16 md:py-24 px-4 md:px-8 bg-stone-100/80 border-y border-[#A91F35]/15">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-[#A91F35] text-xs font-black tracking-widest uppercase">
              <Newspaper className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>OFFICIAL PRESS COVERAGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
              {NEWS_BULLETIN_2K25.malayalamSectionTitle}
            </h2>
            <p className="text-sm md:text-base text-stone-600 font-medium">
              Read all three verified news publications covering DALENZIA 2K25 across leading print newspapers and online media.
            </p>
          </div>

          {/* 3-Article Selection Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 p-1.5 bg-stone-200/70 rounded-2xl max-w-3xl mx-auto">
            {NEWS_BULLETIN_2K25.articles.map((article, idx) => {
              const isActive = activeArticleIndex === idx;
              return (
                <button
                  key={article.id}
                  onClick={() => setActiveArticleIndex(idx)}
                  className={`flex-1 min-w-[200px] px-4 py-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    isActive
                      ? 'bg-[#A91F35] text-white shadow-md'
                      : 'bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-300/50'
                  }`}
                >
                  <span className="block font-black text-xs sm:text-sm">{article.malayalamSource}</span>
                  <span className={`block text-[10px] uppercase tracking-wider mt-0.5 ${isActive ? 'text-amber-200' : 'text-stone-500'}`}>
                    {article.sourceName} • {article.date}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Article Editorial Presentation */}
          {(() => {
            const article = NEWS_BULLETIN_2K25.articles[activeArticleIndex] || NEWS_BULLETIN_2K25.articles[0];
            return (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md text-left space-y-8">
                
                {/* News Meta Header */}
                <div className="pb-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black uppercase text-red-600 tracking-wider font-mono">
                      {article.sourceName} • {article.malayalamSource}
                    </span>
                    <span className="text-xs text-stone-400 font-mono block sm:inline sm:ml-2">
                      {article.date}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#A91F35] bg-[#A91F35]/10 px-3 py-1 rounded-full font-mono uppercase tracking-wider">
                    {article.badge}
                  </span>
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 leading-snug">
                    {article.headline}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-amber-900 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 leading-relaxed font-sans">
                    {article.tagline}
                  </p>
                </div>

                {/* Editorial Article Layout: Image + Paragraphs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Accompanying News Photograph / Clipping */}
                  <div className="lg:col-span-5 space-y-3">
                    <div
                      className="bg-stone-100 rounded-2xl overflow-hidden p-2 border border-stone-200 shadow-xs cursor-pointer group"
                      onClick={() => setPosterLightboxItem({
                        title: `${article.malayalamSource} • ${article.headline}`,
                        file: article.fullClipping || article.headerPhoto,
                        caption: `${article.sourceName} (${article.date}) • ${article.caption || ''}`
                      })}
                    >
                      <img
                        src={article.headerPhoto}
                        alt={article.headline}
                        className="w-full h-auto max-h-[380px] object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="p-2 text-[11px] text-stone-600 font-medium text-center flex items-center justify-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#A91F35]" />
                        <span>{article.caption || 'Click to view full uncropped scan'}</span>
                      </div>
                    </div>

                    {/* View Full Archival Scan Lightbox Button */}
                    <button
                      type="button"
                      className="w-full bg-stone-50 hover:bg-stone-100 rounded-2xl p-3 border border-stone-200 flex items-center justify-between cursor-pointer hover:border-[#A91F35] transition-all"
                      onClick={() => setPosterLightboxItem({
                        title: `${article.malayalamSource} • Original Scan`,
                        file: article.fullClipping || article.headerPhoto,
                        caption: `${article.headline} • ${article.date}`
                      })}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#A91F35]" />
                        <span className="text-xs font-bold text-stone-800">View Full-Resolution Archival Scan</span>
                      </div>
                      <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  </div>

                  {/* Verbatim Malayalam Article Text with Clear Spacing */}
                  <div className="lg:col-span-7 space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed font-sans">
                    {article.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                </div>

                {/* Original Source Link Button (if applicable) */}
                <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-stone-500 font-mono">
                    Publication Archive: {article.sourceName} • {article.date}
                  </span>
                  {article.originalUrl ? (
                    <a
                      href={article.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <span>READ ORIGINAL NEWS</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => setPosterLightboxItem({
                        title: `${article.malayalamSource} • High-Resolution Scan`,
                        file: article.fullClipping,
                        caption: `${article.headline} (${article.date})`
                      })}
                      className="px-6 py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8B1A2C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <span>VIEW PRINT SCAN</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })()}

          {/* Archival Press Clippings Direct Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-stone-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A91F35]" />
                <span>All 3 Original Press Scans & Documents</span>
              </h4>
              <span className="text-xs text-stone-500 font-mono">Click any scan for full-screen zoom</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {NEWS_BULLETIN_2K25.articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setPosterLightboxItem({
                    title: `${art.malayalamSource} • ${art.sourceName}`,
                    file: art.fullClipping,
                    caption: `${art.headline} • ${art.date}`
                  })}
                  className="bg-white rounded-2xl p-3 border border-stone-200 hover:border-[#A91F35] transition-all shadow-xs cursor-pointer group text-left space-y-2.5"
                >
                  <div className="w-full h-44 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center p-1 border border-stone-100">
                    <img
                      src={art.fullClipping}
                      alt={art.headline}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-600 block">{art.sourceName}</span>
                    <h5 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-[#A91F35] transition-colors">
                      {art.headline}
                    </h5>
                    <span className="text-[10px] text-stone-500 font-mono block mt-0.5">{art.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14 – FESTIVAL RECAP & MEMORIES                                            */}
      {/* ========================================================================= */}
      <section id="2k25-memories" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-[#A91F35] text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>{FESTIVAL_RECAP_2K25.sectionHeading}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">
            {FESTIVAL_RECAP_2K25.heading}
          </h2>
          <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed">
            {FESTIVAL_RECAP_2K25.text}
          </p>

          {/* Quick Recap Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
            {FESTIVAL_RECAP_2K25.stats.map((s, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3 text-center shadow-xs">
                <span className="block font-serif font-black text-2xl text-[#A91F35]">{s.value}</span>
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Heritage Relic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Championship Cups & Silverware */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-4 cursor-pointer group"
            onClick={() => setPosterLightboxItem({
              title: 'The Golden Championship Trophy',
              file: '/assets/dalenzia2k25/TROPY/DALENZIA trophy firt prize-01.png',
              caption: 'Crafted custom golden trophies for 1st Prize, 2nd Prize, 3rd Prize and Sarga Prathibha'
            })}
          >
            <div>
              <div className="w-full h-60 bg-stone-950 rounded-2xl overflow-hidden p-3 flex items-center justify-center">
                <img
                  src="/assets/dalenzia2k25/TROPY/DALENZIA trophy firt prize-01.png"
                  alt="First Prize Trophy"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#A91F35]">Silverware &amp; Laurels</span>
                <h4 className="font-serif font-black text-lg text-stone-900 group-hover:text-[#A91F35] transition-colors">
                  The Golden Championship Cups
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Crafted custom trophies for 1st Prize, 2nd Prize, 3rd Prize and the coveted Sarga Prathibha honor.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35]">
              <span>Trophy Architecture</span>
              <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#A91F35]" />
            </div>
          </motion.div>

          {/* Panoramic Stage Flex */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-4 cursor-pointer group"
            onClick={() => setPosterLightboxItem({
              title: 'Stage Flex 2 Backdrop',
              file: '/assets/dalenzia2k25/badges and flex/dalenzia flex 2 stage.png',
              caption: 'The panoramic architectural flex banner mounted across Stage 02'
            })}
          >
            <div>
              <div className="w-full h-60 bg-stone-950 rounded-2xl overflow-hidden p-3 flex items-center justify-center">
                <img
                  src="/assets/dalenzia2k25/badges and flex/dalenzia flex 2 stage.png"
                  alt="Stage Flex 2 Banner"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-4 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#A91F35]">Stage Backdrop Visual</span>
                <h4 className="font-serif font-black text-lg text-stone-900 group-hover:text-[#A91F35] transition-colors">
                  Panoramic Stage Flex
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The authentic wide architectural banner highlighting the theme motif and institutional heritage.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A91F35]">
              <span>Stage 02 Arena Flex</span>
              <Maximize2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#A91F35]" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15 – INSTAGRAM STORY FRAME SHOWCASE (REALISTIC 9:16 PHONE STORY VIEWER)   */}
      {/* ========================================================================= */}
      <section id="2k25-stories" className="py-16 md:py-24 px-4 md:px-8 bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-[#A91F35]/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#E6A916]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="space-y-3 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-pink-500/30 text-pink-300 text-xs font-black tracking-widest uppercase">
              <Smartphone className="w-3.5 h-3.5 text-pink-400" />
              <span>INSTAGRAM ARCHIVE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              {INSTAGRAM_STORIES_2K25.sectionHeading}
            </h2>
            <p className="text-lg sm:text-xl font-serif font-bold text-[#E6A916]">
              {INSTAGRAM_STORIES_2K25.subtitle}
            </p>
            <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed">
              {INSTAGRAM_STORIES_2K25.description}
            </p>
          </motion.div>

          {/* Interactive Phone-Like Story Viewer */}
          <div className="flex flex-col items-center justify-center gap-8">
            
            <div className="relative max-w-[340px] sm:max-w-[360px] w-full">
              
              {/* Outer Phone Frame */}
              <div className="bg-stone-900 border-[7px] sm:border-[8px] border-stone-800 rounded-[44px] shadow-2xl p-2.5 relative overflow-hidden ring-1 ring-white/10">
                
                {/* Story Screen Container (Exact 9:16 vertical format) */}
                <div className="relative aspect-[9/16] w-full rounded-[34px] overflow-hidden bg-black flex items-center justify-center shadow-inner group">
                  
                  {/* Active Story Artwork (Uncropped, complete composition preserved) */}
                  <img
                    key={activeStoryIndex}
                    src={INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].image}
                    alt={INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].title}
                    className="w-full h-full object-contain bg-black select-none"
                  />

                  {/* Top Phone Overlay: Speaker Notch + Instagram Story Progress Bars */}
                  <div className="absolute top-0 inset-x-0 pt-3 px-3.5 pb-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 pointer-events-none">
                    
                    {/* Speaker Notch */}
                    <div className="w-20 h-3 bg-stone-900 rounded-full mx-auto mb-2.5 border border-white/10 shadow-xs" />

                    {/* Instagram-Style Story Progress Bars */}
                    <div className="flex items-center gap-1.5 w-full">
                      {INSTAGRAM_STORIES_2K25.stories.map((_, idx) => (
                        <div
                          key={idx}
                          className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden"
                        >
                          <div
                            className={`h-full transition-all duration-300 ${
                              idx === activeStoryIndex
                                ? 'bg-white w-full'
                                : idx < activeStoryIndex
                                ? 'bg-white w-full'
                                : 'w-0'
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Instagram Story Profile Header */}
                    <div className="mt-3 flex items-center justify-between pointer-events-auto">
                      <div className="flex items-center gap-2 text-left">
                        <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-sm">
                          <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center overflow-hidden">
                            <span className="text-[10px] font-black text-amber-300 font-serif">DZ</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white leading-none">dalenzia_fest</span>
                            <span className="text-[10px] text-white/60 font-mono">2K25</span>
                          </div>
                          <span className="text-[10px] text-white/70 block mt-0.5">
                            {INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Zoom Lightbox Button */}
                      <button
                        onClick={() => setPosterLightboxItem({
                          title: `Instagram Story • ${INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].title}`,
                          file: INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].image,
                          caption: INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].caption
                        })}
                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title="Enlarge Story"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Left & Right Tap Zones (Simulating real Instagram Story tap navigation) */}
                  <div
                    className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer"
                    onClick={() => setActiveStoryIndex((prev) => (prev - 1 + INSTAGRAM_STORIES_2K25.stories.length) % INSTAGRAM_STORIES_2K25.stories.length)}
                    title="Tap for Previous Story"
                  />
                  <div
                    className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer"
                    onClick={() => setActiveStoryIndex((prev) => (prev + 1) % INSTAGRAM_STORIES_2K25.stories.length)}
                    title="Tap for Next Story"
                  />

                  {/* Bottom Story Footer inside Phone */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent z-20 pointer-events-none">
                    <div className="flex items-center justify-between gap-2 pointer-events-auto">
                      <div className="flex-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-[11px] text-white/80 font-medium text-left truncate">
                        {INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].title}
                      </div>
                      <div className="p-2 rounded-full bg-white/15 backdrop-blur-xs text-rose-400">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Side Floating Navigation Buttons */}
              <button
                onClick={() => setActiveStoryIndex((prev) => (prev - 1 + INSTAGRAM_STORIES_2K25.stories.length) % INSTAGRAM_STORIES_2K25.stories.length)}
                className="absolute -left-5 sm:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all shadow-xl cursor-pointer z-30"
                aria-label="Previous Story"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveStoryIndex((prev) => (prev + 1) % INSTAGRAM_STORIES_2K25.stories.length)}
                className="absolute -right-5 sm:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all shadow-xl cursor-pointer z-30"
                aria-label="Next Story"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>

            {/* Story Selector Mini Cards (Direct Selection & Caption) */}
            <div className="space-y-4 max-w-2xl w-full">
              <div className="grid grid-cols-3 gap-3">
                {INSTAGRAM_STORIES_2K25.stories.map((story, idx) => {
                  const isActive = activeStoryIndex === idx;
                  return (
                    <button
                      key={story.id}
                      onClick={() => setActiveStoryIndex(idx)}
                      className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col space-y-2 ${
                        isActive
                          ? 'bg-white/15 border-pink-500/80 ring-2 ring-pink-500/30'
                          : 'bg-stone-900/80 border-white/10 hover:border-white/25 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-[9/14] w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-pink-400 block tracking-wider">
                          Story 0{idx + 1}
                        </span>
                        <h4 className="font-bold text-xs text-white truncate">{story.title}</h4>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-stone-300 text-xs sm:text-sm font-medium leading-relaxed max-w-xl mx-auto">
                <span className="text-amber-400 font-bold">Story Highlight: </span>
                {INSTAGRAM_STORIES_2K25.stories[activeStoryIndex].caption}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 16 – THE TEAM BEHIND THE FESTIVAL (DALENZIA 2K25 – OFFICIAL TEAM)         */}
      {/* ========================================================================= */}
      <section id="2k25-team" className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white relative overflow-hidden border-t border-white/10">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#A91F35]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#E6A916]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="space-y-3 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6A916]/20 border border-[#E6A916]/40 text-[#E6A916] text-xs font-black tracking-widest uppercase">
              <Users className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>{OFFICIAL_TEAM_2K25.sectionHeading}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              {OFFICIAL_TEAM_2K25.mainTitle}
            </h2>
            <p className="text-lg sm:text-xl font-serif font-bold text-[#E6A916]">
              {OFFICIAL_TEAM_2K25.malayalamTitle}
            </p>
            <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto">
              "{OFFICIAL_TEAM_2K25.supportingText}"
            </p>
          </motion.div>

          {/* Grand Editorial Official Team Photograph Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="bg-stone-900/90 rounded-3xl p-4 sm:p-7 border border-amber-500/30 shadow-2xl space-y-5 text-left relative overflow-hidden group"
          >
            
            {/* Ambient Gold Halo */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E6A916]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Complete Uncropped Official Team Photo (Preserving All 14 Members) */}
            <div
              className="w-full bg-stone-950 rounded-2xl overflow-hidden p-2 sm:p-3 border border-white/10 flex items-center justify-center cursor-pointer relative"
              onClick={() => setPosterLightboxItem({
                title: `${OFFICIAL_TEAM_2K25.mainTitle} • High-Resolution Archive`,
                file: OFFICIAL_TEAM_2K25.image,
                caption: `${OFFICIAL_TEAM_2K25.caption} • ${OFFICIAL_TEAM_2K25.membersCount}`
              })}
            >
              <img
                src={OFFICIAL_TEAM_2K25.image}
                alt="DALENZIA 2K25 Official Team"
                className="w-full h-auto max-h-[680px] object-contain rounded-xl group-hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>View Full-Resolution Portrait</span>
              </div>
            </div>

            {/* Editorial Caption & Plaque */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 text-xs">
              <div className="space-y-1">
                <span className="text-[#E6A916] font-serif font-black text-sm block">
                  {OFFICIAL_TEAM_2K25.membersCount}
                </span>
                <p className="text-stone-400 font-medium">
                  {OFFICIAL_TEAM_2K25.caption}
                </p>
              </div>
              <button
                onClick={() => setPosterLightboxItem({
                  title: `${OFFICIAL_TEAM_2K25.mainTitle} • High-Resolution Archive`,
                  file: OFFICIAL_TEAM_2K25.image,
                  caption: `${OFFICIAL_TEAM_2K25.caption} • ${OFFICIAL_TEAM_2K25.membersCount}`
                })}
                className="px-5 py-2.5 rounded-2xl bg-[#E6A916] hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>OPEN MASTER PORTRAIT</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 17 – WITH GRATITUDE – THANK YOU POSTER (CLOSING SPECIAL FEATURE)           */}
      {/* ========================================================================= */}
      <section id="2k25-gratitude" className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#A91F35]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#E6A916]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10 text-center">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6A916]/20 border border-[#E6A916]/40 text-[#E6A916] text-xs font-black tracking-widest uppercase">
              <Heart className="w-3.5 h-3.5 fill-[#E6A916]" />
              <span>{THANK_YOU_2K25.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              {THANK_YOU_2K25.sectionTitle}
            </h2>
            <p className="text-lg sm:text-xl font-serif font-bold text-[#E6A916]">
              {THANK_YOU_2K25.malayalamTitle}
            </p>
            <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed">
              {THANK_YOU_2K25.subtitle}
            </p>
          </div>

          {/* Standalone Large Presentation: Original Thank You Poster */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            {/* Left: Original Thank You Poster (Uncropped) */}
            <div className="lg:col-span-6 flex justify-center">
              <div
                className="w-full max-w-md bg-black rounded-3xl p-3 border-2 border-[#E6A916]/70 shadow-2xl flex flex-col items-center cursor-pointer group"
                onClick={() => setPosterLightboxItem({
                  title: THANK_YOU_2K25.sectionTitle,
                  file: THANK_YOU_2K25.poster,
                  caption: 'Official Valedictory Thank You Letter signed by Usthads and DSSA Leaders'
                })}
              >
                <div className="w-full flex items-center justify-between pb-2 px-2 text-xs">
                  <span className="font-serif font-bold text-[#E6A916]">Official Valedictory Letter</span>
                  <span className="font-mono text-stone-400 text-[11px]">നന്ദി പത്രം</span>
                </div>
                
                <div className="w-full min-h-[460px] max-h-[580px] flex items-center justify-center p-2">
                  <img
                    src={THANK_YOU_2K25.poster}
                    alt="Thank You Poster"
                    className="max-h-[550px] w-auto max-w-full object-contain rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                <div className="w-full pt-3 px-2 flex items-center justify-between text-xs text-stone-400">
                  <span>Click to view full resolution</span>
                  <Maximize2 className="w-3.5 h-3.5 text-[#E6A916]" />
                </div>
              </div>
            </div>

            {/* Right: Benediction Text & Gratitude */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs uppercase font-bold tracking-wider inline-block">
                  The Blessings of Our Teachers
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-snug">
                  A Grateful Heart for an Unforgettable Milestone
                </h3>
              </div>

              {/* Verbatim Benediction Box */}
              <div className="bg-stone-900/90 rounded-2xl p-6 border border-stone-700 space-y-4">
                <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-sans italic">
                  {THANK_YOU_2K25.verbatimMalayalam}
                </p>
                <div className="pt-3 border-t border-stone-800 text-xs text-[#E6A916] font-serif font-bold whitespace-pre-line leading-relaxed">
                  {THANK_YOU_2K25.signatories}
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                This valedictory thanksgiving marks the official closing of the DALENZIA 2K25 festival archive, preserving the tireless dedication of our entire community for posterity.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 18 – JOIN THE DALENZIA COMMUNITY (OFFICIAL WHATSAPP GROUP INTEGRATION)    */}
      {/* ========================================================================= */}
      <WhatsAppCommunitySection id="2k25-community" theme="archival" editionBadge="DALENZIA 2K25 COMMUNITY ARCHIVE" />

      {/* ========================================================================= */}
      {/* 16 – EXPLORE DALENZIA 2K26 (SEAMLESS TRANSITION GATEWAY)                  */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-gradient-to-r from-[#A91F35] via-[#8B1A2C] to-[#5a0c1a] text-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] font-black text-xs uppercase tracking-wider inline-block">
              THE NEXT CHAPTER
            </span>
            <h3 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
              Dalenzia Fest 2K26 – Nueva Era
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed font-medium">
              Join the second edition taking place on 21, 22, 23 DECEMBER 2026. Explore live schedules, candidate registrations, and official scorecards.
            </p>
          </div>
          <button
            onClick={onNavigateHome}
            className="px-8 py-4 rounded-full bg-[#E6A916] hover:bg-amber-300 text-[#A91F35] font-black text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
          >
            <span>Enter Dalenzia 2K26 Portal</span>
            <ArrowRight className="w-4 h-4 text-[#A91F35]" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODALS & LIGHTBOXES                                                       */}
      {/* ========================================================================= */}

      {/* 1. Universal Poster Lightbox Modal (For Any Uncropped Poster/Visual) */}
      <AnimatePresence>
        {posterLightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setPosterLightboxItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-4xl max-h-[90vh] flex flex-col items-center justify-center relative p-2"
            >
              <img
                src={posterLightboxItem.file}
                alt={posterLightboxItem.title}
                className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl bg-black"
              />
              <div className="mt-3 text-center text-white text-xs font-medium space-y-1">
                <div className="font-serif font-black text-base text-[#E6A916]">
                  {posterLightboxItem.title}
                </div>
                {posterLightboxItem.caption && (
                  <div className="text-white/80 text-xs max-w-lg">
                    {posterLightboxItem.caption}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* 1.5. Dedicated Kala Prathibha Student ID Card Modal (Front & Back Interactive Switcher) */}
      <AnimatePresence>
        {activeKalaPrathibhaIdCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setActiveKalaPrathibhaIdCard(null)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
              title="Close ID Card"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-3xl w-full flex flex-col items-center justify-center relative p-4 sm:p-6 bg-stone-900 rounded-3xl border border-stone-700 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="w-full pb-4 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35]">
                      {activeKalaPrathibhaIdCard.category} Kala Prathibha
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      Chest #{activeKalaPrathibhaIdCard.chestNo}
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-xl sm:text-2xl text-white mt-1">
                    {activeKalaPrathibhaIdCard.name}
                  </h3>
                  <p className="text-xs text-[#E6A916] font-medium">
                    {activeKalaPrathibhaIdCard.team} • {activeKalaPrathibhaIdCard.malayalamTitle}
                  </p>
                </div>

                {/* Front / Back Switcher Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/70 border border-stone-700 self-start sm:self-auto">
                  <button
                    onClick={() => setIdCardSide('front')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      idCardSide === 'front'
                        ? 'bg-[#A91F35] text-white shadow-md font-black'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Front Side
                  </button>
                  <button
                    onClick={() => setIdCardSide('back')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      idCardSide === 'back'
                        ? 'bg-[#A91F35] text-white shadow-md font-black'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Back Side
                  </button>
                </div>
              </div>

              {/* ID Card Display with Original Aspect Ratio */}
              <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-5 my-2">
                <img
                  src={
                    idCardSide === 'front'
                      ? activeKalaPrathibhaIdCard.idCard
                      : '/assets/dalenzia2k25/DALENZIA STUDENT ID CARD/DALENZIA ID CARD.png'
                  }
                  alt={`${activeKalaPrathibhaIdCard.name} ID Card - ${idCardSide === 'front' ? 'Front Side' : 'Back Side'}`}
                  className="max-h-[60vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border-2 border-stone-700 transition-all duration-300"
                />
              </div>

              {/* Modal Footer */}
              <div className="w-full pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
                <div className="text-center sm:text-left">
                  {idCardSide === 'front' ? (
                    <span>
                      Official QR-verified candidate pass for <strong className="text-white">{activeKalaPrathibhaIdCard.name}</strong> ({activeKalaPrathibhaIdCard.code})
                    </span>
                  ) : (
                    <span>
                      Official institutional credentials, guidelines &amp; certification · Dalailussunna Dars, Ayiroor
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIdCardSide(prev => prev === 'front' ? 'back' : 'front')}
                  className="text-[#E6A916] hover:underline font-bold flex items-center gap-1.5 cursor-pointer self-center sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Switch to {idCardSide === 'front' ? 'Back' : 'Front'} Side</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* 2. Photo Gallery Lightbox Modal with Next / Prev */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center relative"
            >
              <img
                src={filteredPhotos[selectedPhotoIndex]?.src}
                alt={filteredPhotos[selectedPhotoIndex]?.title}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-3 text-center text-white text-xs font-medium space-y-0.5">
                <div className="font-bold text-sm text-[#E6A916]">
                  {filteredPhotos[selectedPhotoIndex]?.title}
                </div>
                <div className="text-white/60 font-mono text-[11px]">
                  Folder: {filteredPhotos[selectedPhotoIndex]?.folder} • {selectedPhotoIndex + 1} of {filteredPhotos.length}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2B. Dedicated The Moments of Honour Lightbox Modal */}
      <AnimatePresence>
        {honourLightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            {/* Top Close Button */}
            <button
              onClick={() => setHonourLightboxIndex(null)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-[#A91F35] text-white transition-colors z-30 cursor-pointer shadow-lg"
              title="Close Exhibition View"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Button */}
            <button
              onClick={handlePrevHonour}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-[#A91F35] text-white transition-colors z-30 cursor-pointer border border-white/20 shadow-xl"
              title="Previous Award Moment"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Button */}
            <button
              onClick={handleNextHonour}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-[#A91F35] text-white transition-colors z-30 cursor-pointer border border-white/20 shadow-xl"
              title="Next Award Moment"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center relative z-20"
            >
              {honourLightboxIndex === -1 ? (
                // Official Stage Flex Artwork Display
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src="/assets/dalenzia2k25/badges and flex/dalenzia flex 2 stage.png"
                    alt="Official Dalenzia 2K25 Prize Distribution Stage Flex Artwork"
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-[#E6A916]/40"
                  />
                  <div className="text-center text-white space-y-1">
                    <div className="font-serif font-black text-base sm:text-lg text-[#E6A916]">
                      Official Esencia Oculta Stage Backdrop & Flex Artwork
                    </div>
                    <div className="text-xs text-white/70 font-mono">
                      High-Resolution Master (9000×4500px) • Masjidul Livah Kandubazar, Ayiroor
                    </div>
                  </div>
                </div>
              ) : (
                // Genuine Prize-Giving Photo Display
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src={prizePhotos[honourLightboxIndex]?.src}
                    alt={`Dalenzia 2K25 Award Moment ${honourLightboxIndex + 1}`}
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  />
                  <div className="text-center text-white space-y-1">
                    <div className="font-serif font-black text-base sm:text-lg text-[#E6A916]">
                      The Moments of Honour — Presentation #{String(honourLightboxIndex + 1).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white/70 font-mono">
                      Moment {honourLightboxIndex + 1} of {prizePhotos.length} • {prizePhotos[honourLightboxIndex]?.filename}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Centered Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <div className="p-4 bg-stone-800 text-white flex items-center justify-between border-b border-white/10">
                <div className="text-left">
                  <h4 className="font-serif font-black text-sm text-[#E6A916]">{activeVideo.title}</h4>
                  <span className="text-[10px] text-white/60 font-mono">{activeVideo.rawFilename} • {activeVideo.sizeMB} MB</span>
                </div>
                <a
                  href={encodeURI(activeVideo.src)}
                  download={activeVideo.rawFilename}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                  <span>Download</span>
                </a>
              </div>

              <div className="aspect-video w-full bg-black flex items-center justify-center relative">
                {videoError ? (
                  <div className="p-6 text-center text-white space-y-2">
                    <p className="font-bold text-red-400">{videoError}</p>
                    <p className="text-xs text-stone-400">Direct file path: {activeVideo.src}</p>
                    <a
                      href={encodeURI(activeVideo.src)}
                      download
                      className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#E6A916] text-[#A91F35] font-bold text-xs"
                    >
                      Download Video Instead
                    </a>
                  </div>
                ) : (
                  <video
                    src={encodeURI(activeVideo.src)}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onError={(e) => setVideoError('Unable to stream video codec. Please use download button.')}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* 4. Competition Result Sheet Modal */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setSelectedResult(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-3xl max-h-[90vh] flex flex-col items-center justify-center relative p-2"
            >
              <img
                src={selectedResult.src}
                alt={selectedResult.title}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-black"
              />
              <div className="mt-3 text-center text-white text-xs font-medium space-y-0.5">
                <div className="font-serif font-black text-base text-[#E6A916]">
                  {selectedResult.title}
                </div>
                <div className="text-white/60 font-mono text-[11px]">
                  Arena Sheet ID: {selectedResult.id} • {selectedResult.folder}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </div>
  );
}
