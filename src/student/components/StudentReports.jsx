import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, Printer, Download, Trophy, Award,
  Calendar, CheckCircle2, FileText, UserCheck
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function StudentReports({ studentSession }) {
  const [report, setReport] = useState(null);

  const studentId = studentSession?.id;

  useEffect(() => {
    if (!studentId) return;
    try {
      const data = festivalStore.getStudentReportData(studentId);
      setReport(data);
    } catch (e) {
      console.error(e);
    }
  }, [studentId]);

  const handleDownloadCSV = () => {
    if (!report) return;

    let csv = `DALENZIA FEST 2K26 - STUDENT PERFORMANCE DOSSIER\n`;
    csv += `Candidate Name,${report.student?.name}\n`;
    csv += `Chest Number,${report.student?.chestNo}\n`;
    csv += `Squad,${report.student?.teamName}\n`;
    csv += `Class Category,${report.student?.classCategory}\n`;
    csv += `Total Competitions,${report.competitions?.length}\n`;
    csv += `Total Laurels,${report.results?.length}\n`;
    csv += `Total Points Contributed,${report.stats?.totalPointsContributed}\n\n`;

    csv += `REGISTERED COMPETITIONS\n`;
    csv += `Code,Title,Category,Type,Venue,Date,Status\n`;
    report.competitions?.forEach((c) => {
      csv += `"${c.code}","${c.title}","${c.category}","${c.type}","${c.venue}","${c.date}","${c.status}"\n`;
    });

    csv += `\nCERTIFIED AWARDS & RESULTS\n`;
    csv += `Competition,Position,Score,Points Contributed,Published Date\n`;
    report.results?.forEach((r) => {
      csv += `"${r.competitionTitle}","${r.position}","${r.score}","${r.points}","${r.publishedAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Dalenzia_Student_Dossier_${report.student?.chestNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="text-xl font-serif font-black text-stone-900">
            Personal Performance Dossier
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Comprehensive audit report of your registrations, stage schedule, and official points.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleDownloadCSV}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#A91F35] hover:bg-[#8e172a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Dossier Card (Printable) */}
      <div id="student-report-dossier" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs space-y-6">
        {/* Dossier Header */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#A91F35] text-[#E6A916] flex items-center justify-center font-serif font-black text-2xl shadow-xs">
              {report?.student?.chestNo?.replace('C-', '') || '01'}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-[#A91F35]">
                Candidate Performance Profile
              </div>
              <h3 className="text-xl font-serif font-black text-stone-900">
                {report?.student?.name}
              </h3>
              <p className="text-xs text-stone-500">
                Chest No: <strong className="font-mono text-[#A91F35]">{report?.student?.chestNo}</strong> • Squad: <strong>{report?.student?.teamName}</strong> • {report?.student?.classCategory} Category
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block text-xs">
            <div className="font-bold text-stone-900">Dalenzia Fest 2K26</div>
            <div className="text-[11px] text-stone-400 font-mono">Generated: {report?.generatedAt}</div>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-center">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Competitions</span>
            <span className="text-xl font-serif font-black text-stone-900">{report?.competitions?.length || 0}</span>
          </div>
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-center">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Sessions</span>
            <span className="text-xl font-serif font-black text-stone-900">{report?.programmes?.length || 0}</span>
          </div>
          <div className="p-3.5 bg-[#E6A916]/10 rounded-2xl border border-[#E6A916]/30 text-center">
            <span className="text-[10px] text-[#A91F35] font-bold uppercase block">Certified Podiums</span>
            <span className="text-xl font-serif font-black text-[#A91F35]">{report?.results?.length || 0}</span>
          </div>
          <div className="p-3.5 bg-[#A91F35]/10 rounded-2xl border border-[#A91F35]/20 text-center">
            <span className="text-[10px] text-[#A91F35] font-bold uppercase block">Points Earned</span>
            <span className="text-xl font-serif font-black text-[#A91F35]">+{report?.stats?.totalPointsContributed || 0}</span>
          </div>
        </div>

        {/* Competitions Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Registered Stage Arenas & Status
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200/80 rounded-2xl overflow-hidden">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Venue</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {report?.competitions?.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-[#A91F35]">{c.code}</td>
                    <td className="p-3 font-bold text-stone-900">{c.title}</td>
                    <td className="p-3 text-stone-600">{c.category}</td>
                    <td className="p-3 text-stone-600">{c.venue}</td>
                    <td className="p-3 text-stone-600">{c.date}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Certified Placement & Laurels
          </h4>
          {report?.results?.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No published awards recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200/80 rounded-2xl overflow-hidden">
                <thead className="bg-[#E6A916]/10 text-[#A91F35] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Competition</th>
                    <th className="p-3">Laurel</th>
                    <th className="p-3">Final Score</th>
                    <th className="p-3">Points</th>
                    <th className="p-3">Published At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {report?.results?.map((r, i) => (
                    <tr key={i} className="hover:bg-stone-50/50">
                      <td className="p-3 font-bold text-stone-900">{r.competitionTitle}</td>
                      <td className="p-3 font-bold text-[#A91F35]">{r.badge}</td>
                      <td className="p-3 font-bold text-stone-800">{r.score}</td>
                      <td className="p-3 font-mono font-black text-[#A91F35]">+{r.points}</td>
                      <td className="p-3 text-stone-500 font-mono text-[11px]">{r.publishedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
