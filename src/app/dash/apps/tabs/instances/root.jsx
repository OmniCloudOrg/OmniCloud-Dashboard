"use client"

import React, { useState, useEffect } from 'react';
import { 
  XCircle, 
  CheckCircle, 
  RefreshCw, 
  Terminal as TerminalIcon,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { 
  DashboardSection, 
  DataTable, 
  StatusBadge, 
  ProgressBar, 
  Button,
  ButtonGroup,
  IconButton
} from '../../../components/ui';
import { ApplicationApiClient } from '@/utils/apiClient/apps';
import { getPlatformApiUrl, defaultFetchOptions } from '@/utils/apiConfig';
import Window from './components/Window'; // Updated import
import Terminal from './components/Terminal';

const ApplicationInstances = ({ app }) => {
  const [client] = useState(() => new ApplicationApiClient(app?.platform_id || 1));
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Multiple terminal modals state - Map of instanceId to terminal info
  const [openTerminals, setOpenTerminals] = useState(new Map());
  const [terminalCounter, setTerminalCounter] = useState(0);

  // Simple uptime formatter
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  // Transform API data to UI format
  const transformInstance = (instance) => ({
    id: instance.id || instance.guid,
    status: instance.health_status === 'healthy' ? 'running' : 
             instance.status === 'running' ? 'warning' : 'stopped',
    region: `region-${instance.region_id || instance.node_id}`,
    cpu: Math.round(instance.cpu_usage || 0),
    memory: Math.round(instance.memory_usage || 0),
    disk: Math.round(instance.disk_usage || 0),
    uptime: formatUptime(instance.uptime || 0),
    container_id: instance.container_id,
    container_ip: instance.container_ip,
    instance_index: instance.instance_index,
    restart_count: instance.restart_count || 0
  });

  // Fetch instances
  const fetchInstances = async (newPage = page, newPageSize = pageSize) => {
    if (!app?.id) return;
    
    try {
      setRefreshing(true);
      const { data, pagination } = await client.listInstances(app.id, {
        page: newPage,
        per_page: newPageSize,
      });
      
      setInstances(data.map(transformInstance));
      setPage(newPage);
      setPageSize(newPageSize);
      setTotalCount(pagination.total_count);
      setTotalPages(pagination.total_pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch instances');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Update client when app changes
  useEffect(() => {
    if (app?.platform_id) client.setPlatformId(app.platform_id);
  }, [app?.platform_id, client]);

  // Fetch on mount and setup auto-refresh
  useEffect(() => {
    if (!app?.id) return;
    
    fetchInstances();
    const interval = setInterval(() => fetchInstances(), 30000);
    return () => clearInterval(interval);
  }, [app?.id]);

  // Instance action handler
  const handleInstanceAction = async (instance, action) => {
    if (!app?.id || !instance.id) return;
    
    try {
      const response = await fetch(
        getPlatformApiUrl(`/apps/${app.id}/instances/${instance.id}/${action}`, app.platform_id || 1),
        { ...defaultFetchOptions, method: 'PUT' }
      );
      
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      fetchInstances();
    } catch (err) {
      setError(`Error ${action} instance: ${err.message}`);
    }
  };

  // Open terminal for instance - creates a new terminal modal
  const handleOpenTerminal = (instance) => {
    const terminalId = `${instance.id}-${terminalCounter}`;
    
    setOpenTerminals(prev => {
      const newMap = new Map(prev);
      newMap.set(terminalId, {
        instance,
        terminalId,
        status: {
          isConnected: false,
          isConnecting: false,
          connectionError: null
        }
      });
      return newMap;
    });
    
    setTerminalCounter(prev => prev + 1);
  };

  // Close specific terminal
  const handleCloseTerminal = (terminalId) => {
    setOpenTerminals(prev => {
      const newMap = new Map(prev);
      newMap.delete(terminalId);
      return newMap;
    });
  };

  // Handle terminal connection status changes for specific terminal
  const handleTerminalStatusChange = (terminalId, status) => {
    setOpenTerminals(prev => {
      const newMap = new Map(prev);
      const terminal = newMap.get(terminalId);
      if (terminal) {
        newMap.set(terminalId, {
          ...terminal,
          status
        });
      }
      return newMap;
    });
  };

  // Page handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchInstances(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize) => {
    fetchInstances(0, newSize);
  };

  // Table columns
  const columns = [
    {
      header: 'Instance ID',
      accessor: 'id',
      cell: (item) => <div className="text-sm font-medium text-white">{item.id}</div>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => {
        if (item.status === 'running') {
          return (
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-500">Running</span>
            </div>
          );
        }
        return <StatusBadge status={item.status === 'warning' ? 'warning' : 'stopped'} />;
      }
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
              tooltip="Stop"
              onClick={() => handleInstanceAction(item, 'stop')}
            />
          ) : (
            <IconButton
              icon={CheckCircle}
              variant="success"
              size="sm"
              tooltip="Start"
              onClick={() => handleInstanceAction(item, 'start')}
            />
          )}
          <IconButton
            icon={RefreshCw}
            variant="info"
            size="sm"
            tooltip="Restart"
            onClick={() => handleInstanceAction(item, 'restart')}
          />
          <IconButton
            icon={TerminalIcon}
            variant="secondary"
            size="sm"
            tooltip="Console"
            onClick={() => handleOpenTerminal(item)}
          />
        </div>
      )
    }
  ];

  // Create terminal header actions for specific terminal
  const createTerminalHeaderActions = (terminal) => (
    <div className="flex items-center gap-1">
      {terminal.status.isConnecting ? (
        <Loader2 size={16} className="text-yellow-500 animate-spin" />
      ) : terminal.status.isConnected ? (
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      ) : (
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
      )}
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        terminal.status.isConnecting ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
        terminal.status.isConnected ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
        'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}>
        {terminal.status.isConnecting ? 'Connecting...' : 
         terminal.status.isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );

  if (loading && !instances.length) {
    return (
      <div className="flex justify-center items-center h-32 text-slate-400">
        Loading instances...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">
          Instances ({totalCount})
          {refreshing && <span className="ml-2 text-sm text-slate-400">(Refreshing...)</span>}
        </h3>
        <ButtonGroup>
          <Button 
            variant="secondary" 
            size="sm"
            className="flex items-center"
            onClick={() => fetchInstances()}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            Add Instance
          </Button>
        </ButtonGroup>
      </div>
      
      {/* Error */}
      {error && (
        <div className="p-4 text-red-400 bg-red-900/20 rounded-md">
          {error}
        </div>
      )}
      
      {/* Table */}
      <DataTable columns={columns} data={instances} />
      
      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-400">
          {instances.length > 0 ? (
            `Showing ${page * pageSize + 1} to ${page * pageSize + instances.length} of ${totalCount}`
          ) : (
            "No instances found"
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
          
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0 || refreshing}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="px-2 text-white">
              Page {page + 1} of {totalPages || 1}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1 || refreshing}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Config Sections */}
      <div className="grid grid-cols-2 gap-6">
        <DashboardSection title="Auto Scaling Configuration">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Min Instances</span>
              <span className="text-white">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max Instances</span>
              <span className="text-white">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scale Up</span>
              <span className="text-white">75% CPU for 5min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scale Down</span>
              <span className="text-white">30% CPU for 10min</span>
            </div>
          </div>
        </DashboardSection>
        
        <DashboardSection title="Health Checks">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-400">Passing</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint</span>
              <span className="text-white">/health</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Interval</span>
              <span className="text-white">30 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timeout</span>
              <span className="text-white">5 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Success Codes</span>
              <span className="text-white">200-299</span>
            </div>
          </div>
        </DashboardSection>
      </div>

      {/* Multiple Terminal Modals - Now using the Window component */}
      {Array.from(openTerminals.entries()).map(([terminalId, terminal]) => (
        <Window
          key={terminalId}
          isOpen={true}
          onClose={() => handleCloseTerminal(terminalId)}
          title={`Terminal - ${terminal.instance.id}`}
          icon={<TerminalIcon size={20} className="text-green-400" />}
          headerActions={createTerminalHeaderActions(terminal)}
          initialSize={{ width: 900, height: 600 }}
          minSize={{ width: 500, height: 400 }}
          className="font-mono"
        >
          <Terminal 
            instance={terminal.instance}
            onConnectionChange={(status) => handleTerminalStatusChange(terminalId, status)}
            className="h-full"
          />
        </Window>
      ))}
    </div>
  );
};

export default ApplicationInstances;