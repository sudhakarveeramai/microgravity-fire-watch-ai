import React from 'react';
import { Flame, ExternalLink, ShieldCheck, Database, GitFork, ArrowUp } from 'lucide-react';
import { PageView } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-[#040914] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              </div>
              <span className="text-base font-bold text-white font-display">
                FIREWATCH<span className="text-amber-400 font-mono ml-0.5">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              NASA Microgravity Fire Research Intelligence Platform. Transforming decades of space combustion data into mission-ready safety insights.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              DATA CORPUS: 1996 – 2026
            </div>
          </div>

          {/* Col 2: Core Platform Navigation */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
              Research Platform
            </div>
            <ul className="space-y-1.5 font-sans">
              <li>
                <button onClick={() => onNavigate('overview')} className="hover:text-amber-400 transition-colors">
                  Overview & Test Cell
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-amber-400 transition-colors">
                  Research Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('experiments')} className="hover:text-amber-400 transition-colors">
                  Experiment Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-amber-400 transition-colors">
                  Fire Behavior Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('compare')} className="hover:text-amber-400 transition-colors">
                  Experiment Comparison
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Off-Earth Missions & Safety */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
              Mission Applications
            </div>
            <ul className="space-y-1.5 font-sans">
              <li>
                <button onClick={() => onNavigate('mission')} className="hover:text-amber-400 transition-colors">
                  Moon & Mars Mission Mode
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('knowledge')} className="hover:text-amber-400 transition-colors">
                  Research Knowledge Graph
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('safety')} className="hover:text-amber-400 transition-colors">
                  Fire Safety Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-amber-400 transition-colors">
                  AI Research Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('methodology')} className="hover:text-amber-400 transition-colors">
                  Methodology & Provenance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Literature & External Archives */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
              Open Science Repositories
            </div>
            <ul className="space-y-1.5 font-mono text-[11px]">
              <li>
                <a 
                  href="https://ntrs.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>NASA NTRS Archives</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nasa.gov/mission/international-space-station/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>ISS Research CIR Facility</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nasa.gov/glenn/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <span>Glenn Research Center</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('sources')} className="hover:text-amber-400 transition-colors">
                  Public Sources Directory →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Scientific Disclaimer Bottom Strip */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>FireWatch AI Prototype Research Platform</span>
            <span className="hidden sm:inline">·</span>
            <span>Non-commercial educational & scientific research tool</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
