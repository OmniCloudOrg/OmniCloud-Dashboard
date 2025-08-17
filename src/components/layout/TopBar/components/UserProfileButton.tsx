import React from 'react';
import { ChevronDown } from 'lucide-react';

interface UserProfileButtonProps {
  isOpen: boolean;
  userData: any;
  onToggle: () => void;
  userButtonRef: React.RefObject<HTMLButtonElement | null>;
  getUserInitials: (userData: any) => string;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({
  isOpen,
  userData,
  onToggle,
  userButtonRef,
  getUserInitials
}) => {
  return (
    <button
      ref={userButtonRef}
      onClick={onToggle}
      className="flex items-center gap-1 sm:gap-3 hover:bg-slate-800 p-1 rounded-lg transition-colors"
      aria-label="User profile"
      aria-expanded={isOpen}
      aria-haspopup="menu"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg text-xs sm:text-sm">
        {getUserInitials(userData)}
      </div>
      <div className="hidden xl:block">
        <div className="text-sm font-medium">
          {userData?.full_name || 
           userData?.display_name || 
           userData?.name || 
           'User'}
        </div>
        <div className="text-xs text-slate-400">{userData?.email || 'Loading...'}</div>
      </div>
      <ChevronDown size={14} className={`transition-transform ml-1 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

export default UserProfileButton;