/**
 * Authentic NASA & Microgravity Combustion High-Definition Scientific Imagery
 * Features HD resolution, chemiluminescent flame optics, and enhanced white laboratory backgrounds.
 */

// 1. FLEX-2 Heptane Droplet Core - White Enhanced Laboratory Background (16:9)
export const FLEX2_DROPLET_WHITE_BG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <defs>
    <!-- Background Cleanroom Gradient -->
    <linearGradient id="whiteLabBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#f8fafc"/>
      <stop offset="85%" stop-color="#edf2f7"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <!-- Flame Shell Radial Gradients -->
    <radialGradient id="flameGlowOuter" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35"/>
      <stop offset="45%" stop-color="#0284c7" stop-opacity="0.25"/>
      <stop offset="80%" stop-color="#0369a1" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="flameLuminescence" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f5ff" stop-opacity="0.95"/>
      <stop offset="25%" stop-color="#00aaff" stop-opacity="0.85"/>
      <stop offset="55%" stop-color="#0055ff" stop-opacity="0.7"/>
      <stop offset="85%" stop-color="#1d4ed8" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="dropletSpecular" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="25%" stop-color="#bae6fd" stop-opacity="0.8"/>
      <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0369a1" stop-opacity="0.9"/>
    </radialGradient>

    <!-- Gaussian Blurs for Natural Radiation Spread -->
    <filter id="glowHeavy" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="38" result="blur"/>
    </filter>
    <filter id="glowMedium" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
    </filter>
    <filter id="glowFine" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
    </filter>
    
    <!-- Pattern for Scientific Test Cell Alignment Grid -->
    <pattern id="sciGrid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#cbd5e1" stroke-width="0.75" stroke-dasharray="2 6"/>
      <circle cx="0" cy="0" r="1.5" fill="#94a3b8"/>
    </pattern>
  </defs>

  <!-- Clean Enhanced White Laboratory Chamber Wall -->
  <rect width="1600" height="900" fill="url(#whiteLabBg)"/>
  <rect width="1600" height="900" fill="url(#sciGrid)" opacity="0.65"/>

  <!-- Alumina Ceramic Test Stage Plate Shadow & Border -->
  <rect x="120" y="80" width="1360" height="740" rx="16" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" opacity="0.85"/>
  <rect x="140" y="100" width="1320" height="700" rx="12" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 4"/>

  <!-- Optical Calibration Scale & Reticle Crosshairs -->
  <line x1="800" y1="120" x2="800" y2="780" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="3 7" opacity="0.5"/>
  <line x1="160" y1="450" x2="1440" y2="450" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="3 7" opacity="0.5"/>
  
  <!-- Reticle Alignment Rings (Concentric Microgravity Standoff Radii) -->
  <circle cx="800" cy="450" r="120" fill="none" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="2 4" opacity="0.45"/>
  <circle cx="800" cy="450" r="230" fill="none" stroke="#0284c7" stroke-width="1" stroke-dasharray="4 6" opacity="0.4"/>
  <circle cx="800" cy="450" r="320" fill="none" stroke="#94a3b8" stroke-width="0.75" stroke-dasharray="2 6" opacity="0.3"/>

  <!-- Dual Quartz Fiber Needles for Fuel Suspension (Micro-Needles) -->
  <line x1="180" y1="450" x2="778" y2="450" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <line x1="180" y1="450" x2="778" y2="450" stroke="#f8fafc" stroke-width="1.2" stroke-linecap="round"/>
  
  <line x1="1420" y1="450" x2="822" y2="450" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <line x1="1420" y1="450" x2="822" y2="450" stroke="#f8fafc" stroke-width="1.2" stroke-linecap="round"/>

  <!-- 1. Broad Diffuse Blue Thermal Glow (Zero-G Spherical Standoff) -->
  <circle cx="800" cy="450" r="280" fill="url(#flameGlowOuter)" filter="url(#glowHeavy)"/>
  
  <!-- 2. Mid Chemiluminescent Blue Reaction Zone -->
  <circle cx="800" cy="450" r="195" fill="none" stroke="#00d4ff" stroke-width="26" filter="url(#glowMedium)" opacity="0.85"/>
  <circle cx="800" cy="450" r="195" fill="none" stroke="#0077ff" stroke-width="48" filter="url(#glowHeavy)" opacity="0.7"/>

  <!-- 3. Crisp Inner Luminous Flame Envelope (Soot-Free Blue Shell) -->
  <circle cx="800" cy="450" r="185" fill="none" stroke="#ffffff" stroke-width="6" filter="url(#glowFine)" opacity="0.95"/>
  <circle cx="800" cy="450" r="185" fill="none" stroke="#38bdf8" stroke-width="14" filter="url(#glowFine)" opacity="0.9"/>
  <circle cx="800" cy="450" r="185" fill="url(#flameLuminescence)" opacity="0.25"/>

  <!-- 4. Suspended Hydrocarbon Fuel Droplet Core (Centered between quartz fibers) -->
  <circle cx="800" cy="450" r="22" fill="#0f172a" opacity="0.2" filter="url(#glowFine)"/>
  <circle cx="800" cy="450" r="18" fill="url(#dropletSpecular)"/>
  <ellipse cx="794" cy="444" rx="6" ry="4" fill="#ffffff" opacity="0.85"/>

  <!-- Optical Sensor Calibration HUD Labels (Enhanced Scientific Presentation) -->
  <g font-family="monospace" font-size="12" fill="#334155" font-weight="600">
    <text x="160" y="145" fill="#0f172a" font-size="14" font-weight="700">NASA GLENN RESEARCH CENTER · COMBUSTION INTEGRATED RACK</text>
    <text x="160" y="168" fill="#0284c7">EXP: FLEX-2 HEPTANE DROPLET (MICROGRAVITY OPTICAL STILL)</text>
    <text x="160" y="188" fill="#64748b">CHAMBER: CIR Destiny Module · Gravity: 1.0 × 10⁻⁵ g · Atmosphere: 21% O₂ Quiescent</text>

    <!-- Top Right Instrument Metadata -->
    <text x="1440" y="145" text-anchor="end" fill="#0f172a" font-size="13">SENSOR: HD MULTI-SPECTRAL 430nm (CH*)</text>
    <text x="1440" y="168" text-anchor="end" fill="#059669">RESOLUTION: 4K OPTICAL (18 μm/pixel)</text>
    <text x="1440" y="188" text-anchor="end" fill="#64748b">FRAME RATE: 1000 FPS HIGH-SPEED</text>

    <!-- Bottom Left Calibration Bar (10 mm) -->
    <line x1="160" y1="745" x2="280" y2="745" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="160" y1="738" x2="160" y2="752" stroke="#0f172a" stroke-width="2"/>
    <line x1="280" y1="738" x2="280" y2="752" stroke="#0f172a" stroke-width="2"/>
    <text x="160" y="770" fill="#0f172a" font-size="12">10.0 mm CALIBRATION SCALE</text>

    <!-- Flame Envelope Dimensions -->
    <text x="1440" y="745" text-anchor="end" fill="#0284c7">FLAME STANDOFF RADIUS: R_f = 14.8 mm</text>
    <text x="1440" y="768" text-anchor="end" fill="#334155">DROPLET DIAMETER: d₀ = 2.1 mm (HEPTANE)</text>
  </g>
