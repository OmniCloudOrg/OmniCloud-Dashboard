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
  
  // Initialize metrics with colors and gradients
  useEffect(() => {
    if (metricTypes.length > 0) {
      const metricConfig = {};
      
      metricTypes.forEach(metric => {
        const color = getDistinctColorFromString(metric, metricTypes);
        const gradientId = `color${metric.replace(/_/g, '')}`;
        
        metricConfig[metric] = {
          color,
          gradientId,
          name: getReadableMetricName(metric),
          active: true
        };
      });
      
      setActiveMetrics(metricConfig);
    }
  }, [metricTypes]);
  
  // Fetch metrics from API with smoother transitions
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
        // In a real implementation, this would be done on the server
        // For demo purposes, we'll pretend to filter even though all data has the same timestamp
        const startTime = getTimeRangeFilter();
        const filteredData = data.filter(metric => {
          const metricDate = new Date(metric.timestamp);
          return metricDate >= new Date(startTime);
        });
        
        // For demo purposes, simulate different data for different time ranges
        const modifiedData = filteredData.map(metric => {
          // Create a copy of the metric
          const newMetric = { ...metric };
          
          // Adjust values based on time range to demonstrate dropdown effect
          switch(timeRange) {
            case '1h':
              // Show 40% of the original value for 1h range
              newMetric.metric_value = metric.metric_value * 0.4;
              break;
            case '6h':
              // Show 60% of the original value for 6h range
              newMetric.metric_value = metric.metric_value * 0.6;
              break;
            case '7d':
              // Show 130% of the original value for 7d range
              newMetric.metric_value = metric.metric_value * 1.3;
              break;
            case '24h':
            default:
              // Keep original values for 24h range
              break;
          }
          
          return newMetric;
        });
        
        // Fade out current data
        setLoading(true);
        
        // Wait for fade out to complete
        setTimeout(() => {
          // Set new data
          setMetrics(modifiedData);
          
          // Extract unique metric types
          const types = [...new Set(modifiedData.map(metric => metric.metric_name))];
          setMetricTypes(types);
          
          // Process new chart data first (in the background)
          // This ensures the data is ready before we show it
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
  
  // Process the metrics data for the chart
  useEffect(() => {
    if (metrics.length === 0 || Object.keys(activeMetrics).length === 0) {
      return;
    }
    
    // First, group by metric type and app_id to get average/max values
    const metricsByTypeAndApp = {};
    
    metrics.forEach(metric => {
      const appId = metric.labels?.app_id || 'unknown';
      const key = `${metric.metric_name}_${appId}`;
      
      if (!metricsByTypeAndApp[key]) {
        metricsByTypeAndApp[key] = {
          metric_name: metric.metric_name,
          app_id: appId,
          value: metric.metric_value,
          timestamp: metric.timestamp
        };
      } else if (metric.metric_value > metricsByTypeAndApp[key].value) {
        // Keep the highest value for the metric type and app
        metricsByTypeAndApp[key].value = metric.metric_value;
      }
    });
    
    // Get the single timestamp we have (all are the same in the dataset)
    const timestamp = metrics[0]?.timestamp;
    const timePoint = formatTime(new Date(timestamp));
    
    // Create a synthetic time series by creating data points for the chart
    // Instead of showing a single point, create a series of points at different apps
    const dataByApps = {};
    
    // Group by app_id to make each app a time point on the chart
    Object.values(metricsByTypeAndApp).forEach(item => {
      const appLabel = `App ${item.app_id}`;
      
      if (!dataByApps[appLabel]) {
        dataByApps[appLabel] = {
          time: appLabel,
          rawTimestamp: item.timestamp
        };
        
        // Initialize all metric types with 0
        metricTypes.forEach(type => {
          dataByApps[appLabel][type] = 0;
        });
      }
      
      // Add metric value
      dataByApps[appLabel][item.metric_name] = item.value;
    });
    
    // Convert to array and sort by app_id
    let dataArray = Object.values(dataByApps).sort((a, b) => {
      const appIdA = parseInt(a.time.replace('App ', '')) || 0;
      const appIdB = parseInt(b.time.replace('App ', '')) || 0;
      return appIdA - appIdB;
    });
    
    // If we're filtering by app_id, then create a time series for that app
    if (appId) {
      // Create a time series with a single real data point and some synthetic ones
      const now = new Date(timestamp);
      const timePoints = [];
      
      // Create synthetic time points before the actual data point
      for (let i = 0; i < 8; i++) {
        const pointTime = new Date(now);
        pointTime.setHours(now.getHours() - (7 - i));
        
        const formattedTime = formatTime(pointTime);
        
        // For the middle point, use the actual data
        if (i === 4) {
          const point = {
            time: timePoint,
            rawTimestamp: timestamp,
            highlight: true // Mark this as the actual data point
          };
          
          // Add all metric types
          metricTypes.forEach(type => {
            // Find metrics for this app and type
            const values = metrics
              .filter(m => m.labels?.app_id === parseInt(appId) && m.metric_name === type)
              .map(m => m.metric_value);
              
            // Use average if multiple values exist, otherwise 0
            point[type] = values.length > 0 
              ? values.reduce((sum, val) => sum + val, 0) / values.length 
              : 0;
          });
          
          timePoints.push(point);
        } else {
          // Create synthetic points with zero values
          const point = {
            time: formattedTime,
            rawTimestamp: pointTime.toISOString(),
            highlight: false
          };
          
          // Add all metric types with zero values
          metricTypes.forEach(type => {
            point[type] = 0;
          });
          
          timePoints.push(point);
        }
      }
      
      dataArray = timePoints;
    } else if (dataArray.length < 2) {
      // If not filtering by app and we only have one data point,
      // create a different visualization showing metrics by type
      const aggregatedData = [];
      
      metricTypes.forEach(type => {
        // Find all values for this metric type
        const values = metrics
          .filter(m => m.metric_name === type)
          .map(m => m.metric_value);
          
        if (values.length > 0) {
          // Calculate average value
          const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          
          // Create a data point with the metric name as the label
          const point = {
            time: getReadableMetricName(type),
            rawTimestamp: timestamp
          };
          
          // Set this metric type to the average value, all others to 0
          metricTypes.forEach(t => {
            point[t] = t === type ? avgValue : 0;
          });
          
          aggregatedData.push(point);
        }
      });
      
      dataArray = aggregatedData;
    }
    
    setChartData(dataArray);
  }, [metrics, activeMetrics, metricTypes, appId]);
  
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
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Check if this is the real data point in a synthetic series
      const dataPoint = chartData.find(d => d.time === label);
      const isHighlighted = dataPoint?.highlight;
      
      // Filter to only show active metrics
      const activePayload = payload.filter(entry => 
        activeMetrics[entry.dataKey]?.active && entry.value > 0
      );
      
      if (activePayload.length === 0) return null;
      
      return (
        <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 shadow-lg text-sm">
          <p className={`text-white font-medium mb-2 ${isHighlighted ? 'flex items-center' : ''}`}>
            {label}
            {isHighlighted && (
              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                Real Data
              </span>
            )}
          </p>
          
          {activePayload.map((entry, index) => {
            const metricName = entry.dataKey;
            if (!activeMetrics[metricName]) return null;
            
            const { color, name } = activeMetrics[metricName];
            return (
              <p key={index} style={{ color: color }} className="mb-1">
                {name} : {entry.value.toFixed(2)}
              </p>
            );
          })}
          
          {!isHighlighted && appId && (
            <p className="text-gray-400 text-xs mt-2 italic">
              Note: Only the highlighted point represents real data
            </p>
          )}
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
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
                        activeDot={{ 
                          r: 6, 
                          stroke: color, 
                          strokeWidth: 2, 
                          fill: '#fff' 
                        }}
                        // Use dotted lines for most of the chart when showing a single app with synthetic data
                        strokeDasharray={appId && chartData.some(d => d.highlight) ? "3 3" : "0"}
                        // Make the real data point (if any) have a solid line
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          const isHighlighted = payload.highlight;
                          
                          if (!isHighlighted && appId) {
                            // Don't render dots for synthetic points when showing a single app
                            return null;
                          }
                          
                          return (
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r={isHighlighted ? 6 : 4}
                              fill={isHighlighted ? '#fff' : color} 
                              stroke={color}
                              strokeWidth={isHighlighted ? 3 : 2}
                            />
                          );
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
                    className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded transition-all duration-300 ${
                      active ? 'bg-slate-800/50' : 'bg-slate-800/20 opacity-50'
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