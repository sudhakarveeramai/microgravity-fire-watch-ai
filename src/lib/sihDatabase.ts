import { ExperimentRecord, TelemetryPoint, GravityCondition, MaterialCategory } from '../types';
import { EXPERIMENTS_DATA } from '../data/mockExperiments';
import { saveExperimentToFirestore, deleteExperimentFromFirestore } from './firebase';

const SIH_DATABASE_STORAGE_KEY = 'firewatch_sih_experiments_db_v1';
const SIH_ACTIVE_PRESET_KEY = 'firewatch_sih_active_preset_v1';

/**
 * Generate physical sensor telemetry time-series points based on an experiment's parameters
 */
export function generateExperimentTelemetry(
  durationS: number,
  peakTempK: number,
  flameSpreadMmS: number,
  ambientPressureKPa: number,
  initialO2Percent: number,
  sootIndex: string
): TelemetryPoint[] {
  const steps = 24;
  const points: TelemetryPoint[] = [];
  const dt = Math.max(1, Math.round(durationS / steps));
  const baseSoot = sootIndex === 'Heavy' ? 35 : sootIndex === 'Moderate' ? 18 : sootIndex === 'Low' ? 6 : 1;

  for (let i = 0; i <= steps; i++) {
    const t = Math.min(durationS, i * dt);
    const progress = durationS > 0 ? t / durationS : 0;

    // Temperature profile: smooth ignition ramp up, plateau, gradual cool
    let temp = 295;
    if (progress < 0.2) {
      temp = 295 + (peakTempK - 295) * Math.sin((progress / 0.2) * (Math.PI / 2));
    } else if (progress < 0.75) {
      const wobble = (Math.sin(i * 1.5) * 15);
      temp = peakTempK + wobble;
    } else {
      const coolProgress = (progress - 0.75) / 0.25;
      temp = peakTempK - (peakTempK - 340) * Math.sin(coolProgress * (Math.PI / 2));
    }

    // Flame position along fuel sample
    const flameSpreadMm = Number((flameSpreadMmS * t).toFixed(2));

    // Chamber pressure (slight heating expansion then regulator equilibration)
    const pressureDelta = Math.sin(progress * Math.PI) * 1.8;
    const pressureKPa = Number((ambientPressureKPa + pressureDelta).toFixed(2));

    // Radiometer Heat Flux (kW/m2)
    const heatFluxKW = Number(((temp / 1000) ** 4 * 0.85 * (1 - Math.exp(-progress * 5))).toFixed(2));

    // Local O2 concentration in flame boundary (ppm)
    const o2ConsumedFactor = 1 - Math.min(0.4, progress * 0.35);
    const o2Ppm = Math.round(initialO2Percent * 10000 * o2ConsumedFactor);

    // Soot opacity %
    const sootOpacityPct = Number(Math.min(99, baseSoot * (1 + Math.sin(progress * Math.PI) * 1.6)).toFixed(1));

    points.push({
      timeS: t,
      tempK: Math.round(temp),
      pressureKPa,
      heatFluxKW,
      flameSpreadMm,
      o2Ppm,
      sootOpacityPct
    });
  }

  return points;
}

