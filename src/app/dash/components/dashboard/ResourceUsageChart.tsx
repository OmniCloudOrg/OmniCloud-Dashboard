"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  MetricsApiClient, 
  Metric, 
  ChartDataPoint, 
  TIME_RANGES 
} from '@/utils/apiClient/metrics';
import { DEFAULT_PLATFORM_ID } from '@/utils/apiConfig';

interface MetricConfig {
  color: string;
  gradientId: string;
  name: string;
  active: boolean;
}

interface ResourceUsageChartProps {
  platformId: number | null;
  appId?: number | null;
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({ platformId, appId }) => {
  // API Client
  const [apiClient, setApiClient] = useState<MetricsApiClient | null>(null);

  // State variables
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('7d');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metricTypes, setMetricTypes] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeMetrics, setActiveMetrics] = useState<Record<string, MetricConfig>>({});
  const [animating, setAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);
  
  // Track if we're currently fetching data to prevent duplicate requests
  const isFetchingRef = useRef(false);
  
  // Track the last platform ID to prevent redundant updates
  const lastPlatformIdRef = useRef<number | null>(null);
  
  // Track the last time range to prevent redundant fetches
  const lastTimeRangeRef = useRef<string | null>(null);

  // Initialize API client when platformId changes
  useEffect(() => {
    if (platformId && platformId !== lastPlatformIdRef.current) {
      // Create a new client when platform changes
      const client = new MetricsApiClient(platformId);
      setApiClient(client);
      
      // Reset state for the new platform
      setMetrics([]);
      setChartData([]);
      setError(null);
      
      // Update last platform ID ref
      lastPlatformIdRef.current = platformId;
    }
  }, [platformId]);
  
  // Add CSS for animations
  useEffect(() => {
    // Add a style tag for our animations if it doesn't exist
    if (typeof window !== 'undefined' && !document.getElementById('chart-animations-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'chart-animations-style';
      styleEl.innerHTML = `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .legend-transition {
          animation: pulse 0.5s ease-in-out;
        }
        .chart-container {
          transition: opacity 0.5s ease, filter 0.5s ease;
          will-change: opacity, filter;
        }
        .chart-container.loading {
          opacity: 0.6;
          filter: blur(1px);
        }
        .recharts-layer {
          transition: opacity 0.3s ease;
        }
        .legend-item {
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .legend-item:hover {
          transform: scale(1.05);
        }
        .legend-item.inactive {
          opacity: 0.5;
          filter: saturate(0.7);
        }
        .legend-item.active {
          opacity: 1;
          filter: saturate(1.2);
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);
  
  // Function to format the time from full ISO date
  const formatTime = (timestamp: string): string => {
    if (!apiClient) return '';
    return apiClient.formatTime(timestamp);
  };
  
  // Function to get a display label for the time range
  const getTimeRangeLabel = (): string => {
    const range = TIME_RANGES.find(r => r.value === timeRange);
    return range ? range.label : 'Last 7 Days';
  };
  
  // Get readable name for a metric type
  const getReadableMetricName = (metricName: string): string => {
    if (!apiClient) return metricName;
    return apiClient.getReadableMetricName(metricName);
  };
  
  // Initialize metrics with colors and gradients - only enable key metrics by default
  useEffect(() => {
    if (!apiClient || metricTypes.length === 0) return;
    
    // Only initialize if we don't already have these metrics configured
    const newMetricTypes = metricTypes.filter(metric => !activeMetrics[metric]);
    
    if (newMetricTypes.length === 0) return;
    
    const metricConfig: Record<string, MetricConfig> = { ...activeMetrics };
    
    // Define key metrics that should be enabled by default
    const keyMetrics = ['cpu_utilization', 'memory_utilization', 'disk_utilization', 'latency'];
    
    newMetricTypes.forEach(metric => {
      const color = apiClient.getDistinctColorFromString(metric, metricTypes);
      const gradientId = `color${metric.replace(/_/g, '')}`;
      
      metricConfig[metric] = {
        color,
        gradientId,
        name: getReadableMetricName(metric),
        // Only enable key metrics by default, but keep existing config if it exists
        active: keyMetrics.includes(metric) 
      };
    });
    
    setActiveMetrics(metricConfig);
  }, [apiClient, metricTypes, activeMetrics]);
  
  // Fetch metrics from API with debouncing and cancellation
  const fetchMetrics = useCallback(async () => {
    // Skip if no client, no platform, or if already fetching
    if (!apiClient || !platformId || isFetchingRef.current) return;
    
    // Skip if time range hasn't changed and we've already fetched this combination
    if (timeRange === lastTimeRangeRef.current && platformId === lastPlatformIdRef.current && metrics.length > 0) return;
    
    // Update refs to prevent redundant fetches
    lastTimeRangeRef.current = timeRange;
    lastPlatformIdRef.current = platformId;
    
    // Set fetching flag to prevent duplicate requests
    isFetchingRef.current = true;
    
    // Show loading state
    setLoading(true);
    setAnimating(true);
    setError(null);
    
    try {
      // Cancel any previous requests
      apiClient.cancelRequests();
      
      // Fetch metrics data
      const metricsData = await apiClient.getMetrics({
        appId: appId || undefined,
        timeRange
      });
      
      if (!metricsData || metricsData.length === 0) {
        setMetrics([]);
        setMetricTypes([]);
        // Add a slight delay before removing loading state for smooth transition
        setTimeout(() => {
          setLoading(false);
          setAnimating(false);
        }, 300);
        return;
      }
      
      // Extract unique metric types
      const types = apiClient.extractMetricTypes(metricsData);
      
      // Update states
      setMetrics(metricsData);
      setMetricTypes(types);
      setError(null);
      
      // Add a slight delay before removing loading state for smooth transition
      setTimeout(() => {
        setLoading(false);
        setAnimating(false);
      }, 300);
      
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load metrics data. Please try again later.');
      setLoading(false);
      setAnimating(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [apiClient, timeRange, appId, platformId, metrics.length]);
  
  // Fetch metrics when time range changes
  useEffect(() => {
    if (apiClient && platformId) {
      fetchMetrics();
    }
  }, [apiClient, timeRange, fetchMetrics, platformId]);
  
  // Process the metrics data for the chart with debouncing
  useEffect(() => {
    if (!apiClient || metrics.length === 0) {
      setChartData([]);
      return;
    }
    
    // Debounce the data processing to avoid performance issues with large datasets
    const processTimer = setTimeout(() => {
      const processedData = apiClient.processMetricsForChart(metrics);
      setChartData(processedData);
    }, 50); // Short delay for debouncing
    
    return () => clearTimeout(processTimer);
  }, [apiClient, metrics]);
  
  // Toggle a metric's visibility with animation
  const toggleMetric = (metricName: string) => {
    setActiveMetrics(prev => ({
      ...prev,
      [metricName]: {
        ...prev[metricName],
        active: !prev[metricName].active
      }
    }));
    
    // Apply smooth transition class to the legend item
    if (typeof document !== 'undefined') {
      const legendItem = document.getElementById(`legend-${metricName}`);
      if (legendItem) {
        legendItem.classList.add('legend-transition');
        setTimeout(() => {
          legendItem.classList.remove('legend-transition');
        }, 500);
      }
    }
  };
  
  // Custom tooltip component
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<any>;
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }
    
    // Filter to only show active metrics
    const activePayload = payload.filter(entry => 
      activeMetrics[entry.dataKey]?.active && 
      entry.value !== undefined && 
      entry.value !== null
    );
    
    if (activePayload.length === 0) return null;
    
    return (
      <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 shadow-lg text-sm">
        <p className="text-white font-medium mb-2">
          {label}
        </p>
        
        {activePayload.map((entry, index) => {
          const metricName = entry.dataKey;
          if (!activeMetrics[metricName]) return null;
          
          const { color, name } = activeMetrics[metricName];
          return (
            <p key={index} style={{ color: color }} className="mb-1">
              {name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          );
        })}
      </div>
    );
  };
  
  // Filter metrics based on search term
  const filteredMetrics = metricTypes.filter(metricType => {
    if (!activeMetrics[metricType]) return false;
    return activeMetrics[metricType].name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    // Skip in SSR context
    if (typeof document === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      // Close time range dropdown
      const timeDropdown = document.getElementById('time-range-dropdown');
      const timeButton = document.getElementById('time-range-button');
      if (
        timeDropdown &&
        event.target instanceof Node &&
        !timeDropdown.contains(event.target) &&
        !timeButton?.contains(event.target)
      ) {
        timeDropdown.classList.add('hidden');
      }
      
      // Close metrics dropdown
      const metricDropdown = document.getElementById('metric-search-dropdown');
      const metricButton = document.getElementById('metric-search-button');
      if (
        metricDropdown &&
        event.target instanceof Node &&
        !metricDropdown.contains(event.target) &&
        !metricButton?.contains(event.target)
      ) {
        setShowMetricDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending requests when component unmounts
      if (apiClient) {
        apiClient.cancelRequests();
      }
    };
  }, [apiClient]);
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden w-full h-full">
      <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <h3 className="text-lg font-medium text-white">Resource Usage</h3>
        <div className="flex items-center gap-3">
          {/* Metric Search Dropdown */}
          <div className="relative inline-block text-left">
            <button 
              id="metric-search-button"
              type="button" 
              className={`flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm ${!platformId ? 'text-slate-500 opacity-50 cursor-not-allowed' : 'text-white'}`}
              onClick={() => platformId && setShowMetricDropdown(!showMetricDropdown)}
              disabled={!platformId}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Metrics
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                {Object.values(activeMetrics).filter(m => m.active).length}
              </span>
            </button>
            {platformId && showMetricDropdown && (
              <div 
                id="metric-search-dropdown" 
                className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="p-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search metrics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredMetrics.length === 0 ? (
                    <p className="text-slate-400 text-sm p-3 text-center">No metrics found</p>
                  ) : (
                    <div className="py-1">
                      {filteredMetrics.map(metricType => {
                        const { color, name, active } = activeMetrics[metricType];
                        return (
                          <div
                            key={metricType}
                            className={`flex items-center justify-between px-4 py-2 text-sm ${active ? 'text-white' : 'text-slate-400'} hover:bg-slate-700 cursor-pointer`}
                            onClick={() => toggleMetric(metricType)}
                          >
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: color }}
                              ></div>
                              <span>{name}</span>
                            </div>
                            <div className={`w-4 h-4 rounded border ${active ? 'bg-blue-600 border-blue-600' : 'border-slate-600'} flex items-center justify-center`}>
                              {active && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <button
                      className="text-xs text-blue-400 hover:text-blue-300"
                      onClick={() => {
                        const allActive = metricTypes.every(m => activeMetrics[m]?.active);
                        const newState = !allActive;
                        const updatedMetrics: Record<string, MetricConfig> = {};
                        
                        Object.keys(activeMetrics).forEach(metric => {
                          updatedMetrics[metric] = {
                            ...activeMetrics[metric],
                            active: newState
                          };
                        });
                        
                        setActiveMetrics(updatedMetrics);
                      }}
                    >
                      {metricTypes.every(m => activeMetrics[m]?.active) ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      className="text-xs text-slate-400 hover:text-slate-300"
                      onClick={() => setShowMetricDropdown(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Time Range Dropdown */}
          <div className="relative inline-block text-left">
            <button 
              id="time-range-button"
              type="button" 
              className={`flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm ${!platformId ? 'text-slate-500 opacity-50 cursor-not-allowed' : 'text-white'}`}
              onClick={() => {
                if (!platformId) return;
                const dropdown = document.getElementById('time-range-dropdown');
                if (dropdown) {
                  dropdown.classList.toggle('hidden');
                }
              }}
              disabled={!platformId}
            >
              {getTimeRangeLabel()}
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              id="time-range-dropdown" 
              className="hidden absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-10"
            >
              <div className="py-1" role="menu" aria-orientation="vertical">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    className={`block px-4 py-2 text-sm w-full text-left ${timeRange === range.value ? 'text-blue-400' : 'text-white'} hover:bg-slate-700`}
                    role="menuitem"
                    onClick={() => {
                      setTimeRange(range.value);
                      const dropdown = document.getElementById('time-range-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6" style={{ height: 'calc(100% - 110px)' }}>
        {/* Render conditionally based on loading and error states */}
        {!platformId ? (
          <div className="flex justify-center items-center h-80 text-slate-400">
        Select a platform to view resource usage metrics
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-80 text-red-400">
        {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-80 text-slate-400">
        No data available for the selected time range
          </div>
        ) : (
          <>
        <div className={`h-80 chart-container ${animating ? 'loading' : ''}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
          <defs>
            {/* Create gradient definitions for each metric type */}
            {Object.keys(activeMetrics).map(metricType => {
              const { color, gradientId } = activeMetrics[metricType];
              return (
            <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Render an Area for each active metric type */}
          {Object.keys(activeMetrics).map(metricType => {
            if (!activeMetrics[metricType].active) return null;
            
            const { color, gradientId, name } = activeMetrics[metricType];
            return (
              <Area 
            key={metricType}
            type="monotone" 
            dataKey={metricType} 
            name={name} 
            stroke={color} 
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            connectNulls={true}
            dot={false}
            activeDot={{ 
              r: 6, 
              stroke: color, 
              strokeWidth: 2, 
              fill: '#fff' 
            }}
              />
            );
          })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">

          {/* Active Metric Pills (Limited Display) */}
          {Object.keys(activeMetrics)
            .filter(metricType => activeMetrics[metricType].active)
            .slice(0, 10) // Only show first 10 active metrics in the legend
            .map(metricType => {
          const { color, name } = activeMetrics[metricType];
          return (
            <div 
              key={metricType} 
              id={`legend-${metricType}`}
              className="legend-item flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full bg-slate-800/50 hover:bg-slate-800/80 transition-all duration-300"
              onClick={() => toggleMetric(metricType)}
            >
              <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm text-slate-300">{name}</span>
            </div>
          );
          })}
          
          {/* Show count of hidden metrics if there are more than 10 active */}
          {Object.values(activeMetrics).filter(m => m.active).length > 10 && (
            <button
          className="legend-item flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full bg-slate-800/30 hover:bg-slate-800/60 transition-all duration-300"
          onClick={() => setShowMetricDropdown(true)}
            >
          <span className="text-sm text-slate-400">
            +{Object.values(activeMetrics).filter(m => m.active).length - 10} more
          </span>
            </button>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResourceUsageChart;