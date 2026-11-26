import React, { useState, useMemo } from 'react';
import {
  FileText,
  Table2,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  PlusCircle,
  X,
  Users,
  Mic,
  PenTool,
  Award,
  Sparkles,
  BookOpen,
  Info
} from 'lucide-react';
import { festivalStore } from '../admin/data/festivalStore';
import {
  OFFICIAL_CHARTER_METADATA,
  OFFICIAL_JUDGING_GUIDELINES,
  OFFICIAL_TWO_PAGE_PROGRAMME_CHART
} from '../admin/data/officialCharterData';

export default function ProgrammeChartDualModal({
  isOpen = true,
  onClose = null,
  embedded = false,
  canConfigure = false,
  onConfigureProgramme = null
}) {
  const [displayModel, setDisplayModel] = useState('modelB'); // 'modelA' | 'modelB'
  const [docPage, setDocPage] = useState(1); // 1 | 2
  const [zoom, setZoom] = useState(100);

  // Model B filters
  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('all'); // 'all' | 'Stage' | 'Off Stage' | 'General'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'Sub Junior' | 'Junior' | 'Senior' | 'General'
  const [selectedGuidelineProg, setSelectedGuidelineProg] = useState(null);

  const charterProgrammes = festivalStore.getCharterProgrammes();
  const activeCompetitions = festivalStore.getCompetitions();
  const scoringRules = festivalStore.getScoringRules();
  const teams = festivalStore.getTeams();
  const charterStats = festivalStore.getCharterStats();

  const activeByCodeOrId = useMemo(() => {
    const map = new Map();
    (activeCompetitions || []).forEach(c => {
      if (c.id) map.set(c.id, c);
      if (c.code) map.set(c.code, c);
      if (c.competitionCode) map.set(c.competitionCode, c);
    });
    return map;
  }, [activeCompetitions]);

  // Page 1 data grouped by category & classification
  const page1Groups = useMemo(() => {
    const cats = ['Sub Junior', 'Junior', 'Senior'];
    return cats.map(cat => ({
      category: cat,
      stage: charterProgrammes.filter(p => p.category === cat && p.classification === 'Stage'),
      offStage: charterProgrammes.filter(p => p.category === cat && p.classification === 'Off Stage')
    }));
  }, [charterProgrammes]);

  const generalItems = useMemo(
    () => charterProgrammes.filter(p => p.classification === 'General'),
    [charterProgrammes]
  );

  // Model B filtered list
  const filteredProgrammes = useMemo(() => {
    return charterProgrammes.filter(p => {
      const matchClass = classificationFilter === 'all' || p.classification === classificationFilter;
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchClass && matchCat && matchSearch;
    });
  }, [charterProgrammes, classificationFilter, categoryFilter, searchQuery]);

  if (!isOpen && !embedded) return null;

  const handlePrint = () => {
    window.print();
  };

  const triggerConfigure = (prog) => {
    if (onConfigureProgramme) {
      onConfigureProgramme(prog);
    } else if (canConfigure) {
      try {
        festivalStore.activateCharterProgramme(prog.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const innerContent = (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col max-h-full">
      {/* Top Toolbar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#A91F35] to-[#7D1426] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916] text-[#A91F35] text-[10px] font-black uppercase tracking-wider">
              Updated 12-Page Charter
            </span>
            <span className="text-[11px] font-mono text-white/80">
              {charterStats.total} Official Programmes • {charterStats.stage} Stage • {charterStats.offStage} Off Stage • {charterStats.general} General
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-black mt-1">
            DALENZIA FEST 2K26 — Two-Display-Model Programme Chart
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Model Switcher */}
          <div className="inline-flex rounded-xl bg-black/25 p-1 border border-white/15">
            <button
              onClick={() => setDisplayModel('modelA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                displayModel === 'modelA' ? 'bg-[#E6A916] text-[#A91F35] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Model A: Two-Page Doc</span>
            </button>
            <button
              onClick={() => setDisplayModel('modelB')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                displayModel === 'modelB' ? 'bg-[#E6A916] text-[#A91F35] shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Model B: Interactive Chart</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {!embedded && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MODEL A: OFFICIAL TWO-PAGE DOCUMENT VIEW */}
      {displayModel === 'modelA' && (
        <div className="flex-1 overflow-y-auto bg-[#F7F3E9]/70 p-4 sm:p-6 space-y-4">
          {/* Document Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDocPage(1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  docPage === 1 ? 'bg-[#A91F35] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Page 1: Category Items (63)
              </button>
              <button
                onClick={() => setDocPage(2)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  docPage === 2 ? 'bg-[#A91F35] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Page 2: General Items & Rules (14)
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setDocPage(docPage === 1 ? 2 : 1)}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                title="Switch Page"
              >
                {docPage === 1 ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setZoom(z => Math.max(75, z - 15))}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-stone-700 min-w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(130, z + 15))}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Printable Sheet Container */}
          <div className="flex justify-center overflow-x-auto pb-4">
            <div
              style={{ width: `${Math.round(8.2 * zoom)}px` }}
              className="bg-white rounded-2xl border-2 border-[#A91F35]/20 shadow-lg p-6 sm:p-8 space-y-6 transition-all"
            >
              {/* Official Document Header */}
              <div className="border-b-2 border-[#A91F35] pb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#A91F35]">
                    DALAILUSSUNNA DARS, AYIROOR • {OFFICIAL_CHARTER_METADATA.confirmedDates}
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-black text-stone-900 mt-0.5">
                    {docPage === 1
                      ? OFFICIAL_TWO_PAGE_PROGRAMME_CHART.page1.title
                      : OFFICIAL_TWO_PAGE_PROGRAMME_CHART.page2.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {docPage === 1
                      ? OFFICIAL_TWO_PAGE_PROGRAMME_CHART.page1.subtitle
                      : OFFICIAL_TWO_PAGE_PROGRAMME_CHART.page2.subtitle}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#F7F3E9] border border-[#E6A916]/50 text-center shrink-0">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Charter Sheet</div>
                  <div className="text-sm font-black font-mono text-[#A91F35]">Page {docPage} / 2</div>
                </div>
              </div>

              {docPage === 1 ? (
                <div className="space-y-6">
                  {/* Page 1 Rules Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-[#F7F3E9] p-3.5 rounded-xl border border-[#E6A916]/40 text-[11px] text-stone-800">
                    {OFFICIAL_TWO_PAGE_PROGRAMME_CHART.page1.rulesSummary.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A91F35] mt-1.5 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3 Category Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {page1Groups.map(grp => (
                      <div key={grp.category} className="border border-stone-200 rounded-2xl overflow-hidden bg-white">
                        <div className="bg-[#A91F35] text-white px-4 py-2.5 flex items-center justify-between">
                          <span className="font-serif font-black text-sm">{grp.category}</span>
                          <span className="text-[10px] font-mono bg-white/15 px-2 py-0.5 rounded-full">
                            {grp.stage.length} Stage + {grp.offStage.length} Off Stage
                          </span>
                        </div>

                        <div className="p-3 space-y-3 text-xs">
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-[#A91F35] bg-rose-50 px-2 py-1 rounded mb-1.5">
                              On Stage ({grp.stage.length})
                            </div>
                            <ol className="space-y-1">
                              {grp.stage.map(item => (
                                <li key={item.id} className="flex items-center justify-between py-0.5 border-b border-stone-100 last:border-0">
                                  <span><strong className="font-mono text-stone-400 mr-1.5">{item.itemNo}</strong>{item.name}</span>
                                  <span className="text-[10px] font-mono text-stone-400">{item.code}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-1 rounded mb-1.5">
                              Off Stage ({grp.offStage.length})
                            </div>
                            <ol className="space-y-1">
                              {grp.offStage.map(item => (
                                <li key={item.id} className="flex items-center justify-between py-0.5 border-b border-stone-100 last:border-0">
                                  <span><strong className="font-mono text-stone-400 mr-1.5">{item.itemNo}</strong>{item.name}</span>
                                  <span className="text-[10px] font-mono text-stone-400">{item.code}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Page 2 Rules Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-[#F7F3E9] p-3.5 rounded-xl border border-[#E6A916]/40 text-[11px] text-stone-800">
                    {OFFICIAL_TWO_PAGE_PROGRAMME_CHART.page2.rulesSummary.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A91F35] mt-1.5 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* General Programmes Table */}
                  <div className="border border-stone-200 rounded-2xl overflow-hidden">
                    <div className="bg-[#A91F35] text-white px-4 py-2.5 flex items-center justify-between">
                      <span className="font-serif font-black text-sm">General Programmes (14 Group / Team Items)</span>
                      <span className="text-[10px] font-mono bg-[#E6A916] text-[#A91F35] font-black px-2 py-0.5 rounded-full">
                        1st: {scoringRules.group.first} | 2nd: {scoringRules.group.second} | 3rd: {scoringRules.group.third} Pts
                      </span>
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">Code</th>
                          <th className="p-2.5">Programme Name</th>
                          <th className="p-2.5 text-center">Members / Entry</th>
                          <th className="p-2.5 text-center">Team Limit</th>
                          <th className="p-2.5">Official Guideline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {generalItems.map(item => (
                          <tr key={item.id}>
                            <td className="p-2.5 font-mono font-bold text-stone-400">{item.itemNo}</td>
                            <td className="p-2.5 font-mono font-bold text-[#A91F35]">{item.code}</td>
                            <td className="p-2.5 font-bold text-stone-900">{item.name}</td>
                            <td className="p-2.5 text-center font-mono font-bold">{item.requiredMembers} Members</td>
                            <td className="p-2.5 text-center">Max 2 Entries/Team</td>
                            <td className="p-2.5 text-[11px] text-stone-600">{item.judgingGuideline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Team Strength Summary Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teams.map(t => (
                      <div key={t.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50">
                        <div className="flex items-center justify-between font-bold text-stone-900">
                          <span>{t.displayName || t.name}</span>
                          <span className="font-mono text-[#A91F35]">{t.members} Scholars</span>
                        </div>
                        <div className="text-[11px] text-stone-600 mt-1">
                          Senior: {t.countsByCategory?.Senior || 0} • Junior: {t.countsByCategory?.Junior || 0} • Sub Junior: {t.countsByCategory?.['Sub Junior'] || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODEL B: INTERACTIVE SEARCHABLE PROGRAMME CHART */}
      {displayModel === 'modelB' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Quick Charter Classification Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'all', label: 'All Charter Items', count: charterStats.total, cls: 'bg-stone-100 text-stone-900 border-stone-200' },
              { id: 'Stage', label: 'On Stage', count: charterStats.stage, cls: 'bg-rose-50 text-[#A91F35] border-rose-200' },
              { id: 'Off Stage', label: 'Off Stage', count: charterStats.offStage, cls: 'bg-amber-50 text-amber-900 border-amber-200' },
              { id: 'General', label: 'General Group', count: charterStats.general, cls: 'bg-purple-50 text-purple-900 border-purple-200' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setClassificationFilter(tab.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  classificationFilter === tab.id ? 'ring-2 ring-[#A91F35] shadow-xs ' + tab.cls : tab.cls + ' opacity-80 hover:opacity-100'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wider">{tab.label}</div>
                <div className="text-xl font-serif font-black mt-0.5">{tab.count}</div>
              </button>
            ))}
          </div>

          {/* Search & Category Tabs */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search 77 Charter programmes by name, code, category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A91F35]/20"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['all', 'Sub Junior', 'Junior', 'Senior', 'General'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#A91F35] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3">#</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Programme</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">Quota & Members</th>
                  <th className="p-3">Points Rule</th>
                  <th className="p-3 text-center">Guideline</th>
                  <th className="p-3 text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProgrammes.map(prog => {
                  const activeComp = activeByCodeOrId.get(prog.id) || activeByCodeOrId.get(prog.code);
                  const isGroup = prog.type === 'Group';
                  return (
                    <tr key={prog.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3 font-mono text-stone-400 font-bold">{prog.itemNo}</td>
                      <td className="p-3 font-mono font-bold text-[#A91F35]">{prog.code}</td>
                      <td className="p-3 font-bold text-stone-900">{prog.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-bold text-[10px]">
                          {prog.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            prog.classification === 'General'
                              ? 'bg-purple-50 text-purple-800'
                              : prog.classification === 'Off Stage'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-[#A91F35]'
                          }`}
                        >
                          {prog.classification}
                        </span>
                      </td>
                      <td className="p-3 text-stone-600">
                        {isGroup
                          ? `${prog.requiredMembers} Members • Max 2/Team`
                          : 'Individual • Max 3/Team'}
                      </td>
                      <td className="p-3 font-mono font-bold text-stone-800">
                        {isGroup
                          ? `${scoringRules.group.first}-${scoringRules.group.second}-${scoringRules.group.third}`
                          : `${scoringRules.individual.first}-${scoringRules.individual.second}-${scoringRules.individual.third}`}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedGuidelineProg(prog)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                          title="Inspect Rulebook Guideline"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        {activeComp ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active ({activeComp.participants?.length || 0} reg)</span>
                          </span>
                        ) : canConfigure ? (
                          <button
                            onClick={() => triggerConfigure(prog)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#A91F35] hover:bg-[#8B1A2C] text-white text-[10px] font-bold transition-all cursor-pointer"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Activate Competition</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-medium">Master Definition</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProgrammes.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-500">
              No Charter programmes matched your filters.
            </div>
          )}
        </div>
      )}

      {/* Judging Guideline Modal */}
      {selectedGuidelineProg && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-3 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div>
                <div className="text-[10px] font-mono font-bold text-[#A91F35]">{selectedGuidelineProg.code}</div>
                <h4 className="font-serif font-black text-base text-stone-900">{selectedGuidelineProg.name}</h4>
              </div>
              <button
                onClick={() => setSelectedGuidelineProg(null)}
                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">{selectedGuidelineProg.judgingGuideline}</p>
            {OFFICIAL_JUDGING_GUIDELINES.filter(g => selectedGuidelineProg.name.toLowerCase().includes(g.programmePattern.toLowerCase())).map(g => (
              <div key={g.id} className="p-3 rounded-xl bg-[#F7F3E9] border border-[#E6A916]/40 text-xs text-stone-800 space-y-1">
                <div className="font-bold text-[#A91F35]">Malayalam Official Rule (Charter pp. 9–11):</div>
                <div>{g.malayalamRule}</div>
              </div>
            ))}
            <div className="space-y-1 pt-1">
              <div className="text-[10px] font-bold uppercase text-stone-500">Official Judging Rubric (Max 100 Marks)</div>
              <div className="flex flex-wrap gap-1.5">
                {(selectedGuidelineProg.evaluationCriteria || []).map(c => (
                  <span key={c.id} className="px-2 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-medium">
                    {c.name} ({c.maxMarks})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) return innerContent;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col">
        {innerContent}
      </div>
    </div>
  );
}
