import React from 'react';
import { ChevronDown, Search, X, Check, Loader2 } from 'lucide-react';

interface ProviderDropdownProps {
  isOpen: boolean;
  searchTerm: string;
  filteredProviders: any[];
  providers: any[];
  isLoading: boolean;
  error: string | null;
  activeCloudFilter: string;
  selectedPlatformId: string;
  onToggle: () => void;
  onSearch: (term: string) => void;
  onSelectProvider: (providerName: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  providerDropdownRef: React.RefObject<HTMLDivElement | null>;
}

const ProviderDropdown: React.FC<ProviderDropdownProps> = ({
  isOpen,
  searchTerm,
  filteredProviders,
  providers,
  isLoading,
  error,
  activeCloudFilter,
  selectedPlatformId,
  onToggle,
  onSearch,
  onSelectProvider,
  searchInputRef,
  providerDropdownRef
}) => {
  const activeProvider = providers.find(provider => provider.name === activeCloudFilter);

  return (
    <div className="relative" ref={providerDropdownRef}>
      <button
        data-provider-button
        onClick={onToggle}
        className="flex items-center gap-1 text-sm px-2 sm:px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={!selectedPlatformId}
        style={!selectedPlatformId ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        <span className="truncate max-w-[120px]">
          {activeProvider ? activeProvider.display_name : "All Providers"}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 rounded-md bg-slate-800 shadow-lg py-1 ring-1 ring-black ring-opacity-5">
          <div className="px-3 py-2 border-b border-slate-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-slate-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="block w-full pl-9 pr-9 py-2 bg-slate-700 border-0 text-sm rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                aria-label="Search providers"
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

          {isLoading ? (
            <div className="px-4 py-6 flex justify-center items-center">
              <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
              <span className="ml-2 text-sm text-slate-400">Loading providers...</span>
            </div>
          ) : error ? (
            <div className="px-4 py-4 text-sm text-red-400 flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1" role="listbox">
              <button
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-slate-700"
                onClick={() => onSelectProvider("")}
                role="option"
                aria-selected={activeCloudFilter === ""}
              >
                <span>All Providers</span>
                {activeCloudFilter === "" && <Check size={16} />}
              </button>
              
              {filteredProviders.length === 0 && !isLoading ? (
                <div className="px-4 py-3 text-sm text-slate-400 text-center">
                  No providers found
                </div>
              ) : (
                filteredProviders.map(provider => (
                  <button
                    key={provider.id}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-slate-700"
                    onClick={() => onSelectProvider(provider.name)}
                    role="option"
                    aria-selected={activeCloudFilter === provider.name}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <div className="relative">
                          <div 
                            className={`w-3 h-3 rounded-full ${
                              provider.status === "active" ? "bg-green-500" :
                              provider.status === "maintenance" ? "bg-yellow-500" :
                              provider.status === "offline" ? "bg-red-500" :
                              "bg-slate-500"
                            }`}
                          />
                          {provider.status === "active" && (
                            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
                          )}
                        </div>
                        
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 whitespace-nowrap scale-0 group-hover:scale-100 origin-left">
                          <div className={`flex items-center pl-1 pr-2 py-0.5 rounded-full text-xs ${
                            provider.status === "active" ? "bg-green-900 text-green-300" :
                            provider.status === "maintenance" ? "bg-yellow-900 text-yellow-300" :
                            provider.status === "offline" ? "bg-red-900 text-red-300" :
                            "bg-slate-700 text-slate-300"
                          }`}>
                            <div 
                              className={`w-2 h-2 mr-1.5 rounded-full ${
                                provider.status === "active" ? "bg-green-400" :
                                provider.status === "maintenance" ? "bg-yellow-400" :
                                provider.status === "offline" ? "bg-red-400" :
                                "bg-slate-400"
                              }`}
                            ></div>
                            {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      <span>{provider.display_name}</span>
                    </div>
                    {activeCloudFilter === provider.name && <Check size={16} />}
                  </button>
                ))
              )}

              {providers.length > 0 && (
                <div className="px-4 py-2 text-xs text-slate-400 border-t border-slate-700">
                  {searchTerm ? (
                    `Showing ${filteredProviders.length} of ${providers.length} providers`
                  ) : (
                    `Showing all ${providers.length} providers`
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProviderDropdown;