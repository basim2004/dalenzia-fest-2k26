// Dalenzia Fest 2K26 - Official Charter Data (from Dalenzia_2K26_Festival_Charter_BW.pdf)

export const OFFICIAL_PROGRAMME_CATEGORIES = [
  {
    id: 'CAT-MIN',
    code: 'MIN',
    name: 'Minor',
    displayName: 'Minor Category',
    description: 'Foundation tier: 18 official programmes (9 On Stage, 9 Off Stage)',
    color: '#10B981',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    totalItems: 18,
    stageItems: 9,
    offStageItems: 9,
    isActive: true
  },
  {
    id: 'CAT-SUB',
    code: 'SUB',
    name: 'Sub-Junior',
    displayName: 'Sub-Junior Category',
    description: 'Intermediate lower tier: 19 official programmes (11 On Stage, 8 Off Stage)',
    color: '#2563EB',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    totalItems: 19,
    stageItems: 11,
    offStageItems: 8,
    isActive: true
  },
  {
    id: 'CAT-JUN',
    code: 'JUN',
    name: 'Junior',
    displayName: 'Junior Category',
    description: 'Intermediate upper tier: 18 official programmes (10 On Stage, 8 Off Stage)',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    totalItems: 18,
    stageItems: 10,
    offStageItems: 8,
    isActive: true
  },
  {
    id: 'CAT-SEN',
    code: 'SEN',
    name: 'Senior',
    displayName: 'Senior Category',
    description: 'Advanced scholar tier: 17 official programmes (10 On Stage, 7 Off Stage)',
    color: '#A91F35',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    totalItems: 17,
    stageItems: 10,
    offStageItems: 7,
    isActive: true
  },
  {
    id: 'CAT-GEN',
    code: 'GEN',
    name: 'General',
    displayName: 'General Category',
    description: 'Open & Ensemble tier: 11 official programmes (9 On Stage, 2 Off Stage; Group & Team items)',
    color: '#E6A916',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    totalItems: 11,
    stageItems: 9,
    offStageItems: 2,
    isActive: true
  }
];

// Official Charter Student Strength Targets per Category (Pages 1-3)
export const OFFICIAL_CHARTER_STUDENT_TARGETS = {
  Minor: 19,
  SubJunior: 12,
  Junior: 7,
  Senior: 8,
  total: 46
};

export const OFFICIAL_TEAMS = [
  {
    id: 'team-1',
    number: 1,
    name: 'TEAM 1',
    displayName: 'TEAM 1 (Dazzlers)',
    code: 'T1',
    color: '#A91F35',
    headerBg: 'bg-[#A91F35]',
    headerColor: '#A91F35',
    textColor: '#FFFFFF',
    borderColor: 'border-[#A91F35]',
    badge: '👑',
    leader: 'Noufal',
    leaderStudentId: 'STU-1001',
    asstLeader: 'Hafiz Hassan',
    asstLeaderStudentId: 'STU-1002',
    points: 0,
    members: 22,
    status: 'Active',
    students: []
  },
  {
    id: 'team-2',
    number: 2,
    name: 'TEAM 2',
    displayName: 'TEAM 2 (Dynamos)',
    code: 'T2',
    color: '#E6A916',
    headerBg: 'bg-[#E6A916]',
    headerColor: '#E6A916',
    textColor: '#FFFFFF',
    borderColor: 'border-[#E6A916]',
    badge: '⚡',
    leader: 'Hashim',
    leaderStudentId: 'STU-1005',
    asstLeader: 'Irfan Edayyur',
    asstLeaderStudentId: 'STU-1008',
    points: 0,
    members: 22,
    status: 'Active',
    students: []
  }
];

