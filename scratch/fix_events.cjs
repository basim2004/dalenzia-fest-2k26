const fs = require('fs');

let content = fs.readFileSync('src/pages/EventsPage.jsx', 'utf8');

// Replace all lonely "      )}" after </section>
content = content.replace(/      <\/section>\n      \)\}/g, '      </section>');

// Now find Section 05 and wrap it properly:
// Section 05 starts at: {/* SECTION 05: CINEMATIC FEATURED COMPETITIONS */}
// and ends at: </section> before {/* SECTION 06: HOW TO PARTICIPATE */}
const sec5Start = content.indexOf('{/* SECTION 05: CINEMATIC FEATURED COMPETITIONS */}');
const sec6Start = content.indexOf('{/* SECTION 06: HOW TO PARTICIPATE */}');

if (sec5Start > -1 && sec6Start > -1) {
  const beforeSec5 = content.substring(0, sec5Start);
  let sec5Part = content.substring(sec5Start, sec6Start);
  const afterSec6 = content.substring(sec6Start);

  // Remove any previously added featuredCompetitions checks
  sec5Part = sec5Part.replace('{featuredCompetitions.length > 0 && (\n', '');
  sec5Part = sec5Part.replace('{featuredCompetitions.length > 0 && (\n      ', '');
  sec5Part = sec5Part.replace('</section>\n      )}', '</section>');

  // Wrap sec5 cleanly
  const wrappedSec5 = `{/* SECTION 05: CINEMATIC FEATURED COMPETITIONS */}
      {featuredCompetitions.length > 0 && (
      ${sec5Part.replace('{/* SECTION 05: CINEMATIC FEATURED COMPETITIONS */}\n', '').trim()}
      )}

      `;

  content = beforeSec5 + wrappedSec5 + afterSec6;
}

// Remove any leftover extra `)}` near the end of modal
content = content.replace('</section>\n      )}\n\n      {/* MODAL: COMPETITION DETAIL */}', '</section>\n\n      {/* MODAL: COMPETITION DETAIL */}');

fs.writeFileSync('src/pages/EventsPage.jsx', content, 'utf8');
console.log('Fixed EventsPage.jsx!');
