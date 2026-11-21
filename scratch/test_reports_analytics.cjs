const assert = require('assert');
const { festivalStore } = require('../src/admin/data/festivalStore.js');

console.log('========================================================================');
console.log('DALENZIA FEST 2K26 - STEP 12 REPORTS & ANALYTICS TEST SUITE');
console.log('========================================================================');

// Test 1: Analytics Overview - Festival Totals
console.log('[1/20] Testing getFestivalAnalyticsOverview() festival totals...');
const overview = festivalStore.getFestivalAnalyticsOverview();
assert(overview.festivalOverview, 'festivalOverview missing');
assert.strictEqual(overview.festivalOverview.totalStudents, 17, 'Total students should be 17');
assert.strictEqual(overview.festivalOverview.totalTeams, 12, 'Total teams should be 12');
assert.strictEqual(overview.festivalOverview.totalCompetitions, 12, 'Total competitions should be 12');
assert.strictEqual(overview.festivalOverview.totalProgrammes, 12, 'Total programmes should be 12');
assert.strictEqual(overview.festivalOverview.totalJudges, 18, 'Total judges should be 18');
assert.strictEqual(overview.festivalOverview.totalProgrammeGuests, 8, 'Total guests should be 8');
assert.strictEqual(overview.festivalOverview.totalPublishedResults, 2, 'Total published results should be 2');
assert.strictEqual(overview.festivalOverview.totalGalleryMedia, 18, 'Total gallery media should be 18');
console.log('✓ Passed: All festival totals match actual system records.');

// Test 2: Analytics Overview - Competition Statistics
console.log('[2/20] Testing competition overview metrics...');
assert(overview.competitionOverview.totalRegistrations > 0, 'Total registrations should be > 0');
assert.strictEqual(overview.competitionOverview.publishedResults, 2, 'Published results should be 2');
assert(overview.competitionOverview.categories.length >= 5, 'Should have 5 competition categories');
console.log('✓ Passed: Competition overview metrics verified.');

// Test 3: Analytics Overview - Programme Statistics
console.log('[3/20] Testing programme overview metrics...');
assert.strictEqual(overview.programmeOverview.totalProgrammes, 12, 'Total programmes should be 12');
assert(overview.programmeOverview.scheduledProgrammes >= 10, 'Scheduled programmes should be >= 10');
assert(overview.programmeOverview.categories.length > 0, 'Programme categories should exist');
console.log('✓ Passed: Programme overview metrics verified.');

// Test 4: Analytics Overview - Team Statistics
console.log('[4/20] Testing team overview metrics...');
assert.strictEqual(overview.teamOverview.totalTeamPoints, 19580, 'Total team points should be 19580');
assert.strictEqual(overview.teamOverview.rankedTeams.length, 12, 'Should have 12 ranked teams');
assert.strictEqual(overview.teamOverview.firstPositionsAwarded, 2, 'First positions awarded should be 2');
assert.strictEqual(overview.teamOverview.secondPositionsAwarded, 2, 'Second positions awarded should be 2');
assert.strictEqual(overview.teamOverview.thirdPositionsAwarded, 2, 'Third positions awarded should be 2');
assert.strictEqual(overview.teamOverview.topTeam.code, 'TA001', 'Top team should be TA001 (Team A)');
console.log('✓ Passed: Team overview metrics verified.');

// Test 5: Team Performance Reports - Default Ranking
console.log('[5/20] Testing getTeamPerformanceReports() official ranking...');
const teamReports = festivalStore.getTeamPerformanceReports();
assert.strictEqual(teamReports.length, 12, 'Should return 12 team reports');
assert.strictEqual(teamReports[0].currentRank, 1, 'First team must have rank 1');
assert.strictEqual(teamReports[0].teamCode, 'TA001', 'First team must be TA001');
assert.strictEqual(teamReports[0].totalPoints, 2840, 'Team A points should be 2840');
console.log('✓ Passed: Team ranking matches official scoring engine.');

// Test 6: Team Performance Reports - Team Filtering
console.log('[6/20] Testing team filtering in getTeamPerformanceReports()...');
const teamBReports = festivalStore.getTeamPerformanceReports({ teamId: 'team-02' });
assert.strictEqual(teamBReports.length, 1, 'Should return exactly 1 team');
assert.strictEqual(teamBReports[0].teamName, 'Team B', 'Should be Team B');
console.log('✓ Passed: Team filter works accurately.');

