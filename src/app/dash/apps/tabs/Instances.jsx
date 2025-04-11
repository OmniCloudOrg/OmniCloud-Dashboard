"use client"

import React from 'react';
import { 
  XCircle, 
  CheckCircle, 
  RefreshCw, 
  Terminal 
} from 'lucide-react';
import { 
  DashboardSection, 
  DataTable, 
  StatusBadge, 
  ProgressBar, 
  Button,
  ButtonGroup,
  IconButton
} from '../../components/ui';

/**
 * Application Instances Tab Component
 * Refactored to use the UI component library
 */
const ApplicationInstances = ({ app }) => {
  // Sample instances data - in a real app these would come from the API
  const instances = [
    { id: 'i-1234567a', status: 'running', region: 'us-east', cpu: 23, memory: 45, uptime: '14 days, 3 hours' },
    { id: 'i-1234567b', status: 'running', region: 'us-east', cpu: 52, memory: 68, uptime: '14 days, 3 hours' },
    { id: 'i-1234567c', status: 'warning', region: 'us-west', cpu: 89, memory: 72, uptime: '12 days, 7 hours' },
    { id: 'i-1234567d', status: 'stopped', region: 'eu-central', cpu: 0, memory: 0, uptime: '0 days, 0 hours' }
  ];

  // Define table columns
  const columns = [
    {
      header: 'Instance ID',
      accessor: 'id',
      cell: (item) => <div className="text-sm font-medium text-white">{item.id}</div>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => <StatusBadge status={item.status} />
    },
    {
      header: 'Region',
      accessor: 'region',
      cell: (item) => <div className="text-sm text-slate-300">{item.region}</div>
    },
    {
      header: 'CPU',
      accessor: 'cpu',
      cell: (item) => <ProgressBar value={item.cpu} status={item.status} showLabel={true} />
    },
    {
      header: 'Memory',
      accessor: 'memory',
      cell: (item) => <ProgressBar value={item.memory} status={item.status} showLabel={true} />
    },
    {
      header: 'Uptime',
      accessor: 'uptime',
      cell: (item) => <div className="text-sm text-slate-300">{item.uptime}</div>
    },
    {
      header: '',
      accessor: 'actions',
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          {item.status === 'running' ? (
            <IconButton
              icon={XCircle}
              variant="danger"
              size="sm"
              tooltip="Stop Instance"
            />
          ) : (
            <IconButton
              icon={CheckCircle}
              variant="success"
              size="sm"
              tooltip="Start Instance"
            />
          )}
          <IconButton
            icon={RefreshCw}
            variant="info"
            size="sm"
            tooltip="Restart Instance"
          />
          <IconButton
            icon={Terminal}
            variant="secondary"
            size="sm"
            tooltip="Console"
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Instances ({instances.length})</h3>
        <ButtonGroup>
          <Button 
            variant="secondary" 
            size="sm"
          >
            Refresh
          </Button>
          <Button 
            variant="primary" 
            size="sm"
          >
            Add Instance
          </Button>
        </ButtonGroup>
      </div>
      
      <DataTable 
        columns={columns} 
        data={instances} 
      />
      
      <div className="grid grid-cols-2 gap-6">
        <DashboardSection title="Auto Scaling Configuration">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Min Instances</span>
              <span className="text-white">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Max Instances</span>
              <span className="text-white">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scale Up Threshold</span>
              <span className="text-white">75% CPU for 5 min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scale Down Threshold</span>
              <span className="text-white">30% CPU for 10 min</span>
            </div>
          </div>
        </DashboardSection>
        
        <DashboardSection title="Health Checks">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-400">Passing</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Endpoint</span>
              <span className="text-white">/health</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Interval</span>
              <span className="text-white">30 seconds</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Timeout</span>
              <span className="text-white">5 seconds</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Success Codes</span>
              <span className="text-white">200-299</span>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
};

export default ApplicationInstances;