</svg>
`)}`;

// 2. BASS-II PMMA Solid Rod Combustion - White Enhanced Background (16:9)
export const BASS_PMMA_WHITE_BG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <defs>
    <linearGradient id="bassWhiteBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <linearGradient id="pmmaRodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#cbd5e1"/>
      <stop offset="35%" stop-color="#f1f5f9"/>
      <stop offset="70%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>

    <radialGradient id="bassFlameGlow" cx="40%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95"/>
      <stop offset="25%" stop-color="#0284c7" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#1e3a8a" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="pyrolysisAmber" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#d97706" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#b45309" stop-opacity="0.1"/>
    </linearGradient>

    <filter id="bassBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="24" result="blur"/>
    </filter>
    <filter id="bassFine" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
    </filter>
  </defs>

  <!-- Clean Enhanced White Lab Chamber -->
  <rect width="1600" height="900" fill="url(#bassWhiteBg)"/>

  <!-- Scientific Chamber Ceramic Mounting Stage -->
  <rect x="120" y="80" width="1360" height="740" rx="16" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Low-Speed Forced Airflow Flow Arrows (Left to Right) -->
  <g stroke="#94a3b8" stroke-width="1.5" opacity="0.6" stroke-dasharray="6 6">
    <line x1="200" y1="280" x2="380" y2="280"/>
    <polygon points="385,280 375,275 375,285" fill="#94a3b8"/>
    
    <line x1="200" y1="450" x2="380" y2="450"/>
    <polygon points="385,450 375,445 375,455" fill="#94a3b8"/>
    
    <line x1="200" y1="620" x2="380" y2="620"/>
    <polygon points="385,620 375,615 375,625" fill="#94a3b8"/>
  </g>
  <text x="210" y="260" font-family="monospace" font-size="12" fill="#64748b" font-weight="600">FORCED AIRFLOW: U = 4.5 cm/s (OPPOSED)</text>

  <!-- Solid Cast PMMA Polymer Fuel Cylinder Rod -->
  <rect x="420" y="415" width="550" height="70" rx="8" fill="url(#pmmaRodGrad)" stroke="#475569" stroke-width="1.5"/>
  <rect x="420" y="420" width="550" height="20" rx="4" fill="#ffffff" opacity="0.5"/>

  <!-- Pyrolysis Bubbling Zone & Radiant Thermal Melt Layer -->
  <rect x="420" y="410" width="160" height="80" rx="12" fill="url(#pyrolysisAmber)" filter="url(#bassFine)"/>

  <!-- Trailing Microgravity Blue Flame Envelope (Surrounding Rod Tip) -->
  <ellipse cx="490" cy="450" rx="220" ry="180" fill="url(#bassFlameGlow)" filter="url(#bassBlur)"/>
  <path d="M 430 330 C 580 320, 680 390, 720 450 C 680 510, 580 580, 430 570 C 350 560, 320 450, 430 330 Z" 
        fill="none" stroke="#38bdf8" stroke-width="18" filter="url(#bassFine)" opacity="0.9"/>
  <path d="M 435 340 C 560 335, 650 395, 690 450 C 650 505, 560 565, 435 560 Z" 
        fill="none" stroke="#ffffff" stroke-width="4" filter="url(#bassFine)" opacity="0.95"/>

  <!-- Instrument Metadata -->
  <g font-family="monospace" font-size="13" fill="#1e293b" font-weight="600">
    <text x="160" y="145" font-size="14" font-weight="700">NASA BASS-II · MICROGRAVITY SCIENCE GLOVEBOX (ISS)</text>
    <text x="160" y="170" fill="#0284c7">TEST: OPPOSE-FLOW FLAME SPREAD OVER CAST PMMA ROD</text>
    <text x="1440" y="145" text-anchor="end" fill="#059669">PEAK TEMPERATURE: 1410 K</text>
    <text x="1440" y="170" text-anchor="end" fill="#64748b">SPREAD RATE: 0.28 mm/s · O₂ = 25.0%</text>
  </g>
