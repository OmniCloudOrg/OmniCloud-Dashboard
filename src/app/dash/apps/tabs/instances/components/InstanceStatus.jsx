/**
 * Instance Status Component
 * Displays instance status with appropriate styling
 */

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { StatusBadge } from '../../../../components/ui';
import { getInstanceStatusConfig } from '@/utils/instances/instanceUtils';

const ICON_MAP = {
  CheckCircle,
  AlertTriangle,
  XCircle
};

const InstanceStatus = ({ status }) => {
  const config = getInstanceStatusConfig(status);
  
  if (status === 'running') {
    const IconComponent = ICON_MAP[config.icon];
    return (
      <div className="flex items-center">
        <IconComponent className={`w-4 h-4 mr-1 ${config.color}`} />
        <span className={config.color}>{config.label}</span>
      </div>
    );
  }
  
  return <StatusBadge status={status === 'warning' ? 'warning' : 'stopped'} />;
};

export default InstanceStatus;
