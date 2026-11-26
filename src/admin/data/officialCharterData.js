// Official DALENZIA FEST 2K26 Updated Rulebook Data (12-Page Festival Charter + Team Charts)
// Verified against Dalenzia_2K26_Festival_Charter_Updated.pdf, dalenzia_team_tick_charts.pdf, dalenzia_general_tick_chart.pdf

export const OFFICIAL_CHARTER_METADATA = {
  version: '2K26-v2-12p',
  title: 'DALENZIA FEST 2K26 — Official Updated Rulebook & Programme Charter',
  totalProgrammes: 77,
  totalStageProgrammes: 32,
  totalOffStageProgrammes: 31,
  totalGeneralProgrammes: 14,
  totalStudents: 46,
  totalTeams: 2,
  maxIndividualPerTeam: 3,
  maxGeneralEntriesPerTeam: 2,
  confirmedDates: 'December 21, 22, 23, 2026',
  venue: 'Thaqwa Juma Masjid & Dalailussunna Dars, Ayiroor'
};

export const OFFICIAL_PROGRAMME_CATEGORIES = [
  {
    id: 'CAT-SUB',
    code: 'SUB',
    name: 'Sub Junior',
    malayalamName: 'സബ് ജൂനിയർ',
    displayName: 'Sub Junior Category',
    eligibility: 'Class 5 to 9 (5 മുതൽ 9 വരെ ക്ലാസ്)',
    description: '19 official programmes (10 Stage, 9 Off Stage). Max 4 Stage + 5 Off Stage per student.',
    color: '#2563EB',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    totalItems: 19,
    stageItems: 10,
    offStageItems: 9,
    generalItems: 0,
    maxStagePerStudent: 4,
    maxOffStagePerStudent: 5,
    studentTargets: { team1: 10, team2: 9, total: 19 },
    isActive: true
  },
  {
    id: 'CAT-JUN',
    code: 'JUN',
    name: 'Junior',
    malayalamName: 'ജൂനിയർ',
    displayName: 'Junior Category',
    eligibility: 'Class 10, +1 (10-ാം ക്ലാസ്, +1)',
    description: '23 official programmes (11 Stage, 12 Off Stage). Max 5 Stage + 6 Off Stage per student.',
    color: '#8B5CF6',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    totalItems: 23,
    stageItems: 11,
    offStageItems: 12,
    generalItems: 0,
    maxStagePerStudent: 5,
    maxOffStagePerStudent: 6,
    studentTargets: { team1: 7, team2: 8, total: 15 },
    isActive: true
  },
  {
    id: 'CAT-SEN',
    code: 'SEN',
    name: 'Senior',
    malayalamName: 'സീനിയർ',
    displayName: 'Senior Category',
    eligibility: '+2, Degree (+2, ഡിഗ്രി)',
    description: '21 official programmes (11 Stage, 10 Off Stage). Max 5 Stage + 6 Off Stage per student.',
    color: '#A91F35',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    totalItems: 21,
    stageItems: 11,
    offStageItems: 10,
    generalItems: 0,
    maxStagePerStudent: 5,
    maxOffStagePerStudent: 6,
    studentTargets: { team1: 6, team2: 6, total: 12 },
    isActive: true
  },
  {
    id: 'CAT-GEN',
    code: 'GEN',
    name: 'General',
    malayalamName: 'ജനറൽ',
    displayName: 'General Programmes',
    eligibility: 'All Active Team Members (Group & Team items; Max 2 entries per team)',
    description: '14 official Group/Team programmes (Page 8). 1st: 15 pts, 2nd: 10 pts, 3rd: 5 pts.',
    color: '#E6A916',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    totalItems: 14,
    stageItems: 0,
    offStageItems: 0,
    generalItems: 14,
    maxEntriesPerTeam: 2,
    studentTargets: { team1: 23, team2: 23, total: 46 },
    isActive: true
  }
];

export const OFFICIAL_CHARTER_STUDENT_TARGETS = {
  SubJunior: 19,
  Junior: 15,
  Senior: 12,
  total: 46,
  byTeam: {
    'team-1': { SubJunior: 10, Junior: 7, Senior: 6, total: 23 },
    'team-2': { SubJunior: 9, Junior: 8, Senior: 6, total: 23 }
  }
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
    asstLeader: 'Hassan',
    asstLeaderStudentId: 'STU-1002',
    points: 0,
    members: 23,
    countsByCategory: { Senior: 6, Junior: 7, SubJunior: 10 },
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
    members: 23,
    countsByCategory: { Senior: 6, Junior: 8, SubJunior: 9 },
    status: 'Active',
    students: []
  }
];

