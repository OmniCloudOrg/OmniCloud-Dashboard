"use client"
import React, { useState } from 'react';
import { 
  Scale, 
  Shield, 
  Network, 
  Bell, 
  Database, 
  Cpu,
  Clock,
  AlertCircle 
} from 'lucide-react';

const configTabs = [
  { 
    id: 'scaling', 
    label: 'Scaling', 
    icon: Scale,
    activeColor: 'text-blue-400',
    hoverColor: 'hover:text-blue-400',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-500'
  },
  { 
    id: 'performance', 
    label: 'Performance', 
    icon: Cpu,
    activeColor: 'text-orange-400',
    hoverColor: 'hover:text-orange-400',
    borderColor: 'border-orange-400',
    bgColor: 'bg-orange-500'
  },
  { 
    id: 'networking', 
    label: 'Networking', 
    icon: Network,
    activeColor: 'text-purple-400',
    hoverColor: 'hover:text-purple-400',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-500'
  },
  { 
    id: 'security', 
    label: 'Security', 
    icon: Shield,
    activeColor: 'text-emerald-400',
    hoverColor: 'hover:text-emerald-400',
    borderColor: 'border-emerald-400',
    bgColor: 'bg-emerald-500'
  },
  { 
    id: 'monitoring', 
    label: 'Monitoring', 
    icon: Bell,
    activeColor: 'text-yellow-400',
    hoverColor: 'hover:text-yellow-400',
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-500'
  },
  { 
    id: 'backup', 
    label: 'Backup & Recovery', 
    icon: Database,
    activeColor: 'text-cyan-400',
    hoverColor: 'hover:text-cyan-400',
    borderColor: 'border-cyan-400',
    bgColor: 'bg-cyan-500'
  }
];

