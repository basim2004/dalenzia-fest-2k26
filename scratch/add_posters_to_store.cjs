const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../src/admin/data/festivalStore.js');
let content = fs.readFileSync(storePath, 'utf8');

console.log('Original festivalStore size:', content.length, 'bytes');

// 1. Check if posterCategories already present
if (content.includes('posterCategories: [')) {
  console.log('posterCategories already present');
} else {
  // Find where galleryMedia ends and auditLogs starts
  const auditLogsIdx = content.indexOf('auditLogs: [');
  if (auditLogsIdx === -1) {
    throw new Error('Could not find auditLogs in festivalStore.js');
  }

  const posterDataInjection = `  // 12. Poster Categories (Step 09 - Posters & Templates Management)
  posterCategories: [
    { id: 'CAT-MAIN', name: 'Festival Main Posters', color: '#A91F35', description: 'Flagship theme releases, brand launches, and key festival identities' },
    { id: 'CAT-PRG', name: 'Programme Posters', color: '#E6A916', description: 'Posters and flyers dedicated to major ceremonies, conclaves, and scholastic symposia' },
    { id: 'CAT-CMP', name: 'Competition Posters', color: '#2563EB', description: 'Competition callouts, guidelines, and literary/art arena promo sheets' },
    { id: 'CAT-RES', name: 'Result Posters', color: '#10B981', description: 'Official verified winner proclamations, score sheets, and podium declarations' },
    { id: 'CAT-GST', name: 'Guest Posters', color: '#8B5CF6', description: 'Dignitary welcomes, scholar profile cards, and key speaker salutations' },
    { id: 'CAT-ANN', name: 'Announcement Posters', color: '#D97706', description: 'Secretariat notices, schedule adjustments, and urgent circulars' },
    { id: 'CAT-SPE', name: 'Special Day Posters', color: '#EC4899', description: 'Milad celebrations, historic memorial graphics, and festival day greetings' },
    { id: 'CAT-OTH', name: 'Other Posters', color: '#64748B', description: 'Campus maps, signage, volunteer recognitions, and miscellaneous artwork' }
  ],

  // 13. Poster Records (Step 09 - Posters & Templates Management)
  posters: [
    {
      id: 'POSTER-01',
      title: 'Dalenzia Fest 2K26 Official Main Theme Poster (Nueva Era)',
      shortDescription: 'The official visual embodiment of the Nueva Era theme celebrating tradition, scholastic heritage, and cultural renaissance.',
      category: 'Festival Main Posters',
      fileUrl: '/assets/main_poster.jpg',
      fileName: 'dalenzia_official_main_poster_2k26.jpg',
      fileSize: '12.4 MB',
      fileType: 'image/jpeg',
      dimensions: 'A3 (3508 x 4960 px)',
      relatedProgrammeId: 'PRG-002',
      relatedProgrammeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      relatedResultId: null,
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 342,
      viewsCount: 1890,
      tags: ['Official', 'Theme', 'Nueva Era', 'Main'],
      createdAt: '2026-12-10T10:00:00Z',
      createdDate: 'Dec 10, 2026',
      updatedAt: '2026-12-10T10:00:00Z',
      approvalHistory: [
        { status: 'Draft', changedBy: 'Design Bureau', changedAt: '2026-12-08T09:00:00Z', reason: 'Initial draft upload' },
        { status: 'Approved', changedBy: 'Fest Controller', changedAt: '2026-12-09T14:30:00Z', reason: 'Approved by steering committee' },
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-10T10:00:00Z', reason: 'Published to public portal' }
      ]
    },
    {
      id: 'POSTER-02',
      title: 'Junior Arabic Essay Championship Official Poster',
      shortDescription: 'Call for entries and rubric guidelines for the Junior Arabic Essay championship at Ibn Khaldun Academic Hall.',
      category: 'Competition Posters',
      fileUrl: '/assets/events/comp_arabic_essay.png',
      fileName: 'comp_junior_arabic_essay.png',
      fileSize: '3.8 MB',
      fileType: 'image/png',
      dimensions: '1080 x 1350 px (4:5)',
      relatedProgrammeId: 'PRG-005',
      relatedProgrammeTitle: 'Literary & Linguistic Competitions Round 1',
      relatedCompetitionId: 'COMP-LIT-01',
      relatedCompetitionTitle: 'Junior Arabic Essay (LIT-JR-102)',
      relatedResultId: null,
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 185,
      viewsCount: 920,
      tags: ['Competition', 'Arabic', 'Literary', 'Junior'],
      createdAt: '2026-12-12T11:00:00Z',
      createdDate: 'Dec 12, 2026',
      updatedAt: '2026-12-12T11:00:00Z',
      approvalHistory: [
        { status: 'Draft', changedBy: 'Literary Guild', changedAt: '2026-12-11T10:00:00Z' },
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-12T11:00:00Z' }
      ]
    },
    {
      id: 'POSTER-03',
      title: 'Grand Inauguration Ceremony & Cultural Assembly',
      shortDescription: 'Ceremonial opening convocations, keynote declarations, and presence of distinguished patrons at Cordova Grand Stage.',
      category: 'Programme Posters',
      fileUrl: '/assets/models/Dalenzia Fest Nueva Era Hero Banner.png',
      fileName: 'prg_grand_inauguration_banner.png',
      fileSize: '8.2 MB',
      fileType: 'image/png',
      dimensions: '1920 x 1080 px (16:9)',
      relatedProgrammeId: 'PRG-002',
      relatedProgrammeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      relatedResultId: null,
      displayOrder: 3,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 240,
      viewsCount: 1450,
      tags: ['Inauguration', 'Ceremony', 'Keynote', 'Grand Stage'],
      createdAt: '2026-12-14T09:00:00Z',
      createdDate: 'Dec 14, 2026',
      updatedAt: '2026-12-14T09:00:00Z',
      approvalHistory: [
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-14T09:00:00Z' }
      ]
    },
    {
      id: 'POSTER-04',
      title: 'Dignitary Salutation: Dr. Sayyid Munawwar Ali Shihab Thangal',
      shortDescription: 'Institutional welcome and academic tribute to Chief Patron Dr. Sayyid Munawwar Ali for the inaugural conclave.',
      category: 'Guest Posters',
      fileUrl: '/assets/guests/portrait_sayyid_munawwar.png',
      fileName: 'guest_sayyid_munawwar_ali.png',
      fileSize: '4.1 MB',
      fileType: 'image/png',
      dimensions: '1080 x 1350 px (4:5)',
      relatedProgrammeId: 'PRG-002',
      relatedProgrammeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      relatedResultId: null,
      displayOrder: 4,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 310,
      viewsCount: 1680,
      tags: ['Guest', 'Dignitary', 'Scholar', 'Welcome'],
      createdAt: '2026-12-15T14:00:00Z',
      createdDate: 'Dec 15, 2026',
      updatedAt: '2026-12-15T14:00:00Z',
      approvalHistory: [
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-15T14:00:00Z' }
      ]
    },
    {
      id: 'POSTER-05',
      title: 'Junior Arabic Essay Result Declaration & Honors Folio',
      shortDescription: 'Official verified honors folio proclaiming 1st, 2nd and 3rd prize winners in the Junior Arabic Essay championship.',
      category: 'Result Posters',
      fileUrl: '/assets/results/results_hero_stage.png',
      fileName: 'result_junior_arabic_essay.png',
      fileSize: '5.6 MB',
      fileType: 'image/png',
      dimensions: '1080 x 1350 px (4:5)',
      relatedProgrammeId: 'PRG-005',
      relatedProgrammeTitle: 'Literary & Linguistic Competitions Round 1',
      relatedCompetitionId: 'COMP-LIT-01',
      relatedCompetitionTitle: 'Junior Arabic Essay (LIT-JR-102)',
      relatedResultId: 'POS-01',
      displayOrder: 5,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 420,
      viewsCount: 2150,
      tags: ['Result', 'Winners', 'Arabic Essay', 'Honors'],
      createdAt: '2026-12-21T17:40:00Z',
      createdDate: 'Dec 21, 2026',
      updatedAt: '2026-12-21T17:40:00Z',
      approvalHistory: [
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-21T17:40:00Z', reason: 'Verified judge marksheets certified' }
      ]
    },
    {
      id: 'POSTER-06',
      title: 'Classical Thuluth Calligraphy Grand Exhibition Poster',
      shortDescription: 'Exhibition and competitive display of classical Arabic calligraphy manuscripts, pens, and illumination folios.',
      category: 'Competition Posters',
      fileUrl: '/assets/events/comp_poster_design.png',
      fileName: 'comp_calligraphy_exhibition.png',
      fileSize: '6.4 MB',
      fileType: 'image/png',
      dimensions: '1080 x 1350 px (4:5)',
      relatedProgrammeId: 'PRG-012',
      relatedProgrammeTitle: 'Digital Heritage & Calligraphic Design Workshop',
      relatedCompetitionId: 'COMP-ART-02',
      relatedCompetitionTitle: 'Visual Arts: Islamic Calligraphy (ART-SR-301)',
      relatedResultId: null,
      displayOrder: 6,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 145,
      viewsCount: 780,
      tags: ['Calligraphy', 'Exhibition', 'Art', 'Thuluth'],
      createdAt: '2026-12-16T12:00:00Z',
      createdDate: 'Dec 16, 2026',
      updatedAt: '2026-12-16T12:00:00Z',
      approvalHistory: [
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-16T12:00:00Z' }
      ]
    },
    {
      id: 'POSTER-07',
      title: 'Academic Conclave: Classical Arabic Philology in Modern Era',
      shortDescription: 'Symposium banner for keynote addresses on classical Arabic texts, linguistic developments, and contemporary scholarship.',
      category: 'Programme Posters',
      fileUrl: '/assets/models/Dalenzia Fest_ A New Era of Ideas.png',
      fileName: 'prg_academic_conclave_philology.png',
      fileSize: '7.1 MB',
      fileType: 'image/png',
      dimensions: '1920 x 1080 px (16:9)',
      relatedProgrammeId: 'PRG-003',
      relatedProgrammeTitle: 'Keynote Conclave: Nueva Era & Classical Heritage',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      relatedResultId: null,
      displayOrder: 7,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 198,
      viewsCount: 1120,
      tags: ['Philology', 'Symposium', 'Scholarship', 'Arabic'],
      createdAt: '2026-12-17T15:00:00Z',
      createdDate: 'Dec 17, 2026',
      updatedAt: '2026-12-17T15:00:00Z',
      approvalHistory: [
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-17T15:00:00Z' }
      ]
    },
    {
      id: 'POSTER-08',
      title: 'Urgent Secretariat Circular: Team Badge Re-Verification Notice',
      shortDescription: 'Official administrative instructions regarding chest number validation and team registration confirmation.',
      category: 'Announcement Posters',
      fileUrl: '/assets/admin/admin_hero_banner.png',
      fileName: 'notice_team_badge_verification.png',
      fileSize: '2.1 MB',
      fileType: 'image/png',
      dimensions: 'A4 Portrait',
      relatedProgrammeId: null,
      relatedProgrammeTitle: null,
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      relatedResultId: null,
      displayOrder: 8,
      status: 'Draft',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 0,
      viewsCount: 12,
      tags: ['Notice', 'Secretariat', 'Badges', 'Internal'],
      createdAt: '2026-12-18T10:30:00Z',
      createdDate: 'Dec 18, 2026',
      updatedAt: '2026-12-18T10:30:00Z',
      approvalHistory: [
        { status: 'Draft', changedBy: 'Secretariat Admin', changedAt: '2026-12-18T10:30:00Z', reason: 'Drafting announcement' }
      ]
    },
    {
      id: 'POSTER-09',
      title: 'Milad Commemorative Salawat Assembly Special Poster',
      shortDescription: 'Spiritual assembly poster with recitation schedules, devotional poetry sessions, and blessed remembrance itinerary.',
      category: 'Special Day Posters',
      fileUrl: '/assets/schedule/schedule_hero_stage.png',
      fileName: 'special_milad_assembly_poster.png',
      fileSize: '4.5 MB',
      fileType: 'image/png',
      dimensions: '1080 x 1350 px (4:5)',
      relatedProgrammeId: 'PRG-006',
      relatedProgrammeTitle: 'Evening Scholastic Assembly: Tradition Radiating Forward',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      relatedResultId: null,
      displayOrder: 9,
      status: 'Pending Approval',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 0,
      viewsCount: 34,
      tags: ['Milad', 'Spiritual', 'Assembly', 'Special'],
      createdAt: '2026-12-19T16:00:00Z',
      createdDate: 'Dec 19, 2026',
      updatedAt: '2026-12-19T16:00:00Z',
      approvalHistory: [
        { status: 'Draft', changedBy: 'Cultural Committee', changedAt: '2026-12-19T11:00:00Z' },
        { status: 'Pending Approval', changedBy: 'Cultural Lead', changedAt: '2026-12-19T16:00:00Z', reason: 'Submitted for Admin verification' }
      ]
    },
    {
      id: 'POSTER-10',
      title: 'Grand Valedictory Conclave & Championship Award Ceremony',
      shortDescription: 'Official ceremony poster for the grand finale, rolling trophy presentation, and closing festival benediction.',
      category: 'Programme Posters',
      fileUrl: '/assets/models/Dalenzia Nueva Era Festival Storyboard.png',
      fileName: 'prg_valedictory_grand_finale.png',
      fileSize: '9.3 MB',
      fileType: 'image/png',
      dimensions: '1920 x 1080 px (16:9)',
      relatedProgrammeId: 'PRG-011',
      relatedProgrammeTitle: 'Grand Valedictory Conclave & Championship Award',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      relatedResultId: null,
      displayOrder: 10,
      status: 'Published',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 275,
      viewsCount: 1510,
      tags: ['Valedictory', 'Trophy', 'Awards', 'Finale'],
      createdAt: '2026-12-20T11:00:00Z',
      createdDate: 'Dec 20, 2026',
      updatedAt: '2026-12-20T11:00:00Z',
      approvalHistory: [
        { status: 'Published', changedBy: 'Super Admin', changedAt: '2026-12-20T11:00:00Z' }
      ]
    }
  ],

  // 14. Poster Templates (Step 09 - Posters & Templates Management)
  posterTemplates: [
    {
      id: 'TMPL-01',
      name: 'Official Result Announcement Master Template (Gold Royal)',
      category: 'Result Posters',
      previewUrl: '/assets/models/Dalenzia Fest Results Leaderboard.png',
      originalFileUrl: '/assets/models/Dalenzia Fest Results Leaderboard.png',
      originalFileName: 'dalenzia_result_template_gold.psd',
      description: 'Layered Adobe Photoshop (.PSD) master file with vector typography, podium rankings, gold foil effects, and chest number smart objects.',
      dimensions: '1080 x 1350 px (4:5 Portrait)',
      softwareFormat: 'Adobe Photoshop (.PSD)',
      fileSize: '18.4 MB',
      status: 'Active',
      isArchived: false,
      downloadsCount: 88,
      createdAt: '2026-12-05T10:00:00Z',
      updatedAt: '2026-12-05T10:00:00Z'
    },
    {
      id: 'TMPL-02',
      name: 'Programme Schedule & Stage Schedule Flyer (Crimson Edition)',
      category: 'Programme Posters',
      previewUrl: '/assets/models/Dalenzia Fest 2K26 Programme Schedule.png',
      originalFileUrl: '/assets/models/Dalenzia Fest 2K26 Programme Schedule.png',
      originalFileName: 'dalenzia_programme_flyer_crimson.ai',
      description: 'Adobe Illustrator (.AI) vector layout engineered for daily timeline sheets, speaker tags, multi-venue grids, and mobile story format.',
      dimensions: '1080 x 1920 px (9:16 Story)',
      softwareFormat: 'Adobe Illustrator (.AI)',
      fileSize: '24.2 MB',
      status: 'Active',
      isArchived: false,
      downloadsCount: 65,
      createdAt: '2026-12-06T11:00:00Z',
      updatedAt: '2026-12-06T11:00:00Z'
    },
    {
      id: 'TMPL-03',
      name: 'Guest of Honour Salutation & Welcome Banner',
      category: 'Guest Posters',
      previewUrl: '/assets/models/Guests of Honour Festival Showcase.png',
      originalFileUrl: '/assets/models/Guests of Honour Festival Showcase.png',
      originalFileName: 'dalenzia_guest_salutation_master.psd',
      description: 'High-resolution wide banner template for dignitary welcomes, Islamic arch filigree, scholar designation blocks, and stage backdrop prints.',
      dimensions: '1920 x 1080 px (16:9 Landscape)',
      softwareFormat: 'Adobe Photoshop (.PSD)',
      fileSize: '32.0 MB',
      status: 'Active',
      isArchived: false,
      downloadsCount: 54,
      createdAt: '2026-12-07T12:00:00Z',
      updatedAt: '2026-12-07T12:00:00Z'
    },
    {
      id: 'TMPL-04',
      name: 'Competition Winner Badge & Social Media Story Card',
      category: 'Competition Posters',
      previewUrl: '/assets/models/Dalenzia Fest Events & Competitions.png',
      originalFileUrl: '/assets/models/Dalenzia Fest Events & Competitions.png',
      originalFileName: 'dalenzia_winner_social_pack.fig',
      description: 'Figma design system bundle with auto-layout variants for individual and team prize declarations, chest badges, and Instagram story frames.',
      dimensions: '1080 x 1920 px (9:16)',
      softwareFormat: 'Figma Component (.FIG)',
      fileSize: '12.8 MB',
      status: 'Active',
      isArchived: false,
      downloadsCount: 92,
      createdAt: '2026-12-08T14:00:00Z',
      updatedAt: '2026-12-08T14:00:00Z'
    },
    {
      id: 'TMPL-05',
      name: 'Official Festival Secretariat Letterhead & Circular Template',
      category: 'Announcement Posters',
      previewUrl: '/assets/banner_full.png',
      originalFileUrl: '/assets/banner_full.png',
      originalFileName: 'dalenzia_official_circular_master.pdf',
      description: 'Print-ready institutional document template with Ayiroor campus header, registration watermark, secretary sign-off box, and seal markers.',
      dimensions: 'A4 (210 x 297 mm)',
      softwareFormat: 'Print PDF / Word',
      fileSize: '4.2 MB',
      status: 'Active',
      isArchived: false,
      downloadsCount: 110,
      createdAt: '2026-12-09T16:00:00Z',
      updatedAt: '2026-12-09T16:00:00Z'
    }
  ],
\n`;

  content = content.slice(0, auditLogsIdx) + posterDataInjection + content.slice(auditLogsIdx);
  console.log('Injected posterCategories, posters, and posterTemplates into INITIAL_DATA');
}

