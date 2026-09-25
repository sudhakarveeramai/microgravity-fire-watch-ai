import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  Sliders, 
  Activity, 
  Wind, 
  Flame, 
  Gauge, 
  Layers, 
  Info,
  Maximize2
} from 'lucide-react';
import { EXPERIMENTS_DATA } from '../data/mockExperiments';
import { Experiment } from '../types';

interface FireAnalyticsProps {
  onSelectExperiment: (exp: Experiment) => void;
}

export const FireAnalytics: React.FC<FireAnalyticsProps> = ({ onSelectExperiment }) => {
  const [selectedGravity, setSelectedGravity] = useState<string>('all');
  const [selectedMaterialCat, setSelectedMaterialCat] = useState<string>('all');
  const [activeChartTab, setActiveChartTab] = useState<'o2_vs_spread' | 'airflow' | 'pressure' | 'materials' | 'gravity_regimes'>('o2_vs_spread');

  // Filtered dataset for charts
  const filteredData = useMemo(() => {
    return EXPERIMENTS_DATA.filter((exp) => {
      if (selectedGravity !== 'all' && !exp.gravity.includes(selectedGravity)) return false;
      if (selectedMaterialCat !== 'all' && exp.materialCategory !== selectedMaterialCat) return false;
      return true;
    });
  }, [selectedGravity, selectedMaterialCat]);

  // Scatter data: Oxygen vs Flame Spread
  const scatterO2Data = useMemo(() => {
    return filteredData.map((d) => ({
      id: d.id,
      name: d.codeName,
      material: d.material,
      x: d.oxygenPercent,
      y: d.flameSpreadMmS,
      z: d.airflowCmS,
      gravity: d.gravity,
      temp: d.peakTemperatureK,
      raw: d
    }));
  }, [filteredData]);

  // Airflow vs Spread
  const airflowData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.airflowCmS - b.airflowCmS).map((d) => ({
      name: d.codeName,
      airflow: d.airflowCmS,
      spread: d.flameSpreadMmS,
      material: d.material.split(' ')[0],
      raw: d
    }));
  }, [filteredData]);

  // Pressure vs Ignition Delay
  const pressureData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.pressureAtm - b.pressureAtm).map((d) => ({
      name: d.codeName,
      pressure: d.pressureKPa,
      ignition: d.ignitionTimeS,
      material: d.material.split(' ')[0],
      raw: d
    }));
  }, [filteredData]);

  // Material category flammability indices
  const materialAggregates = useMemo(() => {
    const categories = ['Polymer', 'Fabric / Textile', 'Composite', 'Liquid Hydrocarbon', 'Biomass / Cellulose'];
    return categories.map((cat) => {
      const items = EXPERIMENTS_DATA.filter((e) => e.materialCategory === cat);
      const avgSpread = items.reduce((acc, curr) => acc + curr.flameSpreadMmS, 0) / (items.length || 1);
      const avgIgnition = items.reduce((acc, curr) => acc + curr.ignitionTimeS, 0) / (items.length || 1);
      const avgTemp = items.reduce((acc, curr) => acc + curr.peakTemperatureK, 0) / (items.length || 1);
      return {
        category: cat.split('/')[0].trim(),
        avgSpread: Number(avgSpread.toFixed(2)),
        avgIgnition: Number(avgIgnition.toFixed(1)),
        avgTemp: Math.round(avgTemp),
        count: items.length
      };
    });
  }, []);

  // Gravity comparison data
  const gravityComparison = [
    { regime: '0G Microgravity', spreadRate: 1.12, buoyantVelocity: 0.0, sootIndex: 88, flameVolume: 195 },
    { regime: '0.166G Moon', spreadRate: 1.64, buoyantVelocity: 14.5, sootIndex: 65, flameVolume: 150 },
    { regime: '0.38G Mars', spreadRate: 1.95, buoyantVelocity: 26.2, sootIndex: 48, flameVolume: 125 },
    { regime: '1.0G Terrestrial', spreadRate: 2.45, buoyantVelocity: 68.0, sootIndex: 25, flameVolume: 100 }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>MULTIVARIATE CORRELATION MATRIX</span>
            <span className="text-slate-600">·</span>
            <span>MICROGRAVITY COMBUSTION KINETICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Understand the Variables That Shape Fire
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Correlate oxygen fraction, convective airflow, barometric pressure, and gravitational fields against flame spread, ignition delay, and soot generation.
          </p>
        </div>

        {/* Global Chart Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Gravity Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">GRAVITY:</span>
            <select
              value={selectedGravity}
              onChange={(e) => setSelectedGravity(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Gravities</option>
              <option value="Microgravity">0G Microgravity</option>
              <option value="Lunar">0.166G Moon</option>
              <option value="Martian">0.38G Mars</option>
            </select>
          </div>

          {/* Material Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-500">MATERIAL:</span>
            <select
              value={selectedMaterialCat}
              onChange={(e) => setSelectedMaterialCat(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Materials</option>
              <option value="Polymer">Polymer</option>
              <option value="Fabric / Textile">Fabric</option>
              <option value="Composite">Composite</option>
              <option value="Liquid Hydrocarbon">Hydrocarbon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Tabs for the 5 Prompt Charts */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/90 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveChartTab('o2_vs_spread')}
          className={`px-3.5 py-2 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
            activeChartTab === 'o2_vs_spread'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Oxygen vs Flame Spread
        </button>

        <button
          onClick={() => setActiveChartTab('airflow')}
          className={`px-3.5 py-2 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
            activeChartTab === 'airflow'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Airflow vs Flame Spread
        </button>

        <button
          onClick={() => setActiveChartTab('pressure')}
          className={`px-3.5 py-2 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
            activeChartTab === 'pressure'
              ? 'bg-purple-600 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Pressure vs Ignition Delay
        </button>

        <button
          onClick={() => setActiveChartTab('materials')}
          className={`px-3.5 py-2 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
            activeChartTab === 'materials'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Material Classification
        </button>

        <button
          onClick={() => setActiveChartTab('gravity_regimes')}
          className={`px-3.5 py-2 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
            activeChartTab === 'gravity_regimes'
              ? 'bg-cyan-600 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          5. Earth vs Microgravity
        </button>
      </div>

      {/* Main Chart Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        {/* Chart 1: Oxygen Concentration vs Flame Spread */}
        {activeChartTab === 'o2_vs_spread' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Chart 1: Oxygen Concentration vs Flame Spread Rate
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  X-AXIS: OXYGEN % · Y-AXIS: FLAME SPREAD (mm/s) · POINT RADIUS: AIRFLOW (cm/s)
                </p>
              </div>
              <div className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded">
                Exploration Atmospheres (≥ 30% O₂) show 2.2x flame velocity
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Oxygen" 
                    unit="%" 
                    domain={[18, 36]} 
                    stroke="#64748B" 
                    fontSize={12} 
                    label={{ value: 'Atmospheric Oxygen Concentration (%)', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Spread" 
                    unit=" mm/s" 
                    domain={[0, 3.5]} 
                    stroke="#64748B" 
                    fontSize={12} 
                    label={{ value: 'Flame Spread Rate (mm/s)', angle: -90, position: 'insideLeft', offset: 0, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 240]} name="Airflow" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-xl text-xs font-mono text-slate-200 space-y-1">
                          <div className="font-bold text-amber-400">{data.name} ({data.id})</div>
                          <div className="text-slate-300 font-sans">{data.material}</div>
                          <div className="text-slate-400">O₂: <span className="text-white font-semibold">{data.x}%</span></div>
                          <div className="text-slate-400">Spread: <span className="text-white font-semibold">{data.y} mm/s</span></div>
                          <div className="text-slate-400">Airflow: <span className="text-white font-semibold">{data.z} cm/s</span></div>
                          <div className="text-slate-400">Gravity: <span className="text-purple-300">{data.gravity}</span></div>
                          <div className="text-[10px] text-amber-300/80 pt-1">Click to view experiment dossier</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter 
                    data={scatterO2Data} 
                    fill="#FF7A18" 
                    onClick={(entry: any) => onSelectExperiment(entry.raw || entry)}
                    className="cursor-pointer"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Airflow vs Flame Behavior */}
        {activeChartTab === 'airflow' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Chart 2: Airflow Velocity vs Flame Spread Velocity
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  X-AXIS: FORCED CONVECTIVE AIRFLOW (cm/s) · Y-AXIS: FLAME SPREAD (mm/s)
                </p>
              </div>
              <div className="text-xs font-mono text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2.5 py-1 rounded">
                Stagnant flows (&lt; 2 cm/s) induce radiative suffocation
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={airflowData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis 
                    dataKey="airflow" 
                    stroke="#64748B" 
                    fontSize={12} 
                    label={{ value: 'Airflow Convective Velocity (cm/s)', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={12} 
                    label={{ value: 'Spread Rate (mm/s)', angle: -90, position: 'insideLeft', offset: 0, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B132B', 
                      borderColor: '#334155', 
                      borderRadius: '0.75rem',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spread" 
                    stroke="#3B82F6" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#60A5FA', r: 5 }} 
                    activeDot={{ r: 8, stroke: '#FFFFFF', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 3: Pressure vs Ignition Time */}
        {activeChartTab === 'pressure' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Chart 3: Barometric Pressure vs Ignition Delay
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                EFFECT OF SUB-ATMOSPHERIC EXPLORATION PRESSURES (56 kPa - 101 kPa)
              </p>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis 
                    type="number" 
                    dataKey="pressure" 
                    name="Pressure" 
                    unit=" kPa" 
                    domain={[50, 105]} 
                    stroke="#64748B" 
                    fontSize={12} 
                    label={{ value: 'Barometric Pressure (kPa)', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="ignition" 
                    name="Ignition Delay" 
                    unit=" s" 
                    domain={[0, 20]} 
                    stroke="#64748B" 
                    fontSize={12} 
                    label={{ value: 'Ignition Delay (seconds)', angle: -90, position: 'insideLeft', offset: 0, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono space-y-1">
                          <div className="font-bold text-purple-400">{d.name}</div>
                          <div>Material: {d.material}</div>
                          <div>Pressure: {d.pressure} kPa</div>
                          <div>Ignition Delay: {d.ignition} s</div>
                        </div>
                      );
                    }}
                  />
                  <Scatter 
                    data={pressureData} 
                    fill="#A855F7" 
                    onClick={(entry: any) => onSelectExperiment(entry.raw || entry)}
                    className="cursor-pointer"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 4: Material Classification */}
        {activeChartTab === 'materials' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Chart 4: Material Type vs Mean Flame Spread & Ignition Delay
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                CROSS-CATEGORY COMPARISON: THERMOPLASTICS, COMPOSITES, ARAMIDS, CELLULOSE
              </p>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialAggregates} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="category" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B132B', 
                      borderColor: '#334155', 
                      borderRadius: '0.75rem',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="avgSpread" name="Avg Spread Rate (mm/s)" fill="#FF7A18" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgIgnition" name="Avg Ignition Delay (s)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 5: Earth Gravity vs Microgravity */}
        {activeChartTab === 'gravity_regimes' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Chart 5: Earth Gravity vs Microgravity & Planetary Regimes
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  SCALING OF BUOYANT VELOCITY (cm/s) AND SOOT CONFINEMENT ACCROSS G-LEVELS
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded">
                Microgravity flame volume expands ~2x due to zero buoyant confinement
              </div>
            </div>

            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gravityComparison} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="regime" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B132B', 
                      borderColor: '#334155', 
                      borderRadius: '0.75rem',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Bar dataKey="buoyantVelocity" name="Buoyant Draft Velocity (cm/s)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sootIndex" name="Soot Agglomeration Index" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="flameVolume" name="Relative Flame Volume (% of 1G)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
