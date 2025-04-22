import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "utils/authStore";
import { AuthForm } from "../components/NewAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useAuthStore();

  // Get the redirect path from location state or default to browse-notes
  const from = location.state?.from || "/browse-notes";

  useEffect(() => {
    // Redirect to previous page or dashboard if already logged in
    if (!loading && session) {
      navigate(from);
    }
  }, [session, loading, navigate, from]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to NoteNexus</h1>
          <p className="text-gray-200">Access your notes and educational resources</p>
        </div>

        <AuthForm
          initialMode="login"
          redirectPath={from}
          onAuthSuccess={() => navigate(from)}
        />
      </div>
    </div>
  );
}
