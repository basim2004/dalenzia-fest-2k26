const assert = require('assert');

async function runTests() {
  console.log('====================================================');
  console.log('DALENZIA FEST 2K26 - POSTERS & TEMPLATES MANAGEMENT TESTS');
  console.log('====================================================\n');

  const { festivalStore } = await import('../src/admin/data/festivalStore.js');

  let passedTests = 0;
  function pass(msg) {
    console.log(`  ✓ ${msg}`);
    passedTests++;
  }

  // 1. Categories
  console.log('[1] Testing Poster Categories:');
  const categories = festivalStore.getPosterCategories();
  assert(Array.isArray(categories), 'Categories must be an array');
  assert(categories.length >= 8, `Expected >= 8 categories, got ${categories.length}`);
  pass(`Retrieved ${categories.length} poster categories (expected >= 8)`);
  assert(categories.some(c => c.name === 'Festival Main Posters'), 'Must have Festival Main Posters');
  assert(categories.some(c => c.name === 'Programme Posters'), 'Must have Programme Posters');
  assert(categories.some(c => c.name === 'Competition Posters'), 'Must have Competition Posters');
  assert(categories.some(c => c.name === 'Result Posters'), 'Must have Result Posters');
  assert(categories.some(c => c.name === 'Guest Posters'), 'Must have Guest Posters');
  assert(categories.some(c => c.name === 'Announcement Posters'), 'Must have Announcement Posters');
  assert(categories.some(c => c.name === 'Special Day Posters'), 'Must have Special Day Posters');
  assert(categories.some(c => c.name === 'Other Posters'), 'Must have Other Posters');
  pass('Found all 8 required official categories');

  // 2. Initial Posters
  console.log('\n[2] Testing Initial Posters Retrieval:');
  const allPosters = festivalStore.getPosters({ includeArchived: true });
  assert(allPosters.length >= 10, `Expected >= 10 posters, got ${allPosters.length}`);
  pass(`Retrieved ${allPosters.length} initial posters`);

  const mainPoster = allPosters.find(p => p.id === 'POSTER-01');
  assert(mainPoster, 'POSTER-01 must exist');
  assert(mainPoster.status === 'Published', 'POSTER-01 must be Published');
  assert(mainPoster.category === 'Festival Main Posters', 'POSTER-01 category must match');
  assert(mainPoster.fileUrl === '/assets/main_poster.jpg', 'POSTER-01 fileUrl must match');
  assert(mainPoster.downloadsCount > 0, 'POSTER-01 has downloads count');
  pass('POSTER-01 verified with valid metadata and file path');

  // 3. Initial Templates
  console.log('\n[3] Testing Initial Templates Retrieval:');
  const allTemplates = festivalStore.getPosterTemplates({ includeArchived: true });
  assert(allTemplates.length >= 5, `Expected >= 5 templates, got ${allTemplates.length}`);
  pass(`Retrieved ${allTemplates.length} initial templates`);

  const tmpl1 = allTemplates.find(t => t.id === 'TMPL-01');
  assert(tmpl1, 'TMPL-01 must exist');
  assert(tmpl1.status === 'Active', 'TMPL-01 must be Active');
  assert(tmpl1.softwareFormat.includes('Photoshop'), 'TMPL-01 format must be Photoshop');
  assert(tmpl1.originalFileName === 'dalenzia_result_template_gold.psd', 'TMPL-01 original file name matches');
  pass('TMPL-01 master result template verified');

  // 4. Dashboard Stats
  console.log('\n[4] Testing Dashboard Stats:');
  const stats = festivalStore.getPosterDashboardStats();
  assert(stats.totalPosters >= 10, 'Total posters count check');
  assert(stats.publishedPosters >= 7, 'Published posters count check');
  assert(stats.draftPosters >= 1, 'Draft posters count check');
  assert(stats.pendingPosters >= 1, 'Pending posters count check');
  assert(stats.totalTemplates >= 5, 'Total templates count check');
  assert(stats.activeTemplates >= 5, 'Active templates count check');
  assert(stats.totalDownloads > 0, 'Total downloads count check');
  assert(stats.recentPosters.length <= 5, 'Recent posters list check');
  assert(stats.recentTemplates.length <= 4, 'Recent templates list check');
  pass(`Dashboard metrics: ${stats.totalPosters} total, ${stats.publishedPosters} published, ${stats.draftPosters} drafts, ${stats.pendingPosters} pending`);
  pass(`Templates metrics: ${stats.totalTemplates} total templates, ${stats.activeTemplates} active`);

  // 5. Filtering & Search & Sorting
  console.log('\n[5] Testing Filtering, Search & Sorting:');
  const compPosters = festivalStore.getPosters({ category: 'Competition Posters' });
  assert(compPosters.every(p => p.category === 'Competition Posters'), 'Category filter must be strict');
  pass(`Category filter (Competition Posters) returned ${compPosters.length} items`);

  const progPosters = festivalStore.getPosters({ programmeId: 'PRG-002' });
  assert(progPosters.every(p => p.relatedProgrammeId === 'PRG-002'), 'Programme ID filter must be strict');
  pass(`Programme filter (PRG-002) returned ${progPosters.length} items`);

  const compIdPosters = festivalStore.getPosters({ competitionId: 'COMP-LIT-01' });
  assert(compIdPosters.every(p => p.relatedCompetitionId === 'COMP-LIT-01'), 'Competition ID filter must be strict');
  pass(`Competition filter (COMP-LIT-01) returned ${compIdPosters.length} items`);

  const searchQuery = festivalStore.getPosters({ query: 'Thuluth' });
  assert(searchQuery.length >= 1, 'Query "Thuluth" should match Calligraphy poster');
  assert(searchQuery[0].id === 'POSTER-06', 'Matches POSTER-06');
  pass('Keyword search accurately matched poster title/tags');

  const sortedNewest = festivalStore.getPosters({ sortBy: 'newest' });
  assert(new Date(sortedNewest[0].createdAt) >= new Date(sortedNewest[1].createdAt), 'Sorted newest first');
  pass('Sort by newest successfully verified');

  const sortedDownloads = festivalStore.getPosters({ sortBy: 'downloads' });
  assert(sortedDownloads[0].downloadsCount >= sortedDownloads[1].downloadsCount, 'Sorted by downloads count');
  pass('Sort by most downloads successfully verified');

  // 6. Poster Lifecycle
  console.log('\n[6] Testing Complete Poster Lifecycle:');
  const newPoster = festivalStore.addPoster({
    title: 'Unit Test Special Exhibition Poster',
    shortDescription: 'Temporary poster for unit testing lifecycle',
    category: 'Competition Posters',
    fileUrl: '/assets/events/comp_story_telling.png',
    fileName: 'test_poster.png',
    fileSize: '2.5 MB',
    fileType: 'image/png',
    relatedProgrammeId: 'PRG-005',
    relatedCompetitionId: 'COMP-LIT-01',
    status: 'Draft',
    displayOrder: 25
  }, 'Test Admin');

  assert(newPoster && newPoster.id, 'New poster created');
  assert(newPoster.relatedProgrammeTitle === 'Senior Malayalam Elocution Grand Stage', 'Auto-resolved programme title');
  assert(newPoster.relatedCompetitionTitle === 'Junior Arabic Essay (LIT-JR-102)', 'Auto-resolved competition title');
  pass(`Created new poster: ${newPoster.id} with auto-resolved programme & competition titles`);

  // Update
  const updated = festivalStore.updatePoster(newPoster.id, {
    title: 'Unit Test Special Exhibition Poster (Updated)'
  }, 'Test Admin');
  assert(updated.title.includes('(Updated)'), 'Poster title updated');
  pass('Poster title updated successfully');

  // Replace file
  const fileReplaced = festivalStore.replacePosterFile(newPoster.id, {
    fileUrl: '/assets/events/comp_debate.png',
    fileName: 'new_debate_file.png',
    fileSize: '3.1 MB',
    dimensions: '1920 x 1080 px'
  }, 'Test Admin');
  assert(fileReplaced.fileName === 'new_debate_file.png', 'File replaced');
  assert(fileReplaced.dimensions === '1920 x 1080 px', 'Dimensions updated');
  assert(fileReplaced.approvalHistory.some(h => h.reason.includes('Replaced poster file')), 'File replacement history logged');
  pass('Poster file replaced and history recorded');

  // Approval Workflow: Submit -> Reject -> Re-submit -> Approve -> Publish
  festivalStore.updatePoster(newPoster.id, { status: 'Pending Approval', statusReason: 'Submitted for verification' }, 'Author');
  assert(festivalStore.getPosterById(newPoster.id).status === 'Pending Approval', 'Status is Pending Approval');
  pass('Poster transitioned to Pending Approval');

  // Reject
  festivalStore.rejectPoster(newPoster.id, 'Resolution too low. Minimum 300 DPI required.', 'Reviewer Admin');
  const rejected = festivalStore.getPosterById(newPoster.id);
  assert(rejected.status === 'Draft', 'Rejected poster reverts to Draft');
  assert(rejected.rejectionReason.includes('300 DPI'), 'Rejection reason saved');
  pass('Poster rejected with internal rejection reason stored');

  // Approve
  festivalStore.approvePoster(newPoster.id, 'Approver Admin');
  const approved = festivalStore.getPosterById(newPoster.id);
  assert(approved.status === 'Approved', 'Approved poster has Approved status');
  assert(approved.rejectionReason === null, 'Rejection reason cleared');
  pass('Poster approved successfully');

  // Publish
  festivalStore.publishPoster(newPoster.id, true, 'Super Admin');
  const published = festivalStore.getPosterById(newPoster.id);
  assert(published.status === 'Published', 'Poster published');
  pass('Poster published successfully');

  // Download count increment
  const dlCount = festivalStore.incrementPosterDownload(newPoster.id);
  assert(dlCount === 1, `Download count should be 1, got ${dlCount}`);
  pass('Poster download counter incremented');

  // Archive & Restore
  festivalStore.archivePoster(newPoster.id, 'Super Admin');
  assert(festivalStore.getPosterById(newPoster.id).status === 'Archived', 'Poster archived');
  assert(festivalStore.getPosterById(newPoster.id).isArchived === true, 'isArchived flag true');
  pass('Poster archived successfully');

  festivalStore.restorePoster(newPoster.id, 'Super Admin');
  assert(festivalStore.getPosterById(newPoster.id).status === 'Draft', 'Poster restored to Draft');
  assert(festivalStore.getPosterById(newPoster.id).isArchived === false, 'isArchived flag false');
  pass('Poster restored from archive');

  // Cleanup test poster
  festivalStore.deletePoster(newPoster.id, { adminUser: 'Test Admin' });
  assert(!festivalStore.getPosterById(newPoster.id), 'Poster deleted');
  pass('Test poster deleted cleanly');

  // 7. Template Lifecycle
  console.log('\n[7] Testing Template Lifecycle:');
  const newTmpl = festivalStore.addPosterTemplate({
    name: 'Unit Test Instagram Story Template',
    category: 'Competition Posters',
    dimensions: '1080 x 1920 px',
    softwareFormat: 'Figma Component (.FIG)',
    originalFileName: 'test_template.fig',
    fileSize: '14.0 MB',
    description: 'Unit test template description'
  }, 'Test Admin');

  assert(newTmpl && newTmpl.id, 'New template created');
  pass(`Created new template: ${newTmpl.id}`);

  festivalStore.updatePosterTemplate(newTmpl.id, {
    description: 'Updated unit test template description'
  }, 'Test Admin');
  assert(festivalStore.getPosterTemplateById(newTmpl.id).description.includes('Updated'), 'Template updated');
  pass('Template description updated');

  festivalStore.togglePosterTemplateStatus(newTmpl.id, 'Test Admin');
  assert(festivalStore.getPosterTemplateById(newTmpl.id).status === 'Inactive', 'Status toggled to Inactive');
  festivalStore.togglePosterTemplateStatus(newTmpl.id, 'Test Admin');
  assert(festivalStore.getPosterTemplateById(newTmpl.id).status === 'Active', 'Status toggled back to Active');
  pass('Template status toggled Active <-> Inactive');

  const tmplDl = festivalStore.incrementTemplateDownload(newTmpl.id);
  assert(tmplDl === 1, 'Template download counter incremented');
  pass('Template download counter incremented');

  festivalStore.archivePosterTemplate(newTmpl.id, 'Test Admin');
  assert(festivalStore.getPosterTemplateById(newTmpl.id).status === 'Archived', 'Template archived');
  pass('Template archived');

  festivalStore.deletePosterTemplate(newTmpl.id, { adminUser: 'Test Admin' });
  assert(!festivalStore.getPosterTemplateById(newTmpl.id), 'Template deleted');
  pass('Test template deleted cleanly');

  // 8. Result Poster Auto-Generation
  console.log('\n[8] Testing Result Poster Auto-Generation:');
  const autoResultPoster = festivalStore.generateResultPoster('COMP-LIT-01', {}, 'Super Admin');
  assert(autoResultPoster, 'Result poster generated');
  assert(autoResultPoster.category === 'Result Posters', 'Category is Result Posters');
  assert(autoResultPoster.relatedCompetitionId === 'COMP-LIT-01', 'Related competition ID matches');
  assert(autoResultPoster.title.includes('Junior Arabic Essay'), 'Title matches competition');
  assert(autoResultPoster.status === 'Published', 'Result poster is Published');
  pass('Auto-generated result poster from verified competition results');

  // Calling again updates existing rather than duplicating
  const duplicateCall = festivalStore.generateResultPoster('COMP-LIT-01', {}, 'Super Admin');
  assert(duplicateCall.id === autoResultPoster.id, 'Idempotent: Reuses existing result poster without duplicate creation');
  pass('Idempotent result poster generation: duplicate avoidance verified');

  // 9. Public Privacy & Sandboxing
  console.log('\n[9] Testing Public Privacy & Sandboxing:');
  const publicPosters = festivalStore.getPublicPosters();
  assert(publicPosters.every(p => p.status === undefined || p.status === 'Published'), 'Public posters contains only published');
  assert(!publicPosters.some(p => p.id === 'POSTER-08'), 'Draft poster POSTER-08 is strictly EXCLUDED from public view');
  assert(!publicPosters.some(p => p.id === 'POSTER-09'), 'Pending poster POSTER-09 is strictly EXCLUDED from public view');
  assert(publicPosters.every(p => p.approvalHistory === undefined), 'Approval history is not exposed to public');
  assert(publicPosters.every(p => p.rejectionReason === undefined), 'Rejection reason is not exposed to public');
  pass('Draft and Pending posters strictly excluded from public site');
  pass('Internal administrative notes and approval histories completely scrubbed');

  const publicTemplates = festivalStore.getPublicPosterTemplates();
  assert(publicTemplates.length >= 5, 'Public templates returned');
  assert(publicTemplates.every(t => t.status === undefined), 'Internal status scrubbed');
  pass('Public templates retrieved and sanitized');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passedTests} PASSED, 0 FAILED`);
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
