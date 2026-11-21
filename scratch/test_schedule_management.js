import { festivalStore } from '../src/admin/data/festivalStore.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('====================================================');
console.log('DALENZIA FEST 2K26 - PROGRAMME SCHEDULE MODULE TESTS');
console.log('====================================================');

// Test 1: Stage Retrieval
console.log('\n[1] Testing Official Festival Stages:');
const stages = festivalStore.getProgrammeStages();
assert(Array.isArray(stages) && stages.length >= 5, `Retrieved ${stages.length} official stages (expected >= 5)`);
const cordovaStage = stages.find(s => s.name.includes('Cordova Grand Stage'));
assert(cordovaStage && cordovaStage.capacity >= 2000, `Found Cordova Grand Stage with capacity ${cordovaStage?.capacity}`);

// Test 2: Initial Schedule Retrieval & Enrichment
console.log('\n[2] Testing Initial Programme Schedule Retrieval:');
const allSchedules = festivalStore.getProgrammeSchedules();
assert(Array.isArray(allSchedules) && allSchedules.length >= 12, `Retrieved ${allSchedules.length} schedule entries (expected >= 12)`);

// Verify enrichment with programme and guests
const enrichedFirst = allSchedules[0];
assert(enrichedFirst.programmeTitle && enrichedFirst.programmeTitle.length > 0, `Schedule has enriched title: "${enrichedFirst.programmeTitle}"`);
assert(enrichedFirst.stage && enrichedFirst.stage.length > 0, `Schedule has venue: "${enrichedFirst.stage}"`);

// Verify chronological sorting
const day1List = festivalStore.getProgrammeSchedules({ date: 'Dec 21, 2026', sortBy: 'time' });
assert(day1List.length >= 6, `Found ${day1List.length} Day 1 schedule sessions`);
let isChronological = true;
for (let i = 0; i < day1List.length - 1; i++) {
  const tA = festivalStore._parseTimeToMinutes(day1List[i].startTime) || 0;
  const tB = festivalStore._parseTimeToMinutes(day1List[i + 1].startTime) || 0;
  if (tA > tB) {
    isChronological = false;
    break;
  }
}
assert(isChronological, 'Day 1 sessions are strictly chronologically sorted by start time');

// Test 3: Schedule Dashboard Statistics
console.log('\n[3] Testing Schedule Dashboard Stats:');
const stats = festivalStore.getScheduleDashboardStats();
assert(typeof stats.totalScheduledSessions === 'number' && stats.totalScheduledSessions >= 12, `Total scheduled sessions: ${stats.totalScheduledSessions}`);
assert(typeof stats.todayProgrammes === 'number' && stats.todayProgrammes >= 6, `Day 01 sessions: ${stats.todayProgrammes}`);
assert(typeof stats.day2Programmes === 'number' && stats.day2Programmes >= 6, `Day 02 sessions: ${stats.day2Programmes}`);
assert(typeof stats.upcomingProgrammes === 'number', `Upcoming sessions: ${stats.upcomingProgrammes}`);
assert(typeof stats.unscheduledProgrammes === 'number', `Unscheduled programmes: ${stats.unscheduledProgrammes}`);
assert(typeof stats.conflictingScheduleEntries === 'number' && stats.conflictingScheduleEntries === 0, `Initial conflicts: ${stats.conflictingScheduleEntries} (clean baseline)`);

// Test 4: Conflict Detection Engine - Time Range Validation
console.log('\n[4] Testing Conflict Detection: Invalid Time Ranges');
const invalidTimeCheck = festivalStore.detectScheduleConflicts({
  programmeId: 'PRG-001',
  date: 'Dec 21, 2026',
  startTime: '11:00 AM',
  endTime: '09:00 AM', // End time earlier than start time!
  stage: 'Cordova Grand Stage (Stage 01)'
});
assert(invalidTimeCheck.hasErrors, 'Detected error for end time earlier than start time');
assert(invalidTimeCheck.conflicts.some(c => c.type === 'INVALID_TIME_RANGE'), 'Conflict type is INVALID_TIME_RANGE');

