import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ArrowUp, ArrowDown, Clock, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Base card interface
interface BaseCardProps {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  hover?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
}

// Resource card specific props
interface ResourceCardProps extends BaseCardProps {
  type: 'resource';
  title: string;
  value: string | number;
  percentage?: number;
  icon: LucideIcon | React.ComponentType<{ size?: number }>;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

// Status card specific props
interface StatusCardProps extends BaseCardProps {
  type: 'status';
  title: string;
  status: string;
  icon: LucideIcon | React.ComponentType<{ size?: number }>;
  details?: string;
}

// Instance card specific props
interface InstanceCardProps extends BaseCardProps {
  type: 'instance';
  instance: {
    name: string;
    id: string;
    status: string;
    type: string;
    zone: string;
    cpu: number;
    memory: number;
    uptime: string;
  };
  onSelect?: (instance: any) => void;
  showActions?: boolean;
}

// Application card specific props
interface ApplicationCardProps extends BaseCardProps {
  type: 'application';
  app: {
    name: string;
    description: string;
    status: string;
    instances: number;
    version: string;
    region: string;
    runtime: string;
    lastUpdated: string;
  };
  onSelect?: (app: any) => void;
}

// Stats card props
interface StatsCardProps extends BaseCardProps {
  type: 'stats';
  label: string;
  value: string | number;
  icon: LucideIcon | React.ComponentType<{ size?: number }>;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

// Empty state card props
interface EmptyCardProps extends BaseCardProps {
  type: 'empty';
  icon: LucideIcon | React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

// Expandable card props
interface ExpandableCardProps extends BaseCardProps {
  type: 'expandable';
  expanded: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  details?: React.ReactNode;
  metadata?: React.ReactNode;
  actions?: React.ReactNode;
  expandedContent?: React.ReactNode;
}

// Generic card props
interface GenericCardProps extends BaseCardProps {
  type: 'generic';
  title?: string;
  subtitle?: string;
  icon?: LucideIcon | React.ComponentType<{ size?: number }>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Union type for all card props
type CardProps = 
  | ResourceCardProps 
  | StatusCardProps 
  | InstanceCardProps 
  | ApplicationCardProps 
  | StatsCardProps 
  | EmptyCardProps 
  | ExpandableCardProps 
  | GenericCardProps;

/**
 * Consolidated Card component that handles all card variations used in the application
 */
const Card: React.FC<CardProps> = (props) => {
  const getBaseClasses = () => {
    const baseClasses = 'bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl';
    const variantClasses = {
      default: '',
      outlined: 'border-slate-700',
      filled: 'bg-slate-800'
    };
    const hoverClasses = props.hover !== false ? 'hover:border-blue-500/30 transition-all' : '';
    const clickableClasses = props.onClick ? 'cursor-pointer' : '';
    
    return `${baseClasses} ${variantClasses[props.variant || 'default']} ${hoverClasses} ${clickableClasses} ${props.className || ''}`;
  };

  const renderResourceCard = (props: ResourceCardProps) => (
    <div className={`${getBaseClasses()} p-6`} onClick={props.onClick}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${props.color}`}>
          <props.icon size={20} />
        </div>
        {props.percentage !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            props.trend === 'up' ? 'text-green-400' : 
            props.trend === 'down' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {props.trend === 'up' ? <ArrowUp size={16} /> : 
             props.trend === 'down' ? <ArrowDown size={16} /> : null}
            {props.percentage}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold text-white">{props.value}</h3>
        <p className="text-sm text-slate-400">{props.title}</p>
      </div>
    </div>
  );

  const renderStatusCard = (props: StatusCardProps) => (
    <div className={`${getBaseClasses()} p-6`} onClick={props.onClick}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{props.title}</h3>
        <StatusBadge status={props.status} />
      </div>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${
          props.status === 'healthy' || props.status === 'success' ? 'bg-green-500/10 text-green-400' :
          props.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          <props.icon size={24} />
        </div>
        {props.details && (
          <div className="text-sm text-slate-400">{props.details}</div>
        )}
      </div>
    </div>
  );

  const renderInstanceCard = (props: InstanceCardProps) => (
    <div className={`${getBaseClasses()} p-6`} onClick={() => props.onSelect?.(props.instance)}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            {props.instance.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{props.instance.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{props.instance.id}</div>
          </div>
        </div>
        <StatusBadge status={props.instance.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DetailItem label="Type" value={props.instance.type} />
        <DetailItem label="Zone" value={props.instance.zone} />
        <DetailItem label="CPU Usage" value={`${props.instance.cpu}%`} />
        <DetailItem label="Memory" value={`${props.instance.memory}%`} />
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Uptime: {props.instance.uptime}</span>
        </div>
        {props.showActions && (
          <div className="flex items-center gap-2">
            <button className="text-blue-400 hover:text-blue-300">
              Details
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderApplicationCard = (props: ApplicationCardProps) => (
    <div className={`${getBaseClasses()} p-6`} onClick={() => props.onSelect?.(props.app)}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            {props.app.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{props.app.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{props.app.description}</div>
          </div>
        </div>
        <StatusBadge status={props.app.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <DetailItem label="Instances" value={props.app.instances.toString()} />
        <DetailItem label="Version" value={props.app.version} />
        <DetailItem label="Region" value={props.app.region} />
        <DetailItem label="Runtime" value={props.app.runtime} />
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Updated {props.app.lastUpdated}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300">
          View Details
        </button>
      </div>
    </div>
  );

  const renderStatsCard = (props: StatsCardProps) => {
    const colorClasses = {
      blue: "bg-blue-500/10 text-blue-400",
      green: "bg-green-500/10 text-green-400",
      red: "bg-red-500/10 text-red-400",
      yellow: "bg-yellow-500/10 text-yellow-400",
      purple: "bg-purple-500/10 text-purple-400"
    };

    return (
      <div className={`${getBaseClasses()} p-4`} onClick={props.onClick}>
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colorClasses[props.color || 'blue']} rounded-lg`}>
            <props.icon size={18} />
          </div>
          <div>
            <div className="text-sm text-slate-400">{props.label}</div>
            <div className="text-xl font-semibold text-white">{props.value}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyCard = (props: EmptyCardProps) => (
    <div className={`${getBaseClasses()} col-span-3 py-12 flex flex-col items-center justify-center`}>
      <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
        <props.icon size={32} />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{props.title}</h3>
      <p className="text-slate-400 mb-4 text-center max-w-lg">
        {props.description}
      </p>
      {props.buttonText && (
        <button
          onClick={props.onButtonClick}
          className="text-blue-400 hover:text-blue-300"
        >
          {props.buttonText}
        </button>
      )}
    </div>
  );

  const renderExpandableCard = (props: ExpandableCardProps) => (
    <div className={`border-b border-slate-800 ${props.expanded ? 'bg-slate-800/30' : 'hover:bg-slate-800/20'}`}>
      <div 
        className="px-4 py-3 flex items-start cursor-pointer"
        onClick={props.onToggle}
      >
        <div className="flex-none pt-1">
          {props.expanded ? 
            <ChevronDown size={16} className="text-slate-400" /> : 
            <ChevronRight size={16} className="text-slate-400" />
          }
        </div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {props.badge}
            <div className="text-sm font-medium text-white truncate">{props.title}</div>
          </div>
          {props.subtitle && (
            <div className="text-sm text-slate-400 truncate mb-1">{props.subtitle}</div>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            {props.metadata}
          </div>
        </div>
        <div className="flex-none flex items-center">
          {props.actions || (
            <button className="p-1 text-slate-400 hover:text-slate-300">
              <MoreVertical size={16} />
            </button>
          )}
        </div>
      </div>
      
      {props.expanded && (
        <div className="px-10 pb-4">
          {props.details && (
            <div className="bg-slate-900 p-4 rounded-lg">
              {props.details}
            </div>
          )}
          {props.expandedContent}
        </div>
      )}
    </div>
  );

  const renderGenericCard = (props: GenericCardProps) => (
    <div className={`${getBaseClasses()} p-6`} onClick={props.onClick}>
      {props.header && props.header}
      {(props.title || props.subtitle || props.icon) && (
        <div className="flex items-center gap-3 mb-4">
          {props.icon && (
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <props.icon size={20} />
            </div>
          )}
          <div>
            {props.title && <h3 className="text-lg font-medium text-white">{props.title}</h3>}
            {props.subtitle && <p className="text-sm text-slate-400">{props.subtitle}</p>}
          </div>
        </div>
      )}
      {props.children}
      {props.footer && props.footer}
    </div>
  );

  // Render based on card type
  switch (props.type) {
    case 'resource':
      return renderResourceCard(props);
    case 'status':
      return renderStatusCard(props);
    case 'instance':
      return renderInstanceCard(props);
    case 'application':
      return renderApplicationCard(props);
    case 'stats':
      return renderStatsCard(props);
    case 'empty':
      return renderEmptyCard(props);
    case 'expandable':
      return renderExpandableCard(props);
    case 'generic':
    default:
      return renderGenericCard(props);
  }
};

/**
 * DetailItem - Helper component for displaying key-value pairs in cards
 */
export const DetailItem: React.FC<{ 
  label: string; 
  value: string; 
  className?: string; 
}> = ({ label, value, className = "" }) => (
  <div className={className}>
    <div className="text-xs text-slate-500 mb-1">{label}</div>
    <div className="text-sm text-white">{value}</div>
  </div>
);

// Export specialized card components for backward compatibility
export const ResourceCard: React.FC<Omit<ResourceCardProps, 'type'>> = (props) => (
  <Card type="resource" {...props} />
);

export const StatusCard: React.FC<Omit<StatusCardProps, 'type'>> = (props) => (
  <Card type="status" {...props} />
);

export const InstanceCard: React.FC<Omit<InstanceCardProps, 'type'>> = (props) => (
  <Card type="instance" {...props} />
);

export const ApplicationCard: React.FC<Omit<ApplicationCardProps, 'type'>> = (props) => (
  <Card type="application" {...props} />
);

export const StatsCard: React.FC<Omit<StatsCardProps, 'type'>> = (props) => (
  <Card type="stats" {...props} />
);

export const EmptyCard: React.FC<Omit<EmptyCardProps, 'type'>> = (props) => (
  <Card type="empty" {...props} />
);

export const ExpandableCard: React.FC<Omit<ExpandableCardProps, 'type'>> = (props) => (
  <Card type="expandable" {...props} />
);

export default Card;