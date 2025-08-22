/**
 * Configuration Panels Component
 * Displays auto scaling and health check configurations
 */

import React from 'react';
import { DashboardSection } from '../../../../components/ui';
import { AUTO_SCALING_CONFIG, HEALTH_CHECK_CONFIG } from '@/data/instanceConstants';

const ConfigurationPanels = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <DashboardSection title="Auto Scaling Configuration">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="text-green-400">{AUTO_SCALING_CONFIG.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Min Instances</span>
            <span className="text-white">{AUTO_SCALING_CONFIG.minInstances}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Max Instances</span>
            <span className="text-white">{AUTO_SCALING_CONFIG.maxInstances}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Scale Up</span>
            <span className="text-white">{AUTO_SCALING_CONFIG.scaleUp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Scale Down</span>
            <span className="text-white">{AUTO_SCALING_CONFIG.scaleDown}</span>
          </div>
        </div>
      </DashboardSection>
      
      <DashboardSection title="Health Checks">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-green-400">{HEALTH_CHECK_CONFIG.status}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Endpoint</span>
            <span className="text-white">{HEALTH_CHECK_CONFIG.endpoint}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Interval</span>
            <span className="text-white">{HEALTH_CHECK_CONFIG.interval}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Timeout</span>
            <span className="text-white">{HEALTH_CHECK_CONFIG.timeout}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Success Codes</span>
            <span className="text-white">{HEALTH_CHECK_CONFIG.successCodes}</span>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
};

export default ConfigurationPanels;
