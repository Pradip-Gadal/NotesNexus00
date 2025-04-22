import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Trash2, 
  Bell, 
  Globe, 
  Shield, 
  Share2, 
  HelpCircle,
  Moon,
  Sun,
  ChevronRight,
  Copy
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import "../styles/luxury-theme.css";

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would apply dark mode to the app
    toast.success(`${!darkMode ? 'Dark' : 'Light'} mode activated`);
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
  };

  // Copy referral link
  const copyReferralLink = () => {
    const referralLink = `https://notenexus.com/ref/${user?.id || 'user'}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        toast.success('Referral link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy referral link');
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white py-8 px-4"
    >
      <div className="container mx-auto max-w-2xl">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="mr-4 p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Appearance Section */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              {darkMode ? (
                <Moon className="h-5 w-5 text-indigo-600 mr-3" />
              ) : (
                <Sun className="h-5 w-5 text-indigo-600 mr-3" />
              )}
              <span className="font-medium text-gray-700">Dark Mode</span>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>

          {/* Trash Bin */}
          <button 
            onClick={() => navigate('/settings/trash')}
            className="w-full p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Trash2 className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="font-medium text-gray-700">Trash Bin</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          {/* Notifications */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="font-medium text-gray-700">Notifications</span>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={toggleNotifications}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>

          {/* Language */}
          <button 
            onClick={() => navigate('/settings/language')}
            className="w-full p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="font-medium text-gray-700">Language</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">English</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </button>

          {/* Privacy Policy */}
          <button 
            onClick={() => navigate('/settings/privacy')}
            className="w-full p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="font-medium text-gray-700">Privacy Policy</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          {/* Refer your Friend */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Share2 className="h-5 w-5 text-indigo-600 mr-3" />
                <span className="font-medium text-gray-700">Refer your Friend</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-1 bg-gray-100 rounded-l-md p-2 text-sm text-gray-600 truncate">
                https://notenexus.com/ref/{user?.id || 'user'}
              </div>
              <button 
                onClick={copyReferralLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-r-md transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Feedback & Help */}
          <button 
            onClick={() => navigate('/settings/help')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-indigo-600 mr-3" />
              <span className="font-medium text-gray-700">Feedback & Help</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* App Version */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>NoteNexus v1.0.0</p>
          <p className="mt-1">© 2023 NoteNexus. All rights reserved.</p>
        </div>
      </div>
    </motion.div>
  );
}
