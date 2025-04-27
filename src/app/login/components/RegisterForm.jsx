"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// API base URL configuration
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

const RegisterForm = ({ transitionClass, changeScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'red-500'
  });
  
  const router = useRouter();

  // Check password strength
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
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  // Toggle debug info
  const toggleDebug = () => {
    setDebugInfo(debugInfo ? '' : 'Debug mode enabled');
  };

  // Direct API registration without using AuthContext
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Update debug info
    if (debugInfo) {
      setDebugInfo('Starting registration process...');
    }
    
    // Basic validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    
    if (passwordStrength.score < 3) {
      setErrorMessage("Please use a stronger password (at least 12 characters with uppercase, lowercase, numbers, and symbols)");
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      if (debugInfo) {
        setDebugInfo(prev => `${prev}\nSending request to: ${apiBaseUrl}/auth/register`);
        setDebugInfo(prev => `${prev}\nRequest data: { email: "${email}", password: "*****", name: "${name}" }`);
      }
      
      // CORS Fix: Removed credentials: 'include' from request
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name
        }),
        // Important: No credentials: 'include' here
      });
      
      if (debugInfo) {
        setDebugInfo(prev => `${prev}\nResponse status: ${response.status}`);
      }
      
      // Try to parse response
      let responseData;
      try {
        responseData = await response.json();
        
        if (debugInfo) {
          setDebugInfo(prev => `${prev}\nResponse data: ${JSON.stringify(responseData, null, 2)}`);
        }
      } catch (parseError) {
        if (debugInfo) {
          setDebugInfo(prev => `${prev}\nFailed to parse response as JSON.`);
          
          try {
            const textResponse = await response.text();
            setDebugInfo(prev => `${prev}\nRaw response: ${textResponse}`);
          } catch (textError) {
            setDebugInfo(prev => `${prev}\nCouldn't get response text: ${textError.message}`);
          }
        }
        
        // Default response data
        responseData = { message: 'Server error. Please try again.' };
      }
      
      if (response.ok) {
        // Store auth token
        if (responseData && responseData.token) {
          localStorage.setItem('omnicloud_token', responseData.token);
          
          if (debugInfo) {
            setDebugInfo(prev => `${prev}\nRegistration successful! Token stored.`);
          }
          
          // Redirect to dashboard
          router.replace('/dash');
        } else {
          setErrorMessage('Invalid server response. Token missing.');
          setFormSubmitting(false);
        }
      } else {
        // Handle error response
        setErrorMessage(responseData.message || 'Registration failed. Please try again.');
        setFormSubmitting(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (debugInfo) {
        setDebugInfo(prev => `${prev}\nError: ${error.message}`);
      }
      setErrorMessage('Network error. Please check your connection and try again.');
      setFormSubmitting(false);
    }
  };

  return (
    <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-blue-50 mb-2">Create Account</h2>
        <p className="text-blue-200 text-md opacity-70">Set up your OmniCloud platform</p>
        {/* Hidden debug button - double click to activate */}
        <div className="mt-1 text-right">
          <button 
            type="button"
            onDoubleClick={toggleDebug}
            className="text-xs text-blue-300 opacity-30 hover:opacity-50"
          >
            {debugInfo ? 'Hide Debug' : 'Debug'}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 mb-4 bg-red-900 bg-opacity-40 border border-red-800 rounded-lg">
          <p className="text-red-200 text-sm">{errorMessage}</p>
        </div>
      )}
      
      {debugInfo && (
        <div className="p-3 mb-4 bg-gray-900 bg-opacity-40 border border-gray-800 rounded-lg overflow-auto max-h-48">
          <pre className="text-gray-300 text-xs whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-blue-100 text-sm block">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
            placeholder="Your Name"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="regemail" className="text-blue-100 text-sm block">Email</label>
          <input
            type="email"
            id="regemail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="regpassword" className="text-blue-100 text-sm block">Password</label>
          <input
            type="password"
            id="regpassword"
            value={password}
            onChange={handlePasswordChange}
            className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
            placeholder="••••••••"
            required
          />
          {password && (
            <div className="mt-1">
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-800 rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full bg-${passwordStrength.color}`} 
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-${passwordStrength.color} text-xs whitespace-nowrap`}>
                  {passwordStrength.message}
                </span>
              </div>
              <p className="text-blue-200 text-xs mt-1 opacity-70">
                Use at least 12 characters with uppercase, lowercase, numbers, and symbols
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm" className="text-blue-100 text-sm block">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium text-blue-50 transition-all duration-300 relative overflow-hidden shadow-md border border-opacity-30 ${formSubmitting
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-blue-900 hover:bg-opacity-50'
              }`}
            style={{ backgroundColor: '#1e3a8a', borderColor: '#3b82f6' }}
            disabled={formSubmitting}
          >
            <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${formSubmitting ? 'opacity-100' : 'opacity-0'}`}>
              <svg className="animate-spin h-5 w-5 text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span className={`transition-all duration-300 ${formSubmitting ? 'opacity-0' : 'opacity-100'}`}>
              Create Account
            </span>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-200 opacity-70">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => changeScreen('login')}
              className="text-blue-100 hover:text-blue-50 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>

      <div className="mt-8 pt-4 border-t border-opacity-20 flex justify-between items-center" style={{ borderColor: '#132045' }}>
        <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Privacy</a>
        <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Documentation</a>
        <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Support</a>
      </div>
    </div>
  );
};

export default RegisterForm;