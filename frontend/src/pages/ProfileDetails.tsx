import React, { useEffect, useState } from "react";
import { useAuthStore, Profile } from "utils/authStore";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "../styles/luxury-theme.css";

export default function ProfileDetailsPage() {
    const {
        session,
        user,
        loading: authLoading,
        profile,
        profileLoading,
        updateProfile,
        fetchProfile
    } = useAuthStore();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState<Partial<Profile>>({
        full_name: '',
        academic_name: '',
        academic_level: '',
        id_card: '',
        bio: ''
    });
    const [isEditing, setIsEditing] = useState(true); // Set to true by default to make fields editable
    const [isSaving, setIsSaving] = useState(false);
    const isLoading = authLoading || profileLoading;

    // --- Effects ---
    useEffect(() => {
        // Redirect to login if not authenticated and loading is finished
        if (!authLoading && !session) {
            navigate("/login");
        }
    }, [session, authLoading, navigate]);

    // Initialize form values when profile is loaded
    useEffect(() => {
        if (profile) {
            setFormValues({
                full_name: profile.full_name || '',
                academic_name: profile.academic_name || '',
                academic_level: profile.academic_level || '',
                id_card: profile.id_card || '',
                bio: profile.bio || ''
            });
        }
    }, [profile]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("You must be logged in to update your profile.");
            return;
        }

        // Validate form data
        if (!formValues.full_name?.trim()) {
            toast.error("Full name is required.");
            return;
        }

        setIsSaving(true);
        try {
            // Add the user ID to the form values
            await updateProfile({
                ...formValues,
                id: user.id
            });

            // Update was successful
            setIsEditing(false);
            toast.success("Profile updated successfully!");

            // Refresh profile data to ensure we have the latest data
            await fetchProfile();
        } catch (error: any) {
            console.error("Failed to update profile:", error);

            // Provide a more user-friendly error message
            if (error.message.includes("database") || error.message.includes("table")) {
                toast.error("Database error. Please try again later or contact support.");
            } else {
                toast.error(`Failed to update profile: ${error.message}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Show loading skeletons
    if (isLoading && !profile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="w-full max-w-md p-6 bg-white rounded-3xl">
                    <div className="flex justify-center mb-4">
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                    <div className="mt-8">
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    // Show profile details content
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center min-h-screen bg-white py-8 px-4"
        >
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden relative">
                {/* Back button in top left corner */}
                <button
                    onClick={() => navigate('/profile')}
                    className="absolute left-4 top-4 text-indigo-600 bg-indigo-100 rounded-lg p-1.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>

                {/* Header */}
                <div className="pt-6 pb-4 text-center">
                    <h1 className="text-xl font-medium text-gray-700">Profile Details</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditing ? "Edit your profile information below" : "Click 'Edit Profile' to make changes"}
                    </p>
                </div>

                {/* Profile Form */}
                <div className={`px-6 pb-6 ${isEditing ? 'bg-indigo-50/30 rounded-3xl transition-all duration-500' : ''}`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700 flex items-center">
                                Full Name
                            </Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formValues.full_name}
                                onChange={handleInputChange}
                                placeholder="Your full name"
                                disabled={!isEditing || isSaving}
                                className={`rounded-xl transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm hover:border-indigo-400'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="academic_name" className="text-sm font-medium text-gray-700 flex items-center">
                                Academic Name
                            </Label>
                            <Input
                                id="academic_name"
                                name="academic_name"
                                value={formValues.academic_name}
                                onChange={handleInputChange}
                                placeholder="Your academic institution name"
                                disabled={!isEditing || isSaving}
                                className={`rounded-xl transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm hover:border-indigo-400'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="academic_level" className="text-sm font-medium text-gray-700 flex items-center">
                                Academic Level
                            </Label>
                            <Input
                                id="academic_level"
                                name="academic_level"
                                value={formValues.academic_level}
                                onChange={handleInputChange}
                                placeholder="Your academic level (e.g., High School, Bachelor's, Master's)"
                                disabled={!isEditing || isSaving}
                                className={`rounded-xl transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm hover:border-indigo-400'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="id_card" className="text-sm font-medium text-gray-700 flex items-center">
                                ID Card
                            </Label>
                            <Input
                                id="id_card"
                                name="id_card"
                                value={formValues.id_card}
                                onChange={handleInputChange}
                                placeholder="Your ID card number"
                                disabled={!isEditing || isSaving}
                                className={`rounded-xl transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm hover:border-indigo-400'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-sm font-medium text-gray-700 flex items-center">
                                Bio
                            </Label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formValues.bio || ''}
                                onChange={(e) => setFormValues(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Tell us about yourself"
                                disabled={!isEditing || isSaving}
                                className={`w-full px-3 py-2 text-sm rounded-xl transition-all duration-300 ${!isEditing ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-white border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm hover:border-indigo-400'}`}
                                rows={4}
                            />
                        </div>

                        <div className="pt-4 flex space-x-3">
                            {isEditing ? (
                                <>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl py-2.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form values to current profile
                                            if (profile) {
                                                setFormValues({
                                                    full_name: profile.full_name || '',
                                                    academic_name: profile.academic_name || '',
                                                    academic_level: profile.academic_level || '',
                                                    id_card: profile.id_card || '',
                                                    bio: profile.bio || ''
                                                });
                                            }
                                        }}
                                        className="flex-1 border-gray-300 text-gray-700 font-medium rounded-xl py-2.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                        disabled={isSaving}
                                    >
                                        Discard Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl py-2.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
