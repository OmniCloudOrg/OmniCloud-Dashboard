import React from 'react';
import DropdownPanel from './DropdownPanel';
import { helpResources } from '../../utils/navigation';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Help resources panel component
 */
const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose }) => {
  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Help & Resources">
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {helpResources.map((resource, index) => {
            const Icon = resource.icon;
            const colorClasses = {
              blue: 'bg-blue-500/10 text-blue-400',
              green: 'bg-green-500/10 text-green-400',
              purple: 'bg-purple-500/10 text-purple-400',
              amber: 'bg-amber-500/10 text-amber-400',
            };
            
            const iconColorClass = colorClasses[resource.iconColor as keyof typeof colorClasses] || colorClasses.blue;
            
            return (
              <button 
                key={index}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <div className={`p-2 rounded-full ${iconColorClass}`}>
                  <Icon size={16} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{resource.title}</div>
                  <div className="text-sm text-slate-400">{resource.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Contact Support Team
        </button>
      </div>
    </DropdownPanel>
  );
};

export default HelpPanel;