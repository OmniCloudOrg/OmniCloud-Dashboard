import {
    Home, Server, Box, Cloud, Activity, Bell, Users, Settings, 
    Shield, CloudCog, Terminal, LayoutGrid, GitBranch, 
    ArrowUpDown, Network, Database, LucideIcon
  } from 'lucide-react';
  import { NavItemType, CloudProvider, HelpResource, SearchResult, Notification } from '../types';
  import { BookOpen, Video, MessageCircle, FileText } from 'lucide-react';
  
  /**
   * Navigation sections configuration for the dashboard
   */
  export const navSections: { title: string; items: NavItemType[] }[] = [
    {
      title: 'Core',
      items: [
        { icon: Home, label: 'Dashboard', id: 'dash/' },
        {
          icon: Box,
          label: 'Applications',
          id: 'dash/apps'
        },
        {
          icon: Server,
          label: 'Infrastructure',
          id: 'dash/infra'
        },
        {
          icon: Network,
          label: 'Ingress',
          id: 'dash/ingress',
          submenu: [
            { label: 'Routes', id: 'dash/ingress' },
            { label: 'Load Balancers', id: 'dash/load-balancers' },
            { label: 'Domains', id: 'dash/domains' },
            { label: 'Certificates', id: 'dash/certificates' }
          ]
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          icon: CloudCog,
          label: 'Cloud Providers',
          id: 'dash/provider-overview'
        },
        {
          icon: Database,
          label: 'Storage',
          id: 'dash/storage',
          submenu: [
            { label: 'Volumes', id: 'dash/volumes' },
            { label: 'Object Storage', id: 'dash/object-storage' },
            { label: 'Databases', id: 'dash/databases' },
            { label: 'Cache', id: 'dash/cache' },
            { label: 'Backups', id: 'dash/backups' },
            { label: 'Snapshots', id: 'dash/snapshots' }
          ]
        },
        {
          icon: GitBranch,
          label: 'CI/CD',
          id: 'dash/cicd',
          submenu: [
            { label: 'Pipelines', id: 'dash/pipelines' },
            { label: 'Artifacts', id: 'dash/artifacts' },
          ]
        },
        {
          icon: LayoutGrid,
          label: 'Marketplace',
          id: 'dash/marketplace'
        }
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          icon: Activity,
          label: 'Monitoring',
          id: 'dash/monitoring',
          submenu: [
            { label: 'General', id: 'dash/monitoring' },
            { label: 'Metrics', id: 'dash/metrics' },
            { label: 'Traces', id: 'dash/traces' }
          ]
        },
        {
          icon: Terminal,
          label: 'Logs',
          id: 'dash/logs'
        },
        {
          icon: Bell,
          label: 'Alerts',
          id: 'dash/alerts'
        },
        {
          icon: ArrowUpDown,
          label: 'Audit Trail',
          id: 'dash/audit'
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          icon: Users,
          label: 'Team',
          id: 'dash/team',
          submenu: [
            { label: 'Members', id: 'dash/members' },
            { label: 'Roles', id: 'dash/roles' },
            { label: 'Groups', id: 'dash/groups' },
            { label: 'Invitations', id: 'dash/invitations' }
          ]
        },
        {
          icon: Shield,
          label: 'Security',
          id: 'dash/security',
          submenu: [
            { label: 'Authentication', id: 'dash/auth' },
            { label: 'Policies', id: 'dash/policies' },
            { label: 'API Keys', id: 'dash/api-keys' },
            { label: 'Secrets', id: 'dash/secrets' }
          ]
        },
        {
          icon: Settings,
          label: 'Platform Configuration',
          id: 'dash/settings'
        }
      ]
    }
  ];
  
  /**
   * Cloud provider options for filtering
   */
  export const cloudProviders: CloudProvider[] = [
    { id: 'dash/all', name: 'All Providers' },
    { id: 'dash/aws', name: 'AWS' },
    { id: 'dash/gcp', name: 'GCP' },
    { id: 'dash/azure', name: 'Azure' },
    { id: 'dash/on-prem', name: 'On-Prem' }
  ];
  
  /**
   * Help resources configuration
   */
  export const helpResources: HelpResource[] = [
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Access platform guides and API reference',
      iconColor: 'blue'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Learn through step-by-step videos',
      iconColor: 'green'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat Support',
      description: 'Get help from our support team',
      iconColor: 'purple'
    },
    {
      icon: FileText,
      title: 'Knowledge Base',
      description: 'Browse common questions and solutions',
      iconColor: 'amber'
    }
  ];
  
  /**
   * Sample data for search results
   */
  export const sampleSearchResults: SearchResult[] = [
    // Apps
    { type: 'app', name: 'frontend-service', environment: 'production', id: 'dash/frontend-service' },
    { type: 'app', name: 'auth-api', environment: 'staging', id: 'dash/auth-api' },
    { type: 'app', name: 'payment-service', environment: 'production', id: 'dash/payment-service' },
    { type: 'app', name: 'user-management', environment: 'development', id: 'dash/user-management' },
    { type: 'app', name: 'recommendation-engine', environment: 'staging', id: 'dash/recommendation-engine' },
    
    // Instances
    { type: 'instance', name: 'api-gateway-2', status: 'running', id: 'dash/api-gateway-2' },
    { type: 'instance', name: 'cache-server-1', status: 'running', id: 'dash/cache-server-1' },
    { type: 'instance', name: 'db-replica-3', status: 'stopped', id: 'dash/db-replica-3' },
    { type: 'instance', name: 'worker-node-5', status: 'running', id: 'dash/worker-node-5' },
    { type: 'instance', name: 'analytics-server', status: 'restarting', id: 'dash/analytics-server' },
    
    // Users
    { type: 'user', name: 'john.doe@example.com', role: 'Developer', id: 'dash/john-doe' },
    { type: 'user', name: 'sarah.smith@example.com', role: 'Admin', id: 'dash/sarah-smith' },
    { type: 'user', name: 'mike.jones@example.com', role: 'DevOps', id: 'dash/mike-jones' },
    { type: 'user', name: 'lisa.wong@example.com', role: 'Product Manager', id: 'dash/lisa-wong' },
    { type: 'user', name: 'alex.chen@example.com', role: 'Developer', id: 'dash/alex-chen' },
    
    // Routes
    { type: 'route', name: 'api.example.com/v1', target: 'api-gateway', id: 'dash/api-v1' },
    { type: 'route', name: 'admin.example.com', target: 'admin-dashboard', id: 'dash/admin-route' },
    { type: 'route', name: 'cdn.example.com', target: 'content-delivery', id: 'dash/cdn-route' },
    { type: 'route', name: 'auth.example.com', target: 'auth-service', id: 'dash/auth-route' },
    { type: 'route', name: 'payments.example.com', target: 'payment-service', id: 'dash/payments-route' },
    
    // Cloud resources
    { type: 'cloud', name: 'AWS US-EAST-1', status: 'healthy', id: 'dash/aws-us-east-1' },
    { type: 'cloud', name: 'GCP EUROPE-WEST', status: 'healthy', id: 'dash/gcp-europe-west' },
    { type: 'cloud', name: 'AZURE CENTRAL-US', status: 'warning', id: 'dash/azure-central-us' },
    { type: 'cloud', name: 'AWS AP-SOUTHEAST', status: 'healthy', id: 'dash/aws-ap-southeast' },
    { type: 'cloud', name: 'ON-PREM DATACENTER', status: 'healthy', id: 'dash/on-prem-dc' },
  ];
  
  /**
   * Sample notifications data
   */
  export const sampleNotifications: Notification[] = [
    { id: 1, title: 'Deployment Completed', message: 'frontend-service was deployed successfully', time: '10 minutes ago', type: 'success' },
    { id: 2, title: 'High CPU Usage', message: 'api-gateway-2 instance is experiencing high CPU load', time: '25 minutes ago', type: 'warning' },
    { id: 3, title: 'New Team Member', message: 'Sarah Johnson has joined the organization', time: '2 hours ago', type: 'info' },
    { id: 4, title: 'Certificate Expiring', message: 'SSL certificate for api.example.com will expire in 7 days', time: '5 hours ago', type: 'warning' },
    { id: 5, title: 'Database Backup', message: 'Weekly database backup completed successfully', time: '1 day ago', type: 'success' }
  ];
  
  /**
   * Get the appropriate icon for a result type in the command palette
   */
  export const getIconForResultType = (type: string): LucideIcon => {
    switch (type) {
      case 'app': return Box;
      case 'instance': return Server;
      case 'user': return Users;
      case 'route': return Network;
      case 'cloud': return Cloud;
      default: return Box;
    }
  };
  
  /**
   * Get the appropriate icon and background color for notification types
   */
  export const getNotificationIcon = (type: string): { icon: LucideIcon; bgClass: string; textClass: string } => {
    switch (type) {
      case 'success': 
        return { 
          icon: Activity, 
          bgClass: 'bg-green-500/10', 
          textClass: 'text-green-400' 
        };
      case 'warning': 
        return { 
          icon: Bell, 
          bgClass: 'bg-amber-500/10', 
          textClass: 'text-amber-400' 
        };
      case 'info': 
        return { 
          icon: Users, 
          bgClass: 'bg-blue-500/10', 
          textClass: 'text-blue-400' 
        };
      case 'error': 
        return { 
          icon: Bell, 
          bgClass: 'bg-red-500/10', 
          textClass: 'text-red-400' 
        };
      default: 
        return { 
          icon: Box, 
          bgClass: 'bg-slate-500/10', 
          textClass: 'text-slate-400' 
        };
    }
  };
  
  /**
   * Get provider icon for cloud providers
   */
  export const getProviderIcon = (provider: string): string => {
    switch (provider.toLowerCase()) {
      case 'aws': return '🟧';
      case 'gcp': return '🟦';
      case 'azure': return '🟪';
      case 'on-prem': return '🟩';
      case 'all providers': return '⚙️';
      default: return '⬜';
    }
  };