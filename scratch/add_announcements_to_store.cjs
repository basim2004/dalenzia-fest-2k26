const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../src/admin/data/festivalStore.js');
let content = fs.readFileSync(storePath, 'utf8');

console.log('Original festivalStore size:', content.length, 'bytes');

// 1. Check if announcementCategories already present
if (content.includes('announcementCategories: [')) {
  console.log('announcementCategories already present');
} else {
  // Find where posterTemplates ends and auditLogs starts
  const auditLogsIdx = content.indexOf('auditLogs: [');
  if (auditLogsIdx === -1) {
    throw new Error('Could not find auditLogs in festivalStore.js');
  }

  const announcementDataInjection = `  // 15. Announcement Categories (Step 11 - Announcements Management)
  announcementCategories: [
    { id: 'CAT-ANN-GEN', name: 'General Announcement', color: '#64748B', description: 'General notices, campus directives, and routine festival information' },
    { id: 'CAT-ANN-IMP', name: 'Important Notice', color: '#E6A916', description: 'Critical briefings, advisory bulletins, and regulatory instructions' },
    { id: 'CAT-ANN-CMP', name: 'Competition Update', color: '#2563EB', description: 'Competition calls, venue shifts, rubric revisions, and participant notices' },
    { id: 'CAT-ANN-PRG', name: 'Programme Update', color: '#8B5CF6', description: 'Ceremony schedules, session agendas, and guest arrival notifications' },
    { id: 'CAT-ANN-SCH', name: 'Schedule Change', color: '#D97706', description: 'Timeline calibrations, slot extensions, and stage adjustments' },
    { id: 'CAT-ANN-REG', name: 'Registration Notice', color: '#10B981', description: 'Chest number confirmations, badge check-ins, and squad rosters' },
    { id: 'CAT-ANN-RES', name: 'Result Announcement', color: '#A91F35', description: 'Podium honors declarations, verified score sheets, and point standings' },
    { id: 'CAT-ANN-EMG', name: 'Emergency Notice', color: '#DC2626', description: 'Urgent security, weather, logistics, or medical secretariat broadcasts' }
  ],

  // 16. Announcements (Step 11 - Announcements Management)
  announcements: [
    {
      id: 'ANN-01',
      title: 'Grand Inaugural Assembly & Delegate Check-In Guidelines',
      summary: 'All participating institution delegations, faculty advisors, and team captains must complete physical badge verification at Cordova Welcome Gate by 08:30 AM.',
      content: 'The Festival Secretariat cordially announces that the ceremonial registration desk at the Cordova Grand Reception Lobby will open promptly at 07:30 AM on Monday, December 21, 2026.\\n\\nAll 12 institution contingents must present their official authorization letters and digital QR registration confirmations. Student identity credentials and chest badges will be issued simultaneously. Breakfast and delegate welcome refreshments will be served at the Ibn Battuta Dining Pavilion from 08:00 AM.',
      category: 'Programme Update',
      targetAudience: 'Everyone',
      relatedProgrammeId: 'PRG-001',
      relatedProgrammeTitle: 'Delegate Reception & Registration Check-in',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Urgent',
      status: 'Published',
      publishDate: 'Dec 20, 2026',
      publishTime: '09:00 AM',
      publishTimestamp: '2026-12-20T03:30:00.000Z',
      expiryDate: 'Dec 22, 2026',
      expiryTime: '11:59 PM',
      expiryTimestamp: '2026-12-22T18:29:00.000Z',
      featuredImageUrl: '/assets/models/Dalenzia Fest Nueva Era Hero Banner.png',
      attachmentUrl: '/assets/banner_full.png',
      attachmentName: 'delegate_checkin_handbook.pdf',
      attachmentSize: '2.4 MB',
      viewsCount: 1420,
      isPinned: true,
      isArchived: false,
      author: 'Festival Secretariat',
      createdAt: '2026-12-20T03:30:00.000Z',
      updatedAt: '2026-12-20T03:30:00.000Z'
    },
    {
      id: 'ANN-02',
      title: 'Official Judge Briefing & Encryption Protocol Conclave',
      summary: 'Mandatory briefing for all 18 appointed academic judges in the Senate Chamber regarding double-entry verification and encrypted PIN rubrics.',
      content: 'A mandatory technical orientation session for all appointed Adjudicators across Literary, Public Speaking, Fine Arts, and Islamic Heritage panels will be convened at 09:30 AM in the Senate Adjudication Chambers.\\n\\nPresided over by Chief Adjudicator Dr. Sayyid Munawwar Ali, the session will review the 4-tier rubric evaluation mechanism, double-entry verification checks, and the digital Judge Portal PIN cryptographic locking system.',
      category: 'Important Notice',
      targetAudience: 'Judges',
      relatedProgrammeId: 'PRG-002',
      relatedProgrammeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Urgent',
      status: 'Published',
      publishDate: 'Dec 20, 2026',
      publishTime: '02:00 PM',
      publishTimestamp: '2026-12-20T08:30:00.000Z',
      expiryDate: 'Dec 22, 2026',
      expiryTime: '06:00 PM',
      expiryTimestamp: '2026-12-22T12:30:00.000Z',
      featuredImageUrl: '/assets/guests/portrait_ahmed_faris.png',
      attachmentUrl: '/assets/banner_full.png',
      attachmentName: 'judge_adjudication_rubric_handbook.pdf',
      attachmentSize: '1.8 MB',
      viewsCount: 284,
      isPinned: true,
      isArchived: false,
      author: 'Academic Board',
      createdAt: '2026-12-20T08:30:00.000Z',
      updatedAt: '2026-12-20T08:30:00.000Z'
    },
    {
      id: 'ANN-03',
      title: 'Team Captains Protocol & Chest Number Verification Desk',
      summary: 'Secretariat announcement for all 12 registered Team Leaders regarding candidate substitutions, timekeeper synchronization, and appeal procedures.',
      content: 'All official Team Captains and Faculty Mentors are hereby instructed to attend the Captains Advisory Council at 11:00 AM in the Secretariat Conference Room.\\n\\nStrict adherence to participant chest numbers (C-101 through C-424) is mandatory. Any formal replacement request must be submitted with written endorsement before the 12:00 PM deadline. Uncertified substitutions will incur automatic disqualification.',
      category: 'Registration Notice',
      targetAudience: 'Team Leaders',
      relatedProgrammeId: null,
      relatedProgrammeTitle: null,
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Important',
      status: 'Published',
      publishDate: 'Dec 20, 2026',
      publishTime: '04:30 PM',
      publishTimestamp: '2026-12-20T11:00:00.000Z',
      expiryDate: 'Dec 22, 2026',
      expiryTime: '11:59 PM',
      expiryTimestamp: '2026-12-22T18:29:00.000Z',
      featuredImageUrl: '/assets/models/Dalenzia Fest Team Management Dashboard.png',
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      viewsCount: 460,
      isPinned: false,
      isArchived: false,
      author: 'Festival Secretariat',
      createdAt: '2026-12-20T11:00:00.000Z',
      updatedAt: '2026-12-20T11:00:00.000Z'
    },
    {
      id: 'ANN-04',
      title: 'Junior Arabic Essay (LIT-JR-102) Syllabus & Call Time Update',
      summary: 'Candidates enrolled in Junior Arabic Essay must report to Ibn Khaldun Academic Hall (Stage 03) at 01:30 PM with authorized writing instruments.',
      content: 'Competitors registered in LIT-JR-102 (Junior Arabic Essay) are instructed that the preliminary writing window begins at 02:00 PM sharp in Ibn Khaldun Hall.\\n\\nOfficial stamped parchment sheets will be provided by the secretariat invigilators. Students may bring their own blue or black fountain pens. Reference materials, lexicons, and digital smart devices are strictly prohibited.',
      category: 'Competition Update',
      targetAudience: 'Students',
      relatedProgrammeId: 'PRG-005',
      relatedProgrammeTitle: 'Senior Malayalam Elocution Grand Stage',
      relatedCompetitionId: 'COMP-LIT-01',
      relatedCompetitionTitle: 'Junior Arabic Essay (LIT-JR-102)',
      priority: 'Normal',
      status: 'Published',
      publishDate: 'Dec 21, 2026',
      publishTime: '08:00 AM',
      publishTimestamp: '2026-12-21T02:30:00.000Z',
      expiryDate: 'Dec 21, 2026',
      expiryTime: '06:00 PM',
      expiryTimestamp: '2026-12-21T12:30:00.000Z',
      featuredImageUrl: '/assets/events/comp_arabic_essay.png',
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      viewsCount: 790,
      isPinned: false,
      isArchived: false,
      author: 'Literary Guild Controller',
      createdAt: '2026-12-21T02:30:00.000Z',
      updatedAt: '2026-12-21T02:30:00.000Z'
    },
    {
      id: 'ANN-05',
      title: 'Stage 02 Al-Farabi Hall Acoustic Calibration Adjustment',
      summary: 'Session 04 start time shifted by 15 minutes to 01:15 PM due to high-precision acoustic tuning for classical poetry recitations.',
      content: 'The Stage Operations Engineering Team has requested a brief 15-minute acoustic calibration buffer at Stage 02 (Al-Farabi Heritage Hall) to optimize dynamic vocal microphones for the classical Munadarah parliamentary debate.\\n\\nAll attendees and student debaters should take note that Stage 02 proceedings will resume at 01:15 PM.',
      category: 'Schedule Change',
      targetAudience: 'Everyone',
      relatedProgrammeId: 'PRG-004',
      relatedProgrammeTitle: 'Thematic Colloquium: Faith, Reason & Global Modernity',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Important',
      status: 'Published',
      publishDate: 'Dec 21, 2026',
      publishTime: '11:30 AM',
      publishTimestamp: '2026-12-21T06:00:00.000Z',
      expiryDate: 'Dec 21, 2026',
      expiryTime: '03:00 PM',
      expiryTimestamp: '2026-12-21T09:30:00.000Z',
      featuredImageUrl: '/assets/schedule/schedule_hero_stage.png',
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      viewsCount: 910,
      isPinned: false,
      isArchived: false,
      author: 'Stage Logistics Desk',
      createdAt: '2026-12-21T06:00:00.000Z',
      updatedAt: '2026-12-21T06:00:00.000Z'
    },
    {
      id: 'ANN-06',
      title: 'Official Result Declaration: Junior Arabic Essay Championship',
      summary: 'The Secretariat officially proclaims 1st, 2nd, and 3rd prize honours for LIT-JR-102. Team A secures 30 points, Team B 20 points, Team A 10 points.',
      content: 'Following comprehensive adjudication and double-entry audit certification, the official results for Junior Arabic Essay (LIT-JR-102) are published:\\n\\n• First Prize: Ahmad Rayan K. (Chest C-101, Team A) — 96.5 / 100 (+30 Pts)\\n• Second Prize: Muhammed Sinan T. (Chest C-201, Team B) — 92.0 / 100 (+20 Pts)\\n• Third Prize: Zayan Kabeer (Chest C-103, Team A) — 88.5 / 100 (+10 Pts)\\n\\nOfficial result posters are now accessible on the public Downloads portal and live leaderboard.',
      category: 'Result Announcement',
      targetAudience: 'Everyone',
      relatedProgrammeId: 'PRG-005',
      relatedProgrammeTitle: 'Senior Malayalam Elocution Grand Stage',
      relatedCompetitionId: 'COMP-LIT-01',
      relatedCompetitionTitle: 'Junior Arabic Essay (LIT-JR-102)',
      priority: 'Important',
      status: 'Published',
      publishDate: 'Dec 21, 2026',
      publishTime: '05:45 PM',
      publishTimestamp: '2026-12-21T12:15:00.000Z',
      expiryDate: 'Dec 23, 2026',
      expiryTime: '11:59 PM',
      expiryTimestamp: '2026-12-23T18:29:00.000Z',
      featuredImageUrl: '/assets/results/results_hero_stage.png',
      attachmentUrl: '/assets/results/results_hero_stage.png',
      attachmentName: 'official_result_certificate_LIT-JR-102.png',
      attachmentSize: '5.6 MB',
      viewsCount: 2150,
      isPinned: false,
      isArchived: false,
      author: 'Scoring Board',
      createdAt: '2026-12-21T12:15:00.000Z',
      updatedAt: '2026-12-21T12:15:00.000Z'
    },
    {
      id: 'ANN-07',
      title: 'Secretariat Emergency Backup Generator Switch Notice',
      summary: 'Scheduled seamless auxiliary electrical switchover across campus stages at 01:30 PM for 2 minutes. Internal administrative notice only.',
      content: 'Campus Facility Engineering will conduct a routine auxiliary load switchover for Stage 01 and Stage 03 uninterruptible power systems (UPS) at 01:30 PM.\\n\\nAll administrative servers, network switches, and judging terminals will remain on isolated battery backup. Technical personnel are requested to monitor stage monitors during this interval.',
      category: 'Emergency Notice',
      targetAudience: 'Admin Only',
      relatedProgrammeId: null,
      relatedProgrammeTitle: null,
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Urgent',
      status: 'Published',
      publishDate: 'Dec 21, 2026',
      publishTime: '01:15 PM',
      publishTimestamp: '2026-12-21T07:45:00.000Z',
      expiryDate: 'Dec 21, 2026',
      expiryTime: '02:00 PM',
      expiryTimestamp: '2026-12-21T08:30:00.000Z',
      featuredImageUrl: null,
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      viewsCount: 42,
      isPinned: false,
      isArchived: false,
      author: 'Technical Controller',
      createdAt: '2026-12-21T07:45:00.000Z',
      updatedAt: '2026-12-21T07:45:00.000Z'
    },
    {
      id: 'ANN-08',
      title: 'Championship Trophy Ceremony & Valedictory Seating Order',
      summary: 'Final evening schedule and VIP procession protocol for the Grand Valedictory Conclave at Cordova Grand Stage.',
      content: 'The Festival Steering Committee has established the official protocol for the closing Valedictory Assembly.\\n\\nTeam delegations will be ushered into designated tiered seating by 03:45 PM. The conferment of the Dalenzia 2K26 Rolling Champions Trophy and individual Gold Medallions will take place under the auspices of Chancellor and honorable guest dignitaries.',
      category: 'Programme Update',
      targetAudience: 'Everyone',
      relatedProgrammeId: 'PRG-011',
      relatedProgrammeTitle: 'Grand Valedictory Conclave & Championship Award',
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Normal',
      status: 'Scheduled',
      publishDate: 'Dec 22, 2026',
      publishTime: '04:00 PM',
      publishTimestamp: '2026-12-22T10:30:00.000Z',
      expiryDate: 'Dec 23, 2026',
      expiryTime: '11:59 PM',
      expiryTimestamp: '2026-12-23T18:29:00.000Z',
      featuredImageUrl: '/assets/models/Dalenzia Nueva Era Festival Storyboard.png',
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      viewsCount: 0,
      isPinned: false,
      isArchived: false,
      author: 'Festival Secretariat',
      createdAt: '2026-12-20T10:00:00.000Z',
      updatedAt: '2026-12-20T10:00:00.000Z'
    },
    {
      id: 'ANN-09',
      title: 'Draft Circular: Post-Festival Campus Cleanliness Drive',
      summary: 'Volunteer green protocol instructions for eco-friendly campus maintenance and waste segregation post-valedictory.',
      content: 'Draft internal memorandum outlining the deployment of 50 student green volunteers across Cordova Stage and exhibition corridors.\\n\\nPending approval by the Environmental Welfare Officer.',
      category: 'General Announcement',
      targetAudience: 'Students',
      relatedProgrammeId: null,
      relatedProgrammeTitle: null,
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Normal',
      status: 'Draft',
      publishDate: 'Dec 22, 2026',
      publishTime: '06:00 PM',
      publishTimestamp: '2026-12-22T12:30:00.000Z',
      expiryDate: null,
      expiryTime: null,
      expiryTimestamp: null,
      featuredImageUrl: null,
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      viewsCount: 0,
      isPinned: false,
      isArchived: false,
      author: 'Green Protocol Committee',
      createdAt: '2026-12-20T12:00:00.000Z',
      updatedAt: '2026-12-20T12:00:00.000Z'
    },
    {
      id: 'ANN-10',
      title: 'Expired Notice: Pre-Festival Registration Deadline',
      summary: 'Historical circular marking the closure of initial team registrations and squad submissions on December 15, 2026.',
      content: 'Notice of closure for all student registrations. No late entries accepted without steering committee executive dispensation.',
      category: 'Registration Notice',
      targetAudience: 'Everyone',
      relatedProgrammeId: null,
      relatedProgrammeTitle: null,
      relatedCompetitionId: null,
      relatedCompetitionTitle: null,
      priority: 'Normal',
      status: 'Expired',
      publishDate: 'Dec 15, 2026',
      publishTime: '05:00 PM',
      publishTimestamp: '2026-12-15T11:30:00.000Z',
      expiryDate: 'Dec 18, 2026',
      expiryTime: '11:59 PM',
      expiryTimestamp: '2026-12-18T18:29:00.000Z',
      featuredImageUrl: null,
      attachmentUrl: null,
      attachmentName: null,
      attachmentSize: null,
      viewsCount: 890,
      isPinned: false,
      isArchived: false,
      author: 'Registrar',
      createdAt: '2026-12-15T11:30:00.000Z',
      updatedAt: '2026-12-18T18:30:00.000Z'
    }
  ],
\n`;

  content = content.slice(0, auditLogsIdx) + announcementDataInjection + content.slice(auditLogsIdx);
  console.log('Injected announcementCategories and announcements into INITIAL_DATA');
}

