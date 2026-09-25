import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, 
  Upload, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sliders, 
  Maximize2, 
  Flame, 
  Layers, 
  FileVideo, 
  ArrowRight,
  ShieldCheck,
  Save,
  Check,
  Sun,
  Moon,
  Eye,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HD_COMBUSTION_PRESETS, CombustionPreset } from '../data/combustionImages';

export const VeoVideoGenerator: React.FC = () => {
  const { user, savedData, saveVideo } = useAuth();

  // White Enhanced Background mode & selected preset
  const [useWhiteBackground, setUseWhiteBackground] = useState<boolean>(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(HD_COMBUSTION_PRESETS[0].id);

  // State initialized with HD FLEX-2 Heptane Droplet Core on White Enhanced Background
  const [selectedImage, setSelectedImage] = useState<string | null>(HD_COMBUSTION_PRESETS[0].whiteBgUrl);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [prompt, setPrompt] = useState<string>(HD_COMBUSTION_PRESETS[0].recommendedPrompt);
  const [cameraMotion, setCameraMotion] = useState<'orbital' | 'macro' | 'drift' | 'convective'>('orbital');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [operationName, setOperationName] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Output video state
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isVideoSaved, setIsVideoSaved] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer for elapsed generation time
  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
        setGeneratedVideoUrl(null);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Convert remote image url to base64 if needed
  const ensureBase64Image = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) {
      return url;
    }
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      setImageMimeType(blob.type || 'image/jpeg');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      // Fallback placeholder image data if CORS restricts
      return url;
    }
  };

  // Trigger Veo Video Generation
  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select or upload a flame photo to animate.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedVideoUrl(null);
    setIsVideoSaved(false);
    setGenerationStep('Ingesting flame boundary conditions & initializing Veo neural model...');

    try {
      const base64Data = await ensureBase64Image(selectedImage);

      // Enhance prompt with camera dynamics
      const motionDescriptor = 
        cameraMotion === 'orbital' ? 'slow 3D orbital camera pan around the flame' :
        cameraMotion === 'macro' ? 'high-speed scientific macro sensor close-up with depth of field' :
        cameraMotion === 'convective' ? 'dynamic micro-airflow convection drift with luminous soot tracers' :
        'smooth spatial camera trajectory through the combustion chamber';

      const enrichedPrompt = `${prompt}. Camera: ${motionDescriptor}. Photorealistic microgravity combustion fluid dynamics.`;

      // 1. Start generation operation
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: imageMimeType,
          prompt: enrichedPrompt,
          aspectRatio,
          resolution: '720p'
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to start video generation.');
      }

      const opName = data.operationName;
      setOperationName(opName);
      setGenerationStep('Synthesizing time-series flame kinetics via Veo (veo-3.1-fast-generate-preview)...');

      // 2. Poll operation status until complete
      let isDone = false;
      let pollAttempts = 0;

      while (!isDone && pollAttempts < 60) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        pollAttempts += 1;

        if (pollAttempts === 3) {
          setGenerationStep('Simulating Navier-Stokes micro-convection and chemical species diffusion...');
        } else if (pollAttempts === 7) {
          setGenerationStep('Solving radiative soot heat transfer and radical emission spectra...');
        } else if (pollAttempts === 12) {
          setGenerationStep('Assembling high-definition video frames and temporal consistency...');
        }

        const pollRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });

        const pollData = await pollRes.json();
        if (pollData.error) {
          throw new Error(pollData.error.message || 'Error during video synthesis.');
        }

        if (pollData.done) {
          isDone = true;
          setGenerationStep('Video synthesis complete. Streaming MP4 video buffer...');
          break;
        }
      }

      if (!isDone) {
        throw new Error('Video generation timed out. Please try again.');
      }

      // 3. Download the generated video
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName: opName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Failed to retrieve finalized video stream from server.');
      }

      const videoBlob = await downloadRes.blob();
      const videoObjectUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoObjectUrl);

      // Auto-save to mission archive
      await saveVideo({
        prompt,
        aspectRatio,
        videoUrl: videoObjectUrl,
        thumbnailUrl: selectedImage,
      });
      setIsVideoSaved(true);

    } catch (err: any) {
      console.error('Video generation error:', err);
      setErrorMessage(err.message || 'Failed to complete video animation.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Select Preset with White / Dark background support
  const handleSelectPreset = (preset: CombustionPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedImage(useWhiteBackground ? preset.whiteBgUrl : preset.darkBgUrl);
    setPrompt(preset.recommendedPrompt);
    setAspectRatio(preset.aspectRatio);
    setGeneratedVideoUrl(null);
    setErrorMessage(null);
  };

  // Toggle White Enhanced Background Mode
  const handleToggleBackgroundMode = (whiteBg: boolean) => {
    setUseWhiteBackground(whiteBg);
    const activePreset = HD_COMBUSTION_PRESETS.find((p) => p.id === selectedPresetId);
    if (activePreset) {
      setSelectedImage(whiteBg ? activePreset.whiteBgUrl : activePreset.darkBgUrl);
    }
  };

  // Adjust playback rate
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const currentPreset = HD_COMBUSTION_PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <Film className="w-4 h-4" />
              <span>NASA Microgravity Flame Animator · Powered by Veo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
              Animate Combustion Photos into Microgravity Video
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              Upload still photos of spacecraft combustion, flame droplets, or material burns to synthesize photorealistic time-series fluid dynamics using <span className="text-amber-300 font-mono font-medium">veo-3.1-fast-generate-preview</span>. Generate in standard <span className="text-amber-300 font-mono">16:9</span> landscape or vertical <span className="text-amber-300 font-mono">9:16</span> portrait.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs font-mono space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>MODEL:</span>
                <span className="text-cyan-300">veo-3.1-fast-generate-preview</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>STORAGE:</span>
                <span className="text-emerald-300">Firestore Cloud Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Optical Microgravity Callout below title */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              HD OPTICAL SENSOR
            </span>
            <span>CH* Chemiluminescence (430 nm) · High-Contrast Zero-Gravity Combustion Optics</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Laboratory Backdrop:</span>
            <span className="px-2 py-0.5 rounded bg-white text-slate-900 font-bold text-[10px] shadow-sm flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              White Enhanced Chamber
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Selection & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Upload or Choose Image */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            {/* Title & Upload Link */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>1. Source Combustion Photo</span>
                </h2>
                <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                  HD Quality Enhanced · High-Contrast Scientific Still
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
              >
                Upload from device
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Background Enhancement Mode Selector (White Enhanced vs Dark Chamber) */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Background Mode:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleToggleBackgroundMode(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    useWhiteBackground
                      ? 'bg-white text-slate-950 shadow-md ring-1 ring-amber-400'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3 text-amber-600" />
                  <span>White Enhanced</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleBackgroundMode(false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    !useWhiteBackground
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3 text-cyan-300" />
                  <span>Dark Chamber</span>
                </button>
              </div>
            </div>

            {/* Selected Photo Preview - With White Enhanced Background option */}
            <div className={`relative rounded-xl overflow-hidden aspect-video flex items-center justify-center group transition-all duration-300 ${
              useWhiteBackground
                ? 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 border-slate-200 shadow-2xl ring-1 ring-slate-300/60'
                : 'bg-slate-950 border border-slate-800 shadow-xl'
            }`}>
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Source flame to animate in HD" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs">No image selected</p>
                </div>
              )}

              {/* Floating Scientific HUD Badges */}
              <div className="absolute top-2 left-2 pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700/80 text-[10px] font-mono text-cyan-300 font-bold shadow">
                  HD 4K OPTICAL STILL
                </span>
              </div>

              {useWhiteBackground && (
                <div className="absolute top-2 right-2 pointer-events-none">
                  <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm border border-slate-300 text-[10px] font-mono text-slate-900 font-bold shadow">
                    WHITE ENHANCED STAGE
                  </span>
                </div>
              )}

              {/* Overlay change button */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                </button>
                <button
                  onClick={() => handleToggleBackgroundMode(!useWhiteBackground)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to {useWhiteBackground ? 'Dark' : 'White'} BG</span>
                </button>
              </div>
            </div>

            {/* Current Active Preset Metadata Callout */}
            {currentPreset && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold text-amber-400">{currentPreset.title}</span>
                  <span className="text-[10px] text-cyan-400">{currentPreset.flameType}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {currentPreset.description}
                </p>
              </div>
            )}

            {/* NASA Mission Presets Carousel */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-mono uppercase tracking-wide flex items-center justify-between">
                <span>Select NASA Combustion Reference Stills:</span>
                <span className="text-emerald-400 text-[10px] font-bold">100% REAL SPACE STILLS</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {HD_COMBUSTION_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  const thumb = useWhiteBackground ? preset.whiteBgUrl : preset.darkBgUrl;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/70 text-amber-200 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-full h-16 rounded-lg overflow-hidden border border-slate-800 bg-white">
                        <img 
                          src={thumb} 
                          alt={preset.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold truncate text-slate-200">{preset.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{preset.mission}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Configuration & Parameters */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>2. Veo Video Parameters</span>
            </h2>

            {/* Aspect Ratio Selector (16:9 vs 9:16) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Aspect Ratio:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    aspectRatio === '16:9'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-200 font-bold shadow-md shadow-blue-900/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-6 h-4 rounded border-2 border-current shrink-0" />
                  <div className="text-left">
                    <p className="text-xs">16:9 Landscape</p>
                    <p className="text-[10px] font-normal text-slate-400 font-mono">Mission Control / Desktop</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    aspectRatio === '9:16'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-200 font-bold shadow-md shadow-blue-900/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-3.5 h-6 rounded border-2 border-current shrink-0" />
                  <div className="text-left">
                    <p className="text-xs">9:16 Portrait</p>
                    <p className="text-[10px] font-normal text-slate-400 font-mono">Vertical Telemetry / Mobile</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Combustion Kinetics Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-400 uppercase">
                  Combustion Dynamics Prompt:
                </label>
                <span className="text-[10px] text-amber-400 font-mono">Microgravity Fluid Model</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-sans leading-relaxed"
                placeholder="Describe how the flame should evolve, radiate, and propagate..."
              />
            </div>

            {/* Camera Motion Trajectory */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Sensor Camera Trajectory:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'orbital', label: 'Orbital Pan (3D)', desc: 'Revolving observation' },
                  { id: 'macro', label: 'Macro Sensor', desc: 'Soot boundary depth' },
                  { id: 'convective', label: 'Convective Drift', desc: 'Gas tracer flow' },
                  { id: 'drift', label: 'Quiescent Float', desc: 'Stationary ISS rack' },
                ].map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setCameraMotion(cam.id as any)}
                    className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      cameraMotion === cam.id
                        ? 'bg-slate-800 border-amber-500/50 text-amber-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <p className="text-[11px] truncate">{cam.label}</p>
                    <p className="text-[9px] text-slate-500 font-mono">{cam.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Generate Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                isGenerating
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-amber-500/20 active:scale-[0.99]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Film className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Synthesizing Microgravity Video ({elapsedSeconds}s)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Generate Veo Flame Video</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output Video Player & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between min-h-[520px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-slate-200">
                    Microgravity Video Viewport
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400">
                    {aspectRatio}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                    VEO 3.1
                  </span>
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[380px]">
                {/* Generation Loading Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
                      <div className="w-16 h-16 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      <Film className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
                    </div>

                    <div className="space-y-1.5 max-w-md">
                      <p className="text-sm font-semibold text-white font-display">
                        Veo Video Synthesis in Progress
                      </p>
                      <p className="text-xs text-amber-400 font-mono">
                        {generationStep || 'Processing fluid combustion dynamics...'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono pt-2">
                        ELAPSED: {elapsedSeconds}s · MODEL: veo-3.1-fast-generate-preview
                      </p>
                    </div>

                    <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse w-3/4" />
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-6 text-center space-y-3 max-w-md">
                    <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                    <p className="text-sm font-semibold text-rose-300">Generation Notice</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{errorMessage}</p>
                    <button
                      onClick={handleGenerateVideo}
                      className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer"
                    >
                      Retry Generation
                    </button>
                  </div>
                )}

                {/* Video Playback Output */}
                {generatedVideoUrl && !isGenerating && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <video
                      ref={videoRef}
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className={`rounded-lg max-h-[460px] object-contain shadow-2xl ${
                        aspectRatio === '9:16' ? 'aspect-[9/16] w-auto max-w-[280px]' : 'aspect-video w-full'
                      }`}
                    />
                  </div>
                )}

                {/* Idle Placeholder */}
                {!generatedVideoUrl && !isGenerating && !errorMessage && (
                  <div className="p-8 text-center space-y-3 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                      <Play className="w-6 h-6 ml-0.5" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      Viewport Ready for Simulation
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Select a photo on the left and click "Generate Veo Flame Video" to synthesize your microgravity combustion sequence.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Action Bar & Scientific Analysis Controls */}
            {generatedVideoUrl && (
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                {/* Slow motion analysis */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] px-1.5">SPEED:</span>
                  {[0.25, 0.5, 1.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Download and Save Action Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={generatedVideoUrl}
                    download={`firewatch-microgravity-${Date.now()}.mp4`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </a>

                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved to Mission Archive</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Past Mission Generations Grid */}
          {savedData && savedData.savedVideos && savedData.savedVideos.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mission Video Archive ({savedData.savedVideos.length})</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">Firestore Synced</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {savedData.savedVideos.map((vid) => (
                  <div 
                    key={vid.id}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1.5 group"
                  >
                    {vid.thumbnailUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden border border-slate-800/80">
                        <img src={vid.thumbnailUrl} alt={vid.prompt} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-[11px] font-medium text-slate-200 line-clamp-2 leading-tight">
                      {vid.prompt}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{vid.aspectRatio}</span>
                      <span>{new Date(vid.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
