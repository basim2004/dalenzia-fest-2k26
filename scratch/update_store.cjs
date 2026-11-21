const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/admin/data/festivalStore.js');
let file = fs.readFileSync(filePath, 'utf8');

const initialTeamsCode = `export const INITIAL_TEAMS = [
  {
    id: 'team-1',
    name: 'Team 1',
    code: 'T1',
    color: '#E6A916',
    leader: 'Noufal',
    asstLeader: 'Hafiz Hassan',
    points: 0,
    members: 22,
    students: []
  },
  {
    id: 'team-2',
    name: 'Team 2',
    code: 'T2',
    color: '#A91F35',
    leader: 'Hashim',
    asstLeader: 'Irfan Edayur',
    points: 0,
    members: 24,
    students: []
  }
];

export const INITIAL_REGISTERED_STUDENTS = [
  // Senior Category (8 Students)
  { id: 'STU-1001', chestNo: 'C-101', name: 'Noufal', classCategory: 'Senior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'noufal@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1002', chestNo: 'C-102', name: 'Hafiz Hassan', classCategory: 'Senior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'hafiz.hassan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1003', chestNo: 'C-103', name: 'Binyamin', classCategory: 'Senior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'binyamin@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1004', chestNo: 'C-104', name: 'Hafiz Sinan', classCategory: 'Senior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'hafiz.sinan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1005', chestNo: 'C-105', name: 'Hashim', classCategory: 'Senior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'hashim@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1006', chestNo: 'C-106', name: 'Aslam Sha', classCategory: 'Senior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'aslam.sha@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1007', chestNo: 'C-107', name: 'Hafiz Hussan', classCategory: 'Senior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'hafiz.hussan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1008', chestNo: 'C-108', name: 'Irfan Edayur', classCategory: 'Senior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'irfan.edayur@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },

  // Junior Category (7 Students)
  { id: 'STU-1009', chestNo: 'C-109', name: 'Midlaj P', classCategory: 'Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'midlaj.p@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1010', chestNo: 'C-110', name: 'Sahal', classCategory: 'Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'sahal@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1011', chestNo: 'C-111', name: 'Shammas', classCategory: 'Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'shammas@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1012', chestNo: 'C-112', name: 'Razeen', classCategory: 'Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'razeen@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1013', chestNo: 'C-113', name: 'Sulthan', classCategory: 'Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'sulthan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1014', chestNo: 'C-114', name: 'Rizwan', classCategory: 'Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rizwan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1015', chestNo: 'C-115', name: 'Husain Shinaf', classCategory: 'Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'husain.shinaf@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },

  // Sub Junior Category (12 Students)
  { id: 'STU-1016', chestNo: 'C-116', name: 'Rayyan Razi', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rayyan.razi@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1017', chestNo: 'C-117', name: 'Anshid T', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'anshid.t@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1018', chestNo: 'C-118', name: 'Aflah P', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'aflah.p@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1019', chestNo: 'C-119', name: 'Aflah AK', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'aflah.ak@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1020', chestNo: 'C-120', name: 'Athif', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'athif@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1021', chestNo: 'C-121', name: 'Midlaj M', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'midlaj.m@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1022', chestNo: 'C-122', name: 'Fakih', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'fakih@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1023', chestNo: 'C-123', name: 'Uvais', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'uvais@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1024', chestNo: 'C-124', name: 'Nihal', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'nihal@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1025', chestNo: 'C-125', name: 'Ahnaf', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'ahnaf@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1026', chestNo: 'C-126', name: 'Anshid', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'anshid@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1027', chestNo: 'C-127', name: 'Zayan', classCategory: 'Sub Junior', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'zayan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },

  // Minor Category (19 Students)
  { id: 'STU-1028', chestNo: 'C-128', name: 'Rifaee', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rifaee@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1029', chestNo: 'C-129', name: 'Rizwan', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'rizwan.2@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1030', chestNo: 'C-130', name: 'Abdul Nasar', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'abdul.nasar@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1031', chestNo: 'C-131', name: 'Shaheen', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'shaheen@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1032', chestNo: 'C-132', name: 'Seyyid Dilbar', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'seyyid.dilbar@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1033', chestNo: 'C-133', name: 'Nusaih', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'nusaih@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1034', chestNo: 'C-134', name: 'Ali Akbar', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'ali.akbar@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1035', chestNo: 'C-135', name: 'Toufeeq', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'toufeeq@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1036', chestNo: 'C-136', name: 'Touheed', classCategory: 'Minor', teamId: 'team-1', teamName: 'Team 1', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'touheed@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1037', chestNo: 'C-137', name: 'Subhan', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'subhan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1038', chestNo: 'C-138', name: 'Farhan', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'farhan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1039', chestNo: 'C-139', name: 'Thahir', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'thahir@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1040', chestNo: 'C-140', name: 'Faizan', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'faizan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1041', chestNo: 'C-141', name: 'Shidan', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'shidan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1042', chestNo: 'C-142', name: 'Yaseen', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'yaseen@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1043', chestNo: 'C-143', name: 'Sinan', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'sinan@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1044', chestNo: 'C-144', name: 'Fasil', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'fasil@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1045', chestNo: 'C-145', name: 'Abdul Haq', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'abdul.haq@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' },
  { id: 'STU-1046', chestNo: 'C-146', name: 'Ziyad', classCategory: 'Minor', teamId: 'team-2', teamName: 'Team 2', institution: 'Dalailussunna Dars, Ayiroor', phone: '', email: 'ziyad@dalanzia.org', status: 'Active', gender: 'Male', registeredAt: '2026-11-10' }
];`;

