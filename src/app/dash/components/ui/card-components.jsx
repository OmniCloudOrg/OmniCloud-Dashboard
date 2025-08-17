"use client"

import React from 'react';
import { Clock, MoreVertical, Terminal, Power, ChevronDown, ChevronRight, Server, Box, HardDrive, Database, Network } from 'lucide-react';
import { StatusBadge, ProgressBar } from '../../../../components/ui';

/**
 * InstanceCard - A reusable card component for displaying instance information
 * Used in infrastructure management dashboard
 */
export const InstanceCard = ({ instance, onSelect }) => {
  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(instance)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{instance.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{instance.id}</div>
          </div>
        </div>
        <StatusBadge status={instance.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Type</div>
          <div className="text-sm text-white">{instance.type}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Zone</div>
          <div className="text-sm text-white">{instance.zone}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">CPU Usage</div>
          <ProgressBar 
            value={instance.cpu} 
            status={instance.status}
          />
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Memory</div>
          <ProgressBar 
            value={instance.memory} 
            status={instance.status}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Uptime: {instance.uptime}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-white">
            <Terminal size={14} />
          </button>
          <button className="text-slate-400 hover:text-white">
            <Power size={14} />
          </button>
          <button className="text-blue-400 hover:text-blue-300">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ApplicationCard - A reusable card component for displaying application information
 * Used in applications management dashboard
 */
export const ApplicationCard = ({ app, onSelect }) => {
  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(app)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Box size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{app.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{app.description}</div>
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Instances</div>
          <div className="text-sm text-white">{app.instances}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Version</div>
          <div className="text-sm text-white">{app.version}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Region</div>
          <div className="text-sm text-white">{app.region}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Runtime</div>
          <div className="text-sm text-white">{app.runtime}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Updated {app.lastUpdated}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300">
          View Details
        </button>
      </div>
    </div>
  );
};

/**
 * ExpandableCard - A reusable expandable card component
 * Used for logs, alerts, and other expandable content
 */
export const ExpandableCard = ({ 
  item, 
  expanded, 
  onToggle,
  title,
  subtitle,
  badge,
  details,
  metadata,
  actions,
  expandedContent
}) => {
  console.log("The type of onToggle is: ", typeof onToggle);
  console.log("The type of expanded is: ", typeof expanded);
  console.log("The type of item is: ", typeof item);
  console.log("The type of title is: ", typeof title);
  console.log("The type of subtitle is: ", typeof subtitle);
  console.log("The type of badge is: ", typeof badge);
  console.log("The type of details is: ", typeof details);
  console.log("The type of metadata is: ", typeof metadata);
  console.log("The type of actions is: ", typeof actions);
  console.log("The type of expandedContent is: ", typeof expandedContent);
  console.log("The type of item is: ", typeof item);

  console.log("The value of expanded is: ", expanded);
  console.log("The value of item is: ", item);
  console.log("The value of title is: ", title);
  console.log("The value of subtitle is: ", subtitle);
  console.log("The value of badge is: ", badge);
  console.log("The value of details is: ", details);
  console.log("The value of metadata is: ", metadata);
  console.log("The value of actions is: ", actions);
  console.log("The value of expandedContent is: ", expandedContent);

  return (
    <div 
      className={`border-b border-slate-800 ${expanded ? 'bg-slate-800/30' : 'hover:bg-slate-800/20'}`}
    >
      <div 
        className="px-4 py-3 flex items-start cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-none pt-1">
          {expanded ? 
            <ChevronDown size={16} className="text-slate-400" /> : 
            <ChevronRight size={16} className="text-slate-400" />
          }
        </div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {badge}
            <div className="text-sm font-medium text-white truncate">{title}</div>
          </div>
          {subtitle && (
            <div className="text-sm text-slate-400 truncate mb-1">{subtitle}</div>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            {metadata}
          </div>
        </div>
        <div className="flex-none flex items-center">
          {actions || (
            <button className="p-1 text-slate-400 hover:text-slate-300">
              <MoreVertical size={16} />
            </button>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-10 pb-4">
          {details && (
            <div className="bg-slate-900 p-4 rounded-lg">
              {details}
            </div>
          )}
          {expandedContent}
        </div>
      )}
    </div>
  );
};

/**
 * DetailItem - A reusable component for detail items in cards
 * Used across dashboard pages for displaying key-value pairs in cards
 */
export const DetailItem = ({ label, value, className = "" }) => {
  return (
    <div className={className}>
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
};

/**
 * EmptyCard - A reusable component for displaying empty state in card layouts
 * Used across dashboard pages when no items are found in a grid
 */
export const EmptyCard = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick 
}) => {
  return (
    <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
      <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-slate-400 mb-4 text-center max-w-lg">
        {description}
      </p>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="text-blue-400 hover:text-blue-300"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

/**
 * StatsCard - A reusable component for displaying statistics in a small card
 * Used across dashboard pages for displaying key metrics
 */
export const StatsCard = ({ label, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    red: "bg-red-500/10 text-red-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    purple: "bg-purple-500/10 text-purple-400"
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${colorClasses[color] || colorClasses.blue} rounded-lg`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-sm text-slate-400">{label}</div>
          <div className="text-xl font-semibold text-white">{value}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Card - A reusable card component for displaying various types of content
 * Used across dashboard pages for displaying detailed information
 */
export const Card = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  children, 
  className = ""
}) => {
  return (
    <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        {Icon && (
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <div className="text-sm text-slate-400 mt-0.5">{subtitle}</div>
          )}
        </div>
        <div className="ml-auto flex-none">
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * ResourceTypeCard - A card component for displaying resource type summaries
 */
export const ResourceTypeCard = ({ 
  title, 
  count, 
  icon: Icon, 
  status,
  percentage,
  color = "blue"
}) => {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    red: "bg-red-500/10 text-red-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    purple: "bg-purple-500/10 text-purple-400",
    orange: "bg-orange-500/10 text-orange-400",
    indigo: "bg-indigo-500/10 text-indigo-400",
    cyan: "bg-cyan-500/10 text-cyan-400"
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={18} />
        </div>
        {status && <StatusBadge status={status} />}
      </div>
      <div className="mb-2">
        <h3 className="text-xl font-semibold text-white">{count}</h3>
        <p className="text-sm text-slate-400">{title}</p>
      </div>
      {percentage !== undefined && (
        <ProgressBar 
          value={percentage} 
          status={status || 'active'} 
          showLabel={true}
          size="sm"
        />
      )}
    </div>
  );
};

/**
 * ResourceCard - A reusable card component for displaying resource information
 */
export const ResourceCard = ({ 
  resource, 
  onSelect, 
  type = "compute",
  title,
  value,
  icon: IconProp,
  color,
  subtitle,
  trend // new param: "up" | "down" | undefined
}) => {
  // Safety check - if resource is undefined or null, return a placeholder or null
  if (!resource) {
    return null; // Or a placeholder component
  }

  // Determine icon based on resource type or use provided icon
  const getIcon = () => {
    if (IconProp) return IconProp;
    switch (type) {
      case 'compute': return Server;
      case 'storage': return HardDrive;
      case 'database': return Database;
      case 'network': return Network;
      default: return Server;
    }
  };

  const Icon = getIcon();

  // Trend icon and color
  const renderTrend = () => {
    if (!trend) return null;
    if (trend === "up") {
      return (
        <span className="flex items-center text-green-400 ml-2">
          <ChevronUp size={14} className="inline-block" />
          <span className="sr-only">Upward trend</span>
        </span>
      );
    }
    if (trend === "down") {
      return (
        <span className="flex items-center text-red-400 ml-2">
          <ChevronDown size={14} className="inline-block" />
          <span className="sr-only">Downward trend</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect && onSelect(resource)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${color || "bg-blue-500/10 text-blue-400"}`}>
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white truncate flex items-center">
              {title || resource.name || 'Unnamed Resource'}
              {renderTrend()}
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">
              {subtitle || resource.id || 'No ID'}
            </div>
          </div>
        </div>
        <StatusBadge status={resource.status || 'unknown'} />
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        {value && (
          <div>
            <div className="text-xs text-slate-500 mb-1">Value</div>
            <div className="text-sm text-white">{value}</div>
          </div>
        )}
        {resource.specs && Object.entries(resource.specs).map(([key, val], idx) => (
          <div key={idx}>
            <div className="text-xs text-slate-500 mb-1 capitalize">{key}</div>
            <div className="text-sm text-white">{val}</div>
          </div>
        ))}
      </div>
      
      {(resource.cpu !== undefined || resource.memory !== undefined) && (
        <div className="space-y-2 mt-3">
          {resource.cpu !== undefined && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>CPU</span>
                <span>{resource.cpu}%</span>
              </div>
              <ProgressBar value={resource.cpu} size="sm" />
            </div>
          )}
          {resource.memory !== undefined && (
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Memory</span>
                <span>{resource.memory}%</span>
              </div>
              <ProgressBar value={resource.memory} size="sm" />
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={12} />
          <span>Last updated: {resource.lastUpdated || "Just now"}</span>
        </div>
        <div className="text-blue-400 hover:text-blue-300">
          View Details
        </div>
      </div>
    </div>
  );
};

/**
 * ResourceSummary - A component that shows summary statistics of resources
 */
export const ResourceSummary = ({ 
  title, 
  stats = [], 
  chartData, 
  className = "" 
}) => {
  return (
    <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {chartData && (
          <button className="text-blue-400 hover:text-blue-300 text-sm">
            View Details
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2">
              {stat.icon && (
                <stat.icon size={14} className={`text-${stat.color || 'blue'}-400`} />
              )}
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
            <div className="text-xl font-semibold text-white">{stat.value}</div>
            {stat.change && (
              <div className={`text-xs ${stat.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change > 0 ? '+' : ''}{stat.change}% from last week
              </div>
            )}
          </div>
        ))}
      </div>
      
      {chartData && (
        <div className="h-48 mt-4">
          {/* Chart would be rendered here */}
          {/* For example: <LineChartComponent data={chartData} /> */}
        </div>
      )}
    </div>
  );
};

/**
 * ResourceCards - A main component that renders different resource card layouts
 */
export const ResourceCards = ({
  resourceTypes,
  resources,
  layout = "grid",
  columns = 4,
  onSelectResource,
  resourceTypesTitle = "Resource Types",
  resourceListTitle = "Resource Instances"
}) => {
  return (
    <div className="space-y-6">
      {resourceTypes?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">{resourceTypesTitle}</h3>
          <DashboardGrid columns={columns} gap={4}>
            {resourceTypes.map((type, idx) => (
              <ResourceTypeCard
                key={idx}
                title={type.title}
                count={type.count}
                icon={type.icon}
                status={type.status}
                percentage={type.percentage}
                color={type.color || "blue"}
              />
            ))}
          </DashboardGrid>
        </div>
      )}
      
      {resources?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">{resourceListTitle}</h3>
          {layout === "grid" ? (
            <DashboardGrid columns={Math.min(columns, 3)} gap={4}>
              {resources.map((resource, idx) => (
                <ResourceCard
                  key={idx}
                  resource={resource}
                  onSelect={onSelectResource}
                  type={resource.type}
                />
              ))}
            </DashboardGrid>
          ) : (
            <div className="space-y-3">
              {resources.map((resource, idx) => (
                <ResourceCard
                  key={idx}
                  resource={resource}
                  onSelect={onSelectResource}
                  type={resource.type}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};