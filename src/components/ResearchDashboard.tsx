import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Flame, 
  Wind, 
  Compass, 
  FileText, 
  Filter, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { RESEARCH_ACTIVITY_DATA, PRESET_AI_QUERIES, EXPERIMENTS_DATA } from '../data/mockExperiments';
import { Experiment } from '../types';
import { PageView } from './Navbar';

interface ResearchDashboardProps {
  onNavigate: (page: PageView) => void;
  onSelectExperiment: (exp: Experiment) => void;
  onRunAIQuery: (query: string) => void;
}

type ActivityFilter = 'all' | 'microgravity' | 'combustion' | 'flameSpread' | 'ignition' | 'smoke';

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({
  onNavigate,
  onSelectExperiment,
  onRunAIQuery
}) => {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions: { id: ActivityFilter; label: string; color: string }[] = [
    { id: 'all', label: 'All Fields', color: '#3B82F6' },
    { id: 'microgravity', label: 'Microgravity', color: '#8B5CF6' },
    { id: 'combustion', label: 'Combustion', color: '#FF7A18' },
    { id: 'flameSpread', label: 'Flame Spread', color: '#10B981' },
    { id: 'ignition', label: 'Ignition', color: '#F59E0B' },
    { id: 'smoke', label: 'Smoke Dynamics', color: '#94A3B8' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onRunAIQuery(searchQuery.trim());
    }
  };

  const activeColor = filterOptions.find(f => f.id === activityFilter)?.color || '#3B82F6';

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>NASA GLENN / ISS CIR / SAFFIRE DATA CORPUS</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400">PROTOTYPE RESEARCH ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Fire Research Intelligence
          </h1>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm sm:text-base">
            Explore experimental evidence across decades of space-based combustion research.
          </p>
        </div>

        {/* Prototype disclosure disclaimer */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] leading-tight">
            Prototype dataset: Sample metadata structured from public NASA technical reports.
          </span>
        </div>
      </div>

      {/* Prominent AI Research Search Section (Prompt Section 7) */}
      <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="ai-search-input" className="text-sm font-semibold text-slate-200 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Ask a question about fire in space...
            </label>
            <span className="text-xs font-mono text-slate-400">Semantic Evidence Retrieval</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                id="ai-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What happens to flame spread when oxygen concentration increases in microgravity?"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Ask FireWatch AI</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>

          {/* Suggested Questions */}
          <div className="pt-2">
            <div className="text-xs text-slate-400 mb-2 font-mono">SUGGESTED SCIENTIFIC INQUIRIES:</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_AI_QUERIES.map((query, i) => (
                <button
                  key={i}
                  onClick={() => onRunAIQuery(query)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/50 text-xs text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards (Prompt Section 6) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Indexed Experiments</div>
          <div className="text-3xl font-bold font-mono text-white mt-2 tabular-nums">
            1,240<span className="text-amber-400 text-2xl font-light">+</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">CIR, Saffire, BASS, SOFIE test logs</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Research Documents</div>
          <div className="text-3xl font-bold font-mono text-white mt-2 tabular-nums">
            480<span className="text-blue-400 text-2xl font-light">+</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">NASA TMs, AIAA, and peer-reviewed journals</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Materials Studied</div>
          <div className="text-3xl font-bold font-mono text-white mt-2 tabular-nums">
            380<span className="text-emerald-400 text-2xl font-light">+</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Polymers, fabrics, composites, fuels</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Microgravity Tests</div>
          <div className="text-3xl font-bold font-mono text-white mt-2 tabular-nums">
            720<span className="text-purple-400 text-2xl font-light">+</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Orbital, drop tower, & parabolic flights</div>
        </div>
      </div>

      {/* Research Activity Interactive Line Chart (Prompt Section 6) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Research Activity</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">HISTORICAL EXPERIMENTS PUBLISHED BY YEAR (1996 - 2026)</p>
          </div>

          {/* Activity Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActivityFilter(opt.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activityFilter === opt.id
                    ? 'bg-slate-800 text-white shadow-xs border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RESEARCH_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis 
                dataKey="year" 
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                tickMargin={8} 
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={12} 
                tickLine={false} 
                tickMargin={8} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderColor: '#334155', 
                  borderRadius: '0.75rem',
                  color: '#F8FAFC',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace'
                }}
                itemStyle={{ color: '#38BDF8' }}
              />
              <Area 
                type="monotone" 
                dataKey={activityFilter} 
                stroke={activeColor} 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorActivity)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span className="font-mono">Noticeable acceleration post-2016 driven by Cygnus Saffire and CIR SOFIE programs</span>
          <button 
            onClick={() => onNavigate('analytics')} 
            className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Open Advanced Fire Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured Research Highlights Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-display">Critical Grounded Experiments</h3>
          <button 
            onClick={() => onNavigate('experiments')}
            className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
          >
            <span>View All Experiments</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EXPERIMENTS_DATA.slice(0, 3).map((exp) => (
            <div 
              key={exp.id}
              onClick={() => onSelectExperiment(exp)}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="text-amber-400 font-semibold">{exp.id}</span>
                  <span>{exp.mission.split(' ')[0]}</span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                  {exp.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {exp.observations}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{exp.material.split(' ')[0]}</span>
                <span className="text-emerald-400">{exp.oxygenPercent}% O₂</span>
                <span className="group-hover:translate-x-0.5 transition-transform text-slate-300">View Data →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
