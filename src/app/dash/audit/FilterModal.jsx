"use client"

import React from 'react';
import { 
  FormField, 
  FormGroup, 
  Button 
} from '../components/ui';
import Modal from '../../../components/ui/Modal';

/**
 * Filter Modal Component - Advanced filtering options for audit logs
 * Refactored to use the Universal Modal component
 */
const FilterModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Filters"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Event Type"
            id="eventType"
            type="select"
            options={[
              { value: '', label: 'All Event Types' },
              { value: 'login', label: 'Login' },
              { value: 'deletion', label: 'Deletion' },
              { value: 'permission', label: 'Permission' },
              { value: 'api_key', label: 'API Key' },
              { value: 'setting', label: 'Setting' },
              { value: 'deployment', label: 'Deployment' },
              { value: 'access', label: 'Access' },
              { value: 'security', label: 'Security' }
            ]}
          />
          
          <FormField
            label="Severity"
            id="severity"
            type="select"
            options={[
              { value: '', label: 'All Severities' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
          />
        </div>
        
        <FormField
          label="User"
          id="user"
          type="text"
          placeholder="Filter by username"
        />
        
        <FormField
          label="Resource"
          id="resource"
          type="text"
          placeholder="Filter by resource name or ID"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            id="startDate"
            type="date"
          />
          
          <FormField
            label="End Date"
            id="endDate"
            type="date"
          />
        </div>
        
        <FormField
          label="IP Address"
          id="ipAddress"
          type="text"
          placeholder="Filter by IP address"
        />
        
        <FormField
          label="Source"
          id="source"
          type="select"
          options={[
            { value: '', label: 'All Sources' },
            { value: 'console', label: 'Console' },
            { value: 'api', label: 'API' },
            { value: 'cli', label: 'CLI' },
            { value: 'terraform', label: 'Terraform' },
            { value: 'pulumi', label: 'Pulumi' },
            { value: 'github_actions', label: 'GitHub Actions' }
          ]}
        />
        
        <FormField
          label="Location"
          id="location"
          type="select"
          options={[
            { value: '', label: 'All Locations' },
            { value: 'us', label: 'United States' },
            { value: 'eu', label: 'Europe' },
            { value: 'ap', label: 'Asia Pacific' },
            { value: 'sa', label: 'South America' },
            { value: 'af', label: 'Africa' }
          ]}
        />
      </div>
      
      <div className="flex justify-between mt-8">
        <Button
          variant="secondary"
        >
          Clear All
        </Button>
        
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;