// Replace in file
if (!file.includes('INITIAL_REGISTERED_STUDENTS')) {
  file = file.replace(
    'export const INITIAL_TEAM_LEADERS = [];',
    'export const INITIAL_TEAM_LEADERS = [];\n\n' + initialTeamsCode
  );
  file = file.replace(
    /teams:\s*\[\],[\r\n\s]*registeredStudents:\s*\[\],/,
    'teams: INITIAL_TEAMS,\n  registeredStudents: INITIAL_REGISTERED_STUDENTS,'
  );
}

// In loadData(), ensure teams and registeredStudents fall back to INITIAL_TEAMS and INITIAL_REGISTERED_STUDENTS
const loadDataTarget = `    // Ensure all operational arrays are defined
    const arrayKeys = [
      'teams', 'registeredStudents', 'programmes', 'programmeAssignments',`;

const loadDataReplacement = `    // Ensure official teams exist
    if (!currentData.teams || !Array.isArray(currentData.teams) || currentData.teams.length === 0) {
      currentData.teams = JSON.parse(JSON.stringify(INITIAL_TEAMS));
    }
    // Ensure official registered students exist
    if (!currentData.registeredStudents || !Array.isArray(currentData.registeredStudents) || currentData.registeredStudents.length === 0) {
      currentData.registeredStudents = JSON.parse(JSON.stringify(INITIAL_REGISTERED_STUDENTS));
    }
    // Sync team student rosters and members
    currentData.teams.forEach(team => {
      if (!Array.isArray(team.students) || team.students.length === 0) {
        team.students = (currentData.registeredStudents || [])
          .filter(s => s.teamId === team.id)
          .map(s => ({
            id: s.id,
            chestNo: s.chestNo,
            name: s.name,
            category: s.classCategory,
            compCategory: 'Literary Arena',
            events: []
          }));
      }
      team.members = team.students.length;
    });

    // Ensure all operational arrays are defined
    const arrayKeys = [
      'teams', 'registeredStudents', 'programmes', 'programmeAssignments',`;

if (!file.includes('Sync team student rosters and members')) {
  file = file.replace(loadDataTarget, loadDataReplacement);
}

// Update getStudentStats()
const oldStatsTarget = `    // Categories
    const categoryBreakdown = {
      Junior: students.filter(s => s.classCategory === 'Junior').length,
      Senior: students.filter(s => s.classCategory === 'Senior').length,
      General: students.filter(s => s.classCategory === 'General').length,
    };`;

const newStatsReplacement = `    // Official 4 Categories: Senior, Junior, Sub Junior, Minor
    const categoryBreakdown = {
      Senior: students.filter(s => (s.classCategory || '').toLowerCase() === 'senior').length,
      Junior: students.filter(s => (s.classCategory || '').toLowerCase() === 'junior').length,
      SubJunior: students.filter(s => {
        const cat = (s.classCategory || '').toLowerCase().replace(/[\\s-_]/g, '');
        return cat === 'subjunior';
      }).length,
      Minor: students.filter(s => (s.classCategory || '').toLowerCase() === 'minor').length,
    };`;

file = file.replace(oldStatsTarget, newStatsReplacement);

const oldStatsReturn = `    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      assignedStudents,
      unassignedStudents,
      competitionRegistrations,
      pendingRegistrations,
      categoryBreakdown,
      teamDistribution
    };`;

const newStatsReturn = `    return {
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
    };`;

file = file.replace(oldStatsReturn, newStatsReturn);

