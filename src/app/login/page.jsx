"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Background from './components/Background';
import BrandingSection from './components/BrandingSection';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetForm from './components/ResetForm';
import CreditsModal from './components/CreditsModal';

// Dev override - REMOVE IN PRODUCTION
const DEV_MODE = process.env.NODE_ENV === 'development';
const DEV_QUICK_LOGIN = true; // Set to false to test normal login in dev

const LoginPage = () => {
  // State for transitions
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'reset'
  const [transitionClass, setTransitionClass] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  // Animation effect to fade in the form when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle screen transitions
  const changeScreen = (screen) => {
    setTransitionClass('fade-out');

    setTimeout(() => {
      setCurrentScreen(screen);
      setTransitionClass('fade-in');
    }, 300);
  };

  // Dev mode quick login
  const handleDevLogin = () => {
    if (DEV_MODE && DEV_QUICK_LOGIN) {
      localStorage.setItem('omnicloud_token', 'dev_token');
      router.replace('/dash');
    }
  };

  // Animation classes
  const formAnimation = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-20';

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#020617' }}>
      {/* Background Canvas */}
      <Background />

      {/* Main content container */}
      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
        {/* Left side - branding and features */}
        <BrandingSection />

        {/* Right side - login card */}
        <div className={`w-full lg:w-5/12 transition-all duration-1000 ease-out ${formAnimation}`}>
          <div className="bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-opacity-20 overflow-hidden"
            style={{ backgroundColor: '#0a1225', borderColor: '#132045' }}>

            {/* Login Form */}
            {currentScreen === 'login' && (
              <LoginForm
                transitionClass={transitionClass}
                changeScreen={changeScreen}
                handleDevLogin={handleDevLogin}
              />
            )}

            {/* Register Form */}
            {currentScreen === 'register' && (
              <RegisterForm
                transitionClass={transitionClass}
                changeScreen={changeScreen}
              />
            )}

            {/* Password Reset Form */}
            {currentScreen === 'reset' && (
              <ResetForm
                transitionClass={transitionClass}
                changeScreen={changeScreen}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer with version */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-blue-200 text-sm opacity-60">
          OmniCloud Enterprise Edition • v4.2.1
          {DEV_MODE && " (Development Mode)"}
        </p>
        <CreditsModal />
      </div>

      {/* Global styles for transitions */}
      <style jsx global>{`
        .fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        
        .fade-out {
          animation: fadeOut 0.3s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;