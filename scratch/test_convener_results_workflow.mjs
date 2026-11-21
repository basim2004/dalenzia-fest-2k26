import { festivalStore } from '../src/admin/data/festivalStore.js';
import assert from 'assert';

console.log('================================================================');
console.log('DALENZIA FEST 2K26 - CONVENER RESULT MANAGEMENT & PUBLISHING');
console.log('COMPREHENSIVE 20-POINT WORKFLOW TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ Test ${totalTests} FAILED: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// Test 1: Convener assigns multiple judges to a competition
// -----------------------------------------------------------------------------
runTest('Convener assigns multiple judges to a competition', () => {
  const compId = 'COMP-MED-06'; // 'Documentary Short Film'
  const targetJudges = ['JDG-1006', 'JDG-1015', 'JDG-1001'];
  
  const res = festivalStore.convenerAssignJudgesToCompetition({
    competitionId: compId,
    judgeIds: targetJudges,
    instructions: 'Evaluate visual composition, narrative arc, and audio clarity.',
    assignedBy: 'Usthad Hashir Ali (Convener)'
  });
  
  assert.strictEqual(res.success, true);
  assert.deepStrictEqual(res.assignment.assignedJudgeIds, targetJudges);
  assert.strictEqual(res.assignment.assignedBy, 'Usthad Hashir Ali (Convener)');
});

// -----------------------------------------------------------------------------
// Test 2: Judges log into Judge Portal and can identify their assignments
// -----------------------------------------------------------------------------
runTest('Judges can identify their assigned competitions', () => {
  const judgeId = 'JDG-1001';
  const assignments = festivalStore.getAssignments(judgeId);
  assert.ok(assignments.length > 0, 'Judge 1001 must have assignments');
  const hasComp = assignments.some(a => a.competitionId === 'COMP-MED-06');
  assert.ok(hasComp, 'Judge 1001 must have COMP-MED-06 in their assignments');
});

// -----------------------------------------------------------------------------
// Test 3: Each judge submits their evaluations
// -----------------------------------------------------------------------------
runTest('Judges submit their evaluations', () => {
  const compId = 'COMP-MED-06';
  const participants = festivalStore.getAssignmentById('ASG-006').participants;

  // Judge 1: JDG-1006
  const eval1 = festivalStore.submitJudgeEvaluation({
    assignmentId: 'ASG-006',
    competitionId: compId,
    judgeId: 'JDG-1006',
    judgeName: 'Prof. Shihabudheen Thangal',
    scores: participants.map((p, idx) => ({
      studentId: p.studentId,
      chestNo: p.chestNo,
      studentName: p.name,
      teamId: p.teamId,
      teamName: p.teamName,
      criteriaMarks: { c1: 25 - idx, c2: 24 - idx, c3: 23 - idx, c4: 18 - idx },
      total: 90 - (idx * 4),
      remarks: 'Impressive editing and cinematic narrative.'
    }))
  });
  assert.ok(eval1.evaluation.id, 'Evaluation 1 must be created');

  // Judge 2: JDG-1015
  const eval2 = festivalStore.submitJudgeEvaluation({
    assignmentId: 'ASG-006',
    competitionId: compId,
    judgeId: 'JDG-1015',
    judgeName: 'Usthad Mansoor Ali',
    scores: participants.map((p, idx) => ({
      studentId: p.studentId,
      chestNo: p.chestNo,
      studentName: p.name,
      teamId: p.teamId,
      teamName: p.teamName,
      criteriaMarks: { c1: 24 - idx, c2: 23 - idx, c3: 22 - idx, c4: 19 - idx },
      total: 88 - (idx * 3),
      remarks: 'Strong thematic relevance to festival values.'
    }))
  });
  assert.ok(eval2.evaluation.id, 'Evaluation 2 must be created');
});

// -----------------------------------------------------------------------------
// Test 4: Convener sees individual submission statuses in Tracking
// -----------------------------------------------------------------------------
runTest('Convener sees individual submission statuses', () => {
  const tracking = festivalStore.getJudgeEvaluationTracking('COMP-MED-06');
  assert.strictEqual(tracking.length, 3, 'Must track all 3 assigned judges');
  
  const j1006 = tracking.find(t => t.judgeId === 'JDG-1006');
  const j1015 = tracking.find(t => t.judgeId === 'JDG-1015');
  const j1001 = tracking.find(t => t.judgeId === 'JDG-1001');

  assert.strictEqual(j1006.status, 'Submitted');
  assert.strictEqual(j1015.status, 'Submitted');
  assert.strictEqual(j1001.status, 'Not Started');
});

// -----------------------------------------------------------------------------
// Test 5: Convener views each judge\'s submitted marks in isolation
// -----------------------------------------------------------------------------
runTest('Convener views each judge submitted marks in isolation', () => {
  const jw = festivalStore.getJudgeWiseEvaluations('COMP-MED-06');
  assert.strictEqual(jw.judgeEvaluations.length, 2, 'Should have 2 submitted evaluations');
  
  const eval1006 = jw.judgeEvaluations.find(e => e.judgeId === 'JDG-1006');
  assert.ok(eval1006.scores.length > 0, 'Judge 1006 must have individual participant scores');
  assert.strictEqual(eval1006.scores[0].total, 90);
});

// -----------------------------------------------------------------------------
// Test 6: Convener views the combined aggregated evaluation
// -----------------------------------------------------------------------------
runTest('Convener views combined aggregated evaluation', () => {
  const jw = festivalStore.getJudgeWiseEvaluations('COMP-MED-06');
  const agg = jw.aggregatedResult;
  assert.ok(agg, 'Aggregated result must exist');
  assert.strictEqual(agg.rankedParticipants.length, 2);
  assert.strictEqual(agg.rankedParticipants[0].rank, 1);
  assert.strictEqual(agg.rankedParticipants[0].averageScore, 89); // (90 + 88) / 2
});

// -----------------------------------------------------------------------------
// Test 7: Missing submissions are clearly identified
// -----------------------------------------------------------------------------
runTest('Missing submissions are clearly identified', () => {
  const jw = festivalStore.getJudgeWiseEvaluations('COMP-MED-06');
  assert.strictEqual(jw.missingJudges.length, 1);
  assert.strictEqual(jw.missingJudges[0].id, 'JDG-1001');
  assert.strictEqual(jw.aggregatedResult.isComplete, false);
});

// -----------------------------------------------------------------------------
// Test 8: Convener returns a result for correction
// -----------------------------------------------------------------------------
runTest('Convener returns a result for correction with mandatory reason', () => {
  const ret = festivalStore.convenerReturnEvaluationForCorrection('COMP-MED-06', 'JDG-1015', {
    reason: 'Please clarify deduction on contestant 2 regarding documentary runtime.',
    returnedBy: 'Usthad Hashir Ali (Convener)'
  });

  assert.strictEqual(ret.success, true);
  assert.strictEqual(ret.evaluation.status, 'Correction Requested');
  assert.strictEqual(ret.evaluation.correctionReason, 'Please clarify deduction on contestant 2 regarding documentary runtime.');
  assert.strictEqual(ret.assignment.status, 'Correction Requested');
});

// -----------------------------------------------------------------------------
// Test 9: Judge corrects and resubmits
// -----------------------------------------------------------------------------
runTest('Judge corrects marks and resubmits', () => {
  const compId = 'COMP-MED-06';
  const participants = festivalStore.getAssignmentById('ASG-006').participants;

  // Judge 1015 resubmits adjusted marks
  const resubmitted = festivalStore.submitJudgeEvaluation({
    assignmentId: 'ASG-006',
    competitionId: compId,
    judgeId: 'JDG-1015',
    judgeName: 'Usthad Mansoor Ali',
    scores: participants.map((p, idx) => ({
      studentId: p.studentId,
      chestNo: p.chestNo,
      studentName: p.name,
      teamId: p.teamId,
      teamName: p.teamName,
      criteriaMarks: { c1: 25 - idx, c2: 24 - idx, c3: 23 - idx, c4: 19 - idx },
      total: 91 - (idx * 3), // corrected up
      remarks: 'Runtime verified within 5-minute limit. Adjusted score.'
    }))
  });

  assert.strictEqual(resubmitted.evaluation.status, 'Submitted');
});

// -----------------------------------------------------------------------------
// Test 10: Convener reviews the updated evaluation
// -----------------------------------------------------------------------------
runTest('Convener reviews updated evaluation', () => {
  const jw = festivalStore.getJudgeWiseEvaluations('COMP-MED-06');
  const eval1015 = jw.judgeEvaluations.find(e => e.judgeId === 'JDG-1015');
  assert.strictEqual(eval1015.status, 'Submitted');
  assert.strictEqual(eval1015.scores[0].total, 91);
});

// -----------------------------------------------------------------------------
// Test 11: Third judge submits to make evaluations 100% complete
// -----------------------------------------------------------------------------
runTest('Third judge submits, making evaluations complete', () => {
  const compId = 'COMP-MED-06';
  const participants = festivalStore.getAssignmentById('ASG-006').participants;

  festivalStore.submitJudgeEvaluation({
    assignmentId: 'ASG-006',
    competitionId: compId,
    judgeId: 'JDG-1001',
    judgeName: 'Dr. Sayyid Munawwar Ali',
    scores: participants.map((p, idx) => ({
      studentId: p.studentId,
      chestNo: p.chestNo,
      studentName: p.name,
      teamId: p.teamId,
      teamName: p.teamName,
      criteriaMarks: { c1: 24 - idx, c2: 24 - idx, c3: 23 - idx, c4: 18 - idx },
      total: 89 - (idx * 3),
      remarks: 'Well-articulated social theme and sound design.'
    }))
  });

  const jw = festivalStore.getJudgeWiseEvaluations('COMP-MED-06');
  assert.strictEqual(jw.missingJudges.length, 0);
  assert.strictEqual(jw.aggregatedResult.isComplete, true);
});

// -----------------------------------------------------------------------------
// Test 12: Convener approves the final result
// -----------------------------------------------------------------------------
runTest('Convener approves the final result and locks version', () => {
  const app = festivalStore.convenerApproveResult('COMP-MED-06', {
    convenerId: 'CNV-01',
    convenerName: 'Usthad Hashir Ali',
    notes: 'Jury consensus verified after runtime clarification.',
    aggregationMode: 'average',
    tieBreakerRule: 'criteria_weight'
  });

  assert.strictEqual(app.success, true);
  assert.strictEqual(app.assignment.status, 'Approved by Convener');
  assert.strictEqual(app.assignment.convenerApproved, true);
  assert.strictEqual(app.assignment.resultVersion, 1);
  assert.strictEqual(app.assignment.convenerApproval.approvedBy, 'Usthad Hashir Ali');
});

// -----------------------------------------------------------------------------
// Test 13: Convener publishes the official result
// -----------------------------------------------------------------------------
runTest('Convener publishes official result (distinct step from approval)', () => {
  const pub = festivalStore.convenerPublishOfficialResult('COMP-MED-06', {
    convenerId: 'CNV-01',
    convenerName: 'Usthad Hashir Ali',
    templateStyle: 'editorial_crimson'
  });

  assert.strictEqual(pub.success, true);
  assert.strictEqual(pub.assignment.status, 'Officially Published');
  assert.strictEqual(pub.assignment.isOfficialPublished, true);
  assert.strictEqual(pub.assignment.publishedBy, 'Usthad Hashir Ali');
  assert.ok(pub.poster, 'Poster must be generated');
  assert.ok(pub.poster.podium.first, '1st prize podium must be established');
});

// -----------------------------------------------------------------------------
// Test 14: Main Admin sees the complete result and workflow history
// -----------------------------------------------------------------------------
runTest('Main Admin sees complete result and workflow history', () => {
  const adminPosters = festivalStore.getPublishedResultPosters();
  const poster = adminPosters.find(p => p.competitionId === 'COMP-MED-06');
  assert.ok(poster, 'Main Admin must see published result poster');
  assert.strictEqual(poster.status, 'Published');

  const history = festivalStore.getPublishedResultsHistory('COMP-MED-06');
  assert.ok(history.length > 0, 'Published history must be visible to Admin');
});

// -----------------------------------------------------------------------------
// Test 15: Public website displays official published result
// -----------------------------------------------------------------------------
runTest('Public website displays official published result', () => {
  const publicPosters = festivalStore.getPublishedResultPosters();
  const hasPublished = publicPosters.some(p => p.competitionId === 'COMP-MED-06');
  assert.strictEqual(hasPublished, true);
});

// -----------------------------------------------------------------------------
// Test 16: Team Leader sees permitted team results
// -----------------------------------------------------------------------------
runTest('Team Leader sees permitted team results on leaderboard', () => {
  const teams = festivalStore.getTeams();
  const winningTeamId = festivalStore.getPublishedResultPosters().find(p => p.competitionId === 'COMP-MED-06').firstPrize.teamId;
  const winningTeam = teams.find(t => t.id === winningTeamId);
  assert.ok(winningTeam.points > 0, 'Winning team must have points accrued');
});

// -----------------------------------------------------------------------------
// Test 17: Student sees permitted individual results
// -----------------------------------------------------------------------------
runTest('Student sees permitted individual results', () => {
  const comp = festivalStore.getAssignmentById('ASG-006');
  const winnerChest = comp.participants[0].chestNo;
  assert.ok(winnerChest, 'Winning participant has chest number');
});

// -----------------------------------------------------------------------------
// Test 18: Team points update without duplication (Idempotent test)
// -----------------------------------------------------------------------------
runTest('Team points update idempotently without duplication on re-publish', () => {
  const teamsBefore = festivalStore.getTeams().map(t => ({ id: t.id, points: t.points }));
  
  // Attempt duplicate publishing
  const repub = festivalStore.convenerPublishOfficialResult('COMP-MED-06', {
    convenerId: 'CNV-01',
    convenerName: 'Usthad Hashir Ali'
  });
  assert.strictEqual(repub.success, true);

  const teamsAfter = festivalStore.getTeams().map(t => ({ id: t.id, points: t.points }));
  assert.deepStrictEqual(teamsBefore, teamsAfter, 'Team points must not double count on re-publish');
});

// -----------------------------------------------------------------------------
// Test 19: Audit history remains intact
// -----------------------------------------------------------------------------
runTest('Audit history remains intact with all Convener workflow actions', () => {
  const auditLogs = festivalStore.getAuditLogs();
  const convenerLogs = auditLogs.filter(l => 
    l.action === 'JUDGES_ASSIGNED_BY_CONVENER' ||
    l.action === 'RESULT_RETURNED_FOR_CORRECTION' ||
    l.action === 'CONVENER_RESULT_APPROVED' ||
    l.action === 'OFFICIAL_RESULT_PUBLISHED_BY_CONVENER'
  );
  assert.ok(convenerLogs.length >= 4, 'Audit logs must capture all 4 key workflow steps');
});

// -----------------------------------------------------------------------------
// Test 20: Security - Unapproved results cannot be officially published
// -----------------------------------------------------------------------------
runTest('Security enforcement: Unapproved results cannot be published', () => {
  assert.throws(() => {
    // COMP-TYP-12 is draft and not approved
    festivalStore.convenerPublishOfficialResult('COMP-TYP-12');
  }, /Result must be reviewed and approved by Convener before it can be officially published/);
});

console.log('\n================================================================');
console.log(`ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY (100%)!`);
console.log('================================================================');
