import fs from 'fs';

const storePath = 'src/admin/data/festivalStore.js';
let content = fs.readFileSync(storePath, 'utf8');

// 1. Prepare Initial Data additions
const initialDataGallery = `
  // 10. Gallery Categories
  galleryCategories: [
    { id: 'GC-INA', name: 'Inauguration', color: '#A91F35' },
    { id: 'GC-PRG', name: 'Programmes', color: '#E6A916' },
    { id: 'GC-CMP', name: 'Competitions', color: '#2563EB' },
    { id: 'GC-GST', name: 'Guests', color: '#10B981' },
    { id: 'GC-STG', name: 'Stage Events', color: '#8B5CF6' },
    { id: 'GC-PRZ', name: 'Prize Distribution', color: '#D97706' },
    { id: 'GC-MOM', name: 'Festival Moments', color: '#EC4899' },
    { id: 'GC-BTS', name: 'Behind the Scenes', color: '#64748B' },
    { id: 'GC-OTH', name: 'Other', color: '#78716C' }
  ],

  // 11. Gallery Albums (6 Curated Festival Albums)
  galleryAlbums: [
    {
      id: 'ALB-01',
      title: 'Grand Inauguration & Ceremonial Conclave',
      description: 'Ceremonial opening moments, sacred lamp lighting, keynote address by Dr. Sayyid Munawwar Ali, and reception of delegates.',
      date: 'Dec 21, 2026',
      category: 'Inauguration',
      coverImage: '/assets/models/Dalenzia Fest Nueva Era Hero Banner.png',
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      createdAt: '2026-11-18T10:00:00Z',
      updatedAt: '2026-11-18T12:00:00Z'
    },
    {
      id: 'ALB-02',
      title: 'Scholastic Conclaves & Heritage Symposia',
      description: 'Intellectual symposiums on Classical Texts in Modern Contexts, youth academic forums, and tradition radiating forward.',
      date: 'Dec 21, 2026',
      category: 'Programmes',
      coverImage: '/assets/hero_3d_stage.png',
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      createdAt: '2026-11-18T10:15:00Z',
      updatedAt: '2026-11-18T12:15:00Z'
    },
    {
      id: 'ALB-03',
      title: 'Literary & Fine Arts Arenas',
      description: 'Junior & Senior Arabic Essay colloquium, Malayalam Elocution grand stage, and extempore speech arenas.',
      date: 'Dec 21, 2026',
      category: 'Competitions',
      coverImage: '/assets/models/Dalenzia Fest Events & Competitions.png',
      displayOrder: 3,
      status: 'Published',
      isArchived: false,
      createdAt: '2026-11-18T10:30:00Z',
      updatedAt: '2026-11-18T12:30:00Z'
    },
    {
      id: 'ALB-04',
      title: 'Islamic Calligraphy & Media Showcase',
      description: 'Classical Thuluth and Diwani calligraphy exhibition, short film screenings, and digital typography gallery.',
      date: 'Dec 22, 2026',
      category: 'Stage Events',
      coverImage: '/assets/models/Dalenzia Fest 2K26 Gallery Highlights.png',
      displayOrder: 4,
      status: 'Published',
      isArchived: false,
      createdAt: '2026-11-18T11:00:00Z',
      updatedAt: '2026-11-18T13:00:00Z'
    },
    {
      id: 'ALB-05',
      title: 'Guests of Honour & Dignitary Receptions',
      description: 'Portraits, felicitations, protocol desk moments, and keynote presentations by revered scholars and dignitaries.',
      date: 'Dec 21, 2026',
      category: 'Guests',
      coverImage: '/assets/models/Guests of Honour Festival Showcase.png',
      displayOrder: 5,
      status: 'Published',
      isArchived: false,
      createdAt: '2026-11-18T11:30:00Z',
      updatedAt: '2026-11-18T13:30:00Z'
    },
    {
      id: 'ALB-06',
      title: 'Campus Ambience & Behind The Scenes',
      description: 'Ayiroor campus festival lighting, student volunteer control desk, registration suites, and candid moments.',
      date: 'Dec 22, 2026',
      category: 'Behind the Scenes',
      coverImage: '/assets/models/Dalenzia Fest_ A New Era of Ideas.png',
      displayOrder: 6,
      status: 'Published',
      isArchived: false,
      createdAt: '2026-11-18T12:00:00Z',
      updatedAt: '2026-11-18T14:00:00Z'
    }
  ],

  // 12. Gallery Media (18 Curated Photos and Videos)
  galleryMedia: [
    {
      id: 'MED-01',
      title: 'Torchbearers of Knowledge: Sacred Lamp Lighting',
      type: 'photo',
      url: '/assets/models/Dalenzia Fest Nueva Era Hero Banner.png',
      thumbnailUrl: '/assets/models/Dalenzia Fest Nueva Era Hero Banner.png',
      caption: 'Dr. Sayyid Munawwar Ali and faculty elders lighting the sacred lamp at Cordova Grand Stage, marking the commencement of Dalenzia 2K26.',
      albumId: 'ALB-01',
      albumTitle: 'Grand Inauguration & Ceremonial Conclave',
      category: 'Inauguration',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-002',
      relatedProgrammeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      relatedCompetitionId: null,
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      fileSize: '3.8 MB',
      dimensions: '2172x724',
      createdAt: '2026-11-18T10:05:00Z',
      updatedAt: '2026-11-18T10:05:00Z'
    },
    {
      id: 'MED-02',
      title: 'Official Nueva Era Theme Teaser Launch',
      type: 'video',
      url: '/assets/teaser.mp4',
      thumbnailUrl: '/assets/models/Dalenzia Fest Nueva Era Hero Banner.png',
      caption: 'Official cinematic theme teaser projection unveiling the philosophy and visual identity of Nueva Era.',
      albumId: 'ALB-01',
      albumTitle: 'Grand Inauguration & Ceremonial Conclave',
      category: 'Inauguration',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-002',
      relatedProgrammeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      relatedCompetitionId: null,
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      fileSize: '14.2 MB',
      dimensions: '1920x1080',
      createdAt: '2026-11-18T10:10:00Z',
      updatedAt: '2026-11-18T10:10:00Z'
    },
    {
      id: 'MED-03',
      title: 'Delegates Assembly at Cordova Grand Auditorium',
      type: 'photo',
      url: '/assets/extracted_all/img_146_0_R_1045x600.png',
      thumbnailUrl: '/assets/extracted_all/img_146_0_R_1045x600.png',
      caption: 'Over 2,500 students, scholars, and delegates gathered at Cordova Grand Stage for the presidential inaugural address.',
      albumId: 'ALB-01',
      albumTitle: 'Grand Inauguration & Ceremonial Conclave',
      category: 'Inauguration',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-001',
      relatedProgrammeTitle: 'Delegate Reception & Registration Check-in',
      relatedCompetitionId: null,
      displayOrder: 3,
      status: 'Published',
      isArchived: false,
      fileSize: '2.1 MB',
      dimensions: '1045x600',
      createdAt: '2026-11-18T10:15:00Z',
      updatedAt: '2026-11-18T10:15:00Z'
    },
    {
      id: 'MED-04',
      title: 'Keynote Conclave: Classical Texts in Modern Contexts',
      type: 'photo',
      url: '/assets/hero_3d_stage.png',
      thumbnailUrl: '/assets/hero_3d_stage.png',
      caption: 'Dr. Ahmed Faris addressing the academic assembly on classical jurisprudence, scientific hermeneutics, and modern ethics at Al-Farabi Hall.',
      albumId: 'ALB-02',
      albumTitle: 'Scholastic Conclaves & Heritage Symposia',
      category: 'Programmes',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-003',
      relatedProgrammeTitle: 'Keynote Conclave: Nueva Era & Classical Heritage',
      relatedCompetitionId: null,
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      fileSize: '2.9 MB',
      dimensions: '1920x1080',
      createdAt: '2026-11-18T10:20:00Z',
      updatedAt: '2026-11-18T10:20:00Z'
    },
    {
      id: 'MED-05',
      title: 'Scholastic Dialectic Session Q&A',
      type: 'photo',
      url: '/assets/lamp_books.png',
      thumbnailUrl: '/assets/lamp_books.png',
      caption: 'Interactive discourse between senior researchers and scholars on the harmonization of classical jurisprudence and contemporary logic.',
      albumId: 'ALB-02',
      albumTitle: 'Scholastic Conclaves & Heritage Symposia',
      category: 'Programmes',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-006',
      relatedProgrammeTitle: 'Evening Scholastic Assembly: Tradition Radiating Forward',
      relatedCompetitionId: null,
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      fileSize: '1.8 MB',
      dimensions: '1200x800',
      createdAt: '2026-11-18T10:25:00Z',
      updatedAt: '2026-11-18T10:25:00Z'
    },
    {
      id: 'MED-06',
      title: 'Heritage Symposia Highlight Video',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: '/assets/hero_3d_stage.png',
      caption: 'Summary video covering key intellectual reflections from the Dalenzia Academic Conclave.',
      albumId: 'ALB-02',
      albumTitle: 'Scholastic Conclaves & Heritage Symposia',
      category: 'Programmes',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-003',
      relatedProgrammeTitle: 'Keynote Conclave: Nueva Era & Classical Heritage',
      relatedCompetitionId: null,
      displayOrder: 3,
      status: 'Published',
      isArchived: false,
      fileSize: 'External Stream',
      dimensions: '1080p HD',
      createdAt: '2026-11-18T10:30:00Z',
      updatedAt: '2026-11-18T10:30:00Z'
    },
    {
      id: 'MED-07',
      title: 'Junior Arabic Essay Colloquium in Session',
      type: 'photo',
      url: '/assets/models/Dalenzia Fest Events & Competitions.png',
      thumbnailUrl: '/assets/models/Dalenzia Fest Events & Competitions.png',
      caption: 'Contestants from 12 competing sectors writing their original theses in Classical Arabic at Ibn Khaldun Academic Hall.',
      albumId: 'ALB-03',
      albumTitle: 'Literary & Fine Arts Arenas',
      category: 'Competitions',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-004',
      relatedProgrammeTitle: 'Junior Arabic Essay Colloquium & Finals',
      relatedCompetitionId: 'COMP-001',
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      fileSize: '2.5 MB',
      dimensions: '1600x900',
      createdAt: '2026-11-18T10:35:00Z',
      updatedAt: '2026-11-18T10:35:00Z'
    },
    {
      id: 'MED-08',
      title: 'Malayalam Elocution Grand Stage Arena',
      type: 'photo',
      url: '/assets/extracted_all/img_183_0_R_1199x1312.png',
      thumbnailUrl: '/assets/extracted_all/img_183_0_R_1199x1312.png',
      caption: 'Finalist delivering an impassioned oration on humanitarian ethics in the era of artificial intelligence.',
      albumId: 'ALB-03',
      albumTitle: 'Literary & Fine Arts Arenas',
      category: 'Competitions',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-005',
      relatedProgrammeTitle: 'Senior Malayalam Elocution Grand Stage',
      relatedCompetitionId: 'COMP-002',
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      fileSize: '2.2 MB',
      dimensions: '1199x1312',
      createdAt: '2026-11-18T10:40:00Z',
      updatedAt: '2026-11-18T10:40:00Z'
    },
    {
      id: 'MED-09',
      title: 'Extempore Dialectic Tournament Climax',
      type: 'photo',
      url: '/assets/extracted_all/img_187_0_R_1024x1536.png',
      thumbnailUrl: '/assets/extracted_all/img_187_0_R_1024x1536.png',
      caption: 'High-voltage impromptu debate round adjudicating arguments on educational reform and moral sciences.',
      albumId: 'ALB-03',
      albumTitle: 'Literary & Fine Arts Arenas',
      category: 'Competitions',
      date: 'Dec 22, 2026',
      relatedProgrammeId: 'PRG-009',
      relatedProgrammeTitle: 'Classical Extempore Dialectic Tournament',
      relatedCompetitionId: 'COMP-005',
      displayOrder: 3,
      status: 'Published',
      isArchived: false,
      fileSize: '2.7 MB',
      dimensions: '1024x1536',
      createdAt: '2026-11-18T10:45:00Z',
      updatedAt: '2026-11-18T10:45:00Z'
    },
    {
      id: 'MED-10',
      title: 'Classical Thuluth Calligraphy Masterpiece Display',
      type: 'photo',
      url: '/assets/models/Dalenzia Fest 2K26 Gallery Highlights.png',
      thumbnailUrl: '/assets/models/Dalenzia Fest 2K26 Gallery Highlights.png',
      caption: 'Exquisite Qur’anic calligraphy rendered in hand-ground ink on archival parchment during the Senior Visual Arts championship.',
      albumId: 'ALB-04',
      albumTitle: 'Islamic Calligraphy & Media Showcase',
      category: 'Stage Events',
      date: 'Dec 22, 2026',
      relatedProgrammeId: 'PRG-012',
      relatedProgrammeTitle: 'Digital Heritage & Calligraphic Design Workshop',
      relatedCompetitionId: 'COMP-003',
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      fileSize: '3.1 MB',
      dimensions: '1920x1080',
      createdAt: '2026-11-18T11:05:00Z',
      updatedAt: '2026-11-18T11:05:00Z'
    },
    {
      id: 'MED-11',
      title: 'Live Script Writing Demonstration by Usthad Rashad',
      type: 'video',
      url: '/assets/teaser.mp4',
      thumbnailUrl: '/assets/models/Dalenzia Fest 2K26 Gallery Highlights.png',
      caption: 'Step-by-step masterclass demonstrating reed pen preparation, ink ratio balancing, and letter proportioning in Diwani script.',
      albumId: 'ALB-04',
      albumTitle: 'Islamic Calligraphy & Media Showcase',
      category: 'Stage Events',
      date: 'Dec 22, 2026',
      relatedProgrammeId: 'PRG-012',
      relatedProgrammeTitle: 'Digital Heritage & Calligraphic Design Workshop',
      relatedCompetitionId: null,
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      fileSize: '14.2 MB',
      dimensions: '1920x1080',
      createdAt: '2026-11-18T11:10:00Z',
      updatedAt: '2026-11-18T11:10:00Z'
    },
    {
      id: 'MED-12',
      title: 'Media Studio Preview Room: Student Short Film Jury',
      type: 'photo',
      url: '/assets/extracted_all/img_189_0_R_1774x887.png',
      thumbnailUrl: '/assets/extracted_all/img_189_0_R_1774x887.png',
      caption: 'Jury panel screening creative documentary shorts crafted by student teams on social welfare and cultural legacy.',
      albumId: 'ALB-04',
      albumTitle: 'Islamic Calligraphy & Media Showcase',
      category: 'Stage Events',
      date: 'Dec 22, 2026',
      relatedProgrammeId: 'PRG-010',
      relatedProgrammeTitle: 'Media Curation, Film & Graphic Arts Screening',
      relatedCompetitionId: 'COMP-004',
      displayOrder: 3,
      status: 'Published',
      isArchived: false,
      fileSize: '2.4 MB',
      dimensions: '1774x887',
      createdAt: '2026-11-18T11:15:00Z',
      updatedAt: '2026-11-18T11:15:00Z'
    },
    {
      id: 'MED-13',
      title: 'Dr. Sayyid Munawwar Ali Keynote Address Portrait',
      type: 'photo',
      url: '/assets/guests/portrait_sayyid_munawwar.png',
      thumbnailUrl: '/assets/guests/portrait_sayyid_munawwar.png',
      caption: 'Dr. Sayyid Munawwar Ali delivering the presidential inaugural keynote at Dalenzia Fest 2K26.',
      albumId: 'ALB-05',
      albumTitle: 'Guests of Honour & Dignitary Receptions',
      category: 'Guests',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-002',
      relatedProgrammeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      relatedCompetitionId: null,
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      fileSize: '1.4 MB',
      dimensions: '600x600',
      createdAt: '2026-11-18T11:35:00Z',
      updatedAt: '2026-11-18T11:35:00Z'
    },
    {
      id: 'MED-14',
      title: 'Usthad Muhammed Rashid Conclave Portrait',
      type: 'photo',
      url: '/assets/guests/portrait_muhammed_rashid.png',
      thumbnailUrl: '/assets/guests/portrait_muhammed_rashid.png',
      caption: 'Usthad Muhammed Rashid presiding over the academic assembly and conferring felicitation honors.',
      albumId: 'ALB-05',
      albumTitle: 'Guests of Honour & Dignitary Receptions',
      category: 'Guests',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-006',
      relatedProgrammeTitle: 'Evening Scholastic Assembly: Tradition Radiating Forward',
      relatedCompetitionId: null,
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      fileSize: '1.2 MB',
      dimensions: '600x600',
      createdAt: '2026-11-18T11:40:00Z',
      updatedAt: '2026-11-18T11:40:00Z'
    },
    {
      id: 'MED-15',
      title: 'Dr. Ahmed Faris Academic Keynote Portrait',
      type: 'photo',
      url: '/assets/guests/portrait_ahmed_faris.png',
      thumbnailUrl: '/assets/guests/portrait_ahmed_faris.png',
      caption: 'Dr. Ahmed Faris addressing scholars at the Heritage Conclave on the evolution of classical jurisprudence.',
      albumId: 'ALB-05',
      albumTitle: 'Guests of Honour & Dignitary Receptions',
      category: 'Guests',
      date: 'Dec 21, 2026',
      relatedProgrammeId: 'PRG-003',
      relatedProgrammeTitle: 'Keynote Conclave: Nueva Era & Classical Heritage',
      relatedCompetitionId: null,
      displayOrder: 3,
      status: 'Published',
      isArchived: false,
      fileSize: '1.3 MB',
      dimensions: '600x600',
      createdAt: '2026-11-18T11:45:00Z',
      updatedAt: '2026-11-18T11:45:00Z'
    },
    {
      id: 'MED-16',
      title: 'Ayiroor Campus Night Illumination & Arch Portal',
      type: 'photo',
      url: '/assets/models/Dalenzia Fest_ A New Era of Ideas.png',
      thumbnailUrl: '/assets/models/Dalenzia Fest_ A New Era of Ideas.png',
      caption: 'Spectacular decorative illumination of the main arch portal welcoming visitors and delegations to Dalenzia Fest 2K26.',
      albumId: 'ALB-06',
      albumTitle: 'Campus Ambience & Behind The Scenes',
      category: 'Behind the Scenes',
      date: 'Dec 22, 2026',
      relatedProgrammeId: null,
      relatedProgrammeTitle: null,
      relatedCompetitionId: null,
      displayOrder: 1,
      status: 'Published',
      isArchived: false,
      fileSize: '3.4 MB',
      dimensions: '1920x1080',
      createdAt: '2026-11-18T12:05:00Z',
      updatedAt: '2026-11-18T12:05:00Z'
    },
    {
      id: 'MED-17',
      title: 'Volunteer Secretariat & Protocol Operations Desk',
      type: 'photo',
      url: '/assets/models/Dalenzia Nueva Era Festival Storyboard.png',
      thumbnailUrl: '/assets/models/Dalenzia Nueva Era Festival Storyboard.png',
      caption: 'Central student coordination desk orchestrating stage logistics, timekeeper sync, and guest hospitality.',
      albumId: 'ALB-06',
      albumTitle: 'Campus Ambience & Behind The Scenes',
      category: 'Behind the Scenes',
      date: 'Dec 22, 2026',
      relatedProgrammeId: 'PRG-001',
      relatedProgrammeTitle: 'Delegate Reception & Registration Check-in',
      relatedCompetitionId: null,
      displayOrder: 2,
      status: 'Published',
      isArchived: false,
      fileSize: '3.6 MB',
      dimensions: '1920x1080',
      createdAt: '2026-11-18T12:10:00Z',
      updatedAt: '2026-11-18T12:10:00Z'
    },
    {
      id: 'MED-18',
      title: 'Digital Scoreboard & Master Dashboard Operations Desk',
      type: 'photo',
      url: '/assets/models/Dalenzia Fest Team Management Dashboard.png',
      thumbnailUrl: '/assets/models/Dalenzia Fest Team Management Dashboard.png',
      caption: 'Control centre personnel verifying judge marksheets, executing double-entry verification, and streaming live standings.',
      albumId: 'ALB-06',
      albumTitle: 'Campus Ambience & Behind The Scenes',
      category: 'Behind the Scenes',
      date: 'Dec 22, 2026',
      relatedProgrammeId: null,
      relatedProgrammeTitle: null,
      relatedCompetitionId: null,
      displayOrder: 3,
      status: 'Draft',
      isArchived: false,
      fileSize: '2.8 MB',
      dimensions: '1672x960',
      createdAt: '2026-11-18T12:15:00Z',
      updatedAt: '2026-11-18T12:15:00Z'
    }
  ]
`;

