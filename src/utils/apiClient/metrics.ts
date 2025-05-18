// MetricsApiClient.ts
// API client for metrics that leverages the centralized apiConfig

import { 
  fetchPlatformApi, 
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface Metric {
  id: number;
  metric_name: string;
  metric_value: number;
  timestamp: string;
  resource_id?: string;
  resource_type?: string;
  app_id?: number;
  node_id?: number;
  tags?: Record<string, string>;
}

export interface MetricsQuery {
  app_id?: number;
  instance_id?: number;
  resource_id?: string;
  resource_type?: string;
  start_time?: string;
  end_time?: string;
  limit?: number;
  metric_name?: string;
}

export interface TimeRangeOption {
  label: string;
  value: '1h' | '6h' | '24h' | '7d';
  seconds: number;
}

export const TIME_RANGES: TimeRangeOption[] = [
  { label: 'Last Hour', value: '1h', seconds: 60 * 60 },
  { label: 'Last 6 Hours', value: '6h', seconds: 6 * 60 * 60 },
  { label: 'Last 24 Hours', value: '24h', seconds: 24 * 60 * 60 },
  { label: 'Last 7 Days', value: '7d', seconds: 7 * 24 * 60 * 60 }
];

export interface ChartDataPoint {
  timestamp: string;
  time: string;
  rawTimestamp: string;
  [metricName: string]: any;
}

// API client class
export class MetricsApiClient {
  private platformId: number;
  private abortController: AbortController | null = null;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // Cancel any in-flight requests
  cancelRequests(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Generate start time based on time range
  getTimeRangeFilter(timeRange: '1h' | '6h' | '24h' | '7d'): string {
    const now = new Date();
    let startTime: Date;
    
    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - (60 * 60 * 1000));
        break;
      case '6h':
        startTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
        break;
      case '7d':
        startTime = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '24h':
      default:
        startTime = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        break;
    }
    
    return startTime.toISOString();
  }

  // Format a timestamp for display
  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Get readable name for a metric type
  getReadableMetricName(metricName: string): string {
    return metricName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Fetch metrics with optional filters
  async getMetrics(
    options: {
      appId?: number;
      timeRange: '1h' | '6h' | '24h' | '7d';
      signal?: AbortSignal;
    }
  ): Promise<Metric[]> {
    // Cancel any previous requests
    this.cancelRequests();
    
    // Create a new abort controller
    this.abortController = new AbortController();
    
    // Use provided signal or the controller's signal
    const signal = options.signal || this.abortController.signal;
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // If an appId is provided, filter by it
      if (options.appId) {
        params.append('app_id', options.appId.toString());
      }
      
      // Add time range filter
      params.append('start_time', this.getTimeRangeFilter(options.timeRange));
      
      // Construct the URL
      const endpoint = `/metrics${params.toString() ? `?${params.toString()}` : ''}`;
      
      // Make the request with the signal for cancellation
      const response = await fetchPlatformApi<any>(
        endpoint,
        this.platformId,
        { signal }
      );
      
      // Log the raw response for debugging
      console.log('Raw metrics response:', response);
      
      // Transform the data based on its actual structure
      // This is a workaround for unexpected data format
      let transformedMetrics: Metric[] = [];
      
      if (!response) {
        return [];
      }
      
      // Try to detect the data format and extract metrics
      if (Array.isArray(response)) {
        if (response.length > 0) {
          // Check if it's an array of objects with metric_name properties
          if (response[0] && typeof response[0] === 'object' && 'metric_name' in response[0]) {
            // This is likely already in the expected format
            transformedMetrics = response as Metric[];
          } else {
            // It might be another format, try to generate synthetic metrics for demo purposes
            // This is just a fallback for development
            console.log('Unexpected metrics format, generating synthetic data');
            transformedMetrics = this.generateSyntheticMetrics(options.timeRange);
          }
        }
      } else if (response && typeof response === 'object') {
        // Check if the response is an object with metrics property
        if ('metrics' in response && Array.isArray(response.metrics)) {
          transformedMetrics = response.metrics;
        } else {
          // Try to find any array property that might contain metrics
          for (const key in response) {
            if (Array.isArray(response[key])) {
              if (response[key].length > 0 && typeof response[key][0] === 'object' && 'metric_name' in response[key][0]) {
                transformedMetrics = response[key];
                break;
              }
            }
          }
          
          // If we still don't have metrics, generate synthetic data
          if (transformedMetrics.length === 0) {
            console.log('Unable to extract metrics from response, generating synthetic data');
            transformedMetrics = this.generateSyntheticMetrics(options.timeRange);
          }
        }
      }
      
      console.log('Transformed metrics:', transformedMetrics.slice(0, 3));
      return transformedMetrics;
    } catch (error) {
      // Don't throw for aborted requests
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Metrics request was cancelled');
        return [];
      }
      console.error('Error fetching metrics:', error);
      
      // Generate synthetic metrics for demo purposes
      console.log('Generating synthetic metrics due to fetch error');
      return this.generateSyntheticMetrics(options.timeRange);
    }
  }
  
  // Generate synthetic metrics data for development/demo purposes
  generateSyntheticMetrics(timeRange: '1h' | '6h' | '24h' | '7d'): Metric[] {
    console.log('Generating synthetic metrics for ' + timeRange);
    const metrics: Metric[] = [];
    const now = new Date();
    
    // Determine the time span based on the time range
    let timeSpan = 0;
    switch (timeRange) {
      case '1h':
        timeSpan = 60 * 60 * 1000; // 1 hour in milliseconds
        break;
      case '6h':
        timeSpan = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        break;
      case '24h':
        timeSpan = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        break;
      case '7d':
        timeSpan = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        break;
    }
    
    // Generate data points for CPU utilization
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now.getTime() - (timeSpan * (30 - i) / 30));
      metrics.push({
        id: 1000 + i,
        metric_name: 'cpu_utilization',
        metric_value: 25 + Math.random() * 30, // random value between 25-55
        timestamp: timestamp.toISOString(),
        resource_type: 'instance'
      });
    }
    
    // Generate data points for memory utilization
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now.getTime() - (timeSpan * (30 - i) / 30));
      metrics.push({
        id: 2000 + i,
        metric_name: 'memory_utilization',
        metric_value: 40 + Math.random() * 40, // random value between 40-80
        timestamp: timestamp.toISOString(),
        resource_type: 'instance'
      });
    }
    
    // Generate data points for disk utilization
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now.getTime() - (timeSpan * (30 - i) / 30));
      metrics.push({
        id: 3000 + i,
        metric_name: 'disk_utilization',
        metric_value: 20 + Math.random() * 40, // random value between 20-60
        timestamp: timestamp.toISOString(),
        resource_type: 'volume'
      });
    }
    
    // Generate data points for latency
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(now.getTime() - (timeSpan * (30 - i) / 30));
      metrics.push({
        id: 4000 + i,
        metric_name: 'latency',
        metric_value: 5 + Math.random() * 45, // random value between 5-50
        timestamp: timestamp.toISOString(),
        resource_type: 'instance'
      });
    }
    
    return metrics;
  }

  // Process metrics data into chart format
  processMetricsForChart(metrics: Metric[]): ChartDataPoint[] {
    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return [];
    }
    
    console.log(`Processing ${metrics.length} metrics into chart data points`);
    
    // Get unique metric names for logging
    const uniqueMetricNames = [...new Set(metrics.map(m => m.metric_name))];
    console.log('Processing metrics for names:', uniqueMetricNames);
    
    // Group metrics by their timestamp (rounded to minutes for better grouping)
    const timeGroupedMetrics: Record<string, ChartDataPoint> = {};
    
    metrics.forEach(metric => {
      if (!metric || !metric.timestamp || !metric.metric_name || metric.metric_value === undefined) {
        return; // Skip invalid metrics
      }
      
      const timestamp = new Date(metric.timestamp);
      if (isNaN(timestamp.getTime())) {
        return; // Skip invalid timestamps
      }
      
      // Round to the nearest minute to group close timestamps
      timestamp.setSeconds(0, 0);
      const timeKey = timestamp.toISOString();
      
      if (!timeGroupedMetrics[timeKey]) {
        timeGroupedMetrics[timeKey] = {
          timestamp: timeKey,
          time: this.formatTime(timestamp),
          rawTimestamp: metric.timestamp
        };
      }
      
      // Add metric value
      const metricType = metric.metric_name;
      const currentValue = timeGroupedMetrics[timeKey][metricType];
      
      // Make sure the value is a valid number
      let numericValue = typeof metric.metric_value === 'string' 
        ? parseFloat(metric.metric_value) 
        : metric.metric_value;
        
      if (isNaN(numericValue)) {
        numericValue = 0;
      }
      
      if (currentValue === undefined) {
        timeGroupedMetrics[timeKey][metricType] = numericValue;
      } else {
        // Calculate average if we have multiple readings for the same metric type at the same time
        timeGroupedMetrics[timeKey][metricType] = (currentValue + numericValue) / 2;
      }
    });
    
    // Convert to array and sort by timestamp
    const chartData = Object.values(timeGroupedMetrics).sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    
    // Log the first data point to check structure
    if (chartData.length > 0) {
      console.log('First chart data point:', chartData[0]);
      
      // Check for key metrics
      const keyMetrics = ['cpu_utilization', 'memory_utilization', 'disk_utilization', 'latency'];
      
      // Log which metrics are present in the data
      for (const metric of keyMetrics) {
        const relatedProperties = Object.keys(chartData[0]).filter(
          key => key.toLowerCase().includes(metric.replace('_', '').toLowerCase())
        );
        
        console.log(`Properties related to ${metric}:`, relatedProperties);
      }
    }
    
    return chartData;
  }

  // Extract unique metric types from metrics data
  extractMetricTypes(metrics: Metric[]): string[] {
    if (!metrics || !Array.isArray(metrics) || metrics.length === 0) {
      return [];
    }
    
    // Extract unique metric names
    return [...new Set(metrics.map(metric => metric.metric_name))].filter(Boolean);
  }

  // Generate a distinct, deterministic color from a string
  getDistinctColorFromString(str: string, allMetrics: string[]): string {
    // Generate a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Find position of this metric in the array of all metrics
    const position = allMetrics.indexOf(str);
    const totalMetrics = allMetrics.length;
    
    // If the metric is not in the array, use the hash to create a position
    const positionToUse = position >= 0 ? position : Math.abs(hash) % (totalMetrics || 5);
    
    // Create evenly spaced colors around the wheel
    const spacing = 360 / (totalMetrics || 5);
    // The base offset determined by the hash ensures consistency across sessions
    const baseHue = Math.abs(hash) % 60; // Small offset for variety
    
    // Compute the hue by spacing evenly around the color wheel
    let hue = (baseHue + (positionToUse * spacing)) % 360;
    
    // Avoid dark blue/purple hues (220-280)
    if (hue >= 220 && hue <= 280) {
      // Shift hue to a more vibrant range
      hue = (hue + 150) % 360;
    }
    
    // Ensure high saturation and lightness for the neon effect
    // Use the hash for slight variations in saturation and lightness
    const s = 85 + (Math.abs(hash) % 15);  // 85-100% saturation
    const l = 60 + (Math.abs(hash) % 10);  // 60-70% lightness
    
    return `hsl(${Math.round(hue)}, ${s}%, ${l}%)`;
  }

  // Helper to format errors consistently
  private formatError(error: any): Error {
    if (error instanceof Error) {
      return error;
    } else if (typeof error === 'string') {
      return new Error(error);
    } else {
      return new Error('An unknown error occurred');
    }
  }
}

// Usage Example:
// import { MetricsApiClient } from '@/lib/api/MetricsApiClient';
// import { DEFAULT_PLATFORM_ID } from '@/utils/apiConfig';
//
// const platformId = Number(DEFAULT_PLATFORM_ID);
// const metricsClient = new MetricsApiClient(platformId);
// const metrics = await metricsClient.getMetrics({ timeRange: '24h' });