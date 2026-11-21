import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Code2,
  Phone,
  MessageSquare,
  QrCode,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Info
} from 'lucide-react';

export default function DeveloperSupportSection() {
  const [qrNum1, setQrNum1] = useState('');
  const [qrNum2, setQrNum2] = useState('');
  const [copiedText, setCopiedText] = useState('');

  const devDetails = {
    name: 'BASIM ASLAM',
    location: 'Edayur',
    role: 'Official System Developer',
    project: 'DALENZIA FEST 2K26 Technical Engine',
    num1: {
      raw: '6282925271',
      formatted: '+91 6282925271',
      tel: 'tel:+916282925271',
      wa: 'https://wa.me/916282925271?text=Hello%20Basim,%20I%20am%20a%20student%20at%20Dalenzia%202K26%20and%20need%20technical%20assistance.'
    },
    num2: {
      raw: '8547931509',
      formatted: '+91 8547931509',
      tel: 'tel:+918547931509',
      wa: 'https://wa.me/918547931509?text=Hello%20Basim,%20I%20am%20a%20student%20at%20Dalenzia%202K26%20and%20need%20technical%20assistance.'
    }
  };

  useEffect(() => {
    // Generate valid, scannable QR codes for both official contact channels
    QRCode.toDataURL(devDetails.num1.wa, {
      width: 260,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff'
      }
    })
      .then(url => setQrNum1(url))
      .catch(err => console.error('Failed generating QR 1', err));

    QRCode.toDataURL(devDetails.num2.wa, {
      width: 260,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff'
      }
    })
      .then(url => setQrNum2(url))
      .catch(err => console.error('Failed generating QR 2', err));
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#E6A916]/30 relative overflow-hidden space-y-6">
      {/* Decorative top ambient glow */}
      <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-52 h-52 rounded-full bg-gradient-to-br from-[#E6A916]/20 to-[#A91F35]/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6A916]/15 text-[#A91F35] text-[11px] font-black border border-[#E6A916]/30 uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>Developer Technical Support</span>
          </div>

          <h3 className="font-serif font-black text-2xl text-stone-900 tracking-tight">
            {devDetails.name}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1.5 text-[#A91F35] font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{devDetails.location}</span>
            </span>
            <span className="text-stone-300">•</span>
            <span>{devDetails.role}</span>
          </div>
        </div>

        {/* Security / Scope Advisory Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs max-w-xs">
          <Info className="w-4 h-4 text-[#A91F35] shrink-0" />
          <span className="text-[11px] leading-tight">
            Direct technical channel for student portal bug reports, credentials, and app help.
          </span>
        </div>
      </div>

      {/* Contact Cards with Scannable QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Contact Channel 01 */}
        <div className="bg-[#FAF7F0] p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#A91F35] text-white text-[10px] font-black tracking-wider uppercase">
                Primary Line
              </span>
              <span className="text-[11px] font-mono text-stone-500 font-bold">Channel 01</span>
            </div>

            <div className="text-lg font-mono font-black text-stone-900 tracking-wide mb-1">
              {devDetails.num1.formatted}
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Direct voice call & WhatsApp message with developer Basim Aslam.
            </p>
          </div>

          {/* QR Code Presentation */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl shadow-inner border border-stone-100 flex items-center justify-center">
              {qrNum1 ? (
                <img
                  src={qrNum1}
                  alt={`QR Code for ${devDetails.num1.formatted}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-stone-400">Generating QR...</div>
              )}
            </div>
            <p className="text-[11px] font-bold text-stone-700">
              SCAN TO MESSAGE ON WHATSAPP
            </p>
            <p className="text-[10px] text-stone-500 font-mono">
              Number: {devDetails.num1.formatted}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={devDetails.num1.tel}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Call Now</span>
            </a>
            <a
              href={devDetails.num1.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact Channel 02 */}
        <div className="bg-[#FAF7F0] p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black tracking-wider uppercase">
                Secondary Line
              </span>
              <span className="text-[11px] font-mono text-stone-500 font-bold">Channel 02</span>
            </div>

            <div className="text-lg font-mono font-black text-stone-900 tracking-wide mb-1">
              {devDetails.num2.formatted}
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Alternative voice line & WhatsApp support with developer Basim Aslam.
            </p>
          </div>

          {/* QR Code Presentation */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center space-y-2">
            <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl shadow-inner border border-stone-100 flex items-center justify-center">
              {qrNum2 ? (
                <img
                  src={qrNum2}
                  alt={`QR Code for ${devDetails.num2.formatted}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-stone-400">Generating QR...</div>
              )}
            </div>
            <p className="text-[11px] font-bold text-stone-700">
              SCAN TO MESSAGE ON WHATSAPP
            </p>
            <p className="text-[10px] text-stone-500 font-mono">
              Number: {devDetails.num2.formatted}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={devDetails.num2.tel}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#A91F35] hover:bg-[#8D182B] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#E6A916]" />
              <span>Call Now</span>
            </a>
            <a
              href={devDetails.num2.wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
