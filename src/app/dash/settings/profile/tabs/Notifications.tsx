import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface NotificationProps {
  visible: boolean;
  type: string;
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ visible, type, message }) => {
  if (!visible) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg flex items-start ${
      type === 'success' ? 'bg-green-900 bg-opacity-20 border border-green-800' :
      type === 'error' ? 'bg-red-900 bg-opacity-20 border border-red-800' :
      'bg-blue-900 bg-opacity-20 border border-blue-800'
    }`}>
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
      )}
      <p className={`${
        type === 'success' ? 'text-green-300' :
        type === 'error' ? 'text-red-300' :
        'text-blue-300'
      }`}>
        {message}
      </p>
    </div>
  );
};

export default Notification;