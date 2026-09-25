import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Rocket, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { PageView } from './Navbar';

interface MethodologyProps {
  onNavigate: (page: PageView) => void;
}

export const Methodology: React.FC<MethodologyProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>SCIENTIFIC RIGOR & SYSTEM ARCHITECTURE</span>
          <span className="text-slate-600">·</span>
          <span>METHODOLOGICAL FOUNDATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
          About FireWatch AI & Methodology
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          How FireWatch AI transforms decades of scattered microgravity combustion literature into an indexed, mathematically grounded research intelligence environment.
        </p>
      </div>

      {/* Problem & Solution (Prompt Section 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
            THE SCIENTIFIC CHALLENGE
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Decades of Research Scattered in PDF Archives
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Since the 1990s, NASA, ESA, and JAXA have conducted pioneering combustion experiments aboard the Space Shuttle, Mir, ISS Combustion Integrated Rack (CIR), Cygnus (Saffire), and Zero-G drop towers. However, cross-experiment synthesis remains difficult because findings are distributed across thousands of technical memorandums (TMs), AIAA papers, and disparate experimental logs.
          </p>
        </div>

        {/* The Solution */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
            THE PLATFORM ARCHITECTURE
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Unified Empirical Extraction & Reasoning
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            FireWatch AI provides an integrated, searchable, AI-assisted platform to explore combustion physics beyond Earth. By structuring experimental conditions into normalized parameters (gravity, oxygen fraction, pressure, airflow, fuel geometry), researchers can query multidimensional trends instantly.
          </p>
        </div>
      </div>

      {/* 5-Step Pipeline (Prompt Section 18) */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white font-display">
          How FireWatch AI Operates: The 5-Step Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500 text-blue-300 font-mono text-xs flex items-center justify-center font-bold">1</span>
            <h3 className="text-xs font-bold text-white font-display">Document Ingestion</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Ingests public NASA and space agency microgravity combustion technical reports and conference proceedings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-600/30 border border-amber-500 text-amber-300 font-mono text-xs flex items-center justify-center font-bold">2</span>
            <h3 className="text-xs font-bold text-white font-display">Variable Indexing</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Indexes experimental parameters: material, oxygen fraction, pressure, gravity level, airflow velocity, fuel geometry.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500 text-emerald-300 font-mono text-xs flex items-center justify-center font-bold">3</span>
            <h3 className="text-xs font-bold text-white font-display">Evidence Extraction</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Extracts empirical observations: flame spread rate, ignition delay, peak temperatures, and soot agglomeration indices.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500 text-purple-300 font-mono text-xs flex items-center justify-center font-bold">4</span>
            <h3 className="text-xs font-bold text-white font-display">AI Cross-Synthesis</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Uses artificial intelligence to summarize, compare, and reason across disparate campaigns (e.g. Saffire vs CIR).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="w-6 h-6 rounded-full bg-rose-600/30 border border-rose-500 text-rose-300 font-mono text-xs flex items-center justify-center font-bold">5</span>
            <h3 className="text-xs font-bold text-white font-display">Zero-Hallucination Gate</h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Strictly isolates raw experimental observations from AI inference, anchoring all claims to verifiable NASA citations.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Data Integrity Statement (Prompt Section 18) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Statement of Scientific Integrity & Data Provenance</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
          "FireWatch AI is an analytical research platform designed to accelerate scientific discovery and fire safety research. All findings are derived from peer-reviewed publications and NASA technical reports."
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          The platform operates under the core product principle that AI models must never fabricate findings or present speculative models as established empirical facts. Every experimental run in our index includes its original source publication, author team, publication year, and document identifier.
        </p>
      </div>

      {/* Artemis & Future Mission Relevance (Prompt Section 18) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold uppercase">
          <Rocket className="w-4 h-4" />
          <span>Artemis & Deep Space Habitat Fire Safety</span>
        </div>
        <h2 className="text-xl font-bold text-white font-display">
          From Low-Earth Orbit to the Lunar South Pole & Mars
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          As human exploration transitions from the International Space Station to the lunar surface (Artemis Base Camp) and eventually Mars transit vehicles, environmental architectures will depart significantly from terrestrial sea-level conditions. Exploration Atmospheres (typically 34% O₂ at 56 kPa / 8.2 psi) significantly enhance materials flammability while partial gravity alters convective flame cooling in complex ways. FireWatch AI equips mission architects with the cross-campaign intelligence needed to safeguard the next generation of explorers.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate('mission')}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Lunar & Martian Mission Scenarios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