// Official Charter Scoring Configuration (Charter Page 4)
export const OFFICIAL_SCORING_CONFIG = {
  // Official Position Points
  positionPoints: {
    individual: {
      first: 3,
      second: 2,
      third: 1,
      label: 'Individual Event (3 - 2 - 1 Points)'
    },
    group: {
      first: 10,
      second: 8,
      third: 6,
      label: 'Group Event (10 - 8 - 6 Points)'
    }
  },
  // Official Grades (Charter Page 4: A+, A, B, C)
  // Charter notes grade points differ between Individual and Group, but does NOT specify numbers in text.
  // Left unconfigured / inactive until authorized Main Admin confirmation.
  isGradePointsActive: false,
  grades: [
    {
      grade: 'A+',
      minMarks: 85,
      individualPoints: null,
      groupPoints: null,
      label: 'Distinction / Outstanding',
      isActive: true
    },
    {
      grade: 'A',
      minMarks: 75,
      individualPoints: null,
      groupPoints: null,
      label: 'First Class / Excellent',
      isActive: true
    },
    {
      grade: 'B',
      minMarks: 60,
      individualPoints: null,
      groupPoints: null,
      label: 'Second Class / Good',
      isActive: true
    },
    {
      grade: 'C',
      minMarks: 45,
      individualPoints: null,
      groupPoints: null,
      label: 'Pass / Satisfactory',
      isActive: true
    }
  ],
  // Entry Limits per Charter Page 3
  entryLimits: {
    maxStageItemsPerStudent: 4,
    maxOffStageItemsPerStudent: 4,
    maxEntriesPerTeamIndividual: 3,
    maxEntriesPerTeamGroup: 2
  },
  audit: {
    lastUpdatedBy: 'Charter Default',
    lastUpdatedAt: '2026-11-21',
    confirmedByAdmin: false
  }
};

