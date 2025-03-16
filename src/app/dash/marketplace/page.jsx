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
  
  const tabItems = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'features', label: 'Features', icon: CheckCircle2 },
    { id: 'readme', label: 'README', icon: BookOpen },
    { id: 'repository', label: 'Repository', icon: Github },
    { id: 'permissions', label: 'Permissions', icon: Shield }
  ];
  
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
    const mockItems = [
      {
        id: 'aws-integration',
        name: 'aws-omnicloud-integration',
        repoUrl: 'github.com/cloud-extensions/aws-omnicloud-integration',
        authorName: 'cloud-extensions',
        description: 'Full integration with AWS services including EC2, S3, Lambda, CloudFront, and more. This extension provides seamless connection with AWS APIs.',
        type: 'cpi',
        icon: CloudCog,
        stars: 1847,
        forks: 312,
        issues: 24,
        contributors: 37,
        lastUpdated: '2 days ago',
        license: 'MIT',
        language: 'TypeScript',
        tags: ['AWS', 'Cloud', 'Infrastructure', 'EC2', 'S3'],
        installed: false,
        readmePreview: '# AWS OmniCloud Integration\n\nThis extension integrates AWS services with OmniCloud Platform.\n\n## Features\n\n- EC2 instance management\n- S3 bucket operations\n- Lambda function deployment\n- CloudWatch metrics visualization\n\n## Installation\n\n```bash\npm install aws-omnicloud-integration\n```',
        features: [
          'EC2 instance management',
          'S3 bucket operations',
          'Lambda function deployment',
          'CloudWatch metrics',
          'IAM role management',
          'Cost tracking',
          'CloudFront distributions',
          'RDS database connections'
        ],
        featureSections: [
          {
            title: 'Compute',
            description: 'Manage all your compute resources in one place.',
            items: [
              'EC2 instance provisioning and management',
              'Lambda function deployment and monitoring',
              'Auto-scaling group configuration',
              'Elastic Beanstalk environments'
            ]
          },
          {
            title: 'Storage',
            description: 'Complete control over your storage solutions.',
            items: [
              'S3 bucket creation and management',
              'File uploads and permissions',
              'EBS volume management',
              'Glacier archive access'
            ]
          }
        ],
        permissions: [
          'Connect to your AWS account',
          'View and manage EC2 instances',
          'Access S3 buckets and objects',
          'Manage Lambda functions',
          'View CloudWatch metrics'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'gcp-integration',
        name: 'gcp-platform-connector',
        repoUrl: 'github.com/google-cloud/gcp-platform-connector',
        authorName: 'google-cloud',
        description: 'Official Google Cloud Platform connector for OmniCloud. Integrate GCP services including Compute Engine, Cloud Storage, and BigQuery.',
        type: 'cpi',
        icon: CloudCog,
        stars: 2431,
        forks: 487,
        issues: 18,
        contributors: 52,
        lastUpdated: '5 days ago',
        license: 'Apache 2.0',
        language: 'JavaScript',
        tags: ['GCP', 'Google', 'Cloud', 'BigQuery', 'Compute Engine'],
        installed: false,
        features: [
          'Compute Engine VM management',
          'Cloud Storage integration',
          'Cloud Functions deployment',
          'BigQuery data analysis',
          'Kubernetes Engine clusters',
          'Cloud Run services',
          'IAM permission management',
          'Load balancer configuration'
        ],
        permissions: [
          'Connect to your GCP account',
          'View and manage Compute Engine VMs',
          'Access Cloud Storage',
          'Manage Cloud Functions',
          'Query data with BigQuery'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'azure-integration',
        name: 'azure-omnicloud-extension',
        repoUrl: 'github.com/ms-azure/azure-omnicloud-extension',
        authorName: 'ms-azure',
        description: 'Comprehensive Azure integration extension for OmniCloud. Integrates with Azure Resource Manager to provide full access to Azure services.',
        type: 'cpi',
        icon: CloudCog,
        stars: 1985,
        forks: 342,
        issues: 31,
        contributors: 46,
        lastUpdated: '1 week ago',
        license: 'MIT',
        language: 'TypeScript',
        tags: ['Azure', 'Microsoft', 'Cloud', 'ARM', 'AKS'],
        installed: false,
        features: [
          'Azure VM management',
          'Blob Storage access',
          'Azure Functions deployment',
          'Azure SQL Database',
          'Azure Kubernetes Service',
          'App Service deployment',
          'Azure Monitor integration',
          'Key Vault secrets management'
        ],
        permissions: [
          'Connect to your Azure account',
          'Manage Azure Virtual Machines',
          'Access Blob Storage',
          'Deploy and manage Azure Functions',
          'Monitor with Azure Insights'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'do-integration',
        name: 'digitalocean-connector',
        repoUrl: 'github.com/digitalocean/omnicloud-integration',
        authorName: 'digitalocean',
        description: 'Official DigitalOcean integration for OmniCloud. Connect and manage your DigitalOcean resources including Droplets, Spaces and App Platform.',
        type: 'cpi',
        icon: CloudCog,
        stars: 876,
        forks: 124,
        issues: 12,
        contributors: 17,
        lastUpdated: '2 weeks ago',
        license: 'BSD-3-Clause',
        language: 'Go',
        tags: ['DigitalOcean', 'Cloud', 'Droplets', 'Spaces', 'Kubernetes'],
        installed: true,
        features: [
          'Droplet provisioning',
          'Spaces object storage',
          'Load balancer management',
          'Kubernetes clusters',
          'App Platform deployment',
          'Databases management',
          'Floating IP assignment',
          'Firewall configuration'
        ],
        permissions: [
          'Connect to your DigitalOcean account',
          'Manage Droplets',
          'Access Spaces storage',
          'Deploy to App Platform',
          'Monitor Droplet metrics'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'resource-dashboard',
        name: 'unified-resource-dashboard',
        repoUrl: 'github.com/cloud-tools/unified-resource-dashboard',
        authorName: 'cloud-tools',
        description: 'Real-time dashboard for monitoring CPU, memory, storage and network usage across all your cloud resources. Features customizable alerts and historical trends.',
        type: 'dashboard',
        icon: BarChart4,
        stars: 3254,
        forks: 748,
        issues: 42,
        contributors: 73,
        lastUpdated: '3 days ago',
        license: 'MIT',
        language: 'JavaScript',
        tags: ['Monitoring', 'Analytics', 'Resources', 'Prometheus', 'Metrics'],
        installed: false,
        features: [
          'Real-time resource monitoring',
          'Custom alert creation',
          'Historical data analysis',
          'Anomaly detection',
          'Cross-provider metrics',
          'Custom dashboard layouts',
          'Metric exporters',
          'Notification integrations'
        ],
        permissions: [
          'Access resource metrics',
          'Display CPU/Memory/Disk usage',
          'Create custom alerts',
          'Track historical data',
          'Generate monitoring reports'
        ],
        screenshots: [1, 2, 3, 4]
      },
      {
        id: 'cost-analyzer',
        name: 'cloud-cost-analyzer',
        repoUrl: 'github.com/opencost/cloud-cost-analyzer',
        authorName: 'opencost',
        description: 'Open source cloud cost analyzer dashboard for multi-cloud environments. Provides comprehensive cost analysis with budget tracking and optimization recommendations.',
        type: 'dashboard',
        icon: ArrowUpDown,
        stars: 4216,
        forks: 862,
        issues: 37,
        contributors: 91,
        lastUpdated: '1 day ago',
        license: 'Apache 2.0',
        language: 'TypeScript',
        tags: ['Cost', 'Billing', 'Optimization', 'FinOps', 'Kubernetes'],
        installed: false,
        features: [
          'Multi-cloud cost tracking',
          'Budget alerts',
          'Cost forecasting',
          'Savings recommendations',
          'Resource attribution',
          'Usage-based allocation',
          'Cost comparison',
          'Export to CSV/Excel'
        ],
        permissions: [
          'Access billing information',
          'Track cloud spending',
          'Set budget alerts',
          'View cost forecasts',
          'Get saving recommendations'
        ],
        screenshots: [1, 2, 3]
      },
      {
        id: 'security-dashboard',
        name: 'cloud-security-center',
        repoUrl: 'github.com/security-hub/cloud-security-center',
        authorName: 'security-hub',
        description: 'Comprehensive security dashboard for monitoring cloud security posture. Features compliance checks, vulnerability scanning, and security recommendations.',
        type: 'dashboard',
        icon: AlertCircle,
        stars: 3864,
        forks: 642,
        issues: 29,
        contributors: 68,
        lastUpdated: '4 days ago',
        license: 'MPL-2.0',
        language: 'Python',
        tags: ['Security', 'Compliance', 'Audit', 'SIEM', 'Vulnerabilities'],
        installed: false,
        features: [
          'Security posture monitoring',
          'Compliance framework checks',
          'Vulnerability scanning',
          'Misconfiguration detection',
          'Access control auditing',
          'Threat intelligence',
          'Event correlation',
          'Remediation guidance'
        ],
        permissions: [
          'Scan for vulnerabilities',
          'Check security configurations',
          'Monitor access patterns',
          'Track compliance status',
          'Generate security reports'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'database-monitor',
        name: 'database-performance-monitor',
        repoUrl: 'github.com/db-tools/database-performance-monitor',
        authorName: 'db-tools',
        description: 'Advanced monitoring dashboard for all your databases with query performance analysis, connection tracking, and optimization tips.',
        type: 'dashboard',
        icon: Database,
        stars: 2987,
        forks: 513,
        issues: 22,
        contributors: 54,
        lastUpdated: '1 week ago',
        license: 'MIT',
        language: 'JavaScript',
        tags: ['Database', 'Performance', 'SQL', 'NoSQL', 'Monitoring'],
        installed: true,
        features: [
          'Query performance analysis',
          'Connection pool monitoring',
          'Index usage statistics',
          'Slow query tracking',
          'Schema visualization',
          'Storage metrics',
          'Automated recommendations',
          'Multi-database support'
        ],
        permissions: [
          'Connect to database instances',
          'Monitor query performance',
          'Track connection stats',
          'Analyze slow queries',
          'Generate performance reports'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'terraform-dashboard',
        name: 'terraform-visualizer',
        repoUrl: 'github.com/terraform-tools/terraform-visualizer',
        authorName: 'terraform-tools',
        description: 'Interactive dashboard for visualizing and managing Terraform infrastructure. Features graphical representation of resources and cost estimation.',
        type: 'dashboard',
        icon: Code,
        stars: 3142,
        forks: 486,
        issues: 33,
        contributors: 62,
        lastUpdated: '3 days ago',
        license: 'MIT',
        language: 'TypeScript',
        tags: ['Terraform', 'IaC', 'Infrastructure', 'Visualization', 'DevOps'],
        installed: false,
        features: [
          'Resource dependency visualization',
          'Plan visualization',
          'Drift detection',
          'Cost estimation',
          'Change history',
          'State management',
          'Module browser',
          'Resource search'
        ],
        permissions: [
          'Read Terraform state files',
          'Execute Terraform plan commands',
          'Visualize infrastructure graphs',
          'Track resource changes',
          'Estimate deployment costs'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'kubernetes-dashboard',
        name: 'k8s-command-center',
        repoUrl: 'github.com/k8s-tools/k8s-command-center',
        authorName: 'k8s-tools',
        description: 'Comprehensive Kubernetes dashboard that extends the standard Kubernetes Dashboard with advanced features. Includes multi-cluster management and resource optimization.',
        type: 'dashboard',
        icon: Cpu,
        stars: 5124,
        forks: 896,
        issues: 41,
        contributors: 87,
        lastUpdated: '6 hours ago',
        license: 'Apache 2.0',
        language: 'TypeScript',
        tags: ['Kubernetes', 'K8s', 'Containers', 'DevOps', 'Orchestration'],
        installed: false,
        features: [
          'Multi-cluster management',
          'Pod lifecycle visualization',
          'Resource quota monitoring',
          'Deployment workflows',
          'HPA configuration',
          'Service mesh integration',
          'Log streaming',
          'RBAC management'
        ],
        permissions: [
          'Connect to Kubernetes clusters',
          'View and manage Kubernetes resources',
          'Deploy applications to clusters',
          'View container logs and metrics',
          'Manage cluster configurations'
        ],
        screenshots: [1, 2, 3]
      },
      {
        id: 'cicd-dashboard',
        name: 'pipeline-central',
        repoUrl: 'github.com/devops-central/pipeline-central',
        authorName: 'devops-central',
        description: 'Universal CI/CD pipeline dashboard that integrates with popular CI/CD systems including GitHub Actions, GitLab CI, Jenkins, CircleCI, and Travis CI.',
        type: 'dashboard',
        icon: GitBranch,
        stars: 2865,
        forks: 431,
        issues: 28,
        contributors: 49,
        lastUpdated: '5 days ago',
        license: 'MIT',
        language: 'JavaScript',
        tags: ['CI/CD', 'DevOps', 'Pipelines', 'Testing', 'Automation'],
        installed: false,
        features: [
          'Multi-vendor CI/CD support',
          'Pipeline visualization',
          'Build analytics',
          'Test result tracking',
          'Deployment tracking',
          'Quality metrics',
          'Custom notifications',
          'Pipeline templates'
        ],
        permissions: [
          'Connect to CI/CD systems',
          'View pipeline execution status',
          'Access build logs and artifacts',
          'Track deployments across environments',
          'Receive build notifications'
        ],
        screenshots: [1, 2]
      },
      {
        id: 'network-analyzer',
        name: 'cloud-network-analyzer',
        repoUrl: 'github.com/net-tools/cloud-network-analyzer',
        authorName: 'net-tools',
        description: 'Comprehensive network analysis dashboard for cloud environments. Visualizes network traffic patterns, detects bottlenecks, and monitors latency.',
        type: 'dashboard',
        icon: Network,
        stars: 1897,
        forks: 321,
        issues: 19,
        contributors: 32,
        lastUpdated: '1 week ago',
        license: 'Apache 2.0',
        language: 'Go',
        tags: ['Networking', 'Traffic Analysis', 'Security', 'Latency', 'VPC'],
        installed: false,
        features: [
          'Traffic flow visualization',
          'Latency monitoring',
          'Bandwidth utilization',
          'Security group analysis',
          'Network topology mapping',
          'Performance bottlenecks',
          'Packet loss tracking',
          'Route table visualization'
        ],
        permissions: [
          'Access network configuration',
          'Monitor network traffic patterns',
          'Analyze security groups and ACLs',
          'Track network performance metrics',
          'Generate network topology maps'
        ],
        screenshots: [1, 2]
      }
    ];
    
    setItems(mockItems);
    setFilteredItems(sortItems(mockItems, sortOption));
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
  const filterOptions = [
    { id: 'all', label: 'All', icon: Grid3x3 },
    { id: 'cpi', label: 'Integrations', icon: CloudCog },
    { id: 'dashboard', label: 'Dashboards', icon: BarChart4 }
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'stars', label: 'Most Stars' },
    { id: 'recent', label: 'Recently Updated' },
    { id: 'name', label: 'Name' },
    { id: 'forks', label: 'Most Forks' }
  ];
  
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