// Update getStudents category filter
const oldCategoryFilter = `    // Apply category filter
    if (category && category !== 'all') {
      list = list.filter(s => s.classCategory.toLowerCase() === category.toLowerCase());
    }`;

const newCategoryFilter = `    // Apply category filter
    if (category && category !== 'all') {
      const targetCat = category.toLowerCase().replace(/[\\s-_]/g, '');
      list = list.filter(s => (s.classCategory || '').toLowerCase().replace(/[\\s-_]/g, '') === targetCat);
    }`;

file = file.replace(oldCategoryFilter, newCategoryFilter);

// Add helper methods: normalizeClassCategory, generateStudentEmail, generateChestNumber, updateStudentPhone
const helperMethodsCode = `  normalizeClassCategory(category) {
    if (!category) return 'Senior';
    const c = category.toString().trim().toLowerCase().replace(/[\\s-_]/g, '');
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
      .replace(/[^a-z0-9\\s]/g, '')
      .replace(/\\s+/g, '.');
    if (!clean) clean = 'student';

    let candidate = \`\${clean}@dalanzia.org\`;
    const existingEmails = new Set(
      (this.data.registeredStudents || [])
        .filter(s => s.id !== excludeStudentId && s.email)
        .map(s => s.email.toLowerCase())
    );

    if (!existingEmails.has(candidate.toLowerCase())) {
      return candidate;
    }

    let suffix = 2;
    while (existingEmails.has(\`\${clean}.\${suffix}@dalanzia.org\`)) {
      suffix++;
    }
    return \`\${clean}.\${suffix}@dalanzia.org\`;
  }

  generateChestNumber() {
    let maxChestNum = 100;
    (this.data.registeredStudents || []).forEach(s => {
      const match = (s.chestNo || '').match(/C-(\\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n >= maxChestNum) maxChestNum = n;
      }
    });
    let nextCandidate = maxChestNum + 1;
    let autoChest = \`C-\${nextCandidate}\`;
    const existing = new Set((this.data.registeredStudents || []).map(s => (s.chestNo || '').toUpperCase()));
    while (existing.has(autoChest.toUpperCase())) {
      nextCandidate++;
      autoChest = \`C-\${nextCandidate}\`;
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
      \`Updated phone number for \${student.name} (\${student.chestNo}) to \${trimmed ? trimmed : 'Removed'}\`
    );
    this.saveData();
    return { success: true, student };
  }
`;

// Replace addStudent implementation
const addStudentStart = '  addStudent(studentData) {';
const addStudentEnd = '    return { success: true, student: newStudent };\n  }';
const addStudentIdx = file.indexOf(addStudentStart);
const addStudentEndIdx = file.indexOf(addStudentEnd, addStudentIdx);

if (addStudentIdx !== -1 && addStudentEndIdx !== -1) {
  const newAddStudent = `  addStudent(studentData) {
    if (!studentData.name || studentData.name.trim() === '') {
      throw new Error('Student Full Name is required.');
    }

    // Auto-generate next Student ID: STU-10XX
    let nextNum = 1001;
    (this.data.registeredStudents || []).forEach(s => {
      const match = (s.id || '').match(/STU-(\\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n >= nextNum) nextNum = n + 1;
      }
    });
    const autoId = \`STU-\${nextNum}\`;

    // Auto-generate or validate chest number
    let autoChest = studentData.chestNo ? studentData.chestNo.trim().toUpperCase() : '';
    if (!autoChest) {
      autoChest = this.generateChestNumber();
    } else {
      // Validate unique chest number
      if ((this.data.registeredStudents || []).some(s => (s.chestNo || '').toUpperCase() === autoChest)) {
        throw new Error(\`Chest Number \${autoChest} is already allocated to another registered student.\`);
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
        compCategory: 'Literary Arena',
        events: []
      });
      assignedTeam.members = (assignedTeam.members || 0) + 1;
    }

    this.data.registeredStudents.push(newStudent);
    this.addAuditLog(
      'STUDENT_REGISTERED',
      \`Registered student \${newStudent.name} (\${newStudent.chestNo}) in category \${newStudent.classCategory}\${assignedTeam ? \` assigned to \${assignedTeam.name}\` : ''}\`
    );
    this.saveData();
    return { success: true, student: newStudent };
  }`;

  file = file.slice(0, addStudentIdx) + helperMethodsCode + '\n' + newAddStudent + file.slice(addStudentEndIdx + addStudentEnd.length - 3);
}

fs.writeFileSync(filePath, file, 'utf8');
console.log('Successfully updated festivalStore.js with categories, auto email, chest generator and phone updating!');
