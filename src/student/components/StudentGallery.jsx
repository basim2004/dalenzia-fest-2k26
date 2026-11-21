import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, Eye, Download, X, Film,
  Calendar, MapPin, Sparkles, Filter
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentGallery() {
  const [albums, setAlbums] = useState([]);
  const [media, setMedia] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    try {
      setAlbums(festivalStore.getGalleryAlbums());
      setMedia(festivalStore.getGalleryMedia());
    } catch (e) {
      console.error(e);
    }
  }, []);

  const filteredMedia = media.filter((m) => {
    if (selectedAlbum === 'all') return true;
    return m.albumId === selectedAlbum;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Festival Media Gallery
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Published photography, stage arenas, and cultural conclave captures from Dalenzia Fest 2K26.
          </p>
        </div>

        {/* Album Selector */}
        <select
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
        >
          <option value="all">All Albums ({media.length} items)</option>
          {albums.map((alb) => (
            <option key={alb.id} value={alb.id}>
              {alb.title}
            </option>
          ))}
        </select>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-2xs cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="aspect-4/3 bg-stone-100 overflow-hidden relative">
              <img
                src={item.url || '/assets/dalenzia_fest_logo.png'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/assets/dalenzia_fest_logo.png';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[9px] font-bold backdrop-blur-xs">
                {item.type === 'video' ? 'Video' : 'Photo'}
              </span>
            </div>

            <div className="p-3">
              <div className="text-xs font-bold text-stone-900 truncate">
                {item.title}
              </div>
              <div className="text-[10px] text-stone-400 truncate mt-0.5">
                {item.caption || item.date || 'Dalenzia Fest 2K26'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[60vh] bg-stone-900 flex items-center justify-center">
                <img
                  src={activeMedia.url || '/assets/dalenzia_fest_logo.png'}
                  alt={activeMedia.title}
                  className="max-h-[60vh] w-auto object-contain"
                  onError={(e) => {
                    e.target.src = '/assets/dalenzia_fest_logo.png';
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="font-serif font-black text-lg text-stone-900">
                  {activeMedia.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  {activeMedia.caption || 'Captured at Dalenzia Fest 2K26 – Nueva Era'}
                </p>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <span>Category: <strong>{activeMedia.category || 'Official Coverage'}</strong></span>
                  <span>Date: {activeMedia.date || 'Dec 2026'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
