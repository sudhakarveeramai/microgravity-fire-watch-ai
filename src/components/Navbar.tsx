import React, { useState } from 'react';
import { Search, Flame, Menu, X, Rocket, Database, BookOpen, GitFork, ShieldAlert, Cpu, Orbit, Film, User, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type PageView = 
  | 'overview' 
  | 'database'
  | 'dashboard' 
  | 'experiments' 
  | 'analytics' 
  | 'assistant' 
  | 'compare' 
  | 'mission' 
  | 'veo'
  | 'solarsystem'
  | 'knowledge' 
  | 'sources' 
  | 'safety'
  | 'methodology';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenSearch: () => void;
  onOpenAuth?: () => void;
  activeMissionId?: 'iss' | 'moon' | 'mars';
  onSelectMission?: (id: 'iss' | 'moon' | 'mars') => void;
  solarSystemBgActive?: boolean;
  onToggleSolarSystemBg?: () => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  activeMissionId = 'iss',
  onSelectMission,
  solarSystemBgActive = true,
  onToggleSolarSystemBg,
  mobileMenuOpen: externalMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const isMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  
  const handleToggleMenu = () => {
    if (onToggleMobileMenu) {
      onToggleMobileMenu();
    } else {
      setInternalMobileMenuOpen(!internalMobileMenuOpen);
    }
  };

  const handleCloseMenu = () => {
    if (onToggleMobileMenu && externalMobileMenuOpen) {
      onToggleMobileMenu();
    } else {
      setInternalMobileMenuOpen(false);
    }
  };

  const { user } = useAuth();

  // Core primary platforms displayed on desktop
  const primaryNavItems: { id: PageView; label: string; icon?: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'database', label: 'SIH Database', icon: <Database className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'veo', label: 'Veo Studio', icon: <Film className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'assistant', label: 'AI Assistant', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'experiments', label: 'Experiments' },
  ];

  // Secondary & specialized research views in dropdown
  const secondaryNavItems: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: 'analytics', label: 'Fire Analytics & Charts', icon: <Cpu className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'compare', label: 'Dual Experiment Comparison', icon: <GitFork className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'mission', label: 'Mission Mode (Moon & Mars)', icon: <Rocket className="w-3.5 h-3.5 text-rose-400" /> },
    { id: 'solarsystem', label: '3D Solar System Orrery', icon: <Orbit className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'safety', label: 'Fire Safety Intelligence', icon: <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'knowledge', label: 'Interactive Knowledge Graph', icon: <GitFork className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'sources', label: 'NASA Research Literature', icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" /> },
    { id: 'methodology', label: 'Scientific Methodology', icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#07111F]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2 group text-left cursor-pointer focus-visible:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white font-display">
              FIREWATCH<span className="text-amber-400 font-mono font-medium ml-1">AI</span>
            </span>
          </button>

          {/* Quick Mission Tag switcher (Visible on desktop/laptop) */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/70 text-xs font-mono">
            <span className="text-slate-500 text-[10px] px-1.5 font-sans uppercase">Env:</span>
            {(['iss', 'moon', 'mars'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  if (onSelectMission) onSelectMission(m);
                  onNavigate('mission');
                }}
                className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors cursor-pointer ${
                  activeMissionId === m 
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Zone 2: Responsive clean desktop navigation links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium">
          {primaryNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentPage === item.id 
                  ? 'text-amber-400 font-semibold' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="absolute inset-x-0 -bottom-3.5 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          ))}

          {/* More menu dropdown for secondary sections */}
          <div className="relative group">
            <button className="py-1 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer">
              <span>More</span>
              <span className="text-[10px]">▾</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 hidden group-hover:block z-50">
              {secondaryNavItems.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => onNavigate(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                    currentPage === sec.id
                      ? 'bg-amber-500/20 text-amber-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Zone 3: Actions on Right */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onToggleSolarSystemBg && (
            <button
              onClick={onToggleSolarSystemBg}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                solarSystemBgActive
                  ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-950/50'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Live Running Solar System Background"
            >
              <Orbit className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Solar BG</span>
            </button>
          )}

          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700/70 transition-colors cursor-pointer"
            aria-label="Search research documents and experiments"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>

          {/* User Auth Profile Trigger */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-lg border transition-all cursor-pointer ${
                user
                  ? 'bg-slate-900 border-amber-500/40 text-amber-300 hover:border-amber-400'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
              title={user ? `Signed in as ${user.displayName || user.email}` : 'Sign in with Google'}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="hidden xl:inline text-xs font-medium">
                {user ? (user.displayName?.split(' ')[0] || 'Profile') : 'Sign In'}
              </span>
            </button>
          )}

          {/* Mobile & Tablet hamburger */}
          <button
            onClick={handleToggleMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white focus-visible:outline-none cursor-pointer rounded-lg bg-slate-900/80 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in shadow-2xl">
          {/* Quick Mission Env selector on mobile */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 uppercase text-[10px]">Active Atmosphere:</span>
            <div className="flex items-center gap-1">
              {(['iss', 'moon', 'mars'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    if (onSelectMission) onSelectMission(m);
                    onNavigate('mission');
                    handleCloseMenu();
                  }}
                  className={`px-2.5 py-1 rounded text-xs uppercase font-bold transition-colors ${
                    activeMissionId === m 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Platforms list */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase px-3 tracking-wider">
              Core Applications
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {primaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    handleCloseMenu();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors text-left cursor-pointer ${
                    currentPage === item.id 
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis & Tools list */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase px-3 tracking-wider">
              Research & Mission Tools
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {secondaryNavItems.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    onNavigate(sec.id);
                    handleCloseMenu();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-mono rounded-xl transition-colors text-left cursor-pointer ${
                    currentPage === sec.id
                      ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
