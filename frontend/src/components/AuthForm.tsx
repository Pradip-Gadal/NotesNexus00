import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";
import { toast } from "sonner";
import GoogleSignInButton from "./GoogleSignInButton";
import { signInWithGoogle, signUpWithGoogle } from "../utils/googleAuth";
import "./AuthForm.css";

interface AuthFormProps {
  initialMode?: "login" | "signup";
}

export const AuthForm: React.FC<AuthFormProps> = ({ initialMode = "login" }) => {
  const navigate = useNavigate();
  const { login, signUp, session, loading } = useAuthStore();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Redirect to browse notes if already logged in
    if (!loading && session) {
      navigate("/browse-notes");
    }
  }, [session, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    try {
      await login(email);
      setSubmitted(true);
      toast.success("Check your email for the login link!");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.error_description || error.message || "Login failed. Please try again.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await signUp(email, password);
      setSubmitted(true);
      toast.success("Signup successful! Check your email for a confirmation link (if required).");
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.error_description || error.message || "Signup failed. Please try again.");
    }
  };

  // Use ref to directly manipulate the DOM for smooth transitions
  const loginFormRef = React.useRef<HTMLFormElement>(null);

  const switchToSignup = () => {
    if (loginFormRef.current) {
      loginFormRef.current.style.marginLeft = "-50%";
    }
    setMode("signup");
    setSubmitted(false); // Reset submitted state when switching modes
  };

  const switchToLogin = () => {
    if (loginFormRef.current) {
      loginFormRef.current.style.marginLeft = "0%";
    }
    setMode("login");
    setSubmitted(false); // Reset submitted state when switching modes
  };

  // Show loading skeleton if auth state is loading
  if (loading) {
    return (
      <div className="auth-form-wrapper">
        <div className="auth-form-loading">
          <div className="loading-skeleton title"></div>
          <div className="loading-skeleton field"></div>
          <div className="loading-skeleton field"></div>
          <div className="loading-skeleton button"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-wrapper">
      <div className="form-container">
        <div className="slide-controls">
          <input
            type="radio"
            name="slide"
            id="login"
            checked={mode === "login"}
            onChange={() => setMode("login")}
          />
          <input
            type="radio"
            name="slide"
            id="signup"
            checked={mode === "signup"}
            onChange={() => setMode("signup")}
          />
          <label htmlFor="login" className="slide login" onClick={switchToLogin}>Login</label>
          <label htmlFor="signup" className="slide signup" onClick={switchToSignup}>Signup</label>
          <div className="slider-tab"></div>
        </div>

        <div className="form-inner">
          {/* Login Form */}
          {submitted && mode === "login" ? (
            <div className="success-message">
              <p>Login link sent!</p>
              <p>Please check your email ({email}) and click the link to log in.</p>
            </div>
          ) : (
            <form
              className="login"
              onSubmit={handleLogin}
              ref={loginFormRef}
            >
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="pass-link">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>
                  Forgot password?
                </a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link">
                Not a member? <a href="#" onClick={(e) => { e.preventDefault(); switchToSignup(); }}>Signup now</a>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {submitted && mode === "signup" ? (
            <div className="success-message">
              <p>Signup request sent!</p>
              <p>Please check your email ({email}) for a confirmation link if required.</p>
              <button className="back-to-login" onClick={switchToLogin}>Go to Login</button>
            </div>
          ) : (
            <form
              className="signup"
              onSubmit={handleSignup}
            >
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" />
              </div>
              <div className="login-link">
                Already a member? <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Login now</a>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Google Sign In Button */}
      <div className="or-divider">
        <span>OR</span>
      </div>

      <GoogleSignInButton
        mode={mode === 'login' ? 'signin' : 'signup'}
        onClick={async () => {
          try {
            if (mode === 'login') {
              await signInWithGoogle();
              toast.success("Redirecting to Google authentication...");
            } else {
              await signUpWithGoogle();
              toast.success("Redirecting to Google authentication...");
            }
          } catch (error: any) {
            console.error(`Google ${mode === 'login' ? 'sign in' : 'sign up'} failed:`, error);
            toast.error(error.message || `Google ${mode === 'login' ? 'sign in' : 'sign up'} failed. Please try again.`);
          }
        }}
        disabled={loading}
      />

      <div className="terms-text">
        By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
      </div>
    </div>
  );
};

export default AuthForm;
