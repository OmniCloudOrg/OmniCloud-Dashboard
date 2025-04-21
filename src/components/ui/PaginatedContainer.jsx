"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export const PaginatedContainer = ({ 
  title, 
  titleIcon, 
  viewAllLink, 
  children, 
  currentPage = 0, 
  totalPages = 1,
  onPrevious,
  onNext,
  loading = false,
  debug = false
}) => {
  // Track local loading state for animations
  const [isChangingPage, setIsChangingPage] = useState(false);
  // Store the height of the content area to maintain it during loading
  const [contentHeight, setContentHeight] = useState("auto");
  
  // Calculate actual total pages based on input or default
  const actualTotalPages = Math.max(1, totalPages);
  
  // Calculate button states
  const isPrevDisabled = currentPage <= 0 || loading || isChangingPage;
  const isNextDisabled = currentPage >= actualTotalPages - 1 || loading || isChangingPage;
  
  // Debug information
  const debugInfo = debug ? (
    <div className="px-4 py-2 bg-slate-800 text-xs text-slate-400 border-t border-slate-700">
      Debug: Page {currentPage} / Total {actualTotalPages} | 
      Loading: {(loading || isChangingPage).toString()} | 
      Prev disabled: {isPrevDisabled.toString()} | 
      Next disabled: {isNextDisabled.toString()}
    </div>
  ) : null;

  // Handle pagination with loading state
  const handlePrevious = async () => {
    if (isPrevDisabled) return;
    
    // Capture current height before changing pages
    const contentElement = document.getElementById('paginated-content');
    if (contentElement) {
      setContentHeight(`${contentElement.scrollHeight}px`);
    }
    
    // Start loading animation
    setIsChangingPage(true);
    
    // Call the onPrevious handler
    if (onPrevious) {
      await onPrevious();
    }
    
    // End loading animation after a short delay to ensure content has updated
    setTimeout(() => {
      setIsChangingPage(false);
      setContentHeight("auto"); // Reset height after content loads
    }, 0);
  };

  const handleNext = async () => {
    if (isNextDisabled) return;
    
    // Capture current height before changing pages
    const contentElement = document.getElementById('paginated-content');
    if (contentElement) {
      setContentHeight(`${contentElement.scrollHeight}px`);
    }
    
    // Start loading animation
    setIsChangingPage(true);
    
    // Call the onNext handler
    if (onNext) {
      await onNext();
    }
    
    // End loading animation after a short delay to ensure content has updated
    setTimeout(() => {
      setIsChangingPage(false);
      setContentHeight("auto"); // Reset height after content loads
    }, 0);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center">
          {titleIcon && <div className="mr-2">{titleIcon}</div>}
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        {viewAllLink && (
          <a href={viewAllLink} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All
          </a>
        )}
      </div>
      
      {/* Content Area with Fixed Height During Loading */}
      <div 
        className="flex-grow overflow-y-auto relative"
        style={{ minHeight: (loading || isChangingPage) ? contentHeight : "auto" }}
      >
        {/* Loading Overlay */}
        {(loading || isChangingPage) && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <Loader2 size={30} className="text-blue-400 animate-spin mb-2" />
              <span className="text-sm text-slate-300">Loading...</span>
            </div>
          </div>
        )}
        
        {/* Content with ID for height measurement */}
        <div 
          id="paginated-content"
          className={`transition-opacity duration-300 ${(loading || isChangingPage) ? 'opacity-20' : 'opacity-100'}`}
        >
          {children}
        </div>
      </div>
      
      {/* Debug Panel */}
      {debugInfo}
      
      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center mt-auto">
        <button
          onClick={handlePrevious}
          disabled={isPrevDisabled}
          className={`text-sm font-medium px-4 py-2 rounded flex items-center justify-center min-w-[90px] transition-colors duration-200 ${
            isPrevDisabled
              ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isChangingPage ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : null}
          Previous
        </button>
        <span className="text-sm text-slate-400">
          Page {currentPage + 1} of {actualTotalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`text-sm font-medium px-4 py-2 rounded flex items-center justify-center min-w-[90px] transition-colors duration-200 ${
            isNextDisabled
              ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isChangingPage ? (
            <Loader2 size={16} className="animate-spin mr-2" />
          ) : null}
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedContainer;