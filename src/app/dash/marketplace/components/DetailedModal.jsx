"use client"

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Download, 
  Info, 
  CheckCircle2, 
  BookOpen, 
  Github, 
  Shield, 
  ExternalLink, 
  Eye 
} from 'lucide-react';

export const DetailedModal = ({ item, isOpen, onClose, onInstall }) => {
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
                      {item.screenshots.map((_, index) => (
                        <div 
                          key={index} 
                          className="rounded-lg overflow-hidden border border-slate-700 aspect-video bg-slate-800 flex items-center justify-center"
                        >
                          <div className="flex items-center text-slate-500">
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
                    {item.features?.map((feature, i) => (
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
                  {item.readmeContent || item.readmePreview || 'No README available'}
                </div>
              </div>
            )}
            
            {activeTab === 'repository' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Repository Information</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Github size={18} className="text-slate-400" />
                      <h4 className="font-medium text-white">Repository Stats</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stars</span>
                        <span className="text-slate-200">{item.stars?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Forks</span>
                        <span className="text-slate-200">{item.forks?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Open Issues</span>
                        <span className="text-slate-200">{item.issues || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Language</span>
                        <span className="text-slate-200">{item.language || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">License</span>
                        <span className="text-slate-200">{item.license || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ExternalLink size={18} className="text-blue-400" />
                      <h4 className="font-medium text-white">Repository Link</h4>
                    </div>
                    <a
                      href={`https://${item.repoUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-slate-900 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Github size={16} />
                      <span>View on GitHub</span>
                      <ExternalLink size={12} />
                    </a>
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
                    {item.permissions?.map((permission, i) => (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};