export const OFFICIAL_SCORING_CONFIG = {
  charterVersion: '2K26-v2-12p',
  positionPoints: {
    individual: {
      first: 5,
      second: 3,
      third: 1,
      label: 'Individual Event (5 - 3 - 1 Points)'
    },
    group: {
      first: 15,
      second: 10,
      third: 5,
      label: 'Group / General Event (15 - 10 - 5 Points)'
    }
  },
  // Grade thresholds & numeric grade points are NOT published in the updated 12-page Charter PDF (p.4 table values are blank).
  // Kept inactive until explicitly confirmed & saved by Main Admin.
  isGradePointsActive: false,
  grades: [
    {
      grade: 'A+',
      minMarks: null,
      individualPoints: null,
      groupPoints: null,
      label: 'A+ (Threshold & Grade Points Pending Admin Confirmation)',
      isActive: true
    },
    {
      grade: 'A',
      minMarks: null,
      individualPoints: null,
      groupPoints: null,
      label: 'A (Threshold & Grade Points Pending Admin Confirmation)',
      isActive: true
    },
    {
      grade: 'B',
      minMarks: null,
      individualPoints: null,
      groupPoints: null,
      label: 'B (Threshold & Grade Points Pending Admin Confirmation)',
      isActive: true
    },
    {
      grade: 'C',
      minMarks: null,
      individualPoints: null,
      groupPoints: null,
      label: 'C (Threshold & Grade Points Pending Admin Confirmation)',
      isActive: true
    }
  ],
  gradeRules: {
    officialGrades: ['A+', 'A', 'B', 'C'],
    groupGradeNote: 'മൂന്നിലധികം അംഗങ്ങൾ (Charter p.4 Group grade column specifies >3 / 3+ members)',
    allowTwoMemberGroupGradePoints: false
  },
  tieHandlingMode: 'FLAG_FOR_ADMIN',
  pendingAdminConfirmations: [
    {
      id: 'CONF-GRADE-THRESHOLDS',
      title: 'Official Mark Ranges (%) for Grades A+, A, B, C',
      detail: 'Charter Page 4 lists Grades A+, A, B, C without numeric mark cutoffs. Grade assignment remains inactive until Admin sets cutoffs.'
    },
    {
      id: 'CONF-GRADE-POINTS',
      title: 'Numeric Grade Points for Individual & Group Events',
      detail: 'Charter Page 4 table leaves Individual and Group grade point cells blank. Grade points remain 0 until Admin sets numeric values.'
    },
    {
      id: 'CONF-TWO-MEMBER-GROUP-GRADE',
      title: 'Group Grade Eligibility for 2-Member General Event (Talk Master Arabic)',
      detail: 'Charter Page 4 notes "മൂന്നിലധികം അംഗങ്ങൾ" (>3 members) on Group Grades while GEN-14 Talk Master Arabic has 2 members.'
    },
    {
      id: 'CONF-TIE-POLICY',
      title: 'Tie-Breaking & Shared Position Points Rule',
      detail: 'Ties are detected automatically and flagged for Admin confirmation (Full Points vs Split Points) before final publishing.'
    },
    {
      id: 'CONF-GENERAL-DUAL-ENTRY-SCORING',
      title: 'Scoring When One Team Wins Multiple Podium Slots in Group/General (Max 2 Entries/Team)',
      detail: 'General items permit max 2 entries per team. Confirm whether a team placing 1st & 2nd receives both 15 + 10 = 25 pts.'
    }
  ],
  entryLimits: {
    byCategory: {
      'Sub Junior': { maxStageItemsPerStudent: 4, maxOffStageItemsPerStudent: 5, label: 'Max 4 Stage + 5 Off Stage' },
      Junior: { maxStageItemsPerStudent: 5, maxOffStageItemsPerStudent: 6, label: 'Max 5 Stage + 6 Off Stage' },
      Senior: { maxStageItemsPerStudent: 5, maxOffStageItemsPerStudent: 6, label: 'Max 5 Stage + 6 Off Stage' }
    },
    maxStageItemsPerStudent: 4,
    maxOffStageItemsPerStudent: 5,
    maxEntriesPerTeamIndividual: 3,
    maxEntriesPerTeamGroup: 2
  },
  audit: {
    lastUpdatedBy: 'Charter 2K26-v2 (12-Page Updated Rulebook)',
    lastUpdatedAt: '2026-11-26',
    confirmedByAdmin: false
  }
};

