import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Users,
  Trophy,
  Calendar,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function TeamLeaderReports({ teamId }) {
  const [reportData, setReportData] = useState(() => festivalStore.getTeamReportsData(teamId));
  const [activeReportTab, setActiveReportTab] = useState('roster'); // 'roster' | 'competitions' | 'programmes' | 'results'

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      setReportData(festivalStore.getTeamReportsData(teamId));
    });
    return () => unsub();
  }, [teamId]);

  const team = reportData.team;
  const students = reportData.students || [];
  const competitions = reportData.competitions || [];
  const programmes = reportData.programmes || [];
  const results = reportData.results || [];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (activeReportTab === 'roster') {
      csvContent += "Chest No,Student ID,Candidate Name,Category,Discipline,Team\n";
      students.forEach(s => {
        csvContent += `"${s.chestNo}","${s.id}","${s.name}","${s.category || 'Junior'}","${s.compCategory || 'Literary'}","${team.name}"\n`;
      });
    } else if (activeReportTab === 'competitions') {
      csvContent += "Code,Competition Title,Category,Venue,Date,Enrolled Candidates\n";
      competitions.forEach(c => {
        const candidateNames = (c.teamParticipants || []).map(p => `${p.chestNo}: ${p.name}`).join('; ');
        csvContent += `"${c.competitionCode}","${c.competitionTitle}","${c.category}","${c.venue}","${c.date}","${candidateNames}"\n`;
      });
    } else if (activeReportTab === 'results') {
      csvContent += "Code,Competition Title,Award Position,Candidate Name,Score,Points Awarded\n";
      results.forEach(r => {
        r.awards.forEach(a => {
          csvContent += `"${r.competitionCode}","${r.competitionTitle}","${a.position}","${a.name}","${a.score}","${a.points}"\n`;
        });
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${team.name}_${activeReportTab}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-[#A91F35] bg-[#A91F35]/10 px-2.5 py-0.5 rounded-full">
              Official Data Exports
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              Squad: {team?.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
            Team Reports & Dossier Generation
          </h2>
          <p className="text-xs text-stone-500 max-w-xl">
            Export official certified candidate lists, competition enrolment sheets, and championship points summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-2xl bg-[#A91F35] hover:bg-[#8e192c] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[#E6A916]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Category Selector */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'roster', label: `Student Roster (${students.length})`, icon: Users },
          { id: 'competitions', label: `Competition Registrations (${competitions.length})`, icon: Trophy },
          { id: 'programmes', label: `Programme Delegations (${programmes.length})`, icon: Calendar },
          { id: 'results', label: `Official Results & Laurels (${results.length})`, icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive ? 'bg-[#A91F35] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6A916]' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Data Card (Printable) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif font-black text-base text-stone-900">
              {activeReportTab === 'roster'
                ? `${team.name} • Certified Student Candidate Registry`
                : activeReportTab === 'competitions'
                ? `${team.name} • Enrolled Competition Entries`
                : activeReportTab === 'programmes'
                ? `${team.name} • Festival Stage Delegations`
                : `${team.name} • Official Podium Awards & Championship Points`}
            </h3>
            <div className="text-[11px] text-stone-400">Generated: {reportData.generatedAt}</div>
          </div>
          <span className="text-xs font-mono font-bold text-[#A91F35]">
            {team.code} • Rank #{team.rank} ({team.points} pts)
          </span>
        </div>

        {/* Tab 1: Student Roster */}
        {activeReportTab === 'roster' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Chest No</th>
                  <th className="py-2.5 px-3">Student Candidate</th>
                  <th className="py-2.5 px-3">Class Category</th>
                  <th className="py-2.5 px-3">Discipline Focus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#A91F35]">{s.chestNo}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">{s.name}</td>
                    <td className="py-2.5 px-3">{s.category || 'Junior'}</td>
                    <td className="py-2.5 px-3 text-stone-600">{s.compCategory || 'Literary Arena'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Competitions */}
        {activeReportTab === 'competitions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Competition Event</th>
                  <th className="py-2.5 px-3">Stage / Venue</th>
                  <th className="py-2.5 px-3">Registered Candidates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {competitions.map(c => (
                  <tr key={c.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#A91F35]">{c.competitionCode}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">{c.competitionTitle}</td>
                    <td className="py-2.5 px-3 text-stone-600">{c.venue}</td>
                    <td className="py-2.5 px-3">
                      {(c.teamParticipants || []).map(p => (
                        <span key={p.studentId} className="inline-block bg-stone-100 px-1.5 py-0.5 rounded text-[10px] mr-1 font-mono">
                          {p.chestNo}: {p.name}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Programmes */}
        {activeReportTab === 'programmes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Programme Title</th>
                  <th className="py-2.5 px-3">Venue & Time</th>
                  <th className="py-2.5 px-3">Delegation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {programmes.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#A91F35]">{p.code}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">{p.title}</td>
                    <td className="py-2.5 px-3 text-stone-600">{p.venue} • {p.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        Registered ({p.registrationDetails?.studentIds?.length || 0} Delegates)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Results */}
        {activeReportTab === 'results' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Competition</th>
                  <th className="py-2.5 px-3">Award Placement</th>
                  <th className="py-2.5 px-3">Winner Candidate</th>
                  <th className="py-2.5 px-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {results.flatMap(r => r.awards.map((a, i) => (
                  <tr key={`${r.competitionId}-${i}`} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#A91F35]">{r.competitionCode}</td>
                    <td className="py-2.5 px-3 font-bold text-stone-900">{r.competitionTitle}</td>
                    <td className="py-2.5 px-3 font-black text-stone-800">{a.prizeBadge} {a.position}</td>
                    <td className="py-2.5 px-3">{a.name} ({a.chestNo})</td>
                    <td className="py-2.5 px-3 text-right font-black text-[#A91F35]">+{a.points} pts</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
