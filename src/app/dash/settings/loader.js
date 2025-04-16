"use client"

import { useState, useEffect } from 'react';

/**
 * Load settings configuration from a JSON file
 * @param {string} configPath - Path to the JSON configuration file
 * @returns {Object} - The settings configuration and state
 */
export const useSettingsConfig = (configPath) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingsState, setSettingsState] = useState({});

  // Load the configuration from the JSON file
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch(configPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load settings configuration: ${response.status}`);
        }
        
        const data = await response.json();
        setConfig(data);
        
        // Initialize settings state with default values
        const initialState = {};
        
        // Process each group
        data.groups.forEach(group => {
          // Process fields directly in the group
          if (group.fields) {
            group.fields.forEach(field => {
              initialState[field.id] = field.defaultValue;
            });
          }
          
          // Process fields in columns
          if (group.columns) {
            group.columns.forEach(column => {
              column.forEach(field => {
                initialState[field.id] = field.defaultValue;
              });
            });
          }
        });
        
        setSettingsState(initialState);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadConfig();
  }, [configPath]);

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
   * Save all settings
   * @returns {Promise<void>}
   */
  const saveSettings = async () => {
    // In a real app, this would send the settings to a backend API
    console.log('Saving settings:', settingsState);
    
    // You could implement an API call here
    // const response = await fetch('/api/settings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settingsState)
    // });
    
    return Promise.resolve();
  };

  return {
    config,
    loading,
    error,
    settingsState,
    updateSetting,
    handleChange,
    handleToggle,
    saveSettings
  };
};

export default useSettingsConfig;