export const OFFICIAL_JUDGING_GUIDELINES = [
  {
    id: 'RULE-ELOCUTION',
    programmePattern: 'Elocution',
    categories: ['Sub Junior', 'Junior', 'Senior'],
    timeLimit: '5 minutes',
    summary: 'Time limit 5 minutes. Sub Junior & Junior participants select from pre-announced topics. Senior draws topic 5 minutes before speech.',
    malayalamRule: 'സമയപരിധി 5 മിനിറ്റ്. സബ് ജൂനിയർ, ജൂനിയർ വിഭാഗങ്ങൾ മുൻകൂട്ടി നൽകിയ വിഷയങ്ങളിൽ നിന്ന് തിരഞ്ഞെടുക്കാം. സീനിയർ വിഭാഗത്തിന് 5 മിനിറ്റ് മുമ്പ് നറുക്കെടുപ്പിലൂടെ വിഷയം നൽകും.',
    criteria: ['Content & Clarity (35)', 'Language & Diction (25)', 'Delivery & Confidence (25)', 'Time & Overall Impact (15)']
  },
  {
    id: 'RULE-EXTEMPORE',
    programmePattern: 'Extempore',
    categories: ['Senior'],
    timeLimit: '5 minutes',
    summary: 'Senior Stage Malayalam Extempore: 5 minutes speaking duration; topic provided 5 minutes prior to performance.',
    malayalamRule: 'വിഷയം 5 മിനിറ്റ് മുമ്പ് നൽകുന്നു. പ്രസംഗ സമയപരിധി 5 മിനിറ്റ്.',
    criteria: ['Spontaneity & Structure (35)', 'Content Relevance (30)', 'Fluency & Vocabulary (20)', 'Stage Presence (15)']
  },
  {
    id: 'RULE-IBARATH',
    programmePattern: 'Ibarath Reading',
    categories: ['Junior'],
    timeLimit: 'Per stage call',
    summary: 'Judged on grammatical accuracy (Irab), reading speed, clarity of pronunciation, and natural fluency.',
    malayalamRule: 'കൃത്യത (Accuracy), വേഗത (Speed), വ്യക്തത (Clarity), ഒഴുക്ക് (Fluency) എന്നിവ അടിസ്ഥാനമാക്കിയാണ് മൂല്യനിർണ്ണയം.',
    criteria: ['Accuracy / കൃത്യത (35)', 'Clarity / വ്യക്തത (25)', 'Fluency / ഒഴുക്ക് (25)', 'Speed / വേഗത (15)']
  },
  {
    id: 'RULE-QUIZ',
    programmePattern: 'Quiz',
    categories: ['Sub Junior', 'Junior', 'Senior'],
    timeLimit: 'Session rounds',
    summary: 'Covers Current Affairs, General Knowledge, Mental Ability, Science, and Islamic Studies.',
    malayalamRule: 'ആനുകാലികം (Current Affairs), പൊതുവിജ്ഞാനം (GK), മാനസിക ശേഷി (Mental Ability), ശാസ്ത്രം (Science), ഇസ്‌ലാം.',
    criteria: ['Correct Answers (100)']
  },
  {
    id: 'RULE-CAPTION',
    programmePattern: 'Caption Writing',
    categories: ['Junior'],
    timeLimit: 'Session duration',
    summary: 'Strict word limit of maximum 5 words. Creative relevance to provided visual prompt.',
    malayalamRule: 'പരമാവധി 5 വാക്കുകളിൽ കവിയരുത്.',
    criteria: ['Creativity & Wit (40)', 'Prompt Relevance (35)', 'Brevity <= 5 Words (25)']
  },
  {
    id: 'RULE-TALK-MASTER',
    programmePattern: 'Talk Master Arabic',
    categories: ['General'],
    timeLimit: 'Per stage call',
    summary: '2 members per team entry; maximum 2 teams/entries per house.',
    malayalamRule: 'ഒരു ടീമിൽ 2 അംഗങ്ങൾ. ഒരു ഗ്രൂപ്പിന് പരമാവധി 2 ടീമുകളെ പങ്കെടുപ്പിക്കാം.',
    criteria: ['Arabic Fluency & Accent (35)', 'Dialogue Engagement (30)', 'Vocabulary & Grammar (20)', 'Confidence (15)']
  },
  {
    id: 'RULE-GROUP-SONG',
    programmePattern: 'Group Song',
    categories: ['General'],
    timeLimit: 'Per stage call',
    summary: '4 members including Daff accompaniment; Madh song theme; maximum 2 entries per house.',
    malayalamRule: 'ദഫ് ഉൾപ്പെടെ 4 അംഗങ്ങൾ. മദ്ഹ് ഗാനം ആയിരിക്കണം. ഒരു ടീമിന് പരമാവധി 2 എൻട്രികൾ.',
    criteria: ['Vocal Harmony & Melody (35)', 'Rhythm & Daff Coordination (25)', 'Madh Lyric Theme & Tala (25)', 'Stage Synchrony (15)']
  },
  {
    id: 'RULE-MAPPILAPATTU-RACHANA',
    programmePattern: 'Mappilapattu Rachana',
    categories: ['General'],
    timeLimit: 'Session duration',
    summary: '3 members per team entry; evaluated on classical meter (Vritham), rhyme (Prasam), and traditional Ishal fidelity.',
    malayalamRule: '3 അംഗങ്ങൾ. വൃത്തം, പ്രാസം, ഇശൽ എന്നിവയുടെ കൃത്യത പരിശോധിക്കുന്നു.',
    criteria: ['Ishal & Prosody / ഇശൽ & വൃത്തം (40)', 'Poetic Rhyme / പ്രാസം & ഭാവന (35)', 'Theme & Literary Quality (25)']
  },
  {
    id: 'RULE-COLLAGE',
    programmePattern: 'Collage',
    categories: ['General'],
    timeLimit: 'Live session',
    summary: '4 members per entry; A3 live design on topic given 1 week prior. Drawing, painting, writing, photos & newspaper cuttings allowed; A3 sheet provided by committee. Max 2 entries per team.',
    malayalamRule: '4 അംഗങ്ങൾ. ഒരാഴ്ച മുമ്പ് നൽകുന്ന വിഷയത്തിൽ A3 പേപ്പറിൽ തത്സമയ നിർമ്മാണം (പേപ്പർ കമ്മിറ്റി നൽകും). ചിത്രരചന, പെയിന്റിംഗ്, എഴുത്ത്, ഫോട്ടോ, പത്രക്കട്ടിംഗ് അനുവദനീയമാണ്.',
    criteria: ['Visual Composition & Creativity (35)', 'Topic Relevance (30)', 'Craftsmanship & Technique (20)', 'Overall Impact (15)']
  },
  {
    id: 'RULE-QAWWALI',
    programmePattern: 'Qawwali',
    categories: ['General'],
    timeLimit: 'Per stage call',
    summary: '5 members including Daff; any language permitted; strict scrutiny of doctrinal / ideological appropriateness.',
    malayalamRule: 'ദഫ് ഉൾപ്പെടെ 5 അംഗങ്ങൾ. ഏത് ഭാഷയിലും ആകാം; ആശയപരമായ ശുദ്ധി പ്രത്യേകം ശ്രദ്ധിക്കണം.',
    criteria: ['Ideological Appropriateness & Lyrics (35)', 'Vocal Power & Qawwali Style (30)', 'Harmony & Daff (20)', 'Presentation (15)']
  }
];

