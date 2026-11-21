import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StageReports({ stageId, stageInfo }) {
  const [reportType, setReportType] = useState('draw_order'); // 'draw_order' | 'calling_log' | 'absentees'
  const [competitions, setCompetitions] = useState(() => festivalStore.getStageCompetitions(stageId));
  const [selectedCompId, setSelectedCompId] = useState(() => competitions[0]?.id || 'ALL');

  const selectedComp = useMemo(() => {
    if (selectedCompId === 'ALL') return null;
    return competitions.find(c => c.id === selectedCompId) || null;
  }, [competitions, selectedCompId]);

  // Fetch report data from store
  const reportData = useMemo(() => {
    return festivalStore.getStageReports(stageId, selectedCompId);
  }, [stageId, selectedCompId]);

  // Export CSV
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = `Stage_Report_${stageId}_${reportType}.csv`;

    if (reportType === 'draw_order') {
      headers = ['Draw Order', 'Code Letter', 'Student Name', 'Admission No', 'Team / Squad', 'Competition Code', 'Competition Title', 'Draw Timestamp'];
      rows = (reportData.drawRecords || []).map(r => [
        r.drawOrder,
        r.codeLetter,
        `"${r.studentName}"`,
        r.admissionNo || '',
        `"${r.teamName || 'Independent'}"`,
        r.competitionCode || '',
        `"${r.competitionTitle || ''}"`,
        `"${new Date(r.drawnAt).toLocaleString()}"`
      ]);
    } else if (reportType === 'calling_log') {
      headers = ['Call Order', 'Code Letter', 'Student Name', 'Team / Squad', 'Competition', 'Status', 'Started At', 'Completed At', 'Skip Reason'];
      rows = (reportData.callingRecords || []).map(r => [
        r.callOrder,
        r.codeLetter,
        `"${r.studentName}"`,
        `"${r.teamName || 'Independent'}"`,
        `"${r.competitionTitle || ''}"`,
        r.status,
        r.startedAt ? `"${new Date(r.startedAt).toLocaleTimeString()}"` : '',
        r.completedAt ? `"${new Date(r.completedAt).toLocaleTimeString()}"` : '',
        `"${r.skipReason || ''}"`
      ]);
    } else {
      headers = ['Code Letter', 'Student Name', 'Team / Squad', 'Competition', 'Status', 'Justification'];
      rows = (reportData.callingRecords || []).filter(r => r.status === 'Absent' || r.status === 'Skipped').map(r => [
        r.codeLetter,
        `"${r.studentName}"`,
        `"${r.teamName || 'Independent'}"`,
        `"${r.competitionTitle || ''}"`,
        r.status,
        `"${r.skipReason || 'Unexplained absence'}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A91F35] uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-[#E6A916]" />
            <span>Operational Dossier & Audits</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1c1917]">
            Stage Operational Reports & Export
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Generate and export official draw sheets, participant calling logs, and stage audit summaries.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector & Filter */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setReportType('draw_order')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              reportType === 'draw_order' ? 'bg-[#A91F35] text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Official Draw Order Sheet
          </button>

          <button
            onClick={() => setReportType('calling_log')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              reportType === 'calling_log' ? 'bg-[#A91F35] text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Performance Execution Log
          </button>

          <button
            onClick={() => setReportType('absentees')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              reportType === 'absentees' ? 'bg-[#A91F35] text-white shadow-md' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Absentees & Holds Log
          </button>
        </div>

        {/* Filter Competition */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-bold shrink-0">Filter:</span>
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="ALL">All Stage Competitions</option>
            {competitions.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Printable Report Paper Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Report Printable Crest Header */}
        <div className="border-b-2 border-stone-200 pb-6 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#A91F35]">
              DALENZIA FEST 2K26 – NUEVA ERA • DALAILUSSUNNA DARS, AYIROOR
            </div>
            <h3 className="text-2xl font-serif font-black text-stone-900 mt-1">
              {reportType === 'draw_order' ? 'Official Stage Random Draw Order Dossier' :
               reportType === 'calling_log' ? 'Stage Performance & Calling Execution Log' :
               'Participant Absence & Hold Incident Log'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Venue: <span className="font-bold text-stone-800">{stageInfo?.name || 'Assigned Stage'}</span> | 
              Controller: <span className="font-bold text-stone-800">{stageInfo?.controllerName || 'Official'}</span> | 
              Generated: <span className="font-mono">{new Date().toLocaleString()}</span>
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-mono font-bold">
              STAGE ID: {stageId}
            </span>
          </div>
        </div>

        {/* Dynamic Table based on Report Type */}
        {reportType === 'draw_order' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase">
                  <th className="py-2.5 px-3">Draw #</th>
                  <th className="py-2.5 px-3">Participant Code</th>
                  <th className="py-2.5 px-3">Participant Name</th>
                  <th className="py-2.5 px-3">Admn No</th>
                  <th className="py-2.5 px-3">Team / Squad</th>
                  <th className="py-2.5 px-3">Competition</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {(reportData.drawRecords || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      No random draw records found for this stage.
                    </td>
                  </tr>
                ) : (
                  (reportData.drawRecords || []).map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#A91F35]">#{r.drawOrder}</td>
                      <td className="py-2.5 px-3 font-mono font-black text-stone-900">{r.codeLetter}</td>
                      <td className="py-2.5 px-3 font-bold">{r.studentName}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-500">{r.admissionNo || '—'}</td>
                      <td className="py-2.5 px-3">{r.teamName || 'Independent'}</td>
                      <td className="py-2.5 px-3 text-stone-600">{r.competitionTitle || r.competitionCode}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-stone-400">
                        {new Date(r.drawnAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'calling_log' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase">
                  <th className="py-2.5 px-3">Call #</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Participant Name</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Start Time</th>
                  <th className="py-2.5 px-3">Finish Time</th>
                  <th className="py-2.5 px-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {(reportData.callingRecords || []).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-stone-400">
                      No calling records recorded yet.
                    </td>
                  </tr>
                ) : (
                  (reportData.callingRecords || []).map((r, i) => {
                    let duration = '—';
                    if (r.startedAt && r.completedAt) {
                      const diffSec = Math.round((new Date(r.completedAt) - new Date(r.startedAt)) / 1000);
                      const min = Math.floor(diffSec / 60);
                      const sec = diffSec % 60;
                      duration = `${min}m ${sec}s`;
                    }
                    return (
                      <tr key={r.id || i} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-500">#{r.callOrder}</td>
                        <td className="py-2.5 px-3 font-mono font-black text-[#A91F35]">{r.codeLetter}</td>
                        <td className="py-2.5 px-3 font-bold">{r.studentName}</td>
                        <td className="py-2.5 px-3">{r.teamName || 'Independent'}</td>
                        <td className="py-2.5 px-3 font-bold uppercase text-[10px]">{r.status}</td>
                        <td className="py-2.5 px-3 font-mono text-stone-500">
                          {r.startedAt ? new Date(r.startedAt).toLocaleTimeString() : '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-stone-500">
                          {r.completedAt ? new Date(r.completedAt).toLocaleTimeString() : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-700">
                          {duration}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'absentees' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Participant Name</th>
                  <th className="py-2.5 px-3">Admn No</th>
                  <th className="py-2.5 px-3">Team / Squad</th>
                  <th className="py-2.5 px-3">Incident Status</th>
                  <th className="py-2.5 px-3 text-right">Reason / Controller Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {(reportData.callingRecords || []).filter(r => r.status === 'Absent' || r.status === 'Skipped').length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-emerald-600 font-bold">
                      Excellent! Zero absentees or held participants on this stage.
                    </td>
                  </tr>
                ) : (
                  (reportData.callingRecords || []).filter(r => r.status === 'Absent' || r.status === 'Skipped').map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 font-mono font-black text-red-700">{r.codeLetter}</td>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{r.studentName}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-500">{r.admissionNo || '—'}</td>
                      <td className="py-2.5 px-3">{r.teamName || 'Independent'}</td>
                      <td className="py-2.5 px-3 font-black text-[10px] uppercase text-red-600">{r.status}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-stone-600 italic">
                        {r.skipReason || 'Unexplained absence recorded at stage call.'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Signature Box for Printing */}
        <div className="pt-8 border-t border-stone-200 grid grid-cols-3 gap-6 text-center text-xs text-stone-500 print:mt-12">
          <div>
            <div className="h-10 border-b border-stone-300 mb-1"></div>
            <span>Stage Controller Signature</span>
          </div>
          <div>
            <div className="h-10 border-b border-stone-300 mb-1"></div>
            <span>Head of Adjudication Desk</span>
          </div>
          <div>
            <div className="h-10 border-b border-stone-300 mb-1"></div>
            <span>Festival Convener Seal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
