"use client"

import React, { useState, useEffect } from 'react';
import {
  Search,
  Tag,
  Star,
  GitFork,
  Download,
  Check,
  CloudCog,
  Grid3x3,
  Cpu,
  Database,
  AlertCircle,
  ArrowUpDown,
  BarChart4,
  CheckCircle2,
  Clock,
  X,
  Github,
  Code,
  BookOpen,
  GitBranch,
  Network,
  FileCode,
  Info,
  Shield,
  Terminal,
  Settings,
  Eye,
  ExternalLink,
  Users
} from 'lucide-react';

// Import mock data
import {
  MARKETPLACE_ITEMS,
  MARKETPLACE_TAB_ITEMS,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_SORT_OPTIONS
} from '@/data';

// Simple marketplace item card
const MarketplaceItemCard = ({ item, onClick }) => {
  return (
    <div 
      className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-blue-900/10 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${item.type === 'cpi' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
          {item.icon && React.createElement(item.icon, { size: 20 })}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-200">{item.name}</h3>
            {item.installed && (
              <span className="flex items-center text-xs font-medium text-green-400">
                <Check size={12} className="mr-1" />
                Installed
              </span>
            )}
          </div>
          
          <div className="text-xs text-slate-400 mb-2">by {item.authorName}</div>
          
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={14} className="fill-amber-400" />
                <span>{item.stars.toLocaleString()}</span>
              </div>
              <div className="text-slate-400">
                {item.type === 'cpi' ? 'Integration' : 'Dashboard'}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                item.onInstall(item);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                item.installed 
                  ? 'bg-green-500/10 text-green-400 cursor-default' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {item.installed ? (
                'Installed'
              ) : (
                <>
                  <Download size={12} />
                  <span>Install</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detailed modal component with sidebar
const DetailedModal = ({ item, isOpen, onClose, onInstall }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!isOpen || !item) return null;
  
  const tabItems = MARKETPLACE_TAB_ITEMS;
  
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[80vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {item.icon && React.createElement(item.icon, { 
              size: 24, 
              className: item.type === 'cpi' ? 'text-blue-400' : 'text-purple-400' 
            })}
            <div>
              <h2 className="text-xl font-semibold text-white">{item.name}</h2>
              <div className="text-sm text-slate-400">by {item.authorName}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onInstall(item)}
              disabled={item.installed}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.installed 
                  ? 'bg-green-500/10 text-green-400 cursor-default' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {item.installed ? (
                <>
                  <Check size={16} />
                  <span>Installed</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Install</span>
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Content area with sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-slate-800 overflow-y-auto p-2">
            <nav className="space-y-1">
              {tabItems.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 w-full p-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500/10 text-blue-400 font-medium'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="p-3">
                <h4 className="font-medium text-slate-300 mb-3">Repository Info</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stars</span>
                    <span className="text-slate-200 font-medium">{item.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Forks</span>
                    <span className="text-slate-200 font-medium">{item.forks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Open Issues</span>
                    <span className="text-slate-200 font-medium">{item.issues}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contributors</span>
                    <span className="text-slate-200 font-medium">{item.contributors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">License</span>
                    <span className="text-slate-200 font-medium">{item.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Updated</span>
                    <span className="text-slate-200 font-medium">{item.lastUpdated}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-slate-800 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Github size={16} />
                  <span>View on GitHub</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Overview</h3>
                <p className="text-slate-300 mb-6">{item.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="text-xs rounded-full px-2 py-1 bg-slate-800 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {item.screenshots && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-white mb-3">Screenshots</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {item.screenshots.map((screenshot, index) => (
                        <div 
                          key={index} 
                          className="rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-800"
                        >
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Eye size={24} />
                            <span className="ml-2">Screenshot {index + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-md font-medium text-white mb-3">Key Features</h4>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 size={16} className="text-green-400 mt-0.5 shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Features</h3>
                <div className="space-y-6">
                  {item.featureSections?.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="text-md font-medium text-white mb-2">{section.title}</h4>
                      <p className="text-sm text-slate-300 mb-3">{section.description}</p>
                      <ul className="space-y-2">
                        {section.items.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 size={16} className="text-green-400 mt-0.5" />
                            <span className="text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'readme' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">README.md</h3>
                  <div className="text-xs text-slate-400">
                    From {item.repoUrl}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-line">
                  {item.readmeContent || item.readmePreview}
                </div>
              </div>
            )}
            
            {activeTab === 'repository' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Repository Information</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Star size={18} className="text-amber-400" />
                      <h4 className="font-medium text-white">Stats</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stars</span>
                        <span className="text-slate-200">{item.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Forks</span>
                        <span className="text-slate-200">{item.forks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Open Issues</span>
                        <span className="text-slate-200">{item.issues}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Open PRs</span>
                        <span className="text-slate-200">{item.pullRequests || 5}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Updated</span>
                        <span className="text-slate-200">{item.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={18} className="text-blue-400" />
                      <h4 className="font-medium text-white">Contributors</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-700"></div>
                      ))}
                      {item.contributors > 5 && (
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                          +{item.contributors - 5}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-slate-400">
                      {item.contributors} contributors in total
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCode size={18} className="text-green-400" />
                    <h4 className="font-medium text-white">Code</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Language</span>
                      <span className="text-slate-200">{item.language || 'JavaScript'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">License</span>
                      <span className="text-slate-200">{item.license}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Repository URL</span>
                      <a href="#" className="text-blue-400 hover:underline">{item.repoUrl}</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal size={18} className="text-purple-400" />
                    <h4 className="font-medium text-white">Installation</h4>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg font-mono text-sm text-slate-300 mb-3">
                    git clone https://{item.repoUrl}.git
                  </div>
                  <div className="text-sm text-slate-400">
                    Or install directly through the OmniCloud marketplace.
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'permissions' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Required Permissions</h3>
                <p className="text-slate-300 mb-6">
                  This extension requires the following permissions to function properly:
                </p>
                
                <div className="bg-slate-800 rounded-lg p-4 mb-6">
                  <ul className="space-y-3">
                    {item.permissions.map((permission, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-slate-200">{permission}</div>
                          <div className="text-sm text-slate-400 mt-1">
                            {item.permissionDetails?.[i] || "This permission is required for core functionality."}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
                  <p className="flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>All extensions are open source under the {item.license} license. You can review the code before installation.</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Installation modal component
const InstallationModal = ({ item, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-white">Install {item.name}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-300 mb-4">
              You're about to install <span className="font-medium text-white">{item.name}</span> by {item.authorName}.
            </p>
            
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg mb-4">
              <Github size={16} className="text-slate-300" />
              <span className="text-sm text-slate-300">{item.repoUrl}</span>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">
              <h4 className="font-medium text-slate-200 mb-2">This extension will:</h4>
              <ul className="space-y-2">
                {item.permissions.slice(0, 3).map((permission, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-green-400 mt-0.5" />
                    <span className="text-slate-300">{permission}</span>
                  </li>
                ))}
                {item.permissions.length > 3 && (
                  <li className="text-sm text-slate-400 ml-6">
                    And {item.permissions.length - 3} more permissions...
                  </li>
                )}
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300">
              <p className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>All extensions are open source under the {item.license} license.</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(item)}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Confirm Installation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Marketplace page component
const MarketplacePage = () => {
  // State for marketplace items
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOption, setSortOption] = useState('stars');
  
  // State for modals
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [installProgress, setInstallProgress] = useState({ active: false, item: null, progress: 0 });
  
  // Mock marketplace items data (GitHub repositories)
  useEffect(() => {
    // This would normally be fetched from an API
    setItems(MARKETPLACE_ITEMS);
    setFilteredItems(sortItems(MARKETPLACE_ITEMS, sortOption));
  }, [sortOption]);
  
  // Attach install handler to items
  const itemsWithHandlers = filteredItems.map(item => ({
    ...item,
    onInstall: (item) => {
      setSelectedItem(item);
      setIsInstallModalOpen(true);
    }
  }));
  
  // Sort items function
  const sortItems = (itemsToSort, sortBy) => {
    const sortedItems = [...itemsToSort];
    
    switch (sortBy) {
      case 'stars':
        return sortedItems.sort((a, b) => b.stars - a.stars);
      case 'recent':
        // This is simplistic, in reality you'd sort by actual dates
        const recentOrder = {
          'hours ago': 1,
          'day ago': 2,
          'days ago': 3,
          'week ago': 4,
          'weeks ago': 5,
          'month ago': 6,
          'months ago': 7
        };
        return sortedItems.sort((a, b) => {
          const aMatch = a.lastUpdated.match(/(\d+)\s+(\w+\s+\w+)/);
          const bMatch = b.lastUpdated.match(/(\d+)\s+(\w+\s+\w+)/);
          if (aMatch && bMatch) {
            const aTime = aMatch[2];
            const bTime = bMatch[2];
            return (recentOrder[aTime] || 99) - (recentOrder[bTime] || 99);
          }
          return 0;
        });
      case 'name':
        return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
      case 'forks':
        return sortedItems.sort((a, b) => b.forks - a.forks);
      default:
        return sortedItems;
    }
  };
  
  // Filter items based on search query and type filter
  useEffect(() => {
    let filtered = [...items];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }
    
    // Sort the filtered results
    filtered = sortItems(filtered, sortOption);
    
    setFilteredItems(filtered);
  }, [searchQuery, activeFilter, items, sortOption]);
  
  // Handle opening detail modal
  const handleOpenDetailModal = (item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };
  
  // Handle installation
  const handleInstallConfirm = (item) => {
    setIsInstallModalOpen(false);
    
    // Start fake installation progress
    setInstallProgress({
      active: true,
      item: item,
      progress: 0
    });
    
    // Simulate installation progress
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          
          // Update the installed status of the item
          setItems(prevItems => 
            prevItems.map(i => 
              i.id === item.id ? { ...i, installed: true } : i
            )
          );
          
          return { active: false, item: null, progress: 0 };
        }
        
        return {
          ...prev,
          progress: prev.progress + 10
        };
      });
    }, 300);
  };
  
  // Filter options
  const filterOptions = MARKETPLACE_CATEGORIES;
  
  // Sort options  
  const sortOptions = MARKETPLACE_SORT_OPTIONS;
  
  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Extension Marketplace</h1>
        <p className="text-slate-400">
          Browse and install open source extensions for cloud integrations and dashboard screens.
          All extensions are free and sourced directly from GitHub repositories.
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search extensions by name, author, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 rounded-lg text-white pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        {filterOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === option.id
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <option.icon size={16} />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      
      {/* Installation progress */}
      {installProgress.active && (
        <div className="mb-8 p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              <span className="font-medium text-white">
                Installing {installProgress.item.name}
              </span>
            </div>
            <span className="text-slate-300">{installProgress.progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
              style={{ width: `${installProgress.progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {installProgress.progress < 30 && "Cloning repository..."}
            {installProgress.progress >= 30 && installProgress.progress < 60 && "Installing dependencies..."}
            {installProgress.progress >= 60 && installProgress.progress < 90 && "Configuring extension..."}
            {installProgress.progress >= 90 && "Finalizing installation..."}
          </div>
        </div>
      )}
      
      {/* Results */}
      {itemsWithHandlers.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-800 mb-4">
            <Search size={24} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No extensions found</h3>
          <p className="text-slate-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {itemsWithHandlers.map(item => (
            <MarketplaceItemCard 
              key={item.id} 
              item={item} 
              onClick={() => handleOpenDetailModal(item)} 
            />
          ))}
        </div>
      )}
      
      {/* Detailed modal */}
      {selectedItem && (
        <DetailedModal
          item={selectedItem}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onInstall={(item) => {
            setIsDetailModalOpen(false);
            setSelectedItem(item);
            setIsInstallModalOpen(true);
          }}
        />
      )}
      
      {/* Installation modal */}
      {selectedItem && (
        <InstallationModal
          item={selectedItem}
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          onConfirm={handleInstallConfirm}
        />
      )}
    </div>
  );
};

export default MarketplacePage;