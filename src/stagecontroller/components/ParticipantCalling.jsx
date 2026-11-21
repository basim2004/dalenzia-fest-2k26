import React, { useState, useMemo } from 'react';
import { 
  Megaphone, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  SkipForward, 
  Search, 
  Filter, 
  UserCheck, 
  Volume2, 
  Radio, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

// Web audio bell chime for stage announcement
function playStageBell() {
  if (typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  try {
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6); // A4
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // Silent fallback
  }
}

export default function ParticipantCalling({ stageId, stageInfo, preselectedCompId, onNavigateToDisplay }) {
  const [competitions, setCompetitions] = useState(() => festivalStore.getStageCompetitions(stageId));
  const [selectedCompId, setSelectedCompId] = useState(() => preselectedCompId || competitions[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionAlert, setActionAlert] = useState(null);
  const [skipModalRecord, setSkipModalRecord] = useState(null);
  const [skipReason, setSkipReason] = useState('Costume delay');
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedComp = useMemo(() => {
    return competitions.find(c => c.id === selectedCompId) || competitions[0] || null;
  }, [competitions, selectedCompId]);

  // Fetch calling records for selected competition
  const callingRecords = useMemo(() => {
    if (!selectedComp) return [];
    return festivalStore.getStageCallingRecords(selectedComp.id, stageId);
  }, [selectedComp, stageId, refreshKey]);

  // Active performing / called participant
  const activeEntry = useMemo(() => {
    return callingRecords.find(r => r.status === 'In Progress' || r.status === 'Called' || r.status === 'Present') || null;
  }, [callingRecords]);

  // Next up participant (first record that is Drawn or Waiting)
  const nextUpEntry = useMemo(() => {
    return callingRecords.find(r => r.status === 'Drawn' || r.status === 'Waiting') || null;
  }, [callingRecords]);

  // Stats
  const stats = useMemo(() => {
    const total = callingRecords.length;
    const completed = callingRecords.filter(r => r.status === 'Completed').length;
    const absent = callingRecords.filter(r => r.status === 'Absent').length;
    const inProgress = callingRecords.filter(r => r.status === 'In Progress' || r.status === 'Called').length;
    const remaining = total - completed - absent;
    return { total, completed, absent, inProgress, remaining };
  }, [callingRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return callingRecords.filter(item => {
      const matchSearch = (item.codeLetter || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.teamName || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [callingRecords, searchTerm, filterStatus]);

  // Change participant calling status
  const handleUpdateStatus = (recordId, newStatus, reason = null) => {
    const res = festivalStore.updateParticipantCallingStatus(recordId, newStatus, reason, stageInfo?.name || 'Stage Controller');
    if (res.success) {
      if (newStatus === 'Called') {
        playStageBell();
      }
      setActionAlert({ type: 'success', text: `Status updated to ${newStatus}.` });
      setTimeout(() => setActionAlert(null), 3000);
      setRefreshKey(prev => prev + 1);
    } else {
      setActionAlert({ type: 'error', text: res.error || 'Failed to update status.' });
    }
  };

  // Submit skip
  const handleConfirmSkip = () => {
    if (!skipModalRecord) return;
    handleUpdateStatus(skipModalRecord.id, 'Skipped', skipReason);
    setSkipModalRecord(null);
    setSkipReason('Costume delay');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A91F35] uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Live Stage Orchestration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1c1917]">
            Participant Calling & Queue Management
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Execute official calls strictly in accordance with random draw positions.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href="#stagedisplay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-stone-900 to-black text-white text-xs font-bold shadow-md hover:brightness-125 transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>Open LED Stage Display</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Select Competition Bar & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Competition Dropdown */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Select Active Competition
          </label>
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 font-bold text-xs text-stone-800 focus:outline-none focus:border-[#A91F35]"
          >
            {competitions.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.title} ({c.category})
              </option>
            ))}
          </select>
          <div className="mt-3 text-[11px] font-medium text-stone-500 flex justify-between">
            <span>Stage Status:</span>
            <span className="font-bold text-[#A91F35] uppercase">{selectedComp?.stageStatus || 'Upcoming'}</span>
          </div>
        </div>

        {/* Total In Queue */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Drawn</span>
            <span className="text-2xl font-serif font-black text-stone-800">{stats.total}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Assigned Sequence</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center font-bold">
            #
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-serif font-black text-emerald-800">{stats.completed}</span>
            <span className="text-[10px] text-emerald-600/70 block mt-0.5">Performances Finished</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Absentees & Skipped */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Remaining</span>
            <span className="text-2xl font-serif font-black text-amber-800">{stats.remaining}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Absent: {stats.absent}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Primary Active Stage Entry Spotlight Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Stage Call (2 cols) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1c1917] via-[#2d0d14] to-[#1a080d] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-[#E6A916]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Currently Active on Stage</span>
              </span>

              {activeEntry && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  activeEntry.status === 'In Progress' ? 'bg-amber-400 text-stone-900 animate-pulse' : 'bg-blue-400 text-white'
                }`}>
                  {activeEntry.status}
                </span>
              )}
            </div>

            {activeEntry ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono font-black text-4xl sm:text-6xl text-[#E6A916] tracking-tight">
                    {activeEntry.codeLetter}
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                      {activeEntry.studentName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-300 mt-1">
                      <span className="font-bold text-[#E6A916]">{activeEntry.teamName || 'Independent'}</span>
                      <span>•</span>
                      <span className="font-mono">Call #{activeEntry.callOrder}</span>
                      <span>•</span>
                      <span className="font-mono">Admn: {activeEntry.admissionNo || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Operational Quick Action Buttons for Active Entry */}
                <div className="pt-4 flex flex-wrap items-center gap-2">
                  {activeEntry.status === 'Called' && (
                    <button
                      onClick={() => handleUpdateStatus(activeEntry.id, 'Present')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Mark Present</span>
                    </button>
                  )}

                  {activeEntry.status !== 'In Progress' && (
                    <button
                      onClick={() => handleUpdateStatus(activeEntry.id, 'In Progress')}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#E6A916] to-[#d69807] text-stone-900 font-black text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Performance</span>
                    </button>
                  )}

                  {activeEntry.status === 'In Progress' && (
                    <button
                      onClick={() => handleUpdateStatus(activeEntry.id, 'Completed')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finish & Mark Completed</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSkipModalRecord(activeEntry)}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold transition-all"
                  >
                    <SkipForward className="w-3.5 h-3.5 inline mr-1" />
                    <span>Skip / Hold</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-stone-400">
                <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40 text-stone-300" />
                <p className="text-sm font-serif font-bold text-stone-300">Stage is currently idle.</p>
                <p className="text-xs text-stone-500 mt-1">
                  Call the next queued participant below to begin performance.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Next Up / On Deck Card (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>Next On Stage (On Deck)</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-stone-500">
                Queue #{nextUpEntry?.callOrder || '—'}
              </span>
            </div>

            {nextUpEntry ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-2xl text-[#A91F35] bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                    {nextUpEntry.codeLetter}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-stone-800 line-clamp-1">
                      {nextUpEntry.studentName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {nextUpEntry.teamName || 'Independent'}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-tight">
                  Participant is ready in waiting area. Ready to sound stage bell and notify display.
                </p>
              </div>
            ) : (
              <div className="py-6 text-center text-stone-400 text-xs">
                No upcoming participants in queue.
              </div>
            )}
          </div>

          {nextUpEntry && (
            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={() => handleUpdateStatus(nextUpEntry.id, 'Called')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#A91F35] hover:bg-[#801426] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Megaphone className="w-3.5 h-3.5 text-[#E6A916]" />
                <span>CALL TO STAGE NOW</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Calling Queue Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Table Filter & Search */}
        <div className="p-4 sm:p-6 border-b border-stone-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#A91F35]" />
            <span className="font-serif font-black text-base text-stone-800">
              Calling Queue Roster ({filteredRecords.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search code, participant, team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:outline-none focus:border-[#A91F35]"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Drawn">Drawn / Queued</option>
                <option value="Waiting">Waiting</option>
                <option value="Called">Called</option>
                <option value="Present">Present</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Absent">Absent</option>
                <option value="Skipped">Skipped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100/70 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4">Draw #</th>
                <th className="py-3 px-4">Code Letter</th>
                <th className="py-3 px-4">Participant Name</th>
                <th className="py-3 px-4">Team / Squad</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Timestamps</th>
                <th className="py-3 px-4 text-right">Controller Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No participants found in calling queue. Complete the Random Draw ceremony first!
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-500">
                      #{item.callOrder || item.drawOrder}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-black text-sm text-[#A91F35]">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200">
                        {item.codeLetter}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      <div>{item.studentName}</div>
                      <div className="text-[10px] text-stone-400 font-mono">Admn: {item.admissionNo || '—'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        {item.teamName || 'Independent'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'In Progress' ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' :
                        item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Called' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        item.status === 'Present' ? 'bg-indigo-100 text-indigo-800' :
                        item.status === 'Absent' ? 'bg-red-100 text-red-800' :
                        item.status === 'Skipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {item.status}
                      </span>
                      {item.skipReason && (
                        <span className="block text-[10px] text-stone-400 italic mt-0.5">
                          Note: {item.skipReason}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[10px] text-stone-500 space-y-0.5">
                      {item.startedAt && <div>Start: {new Date(item.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                      {item.completedAt && <div>End: {new Date(item.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                      {!item.startedAt && !item.completedAt && <div>—</div>}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {item.status !== 'In Progress' && item.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Called')}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#A91F35] hover:text-white text-stone-700 text-[11px] font-bold transition-all"
                            title="Call to stage"
                          >
                            <Megaphone className="w-3 h-3 inline mr-1" />
                            <span>Call</span>
                          </button>
                        )}

                        {item.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-[11px] font-bold transition-all"
                            title="Mark Completed"
                          >
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            <span>Done</span>
                          </button>
                        )}

                        {item.status !== 'Completed' && item.status !== 'Absent' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Mark ${item.studentName} (${item.codeLetter}) as ABSENT?`)) {
                                handleUpdateStatus(item.id, 'Absent');
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-red-500 hover:text-white text-stone-500 text-[11px] font-bold transition-all"
                            title="Mark Absent"
                          >
                            <AlertOctagon className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => setSkipModalRecord(item)}
                          className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 text-[11px] font-bold transition-all"
                          title="Skip / Hold"
                        >
                          <SkipForward className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skip / Hold Modal Dialog */}
      {skipModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-amber-700">
              <SkipForward className="w-5 h-5" />
              <h3 className="font-serif font-black text-lg text-stone-900">
                Skip / Hold Participant
              </h3>
            </div>

            <p className="text-xs text-stone-600">
              Temporarily skip <span className="font-bold text-stone-900">{skipModalRecord.studentName}</span> ({skipModalRecord.codeLetter}) in queue.
            </p>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Reason for Skipping:
              </label>
              <select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-[#A91F35]"
              >
                <option value="Costume delay">Costume / Dress delay</option>
                <option value="Prayers / Salah">Engaged in Prayers (Salah)</option>
                <option value="Competing in simultaneous event">Simultaneous competition event</option>
                <option value="Medical / First Aid">Medical / First Aid attention</option>
                <option value="Stage Controller hold">Stage Controller administrative hold</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSkipModalRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
