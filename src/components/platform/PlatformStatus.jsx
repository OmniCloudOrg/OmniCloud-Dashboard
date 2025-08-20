/**
 * Platform Status Components
 * Reusable components for platform loading and error states
 */

import React from 'react';

export const PlatformLoadingState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <span className="ml-3 text-gray-600">Loading platform context...</span>
  </div>
);

export const NoPlatformSelectedState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg max-w-md text-center">
      <div className="text-blue-700 font-medium mb-2">No Platform Selected</div>
      <div className="text-blue-600 text-sm">
        Please select a platform from the platform selector to view content.
      </div>
    </div>
  </div>
);

export const PlatformErrorState = ({ platformId, error }) => (
  <div className="flex justify-center items-center py-12">
    <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
      <div className="text-red-700 font-medium mb-2">Platform Error</div>
      <div className="text-red-600 text-sm">
        {error || `Failed to initialize for platform ${platformId}`}
      </div>
    </div>
  </div>
);

export const PlatformStatusHandler = ({ platformStatus, platformId, children }) => {
  switch (platformStatus.status) {
    case 'loading':
      return <PlatformLoadingState />;
    case 'no-platform':
      return <NoPlatformSelectedState />;
    case 'client-error':
    case 'error':
      return <PlatformErrorState platformId={platformId} error={platformStatus.message} />;
    case 'ready':
      return children;
    default:
      return <PlatformErrorState platformId={platformId} error="Unknown platform status" />;
  }
};

// Generic PlatformStatus component for common status patterns
export const PlatformStatus = ({ status, message, onRetry }) => {
  switch (status) {
    case 'loading':
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-300">{message || 'Loading...'}</span>
        </div>
      );
    
    case 'error':
      return (
        <div className="flex justify-center items-center py-12">
          <div className="bg-red-900/20 border border-red-500/20 p-6 rounded-lg max-w-md text-center">
            <div className="text-red-400 font-medium mb-2">Error</div>
            <div className="text-red-300 text-sm mb-4">
              {message || 'An error occurred'}
            </div>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      );
    
    case 'empty':
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-slate-400 font-medium mb-2">No Data</div>
            <div className="text-slate-500 text-sm">
              {message || 'No data available'}
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-slate-400">
            {message || 'Unknown status'}
          </div>
        </div>
      );
  }
};
