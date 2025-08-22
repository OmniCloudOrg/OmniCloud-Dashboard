/**
 * Mock Logs Data
 * Contains mock data for logs dashboard including log levels, services, and metrics
 */

// Tabs configuration for logs
export const LOGS_TABS = [
  { id: 'live', label: 'Live Logs', icon: 'Terminal' },
  { id: 'structured', label: 'Structured View', icon: 'BarChart2' },
  { id: 'insights', label: 'Insights', icon: 'AlertCircle' }
];

// Log level counts for metrics
export const LOG_LEVEL_COUNTS = {
  total: 250,
  error: 15,
  warn: 35,
  info: 150,
  debug: 50
};

// Log level colors and priorities
export const LOG_LEVELS = {
  error: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    priority: 4,
    label: 'ERROR'
  },
  warn: {
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/10',
    priority: 3,
    label: 'WARN'
  },
  info: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10', 
    priority: 2,
    label: 'INFO'
  },
  debug: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    priority: 1,
    label: 'DEBUG'
  }
};

// Services that generate logs
export const LOG_SERVICES = [
  { id: 'api-server', name: 'API Server', status: 'healthy', logCount: 85 },
  { id: 'database', name: 'Database', status: 'healthy', logCount: 62 },
  { id: 'auth-service', name: 'Auth Service', status: 'healthy', logCount: 45 },
  { id: 'payment-service', name: 'Payment Service', status: 'warning', logCount: 28 },
  { id: 'notification-service', name: 'Notification Service', status: 'healthy', logCount: 35 },
  { id: 'file-service', name: 'File Service', status: 'healthy', logCount: 18 },
  { id: 'cache-service', name: 'Cache Service', status: 'healthy', logCount: 12 },
  { id: 'worker-queue', name: 'Worker Queue', status: 'healthy', logCount: 22 }
];

// Sample log entries
export const SAMPLE_LOG_ENTRIES = [
  {
    id: 1,
    timestamp: '2024-01-20T15:30:45.123Z',
    level: 'error',
    service: 'api-server',
    message: 'Database connection timeout after 30 seconds',
    metadata: {
      userId: 'user_123',
      endpoint: '/api/v1/users',
      duration: 30000,
      error_code: 'DB_TIMEOUT'
    }
  },
  {
    id: 2,
    timestamp: '2024-01-20T15:30:42.567Z',
    level: 'warn',
    service: 'payment-service',
    message: 'Payment processing took longer than expected',
    metadata: {
      paymentId: 'pay_456',
      duration: 5200,
      threshold: 5000
    }
  },
  {
    id: 3,
    timestamp: '2024-01-20T15:30:40.890Z',
    level: 'info',
    service: 'auth-service',
    message: 'User successfully authenticated',
    metadata: {
      userId: 'user_789',
      method: 'oauth2',
      provider: 'google'
    }
  },
  {
    id: 4,
    timestamp: '2024-01-20T15:30:38.456Z',
    level: 'debug',
    service: 'cache-service',
    message: 'Cache hit for key user_profile_123',
    metadata: {
      key: 'user_profile_123',
      ttl: 3600,
      hitRate: 0.85
    }
  }
];

// Log insights and patterns
export const LOG_INSIGHTS = {
  topErrors: [
    { error: 'Database connection timeout', count: 8, trend: 'up' },
    { error: 'Authentication failed', count: 5, trend: 'stable' },
    { error: 'Payment processing failed', count: 3, trend: 'down' },
    { error: 'File upload timeout', count: 2, trend: 'stable' }
  ],
  errorTrends: [
    { hour: '12:00', errors: 2 },
    { hour: '13:00', errors: 4 },
    { hour: '14:00', errors: 3 },
    { hour: '15:00', errors: 8 },
    { hour: '16:00', errors: 5 }
  ],
  serviceHealth: {
    healthy: 7,
    warning: 1,
    critical: 0
  }
};

// Log search filters
export const LOG_SEARCH_FILTERS = {
  timeRanges: [
    { id: '15m', label: 'Last 15 minutes', value: 15 },
    { id: '1h', label: 'Last hour', value: 60 },
    { id: '4h', label: 'Last 4 hours', value: 240 },
    { id: '24h', label: 'Last 24 hours', value: 1440 },
    { id: '7d', label: 'Last 7 days', value: 10080 }
  ],
  levels: ['error', 'warn', 'info', 'debug'],
  services: LOG_SERVICES.map(service => service.id)
};
