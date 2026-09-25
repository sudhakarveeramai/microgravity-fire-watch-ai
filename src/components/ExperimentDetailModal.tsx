import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  FileText, 
  Flame, 
  Wind, 
  Gauge, 
  Thermometer, 
  Clock, 
  GitCompare,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Save,
  Check
} from 'lucide-react';
import { Experiment } from '../types';
import { useAuth } from '../context/AuthContext';

interface ExperimentDetailModalProps {
  experiment: Experiment | null;
  onClose: () => void;
  onCompareWith?: (exp: Experiment) => void;
}

export const ExperimentDetailModal: React.FC<ExperimentDetailModalProps> = ({
  experiment,
  onClose,
  onCompareWith
}) => {
  const { user, savedData, toggleBookmark, saveNote } = useAuth();
  const [noteText, setNoteText] = useState<string>('');
  const [isSavedNote, setIsSavedNote] = useState<boolean>(false);

  useEffect(() => {
    if (experiment && savedData?.customNotes?.[experiment.id]) {
      setNoteText(savedData.customNotes[experiment.id]);
    } else {
      setNoteText('');
    }
    setIsSavedNote(false);
  }, [experiment, savedData]);

  if (!experiment) return null;

  const isBookmarked = savedData?.bookmarks?.includes(experiment.id);

  const handleSaveNote = async () => {
    if (!experiment) return;
    await saveNote(experiment.id, noteText);
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-1.5">
              <span className="text-amber-400 font-bold text-sm tracking-wider">{experiment.id}</span>
              <span className="text-slate-600">·</span>
              <span>{experiment.codeName}</span>
              <span className="text-slate-600">·</span>
              <span className="text-blue-400">{experiment.mission}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              {experiment.title}
            </h2>
            <div className="text-xs font-mono text-slate-400 mt-1">
              FACILITY: {experiment.facility} · CONDUCTED IN {experiment.year}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmark(experiment.id)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
              title={isBookmarked ? 'Remove from Firestore Bookmarks' : 'Bookmark to Firestore'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

            {onCompareWith && (
              <button
                onClick={() => {
                  onCompareWith(experiment);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Compare</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. Experimental Conditions Grid (Prompt Specified) */}
        <div>
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            Experimental Conditions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400">GRAVITY</div>
              <div className="text-sm font-semibold text-purple-300 mt-0.5 truncate">
                {experiment.gravity.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{experiment.gravity}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400">OXYGEN FRACTION</div>
              <div className="text-sm font-semibold text-amber-400 mt-0.5 tabular-nums">
                {experiment.oxygenPercent} %
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Atmospheric O₂</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400">TOTAL PRESSURE</div>
              <div className="text-sm font-semibold text-blue-300 mt-0.5 tabular-nums">
                {experiment.pressureAtm} atm
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{experiment.pressureKPa} kPa</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400">MATERIAL</div>
              <div className="text-sm font-semibold text-white mt-0.5 truncate" title={experiment.material}>
                {experiment.material.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{experiment.materialCategory}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400">AIRFLOW VELOCITY</div>
              <div className="text-sm font-semibold text-cyan-300 mt-0.5 tabular-nums">
                {experiment.airflowCmS} cm/s
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Forced Convection</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400">AMBIENT TEMP</div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5 tabular-nums">
                {experiment.ambientTempK} K
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">~ {(experiment.ambientTempK - 273.15).toFixed(1)} °C</div>
            </div>
          </div>
        </div>

        {/* 2. Flame Behavior Metrics (Prompt Specified) */}
        <div>
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            Flame Behavior & Dynamics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Flame spread */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>FLAME SPREAD RATE</span>
                <Wind className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {experiment.flameSpreadMmS} <span className="text-xs font-normal text-slate-400">mm/s</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-amber-400 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (experiment.flameSpreadMmS / 3.5) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Regime: {experiment.flameType}
              </div>
            </div>

            {/* Peak Temp */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>PEAK FLAME TEMP</span>
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {experiment.peakTemperatureK} <span className="text-xs font-normal text-slate-400">K</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-rose-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, ((experiment.peakTemperatureK - 700) / 1000) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Color: {experiment.flameColor}
              </div>
            </div>

            {/* Ignition Time */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>IGNITION DELAY</span>
                <Clock className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {experiment.ignitionTimeS} <span className="text-xs font-normal text-slate-400">s</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-400 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (experiment.ignitionTimeS / 20) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Result: {experiment.empiricalResult}
              </div>
            </div>

            {/* Burning Duration */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>BURNING DURATION</span>
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                {experiment.burnDurationS} <span className="text-xs font-normal text-slate-400">s</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (experiment.burnDurationS / 600) * 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Soot Index: {experiment.sootProductionIndex}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Distinct Separation: Raw Evidence vs AI Interpretation (Prompt Required) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Box A: Experimental Observation (Empirical Ground Truth) */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-blue-400 font-semibold flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Empirical Observation
              </span>
              <span className="text-[10px] font-mono text-slate-500">RAW INSTRUMENT EVIDENCE</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {experiment.observations}
            </p>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
              <span className="text-slate-300 font-medium">Finding:</span> {experiment.findings}
            </div>
          </div>

          {/* Box B: AI Interpretation (Synthesized Insight) */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-amber-950/20 border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                AI Interpretation
              </span>
              <span className="text-[10px] font-mono text-amber-400/80">PROTOTYPE RETRIEVAL INFERENCE</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {experiment.aiInterpretation}
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>EVIDENCE STRENGTH:</span>
              <span className="text-emerald-400 font-medium">{experiment.evidenceStrength}</span>
            </div>
          </div>
        </div>

        {/* 4. Original Source Citations (Prompt Specified) */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              ORIGINAL SOURCE DOCUMENT
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {experiment.sourceTitle}
            </div>
            <div className="text-xs font-mono text-slate-400">
              {experiment.sourceAuthors} ({experiment.sourceYear}) · {experiment.sourceDocId}
            </div>
          </div>

          {experiment.sourceUrl && (
            <a
              href={experiment.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-mono flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>NASA NTRS Record</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* 5. Researcher Notes (Firestore Persisted) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Investigator Mission Notes (Firestore Persisted)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {user ? `Signed in as ${user.displayName || user.email}` : 'Local Draft'}
            </span>
          </div>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-sans leading-relaxed"
            placeholder="Add mission risk notes, crew safety observations, or Artemis atmosphere considerations for this experiment..."
          />

          <div className="flex items-center justify-end">
            <button
              onClick={handleSaveNote}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSavedNote
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
            >
              {isSavedNote ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Profile</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
