import React, { useState } from 'react';
import {
  ArrowUp,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Check,
  Compass,
  Shield,
  MessageCircle
} from 'lucide-react';

/* Crisp Inline Brand SVGs */
const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function FooterCinematic() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#A91F35] text-white pt-8 pb-5 overflow-hidden select-none border-t border-[#E6A916]/30">
      {/* Subtle Decorative Wave Texture */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none opacity-15 pointer-events-none">
        <img src="/assets/wave_lines.png" alt="" className="w-full h-auto object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* ========================================================= */}
        {/* 1. COMPACT UPPER SECTION (3 Desktop Columns)              */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* COLUMN 01 – BRAND & CONTACT (5 cols) */}
          <div className="md:col-span-5 space-y-3 text-left">
            {/* Dual Logos (Original Assets with Increased Prominence & White Nueva Era Theme Logo) */}
            <div className="flex items-center gap-3.5 sm:gap-4 md:gap-5 bg-black/20 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl border border-white/10 shadow-xs max-w-fit">
              <div className="h-8 sm:h-9 md:h-10 flex items-center justify-center">
                <img
                  src="/assets/brand/official_dalenzia_fest_gold.png"
                  alt="Dalenzia Fest 2K26"
                  className="h-full w-auto object-contain"
                />
              </div>
              <span className="h-7 sm:h-8 md:h-9 w-[1px] bg-white/25 shrink-0" />
              <div className="h-11 sm:h-12 md:h-14 flex items-center justify-center">
                <img
                  src="/assets/brand/official_nueva_era_reverse_white.png"
                  alt="Nueva Era 2K26"
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>

            {/* Short Festival Description */}
            <p className="text-[11px] sm:text-xs text-[#F7F3E9]/85 leading-relaxed max-w-sm font-normal">
              Annual literary and cultural festival celebrating Islamic scholarship, art, and intellectual dynamism at Dalailussunna Dars.
            </p>

            {/* Compact Venue & Contact Details */}
            <div className="text-[11px] text-[#F7F3E9]/90 space-y-1 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-[#E6A916] shrink-0" />
                <span>Dalailussunna Dars, Ayiroor, Malappuram 679580, Kerala</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a href="tel:+918589951951" className="flex items-center gap-1.5 hover:text-[#E6A916] transition-colors">
                  <Phone className="w-3 h-3 text-[#E6A916] shrink-0" />
                  <span>+91 8589951951</span>
                </a>
                <a href="mailto:dalenziafest@gmail.com" className="flex items-center gap-1.5 hover:text-[#E6A916] transition-colors">
                  <Mail className="w-3 h-3 text-[#E6A916] shrink-0" />
                  <span>dalenziafest@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Authorized Login Entry Pill Buttons */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#E6A916] mr-1">
                ACCESS:
              </span>
              <a
                href="#convener"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#E6A916] text-white hover:text-[#A91F35] text-[10px] font-bold tracking-wider uppercase border border-white/20 shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Convener Portal Login"
              >
                <Compass className="w-3 h-3 text-[#E6A916]" />
                <span>CONVENER</span>
              </a>
              <a
                href="#developer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6A916]/15 hover:bg-[#E6A916] text-[#E6A916] hover:text-[#A91F35] text-[10px] font-bold tracking-wider uppercase border border-[#E6A916]/40 shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Developer & Main Admin Control Centre Login"
              >
                <Shield className="w-3 h-3 text-[#E6A916]" />
                <span>DEVELOPER</span>
              </a>
            </div>
          </div>

          {/* COLUMN 02 – QUICK LINKS (4 cols, 2-column compact subgrid) */}
          <div className="md:col-span-4 space-y-2 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E6A916]">
              QUICK LINKS
            </h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-[#F7F3E9]/85 font-medium">
              <a href="#events" className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> Events
              </a>
              <a href="#guests" className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> Guests
              </a>
              <a href="#schedule" className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> Schedule
              </a>
              <a href="#results" className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> Results
              </a>
              <a
                href="https://chat.whatsapp.com/GgkjTHCZnXVI5ypcr5zO5g?s=cl&p=a&iam=2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate font-semibold text-white"
              >
                <MessageCircle className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> WhatsApp
              </a>
              <a href="#previous" className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate font-bold text-[#E6A916]">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> 2K25 Archive
              </a>
              <a href="#downloads" className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> Downloads
              </a>
              <a href="#gallery" className="hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> Gallery
              </a>
              <a href="#countdown" className="col-span-2 hover:text-[#E6A916] transition-colors flex items-center gap-1 truncate">
                <ArrowRight className="w-2.5 h-2.5 text-[#E6A916] shrink-0" /> Festival Countdown
              </a>
            </div>
          </div>

          {/* COLUMN 03 – CONNECT (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E6A916]">
              CONNECT
            </h4>

            {/* Social Media Cluster */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/_.dalenzia_?jplx=MTc4bnBxMnRnYWtrcg=="
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#E6A916] text-white hover:text-[#A91F35] flex items-center justify-center transition-all border border-white/15 shadow-sm"
                title="Dalenzia Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://chat.whatsapp.com/GgkjTHCZnXVI5ypcr5zO5g?s=cl&p=a&iam=2"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#E6A916]/20 hover:bg-[#E6A916] text-[#E6A916] hover:text-[#A91F35] flex items-center justify-center transition-all border border-[#E6A916]/30 shadow-sm"
                title="WhatsApp Group"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#E6A916] text-white hover:text-[#A91F35] flex items-center justify-center transition-all border border-white/15 shadow-sm"
                title="YouTube"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#E6A916] text-white hover:text-[#A91F35] flex items-center justify-center transition-all border border-white/15 shadow-sm"
                title="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Contact Links & Back to Top */}
            <div className="flex flex-col items-start gap-2 pt-0.5">
              <a
                href="https://wa.me/918589951951"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#F7F3E9]/80 hover:text-[#E6A916] flex items-center gap-1.5 font-medium transition-colors"
              >
                <span>💬 Helpdesk WhatsApp Direct</span>
              </a>

              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-[#E6A916] text-white hover:text-[#A91F35] text-[10px] font-bold transition-all shadow-sm active:scale-95 group cursor-pointer"
                title="Back to Top"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3 h-3 text-[#E6A916] group-hover:text-[#A91F35] group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 2. COMPACT NEWSLETTER PANEL (Horizontal Sleek Cream Bar)   */}
        {/* Palette: Cream #F7F3E9, Crimson #A91F35, Gold #E6A916     */}
        {/* ========================================================= */}
        <div className="bg-[#F7F3E9] text-[#A91F35] rounded-xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-2 shadow-md border border-[#E6A916]/40 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Newsletter Heading & Compact Description */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span className="text-sm sm:text-base font-black font-serif text-[#A91F35] tracking-tight whitespace-nowrap">
              Newsletter
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#A91F35]/75 font-medium hidden sm:inline">
              Get live results, official announcements & stage circulars.
            </span>
          </div>

          {/* Right: Compact Crimson Email Input Pill with Gold Arrow */}
          <form onSubmit={handleSubscribe} className="relative flex items-center w-full md:w-80 max-w-sm">
            <div className="relative flex items-center w-full bg-[#A91F35] rounded-full p-1 border border-[#E6A916]/50 shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full bg-transparent px-3 py-1 text-[11px] sm:text-xs text-white placeholder:text-white/60 font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E6A916] hover:bg-[#ffd166] text-[#A91F35] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
                title="Subscribe to Dalenzia Updates"
              >
                {subscribed ? (
                  <Check className="w-3.5 h-3.5 font-bold" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 font-bold" />
                )}
              </button>
            </div>
            {subscribed && (
              <span className="absolute -bottom-4 left-3 text-[9px] font-bold text-[#A91F35] whitespace-nowrap">
                ✓ Subscribed successfully!
              </span>
            )}
          </form>

        </div>

        {/* ========================================================= */}
        {/* 3. THIN COPYRIGHT STRIP                                   */}
        {/* ========================================================= */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-[#F7F3E9]/75 gap-2">
          <p className="font-semibold text-white/90">
            © 2026 Dalenzia Fest 2K26. All Rights Reserved.
          </p>
          <p className="text-[#F7F3E9]/70">
            Dalailussunna Dars, Ayiroor, Malappuram.
          </p>
        </div>

      </div>
    </footer>
  );
}
