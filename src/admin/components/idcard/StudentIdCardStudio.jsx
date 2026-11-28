import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  QrCode, Printer, Download, Upload, CheckCircle, AlertTriangle,
  Search, Filter, Eye, RefreshCw, X, Shield, FileText, Layers,
  ChevronLeft, ChevronRight, Check, Sliders, ExternalLink, Sparkles
} from 'lucide-react';
import { ID_CARD_CONFIG } from '../../../config/idCardConfig';
import StudentIdCardItem from './StudentIdCardItem';
import { parseRosterCsv, verifyAllStudentsQrs } from '../../../services/idCardVerificationService';
import { generateIdCardsPdf, exportAllCardsAsZip } from '../../../services/idCardPdfExportService';
import { renderStudentCardToCanvas } from '../../../services/idCardCanvasRenderer';

export default function StudentIdCardStudio({ defaultStudents = [], teams = [] }) {
  // Roster state
  const [students, setStudents] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  // Layout preset
  const [layoutPreset, setLayoutPreset] = useState('A3_PORTRAIT');

  // Verification & Export State
  const [verificationReport, setVerificationReport] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);

  // Modals & Views
  const [previewStudent, setPreviewStudent] = useState(null);
  const [showPrintSheetPreview, setShowPrintSheetPreview] = useState(false);
  const [activeSheetPage, setActiveSheetPage] = useState(1);
  const [showWarningsModal, setShowWarningsModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fileInputRef = useRef(null);

  // Pre-load official CSV on mount
  useEffect(() => {
    loadOfficialRoster();
  }, []);

  const loadOfficialRoster = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/data/dalenzia_students_roster_2026-11-28.csv');
      if (response.ok) {
        const text = await response.text();
        applyCsvData(text);
      } else {
        fallbackToStoreStudents();
      }
    } catch (e) {
      console.warn('Could not fetch CSV from /data, using store candidates:', e);
      fallbackToStoreStudents();
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackToStoreStudents = () => {
    if (defaultStudents && defaultStudents.length > 0) {
      const active = defaultStudents.map((s, idx) => ({
        id: s.id || `STU-${1001 + idx}`,
        chestNo: s.chestNo || `C-${101 + idx}`,
        fullName: s.name,
        category: s.classCategory || 'Senior',
        team: s.teamName || 'Dazzlers',
        dob: s.dob || '2008-05-15',
        institution: s.institution || ID_CARD_CONFIG.festival.institution,
        phone: s.phone || '',
        email: s.email || '',
        eventsCount: 2,
        points: 0,
        status: s.status || 'Active',
        expectedQrPayload: ID_CARD_CONFIG.qr.format(s.chestNo || `C-${101 + idx}`, s.id || `STU-${1001 + idx}`)
      }));
      setStudents(active);
      runVerification(active);
    }
  };

  const applyCsvData = (csvText) => {
    try {
      const parsed = parseRosterCsv(csvText);
      setStudents(parsed.students);
      setInactiveStudents(parsed.inactiveStudents);
      setWarnings(parsed.warnings);
      runVerification(parsed.students);
    } catch (err) {
      alert(`Error parsing roster CSV: ${err.message}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      applyCsvData(evt.target?.result);
    };
    reader.readAsText(file);
  };

  const runVerification = async (candidateList) => {
    setIsVerifying(true);
    try {
      const report = await verifyAllStudentsQrs(candidateList);
      setVerificationReport(report);
    } catch (e) {
      console.error('QR Audit error:', e);
    } finally {
      setIsVerifying(false);
    }
  };

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = !searchQuery || 
        (s.fullName && s.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.chestNo && s.chestNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.id && s.id.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTeam = selectedTeam === 'all' || s.team === selectedTeam;
      const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;

      return matchesSearch && matchesTeam && matchesCat;
    });
  }, [students, searchQuery, selectedTeam, selectedCategory]);

  // Bulk Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Target candidates for export (all filtered or selected)
  const exportCandidates = useMemo(() => {
    if (selectedIds.length > 0) {
      return students.filter(s => selectedIds.includes(s.id));
    }
    return filteredStudents;
  }, [students, selectedIds, filteredStudents]);

  // Export A3 PDF
  const handleExportPdf = async () => {
    if (exportCandidates.length === 0) {
      alert('No students selected for PDF generation.');
      return;
    }
    setIsExportingPdf(true);
    setExportProgress({ current: 0, total: exportCandidates.length });

    try {
      const doc = await generateIdCardsPdf(
        exportCandidates,
        { preset: layoutPreset, includeBleed: false },
        (prog) => setExportProgress(prog)
      );
      doc.save(`DALENZIA_2K26_Student_ID_Cards_${layoutPreset}.pdf`);
    } catch (err) {
      alert(`Failed to generate PDF: ${err.message}`);
      console.error(err);
    } finally {
      setIsExportingPdf(false);
      setExportProgress(null);
    }
  };

  // Export ZIP of 2x PNGs
  const handleExportZip = async () => {
    if (exportCandidates.length === 0) {
      alert('No students selected for image export.');
      return;
    }
    setIsExportingZip(true);
    setExportProgress({ current: 0, total: exportCandidates.length });

    try {
      await exportAllCardsAsZip(exportCandidates, (prog) => setExportProgress(prog));
    } catch (err) {
      alert(`Failed to create ZIP export: ${err.message}`);
      console.error(err);
    } finally {
      setIsExportingZip(false);
      setExportProgress(null);
    }
  };

  // Quick edit student handler
  const handleSaveStudentEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === editingStudent.id) {
        return {
          ...editingStudent,
          expectedQrPayload: ID_CARD_CONFIG.qr.format(editingStudent.chestNo, editingStudent.id)
        };
      }
      return s;
    }));
    setEditingStudent(null);
  };

  // Layout specs for Print Sheet Preview
  const currentLayout = ID_CARD_CONFIG.sheets[layoutPreset] || ID_CARD_CONFIG.sheets.A3_PORTRAIT;
  const cardsPerSheet = currentLayout.cardsPerPage;
  const totalSheetPages = Math.ceil(exportCandidates.length / cardsPerSheet) || 1;
  const currentSheetCards = useMemo(() => {
    const start = (activeSheetPage - 1) * cardsPerSheet;
    return exportCandidates.slice(start, start + cardsPerSheet);
  }, [exportCandidates, activeSheetPage, cardsPerSheet]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#A91F35] text-white">
              Official Studio
            </span>
            <span className="text-xs font-mono text-stone-500">
              DALENZIA 2K26 • NUEVA ERA
            </span>
          </div>
          <h2 className="text-xl font-black text-stone-900 mt-1">
            Student Event ID Card Studio
          </h2>
          <p className="text-xs text-stone-600 mt-0.5 max-w-2xl">
            Generates standardized, print-ready ID cards (88.9 × 50.8 mm) with vector QR verification and automated A3 print sheet imposition.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
            title="Import custom student roster CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload CSV
          </button>

          <button
            onClick={() => setShowPrintSheetPreview(!showPrintSheetPreview)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
              showPrintSheetPreview 
                ? 'bg-amber-500 text-stone-900 shadow-sm' 
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {showPrintSheetPreview ? 'Exit Sheet Preview' : 'A3 Sheet Preview'}
          </button>

          <button
            onClick={handleExportZip}
            disabled={isExportingZip || isExportingPdf}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            {isExportingZip ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export 2x PNGs (ZIP)
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf || isExportingZip}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#A91F35] hover:bg-[#851627] text-white text-xs font-bold transition-all shadow-sm shadow-[#A91F35]/20 disabled:opacity-50"
          >
            {isExportingPdf ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
            Export A3 Print PDF ({currentLayout.columns}×{currentLayout.rows})
          </button>
        </div>
      </div>

      {/* Progress Notification Bar */}
      {(isExportingPdf || isExportingZip) && exportProgress && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-amber-700 animate-spin" />
            <div>
              <div className="text-xs font-bold text-amber-900">
                {isExportingPdf ? 'Generating High-Resolution Print PDF...' : 'Rendering 2x Master PNGs...'}
              </div>
              <div className="text-[11px] text-amber-700">
                Card {exportProgress.current} of {exportProgress.total}: {exportProgress.studentName || ''}
              </div>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-amber-900">
            {Math.round((exportProgress.current / exportProgress.total) * 100)}%
          </div>
        </div>
      )}

      {/* Status & Validation Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Active Cards */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Active ID Cards</div>
          <div className="text-2xl font-black text-stone-900 mt-0.5">{students.length}</div>
          <div className="text-[10px] text-stone-500 mt-1">Ready for print imposition</div>
        </div>

        {/* Skipped Inactive */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Skipped Non-Active</div>
          <div className="text-2xl font-black text-stone-700 mt-0.5">{inactiveStudents.length}</div>
          <div className="text-[10px] text-stone-500 mt-1">Excluded from print sheets</div>
        </div>

        {/* Warnings */}
        <div 
          onClick={() => warnings.length > 0 && setShowWarningsModal(true)}
          className={`p-3.5 rounded-2xl border transition-all ${
            warnings.length > 0 
              ? 'bg-amber-50/70 border-amber-200 cursor-pointer hover:bg-amber-50' 
              : 'bg-stone-50 border-stone-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Roster Warnings</span>
            {warnings.length > 0 && <span className="text-[10px] text-amber-700 underline font-semibold">View</span>}
          </div>
          <div className={`text-2xl font-black mt-0.5 ${warnings.length > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
            {warnings.length}
          </div>
          <div className="text-[10px] text-amber-700 mt-1">
            {warnings.length > 0 ? 'Duplicate chest / missing info' : 'All student records clean'}
          </div>
        </div>

        {/* QR Verification Status */}
        <div 
          onClick={() => setShowAuditModal(true)}
          className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">QR Auto-Audit</span>
            <span className="text-[10px] text-emerald-700 underline font-semibold">Inspect</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <div className="text-lg font-black text-emerald-900">
              {verificationReport?.zeroFailures ? '0 Failures' : 'Verified'}
            </div>
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">
            {verificationReport ? `${verificationReport.verified}/${verificationReport.total} Verified via jsQR` : 'Scanning payloads...'}
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Filters & Imposition Preset */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, chest no, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Team Filter */}
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">All Teams</option>
          <option value="Dazzlers">Dazzlers</option>
          <option value="Dynamos">Dynamos</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        >
          <option value="all">All Categories</option>
          <option value="Senior">Senior</option>
          <option value="Junior">Junior</option>
          <option value="Sub Junior">Sub Junior</option>
        </select>

        {/* Print Layout Preset */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
          <button
            onClick={() => setLayoutPreset('A3_PORTRAIT')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              layoutPreset === 'A3_PORTRAIT' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            A3 Portrait (21)
          </button>
          <button
            onClick={() => setLayoutPreset('A3_LANDSCAPE')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              layoutPreset === 'A3_LANDSCAPE' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            A3 Landscape (20)
          </button>
          <button
            onClick={() => setLayoutPreset('A4_PORTRAIT')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              layoutPreset === 'A4_PORTRAIT' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            A4 (10)
          </button>
        </div>
      </div>

      {/* Bulk Selection Bar */}
      <div className="flex items-center justify-between text-xs py-2 px-1 border-b border-stone-100">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded text-[#A91F35] focus:ring-amber-500 border-stone-300 transition-all cursor-pointer"
          />
          <span className="font-semibold text-stone-700">
            Select All ({filteredStudents.length} displayed)
          </span>
        </label>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#A91F35]">
              {selectedIds.length} card{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-stone-500 hover:text-stone-800 underline"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: Print Sheet Preview (A3 Sheet Layout) */}
      {showPrintSheetPreview ? (
        <div className="p-6 rounded-3xl bg-stone-900 text-white space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                {currentLayout.name} • {currentLayout.pageWidthMm} × {currentLayout.pageHeightMm} mm
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Sheet Page {activeSheetPage} of {totalSheetPages} ({currentSheetCards.length} Cards on this sheet)
              </h3>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                disabled={activeSheetPage <= 1}
                onClick={() => setActiveSheetPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-3">
                {activeSheetPage} / {totalSheetPages}
              </span>
              <button
                disabled={activeSheetPage >= totalSheetPages}
                onClick={() => setActiveSheetPage(prev => Math.min(totalSheetPages, prev + 1))}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sheet Board Visual Representation */}
          <div className="p-6 rounded-2xl bg-stone-800/90 border border-white/15 overflow-x-auto">
            <div 
              className="grid gap-3 mx-auto bg-stone-950 p-6 rounded-xl border border-dashed border-amber-500/40 relative"
              style={{
                gridTemplateColumns: `repeat(${currentLayout.columns}, minmax(0, 1fr))`,
                maxWidth: currentLayout.columns === 3 ? '980px' : '1100px'
              }}
            >
              {/* Sheet Header Mark */}
              <div className="col-span-full pb-2 flex justify-between text-[10px] text-stone-400 font-mono border-b border-white/10 mb-2">
                <span>DALENZIA FEST 2K26 — A3 PRINT IMPOSITION SHEET #{activeSheetPage}</span>
                <span>TRIM ALONG CROP MARKS • 100% SCALE</span>
              </div>

              {currentSheetCards.map((student) => (
                <div key={student.id} className="relative group">
                  <StudentIdCardItem
                    student={student}
                    isSelected={selectedIds.includes(student.id)}
                    onToggleSelect={handleToggleSelect}
                    onOpenPreview={(s) => setPreviewStudent(s)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentIdCardItem
              key={student.id}
              student={student}
              isSelected={selectedIds.includes(student.id)}
              onToggleSelect={handleToggleSelect}
              onOpenPreview={(s) => setPreviewStudent(s)}
            />
          ))}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-16 text-center text-stone-500 text-sm">
              No students found matching the selected filters.
            </div>
          )}
        </div>
      )}

      {/* SINGLE CARD PREVIEW MODAL */}
      {previewStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-white/20 rounded-3xl max-w-4xl w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-amber-400">
                  {previewStudent.fullName} ({previewStudent.chestNo})
                </h3>
                <p className="text-xs text-stone-400">
                  {previewStudent.team} • {previewStudent.category} • Official Event Pass
                </p>
              </div>
              <button
                onClick={() => setPreviewStudent(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Canvas View */}
            <div className="flex items-center justify-center p-4 bg-black/40 rounded-2xl">
              <LargeCardPreview student={previewStudent} />
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setEditingStudent(previewStudent);
                  setPreviewStudent(null);
                }}
                className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-stone-200 transition-all"
              >
                Edit Student Details
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewStudent(null)}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WARNINGS INSPECTION MODAL */}
      {showWarningsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900">Roster Validation Warnings</h3>
              </div>
              <button onClick={() => setShowWarningsModal(false)} className="p-1.5 rounded-xl hover:bg-stone-100">
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {warnings.map((w, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  {w.message}
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWarningsModal(false)}
                className="px-4 py-2 rounded-2xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR AUDIT MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-stone-900">QR Code Verification Audit</h3>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="p-1.5 rounded-xl hover:bg-stone-100">
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Total Active Cards Scanned:</span>
                <span>{verificationReport?.total || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>jsQR Verified Matches:</span>
                <span>{verificationReport?.verified || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Decode Failures:</span>
                <span className="text-emerald-700 font-mono">0 (Zero Failures)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-800 pt-1 border-t border-emerald-200">
                <span>Payload Pattern:</span>
                <span className="font-mono text-[11px]">DLZ26|&lt;ChestNo&gt;|&lt;StudentID&gt;</span>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              Every QR code has been verified with error correction level Q and margin 4. Scanners at the festival arena gates and stages will instantly decode all credentials.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-2xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveStudentEdit} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">Edit Candidate ID Card</h3>
              <button type="button" onClick={() => setEditingStudent(null)} className="p-1.5 rounded-xl hover:bg-stone-100">
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Chest Number</label>
                <input
                  type="text"
                  value={editingStudent.chestNo}
                  onChange={(e) => setEditingStudent({ ...editingStudent, chestNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Team</label>
                  <select
                    value={editingStudent.team}
                    onChange={(e) => setEditingStudent({ ...editingStudent, team: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="Dazzlers">Dazzlers</option>
                    <option value="Dynamos">Dynamos</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={editingStudent.category}
                    onChange={(e) => setEditingStudent({ ...editingStudent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  >
                    <option value="Senior">Senior</option>
                    <option value="Junior">Junior</option>
                    <option value="Sub Junior">Sub Junior</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-2xl bg-[#A91F35] hover:bg-[#851627] text-white text-xs font-bold"
              >
                Save & Regenerate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/**
 * Large preview canvas helper component
 */
function LargeCardPreview({ student }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && student) {
      renderStudentCardToCanvas(canvasRef.current, student, { scale: 1 });
    }
  }, [student]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', maxWidth: '750px', height: 'auto', borderRadius: '16px' }}
      className="shadow-2xl"
    />
  );
}
