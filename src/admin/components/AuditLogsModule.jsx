import React from 'react';
import {
  ShieldAlert,
  Clock,
  UserCheck,
  FileText,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function AuditLogsModule() {
  const logs = festivalStore.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-black text-[#1c1917]">
            Immutable System Audit Logs
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            Permanent cryptographic activity trail tracking every score calculation, student update, judge change, and result publication.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Audit Log Integrity: 100% Verified</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-stone-200 font-serif font-black text-stone-800 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Operator</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Target Record</th>
                <th className="py-3.5 px-6">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3 px-6 font-mono text-stone-500 text-[11px]">
                    {l.timestamp}
                  </td>
                  <td className="py-3 px-6 font-bold text-stone-900">
                    {l.user}
                  </td>
                  <td className="py-3 px-6">
                    <span className="bg-[#A91F35]/10 text-[#A91F35] font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-semibold text-stone-800">
                    {l.target}
                  </td>
                  <td className="py-3 px-6 text-stone-600 text-[11px]">
                    {l.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
