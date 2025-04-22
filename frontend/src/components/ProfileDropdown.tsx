import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuthStore } from 'utils/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UploadNoteButton } from './UploadNoteButton';
import '../styles/luxury-theme.css';

export function ProfileDropdown() {
  const { user, profile, isAuthenticated } = useUser();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Log component state for debugging
  useEffect(() => {
    console.log('ProfileDropdown state:', { isAuthenticated, hasUser: !!user, hasProfile: !!profile });
  }, [isAuthenticated, user, profile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  // Get initials from name or email
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    return 'UN';
  };

  // Show the dropdown if authenticated OR if user exists (as a fallback)
  return (isAuthenticated || !!user) ? (
    <div className="flex items-center">
      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          aria-label="Open profile menu"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(!isOpen);
            }
          }}
        >
          <Avatar className="h-9 w-9 border border-gray-200 shadow-sm hover:shadow transition-all duration-300">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user?.email || 'User'} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline luxury-text">
            {profile?.full_name || user?.email?.split('@')[0] || 'User'}
          </span>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 luxury-dropdown">
            <div className="px-4 py-2 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <p className="text-sm font-medium luxury-heading">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate luxury-body">{user?.email}</p>
            </div>

            <UploadNoteButton />

            <button
              onClick={handleProfileClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 luxury-hover-effect"
            >
              Profile Settings
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200 luxury-hover-effect"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}
