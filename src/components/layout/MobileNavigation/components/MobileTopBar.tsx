import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

interface MobileTopBarProps {
  menuIconRotation: number;
  notificationCount: number;
  onOpenMenu: () => void;
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({
  menuIconRotation,
  notificationCount,
  onOpenMenu,
  onOpenCommandPalette,
  onToggleNotifications
}) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-slate-900 border-b border-slate-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300"
            aria-label="Open mobile menu"
          >
            <Menu 
              size={24} 
              style={{ 
                transform: `rotate(${menuIconRotation}deg)`,
                transition: 'transform 0.3s ease'
              }} 
            />
          </button>
          <span className="font-semibold">OmniCloud Platform</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300"
            aria-label="Search"
          >
            <Search size={20} className="transform hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={onToggleNotifications}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white relative transition-all duration-300"
            aria-label="Notifications"
          >
            <Bell size={20} className="transform hover:scale-110 transition-transform" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileTopBar;