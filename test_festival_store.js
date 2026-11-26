import assert from 'node:assert/strict';

// Isolated in-memory localStorage & offline test guard before importing store
globalThis.__DALENZIA_ISOLATED_TEST__ = true;
const memStorage = new Map();
globalThis.window = globalThis;
globalThis.window.addEventListener = () => {};
globalThis.localStorage = {
  getItem: (k) => (memStorage.has(k) ? memStorage.get(k) : null),
  setItem: (k, v) => memStorage.set(k, String(v)),
  removeItem: (k) => memStorage.delete(k)
};

// Seed simulated stale Charter v1 cached state to test non-destructive migration + backup
memStorage.set(
  'dalenzia_fest_2k26_master_store_clean_v6',
  JSON.stringify({
    charterVersion: 'v1-13page',
    scoringConfig: {
      positionPoints: {
        individual: { first: 3, second: 2, third: 1 },
        group: { first: 10, second: 8, third: 6 }
      }
    },
    registeredStudents: [
      { id: 'STU-1001', chestNo: 'C-101', name: 'Noufal', classCategory: 'Senior', teamId: 'team-1', teamName: 'Dazzlers', phone: '+91 99999 11111' },
      { id: 'STU-1026', chestNo: 'C-126', name: 'Anshid', classCategory: 'Sub Junior', teamId: null, teamName: 'Unassigned', status: 'Audit Flagged (PDF Typo Duplicate)' },
      { id: 'STU-1033', chestNo: 'C-133', name: 'Nusaih', classCategory: 'Minor', teamId: null, teamName: 'Unassigned', status: 'Audit Flagged (PDF Typo Duplicate)' },
      { id: 'STU-1038', chestNo: 'C-138', name: 'Farhan', classCategory: 'Minor', teamId: 'team-2', teamName: 'Dynamos' },
      { id: 'STU-1040', chestNo: 'C-140', name: 'Farhah (Faizan)', classCategory: 'Minor', teamId: 'team-1', teamName: 'Dazzlers' }
    ]
  })
);

const { festivalStore } = await import('./src/admin/data/festivalStore.js');

console.log('Running DALENZIA 2K26 Complete 12-Point Workflow Verification...');

// Step 1: Migration & Backup Verification
const backupRaw = globalThis.localStorage.getItem('dalenzia_fest_2k26_pre_rulebook_v2_backup');
assert.ok(backupRaw, 'Pre-migration backup snapshot must be saved before Charter v2 migration');

const teams = festivalStore.getTeams();
const t1 = teams.find(t => t.id === 'team-1');
const t2 = teams.find(t => t.id === 'team-2');
assert.equal(t1.members, 23, 'Team 1 Dazzlers must have 23 active members');
assert.equal(t2.members, 23, 'Team 2 Dynamos must have 23 active members');
assert.equal(festivalStore.getRegisteredStudents().length, 46, 'Total active students must be 46');

// Check preserved custom contact phone + updated STU-1026 / STU-1033 / STU-1038 / STU-1040
const noufal = festivalStore.getRegisteredStudents().find(s => s.id === 'STU-1001');
assert.equal(noufal.phone, '+91 99999 11111', 'Custom user contact info must survive migration');
const anshid = festivalStore.getRegisteredStudents().find(s => s.id === 'STU-1026');
assert.equal(anshid.classCategory, 'Junior');
assert.equal(anshid.teamId, 'team-1');
assert.equal(anshid.status, 'Active');
const nusaih = festivalStore.getRegisteredStudents().find(s => s.id === 'STU-1033');
assert.equal(nusaih.classCategory, 'Sub Junior');
assert.equal(nusaih.teamId, 'team-2');
assert.equal(nusaih.status, 'Active');
const farhan = festivalStore.getRegisteredStudents().find(s => s.id === 'STU-1038');
assert.equal(farhan.teamId, 'team-1');
const faizan = festivalStore.getRegisteredStudents().find(s => s.id === 'STU-1040');
assert.equal(faizan.name, 'Faizan');
assert.equal(faizan.teamId, 'team-2');

// Step 2: 77 Charter Programmes & Blank Active Competition Separation
const charter = festivalStore.getCharterProgrammes();
assert.equal(charter.length, 77);
assert.equal(festivalStore.getCompetitions().length, 0, 'Master definitions must NOT auto-populate active competitions');

// Step 3: Activate Competitions (1 Individual + 1 General)
const actInd = festivalStore.activateCharterProgramme('PRG-SUB-STG-01', { assignedJudgeIds: ['JDG-1001'] });
assert.equal(actInd.success, true);
const actGen = festivalStore.activateCharterProgramme('PRG-GEN-02', { assignedJudgeIds: ['JDG-1001'] });
assert.equal(actGen.success, true);

// Step 4: Participant Eligibility & Registration (Individual + General Team Members)
assert.throws(
  () => festivalStore.registerParticipantForCompetition('PRG-SUB-STG-01', 'STU-1001'),
  /Category mismatch/i,
  'Senior student must be rejected from Sub Junior competition'
);
festivalStore.registerParticipantForCompetition('PRG-SUB-STG-01', 'STU-1028'); // Rifaee (Team 1)
festivalStore.registerParticipantForCompetition('PRG-SUB-STG-01', 'STU-1029'); // Rizwan (Team 2)
festivalStore.registerParticipantForCompetition('PRG-SUB-STG-01', 'STU-1030'); // Abdul Nasar (Team 1)