export const Config = ({ app, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('scaling');
  const [settings, setSettings] = useState({
    // Scaling settings
    autoScaling: app.autoScaling,
    minInstances: app.minInstances,
    maxInstances: app.maxInstances,
    targetCPU: app.targetCPU,
    
    // Performance settings
    cpuLimit: app.cpuLimit || 2,
    memoryLimit: app.memoryLimit || 2048,
    timeoutSeconds: app.timeoutSeconds || 30,
    
    // Network settings
    ingressEnabled: app.ingressEnabled || true,
    customDomain: app.customDomain || '',
    loadBalancer: app.loadBalancer || 'round-robin',
    
    // Security settings
    sslEnabled: app.sslEnabled || true,
    authEnabled: app.authEnabled || false,
    secretRotation: app.secretRotation || false,
    
    // Monitoring settings
    loggingEnabled: app.loggingEnabled || true,
    metricRetention: app.metricRetention || 30,
    alertThreshold: app.alertThreshold || 90,
    
    // Backup settings
    backupEnabled: app.backupEnabled || true,
    backupFrequency: app.backupFrequency || 'daily',
    retentionDays: app.retentionDays || 30
  });

  const handleUpdate = () => {
    onUpdate(settings);
  };

  const getActiveTabConfig = () => configTabs.find(tab => tab.id === activeTab);

  const getTabContent = () => {
    switch (activeTab) {
      case 'scaling':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <AutoScalingToggle 
                value={settings.autoScaling}
                onChange={(value) => setSettings({...settings, autoScaling: value})}
                activeColor={getActiveTabConfig()?.activeColor}
              />
              
              <div className="space-y-4">
                <NumberInput
                  label="Min Instances"
                  value={settings.minInstances}
                  onChange={(value) => setSettings({...settings, minInstances: value})}
                  min={1}
                />
                <NumberInput
                  label="Max Instances"
                  value={settings.maxInstances}
                  onChange={(value) => setSettings({...settings, maxInstances: value})}
                  min={settings.minInstances}
                />
                <NumberInput
                  label="Target CPU %"
                  value={settings.targetCPU}
                  onChange={(value) => setSettings({...settings, targetCPU: value})}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <NumberInput
                  label="CPU Limit (cores)"
                  value={settings.cpuLimit}
                  onChange={(value) => setSettings({...settings, cpuLimit: value})}
                  min={0.5}
                  max={16}
                  step={0.5}
                />
                <NumberInput
                  label="Memory Limit (MB)"
                  value={settings.memoryLimit}
                  onChange={(value) => setSettings({...settings, memoryLimit: value})}
                  min={256}
                  step={256}
                />
              </div>
              <div className="space-y-4">
                <NumberInput
                  label="Request Timeout (seconds)"
                  value={settings.timeoutSeconds}
                  onChange={(value) => setSettings({...settings, timeoutSeconds: value})}
                  min={1}
                />
              </div>
            </div>
          </div>
        );

      case 'networking':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Toggle
                  label="Enable Ingress"
                  value={settings.ingressEnabled}
                  onChange={(value) => setSettings({...settings, ingressEnabled: value})}
                  activeColor={getActiveTabConfig()?.activeColor}
                />
                <TextInput
                  label="Custom Domain"
                  value={settings.customDomain}
                  onChange={(value) => setSettings({...settings, customDomain: value})}
                  placeholder="app.example.com"
                />
              </div>
              <div className="space-y-4">
                <SelectInput
                  label="Load Balancer Algorithm"
                  value={settings.loadBalancer}
                  onChange={(value) => setSettings({...settings, loadBalancer: value})}
                  options={[
                    { value: 'round-robin', label: 'Round Robin' },
                    { value: 'least-connections', label: 'Least Connections' },
                    { value: 'ip-hash', label: 'IP Hash' }
                  ]}
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Toggle
                  label="Enable SSL/TLS"
                  value={settings.sslEnabled}
                  onChange={(value) => setSettings({...settings, sslEnabled: value})}
                  activeColor={getActiveTabConfig()?.activeColor}
                />
                <Toggle
                  label="Enable Authentication"
                  value={settings.authEnabled}
                  onChange={(value) => setSettings({...settings, authEnabled: value})}
                  activeColor={getActiveTabConfig()?.activeColor}
                />
              </div>
              <div className="space-y-4">
                <Toggle
                  label="Auto-rotate Secrets"
                  value={settings.secretRotation}
                  onChange={(value) => setSettings({...settings, secretRotation: value})}
                  activeColor={getActiveTabConfig()?.activeColor}
                />
              </div>
            </div>
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Toggle
                  label="Enable Logging"
                  value={settings.loggingEnabled}
                  onChange={(value) => setSettings({...settings, loggingEnabled: value})}
                  activeColor={getActiveTabConfig()?.activeColor}
                />
                <NumberInput
                  label="Metric Retention (days)"
                  value={settings.metricRetention}
                  onChange={(value) => setSettings({...settings, metricRetention: value})}
                  min={1}
                />
              </div>
              <div className="space-y-4">
                <NumberInput
                  label="Alert Threshold %"
                  value={settings.alertThreshold}
                  onChange={(value) => setSettings({...settings, alertThreshold: value})}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Toggle
                  label="Enable Backups"
                  value={settings.backupEnabled}
                  onChange={(value) => setSettings({...settings, backupEnabled: value})}
                  activeColor={getActiveTabConfig()?.activeColor}
                />
                <SelectInput
                  label="Backup Frequency"
                  value={settings.backupFrequency}
                  onChange={(value) => setSettings({...settings, backupFrequency: value})}
                  options={[
                    { value: 'hourly', label: 'Hourly' },
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' }
                  ]}
                />
              </div>
              <div className="space-y-4">
                <NumberInput
                  label="Retention Period (days)"
                  value={settings.retentionDays}
                  onChange={(value) => setSettings({...settings, retentionDays: value})}
                  min={1}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const activeTabConfig = getActiveTabConfig();

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
      {/* Tabs Header */}
      <div className="border-b border-slate-800">
        <div className="flex overflow-x-auto scrollbar-hide">
          {configTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.id 
                  ? `${tab.activeColor} ${tab.borderColor}` 
                  : `text-slate-400 border-transparent ${tab.hoverColor} hover:border-slate-700`}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {getTabContent()}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleUpdate}
            className={`${activeTabConfig?.bgColor} hover:brightness-110 text-white 
              px-4 py-2 rounded-lg transition-all`}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const AutoScalingToggle = ({ value, onChange, activeColor }) => (
  <Toggle label="Auto Scaling" value={value} onChange={onChange} activeColor={activeColor} />
);

const Toggle = ({ label, value, onChange, activeColor }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative">
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`w-10 h-6 bg-slate-700 rounded-full peer ${activeColor?.replace('text-', 'peer-checked:bg-')}`}></div>
      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-4"></div>
    </div>
    <span className="text-sm font-medium text-white">{label}</span>
  </label>
);

const NumberInput = ({ label, value, onChange, min, max, step = 1 }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
    <input 
      type="number" 
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
    />
  </div>
);

const TextInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
    <input 
      type="text" 
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
    <select 
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default Config;