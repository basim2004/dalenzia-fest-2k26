const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/convener/components/ConvenerStudents.jsx');
let file = fs.readFileSync(filePath, 'utf8');

// Ensure Phone is imported
if (!file.includes('Phone,')) {
  file = file.replace('UserCheck,', 'UserCheck,\n  Phone,');
}

// Add state for phone modal
const stateAnchor = "  const [deleteConfirmation, setDeleteConfirmation] = useState(null);";
const stateAdditions = `  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneEditStudent, setPhoneEditStudent] = useState(null);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [phoneError, setPhoneError] = useState('');`;

if (!file.includes('isPhoneModalOpen')) {
  file = file.replace(stateAnchor, stateAdditions);
}

// Name change handler with auto email
const handlerAnchor = "  const handleAddSubmit = (e) => {";
const handlerAdditions = `  const handleNameChange = (val) => {
    const autoEmail = festivalStore.generateStudentEmail(val);
    setFormData(prev => ({
      ...prev,
      name: val,
      email: (!prev.email || prev.email.endsWith('@dalanzia.org')) ? autoEmail : prev.email
    }));
  };

  const handleOpenPhoneModal = (student) => {
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
      setToastMessage(\`Phone number updated for \${phoneEditStudent.name}\`);
      setTimeout(() => setToastMessage(''), 3000);
      setIsPhoneModalOpen(false);
      reloadData();
    } catch (err) {
      setPhoneError(err.message || 'Failed to update phone number.');
    }
  };

  const handleAddSubmit = (e) => {`;

if (!file.includes('handleNameChange')) {
  file = file.replace(handlerAnchor, handlerAdditions);
}

// Update category filter dropdown
const oldCatFilter = `<option value="all">All Categories</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>`;

const newCatFilter = `<option value="all">All Categories</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="Sub Junior">Sub Junior</option>
            <option value="Minor">Minor</option>`;

file = file.replace(oldCatFilter, newCatFilter);

// In filteredStudents: normalize category matching
file = file.replace(
  "const matchesCategory = selectedCategory === 'all' || s.classCategory === selectedCategory;",
  "const matchesCategory = selectedCategory === 'all' || (s.classCategory || '').toLowerCase().replace(/[\\s-_]/g, '') === selectedCategory.toLowerCase().replace(/[\\s-_]/g, '');"
);

// Update openAddModal to default to Senior
file = file.replace("classCategory: 'Junior',", "classCategory: 'Senior',");

// Update Form Category Dropdown
const oldFormCats = `<option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>`;

const newFormCats = `<option value="Senior">Senior</option>
                      <option value="Junior">Junior</option>
                      <option value="Sub Junior">Sub Junior</option>
                      <option value="Minor">Minor</option>`;

file = file.replace(oldFormCats, newFormCats);

// In form, hook up handleNameChange
file = file.replace(
  'onChange={(e) => setFormData({ ...formData, name: e.target.value })}',
  'onChange={(e) => handleNameChange(e.target.value)}'
);

// In form, update Phone label to (Optional)
file = file.replace(
  '<label className="text-[11px] font-bold text-stone-600">Contact Phone</label>',
  '<label className="text-[11px] font-bold text-stone-600">Contact Phone (Optional - can be added later)</label>'
);

// Update category badge color in table
file = file.replace(
  `{s.classCategory}
                      </span>`,
  `{s.classCategory}
                      </span>`
);

file = file.replace(
  `s.classCategory === 'Junior'
                        ? 'bg-red-50 text-[#A91F35] border border-red-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'`,
  `(s.classCategory || '').toLowerCase() === 'senior'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : (s.classCategory || '').toLowerCase() === 'junior'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : (s.classCategory || '').toLowerCase().includes('sub')
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'`
);

// Add "Update Phone" button in table actions
file = file.replace(
  `<button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>`,
  `<button
                          onClick={() => handleOpenPhoneModal(s)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                          title="Add / Update Phone Number"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>`
);

// Add Phone Number Modal for Convener
const convenerPhoneModal = `
      {/* Add / Update Phone Modal */}
      <AnimatePresence>
        {isPhoneModalOpen && phoneEditStudent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-stone-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-stone-900">
                  <Phone className="w-4 h-4 text-[#A91F35]" />
                  <h3 className="font-bold text-sm">Add / Update Phone</h3>
                </div>
                <button
                  onClick={() => setIsPhoneModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 font-medium">
                Candidate: <span className="font-bold text-stone-900">{phoneEditStudent.name}</span> ({phoneEditStudent.chestNo})
              </p>

              {phoneError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl font-semibold">
                  {phoneError}
                </div>
              )}

              <form onSubmit={handleSavePhone} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phoneInputValue}
                    onChange={(e) => setPhoneInputValue(e.target.value)}
                    placeholder="+91 98471 XXXXX"
                    className="w-full bg-[#FAF7F0] px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#A91F35]"
                    autoFocus
                  />
                  <p className="text-[10px] text-stone-500 mt-1">Leave empty to clear or enter a contact number.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPhoneModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-all"
                  >
                    Save Phone
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

if (!file.includes('Add / Update Phone Modal')) {
  file = file.replace(
    '{/* Delete Confirmation Modal */}',
    convenerPhoneModal + '\n      {/* Delete Confirmation Modal */}'
  );
}

fs.writeFileSync(filePath, file, 'utf8');
console.log('Successfully updated ConvenerStudents.jsx!');
