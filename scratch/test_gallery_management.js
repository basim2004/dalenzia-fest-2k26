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
console.log('DALENZIA FEST 2K26 - GALLERY MANAGEMENT TESTS');
console.log('====================================================\n');

try {
  // [1] Categories
  console.log('[1] Testing Gallery Categories:');
  const categories = festivalStore.getGalleryCategories();
  assert(Array.isArray(categories) && categories.length >= 8, `Retrieved ${categories.length} gallery categories (expected >= 8)`);
  assert(categories.some(c => c.name === 'Inauguration'), 'Found Inauguration category');
  assert(categories.some(c => c.name === 'Competitions'), 'Found Competitions category');

  // [2] Albums Retrieval
  console.log('\n[2] Testing Initial Albums Retrieval:');
  const albums = festivalStore.getGalleryAlbums();
  assert(albums.length >= 6, `Retrieved ${albums.length} albums (expected >= 6)`);
  const firstAlbum = albums[0];
  assert(firstAlbum && firstAlbum.title, `First album has title: "${firstAlbum?.title}"`);
  assert(firstAlbum.mediaCount >= 3, `First album has dynamic mediaCount: ${firstAlbum.mediaCount}`);
  assert(firstAlbum.photoCount >= 2, `First album has dynamic photoCount: ${firstAlbum.photoCount}`);
  assert(firstAlbum.videoCount >= 1, `First album has dynamic videoCount: ${firstAlbum.videoCount}`);

  // [3] Dashboard Stats
  console.log('\n[3] Testing Dashboard Stats:');
  const stats = festivalStore.getGalleryDashboardStats();
  assert(stats.totalMediaFiles >= 18, `Total media files: ${stats.totalMediaFiles} (expected >= 18)`);
  assert(stats.totalPhotos >= 15, `Total photos: ${stats.totalPhotos} (expected >= 15)`);
  assert(stats.totalVideos >= 3, `Total videos: ${stats.totalVideos} (expected >= 3)`);
  assert(stats.totalAlbums >= 6, `Total albums: ${stats.totalAlbums} (expected >= 6)`);
  assert(stats.publishedMedia >= 17, `Published media: ${stats.publishedMedia} (expected >= 17)`);
  assert(stats.pendingApproval >= 1, `Pending/Draft media: ${stats.pendingApproval} (expected >= 1)`);
  assert(stats.recentUploads.length <= 5, `Recent uploads count: ${stats.recentUploads.length}`);
  assert(stats.recentlyUpdatedAlbums.length <= 5, `Recently updated albums count: ${stats.recentlyUpdatedAlbums.length}`);

  // [4] Media Retrieval & Filtering
  console.log('\n[4] Testing Media Retrieval & Filtering:');
  const allMediaRes = festivalStore.getGalleryMedia();
  assert(allMediaRes.totalCount >= 18, `Total media count in store: ${allMediaRes.totalCount}`);

  const photoOnly = festivalStore.getGalleryMedia({ type: 'photo' });
  assert(photoOnly.media.every(m => m.type === 'photo'), 'Type filter (photo) returned strictly photos');

  const videoOnly = festivalStore.getGalleryMedia({ type: 'video' });
  assert(videoOnly.media.every(m => m.type === 'video'), 'Type filter (video) returned strictly videos');

  const albumFilter = festivalStore.getGalleryMedia({ albumId: 'ALB-01' });
  assert(albumFilter.media.every(m => m.albumId === 'ALB-01'), 'Album filter (ALB-01) returned strictly album media');

  const searchFilter = festivalStore.getGalleryMedia({ query: 'Thuluth' });
  assert(searchFilter.media.some(m => m.title.includes('Thuluth')), 'Search query ("Thuluth") returned matching media');

  // [5] Album Lifecycle: Create, Update, Cover Change, Publish Toggle
  console.log('\n[5] Testing Album Lifecycle:');
  const createdAlbumRes = festivalStore.addGalleryAlbum({
    title: 'Test Championship Album',
    description: 'Temporary album for testing lifecycle operations',
    date: 'Dec 22, 2026',
    category: 'Competitions',
    coverImage: '/assets/models/Dalenzia Fest Events & Competitions.png'
  }, 'Test Admin');

  assert(createdAlbumRes.success, 'Album created successfully');
  const testAlbumId = createdAlbumRes.album.id;
  assert(testAlbumId.startsWith('ALB-'), `Generated album ID: ${testAlbumId}`);

  // Update album
  const updatedAlbumRes = festivalStore.updateGalleryAlbum(testAlbumId, {
    title: 'Updated Championship Album',
    description: 'Updated description for testing'
  }, 'Test Admin');
  assert(updatedAlbumRes.album.title === 'Updated Championship Album', 'Album title updated successfully');

  // Set Album Cover
  const coverRes = festivalStore.setAlbumCover(testAlbumId, '/assets/hero_3d_stage.png', 'Test Admin');
  assert(coverRes.album.coverImage === '/assets/hero_3d_stage.png', 'Album cover image updated successfully');

  // Publish toggle
  festivalStore.publishGalleryAlbum(testAlbumId, false, 'Test Admin');
  let testAlb = festivalStore.getGalleryAlbumById(testAlbumId);
  assert(testAlb.status === 'Draft', 'Album unpublished (status Draft)');

  festivalStore.publishGalleryAlbum(testAlbumId, true, 'Test Admin');
  testAlb = festivalStore.getGalleryAlbumById(testAlbumId);
  assert(testAlb.status === 'Published', 'Album re-published (status Published)');

  // [6] Media Lifecycle: Add Photo, Add Video, Assign, Unassign, Update
  console.log('\n[6] Testing Media Lifecycle:');
  const newPhotoRes = festivalStore.addGalleryMedia({
    title: 'Test Trophy Conferment Photo',
    type: 'photo',
    url: '/assets/main_poster.jpg',
    caption: 'Presentation of grand overall festival trophy.',
    albumId: testAlbumId,
    category: 'Competitions',
    date: 'Dec 22, 2026',
    relatedProgrammeId: 'PRG-011',
    displayOrder: 1,
    status: 'Published'
  }, 'Test Admin');

  assert(newPhotoRes.success, 'Photo media added successfully');
  const testMediaId = newPhotoRes.media.id;
  assert(testMediaId.startsWith('MED-'), `Generated media ID: ${testMediaId}`);
  assert(newPhotoRes.media.relatedProgrammeTitle === 'Grand Valedictory Conclave & Championship Award', 'Related programme title resolved automatically');

  // Add Video
  const newVideoRes = festivalStore.addGalleryMedia({
    title: 'Test Valedictory Highlight Video',
    type: 'video',
    url: '/assets/teaser.mp4',
    caption: 'Cinematic reel of championship celebration.',
    albumId: testAlbumId,
    category: 'Competitions',
    date: 'Dec 22, 2026',
    displayOrder: 2,
    status: 'Published'
  }, 'Test Admin');
  assert(newVideoRes.success, 'Video media added successfully');
  const testVideoId = newVideoRes.media.id;

  // Verify album dynamic count increased
  const albumEnriched = festivalStore.getGalleryAlbumById(testAlbumId);
  assert(albumEnriched.mediaCount === 2, `Album media count increased to 2 (was 0)`);
  assert(albumEnriched.photoCount === 1, 'Album photo count is 1');
  assert(albumEnriched.videoCount === 1, 'Album video count is 1');

  // Update Media
  const updatedMediaRes = festivalStore.updateGalleryMedia(testMediaId, {
    caption: 'Updated presentation caption with special notes.'
  }, 'Test Admin');
  assert(updatedMediaRes.media.caption.includes('Updated presentation'), 'Media caption updated');

  // Unassign media from album (should NOT delete the file)
  const unassignRes = festivalStore.removeMediaFromAlbum(testMediaId, 'Test Admin');
  assert(unassignRes.media.albumId === null, 'Media successfully unassigned from album');
  assert(festivalStore.getGalleryMediaById(testMediaId) !== null, 'Original media record still exists after unassignment');

  // Re-assign media back to album
  festivalStore.assignMediaToAlbum([testMediaId], testAlbumId, 'Test Admin');
  assert(festivalStore.getGalleryMediaById(testMediaId).albumId === testAlbumId, 'Media re-assigned back to album');

  // [7] Safe Album Deletion with Unlinking
  console.log('\n[7] Testing Safe Album Deletion (Unlink Protection):');
  // Deleting album with deleteMedia: false must keep media items unassigned
  festivalStore.deleteGalleryAlbum(testAlbumId, { deleteMedia: false, adminUser: 'Test Admin' });
  assert(festivalStore.getGalleryAlbumById(testAlbumId) === null, 'Album deleted from registry');
  const orphanedCheck = festivalStore.getGalleryMediaById(testMediaId);
  assert(orphanedCheck !== null && orphanedCheck.albumId === null, 'Media was safely unlinked and not destroyed');

  // Now delete the test media items cleanly
  festivalStore.deleteGalleryMedia(testMediaId, { adminUser: 'Test Admin' });
  festivalStore.deleteGalleryMedia(testVideoId, { adminUser: 'Test Admin' });
  assert(festivalStore.getGalleryMediaById(testMediaId) === null, 'Test photo cleaned up');
  assert(festivalStore.getGalleryMediaById(testVideoId) === null, 'Test video cleaned up');

  // [8] Public Website Integration & Privacy Isolation
  console.log('\n[8] Testing Public Gallery Privacy & Sanitization:');
  const publicAlbums = festivalStore.getPublicGalleryAlbums();
  assert(publicAlbums.length >= 6, `Retrieved ${publicAlbums.length} public albums`);
  assert(publicAlbums.every(a => a.status === 'Published' && !a.isArchived), 'Public albums contain ONLY Published, non-archived albums');

  const publicMedia = festivalStore.getPublicGalleryMedia();
  assert(publicMedia.length >= 17, `Retrieved ${publicMedia.length} public media items`);
  assert(publicMedia.every(m => !m.isArchived), 'Public media contains NO archived items');
  // Ensure the 1 draft item (MED-18) is excluded from public media
  assert(!publicMedia.some(m => m.id === 'MED-18'), 'Draft media item MED-18 is strictly EXCLUDED from public view');

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
} catch (e) {
  console.error('Test execution exception:', e);
  process.exit(1);
}
