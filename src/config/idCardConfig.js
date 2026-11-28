/**
 * Central Configuration for DALENZIA FEST 2K26 Student ID Card Studio
 * 
 * Strict Brand Guidelines Compliance:
 * - Dimensions: 88.9 x 50.8 mm (3.5 x 2 in) landscape + 3 mm bleed
 * - Color Palette: Deep Crimson #A91F35, Golden Yellow #E6A916, Warm Cream #F7F3E9, Pure White #FFFFFF
 * - Typography: Poppins Bold / Medium / Regular, DM Serif Display (numerals/accent), Noto Sans Malayalam
 * - QR Payload: "DLZ26|<Chest No>|<Student ID>" (configurable payload template)
 */

export const ID_CARD_CONFIG = {
  festival: {
    title: 'DALENZIA FEST',
    edition: 'Second Edition',
    dates: '2026 Dec 21, 22, 23',
    venue: 'Masjidul Liwah, Kandu Bazaar, Puthanpalli, Ayiroor',
    institution: 'DALAILUSSUNNA DARS',
    subText: 'PERUMPADAPPU - AYIROOR - MALAPPURAM 679580  Ph +91 8589951951',
    phone: '+91 8589951951',
    theme: 'NUEVA ERA',
    tagline: 'A New Era Begins'
  },

  dimensions: {
    widthMm: 88.9,
    heightMm: 50.8,
    bleedMm: 3.0,
    widthInches: 3.5,
    heightInches: 2.0,
    previewWidthPx: 1050,
    previewHeightPx: 600,
    exportDpi: 300,
    minQrSizeMm: 20, // 20 x 20 mm minimum printed size
    innerMarginMm: 4.0,
    elementSpacingMm: 6.0
  },

  colors: {
    crimson: '#A91F35',
    crimsonDark: '#7F1325',
    gold: '#E6A916',
    goldLight: '#F5C242',
    cream: '#F7F3E9',
    white: '#FFFFFF',
    textDark: '#1C1917',
    textMuted: '#78716C'
  },

  qr: {
    payloadTemplate: 'DLZ26|{chestNo}|{studentId}',
    errorCorrectionLevel: 'Q',
    margin: 4,
    caption: 'Scan for verification',
    format: (chestNo, studentId) => `DLZ26|${chestNo || ''}|${studentId || ''}`
  },

  assets: {
    nuevaEraReverse: '/assets/brand/official_nueva_era_reverse_white.png',
    darsLogo: '/assets/brand/dars_logo.png',
    mandala: '/assets/mandala.png',
    waveLines: '/assets/wave_lines.png',
    pixelSquares: '/assets/pixel_squares.png',
    goldenHourglass: '/assets/golden_hourglass.png',
    bannerBlank: '/assets/banner_blank.png'
  },

  sheets: {
    A3_PORTRAIT: {
      id: 'a3_portrait',
      name: 'A3 Portrait (Recommended)',
      pageWidthMm: 297,
      pageHeightMm: 420,
      columns: 3,
      rows: 7,
      cardsPerPage: 21,
      marginMm: 12,
      gapMm: 3
    },
    A3_LANDSCAPE: {
      id: 'a3_landscape',
      name: 'A3 Landscape',
      pageWidthMm: 420,
      pageHeightMm: 297,
      columns: 4,
      rows: 5,
      cardsPerPage: 20,
      marginMm: 12,
      gapMm: 3
    },
    A4_PORTRAIT: {
      id: 'a4_portrait',
      name: 'A4 Portrait',
      pageWidthMm: 210,
      pageHeightMm: 297,
      columns: 2,
      rows: 5,
      cardsPerPage: 10,
      marginMm: 10,
      gapMm: 3
    }
  }
};
