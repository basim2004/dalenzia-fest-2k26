const assert = require('assert');

async function runTests() {
  console.log('====================================================');
  console.log('DALENZIA FEST 2K26 - ANNOUNCEMENTS MANAGEMENT TESTS');
  console.log('====================================================\n');

  const { festivalStore } = await import('../src/admin/data/festivalStore.js');

  let passedTests = 0;
  function pass(msg) {
    console.log(`  ✓ ${msg}`);
    passedTests++;
  }

  // 1. Categories
  console.log('[1] Testing Announcement Categories:');
  const categories = festivalStore.getAnnouncementCategories();
  assert(Array.isArray(categories), 'Categories must be an array');
  assert(categories.length >= 8, `Expected >= 8 categories, got ${categories.length}`);
  pass(`Retrieved ${categories.length} announcement categories (expected >= 8)`);
  assert(categories.some(c => c.name === 'General Announcement'), 'Must have General Announcement');
  assert(categories.some(c => c.name === 'Important Notice'), 'Must have Important Notice');
  assert(categories.some(c => c.name === 'Competition Update'), 'Must have Competition Update');
  assert(categories.some(c => c.name === 'Programme Update'), 'Must have Programme Update');
  assert(categories.some(c => c.name === 'Schedule Change'), 'Must have Schedule Change');
  assert(categories.some(c => c.name === 'Registration Notice'), 'Must have Registration Notice');
  assert(categories.some(c => c.name === 'Result Announcement'), 'Must have Result Announcement');
  assert(categories.some(c => c.name === 'Emergency Notice'), 'Must have Emergency Notice');
  pass('Found all 8 required announcement categories');

  // 2. Initial Announcements
  console.log('\n[2] Testing Initial Announcements:');
  const allAnnouncements = festivalStore.getAnnouncements({ includeArchived: true });
  assert(allAnnouncements.length >= 10, `Expected >= 10 announcements, got ${allAnnouncements.length}`);
  pass(`Retrieved ${allAnnouncements.length} initial announcements`);

  const ann1 = allAnnouncements.find(a => a.id === 'ANN-01');
  assert(ann1, 'ANN-01 must exist');
  assert(ann1.status === 'Published', 'ANN-01 must be Published');
  assert(ann1.priority === 'Urgent', 'ANN-01 priority must be Urgent');
  assert(ann1.targetAudience === 'Everyone', 'ANN-01 audience must be Everyone');
  assert(ann1.isPinned === true, 'ANN-01 must be pinned');
  pass('ANN-01 verified with valid metadata, priority, and audience');

  // 3. Dashboard Stats
  console.log('\n[3] Testing Dashboard Stats:');
  const stats = festivalStore.getAnnouncementDashboardStats();
  assert(stats.totalAnnouncements >= 10, 'Total announcements check');
  assert(stats.publishedAnnouncements >= 6, 'Published announcements check');
  assert(stats.draftAnnouncements >= 1, 'Draft announcements check');
  assert(stats.scheduledAnnouncements >= 1, 'Scheduled announcements check');
  assert(stats.expiredAnnouncements >= 1, 'Expired announcements check');
  assert(stats.urgentAnnouncements >= 2, 'Urgent announcements check');
  assert(stats.audienceDistribution.everyone >= 4, 'Audience: Everyone count check');
  assert(stats.audienceDistribution.judges >= 1, 'Audience: Judges count check');
  assert(stats.audienceDistribution.teamLeaders >= 1, 'Audience: Team Leaders count check');
  assert(stats.audienceDistribution.students >= 2, 'Audience: Students count check');
  assert(stats.audienceDistribution.adminOnly >= 1, 'Audience: Admin Only count check');
  pass(`Dashboard stats: ${stats.totalAnnouncements} total, ${stats.publishedAnnouncements} published, ${stats.draftAnnouncements} drafts, ${stats.scheduledAnnouncements} scheduled, ${stats.expiredAnnouncements} expired`);
  pass(`Audience distribution: Everyone (${stats.audienceDistribution.everyone}), Judges (${stats.audienceDistribution.judges}), Team Leaders (${stats.audienceDistribution.teamLeaders}), Students (${stats.audienceDistribution.students}), Admin (${stats.audienceDistribution.adminOnly})`);

  // 4. Filtering & Search & Sorting
  console.log('\n[4] Testing Filtering, Search & Sorting:');
  const progAnns = festivalStore.getAnnouncements({ category: 'Programme Update' });
  assert(progAnns.every(a => a.category === 'Programme Update'), 'Category filter must be strict');
  pass(`Category filter (Programme Update) returned ${progAnns.length} items`);

  const judgeAnns = festivalStore.getAnnouncements({ audience: 'Judges' });
  assert(judgeAnns.every(a => a.targetAudience === 'Judges'), 'Audience filter must be strict');
  pass(`Audience filter (Judges) returned ${judgeAnns.length} items`);

  const urgentAnns = festivalStore.getAnnouncements({ priority: 'Urgent' });
  assert(urgentAnns.every(a => a.priority === 'Urgent'), 'Priority filter must be strict');
  pass(`Priority filter (Urgent) returned ${urgentAnns.length} items`);

  const searchQuery = festivalStore.getAnnouncements({ query: 'Acoustic' });
  assert(searchQuery.length >= 1, 'Search query "Acoustic" should match Stage 02 schedule change');
  assert(searchQuery[0].id === 'ANN-05', 'Matches ANN-05');
  pass('Keyword search accurately matched announcement content');

  const pinnedSort = festivalStore.getAnnouncements({ sortBy: 'pinned_first' });
  assert(pinnedSort[0].isPinned === true, 'Top item in pinned_first sort must be pinned');
  pass('Sort by pinned-first successfully verified');

  const prioritySort = festivalStore.getAnnouncements({ sortBy: 'priority' });
  assert(prioritySort[0].priority === 'Urgent', 'Top item in priority sort must be Urgent');
  pass('Sort by priority successfully verified');

  // 5. Announcement Lifecycle
  console.log('\n[5] Testing Complete Announcement Lifecycle:');
  const newAnn = festivalStore.addAnnouncement({
    title: 'Unit Test Broadcast: Technical Calibration Alert',
    summary: 'Temporary announcement for unit testing the full announcement lifecycle',
    content: 'Detailed paragraphs of information regarding stage lighting and camera crew movements.',
    category: 'Competition Update',
    targetAudience: 'Judges',
    relatedProgrammeId: 'PRG-005',
    relatedCompetitionId: 'COMP-LIT-01',
    priority: 'Urgent',
    status: 'Draft',
    isPinned: false
  }, 'Test Admin');

  assert(newAnn && newAnn.id, 'New announcement created');
  assert(newAnn.relatedProgrammeTitle === 'Senior Malayalam Elocution Grand Stage', 'Auto-resolved programme title');
  assert(newAnn.relatedCompetitionTitle === 'Junior Arabic Essay (LIT-JR-102)', 'Auto-resolved competition title');
  pass(`Created new announcement: ${newAnn.id} with auto-resolved programme & competition titles`);

  // Update
  const updated = festivalStore.updateAnnouncement(newAnn.id, {
    title: 'Unit Test Broadcast: Technical Calibration Alert (Updated)'
  }, 'Test Admin');
  assert(updated.title.includes('(Updated)'), 'Announcement title updated');
  pass('Announcement title updated successfully');

  // Toggle Pin
  festivalStore.togglePinAnnouncement(newAnn.id, 'Test Admin');
  assert(festivalStore.getAnnouncementById(newAnn.id).isPinned === true, 'Pin toggled to true');
  pass('Pin status toggled to pinned');

  // Publish
  festivalStore.publishAnnouncement(newAnn.id, 'Test Admin');
  assert(festivalStore.getAnnouncementById(newAnn.id).status === 'Published', 'Status is Published');
  pass('Announcement published successfully');

  // Notification Sync check
  const notifs = festivalStore.getNotifications();
  const linkedNotif = notifs.find(n => n.announcementId === newAnn.id);
  assert(linkedNotif, 'In-app notification automatically dispatched to notifications list');
  assert(linkedNotif.title.includes('Technical Calibration Alert'), 'Notification title matches announcement');
  pass('In-app notification automatically generated and dispatched for Judges audience');

  // Unpublish
  festivalStore.unpublishAnnouncement(newAnn.id, 'Test Admin');
  assert(festivalStore.getAnnouncementById(newAnn.id).status === 'Draft', 'Status reverted to Draft');
  pass('Announcement unpublished to Draft');

  // Schedule
  festivalStore.scheduleAnnouncement(newAnn.id, 'Dec 25, 2026', '10:00 AM', 'Test Admin');
  assert(festivalStore.getAnnouncementById(newAnn.id).status === 'Scheduled', 'Status set to Scheduled');
  assert(festivalStore.getAnnouncementById(newAnn.id).publishDate === 'Dec 25, 2026', 'Schedule date stored');
  pass('Announcement scheduled for future date and time');

  // Extend Expiry
  festivalStore.extendAnnouncementExpiry(newAnn.id, 'Dec 30, 2026', '11:59 PM', 'Test Admin');
  assert(festivalStore.getAnnouncementById(newAnn.id).expiryDate === 'Dec 30, 2026', 'Expiry date extended');
  pass('Announcement expiry extended');

  // View count increment
  const views = festivalStore.incrementAnnouncementView(newAnn.id);
  assert(views === 1, `View count should be 1, got ${views}`);
  pass('Announcement view counter incremented');

  // Archive & Restore
  festivalStore.archiveAnnouncement(newAnn.id, 'Test Admin');
  assert(festivalStore.getAnnouncementById(newAnn.id).status === 'Archived', 'Announcement archived');
  assert(festivalStore.getAnnouncementById(newAnn.id).isArchived === true, 'isArchived flag true');
  pass('Announcement archived successfully');

  festivalStore.restoreAnnouncement(newAnn.id, 'Test Admin');
  assert(festivalStore.getAnnouncementById(newAnn.id).status === 'Draft', 'Announcement restored to Draft');
  assert(festivalStore.getAnnouncementById(newAnn.id).isArchived === false, 'isArchived flag false');
  pass('Announcement restored from archive');

  // Cleanup test announcement
  festivalStore.deleteAnnouncement(newAnn.id, { adminUser: 'Test Admin' });
  assert(!festivalStore.getAnnouncementById(newAnn.id), 'Announcement deleted');
  pass('Test announcement deleted cleanly');

  // 6. Public Privacy & Sandboxing
  console.log('\n[6] Testing Public Privacy & Role-Based Sandboxing:');
  const publicAnns = festivalStore.getPublicAnnouncements();
  assert(publicAnns.length >= 3, `Expected >= 3 public announcements, got ${publicAnns.length}`);
  assert(publicAnns.every(a => a.targetAudience === undefined), 'Target audience field scrubbed from public output');

  // Check specific private / unpublished exclusions:
  assert(!publicAnns.some(a => a.id === 'ANN-02'), 'ANN-02 (Judges only) is strictly EXCLUDED from public view');
  assert(!publicAnns.some(a => a.id === 'ANN-03'), 'ANN-03 (Team Leaders only) is strictly EXCLUDED from public view');
  assert(!publicAnns.some(a => a.id === 'ANN-07'), 'ANN-07 (Admin Only) is strictly EXCLUDED from public view');
  assert(!publicAnns.some(a => a.id === 'ANN-08'), 'ANN-08 (Scheduled) is strictly EXCLUDED before schedule time');
  assert(!publicAnns.some(a => a.id === 'ANN-09'), 'ANN-09 (Draft) is strictly EXCLUDED from public view');
  assert(!publicAnns.some(a => a.id === 'ANN-10'), 'ANN-10 (Expired) is strictly EXCLUDED from active public view');
  pass('Public view strictly includes only Everyone audience, Published, unexpired announcements');
  pass('Admin Only, Judges Only, Team Leaders Only, Drafts, Scheduled, and Expired announcements strictly protected');

  // Audience portal views
  const studentPortalAnns = festivalStore.getAudienceAnnouncements('student');
  assert(studentPortalAnns.some(a => a.id === 'ANN-04'), 'Students see student-targeted announcements');
  assert(!studentPortalAnns.some(a => a.id === 'ANN-07'), 'Students cannot see Admin-only announcements');
  pass('Student Portal role-based filtering verified');

  const judgePortalAnns = festivalStore.getAudienceAnnouncements('judge');
  assert(judgePortalAnns.some(a => a.id === 'ANN-02'), 'Judges see judge-targeted announcements');
  assert(!judgePortalAnns.some(a => a.id === 'ANN-07'), 'Judges cannot see Admin-only announcements');
  pass('Judge Portal role-based filtering verified');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passedTests} PASSED, 0 FAILED`);
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
