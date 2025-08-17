import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, Shield } from 'lucide-react';

interface MenuSectionProps {
  onClose: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onClose }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="divide-y divide-slate-700">
      <div className="py-2">
        <div className="px-4 py-1 text-xs text-slate-400 uppercase font-medium">Account</div>
        
        <button 
          onClick={() => handleNavigation('/dash/settings/profile')}
          className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
        >
          <User size={16} className="text-slate-400 mr-3" />
          <span className="text-sm text-slate-300">Profile Settings</span>
        </button>
        
        <button 
          onClick={() => handleNavigation('/dash/settings')}
          className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
        >
          <Settings size={16} className="text-slate-400 mr-3" />
          <span className="text-sm text-slate-300">Platform Settings</span>
        </button>
      </div>
      
      <div className="py-2">
        <div className="px-4 py-1 text-xs text-slate-400 uppercase font-medium">System</div>
        
        <button 
          onClick={() => handleNavigation('/dash/security')}
          className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
        >
          <Shield size={16} className="text-slate-400 mr-3" />
          <span className="text-sm text-slate-300">Security</span>
        </button>
      </div>
    </div>
  );
};

export default MenuSection;