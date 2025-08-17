import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { LucideIcon } from 'lucide-react';

// Chart Component Interfaces
interface BaseChartProps {
  data: any[];
  height?: number;
  colors?: string[];
  xAxisDataKey?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string];
  className?: string;
}

interface SingleDataKeyProps extends BaseChartProps {
  dataKey: string;
  name?: string;
}

interface MultipleDataKeyProps extends BaseChartProps {
  dataKey: string[];
  name?: string[];
}

type ChartProps = SingleDataKeyProps | MultipleDataKeyProps;

interface AreaChartProps extends ChartProps {
  gradientId?: string;
}

interface BarChartProps extends ChartProps {
  stacked?: boolean;
}

interface PieChartProps extends BaseChartProps {
  dataKey?: string;
  nameKey?: string;
  innerRadius?: number | string;
  outerRadius?: number | string;
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  height?: string;
  className?: string;
}

interface MetricsDisplayProps {
  title: string;
  chart: React.ReactNode;
  metrics?: Array<{
    label: string;
    value: string | number;
    icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
    iconColor?: string;
    textColor?: string;
  }>;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  className?: string;
}

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  status?: string;
  className?: string;
}

/**
 * AreaChartComponent - A reusable area chart component
 * Used across dashboard pages for visualizing time series data
 */
export const AreaChartComponent: React.FC<AreaChartProps> = ({ 
  data, 
  dataKey, 
  height = 300,
  colors = ['#3b82f6'], // Blue by default
  xAxisDataKey = 'time',
  showGrid = true,
  showLegend = false,
  gradientId = 'colorArea',
  name,
  tooltipFormatter,
  className = ""
}) => {
  // Handle single or multiple data keys
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const names = Array.isArray(name) ? name : [name || dataKey];
  
  return (
    <div className={className} style={{ width: '100%', height }}>
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
export const LineChartComponent: React.FC<ChartProps> = ({ 
  data, 
  dataKey, 
  height = 300,
  colors = ['#3b82f6'], // Blue by default
  xAxisDataKey = 'time',
  showGrid = true,
  showLegend = false,
  name,
  tooltipFormatter,
  className = ""
}) => {
  // Handle single or multiple data keys
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const names = Array.isArray(name) ? name : [name || dataKey];
  
  return (
    <div className={className} style={{ width: '100%', height }}>
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
export const BarChartComponent: React.FC<BarChartProps> = ({ 
  data, 
  dataKey, 
  height = 300,
  colors = ['#3b82f6', '#ef4444', '#10b981'], // Blue, Red, Green by default
  xAxisDataKey = 'time',
  showGrid = true,
  showLegend = true,
  name,
  tooltipFormatter,
  stacked = false,
  className = ""
}) => {
  // Handle single or multiple data keys
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const names = Array.isArray(name) ? name : [name || dataKey];
  
  return (
    <div className={className} style={{ width: '100%', height }}>
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
export const PieChartComponent: React.FC<PieChartProps> = ({ 
  data, 
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'], // Blue, Red, Green, Amber, Purple
  showLegend = true,
  innerRadius = 0, // 0 for pie chart, >0 for donut chart
  outerRadius = '70%',
  tooltipFormatter,
  className = ""
}) => {
  return (
    <div className={className} style={{ width: '100%', height }}>
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
export const ChartContainer: React.FC<ChartContainerProps> = ({ 
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
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
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
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
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
        {metrics.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

/**
 * ProgressBar - A reusable progress bar component
 * Used for resource usage indicators across dashboard pages
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  showLabel = true,
  size = "md",
  status = 'active',
  className = ""
}) => {
  const percent = Math.min(Math.max(0, value), max) / max * 100;
  
  const getColorClass = (percent: number) => {
    if (status === 'stopped' || status === 'inactive') {
      return 'bg-slate-500';
    }
    
    if (percent < 50) {
      return 'bg-green-500';
    } else if (percent < 80) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };
  
  const heightClass = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2'
  }[size] || 'h-1.5';
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`w-full bg-slate-800 rounded-full ${heightClass} mr-2`}>
        <div 
          className={`${heightClass} rounded-full transition-all duration-300 ${getColorClass(percent)}`}
          style={{ width: `${status === 'stopped' || status === 'inactive' ? 0 : percent}%` }}
        ></div>
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400 min-w-[2rem] text-right">
          {status === 'stopped' || status === 'inactive' ? '0' : Math.round(percent)}%
        </span>
      )}
    </div>
  );
};

export default {
  AreaChartComponent,
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  ChartContainer,
  MetricsDisplay,
  ProgressBar
};