"use client"

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { 
  DashboardSection, 
  FormField, 
  FormGroup, 
  Button, 
  ToggleSwitch
} from '../../components/ui';

/**
 * Application Settings Tab Component
 * Refactored to use the UI component library
 */
const ApplicationSettings = ({ app }) => {
  // Sample environment variables - in a real app these would come from the API
  const envVars = [
    { key: 'NODE_ENV', value: 'production' },
    { key: 'API_URL', value: 'https://api.example.com' },
    { key: 'LOG_LEVEL', value: 'info' }
  ];

  return (
    <div className="space-y-8">
      <DashboardSection title="General Settings">
        <FormGroup>
          <FormField
            label="Application Name"
            id="name"
            type="text"
            defaultValue={app.name}
          />
          <FormField
            label="Description"
            id="description"
            type="textarea"
            defaultValue={app.description}
            rows={3}
          />
          
          <FormGroup columns={2}>
            <FormField
              label="Region"
              id="region"
              type="select"
              defaultValue={app.region}
              options={[
                { value: 'us-east', label: 'US East (N. Virginia)' },
                { value: 'us-west', label: 'US West (Oregon)' },
                { value: 'eu-central', label: 'EU Central (Frankfurt)' },
                { value: 'ap-southeast', label: 'Asia Pacific (Singapore)' }
              ]}
            />
            <FormField
              label="Runtime"
              id="runtime"
              type="select"
              defaultValue={app.runtime}
              options={[
                { value: 'nodejs18', label: 'Node.js 18' },
                { value: 'nodejs16', label: 'Node.js 16' },
                { value: 'python3.9', label: 'Python 3.9' },
                { value: 'go1.19', label: 'Go 1.19' },
                { value: 'java17', label: 'Java 17' },
                { value: 'ruby3.1', label: 'Ruby 3.1' },
                { value: 'dotnet6', label: '.NET 6' },
                { value: 'php8.1', label: 'PHP 8.1' }
              ]}
            />
          </FormGroup>
        </FormGroup>
      </DashboardSection>
      
      <DashboardSection title="Environment Variables">
        <div className="space-y-4">
          {envVars.map((env, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  defaultValue={env.key}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="KEY"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  defaultValue={env.value}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="VALUE"
                />
              </div>
              <button className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button className="flex items-center gap-2 mt-4 text-blue-400 text-sm">
            <Plus size={16} />
            Add Environment Variable
          </button>
        </div>
      </DashboardSection>
      
      <div className="grid grid-cols-2 gap-6">
        <DashboardSection title="Custom Domain">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Add a custom domain to your application. You'll need to configure DNS settings at your domain registrar.</p>
            <FormField
              label="Domain"
              id="domain"
              type="text"
              placeholder="app.example.com"
            />
            <Button variant="primary" className="w-full">
              Add Domain
            </Button>
          </div>
        </DashboardSection>
        
        <DashboardSection title="Security">
          <div className="space-y-4">
            <FormField
              label="IP Restrictions"
              id="ipRestrictions"
              type="textarea"
              placeholder="Enter IP addresses or CIDR blocks, one per line"
              rows={3}
            />
            <ToggleSwitch
              isOn={true}
              onToggle={() => console.log('Toggle HTTPS')}
              label="Force HTTPS"
              id="force-ssl"
            />
          </div>
        </DashboardSection>
      </div>
      
      <DashboardSection title="Danger Zone" className="bg-red-500/5 border border-red-500/20">
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium text-red-400">Delete Application</h4>
            <p className="text-sm text-slate-400 mt-1">Once you delete an application, there is no going back. Please be certain.</p>
            <Button variant="danger" className="mt-4">
              Delete Application
            </Button>
          </div>
          <div className="pt-6 border-t border-red-500/10">
            <h4 className="text-base font-medium text-red-400">Transfer Ownership</h4>
            <p className="text-sm text-slate-400 mt-1">Transfer this application to another team or organization.</p>
            <Button variant="secondary" className="mt-4">
              Transfer Application
            </Button>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default ApplicationSettings;