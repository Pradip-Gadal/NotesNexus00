import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "utils/authStore";
import { Menu, LogOut, User as UserIcon, FileText } from "lucide-react";
import "../styles/luxury-theme.css";

// Navigation paths
const ROUTES = {
  HOME: "/",
  ACADEMIC_LEVELS: "/browse-notes?tab=academic-levels",
  RECENT_NOTES: "/browse-notes?tab=recent-notes",
  PROFILE: "/profile",
  LOGIN: "/login",
  SIGNUP: "/signup"
};

export interface Props {
  className?: string;
}

export function Navbar({ className = "" }: Props) {
  const navigate = useNavigate();
  const { user, profile } = useUser();
  const { logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState<'authenticated' | 'unauthenticated'>('unauthenticated');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Set auth state based on user presence
  useEffect(() => {
    setAuthState(user ? 'authenticated' : 'unauthenticated');
  }, [user]);

  // Memoized handlers
  const handleLogoClick = useCallback(() => {
    navigate(authState === 'authenticated' ? ROUTES.ACADEMIC_LEVELS : ROUTES.HOME);
  }, [navigate, authState]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(authState === 'authenticated' ? ROUTES.ACADEMIC_LEVELS : ROUTES.HOME);
    }
  }, [navigate, authState]);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleProfileDropdownToggle = useCallback(() => {
    setProfileDropdownOpen(prev => !prev);
  }, []);

  const handleProfileClick = useCallback(() => {
    setProfileDropdownOpen(false);
    navigate(ROUTES.PROFILE);
  }, [navigate]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      setProfileDropdownOpen(false);
      await logout();
      setAuthState('unauthenticated');
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [logout, navigate]);

  // Auth button handlers
  const handleLoginClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate(ROUTES.LOGIN);
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleSignupClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate(ROUTES.SIGNUP);
    setMobileMenuOpen(false);
  }, [navigate]);

  // Get user initials for avatar - optimized
  const getInitials = useCallback((): string => {
    if (profile?.full_name) {
      const nameParts = profile.full_name.split(' ');
      return (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '').toUpperCase().substring(0, 2);
    }
    return user?.email ? user.email.substring(0, 2).toUpperCase() : 'UN';
  }, [profile?.full_name, user?.email]);

  return (
    <header className={`w-full py-4 border-b ${className}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          aria-label="Go to homepage"
          onKeyDown={handleKeyDown}
        >
          <h1 className="text-2xl font-bold">
            NoteNexus
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu size={24} />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-10">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate(ROUTES.ACADEMIC_LEVELS)}
              className="text-lg hover:text-primary/80 transition-colors"
            >
              Browse Notes
            </button>
            <button
              onClick={() => navigate(ROUTES.RECENT_NOTES)}
              className="text-lg hover:text-primary/80 transition-colors"
            >
              Recent Notes
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="flex items-center space-x-4">
            {authState === 'authenticated' ? (
              <div className="relative">
                <button
                  onClick={handleProfileDropdownToggle}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="Open profile menu"
                >
                  <Avatar className="h-9 w-9 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user?.email || 'User'} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline luxury-text">
                    {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 luxury-dropdown">
                    <div className="px-4 py-2 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <p className="text-sm font-medium luxury-heading">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate luxury-body">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/upload-note');
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 luxury-hover-effect"
                    >
                      <FileText size={16} className="mr-2 text-blue-500" />
                      Upload Notes
                    </button>

                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 luxury-hover-effect"
                    >
                      <UserIcon size={16} className="mr-2" />
                      Profile Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200 luxury-hover-effect"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a href={ROUTES.LOGIN}>
                  <Button
                    variant="outline"
                    onClick={handleLoginClick}
                    className="sm:inline-flex px-6 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                    size="sm"
                  >
                    Login
                  </Button>
                </a>
                <a href={ROUTES.SIGNUP}>
                  <Button
                    onClick={handleSignupClick}
                    className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-20 md:hidden border-b">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    navigate(ROUTES.ACADEMIC_LEVELS);
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg py-2 hover:text-primary/80 transition-colors border-b border-gray-100"
                >
                  Academic Levels
                </button>
                <button
                  onClick={() => {
                    navigate(ROUTES.RECENT_NOTES);
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg py-2 hover:text-primary/80 transition-colors border-b border-gray-100"
                >
                  Recent Notes
                </button>

                {/* Auth Buttons - Mobile */}
                {authState === 'authenticated' ? (
                  <div className="flex flex-col space-y-2 pt-2">
                    <button
                      onClick={() => {
                        navigate('/upload-note');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <FileText size={18} className="mr-2 text-blue-500" />
                      Upload Notes
                    </button>
                    <button
                      onClick={() => {
                        navigate(ROUTES.PROFILE);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <UserIcon size={18} className="mr-2" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center text-left py-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <a href={ROUTES.LOGIN} className="w-full">
                      <Button
                        variant="outline"
                        onClick={handleLoginClick}
                        className="w-full justify-center border-blue-600 text-blue-600 hover:bg-blue-50"
                        size="sm"
                      >
                        Login
                      </Button>
                    </a>
                    <a href={ROUTES.SIGNUP} className="w-full">
                      <Button
                        onClick={handleSignupClick}
                        className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        size="sm"
                      >
                        Sign Up
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Export the Header component as an alias of Navbar for backward compatibility
export function Header(props: Props) {
  return <Navbar {...props} />;
}
