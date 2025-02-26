"use client"

import React, { useState } from 'react';
import {
  Home,
  Server,
  Box,
  Cloud,
  Grid,
  Activity,
  Bell,
  Users,
  Settings,
  LogOut,
  Search,
  X,
  Menu,
  ChevronRight,
  HelpCircle,
  CloudCog,
  Terminal,
  LineChart,
  Shield,
  Cpu,
  Database,
  Network,
  LayoutGrid,
  GitBranch,
  ArrowUpDown
} from 'lucide-react';

// Theme toggler component
const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');

  return (
    <button
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-200"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
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
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.75 9.75C15.6517 11.5019 14.8717 13.1522 13.5659 14.3476C12.2602 15.543 10.5321 16.1807 8.77379 16.131C7.01547 16.0813 5.32647 15.3477 4.10115 14.0749C2.87584 12.8022 2.20042 11.08 2.14917 9.2817C2.09792 7.48341 2.47541 5.70516 3.35341 4.20278C4.23141 2.7004 5.55997 1.55306 7.13187 0.929727C8.70378 0.306396 10.4308 0.238772 12.0476 0.736781C13.6643 1.23479 15.0772 2.27473 16.0575 3.67874C14.2559 3.52662 12.4558 4.07095 11.0171 5.1901C9.57834 6.30924 8.60396 7.91029 8.25328 9.68835C7.90259 11.4664 8.20361 13.3152 9.09441 14.889C9.9852 16.4627 11.3968 17.6516 13.0575 18.2025" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
};

// Navigation item component
const NavItem = ({ icon: Icon, label, isActive, onClick, hasSubmenu, isSubmenuOpen, badgeCount }) => (
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
      case 'aws':
        return '🟧';
      case 'gcp':
        return '🟦';
      case 'azure':
        return '🟪';
      case 'on-prem':
        return '🟩';
      default:
        return '⬜';
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

// Command palette component
const CommandPalette = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock results based on query
  const getResults = () => {
    if (!searchQuery) return [];

    // Mock data - in a real app this would search through actual resources
    return [
      { type: 'app', name: 'frontend-service', environment: 'production' },
      { type: 'app', name: 'auth-api', environment: 'staging' },
      { type: 'instance', name: 'api-gateway-2', status: 'running' },
      { type: 'user', name: 'john.doe@example.com', role: 'Developer' },
      { type: 'route', name: 'api.example.com/v1', target: 'api-gateway' },
      { type: 'cloud', name: 'AWS US-EAST-1', status: 'healthy' },
    ].filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const results = getResults();

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
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-slate-400" size={20} />
          <input
            type="text"
            className="w-full px-12 py-4 bg-transparent text-white border-b border-slate-800 focus:outline-none"
            placeholder="Search for apps, instances, users, or commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-2 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-800 text-slate-200"
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
            ))
          ) : searchQuery ? (
            <div className="p-4 text-center text-slate-400">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400">
              Type to search across resources
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
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  );
};

// Main dashboard layout component
const DashboardLayout = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeCloudFilter, setActiveCloudFilter] = useState('all');

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

  // Navigation configuration
  const navSections = [
    {
      title: 'Core',
      items: [
        { icon: Home, label: 'Dashboard', id: 'dashboard' },
        {
          icon: Box,
          label: 'Applications',
          id: 'apps',
          badgeCount: 0,
          submenu: [
            { label: 'All Apps', id: 'all-apps' },
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
            { label: 'Instances', id: 'instances' },
            { label: 'Containers', id: 'containers' },
            { label: 'VM Images', id: 'vm-images' },
            { label: 'Container Registry', id: 'registry' }
          ]
        },
        {
          icon: Network,
          label: 'Networking',
          id: 'networking',
          badgeCount: 0,
          submenu: [
            { label: 'Routes', id: 'routes' },
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
            { label: 'Dashboards', id: 'dashboards' },
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <html>
      <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
      <body>
        <div className="min-h-screen bg-slate-950 text-white">
          {/* Command Palette */}
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
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
                <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 z-20 bg-slate-900/80 backdrop-blur-sm">
              <div className="h-full w-80 max-w-[80%] bg-slate-900 border-r border-slate-800 overflow-y-auto">
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
                                setActiveSection(item.id);
                                if (item.submenu) {
                                  toggleSubmenu(item.id);
                                } else {
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
                                      setActiveSection(subitem.id);
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
              <div className="p-6 border-b border-slate-800">
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
                              setActiveSection(item.id);
                              if (item.submenu) {
                                toggleSubmenu(item.id);
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
                                  onClick={() => setActiveSection(subitem.id)}
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
                  <button className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </span>
                    )}
                  </button>

                  <ThemeToggle />

                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">
                    <HelpCircle size={20} />
                  </button>

                  <div className="w-px h-6 bg-slate-800"></div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      AS
                    </div>
                    <div className="hidden xl:block">
                      <div className="text-sm font-medium">Admin User</div>
                      <div className="text-xs text-slate-400">admin@omnicloud.io</div>
                    </div>
                  </div>
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