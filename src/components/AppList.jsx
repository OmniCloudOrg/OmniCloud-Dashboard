import React, { useState } from 'react';
import { Play, Server, MemoryStick, Database, Cpu, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from './Base/Alert';

// Resource Slider Component
const ResourceSlider = ({ icon: Icon, title, value, min, max, step, format, onChange }) => (
  <div className="bg-slate-800 rounded-lg p-4">
    <div className="flex items-center space-x-3 mb-4">
      <Icon className="w-5 h-5 text-slate-400" />
      <span className="text-sm font-medium text-slate-300">{title}</span>
    </div>
    <div className="space-y-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-slate-400">
        <span>{format(min)}</span>
        <span>{format(value)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  </div>
);

// Deployment Status Component
const DeploymentStatus = ({ status }) => (
  <div className="fixed bottom-4 right-4 z-50">
    <Alert className={`w-80 transition-colors ${
      status.status === 'completed' ? 'bg-green-500/10 border-green-500/20' : 'bg-blue-500/10 border-blue-500/20'
    }`}>
      <AlertDescription className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {status.status === 'completed' ? 'Deployment Complete' : 'Deploying Application'}
          </span>
          <span className="text-sm">{status.progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              status.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${status.progress}%` }}
          />
        </div>
        <span className="text-sm text-slate-400">{status.name}</span>
      </AlertDescription>
    </Alert>
  </div>
);

// AppCard Component
const AppCard = ({ app, onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-left hover:border-blue-500/50 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-white">{app.name}</h3>
      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-lg shadow-emerald-500/20">
        {app.status}
      </span>
    </div>
    <div className="space-y-2">
      <p className="text-sm text-slate-400">{app.type}</p>
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{app.instances.length} Instances</span>
        <span className="text-blue-400">View Details →</span>
      </div>
    </div>
  </button>
);

// Deployment Modal Component
const DeploymentModal = ({ onClose, onDeploy }) => {
  const [formData, setFormData] = useState({
    name: '',
    source: 'github',
    instances: 1,
    memory: 256,
    diskQuota: 512,
    cpuLimit: 100,
    sourceConfig: {},
    autoscaling: false,
    aceEnabled: false
  });

  const sourceFields = {
    github: [
      { id: 'repo', label: 'Repository', placeholder: 'owner/repo' },
      { id: 'branch', label: 'Branch', placeholder: 'main' }
    ],
    gitlab: [
      { id: 'project', label: 'Project', placeholder: 'group/project' },
      { id: 'branch', label: 'Branch', placeholder: 'main' }
    ],
    docker: [
      { id: 'image', label: 'Image', placeholder: 'nginx:latest' }
    ]
  };

  const resourceConfigs = [
    {
      icon: Server,
      title: "Application Instances",
      value: formData.instances,
      min: 1,
      max: 20,
      step: 1,
      format: (val) => val.toString()
    },
    {
      icon: MemoryStick,
      title: "Memory per Instance",
      value: formData.memory,
      min: 128,
      max: 4096,
      step: 128,
      format: (val) => val >= 1024 ? `${(val/1024).toFixed(1)}GB` : `${val}MB`
    },
    {
      icon: Database,
      title: "Disk Quota",
      value: formData.diskQuota,
      min: 512,
      max: 8192,
      step: 512,
      format: (val) => val >= 1024 ? `${(val/1024).toFixed(1)}GB` : `${val}MB`
    },
    {
      icon: Cpu,
      title: "CPU Limit",
      value: formData.cpuLimit,
      min: 0,
      max: 400,
      step: 5,
      format: (val) => `${val}%`
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onDeploy(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Deploy New Application</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Application Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="my-application"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">Source Type</span>
              <select
                value={formData.source}
                onChange={e => setFormData({...formData, source: e.target.value})}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="docker">Docker</option>
              </select>
            </label>
          </div>

          {/* Source Configuration */}
          <div className="space-y-4">
            {sourceFields[formData.source]?.map(field => (
              <label key={field.id} className="block">
                <span className="text-sm font-medium text-slate-300">{field.label}</span>
                <input
                  type="text"
                  value={formData.sourceConfig[field.id] || ''}
                  onChange={e => setFormData({
                    ...formData,
                    sourceConfig: {
                      ...formData.sourceConfig,
                      [field.id]: e.target.value
                    }
                  })}
                  className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder={field.placeholder}
                  required
                />
              </label>
            ))}
          </div>

          {/* Resource Configuration */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Resource Configuration</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.autoscaling}
                  onChange={e => setFormData({...formData, autoscaling: e.target.checked})}
                  className="form-checkbox"
                />
                <span className="text-sm text-slate-300">Enable Autoscaling</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourceConfigs.map((config, index) => (
                <ResourceSlider
                  key={index}
                  {...config}
                  onChange={val => {
                    const key = ['instances', 'memory', 'diskQuota', 'cpuLimit'][index];
                    setFormData({...formData, [key]: val});
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Deploy Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App List Component
const AppList = ({ apps, onSelectApp }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState(null);

  const handleDeploy = async (formData) => {
    setIsModalOpen(false);
    setDeploymentStatus({
      name: formData.name,
      status: 'deploying',
      progress: 0
    });

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeploymentStatus(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 10, 100)
      }));
    }, 1000);

    // Simulate deployment completion
    setTimeout(() => {
      clearInterval(interval);
      setDeploymentStatus(prev => ({
        ...prev,
        status: 'completed'
      }));
      setTimeout(() => setDeploymentStatus(null), 3000);
    }, 10000);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-white">Applications</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          New Application
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map(app => (
          <AppCard key={app.id} app={app} onClick={() => onSelectApp(app)} />
        ))}
      </div>

      {isModalOpen && (
        <DeploymentModal 
          onClose={() => setIsModalOpen(false)}
          onDeploy={handleDeploy}
        />
      )}

      {deploymentStatus && (
        <DeploymentStatus status={deploymentStatus} />
      )}
    </>
  );
};

export default AppList;