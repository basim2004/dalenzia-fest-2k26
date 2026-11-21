const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/admin/components/StudentsModule.jsx');
let file = fs.readFileSync(filePath, 'utf8');

// Ensure BookOpen and Star are imported from lucide-react if not present
if (!file.includes('BookOpen')) {
  file = file.replace(
    "import {\n  Users,",
    "import {\n  Users,\n  BookOpen,\n  Star,"
  );
}

// Add state for phone updating
const stateAnchor = "  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);";
const stateAdditions = `  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneEditStudent, setPhoneEditStudent] = useState(null);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [phoneError, setPhoneError] = useState('');`;

if (!file.includes('isPhoneModalOpen')) {
  file = file.replace(stateAnchor, stateAdditions);
}

// Add phone handler methods
const handlerAnchor = "  // Open Add Student Modal";
const handlerAdditions = `  const handleOpenPhoneModal = (student) => {
    setPhoneEditStudent(student);
    setPhoneInputValue(student.phone || '');
    setPhoneError('');
    setIsPhoneModalOpen(true);
  };

  const handleSavePhone = (e) => {
    e.preventDefault();
    if (!phoneEditStudent) return;
    try {
      festivalStore.updateStudentPhone(phoneEditStudent.id, phoneInputValue);
      showToast(\`Phone number updated for \${phoneEditStudent.name}\`);
      setIsPhoneModalOpen(false);
      refreshData();
      if (activeStudentProfile && (activeStudentProfile.id === phoneEditStudent.id || activeStudentProfile.chestNo === phoneEditStudent.chestNo)) {
        setActiveStudentProfile(festivalStore.getStudentById(phoneEditStudent.id));
      }
    } catch (err) {
      setPhoneError(err.message || 'Failed to update phone number.');
    }
  };

  const handleNameChange = (val) => {
    const autoEmail = festivalStore.generateStudentEmail(val);
    setFormData(prev => ({
      ...prev,
      name: val,
      email: (!prev.email || prev.email.endsWith('@dalanzia.org')) ? autoEmail : prev.email
    }));
  };

  // Open Add Student Modal`;

if (!file.includes('handleOpenPhoneModal')) {
  file = file.replace(handlerAnchor, handlerAdditions);
}

// Default classCategory to 'Senior'
file = file.replace("classCategory: 'Junior',", "classCategory: 'Senior',");

// Update 8 KPI Cards (Requirement 8)
const oldKpiBlockStart = '{/* 7 Core KPI Cards */}';
const oldKpiBlockEnd = '{/* Visual Breakdowns: Category Distribution & Team Distribution */}';
const kpiIdx1 = file.indexOf(oldKpiBlockStart);
const kpiIdx2 = file.indexOf(oldKpiBlockEnd);

if (kpiIdx1 !== -1 && kpiIdx2 !== -1) {
  const newKpiBlock = `{/* 8 Core KPI Cards (Official Live Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {[
              { label: 'Total Students', value: stats.totalStudents, sub: 'Enrolled in Portal', icon: Users, color: '#A91F35', bg: 'bg-red-50 text-red-700' },
              { label: 'Senior Count', value: stats.categoryBreakdown?.Senior || 0, sub: 'Senior Division', icon: Award, color: '#D97706', bg: 'bg-amber-50 text-amber-700' },
              { label: 'Junior Count', value: stats.categoryBreakdown?.Junior || 0, sub: 'Junior Division', icon: Sparkles, color: '#A91F35', bg: 'bg-rose-50 text-rose-700' },
              { label: 'Sub Junior Count', value: stats.categoryBreakdown?.SubJunior || 0, sub: 'Sub-Junior Division', icon: BookOpen, color: '#047857', bg: 'bg-emerald-50 text-emerald-700' },
              { label: 'Minor Count', value: stats.categoryBreakdown?.Minor || 0, sub: 'Minor Division', icon: Star, color: '#7C3AED', bg: 'bg-purple-50 text-purple-700' },
              { label: 'Assigned Students', value: stats.assignedStudents, sub: 'In Active Squads', icon: Trophy, color: '#2563EB', bg: 'bg-blue-50 text-blue-700' },
              { label: 'Unassigned Students', value: stats.unassignedStudents, sub: 'Unassigned Pool', icon: UserX, color: '#F59E0B', bg: 'bg-yellow-50 text-yellow-800' },
              { label: 'Active Candidates', value: stats.activeStudents, sub: 'Eligible for Stage', icon: UserCheck, color: '#10B981', bg: 'bg-teal-50 text-teal-700' }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-3 sm:p-3.5 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 truncate" title={card.label}>{card.label}</span>
                    <div className={\`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 \${card.bg}\`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-stone-900">{card.value}</div>
                  <div className="text-[9px] text-stone-600 mt-0.5 truncate">{card.sub}</div>
                </div>
              );
            })}
          </div>\n\n          `;
  file = file.slice(0, kpiIdx1) + newKpiBlock + file.slice(kpiIdx2);
}

