import { create } from "zustand";
import { supabase } from "utils/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

// Define the structure of the profile data
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  academic_name: string | null;
  academic_level: string | null;
  id_card: string | null;
  bio: string | null;
  updated_at: string | null;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean; // Auth loading
  profileLoading: boolean; // Profile loading
  profileError: Error | null;
  initializeAuthListener: () => () => void; // Returns unsubscribe function
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>; // Add this method
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: false, // Will be true during auth operations, false when not authenticated
  profileLoading: false,
  profileError: null,

  initializeAuthListener: () => {
    console.log("Initializing Supabase auth listener...");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Supabase auth event:", event, session);
        const currentUser = session?.user ?? null;

        // Set loading based on authentication state
        if (event === "SIGNED_IN") {
          // User is authenticated, update state immediately
          set({ session, user: currentUser });

          if (currentUser) {
            console.log("User signed in, fetching profile...");
            // Start profile fetch but don't await it to prevent UI blocking
            // This allows the UI to render with user data while profile loads
            get().fetchProfile().finally(() => {
              // Set loading to false when profile fetch completes (success or error)
              set({ loading: false });
            });
          } else {
            set({ loading: false });
          }
        }
        else if (event === "INITIAL_SESSION") {
          if (currentUser) {
            // User has an existing session, update state immediately
            set({ session, user: currentUser });
            console.log("Session restored, fetching profile...");
            // Start profile fetch but don't await it
            get().fetchProfile().finally(() => {
              set({ loading: false });
            });
          } else {
            // No session, ensure loading is false
            set({ loading: false, session: null, user: null });
          }
        }
        else if (event === "SIGNED_OUT") {
          console.log("Auth listener detected SIGNED_OUT event");
          // Ensure all user data is cleared and loading is set to false
          set({
            session: null,
            user: null,
            profile: null,
            profileLoading: false,
            profileError: null,
            loading: false // Not authenticated, so loading should be false
          });
          console.log("Auth state reset after sign out");
        }
      },
    );

    // Initial check (redundant with INITIAL_SESSION but safe)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!get().session && session) {
        console.log("Setting initial session based on getSession", session);
        // User is authenticated, update state immediately
        set({ session, user: session.user });
        // Start profile fetch but don't await it
        get().fetchProfile().finally(() => {
          set({ loading: false });
        });
      } else {
        // No session, ensure loading is false
        set({ loading: false });
      }
    });

    return () => {
      console.log("Unsubscribing Supabase auth listener.");
      authListener?.subscription.unsubscribe();
    };
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) {
        console.log("Fetch profile called but no user is logged in.");
        set({ profile: null, profileLoading: false, profileError: null });
        return;
    }

    // Set profileLoading to true but don't reset the existing profile
    // This allows us to show the existing profile while fetching the updated one
    const currentProfile = get().profile;
    set({ profileLoading: true, profileError: null });

    console.log("Fetching profile for user:", user.id);
    try {
      // Create a default profile with user data from auth
      // This provides immediate data for display while the full profile loads
      const defaultProfile: Profile = {
        id: user.id,
        username: user.email?.split('@')[0] || null,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        academic_name: null,
        academic_level: null,
        id_card: null,
        bio: null,
        updated_at: null
      };

      // If we don't have a profile yet, set the default one immediately
      if (!currentProfile) {
        set({ profile: defaultProfile });
      }

      // First, check if the profiles table exists and has the expected columns
      try {
        // Try a simpler query first to check if the table exists and has basic structure
        const { error: checkError } = await supabase
          .from("profiles")
          .select("id")
          .limit(1);

        if (checkError) {
          console.error("Error checking profiles table:", checkError);
          // If there's an error with the basic query, use the default profile
          set({ profile: defaultProfile, profileLoading: false });
          return;
        }

        // If basic query works, try to fetch the user's profile with all fields
        const { data, error, status } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          console.error("Error fetching minimal profile:", error);
          // Use default profile on error
          set({ profile: defaultProfile, profileLoading: false });
          return;
        }

        if (data) {
          // Merge any data we got with the default profile
          const mergedProfile: Profile = {
            ...defaultProfile,
            ...data,
            // Ensure id is always set correctly
            id: user.id
          };

          console.log("Profile data fetched and merged:", mergedProfile);
          set({ profile: mergedProfile, profileLoading: false });
        } else {
          // No profile found, create a basic one
          console.log("No profile found for user, creating basic profile.");
          try {
            // Try to create a minimal profile with just id and avatar_url
            const { error: upsertError } = await supabase.from('profiles').upsert({
              id: user.id,
              avatar_url: defaultProfile.avatar_url,
            });

            if (upsertError) {
              console.error("Error creating basic profile:", upsertError);
            } else {
              console.log("Basic profile created successfully");
            }
          } catch (createError) {
            console.error("Exception creating profile:", createError);
          }

          // Use the default profile regardless of creation success
          set({ profile: defaultProfile, profileLoading: false });
        }
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        // Fall back to default profile on any database error
        set({ profile: defaultProfile, profileLoading: false });
      }
    } catch (error: any) {
      console.error("Exception while fetching profile:", error);
      set({ profileError: error, profileLoading: false });
      // Don't clear the profile on error if we already have one
      if (!currentProfile) {
        // Create a minimal profile from user data on error
        const fallbackProfile: Profile = {
          id: user.id,
          username: user.email?.split('@')[0] || null,
          full_name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          avatar_url: null,
          academic_name: null,
          academic_level: null,
          id_card: null,
          bio: null,
          updated_at: null
        };
        set({ profile: fallbackProfile });
      }
    }
  },

  updateProfile: async (profileData: Partial<Profile>) => {
    const user = get().user;
    if (!user) {
        toast.error("You must be logged in to update your profile.");
        return;
    }

    set({ profileLoading: true });
    try {
      // First check if the profiles table exists with a simple query
      const { error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      if (checkError) {
        console.error("Error checking profiles table:", checkError);
        throw new Error("Could not access profiles table");
      }

      // Create a complete update object with all profile fields
      const updates = {
        id: user.id,
        updated_at: new Date().toISOString(),
        ...profileData // Include all fields from profileData
      };

      console.log("Updating profile with data:", updates);

      // Use upsert to create the profile if it doesn't exist or update it if it does
      const { error } = await supabase.from('profiles').upsert(updates, {
        // returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Profile update successful.");

      // Optimistically update the local state
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: {
            ...currentProfile,
            ...profileData,
            id: user.id // Ensure id is always correct
          } as Profile,
          profileLoading: false
        });
      } else {
        // If we don't have a profile yet, fetch it
        await get().fetchProfile();
      }

      toast.success("Profile updated successfully!");

    } catch (error: any) {
        console.error("Exception while updating profile:", error);
        set({ profileError: error, profileLoading: false });
        toast.error("Failed to update profile: " + error.message);
        throw error; // Re-throw so the form knows about the error
    } finally {
       set({ profileLoading: false }); // Ensure loading is false even on error
    }
  },

  login: async (email: string) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
      console.log("Magic link sent to", email);
      // Keep loading true after sending magic link
      // It will be updated by the auth listener when the user clicks the link
    } catch (error) {
      console.error("Error sending magic link:", error);
      // Set loading to false on error
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    console.log("Logout function in authStore called");
    try {
      // Set loading to false immediately on logout
      set({ loading: false });

      // Call Supabase signOut
      console.log("Calling Supabase signOut");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Explicitly clear user data in the store
      console.log("Explicitly clearing user data in store");
      set({
        session: null,
        user: null,
        profile: null,
        profileLoading: false,
        profileError: null,
        loading: false
      });

      console.log("User logged out successfully");
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error(error.message || "Logout failed. Please try again.");
      // Still clear the state even if there's an error with Supabase
      set({
        session: null,
        user: null,
        profile: null,
        profileLoading: false,
        profileError: null,
        loading: false
      });
    }
  },

  signUp: async (email: string, password?: string) => {
    if (!password) throw new Error("Password is required for signup.");
    // Explicitly set loading to true
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (!data.session) {
        console.log("Signup successful, confirmation email sent.");
        // Keep loading true if signup was successful
      } else {
        console.log("Signup successful and logged in.");
        // Session/user set by listener, which will maintain loading as true
      }
    } catch (error) {
      console.error("Error signing up:", error);
      // Set loading to false on error
      set({ loading: false });
      throw error;
    }
  },

  signInWithPassword: async (email: string, password: string) => {
    // Set loading to true during authentication
    set({ loading: true });
    try {
      console.log("Signing in with email and password:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // The session and user will be set by the auth listener
      console.log("Sign in successful:", data.user?.id);
      // Keep loading true after successful authentication
    } catch (error) {
      console.error("Error signing in with password:", error);
      // Set loading to false on error
      set({ loading: false });
      throw error;
    }
  },
}));
