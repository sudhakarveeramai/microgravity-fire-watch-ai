import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Flame, FileText, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { EXPERIMENTS_DATA, RESEARCH_SOURCES, MISSION_SCENARIOS } from '../data/mockExperiments';
import { Experiment } from '../types';
import { PageView } from './Navbar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperiment: (exp: Experiment) => void;
  onNavigate: (page: PageView) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectExperiment,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const qLower = query.toLowerCase().trim();

  const matchingExperiments = qLower
    ? EXPERIMENTS_DATA.filter((exp) => 
        exp.id.toLowerCase().includes(qLower) ||
        exp.title.toLowerCase().includes(qLower) ||
        exp.material.toLowerCase().includes(qLower) ||
        exp.findings.toLowerCase().includes(qLower)
      ).slice(0, 5)
    : EXPERIMENTS_DATA.slice(0, 3);

  const matchingSources = qLower
    ? RESEARCH_SOURCES.filter((s) =>
        s.title.toLowerCase().includes(qLower) ||
        s.authors.toLowerCase().includes(qLower) ||
        s.nasaDocNumber.toLowerCase().includes(qLower)
      ).slice(0, 3)
    : RESEARCH_SOURCES.slice(0, 2);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-800 pb-3">
          <Search className="w-5 h-5 text-slate-400 absolute left-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search experiments, materials, NASA documents, or missions..."
            className="w-full pl-10 pr-10 py-1.5 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Quick Actions */}
          {!query && (
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase px-2">QUICK NAVIGATION</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  onClick={() => { onNavigate('analytics'); onClose(); }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left text-slate-300 transition-colors"
                >
                  Fire Analytics →
                </button>
                <button
                  onClick={() => { onNavigate('assistant'); onClose(); }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left text-slate-300 transition-colors"
                >
                  Ask AI Copilot →
                </button>
                <button
                  onClick={() => { onNavigate('mission'); onClose(); }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left text-slate-300 transition-colors"
                >
                  Moon / Mars Mode →
                </button>
                <button
                  onClick={() => { onNavigate('sources'); onClose(); }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left text-slate-300 transition-colors"
                >
                  NASA Archive →
                </button>
              </div>
            </div>
          )}

          {/* Experiments Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase px-2 font-bold">
              EXPERIMENTS ({matchingExperiments.length})
            </span>
            <div className="space-y-1">
              {matchingExperiments.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => {
                    onSelectExperiment(exp);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-amber-400 font-bold">{exp.id}</span>
                    <span className="text-slate-300 truncate font-sans text-xs">{exp.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{exp.material.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources Section */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] text-slate-400 uppercase px-2 font-bold">
              RESEARCH SOURCES ({matchingSources.length})
            </span>
            <div className="space-y-1">
              {matchingSources.map((src) => (
                <div
                  key={src.id}
                  onClick={() => {
                    onNavigate('sources');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-blue-400">{src.nasaDocNumber}</span>
                    <span className="text-slate-300 truncate font-sans text-xs">{src.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{src.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Press ESC to close</span>
          <span>FireWatch AI Search Engine</span>
        </div>
      </div>
    </div>
  );
};
