/**
 * Mock Charts and Query Data
 * Contains mock data for charts, queries, and dashboard widgets
 */

// Widget types for dashboard
export const WIDGET_TYPES = {
  METRIC: 'metric',
  LINE_CHART: 'line_chart',
  BAR_CHART: 'bar_chart',
  PIE_CHART: 'pie_chart',
  STATUS: 'status',
  TABLE: 'table',
};

// Demo queries for charts
export const DEMO_QUERIES = [
  { id: 'cpu', name: 'CPU Utilization', query: 'SELECT AVG(cpu_util) FROM system WHERE time > now() - 24h GROUP BY time(1h)' },
  { id: 'memory', name: 'Memory Usage', query: 'SELECT AVG(memory_used) FROM system WHERE time > now() - 24h GROUP BY time(1h)' },
  { id: 'network', name: 'Network Traffic', query: 'SELECT SUM(bytes_in), SUM(bytes_out) FROM network WHERE time > now() - 24h GROUP BY time(1h)' },
  { id: 'errors', name: 'Error Rate', query: 'SELECT COUNT(error) FROM logs WHERE time > now() - 24h GROUP BY time(1h)' },
  { id: 'requests', name: 'API Requests', query: 'SELECT COUNT(*) FROM api_logs WHERE time > now() - 24h GROUP BY endpoint, time(1h)' },
  { id: 'latency', name: 'API Latency', query: 'SELECT AVG(response_time) FROM api_logs WHERE time > now() - 24h GROUP BY endpoint' },
  { id: 'disk', name: 'Disk Usage', query: 'SELECT last(used_percent) FROM disk WHERE time > now() - 1h GROUP BY path' },
  { id: 'users', name: 'Active Users', query: 'SELECT COUNT(DISTINCT user_id) FROM sessions WHERE time > now() - 24h GROUP BY time(1h)' },
];

// Generate random time series data
export const generateTimeSeriesData = (hours = 24, min = 10, max = 100, trend = 'random') => {
  const now = new Date();
  const data = [];
  
  let value = Math.floor(Math.random() * (max - min) + min);
  
  for (let i = 0; i < hours; i++) {
    const time = new Date(now);
    time.setHours(now.getHours() - (hours - i));
    
    // Apply trend
    if (trend === 'up') {
      value = Math.min(max, value + Math.floor(Math.random() * 10));
    } else if (trend === 'down') {
      value = Math.max(min, value - Math.floor(Math.random() * 10));
    } else {
      const change = Math.floor(Math.random() * 20) - 10;
      value = Math.max(min, Math.min(max, value + change));
    }
    
    data.push({
      time: time.toISOString(),
      value,
    });
  }
  
  return data;
};

// Generate mock data for a query
export const generateMockDataForQuery = (queryId) => {
  switch (queryId) {
    case 'cpu':
      return {
        type: 'time_series',
        data: generateTimeSeriesData(24, 20, 80, 'random'),
        unit: '%',
        format: 'percent',
      };
    case 'memory':
      return {
        type: 'time_series',
        data: generateTimeSeriesData(24, 40, 90, 'up'),
        unit: '%',
        format: 'percent',
      };
    case 'network':
      return {
        type: 'multi_time_series',
        data: [
          {
            name: 'Inbound',
            values: generateTimeSeriesData(24, 1000, 5000, 'random'),
          },
          {
            name: 'Outbound',
            values: generateTimeSeriesData(24, 500, 3000, 'random'),
          }
        ],
        unit: 'MB/s',
        format: 'bytes',
      };
    case 'errors':
      return {
        type: 'time_series',
        data: generateTimeSeriesData(24, 0, 50, 'down'),
        unit: 'errors',
        format: 'number',
      };
    case 'requests':
      return {
        type: 'multi_time_series',
        data: [
          {
            name: '/api/v1/users',
            values: generateTimeSeriesData(24, 100, 500, 'random'),
          },
          {
            name: '/api/v1/products',
            values: generateTimeSeriesData(24, 200, 800, 'random'),
          },
          {
            name: '/api/v1/orders',
            values: generateTimeSeriesData(24, 50, 300, 'random'),
          }
        ],
        unit: 'requests',
        format: 'number',
      };
    case 'latency':
      return {
        type: 'categorical',
        data: [
          { category: '/api/v1/users', value: Math.random() * 200 + 50 },
          { category: '/api/v1/products', value: Math.random() * 300 + 80 },
          { category: '/api/v1/orders', value: Math.random() * 500 + 100 },
          { category: '/api/v1/auth', value: Math.random() * 150 + 30 },
          { category: '/api/v1/checkout', value: Math.random() * 600 + 200 },
        ],
        unit: 'ms',
        format: 'time',
      };
    case 'disk':
      return {
        type: 'categorical',
        data: [
          { category: '/', value: Math.random() * 30 + 10 },
          { category: '/var', value: Math.random() * 40 + 30 },
          { category: '/home', value: Math.random() * 60 + 20 },
          { category: '/tmp', value: Math.random() * 20 + 5 },
        ],
        unit: '%',
        format: 'percent',
      };
    case 'users':
      return {
        type: 'time_series',
        data: generateTimeSeriesData(24, 500, 2000, 'up'),
        unit: 'users',
        format: 'number',
      };
    default:
      return {
        type: 'time_series',
        data: generateTimeSeriesData(),
        unit: '',
        format: 'number',
      };
  }
};

// Default widgets for dashboard
export const DEFAULT_DASHBOARD_WIDGETS = [
  { id: 'w1', type: WIDGET_TYPES.METRIC, title: 'CPU Utilization', query: 'cpu' },
  { id: 'w2', type: WIDGET_TYPES.LINE_CHART, title: 'Memory Usage', query: 'memory' },
  { id: 'w3', type: WIDGET_TYPES.LINE_CHART, title: 'Network Traffic', query: 'network' },
  { id: 'w4', type: WIDGET_TYPES.BAR_CHART, title: 'API Latency', query: 'latency' },
  { id: 'w5', type: WIDGET_TYPES.PIE_CHART, title: 'Disk Usage', query: 'disk' },
  { id: 'w6', type: WIDGET_TYPES.LINE_CHART, title: 'Active Users', query: 'users' },
];

// Color schemes for charts
export const COLOR_SCHEMES = {
  blue: ['#3b82f6', '#1d4ed8'],
  green: ['#10b981', '#047857'], 
  purple: ['#8b5cf6', '#6d28d9'],
  orange: ['#f59e0b', '#d97706'],
  red: ['#ef4444', '#dc2626'],
  multi: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
};
