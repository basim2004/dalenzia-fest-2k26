/**
 * DALENZIA 2K25 – 3D STAGE ARCHITECTURE DATA REGISTRY
 * Extensible configuration for all competitive arena stages.
 * Stage 03 can be added seamlessly by appending to this array.
 */

export const STAGES_3D_DATA = [
  {
    id: 'stage-01',
    code: '01',
    officialName: 'വേദി 1: മറാക്കിഷ് (Marrakech)',
    englishName: 'STAGE CONCEPT 01 – MARRAKECH',
    festivalEdition: 'DALENZIA 2K25',
    category: 'Central Competitive Arena',
    themeMotif: 'Moroccan Imperial Red & Ochre',
    subtitle: 'The Red City & The Resting Place of Seven Saints (Sab\'atu Rijal)',
    referencePhoto: '/assets/dalenzia2k25/stage_01_marrakech_real.jpg',
    conceptPoster: '/assets/dalenzia2k25/stage_concept_01_marrakech.jpg',
    artboard: '/assets/dalenzia2k25/main poters and stages coundown/Artboard 1.png',
    description: 'The monumental central competitive arena of DALENZIA 2K25, inspired by the imperial city of Marrakech. Characterized by a vibrant golden-yellow central backdrop bearing the circular Dalenzia emblem, flanked by maroon and cream geometric pilasters, white flowing curtains, and dual red-carpeted stage tiers illuminated by floor spotlights and recessed LED cove lighting.',
    designElements: [
      { label: 'Central Backdrop', desc: 'Vibrant golden yellow wall with the iconic circular Dalenzia FEST 3D identity disk' },
      { label: 'Flanking Pilasters', desc: 'Moroccan geometric diamonds, maroon panels, and the three scholastic emblems' },
      { label: 'Stage Proscenium', desc: 'Pleated white theatrical drapery and charcoal recessed cove ceiling' },
      { label: 'Stage Flooring', desc: 'Dual-tiered festive red carpet with linear step edge illumination' },
      { label: 'Luminaires', desc: 'Three stage floor uplights casting warm theatrical beams onto the emblem' }
    ],
    // 3D Model Parameters
    modelConfig: {
      backdropColor: '#EAB308', // Warm Golden Yellow
      carpetColor: '#991B1B', // Deep Crimson Red
      stepGlowColor: '#FEF08A', // Warm Yellow Step Glow
      pillarMaroon: '#7F1D1D', // Maroon Pilaster
      pillarCream: '#FEF9C3', // Cream Pilaster
      spotlightColor: '#FDE047', // Warm Spotlights
      curtainColor: '#F8FAFC', // Off-white Pleats
      accentColor: '#B91C1C',
      aspectRatio: 16 / 9
    }
  },
  {
    id: 'stage-02',
    code: '02',
    officialName: 'വേദി 2: MEKNES (മെക്നെസ്)',
    englishName: 'STAGE CONCEPT 02 – MEKNES',
    festivalEdition: 'DALENZIA 2K25',
    category: 'Second Competitive Arena',
    themeMotif: 'Imperial Ocean Blue & Moroccan Waves',
    subtitle: 'The Imperial Citadel of Gates, Souks & Moroccan Authenticity',
    referencePhoto: '/assets/dalenzia2k25/stage_02_meknes_real.jpg',
    conceptPoster: '/assets/dalenzia2k25/stage_concept_02_meknes.jpg',
    artboard: '/assets/dalenzia2k25/main poters and stages coundown/Artboard 2.png',
    description: 'The second competitive arena dedicated to the historic imperial Moroccan capital of Meknes. Features an expansive royal blue backdrop showcasing the white and yellow Dalenzia FEST typography, the official Esencia Oculta Fez-cap insignia, dual-tiered red carpet platforms, and white architectural side portals draped in theatrical curtains.',
    designElements: [
      { label: 'Main Backdrop', desc: 'Expansive royal blue wall with Esencia Oculta motif and bilingual Dalenzia branding' },
      { label: 'Dune Wave Detail', desc: 'Bottom undulating red and white wave contour symbolizing cultural fluidity' },
      { label: 'Side Pillars', desc: 'Architectural white minimalist towers with top-mounted proscenium beam' },
      { label: 'Theatrical Drapes', desc: 'Pleated white side curtains framing the stage arena' },
      { label: 'Platform Architecture', desc: 'Dual-tiered red stage steps engineered for scholastic presentations' }
    ],
    // 3D Model Parameters
    modelConfig: {
      backdropColor: '#1D4ED8', // Royal Blue
      carpetColor: '#991B1B', // Deep Crimson Red
      stepGlowColor: '#BFDBFE', // Soft Blue Glow
      pillarMaroon: '#1E3A8A', // Navy/White
      pillarCream: '#F1F5F9', // Pure White Portal
      spotlightColor: '#60A5FA', // Crisp Blue/White Wash
      curtainColor: '#F8FAFC',
      accentColor: '#2563EB',
      aspectRatio: 16 / 9
    }
  }
];
