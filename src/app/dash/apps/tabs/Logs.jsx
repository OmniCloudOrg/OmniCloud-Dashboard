"use client"

import React from 'react';
import { Download } from 'lucide-react';
import { 
  DashboardSection, 
  FilterSelect,
  ButtonGroup,
  IconButton
} from '../../components/ui';

/**
 * Application Logs Tab Component
 * Refactored to use the UI component library
 */
const ApplicationLogs = ({ app }) => {
  // Sample log entries
  const logs = [
    { timestamp: '2025-02-25 12:34:56', level: 'INFO', message: 'Server started on port 3000', color: 'text-green-400' },
    { timestamp: '2025-02-25 12:35:01', level: 'INFO', message: 'Connected to database', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:35:05', level: 'INFO', message: 'User authenticated: john.doe', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:36:12', level: 'INFO', message: 'GET /api/users 200 15ms', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:36:25', level: 'WARN', message: 'Rate limit reached for IP: 192.168.1.1', color: 'text-yellow-400' },
    { timestamp: '2025-02-25 12:37:30', level: 'INFO', message: 'POST /api/items 201 32ms', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:39:45', level: 'ERROR', message: 'Invalid JWT token', color: 'text-red-400' },
    { timestamp: '2025-02-25 12:40:12', level: 'INFO', message: 'GET /api/products 200 28ms', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:41:09', level: 'INFO', message: 'GET /api/orders 200 42ms', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:42:33', level: 'ERROR', message: 'Database query failed: Timeout', color: 'text-red-400' },
    { timestamp: '2025-02-25 12:43:15', level: 'INFO', message: 'Database connection retried successfully', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:44:01', level: 'INFO', message: 'GET /api/dashboard 200 64ms', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:45:22', level: 'WARN', message: 'High memory usage: 82%', color: 'text-yellow-400' },
    { timestamp: '2025-02-25 12:46:07', level: 'INFO', message: 'GET /api/stats 200 47ms', color: 'text-blue-400' },
    { timestamp: '2025-02-25 12:47:18', level: 'INFO', message: 'User logged out: john.doe', color: 'text-blue-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Logs</h3>
        <div className="flex items-center gap-3">
          <FilterSelect
            value="all-instances"
            onChange={(e) => console.log(e.target.value)}
            options={[
              { value: 'all-instances', label: 'All Instances' },
              { value: 'i-1234567a', label: 'i-1234567a' },
              { value: 'i-1234567b', label: 'i-1234567b' },
              { value: 'i-1234567c', label: 'i-1234567c' }
            ]}
          />
          <FilterSelect
            value="1h"
            onChange={(e) => console.log(e.target.value)}
            options={[
              { value: '1h', label: 'Last 1 hour' },
              { value: '6h', label: 'Last 6 hours' },
              { value: '24h', label: 'Last 24 hours' },
              { value: '7d', label: 'Last 7 days' }
            ]}
          />
          <IconButton
            icon={Download}
            variant="secondary"
            tooltip="Download Logs"
          />
        </div>
      </div>
      
      <DashboardSection>
        <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm">
          <div className="max-h-96 overflow-y-auto space-y-2">
            {logs.map((log, idx) => (
              <div key={idx} className={log.color}>
                [{log.timestamp}] [{log.level}] {log.message}
              </div>
            ))}
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default ApplicationLogs;