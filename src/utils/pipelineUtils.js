// Pipeline utility functions for data transformation and processing

// Transform pipeline data to UI format
export const transformPipeline = (pipeline) => {
  return {
    id: pipeline.id,
    name: pipeline.name,
    status: pipeline.status || 'unknown',
    branch: pipeline.branch || 'main',
    lastRun: pipeline.lastRun || new Date().toISOString(),
    duration: pipeline.duration || 0,
    repository: pipeline.repository || '',
    description: pipeline.description || '',
    environment: pipeline.environment || 'production',
    triggeredBy: pipeline.triggeredBy || 'manual',
    buildNumber: pipeline.buildNumber || 0,
    deploymentUrl: pipeline.deploymentUrl || '',
    artifacts: pipeline.artifacts || [],
    stages: pipeline.stages || []
  };
};

// Filter pipelines based on search and filter criteria
export const filterPipelines = (pipelines, filters) => {
  if (!pipelines || !Array.isArray(pipelines)) {
    return [];
  }

  const {
    search = '',
    status = 'all',
    branch = 'all',
    environment = 'all'
  } = filters;

  return pipelines.filter(pipeline => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        pipeline.name.toLowerCase().includes(searchLower) ||
        pipeline.description.toLowerCase().includes(searchLower) ||
        pipeline.repository.toLowerCase().includes(searchLower) ||
        pipeline.branch.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (status !== 'all' && pipeline.status !== status) {
      return false;
    }

    // Branch filter
    if (branch !== 'all' && pipeline.branch !== branch) {
      return false;
    }

    // Environment filter
    if (environment !== 'all' && pipeline.environment !== environment) {
      return false;
    }

    return true;
  });
};

// Format pipeline duration
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0s';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

// Format relative time
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
};

// Get status color class
export const getStatusColor = (status) => {
  const statusColors = {
    'success': 'text-green-400',
    'running': 'text-blue-400',
    'failed': 'text-red-400',
    'pending': 'text-yellow-400',
    'cancelled': 'text-gray-400',
    'unknown': 'text-gray-400'
  };

  return statusColors[status] || statusColors.unknown;
};

// Get status background color
export const getStatusBackground = (status) => {
  const statusBackgrounds = {
    'success': 'bg-green-500/10 border-green-500/20',
    'running': 'bg-blue-500/10 border-blue-500/20',
    'failed': 'bg-red-500/10 border-red-500/20',
    'pending': 'bg-yellow-500/10 border-yellow-500/20',
    'cancelled': 'bg-gray-500/10 border-gray-500/20',
    'unknown': 'bg-gray-500/10 border-gray-500/20'
  };

  return statusBackgrounds[status] || statusBackgrounds.unknown;
};

// Validate pipeline data
export const validatePipelineData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Pipeline name is required');
  }

  if (data.name && data.name.length > 100) {
    errors.push('Pipeline name must be less than 100 characters');
  }

  if (!data.repository || data.repository.trim().length === 0) {
    errors.push('Repository is required');
  }

  if (data.repository && !isValidUrl(data.repository)) {
    errors.push('Repository must be a valid URL');
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

// Sort pipelines by various criteria
export const sortPipelines = (pipelines, sortBy, sortOrder = 'asc') => {
  if (!pipelines || !Array.isArray(pipelines)) {
    return [];
  }

  const sorted = [...pipelines].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle dates
    if (sortBy === 'lastRun') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // Handle strings
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
export const getUniqueFilterValues = (pipelines, field) => {
  if (!pipelines || !Array.isArray(pipelines)) {
    return [];
  }

  const values = pipelines
    .map(pipeline => pipeline[field])
    .filter(value => value && value !== 'unknown')
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  return values;
};

// Calculate pipeline metrics
export const calculatePipelineMetrics = (pipelines) => {
  if (!pipelines || !Array.isArray(pipelines) || pipelines.length === 0) {
    return {
      totalPipelines: 0,
      successfulPipelines: 0,
      failedPipelines: 0,
      runningPipelines: 0,
      averageDuration: 0,
      successRate: 0
    };
  }

  const metrics = pipelines.reduce((acc, pipeline) => {
    // Count by status
    if (pipeline.status === 'success') acc.successfulPipelines++;
    else if (pipeline.status === 'failed') acc.failedPipelines++;
    else if (pipeline.status === 'running') acc.runningPipelines++;

    // Sum duration
    acc.totalDuration += pipeline.duration || 0;

    return acc;
  }, {
    successfulPipelines: 0,
    failedPipelines: 0,
    runningPipelines: 0,
    totalDuration: 0
  });

  const successRate = pipelines.length > 0 
    ? (metrics.successfulPipelines / pipelines.length) * 100 
    : 0;

  const averageDuration = pipelines.length > 0 
    ? metrics.totalDuration / pipelines.length 
    : 0;

  return {
    totalPipelines: pipelines.length,
    successfulPipelines: metrics.successfulPipelines,
    failedPipelines: metrics.failedPipelines,
    runningPipelines: metrics.runningPipelines,
    averageDuration: Math.round(averageDuration),
    successRate: Math.round(successRate * 10) / 10
  };
};
