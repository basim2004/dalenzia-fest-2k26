const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../src/admin/data/festivalStore.js');
let code = fs.readFileSync(storePath, 'utf8');

// Check if already injected
if (code.includes('verifyConvenerLogin(')) {
  console.log('Convener methods already present in festivalStore.js');
  process.exit(0);
}

// 1. Initial Data additions
const initialConvenerDataSnippet = `
const INITIAL_CONVENER_USER = {
  id: 'CNV-01',
  name: 'Usthad Hashir Ali',
  email: 'convener@dalenziafest.in',
  password: 'convener2k26',
  role: 'convener',
  roleLabel: 'Official Festival Convener',
  designation: 'General Convener',
  institution: 'Dalailussunna Dars, Ayiroor',
  phone: '+91 98471 55660',
  avatar: '/assets/admin/admin_sidebar_logo.png',
  lastLogin: '2026-12-21 08:00 AM'
};

const INITIAL_OPERATIONAL_ACTIVITIES = [
  {
    id: 'ACT-001',
    code: 'ACT-FOD-01',
    title: 'Festival Dining & Food Court Logistics',
    description: 'Coordination of breakfast, lunch, and dinner distribution counters for 1,200+ delegates and judges.',
    category: 'Logistics & Hospitality',
    date: 'Dec 21, 2026',
    time: '07:30 AM – 09:30 PM',
    venue: 'Campus Dining Pavilion',
    responsiblePerson: 'Usthad Anas K. (Food Convener)',
    phone: '+91 98471 11223',
    status: 'In Progress',
    priority: 'Urgent',
    teamId: null,
    programmeId: null,
    internalRemarks: 'Special dietary arrangements confirmed for VIP guest scholars.'
  },
  {
    id: 'ACT-002',
    code: 'ACT-STG-02',
    title: 'Cordova Stage Lighting & Audio-Visual Trials',
    description: 'Technical calibration of main line-array sound systems, podium microphones, and dual LED backdrop walls.',
    category: 'Technical & Stage',
    date: 'Dec 21, 2026',
    time: '08:00 AM – 10:00 AM',
    venue: 'Cordova Grand Stage (Stage 01)',
    responsiblePerson: 'Er. Niyas V. (AV Lead)',
    phone: '+91 97451 22334',
    status: 'Completed',
    priority: 'Important',
    teamId: null,
    programmeId: 'PRG-001',
    internalRemarks: 'Full acoustic sound check completed with zero feedback.'
  },
  {
    id: 'ACT-003',
    code: 'ACT-VOL-03',
    title: 'Volunteer Roster & Accreditation Desk',
    description: 'Issuance of volunteer badges, team squad marshaling bands, and arena access tags.',
    category: 'Volunteer Management',
    date: 'Dec 21, 2026',
    time: '08:30 AM – 11:00 AM',
    venue: 'Registration Desk (Main Gate)',
    responsiblePerson: 'Ahmad Rifai (Volunteer Lead)',
    phone: '+91 98471 20001',
    status: 'Completed',
    priority: 'Normal',
    teamId: 'team-01',
    programmeId: null,
    internalRemarks: '86 student volunteers deployed across 5 arenas.'
  },
  {
    id: 'ACT-004',
    code: 'ACT-VIP-04',
    title: 'Keynote Scholar Reception & Transit Protocol',
    description: 'Airport and railway pickup coordination for chief guests, keynote scholars, and jury members.',
    category: 'Guest Protocol',
    date: 'Dec 21, 2026',
    time: '09:00 AM – 02:00 PM',
    venue: 'VIP Guest Lounge',
    responsiblePerson: 'Usthad Musthafa Hudawi',
    phone: '+91 94471 28910',
    status: 'In Progress',
    priority: 'Urgent',
    teamId: null,
    programmeId: 'PRG-002',
    internalRemarks: 'Escort vehicle standby at Calicut Airport for Dr. Sayyid Munawwar Ali.'
  },
  {
    id: 'ACT-005',
    code: 'ACT-MED-05',
    title: 'Medical Desk & Emergency First Aid Counter',
    description: 'Paramedic standby, hydration counter, and basic first aid readiness for participants.',
    category: 'Safety & Health',
    date: 'Dec 21, 2026',
    time: '08:00 AM – 10:00 PM',
    venue: 'Campus Health Centre',
    responsiblePerson: 'Dr. Noufal K. (Medical Officer)',
    phone: '+91 98460 31245',
    status: 'Active',
    priority: 'Important',
    teamId: null,
    programmeId: null,
    internalRemarks: 'Ambulance on standby at North Gate.'
  },
  {
    id: 'ACT-006',
    code: 'ACT-PRZ-06',
    title: 'Laureate Memento & Certificate Curation',
    description: 'Cross-checking official verified result posters with mementos and Gold/Silver/Bronze medals.',
    category: 'Awards & Mementos',
    date: 'Dec 22, 2026',
    time: '02:00 PM – 05:00 PM',
    venue: 'Academic Secretariat Room',
    responsiblePerson: 'Usthad Rashad (Certificates In-Charge)',
    phone: '+91 97455 88990',
    status: 'Pending',
    priority: 'Normal',
    teamId: null,
    programmeId: 'PRG-012',
    internalRemarks: 'All 48 prize medals checked against certified winner podiums.'
  }
];
`;