// 2. Add ensure checks to loadData()
const loadDataAnchor = 'if (!currentData.galleryMedia || !Array.isArray(currentData.galleryMedia) || currentData.galleryMedia.length < 10) {';
if (!content.includes('if (!currentData.posters || !Array.isArray(currentData.posters) || currentData.posters.length < 5) {')) {
  const ensureIdx = content.indexOf(loadDataAnchor);
  if (ensureIdx !== -1) {
    const nextLineIdx = content.indexOf('currentData.galleryMedia = INITIAL_DATA.galleryMedia;\n    }', ensureIdx);
    const insertPoint = nextLineIdx + 'currentData.galleryMedia = INITIAL_DATA.galleryMedia;\n    }'.length;

    const ensureCode = `\n    if (!currentData.posterCategories || !Array.isArray(currentData.posterCategories) || currentData.posterCategories.length === 0) {
      currentData.posterCategories = INITIAL_DATA.posterCategories;
    }
    if (!currentData.posters || !Array.isArray(currentData.posters) || currentData.posters.length < 5) {
      currentData.posters = INITIAL_DATA.posters;
    }
    if (!currentData.posterTemplates || !Array.isArray(currentData.posterTemplates) || currentData.posterTemplates.length < 3) {
      currentData.posterTemplates = INITIAL_DATA.posterTemplates;
    }`;

    content = content.slice(0, insertPoint) + ensureCode + content.slice(insertPoint);
    console.log('Injected loadData ensure checks for posters & templates');
  }
}

