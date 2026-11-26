import React, { useState, useEffect } from 'react';
import {
    Settings,
    Database,
    Cloud,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Server,
    ShieldCheck,
    HardDrive,
    Copy,
    ExternalLink,
    Layers,
    Sparkles,
    Download
} from 'lucide-react';
import { firebaseConfig, app } from '../../firebase/config';
import { testFirebaseConnection, syncFestivalStoreToCloud } from '../../firebase/firebaseService';
import festivalStore from '../data/festivalStore';
import PortalAccountsManagement from './PortalAccountsManagement';

export default function SystemSettingsModule() {
    const [connectionStatus, setConnectionStatus] = useState('ready'); // ready, checking, connected, error
    const [statusMessage, setStatusMessage] = useState('Firebase initialized and configured.');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    // Store statistics
    const [stats, setStats] = useState({
        programmes: 0,
        students: 0,
        registrations: 0,
        categories: 5
    });

    useEffect(() => {
        try {
            const progs = festivalStore.getProgrammeMaster?.() || [];
            const studs = festivalStore.getAllStudents?.() || [];
            const regs = festivalStore.getAllRegistrations?.() || [];
            setStats({
                programmes: progs.length,
                students: studs.length,
                registrations: regs.length,
                categories: 5
            });
        } catch (e) {
            console.warn("Could not load stats:", e);
        }
    }, []);

    const handleTestConnection = async () => {
        setConnectionStatus('checking');
        setStatusMessage('Pinging Firebase Firestore (dalenzia-fest-2k26)...');
        const res = await testFirebaseConnection();
        if (res.success) {
            setConnectionStatus('connected');
            setStatusMessage('Connected successfully to Firebase Cloud Firestore!');
        } else {
            setConnectionStatus('error');
            setStatusMessage(`Notice: ${res.message} (Will continue with local-first persistent storage).`);
        }
    };

    const handleSyncToCloud = async () => {
        setIsSyncing(true);
        setSyncResult(null);
        try {
            const fullData = festivalStore.getAllFestivalData?.() || {
                programmes: festivalStore.getProgrammeMaster?.() || [],
                registrations: festivalStore.getAllRegistrations?.() || [],
                students: festivalStore.getAllStudents?.() || []
            };
            const res = await syncFestivalStoreToCloud(fullData);
            setSyncResult(res);
        } catch (err) {
            setSyncResult({ success: false, error: err.message });
        } finally {
            setIsSyncing(false);
        }
    };

    const handleCopy = (key, val) => {
        navigator.clipboard.writeText(val);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleExportBackup = () => {
        try {
            const data = festivalStore.getAllFestivalData?.() || {};
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dalenzia_fest_backup_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("Failed to export backup: " + err.message);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-16">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#A91F35] via-[#8D182B] to-[#5C0A19] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-bold text-amber-300 mb-3 border border-white/15">
                        <Settings className="w-3.5 h-3.5" />
                        <span>DALENZIA FEST 2K26 · SYSTEM ARCHITECTURE</span>
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-white">
                        System & Firebase Cloud Configuration
                    </h1>
                    <p className="text-white/80 text-sm mt-1 max-w-2xl leading-relaxed">
                        Manage official festival credentials, database synchronization, real-time shared registration listeners, and data backups.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportBackup}
                        className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export JSON Backup</span>
                    </button>
                </div>
            </div>

            {/* Grid: Firebase Cloud Status & Real-time Sync */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Firebase Configuration Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                <Cloud className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-serif font-black text-lg text-stone-900">
                                    Firebase Cloud Backend
                                </h3>
                                <p className="text-xs text-stone-500">
                                    Project: <strong className="text-stone-800">{firebaseConfig.projectId}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${connectionStatus === 'connected'
                                ? 'bg-emerald-100 text-emerald-800'
                                : connectionStatus === 'error'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
                                    }`} />
                                {connectionStatus === 'connected' ? 'Cloud Connected' : 'Configured'}
                            </span>
                        </div>
                    </div>

                    {/* Connection Test Action */}
                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="text-xs font-bold text-stone-800 flex items-center gap-2">
                                <Database className="w-3.5 h-3.5 text-stone-500" />
                                <span>Cloud Firestore Status</span>
                            </div>
                            <p className="text-[11px] text-stone-600">
                                {statusMessage}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleTestConnection}
                                disabled={connectionStatus === 'checking'}
                                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#A91F35] text-white text-xs font-bold shadow-sm hover:bg-[#8D182B] disabled:opacity-50 flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
                                <span>{connectionStatus === 'checking' ? 'Pinging...' : 'Test Connection'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Configuration Parameters Table */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-black text-stone-500 uppercase tracking-wider">
                            Active Environment Variables & Keys
                        </h4>
                        <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-2xl overflow-hidden bg-stone-50/50">
                            {[
                                { label: 'Project ID', key: 'projectId', val: firebaseConfig.projectId },
                                { label: 'Auth Domain', key: 'authDomain', val: firebaseConfig.authDomain },
                                { label: 'Storage Bucket', key: 'storageBucket', val: firebaseConfig.storageBucket },
                                { label: 'App ID', key: 'appId', val: firebaseConfig.appId },
                                { label: 'Measurement ID', key: 'measurementId', val: firebaseConfig.measurementId }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 text-xs">
                                    <span className="font-semibold text-stone-600">{item.label}</span>
                                    <div className="flex items-center gap-2 font-mono text-stone-800 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                                        <span className="truncate max-w-[200px] sm:max-w-xs">{item.val}</span>
                                        <button
                                            onClick={() => handleCopy(item.key, item.val)}
                                            className="text-stone-400 hover:text-stone-700 transition"
                                            title="Copy value"
                                        >
                                            {copiedKey === item.key ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sync to Cloud Firestore */}
                    <div className="pt-2">
                        <div className="border border-amber-200/80 bg-amber-50/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Sync Local Festival Data to Cloud Firestore</span>
                                </h4>
                                <p className="text-[11px] text-amber-800 mt-0.5">
                                    Pushes 83 charter programmes, student directories, and registration tickets to the Firebase database.
                                </p>
                            </div>

                            <button
                                onClick={handleSyncToCloud}
                                disabled={isSyncing}
                                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition disabled:opacity-50 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                                <span>{isSyncing ? 'Syncing...' : 'Sync Data Now'}</span>
                            </button>
                        </div>

                        {syncResult && (
                            <div className={`mt-3 p-3 rounded-xl text-xs font-medium ${syncResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}>
                                {syncResult.success ? (
                                    <span>
                                        Successfully synchronized to Firebase: {syncResult.results?.programmes || 0} programmes, {syncResult.results?.registrations || 0} registrations!
                                    </span>
                                ) : (
                                    <span>Sync error: {syncResult.error}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Festival Master Stats & Quick Links */}
                <div className="space-y-6">
                    {/* Festival Summary Card */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-serif font-black text-stone-900 text-base">
                            <ShieldCheck className="w-5 h-5 text-[#A91F35]" />
                            <span>Festival Architecture</span>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
                                <span className="text-stone-500">Festival Edition</span>
                                <span className="font-bold text-stone-900">DALENZIA 2K26</span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
                                <span className="text-stone-500">Official Theme</span>
                                <span className="font-bold text-[#A91F35]">NUEVA ERA</span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
                                <span className="text-stone-500">Festival Dates</span>
                                <span className="font-bold text-stone-900">21, 22, 23 DEC 2026</span>
                            </div>
                            <div className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
                                <span className="text-stone-500">Venue</span>
                                <span className="font-bold text-stone-900 text-right">Ayiroor, Malappuram</span>
                            </div>
                        </div>
                    </div>

                    {/* Database Entities Metrics */}
                    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 font-serif font-black text-stone-900 text-base">
                            <Layers className="w-5 h-5 text-amber-600" />
                            <span>Loaded Database Entities</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
                                <div className="text-[10px] font-bold text-stone-500 uppercase">Programmes</div>
                                <div className="font-black text-xl text-stone-900 mt-1">{stats.programmes}</div>
                                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">77 Official Charter</div>
                            </div>

                            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
                                <div className="text-[10px] font-bold text-stone-500 uppercase">Categories</div>
                                <div className="font-black text-xl text-stone-900 mt-1">{stats.categories}</div>
                                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Charter Locked</div>
                            </div>

                            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
                                <div className="text-[10px] font-bold text-stone-500 uppercase">Students</div>
                                <div className="font-black text-xl text-stone-900 mt-1">{stats.students}</div>
                                <div className="text-[10px] text-stone-500 font-semibold mt-0.5">Dars Enrolled</div>
                            </div>

                            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
                                <div className="text-[10px] font-bold text-stone-500 uppercase">Registrations</div>
                                <div className="font-black text-xl text-stone-900 mt-1">{stats.registrations}</div>
                                <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Shared Desk</div>
                            </div>
                        </div>
                    </div>

                    {/* External Links */}
                    <div className="bg-stone-100 rounded-3xl p-5 border border-stone-200 text-xs text-stone-600 space-y-2">
                        <div className="font-bold text-stone-800">Direct Firebase Console Access</div>
                        <p className="text-[11px] leading-relaxed text-stone-500">
                            Access the Google Firebase Console to view real-time Firestore documents, user authentications, and rules:
                        </p>
                        <a
                            href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#A91F35] font-bold hover:underline pt-1"
                        >
                            <span>Open Firebase Console</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Unified Portal Authentication & Accounts Directory */}
            <div className="pt-4">
                <PortalAccountsManagement />
            </div>
        </div>
    );
}

