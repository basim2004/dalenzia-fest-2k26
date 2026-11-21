import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  Search,
  Users,
  Trophy,
  Calendar,
  Shield,
  UserPlus,
  Compass,
  CheckCircle2,
  X
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerReports() {
  const [reportType, setReportType] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState(null);

  const students = useMemo(() => festivalStore.getStudents(), []);
  const teams = useMemo(() => festivalStore.getTeams(), []);
  const programmes = useMemo(() => festivalStore.getProgrammes(), []);
  const competitions = useMemo(() => festivalStore.getCompetitions(), []);
  const judges = useMemo(() => festivalStore.getJudges(), []);
  const guests = useMemo(() => festivalStore.getProgrammeGuests(), []);
  const schedules = useMemo(() => festivalStore.getProgrammeSchedules(), []);

  const exportCsv = () => {
    let filename = `convener_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;
    let headers = [];
    let rows = [];

    if (reportType === 'students') {
      headers = ['Chest No', 'Student ID', 'Name', 'Team', 'Category', 'Institution', 'Status'];
      rows = students.map(s => [
        s.chestNo,
        s.id,
        `"${s.name}"`,
        `"${s.teamName}"`,
        s.classCategory,
        `"${s.institution}"`,
        s.status
      ]);
    } else if (reportType === 'teams') {
      headers = ['Rank', 'Team Code', 'Team Name', 'Zone', 'Squad Leader', 'Leader Contact', 'Members', 'Points'];
      rows = teams.map(t => [
        t.rank,
        t.code,
        `"${t.name}"`,
        `"${t.subname || ''}"`,
        `"${t.leader || ''}"`,
        `"${t.leaderContact || ''}"`,
        t.members || 0,
        t.points || 0
      ]);
    } else if (reportType === 'programmes') {
      headers = ['Code', 'Title', 'Category', 'Date', 'Time', 'Venue', 'Coordinator', 'Status'];
      rows = programmes.map(p => [
        p.code,
        `"${p.title}"`,
        `"${p.category}"`,
        p.date,
        `"${p.time}"`,
        `"${p.venue}"`,
        `"${p.coordinatorName || ''}"`,
        p.status
      ]);
    } else if (reportType === 'competitions') {
      headers = ['Code', 'Title', 'Arena Category', 'Type', 'Venue', 'Date', 'Registered Participants', 'Status'];
      rows = competitions.map(c => [
        c.code || c.competitionCode,
        `"${c.title || c.competitionTitle}"`,
        `"${c.category}"`,
        c.type || 'Individual',
        `"${c.venue}"`,
        c.date,
        c.participants?.length || 0,
        c.status
      ]);
    } else if (reportType === 'judges') {
      headers = ['Judge ID', 'Name', 'Designation', 'Institution', 'Phone', 'Assigned Events', 'Status'];
      rows = judges.map(j => [
        j.id,
        `"${j.name}"`,
        `"${j.designation}"`,
        `"${j.institution}"`,
        `"${j.phone}"`,
        j.assignedCompIds?.length || 0,
        j.status
      ]);
    } else if (reportType === 'guests') {
      headers = ['Guest ID', 'Name', 'Designation', 'Institution', 'Category', 'Invitation Status'];
      rows = guests.map(g => [
        g.id,
        `"${g.name}"`,
        `"${g.designation}"`,
        `"${g.institution}"`,
        `"${g.category}"`,
        g.invitationStatus
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

    setExportNotice(`Exported ${reportType.toUpperCase()} roster successfully.`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">Convener Operational Reports & Exports</h2>
          <p className="text-xs text-stone-500">Official rosters, participant allocations, stage schedules, and jury rosters</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#F7F3E9] text-[#A91F35] text-xs font-bold hover:bg-[#A91F35] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportCsv}
            className="px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold hover:bg-[#8B1A2C] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      <AnimatePresence>
        {exportNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{exportNotice}</span>
            </div>
            <button onClick={() => setExportNotice(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Select Report Domain */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'students', label: 'Students Roster', count: students.length },
          { id: 'teams', label: 'Team Squads', count: teams.length },
          { id: 'programmes', label: 'Programmes', count: programmes.length },
          { id: 'competitions', label: 'Competitions & Events', count: competitions.length },
          { id: 'judges', label: 'Jury Panels', count: judges.length },
          { id: 'guests', label: 'Guest Dignitaries', count: guests.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              reportType === tab.id
                ? 'bg-[#A91F35] text-white shadow-sm font-black'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] ${
              reportType === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Report Data Preview Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Operational Dataset Preview ({reportType.toUpperCase()})
          </h3>
          <span className="text-[11px] text-stone-400">Official Dalenzia Fest 2K26 Roster</span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'students' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Chest & ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Assigned Squad</th>
                  <th className="py-3 px-4">Division</th>
                  <th className="py-3 px-4">Institution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-[#F7F3E9]/40">
                    <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{s.chestNo} ({s.id})</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{s.name}</td>
                    <td className="py-3 px-4">{s.teamName}</td>
                    <td className="py-3 px-4">{s.classCategory}</td>
                    <td className="py-3 px-4 text-stone-600">{s.institution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'teams' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Team Name & Code</th>
                  <th className="py-3 px-4">Squad Leader</th>
                  <th className="py-3 px-4">Members</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {teams.map(t => (
                  <tr key={t.id} className="hover:bg-[#F7F3E9]/40">
                    <td className="py-3 px-4 font-mono font-bold">#{t.rank}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{t.name} ({t.code})</td>
                    <td className="py-3 px-4">{t.leader}</td>
                    <td className="py-3 px-4">{t.members} Students</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-[#A91F35]">{t.points} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'programmes' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Session Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date & Timing</th>
                  <th className="py-3 px-4">Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {programmes.map(p => (
                  <tr key={p.id} className="hover:bg-[#F7F3E9]/40">
                    <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{p.code}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{p.title}</td>
                    <td className="py-3 px-4">{p.category}</td>
                    <td className="py-3 px-4">{p.date} ({p.time})</td>
                    <td className="py-3 px-4 text-stone-700">{p.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'competitions' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Event Code</th>
                  <th className="py-3 px-4">Competition Title</th>
                  <th className="py-3 px-4">Arena</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Participants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {competitions.map(c => (
                  <tr key={c.id || c.competitionId} className="hover:bg-[#F7F3E9]/40">
                    <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{c.code || c.competitionCode}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{c.title || c.competitionTitle}</td>
                    <td className="py-3 px-4">{c.category}</td>
                    <td className="py-3 px-4">{c.venue}</td>
                    <td className="py-3 px-4 font-mono">{c.participants?.length || 0} Enrolled</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'judges' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Judge ID</th>
                  <th className="py-3 px-4">Adjudicator Name</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {judges.map(j => (
                  <tr key={j.id} className="hover:bg-[#F7F3E9]/40">
                    <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{j.id}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{j.name}</td>
                    <td className="py-3 px-4">{j.institution}</td>
                    <td className="py-3 px-4 font-mono">{j.phone}</td>
                    <td className="py-3 px-4">{j.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'guests' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F0] border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Guest ID</th>
                  <th className="py-3 px-4">Scholar / Dignitary</th>
                  <th className="py-3 px-4">Designation & Institution</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Invitation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {guests.map(g => (
                  <tr key={g.id} className="hover:bg-[#F7F3E9]/40">
                    <td className="py-3 px-4 font-mono font-bold text-[#A91F35]">{g.id}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{g.name}</td>
                    <td className="py-3 px-4">{g.designation} • {g.institution}</td>
                    <td className="py-3 px-4">{g.category}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{g.invitationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
