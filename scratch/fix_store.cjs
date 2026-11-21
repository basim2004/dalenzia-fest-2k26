const fs = require('fs');

const backup = JSON.parse(fs.readFileSync('scratch/backup_pre_cleanup_data.json', 'utf8'));

console.log('Categories from backup:');
console.log('programmeCategories:', backup.programmeCategories.length);
console.log('programmeStages:', backup.programmeStages.length);
console.log('guestCategories:', backup.guestCategories.length);
console.log('galleryCategories:', backup.galleryCategories.length);
console.log('posterCategories:', backup.posterCategories.length);
console.log('announcementCategories:', backup.announcementCategories.length);

const cleanStoreCode = `// DALENZIA FEST 2K26 - CENTRAL FESTIVAL DATA ENGINE & STORE
// Single source of truth for Admin Portal, Judge Management, Judge Portal & Public Website Data Synchronization.

const STORAGE_KEY = 'dalenzia_fest_2k26_master_store_clean_v1';

export const INITIAL_CONVENER_USER = {
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

export const INITIAL_TEAM_LEADERS = [];

export const INITIAL_STAGE_CONTROLLERS = [
  {
    id: 'SC-01',
    stageId: 'STG-01',
    stageNumber: '01',
    stageName: 'Cordova Grand Stage (Stage 01)',
    name: 'Usthad Salman Farisi',
    email: 'controller1@dalenziafest.in',
    username: 'controller1',
    password: 'stage2k26',
    phone: '+91 98470 50001',
    role: 'STAGE_CONTROLLER',
    status: 'Active',
    assignedDate: 'Dec 15, 2026'
  },
  {
    id: 'SC-02',
    stageId: 'STG-02',
    stageNumber: '02',
    stageName: 'Al-Farabi Heritage Hall (Stage 02)',
    name: 'Prof. Zakariyya Hudawi',
    email: 'controller2@dalenziafest.in',
    username: 'controller2',
    password: 'stage2k26',
    phone: '+91 98470 50002',
    role: 'STAGE_CONTROLLER',
    status: 'Active',
    assignedDate: 'Dec 15, 2026'
  },
  {
    id: 'SC-03',
    stageId: 'STG-03',
    stageNumber: '03',
    stageName: 'Ibn Khaldun Academic Hall (Stage 03)',
    name: 'Usthad Zainul Abid',
    email: 'controller3@dalenziafest.in',
    username: 'controller3',
    password: 'stage2k26',
    phone: '+91 98470 50003',
    role: 'STAGE_CONTROLLER',
    status: 'Active',
    assignedDate: 'Dec 15, 2026'
  },
  {
    id: 'SC-04',
    stageId: 'STG-04',
    stageNumber: '04',
    stageName: 'Media Studio Preview Room',
    name: 'Sayyid Munir Thangal',
    email: 'controller4@dalenziafest.in',
    username: 'controller4',
    password: 'stage2k26',
    phone: '+91 98470 50004',
    role: 'STAGE_CONTROLLER',
    status: 'Active',
    assignedDate: 'Dec 15, 2026'
  },
  {
    id: 'SC-05',
    stageId: 'STG-05',
    stageNumber: '05',
    stageName: 'Open Amphitheatre',
    name: 'Usthad Basheer Hudawi',
    email: 'controller5@dalenziafest.in',
    username: 'controller5',
    password: 'stage2k26',
    phone: '+91 98470 50005',
    role: 'STAGE_CONTROLLER',
    status: 'Active',
    assignedDate: 'Dec 15, 2026'
  }
];

const INITIAL_OPERATIONAL_ACTIVITIES = [];

const INITIAL_DATA = {
  teams: [],
  registeredStudents: [],
  programmeCategories: ${JSON.stringify(backup.programmeCategories, null, 2)},
  programmes: [],
  programmeStages: ${JSON.stringify(backup.programmeStages, null, 2)},
  programmeSchedules: [],
  guestCategories: ${JSON.stringify(backup.guestCategories, null, 2)},
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
  galleryCategories: ${JSON.stringify(backup.galleryCategories, null, 2)},
  galleryAlbums: [],
  galleryMedia: [],
  posterCategories: ${JSON.stringify(backup.posterCategories, null, 2)},
  posters: [],
  posterTemplates: [],
  announcementCategories: ${JSON.stringify(backup.announcementCategories, null, 2)},
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
};
`;

// Now find class FestivalStore in the original festivalStore.js
// Read the file lines from where class FestivalStore starts
const originalContent = fs.readFileSync('src/admin/data/festivalStore.js', 'utf8');
const classIdx = originalContent.indexOf('class FestivalStore {');
if (classIdx === -1) throw new Error('class FestivalStore not found');

let classCode = originalContent.substring(classIdx);

// Clean loadData in classCode
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

const loadDataMatch = classCode.match(/  loadData\(\) \{[\s\S]*?\n  \}\n\n  saveData\(\)/);
if (!loadDataMatch) throw new Error('loadData match failed in classCode');
classCode = classCode.replace(loadDataMatch[0], cleanLoadData + '\n\n  saveData()');

// Update getDashboardStats
classCode = classCode.replace('const totalStudents = 1250; // Central Registry Cohort', 'const totalStudents = students.length;');
classCode = classCode.replace('const totalCompetitions = 48;', 'const totalCompetitions = assignments.length;');

const finalCode = cleanStoreCode + '\n' + classCode;
fs.writeFileSync('src/admin/data/festivalStore.js', finalCode, 'utf8');
console.log('Successfully written clean festivalStore.js! Total bytes:', finalCode.length);
