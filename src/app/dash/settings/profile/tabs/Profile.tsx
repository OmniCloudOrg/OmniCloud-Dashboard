import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

// Base API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

const ProfileTab: React.FC = () => {
  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Notification state
  const [notification, setNotification] = useState({ 
    visible: false, 
    type: '', 
    message: '' 
  });

  // Saving and loading states
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

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch basic user info
        const userData = await makeRequest('/auth/me', 'GET');
        setEmail(userData.email);

        // Fetch complete profile
        const profileData = await makeRequest('/users/profile', 'GET');
        
        // Set profile fields
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        setFullName(profileData.full_name || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        showNotification('error', 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Save profile handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Prepare data for the update
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName || `${firstName} ${lastName}`.trim(),
      };
      
      // Update profile
      await makeRequest('/users/profile', 'PUT', profileData);
      
      showNotification('success', 'Profile information updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading profile...</p>
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

      <h2 className="text-xl font-medium text-white mb-6">Personal Information</h2>
      <form onSubmit={handleSaveProfile}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How you want to be addressed"
          />
          <p className="mt-1 text-xs text-gray-400">
            This name will be displayed across the platform. If left empty, we'll use your first and last name.
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="w-full p-3 text-gray-400 bg-gray-800 border border-gray-600 rounded-lg opacity-70 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-400">
            Your email address cannot be changed. Contact support if you need to update it.
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
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;