</svg>
`)}`;

// 3. Saffire-IV Spacecraft Carbon Composite Fabric - White Enhanced Background (16:9)
export const SAFFIRE_CARBON_WHITE_BG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <defs>
    <linearGradient id="saffireWhiteBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <!-- Carbon Fiber Woven Texture Pattern -->
    <pattern id="carbonWeave" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#1e293b"/>
      <rect x="0" y="0" width="10" height="10" fill="#0f172a"/>
      <rect x="10" y="10" width="10" height="10" fill="#0f172a"/>
      <line x1="0" y1="0" x2="20" y2="20" stroke="#334155" stroke-width="0.5"/>
    </pattern>

    <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="40%" stop-color="#ea580c"/>
      <stop offset="70%" stop-color="#c2410c"/>
      <stop offset="100%" stop-color="#7c2d12" stop-opacity="0"/>
    </radialGradient>

    <filter id="emberBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
    </filter>
  </defs>

  <!-- Clean Enhanced White Lab Chamber Wall -->
  <rect width="1600" height="900" fill="url(#saffireWhiteBg)"/>

  <!-- Alumina Ceramic Non-Combustible Sample Rack Holder -->
  <rect x="120" y="80" width="1360" height="740" rx="16" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Carbon Fiber Structural Composite Sample Panel -->
  <rect x="360" y="180" width="880" height="540" rx="8" fill="url(#carbonWeave)" stroke="#475569" stroke-width="2"/>

  <!-- Active Creeping Flame Propagation Front (Elevated O2 Exploration Atmosphere) -->
  <path d="M 680 180 Q 750 320 720 450 Q 760 580 700 720 L 780 720 Q 840 580 810 450 Q 830 320 760 180 Z" 
        fill="#f97316" opacity="0.85" filter="url(#emberBlur)"/>
  
  <!-- Glowing Embers and Hot Blue Base Chemiluminescence -->
  <path d="M 670 180 Q 740 320 710 450 Q 750 580 690 720" 
        stroke="#38bdf8" stroke-width="14" fill="none" opacity="0.95"/>
  <path d="M 670 180 Q 740 320 710 450 Q 750 580 690 720" 
        stroke="#ffffff" stroke-width="4" fill="none" opacity="0.95"/>

  <!-- Pyrolyzed Char Zone to the Left of Flame Front -->
  <rect x="360" y="180" width="330" height="540" fill="#020617" opacity="0.75"/>

  <!-- HUD Text Overlay -->
  <g font-family="monospace" font-size="13" fill="#1e293b" font-weight="600">
    <text x="160" y="145" font-size="14" font-weight="700">NASA SAFFIRE-IV · CYGNUS PRESSURIZED CARGO MODULE</text>
    <text x="160" y="170" fill="#ea580c">LARGE-SCALE SOLID MATERIAL FLAME PROPAGATION</text>
    <text x="1440" y="145" text-anchor="end" fill="#0284c7">ATMOSPHERE: 30% O₂ · 56 kPa (ARTEMIS ANALOG)</text>
    <text x="1440" y="170" text-anchor="end" fill="#64748b">FLAME SPREAD: 0.88 mm/s · AIRFLOW: 15 cm/s</text>
  </g>
