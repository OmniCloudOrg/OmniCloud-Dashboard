import React, { useState } from 'react';
import { Search, ExternalLink, Headphones } from 'lucide-react';
import DropdownPanel from './DropdownPanel';
import { helpResources } from '../../utils/navigation';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Enhanced help resources panel component
 */
const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter resources based on search term
  const filteredResources = searchTerm 
    ? helpResources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : helpResources;
  
  // Custom header content with search
  const helpHeaderContent = (
    <div className="w-full">
      <div className="text-lg font-medium mb-2">Help & Resources</div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search help resources..."
          className="w-full py-2 px-3 pl-9 bg-slate-800 border border-slate-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
            onClick={() => setSearchTerm('')}
          >
            <span className="sr-only">Clear search</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <DropdownPanel 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      headerContent={helpHeaderContent}
      width="w-80"
    >
      {filteredResources.length > 0 ? (
        <div className="p-3 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {filteredResources.map((resource, index) => {
              const Icon = resource.icon;
              const colorClasses = {
                blue: 'bg-blue-500/10 text-blue-400',
                green: 'bg-green-500/10 text-green-400',
                purple: 'bg-purple-500/10 text-purple-400',
                amber: 'bg-amber-500/10 text-amber-400',
              };
              
              const iconColorClass = colorClasses[resource.iconColor as keyof typeof colorClasses] || colorClasses.blue;
              
              return (
                <a 
                  key={index}
                  href={resource.url || '#'}
                  target={resource.url ? "_blank" : undefined}
                  rel={resource.url ? "noopener noreferrer" : undefined}
                  className="block group"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className={`p-2 rounded-full ${iconColorClass}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium flex items-center">
                        {resource.title}
                        {resource.url && (
                          <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        )}
                      </div>
                      <div className="text-sm text-slate-400">{resource.description}</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
            <Search size={24} className="text-slate-400" />
          </div>
          <p>No matching resources found</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      <div className="p-3 border-t border-slate-800 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // Handle direct support action
            console.log('Opening live support');
          }}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Headphones size={14} />
          <span>Contact Support Team</span>
        </a>
        
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            // Handle documentation 
            window.open('https://docs.example.com', '_blank');
          }}
          className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          View all docs
        </a>
      </div>
    </DropdownPanel>
  );
};

export default HelpPanel;