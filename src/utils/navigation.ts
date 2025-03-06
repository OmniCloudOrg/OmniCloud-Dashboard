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
        { icon: Home, label: 'Dashboard', id: 'dashboard' },
        {
          icon: Box,
          label: 'Applications',
          id: 'apps',
          submenu: [
            { label: 'All Apps', id: 'apps' },
            { label: 'Services', id: 'services' },
            { label: 'Web Apps', id: 'web-apps' },
            { label: 'Workflows', id: 'workflows' },
            { label: 'Deployments', id: 'deployments' }
          ]
        },
        {
          icon: Server,
          label: 'Infrastructure',
          id: 'infrastructure',
          submenu: [
            { label: 'All', id: 'infra' },
            { label: 'Instances', id: 'instances' },
            { label: 'Containers', id: 'containers' },
            { label: 'VM Images', id: 'vm-images' },
            { label: 'Container Registry', id: 'registry' }
          ]
        },
        {
          icon: Network,
          label: 'Ingress',
          id: 'ingress',
          submenu: [
            { label: 'Routes', id: 'ingress' },
            { label: 'Load Balancers', id: 'load-balancers' },
            { label: 'Domains', id: 'domains' },
            { label: 'Certificates', id: 'certificates' }
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
          id: 'providers',
          submenu: [
            { label: 'Overview', id: 'provider-overview' },
            { label: 'Connections', id: 'connections' },
            { label: 'Quotas', id: 'quotas' },
            { label: 'Cost Management', id: 'costs' }
          ]
        },
        {
          icon: Database,
          label: 'Storage',
          id: 'storage',
          submenu: [
            { label: 'Volumes', id: 'volumes' },
            { label: 'Object Storage', id: 'object-storage' },
            { label: 'Backups', id: 'backups' },
            { label: 'Snapshots', id: 'snapshots' }
          ]
        },
        {
          icon: GitBranch,
          label: 'CI/CD',
          id: 'cicd',
          submenu: [
            { label: 'Pipelines', id: 'pipelines' },
            { label: 'Build History', id: 'builds' },
            { label: 'Artifacts', id: 'artifacts' },
            { label: 'Environments', id: 'environments' }
          ]
        },
        {
          icon: LayoutGrid,
          label: 'Marketplace',
          id: 'marketplace'
        }
      ]
    },
    {
      title: 'Operations',
      items: [
        {
          icon: Activity,
          label: 'Monitoring',
          id: 'monitoring',
          submenu: [
            { label: 'General', id: 'monitoring' },
            { label: 'Metrics', id: 'metrics' },
            { label: 'Traces', id: 'traces' },
            { label: 'Service Maps', id: 'service-maps' }
          ]
        },
        {
          icon: Terminal,
          label: 'Logs',
          id: 'logs'
        },
        {
          icon: Bell,
          label: 'Alerts',
          id: 'alerts'
        },
        {
          icon: ArrowUpDown,
          label: 'Audit Trail',
          id: 'audit'
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          icon: Users,
          label: 'Team',
          id: 'team',
          submenu: [
            { label: 'Members', id: 'members' },
            { label: 'Roles', id: 'roles' },
            { label: 'Groups', id: 'groups' },
            { label: 'Invitations', id: 'invitations' }
          ]
        },
        {
          icon: Shield,
          label: 'Security',
          id: 'security',
          submenu: [
            { label: 'Authentication', id: 'auth' },
            { label: 'Policies', id: 'policies' },
            { label: 'API Keys', id: 'api-keys' },
            { label: 'Secrets', id: 'secrets' }
          ]
        },
        {
          icon: Settings,
          label: 'Platform Settings',
          id: 'settings'
        }
      ]
    }
  ];
  
  /**
   * Cloud provider options for filtering
   */
  export const cloudProviders: CloudProvider[] = [
    { id: 'all', name: 'All Providers' },
    { id: 'aws', name: 'AWS' },
    { id: 'gcp', name: 'GCP' },
    { id: 'azure', name: 'Azure' },
    { id: 'on-prem', name: 'On-Prem' }
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
    { type: 'app', name: 'frontend-service', environment: 'production', id: 'frontend-service' },
    { type: 'app', name: 'auth-api', environment: 'staging', id: 'auth-api' },
    { type: 'app', name: 'payment-service', environment: 'production', id: 'payment-service' },
    { type: 'app', name: 'user-management', environment: 'development', id: 'user-management' },
    { type: 'app', name: 'recommendation-engine', environment: 'staging', id: 'recommendation-engine' },
    
    // Instances
    { type: 'instance', name: 'api-gateway-2', status: 'running', id: 'api-gateway-2' },
    { type: 'instance', name: 'cache-server-1', status: 'running', id: 'cache-server-1' },
    { type: 'instance', name: 'db-replica-3', status: 'stopped', id: 'db-replica-3' },
    { type: 'instance', name: 'worker-node-5', status: 'running', id: 'worker-node-5' },
    { type: 'instance', name: 'analytics-server', status: 'restarting', id: 'analytics-server' },
    
    // Users
    { type: 'user', name: 'john.doe@example.com', role: 'Developer', id: 'john-doe' },
    { type: 'user', name: 'sarah.smith@example.com', role: 'Admin', id: 'sarah-smith' },
    { type: 'user', name: 'mike.jones@example.com', role: 'DevOps', id: 'mike-jones' },
    { type: 'user', name: 'lisa.wong@example.com', role: 'Product Manager', id: 'lisa-wong' },
    { type: 'user', name: 'alex.chen@example.com', role: 'Developer', id: 'alex-chen' },
    
    // Routes
    { type: 'route', name: 'api.example.com/v1', target: 'api-gateway', id: 'api-v1' },
    { type: 'route', name: 'admin.example.com', target: 'admin-dashboard', id: 'admin-route' },
    { type: 'route', name: 'cdn.example.com', target: 'content-delivery', id: 'cdn-route' },
    { type: 'route', name: 'auth.example.com', target: 'auth-service', id: 'auth-route' },
    { type: 'route', name: 'payments.example.com', target: 'payment-service', id: 'payments-route' },
    
    // Cloud resources
    { type: 'cloud', name: 'AWS US-EAST-1', status: 'healthy', id: 'aws-us-east-1' },
    { type: 'cloud', name: 'GCP EUROPE-WEST', status: 'healthy', id: 'gcp-europe-west' },
    { type: 'cloud', name: 'AZURE CENTRAL-US', status: 'warning', id: 'azure-central-us' },
    { type: 'cloud', name: 'AWS AP-SOUTHEAST', status: 'healthy', id: 'aws-ap-southeast' },
    { type: 'cloud', name: 'ON-PREM DATACENTER', status: 'healthy', id: 'on-prem-dc' },
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