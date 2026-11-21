const fs = require('fs');

let content = fs.readFileSync('src/admin/components/DashboardView.jsx', 'utf8');

// Add students and competitions variables
content = content.replace(
  '  const teams = festivalStore.getTeams();\n  const assignments = storeData.programmeAssignments || [];',
  '  const teams = festivalStore.getTeams();\n  const students = festivalStore.getRegisteredStudents() || [];\n  const competitions = festivalStore.getCompetitions() || [];\n  const assignments = storeData.programmeAssignments || [];'
);

// 1. Team Performance Empty State
content = content.replace('<span>All 12 Teams</span>', '<span>All Teams ({teams.length})</span>');
content = content.replace(
  `            <div className="space-y-3">
              {teams.slice(0, 5).map((team, idx) => {`,
  `            {teams.length === 0 ? (
              <div className="p-8 text-center bg-[#F7F3E9]/50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                <Users className="w-8 h-8 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-700">No teams registered yet.</div>
                <div className="text-[11px] text-stone-500">Register squads in Team Management to view standings.</div>
              </div>
            ) : (
            <div className="space-y-3">
              {teams.slice(0, 5).map((team, idx) => {`
);
content = content.replace(
  `              })}
            </div>
          </div>

          {/* B. JUDGE EVALUATION OVERVIEW */}`,
  `              })}
            </div>
            )}
          </div>

          {/* B. JUDGE EVALUATION OVERVIEW */}`
);

// 2. Judge Evaluation Overview Empty State
content = content.replace(
  `            <div className="space-y-3">
              {assignments.slice(0, 4).map((prog) => {`,
  `            {assignments.length === 0 ? (
              <div className="p-8 text-center bg-[#F7F3E9]/50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                <Shield className="w-8 h-8 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-700">No competition evaluations pending.</div>
                <div className="text-[11px] text-stone-500">Competitions and judge assignments can be configured in Judge Management.</div>
              </div>
            ) : (
            <div className="space-y-3">
              {assignments.slice(0, 4).map((prog) => {`
);
content = content.replace(
  `              })}
            </div>
          </div>

          {/* C. RECENT PUBLISHED RESULTS SHOWCASE */}`,
  `              })}
            </div>
            )}
          </div>

          {/* C. RECENT PUBLISHED RESULTS SHOWCASE */}`
);

// 3. Published Laureates Empty State
content = content.replace(
  `            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posters.map((poster) => (`,
  `            {posters.length === 0 ? (
              <div className="p-8 text-center bg-[#F7F3E9]/50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                <Award className="w-8 h-8 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-700">No published results yet.</div>
                <div className="text-[11px] text-stone-500">Official winner proclamations will appear here once approved and published.</div>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posters.map((poster) => (`
);
content = content.replace(
  `              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide on desktop) */}`,
  `              ))}
            </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col wide on desktop) */}`
);

// 4. Student Registration Overview Dynamic
const studentSecOriginal = `          {/* D. STUDENT REGISTRATION OVERVIEW */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <h2 className="text-base font-bold text-[#A91F35] font-serif border-b border-stone-100 pb-2.5">
              Student Registration Overview
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Junior Category', count: '520 Students', pct: 42, color: '#A91F35' },
                { label: 'Senior Category', count: '480 Students', pct: 38, color: '#E6A916' },
                { label: 'General Conclave', count: '250 Students', pct: 20, color: '#047857' }
              ].map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>{cat.label}</span>
                    <span>{cat.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: \`\${cat.pct}%\`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-stone-500 bg-[#F7F3E9] p-3 rounded-xl border border-stone-200">
              <span className="font-bold text-[#A91F35]">Registry Check:</span> All chest numbers allocated. 100% ID verification complete.
            </div>
          </div>`;

const studentSecReplacement = `          {/* D. STUDENT REGISTRATION OVERVIEW */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <h2 className="text-base font-bold text-[#A91F35] font-serif border-b border-stone-100 pb-2.5">
              Student Registration Overview
            </h2>
            {students.length === 0 ? (
              <div className="p-6 text-center bg-[#F7F3E9]/50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                <Users className="w-7 h-7 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-700">0 Students Registered</div>
                <div className="text-[11px] text-stone-500">Add or import students in Student Management to see category metrics.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Junior Category', count: \`\${students.filter(s => s.category === 'Junior').length} Students\`, pct: Math.round((students.filter(s => s.category === 'Junior').length / (students.length || 1)) * 100), color: '#A91F35' },
                  { label: 'Senior Category', count: \`\${students.filter(s => s.category === 'Senior').length} Students\`, pct: Math.round((students.filter(s => s.category === 'Senior').length / (students.length || 1)) * 100), color: '#E6A916' },
                  { label: 'General Conclave', count: \`\${students.filter(s => s.category === 'General').length} Students\`, pct: Math.round((students.filter(s => s.category === 'General').length / (students.length || 1)) * 100), color: '#047857' }
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span>{cat.label}</span>
                      <span>{cat.count}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: \`\${cat.pct}%\`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 text-[11px] text-stone-500 bg-[#F7F3E9] p-3 rounded-xl border border-stone-200">
              <span className="font-bold text-[#A91F35]">Registry Check:</span> {students.length} students enrolled in central registry cohort.
            </div>
          </div>`;

