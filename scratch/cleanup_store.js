import fs from 'fs';

const filePath = 'c:/basim/dalanzia/src/admin/data/festivalStore.js';
let content = fs.readFileSync(filePath, 'utf8');

// The block that was duplicated:
const blockRegex = /\n  \/\/ 3d\. Official Festival Stages \(Step 08 - Programme Schedule\)[\s\S]*?  \],(?=\s*\/\/|\s*teams:|\s*programmeCategories:|\s*judges:|\s*programmeGuests:|\s*resultPosters:|\s*notifications:|\s*auditLogs:|\s*submittedEvaluations:|\s*programmeAssignments:)/g;

const matches = content.match(blockRegex);
console.log(`Found ${matches ? matches.length : 0} occurrences of duplicated block.`);

if (matches && matches.length > 0) {
  content = content.replace(blockRegex, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned up duplicated blocks.');
}
