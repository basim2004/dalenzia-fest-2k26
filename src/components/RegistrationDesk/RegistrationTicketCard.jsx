import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  MapPin,
  Building,
  QrCode as QrIcon,
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  User,
  Tag,
  IdCard,
  AlertTriangle
} from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import { festivalStore } from '../../admin/data/festivalStore';

export default function RegistrationTicketCard({ registration, onClose, onViewStudentPass }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);

  const reg = registration || {};
  const {
    ticketId,
    type,
    studentId,
    chestNo,
    participantName,
    teamName,
    classCategory,
    institution,
    phone,
    email,
    place,
    status = 'Completed',
    verificationCode,
    registeredAt,
    notes
  } = reg;

  const isDarsStudent = type === 'existing_student' || type === 'Dars Student' || type === 'student' || Boolean(studentId);
  const isCancelled = status ? status.toLowerCase() === 'cancelled' : false;
  const isPending = status ? status.toLowerCase() === 'pending' : false;

  // Generate QR Code data unconditionally
  useEffect(() => {
    if (!registration) return;
    const payload = JSON.stringify({
      fest: 'DALENZIA FEST 2K26',
      ticketId,
      code: verificationCode || ticketId,
      name: participantName,
      type: isDarsStudent ? 'Dars Student' : 'External Delegate',
      studentId: studentId || 'N/A',
      institution: institution || 'Dalailussunna Dars, Ayiroor',
      dates: '21, 22, 23 DEC 2026',
      status
    });

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 1,
      color: {
        dark: '#A91F35',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR:', err));
  }, [ticketId, verificationCode, participantName, isDarsStudent, studentId, institution, status]);

  // Download ticket as PNG
  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFFFFF'
      });
      const link = document.createElement('a');
      link.download = `DALENZIA-2K26-TICKET-${ticketId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Print ticket
  const handlePrint = () => {
    window.print();
  };

  // WhatsApp share link
  const handleWhatsAppShare = () => {
    const shareText = `🎉 *DALENZIA FEST 2K26 — OFFICIAL REGISTRATION PASS* 🎉%0A%0A` +
      `*Participant:* ${encodeURIComponent(participantName)}%0A` +
      `*Ticket ID:* ${encodeURIComponent(ticketId)}%0A` +
      `*Type:* ${encodeURIComponent(isDarsStudent ? 'Dars Student' : 'External Participant')}%0A` +
      (studentId ? `*Student ID:* ${encodeURIComponent(studentId)}%0A` : '') +
      `*Institution:* ${encodeURIComponent(institution || 'Dalailussunna Dars, Ayiroor')}%0A` +
      `*Dates:* 21, 22, 23 December 2026%0A` +
      `*Venue:* Dalailussunna Dars, Ayiroor, Malappuram%0A` +
      `*Verification Code:* ${encodeURIComponent(verificationCode || ticketId)}%0A%0A` +
      `_Present this verified digital pass at the entrance registration desk._`;

    const waUrl = `https://wa.me/?text=${shareText}`;
    window.open(waUrl, '_blank');
  };

  // Copy Verification Details
  const handleCopy = () => {
    const text = `DALENZIA FEST 2K26 PASS\nTicket ID: ${ticketId}\nParticipant: ${participantName}\nType: ${type}\nInstitution: ${institution}\nCode: ${verificationCode}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (!registration) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#F7F3E9] rounded-3xl overflow-hidden shadow-2xl border border-white/20 print:shadow-none print:border-none print:max-w-none print:w-full print:rounded-none"
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between gap-3 border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E6A916]/20 border border-[#E6A916]/40 flex items-center justify-center text-[#E6A916]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm text-[#F7F3E9]">
                Digital Registration Ticket
              </h3>
              <p className="text-[10px] text-stone-400">
                Official Festival Admission Pass • Live Validated
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white/90 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy Ticket Details"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-xl bg-[#E6A916] hover:bg-[#d49b14] text-xs font-black text-[#A91F35] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              title="Download PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isDownloading ? 'Saving...' : 'Download'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#A91F35] hover:bg-[#8e172a] text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Print Pass"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer ml-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Main Printable Ticket Card Body */}
        <div className="p-4 sm:p-6 print:p-4">
          <div
            ref={ticketRef}
            className="w-full bg-white rounded-3xl border-2 border-[#E6A916]/40 shadow-xl overflow-hidden relative"
          >
            {/* Top Ornamental Band with Brand Dual Logos */}
            <div className="bg-gradient-to-r from-[#8D182B] via-[#A91F35] to-[#8D182B] text-white p-5 sm:p-6 relative overflow-hidden">
              {/* Subtle background arabesque pattern */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, #E6A916 1px, transparent 1px), radial-gradient(circle at 80% 50%, #E6A916 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: DALENZIA 2K26 Gold Official Logo */}
                <div className="flex items-center gap-3">
                  <div className="h-12 sm:h-14 w-auto flex items-center">
                    <img
                      src="/assets/brand/official_dalenzia_fest_gold.png"
                      alt="Dalenzia Fest 2K26"
                      className="h-full w-auto object-contain filter drop-shadow-sm"
                      onError={(e) => {
                        e.target.src = '/assets/dalenzia_fest_logo.png';
                      }}
                    />
                  </div>
                  <div className="h-9 w-px bg-white/20 hidden sm:block" />
                  <div className="hidden sm:block">
                    <span className="block text-[10px] tracking-widest uppercase font-black text-[#E6A916]">
                      Official Pass
                    </span>
                    <span className="block text-xs font-bold text-white/90">
                      Admissions Desk
                    </span>
                  </div>
                </div>

                {/* Right: NUEVA ERA Theme Gold Official Logo */}
                <div className="flex items-center gap-2">
                  <div className="h-9 sm:h-11 w-auto flex items-center">
                    <img
                      src="/assets/brand/official_nueva_era_gold.png"
                      alt="Nueva Era"
                      className="h-full w-auto object-contain filter drop-shadow-sm"
                      onError={(e) => {
                        e.target.src = '/assets/brand/official_nueva_era_logo.png';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Ribbon / Header Banner */}
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white/80">TICKET NO:</span>
                  <span className="font-mono font-black text-sm text-[#E6A916] bg-black/25 px-2.5 py-0.5 rounded-lg border border-[#E6A916]/40 tracking-wider">
                    {ticketId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-rose-500/90 text-white'
                        : isPending
                        ? 'bg-amber-400 text-stone-900'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{status}</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isDarsStudent
                        ? 'bg-[#E6A916] text-[#A91F35]'
                        : 'bg-stone-800 text-[#E6A916] border border-[#E6A916]/40'
                    }`}
                  >
                    {isDarsStudent ? 'Dars Student' : 'External Delegate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Body Content */}
            <div className="p-5 sm:p-6 space-y-5 bg-[#FAF8F5]">
              {/* Participant Highlight Name */}
              <div className="border-b border-stone-200/80 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#A91F35]">
                    Participant Name
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 capitalize tracking-tight mt-0.5">
                    {participantName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-600">
                    {classCategory && (
                      <span className="font-semibold bg-stone-200/70 text-stone-700 px-2 py-0.5 rounded-md text-[11px]">
                        Category: {classCategory}
                      </span>
                    )}
                    {chestNo && (
                      <span className="font-bold text-[#A91F35] bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md text-[11px]">
                        Chest No: {chestNo}
                      </span>
                    )}
                    {teamName && (
                      <span className="font-medium text-stone-600">
                        Squad: <strong className="text-stone-800">{teamName}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Student ID info badge for internal students */}
                {isDarsStudent && studentId && (
                  <div className="bg-amber-50 border border-[#E6A916]/50 rounded-2xl p-2.5 sm:text-right shrink-0">
                    <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-bold">
                      Official Student ID
                    </span>
                    <span className="block font-mono font-black text-sm text-[#A91F35]">
                      {studentId}
                    </span>
                    <span className="block text-[9px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Authentic Record Intact
                    </span>
                  </div>
                )}
              </div>

              {/* Grid: Institution, Dates, Venue & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center shrink-0 mt-0.5">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-stone-400">
                        Institution / Campus
                      </span>
                      <span className="font-bold text-stone-900 leading-tight">
                        {institution || 'Dalailussunna Dars, Ayiroor'}
                      </span>
                      {place && (
                        <span className="block text-[11px] text-stone-500">{place}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#E6A916]/15 text-[#9E6E00] flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-stone-400">
                        Festival Dates
                      </span>
                      <span className="font-extrabold text-stone-900">
                        21, 22, 23 DECEMBER 2026
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#A91F35]/10 text-[#A91F35] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-stone-400">
                        Festival Venue
                      </span>
                      <span className="font-bold text-stone-900 leading-tight">
                        Dalailussunna Dars, Ayiroor
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        Perumpadappu, Malappuram, Kerala
                      </span>
                    </div>
                  </div>

                  {(phone || email) && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-stone-400">
                          Contact Info
                        </span>
                        <span className="font-semibold text-stone-800">
                          {phone || email}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Perforated Divider Visual */}
              <div className="relative py-2">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F3E9] border-r-2 border-[#E6A916]/40" />
                <div className="border-t-2 border-dashed border-stone-300 w-full" />
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F3E9] border-l-2 border-[#E6A916]/40" />
              </div>

              {/* Ticket Stub Lower Section: QR Code + Security Verification */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                {/* QR Code Container */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Verification QR Code"
                      className="w-24 h-24 sm:w-26 sm:h-26 object-contain rounded-lg border border-stone-100"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                      <QrIcon className="w-8 h-8 animate-pulse" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Secure QR
                    </span>
                    <span className="block text-[10px] text-stone-400 uppercase font-semibold">
                      Verification Reference
                    </span>
                    <span className="font-mono font-bold text-xs text-stone-800">
                      {verificationCode || ticketId}
                    </span>
                    <span className="block text-[9px] text-stone-500">
                      Scan at stage desk for gate entry
                    </span>
                  </div>
                </div>

                {/* Right Verification Status & Security Watermark */}
                <div className="text-center sm:text-right space-y-1 text-xs">
                  <div className="inline-flex items-center gap-1.5 text-stone-500 text-[11px]">
                    <Sparkles className="w-3 h-3 text-[#E6A916]" />
                    <span>Registered: {registeredAt || '2026-11-20'}</span>
                  </div>
                  <div className="font-serif italic text-stone-500 text-[11px]">
                    "NUEVA ERA — Igniting Knowledge, Faith & Art"
                  </div>
                  <div className="text-[9px] text-stone-400 uppercase tracking-widest font-mono">
                    AUT-VERIFIED • FEST-CTRL-2K26
                  </div>
                </div>
              </div>

              {/* Special Note / Coming Soon for External Competitions */}
              {!isDarsStudent && (
                <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">EXTERNAL COMPETITIONS: COMING SOON. </span>
                    <span className="text-[11px] text-amber-800">
                      Delegate seat is officially confirmed. Inter-collegiate competition registration guidelines will be notified.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Ribbon */}
            <div className="bg-stone-900 text-stone-400 px-5 py-3 text-[10px] flex items-center justify-between border-t border-stone-800">
              <span className="font-bold text-[#F7F3E9]">
                Dalailussunna Dars, Ayiroor • 2K26 Central Registration Desk
              </span>
              <span className="font-mono text-stone-500">
                PASS #{ticketId}
              </span>
            </div>
          </div>

          {/* If existing Dars student: Link to view authentic student ID Pass without replacing */}
          {isDarsStudent && studentId && onViewStudentPass && (
            <div className="mt-4 p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs print:hidden">
              <div className="flex items-center gap-2 text-stone-700">
                <IdCard className="w-4 h-4 text-[#A91F35]" />
                <span>
                  Official Institutional ID Pass: <strong>{studentId}</strong>
                </span>
              </div>
              <button
                onClick={() => onViewStudentPass(studentId)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>View ID Pass</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
