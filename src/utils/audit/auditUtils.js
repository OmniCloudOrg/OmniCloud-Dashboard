/**
 * Audit Logs Utility Functions
 * Common operations for audit log processing
 */

import { 
  USER_MAPPING, 
  RESOURCE_TYPE_MAPPING, 
  ACTION_MAPPING, 
  SEVERITY_CONFIG 
} from '@/data/auditConstants';

/**
 * Get user display name from user ID
 */
export const getUserName = (userId) => {
  return USER_MAPPING[userId] || `User ${userId}`;
};

/**
 * Get readable resource type from raw type
 */
export const getResourceType = (type) => {
  return RESOURCE_TYPE_MAPPING[type] || type;
};

/**
 * Get readable action display text
 */
export const getActionDisplay = (action, resourceType, auditClient = null) => {
  if (auditClient && auditClient.getActionDescription) {
    return auditClient.getActionDescription(action, resourceType);
  }
  
  // Fallback
  const actionText = ACTION_MAPPING[action] || action;
  const resourceText = getResourceType(resourceType);
  return `${actionText} ${resourceText}`;
};

/**
 * Get severity level from action
 */
export const getSeverity = (action) => {
  if (SEVERITY_CONFIG.high.actions.includes(action)) return 'high';
  if (SEVERITY_CONFIG.medium.actions.includes(action)) return 'medium';
  return 'low';
};

/**
 * Get severity styling configuration
 */
export const getSeverityConfig = (severity) => {
  return SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
};

/**
 * Extract event type from action
 */
export const getEventTypeFromAction = (action) => {
  if (!action) return 'other';
  action = action.toLowerCase();
  
  const actionMap = {
    'deploy': 'deployment',
    'create': 'access',
    'delete': 'deletion',
    'update': 'setting',
    'login': 'login',
    'logout': 'login'
  };
  
  return actionMap[action] || action;
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp, auditClient = null) => {
  if (auditClient && auditClient.formatTimestamp) {
    return auditClient.formatTimestamp(timestamp);
  }
  
  // Fallback formatting
  return new Date(timestamp).toLocaleString();
};

/**
 * Calculate event type counts from logs
 */
export const calculateEventTypeCounts = (logs) => {
  const typeCounts = {};
  
  logs.forEach(log => {
    if (log.action) {
      const eventType = getEventTypeFromAction(log.action);
      typeCounts[eventType] = (typeCounts[eventType] || 0) + 1;
    }
  });
  
  return typeCounts;
};

/**
 * Calculate severity counts from logs
 */
export const calculateSeverityCounts = (logs) => {
  const sevCounts = { high: 0, medium: 0, low: 0 };
  
  logs.forEach(log => {
    const severity = getSeverity(log.action);
    sevCounts[severity] = (sevCounts[severity] || 0) + 1;
  });
  
  return sevCounts;
};

/**
 * Generate activity data from logs for visualization
 */
export const generateActivityData = (logs) => {
  // Group logs by day for visualization
  const dayGroups = {
    '05-15': 0, // May 15
    '05-16': 0,
    '05-17': 0,
    '05-18': 0,
    '05-19': 0,
    '05-20': 0, // May 20
    '05-21': 0,
    '05-22': 0,
  };
  
  // Count logs by date
  logs.forEach(log => {
    const timestampField = log.timestamp || log.created_at;
    if (timestampField) {
      const date = new Date(timestampField);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateKey = `${month}-${day}`;
      
      if (dayGroups[dateKey] !== undefined) {
        dayGroups[dateKey]++;
      }
    }
  });
  
  // Convert to array format for chart
  return Object.entries(dayGroups).map(([date, count]) => ({
    time: date,
    count
  }));
};

/**
 * Filter audit logs based on search query and event types
 */
export const filterAuditLogs = (logs, searchQuery, selectedEventTypes) => {
  return logs.filter(log => 
    (searchQuery === '' || 
      (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (log.resource_type && log.resource_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (getUserName(log.user_id) && getUserName(log.user_id).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.resource_id && log.resource_id.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    selectedEventTypes.includes(getEventTypeFromAction(log.action || ''))
  );
};
