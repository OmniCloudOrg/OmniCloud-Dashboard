"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ResourceUsageChart = ({ platformId, appId }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricTypes, setMetricTypes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeMetrics, setActiveMetrics] = useState({});
  const [animating, setAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMetricDropdown, setShowMetricDropdown] = useState(false);
  
  // Track if we're currently fetching data to prevent duplicate requests
  const isFetchingRef = useRef(false);
  
  // Track the last platform ID to prevent redundant updates
  const lastPlatformIdRef = useRef(null);
  
  // Track the last time range to prevent redundant fetches
  const lastTimeRangeRef = useRef(null);
  
  // Track API request cancel controller
  const abortControllerRef = useRef(null);
  
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
  
  // Handle platform changes
  useEffect(() => {
    // Skip if platform ID hasn't changed or is not provided
    if (!platformId || platformId === lastPlatformIdRef.current) return;
    
    // Update last platform ID ref
    lastPlatformIdRef.current = platformId;
    
    // Reset state for the new platform
    setMetrics([]);
    setChartData([]);
    setError(null);
    
    // Fetch data with a slight delay to prevent race conditions
    const timer = setTimeout(() => {
      fetchMetrics();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [platformId]);
  
  // Function to generate a distinct, deterministic color from a string
  const getDistinctColorFromString = (str, knownMetrics) => {
    // Generate a hash from the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Find position of this metric in the array of all metrics
    const metrics = knownMetrics || metricTypes;
    const position = metrics.indexOf(str);
    const totalMetrics = metrics.length;
    
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
  };
  
  // Function to format the time from full ISO date
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Function to calculate time range filter
  const getTimeRangeFilter = () => {
    const now = new Date();
    let startTime;
    
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
  };
  
  // Function to get a display label for the time range
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '1h':
        return 'Last Hour';
      case '6h':
        return 'Last 6 Hours';
      case '7d':
        return 'Last 7 Days';
      case '24h':
      default:
        return 'Last 24 Hours';
    }
  };
  
  // Get readable name for a metric type
  const getReadableMetricName = (metricName) => {
    return metricName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Initialize metrics with colors and gradients - only enable key metrics by default
  useEffect(() => {
    if (metricTypes.length > 0) {
      // Only initialize if we don't already have these metrics configured
      const newMetricTypes = metricTypes.filter(metric => !activeMetrics[metric]);
      
      if (newMetricTypes.length === 0) return;
      
      const metricConfig = { ...activeMetrics };
      
      // Define key metrics that should be enabled by default
      const keyMetrics = ['cpu_utilization', 'memory_utilization', 'disk_utilization', 'latency'];
      
      newMetricTypes.forEach(metric => {
        const color = getDistinctColorFromString(metric, metricTypes);
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
    }
  }, [metricTypes]);
  
  // Fetch metrics from API with debouncing and cancellation
  const fetchMetrics = useCallback(async () => {
    // Skip if no platform or if already fetching
    if (!platformId || isFetchingRef.current) return;
    
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
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
      
      // Build URL with query parameters
      let url = `${apiBaseUrl}/platform/${platformId}/metrics/`;
      
      const params = new URLSearchParams();
      
      // If an appId is provided, filter by it
      if (appId) {
        params.append('app_id', appId);
      }
      
      // Add time range filter
      params.append('start_time', getTimeRangeFilter());
      
      // Append params to URL if any exist
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, { 
        signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the data
      if (!data || !Array.isArray(data) || data.length === 0) {
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
      const types = [...new Set(data.map(metric => metric.metric_name))];
      
      // Update states
      setMetrics(data);
      setMetricTypes(types);
      setError(null);
      
      // Add a slight delay before removing loading state for smooth transition
      setTimeout(() => {
        setLoading(false);
        setAnimating(false);
      }, 300);
      
    } catch (err) {
      // Don't report errors for aborted requests
      if (err.name === 'AbortError') {
        console.log('Metrics request was cancelled');
        return;
      }
      
      console.error('Error fetching metrics:', err);
      setError('Failed to load metrics data. Please try again later.');
      setLoading(false);
      setAnimating(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [timeRange, appId, platformId, metrics.length]);
  
  // Fetch metrics when time range changes
  useEffect(() => {
    if (platformId) {
      fetchMetrics();
    }
  }, [timeRange, fetchMetrics, platformId]);
  
  // Process the metrics data for the chart with debouncing
  useEffect(() => {
    if (metrics.length === 0) {
      setChartData([]);
      return;
    }
    
    // Debounce the data processing to avoid performance issues with large datasets
    const processTimer = setTimeout(() => {
      // Group metrics by their timestamp (rounded to minutes for better grouping)
      const timeGroupedMetrics = {};
      
      metrics.forEach(metric => {
        if (!metric.timestamp || !metric.metric_name || metric.metric_value === undefined) {
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
            time: formatTime(timestamp),
            rawTimestamp: metric.timestamp
          };
        }
        
        // Add metric value
        const metricType = metric.metric_name;
        const currentValue = timeGroupedMetrics[timeKey][metricType];
        
        if (currentValue === undefined) {
          timeGroupedMetrics[timeKey][metricType] = metric.metric_value;
        } else {
          // Calculate average if we have multiple readings for the same metric type at the same time
          timeGroupedMetrics[timeKey][metricType] = (currentValue + metric.metric_value) / 2;
        }
      });
      
      // Convert to array and sort by timestamp
      const timeSeriesData = Object.values(timeGroupedMetrics).sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      
      setChartData(timeSeriesData);
    }, 50); // Short delay for debouncing
    
    return () => clearTimeout(processTimer);
  }, [metrics]);
  
  // Toggle a metric's visibility with animation
  const toggleMetric = (metricName) => {
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
  const CustomTooltip = ({ active, payload, label }) => {
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
    
    const handleClickOutside = (event) => {
      // Close time range dropdown
      const timeDropdown = document.getElementById('time-range-dropdown');
      const timeButton = document.getElementById('time-range-button');
      if (timeDropdown && !timeDropdown.contains(event.target) && !timeButton?.contains(event.target)) {
        timeDropdown.classList.add('hidden');
      }
      
      // Close metrics dropdown
      const metricDropdown = document.getElementById('metric-search-dropdown');
      const metricButton = document.getElementById('metric-search-button');
      if (metricDropdown && !metricDropdown.contains(event.target) && !metricButton?.contains(event.target)) {
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
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
                        const updatedMetrics = {};
                        
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
                {['1h', '6h', '24h', '7d'].map((range) => (
                  <button
                    key={range}
                    className={`block px-4 py-2 text-sm w-full text-left ${timeRange === range ? 'text-blue-400' : 'text-white'} hover:bg-slate-700`}
                    role="menuitem"
                    onClick={() => {
                      setTimeRange(range);
                      const dropdown = document.getElementById('time-range-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }}
                  >
                    {range === '1h' ? 'Last Hour' : 
                     range === '6h' ? 'Last 6 Hours' :
                     range === '24h' ? 'Last 24 Hours' :
                     'Last 7 Days'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
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
              {/* Active Metrics Count */}
              <div className="w-full flex justify-between items-center px-2 mb-2">
                <span className="text-sm text-slate-400">
                  Showing {Object.values(activeMetrics).filter(m => m.active).length} of {Object.keys(activeMetrics).length} metrics
                </span>
                <button 
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  onClick={() => setShowMetricDropdown(true)}
                >
                  Manage metrics
                </button>
              </div>
              
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

// Set default props
ResourceUsageChart.defaultProps = {
  platformId: null,
  appId: null
};

export default ResourceUsageChart;