// Update Category Distribution breakdown (4 Official Categories)
const oldDistStart = "<h3 className=\"text-sm font-bold text-stone-900 uppercase tracking-wide\">Category Distribution</h3>";
const oldDistEnd = "</div>\n\n              <div className=\"p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60";
const distIdx1 = file.indexOf(oldDistStart);
const distIdx2 = file.indexOf(oldDistEnd);

if (distIdx1 !== -1 && distIdx2 !== -1) {
  const newDistBlock = `<h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">Category Distribution</h3>
                  <p className="text-xs text-stone-600 mt-0.5">Four official academic divisions across registered cohort</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                  4 Official Categories
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Senior Division', count: stats.categoryBreakdown?.Senior || 0, color: '#D97706', bg: 'bg-amber-600', sub: 'Degree Scholars' },
                  { name: 'Junior Division', count: stats.categoryBreakdown?.Junior || 0, color: '#A91F35', bg: 'bg-[#A91F35]', sub: '+1 & +2 Scholars' },
                  { name: 'Sub Junior Division', count: stats.categoryBreakdown?.SubJunior || 0, color: '#047857', bg: 'bg-emerald-600', sub: 'Class 10 Scholars' },
                  { name: 'Minor Division', count: stats.categoryBreakdown?.Minor || 0, color: '#7C3AED', bg: 'bg-purple-600', sub: 'Class 5 to 9 Scholars' }
                ].map((cat, idx) => {
                  const pct = stats.totalStudents > 0 ? Math.round((cat.count / stats.totalStudents) * 100) : 0;
                  return (
                    <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-stone-800">{cat.name}</span>
                        <span className="text-stone-900">{cat.count} Students ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div className={\`h-full rounded-full \${cat.bg}\`} style={{ width: \`\${pct}%\` }} />
                      </div>
                      <p className="text-[10px] text-stone-600">{cat.sub}</p>
                    </div>
                  );
                })}`;
  file = file.slice(0, distIdx1) + newDistBlock + file.slice(distIdx2);
}

// Update Category Filter dropdown
const oldCategoryOptions = `<option value="all">All Categories</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="General">General</option>`;

const newCategoryOptions = `<option value="all">All Categories</option>
                <option value="Senior">Senior</option>
                <option value="Junior">Junior</option>
                <option value="Sub Junior">Sub Junior</option>
                <option value="Minor">Minor</option>`;

file = file.replace(oldCategoryOptions, newCategoryOptions);

// Update category badge rendering helper in table
file = file.replace(
  `s.classCategory === 'Junior'
                              ? 'bg-red-50 text-[#A91F35] border-red-200'
                              : s.classCategory === 'Senior'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'`,
  `(s.classCategory || '').toLowerCase() === 'senior'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : (s.classCategory || '').toLowerCase() === 'junior'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : (s.classCategory || '').toLowerCase().includes('sub')
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-purple-100 text-purple-800 border-purple-200'`
);

// Update Enroll New Student Modal
const addModalStart = '{/* MODAL 1: ADD NEW STUDENT */}';
const addModalEnd = '{/* MODAL 2: EDIT STUDENT */}';
const addIdx1 = file.indexOf(addModalStart);
const addIdx2 = file.indexOf(addModalEnd);

if (addIdx1 !== -1 && addIdx2 !== -1) {
  const newAddModal = `{/* MODAL 1: ADD NEW STUDENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Enroll New Student</h3>
                  <p className="text-xs text-stone-600">Register festival candidate with automatic chest & email identifier</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-6 space-y-4">
              {/* Field 1 & 2: Full Name & Chest Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmad Rayan"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Chest Number <span className="text-[10px] text-stone-500 font-normal">(Auto if blank)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Leave blank for auto-generation (e.g. C-147)"
                    value={formData.chestNo}
                    onChange={(e) => setFormData({ ...formData, chestNo: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Field 3 & 4: Class Category & Team Assignment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Class Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.classCategory}
                    onChange={(e) => setFormData({ ...formData, classCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50 text-stone-800"
                  >
                    <option value="Senior">Senior</option>
                    <option value="Junior">Junior</option>
                    <option value="Sub Junior">Sub Junior</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Team Assignment
                  </label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50 text-stone-800"
                  >
                    <option value="">Unassigned (Pool)</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 5 & 6: Candidate Status & Institution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Candidate Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50 text-stone-800"
                  >
                    <option value="Active">Active (Eligible)</option>
                    <option value="Inactive">Inactive (On-Hold)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Institution / Campus</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Field 7 & 8: Phone Number (Optional) & Email Address (Auto-generated) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number <span className="text-[10px] text-stone-500 font-normal">(Optional - can be added later)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Leave blank or enter phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address <span className="text-[10px] text-stone-500 font-normal">(Auto-generated ID)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="auto-generated@dalanzia.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Generated identifier for system records & credentials.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-md active:scale-95"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}\n\n      `;
  file = file.slice(0, addIdx1) + newAddModal + file.slice(addIdx2);
}

// Update Edit Modal category options
const editOldCat = `<option value="Junior">Junior (Under-16)</option>
                    <option value="Senior">Senior (Advanced)</option>
                    <option value="General">General Conclave</option>`;

const editNewCat = `<option value="Senior">Senior</option>
                    <option value="Junior">Junior</option>
                    <option value="Sub Junior">Sub Junior</option>
                    <option value="Minor">Minor</option>`;

file = file.replace(editOldCat, editNewCat);

// Update Profile Modal to add Phone update option
const oldProfilePhoneBlock = `<div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-600 font-medium">Phone Contact:</span>
                <span className="font-bold text-stone-900">{activeStudentProfile.phone || 'Not Provided'}</span>
              </div>`;

const newProfilePhoneBlock = `<div className="flex justify-between items-center py-2 border-b border-stone-200/60">
                <span className="text-stone-600 font-medium">Phone Contact:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900">{activeStudentProfile.phone || 'Not Provided'}</span>
                  <button
                    onClick={() => handleOpenPhoneModal(activeStudentProfile)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#A91F35]/10 text-[#A91F35] hover:bg-[#A91F35] hover:text-white transition-colors"
                  >
                    {activeStudentProfile.phone ? 'UPDATE PHONE' : 'ADD PHONE NUMBER'}
                  </button>
                </div>
              </div>`;

file = file.replace(oldProfilePhoneBlock, newProfilePhoneBlock);

// Add Phone Number Edit Modal at the end of modals
const phoneModalCode = `
      {/* ========================================================================= */}
      {/* MODAL 6: ADD / UPDATE PHONE NUMBER */}
      {/* ========================================================================= */}
      {isPhoneModalOpen && phoneEditStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Add / Update Phone Number</h3>
                  <p className="text-xs text-stone-600">{phoneEditStudent.name} ({phoneEditStudent.chestNo})</p>
                </div>
              </div>
              <button
                onClick={() => setIsPhoneModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {phoneError && (
              <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{phoneError}</span>
              </div>
            )}

            <form onSubmit={handleSavePhone} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98471 00000"
                  value={phoneInputValue}
                  onChange={(e) => setPhoneInputValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:ring-2 focus:ring-[#A91F35]/20 focus:border-[#A91F35] bg-stone-50/50"
                  autoFocus
                />
                <p className="text-[10px] text-stone-500 mt-1">Leave empty to remove phone contact, or enter a valid number.</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#851627] transition-all shadow-sm"
                >
                  Save Phone Number
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

if (!file.includes('Phone className="w-5 h-5"')) {
  // Ensure Phone is imported from lucide-react
  if (!file.includes('Phone,')) {
    file = file.replace('Users,', 'Users,\n  Phone,');
  }
  file = file.replace(
    '{/* MODAL 5: BULK ACTION MODAL */}',
    phoneModalCode + '\n      {/* MODAL 5: BULK ACTION MODAL */}'
  );
}

fs.writeFileSync(filePath, file, 'utf8');
console.log('Successfully updated StudentsModule.jsx!');
