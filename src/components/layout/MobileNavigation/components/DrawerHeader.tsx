import React from 'react';
import { Cloud, X } from 'lucide-react';
import { Button } from '../../../ui';

interface DrawerHeaderProps {
  onClose: () => void;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Cloud className="text-blue-400" size={24} />
        <span className="text-lg font-semibold">OmniCloud</span>
      </div>
      <Button
        variant="icon"
        size="sm"
        icon={X}
        onClick={onClose}
        ariaLabel="Close mobile menu"
        className="transform hover:rotate-90 transition-transform duration-300"
        children={undefined}
      />
    </div>
  );
};

export default DrawerHeader;