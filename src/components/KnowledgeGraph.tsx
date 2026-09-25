import React, { useState, useMemo } from 'react';
import { 
  GitFork, 
  Layers, 
  Sparkles, 
  Search, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Maximize2,
  Filter
} from 'lucide-react';
import { KNOWLEDGE_GRAPH_NODES, KNOWLEDGE_GRAPH_LINKS, EXPERIMENTS_DATA } from '../data/mockExperiments';
import { KnowledgeNode, Experiment } from '../types';

interface KnowledgeGraphProps {
  onSelectExperiment: (exp: Experiment) => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onSelectExperiment }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('EXP-001');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Position nodes radially or in layered clusters for a clean aerospace topology
  const nodeCoordinates = useMemo(() => {
    const coords: Record<string, { x: number; y: number }> = {
      // Center & Hub Experiments
      'EXP-001': { x: 380, y: 220 },
      'EXP-002': { x: 500, y: 310 },
      'EXP-003': { x: 280, y: 350 },
      'EXP-004': { x: 620, y: 200 },
      'EXP-005': { x: 240, y: 180 },
      'EXP-008': { x: 440, y: 440 },
      'EXP-012': { x: 680, y: 360 },

      // Materials (Top & Left)
      'MAT-PMMA': { x: 460, y: 110 },
      'MAT-NOMEX': { x: 180, y: 300 },
      'MAT-CFRP': { x: 740, y: 150 },
      'MAT-FABRIC': { x: 300, y: 100 },
      'MAT-HYDRO': { x: 340, y: 490 },

      // Gravities (Upper right & lower)
      'GRAV-0G': { x: 440, y: 260 },
      'GRAV-LUNAR': { x: 160, y: 140 },
      'GRAV-MARS': { x: 780, y: 260 },

      // Oxygen levels
      'O2-21': { x: 320, y: 280 },
      'O2-30': { x: 620, y: 280 },

      // Phenomena
      'PHEN-DIFFUSION': { x: 580, y: 130 },
      'PHEN-COOLFLAME': { x: 540, y: 480 },
      'PHEN-QUENCH': { x: 200, y: 420 },
      'PHEN-SOOT': { x: 580, y: 410 }
    };
    return coords;
  }, []);

  const selectedNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === selectedNodeId) || KNOWLEDGE_GRAPH_NODES[0];

  // Connected links and neighbor nodes
  const connectedLinks = useMemo(() => {
    return KNOWLEDGE_GRAPH_LINKS.filter(
      (l) => l.source === selectedNodeId || l.target === selectedNodeId
    );
  }, [selectedNodeId]);

  const neighborNodeIds = useMemo(() => {
    const ids = new Set<string>();
    ids.add(selectedNodeId);
    connectedLinks.forEach((l) => {
      ids.add(l.source);
      ids.add(l.target);
    });
    return ids;
  }, [selectedNodeId, connectedLinks]);

  // Associated experiments for drawer
  const associatedExperiments = useMemo(() => {
    if (selectedNode.category === 'experiment') {
      const exp = EXPERIMENTS_DATA.find((e) => e.id === selectedNode.id);
      return exp ? [exp] : [];
    }
    if (selectedNode.category === 'material') {
      return EXPERIMENTS_DATA.filter((e) => e.material.toLowerCase().includes(selectedNode.label.toLowerCase()) || e.materialCategory.toLowerCase().includes(selectedNode.label.toLowerCase()));
    }
    if (selectedNode.category === 'gravity') {
      if (selectedNode.id === 'GRAV-0G') return EXPERIMENTS_DATA.filter((e) => e.gravity.includes('Microgravity'));
      if (selectedNode.id === 'GRAV-LUNAR') return EXPERIMENTS_DATA.filter((e) => e.gravity.includes('Lunar'));
      if (selectedNode.id === 'GRAV-MARS') return EXPERIMENTS_DATA.filter((e) => e.gravity.includes('Martian'));
    }
    if (selectedNode.category === 'oxygen') {
      return selectedNode.id === 'O2-21' 
        ? EXPERIMENTS_DATA.filter((e) => e.oxygenPercent <= 21.5)
        : EXPERIMENTS_DATA.filter((e) => e.oxygenPercent > 21.5);
    }
    return EXPERIMENTS_DATA.slice(0, 3);
  }, [selectedNode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span>ONTOLOGICAL KNOWLEDGE GRAPH</span>
            <span className="text-slate-600">·</span>
            <span>EXPERIMENT-MATERIAL-PHENOMENON NETWORK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Research Knowledge Graph
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Explore interlinked semantic dependencies between materials, gravity environments, oxygen boundaries, and combustion phenomena.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Experiment</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Material</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Gravity</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Oxygen</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Stage */}
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-b from-slate-950 via-[#07111F] to-slate-950 border border-slate-800 p-4 shadow-2xl relative overflow-hidden">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

          {/* Quick instructions HUD */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg backdrop-blur-xs">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Click any node to isolate relationships & load experimental evidence</span>
          </div>

          <div className="w-full aspect-[16/10] min-h-[460px] relative select-none">
            <svg className="w-full h-full" viewBox="100 60 740 480">
              <defs>
                <linearGradient id="linkGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FF7A18" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Edge Links */}
              {KNOWLEDGE_GRAPH_LINKS.map((link, i) => {
                const s = nodeCoordinates[link.source];
                const t = nodeCoordinates[link.target];
                if (!s || !t) return null;

                const isConnected = 
                  link.source === selectedNodeId || 
                  link.target === selectedNodeId ||
                  link.source === hoveredNodeId || 
                  link.target === hoveredNodeId;

                return (
                  <g key={i}>
                    <line
                      x1={s.x}
                      y1={s.y}
                      x2={t.x}
                      y2={t.y}
                      stroke={isConnected ? '#FFB547' : '#1E293B'}
                      strokeWidth={isConnected ? 2.5 : 1}
                      strokeDasharray={isConnected ? 'none' : '2 2'}
                      className="transition-all duration-300"
                    />
                    {isConnected && (
                      <text
                        x={(s.x + t.x) / 2}
                        y={(s.y + t.y) / 2 - 4}
                        fill="#F59E0B"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="pointer-events-none select-none"
                      >
                        {link.relationship}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {KNOWLEDGE_GRAPH_NODES.map((node) => {
                const coord = nodeCoordinates[node.id];
                if (!coord) return null;

                const isSelected = node.id === selectedNodeId;
                const isHovered = node.id === hoveredNodeId;
                const isNeighbor = neighborNodeIds.has(node.id);
                const radius = node.val;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedNodeId(node.id)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                  >
                    {/* Active pulse ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={radius + 8}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        className="animate-spin origin-center"
                        style={{ transformOrigin: `${coord.x}px ${coord.y}px` }}
                      />
                    )}

                    {/* Node Circle */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={radius}
                      fill={node.color}
                      fillOpacity={isSelected ? 1 : isNeighbor ? 0.85 : 0.4}
                      stroke={isSelected ? '#FFFFFF' : '#0B132B'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all duration-200"
                    />

                    {/* Node Label */}
                    <text
                      x={coord.x}
                      y={coord.y + radius + 14}
                      fill={isSelected ? '#FFFFFF' : isNeighbor ? '#E2E8F0' : '#64748B'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="Space Grotesk, sans-serif"
                      textAnchor="middle"
                      className="pointer-events-none select-none transition-colors"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Entity Dossier & Associated Experiments */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                SELECTED GRAPH ENTITY
              </span>
              <span 
                className="text-xs font-mono font-semibold px-2 py-0.5 rounded uppercase"
                style={{ color: selectedNode.color, backgroundColor: `${selectedNode.color}15` }}
              >
                {selectedNode.category}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-display">
                {selectedNode.label}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Direct Connections List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase">DIRECT CONNECTIONS:</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {connectedLinks.map((link, i) => {
                  const targetId = link.source === selectedNodeId ? link.target : link.source;
                  const targetNode = KNOWLEDGE_GRAPH_NODES.find((n) => n.id === targetId);
                  if (!targetNode) return null;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedNodeId(targetNode.id)}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-xs font-mono cursor-pointer transition-colors"
                    >
                      <span className="text-slate-300 truncate max-w-[160px]">{targetNode.label}</span>
                      <span className="text-amber-400 text-[10px] font-sans">{link.relationship}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Associated Experiments */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono text-slate-400 uppercase">
                Grounded Experiments ({associatedExperiments.length})
              </h4>
            </div>

            <div className="space-y-2.5">
              {associatedExperiments.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => onSelectExperiment(exp)}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-400/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="text-amber-400 font-semibold">{exp.id}</span>
                    <span>{exp.gravity.split(' ')[0]}</span>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {exp.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>{exp.material.split(' ')[0]} · {exp.oxygenPercent}% O₂</span>
                    <span className="text-slate-300 group-hover:translate-x-0.5 transition-transform">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
