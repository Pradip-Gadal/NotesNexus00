import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthStore, Profile } from 'utils/authStore';
import { User } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false, // Default to not loading to prevent UI blocking
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user, profile, loading, profileLoading, fetchProfile } = useAuthStore((state) => ({
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    profileLoading: state.profileLoading,
    fetchProfile: state.fetchProfile,
  }));

  // Use the loading state directly from the auth store
  // This will be true when authenticated and false when not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  // Check if we're returning from a Google auth redirect
  // This is now only called once on component mount
  useEffect(() => {
    const pendingGoogleAuth = localStorage.getItem('pendingGoogleAuth');
    const googleAuthTimestamp = localStorage.getItem('googleAuthTimestamp');

    if (pendingGoogleAuth === 'true') {
      // Check if the timestamp is recent (within last 5 minutes)
      const timestamp = parseInt(googleAuthTimestamp || '0', 10);
      const now = Date.now();
      const fiveMinutesInMs = 5 * 60 * 1000;

      if (now - timestamp < fiveMinutesInMs) {
        // We're returning from a Google auth redirect
        setLocalLoading(true);

        // Clear the pending auth flags after a short delay
        // This gives time for the auth state to be processed
        setTimeout(() => {
          localStorage.removeItem('pendingGoogleAuth');
          localStorage.removeItem('googleAuthTimestamp');
          setLocalLoading(false);
        }, 3000); // 3 seconds should be enough for most cases
      } else {
        // The timestamp is too old, clear the flags
        localStorage.removeItem('pendingGoogleAuth');
        localStorage.removeItem('googleAuthTimestamp');
      }
    }
  }, []);

  // Track profile fetch attempts to prevent infinite loops
  const [profileFetchAttempted, setProfileFetchAttempted] = useState<boolean>(false);

  // Update authentication state when user changes
  useEffect(() => {
    // More robust authentication check
    console.log('UserContext: Authentication state update', { hasUser: !!user, sessionExists: !!user?.aud });
    setIsAuthenticated(!!user && !!user.aud);

    // If user is authenticated but we don't have a profile yet, fetch it ONCE
    if (!!user && !!user.aud && !profile && !profileLoading && !profileFetchAttempted) {
      console.log('User authenticated but no profile, fetching profile...');
      setProfileFetchAttempted(true);
      fetchProfile().catch(err => {
        console.error('Error fetching profile in UserContext:', err);
        // Don't retry on error
      });
    }
  }, [user, profile, profileLoading, fetchProfile, profileFetchAttempted]);

  const value = {
    user,
    profile,
    isAuthenticated,
    isLoading: loading || localLoading, // Combine both loading states
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