// Additional SIH 2026 & Space Agency Benchmark Records
const SIH_ADDITIONAL_RECORDS: ExperimentRecord[] = [
  {
    id: 'EXP-SIH-01',
    codeName: 'SIH-GAGAN-CREW-01',
    title: 'ISRO Gaganyaan Crew Module Nomex/Polyimide Harness Fire Test in Low Convection',
    year: 2024,
    mission: 'Zero-G Drop Tower',
    facility: 'Bremen 4.7s Drop Tower / ISRO Vikram Sarabhai Space Centre Analog',
    gravity: 'Microgravity (0g)',
    material: 'Polyimide-Wrapped Copper Avionics Wire',
    materialCategory: 'Polymer',
    oxygenPercent: 23.5,
    pressureAtm: 0.98,
    pressureKPa: 99.5,
    airflowCmS: 3.2,
    ambientTempK: 295,
    flameType: 'Opposed-Flow Flame',
    flameShape: 'Spherical',
    flameColor: 'Deep Blue / Chemiluminescent',
    ignitionTimeS: 4.8,
    flameSpreadMmS: 0.38,
    burnDurationS: 42,
    peakTemperatureK: 1190,
    sootProductionIndex: 'Low',
    observations: 'Simulated electrical harness short-circuit in 0g with Gaganyaan ECLSS nominal cabin ventilation (3.2 cm/s). Slow smolder-to-flame transition along polyimide coating followed by blue chemiluminescent spherical envelope.',
    empiricalResult: 'Self-Sustained Steady',
    findings: 'Verified that standard avionics wire insulation can sustain slow steady flame creep in low-flow microgravity if oxygen is maintained above 22%. Lowering cabin ventilation speed below 1.5 cm/s induced flame extinction within 14 seconds.',
    aiInterpretation: 'Critical benchmark for Indian Human Spaceflight Programme (HSP). Low-flow ventilation shutoff serves as an immediate passive suppression mechanism prior to deploying gaseous fire suppressants.',
    evidenceStrength: 'High (Direct Instrument)',
    evidenceCoverageScore: 92,
    sourceDocId: 'SRC-SIH-01',
    sourceTitle: 'Combustion and Fire Spread Characteristics of Spacecraft Electrical Harnesses in Reduced Gravity',
    sourceAuthors: 'Sharma, R. K., Pillai, A. V., Chandrasekhar, N.',
    sourceYear: 2024,
    sourceUrl: 'https://isro.gov.in/research/spacecraft-fire-safety',
    moonRelevance: 'Direct Analog',
    marsRelevance: 'Moderate Analog',
    datasetTag: 'SIH-2026-CHALLENGE',
    investigator: 'SIH Team Agni-Rakshak (ISRO-Track)',
    dateLogged: '2026-03-12',
    sihTeamId: 'SIH-2026-ISRO-049',
    notes: 'Primary benchmark dataset submitted for Smart India Hackathon Space Habitat Fire Intelligence.'
  },
  {
    id: 'EXP-SIH-02',
    codeName: 'SIH-ARTEMIS-LUNAR-03',
    title: 'Lunar Surface Habitat Regolith-Composite Multi-Layer Insulation Burning at 0.166g',
    year: 2025,
    mission: 'Parabolic Flight',
    facility: 'ESA Air Zero-G A310 Lunar Trajectory Campaign',
    gravity: 'Lunar Gravity (0.166g)',
    material: 'Regolith-Polymer Sintered Composite Shield',
    materialCategory: 'Composite',
    oxygenPercent: 32.0,
    pressureAtm: 0.56,
    pressureKPa: 56.5,
    airflowCmS: 12.0,
    ambientTempK: 293,
    flameType: 'Concurrent Flame',
    flameShape: 'Hemispherical',
    flameColor: 'Amber Sooty',
    ignitionTimeS: 2.4,
    flameSpreadMmS: 1.85,
    burnDurationS: 28,
    peakTemperatureK: 1480,
    sootProductionIndex: 'Moderate',
    observations: 'Simulated Artemis surface habitat atmosphere (32% O2, 56.5 kPa) at lunar gravity. Sintered lunar regolith geopolymer binder exhibited localized gasification with glowing particle ejection.',
    empiricalResult: 'Self-Sustained Steady',
    findings: 'Sintered regolith matrix acts as a heat sink but elevated oxygen accelerates combustion of organic binder phase. Upward buoyant convection at 0.166g causes flame to tilt 35 degrees relative to sample plane.',
    aiInterpretation: 'Lunar gravity induces sufficient buoyancy to remove suffocating combustion products while the 32% exploration atmosphere dramatically lowers ignition energy compared to 1G air.',
    evidenceStrength: 'High (Direct Instrument)',
    evidenceCoverageScore: 89,
    sourceDocId: 'SRC-SIH-02',
    sourceTitle: 'Exploration Atmosphere Flammability in Lunar and Deep Space Habitats',
    sourceAuthors: 'Patel, S., Urban, D. L., Torero, J. L.',
    sourceYear: 2025,
    sourceUrl: 'https://ntrs.nasa.gov/citations/artemis-lunar-flammability',
    moonRelevance: 'Direct Analog',
    marsRelevance: 'Moderate Analog',
    datasetTag: 'SIH-2026-CHALLENGE',
    investigator: 'SIH Lunar Habitat Consortium',
    dateLogged: '2026-04-18',
    sihTeamId: 'SIH-2026-NASA-102',
    notes: 'Validation study for Lunar South Pole Habitat internal wall panel flame retardancy.'
  },
  {
    id: 'EXP-SIH-03',
    codeName: 'SIH-ECLSS-DROP-04',
    title: 'Closed-Loop ECLSS Oxygen Enrichment Surge Ignition Limit on Aramid Filtration Felt',
    year: 2024,
    mission: 'Zero-G Drop Tower',
    facility: 'NASA Glenn 2.2-Second Drop Tower',
    gravity: 'Microgravity (0g)',
    material: 'Nomex / Carbon Aramid HEPA Felt',
    materialCategory: 'Fabric / Textile',
    oxygenPercent: 36.0,
    pressureAtm: 1.0,
    pressureKPa: 101.3,
    airflowCmS: 25.0,
    ambientTempK: 296,
    flameType: 'Concurrent Flame',
    flameShape: 'Hemispherical',
    flameColor: 'Deep Blue / Chemiluminescent',
    ignitionTimeS: 1.1,
    flameSpreadMmS: 4.10,
    burnDurationS: 22,
    peakTemperatureK: 1620,
    sootProductionIndex: 'Negligible',
    observations: 'Simulated ECLSS oxygen separator emergency bypass failure venting 36% O2 across filter banks. Instant ignition achieved via single 15-joule spark with rapid concurrent flame spread.',
    empiricalResult: 'Rapid Acceleration',
    findings: 'Even flame-retardant aramid textiles transition to rapid self-propagating combustion when ambient O2 exceeds 34%, regardless of zero-buoyancy microgravity.',
    aiInterpretation: 'Defines an absolute upper safety ceiling for life support oxygen enrichment in spacecraft. Automatic isolation valves must engage before O2 exceeds 28% in ventilation ducts.',
    evidenceStrength: 'High (Direct Instrument)',
    evidenceCoverageScore: 95,
    sourceDocId: 'SRC-SIH-03',
    sourceTitle: 'Oxygen Index Limits for Spacecraft Ventilation Filtration Media',
    sourceAuthors: 'Mukherjee, T., Ruff, G. A., Ferkul, P. V.',
    sourceYear: 2024,
    sourceUrl: 'https://ntrs.nasa.gov/citations/eclss-oxygen-limits',
    moonRelevance: 'Direct Analog',
    marsRelevance: 'Direct Analog',
    datasetTag: 'SIH-2026-CHALLENGE',
    investigator: 'SIH Life Support & Fire Safety Group',
    dateLogged: '2026-05-02',
    sihTeamId: 'SIH-2026-ECLSS-012',
    notes: 'Critical safety constraint used for automated ventilation emergency cutoffs.'
  },
  {
    id: 'EXP-SIH-04',
    codeName: 'SIH-MARS-PRESSURE-05',
    title: 'Martian Habitat Low-Pressure Methane/Silicone Gasket Flame Extinction Boundary',
    year: 2025,
    mission: 'Parabolic Flight',
    facility: 'Zero-G Research Aircraft & Reduced Pressure Test Cell',
    gravity: 'Martian Gravity (0.38g)',
    material: 'Aerospace Grade Silicone Sealant Gasket',
    materialCategory: 'Polymer',
    oxygenPercent: 21.0,
    pressureAtm: 0.45,
    pressureKPa: 45.0,
    airflowCmS: 2.0,
    ambientTempK: 285,
    flameType: 'Quenched Extinction',
    flameShape: 'Diminishing Quench',
    flameColor: 'Deep Blue / Chemiluminescent',
    ignitionTimeS: 14.2,
    flameSpreadMmS: 0.08,
    burnDurationS: 18,
    peakTemperatureK: 1040,
    sootProductionIndex: 'Low',
    observations: 'Test conducted in reduced pressure Martian analog chamber at 45 kPa total pressure with 0.38g gravity simulation. Silicone sample ignited but extinguished naturally as buoyant heat loss exceeded chemical reaction rate.',
    empiricalResult: 'Low-Oxygen Extinction',
    findings: 'Demonstrates low pressure quenching benefit: reducing total pressure to 45 kPa effectively depresses flame spread rates on elastomers by over 70% even with moderate forced airflow.',
    aiInterpretation: 'Rapid cabin depressurization to 45 kPa represents a highly effective non-toxic fire suppression protocol for Martian habitats before releasing gaseous inerting agents.',
    evidenceStrength: 'High (Direct Instrument)',
    evidenceCoverageScore: 90,
    sourceDocId: 'SRC-SIH-04',
    sourceTitle: 'Depressurization Dynamics for Spacecraft Fire Suppression',
    sourceAuthors: 'Nair, S. K., Olson, S. L., T\'ien, J. S.',
    sourceYear: 2025,
    sourceUrl: 'https://ntrs.nasa.gov/citations/mars-habitat-depressurization',
    moonRelevance: 'Moderate Analog',
    marsRelevance: 'Direct Analog',
    datasetTag: 'SIH-2026-CHALLENGE',
    investigator: 'SIH Mars Habitat Fire Team',
    dateLogged: '2026-06-11',
    sihTeamId: 'SIH-2026-MARS-088',
    notes: 'Key evidentiary record for active depressurization suppression protocols.'
  }
];

