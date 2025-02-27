"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';
import {
  Home, Server, Box, Cloud, Activity, Bell, Users, Settings, LogOut, Search,
  X, Menu, ChevronRight, HelpCircle, CloudCog, Terminal, LineChart, Shield, 
  Cpu, Database, Network, LayoutGrid, GitBranch, ArrowUpDown, BookOpen, Video, 
  MessageCircle, FileText, User, Key, LucideIcon
} from 'lucide-react';

// Theme toggler component (now used as settings button)
const SettingsButton = () => {
  return (
    <button
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
      onClick={() => {}}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 15.8333C13.2217 15.8333 15.8333 13.2217 15.8333 10C15.8333 6.77834 13.2217 4.16667 10 4.16667C6.77834 4.16667 4.16667 6.77834 4.16667 10C4.16667 13.2217 6.77834 15.8333 10 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 1.66667V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 17.5V18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 10H2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 10H16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.29999 5.29999L4.58332 4.58332" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.4167 15.4167L14.7 14.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.29999 14.7L4.58332 15.4167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.4167 4.58332L14.7 5.29999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

// Navigation item component
const NavItem = ({ icon: Icon, label, isActive, onClick, hasSubmenu, isSubmenuOpen, badgeCount = 0 }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${isActive
        ? 'bg-blue-500/10 text-blue-400 font-medium'
        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
      }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span>{label}</span>
      {badgeCount > 0 && (
        <span className="ml-1 px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </div>
    {hasSubmenu && (
      <ChevronRight
        size={16}
        className={`transition-transform ${isSubmenuOpen ? 'rotate-90' : ''}`}
      />
    )}
  </button>
);

// Provider badge component
const ProviderBadge = ({ provider, isActive }) => {
  // Provider icon mapping
  const getProviderIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case 'aws': return '🟧';
      case 'gcp': return '🟦';
      case 'azure': return '🟪';
      case 'on-prem': return '🟩';
      default: return '⬜';
    }
  };

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isActive
        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        : 'bg-slate-800 text-slate-400'
      }`}>
      {getProviderIcon(provider)} {provider}
    </span>
  );
};

// Hook for detecting clicks outside an element
const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

// Command palette component
const CommandPalette = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleResults, setVisibleResults] = useState(15);
  const resultsContainerRef = useRef(null);
  
  const paletteRef = useOutsideClick(() => {
    if (isOpen) onClose();
  });

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Generate all possible results - in a real app, this would be your data source
  const allResults = [
    // Apps
    { type: 'app', name: 'frontend-service', environment: 'production', id: 'frontend-service' },
    { type: 'app', name: 'auth-api', environment: 'staging', id: 'auth-api' },
    { type: 'app', name: 'payment-service', environment: 'production', id: 'payment-service' },
    { type: 'app', name: 'user-management', environment: 'development', id: 'user-management' },
    { type: 'app', name: 'recommendation-engine', environment: 'staging', id: 'recommendation-engine' },
    
    // Instances
    { type: 'instance', name: 'api-gateway-2', status: 'running', id: 'api-gateway-2' },
    { type: 'instance', name: 'cache-server-1', status: 'running', id: 'cache-server-1' },
    { type: 'instance', name: 'db-replica-3', status: 'stopped', id: 'db-replica-3' },
    { type: 'instance', name: 'worker-node-5', status: 'running', id: 'worker-node-5' },
    { type: 'instance', name: 'analytics-server', status: 'restarting', id: 'analytics-server' },
    
    // Users
    { type: 'user', name: 'john.doe@example.com', role: 'Developer', id: 'john-doe' },
    { type: 'user', name: 'sarah.smith@example.com', role: 'Admin', id: 'sarah-smith' },
    { type: 'user', name: 'mike.jones@example.com', role: 'DevOps', id: 'mike-jones' },
    { type: 'user', name: 'lisa.wong@example.com', role: 'Product Manager', id: 'lisa-wong' },
    { type: 'user', name: 'alex.chen@example.com', role: 'Developer', id: 'alex-chen' },
    
    // Routes
    { type: 'route', name: 'api.example.com/v1', target: 'api-gateway', id: 'api-v1' },
    { type: 'route', name: 'admin.example.com', target: 'admin-dashboard', id: 'admin-route' },
    { type: 'route', name: 'cdn.example.com', target: 'content-delivery', id: 'cdn-route' },
    { type: 'route', name: 'auth.example.com', target: 'auth-service', id: 'auth-route' },
    { type: 'route', name: 'payments.example.com', target: 'payment-service', id: 'payments-route' },
    
    // Cloud resources
    { type: 'cloud', name: 'AWS US-EAST-1', status: 'healthy', id: 'aws-us-east-1' },
    { type: 'cloud', name: 'GCP EUROPE-WEST', status: 'healthy', id: 'gcp-europe-west' },
    { type: 'cloud', name: 'AZURE CENTRAL-US', status: 'warning', id: 'azure-central-us' },
    { type: 'cloud', name: 'AWS AP-SOUTHEAST', status: 'healthy', id: 'aws-ap-southeast' },
    { type: 'cloud', name: 'ON-PREM DATACENTER', status: 'healthy', id: 'on-prem-dc' },
  ];

  // Filter results based on query
  const getFilteredResults = () => {
    if (!searchQuery) return allResults;
    
    return allResults.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.environment && item.environment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.role && item.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.target && item.target.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredResults = getFilteredResults();
  const results = filteredResults.slice(0, visibleResults);

  // Handle scroll to load more results
  const handleScroll = () => {
    if (!resultsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = resultsContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20 && visibleResults < filteredResults.length) {
      setVisibleResults(prev => Math.min(prev + 10, filteredResults.length));
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
      scrollToSelected();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      scrollToSelected();
    } else if (e.key === 'Enter' && results.length > 0) {
      selectResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Scroll to keep selected item in view
  const scrollToSelected = () => {
    if (!resultsContainerRef.current) return;
    
    const container = resultsContainerRef.current;
    const selectedElement = container.querySelector(`[data-index="${selectedIndex}"]`);
    
    if (selectedElement) {
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elementTop = selectedElement.offsetTop;
      const elementBottom = elementTop + selectedElement.clientHeight;
      
      if (elementTop < containerTop) {
        container.scrollTop = elementTop;
      } else if (elementBottom > containerBottom) {
        container.scrollTop = elementBottom - container.clientHeight;
      }
    }
  };

  // Handle result selection
  const selectResult = (result) => {
    router.push(`/${result.id}`);
    onClose();
  };

  if (!isOpen) return null;

  const getIconForType = (type) => {
    switch (type) {
      case 'app': return <Box size={16} />;
      case 'instance': return <Server size={16} />;
      case 'user': return <Users size={16} />;
      case 'route': return <Network size={16} />;
      case 'cloud': return <Cloud size={16} />;
      default: return <Box size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-start justify-center pt-32">
      <div ref={paletteRef} className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-slate-400" size={20} />
          <input
            type="text"
            className="w-full px-12 py-4 bg-transparent text-white border-b border-slate-800 focus:outline-none"
            placeholder="Search for apps, instances, users, or commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div 
          ref={resultsContainerRef} 
          className="max-h-96 overflow-y-auto"
          onScroll={handleScroll}
        >
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  data-index={index}
                  className={`w-full flex items-center gap-3 p-3 text-left rounded-lg ${
                    selectedIndex === index ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800/70'
                  }`}
                  onClick={() => selectResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={`p-2 rounded-lg ${result.type === 'app' ? 'bg-blue-500/10 text-blue-400' :
                      result.type === 'instance' ? 'bg-green-500/10 text-green-400' :
                        result.type === 'user' ? 'bg-purple-500/10 text-purple-400' :
                          result.type === 'route' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-slate-500/10 text-slate-400'
                    }`}>
                    {getIconForType(result.type)}
                  </div>
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-xs text-slate-400">
                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)} • {result.environment || result.status || result.role || result.target}
                    </div>
                  </div>
                </button>
              ))}
              {visibleResults < filteredResults.length && (
                <div className="p-2 text-center text-slate-400 text-sm">
                  Scroll for more results
                </div>
              )}
            </div>
          ) : searchQuery ? (
            <div className="p-4 text-center text-slate-400">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400">
              Start typing to search across resources
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↓</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd> to navigate, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to select, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};

// Status indicator component
const StatusIndicator = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Health metrics to display in tooltip
  const healthMetrics = {
    healthy: {
      ping: '18ms',
      uptime: '99.99%',
      cpu: '23%',
      memory: '41%',
      services: '47/47 operational'
    },
    warning: {
      ping: '86ms',
      uptime: '99.82%',
      cpu: '78%',
      memory: '62%',
      services: '45/47 operational'
    },
    critical: {
      ping: '320ms',
      uptime: '95.4%',
      cpu: '92%',
      memory: '87%',
      services: '39/47 operational'
    }
  }[status];

  return (
    <div className="group relative flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-sm font-medium capitalize">{status}</span>
      
      {/* Tooltip - repositioned to appear on right instead of above */}
      <div className="absolute left-full top-0 ml-2 w-48 bg-slate-800 rounded-lg shadow-xl p-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-xs">
        <div className="font-medium text-white mb-2">System Health</div>
        <div className="space-y-1.5 text-slate-300">
          <div className="flex justify-between">
            <span>Ping:</span>
            <span className="font-medium">{healthMetrics.ping}</span>
          </div>
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span className="font-medium">{healthMetrics.uptime}</span>
          </div>
          <div className="flex justify-between">
            <span>CPU:</span>
            <span className="font-medium">{healthMetrics.cpu}</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="font-medium">{healthMetrics.memory}</span>
          </div>
          <div className="flex justify-between">
            <span>Services:</span>
            <span className="font-medium">{healthMetrics.services}</span>
          </div>
        </div>
        <div className="absolute right-full top-2 w-2 h-2 bg-slate-800 rotate-45"></div>
      </div>
    </div>
  );
};

// Dropdown panel component (used for all dropdown panels)
const DropdownPanel = ({ isOpen, onClose, title, children, position = "right-0" }) => {
  const panelRef = useOutsideClick(() => {
    if (isOpen) onClose();
  });

  if (!isOpen) return null;

  return (
    <div className={`fixed top-16 mt-1 z-40 w-96 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl ${position}`} ref={panelRef}>
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

// Notifications panel component
const NotificationsPanel = ({ isOpen, onClose }) => {
  // Sample notifications data
  const notifications = [
    { id: 1, title: 'Deployment Completed', message: 'frontend-service was deployed successfully', time: '10 minutes ago', type: 'success' },
    { id: 2, title: 'High CPU Usage', message: 'api-gateway-2 instance is experiencing high CPU load', time: '25 minutes ago', type: 'warning' },
    { id: 3, title: 'New Team Member', message: 'Sarah Johnson has joined the organization', time: '2 hours ago', type: 'info' },
    { id: 4, title: 'Certificate Expiring', message: 'SSL certificate for api.example.com will expire in 7 days', time: '5 hours ago', type: 'warning' },
    { id: 5, title: 'Database Backup', message: 'Weekly database backup completed successfully', time: '1 day ago', type: 'success' }
  ];

  const getIconForType = (type) => {
    switch (type) {
      case 'success': return <div className="p-2 rounded-full bg-green-500/10 text-green-400 flex-shrink-0"><Activity size={16} /></div>;
      case 'warning': return <div className="p-2 rounded-full bg-amber-500/10 text-amber-400 flex-shrink-0"><Bell size={16} /></div>;
      case 'info': return <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 flex-shrink-0"><Users size={16} /></div>;
      default: return <div className="p-2 rounded-full bg-slate-500/10 text-slate-400 flex-shrink-0"><Box size={16} /></div>;
    }
  };

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Notifications">
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            <div className="flex gap-3 items-start">
              {getIconForType(notification.type)}
              <div className="flex-1">
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-slate-400">{notification.message}</div>
                <div className="text-xs text-slate-500 mt-1">{notification.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800">
        <button className="w-full py-2 text-sm text-center text-blue-400 hover:text-blue-300 transition-colors">
          Mark all as read
        </button>
      </div>
    </DropdownPanel>
  );
};

// Help panel component
const HelpPanel = ({ isOpen, onClose }) => {
  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Help & Resources">
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
              <BookOpen size={16} />
            </div>
            <div className="text-left">
              <div className="font-medium">Documentation</div>
              <div className="text-sm text-slate-400">Access platform guides and API reference</div>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <div className="p-2 rounded-full bg-green-500/10 text-green-400">
              <Video size={16} />
            </div>
            <div className="text-left">
              <div className="font-medium">Video Tutorials</div>
              <div className="text-sm text-slate-400">Learn through step-by-step videos</div>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
              <MessageCircle size={16} />
            </div>
            <div className="text-left">
              <div className="font-medium">Live Chat Support</div>
              <div className="text-sm text-slate-400">Get help from our support team</div>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <div className="p-2 rounded-full bg-amber-500/10 text-amber-400">
              <FileText size={16} />
            </div>
            <div className="text-left">
              <div className="font-medium">Knowledge Base</div>
              <div className="text-sm text-slate-400">Browse common questions and solutions</div>
            </div>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Contact Support Team
        </button>
      </div>
    </DropdownPanel>
  );
};

// User profile panel component
const UserProfilePanel = ({ isOpen, onClose }) => {
  const router = useRouter();

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="">
      <div className="p-4 flex flex-col items-center border-b border-slate-800">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-medium mb-2">
          AS
        </div>
        <div className="text-lg font-medium">Admin User</div>
        <div className="text-sm text-slate-400">admin@omnicloud.io</div>
        <div className="mt-2 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Administrator
        </div>
      </div>

      <div className="p-2">
        <button
          onClick={() => {
            router.push('/profile');
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-200"
        >
          <User size={18} />
          <span>Your Profile</span>
        </button>
        
        <button
          onClick={() => {
            router.push('/settings/account');
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-200"
        >
          <Settings size={18} />
          <span>Account Settings</span>
        </button>
        
        <button
          onClick={() => {
            router.push('/keys');
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-200"
        >
          <Key size={18} />
          <span>API Keys</span>
        </button>
        
        <div className="my-2 border-t border-slate-800"></div>
        
        <button
          onClick={() => {
            // Handle logout
            router.push('/logout');
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-red-400"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </DropdownPanel>
  );
};

// Main dashboard layout component
const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeCloudFilter, setActiveCloudFilter] = useState('all');
  
  // State for panels
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);

  // Mobile nav ref for click outside
  const mobileNavRef = useOutsideClick(() => {
    if (mobileNavOpen) setMobileNavOpen(false);
  });

  // Current system status
  const systemStatus = 'healthy'; // Could be 'healthy', 'warning', or 'critical'

  // Mock notification count
  const notificationCount = 12;

  // Toggle submenu open state
  const toggleSubmenu = (key) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle navigation
  const handleNavigation = (id) => {
    setActiveSection(id);
    router.push(`/${id}`);
  };

  // Close all panels
  const closeAllPanels = () => {
    setNotificationsOpen(false);
    setHelpPanelOpen(false);
    setUserProfileOpen(false);
  };

  // Toggle notification panel
  const toggleNotifications = () => {
    closeAllPanels();
    setNotificationsOpen(prev => !prev);
  };

  // Toggle help panel
  const toggleHelpPanel = () => {
    closeAllPanels();
    setHelpPanelOpen(prev => !prev);
  };

  // Toggle user profile panel
  const toggleUserProfile = () => {
    closeAllPanels();
    setUserProfileOpen(prev => !prev);
  };

  // Navigation configuration
  const navSections = [
    {
      title: 'Core',
      items: [
        { icon: Home, label: 'Dashboard', id: '' },
        {
          icon: Box,
          label: 'Applications',
          id: 'apps',
          badgeCount: 0,
          submenu: [
            { label: 'All Apps', id: 'apps' },
            { label: 'Services', id: 'services' },
            { label: 'Web Apps', id: 'web-apps' },
            { label: 'Workflows', id: 'workflows' },
            { label: 'Deployments', id: 'deployments' }
          ]
        },
        {
          icon: Server,
          label: 'Infrastructure',
          id: 'infrastructure',
          badgeCount: 0,
          submenu: [
            { label: 'All', id: 'infra' },
            { label: 'Instances', id: 'instances' },
            { label: 'Containers', id: 'containers' },
            { label: 'VM Images', id: 'vm-images' },
            { label: 'Container Registry', id: 'registry' }
          ]
        },
        {
          icon: Network,
          label: 'Ingress',
          id: 'ingress',
          badgeCount: 0,
          submenu: [
            { label: 'Routes', id: 'ingress' },
            { label: 'Load Balancers', id: 'load-balancers' },
            { label: 'Domains', id: 'domains' },
            { label: 'Certificates', id: 'certificates' }
          ]
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          icon: CloudCog,
          label: 'Cloud Providers',
          id: 'providers',
          badgeCount: 0,
          submenu: [
            { label: 'Overview', id: 'provider-overview' },
            { label: 'Connections', id: 'connections' },
            { label: 'Quotas', id: 'quotas' },
            { label: 'Cost Management', id: 'costs' }
          ]
        },
        {
          icon: Database,
          label: 'Storage',
          id: 'storage',
          badgeCount: 0,
          submenu: [
            { label: 'Volumes', id: 'volumes' },
            { label: 'Object Storage', id: 'object-storage' },
            { label: 'Backups', id: 'backups' },
            { label: 'Snapshots', id: 'snapshots' }
          ]
        },
        {
          icon: GitBranch,
          label: 'CI/CD',
          id: 'cicd',
          badgeCount: 0,
          submenu: [
            { label: 'Pipelines', id: 'pipelines' },
            { label: 'Build History', id: 'builds' },
            { label: 'Artifacts', id: 'artifacts' },
            { label: 'Environments', id: 'environments' }
          ]
        },
        {
          icon: LayoutGrid,
          label: 'Marketplace',
          id: 'marketplace',
          badgeCount: 0
        }
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          icon: Activity,
          label: 'Monitoring',
          id: 'monitoring',
          badgeCount: 0,
          submenu: [
            { label: 'General', id: 'monitoring' },
            { label: 'Metrics', id: 'metrics' },
            { label: 'Traces', id: 'traces' },
            { label: 'Service Maps', id: 'service-maps' }
          ]
        },
        {
          icon: Terminal,
          label: 'Logs',
          id: 'logs',
          badgeCount: 0
        },
        {
          icon: Bell,
          label: 'Alerts',
          id: 'alerts',
          badgeCount: notificationCount
        },
        {
          icon: ArrowUpDown,
          label: 'Audit Trail',
          id: 'audit',
          badgeCount: 0
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          icon: Users,
          label: 'Team',
          id: 'team',
          badgeCount: 0,
          submenu: [
            { label: 'Members', id: 'members' },
            { label: 'Roles', id: 'roles' },
            { label: 'Groups', id: 'groups' },
            { label: 'Invitations', id: 'invitations' }
          ]
        },
        {
          icon: Shield,
          label: 'Security',
          id: 'security',
          badgeCount: 0,
          submenu: [
            { label: 'Authentication', id: 'auth' },
            { label: 'Policies', id: 'policies' },
            { label: 'API Keys', id: 'api-keys' },
            { label: 'Secrets', id: 'secrets' }
          ]
        },
        {
          icon: Settings,
          label: 'Platform Settings',
          id: 'settings',
          badgeCount: 0
        }
      ]
    }
  ];

  // Available cloud providers
  const cloudProviders = [
    { id: 'all', name: 'All Providers' },
    { id: 'aws', name: 'AWS' },
    { id: 'gcp', name: 'GCP' },
    { id: 'azure', name: 'Azure' },
    { id: 'on-prem', name: 'On-Prem' }
  ];

  // Handle command palette keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        closeAllPanels();
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Command Palette */}
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />

          {/* Notification Panel */}
          <NotificationsPanel 
            isOpen={notificationsOpen} 
            onClose={() => setNotificationsOpen(false)} 
          />

          {/* Help Panel */}
          <HelpPanel 
            isOpen={helpPanelOpen} 
            onClose={() => setHelpPanelOpen(false)} 
          />

          {/* User Profile Panel */}
          <UserProfilePanel 
            isOpen={userProfileOpen} 
            onClose={() => setUserProfileOpen(false)} 
          />

          {/* Mobile Navigation */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-slate-900 border-b border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <Menu size={24} />
                </button>
                <span className="font-semibold">OmniCloud Platform</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <Search size={20} />
                </button>
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white relative"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/80 backdrop-blur-sm">
              <div ref={mobileNavRef} className="h-full w-80 max-w-[80%] bg-slate-900 border-r border-slate-800 overflow-y-auto">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Cloud className="text-blue-400" size={24} />
                    <span className="text-lg font-semibold">OmniCloud</span>
                  </div>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4">
                  {navSections.map((section, idx) => (
                    <div key={idx} className="mb-6">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        {section.title}
                      </div>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <React.Fragment key={item.id}>
                            <NavItem
                              icon={item.icon}
                              label={item.label}
                              isActive={activeSection === item.id}
                              onClick={() => {
                                if (item.submenu) {
                                  toggleSubmenu(item.id);
                                } else {
                                  handleNavigation(item.id);
                                  setMobileNavOpen(false);
                                }
                              }}
                              hasSubmenu={!!item.submenu}
                              isSubmenuOpen={openSubmenus[item.id]}
                              badgeCount={item.badgeCount || 0}
                            />

                            {item.submenu && openSubmenus[item.id] && (
                              <div className="ml-10 space-y-1 mt-1 mb-2">
                                {item.submenu.map((subitem) => (
                                  <button
                                    key={subitem.id}
                                    onClick={() => {
                                      handleNavigation(subitem.id);
                                      setMobileNavOpen(false);
                                    }}
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === subitem.id
                                        ? 'bg-blue-500/10 text-blue-400 font-medium'
                                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                                      }`}
                                  >
                                    {subitem.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Desktop Layout */}
          <div className="flex h-screen overflow-hidden pt-0 lg:pt-0">
            {/* Sidebar Navigation */}
            <div className="hidden lg:block w-72 border-r border-slate-800 overflow-y-auto">
              {/* Sticky OmniCloud Card */}
              <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <Cloud className="text-blue-400" size={28} />
                    <div>
                      <h1 className="text-lg font-bold">OmniCloud</h1>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <StatusIndicator status={systemStatus} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 h-[calc(100vh-88px)]">
                {navSections.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 mb-2">
                      {section.title}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <React.Fragment key={item.id}>
                          <NavItem
                            icon={item.icon}
                            label={item.label}
                            isActive={activeSection === item.id}
                            onClick={() => {
                              if (item.submenu) {
                                toggleSubmenu(item.id);
                              } else {
                                handleNavigation(item.id);
                              }
                            }}
                            hasSubmenu={!!item.submenu}
                            isSubmenuOpen={openSubmenus[item.id]}
                            badgeCount={item.badgeCount || 0}
                          />

                          {item.submenu && openSubmenus[item.id] && (
                            <div className="ml-10 space-y-1 mt-1 mb-2">
                              {item.submenu.map((subitem) => (
                                <button
                                  key={subitem.id}
                                  onClick={() => handleNavigation(subitem.id)}
                                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === subitem.id
                                      ? 'bg-blue-500/10 text-blue-400 font-medium'
                                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                                    }`}
                                >
                                  {subitem.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Bar */}
              <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="flex items-center gap-2 text-sm px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700"
                  >
                    <Search size={16} />
                    <span>Search resources...</span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">⌘</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">K</kbd>
                    </div>
                  </button>

                  {/* Cloud Provider Filter */}
                  <div className="flex items-center gap-2">
                    {cloudProviders.map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => setActiveCloudFilter(provider.id)}
                        className="focus:outline-none"
                      >
                        <ProviderBadge
                          provider={provider.name}
                          isActive={activeCloudFilter === provider.id}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={toggleNotifications}
                    className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </button>

                  <SettingsButton />

                  <button 
                    onClick={toggleHelpPanel}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    <HelpCircle size={20} />
                  </button>

                  <div className="w-px h-6 bg-slate-800"></div>

                  <button
                    onClick={toggleUserProfile}
                    className="flex items-center gap-3 hover:bg-slate-800 p-1 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      AS
                    </div>
                    <div className="hidden xl:block">
                      <div className="text-sm font-medium">Admin User</div>
                      <div className="text-xs text-slate-400">admin@omnicloud.io</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-auto p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default DashboardLayout;