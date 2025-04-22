import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Bell, HelpCircle, CogIcon, Menu, ChevronDown, Check, X, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { navSections } from '../../utils/navigation';
import { useRouter } from 'next/navigation';

interface Provider {
  id: number;
  name: string;
  display_name: string;
  provider_type: string;
  status: 'active' | 'maintenance' | 'offline' | 'deprecated';
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

interface TopBarProps {
  onOpenCommandPalette: (searchResults: { label: string; id: string }[]) => void;
  onToggleNotifications: () => void;
  onToggleHelpPanel: () => void;
  onToggleUserProfile: () => void;
  onToggleMobileMenu?: () => void;
  notificationCount: number;
  activeCloudFilter: string;
  setActiveCloudFilter: (id: string) => void;
}

/**
 * Top navigation bar component with searchable provider dropdown
 * Automatically switches to mobile layout when elements would wrap
 */
const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onToggleNotifications,
  onToggleHelpPanel,
  onToggleUserProfile,
  onToggleMobileMenu,
  notificationCount,
  activeCloudFilter,
  setActiveCloudFilter
}) => {
  // Extract pages from navSections
  const pages = navSections.flatMap(section =>
    section.items.map(item => ({ label: item.label, id: item.id }))
  );

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Flag to track if we need to load all providers
  const providersLoadedRef = useRef(false);
  
  // Refs for container elements
  const topBarRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

  // Load all providers at once
  const loadAllProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First make a small request to get the total count
      const countResponse = await fetch(`${apiBaseUrl}/providers?page=0&per_page=1`);
      
      if (!countResponse.ok) {
        throw new Error(`Failed to fetch provider count: ${countResponse.status}`);
      }
      
      const countData = await countResponse.json();
      const totalProviders = countData.pagination.total_count;
      setTotalCount(totalProviders);
      
      // Then fetch all providers in one request
      const response = await fetch(`${apiBaseUrl}/providers?page=0&per_page=${totalProviders}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch providers: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update providers
      setProviders(data.providers);
      setFilteredProviders(data.providers);
      
      // Mark as loaded
      providersLoadedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl]);

  // Filter providers based on search term
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredProviders(providers);
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    setFilteredProviders(
      providers.filter(provider => 
        provider.display_name.toLowerCase().includes(lowerTerm) ||
        provider.name.toLowerCase().includes(lowerTerm)
      )
    );
  }, [providers]);

  // Check if elements would wrap and trigger mobile layout if needed
  const checkForWrapping = () => {
    if (!topBarRef.current || !leftSectionRef.current || !rightSectionRef.current) return;
    
    const topBarWidth = topBarRef.current.offsetWidth;
    const leftSectionWidth = leftSectionRef.current.scrollWidth;
    const rightSectionWidth = rightSectionRef.current.scrollWidth;
    
    // Add buffer for padding (12px on each side = 24px)
    const totalContentWidth = leftSectionWidth + rightSectionWidth + 24;
    
    // If content would wrap, switch to mobile layout
    setIsMobile(totalContentWidth >= topBarWidth);
  };

  // Load providers when dropdown is opened
  const handleOpenDropdown = () => {
    if (!providerDropdownOpen) {
      // Only load providers if they haven't been loaded yet
      if (!providersLoadedRef.current && providers.length === 0) {
        loadAllProviders();
      }
      
      setProviderDropdownOpen(true);
      
      // Reset search when opening
      setSearchTerm('');
      setFilteredProviders(providers);
      
      // Focus search input on next render
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
    } else {
      setProviderDropdownOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    
    // Initial check for wrapping
    checkForWrapping();
    
    // Add resize observer to check for wrapping
    const resizeObserver = new ResizeObserver(() => {
      checkForWrapping();
    });
    
    if (topBarRef.current) {
      resizeObserver.observe(topBarRef.current);
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        providerDropdownRef.current && 
        !providerDropdownRef.current.contains(event.target as Node)
      ) {
        setProviderDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Find active provider
  const activeProvider = providers.find(provider => provider.name === activeCloudFilter);

  return (
    <div 
      ref={topBarRef}
      className="h-16 border-b border-slate-800 flex items-center justify-between px-3 sm:px-6"
    >
      <div ref={leftSectionRef} className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Toggle - Only visible when layout would wrap */}
        {isMobile && (
          <Button
            variant="icon"
            icon={Menu}
            onClick={onToggleMobileMenu}
            ariaLabel="Toggle mobile menu"
            className="mr-1"
          />
        )}
      
        {/* Search Command Button - Simplified on mobile */}
        <button
          onClick={() => onOpenCommandPalette(pages)}
          className="flex items-center gap-1 sm:gap-2 text-sm px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Search size={16} />
          <span className="hidden sm:inline">Search resources...</span>
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">K</kbd>
          </div>
        </button>

        {/* Cloud Provider Filter Dropdown */}
        <div className="relative" ref={providerDropdownRef}>
          <button
            onClick={handleOpenDropdown}
            className="flex items-center gap-1 text-sm px-2 sm:px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
          >
            {activeProvider ? activeProvider.display_name : "All Providers"}
            <ChevronDown size={14} className={`transition-transform ${providerDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {providerDropdownOpen && (
            <div className="absolute z-10 mt-1 w-72 rounded-md bg-slate-800 shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              {/* Search input */}
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
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => handleSearch('')}
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
                <div className="max-h-80 overflow-y-auto py-1">
                  {/* All Providers option */}
                  <button
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-slate-700"
                    onClick={() => {
                      setActiveCloudFilter("");
                      setProviderDropdownOpen(false);
                    }}
                  >
                    <span>All Providers</span>
                    {activeCloudFilter === "" && <Check size={16} />}
                  </button>
                  
                  {/* Provider list */}
                  {filteredProviders.length === 0 && !isLoading ? (
                    <div className="px-4 py-3 text-sm text-slate-400 text-center">
                      No providers found
                    </div>
                  ) : (
                    filteredProviders.map(provider => (
                      <button
                        key={provider.id}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-slate-700"
                        onClick={() => {
                          setActiveCloudFilter(provider.name);
                          setProviderDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative group">
                            {/* Status dot with pulse animation */}
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
                            
                            {/* Expanding status chip on hover */}
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

                  {/* Count of results */}
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
      </div>

      <div ref={rightSectionRef} className="flex items-center gap-2 sm:gap-4">
        {/* Notifications Button */}
        <Button
          variant="icon"
          icon={Bell}
          onClick={onToggleNotifications}
          ariaLabel="Notifications"
          badge={notificationCount}
        />

        {/* Settings Button - Hidden on small mobile */}
        <div className="hidden xs:block">
          <Button
            variant="icon"
            icon={CogIcon}
            onClick={() => router.push('/dash/settings')}
            ariaLabel="Settings"
          />
        </div>

        {/* Help Button - Hidden on extra small screens */}
        <div className="hidden sm:block">
          <Button
            variant="icon"
            icon={HelpCircle}
            onClick={onToggleHelpPanel}
            ariaLabel="Help and resources"
          />
        </div>

        {/* Divider - Hidden on mobile */}
        <div className="hidden sm:block w-px h-6 bg-slate-800"></div>

        {/* User Profile Button - Simplified on mobile */}
        <button
          onClick={onToggleUserProfile}
          className="flex items-center gap-1 sm:gap-3 hover:bg-slate-800 p-1 rounded-lg transition-colors"
          aria-label="User profile"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg text-xs sm:text-sm">
            AS
          </div>
          <div className="hidden xl:block">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-slate-400">admin@omnicloud.io</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TopBar;