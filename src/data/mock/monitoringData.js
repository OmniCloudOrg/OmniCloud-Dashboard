/**
 * Mock Monitoring Data
 * Contains mock data for monitoring dashboard including alerts, dashboards, and metrics
 */

// Sample data for charts
export const MONITORING_CHART_DATA = {
  cpu: [40, 45, 50, 55, 60, 65, 60, 55, 50, 45, 40, 35],
  memory: [65, 70, 75, 80, 85, 82, 80, 78, 75, 73, 70, 68],
  disk: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52],
  network: [120, 150, 180, 210, 240, 270, 300, 330, 300, 270, 240, 210]
};

// Overview chart data (used for the main overview chart in monitoring dashboard)
export const MONITORING_OVERVIEW_CHART_DATA = [
  { time: '00:00', cpu: 30, memory: 65, disk: 40, network: 120 },
  { time: '02:00', cpu: 32, memory: 68, disk: 41, network: 150 },
  { time: '04:00', cpu: 35, memory: 70, disk: 42, network: 180 },
  { time: '06:00', cpu: 40, memory: 72, disk: 44, network: 210 },
  { time: '08:00', cpu: 45, memory: 75, disk: 45, network: 240 },
  { time: '10:00', cpu: 50, memory: 78, disk: 46, network: 270 },
  { time: '12:00', cpu: 60, memory: 80, disk: 48, network: 300 },
  { time: '14:00', cpu: 55, memory: 79, disk: 49, network: 330 },
  { time: '16:00', cpu: 50, memory: 72, disk: 50, network: 300 },
  { time: '18:00', cpu: 45, memory: 70, disk: 51, network: 270 },
  { time: '20:00', cpu: 40, memory: 68, disk: 52, network: 240 },
  { time: '22:00', cpu: 35, memory: 66, disk: 50, network: 210 }
];

// Sample alerts data
export const MONITORING_ALERTS = [
  {
    id: 1,
    title: 'High CPU Utilization',
    severity: 'critical',
    message: 'Instance i-0abc123def456 has CPU usage above 90% for 15 minutes',
    service: 'API Server',
    time: '10 minutes ago'
  },
  {
    id: 2,
    title: 'Memory Usage Warning',
    severity: 'warning',
    message: 'Database instance db-789xyz has memory usage above 85% for 10 minutes',
    service: 'Database',
    time: '25 minutes ago'
  },
  {
    id: 3,
    title: 'API Response Time Increased',
    severity: 'warning',
    message: 'Average API response time is 450ms, above the 300ms threshold',
    service: 'API Gateway',
    time: '40 minutes ago'
  },
  {
    id: 4,
    title: 'Disk Space Low',
    severity: 'warning',
    message: 'Storage volume vol-abc123 has less than 15% free space remaining',
    service: 'Storage',
    time: '1 hour ago'
  },
  {
    id: 5,
    title: 'Daily Backup Completed',
    severity: 'info',
    message: 'Scheduled daily backup completed successfully. Size: 42.7 GB',
    service: 'Backup',
    time: '2 hours ago'
  }
];

