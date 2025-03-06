import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, Key, LogOut } from 'lucide-react';
import DropdownPanel from './DropdownPanel';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * User profile dropdown panel component
 */
const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  // Actions for navigation
  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="">
      <div className="p-4 flex flex-col items-center border-b border-slate-800">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-medium mb-2 shadow-lg">
          AS
        </div>
        <div className="text-lg font-medium">Admin User</div>
        <div className="text-sm text-slate-400">admin@omnicloud.io</div>
        <div className="mt-2 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Administrator
        </div>
      </div>

      <div className="p-2">
        <button
          onClick={() => handleNavigation('/profile')}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <User size={18} />
          <span>Your Profile</span>
        </button>
        
        <button
          onClick={() => handleNavigation('/settings/account')}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <Settings size={18} />
          <span>Account Settings</span>
        </button>
        
        <button
          onClick={() => handleNavigation('/keys')}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <Key size={18} />
          <span>API Keys</span>
        </button>
        
        <div className="my-2 border-t border-slate-800"></div>
        
        <button
          onClick={() => handleNavigation('/logout')}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/80 hover:text-red-300 text-red-400 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </DropdownPanel>
  );
};

export default UserProfilePanel;