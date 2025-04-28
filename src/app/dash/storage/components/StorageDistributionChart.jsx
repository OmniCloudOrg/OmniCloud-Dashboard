import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StorageDistributionChart = ({ 
  data,
  height = 320,
  showLegend = true,
  showMetrics = true,
  colorScheme = 'default'
}) => {
  // Color scheme options
  const COLOR_SCHEMES = {
    default: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'],
    monochrome: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'],
    warm: ['#ef4444', '#f59e0b', '#eab308', '#a16207'],
    cool: ['#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6']
  };
  
  const COLORS = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.default;
  
  // Dynamic sizing for pie chart
  const calculateRadius = () => {
    if (height < 200) return 40;
    if (height < 300) return 60;
    return 80;
  };

  // Custom label that adapts to chart size
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (height < 200) return null; // Don't show labels on very small charts
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Only show percentage on larger charts
    const labelText = height > 250 
      ? `${name} ${(percent * 100).toFixed(0)}%` 
      : `${(percent * 100).toFixed(0)}%`;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#f1f5f9"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={height > 300 ? 12 : 10}
      >
        {labelText}
      </text>
    );
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden w-full">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800">
        <h3 className="text-base sm:text-lg font-medium text-white">Storage Distribution</h3>
      </div>
      <div className="p-4 sm:p-6">
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={height >= 200}
                outerRadius={calculateRadius()}
                innerRadius={height > 300 ? 30 : 0} // Make it a donut chart on larger displays
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} GB`]}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(51, 65, 85, 0.5)',
                  borderRadius: '0.5rem',
                  fontSize: height > 250 ? '0.875rem' : '0.75rem'
                }}
              />
              {showLegend && height > 200 && (
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{
                    fontSize: height > 250 ? '0.75rem' : '0.625rem',
                    paddingTop: '10px'
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
        {showMetrics && (
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-slate-800/50 p-2 sm:p-3 rounded-lg">
              <h4 className="text-xs font-medium text-slate-400 mb-1">Monthly Cost</h4>
              <div className="text-base sm:text-xl font-bold text-white">$243.50</div>
            </div>
            <div className="bg-slate-800/50 p-2 sm:p-3 rounded-lg">
              <h4 className="text-xs font-medium text-slate-400 mb-1">Projected</h4>
              <div className="text-base sm:text-xl font-bold text-white">$278.20</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage:
// const data = [
//   { name: 'Media', value: 320 },
//   { name: 'Documents', value: 180 },
//   { name: 'Apps', value: 120 },
//   { name: 'System', value: 75 }
// ];
// 
// <StorageDistributionChart 
//   data={data} 
//   height={400}
//   showLegend={true}
//   showMetrics={true}
//   colorScheme="cool" 
// />

export { StorageDistributionChart };