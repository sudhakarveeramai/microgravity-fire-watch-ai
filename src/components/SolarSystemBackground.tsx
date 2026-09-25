import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Orbit, 
  Sliders, 
  Layers, 
  Sparkles, 
  Radio, 
  Crosshair,
  RotateCcw,
  Volume2
} from 'lucide-react';

interface PlanetConfig {
  id: string;
  name: string;
  distance: number; // distance from Sun
  radius: number;
  orbitSpeed: number; // radians per frame at 1x
  color: string;
  glowColor: string;
  gravityG: string;
  fireResearchRole: string;
  hasRing?: boolean;
  ringRadiusInner?: number;
  ringRadiusOuter?: number;
  hasMoon?: boolean;
  moons?: { radius: number; distance: number; speed: number; color: string }[];
}

const PLANETS: PlanetConfig[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    distance: 70,
    radius: 3.5,
    orbitSpeed: 0.035,
    color: '#A3A3A3',
    glowColor: 'rgba(163, 163, 163, 0.4)',
    gravityG: '0.38g',
    fireResearchRole: 'Extreme thermal gradient analog'
  },
  {
    id: 'venus',
    name: 'Venus',
    distance: 105,
    radius: 5.5,
    orbitSpeed: 0.024,
    color: '#E0A96D',
    glowColor: 'rgba(224, 169, 109, 0.4)',
    gravityG: '0.904g',
    fireResearchRole: 'Supercritical CO₂ pyrolytic kinetics'
  },
  {
    id: 'earth',
    name: 'Earth & ISS',
    distance: 150,
    radius: 6.5,
    orbitSpeed: 0.018,
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.5)',
    gravityG: '1.0g / 10⁻⁶g LEO',
    fireResearchRole: 'ISS CIR & Saffire orbital benchmarks',
    hasMoon: true,
    moons: [{ radius: 2, distance: 14, speed: 0.07, color: '#E2E8F0' }]
  },
  {
    id: 'mars',
    name: 'Mars',
    distance: 200,
    radius: 4.5,
    orbitSpeed: 0.013,
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    gravityG: '0.38g',
    fireResearchRole: 'Partial-gravity exploration atmosphere analogs',
    hasMoon: true,
    moons: [
      { radius: 1.2, distance: 9, speed: 0.09, color: '#94A3B8' },
      { radius: 0.9, distance: 13, speed: 0.06, color: '#64748B' }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    distance: 280,
    radius: 13,
    orbitSpeed: 0.007,
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    gravityG: '2.528g',
    fireResearchRole: 'Extreme hyper-gravity buoyant convection',
    moons: [
      { radius: 1.5, distance: 20, speed: 0.05, color: '#FDE047' },
      { radius: 1.8, distance: 26, speed: 0.035, color: '#E0F2FE' }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    distance: 360,
    radius: 11,
    orbitSpeed: 0.005,
    color: '#FDE68A',
    glowColor: 'rgba(253, 230, 138, 0.35)',
    gravityG: '1.065g',
    fireResearchRole: 'Cold dense atmospheric diffusion limits',
    hasRing: true,
    ringRadiusInner: 15,
    ringRadiusOuter: 24
  }
];

interface SolarSystemBackgroundProps {
  opacity?: number; // Background opacity when embedded (0 to 1)
  isFullScreenMode?: boolean;
  onToggleFullScreen?: () => void;
  onSelectPlanet?: (planetId: string) => void;
  initialViewMode?: '3d' | '2d';
}

export const SolarSystemBackground: React.FC<SolarSystemBackgroundProps> = ({
  opacity = 0.85,
  isFullScreenMode = false,
  onToggleFullScreen,
  onSelectPlanet,
  initialViewMode = '3d'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [showOrbitRings, setShowOrbitRings] = useState(true);
  const [showHUDTelemetry, setShowHUDTelemetry] = useState(true);
  const [focusedPlanet, setFocusedPlanet] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(initialViewMode);

  // Smooth depth interpolation ref (1.0 = 3D depth perspective, 0.0 = 2D flat schematic)
  const depthFactorRef = useRef(initialViewMode === '3d' ? 1.0 : 0.0);

  // Mouse cursor tracking for 3D parallax & HUD reticle
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [cursorTelemetry, setCursorTelemetry] = useState({
    ra: "14h 29m 42s",
    dec: "-62° 40' 46\"",
    camPitch: "+0.0°",
    camYaw: "+0.0°",
    hoveredPlanet: null as string | null
  });

  // Track cursor position and update target smoothly
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    mousePosRef.current.targetX = normX;
    mousePosRef.current.targetY = normY;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Handle high DPI crisp rendering
    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial stars & asteroids field
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    const asteroids: { angle: number; distance: number; size: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 180; i++) {
      asteroids.push({
        angle: Math.random() * Math.PI * 2,
        distance: 230 + (Math.random() - 0.5) * 35,
        size: Math.random() * 1.5 + 0.5,
        speed: 0.008 + (Math.random() - 0.5) * 0.003,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    // Planetary orbit angles
    const planetAngles: Record<string, number> = {};
    PLANETS.forEach((p, idx) => {
      planetAngles[p.id] = (idx * Math.PI) / 3;
    });

    let globalTick = 0;

    // Main render loop with smooth 3D parallax tilt & 2D schematic projection
    const render = () => {
      globalTick += 1;

      // Smooth depth interpolation (1.0 = 3D perspective, 0.0 = 2D flat schematic)
      const targetDepth = viewMode === '3d' ? 1.0 : 0.0;
      depthFactorRef.current += (targetDepth - depthFactorRef.current) * 0.08;
      const depth = depthFactorRef.current;

      // Smooth lerp mouse coordinates
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.06;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.06;

      const mouseX = mousePosRef.current.x;
      const mouseY = mousePosRef.current.y;

      // In 3D depth mode, mouse coordinates tilt the camera pitch & yaw.
      // In 2D schematic mode, camera stays orthogonal top-down (pitch=0, yaw=0).
      const pitchAngle = mouseY * 0.45 * depth;
      const yawAngle = mouseX * 0.45 * depth;

      // Update telemetry display once every 12 frames
      if (globalTick % 12 === 0) {
        const pitchDeg = (pitchAngle * (180 / Math.PI)).toFixed(1);
        const yawDeg = (yawAngle * (180 / Math.PI)).toFixed(1);
        setCursorTelemetry((prev) => ({
          ...prev,
          camPitch: `${pitchAngle >= 0 ? '+' : ''}${pitchDeg}°`,
          camYaw: `${yawAngle >= 0 ? '+' : ''}${yawDeg}°`
        }));
      }

      ctx.clearRect(0, 0, width, height);

      // Deep space spaceflight dark navy backdrop (shifts to blueprint navy in 2D mode)
      const spaceGrad = ctx.createRadialGradient(
        width / 2 + mouseX * 80 * depth,
        height / 2 + mouseY * 80 * depth,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      if (depth < 0.5) {
        spaceGrad.addColorStop(0, '#041026');
        spaceGrad.addColorStop(0.5, '#030B1A');
        spaceGrad.addColorStop(1, '#020610');
      } else {
        spaceGrad.addColorStop(0, '#07152D');
        spaceGrad.addColorStop(0.4, '#050D1A');
        spaceGrad.addColorStop(1, '#02060E');
      }

      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Save root transform
      ctx.save();

      // Center origin with cursor parallax offset (active in 3D mode)
      const centerX = width / 2 + mouseX * 40 * depth;
      const centerY = height / 2 + mouseY * 40 * depth;
      ctx.translate(centerX, centerY);

      // Orbit tilt calculation:
      // In 2D schematic mode, orbits are true circles: orbitTiltY = 1.0, orbitTiltX = 1.0.
      // In 3D depth mode, orbits are compressed ellipses with cursor pitch/yaw shift.
      const target3DTiltY = Math.cos(0.95 + pitchAngle * 0.6);
      const target3DTiltX = 1 + Math.abs(yawAngle) * 0.15;
      const orbitTiltY = 1.0 * (1 - depth) + target3DTiltY * depth;
      const orbitTiltX = 1.0 * (1 - depth) + target3DTiltX * depth;

      // 1. Draw Starfield with parallax drift (attenuated in 2D schematic)
      stars.forEach((star) => {
        const sx = star.x + mouseX * star.speed * 800 * depth;
        const sy = star.y + mouseY * star.speed * 800 * depth;
        const pulse = Math.sin(globalTick * 0.04 + star.x) * 0.2 + star.alpha;
        const starAlpha = depth < 0.5 ? 0.2 : Math.max(0.1, pulse);

        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw 2D Schematic Polar Coordinates Grid & AU Scale Rings (when in 2D mode)
      if (depth < 0.85) {
        const schematicAlpha = (1 - depth);
        ctx.save();

        // Radial degree axes: 8 radial rays (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
        const cardinalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
        cardinalAngles.forEach((deg) => {
          const rad = (deg * Math.PI) / 180;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(rad) * 440, Math.sin(rad) * 440);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * schematicAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.setLineDash([2, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Degree label at outer rim
          ctx.fillStyle = `rgba(56, 189, 248, ${0.6 * schematicAlpha})`;
          ctx.font = '8px monospace';
          const lx = Math.cos(rad) * 452;
          const ly = Math.sin(rad) * 452;
          ctx.fillText(`${deg.toString().padStart(3, '0')}°`, lx - 8, ly + 3);
        });

        // Schematic Cartesian Crosshair at Sol Center
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 * schematicAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-35, 0);
        ctx.lineTo(35, 0);
        ctx.moveTo(0, -35);
        ctx.lineTo(0, 35);
        ctx.stroke();

        ctx.restore();
      }

      // 3. Draw Asteroid Belt
      asteroids.forEach((ast) => {
        if (isPlaying) {
          ast.angle += ast.speed * timeSpeed;
        }
        const ax = Math.cos(ast.angle + yawAngle * 0.3) * ast.distance * orbitTiltX;
        const ay = Math.sin(ast.angle + yawAngle * 0.3) * ast.distance * orbitTiltY;

        ctx.fillStyle = `rgba(148, 163, 184, ${ast.alpha * (depth < 0.5 ? 0.4 : 0.7)})`;
        ctx.beginPath();
        ctx.arc(ax, ay, ast.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Draw Orbit Trajectory Rings & HUD Radial Grid
      if (showOrbitRings) {
        PLANETS.forEach((planet) => {
          ctx.beginPath();
          ctx.ellipse(0, 0, planet.distance * orbitTiltX, planet.distance * orbitTiltY, yawAngle * 0.2, 0, Math.PI * 2);
          ctx.strokeStyle = planet.id === 'earth' || planet.id === 'mars' 
            ? 'rgba(56, 189, 248, 0.35)' 
            : 'rgba(71, 85, 105, 0.22)';
          ctx.lineWidth = depth < 0.5 ? 1.25 : 1;
          ctx.setLineDash(depth < 0.5 ? [4, 4] : [3, 6]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Orbit Perihelion marker ticks
          const tickAngle = Math.PI * 0.25;
          const tx = Math.cos(tickAngle) * planet.distance * orbitTiltX;
          const ty = Math.sin(tickAngle) * planet.distance * orbitTiltY;
          ctx.fillStyle = depth < 0.5 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(148, 163, 184, 0.3)';
          ctx.fillRect(tx - 1.5, ty - 1.5, 3, 3);

          // In 2D schematic mode, draw distance label on orbit line
          if (depth < 0.5 && showHUDTelemetry) {
            ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.font = '7px monospace';
            ctx.fillText(`R:${planet.distance} AU`, 6, -planet.distance * orbitTiltY - 3);
          }
        });

        // Orbital Axis reticle lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(-450, 0);
        ctx.lineTo(450, 0);
        ctx.moveTo(0, -350 * orbitTiltY);
        ctx.lineTo(0, 350 * orbitTiltY);
        ctx.stroke();
      }

      // 5. Draw Central Radiant Sun Core & Corona
      const sunPulse = Math.sin(globalTick * 0.05) * 3;
      const sunCoreRadius = 22 + sunPulse;

      // Outer Corona Volumetric Atmosphere
      const coronaGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 75 + sunPulse * 2);
      coronaGrad.addColorStop(0, 'rgba(255, 230, 150, 0.95)');
      coronaGrad.addColorStop(0.2, 'rgba(255, 140, 20, 0.65)');
      coronaGrad.addColorStop(0.5, 'rgba(255, 80, 10, 0.25)');
      coronaGrad.addColorStop(1, 'rgba(255, 50, 0, 0.0)');

      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 75 + sunPulse * 2, 0, Math.PI * 2);
      ctx.fill();

      // Inner Brilliant Sun Disk
      const sunDiskGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, sunCoreRadius);
      sunDiskGrad.addColorStop(0, '#FFFFFF');
      sunDiskGrad.addColorStop(0.3, '#FEF08A');
      sunDiskGrad.addColorStop(0.7, '#F59E0B');
      sunDiskGrad.addColorStop(1, '#DC2626');

      ctx.fillStyle = sunDiskGrad;
      ctx.beginPath();
      ctx.arc(0, 0, sunCoreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Solar flare rays
      ctx.save();
      ctx.rotate(globalTick * 0.005);
      for (let r = 0; r < 8; r++) {
        ctx.rotate((Math.PI * 2) / 8);
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sunCoreRadius + 2, 0);
        ctx.lineTo(sunCoreRadius + 14 + Math.sin(globalTick * 0.1 + r) * 6, 0);
        ctx.stroke();
      }
      ctx.restore();

      // Sun Telemetry Tag
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.font = '9px monospace';
      ctx.fillText('SOL CORE: 1.57e7 K', 28, 4);

      // 5. Draw Revolving Planets with Orbital Positions & Moons
      let currentHoveredPlanet: string | null = null;
      const screenCoords: Record<string, { x: number; y: number; radius: number }> = {};

      for (const planet of PLANETS) {
        // Advance orbit angle
        if (isPlaying) {
          planetAngles[planet.id] += planet.orbitSpeed * timeSpeed;
        }
        const angle = planetAngles[planet.id];

        // 3D projected coordinates on tilted ellipse
        const px = Math.cos(angle + yawAngle * 0.2) * planet.distance * orbitTiltX;
        const py = Math.sin(angle + yawAngle * 0.2) * planet.distance * orbitTiltY;

        // Screen coordinate for mouse detection
        const screenX = centerX + px;
        const screenY = centerY + py;
        screenCoords[planet.id] = { x: screenX, y: screenY, radius: planet.radius };

        // Test hover distance
        const cursorScreenX = (mouseX + 1) * 0.5 * width;
        const cursorScreenY = (mouseY + 1) * 0.5 * height;
        const distToCursor = Math.hypot(cursorScreenX - screenX, cursorScreenY - screenY);
        const isHovered = distToCursor < planet.radius * 2.5 + 16 || focusedPlanet === planet.id;

        if (isHovered) {
          currentHoveredPlanet = planet.name;
        }

        // Draw Planet Shadow / Glow
        const planetGlow = ctx.createRadialGradient(px, py, planet.radius * 0.6, px, py, planet.radius * 3);
        planetGlow.addColorStop(0, planet.glowColor);
        planetGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = planetGlow;
        ctx.beginPath();
        ctx.arc(px, py, planet.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body
        const bodyGrad = ctx.createRadialGradient(
          px - planet.radius * 0.35,
          py - planet.radius * 0.35,
          planet.radius * 0.1,
          px,
          py,
          planet.radius
        );
        bodyGrad.addColorStop(0, '#FFFFFF');
        bodyGrad.addColorStop(0.3, planet.color);
        bodyGrad.addColorStop(1, '#050B14');

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
        ctx.fill();

        // Special: Saturn's Rings
        if (planet.hasRing && planet.ringRadiusInner && planet.ringRadiusOuter) {
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(px, py, planet.ringRadiusOuter, planet.ringRadiusOuter * 0.35, 0.4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(253, 230, 138, 0.6)';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }

        // Special: Orbiting Moons (Earth's Moon, Mars Phobos/Deimos)
        if (planet.hasMoon && planet.moons) {
          planet.moons.forEach((m, mIdx) => {
            const mAngle = globalTick * m.speed + mIdx * Math.PI;
            const mx = px + Math.cos(mAngle) * m.distance;
            const my = py + Math.sin(mAngle) * m.distance * orbitTiltY;

            ctx.fillStyle = m.color;
            ctx.beginPath();
            ctx.arc(mx, my, m.radius, 0, Math.PI * 2);
            ctx.fill();

            // Label for Earth's Moon (Artemis Base Analog)
            if (planet.id === 'earth' && showHUDTelemetry) {
              ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
              ctx.font = '8px monospace';
              ctx.fillText('MOON 0.166g', mx + 4, my - 2);
            }
          });
        }

        // Draw Futuristic Target HUD Bracket if Hovered or Focused
        if (isHovered && showHUDTelemetry) {
          ctx.save();
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.25;

          const boxSize = planet.radius + 8;
          // Reticle corners
          ctx.strokeRect(px - boxSize, py - boxSize, boxSize * 2, boxSize * 2);

          // Telemetry Callout Box
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 1;
          const calloutX = px + boxSize + 6;
          const calloutY = py - 20;
          ctx.fillRect(calloutX, calloutY, 130, 48);
          ctx.strokeRect(calloutX, calloutY, 130, 48);

          // Connecting line
          ctx.beginPath();
          ctx.moveTo(px + boxSize, py);
          ctx.lineTo(calloutX, py);
          ctx.stroke();

          // Text content
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`TARGET: ${planet.name.toUpperCase()}`, calloutX + 6, calloutY + 12);
          ctx.fillStyle = '#38BDF8';
          ctx.font = '8px monospace';
          ctx.fillText(`GRAV: ${planet.gravityG}`, calloutX + 6, calloutY + 24);
          ctx.fillStyle = '#F59E0B';
          ctx.fillText(`DIST: ${planet.distance} AU (rel)`, calloutX + 6, calloutY + 34);
          ctx.fillStyle = '#94A3B8';
          ctx.fillText(`ORB_V: ${(planet.orbitSpeed * 1000).toFixed(0)} km/s`, calloutX + 6, calloutY + 44);

          ctx.restore();
        } else if (showHUDTelemetry) {
          // Subtle default name tag
          ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
          ctx.font = '9px Space Grotesk, sans-serif';
          ctx.fillText(planet.name, px + planet.radius + 4, py + 3);
        }
      }

      // 6. Draw Cybernetic HUD Laser Scan Lines & Peripheral Grid (Tridimensi Style)
      if (showHUDTelemetry) {
        ctx.restore(); // restore to root canvas coordinates

        // Top Left System Header
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.font = '10px monospace';
        ctx.fillText('SOLAR SYSTEM ORRERY · TIME ENGINE V4.2', 20, 28);
        ctx.fillStyle = depth < 0.5 ? 'rgba(251, 191, 36, 0.9)' : 'rgba(56, 189, 248, 0.75)';
        ctx.font = '9px monospace';
        const projModeText = depth < 0.5 
          ? 'PROJECTION: 2D FLAT SCHEMATIC (ORTHOGONAL TOP-DOWN)' 
          : 'PROJECTION: 3D DEPTH PERSPECTIVE (CURSOR TILT ACTIVE)';
        ctx.fillText(projModeText, 20, 42);

        // Top Right Coordinates
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(251, 146, 60, 0.85)';
        ctx.font = '10px monospace';
        ctx.fillText(`CAMERA PITCH: ${cursorTelemetry.camPitch}  YAW: ${cursorTelemetry.camYaw}`, width - 20, 28);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.fillText(`EPOCH: J2026.5 · SOL RADIUS: 6.96e5 KM`, width - 20, 42);
        ctx.textAlign = 'left';

        // Scanning Laser Sweep line
        const sweepY = (Math.sin(globalTick * 0.02) * 0.5 + 0.5) * height;
        const sweepGrad = ctx.createLinearGradient(0, sweepY, width, sweepY);
        sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        sweepGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
        sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, sweepY - 1, width, 2);

        // Sci-Fi Corner Brackets
        const cornerSize = 24;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;

        // Top Left
        ctx.beginPath();
        ctx.moveTo(12, 12 + cornerSize);
        ctx.lineTo(12, 12);
        ctx.lineTo(12 + cornerSize, 12);
        ctx.stroke();

        // Top Right
        ctx.beginPath();
        ctx.moveTo(width - 12 - cornerSize, 12);
        ctx.lineTo(width - 12, 12);
        ctx.lineTo(width - 12, 12 + cornerSize);
        ctx.stroke();

        // Bottom Left
        ctx.beginPath();
        ctx.moveTo(12, height - 12 - cornerSize);
        ctx.lineTo(12, height - 12);
        ctx.lineTo(12 + cornerSize, height - 12);
        ctx.stroke();

        // Bottom Right
        ctx.beginPath();
        ctx.moveTo(width - 12 - cornerSize, height - 12);
        ctx.lineTo(width - 12, height - 12);
        ctx.lineTo(width - 12, height - 12 - cornerSize);
        ctx.stroke();

        // 7. Dynamic Cursor Move Reticle Animation
        const curX = (mouseX + 1) * 0.5 * width;
        const curY = (mouseY + 1) * 0.5 * height;

        ctx.save();
        ctx.translate(curX, curY);

        // Dual spinning rings
        ctx.rotate(globalTick * 0.03);
        ctx.strokeStyle = currentHoveredPlanet ? 'rgba(251, 146, 60, 0.85)' : 'rgba(56, 189, 248, 0.65)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 16, Math.PI, Math.PI * 1.7);
        ctx.stroke();

        ctx.rotate(-globalTick * 0.05);
        ctx.strokeStyle = currentHoveredPlanet ? 'rgba(251, 146, 60, 0.5)' : 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 24, Math.PI, Math.PI * 1.5);
        ctx.stroke();

        // Center crosshair dot
        ctx.fillStyle = currentHoveredPlanet ? '#F59E0B' : '#38BDF8';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        // Cursor coordinate readout tag
        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.font = '8px monospace';
        ctx.fillText(`X:${Math.round(curX)} Y:${Math.round(curY)}`, 22, -10);
        if (currentHoveredPlanet) {
          ctx.fillStyle = '#F59E0B';
          ctx.fillText(`LOCK: ${currentHoveredPlanet.toUpperCase()}`, 22, 2);
        }

        ctx.restore();
      } else {
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, timeSpeed, showOrbitRings, showHUDTelemetry, focusedPlanet, viewMode]);

  return (
    <div 
      className={`relative w-full overflow-hidden select-none transition-all duration-500 ${
        isFullScreenMode ? 'fixed inset-0 z-50 bg-[#02060E]' : 'h-full min-h-[440px] rounded-2xl border border-slate-800/80 shadow-2xl'
      }`}
      onMouseMove={handleMouseMove}
      style={{ opacity }}
    >
      {/* Interactive Canvas Viewport */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-crosshair"
      />

      {/* Futuristic HUD Floating Controls Bar (Inspired by Dribbble Futuristic UI 3D Animation) */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/85 border border-slate-800/90 backdrop-blur-md text-xs font-mono text-slate-300 shadow-2xl">
        {/* Play / Pause & Time Engine */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isPlaying 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <span className="text-slate-500 text-[10px] hidden sm:inline">WARP:</span>
          {([0.5, 1, 2, 4] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => setTimeSpeed(spd)}
              className={`px-2 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                timeSpeed === spd
                  ? 'bg-blue-600/40 text-blue-300 border border-blue-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* 2D Schematic vs 3D Depth Toggle Switch */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              viewMode === '2d'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to Flat 2D Schematic Blueprint View (Orthogonal top-down)"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>2D Schematic</span>
          </button>

          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch to 3D Depth View with Cursor Parallax Perspective"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Depth</span>
          </button>
        </div>

        {/* Planet Quick-Target Selection Buttons */}
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-slate-500 text-[10px] uppercase">TRACK:</span>
          {PLANETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setFocusedPlanet(focusedPlanet === p.id ? null : p.id);
                if (onSelectPlanet) onSelectPlanet(p.id);
              }}
              className={`px-2 py-0.5 rounded text-[10px] uppercase transition-colors cursor-pointer ${
                focusedPlanet === p.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* HUD Toggles & Fullscreen Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOrbitRings(!showOrbitRings)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
              showOrbitRings 
                ? 'bg-slate-900 border-slate-700 text-slate-200' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            Orbits
          </button>

          <button
            onClick={() => setShowHUDTelemetry(!showHUDTelemetry)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
              showHUDTelemetry 
                ? 'bg-slate-900 border-slate-700 text-cyan-300' 
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            HUD Reticle
          </button>

          {onToggleFullScreen && (
            <button
              onClick={onToggleFullScreen}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullScreenMode ? 'Exit Fullscreen' : 'Enter Fullscreen Solar System'}
            >
              {isFullScreenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
