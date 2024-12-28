import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Shield,
  Database,
  Mail,
  Cloud,
  Bell,
  Key,
  Server,
  HardDrive,
  Network,
  Save,
  AlertCircle,
  Boxes,
  Container,
  FolderTreeIcon,
  Workflow,
  MonitorUp,
  Scale,
  Cpu,
  Wallet,
  LayoutGrid,
  Lock,
  Users,
  Gauge,
  Router
} from 'lucide-react';

// Group configuration sections into categories
const configCategories = {
  infrastructure: {
    label: 'Infrastructure',
    icon: Server,
    color: 'blue',
    sections: [
      {
        id: 'compute',
        label: 'Compute Resources',
        icon: Cpu,
        color: 'blue'
      },
      {
        id: 'storage',
        label: 'Storage',
        icon: Database,
        color: 'amber'
      },
      {
        id: 'networking',
        label: 'Networking',
        icon: Network,
        color: 'purple'
      },
      {
        id: 'loadBalancing',
        label: 'Load Balancing',
        icon: Scale,
        color: 'green'
      }
    ]
  },
  orchestration: {
    label: 'Orchestration',
    icon: Boxes,
    color: 'emerald',
    sections: [
      {
        id: 'kubernetes',
        label: 'Kubernetes',
        icon: Container,
        color: 'blue'
      },
      {
        id: 'serviceMesh',
        label: 'Service Mesh',
        icon: FolderTreeIcon,
        color: 'indigo'
      },
      {
        id: 'workflows',
        label: 'Workflows & CI/CD',
        icon: Workflow,
        color: 'orange'
      }
    ]
  },
  platform: {
    label: 'Platform',
    icon: LayoutGrid,
    color: 'violet',
    sections: [
      {
        id: 'marketplace',
        label: 'Service Marketplace',
        icon: Cloud,
        color: 'blue'
      },
      {
        id: 'monitoring',
        label: 'Monitoring',
        icon: MonitorUp,
        color: 'emerald'
      },
      {
        id: 'billing',
        label: 'Billing & Usage',
        icon: Wallet,
        color: 'amber'
      }
    ]
  },
  security: {
    label: 'Security',
    icon: Shield,
    color: 'red',
    sections: [
      {
        id: 'authentication',
        label: 'Authentication',
        icon: Lock,
        color: 'rose'
      },
      {
        id: 'rbac',
        label: 'RBAC',
        icon: Users,
        color: 'pink'
      },
      {
        id: 'encryption',
        label: 'Encryption',
        icon: Key,
        color: 'purple'
      }
    ]
  },
  system: {
    label: 'System',
    icon: Settings,
    color: 'slate',
    sections: [
      {
        id: 'performance',
        label: 'Performance',
        icon: Gauge,
        color: 'blue'
      },
      {
        id: 'backup',
        label: 'Backup & DR',
        icon: Cloud,
        color: 'cyan'
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        color: 'yellow'
      }
    ]
  }
};

