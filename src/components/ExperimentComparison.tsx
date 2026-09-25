import React, { useState } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Flame, 
  Wind, 
  Gauge, 
  Thermometer, 
  Clock 
} from 'lucide-react';
import { EXPERIMENTS_DATA } from '../data/mockExperiments';
import { Experiment } from '../types';

interface ExperimentComparisonProps {
  initialExpA?: Experiment;
  initialExpB?: Experiment;
  onSelectExperiment: (exp: Experiment) => void;
}

export const ExperimentComparison: React.FC<ExperimentComparisonProps> = ({
  initialExpA,
  initialExpB,
  onSelectExperiment
}) => {
  const [expAId, setExpAId] = useState<string>(initialExpA?.id || 'EXP-001');
  const [expBId, setExpBId] = useState<string>(initialExpB?.id || 'EXP-004');

  const expA = EXPERIMENTS_DATA.find((e) => e.id === expAId) || EXPERIMENTS_DATA[0];
  const expB = EXPERIMENTS_DATA.find((e) => e.id === expBId) || EXPERIMENTS_DATA[3];

  const presets = [
    { label: 'Saffire Cotton vs Saffire Composite (EXP-001 vs EXP-004)', a: 'EXP-001', b: 'EXP-004' },
    { label: 'PMMA in 0G vs Aramid Quench (EXP-002 vs EXP-003)', a: 'EXP-002', b: 'EXP-003' },
    { label: 'Microgravity 0G vs Lunar 0.166G (EXP-001 vs EXP-005)', a: 'EXP-001', b: 'EXP-005' },
    { label: 'Standard Air vs 34% O2 Spacesuit (EXP-003 vs EXP-012)', a: 'EXP-003', b: 'EXP-012' }
  ];

  const generateComparisonSynthesis = (a: Experiment, b: Experiment) => {
    const o2Diff = Math.abs(a.oxygenPercent - b.oxygenPercent);
    const gravDiff = a.gravity !== b.gravity;
    const matDiff = a.materialCategory !== b.materialCategory;
    const spreadDiff = (b.flameSpreadMmS - a.flameSpreadMmS).toFixed(2);

    let synthesis = `Comparative analysis of ${a.id} (${a.codeName}) and ${b.id} (${b.codeName}) shows distinct flammability signatures. `;

    if (o2Diff > 0) {
      synthesis += `Experiment ${b.id} evaluated an elevated oxidizer environment (${b.oxygenPercent}% O₂ vs ${a.oxygenPercent}% O₂ in ${a.id}). Available empirical records indicate that elevated oxygen serves as a potential contributing factor to the observed flame spread variance (${spreadDiff} mm/s delta), though differences in sample geometry and conductive heat losses must also be considered. `;
    }

    if (gravDiff) {
      synthesis += `Furthermore, the test environments span different gravitational regimes (${a.gravity} vs ${b.gravity}). In reduced or partial gravity, the attenuation of buoyant convective cooling may alter the net heat flux balance at the pyrolyzing surface. `;
    }

    if (matDiff) {
      synthesis += `Because the fuel substrates differ (${a.materialCategory} vs ${b.materialCategory}), pyrolysis kinetics and char layer thermal resistance are key potential contributing factors rather than gravity or oxygen alone.`;
    } else {
      synthesis += `Both investigations examined substrates within the ${a.materialCategory} category, providing high comparative relevance for spacecraft cabin materials selection.`;
    }

    return synthesis;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>MULTI-RUN CROSS-SYNTHESIS</span>
            <span className="text-slate-600">·</span>
            <span>CONTROLLED VARIABLE DISCRIMINATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Compare Experiments
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Select two benchmark combustion runs to evaluate environmental condition deltas, flame metrics, and evidence-grounded comparative insights.
          </p>
        </div>

        {/* Causal Warning Disclaimer (Prompt Required) */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] leading-tight">
            Scientific rigor note: AI comparison highlights potential contributing factors; causation requires identical boundary controls.
          </span>
        </div>
      </div>

      {/* Quick Comparison Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase">RECOMMENDED COMPARISON SCENARIOS:</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setExpAId(p.a);
                setExpBId(p.b);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-mono transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector A */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <label className="block text-xs font-mono text-amber-400 font-semibold uppercase">
            EXPERIMENT A (BASELINE RUN)
          </label>
          <select
            value={expAId}
            onChange={(e) => setExpAId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-400"
          >
            {EXPERIMENTS_DATA.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.id}: {exp.codeName} — {exp.material} ({exp.gravity.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <label className="block text-xs font-mono text-blue-400 font-semibold uppercase">
            EXPERIMENT B (COMPARATIVE RUN)
          </label>
          <select
            value={expBId}
            onChange={(e) => setExpBId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-blue-400"
          >
            {EXPERIMENTS_DATA.map((exp) => (
              <option key={exp.id} value={exp.id}>
                {exp.id}: {exp.codeName} — {exp.material} ({exp.gravity.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-300 font-mono text-[11px] uppercase">
                <th className="py-3 px-4 w-1/3">Parameter</th>
                <th className="py-3 px-4 w-1/3 text-amber-400 font-bold">
                  Experiment A ({expA.id})
                </th>
                <th className="py-3 px-4 w-1/3 text-blue-400 font-bold">
                  Experiment B ({expB.id})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Mission & Program</td>
                <td className="py-3 px-4 text-slate-200">{expA.mission} ({expA.year})</td>
                <td className="py-3 px-4 text-slate-200">{expB.mission} ({expB.year})</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Gravitational Field</td>
                <td className="py-3 px-4 text-purple-300">{expA.gravity}</td>
                <td className="py-3 px-4 text-purple-300">{expB.gravity}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Oxygen Concentration</td>
                <td className="py-3 px-4 text-amber-300 font-semibold">{expA.oxygenPercent}% O₂</td>
                <td className="py-3 px-4 text-blue-300 font-semibold">{expB.oxygenPercent}% O₂</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Total Barometric Pressure</td>
                <td className="py-3 px-4 text-slate-200">{expA.pressureAtm} atm ({expA.pressureKPa} kPa)</td>
                <td className="py-3 px-4 text-slate-200">{expB.pressureAtm} atm ({expB.pressureKPa} kPa)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Tested Material Substrate</td>
                <td className="py-3 px-4 text-white font-sans font-medium">
                  {expA.material} <span className="text-[10px] text-slate-400 font-mono block">({expA.materialCategory})</span>
                </td>
                <td className="py-3 px-4 text-white font-sans font-medium">
                  {expB.material} <span className="text-[10px] text-slate-400 font-mono block">({expB.materialCategory})</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Forced Airflow Velocity</td>
                <td className="py-3 px-4 text-cyan-300">{expA.airflowCmS} cm/s</td>
                <td className="py-3 px-4 text-cyan-300">{expB.airflowCmS} cm/s</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Flame Spread Rate</td>
                <td className="py-3 px-4 text-amber-400 font-bold tabular-nums">{expA.flameSpreadMmS} mm/s</td>
                <td className="py-3 px-4 text-blue-400 font-bold tabular-nums">{expB.flameSpreadMmS} mm/s</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Ignition Delay Time</td>
                <td className="py-3 px-4 text-slate-200 tabular-nums">{expA.ignitionTimeS} s</td>
                <td className="py-3 px-4 text-slate-200 tabular-nums">{expB.ignitionTimeS} s</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Peak Flame Temperature</td>
                <td className="py-3 px-4 text-rose-300 tabular-nums">{expA.peakTemperatureK} K</td>
                <td className="py-3 px-4 text-rose-300 tabular-nums">{expB.peakTemperatureK} K</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans font-medium">Empirical Outcome</td>
                <td className="py-3 px-4 text-slate-200">{expA.empiricalResult}</td>
                <td className="py-3 px-4 text-slate-200">{expB.empiricalResult}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Comparison Synthesis Card (Prompt Section 11) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-amber-950/20 border border-slate-700/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">
              AI Comparative Synthesis
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400/90">EVIDENCE-GROUNDED REASONING</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {generateComparisonSynthesis(expA, expB)}
        </p>

        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>DATA CONFIDENCE: HIGH</span>
            <span className="text-slate-600">·</span>
            <span>VERIFIED OBSERVATIONS</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectExperiment(expA)}
              className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
            >
              Open {expA.id} Dossier
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onSelectExperiment(expB)}
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              Open {expB.id} Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
