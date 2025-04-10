"use client"

import React from 'react';
import {
  ModalContainer,
  MultiStepProgress,
  FormGroup,
  FormField,
  ModalFooter
} from '../../components/ui';

const CreateInstanceModal = ({ isOpen, onClose }) => {
  return (
    <ModalContainer 
      isOpen={isOpen} 
      onClose={onClose}
      title="Create New Instance"
    >
      <div className="space-y-6">
        <MultiStepProgress step={1} totalSteps={3} />
        
        <FormGroup title="Instance Details">
          <FormField
            label="Name"
            id="name"
            type="text"
            placeholder="my-instance"
            required
          />
          
          <FormGroup columns={2}>
            <FormField
              label="Provider"
              id="provider"
              type="select"
              options={[
                { value: 'aws', label: 'AWS' },
                { value: 'gcp', label: 'Google Cloud' },
                { value: 'azure', label: 'Azure' },
                { value: 'digitalocean', label: 'DigitalOcean' }
              ]}
            />
            <FormField
              label="Region"
              id="region"
              type="select"
              options={[
                { value: 'us-east', label: 'US East (N. Virginia)' },
                { value: 'us-west', label: 'US West (Oregon)' },
                { value: 'eu-central', label: 'EU Central (Frankfurt)' },
                { value: 'ap-southeast', label: 'Asia Pacific (Singapore)' }
              ]}
            />
          </FormGroup>
        </FormGroup>
        
        <ModalFooter
          onCancel={onClose}
          onSubmit={() => console.log('Creating instance...')}
          isMultiStep={true}
          step={1}
          totalSteps={3}
          submitText="Next"
        />
      </div>
    </ModalContainer>
  );
};

export default CreateInstanceModal;