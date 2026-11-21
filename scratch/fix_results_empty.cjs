const fs = require('fs');

let content = fs.readFileSync('src/pages/ResultsPage.jsx', 'utf8');

// 1. Wrap podium in Section 02
const podiumStart = '{/* Podium Representation for Top 3 */}';
const podiumEnd = '      {/* ========================================================================= */}\n      {/* SECTION 03: CATEGORY RESULTS EXPLORER';

const pIdx = content.indexOf(podiumStart);
const eIdx = content.indexOf(podiumEnd);

if (pIdx > -1 && eIdx > -1) {
  const before = content.substring(0, pIdx);
  const podiumContent = content.substring(pIdx, eIdx);
  const after = content.substring(eIdx);

  const cleanSection2 = `{teamsList.length < 3 ? (
            <div className="py-20 text-center bg-[#FAF7F0] rounded-3xl border border-dashed border-[#A91F35]/20 p-8 space-y-4">
              <Trophy className="w-12 h-12 text-[#A91F35] mx-auto opacity-40" />
              <h3 className="text-xl font-serif font-black text-stone-900">
                Official Sector Standings In Preparation
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Live team points, medal tallies, and podium rankings will be published here following the completion of initial adjudication rounds and validation by the Festival Convener Board.
              </p>
            </div>
          ) : (
            <>
              ${podiumContent.trim()}
            </>
          )}
        </div>
      </section>

`;

  content = before + cleanSection2 + after;
}

// 2. Add empty state check in Section 03
content = content.replace(
  `          {/* Results Grid / Empty State */}
          {filteredResults.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-3">
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-stone-700">
                No published results match "{searchQuery}"
              </h3>
              <p className="text-xs text-stone-500">
                Try searching for candidate name (e.g. "Rayan"), team (e.g. "Areekode"), or event title.
              </p>
            </div>`,
  `          {/* Results Grid / Empty State */}
          {resultsList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
              <Award className="w-12 h-12 text-[#A91F35] mx-auto opacity-40" />
              <h3 className="text-xl font-serif font-black text-stone-900">
                Official Category Results Awaiting Publication
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Adjudicated competition marksheets and verified winner podiums will be proclaimed here live once officially confirmed and published by the Festival Convener.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-3">
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-stone-700">
                No published results match "{searchQuery}"
              </h3>
              <p className="text-xs text-stone-500">
                Try searching for candidate name or event title.
              </p>
            </div>`
);

// 3. In Section 04: Champion of Champions & downloads:
// Guard team leader access in Section 04
content = content.replace(
  '{/* SECTION 04: STAR PERFORMER & DOWNLOAD ARCHIVES */}\n      <section className="py-16 md:py-24 bg-white',
  `{/* SECTION 04: STAR PERFORMER & DOWNLOAD ARCHIVES */}
      {teamsList.length > 0 && (
      <section className="py-16 md:py-24 bg-white`
);
content = content.replace(
  '</section>\n\n      {/* FOOTER */}',
  '</section>\n      )}\n\n      {/* FOOTER */}'
);

fs.writeFileSync('src/pages/ResultsPage.jsx', content, 'utf8');
console.log('Fixed ResultsPage.jsx!');