// 2. Add ensure checks to loadData()
const loadDataAnchor = 'if (!currentData.posterTemplates || !Array.isArray(currentData.posterTemplates) || currentData.posterTemplates.length < 3) {';
if (!content.includes('if (!currentData.announcementCategories || !Array.isArray(currentData.announcementCategories) || currentData.announcementCategories.length === 0) {')) {
  const ensureIdx = content.indexOf(loadDataAnchor);
  if (ensureIdx !== -1) {
    const nextLineIdx = content.indexOf('currentData.posterTemplates = INITIAL_DATA.posterTemplates;\n    }', ensureIdx);
    const insertPoint = nextLineIdx + 'currentData.posterTemplates = INITIAL_DATA.posterTemplates;\n    }'.length;

    const ensureCode = `\n    if (!currentData.announcementCategories || !Array.isArray(currentData.announcementCategories) || currentData.announcementCategories.length === 0) {
      currentData.announcementCategories = INITIAL_DATA.announcementCategories;
    }
    if (!currentData.announcements || !Array.isArray(currentData.announcements) || currentData.announcements.length < 5) {
      currentData.announcements = INITIAL_DATA.announcements;
    }`;

    content = content.slice(0, insertPoint) + ensureCode + content.slice(insertPoint);
    console.log('Injected loadData ensure checks for announcements');
  }
}