// All 83 Official Programmes strictly from Charter Pages 5 - 9
// 40 Stage + 32 Off Stage + 11 General = 83 Master Definitions
export const OFFICIAL_CHARTER_PROGRAMMES = [
  // STAGE PROGRAMMES (40 Total)
  // Minor (9 Items) - Page 5
  { id: 'PRG-MIN-STG-01', code: 'MIN-STG-01', name: 'Tarteel', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 1, maxMarks: 100 },
  { id: 'PRG-MIN-STG-02', code: 'MIN-STG-02', name: 'Elocution Malayalam', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 2, maxMarks: 100 },
  { id: 'PRG-MIN-STG-03', code: 'MIN-STG-03', name: 'Madh Song', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 3, maxMarks: 100 },
  { id: 'PRG-MIN-STG-04', code: 'MIN-STG-04', name: 'Quiz', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 4, maxMarks: 100 },
  { id: 'PRG-MIN-STG-05', code: 'MIN-STG-05', name: 'Swarf Test', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 5, maxMarks: 100 },
  { id: 'PRG-MIN-STG-06', code: 'MIN-STG-06', name: 'Talk Master Arabic', classification: 'Stage', category: 'Minor', type: 'Group', requiredMembers: 2, source: 'Official Festival Charter', status: 'Available', order: 6, maxMarks: 100 },
  { id: 'PRG-MIN-STG-07', code: 'MIN-STG-07', name: 'Word Game Arabic', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 7, maxMarks: 100 },
  { id: 'PRG-MIN-STG-08', code: 'MIN-STG-08', name: 'Story Telling Malayalam', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 8, maxMarks: 100 },
  { id: 'PRG-MIN-STG-09', code: 'MIN-STG-09', name: 'News Reading', classification: 'Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 9, maxMarks: 100 },

  // Sub Junior (11 Items) - Page 6
  { id: 'PRG-SUB-STG-01', code: 'SUB-STG-01', name: 'Tarteel', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 10, maxMarks: 100 },
  { id: 'PRG-SUB-STG-02', code: 'SUB-STG-02', name: 'Elocution Malayalam', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 11, maxMarks: 100 },
  { id: 'PRG-SUB-STG-03', code: 'SUB-STG-03', name: 'Elocution English', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 12, maxMarks: 100 },
  { id: 'PRG-SUB-STG-04', code: 'SUB-STG-04', name: 'Talk Master Arabic', classification: 'Stage', category: 'Sub Junior', type: 'Group', requiredMembers: 2, source: 'Official Festival Charter', status: 'Available', order: 13, maxMarks: 100 },
  { id: 'PRG-SUB-STG-05', code: 'SUB-STG-05', name: 'Madh Song', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 14, maxMarks: 100 },
  { id: 'PRG-SUB-STG-06', code: 'SUB-STG-06', name: 'Quiz', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 15, maxMarks: 100 },
  { id: 'PRG-SUB-STG-07', code: 'SUB-STG-07', name: 'Swarf Test', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 16, maxMarks: 100 },
  { id: 'PRG-SUB-STG-08', code: 'SUB-STG-08', name: 'Mappila Pattu', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 17, maxMarks: 100 },
  { id: 'PRG-SUB-STG-09', code: 'SUB-STG-09', name: 'Ibarath Reading', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 18, maxMarks: 100 },
  { id: 'PRG-SUB-STG-10', code: 'SUB-STG-10', name: 'Poem Recitation (Arabic)', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 19, maxMarks: 100 },
  { id: 'PRG-SUB-STG-11', code: 'SUB-STG-11', name: 'Imla', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 20, maxMarks: 100 },

  // Junior (10 Items) - Page 7
  { id: 'PRG-JUN-STG-01', code: 'JUN-STG-01', name: 'Tarteel', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 21, maxMarks: 100 },
  { id: 'PRG-JUN-STG-02', code: 'JUN-STG-02', name: 'Elocution Malayalam', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 22, maxMarks: 100 },
  { id: 'PRG-JUN-STG-03', code: 'JUN-STG-03', name: 'Elocution English', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 23, maxMarks: 100 },
  { id: 'PRG-JUN-STG-04', code: 'JUN-STG-04', name: 'Elocution Arabic', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 24, maxMarks: 100 },
  { id: 'PRG-JUN-STG-05', code: 'JUN-STG-05', name: 'Devotional Song (ഭക്തിഗാനം)', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 25, maxMarks: 100 },
  { id: 'PRG-JUN-STG-06', code: 'JUN-STG-06', name: 'Madh Song', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 26, maxMarks: 100 },
  { id: 'PRG-JUN-STG-07', code: 'JUN-STG-07', name: 'Mappilapattu', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 27, maxMarks: 100 },
  { id: 'PRG-JUN-STG-08', code: 'JUN-STG-08', name: 'Ibarath Reading', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 28, maxMarks: 100 },
  { id: 'PRG-JUN-STG-09', code: 'JUN-STG-09', name: 'Quiz', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 29, maxMarks: 100 },
  { id: 'PRG-JUN-STG-10', code: 'JUN-STG-10', name: 'Extempore Malayalam', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 30, maxMarks: 100 },

  // Senior (10 Items) - Page 8
  { id: 'PRG-SEN-STG-01', code: 'SEN-STG-01', name: 'Tarteel', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 31, maxMarks: 100 },
  { id: 'PRG-SEN-STG-02', code: 'SEN-STG-02', name: 'Elocution Malayalam', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 32, maxMarks: 100 },
  { id: 'PRG-SEN-STG-03', code: 'SEN-STG-03', name: 'Elocution English', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 33, maxMarks: 100 },
  { id: 'PRG-SEN-STG-04', code: 'SEN-STG-04', name: 'Elocution Arabic', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 34, maxMarks: 100 },
  { id: 'PRG-SEN-STG-05', code: 'SEN-STG-05', name: "Musha'ara Alfiya", classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 35, maxMarks: 100 },
  { id: 'PRG-SEN-STG-06', code: 'SEN-STG-06', name: 'Madh Song', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 36, maxMarks: 100 },
  { id: 'PRG-SEN-STG-07', code: 'SEN-STG-07', name: 'Dua Recitation', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 37, maxMarks: 100 },
  { id: 'PRG-SEN-STG-08', code: 'SEN-STG-08', name: 'Quiz', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 38, maxMarks: 100 },
  { id: 'PRG-SEN-STG-09', code: 'SEN-STG-09', name: 'Thadrees', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 39, maxMarks: 100 },
  { id: 'PRG-SEN-STG-10', code: 'SEN-STG-10', name: 'Extempore Malayalam', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 40, maxMarks: 100 },

  // OFF STAGE PROGRAMMES (32 Total)
  // Minor (9 Items) - Page 5
  { id: 'PRG-MIN-OFF-01', code: 'MIN-OFF-01', name: 'Essay Malayalam', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 41, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-02', code: 'MIN-OFF-02', name: 'Story Malayalam', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 42, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-03', code: 'MIN-OFF-03', name: 'Book Test', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 43, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-04', code: 'MIN-OFF-04', name: 'Water Colouring', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 44, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-05', code: 'MIN-OFF-05', name: 'Pencil Drawing', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 45, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-06', code: 'MIN-OFF-06', name: 'Handwriting English', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 46, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-07', code: 'MIN-OFF-07', name: 'Handwriting Arabic', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 47, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-08', code: 'MIN-OFF-08', name: 'Memory Test', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 48, maxMarks: 100 },
  { id: 'PRG-MIN-OFF-09', code: 'MIN-OFF-09', name: 'Spelling Bee', classification: 'Off Stage', category: 'Minor', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 49, maxMarks: 100 },

  // Sub Junior (8 Items) - Page 6
  { id: 'PRG-SUB-OFF-01', code: 'SUB-OFF-01', name: 'Essay Malayalam', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 50, maxMarks: 100 },
  { id: 'PRG-SUB-OFF-02', code: 'SUB-OFF-02', name: 'Poem Malayalam', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 51, maxMarks: 100 },
  { id: 'PRG-SUB-OFF-03', code: 'SUB-OFF-03', name: 'Water Colouring', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 52, maxMarks: 100 },
  { id: 'PRG-SUB-OFF-04', code: 'SUB-OFF-04', name: 'Pencil Drawing', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 53, maxMarks: 100 },
  { id: 'PRG-SUB-OFF-05', code: 'SUB-OFF-05', name: 'Handwriting Arabic', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 54, maxMarks: 100 },
  { id: 'PRG-SUB-OFF-06', code: 'SUB-OFF-06', name: 'Book Test', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 55, maxMarks: 100 },
  { id: 'PRG-SUB-OFF-07', code: 'SUB-OFF-07', name: 'Caption Writing', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 56, maxMarks: 100 },
  { id: 'PRG-SUB-OFF-08', code: 'SUB-OFF-08', name: 'Maths Relay', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 57, maxMarks: 100 },

  // Junior (8 Items) - Page 7
  { id: 'PRG-JUN-OFF-01', code: 'JUN-OFF-01', name: 'Essay Malayalam', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 58, maxMarks: 100 },
  { id: 'PRG-JUN-OFF-02', code: 'JUN-OFF-02', name: 'Essay Arabic', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 59, maxMarks: 100 },
  { id: 'PRG-JUN-OFF-03', code: 'JUN-OFF-03', name: 'Pencil Drawing', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 60, maxMarks: 100 },
  { id: 'PRG-JUN-OFF-04', code: 'JUN-OFF-04', name: 'Calligraphy Arabic', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 61, maxMarks: 100 },
  { id: 'PRG-JUN-OFF-05', code: 'JUN-OFF-05', name: 'Poem Malayalam', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 62, maxMarks: 100 },
  { id: 'PRG-JUN-OFF-06', code: 'JUN-OFF-06', name: 'Caption Writing', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 63, maxMarks: 100 },
  { id: 'PRG-JUN-OFF-07', code: 'JUN-OFF-07', name: 'Translation Arabic – Malayalam', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 64, maxMarks: 100 },
  { id: 'PRG-JUN-OFF-08', code: 'JUN-OFF-08', name: 'Book Test', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 65, maxMarks: 100 },

  // Senior (7 Items) - Page 8
  { id: 'PRG-SEN-OFF-01', code: 'SEN-OFF-01', name: 'Essay Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 66, maxMarks: 100 },
  { id: 'PRG-SEN-OFF-02', code: 'SEN-OFF-02', name: 'Essay Arabic', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 67, maxMarks: 100 },
  { id: 'PRG-SEN-OFF-03', code: 'SEN-OFF-03', name: 'Poem Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 68, maxMarks: 100 },
  { id: 'PRG-SEN-OFF-04', code: 'SEN-OFF-04', name: 'Poem Arabic', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 69, maxMarks: 100 },
  { id: 'PRG-SEN-OFF-05', code: 'SEN-OFF-05', name: 'Translation English – Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 70, maxMarks: 100 },
  { id: 'PRG-SEN-OFF-06', code: 'SEN-OFF-06', name: 'Translation Arabic – Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 71, maxMarks: 100 },
  { id: 'PRG-SEN-OFF-07', code: 'SEN-OFF-07', name: 'Slogan Writing Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 72, maxMarks: 100 },

  // GENERAL PROGRAMMES – TEAM BASED (11 Items) - Page 9
  { id: 'PRG-GEN-01', code: 'GEN-01', name: 'Spot Magazine', classification: 'General', category: 'General', type: 'Team', requiredMembers: 5, source: 'Official Festival Charter', status: 'Available', order: 73, maxMarks: 100 },
  { id: 'PRG-GEN-02', code: 'GEN-02', name: 'Group Song', classification: 'General', category: 'General', type: 'Team', requiredMembers: 4, source: 'Official Festival Charter', status: 'Available', order: 74, maxMarks: 100 },
  { id: 'PRG-GEN-03', code: 'GEN-03', name: 'Nasheeda', classification: 'General', category: 'General', type: 'Team', requiredMembers: 5, source: 'Official Festival Charter', status: 'Available', order: 75, maxMarks: 100 },
  { id: 'PRG-GEN-04', code: 'GEN-04', name: 'Moulid Parayanam', classification: 'General', category: 'General', type: 'Team', requiredMembers: 4, source: 'Official Festival Charter', status: 'Available', order: 76, maxMarks: 100 },
  { id: 'PRG-GEN-05', code: 'GEN-05', name: 'Qaseeda Parayanam', classification: 'General', category: 'General', type: 'Team', requiredMembers: 4, source: 'Official Festival Charter', status: 'Available', order: 77, maxMarks: 100 },
  { id: 'PRG-GEN-06', code: 'GEN-06', name: 'Qawwali', classification: 'General', category: 'General', type: 'Team', requiredMembers: 5, source: 'Official Festival Charter', status: 'Available', order: 78, maxMarks: 100 },
  { id: 'PRG-GEN-07', code: 'GEN-07', name: 'Mappilapattu Rachana', classification: 'General', category: 'General', type: 'Team', requiredMembers: 3, source: 'Official Festival Charter', status: 'Available', order: 79, maxMarks: 100 },
  { id: 'PRG-GEN-08', code: 'GEN-08', name: "Musha'ara", classification: 'General', category: 'General', type: 'Team', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 80, maxMarks: 100 },
  { id: 'PRG-GEN-09', code: 'GEN-09', name: 'Malappattu', classification: 'General', category: 'General', type: 'Team', requiredMembers: 4, source: 'Official Festival Charter', status: 'Available', order: 81, maxMarks: 100 },
  { id: 'PRG-GEN-10', code: 'GEN-10', name: 'Vayal', classification: 'General', category: 'General', type: 'Team', requiredMembers: 3, source: 'Official Festival Charter', status: 'Available', order: 82, maxMarks: 100 },
  { id: 'PRG-GEN-11', code: 'GEN-11', name: 'Ideal Speech', classification: 'General', category: 'General', type: 'Team', requiredMembers: null, source: 'Official Festival Charter', status: 'Available', order: 83, maxMarks: 100 }
];

// Helper to convert charter programmes into configured Competition Assignment schema
export function createDefaultProgrammeAssignments() {
  return OFFICIAL_CHARTER_PROGRAMMES.map((p, idx) => {
    const isStage = p.classification === 'Stage';
    const stageId = isStage ? (idx % 2 === 0 ? 'STG-01' : 'STG-02') : 'OFF-STAGE';
    const stageName = isStage ? (idx % 2 === 0 ? 'Cordova Grand Stage (Stage 01)' : 'Al-Farabi Heritage Hall (Stage 02)') : 'Academic Halls / Off Stage';
    const day = (idx % 3) + 21; // 21, 22, 23 Dec 2026

    const defaultCriteria = [
      { id: 'c1', name: 'Content & Expression / തനിമ & പ്രമേയം', maxMarks: 40 },
      { id: 'c2', name: 'Presentation & Pronunciation / ശൈലി & ഉച്ചാരണം', maxMarks: 30 },
      { id: 'c3', name: 'Accuracy & Grammar / കൃത്യത & വ്യാകരണം', maxMarks: 20 },
      { id: 'c4', name: 'Overall Impression / സവിശേഷ പ്രകടനം', maxMarks: 10 }
    ];

    return {
      id: p.id,
      competitionId: p.id,
      competitionCode: p.code,
      code: p.code,
      title: p.name,
      competitionTitle: p.name,
      name: p.name,
      category: p.category,
      categoryCode: p.category.toUpperCase().slice(0, 3),
      classification: p.classification,
      format: p.classification,
      type: p.type,
      requiredMembers: p.requiredMembers,
      source: p.source,
      order: p.order,
      stageId: stageId,
      stage: stageName,
      venue: stageName,
      date: `2026-12-${day}`,
      time: '10:00 AM',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      duration: '45 mins',
      status: 'Scheduled',
      isOfficialCharter: true,
      maxParticipants: p.type === 'Team' || p.type === 'Group' ? 16 : 24,
      maxEntriesPerTeam: p.type === 'Team' || p.type === 'Group' ? 2 : 3,
      groupSize: p.requiredMembers ? `${p.requiredMembers} Members` : (p.type === 'Individual' ? '1 Student' : 'Team'),
      assignedJudgeIds: ['JDG-1001', 'JDG-001'],
      participants: [],
      maxMarks: p.maxMarks || 100,
      totalMaxMarks: p.maxMarks || 100,
      criteria: defaultCriteria,
      evaluationCriteria: defaultCriteria,
      desc: `Official DALENZIA FEST 2K26 ${p.category} ${p.classification} event: ${p.name}.`,
      isPublished: false,
      publishedAt: null
    };
  });
}
