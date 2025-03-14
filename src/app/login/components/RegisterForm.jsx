"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterForm = ({ transitionClass, changeScreen }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration API call
    setTimeout(() => {
      // Store auth token after successful registration
      localStorage.setItem('omnicloud_token', 'new_user_token');
      
      // Redirect to dashboard
      router.replace('/dash');
      
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className={`p-8 transition-all duration-300 ${transitionClass}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-blue-50 mb-2">Create Account</h2>
        <p className="text-blue-200 text-md opacity-70">Set up your OmniCloud platform</p>
      </div>

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
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-blue-50 border border-opacity-30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{ backgroundColor: '#0f172a', borderColor: '#1e3a8a' }}
            placeholder="••••••••"
            required
          />
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