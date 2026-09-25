import React from 'react';
import { 
  X, 
  User, 
  LogOut, 
  LogIn, 
  Bookmark, 
  FileText, 
  Film, 
  Database, 
  ShieldCheck, 
  ExternalLink,
  CheckCircle2,
  Server
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EXPERIMENTS_DATA } from '../data/mockExperiments';
import firebaseConfigJson from '../../firebase-applet-config.json';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperiment?: (id: string) => void;
  onNavigateToVideos?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectExperiment,
  onNavigateToVideos,
}) => {
  const { user, savedData, signIn, signOut, isLoading } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#07111F] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Researcher Identity & Cloud Sync
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Firebase Authentication & Firestore State
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User Avatar'}
                  className="w-12 h-12 rounded-full object-cover border border-amber-500/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.displayName || 'Authorized Researcher'}
                </p>
                <p className="text-xs text-slate-400 font-mono truncate">
                  {user.email || 'researcher@nasa.gov'}
                </p>
                <p className="text-[10px] text-amber-400 font-mono mt-0.5">
                  {user.role || 'Microgravity Fire Safety Specialist'}
                </p>
              </div>

              <button
                onClick={signOut}
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Persistence Status */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <span className="font-semibold">Firestore Persistence Active: </span>
                <span className="text-emerald-400/80">Bookmarks, mission risk assessments, and Veo video renders sync automatically with your profile.</span>
              </div>
            </div>

            {/* Saved Bookmarks Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bookmarked Experiments ({savedData?.bookmarks.length || 0})</span>
                </span>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {savedData?.bookmarks && savedData.bookmarks.length > 0 ? (
                  savedData.bookmarks.map((id) => {
                    const exp = EXPERIMENTS_DATA.find((e) => e.id === id);
                    return (
                      <div
                        key={id}
                        onClick={() => {
                          if (onSelectExperiment) onSelectExperiment(id);
                          onClose();
                        }}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="text-xs text-slate-200 truncate">
                          {exp?.title || id}
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">
                          {exp?.facility || 'ISS'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic p-2">No bookmarked experiments yet.</p>
                )}
              </div>
            </div>

            {/* Generated Veo Videos Count */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Generated Veo Videos:</span>
                <span className="font-mono font-bold text-white">
                  {savedData?.savedVideos?.length || 0}
                </span>
              </div>

              {onNavigateToVideos && (
                <button
                  onClick={() => {
                    onNavigateToVideos();
                    onClose();
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Database className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Sign in to FireWatch AI</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Authenticate using Google Sign-In with Firebase to persist experiment bookmarks, custom notes, and Veo video renders.
              </p>
            </div>

            <button
              onClick={signIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                className="w-4 h-4"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        )}

        {/* Firebase Account & Database Integration Diagnostic Status */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Firebase Provisioned & Online</span>
            </span>
            <span className="text-[10px] text-slate-400">Auth + Firestore</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] font-mono space-y-1 text-slate-400">
            <div className="flex items-center justify-between">
              <span>Project ID:</span>
              <span className="text-slate-200 font-medium">{firebaseConfigJson.projectId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Database ID:</span>
              <span className="text-amber-400/90 truncate max-w-[230px] text-right font-medium" title={firebaseConfigJson.firestoreDatabaseId}>
                {firebaseConfigJson.firestoreDatabaseId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Target Account:</span>
              <span className="text-cyan-300 font-medium">{user?.email || 'sudhakarzxzx@gmail.com'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