// Insert snippet near INITIAL_DATA declaration
const initialDataMarker = 'const INITIAL_DATA = {';
const snippetIndex = code.indexOf(initialDataMarker);
if (snippetIndex !== -1) {
  code = code.substring(0, snippetIndex) + initialConvenerDataSnippet + '\n' + code.substring(snippetIndex);
}

// Also add to loadData() checks
const loadDataEnsureSnippet = `
    if (!currentData.convenerUser) {
      currentData.convenerUser = INITIAL_CONVENER_USER;
    }
    if (!currentData.operationalActivities || !Array.isArray(currentData.operationalActivities)) {
      currentData.operationalActivities = INITIAL_OPERATIONAL_ACTIVITIES;
    }
`;

const loadDataMarker = 'if (!currentData.programmeStages';
const loadDataIdx = code.indexOf(loadDataMarker);
if (loadDataIdx !== -1) {
  code = code.substring(0, loadDataIdx) + loadDataEnsureSnippet + code.substring(loadDataIdx);
}

// 2. Convener Methods
const convenerMethods = `
  // =========================================================================
  // CONVENER PORTAL INTEGRATION METHODS
  // =========================================================================

  verifyConvenerLogin(email, password) {
    const user = this.data.convenerUser || INITIAL_CONVENER_USER;
    if (
      (email.trim().toLowerCase() === user.email.toLowerCase() || email.trim().toLowerCase() === 'convener') &&
      password === user.password
    ) {
      const session = {
        id: user.id,
        user: user.name,
        email: user.email,
        role: 'convener',
        roleLabel: 'Official Festival Convener',
        designation: user.designation,
        institution: user.institution,
        phone: user.phone,
        avatar: user.avatar,
        token: \`jwt_convener_\${Date.now()}\`,
        loginTime: new Date().toLocaleTimeString()
      };
      this.addAuditLog('CONVENER_LOGIN', \`Convener \${user.name} authenticated into Convener Operational Portal\`, 'Convener');
      return { success: true, session };
    }
    return { success: false, error: 'Invalid Convener credentials. Access restricted to authorized Festival Convener.' };
  }

  getConvenerProfile() {
    return this.data.convenerUser || INITIAL_CONVENER_USER;
  }

  updateConvenerProfile(updateData) {
    if (!this.data.convenerUser) this.data.convenerUser = { ...INITIAL_CONVENER_USER };
    this.data.convenerUser = {
      ...this.data.convenerUser,
      ...updateData
    };
    this.addAuditLog('CONVENER_PROFILE_UPDATED', \`Convener profile information updated\`, 'Convener');
    this.saveData();
    this._notify();
    return { success: true, profile: this.data.convenerUser };
  }

  updateConvenerPassword(currentPassword, newPassword) {
    if (!this.data.convenerUser) this.data.convenerUser = { ...INITIAL_CONVENER_USER };
    if (this.data.convenerUser.password !== currentPassword) {
      throw new Error('Current password does not match existing records.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }
    this.data.convenerUser.password = newPassword;
    this.addAuditLog('CONVENER_PASSWORD_CHANGED', \`Convener access credentials updated securely\`, 'Convener');
    this.saveData();
    this._notify();
    return { success: true };
  }

  getConvenerDashboardStats() {
    const students = this.getStudents();
    const teams = this.getTeams();
    const programmes = this.getProgrammes();
    const competitions = this.getCompetitions();
    const judges = this.getJudges();
    const guests = this.getProgrammeGuests();
    const stages = this.getProgrammeStages();
    const schedules = this.getProgrammeSchedules();
    const activities = this.getOperationalActivities();
    const auditLogs = this.getAuditLogs();

    const upcomingProgrammes = programmes.filter(p => p.status === 'Scheduled').slice(0, 5);
    const recentStudents = students.slice(0, 6);
    const recentActivities = auditLogs.slice(0, 8);

    const pendingEvaluations = competitions.filter(c => !c.isPublished && (c.status === 'Under Verification' || c.submittedEvaluationsCount > 0)).length;
    const unscheduledProgrammes = programmes.filter(p => !schedules.some(s => s.programmeId === p.id)).length;
    const pendingGuests = guests.filter(g => g.invitationStatus === 'Invited' || g.invitationStatus === 'Tentative').length;

    return {
      totalStudents: students.length,
      totalTeams: teams.length,
      totalProgrammes: programmes.length,
      totalCompetitions: competitions.length,
      totalEvents: competitions.length,
      totalJudges: judges.length,
      activeJudges: judges.filter(j => j.status === 'Active').length,
      totalGuests: guests.length,
      totalStages: stages.length,
      totalActivities: activities.length,
      upcomingProgrammes,
      recentStudents,
      recentActivities,
      operationalAlerts: [
        { id: 1, type: 'warning', title: 'Pending Evaluations', text: \`\${pendingEvaluations} competition evaluations currently awaiting jury submission/cross-verification.\` },
        { id: 2, type: 'info', title: 'Unscheduled Programmes', text: \`\${unscheduledProgrammes} stage sessions still require official slot allocation in master schedule.\` },
        { id: 3, type: 'success', title: 'Guest Invitations', text: \`\${guests.length - pendingGuests} scholars confirmed attendance; \${pendingGuests} invitations pending RSVP.\` }
      ]
    };
  }

  // =========================================================================
  // VENUE & STAGE MANAGEMENT METHODS
  // =========================================================================

  addProgrammeStage(stageData, user = 'Convener') {
    if (!stageData.name || !stageData.name.trim()) {
      throw new Error('Stage / Venue name is required.');
    }
    if (!this.data.programmeStages) this.data.programmeStages = [];

    const nextIdx = this.data.programmeStages.length + 1;
    const autoId = \`STG-\${String(nextIdx).padStart(2, '0')}\`;

    const newStage = {
      id: autoId,
      code: autoId,
      name: stageData.name.trim(),
      shortName: stageData.shortName || stageData.name.trim(),
      malayalamName: stageData.malayalamName || '',
      venue: stageData.venue || stageData.name.trim(),
      type: stageData.type || 'Auditorium / Hall',
      capacity: parseInt(stageData.capacity, 10) || 500,
      color: stageData.color || '#A91F35',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      status: 'Active',
      locationDesc: stageData.locationDesc || 'Campus Central Arena'
    };

    this.data.programmeStages.push(newStage);
    this.addAuditLog('STAGE_CREATED', \`Created new festival stage \${newStage.name} (Capacity: \${newStage.capacity})\`, user);
    this.saveData();
    this._notify();
    return { success: true, stage: newStage };
  }

  updateProgrammeStage(id, stageData, user = 'Convener') {
    if (!this.data.programmeStages) this.data.programmeStages = [];
    const idx = this.data.programmeStages.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Stage / Venue not found.');

    this.data.programmeStages[idx] = {
      ...this.data.programmeStages[idx],
      ...stageData
    };

    this.addAuditLog('STAGE_UPDATED', \`Updated stage details for \${this.data.programmeStages[idx].name}\`, user);
    this.saveData();
    this._notify();
    return { success: true, stage: this.data.programmeStages[idx] };
  }

  deleteProgrammeStage(id, user = 'Convener') {
    if (!this.data.programmeStages) this.data.programmeStages = [];
    const stage = this.data.programmeStages.find(s => s.id === id);
    if (!stage) throw new Error('Stage / Venue not found.');

    // Check if programmes or schedules are tied to this stage
    const hasSchedules = (this.data.programmeSchedules || []).some(s => s.stageId === id || s.venue === stage.venue);
    if (hasSchedules) {
      throw new Error(\`Cannot delete stage \${stage.name} because sessions are actively scheduled on this stage. Reassign those sessions first.\`);
    }

    this.data.programmeStages = this.data.programmeStages.filter(s => s.id !== id);
    this.addAuditLog('STAGE_DELETED', \`Deleted festival stage \${stage.name}\`, user);
    this.saveData();
    this._notify();
    return { success: true };
  }

  toggleProgrammeStageStatus(id, user = 'Convener') {
    if (!this.data.programmeStages) this.data.programmeStages = [];
    const stage = this.data.programmeStages.find(s => s.id === id);
    if (!stage) throw new Error('Stage not found.');

    stage.status = stage.status === 'Active' ? 'Maintenance' : 'Active';
    this.addAuditLog('STAGE_STATUS_TOGGLED', \`Toggled status of stage \${stage.name} to \${stage.status}\`, user);
    this.saveData();
    this._notify();
    return { success: true, stage };
  }

  // =========================================================================
  // OPERATIONAL ACTIVITIES (PARIPADI) MANAGEMENT METHODS
  // =========================================================================

  getOperationalActivities(filters = {}) {
    let activities = this.data.operationalActivities || INITIAL_OPERATIONAL_ACTIVITIES;

    if (filters.category && filters.category !== 'all') {
      activities = activities.filter(a => a.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      activities = activities.filter(a => a.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      activities = activities.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.responsiblePerson && a.responsiblePerson.toLowerCase().includes(q)) ||
        (a.venue && a.venue.toLowerCase().includes(q))
      );
    }

    return activities;
  }

  getOperationalActivityById(id) {
    const list = this.data.operationalActivities || INITIAL_OPERATIONAL_ACTIVITIES;
    return list.find(a => a.id === id) || null;
  }

  addOperationalActivity(actData, user = 'Convener') {
    if (!actData.title || !actData.title.trim()) {
      throw new Error('Activity title is required.');
    }
    if (!this.data.operationalActivities) this.data.operationalActivities = [...INITIAL_OPERATIONAL_ACTIVITIES];

    const nextNum = this.data.operationalActivities.length + 1;
    const autoId = \`ACT-\${String(nextNum).padStart(3, '0')}\`;
    const autoCode = \`ACT-OP-\${String(nextNum).padStart(2, '0')}\`;

    const newAct = {
      id: autoId,
      code: autoCode,
      title: actData.title.trim(),
      description: actData.description || '',
      category: actData.category || 'Operations & Logistics',
      date: actData.date || 'Dec 21, 2026',
      time: actData.time || '10:00 AM – 12:00 PM',
      venue: actData.venue || 'Campus Main Ground',
      responsiblePerson: actData.responsiblePerson || 'General Convener',
      phone: actData.phone || '',
      status: actData.status || 'Pending',
      priority: actData.priority || 'Normal',
      teamId: actData.teamId || null,
      programmeId: actData.programmeId || null,
      internalRemarks: actData.internalRemarks || ''
    };

    this.data.operationalActivities.unshift(newAct);
    this.addAuditLog('ACTIVITY_CREATED', \`Created operational activity \${newAct.title} (\${newAct.responsiblePerson})\`, user);
    this.saveData();
    this._notify();
    return { success: true, activity: newAct };
  }

  updateOperationalActivity(id, actData, user = 'Convener') {
    if (!this.data.operationalActivities) this.data.operationalActivities = [...INITIAL_OPERATIONAL_ACTIVITIES];
    const idx = this.data.operationalActivities.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Operational activity not found.');

    this.data.operationalActivities[idx] = {
      ...this.data.operationalActivities[idx],
      ...actData
    };

    this.addAuditLog('ACTIVITY_UPDATED', \`Updated activity details for \${this.data.operationalActivities[idx].title}\`, user);
    this.saveData();
    this._notify();
    return { success: true, activity: this.data.operationalActivities[idx] };
  }

  deleteOperationalActivity(id, user = 'Convener') {
    if (!this.data.operationalActivities) this.data.operationalActivities = [...INITIAL_OPERATIONAL_ACTIVITIES];
    const act = this.data.operationalActivities.find(a => a.id === id);
    if (!act) throw new Error('Operational activity not found.');

    this.data.operationalActivities = this.data.operationalActivities.filter(a => a.id !== id);
    this.addAuditLog('ACTIVITY_DELETED', \`Deleted operational activity \${act.title}\`, user);
    this.saveData();
    this._notify();
    return { success: true };
  }

  updateOperationalActivityStatus(id, status, user = 'Convener') {
    if (!this.data.operationalActivities) this.data.operationalActivities = [...INITIAL_OPERATIONAL_ACTIVITIES];
    const act = this.data.operationalActivities.find(a => a.id === id);
    if (!act) throw new Error('Operational activity not found.');

    act.status = status;
    this.addAuditLog('ACTIVITY_STATUS_CHANGED', \`Updated status of \${act.title} to \${status}\`, user);
    this.saveData();
    this._notify();
    return { success: true, activity: act };
  }
`;

// Insert before the last closing brace of the FestivalStore class
const lastClosingBrace = code.lastIndexOf('}');
const beforeClassEnd = code.substring(0, lastClosingBrace);
const afterClassEnd = code.substring(lastClosingBrace);

const newCode = beforeClassEnd + '\n' + convenerMethods + '\n' + afterClassEnd;
fs.writeFileSync(storePath, newCode, 'utf8');
console.log('Successfully injected Convener methods into festivalStore.js!');
