"use client";

const TrustIndicators = ({ isMobile = false }) => {
  const containerClasses = isMobile
    ? "lg:hidden text-blue-200 text-xs space-y-2 mt-6 mb-4 opacity-70 max-w-md mx-auto"
    : "text-blue-200 text-sm space-y-3 w-full max-w-lg mx-auto lg:mx-0";

  return (
    <div className={containerClasses}>
      <div className="flex items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
        <span className="opacity-70">Secure connection to your OmniCloud instance</span>
      </div>
      <div className="flex items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
        <span className="opacity-70">Your data never leaves your infrastructure</span>
      </div>
      <div className="flex items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 flex-shrink-0 opacity-70"></div>
        <span className="opacity-70">SOC 2, HIPAA, and GDPR compliant by design</span>
      </div>
    </div>
  );
};

export default TrustIndicators;