// 3. Add Posters & Templates Methods before final closing brace of FestivalStore
if (!content.includes('getPosterCategories()')) {
  const lastBraceIdx = content.lastIndexOf('}\n\nexport const festivalStore');
  if (lastBraceIdx === -1) {
    throw new Error('Could not find end of FestivalStore class');
  }

  const posterMethods = `
  // =========================================================================
  // STEP 09 - POSTERS & TEMPLATES MANAGEMENT
  // =========================================================================

  getPosterCategories() {
    return this.data.posterCategories || [];
  }

  getPosters(options = {}) {
    let list = [...(this.data.posters || [])];
    const {
      category = 'all',
      status = 'all',
      programmeId = 'all',
      competitionId = 'all',
      includeArchived = false,
      query = '',
      sortBy = 'newest'
    } = options;

    if (!includeArchived) {
      list = list.filter(p => !p.isArchived && p.status !== 'Archived');
    }

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    if (status && status !== 'all') {
      list = list.filter(p => p.status === status);
    }

    if (programmeId && programmeId !== 'all') {
      list = list.filter(p => p.relatedProgrammeId === programmeId);
    }

    if (competitionId && competitionId !== 'all') {
      list = list.filter(p => p.relatedCompetitionId === competitionId);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.relatedProgrammeTitle && p.relatedProgrammeTitle.toLowerCase().includes(q)) ||
        (p.relatedCompetitionTitle && p.relatedCompetitionTitle.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'order') {
      list.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    } else if (sortBy === 'downloads') {
      list.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }

  getPosterById(id) {
    return (this.data.posters || []).find(p => p.id === id) || null;
  }

  addPoster(posterData, adminUser = 'Super Admin') {
    const list = this.data.posters || [];
    const maxNum = list.reduce((max, p) => {
      const match = (p.id || '').match(/POSTER-(\\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 0);
    const newId = \`POSTER-\${(maxNum + 1).toString().padStart(2, '0')}\`;

    // Auto-resolve programme title if ID provided
    let progTitle = posterData.relatedProgrammeTitle || null;
    if (posterData.relatedProgrammeId && !progTitle) {
      const prog = (this.data.programmes || []).find(p => p.id === posterData.relatedProgrammeId);
      if (prog) progTitle = prog.title;
    }

    // Auto-resolve competition title if ID provided
    let compTitle = posterData.relatedCompetitionTitle || null;
    if (posterData.relatedCompetitionId && !compTitle) {
      const comp = (this.data.competitions || []).find(c => c.id === posterData.relatedCompetitionId);
      if (comp) compTitle = comp.title;
    }

    const now = new Date().toISOString();
    const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newPoster = {
      id: newId,
      title: posterData.title || 'Untitled Poster',
      shortDescription: posterData.shortDescription || '',
      category: posterData.category || 'Festival Main Posters',
      fileUrl: posterData.fileUrl || '/assets/main_poster.jpg',
      fileName: posterData.fileName || 'poster_file.jpg',
      fileSize: posterData.fileSize || '3.5 MB',
      fileType: posterData.fileType || 'image/jpeg',
      dimensions: posterData.dimensions || '1080 x 1350 px',
      relatedProgrammeId: posterData.relatedProgrammeId || null,
      relatedProgrammeTitle: progTitle,
      relatedCompetitionId: posterData.relatedCompetitionId || null,
      relatedCompetitionTitle: compTitle,
      relatedResultId: posterData.relatedResultId || null,
      displayOrder: parseInt(posterData.displayOrder, 10) || (list.length + 1),
      status: posterData.status || 'Draft',
      isArchived: false,
      rejectionReason: null,
      downloadsCount: 0,
      viewsCount: 0,
      tags: Array.isArray(posterData.tags) ? posterData.tags : (posterData.tags ? posterData.tags.split(',').map(t => t.trim()) : []),
      createdAt: now,
      createdDate: createdDate,
      updatedAt: now,
      approvalHistory: [
        {
          status: posterData.status || 'Draft',
          changedBy: adminUser,
          changedAt: now,
          reason: posterData.status === 'Published' ? 'Published upon creation' : 'Initial upload'
        }
      ]
    };

    this.data.posters.unshift(newPoster);
    this.addAuditLog('POSTER_CREATED', adminUser, \`Created poster "\${newPoster.title}" (\${newPoster.id}) in category \${newPoster.category}\`);
    this.saveData();
    return newPoster;
  }

  updatePoster(id, updateData, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(\`Poster \${id} not found\`);

    // Auto-resolve programme title if changed
    if (updateData.relatedProgrammeId && updateData.relatedProgrammeId !== poster.relatedProgrammeId) {
      const prog = (this.data.programmes || []).find(p => p.id === updateData.relatedProgrammeId);
      if (prog) updateData.relatedProgrammeTitle = prog.title;
    }

    // Auto-resolve competition title if changed
    if (updateData.relatedCompetitionId && updateData.relatedCompetitionId !== poster.relatedCompetitionId) {
      const comp = (this.data.competitions || []).find(c => c.id === updateData.relatedCompetitionId);
      if (comp) updateData.relatedCompetitionTitle = comp.title;
    }

    if (updateData.status && updateData.status !== poster.status) {
      if (!poster.approvalHistory) poster.approvalHistory = [];
      poster.approvalHistory.push({
        status: updateData.status,
        changedBy: adminUser,
        changedAt: new Date().toISOString(),
        reason: updateData.statusReason || \`Status changed to \${updateData.status}\`
      });
      if (updateData.status === 'Archived') {
        poster.isArchived = true;
      } else if (poster.isArchived && updateData.status !== 'Archived') {
        poster.isArchived = false;
      }
    }

    Object.assign(poster, updateData);
    poster.updatedAt = new Date().toISOString();

    this.addAuditLog('POSTER_UPDATED', adminUser, \`Updated poster "\${poster.title}" (\${poster.id})\`);
    this.saveData();
    return poster;
  }

  approvePoster(id, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(\`Poster \${id} not found\`);

    if (!poster.approvalHistory) poster.approvalHistory = [];
    poster.approvalHistory.push({
      status: 'Approved',
      changedBy: adminUser,
      changedAt: new Date().toISOString(),
      reason: 'Approved for festival publication'
    });

    poster.status = 'Approved';
    poster.rejectionReason = null;
    poster.updatedAt = new Date().toISOString();

    this.addAuditLog('POSTER_APPROVED', adminUser, \`Approved poster "\${poster.title}" (\${poster.id})\`);
    this.saveData();
    return poster;
  }

  rejectPoster(id, reason, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(\`Poster \${id} not found\`);

    if (!poster.approvalHistory) poster.approvalHistory = [];
    poster.approvalHistory.push({
      status: 'Draft',
      changedBy: adminUser,
      changedAt: new Date().toISOString(),
      reason: reason || 'Revision required'
    });

    poster.status = 'Draft';
    poster.rejectionReason = reason || 'Revision required by administration';
    poster.updatedAt = new Date().toISOString();

    this.addAuditLog('POSTER_REJECTED', adminUser, \`Rejected poster "\${poster.title}" (\${poster.id}): \${reason}\`);
    this.saveData();
    return poster;
  }

  publishPoster(id, isPublished = true, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(\`Poster \${id} not found\`);

    const newStatus = isPublished ? 'Published' : 'Draft';
    if (!poster.approvalHistory) poster.approvalHistory = [];
    poster.approvalHistory.push({
      status: newStatus,
      changedBy: adminUser,
      changedAt: new Date().toISOString(),
      reason: isPublished ? 'Published to public portal' : 'Unpublished to draft'
    });

    poster.status = newStatus;
    poster.isArchived = false;
    poster.updatedAt = new Date().toISOString();

    this.addAuditLog('POSTER_PUBLISH_TOGGLE', adminUser, \`Set poster "\${poster.title}" status to \${newStatus}\`);
    this.saveData();
    return poster;
  }

  archivePoster(id, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(\`Poster \${id} not found\`);

    if (!poster.approvalHistory) poster.approvalHistory = [];
    poster.approvalHistory.push({
      status: 'Archived',
      changedBy: adminUser,
      changedAt: new Date().toISOString(),
      reason: 'Archived by administrator'
    });

    poster.status = 'Archived';
    poster.isArchived = true;
    poster.updatedAt = new Date().toISOString();

    this.addAuditLog('POSTER_ARCHIVED', adminUser, \`Archived poster "\${poster.title}" (\${poster.id})\`);
    this.saveData();
    return poster;
  }

  restorePoster(id, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(\`Poster \${id} not found\`);

    if (!poster.approvalHistory) poster.approvalHistory = [];
    poster.approvalHistory.push({
      status: 'Draft',
      changedBy: adminUser,
      changedAt: new Date().toISOString(),
      reason: 'Restored from archive'
    });

    poster.status = 'Draft';
    poster.isArchived = false;
    poster.updatedAt = new Date().toISOString();

    this.addAuditLog('POSTER_RESTORED', adminUser, \`Restored poster "\${poster.title}" (\${poster.id}) to Draft\`);
    this.saveData();
    return poster;
  }

  deletePoster(id, { adminUser = 'Super Admin' } = {}) {
    const index = (this.data.posters || []).findIndex(p => p.id === id);
    if (index === -1) throw new Error(\`Poster \${id} not found\`);

    const deleted = this.data.posters.splice(index, 1)[0];
    this.addAuditLog('POSTER_DELETED', adminUser, \`Permanently deleted poster "\${deleted.title}" (\${deleted.id})\`);
    this.saveData();
    return deleted;
  }

  replacePosterFile(id, fileData, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(\`Poster \${id} not found\`);

    poster.fileUrl = fileData.fileUrl || poster.fileUrl;
    poster.fileName = fileData.fileName || poster.fileName;
    poster.fileSize = fileData.fileSize || poster.fileSize;
    poster.fileType = fileData.fileType || poster.fileType;
    if (fileData.dimensions) poster.dimensions = fileData.dimensions;
    poster.updatedAt = new Date().toISOString();

    if (!poster.approvalHistory) poster.approvalHistory = [];
    poster.approvalHistory.push({
      status: poster.status,
      changedBy: adminUser,
      changedAt: new Date().toISOString(),
      reason: \`Replaced poster file with \${poster.fileName}\`
    });

    this.addAuditLog('POSTER_FILE_REPLACED', adminUser, \`Replaced graphic file for poster "\${poster.title}" (\${poster.id})\`);
    this.saveData();
    return poster;
  }

  incrementPosterDownload(id) {
    const poster = this.getPosterById(id);
    if (poster) {
      poster.downloadsCount = (poster.downloadsCount || 0) + 1;
      this.saveData();
      return poster.downloadsCount;
    }
    return 0;
  }

  // --- TEMPLATES METHODS ---

  getPosterTemplates(options = {}) {
    let list = [...(this.data.posterTemplates || [])];
    const {
      category = 'all',
      status = 'all',
      includeArchived = false,
      query = ''
    } = options;

    if (!includeArchived) {
      list = list.filter(t => !t.isArchived && t.status !== 'Archived');
    }

    if (category && category !== 'all') {
      list = list.filter(t => t.category === category);
    }

    if (status && status !== 'all') {
      list = list.filter(t => t.status === status);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(t =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.softwareFormat && t.softwareFormat.toLowerCase().includes(q))
      );
    }

    return list;
  }

  getPosterTemplateById(id) {
    return (this.data.posterTemplates || []).find(t => t.id === id) || null;
  }

  addPosterTemplate(templateData, adminUser = 'Super Admin') {
    const list = this.data.posterTemplates || [];
    const maxNum = list.reduce((max, t) => {
      const match = (t.id || '').match(/TMPL-(\\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 0);
    const newId = \`TMPL-\${(maxNum + 1).toString().padStart(2, '0')}\`;
    const now = new Date().toISOString();

    const newTemplate = {
      id: newId,
      name: templateData.name || 'Untitled Template',
      category: templateData.category || 'Result Posters',
      previewUrl: templateData.previewUrl || '/assets/models/Dalenzia Fest Results Leaderboard.png',
      originalFileUrl: templateData.originalFileUrl || templateData.previewUrl || '/assets/models/Dalenzia Fest Results Leaderboard.png',
      originalFileName: templateData.originalFileName || 'template_master.psd',
      description: templateData.description || '',
      dimensions: templateData.dimensions || '1080 x 1350 px',
      softwareFormat: templateData.softwareFormat || 'Adobe Photoshop (.PSD)',
      fileSize: templateData.fileSize || '15.0 MB',
      status: templateData.status || 'Active',
      isArchived: false,
      downloadsCount: 0,
      createdAt: now,
      updatedAt: now
    };

    this.data.posterTemplates.unshift(newTemplate);
    this.addAuditLog('TEMPLATE_CREATED', adminUser, \`Created design template "\${newTemplate.name}" (\${newTemplate.id})\`);
    this.saveData();
    return newTemplate;
  }

  updatePosterTemplate(id, updateData, adminUser = 'Super Admin') {
    const template = this.getPosterTemplateById(id);
    if (!template) throw new Error(\`Template \${id} not found\`);

    Object.assign(template, updateData);
    template.updatedAt = new Date().toISOString();

    this.addAuditLog('TEMPLATE_UPDATED', adminUser, \`Updated design template "\${template.name}" (\${template.id})\`);
    this.saveData();
    return template;
  }

  togglePosterTemplateStatus(id, adminUser = 'Super Admin') {
    const template = this.getPosterTemplateById(id);
    if (!template) throw new Error(\`Template \${id} not found\`);

    template.status = template.status === 'Active' ? 'Inactive' : 'Active';
    template.updatedAt = new Date().toISOString();

    this.addAuditLog('TEMPLATE_STATUS_TOGGLE', adminUser, \`Toggled template "\${template.name}" to \${template.status}\`);
    this.saveData();
    return template;
  }

  archivePosterTemplate(id, adminUser = 'Super Admin') {
    const template = this.getPosterTemplateById(id);
    if (!template) throw new Error(\`Template \${id} not found\`);

    template.status = 'Archived';
    template.isArchived = true;
    template.updatedAt = new Date().toISOString();

    this.addAuditLog('TEMPLATE_ARCHIVED', adminUser, \`Archived template "\${template.name}" (\${template.id})\`);
    this.saveData();
    return template;
  }

  deletePosterTemplate(id, { adminUser = 'Super Admin' } = {}) {
    const index = (this.data.posterTemplates || []).findIndex(t => t.id === id);
    if (index === -1) throw new Error(\`Template \${id} not found\`);

    const deleted = this.data.posterTemplates.splice(index, 1)[0];
    this.addAuditLog('TEMPLATE_DELETED', adminUser, \`Deleted template "\${deleted.name}" (\${deleted.id})\`);
    this.saveData();
    return deleted;
  }

  incrementTemplateDownload(id) {
    const template = this.getPosterTemplateById(id);
    if (template) {
      template.downloadsCount = (template.downloadsCount || 0) + 1;
      this.saveData();
      return template.downloadsCount;
    }
    return 0;
  }

  // --- RESULT POSTER AUTO-GENERATION ---

  generateResultPoster(competitionId, options = {}, adminUser = 'Super Admin') {
    const comp = (this.data.competitions || []).find(c => c.id === competitionId);
    if (!comp) throw new Error(\`Competition \${competitionId} not found\`);

    // Look up verified result in resultPosters
    const resultPoster = (this.data.resultPosters || []).find(rp => rp.competitionId === competitionId);
    if (!resultPoster && !comp.resultPublished) {
      throw new Error(\`No published verified results found for competition \${comp.title}\`);
    }

    const firstPrize = resultPoster ? resultPoster.firstPrize : (comp.winners && comp.winners[0]);
    const winnerText = firstPrize ? \`Winner: \${firstPrize.name} (\${firstPrize.teamName || 'Team'})\` : 'Official Proclamation';

    const posterTitle = \`\${comp.title} — Official Result Proclamation\`;
    const posterDesc = \`Official verified winner honors folio for \${comp.title} conducted at \${comp.venue || 'Cordova Grand Stage'}. \${winnerText}.\`;

    // Check if an existing result poster already exists
    let existing = (this.data.posters || []).find(p => p.relatedCompetitionId === competitionId && p.category === 'Result Posters');
    if (existing) {
      existing.shortDescription = posterDesc;
      existing.status = 'Published';
      existing.updatedAt = new Date().toISOString();
      this.saveData();
      return existing;
    }

    const newPoster = this.addPoster({
      title: posterTitle,
      shortDescription: posterDesc,
      category: 'Result Posters',
      fileUrl: options.fileUrl || '/assets/results/results_hero_stage.png',
      fileName: \`result_\${comp.code || comp.id}.png\`,
      fileSize: '5.2 MB',
      fileType: 'image/png',
      dimensions: '1080 x 1350 px',
      relatedProgrammeId: comp.programmeId || null,
      relatedProgrammeTitle: comp.programmeTitle || null,
      relatedCompetitionId: comp.id,
      relatedCompetitionTitle: comp.title,
      relatedResultId: resultPoster ? resultPoster.id : null,
      displayOrder: 1,
      status: 'Published',
      tags: ['Result', 'Verified', 'Official', comp.category || 'Competition']
    }, adminUser);

    return newPoster;
  }

  // --- POSTERS DASHBOARD METRICS ---

  getPosterDashboardStats() {
    const posters = this.data.posters || [];
    const templates = this.data.posterTemplates || [];

    const totalPosters = posters.length;
    const publishedPosters = posters.filter(p => p.status === 'Published' && !p.isArchived).length;
    const draftPosters = posters.filter(p => p.status === 'Draft' && !p.isArchived).length;
    const pendingPosters = posters.filter(p => p.status === 'Pending Approval' && !p.isArchived).length;
    const approvedPosters = posters.filter(p => p.status === 'Approved' && !p.isArchived).length;
    const archivedPosters = posters.filter(p => p.status === 'Archived' || p.isArchived).length;

    const totalTemplates = templates.length;
    const activeTemplates = templates.filter(t => t.status === 'Active' && !t.isArchived).length;
    const archivedTemplates = templates.filter(t => t.status === 'Archived' || t.isArchived).length;

    const totalDownloads = posters.reduce((sum, p) => sum + (p.downloadsCount || 0), 0) +
                           templates.reduce((sum, t) => sum + (t.downloadsCount || 0), 0);

    const recentPosters = [...posters]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    const recentTemplates = [...templates]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);

    return {
      totalPosters,
      publishedPosters,
      draftPosters,
      pendingPosters,
      approvedPosters,
      archivedPosters,
      totalTemplates,
      activeTemplates,
      archivedTemplates,
      totalDownloads,
      recentPosters,
      recentTemplates
    };
  }

  // --- PUBLIC WEBSITE INTEGRATION ---

  getPublicPosters(options = {}) {
    // Strictly ONLY Published, non-archived posters
    const { category = 'all', query = '', sortBy = 'order' } = options;
    const list = this.getPosters({
      category,
      status: 'Published',
      includeArchived: false,
      query,
      sortBy
    });

    // Strip internal administrative data
    return list.map(p => ({
      id: p.id,
      title: p.title,
      shortDescription: p.shortDescription,
      category: p.category,
      fileUrl: p.fileUrl,
      fileName: p.fileName,
      fileSize: p.fileSize,
      fileType: p.fileType,
      dimensions: p.dimensions,
      relatedProgrammeId: p.relatedProgrammeId,
      relatedProgrammeTitle: p.relatedProgrammeTitle,
      relatedCompetitionId: p.relatedCompetitionId,
      relatedCompetitionTitle: p.relatedCompetitionTitle,
      displayOrder: p.displayOrder,
      downloadsCount: p.downloadsCount,
      createdDate: p.createdDate,
      tags: p.tags
    }));
  }

  getPublicPosterTemplates(options = {}) {
    // Strictly Active, non-archived templates
    const { category = 'all', query = '' } = options;
    const list = this.getPosterTemplates({
      category,
      status: 'Active',
      includeArchived: false,
      query
    });

    return list.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      previewUrl: t.previewUrl,
      originalFileUrl: t.originalFileUrl,
      originalFileName: t.originalFileName,
      description: t.description,
      dimensions: t.dimensions,
      softwareFormat: t.softwareFormat,
      fileSize: t.fileSize,
      downloadsCount: t.downloadsCount
    }));
  }
`;

  content = content.slice(0, lastBraceIdx) + posterMethods + '\n' + content.slice(lastBraceIdx);
  console.log('Injected Posters & Templates methods into FestivalStore class');
}

fs.writeFileSync(storePath, content, 'utf8');
console.log('Successfully updated festivalStore.js! New size:', content.length, 'bytes');
