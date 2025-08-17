import React, { useCallback, useEffect } from 'react';
import { ChevronDown, Search, X, Check, RefreshCw, Loader2 } from 'lucide-react';
import { usePlatform } from '@/components/context/PlatformContext';

interface PlatformDropdownProps {
  isOpen: boolean;
  searchTerm: string;
  filteredPlatforms: any[];
  onToggle: () => void;
  onSearch: (term: string) => void;
  platformSearchInputRef: React.RefObject<HTMLInputElement | null>;
  platformDropdownRef: React.RefObject<HTMLDivElement | null>;
}

const PlatformDropdown: React.FC<PlatformDropdownProps> = ({
  isOpen,
  searchTerm,
  filteredPlatforms,
  onToggle,
  onSearch,
  platformSearchInputRef,
  platformDropdownRef
}) => {
  const { 
    platforms, 
    selectedPlatformId, 
    selectedPlatform, 
    selectPlatform,
    refreshPlatforms,
    loading: platformsLoading,
    error: platformError
  } = usePlatform() as any;

  const handleSelectPlatform = useCallback((platformId: string) => {
    if (platformId === selectedPlatformId) {
      onToggle();
      return;
    }
    
    selectPlatform(platformId);
    onToggle();
  }, [selectPlatform, selectedPlatformId, onToggle]);

  return (
    <div className="relative" ref={platformDropdownRef}>
      <button
        data-platform-button
        onClick={onToggle}
        className="flex items-center gap-1 text-sm px-2 sm:px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="hidden sm:inline">Platform:</span>
        <span className="truncate max-w-[120px]">
          {selectedPlatform ? selectedPlatform.name : "Select Platform"}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-72 rounded-md bg-slate-800 shadow-lg py-1 ring-1 ring-black ring-opacity-5">
          <div className="px-3 py-2 border-b border-slate-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400" />
              </div>
              <input
                ref={platformSearchInputRef}
                type="text"
                className="block w-full pl-9 pr-9 py-2 bg-slate-700 border-0 text-sm rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                aria-label="Search platforms"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => onSearch('')}
                  aria-label="Clear search"
                >
                  <X size={14} className="text-slate-400 hover:text-slate-200" />
                </button>
              )}
            </div>
          </div>

          {platformsLoading ? (
            <div className="px-4 py-6 flex justify-center items-center">
              <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
              <span className="ml-2 text-sm text-slate-400">Loading platforms...</span>
            </div>
          ) : platformError ? (
            <div className="px-4 py-4 text-sm text-red-400 flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{platformError}</span>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1" role="listbox">
              {filteredPlatforms.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-400 text-center">
                  No platforms found
                </div>
              ) : (
                filteredPlatforms.map(platform => (
                  <button
                    key={platform.id}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-slate-700"
                    onClick={() => handleSelectPlatform(platform.id)}
                    role="option"
                    aria-selected={selectedPlatformId === platform.id}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{platform.name}</span>
                      {platform.description && (
                        <span className="text-xs text-slate-400 truncate max-w-[150px]">
                          {platform.description}
                        </span>
                      )}
                    </div>
                    {selectedPlatformId === platform.id && <Check size={16} />}
                  </button>
                ))
              )}

              {platforms.length > 0 && (
                <div className="px-4 py-2 text-xs text-slate-400 border-t border-slate-700">
                  {searchTerm ? (
                    `Showing ${filteredPlatforms.length} of ${platforms.length} platforms`
                  ) : (
                    `Showing all ${platforms.length} platforms`
                  )}
                </div>
              )}
              
              <div className="px-4 py-2 text-xs text-slate-400 border-t border-slate-700">
                <button 
                  onClick={() => {
                    refreshPlatforms();
                    onSearch('');
                  }}
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                  disabled={platformsLoading}
                >
                  <RefreshCw size={12} className={`mr-1 ${platformsLoading ? 'animate-spin' : ''}`} />
                  Refresh platforms
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlatformDropdown;