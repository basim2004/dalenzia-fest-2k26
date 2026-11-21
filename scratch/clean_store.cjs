const fs = require('fs');

const original = fs.readFileSync('src/admin/data/festivalStore.js', 'utf8');

// 1. Change STORAGE_KEY
let updated = original.replace(
  "const STORAGE_KEY = 'dalenzia_fest_2k26_master_store_v3';",
  "const STORAGE_KEY = 'dalenzia_fest_2k26_master_store_clean_v1';"
);

// 2. Clear INITIAL_TEAM_LEADERS
const tlMatch = updated.match(/export const INITIAL_TEAM_LEADERS = \[[\s\S]*?\n\];/);
if (!tlMatch) throw new Error('INITIAL_TEAM_LEADERS match failed');
updated = updated.replace(tlMatch[0], 'export const INITIAL_TEAM_LEADERS = [];');

// 3. Clear INITIAL_OPERATIONAL_ACTIVITIES
const actMatch = updated.match(/const INITIAL_OPERATIONAL_ACTIVITIES = \[[\s\S]*?\n\];/);
if (!actMatch) throw new Error('INITIAL_OPERATIONAL_ACTIVITIES match failed');
updated = updated.replace(actMatch[0], 'const INITIAL_OPERATIONAL_ACTIVITIES = [];');

// 4. Read taxonomies from scratch/taxonomies.json
const tax = JSON.parse(fs.readFileSync('scratch/taxonomies.json', 'utf8'));

// Build clean INITIAL_DATA
const cleanInitialData = `const INITIAL_DATA = {
  teams: [],
  registeredStudents: [],
  ${tax.programmeCategories},
  programmes: [],
  ${tax.programmeStages},
  programmeSchedules: [],
  ${tax.guestCategories},
  programmeGuests: [],
  judges: [
    {
      id: 'JDG-1001',
      name: 'Chief Adjudicator (Festival Jury)',
      email: 'judge@dalenziafest.in',
      username: 'judge',
      password: 'judge2k26',
      role: 'judge',
      status: 'Active',
      category: 'General Adjudication',
      designation: 'Festival Jury Head',
      institution: 'Dalailussunna Dars, Ayiroor',
      phone: '+91 98470 30001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      assignedProgrammesCount: 0
    }
  ],
  programmeAssignments: [],
  submittedEvaluations: [],
  resultPosters: [],
  notifications: [],
  ${tax.galleryCategories},
  galleryAlbums: [],
  galleryMedia: [],
  ${tax.posterCategories},
  posters: [],
  posterTemplates: [],
  ${tax.announcementCategories},
  announcements: [],
  auditLogs: [],
  operationalActivities: [],
  publishedResultsHistory: [],
  programmeTeamRegistrations: [],
  studentAccounts: [],
  studentCorrectionRequests: [],
  competitionCodeAssignments: [],
  stageDrawSessions: [],
  stageDrawResults: [],
  stageCallingRecords: [],
  teamLeaders: [],
  stageControllers: INITIAL_STAGE_CONTROLLERS,
  convenerUser: INITIAL_CONVENER_USER
};`;

const initDataMatch = updated.match(/const INITIAL_DATA = \{[\s\S]*?\n\};\n\nclass FestivalStore/);
if (!initDataMatch) throw new Error('INITIAL_DATA match failed');
updated = updated.replace(initDataMatch[0], cleanInitialData + '\n\nclass FestivalStore');

// 5. Replace loadData()
const cleanLoadData = `  loadData() {
    let currentData = INITIAL_DATA;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          currentData = { ...INITIAL_DATA, ...parsed };
        }
      } catch (e) {
        console.error('Failed reading localStorage', e);
      }
    }

    // Ensure master categories and system configs exist
    if (!currentData.programmeCategories || !Array.isArray(currentData.programmeCategories) || currentData.programmeCategories.length === 0) {
      currentData.programmeCategories = INITIAL_DATA.programmeCategories;
    }
    if (!currentData.guestCategories || !Array.isArray(currentData.guestCategories) || currentData.guestCategories.length === 0) {
      currentData.guestCategories = INITIAL_DATA.guestCategories;
    }
    if (!currentData.programmeStages || !Array.isArray(currentData.programmeStages) || currentData.programmeStages.length === 0) {
      currentData.programmeStages = INITIAL_DATA.programmeStages;
    }
    if (!currentData.galleryCategories || !Array.isArray(currentData.galleryCategories) || currentData.galleryCategories.length === 0) {
      currentData.galleryCategories = INITIAL_DATA.galleryCategories;
    }
    if (!currentData.posterCategories || !Array.isArray(currentData.posterCategories) || currentData.posterCategories.length === 0) {
      currentData.posterCategories = INITIAL_DATA.posterCategories;
    }
    if (!currentData.announcementCategories || !Array.isArray(currentData.announcementCategories) || currentData.announcementCategories.length === 0) {
      currentData.announcementCategories = INITIAL_DATA.announcementCategories;
    }

    // Official Auth / System Roles
    if (!currentData.convenerUser) {
      currentData.convenerUser = INITIAL_CONVENER_USER;
    }
    if (!currentData.stageControllers || !Array.isArray(currentData.stageControllers) || currentData.stageControllers.length === 0) {
      currentData.stageControllers = INITIAL_STAGE_CONTROLLERS;
    }
    if (!currentData.judges || !Array.isArray(currentData.judges) || currentData.judges.length === 0) {
      currentData.judges = INITIAL_DATA.judges;
    }

    // Ensure all operational arrays are defined
    const arrayKeys = [
      'teams', 'registeredStudents', 'programmes', 'programmeAssignments',
      'programmeSchedules', 'programmeGuests', 'submittedEvaluations',
      'resultPosters', 'publishedResultsHistory', 'notifications',
      'operationalActivities', 'auditLogs', 'galleryAlbums', 'galleryMedia',
      'posters', 'posterTemplates', 'announcements', 'programmeTeamRegistrations',
      'studentAccounts', 'studentCorrectionRequests', 'competitionCodeAssignments',
      'stageDrawSessions', 'stageDrawResults', 'stageCallingRecords', 'teamLeaders'
    ];
    for (const key of arrayKeys) {
      if (!Array.isArray(currentData[key])) {
        currentData[key] = [];
      }
    }

    return currentData;
  }`;

const loadDataMatch = updated.match(/  loadData\(\) \{[\s\S]*?\n  \}\n\n  saveData\(\)/);
if (!loadDataMatch) throw new Error('loadData match failed');
updated = updated.replace(loadDataMatch[0], cleanLoadData + '\n\n  saveData()');

// 6. Update getDashboardStats()
updated = updated.replace('const totalStudents = 1250; // Central Registry Cohort', 'const totalStudents = students.length;');
updated = updated.replace('const totalCompetitions = 48;', 'const totalCompetitions = assignments.length;');

fs.writeFileSync('src/admin/data/festivalStore.js', updated, 'utf8');
console.log('Successfully updated src/admin/data/festivalStore.js! New length:', updated.length);
