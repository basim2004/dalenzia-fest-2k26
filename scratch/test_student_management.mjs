import festivalStore, { INITIAL_REGISTERED_STUDENTS, INITIAL_TEAMS } from '../src/admin/data/festivalStore.js';

console.log('--- 1. Testing Initial Roster & Categories ---');
const initialStats = festivalStore.getStudentStats();
console.log('Initial stats:', {
  total: initialStats.totalStudents,
  senior: initialStats.seniorCount,
  junior: initialStats.juniorCount,
  subJunior: initialStats.subJuniorCount,
  minor: initialStats.minorCount,
  assigned: initialStats.assignedStudents,
  unassigned: initialStats.unassignedStudents,
  active: initialStats.activeStudents
});

console.log('\n--- 2. Testing Register Without Phone Number & Auto Chest & Auto Email ---');
const regResult1 = festivalStore.addStudent({
  name: 'Ahmad Rayan',
  classCategory: 'Senior',
  teamId: 'team-1',
  phone: '', // Optional - empty
  email: '', // Auto-generate
  status: 'Active'
});

console.log('Registered student 1:', {
  id: regResult1.student.id,
  name: regResult1.student.name,
  chestNo: regResult1.student.chestNo,
  category: regResult1.student.classCategory,
  team: regResult1.student.teamName,
  phone: regResult1.student.phone,
  email: regResult1.student.email
});

if (regResult1.student.phone !== '') {
  throw new Error('FAILED: Phone should be empty string when omitted!');
}
if (!regResult1.student.chestNo.startsWith('C-')) {
  throw new Error('FAILED: Chest number was not generated!');
}
if (regResult1.student.email !== 'ahmad.rayan@dalanzia.org') {
  throw new Error(`FAILED: Email expected ahmad.rayan@dalanzia.org but got ${regResult1.student.email}`);
}
console.log('PASSED: Register without phone & auto email & auto chest');

console.log('\n--- 3. Testing Duplicate Name Generates Unique Email ---');
const regResult2 = festivalStore.addStudent({
  name: 'Ahmad Rayan',
  classCategory: 'Junior',
  teamId: 'team-2',
  phone: ' ',
  email: '',
  status: 'Active'
});

console.log('Registered student 2 (duplicate name):', {
  id: regResult2.student.id,
  name: regResult2.student.name,
  chestNo: regResult2.student.chestNo,
  category: regResult2.student.classCategory,
  email: regResult2.student.email
});

if (regResult2.student.email !== 'ahmad.rayan.2@dalanzia.org') {
  throw new Error(`FAILED: Duplicate name email expected ahmad.rayan.2@dalanzia.org but got ${regResult2.student.email}`);
}
if (regResult2.student.chestNo === regResult1.student.chestNo) {
  throw new Error('FAILED: Duplicate chest numbers generated!');
}
console.log('PASSED: Unique email for duplicate names & unique chest numbers');

console.log('\n--- 4. Testing Duplicate Chest Number Prevention ---');
let caughtDupError = false;
try {
  festivalStore.addStudent({
    name: 'Test Duplicate',
    chestNo: regResult1.student.chestNo, // Duplicate manual chest
    classCategory: 'Sub Junior',
    phone: '',
    email: '',
    status: 'Active'
  });
} catch (err) {
  caughtDupError = true;
  console.log('Caught expected duplicate chest error:', err.message);
}
if (!caughtDupError) {
  throw new Error('FAILED: Duplicate chest number was allowed!');
}
console.log('PASSED: Duplicate chest number prevented');

console.log('\n--- 5. Testing All 4 Official Categories & Live Stats Updates ---');
const regResultSubJunior = festivalStore.addStudent({
  name: 'Zameel Rahman',
  classCategory: 'Sub Junior',
  teamId: '',
  phone: '',
  email: '',
  status: 'Active'
});

const regResultMinor = festivalStore.addStudent({
  name: 'Faris Ali',
  classCategory: 'Minor',
  teamId: 'team-1',
  phone: '',
  email: '',
  status: 'Active'
});

const updatedStats = festivalStore.getStudentStats();
console.log('Updated stats after adding students:', {
  total: updatedStats.totalStudents,
  senior: updatedStats.seniorCount,
  junior: updatedStats.juniorCount,
  subJunior: updatedStats.subJuniorCount,
  minor: updatedStats.minorCount,
  assigned: updatedStats.assignedStudents,
  unassigned: updatedStats.unassignedStudents,
  active: updatedStats.activeStudents
});

if (updatedStats.seniorCount !== initialStats.seniorCount + 1) throw new Error('Senior count failed');
if (updatedStats.juniorCount !== initialStats.juniorCount + 1) throw new Error('Junior count failed');
if (updatedStats.subJuniorCount !== initialStats.subJuniorCount + 1) throw new Error('Sub Junior count failed');
if (updatedStats.minorCount !== initialStats.minorCount + 1) throw new Error('Minor count failed');
console.log('PASSED: All 4 categories update stats dynamically');

console.log('\n--- 6. Testing Add / Update Phone Number Later ---');
console.log('Before phone update, student 1 phone is:', regResult1.student.phone);
const phoneUpdateResult = festivalStore.updateStudentPhone(regResult1.student.id, '+91 98471 23456');
const refreshedStudent1 = festivalStore.getStudentById(regResult1.student.id);
console.log('After phone update, student 1 phone is:', refreshedStudent1.phone);

if (refreshedStudent1.phone !== '+91 98471 23456') {
  throw new Error('FAILED: Phone number update failed!');
}
console.log('PASSED: Phone number added/updated successfully on existing record');

console.log('\n--- 7. Testing Team Squad Synchronization ---');
const team1 = festivalStore.getTeamById('team-1');
console.log('Team 1 member count:', team1.members, 'students in squad:', team1.students.length);
if (!team1.students.some(s => s.id === regResult1.student.id)) {
  throw new Error('FAILED: Student 1 was not added to Team 1 squad!');
}
console.log('PASSED: Team squad synced with student registration');

console.log('\n=============================================');
console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
console.log('=============================================');
