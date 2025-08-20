/**
 * Instance Actions Component
 * Renders action buttons for an instance
 */

import React from 'react';
import { CheckCircle, XCircle, RefreshCw, Terminal } from 'lucide-react';
import { IconButton } from '../../../../components/ui';
import { canPerformAction } from '@/utils/instances/instanceUtils';

const ICON_MAP = {
  CheckCircle,
  XCircle,
  RefreshCw,
  Terminal
};

const InstanceActions = ({ instance, onAction }) => {
  const actions = [
    {
      key: 'toggle',
      icon: instance.status === 'running' ? 'XCircle' : 'CheckCircle',
      variant: instance.status === 'running' ? 'danger' : 'success',
      tooltip: instance.status === 'running' ? 'Stop' : 'Start',
      action: instance.status === 'running' ? 'stop' : 'start'
    },
    {
      key: 'restart',
      icon: 'RefreshCw',
      variant: 'info',
      tooltip: 'Restart',
      action: 'restart'
    },
    {
      key: 'terminal',
      icon: 'Terminal',
      variant: 'secondary',
      tooltip: 'Console',
      action: 'terminal'
    }
  ];

  return (
    <div className="flex items-center justify-end gap-2">
      {actions.map(({ key, icon, variant, tooltip, action }) => {
        const IconComponent = ICON_MAP[icon];
        const canPerform = canPerformAction(instance, action);
        
        return (
          <IconButton
            key={key}
            icon={IconComponent}
            variant={variant}
            size="sm"
            tooltip={tooltip}
            disabled={!canPerform}
            onClick={() => onAction(instance, action)}
          />
        );
      })}
    </div>
  );
};

export default InstanceActions;
