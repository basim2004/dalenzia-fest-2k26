import React, { useState, useEffect } from 'react';
import {
  Sliders, ShieldCheck, AlertTriangle, CheckCircle2, Award, FileSpreadsheet,
  HelpCircle, Sparkles, RefreshCw, Lock, Unlock, Eye, Save, Calculator, Info
} from 'lucide-react';
import { festivalStore } from '../data/festivalStore';

export default function MarksConfigurationTab() {
  const [scoringConfig, setScoringConfig] = useState(() => festivalStore.getScoringConfig());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(festivalStore.getScoringConfig())));
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminConfirmationText, setAdminConfirmationText] = useState('');
  const [saveToast, setSaveToast] = useState('');

  // Interactive Calculation Preview state
  const [previewType, setPreviewType] = useState('Individual'); // 'Individual' or 'Group'
  const [previewMarks, setPreviewMarks] = useState({ judge1: 85, judge2: 87, judge3: 86 });

  useEffect(() => {
    const unsub = festivalStore.subscribe(() => {
      const updated = festivalStore.getScoringConfig();
      setScoringConfig(updated);
      if (!isEditing) {
        setFormData(JSON.parse(JSON.stringify(updated)));
      }
    });
    return unsub;
  }, [isEditing]);

  const previewAvg = parseFloat(
    ((previewMarks.judge1 + previewMarks.judge2 + previewMarks.judge3) / 3).toFixed(1)
  );

  const getPreviewGrade = (mark) => {
    const configured = (formData.grades || [])
      .filter(g => g.minMarks !== null && g.minMarks !== undefined && Number.isFinite(Number(g.minMarks)))
      .sort((a, b) => Number(b.minMarks) - Number(a.minMarks));
    if (configured.length === 0) return 'Pending Admin Cutoffs';
    const hit = configured.find(g => mark >= Number(g.minMarks));
    return hit ? hit.grade : 'No Grade';
  };

  const previewGrade = getPreviewGrade(previewAvg);
  const previewPosPoints =
    previewType === 'Individual'
      ? Number(formData.positionPoints?.individual?.first ?? 5)
      : Number(formData.positionPoints?.group?.first ?? 15);
  const gradeRule = formData.grades.find(g => g.grade === previewGrade);
  const previewGradePoints = formData.isGradePointsActive
    ? (previewType === 'Individual' ? (gradeRule?.individualPoints || 0) : (gradeRule?.groupPoints || 0))
    : 0;

  const handleToggleGradePoints = () => {
    if (!formData.isGradePointsActive) {
      // Trying to activate -> require admin confirmation
      setAdminModalOpen(true);
    } else {
      // Deactivating
      setFormData(prev => ({ ...prev, isGradePointsActive: false }));
    }
  };

  const handleConfirmAdminActivation = () => {
    if (adminConfirmationText.trim().toUpperCase() !== 'CONFIRM') {
      alert('Please type "CONFIRM" to authorize activation of automatic grade points.');
      return;
    }
    setFormData(prev => ({ ...prev, isGradePointsActive: true }));
    setAdminModalOpen(false);
    setAdminConfirmationText('');
  };

  const handleGradeFieldChange = (gradeIndex, field, value) => {
    const updatedGrades = [...formData.grades];
    updatedGrades[gradeIndex] = {
      ...updatedGrades[gradeIndex],
      [field]: value === '' ? null : Number(value)
    };
    setFormData(prev => ({ ...prev, grades: updatedGrades }));
  };

  const handleSaveConfig = () => {
    try {
      festivalStore.updateScoringConfig(formData, {
        adminConfirmation: Boolean(formData.isGradePointsActive),
        updatedBy: 'Main Admin (Authorized)'
      });
      setIsEditing(false);
      setSaveToast('Official Marks & Grade Configuration saved successfully.');
      setTimeout(() => setSaveToast(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = () => {
    setFormData(JSON.parse(JSON.stringify(scoringConfig)));
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
          <button onClick={() => setSaveToast('')} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 md:p-8 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E6A916]/20 text-[#E6A916] text-[10px] font-black uppercase tracking-wider border border-[#E6A916]/30">
              OFFICIAL CHARTER REFERENCE
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              Dalenzia 2K26 Updated 12-Page Charter • Pages 3, 4 & 9–11
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-black text-white">
            Marks & Grade Configuration System
          </h2>
          <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
            Centralized scoring parameters governing the automatic result calculation engine. Position points are authoritatively bound to Charter Page 4. Grade points remain strictly inactive until authorized Main Admin confirmation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-5 py-2.5 rounded-xl bg-[#E6A916] hover:bg-amber-400 text-stone-950 text-xs font-black transition-all flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-[#E6A916]" />
              Edit Grade Schema
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: OFFICIAL POSITION POINTS (Charter Page 4) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="text-[10px] font-black text-[#A91F35] uppercase tracking-widest">
              OFFICIAL CHARTER PAGE 4 • RULE SPECIFICATION
            </div>
            <h3 className="text-lg font-bold text-stone-900 mt-1">
              Position Points Distribution
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 uppercase">
            Charter Locked • Authoritative
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Individual Events Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#A91F35]/5 to-rose-50/20 border-2 border-[#A91F35]/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#A91F35] text-white text-[10px] font-bold">
                INDIVIDUAL PROGRAMMES
              </span>
              <span className="text-xs text-stone-500 font-mono">1st / 2nd / 3rd</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-white border border-[#A91F35]/20 shadow-sm">
                <div className="text-[10px] text-stone-500 font-bold uppercase">1st Place</div>
                <div className="text-2xl font-black text-[#A91F35] mt-1">{formData.positionPoints?.individual?.first ?? 5} <span className="text-xs font-normal">PTS</span></div>
                <div className="text-[9px] text-stone-400 mt-0.5">Winner</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="text-[10px] text-stone-500 font-bold uppercase">2nd Place</div>
                <div className="text-2xl font-black text-stone-800 mt-1">{formData.positionPoints?.individual?.second ?? 3} <span className="text-xs font-normal">PTS</span></div>
                <div className="text-[9px] text-stone-400 mt-0.5">Runner Up</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="text-[10px] text-stone-500 font-bold uppercase">3rd Place</div>
                <div className="text-2xl font-black text-amber-700 mt-1">{formData.positionPoints?.individual?.third ?? 1} <span className="text-xs font-normal">PT</span></div>
                <div className="text-[9px] text-stone-400 mt-0.5">Second Runner Up</div>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed italic">
              * Points awarded to individual candidates and credited to their respective team totals (Dazzlers or Dynamos).
            </p>
          </div>

          {/* Group Events Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E6A916]/10 to-amber-50/20 border-2 border-[#E6A916]/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#E6A916] text-stone-950 text-[10px] font-black">
                GROUP & ENSEMBLE PROGRAMMES
              </span>
              <span className="text-xs text-stone-500 font-mono">1st / 2nd / 3rd</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-white border border-[#E6A916]/30 shadow-sm">
                <div className="text-[10px] text-stone-500 font-bold uppercase">1st Place</div>
                <div className="text-2xl font-black text-amber-700 mt-1">{formData.positionPoints?.group?.first ?? 15} <span className="text-xs font-normal">PTS</span></div>
                <div className="text-[9px] text-stone-400 mt-0.5">Team Credit</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="text-[10px] text-stone-500 font-bold uppercase">2nd Place</div>
                <div className="text-2xl font-black text-stone-800 mt-1">{formData.positionPoints?.group?.second ?? 10} <span className="text-xs font-normal">PTS</span></div>
                <div className="text-[9px] text-stone-400 mt-0.5">Team Credit</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="text-[10px] text-stone-500 font-bold uppercase">3rd Place</div>
                <div className="text-2xl font-black text-stone-700 mt-1">{formData.positionPoints?.group?.third ?? 5} <span className="text-xs font-normal">PTS</span></div>
                <div className="text-[9px] text-stone-400 mt-0.5">Team Credit</div>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed italic">
              * Group points are awarded to the winning team <strong>ONCE</strong>. Group points are never multiplied per team member or double counted.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: CENTRAL GRADE CONFIGURATION (Charter Page 4: A+, A, B, C) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="text-[10px] font-black text-[#A91F35] uppercase tracking-widest">
              OFFICIAL CHARTER PAGE 4 • GRADE SYSTEM
            </div>
            <h3 className="text-lg font-bold text-stone-900 mt-1">
              Central Grade Schema & Automatic Grade Points
            </h3>
          </div>

          {/* Grade Points Activation Toggle */}
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-bold text-stone-700 pl-2">
              Automatic Grade Points:
            </span>
            <button
              onClick={handleToggleGradePoints}
              disabled={!isEditing}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                formData.isGradePointsActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-200 text-stone-600'
              } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
            >
              {formData.isGradePointsActive ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  ACTIVE
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  INACTIVE (Charter Default)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Unverified Grade Values Official Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Charter Notice on Grade Points & Thresholds</span>
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            The official festival charter specifies the 4 official grades (<strong>A+</strong>, <strong>A</strong>, <strong>B</strong>, <strong>C</strong>) and notes that grade points differ between Individual and Group events. However, the charter does <strong>NOT</strong> specify numeric grade points or mark percentage thresholds in text.
          </p>
          <div className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 p-2.5 rounded-xl">
            🔒 <strong>Strict Directive Followed:</strong> Unverified values are left unconfigured by default. Automatic grade points remain disabled until authorized Main Admin confirmation is explicitly provided.
          </div>
        </div>

        {/* Grade Configuration Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Official Grade</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Min Mark / % Threshold</th>
                <th className="p-3.5">Individual Grade Pts</th>
                <th className="p-3.5">Group Grade Pts</th>
                <th className="p-3.5 text-right">Engine Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {formData.grades.map((g, idx) => (
                <tr key={g.grade} className="hover:bg-stone-50/70 transition-colors">
                  <td className="p-3.5 font-bold font-mono">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                      g.grade === 'A+'
                        ? 'bg-emerald-100 text-emerald-800'
                        : g.grade === 'A'
                        ? 'bg-blue-100 text-blue-800'
                        : g.grade === 'B'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-800'
                    }`}>
                      {g.grade}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-stone-800">
                    {g.label}
                  </td>
                  <td className="p-3.5">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={g.minMarks ?? ''}
                        onChange={(e) => handleGradeFieldChange(idx, 'minMarks', e.target.value)}
                        className="w-20 px-2 py-1 rounded-lg border border-stone-300 font-mono text-xs focus:ring-1 focus:ring-[#A91F35]"
                      />
                    ) : (
                      <span className="font-mono font-bold text-stone-900">
                        {g.minMarks !== null ? `≥ ${g.minMarks}%` : 'Unconfigured'}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="Unset"
                        value={g.individualPoints ?? ''}
                        onChange={(e) => handleGradeFieldChange(idx, 'individualPoints', e.target.value)}
                        className="w-20 px-2 py-1 rounded-lg border border-stone-300 font-mono text-xs focus:ring-1 focus:ring-[#A91F35]"
                      />
                    ) : (
                      <span className="font-mono">
                        {g.individualPoints !== null ? `+${g.individualPoints} pts` : <span className="text-stone-400 italic">Unconfigured</span>}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="30"
                        placeholder="Unset"
                        value={g.groupPoints ?? ''}
                        onChange={(e) => handleGradeFieldChange(idx, 'groupPoints', e.target.value)}
                        className="w-20 px-2 py-1 rounded-lg border border-stone-300 font-mono text-xs focus:ring-1 focus:ring-[#A91F35]"
                      />
                    ) : (
                      <span className="font-mono">
                        {g.groupPoints !== null ? `+${g.groupPoints} pts` : <span className="text-stone-400 italic">Unconfigured</span>}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right font-medium">
                    {formData.isGradePointsActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-400 italic">
                        <Lock className="w-3 h-3 text-stone-400" /> Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: OFFICIAL ENTRY LIMITS (Charter Page 3) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="text-[10px] font-black text-[#A91F35] uppercase tracking-widest">
          OFFICIAL CHARTER PAGE 3 • PARTICIPATION LIMITS
        </div>
        <h3 className="text-lg font-bold text-stone-900">
          Enforced Participation & Entry Thresholds
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-bold text-stone-700">Sub Junior Limit (Class 5–9)</div>
            <div className="text-xl font-black text-[#A91F35] mt-1">4 Stage + 5 Off</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Max items per Sub Junior student</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-bold text-stone-700">Junior & Senior Limit</div>
            <div className="text-xl font-black text-[#A91F35] mt-1">5 Stage + 6 Off</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Max items per Junior / Senior student</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-bold text-stone-700">Team Individual Entries</div>
            <div className="text-xl font-black text-amber-700 mt-1">3 Entries</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Max participants per team in individual items</div>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-bold text-stone-700">Team General / Group Entries</div>
            <div className="text-xl font-black text-amber-700 mt-1">2 Entries</div>
            <div className="text-[10px] text-stone-500 mt-0.5">Max entries per team in General group items</div>
          </div>
        </div>
      </div>

      {/* SECTION 4: INTERACTIVE CALCULATION PREVIEW TESTER */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 border border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6A916]/20 text-[#E6A916] text-[9px] font-black uppercase tracking-wider">
                LIVE ENGINE SIMULATION
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Interactive Calculation Preview
            </h3>
            <p className="text-xs text-stone-400">
              Test how raw marks convert to position points, grade, and team credits under current rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['Individual', 'Group'].map(type => (
              <button
                key={type}
                onClick={() => setPreviewType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  previewType === type
                    ? 'bg-[#E6A916] text-stone-950 font-black shadow-md'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20'
                }`}
              >
                {type} Event
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Judge Inputs */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-300">Raw Judge Evaluations (Out of 100)</label>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-stone-400">Judge 1 Mark:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={previewMarks.judge1}
                  onChange={(e) => setPreviewMarks(prev => ({ ...prev, judge1: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-xs focus:ring-1 focus:ring-[#E6A916]"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400">Judge 2 Mark:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={previewMarks.judge2}
                  onChange={(e) => setPreviewMarks(prev => ({ ...prev, judge2: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-xs focus:ring-1 focus:ring-[#E6A916]"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400">Judge 3 Mark:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={previewMarks.judge3}
                  onChange={(e) => setPreviewMarks(prev => ({ ...prev, judge3: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white font-mono text-xs focus:ring-1 focus:ring-[#E6A916]"
                />
              </div>
            </div>
          </div>

          {/* Aggregated Score & Grade */}
          <div className="p-5 rounded-2xl bg-stone-800/60 border border-stone-700 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Aggregated Score</div>
              <div className="text-3xl font-black text-white font-mono mt-1">
                {previewAvg} <span className="text-xs text-stone-400">/ 100</span>
              </div>
              <div className="text-xs text-stone-400 mt-1">Calculated via jury arithmetic mean</div>
            </div>

            <div className="pt-3 border-t border-stone-700/60">
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Assigned Official Grade</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-xl bg-amber-400 text-stone-950 font-black text-sm">
                  {previewGrade}
                </span>
                <span className="text-xs text-stone-300">
                  {formData.grades.find(g => g.grade === previewGrade)?.label || 'Evaluated Performance'}
                </span>
              </div>
            </div>
          </div>

          {/* Points Output */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#A91F35]/40 to-stone-800 border border-[#A91F35]/40 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Total Points (Assuming 1st Place)</div>
              <div className="text-3xl font-black text-white font-mono mt-1">
                +{previewPosPoints + previewGradePoints} <span className="text-xs text-amber-300">PTS</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-stone-700/60">
              <div className="flex justify-between">
                <span>Position Points (Charter Page 4):</span>
                <strong className="text-white font-mono">+{previewPosPoints} pts</strong>
              </div>
              <div className="flex justify-between">
                <span>Grade Points ({formData.isGradePointsActive ? 'Active' : 'Disabled'}):</span>
                <strong className="text-white font-mono">+{previewGradePoints} pts</strong>
              </div>
              <div className="flex justify-between text-[#E6A916] font-bold pt-1 border-t border-stone-700">
                <span>Team Credit ({previewType === 'Group' ? 'Single Credit' : 'Direct'}):</span>
                <strong className="font-mono">+{previewPosPoints + previewGradePoints} pts</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN CONFIRMATION MODAL */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Authorize Grade Points</h3>
                <p className="text-xs text-stone-500">Authorized Main Admin Confirmation Required</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Activating automatic grade points will cause the calculation engine to award points for individual/group grades in addition to 1st, 2nd, and 3rd place position points.
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
              <div>• Ensure grade points and mark thresholds have been verified with festival officials.</div>
              <div>• To confirm and authorize this change, type <strong>CONFIRM</strong> below:</div>
            </div>

            <input
              type="text"
              placeholder='Type "CONFIRM"'
              value={adminConfirmationText}
              onChange={(e) => setAdminConfirmationText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-1 focus:ring-[#A91F35]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setAdminModalOpen(false);
                  setAdminConfirmationText('');
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdminActivation}
                className="px-4 py-2 rounded-xl bg-[#A91F35] hover:bg-[#851627] text-white text-xs font-bold transition-all shadow-md"
              >
                Authorize & Activate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
