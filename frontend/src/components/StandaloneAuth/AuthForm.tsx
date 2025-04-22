import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import GoogleSignInButton from './GoogleSignInButton';
import styles from './AuthForm.module.css';

export type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  initialMode?: AuthMode;
  onAuthSuccess?: () => void;
  redirectPath?: string;
}

/**
 * Standalone AuthForm component that handles both login and signup functionalities
 * using Supabase authentication. This component manages its own state and logic.
 */
export const AuthForm: React.FC<AuthFormProps> = ({ 
  initialMode = 'login',
  onAuthSuccess,
  redirectPath = '/browse-notes'
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const loginFormRef = useRef<HTMLFormElement>(null);

  // Reset form when mode changes
  useEffect(() => {
    setSubmitted(false);
  }, [mode]);

  /**
   * Handle login with email and password
   */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success('Login successful!');
        if (onAuthSuccess) {
          onAuthSuccess();
        } else {
          navigate(redirectPath);
        }
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
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      
      if (error) throw error;
      
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectPath}`,
        }
      });
      
      if (error) throw error;
      
      setSubmitted(true);
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error('This email is already registered. Please login instead.');
        switchToLogin();
      } else {
        toast.success('Signup successful! Check your email for a confirmation link (if required).');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error.error_description || error.message || 'Signup failed. Please try again.');
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`,
        },
      });
      
      if (error) throw error;
      
      toast.success('Redirecting to Google authentication...');
    } catch (error: any) {
      console.error(`Google authentication failed:`, error);
      toast.error(error.message || `Google authentication failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Switch to signup mode with animation
   */
  const switchToSignup = () => {
    if (loginFormRef.current) {
      loginFormRef.current.style.marginLeft = '-50%';
    }
    setMode('signup');
  };

  /**
   * Switch to login mode with animation
   */
  const switchToLogin = () => {
    if (loginFormRef.current) {
      loginFormRef.current.style.marginLeft = '0%';
    }
    setMode('login');
  };

  // Show loading skeleton if loading
  if (loading && !submitted) {
    return (
      <div className={styles.authFormWrapper}>
        <div className={styles.authFormLoading}>
          <div className={`${styles.loadingSkeleton} ${styles.title}`}></div>
          <div className={`${styles.loadingSkeleton} ${styles.field}`}></div>
          <div className={`${styles.loadingSkeleton} ${styles.field}`}></div>
          <div className={`${styles.loadingSkeleton} ${styles.button}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authFormWrapper}>
      <div className={styles.formContainer}>
        <div className={styles.slideControls}>
          <input
            type="radio"
            name="slide"
            id="login"
            checked={mode === 'login'}
            onChange={() => setMode('login')}
            className={styles.radioInput}
          />
          <input
            type="radio"
            name="slide"
            id="signup"
            checked={mode === 'signup'}
            onChange={() => setMode('signup')}
            className={styles.radioInput}
          />
          <label htmlFor="login" className={`${styles.slide} ${styles.login}`} onClick={switchToLogin}>Login</label>
          <label htmlFor="signup" className={`${styles.slide} ${styles.signup}`} onClick={switchToSignup}>Signup</label>
          <div className={styles.sliderTab}></div>
        </div>

        <div className={styles.formInner}>
          {/* Login Form */}
          {submitted && mode === 'login' ? (
            <div className={styles.successMessage}>
              <p>Login link sent!</p>
              <p>Please check your email ({email}) and click the link to log in.</p>
            </div>
          ) : (
            <form
              className={styles.login}
              onSubmit={handleEmailLogin}
              ref={loginFormRef}
            >
              <div className={styles.field}>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.passLink}>
                <a href="#" onClick={(e) => { 
                  e.preventDefault(); 
                  handleMagicLinkLogin(e);
                }}>
                  Login with magic link
                </a>
              </div>
              <div className={`${styles.field} ${styles.btn}`}>
                <div className={styles.btnLayer}></div>
                <input type="submit" value="Login" />
              </div>
              <div className={styles.signupLink}>
                Not a member? <a href="#" onClick={(e) => { e.preventDefault(); switchToSignup(); }}>Signup now</a>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {submitted && mode === 'signup' ? (
            <div className={styles.successMessage}>
              <p>Signup request sent!</p>
              <p>Please check your email ({email}) for a confirmation link if required.</p>
              <button className={styles.backToLogin} onClick={switchToLogin}>Go to Login</button>
            </div>
          ) : (
            <form
              className={styles.signup}
              onSubmit={handleSignup}
            >
              <div className={styles.field}>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className={`${styles.field} ${styles.btn}`}>
                <div className={styles.btnLayer}></div>
                <input type="submit" value="Signup" />
              </div>
              <div className={styles.loginLink}>
                Already a member? <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Login now</a>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Google Sign In Button */}
      <div className={styles.orDivider}>
        <span>OR</span>
      </div>

      <GoogleSignInButton
        mode={mode === 'login' ? 'signin' : 'signup'}
        onClick={handleGoogleAuth}
        disabled={loading}
      />

      <div className={styles.termsText}>
        By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
      </div>
    </div>
  );
};

export default AuthForm;