function getDefaultCriteria(name, classification) {
  const n = String(name || '').toLowerCase();
  if (n.includes('quiz') || n.includes('book test') || n.includes('swarf') || n.includes('imla') || n.includes('maths') || n.includes('memory') || n.includes('spelling')) {
    return [
      { id: 'c1', name: 'Accuracy & Correct Answers', maxMarks: 70 },
      { id: 'c2', name: 'Speed & Tie-Break Mastery', maxMarks: 30 }
    ];
  }
  if (n.includes('ibarath')) {
    return [
      { id: 'c1', name: 'Accuracy / കൃത്യത (Irab & Grammar)', maxMarks: 35 },
      { id: 'c2', name: 'Clarity / വ്യക്തത', maxMarks: 25 },
      { id: 'c3', name: 'Fluency / ഒഴുക്ക്', maxMarks: 25 },
      { id: 'c4', name: 'Speed / വേഗത', maxMarks: 15 }
    ];
  }
  if (n.includes('elocution') || n.includes('extempore') || n.includes('khutba') || n.includes('ideal speech') || n.includes('thadrees')) {
    return [
      { id: 'c1', name: 'Content & Depth / പ്രമേയം', maxMarks: 35 },
      { id: 'c2', name: 'Language & Diction / ഭാഷാശുദ്ധി', maxMarks: 25 },
      { id: 'c3', name: 'Delivery & Stage Presence / അവതരണം', maxMarks: 25 },
      { id: 'c4', name: 'Overall Impact & Time Discipline', maxMarks: 15 }
    ];
  }
  if (classification === 'General') {
    return [
      { id: 'c1', name: 'Content, Theme & Authenticity', maxMarks: 35 },
      { id: 'c2', name: 'Team Synchrony & Execution', maxMarks: 35 },
      { id: 'c3', name: 'Creativity & Overall Presentation', maxMarks: 30 }
    ];
  }
  return [
    { id: 'c1', name: 'Content & Expression / തനിമ & പ്രമേയം', maxMarks: 40 },
    { id: 'c2', name: 'Style & Pronunciation / ശൈലി & ഉച്ചാരണം', maxMarks: 30 },
    { id: 'c3', name: 'Accuracy & Technique / കൃത്യത', maxMarks: 20 },
    { id: 'c4', name: 'Overall Impression / സവിശേഷ പ്രകടനം', maxMarks: 10 }
  ];
}

function getMatchingGuideline(name) {
  const n = String(name || '').toLowerCase();
  const hit = OFFICIAL_JUDGING_GUIDELINES.find(g => n.includes(g.programmePattern.toLowerCase()));
  return hit ? hit.summary : 'Evaluate strictly per official DALENZIA 2K26 Festival Charter criteria (Max 100 marks).';
}

