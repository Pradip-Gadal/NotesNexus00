import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { useAuthStore } from '../../utils/authStore';
import { useUser } from '../../contexts/UserContext';
import GoogleSignInButton from '../GoogleSignInButton';
import './AuthForm.css';

export type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
  redirectPath?: string;
}

/**
 * AuthForm component that handles both login and signup functionalities
 * using Supabase authentication. This component manages its own state and logic.
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  redirectPath = '/browse-notes'
}) => {
  const navigate = useNavigate();
  const { signInWithPassword, signUp, login: magicLinkLogin } = useAuthStore();
  const { isAuthenticated } = useUser();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // References for animation
  const loginFormRef = useRef<HTMLFormElement>(null);
  const loginTextRef = useRef<HTMLDivElement>(null);

  // Reset form when mode changes
  useEffect(() => {
    setSubmitted(false);
  }, [mode]);

  // Handle switching to signup mode
  const switchToSignup = () => {
    if (loginFormRef.current) {
      loginFormRef.current.style.marginLeft = '-50%';
    }
    if (loginTextRef.current) {
      loginTextRef.current.style.marginLeft = '-50%';
    }
    setMode('signup');
  };

  // Handle switching to login mode
  const switchToLogin = () => {
    if (loginFormRef.current) {
      loginFormRef.current.style.marginLeft = '0%';
    }
    if (loginTextRef.current) {
      loginTextRef.current.style.marginLeft = '0%';
    }
    setMode('login');
  };

  /**
   * Handle login with email and password
   */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    try {
      // Use authStore method instead of direct Supabase call
      await signInWithPassword(email, password);

      toast.success('Login successful!');
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.error_description || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle login with magic link (passwordless)
   */
  const handleMagicLinkLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    setSubmitted(false);

    try {
      // Use authStore method instead of direct Supabase call
      await magicLinkLogin(email);

      setSubmitted(true);
      toast.success('Check your email for the login link!');
    } catch (error: any) {
      console.error('Magic link login failed:', error);
      toast.error(error.error_description || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle signup with email and password
   */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Use authStore method instead of direct Supabase call
      await signUp(email, password);

      setSubmitted(true);
      toast.success('Signup successful! Check your email for a confirmation link (if required).');
    } catch (error: any) {
      console.error('Signup failed:', error);

      // Handle case where email is already registered
      if (error.message?.includes('already registered')) {
        toast.error('This email is already registered. Please login instead.');
        switchToLogin();
      } else {
        toast.error(error.error_description || error.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google authentication (both login and signup)
   */
  const handleGoogleAuth = async () => {
    setLoading(true);

    try {
      // Use Supabase directly for OAuth since authStore doesn't have a specific method for this
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`,
          // Add query parameter to indicate this is a Google sign-in
          // This helps with optimizing the post-redirect experience
          queryParams: {
            prompt: 'select_account', // Force account selection for better UX
            auth_source: 'google_signin'
          }
        },
      });

      if (error) throw error;

      // Store a flag in localStorage to indicate we're expecting a Google auth redirect
      // This will be used to show a loading state immediately after redirect
      localStorage.setItem('pendingGoogleAuth', 'true');
      localStorage.setItem('googleAuthTimestamp', Date.now().toString());

      toast.success('Redirecting to Google authentication...');
      // The auth listener in authStore will handle the session update after successful OAuth
    } catch (error: any) {
      console.error(`Google authentication failed:`, error);
      toast.error(error.message || `Google authentication failed. Please try again.`);
      localStorage.removeItem('pendingGoogleAuth');
      localStorage.removeItem('googleAuthTimestamp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="title-text">
        <div ref={loginTextRef} className="title login">Login Form</div>
        <div className="title signup">Signup Form</div>
      </div>

      <div className="form-container">
        <div className="slide-controls">
          <input
            type="radio"
            name="slide"
            id="login"
            checked={mode === 'login'}
            onChange={() => {}}
          />
          <input
            type="radio"
            name="slide"
            id="signup"
            checked={mode === 'signup'}
            onChange={() => {}}
          />
          <label
            htmlFor="login"
            className="slide login"
            onClick={switchToLogin}
          >
            Login
          </label>
          <label
            htmlFor="signup"
            className="slide signup"
            onClick={switchToSignup}
          >
            Signup
          </label>
          <div className="slider-tab"></div>
        </div>

        <div className="form-inner">
          {/* Login Form */}
          {submitted && mode === 'login' ? (
            <div className="success-message">
              <p>Login link sent!</p>
              <p>Please check your email ({email}) and click the link to log in.</p>
              <button className="back-to-login" onClick={switchToLogin}>Go back</button>
            </div>
          ) : (
            <form
              ref={loginFormRef}
              className="login"
              onSubmit={handleEmailLogin}
            >
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="pass-link">
                <a href="#" onClick={handleMagicLinkLogin}>
                  Forgot password?
                </a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input
                  type="submit"
                  value={loading ? "Please wait..." : "Login"}
                  disabled={loading}
                />
              </div>
              <div className="signup-link">
                Not a member? <a href="#" onClick={(e) => { e.preventDefault(); switchToSignup(); }}>Signup now</a>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {submitted && mode === 'signup' ? (
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
                  disabled={loading}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input
                  type="submit"
                  value={loading ? "Please wait..." : "Signup"}
                  disabled={loading}
                />
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Google Sign In Button */}
      <div className="google-auth">
        <div className="divider">
          <span>OR</span>
        </div>
        <GoogleSignInButton
          onClick={handleGoogleAuth}
          disabled={loading}
          mode={mode === 'login' ? 'signin' : 'signup'}
        />
      </div>
    </div>
  );
};

export default AuthForm;
