import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  QrCode,
  Check,
  Copy,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bell
} from 'lucide-react';

export const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/GgkjTHCZnXVI5ypcr5zO5g?s=cl&p=a&iam=2';

// Authentic WhatsApp SVG Icon
function WhatsAppIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppCommunitySection({
  id = 'community',
  theme = 'default', // 'default' (festival burgundy/gold) or 'archival' (2K25 stone/gold)
  editionBadge = 'OFFICIAL FESTIVAL COMMUNITY'
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(WHATSAPP_GROUP_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const isArchival = theme === 'archival';

  return (
    <section
      id={id}
      className={`py-16 md:py-24 px-4 md:px-8 relative overflow-hidden text-left ${
        isArchival
          ? 'bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white border-y border-amber-500/20'
          : 'bg-gradient-to-b from-[#FFFDF9] via-[#F9F5EC] to-[#F3EDE0] text-stone-900 border-y border-[#A91F35]/15'
      }`}
    >
      {/* Ambient Lighting Orbs */}
      <div
        className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40 ${
          isArchival ? 'bg-[#E6A916]/15' : 'bg-[#25D366]/10'
        }`}
      />
      <div
        className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40 ${
          isArchival ? 'bg-[#A91F35]/25' : 'bg-[#A91F35]/10'
        }`}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3.5 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#128C7E] text-xs font-black tracking-widest uppercase">
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span>{editionBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight">
            JOIN THE DALENZIA COMMUNITY
          </h2>

          <p
            className={`text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-2xl mx-auto ${
              isArchival ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Stay connected with the Dalenzia community. Join our official WhatsApp group for December 21–23, 2026 festival updates, announcements, live alerts and memorable moments.
          </p>
        </motion.div>

        {/* Main Showcase Grid: Information & Benefits on Left, Verified QR Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Community Benefits & Call-to-Action (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Festival Identity Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-stone-200/60 dark:border-white/10">
              <div className="h-12 w-auto bg-white p-2 rounded-2xl shadow-sm border border-stone-200/80 flex items-center justify-center">
                <img
                  src="/assets/dalenzia_fest_logo.png"
                  alt="Dalenzia Fest Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl sm:text-2xl tracking-tight">
                  Official Dalenzia Network
                </h3>
                <p className="text-xs font-mono font-bold text-[#E6A916] uppercase tracking-wider">
                  Dalailussunna Dars, Ayiroor • Community Hub
                </p>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isArchival
                    ? 'bg-stone-900/80 border-white/10 text-stone-200'
                    : 'bg-white border-stone-200/80 text-stone-800 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-black text-sm">Instant Announcements</h4>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Real-time schedule releases, stage calling, category results, and official circulars.
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isArchival
                    ? 'bg-stone-900/80 border-white/10 text-stone-200'
                    : 'bg-white border-stone-200/80 text-stone-800 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E6A916]/15 flex items-center justify-center text-[#E6A916]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-black text-sm">Festival Memories</h4>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  High-resolution photo galleries, teaser videos, media bulletins, and theme releases.
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isArchival
                    ? 'bg-stone-900/80 border-white/10 text-stone-200'
                    : 'bg-white border-stone-200/80 text-stone-800 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#A91F35]/15 flex items-center justify-center text-[#A91F35]">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-black text-sm">Scholars &amp; Alumni</h4>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Uniting teachers, dars scholars, alumni in the Gulf, and well-wishers worldwide.
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isArchival
                    ? 'bg-stone-900/80 border-white/10 text-stone-200'
                    : 'bg-white border-stone-200/80 text-stone-800 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif font-black text-sm">Verified &amp; Moderated</h4>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  Supervised by the official Dalailussunna Dars media secretariat.
                </p>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <WhatsAppIcon className="w-5 h-5 text-white" />
                <span>JOIN WHATSAPP GROUP</span>
                <ExternalLink className="w-4 h-4 text-white/80" />
              </a>

              <button
                onClick={handleCopyLink}
                className={`px-5 py-4 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  isArchival
                    ? 'bg-stone-900 border-white/15 text-stone-300 hover:text-white hover:bg-stone-800'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-sm'
                }`}
                title="Copy WhatsApp Group Invitation Link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#25D366]" />
                    <span className="text-[#25D366]">LINK COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY INVITE LINK</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
              Direct invite link: <span className="underline break-all">{WHATSAPP_GROUP_URL}</span>
            </p>

          </motion.div>

          {/* Right: Official WhatsApp QR Card (5 Cols) with Motion Entrance & Scanner Effect */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div
              className={`w-full max-w-sm rounded-[32px] p-6 sm:p-8 text-center space-y-6 relative border-2 shadow-2xl transition-all ${
                isArchival
                  ? 'bg-stone-950/95 border-amber-500/40 text-white'
                  : 'bg-stone-950 text-white border-[#E6A916]/40'
              }`}
            >
              {/* Top Verified Identity Halo */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-white p-2 flex items-center justify-center shadow-lg border-2 border-[#E6A916]">
                  <img
                    src="/assets/dalenzia_fest_logo.png"
                    alt="Dalenzia Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-black tracking-widest text-[#E6A916] uppercase">
                    <span>DALENZIA COMMUNITY</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                  </div>
                  <h4 className="font-serif font-black text-lg text-white">
                    Official WhatsApp Group
                  </h4>
                  <p className="text-[11px] text-stone-400 font-mono">
                    Scan with camera to join instantly
                  </p>
                </div>
              </div>

              {/* Scannable Clean High-Resolution QR Code Container with Animated Scan Line */}
              <div className="relative group inline-block">
                <div className="bg-white rounded-3xl p-5 shadow-2xl inline-block border-4 border-stone-200 relative overflow-hidden">
                  <img
                    src="/assets/dalenzia_whatsapp_qr.png"
                    alt="Scan to Join DALENZIA WhatsApp Community"
                    className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto select-none"
                    loading="lazy"
                  />
                  {/* Subtle Glowing Scanner Ray */}
                  <motion.div
                    animate={{ y: [0, 180, 0] }}
                    transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                    className="absolute top-5 left-5 right-5 h-[2px] bg-gradient-to-r from-transparent via-[#25D366] to-transparent shadow-[0_0_8px_#25D366] pointer-events-none"
                  />
                </div>

                {/* Scan to Join Floating Badge */}
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#E6A916]">
                  <QrCode className="w-4 h-4 text-[#25D366]" />
                  <span className="tracking-widest uppercase">SCAN TO JOIN</span>
                </div>
              </div>

              {/* Disclaimer / Mobile Guidance */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                  Use your phone camera or the WhatsApp in-app scanner to join the official group.
                </p>

                {/* Mobile Direct Join Button */}
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Tap to Join on Mobile</span>
                </a>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
