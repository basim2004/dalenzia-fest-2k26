import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Image, Video, Plus, Edit2, Trash2, Eye, Download, RefreshCw,
  Sparkles, CheckCircle2, FolderPlus, Folder, Play, Film, Camera,
  Layers, Calendar, CalendarDays, Search, Filter, Clock, ArrowRight,
  ChevronRight, ChevronLeft, X, ExternalLink, Maximize2, SlidersHorizontal,
  Archive, RotateCcw, FileText, Check, AlertTriangle, Grid, List,
  Tag, Award, Upload, ArrowUpRight, HelpCircle
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

const CATEGORIES = [
  'Inauguration',
  'Programmes',
  'Competitions',
  'Guests',
  'Stage Events',
  'Prize Distribution',
  'Festival Moments',
  'Behind the Scenes',
  'Other'
];

const FESTIVAL_DATES = [
  { value: 'Dec 21, 2026', label: 'Day 01 · Monday, Dec 21, 2026' },
  { value: 'Dec 22, 2026', label: 'Day 02 · Tuesday, Dec 22, 2026' }
];

export default function GalleryModule({ activeSection }) {
  // Navigation tabs: 'dashboard' | 'albums' | 'media' | 'upload'
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('album')) return 'albums';
      if (hash.includes('all') || hash.includes('media')) return 'media';
      if (hash.includes('upload')) return 'upload';
    }
    return 'dashboard';
  });

  // Store data states
  const [albums, setAlbums] = useState(() => festivalStore.getGalleryAlbums({ includeArchived: true }));
  const [mediaList, setMediaList] = useState(() => festivalStore.getGalleryMedia({ includeArchived: true }).media);
  const [stats, setStats] = useState(() => festivalStore.getGalleryDashboardStats());
  const [programmes, setProgrammes] = useState(() => festivalStore.getProgrammes());
  const [competitions, setCompetitions] = useState(() => festivalStore.getCompetitions());

  // Active Album Drill-Down (null = viewing all albums)
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  // Filters state for Media Vault
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [albumFilter, setAlbumFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  // Modals state
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxMediaIndex, setLightboxMediaIndex] = useState(0);

  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'album'|'media', id: string, title: string, hasMedia: boolean }

  // Upload Desk Form State
  const [uploadType, setUploadType] = useState('photo'); // 'photo' | 'video'
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    caption: '',
    albumId: '',
    category: 'Festival Moments',
    date: 'Dec 21, 2026',
    relatedProgrammeId: '',
    relatedCompetitionId: '',
    videoUrl: '',
    thumbnailUrl: '',
    status: 'Published'
  });

  // Album Form State
  const [albumFormData, setAlbumFormData] = useState({
    title: '',
    description: '',
    date: 'Dec 21, 2026',
    category: 'Inauguration',
    coverImage: '/assets/main_poster.jpg',
    displayOrder: 1,
    status: 'Published'
  });

  // Refresh all data
  const refreshData = () => {
    setAlbums(festivalStore.getGalleryAlbums({ includeArchived: true }));
    setMediaList(festivalStore.getGalleryMedia({ includeArchived: true }).media);
    setStats(festivalStore.getGalleryDashboardStats());
    setProgrammes(festivalStore.getProgrammes());
    setCompetitions(festivalStore.getCompetitions());
  };

  // Subscribe to store updates
  useEffect(() => {
    if (typeof festivalStore.subscribe === 'function') {
      const unsub = festivalStore.subscribe(() => {
        refreshData();
      });
      return unsub;
    }
  }, []);

  // Filtered media list
  const filteredMedia = useMemo(() => {
    return festivalStore.getGalleryMedia({
      albumId: selectedAlbumId || albumFilter,
      type: mediaTypeFilter,
      status: statusFilter,
      category: categoryFilter,
      date: dateFilter,
      query: searchQuery,
      sortBy,
      includeArchived: statusFilter === 'Archived' || statusFilter === 'all'
    }).media;
  }, [selectedAlbumId, albumFilter, mediaTypeFilter, statusFilter, categoryFilter, dateFilter, searchQuery, sortBy, mediaList]);

  // Selected album object
  const activeAlbumObj = useMemo(() => {
    if (!selectedAlbumId) return null;
    return festivalStore.getGalleryAlbumById(selectedAlbumId);
  }, [selectedAlbumId, albums, mediaList]);

  // Handle open album modal
  const handleOpenAlbumModal = (album = null) => {
    if (album) {
      setEditingAlbum(album);
      setAlbumFormData({
        title: album.title,
        description: album.description || '',
        date: album.date || 'Dec 21, 2026',
        category: album.category || 'Inauguration',
        coverImage: album.coverImage || '/assets/main_poster.jpg',
        displayOrder: album.displayOrder || 1,
        status: album.status || 'Published'
      });
    } else {
      setEditingAlbum(null);
      setAlbumFormData({
        title: '',
        description: '',
        date: 'Dec 21, 2026',
        category: 'Inauguration',
        coverImage: '/assets/main_poster.jpg',
        displayOrder: albums.length + 1,
        status: 'Published'
      });
    }
    setIsAlbumModalOpen(true);
  };

  // Save album
  const handleSaveAlbum = (e) => {
    e.preventDefault();
    if (!albumFormData.title.trim()) return;

    try {
      if (editingAlbum) {
        festivalStore.updateGalleryAlbum(editingAlbum.id, albumFormData, 'Super Admin');
      } else {
        festivalStore.addGalleryAlbum(albumFormData, 'Super Admin');
      }
      refreshData();
      setIsAlbumModalOpen(false);
    } catch (err) {
      alert(err.message || 'Error saving album.');
    }
  };

  // Handle open media edit modal
  const handleOpenEditMedia = (media) => {
    setEditingMedia(media);
    setUploadFormData({
      title: media.title,
      caption: media.caption || '',
      albumId: media.albumId || '',
      category: media.category || 'Festival Moments',
      date: media.date || 'Dec 21, 2026',
      relatedProgrammeId: media.relatedProgrammeId || '',
      relatedCompetitionId: media.relatedCompetitionId || '',
      videoUrl: media.url,
      thumbnailUrl: media.thumbnailUrl || media.url,
      status: media.status || 'Published'
    });
    setIsMediaModalOpen(true);
  };

  // Save media edit
  const handleSaveMediaEdit = (e) => {
    e.preventDefault();
    if (!editingMedia || !uploadFormData.title.trim()) return;

    try {
      festivalStore.updateGalleryMedia(editingMedia.id, {
        title: uploadFormData.title,
        caption: uploadFormData.caption,
        albumId: uploadFormData.albumId || null,
        category: uploadFormData.category,
        date: uploadFormData.date,
        relatedProgrammeId: uploadFormData.relatedProgrammeId || null,
        relatedCompetitionId: uploadFormData.relatedCompetitionId || null,
        status: uploadFormData.status
      }, 'Super Admin');
      refreshData();
      setIsMediaModalOpen(false);
    } catch (err) {
      alert(err.message || 'Error updating media.');
    }
  };

  // Handle multiple file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate size (max 10MB per file) and formats
    const validFiles = [];
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm'];

    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(ext)) {
        alert(`Skipped ${file.name}: unsupported format .${ext}`);
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        alert(`Skipped ${file.name}: file size exceeds 25MB`);
        return;
      }

      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);
      validFiles.push({
        file,
        previewUrl,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type.startsWith('video/') ? 'video' : 'photo'
      });
    });

    setUploadFiles(prev => [...prev, ...validFiles]);
  };

  // Handle batch file upload execution
  const handleExecuteUpload = () => {
    if (uploadType === 'photo' && uploadFiles.length === 0) {
      alert('Please select at least one image file.');
      return;
    }
    if (uploadType === 'video' && !uploadFormData.videoUrl.trim() && uploadFiles.length === 0) {
      alert('Please enter a video URL or select a video file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // Simulate progress and store save
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      try {
        if (uploadType === 'photo') {
          // Batch add photo files
          uploadFiles.forEach((f, idx) => {
            festivalStore.addGalleryMedia({
              title: uploadFiles.length === 1 && uploadFormData.title.trim()
                ? uploadFormData.title.trim()
                : (uploadFormData.title.trim() ? `${uploadFormData.title.trim()} (#${idx + 1})` : f.name.replace(/\.[^/.]+$/, "")),
              type: 'photo',
              url: f.previewUrl,
              thumbnailUrl: f.previewUrl,
              caption: uploadFormData.caption || '',
              albumId: uploadFormData.albumId || selectedAlbumId || null,
              category: uploadFormData.category || 'Festival Moments',
              date: uploadFormData.date || 'Dec 21, 2026',
              relatedProgrammeId: uploadFormData.relatedProgrammeId || null,
              relatedCompetitionId: uploadFormData.relatedCompetitionId || null,
              fileSize: f.size,
              dimensions: '1920x1080',
              status: uploadFormData.status || 'Published'
            }, 'Super Admin');
          });
        } else {
          // Video upload / external video link
          const videoSource = uploadFiles.length > 0 ? uploadFiles[0].previewUrl : uploadFormData.videoUrl.trim();
          festivalStore.addGalleryMedia({
            title: uploadFormData.title.trim() || 'Festival Video Broadcast',
            type: 'video',
            url: videoSource,
            thumbnailUrl: uploadFormData.thumbnailUrl.trim() || '/assets/main_poster.jpg',
            caption: uploadFormData.caption || '',
            albumId: uploadFormData.albumId || selectedAlbumId || null,
            category: uploadFormData.category || 'Festival Moments',
            date: uploadFormData.date || 'Dec 21, 2026',
            relatedProgrammeId: uploadFormData.relatedProgrammeId || null,
            relatedCompetitionId: uploadFormData.relatedCompetitionId || null,
            fileSize: uploadFiles.length > 0 ? uploadFiles[0].size : 'External Stream',
            dimensions: '1080p HD',
            status: uploadFormData.status || 'Published'
          }, 'Super Admin');
        }

        refreshData();
        setIsUploading(false);
        setUploadProgress(0);
        setUploadFiles([]);
        setUploadSuccessMsg(`Successfully uploaded and registered ${uploadType === 'photo' ? uploadFiles.length + ' photos' : '1 video'} into the gallery.`);
        setTimeout(() => setUploadSuccessMsg(''), 4000);
      } catch (err) {
        setIsUploading(false);
        alert(err.message || 'Error processing media upload.');
      }
    }, 1000);
  };

  // Open Lightbox
  const handleOpenLightbox = (mediaItem) => {
    const idx = filteredMedia.findIndex(m => m.id === mediaItem.id);
    setLightboxMediaIndex(idx !== -1 ? idx : 0);
    setIsLightboxOpen(true);
  };

  // Lightbox Navigation
  const handlePrevMedia = () => {
    setLightboxMediaIndex(prev => (prev > 0 ? prev - 1 : filteredMedia.length - 1));
  };
  const handleNextMedia = () => {
    setLightboxMediaIndex(prev => (prev < filteredMedia.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevMedia();
      if (e.key === 'ArrowRight') handleNextMedia();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, filteredMedia]);

  // Handle CSV Export
  const handleExportCSV = () => {
    const headers = ['Media ID', 'Title', 'Type', 'Album', 'Category', 'Date', 'Programme', 'Status', 'File Size'];
    const rows = mediaList.map(m => [
      `"${m.id}"`,
      `"${(m.title || '').replace(/"/g, '""')}"`,
      `"${m.type}"`,
      `"${(m.albumTitle || 'Unassigned').replace(/"/g, '""')}"`,
      `"${m.category || ''}"`,
      `"${m.date || ''}"`,
      `"${(m.relatedProgrammeTitle || 'None').replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${m.fileSize || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dalenzia_fest_2k26_media_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Destructive Action Confirmation Handler
  const handleExecuteDelete = () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'album') {
        // Safe unlink: does not destroy original media
        festivalStore.deleteGalleryAlbum(deleteConfirm.id, { deleteMedia: false, adminUser: 'Super Admin' });
        if (selectedAlbumId === deleteConfirm.id) setSelectedAlbumId(null);
      } else if (deleteConfirm.type === 'media') {
        festivalStore.deleteGalleryMedia(deleteConfirm.id, { adminUser: 'Super Admin' });
      }
      refreshData();
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">

      {/* ========================================================================= */}
      {/* 1. HERO BANNER WITH BRAND COLORS & SUB-NAV                                */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#A91F35] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-36 -top-16 w-48 h-48 rounded-full bg-[#E6A916]/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-sm border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>OFFICIAL FESTIVAL MEDIA VAULT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
              Festival Gallery Management
            </h2>
            <p className="text-sm text-stone-200 max-w-2xl font-normal leading-relaxed">
              Curate official photographic albums, video broadcasts, arena moments, and synchronize live media assets with the public Dalenzia Fest 2K26 website.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('upload');
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#E6A916] hover:bg-[#d4980f] text-[#A91F35] font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Media</span>
            </button>

            <button
              onClick={() => handleOpenAlbumModal()}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Album</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              title="Export complete media catalog to CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={refreshData}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Refresh Gallery Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Primary Navigation Tabs */}
        <div className="relative z-10 flex items-center gap-2 mt-8 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedAlbumId(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gallery Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('albums');
              setSelectedAlbumId(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'albums'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Album Showcase ({albums.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('media');
              setSelectedAlbumId(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>All Media Vault ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-[#A91F35] shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Media Upload Desk</span>
          </button>
        </div>
      </div>

      {/* Upload Success Banner */}
      {uploadSuccessMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs font-bold text-emerald-800">{uploadSuccessMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB 1: GALLERY DASHBOARD                                               */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 6 Metric KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">TOTAL MEDIA</span>
                <div className="w-8 h-8 rounded-xl bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-serif">
                  {stats.totalMediaFiles}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Assets in Vault</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">PHOTOS</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-blue-800 font-serif">
                  {stats.totalPhotos}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">High-Res Stills</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">VIDEOS</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-amber-800 font-serif">
                  {stats.totalVideos}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Reels & Broadcasts</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">TOTAL ALBUMS</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Folder className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-purple-800 font-serif">
                  {stats.totalAlbums}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Curated Folios</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">PUBLISHED</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-serif">
                  {stats.publishedMedia}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Live On Website</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">PENDING / DRAFT</span>
                <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-stone-800 font-serif">
                  {stats.pendingApproval}
                </span>
                <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Under Curation</p>
              </div>
            </div>

          </div>

          {/* Two-Column Section: Recently Updated Albums & Recent Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Recently Updated Albums (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-serif font-black text-stone-900">
                    Recently Updated Albums
                  </h3>
                  <p className="text-xs text-stone-500">
                    Curated collections reflecting latest additions and timeline broadcasts
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('albums')}
                  className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>All Albums</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {stats.recentlyUpdatedAlbums.map(album => (
                  <div
                    key={album.id}
                    className="p-3 rounded-2xl bg-[#FAF7F0] border border-stone-200/60 flex items-center justify-between gap-4 hover:border-[#A91F35]/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0 border border-stone-300">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {album.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 font-medium">
                          <span className="px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700 text-[10px] font-semibold">
                            {album.category}
                          </span>
                          <span>•</span>
                          <span>{album.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#A91F35]">
                          {album.mediaCount} Assets
                        </span>
                        <div className="text-[10px] text-stone-400 font-semibold">
                          {album.photoCount}P / {album.videoCount}V
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedAlbumId(album.id);
                          setActiveTab('albums');
                        }}
                        className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
                        title="Open Album"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Recent Media Uploads (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base font-serif font-black text-stone-900">
                    Latest Uploaded Media
                  </h3>
                  <p className="text-xs text-stone-500">
                    Most recent photographic and video files captured
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('media')}
                  className="text-xs font-bold text-[#A91F35] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {stats.recentUploads.map(media => (
                  <div
                    key={media.id}
                    className="p-2.5 rounded-2xl bg-[#FAF7F0] border border-stone-200/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-stone-300">
                        <img
                          src={media.thumbnailUrl || media.url}
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                        {media.type === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {media.title}
                        </h4>
                        <p className="text-[10px] text-stone-500 truncate">
                          {media.albumTitle || 'Unassigned Album'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenLightbox(media)}
                        className="p-1.5 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditMedia(media)}
                        className="p-1.5 rounded-lg bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                        title="Edit Info"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: ALBUMS SHOWCASE (OR ALBUM DETAIL DRILL-DOWN)                     */}
      {/* ========================================================================= */}
      {activeTab === 'albums' && (
        <div className="space-y-6">
          
          {/* If an album is selected for drill-down */}
          {selectedAlbumId && activeAlbumObj ? (
            <div className="space-y-6">
              {/* Back to Albums Bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedAlbumId(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to All Albums</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAlbumModal(activeAlbumObj)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#A91F35]" />
                    <span>Edit Album</span>
                  </button>
                  <button
                    onClick={() => {
                      setUploadFormData(prev => ({ ...prev, albumId: selectedAlbumId }));
                      setActiveTab('upload');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8e172a] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Media to Album</span>
                  </button>
                </div>
              </div>

              {/* Album Hero Showcase Card */}
              <div className="rounded-3xl bg-white border border-stone-200/80 overflow-hidden shadow-xs">
                <div className="relative h-64 sm:h-72 w-full bg-stone-900">
                  <img
                    src={activeAlbumObj.coverImage}
                    alt={activeAlbumObj.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase tracking-wider">
                        {activeAlbumObj.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold">
                        {activeAlbumObj.date}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        activeAlbumObj.status === 'Published' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'
                      }`}>
                        {activeAlbumObj.status}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-black">
                      {activeAlbumObj.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-200 max-w-3xl mt-1.5 leading-relaxed font-normal">
                      {activeAlbumObj.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-semibold text-stone-300">
                      <span>📸 {activeAlbumObj.photoCount} Photos</span>
                      <span>🎬 {activeAlbumObj.videoCount} Videos</span>
                      <span>Total: {activeAlbumObj.mediaCount} Assets</span>
                    </div>
                  </div>
                </div>

                {/* Album Media Grid */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="text-sm font-bold text-stone-800">
                      Media Items in this Album ({activeAlbumObj.media.length})
                    </h4>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Drag or reorder, unassign or preview assets
                    </span>
                  </div>

                  {activeAlbumObj.media.length === 0 ? (
                    <div className="text-center py-12 bg-[#FAF7F0] rounded-2xl border border-dashed border-stone-300">
                      <Image className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-stone-700">No media in this album yet</h4>
                      <p className="text-xs text-stone-500 mt-1">Upload or assign photos and videos to this album.</p>
                      <button
                        onClick={() => {
                          setUploadFormData(prev => ({ ...prev, albumId: selectedAlbumId }));
                          setActiveTab('upload');
                        }}
                        className="mt-4 px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8e172a] cursor-pointer"
                      >
                        Upload to Album
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {activeAlbumObj.media.map(media => (
                        <div
                          key={media.id}
                          className="group relative bg-[#FAF7F0] rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div className="relative aspect-video bg-black overflow-hidden">
                            <img
                              src={media.thumbnailUrl || media.url}
                              alt={media.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {media.type === 'video' && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-6 h-6 text-white fill-white" />
                              </div>
                            )}
                            {/* Overlay hover buttons */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                              <button
                                onClick={() => handleOpenLightbox(media)}
                                className="p-2 rounded-xl bg-white text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shadow-md"
                                title="Full Preview"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEditMedia(media)}
                                className="p-2 rounded-xl bg-white text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer shadow-md"
                                title="Edit Info"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => festivalStore.removeMediaFromAlbum(media.id, 'Super Admin')}
                                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-md"
                                title="Remove from Album (File is kept)"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="p-3">
                            <h5 className="text-xs font-bold text-stone-900 truncate">
                              {media.title}
                            </h5>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500 font-medium">
                              <span className="capitalize">{media.type} • {media.fileSize}</span>
                              <span className={media.status === 'Published' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                                {media.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Album Grid List */
            <div className="space-y-6">
              {/* Albums Top Actions & Counters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
                <div>
                  <h3 className="text-base font-serif font-black text-stone-900">
                    Official Festival Albums ({albums.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Structured photo and video collections categorized for the public website and administrative records
                  </p>
                </div>
                <button
                  onClick={() => handleOpenAlbumModal()}
                  className="px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8e172a] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create New Album</span>
                </button>
              </div>

              {/* Albums Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map(album => (
                  <div
                    key={album.id}
                    className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 sm:h-52 bg-stone-900 overflow-hidden cursor-pointer" onClick={() => setSelectedAlbumId(album.id)}>
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase">
                            {album.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold">
                            {album.date}
                          </span>
                        </div>
                        <h4 className="text-base font-serif font-black text-white leading-tight line-clamp-1">
                          {album.title}
                        </h4>
                      </div>

                      {/* Status badge in top-right */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm ${
                          album.status === 'Published'
                            ? 'bg-emerald-500 text-white'
                            : album.status === 'Archived'
                            ? 'bg-stone-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {album.status}
                        </span>
                      </div>
                    </div>

                    {/* Album Info & Action Buttons */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
                        {album.description || 'No description provided.'}
                      </p>

                      <div className="space-y-3 pt-2 border-t border-stone-100">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                          <span>{album.mediaCount} Media Assets</span>
                          <span>{album.photoCount} Photos • {album.videoCount} Videos</span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setSelectedAlbumId(album.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#A91F35]/10 hover:bg-[#A91F35] text-[#A91F35] hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Open Album</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenAlbumModal(album)}
                            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                            title="Edit Album"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              festivalStore.publishGalleryAlbum(album.id, album.status !== 'Published', 'Super Admin');
                              refreshData();
                            }}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              album.status === 'Published'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                            title={album.status === 'Published' ? 'Unpublish Album' : 'Publish Album'}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirm({
                              type: 'album',
                              id: album.id,
                              title: album.title,
                              hasMedia: album.mediaCount > 0
                            })}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Delete Album (Media will be unassigned safely)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: ALL MEDIA VAULT                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          
          {/* Search, Filter and Actions Toolbar */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search media by title, caption, album, category..."
                  className="w-full bg-[#FAF7F0] pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quick Type Selectors */}
              <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-2xl border border-stone-200">
                <button
                  onClick={() => setMediaTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mediaTypeFilter === 'all'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({mediaList.length})
                </button>
                <button
                  onClick={() => setMediaTypeFilter('photo')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaTypeFilter === 'photo'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photos ({stats.totalPhotos})</span>
                </button>
                <button
                  onClick={() => setMediaTypeFilter('video')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mediaTypeFilter === 'video'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Videos ({stats.totalVideos})</span>
                </button>
              </div>

            </div>

            {/* Sub-Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100 text-xs">
              
              {/* Album filter */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Album
                </label>
                <select
                  value={albumFilter}
                  onChange={(e) => setAlbumFilter(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  <option value="all">All Albums</option>
                  <option value="unassigned">Unassigned Media</option>
                  {albums.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              {/* Category filter */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="Published">Published Only</option>
                  <option value="Draft">Draft / Pending</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Sort by */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#FAF7F0] p-2 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  <option value="order">Display Order</option>
                  <option value="newest">Newest Uploads</option>
                  <option value="oldest">Oldest Uploads</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Media Grid Cards */}
          {filteredMedia.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-3">
              <Image className="w-12 h-12 text-stone-400 mx-auto" />
              <h4 className="text-base font-bold text-stone-800">No media matches your filter criteria</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try resetting your filters or search terms to see available photographic and video records.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMediaTypeFilter('all');
                  setAlbumFilter('all');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMedia.map(media => (
                <div
                  key={media.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Media Thumbnail */}
                  <div className="relative aspect-video bg-black overflow-hidden cursor-pointer" onClick={() => handleOpenLightbox(media)}>
                    <img
                      src={media.thumbnailUrl || media.url}
                      alt={media.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {media.type === 'video' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-7 h-7 text-white fill-white shadow-md" />
                      </div>
                    )}

                    {/* Top status & type tags */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase flex items-center gap-1">
                        {media.type === 'video' ? <Film className="w-2.5 h-2.5 text-[#E6A916]" /> : <Camera className="w-2.5 h-2.5 text-[#E6A916]" />}
                        <span>{media.type}</span>
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow-sm ${
                        media.status === 'Published'
                          ? 'bg-emerald-500 text-white'
                          : media.status === 'Archived'
                          ? 'bg-stone-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {media.status}
                      </span>
                    </div>

                    {/* Hover action overlay */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLightbox(media);
                        }}
                        className="p-2 rounded-xl bg-white text-stone-900 hover:bg-stone-100 transition-colors shadow-md"
                        title="View Full Preview"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditMedia(media);
                        }}
                        className="p-2 rounded-xl bg-white text-stone-900 hover:bg-stone-100 transition-colors shadow-md"
                        title="Edit Info"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({
                            type: 'media',
                            id: media.id,
                            title: media.title,
                            hasMedia: false
                          });
                        }}
                        className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md"
                        title="Delete Media"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1" title={media.title}>
                        {media.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-normal">
                        {media.caption || 'No caption available.'}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-stone-100 text-[10px]">
                      <div className="flex items-center justify-between text-stone-500">
                        <span className="font-semibold truncate max-w-[120px] text-stone-700">
                          📁 {media.albumTitle || 'Unassigned'}
                        </span>
                        <span>{media.date}</span>
                      </div>

                      {media.relatedProgrammeTitle && (
                        <div className="text-[#A91F35] font-bold truncate" title={media.relatedProgrammeTitle}>
                          🏛 {media.relatedProgrammeTitle}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 4: MEDIA UPLOAD DESK                                               */}
      {/* ========================================================================= */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
            
            {/* Header */}
            <div className="border-b border-stone-100 pb-4">
              <h3 className="text-lg font-serif font-black text-stone-900">
                Media Ingestion & Upload Desk
              </h3>
              <p className="text-xs text-stone-500">
                Upload batch photographs or register official video broadcasts directly to the Dalenzia Fest 2K26 vault
              </p>
            </div>

            {/* Upload Type Selector: Photo vs Video */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUploadType('photo')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  uploadType === 'photo'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-[#FAF7F0] text-stone-700 border border-stone-300 hover:bg-stone-100'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Upload Photos (JPG, PNG, WebP)</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadType('video')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  uploadType === 'video'
                    ? 'bg-[#A91F35] text-white shadow-md'
                    : 'bg-[#FAF7F0] text-stone-700 border border-stone-300 hover:bg-stone-100'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Add Video Broadcast (MP4 / Stream URL)</span>
              </button>
            </div>

            {/* Photo Dropzone / File Selector */}
            {uploadType === 'photo' ? (
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-[#A91F35]/30 hover:border-[#A91F35] bg-[#FAF7F0] text-center cursor-pointer transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#A91F35]/10 group-hover:bg-[#A91F35] text-[#A91F35] group-hover:text-white flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">
                    Click to select photos or drag and drop images here
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports JPG, JPEG, PNG, WebP • Maximum 25MB per file • Batch uploads supported
                  </p>
                </div>

                {/* Selected Files Preview Strip */}
                {uploadFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">
                        {uploadFiles.length} file(s) ready to upload:
                      </span>
                      <button
                        onClick={() => setUploadFiles([])}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {uploadFiles.map((f, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden aspect-video bg-stone-900 border border-stone-200 group">
                          <img src={f.previewUrl} alt={f.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setUploadFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">
                            {f.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Video Input Configuration */
              <div className="p-6 rounded-3xl bg-[#FAF7F0] border border-stone-200/80 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Video File or Streaming URL (YouTube / Vimeo / Cloud MP4) *
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.videoUrl}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="e.g. /assets/teaser.mp4 or https://www.youtube.com/embed/..."
                    className="w-full bg-white p-3 rounded-2xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Direct festival video assets like <code className="bg-stone-200 px-1 py-0.5 rounded">/assets/teaser.mp4</code> or standard external embed links are supported.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Video Thumbnail Image URL
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.thumbnailUrl}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    placeholder="e.g. /assets/gallery/cover.jpg"
                    className="w-full bg-white p-3 rounded-2xl border border-stone-300 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                  />
                </div>
              </div>
            )}

            {/* Metadata Fields Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
              
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Media Title {uploadFiles.length > 1 && '(Base Title for Batch)'} *
                </label>
                <input
                  type="text"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Grand Inauguration Ceremonial Moments"
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Assign to Album
                </label>
                <select
                  value={uploadFormData.albumId}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, albumId: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  <option value="">Leave Unassigned</option>
                  {albums.map(a => (
                    <option key={a.id} value={a.id}>{a.title} ({a.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={uploadFormData.category}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Festival Date
                </label>
                <select
                  value={uploadFormData.date}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  {FESTIVAL_DATES.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Related Programme (Optional)
                </label>
                <select
                  value={uploadFormData.relatedProgrammeId}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, relatedProgrammeId: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  <option value="">None</option>
                  {programmes.map(p => (
                    <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={uploadFormData.status}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800"
                >
                  <option value="Published">Published (Public Website Live)</option>
                  <option value="Draft">Draft / Pending Curation</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={uploadFormData.caption}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Enter historical context, dignitary actions, or arena details..."
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-800 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Uploading files to Firebase Storage & Data Vault...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-[#A91F35] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Upload Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={isUploading}
                onClick={handleExecuteUpload}
                className="px-6 py-3 rounded-2xl bg-[#A91F35] hover:bg-[#8e172a] text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading Media...' : 'Execute Media Upload'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALS: ALBUM CREATE/EDIT                                              */}
      {/* ========================================================================= */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#A91F35]" />
                <h3 className="text-base font-serif font-black text-stone-900">
                  {editingAlbum ? 'Edit Gallery Album' : 'Create New Album'}
                </h3>
              </div>
              <button
                onClick={() => setIsAlbumModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-700 mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={albumFormData.title}
                  onChange={(e) => setAlbumFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Grand Valedictory & Award Ceremony"
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={albumFormData.description}
                  onChange={(e) => setAlbumFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the context and highlights of this collection..."
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Category</label>
                  <select
                    value={albumFormData.category}
                    onChange={(e) => setAlbumFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Festival Date</label>
                  <select
                    value={albumFormData.date}
                    onChange={(e) => setAlbumFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    {FESTIVAL_DATES.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={albumFormData.coverImage}
                  onChange={(e) => setAlbumFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={albumFormData.displayOrder}
                    onChange={(e) => setAlbumFormData(prev => ({ ...prev, displayOrder: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Status</label>
                  <select
                    value={albumFormData.status}
                    onChange={(e) => setAlbumFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAlbumModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e172a] text-white font-bold cursor-pointer"
                >
                  Save Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODALS: MEDIA EDIT                                                     */}
      {/* ========================================================================= */}
      {isMediaModalOpen && editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#A91F35]" />
                <h3 className="text-base font-serif font-black text-stone-900">
                  Edit Media Asset ({editingMedia.id})
                </h3>
              </div>
              <button
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMediaEdit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-stone-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={uploadFormData.caption}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:border-[#A91F35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Album</label>
                  <select
                    value={uploadFormData.albumId}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, albumId: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    <option value="">Unassigned</option>
                    {albums.map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Category</label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">Related Programme</label>
                  <select
                    value={uploadFormData.relatedProgrammeId}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, relatedProgrammeId: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    <option value="">None</option>
                    {programmes.map(p => (
                      <option key={p.id} value={p.id}>{p.code}: {p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Status</label>
                  <select
                    value={uploadFormData.status}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-[#FAF7F0] p-2.5 rounded-xl border border-stone-300 text-stone-900"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e172a] text-white font-bold cursor-pointer"
                >
                  Update Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. FULL-SIZE LIGHTBOX & VIDEO PLAYER MODAL                                */}
      {/* ========================================================================= */}
      {isLightboxOpen && filteredMedia[lightboxMediaIndex] && (
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
                  handlePrevMedia();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextMedia();
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
              {filteredMedia[lightboxMediaIndex].type === 'video' ? (
                filteredMedia[lightboxMediaIndex].url.includes('youtube') || filteredMedia[lightboxMediaIndex].url.includes('embed') ? (
                  <iframe
                    src={filteredMedia[lightboxMediaIndex].url}
                    title={filteredMedia[lightboxMediaIndex].title}
                    className="w-full aspect-video max-h-[65vh]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={filteredMedia[lightboxMediaIndex].url}
                    controls
                    autoPlay
                    className="w-full max-h-[65vh] object-contain"
                  />
                )
              ) : (
                <img
                  src={filteredMedia[lightboxMediaIndex].url}
                  alt={filteredMedia[lightboxMediaIndex].title}
                  className="w-full max-h-[65vh] object-contain"
                />
              )}
            </div>

            {/* Bottom Media Metadata Drawer */}
            <div className="p-4 sm:p-6 bg-[#25201e] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold uppercase">
                    {filteredMedia[lightboxMediaIndex].category}
                  </span>
                  <span className="text-xs text-stone-400">
                    {filteredMedia[lightboxMediaIndex].albumTitle || 'Unassigned Album'} • {filteredMedia[lightboxMediaIndex].date}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-serif font-black">
                  {filteredMedia[lightboxMediaIndex].title}
                </h4>
                <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                  {filteredMedia[lightboxMediaIndex].caption}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                <span className="text-stone-400 font-mono">
                  {lightboxMediaIndex + 1} of {filteredMedia.length}
                </span>
                <a
                  href={filteredMedia[lightboxMediaIndex].url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. DESTRUCTIVE ACTION CONFIRMATION DIALOG                                 */}
      {/* ========================================================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Confirm {deleteConfirm.type === 'album' ? 'Album Deletion' : 'Media Deletion'}
                </h4>
                <p className="text-xs text-stone-500">
                  {deleteConfirm.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {deleteConfirm.type === 'album'
                ? 'Deleting this album will unassign all media associated with it. The original photos and video files will NOT be deleted from your vault.'
                : 'Are you sure you want to delete this media asset permanently? This action cannot be undone.'}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
