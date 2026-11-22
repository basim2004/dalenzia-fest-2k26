import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AmbientGoldParticles from '../components/AmbientGoldParticles';
import {
  Camera, Film, Play, X, ChevronLeft, ChevronRight, Download,
  Maximize2, Sparkles, Filter, Calendar, Folder, ArrowRight,
  ExternalLink, Layers, Radio
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';

export default function GalleryPage({
  onNavigateHome,
  onNavigateEvents,
  onNavigateGuests,
  onNavigateSchedule,
  onNavigateResults
}) {
  const [albums, setAlbums] = useState(() => festivalStore.getPublicGalleryAlbums());
  const [mediaList, setMediaList] = useState(() => festivalStore.getPublicGalleryMedia());

  const [activeAlbumId, setActiveAlbumId] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all'); // 'all' | 'photo' | 'video'
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox Viewer
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Subscribe to live festival store updates
  useEffect(() => {
    if (typeof festivalStore.subscribe === 'function') {
      const unsub = festivalStore.subscribe(() => {
        setAlbums(festivalStore.getPublicGalleryAlbums());
        setMediaList(festivalStore.getPublicGalleryMedia());
      });
      return unsub;
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filtered media
  const filteredMedia = useMemo(() => {
    return mediaList.filter(m => {
      if (activeAlbumId !== 'all' && m.albumId !== activeAlbumId) return false;
      if (activeCategory !== 'all' && m.category?.toLowerCase() !== activeCategory.toLowerCase()) return false;
      if (activeType !== 'all' && m.type !== activeType) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title?.toLowerCase().includes(q);
        const matchCap = m.caption?.toLowerCase().includes(q);
        const matchCat = m.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchCap && !matchCat) return false;
      }
      return true;
    });
  }, [mediaList, activeAlbumId, activeCategory, activeType, searchQuery]);

  // Lightbox navigation
  const handleOpenLightbox = (index) => {
    setActiveMediaIndex(index);
    setIsLightboxOpen(true);
  };
  const handlePrev = () => {
    setActiveMediaIndex(prev => (prev > 0 ? prev - 1 : filteredMedia.length - 1));
  };
  const handleNext = () => {
    setActiveMediaIndex(prev => (prev < filteredMedia.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, filteredMedia]);

  const categoriesList = ['Inauguration', 'Programmes', 'Competitions', 'Guests', 'Stage Events', 'Behind the Scenes'];

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] selection:bg-[#A91F35] selection:text-white font-sans overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO HEADER WITH THREE.JS PARTICLES                          */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#A91F35] text-white overflow-hidden">
        {/* Ambient gold particles background */}
        <AmbientGoldParticles count={65} />

        {/* Ambient glow & geometry */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E6A916]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 space-y-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold tracking-widest uppercase backdrop-blur-md border border-white/20 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#E6A916]" />
            <span>DALENZIA FEST 2K26 · OFFICIAL MEDIA VAULT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-white leading-tight">
            The Visual Chronicle. <br />
            <span className="text-[#E6A916] italic font-serif">Two Days. One Era.</span>
          </h1>

          <p className="text-sm md:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Immerse yourself in high-resolution photographic folios, scholarly conclaves, dramatic arena triumphs, and live video broadcasts from Ayiroor.
          </p>

          {/* Quick Stats Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-bold text-stone-200">
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#E6A916]" />
              <span>{albums.length} Curated Albums</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#E6A916]" />
              <span>{mediaList.filter(m => m.type === 'photo').length} Photographs</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#E6A916]" />
              <span>{mediaList.filter(m => m.type === 'video').length} Broadcast Videos</span>
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE FESTIVAL BROADCAST & TEASER STAGE BANNER                         */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="rounded-3xl bg-white border border-[#A91F35]/15 shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8">
          
          {/* Left Text / Info */}
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-[#A91F35] text-[11px] font-extrabold uppercase tracking-wider border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-[#A91F35] animate-ping" />
              <span>LIVE BROADCAST FEED</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 leading-tight">
              Cordova Grand Stage Official Transmission
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              Live broadcast feeds and recorded transmission reels from Dalenzia Fest 2K26 are scheduled for <strong>21, 22, 23 DECEMBER 2026</strong>. Preview the cinematic theme teaser below or explore our recorded video archives.
            </p>

            <div className="flex items-center gap-4 text-xs font-bold text-stone-500 pt-2">
              <span className="flex items-center gap-1.5 text-[#A91F35]">
                <Radio className="w-4 h-4" />
                <span>Primary Stage Arena</span>
              </span>
              <span>•</span>
              <span>1080p Full HD</span>
              <span>•</span>
              <span>Multi-Cam Coverage</span>
            </div>
          </div>

          {/* Right Video Player */}
          <div className="w-full lg:w-96 rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-black aspect-video relative group">
            <video
              src="/assets/teaser.mp4"
              controls
              poster="/assets/main_poster.jpg"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ALBUMS SHOWCASE TABS & CAROUSEL                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h3 className="text-2xl font-serif font-black text-stone-900">
              Curated Festival Folios
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select an album to explore dedicated thematic collections
            </p>
          </div>

          {/* Type Toggle: All | Photos | Videos */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-stone-300 shadow-xs self-start">
            <button
              onClick={() => setActiveType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeType === 'all' ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setActiveType('photo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeType === 'photo' ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photos</span>
            </button>
            <button
              onClick={() => setActiveType('video')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeType === 'video' ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Albums Filter Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveAlbumId('all')}
            className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
              activeAlbumId === 'all'
                ? 'bg-[#A91F35] text-white shadow-md font-extrabold'
                : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
            }`}
          >
            All Albums ({mediaList.length})
          </button>

          {albums.map(alb => (
            <button
              key={alb.id}
              onClick={() => setActiveAlbumId(alb.id)}
              className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeAlbumId === alb.id
                  ? 'bg-[#A91F35] text-white shadow-md font-extrabold'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span>{alb.title}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeAlbumId === alb.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                {alb.mediaCount}
              </span>
            </button>
          ))}
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-semibold text-stone-600">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeCategory === 'all' ? 'bg-[#E6A916] text-[#A91F35] font-black' : 'hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#E6A916] text-[#A91F35] font-black'
                  : 'hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MEDIA MASONRY / RESPONSIVE GRID                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        {filteredMedia.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
            <Camera className="w-12 h-12 text-stone-400 mx-auto" />
            <h4 className="text-base font-bold text-stone-800">No media matches this filter</h4>
            <p className="text-xs text-stone-500">
              Try switching albums or clearing the category filter to view published assets.
            </p>
            <button
              onClick={() => {
                setActiveAlbumId('all');
                setActiveCategory('all');
                setActiveType('all');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8e172a] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedia.map((media, idx) => (
              <motion.div
                key={media.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="group bg-white rounded-3xl overflow-hidden border border-[#A91F35]/15 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => handleOpenLightbox(idx)}
              >
                {/* Media Image Container */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={media.thumbnailUrl || media.url}
                    alt={media.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {media.type === 'video' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {media.category}
                    </span>
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold">
                      {media.date}
                    </span>
                  </div>

                  {/* Title overlay in image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="text-xs sm:text-sm font-bold line-clamp-1 leading-tight drop-shadow-sm">
                      {media.title}
                    </h4>
                  </div>
                </div>

                {/* Bottom Caption & Meta */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
                    {media.caption || 'No caption available.'}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                    <span className="truncate max-w-[140px] text-stone-700">
                      📁 {media.albumTitle || 'Official Archive'}
                    </span>
                    <span className="text-[#A91F35] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 5. LIGHTBOX & FULL-SIZE VIEWER MODAL                                      */}
      {/* ========================================================================= */}
      {isLightboxOpen && filteredMedia[activeMediaIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left / Right Nav buttons */}
          {filteredMedia.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
                title="Next (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Active Media Container */}
          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col justify-between bg-[#1c1917] rounded-3xl overflow-hidden border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media Content Display */}
            <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden min-h-[300px] max-h-[65vh]">
              {filteredMedia[activeMediaIndex].type === 'video' ? (
                filteredMedia[activeMediaIndex].url.includes('youtube') || filteredMedia[activeMediaIndex].url.includes('embed') ? (
                  <iframe
                    src={filteredMedia[activeMediaIndex].url}
                    title={filteredMedia[activeMediaIndex].title}
                    className="w-full aspect-video max-h-[65vh]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={filteredMedia[activeMediaIndex].url}
                    controls
                    autoPlay
                    className="w-full max-h-[65vh] object-contain"
                  />
                )
              ) : (
                <img
                  src={filteredMedia[activeMediaIndex].url}
                  alt={filteredMedia[activeMediaIndex].title}
                  className="w-full max-h-[65vh] object-contain"
                />
              )}
            </div>

            {/* Bottom Metadata Drawer */}
            <div className="p-5 sm:p-6 bg-[#25201e] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase">
                    {filteredMedia[activeMediaIndex].category}
                  </span>
                  <span className="text-xs text-stone-400">
                    {filteredMedia[activeMediaIndex].albumTitle || 'Official Collection'} • {filteredMedia[activeMediaIndex].date}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-serif font-black">
                  {filteredMedia[activeMediaIndex].title}
                </h4>
                <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                  {filteredMedia[activeMediaIndex].caption}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                <span className="text-stone-400 font-mono">
                  {activeMediaIndex + 1} of {filteredMedia.length}
                </span>
                <a
                  href={filteredMedia[activeMediaIndex].url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
