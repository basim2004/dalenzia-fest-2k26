import { festivalStore } from './src/admin/data/festivalStore.js';

console.log('--- Testing Calculation Engine & Tie Detection ---');

const testComp = festivalStore.getProgrammeMaster().find(p => p.type === 'Individual' && p.category === 'Minor');
const minorStudents = festivalStore.getRegisteredStudents().filter(s => s.classCategory === 'Minor').slice(0, 4);

// Register 3 participants
minorStudents.slice(0, 3).forEach(s => {
  try {
    festivalStore.registerParticipantForCompetition(testComp.id, s.id);
  } catch (e) {
    // Already registered
  }
});

const asg = festivalStore.data.programmeAssignments.find(c => c.id === testComp.id);
console.log('Participants registered in test comp:', asg.participants.length);

// Submit mock evaluation with a TIE between participant 0 and 1
const mockEval1 = {
  id: 'EVAL-TEST-01',
  competitionId: testComp.id,
  assignmentId: testComp.id,
  judgeId: 'JDG-001',
  judgeName: 'Qari Abdul Rahman',
  status: 'Submitted',
  scores: [
    { studentId: asg.participants[0].studentId, total: 88, criteriaMarks: { c1: 35, c2: 25, c3: 18, c4: 10 } },
    { studentId: asg.participants[1].studentId, total: 88, criteriaMarks: { c1: 35, c2: 25, c3: 18, c4: 10 } }, // EXACT TIE
    { studentId: asg.participants[2].studentId, total: 72, criteriaMarks: { c1: 30, c2: 20, c3: 14, c4: 8 } }
  ]
};

// Add evaluation to festivalStore
festivalStore.data.submittedEvaluations = festivalStore.data.submittedEvaluations.filter(e => e.id !== 'EVAL-TEST-01');
festivalStore.data.submittedEvaluations.push(mockEval1);

// Test calculation
const result = festivalStore.calculateAggregatedResults(testComp.id);
console.log('Calculation complete. hasTie:', result.hasTie);
console.log('Ranked Participants:');
result.rankedParticipants.forEach(p => {
  console.log(`Rank ${p.rank}: ${p.name} (${p.teamName}) - Score: ${p.computedScore}, Grade: ${p.grade}, isTie: ${p.isTie}, PositionPts: ${p.positionPoints}, TotalPts: ${p.pointsAwarded}`);
});

if (!result.hasTie) throw new Error('Expected tie detection flag!');
if (result.rankedParticipants[0].positionPoints !== 3) throw new Error('First place individual points must be 3!');
if (result.rankedParticipants[1].positionPoints !== 2 && result.rankedParticipants[1].positionPoints !== 3) {
  console.log('Second participant position points:', result.rankedParticipants[1].positionPoints);
}

// Test Group Competition Points
const groupComp = festivalStore.getProgrammeMaster().find(p => p.type === 'Group' && p.category === 'General');
console.log('Testing Group Event:', groupComp.name);
const groupAsg = festivalStore.data.programmeAssignments.find(c => c.id === groupComp.id);

// Add team 1 and team 2 entries
groupAsg.participants = [
  { studentId: 'GRP-T1', chestNo: 'G-101', name: 'Dazzlers Ensemble', teamId: 'team-1', teamName: 'Dazzlers' },
  { studentId: 'GRP-T2', chestNo: 'G-102', name: 'Dynamos Ensemble', teamId: 'team-2', teamName: 'Dynamos' }
];

const mockEvalGroup = {
  id: 'EVAL-GRP-01',
  competitionId: groupComp.id,
  assignmentId: groupComp.id,
  judgeId: 'JDG-001',
  judgeName: 'Qari Abdul Rahman',
  status: 'Submitted',
  scores: [
    { studentId: 'GRP-T1', total: 95 },
    { studentId: 'GRP-T2', total: 90 }
  ]
};
festivalStore.data.submittedEvaluations = festivalStore.data.submittedEvaluations.filter(e => e.id !== 'EVAL-GRP-01');
festivalStore.data.submittedEvaluations.push(mockEvalGroup);

const groupResult = festivalStore.calculateAggregatedResults(groupComp.id);
console.log('Group 1st Place points:', groupResult.rankedParticipants[0].pointsAwarded);
console.log('Group 2nd Place points:', groupResult.rankedParticipants[1].pointsAwarded);
if (groupResult.rankedParticipants[0].pointsAwarded !== 10) throw new Error('Group 1st place must receive 10 points!');
if (groupResult.rankedParticipants[1].pointsAwarded !== 8) throw new Error('Group 2nd place must receive 8 points!');

// Clean up test data
festivalStore.data.submittedEvaluations = festivalStore.data.submittedEvaluations.filter(e => e.id !== 'EVAL-TEST-01' && e.id !== 'EVAL-GRP-01');
asg.participants = [];
groupAsg.participants = [];

console.log('ALL CALCULATION & TIE TESTS PASSED!');
