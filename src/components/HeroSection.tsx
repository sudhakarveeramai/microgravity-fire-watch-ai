import React from 'react';
import { ArrowRight, Flame, ShieldCheck, Compass, Sparkles, BookOpen, Layers } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { PageView } from './Navbar';

interface HeroSectionProps {
  onNavigate: (page: PageView) => void;
  onExploreExperiment: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onExploreExperiment }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/60">
      {/* Background radial atmosphere */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-b from-blue-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Small credibility badge / kicker */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-amber-400 font-semibold uppercase tracking-wider">NASA & Space Agency Archives</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>1996 – 2026 Microgravity Corpus</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.08] text-balance">
                Decode Fire in Space.
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-300 font-display">
                Turn decades of microgravity fire research into actionable mission intelligence.
              </p>
            </div>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              FireWatch AI uses artificial intelligence, experimental data, and evidence-grounded research retrieval to help scientists, engineers, and mission teams understand how flames behave beyond Earth.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('experiments')}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Fire Research</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('assistant')}
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask FireWatch AI</span>
              </button>
            </div>

            {/* Credibility indicators (Prompt Specified) */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="font-mono text-slate-200 font-semibold">NASA Research</span>
                  <span className="text-slate-400 text-[11px] mt-0.5">Saffire, CIR, BASS, SOFIE</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-slate-200 font-semibold">Microgravity Tests</span>
                  <span className="text-slate-400 text-[11px] mt-0.5">Orbital, drop tower, aircraft</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-slate-200 font-semibold">AI-Powered Analysis</span>
                  <span className="text-slate-400 text-[11px] mt-0.5">Cross-variable synthesis</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-slate-200 font-semibold">Evidence Grounded</span>
                  <span className="text-slate-400 text-[11px] mt-0.5">Traceable source citations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Chamber Visual */}
          <div className="lg:col-span-6 flex justify-center">
            <HeroVisual onExploreExperiment={onExploreExperiment} />
          </div>
        </div>
      </div>
    </section>
  );
};
