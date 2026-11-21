import fs from 'fs';

const filePath = 'c:/basim/dalanzia/src/admin/data/festivalStore.js';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to remove all occurrences of programmeStages and programmeSchedules
const stageAndSchedRegex = /\s*\/\/\s*3[de]\.[\s\S]*?(?=\s*\/\/|\s*guestCategories:|\s*teams:|\s*programmeCategories:|\s*judges:|\s*programmeGuests:|\s*resultPosters:|\s*notifications:|\s*auditLogs:|\s*submittedEvaluations:|\s*programmeAssignments:)/g;

content = content.replace(stageAndSchedRegex, '');

// Clean any leftover programmeStages or programmeSchedules property blocks
const leftoverStages = /\s*programmeStages:\s*\[[\s\S]*?\],/g;
content = content.replace(leftoverStages, '');

const leftoverSched = /\s*programmeSchedules:\s*\[[\s\S]*?\],/g;
content = content.replace(leftoverSched, '');

const stageData = `
  // 3d. Official Festival Stages (Step 08 - Programme Schedule)
  programmeStages: [
    {
      id: 'STG-01',
      code: 'STG-01',
      name: 'Cordova Grand Stage (Stage 01)',
      shortName: 'Cordova Grand Stage',
      malayalamName: 'കൊർദോവ വേദി',
      venue: 'Cordova Grand Stage',
      type: 'Ceremonial Grand Auditorium',
      capacity: 2500,
      color: '#A91F35',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'STG-02',
      code: 'STG-02',
      name: 'Al-Farabi Heritage Hall (Stage 02)',
      shortName: 'Al-Farabi Heritage Hall',
      malayalamName: 'അൽ ഫാറാബി ഹാൾ',
      venue: 'Al-Farabi Heritage Hall',
      type: 'Academic Conclave Arena',
      capacity: 800,
      color: '#E6A916',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'STG-03',
      code: 'STG-03',
      name: 'Ibn Khaldun Academic Hall (Stage 03)',
      shortName: 'Ibn Khaldun Academic Hall',
      malayalamName: 'ഇബ്നു ഖൽദൂൻ ഹാൾ',
      venue: 'Ibn Khaldun Academic Hall',
      type: 'Colloquium & Debate Chamber',
      capacity: 600,
      color: '#2563EB',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'STG-04',
      code: 'STG-04',
      name: 'Media Studio Preview Room',
      shortName: 'Media Studio',
      malayalamName: 'മീഡിയ സ്റ്റുഡിയോ റൂം',
      venue: 'Media Studio Preview Room',
      type: 'Screening & Curation Studio',
      capacity: 350,
      color: '#8B5CF6',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'STG-05',
      code: 'STG-05',
      name: 'Open Amphitheatre',
      shortName: 'Open Amphitheatre',
      malayalamName: 'ഓപ്പൺ ആംഫി തിയേറ്റർ',
      venue: 'Open Amphitheatre',
      type: 'Open Cultural Arena',
      capacity: 1200,
      color: '#10B981',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ],

  // 3e. Official Festival Programme Schedules (Step 08 - Programme Schedule)
  programmeSchedules: [
    {
      id: 'SCH-01',
      programmeId: 'PRG-001',
      programmeCode: 'PRG-ADM-01',
      programmeTitle: 'Delegate Reception & Registration Check-in',
      date: 'Dec 21, 2026',
      startTime: '08:00 AM',
      endTime: '09:00 AM',
      timeRange: '08:00 AM – 09:00 AM',
      stage: 'Cordova Grand Stage (Stage 01)',
      stageId: 'STG-01',
      coordinatorName: 'Prof. K.V. Zaid',
      coordinatorPhone: '+91 98470 11223',
      assignedGuestIds: [],
      notes: 'Registration kits distribution, ID card scanning, and holding pavilion allocation.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T08:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-02',
      programmeId: 'PRG-002',
      programmeCode: 'PRG-INA-02',
      programmeTitle: 'Grand Inauguration Ceremony & Lamp Lighting',
      date: 'Dec 21, 2026',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      timeRange: '09:00 AM – 11:00 AM',
      stage: 'Cordova Grand Stage (Stage 01)',
      stageId: 'STG-01',
      coordinatorName: 'Sayyid Aslam Ayiroor',
      coordinatorPhone: '+91 98471 44556',
      assignedGuestIds: ['GST-04'],
      notes: 'Ceremonial opening, lamp lighting, opening prayer, and keynote address by visiting dignitary.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T08:30:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-03',
      programmeId: 'PRG-003',
      programmeCode: 'PRG-CON-03',
      programmeTitle: 'Keynote Conclave: Nueva Era & Classical Heritage',
      date: 'Dec 21, 2026',
      startTime: '11:30 AM',
      endTime: '01:00 PM',
      timeRange: '11:30 AM – 01:00 PM',
      stage: 'Al-Farabi Heritage Hall (Stage 02)',
      stageId: 'STG-02',
      coordinatorName: 'Prof. Abdul Majeed',
      coordinatorPhone: '+91 94472 66778',
      assignedGuestIds: ['GST-02'],
      notes: 'Scholastic address by Dr. Ahmed Faris on tradition and innovation.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T09:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-04',
      programmeId: 'PRG-004',
      programmeCode: 'PRG-CMP-04',
      programmeTitle: 'Junior Arabic Essay Colloquium & Finals',
      date: 'Dec 21, 2026',
      startTime: '02:00 PM',
      endTime: '04:30 PM',
      timeRange: '02:00 PM – 04:30 PM',
      stage: 'Ibn Khaldun Academic Hall (Stage 03)',
      stageId: 'STG-03',
      coordinatorName: 'Usthad Rashad',
      coordinatorPhone: '+91 97455 88990',
      assignedGuestIds: [],
      notes: 'On-stage evaluation colloquium and reading of top qualifying essays.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T09:30:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-05',
      programmeId: 'PRG-005',
      programmeCode: 'PRG-CMP-05',
      programmeTitle: 'Senior Malayalam Elocution Grand Stage',
      date: 'Dec 21, 2026',
      startTime: '04:30 PM',
      endTime: '06:30 PM',
      timeRange: '04:30 PM – 06:30 PM',
      stage: 'Cordova Grand Stage (Stage 01)',
      stageId: 'STG-01',
      coordinatorName: 'Sayyid Aslam Ayiroor',
      coordinatorPhone: '+91 98471 44556',
      assignedGuestIds: ['GST-07'],
      notes: 'Championship oratorical contest featuring top seeded house speakers.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-06',
      programmeId: 'PRG-006',
      programmeCode: 'PRG-CON-06',
      programmeTitle: 'Evening Scholastic Assembly: Tradition Radiating Forward',
      date: 'Dec 21, 2026',
      startTime: '07:00 PM',
      endTime: '09:00 PM',
      timeRange: '07:00 PM – 09:00 PM',
      stage: 'Al-Farabi Heritage Hall (Stage 02)',
      stageId: 'STG-02',
      coordinatorName: 'Prof. K.V. Zaid',
      coordinatorPhone: '+91 98470 11223',
      assignedGuestIds: ['GST-01'],
      notes: 'Special discourse by Usthad Muhammed Rashid on moral foundations.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T10:30:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-07',
      programmeId: 'PRG-007',
      programmeCode: 'PRG-CMP-07',
      programmeTitle: 'Hifz Qur’an Recitation Grand Finals',
      date: 'Dec 22, 2026',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      timeRange: '09:00 AM – 11:00 AM',
      stage: 'Cordova Grand Stage (Stage 01)',
      stageId: 'STG-01',
      coordinatorName: 'Sayyid Aslam Ayiroor',
      coordinatorPhone: '+91 98471 44556',
      assignedGuestIds: [],
      notes: 'Tajweed and memorization adjudication before grand jury.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T11:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-08',
      programmeId: 'PRG-008',
      programmeCode: 'PRG-CON-08',
      programmeTitle: 'Scholastic Symposia: Classical Texts in Modern Contexts',
      date: 'Dec 22, 2026',
      startTime: '11:30 AM',
      endTime: '01:00 PM',
      timeRange: '11:30 AM – 01:00 PM',
      stage: 'Al-Farabi Heritage Hall (Stage 02)',
      stageId: 'STG-02',
      coordinatorName: 'Prof. Abdul Majeed',
      coordinatorPhone: '+91 94472 66778',
      assignedGuestIds: ['GST-03'],
      notes: 'Symposium on manuscript preservation and contemporary ethical reasoning.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T11:30:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-09',
      programmeId: 'PRG-009',
      programmeCode: 'PRG-CMP-09',
      programmeTitle: 'Classical Arabic Munadarah / Parliamentary Debate Finals',
      date: 'Dec 22, 2026',
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      timeRange: '02:00 PM – 04:00 PM',
      stage: 'Ibn Khaldun Academic Hall (Stage 03)',
      stageId: 'STG-03',
      coordinatorName: 'Usthad Rashad',
      coordinatorPhone: '+91 97455 88990',
      assignedGuestIds: [],
      notes: 'Inter-house dialectic tournament in formal Classical Arabic.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T12:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-10',
      programmeId: 'PRG-010',
      programmeCode: 'PRG-CMP-10',
      programmeTitle: 'Media Curation, Film & Graphic Arts Screening',
      date: 'Dec 22, 2026',
      startTime: '04:30 PM',
      endTime: '06:30 PM',
      timeRange: '04:30 PM – 06:30 PM',
      stage: 'Media Studio Preview Room',
      stageId: 'STG-04',
      coordinatorName: 'Prof. K.V. Zaid',
      coordinatorPhone: '+91 98470 11223',
      assignedGuestIds: ['GST-08'],
      notes: 'Public projection and jury critique of creative media entries.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T12:30:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-11',
      programmeId: 'PRG-011',
      programmeCode: 'PRG-VAL-11',
      programmeTitle: 'Grand Valedictory Assembly & Championship Conferment',
      date: 'Dec 22, 2026',
      startTime: '07:30 PM',
      endTime: '09:30 PM',
      timeRange: '07:30 PM – 09:30 PM',
      stage: 'Cordova Grand Stage (Stage 01)',
      stageId: 'STG-01',
      coordinatorName: 'Sayyid Aslam Ayiroor',
      coordinatorPhone: '+91 98471 44556',
      assignedGuestIds: ['GST-05', 'GST-06'],
      notes: 'Official trophy presentation, presidential valedictory, and closing blessings.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T13:00:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    },
    {
      id: 'SCH-12',
      programmeId: 'PRG-012',
      programmeCode: 'PRG-WKS-12',
      programmeTitle: 'Digital Heritage & Calligraphic Design Workshop',
      date: 'Dec 22, 2026',
      startTime: '03:00 PM',
      endTime: '05:00 PM',
      timeRange: '03:00 PM – 05:00 PM',
      stage: 'Open Amphitheatre',
      stageId: 'STG-05',
      coordinatorName: 'Usthad Rashad',
      coordinatorPhone: '+91 97455 88990',
      assignedGuestIds: [],
      notes: 'Interactive workshop on classical scripts and digital calligraphy tools.',
      status: 'Scheduled',
      isPublished: true,
      isArchived: false,
      createdAt: '2026-11-01T13:30:00Z',
      updatedAt: '2026-11-18T10:00:00Z'
    }
  ],
`;

// Insert exactly before guestCategories
const target = '  // 3b. Guest Categories\n  guestCategories: [';
if (content.includes(target)) {
  content = content.replace(target, stageData + '\n' + target);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully inserted clean stages and schedules.');
} else {
  console.error('Target not found!');
}
