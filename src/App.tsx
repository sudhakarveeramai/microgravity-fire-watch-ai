import React, { useState } from 'react';
import { Navbar, PageView } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ResearchDashboard } from './components/ResearchDashboard';
import { ExperimentExplorer } from './components/ExperimentExplorer';
import { ExperimentDetailModal } from './components/ExperimentDetailModal';
import { FireAnalytics } from './components/FireAnalytics';
import { ExperimentComparison } from './components/ExperimentComparison';
import { MissionScenario } from './components/MissionScenario';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { FireSafetyIntelligence } from './components/FireSafetyIntelligence';
import { ResearchSources } from './components/ResearchSources';
import { Methodology } from './components/Methodology';
import { SearchModal } from './components/SearchModal';
import { SolarSystemBackground } from './components/SolarSystemBackground';
import { Footer } from './components/Footer';
import { VeoVideoGenerator } from './components/VeoVideoGenerator';
import { AuthModal } from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { SihDatabase } from './components/SihDatabase';
import { MobileTabBar } from './components/MobileTabBar';
import { getLoadedExperiments } from './lib/sihDatabase';
import { Experiment, AIPredictionInput, ExperimentRecord } from './types';
import { Orbit, Sparkles, ArrowRight, Film, Database } from 'lucide-react';

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageView>('overview');
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [comparisonExpA, setComparisonExpA] = useState<Experiment | undefined>(undefined);
  const [comparisonExpB, setComparisonExpB] = useState<Experiment | undefined>(undefined);
  const [activeMissionId, setActiveMissionId] = useState<'iss' | 'moon' | 'mars'>('moon');
  const [aiAssistantQuery, setAiAssistantQuery] = useState<string>('');
  const [predictionSeed, setPredictionSeed] = useState<AIPredictionInput | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [solarSystemBgActive, setSolarSystemBgActive] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Navigate to experiment detail modal (searches active loaded database)
  const handleOpenExperimentById = (id: string) => {
    const loaded = getLoadedExperiments();
    const exp = loaded.find((e) => e.id === id);
    if (exp) {
      setSelectedExperiment(exp);
    }
  };

  // Launch AI query from dashboard or search
  const handleRunAIQuery = (query: string) => {
    setAiAssistantQuery(query);
    setCurrentPage('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pre-seed AI Predictor from an experiment record
  const handlePredictFromRecord = (rec: ExperimentRecord) => {
    setPredictionSeed({
      gravity: rec.gravity,
      material: rec.material,
      oxygenPercent: rec.oxygenPercent,
      pressureKPa: rec.pressureKPa,
      airflowCmS: rec.airflowCmS
    });
    setCurrentPage('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Set up comparison
  const handleCompareWith = (exp: Experiment) => {
    setComparisonExpB(exp);
    setCurrentPage('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Explore gap experiments from mission scenario
  const handleExploreGapExperiments = (keyword: string) => {
    setCurrentPage('experiments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Live Running Solar System Background with Cursor Move Parallax (Active across all pages) */}
      {solarSystemBgActive && currentPage !== 'solarsystem' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35 transition-opacity duration-700">
          <SolarSystemBackground opacity={1} />
        </div>
      )}

      {/* Persistent Global Navigation */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        activeMissionId={activeMissionId}
        onSelectMission={(m) => setActiveMissionId(m)}
        solarSystemBgActive={solarSystemBgActive}
        onToggleSolarSystemBg={() => setSolarSystemBgActive(!solarSystemBgActive)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main View Router with responsive bottom padding on mobile/tablet */}
      <main className="flex-1 relative z-10 pb-24 lg:pb-8">
        {currentPage === 'overview' && (
          <div className="space-y-16">
            <HeroSection 
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreExperiment={handleOpenExperimentById}
            />

            {/* Feature Banners: SIH Database, Veo Video Synthesis & Solar System Orrery */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* SIH Database & Trained AI Banner */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-950/90 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                      <span>SIH PROJECT DATABASE</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-cyan-400">AI TRAINED ENGINE</span>
                    </div>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      Combustion Telemetry Database
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Manage loaded test runs, import/export CSV/JSON, inspect time-series sensors, and run AI prediction on historical records.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-emerald-400">CRUD · SENSOR CHARTS · AI GROUNDING</span>
                  <button
                    onClick={() => {
                      setCurrentPage('database');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>Open Database</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Veo Video Generator Feature Banner */}
              <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-orange-950/40 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                      <span>VEO VIDEO GENERATION</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-cyan-400">veo-3.1</span>
                    </div>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      Animate Flame Photos into Video
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Upload combustion photos and synthesize time-series microgravity fluid dynamics in 16:9 landscape or 9:16 portrait.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-400">16:9 & 9:16 FORMATS</span>
                  <button
                    onClick={() => {
                      setCurrentPage('veo');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>Launch Veo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Interactive Solar System Orrery Banner Callout */}
              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <Orbit className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '15s' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                      <span>PLANETARY ORBITAL ENGINE</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-amber-400">3D INTERACTIVE</span>
                    </div>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      Multi-Gravity Orrery
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Simulate planetary motion, examine partial gravity regimes on the Moon (0.166g) and Mars (0.38g).
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-400">MOON & MARS</span>
                  <button
                    onClick={() => {
                      setCurrentPage('solarsystem');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>Launch 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              <ResearchDashboard 
                onNavigate={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectExperiment={(exp) => setSelectedExperiment(exp)}
                onRunAIQuery={handleRunAIQuery}
              />
              
              <div className="pt-4">
                <Methodology 
                  onNavigate={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Full Interactive 3D Solar System View */}
        {currentPage === 'solarsystem' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                  <span>ORBITAL KINEMATICS & KEPLERIAN TRAJECTORIES</span>
                  <span className="text-slate-600">·</span>
                  <span>FUTURISTIC UI 3D SIMULATION</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display flex items-center gap-2.5">
                  <Orbit className="w-7 h-7 text-cyan-400" />
                  Solar System Orbital Orrery
                </h1>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Interactive 3D simulation with cursor-tilt camera parallax, real-time planetary orbits, HUD targeting reticle, and gravitational fire research correlation.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => setCurrentPage('mission')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Moon & Mars Habitat Analogs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Running 3D Solar System Canvas Stage */}
            <div className="h-[620px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#02060E] shadow-2xl relative">
              <SolarSystemBackground 
                opacity={1}
                onSelectPlanet={(planetId) => {
                  if (planetId === 'earth') setActiveMissionId('iss');
                  else if (planetId === 'mars') setActiveMissionId('mars');
                }}
              />
            </div>

            {/* Quick Context & Planetary Gravitational Fire Analogs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-blue-400 font-bold">Earth & ISS LEO</span>
                  <span>1.0g / 10⁻⁶g</span>
                </div>
                <p className="text-xs text-slate-300">
                  Combustion Integrated Rack (CIR) and Cygnus Saffire test beds provide the gold-standard 0g baseline: spherical diffusion flames, zero buoyant drafts, and quiescent radiative quenching.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-purple-400 font-bold">Moon (Luna)</span>
                  <span>0.166g</span>
                </div>
                <p className="text-xs text-slate-300">
                  Partial lunar gravity generates modest buoyant acceleration, yielding bulbous flame envelopes. Combined with Artemis Exploration Atmospheres (34% O₂), flame spread risks increase.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">Mars Surface</span>
                  <span>0.38g</span>
                </div>
                <p className="text-xs text-slate-300">
                  Martian gravity provides 38% of terrestrial buoyancy, establishing persistent upward convective drafts that align flame dynamics closer to terrestrial sub-atmospheric chambers than to 0g.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'database' && (
          <SihDatabase 
            onSelectExperimentForPrediction={handlePredictFromRecord}
            onNavigateToAssistant={() => {
              setCurrentPage('assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ResearchDashboard 
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectExperiment={(exp) => setSelectedExperiment(exp)}
              onRunAIQuery={handleRunAIQuery}
            />
          </div>
        )}

        {currentPage === 'experiments' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ExperimentExplorer 
              onSelectExperiment={(exp) => setSelectedExperiment(exp)}
              onCompareWith={handleCompareWith}
            />
          </div>
        )}

        {currentPage === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FireAnalytics 
              onSelectExperiment={(exp) => setSelectedExperiment(exp)}
            />
          </div>
        )}

        {currentPage === 'assistant' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              <AIAssistantSection 
                initialQuery={aiAssistantQuery}
                initialPredictionInput={predictionSeed}
                onSelectExperiment={(exp: Experiment) => setSelectedExperiment(exp)}
                onNavigateToDatabase={() => {
                  setCurrentPage('database');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}

        {currentPage === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ExperimentComparison 
              initialExpA={comparisonExpA}
              initialExpB={comparisonExpB}
              onSelectExperiment={(exp) => setSelectedExperiment(exp)}
            />
          </div>
        )}

        {currentPage === 'mission' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MissionScenario 
              initialMissionId={activeMissionId}
              onSelectExperiment={(exp) => setSelectedExperiment(exp)}
              onExploreGapExperiments={handleExploreGapExperiments}
            />
          </div>
        )}

        {currentPage === 'knowledge' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <KnowledgeGraph 
              onSelectExperiment={(exp) => setSelectedExperiment(exp)}
            />
          </div>
        )}

        {currentPage === 'safety' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FireSafetyIntelligence 
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreExperiments={() => {
                setCurrentPage('experiments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {currentPage === 'sources' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ResearchSources />
          </div>
        )}

        {currentPage === 'veo' && (
          <VeoVideoGenerator />
        )}

        {currentPage === 'methodology' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Methodology 
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <ExperimentDetailModal 
        experiment={selectedExperiment}
        onClose={() => setSelectedExperiment(null)}
        onCompareWith={handleCompareWith}
      />

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectExperiment={(exp) => setSelectedExperiment(exp)}
        onNavigate={(page) => setCurrentPage(page)}
      />

      {/* Auth & Profile Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectExperiment={handleOpenExperimentById}
        onNavigateToVideos={() => {
          setCurrentPage('veo');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile & Tablet Bottom Tab Bar (Fixed for screens below lg: 1024px) */}
      <MobileTabBar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />

      {/* Persistent Scientific Platform Footer */}
      <Footer 
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

// Wrapper for AIAssistant
import { AIAssistant } from './components/AIAssistant';
function AIAssistantSection({ 
  initialQuery, 
  initialPredictionInput,
  onSelectExperiment,
  onNavigateToDatabase
}: { 
  initialQuery?: string; 
  initialPredictionInput?: AIPredictionInput | null;
  onSelectExperiment: (exp: Experiment) => void;
  onNavigateToDatabase?: () => void;
}) {
  return (
    <AIAssistant 
      initialQuery={initialQuery}
      initialPredictionInput={initialPredictionInput}
      onSelectExperiment={onSelectExperiment}
      onNavigateToDatabase={onNavigateToDatabase}
    />
  );
}

export default App;