// Insert into INITIAL_DATA before auditLogs closing:
const targetAuditLogsEnd = '  auditLogs: [\n    {\n      id: \'LOG-01\',';
if (!content.includes('galleryAlbums: [')) {
  const auditIndex = content.lastIndexOf('  auditLogs: [');
  if (auditIndex !== -1) {
    content = content.slice(0, auditIndex) + initialDataGallery + ',\n\n' + content.slice(auditIndex);
    console.log('Inserted galleryCategories, galleryAlbums, galleryMedia into INITIAL_DATA');
  }
}

// 2. Add fallback in loadData()
const loadDataTarget = `if (!currentData.programmeSchedules || !Array.isArray(currentData.programmeSchedules) || currentData.programmeSchedules.length < 10) {
      currentData.programmeSchedules = INITIAL_DATA.programmeSchedules;
    }`;

const loadDataAddition = `if (!currentData.programmeSchedules || !Array.isArray(currentData.programmeSchedules) || currentData.programmeSchedules.length < 10) {
      currentData.programmeSchedules = INITIAL_DATA.programmeSchedules;
    }
    if (!currentData.galleryCategories || !Array.isArray(currentData.galleryCategories) || currentData.galleryCategories.length === 0) {
      currentData.galleryCategories = INITIAL_DATA.galleryCategories;
    }
    if (!currentData.galleryAlbums || !Array.isArray(currentData.galleryAlbums) || currentData.galleryAlbums.length < 5) {
      currentData.galleryAlbums = INITIAL_DATA.galleryAlbums;
    }
    if (!currentData.galleryMedia || !Array.isArray(currentData.galleryMedia) || currentData.galleryMedia.length < 10) {
      currentData.galleryMedia = INITIAL_DATA.galleryMedia;
    }`;