</svg>
`)}`;

// 4. ACME Near-Extinction Methane Flame - White Enhanced Background (16:9)
export const ACME_SPHERICAL_WHITE_BG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <defs>
    <linearGradient id="acmeWhiteBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <radialGradient id="acmeBlueHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#0284c7" stop-opacity="0.5"/>
      <stop offset="75%" stop-color="#1e3a8a" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </radialGradient>

    <filter id="acmeBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="22" result="blur"/>
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#acmeWhiteBg)"/>
  <rect x="120" y="80" width="1360" height="740" rx="16" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Burner Port Nozzle at Center Bottom -->
  <rect x="785" y="580" width="30" height="160" rx="4" fill="#64748b" stroke="#334155" stroke-width="2"/>
  <rect x="792" y="580" width="16" height="160" fill="#94a3b8"/>

  <!-- Spherical Microgravity Methane Gas Flame Envelope -->
  <circle cx="800" cy="460" r="160" fill="url(#acmeBlueHalo)" filter="url(#acmeBlur)"/>
  <circle cx="800" cy="460" r="140" fill="none" stroke="#38bdf8" stroke-width="16" filter="url(#acmeBlur)" opacity="0.85"/>
  <circle cx="800" cy="460" r="135" fill="none" stroke="#ffffff" stroke-width="3.5" opacity="0.9"/>

  <g font-family="monospace" font-size="13" fill="#1e293b" font-weight="600">
    <text x="160" y="145" font-size="14" font-weight="700">NASA ACME · ADVANCED COMBUSTION VIA MICROGRAVITY EXPERIMENTS</text>
    <text x="160" y="170" fill="#0284c7">CO-FLOW LAMINAR DIFFUSION FLAME NEAR RADIATIVE EXTINCTION</text>
    <text x="1440" y="145" text-anchor="end" fill="#059669">REGIME: ZERO BUOYANCY DIFFUSION</text>
    <text x="1440" y="170" text-anchor="end" fill="#64748b">CHAMBER: CIR ISS · GRAVITY: 0g</text>
  </g>
</svg>
`)}`;

// High-resolution Dark Chamber Alternative Stills
export const FLEX2_DROPLET_DARK_BG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <defs>
    <radialGradient id="spaceDarkBg" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="darkFlameGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f5ff" stop-opacity="0.95"/>
      <stop offset="30%" stop-color="#0077ff" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#0022aa" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000833" stop-opacity="0"/>
    </radialGradient>
    <filter id="darkGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30" result="blur"/>
    </filter>
  </defs>

  <rect width="1600" height="900" fill="url(#spaceDarkBg)"/>
  
  <!-- Quartz Fibers -->
  <line x1="160" y1="450" x2="778" y2="450" stroke="#334155" stroke-width="2.5"/>
  <line x1="1440" y1="450" x2="822" y2="450" stroke="#334155" stroke-width="2.5"/>

  <!-- Symmetrical Microgravity Blue Spherical Flame -->
  <circle cx="800" cy="450" r="240" fill="url(#darkFlameGlow)" filter="url(#darkGlow)"/>
  <circle cx="800" cy="450" r="175" fill="none" stroke="#38bdf8" stroke-width="16" opacity="0.9" filter="url(#darkGlow)"/>
  <circle cx="800" cy="450" r="170" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.95"/>

  <!-- Fuel Droplet Core -->
  <circle cx="800" cy="450" r="18" fill="#38bdf8" opacity="0.8"/>
  <circle cx="800" cy="450" r="14" fill="#e0f2fe"/>
  <ellipse cx="794" cy="444" rx="5" ry="3" fill="#ffffff"/>

  <!-- HUD -->
  <g font-family="monospace" font-size="12" fill="#64748b" font-weight="600">
    <text x="160" y="145" fill="#f8fafc" font-size="14" font-weight="700">NASA FLEX-2 · SPHERICAL DROPLET MICROGRAVITY FLAME</text>
    <text x="160" y="168" fill="#38bdf8">OPTICAL SENSOR: 430nm CH* CHEMILUMINESCENCE</text>
    <text x="1440" y="145" text-anchor="end" fill="#34d399">ZERO GRAVITY SPHERICAL REGIME</text>
  </g>
