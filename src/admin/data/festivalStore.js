import {
  OFFICIAL_PROGRAMME_CATEGORIES,
  OFFICIAL_TEAMS,
  OFFICIAL_SCORING_CONFIG,
  OFFICIAL_CHARTER_PROGRAMMES,
  createDefaultProgrammeAssignments
} from './officialCharterData.js';

// DALENZIA FEST 2K26 - CENTRAL FESTIVAL DATA ENGINE & STORE
// Single source of truth for Admin Portal, Judge Management, Judge Portal & Public Website Data Synchronization.

const STORAGE_KEY = 'dalenzia_fest_2k26_master_store_clean_v2';

export const FESTIVAL_DATE_CONFIG = {
  officialDate: '21, 22, 23 DECEMBER 2026',
  officialDateFormatted: '21, 22, 23 DECEMBER 2026',
  year: '2026',
  month: 'DECEMBER',
  days: ['21', '22', '23'],
  daysFormatted: '21, 22, 23',
  startDate: '2026-12-21',
  endDate: '2026-12-23',
  day1: 'Dec 21, 2026',
  day2: 'Dec 22, 2026',
  day3: 'Dec 23, 2026'
};

export const INITIAL_CONVENER_USER = {
  id: 'CNV-01',
  name: 'Irfan Eramangalam',
  email: 'convener@dalenziafest.in',
  password: 'convener2k26',
  role: 'convener',
  roleLabel: 'Festival Convener',
  designation: 'Festival Convener',
  institution: 'Dalailussunna Dars, Ayiroor',
  phone: '+91 90481 31562',
  avatar: '/assets/dalenzia_fest_logo.png',
  lastLogin: '2026-12-21 08:00 AM'
};

export const INITIAL_TEAM_LEADERS = [
  {
    id: 'TL-1',
    teamId: 'team-1',
    teamName: 'TEAM 1',
    name: 'Noufal',
    studentId: 'STU-1001',
    asstLeader: 'Hafiz Hassan',
    asstLeaderStudentId: 'STU-1002',
    username: 'leader1',
    email: 'leader1@dalenziafest.in',
    alternateEmail: 'noufal@dalanzia.org',
    password: 'leader2k26',
    phone: '+91 98471 20001',
    role: 'team_leader',
    status: 'Active'
  },
  {
    id: 'TL-2',
    teamId: 'team-2',
    teamName: 'TEAM 2',
    name: 'Hashim',
    studentId: 'STU-1005',
    asstLeader: 'Irfan Edayyur',
    asstLeaderStudentId: 'STU-1008',
    username: 'leader2',
    email: 'leader2@dalenziafest.in',
    alternateEmail: 'hashim@dalanzia.org',
    password: 'leader2k26',
    phone: '+91 98471 20002',
    role: 'team_leader',
    status: 'Active'
  }
];

export const INITIAL_TEAMS = OFFICIAL_TEAMS;

export const INITIAL_REGISTERED_STUDENTS = [
  // Senior Category (8 Students)
  { id: 'STU-1001', chestNo: 'C-101', name: 'Noufal', classCategory: 'Senior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '+91 98471 20001', email: 'noufal@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10', isLeader: true, role: 'Leader' },
  { id: 'STU-1002', chestNo: 'C-102', name: 'Hafiz Hassan', classCategory: 'Senior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'hafiz.hassan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10', isAsstLeader: true, role: 'Asst Leader' },
  { id: 'STU-1003', chestNo: 'C-103', name: 'Binyamin', classCategory: 'Senior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'binyamin@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1004', chestNo: 'C-104', name: 'Hafiz Sinan', classCategory: 'Senior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'hafiz.sinan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1005', chestNo: 'C-105', name: 'Hashim', classCategory: 'Senior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '+91 98471 20002', email: 'hashim@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10', isLeader: true, role: 'Leader' },
  { id: 'STU-1006', chestNo: 'C-106', name: 'Aslam Sha', classCategory: 'Senior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'aslam.sha@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1007', chestNo: 'C-107', name: 'Hafiz Hussan', classCategory: 'Senior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'hafiz.hussan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1008', chestNo: 'C-108', name: 'Irfan Edayyur', classCategory: 'Senior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'irfan.edayur@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10', isAsstLeader: true, role: 'Asst Leader' },

  // Junior Category (7 Students)
  { id: 'STU-1009', chestNo: 'C-109', name: 'Midlaj P (Midlaj kadampuzha)', classCategory: 'Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'midlaj.p@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1010', chestNo: 'C-110', name: 'Sahal (Sahl)', classCategory: 'Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'sahal@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1011', chestNo: 'C-111', name: 'Shammas', classCategory: 'Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'shammas@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1012', chestNo: 'C-112', name: 'Razeen', classCategory: 'Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'razeen@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1013', chestNo: 'C-113', name: 'Sulthan', classCategory: 'Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'sulthan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1014', chestNo: 'C-114', name: 'Rizwan', classCategory: 'Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rizwan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1015', chestNo: 'C-115', name: 'Husain Shinaf', classCategory: 'Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'husain.shinaf@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },

  // Sub Junior Category (12 Students)
  { id: 'STU-1016', chestNo: 'C-116', name: 'Rayyan Razi', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rayyan.razi@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1017', chestNo: 'C-117', name: 'Anshid T', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'anshid.t@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1018', chestNo: 'C-118', name: 'Aflah P (Aflah Tirur)', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'aflah.p@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1019', chestNo: 'C-119', name: 'Aflah AK', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'aflah.ak@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1020', chestNo: 'C-120', name: 'Athif', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'athif@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1021', chestNo: 'C-121', name: 'Midlaj M (Midlaj manoor)', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'midlaj.m@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1022', chestNo: 'C-122', name: 'Fakih', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'fakih@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1023', chestNo: 'C-123', name: 'Nusaih (Uvais)', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'uvais@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1024', chestNo: 'C-124', name: 'Nihal', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'nihal@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1025', chestNo: 'C-125', name: 'Ahnaf', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'ahnaf@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1026', chestNo: 'C-126', name: 'Anshid', classCategory: 'Sub Junior', teamId: null, teamName: 'Unassigned', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'anshid@dalanzia.org', status: 'Audit Flagged (PDF Typo Duplicate)', gender: 'Male', registeredAt: '2026-11-10', auditNote: 'Typographical duplicate from Dalenzia_Teams.pdf (#18 Anshid duplicating #9 Anshid / STU-1017 Anshid T). Held in unassigned registry without deletion for audit compliance.' },
  { id: 'STU-1027', chestNo: 'C-127', name: 'Zayan', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'zayan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  
  // Minor Category (19 Students)
  { id: 'STU-1028', chestNo: 'C-128', name: 'Rifaee', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rifaee@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1029', chestNo: 'C-129', name: 'Rizwan', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rizwan.2@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1030', chestNo: 'C-130', name: 'Abdul Nasar', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'abdul.nasar@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1031', chestNo: 'C-131', name: 'Shaheen', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'shaheen@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1032', chestNo: 'C-132', name: 'Sayyid Dilbar', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'seyyid.dilbar@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1033', chestNo: 'C-133', name: 'Nusaih', classCategory: 'Minor', teamId: null, teamName: 'Unassigned', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'nusaih@dalanzia.org', status: 'Audit Flagged (PDF Typo Duplicate)', gender: 'Male', registeredAt: '2026-11-10', auditNote: 'Typographical duplicate from Dalenzia_Teams.pdf (#18 Nusaih duplicating #10 Nusaih / STU-1023 Nusaih Uvais). Held in unassigned registry without deletion for audit compliance.' },
  { id: 'STU-1034', chestNo: 'C-134', name: 'Ali Akbar', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'ali.akbar@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1035', chestNo: 'C-135', name: 'Toufeeq', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'toufeeq@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1036', chestNo: 'C-136', name: 'Touheed', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'touheed@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1037', chestNo: 'C-137', name: 'Subhan', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'subhan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1038', chestNo: 'C-138', name: 'Farhan', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'farhan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1039', chestNo: 'C-139', name: 'Thahir', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'thahir@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1040', chestNo: 'C-140', name: 'Farhah (Faizan)', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'faizan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1041', chestNo: 'C-141', name: 'Shidan', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'shidan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1042', chestNo: 'C-142', name: 'Yaseen', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'yaseen@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1043', chestNo: 'C-143', name: 'Sinan', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'sinan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1044', chestNo: 'C-144', name: 'Fasil', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'fasil@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1045', chestNo: 'C-145', name: 'Abdul Haq', classCategory: 'Minor', teamId: 'team-2', teamName: 'TEAM 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'abdul.haq@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1046', chestNo: 'C-146', name: 'Ziyad', classCategory: 'Minor', teamId: 'team-1', teamName: 'TEAM 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'ziyad@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' }
];

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


export const INITIAL_EXTERNAL_PARTICIPANTS = [
  {
    id: 'EXT-P-501',
    fullName: 'Muhammad Adil K.',
    institution: 'Farook College, Kozhikode',
    classCategory: 'Senior',
    phone: '+91 98471 23456',
    email: 'adil.farook@gmail.com',
    district: 'Kozhikode',
    gender: 'Male',
    createdAt: '2026-11-18T10:00:00.000Z'
  },
  {
    id: 'EXT-P-502',
    fullName: 'Abdul Basith V.',
    institution: 'Darul Huda Islamic University, Malappuram',
    classCategory: 'Senior',
    phone: '+91 97452 89123',
    email: 'basith.dhiu@gmail.com',
    district: 'Malappuram',
    gender: 'Male',
    createdAt: '2026-11-18T14:30:00.000Z'
  },
  {
    id: 'EXT-P-503',
    fullName: 'Salman Faris',
    institution: 'Markaz Garden, Poonoor',
    classCategory: 'Junior',
    phone: '+91 94951 67890',
    email: 'salman.markaz@gmail.com',
    district: 'Kozhikode',
    gender: 'Male',
    createdAt: '2026-11-19T09:15:00.000Z'
  },
  {
    id: 'EXT-P-504',
    fullName: 'Anas Ahammed',
    institution: "Ma'din Academy, Malappuram",
    classCategory: 'General',
    phone: '+91 96332 45678',
    email: 'anas.madin@gmail.com',
    district: 'Malappuram',
    gender: 'Male',
    createdAt: '2026-11-19T11:45:00.000Z'
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 'REG-1001',
    ticketId: 'DLZ-2026-1001',
    type: 'existing_student',
    studentId: 'STU-1001',
    chestNo: 'C-101',
    participantName: 'Noufal',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Senior',
    teamId: 'team-1',
    teamName: 'Dazzlers',
    phone: '+91 85899 51951',
    email: 'noufal@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-15T09:00:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-DLZ-1001-A9F2',
    notes: 'Official delegation leader. Dars resident candidate verified.',
    registeredBy: 'Admin (Developer)',
    registeredByRole: 'admin',
    createdAt: '2026-11-15T09:00:00.000Z',
    updatedAt: '2026-11-15T09:00:00.000Z'
  },
  {
    id: 'REG-1002',
    ticketId: 'DLZ-2026-1002',
    type: 'existing_student',
    studentId: 'STU-1002',
    chestNo: 'C-102',
    participantName: 'Hafiz Hassan',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Senior',
    teamId: 'team-1',
    teamName: 'Dazzlers',
    phone: '+91 85899 51952',
    email: 'hafiz.hassan@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-15T09:15:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-DLZ-1002-B8K3',
    notes: 'Senior assistant leader. Verified & Ratified.',
    registeredBy: 'Admin (Developer)',
    registeredByRole: 'admin',
    createdAt: '2026-11-15T09:15:00.000Z',
    updatedAt: '2026-11-15T09:15:00.000Z'
  },
  {
    id: 'REG-1003',
    ticketId: 'DLZ-2026-1003',
    type: 'existing_student',
    studentId: 'STU-1005',
    chestNo: 'C-105',
    participantName: 'Hashim',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Senior',
    teamId: 'team-2',
    teamName: 'Dynamos',
    phone: '+91 85899 51955',
    email: 'hashim@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-16T10:30:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-DLZ-1003-C7M4',
    notes: 'Team 2 leader credentials validated.',
    registeredBy: 'Convener (Irfan Eramangalam)',
    registeredByRole: 'convener',
    createdAt: '2026-11-16T10:30:00.000Z',
    updatedAt: '2026-11-16T10:30:00.000Z'
  },
  {
    id: 'REG-1004',
    ticketId: 'DLZ-2026-1004',
    type: 'existing_student',
    studentId: 'STU-1006',
    chestNo: 'C-106',
    participantName: 'Aslam Sha',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Senior',
    teamId: 'team-2',
    teamName: 'Dynamos',
    phone: '+91 85899 51956',
    email: 'aslam.sha@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-16T11:00:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-DLZ-1004-D6N5',
    notes: 'Senior participant desk confirmation.',
    registeredBy: 'Convener (Irfan Eramangalam)',
    registeredByRole: 'convener',
    createdAt: '2026-11-16T11:00:00.000Z',
    updatedAt: '2026-11-16T11:00:00.000Z'
  },
  {
    id: 'REG-1005',
    ticketId: 'DLZ-2026-1005',
    type: 'existing_student',
    studentId: 'STU-1009',
    chestNo: 'C-109',
    participantName: 'Midlaj P',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Junior',
    teamId: 'team-1',
    teamName: 'Dazzlers',
    phone: '+91 85899 51959',
    email: 'midlaj.p@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-17T14:00:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-DLZ-1005-E5P6',
    notes: 'Junior section candidate.',
    registeredBy: 'Admin (Developer)',
    registeredByRole: 'admin',
    createdAt: '2026-11-17T14:00:00.000Z',
    updatedAt: '2026-11-17T14:00:00.000Z'
  },
  {
    id: 'REG-1006',
    ticketId: 'DLZ-2026-1006',
    type: 'existing_student',
    studentId: 'STU-1012',
    chestNo: 'C-112',
    participantName: 'Razeen',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Junior',
    teamId: 'team-2',
    teamName: 'Dynamos',
    phone: '+91 85899 51962',
    email: 'razeen@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-17T15:20:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-DLZ-1006-F4Q7',
    notes: 'Confirmed by convener secretariat.',
    registeredBy: 'Convener (Irfan Eramangalam)',
    registeredByRole: 'convener',
    createdAt: '2026-11-17T15:20:00.000Z',
    updatedAt: '2026-11-17T15:20:00.000Z'
  },
  {
    id: 'REG-1007',
    ticketId: 'DLZ-2026-1007',
    type: 'existing_student',
    studentId: 'STU-1016',
    chestNo: 'C-116',
    participantName: 'Rayyan Razi',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Sub Junior',
    teamId: 'team-1',
    teamName: 'Dazzlers',
    phone: '+91 85899 51966',
    email: 'rayyan.razi@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-18T09:40:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-DLZ-1007-G3R8',
    notes: 'Sub Junior candidate pass generated.',
    registeredBy: 'Convener (Irfan Eramangalam)',
    registeredByRole: 'convener',
    createdAt: '2026-11-18T09:40:00.000Z',
    updatedAt: '2026-11-18T09:40:00.000Z'
  },
  {
    id: 'REG-1008',
    ticketId: 'DLZ-2026-1008',
    type: 'existing_student',
    studentId: 'STU-1028',
    chestNo: 'C-128',
    participantName: 'Rifaee',
    institution: 'Dalailussunna Dars, Ayiroor',
    classCategory: 'Minor',
    teamId: 'team-1',
    teamName: 'Dazzlers',
    phone: '+91 85899 51978',
    email: 'rifaee@dalanzia.org',
    gender: 'Male',
    place: 'Ayiroor',
    registrationDate: '2026-11-19T16:00:00.000Z',
    status: 'Pending',
    verificationCode: 'VER-DLZ-1008-H2S9',
    notes: 'Awaiting parent guardian verification slip.',
    registeredBy: 'Convener (Irfan Eramangalam)',
    registeredByRole: 'convener',
    createdAt: '2026-11-19T16:00:00.000Z',
    updatedAt: '2026-11-19T16:00:00.000Z'
  },
  {
    id: 'REG-5001',
    ticketId: 'EXT-2026-5001',
    type: 'external_participant',
    externalParticipantId: 'EXT-P-501',
    participantName: 'Muhammad Adil K.',
    institution: 'Farook College, Kozhikode',
    classCategory: 'Senior',
    phone: '+91 98471 23456',
    email: 'adil.farook@gmail.com',
    district: 'Kozhikode',
    gender: 'Male',
    registrationDate: '2026-11-18T10:00:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-EXT-5001-K9A1',
    notes: 'External college delegate pass issued.',
    registeredBy: 'Convener (Irfan Eramangalam)',
    registeredByRole: 'convener',
    createdAt: '2026-11-18T10:00:00.000Z',
    updatedAt: '2026-11-18T10:00:00.000Z'
  },
  {
    id: 'REG-5002',
    ticketId: 'EXT-2026-5002',
    type: 'external_participant',
    externalParticipantId: 'EXT-P-502',
    participantName: 'Abdul Basith V.',
    institution: 'Darul Huda Islamic University, Malappuram',
    classCategory: 'Senior',
    phone: '+91 97452 89123',
    email: 'basith.dhiu@gmail.com',
    district: 'Malappuram',
    gender: 'Male',
    registrationDate: '2026-11-18T14:30:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-EXT-5002-L8B2',
    notes: 'Inter-university scholar delegate.',
    registeredBy: 'Admin (Developer)',
    registeredByRole: 'admin',
    createdAt: '2026-11-18T14:30:00.000Z',
    updatedAt: '2026-11-18T14:30:00.000Z'
  },
  {
    id: 'REG-5003',
    ticketId: 'EXT-2026-5003',
    type: 'external_participant',
    externalParticipantId: 'EXT-P-503',
    participantName: 'Salman Faris',
    institution: 'Markaz Garden, Poonoor',
    classCategory: 'Junior',
    phone: '+91 94951 67890',
    email: 'salman.markaz@gmail.com',
    district: 'Kozhikode',
    gender: 'Male',
    registrationDate: '2026-11-19T09:15:00.000Z',
    status: 'Completed',
    verificationCode: 'VER-EXT-5003-M7C3',
    notes: 'Junior outside candidate confirmed.',
    registeredBy: 'Convener (Irfan Eramangalam)',
    registeredByRole: 'convener',
    createdAt: '2026-11-19T09:15:00.000Z',
    updatedAt: '2026-11-19T09:15:00.000Z'
  },
  {
    id: 'REG-5004',
    ticketId: 'EXT-2026-5004',
    type: 'external_participant',
    externalParticipantId: 'EXT-P-504',
    participantName: 'Anas Ahammed',
    institution: "Ma'din Academy, Malappuram",
    classCategory: 'General',
    phone: '+91 96332 45678',
    email: 'anas.madin@gmail.com',
    district: 'Malappuram',
    gender: 'Male',
    registrationDate: '2026-11-19T11:45:00.000Z',
    status: 'Cancelled',
    verificationCode: 'VER-EXT-5004-N6D4',
    notes: 'Withdrawn upon delegate request prior to festival.',
    registeredBy: 'Admin (Developer)',
    registeredByRole: 'admin',
    createdAt: '2026-11-19T11:45:00.000Z',
    updatedAt: '2026-11-19T17:00:00.000Z'
  }
];

export const INITIAL_REGISTRATION_AUDIT_LOGS = [
  {
    id: 'RAUD-101',
    registrationId: 'REG-1001',
    ticketId: 'DLZ-2026-1001',
    action: 'REGISTRATION_CREATED',
    details: 'Registered existing student Noufal (STU-1001). Ticket DLZ-2026-1001 issued.',
    performedBy: 'Admin (Developer)',
    timestamp: '2026-11-15T09:00:00.000Z'
  },
  {
    id: 'RAUD-102',
    registrationId: 'REG-1003',
    ticketId: 'DLZ-2026-1003',
    action: 'REGISTRATION_CREATED',
    details: 'Registered existing student Hashim (STU-1005). Ticket DLZ-2026-1003 issued.',
    performedBy: 'Convener (Irfan Eramangalam)',
    timestamp: '2026-11-16T10:30:00.000Z'
  },
  {
    id: 'RAUD-103',
    registrationId: 'REG-5001',
    ticketId: 'EXT-2026-5001',
    action: 'REGISTRATION_CREATED',
    details: 'Registered external participant Muhammad Adil K. (Farook College). Ticket EXT-2026-5001 issued.',
    performedBy: 'Convener (Irfan Eramangalam)',
    timestamp: '2026-11-18T10:00:00.000Z'
  },
  {
    id: 'RAUD-104',
    registrationId: 'REG-5004',
    ticketId: 'EXT-2026-5004',
    action: 'STATUS_CHANGED',
    details: 'Registration status changed from Completed to Cancelled. Reason: Withdrawn upon delegate request.',
    performedBy: 'Admin (Developer)',
    timestamp: '2026-11-19T17:00:00.000Z'
  }
];

const INITIAL_DATA = {
  teams: INITIAL_TEAMS,
  registeredStudents: INITIAL_REGISTERED_STUDENTS,
  programmeCategories: OFFICIAL_PROGRAMME_CATEGORIES,
  scoringConfig: OFFICIAL_SCORING_CONFIG,
  programmes: [],
  programmeStages: [],
  programmeSchedules: [],
  guestCategories: [
    {
      "id": "GCAT-HON",
      "name": "Guest of Honour",
      "code": "HON",
      "color": "#A91F35"
    },
    {
      "id": "GCAT-CHF",
      "name": "Chief Guest",
      "code": "CHF",
      "color": "#E6A916"
    },
    {
      "id": "GCAT-SPK",
      "name": "Guest Speaker",
      "code": "SPK",
      "color": "#2563EB"
    },
    {
      "id": "GCAT-INA",
      "name": "Inauguration Guest",
      "code": "INA",
      "color": "#10B981"
    },
    {
      "id": "GCAT-VAL",
      "name": "Closing Ceremony Guest",
      "code": "VAL",
      "color": "#D97706"
    },
    {
      "id": "GCAT-SPC",
      "name": "Special Guest",
      "code": "SPC",
      "color": "#8B5CF6"
    },
    {
      "id": "GCAT-ACA",
      "name": "Academic Conclave Speaker",
      "code": "ACA",
      "color": "#059669"
    }
  ],
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
  galleryCategories: [
    {
      "id": "GC-INA",
      "name": "Inauguration",
      "color": "#A91F35"
    },
    {
      "id": "GC-PRG",
      "name": "Programmes",
      "color": "#E6A916"
    },
    {
      "id": "GC-CMP",
      "name": "Competitions",
      "color": "#2563EB"
    },
    {
      "id": "GC-GST",
      "name": "Guests",
      "color": "#10B981"
    },
    {
      "id": "GC-STG",
      "name": "Stage Events",
      "color": "#8B5CF6"
    },
    {
      "id": "GC-PRZ",
      "name": "Prize Distribution",
      "color": "#D97706"
    },
    {
      "id": "GC-MOM",
      "name": "Festival Moments",
      "color": "#EC4899"
    },
    {
      "id": "GC-BTS",
      "name": "Behind the Scenes",
      "color": "#64748B"
    },
    {
      "id": "GC-OTH",
      "name": "Other",
      "color": "#78716C"
    }
  ],
  galleryAlbums: [],
  galleryMedia: [],
  posterCategories: [
    {
      "id": "CAT-MAIN",
      "name": "Festival Main Posters",
      "color": "#A91F35",
      "description": "Flagship theme releases, brand launches, and key festival identities"
    },
    {
      "id": "CAT-PRG",
      "name": "Programme Posters",
      "color": "#E6A916",
      "description": "Posters and flyers dedicated to major ceremonies, conclaves, and scholastic symposia"
    },
    {
      "id": "CAT-CMP",
      "name": "Competition Posters",
      "color": "#2563EB",
      "description": "Competition callouts, guidelines, and literary/art arena promo sheets"
    },
    {
      "id": "CAT-RES",
      "name": "Result Posters",
      "color": "#10B981",
      "description": "Official verified winner proclamations, score sheets, and podium declarations"
    },
    {
      "id": "CAT-GST",
      "name": "Guest Posters",
      "color": "#8B5CF6",
      "description": "Dignitary welcomes, scholar profile cards, and key speaker salutations"
    },
    {
      "id": "CAT-ANN",
      "name": "Announcement Posters",
      "color": "#D97706",
      "description": "Secretariat notices, schedule adjustments, and urgent circulars"
    },
    {
      "id": "CAT-SPE",
      "name": "Special Day Posters",
      "color": "#EC4899",
      "description": "Milad celebrations, historic memorial graphics, and festival day greetings"
    },
    {
      "id": "CAT-OTH",
      "name": "Other Posters",
      "color": "#64748B",
      "description": "Campus maps, signage, volunteer recognitions, and miscellaneous artwork"
    }
  ],
  posters: [],
  posterTemplates: [],
  announcementCategories: [
    {
      "id": "CAT-ANN-GEN",
      "name": "General Announcement",
      "color": "#64748B",
      "description": "General notices, campus directives, and routine festival information"
    },
    {
      "id": "CAT-ANN-IMP",
      "name": "Important Notice",
      "color": "#E6A916",
      "description": "Critical briefings, advisory bulletins, and regulatory instructions"
    },
    {
      "id": "CAT-ANN-CMP",
      "name": "Competition Update",
      "color": "#2563EB",
      "description": "Competition calls, venue shifts, rubric revisions, and participant notices"
    },
    {
      "id": "CAT-ANN-PRG",
      "name": "Programme Update",
      "color": "#8B5CF6",
      "description": "Ceremony schedules, session agendas, and guest arrival notifications"
    },
    {
      "id": "CAT-ANN-SCH",
      "name": "Schedule Change",
      "color": "#D97706",
      "description": "Timeline calibrations, slot extensions, and stage adjustments"
    },
    {
      "id": "CAT-ANN-REG",
      "name": "Registration Notice",
      "color": "#10B981",
      "description": "Chest number confirmations, badge check-ins, and squad rosters"
    },
    {
      "id": "CAT-ANN-RES",
      "name": "Result Announcement",
      "color": "#A91F35",
      "description": "Podium honors declarations, verified score sheets, and point standings"
    },
    {
      "id": "CAT-ANN-EMG",
      "name": "Emergency Notice",
      "color": "#DC2626",
      "description": "Urgent security, weather, logistics, or medical secretariat broadcasts"
    }
  ],
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
  convenerUser: INITIAL_CONVENER_USER,
  helpdeskTickets: [],
  registrations: INITIAL_REGISTRATIONS,
  externalParticipants: INITIAL_EXTERNAL_PARTICIPANTS,
  registrationAuditLogs: INITIAL_REGISTRATION_AUDIT_LOGS
};

class FestivalStore {
  constructor() {
    this.data = this.loadData();
    this._listeners = new Set();

    // Cross-Tab Real-time Broadcast Listener (Admin <-> Convener Instant Synchronization)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          try {
            this.data = this.loadData();
            this._notify();
          } catch (err) {
            console.error('Error syncing storage event across tabs in FestivalStore', err);
          }
        }
      });
    }
  }

  subscribe(listener) {
    if (typeof listener === 'function') {
      if (!this._listeners) this._listeners = new Set();
      this._listeners.add(listener);
      return () => {
        if (this._listeners) this._listeners.delete(listener);
      };
    }
    return () => { };
  }

  _notify() {
    if (this._listeners && this._listeners.size > 0) {
      this._listeners.forEach(fn => {
        try { fn(); } catch (e) { console.error('FestivalStore listener error:', e); }
      });
    }
  }

  loadData() {
    let currentData = INITIAL_DATA;
    if (typeof window !== 'undefined') {
      try {
        let stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          stored = localStorage.getItem('dalenzia_fest_2k26_master_store_clean_v1');
        }
        if (stored) {
          const parsed = JSON.parse(stored);
          currentData = { ...INITIAL_DATA, ...parsed };
        }
      } catch (e) {
        console.error('Failed reading localStorage', e);
      }
    }

    // Ensure master categories and system configs exist
    // Ensure registration collections exist
    if (!currentData.registrations || !Array.isArray(currentData.registrations) || currentData.registrations.length === 0) {
      currentData.registrations = INITIAL_REGISTRATIONS;
    }
    if (!currentData.externalParticipants || !Array.isArray(currentData.externalParticipants) || currentData.externalParticipants.length === 0) {
      currentData.externalParticipants = INITIAL_EXTERNAL_PARTICIPANTS;
    }
    if (!currentData.registrationAuditLogs || !Array.isArray(currentData.registrationAuditLogs)) {
      currentData.registrationAuditLogs = INITIAL_REGISTRATION_AUDIT_LOGS;
    }

    if (!currentData.programmeCategories || !Array.isArray(currentData.programmeCategories) || currentData.programmeCategories.length === 0) {
      currentData.programmeCategories = INITIAL_DATA.programmeCategories;
    }
    if (!currentData.guestCategories || !Array.isArray(currentData.guestCategories) || currentData.guestCategories.length === 0) {
      currentData.guestCategories = INITIAL_DATA.guestCategories;
    }
    // Stages are not yet finalized in current project status
    currentData.programmeStages = [];
    if (!currentData.galleryCategories || !Array.isArray(currentData.galleryCategories) || currentData.galleryCategories.length === 0) {
      currentData.galleryCategories = INITIAL_DATA.galleryCategories;
    }
    if (!currentData.posterCategories || !Array.isArray(currentData.posterCategories) || currentData.posterCategories.length === 0) {
      currentData.posterCategories = INITIAL_DATA.posterCategories;
    }
    if (!currentData.announcementCategories || !Array.isArray(currentData.announcementCategories) || currentData.announcementCategories.length === 0) {
      currentData.announcementCategories = INITIAL_DATA.announcementCategories;
    }

    // Official Auth / System Roles & Convener Identity
    if (!currentData.convenerUser || currentData.convenerUser.name?.includes('Hashir') || currentData.convenerUser.phone?.includes('98471')) {
      currentData.convenerUser = { ...INITIAL_CONVENER_USER };
    }
    if (!currentData.helpdeskTickets || !Array.isArray(currentData.helpdeskTickets)) {
      currentData.helpdeskTickets = [];
    }
    if (!currentData.stageControllers || !Array.isArray(currentData.stageControllers) || currentData.stageControllers.length === 0) {
      currentData.stageControllers = INITIAL_STAGE_CONTROLLERS;
    }
    if (!currentData.judges || !Array.isArray(currentData.judges) || currentData.judges.length === 0) {
      currentData.judges = INITIAL_DATA.judges;
    }

    // Ensure official teams exist and are named Dazzlers & Dynamos
    if (!currentData.teams || !Array.isArray(currentData.teams) || currentData.teams.length === 0) {
      currentData.teams = JSON.parse(JSON.stringify(OFFICIAL_TEAMS));
    } else {
      currentData.teams.forEach(t => {
        if (t.id === 'team-1') {
          t.name = 'Dazzlers';
          t.code = 'DAZ';
          t.color = '#E6A916';
        } else if (t.id === 'team-2') {
          t.name = 'Dynamos';
          t.code = 'DYN';
          t.color = '#A91F35';
        }
      });
    }

    // Always enforce the 5 official charter categories
    currentData.programmeCategories = OFFICIAL_PROGRAMME_CATEGORIES;

    // Ensure official scoring configuration exists
    if (!currentData.scoringConfig || !currentData.scoringConfig.positionPoints) {
      currentData.scoringConfig = JSON.parse(JSON.stringify(OFFICIAL_SCORING_CONFIG));
    }

    // Clean out unconfirmed demo charter programmes that do not have submitted evaluations
    if (Array.isArray(currentData.programmeAssignments)) {
      currentData.programmeAssignments = currentData.programmeAssignments.filter(p => {
        const isLegacyDemo = p.id && (p.id.startsWith('PRG-MIN') || p.id.startsWith('PRG-GEN') || p.id.startsWith('PRG-SUB') || p.id.startsWith('PRG-JUN') || p.id.startsWith('PRG-SEN'));
        const hasEvaluations = (currentData.submittedEvaluations || []).some(e => e.assignmentId === p.id || e.competitionId === p.competitionId);
        return !isLegacyDemo || hasEvaluations;
      });
      currentData.programmes = [...currentData.programmeAssignments];
    } else {
      currentData.programmeAssignments = [];
      currentData.programmes = [];
    }

    // Defensive safeguard: ensure every assignment has assignedJudgeIds, criteria, and evaluationCriteria
    (currentData.programmeAssignments || []).forEach(a => {
      if (!Array.isArray(a.assignedJudgeIds) || a.assignedJudgeIds.length === 0) {
        a.assignedJudgeIds = ['JDG-1001'];
      }
      if (!Array.isArray(a.evaluationCriteria) || a.evaluationCriteria.length === 0) {
        a.evaluationCriteria = a.criteria || [
          { id: 'c1', name: 'Content & Expression / തനിമ & പ്രമേയം', maxMarks: 40 },
          { id: 'c2', name: 'Presentation & Pronunciation / ശൈലി & ഉച്ചാരണം', maxMarks: 30 },
          { id: 'c3', name: 'Accuracy & Grammar / കൃത്യത & വ്യാകരണം', maxMarks: 20 },
          { id: 'c4', name: 'Overall Impression / സവിശേഷ പ്രകടനം', maxMarks: 10 }
        ];
      }
      if (!Array.isArray(a.criteria) || a.criteria.length === 0) {
        a.criteria = a.evaluationCriteria;
      }
      if (!a.totalMaxMarks) a.totalMaxMarks = a.maxMarks || 100;
      if (!Array.isArray(a.participants)) a.participants = [];
    });
    // Canonical team mapping strictly enforcing Dalenzia 2K26 approved rosters (22 Dazzlers + 22 Dynamos)
    const CANONICAL_TEAM_MAP = {};
    INITIAL_REGISTERED_STUDENTS.forEach(s => {
      CANONICAL_TEAM_MAP[s.id] = {
        teamId: s.teamId,
        teamName: s.teamName,
        isLeader: s.isLeader || false,
        isAsstLeader: s.isAsstLeader || false,
        role: s.role || null
      };
    });

    // Ensure official registered students exist and strictly reconcile to approved team assignments
    if (!currentData.registeredStudents || !Array.isArray(currentData.registeredStudents) || currentData.registeredStudents.length === 0) {
      currentData.registeredStudents = JSON.parse(JSON.stringify(INITIAL_REGISTERED_STUDENTS));
    } else {
      // Reconcile all student records to canonical official team assignments
      currentData.registeredStudents.forEach(s => {
        const canonical = CANONICAL_TEAM_MAP[s.id];
        if (canonical) {
          s.teamId = canonical.teamId;
          s.teamName = canonical.teamName;
          if (canonical.isLeader !== undefined) s.isLeader = canonical.isLeader;
          if (canonical.isAsstLeader !== undefined) s.isAsstLeader = canonical.isAsstLeader;
          if (canonical.role !== undefined) s.role = canonical.role;
        }
        if (s.id === 'STU-1026' || s.id === 'STU-1033') {
          s.teamId = null;
          s.teamName = 'Unassigned';
          s.status = 'Audit Flagged (PDF Typo Duplicate)';
          s.auditNote = 'Typographical duplicate from Dalenzia_Teams.pdf held in unassigned registry without deletion.';
        }
      });
    }

    // Sync team student rosters and members strictly using unique student IDs
    currentData.teams.forEach(team => {
      const assigned = (currentData.registeredStudents || []).filter(s => s.teamId === team.id);
      const seenIds = new Set();
      const uniqueStudents = [];
      for (const s of assigned) {
        if (!seenIds.has(s.id)) {
          seenIds.add(s.id);
          uniqueStudents.push({
            id: s.id,
            chestNo: s.chestNo,
            name: s.name,
            category: s.classCategory,
            compCategory: 'General',
            events: s.events || []
          });
        }
      }
      team.students = uniqueStudents;
      team.members = uniqueStudents.length;
    });

    // Immediately persist reconciled store to localStorage to eliminate stale client state
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
        localStorage.removeItem('dalenzia_fest_2k26_master_store_clean_v1');
      } catch (e) {
        // storage quota fallback
      }
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

    // Retain official audit log of team count reconciliation
    const auditLogId = 'AUD-TEAM-RECON-44-UNIQUE';
    if (!currentData.auditLogs.some(l => l.id === auditLogId)) {
      currentData.auditLogs.unshift({
        id: auditLogId,
        action: 'TEAM_MEMBER_COUNT_RECONCILIATION',
        details: 'Audit reconciliation ratified: Team 1 (Dazzlers) = 22 members, Team 2 (Dynamos) = 22 members (Total: 44 allocated scholars). Resolved typographical duplicate roster entries from Dalenzia_Teams.pdf: STU-1026 (Anshid) and STU-1033 (Nusaih) retained in unassigned pool without deletion.',
        performedBy: 'System Integrity Auditor & Festival Secretariat',
        timestamp: new Date().toISOString()
      });
    }

    return currentData;
  }

  saveData() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error('Failed saving localStorage', e);
      }
    }
    this._notify();
  }

  // =========================================================================
  // CENTRAL DASHBOARD STATS & REAL-TIME AGGREGATIONS (Step 01 - Dashboard Repair)
  // =========================================================================
  getProgrammeGuests() {
    return this.data.programmeGuests || [];
  }

  getDashboardStats() {
    const teams = this.getTeams();
    const students = this.getRegisteredStudents();
    const judges = this.data.judges || [];
    const assignments = this.data.programmeAssignments || [];
    const evaluations = this.data.submittedEvaluations || [];
    const posters = this.data.resultPosters || [];
    const programmes = this.data.programmes || [];
    const guests = this.data.programmeGuests || [];

    const totalStudents = students.length;
    const totalTeams = teams.length;
    const totalCompetitions = assignments.length;
    const totalJudges = judges.length;
    const totalProgrammes = programmes.length;
    const totalProgrammeGuests = guests.filter(g => !g.isArchived).length;

    const pendingEvaluations = assignments.filter(a => !a.isPublished && a.status !== 'Approved').length;
    const submittedResults = evaluations.length;
    const publishedResults = assignments.filter(a => a.isPublished).length;
    const overallTeamPoints = teams.reduce((acc, t) => acc + (t.points || 0), 0);

    const stageCompetitionsCount = assignments.filter(a => {
      const cls = a.classification || (a.format === 'On Stage' ? 'Stage' : (a.type === 'General' || a.category === 'General' ? 'General' : 'Stage'));
      return cls === 'Stage';
    }).length;

    const offStageCompetitionsCount = assignments.filter(a => {
      const cls = a.classification || (a.format === 'Off Stage' ? 'Off Stage' : '');
      return cls === 'Off Stage';
    }).length;

    const generalCompetitionsCount = assignments.filter(a => {
      const cls = a.classification || (a.type === 'General' || a.category === 'General' ? 'General' : '');
      return cls === 'General';
    }).length;

    return {
      totalStudents,
      totalTeams,
      totalCompetitions,
      stageCompetitionsCount,
      offStageCompetitionsCount,
      generalCompetitionsCount,
      totalJudges,
      totalProgrammes,
      totalProgrammeGuests,
      pendingEvaluations,
      submittedResults,
      publishedResults,
      overallTeamPoints,
      activeJudgesCount: judges.filter(j => j.status === 'Active').length,
      recentActivities: (this.data.auditLogs || []).slice(0, 6),
      upcomingProgrammes: programmes.slice(0, 5),
      topTeams: teams.slice(0, 5),
      recentPublishedPosters: posters.slice(0, 3)
    };
  }

  // =========================================================================
  // METRICS & KPIS (Section 2: Judge Management Dashboard)
  // =========================================================================
  getJudgeStats() {
    const totalJudges = this.data.judges.length;
    const activeJudges = this.data.judges.filter(j => j.status === 'Active').length;
    const assignedProgrammes = this.data.programmeAssignments.length;
    const pendingEvaluations = this.data.programmeAssignments.filter(a => a.status === 'In Progress' || a.status === 'Assigned').length;
    const submittedResults = this.data.submittedEvaluations.length;
    const completedEvaluations = this.data.programmeAssignments.filter(a => a.status === 'Approved' || a.isPublished).length;

    return {
      totalJudges,
      activeJudges,
      assignedProgrammes,
      pendingEvaluations,
      submittedResults,
      completedEvaluations
    };
  }

  // =========================================================================
  // JUDGE ACCOUNTS (Section 3: Judge Account Management)
  // =========================================================================
  getJudges(searchQuery = '', statusFilter = 'All') {
    return this.data.judges.filter(j => {
      const matchSearch =
        j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.designation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || j.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }

  getJudgeById(id) {
    return this.data.judges.find(j => j.id === id);
  }

  addJudge(judgeData) {
    const nextNum = 1000 + this.data.judges.length + 1;
    const newJudge = {
      id: `JDG-${nextNum}`,
      name: judgeData.name.trim(),
      designation: judgeData.designation.trim(),
      institution: judgeData.institution.trim() || 'Dalailussunna Academic Council',
      phone: judgeData.phone.trim(),
      email: judgeData.email.trim().toLowerCase(),
      qualification: judgeData.qualification.trim() || 'Scholastic Adjudicator',
      status: 'Active',
      evaluationStatus: 'Not Started',
      assignedCompIds: [],
      submittedCompIds: [],
      avatarColor: '#A91F35',
      accountCreated: new Date().toISOString().split('T')[0]
    };

    this.data.judges.unshift(newJudge);
    this.addAuditLog('JUDGE_CREATED', `Created judge account for ${newJudge.name} (${newJudge.id})`);
    this.saveData();
    return { success: true, judge: newJudge };
  }

  updateJudge(id, updateFields) {
    const judge = this.data.judges.find(j => j.id === id);
    if (!judge) throw new Error('Judge not found');

    Object.assign(judge, updateFields);
    this.addAuditLog('JUDGE_UPDATED', `Updated details for ${judge.name} (${judge.id})`);
    this.saveData();
    return { success: true, judge };
  }

  toggleJudgeStatus(id) {
    const judge = this.data.judges.find(j => j.id === id);
    if (!judge) throw new Error('Judge not found');

    judge.status = judge.status === 'Active' ? 'Inactive' : 'Active';
    this.addAuditLog('JUDGE_STATUS_TOGGLED', `Changed status of ${judge.name} (${judge.id}) to ${judge.status}`);
    this.saveData();
    return { success: true, judge };
  }

  resetJudgeCredentials(id) {
    const judge = this.data.judges.find(j => j.id === id);
    if (!judge) throw new Error('Judge not found');

    // Generate mock new invitation token
    const token = `dalenzia_token_${Math.random().toString(36).substring(2, 9)}`;
    this.addNotification({
      judgeId: id,
      recipientName: judge.name,
      type: 'Account',
      title: 'Credentials Reset by Administrator',
      message: `Your login password has been reset. Temporary token: ${token}. Please change password upon sign-in.`
    });
    this.addAuditLog('CREDENTIALS_RESET', `Reset login credentials for ${judge.name} (${judge.id})`);
    this.saveData();
    return { success: true, token };
  }

  // =========================================================================
  // PROGRAMME ASSIGNMENTS (Section 4: Programme Assignment System)
  // =========================================================================
  getAssignments() {
    return this.data.programmeAssignments;
  }

  getAssignmentById(id) {
    return this.data.programmeAssignments.find(a => a.id === id);
  }

  assignJudgesToProgramme({ competitionId, judgeIds, criteria, instructions }) {
    let assignment = this.data.programmeAssignments.find(a => a.competitionId === competitionId);
    if (assignment) {
      assignment.assignedJudgeIds = Array.from(new Set([...assignment.assignedJudgeIds, ...judgeIds]));
      if (criteria) assignment.evaluationCriteria = criteria;
      if (instructions) assignment.instructions = instructions;
    } else {
      // Find competition details
      const newAsg = {
        id: `ASG-${(this.data.programmeAssignments.length + 1).toString().padStart(3, '0')}`,
        competitionId,
        competitionCode: competitionId.toUpperCase(),
        competitionTitle: competitionId,
        category: 'Fest Competition',
        type: 'Individual',
        venue: 'Grand Fest Stage',
        date: 'Dec 21, 2026',
        time: '10:00 AM',
        totalParticipants: 3,
        assignedJudgeIds: judgeIds,
        evaluationCriteria: criteria || [
          { id: 'c1', name: 'Presentation & Rigor', maxMarks: 50 },
          { id: 'c2', name: 'Originality & Depth', maxMarks: 50 }
        ],
        totalMaxMarks: 100,
        instructions: instructions || 'Adjudicate with objectivity and integrity.',
        status: 'Assigned',
        isPublished: false,
        publishedAt: null,
        participants: [
          { studentId: 'STU-1001', chestNo: 'C-101', name: 'Ahmad Rayan K.', teamId: 'team-01', teamName: 'Team A' },
          { studentId: 'STU-1005', chestNo: 'C-201', name: 'Muhammed Sinan T.', teamId: 'team-02', teamName: 'Team B' }
        ]
      };
      this.data.programmeAssignments.push(newAsg);
      assignment = newAsg;
    }

    // Update each judge's assignedCompIds & notify them
    judgeIds.forEach(jId => {
      const judge = this.data.judges.find(j => j.id === jId);
      if (judge) {
        if (!judge.assignedCompIds.includes(competitionId)) {
          judge.assignedCompIds.push(competitionId);
        }
        if (judge.evaluationStatus === 'Not Started') {
          judge.evaluationStatus = 'In Progress';
        }
        this.addNotification({
          judgeId: jId,
          recipientName: judge.name,
          type: 'Assignment',
          title: 'New Competition Assignment',
          message: `You have been assigned to evaluate: ${assignment.competitionTitle}. Check your Judge Portal.`
        });
      }
    });

    this.addAuditLog('PROGRAMME_ASSIGNED', `Assigned ${judgeIds.length} judges to ${assignment.competitionTitle}`);
    this.saveData();
    return { success: true, assignment };
  }

  removeJudgeFromProgramme(assignmentId, judgeId) {
    const assignment = this.data.programmeAssignments.find(a => a.id === assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    assignment.assignedJudgeIds = assignment.assignedJudgeIds.filter(id => id !== judgeId);
    const judge = this.data.judges.find(j => j.id === judgeId);
    if (judge) {
      judge.assignedCompIds = judge.assignedCompIds.filter(cId => cId !== assignment.competitionId);
    }

    this.addAuditLog('JUDGE_REMOVED', `Removed judge ${judgeId} from assignment ${assignmentId}`);
    this.saveData();
    return { success: true, assignment };
  }

  // =========================================================================
  // SUBMITTED MARKS & EVALUATION FLOW (Sections 5, 6, 7 & 12)
  // =========================================================================
  getSubmittedEvaluations() {
    return this.data.submittedEvaluations;
  }

  getEvaluationsForCompetition(competitionId) {
    return this.data.submittedEvaluations.filter(e => e.competitionId === competitionId);
  }

  // DYNAMIC JUDGE COMPETITION CREATION
  // =========================================================================
  createJudgeCompetition({
    name,
    classification = 'Stage', // 'Stage' | 'Off Stage' | 'General'
    type = 'Individual', // 'Individual' | 'Group' | 'General'
    category = 'Senior', // 'Minor' | 'Sub Junior' | 'Junior' | 'Senior' | 'General'
    judgeId = 'JDG-1001',
    judgeName = 'Chief Adjudicator (Festival Jury)',
    criteria,
    maxMarks = 100
  }) {
    if (!name || !name.trim()) {
      throw new Error('Competition name is required.');
    }

    const isGeneral = classification === 'General' || type === 'General' || category === 'General';
    const compClassification = isGeneral ? 'General' : (classification === 'Off Stage' ? 'Off Stage' : 'Stage');
    const compCategory = isGeneral ? 'General' : (category || 'Senior');
    const compType = isGeneral ? 'General' : (type === 'Group' ? 'Group' : 'Individual');
    const compFormat = compClassification === 'Stage' ? 'On Stage' : (compClassification === 'Off Stage' ? 'Off Stage' : 'General');

    const compId = `COMP-${Date.now().toString().slice(-5)}${Math.floor(100 + Math.random() * 900)}`;
    const compCode = `${compClassification === 'Stage' ? 'STG' : (compClassification === 'Off Stage' ? 'OFF' : 'GEN')}-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
    const now = new Date().toISOString();

    const evalCriteria = Array.isArray(criteria) && criteria.length > 0 ? criteria : [
      { id: 'c1', name: 'Content & Theme / ഉള്ളടക്കം & പ്രമേയം', maxMarks: 40 },
      { id: 'c2', name: 'Presentation & Delivery / അവതരണ ശൈലി', maxMarks: 30 },
      { id: 'c3', name: 'Accuracy & Language / കൃത്യത & ഭാഷാശുദ്ധി', maxMarks: 20 },
      { id: 'c4', name: 'Overall Impression / സവിശേഷ പ്രകടനം', maxMarks: 10 }
    ];

    const newComp = {
      id: compId,
      competitionId: compId,
      code: compCode,
      competitionCode: compCode,
      title: name.trim(),
      competitionTitle: name.trim(),
      classification: compClassification,
      format: compFormat,
      type: compType,
      category: compCategory,
      assignedJudgeIds: [judgeId],
      assignedJudgeName: judgeName,
      status: 'Pending Evaluation',
      evaluationCriteria: evalCriteria,
      criteria: evalCriteria,
      totalMaxMarks: maxMarks || 100,
      maxMarks: maxMarks || 100,
      participants: [],
      createdAt: now,
      isDynamicallyCreated: true
    };

    if (!Array.isArray(this.data.programmeAssignments)) {
      this.data.programmeAssignments = [];
    }
    if (!Array.isArray(this.data.programmes)) {
      this.data.programmes = [];
    }

    this.data.programmeAssignments.unshift(newComp);
    this.data.programmes.unshift(newComp);

    // Update judge record
    const judge = (this.data.judges || []).find(j => j.id === judgeId);
    if (judge) {
      judge.assignedProgrammesCount = (judge.assignedProgrammesCount || 0) + 1;
    }

    this.addAuditLog(
      'COMPETITION_CREATED_BY_JUDGE',
      `Judge ${judgeName} created competition "${name.trim()}" (${type}, ${category})`,
      judgeName
    );

    this.saveData();
    this._notify();
    return newComp;
  }

  // =========================================================================
  // DYNAMIC MARKS ENTRY & SUBMISSION ENGINE (INDIVIDUAL & GENERAL)
  // =========================================================================
  submitJudgeEvaluation({
    assignmentId,
    competitionId,
    judgeId,
    judgeName,
    type = 'Individual',
    category = 'General',
    scores = [],
    remarks = ''
  }) {
    const compId = competitionId || assignmentId;
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === compId || a.id === compId || a.competitionCode === compId
    );
    if (!assignment) throw new Error('Target competition not found.');

    const now = new Date().toISOString();
    const isGeneral = (type || assignment.type || '').toLowerCase() === 'general';

    // Validate scores payload
    if (!Array.isArray(scores) || scores.length === 0) {
      throw new Error('Please enter marks for at least one candidate/team before submitting.');
    }

    const validatedScores = [];
    const seenIds = new Set();

    if (isGeneral) {
      // General Team validation: must be existing teams
      scores.forEach(sc => {
        if (!sc.teamId) throw new Error('Invalid score entry: teamId is required.');
        if (seenIds.has(sc.teamId)) {
          throw new Error(`Duplicate evaluation detected for team ${sc.teamName || sc.teamId}.`);
        }
        seenIds.add(sc.teamId);

        const team = (this.data.teams || []).find(t => t.id === sc.teamId);
        if (!team) {
          throw new Error(`Team ID "${sc.teamId}" does not exist in official team records.`);
        }

        const total = typeof sc.total === 'number' ? sc.total : 0;
        validatedScores.push({
          teamId: team.id,
          teamName: team.displayName || team.name,
          name: team.displayName || team.name,
          criteriaMarks: sc.criteriaMarks || {},
          total,
          remarks: sc.remarks || 'Team Evaluation'
        });
      });
    } else {
      // Individual Student validation: must be existing registered students
      scores.forEach(sc => {
        if (!sc.studentId) throw new Error('Invalid score entry: studentId is required.');
        if (seenIds.has(sc.studentId)) {
          throw new Error(`Duplicate evaluation detected for student ID ${sc.studentId}.`);
        }
        seenIds.add(sc.studentId);

        const student = (this.data.registeredStudents || []).find(s => s.id === sc.studentId);
        if (!student) {
          throw new Error(`Student ID "${sc.studentId}" not found in registered students.`);
        }

        const team = (this.data.teams || []).find(t => t.id === student.teamId);
        const teamName = team ? (team.displayName || team.name) : (student.teamName || 'Unassigned');

        const total = typeof sc.total === 'number' ? sc.total : 0;
        validatedScores.push({
          studentId: student.id,
          chestNo: student.chestNo || '',
          name: student.name,
          category: student.category || 'General',
          teamId: student.teamId,
          teamName,
          criteriaMarks: sc.criteriaMarks || {},
          total,
          remarks: sc.remarks || 'Individual Evaluation'
        });
      });
    }

    // Sort validated scores descending by total
    validatedScores.sort((a, b) => b.total - a.total);

    // Update assignment participants so UI tables can render candidates
    assignment.participants = validatedScores;

    // Check if an existing evaluation sheet exists for this judge & competition
    let existing = (this.data.submittedEvaluations || []).find(
      e => (e.competitionId === assignment.competitionId || e.assignmentId === assignment.id) && e.judgeId === judgeId
    );

    if (existing) {
      existing.revisionHistory = existing.revisionHistory || [];
      if (existing.scores && existing.scores.length > 0) {
        existing.revisionHistory.push({
          scores: JSON.parse(JSON.stringify(existing.scores)),
          submittedAt: existing.submittedAt,
          previousStatus: existing.status,
          resubmittedAt: now
        });
      }
      existing.scores = validatedScores;
      existing.submittedAt = now;
      existing.status = 'SUBMITTED';
      existing.statusNote = 'Submitted via Judge Portal';
      existing.remarks = remarks;
      existing.type = isGeneral ? 'General' : 'Individual';
      existing.category = assignment.category;
      existing.returnedAt = null;
      existing.returnReason = null;
      existing.returnedByRole = null;
      existing.returnedByName = null;
    } else {
      existing = {
        id: `EVAL-${Date.now().toString().slice(-6)}`,
        assignmentId: assignment.id,
        competitionId: assignment.competitionId,
        competitionCode: assignment.competitionCode,
        competitionTitle: assignment.competitionTitle,
        type: isGeneral ? 'General' : 'Individual',
        category: assignment.category,
        judgeId,
        judgeName,
        submittedAt: now,
        status: 'SUBMITTED',
        statusNote: 'Submitted via Judge Portal',
        scores: validatedScores,
        remarks,
        revisionHistory: []
      };
      if (!Array.isArray(this.data.submittedEvaluations)) {
        this.data.submittedEvaluations = [];
      }
      this.data.submittedEvaluations.push(existing);
    }

    // Update assignment status
    assignment.status = 'Pending Approval';
    assignment.convenerApproved = false;
    assignment.adminApproved = false;
    assignment.approvedByRole = null;
    assignment.approvedByName = null;
    assignment.approvedAt = null;

    // Update Judge record
    const judge = (this.data.judges || []).find(j => j.id === judgeId);
    if (judge) {
      if (!Array.isArray(judge.submittedCompIds)) judge.submittedCompIds = [];
      if (!judge.submittedCompIds.includes(assignment.competitionId)) {
        judge.submittedCompIds.push(assignment.competitionId);
      }
      judge.evaluationStatus = 'Submitted';
    }

    // Recalculate points (unapproved results yield 0 points)
    this.recalculateApprovedTeamPoints();

    // Add confirmation notification
    this.addNotification({
      judgeId,
      recipientName: judgeName,
      type: 'Submission',
      title: 'Marks Submitted Successfully',
      message: `Your evaluation sheet for ${assignment.competitionTitle} has been securely submitted and logged.`
    });

    this.addAuditLog(
      'MARKS_SUBMITTED',
      `${judgeName} (${judgeId}) submitted marks for competition ${assignment.competitionTitle} (${validatedScores.length} entries)`
    );

    this.saveData();
    this._notify();
    return { success: true, evaluation: existing, assignment };
  }

  // =========================================================================
  // ALTERNATIVE APPROVAL WORKFLOW (CONVENER OR ADMIN)
  // Approval by EITHER Convener OR Admin is sufficient.
  // =========================================================================
  approveEvaluation(competitionId, { approvedByRole = 'CONVENER', approvedByName = '', notes = '' } = {}) {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Target competition not found.');

    const now = new Date().toISOString();
    const roleUpper = approvedByRole.toUpperCase(); // 'CONVENER' or 'ADMIN'
    const roleDisplay = roleUpper === 'ADMIN' ? 'Admin' : 'Convener';
    const finalApproverName = approvedByName || (roleUpper === 'ADMIN' ? 'Main Admin' : 'Usthad Hashir Ali (Convener)');

    // Update assignment
    assignment.status = 'APPROVED';
    assignment.approvedByRole = roleUpper;
    assignment.approvedByName = finalApproverName;
    assignment.approvedAt = now;
    assignment.approvalNotes = notes || '';
    if (roleUpper === 'CONVENER') {
      assignment.convenerApproved = true;
      assignment.convenerApproval = {
        approvedBy: finalApproverName,
        approvedAt: now,
        notes: notes || ''
      };
    } else {
      assignment.adminApproved = true;
      assignment.adminApproval = {
        approvedBy: finalApproverName,
        approvedAt: now,
        notes: notes || ''
      };
    }

    // Update all submitted evaluations for this competition
    (this.data.submittedEvaluations || []).forEach(e => {
      if (e.competitionId === assignment.competitionId || e.assignmentId === assignment.id) {
        e.status = 'APPROVED';
        e.approvedByRole = roleUpper;
        e.approvedByName = finalApproverName;
        e.approvedAt = now;
        e.approvalNotes = notes || '';
      }
    });

    this.recalculateApprovedTeamPoints();

    this.addAuditLog(
      'RESULT_APPROVED',
      `Approved evaluation for ${assignment.competitionTitle || assignment.title} by ${roleDisplay} (${finalApproverName})`,
      finalApproverName
    );

    this.addNotification({
      title: `Result Approved by ${roleDisplay}`,
      message: `${assignment.competitionTitle || assignment.title} results approved by ${finalApproverName}. Points credited to leaderboard.`,
      type: 'success',
      targetRole: 'all'
    });

    this.saveData();
    this._notify();
    return { success: true, assignment };
  }

  // =========================================================================
  // CORRECTIONS & AUDIT HISTORY WORKFLOW
  // Return evaluation with mandatory reason and preserve history.
  // =========================================================================
  returnEvaluationForCorrection(competitionId, { returnedByRole = 'CONVENER', returnedByName = '', reason = '' } = {}) {
    if (!reason || !reason.trim()) {
      throw new Error('A formal correction reason is strictly required.');
    }

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Target competition not found.');

    const now = new Date().toISOString();
    const roleUpper = returnedByRole.toUpperCase();
    const roleDisplay = roleUpper === 'ADMIN' ? 'Admin' : 'Convener';
    const finalReturnerName = returnedByName || (roleUpper === 'ADMIN' ? 'Main Admin' : 'Usthad Hashir Ali (Convener)');

    // Preserve previous evaluation state in revision history
    (this.data.submittedEvaluations || []).forEach(e => {
      if (e.competitionId === assignment.competitionId || e.assignmentId === assignment.id) {
        e.revisionHistory = e.revisionHistory || [];
        e.revisionHistory.push({
          scores: JSON.parse(JSON.stringify(e.scores || [])),
          returnedByRole: roleUpper,
          returnedByName: finalReturnerName,
          reason: reason.trim(),
          returnedAt: now,
          previousStatus: e.status
        });
        e.status = 'RETURNED';
        e.returnedByRole = roleUpper;
        e.returnedByName = finalReturnerName;
        e.returnReason = reason.trim();
        e.returnedAt = now;
        e.approvedByRole = null;
        e.approvedByName = null;
        e.approvedAt = null;
      }
    });

    assignment.status = 'RETURNED';
    assignment.returnReason = reason.trim();
    assignment.returnedByRole = roleUpper;
    assignment.returnedByName = finalReturnerName;
    assignment.returnedAt = now;
    assignment.convenerApproved = false;
    assignment.adminApproved = false;
    assignment.approvedByRole = null;
    assignment.approvedByName = null;
    assignment.approvedAt = null;

    this.recalculateApprovedTeamPoints();

    this.addAuditLog(
      'RESULT_RETURNED_FOR_CORRECTION',
      `Returned evaluation for ${assignment.competitionTitle || assignment.title} by ${roleDisplay} (${finalReturnerName}). Reason: ${reason.trim()}`,
      finalReturnerName
    );

    this.addNotification({
      title: `Evaluation Returned by ${roleDisplay}`,
      message: `Evaluation for ${assignment.competitionTitle || assignment.title} returned for correction: "${reason.trim()}"`,
      type: 'warning',
      targetRole: 'judge'
    });

    this.saveData();
    this._notify();
    return { success: true, assignment };
  }

  // =========================================================================
  // CENTRALIZED AUTOMATIC SCORING ENGINE
  // Individual: 1st=3, 2nd=2, 3rd=1 (to student's team)
  // General: 1st=10, 2nd=8, 3rd=6 (directly to team; NEVER multiplied by member count)
  // ONLY APPROVED results contribute to team points!
  // =========================================================================
  recalculateApprovedTeamPoints() {
    // Reset points on teams
    (this.data.teams || []).forEach(team => {
      team.individualPoints = 0;
      team.generalPoints = 0;
      team.points = 0;
      team.firstPlaces = 0;
      team.secondPlaces = 0;
      team.thirdPlaces = 0;
    });

    const teamMap = {};
    (this.data.teams || []).forEach(t => {
      teamMap[t.id] = t;
    });

    // ONLY APPROVED results contribute to Team Total Points and Leaderboard
    const approvedEvaluations = (this.data.submittedEvaluations || []).filter(e => {
      const s = (e.status || '').toUpperCase();
      return s === 'APPROVED';
    });

    approvedEvaluations.forEach(ev => {
      const isGeneral = (ev.type || '').toLowerCase() === 'general';
      const scores = Array.isArray(ev.scores) ? [...ev.scores] : [];

      // Sort scores descending by total
      scores.sort((a, b) => (b.total || 0) - (a.total || 0));

      if (isGeneral) {
        // General competition: 1st: 10, 2nd: 8, 3rd: 6 directly to the team
        // Do NOT multiply team points by the number of team members
        const pointsTable = [10, 8, 6];
        scores.forEach((sc, idx) => {
          if (idx < 3) {
            const pts = pointsTable[idx];
            const team = teamMap[sc.teamId];
            if (team) {
              team.generalPoints = (team.generalPoints || 0) + pts;
              team.points = (team.points || 0) + pts;
              if (idx === 0) team.firstPlaces = (team.firstPlaces || 0) + 1;
              if (idx === 1) team.secondPlaces = (team.secondPlaces || 0) + 1;
              if (idx === 2) team.thirdPlaces = (team.thirdPlaces || 0) + 1;
            }
          }
        });
      } else {
        // Individual competition: 1st: 3, 2nd: 2, 3rd: 1 credited to student's assigned team
        const pointsTable = [3, 2, 1];
        scores.forEach((sc, idx) => {
          if (idx < 3) {
            const pts = pointsTable[idx];
            let targetTeamId = sc.teamId;
            if (!targetTeamId && sc.studentId) {
              const stu = (this.data.registeredStudents || []).find(s => s.id === sc.studentId);
              if (stu) targetTeamId = stu.teamId;
            }
            const team = teamMap[targetTeamId];
            if (team) {
              team.individualPoints = (team.individualPoints || 0) + pts;
              team.points = (team.points || 0) + pts;
              if (idx === 0) team.firstPlaces = (team.firstPlaces || 0) + 1;
              if (idx === 1) team.secondPlaces = (team.secondPlaces || 0) + 1;
              if (idx === 2) team.thirdPlaces = (team.thirdPlaces || 0) + 1;
            }
          }
        });
      }
    });

    this.saveData();
    this._notify();
  }

  // AUTOMATIC TEAM LEADERBOARD
  // =========================================================================
  getTeamLeaderboard() {
    this.recalculateApprovedTeamPoints();
    const sorted = [...(this.data.teams || [])].sort((a, b) => (b.points || 0) - (a.points || 0));
    return sorted.map((team, idx) => ({
      ...team,
      rank: idx + 1,
      totalPoints: team.points || 0,
      individualPoints: team.individualPoints || 0,
      generalPoints: team.generalPoints || 0
    }));
  }

  requestCorrection(evalId, reason) {
    const evalItem = this.data.submittedEvaluations.find(e => e.id === evalId);
    if (!evalItem) throw new Error('Evaluation not found');

    evalItem.status = 'Correction Requested';
    evalItem.statusNote = reason;

    // Send notification to judge
    this.addNotification({
      judgeId: evalItem.judgeId,
      recipientName: evalItem.judgeName,
      type: 'Correction',
      title: 'Admin Correction Requested',
      message: `Correction requested for ${evalItem.competitionId}: "${reason}". Please review and resubmit your marks.`
    });

    this.addAuditLog('CORRECTION_REQUESTED', `Requested correction on ${evalId} (${evalItem.judgeName}): ${reason}`);
    this.saveData();
    return { success: true, evaluation: evalItem };
  }

  // [Delegated to authoritative calculateAggregatedResults below]

  // =========================================================================
  // RESULT PUBLICATION & POSTER GENERATION (Sections 8 & 9)
  // =========================================================================
  verifyAndPublishResult(competitionId) {
    const agg = this.calculateAggregatedResults(competitionId);
    if (!agg) throw new Error('No evaluation sheets available to calculate results');

    const assignment = this.data.programmeAssignments.find(a => a.competitionId === competitionId);
    if (!assignment) throw new Error('Assignment not found');

    const now = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    assignment.status = 'Approved';
    assignment.isPublished = true;
    assignment.publishedAt = now;

    // Check if poster exists; if not, generate one
    let poster = this.data.resultPosters.find(p => p.competitionId === competitionId);
    const p1 = agg.rankedParticipants[0];
    const p2 = agg.rankedParticipants[1];
    const p3 = agg.rankedParticipants[2];

    const posterData = {
      id: poster ? poster.id : `POS-${(this.data.resultPosters.length + 1).toString().padStart(2, '0')}`,
      competitionId,
      competitionCode: assignment.competitionCode,
      competitionTitle: assignment.competitionTitle,
      category: assignment.category,
      venue: assignment.venue,
      date: assignment.date,
      assignedJudgeIds: assignment.assignedJudgeIds,
      publishedAt: now,
      templateStyle: 'editorial_crimson',
      status: 'Published',
      firstPrize: p1 ? {
        name: p1.name,
        chestNo: p1.chestNo,
        teamId: p1.teamId,
        teamName: p1.teamName,
        score: `${p1.averageScore} / 100`,
        points: p1.pointsAwarded
      } : null,
      secondPrize: p2 ? {
        name: p2.name,
        chestNo: p2.chestNo,
        teamId: p2.teamId,
        teamName: p2.teamName,
        score: `${p2.averageScore} / 100`,
        points: p2.pointsAwarded
      } : null,
      thirdPrize: p3 ? {
        name: p3.name,
        chestNo: p3.chestNo,
        teamId: p3.teamId,
        teamName: p3.teamName,
        score: `${p3.averageScore} / 100`,
        points: p3.pointsAwarded
      } : null
    };

    posterData.podium = {
      first: posterData.firstPrize,
      second: posterData.secondPrize,
      third: posterData.thirdPrize
    };

    if (poster) {
      Object.assign(poster, posterData);
    } else {
      this.data.resultPosters.unshift(posterData);
    }

    // Automatically update team points in central leaderboard!
    agg.rankedParticipants.forEach(p => {
      if (p.pointsAwarded > 0 && p.teamId) {
        const team = this.data.teams.find(t => t.id === p.teamId);
        if (team) {
          team.points += p.pointsAwarded;
        }
      }
    });

    // Notify all assigned judges that the official poster has been published
    assignment.assignedJudgeIds.forEach(jId => {
      const judge = this.data.judges.find(j => j.id === jId);
      if (judge) {
        this.addNotification({
          judgeId: jId,
          recipientName: judge.name,
          type: 'Publication',
          title: 'Official Result Published',
          message: `Official results & award poster for ${assignment.competitionTitle} are now live on the Public Website and your Judge Portal.`
        });
      }
    });

    this.addAuditLog('RESULT_PUBLISHED', `Published official results and generated poster for ${assignment.competitionTitle}`);
    this.saveData();
    return { success: true, poster: posterData, assignment };
  }

  // =========================================================================
  // POSTERS (Section 9: Result Poster Management)
  // =========================================================================
  getPosters(judgeId = null) {
    if (judgeId) {
      // Judge Portal constraint: Judges only see posters for their assigned programmes!
      return this.data.resultPosters.filter(p => p.assignedJudgeIds.includes(judgeId));
    }
    return this.data.resultPosters;
  }

  getPublishedResultPosters() {
    return this.data.resultPosters || [];
  }

  // =========================================================================
  // NOTIFICATIONS (Section 10: Notifications)
  // =========================================================================
  getNotifications(judgeId = null) {
    if (judgeId) {
      return this.data.notifications.filter(n => n.judgeId === judgeId);
    }
    return this.data.notifications;
  }

  addNotification(notifData) {
    const notif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      date: 'Just now',
      read: false,
      ...notifData
    };
    this.data.notifications.unshift(notif);
    this.saveData();
  }

  markNotificationAsRead(id) {
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.saveData();
    }
  }

  // =========================================================================
  // AUDIT LOGS (Section 13: Security & Access Control)
  // =========================================================================
  getAuditLogs() {
    return this.data.auditLogs;
  }

  addAuditLog(action, details, performedBy = 'Fest Administrator') {
    const log = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.data.auditLogs.unshift(log);
    this.saveData();
  }

  // =========================================================================
  // TEAM MANAGEMENT METHODS & REAL-TIME CRUD (Step 02 - Complete Team Management)
  // =========================================================================
  getTeamStats() {
    const teams = this.getTeams();
    const totalTeams = teams.length;
    const activeTeams = teams.filter(t => t.status === 'Active').length;
    const inactiveTeams = teams.filter(t => t.status === 'Inactive').length;
    const totalMembers = teams.reduce((acc, t) => acc + (t.members || (t.students ? t.students.length : 0)), 0);
    const teamsWithoutLeaders = teams.filter(t => !t.leader || t.leader.trim() === '').length;
    const totalPoints = teams.reduce((acc, t) => acc + (t.points || 0), 0);

    return {
      totalTeams,
      activeTeams,
      inactiveTeams,
      totalMembers,
      teamsWithoutLeaders,
      totalPoints,
      overallRankings: teams
    };
  }

  addTeam(teamData) {
    const nextNum = (this.data.teams.length + 1).toString().padStart(2, '0');
    const autoCode = teamData.code ? teamData.code.trim().toUpperCase() : `TM0${nextNum}`;

    // Prevent duplicate team codes
    if (this.data.teams.some(t => t.code.toUpperCase() === autoCode)) {
      throw new Error(`Team Code "${autoCode}" already exists. Please choose a unique code.`);
    }

    const newTeam = {
      id: `team-${nextNum}`,
      code: autoCode,
      name: teamData.name.trim(),
      subname: teamData.subname ? teamData.subname.trim() : 'Central Region',
      leader: teamData.leader ? teamData.leader.trim() : 'Unassigned',
      leaderContact: teamData.leaderContact ? teamData.leaderContact.trim() : '+91 98471 00000',
      leaderStatus: teamData.leader && teamData.leader !== 'Unassigned' ? 'Active' : 'Pending',
      members: 0,
      points: 0,
      rank: this.data.teams.length + 1,
      badge: teamData.badge || '⭐',
      status: teamData.status || 'Active',
      students: []
    };

    this.data.teams.push(newTeam);
    this.recalculateTeamRankings();
    this.addAuditLog('TEAM_CREATED', `Created new team "${newTeam.name}" (${newTeam.code})`);
    this.saveData();
    return { success: true, team: newTeam };
  }

  updateTeam(id, updateFields) {
    const team = this.data.teams.find(t => t.id === id);
    if (!team) throw new Error('Selected team was not found.');

    if (updateFields.code && updateFields.code.toUpperCase() !== team.code.toUpperCase()) {
      if (this.data.teams.some(t => t.id !== id && t.code.toUpperCase() === updateFields.code.toUpperCase())) {
        throw new Error(`Team code "${updateFields.code}" is already in use by another team.`);
      }
    }

    Object.assign(team, updateFields);
    if (updateFields.points !== undefined) {
      this.recalculateTeamRankings();
    }
    this.addAuditLog('TEAM_UPDATED', `Updated details for team "${team.name}" (${team.code})`);
    this.saveData();
    return { success: true, team };
  }

  deleteTeam(id, force = false) {
    const teamIndex = this.data.teams.findIndex(t => t.id === id);
    if (teamIndex === -1) throw new Error('Selected team was not found.');

    const team = this.data.teams[teamIndex];

    // Check if team has registered students or published results
    const hasStudents = team.students && team.students.length > 0;
    const hasResults = (this.data.resultPosters || []).some(
      p => (p.firstPrize && p.firstPrize.teamId === id) ||
        (p.secondPrize && p.secondPrize.teamId === id) ||
        (p.thirdPrize && p.thirdPrize.teamId === id)
    );

    if (!force && (hasStudents || hasResults)) {
      throw new Error(
        `Cannot delete team "${team.name}" because it has ${team.students.length} assigned students and/or recorded competition results. Please reassign students or confirm forced deletion.`
      );
    }

    // Unassign students from this team in registry
    this.data.registeredStudents.forEach(s => {
      if (s.teamId === id) {
        s.teamId = null;
        s.teamName = 'Unassigned';
      }
    });

    this.data.teams.splice(teamIndex, 1);
    this.recalculateTeamRankings();
    this.addAuditLog('TEAM_DELETED', `Deleted team "${team.name}" (${team.code})`);
    this.saveData();
    return { success: true };
  }

  removeStudentFromTeam(teamId, studentId) {
    const team = this.data.teams.find(t => t.id === teamId);
    if (!team) throw new Error('Selected team was not found.');

    const stuIdx = team.students.findIndex(s => s.id === studentId);
    if (stuIdx === -1) throw new Error('Student was not found in this team.');

    const removed = team.students.splice(stuIdx, 1)[0];
    team.members = team.students.length;

    const regStudent = this.data.registeredStudents.find(s => s.id === studentId);
    if (regStudent) {
      regStudent.teamId = null;
      regStudent.teamName = 'Unassigned';
    }

    this.addAuditLog('STUDENT_REMOVED_FROM_TEAM', `Removed student ${removed.name} (${removed.chestNo}) from ${team.name}`);
    this.saveData();
    return { success: true, team, removedStudent: removed };
  }

  updateTeamLeader(teamId, { leader, leaderContact, leaderStatus }) {
    const team = this.data.teams.find(t => t.id === teamId);
    if (!team) throw new Error('Selected team was not found.');

    team.leader = leader ? leader.trim() : team.leader;
    team.leaderContact = leaderContact ? leaderContact.trim() : team.leaderContact;
    team.leaderStatus = leaderStatus || 'Active';

    this.addAuditLog('TEAM_LEADER_UPDATED', `Updated team leader for ${team.name} to ${team.leader}`);
    this.saveData();
    return { success: true, team };
  }

  getTeamCompetitions(teamId) {
    const team = this.data.teams.find(t => t.id === teamId);
    if (!team) return [];

    const studentIds = (team.students || []).map(s => s.id);
    const competitions = [];

    (this.data.programmeAssignments || []).forEach(asg => {
      const matchedParticipants = (asg.participants || []).filter(
        p => p.teamId === teamId || studentIds.includes(p.studentId)
      );

      if (matchedParticipants.length > 0) {
        competitions.push({
          id: asg.id,
          competitionId: asg.competitionId,
          code: asg.competitionCode,
          title: asg.competitionTitle,
          category: asg.category,
          type: asg.type,
          venue: asg.venue,
          date: asg.date,
          time: asg.time,
          status: asg.isPublished ? 'Published' : asg.status,
          participants: matchedParticipants
        });
      }
    });

    return competitions;
  }

  getTeamResults(teamId) {
    const results = [];

    // From official published posters
    (this.data.resultPosters || []).forEach(p => {
      if (p.firstPrize && p.firstPrize.teamId === teamId) {
        results.push({
          id: `${p.id}-1`,
          competitionTitle: p.competitionTitle,
          category: p.category,
          studentName: p.firstPrize.name,
          chestNo: p.firstPrize.chestNo,
          position: '1st Prize (Gold)',
          rank: 1,
          score: p.firstPrize.score,
          points: p.firstPrize.points || 30,
          date: p.date,
          venue: p.venue
        });
      }
      if (p.secondPrize && p.secondPrize.teamId === teamId) {
        results.push({
          id: `${p.id}-2`,
          competitionTitle: p.competitionTitle,
          category: p.category,
          studentName: p.secondPrize.name,
          chestNo: p.secondPrize.chestNo,
          position: '2nd Prize (Silver)',
          rank: 2,
          score: p.secondPrize.score,
          points: p.secondPrize.points || 20,
          date: p.date,
          venue: p.venue
        });
      }
      if (p.thirdPrize && p.thirdPrize.teamId === teamId) {
        results.push({
          id: `${p.id}-3`,
          competitionTitle: p.competitionTitle,
          category: p.category,
          studentName: p.thirdPrize.name,
          chestNo: p.thirdPrize.chestNo,
          position: '3rd Prize (Bronze)',
          rank: 3,
          score: p.thirdPrize.score,
          points: p.thirdPrize.points || 10,
          date: p.date,
          venue: p.venue
        });
      }
    });

    return results;
  }

  recalculateTeamRankings() {
    this.data.teams.sort((a, b) => (b.points || 0) - (a.points || 0));
    this.data.teams.forEach((t, idx) => {
      t.rank = idx + 1;
    });
  }

  // =========================================================================
  // TEAM ALLOCATION & DYNAMIC MEMBERSHIP METHODS
  // =========================================================================
  getTeams() {
    return (this.data.teams || []).map(t => {
      // Dynamically link students belonging to this team from registeredStudents
      const teamStudents = (this.data.registeredStudents || []).filter(s => s.teamId === t.id);

      const countsByCategory = {
        Senior: teamStudents.filter(s => s.classCategory === 'Senior').length,
        Junior: teamStudents.filter(s => s.classCategory === 'Junior').length,
        'Sub Junior': teamStudents.filter(s => s.classCategory === 'Sub Junior').length,
        Minor: teamStudents.filter(s => s.classCategory === 'Minor').length
      };

      return {
        ...t,
        students: teamStudents,
        members: teamStudents.length,
        countsByCategory
      };
    }).sort((a, b) => (b.points || 0) - (a.points || 0));
  }

  getTeamById(id) {
    const teams = this.getTeams();
    return teams.find(t => t.id === id);
  }

  getRegisteredStudents() {
    return this.data.registeredStudents || [];
  }

  getTeamAllocationStats() {
    const teams = this.getTeams();
    const allStudents = this.data.registeredStudents || [];
    const unassigned = allStudents.filter(s => !s.teamId || s.teamId === 'Unassigned');
    const team1 = teams.find(t => t.id === 'team-1') || {};
    const team2 = teams.find(t => t.id === 'team-2') || {};

    const categoryDistribution = {
      Senior: {
        total: allStudents.filter(s => s.classCategory === 'Senior').length,
        team1: team1.countsByCategory?.Senior || 0,
        team2: team2.countsByCategory?.Senior || 0,
        unassigned: unassigned.filter(s => s.classCategory === 'Senior').length
      },
      Junior: {
        total: allStudents.filter(s => s.classCategory === 'Junior').length,
        team1: team1.countsByCategory?.Junior || 0,
        team2: team2.countsByCategory?.Junior || 0,
        unassigned: unassigned.filter(s => s.classCategory === 'Junior').length
      },
      'Sub Junior': {
        total: allStudents.filter(s => s.classCategory === 'Sub Junior').length,
        team1: team1.countsByCategory?.['Sub Junior'] || 0,
        team2: team2.countsByCategory?.['Sub Junior'] || 0,
        unassigned: unassigned.filter(s => s.classCategory === 'Sub Junior').length
      },
      Minor: {
        total: allStudents.filter(s => s.classCategory === 'Minor').length,
        team1: team1.countsByCategory?.Minor || 0,
        team2: team2.countsByCategory?.Minor || 0,
        unassigned: unassigned.filter(s => s.classCategory === 'Minor').length
      }
    };

    return {
      totalStudents: allStudents.length,
      totalRegistered: allStudents.length,
      assignedStudents: allStudents.length - unassigned.length,
      totalAllocated: allStudents.length - unassigned.length,
      unassignedStudentsCount: unassigned.length,
      totalUnassigned: unassigned.length,
      team1Count: team1.members || 0,
      team2Count: team2.members || 0,
      teams,
      categoryDistribution
    };
  }

  getUnassignedStudents(categoryFilter = 'all', searchQuery = '') {
    const allStudents = this.data.registeredStudents || [];
    const q = (searchQuery || '').toLowerCase().trim();
    return allStudents.filter(s => {
      const isUnassigned = !s.teamId || s.teamId === 'Unassigned';
      if (!isUnassigned) return false;

      const matchCategory =
        categoryFilter === 'all' ||
        (s.classCategory || '').toLowerCase() === categoryFilter.toLowerCase();

      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.chestNo.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.institution || '').toLowerCase().includes(q);

      return matchCategory && matchQuery;
    });
  }

  allocateStudentToTeam(teamId, studentId, actor = 'Team Leader') {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Target team not found.');

    const student = (this.data.registeredStudents || []).find(s => s.id === studentId);
    if (!student) throw new Error('Student record not found in central registry.');

    // Duplicate check
    if (student.teamId === teamId) {
      throw new Error(`Student ${student.name} (${student.chestNo}) is already allocated to ${team.name}.`);
    }

    const previousTeam = student.teamName || student.teamId || 'Unassigned';
    const isTransfer = Boolean(student.teamId && student.teamId !== 'Unassigned');

    if (isTransfer && actor.toLowerCase().includes('leader')) {
      throw new Error(`Student ${student.name} is currently assigned to ${previousTeam}. Inter-team transfers require Convener or Admin authorization.`);
    }

    // Preserve original classCategory strictly - never change it during team allocation!
    student.teamId = team.id;
    student.teamName = team.name;

    const action = isTransfer ? 'STUDENT_REASSIGNED_TEAM' : 'STUDENT_ALLOCATED_TO_TEAM';
    const details = isTransfer
      ? `${actor} transferred ${student.name} (${student.chestNo}, ${student.classCategory}) from ${previousTeam} to ${team.name}`
      : `${actor} allocated ${student.name} (${student.chestNo}, ${student.classCategory}) to ${team.name}`;

    this.addAuditLog(action, details, actor);

    this.saveData();
    this._notify();
    return { success: true, student, team };
  }

  removeStudentFromTeam(teamId, studentId, actor = 'Team Leader', reason = '') {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Target team not found.');

    const student = (this.data.registeredStudents || []).find(s => s.id === studentId);
    if (!student) throw new Error('Student record not found in central registry.');

    if (student.teamId !== teamId) {
      throw new Error(`Student ${student.name} is not a member of ${team.name}.`);
    }

    const oldTeamName = team.name;
    student.teamId = null;
    student.teamName = 'Unassigned';

    this.addAuditLog(
      'STUDENT_REMOVED_FROM_TEAM',
      `${actor} removed ${student.name} (${student.chestNo}, ${student.classCategory}) from ${oldTeamName}. Reason: ${reason || 'Squad restructuring'}`,
      actor
    );

    this.saveData();
    this._notify();
    return { success: true, student, team };
  }

  reassignStudentTeam(studentId, fromTeamId, toTeamId, actor = 'Convener', reason = '') {
    return this.allocateStudentToTeam(toTeamId, studentId, actor);
  }

  updateTeamLeaders(teamId, { leader, asstLeader, leaderStudentId, asstLeaderStudentId }, actor = 'Admin') {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Team not found.');

    const prevLeader = team.leader;
    const prevAsst = team.asstLeader;

    if (leader) team.leader = leader;
    if (asstLeader) team.asstLeader = asstLeader;
    if (leaderStudentId) team.leaderStudentId = leaderStudentId;
    if (asstLeaderStudentId) team.asstLeaderStudentId = asstLeaderStudentId;

    this.addAuditLog(
      'TEAM_LEADERSHIP_UPDATED',
      `${actor} updated leadership for ${team.name}: Leader ${leader || prevLeader}, Asst Leader ${asstLeader || prevAsst}`,
      actor
    );

    this.saveData();
    this._notify();
    return { success: true, team };
  }

  getTeamAllocationAuditLogs() {
    const logs = this.data.auditLogs || [];
    return logs.filter(l =>
      l.action && (
        l.action.startsWith('STUDENT_') ||
        l.action.startsWith('TEAM_') ||
        l.action.includes('LEADER')
      )
    );
  }

  // =========================================================================
  // PROGRAMME MANAGEMENT SYSTEM (Step 06 - Complete Functional Development)
  // =========================================================================

  getProgrammeCategories() {
    const categories = this.data.programmeCategories || [];
    const progs = this.data.programmes || [];
    return categories.map(cat => ({
      ...cat,
      programmeCount: progs.filter(p => p.category === cat.name || p.categoryCode === cat.code).length
    }));
  }

  addProgrammeCategory(categoryData) {
    if (!categoryData.name || !categoryData.name.trim()) {
      throw new Error('Category name is required.');
    }
    const name = categoryData.name.trim();
    const existing = (this.data.programmeCategories || []).find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      throw new Error(`Category "${name}" already exists.`);
    }

    const nextId = `CAT-${(categoryData.code || name.substring(0, 3)).toUpperCase()}`;
    const newCategory = {
      id: nextId,
      name,
      code: (categoryData.code || name.substring(0, 3)).toUpperCase(),
      description: (categoryData.description || '').trim(),
      color: categoryData.color || '#A91F35',
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
    };

    if (!this.data.programmeCategories) this.data.programmeCategories = [];
    this.data.programmeCategories.push(newCategory);
    this.addAuditLog('PROGRAMME_CATEGORY_CREATED', `Created programme category: ${newCategory.name} (${newCategory.code})`);
    this.saveData();
    return { success: true, category: newCategory };
  }

  updateProgrammeCategory(id, updateData) {
    const cat = (this.data.programmeCategories || []).find(c => c.id === id);
    if (!cat) throw new Error('Category not found.');

    if (updateData.name && updateData.name.trim() !== cat.name) {
      const duplicate = this.data.programmeCategories.find(
        c => c.id !== id && c.name.toLowerCase() === updateData.name.trim().toLowerCase()
      );
      if (duplicate) throw new Error(`Category name "${updateData.name}" already in use.`);
      cat.name = updateData.name.trim();
    }

    if (updateData.code) cat.code = updateData.code.trim().toUpperCase();
    if (updateData.description !== undefined) cat.description = updateData.description.trim();
    if (updateData.color) cat.color = updateData.color;
    if (updateData.isActive !== undefined) cat.isActive = Boolean(updateData.isActive);

    this.addAuditLog('PROGRAMME_CATEGORY_UPDATED', `Updated programme category: ${cat.name}`);
    this.saveData();
    return { success: true, category: cat };
  }

  toggleProgrammeCategoryStatus(id) {
    const cat = (this.data.programmeCategories || []).find(c => c.id === id);
    if (!cat) throw new Error('Category not found.');

    cat.isActive = !cat.isActive;
    this.addAuditLog('PROGRAMME_CATEGORY_TOGGLED', `Toggled category ${cat.name} status to ${cat.isActive ? 'Active' : 'Inactive'}`);
    this.saveData();
    return { success: true, category: cat };
  }

  deleteProgrammeCategory(id) {
    const cat = (this.data.programmeCategories || []).find(c => c.id === id);
    if (!cat) throw new Error('Category not found.');

    const linkedProgs = (this.data.programmes || []).filter(
      p => p.category === cat.name || p.categoryCode === cat.code
    );
    if (linkedProgs.length > 0) {
      throw new Error(`Cannot delete category "${cat.name}" because it is currently assigned to ${linkedProgs.length} active programme(s). Please reassign them first.`);
    }

    this.data.programmeCategories = this.data.programmeCategories.filter(c => c.id !== id);
    this.addAuditLog('PROGRAMME_CATEGORY_DELETED', `Deleted programme category: ${cat.name}`);
    this.saveData();
    return { success: true };
  }

  getProgrammes({ query = '', category = 'all', date = 'all', status = 'all', sortBy = 'date' } = {}) {
    let list = (this.data.programmes || []).map(p => {
      // Enrich with guest if available
      let guestObj = null;
      if (p.guestId && Array.isArray(this.data.programmeGuests)) {
        guestObj = this.data.programmeGuests.find(g => g.id === p.guestId);
      }
      // Enrich with competition if available
      let compObj = null;
      if (p.relatedCompId && Array.isArray(this.data.programmeAssignments)) {
        compObj = this.data.programmeAssignments.find(c => c.competitionId === p.relatedCompId || c.id === p.relatedCompId);
      }
      return {
        ...p,
        guest: guestObj,
        relatedCompetition: compObj
      };
    });

    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.code && p.code.toLowerCase().includes(q)) ||
        (p.venue && p.venue.toLowerCase().includes(q)) ||
        (p.coordinatorName && p.coordinatorName.toLowerCase().includes(q)) ||
        (p.guestName && p.guestName.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category || p.categoryCode === category);
    }

    if (date && date !== 'all') {
      list = list.filter(p => p.date === date || (p.date && p.date.includes(date)));
    }

    if (status && status !== 'all') {
      list = list.filter(p => p.status && p.status.toLowerCase() === status.toLowerCase());
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'id') return (a.id || '').localeCompare(b.id || '');
      if (sortBy === 'venue') return (a.venue || '').localeCompare(b.venue || '');
      // Default: sort by date then time
      const dateCompare = (a.date || '').localeCompare(b.date || '');
      if (dateCompare !== 0) return dateCompare;
      return (a.startTime || a.time || '').localeCompare(b.startTime || b.time || '');
    });

    return list;
  }

  getProgrammeById(id) {
    const list = this.getProgrammes();
    return list.find(p => p.id === id || p.code === id);
  }

  getProgrammeDashboardStats() {
    const programmes = this.data.programmes || [];
    const totalProgrammes = programmes.length;
    const upcomingProgrammes = programmes.filter(p => p.status === 'Upcoming' || p.status === 'Scheduled').length;
    const ongoingProgrammes = programmes.filter(p => p.status === 'Ongoing').length;
    const completedProgrammes = programmes.filter(p => p.status === 'Completed').length;
    const cancelledProgrammes = programmes.filter(p => p.status === 'Cancelled').length;
    const draftProgrammes = programmes.filter(p => p.status === 'Draft').length;

    // Scheduled Today (Dec 21, 2026 or Dec 22, 2026)
    const scheduledToday = programmes.filter(p => p.date === 'Dec 21, 2026' && p.status !== 'Cancelled').length;

    // Category breakdown
    const categories = this.getProgrammeCategories();
    const categoryBreakdown = categories.map(cat => ({
      ...cat,
      count: programmes.filter(p => p.category === cat.name || p.categoryCode === cat.code).length
    }));

    // Venue breakdown across 5 official festival venues
    const venues = [
      'Cordova Grand Stage (Stage 01)',
      'Al-Farabi Heritage Hall (Stage 02)',
      'Ibn Khaldun Academic Hall (Stage 03)',
      'Media Studio Preview Room',
      'Open Amphitheatre'
    ];
    const venueDistribution = venues.map(venue => ({
      venue,
      count: programmes.filter(p => p.venue && p.venue.includes(venue.split(' ')[0])).length
    }));

    // Upcoming Queue
    const upcomingList = programmes
      .filter(p => p.status !== 'Completed' && p.status !== 'Cancelled')
      .slice(0, 6);

    // Recent Updates
    const recentUpdates = programmes.slice(0, 5);

    return {
      totalProgrammes,
      upcomingProgrammes,
      ongoingProgrammes,
      completedProgrammes,
      cancelledProgrammes,
      draftProgrammes,
      scheduledToday,
      categoryBreakdown,
      venueDistribution,
      upcomingList,
      recentUpdates
    };
  }

  addProgramme(progData) {
    if (!progData.title || !progData.title.trim()) {
      throw new Error('Programme title is mandatory.');
    }
    if (!progData.category || !progData.category.trim()) {
      throw new Error('Programme category is required.');
    }
    if (!progData.date) {
      throw new Error('Programme date is required.');
    }
    if (!progData.venue) {
      throw new Error('Programme venue is required.');
    }

    const title = progData.title.trim();
    // Prevent duplicate programme titles on the same date and venue
    const duplicate = (this.data.programmes || []).find(
      p => p.title.toLowerCase() === title.toLowerCase() && p.date === progData.date && p.venue === progData.venue
    );
    if (duplicate) {
      throw new Error(`A programme titled "${title}" is already scheduled at ${progData.venue} on ${progData.date}.`);
    }

    const nextNum = (this.data.programmes ? this.data.programmes.length : 0) + 1;
    const newId = `PRG-${nextNum.toString().padStart(3, '0')}`;
    const code = progData.code && progData.code.trim()
      ? progData.code.trim().toUpperCase()
      : `PRG-${progData.category.substring(0, 3).toUpperCase()}-${nextNum.toString().padStart(2, '0')}`;

    // Duplicate code check
    if ((this.data.programmes || []).some(p => p.code === code)) {
      throw new Error(`Programme code "${code}" already exists.`);
    }

    const newProg = {
      id: newId,
      code,
      title,
      malayalamTitle: progData.malayalamTitle ? progData.malayalamTitle.trim() : '',
      category: progData.category,
      categoryCode: progData.categoryCode || progData.category.substring(0, 3).toUpperCase(),
      desc: progData.description ? progData.description.trim() : (progData.desc || ''),
      date: progData.date,
      time: progData.time || `${progData.startTime || '09:00 AM'} – ${progData.endTime || '10:30 AM'}`,
      startTime: progData.startTime || '09:00 AM',
      endTime: progData.endTime || '10:30 AM',
      venue: progData.venue,
      coordinatorName: progData.coordinatorName ? progData.coordinatorName.trim() : 'Festival Secretariat',
      coordinatorPhone: progData.coordinatorPhone ? progData.coordinatorPhone.trim() : '+91 98470 11223',
      guestId: progData.guestId || null,
      guestName: progData.guestName || (progData.guestId ? (this.data.programmeGuests?.find(g => g.id === progData.guestId)?.name || 'Distinguished Guest') : null),
      relatedCompId: progData.relatedCompId || null,
      relatedComp: progData.relatedComp || (progData.relatedCompId ? (this.data.programmeAssignments?.find(c => c.competitionId === progData.relatedCompId || c.id === progData.relatedCompId)?.competitionTitle || 'Festival Arena') : null),
      posterUrl: progData.posterUrl || '/assets/dalenzia_fest_logo.png',
      status: progData.status || 'Scheduled',
      isPublished: progData.isPublished !== undefined ? Boolean(progData.isPublished) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: progData.icon || 'calendar'
    };

    if (!this.data.programmes) this.data.programmes = [];
    this.data.programmes.unshift(newProg);
    this.addAuditLog('PROGRAMME_CREATED', `Created new festival programme: ${newProg.title} (${newProg.code}) at ${newProg.venue}`);
    this.saveData();
    return { success: true, programme: newProg };
  }

  updateProgramme(id, updateData) {
    const prog = (this.data.programmes || []).find(p => p.id === id || p.code === id);
    if (!prog) throw new Error('Target festival programme not found.');

    if (updateData.title && updateData.title.trim()) {
      prog.title = updateData.title.trim();
    }
    if (updateData.malayalamTitle !== undefined) {
      prog.malayalamTitle = updateData.malayalamTitle.trim();
    }
    if (updateData.category) {
      prog.category = updateData.category;
      prog.categoryCode = updateData.categoryCode || updateData.category.substring(0, 3).toUpperCase();
    }
    if (updateData.description !== undefined) {
      prog.desc = updateData.description.trim();
    } else if (updateData.desc !== undefined) {
      prog.desc = updateData.desc.trim();
    }
    if (updateData.date) prog.date = updateData.date;
    if (updateData.startTime) prog.startTime = updateData.startTime;
    if (updateData.endTime) prog.endTime = updateData.endTime;
    if (updateData.startTime || updateData.endTime) {
      prog.time = `${prog.startTime || '09:00 AM'} – ${prog.endTime || '10:30 AM'}`;
    }
    if (updateData.venue) prog.venue = updateData.venue;
    if (updateData.coordinatorName !== undefined) prog.coordinatorName = updateData.coordinatorName.trim();
    if (updateData.coordinatorPhone !== undefined) prog.coordinatorPhone = updateData.coordinatorPhone.trim();
    if (updateData.guestId !== undefined) {
      prog.guestId = updateData.guestId;
      prog.guestName = updateData.guestName || (updateData.guestId ? (this.data.programmeGuests?.find(g => g.id === updateData.guestId)?.name || 'Distinguished Guest') : null);
    }
    if (updateData.relatedCompId !== undefined) {
      prog.relatedCompId = updateData.relatedCompId;
      prog.relatedComp = updateData.relatedComp || (updateData.relatedCompId ? (this.data.programmeAssignments?.find(c => c.competitionId === updateData.relatedCompId || c.id === updateData.relatedCompId)?.competitionTitle || 'Festival Arena') : null);
    }
    if (updateData.posterUrl) prog.posterUrl = updateData.posterUrl;
    if (updateData.status) prog.status = updateData.status;
    if (updateData.isPublished !== undefined) prog.isPublished = Boolean(updateData.isPublished);

    prog.updatedAt = new Date().toISOString();
    this.addAuditLog('PROGRAMME_UPDATED', `Updated programme details for: ${prog.title} (${prog.code})`);
    this.saveData();
    return { success: true, programme: prog };
  }

  deleteProgramme(id, { force = false } = {}) {
    const prog = (this.data.programmes || []).find(p => p.id === id || p.code === id);
    if (!prog) throw new Error('Target festival programme not found.');

    // Protection check: if linked to completed result or award, prevent accidental deletion
    if (prog.status === 'Completed' && !force) {
      throw new Error(`Cannot delete "${prog.title}" because it is marked as Completed with archival records. Use status change or safe cancellation instead.`);
    }

    this.data.programmes = this.data.programmes.filter(p => p.id !== prog.id);
    this.addAuditLog('PROGRAMME_DELETED', `Deleted programme record: ${prog.title} (${prog.code})`);
    this.saveData();
    return { success: true };
  }

  updateProgrammeStatus(id, newStatus, adminUser = 'Super Admin') {
    const validStatuses = ['Draft', 'Upcoming', 'Scheduled', 'Ongoing', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
    }

    const prog = (this.data.programmes || []).find(p => p.id === id || p.code === id);
    if (!prog) throw new Error('Target festival programme not found.');

    const oldStatus = prog.status;
    prog.status = newStatus;
    prog.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'PROGRAMME_STATUS_CHANGED',
      `Changed status of ${prog.title} (${prog.code}) from ${oldStatus} to ${newStatus} by ${adminUser}`
    );
    this.saveData();
    return { success: true, programme: prog };
  }

  toggleProgrammePublish(id) {
    const prog = (this.data.programmes || []).find(p => p.id === id || p.code === id);
    if (!prog) throw new Error('Target festival programme not found.');

    prog.isPublished = !prog.isPublished;
    prog.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'PROGRAMME_PUBLISH_TOGGLED',
      `Toggled public publication of ${prog.title} to ${prog.isPublished ? 'Published' : 'Hidden'}`
    );
    this.saveData();
    return { success: true, programme: prog };
  }

  // =========================================================================
  // PROGRAMME GUEST MANAGEMENT SYSTEM (Step 07 - Complete Functional Development)
  // =========================================================================

  getGuestCategories() {
    const categories = this.data.guestCategories || [];
    const guests = (this.data.programmeGuests || []).filter(g => !g.isArchived);
    return categories.map(cat => ({
      ...cat,
      guestCount: guests.filter(g => g.category === cat.name || g.categoryCode === cat.code).length
    }));
  }

  addGuestCategory(categoryData) {
    if (!categoryData.name || !categoryData.name.trim()) {
      throw new Error('Category name is required.');
    }
    const name = categoryData.name.trim();
    const existing = (this.data.guestCategories || []).find(
      c => c.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      throw new Error(`Guest category "${name}" already exists.`);
    }

    const code = (categoryData.code || name.substring(0, 3)).toUpperCase();
    const newCat = {
      id: `GCAT-${code}`,
      name,
      code,
      color: categoryData.color || '#A91F35'
    };

    if (!this.data.guestCategories) this.data.guestCategories = [];
    this.data.guestCategories.push(newCat);
    this.addAuditLog('GUEST_CATEGORY_CREATED', `Created guest category: ${newCat.name} (${newCat.code})`);
    this.saveData();
    return { success: true, category: newCat };
  }

  getGuestDashboardStats() {
    const allGuests = (this.data.programmeGuests || []).filter(g => !g.isArchived);
    const totalGuests = allGuests.length;
    const confirmedGuests = allGuests.filter(g => g.invitationStatus === 'Confirmed').length;
    const pendingInvitations = allGuests.filter(
      g => g.invitationStatus === 'Invitation Pending' || g.invitationStatus === 'Invitation Sent'
    ).length;
    const declinedInvitations = allGuests.filter(g => g.invitationStatus === 'Declined').length;

    const assignedGuests = allGuests.filter(
      g => Array.isArray(g.assignedProgrammeIds) && g.assignedProgrammeIds.length > 0
    ).length;
    const unassignedGuests = totalGuests - assignedGuests;

    const arrivedGuests = allGuests.filter(
      g => g.participationStatus === 'Arrived on Campus' || g.participationStatus === 'Session Completed'
    ).length;

    const categories = this.getGuestCategories();
    const categoryBreakdown = categories.map(cat => ({
      ...cat,
      count: allGuests.filter(g => g.category === cat.name || g.categoryCode === cat.code).length
    }));

    const invitationBreakdown = {
      Confirmed: confirmedGuests,
      Pending: pendingInvitations,
      Declined: declinedInvitations
    };

    const recentGuests = allGuests.slice(0, 5);

    return {
      totalGuests,
      confirmedGuests,
      pendingGuests: pendingInvitations,
      pendingInvitations,
      declinedInvitations,
      assignedGuests,
      unassignedGuests,
      arrivedGuests,
      categoryBreakdown,
      invitationBreakdown,
      recentGuests
    };
  }

  getProgrammeGuests({
    query = '',
    category = 'all',
    invitationStatus = 'all',
    assignmentStatus = 'all',
    sortBy = 'name',
    includeArchived = false,
    includePrivate = true
  } = {}) {
    let list = (this.data.programmeGuests || []).filter(g => includeArchived ? true : !g.isArchived);

    // Enrich with full programme objects
    list = list.map(g => {
      const assignedIds = Array.isArray(g.assignedProgrammeIds) ? g.assignedProgrammeIds : [];
      const assignedProgs = assignedIds.map(pid =>
        (this.data.programmes || []).find(p => p.id === pid || p.code === pid)
      ).filter(Boolean);

      const guestCopy = {
        ...g,
        assignedProgrammes: assignedProgs,
        assignedProgrammeCount: assignedProgs.length
      };

      if (!includePrivate) {
        delete guestCopy.contactPhone;
        delete guestCopy.contactEmail;
        delete guestCopy.specialNotes;
      }

      return guestCopy;
    });

    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(g =>
        (g.name && g.name.toLowerCase().includes(q)) ||
        (g.designation && g.designation.toLowerCase().includes(q)) ||
        (g.organization && g.organization.toLowerCase().includes(q)) ||
        (g.category && g.category.toLowerCase().includes(q)) ||
        (g.sessionTitle && g.sessionTitle.toLowerCase().includes(q)) ||
        (g.contactPhone && g.contactPhone.toLowerCase().includes(q)) ||
        (g.contactEmail && g.contactEmail.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'all') {
      const catNorm = category.toLowerCase();
      const codeOnly = category.replace('GCAT-', '').toUpperCase();
      list = list.filter(g =>
        (g.category && g.category.toLowerCase() === catNorm) ||
        (g.categoryCode && g.categoryCode.toUpperCase() === codeOnly) ||
        g.category === category ||
        g.categoryCode === category
      );
    }

    if (invitationStatus && invitationStatus !== 'all') {
      list = list.filter(g => g.invitationStatus === invitationStatus);
    }

    if (assignmentStatus && assignmentStatus !== 'all') {
      if (assignmentStatus === 'assigned') {
        list = list.filter(g => g.assignedProgrammeCount > 0);
      } else if (assignmentStatus === 'unassigned') {
        list = list.filter(g => g.assignedProgrammeCount === 0);
      }
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'designation') return (a.designation || '').localeCompare(b.designation || '');
      if (sortBy === 'organization') return (a.organization || '').localeCompare(b.organization || '');
      if (sortBy === 'status') return (a.invitationStatus || '').localeCompare(b.invitationStatus || '');
      return (a.id || '').localeCompare(b.id || '');
    });

    return list;
  }

  getProgrammeGuestById(id, { includePrivate = true } = {}) {
    const list = this.getProgrammeGuests({ includeArchived: true, includePrivate });
    return list.find(g => g.id === id);
  }

  addProgrammeGuest(guestData) {
    if (!guestData.name || !guestData.name.trim()) {
      throw new Error('Guest full name is mandatory.');
    }
    if (!guestData.designation || !guestData.designation.trim()) {
      throw new Error('Guest designation/position is required.');
    }

    const name = guestData.name.trim();
    const existing = (this.data.programmeGuests || []).find(
      g => g.name.toLowerCase() === name.toLowerCase() && !g.isArchived
    );
    if (existing) {
      throw new Error(`A guest profile for "${name}" already exists (${existing.id}).`);
    }

    const nextNum = (this.data.programmeGuests ? this.data.programmeGuests.length : 0) + 1;
    const newId = `GST-${nextNum.toString().padStart(2, '0')}`;
    const assignedProgrammeIds = Array.isArray(guestData.assignedProgrammeIds)
      ? Array.from(new Set(guestData.assignedProgrammeIds))
      : [];

    const newGuest = {
      id: newId,
      name,
      malayalamName: guestData.malayalamName ? guestData.malayalamName.trim() : '',
      designation: guestData.designation.trim(),
      organization: guestData.organization ? guestData.organization.trim() : 'Dars Academic Council',
      category: guestData.category || 'Special Guest',
      categoryCode: guestData.categoryCode || 'SPC',
      shortBio: guestData.shortBio ? guestData.shortBio.trim() : '',
      bio: guestData.bio ? guestData.bio.trim() : (guestData.shortBio || ''),
      photoUrl: guestData.photoUrl || '/assets/guests/portrait_muhammed_rashid.png',
      assignedProgrammeIds,
      sessionTitle: guestData.sessionTitle ? guestData.sessionTitle.trim() : '',
      invitationStatus: guestData.invitationStatus || 'Invitation Pending',
      participationStatus: guestData.participationStatus || 'Arrival Pending',
      arrivalDate: guestData.arrivalDate || 'Dec 21, 2026',
      arrivalTime: guestData.arrivalTime || '10:00 AM',
      contactPhone: guestData.contactPhone ? guestData.contactPhone.trim() : '',
      contactEmail: guestData.contactEmail ? guestData.contactEmail.trim().toLowerCase() : '',
      specialNotes: guestData.specialNotes ? guestData.specialNotes.trim() : '',
      credentials: Array.isArray(guestData.credentials) ? guestData.credentials : [],
      isPublished: guestData.isPublished !== undefined ? Boolean(guestData.isPublished) : true,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!this.data.programmeGuests) this.data.programmeGuests = [];
    this.data.programmeGuests.unshift(newGuest);

    // Bi-directionally synchronize with assigned programmes
    assignedProgrammeIds.forEach(pid => {
      const prog = (this.data.programmes || []).find(p => p.id === pid || p.code === pid);
      if (prog) {
        if (!Array.isArray(prog.assignedGuestIds)) {
          prog.assignedGuestIds = prog.guestId ? [prog.guestId] : [];
        }
        if (!prog.assignedGuestIds.includes(newGuest.id)) {
          prog.assignedGuestIds.push(newGuest.id);
        }
        if (!prog.guestId) {
          prog.guestId = newGuest.id;
          prog.guestName = newGuest.name;
        }
      }
    });

    this.addAuditLog('GUEST_CREATED', `Created guest profile for ${newGuest.name} (${newGuest.id}) - ${newGuest.designation}`);
    this.saveData();
    return { success: true, guest: newGuest };
  }

  updateProgrammeGuest(id, updateData) {
    const guest = (this.data.programmeGuests || []).find(g => g.id === id);
    if (!guest) throw new Error('Guest profile not found.');

    if (updateData.name && updateData.name.trim()) guest.name = updateData.name.trim();
    if (updateData.malayalamName !== undefined) guest.malayalamName = updateData.malayalamName.trim();
    if (updateData.designation && updateData.designation.trim()) guest.designation = updateData.designation.trim();
    if (updateData.organization !== undefined) guest.organization = updateData.organization.trim();
    if (updateData.category) {
      guest.category = updateData.category;
      guest.categoryCode = updateData.categoryCode || updateData.category.substring(0, 3).toUpperCase();
    }
    if (updateData.shortBio !== undefined) guest.shortBio = updateData.shortBio.trim();
    if (updateData.bio !== undefined) guest.bio = updateData.bio.trim();
    if (updateData.photoUrl) guest.photoUrl = updateData.photoUrl;
    if (updateData.sessionTitle !== undefined) guest.sessionTitle = updateData.sessionTitle.trim();
    if (updateData.invitationStatus) guest.invitationStatus = updateData.invitationStatus;
    if (updateData.participationStatus) guest.participationStatus = updateData.participationStatus;
    if (updateData.arrivalDate) guest.arrivalDate = updateData.arrivalDate;
    if (updateData.arrivalTime) guest.arrivalTime = updateData.arrivalTime;
    if (updateData.contactPhone !== undefined) guest.contactPhone = updateData.contactPhone.trim();
    if (updateData.contactEmail !== undefined) guest.contactEmail = updateData.contactEmail.trim().toLowerCase();
    if (updateData.specialNotes !== undefined) guest.specialNotes = updateData.specialNotes.trim();
    if (updateData.credentials) guest.credentials = updateData.credentials;
    if (updateData.isPublished !== undefined) guest.isPublished = Boolean(updateData.isPublished);

    // Multi-programme assignment synchronization
    if (Array.isArray(updateData.assignedProgrammeIds)) {
      const oldAssigned = Array.isArray(guest.assignedProgrammeIds) ? guest.assignedProgrammeIds : [];
      const newAssigned = Array.from(new Set(updateData.assignedProgrammeIds));

      // Removed programmes
      const removedPids = oldAssigned.filter(pid => !newAssigned.includes(pid));
      removedPids.forEach(pid => {
        const prog = (this.data.programmes || []).find(p => p.id === pid || p.code === pid);
        if (prog) {
          if (Array.isArray(prog.assignedGuestIds)) {
            prog.assignedGuestIds = prog.assignedGuestIds.filter(gid => gid !== guest.id);
          }
          if (prog.guestId === guest.id) {
            const nextGuestId = (prog.assignedGuestIds && prog.assignedGuestIds.length > 0) ? prog.assignedGuestIds[0] : null;
            prog.guestId = nextGuestId;
            prog.guestName = nextGuestId ? (this.data.programmeGuests?.find(g => g.id === nextGuestId)?.name || null) : null;
          }
        }
      });

      // Added programmes
      const addedPids = newAssigned.filter(pid => !oldAssigned.includes(pid));
      addedPids.forEach(pid => {
        const prog = (this.data.programmes || []).find(p => p.id === pid || p.code === pid);
        if (prog) {
          if (!Array.isArray(prog.assignedGuestIds)) {
            prog.assignedGuestIds = prog.guestId ? [prog.guestId] : [];
          }
          if (!prog.assignedGuestIds.includes(guest.id)) {
            prog.assignedGuestIds.push(guest.id);
          }
          if (!prog.guestId) {
            prog.guestId = guest.id;
            prog.guestName = guest.name;
          }
        }
      });

      guest.assignedProgrammeIds = newAssigned;
    }

    guest.updatedAt = new Date().toISOString();
    this.addAuditLog('GUEST_UPDATED', `Updated guest details for ${guest.name} (${guest.id})`);
    this.saveData();
    return { success: true, guest };
  }

  assignGuestToProgrammes(guestId, programmeIds) {
    return this.updateProgrammeGuest(guestId, { assignedProgrammeIds: programmeIds });
  }

  removeGuestFromProgramme(guestId, programmeId) {
    const guest = (this.data.programmeGuests || []).find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found.');

    const newIds = (guest.assignedProgrammeIds || []).filter(pid => pid !== programmeId);
    return this.updateProgrammeGuest(guestId, { assignedProgrammeIds: newIds });
  }

  updateGuestInvitationStatus(guestId, newStatus, adminUser = 'Super Admin') {
    const valid = ['Invitation Pending', 'Invitation Sent', 'Confirmed', 'Declined'];
    if (!valid.includes(newStatus)) {
      throw new Error(`Invalid invitation status "${newStatus}". Must be one of: ${valid.join(', ')}`);
    }
    const guest = (this.data.programmeGuests || []).find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found.');

    const oldStatus = guest.invitationStatus;
    guest.invitationStatus = newStatus;
    guest.updatedAt = new Date().toISOString();

    this.addAuditLog('GUEST_INVITATION_STATUS_CHANGED', `Changed invitation status of ${guest.name} from ${oldStatus} to ${newStatus} by ${adminUser}`);
    this.saveData();
    return { success: true, guest };
  }

  updateGuestParticipationStatus(guestId, newStatus, adminUser = 'Super Admin') {
    const valid = ['Arrival Pending', 'Arrived on Campus', 'Session Completed', 'Did Not Attend'];
    if (!valid.includes(newStatus)) {
      throw new Error(`Invalid participation status "${newStatus}". Must be one of: ${valid.join(', ')}`);
    }
    const guest = (this.data.programmeGuests || []).find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found.');

    guest.participationStatus = newStatus;
    guest.updatedAt = new Date().toISOString();

    this.addAuditLog('GUEST_PARTICIPATION_STATUS_CHANGED', `Updated participation status of ${guest.name} to ${newStatus} by ${adminUser}`);
    this.saveData();
    return { success: true, guest };
  }

  toggleGuestPublish(guestId) {
    const guest = (this.data.programmeGuests || []).find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found.');

    guest.isPublished = !guest.isPublished;
    guest.updatedAt = new Date().toISOString();

    this.addAuditLog('GUEST_PUBLISH_TOGGLED', `Toggled public visibility for ${guest.name} to ${guest.isPublished ? 'Published' : 'Hidden'}`);
    this.saveData();
    return { success: true, guest };
  }

  archiveGuest(guestId) {
    const guest = (this.data.programmeGuests || []).find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found.');

    guest.isArchived = true;
    guest.updatedAt = new Date().toISOString();

    this.addAuditLog('GUEST_ARCHIVED', `Archived guest profile for ${guest.name} (${guest.id})`);
    this.saveData();
    return { success: true };
  }

  deleteProgrammeGuest(guestId, { force = false } = {}) {
    const guest = (this.data.programmeGuests || []).find(g => g.id === guestId);
    if (!guest) throw new Error('Guest not found.');

    // Remove guest associations from programmes
    (this.data.programmes || []).forEach(prog => {
      if (Array.isArray(prog.assignedGuestIds)) {
        prog.assignedGuestIds = prog.assignedGuestIds.filter(gid => gid !== guestId);
      }
      if (prog.guestId === guestId) {
        prog.guestId = null;
        prog.guestName = null;
      }
    });

    this.data.programmeGuests = this.data.programmeGuests.filter(g => g.id !== guestId);
    this.addAuditLog('GUEST_DELETED', `Deleted guest profile for ${guest.name} (${guest.id})`);
    this.saveData();
    return { success: true };
  }

  getPublicGuests() {
    return this.getProgrammeGuests({ includeArchived: false, includePrivate: false }).filter(g => g.isPublished);
  }

  getProgrammeGuestsList() {
    return (this.data.programmeGuests || []).filter(g => !g.isArchived);
  }

  getAvailableCompetitionsForProgramme() {
    return this.data.programmeAssignments || [];
  }

  // =========================================================================
  // PROGRAMME SCHEDULE MANAGEMENT (STEP 08 - PROGRAMME SCHEDULE)
  // =========================================================================

  _parseTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const str = String(timeStr).trim();
    const match = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = (match[3] || '').toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  getProgrammeStages() {
    return this.data.programmeStages || [];
  }

  detectScheduleConflicts(candidate, excludeScheduleId = null) {
    const conflicts = [];
    const {
      programmeId,
      date,
      startTime,
      endTime,
      stage,
      assignedGuestIds = []
    } = candidate;

    // 1. Time Range Validation
    const startMin = this._parseTimeToMinutes(startTime);
    const endMin = this._parseTimeToMinutes(endTime);

    if (startMin === null || endMin === null) {
      conflicts.push({
        type: 'INVALID_TIME_RANGE',
        severity: 'error',
        message: 'Both Start Time and End Time must be valid (e.g., "09:00 AM", "11:00 AM").'
      });
    } else if (endMin <= startMin) {
      conflicts.push({
        type: 'INVALID_TIME_RANGE',
        severity: 'error',
        message: `Session end time (${endTime}) must be strictly later than start time (${startTime}).`
      });
    }

    // 2. Festival Date Restriction (21, 22, 23 DECEMBER 2026)
    const validDates = ['Dec 21, 2026', 'Dec 22, 2026', 'Dec 23, 2026', 'December 21, 2026', 'December 22, 2026', 'December 23, 2026', '2026-12-21', '2026-12-22', '2026-12-23', '21, 22, 23 DECEMBER 2026'];
    if (!date || !validDates.includes(String(date).trim())) {
      conflicts.push({
        type: 'OUTSIDE_FESTIVAL_DATES',
        severity: 'error',
        message: `Selected date "${date}" is outside official festival dates (21, 22, 23 DECEMBER 2026).`
      });
    }

    if (startMin === null || endMin === null || endMin <= startMin) {
      return {
        hasConflicts: conflicts.length > 0,
        hasErrors: conflicts.some(c => c.severity === 'error'),
        conflicts
      };
    }

    const activeSchedules = (this.data.programmeSchedules || []).filter(s =>
      !s.isArchived && s.status !== 'Cancelled' && s.id !== excludeScheduleId
    );

    const candidateDateNorm = String(date).includes('21') ? 'Dec 21, 2026' : 'Dec 22, 2026';

    const normStage = (s) => String(s || '').toLowerCase().replace(/\s*\(stage\s*\d+\)/i, '').trim();

    activeSchedules.forEach(existing => {
      const existingDateNorm = String(existing.date || '').includes('21') ? 'Dec 21, 2026' : 'Dec 22, 2026';
      if (existingDateNorm !== candidateDateNorm) return;

      const existStart = this._parseTimeToMinutes(existing.startTime);
      const existEnd = this._parseTimeToMinutes(existing.endTime);
      if (existStart === null || existEnd === null) return;

      // Interval overlap check: Math.max(start1, start2) < Math.min(end1, end2)
      const isOverlapping = Math.max(startMin, existStart) < Math.min(endMin, existEnd);
      if (!isOverlapping) return;

      // 3. Stage / Venue Overlap Conflict
      if (stage && existing.stage && normStage(stage) === normStage(existing.stage)) {
        conflicts.push({
          type: 'STAGE_OVERLAP',
          severity: 'error',
          message: `Stage conflict: "${existing.stage}" is already booked by "${existing.programmeTitle}" (${existing.timeRange || existing.startTime + ' – ' + existing.endTime}).`,
          conflictingEntryId: existing.id,
          conflictingTitle: existing.programmeTitle,
          stage: existing.stage
        });
      }

      // 4. Guest Double-Booking Overlap Conflict
      const existingGuests = Array.isArray(existing.assignedGuestIds) ? existing.assignedGuestIds : [];
      const candidateGuests = Array.isArray(assignedGuestIds) ? assignedGuestIds : [];

      candidateGuests.forEach(gid => {
        if (existingGuests.includes(gid)) {
          const guestObj = (this.data.programmeGuests || []).find(g => g.id === gid);
          const guestName = guestObj ? guestObj.name : gid;
          conflicts.push({
            type: 'GUEST_OVERLAP',
            severity: 'error',
            message: `Guest clash: ${guestName} is simultaneously committed to "${existing.programmeTitle}" at ${existing.stage} during ${existing.timeRange || existing.startTime}.`,
            conflictingEntryId: existing.id,
            guestId: gid,
            guestName
          });
        }
      });

      // 5. Duplicate Programme Session Conflict
      if (programmeId && existing.programmeId === programmeId) {
        conflicts.push({
          type: 'DUPLICATE_SESSION',
          severity: 'warning',
          message: `Duplicate session: Programme "${existing.programmeTitle}" already has an active schedule slot (${existing.id}) in this time window.`,
          conflictingEntryId: existing.id
        });
      }
    });

    return {
      hasConflicts: conflicts.length > 0,
      hasErrors: conflicts.some(c => c.severity === 'error'),
      conflicts
    };
  }

  getProgrammeSchedules({
    date = 'all',
    stage = 'all',
    category = 'all',
    guestId = 'all',
    status = 'all',
    query = '',
    sortBy = 'time',
    includeArchived = false,
    includePrivate = true
  } = {}) {
    let list = (this.data.programmeSchedules || []).filter(s => includeArchived ? true : !s.isArchived);

    // Enrich each schedule entry
    list = list.map(s => {
      const prog = (this.data.programmes || []).find(p => p.id === s.programmeId || p.code === s.programmeCode);
      const assignedIds = Array.isArray(s.assignedGuestIds) ? s.assignedGuestIds : [];
      const guests = assignedIds.map(gid =>
        (this.data.programmeGuests || []).find(g => g.id === gid)
      ).filter(Boolean);

      const stageInfo = (this.data.programmeStages || []).find(st =>
        st.name === s.stage || st.id === s.stageId || st.code === s.stageId
      );

      const enriched = {
        ...s,
        programmeTitle: s.programmeTitle || (prog ? prog.title : 'Festival Session'),
        malayalamTitle: prog ? prog.malayalamTitle : '',
        category: prog ? prog.category : 'General Conclave',
        categoryCode: prog ? prog.categoryCode : 'GEN',
        desc: prog ? prog.desc : '',
        icon: prog ? prog.icon : 'calendar',
        posterUrl: prog ? prog.posterUrl : '/assets/dalenzia_fest_logo.png',
        guests,
        guestCount: guests.length,
        stageInfo: stageInfo || { name: s.stage, color: '#A91F35' }
      };

      if (!includePrivate) {
        delete enriched.notes;
      }

      return enriched;
    });

    // Query filter
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(s =>
        (s.programmeTitle && s.programmeTitle.toLowerCase().includes(q)) ||
        (s.programmeCode && s.programmeCode.toLowerCase().includes(q)) ||
        (s.stage && s.stage.toLowerCase().includes(q)) ||
        (s.coordinatorName && s.coordinatorName.toLowerCase().includes(q)) ||
        (s.notes && s.notes.toLowerCase().includes(q)) ||
        (s.guests && s.guests.some(g => g.name && g.name.toLowerCase().includes(q)))
      );
    }

    // Date filter
    if (date && date !== 'all') {
      if (date === 'day1' || date.includes('21')) {
        list = list.filter(s => String(s.date).includes('21'));
      } else if (date === 'day2' || date.includes('22')) {
        list = list.filter(s => String(s.date).includes('22'));
      } else {
        list = list.filter(s => s.date === date);
      }
    }

    // Stage filter
    if (stage && stage !== 'all') {
      const norm = (str) => String(str || '').toLowerCase().replace(/\s*\(stage\s*\d+\)/i, '').trim();
      const targetNorm = norm(stage);
      list = list.filter(s => norm(s.stage) === targetNorm || s.stageId === stage);
    }

    // Category filter
    if (category && category !== 'all') {
      list = list.filter(s =>
        s.category === category ||
        s.categoryCode === category ||
        (s.category && s.category.toLowerCase() === category.toLowerCase())
      );
    }

    // Guest filter
    if (guestId && guestId !== 'all') {
      list = list.filter(s => Array.isArray(s.assignedGuestIds) && s.assignedGuestIds.includes(guestId));
    }

    // Status filter
    if (status && status !== 'all') {
      list = list.filter(s => s.status === status);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'time') {
        const dateOrder = (String(a.date).includes('21') ? 1 : 2) - (String(b.date).includes('21') ? 1 : 2);
        if (dateOrder !== 0) return dateOrder;
        const startA = this._parseTimeToMinutes(a.startTime) || 0;
        const startB = this._parseTimeToMinutes(b.startTime) || 0;
        return startA - startB;
      }
      if (sortBy === 'name') {
        return (a.programmeTitle || '').localeCompare(b.programmeTitle || '');
      }
      if (sortBy === 'stage') {
        return (a.stage || '').localeCompare(b.stage || '');
      }
      return (a.id || '').localeCompare(b.id || '');
    });

    return list;
  }

  getProgrammeScheduleById(id, { includePrivate = true } = {}) {
    const list = this.getProgrammeSchedules({ includeArchived: true, includePrivate });
    return list.find(s => s.id === id) || null;
  }

  getScheduleDashboardStats() {
    const all = (this.data.programmeSchedules || []).filter(s => !s.isArchived);
    const totalScheduledSessions = all.length;
    const todayProgrammes = all.filter(s => String(s.date).includes('21') && s.status !== 'Cancelled').length;
    const day2Programmes = all.filter(s => String(s.date).includes('22') && s.status !== 'Cancelled').length;
    const upcomingProgrammes = all.filter(s => s.status === 'Scheduled' || s.status === 'Upcoming').length;
    const ongoingProgrammes = all.filter(s => s.status === 'Ongoing').length;
    const completedProgrammes = all.filter(s => s.status === 'Completed').length;
    const cancelledProgrammes = all.filter(s => s.status === 'Cancelled').length;

    // Unscheduled programmes in registry
    const scheduledProgIds = new Set(all.filter(s => s.status !== 'Cancelled').map(s => s.programmeId));
    const allProgrammes = (this.data.programmes || []).filter(p => !p.isArchived);
    const unscheduledProgrammes = allProgrammes.filter(p => !scheduledProgIds.has(p.id)).length;

    // Conflicting entries
    let conflictingCount = 0;
    all.forEach(s => {
      const check = this.detectScheduleConflicts(s, s.id);
      if (check.hasErrors) conflictingCount++;
    });

    // Stage distribution
    const stages = this.getProgrammeStages();
    const norm = (str) => String(str || '').toLowerCase().replace(/\s*\(stage\s*\d+\)/i, '').trim();
    const stageDistribution = stages.map(st => ({
      ...st,
      sessionCount: all.filter(s => norm(s.stage) === norm(st.name) && s.status !== 'Cancelled').length
    }));

    return {
      totalScheduledSessions,
      todayProgrammes,
      day2Programmes,
      upcomingProgrammes,
      ongoingProgrammes,
      completedProgrammes,
      cancelledProgrammes,
      unscheduledProgrammes,
      conflictingScheduleEntries: conflictingCount,
      stageDistribution,
      totalFestivalDays: 2
    };
  }

  addProgrammeSchedule(scheduleData, { overrideConflicts = false, adminUser = 'Super Admin' } = {}) {
    if (!scheduleData.programmeId) {
      throw new Error('Please select an existing programme from Programme Management.');
    }
    const prog = (this.data.programmes || []).find(p => p.id === scheduleData.programmeId || p.code === scheduleData.programmeId);
    if (!prog) {
      throw new Error(`Selected programme "${scheduleData.programmeId}" does not exist in Programme Management.`);
    }

    if (!scheduleData.date) throw new Error('Programme Date is required.');
    if (!scheduleData.startTime) throw new Error('Start Time is required.');
    if (!scheduleData.endTime) throw new Error('End Time is required.');
    if (!scheduleData.stage) throw new Error('Stage / Venue selection is required.');

    // Conflict detection
    const conflictCheck = this.detectScheduleConflicts(scheduleData);
    if (conflictCheck.hasErrors && !overrideConflicts) {
      const errorMsgs = conflictCheck.conflicts.filter(c => c.severity === 'error').map(c => c.message).join(' | ');
      throw new Error(`Schedule Conflict Detected: ${errorMsgs}`);
    }

    const nextNum = (this.data.programmeSchedules ? this.data.programmeSchedules.length : 0) + 1;
    const newId = `SCH-${nextNum.toString().padStart(2, '0')}`;

    const assignedGuestIds = Array.isArray(scheduleData.assignedGuestIds)
      ? Array.from(new Set(scheduleData.assignedGuestIds))
      : (prog.assignedGuestIds || (prog.guestId ? [prog.guestId] : []));

    const startTime = scheduleData.startTime.trim();
    const endTime = scheduleData.endTime.trim();
    const timeRange = scheduleData.timeRange || `${startTime} – ${endTime}`;

    const newSchedule = {
      id: newId,
      programmeId: prog.id,
      programmeCode: prog.code,
      programmeTitle: prog.title,
      date: scheduleData.date.trim(),
      startTime,
      endTime,
      timeRange,
      stage: scheduleData.stage.trim(),
      stageId: scheduleData.stageId || 'STG-01',
      coordinatorName: scheduleData.coordinatorName ? scheduleData.coordinatorName.trim() : (prog.coordinatorName || ''),
      coordinatorPhone: scheduleData.coordinatorPhone ? scheduleData.coordinatorPhone.trim() : (prog.coordinatorPhone || ''),
      assignedGuestIds,
      notes: scheduleData.notes ? scheduleData.notes.trim() : '',
      status: scheduleData.status || 'Scheduled',
      isPublished: scheduleData.isPublished !== undefined ? Boolean(scheduleData.isPublished) : true,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!this.data.programmeSchedules) this.data.programmeSchedules = [];
    this.data.programmeSchedules.push(newSchedule);

    // Bi-directionally sync schedule details to parent programme
    prog.date = newSchedule.date;
    prog.time = newSchedule.timeRange;
    prog.startTime = newSchedule.startTime;
    prog.endTime = newSchedule.endTime;
    prog.venue = newSchedule.stage;
    prog.assignedGuestIds = assignedGuestIds;
    prog.status = newSchedule.status;
    prog.updatedAt = new Date().toISOString();

    // Bi-directionally sync with guests
    assignedGuestIds.forEach(gid => {
      const guest = (this.data.programmeGuests || []).find(g => g.id === gid);
      if (guest) {
        if (!Array.isArray(guest.assignedProgrammeIds)) guest.assignedProgrammeIds = [];
        if (!guest.assignedProgrammeIds.includes(prog.id)) {
          guest.assignedProgrammeIds.push(prog.id);
        }
      }
    });

    this.addAuditLog('SCHEDULE_ENTRY_CREATED', `Scheduled session for ${prog.title} at ${newSchedule.stage} on ${newSchedule.date} by ${adminUser}`);
    this.saveData();
    return { success: true, schedule: newSchedule, conflicts: conflictCheck.conflicts };
  }

  updateProgrammeSchedule(id, updateData, { overrideConflicts = false, adminUser = 'Super Admin' } = {}) {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    const candidate = { ...schedule, ...updateData };

    const conflictCheck = this.detectScheduleConflicts(candidate, id);
    if (conflictCheck.hasErrors && !overrideConflicts) {
      const errorMsgs = conflictCheck.conflicts.filter(c => c.severity === 'error').map(c => c.message).join(' | ');
      throw new Error(`Schedule Conflict Detected: ${errorMsgs}`);
    }

    if (updateData.date) schedule.date = updateData.date.trim();
    if (updateData.startTime) schedule.startTime = updateData.startTime.trim();
    if (updateData.endTime) schedule.endTime = updateData.endTime.trim();
    if (updateData.startTime || updateData.endTime) {
      schedule.timeRange = `${schedule.startTime} – ${schedule.endTime}`;
    }
    if (updateData.stage) schedule.stage = updateData.stage.trim();
    if (updateData.stageId) schedule.stageId = updateData.stageId.trim();
    if (updateData.coordinatorName !== undefined) schedule.coordinatorName = updateData.coordinatorName.trim();
    if (updateData.coordinatorPhone !== undefined) schedule.coordinatorPhone = updateData.coordinatorPhone.trim();
    if (updateData.notes !== undefined) schedule.notes = updateData.notes.trim();
    if (updateData.status) schedule.status = updateData.status;
    if (updateData.isPublished !== undefined) schedule.isPublished = Boolean(updateData.isPublished);

    if (Array.isArray(updateData.assignedGuestIds)) {
      schedule.assignedGuestIds = Array.from(new Set(updateData.assignedGuestIds));
    }

    schedule.updatedAt = new Date().toISOString();

    // Bi-directionally sync to parent programme
    const prog = (this.data.programmes || []).find(p => p.id === schedule.programmeId);
    if (prog) {
      prog.date = schedule.date;
      prog.time = schedule.timeRange;
      prog.startTime = schedule.startTime;
      prog.endTime = schedule.endTime;
      prog.venue = schedule.stage;
      prog.status = schedule.status;
      if (schedule.assignedGuestIds) prog.assignedGuestIds = schedule.assignedGuestIds;
      prog.updatedAt = new Date().toISOString();
    }

    this.addAuditLog('SCHEDULE_ENTRY_UPDATED', `Updated schedule for ${schedule.programmeTitle} (${schedule.id}) by ${adminUser}`);
    this.saveData();
    return { success: true, schedule, conflicts: conflictCheck.conflicts };
  }

  completeProgrammeSchedule(id, adminUser = 'Super Admin') {
    return this.updateProgrammeSchedule(id, { status: 'Completed' }, { overrideConflicts: true, adminUser });
  }

  cancelProgrammeSchedule(id, reason = '', adminUser = 'Super Admin') {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    schedule.status = 'Cancelled';
    schedule.cancellationReason = reason || 'Session cancelled by festival secretariat.';
    schedule.updatedAt = new Date().toISOString();

    const prog = (this.data.programmes || []).find(p => p.id === schedule.programmeId);
    if (prog) {
      prog.status = 'Cancelled';
      prog.updatedAt = new Date().toISOString();
    }

    this.addAuditLog('SCHEDULE_ENTRY_CANCELLED', `Cancelled schedule for ${schedule.programmeTitle} (${schedule.id}): ${reason} by ${adminUser}`);
    this.saveData();
    return { success: true, schedule };
  }

  rescheduleProgramme(id, { newDate, newStartTime, newEndTime, newVenue, reason }, { overrideConflicts = false, adminUser = 'Super Admin' } = {}) {
    const updatePayload = {
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      stage: newVenue,
      status: 'Rescheduled',
      notes: reason ? `Rescheduled: ${reason}` : 'Rescheduled session.'
    };
    return this.updateProgrammeSchedule(id, updatePayload, { overrideConflicts, adminUser });
  }

  archiveProgrammeSchedule(id, adminUser = 'Super Admin') {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    schedule.isArchived = true;
    schedule.updatedAt = new Date().toISOString();

    this.addAuditLog('SCHEDULE_ENTRY_ARCHIVED', `Archived schedule entry for ${schedule.programmeTitle} (${schedule.id}) by ${adminUser}`);
    this.saveData();
    return { success: true };
  }

  deleteProgrammeSchedule(id, { force = false, adminUser = 'Super Admin' } = {}) {
    const schedule = (this.data.programmeSchedules || []).find(s => s.id === id);
    if (!schedule) throw new Error('Schedule entry not found.');

    this.data.programmeSchedules = (this.data.programmeSchedules || []).filter(s => s.id !== id);
    this.addAuditLog('SCHEDULE_ENTRY_DELETED', `Deleted schedule entry ${id} by ${adminUser}`);
    this.saveData();
    return { success: true };
  }

  getPublicProgrammeSchedule({ date = null } = {}) {
    let list = this.getProgrammeSchedules({
      includeArchived: false,
      includePrivate: false
    }).filter(s => s.isPublished && s.status !== 'Cancelled');

    if (date) {
      if (date === 'day1' || date.includes('21')) {
        list = list.filter(s => String(s.date).includes('21'));
      } else if (date === 'day2' || date.includes('22')) {
        list = list.filter(s => String(s.date).includes('22'));
      } else {
        list = list.filter(s => s.date === date);
      }
    }

    return list;
  }

  addStudentToTeam({ teamId, studentId, competitionCategory }) {
    const team = this.data.teams.find(t => t.id === teamId);
    if (!team) throw new Error('Selected team was not found.');

    const student = this.data.registeredStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Selected student was not found in registry.');

    if (team.students.some(s => s.id === studentId)) {
      throw new Error(`Student ${student.name} (${student.chestNo}) is already a registered member of ${team.name}.`);
    }

    const newAssignment = {
      id: student.id,
      chestNo: student.chestNo,
      name: student.name,
      category: student.classCategory,
      compCategory: competitionCategory || 'Literary Arena',
      events: []
    };

    team.students.push(newAssignment);
    team.members = team.students.length;
    student.teamId = team.id;
    student.teamName = team.name;

    this.saveData();
    return { success: true, team, student: newAssignment };
  }

  // =========================================================================
  // STUDENT MANAGEMENT METHODS & REAL-TIME CRUD (Step 03 - Complete Functional Development)
  // =========================================================================

  getStudentStats() {
    const students = this.data.registeredStudents || [];
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status !== 'Inactive').length;
    const inactiveStudents = students.filter(s => s.status === 'Inactive').length;
    const assignedStudents = students.filter(s => s.teamId && s.teamId !== 'Unassigned').length;
    const unassignedStudents = students.filter(s => !s.teamId || s.teamId === 'Unassigned').length;

    // Count competition registrations across all programmes
    let competitionRegistrations = 0;
    (this.data.programmeAssignments || []).forEach(prog => {
      if (Array.isArray(prog.participants)) {
        competitionRegistrations += prog.participants.length;
      }
    });

    // Count pending participants or registrations
    const pendingRegistrations = unassignedStudents;

    // Official 4 Categories: Senior, Junior, Sub Junior, Minor
    const categoryBreakdown = {
      Senior: students.filter(s => (s.classCategory || '').toLowerCase() === 'senior').length,
      Junior: students.filter(s => (s.classCategory || '').toLowerCase() === 'junior').length,
      SubJunior: students.filter(s => {
        const cat = (s.classCategory || '').toLowerCase().replace(/[\s-_]/g, '');
        return cat === 'subjunior';
      }).length,
      Minor: students.filter(s => (s.classCategory || '').toLowerCase() === 'minor').length,
    };

    // Team-wise distribution
    const teams = this.getTeams();
    const teamDistribution = teams.map(t => {
      const teamStudentCount = students.filter(s => s.teamId === t.id).length;
      return {
        teamId: t.id,
        teamName: t.name,
        color: t.color,
        code: t.code,
        count: teamStudentCount,
        leader: t.leader
      };
    });

    return {
      totalStudents,
      seniorCount: categoryBreakdown.Senior,
      juniorCount: categoryBreakdown.Junior,
      subJuniorCount: categoryBreakdown.SubJunior,
      minorCount: categoryBreakdown.Minor,
      activeStudents,
      inactiveStudents,
      assignedStudents,
      unassignedStudents,
      competitionRegistrations,
      pendingRegistrations,
      categoryBreakdown,
      teamDistribution
    };
  }

  getStudents({
    query = '',
    team = 'all',
    category = 'all',
    status = 'all',
    sortBy = 'name',
    sortOrder = 'asc'
  } = {}) {
    let list = (this.data.registeredStudents || []).map(s => {
      // Normalize defaults
      const normalized = {
        id: s.id,
        chestNo: s.chestNo,
        name: s.name,
        classCategory: s.classCategory || 'General',
        teamId: s.teamId || null,
        teamName: s.teamName || (s.teamId ? (this.data.teams.find(t => t.id === s.teamId)?.name || 'Team') : 'Unassigned'),
        dob: s.dob || '2007-01-01',
        institution: s.institution || 'Dalailussunna Dars, Ayiroor',
        phone: s.phone || '+91 98471 00000',
        email: s.email || `${(s.name || 'student').toLowerCase().replace(/[^a-z0-9]/g, '')}@dalanzia.org`,
        status: s.status || 'Active',
        gender: s.gender || 'Male',
        registeredAt: s.registeredAt || '2026-11-01'
      };

      // Calculate registered events and prizes
      const events = (this.data.programmeAssignments || []).filter(p =>
        Array.isArray(p.participants) && p.participants.some(pt => pt.studentId === s.id || pt.chestNo === s.chestNo)
      );

      const prizes = (this.data.resultPosters || []).filter(pos =>
        (pos.firstPrize && (pos.firstPrize.chestNo === s.chestNo || pos.firstPrize.studentId === s.id)) ||
        (pos.secondPrize && (pos.secondPrize.chestNo === s.chestNo || pos.secondPrize.studentId === s.id)) ||
        (pos.thirdPrize && (pos.thirdPrize.chestNo === s.chestNo || pos.thirdPrize.studentId === s.id))
      );

      let totalPoints = 0;
      prizes.forEach(pos => {
        if (pos.firstPrize && (pos.firstPrize.chestNo === s.chestNo || pos.firstPrize.studentId === s.id)) totalPoints += (pos.firstPrize.points || 0);
        if (pos.secondPrize && (pos.secondPrize.chestNo === s.chestNo || pos.secondPrize.studentId === s.id)) totalPoints += (pos.secondPrize.points || 0);
        if (pos.thirdPrize && (pos.thirdPrize.chestNo === s.chestNo || pos.thirdPrize.studentId === s.id)) totalPoints += (pos.thirdPrize.points || 0);
      });

      return {
        ...normalized,
        registeredEventsCount: events.length,
        prizesCount: prizes.length,
        totalPoints
      };
    });

    // Apply search filter
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.chestNo.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.teamName.toLowerCase().includes(q)
      );
    }

    // Apply team filter
    if (team && team !== 'all') {
      if (team === 'unassigned') {
        list = list.filter(s => !s.teamId || s.teamId === 'Unassigned');
      } else {
        list = list.filter(s => s.teamId === team);
      }
    }

    // Apply category filter
    if (category && category !== 'all') {
      const targetCat = category.toLowerCase().replace(/[\s-_]/g, '');
      list = list.filter(s => (s.classCategory || '').toLowerCase().replace(/[\s-_]/g, '') === targetCat);
    }

    // Apply status filter
    if (status && status !== 'all') {
      list = list.filter(s => s.status.toLowerCase() === status.toLowerCase());
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
      if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });

    return list;
  }

  getStudentById(id) {
    const student = this.data.registeredStudents.find(s => s.id === id || s.chestNo === id);
    if (!student) return null;

    const team = student.teamId ? this.data.teams.find(t => t.id === student.teamId) : null;

    // Get all competitions this student is enrolled in
    const competitions = (this.data.programmeAssignments || []).filter(p =>
      Array.isArray(p.participants) && p.participants.some(pt => pt.studentId === student.id || pt.chestNo === student.chestNo)
    ).map(p => {
      const ptInfo = p.participants.find(pt => pt.studentId === student.id || pt.chestNo === student.chestNo);
      return {
        id: p.id,
        competitionId: p.competitionId,
        competitionCode: p.competitionCode,
        competitionTitle: p.competitionTitle,
        category: p.category,
        venue: p.venue,
        date: p.date,
        time: p.time,
        status: p.status,
        isPublished: p.isPublished,
        registeredChestNo: ptInfo?.chestNo || student.chestNo
      };
    });

    // Get all results / awards
    const results = [];
    (this.data.resultPosters || []).forEach(pos => {
      const checkPrize = (prize, rankLabel) => {
        if (!prize) return;
        if (prize.studentId === student.id || prize.chestNo === student.chestNo || prize.name === student.name) {
          results.push({
            posterId: pos.id,
            competitionCode: pos.competitionCode,
            competitionTitle: pos.competitionTitle,
            category: pos.category,
            rank: rankLabel,
            score: prize.score,
            points: prize.points,
            publishedAt: pos.publishedAt
          });
        }
      };
      checkPrize(pos.firstPrize, '1st Place (Gold)');
      checkPrize(pos.secondPrize, '2nd Place (Silver)');
      checkPrize(pos.thirdPrize, '3rd Place (Bronze)');
    });

    const totalPointsWon = results.reduce((acc, r) => acc + (r.points || 0), 0);

    return {
      ...student,
      team,
      competitions,
      results,
      totalPointsWon
    };
  }

  normalizeClassCategory(category) {
    if (!category) return 'Senior';
    const c = category.toString().trim().toLowerCase().replace(/[\s-_]/g, '');
    if (c === 'senior') return 'Senior';
    if (c === 'junior') return 'Junior';
    if (c === 'subjunior') return 'Sub Junior';
    if (c === 'minor') return 'Minor';
    return 'Senior';
  }

  generateStudentEmail(name, excludeStudentId = null) {
    if (!name || !name.trim()) return '';
    let clean = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '.');
    if (!clean) clean = 'student';

    let candidate = `${clean}@dalanzia.org`;
    const existingEmails = new Set(
      (this.data.registeredStudents || [])
        .filter(s => s.id !== excludeStudentId && s.email)
        .map(s => s.email.toLowerCase())
    );

    if (!existingEmails.has(candidate.toLowerCase())) {
      return candidate;
    }

    let suffix = 2;
    while (existingEmails.has(`${clean}.${suffix}@dalanzia.org`)) {
      suffix++;
    }
    return `${clean}.${suffix}@dalanzia.org`;
  }

  generateChestNumber() {
    let maxChestNum = 100;
    (this.data.registeredStudents || []).forEach(s => {
      const match = (s.chestNo || '').match(/C-(\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n >= maxChestNum) maxChestNum = n;
      }
    });
    let nextCandidate = maxChestNum + 1;
    let autoChest = `C-${nextCandidate}`;
    const existing = new Set((this.data.registeredStudents || []).map(s => (s.chestNo || '').toUpperCase()));
    while (existing.has(autoChest.toUpperCase())) {
      nextCandidate++;
      autoChest = `C-${nextCandidate}`;
    }
    return autoChest;
  }

  updateStudentPhone(studentId, phone) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student record not found.');
    const trimmed = (phone || '').trim();
    student.phone = trimmed;
    this.addAuditLog(
      'STUDENT_PHONE_UPDATED',
      `Updated phone number for ${student.name} (${student.chestNo}) to ${trimmed ? trimmed : 'Removed'}`
    );
    this.saveData();
    return { success: true, student };
  }

  addStudent(studentData) {
    if (!studentData.name || studentData.name.trim() === '') {
      throw new Error('Student Full Name is required.');
    }

    // Auto-generate next Student ID: STU-10XX
    let nextNum = 1001;
    (this.data.registeredStudents || []).forEach(s => {
      const match = (s.id || '').match(/STU-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n >= nextNum) nextNum = n + 1;
      }
    });
    const autoId = `STU-${nextNum}`;

    // Auto-generate or validate chest number
    let autoChest = studentData.chestNo ? studentData.chestNo.trim().toUpperCase() : '';
    if (!autoChest) {
      autoChest = this.generateChestNumber();
    } else {
      // Validate unique chest number
      if ((this.data.registeredStudents || []).some(s => (s.chestNo || '').toUpperCase() === autoChest)) {
        throw new Error(`Chest Number ${autoChest} is already allocated to another registered student.`);
      }
    }

    // Auto-generate email if left blank
    let email = (studentData.email || '').trim();
    if (!email) {
      email = this.generateStudentEmail(studentData.name);
    }

    // Class category must be one of the four official categories
    const normalizedCategory = this.normalizeClassCategory(studentData.classCategory);

    // Team assignment: Team 1, Team 2 or Unassigned (Pool)
    const assignedTeam = studentData.teamId && studentData.teamId !== 'Unassigned'
      ? this.data.teams.find(t => t.id === studentData.teamId)
      : null;

    // Phone number is optional - store as empty string if not provided, never fake digits
    const phone = (studentData.phone || '').trim();

    const newStudent = {
      id: autoId,
      chestNo: autoChest,
      name: studentData.name.trim(),
      classCategory: normalizedCategory,
      teamId: assignedTeam ? assignedTeam.id : null,
      teamName: assignedTeam ? assignedTeam.name : 'Unassigned',
      dob: studentData.dob || '2008-05-15',
      institution: (studentData.institution || '').trim() || 'Dalailussunna Dars, Ayiroor',
      phone: phone,
      email: email,
      status: studentData.status || 'Active',
      gender: studentData.gender || 'Male',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    // If assigned to a team, update team.students and team.members
    if (assignedTeam) {
      if (!Array.isArray(assignedTeam.students)) assignedTeam.students = [];
      assignedTeam.students.push({
        id: newStudent.id,
        chestNo: newStudent.chestNo,
        name: newStudent.name,
        category: newStudent.classCategory,
        compCategory: 'General',
        events: []
      });
      assignedTeam.members = assignedTeam.students.length;
    }

    this.data.registeredStudents.push(newStudent);
    this.addAuditLog(
      'STUDENT_REGISTERED',
      `Registered student ${newStudent.name} (${newStudent.chestNo}) in category ${newStudent.classCategory}${assignedTeam ? ` assigned to ${assignedTeam.name}` : ''}`
    );
    this.saveData();
    return { success: true, student: newStudent };
  }

  updateStudent(studentId, updateFields) {
    const student = this.data.registeredStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Student record not found.');

    // If changing chest number, ensure uniqueness
    if (updateFields.chestNo && updateFields.chestNo.toUpperCase() !== (student.chestNo || '').toUpperCase()) {
      const newChest = updateFields.chestNo.trim().toUpperCase();
      if (this.data.registeredStudents.some(s => s.id !== studentId && (s.chestNo || '').toUpperCase() === newChest)) {
        throw new Error(`Chest Number ${newChest} is already assigned to another student.`);
      }
      student.chestNo = newChest;
    }

    const oldTeamId = student.teamId;
    const newTeamId = updateFields.teamId !== undefined ? updateFields.teamId : oldTeamId;

    // Handle team reassignment
    if (newTeamId !== oldTeamId) {
      // Remove from old team
      if (oldTeamId) {
        const oldTeam = this.data.teams.find(t => t.id === oldTeamId);
        if (oldTeam && Array.isArray(oldTeam.students)) {
          oldTeam.students = oldTeam.students.filter(s => s.id !== studentId);
          oldTeam.members = oldTeam.students.length;
        }
      }

      // Add to new team
      if (newTeamId && newTeamId !== 'Unassigned') {
        const newTeam = this.data.teams.find(t => t.id === newTeamId);
        if (newTeam) {
          if (!Array.isArray(newTeam.students)) newTeam.students = [];
          newTeam.students.push({
            id: student.id,
            chestNo: student.chestNo,
            name: updateFields.name ? updateFields.name.trim() : student.name,
            category: updateFields.classCategory || student.classCategory,
            compCategory: 'General',
            events: []
          });
          newTeam.members = newTeam.students.length;
          student.teamId = newTeam.id;
          student.teamName = newTeam.name;
        } else {
          student.teamId = null;
          student.teamName = 'Unassigned';
        }
      } else {
        student.teamId = null;
        student.teamName = 'Unassigned';
      }
    } else if (newTeamId && newTeamId !== 'Unassigned') {
      // Update student details inside team's students list if same team
      const currentTeam = this.data.teams.find(t => t.id === newTeamId);
      if (currentTeam && Array.isArray(currentTeam.students)) {
        const sIdx = currentTeam.students.findIndex(s => s.id === studentId);
        if (sIdx !== -1) {
          currentTeam.students[sIdx].name = updateFields.name ? updateFields.name.trim() : student.name;
          currentTeam.students[sIdx].chestNo = student.chestNo;
          currentTeam.students[sIdx].category = updateFields.classCategory || student.classCategory;
        }
      }
    }

    // Update standard fields
    if (updateFields.name) student.name = updateFields.name.trim();
    if (updateFields.classCategory) student.classCategory = updateFields.classCategory;
    if (updateFields.dob) student.dob = updateFields.dob;
    if (updateFields.institution) student.institution = updateFields.institution;
    if (updateFields.phone !== undefined) student.phone = updateFields.phone;
    if (updateFields.email !== undefined) student.email = updateFields.email;
    if (updateFields.status) student.status = updateFields.status;
    if (updateFields.gender) student.gender = updateFields.gender;

    // Synchronize in programmeAssignments participants
    (this.data.programmeAssignments || []).forEach(prog => {
      if (Array.isArray(prog.participants)) {
        prog.participants.forEach(pt => {
          if (pt.studentId === student.id || pt.chestNo === student.chestNo) {
            pt.name = student.name;
            pt.chestNo = student.chestNo;
            pt.teamId = student.teamId;
            pt.teamName = student.teamName;
          }
        });
      }
    });

    this.addAuditLog(
      'STUDENT_UPDATED',
      `Updated student profile for ${student.name} (${student.chestNo})`
    );
    this.saveData();
    return { success: true, student };
  }

  deleteStudent(studentId, force = false) {
    const student = this.data.registeredStudents.find(s => s.id === studentId);
    if (!student) throw new Error('Student record not found.');

    // Safety check: is student a winner in resultPosters?
    const hasPrizes = (this.data.resultPosters || []).some(pos =>
      (pos.firstPrize && (pos.firstPrize.chestNo === student.chestNo || pos.firstPrize.studentId === student.id)) ||
      (pos.secondPrize && (pos.secondPrize.chestNo === student.chestNo || pos.secondPrize.studentId === student.id)) ||
      (pos.thirdPrize && (pos.thirdPrize.chestNo === student.chestNo || pos.thirdPrize.studentId === student.id))
    );

    if (hasPrizes && !force) {
      throw new Error(`Cannot delete student ${student.name} (${student.chestNo}) because they hold official published results. Confirm force deletion to proceed.`);
    }

    // Remove from assigned team
    if (student.teamId) {
      const team = this.data.teams.find(t => t.id === student.teamId);
      if (team && Array.isArray(team.students)) {
        team.students = team.students.filter(s => s.id !== studentId);
        team.members = team.students.length;
      }
    }

    // Remove from competition participation
    (this.data.programmeAssignments || []).forEach(prog => {
      if (Array.isArray(prog.participants)) {
        prog.participants = prog.participants.filter(pt => pt.studentId !== student.id && pt.chestNo !== student.chestNo);
        prog.totalParticipants = prog.participants.length;
      }
    });

    // Remove from registeredStudents
    this.data.registeredStudents = this.data.registeredStudents.filter(s => s.id !== studentId);

    this.addAuditLog(
      'STUDENT_DELETED',
      `Removed student ${student.name} (${student.chestNo}) from registry and associated teams`
    );
    this.saveData();
    return { success: true };
  }

  bulkAssignStudents(studentIds, teamId) {
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      throw new Error('Please select at least one student.');
    }
    const team = teamId && teamId !== 'Unassigned' ? this.data.teams.find(t => t.id === teamId) : null;

    let updatedCount = 0;
    studentIds.forEach(id => {
      try {
        this.updateStudent(id, { teamId: team ? team.id : null });
        updatedCount++;
      } catch (e) {
        console.error(`Failed to assign student ${id}:`, e);
      }
    });

    this.addAuditLog(
      'BULK_STUDENT_ASSIGNMENT',
      `Assigned ${updatedCount} students to ${team ? team.name : 'Unassigned pool'}`
    );
    this.saveData();
    return { success: true, count: updatedCount };
  }

  // =========================================================================
  // COMPETITION MANAGEMENT METHODS & REAL-TIME CRUD (Step 04 - Complete Functional Development)
  // =========================================================================

  getCompetitionStats() {
    const competitions = this.data.programmeAssignments || [];
    const totalCompetitions = competitions.length;

    const stageCount = competitions.filter(c => {
      const cls = c.classification || (c.format === 'On Stage' ? 'Stage' : (c.type === 'General' || c.category === 'General' ? 'General' : 'Stage'));
      return cls === 'Stage';
    }).length;

    const offStageCount = competitions.filter(c => {
      const cls = c.classification || (c.format === 'Off Stage' ? 'Off Stage' : '');
      return cls === 'Off Stage';
    }).length;

    const generalCount = competitions.filter(c => {
      const cls = c.classification || (c.type === 'General' || c.category === 'General' ? 'General' : '');
      return cls === 'General';
    }).length;

    const individualCount = competitions.filter(c => (c.type || 'Individual').toLowerCase() === 'individual').length;
    const groupCount = competitions.filter(c => (c.type || '').toLowerCase() === 'group' || (c.type || '').toLowerCase() === 'general').length;

    const activeCount = competitions.filter(c => c.status === 'Ongoing' || c.status === 'In Progress').length;
    const upcomingCount = competitions.filter(c =>
      c.status === 'Upcoming' || c.status === 'Registration Open' || c.status === 'Draft' || c.status === 'Assigned' || c.status === 'Pending Evaluation'
    ).length;
    const completedCount = competitions.filter(c =>
      c.isPublished || c.status === 'Approved' || c.status === 'Verified' || c.status === 'Published'
    ).length;

    let totalParticipants = 0;
    competitions.forEach(c => {
      if (Array.isArray(c.participants)) {
        totalParticipants += c.participants.length;
      }
    });

    const pendingRegistrations = competitions.filter(c =>
      !c.assignedJudgeIds || c.assignedJudgeIds.length === 0 || !c.participants || c.participants.length < 2
    ).length;

    // Student Category breakdown
    const categoryBreakdown = {
      Minor: 0,
      SubJunior: 0,
      Junior: 0,
      Senior: 0,
      General: 0
    };
    competitions.forEach(c => {
      const cat = (c.category || '').toLowerCase().replace(/[\s-_]/g, '');
      if (cat === 'minor') categoryBreakdown.Minor++;
      else if (cat === 'subjunior') categoryBreakdown.SubJunior++;
      else if (cat === 'junior') categoryBreakdown.Junior++;
      else if (cat === 'senior') categoryBreakdown.Senior++;
      else if (cat === 'general') categoryBreakdown.General++;
    });

    // Venue breakdown
    const venueBreakdown = {};
    competitions.forEach(c => {
      const v = c.venue || 'Main Stage';
      venueBreakdown[v] = (venueBreakdown[v] || 0) + 1;
    });

    // Status breakdown
    const statusBreakdown = {};
    competitions.forEach(c => {
      const st = c.status || 'Upcoming';
      statusBreakdown[st] = (statusBreakdown[st] || 0) + 1;
    });

    return {
      totalCompetitions,
      stageCount,
      offStageCount,
      generalCount,
      individualCount,
      groupCount,
      activeCount,
      upcomingCount,
      completedCount,
      totalParticipants,
      pendingRegistrations,
      categoryBreakdown,
      venueBreakdown,
      statusBreakdown
    };
  }

  getCompetitions({
    query = '',
    classification = 'all',
    type = 'all',
    category = 'all',
    status = 'all',
    sortBy = 'date',
    sortOrder = 'asc'
  } = {}) {
    let list = (this.data.programmeAssignments || []).map(c => {
      const assignedJudges = (c.assignedJudgeIds || []).map(jid =>
        (this.data.judges || []).find(j => j.id === jid)
      ).filter(Boolean);

      const registeredCount = Array.isArray(c.participants) ? c.participants.length : (c.totalParticipants || 0);
      const maxParticipants = c.maxParticipants || (c.type === 'Group' || c.type === 'General' ? 16 : 24);

      const submittedEvaluationsCount = (this.data.submittedEvaluations || []).filter(se =>
        se.assignmentId === c.id || se.competitionId === c.competitionId
      ).length;

      const resultPoster = (this.data.resultPosters || []).find(rp =>
        rp.competitionId === c.competitionId || rp.competitionCode === c.competitionCode
      ) || null;

      const compClassification = c.classification || (c.type === 'General' || c.category === 'General' ? 'General' : (c.format === 'Off Stage' ? 'Off Stage' : 'Stage'));
      const compCategory = compClassification === 'General' ? 'General' : (c.category || 'Senior');
      const compType = compClassification === 'General' ? 'General' : (c.type || 'Individual');

      return {
        id: c.id,
        competitionId: c.competitionId,
        code: c.competitionCode,
        competitionCode: c.competitionCode,
        title: c.competitionTitle,
        competitionTitle: c.competitionTitle,
        classification: compClassification,
        format: c.format || (compClassification === 'Stage' ? 'On Stage' : (compClassification === 'Off Stage' ? 'Off Stage' : 'General')),
        category: compCategory,
        type: compType,
        venue: c.venue || (compClassification === 'Stage' ? 'Cordova Grand Stage (Stage 01)' : 'Academic Halls'),
        date: c.date || 'Dec 21, 2026',
        time: c.time || '10:00 AM',
        totalParticipants: registeredCount,
        registeredCount,
        maxParticipants,
        assignedJudgeIds: c.assignedJudgeIds || [],
        assignedJudgesCount: assignedJudges.length,
        assignedJudges,
        evaluationCriteria: c.evaluationCriteria || [
          { id: 'c1', name: 'Presentation & Fluency', maxMarks: 40 },
          { id: 'c2', name: 'Thematic Rigour', maxMarks: 35 },
          { id: 'c3', name: 'Artistic Execution', maxMarks: 25 }
        ],
        totalMaxMarks: c.totalMaxMarks || 100,
        status: c.status || 'Upcoming',
        isPublished: Boolean(c.isPublished),
        publishedAt: c.publishedAt || null,
        participants: c.participants || [],
        rules: c.rules || 'Standard official festival rubric and 10-minute timer apply.',
        description: c.description || 'Premier competitive festival event for enrolled scholars.',
        eligibility: c.eligibility || 'Open',
        registrationStartDate: c.registrationStartDate || 'Dec 01, 2026',
        registrationCloseDate: c.registrationCloseDate || 'Dec 20, 2026',
        submittedEvaluationsCount,
        resultPoster
      };
    });

    // Apply Search
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.classification.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.venue.toLowerCase().includes(q)
      );
    }

    // Apply Classification Filter
    if (classification && classification !== 'all') {
      list = list.filter(c => (c.classification || '').toLowerCase() === classification.toLowerCase());
    }

    // Apply Type Filter
    if (type && type !== 'all') {
      list = list.filter(c => c.type.toLowerCase() === type.toLowerCase());
    }

    // Apply Category Filter
    if (category && category !== 'all') {
      list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    // Apply Status Filter
    if (status && status !== 'all') {
      if (status === 'Published') {
        list = list.filter(c => c.isPublished || c.status === 'Published' || c.status === 'Approved');
      } else if (status === 'Upcoming') {
        list = list.filter(c => c.status === 'Upcoming' || c.status === 'Registration Open' || c.status === 'Draft' || c.status === 'Assigned');
      } else if (status === 'Ongoing') {
        list = list.filter(c => c.status === 'Ongoing' || c.status === 'In Progress');
      } else {
        list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
      }
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortBy] ?? '';
      let valB = b[sortBy] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
      if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });

    return list;
  }

  getCompetitionById(id) {
    const c = (this.data.programmeAssignments || []).find(item =>
      item.id === id || item.competitionId === id || item.competitionCode === id
    );
    if (!c) return null;

    const assignedJudges = (c.assignedJudgeIds || []).map(jid =>
      (this.data.judges || []).find(j => j.id === jid)
    ).filter(Boolean);

    const submittedEvaluations = (this.data.submittedEvaluations || []).filter(se =>
      se.assignmentId === c.id || se.competitionId === c.competitionId
    );

    const resultPoster = (this.data.resultPosters || []).find(rp =>
      rp.competitionId === c.competitionId || rp.competitionCode === c.competitionCode
    ) || null;

    return {
      id: c.id,
      competitionId: c.competitionId,
      code: c.competitionCode,
      competitionCode: c.competitionCode,
      title: c.competitionTitle,
      competitionTitle: c.competitionTitle,
      category: c.category || 'General',
      type: c.type || 'Individual',
      venue: c.venue || 'Cordova Grand Stage (Stage 01)',
      date: c.date || 'Dec 21, 2026',
      time: c.time || '10:00 AM',
      totalParticipants: Array.isArray(c.participants) ? c.participants.length : (c.totalParticipants || 0),
      maxParticipants: c.maxParticipants || (c.type === 'Group' ? 16 : 24),
      assignedJudgeIds: c.assignedJudgeIds || [],
      assignedJudges,
      evaluationCriteria: c.evaluationCriteria || [],
      totalMaxMarks: c.totalMaxMarks || 100,
      instructions: c.instructions || '',
      rules: c.rules || 'Official festival competition rubric applies.',
      description: c.description || 'Festival competitive arena event.',
      eligibility: c.eligibility || 'Open',
      registrationStartDate: c.registrationStartDate || 'Dec 01, 2026',
      registrationCloseDate: c.registrationCloseDate || 'Dec 20, 2026',
      status: c.status || 'Upcoming',
      isPublished: Boolean(c.isPublished),
      publishedAt: c.publishedAt || null,
      participants: c.participants || [],
      submittedEvaluations,
      resultPoster
    };
  }

  addCompetition(compData) {
    const title = (compData.title || compData.competitionTitle || '').trim();
    if (!title) throw new Error('Competition title is required.');

    const classification = compData.classification === 'General'
      ? 'General'
      : (compData.classification === 'Off Stage' ? 'Off Stage' : 'Stage');
    const isGeneral = classification === 'General' || compData.type === 'General' || compData.category === 'General';
    const finalClassification = isGeneral ? 'General' : classification;
    const category = isGeneral ? 'General' : (compData.category || 'Senior');
    const type = isGeneral ? 'General' : (compData.type === 'group' || compData.type === 'Group' ? 'Group' : 'Individual');
    const format = finalClassification === 'Stage' ? 'On Stage' : (finalClassification === 'Off Stage' ? 'Off Stage' : 'General');

    // Auto-generate code if missing
    let code = (compData.code || compData.competitionCode || '').trim().toUpperCase();
    if (!code) {
      const clsPrefix = finalClassification === 'Stage' ? 'STG' : (finalClassification === 'Off Stage' ? 'OFF' : 'GEN');
      const catPrefix = category.slice(0, 3).toUpperCase();
      const randNum = Math.floor(100 + Math.random() * 900);
      code = `${clsPrefix}-${catPrefix}-${randNum}`;
    }

    // Check code uniqueness
    if ((this.data.programmeAssignments || []).some(c => c.competitionCode.toUpperCase() === code)) {
      throw new Error(`Competition Code ${code} is already allocated to another event.`);
    }

    const nextAssignmentNum = (this.data.programmeAssignments.length + 1).toString().padStart(3, '0');
    const autoId = `ASG-${nextAssignmentNum}`;
    const autoCompId = `COMP-${category.slice(0, 3).toUpperCase()}-${nextAssignmentNum}`;

    const defaultCriteria = compData.evaluationCriteria && compData.evaluationCriteria.length > 0
      ? compData.evaluationCriteria
      : [
        { id: 'c1', name: 'Mastery & Technique', maxMarks: 40 },
        { id: 'c2', name: 'Presentation & Style', maxMarks: 35 },
        { id: 'c3', name: 'Adherence to Festival Theme', maxMarks: 25 }
      ];

    const newComp = {
      id: autoId,
      competitionId: autoCompId,
      competitionCode: code,
      competitionTitle: title,
      classification: finalClassification,
      format,
      category,
      type,
      venue: compData.venue || (finalClassification === 'Stage' ? 'Cordova Grand Stage (Stage 01)' : 'Academic Halls'),
      date: compData.date || 'Dec 21, 2026',
      time: compData.time || '10:00 AM',
      totalParticipants: 0,
      maxParticipants: parseInt(compData.maxParticipants, 10) || (type === 'Group' ? 16 : 24),
      assignedJudgeIds: Array.isArray(compData.assignedJudgeIds) ? compData.assignedJudgeIds : [],
      evaluationCriteria: defaultCriteria,
      totalMaxMarks: parseInt(compData.totalMaxMarks, 10) || 100,
      instructions: compData.instructions || 'Adjudicate independently according to the designated rubric.',
      description: compData.description || `${title} competitive arena event for Dalenzia Fest 2K26.`,
      rules: compData.rules || 'Participants must report to the green room 15 minutes before call time.',
      eligibility: compData.eligibility || 'Open',
      registrationStartDate: compData.registrationStartDate || 'Dec 01, 2026',
      registrationCloseDate: compData.registrationCloseDate || 'Dec 20, 2026',
      status: compData.status || 'Upcoming',
      isPublished: false,
      publishedAt: null,
      participants: []
    };

    this.data.programmeAssignments.push(newComp);
    this.addAuditLog(
      'COMPETITION_CREATED',
      `Created new ${type} competition: ${title} (${code}) in ${category}`
    );
    this.saveData();
    return { success: true, competition: newComp };
  }

  updateCompetition(id, updateFields) {
    const comp = (this.data.programmeAssignments || []).find(c =>
      c.id === id || c.competitionId === id || c.competitionCode === id
    );
    if (!comp) throw new Error('Competition not found.');

    // If changing code, ensure uniqueness
    if (updateFields.code && updateFields.code.toUpperCase() !== comp.competitionCode.toUpperCase()) {
      const newCode = updateFields.code.trim().toUpperCase();
      if (this.data.programmeAssignments.some(c => c.id !== comp.id && c.competitionCode.toUpperCase() === newCode)) {
        throw new Error(`Competition Code ${newCode} is already in use.`);
      }
      comp.competitionCode = newCode;
    }

    if (updateFields.title || updateFields.competitionTitle) {
      comp.competitionTitle = (updateFields.title || updateFields.competitionTitle).trim();
    }
    if (updateFields.classification) {
      comp.classification = updateFields.classification;
      comp.format = updateFields.classification === 'Stage' ? 'On Stage' : (updateFields.classification === 'Off Stage' ? 'Off Stage' : 'General');
    }
    if (updateFields.category) comp.category = updateFields.category;
    if (updateFields.type) comp.type = updateFields.type === 'group' || updateFields.type === 'Group' ? 'Group' : 'Individual';
    if (updateFields.venue) comp.venue = updateFields.venue;
    if (updateFields.date) comp.date = updateFields.date;
    if (updateFields.time) comp.time = updateFields.time;
    if (updateFields.status) comp.status = updateFields.status;
    if (updateFields.rules) comp.rules = updateFields.rules;
    if (updateFields.description) comp.description = updateFields.description;
    if (updateFields.eligibility) comp.eligibility = updateFields.eligibility;
    if (updateFields.instructions) comp.instructions = updateFields.instructions;
    if (updateFields.maxParticipants) comp.maxParticipants = parseInt(updateFields.maxParticipants, 10);
    if (updateFields.totalMaxMarks) comp.totalMaxMarks = parseInt(updateFields.totalMaxMarks, 10);

    if (Array.isArray(updateFields.evaluationCriteria)) {
      comp.evaluationCriteria = updateFields.evaluationCriteria;
    }

    if (Array.isArray(updateFields.assignedJudgeIds)) {
      comp.assignedJudgeIds = updateFields.assignedJudgeIds;
    }

    // Sync in resultPosters if published
    (this.data.resultPosters || []).forEach(rp => {
      if (rp.competitionId === comp.competitionId) {
        rp.competitionTitle = comp.competitionTitle;
        rp.competitionCode = comp.competitionCode;
        rp.category = comp.category;
        rp.venue = comp.venue;
      }
    });

    this.addAuditLog(
      'COMPETITION_UPDATED',
      `Updated parameters for ${comp.competitionTitle} (${comp.competitionCode})`
    );
    this.saveData();
    return { success: true, competition: comp };
  }

  deleteCompetition(id, force = false) {
    const comp = (this.data.programmeAssignments || []).find(c =>
      c.id === id || c.competitionId === id || c.competitionCode === id
    );
    if (!comp) throw new Error('Competition not found.');

    const hasSubmittedMarks = (this.data.submittedEvaluations || []).some(se =>
      se.assignmentId === comp.id || se.competitionId === comp.competitionId
    );
    const hasPublishedResult = (this.data.resultPosters || []).some(rp =>
      rp.competitionId === comp.competitionId || rp.competitionCode === comp.competitionCode
    );

    if ((hasSubmittedMarks || hasPublishedResult) && !force) {
      throw new Error(`Cannot delete ${comp.competitionTitle} because evaluation marks or official results are already logged. Confirm force deletion to proceed.`);
    }

    // Unlink evaluations and posters if force deleted
    if (force) {
      this.data.submittedEvaluations = (this.data.submittedEvaluations || []).filter(se =>
        se.assignmentId !== comp.id && se.competitionId !== comp.competitionId
      );
      this.data.resultPosters = (this.data.resultPosters || []).filter(rp =>
        rp.competitionId !== comp.competitionId && rp.competitionCode !== comp.competitionCode
      );
    }

    this.data.programmeAssignments = this.data.programmeAssignments.filter(c => c.id !== comp.id);

    this.addAuditLog(
      'COMPETITION_DELETED',
      `Removed competition ${comp.competitionTitle} (${comp.competitionCode})`
    );
    this.saveData();
    return { success: true };
  }

  registerParticipantForCompetition(competitionId, studentId) {
    const comp = (this.data.programmeAssignments || []).find(c =>
      c.id === competitionId || c.competitionId === competitionId || c.competitionCode === competitionId
    );
    if (!comp) throw new Error('Target competition was not found.');

    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Candidate was not found in student registry.');

    if (!Array.isArray(comp.participants)) comp.participants = [];

    // Duplicate check
    if (comp.participants.some(pt => pt.studentId === student.id || pt.chestNo === student.chestNo)) {
      throw new Error(`Candidate ${student.name} (${student.chestNo}) is already registered in ${comp.competitionTitle}.`);
    }

    // 1. Official Category Check (Charter Page 3 & 5-9)
    const compCategory = comp.category || 'General';
    const studentCategory = student.classCategory || student.category || '';
    if (compCategory !== 'General' && studentCategory && compCategory.toLowerCase() !== studentCategory.toLowerCase()) {
      throw new Error(`Category Mismatch: Candidate ${student.name} is in "${studentCategory}" category, but ${comp.competitionTitle} is restricted to "${compCategory}" category.`);
    }

    // 2. Student Participation Limits (Charter Page 3: Max 4 Stage, Max 4 Off-Stage)
    const isStageEvent = (comp.format || '').toLowerCase().includes('stage') && !(comp.format || '').toLowerCase().includes('off');
    const allAssignments = this.data.programmeAssignments || [];
    let studentStageCount = 0;
    let studentOffStageCount = 0;

    allAssignments.forEach(a => {
      if (Array.isArray(a.participants) && a.participants.some(pt => pt.studentId === student.id || pt.chestNo === student.chestNo)) {
        const isAStage = (a.format || '').toLowerCase().includes('stage') && !(a.format || '').toLowerCase().includes('off');
        if (isAStage) studentStageCount++;
        else studentOffStageCount++;
      }
    });

    if (isStageEvent && studentStageCount >= 4) {
      throw new Error(`Stage Limit Exceeded: Candidate ${student.name} has already registered in 4 stage items (Maximum allowed per student: 4 items, Charter Page 3).`);
    }
    if (!isStageEvent && studentOffStageCount >= 4) {
      throw new Error(`Off-Stage Limit Exceeded: Candidate ${student.name} has already registered in 4 off-stage items (Maximum allowed per student: 4 items, Charter Page 3).`);
    }

    // 3. Team Entry Limits (Charter Page 3: Max 3 entries for Individual, Max 2 entries for Group)
    const isGroupEvent = (comp.type || '').toLowerCase() === 'group';
    const studentTeamId = student.teamId;
    if (studentTeamId) {
      const teamEntries = comp.participants.filter(pt => pt.teamId === studentTeamId).length;
      const maxTeamLimit = isGroupEvent ? 2 : 3;
      if (teamEntries >= maxTeamLimit) {
        throw new Error(`Team Entry Limit Reached: ${student.teamName || 'Team'} already has ${teamEntries} entries in ${comp.competitionTitle} (Maximum allowed: ${maxTeamLimit} per Charter Page 3).`);
      }
    }

    // 4. Overall Capacity check
    const max = comp.maxParticipants || (isGroupEvent ? 16 : 24);
    if (comp.participants.length >= max) {
      throw new Error(`Registration limit reached for this event (${max} max participants).`);
    }

    const participantEntry = {
      studentId: student.id,
      chestNo: student.chestNo,
      name: student.name,
      teamId: student.teamId || null,
      teamName: student.teamName || 'Unassigned',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    comp.participants.push(participantEntry);
    comp.totalParticipants = comp.participants.length;

    this.addAuditLog(
      'PARTICIPANT_REGISTERED',
      `Registered ${student.name} (${student.chestNo}) for ${comp.competitionTitle}`
    );
    this.saveData();
    return { success: true, participant: participantEntry };
  }

  removeParticipantFromCompetition(competitionId, studentId) {
    const comp = (this.data.programmeAssignments || []).find(c =>
      c.id === competitionId || c.competitionId === competitionId || c.competitionCode === competitionId
    );
    if (!comp) throw new Error('Target competition not found.');

    if (Array.isArray(comp.participants)) {
      comp.participants = comp.participants.filter(pt => pt.studentId !== studentId && pt.chestNo !== studentId);
      comp.totalParticipants = comp.participants.length;
    }

    this.addAuditLog(
      'PARTICIPANT_REMOVED',
      `Removed participant from ${comp.competitionTitle}`
    );
    this.saveData();
    return { success: true };
  }

  updateCompetitionStatus(id, newStatus) {
    const comp = (this.data.programmeAssignments || []).find(c =>
      c.id === id || c.competitionId === id || c.competitionCode === id
    );
    if (!comp) throw new Error('Competition not found.');

    comp.status = newStatus;
    if (newStatus === 'Published') {
      comp.isPublished = true;
      comp.publishedAt = new Date().toLocaleString();
    }

    this.addAuditLog(
      'COMPETITION_STATUS_UPDATED',
      `Changed status of ${comp.competitionTitle} to ${newStatus}`
    );
    this.saveData();
    return { success: true, status: newStatus };
  }

  updateEvaluationCriteria(competitionId, criteriaArray, totalMax = 100) {
    const comp = (this.data.programmeAssignments || []).find(c =>
      c.id === competitionId || c.competitionId === competitionId || c.competitionCode === competitionId
    );
    if (!comp) throw new Error('Competition not found.');

    if (!Array.isArray(criteriaArray) || criteriaArray.length === 0) {
      throw new Error('Please supply at least one evaluation criterion.');
    }

    const calculatedSum = criteriaArray.reduce((acc, c) => acc + (parseInt(c.maxMarks, 10) || 0), 0);
    if (calculatedSum !== totalMax) {
      throw new Error(`Criteria marks sum (${calculatedSum}) must equal total competition maximum marks (${totalMax}).`);
    }

    comp.evaluationCriteria = criteriaArray;
    comp.totalMaxMarks = totalMax;

    this.addAuditLog(
      'EVALUATION_CRITERIA_UPDATED',
      `Updated rubric criteria for ${comp.competitionTitle}`
    );
    this.saveData();
    return { success: true };
  }

  assignJudgesToCompetition(competitionId, judgeIds) {
    const comp = (this.data.programmeAssignments || []).find(c =>
      c.id === competitionId || c.competitionId === competitionId || c.competitionCode === competitionId
    );
    if (!comp) throw new Error('Competition not found.');

    comp.assignedJudgeIds = Array.isArray(judgeIds) ? judgeIds : [];

    this.addAuditLog(
      'JUDGES_ASSIGNED',
      `Updated adjudicator panel for ${comp.competitionTitle} (${comp.assignedJudgeIds.length} judges)`
    );
    this.saveData();
    return { success: true };
  }

  // =========================================================================
  // RESULTS & SCORING METHODS (Step 05 - Complete Functional Development)
  // =========================================================================

  getScoringConfig() {
    if (!this.data.scoringConfig) {
      this.data.scoringConfig = JSON.parse(JSON.stringify(OFFICIAL_SCORING_CONFIG));
    }
    return this.data.scoringConfig;
  }

  getScoringRules() {
    const config = this.getScoringConfig();
    return {
      individual: {
        first: config.positionPoints?.individual?.first ?? 3,
        second: config.positionPoints?.individual?.second ?? 2,
        third: config.positionPoints?.individual?.third ?? 1,
        label: 'Individual Event (3 - 2 - 1 Points per Charter Page 4)'
      },
      group: {
        first: config.positionPoints?.group?.first ?? 10,
        second: config.positionPoints?.group?.second ?? 8,
        third: config.positionPoints?.group?.third ?? 6,
        label: 'Group Event (10 - 8 - 6 Points per Charter Page 4)'
      },
      isGradePointsActive: Boolean(config.isGradePointsActive),
      grades: config.grades || OFFICIAL_SCORING_CONFIG.grades,
      entryLimits: config.entryLimits || OFFICIAL_SCORING_CONFIG.entryLimits
    };
  }

  updateScoringConfig(newConfig, { adminConfirmation = false, updatedBy = 'Super Admin' } = {}) {
    if (!this.data.scoringConfig) {
      this.data.scoringConfig = JSON.parse(JSON.stringify(OFFICIAL_SCORING_CONFIG));
    }

    // Only allow activating grade points if authorized admin confirmation is explicitly provided
    if (newConfig.isGradePointsActive && !this.data.scoringConfig.isGradePointsActive) {
      if (!adminConfirmation) {
        throw new Error('Authorized Main Admin confirmation is strictly required before activating automatic grade points.');
      }
    }

    this.data.scoringConfig = {
      ...this.data.scoringConfig,
      ...newConfig,
      audit: {
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: new Date().toISOString(),
        confirmedByAdmin: Boolean(adminConfirmation)
      }
    };

    this.addAuditLog('SCORING_CONFIG_UPDATED', `Scoring & Grade configuration updated by ${updatedBy}`);
    this.saveData();
    return { success: true, scoringConfig: this.data.scoringConfig };
  }

  getResultsDashboardStats() {
    const competitions = this.data.programmeAssignments || [];
    const evaluations = this.data.submittedEvaluations || [];
    const posters = this.data.resultPosters || [];
    const teams = this.getTeams();

    const totalCompetitions = competitions.length;
    const totalEvaluations = evaluations.length;
    const submittedEvaluations = evaluations.filter(e => e.status === 'Submitted' || e.status === 'Verified' || e.status === 'Under Verification').length;
    const pendingEvaluations = evaluations.filter(e => e.status === 'Draft' || e.status === 'Correction Requested').length;

    const resultsAwaitingVerification = competitions.filter(c =>
      !c.isPublished && (c.status === 'Under Verification' || c.status === 'Submitted' || evaluations.some(e => e.competitionId === c.competitionId || e.assignmentId === c.id))
    ).length;

    const publishedResults = posters.length;
    const totalTeamPoints = teams.reduce((acc, t) => acc + (t.points || 0), 0);

    return {
      totalCompetitions,
      totalEvaluations,
      submittedEvaluations,
      pendingEvaluations,
      resultsAwaitingVerification,
      publishedResults,
      totalTeamPoints,
      recentSubmissions: evaluations.slice(0, 6),
      publishedPosters: posters.slice(0, 4)
    };
  }

  getAllSubmittedEvaluations({ query = '', competitionId = 'all', status = 'all' } = {}) {
    let list = (this.data.submittedEvaluations || []).map(ev => {
      const comp = (this.data.programmeAssignments || []).find(c =>
        c.id === ev.assignmentId || c.competitionId === ev.competitionId
      );
      return {
        ...ev,
        competitionTitle: comp ? comp.competitionTitle : (ev.competitionId || 'Competition'),
        competitionCode: comp ? comp.competitionCode : 'COMP',
        category: comp ? comp.category : 'General'
      };
    });

    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(e =>
        e.judgeName.toLowerCase().includes(q) ||
        e.competitionTitle.toLowerCase().includes(q) ||
        e.competitionCode.toLowerCase().includes(q) ||
        (e.scores && e.scores.some(s => s.name.toLowerCase().includes(q) || (s.chestNo || '').toLowerCase().includes(q)))
      );
    }

    if (competitionId && competitionId !== 'all') {
      list = list.filter(e => e.competitionId === competitionId || e.assignmentId === competitionId);
    }

    if (status && status !== 'all') {
      list = list.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }

    return list;
  }

  calculateAggregatedResults(competitionId, options = {}) {
    const aggregationMode = options.aggregationMode || 'average'; // 'average' or 'sum'
    const tieBreakerRule = options.tieBreakerRule || 'criteria_weight'; // 'criteria_weight' or 'highest_single_mark' or 'shared'

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) return null;

    const evals = (this.data.submittedEvaluations || []).filter(e =>
      e.competitionId === assignment.competitionId || e.assignmentId === assignment.id
    );

    const isGeneral = (assignment.type || '').toLowerCase() === 'general';
    const positionPointsConfig = isGeneral
      ? { first: 10, second: 8, third: 6 }
      : { first: 3, second: 2, third: 1 };

    const participantMap = {};

    // 1. Seed from assignment.participants if any
    (assignment.participants || []).forEach(p => {
      const key = p.studentId || p.teamId || p.id;
      if (!key) return;
      participantMap[key] = {
        studentId: p.studentId || null,
        chestNo: p.chestNo || '',
        name: p.name || p.teamName,
        teamId: p.teamId,
        teamName: p.teamName || p.name,
        judgeScores: [],
        criteriaTotals: {},
        totalSum: 0,
        averageScore: 0,
        computedScore: 0,
        grade: 'B',
        rank: 0,
        isTie: false,
        pointsAwarded: 0,
        disqualified: false
      };
    });

    // 2. Also incorporate all evaluation scores dynamically
    evals.forEach(ev => {
      if (Array.isArray(ev.scores)) {
        ev.scores.forEach(sc => {
          const key = sc.studentId || sc.teamId;
          if (!key) return;
          if (!participantMap[key]) {
            participantMap[key] = {
              studentId: sc.studentId || null,
              chestNo: sc.chestNo || '',
              name: sc.name || sc.teamName,
              teamId: sc.teamId,
              teamName: sc.teamName || sc.name,
              judgeScores: [],
              criteriaTotals: {},
              totalSum: 0,
              averageScore: 0,
              computedScore: 0,
              grade: 'B',
              rank: 0,
              isTie: false,
              pointsAwarded: 0,
              disqualified: false
            };
          }
          const p = participantMap[key];
          p.judgeScores.push({
            judgeId: ev.judgeId,
            judgeName: ev.judgeName,
            criteriaMarks: sc.criteriaMarks || {},
            total: sc.total || 0,
            remarks: sc.remarks || ''
          });
          p.totalSum += (sc.total || 0);

          // Accumulate criteria-wise totals
          if (sc.criteriaMarks) {
            Object.entries(sc.criteriaMarks).forEach(([critId, mark]) => {
              p.criteriaTotals[critId] = (p.criteriaTotals[critId] || 0) + (mark || 0);
            });
          }
        });
      }
    });

    // Compute final aggregated scores & grades
    const rankedParticipants = Object.values(participantMap).map(p => {
      const count = p.judgeScores.length || 1;
      p.averageScore = parseFloat((p.totalSum / count).toFixed(1));
      p.computedScore = aggregationMode === 'average' ? p.averageScore : p.totalSum;
      p.finalScore = p.computedScore;

      // Grade calculation based on 0-100 score
      const scoreVal = p.averageScore;
      if (scoreVal >= 85) p.grade = 'A+';
      else if (scoreVal >= 75) p.grade = 'A';
      else if (scoreVal >= 65) p.grade = 'B+';
      else if (scoreVal >= 50) p.grade = 'B';
      else p.grade = 'C';

      return p;
    });

    // Sort participants by computed score descending
    rankedParticipants.sort((a, b) => {
      if (b.computedScore !== a.computedScore) {
        return b.computedScore - a.computedScore;
      }
      // Tie breaker handling
      if (tieBreakerRule === 'criteria_weight') {
        const crit1A = a.criteriaTotals['c1'] || 0;
        const crit1B = b.criteriaTotals['c1'] || 0;
        if (crit1B !== crit1A) return crit1B - crit1A;
      } else if (tieBreakerRule === 'highest_single_mark') {
        const maxA = Math.max(...(a.judgeScores.map(j => j.total) || [0]));
        const maxB = Math.max(...(b.judgeScores.map(j => j.total) || [0]));
        if (maxB !== maxA) return maxB - maxA;
      }
      return 0;
    });

    // Detect ties and assign official ranks & Charter position points
    let hasTie = false;
    const tieDetails = [];

    rankedParticipants.forEach((p, idx) => {
      p.rank = idx + 1;
      if (idx > 0 && rankedParticipants[idx - 1].computedScore === p.computedScore) {
        p.isTie = true;
        rankedParticipants[idx - 1].isTie = true;
        hasTie = true;
        tieDetails.push({
          rank: p.rank,
          score: p.computedScore,
          participants: [rankedParticipants[idx - 1].name, p.name]
        });
      }

      // Official Position Points (Individual 3-2-1, General 10-8-6)
      let posPoints = 0;
      if (idx === 0) posPoints = positionPointsConfig.first;
      else if (idx === 1) posPoints = positionPointsConfig.second;
      else if (idx === 2) posPoints = positionPointsConfig.third;

      p.positionPoints = posPoints;
      p.pointsAwarded = posPoints;
    });

    const isComplete = evals.length > 0;

    return {
      assignment,
      totalJudgesAssigned: assignment.assignedJudgeIds ? assignment.assignedJudgeIds.length : 1,
      judgesSubmitted: evals.length,
      rankedParticipants,
      hasTie,
      isComplete,
      aggregationMode,
      tieBreakerRule
    };
  }

  verifyResult(competitionId, { adminNotes = '', verifiedBy = 'Super Admin' } = {}) {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Competition not found.');

    assignment.status = 'Under Verification';
    assignment.verificationStatus = 'Verified';
    assignment.verifiedAt = new Date().toLocaleString();
    assignment.verifiedBy = verifiedBy;
    assignment.verificationNotes = adminNotes;

    (this.data.submittedEvaluations || []).forEach(e => {
      if (e.competitionId === assignment.competitionId || e.assignmentId === assignment.id) {
        e.status = 'Verified';
      }
    });

    this.addAuditLog(
      'RESULT_VERIFIED',
      `Verified calculations and marks for ${assignment.competitionTitle} by ${verifiedBy}`
    );
    this.saveData();
    return { success: true, assignment };
  }

  approveAndPublishResult(competitionId, options = {}) {
    const agg = this.calculateAggregatedResults(competitionId, options);
    if (!agg) throw new Error('No evaluation marks available to calculate result.');

    const assignment = agg.assignment;
    const now = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const p1 = agg.rankedParticipants[0];
    const p2 = agg.rankedParticipants[1];
    const p3 = agg.rankedParticipants[2];

    const posterId = `POS-${(this.data.resultPosters.length + 1).toString().padStart(2, '0')}`;
    let existingPoster = this.data.resultPosters.find(p =>
      p.competitionId === assignment.competitionId || p.competitionCode === assignment.competitionCode
    );

    const isAlreadyPublished = Boolean(existingPoster || assignment.isPublished);

    const posterData = {
      id: existingPoster ? existingPoster.id : posterId,
      competitionId: assignment.competitionId,
      competitionCode: assignment.competitionCode,
      competitionTitle: assignment.competitionTitle,
      category: assignment.category,
      venue: assignment.venue,
      date: assignment.date,
      assignedJudgeIds: assignment.assignedJudgeIds || [],
      publishedAt: now,
      templateStyle: options.templateStyle || 'editorial_crimson',
      status: 'Published',
      firstPrize: p1 ? {
        name: p1.name,
        chestNo: p1.chestNo,
        teamId: p1.teamId,
        teamName: p1.teamName,
        score: `${p1.averageScore} / 100`,
        points: p1.pointsAwarded
      } : null,
      secondPrize: p2 ? {
        name: p2.name,
        chestNo: p2.chestNo,
        teamId: p2.teamId,
        teamName: p2.teamName,
        score: `${p2.averageScore} / 100`,
        points: p2.pointsAwarded
      } : null,
      thirdPrize: p3 ? {
        name: p3.name,
        chestNo: p3.chestNo,
        teamId: p3.teamId,
        teamName: p3.teamName,
        score: `${p3.averageScore} / 100`,
        points: p3.pointsAwarded
      } : null
    };

    posterData.podium = {
      first: posterData.firstPrize,
      second: posterData.secondPrize,
      third: posterData.thirdPrize
    };

    if (existingPoster) {
      Object.assign(existingPoster, posterData);
    } else {
      this.data.resultPosters.unshift(posterData);
    }

    assignment.status = 'Approved';
    assignment.isPublished = true;
    assignment.publishedAt = now;

    // Recalculate official Leaderboard idempotently from all published results
    this.recalculateTeamLeaderboard();

    this.addAuditLog(
      'RESULT_OFFICIALLY_PUBLISHED',
      `Officially published results and poster for ${assignment.competitionTitle}`
    );
    this.saveData();
    return { success: true, poster: posterData, assignment };
  }

  correctPublishedResult(competitionId, { reason, correctedParticipants, adminUser = 'Super Admin' } = {}) {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Target competition not found.');
    if (!reason || reason.trim() === '') throw new Error('Correction reason is mandatory.');

    let poster = this.data.resultPosters.find(p =>
      p.competitionId === assignment.competitionId || p.competitionCode === assignment.competitionCode
    );

    this.data.resultCorrectionHistory = this.data.resultCorrectionHistory || [];
    const historyEntry = {
      id: `CORR-${Date.now().toString().slice(-5)}`,
      competitionId: assignment.competitionId,
      competitionTitle: assignment.competitionTitle,
      reason: reason.trim(),
      correctedBy: adminUser,
      timestamp: new Date().toLocaleString(),
      previousPoster: poster ? JSON.parse(JSON.stringify(poster)) : null
    };
    this.data.resultCorrectionHistory.unshift(historyEntry);

    // Revert old poster points from teams
    if (poster) {
      [poster.firstPrize, poster.secondPrize, poster.thirdPrize].forEach(prize => {
        if (prize && prize.teamId && prize.points) {
          const team = this.data.teams.find(t => t.id === prize.teamId);
          if (team) team.points = Math.max(0, (team.points || 0) - prize.points);
        }
      });
    }

    // Apply new corrected participants if provided
    if (Array.isArray(correctedParticipants) && correctedParticipants.length > 0) {
      const p1 = correctedParticipants[0];
      const p2 = correctedParticipants[1];
      const p3 = correctedParticipants[2];

      const newPosterData = {
        firstPrize: p1 ? { name: p1.name, chestNo: p1.chestNo, teamId: p1.teamId, teamName: p1.teamName, score: `${p1.averageScore || p1.score} / 100`, points: p1.pointsAwarded || 30 } : null,
        secondPrize: p2 ? { name: p2.name, chestNo: p2.chestNo, teamId: p2.teamId, teamName: p2.teamName, score: `${p2.averageScore || p2.score} / 100`, points: p2.pointsAwarded || 20 } : null,
        thirdPrize: p3 ? { name: p3.name, chestNo: p3.chestNo, teamId: p3.teamId, teamName: p3.teamName, score: `${p3.averageScore || p3.score} / 100`, points: p3.pointsAwarded || 10 } : null,
        publishedAt: new Date().toLocaleString()
      };

      if (poster) {
        Object.assign(poster, newPosterData);
      }

      [newPosterData.firstPrize, newPosterData.secondPrize, newPosterData.thirdPrize].forEach(prize => {
        if (prize && prize.teamId && prize.points) {
          const team = this.data.teams.find(t => t.id === prize.teamId);
          if (team) team.points = (team.points || 0) + prize.points;
        }
      });
      this.recalculateTeamRankings();
    }

    this.addAuditLog(
      'RESULT_CORRECTED',
      `Corrected results for ${assignment.competitionTitle}: ${reason} by ${adminUser}`
    );
    this.saveData();
    return { success: true, historyEntry };
  }

  rejectResultEvaluation(evalId, reason, adminUser = 'Super Admin') {
    const ev = (this.data.submittedEvaluations || []).find(e => e.id === evalId);
    if (!ev) throw new Error('Evaluation sheet not found.');

    ev.status = 'Correction Requested';
    ev.statusNote = reason || 'Correction requested by festival secretariat.';
    ev.adminFeedbackNote = ev.statusNote;

    this.addAuditLog(
      'EVALUATION_REJECTED',
      `Rejected evaluation sheet ${evalId} (${ev.judgeName}): ${reason} by ${adminUser}`
    );
    this.saveData();
    return { success: true, evaluation: ev };
  }

  getResultCorrectionHistory(competitionId = null) {
    const list = this.data.resultCorrectionHistory || [];
    if (competitionId) {
      return list.filter(h => h.competitionId === competitionId);
    }
    return list;
  }

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
    const newId = `ALB-${nextNum.toString().padStart(2, '0')}`;

    const now = new Date().toISOString();
    const newAlbum = {
      id: newId,
      title: albumData.title.trim(),
      description: (albumData.description || '').trim(),
      date: albumData.date || 'Dec 21, 2026',
      category: albumData.category || 'Festival Moments',
      coverImage: albumData.coverImage || '/assets/main_poster.jpg',
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
      `Created gallery album "${newAlbum.title}" (${newAlbum.id}) by ${adminUser}`
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
      `Updated gallery album "${album.title}" (${album.id}) by ${adminUser}`
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
      `Deleted album "${album.title}" (${album.id}) with deleteMedia=${deleteMedia} by ${adminUser}`
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
      `Archived album "${album.title}" (${album.id}) by ${adminUser}`
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
      `Restored album "${album.title}" (${album.id}) to Published by ${adminUser}`
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
      `Set album "${album.title}" (${album.id}) status to ${album.status} by ${adminUser}`
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
    const newId = `MED-${nextNum.toString().padStart(2, '0')}`;

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
      `Added ${newMedia.type} "${newMedia.title}" (${newMedia.id}) to album ${albumTitle || 'Unassigned'} by ${adminUser}`
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
      `Updated media "${media.title}" (${media.id}) by ${adminUser}`
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
      `Deleted media "${media.title}" (${media.id}) by ${adminUser}`
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
      `Archived media "${media.title}" (${media.id}) by ${adminUser}`
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
      `Restored media "${media.title}" (${media.id}) to Published by ${adminUser}`
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
      `Assigned ${mediaIds.length} media items to album "${album.title}" (${album.id}) by ${adminUser}`
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
      `Removed media "${media.title}" (${media.id}) from album ${oldAlbum || 'Unknown'} without file deletion by ${adminUser}`
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
      `Updated cover image for album "${album.title}" (${album.id}) by ${adminUser}`
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
      `Reordered ${orderedMediaIds.length} media items in album ${albumId} by ${adminUser}`
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
      `Reordered ${orderedAlbumIds.length} gallery albums by ${adminUser}`
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
      const match = (p.id || '').match(/POSTER-(\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 0);
    const newId = `POSTER-${(maxNum + 1).toString().padStart(2, '0')}`;

    // Auto-resolve programme title if ID provided
    let progTitle = posterData.relatedProgrammeTitle || null;
    if (posterData.relatedProgrammeId && !progTitle) {
      const prog = (this.data.programmes || []).find(p => p.id === posterData.relatedProgrammeId);
      if (prog) progTitle = prog.title;
    }

    // Auto-resolve competition title if ID provided
    let compTitle = posterData.relatedCompetitionTitle || null;
    if (posterData.relatedCompetitionId && !compTitle) {
      const comp = this.getCompetitionById(posterData.relatedCompetitionId);
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
    this.addAuditLog('POSTER_CREATED', adminUser, `Created poster "${newPoster.title}" (${newPoster.id}) in category ${newPoster.category}`);
    this.saveData();
    return newPoster;
  }

  updatePoster(id, updateData, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(`Poster ${id} not found`);

    // Auto-resolve programme title if changed
    if (updateData.relatedProgrammeId && updateData.relatedProgrammeId !== poster.relatedProgrammeId) {
      const prog = (this.data.programmes || []).find(p => p.id === updateData.relatedProgrammeId);
      if (prog) updateData.relatedProgrammeTitle = prog.title;
    }

    // Auto-resolve competition title if changed
    if (updateData.relatedCompetitionId && updateData.relatedCompetitionId !== poster.relatedCompetitionId) {
      const comp = this.getCompetitionById(updateData.relatedCompetitionId);
      if (comp) updateData.relatedCompetitionTitle = comp.title;
    }

    if (updateData.status && updateData.status !== poster.status) {
      if (!poster.approvalHistory) poster.approvalHistory = [];
      poster.approvalHistory.push({
        status: updateData.status,
        changedBy: adminUser,
        changedAt: new Date().toISOString(),
        reason: updateData.statusReason || `Status changed to ${updateData.status}`
      });
      if (updateData.status === 'Archived') {
        poster.isArchived = true;
      } else if (poster.isArchived && updateData.status !== 'Archived') {
        poster.isArchived = false;
      }
    }

    Object.assign(poster, updateData);
    poster.updatedAt = new Date().toISOString();

    this.addAuditLog('POSTER_UPDATED', adminUser, `Updated poster "${poster.title}" (${poster.id})`);
    this.saveData();
    return poster;
  }

  approvePoster(id, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(`Poster ${id} not found`);

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

    this.addAuditLog('POSTER_APPROVED', adminUser, `Approved poster "${poster.title}" (${poster.id})`);
    this.saveData();
    return poster;
  }

  rejectPoster(id, reason, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(`Poster ${id} not found`);

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

    this.addAuditLog('POSTER_REJECTED', adminUser, `Rejected poster "${poster.title}" (${poster.id}): ${reason}`);
    this.saveData();
    return poster;
  }

  publishPoster(id, isPublished = true, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(`Poster ${id} not found`);

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

    this.addAuditLog('POSTER_PUBLISH_TOGGLE', adminUser, `Set poster "${poster.title}" status to ${newStatus}`);
    this.saveData();
    return poster;
  }

  archivePoster(id, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(`Poster ${id} not found`);

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

    this.addAuditLog('POSTER_ARCHIVED', adminUser, `Archived poster "${poster.title}" (${poster.id})`);
    this.saveData();
    return poster;
  }

  restorePoster(id, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(`Poster ${id} not found`);

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

    this.addAuditLog('POSTER_RESTORED', adminUser, `Restored poster "${poster.title}" (${poster.id}) to Draft`);
    this.saveData();
    return poster;
  }

  deletePoster(id, { adminUser = 'Super Admin' } = {}) {
    const index = (this.data.posters || []).findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Poster ${id} not found`);

    const deleted = this.data.posters.splice(index, 1)[0];
    this.addAuditLog('POSTER_DELETED', adminUser, `Permanently deleted poster "${deleted.title}" (${deleted.id})`);
    this.saveData();
    return deleted;
  }

  replacePosterFile(id, fileData, adminUser = 'Super Admin') {
    const poster = this.getPosterById(id);
    if (!poster) throw new Error(`Poster ${id} not found`);

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
      reason: `Replaced poster file with ${poster.fileName}`
    });

    this.addAuditLog('POSTER_FILE_REPLACED', adminUser, `Replaced graphic file for poster "${poster.title}" (${poster.id})`);
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
      const match = (t.id || '').match(/TMPL-(\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 0);
    const newId = `TMPL-${(maxNum + 1).toString().padStart(2, '0')}`;
    const now = new Date().toISOString();

    const newTemplate = {
      id: newId,
      name: templateData.name || 'Untitled Template',
      category: templateData.category || 'Result Posters',
      previewUrl: templateData.previewUrl || '/assets/brand/official_dalenzia_fest_gold.png',
      originalFileUrl: templateData.originalFileUrl || templateData.previewUrl || '/assets/brand/official_dalenzia_fest_gold.png',
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
    this.addAuditLog('TEMPLATE_CREATED', adminUser, `Created design template "${newTemplate.name}" (${newTemplate.id})`);
    this.saveData();
    return newTemplate;
  }

  updatePosterTemplate(id, updateData, adminUser = 'Super Admin') {
    const template = this.getPosterTemplateById(id);
    if (!template) throw new Error(`Template ${id} not found`);

    Object.assign(template, updateData);
    template.updatedAt = new Date().toISOString();

    this.addAuditLog('TEMPLATE_UPDATED', adminUser, `Updated design template "${template.name}" (${template.id})`);
    this.saveData();
    return template;
  }

  togglePosterTemplateStatus(id, adminUser = 'Super Admin') {
    const template = this.getPosterTemplateById(id);
    if (!template) throw new Error(`Template ${id} not found`);

    template.status = template.status === 'Active' ? 'Inactive' : 'Active';
    template.updatedAt = new Date().toISOString();

    this.addAuditLog('TEMPLATE_STATUS_TOGGLE', adminUser, `Toggled template "${template.name}" to ${template.status}`);
    this.saveData();
    return template;
  }

  archivePosterTemplate(id, adminUser = 'Super Admin') {
    const template = this.getPosterTemplateById(id);
    if (!template) throw new Error(`Template ${id} not found`);

    template.status = 'Archived';
    template.isArchived = true;
    template.updatedAt = new Date().toISOString();

    this.addAuditLog('TEMPLATE_ARCHIVED', adminUser, `Archived template "${template.name}" (${template.id})`);
    this.saveData();
    return template;
  }

  deletePosterTemplate(id, { adminUser = 'Super Admin' } = {}) {
    const index = (this.data.posterTemplates || []).findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Template ${id} not found`);

    const deleted = this.data.posterTemplates.splice(index, 1)[0];
    this.addAuditLog('TEMPLATE_DELETED', adminUser, `Deleted template "${deleted.name}" (${deleted.id})`);
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
    const comp = this.getCompetitionById(competitionId);
    if (!comp) throw new Error(`Competition ${competitionId} not found`);

    // Look up verified result in resultPosters
    const resultPoster = (this.data.resultPosters || []).find(rp => rp.competitionId === competitionId);
    if (!resultPoster && !comp.resultPublished) {
      throw new Error(`No published verified results found for competition ${comp.title}`);
    }

    const firstPrize = resultPoster ? resultPoster.firstPrize : (comp.winners && comp.winners[0]);
    const winnerText = firstPrize ? `Winner: ${firstPrize.name} (${firstPrize.teamName || 'Team'})` : 'Official Proclamation';

    const posterTitle = `${comp.title} — Official Result Proclamation`;
    const posterDesc = `Official verified winner honors folio for ${comp.title} conducted at ${comp.venue || 'Cordova Grand Stage'}. ${winnerText}.`;

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
      fileName: `result_${comp.code || comp.id}.png`,
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
    const notifKey = `ANN-NOTIF-${ann.id}`;
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
        date: `${ann.publishDate || 'Today'}, ${ann.publishTime || 'Now'}`,
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
      const match = (a.id || '').match(/ANN-(\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 0);
    const newId = `ANN-${(maxNum + 1).toString().padStart(2, '0')}`;

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
        const parsedPub = new Date(`${annData.publishDate} ${annData.publishTime}`);
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
        const parsedExp = new Date(`${annData.expiryDate} ${annData.expiryTime || '11:59 PM'}`);
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

    this.addAuditLog('ANNOUNCEMENT_CREATED', adminUser, `Created announcement "${newAnnouncement.title}" (${newAnnouncement.id}) for audience ${newAnnouncement.targetAudience}`);
    this.saveData();
    return newAnnouncement;
  }

  updateAnnouncement(id, updateData, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

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
        const parsed = new Date(`${dateStr} ${timeStr}`);
        if (!isNaN(parsed.getTime())) {
          updateData.publishTimestamp = parsed.toISOString();
          const now = new Date();
          if (parsed > now && (updateData.status || ann.status) !== 'Draft') {
            updateData.status = 'Scheduled';
          }
        }
      } catch (e) { }
    }

    if (updateData.expiryDate) {
      const dateStr = updateData.expiryDate;
      const timeStr = updateData.expiryTime || ann.expiryTime || '11:59 PM';
      try {
        const parsed = new Date(`${dateStr} ${timeStr}`);
        if (!isNaN(parsed.getTime())) {
          updateData.expiryTimestamp = parsed.toISOString();
        }
      } catch (e) { }
    }

    Object.assign(ann, updateData);
    ann.updatedAt = new Date().toISOString();

    if (ann.status === 'Published') {
      this._syncAnnouncementNotification(ann);
    }

    this.addAuditLog('ANNOUNCEMENT_UPDATED', adminUser, `Updated announcement "${ann.title}" (${ann.id})`);
    this.saveData();
    return ann;
  }

  publishAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

    ann.status = 'Published';
    ann.isArchived = false;
    ann.updatedAt = new Date().toISOString();

    this._syncAnnouncementNotification(ann);
    this.addAuditLog('ANNOUNCEMENT_PUBLISHED', adminUser, `Published announcement "${ann.title}" (${ann.id})`);
    this.saveData();
    return ann;
  }

  unpublishAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

    ann.status = 'Draft';
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_UNPUBLISHED', adminUser, `Unpublished announcement "${ann.title}" (${ann.id}) to Draft`);
    this.saveData();
    return ann;
  }

  scheduleAnnouncement(id, publishDate, publishTime, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

    const parsed = new Date(`${publishDate} ${publishTime}`);
    if (isNaN(parsed.getTime())) throw new Error('Invalid schedule date or time');

    ann.publishDate = publishDate;
    ann.publishTime = publishTime;
    ann.publishTimestamp = parsed.toISOString();
    ann.status = 'Scheduled';
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_SCHEDULED', adminUser, `Scheduled announcement "${ann.title}" (${ann.id}) for ${publishDate} ${publishTime}`);
    this.saveData();
    return ann;
  }

  extendAnnouncementExpiry(id, newExpiryDate, newExpiryTime = '11:59 PM', adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

    const parsed = new Date(`${newExpiryDate} ${newExpiryTime}`);
    if (isNaN(parsed.getTime())) throw new Error('Invalid expiry date or time');

    ann.expiryDate = newExpiryDate;
    ann.expiryTime = newExpiryTime;
    ann.expiryTimestamp = parsed.toISOString();
    if (ann.status === 'Expired' && parsed > new Date()) {
      ann.status = 'Published';
    }
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_EXPIRY_EXTENDED', adminUser, `Extended expiry for "${ann.title}" (${ann.id}) to ${newExpiryDate}`);
    this.saveData();
    return ann;
  }

  togglePinAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

    ann.isPinned = !ann.isPinned;
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_PIN_TOGGLED', adminUser, `Toggled pinned status for "${ann.title}" (${ann.id}) to ${ann.isPinned}`);
    this.saveData();
    return ann;
  }

  archiveAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

    ann.status = 'Archived';
    ann.isArchived = true;
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_ARCHIVED', adminUser, `Archived announcement "${ann.title}" (${ann.id})`);
    this.saveData();
    return ann;
  }

  restoreAnnouncement(id, adminUser = 'Super Admin') {
    const ann = this.getAnnouncementById(id);
    if (!ann) throw new Error(`Announcement ${id} not found`);

    ann.status = 'Draft';
    ann.isArchived = false;
    ann.updatedAt = new Date().toISOString();

    this.addAuditLog('ANNOUNCEMENT_RESTORED', adminUser, `Restored announcement "${ann.title}" (${ann.id}) to Draft`);
    this.saveData();
    return ann;
  }

  deleteAnnouncement(id, { adminUser = 'Super Admin' } = {}) {
    const index = (this.data.announcements || []).findIndex(a => a.id === id);
    if (index === -1) throw new Error(`Announcement ${id} not found`);

    const deleted = this.data.announcements.splice(index, 1)[0];
    this.addAuditLog('ANNOUNCEMENT_DELETED', adminUser, `Permanently deleted announcement "${deleted.title}" (${deleted.id})`);
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



  // =========================================================================
  // STEP 12: REPORTS & ANALYTICS MODULE INTEGRATION METHODS
  // =========================================================================

  getFestivalAnalyticsOverview(filters = {}) {
    const students = this.getStudents();
    const teams = this.getTeams();
    const competitions = this.getCompetitions();
    const programmes = this.getProgrammes();
    const judges = this.getJudges();
    const guests = this.getProgrammeGuests();
    const posters = this.data.resultPosters || [];
    const gallery = this.data.galleryMedia || [];
    const announcements = this.data.announcements || [];
    const evaluations = this.getAllSubmittedEvaluations();

    // 1. Festival Overview
    const totalStudents = students.length;
    const totalTeams = teams.filter(t => t.status === 'Active' || !t.status).length;
    const totalCompetitions = competitions.length;
    const totalProgrammes = programmes.length;
    const totalJudges = judges.length;
    const activeJudges = judges.filter(j => j.status === 'Active' || !j.status).length;
    const totalProgrammeGuests = guests.length;
    const publishedPosters = posters.filter(p => p.status === 'Published');
    const totalPublishedResults = publishedPosters.length;
    const totalGalleryMedia = gallery.length;

    // 2. Competition Overview
    let totalCompetitionRegistrations = 0;
    const categoryMap = {};
    competitions.forEach(c => {
      const regCount = c.participants?.length || c.registeredCount || 0;
      totalCompetitionRegistrations += regCount;
      const cat = c.category || 'General';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { name: cat, count: 0, publishedCount: 0, registrations: 0 };
      }
      categoryMap[cat].count++;
      categoryMap[cat].registrations += regCount;
      if (c.isPublished || (c.resultPoster && c.resultPoster.status === 'Published')) {
        categoryMap[cat].publishedCount++;
      }
    });

    const completedCompetitions = competitions.filter(c => c.isPublished || c.status === 'Approved' || c.status === 'Completed').length;
    const pendingEvaluations = competitions.filter(c => !c.isPublished && (c.status === 'Under Verification' || (c.submittedEvaluationsCount > 0 && c.submittedEvaluationsCount < (c.assignedJudgeIds?.length || 1)))).length;

    const competitionCategories = Object.values(categoryMap);

    // 3. Programme Overview
    const scheduledProgrammes = programmes.filter(p => p.status === 'Scheduled').length;
    const completedProgrammes = programmes.filter(p => p.status === 'Completed').length;
    const cancelledProgrammes = programmes.filter(p => p.status === 'Cancelled').length;
    const upcomingProgrammes = scheduledProgrammes;
    const guestParticipation = programmes.filter(p => p.guestName || p.guestId || p.guest).length;

    const progCategoryMap = {};
    programmes.forEach(p => {
      const cat = p.category || 'General';
      progCategoryMap[cat] = (progCategoryMap[cat] || 0) + 1;
    });
    const programmeCategories = Object.entries(progCategoryMap).map(([name, count]) => ({
      name,
      count,
      percentage: totalProgrammes > 0 ? Math.round((count / totalProgrammes) * 100) : 0
    }));

    // 4. Team Overview
    const totalTeamPoints = teams.reduce((acc, t) => acc + (t.points || 0), 0);
    const sortedTeams = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

    let firstPositionsCount = 0;
    let secondPositionsCount = 0;
    let thirdPositionsCount = 0;
    publishedPosters.forEach(p => {
      if (p.firstPrize) firstPositionsCount++;
      if (p.secondPrize) secondPositionsCount++;
      if (p.thirdPrize) thirdPositionsCount++;
    });

    const teamPerformanceSummary = sortedTeams.map(t => {
      let firsts = 0;
      let seconds = 0;
      let thirds = 0;
      publishedPosters.forEach(p => {
        if (p.firstPrize?.teamId === t.id) firsts++;
        if (p.secondPrize?.teamId === t.id) seconds++;
        if (p.thirdPrize?.teamId === t.id) thirds++;
      });
      return {
        teamId: t.id,
        teamCode: t.code,
        teamName: t.name,
        subname: t.subname,
        points: t.points || 0,
        rank: t.rank || 0,
        badge: t.badge,
        firsts,
        seconds,
        thirds,
        totalAwards: firsts + seconds + thirds
      };
    });

    return {
      festivalOverview: {
        totalStudents,
        totalTeams,
        totalCompetitions,
        totalProgrammes,
        totalJudges,
        activeJudges,
        totalProgrammeGuests,
        totalPublishedResults,
        totalGalleryMedia,
        totalAnnouncements: announcements.filter(a => a.status === 'Published').length,
        totalPosters: (this.data.posters || []).length
      },
      competitionOverview: {
        totalRegistrations: totalCompetitionRegistrations,
        completedCompetitions,
        pendingEvaluations,
        publishedResults: totalPublishedResults,
        categories: competitionCategories
      },
      programmeOverview: {
        totalProgrammes,
        scheduledProgrammes,
        completedProgrammes,
        cancelledProgrammes,
        upcomingProgrammes,
        guestParticipation,
        categories: programmeCategories
      },
      teamOverview: {
        totalTeamPoints,
        rankedTeams: teamPerformanceSummary,
        firstPositionsAwarded: firstPositionsCount,
        secondPositionsAwarded: secondPositionsCount,
        thirdPositionsAwarded: thirdPositionsCount,
        totalAwardsAwarded: firstPositionsCount + secondPositionsCount + thirdPositionsCount,
        topTeam: sortedTeams[0] || null,
        averageTeamPoints: teams.length > 0 ? Math.round(totalTeamPoints / teams.length) : 0
      }
    };
  }

  getTeamPerformanceReports(filters = {}) {
    const teams = this.getTeams();
    const students = this.getStudents();
    const competitions = this.getCompetitions();
    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published');

    let reports = teams.map(t => {
      // Find students belonging to this team
      const teamStudents = students.filter(s => s.teamId === t.id);

      // Count competition registrations for this team
      let compRegs = 0;
      competitions.forEach(c => {
        (c.participants || []).forEach(p => {
          if (p.teamId === t.id || teamStudents.some(s => s.id === p.studentId)) {
            compRegs++;
          }
        });
      });

      // Aggregate awards won by this team
      let firsts = 0;
      let seconds = 0;
      let thirds = 0;
      const resultsList = [];
      const categoryPoints = {};

      posters.forEach(p => {
        if (p.firstPrize?.teamId === t.id) {
          firsts++;
          const pts = p.firstPrize.points || 30;
          categoryPoints[p.category] = (categoryPoints[p.category] || 0) + pts;
          resultsList.push({
            competitionTitle: p.competitionTitle,
            category: p.category,
            position: '1st Prize (Gold)',
            rank: 1,
            studentName: p.firstPrize.name,
            chestNo: p.firstPrize.chestNo,
            score: p.firstPrize.score,
            points: pts,
            date: p.date
          });
        }
        if (p.secondPrize?.teamId === t.id) {
          seconds++;
          const pts = p.secondPrize.points || 20;
          categoryPoints[p.category] = (categoryPoints[p.category] || 0) + pts;
          resultsList.push({
            competitionTitle: p.competitionTitle,
            category: p.category,
            position: '2nd Prize (Silver)',
            rank: 2,
            studentName: p.secondPrize.name,
            chestNo: p.secondPrize.chestNo,
            score: p.secondPrize.score,
            points: pts,
            date: p.date
          });
        }
        if (p.thirdPrize?.teamId === t.id) {
          thirds++;
          const pts = p.thirdPrize.points || 10;
          categoryPoints[p.category] = (categoryPoints[p.category] || 0) + pts;
          resultsList.push({
            competitionTitle: p.competitionTitle,
            category: p.category,
            position: '3rd Prize (Bronze)',
            rank: 3,
            studentName: p.thirdPrize.name,
            chestNo: p.thirdPrize.chestNo,
            score: p.thirdPrize.score,
            points: pts,
            date: p.date
          });
        }
      });

      return {
        teamId: t.id,
        teamCode: t.code,
        teamName: t.name,
        subname: t.subname,
        leader: t.leader,
        leaderContact: t.leaderContact,
        totalStudents: t.members || teamStudents.length,
        actualStudentRecordsCount: teamStudents.length,
        totalCompetitionRegistrations: compRegs,
        totalParticipations: compRegs,
        firstPositions: firsts,
        secondPositions: seconds,
        thirdPositions: thirds,
        totalAwards: firsts + seconds + thirds,
        totalPoints: t.points || 0,
        currentRank: t.rank || 1,
        badge: t.badge,
        status: t.status || 'Active',
        results: resultsList,
        categoryPerformance: categoryPoints
      };
    });

    // Apply Filters
    if (filters.teamId && filters.teamId !== 'all') {
      reports = reports.filter(r => r.teamId === filters.teamId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.teamName.toLowerCase().includes(q) ||
        r.teamCode.toLowerCase().includes(q) ||
        (r.subname && r.subname.toLowerCase().includes(q)) ||
        (r.leader && r.leader.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sortBy === 'name_asc') {
      reports.sort((a, b) => a.teamName.localeCompare(b.teamName));
    } else if (filters.sortBy === 'awards_desc') {
      reports.sort((a, b) => b.totalAwards - a.totalAwards || (b.totalPoints - a.totalPoints));
    } else {
      // Default: Official Rank
      reports.sort((a, b) => (a.currentRank || 999) - (b.currentRank || 999));
    }

    return reports;
  }

  getStudentPerformanceReports(filters = {}) {
    const students = this.getStudents();
    const competitions = this.getCompetitions();
    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published');

    let reports = students.map(s => {
      // Competitions registered
      const regComps = [];
      competitions.forEach(c => {
        const isParticipant = (c.participants || []).some(
          p => p.studentId === s.id || p.chestNo === s.chestNo
        );
        if (isParticipant) {
          regComps.push({
            competitionId: c.competitionId || c.id,
            code: c.code || c.competitionCode,
            title: c.title || c.competitionTitle,
            category: c.category,
            venue: c.venue,
            date: c.date,
            time: c.time
          });
        }
      });

      // Awards won
      const awards = [];
      let earnedPoints = 0;

      posters.forEach(p => {
        if (p.firstPrize && (p.firstPrize.chestNo === s.chestNo || p.firstPrize.name.toLowerCase() === s.name.toLowerCase())) {
          const pts = p.firstPrize.points || 30;
          earnedPoints += pts;
          awards.push({
            competitionTitle: p.competitionTitle,
            competitionCode: p.competitionCode,
            category: p.category,
            position: '1st Prize (Gold)',
            rank: 1,
            score: p.firstPrize.score,
            points: pts,
            publishedAt: p.publishedAt
          });
        }
        if (p.secondPrize && (p.secondPrize.chestNo === s.chestNo || p.secondPrize.name.toLowerCase() === s.name.toLowerCase())) {
          const pts = p.secondPrize.points || 20;
          earnedPoints += pts;
          awards.push({
            competitionTitle: p.competitionTitle,
            competitionCode: p.competitionCode,
            category: p.category,
            position: '2nd Prize (Silver)',
            rank: 2,
            score: p.secondPrize.score,
            points: pts,
            publishedAt: p.publishedAt
          });
        }
        if (p.thirdPrize && (p.thirdPrize.chestNo === s.chestNo || p.thirdPrize.name.toLowerCase() === s.name.toLowerCase())) {
          const pts = p.thirdPrize.points || 10;
          earnedPoints += pts;
          awards.push({
            competitionTitle: p.competitionTitle,
            competitionCode: p.competitionCode,
            category: p.category,
            position: '3rd Prize (Bronze)',
            rank: 3,
            score: p.thirdPrize.score,
            points: pts,
            publishedAt: p.publishedAt
          });
        }
      });

      return {
        studentId: s.id,
        chestNo: s.chestNo,
        name: s.name,
        teamId: s.teamId,
        teamName: s.teamName,
        classCategory: s.classCategory || 'General',
        institution: s.institution,
        registeredCompetitions: regComps,
        registeredCount: regComps.length || s.registeredEventsCount || 0,
        results: awards,
        prizesCount: awards.length,
        totalPoints: earnedPoints || s.totalPoints || 0
      };
    });

    // Apply Filters
    if (filters.teamId && filters.teamId !== 'all') {
      reports = reports.filter(r => r.teamId === filters.teamId);
    }
    if (filters.classCategory && filters.classCategory !== 'all') {
      reports = reports.filter(r => r.classCategory === filters.classCategory);
    }
    if (filters.resultStatus === 'awarded') {
      reports = reports.filter(r => r.prizesCount > 0);
    } else if (filters.resultStatus === 'unawarded') {
      reports = reports.filter(r => r.prizesCount === 0);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.chestNo.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q) ||
        (r.teamName && r.teamName.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sortBy === 'points_desc') {
      reports.sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'name_asc') {
      reports.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'chest_asc') {
      reports.sort((a, b) => a.chestNo.localeCompare(b.chestNo));
    } else {
      // Default: Prizes count desc, then registered desc
      reports.sort((a, b) => b.prizesCount - a.prizesCount || b.registeredCount - a.registeredCount);
    }

    return reports;
  }

  getCompetitionReports(filters = {}) {
    const competitions = this.getCompetitions();
    const posters = this.data.resultPosters || [];

    let reports = competitions.map(c => {
      const poster = posters.find(p => p.competitionId === (c.competitionId || c.id) || p.competitionCode === (c.code || c.competitionCode));
      const isPublished = !!(c.isPublished || (poster && poster.status === 'Published'));

      const winners = [];
      const sourcePoster = poster || c.resultPoster;
      if (sourcePoster) {
        if (sourcePoster.firstPrize) {
          winners.push({
            position: '1st Prize (Gold)',
            rank: 1,
            name: sourcePoster.firstPrize.name,
            chestNo: sourcePoster.firstPrize.chestNo,
            teamName: sourcePoster.firstPrize.teamName,
            teamId: sourcePoster.firstPrize.teamId,
            score: sourcePoster.firstPrize.score,
            points: sourcePoster.firstPrize.points || 30
          });
        }
        if (sourcePoster.secondPrize) {
          winners.push({
            position: '2nd Prize (Silver)',
            rank: 2,
            name: sourcePoster.secondPrize.name,
            chestNo: sourcePoster.secondPrize.chestNo,
            teamName: sourcePoster.secondPrize.teamName,
            teamId: sourcePoster.secondPrize.teamId,
            score: sourcePoster.secondPrize.score,
            points: sourcePoster.secondPrize.points || 20
          });
        }
        if (sourcePoster.thirdPrize) {
          winners.push({
            position: '3rd Prize (Bronze)',
            rank: 3,
            name: sourcePoster.thirdPrize.name,
            chestNo: sourcePoster.thirdPrize.chestNo,
            teamName: sourcePoster.thirdPrize.teamName,
            teamId: sourcePoster.thirdPrize.teamId,
            score: sourcePoster.thirdPrize.score,
            points: sourcePoster.thirdPrize.points || 10
          });
        }
      }

      // Evaluation progress
      let evalStatus = 'Pending';
      if (isPublished) {
        evalStatus = 'Published';
      } else if (c.status === 'Under Verification') {
        evalStatus = 'Under Verification';
      } else if (c.submittedEvaluationsCount > 0) {
        evalStatus = 'In Progress';
      }

      return {
        competitionId: c.competitionId || c.id,
        code: c.code || c.competitionCode,
        title: c.title || c.competitionTitle,
        category: c.category,
        type: c.type || 'Individual',
        venue: c.venue,
        date: c.date,
        time: c.time,
        registeredParticipantsCount: c.participants?.length || c.registeredCount || 0,
        participants: c.participants || [],
        assignedJudgesCount: c.assignedJudgeIds?.length || 0,
        assignedJudges: (c.assignedJudges || []).map(j => j.name),
        submittedEvaluationsCount: c.submittedEvaluationsCount || 0,
        evaluationStatus: evalStatus,
        isPublished,
        publishedAt: c.publishedAt || (poster ? poster.publishedAt : null),
        winners
      };
    });

    // Apply Filters
    if (filters.category && filters.category !== 'all') {
      reports = reports.filter(r => r.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      reports = reports.filter(r => r.evaluationStatus.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.date && filters.date !== 'all') {
      reports = reports.filter(r => r.date === filters.date);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.venue.toLowerCase().includes(q)
      );
    }

    return reports;
  }

  getJudgeActivityReports(filters = {}) {
    const judges = this.getJudges();
    const competitions = this.getCompetitions();

    let reports = judges.map(j => {
      const assignedIds = j.assignedCompIds || [];
      const submittedIds = j.submittedCompIds || [];
      const assignedCount = assignedIds.length;
      const submittedCount = submittedIds.length;
      const pendingCount = Math.max(0, assignedCount - submittedCount);
      const completionPct = assignedCount > 0 ? Math.round((submittedCount / assignedCount) * 100) : 100;

      let completionStatus = 'Pending';
      if (assignedCount > 0 && submittedCount >= assignedCount) {
        completionStatus = 'Completed';
      } else if (submittedCount > 0) {
        completionStatus = 'In Progress';
      }

      // Details of assigned competitions
      const assignedCompDetails = assignedIds.map(id => {
        const comp = competitions.find(c => (c.competitionId || c.id) === id);
        return {
          id,
          code: comp?.code || comp?.competitionCode || id,
          title: comp?.title || comp?.competitionTitle || 'Official Festival Event',
          category: comp?.category || 'General',
          submitted: submittedIds.includes(id)
        };
      });

      return {
        judgeId: j.id,
        name: j.name,
        designation: j.designation,
        institution: j.institution,
        phone: j.phone,
        email: j.email,
        status: j.status || 'Active',
        qualification: j.qualification,
        avatarColor: j.avatarColor || '#A91F35',
        assignedCount,
        submittedCount,
        pendingCount,
        completionPercentage: completionPct,
        completionStatus,
        assignedCompetitions: assignedCompDetails
      };
    });

    // Apply Filters
    if (filters.status && filters.status !== 'all') {
      reports = reports.filter(r => r.completionStatus.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.institution && r.institution.toLowerCase().includes(q)) ||
        (r.designation && r.designation.toLowerCase().includes(q))
      );
    }

    return reports;
  }

  getProgrammeReports(filters = {}) {
    const programmes = this.getProgrammes();

    let reports = programmes.map(p => {
      return {
        programmeId: p.id,
        code: p.code,
        title: p.title,
        malayalamTitle: p.malayalamTitle,
        category: p.category,
        date: p.date,
        time: p.time,
        startTime: p.startTime,
        endTime: p.endTime,
        venue: p.venue,
        status: p.status || 'Scheduled',
        coordinatorName: p.coordinatorName,
        coordinatorPhone: p.coordinatorPhone,
        guestName: p.guestName || p.guest?.name || null,
        relatedCompetitionTitle: p.relatedComp || p.relatedCompetition?.title || null,
        isPublished: !!p.isPublished
      };
    });

    // Apply Filters
    if (filters.category && filters.category !== 'all') {
      reports = reports.filter(r => r.category === filters.category);
    }
    if (filters.date && filters.date !== 'all') {
      reports = reports.filter(r => r.date === filters.date);
    }
    if (filters.venue && filters.venue !== 'all') {
      reports = reports.filter(r => r.venue.toLowerCase().includes(filters.venue.toLowerCase()));
    }
    if (filters.status && filters.status !== 'all') {
      reports = reports.filter(r => r.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      reports = reports.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        (r.venue && r.venue.toLowerCase().includes(q)) ||
        (r.coordinatorName && r.coordinatorName.toLowerCase().includes(q))
      );
    }

    return reports;
  }

  getResultScoringReports(filters = {}) {
    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published');
    const competitions = this.getCompetitions();
    const teams = this.getTeams();

    const winnersList = [];
    posters.forEach(p => {
      if (p.firstPrize) {
        winnersList.push({
          competitionId: p.competitionId,
          competitionTitle: p.competitionTitle,
          competitionCode: p.competitionCode,
          category: p.category,
          position: '1st Prize (Gold)',
          rank: 1,
          name: p.firstPrize.name,
          chestNo: p.firstPrize.chestNo,
          teamId: p.firstPrize.teamId,
          teamName: p.firstPrize.teamName,
          score: p.firstPrize.score,
          points: p.firstPrize.points || 30,
          publishedAt: p.publishedAt
        });
      }
      if (p.secondPrize) {
        winnersList.push({
          competitionId: p.competitionId,
          competitionTitle: p.competitionTitle,
          competitionCode: p.competitionCode,
          category: p.category,
          position: '2nd Prize (Silver)',
          rank: 2,
          name: p.secondPrize.name,
          chestNo: p.secondPrize.chestNo,
          teamId: p.secondPrize.teamId,
          teamName: p.secondPrize.teamName,
          score: p.secondPrize.score,
          points: p.secondPrize.points || 20,
          publishedAt: p.publishedAt
        });
      }
      if (p.thirdPrize) {
        winnersList.push({
          competitionId: p.competitionId,
          competitionTitle: p.competitionTitle,
          competitionCode: p.competitionCode,
          category: p.category,
          position: '3rd Prize (Bronze)',
          rank: 3,
          name: p.thirdPrize.name,
          chestNo: p.thirdPrize.chestNo,
          teamId: p.thirdPrize.teamId,
          teamName: p.thirdPrize.teamName,
          score: p.thirdPrize.score,
          points: p.thirdPrize.points || 10,
          publishedAt: p.publishedAt
        });
      }
    });

    const pendingApprovals = competitions.filter(c => !c.isPublished && c.status === 'Under Verification');

    return {
      publishedResultsCount: posters.length,
      pendingApprovalsCount: pendingApprovals.length,
      publishedResults: posters,
      pendingCompetitions: pendingApprovals,
      winnersList,
      teamLeaderboard: [...teams].sort((a, b) => (b.points || 0) - (a.points || 0))
    };
  }

  getFestivalActivityReports(filters = {}) {
    const auditLogs = this.getAuditLogs();
    const students = this.getStudents();
    const competitions = this.getCompetitions();
    const programmes = this.getProgrammes();
    const gallery = this.data.galleryMedia || [];
    const announcements = this.data.announcements || [];
    const posters = this.data.posters || [];

    const stats = {
      totalStudentsEnrolled: students.length,
      totalCompetitionsConfigured: competitions.length,
      totalProgrammesScheduled: programmes.length,
      totalGalleryMediaUploaded: gallery.length,
      totalAnnouncementsBroadcast: announcements.length,
      totalPostersGenerated: posters.length,
      totalAuditLogsRecorded: auditLogs.length
    };

    return {
      stats,
      recentAuditTrail: auditLogs.slice(0, 50)
    };
  }



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
        token: `jwt_convener_${Date.now()}`,
        loginTime: new Date().toLocaleTimeString()
      };
      this.addAuditLog('CONVENER_LOGIN', `Convener ${user.name} authenticated into Convener Operational Portal`, 'Convener');
      return { success: true, session };
    }
    return { success: false, error: 'Invalid Convener credentials. Access restricted to authorized Festival Convener.' };
  }

  verifyAdminLogin(identifier, password, role = 'super_admin') {
    const cleanId = (identifier || '').trim().toLowerCase();
    // Strictly prevent convener from accessing Developer/Admin
    if (cleanId === 'convener' || cleanId === 'convener@dalenziafest.in') {
      return {
        success: false,
        error: 'Access Denied: Convener account cannot access the Developer / Admin Control Centre. Please use the designated Convener portal.'
      };
    }

    const validUser = (
      cleanId === 'admin@dalenziafest.in' ||
      cleanId === 'admin' ||
      cleanId === 'developer' ||
      cleanId === 'dev@dalenziafest.in' ||
      cleanId === 'basim' ||
      cleanId === 'basimaslam'
    );
    const validPass = (
      password === 'dalenzia2k26' ||
      password === 'admin2k26' ||
      password === 'dev2k26' ||
      password === 'basim2k26'
    );

    if (validUser && validPass) {
      const session = {
        user: cleanId.includes('dev') || cleanId.includes('basim') ? 'Basim Aslam (Developer)' : 'Super Admin',
        email: cleanId.includes('dev') ? 'developer@dalenziafest.in' : cleanId.includes('basim') ? 'basim@dalenziafest.in' : 'admin@dalenziafest.in',
        role: role || 'super_admin',
        roleLabel: role === 'super_admin' ? 'Super Admin' : role === 'result_mgr' ? 'Tabulation Manager' : 'Developer Admin',
        token: `dalenzia_jwt_${Date.now()}`,
        loginTime: new Date().toLocaleTimeString()
      };
      this.addAuditLog('DEVELOPER_ADMIN_LOGIN', `Authorized user ${session.user} authenticated into Developer & Admin Control Centre`, 'Developer');
      return { success: true, session };
    }

    return {
      success: false,
      error: 'Invalid developer credentials. Access restricted to authorized System Developers and Super Administrators.'
    };
  }

  // =========================================================================
  // CONVENER HELPDESK & PROBLEM REPORT METHODS
  // =========================================================================
  submitHelpdeskTicket({ userName, userId, portal, category, description }) {
    if (!this.data.helpdeskTickets) this.data.helpdeskTickets = [];
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticket = {
      id: ticketId,
      userName: userName || 'Authenticated User',
      userId: userId || 'UID-GUEST',
      portal: portal || 'Public Portal',
      category: category || 'General Query',
      description: description || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      formattedTime: new Date().toLocaleString()
    };
    this.data.helpdeskTickets.unshift(ticket);
    this.addAuditLog('HELPDESK_TICKET_SUBMITTED', `New Helpdesk Ticket ${ticketId} from ${ticket.userName} (${ticket.portal})`, ticket.portal);
    this.saveData();
    this._notify();
    return { success: true, ticket };
  }

  getHelpdeskTickets() {
    return this.data.helpdeskTickets || [];
  }

  updateHelpdeskTicketStatus(ticketId, newStatus) {
    if (!this.data.helpdeskTickets) this.data.helpdeskTickets = [];
    const idx = this.data.helpdeskTickets.findIndex(t => t.id === ticketId);
    if (idx !== -1) {
      this.data.helpdeskTickets[idx].status = newStatus;
      this.data.helpdeskTickets[idx].updatedAt = new Date().toISOString();
      this.saveData();
      this._notify();
      return { success: true, ticket: this.data.helpdeskTickets[idx] };
    }
    return { success: false, error: 'Ticket not found' };
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
    this.addAuditLog('CONVENER_PROFILE_UPDATED', `Convener profile information updated`, 'Convener');
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
    this.addAuditLog('CONVENER_PASSWORD_CHANGED', `Convener access credentials updated securely`, 'Convener');
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
        { id: 1, type: 'warning', title: 'Pending Evaluations', text: `${pendingEvaluations} competition evaluations currently awaiting jury submission/cross-verification.` },
        { id: 2, type: 'info', title: 'Unscheduled Programmes', text: `${unscheduledProgrammes} stage sessions still require official slot allocation in master schedule.` },
        { id: 3, type: 'success', title: 'Guest Invitations', text: `${guests.length - pendingGuests} scholars confirmed attendance; ${pendingGuests} invitations pending RSVP.` }
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
    const autoId = `STG-${String(nextIdx).padStart(2, '0')}`;

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
    this.addAuditLog('STAGE_CREATED', `Created new festival stage ${newStage.name} (Capacity: ${newStage.capacity})`, user);
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

    this.addAuditLog('STAGE_UPDATED', `Updated stage details for ${this.data.programmeStages[idx].name}`, user);
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
      throw new Error(`Cannot delete stage ${stage.name} because sessions are actively scheduled on this stage. Reassign those sessions first.`);
    }

    this.data.programmeStages = this.data.programmeStages.filter(s => s.id !== id);
    this.addAuditLog('STAGE_DELETED', `Deleted festival stage ${stage.name}`, user);
    this.saveData();
    this._notify();
    return { success: true };
  }

  toggleProgrammeStageStatus(id, user = 'Convener') {
    if (!this.data.programmeStages) this.data.programmeStages = [];
    const stage = this.data.programmeStages.find(s => s.id === id);
    if (!stage) throw new Error('Stage not found.');

    stage.status = stage.status === 'Active' ? 'Maintenance' : 'Active';
    this.addAuditLog('STAGE_STATUS_TOGGLED', `Toggled status of stage ${stage.name} to ${stage.status}`, user);
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
    const autoId = `ACT-${String(nextNum).padStart(3, '0')}`;
    const autoCode = `ACT-OP-${String(nextNum).padStart(2, '0')}`;

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
    this.addAuditLog('ACTIVITY_CREATED', `Created operational activity ${newAct.title} (${newAct.responsiblePerson})`, user);
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

    this.addAuditLog('ACTIVITY_UPDATED', `Updated activity details for ${this.data.operationalActivities[idx].title}`, user);
    this.saveData();
    this._notify();
    return { success: true, activity: this.data.operationalActivities[idx] };
  }

  deleteOperationalActivity(id, user = 'Convener') {
    if (!this.data.operationalActivities) this.data.operationalActivities = [...INITIAL_OPERATIONAL_ACTIVITIES];
    const act = this.data.operationalActivities.find(a => a.id === id);
    if (!act) throw new Error('Operational activity not found.');

    this.data.operationalActivities = this.data.operationalActivities.filter(a => a.id !== id);
    this.addAuditLog('ACTIVITY_DELETED', `Deleted operational activity ${act.title}`, user);
    this.saveData();
    this._notify();
    return { success: true };
  }

  updateOperationalActivityStatus(id, status, user = 'Convener') {
    if (!this.data.operationalActivities) this.data.operationalActivities = [...INITIAL_OPERATIONAL_ACTIVITIES];
    const act = this.data.operationalActivities.find(a => a.id === id);
    if (!act) throw new Error('Operational activity not found.');

    act.status = status;
    this.addAuditLog('ACTIVITY_STATUS_CHANGED', `Updated status of ${act.title} to ${status}`, user);
    this.saveData();
    this._notify();
    return { success: true, activity: act };
  }

  // =========================================================================
  // CONVENER RESULT MANAGEMENT & FINAL PUBLISHING WORKFLOW
  // =========================================================================

  getConvenerResultStats() {
    const assignments = this.data.programmeAssignments || [];
    const evals = this.data.submittedEvaluations || [];
    const posters = this.data.resultPosters || [];

    const totalCompetitions = assignments.length;
    const competitionsWithJudges = assignments.filter(a => Array.isArray(a.assignedJudgeIds) && a.assignedJudgeIds.length > 0).length;

    // Count assigned judges across all competitions whose evaluation is not yet submitted/approved
    let pendingJudgeEvaluations = 0;
    assignments.forEach(a => {
      const judgeIds = a.assignedJudgeIds || [];
      judgeIds.forEach(jId => {
        const hasEval = evals.some(e =>
          (e.competitionId === a.competitionId || e.assignmentId === a.id) &&
          e.judgeId === jId &&
          (e.status === 'Submitted' || e.status === 'Verified' || e.status === 'Approved' || e.status === 'Under Verification')
        );
        if (!hasEval) pendingJudgeEvaluations++;
      });
    });

    const submittedJudgeEvaluations = evals.filter(e =>
      e.status === 'Submitted' || e.status === 'Verified' || e.status === 'Approved' || e.status === 'Under Verification'
    ).length;

    // Competitions with at least 1 evaluation submitted but not yet convener-approved
    const resultsAwaitingConvenerReview = assignments.filter(a => {
      const hasEvals = evals.some(e => e.competitionId === a.competitionId || e.assignmentId === a.id);
      const isApproved = a.convenerApproved || a.status === 'Approved by Convener' || a.status === 'Approved' || a.isPublished || a.isOfficialPublished;
      return hasEvals && !isApproved;
    }).length;

    const resultsApprovedByConvener = assignments.filter(a =>
      (a.convenerApproved || a.status === 'Approved by Convener' || a.status === 'Approved') &&
      !a.isPublished && !a.isOfficialPublished
    ).length;

    const publishedOfficialResults = assignments.filter(a =>
      a.isOfficialPublished || a.isPublished || a.status === 'Officially Published' || a.status === 'Published'
    ).length || posters.length;

    return {
      totalCompetitions,
      competitionsWithJudges,
      pendingJudgeEvaluations,
      submittedJudgeEvaluations,
      resultsAwaitingConvenerReview,
      resultsApprovedByConvener,
      publishedOfficialResults
    };
  }

  getJudgeEvaluationTracking(competitionId = null) {
    const assignments = this.data.programmeAssignments || [];
    const evals = this.data.submittedEvaluations || [];
    const judges = this.data.judges || [];

    const filteredAssignments = competitionId
      ? assignments.filter(a => a.competitionId === competitionId || a.id === competitionId)
      : assignments;

    const trackingList = [];

    filteredAssignments.forEach(a => {
      const assignedJudgeIds = a.assignedJudgeIds || [];
      const participants = a.participants || [];

      assignedJudgeIds.forEach(jId => {
        const judge = judges.find(j => j.id === jId) || { id: jId, name: `Judge ${jId}`, email: '' };
        const evalObj = evals.find(e =>
          (e.competitionId === a.competitionId || e.assignmentId === a.id) &&
          e.judgeId === jId
        );

        let status = 'Not Started';
        let submittedAt = null;
        let pendingParticipantsCount = participants.length;
        let evalId = null;
        let remarks = '';
        let totalScoreSum = 0;
        let correctionReason = null;
        let returnedBy = null;
        let returnedAt = null;

        if (evalObj) {
          evalId = evalObj.id;
          submittedAt = evalObj.submittedAt || null;
          remarks = evalObj.remarks || '';
          correctionReason = evalObj.correctionReason || null;
          returnedBy = evalObj.returnedBy || null;
          returnedAt = evalObj.returnedAt || null;

          if (evalObj.status === 'Correction Requested' || evalObj.status === 'Returned for Correction') {
            status = 'Returned for Correction';
          } else if (evalObj.status === 'Approved') {
            status = 'Approved';
            pendingParticipantsCount = 0;
          } else if (evalObj.status === 'Verified' || evalObj.status === 'Under Verification') {
            status = 'Awaiting Approval';
            pendingParticipantsCount = 0;
          } else if (evalObj.status === 'Submitted') {
            status = 'Submitted';
            pendingParticipantsCount = 0;
          } else if (evalObj.status === 'Draft' || evalObj.status === 'In Progress') {
            status = 'In Progress';
            const scoredCount = (evalObj.scores || []).filter(s => s.total > 0).length;
            pendingParticipantsCount = Math.max(0, participants.length - scoredCount);
          }

          if (Array.isArray(evalObj.scores)) {
            totalScoreSum = evalObj.scores.reduce((sum, s) => sum + (s.total || 0), 0);
          }
        }

        trackingList.push({
          assignmentId: a.id,
          competitionId: a.competitionId,
          competitionCode: a.competitionCode,
          competitionTitle: a.competitionTitle,
          category: a.category,
          venue: a.venue,
          date: a.date,
          assignedDate: a.date,
          assignmentStatus: a.status,
          isOfficialPublished: Boolean(a.isOfficialPublished || a.isPublished),
          convenerApproved: Boolean(a.convenerApproved),
          totalJudgesAssigned: assignedJudgeIds.length,
          judgeId: judge.id,
          judgeName: judge.name,
          judgeEmail: judge.email,
          judgeDesignation: judge.designation || 'Jury Member',
          status,
          evalId,
          submittedAt,
          pendingParticipantsCount,
          totalParticipants: participants.length,
          totalScoreSum,
          remarks,
          correctionReason,
          returnedBy,
          returnedAt,
          canReturn: status === 'Submitted' || status === 'Awaiting Approval' || status === 'Verified'
        });
      });
    });

    return trackingList;
  }

  getJudgeWiseEvaluations(competitionId) {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) return null;

    const judges = this.data.judges || [];
    const evals = (this.data.submittedEvaluations || []).filter(e =>
      e.competitionId === assignment.competitionId || e.assignmentId === assignment.id
    );

    const assignedJudges = (assignment.assignedJudgeIds || []).map(jId => {
      const j = judges.find(item => item.id === jId);
      const ev = evals.find(e => e.judgeId === jId);
      return {
        ...(j || { id: jId, name: `Judge ${jId}`, email: '' }),
        evaluationSubmitted: Boolean(ev && ev.status !== 'Draft' && ev.status !== 'Correction Requested'),
        evaluationStatus: ev ? ev.status : 'Not Started',
        evaluationId: ev ? ev.id : null,
        submittedAt: ev ? ev.submittedAt : null
      };
    });

    const missingJudges = assignedJudges.filter(j => !j.evaluationSubmitted);
    const aggregatedResult = this.calculateAggregatedResults(assignment.competitionId);

    return {
      assignment,
      assignedJudges,
      judgeEvaluations: evals,
      missingJudges,
      aggregatedResult,
      convenerApproval: assignment.convenerApproval || null,
      isOfficialPublished: Boolean(assignment.isOfficialPublished || assignment.isPublished),
      publishedAt: assignment.officialPublishedAt || assignment.publishedAt || null,
      administrativeCorrections: assignment.administrativeCorrections || []
    };
  }

  convenerAssignJudgesToCompetition({ competitionId, judgeIds, criteria, instructions, assignedBy = 'Usthad Hashir Ali (Convener)' }) {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Competition not found.');

    const previousJudges = assignment.assignedJudgeIds || [];
    assignment.assignedJudgeIds = Array.from(new Set(judgeIds));
    if (criteria && criteria.length > 0) assignment.criteria = criteria;
    if (instructions) assignment.instructions = instructions;
    assignment.assignedBy = assignedBy;
    assignment.assignedAt = new Date().toISOString();
    if (assignment.status === 'Draft' || assignment.status === 'Registration Open') {
      assignment.status = 'Assigned';
    }

    // Notify newly assigned judges
    const newlyAssigned = judgeIds.filter(id => !previousJudges.includes(id));
    newlyAssigned.forEach(jId => {
      this.addNotification({
        title: 'New Evaluation Assignment',
        message: `You have been assigned by Convener to evaluate ${assignment.competitionTitle}`,
        type: 'info',
        targetRole: 'judge',
        targetUserId: jId
      });
    });

    this.addAuditLog(
      'JUDGES_ASSIGNED_BY_CONVENER',
      `Assigned ${judgeIds.length} judges to ${assignment.competitionTitle} by ${assignedBy}`,
      assignedBy
    );
    this.saveData();
    this._notify();
    return { success: true, assignment };
  }

  convenerRemoveJudgeAssignment(competitionId, judgeId, removedBy = 'Usthad Hashir Ali (Convener)') {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Competition not found.');

    // Check if evaluation already submitted
    const ev = (this.data.submittedEvaluations || []).find(e =>
      (e.competitionId === assignment.competitionId || e.assignmentId === assignment.id) &&
      e.judgeId === judgeId &&
      (e.status === 'Submitted' || e.status === 'Verified' || e.status === 'Approved')
    );
    if (ev) {
      throw new Error(`Cannot remove judge ${judgeId}: Evaluation has already been submitted. Return the evaluation for correction first if changes are needed.`);
    }

    assignment.assignedJudgeIds = (assignment.assignedJudgeIds || []).filter(id => id !== judgeId);
    this.addAuditLog(
      'JUDGE_REMOVED_BY_CONVENER',
      `Removed judge ${judgeId} from ${assignment.competitionTitle} by ${removedBy}`,
      removedBy
    );
    this.saveData();
    this._notify();
    return { success: true, assignment };
  }

  convenerReturnEvaluationForCorrection(competitionId, judgeId, { reason, returnedBy = 'Usthad Hashir Ali (Convener)' } = {}) {
    return this.returnEvaluationForCorrection(competitionId, {
      returnedByRole: 'CONVENER',
      returnedByName: returnedBy,
      reason
    });
  }

  convenerApproveResult(competitionId, {
    convenerId = 'CNV-01',
    convenerName = 'Usthad Hashir Ali',
    notes = '',
    aggregationMode = 'average',
    tieBreakerRule = 'criteria_weight',
    allowIncompleteException = false
  } = {}) {
    const res = this.approveEvaluation(competitionId, {
      approvedByRole: 'CONVENER',
      approvedByName: convenerName,
      notes
    });
    const agg = this.calculateAggregatedResults(competitionId, { aggregationMode, tieBreakerRule });
    return { ...res, agg };
  }

  convenerPublishOfficialResult(competitionId, {
    convenerId = 'CNV-01',
    convenerName = 'Usthad Hashir Ali',
    templateStyle = 'editorial_crimson'
  } = {}) {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Competition not found.');

    if (!assignment.convenerApproved && assignment.status !== 'Approved by Convener') {
      throw new Error('Result must be reviewed and approved by Convener before it can be officially published.');
    }

    // Call underlying verified publishing engine (handles poster creation and idempotent team points)
    const pubResult = this.approveAndPublishResult(assignment.competitionId, { templateStyle });

    const now = new Date().toISOString();
    assignment.isOfficialPublished = true;
    assignment.status = 'Officially Published';
    assignment.officialPublishedAt = now;
    assignment.publishedBy = convenerName;
    assignment.publishedById = convenerId;

    if (!this.data.publishedResultsHistory) {
      this.data.publishedResultsHistory = [];
    }

    const historyEntry = {
      id: `PUB-HIST-${Date.now()}`,
      competitionId: assignment.competitionId,
      competitionCode: assignment.competitionCode,
      competitionTitle: assignment.competitionTitle,
      category: assignment.category,
      venue: assignment.venue,
      version: assignment.resultVersion || 1,
      publishedBy: convenerName,
      publishedById: convenerId,
      publishedAt: now,
      podium: pubResult.poster ? pubResult.poster.podium : null,
      totalParticipants: (assignment.participants || []).length,
      assignedJudgesCount: (assignment.assignedJudgeIds || []).length
    };
    this.data.publishedResultsHistory.unshift(historyEntry);

    this.addNotification({
      title: 'Official Result Published',
      message: `OFFICIAL RESULT PUBLISHED: ${assignment.competitionTitle} results are now live on leaderboard and public portals.`,
      type: 'success',
      targetRole: 'public'
    });

    this.addAuditLog(
      'OFFICIAL_RESULT_PUBLISHED_BY_CONVENER',
      `Officially published results for ${assignment.competitionTitle} by ${convenerName}`,
      convenerName
    );

    this.saveData();
    this._notify();
    return { success: true, assignment, poster: pubResult.poster, historyEntry };
  }

  convenerAdministrativeScoreCorrection(competitionId, { studentId, oldScore, newScore, reason, actor = 'Usthad Hashir Ali (Convener)' }) {
    if (!reason || !reason.trim()) {
      throw new Error('A formal justification is strictly required for administrative score correction.');
    }
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Competition not found.');

    if (!assignment.administrativeCorrections) {
      assignment.administrativeCorrections = [];
    }

    const now = new Date().toISOString();
    const correctionRecord = {
      id: `CORR-${Date.now()}`,
      timestamp: now,
      studentId,
      oldScore: parseFloat(oldScore),
      newScore: parseFloat(newScore),
      reason: reason.trim(),
      actor
    };
    assignment.administrativeCorrections.push(correctionRecord);

    // Update relevant evaluation score
    (this.data.submittedEvaluations || []).forEach(e => {
      if ((e.competitionId === assignment.competitionId || e.assignmentId === assignment.id) && Array.isArray(e.scores)) {
        const sc = e.scores.find(s => s.studentId === studentId);
        if (sc) {
          sc.total = parseFloat(newScore);
          sc.administrativeCorrection = correctionRecord;
        }
      }
    });

    this.addAuditLog(
      'ADMINISTRATIVE_SCORE_CORRECTION',
      `Administrative score adjustment for student ${studentId} in ${assignment.competitionTitle} (${oldScore} -> ${newScore}). Reason: ${reason.trim()}`,
      actor
    );

    this.saveData();
    this._notify();
    return { success: true, correctionRecord };
  }

  getPublishedResultsHistory(competitionId = null) {
    let history = this.data.publishedResultsHistory || [];
    if (competitionId) {
      history = history.filter(h => h.competitionId === competitionId || h.competitionCode === competitionId);
    }
    return history;
  }

  // =========================================================================
  // TEAM LEADER PORTAL METHODS & OPERATIONS
  // =========================================================================

  verifyTeamLeaderLogin(emailOrUsername, password) {
    const leaders = this.data.teamLeaders || INITIAL_TEAM_LEADERS;
    const cleanInput = (emailOrUsername || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const leader = leaders.find(l =>
      (l.email.toLowerCase() === cleanInput ||
        (l.alternateEmail && l.alternateEmail.toLowerCase() === cleanInput) ||
        l.username.toLowerCase() === cleanInput) &&
      l.password === cleanPass
    );

    if (!leader) {
      throw new Error('Invalid Team Leader credentials. Check your email/username and password.');
    }

    const team = (this.data.teams || []).find(t => t.id === leader.teamId) || { id: leader.teamId, name: leader.teamName, points: 0, rank: 1 };

    const session = {
      id: leader.id,
      teamId: leader.teamId,
      teamName: team.name,
      teamCode: team.code,
      user: leader.name,
      email: leader.email,
      phone: leader.phone,
      role: 'team_leader',
      roleLabel: 'Official Team Leader',
      status: leader.status,
      token: `jwt_dalenzia_teamleader_${leader.teamId}_${Date.now()}`
    };

    this.addAuditLog('TEAM_LEADER_LOGIN', `Team Leader ${leader.name} logged into portal for ${team.name}`, leader.name);
    return { success: true, session };
  }

  getTeamLeaderProfile(teamId) {
    const leaders = this.data.teamLeaders || INITIAL_TEAM_LEADERS;
    const leader = leaders.find(l => l.teamId === teamId);
    if (!leader) {
      const team = (this.data.teams || []).find(t => t.id === teamId);
      return {
        id: `TL-${teamId}`,
        teamId,
        teamName: team ? team.name : 'Unknown Team',
        name: team ? team.leader : 'Team Leader',
        email: `leader@dalenziafest.in`,
        phone: team ? team.leaderContact : '+91 98471 20000',
        role: 'team_leader'
      };
    }
    return leader;
  }

  updateTeamLeaderProfile(teamId, { phone, email, bio }) {
    if (!this.data.teamLeaders) this.data.teamLeaders = [...INITIAL_TEAM_LEADERS];
    const leader = this.data.teamLeaders.find(l => l.teamId === teamId);
    if (!leader) throw new Error('Team Leader profile not found.');

    if (phone) leader.phone = phone.trim();
    if (email) leader.email = email.trim();
    if (bio !== undefined) leader.bio = bio.trim();

    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (team && phone) {
      team.leaderContact = phone.trim();
    }

    this.addAuditLog('TEAM_LEADER_PROFILE_UPDATED', `Updated contact profile for Team Leader of ${leader.teamName}`, leader.name);
    this.saveData();
    this._notify();
    return { success: true, leader };
  }

  updateTeamLeaderPassword(teamId, oldPassword, newPassword) {
    if (!this.data.teamLeaders) this.data.teamLeaders = [...INITIAL_TEAM_LEADERS];
    const leader = this.data.teamLeaders.find(l => l.teamId === teamId);
    if (!leader) throw new Error('Team Leader profile not found.');

    if (leader.password !== oldPassword) {
      throw new Error('Current password is incorrect.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    leader.password = newPassword;
    this.addAuditLog('TEAM_LEADER_PASSWORD_CHANGED', `Changed portal password for Team Leader of ${leader.teamName}`, leader.name);
    this.saveData();
    this._notify();
    return { success: true };
  }

  getTeamLeaderDashboardStats(teamId) {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Team not found.');

    const students = team.students || [];
    const studentIds = students.map(s => s.id);

    // Count competitions where team students are participants
    const assignments = this.data.programmeAssignments || [];
    const registeredCompetitions = assignments.filter(a =>
      (a.participants || []).some(p => p.teamId === teamId || studentIds.includes(p.studentId))
    );

    // Count programmes where team has registrations
    const progRegistrations = (this.data.programmeTeamRegistrations || []).filter(r => r.teamId === teamId);

    // Filter published posters where team is on podium
    const posters = (this.data.resultPosters || []).filter(p =>
      (p.status === 'Published' || p.isPublished) && (
        (p.firstPrize && p.firstPrize.teamId === teamId) ||
        (p.secondPrize && p.secondPrize.teamId === teamId) ||
        (p.thirdPrize && p.thirdPrize.teamId === teamId)
      )
    );

    // Announcements targeted to all, teams, or this specific team
    const announcements = (this.data.announcements || []).filter(a =>
      a.targetAudience === 'all' ||
      a.targetAudience === 'teams' ||
      a.targetAudience === 'team_leaders' ||
      a.teamId === teamId
    );

    // Schedule items relevant to this team
    const schedules = (this.data.programmeSchedules || []).filter(s => s.status !== 'Cancelled');

    return {
      teamName: team.name,
      teamCode: team.code,
      teamId: team.id,
      teamLeaderName: team.leader,
      leaderContact: team.leaderContact,
      totalTeamStudents: students.length,
      registeredCompetitionsCount: registeredCompetitions.length,
      registeredProgrammesCount: progRegistrations.length,
      publishedTeamResultsCount: posters.length,
      currentTeamPoints: team.points || 0,
      currentTeamRank: team.rank || 1,
      badge: team.badge || '⭐',
      recentStudents: students.slice(-4),
      recentRegistrations: registeredCompetitions.slice(0, 4),
      recentResults: posters.slice(0, 4),
      announcements: announcements.slice(0, 4),
      schedules: schedules.slice(0, 4)
    };
  }

  searchAvailableStudentsForTeam(teamId, query = '') {
    const q = (query || '').toLowerCase().trim();
    const team = (this.data.teams || []).find(t => t.id === teamId);
    const existingTeamStudentIds = new Set((team?.students || []).map(s => s.id));

    return (this.data.registeredStudents || []).map(s => {
      const isAlreadyInMyTeam = existingTeamStudentIds.has(s.id);
      const isAssignedToOtherTeam = Boolean(s.teamId && s.teamId !== teamId && s.teamId !== 'Unassigned');

      return {
        ...s,
        isAlreadyInMyTeam,
        isAssignedToOtherTeam,
        canAdd: !isAlreadyInMyTeam && !isAssignedToOtherTeam
      };
    }).filter(s => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.chestNo.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.classCategory || '').toLowerCase().includes(q) ||
        (s.institution || '').toLowerCase().includes(q)
      );
    });
  }

  assignStudentToTeamLeaderTeam(teamId, studentId, options = {}) {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Target team not found.');

    const student = (this.data.registeredStudents || []).find(s => s.id === studentId);
    if (!student) throw new Error('Student record not found in central registry.');

    if (student.teamId && student.teamId !== 'Unassigned' && student.teamId !== teamId) {
      throw new Error(`Student ${student.name} (${student.chestNo}) is already assigned to ${student.teamName || student.teamId}. Inter-team transfers require Convener authorization.`);
    }

    if ((team.students || []).some(s => s.id === studentId)) {
      throw new Error(`Student ${student.name} (${student.chestNo}) is already a member of your team.`);
    }

    const newAssignment = {
      id: student.id,
      chestNo: student.chestNo,
      name: student.name,
      category: student.classCategory,
      compCategory: options.competitionCategory || 'Literary Arena',
      events: []
    };

    if (!team.students) team.students = [];
    team.students.push(newAssignment);
    team.members = team.students.length;

    student.teamId = team.id;
    student.teamName = team.name;

    this.addAuditLog(
      'STUDENT_ADDED_TO_TEAM_BY_LEADER',
      `Team Leader added ${student.name} (${student.chestNo}) to ${team.name}`,
      team.leader
    );

    this.saveData();
    this._notify();
    return { success: true, team, student: newAssignment };
  }

  removeStudentFromTeamLeaderTeam(teamId, studentId, reason = '') {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Team not found.');

    const stuIdx = (team.students || []).findIndex(s => s.id === studentId);
    if (stuIdx === -1) throw new Error('Student is not a member of your team.');

    // Check if student has participated in evaluated competitions
    const assignments = this.data.programmeAssignments || [];
    const hasEvaluated = assignments.some(a =>
      (a.status === 'Submitted' || a.status === 'Verified' || a.status === 'Approved' || a.status === 'Officially Published') &&
      (a.participants || []).some(p => p.studentId === studentId)
    );
    if (hasEvaluated) {
      throw new Error('Cannot remove student: Candidate has already completed adjudicated competitions in this team.');
    }

    const removed = team.students.splice(stuIdx, 1)[0];
    team.members = team.students.length;

    const regStudent = (this.data.registeredStudents || []).find(s => s.id === studentId);
    if (regStudent) {
      regStudent.teamId = null;
      regStudent.teamName = 'Unassigned';
    }

    this.addAuditLog(
      'STUDENT_REMOVED_BY_LEADER',
      `Team Leader removed student ${removed.name} (${removed.chestNo}) from ${team.name}. Reason: ${reason || 'Squad restructuring'}`,
      team.leader
    );

    this.saveData();
    this._notify();
    return { success: true, removedStudent: removed };
  }

  getTeamCompetitionsForRegistration(teamId) {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    const teamStudentIds = new Set((team?.students || []).map(s => s.id));
    const assignments = this.data.programmeAssignments || [];

    return assignments.map(comp => {
      const compParticipants = comp.participants || [];
      const teamParticipants = compParticipants.filter(p => p.teamId === teamId || teamStudentIds.has(p.studentId));

      const isRegistered = teamParticipants.length > 0;
      const isPublished = Boolean(comp.isOfficialPublished || comp.isPublished);
      const isEvaluated = comp.status === 'Submitted' || comp.status === 'Verified' || comp.status === 'Approved' || isPublished;
      const canRegister = !isEvaluated && comp.status !== 'Completed' && (comp.maxParticipants ? teamParticipants.length < comp.maxParticipants : true);

      return {
        ...comp,
        isRegistered,
        isEvaluated,
        canRegister,
        teamParticipants,
        teamRegisteredCount: teamParticipants.length
      };
    });
  }

  registerTeamStudentForCompetition({ teamId, competitionId, studentIds, entryType = 'Individual', notes = '' }) {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Team not found.');

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Target competition not found.');

    if (assignment.status === 'Submitted' || assignment.status === 'Verified' || assignment.status === 'Approved' || assignment.isOfficialPublished) {
      throw new Error('Registration closed: Competition evaluation has already commenced or concluded.');
    }

    const teamStudents = team.students || [];
    const validStudentIds = Array.isArray(studentIds) ? studentIds : [studentIds];

    if (validStudentIds.length === 0) {
      throw new Error('Please select at least one eligible candidate from your team.');
    }

    if (!assignment.participants) assignment.participants = [];

    // Verify all studentIds belong to this team
    validStudentIds.forEach(sId => {
      const candidate = teamStudents.find(s => s.id === sId);
      if (!candidate) {
        throw new Error(`Student ${sId} does not belong to your team roster.`);
      }

      // Check duplicate
      const alreadyRegistered = assignment.participants.some(p => p.studentId === sId);
      if (alreadyRegistered) {
        throw new Error(`Candidate ${candidate.name} (${candidate.chestNo}) is already registered for this competition.`);
      }

      assignment.participants.push({
        studentId: candidate.id,
        chestNo: candidate.chestNo,
        name: candidate.name,
        teamId: team.id,
        teamName: team.name,
        entryType,
        registeredAt: new Date().toISOString()
      });
    });

    assignment.totalParticipants = assignment.participants.length;

    this.addAuditLog(
      'COMPETITION_REGISTERED_BY_TEAM_LEADER',
      `Registered ${validStudentIds.length} candidate(s) for ${assignment.competitionTitle} by Team ${team.name}`,
      team.leader
    );

    this.saveData();
    this._notify();
    return { success: true, assignment, registeredCount: validStudentIds.length };
  }

  cancelTeamStudentCompetitionRegistration({ teamId, competitionId, studentId }) {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Team not found.');

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.competitionId === competitionId || a.id === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Competition not found.');

    if (assignment.status === 'Submitted' || assignment.status === 'Verified' || assignment.status === 'Approved' || assignment.isOfficialPublished) {
      throw new Error('Cannot cancel registration: Competition marksheet has already been submitted or locked.');
    }

    const partIdx = (assignment.participants || []).findIndex(p => p.studentId === studentId && (p.teamId === teamId || !p.teamId));
    if (partIdx === -1) throw new Error('Candidate registration not found in this competition.');

    const removed = assignment.participants.splice(partIdx, 1)[0];
    assignment.totalParticipants = assignment.participants.length;

    this.addAuditLog(
      'REGISTRATION_CANCELLED_BY_TEAM_LEADER',
      `Cancelled registration of ${removed.name} for ${assignment.competitionTitle} by Team ${team.name}`,
      team.leader
    );

    this.saveData();
    this._notify();
    return { success: true, removedCandidate: removed };
  }

  getTeamProgrammesForRegistration(teamId) {
    const programmes = this.data.programmes || [];
    const registrations = (this.data.programmeTeamRegistrations || []).filter(r => r.teamId === teamId);

    return programmes.map(prg => {
      const reg = registrations.find(r => r.programmeId === prg.id || r.programmeId === prg.code);
      return {
        ...prg,
        isRegistered: Boolean(reg),
        registrationDetails: reg || null
      };
    });
  }

  registerTeamStudentForProgramme({ teamId, programmeId, studentIds, notes = '' }) {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Team not found.');

    const programme = (this.data.programmes || []).find(p => p.id === programmeId || p.code === programmeId);
    if (!programme) throw new Error('Programme not found.');

    if (!this.data.programmeTeamRegistrations) {
      this.data.programmeTeamRegistrations = [];
    }

    const existingReg = this.data.programmeTeamRegistrations.find(r =>
      r.teamId === teamId && (r.programmeId === programme.id || r.programmeId === programme.code)
    );

    const validStudentIds = Array.isArray(studentIds) ? studentIds : [studentIds];

    if (existingReg) {
      existingReg.studentIds = Array.from(new Set([...existingReg.studentIds, ...validStudentIds]));
      existingReg.updatedAt = new Date().toISOString();
      if (notes) existingReg.notes = notes;
    } else {
      this.data.programmeTeamRegistrations.push({
        id: `PRG-REG-${Date.now()}`,
        programmeId: programme.id,
        programmeCode: programme.code,
        programmeTitle: programme.title,
        teamId: team.id,
        teamName: team.name,
        studentIds: validStudentIds,
        registeredAt: new Date().toISOString(),
        status: 'Confirmed',
        notes
      });
    }

    this.addAuditLog(
      'PROGRAMME_REGISTRATION_BY_TEAM_LEADER',
      `Registered ${validStudentIds.length} students for ${programme.title} by Team ${team.name}`,
      team.leader
    );

    this.saveData();
    this._notify();
    return { success: true, programmeId: programme.id };
  }

  cancelTeamProgrammeRegistration({ teamId, programmeId }) {
    if (!this.data.programmeTeamRegistrations) return { success: true };
    this.data.programmeTeamRegistrations = this.data.programmeTeamRegistrations.filter(r =>
      !(r.teamId === teamId && (r.programmeId === programmeId || r.programmeCode === programmeId))
    );
    this.saveData();
    this._notify();
    return { success: true };
  }

  getTeamOfficialPublishedResults(teamId) {
    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published' || p.isPublished);

    const teamResults = [];

    posters.forEach(poster => {
      const awards = [];
      if (poster.firstPrize && poster.firstPrize.teamId === teamId) {
        awards.push({ position: 'First Prize', prizeBadge: '🥇 1st', ...poster.firstPrize });
      }
      if (poster.secondPrize && poster.secondPrize.teamId === teamId) {
        awards.push({ position: 'Second Prize', prizeBadge: '🥈 2nd', ...poster.secondPrize });
      }
      if (poster.thirdPrize && poster.thirdPrize.teamId === teamId) {
        awards.push({ position: 'Third Prize', prizeBadge: '🥉 3rd', ...poster.thirdPrize });
      }

      if (awards.length > 0) {
        teamResults.push({
          posterId: poster.id,
          competitionId: poster.competitionId,
          competitionCode: poster.competitionCode,
          competitionTitle: poster.competitionTitle,
          category: poster.category,
          venue: poster.venue,
          date: poster.date,
          publishedAt: poster.publishedAt,
          status: 'Published',
          isOfficial: true,
          awards
        });
      }
    });

    return teamResults;
  }

  getTeamAnnouncements(teamId) {
    return (this.data.announcements || []).filter(a =>
      a.targetAudience === 'all' ||
      a.targetAudience === 'teams' ||
      a.targetAudience === 'team_leaders' ||
      a.teamId === teamId
    );
  }

  getTeamReportsData(teamId) {
    const team = (this.data.teams || []).find(t => t.id === teamId);
    if (!team) throw new Error('Team not found.');

    const students = team.students || [];
    const competitions = this.getTeamCompetitionsForRegistration(teamId).filter(c => c.isRegistered);
    const programmes = this.getTeamProgrammesForRegistration(teamId).filter(p => p.isRegistered);
    const results = this.getTeamOfficialPublishedResults(teamId);

    return {
      team,
      students,
      competitions,
      programmes,
      results,
      generatedAt: new Date().toLocaleString()
    };
  }

  // =========================================================================
  // STUDENT PORTAL METHODS & OPERATIONS
  // =========================================================================

  verifyStudentLogin(chestNoOrEmail, password) {
    const students = this.data.registeredStudents || [];
    const cleanInput = (chestNoOrEmail || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanInput || !cleanPass) {
      throw new Error('Please enter both Chest Number/Email and password.');
    }

    // Match chestNo, email, studentId, or demo alias (e.g. student1@dalenziafest.in -> C-101)
    let student = students.find(s =>
      (s.chestNo && s.chestNo.toLowerCase() === cleanInput) ||
      (s.email && s.email.toLowerCase() === cleanInput) ||
      (s.id && s.id.toLowerCase() === cleanInput)
    );

    // Support quick demo aliases: student1@dalenziafest.in -> C-101, student2 -> C-102, etc.
    if (!student && cleanInput.startsWith('student')) {
      const match = cleanInput.match(/^student(\d+)(?:@|$)/);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        if (idx >= 0 && idx < students.length) {
          student = students[idx];
        }
      }
    }

    if (!student) {
      throw new Error('Invalid Student credentials. Please check your Chest Number or Email.');
    }

    if (student.status === 'Inactive') {
      throw new Error('Your student account is currently inactive. Please contact the Festival Convener.');
    }

    // Verify password against stored custom password or default 'student2k26'
    if (!this.data.studentAccounts) this.data.studentAccounts = [];
    const customAccount = this.data.studentAccounts.find(a => a.studentId === student.id);
    const expectedPassword = customAccount ? customAccount.password : 'student2k26';

    if (cleanPass !== expectedPassword) {
      throw new Error('Incorrect password. Default student password is student2k26.');
    }

    const team = (this.data.teams || []).find(t => t.id === student.teamId) || {
      id: student.teamId || 'unassigned',
      name: student.teamName || 'Unassigned',
      code: 'UN00',
      leader: 'Unassigned',
      points: 0,
      rank: '-'
    };

    const session = {
      id: student.id,
      chestNo: student.chestNo,
      name: student.name,
      email: student.email,
      phone: student.phone,
      dob: student.dob,
      classCategory: student.classCategory,
      institution: student.institution || 'Dalailussunna Dars, Ayiroor',
      teamId: student.teamId,
      teamName: team.name,
      teamCode: team.code,
      teamLeader: team.leader,
      gender: student.gender || 'Male',
      status: student.status,
      role: 'student',
      roleLabel: 'Festival Student Delegate',
      token: `jwt_dalenzia_student_${student.id}_${Date.now()}`
    };

    this.addAuditLog(
      'STUDENT_PORTAL_LOGIN',
      `Student ${student.name} (${student.chestNo}) logged into Student Portal`,
      student.name
    );

    return { success: true, session };
  }

  getStudentProfile(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student record not found.');

    const team = (this.data.teams || []).find(t => t.id === student.teamId) || {
      id: student.teamId,
      name: student.teamName || 'Unassigned',
      code: 'UN00',
      leader: 'Unassigned',
      leaderContact: 'N/A',
      points: 0,
      rank: '-'
    };

    return {
      ...student,
      team,
      isAccountActive: student.status === 'Active'
    };
  }

  updateStudentProfile(studentId, { phone, email, bio }) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student record not found.');

    if (phone !== undefined) student.phone = phone.trim();
    if (email !== undefined && email.trim()) student.email = email.trim();
    if (bio !== undefined) student.bio = bio.trim();

    this.addAuditLog(
      'STUDENT_PROFILE_UPDATED',
      `Student ${student.name} (${student.chestNo}) updated permitted contact details`,
      student.name
    );

    this.saveData();
    this._notify();
    return { success: true, student };
  }

  requestStudentCorrection(studentId, { field, currentVal, proposedVal, reason }) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student record not found.');

    if (!field || !proposedVal || !reason) {
      throw new Error('Please specify the field, proposed value, and reason for correction.');
    }

    if (!this.data.studentCorrectionRequests) this.data.studentCorrectionRequests = [];

    const request = {
      id: `CORR-${Date.now()}`,
      studentId: student.id,
      chestNo: student.chestNo,
      studentName: student.name,
      teamId: student.teamId,
      teamName: student.teamName,
      field,
      currentVal: currentVal || 'N/A',
      proposedVal,
      reason,
      status: 'Pending Review',
      submittedAt: new Date().toISOString()
    };

    this.data.studentCorrectionRequests.push(request);

    this.addAuditLog(
      'STUDENT_CORRECTION_REQUESTED',
      `Student ${student.name} (${student.chestNo}) requested official correction for [${field}]`,
      student.name
    );

    this.saveData();
    this._notify();
    return { success: true, request };
  }

  updateStudentPassword(studentId, oldPassword, newPassword) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student record not found.');

    if (!this.data.studentAccounts) this.data.studentAccounts = [];
    let account = this.data.studentAccounts.find(a => a.studentId === student.id);
    const expectedPassword = account ? account.password : 'student2k26';

    if (oldPassword !== expectedPassword) {
      throw new Error('Current password is incorrect.');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    if (!account) {
      account = { studentId: student.id, chestNo: student.chestNo };
      this.data.studentAccounts.push(account);
    }

    account.password = newPassword;
    account.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'STUDENT_PASSWORD_CHANGED',
      `Student ${student.name} (${student.chestNo}) changed their portal password`,
      student.name
    );

    this.saveData();
    this._notify();
    return { success: true };
  }

  getStudentCompetitions(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) return [];

    const assignments = this.data.programmeAssignments || [];
    const myComps = [];

    assignments.forEach(a => {
      const isParticipant = (a.participants || []).some(p =>
        p.studentId === student.id || p.chestNo === student.chestNo || (p.name && p.name.toLowerCase() === student.name.toLowerCase())
      );

      if (isParticipant) {
        const isPublished = Boolean(a.isOfficialPublished || a.isPublished);
        let status = 'Registered';
        if (isPublished) status = 'Result Published';
        else if (a.status === 'Completed' || a.status === 'Submitted' || a.status === 'Verified' || a.status === 'Approved') status = 'Completed';
        else if (a.status === 'In Progress' || a.status === 'Evaluating') status = 'In Progress';
        else status = 'Upcoming';

        myComps.push({
          id: a.id,
          competitionId: a.competitionId,
          code: a.competitionCode,
          title: a.competitionTitle,
          category: a.category,
          type: a.type || 'Individual',
          venue: a.venue,
          date: a.date,
          time: a.time,
          status,
          isPublished,
          instructions: a.instructions,
          rules: a.rules,
          totalParticipants: a.totalParticipants || (a.participants || []).length
        });
      }
    });

    return myComps;
  }

  getStudentProgrammes(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) return [];

    const registrations = this.data.programmeTeamRegistrations || [];
    const myRegs = registrations.filter(r =>
      (r.studentIds || []).includes(student.id) || (r.teamId && r.teamId === student.teamId)
    );

    const programmes = this.data.programmes || [];
    const result = [];

    programmes.forEach(p => {
      const match = myRegs.find(r => r.programmeId === p.id || r.programmeCode === p.code || r.programmeId === p.code);
      if (match || p.category === 'Inauguration' || p.category === 'Award Ceremony') {
        result.push({
          ...p,
          isExplicitlyRegistered: Boolean(match),
          registrationRole: match ? 'Official Squad Delegate' : 'Festival Attendee'
        });
      }
    });

    return result;
  }

  getStudentSchedule(studentId, filterDate = null) {
    const comps = this.getStudentCompetitions(studentId);
    const progs = this.getStudentProgrammes(studentId);

    const scheduleItems = [
      ...comps.map(c => ({
        id: `SCH-COMP-${c.id}`,
        title: c.title,
        subtitle: `${c.code} • ${c.category}`,
        kind: 'Competition',
        date: c.date,
        time: c.time,
        venue: c.venue,
        status: c.status,
        badgeColor: '#A91F35'
      })),
      ...progs.map(p => ({
        id: `SCH-PRG-${p.id}`,
        title: p.title,
        subtitle: `${p.category} • Stage Session`,
        kind: 'Programme',
        date: p.date,
        time: p.time,
        venue: p.venue,
        status: 'Confirmed',
        badgeColor: '#E6A916'
      }))
    ];

    if (filterDate) {
      return scheduleItems.filter(item => item.date.includes(filterDate));
    }

    return scheduleItems.sort((a, b) => (a.date > b.date ? 1 : -1));
  }

  getStudentPublishedResults(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) return [];

    const posters = (this.data.resultPosters || []).filter(p => p.status === 'Published' || p.isPublished);
    const results = [];

    posters.forEach(poster => {
      let prizeWon = null;
      let positionText = '';
      let badge = '';

      if (poster.firstPrize && (poster.firstPrize.chestNo === student.chestNo || poster.firstPrize.studentId === student.id || poster.firstPrize.name === student.name)) {
        prizeWon = poster.firstPrize;
        positionText = 'First Prize';
        badge = '🥇 1st Prize (Gold)';
      } else if (poster.secondPrize && (poster.secondPrize.chestNo === student.chestNo || poster.secondPrize.studentId === student.id || poster.secondPrize.name === student.name)) {
        prizeWon = poster.secondPrize;
        positionText = 'Second Prize';
        badge = '🥈 2nd Prize (Silver)';
      } else if (poster.thirdPrize && (poster.thirdPrize.chestNo === student.chestNo || poster.thirdPrize.studentId === student.id || poster.thirdPrize.name === student.name)) {
        prizeWon = poster.thirdPrize;
        positionText = 'Third Prize';
        badge = '🥉 3rd Prize (Bronze)';
      }

      if (prizeWon) {
        results.push({
          posterId: poster.id,
          competitionId: poster.competitionId,
          competitionCode: poster.competitionCode,
          competitionTitle: poster.competitionTitle,
          category: poster.category,
          venue: poster.venue,
          date: poster.date,
          publishedAt: poster.publishedAt,
          position: positionText,
          badge,
          score: prizeWon.score || prizeWon.totalScore || 'N/A',
          points: prizeWon.points || 0,
          isOfficial: true,
          status: 'Published'
        });
      }
    });

    return results;
  }

  getStudentDashboardStats(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student not found.');

    const competitions = this.getStudentCompetitions(studentId);
    const programmes = this.getStudentProgrammes(studentId);
    const results = this.getStudentPublishedResults(studentId);
    const team = (this.data.teams || []).find(t => t.id === student.teamId) || { points: 0, rank: 1, name: 'Unassigned' };
    const notifications = this.getStudentNotifications(studentId);

    const totalPointsContributed = results.reduce((acc, r) => acc + (r.points || 0), 0);

    return {
      studentName: student.name,
      chestNo: student.chestNo,
      teamName: team.name,
      teamRank: team.rank || 1,
      teamPoints: team.points || 0,
      registeredCompetitionsCount: competitions.length,
      registeredProgrammesCount: programmes.length,
      publishedAwardsCount: results.length,
      totalPointsContributed,
      unreadNotificationsCount: notifications.filter(n => !n.read).length
    };
  }

  getStudentTeamDetails(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student not found.');

    const team = (this.data.teams || []).find(t => t.id === student.teamId);
    if (!team) {
      return {
        id: 'unassigned',
        name: 'Unassigned Squad',
        code: 'UN00',
        leader: 'Awaiting Allocation',
        leaderContact: 'N/A',
        points: 0,
        rank: '-',
        teammates: []
      };
    }

    const allStudents = this.data.registeredStudents || [];
    const teammates = allStudents
      .filter(s => s.teamId === team.id && s.id !== student.id)
      .map(s => ({
        id: s.id,
        name: s.name,
        chestNo: s.chestNo,
        classCategory: s.classCategory
      }));

    return {
      ...team,
      teammates
    };
  }

  getStudentAnnouncements(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    const teamId = student ? student.teamId : null;

    return (this.data.announcements || []).filter(a =>
      a.targetAudience === 'all' ||
      a.targetAudience === 'students' ||
      (teamId && a.teamId === teamId)
    );
  }

  getStudentNotifications(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) return [];

    let customNotifs = (this.data.notifications || []).filter(n =>
      n.studentId === student.id || n.targetAudience === 'students' || n.targetAudience === 'all'
    );

    if (customNotifs.length === 0) {
      customNotifs = [
        {
          id: `NOTIF-STU-01`,
          studentId: student.id,
          title: 'Welcome to Dalenzia Fest 2K26',
          message: `Official student credentials authenticated for ${student.name} (${student.chestNo}). Check your schedule and ID card.`,
          date: 'Dec 15, 2026',
          type: 'Welcome',
          read: true
        },
        {
          id: `NOTIF-STU-02`,
          studentId: student.id,
          title: 'Squad Allotment Confirmed',
          message: `You are officially assigned to ${student.teamName}. Please synchronize with your Team Leader for stage delegations.`,
          date: 'Dec 18, 2026',
          type: 'Team',
          read: false
        },
        {
          id: `NOTIF-STU-03`,
          studentId: student.id,
          title: 'Stage Arenas Schedule Finalized',
          message: 'The official Programme Schedule for 21, 22, 23 DECEMBER 2026 has been certified by the Convener Secretariat.',
          date: 'Dec 19, 2026',
          type: 'Schedule',
          read: false
        }
      ];
    }

    return customNotifs;
  }

  markStudentNotificationAsRead(studentId, notifId) {
    if (!this.data.notifications) return { success: true };
    const notif = this.data.notifications.find(n => n.id === notifId);
    if (notif) notif.read = true;
    this.saveData();
    this._notify();
    return { success: true };
  }

  markAllStudentNotificationsAsRead(studentId) {
    if (!this.data.notifications) return { success: true };
    this.data.notifications.forEach(n => {
      if (n.studentId === studentId || n.targetAudience === 'students') {
        n.read = true;
      }
    });
    this.saveData();
    this._notify();
    return { success: true };
  }

  getStudentIdCardData(studentId) {
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) throw new Error('Student record not found.');

    const team = (this.data.teams || []).find(t => t.id === student.teamId) || { name: student.teamName || 'Unassigned', code: 'UN00' };

    return {
      festivalName: 'DALENZIA FEST 2K26 – NUEVA ERA',
      subTitle: 'Annual Inter-Squad Cultural & Academic Conclave',
      institution: 'Dalailussunna Dars, Ayiroor, Kerala',
      festivalDates: '21, 22, 23 DECEMBER 2026',
      studentName: student.name,
      chestNo: student.chestNo,
      studentId: student.id,
      classCategory: student.classCategory,
      teamName: team.name,
      teamCode: team.code,
      teamId: student.teamId,
      gender: student.gender || 'Male',
      issuedDate: 'Dec 20, 2026',
      expiryDate: 'Dec 23, 2026',
      status: student.status,
      verificationUrl: `https://dalenziafest.in/verify/id?chest=${student.chestNo}&token=DLZ2K26_STU_${student.id}`
    };
  }

  getStudentReportData(studentId) {
    const student = this.getStudentProfile(studentId);
    const competitions = this.getStudentCompetitions(studentId);
    const programmes = this.getStudentProgrammes(studentId);
    const results = this.getStudentPublishedResults(studentId);
    const stats = this.getStudentDashboardStats(studentId);

    return {
      student,
      competitions,
      programmes,
      results,
      stats,
      generatedAt: new Date().toLocaleString()
    };
  }

  // =========================================================================
  // STAGE CONTROLLER PORTAL, RANDOM CODE DRAW & CALLING SYSTEM
  // =========================================================================

  verifyStageControllerLogin(emailOrUsername, password) {
    const controllers = this.data.stageControllers || INITIAL_STAGE_CONTROLLERS;
    const cleanInput = (emailOrUsername || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanInput || !cleanPass) {
      throw new Error('Please enter Stage Controller username/email and password.');
    }

    const controller = controllers.find(c =>
      (c.email && c.email.toLowerCase() === cleanInput) ||
      (c.username && c.username.toLowerCase() === cleanInput) ||
      (c.id && c.id.toLowerCase() === cleanInput) ||
      (c.stageId && c.stageId.toLowerCase() === cleanInput)
    );

    if (!controller) {
      throw new Error('Invalid Stage Controller credentials.');
    }

    if (controller.password !== cleanPass) {
      throw new Error('Incorrect password. Default is stage2k26.');
    }

    if (controller.status === 'Inactive') {
      throw new Error('Stage Controller account is inactive. Contact Festival Convener.');
    }

    const stage = (this.data.programmeStages || []).find(s => s.id === controller.stageId) || {
      id: controller.stageId,
      name: controller.stageName,
      shortName: controller.stageName,
      venue: controller.stageName
    };

    const session = {
      id: controller.id,
      stageId: controller.stageId,
      stageNumber: controller.stageNumber || '01',
      stageName: stage.name,
      shortName: stage.shortName || stage.name,
      venue: stage.venue || stage.name,
      name: controller.name,
      email: controller.email,
      phone: controller.phone,
      role: 'STAGE_CONTROLLER',
      roleLabel: 'Official Stage Controller',
      status: controller.status,
      token: `jwt_dalenzia_stage_${controller.stageId}_${Date.now()}`
    };

    this.addAuditLog(
      'STAGE_CONTROLLER_LOGIN',
      `Stage Controller ${controller.name} logged into ${stage.name}`,
      controller.name
    );

    return { success: true, session };
  }

  getStageControllerProfile(stageId) {
    const controllers = this.data.stageControllers || INITIAL_STAGE_CONTROLLERS;
    const controller = controllers.find(c => c.stageId === stageId);
    const stage = (this.data.programmeStages || []).find(s => s.id === stageId) || {};

    return {
      ...controller,
      stageNumber: controller?.stageNumber || (stageId ? stageId.replace('STG-', '') : '01'),
      stageName: stage.name || controller?.stageName || 'Stage 01',
      shortName: stage.shortName || stage.name || controller?.stageName || 'Stage 01',
      venue: stage.venue || stage.name || controller?.stageName || 'Cordova Grand Stage',
      controllerName: controller?.name || 'Usthad Salman Farisi',
      stage
    };
  }

  updateStageControllerProfile(stageId, { name, phone }) {
    if (!this.data.stageControllers) this.data.stageControllers = [...INITIAL_STAGE_CONTROLLERS];
    const controller = this.data.stageControllers.find(c => c.stageId === stageId);
    if (!controller) throw new Error('Stage Controller not found.');

    if (name) controller.name = name.trim();
    if (phone) controller.phone = phone.trim();

    this.addAuditLog('STAGE_CONTROLLER_PROFILE_UPDATED', `Updated profile for Stage Controller of ${controller.stageName}`, controller.name);
    this.saveData();
    this._notify();
    return { success: true, controller };
  }

  updateStageControllerPassword(stageId, oldPass, newPass) {
    if (!this.data.stageControllers) this.data.stageControllers = [...INITIAL_STAGE_CONTROLLERS];
    const controller = this.data.stageControllers.find(c => c.stageId === stageId);
    if (!controller) throw new Error('Stage Controller not found.');

    if (controller.password !== oldPass) {
      throw new Error('Current password is incorrect.');
    }
    if (!newPass || newPass.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    controller.password = newPass;
    this.addAuditLog('STAGE_CONTROLLER_PASSWORD_CHANGED', `Changed password for Stage Controller of ${controller.stageName}`, controller.name);
    this.saveData();
    this._notify();
    return { success: true };
  }

  getStageCompetitions(stageId) {
    const stage = (this.data.programmeStages || []).find(s => s.id === stageId);
    const stageShort = stage ? (stage.shortName || stage.name) : '';
    const assignments = this.data.programmeAssignments || [];

    // Filter assignments that match stageId, venue, or name
    const stageComps = assignments.filter(a =>
      a.stageId === stageId ||
      (a.venue && stageShort && a.venue.toLowerCase().includes(stageShort.toLowerCase())) ||
      (a.venue && a.venue.includes(stageId))
    );

    const sessions = this.data.stageDrawSessions || [];
    const callingRecords = this.data.stageCallingRecords || [];

    return stageComps.map(comp => {
      const session = sessions.find(s => s.competitionId === comp.competitionId || s.competitionId === comp.id);
      const records = callingRecords.filter(r => r.competitionId === comp.competitionId || r.competitionId === comp.id);

      const calledCount = records.filter(r => r.callingStatus === 'Called').length;
      const presentCount = records.filter(r => r.callingStatus === 'Present' || r.callingStatus === 'In Progress').length;
      const completedCount = records.filter(r => r.callingStatus === 'Completed').length;
      const absentCount = records.filter(r => r.callingStatus === 'Absent' || r.callingStatus === 'Skipped').length;

      const opStatus = comp.operationalStatus || comp.stageStatus || (comp.status === 'Completed' || comp.status === 'Approved' ? 'Completed' : 'Upcoming');
      return {
        ...comp,
        title: comp.title || comp.competitionTitle,
        code: comp.code || comp.competitionCode,
        stageId,
        stageName: stage?.name || comp.venue,
        operationalStatus: opStatus,
        stageStatus: opStatus,
        drawSessionStatus: session ? session.sessionStatus : 'Draft',
        drawSessionId: session ? session.id : null,
        totalDrawn: session ? session.totalDrawn : 0,
        calledCount,
        presentCount,
        completedCount,
        absentCount
      };
    });
  }

  updateStageCompetitionStatus(competitionId, stageId, newStatus, operator = 'Stage Controller') {
    const valid = ['Upcoming', 'Ready', 'Ongoing', 'Paused', 'Completed', 'Cancelled'];
    if (!valid.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${valid.join(', ')}`);
    }

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.id === competitionId || a.competitionId === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Target competition not found.');

    const previousStatus = assignment.operationalStatus || assignment.status;
    assignment.operationalStatus = newStatus;
    assignment.stageStatus = newStatus;
    if (newStatus === 'Completed') {
      assignment.status = 'Completed';
    }

    this.addAuditLog(
      'STAGE_COMPETITION_STATUS_UPDATED',
      `Competition ${assignment.competitionTitle} status updated from [${previousStatus}] to [${newStatus}] on Stage ${stageId}`,
      operator
    );

    this.saveData();
    this._notify();
    return { success: true, operationalStatus: newStatus, stageStatus: newStatus };
  }

  getCompetitionCodeAssignments(competitionId, stageId) {
    if (!this.data.competitionCodeAssignments) this.data.competitionCodeAssignments = [];

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.id === competitionId || a.competitionId === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) return [];

    let codes = this.data.competitionCodeAssignments.filter(c =>
      c.competitionId === assignment.competitionId || c.competitionId === assignment.id
    );

    // If codes not yet generated, auto-provision official codes from participants
    if (codes.length === 0 && assignment.participants && assignment.participants.length > 0) {
      const prefix = 'A';
      assignment.participants.forEach((p, idx) => {
        const codeNum = String(idx + 1).padStart(3, '0');
        const code = `${prefix}-${codeNum}`;
        const newCodeRecord = {
          id: `CODE-${assignment.id}-${p.studentId || idx}`,
          competitionId: assignment.competitionId || assignment.id,
          competitionCode: assignment.competitionCode,
          stageId: stageId || 'STG-01',
          studentId: p.studentId,
          chestNo: p.chestNo,
          studentName: p.name,
          teamId: p.teamId,
          teamName: p.teamName,
          code,
          assignmentStatus: 'Assigned',
          createdAt: new Date().toISOString(),
          createdBy: 'System Code Generator'
        };
        this.data.competitionCodeAssignments.push(newCodeRecord);
      });
      codes = this.data.competitionCodeAssignments.filter(c =>
        c.competitionId === assignment.competitionId || c.competitionId === assignment.id
      );
      this.saveData();
    }

    // Check if locked
    const session = (this.data.stageDrawSessions || []).find(s =>
      (s.competitionId === assignment.competitionId || s.competitionId === assignment.id) &&
      (s.sessionStatus === 'Active' || s.sessionStatus === 'Completed')
    );

    const drawResults = this.data.stageDrawResults || [];
    return codes.map(c => {
      const codeStr = c.code || c.codeLetter;
      const drawRes = drawResults.find(r =>
        (r.competitionId === assignment.competitionId || r.competitionId === assignment.id) &&
        (r.code === codeStr || r.studentId === c.studentId)
      );
      return {
        ...c,
        code: codeStr,
        codeLetter: codeStr,
        drawn: Boolean(drawRes),
        drawOrder: drawRes ? (drawRes.drawOrder || drawRes.drawPosition) : null,
        isLocked: Boolean(session)
      };
    });
  }

  generateParticipantCodes(competitionId, stageId, prefix = 'A', operator = 'Stage Controller') {
    if (!this.data.competitionCodeAssignments) this.data.competitionCodeAssignments = [];

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.id === competitionId || a.competitionId === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Target competition not found.');

    // Check if draw has already commenced
    const session = (this.data.stageDrawSessions || []).find(s =>
      (s.competitionId === assignment.competitionId || s.competitionId === assignment.id) &&
      (s.sessionStatus === 'Active' || s.sessionStatus === 'Completed')
    );
    if (session) {
      throw new Error('Code letters are locked because the official Draw Session has already started.');
    }

    // Remove existing codes for this competition
    this.data.competitionCodeAssignments = this.data.competitionCodeAssignments.filter(c =>
      !(c.competitionId === assignment.competitionId || c.competitionId === assignment.id)
    );

    const participants = assignment.participants || [];
    if (participants.length === 0) {
      throw new Error('No registered participants found for this competition.');
    }

    const cleanPrefix = (prefix || 'A').toUpperCase().trim();
    participants.forEach((p, idx) => {
      const codeNum = String(idx + 1).padStart(3, '0');
      const code = `${cleanPrefix}-${codeNum}`;
      this.data.competitionCodeAssignments.push({
        id: `CODE-${assignment.id}-${p.studentId || idx}`,
        competitionId: assignment.competitionId || assignment.id,
        competitionCode: assignment.competitionCode,
        stageId: stageId || 'STG-01',
        studentId: p.studentId,
        chestNo: p.chestNo,
        studentName: p.name,
        teamId: p.teamId,
        teamName: p.teamName,
        code,
        assignmentStatus: 'Assigned',
        createdAt: new Date().toISOString(),
        createdBy: operator
      });
    });

    this.addAuditLog(
      'PARTICIPANT_CODES_GENERATED',
      `Generated ${participants.length} code letters (Prefix: ${cleanPrefix}) for ${assignment.competitionTitle}`,
      operator
    );

    this.saveData();
    this._notify();
    return { success: true, count: participants.length };
  }

  getOrCreateDrawSession(stageId, competitionId, operator = 'Stage Controller') {
    if (!this.data.stageDrawSessions) this.data.stageDrawSessions = [];

    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.id === competitionId || a.competitionId === competitionId || a.competitionCode === competitionId
    );
    if (!assignment) throw new Error('Target competition not found.');

    // Ensure codes exist
    const codes = this.getCompetitionCodeAssignments(assignment.id, stageId);
    if (codes.length === 0) {
      throw new Error('Cannot start draw: No participant code letters assigned.');
    }

    let session = this.data.stageDrawSessions.find(s =>
      s.competitionId === assignment.competitionId || s.competitionId === assignment.id
    );

    if (!session) {
      session = {
        id: `DRW-SES-${Date.now()}`,
        stageId,
        competitionId: assignment.competitionId || assignment.id,
        competitionCode: assignment.competitionCode,
        competitionTitle: assignment.competitionTitle,
        sessionStatus: 'Active',
        eligibleParticipantCount: codes.length,
        totalDrawn: 0,
        remainingCount: codes.length,
        startedBy: operator,
        startedAt: new Date().toISOString(),
        completedAt: null
      };
      this.data.stageDrawSessions.push(session);

      this.addAuditLog(
        'STAGE_DRAW_SESSION_STARTED',
        `Live Random Draw session started for ${assignment.competitionTitle} (${codes.length} participants) on Stage ${stageId}`,
        operator
      );

      this.saveData();
      this._notify();
    } else if (session.sessionStatus === 'Draft') {
      session.sessionStatus = 'Active';
      session.startedAt = new Date().toISOString();
      session.startedBy = operator;
      this.saveData();
      this._notify();
    }

    const results = (this.data.stageDrawResults || [])
      .filter(r => r.sessionId === session.id)
      .map(r => ({
        ...r,
        codeLetter: r.code || r.codeLetter,
        drawOrder: r.drawOrder || r.drawPosition
      }))
      .sort((a, b) => a.drawOrder - b.drawOrder);

    return {
      ...session,
      drawnSequence: results,
      status: session.sessionStatus
    };
  }

  executeRandomCodeDraw(sessionId, idempotencyKey = '', operator = 'Stage Controller') {
    if (!this.data.stageDrawSessions) this.data.stageDrawSessions = [];
    if (!this.data.stageDrawResults) this.data.stageDrawResults = [];
    if (!this.data.stageCallingRecords) this.data.stageCallingRecords = [];

    const session = this.data.stageDrawSessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Draw session not found.');

    if (session.sessionStatus !== 'Active') {
      if (session.sessionStatus === 'Completed') {
        return { success: true, isFinalDraw: true, remainingCount: 0, message: 'All eligible participants have already been drawn.' };
      }
      throw new Error(`Draw session is not currently active (Status: ${session.sessionStatus}).`);
    }

    // Fetch all codes for this competition
    const codes = this.getCompetitionCodeAssignments(session.competitionId, session.stageId);
    // Fetch already drawn codes for this session
    const existingResults = this.data.stageDrawResults.filter(r => r.sessionId === sessionId);
    const drawnCodes = new Set(existingResults.map(r => r.code));

    // Filter undrawn candidates
    const undrawnPool = codes.filter(c => !drawnCodes.has(c.code));

    if (undrawnPool.length === 0) {
      session.sessionStatus = 'Completed';
      session.completedAt = new Date().toISOString();
      session.remainingCount = 0;
      this.saveData();
      this._notify();
      return { success: true, isFinalDraw: true, remainingCount: 0, message: 'Draw Session is now complete.' };
    }

    // Atomic Uniform Random Selection
    const randomIndex = Math.floor(Math.random() * undrawnPool.length);
    const selected = undrawnPool[randomIndex];
    const drawPosition = existingResults.length + 1;

    // Create official permanent Draw Result
    const drawResult = {
      id: `DRW-RES-${Date.now()}-${drawPosition}`,
      sessionId: session.id,
      stageId: session.stageId,
      competitionId: session.competitionId,
      studentId: selected.studentId,
      chestNo: selected.chestNo,
      studentName: selected.studentName,
      teamId: selected.teamId,
      teamName: selected.teamName,
      code: selected.code,
      drawPosition,
      drawnAt: new Date().toISOString(),
      generatedBy: operator,
      idempotencyKey
    };

    this.data.stageDrawResults.push(drawResult);

    // Create corresponding Stage Calling Record
    const callingRecord = {
      id: `CALL-${Date.now()}-${drawPosition}`,
      sessionId: session.id,
      drawResultId: drawResult.id,
      stageId: session.stageId,
      competitionId: session.competitionId,
      studentId: selected.studentId,
      chestNo: selected.chestNo,
      studentName: selected.studentName,
      teamId: selected.teamId,
      teamName: selected.teamName,
      code: selected.code,
      drawPosition,
      callingStatus: 'Drawn', // Initial state
      calledBy: null,
      calledAt: null,
      statusUpdatedBy: operator,
      statusUpdatedAt: new Date().toISOString(),
      correctionReason: null
    };

    this.data.stageCallingRecords.push(callingRecord);

    // Update Session Counters
    session.totalDrawn = drawPosition;
    session.remainingCount = undrawnPool.length - 1;
    if (session.remainingCount === 0) {
      session.sessionStatus = 'Completed';
      session.completedAt = new Date().toISOString();
    }

    this.addAuditLog(
      'LIVE_RANDOM_CODE_DRAW_EXECUTED',
      `Drawn Position #${drawPosition}: [${selected.code}] ${selected.studentName} (${selected.teamName}) for ${session.competitionTitle}`,
      operator
    );

    this.saveData();
    this._notify();

    const formattedDrawn = {
      ...drawResult,
      codeLetter: drawResult.code,
      drawOrder: drawPosition
    };

    return {
      success: true,
      drawResult: formattedDrawn,
      drawnResult: formattedDrawn,
      callingRecord,
      remainingCount: session.remainingCount,
      isFinalDraw: session.remainingCount === 0
    };
  }

  getDrawSessionDetails(sessionId) {
    const session = (this.data.stageDrawSessions || []).find(s => s.id === sessionId);
    if (!session) throw new Error('Draw session not found.');

    const results = (this.data.stageDrawResults || [])
      .filter(r => r.sessionId === sessionId)
      .sort((a, b) => a.drawPosition - b.drawPosition);

    const callingRecords = (this.data.stageCallingRecords || [])
      .filter(r => r.sessionId === sessionId)
      .sort((a, b) => a.drawPosition - b.drawPosition);

    const codes = this.getCompetitionCodeAssignments(session.competitionId, session.stageId);

    return {
      session,
      results,
      callingRecords,
      totalParticipants: codes.length,
      remainingCount: codes.length - results.length
    };
  }

  getStageCallingRecords(competitionId, stageId) {
    const assignment = (this.data.programmeAssignments || []).find(a =>
      a.id === competitionId || a.competitionId === competitionId || a.competitionCode === competitionId
    );
    const targetCompId = assignment ? (assignment.competitionId || assignment.id) : competitionId;
    const targetAsgId = assignment ? assignment.id : competitionId;

    const records = (this.data.stageCallingRecords || []).filter(r =>
      (r.stageId === stageId || !stageId) &&
      (r.competitionId === targetCompId || r.competitionId === targetAsgId || r.sessionId === competitionId || r.competitionId === competitionId)
    );

    return records
      .map(r => ({
        ...r,
        codeLetter: r.code || r.codeLetter,
        callOrder: r.callOrder || r.drawPosition,
        status: r.callingStatus || r.status || 'Drawn',
        skipReason: r.correctionReason || r.skipReason || null,
        admissionNo: r.chestNo || r.studentId || ''
      }))
      .sort((a, b) => a.callOrder - b.callOrder);
  }

  updateParticipantCallingStatus(callingRecordId, newStatus, reason = '', operator = 'Stage Controller') {
    const valid = ['Drawn', 'Waiting', 'Called', 'Present', 'In Progress', 'Completed', 'Absent', 'Skipped'];
    if (!valid.includes(newStatus)) {
      throw new Error(`Invalid calling status. Must be one of: ${valid.join(', ')}`);
    }

    if (!this.data.stageCallingRecords) this.data.stageCallingRecords = [];
    const record = this.data.stageCallingRecords.find(r => r.id === callingRecordId);
    if (!record) throw new Error('Calling record not found.');

    const oldStatus = record.callingStatus || record.status;
    record.callingStatus = newStatus;
    record.status = newStatus;
    record.statusUpdatedBy = operator;
    record.statusUpdatedAt = new Date().toISOString();

    if (newStatus === 'Called') {
      record.calledBy = operator;
      record.calledAt = new Date().toISOString();
    } else if (newStatus === 'In Progress') {
      record.startedAt = new Date().toISOString();
    } else if (newStatus === 'Completed') {
      record.completedAt = new Date().toISOString();
    }

    if (reason) {
      record.correctionReason = reason;
      record.skipReason = reason;
    }

    this.addAuditLog(
      'PARTICIPANT_CALLING_STATUS_CHANGED',
      `Participant [${record.code}] ${record.studentName} calling status changed from [${oldStatus}] to [${newStatus}]. Reason: ${reason || 'Operational update'}`,
      operator
    );

    this.saveData();
    this._notify();
    return {
      success: true,
      record: {
        ...record,
        codeLetter: record.code,
        callOrder: record.drawPosition,
        status: record.callingStatus,
        skipReason: record.correctionReason
      }
    };
  }

  getLiveStageDisplayData(stageId) {
    const stage = (this.data.programmeStages || []).find(s => s.id === stageId) || {
      id: stageId,
      name: 'Stage 01',
      shortName: 'Stage 01',
      venue: 'Cordova Grand Stage'
    };

    const comps = this.getStageCompetitions(stageId);
    const activeComp = comps.find(c => c.operationalStatus === 'Ongoing' || c.operationalStatus === 'Ready') || comps[0] || null;

    let currentCalling = null;
    let nextCalling = null;
    let totalDrawn = 0;
    let completedCount = 0;

    if (activeComp) {
      const records = (this.data.stageCallingRecords || [])
        .filter(r => r.competitionId === activeComp.competitionId || r.competitionId === activeComp.id)
        .sort((a, b) => a.drawPosition - b.drawPosition);

      totalDrawn = records.length;
      completedCount = records.filter(r => r.callingStatus === 'Completed').length;

      // Current active participant (In Progress, Present, or Called)
      currentCalling = records.find(r =>
        r.callingStatus === 'In Progress' || r.callingStatus === 'Present' || r.callingStatus === 'Called'
      ) || records.find(r => r.callingStatus === 'Drawn') || records[records.length - 1] || null;

      if (currentCalling) {
        // Next up in sequence
        nextCalling = records.find(r =>
          r.drawPosition > currentCalling.drawPosition &&
          (r.callingStatus === 'Waiting' || r.callingStatus === 'Drawn')
        ) || null;
      }
    }

    const activeCompObj = activeComp ? {
      id: activeComp.id,
      code: activeComp.code || activeComp.competitionCode,
      title: activeComp.title || activeComp.competitionTitle,
      category: activeComp.category,
      type: activeComp.type,
      status: activeComp.operationalStatus
    } : null;

    const currentParticipantObj = currentCalling ? {
      id: currentCalling.id,
      code: currentCalling.code,
      codeLetter: currentCalling.code,
      drawPosition: currentCalling.drawPosition,
      callOrder: currentCalling.drawPosition,
      name: currentCalling.studentName,
      studentName: currentCalling.studentName,
      teamName: currentCalling.teamName,
      chestNo: currentCalling.chestNo,
      status: currentCalling.callingStatus || currentCalling.status,
      calledAt: currentCalling.calledAt
    } : null;

    const nextParticipantObj = nextCalling ? {
      id: nextCalling.id,
      code: nextCalling.code,
      codeLetter: nextCalling.code,
      drawPosition: nextCalling.drawPosition,
      callOrder: nextCalling.drawPosition,
      name: nextCalling.studentName,
      studentName: nextCalling.studentName,
      teamName: nextCalling.teamName
    } : null;

    return {
      festivalName: 'DALENZIA FEST 2K26 – NUEVA ERA',
      stageId: stage.id,
      stageNumber: stage.code ? stage.code.replace('STG-', '') : '01',
      stageName: stage.name,
      stageVenue: stage.venue || stage.name,
      activeCompetition: activeCompObj,
      competition: activeCompObj,
      currentParticipant: currentParticipantObj,
      activeCallingRecord: currentParticipantObj,
      nextParticipant: nextParticipantObj,
      nextUpCallingRecord: nextParticipantObj,
      totalDrawn,
      completedCount,
      updatedAt: new Date().toLocaleTimeString()
    };
  }

  getStageControllerDashboard(stageId) {
    const stage = (this.data.programmeStages || []).find(s => s.id === stageId) || {
      id: stageId,
      name: 'Stage 01',
      venue: 'Cordova Grand Stage'
    };

    const controller = (this.data.stageControllers || INITIAL_STAGE_CONTROLLERS).find(c => c.stageId === stageId);
    const comps = this.getStageCompetitions(stageId);
    const activeComp = comps.find(c => c.operationalStatus === 'Ongoing' || c.operationalStatus === 'Ready') || comps[0] || null;
    const nextComp = comps.find(c => c.operationalStatus === 'Upcoming' && c.id !== activeComp?.id) || null;

    const callingRecords = (this.data.stageCallingRecords || []).filter(r => r.stageId === stageId);

    const totalScheduled = comps.length;
    const totalParticipants = comps.reduce((acc, c) => acc + (c.totalParticipants || (c.participants || []).length || 0), 0);
    const participantsCalled = callingRecords.filter(r => r.callingStatus === 'Called').length;
    const participantsCompleted = callingRecords.filter(r => r.callingStatus === 'Completed').length;
    const participantsAbsent = callingRecords.filter(r => r.callingStatus === 'Absent' || r.callingStatus === 'Skipped').length;
    const participantsDrawn = callingRecords.length;

    // Assigned judges for active competition
    let assignedJudges = [];
    if (activeComp && activeComp.assignedJudgeIds) {
      assignedJudges = (this.data.judges || []).filter(j => activeComp.assignedJudgeIds.includes(j.id));
    }

    return {
      stageId: stage.id,
      stageNumber: stage.code ? stage.code.replace('STG-', '') : '01',
      stageName: stage.name,
      venue: stage.venue,
      controllerName: controller?.name || 'Stage Controller',
      activeCompetition: activeComp,
      nextCompetition: nextComp,
      stats: {
        totalScheduled,
        totalParticipants,
        participantsDrawn,
        participantsCalled,
        participantsCompleted,
        participantsAbsent,
        remainingParticipants: Math.max(0, totalParticipants - participantsCompleted - participantsAbsent)
      },
      assignedJudges,
      recentActivity: (this.data.auditLogs || [])
        .filter(l => (l.action && (l.action.includes('STAGE') || l.action.includes('DRAW') || l.action.includes('CALLING'))))
        .slice(0, 6)
    };
  }

  getJudgeCoordinationForStage(stageId) {
    const comps = this.getStageCompetitions(stageId);
    const allJudges = this.data.judges || [];
    const evaluations = this.data.submittedEvaluations || [];

    const coordinationList = [];

    comps.forEach(comp => {
      const judgeIds = comp.assignedJudgeIds || [];
      const compJudges = allJudges.filter(j => judgeIds.includes(j.id));

      compJudges.forEach(judge => {
        const evalRecord = evaluations.find(e =>
          (e.competitionId === comp.competitionId || e.competitionId === comp.id) &&
          e.judgeId === judge.id
        );

        coordinationList.push({
          competitionId: comp.id,
          competitionTitle: comp.title,
          competitionCode: comp.code,
          judgeId: judge.id,
          judgeName: judge.name,
          judgeCategory: judge.category,
          phone: judge.phone,
          status: evalRecord ? evalRecord.status : 'Awaiting Submission',
          isSubmitted: Boolean(evalRecord),
          submittedAt: evalRecord ? evalRecord.submittedAt : null
        });
      });
    });

    return coordinationList;
  }

  getStageReports(stageId) {
    const stage = (this.data.programmeStages || []).find(s => s.id === stageId);
    const comps = this.getStageCompetitions(stageId);
    const rawCalling = (this.data.stageCallingRecords || []).filter(r => r.stageId === stageId || !stageId);
    const rawDraw = (this.data.stageDrawResults || []).filter(r => r.stageId === stageId || !stageId);

    const drawRecords = rawDraw.map(r => ({
      ...r,
      codeLetter: r.code || r.codeLetter,
      drawOrder: r.drawPosition || r.drawOrder
    })).sort((a, b) => a.drawOrder - b.drawOrder);

    const callingRecords = rawCalling.map(r => ({
      ...r,
      codeLetter: r.code || r.codeLetter,
      callOrder: r.drawPosition || r.callOrder,
      status: r.callingStatus || r.status || 'Drawn',
      skipReason: r.correctionReason || r.skipReason || null,
      admissionNo: r.chestNo || r.studentId || ''
    })).sort((a, b) => a.callOrder - b.callOrder);

    return {
      stage,
      competitions: comps,
      callingRecords,
      drawRecords,
      drawResults: drawRecords,
      generatedAt: new Date().toLocaleString()
    };
  }

  getAllStagesOversight() {
    const stages = this.data.programmeStages || [];
    const controllers = this.data.stageControllers || INITIAL_STAGE_CONTROLLERS;
    const sessions = this.data.stageDrawSessions || [];
    const callingRecords = this.data.stageCallingRecords || [];

    return stages.map(stage => {
      const controller = controllers.find(c => c.stageId === stage.id);
      const stageComps = this.getStageCompetitions(stage.id);
      const activeComp = stageComps.find(c => c.operationalStatus === 'Ongoing' || c.operationalStatus === 'Ready') || stageComps[0] || null;
      const stageRecords = callingRecords.filter(r => r.stageId === stage.id);

      return {
        stageId: stage.id,
        stageName: stage.name,
        shortName: stage.shortName,
        venue: stage.venue,
        controllerName: controller ? controller.name : 'Unassigned',
        controllerContact: controller ? controller.phone : 'N/A',
        totalCompetitions: stageComps.length,
        activeCompetition: activeComp ? activeComp.title : 'None',
        totalDrawn: stageRecords.length,
        completedCount: stageRecords.filter(r => r.callingStatus === 'Completed').length,
        absentCount: stageRecords.filter(r => r.callingStatus === 'Absent' || r.callingStatus === 'Skipped').length,
        status: activeComp ? activeComp.operationalStatus : 'Idle'
      };
    });
  }

  reopenOrResetDrawSession(sessionId, reason, authorizedBy = 'Convener') {
    if (!this.data.stageDrawSessions) return { success: false };
    const session = this.data.stageDrawSessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Draw session not found.');

    if (!reason || reason.trim().length < 5) {
      throw new Error('Authorized reset requires a recorded justification (minimum 5 characters).');
    }

    if (!this.data.archivedDrawSessions) this.data.archivedDrawSessions = [];

    // Archive current session state
    this.data.archivedDrawSessions.push({
      archivedAt: new Date().toISOString(),
      authorizedBy,
      reason: reason.trim(),
      session: { ...session },
      drawResults: (this.data.stageDrawResults || []).filter(r => r.sessionId === sessionId),
      callingRecords: (this.data.stageCallingRecords || []).filter(r => r.sessionId === sessionId)
    });

    // Remove active results and calling records for this session
    this.data.stageDrawResults = (this.data.stageDrawResults || []).filter(r => r.sessionId !== sessionId);
    this.data.stageCallingRecords = (this.data.stageCallingRecords || []).filter(r => r.sessionId !== sessionId);

    // Reset session counters
    session.sessionStatus = 'Active';
    session.totalDrawn = 0;
    session.remainingCount = session.eligibleParticipantCount;
    session.completedAt = null;

    this.addAuditLog(
      'STAGE_DRAW_SESSION_RESET_BY_AUTHORITY',
      `Draw session for ${session.competitionTitle} reset by ${authorizedBy}. Reason: ${reason.trim()}`,
      authorizedBy
    );

    this.saveData();
    this._notify();
    return { success: true, session };
  }



  // =========================================================================
  // CENTRALIZED REGISTRATION DESK METHODS (SHARED ADMIN & CONVENER)
  // =========================================================================

  getRegistrationStats() {
    const list = this.data.registrations || [];
    return {
      total: list.length,
      existingStudents: list.filter(r => r.type === 'existing_student').length,
      externalParticipants: list.filter(r => r.type === 'external_participant').length,
      completed: list.filter(r => r.status === 'Completed').length,
      pending: list.filter(r => r.status === 'Pending').length,
      cancelled: list.filter(r => r.status === 'Cancelled').length
    };
  }

  getRegistrations(filters = {}) {
    let list = [...(this.data.registrations || [])];

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(r =>
        (r.participantName && r.participantName.toLowerCase().includes(q)) ||
        (r.ticketId && r.ticketId.toLowerCase().includes(q)) ||
        (r.studentId && r.studentId.toLowerCase().includes(q)) ||
        (r.chestNo && r.chestNo.toLowerCase().includes(q)) ||
        (r.institution && r.institution.toLowerCase().includes(q)) ||
        (r.phone && r.phone.toLowerCase().includes(q)) ||
        (r.teamName && r.teamName.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== 'all') {
      list = list.filter(r => r.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter(r => r.status === filters.status);
    }

    if (filters.date && filters.date !== 'all') {
      if (filters.date === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        list = list.filter(r => (r.registrationDate || '').startsWith(todayStr));
      } else {
        list = list.filter(r => (r.registrationDate || '').startsWith(filters.date));
      }
    }

    // Default newest first
    list.sort((a, b) => new Date(b.registrationDate || b.createdAt || 0) - new Date(a.registrationDate || a.createdAt || 0));

    return list;
  }

  getRegistrationById(id) {
    return (this.data.registrations || []).find(r => r.id === id);
  }

  getRegistrationByTicketId(ticketId) {
    if (!ticketId) return null;
    const clean = ticketId.trim().toUpperCase();
    return (this.data.registrations || []).find(r => r.ticketId && r.ticketId.toUpperCase() === clean);
  }

  findStudentForRegistration(searchQuery) {
    if (!searchQuery || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const students = (this.data.registeredStudents || []).filter(s =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.chestNo && s.chestNo.toLowerCase().includes(q))
    );

    return students.map(student => {
      const existing = (this.data.registrations || []).find(
        r => r.studentId === student.id && r.status !== 'Cancelled'
      );
      return {
        ...student,
        isAlreadyRegistered: !!existing,
        existingRegistration: existing || null
      };
    });
  }

  generateNextTicketId(type) {
    if (type === 'existing_student') {
      const existing = (this.data.registrations || [])
        .filter(r => r.type === 'existing_student' && r.ticketId && r.ticketId.startsWith('DLZ-2026-'))
        .map(r => parseInt(r.ticketId.replace('DLZ-2026-', ''), 10))
        .filter(n => !isNaN(n));
      const maxNum = existing.length > 0 ? Math.max(...existing) : 1000;
      const nextNum = maxNum + 1;
      return `DLZ-2026-${String(nextNum).padStart(4, '0')}`;
    } else {
      const existing = (this.data.registrations || [])
        .filter(r => r.type === 'external_participant' && r.ticketId && r.ticketId.startsWith('EXT-2026-'))
        .map(r => parseInt(r.ticketId.replace('EXT-2026-', ''), 10))
        .filter(n => !isNaN(n));
      const maxNum = existing.length > 0 ? Math.max(...existing) : 5000;
      const nextNum = maxNum + 1;
      return `EXT-2026-${String(nextNum).padStart(4, '0')}`;
    }
  }

  registerExistingStudent(studentIdOrPayload, payload = {}, actingUser = 'Authorized Official') {
    let studentId = studentIdOrPayload;
    if (typeof studentIdOrPayload === 'object' && studentIdOrPayload !== null) {
      studentId = studentIdOrPayload.studentId;
      payload = studentIdOrPayload;
      if (studentIdOrPayload.registeredBy) actingUser = studentIdOrPayload.registeredBy;
    }
    const student = (this.data.registeredStudents || []).find(s => s.id === studentId || s.chestNo === studentId);
    if (!student) {
      throw new Error(`Student with ID "${studentId}" not found in Dalailussunna Dars student database.`);
    }

    // Check duplicate active registration
    const existingActive = (this.data.registrations || []).find(
      r => r.studentId === student.id && r.status !== 'Cancelled'
    );
    if (existingActive) {
      throw new Error(`Student ${student.name} (${student.id}) is already registered under Ticket ID: ${existingActive.ticketId}. Duplicate registrations are strictly blocked.`);
    }

    const ticketId = this.generateNextTicketId('existing_student');
    const now = new Date().toISOString();
    const verificationCode = `VER-DLZ-${ticketId.replace('DLZ-2026-', '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newRegistration = {
      id: `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticketId,
      type: 'existing_student',
      studentId: student.id,
      chestNo: student.chestNo,
      participantName: student.name,
      institution: student.institution || 'Dalailussunna Dars, Ayiroor',
      classCategory: student.classCategory || 'General',
      teamId: student.teamId || '',
      teamName: student.teamName || '',
      phone: (payload.phone || student.phone || '').trim(),
      email: (payload.email || student.email || '').trim(),
      gender: student.gender || 'Male',
      place: (payload.place || 'Ayiroor').trim(),
      registrationDate: now,
      status: 'Completed',
      verificationCode,
      notes: (payload.notes || '').trim(),
      registeredBy: actingUser,
      createdAt: now,
      updatedAt: now
    };

    if (!this.data.registrations) this.data.registrations = [];
    this.data.registrations.unshift(newRegistration);

    this.addRegistrationAuditLog({
      registrationId: newRegistration.id,
      ticketId: newRegistration.ticketId,
      action: 'REGISTRATION_CREATED',
      details: `Registered existing Dars student ${student.name} (${student.id}, ${student.chestNo}, ${student.teamName || 'Independent'}). Allocated Ticket ${ticketId}.`,
      performedBy: actingUser
    });

    this.saveData();
    return newRegistration;
  }

  registerExternalParticipant(payload = {}, actingUser = 'Authorized Official') {
    const rawName = payload.fullName || payload.name || '';
    if (!rawName.trim()) {
      throw new Error('Full Name is required for external participant registration.');
    }
    if (!payload.institution || !payload.institution.trim()) {
      throw new Error('Institution / Campus Name is required.');
    }
    if (!payload.phone || !payload.phone.trim()) {
      throw new Error('Contact Number is required.');
    }
    if (payload.registeredBy) actingUser = payload.registeredBy;

    const cleanPhone = payload.phone.trim();
    const cleanName = rawName.trim();

    // Check duplicate external participant by phone + name
    const existing = (this.data.registrations || []).find(
      r => r.type === 'external_participant' &&
        r.status !== 'Cancelled' &&
        r.phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '') &&
        r.participantName.toLowerCase() === cleanName.toLowerCase()
    );
    if (existing) {
      throw new Error(`External participant "${cleanName}" with contact "${cleanPhone}" is already registered under Ticket ID: ${existing.ticketId}.`);
    }

    const ticketId = this.generateNextTicketId('external_participant');
    const now = new Date().toISOString();

    // 1. Save External Participant in separate collection (NEVER mix into registeredStudents)
    const newParticipant = {
      id: `EXT-P-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: cleanName,
      institution: payload.institution.trim(),
      classCategory: payload.classCategory || 'General',
      phone: cleanPhone,
      email: (payload.email || '').trim(),
      district: (payload.district || '').trim(),
      gender: payload.gender || 'Not Specified',
      createdAt: now
    };

    if (!this.data.externalParticipants) this.data.externalParticipants = [];
    this.data.externalParticipants.push(newParticipant);

    // 2. Save centralized registration record
    const verificationCode = `VER-EXT-${ticketId.replace('EXT-2026-', '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newRegistration = {
      id: `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ticketId,
      type: 'external_participant',
      externalParticipantId: newParticipant.id,
      participantName: newParticipant.fullName,
      institution: newParticipant.institution,
      classCategory: newParticipant.classCategory,
      phone: newParticipant.phone,
      email: newParticipant.email,
      district: newParticipant.district,
      gender: newParticipant.gender,
      registrationDate: now,
      status: 'Completed',
      verificationCode,
      notes: (payload.notes || '').trim(),
      registeredBy: actingUser,
      createdAt: now,
      updatedAt: now
    };

    if (!this.data.registrations) this.data.registrations = [];
    this.data.registrations.unshift(newRegistration);

    this.addRegistrationAuditLog({
      registrationId: newRegistration.id,
      ticketId: newRegistration.ticketId,
      action: 'REGISTRATION_CREATED',
      details: `Registered external participant ${newParticipant.fullName} from ${newParticipant.institution}. Allocated Ticket ${ticketId}.`,
      performedBy: actingUser
    });

    this.saveData();
    return newRegistration;
  }

  updateRegistrationStatus(registrationId, newStatus, reason = '', actingUser = 'Authorized Official') {
    const reg = (this.data.registrations || []).find(r => r.id === registrationId || r.ticketId === registrationId);
    if (!reg) throw new Error('Registration record not found.');

    const oldStatus = reg.status;
    reg.status = newStatus;
    reg.updatedAt = new Date().toISOString();
    if (reason) {
      reg.statusChangeReason = reason.trim();
    }

    this.addRegistrationAuditLog({
      registrationId: reg.id,
      ticketId: reg.ticketId,
      action: 'STATUS_CHANGED',
      details: `Status changed from ${oldStatus} to ${newStatus}. ${reason ? `Reason: ${reason.trim()}` : ''}`,
      performedBy: actingUser
    });

    this.saveData();
    return reg;
  }

  updateRegistration(registrationId, updates = {}, actingUser = 'Authorized Official') {
    const reg = (this.data.registrations || []).find(r => r.id === registrationId || r.ticketId === registrationId);
    if (!reg) throw new Error('Registration record not found.');

    if (updates.phone !== undefined) reg.phone = updates.phone.trim();
    if (updates.email !== undefined) reg.email = updates.email.trim();
    if (updates.notes !== undefined) reg.notes = updates.notes.trim();
    if (updates.institution && reg.type === 'external_participant') reg.institution = updates.institution.trim();
    if (updates.classCategory) reg.classCategory = updates.classCategory;

    reg.updatedAt = new Date().toISOString();

    this.addRegistrationAuditLog({
      registrationId: reg.id,
      ticketId: reg.ticketId,
      action: 'REGISTRATION_UPDATED',
      details: `Updated registration details for ${reg.participantName} (${reg.ticketId}).`,
      performedBy: actingUser
    });

    this.saveData();
    return reg;
  }

  reissueRegistrationTicket(registrationId, reason = '', actingUser = 'Authorized Official') {
    const reg = (this.data.registrations || []).find(r => r.id === registrationId || r.ticketId === registrationId);
    if (!reg) throw new Error('Registration record not found.');

    const oldTicketId = reg.ticketId;
    const newTicketId = this.generateNextTicketId(reg.type);

    if (!reg.previousTickets) reg.previousTickets = [];
    reg.previousTickets.push({
      ticketId: oldTicketId,
      reissuedAt: new Date().toISOString(),
      reason: reason.trim()
    });

    reg.ticketId = newTicketId;
    reg.verificationCode = `VER-${reg.type === 'existing_student' ? 'DLZ' : 'EXT'}-${newTicketId.split('-')[2]}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    reg.updatedAt = new Date().toISOString();

    this.addRegistrationAuditLog({
      registrationId: reg.id,
      ticketId: newTicketId,
      action: 'TICKET_REISSUED',
      details: `Reissued ticket. Previous: ${oldTicketId} -> New: ${newTicketId}. Reason: ${reason.trim() || 'Administrative Correction'}`,
      performedBy: actingUser
    });

    this.saveData();
    return reg;
  }

  verifyTicket(query) {
    if (!query || !query.trim()) {
      return { isValid: false, message: 'Please provide a Ticket ID or Verification Reference.' };
    }
    const clean = query.trim().toUpperCase();
    const reg = (this.data.registrations || []).find(
      r => (r.ticketId && r.ticketId.toUpperCase() === clean) ||
        (r.verificationCode && r.verificationCode.toUpperCase() === clean) ||
        (r.previousTickets && r.previousTickets.some(p => p.ticketId.toUpperCase() === clean))
    );

    if (!reg) {
      return {
        isValid: false,
        message: `No festival registration found matching reference "${query}". Invalid ticket.`
      };
    }

    const isCancelled = reg.status === 'Cancelled';
    return {
      isValid: !isCancelled,
      isCancelled,
      status: reg.status,
      ticketId: reg.ticketId,
      participantName: reg.participantName,
      type: reg.type === 'existing_student' ? 'Official Dars Student' : 'External Participant',
      studentId: reg.studentId || null,
      chestNo: reg.chestNo || null,
      teamName: reg.teamName || null,
      institution: reg.institution,
      classCategory: reg.classCategory,
      registrationDate: reg.registrationDate,
      verifiedAt: new Date().toISOString()
    };
  }

  addRegistrationAuditLog(entry) {
    if (!this.data.registrationAuditLogs) this.data.registrationAuditLogs = [];
    this.data.registrationAuditLogs.unshift({
      id: `RAUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      registrationId: entry.registrationId || '',
      ticketId: entry.ticketId || '',
      action: entry.action || 'REGISTRATION_EVENT',
      details: entry.details || '',
      performedBy: entry.performedBy || 'System',
      timestamp: new Date().toISOString()
    });
  }

  getRegistrationAuditLogs(registrationId = null) {
    const list = this.data.registrationAuditLogs || [];
    if (!registrationId) return list;
    return list.filter(l => l.registrationId === registrationId);
  }

  exportRegistrationsCSV(filterType = 'all') {
    let list = this.getRegistrations({ type: filterType });
    const headers = [
      'Ticket ID',
      'Registration Type',
      'Participant Name',
      'Student ID',
      'Chest No',
      'Team Contingent',
      'Institution',
      'Class Category',
      'Contact Phone',
      'Email',
      'Registration Date',
      'Registration Status',
      'Registered By',
      'Notes'
    ];

    const rows = list.map(r => [
      `"${r.ticketId || ''}"`,
      `"${r.type === 'existing_student' ? 'Official Dars Student' : 'External Participant'}"`,
      `"${(r.participantName || '').replace(/"/g, '""')}"`,
      `"${r.studentId || 'N/A'}"`,
      `"${r.chestNo || 'N/A'}"`,
      `"${r.teamName || 'N/A'}"`,
      `"${(r.institution || '').replace(/"/g, '""')}"`,
      `"${r.classCategory || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : ''}"`,
      `"${r.status || ''}"`,
      `"${r.registeredBy || ''}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }



  // // CHARTER PROGRAMME MASTER & AUTOMATIC LEADERBOARD METHODS// =========================================================================
  getProgrammeMaster({ category = 'all', format = 'all', type = 'all', query = '' } = {}) {
    let list = (this.data.programmeAssignments || []).map(p => {
      const regCount = Array.isArray(p.participants) ? p.participants.length : 0;
      const evals = (this.data.submittedEvaluations || []).filter(e => e.competitionId === p.competitionId || e.assignmentId === p.id);
      return {
        id: p.id,
        code: p.competitionCode || p.code,
        name: p.competitionTitle || p.title || p.name,
        category: p.category,
        format: p.format,
        type: p.type,
        order: p.order,
        stage: p.stage,
        stageId: p.stageId,
        date: p.date,
        time: p.time,
        status: p.status,
        maxMarks: p.maxMarks || 100,
        registeredCount: regCount,
        maxParticipants: p.maxParticipants || (p.type === 'Group' ? 16 : 24),
        maxEntriesPerTeam: p.maxEntriesPerTeam || (p.type === 'Group' ? 2 : 3),
        evaluationsCount: evals.length,
        isPublished: Boolean(p.isPublished),
        isOfficialCharter: Boolean(p.isOfficialCharter)
      };
    });

    if (category && category !== 'all') {
      list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    }
    if (format && format !== 'all') {
      list = list.filter(p => (p.format || '').toLowerCase() === format.toLowerCase());
    }
    if (type && type !== 'all') {
      list = list.filter(p => (p.type || '').toLowerCase() === type.toLowerCase());
    }
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.code && p.code.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const catOrder = { 'Minor': 1, 'Sub-Junior': 2, 'Junior': 3, 'Senior': 4, 'General': 5 };
      const diff = (catOrder[a.category] || 99) - (catOrder[b.category] || 99);
      if (diff !== 0) return diff;
      return (a.order || 0) - (b.order || 0);
    });

    return list;
  }

  recalculateTeamLeaderboard() {
    const teamMap = {};
    (this.data.teams || []).forEach(t => {
      teamMap[t.id] = {
        ...t,
        points: 0,
        firstPlaces: 0,
        secondPlaces: 0,
        thirdPlaces: 0,
        categoryBreakdown: {
          Minor: 0,
          'Sub-Junior': 0,
          Junior: 0,
          Senior: 0,
          General: 0
        }
      };
    });

    const scoringRules = this.getScoringRules();
    const posters = this.data.resultPosters || [];

    posters.forEach(poster => {
      const comp = (this.data.programmeAssignments || []).find(c =>
        c.competitionId === poster.competitionId || c.competitionCode === poster.competitionCode
      );
      const isGroup = (comp?.type || '').toLowerCase() === 'group';
      const category = comp?.category || poster.category || 'General';
      const pointsTable = isGroup ? scoringRules.group : scoringRules.individual;

      if (poster.firstPrize && poster.firstPrize.teamId && teamMap[poster.firstPrize.teamId]) {
        const t = teamMap[poster.firstPrize.teamId];
        const pts = pointsTable.first;
        t.points += pts;
        t.firstPlaces += 1;
        if (t.categoryBreakdown[category] !== undefined) t.categoryBreakdown[category] += pts;
      }
      if (poster.secondPrize && poster.secondPrize.teamId && teamMap[poster.secondPrize.teamId]) {
        const t = teamMap[poster.secondPrize.teamId];
        const pts = pointsTable.second;
        t.points += pts;
        t.secondPlaces += 1;
        if (t.categoryBreakdown[category] !== undefined) t.categoryBreakdown[category] += pts;
      }
      if (poster.thirdPrize && poster.thirdPrize.teamId && teamMap[poster.thirdPrize.teamId]) {
        const t = teamMap[poster.thirdPrize.teamId];
        const pts = pointsTable.third;
        t.points += pts;
        t.thirdPlaces += 1;
        if (t.categoryBreakdown[category] !== undefined) t.categoryBreakdown[category] += pts;
      }
    });

    this.data.teams.forEach(t => {
      if (teamMap[t.id]) {
        t.points = teamMap[t.id].points;
        t.firstPlaces = teamMap[t.id].firstPlaces;
        t.secondPlaces = teamMap[t.id].secondPlaces;
        t.thirdPlaces = teamMap[t.id].thirdPlaces;
        t.categoryBreakdown = teamMap[t.id].categoryBreakdown;
      }
    });

    this.recalculateTeamRankings();
    this.saveData();
    return this.data.teams;
  }

  getStudentLeaderboard() {
    const studentMap = {};
    (this.data.registeredStudents || []).forEach(s => {
      studentMap[s.id] = {
        id: s.id,
        chestNo: s.chestNo,
        name: s.name,
        category: s.classCategory,
        teamId: s.teamId,
        teamName: s.teamName,
        points: 0,
        firstPlaces: 0,
        secondPlaces: 0,
        thirdPlaces: 0,
        eventsCount: 0
      };
    });

    const posters = this.data.resultPosters || [];
    const indPoints = this.getScoringRules().individual;

    posters.forEach(poster => {
      const comp = (this.data.programmeAssignments || []).find(c =>
        c.competitionId === poster.competitionId || c.competitionCode === poster.competitionCode
      );
      if ((comp?.type || '').toLowerCase() !== 'group') {
        [
          { key: 'firstPrize', pts: indPoints.first, rank: 1 },
          { key: 'secondPrize', pts: indPoints.second, rank: 2 },
          { key: 'thirdPrize', pts: indPoints.third, rank: 3 }
        ].forEach(({ key, pts, rank }) => {
          const winner = poster[key];
          if (winner) {
            const student = (this.data.registeredStudents || []).find(s =>
              s.chestNo === winner.chestNo || s.name === winner.name
            );
            if (student && studentMap[student.id]) {
              studentMap[student.id].points += pts;
              if (rank === 1) studentMap[student.id].firstPlaces += 1;
              else if (rank === 2) studentMap[student.id].secondPlaces += 1;
              else studentMap[student.id].thirdPlaces += 1;
            }
          }
        });
      }
    });

    return Object.values(studentMap)
      .filter(s => s.points > 0)
      .sort((a, b) => b.points - a.points || b.firstPlaces - a.firstPlaces);
  }

  getCategoryLeaderboard() {
    const categories = ['Minor', 'Sub-Junior', 'Junior', 'Senior', 'General'];
    const scoringRules = this.getScoringRules();

    return categories.map(cat => {
      const progs = (this.data.programmeAssignments || []).filter(p => p.category === cat);
      const published = progs.filter(p => p.isPublished).length;

      let dazzlersPts = 0;
      let dynamosPts = 0;

      const posters = (this.data.resultPosters || []).filter(p => p.category === cat);
      posters.forEach(poster => {
        ['firstPrize', 'secondPrize', 'thirdPrize'].forEach(key => {
          const w = poster[key];
          if (w && w.points) {
            if (w.teamId === 'team-1' || w.teamName === 'Dazzlers') dazzlersPts += w.points;
            else if (w.teamId === 'team-2' || w.teamName === 'Dynamos') dynamosPts += w.points;
          }
        });
      });

      return {
        category: cat,
        totalEvents: progs.length,
        publishedEvents: published,
        dazzlersPoints: dazzlersPts,
        dynamosPoints: dynamosPts,
        leader: dazzlersPts > dynamosPts ? 'Dazzlers' : (dynamosPts > dazzlersPts ? 'Dynamos' : 'Tied')
      };
    });
  }
}

export const festivalStore = new FestivalStore();
export default festivalStore;
