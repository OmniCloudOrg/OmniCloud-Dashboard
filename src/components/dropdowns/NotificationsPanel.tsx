import React from 'react';
import DropdownPanel from './DropdownPanel';
import { sampleNotifications, getNotificationIcon } from '../../utils/navigation';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Notifications panel component
 */
const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Notifications">
      <div className="max-h-96 overflow-y-auto">
        {sampleNotifications.length > 0 ? (
          sampleNotifications.map((notification) => {
            const { icon: Icon, bgClass, textClass } = getNotificationIcon(notification.type);
            
            return (
              <div 
                key={notification.id} 
                className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex gap-3 items-start">
                  <div className={`p-2 rounded-full ${bgClass} ${textClass} flex-shrink-0`}>
                    <Icon size={16} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-slate-400">{notification.message}</div>
                    <div className="text-xs text-slate-500 mt-1">{notification.time}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
              <span className="text-xl">🔔</span>
            </div>
            <p>No notifications at the moment</p>
          </div>
        )}
      </div>

      {sampleNotifications.length > 0 && (
        <div className="p-3 border-t border-slate-800">
          <button className="w-full py-2 text-sm text-center text-blue-400 hover:text-blue-300 transition-colors">
            Mark all as read
          </button>
        </div>
      )}
    </DropdownPanel>
  );
};

export default NotificationsPanel;