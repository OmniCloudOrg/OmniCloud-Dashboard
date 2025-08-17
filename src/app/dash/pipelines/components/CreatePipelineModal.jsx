"use client"

import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { FormField, FormGroup, Modal } from '../../../../components/ui';

/**
 * CreatePipelineModal - Modal for creating a new pipeline
 */
const CreatePipelineModal = ({ isOpen, onClose }) => {
  // Create state for all form fields
  const [formData, setFormData] = useState({
    pipelineName: '',
    repositoryType: 'github',
    repositoryPath: '',
    branch: 'main',
    configType: 'auto',
    buildCommand: 'npm run build',
    testCommand: 'npm test',
    triggerPush: true,
    triggerPr: true,
    triggerTag: false,
    triggerSchedule: false,
    environment: 'staging',
    deploymentStrategy: 'auto'
  });

  // Generic change handler for input fields
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form data here
    console.log('Form data submitted:', formData);
    // Process the form data
    // Then close the modal
    onClose();
  };

  if (!isOpen) return null;
  
  return (
    <Modal
      type="form"
      isOpen={isOpen}
      onClose={onClose}
      title="Create Pipeline"
      size="large"
      onSubmit={handleSubmit}
      submitText="Create Pipeline"
      cancelText="Cancel"
    >
      <div className="space-y-6">
        <FormGroup>
          <FormField
            label="Pipeline Name"
            id="pipelineName"
            placeholder="my-app-pipeline"
            required={true}
            value={formData.pipelineName}
            onChange={handleChange}
          />
          
          <div className="flex gap-2">
            <FormField
              label="Repository"
              id="repositoryType"
              type="select"
              className="w-1/3"
              value={formData.repositoryType}
              onChange={handleChange}
              options={[
                { value: 'github', label: 'GitHub' },
                { value: 'gitlab', label: 'GitLab' },
                { value: 'bitbucket', label: 'Bitbucket' },
                { value: 'azure', label: 'Azure DevOps' }
              ]}
            />
            <FormField
              label="Repository Path"
              id="repositoryPath"
              className="flex-1"
              placeholder="username/repository"
              value={formData.repositoryPath}
              onChange={handleChange}
            />
          </div>
          
          <FormField
            label="Branch"
            id="branch"
            placeholder="main"
            value={formData.branch}
            onChange={handleChange}
          />
        </FormGroup>
        
        <FormGroup title="Pipeline Configuration">
          <div className="flex gap-4 mt-3">
            <FormField
              type="radio"
              id="configType"
              options={[
                { value: 'auto', label: 'Auto-detected' },
                { value: 'yaml', label: 'YAML file' },
                { value: 'visual', label: 'Visual Editor' }
              ]}
              value={formData.configType}
              onChange={handleChange}
            />
          </div>
        </FormGroup>
        
        <FormGroup 
          title="Build Configuration" 
          className="bg-slate-800/50 p-4 rounded-lg"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Build Command"
              id="buildCommand"
              value={formData.buildCommand}
              onChange={handleChange}
            />
            <FormField
              label="Test Command"
              id="testCommand"
              value={formData.testCommand}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-xs text-slate-500 mb-1">Triggers</label>
            <div className="space-y-2 mt-2">
              <FormField
                type="checkbox"
                id="triggerPush"
                placeholder="On Push"
                checked={formData.triggerPush}
                onChange={handleChange}
              />
              <FormField
                type="checkbox"
                id="triggerPr"
                placeholder="On Pull Request"
                checked={formData.triggerPr}
                onChange={handleChange}
              />
              <FormField
                type="checkbox"
                id="triggerTag"
                placeholder="On Tag"
                checked={formData.triggerTag}
                onChange={handleChange}
              />
              <FormField
                type="checkbox"
                id="triggerSchedule"
                placeholder="Scheduled"
                checked={formData.triggerSchedule}
                onChange={handleChange}
              />
            </div>
          </div>
        </FormGroup>
        
        <FormGroup 
          title="Deployment" 
          className="bg-slate-800/50 p-4 rounded-lg"
        >
          <FormField
            label="Environment"
            id="environment"
            type="select"
            value={formData.environment}
            onChange={handleChange}
            options={[
              { value: 'staging', label: 'Staging' },
              { value: 'production', label: 'Production' },
              { value: 'development', label: 'Development' }
            ]}
          />
          
          <FormField
            label="Deployment Strategy"
            id="deploymentStrategy"
            type="select"
            value={formData.deploymentStrategy}
            onChange={handleChange}
            options={[
              { value: 'auto', label: 'Automatic' },
              { value: 'manual', label: 'Manual Approval' },
              { value: 'scheduled', label: 'Scheduled' }
            ]}
          />
        </FormGroup>
      </div>
    </Modal>
  );
};

export { CreatePipelineModal };