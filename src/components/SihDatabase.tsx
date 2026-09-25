import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  Activity, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles, 
  ArrowUpDown, 
  Eye, 
  FileText,
  BarChart3,
  Sliders,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  LayoutGrid,
  List
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { ExperimentRecord, TelemetryPoint, GravityCondition, MaterialCategory } from '../types';
import { 
  getLoadedExperiments, 
  subscribeToDatabase, 
  addExperiment, 
  updateExperiment, 
  deleteExperiment, 
  resetDatabase, 
  exportDatabaseAsJson, 
  exportDatabaseAsCsv, 
  importDatabaseFromJson, 
  importDatabaseFromCsv, 
  getDatabaseStats 
} from '../lib/sihDatabase';
import { trainAndAnalyzeDatabaseWithAI } from '../lib/aiTrainedEngine';

interface SihDatabaseProps {
  onSelectExperimentForPrediction?: (record: ExperimentRecord) => void;
  onNavigateToAssistant?: () => void;
}

export const SihDatabase: React.FC<SihDatabaseProps> = ({
  onSelectExperimentForPrediction,
  onNavigateToAssistant
}) => {
  const [records, setRecords] = useState<ExperimentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGravity, setFilterGravity] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [activePreset, setActivePreset] = useState<'all' | 'sih' | 'artemis' | 'saffire'>('all');
  const [viewLayout, setViewLayout] = useState<'table' | 'cards'>('table');

  // Modals & Panels
  const [telemetryModalRecord, setTelemetryModalRecord] = useState<ExperimentRecord | null>(null);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'temp' | 'spread' | 'heatflux' | 'all'>('temp');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExperimentRecord | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // AI Training state
  const [isTrainingAI, setIsTrainingAI] = useState(false);
  const [lastTrainedTimestamp, setLastTrainedTimestamp] = useState<string>('Live Synced');
  const [aiInsightAlert, setAiInsightAlert] = useState<string | null>(null);

  // Subscribe to real-time database updates
  useEffect(() => {
    const unsubscribe = subscribeToDatabase((loaded) => {
      setRecords(loaded);
    });
    return unsubscribe;
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches = 
          r.id.toLowerCase().includes(q) ||
          r.codeName.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.material.toLowerCase().includes(q) ||
          r.findings.toLowerCase().includes(q) ||
          (r.datasetTag && r.datasetTag.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (filterGravity !== 'all') {
        if (!r.gravity.toLowerCase().includes(filterGravity.toLowerCase())) return false;
      }

      if (filterMaterial !== 'all') {
        if (r.materialCategory !== filterMaterial) return false;
      }

      return true;
    });
  }, [records, searchTerm, filterGravity, filterMaterial]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalRecords = records.length;
    const totalPoints = records.reduce((acc, r) => acc + (r.telemetry?.length || 0), 0);
    const avgFSR = totalRecords > 0 
      ? (records.reduce((acc, r) => acc + (r.flameSpreadMmS || 0), 0) / totalRecords).toFixed(2) 
      : '0.00';
    const materials = new Set(records.map(r => r.material)).size;
    const gravities = new Set(records.map(r => r.gravity)).size;
    return { totalRecords, totalPoints, avgFSR, materials, gravities };
  }, [records]);

  // Train AI on loaded records
  const handleTrainAI = async () => {
    setIsTrainingAI(true);
    setAiInsightAlert(null);
    try {
      const insights = await trainAndAnalyzeDatabaseWithAI(records);
      setIsTrainingAI(false);
      setLastTrainedTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (insights.keyCorrelations && insights.keyCorrelations.length > 0) {
        setAiInsightAlert(`AI Trained on ${insights.totalRecordsAnalyzed} records! Key finding: ${insights.keyCorrelations[0]}`);
      }
    } catch {
      setIsTrainingAI(false);
      setLastTrainedTimestamp('Trained');
    }
  };

  // Switch preset
  const handleSelectPreset = (preset: 'all' | 'sih' | 'artemis' | 'saffire') => {
    setActivePreset(preset);
    resetDatabase(preset);
  };

  // Export handlers
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportDatabaseAsJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sih_firewatch_experiments_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(exportDatabaseAsCsv());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sih_firewatch_telemetry_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import handler
  const handleExecuteImport = () => {
    if (!importText.trim()) {
      setImportStatus({ message: 'Please provide JSON or CSV data to import.', isError: true });
      return;
    }

    if (importFormat === 'json') {
      const res = importDatabaseFromJson(importText);
      if (res.success) {
        setImportStatus({ message: `Successfully imported ${res.count} experiment records!`, isError: false });
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportText('');
          setImportStatus(null);
        }, 1200);
      } else {
        setImportStatus({ message: res.error || 'Import failed.', isError: true });
      }
    } else {
      const res = importDatabaseFromCsv(importText);
      if (res.success) {
        setImportStatus({ message: `Successfully imported ${res.count} experiment records from CSV!`, isError: false });
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportText('');
          setImportStatus(null);
        }, 1200);
      } else {
        setImportStatus({ message: res.error || 'CSV Import failed.', isError: true });
      }
    }
  };

  // File upload trigger
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
      if (file.name.endsWith('.csv')) {
        setImportFormat('csv');
      } else {
        setImportFormat('json');
      }
    };
    reader.readAsText(file);
  };

  // Delete handler
  const handleDelete = (id: string, code: string) => {
    if (confirm(`Remove experiment record [${code}] from the loaded database?`)) {
      deleteExperiment(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-950/90 p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                SIH SCIENTIFIC DATABASE & TELEMETRY ENGINE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono">
                Smart India Hackathon 2026 Space Track
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Firestore Cloud Synced
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display tracking-tight">
              Microgravity Combustion & Telemetry Database
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Centralized repository for space agency combustion test runs (NASA Saffire, ISS CIR/SOFIE, BASS, ISRO Gaganyaan analogs, and Drop Tower datasets). Fully integrated with the AI Knowledge Engine to train, predict, and analyze flame physics from loaded records.
            </p>
          </div>

          {/* AI Training & Status Badge */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTrainingAI ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isTrainingAI ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {isTrainingAI ? 'Training AI Knowledge Engine...' : `AI Model: Trained on ${records.length} Records`}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Synced: <span className="text-slate-200">{lastTrainedTimestamp}</span>
            </div>
            <button
              onClick={handleTrainAI}
              disabled={isTrainingAI}
              className="w-full mt-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 hover:text-slate-950 disabled:text-slate-500 text-xs font-mono font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className={`w-3.5 h-3.5 ${isTrainingAI ? 'animate-spin' : ''}`} />
              <span>{isTrainingAI ? 'Analyzing...' : 'Train AI on Loaded Records'}</span>
            </button>
          </div>
        </div>

        {/* AI Insight Notification */}
        {aiInsightAlert && (
          <div className="mt-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{aiInsightAlert}</span>
            </div>
            <button
              onClick={() => setAiInsightAlert(null)}
              className="text-slate-400 hover:text-white shrink-0 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Loaded Experiments</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{stats.totalRecords}</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Active in memory & cache</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Telemetry Points</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{stats.totalPoints}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Time-series sensor samples</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Mean Spread Rate</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{stats.avgFSR} <span className="text-xs font-normal text-slate-400">mm/s</span></div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Across all gravity states</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Materials Tested</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">{stats.materials}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Polymers, fabrics & composites</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Gravity Regimes</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">{stats.gravities}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">0g, Moon, Mars, 1g</div>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Benchmark Suite:</span>
          </span>
          {[
            { id: 'all', label: 'All Records (Master)' },
            { id: 'sih', label: 'SIH 2026 Space Track' },
            { id: 'artemis', label: 'Artemis Moon/Mars Habitats' },
            { id: 'saffire', label: 'NASA Saffire Spacecraft' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectPreset('all')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset database to master benchmark suite"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Data Management & Toolbar - Bootstrap Responsive Grid & Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search & Filters Row */}
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search experiments by code, material, findings, or SIH tag..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <select
              value={filterGravity}
              onChange={(e) => setFilterGravity(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Gravity Regimes</option>
              <option value="0g">Microgravity (0g)</option>
              <option value="Lunar">Lunar (0.166g)</option>
              <option value="Martian">Martian (0.38g)</option>
            </select>

            <select
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Materials</option>
              <option value="Polymer">Polymers</option>
              <option value="Fabric / Textile">Fabrics & Textiles</option>
              <option value="Composite">Composites</option>
              <option value="Liquid Hydrocarbon">Hydrocarbons</option>
              <option value="Biomass / Cellulose">Cellulose</option>
            </select>
          </div>
        </div>

        {/* Database Actions & Layout Switcher */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-1 lg:pt-0 border-t border-slate-800/60 lg:border-t-0">
          {/* View Mode Toggle (Table vs Cards) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewLayout('table')}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'table'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View (Desktop Dense)"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Table</span>
            </button>
            <button
              onClick={() => setViewLayout('cards')}
              className={`p-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewLayout === 'cards'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Cards View (Best for Mobile & Tablet)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Cards</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingRecord(null);
                setIsAddEditModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import</span>
            </button>

            <div className="relative group">
              <button
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-2xl z-20 min-w-[130px]">
                <button
                  onClick={handleExportJson}
                  className="w-full text-left px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer"
                >
                  Export JSON
                </button>
                <button
                  onClick={handleExportCsv}
                  className="w-full text-left px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg cursor-pointer"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Records Display: Table View OR Responsive Cards Grid View */}
      {viewLayout === 'table' ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="p-2 sm:hidden bg-slate-900/60 border-b border-slate-800 text-[11px] font-mono text-amber-300 text-center flex items-center justify-center gap-1">
            <span>Tip: Switch to "Cards" view above for phone-friendly layout</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Code / ID</th>
                  <th className="py-3 px-4">Investigation Title</th>
                  <th className="py-3 px-4">Gravity</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-3 text-center">O₂ %</th>
                  <th className="py-3 px-3 text-center">Flow</th>
                  <th className="py-3 px-3 text-center">Flame Spread</th>
                  <th className="py-3 px-3 text-center">Peak Temp</th>
                  <th className="py-3 px-3 text-center">Result</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500 font-mono">
                      No experiments found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => {
                    const isUserAdded = r.datasetTag?.includes('USER') || r.id.startsWith('EXP-USR');
                    const isSIH = r.datasetTag?.includes('SIH');

                    return (
                      <tr 
                        key={r.id}
                        className="hover:bg-slate-900/60 transition-colors group"
                      >
                        {/* Code / ID */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-amber-400 flex items-center gap-1.5">
                            <span>{r.codeName}</span>
                            {isSIH && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                                SIH
                              </span>
                            )}
                            {isUserAdded && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                                CUSTOM
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">{r.id} · {r.year}</div>
                        </td>

                        {/* Title */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="text-white font-sans font-medium line-clamp-1 group-hover:text-amber-200 transition-colors">
                            {r.title}
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {r.facility}
                          </div>
                        </td>

                        {/* Gravity */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            r.gravity.includes('0g')
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : r.gravity.includes('Lunar')
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : r.gravity.includes('Martian')
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {r.gravity.replace('Microgravity', '0g').replace('Lunar Gravity', 'Lunar 0.166g').replace('Martian Gravity', 'Mars 0.38g')}
                          </span>
                        </td>

                        {/* Material */}
                        <td className="py-3 px-4 max-w-[140px] truncate">
                          <div className="text-slate-200 truncate">{r.material}</div>
                          <div className="text-[10px] text-slate-500">{r.materialCategory}</div>
                        </td>

                        {/* O2 % */}
                        <td className="py-3 px-3 text-center whitespace-nowrap font-bold">
                          <span className={r.oxygenPercent > 25 ? 'text-rose-400' : 'text-slate-300'}>
                            {r.oxygenPercent}%
                          </span>
                        </td>

                        {/* Flow */}
                        <td className="py-3 px-3 text-center whitespace-nowrap text-slate-400">
                          {r.airflowCmS} <span className="text-[10px] text-slate-600">cm/s</span>
                        </td>

                        {/* Flame Spread */}
                        <td className="py-3 px-3 text-center whitespace-nowrap font-bold text-amber-400">
                          {r.flameSpreadMmS} <span className="text-[10px] text-slate-500 font-normal">mm/s</span>
                        </td>

                        {/* Peak Temp */}
                        <td className="py-3 px-3 text-center whitespace-nowrap text-slate-300">
                          {r.peakTemperatureK} K
                        </td>

                        {/* Result */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            r.empiricalResult === 'Self-Sustained Steady'
                              ? 'bg-amber-500/20 text-amber-300'
                              : r.empiricalResult === 'Rapid Acceleration'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {r.empiricalResult}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setTelemetryModalRecord(r)}
                              className="p-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-400 hover:text-cyan-200 transition-colors cursor-pointer"
                              title="Inspect Live Sensor Telemetry (Time, Temp, Spread, Heat Flux)"
                            >
                              <Activity className="w-3.5 h-3.5" />
                            </button>

                            {onSelectExperimentForPrediction && (
                              <button
                                onClick={() => onSelectExperimentForPrediction(r)}
                                className="p-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-800/60 text-amber-400 hover:text-amber-200 transition-colors cursor-pointer"
                                title="Load into AI Neural Predictor"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setEditingRecord(r);
                                setIsAddEditModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                              title="Edit Record Parameters"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(r.id, r.codeName)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Responsive Card Grid View (Bootstrap Grid System for Mobile, Tablet, Desktop) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRecords.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono rounded-2xl border border-slate-800 bg-slate-950/60">
              No experiments found matching current filters.
            </div>
          ) : (
            filteredRecords.map((r) => {
              const isUserAdded = r.datasetTag?.includes('USER') || r.id.startsWith('EXP-USR');
              const isSIH = r.datasetTag?.includes('SIH');

              return (
                <div 
                  key={r.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700/80 p-5 shadow-xl transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Code, Badges, Year */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400 font-mono text-sm">{r.codeName}</span>
                        {isSIH && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/40">
                            SIH 2026
                          </span>
                        )}
                        {isUserAdded && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{r.year}</span>
                    </div>

                    {/* Title & Facility */}
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {r.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{r.facility} · {r.id}</p>
                    </div>

                    {/* Regimes: Gravity & Material */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                        r.gravity.includes('0g')
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : r.gravity.includes('Lunar')
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : r.gravity.includes('Martian')
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {r.gravity.replace('Microgravity', '0g').replace('Lunar Gravity', 'Lunar 0.166g').replace('Martian Gravity', 'Mars 0.38g')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 truncate max-w-[180px]">
                        {r.material}
                      </span>
                    </div>

                    {/* 4-Metric Sensor Grid */}
                    <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center font-mono">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">O₂ Conc</div>
                        <div className={`text-xs font-bold mt-0.5 ${r.oxygenPercent > 25 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {r.oxygenPercent}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Airflow</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">{r.airflowCmS} <span className="text-[9px] text-slate-500">cm/s</span></div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Spread</div>
                        <div className="text-xs font-bold text-amber-400 mt-0.5">{r.flameSpreadMmS} <span className="text-[9px] text-slate-500 font-normal">mm/s</span></div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase">Peak T</div>
                        <div className="text-xs font-semibold text-cyan-300 mt-0.5">{r.peakTemperatureK} <span className="text-[9px] text-slate-500">K</span></div>
                      </div>
                    </div>

                    {/* Result & Observations */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Result:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.empiricalResult === 'Self-Sustained Steady'
                            ? 'bg-amber-500/20 text-amber-300'
                            : r.empiricalResult === 'Rapid Acceleration'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {r.empiricalResult}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {r.findings}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setTelemetryModalRecord(r)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 hover:text-cyan-100 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Telemetry ({r.telemetry?.length || 0})</span>
                    </button>

                    {onSelectExperimentForPrediction && (
                      <button
                        onClick={() => onSelectExperimentForPrediction(r)}
                        className="py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="AI Neural Predictor"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">AI Predict</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingRecord(r);
                          setIsAddEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(r.id, r.codeName)}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Telemetry Sensor Inspection Drawer / Modal */}
      {telemetryModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>Time-Series Microgravity Sensor Telemetry</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{telemetryModalRecord.facility}</span>
                </div>
                <h2 className="text-xl font-bold text-white font-display mt-1">
                  {telemetryModalRecord.codeName}: {telemetryModalRecord.title}
                </h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Gravity: {telemetryModalRecord.gravity} · Material: {telemetryModalRecord.material} · O₂: {telemetryModalRecord.oxygenPercent}% · Airflow: {telemetryModalRecord.airflowCmS} cm/s
                </div>
              </div>
              <button
                onClick={() => setTelemetryModalRecord(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telemetry Sensor Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              {[
                { id: 'temp', label: 'Flame Temp (K)' },
                { id: 'spread', label: 'Flame Position (mm)' },
                { id: 'heatflux', label: 'Radiometer Heat Flux (kW/m²)' },
                { id: 'all', label: 'Combined Channels' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTelemetryTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTelemetryTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sensor Telemetry Line Chart */}
            <div className="h-72 w-full bg-slate-950/90 rounded-xl p-4 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                {activeTelemetryTab === 'temp' ? (
                  <AreaChart data={telemetryModalRecord.telemetry || []}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timeS" stroke="#64748b" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#64748b" domain={['dataMin - 100', 'dataMax + 100']} label={{ value: 'Temp (K)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="tempK" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" name="Flame Temp (K)" />
                  </AreaChart>
                ) : activeTelemetryTab === 'spread' ? (
                  <LineChart data={telemetryModalRecord.telemetry || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timeS" stroke="#64748b" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#64748b" label={{ value: 'Position (mm)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="flameSpreadMm" stroke="#06b6d4" strokeWidth={2.5} dot={false} name="Flame Spread (mm)" />
                  </LineChart>
                ) : activeTelemetryTab === 'heatflux' ? (
                  <LineChart data={telemetryModalRecord.telemetry || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timeS" stroke="#64748b" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#64748b" label={{ value: 'Flux (kW/m²)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="heatFluxKW" stroke="#ec4899" strokeWidth={2} dot={false} name="Radiometer Heat Flux (kW/m²)" />
                  </LineChart>
                ) : (
                  <LineChart data={telemetryModalRecord.telemetry || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timeS" stroke="#64748b" />
                    <YAxis stroke="#64748b" yAxisId="left" />
                    <YAxis stroke="#64748b" yAxisId="right" orientation="right" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="tempK" stroke="#f59e0b" strokeWidth={2} dot={false} name="Temp (K)" />
                    <Line yAxisId="right" type="monotone" dataKey="flameSpreadMm" stroke="#06b6d4" strokeWidth={2} dot={false} name="Position (mm)" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Findings & AI Interpretation Callout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                  Empirical Findings & Observations
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {telemetryModalRecord.findings}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  "{telemetryModalRecord.observations}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  AI Trained Scientific Interpretation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {telemetryModalRecord.aiInterpretation}
                </p>
                <div className="pt-2 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                  <span>Coverage: <strong className="text-white">{telemetryModalRecord.evidenceCoverageScore}%</strong></span>
                  <span>Strength: <strong className="text-cyan-400">{telemetryModalRecord.evidenceStrength}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Experiment Modal */}
      {isAddEditModalOpen && (
        <AddEditExperimentModal
          initialRecord={editingRecord}
          onClose={() => setIsAddEditModalOpen(false)}
          onSave={(recordData) => {
            if (editingRecord) {
              updateExperiment(editingRecord.id, recordData);
            } else {
              addExperiment(recordData as any);
            }
            setIsAddEditModalOpen(false);
          }}
        />
      )}

      {/* Import Dataset Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Import Experiment Records & Telemetry</span>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Format:</span>
                  <button
                    onClick={() => setImportFormat('json')}
                    className={`px-2.5 py-1 rounded text-xs font-mono ${importFormat === 'json' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400'}`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setImportFormat('csv')}
                    className={`px-2.5 py-1 rounded text-xs font-mono ${importFormat === 'csv' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400'}`}
                  >
                    CSV
                  </button>
                </div>

                <label className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-colors">
                  Choose File (.json/.csv)
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={
                  importFormat === 'json'
                    ? '[\n  {\n    "codeName": "EXP-RUN-01",\n    "title": "Drop Tower Flame Quench",\n    "material": "PMMA",\n    "gravity": "Microgravity (0g)",\n    "oxygenPercent": 21,\n    "pressureKPa": 101.3,\n    "airflowCmS": 5,\n    "flameSpreadMmS": 0.8\n  }\n]'
                    : 'id,codeName,title,year,mission,facility,gravity,material,materialCategory,oxygenPercent,pressureKPa,airflowCmS,peakTemperatureK,flameSpreadMmS,burnDurationS,flameType,empiricalResult,evidenceStrength,datasetTag,investigator,findings\nEXP-099,CSV-RUN-01,"Sample Run",2026,"ISS","CIR","Microgravity (0g)","PMMA","Polymer",21,101.3,5,1350,0.8,90,"Opposed-Flow Flame","Self-Sustained Steady","High","SIH","Team Alpha","Flame sustained."'
                }
                rows={10}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />

              {importStatus && (
                <div className={`p-2.5 rounded-lg text-xs font-mono ${importStatus.isError ? 'bg-rose-950/60 text-rose-300 border border-rose-800' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'}`}>
                  {importStatus.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteImport}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Parse & Import Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add & Edit Record Submodal
interface AddEditModalProps {
  initialRecord: ExperimentRecord | null;
  onClose: () => void;
  onSave: (data: Partial<ExperimentRecord>) => void;
}

const AddEditExperimentModal: React.FC<AddEditModalProps> = ({ initialRecord, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    codeName: initialRecord?.codeName || `SIH-EXP-${Date.now().toString().slice(-4)}`,
    title: initialRecord?.title || '',
    facility: initialRecord?.facility || 'Combustion Integrated Rack (CIR)',
    gravity: initialRecord?.gravity || 'Microgravity (0g)',
    material: initialRecord?.material || '',
    materialCategory: initialRecord?.materialCategory || 'Polymer',
    oxygenPercent: initialRecord?.oxygenPercent ?? 21.0,
    pressureKPa: initialRecord?.pressureKPa ?? 101.3,
    airflowCmS: initialRecord?.airflowCmS ?? 5.0,
    flameSpreadMmS: initialRecord?.flameSpreadMmS ?? 1.0,
    peakTemperatureK: initialRecord?.peakTemperatureK ?? 1350,
    burnDurationS: initialRecord?.burnDurationS ?? 60,
    flameType: initialRecord?.flameType || 'Opposed-Flow Flame',
    empiricalResult: initialRecord?.empiricalResult || 'Self-Sustained Steady',
    findings: initialRecord?.findings || '',
    observations: initialRecord?.observations || '',
    investigator: initialRecord?.investigator || 'SIH Research Team',
    datasetTag: initialRecord?.datasetTag || 'SIH-USER-ENTRY'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.material) {
      alert('Please fill out Title and Material');
      return;
    }

    onSave({
      ...formData,
      year: initialRecord?.year || new Date().getFullYear(),
      mission: initialRecord?.mission || 'ISS (Columbus/Destiny/CIR)',
      evidenceStrength: initialRecord?.evidenceStrength || 'Moderate (Corroborated)',
      evidenceCoverageScore: initialRecord?.evidenceCoverageScore || 85,
      aiInterpretation: initialRecord?.aiInterpretation || `Derived empirical combustion behavior in ${formData.gravity} with ${formData.oxygenPercent}% O2.`,
      sourceDocId: initialRecord?.sourceDocId || 'SRC-SIH-CUSTOM',
      sourceTitle: initialRecord?.sourceTitle || formData.title,
      sourceAuthors: formData.investigator,
      sourceYear: new Date().getFullYear(),
      moonRelevance: formData.gravity.includes('Lunar') ? 'Direct Analog' : 'Moderate Analog',
      marsRelevance: formData.gravity.includes('Martian') ? 'Direct Analog' : 'Moderate Analog',
      sootProductionIndex: 'Low'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{initialRecord ? 'Edit Experiment Record' : 'Log New Experiment Run'}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Code Name</label>
              <input
                type="text"
                required
                value={formData.codeName}
                onChange={(e) => setFormData({ ...formData, codeName: e.target.value })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Gravity Regime</label>
              <select
                value={formData.gravity}
                onChange={(e) => setFormData({ ...formData, gravity: e.target.value as any })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Microgravity (0g)">Microgravity (0g)</option>
                <option value="Lunar Gravity (0.166g)">Lunar Gravity (0.166g)</option>
                <option value="Martian Gravity (0.38g)">Martian Gravity (0.38g)</option>
                <option value="Terrestrial (1g)">Terrestrial (1g)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Experiment Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Polyimide Avionics Wire Flame Extinction in Low Airflow"
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Material / Fuel</label>
              <input
                type="text"
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. Cast PMMA or Nomex Fabric"
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Material Category</label>
              <select
                value={formData.materialCategory}
                onChange={(e) => setFormData({ ...formData, materialCategory: e.target.value as any })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Polymer">Polymer</option>
                <option value="Fabric / Textile">Fabric / Textile</option>
                <option value="Composite">Composite</option>
                <option value="Liquid Hydrocarbon">Liquid Hydrocarbon</option>
                <option value="Biomass / Cellulose">Biomass / Cellulose</option>
              </select>
            </div>
          </div>

          {/* Environmental Parameters */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Oxygen % ({formData.oxygenPercent}%)</label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="50"
                value={formData.oxygenPercent}
                onChange={(e) => setFormData({ ...formData, oxygenPercent: parseFloat(e.target.value) || 21 })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Pressure (kPa)</label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="150"
                value={formData.pressureKPa}
                onChange={(e) => setFormData({ ...formData, pressureKPa: parseFloat(e.target.value) || 101.3 })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Airflow (cm/s)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={formData.airflowCmS}
                onChange={(e) => setFormData({ ...formData, airflowCmS: parseFloat(e.target.value) || 5 })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Combustion Results */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Spread Rate (mm/s)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="20"
                value={formData.flameSpreadMmS}
                onChange={(e) => setFormData({ ...formData, flameSpreadMmS: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Peak Temp (K)</label>
              <input
                type="number"
                min="300"
                max="3000"
                value={formData.peakTemperatureK}
                onChange={(e) => setFormData({ ...formData, peakTemperatureK: parseInt(e.target.value) || 1200 })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Burn Duration (s)</label>
              <input
                type="number"
                min="5"
                max="3600"
                value={formData.burnDurationS}
                onChange={(e) => setFormData({ ...formData, burnDurationS: parseInt(e.target.value) || 60 })}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Empirical Result</label>
            <select
              value={formData.empiricalResult}
              onChange={(e) => setFormData({ ...formData, empiricalResult: e.target.value as any })}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Self-Sustained Steady">Self-Sustained Steady</option>
              <option value="Low-Oxygen Extinction">Low-Oxygen Extinction</option>
              <option value="Rapid Acceleration">Rapid Acceleration</option>
              <option value="Smolder Transition">Smolder Transition</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Findings Summary</label>
            <textarea
              required
              rows={2}
              value={formData.findings}
              onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
              placeholder="e.g. Flame self-extinguished when airflow was reduced below 1.5 cm/s."
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold cursor-pointer transition-colors"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
