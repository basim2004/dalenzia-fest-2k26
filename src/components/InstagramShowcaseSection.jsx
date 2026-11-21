import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  QrCode,
  Download,
  Maximize2,
  X,
  Check,
  Share2,
  Users,
  Sparkles,
  Grid,
  ShieldCheck,
  Eye
} from 'lucide-react';

export const INSTAGRAM_ACCOUNTS = [
  {
    id: 'dalenzia-official',
    handle: '_.dalenzia_',
    displayName: 'DALENZIA',
    category: 'Festival & Cultural Movement',
    url: 'https://www.instagram.com/_.dalenzia_?jplx=MTc4bnBxMnRnYWtrcg==',
    avatar: '/assets/instagram/avatar_dalenzia.png',
    qrImage: '/assets/instagram/qr_dalenzia_official.png',
    gridImage: '/assets/instagram/grid_dalenzia.jpg',
    fullScreenshot: '/assets/instagram/instagram_profile_dalenzia.jpg',
    stats: {
      posts: '70',
      followers: '19',
      following: '7'
    },
    bioLines: [
      '_ESENCIA CULTA_ ...',
      '_Spark The Flair With in_ 🕊️',
      '@_dalailusunna_ayr'
    ],
    followedByText: 'Followed by basithedr, swalih__edayur and 7 others',
    badgeText: 'OFFICIAL FESTIVAL ACCOUNT',
    accentColor: '#E6A916'
  },
  {
    id: 'dalailusunna-ayr',
    handle: '_dalailusunna_ayr',
    displayName: 'دلائل السنة (DALAILUSSUNNA)',
    category: 'Education & Academic Dars',
    url: 'https://www.instagram.com/_dalailusunna_ayr?hvrq=dzgwcTB2ZWE1NjB2',
    avatar: '/assets/instagram/avatar_dalailusunna.png',
    qrImage: '/assets/instagram/qr_dalailusunna_ayr.png',
    gridImage: '/assets/instagram/grid_dalailusunna.jpg',
    fullScreenshot: '/assets/instagram/instagram_profile_dalailusunna.jpg',
    stats: {
      posts: '220',
      followers: '97',
      following: '18'
    },
    bioLines: [
      '◆ Welcome to DALAILUSSUNNA DARS AYIROOR ◆',
      '◆ PERUMPADAPPU - AYIROOR - MALAPPURAM 679580 ◆',
      'Ph +91 8589951951, 90729 91951'
    ],
    followedByText: 'Followed by midlaj_adany._, basithedr and 30 others',
    badgeText: 'ALMA MATER & ACADEMIC HUB',
    accentColor: '#10B981'
  }
];

