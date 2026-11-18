import React, { useState } from 'react';
import { ArrowUp, MapPin, Phone, Mail, ArrowRight, Check, Send } from 'lucide-react';

export default function FooterCinematic() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
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
    <footer className="relative bg-[#A91F35] text-white pt-14 pb-8 overflow-hidden select-none border-t border-[#E6A916]/30">
      {/* Decorative Wave Lines Banner */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none opacity-30">
        <img src="/assets/wave_lines.png" alt="" className="w-full h-auto object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Brand Lockups (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
                <img src="/assets/golden_hourglass.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  Dalenzia
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E6A916]">
                  FEST 2K26
                </span>
              </div>
            </div>

            {/* Nueva Era Theme Logo in Footer */}
            <div className="h-10 py-1">
              <img
                src="/assets/nueva_era_logo.png"
                alt="Nueva Era"
                className="h-full w-auto object-contain brightness-0 invert"
              />
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              The second edition of the annual literary and cultural fest celebrating tradition, scholarship and creative progress.
            </p>

            <div className="text-xs text-white/90 space-y-1 pt-1 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E6A916]" />
                Dalailussunna Dars, Ayiroor, Malappuram 679580, Kerala
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E6A916]" />
                +91 8589951951
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E6A916]" />
                dalenziafest@gmail.com
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#E6A916]">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs text-white/85 font-medium">
              <li>
                <a href="#about" className="hover:text-[#E6A916] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E6A916]" /> About the Fest
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#E6A916] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E6A916]" /> Events & Competitions
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-[#E6A916] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E6A916]" /> Programme Schedule
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-[#E6A916] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E6A916]" /> Results & Leaderboard
                </a>
              </li>
              <li>
                <a href="#countdown" className="hover:text-[#E6A916] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E6A916]" /> Festival Countdown
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Get Updates / Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#E6A916]">
              GET UPDATES
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Stay informed with official announcements, live scores and festival circulars.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="w-full py-2.5 pl-3.5 pr-12 rounded-full bg-white text-[#1c1917] text-xs font-semibold placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E6A916]"
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-full bg-[#E6A916] text-[#A91F35] flex items-center justify-center hover:bg-[#ffd166] transition-colors"
                title="Subscribe"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <span className="text-[10px] text-[#E6A916] font-bold block">
                ✓ Thank you for subscribing!
              </span>
            )}
          </div>

          {/* Col 4: Social Icons & Back to top (2 cols) */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#E6A916]">
              CONNECT
            </h4>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
                title="YouTube"
              >
                ▶
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
                title="Instagram"
              >
                📷
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://wa.me/918589951951"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
                title="WhatsApp"
              >
                💬
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/70 space-y-2 sm:space-y-0">
          <p>© 2026 Dalenzia Fest 2K26. All Rights Reserved.</p>
          <p className="font-semibold text-white/90">
            Dalailussunna Dars, Ayiroor, Malappuram
          </p>
        </div>

      </div>
    </footer>
  );
}
