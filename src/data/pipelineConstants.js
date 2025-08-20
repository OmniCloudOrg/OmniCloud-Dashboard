/**
 * Pipeline Constants and Mock Data
 * Centralized location for all pipeline-related static data
 */

// Pipeline pagination defaults
export const PIPELINE_PAGINATION_DEFAULTS = {
  pageSize: 12,
  pageSizeOptions: [6, 12, 18, 24],
  maxPageSize: 50
};

// Sample pipelines data
export const SAMPLE_PIPELINES = [
  { 
    id: 1, 
    name: 'Web App Pipeline', 
    repository: 'acme/web-app', 
    branch: 'main', 
    successRate: 94, 
    lastRunStatus: 'success', 
    lastRun: '2 hours ago', 
    avgDuration: '4m 32s' 
  },
  { 
    id: 2, 
    name: 'API Service Pipeline', 
    repository: 'acme/api-service', 
    branch: 'main', 
    successRate: 87, 
    lastRunStatus: 'failed', 
    lastRun: '5 hours ago', 
    avgDuration: '3m 45s' 
  },
  { 
    id: 3, 
    name: 'Mobile App Pipeline', 
    repository: 'acme/mobile-app', 
    branch: 'develop', 
    successRate: 92, 
    lastRunStatus: 'success', 
    lastRun: '1 day ago', 
    avgDuration: '5m 12s' 
  },
  { 
    id: 4, 
    name: 'Auth Service Pipeline', 
    repository: 'acme/auth-service', 
    branch: 'main', 
    successRate: 89, 
    lastRunStatus: 'success', 
    lastRun: '2 days ago', 
    avgDuration: '2m 50s' 
  },
  { 
    id: 5, 
    name: 'Data Processing Pipeline', 
    repository: 'acme/data-processor', 
    branch: 'main', 
    successRate: 76, 
    lastRunStatus: 'warning', 
    lastRun: '3 days ago', 
    avgDuration: '8m 15s' 
  },
  { 
    id: 6, 
    name: 'Email Service Pipeline', 
    repository: 'acme/email-service', 
    branch: 'develop', 
    successRate: 91, 
    lastRunStatus: 'running', 
    lastRun: '10 minutes ago', 
    avgDuration: 'Running' 
  }
];

// Sample builds data
export const SAMPLE_BUILDS = [
  { 
    id: 'build-001', 
    pipeline: 'Web App Pipeline', 
    status: 'success', 
    commit: 'a1b2c3d', 
    branch: 'main', 
    started: '2 hours ago', 
    duration: '4m 32s' 
  },
  { 
    id: 'build-002', 
    pipeline: 'API Service Pipeline', 
    status: 'failed', 
    commit: 'b2c3d4e', 
    branch: 'main', 
    started: '5 hours ago', 
    duration: '3m 45s' 
  },
  { 
    id: 'build-003', 
    pipeline: 'Mobile App Pipeline', 
    status: 'success', 
    commit: 'c3d4e5f', 
    branch: 'develop', 
    started: '1 day ago', 
    duration: '5m 12s' 
  },
  { 
    id: 'build-004', 
    pipeline: 'Auth Service Pipeline', 
    status: 'success', 
    commit: 'd4e5f6g', 
    branch: 'main', 
    started: '2 days ago', 
    duration: '2m 50s' 
  },
  { 
    id: 'build-005', 
    pipeline: 'Data Processing Pipeline', 
    status: 'warning', 
    commit: 'e5f6g7h', 
    branch: 'main', 
    started: '3 days ago', 
    duration: '8m 15s' 
  },
  { 
    id: 'build-006', 
    pipeline: 'Email Service Pipeline', 
    status: 'running', 
    commit: 'f6g7h8i', 
    branch: 'develop', 
    started: '10 minutes ago', 
    duration: 'Running' 
  }
];

// Sample artifacts data
export const SAMPLE_ARTIFACTS = [
  { 
    id: 'artifact-001', 
    name: 'web-app-bundle.zip', 
    pipeline: 'Web App Pipeline', 
    size: '24.5 MB', 
    created: '2 hours ago' 
  },
  { 
    id: 'artifact-002', 
    name: 'api-service-bundle.zip', 
    pipeline: 'API Service Pipeline', 
    size: '18.2 MB', 
    created: '5 hours ago' 
  },
  { 
    id: 'artifact-003', 
    name: 'mobile-app-bundle.zip', 
    pipeline: 'Mobile App Pipeline', 
    size: '32.7 MB', 
    created: '1 day ago' 
  },
  { 
    id: 'artifact-004', 
    name: 'auth-service-bundle.zip', 
    pipeline: 'Auth Service Pipeline', 
    size: '15.3 MB', 
    created: '2 days ago' 
  },
  { 
    id: 'artifact-005', 
    name: 'data-processor-bundle.zip', 
    pipeline: 'Data Processing Pipeline', 
    size: '42.1 MB', 
    created: '3 days ago' 
  },
  { 
    id: 'artifact-006', 
    name: 'email-service-bundle.zip', 
    pipeline: 'Email Service Pipeline', 
    size: '12.8 MB', 
    created: '2 hours ago' 
  }
];

// Sample environments data
export const SAMPLE_ENVIRONMENTS = [
  { 
    id: 1, 
    name: 'Production', 
    status: 'healthy', 
    applications: 6, 
    lastDeployed: '1 day ago', 
    version: 'v2.3.4' 
  },
  { 
    id: 2, 
    name: 'Staging', 
    status: 'healthy', 
    applications: 6, 
    lastDeployed: '5 hours ago', 
    version: 'v2.3.5-rc.1' 
  },
  { 
    id: 3, 
    name: 'Development', 
    status: 'warning', 
    applications: 6, 
    lastDeployed: '2 hours ago', 
    version: 'v2.3.5-dev' 
  },
  { 
    id: 4, 
    name: 'QA', 
    status: 'healthy', 
    applications: 5, 
    lastDeployed: '12 hours ago', 
    version: 'v2.3.5-beta.2' 
  }
];

// Pipeline tabs configuration
export const PIPELINE_TABS = [
  { id: 'pipelines', label: 'Pipelines' },
  { id: 'builds', label: 'Build History' },
  { id: 'artifacts', label: 'Artifacts' },
  { id: 'environments', label: 'Environments' }
];

// Pipeline status filters
export const PIPELINE_STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'running', label: 'Running' },
  { value: 'warning', label: 'Warning' }
];
