const fs = require('fs');

// 1. UPDATE GuestsPage.jsx
console.log('Updating GuestsPage.jsx...');
let guestsContent = fs.readFileSync('src/pages/GuestsPage.jsx', 'utf8');

// Add import
if (!guestsContent.includes('festivalStore')) {
  guestsContent = guestsContent.replace(
    "import FooterCinematic from '../components/FooterCinematic';",
    "import FooterCinematic from '../components/FooterCinematic';\nimport { festivalStore } from '../admin/data/festivalStore';"
  );
}

// Replace GUESTS array with empty static fallback
guestsContent = guestsContent.replace(
  /const GUESTS = \[[\s\S]*?\n\];/,
  'const STATIC_GUESTS = [];'
);

// Update GuestsPage component definition and state
const guestsComponentMatch = guestsContent.match(/export default function GuestsPage\(\{[\s\S]*?\}\) \{[\s\S]*?const \[activeCategory, setActiveCategory\] = useState\('all'\);/);
if (guestsComponentMatch) {
  const replacement = `export default function GuestsPage({ onNavigateHome, onNavigateAbout, onNavigateEvents }) {
  const [guestsList, setGuestsList] = useState(() => festivalStore.getPublicGuests() || []);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setGuestsList(festivalStore.getPublicGuests() || []);
    });
    return unsub;
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');`;
  guestsContent = guestsContent.replace(guestsComponentMatch[0], replacement);
}

// Update filteredGuests & featuredGuest
guestsContent = guestsContent.replace(
  /const filteredGuests = useMemo\(\(\) => \{[\s\S]*?const featuredGuest = GUESTS\[0\];/,
  `const filteredGuests = useMemo(() => {
    if (activeCategory === 'all') return guestsList;
    return guestsList.filter((g) => (g.category || '').toLowerCase() === activeCategory.toLowerCase());
  }, [guestsList, activeCategory]);

  const featuredGuest = guestsList[0] || null;`
);

// Safeguard featuredGuest references
guestsContent = guestsContent.replace(
  /onClick=\{\(\) => setSelectedGuest\(featuredGuest\)\}/g,
  'onClick={() => featuredGuest && setSelectedGuest(featuredGuest)}'
);

// If guestsList is empty, display clean empty state in Section 02 & Section 03
const section2Match = guestsContent.match(/\{\/\* SECTION 02: FEATURED GUEST OF HONOUR \(Large Editorial Portrait\) \*\/\}[\s\S]*?\{\/\* SECTION 04: ALL GUESTS FILTERABLE DIRECTORY/);
if (section2Match) {
  const cleanSection2And3 = `{/* SECTION 02 & 03: GUEST SHOWCASE & DIRECTORY */}
      {guestsList.length === 0 ? (
        <section className="py-20 bg-white border-b border-[#A91F35]/15 text-center">
          <div className="max-w-xl mx-auto px-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#F7F3E9] text-[#A91F35] flex items-center justify-center mx-auto shadow-inner border border-[#A91F35]/15">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif font-black text-stone-900">
              Official Guest Directory In Preparation
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Dignitaries, keynote scholars, and honoured guests for DALENZIA FEST 2K26 – NUEVA ERA will be officially announced here as schedules and invitations are confirmed.
            </p>
          </div>
        </section>
      ) : (
        <>
          ${section2Match[0]}
        </>
      )}
      {/* SECTION 04: ALL GUESTS FILTERABLE DIRECTORY`;
  guestsContent = guestsContent.replace(section2Match[0], cleanSection2And3);
}

// In Section 04, replace GUESTS references with filteredGuests
guestsContent = guestsContent.replace(/GUESTS\.slice\(3\)\.map/g, 'filteredGuests.map');

fs.writeFileSync('src/pages/GuestsPage.jsx', guestsContent, 'utf8');
console.log('Successfully updated GuestsPage.jsx!');

// 2. UPDATE EventsPage.jsx
console.log('Updating EventsPage.jsx...');
let eventsContent = fs.readFileSync('src/pages/EventsPage.jsx', 'utf8');

if (!eventsContent.includes('festivalStore')) {
  eventsContent = eventsContent.replace(
    "import FooterCinematic from '../components/FooterCinematic';",
    "import FooterCinematic from '../components/FooterCinematic';\nimport { festivalStore } from '../admin/data/festivalStore';"
  );
}

// Replace COMPETITIONS array
eventsContent = eventsContent.replace(
  /const COMPETITIONS = \[[\s\S]*?\n\];/,
  'const STATIC_COMPETITIONS = [];'
);

// Update component state
const eventsCompMatch = eventsContent.match(/export default function EventsPage\(\{[\s\S]*?\}\) \{[\s\S]*?const \[selectedCategory, setSelectedCategory\] = useState\('all'\);/);
if (eventsCompMatch) {
  const replacement = `export default function EventsPage({ onNavigateHome, onNavigateAbout }) {
  const [competitionsList, setCompetitionsList] = useState(() => festivalStore.getCompetitions() || []);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setCompetitionsList(festivalStore.getCompetitions() || []);
    });
    return unsub;
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('all');`;
  eventsContent = eventsContent.replace(eventsCompMatch[0], replacement);
}

// Update filteredCompetitions & featuredCompetitions
eventsContent = eventsContent.replace(
  /const filteredCompetitions = useMemo\(\(\) => \{[\s\S]*?const featuredCompetitions = useMemo\(\(\) => \{[\s\S]*?\n  \}, \[\]\);/,
  `const filteredCompetitions = useMemo(() => {
    return competitionsList.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = (item.name || item.title || '').toLowerCase().includes(q);
        const matchesCat = (item.categoryName || item.category || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesStage = (item.stage || item.venue || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc && !matchesStage) return false;
      }
      return true;
    });
  }, [competitionsList, selectedCategory, typeFilter, statusFilter, searchQuery]);

  const featuredCompetitions = useMemo(() => {
    return competitionsList.filter((item) => item.featured);
  }, [competitionsList]);`
);

// Update count pill
eventsContent = eventsContent.replace('of {COMPETITIONS.length} Arenas', 'of {competitionsList.length} Arenas');

// Update empty state
const emptyStateMatch = eventsContent.match(/\{filteredCompetitions\.length === 0 \? \([\s\S]*?\n          \) : \(/);
if (emptyStateMatch) {
  const cleanEmptyState = `{competitionsList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
              <Trophy className="w-12 h-12 text-[#A91F35] mx-auto opacity-40" />
              <h3 className="text-xl font-serif font-black text-[#1c1917]">
                Festival Competitions In Preparation
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Official competitions, criteria rubrics, guidelines, and arenas for DALENZIA FEST 2K26 – NUEVA ERA are currently being prepared by the Festival Convener Board.
              </p>
            </div>
          ) : filteredCompetitions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
              <AlertCircle className="w-12 h-12 text-[#A91F35] mx-auto opacity-40" />
              <h3 className="text-lg font-serif font-bold text-[#1c1917]">
                No competitions matched your filter criteria
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try selecting a different category or clearing the search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setTypeFilter('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2 rounded-full bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8e172a] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (`;
  eventsContent = eventsContent.replace(emptyStateMatch[0], cleanEmptyState);
}

// Only render section 5 when featured competitions exist
eventsContent = eventsContent.replace(
  '{/* SECTION 05: CINEMATIC FEATURED COMPETITIONS */}\n      <section className="py-16 md:py-24 bg-white',
  `{/* SECTION 05: CINEMATIC FEATURED COMPETITIONS */}
      {featuredCompetitions.length > 0 && (
      <section className="py-16 md:py-24 bg-white`
);
eventsContent = eventsContent.replace(
  '</section>\n\n      {/* MODAL: COMPETITION DETAIL */}',
  '</section>\n      )}\n\n      {/* MODAL: COMPETITION DETAIL */}'
);

fs.writeFileSync('src/pages/EventsPage.jsx', eventsContent, 'utf8');
console.log('Successfully updated EventsPage.jsx!');

// 3. UPDATE ResultsPage.jsx
console.log('Updating ResultsPage.jsx...');
let resultsContent = fs.readFileSync('src/pages/ResultsPage.jsx', 'utf8');

if (!resultsContent.includes('festivalStore')) {
  resultsContent = resultsContent.replace(
    "import FooterCinematic from '../components/FooterCinematic';",
    "import FooterCinematic from '../components/FooterCinematic';\nimport { festivalStore } from '../admin/data/festivalStore';"
  );
}

// Replace TEAMS_DATA and RESULTS_DATA
resultsContent = resultsContent.replace(/const TEAMS_DATA = \[[\s\S]*?\n\];/, 'const STATIC_TEAMS_DATA = [];');
resultsContent = resultsContent.replace(/const RESULTS_DATA = \[[\s\S]*?\n\];/, 'const STATIC_RESULTS_DATA = [];');

// Add reactive state in ResultsPage
const resultsCompMatch = resultsContent.match(/export default function ResultsPage\(\{[\s\S]*?\}\) \{[\s\S]*?const \[activeTab, setActiveTab\] = useState\('leaderboard'\);/);
if (resultsCompMatch) {
  const replacement = `export default function ResultsPage({
  onNavigateHome,
  onNavigateAbout,
  onNavigateEvents,
  onNavigateGuests,
  onNavigateSchedule
}) {
  const [teamsList, setTeamsList] = useState(() => festivalStore.getTeams() || []);
  const [resultsList, setResultsList] = useState(() => festivalStore.getPublishedResultPosters() || []);

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setTeamsList(festivalStore.getTeams() || []);
      setResultsList(festivalStore.getPublishedResultPosters() || []);
    });
    return unsub;
  }, []);

  const [activeTab, setActiveTab] = useState('leaderboard');`;
  resultsContent = resultsContent.replace(resultsCompMatch[0], replacement);
}

// Update filteredResults logic to use resultsList
resultsContent = resultsContent.replace(
  /const filteredResults = useMemo\(\(\) => \{[\s\S]*?return RESULTS_DATA\.filter\(\(item\) => \{/,
  `const filteredResults = useMemo(() => {
    return resultsList.filter((item) => {`
);

// Safeguard TEAMS_DATA[0], TEAMS_DATA[1], TEAMS_DATA[2] accesses with safe fallback
const safeTeamObj = "{ name: 'Awaiting Team', malayalam: 'ടീം', points: 0, day1Points: 0, day2Points: 0, golds: 0, silvers: 0, bronzes: 0 }";
resultsContent = resultsContent.replace(/TEAMS_DATA\[0\]/g, `(teamsList[0] || ${safeTeamObj})`);
resultsContent = resultsContent.replace(/TEAMS_DATA\[1\]/g, `(teamsList[1] || ${safeTeamObj})`);
resultsContent = resultsContent.replace(/TEAMS_DATA\[2\]/g, `(teamsList[2] || ${safeTeamObj})`);
resultsContent = resultsContent.replace(/TEAMS_DATA\.map/g, 'teamsList.map');
resultsContent = resultsContent.replace(/RESULTS_DATA\.length/g, 'resultsList.length');
resultsContent = resultsContent.replace(/RESULTS_DATA\.slice/g, 'resultsList.slice');

fs.writeFileSync('src/pages/ResultsPage.jsx', resultsContent, 'utf8');
console.log('Successfully updated ResultsPage.jsx!');