// 3. Add Announcements Methods before final closing brace of FestivalStore
if (!content.includes('getAnnouncementCategories()')) {
  const lastBraceIdx = content.lastIndexOf('}\n\nexport const festivalStore');
  if (lastBraceIdx === -1) {
    throw new Error('Could not find end of FestivalStore class');
  }

  const announcementMethods = `
  // =========================================================================
  // STEP 11 - ANNOUNCEMENTS MANAGEMENT
  // =========================================================================

  getAnnouncementCategories() {
    return this.data.announcementCategories || [];
  }

  // Evaluate scheduled releases and expired entries based on current local time
  _evaluateAnnouncementTimings() {
    const now = new Date();
    let hasChanges = false;

    (this.data.announcements || []).forEach(ann => {
      // 1. Scheduled -> Published transition if scheduled time reached
      if (ann.status === 'Scheduled' && ann.publishTimestamp) {
        const schedTime = new Date(ann.publishTimestamp);
        if (now >= schedTime) {
          ann.status = 'Published';
          ann.updatedAt = now.toISOString();
          hasChanges = true;
          // Dispatch in-app notification if audience includes Judges or Everyone
          this._syncAnnouncementNotification(ann);
        }
      }

      // 2. Published -> Expired transition if expiry time passed
      if (ann.status === 'Published' && ann.expiryTimestamp) {
        const expTime = new Date(ann.expiryTimestamp);
        if (now > expTime) {
          ann.status = 'Expired';
          ann.updatedAt = now.toISOString();
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      this.saveData();
    }
  }

  _syncAnnouncementNotification(ann) {
    if (!this.data.notifications) this.data.notifications = [];
    const notifKey = \`ANN-NOTIF-\${ann.id}\`;
    const alreadyExists = this.data.notifications.some(n => n.announcementId === ann.id || n.id === notifKey);
    if (alreadyExists) return;

    if (ann.targetAudience === 'Judges' || ann.targetAudience === 'Everyone') {
      const newNotif = {
        id: notifKey,
        announcementId: ann.id,
        judgeId: null, // Broadcast to all judges
        recipientName: 'All Official Adjudicators',
        type: ann.category || 'Announcement',
        title: ann.title,
        message: ann.summary || ann.title,
        date: \`\${ann.publishDate || 'Today'}, \${ann.publishTime || 'Now'}\`,
        priority: ann.priority,
        read: false,
        createdAt: new Date().toISOString()
      };
      this.data.notifications.unshift(newNotif);
    }
  }

  getAnnouncements(options = {}) {
    this._evaluateAnnouncementTimings();

    let list = [...(this.data.announcements || [])];
    const {
      category = 'all',
      audience = 'all',
      priority = 'all',
      status = 'all',
      includeArchived = false,
      programmeId = 'all',
      competitionId = 'all',
      query = '',
      sortBy = 'newest',
      portalRole = null // 'student' | 'team_leader' | 'judge' | 'public' | 'admin'
    } = options;

    if (!includeArchived) {
      list = list.filter(a => !a.isArchived && a.status !== 'Archived');
    }

    // Role-based Audience Filtering
    if (portalRole === 'public') {
      list = list.filter(a => a.targetAudience === 'Everyone' && a.status === 'Published');
    } else if (portalRole === 'student') {
      list = list.filter(a => (a.targetAudience === 'Everyone' || a.targetAudience === 'Students') && a.status === 'Published');
    } else if (portalRole === 'team_leader') {
      list = list.filter(a => (a.targetAudience === 'Everyone' || a.targetAudience === 'Team Leaders') && a.status === 'Published');
    } else if (portalRole === 'judge') {
      list = list.filter(a => (a.targetAudience === 'Everyone' || a.targetAudience === 'Judges') && a.status === 'Published');
    } else if (portalRole !== 'admin' && audience && audience !== 'all') {
      list = list.filter(a => a.targetAudience === audience || a.targetAudience === 'Everyone');
    } else if (audience && audience !== 'all') {
      list = list.filter(a => a.targetAudience === audience);
    }

    if (category && category !== 'all') {
      list = list.filter(a => a.category === category);
    }

    if (priority && priority !== 'all') {
      list = list.filter(a => a.priority === priority);
    }

    if (status && status !== 'all') {
      list = list.filter(a => a.status === status);
    }

    if (programmeId && programmeId !== 'all') {
      list = list.filter(a => a.relatedProgrammeId === programmeId);
    }

    if (competitionId && competitionId !== 'all') {
      list = list.filter(a => a.relatedCompetitionId === competitionId);
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(a =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        (a.content && a.content.toLowerCase().includes(q)) ||
        (a.category && a.category.toLowerCase().includes(q)) ||
        (a.targetAudience && a.targetAudience.toLowerCase().includes(q)) ||
        (a.author && a.author.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'pinned_first') {
      list.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === 'priority') {
      const pWeight = { 'Urgent': 3, 'Important': 2, 'Normal': 1 };
      list.sort((a, b) => (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0));
    } else if (sortBy === 'views') {
      list.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }

  getAnnouncementById(id) {
    this._evaluateAnnouncementTimings();
    return (this.data.announcements || []).find(a => a.id === id) || null;
  }

  addAnnouncement(annData, adminUser = 'Super Admin') {
    if (!annData.title || !annData.title.trim()) {
      throw new Error('Announcement title is mandatory.');
    }

    const list = this.data.announcements || [];
    const maxNum = list.reduce((max, a) => {
      const match = (a.id || '').match(/ANN-(\\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 0);
    const newId = \`ANN-\${(maxNum + 1).toString().padStart(2, '0')}\`;

    // Auto-resolve programme title
    let progTitle = annData.relatedProgrammeTitle || null;
    if (annData.relatedProgrammeId && !progTitle) {
      const prog = (this.data.programmes || []).find(p => p.id === annData.relatedProgrammeId);
      if (prog) progTitle = prog.title;
    }

    // Auto-resolve competition title
    let compTitle = annData.relatedCompetitionTitle || null;
    if (annData.relatedCompetitionId && !compTitle) {
      const comp = this.getCompetitionById(annData.relatedCompetitionId);
      if (comp) compTitle = comp.title;
    }

    const now = new Date();
    const createdDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const createdTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Compute publish timestamps
    let pubTimestamp = now.toISOString();
    let initialStatus = annData.status || 'Draft';

    if (annData.publishDate && annData.publishTime) {
      try {
        const parsedPub = new Date(\`\${annData.publishDate} \${annData.publishTime}\`);
        if (!isNaN(parsedPub.getTime())) {
          pubTimestamp = parsedPub.toISOString();
          if (parsedPub > now && initialStatus !== 'Draft') {
            initialStatus = 'Scheduled';
          }
        }
      } catch (e) {
        console.warn('Date parse fallback', e);
      }
    }

    // Compute expiry timestamp
    let expTimestamp = null;
    if (annData.expiryDate) {
      try {
        const parsedExp = new Date(\`\${annData.expiryDate} \${annData.expiryTime || '11:59 PM'}\`);
        if (!isNaN(parsedExp.getTime())) {
          expTimestamp = parsedExp.toISOString();
        }
      } catch (e) {
        console.warn('Expiry date parse fallback', e);
      }
    }

    const newAnnouncement = {
      id: newId,
      title: annData.title.trim(),
      summary: (annData.summary || '').trim(),
      content: (annData.content || annData.summary || '').trim(),
      category: annData.category || 'General Announcement',
      targetAudience: annData.targetAudience || 'Everyone',
      relatedProgrammeId: annData.relatedProgrammeId || null,
      relatedProgrammeTitle: progTitle,
      relatedCompetitionId: annData.relatedCompetitionId || null,
      relatedCompetitionTitle: compTitle,
      priority: annData.priority || 'Normal',
      status: initialStatus,
      publishDate: annData.publishDate || createdDateStr,
      publishTime: annData.publishTime || createdTimeStr,
      publishTimestamp: pubTimestamp,
      expiryDate: annData.expiryDate || null,
      expiryTime: annData.expiryTime || null,
      expiryTimestamp: expTimestamp,
      featuredImageUrl: annData.featuredImageUrl || null,
      attachmentUrl: annData.attachmentUrl || null,
      attachmentName: annData.attachmentName || null,
      attachmentSize: annData.attachmentSize || null,
      viewsCount: 0,
      isPinned: Boolean(annData.isPinned),
      isArchived: false,
      author: annData.author || adminUser || 'Festival Secretariat',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    this.data.announcements.unshift(newAnnouncement);

    // If published immediately, dispatch notification to judges
    if (newAnnouncement.status === 'Published') {
      this._syncAnnouncementNotification(newAnnouncement);
    }

    this.addAuditLog('ANNOUNCEMENT_CREATED', adminUser, \`Created announcement "\${newAnnouncement.title}" (\${newAnnouncement.id}) for audience \${newAnnouncement.targetAudience}\`);
    this.saveData();
    return newAnnouncement;
  }

  updateAnnouncement(id, updateData, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    // Auto-resolve programme title if changed
    if (updateData.relatedProgrammeId && updateData.relatedProgrammeId !== ann.relatedProgrammeId) {
      const prog = (this.data.programmes || []).find(p => p.id === updateData.relatedProgrammeId);
      if (prog) updateData.relatedProgrammeTitle = prog.title;
    }

    // Auto-resolve competition title if changed
    if (updateData.relatedCompetitionId && updateData.relatedCompetitionId !== ann.relatedCompetitionId) {
      const comp = this.getCompetitionById(updateData.relatedCompetitionId);
      if (comp) updateData.relatedCompetitionTitle = comp.title;
    }

    // Recompute timestamps if date/time altered
    if (updateData.publishDate || updateData.publishTime) {
      const dateStr = updateData.publishDate || ann.publishDate;
      const timeStr = updateData.publishTime || ann.publishTime;
      try {
        const parsed = new Date(\`\${dateStr} \${timeStr}\`);
        if (!isNaN(parsed.getTime())) {
          updateData.publishTimestamp = parsed.toISOString();
          const now = new Date();
          if (parsed > now && (updateData.status || ann.status) !== 'Draft') {
            updateData.status = 'Scheduled';
          }
        }
      } catch (e) {}
    }

    if (updateData.expiryDate) {
      const dateStr = updateData.expiryDate;
      const timeStr = updateData.expiryTime || ann.expiryTime || '11:59 PM';
      try {
        const parsed = new Date(\`\${dateStr} \${timeStr}\`);
        if (!isNaN(parsed.getTime())) {
          updateData.expiryTimestamp = parsed.toISOString();
        }
      } catch (e) {}
    }

    Object.assign(ann, updateData);
    ann.updatedAt = new Date().toISOString();

    if (ann.status === 'Published') {
      this._syncAnnouncementNotification(ann);
    }

    this.addAuditLog('ANNOUNCEMENT_UPDATED', adminUser, \`Updated announcement "\${ann.title}" (\${ann.id})\`);
    this.saveData();
    return ann;
  }

  publishAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    ann.status = 'Published';
    ann.isArchived = false;
    ann.updatedAt = new Date().toISOString();

    this._syncAnnouncementNotification(ann);
    this.addAuditLog('ANNOUNCEMENT_PUBLISHED', adminUser, \`Published announcement "\${ann.title}" (\${ann.id})\`);
    this.saveData();
    return ann;
  }

  unpublishAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    ann.status = 'Draft';
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_UNPUBLISHED', adminUser, \`Unpublished announcement "\${ann.title}" (\${ann.id}) to Draft\`);
    this.saveData();
    return ann;
  }

  scheduleAnnouncement(id, publishDate, publishTime, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    const parsed = new Date(\`\${publishDate} \${publishTime}\`);
    if (isNaN(parsed.getTime())) throw new Error('Invalid schedule date or time');

    ann.publishDate = publishDate;
    ann.publishTime = publishTime;
    ann.publishTimestamp = parsed.toISOString();
    ann.status = 'Scheduled';
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_SCHEDULED', adminUser, \`Scheduled announcement "\${ann.title}" (\${ann.id}) for \${publishDate} \${publishTime}\`);
    this.saveData();
    return ann;
  }

  extendAnnouncementExpiry(id, newExpiryDate, newExpiryTime = '11:59 PM', adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    const parsed = new Date(\`\${newExpiryDate} \${newExpiryTime}\`);
    if (isNaN(parsed.getTime())) throw new Error('Invalid expiry date or time');

    ann.expiryDate = newExpiryDate;
    ann.expiryTime = newExpiryTime;
    ann.expiryTimestamp = parsed.toISOString();
    if (ann.status === 'Expired' && parsed > new Date()) {
      ann.status = 'Published';
    }
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_EXPIRY_EXTENDED', adminUser, \`Extended expiry for "\${ann.title}" (\${ann.id}) to \${newExpiryDate}\`);
    this.saveData();
    return ann;
  }

  togglePinAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    ann.isPinned = !ann.isPinned;
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_PIN_TOGGLED', adminUser, \`Toggled pinned status for "\${ann.title}" (\${ann.id}) to \${ann.isPinned}\`);
    this.saveData();
    return ann;
  }

  archiveAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    ann.status = 'Archived';
    ann.isArchived = true;
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_ARCHIVED', adminUser, \`Archived announcement "\${ann.title}" (\${ann.id})\`);
    this.saveData();
    return ann;
  }

  restoreAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(\`Announcement \${id} not found\`);

    ann.status = 'Draft';
    ann.isArchived = false;
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_RESTORED', adminUser, \`Restored announcement "\${ann.title}" (\${ann.id}) to Draft\`);
    this.saveData();
    return ann;
  }

  deleteAnnouncement(id, { adminUser = 'Super Admin' } = {}) {
    const index = (this.data.announcements || []).findIndex(a => a.id === id);
    if (index === -1) throw new Error(\`Announcement \${id} not found\`);

    const deleted = this.data.announcements.splice(index, 1)[0];
    this.addAuditLog('ANNOUNCEMENT_DELETED', adminUser, \`Permanently deleted announcement "\${deleted.title}" (\${deleted.id})\`);
    this.saveData();
    return deleted;
  }

  incrementAnnouncementView(id) {
    const ann = (this.data.announcements || []).find(a => a.id === id);
    if (ann) {
      ann.viewsCount = (ann.viewsCount || 0) + 1;
      this.saveData();
      return ann.viewsCount;
    }
    return 0;
  }

  // --- ANNOUNCEMENT DASHBOARD METRICS ---

  getAnnouncementDashboardStats() {
    this._evaluateAnnouncementTimings();

    const list = this.data.announcements || [];

    const totalAnnouncements = list.length;
    const publishedAnnouncements = list.filter(a => a.status === 'Published' && !a.isArchived).length;
    const draftAnnouncements = list.filter(a => a.status === 'Draft' && !a.isArchived).length;
    const scheduledAnnouncements = list.filter(a => a.status === 'Scheduled' && !a.isArchived).length;
    const expiredAnnouncements = list.filter(a => a.status === 'Expired' && !a.isArchived).length;
    const archivedAnnouncements = list.filter(a => a.status === 'Archived' || a.isArchived).length;

    const urgentAnnouncements = list.filter(a => a.priority === 'Urgent' && a.status === 'Published' && !a.isArchived).length;

    const audienceDistribution = {
      everyone: list.filter(a => a.targetAudience === 'Everyone').length,
      teamLeaders: list.filter(a => a.targetAudience === 'Team Leaders').length,
      students: list.filter(a => a.targetAudience === 'Students').length,
      judges: list.filter(a => a.targetAudience === 'Judges').length,
      adminOnly: list.filter(a => a.targetAudience === 'Admin Only').length
    };

    const recentAnnouncements = [...list]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    return {
      totalAnnouncements,
      publishedAnnouncements,
      draftAnnouncements,
      scheduledAnnouncements,
      expiredAnnouncements,
      archivedAnnouncements,
      urgentAnnouncements,
      audienceDistribution,
      recentAnnouncements
    };
  }

  // --- PUBLIC & PORTAL INTEGRATION ---

  getPublicAnnouncements(options = {}) {
    // Strictly: targetAudience === 'Everyone', status === 'Published', unexpired, non-archived
    return this.getAnnouncements({
      ...options,
      portalRole: 'public',
      includeArchived: false,
      sortBy: 'pinned_first'
    }).map(a => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      content: a.content,
      category: a.category,
      priority: a.priority,
      publishDate: a.publishDate,
      publishTime: a.publishTime,
      featuredImageUrl: a.featuredImageUrl,
      attachmentUrl: a.attachmentUrl,
      attachmentName: a.attachmentName,
      attachmentSize: a.attachmentSize,
      isPinned: a.isPinned,
      author: a.author,
      relatedProgrammeTitle: a.relatedProgrammeTitle,
      relatedCompetitionTitle: a.relatedCompetitionTitle
    }));
  }

  getAudienceAnnouncements(audienceRole, options = {}) {
    return this.getAnnouncements({
      ...options,
      portalRole: audienceRole,
      includeArchived: false,
      sortBy: 'pinned_first'
    });
  }
`;

  content = content.slice(0, lastBraceIdx) + announcementMethods + '\n' + content.slice(lastBraceIdx);
  console.log('Injected Announcements methods into FestivalStore class');
}

fs.writeFileSync(storePath, content, 'utf8');
console.log('Successfully updated festivalStore.js! New size:', content.length, 'bytes');
