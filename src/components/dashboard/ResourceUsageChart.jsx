"use client"

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ResourceUsageChart = ({ appId }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricTypes, setMetricTypes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeMetrics, setActiveMetrics] = useState({});
  const [animating, setAnimating] = useState(false);
  
  // Add CSS for animations
  useEffect(() => {
    // Add a style tag for our animations if it doesn't exist
    if (!document.getElementById('chart-animations-style')) {
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
      const metricConfig = {};
      
      // Define key metrics that should be enabled by default
      const keyMetrics = ['cpu_utilization', 'memory_utilization', 'disk_utilization', 'latency'];
      
      metricTypes.forEach(metric => {
        const color = getDistinctColorFromString(metric, metricTypes);
        const gradientId = `color${metric.replace(/_/g, '')}`;
        
        metricConfig[metric] = {
          color,
          gradientId,
          name: getReadableMetricName(metric),
          active: keyMetrics.includes(metric) // Only enable key metrics by default
        };
      });
      
      setActiveMetrics(metricConfig);
    }
  }, [metricTypes]);
  
  // Fetch metrics from API
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setAnimating(true);
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

        // Build URL with query parameters if needed
        let url = `${apiBaseUrl}/metrics/`;
        
        // If an appId is provided, filter by it
        if (appId) {
          url += `?app_id=${appId}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Apply time range filter
        const startTime = getTimeRangeFilter();
        const filteredData = data.filter(metric => {
          const metricDate = new Date(metric.timestamp);
          return metricDate >= new Date(startTime);
        });
        
        // Fade out current data
        setLoading(true);
        
        // Wait for fade out to complete
        setTimeout(() => {
          // Set new data
          setMetrics(filteredData);
          
          // Extract unique metric types
          const types = [...new Set(filteredData.map(metric => metric.metric_name))];
          setMetricTypes(types);
          
          // Process new chart data first (in the background)
          setTimeout(() => {
            setError(null);
            setLoading(false);
            
            // Wait a bit more before removing the loading/animating effects
            setTimeout(() => {
              setAnimating(false);
            }, 200);
          }, 100);
        }, 300);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics data. Please try again later.');
        setAnimating(false);
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, [timeRange, appId]);
  
  // Process the metrics data for the chart - SIMPLIFIED TO USE ONLY API DATA
  useEffect(() => {
    if (metrics.length === 0 || Object.keys(activeMetrics).length === 0) {
      return;
    }
    
    // Group metrics by their timestamp (rounded to minutes for better grouping)
    const timeGroupedMetrics = {};
    
    metrics.forEach(metric => {
      const timestamp = new Date(metric.timestamp);
      // Round to the nearest minute to group close timestamps
      timestamp.setSeconds(0, 0);
      const timeKey = timestamp.toISOString();
      
      if (!timeGroupedMetrics[timeKey]) {
        timeGroupedMetrics[timeKey] = {
          timestamp: timeKey,
          time: formatTime(timestamp),
          rawTimestamp: metric.timestamp
        };
        
        // Initialize all metric types with null values
        metricTypes.forEach(type => {
          timeGroupedMetrics[timeKey][type] = null;
        });
      }
      
      // Add metric value
      // If we already have a value for this metric type, take the average
      const metricType = metric.metric_name;
      const currentValue = timeGroupedMetrics[timeKey][metricType];
      
      if (currentValue === null) {
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
  }, [metrics, activeMetrics, metricTypes, appId, timeRange]);
  
  // Toggle a metric's visibility with animation
  const toggleMetric = (metricName) => {
    // First update active state
    setActiveMetrics(prev => ({
      ...prev,
      [metricName]: {
        ...prev[metricName],
        active: !prev[metricName].active
      }
    }));
    
    // Apply smooth transition class to the legend item
    const legendItem = document.getElementById(`legend-${metricName}`);
    if (legendItem) {
      legendItem.classList.add('legend-transition');
      setTimeout(() => {
        legendItem.classList.remove('legend-transition');
      }, 500);
    }
  };
  
  // Custom tooltip component - simplified without synthetic data references
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter to only show active metrics
      const activePayload = payload.filter(entry => 
        activeMetrics[entry.dataKey]?.active && entry.value > 0
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
                {name}: {entry.value.toFixed(2)}
              </p>
            );
          })}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Resource Usage</h3>
        <div className="relative inline-block text-left">
          <button 
            type="button" 
            className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
            onClick={() => {
              const dropdown = document.getElementById('time-range-dropdown');
              if (dropdown) {
                dropdown.classList.toggle('hidden');
              }
            }}
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
              <button
                className={`block px-4 py-2 text-sm w-full text-left ${timeRange === '1h' ? 'text-blue-400' : 'text-white'} hover:bg-slate-700`}
                role="menuitem"
                onClick={() => {
                  setTimeRange('1h');
                  const dropdown = document.getElementById('time-range-dropdown');
                  if (dropdown) {
                    dropdown.classList.add('hidden');
                  }
                }}
              >
                Last Hour
              </button>
              <button
                className={`block px-4 py-2 text-sm w-full text-left ${timeRange === '6h' ? 'text-blue-400' : 'text-white'} hover:bg-slate-700`}
                role="menuitem"
                onClick={() => {
                  setTimeRange('6h');
                  const dropdown = document.getElementById('time-range-dropdown');
                  if (dropdown) {
                    dropdown.classList.add('hidden');
                  }
                }}
              >
                Last 6 Hours
              </button>
              <button
                className={`block px-4 py-2 text-sm w-full text-left ${timeRange === '24h' ? 'text-blue-400' : 'text-white'} hover:bg-slate-700`}
                role="menuitem"
                onClick={() => {
                  setTimeRange('24h');
                  const dropdown = document.getElementById('time-range-dropdown');
                  if (dropdown) {
                    dropdown.classList.add('hidden');
                  }
                }}
              >
                Last 24 Hours
              </button>
              <button
                className={`block px-4 py-2 text-sm w-full text-left ${timeRange === '7d' ? 'text-blue-400' : 'text-white'} hover:bg-slate-700`}
                role="menuitem"
                onClick={() => {
                  setTimeRange('7d');
                  const dropdown = document.getElementById('time-range-dropdown');
                  if (dropdown) {
                    dropdown.classList.add('hidden');
                  }
                }}
              >
                Last 7 Days
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-80 text-red-400">
            {error}
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
                    {metricTypes.map(metricType => {
                      if (!activeMetrics[metricType]) return null;
                      
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
                  {metricTypes.map(metricType => {
                    if (!activeMetrics[metricType] || !activeMetrics[metricType].active) return null;
                    
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
                        activeDot={{ 
                          r: 6, 
                          stroke: color, 
                          strokeWidth: 2, 
                          fill: '#fff' 
                        }}
                        dot={{ 
                          r: 4,
                          fill: color, 
                          stroke: color,
                          strokeWidth: 2
                        }}
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {metricTypes.map(metricType => {
                if (!activeMetrics[metricType]) return null;
                
                const { color, name, active } = activeMetrics[metricType];
                return (
                  <div 
                    key={metricType} 
                    id={`legend-${metricType}`}
                    className={`legend-item flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-all duration-300 ${
                      active ? 'legend-item active bg-slate-800/50' : 'legend-item inactive bg-slate-800/20'
                    }`}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};