// Initialize base records with synthesized telemetry
function buildMasterRecords(): ExperimentRecord[] {
  const baseMaster = [...EXPERIMENTS_DATA, ...SIH_ADDITIONAL_RECORDS];
  return baseMaster.map((exp) => {
    const telemetry = generateExperimentTelemetry(
      exp.burnDurationS || 60,
      exp.peakTemperatureK || 1300,
      exp.flameSpreadMmS || 1.0,
      exp.pressureKPa || 101.3,
      exp.oxygenPercent || 21.0,
      exp.sootProductionIndex || 'Low'
    );
    return {
      ...exp,
      telemetry,
      datasetTag: (exp as any).datasetTag || 'NASA-HISTORICAL-MASTER',
      dateLogged: (exp as any).dateLogged || `${exp.year}-06-15`,
      investigator: (exp as any).investigator || 'NASA Glenn Combustion Research Team'
    };
  });
}

// In-memory active database cache
let activeRecords: ExperimentRecord[] = [];
let listeners: Array<(records: ExperimentRecord[]) => void> = [];

// Initialize database from storage or master
function initDatabase(): ExperimentRecord[] {
  if (typeof window === 'undefined') {
    return buildMasterRecords();
  }

  try {
    const saved = localStorage.getItem(SIH_DATABASE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure every record has telemetry
        activeRecords = parsed.map((item: ExperimentRecord) => {
          if (!item.telemetry || item.telemetry.length === 0) {
            item.telemetry = generateExperimentTelemetry(
              item.burnDurationS || 60,
              item.peakTemperatureK || 1300,
              item.flameSpreadMmS || 1.0,
              item.pressureKPa || 101.3,
              item.oxygenPercent || 21.0,
              item.sootProductionIndex || 'Low'
            );
          }
          return item;
        });
        return activeRecords;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored SIH database, resetting to master:', e);
  }

  activeRecords = buildMasterRecords();
  saveToStorage(activeRecords);
  return activeRecords;
}

function saveToStorage(records: ExperimentRecord[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SIH_DATABASE_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Could not persist SIH database to localStorage:', e);
    }
  }
}

