import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import {
  HeartPulse,
  Smile,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const ParentChildWellnessReport: React.FC = () => {
  const { selectedChild, wellnessDiagnostics, addNotification } = useApp();
  const [selectedEntry, setSelectedEntry] = useState(wellnessDiagnostics[1] || wellnessDiagnostics[0]);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Compute stats
  const averageMood = (wellnessDiagnostics.reduce((acc, e) => acc + e.score, 0) / wellnessDiagnostics.length).toFixed(1);
  const stressedDays = wellnessDiagnostics.filter(e => e.score <= 2).length;
  const happyDays = wellnessDiagnostics.filter(e => e.score >= 4).length;

  return (
    <div className="p-6 rounded-3xl clay-card space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-black flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-[#7C3AED]" /> CHILD WELLNESS PULSE REPORT
            </span>
            <span className="text-xs text-purple-700 font-bold">{selectedChild.name} ({selectedChild.grade})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B4B]">
            Emotional Wellness & Root Cause Diagnostic Report
          </h2>
          <p className="text-xs text-purple-800 font-medium">
            AI-powered behavioral telemetry helping parents understand why their child experiences stress or emotional dips.
          </p>
        </div>

        <button
          onClick={() => setShowPrintModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Diagnostic Report</span>
        </button>
      </div>

      {/* Wellness Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
          <span className="text-[11px] font-bold text-purple-700 block">Average Mood Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#1E1B4B]">{averageMood} / 5.0</span>
            <span className="text-xs text-purple-700 font-bold">😊 Stable Baseline</span>
          </div>
          <p className="text-[10px] text-purple-600 mt-0.5">Based on 14-day continuous telemetry</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
          <span className="text-[11px] font-bold text-amber-800 block">Stress / Dip Alerts Flagged</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-900">{stressedDays} Days</span>
            <span className="text-xs text-amber-700 font-bold">⚠️ Root Causes Identified</span>
          </div>
          <p className="text-[10px] text-amber-700 mt-0.5">Related to exam & homework deadlines</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 block">High Energy & Joy Days</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-900">{happyDays} Days</span>
            <span className="text-xs text-emerald-700 font-bold">🌟 Peak Motivation</span>
          </div>
          <p className="text-[10px] text-emerald-700 mt-0.5">Boosted by robotics & peer collaboration</p>
        </div>
      </div>

      {/* Main Split: Timeline of Days & Deep Root Cause Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Telemetry Days (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-purple-900">
            Daily Emotional Logs (Click to Inspect Root Cause)
          </h3>

          <div className="space-y-2.5">
            {wellnessDiagnostics.map((entry) => {
              const isSelected = selectedEntry.id === entry.id;
              const isStressed = entry.score <= 2;
              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#7C3AED] bg-purple-50 shadow-sm ring-1 ring-[#7C3AED]'
                      : isStressed
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50'
                      : 'border-purple-100 bg-white hover:bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{entry.emoji}</span>
                      <div>
                        <h4 className="font-black text-xs text-[#1E1B4B]">{entry.moodLabel}</h4>
                        <p className="text-[10px] text-purple-700 font-medium">Trigger: {entry.primaryTrigger}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 block">{entry.date}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isStressed ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Score {entry.score}/5
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed AI Diagnostic Breakdown (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex items-start justify-between gap-3 border-b border-purple-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-[#7C3AED] tracking-wider">
                Inspection Date: {selectedEntry.date}
              </span>
              <h3 className="text-lg font-black text-[#1E1B4B] flex items-center gap-2 mt-0.5">
                <span>{selectedEntry.emoji}</span>
                <span>{selectedEntry.moodLabel}</span>
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-[#7C3AED]">
              Primary Trigger: {selectedEntry.primaryTrigger}
            </span>
          </div>

          {/* Root Cause Assessment Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Why Did {selectedChild.name} Feel This Way? (AI Root Cause Assessment)</span>
            </h4>
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              {selectedEntry.aiDiagnosticAssessment}
            </p>
          </div>

          {/* Observable Physical & Cognitive Symptoms */}
          <div className="space-y-2">
            <span className="text-xs font-black text-[#1E1B4B] block">Observable Symptoms & School Telemetry:</span>
            <div className="flex flex-wrap gap-2">
              {selectedEntry.symptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 text-xs font-bold"
                >
                  • {sym}
                </span>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations for Parents */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <h4 className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              <span>Actionable Home Guidance for Parents</span>
            </h4>
            <div className="space-y-2 text-xs text-emerald-950 font-medium">
              {selectedEntry.parentRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PRINTABLE WELLNESS REPORT MODAL */}
      <AnimatePresence>
        {showPrintModal && (
          <div className="fixed inset-0 bg-[#1E1B4B]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-purple-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="border-2 border-purple-200 rounded-2xl p-6 space-y-5 bg-[#FCFAFF]">
                <div className="flex items-center justify-between border-b-2 border-purple-200 pb-3">
                  <div>
                    <h3 className="text-base font-black text-[#1E1B4B]">ST. JUDE INTERNATIONAL ACADEMY</h3>
                    <p className="text-xs text-purple-800 font-bold">Child Psychological & Emotional Wellness Pulse Report</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-[#7C3AED] rounded-full text-xs font-black">
                    OFFICIAL COUNSELOR LOG
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-purple-50 p-3 rounded-xl border border-purple-100 font-bold">
                  <div>Student: {selectedChild.name} ({selectedChild.grade})</div>
                  <div>Average Mood Baseline: {averageMood} / 5.0</div>
                  <div>Stressed / Alert Days: {stressedDays} Days</div>
                  <div>Report Date: 2026-05-24</div>
                </div>

                <div className="space-y-3 text-xs">
                  <h4 className="font-black text-[#1E1B4B]">Behavioral & Academic Stress Correlate Summary:</h4>
                  {wellnessDiagnostics.map((d) => (
                    <div key={d.id} className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                      <div className="flex justify-between font-black text-purple-900">
                        <span>{d.date} • {d.moodLabel} ({d.emoji})</span>
                        <span>Trigger: {d.primaryTrigger}</span>
                      </div>
                      <p className="text-slate-600">{d.aiDiagnosticAssessment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