if (!content.includes('currentData.galleryAlbums')) {
  content = content.replace(loadDataTarget, loadDataAddition);
  console.log('Added gallery fallbacks to loadData()');
}

// 3. Add Gallery Store Methods to FestivalStore class
const galleryMethods = `
  // =========================================================================
  // GALLERY MANAGEMENT SYSTEM (STEP 10 - GALLERY MANAGEMENT)
  // =========================================================================

  getGalleryCategories() {
    return this.data.galleryCategories || [];
  }

  getGalleryAlbums(options = {}) {
    const {
      status = 'all',
      category = 'all',
      date = 'all',
      query = '',
      sortBy = 'order',
      includeArchived = false
    } = options;

    let list = (this.data.galleryAlbums || []).map(album => {
      // Compute dynamic media count from galleryMedia
      const allMedia = this.data.galleryMedia || [];
      const albumMedia = allMedia.filter(m => m.albumId === album.id && (includeArchived || !m.isArchived));
      const photoCount = albumMedia.filter(m => m.type === 'photo').length;
      const videoCount = albumMedia.filter(m => m.type === 'video').length;

      return {
        ...album,
        mediaCount: albumMedia.length,
        photoCount,
        videoCount
      };
    });

    if (!includeArchived) {
      list = list.filter(a => !a.isArchived && a.status !== 'Archived');
    }

    if (status !== 'all') {
      list = list.filter(a => a.status === status);
    }

    if (category !== 'all') {
      list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (date !== 'all') {
      list = list.filter(a => String(a.date).includes(date));
    }

    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'order') return (a.displayOrder || 999) - (b.displayOrder || 999);
      if (sortBy === 'date') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'mediaCount') return (b.mediaCount || 0) - (a.mediaCount || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }

  getGalleryAlbumById(id) {
    if (!id) return null;
    const album = (this.data.galleryAlbums || []).find(a => a.id === id);
    if (!album) return null;

    const allMedia = this.data.galleryMedia || [];
    const media = allMedia.filter(m => m.albumId === id && !m.isArchived);
    media.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

    return {
      ...album,
      mediaCount: media.length,
      photoCount: media.filter(m => m.type === 'photo').length,
      videoCount: media.filter(m => m.type === 'video').length,
      media
    };
  }

  addGalleryAlbum(albumData, adminUser = 'Super Admin') {
    if (!albumData.title || !albumData.title.trim()) {
      throw new Error('Album title is mandatory.');
    }

    const nextNum = (this.data.galleryAlbums ? this.data.galleryAlbums.length : 0) + 1;
    const newId = \`ALB-\${nextNum.toString().padStart(2, '0')}\`;

    const now = new Date().toISOString();
    const newAlbum = {
      id: newId,
      title: albumData.title.trim(),
      description: (albumData.description || '').trim(),
      date: albumData.date || 'Dec 21, 2026',
      category: albumData.category || 'Festival Moments',
      coverImage: albumData.coverImage || '/assets/models/Dalenzia Fest Nueva Era Hero Banner.png',
      displayOrder: Number(albumData.displayOrder) || nextNum,
      status: albumData.status || 'Published',
      isArchived: false,
      createdAt: now,
      updatedAt: now
    };

    if (!this.data.galleryAlbums) this.data.galleryAlbums = [];
    this.data.galleryAlbums.push(newAlbum);

    this.addAuditLog(
      'GALLERY_ALBUM_CREATED',
      \`Created gallery album "\${newAlbum.title}" (\${newAlbum.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true, album: newAlbum };
  }

  updateGalleryAlbum(id, updateData, adminUser = 'Super Admin') {
    const album = (this.data.galleryAlbums || []).find(a => a.id === id);
    if (!album) throw new Error('Gallery album not found.');

    if (updateData.title && updateData.title.trim()) {
      album.title = updateData.title.trim();
      // Synchronize denormalized albumTitle on child media
      if (this.data.galleryMedia) {
        this.data.galleryMedia.forEach(m => {
          if (m.albumId === id) m.albumTitle = album.title;
        });
      }
    }
    if (updateData.description !== undefined) album.description = updateData.description.trim();
    if (updateData.date) album.date = updateData.date;
    if (updateData.category) album.category = updateData.category;
    if (updateData.coverImage) album.coverImage = updateData.coverImage;
    if (updateData.displayOrder !== undefined) album.displayOrder = Number(updateData.displayOrder);
    if (updateData.status) album.status = updateData.status;

    album.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_ALBUM_UPDATED',
      \`Updated gallery album "\${album.title}" (\${album.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true, album };
  }

  deleteGalleryAlbum(id, { deleteMedia = false, adminUser = 'Super Admin' } = {}) {
    const idx = (this.data.galleryAlbums || []).findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Gallery album not found.');

    const album = this.data.galleryAlbums[idx];

    if (deleteMedia) {
      // Delete child media items
      this.data.galleryMedia = (this.data.galleryMedia || []).filter(m => m.albumId !== id);
    } else {
      // Safe unlink: detach media from album so original files are NEVER lost or orphaned
      (this.data.galleryMedia || []).forEach(m => {
        if (m.albumId === id) {
          m.albumId = null;
          m.albumTitle = null;
          m.updatedAt = new Date().toISOString();
        }
      });
    }

    this.data.galleryAlbums.splice(idx, 1);

    this.addAuditLog(
      'GALLERY_ALBUM_DELETED',
      \`Deleted album "\${album.title}" (\${album.id}) with deleteMedia=\${deleteMedia} by \${adminUser}\`
    );
    this.saveData();
    return { success: true, deletedAlbum: album };
  }

  archiveGalleryAlbum(id, adminUser = 'Super Admin') {
    const album = (this.data.galleryAlbums || []).find(a => a.id === id);
    if (!album) throw new Error('Gallery album not found.');

    album.isArchived = true;
    album.status = 'Archived';
    album.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_ALBUM_ARCHIVED',
      \`Archived album "\${album.title}" (\${album.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true, album };
  }

  restoreGalleryAlbum(id, adminUser = 'Super Admin') {
    const album = (this.data.galleryAlbums || []).find(a => a.id === id);
    if (!album) throw new Error('Gallery album not found.');

    album.isArchived = false;
    album.status = 'Published';
    album.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_ALBUM_RESTORED',
      \`Restored album "\${album.title}" (\${album.id}) to Published by \${adminUser}\`
    );
    this.saveData();
    return { success: true, album };
  }

  publishGalleryAlbum(id, isPublished = true, adminUser = 'Super Admin') {
    const album = (this.data.galleryAlbums || []).find(a => a.id === id);
    if (!album) throw new Error('Gallery album not found.');

    album.status = isPublished ? 'Published' : 'Draft';
    album.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_ALBUM_PUBLISH_TOGGLED',
      \`Set album "\${album.title}" (\${album.id}) status to \${album.status} by \${adminUser}\`
    );
    this.saveData();
    return { success: true, album };
  }

  getGalleryMedia(options = {}) {
    const {
      albumId = 'all',
      type = 'all',
      status = 'all',
      category = 'all',
      date = 'all',
      programmeId = 'all',
      query = '',
      sortBy = 'order',
      includeArchived = false,
      page = 1,
      limit = null
    } = options;

    let list = [...(this.data.galleryMedia || [])];

    if (!includeArchived) {
      list = list.filter(m => !m.isArchived && m.status !== 'Archived');
    }

    if (albumId !== 'all') {
      if (albumId === 'unassigned') {
        list = list.filter(m => !m.albumId);
      } else {
        list = list.filter(m => m.albumId === albumId);
      }
    }

    if (type !== 'all') {
      list = list.filter(m => m.type === type);
    }

    if (status !== 'all') {
      list = list.filter(m => m.status === status);
    }

    if (category !== 'all') {
      list = list.filter(m => m.category && m.category.toLowerCase() === category.toLowerCase());
    }

    if (date !== 'all') {
      list = list.filter(m => String(m.date).includes(date));
    }

    if (programmeId !== 'all') {
      list = list.filter(m => m.relatedProgrammeId === programmeId);
    }

    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(m =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.caption && m.caption.toLowerCase().includes(q)) ||
        (m.category && m.category.toLowerCase().includes(q)) ||
        (m.albumTitle && m.albumTitle.toLowerCase().includes(q)) ||
        (m.relatedProgrammeTitle && m.relatedProgrammeTitle.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'order') return (a.displayOrder || 999) - (b.displayOrder || 999);
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

    const totalCount = list.length;

    if (limit && Number(limit) > 0) {
      const start = (Number(page) - 1) * Number(limit);
      list = list.slice(start, start + Number(limit));
    }

    return {
      media: list,
      totalCount,
      page: Number(page),
      totalPages: limit ? Math.ceil(totalCount / Number(limit)) : 1
    };
  }

  getGalleryMediaById(id) {
    if (!id) return null;
    return (this.data.galleryMedia || []).find(m => m.id === id) || null;
  }

  addGalleryMedia(mediaData, adminUser = 'Super Admin') {
    if (!mediaData.title || !mediaData.title.trim()) {
      throw new Error('Media title is mandatory.');
    }
    if (!mediaData.url || !mediaData.url.trim()) {
      throw new Error('Media file URL is mandatory.');
    }

    const nextNum = (this.data.galleryMedia ? this.data.galleryMedia.length : 0) + 1;
    const newId = \`MED-\${nextNum.toString().padStart(2, '0')}\`;

    // Resolve album title if albumId given
    let albumTitle = null;
    if (mediaData.albumId) {
      const alb = (this.data.galleryAlbums || []).find(a => a.id === mediaData.albumId);
      if (alb) albumTitle = alb.title;
    }

    // Resolve programme title if relatedProgrammeId given
    let programmeTitle = null;
    if (mediaData.relatedProgrammeId) {
      const prog = (this.data.programmes || []).find(p => p.id === mediaData.relatedProgrammeId);
      if (prog) programmeTitle = prog.title;
    }

    const now = new Date().toISOString();
    const newMedia = {
      id: newId,
      title: mediaData.title.trim(),
      type: mediaData.type === 'video' ? 'video' : 'photo',
      url: mediaData.url.trim(),
      thumbnailUrl: (mediaData.thumbnailUrl || mediaData.url).trim(),
      caption: (mediaData.caption || '').trim(),
      albumId: mediaData.albumId || null,
      albumTitle,
      category: mediaData.category || 'Festival Moments',
      date: mediaData.date || 'Dec 21, 2026',
      relatedProgrammeId: mediaData.relatedProgrammeId || null,
      relatedProgrammeTitle: programmeTitle,
      relatedCompetitionId: mediaData.relatedCompetitionId || null,
      displayOrder: Number(mediaData.displayOrder) || nextNum,
      status: mediaData.status || 'Published',
      isArchived: false,
      fileSize: mediaData.fileSize || '2.5 MB',
      dimensions: mediaData.dimensions || '1920x1080',
      createdAt: now,
      updatedAt: now
    };

    if (!this.data.galleryMedia) this.data.galleryMedia = [];
    this.data.galleryMedia.push(newMedia);

    // Update album updatedAt if assigned
    if (mediaData.albumId) {
      const album = (this.data.galleryAlbums || []).find(a => a.id === mediaData.albumId);
      if (album) album.updatedAt = now;
    }

    this.addAuditLog(
      'GALLERY_MEDIA_ADDED',
      \`Added \${newMedia.type} "\${newMedia.title}" (\${newMedia.id}) to album \${albumTitle || 'Unassigned'} by \${adminUser}\`
    );
    this.saveData();
    return { success: true, media: newMedia };
  }

  updateGalleryMedia(id, updateData, adminUser = 'Super Admin') {
    const media = (this.data.galleryMedia || []).find(m => m.id === id);
    if (!media) throw new Error('Gallery media not found.');

    if (updateData.title && updateData.title.trim()) media.title = updateData.title.trim();
    if (updateData.caption !== undefined) media.caption = updateData.caption.trim();
    if (updateData.type) media.type = updateData.type;
    if (updateData.url) media.url = updateData.url.trim();
    if (updateData.thumbnailUrl) media.thumbnailUrl = updateData.thumbnailUrl.trim();
    if (updateData.category) media.category = updateData.category;
    if (updateData.date) media.date = updateData.date;
    if (updateData.displayOrder !== undefined) media.displayOrder = Number(updateData.displayOrder);
    if (updateData.status) media.status = updateData.status;

    if (updateData.albumId !== undefined) {
      media.albumId = updateData.albumId || null;
      if (media.albumId) {
        const alb = (this.data.galleryAlbums || []).find(a => a.id === media.albumId);
        media.albumTitle = alb ? alb.title : null;
      } else {
        media.albumTitle = null;
      }
    }

    if (updateData.relatedProgrammeId !== undefined) {
      media.relatedProgrammeId = updateData.relatedProgrammeId || null;
      if (media.relatedProgrammeId) {
        const prog = (this.data.programmes || []).find(p => p.id === media.relatedProgrammeId);
        media.relatedProgrammeTitle = prog ? prog.title : null;
      } else {
        media.relatedProgrammeTitle = null;
      }
    }

    if (updateData.relatedCompetitionId !== undefined) {
      media.relatedCompetitionId = updateData.relatedCompetitionId || null;
    }

    media.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_MEDIA_UPDATED',
      \`Updated media "\${media.title}" (\${media.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true, media };
  }

  deleteGalleryMedia(id, { adminUser = 'Super Admin' } = {}) {
    const idx = (this.data.galleryMedia || []).findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Gallery media not found.');

    const media = this.data.galleryMedia[idx];
    this.data.galleryMedia.splice(idx, 1);

    this.addAuditLog(
      'GALLERY_MEDIA_DELETED',
      \`Deleted media "\${media.title}" (\${media.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true, deletedMedia: media };
  }

  archiveGalleryMedia(id, adminUser = 'Super Admin') {
    const media = (this.data.galleryMedia || []).find(m => m.id === id);
    if (!media) throw new Error('Gallery media not found.');

    media.isArchived = true;
    media.status = 'Archived';
    media.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_MEDIA_ARCHIVED',
      \`Archived media "\${media.title}" (\${media.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true, media };
  }

  restoreGalleryMedia(id, adminUser = 'Super Admin') {
    const media = (this.data.galleryMedia || []).find(m => m.id === id);
    if (!media) throw new Error('Gallery media not found.');

    media.isArchived = false;
    media.status = 'Published';
    media.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_MEDIA_RESTORED',
      \`Restored media "\${media.title}" (\${media.id}) to Published by \${adminUser}\`
    );
    this.saveData();
    return { success: true, media };
  }

  assignMediaToAlbum(mediaIds, albumId, adminUser = 'Super Admin') {
    if (!Array.isArray(mediaIds) || mediaIds.length === 0) return { success: false };
    const album = (this.data.galleryAlbums || []).find(a => a.id === albumId);
    if (!album) throw new Error('Target album not found.');

    const now = new Date().toISOString();
    mediaIds.forEach(mid => {
      const media = (this.data.galleryMedia || []).find(m => m.id === mid);
      if (media) {
        media.albumId = album.id;
        media.albumTitle = album.title;
        media.updatedAt = now;
      }
    });

    album.updatedAt = now;
    this.addAuditLog(
      'GALLERY_MEDIA_ASSIGNED',
      \`Assigned \${mediaIds.length} media items to album "\${album.title}" (\${album.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true };
  }

  removeMediaFromAlbum(mediaId, adminUser = 'Super Admin') {
    const media = (this.data.galleryMedia || []).find(m => m.id === mediaId);
    if (!media) throw new Error('Media not found.');

    const oldAlbum = media.albumTitle;
    media.albumId = null;
    media.albumTitle = null;
    media.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_MEDIA_UNASSIGNED',
      \`Removed media "\${media.title}" (\${media.id}) from album \${oldAlbum || 'Unknown'} without file deletion by \${adminUser}\`
    );
    this.saveData();
    return { success: true, media };
  }

  setAlbumCover(albumId, imageUrl, adminUser = 'Super Admin') {
    const album = (this.data.galleryAlbums || []).find(a => a.id === albumId);
    if (!album) throw new Error('Album not found.');
    if (!imageUrl || !imageUrl.trim()) throw new Error('Image URL is required.');

    album.coverImage = imageUrl.trim();
    album.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'GALLERY_ALBUM_COVER_UPDATED',
      \`Updated cover image for album "\${album.title}" (\${album.id}) by \${adminUser}\`
    );
    this.saveData();
    return { success: true, album };
  }

  reorderGalleryMedia(albumId, orderedMediaIds, adminUser = 'Super Admin') {
    if (!Array.isArray(orderedMediaIds)) return;
    orderedMediaIds.forEach((mid, idx) => {
      const media = (this.data.galleryMedia || []).find(m => m.id === mid);
      if (media) media.displayOrder = idx + 1;
    });

    this.addAuditLog(
      'GALLERY_MEDIA_REORDERED',
      \`Reordered \${orderedMediaIds.length} media items in album \${albumId} by \${adminUser}\`
    );
    this.saveData();
    return { success: true };
  }

  reorderGalleryAlbums(orderedAlbumIds, adminUser = 'Super Admin') {
    if (!Array.isArray(orderedAlbumIds)) return;
    orderedAlbumIds.forEach((aid, idx) => {
      const album = (this.data.galleryAlbums || []).find(a => a.id === aid);
      if (album) album.displayOrder = idx + 1;
    });

    this.addAuditLog(
      'GALLERY_ALBUMS_REORDERED',
      \`Reordered \${orderedAlbumIds.length} gallery albums by \${adminUser}\`
    );
    this.saveData();
    return { success: true };
  }

  getGalleryDashboardStats() {
    const allMedia = (this.data.galleryMedia || []).filter(m => !m.isArchived);
    const allAlbums = (this.data.galleryAlbums || []).filter(a => !a.isArchived);

    const totalMediaFiles = allMedia.length;
    const totalPhotos = allMedia.filter(m => m.type === 'photo').length;
    const totalVideos = allMedia.filter(m => m.type === 'video').length;
    const totalAlbums = allAlbums.length;

    const publishedMedia = allMedia.filter(m => m.status === 'Published').length;
    const pendingApproval = allMedia.filter(m => m.status === 'Draft' || m.status === 'Pending').length;
    const archivedMedia = (this.data.galleryMedia || []).filter(m => m.isArchived || m.status === 'Archived').length;
    const archivedAlbums = (this.data.galleryAlbums || []).filter(a => a.isArchived || a.status === 'Archived').length;

    // Recent uploads (latest 5)
    const recentUploads = [...allMedia]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    // Recently updated albums (latest 5)
    const recentlyUpdatedAlbums = [...allAlbums]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 5);

    return {
      totalMediaFiles,
      totalPhotos,
      totalVideos,
      totalAlbums,
      publishedMedia,
      pendingApproval,
      archivedMedia,
      archivedAlbums,
      recentUploads,
      recentlyUpdatedAlbums
    };
  }

  getPublicGalleryAlbums() {
    // Only published and non-archived albums
    return this.getGalleryAlbums({
      status: 'Published',
      includeArchived: false,
      sortBy: 'order'
    });
  }

  getPublicGalleryMedia(options = {}) {
    const { albumId = 'all', category = 'all', type = 'all', query = '' } = options;
    const result = this.getGalleryMedia({
      albumId,
      category,
      type,
      query,
      status: 'Published',
      includeArchived: false,
      sortBy: 'order'
    });

    // Public sanitization: ensure no internal notes or sensitive data
    const sanitized = result.media.map(m => ({
      id: m.id,
      title: m.title,
      type: m.type,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl,
      caption: m.caption,
      albumId: m.albumId,
      albumTitle: m.albumTitle,
      category: m.category,
      date: m.date,
      relatedProgrammeId: m.relatedProgrammeId,
      relatedProgrammeTitle: m.relatedProgrammeTitle,
      relatedCompetitionId: m.relatedCompetitionId,
      dimensions: m.dimensions,
      displayOrder: m.displayOrder
    }));

    return sanitized;
  }
`;

// Insert right before closing of FestivalStore class
if (!content.includes('getGalleryDashboardStats()')) {
  const lastBraceIndex = content.lastIndexOf('}\n\nexport const festivalStore = new FestivalStore();');
  if (lastBraceIndex !== -1) {
    content = content.slice(0, lastBraceIndex) + galleryMethods + '\n' + content.slice(lastBraceIndex);
    console.log('Appended Gallery methods to FestivalStore class');
  } else {
    // Fallback search
    const altTarget = '  getResultCorrectionHistory(competitionId = null) {\n    const list = this.data.resultCorrectionHistory || [];\n    if (competitionId) {\n      return list.filter(h => h.competitionId === competitionId);\n    }\n    return list;\n  }\n}';
    content = content.replace(altTarget, altTarget.slice(0, -1) + galleryMethods + '\n}');
    console.log('Appended Gallery methods via fallback');
  }
}

fs.writeFileSync(storePath, content, 'utf8');
console.log('festivalStore.js updated successfully!');
