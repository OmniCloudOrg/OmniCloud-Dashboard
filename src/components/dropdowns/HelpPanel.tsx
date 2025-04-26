import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Headphones, BookOpen, AlertCircle, Github, BookMarked, FileText, Code } from 'lucide-react';
import DropdownPanel from './DropdownPanel';

// Environment variable for GitHub repository (with fallback)
const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO || 'OmniCloudOrg/OmniCloud-Dashboard';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Resource {
  title: string;
  description: string;
  url?: string;
  icon: React.ElementType;
  iconColor: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  labels: {
    name: string;
    color: string;
  }[];
}

interface WikiPage {
  title: string;
  html_url: string;
  content: string; // May not be available in all APIs
}

// Help resources - directly linked to GitHub wiki or docs
const helpResources: Resource[] = [
  {
    title: "Getting Started Guide",
    description: "New to the platform? Start here for a quick overview",
    url: `https://github.com/${GITHUB_REPO}/wiki/Getting-Started`,
    icon: BookOpen,
    iconColor: "blue"
  },
  {
    title: "API Documentation",
    description: "Complete API reference and examples",
    url: `https://github.com/${GITHUB_REPO}/wiki/API-Documentation`,
    icon: Code,
    iconColor: "green"
  },
  {
    title: "Common Issues & FAQ",
    description: "Solutions to frequently encountered problems",
    url: `https://github.com/${GITHUB_REPO}/wiki/FAQ`,
    icon: AlertCircle,
    iconColor: "amber"
  },
  {
    title: "Best Practices",
    description: "Tips and techniques for optimal usage",
    url: `https://github.com/${GITHUB_REPO}/wiki/Best-Practices`,
    icon: BookMarked,
    iconColor: "purple"
  }
];

/**
 * Enhanced help center dropdown component with GitHub issues and Wiki search
 */
