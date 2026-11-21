const assert = require('assert');
const { festivalStore } = require('../src/admin/data/festivalStore.js');

console.log('Testing Convener Store Methods...');

// Test 1: verifyConvenerLogin
console.log('1. Testing verifyConvenerLogin...');
const loginRes = festivalStore.verifyConvenerLogin('convener@dalenziafest.in', 'convener2k26');
assert.strictEqual(loginRes.success, true, 'Convener login should succeed with valid credentials');
assert.strictEqual(loginRes.session.role, 'convener');
assert.strictEqual(loginRes.session.user, 'Usthad Hashir Ali');

const invalidLogin = festivalStore.verifyConvenerLogin('convener@dalenziafest.in', 'wrongpass');
assert.strictEqual(invalidLogin.success, false, 'Invalid password should fail');
console.log('✓ verifyConvenerLogin passed.');

// Test 2: getConvenerDashboardStats
console.log('2. Testing getConvenerDashboardStats...');
const stats = festivalStore.getConvenerDashboardStats();
assert.strictEqual(stats.totalStudents, 17);
assert.strictEqual(stats.totalTeams, 12);
assert.strictEqual(stats.totalProgrammes, 12);
assert.strictEqual(stats.totalCompetitions, 12);
assert.strictEqual(stats.totalJudges, 18);
assert.strictEqual(stats.totalGuests, 8);
assert.strictEqual(stats.totalStages, 5);
assert.strictEqual(stats.totalActivities, 6);
assert(stats.operationalAlerts.length >= 3);
console.log('✓ getConvenerDashboardStats passed.');

// Test 3: Stage Management
console.log('3. Testing Stage Management methods...');
const addStageRes = festivalStore.addProgrammeStage({
  name: 'Mini Conference Arena',
  shortName: 'Mini Conf Arena',
  capacity: 150,
  type: 'Seminar Hall'
}, 'Convener');
assert.strictEqual(addStageRes.success, true);
assert(addStageRes.stage.id.startsWith('STG-'));

const updateStageRes = festivalStore.updateProgrammeStage(addStageRes.stage.id, {
  capacity: 200
}, 'Convener');
assert.strictEqual(updateStageRes.stage.capacity, 200);

const toggleStageRes = festivalStore.toggleProgrammeStageStatus(addStageRes.stage.id, 'Convener');
assert.strictEqual(toggleStageRes.stage.status, 'Maintenance');

const deleteStageRes = festivalStore.deleteProgrammeStage(addStageRes.stage.id, 'Convener');
assert.strictEqual(deleteStageRes.success, true);
console.log('✓ Stage Management methods passed.');

// Test 4: Operational Activities Management
console.log('4. Testing Operational Activities methods...');
const acts = festivalStore.getOperationalActivities();
assert.strictEqual(acts.length, 6);

const addActRes = festivalStore.addOperationalActivity({
  title: 'Stage Microphone Sound Check',
  category: 'Technical & Stage',
  responsiblePerson: 'Er. Niyas V.'
}, 'Convener');
assert.strictEqual(addActRes.success, true);
assert(addActRes.activity.id.startsWith('ACT-'));

const updateActRes = festivalStore.updateOperationalActivity(addActRes.activity.id, {
  status: 'In Progress'
}, 'Convener');
assert.strictEqual(updateActRes.activity.status, 'In Progress');

const deleteActRes = festivalStore.deleteOperationalActivity(addActRes.activity.id, 'Convener');
assert.strictEqual(deleteActRes.success, true);
console.log('✓ Operational Activities methods passed.');

console.log('\nALL CONVENER STORE TESTS PASSED (100%)!\n');
