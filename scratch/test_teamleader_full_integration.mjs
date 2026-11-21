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
  console.log('DALENZIA FEST 2K26 - TEAM LEADER FULL INTEGRATION TESTS');
  console.log('====================================================\n');

  // 1. Authentication
  const auth1 = festivalStore.verifyTeamLeaderLogin('leader1@dalenziafest.in', 'leader2k26');
  assert(auth1.success && auth1.session.teamId === 'team-01', 'Test 1: Login with email for Team 01');

  const auth2 = festivalStore.verifyTeamLeaderLogin('leader2', 'leader2k26');
  assert(auth2.success && auth2.session.teamId === 'team-02', 'Test 2: Login with username for Team 02');

  let authBadSuccess = false;
  try {
    const authBad = festivalStore.verifyTeamLeaderLogin('leader1@dalenziafest.in', 'wrong_pass');
    authBadSuccess = authBad.success;
  } catch (err) {
    authBadSuccess = false;
  }
  assert(!authBadSuccess, 'Test 3: Reject incorrect password with error or failure');

  // 2. Profile & Team isolation
  const profile1 = festivalStore.getTeamLeaderProfile('team-01');
  assert(profile1 && profile1.teamName === 'Team A', 'Test 4: Team 01 Profile returns Team A');

  const stats1 = festivalStore.getTeamLeaderDashboardStats('team-01');
  assert(stats1 && typeof stats1.totalTeamStudents === 'number' && typeof stats1.currentTeamPoints === 'number', 'Test 5: Dashboard statistics structure valid');

  // 3. Search Central Students for Team
  const searchResults = festivalStore.searchAvailableStudentsForTeam('team-01', '');
  assert(Array.isArray(searchResults) && searchResults.length > 0, 'Test 6: Central student search returns candidates');

  const initialStudentCount = festivalStore.getStudents().filter(s => s.teamId === 'team-01').length;
  const totalStudentsBefore = festivalStore.getStudents().length;

  // Find a student not in team-01 to assign
  const candidate = festivalStore.getStudents().find(s => s.teamId !== 'team-01');
  if (candidate) {
    const candidateId = candidate.id;
    const originalTeam = candidate.teamId;

    // 4. Assign student to Team A
    const assignRes = festivalStore.assignStudentToTeamLeaderTeam('team-01', candidateId);
    assert(assignRes.success, 'Test 7: Assign existing student to Team A succeeds');

    const totalStudentsAfter = festivalStore.getStudents().length;
    assert(totalStudentsBefore === totalStudentsAfter, 'Test 8: ZERO DUPLICATE student records created (total count unchanged)');

    const updatedStudent = festivalStore.getStudentById(candidateId);
    assert(updatedStudent && updatedStudent.teamId === 'team-01', 'Test 9: Student teamId updated to team-01 in central collection');

    // 5. Remove student from Team A
    const removeRes = festivalStore.removeStudentFromTeamLeaderTeam('team-01', candidateId, 'Roster balancing');
    assert(removeRes.success, 'Test 10: Remove student from team succeeds');

    const studentAfterRemove = festivalStore.getStudentById(candidateId);
    assert(studentAfterRemove && (studentAfterRemove.teamId === null || studentAfterRemove.teamId === 'unassigned'), 'Test 11: Removed student marked unassigned');
  }

  // 6. Competition Registration List
  const availableComps = festivalStore.getTeamCompetitionsForRegistration('team-01');
  assert(Array.isArray(availableComps) && availableComps.length > 0, 'Test 12: Team gets competition registration catalog');

  // 7. Individual Competition Registration
  let openComp = availableComps.find(c => c.canRegister);
  if (!openComp) {
    // If all were evaluated in prior tests, reset or ensure one is open
    const compToOpen = availableComps[0];
    const rawAssignment = (festivalStore.data.programmeAssignments || []).find(a => a.id === compToOpen.id);
    if (rawAssignment) {
      rawAssignment.status = 'Draft';
      rawAssignment.isOfficialPublished = false;
      openComp = compToOpen;
    }
  }

  const team1Students = festivalStore.getStudents().filter(s => s.teamId === 'team-01');
  
  if (openComp && team1Students.length > 0) {
    let studentToReg = team1Students.find(s => !(openComp.participants || []).some(p => p.studentId === s.id));
    if (!studentToReg) {
      // If all team students were registered, cancel one first or use first
      const first = team1Students[0];
      festivalStore.cancelTeamStudentCompetitionRegistration({
        teamId: 'team-01',
        competitionId: openComp.id,
        studentId: first.id
      });
      studentToReg = first;
    }

    const regRes = festivalStore.registerTeamStudentForCompetition({
      teamId: 'team-01',
      competitionId: openComp.id,
      studentIds: [studentToReg.id],
      entryType: 'individual',
      notes: 'Test individual entry'
    });
    assert(regRes.success, `Test 13: Register student for individual competition ${openComp.id}`);

    // Duplicate registration check
    let dupPrevented = false;
    try {
      festivalStore.registerTeamStudentForCompetition({
        teamId: 'team-01',
        competitionId: openComp.id,
        studentIds: [studentToReg.id],
        entryType: 'individual'
      });
    } catch (e) {
      dupPrevented = true;
    }
    assert(dupPrevented, 'Test 14: Duplicate competition registration correctly prevented');

    // Cancel registration
    const cancelRes = festivalStore.cancelTeamStudentCompetitionRegistration({
      teamId: 'team-01',
      competitionId: openComp.id,
      studentId: studentToReg.id
    });
    assert(cancelRes.success, 'Test 15: Cancellation of competition registration succeeds');
  }

  // 8. Programme Registration
  const progs = festivalStore.getTeamProgrammesForRegistration('team-01');
  assert(Array.isArray(progs) && progs.length > 0, 'Test 16: Programmes registration list fetched');

  if (progs.length > 0 && team1Students.length > 0) {
    const prog = progs[0];
    const progRegRes = festivalStore.registerTeamStudentForProgramme({
      teamId: 'team-01',
      programmeId: prog.id,
      studentIds: [team1Students[0].id],
      notes: 'Team A Official Delegate'
    });
    assert(progRegRes.success, 'Test 17: Programme student registration succeeds');
  }

  // 9. Official Published Results Isolation
  const teamResults = festivalStore.getTeamOfficialPublishedResults('team-01');
  assert(Array.isArray(teamResults), 'Test 18: Official published results accessible for team');
  // Check that all results have status Published or verified
  const allPublished = teamResults.every(r => r.status === 'Published' || r.status === 'Verified' || r.isOfficial);
  assert(allPublished, 'Test 19: All returned team results are certified official (no draft marks leaked)');

  // 10. Announcements
  const announcements = festivalStore.getTeamAnnouncements('team-01');
  assert(Array.isArray(announcements), 'Test 20: Team targeted announcements fetched');

  // 11. Reports Dossier
  const reportData = festivalStore.getTeamReportsData('team-01');
  assert(reportData && reportData.team && (reportData.students || reportData.roster) && reportData.results, 'Test 21: Full dossier reports export bundle generated');

  // 12. Profile Updates
  const updateProfile = festivalStore.updateTeamLeaderProfile('team-01', {
    phone: '+91 98470 11111',
    bio: 'Champion Team A Leader'
  });
  assert(updateProfile.success, 'Test 22: Team Leader profile update succeeds');

  const checkProfile = festivalStore.getTeamLeaderProfile('team-01');
  assert(checkProfile.phone === '+91 98470 11111', 'Test 23: Team Leader phone verified after update');

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
