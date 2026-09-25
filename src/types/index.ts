export type GravityCondition = 'Microgravity (0g)' | 'Lunar Gravity (0.166g)' | 'Martian Gravity (0.38g)' | 'Terrestrial (1g)' | 'Variable / Parabolic';

export type MaterialCategory = 'Polymer' | 'Fabric / Textile' | 'Composite' | 'Liquid Hydrocarbon' | 'Biomass / Cellulose' | 'Advanced Alloy';

export type MissionType = 'ISS (Columbus/Destiny/CIR)' | 'Cygnus (Saffire)' | 'Parabolic Flight' | 'Zero-G Drop Tower' | 'Space Shuttle (STS)' | 'Sounding Rocket';

export interface Experiment {
  id: string; // e.g. "EXP-001"
  codeName: string; // e.g. "SOFIE-GEL-04"
  title: string;
  year: number;
  mission: MissionType;
  facility: string; // e.g. "Combustion Integrated Rack (CIR)"
  gravity: GravityCondition;
  material: string; // e.g. "PMMA (Polymethyl Methacrylate)"
  materialCategory: MaterialCategory;
  oxygenPercent: number; // e.g. 21.0
  pressureAtm: number; // e.g. 1.0 (atm) or kPa
  pressureKPa: number; // e.g. 101.3
  airflowCmS: number; // convective velocity e.g. 2.5 cm/s
  ambientTempK: number; // e.g. 295 K
  flameType: 'Spherical Diffusion' | 'Opposed-Flow Flame' | 'Concurrent Flame' | 'Smoldering / Low-Temp' | 'Quenched Extinction' | 'Sooting Jet';
  flameShape: 'Spherical' | 'Elongated Teardrop' | 'Hemispherical' | 'Diminishing Quench';
  flameColor: 'Deep Blue / Chemiluminescent' | 'Amber Sooty' | 'Translucent Blue-Amber';
  
  // Quantitative measurements
  ignitionTimeS: number; // seconds to ignition
  flameSpreadMmS: number; // mm/s
  burnDurationS: number; // seconds
  peakTemperatureK: number; // flame temp in Kelvin
  sootProductionIndex: 'Negligible' | 'Low' | 'Moderate' | 'Heavy';
  
  // Empirical observations & verified results
  observations: string;
  empiricalResult: 'Self-Sustained Steady' | 'Quenched Extinction' | 'Rapid Acceleration' | 'Smolder Transition' | 'Low-Oxygen Extinction';
  findings: string;
  
  // AI synthesis
  aiInterpretation: string;
  evidenceStrength: 'High (Direct Instrument)' | 'Moderate (Corroborated)' | 'Preliminary (Single Run)';
  evidenceCoverageScore: number; // 0-100%
  
  // Source citations
  sourceDocId: string;
  sourceTitle: string;
  sourceAuthors: string;
  sourceYear: number;
  sourceUrl?: string;
  
  // Mission relevance
  moonRelevance: 'Direct Analog' | 'Moderate Analog' | 'Low Analog';
  marsRelevance: 'Direct Analog' | 'Moderate Analog' | 'Low Analog';
}

export interface ResearchSource {
  id: string;
  nasaDocNumber: string; // e.g. "NASA/TM-20220008412"
  title: string;
  authors: string;
  year: number;
  organization: string;
  researchArea: 'Flame Extinction' | 'Material Flammability' | 'Smoke Detection' | 'Exploration Atmospheres' | 'Large-Scale Spacecraft Fires';
  experimentsCovered: number;
  materialsCovered: string[];
  abstract: string;
  url: string;
  doi?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  category: 'experiment' | 'material' | 'gravity' | 'oxygen' | 'mission' | 'phenomenon';
  val: number; // size
  color: string;
  description: string;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  relationship: string;
}

export interface MissionScenario {
  id: 'iss' | 'moon' | 'mars';
  name: string;
  destination: string;
  gravityG: number;
  gravityLabel: string;
  standardPressureKPa: number;
  standardO2Percent: number;
  atmosphereComposition: string;
  conditionMatchPct: number;
  summary: string;
  comparableConditions: string[];
  knownDifferences: string[];
  criticalRisks: string[];
  researchGaps: string[];
  recommendedExperiments: string[];
}

export interface TelemetryPoint {
  timeS: number;
  tempK: number;
  pressureKPa: number;
  heatFluxKW: number;
  flameSpreadMm: number;
  o2Ppm: number;
  sootOpacityPct: number;
}

export interface ExperimentRecord extends Experiment {
  telemetry?: TelemetryPoint[];
  datasetTag?: string; // e.g. "SIH-2026-CHALLENGE", "NASA-SAFFIRE", "ISRO-GAGANYAAN-ANALOG"
  investigator?: string;
  dateLogged?: string;
  sihTeamId?: string;
  notes?: string;
}

export interface AIPredictionInput {
  gravity: GravityCondition;
  material: string;
  oxygenPercent: number;
  pressureKPa: number;
  airflowCmS: number;
}

export interface AIPredictionResult {
  predictedFlameSpreadMmS: number;
  extinctionRiskPercent: number;
  peakTempK: number;
  flameShape: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  safetyEnvelopeRecommendation: string;
  physicsReasoning: string;
  matchingHistoricalRuns: {
    id: string;
    codeName: string;
    similarityScore: number;
    reason: string;
  }[];
}

export interface AIDataInsights {
  totalRecordsAnalyzed: number;
  keyCorrelations: string[];
  anomalousRuns: {
    id: string;
    codeName: string;
    anomaly: string;
  }[];
  safetyThresholds: {
    o2LimitPct: number;
    criticalAirflowCmS: number;
    note: string;
  }[];
  recommendedMitigation: string;
}

