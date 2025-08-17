import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="p-4 flex flex-col items-center">
      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      <p className="mt-2 text-slate-400 text-sm">Loading user data...</p>
    </div>
  );
};

export default LoadingState;