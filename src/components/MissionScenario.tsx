import React, { useState } from 'react';
import { 
  Rocket, 
  Orbit, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  Compass, 
  Flame, 
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { MISSION_SCENARIOS, EXPERIMENTS_DATA } from '../data/mockExperiments';
import { Experiment } from '../types';

interface MissionScenarioProps {
  initialMissionId?: 'iss' | 'moon' | 'mars';
  onSelectExperiment: (exp: Experiment) => void;
  onExploreGapExperiments: (keyword: string) => void;
}

export const MissionScenario: React.FC<MissionScenarioProps> = ({
  initialMissionId = 'moon',
  onSelectExperiment,
  onExploreGapExperiments
}) => {
  const [activeMissionId, setActiveMissionId] = useState<'iss' | 'moon' | 'mars'>(initialMissionId);

  const scenario = MISSION_SCENARIOS.find((m) => m.id === activeMissionId) || MISSION_SCENARIOS[1];

  const matchedExperiments = EXPERIMENTS_DATA.filter((exp) => 
    scenario.recommendedExperiments.includes(exp.id)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>OFF-EARTH HABITAT FLAMMABILITY PROJECTIONS</span>
            <span className="text-slate-600">·</span>
            <span>EXPLORATION ATMOSPHERE ANALYZER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Mission Scenario: {scenario.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Evaluate how microgravity combustion physics project onto Lunar base camps, Martian surface habitats, and orbital stations.
          </p>
        </div>

        {/* Environmental switcher buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {(['iss', 'moon', 'mars'] as const).map((mId) => (
            <button
              key={mId}
              onClick={() => setActiveMissionId(mId)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeMissionId === mId
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mId === 'iss' ? 'ISS (LEO)' : mId === 'moon' ? 'Moon (0.166g)' : 'Mars (0.38g)'}
            </button>
          ))}
        </div>
      </div>

      {/* Experimental Similarity & Condition Match Gauge (Prompt Required) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Similarity Scorecard */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>EXPERIMENTAL SIMILARITY</span>
              <span className="text-amber-400">GROUNDED ANALOG RATING</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-bold font-mono text-white tabular-nums">
                {scenario.conditionMatchPct}%
              </span>
              <span className="text-xs font-mono text-slate-400">Condition Match</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 my-3 overflow-hidden">
              <div 
                className={`h-2 rounded-full ${
                  scenario.conditionMatchPct >= 80 ? 'bg-emerald-400' :
                  scenario.conditionMatchPct >= 65 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${scenario.conditionMatchPct}%` }}
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3">
              {scenario.summary}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-amber-300/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Empirical Fidelity Notice:
            </div>
            <p className="text-slate-400">
              Low-Earth orbit (ISS) experiments do not directly predict surface fire dynamics on the Moon or Mars. Differences in ambient pressure, partial gravity buoyancy, and dust catalysis require dedicated mission verification.
            </p>
          </div>
        </div>

        {/* Environmental Parameters HUD */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Operational Environment Specifications
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">GRAVITY LEVEL</div>
              <div className="text-sm font-bold text-purple-300 mt-0.5">
                {scenario.gravityLabel}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{scenario.gravityG} g standard</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">HABITAT O₂ FRACTION</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5 tabular-nums">
                {scenario.standardO2Percent}% O₂
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Normobaric equivalent</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500">CABIN PRESSURE</div>
              <div className="text-sm font-bold text-blue-300 mt-0.5 tabular-nums">
                {scenario.standardPressureKPa} kPa
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{(scenario.standardPressureKPa * 0.145).toFixed(1)} psi</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Atmospheric Composition:</span>
            <div className="text-slate-200 font-mono font-medium">
              {scenario.atmosphereComposition}
            </div>
          </div>

          {/* Critical Risks */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Identified Mission Fire Vulnerabilities:</span>
            <div className="space-y-1.5">
              {scenario.criticalRisks.map((risk, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-rose-400 font-mono mt-0.5">▸</span>
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conditions Breakdown: Comparable Conditions vs Known Differences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Comparable Conditions */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            <span>Comparable Conditions (Empirically Validated)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {scenario.comparableConditions.map((cond, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono">✓</span>
                <span>{cond}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Known Differences */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Known Physical & Operational Differences</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {scenario.knownDifferences.map((diff, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-mono">▲</span>
                <span>{diff}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Research Gap Detector (Prompt Section 15) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/50 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Research Gap Detected
              </h3>
              <p className="text-xs font-mono text-slate-400">
                EVIDENCE INSUFFICIENCY SIGNAL FOR {scenario.name.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={() => onExploreGapExperiments('composite polymers')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore Related Experiments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono">
          <div>
            <div className="text-[10px] text-slate-500">MATERIAL</div>
            <div className="text-slate-200 font-semibold mt-0.5">Composite polymers & 3D regolith</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">ENVIRONMENT</div>
            <div className="text-slate-200 font-semibold mt-0.5">{scenario.name} Habitat</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">CONDITION</div>
            <div className="text-slate-200 font-semibold mt-0.5">Partial g + elevated 34% O₂</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">INDEXED EVIDENCE</div>
            <div className="text-rose-400 font-bold mt-0.5">Low (&lt; 4 Verified Runs)</div>
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed font-sans">
          Limited indexed evidence exists for long-duration smolder-to-flame transition in non-metallic composite structural elements under {scenario.gravityLabel} combined with 30-34% oxygen exploration atmospheres. Additional parabolic aircraft or lunar centrifuge testing is recommended prior to final Artemis habitat material sign-off.
        </div>
      </div>

      {/* Relevant Recommended Benchmark Experiments */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white font-display">
          Relevant Experiments for {scenario.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchedExperiments.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onSelectExperiment(exp)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span className="text-amber-400 font-semibold">{exp.id}</span>
                  <span className="text-slate-300 font-mono">{exp.gravity.split(' ')[0]}</span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                  {exp.title}
                </h4>
                <div className="text-xs font-mono text-slate-400 mt-2">
                  {exp.material} · {exp.oxygenPercent}% O₂ · {exp.flameType}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Coverage: {exp.evidenceCoverageScore}%</span>
                <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">Inspect →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
