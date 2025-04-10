"use client"

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { 
  ModalContainer, 
  FormField,
  FormGroup,
  Button
} from '../../components/ui';

const CreateDomainModal = ({ isOpen, onClose }) => {
  return (
    <ModalContainer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Custom Domain"
      maxWidth="2xl"
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button>
            Add Domain
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <FormField
          label="Domain Name"
          id="domain-name"
          type="text"
          placeholder="example.com"
        />
        
        <FormField
          label="Application"
          id="application"
          type="select"
          options={[
            { value: "", label: "Select Application" },
            { value: "web-app", label: "Web App" },
            { value: "api-gateway", label: "API Gateway" },
            { value: "static-content", label: "Static Content" },
            { value: "landing-page", label: "Landing Page" }
          ]}
        />
        
        <FormGroup columns={2}>
          <FormField
            label="Environment"
            id="environment"
            type="select"
            options={[
              { value: "production", label: "Production" },
              { value: "staging", label: "Staging" },
              { value: "development", label: "Development" },
              { value: "testing", label: "Testing" }
            ]}
          />
          <FormField
            label="Protocol"
            id="protocol"
            type="select"
            options={[
              { value: "https", label: "HTTPS" },
              { value: "http", label: "HTTP" }
            ]}
          />
        </FormGroup>
        
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 mb-2">SSL/TLS Certificate</h3>
          <div className="space-y-3">
            <FormField
              type="radio"
              id="certificate-type"
              name="certificate-type"
              options={[
                { value: "auto", label: "Auto-managed Certificate (Let's Encrypt)" },
                { value: "custom", label: "Upload Custom Certificate" }
              ]}
            />
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 mt-1">
              <AlertTriangle size={16} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-400">DNS Configuration Required</h4>
              <p className="text-xs text-slate-400 mt-1">
                After adding this domain, you'll need to configure DNS records with your domain registrar.
                We'll provide the necessary records once the domain is added.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CreateDomainModal;