const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/pages/SchedulePage.jsx');
let file = fs.readFileSync(filePath, 'utf8');

const day3Data = `  },
  day3: {
    dayId: 'day3',
    dayLabel: 'Day 03',
    dateLabel: 'Wednesday · December 23, 2026',
    dateShort: 'Dec 23, 2026',
    themeHighlight: 'Championship Finals, Grand Valedictory & Award Ceremonies',
    programmes: [
      {
        id: 'p3-01',
        time: '08:30 AM – 11:30 AM',
        title: 'Grand Finale Showcase & Inter-Squad Contests',
        malayalam: 'ഗ്രാൻഡ് ഫിനാലെ മത്സരങ്ങൾ',
        category: 'competitions',
        categoryLabel: 'Competitions',
        venue: 'Cordova Grand Stage',
        status: 'Scheduled',
        desc: 'Concluding high-stakes stage rounds and finale presentations between qualifying squads across all arenas.',
        guest: 'Festival Steering Committee',
        icon: Trophy
      },
      {
        id: 'p3-02',
        time: '11:30 AM – 01:00 PM',
        title: 'Scholastic Conclave & Valedictory Keynote Discourse',
        malayalam: 'പണ്ഡിത സമ്മേളനം & സമാപന പ്രഭാഷണം',
        category: 'sessions',
        categoryLabel: 'Guest Sessions',
        venue: 'Cordova Grand Stage',
        status: 'Scheduled',
        desc: 'Special discourse on the transformative power of faith, intellect, and creativity in the nueva era.',
        guest: 'Senior Islamic Scholars & Thought Leaders',
        icon: Mic
      },
      {
        id: 'p3-03',
        time: '01:00 PM – 02:30 PM',
        title: 'Congregational Prayer & Festive Feast',
        malayalam: 'പ്രാർത്ഥന & വിരുന്ന്',
        category: 'recess',
        categoryLabel: 'Recess',
        venue: 'Campus Mosque & Dining Quadrangle',
        status: 'Scheduled',
        desc: 'Communal banquet for all registered scholars, patrons, faculty, and visiting guests.',
        guest: 'Hospitality Board',
        icon: Clock
      },
      {
        id: 'p3-04',
        time: '03:00 PM – 06:30 PM',
        title: 'Grand Valedictory Session & Award Ceremony',
        malayalam: 'സമാപന മഹാസമ്മേളനം & അവാർഡ് ദാനം',
        category: 'ceremony',
        categoryLabel: 'Award Ceremony',
        venue: 'Cordova Grand Stage',
        status: 'Scheduled',
        desc: 'Presentation of the coveted Dalenzia Fest 2K26 Championship Trophy, Individual Laureate honours, and special awards.',
        guest: 'Chief Patrons & Esteemed Leaders',
        icon: Award
      },
      {
        id: 'p3-05',
        time: '07:30 PM – 10:00 PM',
        title: 'Closing Cultural Symphony & Benediction',
        malayalam: 'സമാപന സാംസ്കാരിക സന്ധ്യ & പ്രാർത്ഥന',
        category: 'cultural',
        categoryLabel: 'Cultural Programmes',
        venue: 'Cordova Grand Stage',
        status: 'Scheduled',
        desc: 'Sufi choral symphony ensemble, traditional choral odes, and final blessing prayers by the Sadath Council.',
        guest: 'Sufi Ensemble & Sadath Council',
        icon: Music
      }
    ]
  }
};`;

if (!file.includes('day3: {')) {
  file = file.replace(/(\n\s*\}\n\s*\]\n\s*\}\n\};)/, day3Data);
}

// Update tabs
const oldTabs = `              {[
                { id: 'day1', label: 'DAY 01', date: 'DEC 21, 2026' },
                { id: 'day2', label: 'DAY 02', date: 'DEC 22, 2026' }
              ]`;

const newTabs = `              {[
                { id: 'day1', label: 'DAY 01', date: 'DEC 21, 2026' },
                { id: 'day2', label: 'DAY 02', date: 'DEC 22, 2026' },
                { id: 'day3', label: 'DAY 03', date: 'DEC 23, 2026' }
              ]`;

file = file.replace(oldTabs, newTabs);
file = file.replace('max-w-md w-full', 'max-w-lg w-full');
file = file.replace(
  'Select between Day 01 and Day 02 to view the sequence of competitive arenas',
  'Explore the official 3-day schedule across 21, 22, 23 DECEMBER 2026 to view the sequence of competitive arenas'
);

// Add Day 03 to printable table if not present
const day3PrintTable = `                {/* Day 03 Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-[#A91F35] pb-1">
                    <h4 className="text-base font-serif font-bold text-[#A91F35]">
                      DAY 03 – WEDNESDAY, DECEMBER 23, 2026
                    </h4>
                    <span className="text-xs text-stone-500 font-semibold">Cordova Grand Stage &amp; Quadrangle</span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700">
                        <th className="p-2.5 font-bold">Time</th>
                        <th className="p-2.5 font-bold">Programme</th>
                        <th className="p-2.5 font-bold">Venue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {SCHEDULE_DATA.day3.programmes.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-2.5 font-mono font-bold text-[#A91F35] whitespace-nowrap">{p.time}</td>
                          <td className="p-2.5 font-semibold text-stone-900">{p.title}</td>
                          <td className="p-2.5 text-stone-600">{p.venue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>`;

if (!file.includes('DAY 03 – WEDNESDAY, DECEMBER 23, 2026')) {
  file = file.replace(
    '</table>\n                </div>\n\n              </div>',
    '</table>\n                </div>\n\n' + day3PrintTable + '\n\n              </div>'
  );
}

fs.writeFileSync(filePath, file, 'utf8');
console.log('Successfully updated SchedulePage.jsx with 3-day schedule!');
