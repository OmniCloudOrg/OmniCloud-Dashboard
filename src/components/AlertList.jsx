"use client"
import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  Brain, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter,
  SearchCode,
  ChevronDown,
  ActivitySquare,
  Cpu,
  Database,
  Network,
  BarChart3,
  Workflow,
  ScanLine
} from 'lucide-react';

// Mock data generation utilities
const generateRandomTimestamp = () => {
  const now = new Date();
  return new Date(now - Math.random() * 24 * 60 * 60 * 1000);
};

const generateMockAlerts = (count) => {
  const types = ['error', 'warning', 'info', 'ml_insight'];
  const services = ['auth', 'api', 'database', 'cache', 'compute', 'storage'];
  const mlCategories = ['anomaly', 'prediction', 'pattern', 'correlation'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `alert-${i}`,
    timestamp: generateRandomTimestamp(),
    type: types[Math.floor(Math.random() * types.length)],
    service: services[Math.floor(Math.random() * services.length)],
    title: `Alert ${i}`,
    description: `Detailed description for alert ${i}`,
    status: Math.random() > 0.7 ? 'resolved' : 'active',
    severity: Math.floor(Math.random() * 5) + 1,
    affectedInstances: Math.floor(Math.random() * 100),
    mlCategory: mlCategories[Math.floor(Math.random() * mlCategories.length)],
    mlConfidence: Math.random() * 100,
    relatedAlerts: Math.floor(Math.random() * 5),
    region: ['us-east', 'us-west', 'eu-west', 'ap-south'][Math.floor(Math.random() * 4)]
  }));
};

const AlertsView = () => {
  const [activeView, setActiveView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showMLInsightsOnly, setShowMLInsightsOnly] = useState(false);
  
  // Generate 100 mock alerts
  const allAlerts = useMemo(() => generateMockAlerts(100), []);

  // Filter alerts based on current filters
  const filteredAlerts = useMemo(() => {
    return allAlerts.filter(alert => {
      const matchesSearch = searchQuery === '' || 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesService = selectedService === 'all' || alert.service === selectedService;
      const matchesSeverity = selectedSeverity === 'all' || alert.severity === parseInt(selectedSeverity);
      const matchesRegion = selectedRegion === 'all' || alert.region === selectedRegion;
      const matchesMLFilter = !showMLInsightsOnly || alert.type === 'ml_insight';
      
      return matchesSearch && matchesService && matchesSeverity && matchesRegion && matchesMLFilter;
    });
  }, [allAlerts, searchQuery, selectedService, selectedSeverity, selectedRegion, showMLInsightsOnly]);

  // Alert stats for summary
  const alertStats = useMemo(() => ({
    total: filteredAlerts.length,
    critical: filteredAlerts.filter(a => a.severity === 5).length,
    mlInsights: filteredAlerts.filter(a => a.type === 'ml_insight').length,
    active: filteredAlerts.filter(a => a.status === 'active').length
  }), [filteredAlerts]);

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

      {/* Filters and Search */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <SearchCode className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search alerts..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <FilterDropdown
            value={selectedService}
            onChange={setSelectedService}
            options={[
              { value: 'all', label: 'All Services' },
              { value: 'auth', label: 'Authentication' },
              { value: 'api', label: 'API Gateway' },
              { value: 'database', label: 'Database' },
              { value: 'cache', label: 'Cache' },
              { value: 'compute', label: 'Compute' },
              { value: 'storage', label: 'Storage' }
            ]}
            icon={Cpu}
          />

          <FilterDropdown
            value={selectedSeverity}
            onChange={setSelectedSeverity}
            options={[
              { value: 'all', label: 'All Severities' },
              { value: '5', label: 'Critical' },
              { value: '4', label: 'High' },
              { value: '3', label: 'Medium' },
              { value: '2', label: 'Low' },
              { value: '1', label: 'Info' }
            ]}
            icon={AlertTriangle}
          />

          <FilterDropdown
            value={selectedRegion}
            onChange={setSelectedRegion}
            options={[
              { value: 'all', label: 'All Regions' },
              { value: 'us-east', label: 'US East' },
              { value: 'us-west', label: 'US West' },
              { value: 'eu-west', label: 'EU West' },
              { value: 'ap-south', label: 'AP South' }
            ]}
            icon={Network}
          />

          <button
            onClick={() => setShowMLInsightsOnly(!showMLInsightsOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
              ${showMLInsightsOnly 
                ? 'border-purple-500 text-purple-400 bg-purple-500/10' 
                : 'border-slate-700 text-slate-400 hover:border-purple-500/50'}`}
          >
            <Brain size={18} />
            ML Insights
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Alerts</h2>
          <div className="flex gap-2">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Filter size={18} />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Clock size={18} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800 overflow-auto max-h-[calc(100vh-20rem)]">
          {filteredAlerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
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

const FilterDropdown = ({ value, onChange, options, icon: Icon }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2 text-white"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <Icon className="absolute left-3 top-2.5 text-slate-400" size={18} />
    <ChevronDown className="absolute right-2 top-2.5 text-slate-400" size={18} />
  </div>
);

const AlertCard = ({ alert }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAlertTypeIcon = () => {
    switch (alert.type) {
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

  const getSeverityColor = () => {
    switch (alert.severity) {
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

  return (
    <div 
      className={`p-4 hover:bg-slate-800/30 transition-colors cursor-pointer
        ${isExpanded ? 'bg-slate-800/30' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {getAlertTypeIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium">{alert.title}</h3>
            <div className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getSeverityColor()}`}>
              Severity {alert.severity}
            </div>
            {alert.type === 'ml_insight' && (
              <div className="px-2 py-0.5 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">
                ML Confidence: {alert.mlConfidence.toFixed(1)}%
              </div>
            )}
            {alert.status === 'resolved' && (
              <div className="px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                Resolved
              </div>
            )}
          </div>
          
          <p className="text-slate-400 text-sm mb-2">{alert.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>{alert.service}</span>
            <span>{alert.region}</span>
            <span>{alert.timestamp.toLocaleString()}</span>
            {alert.relatedAlerts > 0 && (
              <span>{alert.relatedAlerts} related alerts</span>
            )}
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Affected Instances"
                  value={alert.affectedInstances}
                  icon={Cpu}
                />
                <MetricCard
                  label="Related Services"
                  value={3}
                  icon={Workflow}
                />
                {alert.type === 'ml_insight' && (
                  <>
                    <MetricCard
                      label="ML Category"
                      value={alert.mlCategory}
                      icon={Brain}
                    />
                    <MetricCard
                      label="Similar Patterns"
                      value={5}
                      icon={ScanLine}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon }) => (
  <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
    <div className="text-slate-400">
      <Icon size={18} />
    </div>
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  </div>
);

export default AlertsView;