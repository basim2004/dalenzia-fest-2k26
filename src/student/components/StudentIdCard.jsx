import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode, Printer, Download, CheckCircle2, ShieldCheck,
  Building, Calendar, User, Sparkles, Share2, AlertCircle
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentIdCard({ studentSession }) {
  const [idData, setIdData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef(null);

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentIdCardData(studentId);
      setIdData(data);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (idData?.verificationUrl) {
      navigator.clipboard.writeText(idData.verificationUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Digital Student ID Pass
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Official candidate credentials for festival stages, dining hall, and syllabus verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleCopyLink}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Link Copied!' : 'Copy Verify URL'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e172a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID Pass</span>
          </button>
        </div>
      </div>

      {/* Centered Pass Stage */}
      <div className="flex justify-center p-2 sm:p-6">
        {/* PHYSICAL BADGE CARD CONTAINER (Printable) */}
        <div
          ref={cardRef}
          id="student-id-badge"
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-[#E6A916]/40 overflow-hidden relative"
        >
          {/* Lanyard Hole Punch Visual */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-stone-200 rounded-full border border-stone-300 shadow-inner z-20" />

          {/* Top Crimson Header with Festival Logo */}
          <div className="bg-[#A91F35] text-white pt-6 pb-4 px-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-12 w-auto mb-1">
                <img
                  src="/assets/dalenzia_fest_logo.png"
                  alt="Dalenzia Fest 2K26"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#E6A916]">
                Official Candidate Delegate
              </div>
              <div className="text-[10px] text-white/80 font-medium">
                Dalailussunna Dars, Ayiroor • 21, 22, 23 DECEMBER 2026
              </div>
            </div>
          </div>

          {/* Gold Decorative Ribbon */}
          <div className="h-1.5 bg-gradient-to-r from-[#E6A916] via-amber-300 to-[#E6A916]" />

          {/* Card Body */}
          <div className="p-6 text-center space-y-4">
            {/* Student Photo & Chest Pill */}
            <div className="relative inline-block mx-auto">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-[#A91F35] to-[#7f1324] text-white flex items-center justify-center font-serif font-black text-4xl shadow-lg border-4 border-white mx-auto">
                {idData?.studentName ? idData.studentName.charAt(0) : 'S'}
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] font-mono font-black text-xs shadow-md border-2 border-white shrink-0">
                {idData?.chestNo}
              </div>
            </div>

            {/* Candidate Identity */}
            <div className="pt-1">
              <h3 className="text-xl font-serif font-black text-stone-900 leading-tight">
                {idData?.studentName}
              </h3>
              <p className="text-xs font-bold text-[#A91F35] mt-0.5">
                {idData?.teamName} Squad • {idData?.classCategory} Category
              </p>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                {idData?.institution}
              </p>
            </div>

            {/* Key Metadata Table */}
            <div className="bg-[#F7F3E9] p-3 rounded-2xl border border-stone-200/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase block">Category</span>
                <span className="font-bold text-stone-800">{idData?.classCategory}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase block">Gender</span>
                <span className="font-bold text-stone-800">{idData?.gender}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase block">Status</span>
                <span className="font-bold text-emerald-700">Verified</span>
              </div>
            </div>

            {/* QR Verification Reference */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-4 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official QR Verification</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">
                  Scannable by Jury Marshals & Reception Staff to authenticate stage entry.
                </p>
                <div className="text-[9px] text-[#A91F35] font-mono font-bold mt-1">
                  ID: DLZ2K26-STU-{idData?.chestNo}
                </div>
              </div>

              {/* Stylized QR Code Graphic */}
              <div className="w-16 h-16 bg-stone-900 p-1.5 rounded-xl shrink-0 flex items-center justify-center text-white shadow-xs">
                <QrCode className="w-full h-full text-white" />
              </div>
            </div>

            {/* Barcode Strip Graphic */}
            <div className="pt-2">
              <div className="h-7 w-full bg-repeating-linear from-black via-transparent to-black opacity-80 rounded-sm flex items-center justify-center">
                <span className="text-[9px] font-mono tracking-widest text-stone-700 bg-white/90 px-2 py-0.5 rounded font-black">
                  *{idData?.chestNo}*DLZ26*
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-stone-400 font-mono mt-1">
                <span>Valid: 21, 22, 23 DECEMBER 2026</span>
                <span>Convener Secretariat</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="bg-stone-100 px-6 py-2.5 border-t border-stone-200 text-center text-[10px] text-stone-500 font-medium">
            Non-transferable • Dalailussunna Dars, Ayiroor, Kerala
          </div>
        </div>
      </div>
    </div>
  );
}