const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'issues' | 'wiki'>('resources');
  const [searchTerm, setSearchTerm] = useState('');
  const [githubIssues, setGithubIssues] = useState<GitHubIssue[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [wikiResults, setWikiResults] = useState<Resource[]>([]);
  const [isLoadingWiki, setIsLoadingWiki] = useState(false);

  // Filter resources based on search term
  const filteredResources = searchTerm 
    ? helpResources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : helpResources;

  // Fetch GitHub issues using the GitHub API
  const fetchGitHubIssues = async (query: string) => {
    setIsLoadingIssues(true);
    
    try {
      // Build the API URL with search parameters if query is provided
      let apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/issues`;
      
      // Add search parameters if query exists
      if (query) {
        // We use the q parameter to search in title and body
        // State=open ensures we only get open issues
        apiUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}+repo:${GITHUB_REPO}+state:open`;
      } else {
        // If no query, add parameters to get open issues with sorting
        apiUrl += '?state=open&sort=created&direction=desc';
      }
      
      // Make the API request
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      
      // Handle different response structures between search and list endpoints
      const issues = query 
        ? data.items // Search API returns items array
        : data;     // List API returns array directly
      
      // Filter out pull requests if they are returned
      const filteredIssues = issues.filter((issue: any) => !issue.pull_request);
      
      setGithubIssues(filteredIssues);
    } catch (error) {
      console.error("Error fetching GitHub issues:", error);
      setGithubIssues([]);
    } finally {
      setIsLoadingIssues(false);
    }
  };

  // Fetch Wiki pages using GitHub API
  const searchWikiDocs = async (query: string) => {
    setIsLoadingWiki(true);
    
    try {
      // GitHub doesn't have a direct search API for wiki content
      // First, we fetch all wiki pages
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/wiki`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }
      
      const wikiPages = await response.json();
      
      // Convert wiki pages to resource format and filter by query if provided
      const wikiResources: Resource[] = wikiPages
        .filter((page: WikiPage) => 
          !query || 
          page.title.toLowerCase().includes(query.toLowerCase())
        )
        .map((page: WikiPage) => ({
          title: page.title,
          description: `Documentation for ${page.title.replace(/-/g, ' ')}`,
          url: page.html_url,
          icon: BookOpen,
          iconColor: "blue"
        }));
      
      setWikiResults(wikiResources);
    } catch (error) {
      console.error("Error fetching Wiki pages:", error);
      
      // Fallback: If the API fails (often due to authentication or other issues),
      // we'll fetch the main wiki pages from the helpResources that match the query
      const filteredResources = query
        ? helpResources.filter(resource => 
            resource.title.toLowerCase().includes(query.toLowerCase()) || 
            resource.description.toLowerCase().includes(query.toLowerCase())
          )
        : helpResources;
      
      setWikiResults(filteredResources);
    } finally {
      setIsLoadingWiki(false);
    }
  };

  // Effect to handle search across different tabs
  useEffect(() => {
    if (searchTerm) {
      if (activeTab === 'issues') {
        fetchGitHubIssues(searchTerm);
      } else if (activeTab === 'wiki') {
        searchWikiDocs(searchTerm);
      }
    } else {
      // Load default data when search is cleared
      if (activeTab === 'issues') {
        fetchGitHubIssues('');
      } else if (activeTab === 'wiki') {
        searchWikiDocs('');
      }
    }
  }, [searchTerm, activeTab]);

  // Initial data load when tab changes
  useEffect(() => {
    if (activeTab === 'issues') {
      fetchGitHubIssues(searchTerm);
    } else if (activeTab === 'wiki') {
      searchWikiDocs(searchTerm);
    }
  }, [activeTab]);

  // Format relative time for GitHub issues
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Custom header content with search and tabs
  const helpHeaderContent = (
    <div className="w-full">
      <div className="text-lg font-medium mb-2">Help Center</div>
      <div className="relative mb-3">
        <input
          type="text"
          placeholder={`Search ${activeTab === 'resources' ? 'help resources' : activeTab === 'issues' ? 'GitHub issues' : 'Wiki docs'}...`}
          className="w-full py-2 px-3 pl-9 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
            onClick={() => setSearchTerm('')}
          >
            <span className="sr-only">Clear search</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-slate-700 mb-2">
        <button
          className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'resources' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${activeTab === 'issues' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('issues')}
        >
          <Github size={14} />
          Issues
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${activeTab === 'wiki' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
          onClick={() => setActiveTab('wiki')}
        >
          <BookMarked size={14} />
          Wiki
        </button>
      </div>
    </div>
  );

  // Render resources tab content
  const renderResourcesContent = () => (
    <>
      {filteredResources.length > 0 ? (
        <div className="space-y-3">
          {filteredResources.map((resource, index) => {
            const Icon = resource.icon;
            const colorClasses = {
              blue: 'bg-blue-500/10 text-blue-400',
              green: 'bg-green-500/10 text-green-400',
              purple: 'bg-purple-500/10 text-purple-400',
              amber: 'bg-amber-500/10 text-amber-400',
              red: 'bg-red-500/10 text-red-400',
            };
            
            const iconColorClass = colorClasses[resource.iconColor as keyof typeof colorClasses] || colorClasses.blue;
            
            return (
              <a 
                key={index}
                href={resource.url || '#'}
                target={resource.url ? "_blank" : undefined}
                rel={resource.url ? "noopener noreferrer" : undefined}
                className="block group"
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                  <div className={`p-2 rounded-full ${iconColorClass}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center">
                      {resource.title}
                      {resource.url && (
                        <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                      )}
                    </div>
                    <div className="text-sm text-slate-400">{resource.description}</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
            <Search size={24} className="text-slate-400" />
          </div>
          <p>No matching resources found</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );

  // Render GitHub issues tab content
  const renderIssuesContent = () => (
    <>
      {isLoadingIssues ? (
        <div className="p-8 text-center text-slate-400">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          </div>
          <p>Loading issues...</p>
        </div>
      ) : githubIssues.length > 0 ? (
        <div className="space-y-3">
          {githubIssues.map((issue) => {
            // Determine icon based on labels
            const isBug = issue.labels.some(label => 
              label.name.toLowerCase() === 'bug' || 
              label.name.toLowerCase().includes('fix')
            );
            const isFeature = issue.labels.some(label => 
              label.name.toLowerCase() === 'enhancement' || 
              label.name.toLowerCase().includes('feature')
            );
            
            let IconComponent = AlertCircle;
            let iconColorClass = "bg-amber-500/10 text-amber-400";
            
            if (isBug) {
              iconColorClass = "bg-red-500/10 text-red-400";
            } else if (isFeature) {
              IconComponent = BookMarked;
              iconColorClass = "bg-green-500/10 text-green-400";
            }
            
            return (
              <a 
                key={issue.id}
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                  <div className={`p-2 rounded-full ${iconColorClass} mt-1`}>
                    <IconComponent size={16} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center">
                      #{issue.number} {issue.title}
                      <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {issue.labels && issue.labels.map((label, index) => {
                        const labelColor = label.color ? `#${label.color}` : '#6e7681';
                        const textColor = isLightColor(labelColor) ? '#000000' : '#ffffff';
                        
                        return (
                          <span 
                            key={index}
                            className="px-2 py-0.5 rounded-full text-xs"
                            style={{ 
                              backgroundColor: labelColor,
                              color: textColor
                            }}
                          >
                            {label.name}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {formatRelativeTime(issue.created_at)}
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
            <Github size={24} className="text-slate-400" />
          </div>
          <p>No matching issues found</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );
  
  // Helper function to determine if a color is light or dark
  // Used for determining text color on label backgrounds
  const isLightColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  // Render Wiki docs tab content
  const renderWikiContent = () => (
    <>
      {isLoadingWiki ? (
        <div className="p-8 text-center text-slate-400">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          </div>
          <p>Searching Wiki docs...</p>
        </div>
      ) : wikiResults.length > 0 ? (
        <div className="space-y-3">
          {wikiResults.map((result, index) => {
            const Icon = result.icon;
            const colorClasses = {
              blue: 'bg-blue-500/10 text-blue-400',
              green: 'bg-green-500/10 text-green-400',
              purple: 'bg-purple-500/10 text-purple-400',
              amber: 'bg-amber-500/10 text-amber-400',
              red: 'bg-red-500/10 text-red-400',
            };
            
            const iconColorClass = colorClasses[result.iconColor as keyof typeof colorClasses] || colorClasses.blue;
            
            return (
              <a 
                key={index}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                  <div className={`p-2 rounded-full ${iconColorClass}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center">
                      {result.title}
                      <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-400">{result.description}</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
            <BookMarked size={24} className="text-slate-400" />
          </div>
          <p>No matching Wiki docs found</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}
    </>
  );

  return (
    <DropdownPanel 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      headerContent={helpHeaderContent}
      width="w-96"
    >
      <div className="p-3 max-h-96 overflow-y-auto">
        {activeTab === 'resources' && renderResourcesContent()}
        {activeTab === 'issues' && renderIssuesContent()}
        {activeTab === 'wiki' && renderWikiContent()}
        
        {/* Create Issue Button - Shows at the bottom of issues tab */}
        {activeTab === 'issues' && !isLoadingIssues && (
          <div className="mt-4 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <a
              href={`https://github.com/${GITHUB_REPO}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Create New Issue</span>
            </a>
          </div>
        )}
        
        {/* Create Wiki Page Button - Shows at the bottom of wiki tab */}
        {activeTab === 'wiki' && !isLoadingWiki && (
          <div className="mt-4 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <a
              href={`https://github.com/${GITHUB_REPO}/wiki/_new`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>Create Wiki Page</span>
            </a>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-800 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // Handle direct support action
            window.open(`https://github.com/${GITHUB_REPO}/issues/new?labels=support&template=support_request.md`, '_blank');
          }}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Headphones size={14} />
          <span>Contact Support Team</span>
        </a>
        
        <a
          href={`https://github.com/${GITHUB_REPO}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          <Github size={14} />
          <span>View on GitHub</span>
        </a>
      </div>
    </DropdownPanel>
  );
};

export default HelpPanel;