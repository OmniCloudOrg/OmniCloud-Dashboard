"use client";

import { useState } from 'react';

const ResetForm = ({ transitionClass, changeScreen }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate password reset API call
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
      
      // Automatically return to login after showing success message
      setTimeout(() => {
        changeScreen('login');
      }, 3000);
    }, 2000);
  };

  return (
    <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-blue-50 mb-2">Reset Password</h2>
        <p className="text-blue-200 text-md opacity-70">We'll send you instructions via email</p>
      </div>

      {resetSent ? (
        <div className="p-4 bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-blue-100">Password reset link sent! Check your email.</p>
          </div>
          <p className="text-blue-200 text-sm mt-2 ml-7">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="resetemail" className="text-blue-100 text-sm block">Email</label>
            <input
              type="email"
              id="resetemail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
              placeholder="your@email.com"
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
                Send Reset Link
              </span>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-blue-200 opacity-70">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => changeScreen('login')}
                className="text-blue-100 hover:text-blue-50 font-medium transition-colors"
              >
                Back to login
              </button>
            </p>
          </div>
        </form>
      )}

      <div className="mt-8 pt-4 border-t border-opacity-20 flex justify-between items-center" style={{ borderColor: '#132045' }}>
        <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Privacy</a>
        <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Documentation</a>
        <a href="#" className="text-xs text-blue-300 hover:text-blue-200 opacity-60 hover:opacity-100 transition-all">Support</a>
      </div>
    </div>
  );
};

export default ResetForm;