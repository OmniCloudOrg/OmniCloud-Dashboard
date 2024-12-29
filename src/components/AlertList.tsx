import React from 'react';
import { 
  AlertCircle, 
  Brain, 
  AlertTriangle, 
  ActivitySquare,
  Cpu,
  Network
} from 'lucide-react';
import DataTable from './Base/ListFilter';

// Keep existing type definitions and utility functions...
const generateRandomTimestamp = () => {
  const now = new Date();
  return new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
};

interface MLAlert {
  id: number;
  timestamp: Date;
  type: 'error' | 'warning' | 'info' | 'ml_insight';
  service: 'auth' | 'api' | 'database' | 'cache' | 'compute' | 'storage';
  title: string;
  description: string;
  status: 'resolved' | 'acknowledged';
  severity: 1 | 2 | 3 | 4 | 5;
  affectedInstances: number;
  mlCategory: 'anomaly' | 'prediction' | 'pattern' | 'correlation';
  mlConfidence: number;
  relatedAlerts: number;
  region: 'us-east' | 'us-west' | 'eu-west' | 'ap-south';
}

const generateMockAlerts = (count: number): MLAlert[] => {
  const types: MLAlert['type'][] = ['error', 'warning', 'info', 'ml_insight'];
  const services: MLAlert['service'][] = ['auth', 'api', 'database', 'cache', 'compute', 'storage'];
  const mlCategories: MLAlert['mlCategory'][] = ['anomaly', 'prediction', 'pattern', 'correlation'];
  const regions: MLAlert['region'][] = ['us-east', 'us-west', 'eu-west', 'ap-south'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    timestamp: generateRandomTimestamp(),
    type: types[Math.floor(Math.random() * types.length)],
    service: services[Math.floor(Math.random() * services.length)],
    title: `Alert ${i}`,
    description: `Detailed description for alert ${i}`,
    status: Math.random() > 0.7 ? 'resolved' : 'acknowledged',
    severity: Math.floor(Math.random() * 5) + 1 as MLAlert['severity'],
    affectedInstances: Math.floor(Math.random() * 100),
    mlCategory: mlCategories[Math.floor(Math.random() * mlCategories.length)],
    mlConfidence: Math.random() * 100,
    relatedAlerts: Math.floor(Math.random() * 5),
    region: regions[Math.floor(Math.random() * regions.length)]
  }));
};

interface AlertTypeIconProps {
  type: 'error' | 'warning' | 'info' | 'ml_insight';
}

const getAlertTypeIcon = (type: AlertTypeIconProps['type']) => {
  switch (type) {
    case 'error':
      return <AlertCircle className="text-red-400" />;
    case 'warning':
      return <AlertTriangle className="text-yellow-400" />;
    case 'ml_insight':
      return <Brain className="text-purple-400" />;
    default:
      return <AlertCircle className="text-blue-400" />;
  }
};

interface SeverityColorProps {
  severity: 1 | 2 | 3 | 4 | 5;
}

const getSeverityColor = (severity: SeverityColorProps['severity']): string => {
  switch (severity) {
    case 5:
      return 'bg-red-500';
    case 4:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 2:
      return 'bg-blue-500';
    default:
      return 'bg-slate-500';
  }
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className={`${color} bg-white/5 p-2 rounded-lg`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-sm font-medium text-slate-400">{label}</div>
        <div className="text-2xl font-semibold text-white">{value}</div>
      </div>
    </div>
  </div>
);

const AlertsView = () => {
  // Generate mock alerts
  const alerts = generateMockAlerts(100);

  // Calculate stats
  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 5).length,
    mlInsights: alerts.filter(a => a.type === 'ml_insight').length,
    active: alerts.filter(a => a.status !== 'resolved').length
  };

  // Filter configurations
  const filterConfigs = [
    {
      id: 'service',
      label: 'Service',
      icon: Cpu,
      options: [
        { value: 'all', label: 'All Services' },
        { value: 'auth', label: 'Authentication' },
        { value: 'api', label: 'API Gateway' },
        { value: 'database', label: 'Database' },
        { value: 'cache', label: 'Cache' },
        { value: 'compute', label: 'Compute' },
        { value: 'storage', label: 'Storage' }
      ]
    },
    {
      id: 'severity',
      label: 'Severity',
      icon: AlertTriangle,
      options: [
        { value: 'all', label: 'All Severities' },
        { value: '5', label: 'Critical' },
        { value: '4', label: 'High' },
        { value: '3', label: 'Medium' },
        { value: '2', label: 'Low' },
        { value: '1', label: 'Info' }
      ]
    },
    {
      id: 'region',
      label: 'Region',
      icon: Network,
      options: [
        { value: 'all', label: 'All Regions' },
        { value: 'us-east', label: 'US East' },
        { value: 'us-west', label: 'US West' },
        { value: 'eu-west', label: 'EU West' },
        { value: 'ap-south', label: 'AP South' }
      ]
    }
  ];

  // Column configurations - Key changes here to fix the data display
  interface AlertRow {
    alert: MLAlert;
    id: number;
  }

  interface TableColumn {
    key: 'alert' | 'id';
    header: string;
    sortable: boolean;
    render: (value: any, row: AlertRow) => React.ReactNode;
  }

    const columns: TableColumn[] = [
      {
        key: 'alert',
        header: 'Alert',
        sortable: true,
        render: (_: any, row: AlertRow) => (
          <div className="flex items-center gap-2">
            {getAlertTypeIcon(row.alert.type)}
            <span>{row.alert.title}</span>
            <div className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getSeverityColor(row.alert.severity)}`}>
              Severity {row.alert.severity}
            </div>
            {row.alert.type === 'ml_insight' && (
              <div className="px-2 py-0.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">
                ML {row.alert.mlConfidence?.toFixed(1)}%
              </div>
            )}
          </div>
        )
      },
      {
        key: 'alert',
        header: 'Description',
        sortable: true,
        render: (_: any, row: AlertRow) => row.alert.description
      },
      {
        key: 'alert',
        header: 'Service',
        sortable: true,
        render: (_: any, row: AlertRow) => row.alert.service
      },
      {
        key: 'alert',
        header: 'Region',
        sortable: true,
        render: (_: any, row: AlertRow) => row.alert.region
      },
      {
        key: 'alert',
        header: 'Timestamp',
        sortable: true,
        render: (_: any, row: AlertRow) => row.alert.timestamp ? row.alert.timestamp.toLocaleString() : '-'
      },
      {
        key: 'alert',
        header: 'Status',
        sortable: true,
        render: (_: any, row: AlertRow) => (
          <div className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            row.alert.status === 'resolved' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
          }`}>
            {row.alert.status ? row.alert.status.charAt(0).toUpperCase() + row.alert.status.slice(1) : 'Unknown'}
          </div>
        )
      }
    ];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Total Alerts"
          value={alertStats.total}
          icon={AlertCircle}
          color="text-blue-400"
        />
        <StatCard 
          label="Critical"
          value={alertStats.critical}
          icon={AlertTriangle}
          color="text-red-400"
        />
        <StatCard 
          label="ML Insights"
          value={alertStats.mlInsights}
          icon={Brain}
          color="text-purple-400"
        />
        <StatCard 
          label="Active"
          value={alertStats.active}
          icon={ActivitySquare}
          color="text-yellow-400"
        />
      </div>

      <DataTable 
        data={alerts.map(alert => ({ alert, id: alert.id }))}
        columns={columns}
        filterConfigs={filterConfigs}
        searchKeys={['alert']}
        onRowClick={(row) => {
          console.log('Clicked alert:', row.alert);
        }}
      />
    </div>
  );
};

export default AlertsView;