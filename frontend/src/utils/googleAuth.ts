import { supabase } from './supabaseClient';

/**
 * Initiates the Google OAuth sign-in process
 * @returns A promise that resolves when the sign-in process is complete
 */
export const signInWithGoogle = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/browse-notes',
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Initiates the Google OAuth sign-up process
 * @returns A promise that resolves when the sign-up process is complete
 */
export const signUpWithGoogle = async (): Promise<void> => {
  // For Supabase, sign-in and sign-up with OAuth are the same process
  return signInWithGoogle();
};
