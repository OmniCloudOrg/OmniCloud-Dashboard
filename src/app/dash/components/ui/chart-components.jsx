"use client"

import React from 'react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

/**
 * AreaChartComponent - A reusable area chart component
 * Used across dashboard pages for visualizing time series data
 */
export const AreaChartComponent = ({ 
  data, 
  dataKey, 
  height = 300,
  colors = ['#3b82f6'], // Blue by default
  xAxisDataKey = 'time',
  showGrid = true,
  showLegend = false,
  gradientId = 'colorArea',
  name,
  tooltipFormatter
}) => {
  // Handle single or multiple data keys
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const names = Array.isArray(name) ? name : [name || dataKey];
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {dataKeys.map((key, index) => (
              <linearGradient 
                key={index} 
                id={`${gradientId}${index}`} 
                x1="0" 
                y1="0" 
                x2="0" 
                y2="1"
              >
                <stop 
                  offset="5%" 
                  stopColor={colors[index % colors.length]} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={colors[index % colors.length]} 
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />}
          <XAxis dataKey={xAxisDataKey} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              borderRadius: '0.5rem'
            }}
            formatter={tooltipFormatter}
          />
          
          {showLegend && <Legend />}
          
          {dataKeys.map((key, index) => (
            <Area 
              key={index}
              type="monotone" 
              dataKey={key} 
              name={names[index]}
              stroke={colors[index % colors.length]} 
              fillOpacity={1}
              fill={`url(#${gradientId}${index})`} 
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * LineChartComponent - A reusable line chart component
 * Used across dashboard pages for visualizing trend data
 */
export const LineChartComponent = ({ 
  data, 
  dataKey, 
  height = 300,
  colors = ['#3b82f6'], // Blue by default
  xAxisDataKey = 'time',
  showGrid = true,
  showLegend = false,
  name,
  tooltipFormatter
}) => {
  // Handle single or multiple data keys
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const names = Array.isArray(name) ? name : [name || dataKey];
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />}
          <XAxis dataKey={xAxisDataKey} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              borderRadius: '0.5rem'
            }}
            formatter={tooltipFormatter}
          />
          
          {showLegend && <Legend />}
          
          {dataKeys.map((key, index) => (
            <Line 
              key={index}
              type="monotone" 
              dataKey={key} 
              name={names[index]}
              stroke={colors[index % colors.length]} 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * BarChartComponent - A reusable bar chart component
 * Used across dashboard pages for visualizing comparative data
 */
export const BarChartComponent = ({ 
  data, 
  dataKey, 
  height = 300,
  colors = ['#3b82f6', '#ef4444', '#10b981'], // Blue, Red, Green by default
  xAxisDataKey = 'time',
  showGrid = true,
  showLegend = true,
  name,
  tooltipFormatter,
  stacked = false
}) => {
  // Handle single or multiple data keys
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const names = Array.isArray(name) ? name : [name || dataKey];
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />}
          <XAxis dataKey={xAxisDataKey} stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              borderRadius: '0.5rem'
            }}
            formatter={tooltipFormatter}
          />
          
          {showLegend && <Legend />}
          
          {dataKeys.map((key, index) => (
            <Bar 
              key={index}
              dataKey={key} 
              name={names[index]} 
              fill={colors[index % colors.length]}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * PieChartComponent - A reusable pie chart component
 * Used across dashboard pages for visualizing proportional data
 */
export const PieChartComponent = ({ 
  data, 
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'], // Blue, Red, Green, Amber, Purple
  showLegend = true,
  innerRadius = 0, // 0 for pie chart, >0 for donut chart
  outerRadius = '70%',
  tooltipFormatter
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              borderRadius: '0.5rem'
            }}
            formatter={tooltipFormatter}
          />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * ChartContainer - A reusable container for charts
 * Used across dashboard pages for consistent chart presentation
 */
export const ChartContainer = ({ 
  title, 
  children, 
  timeRange, 
  onTimeRangeChange,
  height = "h-64",
  className = ""
}) => {
  return (
    <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {timeRange && onTimeRangeChange && (
          <select 
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        )}
      </div>
      <div className={`p-6 ${height}`}>
        {children}
      </div>
    </div>
  );
};

/**
 * MetricsDisplay - A reusable component for displaying related metrics with a chart
 * Used across dashboard pages for combining charts with related metrics
 */
export const MetricsDisplay = ({
  title,
  chart,
  metrics = [],
  timeRange,
  onTimeRangeChange,
  className = ""
}) => {
  return (
    <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {timeRange && onTimeRangeChange && (
          <select 
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        )}
      </div>
      <div className="p-6">
        <div className="h-64 mb-4">
          {chart}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {metric.icon && <metric.icon size={14} className={metric.iconColor || 'text-blue-500'} />}
                <span className={`text-sm ${metric.textColor || 'text-blue-400'}`}>{metric.label}</span>
              </div>
              <span className="text-sm font-medium text-white">{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};