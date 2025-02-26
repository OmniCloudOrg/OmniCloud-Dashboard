"use client"

import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Filter, 
  Clock, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  X,
  Eye,
  Copy,
  Share,
  Bookmark,
  Activity,
  BarChart2,
  Zap,
  Server,
  Database,
  Settings,
  Save,
  FileText,
  CloudOff,
  Calendar,
  User,
  ArrowUpRight,
  Trash,
  History,
  ToggleLeft,
  Monitor
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Resource Card Component
const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {percentage && (
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : trend === 'down' ? <ArrowUpRight size={16} className="rotate-90" /> : null}
          {percentage}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

// Log Level Badge Component
const LogLevelBadge = ({ level }) => {
  let bgColor, textColor, icon;
  
  switch (level.toLowerCase()) {
    case 'error':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <AlertCircle size={14} />;
      break;
    case 'warn':
    case 'warning':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      icon = <AlertTriangle size={14} />;
      break;
    case 'info':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <Info size={14} />;
      break;
    case 'debug':
      bgColor = 'bg-purple-500/10';
      textColor = 'text-purple-400';
      icon = <Terminal size={14} />;
      break;
    case 'trace':
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = <Activity size={14} />;
      break;
    default:
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      {icon}
      <span className="uppercase">{level}</span>
    </div>
  );
};

// Log Entry Component
const LogEntry = ({ log, expanded, onToggle }) => {
  return (
    <div 
      className={`border-b border-slate-800 ${expanded ? 'bg-slate-800/30' : 'hover:bg-slate-800/20'}`}
    >
      <div 
        className="px-4 py-3 flex items-start cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-none pt-1">
          {expanded ? 
            <ChevronDown size={16} className="text-slate-400" /> : 
            <ChevronRight size={16} className="text-slate-400" />
          }
        </div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <LogLevelBadge level={log.level} />
            <div className="text-sm font-medium text-white truncate">{log.message}</div>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{log.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Server size={12} />
              <span>{log.service}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{log.user || 'system'}</span>
            </div>
            {log.requestId && (
              <div className="hidden md:flex items-center gap-1">
                <Zap size={12} />
                <span className="font-mono">{log.requestId}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex items-center">
          <button className="p-1 text-slate-400 hover:text-slate-300">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-10 pb-4">
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
              <Copy size={14} />
              <span>Copy</span>
            </button>
            <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
              <Bookmark size={14} />
              <span>Save</span>
            </button>
            <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
              <Share size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Save Search Modal Component
const SaveSearchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Save Search</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Search Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Error logs in API service"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
              <textarea
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Filters for all error logs in the API service"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Options</span>
              </label>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pin-search"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="pin-search" className="ml-2 text-sm text-white">
                  Pin to dashboard
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="create-alert"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="create-alert" className="ml-2 text-sm text-white">
                  Create alert from this search
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="share-team"
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  defaultChecked
                />
                <label htmlFor="share-team" className="ml-2 text-sm text-white">
                  Share with team
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alert Rule Modal Component
const AlertRuleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create Log Alert</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Alert Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="API Service Error Rate"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Search Query</label>
              <textarea
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono"
                placeholder="level:error service:api-service"
                rows={2}
              />
              <p className="mt-1 text-xs text-slate-500">This query will be used to filter logs for this alert.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="greater-than">Greater than</option>
                  <option value="less-than">Less than</option>
                  <option value="equal-to">Equal to</option>
                  <option value="not-equal-to">Not equal to</option>
                </select>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="5"
                />
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="occurrences">occurrences</option>
                  <option value="percentage">percentage</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-slate-500">Alert when the number of matching logs exceeds this threshold in the time window.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Time Window</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="5"
                />
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Severity</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Notification Channels</h3>
              <div className="space-y-3 bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-email"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      defaultChecked
                    />
                    <label htmlFor="notify-email" className="ml-2 text-sm text-white">
                      Email
                    </label>
                  </div>
                  <span className="text-xs text-slate-400">team@example.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-slack"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      defaultChecked
                    />
                    <label htmlFor="notify-slack" className="ml-2 text-sm text-white">
                      Slack
                    </label>
                  </div>
                  <span className="text-xs text-slate-400">#alerts-channel</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-webhook"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="notify-webhook" className="ml-2 text-sm text-white">
                      Webhook
                    </label>
                  </div>
                  <button className="text-xs text-blue-400 hover:text-blue-300">Configure</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Create Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Logs Component
const LogsManagement = () => {
  const [activeView, setActiveView] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevels, setSelectedLevels] = useState(['error', 'warn', 'info', 'debug']);
  const [timeRange, setTimeRange] = useState('1h');
  const [expandedLog, setExpandedLog] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Sample log data
  const logs = [
    {
      id: 'log-001',
      timestamp: '2025-02-25T12:34:56',
      level: 'error',
      service: 'api-service',
      message: 'Failed to connect to database',
      user: 'system',
      requestId: 'req-abcdef123456',
      details: {
        error: 'ConnectionError',
        database: 'postgres://user:***@db.example.com:5432/prod',
        retries: 3,
        stack: 'Error: Failed to connect to database\n  at connectToDB (/app/src/db.js:42:15)\n  at startServer (/app/src/index.js:23:5)'
      }
    },
    {
      id: 'log-002',
      timestamp: '2025-02-25T12:34:45',
      level: 'warn',
      service: 'auth-service',
      message: 'Rate limit exceeded for user',
      user: 'john.doe',
      requestId: 'req-bcdefg234567',
      details: {
        userId: 'usr-12345',
        ipAddress: '192.168.1.1',
        limitType: 'auth_attempts',
        threshold: 5,
        periodMinutes: 15
      }
    },
    {
      id: 'log-003',
      timestamp: '2025-02-25T12:34:30',
      level: 'info',
      service: 'api-service',
      message: 'API request processed successfully',
      user: 'jane.smith',
      requestId: 'req-cdefgh345678',
      details: {
        endpoint: '/api/v1/users',
        method: 'GET',
        statusCode: 200,
        responseTime: '127ms',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    },
    {
      id: 'log-004',
      timestamp: '2025-02-25T12:34:15',
      level: 'debug',
      service: 'payment-service',
      message: 'Processing payment transaction',
      user: 'jane.smith',
      requestId: 'req-defghi456789',
      details: {
        transactionId: 'tx-789012',
        amount: 49.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        steps: [
          'verify_account_balance',
          'authorize_payment',
          'process_transaction',
          'send_confirmation'
        ]
      }
    },
    {
      id: 'log-005',
      timestamp: '2025-02-25T12:34:00',
      level: 'info',
      service: 'notification-service',
      message: 'Email notification sent',
      user: 'system',
      requestId: 'req-efghij567890',
      details: {
        templateId: 'welcome-email',
        recipient: 'user@example.com',
        metadata: {
          userId: 'usr-67890',
          onboardingStep: 'complete'
        }
      }
    },
    {
      id: 'log-006',
      timestamp: '2025-02-25T12:33:45',
      level: 'error',
      service: 'storage-service',
      message: 'Failed to upload file to storage',
      user: 'john.doe',
      requestId: 'req-fghijk678901',
      details: {
        error: 'PermissionDeniedError',
        bucket: 'user-uploads',
        fileName: 'large-document.pdf',
        fileSize: '15.4 MB',
        stack: 'Error: Access denied\n  at uploadFile (/app/src/storage.js:87:22)\n  at processRequest (/app/src/controllers/upload.js:45:10)'
      }
    },
    {
      id: 'log-007',
      timestamp: '2025-02-25T12:33:30',
      level: 'warn',
      service: 'api-gateway',
      message: 'Deprecated API endpoint accessed',
      user: 'alex.johnson',
      requestId: 'req-ghijkl789012',
      details: {
        endpoint: '/api/v1/legacy/reports',
        method: 'GET',
        deprecationDate: '2024-12-31',
        recommendedEndpoint: '/api/v2/reports',
        userAgent: 'CustomIntegration/1.2.3'
      }
    },
    {
      id: 'log-008',
      timestamp: '2025-02-25T12:33:15',
      level: 'info',
      service: 'user-service',
      message: 'User updated their profile',
      user: 'sarah.williams',
      requestId: 'req-hijklm890123',
      details: {
        userId: 'usr-54321',
        updatedFields: [
          'displayName',
          'profilePicture',
          'preferences'
        ],
        source: 'web-app'
      }
    },
    {
      id: 'log-009',
      timestamp: '2025-02-25T12:33:00',
      level: 'debug',
      service: 'search-service',
      message: 'Search query processed',
      user: 'alex.johnson',
      requestId: 'req-ijklmn901234',
      details: {
        query: 'machine learning tutorials',
        filters: {
          category: 'technology',
          sortBy: 'relevance',
          maxResults: 25
        },
        executionTimeMs: 87,
        resultCount: 18
      }
    },
    {
      id: 'log-010',
      timestamp: '2025-02-25T12:32:45',
      level: 'error',
      service: 'payment-service',
      message: 'Payment processing failed',
      user: 'robert.brown',
      requestId: 'req-jklmno012345',
      details: {
        error: 'CardDeclinedError',
        transactionId: 'tx-654321',
        amount: 129.99,
        currency: 'USD',
        paymentMethod: 'credit_card',
        responseCode: 'INSUFFICIENT_FUNDS',
        acquirerMessage: 'Insufficient funds in account'
      }
    }
  ];
  
  // Filter logs based on search query and selected levels
  const filteredLogs = logs.filter(log => 
    (searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    selectedLevels.includes(log.level)
  );
  
  // Toggle log expansion
  const toggleLogExpansion = (logId) => {
    if (expandedLog === logId) {
      setExpandedLog(null);
    } else {
      setExpandedLog(logId);
    }
  };
  
  // Toggle level filter
  const toggleLevelFilter = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };
  
  // Log level counts for chart
  const logLevelCounts = {
    error: logs.filter(log => log.level === 'error').length,
    warn: logs.filter(log => log.level === 'warn').length,
    info: logs.filter(log => log.level === 'info').length,
    debug: logs.filter(log => log.level === 'debug').length
  };
  
  // Recent log activity data
  const logActivityData = [
    { time: '12:00', count: 120 },
    { time: '12:05', count: 135 },
    { time: '12:10', count: 125 },
    { time: '12:15', count: 148 },
    { time: '12:20', count: 162 },
    { time: '12:25', count: 140 },
    { time: '12:30', count: 152 },
    { time: '12:35', count: 130 }
  ];
  
  // Sample saved searches
  const savedSearches = [
    { id: 1, name: 'All Error Logs', query: 'level:error', createdBy: 'john.doe', lastRun: '1 hour ago' },
    { id: 2, name: 'Payment Processing Issues', query: 'service:payment-service level:error', createdBy: 'sarah.williams', lastRun: '3 hours ago' },
    { id: 3, name: 'API Gateway Warnings', query: 'service:api-gateway level:warn', createdBy: 'alex.johnson', lastRun: '2 days ago' },
    { id: 4, name: 'User Activity', query: 'service:user-service level:info', createdBy: 'you', lastRun: '1 week ago' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Logs</h2>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last hour</option>
            <option value="6h">Last 6 hours</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="custom">Custom range</option>
          </select>
          <button 
            className={`flex items-center gap-2 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-800 hover:bg-slate-700'} text-white px-4 py-2 rounded-lg transition-colors`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <>
                <Play size={16} />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause size={16} />
                <span>Pause</span>
              </>
            )}
          </button>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <AlertCircle size={16} />
            <span>Create Alert</span>
          </button>
        </div>
      </div>
      
      {/* Log Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard 
          title="Total Logs" 
          value={logs.length.toLocaleString()} 
          percentage="12" 
          trend="up" 
          icon={Terminal} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="Last hour"
        />
        <ResourceCard 
          title="Error Logs" 
          value={logLevelCounts.error} 
          percentage="5" 
          trend="up" 
          icon={AlertCircle} 
          color="bg-red-500/10 text-red-400" 
        />
        <ResourceCard 
          title="Warning Logs" 
          value={logLevelCounts.warn} 
          icon={AlertTriangle} 
          color="bg-yellow-500/10 text-yellow-400" 
        />
        <ResourceCard 
          title="Services" 
          value="8" 
          icon={Server} 
          color="bg-purple-500/10 text-purple-400" 
        />
      </div>
      
      {/* Log Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Log Activity</h3>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white">
              <option value="count">Log Count</option>
              <option value="errorRate">Error Rate</option>
              <option value="responseTime">Avg Response Time</option>
            </select>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={logActivityData}>
                  <defs>
                    <linearGradient id="colorLogCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    fillOpacity={1}
                    fill="url(#colorLogCount)" 
                    name="Log Count"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h3 className="text-lg font-medium text-white">Saved Searches</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {savedSearches.map((search) => (
              <div key={search.id} className="p-4 hover:bg-slate-800/30">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-white">{search.name}</div>
                  <button className="text-blue-400 hover:text-blue-300 text-xs">
                    Run
                  </button>
                </div>
                <div className="text-xs font-mono bg-slate-800 rounded p-1.5 mb-2 text-slate-400">
                  {search.query}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>By {search.createdBy}</span>
                  <span>Ran {search.lastRun}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-800">
            <button 
              onClick={() => setIsSaveModalOpen(true)} 
              className="w-full py-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Save Current Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Log Search and Filters */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('live')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeView === 'live' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Live Logs
            </button>
            <button
              onClick={() => setActiveView('structured')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeView === 'structured' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Structured View
            </button>
            <button
              onClick={() => setActiveView('insights')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeView === 'insights' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Insights
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Download size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <BarChart2 size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Settings size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search logs by message, service or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 self-end">
              <div className="flex gap-1">
                <button
                  onClick={() => toggleLevelFilter('error')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedLevels.includes('error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  ERROR
                </button>
                <button
                  onClick={() => toggleLevelFilter('warn')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedLevels.includes('warn') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  WARN
                </button>
                <button
                  onClick={() => toggleLevelFilter('info')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedLevels.includes('info') ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  INFO
                </button>
                <button
                  onClick={() => toggleLevelFilter('debug')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedLevels.includes('debug') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  DEBUG
                </button>
              </div>
              
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
                <option value="all">All Services</option>
                <option value="api-service">api-service</option>
                <option value="auth-service">auth-service</option>
                <option value="payment-service">payment-service</option>
                <option value="notification-service">notification-service</option>
                <option value="storage-service">storage-service</option>
                <option value="user-service">user-service</option>
                <option value="search-service">search-service</option>
              </select>
            </div>
          </div>
          
          {/* Log Results */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
            {filteredLogs.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {filteredLogs.map((log) => (
                  <LogEntry 
                    key={log.id} 
                    log={log} 
                    expanded={expandedLog === log.id} 
                    onToggle={() => toggleLogExpansion(log.id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Logs Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any logs matching your search criteria.
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLevels(['error', 'warn', 'info', 'debug']);
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-400">
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm">
                  Previous
                </button>
                <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <SaveSearchModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} />
      <AlertRuleModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} />
    </div>
  );
};

// Missing components
const Play = ({ size, className }) => {
  return <div className={className}><svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>;
};

const Pause = ({ size, className }) => {
  return <div className={className}><svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg></div>;
};

const MemoryStick = ({ size, className }) => {
  return <div className={className}><svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 19v-3"></path><path d="M10 19v-3"></path><path d="M14 19v-3"></path><path d="M18 19v-3"></path><path d="M5 16h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1z"></path><path d="M8 9h8"></path><path d="M8 12h8"></path></svg></div>;
};

export default LogsManagement;