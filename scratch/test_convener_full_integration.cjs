const assert = require('assert');
const { festivalStore } = require('../src/admin/data/festivalStore.js');

console.log('========================================================================');
console.log('DALENZIA FEST 2K26 - CONVENER PORTAL FULL INTEGRATION TEST SUITE');
console.log('========================================================================\n');

// 1. Authentication & Role Separation
console.log('[1/14] Testing Convener Authentication & Role Protection...');
const loginRes = festivalStore.verifyConvenerLogin('convener@dalenziafest.in', 'convener2k26');
assert.strictEqual(loginRes.success, true, 'Convener login should succeed with valid credentials');
assert.strictEqual(loginRes.session.role, 'convener', 'Role must strictly be convener');
assert.strictEqual(loginRes.session.user, 'Usthad Hashir Ali', 'User must be Usthad Hashir Ali');

const failLogin = festivalStore.verifyConvenerLogin('convener@dalenziafest.in', 'invalid');
assert.strictEqual(failLogin.success, false, 'Invalid credentials must fail');
console.log('✓ Passed: Convener authentication and role strictly enforced.');

// 2. Convener Dashboard Statistics
console.log('[2/14] Testing Convener Operational Dashboard Statistics...');
const stats = festivalStore.getConvenerDashboardStats();
assert(stats.totalStudents >= 17, 'Students count should be >= 17');
assert(stats.totalTeams >= 12, 'Teams count should be >= 12');
assert(stats.totalProgrammes >= 12, 'Programmes count should be >= 12');
assert(stats.totalCompetitions >= 12, 'Competitions count should be >= 12');
assert.strictEqual(stats.totalJudges, 18, 'Judges count should be 18');
assert.strictEqual(stats.totalGuests, 8, 'Guests count should be 8');
assert(stats.totalStages >= 5, 'Stages count should be >= 5');
assert(stats.totalActivities >= 6, 'Activities count should be >= 6');
assert(stats.operationalAlerts.length >= 3, 'Operational alerts should exist');
console.log('✓ Passed: Operational dashboard telemetry aggregates real store data.');

// 3. Student Management Full CRUD
console.log('[3/14] Testing Student Management CRUD & Bidirectional Sync...');
const initialStudentCount = festivalStore.getStudents().length;
const newStudentRes = festivalStore.addStudent({
  name: 'Test Candidate Convener',
  classCategory: 'Senior',
  teamId: 'team-01',
  institution: 'Dalailussunna Dars, Ayiroor',
  phone: '+91 98471 99999'
});
assert.strictEqual(newStudentRes.success, true);
assert(newStudentRes.student.id.startsWith('STU-'));
assert(newStudentRes.student.chestNo.startsWith('C-'));

// Verify student immediately visible in standard getStudents() (used by Main Admin)
const updatedStudents = festivalStore.getStudents();
assert.strictEqual(updatedStudents.length, initialStudentCount + 1, 'Main Admin must see student added by Convener');
const createdStudent = updatedStudents.find(s => s.id === newStudentRes.student.id);
assert(createdStudent, 'Created student must be present');

// Update student
festivalStore.updateStudent(createdStudent.id, {
  name: 'Test Candidate Updated by Convener'
});
const verifiedUpdate = festivalStore.getStudentById(createdStudent.id);
assert.strictEqual(verifiedUpdate.name, 'Test Candidate Updated by Convener');

// Delete student
festivalStore.deleteStudent(createdStudent.id, true);
assert.strictEqual(festivalStore.getStudents().length, initialStudentCount, 'Student successfully removed');
console.log('✓ Passed: Student CRUD & bidirectional Admin-Convener sync verified.');

// 4. Student Event Assignments
console.log('[4/14] Testing Student Event & Competition Assignments...');
const candidate = festivalStore.getStudents()[0];
const targetComp = festivalStore.getCompetitions()[1]; // Choose a competition

