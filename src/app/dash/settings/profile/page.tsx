"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Lock, 
  Loader2 
} from 'lucide-react';

// Import sub-components
import AccountInfoCard from './AccountInfoCard';
import ProfileTab from './tabs/Profile';
import PreferencesTab from './tabs/Preferences';
import SecurityTab from './tabs/Security';

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  
  // UI state
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');

  return (
    <div className="min-h-screen text-white p-4 lg:p-8 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your profile, preferences, and security settings</p>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-medium text-white">Settings</h2>
              </div>
              <ul>
                <li>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 text-left ${
                      activeTab === 'profile' 
                        ? 'bg-blue-900 bg-opacity-30 text-blue-300 border-l-2 border-blue-500' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center px-4 py-3 text-left ${
                      activeTab === 'preferences' 
                        ? 'bg-blue-900 bg-opacity-30 text-blue-300 border-l-2 border-blue-500' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    <span>Preferences</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-3 text-left ${
                      activeTab === 'security' 
                        ? 'bg-blue-900 bg-opacity-30 text-blue-300 border-l-2 border-blue-500' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                    }`}
                  >
                    <Lock className="w-5 h-5 mr-3" />
                    <span>Security</span>
                  </button>
                </li>
              </ul>
            </nav>
            
            {/* Account info card */}
            <AccountInfoCard />
          </div>
          
          {/* Content area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-lg">
              {/* Tab content */}
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'preferences' && <PreferencesTab />}
              {activeTab === 'security' && <SecurityTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;