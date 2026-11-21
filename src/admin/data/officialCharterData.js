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

export const OFFICIAL_TEAMS = [
  {
    id: 'team-1',
    name: 'Dazzlers',
    code: 'DAZ',
    color: '#E6A916',
    leader: 'Noufal',
    asstLeader: 'Hafiz Hassan',
    points: 0,
    members: 22,
    students: []
  },
  {
    id: 'team-2',
    name: 'Dynamos',
    code: 'DYN',
    color: '#A91F35',
    leader: 'Hashim',
    asstLeader: 'Irfan Edayur',
    points: 0,
    members: 24,
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
export const OFFICIAL_CHARTER_PROGRAMMES = [
  // Minor (Page 5) - 18 items (9 Stage, 9 Off Stage)
  { id: 'PRG-MIN-01', code: 'MIN-01', name: 'Tarteel', category: 'Minor', format: 'On Stage', type: 'Individual', order: 1, maxMarks: 100 },
  { id: 'PRG-MIN-02', code: 'MIN-02', name: 'Elocution Malayalam', category: 'Minor', format: 'On Stage', type: 'Individual', order: 2, maxMarks: 100 },
  { id: 'PRG-MIN-03', code: 'MIN-03', name: 'Madh Song', category: 'Minor', format: 'On Stage', type: 'Individual', order: 3, maxMarks: 100 },
  { id: 'PRG-MIN-04', code: 'MIN-04', name: 'Quiz', category: 'Minor', format: 'On Stage', type: 'Individual', order: 4, maxMarks: 100 },
  { id: 'PRG-MIN-05', code: 'MIN-05', name: 'Swarf Test', category: 'Minor', format: 'On Stage', type: 'Individual', order: 5, maxMarks: 100 },
  { id: 'PRG-MIN-06', code: 'MIN-06', name: 'Talk Master Arabic', category: 'Minor', format: 'On Stage', type: 'Group', order: 6, maxMarks: 100, groupSize: '2 Members' },
  { id: 'PRG-MIN-07', code: 'MIN-07', name: 'Word Game Arabic', category: 'Minor', format: 'On Stage', type: 'Individual', order: 7, maxMarks: 100 },
  { id: 'PRG-MIN-08', code: 'MIN-08', name: 'Story Telling Malayalam', category: 'Minor', format: 'On Stage', type: 'Individual', order: 8, maxMarks: 100 },
  { id: 'PRG-MIN-09', code: 'MIN-09', name: 'News Reading', category: 'Minor', format: 'On Stage', type: 'Individual', order: 9, maxMarks: 100 },
  { id: 'PRG-MIN-10', code: 'MIN-10', name: 'Essay Malayalam', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 10, maxMarks: 100 },
  { id: 'PRG-MIN-11', code: 'MIN-11', name: 'Story Malayalam', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 11, maxMarks: 100 },
  { id: 'PRG-MIN-12', code: 'MIN-12', name: 'Book Test', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 12, maxMarks: 100 },
  { id: 'PRG-MIN-13', code: 'MIN-13', name: 'Water Colouring', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 13, maxMarks: 100 },
  { id: 'PRG-MIN-14', code: 'MIN-14', name: 'Pencil Drawing', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 14, maxMarks: 100 },
  { id: 'PRG-MIN-15', code: 'MIN-15', name: 'Handwriting English', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 15, maxMarks: 100 },
  { id: 'PRG-MIN-16', code: 'MIN-16', name: 'Handwriting Arabic', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 16, maxMarks: 100 },
  { id: 'PRG-MIN-17', code: 'MIN-17', name: 'Memory Test', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 17, maxMarks: 100 },
  { id: 'PRG-MIN-18', code: 'MIN-18', name: 'Spelling Bee', category: 'Minor', format: 'Off Stage', type: 'Individual', order: 18, maxMarks: 100 },

  // Sub-Junior (Page 6) - 19 items (11 Stage, 8 Off Stage)
  { id: 'PRG-SUB-01', code: 'SUB-01', name: 'Tarteel', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 1, maxMarks: 100 },
  { id: 'PRG-SUB-02', code: 'SUB-02', name: 'Elocution Malayalam', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 2, maxMarks: 100 },
  { id: 'PRG-SUB-03', code: 'SUB-03', name: 'Elocution English', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 3, maxMarks: 100 },
  { id: 'PRG-SUB-04', code: 'SUB-04', name: 'Talk Master Arabic', category: 'Sub-Junior', format: 'On Stage', type: 'Group', order: 4, maxMarks: 100, groupSize: '2 Members' },
  { id: 'PRG-SUB-05', code: 'SUB-05', name: 'Madh Song', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 5, maxMarks: 100 },
  { id: 'PRG-SUB-06', code: 'SUB-06', name: 'Quiz', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 6, maxMarks: 100 },
  { id: 'PRG-SUB-07', code: 'SUB-07', name: 'Swarf Test', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 7, maxMarks: 100 },
  { id: 'PRG-SUB-08', code: 'SUB-08', name: 'Mappila Pattu', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 8, maxMarks: 100 },
  { id: 'PRG-SUB-09', code: 'SUB-09', name: 'Ibarath Reading', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 9, maxMarks: 100 },
  { id: 'PRG-SUB-10', code: 'SUB-10', name: 'Poem Recitation (Arabic)', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 10, maxMarks: 100 },
  { id: 'PRG-SUB-11', code: 'SUB-11', name: 'Imla', category: 'Sub-Junior', format: 'On Stage', type: 'Individual', order: 11, maxMarks: 100 },
  { id: 'PRG-SUB-12', code: 'SUB-12', name: 'Essay Malayalam', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 12, maxMarks: 100 },
  { id: 'PRG-SUB-13', code: 'SUB-13', name: 'Poem Malayalam', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 13, maxMarks: 100 },
  { id: 'PRG-SUB-14', code: 'SUB-14', name: 'Water Colouring', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 14, maxMarks: 100 },
  { id: 'PRG-SUB-15', code: 'SUB-15', name: 'Pencil Drawing', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 15, maxMarks: 100 },
  { id: 'PRG-SUB-16', code: 'SUB-16', name: 'Handwriting Arabic', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 16, maxMarks: 100 },
  { id: 'PRG-SUB-17', code: 'SUB-17', name: 'Book Test', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 17, maxMarks: 100 },
  { id: 'PRG-SUB-18', code: 'SUB-18', name: 'Caption Writing', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 18, maxMarks: 100 },
  { id: 'PRG-SUB-19', code: 'SUB-19', name: 'Maths Relay', category: 'Sub-Junior', format: 'Off Stage', type: 'Individual', order: 19, maxMarks: 100 },

  // Junior (Page 7) - 18 items (10 Stage, 8 Off Stage)
  { id: 'PRG-JUN-01', code: 'JUN-01', name: 'Tarteel', category: 'Junior', format: 'On Stage', type: 'Individual', order: 1, maxMarks: 100 },
  { id: 'PRG-JUN-02', code: 'JUN-02', name: 'Elocution Malayalam', category: 'Junior', format: 'On Stage', type: 'Individual', order: 2, maxMarks: 100 },
  { id: 'PRG-JUN-03', code: 'JUN-03', name: 'Elocution English', category: 'Junior', format: 'On Stage', type: 'Individual', order: 3, maxMarks: 100 },
  { id: 'PRG-JUN-04', code: 'JUN-04', name: 'Elocution Arabic', category: 'Junior', format: 'On Stage', type: 'Individual', order: 4, maxMarks: 100 },
  { id: 'PRG-JUN-05', code: 'JUN-05', name: 'Devotional Song (ഭക്തി ഗാനം)', category: 'Junior', format: 'On Stage', type: 'Individual', order: 5, maxMarks: 100 },
  { id: 'PRG-JUN-06', code: 'JUN-06', name: 'Madh Song', category: 'Junior', format: 'On Stage', type: 'Individual', order: 6, maxMarks: 100 },
  { id: 'PRG-JUN-07', code: 'JUN-07', name: 'Mappilapattu', category: 'Junior', format: 'On Stage', type: 'Individual', order: 7, maxMarks: 100 },
  { id: 'PRG-JUN-08', code: 'JUN-08', name: 'Ibarath Reading', category: 'Junior', format: 'On Stage', type: 'Individual', order: 8, maxMarks: 100 },
  { id: 'PRG-JUN-09', code: 'JUN-09', name: 'Quiz', category: 'Junior', format: 'On Stage', type: 'Individual', order: 9, maxMarks: 100 },
  { id: 'PRG-JUN-10', code: 'JUN-10', name: 'Extempore Malayalam', category: 'Junior', format: 'On Stage', type: 'Individual', order: 10, maxMarks: 100 },
  { id: 'PRG-JUN-11', code: 'JUN-11', name: 'Essay Malayalam', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 11, maxMarks: 100 },
  { id: 'PRG-JUN-12', code: 'JUN-12', name: 'Essay Arabic', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 12, maxMarks: 100 },
  { id: 'PRG-JUN-13', code: 'JUN-13', name: 'Pencil Drawing', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 13, maxMarks: 100 },
  { id: 'PRG-JUN-14', code: 'JUN-14', name: 'Calligraphy Arabic', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 14, maxMarks: 100 },
  { id: 'PRG-JUN-15', code: 'JUN-15', name: 'Poem Malayalam', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 15, maxMarks: 100 },
  { id: 'PRG-JUN-16', code: 'JUN-16', name: 'Caption Writing', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 16, maxMarks: 100 },
  { id: 'PRG-JUN-17', code: 'JUN-17', name: 'Translation Arabic – Malayalam', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 17, maxMarks: 100 },
  { id: 'PRG-JUN-18', code: 'JUN-18', name: 'Book Test', category: 'Junior', format: 'Off Stage', type: 'Individual', order: 18, maxMarks: 100 },

  // Senior (Page 8) - 17 items (10 Stage, 7 Off Stage)
  { id: 'PRG-SEN-01', code: 'SEN-01', name: 'Tarteel', category: 'Senior', format: 'On Stage', type: 'Individual', order: 1, maxMarks: 100 },
  { id: 'PRG-SEN-02', code: 'SEN-02', name: 'Elocution Malayalam', category: 'Senior', format: 'On Stage', type: 'Individual', order: 2, maxMarks: 100 },
  { id: 'PRG-SEN-03', code: 'SEN-03', name: 'Elocution English', category: 'Senior', format: 'On Stage', type: 'Individual', order: 3, maxMarks: 100 },
  { id: 'PRG-SEN-04', code: 'SEN-04', name: 'Elocution Arabic', category: 'Senior', format: 'On Stage', type: 'Individual', order: 4, maxMarks: 100 },
  { id: 'PRG-SEN-05', code: 'SEN-05', name: "Musha'ara Alfiya", category: 'Senior', format: 'On Stage', type: 'Individual', order: 5, maxMarks: 100 },
  { id: 'PRG-SEN-06', code: 'SEN-06', name: 'Madh Song', category: 'Senior', format: 'On Stage', type: 'Individual', order: 6, maxMarks: 100 },
  { id: 'PRG-SEN-07', code: 'SEN-07', name: 'Dua Recitation', category: 'Senior', format: 'On Stage', type: 'Individual', order: 7, maxMarks: 100 },
  { id: 'PRG-SEN-08', code: 'SEN-08', name: 'Quiz', category: 'Senior', format: 'On Stage', type: 'Individual', order: 8, maxMarks: 100 },
  { id: 'PRG-SEN-09', code: 'SEN-09', name: 'Thadrees', category: 'Senior', format: 'On Stage', type: 'Individual', order: 9, maxMarks: 100 },
  { id: 'PRG-SEN-10', code: 'SEN-10', name: 'Extempore Malayalam', category: 'Senior', format: 'On Stage', type: 'Individual', order: 10, maxMarks: 100 },
  { id: 'PRG-SEN-11', code: 'SEN-11', name: 'Essay Malayalam', category: 'Senior', format: 'Off Stage', type: 'Individual', order: 11, maxMarks: 100 },
  { id: 'PRG-SEN-12', code: 'SEN-12', name: 'Essay Arabic', category: 'Senior', format: 'Off Stage', type: 'Individual', order: 12, maxMarks: 100 },
  { id: 'PRG-SEN-13', code: 'SEN-13', name: 'Poem Malayalam', category: 'Senior', format: 'Off Stage', type: 'Individual', order: 13, maxMarks: 100 },
  { id: 'PRG-SEN-14', code: 'SEN-14', name: 'Poem Arabic', category: 'Senior', format: 'Off Stage', type: 'Individual', order: 14, maxMarks: 100 },
  { id: 'PRG-SEN-15', code: 'SEN-15', name: 'Translation English – Malayalam', category: 'Senior', format: 'Off Stage', type: 'Individual', order: 15, maxMarks: 100 },
  { id: 'PRG-SEN-16', code: 'SEN-16', name: 'Translation Arabic – Malayalam', category: 'Senior', format: 'Off Stage', type: 'Individual', order: 16, maxMarks: 100 },
  { id: 'PRG-SEN-17', code: 'SEN-17', name: 'Slogan Writing Malayalam', category: 'Senior', format: 'Off Stage', type: 'Individual', order: 17, maxMarks: 100 },

  // General (Page 9) - 11 items (Group and Team items)
  { id: 'PRG-GEN-01', code: 'GEN-01', name: 'Spot Magazine', category: 'General', format: 'Off Stage', type: 'Group', order: 1, maxMarks: 100, groupSize: 'Editorial Team' },
  { id: 'PRG-GEN-02', code: 'GEN-02', name: 'Group Song', category: 'General', format: 'On Stage', type: 'Group', order: 2, maxMarks: 100, groupSize: '6-8 Members' },
  { id: 'PRG-GEN-03', code: 'GEN-03', name: 'Nasheeda', category: 'General', format: 'On Stage', type: 'Group', order: 3, maxMarks: 100, groupSize: '6-8 Members' },
  { id: 'PRG-GEN-04', code: 'GEN-04', name: 'Moulid Parayanam', category: 'General', format: 'On Stage', type: 'Group', order: 4, maxMarks: 100, groupSize: 'Group' },
  { id: 'PRG-GEN-05', code: 'GEN-05', name: 'Qaseeda Parayanam', category: 'General', format: 'On Stage', type: 'Group', order: 5, maxMarks: 100, groupSize: 'Group' },
  { id: 'PRG-GEN-06', code: 'GEN-06', name: 'Qawwali', category: 'General', format: 'On Stage', type: 'Group', order: 6, maxMarks: 100, groupSize: 'Ensemble' },
  { id: 'PRG-GEN-07', code: 'GEN-07', name: 'Mappilapattu Rachana', category: 'General', format: 'Off Stage', type: 'Group', order: 7, maxMarks: 100, groupSize: 'Team' },
  { id: 'PRG-GEN-08', code: 'GEN-08', name: "Musha'ara", category: 'General', format: 'On Stage', type: 'Group', order: 8, maxMarks: 100, groupSize: 'Group' },
  { id: 'PRG-GEN-09', code: 'GEN-09', name: 'Malappattu', category: 'General', format: 'On Stage', type: 'Group', order: 9, maxMarks: 100, groupSize: 'Group' },
  { id: 'PRG-GEN-10', code: 'GEN-10', name: 'Vayal', category: 'General', format: 'On Stage', type: 'Group', order: 10, maxMarks: 100, groupSize: 'Group' },
  { id: 'PRG-GEN-11', code: 'GEN-11', name: 'Ideal Speech', category: 'General', format: 'On Stage', type: 'Individual', order: 11, maxMarks: 100 }
];

// Helper to convert charter programmes into both Programme and Competition Assignment schema
export function createDefaultProgrammeAssignments() {
  return OFFICIAL_CHARTER_PROGRAMMES.map((p, idx) => {
    const isStage = p.format === 'On Stage';
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
      format: p.format,
      type: p.type,
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
      maxParticipants: p.type === 'Group' ? 16 : 24,
      maxEntriesPerTeam: p.type === 'Group' ? 2 : 3,
      groupSize: p.groupSize || (p.type === 'Group' ? 'Group' : '1 Student'),
      assignedJudgeIds: ['JDG-1001', 'JDG-001'],
      participants: [],
      maxMarks: p.maxMarks || 100,
      totalMaxMarks: p.maxMarks || 100,
      criteria: defaultCriteria,
      evaluationCriteria: defaultCriteria,
      desc: `Official DALENZIA FEST 2K26 ${p.category} ${p.format} event: ${p.name}.`,
      isPublished: false,
      publishedAt: null
    };
  });
}
