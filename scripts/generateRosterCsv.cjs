const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/admin/data/festivalStore.js'), 'utf8');
const m = content.match(/const\s+INITIAL_REGISTERED_STUDENTS\s*=\s*\[([\s\S]*?)\];/);
if (!m) {
  console.error('Could not find INITIAL_REGISTERED_STUDENTS');
  process.exit(1);
}

const students = eval('[' + m[1] + ']');

// Headers required: Student ID, Chest No, Full Name, Category, Team, DOB, Institution, Phone, Email, Events Count, Points, Status
const rows = [
  ['Student ID', 'Chest No', 'Full Name', 'Category', 'Team', 'DOB', 'Institution', 'Phone', 'Email', 'Events Count', 'Points', 'Status']
];

students.forEach((s, idx) => {
  rows.push([
    s.id,
    s.chestNo,
    s.name,
    s.classCategory,
    s.teamName,
    s.dob || '2008-05-15',
    s.institution || 'Dalailussunna Dars, Ayiroor',
    s.phone || '+91 8589951951',
    s.email || (s.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@dalanzia.org'),
    (idx % 4 + 1).toString(),
    ((idx % 5) * 5 + 10).toString(),
    'Active'
  ]);
});

// Malayalam and long name test cases
rows.push([
  'STU-1047',
  'C-147',
  'മുഹമ്മദ് അൻഷിദ്',
  'Junior',
  'Dazzlers',
  '2009-02-14',
  'Dalailussunna Dars, Ayiroor',
  '+91 98471 20047',
  'anshid.m@dalanzia.org',
  '3',
  '15',
  'Active'
]);

rows.push([
  'STU-1048',
  'C-148',
  'ഹാഫിസ് ഹസ്സൻ',
  'Senior',
  'Dynamos',
  '2006-11-20',
  'Dalailussunna Dars, Ayiroor',
  '+91 98471 20048',
  'hafizhassan@dalanzia.org',
  '4',
  '20',
  'Active'
]);

rows.push([
  'STU-1049',
  'C-149',
  'Sayyid Muhammed Dilbar Thangal Al-Bukhari',
  'Senior',
  'Dazzlers',
  '2007-06-18',
  'Dalailussunna Dars, Ayiroor',
  '+91 98471 20049',
  'dilbar.thangal@dalanzia.org',
  '2',
  '10',
  'Active'
]);

// Inactive test rows (to test skipping non-active rows & listing in summary)
rows.push([
  'STU-1050',
  'C-150',
  'Zubair Ahmed (Withdrawn)',
  'Junior',
  'Dynamos',
  '2008-01-10',
  'Dalailussunna Dars, Ayiroor',
  '+91 98471 20050',
  'zubair@dalanzia.org',
  '0',
  '0',
  'Inactive'
]);

rows.push([
  'STU-1051',
  'C-151',
  'Kamil Mustafa (Medical Leave)',
  'Sub Junior',
  'Dazzlers',
  '2010-09-05',
  'Dalailussunna Dars, Ayiroor',
  '+91 98471 20051',
  'kamil@dalanzia.org',
  '0',
  '0',
  'Inactive'
]);

function toCSV(data) {
  return data.map(row =>
    row.map(val => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }).join(',')
  ).join('\r\n');
}

const csvString = toCSV(rows);

const targetDirs = [
  path.join(__dirname, '../src/data'),
  path.join(__dirname, '../public/data'),
  path.join(__dirname, '../public/assets')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, 'dalenzia_students_roster_2026-11-28.csv');
  fs.writeFileSync(filePath, csvString, 'utf8');
  console.log('Successfully wrote:', filePath);
});

console.log('Total students generated in roster:', rows.length - 1);