// Sample dashboards data  
export const MONITORING_DASHBOARDS = [
  {
    id: 1,
    name: 'Infrastructure Overview',
    starred: true,
    updatedAt: '2 days ago',
    chartData: [
      { name: '00:00', cpu: 30, memory: 65, disk: 40 },
      { name: '04:00', cpu: 35, memory: 70, disk: 42 },
      { name: '08:00', cpu: 45, memory: 75, disk: 45 },
      { name: '12:00', cpu: 60, memory: 80, disk: 48 },
      { name: '16:00', cpu: 50, memory: 72, disk: 50 },
      { name: '20:00', cpu: 40, memory: 68, disk: 52 }
    ]
  },
  {
    id: 2,
    name: 'Application Performance',
    starred: false,
    updatedAt: '5 days ago',
    chartData: [
      { name: 'Mon', latency: 120, throughput: 850, errors: 5 },
      { name: 'Tue', latency: 110, throughput: 900, errors: 2 },
      { name: 'Wed', latency: 130, throughput: 950, errors: 8 },
      { name: 'Thu', latency: 100, throughput: 1000, errors: 3 },
      { name: 'Fri', latency: 90, throughput: 1100, errors: 1 },
      { name: 'Sat', latency: 80, throughput: 700, errors: 0 },
      { name: 'Sun', latency: 75, throughput: 650, errors: 0 }
    ]
  },
  {
    id: 3,
    name: 'Database Metrics',
    starred: true,
    updatedAt: '1 week ago',
    chartData: [
      { name: '6h', connections: 45, queries: 1200, cache: 85 },
      { name: '12h', connections: 52, queries: 1400, cache: 82 },
      { name: '18h', connections: 48, queries: 1350, cache: 87 },
      { name: '24h', connections: 41, queries: 1100, cache: 90 }
    ]
  },
  {
    id: 4,
    name: 'Network Analytics',
    starred: false,
    updatedAt: '3 days ago',
    chartData: [
      { name: 'Jan', inbound: 2400, outbound: 1800, latency: 20 },
      { name: 'Feb', inbound: 2600, outbound: 1900, latency: 22 },
      { name: 'Mar', inbound: 2800, outbound: 2100, latency: 18 },
      { name: 'Apr', inbound: 3200, outbound: 2400, latency: 25 }
    ]
  }
];

// Dashboard preview data (used in monitoring page)
export const MONITORING_DASHBOARD_PREVIEWS = [
  {
    id: 1,
    name: 'Infrastructure Overview',
    starred: true,
    updatedAt: '2 days ago',
    chartData: [
      { name: '00:00', cpu: 30, memory: 65, disk: 40 },
      { name: '04:00', cpu: 35, memory: 70, disk: 42 },
      { name: '08:00', cpu: 45, memory: 75, disk: 45 },
      { name: '12:00', cpu: 60, memory: 80, disk: 48 },
      { name: '16:00', cpu: 50, memory: 72, disk: 50 },
      { name: '20:00', cpu: 40, memory: 68, disk: 52 }
    ]
  },
  {
    id: 2,
    name: 'Application Performance',
    starred: false,
    updatedAt: '5 days ago',
    chartData: [
      { name: 'Mon', latency: 120, throughput: 850, errors: 5 },
      { name: 'Tue', latency: 110, throughput: 900, errors: 2 },
      { name: 'Wed', latency: 130, throughput: 950, errors: 8 },
      { name: 'Thu', latency: 100, throughput: 1000, errors: 3 },
      { name: 'Fri', latency: 90, throughput: 1100, errors: 1 },
      { name: 'Sat', latency: 80, throughput: 700, errors: 0 },
      { name: 'Sun', latency: 75, throughput: 650, errors: 0 }
    ]
  },
  {
    id: 3,
    name: 'Database Metrics',
    starred: true,
    updatedAt: '1 week ago',
    chartData: [
      { name: 'Queries', a: 3500, b: 4500 },
      { name: 'Writes', a: 2200, b: 2800 },
      { name: 'Reads', a: 1800, b: 2400 },
      { name: 'Cache', a: 5200, b: 6800 }
    ]
  }
];

// Monitoring tab configuration
export const MONITORING_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'dashboards', label: 'Dashboards' },
  { id: 'metrics', label: 'Metrics' }
];

// Time range options
export const TIME_RANGE_OPTIONS = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' }
];

// Service types for filtering
export const SERVICE_TYPES = [
  'API Server',
  'Database', 
  'API Gateway',
  'Storage',
  'Backup',
  'Cache',
  'Load Balancer',
  'CDN'
];

// Severity levels
export const SEVERITY_LEVELS = [
  'critical',
  'warning', 
  'info',
  'success'
];
