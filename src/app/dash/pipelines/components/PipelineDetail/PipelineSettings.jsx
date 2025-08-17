"use client"

import React, { useState } from 'react';
import { FormField, FormGroup, ToggleSwitch } from '../../../../../components/ui';

const PipelineSettings = ({ pipeline: initialPipeline }) => {
  // Create state for all form fields
  const [pipelineData, setPipelineData] = useState({
    name: initialPipeline?.name || '',
    description: 'Main CI/CD pipeline for our application. Builds, tests and deploys to staging and production environments.',
    branch: initialPipeline?.branch || '',
    timeout: '60',
    emailNotifications: true,
    slackNotifications: true,
    webhookNotifications: false,
    accessControl: 'public',
    requireApproval: true
  });

  // Create a generic change handler for input fields
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setPipelineData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  // Create specific handlers for toggle switches
  const handleToggle = (id) => (e) => {
    setPipelineData(prev => ({
      ...prev,
      [id]: e.target.checked
    }));
  };

  return (
    <div className="space-y-8">
      <FormGroup 
        title="General Settings" 
        className="bg-slate-800/50 p-4 rounded-lg"
      >
        <FormField
          label="Pipeline Name"
          id="name"
          value={pipelineData.name}
          onChange={handleChange}
        />
        <FormField
          label="Description"
          id="description"
          type="textarea"
          value={pipelineData.description}
          onChange={handleChange}
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Default Branch"
            id="branch"
            value={pipelineData.branch}
            onChange={handleChange}
          />
          <FormField
            label="Timeout (minutes)"
            id="timeout"
            type="number"
            value={pipelineData.timeout}
            onChange={handleChange}
          />
        </div>
      </FormGroup>
      
      <FormGroup 
        title="Notifications" 
        className="bg-slate-800/50 p-4 rounded-lg"
      >
        <ToggleSwitch
          id="emailNotifications"
          label="Email Notifications"
          description="Receive email notifications for pipeline events"
          isOn={pipelineData.emailNotifications}
          onToggle={handleToggle('emailNotifications')}
        />
        <ToggleSwitch
          id="slackNotifications"
          label="Slack Notifications"
          description="Receive Slack notifications for pipeline events"
          isOn={pipelineData.slackNotifications}
          onToggle={handleToggle('slackNotifications')}
        />
        <ToggleSwitch
          id="webhookNotifications"
          label="Webhook Notifications"
          description="Send webhook notifications to external systems"
          isOn={pipelineData.webhookNotifications}
          onToggle={handleToggle('webhookNotifications')}
        />
      </FormGroup>
      
      <FormGroup 
        title="Permissions" 
        className="bg-slate-800/50 p-4 rounded-lg"
      >
        <FormField
          label="Access Control"
          id="accessControl"
          type="select"
          value={pipelineData.accessControl}
          onChange={handleChange}
          options={[
            { value: 'public', label: 'Public (All organization members)' },
            { value: 'restricted', label: 'Restricted (Selected roles)' },
            { value: 'private', label: 'Private (Selected users)' }
          ]}
        />
        <FormField
          label="Manual Approval Required"
          id="requireApproval"
          type="checkbox"
          placeholder="Require approval for production deployments"
          checked={pipelineData.requireApproval}
          onChange={handleChange}
        />
      </FormGroup>
      
      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
        <h3 className="text-base font-medium text-red-400 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-white">Delete Pipeline</h4>
              <p className="text-xs text-slate-400 mt-1">Once deleted, this pipeline cannot be recovered</p>
            </div>
            <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PipelineSettings };