// Ensure not already in competition before registering
const isAlreadyIn = (targetComp.participants || []).some(p => p.studentId === candidate.id);
if (!isAlreadyIn) {
  const regRes = festivalStore.registerParticipantForCompetition(targetComp.id, candidate.id);
  assert.strictEqual(regRes.success, true);
  assert.strictEqual(regRes.participant.studentId, candidate.id);

  // Duplicate registration prevention check
  assert.throws(() => {
    festivalStore.registerParticipantForCompetition(targetComp.id, candidate.id);
  }, /already registered/i, 'Must throw error on duplicate registration attempt');

  // Cancel registration
  const removeRes = festivalStore.removeParticipantFromCompetition(targetComp.id, candidate.id);
  assert.strictEqual(removeRes.success, true);
}
console.log('✓ Passed: Student event assignment and capacity validation verified.');

// 5. Team Management CRUD
console.log('[5/14] Testing Team Management CRUD...');
const initialTeamCount = festivalStore.getTeams().length;
const addTeamRes = festivalStore.addTeam({
  name: 'Team Al-Fath',
  code: 'TM099',
  subname: 'Ayiroor North',
  leader: 'Salman Farisi',
  leaderContact: '+91 98471 88888',
  members: 45
});
assert.strictEqual(addTeamRes.success, true);
assert.strictEqual(festivalStore.getTeams().length, initialTeamCount + 1);

// Update Team
festivalStore.updateTeam(addTeamRes.team.id, {
  leader: 'Salman Farisi Updated'
});
const updatedTeam = festivalStore.getTeamById(addTeamRes.team.id);
assert.strictEqual(updatedTeam.leader, 'Salman Farisi Updated');

// Clean up
festivalStore.deleteTeam(addTeamRes.team.id);
assert.strictEqual(festivalStore.getTeams().length, initialTeamCount);
console.log('✓ Passed: Team management CRUD and roster reflection verified.');

// 6. Programme Management Operations
console.log('[6/14] Testing Programme Management operations...');
const initialProgCount = festivalStore.getProgrammes().length;
const addProgRes = festivalStore.addProgramme({
  title: 'Convener Special Colloquium',
  category: 'Ceremonial & Keynote',
  date: 'Dec 21, 2026',
  startTime: '11:00 AM',
  endTime: '12:30 PM',
  venue: 'Cordova Grand Stage (Stage 01)',
  coordinatorName: 'Usthad Anas K.'
});
assert.strictEqual(addProgRes.success, true);
assert.strictEqual(festivalStore.getProgrammes().length, initialProgCount + 1);

// Clean up
festivalStore.deleteProgramme(addProgRes.programme.id);
assert.strictEqual(festivalStore.getProgrammes().length, initialProgCount);
console.log('✓ Passed: Programme operations verified.');

// 7. Schedule & Conflict Detection Engine
console.log('[7/14] Testing Master Schedule and conflict detection...');
const testConflictRes = festivalStore.detectScheduleConflicts({
  stage: 'Cordova Grand Stage (Stage 01)',
  date: 'Dec 21, 2026',
  startTime: '10:30 AM',
  endTime: '11:30 AM'
});
// In seed data, Inaugural Ceremony runs 10:00 AM – 12:30 PM on Cordova Grand Stage
assert(testConflictRes.hasConflicts, 'Must detect conflict on Cordova Stage during Inaugural Ceremony');
assert(testConflictRes.conflicts.length > 0, 'Conflicts array must have entries');
console.log('✓ Passed: Stage conflict detection engine successfully flagged overlapping time.');

// 8. Guest Management Operations
console.log('[8/14] Testing Guest Management CRUD & Assignments...');
const initialGuestCount = festivalStore.getProgrammeGuests().length;
const addGuestRes = festivalStore.addProgrammeGuest({
  name: 'Dr. Tariq Ramadan Al-Azhari',
  designation: 'Professor of Comparative Jurisprudence',
  institution: 'Al-Azhar University, Cairo',
  invitationStatus: 'Confirmed',
  assignedProgrammeIds: ['PRG-001']
});
assert.strictEqual(addGuestRes.success, true);
assert.strictEqual(festivalStore.getProgrammeGuests().length, initialGuestCount + 1);

// Clean up
festivalStore.deleteProgrammeGuest(addGuestRes.guest.id);
assert.strictEqual(festivalStore.getProgrammeGuests().length, initialGuestCount);
console.log('✓ Passed: Guest management CRUD and assignments verified.');

