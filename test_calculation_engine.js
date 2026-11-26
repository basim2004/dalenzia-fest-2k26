import assert from 'node:assert/strict';
import {
  OFFICIAL_CHARTER_PROGRAMMES,
  OFFICIAL_PROGRAMME_CATEGORIES,
  OFFICIAL_CHARTER_STUDENT_TARGETS,
  OFFICIAL_SCORING_CONFIG,
  OFFICIAL_TEAMS
} from './src/admin/data/officialCharterData.js';
import {
  normalizeCategoryName,
  calculateGradeForScore,
  validateMarkEntries,
  validateParticipantRegistration,
  calculateCompetitionResults,
  calculateStandingsFromApprovedResults
} from './src/admin/data/scoringEngine.js';

console.log('Running DALENZIA 2K26 Updated Rulebook Calculation Engine Tests...');

// 1. Master Charter Verification (77 Programmes, No Minor)
assert.equal(OFFICIAL_CHARTER_PROGRAMMES.length, 77, 'Total programmes must be 77');
assert.equal(OFFICIAL_CHARTER_PROGRAMMES.filter(p => p.classification === 'Stage').length, 32);
assert.equal(OFFICIAL_CHARTER_PROGRAMMES.filter(p => p.classification === 'Off Stage').length, 31);
assert.equal(OFFICIAL_CHARTER_PROGRAMMES.filter(p => p.classification === 'General').length, 14);
assert.equal(OFFICIAL_CHARTER_PROGRAMMES.filter(p => p.category === 'Minor').length, 0);
assert.equal(OFFICIAL_PROGRAMME_CATEGORIES.some(c => c.name === 'Minor'), false);
assert.equal(OFFICIAL_CHARTER_STUDENT_TARGETS.total, 46);
assert.equal(OFFICIAL_TEAMS[0].members + OFFICIAL_TEAMS[1].members, 46);

// 2. Updated Position Points (5-3-1 Ind, 15-10-5 Group) & Inactive Unconfirmed Grades
assert.equal(OFFICIAL_SCORING_CONFIG.positionPoints.individual.first, 5);
assert.equal(OFFICIAL_SCORING_CONFIG.positionPoints.individual.second, 3);
assert.equal(OFFICIAL_SCORING_CONFIG.positionPoints.individual.third, 1);
assert.equal(OFFICIAL_SCORING_CONFIG.positionPoints.group.first, 15);
assert.equal(OFFICIAL_SCORING_CONFIG.positionPoints.group.second, 10);
assert.equal(OFFICIAL_SCORING_CONFIG.positionPoints.group.third, 5);
assert.equal(OFFICIAL_SCORING_CONFIG.isGradePointsActive, false);

const unconfirmedGrade = calculateGradeForScore({
  rawMarks: 90,
  maxMarks: 100,
  scoringConfig: OFFICIAL_SCORING_CONFIG,
  isGroup: false
});
assert.equal(unconfirmedGrade.grade, null, 'Unconfirmed thresholds must not invent grade');
assert.equal(unconfirmedGrade.gradePoints, 0, 'Unconfirmed grade points must be 0');

// 3. Admin-confirmed grades + Charter p.4 2-member caveat
const adminConfig = {
  ...OFFICIAL_SCORING_CONFIG,
  isGradePointsActive: true,
  grades: [
    { grade: 'A+', minMarks: 90, individualPoints: 5, groupPoints: 10, isActive: true },
    { grade: 'A', minMarks: 75, individualPoints: 3, groupPoints: 7, isActive: true },
    { grade: 'B', minMarks: 60, individualPoints: 2, groupPoints: 5, isActive: true },
    { grade: 'C', minMarks: 45, individualPoints: 1, groupPoints: 3, isActive: true }
  ]
};
const indGradeAPlus = calculateGradeForScore({ rawMarks: 92, maxMarks: 100, scoringConfig: adminConfig, isGroup: false });
assert.equal(indGradeAPlus.grade, 'A+');
assert.equal(indGradeAPlus.gradePoints, 5);

const twoMemberTalkMaster = calculateGradeForScore({
  rawMarks: 92,
  maxMarks: 100,
  scoringConfig: adminConfig,
  isGroup: true,
  requiredMembers: 2
});
assert.equal(twoMemberTalkMaster.gradePoints, 0, '2-member group grade points gated pending Admin rule');

// 4. Mark Validation
assert.equal(validateMarkEntries([{ studentId: 'STU-1001', score: 105 }], { maxMarks: 100 }).isValid, false);
assert.equal(validateMarkEntries([{ studentId: 'STU-1001', score: -2 }], { maxMarks: 100 }).isValid, false);
assert.equal(validateMarkEntries([{ studentId: 'STU-1001', score: 85 }], { maxMarks: 100 }).isValid, true);

