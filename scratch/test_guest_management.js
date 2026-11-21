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
console.log('DALENZIA FEST 2K26 - PROGRAMME GUEST MANAGEMENT TESTS');
console.log('====================================================');

// Test 1: Category retrieval
console.log('\n[1] Testing Guest Categories Retrieval:');
const categories = festivalStore.getGuestCategories();
assert(Array.isArray(categories) && categories.length >= 7, `Retrieved ${categories.length} guest categories (expected >= 7)`);
const honourCat = categories.find(c => c.id === 'GCAT-HON');
assert(honourCat && honourCat.name === 'Guest of Honour', 'Found Guest of Honour category');

// Test 2: Add Guest Category
console.log('\n[2] Testing Add Guest Category:');
const catRes = festivalStore.addGuestCategory({
  name: 'Distinguished Alumnus',
  code: 'ALUM',
  description: 'Prominent alumni of Dalailussunna Dars'
});
const newCat = catRes.category || catRes;
assert(newCat && newCat.name === 'Distinguished Alumnus', 'Successfully created custom category');
const updatedCats = festivalStore.getGuestCategories();
assert(updatedCats.some(c => c.name === 'Distinguished Alumnus'), 'Custom category present in categories list');

// Test 3: Guest Dashboard Statistics
console.log('\n[3] Testing Guest Dashboard Stats:');
const stats = festivalStore.getGuestDashboardStats();
assert(typeof stats.totalGuests === 'number' && stats.totalGuests >= 8, `Total guests: ${stats.totalGuests} (expected >= 8)`);
assert(typeof stats.confirmedGuests === 'number', `Confirmed guests: ${stats.confirmedGuests}`);
assert(typeof stats.pendingGuests === 'number', `Pending invitations: ${stats.pendingGuests}`);
assert(typeof stats.assignedGuests === 'number', `Guests assigned to programmes: ${stats.assignedGuests}`);
assert(typeof stats.unassignedGuests === 'number', `Unassigned guests: ${stats.unassignedGuests}`);
assert(stats.assignedGuests + stats.unassignedGuests === stats.totalGuests, 'Assigned + Unassigned matches Total Guests');

// Test 4: Guest Directory & Filtering
console.log('\n[4] Testing Guest Retrieval & Filtering:');
const allGuests = festivalStore.getProgrammeGuests();
assert(allGuests.length >= 8, `Found ${allGuests.length} total active guests`);

// Search filter
const searchResult = festivalStore.getProgrammeGuests({ query: 'Muhammed Rashid' });
assert(searchResult.length === 1 && searchResult[0].name.includes('Muhammed Rashid'), 'Search by name returns exact match');

// Category filter
const chiefGuests = festivalStore.getProgrammeGuests({ category: 'GCAT-CHF' });
assert(chiefGuests.length >= 1, 'Category filter returns Chief Guests');

// Assignment status filter
const assignedGuestsList = festivalStore.getProgrammeGuests({ assignmentStatus: 'assigned' });
assert(assignedGuestsList.every(g => g.assignedProgrammeIds && g.assignedProgrammeIds.length > 0), 'Assigned filter returns only guests with programmes');
const unassignedGuestsList = festivalStore.getProgrammeGuests({ assignmentStatus: 'unassigned' });
assert(unassignedGuestsList.every(g => !g.assignedProgrammeIds || g.assignedProgrammeIds.length === 0), 'Unassigned filter returns only guests with 0 programmes');

// Test 5: Add New Guest with Auto ID and Bi-directional Programme Sync
console.log('\n[5] Testing Add Guest & Bi-directional Programme Assignment:');
const addRes = festivalStore.addProgrammeGuest({
  name: 'Dr. Sayyid Koya Jamalullaili',
  malayalamName: 'ഡോ. സയ്യിദ് കോയ ജമലുല്ലൈലി',
  designation: 'Vice Chancellor & Islamic Historian',
  organization: 'Universal Islamic Academy',
  bio: 'International scholar in Islamic history and prophetic traditions with over 30 years of teaching experience.',
  category: 'GCAT-SPK',
  assignedProgrammeIds: ['PRG-001', 'PRG-003'],
  invitationStatus: 'Drafted',
  participationStatus: 'Invited',
  contactPhone: '+91 94471 99999',
  contactEmail: 'koyajamal@example.com',
  specialNotes: 'Confidential VIP: Requires airport convoy pickup and VIP guest house suite.'
});
const testGuest = addRes.guest || addRes;

assert(testGuest && testGuest.id && testGuest.id.startsWith('GST-'), `New guest created with ID ${testGuest.id}`);
assert(testGuest.assignedProgrammeIds.length === 2, 'Guest has 2 assigned programmes');

// Verify bi-directional sync in programmes
const prg1 = festivalStore.getProgrammeById('PRG-001');
const prg3 = festivalStore.getProgrammeById('PRG-003');
assert(prg1 && prg1.assignedGuestIds.includes(testGuest.id), `Programme PRG-001 contains guest ${testGuest.id} in assignedGuestIds`);
assert(prg3 && prg3.assignedGuestIds.includes(testGuest.id), `Programme PRG-003 contains guest ${testGuest.id} in assignedGuestIds`);

// Test 6: Update Guest & Bi-directional Sync Diffs
console.log('\n[6] Testing Update Guest & Programme Assignment Diff Synchronization:');
// Remove PRG-001, keep PRG-003, add PRG-004
const updateRes = festivalStore.updateProgrammeGuest(testGuest.id, {
  designation: 'Senior Vice Chancellor & Senior Historian',
  assignedProgrammeIds: ['PRG-003', 'PRG-004'],
  invitationStatus: 'Invitation Sent'
});
const updatedTestGuest = updateRes.guest || updateRes;

