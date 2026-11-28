import React, { useEffect, useRef, useState } from 'react';
import { Download, CheckCircle, AlertTriangle, Eye, RefreshCw, QrCode } from 'lucide-react';
import { renderStudentCardToCanvas } from '../../../services/idCardCanvasRenderer';
import { verifyQrPayload } from '../../../services/idCardVerificationService';
import { ID_CARD_CONFIG } from '../../../config/idCardConfig';

export default function StudentIdCardItem({
  student,
  isSelected,
  onToggleSelect,
  onOpenPreview
}) {
  const canvasRef = useRef(null);
  const [isRendering, setIsRendering] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [qrVerified, setQrVerified] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function draw() {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderStudentCardToCanvas(canvasRef.current, student, { scale: 1 });
        const check = await verifyQrPayload(student.expectedQrPayload || ID_CARD_CONFIG.qr.format(student.chestNo, student.id));
        if (isMounted) {
          setVerificationResult(check);
          setQrVerified(check.match);
        }
      } catch (err) {
        console.error('Card render error:', err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    }
    draw();
    return () => { isMounted = false; };
  }, [student]);

  // Export 2x high resolution PNG (2100 x 1200 px)
  const handleDownloadPng = async (e) => {
    e.stopPropagation();
    try {
      const offscreenCanvas = document.createElement('canvas');
      await renderStudentCardToCanvas(offscreenCanvas, student, { scale: 2 });
      const dataUrl = offscreenCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanName = (student.fullName || 'student').replace(/[^a-zA-Z0-9_\-\u0D00-\u0D7F]/g, '_');
      link.download = `${student.chestNo || 'C-000'}_${cleanName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG Download failed:', err);
    }
  };

  return (
    <div className={`group relative rounded-3xl border-2 transition-all duration-300 overflow-hidden bg-stone-900/40 backdrop-blur-sm shadow-md hover:shadow-2xl flex flex-col justify-between ${
      isSelected 
        ? 'border-amber-500 ring-4 ring-amber-500/20 bg-amber-500/5' 
        : 'border-stone-200/80 hover:border-amber-400/60'
    }`}>
      {/* Top action bar */}
      <div className="p-3 bg-white border-b border-stone-100 flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!isSelected}
            onChange={() => onToggleSelect && onToggleSelect(student.id)}
            className="w-4 h-4 rounded text-[#A91F35] focus:ring-amber-500 border-stone-300 transition-all cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-stone-900">{student.chestNo || 'NO-CHEST'}</span>
        </label>

        <div className="flex items-center gap-1.5">
          {qrVerified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              QR Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Verifying...
            </span>
          )}

          <button
            onClick={handleDownloadPng}
            title="Download High-Res 2x PNG (2100x1200)"
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-[#A91F35] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenPreview && onOpenPreview(student)}
            title="Preview Full Size Card"
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-amber-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Canvas Presentation */}
      <div 
        onClick={() => onOpenPreview && onOpenPreview(student)}
        className="p-3 cursor-pointer relative bg-stone-950/5 flex items-center justify-center overflow-hidden aspect-[1050/600]"
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
          className="shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {isRendering && (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center text-amber-300 text-xs font-bold gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Rendering Badge...
          </div>
        )}
      </div>

      {/* Card Info Bottom Strip */}
      <div className="p-3 bg-white/90 border-t border-stone-100 flex items-center justify-between text-xs">
        <div className="min-w-0 pr-2">
          <div className="font-bold text-stone-900 truncate">{student.fullName}</div>
          <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
            <span className="font-semibold text-amber-700">{student.team}</span>
            <span>•</span>
            <span>{student.category}</span>
          </div>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-stone-600">
          {student.id}
        </span>
      </div>
    </div>
  );
}
