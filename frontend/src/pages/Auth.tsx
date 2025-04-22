import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthForm } from "../components/NewAuth";
import { useAuthStore } from "../utils/authStore";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, loading } = useAuthStore();
  const isSignup = location.pathname === "/signup";

  useEffect(() => {
    // Redirect to browse notes if already logged in
    if (!loading && session) {
      navigate("/browse-notes");
    }
  }, [session, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to NoteNexus</h1>
          <p className="text-gray-200">Access your notes and educational resources</p>
        </div>

        <AuthForm
          initialMode={isSignup ? "signup" : "login"}
          redirectPath="/browse-notes"
        />
      </div>
    </div>
  );
}
