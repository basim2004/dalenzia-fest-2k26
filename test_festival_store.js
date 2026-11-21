import { festivalStore } from './src/admin/data/festivalStore.js';

console.log('--- Testing festivalStore with Charter Rules ---');

// 1. Categories
const categories = festivalStore.getProgrammeCategories();
console.log('1. Categories Count:', categories.length);
console.log('Categories:', categories.map(c => c.name));
if (categories.length !== 5) throw new Error('Expected 5 official categories!');

// 2. Programmes
const masterProgs = festivalStore.getProgrammeMaster();
console.log('2. Programme Master Count:', masterProgs.length);
if (masterProgs.length !== 83) throw new Error(`Expected 83 official programmes, found ${masterProgs.length}`);

const byCat = {};
masterProgs.forEach(p => {
  byCat[p.category] = (byCat[p.category] || 0) + 1;
});
console.log('Programmes by Category:', byCat);
if (byCat['Minor'] !== 18 || byCat['Sub-Junior'] !== 19 || byCat['Junior'] !== 18 || byCat['Senior'] !== 17 || byCat['General'] !== 11) {
  throw new Error('Programme counts per category do not match Charter!');
}

// 3. Teams
const teams = festivalStore.getTeams();
console.log('3. Teams:', teams.map(t => `${t.id}: ${t.name} (${t.color})`));
const dazzlers = teams.find(t => t.name === 'Dazzlers');
const dynamos = teams.find(t => t.name === 'Dynamos');
if (!dazzlers || !dynamos) throw new Error('Teams must be Dazzlers and Dynamos!');

// 4. Scoring Rules
const scoring = festivalStore.getScoringRules();
console.log('4. Scoring Rules:', scoring);
if (scoring.individual.first !== 3 || scoring.individual.second !== 2 || scoring.individual.third !== 1) {
  throw new Error('Individual position points must be 3, 2, 1!');
}
if (scoring.group.first !== 10 || scoring.group.second !== 8 || scoring.group.third !== 6) {
  throw new Error('Group position points must be 10, 8, 6!');
}
if (scoring.isGradePointsActive !== false) {
  throw new Error('Grade points must be inactive initially!');
}

// 5. Registration Limits Testing
console.log('5. Testing Registration Limits...');
const minorComp = masterProgs.find(p => p.category === 'Minor');
const seniorStudent = festivalStore.getRegisteredStudents().find(s => s.classCategory === 'Senior');
const minorStudent = festivalStore.getRegisteredStudents().find(s => s.classCategory === 'Minor');

// Test category mismatch
try {
  festivalStore.registerParticipantForCompetition(minorComp.id, seniorStudent.id);
  throw new Error('Should have failed category mismatch!');
} catch (e) {
  console.log('Category mismatch caught successfully:', e.message);
}

// Test valid registration
const regRes = festivalStore.registerParticipantForCompetition(minorComp.id, minorStudent.id);
console.log('Valid registration success:', regRes.success);

// Test duplicate registration
try {
  festivalStore.registerParticipantForCompetition(minorComp.id, minorStudent.id);
  throw new Error('Should have failed duplicate check!');
} catch (e) {
  console.log('Duplicate check caught successfully:', e.message);
}

// 6. Test Grade Point Activation requires Admin Confirmation
try {
  festivalStore.updateScoringConfig({ isGradePointsActive: true }, { adminConfirmation: false });
  throw new Error('Should have failed without admin confirmation!');
} catch (e) {
  console.log('Admin confirmation check caught successfully:', e.message);
}

// Clean up test registration
festivalStore.removeParticipantFromCompetition(minorComp.id, minorStudent.id);

console.log('ALL FESTIVAL STORE CHARTER TESTS PASSED!');
