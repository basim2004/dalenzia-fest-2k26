const fs = require('fs');

const storePath = 'src/admin/data/festivalStore.js';
let content = fs.readFileSync(storePath, 'utf8');

console.log('Current store length:', content.length);
console.log('Includes posterCategories?', content.includes('posterCategories:'));
console.log('Includes posterTemplates:', content.includes('posterTemplates:'));