// Test 7: Team Performance Reports - Search & Sort
console.log('[7/20] Testing team search and sorting...');
const searchedTeams = festivalStore.getTeamPerformanceReports({ search: 'Areekode' });
assert(searchedTeams.length >= 1, 'Search by subname should return results');
const sortedByName = festivalStore.getTeamPerformanceReports({ sortBy: 'name_asc' });
assert(sortedByName[0].teamName.localeCompare(sortedByName[1].teamName) <= 0, 'Sorting by name works');
console.log('✓ Passed: Team search and sorting verified.');

// Test 8: Student Performance Reports - All Students
console.log('[8/20] Testing getStudentPerformanceReports() student list...');
const studentReports = festivalStore.getStudentPerformanceReports();
assert.strictEqual(studentReports.length, 17, 'Should return 17 student reports');
console.log('✓ Passed: All 17 students retrieved with registration records.');

// Test 9: Student Performance Reports - Laureates and Awards
console.log('[9/20] Testing student prize linkage with official published results...');
const rayan = studentReports.find(s => s.chestNo === 'C-101');
assert(rayan, 'Student C-101 should exist');
assert(rayan.prizesCount >= 1, 'Rayan should have at least 1 prize');
assert(rayan.results.some(r => r.position.includes('1st Prize')), 'Rayan should have 1st prize');
assert(rayan.totalPoints >= 30, 'Rayan should have at least 30 points');
console.log('✓ Passed: Student prizes and points match official published posters.');

// Test 10: Student Performance Reports - Filters
console.log('[10/20] Testing student filters (team, category, status, search)...');
const teamAStudents = festivalStore.getStudentPerformanceReports({ teamId: 'team-01' });
assert(teamAStudents.every(s => s.teamId === 'team-01'), 'Team filter works for students');
const awardedStudents = festivalStore.getStudentPerformanceReports({ resultStatus: 'awarded' });
assert(awardedStudents.every(s => s.prizesCount > 0), 'Awarded filter works');
const searchedStudent = festivalStore.getStudentPerformanceReports({ search: 'Sinan' });
assert(searchedStudent.length >= 1 && searchedStudent[0].name.includes('Sinan'), 'Search by student name works');
console.log('✓ Passed: Student filters work accurately.');

// Test 11: Competition Reports - Catalog
console.log('[11/20] Testing getCompetitionReports()...');
const compReports = festivalStore.getCompetitionReports();
assert.strictEqual(compReports.length, 12, 'Should return 12 competition reports');
const litComp = compReports.find(c => c.code === 'LIT-JR-102');
assert(litComp, 'LIT-JR-102 should exist');
assert.strictEqual(litComp.evaluationStatus, 'Published', 'LIT-JR-102 should be Published');
assert.strictEqual(litComp.winners.length, 3, 'LIT-JR-102 should have 3 winners');
console.log('✓ Passed: Competition report returns accurate evaluation and winner details.');

// Test 12: Competition Reports - Category & Status Filtering
console.log('[12/20] Testing competition filtering...');
const litComps = festivalStore.getCompetitionReports({ category: 'Literary Arena' });
assert(litComps.every(c => c.category === 'Literary Arena'), 'Category filter works');
const publishedComps = festivalStore.getCompetitionReports({ status: 'Published' });
assert(publishedComps.every(c => c.isPublished), 'Status filter works');
console.log('✓ Passed: Competition filtering verified.');

// Test 13: Judge Activity Reports - Progress & Status
console.log('[13/20] Testing getJudgeActivityReports()...');
const judgeReports = festivalStore.getJudgeActivityReports();
assert.strictEqual(judgeReports.length, 18, 'Should return 18 judge reports');
const munawwar = judgeReports.find(j => j.judgeId === 'JDG-1001');
assert(munawwar, 'Judge JDG-1001 should exist');
assert.strictEqual(munawwar.assignedCount, 2, 'Assigned count should be 2');
assert.strictEqual(munawwar.submittedCount, 1, 'Submitted count should be 1');
assert.strictEqual(munawwar.completionPercentage, 50, 'Completion percentage should be 50%');
assert.strictEqual(munawwar.completionStatus, 'In Progress', 'Status should be In Progress');
console.log('✓ Passed: Judge evaluation progress calculated accurately.');

// Test 14: Judge Activity Reports - Status Filtering
console.log('[14/20] Testing judge status filtering and search...');
const inProgressJudges = festivalStore.getJudgeActivityReports({ status: 'In Progress' });
assert(inProgressJudges.every(j => j.completionStatus === 'In Progress'), 'In Progress judge filter works');
const searchedJudge = festivalStore.getJudgeActivityReports({ search: 'Majeed' });
assert(searchedJudge.length >= 1 && searchedJudge[0].name.includes('Majeed'), 'Judge search works');
console.log('✓ Passed: Judge activity filtering verified.');

