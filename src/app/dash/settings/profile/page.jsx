"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Settings, 
  Lock, 
  Bell, 
  Globe, 
  Palette, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

// API base URL configuration
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

// Define available themes
const themes = [
  { id: 'light', name: 'Light Mode', color: '#f8fafc' },
  { id: 'dark', name: 'Dark Mode', color: '#0f172a' },
  { id: 'system', name: 'System Default', color: '#64748b' },
  { id: 'blue', name: 'Blue Theme', color: '#1e40af' },
  { id: 'green', name: 'Green Theme', color: '#166534' },
  { id: 'purple', name: 'Purple Theme', color: '#7e22ce' },
];

// Define available languages
const languages = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Spanish' },
  { id: 'fr', name: 'French' },
  { id: 'de', name: 'German' },
  { id: 'zh', name: 'Chinese (Simplified)' },
  { id: 'ja', name: 'Japanese' },
];

// Define timezone options
const timezones = [
  { id: 'UTC', name: 'UTC (Coordinated Universal Time)' },
  { id: 'America/New_York', name: 'Eastern Time (US & Canada)' },
  { id: 'America/Chicago', name: 'Central Time (US & Canada)' },
  { id: 'America/Denver', name: 'Mountain Time (US & Canada)' },
  { id: 'America/Los_Angeles', name: 'Pacific Time (US & Canada)' },
  { id: 'Europe/London', name: 'London, Edinburgh' },
  { id: 'Europe/Paris', name: 'Paris, Berlin, Rome, Madrid' },
  { id: 'Asia/Tokyo', name: 'Tokyo, Osaka' },
  { id: 'Asia/Shanghai', name: 'Beijing, Shanghai' },
  { id: 'Australia/Sydney', name: 'Sydney, Melbourne' },
];