// Test 5: Conflict Detection Engine - Outside Festival Dates
console.log('\n[5] Testing Conflict Detection: Outside Festival Dates');
const outsideDateCheck = festivalStore.detectScheduleConflicts({
  programmeId: 'PRG-001',
  date: 'Dec 25, 2026', // Outside festival!
  startTime: '10:00 AM',
  endTime: '12:00 PM',
  stage: 'Cordova Grand Stage (Stage 01)'
});
assert(outsideDateCheck.hasErrors, 'Detected error for date outside festival dates');
assert(outsideDateCheck.conflicts.some(c => c.type === 'OUTSIDE_FESTIVAL_DATES'), 'Conflict type is OUTSIDE_FESTIVAL_DATES');

// Test 6: Conflict Detection Engine - Stage Overlap Conflict
console.log('\n[6] Testing Conflict Detection: Overlapping Stage Bookings');
// Existing: PRG-002 is at Cordova Grand Stage on Dec 21, 09:00 AM – 11:00 AM
const stageOverlapCheck = festivalStore.detectScheduleConflicts({
  programmeId: 'PRG-004',
  date: 'Dec 21, 2026',
  startTime: '09:30 AM', // Overlaps with 09:00 AM - 11:00 AM on Cordova Grand Stage!
  endTime: '10:30 AM',
  stage: 'Cordova Grand Stage (Stage 01)'
});
assert(stageOverlapCheck.hasErrors, 'Detected error for stage double-booking');
assert(stageOverlapCheck.conflicts.some(c => c.type === 'STAGE_OVERLAP'), 'Conflict type is STAGE_OVERLAP');

// Test 7: Conflict Detection Engine - Guest Overlap Conflict
console.log('\n[7] Testing Conflict Detection: Guest Double-Booking');
// Existing: PRG-003 has guest GST-02 on Dec 21, 11:30 AM – 01:00 PM at Al-Farabi Hall
const guestOverlapCheck = festivalStore.detectScheduleConflicts({
  programmeId: 'PRG-004',
  date: 'Dec 21, 2026',
  startTime: '12:00 PM', // Overlaps 11:30 AM - 01:00 PM!
  endTime: '01:30 PM',
  stage: 'Ibn Khaldun Academic Hall (Stage 03)', // Different stage
  assignedGuestIds: ['GST-02'] // Same guest!
});
assert(guestOverlapCheck.hasErrors, 'Detected error for guest simultaneous commitment');
assert(guestOverlapCheck.conflicts.some(c => c.type === 'GUEST_OVERLAP'), 'Conflict type is GUEST_OVERLAP');

// Test 8: Create Schedule Entry & Bi-Directional Programme Sync
console.log('\n[8] Testing Add Programme Schedule & Programme Sync:');
// Create non-conflicting schedule entry for an unbooked slot
const newScheduleRes = festivalStore.addProgrammeSchedule({
  programmeId: 'PRG-001',
  date: 'Dec 22, 2026',
  startTime: '08:00 AM',
  endTime: '08:45 AM',
  stage: 'Media Studio Preview Room',
  stageId: 'STG-04',
  coordinatorName: 'Prof. K.V. Zaid',
  coordinatorPhone: '+91 98470 11223',
  assignedGuestIds: ['GST-01'],
  notes: 'Briefing check-in session for media correspondents and observers.',
  status: 'Scheduled',
  isPublished: true
});

const createdSchedule = newScheduleRes.schedule;
assert(createdSchedule && createdSchedule.id && createdSchedule.id.startsWith('SCH-'), `Created schedule entry with ID: ${createdSchedule?.id}`);
assert(createdSchedule.stage === 'Media Studio Preview Room', 'Stage correctly assigned');

// Verify parent programme was bi-directionally updated
const parentProg = festivalStore.getProgrammeById('PRG-001');
assert(parentProg && parentProg.venue === 'Media Studio Preview Room', 'Parent programme venue synchronized');
assert(parentProg && parentProg.startTime === '08:00 AM', 'Parent programme startTime synchronized');

// Verify conflict block on conflicting entry without override
let caughtConflict = false;
try {
  festivalStore.addProgrammeSchedule({
    programmeId: 'PRG-002',
    date: 'Dec 22, 2026',
    startTime: '08:15 AM', // Overlaps with newly added 08:00 - 08:45 at Media Studio!
    endTime: '09:00 AM',
    stage: 'Media Studio Preview Room',
    stageId: 'STG-04'
  }, { overrideConflicts: false });
} catch (e) {
  caughtConflict = true;
}
assert(caughtConflict, 'Adding overlapping schedule entry threw error when overrideConflicts is false');

