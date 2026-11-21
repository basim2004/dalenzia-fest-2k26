import React, { useState, useMemo } from 'react';
import {
  Clock,
  Search,
  Filter,
  Shield,
  User,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function ConvenerAuditLogs() {
  const [auditLogs, setAuditLogs] = useState(() => festivalStore.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(l => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        l.action.toLowerCase().includes(q) ||
        (l.performedBy && l.performedBy.toLowerCase().includes(q)) ||
        (l.details && l.details.toLowerCase().includes(q));

      const matchesRole =
        selectedRole === 'all' ||
        (selectedRole === 'convener' && (l.performedBy || '').toLowerCase().includes('convener')) ||
        (selectedRole === 'admin' && (l.performedBy || '').toLowerCase().includes('admin'));

      return matchesSearch && matchesRole;
    });
  }, [auditLogs, searchQuery, selectedRole]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <h2 className="text-lg font-serif font-bold text-stone-900">Operational Audit Trail & Action History</h2>
        <p className="text-xs text-stone-500">Immutable ledger tracking candidate registrations, team changes, programme schedules, and credentials</p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by action keyword, operator, or details..."
            className="w-full pl-10 pr-4 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#A91F35]"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-[#F7F3E9]/50 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#A91F35]"
          >
            <option value="all">All Operational Logs</option>
            <option value="convener">Convener Actions Only</option>
            <option value="admin">Main Admin Actions</option>
          </select>
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Verified Audit Stream ({filteredLogs.length} events)
          </h3>
          <span className="text-[10px] text-stone-400 font-mono">Real-time Telemetry</span>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs">
              No audit logs found matching your filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-[#F7F3E9]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#A91F35] text-white text-[10px] font-bold font-mono">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      {log.performedBy || 'Convener'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {log.id}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 leading-relaxed font-medium">
                    {log.details}
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-stone-400 shrink-0 self-start sm:self-auto">
                  {log.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
