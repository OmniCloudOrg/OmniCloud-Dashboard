import React, { useMemo } from 'react';
import { 
  AlertCircle, 
  Brain, 
  AlertTriangle, 
  ActivitySquare,
  Cpu,
  Network
} from 'lucide-react';
import DataTable, { FilterConfig, ColumnConfig } from './Base/ListFilter';

// Alert type matching the original mock data
type Alert = {
  id: string;
  timestamp: Date;
  type: 'error' | 'warning' | 'info' | 'ml_insight';
  service: string;
  title: string;
  description: string;
  status: 'active' | 'resolved' | 'acknowledged';
  severity: number;
  affectedInstances: number;
  mlCategory?: string;
  mlConfidence?: number;
  region: string;
  relatedAlerts: number;
};

// Utility to generate mock alerts (same as in original code)
const generateRandomTimestamp = () => {
  const now = new Date();
  return new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
};

const generateMockAlerts = (count: number): Alert[] => {
  const types: Alert['type'][] = ['error', 'warning', 'info', 'ml_insight'];
  const services = ['auth', 'api', 'database', 'cache', 'compute', 'storage'];
  const mlCategories = ['anomaly', 'prediction', 'pattern', 'correlation'];
  const regions = ['us-east', 'us-west', 'eu-west', 'ap-south'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `alert-${i}`,
    timestamp: generateRandomTimestamp(),
    type: types[Math.floor(Math.random() * types.length)],
    service: services[Math.floor(Math.random() * services.length)],
    title: `Alert ${i}`,
    description: `Detailed description for alert ${i}`,
    status: Math.random() > 0.7 ? 'resolved' : 'acknowledged',
    severity: Math.floor(Math.random() * 5) + 1,
    affectedInstances: Math.floor(Math.random() * 100),
    mlCategory: mlCategories[Math.floor(Math.random() * mlCategories.length)],
    mlConfidence: Math.random() * 100,
    relatedAlerts: Math.floor(Math.random() * 5),
    region: regions[Math.floor(Math.random() * regions.length)]
  }));
};

// Alert Type Icons
const getAlertTypeIcon = (type: Alert['type']) => {
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

// Severity Color
const getSeverityColor = (severity: number) => {
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

// Stat Cards Component
const StatCard = ({ label, value, icon: Icon, color }: { 
  label: string, 
  value: number, 
  icon: React.ComponentType<{ size?: number, className?: string }>, 
  color: string 
}) => (
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

// Alerts View Component
const AlertsView: React.FC = () => {
  // Generate mock alerts
  const alerts = generateMockAlerts(100);

  // Calculate stats
  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 5).length,
    mlInsights: alerts.filter(a => a.type === 'ml_insight').length,
    active: alerts.filter(a => a.status === 'active').length
  };

  // Filter configurations
  const filterConfigs: FilterConfig[] = [
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

  // Column configurations
  const columns: ColumnConfig<Alert & { id: number }>[] = [
    {
      key: 'title',
      header: 'Alert',
      sortable: true,
      render: (title, alert) => (
        <div className="flex items-center gap-2">
          {getAlertTypeIcon(alert.type)}
          <span>{title}</span>
          <div className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getSeverityColor(alert.severity)}`}>
            Severity {alert.severity}
          </div>
          {alert.type === 'ml_insight' && (
            <div className="px-2 py-0.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">
              ML {alert.mlConfidence?.toFixed(1)}%
            </div>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true
    },
    {
      key: 'service',
      header: 'Service',
      sortable: true
    },
    {
      key: 'region',
      header: 'Region',
      sortable: true
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      render: (timestamp) => timestamp.toLocaleString()
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status) => (
        <div className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          status === 'resolved' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Alert Summary Stats */}
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

      {/* DataTable with Alerts */}
      <DataTable 
        data={alerts.map(alert => ({ alert, id: parseInt(alert.id) }))}
        columns={columns}
        filterConfigs={filterConfigs}
        searchKeys={['title', 'description', 'service', 'region']}
        onRowClick={(alert) => {
          // Optional: implement row click handler
          console.log('Clicked alert:', alert);
        }}
      />
    </div>
  );
};export default AlertsView;