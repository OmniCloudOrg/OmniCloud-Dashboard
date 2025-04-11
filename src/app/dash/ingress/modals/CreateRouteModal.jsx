"use client"

import React from 'react';
import { 
  ModalContainer, 
  FormField,
  FormGroup,
  ToggleSwitch,
  Button
} from '../../components/ui';

const CreateRouteModal = ({ isOpen, onClose }) => {
  return (
    <ModalContainer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create Route"
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
            Create Route
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <FormField
          label="Route Name"
          id="route-name"
          type="text"
          placeholder="api-route"
        />
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Source Path</label>
          <div className="flex items-center gap-2">
            <select
              className="w-1/3 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="api.example.com">api.example.com</option>
              <option value="app.example.com">app.example.com</option>
              <option value="example.com">example.com</option>
            </select>
            <input
              type="text"
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="/api/v1/*"
            />
          </div>
        </div>
        
        <FormField
          label="Target Service"
          id="target-service"
          type="select"
          options={[
            { value: "", label: "Select Target Service" },
            { value: "api-gateway", label: "API Gateway" },
            { value: "user-service", label: "User Service" },
            { value: "auth-service", label: "Auth Service" },
            { value: "product-service", label: "Product Service" },
            { value: "custom", label: "Custom Target" }
          ]}
        />
        
        <FormGroup columns={2}>
          <FormField
            label="Method"
            id="method"
            type="select"
            options={[
              { value: "ANY", label: "ANY" },
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "DELETE", label: "DELETE" },
              { value: "PATCH", label: "PATCH" }
            ]}
          />
          <FormField
            label="Priority"
            id="priority"
            type="number"
            value="10"
          />
        </FormGroup>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Advanced Options
          </label>
          
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-4">
            <ToggleSwitch
              id="auth-toggle"
              label="Enable Authentication"
              isOn={false}
              onToggle={() => {}}
            />
            
            <ToggleSwitch
              id="cors-toggle"
              label="CORS Enabled"
              isOn={true}
              onToggle={() => {}}
            />
            
            <FormField
              label="Rate Limit (req/min)"
              id="rate-limit"
              type="number"
              value="100"
            />
            
            <FormField
              label="Request Timeout (sec)"
              id="timeout"
              type="number"
              value="30"
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default CreateRouteModal;