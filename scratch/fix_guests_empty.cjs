const fs = require('fs');

let content = fs.readFileSync('src/pages/GuestsPage.jsx', 'utf8');

const s2Tag = '{/* SECTION 02: FEATURED GUEST OF HONOUR (Large Editorial Portrait) */}';
const s5Tag = '{/* SECTION 05: THE OFFICIAL QUOTE BANNER FROM THE MODEL */}';

const s2Idx = content.indexOf(s2Tag);
const s5Idx = content.indexOf(s5Tag);

if (s2Idx === -1 || s5Idx === -1) {
  throw new Error('Could not find section 2 or section 5');
}

const before = content.substring(0, s2Idx);
const middle = content.substring(s2Idx, s5Idx);
const after = content.substring(s5Idx);

const cleanMiddle = `{guestsList.length === 0 ? (
        <section className="py-24 bg-white border-b border-[#A91F35]/15 text-center">
          <div className="max-w-xl mx-auto px-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#F7F3E9] text-[#A91F35] flex items-center justify-center mx-auto shadow-inner border border-[#A91F35]/15">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-black text-stone-900">
              Official Guest Directory In Preparation
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Dignitaries, keynote scholars, and honoured guests for DALENZIA FEST 2K26 – NUEVA ERA will be officially announced here as invitations and keynote slots are certified by the Festival Convener Board.
            </p>
          </div>
        </section>
      ) : (
        <>
          ${middle.trim()}
        </>
      )}

      `;

fs.writeFileSync('src/pages/GuestsPage.jsx', before + cleanMiddle + after, 'utf8');
console.log('Fixed GuestsPage.jsx successfully!');
