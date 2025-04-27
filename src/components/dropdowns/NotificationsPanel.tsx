import React, { useState, useRef, useEffect } from 'react';
import DropdownPanel from './DropdownPanel';
import { sampleNotifications, getNotificationIcon } from '../../utils/navigation';
import { Bell, CheckCheck, Filter, Clock, Settings, ChevronDown } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  time: string;
  date?: string;
  read?: boolean;
  actions?: string[];
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const notifications: Notification[] = sampleNotifications.map((n) => ({
    ...n,
    id: String(n.id),
    type: n.type === 'error' ? 'alert' : n.type, // Map 'error' to 'alert'
  }));

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    return activeFilter === 'all' || notification.type === activeFilter;
  });

  // Group by date
  const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
    const date = notification.date || 'Today';
    if (!acc[date]) acc[date] = [];
    acc[date].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  const toggleExpand = (id: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setShowFilterDropdown(false);
  };

  const getFilterInfo = (filter: string) => {
    switch (filter) {
      case 'alert': return { label: 'Alerts', color: 'red' };
      case 'info': return { label: 'Info', color: 'blue' };
      case 'success': return { label: 'Success', color: 'green' };
      case 'warning': return { label: 'Warnings', color: 'yellow' };
      default: return { label: 'All', color: 'blue' };
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.read !== true).length;
  const { label: filterLabel, color: filterColor } = getFilterInfo(activeFilter);

  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Notifications</h3>
        {unreadCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={filterDropdownRef}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md ${
              activeFilter !== 'all'
                ? `bg-${filterColor}-500/20 text-${filterColor}-400`
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {activeFilter !== 'all' && (
              <span className={`w-1.5 h-1.5 rounded-full bg-${filterColor}-500`}></span>
            )}
            <span>{filterLabel}</span>
            <ChevronDown size={12} />
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-1 w-32 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {['all', 'alert', 'info', 'success', 'warning'].map((filter) => {
                  const { label, color } = getFilterInfo(filter);
                  return (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`flex w-full items-center gap-1 px-2 py-1 text-xs ${
                        activeFilter === filter
                          ? `text-${color}-400`
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {filter !== 'all' && (
                        <span className={`w-1.5 h-1.5 rounded-full bg-${color}-500`}></span>
                      )}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <Settings size={14} className="text-slate-400 hover:text-slate-300 cursor-pointer" />
      </div>
    </div>
  );

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="" headerContent={headerContent}>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {Object.keys(groupedNotifications).length > 0 ? (
          Object.entries(groupedNotifications).map(([date, notifications]) => (
            <div key={date}>
              <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-slate-500">
                {date}
              </div>

              {notifications.map((notification) => {
                const { icon: Icon, bgClass, textClass } = getNotificationIcon(notification.type);
                const isExpanded = expandedNotifications.has(notification.id);

                return (
                  <div
                    key={notification.id}
                    className={`border-b border-slate-800/50 transition-colors ${
                      notification.read ? 'bg-slate-900/50' : 'bg-slate-800/20'
                    } hover:bg-slate-800/30 cursor-pointer`}
                    onClick={() => toggleExpand(notification.id)}
                  >
                    <div className="p-3">
                      <div className="flex gap-3 items-start">
                        <div className={`p-2 rounded-full ${bgClass} ${textClass} flex-shrink-0`}>
                          <Icon size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className={`font-medium truncate ${notification.read ? 'text-slate-400' : 'text-slate-200'}`}>
                              {notification.title}
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                            )}
                          </div>
                          <div className={`text-sm ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'} ${notification.read ? 'text-slate-500' : 'text-slate-400'}`}>
                            {notification.message}
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock size={12} />
                              {notification.time}
                            </div>

                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Marked as read:', notification.id);
                                  }}
                                  className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-colors"
                                  title="Mark as read"
                                >
                                  <CheckCheck size={14} />
                                </button>
                              )}
                              {(notification.actions?.length ?? 0) > 0 && (
                                <button
                                  className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Action:', notification.actions?.[0]);
                                  }}
                                >
                                  {notification.actions?.[0]}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (notification.actions?.length ?? 0) > 0 && (
                      <div className="px-4 pb-3 pt-0">
                        <div className="flex gap-2 ml-10">
                          {notification.actions && notification.actions.map((action, idx) => (
                            <button
                              key={String(idx)}
                              className={`text-xs px-3 py-1.5 rounded ${
                                idx === 0
                                  ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              } transition-colors`}
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Action clicked:', action);
                              }}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-3">
              {activeFilter === 'all' ? (
                <Bell size={24} className="text-slate-400" />
              ) : (
                <Filter size={24} className="text-slate-400" />
              )}
            </div>
            <p>{activeFilter === 'all' ? 'No notifications at the moment' : 'No matching notifications'}</p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Show all notifications
              </button>
            )}
          </div>
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          <button className="text-sm text-slate-400 hover:text-slate-300 transition-colors flex items-center gap-1" onClick={() => {}}>
            <CheckCheck size={14} />
            Mark all as read
          </button>

          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors" onClick={() => {}}>
            View all
          </button>
        </div>
      )}
    </DropdownPanel>
  );
};

export default NotificationsPanel;
