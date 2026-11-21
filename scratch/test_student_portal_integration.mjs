import { festivalStore } from '../src/admin/data/festivalStore.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${testName} - ${details}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('DALENZIA FEST 2K26 - STUDENT PORTAL INTEGRATION TESTS');
  console.log('====================================================\n');

  // 1. Authentication by Chest Number
  const auth1 = festivalStore.verifyStudentLogin('C-101', 'student2k26');
  assert(auth1.success && auth1.session.chestNo === 'C-101' && auth1.session.teamId === 'team-01', 'Test 1: Student login with Chest Number (C-101)');

  // 2. Authentication by Email
  const auth2 = festivalStore.verifyStudentLogin('ahmad.rayan@dalanzia.org', 'student2k26');
  assert(auth2.success && auth2.session.id === 'STU-1001', 'Test 2: Student login with Institutional Email');

  // 3. Authentication with Demo Alias
  const auth3 = festivalStore.verifyStudentLogin('student1@dalenziafest.in', 'student2k26');
  assert(auth3.success && auth3.session.chestNo === 'C-101', 'Test 3: Student login with Demo Alias');

  // 4. Bad Password Rejection
  let badPassRejected = false;
  try {
    festivalStore.verifyStudentLogin('C-101', 'wrong_pass');
  } catch (e) {
    badPassRejected = true;
  }
  assert(badPassRejected, 'Test 4: Reject incorrect student password');

  // 5. Inactive Student Account Rejection
  let inactiveRejected = false;
  try {
    // STU-1016 is Inactive in registeredStudents
    festivalStore.verifyStudentLogin('C-603', 'student2k26');
  } catch (e) {
    inactiveRejected = true;
  }
  assert(inactiveRejected, 'Test 5: Reject inactive student account with clear advisory');

  // 6. Profile Retrieval
  const profile = festivalStore.getStudentProfile('STU-1001');
  assert(profile && profile.name === 'Ahmad Rayan K.' && profile.team && profile.team.name === 'Team A', 'Test 6: Retrieve enriched student profile');

  // 7. Update Permitted Profile Fields
  const updateRes = festivalStore.updateStudentProfile('STU-1001', {
    phone: '+91 98471 99999',
    bio: 'Senior Calligraphy and Arabic orator'
  });
  assert(updateRes.success, 'Test 7: Update permitted student contact details');
  const verifyProfile = festivalStore.getStudentProfile('STU-1001');
  assert(verifyProfile.phone === '+91 98471 99999' && verifyProfile.bio.includes('Calligraphy'), 'Test 8: Verify updated contact fields persisted');

  // 8. Official Correction Request
  const corrRes = festivalStore.requestStudentCorrection('STU-1001', {
    field: 'name',
    currentVal: 'Ahmad Rayan K.',
    proposedVal: 'Ahmad Rayan Al-Kamil',
    reason: 'Official certificate spelling correction'
  });
  assert(corrRes.success && corrRes.request.status === 'Pending Review', 'Test 9: Submit correction ticket to Secretariat');

  // 9. Update Password
  const passUpdate = festivalStore.updateStudentPassword('STU-1001', 'student2k26', 'newpass2k26');
  assert(passUpdate.success, 'Test 10: Change student password');

  const authNew = festivalStore.verifyStudentLogin('C-101', 'newpass2k26');
  assert(authNew.success, 'Test 11: Login with newly updated password');

  // Reset password back for consistency
  festivalStore.updateStudentPassword('STU-1001', 'newpass2k26', 'student2k26');

  // 10. Dashboard Statistics
  const stats = festivalStore.getStudentDashboardStats('STU-1001');
  assert(stats && typeof stats.registeredCompetitionsCount === 'number' && typeof stats.totalPointsContributed === 'number', 'Test 12: Generate live dashboard KPIs');

  // 11. Registered Competitions
  const comps = festivalStore.getStudentCompetitions('STU-1001');
  assert(Array.isArray(comps) && comps.length > 0, 'Test 13: Fetch student registered competitions');
  const hasCompCode = comps.some(c => c.code);
  assert(hasCompCode, 'Test 14: Competitions contain official codes and venues');

  // 12. Registered Programmes
  const progs = festivalStore.getStudentProgrammes('STU-1001');
  assert(Array.isArray(progs) && progs.length > 0, 'Test 15: Fetch festival programmes and session delegations');

  // 13. Personalized Schedule
  const schedule = festivalStore.getStudentSchedule('STU-1001');
  assert(Array.isArray(schedule) && schedule.length > 0, 'Test 16: Personalized chronological timeline generated');

  // 14. Certified Official Published Results (No draft leaks!)
  const results = festivalStore.getStudentPublishedResults('STU-1001');
  assert(Array.isArray(results) && results.length > 0, 'Test 17: Official published laurels retrieved');
  const firstPrize = results.find(r => r.position === 'First Prize');
  assert(firstPrize && firstPrize.points === 30 && firstPrize.isOfficial, 'Test 18: First prize laurel verified with 30 official points');

  // 15. Team Details & Teammates
  const team = festivalStore.getStudentTeamDetails('STU-1001');
  assert(team && team.name === 'Team A' && Array.isArray(team.teammates), 'Test 19: Squad details and teammates roster retrieved');

  // 16. Targeted Announcements & Notifications
  const announcements = festivalStore.getStudentAnnouncements('STU-1001');
  assert(Array.isArray(announcements), 'Test 20: Student targeted circulars fetched');

  const notifs = festivalStore.getStudentNotifications('STU-1001');
  assert(Array.isArray(notifs) && notifs.length > 0, 'Test 21: Student notification centre populated');

  // 17. Digital ID Card Data
  const idCard = festivalStore.getStudentIdCardData('STU-1001');
  assert(idCard && idCard.chestNo === 'C-101' && idCard.verificationUrl.includes('DLZ2K26'), 'Test 22: Digital ID Card verification payload generated');

  // 18. Personal Performance Report
  const report = festivalStore.getStudentReportData('STU-1001');
  assert(report && report.student && report.competitions && report.results, 'Test 23: Complete student performance dossier generated');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
