import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserSavedData, 
  signInWithGoogle, 
  signOutUser, 
  subscribeToAuth, 
  getUserSavedData, 
  toggleUserBookmark, 
  saveUserNote, 
  saveUserGeneratedVideo 
} from '../lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  savedData: UserSavedData | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleBookmark: (experimentId: string) => Promise<void>;
  saveNote: (experimentId: string, note: string) => Promise<void>;
  saveVideo: (video: { prompt: string; aspectRatio: '16:9' | '9:16'; videoUrl?: string; thumbnailUrl?: string }) => Promise<void>;
  refreshSavedData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedData, setSavedData] = useState<UserSavedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await getUserSavedData(currentUser.uid);
        setSavedData(data);
      } else {
        setSavedData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshSavedData = async () => {
    if (user) {
      const data = await getUserSavedData(user.uid);
      setSavedData(data);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const loggedUser = await signInWithGoogle();
      setUser(loggedUser);
      const data = await getUserSavedData(loggedUser.uid);
      setSavedData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setSavedData(null);
  };

  const handleToggleBookmark = async (experimentId: string) => {
    if (!user) {
      await handleSignIn();
    }
    const targetUid = user ? user.uid : 'nasa_investigator_alpha';
    const updatedBookmarks = await toggleUserBookmark(targetUid, experimentId);
    setSavedData((prev) => prev ? { ...prev, bookmarks: updatedBookmarks } : null);
  };

  const handleSaveNote = async (experimentId: string, note: string) => {
    if (!user) return;
    await saveUserNote(user.uid, experimentId, note);
    setSavedData((prev) => prev ? {
      ...prev,
      customNotes: { ...prev.customNotes, [experimentId]: note }
    } : null);
  };

  const handleSaveVideo = async (video: { prompt: string; aspectRatio: '16:9' | '9:16'; videoUrl?: string; thumbnailUrl?: string }) => {
    const targetUid = user ? user.uid : 'nasa_investigator_alpha';
    const updatedVideos = await saveUserGeneratedVideo(targetUid, video);
    setSavedData((prev) => prev ? { ...prev, savedVideos: updatedVideos } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        savedData,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        toggleBookmark: handleToggleBookmark,
        saveNote: handleSaveNote,
        saveVideo: handleSaveVideo,
        refreshSavedData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
