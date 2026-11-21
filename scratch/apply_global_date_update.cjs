const fs = require('fs');
const path = require('path');

const updates = [
  // 1. festivalStore.js
  {
    file: 'src/admin/data/festivalStore.js',
    replaces: [
      {
        target: `export const INITIAL_CONVENER_USER = {`,
        replacement: `export const FESTIVAL_DATE_CONFIG = {
  officialDate: '21, 22, 23 DECEMBER 2026',
  officialDateFormatted: '21, 22, 23 DECEMBER 2026',
  year: '2026',
  month: 'DECEMBER',
  days: ['21', '22', '23'],
  daysFormatted: '21, 22, 23',
  startDate: '2026-12-21',
  endDate: '2026-12-23',
  day1: 'Dec 21, 2026',
  day2: 'Dec 22, 2026',
  day3: 'Dec 23, 2026'
};

export const INITIAL_CONVENER_USER = {`
      },
      {
        target: `// 2. Festival Date Restriction (December 21–22, 2026)
    const validDates = ['Dec 21, 2026', 'Dec 22, 2026', 'December 21, 2026', 'December 22, 2026', '2026-12-21', '2026-12-22'];
    if (!validDates.includes(date)) {
      conflicts.push({
        type: 'INVALID_FESTIVAL_DATE',
        severity: 'HIGH',
        message: \`Selected date "\${date}" is outside official festival dates (December 21–22, 2026).\``,
        replacement: `// 2. Festival Date Restriction (21, 22, 23 DECEMBER 2026)
    const validDates = ['Dec 21, 2026', 'Dec 22, 2026', 'Dec 23, 2026', 'December 21, 2026', 'December 22, 2026', 'December 23, 2026', '2026-12-21', '2026-12-22', '2026-12-23', '21, 22, 23 DECEMBER 2026'];
    if (!validDates.includes(date)) {
      conflicts.push({
        type: 'INVALID_FESTIVAL_DATE',
        severity: 'HIGH',
        message: \`Selected date "\${date}" is outside official festival dates (21, 22, 23 DECEMBER 2026).\``
      },
      {
        target: `message: 'The official Programme Schedule for Dec 21–22 has been certified by the Convener Secretariat.',`,
        replacement: `message: 'The official Programme Schedule for 21, 22, 23 DECEMBER 2026 has been certified by the Convener Secretariat.',`
      },
      {
        target: `festivalDates: 'December 21–22, 2026',`,
        replacement: `festivalDates: '21, 22, 23 DECEMBER 2026',`
      }
    ]
  },

  // 2. DashboardView.jsx
  {
    file: 'src/admin/components/DashboardView.jsx',
    replaces: [
      {
        target: `Dec 21–22, 2026 • Dalailussunna Dars, Ayiroor`,
        replacement: `21, 22, 23 DECEMBER 2026 • Dalailussunna Dars, Ayiroor`
      }
    ]
  },

  // 3. StudentsModule.jsx
  {
    file: 'src/admin/components/StudentsModule.jsx',
    replaces: [
      {
        target: `<div>DEC 21-22, 2026</div>`,
        replacement: `<div>21, 22, 23 DECEMBER 2026</div>`
      }
    ]
  },

  // 4. ScheduleModule.jsx
  {
    file: 'src/admin/components/ScheduleModule.jsx',
    replaces: [
      {
        target: `const FESTIVAL_DATES = [
  { value: 'Dec 21, 2026', label: 'Day 01 · Monday, Dec 21, 2026', short: 'Day 01 (Dec 21)' },
  { value: 'Dec 22, 2026', label: 'Day 02 · Tuesday, Dec 22, 2026', short: 'Day 02 (Dec 22)' }
];`,
        replacement: `const FESTIVAL_DATES = [
  { value: 'Dec 21, 2026', label: 'Day 01 · Monday, Dec 21, 2026', short: 'Day 01 (Dec 21)' },
  { value: 'Dec 22, 2026', label: 'Day 02 · Tuesday, Dec 22, 2026', short: 'Day 02 (Dec 22)' },
  { value: 'Dec 23, 2026', label: 'Day 03 · Wednesday, Dec 23, 2026', short: 'Day 03 (Dec 23)' }
];`
      },
      {
        target: `<span className="font-bold text-[#A91F35]">Dec 21 &amp; Dec 22, 2026</span>`,
        replacement: `<span className="font-bold text-[#A91F35]">21, 22, 23 DECEMBER 2026</span>`
      }
    ]
  },

  // 5. AboutSection.jsx
  {
    file: 'src/components/AboutSection.jsx',
    replaces: [
      {
        target: `<span>December 21 – 22, 2026</span>`,
        replacement: `<span>21, 22, 23 DECEMBER 2026</span>`
      }
    ]
  },

  // 6. CinematicHero.jsx
  {
    file: 'src/components/CinematicHero.jsx',
    replaces: [
      {
        target: `December 21 – 22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      }
    ]
  },

  // 7. FestivalCountdownStage.jsx
  {
    file: 'src/components/FestivalCountdownStage.jsx',
    replaces: [
      {
        target: `Join the grand congregation at Dalailussunna Dars, Ayiroor on December 21, 2026.`,
        replacement: `Join the grand congregation at Dalailussunna Dars, Ayiroor on 21, 22, 23 DECEMBER 2026.`
      }
    ]
  },

  // 8. FestivalDiscovery.jsx
  {
    file: 'src/components/FestivalDiscovery.jsx',
    replaces: [
      {
        target: `tagline: 'DECEMBER 21 – 22, 2026',`,
        replacement: `tagline: '21, 22, 23 DECEMBER 2026',`
      }
    ]
  },

  // 9. Footer.jsx
  {
    file: 'src/components/Footer.jsx',
    replaces: [
      {
        target: `<span className="text-white font-bold">December 21–22, 2026</span>`,
        replacement: `<span className="text-white font-bold">21, 22, 23 DECEMBER 2026</span>`
      }
    ]
  },

  // 10. Hero3D.jsx
  {
    file: 'src/components/Hero3D.jsx',
    replaces: [
      {
        target: `Dec 21–22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      },
      {
        target: `2026 DEC 21, 22`,
        replacement: `21, 22, 23 DECEMBER 2026`
      }
    ]
  },

  // 11. Navbar.jsx
  {
    file: 'src/components/Navbar.jsx',
    replaces: [
      {
        target: `Second Edition · December 21–22, 2026`,
        replacement: `Second Edition · 21, 22, 23 DECEMBER 2026`
      }
    ]
  },

  // 12. PosterModal.jsx
  {
    file: 'src/components/PosterModal.jsx',
    replaces: [
      {
        target: `ctx.fillText('December 21–22, 2026 · Perumpadappu, Malappuram', width / 2, 1200);`,
        replacement: `ctx.fillText('21, 22, 23 DECEMBER 2026 · Perumpadappu, Malappuram', width / 2, 1200);`
      }
    ]
  },

  // 13. ResultFinder.jsx
  {
    file: 'src/components/ResultFinder.jsx',
    replaces: [
      {
        target: `<span className="text-[#A91F35] font-semibold">Dec 21–22, 2026</span>`,
        replacement: `<span className="text-[#A91F35] font-semibold">21, 22, 23 DECEMBER 2026</span>`
      }
    ]
  },

  // 14. ScheduleTimeline.jsx
  {
    file: 'src/components/ScheduleTimeline.jsx',
    replaces: [
      {
        target: `? 'Complete timeline for Dec 21–22, 2026'`,
        replacement: `? 'Complete timeline for 21, 22, 23 DECEMBER 2026'`
      }
    ]
  },

  // 15. ConvenerLayout.jsx
  {
    file: 'src/convener/components/ConvenerLayout.jsx',
    replaces: [
      {
        target: `<span className="text-[10px] text-white/60 font-mono">Dec 21–22</span>`,
        replacement: `<span className="text-[10px] text-white/60 font-mono">21, 22, 23 DEC 2026</span>`
      }
    ]
  },

  // 16. ConvenerLogin.jsx
  {
    file: 'src/convener/components/ConvenerLogin.jsx',
    replaces: [
      {
        target: `<span className="text-[10px] text-stone-400">Festival Dates: Dec 21–22, 2026</span>`,
        replacement: `<span className="text-[10px] text-stone-400">Festival Dates: 21, 22, 23 DECEMBER 2026</span>`
      }
    ]
  },

  // 17. AboutPage.jsx
  {
    file: 'src/pages/AboutPage.jsx',
    replaces: [
      {
        target: `year: 'DEC 21–22, 2026',`,
        replacement: `year: '21, 22, 23 DECEMBER 2026',`
      },
      {
        target: `December 21 – 22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      }
    ]
  },

  // 18. EventsPage.jsx
  {
    file: 'src/pages/EventsPage.jsx',
    replaces: [
      {
        target: `December 21 – 22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      },
      {
        target: `desc: 'Report to Dalailussunna Dars, Ayiroor on December 21, 2026, receive your stage credentials and compete!'`,
        replacement: `desc: 'Report to Dalailussunna Dars, Ayiroor on 21, 22, 23 DECEMBER 2026, receive your stage credentials and compete!'`
      },
      {
        target: `Festival Date: December 21–22, 2026`,
        replacement: `Festival Date: 21, 22, 23 DECEMBER 2026`
      }
    ]
  },

  // 19. GalleryPage.jsx
  {
    file: 'src/pages/GalleryPage.jsx',
    replaces: [
      {
        target: `Live broadcast feeds and recorded transmission reels from Dalenzia Fest 2K26 are scheduled for <strong>December 21–22, 2026</strong>.`,
        replacement: `Live broadcast feeds and recorded transmission reels from Dalenzia Fest 2K26 are scheduled for <strong>21, 22, 23 DECEMBER 2026</strong>.`
      }
    ]
  },

  // 20. GuestsPage.jsx
  {
    file: 'src/pages/GuestsPage.jsx',
    replaces: [
      {
        target: `December 21 – 22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      }
    ]
  },

  // 21. PreviousEditionPage.jsx (Only update 2K26 invitation line, NOT 2K25 historical content)
  {
    file: 'src/pages/PreviousEditionPage.jsx',
    replaces: [
      {
        target: `Join the second edition taking place on December 21–22, 2026. Explore live schedules, candidate registrations, and official scorecards.`,
        replacement: `Join the second edition taking place on 21, 22, 23 DECEMBER 2026. Explore live schedules, candidate registrations, and official scorecards.`
      }
    ]
  },

  // 22. ResultsPage.jsx
  {
    file: 'src/pages/ResultsPage.jsx',
    replaces: [
      {
        target: `Second Edition · December 21–22, 2026 · Dalailussunna Dars, Ayiroor, Kerala`,
        replacement: `Second Edition · 21, 22, 23 DECEMBER 2026 · Dalailussunna Dars, Ayiroor, Kerala`
      }
    ]
  },

  // 23. SchedulePage.jsx
  {
    file: 'src/pages/SchedulePage.jsx',
    replaces: [
      {
        target: `December 21 – 22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      },
      {
        target: `Dalenzia Fest 2K26 · December 21–22, 2026 · Ayiroor, Malappuram`,
        replacement: `Dalenzia Fest 2K26 · 21, 22, 23 DECEMBER 2026 · Ayiroor, Malappuram`
      }
    ]
  },

  // 24. StudentDashboard.jsx
  {
    file: 'src/student/components/StudentDashboard.jsx',
    replaces: [
      {
        target: `{ label: 'My Personalized Schedule', desc: 'Timeline for Dec 21–22', icon: Clock, action: 'schedule' },`,
        replacement: `{ label: 'My Personalized Schedule', desc: 'Timeline for 21, 22, 23 DECEMBER 2026', icon: Clock, action: 'schedule' },`
      },
      {
        target: `<div className="font-bold text-[11px]">Dec 21–22, 2026</div>`,
        replacement: `<div className="font-bold text-[11px]">21, 22, 23 DECEMBER 2026</div>`
      }
    ]
  },

  // 25. StudentIdCard.jsx
  {
    file: 'src/student/components/StudentIdCard.jsx',
    replaces: [
      {
        target: `Dalailussunna Dars, Ayiroor • Dec 21–22, 2026`,
        replacement: `Dalailussunna Dars, Ayiroor • 21, 22, 23 DECEMBER 2026`
      },
      {
        target: `<span>Valid: Dec 21–22, 2026</span>`,
        replacement: `<span>Valid: 21, 22, 23 DECEMBER 2026</span>`
      }
    ]
  },

  // 26. StudentPosters.jsx
  {
    file: 'src/student/components/StudentPosters.jsx',
    replaces: [
      {
        target: `<span>{pos.date || 'Dec 21–22, 2026'}</span>`,
        replacement: `<span>{pos.date || '21, 22, 23 DECEMBER 2026'}</span>`
      }
    ]
  },

  // 27. StudentResults.jsx
  {
    file: 'src/student/components/StudentResults.jsx',
    replaces: [
      {
        target: `Dec 21–22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      }
    ]
  },

  // 28. StudentSchedule.jsx
  {
    file: 'src/student/components/StudentSchedule.jsx',
    replaces: [
      {
        target: `Combined chronological timeline of your stage arenas and festival sessions across Dec 21–22, 2026.`,
        replacement: `Combined chronological timeline of your stage arenas and festival sessions across 21, 22, 23 DECEMBER 2026.`
      }
    ]
  },

  // 29. TeamLeaderSchedule.jsx
  {
    file: 'src/teamleader/components/TeamLeaderSchedule.jsx',
    replaces: [
      {
        target: `December 21–22, 2026`,
        replacement: `21, 22, 23 DECEMBER 2026`
      },
      {
        target: `<option value="all">All Dates (Dec 21–22)</option>`,
        replacement: `<option value="all">All Dates (21, 22, 23 DECEMBER 2026)</option>`
      }
    ]
  },

  // 30. RegistrationBanner.jsx
  {
    file: 'src/components/RegistrationBanner.jsx',
    replaces: [
      {
        target: `<span>{lang === 'en' ? 'Registration Is Active' : 'രജിസ്ട്രേഷൻ പുരോഗമിക്കുന്നു'}</span>`,
        replacement: `<span>{lang === 'en' ? '21, 22, 23 DECEMBER 2026 • Registration Active' : '21, 22, 23 ഡിസംബർ 2026 • രജിസ്ട്രേഷൻ പുരോഗമിക്കുന്നു'}</span>`
      }
    ]
  },

  // 31. WhatsAppCommunitySection.jsx
  {
    file: 'src/components/WhatsAppCommunitySection.jsx',
    replaces: [
      {
        target: `Join our official WhatsApp group for festival updates, announcements, important information and memorable moments.`,
        replacement: `Join our official WhatsApp group for 21, 22, 23 DECEMBER 2026 festival updates, announcements, live alerts and memorable moments.`
      }
    ]
  },

  // 32. InstagramShowcaseSection.jsx
  {
    file: 'src/components/InstagramShowcaseSection.jsx',
    replaces: [
      {
        target: `Connect with our visual stories, live updates, candidate performances, and scholastic heritage across both official Instagram profiles.`,
        replacement: `Connect with our 21, 22, 23 DECEMBER 2026 visual stories, live updates, candidate performances, and scholastic heritage across both official Instagram profiles.`
      }
    ]
  },

  // 33. JudgePortal.jsx
  {
    file: 'src/judge/JudgePortal.jsx',
    replaces: [
      {
        target: `designation: 'Festival Jury Head',`,
        replacement: `designation: 'Festival Jury Head • 21, 22, 23 DECEMBER 2026',`
      }
    ]
  },

  // 34. StageControllerPortal.jsx
  {
    file: 'src/stagecontroller/StageControllerPortal.jsx',
    replaces: [
      {
        target: `<h1 className="text-sm font-bold text-stone-900 tracking-tight">Stage Controller Portal</h1>`,
        replacement: `<h1 className="text-sm font-bold text-stone-900 tracking-tight">Stage Controller Portal · 21, 22, 23 DECEMBER 2026</h1>`
      }
    ]
  },

  // 35. index.html
  {
    file: 'index.html',
    replaces: [
      {
        target: `<title>Dalenzia Fest 2026 – Nueva Era | Dalailussunna Dars, Ayiroor</title>`,
        replacement: `<title>Dalenzia Fest 2K26 – 21, 22, 23 DECEMBER 2026 | Nueva Era</title>`
      }
    ]
  }
];

let totalModified = 0;
let totalReplaced = 0;

updates.forEach(u => {
  const filePath = path.resolve(u.file);
  if (!fs.existsSync(filePath)) {
    console.error(`File NOT found: ${u.file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileChanged = false;

  u.replaces.forEach((r, idx) => {
    if (content.includes(r.target)) {
      content = content.replace(r.target, r.replacement);
      totalReplaced++;
      fileChanged = true;
      console.log(`[OK] ${u.file} replaced snippet #${idx + 1}`);
    } else {
      console.warn(`[WARN] Target not found in ${u.file}: "${r.target.slice(0, 50)}..."`);
    }
  });

  if (fileChanged) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalModified++;
  }
});

console.log(`\nDone! Modified ${totalModified} files with ${totalReplaced} replacements.`);