function notifyListeners() {
  listeners.forEach((fn) => fn([...activeRecords]));
}

/**
 * Get all loaded experiment records and previous mission telemetry
 */
export function getLoadedExperiments(): ExperimentRecord[] {
  if (activeRecords.length === 0) {
    return initDatabase();
  }
  return [...activeRecords];
}

/**
 * Subscribe to real-time changes in the loaded database
 */
export function subscribeToDatabase(callback: (records: ExperimentRecord[]) => void): () => void {
  listeners.push(callback);
  // Send initial data immediately
  callback(getLoadedExperiments());
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

/**
 * Add a new experiment record to the database
 */
export function addExperiment(newRecord: Omit<ExperimentRecord, 'id'>): ExperimentRecord {
  const id = `EXP-USR-${Date.now().toString().slice(-5)}`;
  const telemetry = newRecord.telemetry && newRecord.telemetry.length > 0
    ? newRecord.telemetry
    : generateExperimentTelemetry(
        newRecord.burnDurationS || 60,
        newRecord.peakTemperatureK || 1300,
        newRecord.flameSpreadMmS || 1.0,
        newRecord.pressureKPa || 101.3,
        newRecord.oxygenPercent || 21.0,
        newRecord.sootProductionIndex || 'Low'
      );

  const fullRecord: ExperimentRecord = {
    ...newRecord,
    id,
    telemetry,
    datasetTag: newRecord.datasetTag || 'SIH-USER-ENTRY',
    dateLogged: newRecord.dateLogged || new Date().toISOString().split('T')[0],
    investigator: newRecord.investigator || 'Current Investigator'
  };

  activeRecords = [fullRecord, ...activeRecords];
  saveToStorage(activeRecords);
  notifyListeners();
  saveExperimentToFirestore(fullRecord);
  return fullRecord;
}

/**
 * Update an existing experiment record
 */
export function updateExperiment(id: string, updates: Partial<ExperimentRecord>): ExperimentRecord | null {
  const index = activeRecords.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const existing = activeRecords[index];
  const updated: ExperimentRecord = {
    ...existing,
    ...updates,
    id: existing.id // preserve ID
  };

  // If parameters changed, regenerate telemetry if not explicitly provided
  if (!updates.telemetry && (updates.peakTemperatureK || updates.burnDurationS || updates.flameSpreadMmS)) {
    updated.telemetry = generateExperimentTelemetry(
      updated.burnDurationS,
      updated.peakTemperatureK,
      updated.flameSpreadMmS,
      updated.pressureKPa,
      updated.oxygenPercent,
      updated.sootProductionIndex
    );
  }

  activeRecords[index] = updated;
  saveToStorage(activeRecords);
  notifyListeners();
  saveExperimentToFirestore(updated);
  return updated;
}

/**
 * Delete a record from the database
 */
export function deleteExperiment(id: string): boolean {
  const prevLen = activeRecords.length;
  activeRecords = activeRecords.filter((r) => r.id !== id);
  if (activeRecords.length !== prevLen) {
    saveToStorage(activeRecords);
    notifyListeners();
    deleteExperimentFromFirestore(id);
    return true;
  }
  return false;
}

/**
 * Reset database to default master benchmark set or a specific preset
 */
export function resetDatabase(preset: 'all' | 'sih' | 'artemis' | 'saffire' = 'all'): ExperimentRecord[] {
  const master = buildMasterRecords();

  if (preset === 'sih') {
    activeRecords = master.filter((r) => r.datasetTag === 'SIH-2026-CHALLENGE');
  } else if (preset === 'artemis') {
    activeRecords = master.filter((r) => r.moonRelevance === 'Direct Analog' || r.marsRelevance === 'Direct Analog' || r.oxygenPercent > 25);
  } else if (preset === 'saffire') {
    activeRecords = master.filter((r) => r.mission.includes('Saffire') || r.facility.includes('Saffire'));
  } else {
    activeRecords = master;
  }

  saveToStorage(activeRecords);
  notifyListeners();
  return [...activeRecords];
}

/**
 * Export loaded experiments as JSON
 */
export function exportDatabaseAsJson(): string {
  return JSON.stringify(activeRecords, null, 2);
}

/**
 * Export loaded experiments as CSV
 */
export function exportDatabaseAsCsv(): string {
  if (activeRecords.length === 0) return '';
  const headers = [
    'id',
    'codeName',
    'title',
    'year',
    'mission',
    'facility',
    'gravity',
    'material',
    'materialCategory',
    'oxygenPercent',
    'pressureKPa',
    'airflowCmS',
    'peakTemperatureK',
    'flameSpreadMmS',
    'burnDurationS',
    'flameType',
    'empiricalResult',
    'evidenceStrength',
    'datasetTag',
    'investigator',
    'findings'
  ];

  const escapeCsv = (val: any) => {
    if (val === undefined || val === null) return '';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = activeRecords.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.codeName),
    escapeCsv(r.title),
    escapeCsv(r.year),
    escapeCsv(r.mission),
    escapeCsv(r.facility),
    escapeCsv(r.gravity),
    escapeCsv(r.material),
    escapeCsv(r.materialCategory),
    escapeCsv(r.oxygenPercent),
    escapeCsv(r.pressureKPa),
    escapeCsv(r.airflowCmS),
    escapeCsv(r.peakTemperatureK),
    escapeCsv(r.flameSpreadMmS),
    escapeCsv(r.burnDurationS),
    escapeCsv(r.flameType),
    escapeCsv(r.empiricalResult),
    escapeCsv(r.evidenceStrength),
    escapeCsv(r.datasetTag),
    escapeCsv(r.investigator),
    escapeCsv(r.findings)
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Import experiments from JSON
 */
export function importDatabaseFromJson(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: 'Uploaded JSON must contain an array of experiment objects.' };
    }

    const validRecords: ExperimentRecord[] = [];
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (!item.title || !item.material) continue;

      const record: ExperimentRecord = {
        id: item.id || `EXP-IMP-${Date.now().toString().slice(-4)}-${i + 1}`,
        codeName: item.codeName || `IMP-EXP-${i + 1}`,
        title: item.title,
        year: Number(item.year) || new Date().getFullYear(),
        mission: item.mission || 'ISS (Columbus/Destiny/CIR)',
        facility: item.facility || 'Zero-G Test Module',
        gravity: item.gravity || 'Microgravity (0g)',
        material: item.material,
        materialCategory: item.materialCategory || 'Polymer',
        oxygenPercent: Number(item.oxygenPercent) || 21.0,
        pressureAtm: Number(item.pressureAtm) || 1.0,
        pressureKPa: Number(item.pressureKPa) || 101.3,
        airflowCmS: Number(item.airflowCmS) || 5.0,
        ambientTempK: Number(item.ambientTempK) || 295,
        flameType: item.flameType || 'Spherical Diffusion',
        flameShape: item.flameShape || 'Spherical',
        flameColor: item.flameColor || 'Deep Blue / Chemiluminescent',
        ignitionTimeS: Number(item.ignitionTimeS) || 3.0,
        flameSpreadMmS: Number(item.flameSpreadMmS) || 0.5,
        burnDurationS: Number(item.burnDurationS) || 60,
        peakTemperatureK: Number(item.peakTemperatureK) || 1200,
        sootProductionIndex: item.sootProductionIndex || 'Low',
        observations: item.observations || 'Imported experiment telemetry dataset.',
        empiricalResult: item.empiricalResult || 'Self-Sustained Steady',
        findings: item.findings || 'Imported experimental findings.',
        aiInterpretation: item.aiInterpretation || 'Imported empirical telemetry analysis.',
        evidenceStrength: item.evidenceStrength || 'Moderate (Corroborated)',
        evidenceCoverageScore: Number(item.evidenceCoverageScore) || 80,
        sourceDocId: item.sourceDocId || 'SRC-IMPORTED',
        sourceTitle: item.sourceTitle || 'Imported Dataset Record',
        sourceAuthors: item.sourceAuthors || 'User / External Team',
        sourceYear: Number(item.sourceYear) || new Date().getFullYear(),
        moonRelevance: item.moonRelevance || 'Moderate Analog',
        marsRelevance: item.marsRelevance || 'Moderate Analog',
        datasetTag: item.datasetTag || 'USER-IMPORTED-JSON',
        investigator: item.investigator || 'External Research Team',
        dateLogged: item.dateLogged || new Date().toISOString().split('T')[0],
        telemetry: item.telemetry && Array.isArray(item.telemetry) && item.telemetry.length > 0
          ? item.telemetry
          : generateExperimentTelemetry(
              Number(item.burnDurationS) || 60,
              Number(item.peakTemperatureK) || 1200,
              Number(item.flameSpreadMmS) || 0.5,
              Number(item.pressureKPa) || 101.3,
              Number(item.oxygenPercent) || 21.0,
              item.sootProductionIndex || 'Low'
            )
      };

      validRecords.push(record);
    }

    if (validRecords.length === 0) {
      return { success: false, count: 0, error: 'No valid experiment records found in JSON.' };
    }

    // Merge without duplicate IDs
    const existingIds = new Set(activeRecords.map((r) => r.id));
    const newItems = validRecords.filter((r) => !existingIds.has(r.id));
    activeRecords = [...newItems, ...activeRecords];
    saveToStorage(activeRecords);
    notifyListeners();

    return { success: true, count: validRecords.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Invalid JSON syntax.' };
  }
}

/**
 * Import experiments from CSV
 */
export function importDatabaseFromCsv(csvString: string): { success: boolean; count: number; error?: string } {
  try {
    const lines = csvString.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return { success: false, count: 0, error: 'CSV file must have a header row and at least one data row.' };
    }

    const headers = lines[0].split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
    const validRecords: ExperimentRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Basic CSV splitter respecting quotes
      const values: string[] = [];
      let inQuote = false;
      let current = '';

      for (let ch of line) {
        if (ch === '"') {
          inQuote = !inQuote;
        } else if (ch === ',' && !inQuote) {
          values.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      values.push(current.trim());

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx]?.replace(/^["']|["']$/g, '') || '';
      });

      if (!row['title'] && !row['material']) continue;

      const record: ExperimentRecord = {
        id: row['id'] || `EXP-CSV-${Date.now().toString().slice(-4)}-${i}`,
        codeName: row['codeName'] || `CSV-EXP-${i}`,
        title: row['title'] || `CSV Record ${i}`,
        year: Number(row['year']) || new Date().getFullYear(),
        mission: (row['mission'] as any) || 'ISS (Columbus/Destiny/CIR)',
        facility: row['facility'] || 'Combustion Chamber',
        gravity: (row['gravity'] as any) || 'Microgravity (0g)',
        material: row['material'] || 'Test Polymer',
        materialCategory: (row['materialCategory'] as any) || 'Polymer',
        oxygenPercent: Number(row['oxygenPercent']) || 21.0,
        pressureAtm: 1.0,
        pressureKPa: Number(row['pressureKPa']) || 101.3,
        airflowCmS: Number(row['airflowCmS']) || 5.0,
        ambientTempK: 295,
        flameType: (row['flameType'] as any) || 'Opposed-Flow Flame',
        flameShape: 'Spherical',
        flameColor: 'Deep Blue / Chemiluminescent',
        ignitionTimeS: 3.5,
        flameSpreadMmS: Number(row['flameSpreadMmS']) || 0.8,
        burnDurationS: Number(row['burnDurationS']) || 90,
        peakTemperatureK: Number(row['peakTemperatureK']) || 1350,
        sootProductionIndex: 'Low',
        observations: row['findings'] || 'Imported from CSV telemetry archive.',
        empiricalResult: (row['empiricalResult'] as any) || 'Self-Sustained Steady',
        findings: row['findings'] || 'Data logged via CSV batch record.',
        aiInterpretation: 'Derived from imported experimental measurements.',
        evidenceStrength: 'Moderate (Corroborated)',
        evidenceCoverageScore: 82,
        sourceDocId: 'SRC-CSV-LOG',
        sourceTitle: 'CSV Historical Run',
        sourceAuthors: row['investigator'] || 'Research Investigator',
        sourceYear: Number(row['year']) || 2024,
        moonRelevance: 'Moderate Analog',
        marsRelevance: 'Moderate Analog',
        datasetTag: row['datasetTag'] || 'USER-IMPORTED-CSV',
        investigator: row['investigator'] || 'CSV Importer',
        dateLogged: new Date().toISOString().split('T')[0],
        telemetry: generateExperimentTelemetry(
          Number(row['burnDurationS']) || 90,
          Number(row['peakTemperatureK']) || 1350,
          Number(row['flameSpreadMmS']) || 0.8,
          Number(row['pressureKPa']) || 101.3,
          Number(row['oxygenPercent']) || 21.0,
          'Low'
        )
      };

      validRecords.push(record);
    }

    if (validRecords.length === 0) {
      return { success: false, count: 0, error: 'Could not parse any valid rows from CSV.' };
    }

    activeRecords = [...validRecords, ...activeRecords];
    saveToStorage(activeRecords);
    notifyListeners();
    return { success: true, count: validRecords.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Error parsing CSV.' };
  }
}

/**
 * Get quick aggregate statistics for the loaded database
 */
export function getDatabaseStats() {
  const records = getLoadedExperiments();
  const totalRecords = records.length;
  const uniqueMaterials = new Set(records.map((r) => r.material)).size;
  const uniqueMissions = new Set(records.map((r) => r.mission)).size;
  const uniqueGravities = new Set(records.map((r) => r.gravity)).size;

  const totalTelemetryPoints = records.reduce((acc, r) => acc + (r.telemetry?.length || 0), 0);
  const avgFlameSpread = totalRecords > 0
    ? Number((records.reduce((acc, r) => acc + (r.flameSpreadMmS || 0), 0) / totalRecords).toFixed(2))
    : 0;

  const avgTempK = totalRecords > 0
    ? Math.round(records.reduce((acc, r) => acc + (r.peakTemperatureK || 0), 0) / totalRecords)
    : 0;

  return {
    totalRecords,
    uniqueMaterials,
    uniqueMissions,
    uniqueGravities,
    totalTelemetryPoints,
    avgFlameSpread,
    avgTempK
  };
}
