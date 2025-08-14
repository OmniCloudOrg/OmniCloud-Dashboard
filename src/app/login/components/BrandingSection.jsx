"use client";

import TrustIndicators from './TrustIndicators';

const BrandingSection = () => {
  return (
    <div className="w-full lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0">
      <div className="flex flex-col items-center lg:items-start">
        {/* Logo */}
        <div className="inline-flex items-center mb-8">
          <img src="/logo-wide-transparent-cropped.svg" alt="OmniCloud Logo" className="w-96" />
        </div>

        {/* Tagline */}
        <p className="text-blue-200 text-xl mb-20 opacity-70 max-w-md">
          Secure Self-Hosted Platform for Enterprise Data Management
        </p>

        {/* Key features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-2xl mx-auto lg:mx-0 mb-12">
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-md border border-opacity-20"
              style={{ backgroundColor: '#090f20', borderColor: '#132045' }}>
              <svg className="w-7 h-7 text-blue-100 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-blue-100 text-lg font-medium mb-2">Enterprise Security</h3>
            <p className="text-blue-200 text-sm opacity-70 text-center lg:text-left">End-to-end encryption and compliance-ready controls</p>
          </div>
          
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-md border border-opacity-20"
              style={{ backgroundColor: '#090f20', borderColor: '#132045' }}>
              <svg className="w-7 h-7 text-blue-100 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
              </svg>
            </div>
            <h3 className="text-blue-100 text-lg font-medium mb-2">Data Control</h3>
            <p className="text-blue-200 text-sm opacity-70 text-center lg:text-left">Maintain complete ownership of your information</p>
          </div>
          
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-md border border-opacity-20"
              style={{ backgroundColor: '#090f20', borderColor: '#132045' }}>
              <svg className="w-7 h-7 text-blue-100 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-blue-100 text-lg font-medium mb-2">Advanced Analytics</h3>
            <p className="text-blue-200 text-sm opacity-70 text-center lg:text-left">Real-time insights and customizable dashboards</p>
          </div>
        </div>

        {/* Trust indicators - desktop only */}
        <div className="hidden lg:block">
          <TrustIndicators />
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;