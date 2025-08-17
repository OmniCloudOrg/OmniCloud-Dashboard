"use client"

import React, { useState } from 'react';
import { 
  Settings, Shield, Network, CheckCircle, Server, 
  Key, Cpu, GitBranch, AlertTriangle, 
  Cloud, Lock, Globe, Database, RefreshCw, Check,
  UserPlus, Layers, Briefcase, Users, FileText,
  Package, Bell, Calendar, Clock, Code
} from 'lucide-react';

import { 
  Button,
  ResourceCard,
  DashboardLayout,
  DashboardSection,
  FormField, 
  FormGroup, 
  ToggleSwitch 
} from '../../../components/ui';

// Import configuration directly (will be included at build time)
import platformConfig from './config/platform-config.json';

// Map of icon names to components
const iconMap = {
  Settings,
  Shield,
  Network,
  CheckCircle,
  Server,
  Key,
  Cpu,
  GitBranch,
  AlertTriangle,
  Cloud,
  Lock,
  Globe,
  Database,
  RefreshCw,
  Check,
  UserPlus,
  Layers,
  Briefcase,
  Users,
  FileText,
  Package,
  Bell,
  Calendar,
  Clock,
  Code
};

/**
 * Get an icon component by name
 * @param {string} name - Icon name
 * @returns {React.Component} - Icon component
 */
const getIconByName = (name) => {
  const IconComponent = iconMap[name] || Settings;
  return IconComponent;
};

/**
 * Initialize settings state with default values from config
 */
const initializeSettingsState = (config) => {
  const initialState = {};
  
  // Process each group
  config.groups.forEach(group => {
    // Process fields directly in the group
    if (group.fields) {
      group.fields.forEach(field => {
        initialState[field.id] = field.defaultValue;
      });
    }
    
    // Process fields in columns
    if (group.columns) {
      group.columns.forEach(column => {
        if (column.fields) {
          column.fields.forEach(field => {
            initialState[field.id] = field.defaultValue;
          });
        }
      });
    }
  });
  
  return initialState;
};

/**
 * Root page component that renders settings based on static JSON configuration
 */
export default function Page() {
  // Initialize state with the default values from the imported config
  const [settingsState, setSettingsState] = useState(() => 
    initializeSettingsState(platformConfig)
  );
  
  /**
   * Update a setting value
   * @param {string} id - Setting ID
   * @param {any} value - New value
   */
  const updateSetting = (id, value) => {
    setSettingsState(prev => ({
      ...prev,
      [id]: value
    }));
  };

  /**
   * Handle input change events
   * @param {Event} e - DOM event
   */
  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    updateSetting(id, newValue);
  };

  /**
   * Handle toggle switch events
   * @param {string} id - Setting ID
   * @returns {Function} - Event handler
   */
  const handleToggle = (id) => (e) => {
    updateSetting(id, e.target.checked);
  };

  /**
   * Save settings handler
   */
  const handleSaveSettings = () => {
    console.log('Saving settings:', settingsState);
    alert('Settings saved successfully!');
    // In a real app, you would send this to your backend
  };

  return (
    <DashboardLayout
      title={platformConfig.title || "Platform Configuration"}
      description={platformConfig.description}
      actionLabel="Save Changes"
      onAction={handleSaveSettings}
    >
      <div className="space-y-6">
        {platformConfig.groups.map((group) => {
          const IconComponent = getIconByName(group.icon);
          const iconColor = group.color || "text-blue-400";
          
          return (
            <DashboardSection
              key={group.id}
              title={group.title}
              description={group.description}
              icon={<IconComponent className={iconColor} />}
            >
              {group.fields && (
                <FormGroup columns={group.columns?.length || 1}>
                  {group.fields.map((field) => (
                    renderField(field, settingsState, handleChange, handleToggle)
                  ))}
                </FormGroup>
              )}

              {group.columns && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.columns.map((column, columnIndex) => (
                    <div key={columnIndex}>
                      {column.heading && (
                        <h4 className="text-white font-medium mb-4">{column.heading}</h4>
                      )}
                      <div className="space-y-4">
                        {column.fields.map((field) => (
                          renderField(field, settingsState, handleChange, handleToggle)
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {group.cards && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {group.cards.map((card, cardIndex) => {
                    const CardIcon = getIconByName(card.icon);
                    return (
                      <ResourceCard
                        key={cardIndex}
                        title={card.title}
                        value={card.valueFrom ? settingsState[card.valueFrom] : card.value}
                        icon={CardIcon}
                        color={card.color || "bg-blue-500/10 text-blue-400"}
                        subtitle={card.subtitle}
                      />
                    );
                  })}
                </div>
              )}
            </DashboardSection>
          );
        })}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="secondary">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveSettings}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Render a field based on its type
 */
const renderField = (field, settingsState, handleChange, handleToggle) => {
  const value = settingsState[field.id];
  
  switch (field.type) {
    case 'toggle':
      return (
        <ToggleSwitch
          key={field.id}
          id={field.id}
          label={field.label}
          description={field.description}
          isOn={value}
          onToggle={handleToggle(field.id)}
          disabled={field.disabled}
        />
      );
      
    case 'checkbox':
      return (
        <FormField
          key={field.id}
          id={field.id}
          type="checkbox"
          placeholder={field.label}
          checked={value}
          onChange={handleChange}
          disabled={field.disabled}
        />
      );
      
    case 'select':
      return (
        <FormField
          key={field.id}
          label={field.label}
          id={field.id}
          type="select"
          value={value}
          onChange={handleChange}
          options={field.options}
          disabled={field.disabled}
          required={field.required}
          helpText={field.helpText}
        />
      );
      
    case 'textarea':
      return (
        <FormField
          key={field.id}
          label={field.label}
          id={field.id}
          type="textarea"
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          rows={field.rows || 3}
          disabled={field.disabled}
          required={field.required}
          helpText={field.helpText}
        />
      );
      
    case 'radio':
      return (
        <FormField
          key={field.id}
          label={field.label}
          id={field.id}
          type="radio"
          value={value}
          onChange={handleChange}
          options={field.options}
          disabled={field.disabled}
          required={field.required}
          helpText={field.helpText}
        />
      );
      
    case 'number':
      return (
        <FormField
          key={field.id}
          label={field.label}
          id={field.id}
          type="number"
          value={value}
          onChange={handleChange}
          min={field.min}
          max={field.max}
          step={field.step}
          disabled={field.disabled}
          required={field.required}
          helpText={field.helpText}
        />
      );
      
    default:
      return (
        <FormField
          key={field.id}
          label={field.label}
          id={field.id}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={field.placeholder}
          disabled={field.disabled}
          required={field.required}
          helpText={field.helpText}
        />
      );
  }
};