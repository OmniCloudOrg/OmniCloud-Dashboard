"use client"

import React, { useState } from 'react';
import { 
  AreaChartComponent, 
  ChartContainer, 
  DashboardGrid, 
  DashboardSection, 
  FilterSelect
} from '../../components/ui';
import { 
  generateCpuData, 
  generateMemoryData, 
  generateRequestsData, 
  generateResponseTimeData, 
  TOP_ROUTES, 
  STATUS_CODES, 
  METRICS_TIME_RANGES 
} from '@/data/appConstants';

/**
 * Application Metrics Tab Component
 * Refactored to use centralized data constants
 */
const ApplicationMetrics = ({ app }) => {
  const [timeRange, setTimeRange] = useState('1h');

  // Generate metrics data using centralized functions
  const cpuData = generateCpuData();
  const memoryData = generateMemoryData(cpuData);
  const requestsData = generateRequestsData(cpuData);
  const responseTimeData = generateResponseTimeData(cpuData);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Performance Metrics</h3>
        <FilterSelect
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={METRICS_TIME_RANGES}
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
            {TOP_ROUTES.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="font-mono text-slate-300">{item.route}</div>
                <div className="text-slate-400">{(item.requests/1000).toFixed(1)}k requests</div>
              </div>
            ))}
          </div>
        </DashboardSection>
        
        <DashboardSection title="Status Codes">
          <div className="space-y-2">
            {STATUS_CODES.map((item, idx) => (
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