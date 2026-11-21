import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function RegistrationBanner({ lang }) {
  return (
    <section className="max-w-md mx-auto px-4 py-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#A91F35] via-[#911629] to-[#731020] text-white p-5 shadow-lg border border-[#E6A916]/30 flex flex-col items-center text-center space-y-3"
      >
        {/* Ambient background glow & graphic */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 opacity-15 pointer-events-none">
          <img src="/assets/flat_hourglass.png" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3 h-3" />
          <span>{lang === 'en' ? '21, 22, 23 DECEMBER 2026 • Registration Active' : '21, 22, 23 ഡിസംബർ 2026 • രജിസ്ട്രേഷൻ പുരോഗമിക്കുന്നു'}</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-serif font-bold text-[#F7F3E9] leading-tight">
            {lang === 'en'
              ? 'Join the Nueva Era Arena'
              : 'ന്യൂവ എറ വേദികളിലേക്ക് മത്സരാർത്ഥികളെ ക്ഷണിക്കുന്നു'}
          </h3>
          <p className="text-xs text-white/80 max-w-xs leading-relaxed">
            {lang === 'en'
              ? 'Official contestant entry and sector team confirmations are currently open for 64 competitive categories.'
              : '64 ഇനങ്ങളിലായി നടക്കുന്ന മത്സരങ്ങളിലേക്ക് നിങ്ങളുടെ രജിസ്ട്രേഷൻ ഉറപ്പുവരുത്തുക.'}
          </p>
        </div>

        <a
          href="#register"
          onClick={() => {
            window.location.hash = '#register';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#E6A916] text-[#A91F35] rounded-xl font-bold text-xs shadow-md hover:bg-[#ffd166] active:scale-95 transition-all cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>{lang === 'en' ? 'Register Now' : 'ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യാം'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </motion.div>
    </section>
  );
}
