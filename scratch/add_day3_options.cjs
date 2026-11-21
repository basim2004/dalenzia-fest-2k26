const fs = require('fs');
const path = require('path');

// 1. ConvenerSchedule.jsx
{
  const p = path.resolve('src/convener/components/ConvenerSchedule.jsx');
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('Dec 23, 2026')) {
    c = c.replace(
      '<option value="Dec 22, 2026">Dec 22, 2026 (Day 02)</option>',
      '<option value="Dec 22, 2026">Dec 22, 2026 (Day 02)</option>\n            <option value="Dec 23, 2026">Dec 23, 2026 (Day 03)</option>'
    );
    c = c.replace(
      '<option value="Dec 22, 2026">Dec 22, 2026</option>',
      '<option value="Dec 22, 2026">Dec 22, 2026</option>\n                      <option value="Dec 23, 2026">Dec 23, 2026</option>'
    );
    fs.writeFileSync(p, c, 'utf8');
    console.log('Updated ConvenerSchedule.jsx with Day 3');
  }
}

// 2. ConvenerProgrammes.jsx
{
  const p = path.resolve('src/convener/components/ConvenerProgrammes.jsx');
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('Dec 23, 2026')) {
    c = c.replace(
      '<option value="Dec 22, 2026">Dec 22, 2026 (Day 02)</option>',
      '<option value="Dec 22, 2026">Dec 22, 2026 (Day 02)</option>\n            <option value="Dec 23, 2026">Dec 23, 2026 (Day 03)</option>'
    );
    c = c.replace(
      '<option value="Dec 22, 2026">Dec 22, 2026</option>',
      '<option value="Dec 22, 2026">Dec 22, 2026</option>\n                      <option value="Dec 23, 2026">Dec 23, 2026</option>'
    );
    fs.writeFileSync(p, c, 'utf8');
    console.log('Updated ConvenerProgrammes.jsx with Day 3');
  }
}

// 3. ConvenerEvents.jsx
{
  const p = path.resolve('src/convener/components/ConvenerEvents.jsx');
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('Dec 23, 2026')) {
    c = c.replace(
      '<option value="Dec 22, 2026">Dec 22, 2026</option>',
      '<option value="Dec 22, 2026">Dec 22, 2026</option>\n                      <option value="Dec 23, 2026">Dec 23, 2026</option>'
    );
    fs.writeFileSync(p, c, 'utf8');
    console.log('Updated ConvenerEvents.jsx with Day 3');
  }
}

// 4. TeamLeaderSchedule.jsx
{
  const p = path.resolve('src/teamleader/components/TeamLeaderSchedule.jsx');
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('Day 3: Dec 23, 2026')) {
    c = c.replace(
      '<option value="Dec 22, 2026">Day 2: Dec 22, 2026</option>',
      '<option value="Dec 22, 2026">Day 2: Dec 22, 2026</option>\n                <option value="Dec 23, 2026">Day 3: Dec 23, 2026</option>'
    );
    fs.writeFileSync(p, c, 'utf8');
    console.log('Updated TeamLeaderSchedule.jsx with Day 3');
  }
}

// 5. ProgrammesModule.jsx
{
  const p = path.resolve('src/admin/components/ProgrammesModule.jsx');
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('Day 03 · Dec 23, 2026')) {
    c = c.replace(
      '{ label: \'Day 02 · Dec 22, 2026\', value: \'Dec 22, 2026\' }',
      '{ label: \'Day 02 · Dec 22, 2026\', value: \'Dec 22, 2026\' },\n  { label: \'Day 03 · Dec 23, 2026\', value: \'Dec 23, 2026\' }'
    );
    c = c.replace(
      '<option value="Dec 22, 2026">Day 02 · Dec 22, 2026</option>',
      '<option value="Dec 22, 2026">Day 02 · Dec 22, 2026</option>\n                      <option value="Dec 23, 2026">Day 03 · Dec 23, 2026</option>'
    );
    fs.writeFileSync(p, c, 'utf8');
    console.log('Updated ProgrammesModule.jsx with Day 3');
  }
}
