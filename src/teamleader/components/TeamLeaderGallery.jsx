import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Film,
  Search,
  Filter,
  Eye,
  X,
  Sparkles
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderGallery() {
  const [albums, setAlbums] = useState(() => festivalStore.getGalleryAlbums());
  const [mediaList, setMediaList] = useState(() => festivalStore.getGalleryMedia());
  const [selectedAlbumId, setSelectedAlbumId] = useState('all');
  const [previewMedia, setPreviewMedia] = useState(null);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setAlbums(festivalStore.getGalleryAlbums());
      setMediaList(festivalStore.getGalleryMedia());
    });
    return () => unsub();
  }, []);

  const filteredMedia = mediaList.filter(m => {
    const matchAlbum = selectedAlbumId === 'all' || m.albumId === selectedAlbumId;
    return matchAlbum && (m.status === 'Published' || !m.status);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Festival Media Archive
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Festival Gallery & Historical Media
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Official photographic moments, stage inaugurations, cultural ensembles, and prize distribution ceremonies.
          </p>
        </div>
      </div>

      {/* Album Filter Buttons */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setSelectedAlbumId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedAlbumId === 'all' ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          All Media ({filteredMedia.length})
        </button>
        {albums.map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedAlbumId(a.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedAlbumId === a.id ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {a.title}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            No published media items in this album.
          </div>
        ) : (
          filteredMedia.map(item => (
            <div
              key={item.id}
              onClick={() => setPreviewMedia(item)}
              className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-4/3 bg-stone-100 relative overflow-hidden flex items-center justify-center">
                {item.type === 'video' ? (
                  <Film className="w-10 h-10 text-stone-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <img
                    src={item.url || '/assets/dalenzia_fest_logo.png'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = '/assets/dalenzia_fest_logo.png'; }}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  View Media
                </div>
              </div>

              <div className="p-3.5 space-y-0.5">
                <div className="text-xs font-bold text-stone-900 truncate">{item.title}</div>
                <div className="text-[10px] text-stone-500">{item.albumTitle || 'Festival Gallery'}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200"
            >
              <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-sm">{previewMedia.title}</h3>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-1 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-16/9 bg-black flex items-center justify-center p-2">
                <img
                  src={previewMedia.url || '/assets/dalenzia_fest_logo.png'}
                  alt={previewMedia.title}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => { e.target.src = '/assets/dalenzia_fest_logo.png'; }}
                />
              </div>

              <div className="p-4 bg-white text-xs text-stone-600 flex justify-between items-center">
                <span>{previewMedia.caption || 'Official DALENZIA FEST 2K26 media item.'}</span>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
