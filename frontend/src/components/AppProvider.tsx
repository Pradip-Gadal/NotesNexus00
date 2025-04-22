import React, { ReactNode, useEffect } from "react";
import { useAuthStore } from "utils/authStore";
import { UserProvider } from "../contexts/UserContext";
import { AuthDebugger } from "./AuthDebugger";

interface Props {
  children: ReactNode;
}

/**
 * AppProvider wraps the entire application and can be used for:
 * - Global layout components (like sidebars, consistent headers/footers for authenticated views)
 * - Global state providers (like ThemeProvider, AuthProvider, Zustand stores)
 * - Initialization logic
 */
export function AppProvider({ children }: Props) {
  const initializeAuthListener = useAuthStore(
    (state) => state.initializeAuthListener,
  );

  useEffect(() => {
    // Start listening to auth changes when the app loads
    const unsubscribe = initializeAuthListener();

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  }, [initializeAuthListener]);

  // Wrap children with UserProvider for global user state
  return (
    <UserProvider>
      {children}
      {/* Include the AuthDebugger in development for troubleshooting */}
      {process.env.NODE_ENV === 'development' && <AuthDebugger />}
    </UserProvider>
  );
}