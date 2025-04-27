"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

const RegisterForm = ({ transitionClass, changeScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'red-500'
  });
  
  const { register, loading: isLoading, error } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    
    if (passwordStrength.score < 3) {
      setErrorMessage("Please use a stronger password (at least 12 characters with uppercase, lowercase, numbers, and symbols)");
      return;
    }
    
    try {
      // Call the register function from AuthContext
      const success = await register(name, email, password);
      
      if (success) {
        // Redirect to dashboard
        router.replace('/dash');
      } else {
        // Display error from AuthContext if available
        setErrorMessage(error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-blue-50 mb-2">Create Account</h2>
        <p className="text-blue-200 text-md opacity-70">Set up your OmniCloud platform</p>
      </div>

      {errorMessage && (
        <div className="p-3 mb-4 bg-red-900 bg-opacity-40 border border-red-800 rounded-lg">
          <p className="text-red-200 text-sm">{errorMessage}</p>
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