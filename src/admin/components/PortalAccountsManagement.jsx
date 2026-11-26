import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Shield,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  UserX,
  Lock,
  Sparkles,
  Phone,
  GraduationCap,
  Mic2,
  Building,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import {
  getUnifiedPortalAccounts,
  togglePortalAccountStatus,
  resetPortalAccountPassword,
  PORTAL_ROLES,
  ROLE_LABELS
} from '../../services/unifiedAuthService';
import { festivalStore } from '../data/festivalStore';

const ADMIN_AUTHORIZED_ROLES = ['super_admin', 'admin', 'developer', 'MAIN_ADMIN', 'result_mgr', 'reg_mgr'];

export default function PortalAccountsManagement() {
  // Security access verification: Strictly Main Admin / Developer only
  const adminSession = (() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('dalenzia_admin_session');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  })();

  const isAuthorizedAdmin = adminSession && (
    ADMIN_AUTHORIZED_ROLES.includes(adminSession.role) ||
    ADMIN_AUTHORIZED_ROLES.includes(adminSession.roleKey) ||
    adminSession.portalRole === 'admin'
  );

  const [accounts, setAccounts] = useState(() => (isAuthorizedAdmin ? getUnifiedPortalAccounts() : []));
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshData = () => {
    setAccounts(getUnifiedPortalAccounts());
  };

  useEffect(() => {
    if (!isAuthorizedAdmin) return;
    refreshData();
    const unsub = festivalStore.subscribe(() => {
      refreshData();
    });
    return () => unsub();
  }, [isAuthorizedAdmin]);

  const filteredAccounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return accounts.filter(acc => {
      const matchRole = selectedRole === 'ALL' || acc.role === selectedRole;
      const matchQuery = !q ||
        (acc.name && acc.name.toLowerCase().includes(q)) ||
        (acc.loginUsername && acc.loginUsername.toLowerCase().includes(q)) ||
        (acc.linkedEntity && acc.linkedEntity.toLowerCase().includes(q)) ||
        (acc.id && acc.id.toLowerCase().includes(q));
      return matchRole && matchQuery;
    });
  }, [accounts, selectedRole, searchQuery]);

  if (!isAuthorizedAdmin) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-rose-300 shadow-xl text-center space-y-4 max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
            Access Restricted · Main Admin Only
          </span>
          <h3 className="font-serif font-black text-lg text-stone-900">
            Authenticated Portal Directory Protected
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            The Authenticated Portal Directory and credential management controls are strictly restricted to Main Admin and Developer accounts.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleStatus = (acc) => {
    const newStatus = acc.status === 'Active' ? 'Inactive' : 'Active';
    try {
      togglePortalAccountStatus(acc.role, acc.id, newStatus);
      refreshData();
      showToast(`Account ${acc.loginUsername} marked as ${newStatus}.`);
    } catch (e) {
      showToast(e.message || 'Failed to update account status.', 'error');
    }
  };

  const handleResetPassword = (acc) => {
    const confirm = window.confirm(
      `Are you sure you want to reset password for ${acc.loginUsername} (${acc.name})?\n\nThis will restore their initial credential (${acc.initialPasswordType}) and require a password change on next login.`
    );
    if (!confirm) return;

    try {
      resetPortalAccountPassword(acc.role, acc.id);
      refreshData();
      showToast(`Password for ${acc.loginUsername} reset to initial credential.`);
    } catch (e) {
      showToast(e.message || 'Failed to reset password.', 'error');
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case PORTAL_ROLES.MAIN_ADMIN:
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case PORTAL_ROLES.CONVENER:
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case PORTAL_ROLES.JUDGE:
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case PORTAL_ROLES.TEAM_LEADER:
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case PORTAL_ROLES.STUDENT:
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case PORTAL_ROLES.STAGE_CONTROLLER:
        return 'bg-stone-100 text-stone-900 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  // Stats calculation
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter(a => a.status === 'Active').length;
  const passwordChangedCount = accounts.filter(a => a.passwordChanged).length;
  const initialPendingCount = totalAccounts - passwordChangedCount;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-white transition-all ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-700'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Accounts</div>
          <div className="text-2xl font-serif font-black text-stone-900 mt-1">{totalAccounts}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Across 6 Portals</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Active Accounts</div>
          <div className="text-2xl font-serif font-black text-emerald-700 mt-1">{activeAccounts}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">{totalAccounts - activeAccounts} Inactive</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Password Changed</div>
          <div className="text-2xl font-serif font-black text-blue-700 mt-1">{passwordChangedCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Security setup completed</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Initial Pending</div>
          <div className="text-2xl font-serif font-black text-amber-600 mt-1">{initialPendingCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Prompt on first login</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or linked entity..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold focus:outline-none focus:border-[#A91F35]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', ...Object.values(PORTAL_ROLES)].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedRole === role
                    ? 'bg-[#A91F35] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : ROLE_LABELS[role] || role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-base text-stone-900">
              Authenticated Portal Directory ({filteredAccounts.length})
            </h3>
            <p className="text-xs text-stone-500">
              Authorized credentials, login formats, and password change status across all six festival portals.
            </p>
          </div>

          <button
            onClick={refreshData}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F0] text-stone-600 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Portal Role</th>
                <th className="py-3 px-4">Authorized User / Official Name</th>
                <th className="py-3 px-4">Standard Username</th>
                <th className="py-3 px-4">Linked Entity / Team / Stage</th>
                <th className="py-3 px-4">Initial Password Rule</th>
                <th className="py-3 px-4 text-center">Security Status</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-stone-400">
                    No authorized portal accounts match your query.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map(acc => (
                  <tr key={`${acc.role}_${acc.id}`} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getRoleBadgeStyle(acc.role)}`}>
                        {acc.roleLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-stone-900">{acc.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono">ID: {acc.id}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#A91F35] bg-[#A91F35]/5 px-2 py-0.5 rounded-md border border-[#A91F35]/20">
                        {acc.loginUsername}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-600">
                      {acc.linkedEntity}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-600">
                      <span className="text-[11px] font-semibold text-stone-700">
                        {acc.initialPasswordType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      {acc.passwordChanged ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Custom Setup</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <KeyRound className="w-3 h-3" />
                          <span>Initial Temporary</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        acc.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleResetPassword(acc)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-bold text-[11px] transition-colors cursor-pointer"
                        title="Reset to Initial Password"
                      >
                        Reset Pass
                      </button>
                      <button
                        onClick={() => handleToggleStatus(acc)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                          acc.status === 'Active'
                            ? 'bg-red-50 hover:bg-red-100 text-red-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {acc.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
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
