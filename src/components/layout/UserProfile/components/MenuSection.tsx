'use client';

import React from 'react';
import Link from 'next/link';
import { User, Settings, Shield } from 'lucide-react';

interface MenuSectionProps {
  onClose: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ onClose }) => {
  // Only use handleNavigation for non-Link buttons if needed

  return (
    <div className="divide-y divide-slate-700">
      <div className="py-2">
        <div className="px-4 py-1 text-xs text-slate-400 uppercase font-medium">Account</div>
        
        <Link href="/dash/settings/profile">
          <button
            className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
            onClick={onClose}
          >
            <User size={16} className="text-slate-400 mr-3" />
            <span className="text-sm text-slate-300">Profile Settings</span>
          </button>
        </Link>
        
        <Link href="/dash/settings">
          <button
            className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
            onClick={onClose}
          >
            <Settings size={16} className="text-slate-400 mr-3" />
            <span className="text-sm text-slate-300">Platform Settings</span>
          </button>
        </Link>
      </div>
      
      <div className="py-2">
        <div className="px-4 py-1 text-xs text-slate-400 uppercase font-medium">System</div>
        
        <Link href="/dash/security">
          <button
            className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
            onClick={onClose}
          >
            <Shield size={16} className="text-slate-400 mr-3" />
            <span className="text-sm text-slate-300">Security</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MenuSection;