assert(updatedTestGuest.designation === 'Senior Vice Chancellor & Senior Historian', 'Updated designation');
assert(updatedTestGuest.assignedProgrammeIds.length === 2 && updatedTestGuest.assignedProgrammeIds.includes('PRG-004'), 'Updated assigned programmes');

// Verify PRG-001 removed, PRG-004 added, PRG-003 preserved
const prg1After = festivalStore.getProgrammeById('PRG-001');
const prg3After = festivalStore.getProgrammeById('PRG-003');
const prg4After = festivalStore.getProgrammeById('PRG-004');
assert(prg1After && !prg1After.assignedGuestIds.includes(testGuest.id), 'PRG-001 successfully removed guest from assignedGuestIds');
assert(prg3After && prg3After.assignedGuestIds.includes(testGuest.id), 'PRG-003 retained guest in assignedGuestIds');
assert(prg4After && prg4After.assignedGuestIds.includes(testGuest.id), 'PRG-004 successfully added guest to assignedGuestIds');

// Test 7: Direct Assign/Remove Methods
console.log('\n[7] Testing assignGuestToProgrammes & removeGuestFromProgramme:');
festivalStore.assignGuestToProgrammes(testGuest.id, ['PRG-002']);
const prg2After = festivalStore.getProgrammeById('PRG-002');
assert(prg2After && prg2After.assignedGuestIds.includes(testGuest.id), 'assignGuestToProgrammes synced to PRG-002');

festivalStore.removeGuestFromProgramme(testGuest.id, 'PRG-002');
const prg2AfterRemove = festivalStore.getProgrammeById('PRG-002');
assert(prg2AfterRemove && !prg2AfterRemove.assignedGuestIds.includes(testGuest.id), 'removeGuestFromProgramme successfully removed guest from PRG-002');

// Test 8: Status Transitions & Protocol Tracking
console.log('\n[8] Testing Status Workflows:');
const statusRes = festivalStore.updateGuestInvitationStatus(testGuest.id, 'Confirmed', 'Admin Controller');
const statusUpdated = statusRes.guest || statusRes;
assert(statusUpdated.invitationStatus === 'Confirmed', 'Invitation status updated to Confirmed');

const partRes = festivalStore.updateGuestParticipationStatus(testGuest.id, 'Arrived on Campus', 'Protocol Desk');
const partUpdated = partRes.guest || partRes;
assert(partUpdated.participationStatus === 'Arrived on Campus', 'Participation status updated to Arrived on Campus');

// Test 9: Data Privacy & Security (Confidential fields must NOT leak publicly)
console.log('\n[9] Testing Strict Confidential Field Isolation:');
const adminFetched = festivalStore.getProgrammeGuestById(testGuest.id, { includePrivate: true });
assert(adminFetched.contactPhone === '+91 94471 99999', 'Admin fetch includes private phone');
assert(adminFetched.contactEmail === 'koyajamal@example.com', 'Admin fetch includes private email');
assert(adminFetched.specialNotes.includes('Confidential VIP'), 'Admin fetch includes private special notes');

const publicFetched = festivalStore.getProgrammeGuestById(testGuest.id, { includePrivate: false });
assert(publicFetched.contactPhone === undefined, 'Public fetch strips contactPhone');
assert(publicFetched.contactEmail === undefined, 'Public fetch strips contactEmail');
assert(publicFetched.specialNotes === undefined, 'Public fetch strips specialNotes');

// Verify getPublicGuests
const initialPublic = festivalStore.getPublicGuests();
assert(initialPublic.some(g => g.id === testGuest.id), 'Published guest appears in getPublicGuests()');

// Toggle to unpublish
festivalStore.toggleGuestPublish(testGuest.id);
const unpublishedPublic = festivalStore.getPublicGuests();
assert(!unpublishedPublic.some(g => g.id === testGuest.id), 'Unpublished guest is excluded from getPublicGuests()');

// Toggle back to published
festivalStore.toggleGuestPublish(testGuest.id);
const rePublished = festivalStore.getPublicGuests();
const publicTestGuest = rePublished.find(g => g.id === testGuest.id);
assert(publicTestGuest !== undefined, 'Re-published guest appears in getPublicGuests()');
assert(publicTestGuest.contactPhone === undefined, 'Public list guest has NO contactPhone');
assert(publicTestGuest.contactEmail === undefined, 'Public list guest has NO contactEmail');
assert(publicTestGuest.specialNotes === undefined, 'Public list guest has NO specialNotes');

// Test 10: Clean up / Archive / Delete Safety
console.log('\n[10] Testing Archive and Deletion Safety:');
festivalStore.deleteProgrammeGuest(testGuest.id);
const deletedGuest = festivalStore.getProgrammeGuestById(testGuest.id);
assert(!deletedGuest, 'Test guest successfully deleted');

// Verify all programme references cleaned up
const prg3Clean = festivalStore.getProgrammeById('PRG-003');
const prg4Clean = festivalStore.getProgrammeById('PRG-004');
assert(prg3Clean && !prg3Clean.assignedGuestIds.includes(testGuest.id), 'PRG-003 assignedGuestIds automatically cleaned up');
assert(prg4Clean && !prg4Clean.assignedGuestIds.includes(testGuest.id), 'PRG-004 assignedGuestIds automatically cleaned up');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
