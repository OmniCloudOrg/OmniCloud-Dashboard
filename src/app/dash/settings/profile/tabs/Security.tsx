import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Save, 
  Loader2, 
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Base API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

interface Session {
  id: number;
  user_id: number;
  token: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  expires_at: string;
  last_active: string;
  is_current: boolean;
}

const SecurityTab: React.FC = () => {
  const router = useRouter();

  // State for sessions
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ 
    score: 0, 
    message: '', 
    color: 'red-500' 
  });

  // Notification state
  const [notification, setNotification] = useState({ 
    visible: false, 
    type: '', 
    message: '' 
  });

  // Saving state
  const [saving, setSaving] = useState(false);

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

  // Fetch user sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const fetchedSessions = await makeRequest('/auth/sessions', 'GET');
        setSessions(fetchedSessions.sessions || []);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        showNotification('error', 'Failed to load active sessions');
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
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
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  // Terminate a specific session
  const terminateSession = async (sessionId: number) => {
    try {
      await makeRequest(`/auth/sessions/${sessionId}`, 'DELETE');
      // Remove the terminated session from the list
      setSessions(prevSessions => 
        prevSessions.filter(session => session.id !== sessionId)
      );
      showNotification('success', 'Session terminated successfully');
    } catch (error) {
      console.error('Failed to terminate session:', error);
      showNotification('error', 'Failed to terminate session');
    }
  };

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Validate password
    if (passwordStrength.score < 3) {
      showNotification('error', 'Please use a stronger password (12+ characters with uppercase, lowercase, numbers, and symbols)');
      setSaving(false);
      return;
    }
    
    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      showNotification('error', 'New passwords do not match');
      setSaving(false);
      return;
    }
    
    try {
      // Change password
      await makeRequest('/auth/change-password', 'PUT', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      // Success! Will need to re-login
      showNotification('success', 'Password changed successfully! You will be redirected to login.');
      
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
      showNotification('error', (error as any).message || 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      // Call logout API 
      await makeRequest('/auth/logout', 'POST');
      
      localStorage.removeItem('omnicloud_token');
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed', error);
      showNotification('error', 'Failed to log out. Please try again.');
    }
  };

  // Determine device icon based on user agent
  const getDeviceIcon = (userAgent: string) => {
    const userAgentLower = userAgent.toLowerCase();
    if (userAgentLower.includes('mobile')) return Smartphone;
    if (userAgentLower.includes('tablet')) return Tablet;
    return Monitor;
  };

  // Format date for last active/created
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown date';
    }
  };

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

      <h2 className="text-xl font-medium text-white mb-6">Security Settings</h2>
      
      {/* Change Password Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your current password"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
              required
            />
            
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-full bg-gray-800 rounded-full h-2 mr-3">
                    <div 
                      className={`h-2 rounded-full bg-${passwordStrength.color}`} 
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-${passwordStrength.color} text-xs whitespace-nowrap`}>
                    {passwordStrength.message}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Password must be at least 12 characters long and include uppercase, lowercase, numbers, and symbols.
                </p>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
              required
            />
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
        
        {sessionsLoading ? (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-3" />
            <span className="text-gray-400">Loading sessions...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-center text-gray-400">
            No active sessions found
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.user_agent);
              
              return (
                <div 
                  key={session.id} 
                  className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <DeviceIcon className="w-6 h-6 mr-4 text-gray-400" />
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-200 mr-2">
                          {session.user_agent}
                        </span>
                        {session.is_current && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        <div>IP: {session.ip_address}</div>
                        <div>Created: {formatDate(session.created_at)}</div>
                        <div>Last Active: {formatDate(session.last_active)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {!session.is_current && (
                    <button
                      onClick={() => terminateSession(session.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Terminate Session"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-4">
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out Of All Devices
          </button>
          <p className="mt-2 text-xs text-gray-400">
            This will terminate all active sessions and require you to log in again on all devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;