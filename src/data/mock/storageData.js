/**
 * Mock Storage Data
 * Contains mock data for storage dashboard including volumes, storage classes, and configuration options
 */

// Write concern types for storage
export const WRITE_CONCERN_TYPES = [
  'All', 
  'WriteAcknowledged', 
  'WriteDurable', 
  'WriteReplicated', 
  'WriteDistributed'
];

// Persistence levels for storage
export const PERSISTENCE_LEVELS = [
  'All', 
  'Basic', 
  'Enhanced', 
  'High', 
  'Maximum'
];

// Storage volume types
export const STORAGE_VOLUME_TYPES = [
  { id: 'gp3', name: 'General Purpose SSD (gp3)', description: 'Balanced price and performance' },
  { id: 'gp2', name: 'General Purpose SSD (gp2)', description: 'Previous generation SSD' },
  { id: 'io2', name: 'Provisioned IOPS SSD (io2)', description: 'High performance SSD' },
  { id: 'sc1', name: 'Cold HDD (sc1)', description: 'Infrequent access workloads' },
  { id: 'st1', name: 'Throughput Optimized HDD (st1)', description: 'Frequently accessed workloads' }
];

// Storage class definitions
export const STORAGE_CLASSES = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'General purpose storage class',
    performanceTier: 'Standard',
    replication: 'Multi-AZ',
    encrypted: true
  },
  {
    id: 'fast',
    name: 'Fast',
    description: 'High performance storage class',
    performanceTier: 'High',
    replication: 'Single-AZ',
    encrypted: true
  },
  {
    id: 'archive',
    name: 'Archive',
    description: 'Long-term archival storage',
    performanceTier: 'Low',
    replication: 'Cross-Region',
    encrypted: true
  }
];

// Mock storage volumes
export const MOCK_STORAGE_VOLUMES = [
  {
    id: 'vol-0abc123def456',
    name: 'app-data-volume',
    size: 100,
    sizeUnit: 'GB',
    type: 'gp3',
    status: 'available',
    attachedTo: 'i-0123456789abcdef0',
    encrypted: true,
    createdAt: '2024-01-15T10:30:00Z',
    region: 'us-east-1',
    availabilityZone: 'us-east-1a'
  },
  {
    id: 'vol-0def456abc789',
    name: 'database-volume',
    size: 500,
    sizeUnit: 'GB',
    type: 'io2',
    status: 'in-use',
    attachedTo: 'i-0987654321fedcba0',
    encrypted: true,
    createdAt: '2024-01-10T14:20:00Z',
    region: 'us-east-1',
    availabilityZone: 'us-east-1b'
  },
  {
    id: 'vol-0ghi789jkl012',
    name: 'backup-storage',
    size: 1000,
    sizeUnit: 'GB',
    type: 'sc1',
    status: 'available',
    attachedTo: null,
    encrypted: false,
    createdAt: '2024-01-05T09:15:00Z',
    region: 'us-west-2',
    availabilityZone: 'us-west-2a'
  }
];

// Storage statistics
export const STORAGE_STATISTICS = {
  totalVolumes: 24,
  totalCapacity: 5200, // GB
  usedCapacity: 3800, // GB
  availableCapacity: 1400, // GB
  encryptedVolumes: 20,
  unencryptedVolumes: 4
};

// Storage performance metrics
export const STORAGE_PERFORMANCE_METRICS = {
  iops: {
    current: 1200,
    average: 980,
    peak: 1500
  },
  throughput: {
    current: 125, // MB/s
    average: 98,
    peak: 180
  },
  latency: {
    current: 2.5, // ms
    average: 3.2,
    lowest: 1.8
  }
};

// Storage cost breakdown
export const STORAGE_COST_DATA = [
  { type: 'gp3', cost: 120, percentage: 35 },
  { type: 'io2', cost: 180, percentage: 52 },
  { type: 'sc1', cost: 25, percentage: 7 },
  { type: 'st1', cost: 20, percentage: 6 }
];
