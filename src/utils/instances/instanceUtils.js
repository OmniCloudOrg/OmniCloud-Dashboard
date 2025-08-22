/**
 * Instance Utility Functions
 * Common operations for instance management
 */

import { INSTANCE_STATUS_MAPPING } from '@/data/instanceConstants';

/**
 * Format uptime from seconds to human readable format
 */
export const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
};

/**
 * Transform API instance data to UI format
 */
export const transformInstance = (instance) => ({
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

/**
 * Get instance status configuration
 */
export const getInstanceStatusConfig = (status) => {
  return INSTANCE_STATUS_MAPPING[status] || INSTANCE_STATUS_MAPPING.stopped;
};

/**
 * Generate pagination info text
 */
export const getPaginationInfo = (instances, page, pageSize, totalCount) => {
  if (instances.length === 0) {
    return "No instances found";
  }
  
  const start = page * pageSize + 1;
  const end = page * pageSize + instances.length;
  return `Showing ${start} to ${end} of ${totalCount}`;
};

/**
 * Validate if an instance action can be performed
 */
export const canPerformAction = (instance, action) => {
  switch (action) {
    case 'start':
      return instance.status === 'stopped';
    case 'stop':
      return instance.status === 'running' || instance.status === 'warning';
    case 'restart':
      return true; // Can always restart
    case 'terminal':
      return instance.status === 'running' || instance.status === 'warning';
    default:
      return false;
  }
};

/**
 * Generate unique terminal ID
 */
export const generateTerminalId = (instanceId, counter) => {
  return `${instanceId}-${counter}`;
};
