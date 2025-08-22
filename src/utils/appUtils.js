// Transform API application data to UI format
export const transformApplication = (app) => {
  return {
    id: app.id,
    name: app.name,
    status: app.status || 'unknown',
    health: app.health || 'unknown',
    platform: app.platform || 'unknown',
    region: app.region || 'unknown',
    git_branch: app.git_branch || 'main',
    instances: app.instances || 0,
    version: app.version || '1.0.0',
    created_at: app.created_at,
    updated_at: app.updated_at,
    description: app.description || '',
    repository_url: app.repository_url || '',
    deployment_url: app.deployment_url || '',
    cpu_usage: app.cpu_usage || 0,
    memory_usage: app.memory_usage || 0,
    disk_usage: app.disk_usage || 0,
    uptime: app.uptime || 0,
    last_deployment: app.last_deployment,
    environment: app.environment || 'production',
    framework: app.framework || '',
    language: app.language || '',
    build_status: app.build_status || 'unknown'
  };
};

// Filter applications based on search and filter criteria
export const filterApplications = (applications, filters) => {
  if (!applications || !Array.isArray(applications)) {
    return [];
  }

  const {
    search = '',
    status = 'all',
    region = 'all',
    git_branch = 'all'
  } = filters;

  return applications.filter(app => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        app.name.toLowerCase().includes(searchLower) ||
        app.description.toLowerCase().includes(searchLower) ||
        app.framework.toLowerCase().includes(searchLower) ||
        app.language.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (status !== 'all' && app.status !== status) {
      return false;
    }

    // Region filter
    if (region !== 'all' && app.region !== region) {
      return false;
    }

    // Git branch filter
    if (git_branch !== 'all' && app.git_branch !== git_branch) {
      return false;
    }

    return true;
  });
};

// Format uptime duration
export const formatUptime = (seconds) => {
  if (!seconds || seconds < 0) return '0m';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Format memory/disk size
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%';
  return `${value.toFixed(decimals)}%`;
};

// Get status color class
export const getStatusColor = (status) => {
  const statusColors = {
    'running': 'text-green-400',
    'stopped': 'text-red-400',
    'pending': 'text-yellow-400',
    'deploying': 'text-blue-400',
    'error': 'text-red-400',
    'warning': 'text-orange-400',
    'unknown': 'text-gray-400'
  };

  return statusColors[status] || statusColors.unknown;
};

// Get health status color
export const getHealthColor = (health) => {
  const healthColors = {
    'healthy': 'text-green-400',
    'unhealthy': 'text-red-400',
    'degraded': 'text-yellow-400',
    'unknown': 'text-gray-400'
  };

  return healthColors[health] || healthColors.unknown;
};

// Validate application data
export const validateApplicationData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Application name is required');
  }

  if (data.name && data.name.length > 50) {
    errors.push('Application name must be less than 50 characters');
  }

  if (!data.repository_url || data.repository_url.trim().length === 0) {
    errors.push('Repository URL is required');
  }

  if (data.repository_url && !isValidUrl(data.repository_url)) {
    errors.push('Repository URL must be a valid URL');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Sort applications by various criteria
export const sortApplications = (applications, sortBy, sortOrder = 'asc') => {
  if (!applications || !Array.isArray(applications)) {
    return [];
  }

  const sorted = [...applications].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
};

// Get unique values for filter options
export const getUniqueFilterValues = (applications, field) => {
  if (!applications || !Array.isArray(applications)) {
    return [];
  }

  const values = applications
    .map(app => app[field])
    .filter(value => value && value !== 'unknown')
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  return values;
};

// Calculate application metrics
export const calculateApplicationMetrics = (applications) => {
  if (!applications || !Array.isArray(applications) || applications.length === 0) {
    return {
      totalApplications: 0,
      runningApplications: 0,
      stoppedApplications: 0,
      errorApplications: 0,
      averageCpuUsage: 0,
      averageMemoryUsage: 0,
      totalInstances: 0
    };
  }

  const metrics = applications.reduce((acc, app) => {
    // Count by status
    if (app.status === 'running') acc.runningApplications++;
    else if (app.status === 'stopped') acc.stoppedApplications++;
    else if (app.status === 'error') acc.errorApplications++;

    // Sum usage values
    acc.totalCpuUsage += app.cpu_usage || 0;
    acc.totalMemoryUsage += app.memory_usage || 0;
    acc.totalInstances += app.instances || 0;

    return acc;
  }, {
    runningApplications: 0,
    stoppedApplications: 0,
    errorApplications: 0,
    totalCpuUsage: 0,
    totalMemoryUsage: 0,
    totalInstances: 0
  });

  return {
    totalApplications: applications.length,
    runningApplications: metrics.runningApplications,
    stoppedApplications: metrics.stoppedApplications,
    errorApplications: metrics.errorApplications,
    averageCpuUsage: applications.length > 0 ? metrics.totalCpuUsage / applications.length : 0,
    averageMemoryUsage: applications.length > 0 ? metrics.totalMemoryUsage / applications.length : 0,
    totalInstances: metrics.totalInstances
  };
};