const rawCharterDefinitions = [
  // SUB JUNIOR — STAGE (10 Items) — Charter Page 5
  { id: 'PRG-SUB-STG-01', code: 'SUB-STG-01', itemNo: '01', name: 'Tarteel', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 1 },
  { id: 'PRG-SUB-STG-02', code: 'SUB-STG-02', itemNo: '02', name: 'Elocution Malayalam', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 2 },
  { id: 'PRG-SUB-STG-03', code: 'SUB-STG-03', itemNo: '03', name: 'Madh Song', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 3 },
  { id: 'PRG-SUB-STG-04', code: 'SUB-STG-04', itemNo: '04', name: 'Quiz', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 4 },
  { id: 'PRG-SUB-STG-05', code: 'SUB-STG-05', itemNo: '05', name: 'Swarf Test', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 5 },
  { id: 'PRG-SUB-STG-06', code: 'SUB-STG-06', itemNo: '06', name: 'News Reading', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 6 },
  { id: 'PRG-SUB-STG-07', code: 'SUB-STG-07', itemNo: '07', name: 'Word Game Arabic', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 7 },
  { id: 'PRG-SUB-STG-08', code: 'SUB-STG-08', itemNo: '08', name: 'Story Telling Malayalam', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 8 },
  { id: 'PRG-SUB-STG-09', code: 'SUB-STG-09', itemNo: '09', name: 'Mappila Pattu', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 9 },
  { id: 'PRG-SUB-STG-10', code: 'SUB-STG-10', itemNo: '10', name: 'Adhan', classification: 'Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 10 },

  // SUB JUNIOR — OFF STAGE (9 Items) — Charter Page 5
  { id: 'PRG-SUB-OFF-01', code: 'SUB-OFF-01', itemNo: '01', name: 'Essay Malayalam', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 11 },
  { id: 'PRG-SUB-OFF-02', code: 'SUB-OFF-02', itemNo: '02', name: 'Story Malayalam', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 12 },
  { id: 'PRG-SUB-OFF-03', code: 'SUB-OFF-03', itemNo: '03', name: 'Book Test', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 13 },
  { id: 'PRG-SUB-OFF-04', code: 'SUB-OFF-04', itemNo: '04', name: 'Water Colouring', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 14 },
  { id: 'PRG-SUB-OFF-05', code: 'SUB-OFF-05', itemNo: '05', name: 'Pencil Drawing', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 15 },
  { id: 'PRG-SUB-OFF-06', code: 'SUB-OFF-06', itemNo: '06', name: 'Handwriting English', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 16 },
  { id: 'PRG-SUB-OFF-07', code: 'SUB-OFF-07', itemNo: '07', name: 'Handwriting Arabic', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 17 },
  { id: 'PRG-SUB-OFF-08', code: 'SUB-OFF-08', itemNo: '08', name: 'Memory Test', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 18 },
  { id: 'PRG-SUB-OFF-09', code: 'SUB-OFF-09', itemNo: '09', name: 'Spelling Bee', classification: 'Off Stage', category: 'Sub Junior', type: 'Individual', requiredMembers: null, order: 19 },

  // JUNIOR — STAGE (11 Items) — Charter Page 6
  { id: 'PRG-JUN-STG-01', code: 'JUN-STG-01', itemNo: '01', name: 'Tarteel', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 20 },
  { id: 'PRG-JUN-STG-02', code: 'JUN-STG-02', itemNo: '02', name: 'Elocution Malayalam', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 21 },
  { id: 'PRG-JUN-STG-03', code: 'JUN-STG-03', itemNo: '03', name: 'Elocution English', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 22 },
  { id: 'PRG-JUN-STG-04', code: 'JUN-STG-04', itemNo: '04', name: 'Elocution Arabic', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 23 },
  { id: 'PRG-JUN-STG-05', code: 'JUN-STG-05', itemNo: '05', name: 'Madh Song', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 24 },
  { id: 'PRG-JUN-STG-06', code: 'JUN-STG-06', itemNo: '06', name: 'Quiz', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 25 },
  { id: 'PRG-JUN-STG-07', code: 'JUN-STG-07', itemNo: '07', name: 'Swarf Test', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 26 },
  { id: 'PRG-JUN-STG-08', code: 'JUN-STG-08', itemNo: '08', name: 'Mappila Pattu', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 27 },
  { id: 'PRG-JUN-STG-09', code: 'JUN-STG-09', itemNo: '09', name: 'Ibarath Reading', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 28 },
  { id: 'PRG-JUN-STG-10', code: 'JUN-STG-10', itemNo: '10', name: 'Poem Recitation (Arabic)', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 29 },
  { id: 'PRG-JUN-STG-11', code: 'JUN-STG-11', itemNo: '11', name: 'Imla', classification: 'Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 30 },

  // JUNIOR — OFF STAGE (12 Items) — Charter Page 6
  { id: 'PRG-JUN-OFF-01', code: 'JUN-OFF-01', itemNo: '01', name: 'Essay Malayalam', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 31 },
  { id: 'PRG-JUN-OFF-02', code: 'JUN-OFF-02', itemNo: '02', name: 'Poem Malayalam', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 32 },
  { id: 'PRG-JUN-OFF-03', code: 'JUN-OFF-03', itemNo: '03', name: 'Water Colouring', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 33 },
  { id: 'PRG-JUN-OFF-04', code: 'JUN-OFF-04', itemNo: '04', name: 'Pencil Drawing', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 34 },
  { id: 'PRG-JUN-OFF-05', code: 'JUN-OFF-05', itemNo: '05', name: 'Handwriting Arabic', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 35 },
  { id: 'PRG-JUN-OFF-06', code: 'JUN-OFF-06', itemNo: '06', name: 'Book Test', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 36 },
  { id: 'PRG-JUN-OFF-07', code: 'JUN-OFF-07', itemNo: '07', name: 'Caption Writing', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 37 },
  { id: 'PRG-JUN-OFF-08', code: 'JUN-OFF-08', itemNo: '08', name: 'Maths Relay', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 38 },
  { id: 'PRG-JUN-OFF-09', code: 'JUN-OFF-09', itemNo: '09', name: 'Essay Arabic', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 39 },
  { id: 'PRG-JUN-OFF-10', code: 'JUN-OFF-10', itemNo: '10', name: 'Essay English', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 40 },
  { id: 'PRG-JUN-OFF-11', code: 'JUN-OFF-11', itemNo: '11', name: 'Spelling Bee', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 41 },
  { id: 'PRG-JUN-OFF-12', code: 'JUN-OFF-12', itemNo: '12', name: 'Word Game Arabic', classification: 'Off Stage', category: 'Junior', type: 'Individual', requiredMembers: null, order: 42 },

  // SENIOR — STAGE (11 Items) — Charter Page 7
  { id: 'PRG-SEN-STG-01', code: 'SEN-STG-01', itemNo: '01', name: 'Tarteel', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 43 },
  { id: 'PRG-SEN-STG-02', code: 'SEN-STG-02', itemNo: '02', name: 'Elocution Malayalam', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 44 },
  { id: 'PRG-SEN-STG-03', code: 'SEN-STG-03', itemNo: '03', name: 'Elocution English', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 45 },
  { id: 'PRG-SEN-STG-04', code: 'SEN-STG-04', itemNo: '04', name: 'Elocution Arabic', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 46 },
  { id: 'PRG-SEN-STG-05', code: 'SEN-STG-05', itemNo: '05', name: "Musha'ara Alfiya", classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 47 },
  { id: 'PRG-SEN-STG-06', code: 'SEN-STG-06', itemNo: '06', name: 'Madh Song', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 48 },
  { id: 'PRG-SEN-STG-07', code: 'SEN-STG-07', itemNo: '07', name: 'Dua Recitation', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 49 },
  { id: 'PRG-SEN-STG-08', code: 'SEN-STG-08', itemNo: '08', name: 'Quiz', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 50 },
  { id: 'PRG-SEN-STG-09', code: 'SEN-STG-09', itemNo: '09', name: 'Thadrees', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 51 },
  { id: 'PRG-SEN-STG-10', code: 'SEN-STG-10', itemNo: '10', name: 'Extempore Malayalam', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, timeLimitMinutes: 5, order: 52 },
  { id: 'PRG-SEN-STG-11', code: 'SEN-STG-11', itemNo: '11', name: 'Devotional Song (ഭക്തിഗാനം)', classification: 'Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 53 },

  // SENIOR — OFF STAGE (10 Items) — Charter Page 7
  { id: 'PRG-SEN-OFF-01', code: 'SEN-OFF-01', itemNo: '01', name: 'Essay Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 54 },
  { id: 'PRG-SEN-OFF-02', code: 'SEN-OFF-02', itemNo: '02', name: 'Essay Arabic', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 55 },
  { id: 'PRG-SEN-OFF-03', code: 'SEN-OFF-03', itemNo: '03', name: 'Poem Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 56 },
  { id: 'PRG-SEN-OFF-04', code: 'SEN-OFF-04', itemNo: '04', name: 'Poem Arabic', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 57 },
  { id: 'PRG-SEN-OFF-05', code: 'SEN-OFF-05', itemNo: '05', name: 'Translation English – Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 58 },
  { id: 'PRG-SEN-OFF-06', code: 'SEN-OFF-06', itemNo: '06', name: 'Translation Arabic – Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 59 },
  { id: 'PRG-SEN-OFF-07', code: 'SEN-OFF-07', itemNo: '07', name: 'Slogan Writing Malayalam', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 60 },
  { id: 'PRG-SEN-OFF-08', code: 'SEN-OFF-08', itemNo: '08', name: 'Essay English', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 61 },
  { id: 'PRG-SEN-OFF-09', code: 'SEN-OFF-09', itemNo: '09', name: 'Calligraphy Arabic', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 62 },
  { id: 'PRG-SEN-OFF-10', code: 'SEN-OFF-10', itemNo: '10', name: 'Pencil Drawing', classification: 'Off Stage', category: 'Senior', type: 'Individual', requiredMembers: null, order: 63 },

  // GENERAL PROGRAMMES (14 Items, Group/Team) — Charter Page 8 & General Tick Chart
  { id: 'PRG-GEN-01', code: 'GEN-01', itemNo: '01', name: 'Spot Magazine', classification: 'General', category: 'General', type: 'Group', requiredMembers: 5, order: 64 },
  { id: 'PRG-GEN-02', code: 'GEN-02', itemNo: '02', name: 'Group Song', classification: 'General', category: 'General', type: 'Group', requiredMembers: 4, order: 65 },
  { id: 'PRG-GEN-03', code: 'GEN-03', itemNo: '03', name: 'Nasheeda', classification: 'General', category: 'General', type: 'Group', requiredMembers: 4, order: 66 },
  { id: 'PRG-GEN-04', code: 'GEN-04', itemNo: '04', name: 'Moulid Parayanam', classification: 'General', category: 'General', type: 'Group', requiredMembers: 4, order: 67 },
  { id: 'PRG-GEN-05', code: 'GEN-05', itemNo: '05', name: 'Qaseeda Parayanam', classification: 'General', category: 'General', type: 'Group', requiredMembers: 4, order: 68 },
  { id: 'PRG-GEN-06', code: 'GEN-06', itemNo: '06', name: 'Qawwali', classification: 'General', category: 'General', type: 'Group', requiredMembers: 5, order: 69 },
  { id: 'PRG-GEN-07', code: 'GEN-07', itemNo: '07', name: 'Mappilapattu Rachana', classification: 'General', category: 'General', type: 'Group', requiredMembers: 3, order: 70 },
  { id: 'PRG-GEN-08', code: 'GEN-08', itemNo: '08', name: "Musha'ara", classification: 'General', category: 'General', type: 'Group', requiredMembers: 4, order: 71 },
  { id: 'PRG-GEN-09', code: 'GEN-09', itemNo: '09', name: 'Malappattu', classification: 'General', category: 'General', type: 'Group', requiredMembers: 4, order: 72 },
  { id: 'PRG-GEN-10', code: 'GEN-10', itemNo: '10', name: 'Vayal', classification: 'General', category: 'General', type: 'Group', requiredMembers: 3, order: 73 },
  { id: 'PRG-GEN-11', code: 'GEN-11', itemNo: '11', name: 'Ideal Speech', classification: 'General', category: 'General', type: 'Group', requiredMembers: 3, order: 74 },
  { id: 'PRG-GEN-12', code: 'GEN-12', itemNo: '12', name: 'Collage', classification: 'General', category: 'General', type: 'Group', requiredMembers: 4, order: 75 },
  { id: 'PRG-GEN-13', code: 'GEN-13', itemNo: '13', name: 'Khutba', classification: 'General', category: 'General', type: 'Group', requiredMembers: 3, order: 76 },
  { id: 'PRG-GEN-14', code: 'GEN-14', itemNo: '14', name: 'Talk Master Arabic', classification: 'General', category: 'General', type: 'Group', requiredMembers: 2, order: 77 }
];

export const OFFICIAL_CHARTER_PROGRAMMES = rawCharterDefinitions.map(p => ({
  ...p,
  source: 'Official Festival Charter 2K26 (12-Page Updated)',
  status: 'Available',
  maxMarks: 100,
  maxEntriesPerTeam: p.type === 'Group' ? 2 : 3,
  chartPage: p.classification === 'General' ? 2 : 1,
  judgingGuideline: getMatchingGuideline(p.name),
  evaluationCriteria: getDefaultCriteria(p.name, p.classification)
}));

// Factory to convert the 77 Charter Programmes into live manageable Competition Assignments on demand
export function createDefaultProgrammeAssignments() {
  return OFFICIAL_CHARTER_PROGRAMMES.map((p, idx) => {
    const isGeneral = p.classification === 'General';
    const isOffStage = p.classification === 'Off Stage';
    const stageId = isGeneral ? 'STG-01' : (isOffStage ? 'STG-03' : (idx % 2 === 0 ? 'STG-01' : 'STG-02'));
    const stageName = isGeneral
      ? 'Cordova Grand Stage (Stage 01)'
      : (isOffStage ? 'Ibn Khaldun Academic Hall (Stage 03)' : (idx % 2 === 0 ? 'Cordova Grand Stage (Stage 01)' : 'Al-Farabi Heritage Hall (Stage 02)'));

    const criteria = p.evaluationCriteria || getDefaultCriteria(p.name, p.classification);

    return {
      id: p.id,
      competitionId: p.id,
      competitionCode: p.code,
      code: p.code,
      itemNo: p.itemNo,
      title: p.name,
      competitionTitle: p.name,
      name: p.name,
      category: p.category,
      categoryCode: p.category === 'Sub Junior' ? 'SUB' : p.category === 'Junior' ? 'JUN' : p.category === 'Senior' ? 'SEN' : 'GEN',
      classification: p.classification,
      format: p.classification,
      type: p.type,
      requiredMembers: p.requiredMembers,
      source: p.source,
      order: p.order,
      stageId,
      stage: stageName,
      venue: stageName,
      date: idx < 26 ? '2026-12-21' : idx < 52 ? '2026-12-22' : '2026-12-23',
      time: isGeneral ? '02:00 PM' : '10:00 AM',
      startTime: isGeneral ? '02:00 PM' : '10:00 AM',
      endTime: isGeneral ? '04:30 PM' : '12:00 PM',
      duration: '45 mins',
      status: 'Scheduled',
      isOfficialCharter: true,
      maxParticipants: p.type === 'Group' ? 10 : 24,
      maxEntriesPerTeam: p.type === 'Group' ? 2 : 3,
      groupSize: p.requiredMembers ? `${p.requiredMembers} Members` : (p.type === 'Individual' ? '1 Student' : 'Team'),
      assignedJudgeIds: ['JDG-1001', 'JDG-001'],
      participants: [],
      maxMarks: 100,
      totalMaxMarks: 100,
      criteria,
      evaluationCriteria: criteria,
      judgingGuideline: p.judgingGuideline,
      desc: `Official DALENZIA FEST 2K26 ${p.category} ${p.classification} event: ${p.name}.`,
      isPublished: false,
      publishedAt: null
    };
  });
}

// Structured Two-Page Programme Chart Model A Metadata
export const OFFICIAL_TWO_PAGE_PROGRAMME_CHART = {
  page1: {
    pageNumber: 1,
    title: 'DALENZIA FEST 2K26 — OFFICIAL PROGRAMME CHART (PAGE 1: CATEGORY PROGRAMMES)',
    subtitle: 'Updated 12-Page Festival Charter • Individual Stage & Off Stage Events (63 Items)',
    categories: ['Sub Junior', 'Junior', 'Senior'],
    rulesSummary: [
      'Individual Position Points: 1st = 5 pts | 2nd = 3 pts | 3rd = 1 pt',
      'Sub Junior (Class 5–9): Max 4 Stage + 5 Off Stage per student (19 items: 10 Stage, 9 Off Stage)',
      'Junior (Class 10, +1): Max 5 Stage + 6 Off Stage per student (23 items: 11 Stage, 12 Off Stage)',
      'Senior (+2, Degree): Max 5 Stage + 6 Off Stage per student (21 items: 11 Stage, 10 Off Stage)',
      'Team Quota: Maximum 3 entries per team per Individual item'
    ]
  },
  page2: {
    pageNumber: 2,
    title: 'DALENZIA FEST 2K26 — OFFICIAL PROGRAMME CHART (PAGE 2: GENERAL PROGRAMMES & RULES)',
    subtitle: 'Open / Team General Items (14 Items) + Official Judging Guidelines',
    categories: ['General'],
    rulesSummary: [
      'Group / General Position Points: 1st = 15 pts | 2nd = 10 pts | 3rd = 5 pts',
      'General Quota: Maximum 2 entries per team per General programme',
      'Grade Classification: A+, A, B, C (Mark thresholds & numeric grade points pending Admin confirmation)',
      'Student Allocation: Team 1 Dazzlers (23 scholars) vs Team 2 Dynamos (23 scholars) = 46 scholars total'
    ]
  }
};

export const OFFICIAL_CONFIRMED_FESTIVAL_EVENTS = [
  // Day 01 – Dec 21, 2026
  {
    id: 'EVT-D1-01',
    programmeId: 'EVT-D1-01',
    code: 'EVT-01',
    programmeCode: 'EVT-01',
    title: 'Inauguration',
    programmeTitle: 'Inauguration',
    malayalamTitle: 'ഉദ്ഘാടന സമ്മേളനം',
    category: 'General',
    categoryCode: 'GEN',
    classification: 'General',
    day: 'Day 01',
    date: 'Dec 21, 2026',
    formattedDate: 'Monday, December 21, 2026',
    time: '7:00 PM',
    startTime: '07:00 PM',
    endTime: '09:30 PM',
    timeRange: '07:00 PM – 09:30 PM',
    stage: 'Main Stage',
    stageId: 'STG-01',
    venue: 'Main Stage',
    status: 'Confirmed',
    isOfficialFestivalEvent: true,
    isPublished: true,
    publishedAt: '2026-11-20T10:00:00.000Z',
    isArchived: false,
    desc: 'Official Grand Inauguration Ceremony of Dalenzia Fest 2K26.'
  },
  // Day 02 – Dec 22, 2026
  {
    id: 'EVT-D2-01',
    programmeId: 'EVT-D2-01',
    code: 'EVT-02',
    programmeCode: 'EVT-02',
    title: 'Cultural Programmes',
    programmeTitle: 'Cultural Programmes',
    malayalamTitle: 'സാംസ്കാരിക പരിപാടികൾ',
    category: 'General',
    categoryCode: 'GEN',
    classification: 'General',
    day: 'Day 02',
    date: 'Dec 22, 2026',
    formattedDate: 'Tuesday, December 22, 2026',
    time: '9:00 AM',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    timeRange: '09:00 AM – 01:00 PM',
    stage: 'Main Stage',
    stageId: 'STG-01',
    venue: 'Main Stage',
    status: 'Confirmed',
    isOfficialFestivalEvent: true,
    isPublished: true,
    publishedAt: '2026-11-20T10:00:00.000Z',
    isArchived: false,
    desc: 'Day 02 Morning Cultural Programmes & Showcases.'
  },
  {
    id: 'EVT-D2-02',
    programmeId: 'EVT-D2-02',
    code: 'EVT-03',
    programmeCode: 'EVT-03',
    title: 'Alumni Gathering',
    programmeTitle: 'Alumni Gathering',
    malayalamTitle: 'പൂർവ്വ വിദ്യാർത്ഥി സംഗമം',
    category: 'General',
    categoryCode: 'GEN',
    classification: 'General',
    day: 'Day 02',
    date: 'Dec 22, 2026',
    formattedDate: 'Tuesday, December 22, 2026',
    time: '4:00 PM',
    startTime: '04:00 PM',
    endTime: '06:30 PM',
    timeRange: '04:00 PM – 06:30 PM',
    stage: 'Main Stage',
    stageId: 'STG-01',
    venue: 'Main Stage',
    status: 'Confirmed',
    isOfficialFestivalEvent: true,
    isPublished: true,
    publishedAt: '2026-11-20T10:00:00.000Z',
    isArchived: false,
    desc: 'Grand Dalenzia Alumni Gathering & Reunion.'
  },
  {
    id: 'EVT-D2-03',
    programmeId: 'EVT-D2-03',
    code: 'EVT-04',
    programmeCode: 'EVT-04',
    title: 'Burda Majlis',
    programmeTitle: 'Burda Majlis',
    malayalamTitle: 'ബുർദ മജ്‌ലിസ്',
    category: 'General',
    categoryCode: 'GEN',
    classification: 'General',
    day: 'Day 02',
    date: 'Dec 22, 2026',
    formattedDate: 'Tuesday, December 22, 2026',
    time: '7:00 PM',
    startTime: '07:00 PM',
    endTime: '10:00 PM',
    timeRange: '07:00 PM – 10:00 PM',
    stage: 'Main Stage',
    stageId: 'STG-01',
    venue: 'Main Stage',
    status: 'Confirmed',
    isOfficialFestivalEvent: true,
    isPublished: true,
    publishedAt: '2026-11-20T10:00:00.000Z',
    isArchived: false,
    desc: 'Spiritual Burda Majlis & Devotional Gathering.'
  },
  // Day 03 – Dec 23, 2026
  {
    id: 'EVT-D3-01',
    programmeId: 'EVT-D3-01',
    code: 'EVT-05',
    programmeCode: 'EVT-05',
    title: 'Cultural Programmes',
    programmeTitle: 'Cultural Programmes',
    malayalamTitle: 'സാംസ്കാരിക പരിപാടികൾ',
    category: 'General',
    categoryCode: 'GEN',
    classification: 'General',
    day: 'Day 03',
    date: 'Dec 23, 2026',
    formattedDate: 'Wednesday, December 23, 2026',
    time: '9:00 AM',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    timeRange: '09:00 AM – 01:00 PM',
    stage: 'Main Stage',
    stageId: 'STG-01',
    venue: 'Main Stage',
    status: 'Confirmed',
    isOfficialFestivalEvent: true,
    isPublished: true,
    publishedAt: '2026-11-20T10:00:00.000Z',
    isArchived: false,
    desc: 'Day 03 Cultural Showcase & Sessions.'
  },
  {
    id: 'EVT-D3-02',
    programmeId: 'EVT-D3-02',
    code: 'EVT-06',
    programmeCode: 'EVT-06',
    title: "Parents' Meeting",
    programmeTitle: "Parents' Meeting",
    malayalamTitle: 'രക്ഷാകർതൃ സംഗമം',
    category: 'General',
    categoryCode: 'GEN',
    classification: 'General',
    day: 'Day 03',
    date: 'Dec 23, 2026',
    formattedDate: 'Wednesday, December 23, 2026',
    time: '4:00 PM',
    startTime: '04:00 PM',
    endTime: '06:30 PM',
    timeRange: '04:00 PM – 06:30 PM',
    stage: 'Main Stage',
    stageId: 'STG-01',
    venue: 'Main Stage',
    status: 'Confirmed',
    isOfficialFestivalEvent: true,
    isPublished: true,
    publishedAt: '2026-11-20T10:00:00.000Z',
    isArchived: false,
    desc: 'Official Parents & Guardians Conclave.'
  },
  {
    id: 'EVT-D3-03',
    programmeId: 'EVT-D3-03',
    code: 'EVT-07',
    programmeCode: 'EVT-07',
    title: 'Closing Ceremony',
    programmeTitle: 'Closing Ceremony',
    malayalamTitle: 'സമാപന സമ്മേളനം',
    category: 'General',
    categoryCode: 'GEN',
    classification: 'General',
    day: 'Day 03',
    date: 'Dec 23, 2026',
    formattedDate: 'Wednesday, December 23, 2026',
    time: '8:00 PM',
    startTime: '08:00 PM',
    endTime: '10:30 PM',
    timeRange: '08:00 PM – 10:30 PM',
    stage: 'Main Stage',
    stageId: 'STG-01',
    venue: 'Main Stage',
    status: 'Confirmed',
    isOfficialFestivalEvent: true,
    isPublished: true,
    publishedAt: '2026-11-20T10:00:00.000Z',
    isArchived: false,
    desc: 'Grand Closing Ceremony, Valedictory Session & Trophy Awards.'
  }
];

