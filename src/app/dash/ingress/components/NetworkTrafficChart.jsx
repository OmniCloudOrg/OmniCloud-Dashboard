"use client"

import React from 'react';
import { DownloadCloud, UploadCloud } from 'lucide-react';
import { ChartContainer, AreaChartComponent } from '../../components/ui';

const NetworkTrafficChart = () => {
  // Traffic data for charts
  const trafficData = [
    { time: '00:00', inbound: 120, outbound: 80 },
    { time: '02:00', inbound: 150, outbound: 100 },
    { time: '04:00', inbound: 180, outbound: 120 },
    { time: '06:00', inbound: 210, outbound: 140 },
    { time: '08:00', inbound: 240, outbound: 160 },
    { time: '10:00', inbound: 270, outbound: 180 },
    { time: '12:00', inbound: 300, outbound: 200 },
    { time: '14:00', inbound: 330, outbound: 220 },
    { time: '16:00', inbound: 300, outbound: 200 },
    { time: '18:00', inbound: 270, outbound: 180 },
    { time: '20:00', inbound: 240, outbound: 160 },
    { time: '22:00', inbound: 210, outbound: 140 }
  ];
  
  return (
    <ChartContainer
      title="Network Traffic"
      timeRange="24h"
      onTimeRangeChange={() => {}}
      height="h-64"
    >
      <AreaChartComponent
        data={trafficData}
        dataKey={['inbound', 'outbound']}
        xAxisDataKey="time"
        colors={['#3b82f6', '#ef4444']}
        name={['Inbound', 'Outbound']}
        tooltipFormatter={(value) => [`${value} MB/s`]}
      />
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <DownloadCloud size={14} className="text-blue-500" />
            <span className="text-sm text-blue-400">Inbound</span>
          </div>
          <span className="text-sm font-medium text-white">1.5 GB/s</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <UploadCloud size={14} className="text-red-500" />
            <span className="text-sm text-red-400">Outbound</span>
          </div>
          <span className="text-sm font-medium text-white">0.9 GB/s</span>
        </div>
      </div>
    </ChartContainer>
  );
};

export default NetworkTrafficChart;