// General 4-member entry for Group Song
assert.throws(
  () => festivalStore.registerGeneralTeamEntry({
    competitionId: 'PRG-GEN-02',
    teamId: 'team-1',
    memberIds: ['STU-1001', 'STU-1002'],
    entryIndex: 1
  }),
  /requires exactly 4 members/i
);
festivalStore.registerGeneralTeamEntry({
  competitionId: 'PRG-GEN-02',
  teamId: 'team-1',
  memberIds: ['STU-1001', 'STU-1002', 'STU-1003', 'STU-1004'],
  entryIndex: 1
});
festivalStore.registerGeneralTeamEntry({
  competitionId: 'PRG-GEN-02',
  teamId: 'team-2',
  memberIds: ['STU-1005', 'STU-1006', 'STU-1007', 'STU-1008'],
  entryIndex: 1
});

// Step 5: Judge Submits Marks -> Pending Approval -> ZERO Standings Points!
const subInd = festivalStore.submitJudgeEvaluation({
  competitionId: 'PRG-SUB-STG-01',
  judgeId: 'JDG-1001',
  judgeName: 'Judge 1',
  type: 'Individual',
  category: 'Sub Junior',
  scores: [
    { studentId: 'STU-1028', total: 90 },
    { studentId: 'STU-1029', total: 82 },
    { studentId: 'STU-1030', total: 75 }
  ]
});
assert.equal(subInd.assignment.status, 'Pending Approval');
assert.equal(festivalStore.getTeamById('team-1').points, 0, 'Pending Approval evaluation must award 0 points');

// Step 6: Main Admin Approves Individual -> Points Become 5+1=6 (Team 1) and 3 (Team 2)
festivalStore.approveEvaluation('PRG-SUB-STG-01', { approvedByRole: 'ADMIN', approvedByName: 'Basim' });
assert.equal(festivalStore.getTeamById('team-1').points, 6, 'Team 1 = 5 (1st) + 1 (3rd)');
assert.equal(festivalStore.getTeamById('team-2').points, 3, 'Team 2 = 3 (2nd)');

// Step 7: Return for Correction -> Points Drop to 0 & Revision History Preserved
assert.throws(
  () => festivalStore.returnEvaluationForCorrection('PRG-SUB-STG-01', { returnedByRole: 'CONVENER', reason: '' }),
  /reason is strictly required/i
);
festivalStore.returnEvaluationForCorrection('PRG-SUB-STG-01', {
  returnedByRole: 'CONVENER',
  returnedByName: 'Convener',
  reason: 'Recheck chest C-128 total'
});
assert.equal(festivalStore.getTeamById('team-1').points, 0, 'Returned evaluation must revoke team points');
assert.equal(festivalStore.getAllSubmittedEvaluations()[0].revisionHistory.length, 1);

// Judge Resubmits -> Convener Approves -> Points Recomputed Cleanly (no double counting)
festivalStore.submitJudgeEvaluation({
  competitionId: 'PRG-SUB-STG-01',
  judgeId: 'JDG-1001',
  judgeName: 'Judge 1',
  type: 'Individual',
  category: 'Sub Junior',
  scores: [
    { studentId: 'STU-1029', total: 94 }, // Team 2 now 1st (5 pts)
    { studentId: 'STU-1028', total: 88 }, // Team 1 now 2nd (3 pts)
    { studentId: 'STU-1030', total: 75 }  // Team 1 3rd (1 pt)
  ]
});
festivalStore.convenerApproveResult('PRG-SUB-STG-01', { convenerName: 'Convener' });
assert.equal(festivalStore.getTeamById('team-1').points, 4, 'Team 1 = 3 + 1');
assert.equal(festivalStore.getTeamById('team-2').points, 5, 'Team 2 = 5');

// Step 8: General Group Song (15-10-5)
festivalStore.submitJudgeEvaluation({
  competitionId: 'PRG-GEN-02',
  judgeId: 'JDG-1001',
  judgeName: 'Judge 1',
  type: 'Group',
  category: 'General',
  scores: [
    { teamId: 'team-1', entryIndex: 1, memberIds: ['STU-1001', 'STU-1002', 'STU-1003', 'STU-1004'], total: 91 },
    { teamId: 'team-2', entryIndex: 1, memberIds: ['STU-1005', 'STU-1006', 'STU-1007', 'STU-1008'], total: 85 }
  ]
});
festivalStore.approveEvaluation('PRG-GEN-02', { approvedByRole: 'CONVENER', approvedByName: 'Convener' });
assert.equal(festivalStore.getTeamById('team-1').points, 4 + 15, 'Team 1 = 4 Ind + 15 General = 19');
assert.equal(festivalStore.getTeamById('team-2').points, 5 + 10, 'Team 2 = 5 Ind + 10 General = 15');

// Step 9: Convener Publishes Result & Verifies Role-Scoped Portal Views + Reports
festivalStore.convenerPublishOfficialResult('PRG-SUB-STG-01');
const stuRifaee = festivalStore.getStudentPublishedResults('STU-1028');
assert.equal(stuRifaee.length, 1);
assert.equal(stuRifaee[0].points, 3);
assert.equal(stuRifaee[0].grade, null, 'Grade remains null until Admin configures cutoffs');

const stuNoufal = festivalStore.getStudentPublishedResults('STU-1001');
assert.equal(stuNoufal.length, 1, 'General group participation must appear on Student portal');
assert.equal(stuNoufal[0].isGroup, true);
assert.equal(stuNoufal[0].points, 15);

const teamReport = festivalStore.getTeamPerformanceReports();
const r1 = teamReport.find(r => r.teamId === 'team-1');
assert.equal(r1.individualPoints, 4);
assert.equal(r1.groupGeneralPoints, 15);
assert.equal(r1.totalPoints, 19);

console.log('ALL 12-POINT END-TO-END WORKFLOW TESTS PASSED!');
process.exit(0);
