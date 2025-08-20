/**
 * Mock Marketplace Data
 * Contains mock data for marketplace items including integrations and dashboards
 */

import {
  CloudCog,
  BarChart4,
  ArrowUpDown,
  AlertCircle,
  Database,
  Code,
  Cpu,
  GitBranch,
  Network,
  Grid3x3,
  Info,
  CheckCircle2,
  BookOpen,
  Github,
  Shield
} from 'lucide-react';

// Tab navigation items for marketplace modal
export const MARKETPLACE_TAB_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'features', label: 'Features', icon: CheckCircle2 },
  { id: 'readme', label: 'README', icon: BookOpen },
  { id: 'repository', label: 'Repository', icon: Github },
  { id: 'permissions', label: 'Permissions', icon: Shield }
];

// Marketplace category filters
export const MARKETPLACE_CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid3x3 },
  { id: 'cpi', label: 'Integrations', icon: CloudCog },
  { id: 'dashboard', label: 'Dashboards', icon: BarChart4 }
];

// Sort options for marketplace
export const MARKETPLACE_SORT_OPTIONS = [
  { id: 'stars', label: 'Most Stars' },
  { id: 'recent', label: 'Recently Updated' },
  { id: 'name', label: 'Alphabetical' }
];

// Mock marketplace items
export const MARKETPLACE_ITEMS = [
  {
    id: 'aws-integration',
    name: 'aws-omnicloud-integration',
    repoUrl: 'github.com/cloud-extensions/aws-omnicloud-integration',
    authorName: 'cloud-extensions',
    description: 'Full integration with AWS services including EC2, S3, Lambda, CloudFront, and more. This extension provides seamless connection with AWS APIs.',
    type: 'cpi',
    icon: CloudCog,
    stars: 1847,
    forks: 312,
    issues: 24,
    contributors: 37,
    lastUpdated: '2 days ago',
    license: 'MIT',
    language: 'TypeScript',
    tags: ['AWS', 'Cloud', 'Infrastructure', 'EC2', 'S3'],
    installed: false,
    readmePreview: '# AWS OmniCloud Integration\n\nThis extension integrates AWS services with OmniCloud Platform.\n\n## Features\n\n- EC2 instance management\n- S3 bucket operations\n- Lambda function deployment\n- CloudWatch metrics visualization\n\n## Installation\n\n```bash\npm install aws-omnicloud-integration\n```',
    features: [
      'EC2 instance management',
      'S3 bucket operations',
      'Lambda function deployment',
      'CloudWatch metrics',
      'IAM role management',
      'Cost tracking',
      'CloudFront distributions',
      'RDS database connections'
    ],
    featureSections: [
      {
        title: 'Compute',
        description: 'Manage all your compute resources in one place.',
        items: [
          'EC2 instance provisioning and management',
          'Lambda function deployment and monitoring',
          'Auto-scaling group configuration',
          'Elastic Beanstalk environments'
        ]
      },
      {
        title: 'Storage',
        description: 'Complete control over your storage solutions.',
        items: [
          'S3 bucket creation and management',
          'File uploads and permissions',
          'EBS volume management',
          'Glacier archive access'
        ]
      }
    ],
    permissions: [
      'Connect to your AWS account',
      'View and manage EC2 instances',
      'Access S3 buckets and objects',
      'Manage Lambda functions',
      'View CloudWatch metrics'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'gcp-integration',
    name: 'gcp-platform-connector',
    repoUrl: 'github.com/google-cloud/gcp-platform-connector',
    authorName: 'google-cloud',
    description: 'Official Google Cloud Platform connector for OmniCloud. Integrate GCP services including Compute Engine, Cloud Storage, and BigQuery.',
    type: 'cpi',
    icon: CloudCog,
    stars: 2431,
    forks: 487,
    issues: 18,
    contributors: 52,
    lastUpdated: '5 days ago',
    license: 'Apache 2.0',
    language: 'JavaScript',
    tags: ['GCP', 'Google', 'Cloud', 'BigQuery', 'Compute Engine'],
    installed: false,
    features: [
      'Compute Engine VM management',
      'Cloud Storage integration',
      'Cloud Functions deployment',
      'BigQuery data analysis',
      'Kubernetes Engine clusters',
      'Cloud Run services',
      'IAM permission management',
      'Load balancer configuration'
    ],
    permissions: [
      'Connect to your GCP account',
      'View and manage Compute Engine VMs',
      'Access Cloud Storage',
      'Manage Cloud Functions',
      'Query data with BigQuery'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'azure-integration',
    name: 'azure-omnicloud-extension',
    repoUrl: 'github.com/ms-azure/azure-omnicloud-extension',
    authorName: 'ms-azure',
    description: 'Comprehensive Azure integration extension for OmniCloud. Integrates with Azure Resource Manager to provide full access to Azure services.',
    type: 'cpi',
    icon: CloudCog,
    stars: 1985,
    forks: 342,
    issues: 31,
    contributors: 46,
    lastUpdated: '1 week ago',
    license: 'MIT',
    language: 'TypeScript',
    tags: ['Azure', 'Microsoft', 'Cloud', 'ARM', 'AKS'],
    installed: false,
    features: [
      'Azure VM management',
      'Blob Storage access',
      'Azure Functions deployment',
      'Azure SQL Database',
      'Azure Kubernetes Service',
      'App Service deployment',
      'Azure Monitor integration',
      'Key Vault secrets management'
    ],
    permissions: [
      'Connect to your Azure account',
      'Manage Azure Virtual Machines',
      'Access Blob Storage',
      'Deploy and manage Azure Functions',
      'Monitor with Azure Insights'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'do-integration',
    name: 'digitalocean-connector',
    repoUrl: 'github.com/digitalocean/omnicloud-integration',
    authorName: 'digitalocean',
    description: 'Official DigitalOcean integration for OmniCloud. Connect and manage your DigitalOcean resources including Droplets, Spaces and App Platform.',
    type: 'cpi',
    icon: CloudCog,
    stars: 876,
    forks: 124,
    issues: 12,
    contributors: 17,
    lastUpdated: '2 weeks ago',
    license: 'BSD-3-Clause',
    language: 'Go',
    tags: ['DigitalOcean', 'Cloud', 'Droplets', 'Spaces', 'Kubernetes'],
    installed: true,
    features: [
      'Droplet provisioning',
      'Spaces object storage',
      'Load balancer management',
      'Kubernetes clusters',
      'App Platform deployment',
      'Databases management',
      'Floating IP assignment',
      'Firewall configuration'
    ],
    permissions: [
      'Connect to your DigitalOcean account',
      'Manage Droplets',
      'Access Spaces storage',
      'Deploy to App Platform',
      'Monitor Droplet metrics'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'resource-dashboard',
    name: 'unified-resource-dashboard',
    repoUrl: 'github.com/cloud-tools/unified-resource-dashboard',
    authorName: 'cloud-tools',
    description: 'Real-time dashboard for monitoring CPU, memory, storage and network usage across all your cloud resources. Features customizable alerts and historical trends.',
    type: 'dashboard',
    icon: BarChart4,
    stars: 3254,
    forks: 748,
    issues: 42,
    contributors: 73,
    lastUpdated: '3 days ago',
    license: 'MIT',
    language: 'JavaScript',
    tags: ['Monitoring', 'Analytics', 'Resources', 'Prometheus', 'Metrics'],
    installed: false,
    features: [
      'Real-time resource monitoring',
      'Custom alert creation',
      'Historical data analysis',
      'Anomaly detection',
      'Cross-provider metrics',
      'Custom dashboard layouts',
      'Metric exporters',
      'Notification integrations'
    ],
    permissions: [
      'Access resource metrics',
      'Display CPU/Memory/Disk usage',
      'Create custom alerts',
      'Track historical data',
      'Generate monitoring reports'
    ],
    screenshots: [1, 2, 3, 4]
  },
  {
    id: 'cost-analyzer',
    name: 'cloud-cost-analyzer',
    repoUrl: 'github.com/opencost/cloud-cost-analyzer',
    authorName: 'opencost',
    description: 'Open source cloud cost analyzer dashboard for multi-cloud environments. Provides comprehensive cost analysis with budget tracking and optimization recommendations.',
    type: 'dashboard',
    icon: ArrowUpDown,
    stars: 4216,
    forks: 862,
    issues: 37,
    contributors: 91,
    lastUpdated: '1 day ago',
    license: 'Apache 2.0',
    language: 'TypeScript',
    tags: ['Cost', 'Billing', 'Optimization', 'FinOps', 'Kubernetes'],
    installed: false,
    features: [
      'Multi-cloud cost tracking',
      'Budget alerts',
      'Cost forecasting',
      'Savings recommendations',
      'Resource attribution',
      'Usage-based allocation',
      'Cost comparison',
      'Export to CSV/Excel'
    ],
    permissions: [
      'Access billing information',
      'Track cloud spending',
      'Set budget alerts',
      'View cost forecasts',
      'Get saving recommendations'
    ],
    screenshots: [1, 2, 3]
  },
  {
    id: 'security-dashboard',
    name: 'cloud-security-center',
    repoUrl: 'github.com/security-hub/cloud-security-center',
    authorName: 'security-hub',
    description: 'Comprehensive security dashboard for monitoring cloud security posture. Features compliance checks, vulnerability scanning, and security recommendations.',
    type: 'dashboard',
    icon: AlertCircle,
    stars: 3864,
    forks: 642,
    issues: 29,
    contributors: 68,
    lastUpdated: '4 days ago',
    license: 'MPL-2.0',
    language: 'Python',
    tags: ['Security', 'Compliance', 'Audit', 'SIEM', 'Vulnerabilities'],
    installed: false,
    features: [
      'Security posture monitoring',
      'Compliance framework checks',
      'Vulnerability scanning',
      'Misconfiguration detection',
      'Access control auditing',
      'Threat intelligence',
      'Event correlation',
      'Remediation guidance'
    ],
    permissions: [
      'Scan for vulnerabilities',
      'Check security configurations',
      'Monitor access patterns',
      'Track compliance status',
      'Generate security reports'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'database-monitor',
    name: 'database-performance-monitor',
    repoUrl: 'github.com/db-tools/database-performance-monitor',
    authorName: 'db-tools',
    description: 'Advanced monitoring dashboard for all your databases with query performance analysis, connection tracking, and optimization tips.',
    type: 'dashboard',
    icon: Database,
    stars: 2987,
    forks: 513,
    issues: 22,
    contributors: 54,
    lastUpdated: '1 week ago',
    license: 'MIT',
    language: 'JavaScript',
    tags: ['Database', 'Performance', 'SQL', 'NoSQL', 'Monitoring'],
    installed: true,
    features: [
      'Query performance analysis',
      'Connection pool monitoring',
      'Index usage statistics',
      'Slow query tracking',
      'Schema visualization',
      'Storage metrics',
      'Automated recommendations',
      'Multi-database support'
    ],
    permissions: [
      'Connect to database instances',
      'Monitor query performance',
      'Track connection stats',
      'Analyze slow queries',
      'Generate performance reports'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'terraform-dashboard',
    name: 'terraform-visualizer',
    repoUrl: 'github.com/terraform-tools/terraform-visualizer',
    authorName: 'terraform-tools',
    description: 'Interactive dashboard for visualizing and managing Terraform infrastructure. Features graphical representation of resources and cost estimation.',
    type: 'dashboard',
    icon: Code,
    stars: 3142,
    forks: 486,
    issues: 33,
    contributors: 62,
    lastUpdated: '3 days ago',
    license: 'MIT',
    language: 'TypeScript',
    tags: ['Terraform', 'IaC', 'Infrastructure', 'Visualization', 'DevOps'],
    installed: false,
    features: [
      'Resource dependency visualization',
      'Plan visualization',
      'Drift detection',
      'Cost estimation',
      'Change history',
      'State management',
      'Module browser',
      'Resource search'
    ],
    permissions: [
      'Read Terraform state files',
      'Execute Terraform plan commands',
      'Visualize infrastructure graphs',
      'Track resource changes',
      'Estimate deployment costs'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'kubernetes-dashboard',
    name: 'k8s-command-center',
    repoUrl: 'github.com/k8s-tools/k8s-command-center',
    authorName: 'k8s-tools',
    description: 'Comprehensive Kubernetes dashboard that extends the standard Kubernetes Dashboard with advanced features. Includes multi-cluster management and resource optimization.',
    type: 'dashboard',
    icon: Cpu,
    stars: 5124,
    forks: 896,
    issues: 41,
    contributors: 87,
    lastUpdated: '6 hours ago',
    license: 'Apache 2.0',
    language: 'TypeScript',
    tags: ['Kubernetes', 'K8s', 'Containers', 'DevOps', 'Orchestration'],
    installed: false,
    features: [
      'Multi-cluster management',
      'Pod lifecycle visualization',
      'Resource quota monitoring',
      'Deployment workflows',
      'HPA configuration',
      'Service mesh integration',
      'Log streaming',
      'RBAC management'
    ],
    permissions: [
      'Connect to Kubernetes clusters',
      'View and manage Kubernetes resources',
      'Deploy applications to clusters',
      'View container logs and metrics',
      'Manage cluster configurations'
    ],
    screenshots: [1, 2, 3]
  },
  {
    id: 'cicd-dashboard',
    name: 'pipeline-central',
    repoUrl: 'github.com/devops-central/pipeline-central',
    authorName: 'devops-central',
    description: 'Universal CI/CD pipeline dashboard that integrates with popular CI/CD systems including GitHub Actions, GitLab CI, Jenkins, CircleCI, and Travis CI.',
    type: 'dashboard',
    icon: GitBranch,
    stars: 2865,
    forks: 431,
    issues: 28,
    contributors: 49,
    lastUpdated: '5 days ago',
    license: 'MIT',
    language: 'JavaScript',
    tags: ['CI/CD', 'DevOps', 'Pipelines', 'Testing', 'Automation'],
    installed: false,
    features: [
      'Multi-vendor CI/CD support',
      'Pipeline visualization',
      'Build analytics',
      'Test result tracking',
      'Deployment tracking',
      'Quality metrics',
      'Custom notifications',
      'Pipeline templates'
    ],
    permissions: [
      'Connect to CI/CD systems',
      'View pipeline execution status',
      'Access build logs and artifacts',
      'Track deployments across environments',
      'Receive build notifications'
    ],
    screenshots: [1, 2]
  },
  {
    id: 'network-analyzer',
    name: 'cloud-network-analyzer',
    repoUrl: 'github.com/net-tools/cloud-network-analyzer',
    authorName: 'net-tools',
    description: 'Comprehensive network analysis dashboard for cloud environments. Visualizes network traffic patterns, detects bottlenecks, and monitors latency.',
    type: 'dashboard',
    icon: Network,
    stars: 1897,
    forks: 321,
    issues: 19,
    contributors: 32,
    lastUpdated: '1 week ago',
    license: 'Apache 2.0',
    language: 'Go',
    tags: ['Networking', 'Traffic Analysis', 'Security', 'Latency', 'VPC'],
    installed: false,
    features: [
      'Traffic flow visualization',
      'Latency monitoring',
      'Bandwidth utilization',
      'Security group analysis',
      'Network topology mapping',
      'Performance bottlenecks',
      'Packet loss tracking',
      'Route table visualization'
    ],
    permissions: [
      'Access network configuration',
      'Monitor network traffic patterns',
      'Analyze security groups and ACLs',
      'Track network performance metrics',
      'Generate network topology maps'
    ],
    screenshots: [1, 2]
  }
];
