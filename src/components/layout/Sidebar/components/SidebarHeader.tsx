import React from 'react';
import StatusIndicator from '../../../navigation/StatusIndicator';
import { SystemStatus } from '../../../../types';

interface SidebarHeaderProps {
  systemStatus: SystemStatus;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ systemStatus }) => {
  return (
    <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800">
      <div className="p-3 pl-5">
        <div className="flex items-center gap-3">
          <div>
            <img src="/logo-wide-transparent-cropped.svg" alt="OmniCloud Logo" className="w-48 justify-center center" />
            <div className="flex items-center gap-2 text-slate-400 text-sm pl-20">
              <StatusIndicator status={systemStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;