// Verify override works when overrideConflicts is true
const overrideRes = festivalStore.addProgrammeSchedule({
  programmeId: 'PRG-002',
  date: 'Dec 22, 2026',
  startTime: '08:15 AM',
  endTime: '09:00 AM',
  stage: 'Media Studio Preview Room',
  stageId: 'STG-04',
  notes: 'Special concurrent multi-session demonstration.'
}, { overrideConflicts: true, adminUser: 'Super Admin' });
assert(overrideRes.success, 'Successfully scheduled with administrative conflict override');

// Test 9: Update Schedule Entry
console.log('\n[9] Testing Update Programme Schedule:');
const updateRes = festivalStore.updateProgrammeSchedule(createdSchedule.id, {
  startTime: '07:30 AM',
  endTime: '08:30 AM',
  notes: 'Updated early morning press briefing window.'
}, { overrideConflicts: true });
assert(updateRes.success, 'Schedule entry updated successfully');
const updatedSchedule = festivalStore.getProgrammeScheduleById(createdSchedule.id);
assert(updatedSchedule.timeRange === '07:30 AM – 08:30 AM', `Time range updated to: ${updatedSchedule.timeRange}`);

// Test 10: Complete Session Workflow
console.log('\n[10] Testing Complete Session Workflow:');
const completeRes = festivalStore.completeProgrammeSchedule(createdSchedule.id, 'Floor Manager');
assert(completeRes.success && completeRes.schedule.status === 'Completed', 'Schedule status marked as Completed');
const completedProg = festivalStore.getProgrammeById(createdSchedule.programmeId);
assert(completedProg.status === 'Completed', 'Parent programme status synchronized to Completed');

// Test 11: Cancel & Reschedule Session Workflow
console.log('\n[11] Testing Cancel & Reschedule Session Workflow:');
const cancelRes = festivalStore.cancelProgrammeSchedule(overrideRes.schedule.id, 'Room maintenance', 'Super Admin');
assert(cancelRes.success && cancelRes.schedule.status === 'Cancelled', 'Schedule status marked as Cancelled');
assert(cancelRes.schedule.cancellationReason === 'Room maintenance', 'Cancellation reason recorded');

// Reschedule session
const rescheduleRes = festivalStore.rescheduleProgramme(cancelRes.schedule.id, {
  newDate: 'Dec 22, 2026',
  newStartTime: '05:30 PM',
  newEndTime: '06:30 PM',
  newVenue: 'Open Amphitheatre',
  reason: 'Shifted to open air arena.'
}, { overrideConflicts: true });
assert(rescheduleRes.success && rescheduleRes.schedule.status === 'Rescheduled', 'Session successfully rescheduled');
assert(rescheduleRes.schedule.stage === 'Open Amphitheatre', 'Rescheduled venue updated');

// Test 12: Data Privacy & Public Isolation
console.log('\n[12] Testing Public Schedule Privacy Isolation:');
const publicSchedule = festivalStore.getPublicProgrammeSchedule();
assert(Array.isArray(publicSchedule) && publicSchedule.length >= 12, `Retrieved ${publicSchedule.length} public schedule entries`);

// Verify private notes are completely stripped in public entries
const publicEntryWithNotes = publicSchedule.find(s => s.id === createdSchedule.id);
assert(publicEntryWithNotes !== undefined, 'Active entry appears in public schedule');
assert(publicEntryWithNotes.notes === undefined, 'Private secretarial notes are strictly stripped from public schedule');

// Verify cancelled sessions are excluded from public schedule
festivalStore.cancelProgrammeSchedule(createdSchedule.id, 'Test cancel', 'Admin');
const publicAfterCancel = festivalStore.getPublicProgrammeSchedule();
assert(!publicAfterCancel.some(s => s.id === createdSchedule.id), 'Cancelled sessions are strictly excluded from public schedule');

// Test 13: Clean up & Deletion
console.log('\n[13] Testing Archive and Deletion:');
festivalStore.deleteProgrammeSchedule(createdSchedule.id);
festivalStore.deleteProgrammeSchedule(overrideRes.schedule.id);
assert(!festivalStore.getProgrammeScheduleById(createdSchedule.id), 'Test schedule entry 1 deleted');
assert(!festivalStore.getProgrammeScheduleById(overrideRes.schedule.id), 'Test schedule entry 2 deleted');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