// 5. Participation Eligibility & Limits (4+5 Sub Junior, 5+6 Junior/Senior)
const subStudent = { id: 'STU-1028', name: 'Rifaee', classCategory: 'Sub Junior', teamId: 'team-1', teamName: 'Dazzlers', status: 'Active' };
const subStageComps = [1, 2, 3, 4].map(n => ({
  id: `C-STG-${n}`,
  title: `Stage ${n}`,
  category: 'Sub Junior',
  classification: 'Stage',
  type: 'Individual',
  participants: [{ studentId: 'STU-1028', teamId: 'team-1' }]
}));
const fifthSubStage = { id: 'C-STG-5', title: 'Stage 5', category: 'Sub Junior', classification: 'Stage', type: 'Individual', participants: [] };
assert.equal(
  validateParticipantRegistration({ student: subStudent, competition: fifthSubStage, allCompetitions: subStageComps, scoringConfig: OFFICIAL_SCORING_CONFIG }).allowed,
  false,
  'Sub Junior 5th Stage item must be blocked'
);
const juniorMismatch = { id: 'C-JUN-1', title: 'Junior Event', category: 'Junior', classification: 'Stage', type: 'Individual', participants: [] };
assert.equal(
  validateParticipantRegistration({ student: subStudent, competition: juniorMismatch, allCompetitions: [], scoringConfig: OFFICIAL_SCORING_CONFIG }).allowed,
  false,
  'Category mismatch must be blocked'
);

// Junior allowed up to 5 Stage + 6 Off Stage
const junStudent = { id: 'STU-1012', name: 'Razeen', classCategory: 'Junior', teamId: 'team-1', teamName: 'Dazzlers', status: 'Active' };
const junStageComps = [1, 2, 3, 4].map(n => ({
  id: `J-STG-${n}`,
  title: `J Stage ${n}`,
  category: 'Junior',
  classification: 'Stage',
  type: 'Individual',
  participants: [{ studentId: 'STU-1012', teamId: 'team-1' }]
}));
const fifthJunStage = { id: 'J-STG-5', title: 'J Stage 5', category: 'Junior', classification: 'Stage', type: 'Individual', participants: [] };
assert.equal(
  validateParticipantRegistration({ student: junStudent, competition: fifthJunStage, allCompetitions: junStageComps, scoringConfig: OFFICIAL_SCORING_CONFIG }).allowed,
  true,
  'Junior 5th Stage item must be allowed'
);

// 6. Competition Result & Tie Detection + General 15-10-5
const indCalc = calculateCompetitionResults({
  competition: { id: 'PRG-SUB-STG-01', code: 'SUB-STG-01', title: 'Tarteel', category: 'Sub Junior', classification: 'Stage', type: 'Individual', maxMarks: 100 },
  scores: [
    { studentId: 'STU-1028', score: 91 },
    { studentId: 'STU-1029', score: 91 }, // Tie!
    { studentId: 'STU-1030', score: 80 }
  ],
  scoringConfig: OFFICIAL_SCORING_CONFIG,
  teams: OFFICIAL_TEAMS,
  registeredStudents: [
    { id: 'STU-1028', chestNo: 'C-128', name: 'Rifaee', teamId: 'team-1', teamName: 'Dazzlers' },
    { id: 'STU-1029', chestNo: 'C-129', name: 'Rizwan', teamId: 'team-2', teamName: 'Dynamos' },
    { id: 'STU-1030', chestNo: 'C-130', name: 'Abdul Nasar', teamId: 'team-1', teamName: 'Dazzlers' }
  ]
});
assert.equal(indCalc.hasTie, true, 'Tie must be detected');
assert.equal(indCalc.entries[0].rank, 1);
assert.equal(indCalc.entries[1].rank, 1);
assert.equal(indCalc.entries[2].rank, 3);
assert.equal(indCalc.entries[2].positionPoints, 1);

// 7. General Dual-Entry Scoring (15-10-5) & Non-Approved Exclusion
const standings = calculateStandingsFromApprovedResults({
  teams: OFFICIAL_TEAMS,
  registeredStudents: [
    { id: 'STU-1001', chestNo: 'C-101', name: 'Noufal', classCategory: 'Senior', teamId: 'team-1', teamName: 'Dazzlers' },
    { id: 'STU-1005', chestNo: 'C-105', name: 'Hashim', classCategory: 'Senior', teamId: 'team-2', teamName: 'Dynamos' }
  ],
  submittedEvaluations: [
    {
      id: 'EV-1',
      competitionId: 'PRG-GEN-02',
      competitionCode: 'GEN-02',
      competitionTitle: 'Group Song',
      category: 'General',
      type: 'Group',
      status: 'APPROVED',
      scores: [
        { teamId: 'team-1', entryIndex: 1, entryLabel: 'Dazzlers E1', memberIds: ['STU-1001'], total: 92 },
        { teamId: 'team-2', entryIndex: 1, entryLabel: 'Dynamos E1', memberIds: ['STU-1005'], total: 88 },
        { teamId: 'team-1', entryIndex: 2, entryLabel: 'Dazzlers E2', memberIds: [], total: 80 }
      ]
    },
    {
      id: 'EV-2',
      competitionId: 'PRG-SEN-STG-01',
      status: 'Pending Approval',
      scores: [{ studentId: 'STU-1005', total: 99 }]
    }
  ],
  resultPosters: [],
  programmeAssignments: [],
  scoringConfig: OFFICIAL_SCORING_CONFIG
});

const t1 = standings.teamStandings.find(t => t.id === 'team-1');
const t2 = standings.teamStandings.find(t => t.id === 'team-2');
assert.equal(t1.points, 20, 'Team 1 must get 15 + 5 = 20 from approved Group Song only');
assert.equal(t2.points, 10, 'Team 2 must get 10 from approved Group Song, ignoring Pending Approval EV-2');
assert.equal(normalizeCategoryName('Minor', { migrateLegacy: true }), 'Sub Junior');

console.log('ALL CALCULATION ENGINE TESTS PASSED!');
