import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, RefreshCw, Share2, Award, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PosterModal({ winner, itemTitle, categoryName, onClose, lang }) {
  const canvasRef = useRef(null);
  const [templateIdx, setTemplateIdx] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const templates = [
    {
      id: 'crimson',
      name: 'Crimson & Gold',
      bgGradient: ['#A91F35', '#7A1324'],
      primaryText: '#FFFFFF',
      accentColor: '#E6A916',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      borderColor: '#E6A916',
    },
    {
      id: 'cream',
      name: 'Cream Heritage',
      bgGradient: ['#F7F3E9', '#EAE3D2'],
      primaryText: '#A91F35',
      accentColor: '#A91F35',
      cardBg: '#FFFFFF',
      borderColor: '#A91F35',
    },
    {
      id: 'obsidian',
      name: 'Cyber Obsidian',
      bgGradient: ['#0F1117', '#1A1D27'],
      primaryText: '#FFFFFF',
      accentColor: '#E6A916',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      borderColor: '#E6A916',
    },
  ];

  const currentTpl = templates[templateIdx];

  // Draw Poster on HTML5 Canvas
  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, currentTpl.bgGradient[0]);
    grad.addColorStop(1, currentTpl.bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Borders
    ctx.strokeStyle = currentTpl.borderColor;
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Corner decorative accents
    const drawCorner = (x, y) => {
      ctx.fillStyle = currentTpl.accentColor;
      ctx.fillRect(x - 15, y - 15, 30, 30);
    };
    drawCorner(40, 40);
    drawCorner(width - 40, 40);
    drawCorner(40, height - 40);
    drawCorner(width - 40, height - 40);

    // Header Festival Title
    ctx.textAlign = 'center';
    ctx.fillStyle = currentTpl.accentColor;
    ctx.font = 'bold 36px Poppins, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('DALENZIA FEST 2026', width / 2, 140);

    ctx.fillStyle = currentTpl.primaryText;
    ctx.font = '500 24px Poppins, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('SECOND EDITION · NUEVA ERA', width / 2, 185);

    ctx.font = '400 20px Poppins, sans-serif';
    ctx.fillStyle = currentTpl.templateIdx === 1 ? '#666666' : 'rgba(255,255,255,0.7)';
    ctx.fillText('Dalailussunna Dars, Ayiroor, Malappuram', width / 2, 220);

    // Divider Line
    ctx.strokeStyle = currentTpl.accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, 250);
    ctx.lineTo(width / 2 + 180, 250);
    ctx.stroke();

    // Central Ribbon / Rank Card
    const rankText =
      winner.rank === 1
        ? '★ FIRST PRIZE ★'
        : winner.rank === 2
        ? '★ SECOND PRIZE ★'
        : '★ THIRD PRIZE ★';

    ctx.fillStyle = currentTpl.accentColor;
    ctx.font = '800 44px Poppins, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(rankText, width / 2, 360);

    // Category & Item
    ctx.fillStyle = currentTpl.templateIdx === 1 ? '#444444' : 'rgba(255,255,255,0.85)';
    ctx.font = '600 32px Poppins, sans-serif';
    ctx.fillText(`${categoryName.toUpperCase()}`, width / 2, 420);

    ctx.fillStyle = currentTpl.accentColor;
    ctx.font = 'bold 42px DM Serif Display, serif';
    ctx.fillText(`"${itemTitle}"`, width / 2, 480);

    // Candidate Name Card Box
    const cardY = 560;
    const cardH = 360;
    const cardW = 860;
    const cardX = (width - cardW) / 2;

    ctx.fillStyle = currentTpl.cardBg;
    ctx.strokeStyle = currentTpl.borderColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.stroke();

    // Winner Name
    ctx.fillStyle = currentTpl.primaryText;
    ctx.font = 'bold 64px Poppins, sans-serif';
    ctx.fillText(winner.name, width / 2, cardY + 130);

    // Chest No & Grade
    ctx.font = '600 30px Poppins, sans-serif';
    ctx.fillStyle = currentTpl.accentColor;
    ctx.fillText(`CHEST NO: ${winner.chestNo}  |  GRADE: ${winner.grade}`, width / 2, cardY + 200);

    // Sector Name
    ctx.fillStyle = currentTpl.primaryText;
    ctx.font = 'bold 36px Poppins, sans-serif';
    ctx.fillText(`SECTOR: ${winner.sector.toUpperCase()}`, width / 2, cardY + 280);

    // Official Seal / Bottom Branding
    ctx.fillStyle = currentTpl.accentColor;
    ctx.font = 'bold 26px Poppins, sans-serif';
    ctx.fillText('DALAILUSSUNNA DARS · AYIROOR', width / 2, 1160);

    ctx.fillStyle = currentTpl.templateIdx === 1 ? '#777777' : 'rgba(255,255,255,0.7)';
    ctx.font = '400 20px Poppins, sans-serif';
    ctx.fillText('December 21–22, 2026 · Perumpadappu, Malappuram', width / 2, 1200);

    // Verification code
    ctx.font = '400 16px monospace';
    ctx.fillText(`AUTH: DLZ26-${winner.chestNo}-${winner.rank}-${Date.now().toString().slice(-4)}`, width / 2, 1240);
  };

  useEffect(() => {
    drawPoster();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#A91F35', '#E6A916', '#FFFFFF'],
    });
  }, [templateIdx, winner]);

  // Switch Template
  const handleSwitchTemplate = () => {
    setTemplateIdx((prev) => (prev + 1) % templates.length);
  };

  // Download Poster as High-Res PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDownloading(true);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Dalenzia_Winner_${winner.name.replace(/\s+/g, '_')}_${winner.chestNo}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const text = `🏆 Dalenzia Fest 2026 Winner!\n\nName: ${winner.name}\nItem: ${itemTitle}\nRank: ${winner.rank === 1 ? '1st Prize' : winner.rank === 2 ? '2nd Prize' : '3rd Prize'}\nSector: ${winner.sector}\n\n#DalenziaFest2026 #NuevaEra #Ayiroor`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-[#1c1917] rounded-3xl p-5 text-white shadow-2xl border border-white/10 flex flex-col items-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6A916]">
              Winner Certificate Poster
            </span>
            <h3 className="text-lg font-serif font-bold text-white">
              Official Poster Generator
            </h3>
          </div>

          {/* Canvas Preview Container (Aspect 4:5) */}
          <div className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black/40 mb-4">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block"
              style={{ maxHeight: '380px' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <button
                onClick={handleSwitchTemplate}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white border border-white/15 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Template ({currentTpl.name})</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1 py-2.5 px-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded-xl text-xs font-semibold border border-[#25D366]/40 transition-all"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#E6A916] text-[#A91F35] font-extrabold text-sm rounded-xl shadow-lg hover:bg-[#ffd166] active:scale-95 transition-all"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-green-700" />
                  <span>Downloaded Poster!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download High-Res Poster (PNG)</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