const ProfileSettings = () => {
  const router = useRouter();
  
  // User data state
  const [userData, setUserData] = useState(null);
  const [userMeta, setUserMeta] = useState(null);
  const [userPii, setUserPii] = useState(null);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState('');
  const [timezone, setTimezone] = useState('');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '', color: 'red-500' });
  
  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('omnicloud_token');
        
        if (!token) {
          router.replace('/login');
          return;
        }
        
        // Fetch user profile data
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('omnicloud_token');
            router.replace('/login');
            return;
          }
          throw new Error(`Error fetching user data: ${response.status}`);
        }
        
        const userData = await response.json();
        setUserData(userData);
        setEmail(userData.email);
        
        // Fetch user meta data with additional API endpoint
        // Note: We could extend the API to return this with /me, but we'll use the existing endpoints
        try {
          const metaResponse = await fetch(`${apiBaseUrl}/users/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (metaResponse.ok) {
            const metaData = await metaResponse.json();
            setUserMeta(metaData);
            
            // Set form fields from meta data
            setTheme(metaData.theme || 'light');
            setLanguage(metaData.language || 'en');
            setTimezone(metaData.timezone || 'UTC');
            setOnboardingCompleted(metaData.onboarding_completed || false);
            
            // Set personal info from PII data if available
            if (metaData.first_name) setFirstName(metaData.first_name);
            if (metaData.last_name) setLastName(metaData.last_name);
            if (metaData.full_name) setFullName(metaData.full_name);
          }
        } catch (metaError) {
          console.error('Error fetching user meta:', metaError);
          // Continue with basic user data even if meta fetch fails
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setNotification({
          visible: true,
          type: 'error',
          message: 'Failed to load user profile. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let message = '';
    let color = 'red-500';

    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        message = 'Very weak';
        color = 'red-500';
        break;
      case 2:
        message = 'Weak';
        color = 'orange-500';
        break;
      case 3:
        message = 'Medium';
        color = 'yellow-500';
        break;
      case 4:
        message = 'Strong';
        color = 'green-400';
        break;
      case 5:
        message = 'Very strong';
        color = 'green-300';
        break;
      default:
        message = '';
    }

    return { score, message, color };
  };
  
  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };
  
  // Save profile information
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification({ visible: false, type: '', message: '' });
    
    try {
      const token = localStorage.getItem('omnicloud_token');
      
      if (!token) {
        router.replace('/login');
        return;
      }
      
      // Prepare data for the update
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName || `${firstName} ${lastName}`.trim(),
      };
      
      // Update profile
      const response = await fetch(`${apiBaseUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`);
      }
      
      setNotification({
        visible: true,
        type: 'success',
        message: 'Profile information updated successfully!'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ visible: false, type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        visible: true,
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Save preferences
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification({ visible: false, type: '', message: '' });
    
    try {
      const token = localStorage.getItem('omnicloud_token');
      
      if (!token) {
        router.replace('/login');
        return;
      }
      
      // Prepare data for the update
      const preferencesData = {
        timezone,
        language,
        theme,
        onboarding_completed: onboardingCompleted,
      };
      
      // Update preferences
      const response = await fetch(`${apiBaseUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.status}`);
      }
      
      setNotification({
        visible: true,
        type: 'success',
        message: 'Preferences updated successfully!'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ visible: false, type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setNotification({
        visible: true,
        type: 'error',
        message: 'Failed to update preferences. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification({ visible: false, type: '', message: '' });
    
    // Validate password
    if (passwordStrength.score < 3) {
      setNotification({
        visible: true,
        type: 'error',
        message: 'Please use a stronger password (12+ characters with uppercase, lowercase, numbers, and symbols)'
      });
      setSaving(false);
      return;
    }
    
    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      setNotification({
        visible: true,
        type: 'error',
        message: 'New passwords do not match'
      });
      setSaving(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('omnicloud_token');
      
      if (!token) {
        router.replace('/login');
        return;
      }
      
      // Change password
      const response = await fetch(`${apiBaseUrl}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          setNotification({
            visible: true,
            type: 'error',
            message: 'Current password is incorrect'
          });
        } else {
          setNotification({
            visible: true,
            type: 'error',
            message: data.message || 'Failed to change password'
          });
        }
        return;
      }
      
      // Success! Will need to re-login
      setNotification({
        visible: true,
        type: 'success',
        message: 'Password changed successfully! You will be redirected to login.'
      });
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Log out after 2 seconds
      setTimeout(() => {
        localStorage.removeItem('omnicloud_token');
        router.replace('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setNotification({
        visible: true,
        type: 'error',
        message: 'Failed to change password. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
      <div className="min-h-screen bg-slate-900 text-white p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Account Settings</h1>
            <p className="text-slate-400">Manage your profile, preferences, and security settings</p>
          </div>
          
          {/* Notification */}
          {notification.visible && (
            <div className={`mb-6 p-4 rounded-lg flex items-start ${
              notification.type === 'success' ? 'bg-green-900 bg-opacity-20 border border-green-800' :
              notification.type === 'error' ? 'bg-red-900 bg-opacity-20 border border-red-800' :
              'bg-blue-900 bg-opacity-20 border border-blue-800'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <p className={`${
                notification.type === 'success' ? 'text-green-300' :
                notification.type === 'error' ? 'text-red-300' :
                'text-blue-300'
              }`}>
                {notification.message}
              </p>
            </div>
          )}
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <h2 className="text-lg font-medium text-white">Settings</h2>
                </div>
                <ul>
                  <li>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-3 text-left ${
                        activeTab === 'profile' 
                          ? 'bg-blue-900 bg-opacity-30 text-blue-300 border-l-2 border-blue-500' 
                          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
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
                          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
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
                          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <Lock className="w-5 h-5 mr-3" />
                      <span>Security</span>
                    </button>
                  </li>
                </ul>
              </nav>
              
              {/* Account info card */}
              <div className="mt-6 bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-3">Account Info</h3>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                  </div>
                ) : userData ? (
                  <>
                    <div className="mb-2">
                      <div className="text-xs text-slate-500">User ID</div>
                      <div className="text-sm text-slate-300">{userData.id}</div>
                    </div>
                    <div className="mb-2">
                      <div className="text-xs text-slate-500">Created</div>
                      <div className="text-sm text-slate-300">
                        {new Date(userData.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-xs text-slate-500">Last Login</div>
                      <div className="text-sm text-slate-300">
                        {userData.last_login_at 
                          ? new Date(userData.last_login_at).toLocaleString() 
                          : 'Never'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Status</div>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full ${userData.active ? 'bg-green-400' : 'bg-red-400'} mr-2`}></div>
                        <span className="text-sm text-slate-300">{userData.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 text-sm">No data available</div>
                )}
              </div>
            </div>
            
            {/* Content area */}
            <div className="lg:col-span-3">
              <div className="bg-slate-800 rounded-lg">
                {/* Loading state */}
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="mt-4 text-slate-400">Loading your profile data...</p>
                  </div>
                ) : (
                  <>
                    {/* Profile tab */}
                    {activeTab === 'profile' && (
                      <div className="p-6">
                        <h2 className="text-xl font-medium text-white mb-6">Personal Information</h2>
                        <form onSubmit={handleSaveProfile}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your first name"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your last name"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                              Display Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full p-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="How you want to be addressed"
                            />
                            <p className="mt-1 text-xs text-slate-400">
                              This name will be displayed across the platform. If left empty, we'll use your first and last name.
                            </p>
                          </div>
                          
                          <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              disabled
                              className="w-full p-3 text-slate-400 bg-slate-700 border border-slate-600 rounded-lg opacity-70 cursor-not-allowed"
                            />
                            <p className="mt-1 text-xs text-slate-400">
                              Your email address cannot be changed. Contact support if you need to update it.
                            </p>
                          </div>
                          
                          <div className="border-t border-slate-700 pt-6 flex justify-end">
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Preferences
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {/* Security tab */}
                    {activeTab === 'security' && (
                      <div className="p-6">
                        <h2 className="text-xl font-medium text-white mb-6">Security Settings</h2>
                        
                        {/* Password change section */}
                        <div className="mb-8">
                          <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                          <form onSubmit={handleChangePassword}>
                            <div className="mb-4">
                              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your current password"
                                required
                              />
                            </div>
                            
                            <div className="mb-4">
                              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your new password"
                                required
                              />
                              
                              {newPassword && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="w-full bg-slate-700 rounded-full h-2 mr-3">
                                      <div 
                                        className={`h-2 rounded-full bg-${passwordStrength.color}`} 
                                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-${passwordStrength.color} text-xs whitespace-nowrap`}>
                                      {passwordStrength.message}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400">
                                    Password must be at least 12 characters long and include uppercase, lowercase, numbers, and symbols.
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mb-6">
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 text-slate-200 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm your new password"
                                required
                              />
                            </div>
                            
                            <div className="border-t border-slate-700 pt-6 flex justify-end">
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
                                disabled={saving}
                              >
                                {saving ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Changing...
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Change Password
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                        
                        {/* Account sessions */}
                        <div>
                          <h3 className="text-lg font-medium text-white mb-4">Active Sessions</h3>
                          <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-sm font-medium text-slate-200">Current Session</div>
                                <div className="text-xs text-slate-400">This device</div>
                              </div>
                              <div className="flex items-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-xs text-slate-300">Active</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-slate-400">Device</span>
                                <div className="text-slate-300 mt-1">Current Browser</div>
                              </div>
                              <div>
                                <span className="text-slate-400">IP Address</span>
                                <div className="text-slate-300 mt-1">-</div>
                              </div>
                              <div>
                                <span className="text-slate-400">Last Activity</span>
                                <div className="text-slate-300 mt-1">Just now</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <button 
                              onClick={handleLogout}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center"
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Log Out Of All Devices
                            </button>
                            <p className="mt-2 text-xs text-slate-400">
                              This will terminate all active sessions and require you to log in again on all devices.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfileSettings;