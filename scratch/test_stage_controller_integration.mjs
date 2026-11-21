// Integration Test Suite for DALENZIA FEST 2K26 - STAGE CONTROLLER PORTAL & LIVE DISPLAY
import { festivalStore } from '../src/admin/data/festivalStore.js';

console.log('================================================================');
console.log('🧪 RUNNING DALENZIA FEST 2K26 - STAGE CONTROLLER TEST SUITE');
console.log('================================================================');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failedTests++;
  }
}

try {
  // Test 1: Stage Controller Authentication
  console.log('\n--- 1. AUTHENTICATION & STAGE ISOLATION ---');
  const authSuccess = festivalStore.verifyStageControllerLogin('controller1@dalenziafest.in', 'stage2k26');
  assert(authSuccess && authSuccess.success && authSuccess.session.stageId === 'STG-01', 'Stage 01 Controller Login with Email');

  const authUsername = festivalStore.verifyStageControllerLogin('controller1', 'stage2k26');
  assert(authUsername && authUsername.success && authUsername.session.stageId === 'STG-01', 'Stage 01 Controller Login with Username');

  let rejectedWrongPass = false;
  try {
    festivalStore.verifyStageControllerLogin('controller1', 'wrong_pass');
  } catch (e) {
    rejectedWrongPass = true;
  }
  assert(rejectedWrongPass, 'Rejects invalid password with exception');

  const profile = festivalStore.getStageControllerProfile('STG-01');
  assert(profile && profile.stageName && profile.stageName.includes('Cordova'), 'Stage 01 profile loaded correctly');

  // Test 2: Stage Competitions
  console.log('\n--- 2. STAGE COMPETITIONS MANAGEMENT ---');
  const stageComps = festivalStore.getStageCompetitions('STG-01');
  assert(Array.isArray(stageComps) && stageComps.length > 0, `Stage 01 has ${stageComps.length} competitions`);

  const targetComp = stageComps[0];
  const compCode = targetComp.code || targetComp.competitionCode;
  const compTitle = targetComp.title || targetComp.competitionTitle;
  console.log(`Target competition: [${compCode}] ${compTitle}`);

  const statusUpdate = festivalStore.updateStageCompetitionStatus(targetComp.id, 'STG-01', 'Ready', 'Usthad Salman Farisi');
  assert(statusUpdate.success && (statusUpdate.operationalStatus === 'Ready' || statusUpdate.stageStatus === 'Ready'), 'Update competition status to Ready');

  // Test 3: Participant Code Letter Generation
  console.log('\n--- 3. PARTICIPANT CODE LETTER MANAGEMENT ---');
  const codeGenResult = festivalStore.generateParticipantCodes(targetComp.id, 'STG-01', 'A', 'Usthad Salman Farisi');
  assert(codeGenResult.success && codeGenResult.count > 0, `Generated ${codeGenResult.count} participant codes`);

  const codeAssignments = festivalStore.getCompetitionCodeAssignments(targetComp.id, 'STG-01');
  assert(codeAssignments.length === codeGenResult.count, `Retrieved ${codeAssignments.length} code assignments`);
  assert(codeAssignments[0].codeLetter.startsWith('A-'), `Code format verified: ${codeAssignments[0].codeLetter}`);

  // Test 4: Live Random Code Draw Ceremony
  console.log('\n--- 4. LIVE RANDOM CODE DRAW CEREMONY ---');
  const session = festivalStore.getOrCreateDrawSession('STG-01', targetComp.id, 'Usthad Salman Farisi');
  assert(session && session.id, `Draw session created/loaded: ${session.id}`);

  // Atomic draw #1
  const draw1 = festivalStore.executeRandomCodeDraw(session.id, 'idem_key_1', 'Usthad Salman Farisi');
  assert(draw1.success && draw1.drawnResult.drawOrder === 1, `Atomic draw #1 executed: Code ${draw1.drawnResult?.codeLetter}`);

  // Atomic draw #2
  const draw2 = festivalStore.executeRandomCodeDraw(session.id, 'idem_key_2', 'Usthad Salman Farisi');
  assert(draw2.success && draw2.drawnResult.drawOrder === 2, `Atomic draw #2 executed: Code ${draw2.drawnResult?.codeLetter}`);
  assert(draw1.drawnResult.codeLetter !== draw2.drawnResult.codeLetter, 'Draw produces distinct un-repeated codes');

  // Test 5: Participant Calling Queue System
  console.log('\n--- 5. PARTICIPANT CALLING QUEUE SYSTEM ---');
  const callingRecords = festivalStore.getStageCallingRecords(targetComp.id, 'STG-01');
  assert(callingRecords.length >= 2, `Calling queue populated with ${callingRecords.length} records`);
  assert(callingRecords[0].callOrder === 1 && callingRecords[0].codeLetter === draw1.drawnResult.codeLetter, 'Calling order strictly follows draw order sequence');

  // Call participant #1
  const callAction = festivalStore.updateParticipantCallingStatus(callingRecords[0].id, 'Called', null, 'Usthad Salman Farisi');
  assert(callAction.success && callAction.record.status === 'Called', 'Status updated to Called');

  // Start performance
  const startAction = festivalStore.updateParticipantCallingStatus(callingRecords[0].id, 'In Progress', null, 'Usthad Salman Farisi');
  assert(startAction.success && startAction.record.status === 'In Progress' && startAction.record.startedAt, 'Status updated to In Progress with startedAt timestamp');

  // Finish performance
  const finishAction = festivalStore.updateParticipantCallingStatus(callingRecords[0].id, 'Completed', null, 'Usthad Salman Farisi');
  assert(finishAction.success && finishAction.record.status === 'Completed' && finishAction.record.completedAt, 'Status updated to Completed with completedAt timestamp');

  // Skip participant #2 with reason
  const skipAction = festivalStore.updateParticipantCallingStatus(callingRecords[1].id, 'Skipped', 'Costume delay', 'Usthad Salman Farisi');
  assert(skipAction.success && skipAction.record.status === 'Skipped' && skipAction.record.skipReason === 'Costume delay', 'Participant skipped with reason logged');

  // Test 6: Live Stage Display Data
  console.log('\n--- 6. LIVE STAGE DISPLAY DATA ---');
  const displayData = festivalStore.getLiveStageDisplayData('STG-01');
  assert(displayData && displayData.stageId === 'STG-01', 'Live Stage display data returned');
  assert(displayData.activeCompetition !== null || displayData.competition !== null, 'Active competition bound to display data');

  // Test 7: Stage Reports & Oversight
  console.log('\n--- 7. STAGE REPORTS & OVERSIGHT ---');
  const reportData = festivalStore.getStageReports('STG-01');
  assert(reportData.drawRecords.length >= 2, `Reports draw records: ${reportData.drawRecords.length}`);
  assert(reportData.callingRecords.length >= 2, `Reports calling records: ${reportData.callingRecords.length}`);

  const allStagesOversight = festivalStore.getAllStagesOversight();
  assert(Array.isArray(allStagesOversight) && allStagesOversight.length === 5, 'All 5 stages tracked in multi-stage oversight');

} catch (err) {
  console.error('Test execution error:', err);
  failedTests++;
}

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