// Authentic Instagram Gradient SVG Icon
function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function InstagramShowcaseSection() {
  const [activeTabByAccount, setActiveTabByAccount] = useState({
    'dalenzia-official': 'qr',
    'dalailusunna-ayr': 'qr'
  });
  const [qrModalItem, setQrModalItem] = useState(null);

  const toggleTab = (accountId, tabName) => {
    setActiveTabByAccount((prev) => ({
      ...prev,
      [accountId]: tabName
    }));
  };

  return (
    <section
      id="instagram"
      className="py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white relative overflow-hidden select-none border-t border-amber-500/20"
    >
      {/* Ambient Instagram Brand Aura */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-rose-600/10 via-purple-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-rose-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/15 via-rose-500/15 to-amber-500/15 border border-rose-500/30 text-rose-300 text-xs font-black tracking-widest uppercase">
            <InstagramIcon className="w-4 h-4 text-rose-400" />
            <span>OFFICIAL SOCIAL CHANNELS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
            FOLLOW OUR JOURNEY
          </h2>

          <p className="text-base sm:text-lg font-serif font-bold text-[#E6A916]">
            DALENZIA ON INSTAGRAM
          </p>

          <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Connect with our 21, 22, 23 DECEMBER 2026 visual stories, live updates, candidate performances, and scholastic heritage across both official Instagram profiles.
          </p>
        </div>

        {/* Both Account Showcases: Side by Side on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {INSTAGRAM_ACCOUNTS.map((acc) => {
            const activeTab = activeTabByAccount[acc.id] || 'qr';

            return (
              <div
                key={acc.id}
                className="bg-stone-900/90 rounded-[32px] p-6 sm:p-8 border-2 border-white/10 hover:border-amber-500/40 shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-6 text-left group relative overflow-hidden"
              >
                {/* Subtle Glow Accent */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-2xl pointer-events-none opacity-20"
                  style={{ backgroundColor: acc.accentColor }}
                />

                {/* Profile Header Block (Authentic Instagram UI) */}
                <div className="space-y-4">
                  
                  {/* Category Badge & Live Identifier */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>{acc.badgeText}</span>
                    </span>
                    <a
                      href={acc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>@{acc.handle}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Top Row: Avatar + Stats Counts */}
                  <div className="flex items-center gap-5 sm:gap-6">
                    
                    {/* Circular Avatar with Glowing Instagram Story Ring */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-stone-950 p-1 flex items-center justify-center overflow-hidden">
                          <img
                            src={acc.avatar}
                            alt={acc.displayName}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid: Posts, Followers, Following */}
                    <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                      <div className="space-y-0.5">
                        <span className="font-mono font-black text-lg sm:text-xl text-white block">
                          {acc.stats.posts}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">posts</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-mono font-black text-lg sm:text-xl text-[#E6A916] block">
                          {acc.stats.followers}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">followers</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-mono font-black text-lg sm:text-xl text-white block">
                          {acc.stats.following}
                        </span>
                        <span className="text-[11px] text-stone-400 font-medium">following</span>
                      </div>
                    </div>

                  </div>

                  {/* Profile Bio Details */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif font-black text-lg sm:text-xl text-white tracking-tight">
                        {acc.displayName}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-[#0095F6] shrink-0" />
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-400 block">
                      {acc.category}
                    </span>

                    <div className="text-xs sm:text-sm text-stone-200 leading-snug space-y-0.5 pt-1 font-sans">
                      {acc.bioLines.map((line, i) => (
                        <p key={i} className="text-stone-300 font-medium">{line}</p>
                      ))}
                    </div>

                    <p className="text-[11px] text-stone-400 pt-1 flex items-center gap-1.5 font-medium">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      <span>{acc.followedByText}</span>
                    </p>
                  </div>

                  {/* Primary Follow Button & Profile Switcher Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <a
                      href={acc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <InstagramIcon className="w-4 h-4 text-white" />
                      <span>FOLLOW @{acc.handle}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                    </a>

                    <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => toggleTab(acc.id, 'qr')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'qr'
                            ? 'bg-[#E6A916] text-stone-950 shadow-sm'
                            : 'text-stone-300 hover:text-white'
                        }`}
                        title="Show Scannable QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Code</span>
                      </button>

                      <button
                        onClick={() => toggleTab(acc.id, 'grid')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'grid'
                            ? 'bg-[#E6A916] text-stone-950 shadow-sm'
                            : 'text-stone-300 hover:text-white'
                        }`}
                        title="Show Feed Preview"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>Feed</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Interactive Dynamic Display: QR Card vs Feed Preview */}
                <div className="pt-2">
                  {activeTab === 'qr' ? (
                    /* QR Code Showcase Card */
                    <div className="bg-stone-950 rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 relative group/qr">
                      
                      {/* Scannable High-Res QR Image with Click to Enlarge */}
                      <div
                        className="relative cursor-pointer shrink-0"
                        onClick={() => setQrModalItem(acc)}
                        title="Click to view larger QR code"
                      >
                        <div className="bg-white p-3 rounded-2xl shadow-xl border-2 border-stone-200">
                          <img
                            src={acc.qrImage}
                            alt={`Scan to Follow @${acc.handle}`}
                            className="w-36 h-36 sm:w-40 sm:h-40 object-contain select-none"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 pointer-events-none">
                          <Maximize2 className="w-4 h-4 text-[#E6A916]" />
                          <span>Enlarge</span>
                        </div>
                      </div>

                      {/* QR Metadata, Scan Guidance & Download Option */}
                      <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
                        <div className="space-y-1">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-mono font-bold text-[#E6A916]">
                            <QrCode className="w-3.5 h-3.5 text-[#E6A916]" />
                            <span className="uppercase tracking-wider">SCAN TO FOLLOW</span>
                          </div>
                          <h4 className="font-serif font-black text-sm sm:text-base text-white">
                            Scan with your Phone Camera
                          </h4>
                          <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                            Point your device camera or Instagram scanner to open @{acc.handle} directly.
                          </p>
                        </div>

                        {/* Download QR Code Button & Enlarge Action */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                          <a
                            href={acc.qrImage}
                            download={`dalenzia_instagram_qr_${acc.handle}.png`}
                            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 transition-all shadow-sm cursor-pointer"
                            title="Download High-Resolution QR Code image"
                          >
                            <Download className="w-3.5 h-3.5 text-[#E6A916]" />
                            <span>Download QR</span>
                          </a>

                          <button
                            onClick={() => setQrModalItem(acc)}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all border border-white/10 cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* Grid / Feed Snapshot Preview */
                    <div className="bg-stone-950 rounded-2xl p-4 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-400 border-b border-white/10 pb-2">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Grid className="w-3.5 h-3.5 text-[#E6A916]" />
                          <span>Latest Reels &amp; Posts Grid</span>
                        </span>
                        <a
                          href={acc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E6A916] hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>Open on Instagram</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-black flex items-center justify-center relative group">
                        <img
                          src={acc.gridImage}
                          alt={`${acc.displayName} feed`}
                          className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <a
                          href={acc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold backdrop-blur-xs"
                        >
                          <InstagramIcon className="w-4 h-4 text-white" />
                          <span>View All Posts on Instagram</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Larger QR Code Preview Lightbox Modal */}
      <AnimatePresence>
        {qrModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button
              onClick={() => setQrModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 text-center space-y-6 shadow-2xl relative"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-full bg-stone-950 p-1 flex items-center justify-center">
                    <img
                      src={qrModalItem.avatar}
                      alt={qrModalItem.displayName}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-white">
                    @{qrModalItem.handle}
                  </h3>
                  <p className="text-xs font-mono font-bold text-[#E6A916] uppercase tracking-wider">
                    {qrModalItem.displayName}
                  </p>
                </div>
              </div>

              {/* Large Crisp QR Code */}
              <div className="bg-white p-5 rounded-2xl shadow-inner inline-block border-4 border-stone-200">
                <img
                  src={qrModalItem.qrImage}
                  alt={`QR Code @${qrModalItem.handle}`}
                  className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-[#E6A916] uppercase tracking-widest block">
                  SCAN TO FOLLOW
                </span>
                <p className="text-xs text-stone-300">
                  Scan this code with your phone camera or the Instagram app to follow immediately.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-white/10">
                <a
                  href={qrModalItem.qrImage}
                  download={`dalenzia_instagram_qr_${qrModalItem.handle}.png`}
                  className="px-5 py-2.5 rounded-xl bg-[#E6A916] hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Image</span>
                </a>

                <a
                  href={qrModalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Open Profile</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
