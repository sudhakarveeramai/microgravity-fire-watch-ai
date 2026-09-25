import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Flame,
  Download,
  RotateCcw
} from 'lucide-react';
import { Experiment, MaterialCategory, GravityCondition } from '../types';
import { EXPERIMENTS_DATA } from '../data/mockExperiments';

interface ExperimentExplorerProps {
  onSelectExperiment: (exp: Experiment) => void;
  onCompareWith?: (exp: Experiment) => void;
}

type SortField = 'id' | 'year' | 'flameSpreadMmS' | 'oxygenPercent' | 'evidenceCoverageScore';

export const ExperimentExplorer: React.FC<ExperimentExplorerProps> = ({
  onSelectExperiment,
  onCompareWith
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState<string>('all');
  const [selectedGravity, setSelectedGravity] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedOxygenRange, setSelectedOxygenRange] = useState<string>('all');
  const [selectedFlameType, setSelectedFlameType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtered & sorted records
  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS_DATA.filter((exp) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesQuery = 
          exp.id.toLowerCase().includes(query) ||
          exp.codeName.toLowerCase().includes(query) ||
          exp.title.toLowerCase().includes(query) ||
          exp.material.toLowerCase().includes(query) ||
          exp.findings.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Mission filter
      if (selectedMission !== 'all') {
        if (!exp.mission.includes(selectedMission)) return false;
      }

      // Gravity filter
      if (selectedGravity !== 'all') {
        if (!exp.gravity.includes(selectedGravity)) return false;
      }

      // Material filter
      if (selectedMaterial !== 'all') {
        if (exp.materialCategory !== selectedMaterial) return false;
      }

      // Oxygen filter
      if (selectedOxygenRange === 'standard') {
        if (exp.oxygenPercent > 21.5) return false;
      } else if (selectedOxygenRange === 'elevated') {
        if (exp.oxygenPercent <= 21.5) return false;
      }

      // Flame type filter
      if (selectedFlameType !== 'all') {
        if (!exp.flameType.includes(selectedFlameType)) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'year') comparison = a.year - b.year;
      else if (sortField === 'flameSpreadMmS') comparison = a.flameSpreadMmS - b.flameSpreadMmS;
      else if (sortField === 'oxygenPercent') comparison = a.oxygenPercent - b.oxygenPercent;
      else if (sortField === 'evidenceCoverageScore') comparison = a.evidenceCoverageScore - b.evidenceCoverageScore;
      else comparison = a.id.localeCompare(b.id);

      return sortAsc ? comparison : -comparison;
    });
  }, [
    searchTerm, 
    selectedMission, 
    selectedGravity, 
    selectedMaterial, 
    selectedOxygenRange, 
    selectedFlameType, 
    sortField, 
    sortAsc
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedMission('all');
    setSelectedGravity('all');
    setSelectedMaterial('all');
    setSelectedOxygenRange('all');
    setSelectedFlameType('all');
    setSortField('year');
    setSortAsc(false);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>DATABASE EXPLORER</span>
            <span className="text-slate-600">·</span>
            <span>STRUCTURED MICROGRAVITY CORPUS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Experiment Explorer
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Query experimental parameters, flame dynamics, and evidence records indexed across orbital and partial-gravity tests.
          </p>
        </div>

        {/* Prototype disclosure pill */}
        <div className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-600/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 self-start md:self-auto">
          <Info className="w-3.5 h-3.5" />
          <span>Prototype Dataset: Showing 12 curated benchmark missions</span>
        </div>
      </div>

      {/* Filter and Search Bar Ribbon */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search experiments by ID, material (PMMA, Nomex, CFRP), mission, or findings..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors font-mono"
            />
          </div>

          {/* Quick Clear Button */}
          {(searchTerm || selectedMission !== 'all' || selectedGravity !== 'all' || selectedMaterial !== 'all' || selectedOxygenRange !== 'all' || selectedFlameType !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Mission */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">MISSION</label>
            <select
              value={selectedMission}
              onChange={(e) => setSelectedMission(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="all">All Missions</option>
              <option value="ISS">ISS (CIR/MSG)</option>
              <option value="Cygnus">Cygnus (Saffire)</option>
              <option value="Parabolic">Parabolic Flight</option>
              <option value="Drop Tower">Zero-G Drop Tower</option>
            </select>
          </div>

          {/* Gravity */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">GRAVITY REGIME</label>
            <select
              value={selectedGravity}
              onChange={(e) => setSelectedGravity(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="all">All Gravities</option>
              <option value="Microgravity">Microgravity (0g)</option>
              <option value="Lunar">Lunar (0.166g)</option>
              <option value="Martian">Martian (0.38g)</option>
            </select>
          </div>

          {/* Material Category */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">MATERIAL</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="all">All Materials</option>
              <option value="Polymer">Polymer (PMMA, PEEK)</option>
              <option value="Fabric / Textile">Fabric / Textile (Nomex)</option>
              <option value="Composite">Composite (CFRP)</option>
              <option value="Liquid Hydrocarbon">Hydrocarbon Fuels</option>
              <option value="Biomass / Cellulose">Cellulose</option>
            </select>
          </div>

          {/* Oxygen Level */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">OXYGEN FRACTION</label>
            <select
              value={selectedOxygenRange}
              onChange={(e) => setSelectedOxygenRange(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="all">All Oxygen Concentrations</option>
              <option value="standard">Standard Cabin (21% O₂)</option>
              <option value="elevated">Exploration Atmos (≥ 25% O₂)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 mb-1">SORT ORDER</label>
            <div className="flex gap-1">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-400 font-mono"
              >
                <option value="year">Date (Year)</option>
                <option value="flameSpreadMmS">Flame Spread Rate</option>
                <option value="oxygenPercent">Oxygen %</option>
                <option value="evidenceCoverageScore">Evidence Coverage</option>
                <option value="id">Experiment ID</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title={sortAsc ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <span>SHOWING {filteredExperiments.length} OF {EXPERIMENTS_DATA.length} MATCHING EXPERIMENTS</span>
        <span>CLICK ANY ROW FOR DEEP EVIDENCE DOSSIER</span>
      </div>

      {/* Comprehensive Experiment Data Table (Prompt Specified Columns) */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Experiment</th>
                <th className="py-3 px-3">Year</th>
                <th className="py-3 px-3">Mission</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-3">Gravity</th>
                <th className="py-3 px-3">O₂</th>
                <th className="py-3 px-3">Pressure</th>
                <th className="py-3 px-3">Flame Type</th>
                <th className="py-3 px-3">Result</th>
                <th className="py-3 px-4 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredExperiments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 font-mono">
                    No experiments match the selected criteria. Try adjusting the search or filters.
                  </td>
                </tr>
              ) : (
                filteredExperiments.map((exp) => (
                  <tr 
                    key={exp.id}
                    onClick={() => onSelectExperiment(exp)}
                    className="hover:bg-slate-900/80 transition-colors cursor-pointer group"
                  >
                    {/* Experiment ID & Code */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{exp.id}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px] font-sans">
                        {exp.codeName}
                      </div>
                    </td>

                    {/* Year */}
                    <td className="py-3.5 px-3 font-mono text-slate-300 tabular-nums">
                      {exp.year}
                    </td>

                    {/* Mission */}
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      <span className="truncate block max-w-[110px]" title={exp.mission}>
                        {exp.mission.split(' ')[0]}
                      </span>
                    </td>

                    {/* Material */}
                    <td className="py-3.5 px-4 text-slate-200">
                      <div className="font-medium truncate max-w-[150px]" title={exp.material}>
                        {exp.material}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        {exp.materialCategory}
                      </div>
                    </td>

                    {/* Gravity */}
                    <td className="py-3.5 px-3 font-mono">
                      <span className={
                        exp.gravity.includes('Microgravity') ? 'text-purple-300' :
                        exp.gravity.includes('Lunar') ? 'text-cyan-300' : 'text-amber-300'
                      }>
                        {exp.gravity.split(' ')[0]}
                      </span>
                    </td>

                    {/* O2 */}
                    <td className="py-3.5 px-3 font-mono tabular-nums">
                      <span className={exp.oxygenPercent > 21 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                        {exp.oxygenPercent}%
                      </span>
                    </td>

                    {/* Pressure */}
                    <td className="py-3.5 px-3 font-mono text-slate-300 tabular-nums">
                      {exp.pressureAtm} atm
                    </td>

                    {/* Flame Type */}
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      <span className="truncate block max-w-[110px]" title={exp.flameType}>
                        {exp.flameType}
                      </span>
                    </td>

                    {/* Result */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        exp.empiricalResult === 'Self-Sustained Steady' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
                        exp.empiricalResult === 'Rapid Acceleration' ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' :
                        'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                      }`}>
                        {exp.empiricalResult}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectExperiment(exp);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
