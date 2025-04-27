"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TrustIndicators from './TrustIndicators';
import { useAuth } from './AuthProvider';

const LoginForm = ({ transitionClass, changeScreen }) => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login, loading: isLoading, error } = useAuth();
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Call the login function from AuthContext
      const success = await login(email, password);
      
      if (success) {
        // Redirect to dashboard
        router.replace('/dash');
      } else {
        // Display error from AuthContext if available
        setErrorMessage(error || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-blue-50 mb-2">Sign In</h2>
          <p className="text-blue-200 text-md opacity-70">Access your cloud platform</p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 bg-red-900 bg-opacity-40 border border-red-800 rounded-lg">
            <p className="text-red-200 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-blue-100 text-sm block">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="text-blue-100 text-sm block">Password</label>
              <button
                type="button"
                className="text-sm text-blue-300 hover:text-blue-200 opacity-80 hover:opacity-100 transition-all"
                onClick={() => changeScreen('reset')}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={rememberDevice}
                onChange={() => setRememberDevice(!rememberDevice)}
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-blue-100">Remember this device</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-medium text-blue-50 transition-all duration-300 relative overflow-hidden shadow-md border border-opacity-30 ${isLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-blue-900 hover:bg-opacity-50'
                }`}
              style={{ backgroundColor: '#1e3a8a', borderColor: '#3b82f6' }}
              disabled={isLoading}
            >
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
                <svg className="animate-spin h-5 w-5 text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span className={`transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                Sign In
              </span>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-blue-200 opacity-70">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => changeScreen('register')}
                className="text-blue-100 hover:text-blue-50 font-medium transition-colors"
              >
                Create account
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

      {/* Mobile trust indicators */}
      <div className="lg:hidden mt-6">
        <TrustIndicators isMobile={true} />
      </div>
    </>
  );
};

export default LoginForm;