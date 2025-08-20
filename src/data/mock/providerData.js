/**
 * Mock Provider Overview Data
 * Contains mock data for provider cost data and charts
 */

// Cost data for provider charts
export const PROVIDER_COST_DATA = [
  { month: 'Sep', aws: 9500, gcp: 7800, azure: 7200 },
  { month: 'Oct', aws: 9800, gcp: 7900, azure: 7400 },
  { month: 'Nov', aws: 10100, gcp: 8000, azure: 7500 },
  { month: 'Dec', aws: 10300, gcp: 8100, azure: 7600 },
  { month: 'Jan', aws: 10400, gcp: 8150, azure: 7700 },
  { month: 'Feb', aws: 10500, gcp: 8200, azure: 7800 }
];

// Provider types and their colors
export const PROVIDER_TYPES = {
  AWS: {
    name: 'Amazon Web Services',
    color: '#ff9900',
    shortName: 'aws'
  },
  GCP: {
    name: 'Google Cloud Platform', 
    color: '#4285f4',
    shortName: 'gcp'
  },
  AZURE: {
    name: 'Microsoft Azure',
    color: '#0078d4',
    shortName: 'azure'
  },
  DO: {
    name: 'DigitalOcean',
    color: '#0080ff',
    shortName: 'digitalocean'
  }
};

// Sample provider statistics
export const PROVIDER_STATISTICS = {
  totalCost: 28500,
  totalInstances: 45,
  totalStorage: 2400, // GB
  totalBandwidth: 1200 // GB
};

// Provider regions data
export const PROVIDER_REGIONS = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', provider: 'AWS', instances: 12, cost: 3200 },
  { id: 'us-west-2', name: 'US West (Oregon)', provider: 'AWS', instances: 8, cost: 2100 },
  { id: 'eu-west-1', name: 'Europe (Ireland)', provider: 'AWS', instances: 6, cost: 1800 },
  { id: 'us-central1', name: 'US Central', provider: 'GCP', instances: 10, cost: 2800 },
  { id: 'europe-west1', name: 'Europe West', provider: 'GCP', instances: 5, cost: 1400 },
  { id: 'eastus', name: 'East US', provider: 'AZURE', instances: 9, cost: 2600 },
  { id: 'westeurope', name: 'West Europe', provider: 'AZURE', instances: 4, cost: 1200 }
];

// Service categories for providers
export const SERVICE_CATEGORIES = [
  { id: 'compute', name: 'Compute', icon: 'Server' },
  { id: 'storage', name: 'Storage', icon: 'Database' },
  { id: 'network', name: 'Network', icon: 'Network' },
  { id: 'security', name: 'Security', icon: 'Shield' },
  { id: 'analytics', name: 'Analytics', icon: 'BarChart' },
  { id: 'ml', name: 'Machine Learning', icon: 'Brain' }
];
