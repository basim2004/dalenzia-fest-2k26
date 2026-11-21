const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/admin/components/ScheduleModule.jsx');
let file = fs.readFileSync(filePath, 'utf8');

// 1. Add day3Schedules
const oldDay2 = `  const day2Schedules = useMemo(() => {
    return schedules.filter(s => String(s.date).includes('22'));
  }, [schedules]);`;

const newDay3 = `  const day2Schedules = useMemo(() => {
    return schedules.filter(s => String(s.date).includes('22'));
  }, [schedules]);

  const day3Schedules = useMemo(() => {
    return schedules.filter(s => String(s.date).includes('23'));
  }, [schedules]);`;

if (!file.includes('day3Schedules =')) {
  file = file.replace(oldDay2, newDay3);
}

// 2. Add Day 03 button in selector
const oldDayTabButtons = `<button
                  onClick={() => setSelectedDayTab('Dec 22, 2026')}
                  className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                    selectedDayTab === 'Dec 22, 2026'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-stone-600 hover:bg-stone-200'
                  }\`}
                >
                  Day 02 (Dec 22)
                </button>`;

const newDayTabButtons = `<button
                  onClick={() => setSelectedDayTab('Dec 22, 2026')}
                  className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                    selectedDayTab === 'Dec 22, 2026'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-stone-600 hover:bg-stone-200'
                  }\`}
                >
                  Day 02 (Dec 22)
                </button>
                <button
                  onClick={() => setSelectedDayTab('Dec 23, 2026')}
                  className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${
                    selectedDayTab === 'Dec 23, 2026'
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'bg-[#FAF7F0] text-stone-600 hover:bg-stone-200'
                  }\`}
                >
                  Day 03 (Dec 23)
                </button>`;

file = file.replace(oldDayTabButtons, newDayTabButtons);

// 3. Replace ternary selections
file = file.replace(
  /\(selectedDayTab === 'Dec 21, 2026' \? day1Schedules : day2Schedules\)/g,
  "(selectedDayTab === 'Dec 21, 2026' ? day1Schedules : selectedDayTab === 'Dec 22, 2026' ? day2Schedules : day3Schedules)"
);

file = file.replace(
  /selectedDayTab === 'Dec 21, 2026' \? day1Schedules : day2Schedules/g,
  "selectedDayTab === 'Dec 21, 2026' ? day1Schedules : selectedDayTab === 'Dec 22, 2026' ? day2Schedules : day3Schedules"
);

// 4. Add Day 03 option in dropdowns
if (!file.includes('Day 03 · Dec 23, 2026')) {
  file = file.replace(
    '<option value="Dec 22, 2026">Day 02 · Dec 22, 2026</option>',
    '<option value="Dec 22, 2026">Day 02 · Dec 22, 2026</option>\n                      <option value="Dec 23, 2026">Day 03 · Dec 23, 2026</option>'
  );
}

// 5. Update column view: grid-cols-1 lg:grid-cols-2 -> grid-cols-1 lg:grid-cols-3
const oldGrid = '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">';
const newGrid = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
file = file.replace(oldGrid, newGrid);

// Add Day 03 column
const day3Col = `            {/* Day 03 Column */}
            <div className="bg-[#FAF7F0] rounded-3xl p-5 border border-stone-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h4 className="text-base font-serif font-black text-stone-900">
                    Day 03 · Wednesday, Dec 23, 2026
                  </h4>
                  <p className="text-[11px] text-stone-600">Grand Valedictory, Final Honors & Special Conclave</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-extrabold">
                  {day3Schedules.length} Sessions
                </span>
              </div>

              <div className="space-y-3">
                {day3Schedules.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 text-center text-xs text-stone-500">
                    Grand Valedictory sessions and ceremonial awards
                  </div>
                ) : (
                  day3Schedules.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveDetailSchedule(item);
                        setIsDetailDrawerOpen(true);
                      }}
                      className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#A91F35] transition-all cursor-pointer shadow-xs space-y-2 group"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#A91F35] font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timeRange}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-stone-100 text-stone-700">
                          {item.stage}
                        </span>
                      </div>

                      <h5 className="text-sm font-serif font-bold text-stone-900 group-hover:text-[#A91F35] transition-colors">
                        {item.programmeTitle}
                      </h5>
                    </div>
                  ))
                )}
              </div>
            </div>`;

if (!file.includes('Day 03 · Wednesday, Dec 23, 2026')) {
  file = file.replace(
    '              </div>\n            </div>\n\n          </div>\n        </div>\n      )}',
    '              </div>\n            </div>\n\n' + day3Col + '\n\n          </div>\n        </div>\n      )}'
  );
}

fs.writeFileSync(filePath, file, 'utf8');
console.log('Successfully updated ScheduleModule.jsx with Day 3 support!');
