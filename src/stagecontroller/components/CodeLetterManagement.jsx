import React, { useState, useMemo } from 'react';
import { 
  Hash, 
  RefreshCw, 
  Search, 
  Filter, 
  Printer, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Sparkles,
  Download,
  ShieldAlert
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function CodeLetterManagement({ stageId, stageInfo, onNavigateToDraw }) {
  const [competitions, setCompetitions] = useState(() => festivalStore.getStageCompetitions(stageId));
  const [selectedCompId, setSelectedCompId] = useState(() => competitions[0]?.id || '');
  const [prefix, setPrefix] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('ALL');
  const [actionMessage, setActionMessage] = useState(null);

  // Refresh competitions
  const refreshData = () => {
    const comps = festivalStore.getStageCompetitions(stageId);
    setCompetitions(comps);
    if (!selectedCompId && comps.length > 0) {
      setSelectedCompId(comps[0].id);
    }
  };

  const selectedComp = useMemo(() => {
    return competitions.find(c => c.id === selectedCompId) || competitions[0] || null;
  }, [competitions, selectedCompId]);

  // Get code assignments and draw session
  const codeAssignments = useMemo(() => {
    if (!selectedComp) return [];
    return festivalStore.getCompetitionCodeAssignments(selectedComp.id, stageId);
  }, [selectedComp, stageId, actionMessage]);

  const drawSession = useMemo(() => {
    if (!selectedComp) return null;
    return festivalStore.getOrCreateDrawSession(stageId, selectedComp.id, stageInfo?.name || 'Stage Controller');
  }, [selectedComp, stageId, actionMessage]);

  const isLocked = Boolean(drawSession && (drawSession.status === 'COMPLETED' || (drawSession.drawnSequence && drawSession.drawnSequence.length > 0)));

  // Teams list for filter
  const teamsList = useMemo(() => {
    const teams = new Set();
    codeAssignments.forEach(item => {
      if (item.teamName) teams.add(item.teamName);
    });
    return Array.from(teams);
  }, [codeAssignments]);

  // Filtered code list
  const filteredAssignments = useMemo(() => {
    return codeAssignments.filter(item => {
      const matchSearch = (item.codeLetter || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.admissionNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.teamName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchTeam = filterTeam === 'ALL' || item.teamName === filterTeam;
      return matchSearch && matchTeam;
    });
  }, [codeAssignments, searchTerm, filterTeam]);

  // Generate or Regenerate codes
  const handleGenerateCodes = () => {
    if (isLocked) {
      alert('Code generation is locked because a random draw session is already active or completed for this competition. Contact Convener for reset.');
      return;
    }
    const cleanPrefix = (prefix || 'A').toUpperCase().trim();
    const result = festivalStore.generateParticipantCodes(selectedComp.id, stageId, cleanPrefix, stageInfo?.name || 'Stage Controller');
    if (result.success) {
      setActionMessage({ type: 'success', text: `Successfully generated ${result.count} participant codes with prefix "${cleanPrefix}".` });
      setTimeout(() => setActionMessage(null), 4000);
    } else {
      setActionMessage({ type: 'error', text: result.error || 'Failed to generate participant codes.' });
    }
  };

  // Export roster to CSV
  const handleExportCSV = () => {
    if (filteredAssignments.length === 0) return;
    const headers = ['Serial No', 'Code Letter', 'Student Name', 'Admission No', 'Team / Squad', 'Category', 'Draw Status'];
    const rows = filteredAssignments.map((a, i) => [
      i + 1,
      a.codeLetter,
      `"${a.studentName}"`,
      a.admissionNo,
      `"${a.teamName || 'Independent'}"`,
      `"${selectedComp?.category || ''}"`,
      a.drawn ? 'Drawn' : 'Pending Draw'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Code_Roster_${selectedComp?.code || 'COMP'}_${stageId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Roster
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A91F35] uppercase tracking-wider mb-1">
            <Hash className="w-4 h-4" />
            <span>Participant Identifier Protocol</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1c1917]">
            Participant Code Letter Management
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Generate and manage anonymous code letters (e.g. <span className="font-mono font-bold text-[#A91F35]">A-001</span>) linked to participants for unbiased judging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            disabled={filteredAssignments.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Roster</span>
          </button>

          {selectedComp && (
            <button
              onClick={() => onNavigateToDraw && onNavigateToDraw(selectedComp.id)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#A91F35] to-[#801426] text-white text-xs font-black shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#E6A916]" />
              <span>Launch Live Random Draw</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert banner if exists */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold ${
          actionMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Select Competition Bar & Code Generator Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Competition Selector */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Select Competition on {stageInfo?.name || 'This Stage'}
          </label>
          {competitions.length === 0 ? (
            <div className="p-4 rounded-2xl bg-stone-50 border border-dashed border-stone-200 text-center text-xs text-stone-500">
              No competitions scheduled on this stage yet.
            </div>
          ) : (
            <select
              value={selectedCompId}
              onChange={(e) => setSelectedCompId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 font-bold text-sm text-stone-800 focus:outline-none focus:border-[#A91F35]"
            >
              {competitions.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.title} ({c.category})
                </option>
              ))}
            </select>
          )}

          {selectedComp && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Category:</span>
                <span className="font-bold text-stone-800">{selectedComp.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Stage Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#A91F35]/10 text-[#A91F35]">
                  {selectedComp.stageStatus || 'Upcoming'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Registered Participants:</span>
                <span className="font-bold text-stone-800">{codeAssignments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Draw State:</span>
                <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full ${
                  isLocked ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isLocked ? 'Draw Active / Locked' : 'Ready to Draw'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 cols: Code Generation Desk */}
        <div className="lg:col-span-2 bg-gradient-to-br from-stone-900 to-stone-800 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#E6A916] uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-4 h-4" />
                <span>Code Letter Generator Protocol</span>
              </span>
              {isLocked ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-[#E6A916] border border-[#E6A916]/30 text-[10px] font-black uppercase tracking-wider">
                  <Lock className="w-3 h-3" />
                  <span>Immutable Locked</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Unlocked for Generation</span>
                </span>
              )}
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Codes are formatted as <code className="bg-black/40 px-2 py-0.5 rounded text-[#E6A916] font-mono font-bold">[PREFIX]-[001]</code>. 
              Once codes are generated, participants are pooled for the live random draw ceremony.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block mb-1">
                  Code Letter Prefix
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={3}
                    value={prefix}
                    disabled={isLocked}
                    onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                    className="w-24 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono font-black text-center focus:outline-none focus:border-[#E6A916] disabled:opacity-50"
                  />
                  <span className="text-xs text-stone-400">e.g. A, B, C or STG</span>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateCodes}
                  disabled={isLocked || !selectedComp}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E6A916] to-[#c98e09] text-stone-900 font-black text-xs shadow-md hover:brightness-110 transition-all disabled:opacity-40"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{codeAssignments.length > 0 ? 'Regenerate Participant Codes' : 'Generate Codes Now'}</span>
                </button>
              </div>
            </div>
          </div>

          {isLocked && (
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-[#E6A916] shrink-0" />
              <span>Draw process has started. Codes cannot be modified without Convener authorization.</span>
            </div>
          )}
        </div>
      </div>

      {/* Roster & Search Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-4 sm:p-6 border-b border-stone-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#A91F35]" />
            <span className="font-serif font-black text-base text-stone-800">
              Official Participant Code Roster ({filteredAssignments.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search code, name, admission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            {/* Filter by Team */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="ALL">All Squads / Teams</option>
                {teamsList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100/70 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Assigned Code</th>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Admn No</th>
                <th className="py-3 px-4">Team / Squad</th>
                <th className="py-3 px-4">Draw State</th>
                <th className="py-3 px-4 text-right">Calling Queue Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-400">
                    No participant code assignments found for this competition.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-sm text-[#A91F35]">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200">
                        {item.codeLetter}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">{item.studentName}</td>
                    <td className="py-3.5 px-4 font-mono text-stone-500">{item.admissionNo || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-100 text-stone-700">
                        {item.teamName || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.drawn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Drawn #{item.drawOrder}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-500">
                          <span>In Pool</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-800">
                      {item.drawOrder ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Sequence #{item.drawOrder}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Pending Draw</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