const SystemConfig = () => {
  const [activeCategory, setActiveCategory] = useState('infrastructure');
  const [activeSection, setActiveSection] = useState('compute');
  const [settings, setSettings] = useState({
    // Compute Settings
    defaultNodeSize: 'medium',
    autoScalingEnabled: true,
    minNodes: 3,
    maxNodes: 10,
    schedulerType: 'default',
    gpuSupport: false,
    containerRuntime: 'containerd',
    
    // Storage Settings
    defaultStorageClass: 'standard',
    blockStorage: true,
    objectStorage: true,
    nfsSupport: true,
    storageEncryption: true,
    
    // Networking Settings
    networkPlugin: 'calico',
    serviceSubnet: '10.96.0.0/12',
    podSubnet: '10.244.0.0/16',
    ingressController: 'nginx',
    networkPolicies: true,
    
    // Load Balancing Settings
    lbType: 'metallb',
    externalIpRange: '',
    healthCheckInterval: 10,
    
    // Kubernetes Settings
    k8sVersion: '1.26',
    etcdMode: 'stacked',
    controlPlaneReplicas: 3,
    admissionControllers: ['NodeRestriction'],
    
    // Service Mesh Settings
    meshEnabled: false,
    meshProvider: 'istio',
    mtlsEnabled: true,
    tracing: true,
    
    // Workflows Settings
    cicdEnabled: true,
    artifactStorage: 'minio',
    pipelineEngine: 'tekton',
    
    // Marketplace Settings
    marketplaceEnabled: true,
    defaultRegistry: 'docker.io',
    helmEnabled: true,
    operatorHub: true,
    
    // Monitoring Settings
    prometheusRetention: '15d',
    grafanaAuth: 'internal',
    alertManager: true,
    loggingStack: 'elastic',
    
    // Billing Settings
    billingEnabled: true,
    currency: 'USD',
    quotaEnforcement: true,
    costAllocation: true,
    
    // Authentication Settings
    authProvider: 'internal',
    ssoEnabled: false,
    sessionDuration: 24,
    passwordPolicy: 'strong',
    
    // RBAC Settings
    multiTenancy: true,
    namespaceIsolation: true,
    defaultUserRole: 'developer',
    roleSync: false,
    
    // Encryption Settings
    kmProvider: 'vault',
    certManager: true,
    secretsEncryption: true,
    
    // Performance Settings
    metrics: true,
    resourceQuotas: true,
    limitRanges: true,
    
    // Backup Settings
    backupProvider: 'velero',
    backupSchedule: '0 2 * * *',
    retentionPeriod: '30d',
    
    // Notification Settings
    alertChannels: ['email'],
    webhookEndpoint: '',
    slackIntegration: false
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
  };

  const getComputeContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Compute Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          label="Default Node Size"
          value={settings.defaultNodeSize}
          onChange={(value) => handleSettingChange('defaultNodeSize', value)}
          options={[
            { value: 'small', label: 'Small (2 CPU, 4GB RAM)' },
            { value: 'medium', label: 'Medium (4 CPU, 8GB RAM)' },
            { value: 'large', label: 'Large (8 CPU, 16GB RAM)' }
          ]}
        />
        <NumberInput
          label="Minimum Nodes"
          value={settings.minNodes}
          onChange={(value) => handleSettingChange('minNodes', value)}
          min={1}
          max={100}
        />
        <NumberInput
          label="Maximum Nodes"
          value={settings.maxNodes}
          onChange={(value) => handleSettingChange('maxNodes', value)}
          min={1}
          max={100}
        />
        <SelectInput
          label="Container Runtime"
          value={settings.containerRuntime}
          onChange={(value) => handleSettingChange('containerRuntime', value)}
          options={[
            { value: 'containerd', label: 'containerd' },
            { value: 'crio', label: 'CRI-O' },
            { value: 'docker', label: 'Docker' }
          ]}
        />
        <Toggle
          label="GPU Support"
          value={settings.gpuSupport}
          onChange={(value) => handleSettingChange('gpuSupport', value)}
        />
        <SelectInput
          label="Scheduler Type"
          value={settings.schedulerType}
          onChange={(value) => handleSettingChange('schedulerType', value)}
          options={[
            { value: 'default', label: 'Default Scheduler' },
            { value: 'custom', label: 'Custom Scheduler' }
          ]}
        />
      </div>
    </div>
  );

  const getNetworkingContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Network Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          label="Network Plugin"
          value={settings.networkPlugin}
          onChange={(value) => handleSettingChange('networkPlugin', value)}
          options={[
            { value: 'calico', label: 'Calico' },
            { value: 'cilium', label: 'Cilium' },
            { value: 'flannel', label: 'Flannel' }
          ]}
        />
        <TextInput
          label="Service Subnet"
          value={settings.serviceSubnet}
          onChange={(value) => handleSettingChange('serviceSubnet', value)}
          placeholder="10.96.0.0/12"
        />
        <TextInput
          label="Pod Subnet"
          value={settings.podSubnet}
          onChange={(value) => handleSettingChange('podSubnet', value)}
          placeholder="10.244.0.0/16"
        />
        <SelectInput
          label="Ingress Controller"
          value={settings.ingressController}
          onChange={(value) => handleSettingChange('ingressController', value)}
          options={[
            { value: 'nginx', label: 'NGINX' },
            { value: 'traefik', label: 'Traefik' },
            { value: 'haproxy', label: 'HAProxy' }
          ]}
        />
        <Toggle
          label="Network Policies"
          value={settings.networkPolicies}
          onChange={(value) => handleSettingChange('networkPolicies', value)}
        />
      </div>
    </div>
  );

  const getKubernetesContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Kubernetes Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          label="Kubernetes Version"
          value={settings.k8sVersion}
          onChange={(value) => handleSettingChange('k8sVersion', value)}
          options={[
            { value: '1.26', label: 'v1.26 (Stable)' },
            { value: '1.25', label: 'v1.25' },
            { value: '1.24', label: 'v1.24' }
          ]}
        />
        <NumberInput
          label="Control Plane Replicas"
          value={settings.controlPlaneReplicas}
          onChange={(value) => handleSettingChange('controlPlaneReplicas', value)}
          min={1}
          max={7}
        />
        <SelectInput
          label="etcd Mode"
          value={settings.etcdMode}
          onChange={(value) => handleSettingChange('etcdMode', value)}
          options={[
            { value: 'stacked', label: 'Stacked' },
            { value: 'external', label: 'External' }
          ]}
        />
        <MultiSelect
          label="Admission Controllers"
          value={settings.admissionControllers}
          onChange={(value) => handleSettingChange('admissionControllers', value)}
          options={[
            { value: 'NodeRestriction', label: 'Node Restriction' },
            { value: 'PodSecurityPolicy', label: 'Pod Security Policy' },
            { value: 'ResourceQuota', label: 'Resource Quota' }
          ]}
        />
      </div>
    </div>
  );

  const getServiceMeshContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Service Mesh Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Toggle
          label="Enable Service Mesh"
          value={settings.meshEnabled}
          onChange={(value) => handleSettingChange('meshEnabled', value)}
        />
        <SelectInput
          label="Mesh Provider"
          value={settings.meshProvider}
          onChange={(value) => handleSettingChange('meshProvider', value)}
          options={[
            { value: 'istio', label: 'Istio' },
            { value: 'linkerd', label: 'Linkerd' },
            { value: 'consul', label: 'Consul' }
          ]}
        />
        <Toggle
          label="mTLS Enabled"
          value={settings.mtlsEnabled}
          onChange={(value) => handleSettingChange('mtlsEnabled', value)}
        />
        <Toggle
          label="Distributed Tracing"
          value={settings.tracing}
          onChange={(value) => handleSettingChange('tracing', value)}
        />
      </div>
    </div>
  );

  const getMonitoringContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Monitoring Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextInput
          label="Prometheus Retention"
          value={settings.prometheusRetention}
          onChange={(value) => handleSettingChange('prometheusRetention', value)}
          placeholder="15d"
        />
        <SelectInput
          label="Grafana Authentication"
          value={settings.grafanaAuth}
          onChange={(value) => handleSettingChange('grafanaAuth', value)}
          options={[
            { value: 'internal', label: 'Internal' },
            { value: 'oauth', label: 'OAuth' },
            { value: 'ldap', label: 'LDAP' },
            { value: 'saml', label: 'SAML' }
          ]}
        />
        <SelectInput
          label="Logging Stack"
          value={settings.loggingStack}
          onChange={(value) => handleSettingChange('loggingStack', value)}
          options={[
            { value: 'elastic', label: 'Elasticsearch + Kibana' },
            { value: 'loki', label: 'Loki + Grafana' },
            { value: 'cloudwatch', label: 'CloudWatch' }
          ]}
        />
        <Toggle
          label="Alert Manager"
          value={settings.alertManager}
          onChange={(value) => handleSettingChange('alertManager', value)}
        />
      </div>
    </div>
  );

  const getBillingContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Billing & Usage</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Toggle
          label="Enable Billing"
          value={settings.billingEnabled}
          onChange={(value) => handleSettingChange('billingEnabled', value)}
        />
        <SelectInput
          label="Currency"
          value={settings.currency}
          onChange={(value) => handleSettingChange('currency', value)}
          options={[
            { value: 'USD', label: 'US Dollar' },
            { value: 'EUR', label: 'Euro' },
            { value: 'GBP', label: 'British Pound' }
          ]}
        />
        <Toggle
          label="Quota Enforcement"
          value={settings.quotaEnforcement}
          onChange={(value) => handleSettingChange('quotaEnforcement', value)}
        />
        <Toggle
          label="Cost Allocation"
          value={settings.costAllocation}
          onChange={(value) => handleSettingChange('costAllocation', value)}
        />
      </div>

      {settings.billingEnabled && (
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">
              Billing is enabled. Make sure to configure your payment gateway in the integrations section.
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const getMarketplaceContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Service Marketplace</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Toggle
          label="Enable Marketplace"
          value={settings.marketplaceEnabled}
          onChange={(value) => handleSettingChange('marketplaceEnabled', value)}
        />
        <TextInput
          label="Default Registry"
          value={settings.defaultRegistry}
          onChange={(value) => handleSettingChange('defaultRegistry', value)}
          placeholder="docker.io"
        />
        <Toggle
          label="Enable Helm Charts"
          value={settings.helmEnabled}
          onChange={(value) => handleSettingChange('helmEnabled', value)}
        />
        <Toggle
          label="OperatorHub Integration"
          value={settings.operatorHub}
          onChange={(value) => handleSettingChange('operatorHub', value)}
        />
      </div>
    </div>
  );

  const getAuthContent = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Authentication & Access</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          label="Auth Provider"
          value={settings.authProvider}
          onChange={(value) => handleSettingChange('authProvider', value)}
          options={[
            { value: 'internal', label: 'Internal Auth' },
            { value: 'ldap', label: 'LDAP/AD' },
            { value: 'oauth', label: 'OAuth 2.0' },
            { value: 'oidc', label: 'OpenID Connect' }
          ]}
        />
        <Toggle
          label="Enable SSO"
          value={settings.ssoEnabled}
          onChange={(value) => handleSettingChange('ssoEnabled', value)}
        />
        <NumberInput
          label="Session Duration (hours)"
          value={settings.sessionDuration}
          onChange={(value) => handleSettingChange('sessionDuration', value)}
          min={1}
          max={72}
        />
        <SelectInput
          label="Password Policy"
          value={settings.passwordPolicy}
          onChange={(value) => handleSettingChange('passwordPolicy', value)}
          options={[
            { value: 'basic', label: 'Basic' },
            { value: 'strong', label: 'Strong' },
            { value: 'custom', label: 'Custom' }
          ]}
        />
      </div>

      {settings.authProvider === 'oidc' && (
        <div className="mt-6 space-y-4">
          <TextInput
            label="OIDC Issuer URL"
            value={settings.oidcIssuer}
            onChange={(value) => handleSettingChange('oidcIssuer', value)}
            placeholder="https://your-identity-provider/.well-known/openid-configuration"
          />
          <TextInput
            label="Client ID"
            value={settings.oidcClientId}
            onChange={(value) => handleSettingChange('oidcClientId', value)}
          />
        </div>
      )}
    </div>
  );

  const getSectionContent = () => {
    switch (activeSection) {
      case 'compute':
        return getComputeContent();
      case 'networking':
        return getNetworkingContent();
      case 'kubernetes':
        return getKubernetesContent();
      case 'serviceMesh':
        return getServiceMeshContent();
      case 'monitoring':
        return getMonitoringContent();
      case 'billing':
        return getBillingContent();
      case 'marketplace':
        return getMarketplaceContent();
      case 'authentication':
        return getAuthContent();
      // Add more section content handlers
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-semibold text-white">System Configuration</h1>
          </div>
          {unsavedChanges && (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-amber-400">
                <AlertCircle size={16} />
                Unsaved changes
              </span>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Category Sidebar */}
          <div className="col-span-12 md:col-span-3 space-y-6">
            {Object.entries(configCategories).map(([catId, category]) => (
              <div key={catId} className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 px-4">
                  <category.icon size={16} />
                  <span className="text-sm font-medium">{category.label}</span>
                </div>
                {category.sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveCategory(catId);
                      setActiveSection(section.id);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${activeSection === section.id
                        ? `bg-${section.color}-500/10 text-${section.color}-400`
                        : 'hover:bg-slate-800'
                      }`}
                  >
                    <section.icon size={16} />
                    <span className="text-sm">{section.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Section Content */}
          <div className="col-span-12 md:col-span-9">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              {getSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Input Components
const TextInput = ({ label, value, onChange, placeholder = '' }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
    />
  </label>
);

const NumberInput = ({ label, value, onChange, min, max, step = 1 }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
    />
  </label>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const MultiSelect = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <select
      multiple
      value={value}
      onChange={(e) => onChange(Array.from(e.target.selectedOptions, option => option.value))}
      className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const Toggle = ({ label, value, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-10 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-600"></div>
      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-4"></div>
    </div>
    <span className="text-sm font-medium text-slate-300">{label}</span>
  </label>
);

export default SystemConfig;