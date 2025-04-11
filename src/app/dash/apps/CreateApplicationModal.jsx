"use client"

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { 
  ModalContainer, 
  MultiStepProgress, 
  FormField, 
  FormGroup, 
  ModalFooter 
} from '../components/ui';

/**
 * Create Application Modal Component
 * Refactored to use the UI component library
 */
const CreateApplicationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    region: 'us-east',
    runtime: 'nodejs18',
    source: 'github',
    repository: '',
    branch: 'main',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    instances: 1,
    memory: 512,
    environment: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    // Handle form submission
    console.log('Submitting application:', formData);
    onClose();
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <FormGroup title="Basic Information">
            <FormField
              label="Application Name"
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="my-awesome-app"
              required
            />
            <FormField
              label="Description"
              id="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your application"
              rows={3}
            />
            <FormGroup columns={2}>
              <FormField
                label="Region"
                id="region"
                type="select"
                value={formData.region}
                onChange={handleInputChange}
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
                value={formData.runtime}
                onChange={handleInputChange}
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
        );
      case 2:
        return (
          <FormGroup title="Source Code">
            <FormField
              label="Source Type"
              id="source"
              type="select"
              value={formData.source}
              onChange={handleInputChange}
              options={[
                { value: 'github', label: 'GitHub' },
                { value: 'gitlab', label: 'GitLab' },
                { value: 'bitbucket', label: 'Bitbucket' },
                { value: 'custom', label: 'Custom Git' }
              ]}
            />
            <FormField
              label="Repository URL"
              id="repository"
              type="text"
              value={formData.repository}
              onChange={handleInputChange}
              placeholder="https://github.com/username/repo"
            />
            <FormGroup columns={2}>
              <FormField
                label="Branch"
                id="branch"
                type="text"
                value={formData.branch}
                onChange={handleInputChange}
                placeholder="main"
              />
              <FormField
                label="Auto Deploy"
                id="autoDeploy"
                type="select"
                value={formData.autoDeploy}
                onChange={handleInputChange}
                options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Disabled' }
                ]}
              />
            </FormGroup>
            <FormField
              label="Build Command"
              id="buildCommand"
              type="text"
              value={formData.buildCommand}
              onChange={handleInputChange}
              placeholder="npm run build"
            />
            <FormField
              label="Start Command"
              id="startCommand"
              type="text"
              value={formData.startCommand}
              onChange={handleInputChange}
              placeholder="npm start"
            />
          </FormGroup>
        );
      case 3:
        return (
          <FormGroup title="Resources & Scaling">
            <FormField
              label="Instances"
              id="instances"
              type="number"
              value={formData.instances}
              onChange={handleInputChange}
              min={1}
              max={10}
              helpText="Number of instances to deploy"
            />
            <FormField
              label="Memory (MB)"
              id="memory"
              type="select"
              value={formData.memory}
              onChange={handleInputChange}
              options={[
                { value: '256', label: '256 MB' },
                { value: '512', label: '512 MB' },
                { value: '1024', label: '1 GB' },
                { value: '2048', label: '2 GB' },
                { value: '4096', label: '4 GB' }
              ]}
            />
            <FormGroup title="Auto Scaling">
              <FormField
                id="autoScaling"
                type="radio"
                options={[
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' }
                ]}
              />
            </FormGroup>
            
            <FormGroup title="Environment Variables">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="space-y-3">
                  {formData.environment.map((env, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={env.key}
                        placeholder="KEY"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        onChange={(e) => {
                          const updatedEnv = [...formData.environment];
                          updatedEnv[index].key = e.target.value;
                          setFormData({
                            ...formData,
                            environment: updatedEnv
                          });
                        }}
                      />
                      <input
                        type="text"
                        value={env.value}
                        placeholder="VALUE"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        onChange={(e) => {
                          const updatedEnv = [...formData.environment];
                          updatedEnv[index].value = e.target.value;
                          setFormData({
                            ...formData,
                            environment: updatedEnv
                          });
                        }}
                      />
                      <button 
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-red-400 hover:text-red-300"
                        onClick={() => {
                          const updatedEnv = formData.environment.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            environment: updatedEnv
                          });
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="flex items-center gap-2 text-blue-400 text-sm"
                    onClick={() => setFormData({
                      ...formData,
                      environment: [...formData.environment, { key: '', value: '' }]
                    })}
                  >
                    <Plus size={16} />
                    Add Environment Variable
                  </button>
                </div>
              </div>
            </FormGroup>
          </FormGroup>
        );
      default:
        return null;
    }
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Application"
      maxWidth="2xl"
    >
      <MultiStepProgress step={step} totalSteps={3} />
      
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        
        <ModalFooter
          onCancel={onClose}
          onSubmit={step < 3 ? handleNext : handleSubmit}
          cancelText="Cancel"
          submitText={step < 3 ? "Next" : "Create Application"}
          isMultiStep={true}
          step={step}
          totalSteps={3}
          onBack={handleBack}
        />
      </form>
    </ModalContainer>
  );
};

export default CreateApplicationModal;