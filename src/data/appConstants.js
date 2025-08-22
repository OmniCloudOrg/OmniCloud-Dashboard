/**
 * Applications and Metrics Constants and Mock Data
 * Centralized location for all app-related static data
 */

// Application pagination defaults
export const APP_PAGINATION_DEFAULTS = {
  perPage: 18,
  pageSizeOptions: [6, 12, 18, 24, 36],
  maxPerPage: 100
};

// Application status configurations
export const APP_STATUS_CONFIG = {
  running: {
    label: 'Running',
    color: 'green',
    icon: 'CheckCircle',
    description: 'Application is running normally'
  },
  stopped: {
    label: 'Stopped',
    color: 'red',
    icon: 'XCircle',
    description: 'Application is stopped'
  },
  pending: {
    label: 'Pending',
    color: 'yellow',
    icon: 'Clock',
    description: 'Application is starting up'
  },
  deploying: {
    label: 'Deploying',
    color: 'blue',
    icon: 'RefreshCw',
    description: 'Application is being deployed'
  },
  error: {
    label: 'Error',
    color: 'red',
    icon: 'AlertCircle',
    description: 'Application has encountered an error'
  },
  warning: {
    label: 'Warning',
    color: 'orange',
    icon: 'AlertTriangle',
    description: 'Application has warnings'
  },
  unknown: {
    label: 'Unknown',
    color: 'gray',
    icon: 'HelpCircle',
    description: 'Application status is unknown'
  }
};

// Filter configurations
export const APP_FILTER_CONFIG = {
  status: {
    label: 'Status',
    options: [
      { value: 'all', label: 'All Status' },
      { value: 'running', label: 'Running' },
      { value: 'stopped', label: 'Stopped' },
      { value: 'pending', label: 'Pending' },
      { value: 'deploying', label: 'Deploying' },
      { value: 'error', label: 'Error' },
      { value: 'warning', label: 'Warning' }
    ]
  },
  region: {
    label: 'Region',
    options: [
      { value: 'all', label: 'All Regions' },
      { value: 'us-east-1', label: 'US East 1' },
      { value: 'us-west-1', label: 'US West 1' },
      { value: 'eu-central-1', label: 'EU Central 1' },
      { value: 'ap-southeast-1', label: 'AP Southeast 1' }
    ]
  },
  git_branch: {
    label: 'Git Branch',
    options: [
      { value: 'all', label: 'All Branches' },
      { value: 'main', label: 'Main' },
      { value: 'develop', label: 'Develop' },
      { value: 'staging', label: 'Staging' },
      { value: 'production', label: 'Production' }
    ]
  }
};

// Mock metrics data generators
export const generateCpuData = () => [
  { time: '12:00', value: 32 },
  { time: '12:10', value: 40 },
  { time: '12:20', value: 45 },
  { time: '12:30', value: 38 },
  { time: '12:40', value: 55 },
  { time: '12:50', value: 62 },
  { time: '13:00', value: 58 },
  { time: '13:10', value: 45 },
  { time: '13:20', value: 40 },
  { time: '13:30', value: 42 },
  { time: '13:40', value: 48 },
  { time: '13:50', value: 50 },
  { time: '14:00', value: 47 }
];

export const generateMemoryData = (cpuData) => 
  cpuData.map(item => ({ time: item.time, value: item.value + 10 }));

export const generateRequestsData = (cpuData) => 
  cpuData.map(item => ({ time: item.time, value: Math.floor(Math.random() * 100 + 150) }));

export const generateResponseTimeData = (cpuData) => 
  cpuData.map(item => ({ time: item.time, value: Math.floor(Math.random() * 100 + 200) }));

// Top routes data
export const TOP_ROUTES = [
  { route: '/api/users', requests: 24500, time: 43 },
  { route: '/api/products', requests: 18200, time: 67 },
  { route: '/api/auth/login', requests: 12300, time: 92 },
  { route: '/api/orders', requests: 9800, time: 120 },
  { route: '/api/dashboard', requests: 6500, time: 156 }
];

// Status codes data
export const STATUS_CODES = [
  { code: '200 OK', count: 68500, color: 'bg-green-500' },
  { code: '201 Created', count: 12300, color: 'bg-green-500' },
  { code: '304 Not Modified', count: 8200, color: 'bg-blue-500' },
  { code: '401 Unauthorized', count: 3600, color: 'bg-yellow-500' },
  { code: '404 Not Found', count: 2100, color: 'bg-yellow-500' },
  { code: '500 Server Error', count: 850, color: 'bg-red-500' }
];

// Metrics time range options
export const METRICS_TIME_RANGES = [
  { value: '1h', label: 'Last 1 hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
];

// Application status filters
export const APP_STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'error', label: 'Error' },
  { value: 'building', label: 'Building' }
];

// Application regions
export const APP_REGIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' }
];

// Git branch filters
export const GIT_BRANCH_FILTERS = [
  { value: 'all', label: 'All Branches' },
  { value: 'main', label: 'main' },
  { value: 'develop', label: 'develop' },
  { value: 'staging', label: 'staging' }
];
