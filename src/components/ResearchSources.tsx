import React, { useState } from 'react';
import { 
  Database, 
  ExternalLink, 
  Search, 
  FileText, 
  BookOpen, 
  Calendar, 
  Users, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { RESEARCH_SOURCES } from '../data/mockExperiments';
import { ResearchSource } from '../types';

export const ResearchSources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');

  const areas = [
    'all',
    'Large-Scale Spacecraft Fires',
    'Material Flammability',
    'Flame Extinction',
    'Exploration Atmospheres',
    'Smoke Detection'
  ];

  const filteredSources = RESEARCH_SOURCES.filter((s) => {
    if (selectedArea !== 'all' && s.researchArea !== selectedArea) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.authors.toLowerCase().includes(q) ||
        s.nasaDocNumber.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>PUBLIC ARCHIVAL CORPUS</span>
            <span className="text-slate-600">·</span>
            <span>NASA TECHNICAL REPORTS SERVER (NTRS) & PEER-REVIEWED PAPERS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Research Sources
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Verified peer-reviewed papers, NASA Technical Memorandums (TMs), and AIAA proceedings anchoring the FireWatch AI knowledge base.
          </p>
        </div>

        <div className="text-xs font-mono text-blue-400 bg-blue-950/40 border border-blue-800/40 px-3 py-1.5 rounded-lg">
          Public Scientific Literature Archive
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search papers by title, author (Urban, Ferkul, T'ien, Ruff), or NASA Doc ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Research Areas ({RESEARCH_SOURCES.length})</option>
            {areas.filter(a => a !== 'all').map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sources Grid / List */}
      <div className="space-y-3">
        {filteredSources.map((src) => (
          <div
            key={src.id}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-semibold">{src.nasaDocNumber}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{src.organization}</span>
                <span className="text-slate-600">·</span>
                <span>{src.year}</span>
              </div>

              <h3 className="text-base font-semibold text-white font-display">
                {src.title}
              </h3>

              <div className="text-xs text-slate-400 font-sans flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{src.authors}</span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 pt-1 font-sans">
                {src.abstract}
              </p>

              <div className="text-xs font-mono text-slate-400 pt-1 flex flex-wrap items-center gap-3">
                <span className="text-blue-400">Area: {src.researchArea}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">{src.experimentsCovered} Indexed Runs</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">Materials: {src.materialsCovered.join(', ')}</span>
              </div>
            </div>

            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono rounded-lg transition-colors flex items-center gap-2 shrink-0 border border-slate-700 cursor-pointer"
            >
              <span>NASA NTRS Record</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