// Test 15: Programme Reports - Overview & Category Distribution
console.log('[15/20] Testing getProgrammeReports()...');
const progReports = festivalStore.getProgrammeReports();
assert.strictEqual(progReports.length, 12, 'Should return 12 programme reports');
const filteredByVenue = festivalStore.getProgrammeReports({ venue: 'Cordova' });
assert(filteredByVenue.every(p => p.venue.includes('Cordova')), 'Venue filter works');
console.log('✓ Passed: Programme reports and venue filtering verified.');

// Test 16: Result & Scoring Reports - Winner Aggregation
console.log('[16/20] Testing getResultScoringReports()...');
const resultReports = festivalStore.getResultScoringReports();
assert.strictEqual(resultReports.publishedResultsCount, 2, 'Published results count should be 2');
assert.strictEqual(resultReports.winnersList.length, 6, 'Total winners across 2 published competitions should be 6');
assert.strictEqual(resultReports.teamLeaderboard.length, 12, 'Team leaderboard should have 12 teams');
console.log('✓ Passed: Results & Scoring report verified.');

// Test 17: Festival Activity Reports - Activity Metrics
console.log('[17/20] Testing getFestivalActivityReports()...');
const activityReports = festivalStore.getFestivalActivityReports();
assert(activityReports.stats, 'Activity stats should exist');
assert.strictEqual(activityReports.stats.totalStudentsEnrolled, 17, 'Students enrolled should be 17');
assert.strictEqual(activityReports.stats.totalCompetitionsConfigured, 12, 'Competitions should be 12');
assert.strictEqual(activityReports.stats.totalProgrammesScheduled, 12, 'Programmes should be 12');
assert(activityReports.recentAuditTrail.length > 0, 'Audit trail should have records');
console.log('✓ Passed: Festival activity reports verified.');

// Test 18: Non-Destructive Invariance Test
console.log('[18/20] Testing non-destructive data invariance...');
const originalPoints = festivalStore.getTeams().map(t => ({ id: t.id, points: t.points, rank: t.rank }));
// Run all report calls
festivalStore.getFestivalAnalyticsOverview();
festivalStore.getTeamPerformanceReports();
festivalStore.getStudentPerformanceReports();
festivalStore.getCompetitionReports();
festivalStore.getJudgeActivityReports();
festivalStore.getProgrammeReports();
festivalStore.getResultScoringReports();
festivalStore.getFestivalActivityReports();
const currentPoints = festivalStore.getTeams().map(t => ({ id: t.id, points: t.points, rank: t.rank }));
assert.deepStrictEqual(originalPoints, currentPoints, 'Analytics MUST NOT modify team points or ranks!');
console.log('✓ Passed: Invariance verified. Official competition scores and ranks are completely untouched.');

// Test 19: Privacy & Role Sandboxing
console.log('[19/20] Testing privacy boundaries (no judge mark leaks in reports)...');
const judgeActivity = festivalStore.getJudgeActivityReports();
judgeActivity.forEach(j => {
  assert.strictEqual(j.scores, undefined, 'Judge activity reports must not expose private rubric score matrices!');
});
console.log('✓ Passed: Adjudication privacy boundaries strictly upheld.');

// Test 20: Performance & Latency Check
console.log('[20/20] Testing computational performance across full reporting suite...');
const t0 = Date.now();
for (let i = 0; i < 10; i++) {
  festivalStore.getFestivalAnalyticsOverview();
  festivalStore.getTeamPerformanceReports();
  festivalStore.getStudentPerformanceReports();
  festivalStore.getCompetitionReports();
  festivalStore.getJudgeActivityReports();
  festivalStore.getProgrammeReports();
  festivalStore.getResultScoringReports();
  festivalStore.getFestivalActivityReports();
}
const elapsed = Date.now() - t0;
console.log(`✓ 10 Full Analytics Sweeps completed in ${elapsed} ms (~${(elapsed / 10).toFixed(2)} ms/run).`);
assert(elapsed < 1000, 'Reporting suite must run under 100ms per complete pass');

console.log('\n========================================================================');
console.log('RESULT: ALL 20 UNIT TESTS PASSED WITH 100% SUCCESS RATE!');
console.log('========================================================================\n');
