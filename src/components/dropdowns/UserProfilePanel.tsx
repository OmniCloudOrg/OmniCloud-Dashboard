import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, Key, LogOut, Github, Star, GitFork, Users, Code } from 'lucide-react';
import DropdownPanel from './DropdownPanel';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Improved user profile dropdown panel component
 */
const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  // Mock data - in a real application, these would come from API or context
  const userData = {
    name: 'Admin User',
    email: 'admin@omnicloud.io',
    role: 'Administrator',
    initials: 'AS',
    stars: 142,
    forks: 38,
    contributions: 364,
  };

  // Actions for navigation
  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  // Custom header content
  const profileHeaderContent = (
    <div className="w-full flex items-center justify-between">
      <div className="text-lg font-medium">Your Account</div>
      <div className="bg-slate-800/50 px-2 py-1 rounded text-xs text-slate-300 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        Active
      </div>
    </div>
  );

  return (
    <DropdownPanel 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      headerContent={profileHeaderContent}
      width="w-80"
    >
      {/* Profile section */}
      <div className="p-4 flex flex-col items-center border-b border-slate-800">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-medium mb-2 shadow-lg relative">
          {userData.initials}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" title="Online"></div>
        </div>
        <div className="text-lg font-medium">{userData.name}</div>
        <div className="text-sm text-slate-400">{userData.email}</div>
        <div className="mt-2 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {userData.role}
        </div>
      </div>

      {/* Navigation options */}
      <div className="p-2">
        <button
          onClick={() => handleNavigation('/profile')}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <User size={16} />
          <span>Your Profile</span>
        </button>
        
        <button
          onClick={() => handleNavigation('/settings/account')}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <Settings size={16} />
          <span>Account Settings</span>
        </button>
        
        <button
          onClick={() => handleNavigation('/keys')}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <Key size={16} />
          <span>API Keys</span>
        </button>

        <button
          onClick={() => handleNavigation('/teams')}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <Users size={16} />
          <span>Teams & Collaborators</span>
        </button>
        
        <div className="my-1.5 border-t border-slate-800"></div>
        
        <button
          onClick={() => handleNavigation('/logout')}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/80 hover:text-red-300 text-red-400 transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </DropdownPanel>
  );
};

export default UserProfilePanel;