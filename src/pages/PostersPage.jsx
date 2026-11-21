import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Eye, Search, Filter, Folder, Image, FileText,
  Sparkles, CheckCircle, ArrowRight, X, ChevronRight, BookOpen,
  Award, Shield, FileCheck, Layers
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';

export default function PostersPage({
  onNavigateHome,
  onNavigateEvents,
  onNavigateGuests,
  onNavigateSchedule,
  onNavigateResults,
  onNavigateGallery
}) {
  // Public data from store
  const [publicPosters, setPublicPosters] = useState(() => festivalStore.getPublicPosters());
  const [publicTemplates, setPublicTemplates] = useState(() => festivalStore.getPublicPosterTemplates());
  const [categories, setCategories] = useState(() => festivalStore.getPosterCategories());

  // Filter & Search states
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'posters' | 'templates' | 'logos'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox Preview Modal
  const [selectedResource, setSelectedResource] = useState(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(null);

  // Subscribe to live festival store changes
  useEffect(() => {
    if (typeof festivalStore.subscribe === 'function') {
      const unsub = festivalStore.subscribe(() => {
        setPublicPosters(festivalStore.getPublicPosters());
        setPublicTemplates(festivalStore.getPublicPosterTemplates());
        setCategories(festivalStore.getPosterCategories());
      });
      return unsub;
    }
  }, []);

  // Official Brand Identity Kit
  const guidelinesAndBrandKits = useMemo(() => [
    {
      id: 'RES-LOGO-01',
      title: 'Official Dalenzia & Nueva Era Brand Identity Kit',
      category: 'Logos & Media',
      type: 'brand_kit',
      fileUrl: '/assets/brand/official_dalenzia_fest_gold.png',
      fileName: 'dalenzia_brand_assets_vector_pack.zip',
      fileSize: '4.9 MB',
      dimensions: 'ZIP (AI, SVG, PNG)',
      shortDescription: 'Original high-resolution vector logos, color palette codes, brand typography specifications, and lockups.',
      downloadsCount: 680
    }
  ], []);

  // Combined and filtered resources list
  const filteredResources = useMemo(() => {
    let combined = [];

    // Map posters into unified resource items
    const posterItems = publicPosters.map(p => ({
      ...p,
      type: 'poster',
      displayTag: `${p.dimensions || 'A3'} • ${p.fileSize || '3.5 MB'}`
    }));

    // Map templates into unified resource items
    const templateItems = publicTemplates.map(t => ({
      ...t,
      title: t.name,
      fileUrl: t.previewUrl,
      fileName: t.originalFileName,
      shortDescription: t.description,
      type: 'template',
      displayTag: `${t.softwareFormat} • ${t.fileSize}`
    }));

    if (activeTab === 'all') {
      combined = [...posterItems, ...templateItems, ...guidelinesAndBrandKits];
    } else if (activeTab === 'posters') {
      combined = posterItems;
    } else if (activeTab === 'templates') {
      combined = templateItems;
    } else if (activeTab === 'logos') {
      combined = guidelinesAndBrandKits.filter(r => r.category === 'Logos & Media');
    }

    // Filter by category if selected
    if (selectedCategory !== 'all') {
      combined = combined.filter(r => r.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      combined = combined.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.shortDescription && r.shortDescription.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q)) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return combined;
  }, [publicPosters, publicTemplates, guidelinesAndBrandKits, activeTab, selectedCategory, searchQuery]);

  // Handle Download Action
  const handleDownload = (item) => {
    if (item.type === 'poster') {
      festivalStore.incrementPosterDownload(item.id);
    } else if (item.type === 'template') {
      festivalStore.incrementTemplateDownload(item.id);
    }

    const link = document.createElement('a');
    link.href = item.fileUrl || item.originalFileUrl;
    link.download = item.fileName || `${item.title.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccessToast(`Downloading ${item.fileName || item.title}...`);
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] text-[#1c1917] font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {downloadSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#A91F35] text-white shadow-xl border border-[#E6A916]/40 text-xs font-bold"
          >
            <Download className="w-4 h-4 text-[#E6A916]" />
            {downloadSuccessToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3E9] via-[#F3ECE0] to-[#F7F3E9] pt-12 pb-12 border-b border-[#A91F35]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A91F35]/10 border border-[#A91F35]/20 text-xs font-extrabold uppercase tracking-widest text-[#A91F35]">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" /> DALENZIA FEST 2K26
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif text-[#1c1917] tracking-tight leading-none">
              Downloads
            </h1>

            <p className="text-sm md:text-base text-stone-600 font-medium leading-relaxed max-w-2xl">
              Official posters, templates, brand kits and visual media for Dalenzia Fest 2K26. Download high-resolution print folios, social media cards, and official identity files.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-stone-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A91F35]" />
                <span>{publicPosters.length} Official Posters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E6A916]" />
                <span>{publicTemplates.length} Master Templates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Verified 300 DPI Folios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Navigation Bar & Search */}
      <section className="sticky top-16 z-30 bg-[#F7F3E9]/95 backdrop-blur-md py-4 border-b border-[#A91F35]/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Main Resource Filter Pills (Matching Reference Model) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => { setActiveTab('all'); setSelectedCategory('all'); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> All Resources
              </button>

              <button
                onClick={() => setActiveTab('posters')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'posters'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <Image className="w-3.5 h-3.5" /> Posters ({publicPosters.length})
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <Folder className="w-3.5 h-3.5" /> Templates ({publicTemplates.length})
              </button>

              <button
                onClick={() => setActiveTab('logos')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'logos'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Logos & Media
              </button>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posters, templates, files..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-stone-300 text-stone-800 focus:outline-none focus:border-[#A91F35] shadow-xs"
              />
            </div>
          </div>

          {/* Sub-Category Filter Pills when on Posters tab */}
          {activeTab === 'posters' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#A91F35]/10">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">Categories:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#E6A916] text-[#1c1917]'
                    : 'bg-white/80 hover:bg-white text-stone-600'
                }`}
              >
                All
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === c.name
                      ? 'bg-[#E6A916] text-[#1c1917] font-bold'
                      : 'bg-white/80 hover:bg-white text-stone-600'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Grid Section (Matching Reference Model Cards) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {filteredResources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800 font-serif">No Resources Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No published files match your current category or keyword criteria. Try clearing filters.
            </p>
            <button
              onClick={() => { setActiveTab('all'); setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 text-xs font-bold text-[#A91F35] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Thumbnail & Lightbox Trigger */}
                  <div
                    onClick={() => setSelectedResource(item)}
                    className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold text-white bg-[#A91F35]/90 px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-3 rounded-full bg-white text-stone-900 shadow-lg transform group-hover:scale-110 transition-transform">
                        <Eye className="w-5 h-5 text-[#A91F35]" />
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#A91F35] transition-colors line-clamp-1 font-serif">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Details & Download Button (Reference Model Style) */}
                <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] font-bold text-stone-600">
                    <span>{item.displayTag || `${item.dimensions || 'A4'} • ${item.fileSize}`}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(item)}
                    className="w-9 h-9 rounded-xl bg-[#A91F35] hover:bg-[#8E1B2D] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
                    title={`Download ${item.title}`}
                  >
                    <Download className="w-4 h-4 text-[#E6A916]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox / Resource Preview Modal */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 my-8 flex flex-col md:flex-row max-h-[88vh]"
            >
              {/* Visual Preview */}
              <div className="md:w-1/2 bg-stone-900 p-6 flex items-center justify-center relative min-h-[300px]">
                <img
                  src={selectedResource.fileUrl}
                  alt={selectedResource.title}
                  className="max-h-[65vh] w-auto object-contain rounded-lg shadow-xl"
                />
                <span className="absolute top-4 left-4 text-xs font-bold text-white bg-[#A91F35] px-2.5 py-1 rounded">
                  {selectedResource.category}
                </span>
              </div>

              {/* Details & Download Button */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-mono font-bold text-stone-400">{selectedResource.id}</span>
                    <button onClick={() => setSelectedResource(null)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-stone-900 font-serif leading-tight">
                      {selectedResource.title}
                    </h2>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {selectedResource.shortDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">File Format</span>
                      <span className="font-bold text-stone-800">{selectedResource.fileType || selectedResource.softwareFormat || 'Graphic Folio'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">File Size</span>
                      <span className="font-bold text-stone-800">{selectedResource.fileSize}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">Dimensions</span>
                      <span className="font-bold text-stone-800">{selectedResource.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">Downloads</span>
                      <span className="font-bold text-stone-800">{selectedResource.downloadsCount || 0} times</span>
                    </div>
                  </div>

                  {selectedResource.relatedProgrammeTitle && (
                    <div className="p-3 rounded-lg bg-red-50/60 border border-red-100 text-xs">
                      <span className="text-[10px] text-[#A91F35] font-bold uppercase block">Related Festival Event</span>
                      <p className="font-bold text-stone-800 mt-0.5">{selectedResource.relatedProgrammeTitle}</p>
                    </div>
                  )}

                  {selectedResource.relatedCompetitionTitle && (
                    <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 text-xs">
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">Related Competition</span>
                      <p className="font-bold text-stone-800 mt-0.5">{selectedResource.relatedCompetitionTitle}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <button
                    onClick={() => {
                      handleDownload(selectedResource);
                      setSelectedResource(null);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#A91F35] hover:bg-[#8E1B2D] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#E6A916]" /> Download Original File
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
