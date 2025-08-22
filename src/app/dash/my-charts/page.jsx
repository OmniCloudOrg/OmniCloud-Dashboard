"use client"

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { 
  PlusCircle, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Activity, 
  Filter, 
  Database, 
  X, 
  Settings,
  Save,
  Clock,
  Calendar,
  RefreshCw,
  Trash2
} from 'lucide-react';

// Import mock data and utilities
import {
  WIDGET_TYPES,
  DEMO_QUERIES,
  generateTimeSeriesData,
  generateMockDataForQuery,
  DEFAULT_DASHBOARD_WIDGETS,
  COLOR_SCHEMES
} from '@/data';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Simple line chart component
const LineChartComponent = ({ data, colors = COLOR_SCHEMES.blue, height = 200 }) => {
  if (!data || !data.data || data.data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">No data available</div>;
  }
  
  const chartData = data.type === 'time_series' ? [{ name: 'Value', values: data.data }] : data.data;
  const maxValue = Math.max(...chartData.flatMap(series => 
    series.values ? series.values.map(point => point.value) : []
  )) * 1.1;
  
  // Chart dimensions
  const width = 100;
  const chartHeight = height - 50;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  
  // For simplicity, we'll render a mock SVG chart
  return (
    <div className="h-full w-full p-2 flex flex-col">
      <div className="text-xs text-slate-400 mb-1">
        {data.type === 'multi_time_series' && (
          <div className="flex flex-wrap gap-2 mb-2">
            {chartData.map((series, idx) => (
              <div key={idx} className="flex items-center">
                <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                <span>{series.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 relative overflow-hidden border-b border-l border-slate-700">
        <div className="absolute inset-0 flex items-end justify-start">
          {chartData.map((series, seriesIdx) => (
            <div key={seriesIdx} className="absolute inset-0">
              <svg width="100%" height="100%" className="overflow-visible">
                <path
                  d={`M0,${chartHeight} ${series.values ? series.values.map((point, idx) => {
                    const x = (idx / (series.values.length - 1)) * 100;
                    const y = chartHeight - (point.value / maxValue) * chartHeight;
                    return `L${x},${y}`;
                  }).join(' ') : ''}`}
                  fill="none"
                  stroke={colors[seriesIdx % colors.length]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>24h ago</span>
        <span>12h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
};

// Simple bar chart component
const BarChartComponent = ({ data, colors = COLOR_SCHEMES.green, height = 200 }) => {
  if (!data || !data.data || data.data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">No data available</div>;
  }
  
  const chartData = data.type === 'categorical' ? data.data : 
    data.type === 'time_series' ? data.data.map(point => ({
      category: new Date(point.time).toLocaleTimeString([], { hour: '2-digit' }),
      value: point.value
    })) : [];
  
  const maxValue = Math.max(...chartData.map(item => item.value)) * 1.1;
  
  return (
    <div className="h-full w-full p-2 flex flex-col">
      <div className="flex-1 relative overflow-hidden border-b border-l border-slate-700">
        <div className="absolute inset-0 flex items-end">
          {chartData.map((item, idx) => {
            const barHeight = (item.value / maxValue) * 100;
            return (
              <div key={idx} className="h-full flex-1 flex flex-col justify-end items-center px-1">
                <div 
                  style={{ 
                    height: `${barHeight}%`, 
                    backgroundColor: colors[idx % colors.length] 
                  }}
                  className="w-full rounded-t"
                ></div>
                <div className="text-xs text-slate-400 mt-1 truncate w-full text-center">
                  {item.category}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-xs text-right text-slate-500 mt-1">
        {data.unit}
      </div>
    </div>
  );
};

// Simple pie chart component
const PieChartComponent = ({ data, colors = COLOR_SCHEMES.purple, height = 200 }) => {
  if (!data || !data.data || data.data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">No data available</div>;
  }
  
  const chartData = data.type === 'categorical' ? data.data : [];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // For simplicity, we'll render a mock pie chart
  let cumulativePercentage = 0;
  
  return (
    <div className="h-full w-full p-2 flex flex-col">
      <div className="flex-1 flex">
        <div className="relative w-1/2">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {chartData.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const startAngle = cumulativePercentage * 3.6;
              const endAngle = (cumulativePercentage + percentage) * 3.6;
              
              // Convert to radians
              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (endAngle - 90) * Math.PI / 180;
              
              // Calculate path
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              const largeArcFlag = percentage > 50 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              cumulativePercentage += percentage;
              
              return (
                <path
                  key={idx}
                  d={pathData}
                  fill={colors[idx % colors.length]}
                />
              );
            })}
          </svg>
        </div>
        
        <div className="w-1/2 flex flex-col justify-center">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <div 
                className="w-3 h-3 mr-2 rounded-sm" 
                style={{ backgroundColor: colors[idx % colors.length] }}
              ></div>
              <div className="text-xs">
                <div className="text-white">{item.category}</div>
                <div className="text-slate-400">
                  {item.value.toLocaleString()} {data.unit} ({((item.value / total) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple metric component
const MetricComponent = ({ data, color = '#3B82F6' }) => {
  if (!data) return null;
  
  const getLatestValue = () => {
    if (data.type === 'time_series' && data.data && data.data.length > 0) {
      return data.data[data.data.length - 1].value;
    } else if (data.type === 'categorical' && data.data && data.data.length > 0) {
      return data.data.reduce((sum, item) => sum + item.value, 0);
    }
    return 0;
  };
  
  const getFormattedValue = (value) => {
    if (data.format === 'percent') {
      return `${value.toFixed(1)}%`;
    } else if (data.format === 'bytes') {
      if (value < 1024) return `${value.toFixed(0)} B`;
      if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
      if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
      return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (data.format === 'time') {
      return `${value.toFixed(0)} ms`;
    }
    return value.toLocaleString();
  };
  
  const value = getLatestValue();
  const formattedValue = getFormattedValue(value);
  
  // Calculate trend
  const getTrend = () => {
    if (data.type === 'time_series' && data.data && data.data.length >= 2) {
      const current = data.data[data.data.length - 1].value;
      const previous = data.data[data.data.length - 2].value;
      const diff = current - previous;
      const percentage = previous !== 0 ? (diff / previous) * 100 : 0;
      
      return {
        direction: diff >= 0 ? 'up' : 'down',
        percentage: Math.abs(percentage).toFixed(1)
      };
    }
    return null;
  };
  
  const trend = getTrend();
  
  return (
    <div className="h-full w-full p-4 flex flex-col justify-center">
      <div className="text-lg text-slate-400 mb-2">Current</div>
      <div className="text-4xl font-bold" style={{ color }}>
        {formattedValue}
      </div>
      {trend && (
        <div className={`flex items-center mt-2 text-sm ${
          trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
        </div>
      )}
      <div className="text-sm text-slate-500 mt-1">
        Last 24 hours
      </div>
    </div>
  );
};

// Status component
const StatusComponent = ({ data, color = '#10B981' }) => {
  if (!data) return null;
  
  // Determine status based on the latest data point
  const getStatus = () => {
    if (data.type === 'time_series' && data.data && data.data.length > 0) {
      const value = data.data[data.data.length - 1].value;
      
      if (data.format === 'percent') {
        if (value > 90) return { label: 'Critical', color: '#EF4444' };
        if (value > 75) return { label: 'Warning', color: '#F59E0B' };
        return { label: 'Healthy', color: '#10B981' };
      } else {
        // Generic thresholds
        if (value > 80) return { label: 'High', color: '#EF4444' };
        if (value > 50) return { label: 'Medium', color: '#F59E0B' };
        return { label: 'Low', color: '#10B981' };
      }
    }
    return { label: 'Unknown', color: '#6B7280' };
  };
  
  const status = getStatus();
  
  return (
    <div className="h-full w-full p-4 flex flex-col justify-center">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
        <div className="text-lg font-medium" style={{ color: status.color }}>
          {status.label}
        </div>
      </div>
      <div className="text-sm text-slate-400">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

// Table component
const TableComponent = ({ data }) => {
  if (!data || !data.data || data.data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">No data available</div>;
  }
  
  let tableData = [];
  
  if (data.type === 'categorical') {
    tableData = data.data.map(item => ({
      name: item.category,
      value: item.value,
    }));
  } else if (data.type === 'time_series') {
    // Group data into time chunks
    const chunks = [];
    for (let i = 0; i < data.data.length; i += 6) {
      chunks.push(data.data.slice(i, i + 6));
    }
    
    tableData = chunks.map(chunk => {
      const date = new Date(chunk[0].time);
      return {
        time: `${date.getHours()}:00 - ${date.getHours() + 6}:00`,
        min: Math.min(...chunk.map(d => d.value)).toFixed(1),
        max: Math.max(...chunk.map(d => d.value)).toFixed(1),
        avg: (chunk.reduce((sum, d) => sum + d.value, 0) / chunk.length).toFixed(1),
      };
    });
  } else if (data.type === 'multi_time_series') {
    tableData = data.data.map(series => ({
      name: series.name,
      // Get the average of the last 6 points
      last6hAvg: (series.values.slice(-6).reduce((sum, d) => sum + d.value, 0) / 6).toFixed(1),
      current: series.values[series.values.length - 1].value.toFixed(1),
    }));
  }
  
  return (
    <div className="h-full w-full p-2 overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            {Object.keys(tableData[0] || {}).map((key, idx) => (
              <th key={idx} className="px-2 py-1 text-left">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-slate-800">
              {Object.values(row).map((value, colIdx) => (
                <td key={colIdx} className="px-2 py-1">
                  {value}
                  {colIdx > 0 && data.unit ? ` ${data.unit}` : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Widget component (container for charts and metrics)
const Widget = ({ id, type, title, query, onRemove, onConfigure, isEditable }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data for the widget
  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      try {
        const mockData = generateMockDataForQuery(query);
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, 500);
  }, [query]);
  
  // Render content based on widget type
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-slate-400">
          <RefreshCw className="animate-spin mr-2" size={16} />
          Loading...
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-red-400">
          Error: {error}
        </div>
      );
    }
    
    switch (type) {
      case WIDGET_TYPES.METRIC:
        return <MetricComponent data={data} />;
      case WIDGET_TYPES.LINE_CHART:
        return <LineChartComponent data={data} />;
      case WIDGET_TYPES.BAR_CHART:
        return <BarChartComponent data={data} />;
      case WIDGET_TYPES.PIE_CHART:
        return <PieChartComponent data={data} />;
      case WIDGET_TYPES.STATUS:
        return <StatusComponent data={data} />;
      case WIDGET_TYPES.TABLE:
        return <TableComponent data={data} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };
  
  // Get icon based on widget type
  const getWidgetIcon = () => {
    switch (type) {
      case WIDGET_TYPES.METRIC:
        return <Activity size={14} />;
      case WIDGET_TYPES.LINE_CHART:
        return <LineChart size={14} />;
      case WIDGET_TYPES.BAR_CHART:
        return <BarChart3 size={14} />;
      case WIDGET_TYPES.PIE_CHART:
        return <PieChart size={14} />;
      case WIDGET_TYPES.STATUS:
        return <Activity size={14} />;
      case WIDGET_TYPES.TABLE:
        return <Database size={14} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-slate-900 rounded-lg flex flex-col h-full overflow-hidden">
      {/* Widget Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-slate-800">
        <div className="flex items-center">
          <div className="mr-2 text-slate-400">
            {getWidgetIcon()}
          </div>
          <div className="font-medium text-white truncate">{title}</div>
        </div>
        {isEditable && (
          <div className="flex space-x-1">
            <button
              onClick={() => onConfigure(id)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={() => onRemove(id)}
              className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      
      {/* Widget Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

// Widget configuration modal
const WidgetConfigModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialConfig = { type: WIDGET_TYPES.METRIC, title: '', query: '' } 
}) => {
  const [config, setConfig] = useState(initialConfig);
  
  // Reset form when modal opens
  useEffect(() => {
    setConfig(initialConfig);
  }, [isOpen, initialConfig]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-700">
          <h3 className="text-lg font-medium text-white">Configure Widget</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Widget Type
            </label>
            <select
              value={config.type}
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={WIDGET_TYPES.METRIC}>Metric</option>
              <option value={WIDGET_TYPES.LINE_CHART}>Line Chart</option>
              <option value={WIDGET_TYPES.BAR_CHART}>Bar Chart</option>
              <option value={WIDGET_TYPES.PIE_CHART}>Pie Chart</option>
              <option value={WIDGET_TYPES.STATUS}>Status</option>
              <option value={WIDGET_TYPES.TABLE}>Table</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Widget Title"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Data Query
            </label>
            <select
              value={config.query}
              onChange={(e) => setConfig({ ...config, query: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a query</option>
              {DEMO_QUERIES.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-2 border-t border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preview Query
            </label>
            <div className="bg-slate-900 p-2 rounded text-xs text-slate-300 font-mono overflow-auto max-h-28">
              {DEMO_QUERIES.find(q => q.id === config.query)?.query || 'No query selected'}
            </div>
          </div>
        </div>
        
        <div className="px-4 py-3 flex justify-end space-x-2 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!config.title) {
                alert('Please enter a title');
                return;
              }
              if (!config.query) {
                alert('Please select a query');
                return;
              }
              onSave(config);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
          >
            <Save size={16} className="mr-1" />
            Save Widget
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const MetricsDashboard = () => {
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({});
  const [nextWidgetId, setNextWidgetId] = useState(1);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [currentWidgetConfig, setCurrentWidgetConfig] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  
  // Initial layout and widgets
  useEffect(() => {
    // Try to load from localStorage
    const savedWidgets = localStorage.getItem('metrics-dashboard-widgets');
    const savedLayouts = localStorage.getItem('metrics-dashboard-layouts');
    const savedNextId = localStorage.getItem('metrics-dashboard-next-id');
    
    if (savedWidgets && savedLayouts) {
      setWidgets(JSON.parse(savedWidgets));
      setLayouts(JSON.parse(savedLayouts));
      setNextWidgetId(parseInt(savedNextId || '1'));
    } else {
      // Default widgets
      const defaultWidgets = DEFAULT_DASHBOARD_WIDGETS;
      
      const defaultLayouts = {
        lg: [
          { i: 'w1', x: 0, y: 0, w: 3, h: 3 },
          { i: 'w2', x: 3, y: 0, w: 9, h: 3 },
          { i: 'w3', x: 0, y: 3, w: 6, h: 6 },
          { i: 'w4', x: 6, y: 3, w: 6, h: 6 },
          { i: 'w5', x: 0, y: 9, w: 6, h: 6 },
          { i: 'w6', x: 6, y: 9, w: 6, h: 6 },
        ],
        md: [
          { i: 'w1', x: 0, y: 0, w: 3, h: 3 },
          { i: 'w2', x: 3, y: 0, w: 5, h: 3 },
          { i: 'w3', x: 0, y: 3, w: 4, h: 6 },
          { i: 'w4', x: 4, y: 3, w: 4, h: 6 },
          { i: 'w5', x: 0, y: 9, w: 4, h: 6 },
          { i: 'w6', x: 4, y: 9, w: 4, h: 6 },
        ],
        sm: [
          { i: 'w1', x: 0, y: 0, w: 2, h: 3 },
          { i: 'w2', x: 2, y: 0, w: 2, h: 3 },
          { i: 'w3', x: 0, y: 3, w: 4, h: 6 },
          { i: 'w4', x: 0, y: 9, w: 4, h: 6 },
          { i: 'w5', x: 0, y: 15, w: 4, h: 6 },
          { i: 'w6', x: 0, y: 21, w: 4, h: 6 },
        ],
      };
      
      setWidgets(defaultWidgets);
      setLayouts(defaultLayouts);
      setNextWidgetId(7);
    }
  }, []);
  
  // Save to localStorage whenever widgets or layouts change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('metrics-dashboard-widgets', JSON.stringify(widgets));
      localStorage.setItem('metrics-dashboard-layouts', JSON.stringify(layouts));
      localStorage.setItem('metrics-dashboard-next-id', nextWidgetId.toString());
    }
  }, [widgets, layouts, nextWidgetId]);
  
  // Handle layout changes
  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
  };
  
  // Add a new widget
  const handleAddWidget = () => {
    setCurrentWidgetConfig({
      id: `w${nextWidgetId}`,
      type: WIDGET_TYPES.METRIC,
      title: '',
      query: '',
    });
    setIsConfigModalOpen(true);
  };
  
  // Save a new or updated widget
  const handleSaveWidget = (config) => {
    const isNew = !widgets.find(w => w.id === config.id);
    
    if (isNew) {
      const newWidget = {
        id: config.id,
        type: config.type,
        title: config.title,
        query: config.query,
      };
      
      setWidgets([...widgets, newWidget]);
      setNextWidgetId(nextWidgetId + 1);
      
      // Add layout entry for new widget
      const newLayouts = { ...layouts };
      ['lg', 'md', 'sm'].forEach(breakpoint => {
        if (!newLayouts[breakpoint]) newLayouts[breakpoint] = [];
        newLayouts[breakpoint].push({
          i: config.id,
          x: 0,
          y: Infinity, // Put it at the bottom
          w: breakpoint === 'lg' ? 6 : breakpoint === 'md' ? 4 : 4,
          h: 6,
        });
      });
      
      setLayouts(newLayouts);
    } else {
      // Update existing widget
      setWidgets(widgets.map(w => 
        w.id === config.id ? { ...w, ...config } : w
      ));
    }
  };
  
  // Configure an existing widget
  const handleConfigureWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      setCurrentWidgetConfig(widget);
      setIsConfigModalOpen(true);
    }
  };
  
  // Remove a widget
  const handleRemoveWidget = (widgetId) => {
    if (window.confirm('Are you sure you want to remove this widget?')) {
      setWidgets(widgets.filter(w => w.id !== widgetId));
      
      // Remove from layouts
      const newLayouts = { ...layouts };
      Object.keys(newLayouts).forEach(breakpoint => {
        newLayouts[breakpoint] = newLayouts[breakpoint].filter(item => item.i !== widgetId);
      });
      
      setLayouts(newLayouts);
    }
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Dashboard Header */}
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Metrics Dashboard</h1>
          <p className="text-sm text-slate-400">Monitor your system's performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            <Clock size={16} className="text-slate-400 ml-2 mr-1" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-800 text-white text-sm py-1 px-2 rounded focus:outline-none"
            >
              <option value="1h">Last 1 hour</option>
              <option value="6h">Last 6 hours</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
          
          {/* Edit Mode Toggle */}
          <button
            onClick={toggleEditMode}
            className={`px-3 py-1 rounded flex items-center text-sm transition-colors ${
              isEditing 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Settings size={16} className="mr-1" />
            {isEditing ? 'Done' : 'Edit Dashboard'}
          </button>
          
          {/* Add Widget Button (only in edit mode) */}
          {isEditing && (
            <button
              onClick={handleAddWidget}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center text-sm"
            >
              <PlusCircle size={24} className="mr-1" />
              Add Widget
            </button>
          )}
          
          {/* Refresh Button */}
          <button
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>
      
      {/* Edit Mode Notification */}
      {isEditing && (
        <div className="bg-amber-900/20 border-b border-amber-800/30 py-2 px-6 text-sm text-amber-200 flex items-center">
          <Settings size={24} className="mr-2" />
          Edit mode is active. Drag widgets to rearrange them, or resize from the corners. Click "Done" when finished.
        </div>
      )}
      
      {/* Dashboard Content */}
      <div className="p-6">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          isDraggable={isEditing}
          isResizable={isEditing}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 8, sm: 4, xs: 2, xxs: 1 }}
          rowHeight={60}
          margin={[16, 16]}
          containerPadding={[16, 16]}
          compactType="vertical"
          useCSSTransforms={true}
          draggableHandle={isEditing ? undefined : ".non-draggable-area"}
          resizeHandles={['se']}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className={isEditing ? 'widget-draggable' : ''}>
              <Widget
                {...widget}
                isEditable={isEditing}
                onRemove={handleRemoveWidget}
                onConfigure={handleConfigureWidget}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
        
        {/* Empty state */}
        {widgets.length === 0 && (
          <div className="bg-slate-900 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <BarChart3 size={48} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No widgets yet</h3>
            <p className="text-slate-400 mb-4">
              Your dashboard is empty. Add your first widget to start monitoring.
            </p>
            <button
              onClick={handleAddWidget}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center mx-auto"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Your First Widget
            </button>
          </div>
        )}
      </div>
      
      {/* Widget Configuration Modal */}
      <WidgetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveWidget}
        initialConfig={currentWidgetConfig || { type: WIDGET_TYPES.METRIC, title: '', query: '' }}
      />
    </div>
  );
};

export default MetricsDashboard;