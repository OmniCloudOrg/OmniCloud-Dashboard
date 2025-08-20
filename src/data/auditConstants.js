/**
 * Audit Logs Constants and Mock Data
 * Centralized location for all audit-related static data
 */

// User mapping for display purposes
export const USER_MAPPING = {
  1: "admin@example.com",
  2: "developer1@example.com",
  3: "developer2@example.com"
};

// Resource type mappings to readable names
export const RESOURCE_TYPE_MAPPING = {
  "application": "Application",
  "app": "Application",
  "space": "Workspace",
  "deployment": "Deployment",
  "storage": "Storage",
  "volume": "Volume",
  "instance": "Instance",
  "user": "User",
  "organization": "Organization",
  "provider": "Provider"
};

// Action type mappings to readable descriptions
export const ACTION_MAPPING = {
  "create": "Created",
  "deploy": "Deployed",
  "delete": "Deleted",
  "update": "Updated",
  "start": "Started",
  "stop": "Stopped",
  "restart": "Restarted",
  "scale": "Scaled",
  "login": "Logged in",
  "logout": "Logged out",
  "view": "Viewed",
  "configure": "Configured"
};

// Event type filters configuration
export const EVENT_TYPE_FILTERS = [
  { 
    id: 'login', 
    label: 'LOGIN', 
    color: 'bg-green-500/10 text-green-400 border border-green-500/20' 
  },
  { 
    id: 'security', 
    label: 'SECURITY', 
    color: 'bg-red-500/10 text-red-400 border border-red-500/20' 
  },
  { 
    id: 'permission', 
    label: 'PERMISSION', 
    color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
  },
  { 
    id: 'api_key', 
    label: 'API KEY', 
    color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
  }
];

// Default selected event types
export const DEFAULT_SELECTED_EVENT_TYPES = [
  'login', 'deletion', 'permission', 'api_key', 'setting', 'deployment', 'access', 'security'
];

// Time range options
export const TIME_RANGE_OPTIONS = [
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' }
];

// Source options for filtering
export const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'console', label: 'Console' },
  { value: 'api', label: 'API' },
  { value: 'cli', label: 'CLI' },
  { value: 'github', label: 'GitHub Actions' }
];

// Sample saved filters
export const SAVED_FILTERS = [
  { 
    id: 1, 
    name: 'Security Events', 
    query: 'eventType:security', 
    createdBy: 'john.doe@example.com', 
    lastRun: '1 hour ago' 
  },
  { 
    id: 2, 
    name: 'Failed Deployments', 
    query: 'eventType:deployment action:"failed"', 
    createdBy: 'admin@example.com', 
    lastRun: '3 hours ago' 
  },
  { 
    id: 3, 
    name: 'Permission Changes', 
    query: 'eventType:permission', 
    createdBy: 'sarah.williams@example.com', 
    lastRun: '2 days ago' 
  }
];

// Severity configuration
export const SEVERITY_CONFIG = {
  high: {
    color: 'bg-red-500/10 text-red-400',
    bgColor: 'bg-red-500',
    actions: ['delete']
  },
  medium: {
    color: 'bg-yellow-500/10 text-yellow-400',
    bgColor: 'bg-yellow-500',
    actions: ['deploy', 'stop', 'restart']
  },
  low: {
    color: 'bg-green-500/10 text-green-400',
    bgColor: 'bg-blue-500',
    actions: [] // Default for all other actions
  }
};

// Default pagination configuration
export const DEFAULT_PAGINATION = {
  page: 1,
  per_page: 10,
  total_count: 0,
  total_pages: 0
};
