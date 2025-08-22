/**
 * Instance Constants and Configuration
 * Centralized location for instance-related static data
 */

// Instance status mappings
export const INSTANCE_STATUS_MAPPING = {
  running: {
    label: 'Running',
    color: 'text-green-500',
    icon: 'CheckCircle'
  },
  warning: {
    label: 'Warning',
    color: 'text-yellow-500',
    icon: 'AlertTriangle'
  },
  stopped: {
    label: 'Stopped',
    color: 'text-red-500',
    icon: 'XCircle'
  }
};

// Instance actions configuration
export const INSTANCE_ACTIONS = {
  start: {
    label: 'Start',
    icon: 'CheckCircle',
    variant: 'success',
    tooltip: 'Start instance'
  },
  stop: {
    label: 'Stop',
    icon: 'XCircle',
    variant: 'danger',
    tooltip: 'Stop instance'
  },
  restart: {
    label: 'Restart',
    icon: 'RefreshCw',
    variant: 'info',
    tooltip: 'Restart instance'
  },
  terminal: {
    label: 'Console',
    icon: 'Terminal',
    variant: 'secondary',
    tooltip: 'Open terminal'
  }
};

// Page size options for instances pagination
export const INSTANCE_PAGE_SIZES = [
  { value: 5, label: '5 per page' },
  { value: 10, label: '10 per page' },
  { value: 20, label: '20 per page' },
  { value: 50, label: '50 per page' }
];

// Auto refresh interval (30 seconds)
export const INSTANCE_REFRESH_INTERVAL = 30000;

// Default pagination settings
export const DEFAULT_INSTANCE_PAGINATION = {
  page: 0,
  pageSize: 10
};

// Auto scaling configuration mock data
export const AUTO_SCALING_CONFIG = {
  status: 'Enabled',
  minInstances: 2,
  maxInstances: 8,
  scaleUp: '75% CPU for 5min',
  scaleDown: '30% CPU for 10min'
};

// Health check configuration mock data
export const HEALTH_CHECK_CONFIG = {
  status: 'Passing',
  endpoint: '/health',
  interval: '30 seconds',
  timeout: '5 seconds',
  successCodes: '200-299'
};

// Terminal connection status configurations
export const TERMINAL_STATUS = {
  connecting: {
    label: 'Connecting...',
    color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    indicator: 'bg-yellow-500'
  },
  connected: {
    label: 'Connected',
    color: 'bg-green-500/10 text-green-400 border border-green-500/20',
    indicator: 'bg-green-500'
  },
  disconnected: {
    label: 'Disconnected',
    color: 'bg-red-500/10 text-red-400 border border-red-500/20',
    indicator: 'bg-red-500'
  }
};