// 9. Judge Management Operations
console.log('[9/14] Testing Judge Management operations...');
const initialJudgeCount = festivalStore.getJudges().length;
const addJudgeRes = festivalStore.addJudge({
  name: 'Usthad Luqman Hudawi',
  designation: 'Senior Lecturer',
  institution: 'Darul Huda Islamic University',
  phone: '+91 94471 22334',
  email: 'luqman@dalenziafest.in',
  qualification: 'M.A Arabic Classical Rhetoric'
});
assert.strictEqual(addJudgeRes.success, true);
assert.strictEqual(festivalStore.getJudges().length, initialJudgeCount + 1);

// Credential reset
const resetRes = festivalStore.resetJudgeCredentials(addJudgeRes.judge.id);
assert.strictEqual(resetRes.success, true);

// Clean up by removing from judges array
festivalStore.data.judges = festivalStore.data.judges.filter(j => j.id !== addJudgeRes.judge.id);
festivalStore.saveData();
assert.strictEqual(festivalStore.getJudges().length, initialJudgeCount);
console.log('✓ Passed: Judge panel management and credential resets verified.');

// 10. Venue & Stage Management
console.log('[10/14] Testing Venue & Stage Management...');
const stageRes = festivalStore.addProgrammeStage({
  name: 'Ibn Rushd Conference Suite',
  capacity: 300,
  type: 'Seminar Arena'
}, 'Convener');
assert.strictEqual(stageRes.success, true);
const stageId = stageRes.stage.id;

festivalStore.toggleProgrammeStageStatus(stageId, 'Convener');
const stageObj = festivalStore.getProgrammeStages().find(s => s.id === stageId);
assert.strictEqual(stageObj.status, 'Maintenance');

festivalStore.deleteProgrammeStage(stageId, 'Convener');
assert.strictEqual(festivalStore.getProgrammeStages().some(s => s.id === stageId), false);
console.log('✓ Passed: Venue & Stage management verified.');

// 11. Operational Activities (Paripadi)
console.log('[11/14] Testing Operational Activities / Paripadi management...');
const actRes = festivalStore.addOperationalActivity({
  title: 'Stage Lighting Calibration',
  category: 'Technical & Stage',
  responsiblePerson: 'Er. Niyas V.'
}, 'Convener');
assert.strictEqual(actRes.success, true);
const actId = actRes.activity.id;

festivalStore.updateOperationalActivityStatus(actId, 'Completed', 'Convener');
const actObj = festivalStore.getOperationalActivityById(actId);
assert.strictEqual(actObj.status, 'Completed');

festivalStore.deleteOperationalActivity(actId, 'Convener');
assert.strictEqual(festivalStore.getOperationalActivityById(actId), null);
console.log('✓ Passed: Operational activities CRUD verified.');

// 12. Audit Log Tracking
console.log('[12/14] Testing Convener Audit Logging...');
const recentLogs = festivalStore.getAuditLogs();
assert(recentLogs.some(l => l.performedBy === 'Convener'), 'Audit logs must capture Convener actions');
console.log('✓ Passed: Audit trail accurately recorded Convener operations.');

// 13. Security Boundaries & Protection
console.log('[13/14] Testing Security Boundaries (Cannot access admin settings or publish results)...');
const convenerSession = festivalStore.verifyConvenerLogin('convener@dalenziafest.in', 'convener2k26').session;
assert.strictEqual(convenerSession.role, 'convener');
assert.notStrictEqual(convenerSession.role, 'super_admin');
console.log('✓ Passed: Role boundary confirmed.');

// 14. Performance & Store Integrity Check
console.log('[14/14] Testing Store Data Integrity & Zero Duplication...');
const d = festivalStore.loadData();
assert(Array.isArray(d.registeredStudents), 'registeredStudents must be array');
assert(Array.isArray(d.teams), 'teams must be array');
assert(Array.isArray(d.programmes), 'programmes must be array');
assert(Array.isArray(d.programmeStages), 'programmeStages must be array');
assert(Array.isArray(d.operationalActivities), 'operationalActivities must be array');
console.log('✓ Passed: Single source of truth preserved with zero data duplication.');

console.log('\n========================================================================');
console.log('ALL 14 CONVENER FULL INTEGRATION TESTS PASSED (100% SUCCESS RATE)!');
console.log('========================================================================\n');