content = content.replace(studentSecOriginal, studentSecReplacement);

// 5. Competition Arenas Dynamic
const compSecOriginal = `          {/* E. COMPETITION STATUS BY ARENA */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <h2 className="text-base font-bold text-[#A91F35] font-serif border-b border-stone-100 pb-2.5">
              Competition Arenas (48 Total)
            </h2>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Literary Arena', count: '12 Events', icon: BookOpen, status: 'Active' },
                { name: 'Islamic Heritage', count: '10 Events', icon: Sparkles, status: 'Active' },
                { name: 'Public Speaking', count: '10 Events', icon: Mic, status: 'Underway' },
                { name: 'Visual Arts', count: '8 Events', icon: Palette, status: 'Scheduled' },
                { name: 'Media & Cultural', count: '8 Events', icon: Camera, status: 'Scheduled' }
              ].map((arena, idx) => {
                const Icon = arena.icon;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F7F3E9]/60 border border-stone-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-[#A91F35]" />
                      <span className="font-bold text-stone-800 text-[11px]">{arena.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {arena.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>`;

const compSecReplacement = `          {/* E. COMPETITION STATUS BY ARENA */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 space-y-3.5">
            <h2 className="text-base font-bold text-[#A91F35] font-serif border-b border-stone-100 pb-2.5">
              Competition Arenas ({competitions.length} Total)
            </h2>
            {competitions.length === 0 ? (
              <div className="p-6 text-center bg-[#F7F3E9]/50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                <Trophy className="w-7 h-7 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-700">0 Competitions Scheduled</div>
                <div className="text-[11px] text-stone-500">Create competition arenas in Competition Management.</div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {competitions.slice(0, 6).map((comp, idx) => (
                  <div
                    key={comp.id || idx}
                    className="p-2.5 rounded-xl bg-[#F7F3E9]/60 border border-stone-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Trophy className="w-3.5 h-3.5 text-[#A91F35] shrink-0" />
                      <span className="font-bold text-stone-800 text-[11px] truncate">{comp.title || comp.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                      {comp.category || 'General'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>`;

content = content.replace(compSecOriginal, compSecReplacement);

// 6. Upcoming Programmes Empty State
content = content.replace(
  `            <div className="space-y-2.5">
              {programmes.slice(0, 4).map((prog) => (`,
  `            {programmes.length === 0 ? (
              <div className="p-6 text-center bg-[#F7F3E9]/50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                <Calendar className="w-7 h-7 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-700">No scheduled programmes yet.</div>
                <div className="text-[11px] text-stone-500">Programmes can be created in Programme Management.</div>
              </div>
            ) : (
            <div className="space-y-2.5">
              {programmes.slice(0, 4).map((prog) => (`
);
content = content.replace(
  `              ))}
            </div>
          </div>

          {/* G. RECENT ACTIVITIES & AUDIT LOGS */}`,
  `              ))}
            </div>
            )}
          </div>

          {/* G. RECENT ACTIVITIES & AUDIT LOGS */}`
);

// 7. Audit Trail Empty State
content = content.replace(
  `            <div className="space-y-2.5 text-xs">
              {auditLogs.slice(0, 5).map((log) => (`,
  `            {auditLogs.length === 0 ? (
              <div className="p-6 text-center bg-[#F7F3E9]/50 rounded-2xl border border-dashed border-stone-300 space-y-2">
                <Clock className="w-7 h-7 text-stone-400 mx-auto" />
                <div className="text-xs font-bold text-stone-700">No recent activity logs.</div>
                <div className="text-[11px] text-stone-500">Operational actions and changes will be logged here in real-time.</div>
              </div>
            ) : (
            <div className="space-y-2.5 text-xs">
              {auditLogs.slice(0, 5).map((log) => (`
);
content = content.replace(
  `              ))}
            </div>
          </div>
        </div>
      </div>`,
  `              ))}
            </div>
            )}
          </div>
        </div>
      </div>`
);

fs.writeFileSync('src/admin/components/DashboardView.jsx', content, 'utf8');
console.log('Successfully updated DashboardView.jsx with clean empty states!');
