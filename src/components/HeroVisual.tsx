import React, { useState } from 'react';
import { Play, Sparkles, Activity, Layers, ArrowUpRight } from 'lucide-react';

interface HeroVisualProps {
  onExploreExperiment: (id: string) => void;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ onExploreExperiment }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [gravityMode, setGravityMode] = useState<'0g' | '1g' | 'lunar'>('0g');

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-blue-950/40 p-5 overflow-hidden backdrop-blur-md">
      {/* Top telemetry status bar */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-300 font-semibold tracking-wider uppercase">CIR / OPTICAL TEST CELL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">DIAGNOSTIC RUN: EXP-002</span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] text-amber-400 font-mono">CHEMILUMINESCENCE ACTIVE</span>
        </div>
      </div>

      {/* Main Chamber Stage */}
      <div 
        className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-b from-[#050C17] via-[#091526] to-[#040812] border border-slate-800/80 overflow-hidden flex items-center justify-center cursor-crosshair group select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(true)}
      >
        {/* Optical grid and reticle lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-blue-500/20 pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-blue-500/20 pointer-events-none" />
        <div className="absolute w-44 h-44 rounded-full border border-blue-500/15 pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full border border-dashed border-blue-400/10 pointer-events-none" />

        {/* Laser sheet diagnostic plane line */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
        <span className="absolute top-3 left-4 text-[10px] font-mono text-cyan-400/70 tracking-widest uppercase">
          LASER ILLUMINATION: 532nm
        </span>

        {/* Sample mounting bar at bottom of chamber */}
        <div className="absolute bottom-10 inset-x-16 h-2 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-sm shadow-md border-t border-slate-500/50 flex items-center justify-center">
          <div className="w-16 h-3.5 -top-1.5 absolute bg-amber-900/60 border border-amber-600/40 rounded-xs flex items-center justify-center">
            <span className="text-[8px] font-mono text-amber-300/80 tracking-tighter">PMMA SLAB</span>
          </div>
        </div>

        {/* Dynamic Flame Core & Envelopes */}
        <div 
          className="relative z-10 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            onExploreExperiment('EXP-002');
          }}
        >
          {gravityMode === '0g' ? (
            /* Microgravity: Spherical Diffusion Flame (No Buoyancy) */
            <div className="relative flex items-center justify-center w-28 h-28">
              {/* Outer faint amber radiative envelope */}
              <div 
                className={`absolute w-28 h-28 rounded-full bg-gradient-to-r from-amber-600/20 via-orange-500/30 to-amber-600/20 blur-md transition-all duration-500 ${
                  isHovered ? 'scale-115 opacity-90' : 'scale-100 opacity-60'
                }`} 
              />
              {/* Mid translucent amber-orange flame boundary */}
              <div 
                className={`absolute w-20 h-20 rounded-full border border-amber-400/40 bg-radial from-orange-500/50 via-amber-600/20 to-transparent transition-all duration-300 ${
                  isHovered ? 'animate-pulse' : ''
                }`} 
              />
              {/* Inner chemiluminescent deep blue spherical core */}
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-blue-400 via-blue-600 to-indigo-900 shadow-[0_0_20px_rgba(59,130,246,0.8)] border border-blue-300/60 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-cyan-200/90 blur-[1px] animate-ping opacity-60" />
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              </div>

              {/* Flame propagation radial vectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#60A5FA" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1="50" y1="4" x2="50" y2="12" stroke="#FF9547" strokeWidth="1" />
                <line x1="50" y1="88" x2="50" y2="96" stroke="#FF9547" strokeWidth="1" />
                <line x1="4" y1="50" x2="12" y2="50" stroke="#FF9547" strokeWidth="1" />
                <line x1="88" y1="50" x2="96" y2="50" stroke="#FF9547" strokeWidth="1" />
              </svg>
            </div>
          ) : gravityMode === 'lunar' ? (
            /* Lunar Gravity (0.166g): Rounded bulbous dome with slight elongation */
            <div className="relative flex flex-col items-center justify-center w-28 h-32">
              <div className="absolute w-24 h-30 rounded-t-full rounded-b-2xl bg-gradient-to-t from-blue-600/30 via-orange-500/30 to-amber-400/40 blur-md" />
              <div className="relative w-16 h-22 rounded-t-full rounded-b-xl bg-gradient-to-t from-blue-500 via-amber-500 to-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.6)] border border-amber-300/40 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-cyan-200 blur-xs" />
              </div>
            </div>
          ) : (
            /* Terrestrial 1G: Buoyant upward elongated teardrop */
            <div className="relative flex flex-col items-center justify-center w-24 h-36">
              <div className="absolute w-16 h-34 rounded-t-full rounded-b-full bg-gradient-to-t from-blue-600/40 via-amber-500/50 to-orange-400/60 blur-md animate-pulse" />
              <div className="relative w-10 h-28 rounded-t-full rounded-b-lg bg-gradient-to-t from-blue-600 via-amber-400 to-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
            </div>
          )}

          {/* Microgravity flame label under test point */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-amber-300/90 font-medium">
              {gravityMode === '0g' ? 'Symmetrical Diffusion Dome' : gravityMode === 'lunar' ? 'Partial Buoyant Dome (0.166g)' : 'Buoyant Teardrop (1.0g)'}
            </span>
          </div>
        </div>

        {/* Floating Scientific Data Labels (Prompt Specified) */}
        {/* Label 1: O2 */}
        <div className={`absolute top-6 left-6 transition-all duration-300 ${isHovered ? 'scale-105 border-amber-400/60 bg-slate-900/90' : 'border-slate-700/60 bg-slate-900/70'} p-2 rounded-lg border backdrop-blur-sm shadow-md`}>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">OXYGEN FRACTION</div>
          <div className="text-sm font-mono font-semibold text-slate-100 flex items-baseline gap-1">
            25.0 <span className="text-[10px] text-amber-400 font-mono">% O₂</span>
          </div>
        </div>

        {/* Label 2: Pressure */}
        <div className={`absolute top-6 right-6 transition-all duration-300 ${isHovered ? 'scale-105 border-blue-400/60 bg-slate-900/90' : 'border-slate-700/60 bg-slate-900/70'} p-2 rounded-lg border backdrop-blur-sm shadow-md text-right`}>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">TOTAL PRESSURE</div>
          <div className="text-sm font-mono font-semibold text-slate-100 flex items-baseline justify-end gap-1">
            1.0 <span className="text-[10px] text-blue-400 font-mono">atm (101 kPa)</span>
          </div>
        </div>

        {/* Label 3: Gravity */}
        <div className={`absolute bottom-6 left-6 transition-all duration-300 ${isHovered ? 'scale-105 border-purple-400/60 bg-slate-900/90' : 'border-slate-700/60 bg-slate-900/70'} p-2 rounded-lg border backdrop-blur-sm shadow-md`}>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">GRAVITATIONAL ACCEL</div>
          <div className="text-sm font-mono font-semibold text-purple-300">
            {gravityMode === '0g' ? 'Microgravity (~0g)' : gravityMode === 'lunar' ? 'Lunar (0.166g)' : 'Terrestrial (1.0g)'}
          </div>
        </div>

        {/* Label 4: Airflow */}
        <div className={`absolute bottom-6 right-6 transition-all duration-300 ${isHovered ? 'scale-105 border-cyan-400/60 bg-slate-900/90' : 'border-slate-700/60 bg-slate-900/70'} p-2 rounded-lg border backdrop-blur-sm shadow-md text-right`}>
          <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">FORCED AIRFLOW</div>
          <div className="text-sm font-mono font-semibold text-cyan-300 flex items-baseline justify-end gap-1">
            4.5 <span className="text-[10px] text-cyan-400/80 font-mono">cm/s (Low)</span>
          </div>
        </div>

        {/* Label 5: Material Tag (Center Top) */}
        <div className="absolute top-3 inset-x-0 mx-auto w-fit px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300">
          MATERIAL: CAST PMMA THERMOPLASTIC
        </div>

        {/* Hover overlay card */}
        <div 
          className={`absolute inset-x-8 bottom-16 bg-slate-950/95 border border-amber-500/50 rounded-xl p-3.5 shadow-2xl backdrop-blur-md transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-amber-300 font-display flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Microgravity Flame Experiment (SOFIE-GEL-02)
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Sustained spherical diffusion dome in CIR at 25% O₂. Absence of buoyant draft reduces convective cooling.
              </p>
            </div>
            <button 
              onClick={() => onExploreExperiment('EXP-002')}
              className="shrink-0 px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-sans"
            >
              Explore Experiment
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Gravity Regime Selector */}
      <div className="mt-3.5 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[11px]">GRAVITY REGIME:</span>
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
          <button 
            onClick={() => setGravityMode('0g')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${gravityMode === '0g' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
          >
            0G Microgravity
          </button>
          <button 
            onClick={() => setGravityMode('lunar')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${gravityMode === 'lunar' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
          >
            0.166G Moon
          </button>
          <button 
            onClick={() => setGravityMode('1g')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${gravityMode === '1g' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
          >
            1.0G Earth
          </button>
        </div>
      </div>
    </div>
  );
};
