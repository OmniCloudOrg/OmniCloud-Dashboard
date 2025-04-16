"use client"

import React, { useState } from 'react';
import { 
  AreaChartComponent, 
  ChartContainer, 
  DashboardGrid, 
  DashboardSection, 
  FilterSelect
} from '../../components/ui';

/**
 * Application Metrics Tab Component
 * Refactored to use the UI component library
 */
const ApplicationMetrics = ({ app }) => {
  const [timeRange, setTimeRange] = useState('1h');

  // Sample metrics data - in a real app this would come from the API
  const cpuData = [
    { time: '12:00', value: 32 },
    { time: '12:10', value: 40 },
    { time: '12:20', value: 45 },
    { time: '12:30', value: 38 },
    { time: '12:40', value: 55 },
    { time: '12:50', value: 62 },
    { time: '13:00', value: 58 },
    { time: '13:10', value: 45 },
    { time: '13:20', value: 40 },
    { time: '13:30', value: 42 },
    { time: '13:40', value: 48 },
    { time: '13:50', value: 50 },
    { time: '14:00', value: 47 }
  ];

  // Generate different data for each chart based on the CPU data
  const memoryData = cpuData.map(item => ({ time: item.time, value: item.value + 10 }));
  const requestsData = cpuData.map(item => ({ time: item.time, value: Math.floor(Math.random() * 100 + 150) }));
  const responseTimeData = cpuData.map(item => ({ time: item.time, value: Math.floor(Math.random() * 100 + 200) }));

  // Top routes data
  const topRoutes = [
    { route: '/api/users', requests: 24500, time: 43 },
    { route: '/api/products', requests: 18200, time: 67 },
    { route: '/api/auth/login', requests: 12300, time: 92 },
    { route: '/api/orders', requests: 9800, time: 120 },
    { route: '/api/dashboard', requests: 6500, time: 156 }
  ];

  // Status codes data
  const statusCodes = [
    { code: '200 OK', count: 68500, color: 'bg-green-500' },
    { code: '201 Created', count: 12300, color: 'bg-green-500' },
    { code: '304 Not Modified', count: 8200, color: 'bg-blue-500' },
    { code: '401 Unauthorized', count: 3600, color: 'bg-yellow-500' },
    { code: '404 Not Found', count: 2100, color: 'bg-yellow-500' },
    { code: '500 Server Error', count: 850, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Performance Metrics</h3>
        <FilterSelect
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={[
            { value: '1h', label: 'Last 1 hour' },
            { value: '6h', label: 'Last 6 hours' },
            { value: '24h', label: 'Last 24 hours' },
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' }
          ]}
        />
      </div>
      
      <DashboardGrid columns={2} gap={6}>
        <ChartContainer title="CPU Usage" height="h-64" timeRange={timeRange} onTimeRangeChange={setTimeRange}>
          <AreaChartComponent
            data={cpuData}
            dataKey="value"
            colors={['#3b82f6']}
            xAxisDataKey="time"
            showGrid={true}
            gradientId="colorCpu"
          />
        </ChartContainer>
        
        <ChartContainer title="Memory Usage" height="h-64" timeRange={timeRange} onTimeRangeChange={setTimeRange}>
          <AreaChartComponent
            data={memoryData}
            dataKey="value"
            colors={['#10b981']}
            xAxisDataKey="time"
            showGrid={true}
            gradientId="colorMemory"
          />
        </ChartContainer>
        
        <ChartContainer title="Requests per Second" height="h-64" timeRange={timeRange} onTimeRangeChange={setTimeRange}>
          <AreaChartComponent
            data={requestsData}
            dataKey="value"
            colors={['#8b5cf6']}
            xAxisDataKey="time"
            showGrid={true}
            gradientId="colorRequests"
          />
        </ChartContainer>
        
        <ChartContainer title="Response Time (ms)" height="h-64" timeRange={timeRange} onTimeRangeChange={setTimeRange}>
          <AreaChartComponent
            data={responseTimeData}
            dataKey="value"
            colors={['#f59e0b']}
            xAxisDataKey="time"
            showGrid={true}
            gradientId="colorResponse"
          />
        </ChartContainer>
      </DashboardGrid>
      
      <DashboardGrid columns={3} gap={6}>
        <DashboardSection title="Top Routes">
          <div className="space-y-2">
            {topRoutes.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="font-mono text-slate-300">{item.route}</div>
                <div className="text-slate-400">{(item.requests/1000).toFixed(1)}k requests</div>
              </div>
            ))}
          </div>
        </DashboardSection>
        
        <DashboardSection title="Status Codes">
          <div className="space-y-2">
            {statusCodes.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                <div className="font-mono text-slate-300">{item.code}</div>
                <div className="text-slate-400 ml-auto">{(item.count/1000).toFixed(1)}k</div>
              </div>
            ))}
          </div>
        </DashboardSection>
        
        <DashboardSection title="Cache Hit Ratio">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl font-bold text-white mb-2">76.4%</div>
            <div className="text-sm text-slate-400">Cache Hit Ratio</div>
            <div className="w-full mt-4 bg-slate-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '76.4%' }}></div>
            </div>
          </div>
        </DashboardSection>
      </DashboardGrid>
    </div>
  );
};

export default ApplicationMetrics;