import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore, Profile } from "utils/authStore";
import { supabase } from "utils/supabaseClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, User, FolderUp, Heart, Settings, Camera } from "lucide-react";
import { AvatarUploadModal } from "../components/AvatarUploadModal";
import "../styles/luxury-theme.css";

// Define the form values type based on the Profile interface
type ProfileFormValues = Pick<Profile, 'username' | 'full_name' | 'academic_name' | 'academic_level' | 'id_card'>;

export default function ProfilePage() {
    const {
        session,
        user,
        loading: authLoading,
        profile,
        profileLoading,
        updateProfile,
        fetchProfile,
        logout
    } = useAuthStore();
    const navigate = useNavigate();
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // --- Effects ---
    useEffect(() => {
        // Redirect to login if not authenticated and loading is finished
        if (!authLoading && !session) {
            navigate("/login");
        }
    }, [session, authLoading, navigate]);

    // Fetch profile data when component mounts or when navigating back to it
    useEffect(() => {
        if (session && user) {
            console.log("Profile page mounted, fetching latest profile data...");
            fetchProfile();
        }
    }, [session, user, fetchProfile]);

    // Helper to get avatar fallback initials
    const getInitials = (name: string | null | undefined): string => {
        if (!name) return "U"; // Default to User
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const handleAvatarUploadSuccess = async (filePath: string) => {
        if (!user) return;

        try {
            // Get the public URL for the uploaded file
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (!data || !data.publicUrl) {
                throw new Error("Could not get public URL for uploaded avatar.");
            }

            // Add a cache-busting parameter to prevent browser caching
            const cacheBuster = `?t=${new Date().getTime()}`;
            const avatarUrl = `${data.publicUrl}${cacheBuster}`;

            console.log("New avatar URL with cache buster:", avatarUrl);

            // Update the user's profile with the new avatar URL
            await updateProfile({
                id: user.id,
                avatar_url: avatarUrl,
            });

            // Force a refresh of the profile data to ensure the UI updates
            await fetchProfile();

            toast.success("Profile picture updated successfully!");
        } catch (error: any) {
            console.error("Failed to update profile with avatar URL:", error);
            toast.error(`Failed to update avatar: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // --- Render Logic ---
    // Combined loading state
    const isLoading = authLoading || profileLoading;

    // Create a placeholder profile from user data if available
    const placeholderProfile = useMemo(() => {
        if (!user) return null;

        return {
            id: user.id,
            username: user.email?.split('@')[0] || null,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || null,
            academic_name: null,
            academic_level: null,
            id_card: null,
            updated_at: null
        } as Profile;
    }, [user]);

    // Use the placeholder profile if the real profile is still loading
    const displayProfile = profile || placeholderProfile;

    // Show loading skeletons only if we have no profile data at all
    if (isLoading && !displayProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="w-full max-w-md p-6 bg-white rounded-3xl">
                    <div className="flex justify-center mb-4">
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="flex flex-col items-center mb-6">
                        <Skeleton className="h-24 w-24 rounded-xl mb-4" />
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-14 w-full rounded-xl" />
                        <Skeleton className="h-14 w-full rounded-xl" />
                        <Skeleton className="h-14 w-full rounded-xl" />
                        <Skeleton className="h-14 w-full rounded-xl" />
                    </div>
                    <div className="mt-8">
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }
    // Show profile content
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen bg-white py-8 px-4"
        >
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden relative">
                {/* Back button in top left corner */}
                <div className="absolute left-4 top-4 text-indigo-600 bg-indigo-100 rounded-lg p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </div>

                {/* Header */}
                <div className="pt-6 pb-4 text-center">
                    <h1 className="text-xl font-medium text-gray-700">Profile</h1>
                </div>

                {/* Profile Info */}
                <div className="flex flex-col items-center px-6 pb-6">
                    <div className="relative mb-4 group">
                        <div className="relative">
                            <Avatar className="h-24 w-24 rounded-xl border-2 border-white shadow-sm">
                                <AvatarImage
                                    src={displayProfile?.avatar_url || undefined}
                                    alt={displayProfile?.full_name || displayProfile?.username || 'User Avatar'}
                                    className="object-cover"
                                    onError={(e) => {
                                        console.log('Avatar image failed to load, falling back to initials');
                                        // Let the AvatarFallback component handle the fallback
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xl">
                                    {getInitials(displayProfile?.full_name || displayProfile?.username)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-indigo-500 rounded-full p-1 shadow-sm cursor-pointer"
                                onClick={() => setIsAvatarModalOpen(true)}
                                title="Change profile picture"
                            >
                                <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center">
                                    <Camera size={12} className="text-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Avatar Upload Modal */}
                    {user && (
                        <AvatarUploadModal
                            isOpen={isAvatarModalOpen}
                            onClose={() => setIsAvatarModalOpen(false)}
                            userId={user.id}
                            onSuccess={handleAvatarUploadSuccess}
                        />
                    )}

                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {displayProfile?.full_name || 'User'}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                        {displayProfile?.username ? `@${displayProfile.username}` : user?.email || 'Loading...'}
                    </p>
                    <p className="text-xs text-gray-400 text-center max-w-xs mb-8">
                        {displayProfile?.academic_name ? `${displayProfile.academic_name} - ${displayProfile.academic_level || 'Unknown level'}` : (isLoading ? 'Loading profile information...' : 'No academic information provided.')}
                    </p>

                    {/* Loading indicator that shows only when profile is loading but we have some data */}
                    {isLoading && displayProfile && (
                        <div className="mb-4 text-xs text-indigo-500 flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading profile data...
                        </div>
                    )}

                    {/* Menu Items */}
                    <div className="w-full space-y-4">
                        <button
                            onClick={() => navigate('/profile/details')}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-xl"
                        >
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <User size={20} className="text-indigo-500" />
                                </div>
                                <span className="font-medium text-gray-700">Profile details</span>
                            </div>
                            <ChevronRight size={20} className="text-indigo-300" />
                        </button>

                        <button
                            onClick={() => navigate('/profile/uploaded-files')}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-xl"
                        >
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <FolderUp size={20} className="text-indigo-500" />
                                </div>
                                <span className="font-medium text-gray-700">Uploaded files</span>
                            </div>
                            <ChevronRight size={20} className="text-indigo-300" />
                        </button>

                        <button
                            onClick={() => navigate('/profile/saved-files')}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-xl"
                        >
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <Heart size={20} className="text-indigo-500" />
                                </div>
                                <span className="font-medium text-gray-700">Saved Files</span>
                            </div>
                            <ChevronRight size={20} className="text-indigo-300" />
                        </button>

                        <button
                            onClick={() => navigate('/profile/settings')}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-xl"
                        >
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <Settings size={20} className="text-indigo-500" />
                                </div>
                                <span className="font-medium text-gray-700">Settings</span>
                            </div>
                            <ChevronRight size={20} className="text-indigo-300" />
                        </button>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full mt-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// The Profile interface is imported from authStore.ts, not exported from here