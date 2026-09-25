import React from 'react';
import { Flame, Database, Film, Sparkles, BookOpen, Menu, Layers } from 'lucide-react';
import { PageView } from './Navbar';

interface MobileTabBarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenMenu: () => void;
  isMenuOpen: boolean;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentPage,
  onNavigate,
  onOpenMenu,
  isMenuOpen,
}) => {
  const tabs = [
    {
      id: 'overview' as PageView,
      label: 'Home',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: 'database' as PageView,
      label: 'SIH Data',
      icon: <Database className="w-5 h-5" />,
      badge: 'SIH',
    },
    {
      id: 'veo' as PageView,
      label: 'Veo HD',
      icon: <Film className="w-5 h-5" />,
    },
    {
      id: 'assistant' as PageView,
      label: 'AI Trained',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'experiments' as PageView,
      label: 'Explore',
      icon: <Layers className="w-5 h-5" />,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar" 
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#07111F]/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.6)] px-2 py-1.5 safe-area-bottom"
    >
      <div className="max-w-md mx-auto grid grid-cols-6 items-center">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id && !isMenuOpen;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active indicator glow */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              )}
              
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold text-[8px] tracking-tight">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 font-mono truncate max-w-full ${
                isActive ? 'text-amber-300 font-semibold' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 6th Slot: More Menu Button */}
        <button
          onClick={onOpenMenu}
          className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
            isMenuOpen
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Open More research options"
        >
          {isMenuOpen && (
            <span className="absolute -top-1 w-6 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          )}
          <Menu className="w-5 h-5" />
          <span className={`text-[10px] tracking-tight mt-0.5 font-mono truncate ${
            isMenuOpen ? 'text-cyan-300 font-semibold' : 'text-slate-400'
          }`}>
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