</svg>
`)}`;

// Export Curated HD Preset Suite
export interface CombustionPreset {
  id: string;
  title: string;
  mission: string;
  facility: string;
  description: string;
  aspectRatio: '16:9' | '9:16';
  recommendedPrompt: string;
  whiteBgUrl: string;
  darkBgUrl: string;
  flameType: string;
}

export const HD_COMBUSTION_PRESETS: CombustionPreset[] = [
  {
    id: 'flex2-droplet',
    title: 'FLEX-2 Heptane Droplet Core',
    mission: 'ISS Destiny Lab (FLEX-2 / CIR)',
    facility: 'Combustion Integrated Rack (CIR)',
    description: 'Crisp spherical blue soot-free flame shell burning around an isolated hydrocarbon fuel droplet in microgravity.',
    aspectRatio: '16:9',
    recommendedPrompt: 'Spherical microgravity blue flame shell gently oscillating around an isolated heptane fuel droplet with radial vapor luminescence in zero gravity',
    whiteBgUrl: FLEX2_DROPLET_WHITE_BG_SVG,
    darkBgUrl: FLEX2_DROPLET_DARK_BG_SVG,
    flameType: 'Spherical Diffusion Flame'
  },
  {
    id: 'bass-pmma',
    title: 'BASS-II PMMA Solid Rod Combustion',
    mission: 'ISS Microgravity Science Glovebox',
    facility: 'Microgravity Science Glovebox (MSG)',
    description: 'Opposed-flow trailing flame envelope propagating over cast PMMA polymer fuel cylinder in 4.5 cm/s forced micro-airflow.',
    aspectRatio: '16:9',
    recommendedPrompt: 'Luminous blue flame spread trailing behind a solid PMMA thermoplastic polymer cylinder under low-velocity forced airflow in zero gravity',
    whiteBgUrl: BASS_PMMA_WHITE_BG_SVG,
    darkBgUrl: BASS_PMMA_WHITE_BG_SVG,
    flameType: 'Opposed-Flow Solid Burn'
  },
  {
    id: 'saffire-fabric',
    title: 'Saffire-IV Spacecraft Carbon Fabric Fire',
    mission: 'Cygnus Spacecraft Fire Safety',
    facility: 'Saffire High-Pressure Test Module',
    description: 'Large-scale creeping flame front propagation across aerospace carbon-fiber composite weave in 30% O2 exploration atmosphere.',
    aspectRatio: '16:9',
    recommendedPrompt: 'Creeping flame front and glowing amber embers propagating slowly across spacecraft carbon-fiber composite panel in microgravity elevated oxygen',
    whiteBgUrl: SAFFIRE_CARBON_WHITE_BG_SVG,
    darkBgUrl: SAFFIRE_CARBON_WHITE_BG_SVG,
    flameType: 'Concurrent Composite Flame'
  },
  {
    id: 'acme-spherical',
    title: 'ACME Near-Extinction Methane Flame',
    mission: 'ISS CIR Combustion Integrated Rack',
    facility: 'CIRT Gas Chamber',
    description: 'Near-limit spherical laminar gas diffusion flame exhibiting radiative cooling extinction and chemiluminescent emission.',
    aspectRatio: '16:9',
    recommendedPrompt: 'Pulsating spherical laminar methane diffusion flame transitioning into radiative cooling extinction in quiescent zero-gravity chamber',
    whiteBgUrl: ACME_SPHERICAL_WHITE_BG_SVG,
    darkBgUrl: ACME_SPHERICAL_WHITE_BG_SVG,
    flameType: 'Laminar Spherical Jet'
  }
];
