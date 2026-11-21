import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  ShieldAlert, 
  Lock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { festivalStore } from '../../admin/data/festivalStore';

export default function JudgeCoordination({ stageId, stageInfo }) {
  const [competitions, setCompetitions] = useState(() => festivalStore.getStageCompetitions(stageId));
  const [selectedCompId, setSelectedCompId] = useState(() => competitions[0]?.id || '');

  const selectedComp = useMemo(() => {
    return competitions.find(c => c.id === selectedCompId) || competitions[0] || null;
  }, [competitions, selectedCompId]);

  // Read-only judge coordination data from store
  const judgeCoordination = useMemo(() => {
    return festivalStore.getJudgeCoordinationForStage(stageId);
  }, [stageId]);

  const assignedJudges = useMemo(() => {
    if (!selectedComp) return [];
    return judgeCoordination.filter(j => j.competitionId === selectedComp.id);
  }, [judgeCoordination, selectedComp]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#A91F35] uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-[#E6A916]" />
            <span>Adjudication Coordination Desk</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1c1917]">
            Assigned Judges & Evaluation Tracking
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Monitor judge presence and score sheet submission status for stage competitions.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#E6A916]" />
          <span>Strict Read-Only Mode</span>
        </div>
      </div>

      {/* Security Notice Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-[#2d0d14] to-stone-900 text-white shadow-md border border-[#A91F35]/40 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-[#E6A916] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#E6A916]">
            Strict Adjudication Separation Protocol
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed">
            As a Stage Controller, your role is operational stage management and participant calling. 
            <strong> You cannot modify judge scores, enter marks, or publish official results.</strong> 
            All scores are submitted directly by judges via their Judge Portal and verified by the Festival Convener.
          </p>
        </div>
      </div>

      {/* Select Competition Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0">
            Select Competition:
          </span>
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 font-bold text-xs text-stone-800 focus:outline-none focus:border-[#A91F35]"
          >
            {competitions.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-stone-600">
          Judges Assigned: <span className="font-mono text-[#A91F35] font-black">{assignedJudges.length}</span>
        </div>
      </div>

      {/* Judges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedJudges.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-dashed border-stone-300 text-center text-stone-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40 text-stone-400" />
            <p className="text-sm font-bold text-stone-600">No Judges Assigned Yet</p>
            <p className="text-xs text-stone-400 mt-1">
              The Festival Convener will assign judges to this competition shortly.
            </p>
          </div>
        ) : (
          assignedJudges.map((judge, idx) => (
            <div 
              key={judge.id || idx}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-amber-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A91F35] to-[#801426] text-[#E6A916] flex items-center justify-center font-serif font-black text-sm">
                      {judge.judgeName?.charAt(0) || 'J'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 line-clamp-1">{judge.judgeName}</h4>
                      <p className="text-[11px] text-stone-500">{judge.designation || 'Honourable Judge'}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    judge.submissionStatus === 'Submitted' ? 'bg-emerald-100 text-emerald-800' :
                    judge.submissionStatus === 'Evaluating' ? 'bg-amber-100 text-amber-800' :
                    'bg-stone-100 text-stone-600'
                  }`}>
                    {judge.submissionStatus || 'Pending'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Evaluation Sheet:</span>
                    <span className="font-bold text-stone-800 font-mono">
                      {judge.evaluationsSubmitted || 0} / {judge.totalParticipants || selectedComp?.registrationsCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Submission Time:</span>
                    <span className="text-stone-700 font-mono text-[11px]">
                      {judge.submittedAt ? new Date(judge.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Awaiting'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Actions for Desk */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                {judge.phone ? (
                  <a
                    href={`tel:${judge.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#A91F35]" />
                    <span>Call Desk</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-stone-400">No phone on file</span>
                )}

                <div className="text-[10px] font-mono text-stone-400">
                  ID: {judge.judgeId || 'JDG'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
