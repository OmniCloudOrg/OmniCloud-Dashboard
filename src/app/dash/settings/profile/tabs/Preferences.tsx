import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Base API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

// Available theme options
const themes = [
  { id: 'light', name: 'Light Mode', color: '#f8fafc' },
  { id: 'dark', name: 'Dark Mode', color: '#0f172a' },
  { id: 'system', name: 'System Default', color: '#64748b' },
  { id: 'blue', name: 'Blue Theme', color: '#1e40af' },
  { id: 'green', name: 'Green Theme', color: '#166534' },
  { id: 'purple', name: 'Purple Theme', color: '#7e22ce' },
];

// Available language options
const languages = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Spanish' },
  { id: 'fr', name: 'French' },
  { id: 'de', name: 'German' },
  { id: 'zh', name: 'Chinese (Simplified)' },
  { id: 'ja', name: 'Japanese' },
];

// Available timezone options
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

const PreferencesTab: React.FC = () => {
  // State for preferences
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ 
    visible: false, 
    type: '', 
    message: '' 
  });

  // Saving state
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Show notification with auto-dismiss
  const showNotification = (type: string, message: string, duration = 3000) => {
    setNotification({ visible: true, type, message });
    
    if (duration > 0) {
      setTimeout(() => {
        setNotification({ visible: false, type: '', message: '' });
      }, duration);
    }
  };

  // Generic API request handler
  const makeRequest = async (endpoint: string, method: string, body?: any) => {
    const token = localStorage.getItem('omnicloud_token');

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'An error occurred');
      (error as any).status = response.status;
      throw error;
    }

    return response.status !== 204 ? await response.json() : null;
  };

  // Fetch user preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const userData = await makeRequest('/users/profile', 'GET');
        
        // Set preferences from fetched data
        setTheme(userData.theme || 'light');
        setLanguage(userData.language || 'en');
        setTimezone(userData.timezone || 'UTC');
        setOnboardingCompleted(userData.onboarding_completed || false);
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
        showNotification('error', 'Failed to load user preferences');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Save preferences handler
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Prepare data for the update
      const preferencesData = {
        timezone,
        language,
        theme,
        onboarding_completed: onboardingCompleted,
      };
      
      // Update preferences
      await makeRequest('/users/profile', 'PUT', preferencesData);
      
      showNotification('success', 'Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      showNotification('error', 'Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
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

      <h2 className="text-xl font-medium text-white mb-6">User Preferences</h2>
      <form onSubmit={handleSavePreferences}>
        <div className="mb-6">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-2">
            Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {themes.map((themeOption) => (
              <option key={themeOption.id} value={themeOption.id}>
                {themeOption.name}
              </option>
            ))}
          </select>
          <div className="mt-2 flex space-x-2">
            {themes.map((themeOption) => (
              <div 
                key={themeOption.id}
                className={`w-6 h-6 rounded-full cursor-pointer ${
                  theme === themeOption.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: themeOption.color }}
                onClick={() => setTheme(themeOption.id)}
                title={themeOption.name}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timezones.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="onboardingCompleted"
              checked={onboardingCompleted}
              onChange={(e) => setOnboardingCompleted(e.target.checked)}
              className="h-4 w-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
            />
            <label 
              htmlFor="onboardingCompleted" 
              className="ml-2 block text-sm text-gray-300"
            >
              Mark onboarding as completed
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            This indicates that you have completed the initial setup process.
          </p>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex justify-end">
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
  );
};

export default PreferencesTab;