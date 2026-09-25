import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Flame, 
  Wind, 
  Info,
  ArrowRight
} from 'lucide-react';
import { PageView } from './Navbar';

interface FireSafetyIntelligenceProps {
  onNavigate: (page: PageView) => void;
  onExploreExperiments: () => void;
}

export const FireSafetyIntelligence: React.FC<FireSafetyIntelligenceProps> = ({
  onNavigate,
  onExploreExperiments
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>FLIGHT CERTIFICATION & EVIDENCE CORRIDORS</span>
            <span className="text-slate-600">·</span>
            <span>NASA STD-6001B ANALYTICAL ANALOGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Fire Safety Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Synthesized indicators derived from experimental records across material classes and exploration atmospheres.
          </p>
        </div>

        {/* Prominent Mandatory Safety Disclaimer (Prompt Section 16) */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-600/40 text-xs text-amber-200/90 max-w-md">
          <div className="flex items-center gap-2 font-bold font-mono text-amber-400 mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            SAFETY COMPLIANCE DISCLAIMER
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            This platform summarizes and interprets available research. It is not a substitute for spacecraft certification, engineering analysis, or mission safety procedures.
          </p>
        </div>
      </div>

      {/* 4 Primary Evidence-Derived Indicator Cards (Prompt Section 16) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Material Flammability */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RESEARCH SIGNAL</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Material Flammability
          </h3>
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">EVIDENCE LEVEL</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
              Medium
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            High testing fidelity for PMMA and thin cotton-fiberglass; limited microgravity flammability records for advanced fluoropolymers in low flow.
          </p>
        </div>

        {/* Card 2: Oxygen Sensitivity */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RESEARCH SIGNAL</span>
            <Layers className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Oxygen Sensitivity
          </h3>
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">EVIDENCE LEVEL</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
              High
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Corroborated across Saffire-IV, SOFIE, and drop tower series: elevated oxygen (≥ 25% O₂) drastically accelerates flame velocity and lowers ignition barrier.
          </p>
        </div>

        {/* Card 3: Flame Spread */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RESEARCH SIGNAL</span>
            <Wind className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Flame Spread Velocity
          </h3>
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">EVIDENCE LEVEL</div>
            <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">
              Medium
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Strong linear dependence on forced cabin air velocity. Concurrent flame spread occurs reliably down to 3.5 cm/s ventilation drafts.
          </p>
        </div>

        {/* Card 4: Research Coverage */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RESEARCH SIGNAL</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            Partial-G Coverage
          </h3>
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">EVIDENCE LEVEL</div>
            <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
              Low
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sparse indexed dataset for steady-state Lunar (0.166g) and Martian (0.38g) burns due to the 20-second duration limits of parabolic aircraft arcs.
          </p>
        </div>
      </div>

      {/* Critical Spacecraft Fire Vulnerabilities Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white font-display">
          Microgravity Fire Dynamics: Terrestrial vs Orbital Divergences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-amber-400 font-bold uppercase">1. Quiescent Flame Quenching</span>
            <p className="text-slate-300 leading-relaxed">
              Without gravity-driven buoyant drafts, combustion products (CO₂ and H₂O vapor) form an insulating blanket around the flame zone. In stagnant cabin pockets (&lt; 2 cm/s airflow), flames self-extinguish through radiative heat dissipation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-rose-400 font-bold uppercase">2. Persistent Cool Flames</span>
            <p className="text-slate-300 leading-relaxed">
              As observed in the FLEX experiment series, apparent visual flame extinction does not guarantee safety. Low-temperature cool flames continue consuming fuel at sub-900 K without visible chemiluminescence, releasing flammable toxic intermediates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-mono text-blue-400 font-bold uppercase">3. Soot Agglomeration Dynamics</span>
            <p className="text-slate-300 leading-relaxed">
              Long residence times in the absence of buoyant updrafts allow soot particles to agglomerate into chains 10x larger than terrestrial smoke. Optical scatter smoke detectors may experience delayed trigger response or premature filter occlusion.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onExploreExperiments}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Review Empirical Benchmark Tests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
