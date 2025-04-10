"use client"

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  RefreshCw, 
  Clock, 
  Calendar, 
  Search,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  ExternalLink,
  Settings,
  ArrowUpRight,
  Server,
  Network,
  Key,
  Globe,
  ShieldOff,
  FileText,
  Activity,
  Database,
  EyeOff,
  Check,
  X,
  User,
  HardDrive,
  AlertCircle,
  BarChart2,
  Zap,
  Target,
  Layers,
  Share2,
  Terminal,
  Hash,
  RotateCw,
  Cpu,
  Coffee,
  CloudSnow,
  GitBranch,
  Slash,
  PieChart as PieChartIcon,
  Code
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Resource Card Component
const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle, onClick, clickable = false }) => (
  <div 
    className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 ${clickable ? 'cursor-pointer hover:border-blue-500/30 transition-all' : ''}`}
    onClick={clickable ? onClick : undefined}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {percentage !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' && percentage > 0 ? 'text-red-400' : 
          trend === 'up' && percentage < 0 ? 'text-green-400' :
          trend === 'down' && percentage > 0 ? 'text-green-400' : 
          trend === 'down' && percentage < 0 ? 'text-red-400' : 
          'text-slate-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : trend === 'down' ? <ArrowUpRight size={16} className="rotate-90" /> : null}
          {percentage > 0 ? '+' : ''}{percentage}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

// Security Risk Level Badge
const RiskLevelBadge = ({ level }) => {
  let bgColor, textColor, icon;
  
  switch (level.toLowerCase()) {
    case 'critical':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <AlertCircle size={14} />;
      break;
    case 'high':
      bgColor = 'bg-orange-500/10';
      textColor = 'text-orange-400';
      icon = <AlertTriangle size={14} />;
      break;
    case 'medium':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      icon = <AlertTriangle size={14} />;
      break;
    case 'low':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <Info size={14} />;
      break;
    default:
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor.replace('text-', '')}/20`}>
      {icon}
      <span className="uppercase">{level}</span>
    </div>
  );
};

// Custom Info icon component
const Info = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );
};

// CF Stack Status Badge
const StackStatusBadge = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status) {
    case 'CREATE_COMPLETE':
    case 'UPDATE_COMPLETE':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
      break;
    case 'CREATE_IN_PROGRESS':
    case 'UPDATE_IN_PROGRESS':
    case 'DELETE_IN_PROGRESS':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <RefreshCw size={14} />;
      break;
    case 'CREATE_FAILED':
    case 'UPDATE_FAILED':
    case 'DELETE_FAILED':
    case 'ROLLBACK_FAILED':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <AlertCircle size={14} />;
      break;
    case 'ROLLBACK_IN_PROGRESS':
    case 'UPDATE_ROLLBACK_IN_PROGRESS':
      bgColor = 'bg-orange-500/10';
      textColor = 'text-orange-400';
      icon = <RefreshCw size={14} />;
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = <Info size={14} />;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor.replace('text-', '')}/20`}>
      {icon}
      <span className="uppercase">{status.replace('_', ' ')}</span>
    </div>
  );
};

// Security vulnerability/finding list item
const SecurityFinding = ({ finding, expanded, onToggle, onActionClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <X size={16} className="text-red-400" />;
      case 'in-progress':
        return <RotateCw size={16} className="text-yellow-400" />;
      case 'mitigated':
        return <Check size={16} className="text-green-400" />;
      default:
        return null;
    }
  };
  
  const getActionButton = (finding) => {
    switch (finding.status) {
      case 'open':
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onActionClick(finding.id, 'mitigate');
            }}
            className="px-3 py-1.5 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700"
          >
            {finding.cfFix ? 'Apply CF Patch' : 'Mitigate Now'}
          </button>
        );
      case 'in-progress':
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onActionClick(finding.id, 'view-progress');
            }}
            className="px-3 py-1.5 bg-yellow-600 rounded-lg text-sm text-white hover:bg-yellow-700"
          >
            View Progress
          </button>
        );
      case 'mitigated':
        return (
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onActionClick(finding.id, 'verify');
            }}
            className="px-3 py-1.5 bg-green-600 rounded-lg text-sm text-white hover:bg-green-700"
          >
            Verify
          </button>
        );
      default:
        return null;
    }
  };
  
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
            <RiskLevelBadge level={finding.severity} />
            <div className="text-sm font-medium text-white truncate">{finding.title}</div>
            {finding.driftDetected && (
              <div className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs border border-purple-400/20">
                Drift Detected
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{finding.discovered}</span>
            </div>
            <div className="flex items-center gap-1">
              <Server size={12} />
              <span>{finding.resourceType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target size={12} />
              <span>{finding.resourceName}</span>
            </div>
            <div className="flex items-center gap-1">
              <CloudSnow size={12} />
              <span>{finding.stackName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe size={12} />
              <span>{finding.region}</span>
            </div>
            <div className="flex items-center gap-1">
              {getStatusIcon(finding.status)}
              <span className="capitalize">{finding.status.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
        <div className="flex-none hidden md:block">
          {getActionButton(finding)}
        </div>
      </div>
      
      {expanded && (
        <div className="px-10 pb-4 space-y-4">
          <div className="bg-slate-900 p-4 rounded-lg text-sm text-slate-300">
            <div className="mb-3">
              <p className="mb-2">{finding.description}</p>
              {finding.impact && (
                <div className="mt-3">
                  <div className="text-white font-medium mb-1">Potential Impact:</div>
                  <p>{finding.impact}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-500 mb-1">CVSS Score</div>
                <div className="flex items-center">
                  <span className={`font-mono font-bold ${
                    finding.cvssScore >= 9.0 ? 'text-red-400' :
                    finding.cvssScore >= 7.0 ? 'text-orange-400' :
                    finding.cvssScore >= 4.0 ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>{finding.cvssScore.toFixed(1)}</span>
                  <span className="ml-2">({finding.cvssVector || 'N/A'})</span>
                </div>
              </div>
              {finding.cve && (
                <div>
                  <div className="text-slate-500 mb-1">CVE</div>
                  <div className="font-mono">{finding.cve}</div>
                </div>
              )}
              <div>
                <div className="text-slate-500 mb-1">Category</div>
                <div>{finding.category}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Detection Method</div>
                <div>{finding.detectionMethod}</div>
              </div>
              {finding.cfResourceId && (
                <div>
                  <div className="text-slate-500 mb-1">CF Logical ID</div>
                  <div className="font-mono text-xs">{finding.cfResourceId}</div>
                </div>
              )}
              {finding.stackName && (
                <div>
                  <div className="text-slate-500 mb-1">Stack Name</div>
                  <div className="font-mono text-xs">{finding.stackName}</div>
                </div>
              )}
            </div>
          </div>
          
          {finding.cfFix && (
            <div className="bg-slate-900 p-4 rounded-lg text-sm">
              <div className="text-white font-medium mb-1">CloudFormation Patch:</div>
              <div className="bg-slate-800 p-3 rounded text-xs font-mono text-slate-300 overflow-x-auto">
                <pre>{finding.cfFix}</pre>
              </div>
              <div className="mt-2 flex justify-end">
                <button className="px-3 py-1.5 bg-blue-600 rounded-lg text-xs text-white hover:bg-blue-700">
                  Apply Patch
                </button>
              </div>
            </div>
          )}
          
          {finding.recommendation && (
            <div className="bg-slate-900 p-4 rounded-lg text-sm">
              <div className="text-white font-medium mb-1">Mitigation Steps:</div>
              <div className="text-slate-300">
                <ol className="list-decimal pl-4 space-y-1">
                  {finding.recommendation.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          
          {finding.resources && (
            <div className="bg-slate-900 p-4 rounded-lg text-sm">
              <div className="text-white font-medium mb-2">Affected Resources:</div>
              <div className="space-y-2 text-slate-300">
                {finding.resources.map((resource, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800/50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <ResourceIcon type={resource.type} />
                      <span>{resource.name}</span>
                      {resource.logicalId && (
                        <span className="text-xs text-slate-500">(Logical ID: {resource.logicalId})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.stackName && (
                        <span className="text-xs text-slate-500">{resource.stackName}</span>
                      )}
                      <button className="text-blue-400 hover:text-blue-300 text-xs">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {finding.driftInfo && (
            <div className="bg-slate-900 p-4 rounded-lg text-sm">
              <div className="text-white font-medium mb-1">Resource Drift:</div>
              <div className="bg-slate-800 p-3 rounded text-xs font-mono text-slate-300 overflow-x-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400">Drift detected on {finding.driftInfo.detectedAt}</span>
                </div>
                <div className="space-y-2">
                  {finding.driftInfo.changes.map((change, idx) => (
                    <div key={idx} className="border-l-2 border-purple-400 pl-2">
                      <div className="text-slate-400">Property: <span className="text-white">{change.property}</span></div>
                      <div className="text-slate-400">Expected: <span className="text-green-400">{change.expected}</span></div>
                      <div className="text-slate-400">Actual: <span className="text-red-400">{change.actual}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button className="px-3 py-1.5 bg-purple-600 rounded-lg text-xs text-white hover:bg-purple-700">
                  Update Stack
                </button>
                <button className="px-3 py-1.5 bg-slate-600 rounded-lg text-xs text-white hover:bg-slate-700">
                  Ignore Drift
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 md:hidden">
            {getActionButton(finding)}
          </div>
        </div>
      )}
    </div>
  );
};

// Resource icon component
const ResourceIcon = ({ type }) => {
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'ec2':
      case 'vm':
      case 'server':
        return <Server size={16} className="text-purple-400" />;
      case 'db':
      case 'database':
      case 'rds':
        return <Database size={16} className="text-blue-400" />;
      case 's3':
      case 'storage':
        return <HardDrive size={16} className="text-green-400" />;
      case 'iam':
      case 'user':
      case 'role':
        return <User size={16} className="text-orange-400" />;
      case 'function':
      case 'lambda':
        return <Zap size={16} className="text-yellow-400" />;
      case 'container':
      case 'docker':
      case 'ecs':
        return <Layers size={16} className="text-cyan-400" />;
      case 'network':
      case 'vpc':
      case 'subnet':
        return <Network size={16} className="text-red-400" />;
      case 'api':
      case 'gateway':
      case 'apigateway':
        return <Share2 size={16} className="text-pink-400" />;
      case 'app':
      case 'application':
        return <Terminal size={16} className="text-indigo-400" />;
      case 'secret':
      case 'secretsmanager':
      case 'credential':
        return <Key size={16} className="text-violet-400" />;
      case 'cloudformation':
      case 'stack':
        return <Layers size={16} className="text-blue-400" />;
      case 'cloudfront':
        return <Globe size={16} className="text-orange-400" />;
      case 'dynamodb':
        return <Database size={16} className="text-yellow-400" />;
      case 'sns':
      case 'sqs':
        return <Share2 size={16} className="text-purple-400" />;
      default:
        return <Server size={16} className="text-slate-400" />;
    }
  };
  
  return getIcon();
};

// Custom Card component
const Card = ({ title, children, action, className = "" }) => (
  <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {action}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Security Stats Item component
const SecurityStatsItem = ({ label, value, change, icon: Icon, color }) => (
  <div className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg">
    <div className={`flex-none p-2 rounded-lg ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-xl font-semibold text-white flex items-center gap-2">
        {value}
        {change !== undefined && (
          <span className={`text-xs ${
            change > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  </div>
);

// CloudFormation stack item component
const StackItem = ({ stack, expanded, onToggle, onViewResources, onViewTemplate }) => {
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
            <StackStatusBadge status={stack.status} />
            <div className="text-sm font-medium text-white truncate">{stack.name}</div>
            {stack.driftStatus === 'DRIFTED' && (
              <div className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs border border-purple-400/20">
                Drift Detected
              </div>
            )}
            {stack.securityIssues > 0 && (
              <div className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs border border-red-400/20">
                {stack.securityIssues} Security Issues
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Updated: {stack.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1">
              <Layers size={12} />
              <span>{stack.resourceCount} Resources</span>
            </div>
            <div className="flex items-center gap-1">
              <Code size={12} />
              <span>v{stack.version}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe size={12} />
              <span>{stack.region}</span>
            </div>
          </div>
        </div>
        <div className="flex-none hidden md:flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewResources(stack.id);
            }}
            className="px-3 py-1.5 bg-slate-700 rounded-lg text-xs text-white hover:bg-slate-600"
          >
            Resources
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewTemplate(stack.id);
            }}
            className="px-3 py-1.5 bg-blue-600 rounded-lg text-xs text-white hover:bg-blue-700"
          >
            Template
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-10 pb-4 space-y-4">
          <div className="bg-slate-900 p-4 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-500 mb-1">Stack ID</div>
                <div className="font-mono text-slate-300 truncate">{stack.id}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Created</div>
                <div className="text-slate-300">{stack.createdTime}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Parameters</div>
                <div className="text-slate-300">{stack.parameters.length} defined</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Outputs</div>
                <div className="text-slate-300">{stack.outputs.length} defined</div>
              </div>
            </div>
            
            {stack.parameters.length > 0 && (
              <div className="mt-4">
                <div className="text-white font-medium mb-2">Parameters</div>
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-2 text-slate-400">Name</th>
                        <th className="text-left p-2 text-slate-400">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stack.parameters.slice(0, 3).map((param, idx) => (
                        <tr key={idx} className="border-b border-slate-700 last:border-0">
                          <td className="p-2 font-mono text-slate-300">{param.name}</td>
                          <td className="p-2 text-slate-300 truncate max-w-xs">{param.value}</td>
                        </tr>
                      ))}
                      {stack.parameters.length > 3 && (
                        <tr>
                          <td colSpan="2" className="p-2 text-center text-blue-400 hover:text-blue-300 cursor-pointer">
                            Show all {stack.parameters.length} parameters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {stack.securityIssues > 0 && (
              <div className="mt-4">
                <div className="text-white font-medium mb-2">Security Issues</div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} />
                    <span className="font-medium">Found {stack.securityIssues} security issues in this stack</span>
                  </div>
                  <p className="text-xs text-slate-300 ml-6">
                    Issues include insecure configurations, overly permissive IAM roles, and unencrypted data storage.
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs">
                      View All Issues
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {stack.driftStatus === 'DRIFTED' && (
              <div className="mt-4">
                <div className="text-white font-medium mb-2">Resource Drift</div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-purple-400">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} />
                    <span className="font-medium">{stack.driftedResources} resources have drifted from the template</span>
                  </div>
                  <p className="text-xs text-slate-300 ml-6">
                    Resources were modified outside of CloudFormation and no longer match the template definition.
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs">
                      View Drift Details
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 md:hidden">
            <button className="px-3 py-1.5 bg-slate-700 rounded-lg text-xs text-white hover:bg-slate-600">
              Resources
            </button>
            <button className="px-3 py-1.5 bg-blue-600 rounded-lg text-xs text-white hover:bg-blue-700">
              Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Compliance check item component
const ComplianceCheckItem = ({ check, onToggleDetails }) => {
  const statusColor = {
    PASSED: 'text-green-400',
    FAILED: 'text-red-400',
    WARNING: 'text-yellow-400',
    NOT_APPLICABLE: 'text-slate-400'
  };
  
  const statusBgColor = {
    PASSED: 'bg-green-500/10',
    FAILED: 'bg-red-500/10',
    WARNING: 'bg-yellow-500/10',
    NOT_APPLICABLE: 'bg-slate-500/10'
  };
  
  const statusIcon = {
    PASSED: <CheckCircle size={14} />,
    FAILED: <X size={14} />,
    WARNING: <AlertTriangle size={14} />,
    NOT_APPLICABLE: <Slash size={14} />
  };
  
  return (
    <div className="border-b border-slate-800 last:border-b-0 py-3 px-4 hover:bg-slate-800/20">
      <div className="flex items-center gap-3">
        <div className={`p-1 rounded-full ${statusBgColor[check.status]}`}>
          <div className={statusColor[check.status]}>
            {statusIcon[check.status]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{check.title}</div>
          <div className="text-xs text-slate-400">{check.description}</div>
        </div>
        <div className="flex-none">
          <button 
            onClick={() => onToggleDetails(check.id)}
            className="text-blue-400 hover:text-blue-300 text-xs"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// CloudFormation resource drift component
const ResourceDrift = ({ resource }) => {
  return (
    <div className="bg-slate-800/40 p-3 rounded-lg mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ResourceIcon type={resource.type} />
          <div className="text-sm font-medium text-white">{resource.id}</div>
        </div>
        <div className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs">
          Drift Detected
        </div>
      </div>
      <div className="text-xs text-slate-400 mb-2">
        {resource.physicalId}
      </div>
      <div className="space-y-2">
        {resource.propertyDifferences.map((diff, idx) => (
          <div key={idx} className="bg-slate-900 p-2 rounded">
            <div className="text-xs font-medium text-white mb-1">
              {diff.propertyPath}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-slate-500 mb-1">Expected</div>
                <div className="bg-green-500/10 text-green-400 p-1 rounded font-mono text-xs overflow-x-auto">
                  {diff.expectedValue}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Actual</div>
                <div className="bg-red-500/10 text-red-400 p-1 rounded font-mono text-xs overflow-x-auto">
                  {diff.actualValue}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Guidance Panel component
const GuidancePanel = ({ finding }) => {
  return (
    <div className="border-l border-slate-700 pl-4 space-y-3">
      <div className="text-lg font-medium text-white mb-2">Security Guidance</div>
      
      {finding.bestPractices && (
        <div>
          <div className="text-sm font-medium text-blue-400 mb-1">Best Practices</div>
          <ul className="list-disc pl-4 text-sm text-slate-300 space-y-1">
            {finding.bestPractices.map((practice, idx) => (
              <li key={idx}>{practice}</li>
            ))}
          </ul>
        </div>
      )}
      
      {finding.awsSecurityHub && (
        <div>
          <div className="text-sm font-medium text-blue-400 mb-1">AWS Security Hub</div>
          <div className="text-sm text-slate-300">
            <p>This finding aligns with the following controls:</p>
            <ul className="list-disc pl-4 space-y-1 mt-1">
              {finding.awsSecurityHub.map((hub, idx) => (
                <li key={idx}>{hub}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {finding.complianceStandards && (
        <div>
          <div className="text-sm font-medium text-blue-400 mb-1">Compliance Standards</div>
          <div className="flex flex-wrap gap-2">
            {finding.complianceStandards.map((std, idx) => (
              <div key={idx} className="px-2 py-1 bg-slate-800 rounded-lg text-xs text-slate-300">
                {std}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {finding.remediation && (
        <div>
          <div className="text-sm font-medium text-blue-400 mb-1">Automated Remediation</div>
          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
            <p className="text-sm text-slate-300 mb-2">
              {finding.remediation.description}
            </p>
            {finding.remediation.automationDocument && (
              <div className="text-xs text-slate-400">
                SSM Document: {finding.remediation.automationDocument}
              </div>
            )}
            <div className="mt-2 flex justify-end">
              <button className="px-3 py-1.5 bg-blue-600 rounded-md text-white text-xs hover:bg-blue-700">
                Run Automation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Security Dashboard
const EnhancedSecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [expandedFinding, setExpandedFinding] = useState(null);
  const [expandedStack, setExpandedStack] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverities, setSelectedSeverities] = useState(['critical', 'high', 'medium', 'low']);
  const [focusArea, setFocusArea] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedResourceType, setSelectedResourceType] = useState('all');
  const [showDriftedOnly, setShowDriftedOnly] = useState(false);
  const [showNonCompliantOnly, setShowNonCompliantOnly] = useState(false);
  
  // Toggle finding expansion
  const toggleFindingExpansion = (findingId) => {
    if (expandedFinding === findingId) {
      setExpandedFinding(null);
    } else {
      setExpandedFinding(findingId);
    }
  };
  
  // Toggle stack expansion
  const toggleStackExpansion = (stackId) => {
    if (expandedStack === stackId) {
      setExpandedStack(null);
    } else {
      setExpandedStack(stackId);
    }
  };
  
  // Handle stack view resources
  const handleViewStackResources = (stackId) => {
    console.log(`View resources for stack ${stackId}`);
    // In a real app, you would navigate to resources view or open a modal
  };
  
  // Handle stack view template
  const handleViewStackTemplate = (stackId) => {
    console.log(`View template for stack ${stackId}`);
    // In a real app, you would open the template in a code viewer
  };
  
  // Handle finding action clicks
  const handleFindingAction = (findingId, action) => {
    console.log(`Action ${action} for finding ${findingId}`);
    // In a real app, you would make API calls to handle these actions
  };
  
  // Toggle severity filter
  const toggleSeverityFilter = (severity) => {
    if (selectedSeverities.includes(severity)) {
      setSelectedSeverities(selectedSeverities.filter(s => s !== severity));
    } else {
      setSelectedSeverities([...selectedSeverities, severity]);
    }
  };
  
  // Sample security findings data with CloudFormation-specific fields
  const securityFindings = [
    {
      id: 'vuln-001',
      title: 'Publicly accessible database with weak authentication',
      severity: 'critical',
      status: 'open',
      discovered: '2025-04-08',
      resourceType: 'RDS',
      resourceName: 'customer-db-prod',
      region: 'us-east-1',
      stackName: 'customer-data-stack',
      category: 'Access Control',
      cvssScore: 9.8,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      cve: null,
      detectionMethod: 'Cloud Security Scanner',
      cfResourceId: 'CustomerDatabase',
      cfFix: `Resources:
  CustomerDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      # Add security group that restricts access
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup
      # Enable encryption
      StorageEncrypted: true
      # Remove public accessibility
      PubliclyAccessible: false`,
      driftDetected: false,
      description: 'A production database is publicly accessible from the internet and uses default credentials. This poses a critical risk of unauthorized access, data breach, and potential data manipulation.',
      impact: 'Unauthorized access could lead to customer data theft, database manipulation, or complete database deletion. This may result in data loss, service downtime, compliance violations, and reputational damage.',
      recommendation: [
        'Immediately remove public access to the database',
        'Implement network security groups to restrict access',
        'Change the default credentials and enforce strong password policies',
        'Enable encryption for data at rest and in transit',
        'Set up database auditing and monitoring',
        'Update CloudFormation template to enforce these settings'
      ],
      resources: [
        { name: 'customer-db-prod', type: 'database', logicalId: 'CustomerDatabase', stackName: 'customer-data-stack' },
        { name: 'db-security-group-prod', type: 'network', logicalId: 'DatabaseSecurityGroup', stackName: 'customer-data-stack' }
      ],
      bestPractices: [
        'Never expose databases directly to the internet',
        'Always use VPC security groups to restrict access to specific CIDR ranges or security groups',
        'Enable encryption for all database instances',
        'Use strong, unique passwords and rotate them regularly'
      ],
      awsSecurityHub: [
        '[RDS.2] RDS DB instances should prohibit public access',
        '[RDS.3] RDS DB instances should have encryption at rest enabled'
      ],
      complianceStandards: ['PCI DSS 3.2.1', 'HIPAA', 'SOC 2', 'NIST 800-53'],
      remediation: {
        description: 'You can automatically remediate this issue using AWS Systems Manager Automation',
        automationDocument: 'AWSConfigRemediation-RemovePublicAccessToRDSInstance'
      }
    },
    {
      id: 'vuln-002',
      title: 'Unencrypted S3 bucket containing sensitive data',
      severity: 'high',
      status: 'open',
      discovered: '2025-04-07',
      resourceType: 'S3',
      resourceName: 'finance-reports-bucket',
      region: 'us-east-1',
      stackName: 'finance-data-stack',
      category: 'Data Protection',
      cvssScore: 7.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
      cve: null,
      detectionMethod: 'Cloud Security Scanner',
      cfResourceId: 'FinanceReportsBucket',
      cfFix: `Resources:
  FinanceReportsBucket:
    Type: AWS::S3::Bucket
    Properties:
      # Add server-side encryption
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      # Add bucket policy to enforce encryption
      # Add lifecycle policy to control data retention`,
      driftDetected: true,
      driftInfo: {
        detectedAt: '2025-04-09',
        changes: [
          {
            property: 'BucketPolicy',
            expected: 'Policy requiring HTTPS',
            actual: 'No policy found'
          },
          {
            property: 'PublicAccessBlockConfiguration',
            expected: 'Block all public access',
            actual: 'Public access allowed'
          }
        ]
      },
      description: 'An S3 bucket containing sensitive financial reports is not configured with server-side encryption. Additionally, the bucket has public access configuration that differs from the CloudFormation template.',
      impact: 'Sensitive financial data is at risk of unauthorized access. If credentials are compromised, data would be exposed in plaintext.',
      recommendation: [
        'Enable default encryption for the S3 bucket',
        'Implement bucket policies to enforce encryption of uploaded objects',
        'Update CloudFormation template to include encryption settings',
        'Implement S3 Block Public Access settings',
        'Set up CloudTrail logging for bucket access'
      ],
      resources: [
        { name: 'finance-reports-bucket', type: 's3', logicalId: 'FinanceReportsBucket', stackName: 'finance-data-stack' }
      ],
      bestPractices: [
        'Enable default encryption for all S3 buckets',
        'Use bucket policies to require encrypted transfers (aws:SecureTransport)',
        'Implement least privilege access to S3 buckets',
        'Enable S3 Block Public Access at account level'
      ],
      awsSecurityHub: [
        '[S3.4] S3 buckets should have server-side encryption enabled',
        '[S3.1] S3 Block Public Access setting should be enabled'
      ],
      complianceStandards: ['PCI DSS 3.2.1', 'GDPR', 'SOC 2', 'NIST 800-53'],
      remediation: {
        description: 'You can automatically remediate this issue using AWS Systems Manager Automation',
        automationDocument: 'AWSConfigRemediation-EnableS3BucketEncryption'
      }
    },
    {
      id: 'vuln-003',
      title: 'IAM role with excessive permissions',
      severity: 'high',
      status: 'in-progress',
      discovered: '2025-04-06',
      resourceType: 'IAM',
      resourceName: 'lambda-execution-role',
      region: 'global',
      stackName: 'api-backend-stack',
      category: 'Identity & Access Management',
      cvssScore: 7.2,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H',
      cve: null,
      detectionMethod: 'IAM Analyzer',
      cfResourceId: 'LambdaExecutionRole',
      cfFix: `Resources:
  LambdaExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        # No changes needed here
      ManagedPolicyArns:
        # Remove overly permissive policy
        # - arn:aws:iam::aws:policy/AdministratorAccess
        # Add least privilege policies
        - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
      Policies:
        - PolicyName: S3AccessPolicy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: 
                  - s3:GetObject
                Resource: 
                  # Use specific bucket ARNs for required resources
                  - arn:aws:s3:::app-data-bucket/*
                  - arn:aws:s3:::reports-bucket/*
                  # Or use Fn::ImportValue to reference outputs from other stacks`,
      driftDetected: false,
      description: 'The Lambda execution role is configured with overly permissive permissions, including administrator access. This violates the principle of least privilege and poses a significant security risk.',
      impact: 'If the Lambda function is compromised, an attacker could use the role to access or modify any resource in the account, potentially leading to data breaches, resource manipulation, or further privilege escalation.',
      recommendation: [
        'Remove administrator access from the IAM role',
        'Implement least privilege by granting only the specific permissions needed by the Lambda function',
        'Use resource-level permissions where possible',
        'Update CloudFormation template to include more restrictive IAM policies',
        'Implement regular IAM permission reviews'
      ],
      resources: [
        { name: 'lambda-execution-role', type: 'iam', logicalId: 'LambdaExecutionRole', stackName: 'api-backend-stack' }
      ],
      bestPractices: [
        'Follow the principle of least privilege for all IAM roles',
        'Avoid using managed policies with broad permissions like AdministratorAccess',
        'Use IAM Access Analyzer to identify unused permissions',
        'Regularly review and update IAM permissions'
      ],
      awsSecurityHub: [
        '[IAM.1] IAM policies should not allow full "*" administrative privileges',
        '[IAM.21] IAM customer managed policies that you create should not allow wildcard actions for services'
      ],
      complianceStandards: ['CIS AWS Foundations', 'NIST 800-53', 'SOC 2'],
      remediation: {
        description: 'You can use AWS CloudFormation Guard to automatically validate IAM policies in your templates',
        automationDocument: null
      }
    },
    {
      id: 'vuln-004',
      title: 'API Gateway without WAF protection',
      severity: 'medium',
      status: 'open',
      discovered: '2025-04-05',
      resourceType: 'APIGateway',
      resourceName: 'customer-api',
      region: 'us-west-2',
      stackName: 'customer-api-stack',
      category: 'Application Security',
      cvssScore: 6.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:L',
      cve: null,
      detectionMethod: 'Security Configuration Analyzer',
      cfResourceId: 'CustomerAPI',
      cfFix: `Resources:
  ApiGatewayWebAcl:
    Type: AWS::WAFv2::WebACL
    Properties:
      Name: customer-api-protection
      Scope: REGIONAL
      DefaultAction:
        Allow: {}
      Rules:
        - Name: AWS-AWSManagedRulesCommonRuleSet
          Priority: 0
          OverrideAction:
            None: {}
          Statement:
            ManagedRuleGroupStatement:
              VendorName: AWS
              Name: AWSManagedRulesCommonRuleSet
          VisibilityConfig:
            SampledRequestsEnabled: true
            CloudWatchMetricsEnabled: true
            MetricName: AWS-AWSManagedRulesCommonRuleSet
      VisibilityConfig:
        CloudWatchMetricsEnabled: true
        MetricName: customer-api-protection
        SampledRequestsEnabled: true
        
  WebACLAssociation:
    Type: AWS::WAFv2::WebACLAssociation
    Properties:
      ResourceArn: !Ref CustomerAPI.RestApiArn
      WebACLArn: !GetAtt ApiGatewayWebAcl.Arn`,
      driftDetected: false,
      description: 'The API Gateway does not have AWS WAF (Web Application Firewall) protection enabled, leaving it vulnerable to common web attacks such as SQL injection, cross-site scripting (XSS), and other OWASP Top 10 vulnerabilities.',
      impact: 'Without WAF protection, the API is more vulnerable to common web application attacks, which could lead to unauthorized access, data exposure, or service disruption.',
      recommendation: [
        'Implement AWS WAF for the API Gateway',
        'Configure AWS WAF rules to protect against OWASP Top 10 vulnerabilities',
        'Update CloudFormation template to include WAF configuration and association',
        'Enable logging for WAF events',
        'Implement regular security testing for the API'
      ],
      resources: [
        { name: 'customer-api', type: 'api', logicalId: 'CustomerAPI', stackName: 'customer-api-stack' }
      ],
      bestPractices: [
        'Protect all public-facing APIs with AWS WAF',
        'Use AWS WAF managed rule groups like Core rule set (CRS) and Known bad inputs',
        'Implement rate-based rules to prevent brute force and DoS attacks',
        'Enable logging and monitoring for WAF events'
      ],
      awsSecurityHub: [
        '[APIGateway.4] API Gateway should be associated with a WAF Web ACL',
        '[APIGateway.2] API Gateway REST API stages should be configured to use SSL certificates for backend authentication'
      ],
      complianceStandards: ['OWASP API Security Top 10', 'NIST 800-53', 'PCI DSS 3.2.1'],
      remediation: {
        description: 'You can automatically create and associate a WAF Web ACL with your API Gateway',
        automationDocument: 'AWSConfigRemediation-AssociateWAFWebACLToAPIGateway'
      }
    },
    {
      id: 'vuln-005',
      title: 'CloudFront distribution without HTTPS enforcement',
      severity: 'medium',
      status: 'mitigated',
      discovered: '2025-04-03',
      resourceType: 'CloudFront',
      resourceName: 'website-distribution',
      region: 'global',
      stackName: 'website-hosting-stack',
      category: 'Network Security',
      cvssScore: 5.9,
      cvssVector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:L/A:N',
      cve: null,
      detectionMethod: 'Security Configuration Analyzer',
      cfResourceId: 'WebsiteDistribution',
      cfFix: `Resources:
  WebsiteDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        # Other properties remain the same
        ViewerCertificate:
          AcmCertificateArn: !Ref Certificate
          MinimumProtocolVersion: TLSv1.2_2021
          SslSupportMethod: sni-only
        DefaultCacheBehavior:
          # Other properties remain the same
          ViewerProtocolPolicy: redirect-to-https`,
      driftDetected: false,
      description: 'The CloudFront distribution was configured to allow HTTP traffic without redirection to HTTPS, potentially exposing user data during transmission.',
      impact: 'Without HTTPS enforcement, data transmitted between users and the website could be intercepted or modified by attackers through man-in-the-middle attacks.',
      recommendation: [
        'Configure CloudFront to redirect all HTTP traffic to HTTPS',
        'Set a minimum TLS protocol version of TLSv1.2_2021',
        'Update CloudFormation template to enforce these settings',
        'Implement HTTP Strict Transport Security (HSTS)'
      ],
      resources: [
        { name: 'website-distribution', type: 'cloudfront', logicalId: 'WebsiteDistribution', stackName: 'website-hosting-stack' }
      ],
      bestPractices: [
        'Always enforce HTTPS for all web traffic',
        'Use modern TLS protocol versions (minimum TLSv1.2)',
        'Implement HSTS to prevent SSL stripping attacks',
        'Regularly rotate and update SSL/TLS certificates'
      ],
      awsSecurityHub: [
        '[CloudFront.3] CloudFront distributions should require encryption in transit',
        '[CloudFront.4] CloudFront distributions should have origin failover configured'
      ],
      complianceStandards: ['NIST 800-53', 'PCI DSS 3.2.1', 'HIPAA'],
      remediation: {
        description: 'This issue has been successfully remediated by updating the CloudFormation template',
        automationDocument: null
      }
    }
  ];
  
  // Sample CloudFormation stacks
  const cfStacks = [
    {
      id: 'arn:aws:cloudformation:us-east-1:123456789012:stack/customer-data-stack/1234abcd',
      name: 'customer-data-stack',
      status: 'UPDATE_COMPLETE',
      lastUpdated: '2025-04-07',
      createdTime: '2024-10-15',
      region: 'us-east-1',
      resourceCount: 12,
      version: '2.3',
      driftStatus: 'DRIFTED',
      driftedResources: 1,
      securityIssues: 2,
      parameters: [
        { name: 'EnvironmentName', value: 'production' },
        { name: 'DatabaseInstanceType', value: 'db.r5.large' },
        { name: 'MultiAZ', value: 'true' },
        { name: 'BackupRetentionPeriod', value: '14' }
      ],
      outputs: [
        { name: 'DatabaseEndpoint', value: 'customer-db-prod.abcdef.us-east-1.rds.amazonaws.com' },
        { name: 'DatabaseSecurityGroupId', value: 'sg-1234abcd' }
      ]
    },
    {
      id: 'arn:aws:cloudformation:us-east-1:123456789012:stack/finance-data-stack/5678efgh',
      name: 'finance-data-stack',
      status: 'CREATE_COMPLETE',
      lastUpdated: '2025-03-20',
      createdTime: '2025-03-20',
      region: 'us-east-1',
      resourceCount: 7,
      version: '1.0',
      driftStatus: 'DRIFTED',
      driftedResources: 2,
      securityIssues: 1,
      parameters: [
        { name: 'BucketNamePrefix', value: 'finance-reports' },
        { name: 'EnableLogging', value: 'true' }
      ],
      outputs: [
        { name: 'BucketName', value: 'finance-reports-bucket' },
        { name: 'BucketArn', value: 'arn:aws:s3:::finance-reports-bucket' }
      ]
    },
    {
      id: 'arn:aws:cloudformation:us-west-2:123456789012:stack/api-backend-stack/9012ijkl',
      name: 'api-backend-stack',
      status: 'UPDATE_IN_PROGRESS',
      lastUpdated: '2025-04-10',
      createdTime: '2024-11-05',
      region: 'us-west-2',
      resourceCount: 18,
      version: '3.2',
      driftStatus: 'IN_SYNC',
      driftedResources: 0,
      securityIssues: 1,
      parameters: [
        { name: 'ApiStageName', value: 'prod' },
        { name: 'LambdaMemorySize', value: '512' },
        { name: 'LambdaTimeout', value: '30' },
        { name: 'EnableXRayTracing', value: 'true' }
      ],
      outputs: [
        { name: 'ApiEndpoint', value: 'https://abcdef1234.execute-api.us-west-2.amazonaws.com/prod' },
        { name: 'LambdaFunctionArn', value: 'arn:aws:lambda:us-west-2:123456789012:function:api-handler' }
      ]
    },
    {
      id: 'arn:aws:cloudformation:us-west-2:123456789012:stack/customer-api-stack/3456mnop',
      name: 'customer-api-stack',
      status: 'CREATE_COMPLETE',
      lastUpdated: '2025-03-15',
      createdTime: '2025-03-15',
      region: 'us-west-2',
      resourceCount: 9,
      version: '1.0',
      driftStatus: 'IN_SYNC',
      driftedResources: 0,
      securityIssues: 1,
      parameters: [
        { name: 'ApiName', value: 'customer-api' },
        { name: 'StageName', value: 'v1' }
      ],
      outputs: [
        { name: 'ApiEndpoint', value: 'https://xyz123abc.execute-api.us-west-2.amazonaws.com/v1' }
      ]
    },
    {
      id: 'arn:aws:cloudformation:global:123456789012:stack/website-hosting-stack/7890qrst',
      name: 'website-hosting-stack',
      status: 'UPDATE_COMPLETE',
      lastUpdated: '2025-04-05',
      createdTime: '2024-09-10',
      region: 'global',
      resourceCount: 6,
      version: '2.1',
      driftStatus: 'IN_SYNC',
      driftedResources: 0,
      securityIssues: 0,
      parameters: [
        { name: 'DomainName', value: 'example.com' },
        { name: 'CreateRoute53Record', value: 'true' }
      ],
      outputs: [
        { name: 'DistributionId', value: 'E1ABCDEFGHIJKL' },
        { name: 'DistributionDomainName', value: 'abcdef12345.cloudfront.net' }
      ]
    }
  ];
  
  // Filter findings based on search query, selected severities, region, etc.
  const filteredFindings = securityFindings.filter(finding => 
    (searchQuery === '' || 
      finding.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      finding.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.resourceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.stackName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (finding.cve && finding.cve.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (finding.cfResourceId && finding.cfResourceId.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    selectedSeverities.includes(finding.severity.toLowerCase()) &&
    (selectedRegion === 'all' || finding.region === selectedRegion) &&
    (selectedResourceType === 'all' || finding.resourceType === selectedResourceType) &&
    (focusArea === null || finding.category === focusArea) &&
    (!showDriftedOnly || finding.driftDetected)
  );
  
  // Filter stacks based on search query, region, etc.
  const filteredStacks = cfStacks.filter(stack =>
    (searchQuery === '' ||
      stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stack.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) &&
    (selectedRegion === 'all' || stack.region === selectedRegion) &&
    (!showDriftedOnly || stack.driftStatus === 'DRIFTED') &&
    (!showNonCompliantOnly || stack.securityIssues > 0)
  );
  
  // Severity counts
  const severityCounts = {
    critical: securityFindings.filter(finding => finding.severity.toLowerCase() === 'critical').length,
    high: securityFindings.filter(finding => finding.severity.toLowerCase() === 'high').length,
    medium: securityFindings.filter(finding => finding.severity.toLowerCase() === 'medium').length,
    low: securityFindings.filter(finding => finding.severity.toLowerCase() === 'low').length
  };
  
  // Status counts
  const statusCounts = {
    open: securityFindings.filter(finding => finding.status === 'open').length,
    inProgress: securityFindings.filter(finding => finding.status === 'in-progress').length,
    mitigated: securityFindings.filter(finding => finding.status === 'mitigated').length
  };

  // Drift counts
  const driftCounts = {
    total: cfStacks.filter(stack => stack.driftStatus === 'DRIFTED').length,
    resources: cfStacks.reduce((acc, stack) => acc + stack.driftedResources, 0)
  };
  
  // Security risk score calculation (0-100, higher is worse)
  const calculateSecurityRisk = () => {
    const criticalWeight = 10;
    const highWeight = 5;
    const mediumWeight = 2;
    const lowWeight = 0.5;
    
    const weightedScore = 
      (severityCounts.critical * criticalWeight) + 
      (severityCounts.high * highWeight) + 
      (severityCounts.medium * mediumWeight) + 
      (severityCounts.low * lowWeight);
    
    // Normalize to 0-100
    const maxPossibleScore = 100; // theoretical max
    const normalizedScore = Math.min(100, (weightedScore / maxPossibleScore) * 100);
    
    return Math.round(normalizedScore);
  };
  
  const riskScore = calculateSecurityRisk();
  
  // Get risk tier based on score
  const getRiskTier = (score) => {
    if (score >= 75) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  };
  
  // Category counts for the findings
  const categories = securityFindings.reduce((acc, finding) => {
    acc[finding.category] = (acc[finding.category] || 0) + 1;
    return acc;
  }, {});
  
  // Transform categories for visualization
  const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
  
  // Resource type counts
  const resourceTypes = securityFindings.reduce((acc, finding) => {
    acc[finding.resourceType] = (acc[finding.resourceType] || 0) + 1;
    return acc;
  }, {});
  
  // Transform resource types for visualization
  const resourceTypeData = Object.entries(resourceTypes).map(([name, value]) => ({ name, value }));
  
  // Region distribution data
  const regions = securityFindings.reduce((acc, finding) => {
    acc[finding.region] = (acc[finding.region] || 0) + 1;
    return acc;
  }, {});
  
  // Transform regions for visualization
  const regionData = Object.entries(regions).map(([name, value]) => ({ name, value }));
  
  // Stack distribution data
  const stacks = securityFindings.reduce((acc, finding) => {
    acc[finding.stackName] = (acc[finding.stackName] || 0) + 1;
    return acc;
  }, {});
  
  // Transform stacks for visualization
  const stackData = Object.entries(stacks).map(([name, value]) => ({ name, value }));
  
  // Weekly trend data (sample data - in a real app this would be historical)
  const weeklyTrendData = [
    { name: '4 Weeks Ago', critical: 5, high: 8, medium: 12, low: 6 },
    { name: '3 Weeks Ago', critical: 4, high: 7, medium: 10, low: 5 },
    { name: '2 Weeks Ago', critical: 4, high: 6, medium: 9, low: 4 },
    { name: '1 Week Ago', critical: 3, high: 5, medium: 7, low: 3 },
    { name: 'Current', critical: severityCounts.critical, high: severityCounts.high, medium: severityCounts.medium, low: severityCounts.low }
  ];
  
  // Compliance data for radar chart
  const complianceData = [
    { subject: 'Access Control', score: 65, benchmark: 90 },
    { subject: 'Data Protection', score: 78, benchmark: 90 },
    { subject: 'Network Security', score: 82, benchmark: 90 },
    { subject: 'Vulnerability Mgmt', score: 45, benchmark: 90 },
    { subject: 'Cloud Security', score: 72, benchmark: 90 },
    { subject: 'IAM', score: 68, benchmark: 90 }
  ];
  
  // For time-to-fix metrics
  const timeToFixData = [
    { name: 'Critical', value: 3.2 }, // days
    { name: 'High', value: 12.5 },
    { name: 'Medium', value: 23.7 },
    { name: 'Low', value: 45.2 }
  ];
  
  // CloudFormation templates stats
  const templateData = [
    { name: 'Non-Compliant Resources', value: 15 },
    { name: 'Drift Detected', value: 8 },
    { name: 'Using Default Parameters', value: 12 },
    { name: 'Outdated AMIs', value: 6 }
  ];
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Risk Score and Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <h3 className="text-lg font-medium text-white">Security Risk Score</h3>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-40 h-40 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="text-4xl font-bold text-white">{riskScore}</div>
                      <div className={`text-sm font-medium ${
                        riskScore >= 75 ? 'text-red-400' :
                        riskScore >= 50 ? 'text-orange-400' :
                        riskScore >= 25 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>{getRiskTier(riskScore)} Risk</div>
                    </div>
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={
                          riskScore >= 75 ? '#ef4444' :
                          riskScore >= 50 ? '#f97316' :
                          riskScore >= 25 ? '#facc15' :
                          '#10b981'
                        }
                        strokeWidth="3"
                        strokeDasharray={`${riskScore}, 100`}
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400 text-center mb-4">
                    Based on {securityFindings.length} security findings across {cfStacks.length} CloudFormation stacks
                  </p>
                  <div className="w-full grid grid-cols-2 gap-2">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm">
                      View Details
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">
                      Export Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                  <ResourceCard 
                    title="Critical Findings" 
                    value={severityCounts.critical} 
                    percentage={20} 
                    trend="down" 
                    icon={AlertCircle} 
                    color="bg-red-500/10 text-red-400" 
                    subtitle="Highest severity"
                    clickable
                    onClick={() => {
                      setSelectedSeverities(['critical']);
                      setActiveTab('findings');
                    }}
                  />
                  <ResourceCard 
                    title="Drifted Stacks" 
                    value={driftCounts.total} 
                    percentage={5} 
                    trend="up" 
                    icon={GitBranch} 
                    color="bg-purple-500/10 text-purple-400" 
                    subtitle={`${driftCounts.resources} resources`}
                    clickable
                    onClick={() => {
                      setShowDriftedOnly(true);
                      setActiveTab('stacks');
                    }}
                  />
                  <ResourceCard 
                    title="Non-Compliant Stacks" 
                    value={cfStacks.filter(s => s.securityIssues > 0).length}
                    percentage={-12} 
                    trend="down" 
                    icon={ShieldOff} 
                    color="bg-blue-500/10 text-blue-400" 
                    subtitle="Security issues"
                    clickable
                    onClick={() => {
                      setShowNonCompliantOnly(true);
                      setActiveTab('stacks');
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <SecurityStatsItem 
                    label="Avg. Time to Fix (Critical)" 
                    value="3.2 days" 
                    change={-15}
                    icon={Clock}
                    color="bg-purple-500/10 text-purple-400"
                  />
                  <SecurityStatsItem 
                    label="Remediation Rate" 
                    value="68%" 
                    change={8}
                    icon={CheckCircle}
                    color="bg-green-500/10 text-green-400"
                  />
                  <SecurityStatsItem 
                    label="New Findings (7d)" 
                    value="5" 
                    change={-30}
                    icon={Target}
                    color="bg-yellow-500/10 text-yellow-400"
                  />
                </div>
              </div>
            </div>
            
            {/* CloudFormation Stacks Summary */}
            <Card title="CloudFormation Stacks Status" action={
              <button 
                onClick={() => setActiveTab('stacks')}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View All
              </button>
            }>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Total Stacks</h4>
                    <span className="text-2xl font-semibold text-white">{cfStacks.length}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Active</span>
                      <span className="text-green-400">{cfStacks.filter(s => !s.status.includes('DELETE')).length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">In Progress</span>
                      <span className="text-blue-400">{cfStacks.filter(s => s.status.includes('IN_PROGRESS')).length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Failed</span>
                      <span className="text-red-400">{cfStacks.filter(s => s.status.includes('FAILED')).length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Resource Drift</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-semibold text-white">{driftCounts.resources}</span>
                      <span className="text-xs text-slate-400">resources</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Drifted Stacks</span>
                      <span className="text-purple-400">{driftCounts.total}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">In Sync</span>
                      <span className="text-green-400">{cfStacks.filter(s => s.driftStatus === 'IN_SYNC').length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Last Checked</span>
                      <span className="text-slate-300">2025-04-10</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-medium">Security Compliance</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-semibold text-white">{cfStacks.reduce((sum, stack) => sum + stack.securityIssues, 0)}</span>
                      <span className="text-xs text-slate-400">issues</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Non-compliant Stacks</span>
                      <span className="text-red-400">{cfStacks.filter(s => s.securityIssues > 0).length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Compliant Stacks</span>
                      <span className="text-green-400">{cfStacks.filter(s => s.securityIssues === 0).length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Last Scan</span>
                      <span className="text-slate-300">2025-04-10</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-slate-800/30 p-4 rounded-lg">
                <div className="text-sm font-medium text-white mb-2">Latest Stack Activity</div>
                <div className="space-y-2">
                  {cfStacks
                    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
                    .slice(0, 3)
                    .map((stack, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-800/40 p-2 rounded text-xs">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-blue-400" />
                          <span className="text-white">{stack.name}</span>
                          <StackStatusBadge status={stack.status} />
                        </div>
                        <div className="text-slate-400">
                          {stack.lastUpdated}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </Card>
            
            {/* Top Security Findings */}
            <Card title="Top Security Findings" action={
              <button 
                onClick={() => setActiveTab('findings')}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View All
              </button>
            }>
              <div className="space-y-4">
                {securityFindings
                  .filter(finding => finding.status !== 'mitigated')
                  .sort((a, b) => {
                    // Sort by severity first, then by discovery date
                    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
                      return severityOrder[a.severity] - severityOrder[b.severity];
                    }
                    return new Date(b.discovered) - new Date(a.discovered);
                  })
                  .slice(0, 3)
                  .map(finding => (
                    <div key={finding.id} className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-2 rounded-full ${
                          finding.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                          finding.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                          finding.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {finding.severity === 'critical' ? <AlertCircle size={16} /> :
                           finding.severity === 'high' ? <AlertTriangle size={16} /> :
                           finding.severity === 'medium' ? <AlertTriangle size={16} /> :
                           <Info size={16} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm font-medium text-white">{finding.title}</div>
                            <RiskLevelBadge level={finding.severity} />
                            {finding.driftDetected && (
                              <div className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                                Drift
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mb-2 line-clamp-2">{finding.description}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <ResourceIcon type={finding.resourceType} />
                              <span>{finding.resourceType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Layers size={12} />
                              <span>{finding.stackName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe size={12} />
                              <span>{finding.region}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>Discovered {finding.discovered}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setExpandedFinding(finding.id);
                            setActiveTab('findings');
                          }}
                          className="px-3 py-1.5 bg-blue-600 rounded-lg text-xs text-white hover:bg-blue-700 whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
            
            {/* Security Posture Trend and CloudFormation Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Weekly Security Trend" action={
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white">
                  <option value="4weeks">Last 4 Weeks</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="12months">Last 12 Months</option>
                </select>
              }>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyTrendData}>
                      <defs>
                        <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#facc15" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="critical" 
                        name="Critical" 
                        stroke="#ef4444" 
                        fill="url(#colorCritical)" 
                        stackId="1"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="high" 
                        name="High" 
                        stroke="#f97316" 
                        fill="url(#colorHigh)" 
                        stackId="1"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="medium" 
                        name="Medium" 
                        stroke="#facc15" 
                        fill="url(#colorMedium)" 
                        stackId="1"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="low" 
                        name="Low" 
                        stroke="#3b82f6" 
                        fill="url(#colorLow)" 
                        stackId="1"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card title="CloudFormation Template Insights" action={
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  View Report
                </button>
              }>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={templateData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" width={180} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6">
                        {templateData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? '#ef4444' : index === 1 ? '#a855f7' : index === 2 ? '#f97316' : '#3b82f6'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            
            {/* Security Finding Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="By Category">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              '#ef4444', '#f97316', '#facc15', '#4ade80', 
                              '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'
                            ][index % 8]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value) => [`${value} issues`, ``]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card title="By CloudFormation Stack">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stackData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name.split('-')[0]} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {stackData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
                              '#ef4444', '#f97316', '#facc15', '#4ade80'
                            ][index % 8]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value, name) => [`${value} issues`, `Stack: ${name}`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card title="By Resource Type">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {resourceTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4',
                              '#4ade80', '#facc15', '#f97316', '#ef4444'
                            ][index % 8]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value) => [`${value} issues`, ``]}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        );
        
      case 'findings':
        return (
          <div className="space-y-6">
            {/* Search and filter bar */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Search findings by title, resource, stack..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="all">All Regions</option>
                    <option value="us-east-1">us-east-1</option>
                    <option value="us-west-2">us-west-2</option>
                    <option value="eu-west-1">eu-west-1</option>
                    <option value="global">Global</option>
                  </select>
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    value={selectedResourceType}
                    onChange={(e) => setSelectedResourceType(e.target.value)}
                  >
                    <option value="all">All Resources</option>
                    <option value="RDS">RDS</option>
                    <option value="S3">S3</option>
                    <option value="IAM">IAM</option>
                    <option value="APIGateway">API Gateway</option>
                    <option value="CloudFront">CloudFront</option>
                  </select>
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    value={focusArea || ''}
                    onChange={(e) => setFocusArea(e.target.value || null)}
                  >
                    <option value="">All Categories</option>
                    {Object.keys(categories).map((category, idx) => (
                      <option key={idx} value={category}>{category}</option>
                    ))}
                  </select>
                  <button 
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
                      showDriftedOnly ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                    onClick={() => setShowDriftedOnly(!showDriftedOnly)}
                  >
                    <GitBranch size={16} />
                    Drifted Only
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="text-sm text-slate-400 flex items-center">Severity:</div>
                {['critical', 'high', 'medium', 'low'].map((severity) => (
                  <button
                    key={severity}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedSeverities.includes(severity) ? 
                        severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                    onClick={() => toggleSeverityFilter(severity)}
                  >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    {selectedSeverities.includes(severity) ? (
                      <span className="ml-1">✓</span>
                    ) : null}
                  </button>
                ))}
                <div className="flex-1"></div>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  <Filter size={14} />
                  More Filters
                </button>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  <Download size={14} />
                  Export
                </button>
              </div>
            </div>
            
            {/* Findings count */}
            <div className="text-sm text-slate-400">
              Showing {filteredFindings.length} findings
              {searchQuery && <span> matching "{searchQuery}"</span>}
              {selectedRegion !== 'all' && <span> in {selectedRegion}</span>}
              {selectedResourceType !== 'all' && <span> for {selectedResourceType} resources</span>}
              {focusArea && <span> in {focusArea} category</span>}
              {showDriftedOnly && <span> with detected drift</span>}
            </div>
            
            {/* Findings list */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              {filteredFindings.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <ShieldOff size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No findings match your current filters</p>
                  <button 
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSeverities(['critical', 'high', 'medium', 'low']);
                      setSelectedRegion('all');
                      setSelectedResourceType('all');
                      setFocusArea(null);
                      setShowDriftedOnly(false);
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredFindings.map((finding) => (
                  <SecurityFinding
                    key={finding.id}
                    finding={finding}
                    expanded={expandedFinding === finding.id}
                    onToggle={() => toggleFindingExpansion(finding.id)}
                    onActionClick={handleFindingAction}
                  />
                ))
              )}
            </div>
          </div>
        );
        
      case 'stacks':
        return (
          <div className="space-y-6">
            {/* Search and filter bar */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Search stacks by name or ID..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                  <select 
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="all">All Regions</option>
                    <option value="us-east-1">us-east-1</option>
                    <option value="us-west-2">us-west-2</option>
                    <option value="eu-west-1">eu-west-1</option>
                    <option value="global">Global</option>
                  </select>
                  <button 
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
                      showDriftedOnly ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                    onClick={() => setShowDriftedOnly(!showDriftedOnly)}
                  >
                    <GitBranch size={16} />
                    Drifted Only
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
                      showNonCompliantOnly ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                    onClick={() => setShowNonCompliantOnly(!showNonCompliantOnly)}
                  >
                    <AlertTriangle size={16} />
                    Non-Compliant Only
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stacks count */}
            <div className="text-sm text-slate-400">
              Showing {filteredStacks.length} stacks
              {searchQuery && <span> matching "{searchQuery}"</span>}
              {selectedRegion !== 'all' && <span> in {selectedRegion}</span>}
              {showDriftedOnly && <span> with detected drift</span>}
              {showNonCompliantOnly && <span> with security issues</span>}
            </div>
            
            {/* Stacks list */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
              {filteredStacks.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <Layers size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No stacks match your current filters</p>
                  <button 
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRegion('all');
                      setShowDriftedOnly(false);
                      setShowNonCompliantOnly(false);
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredStacks.map((stack) => (
                  <StackItem
                    key={stack.id}
                    stack={stack}
                    expanded={expandedStack === stack.id}
                    onToggle={() => toggleStackExpansion(stack.id)}
                    onViewResources={() => handleViewStackResources(stack.id)}
                    onViewTemplate={() => handleViewStackTemplate(stack.id)}
                  />
                ))
              )}
            </div>
          </div>
        );
        
      case 'compliance':
        return (
          <div className="space-y-6">
            {/* Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ResourceCard 
                title="Overall Compliance" 
                value="68%" 
                icon={Shield} 
                color="bg-blue-500/10 text-blue-400" 
                subtitle="Last scan: 2025-04-10"
              />
              <ResourceCard 
                title="Failed Checks" 
                value="12" 
                percentage={-25}
                trend="down"
                icon={X} 
                color="bg-red-500/10 text-red-400" 
                subtitle="Since last scan"
              />
              <ResourceCard 
                title="Passed Checks" 
                value="58" 
                percentage={5}
                trend="up"
                icon={CheckCircle} 
                color="bg-green-500/10 text-green-400" 
                subtitle="Since last scan"
              />
              <ResourceCard 
                title="Warning Checks" 
                value="15" 
                percentage={-10}
                trend="down"
                icon={AlertTriangle} 
                color="bg-yellow-500/10 text-yellow-400" 
                subtitle="Since last scan"
              />
            </div>
            
            {/* Compliance Standards */}
            <Card title="Compliance Standards">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Shield size={18} />
                    </div>
                    <h4 className="text-white font-medium">CIS AWS Foundations</h4>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Compliance</span>
                      <span className="text-white">78%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-center text-xs">
                    <div>
                      <div className="text-green-400 font-medium">32</div>
                      <div className="text-slate-500">Passed</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-medium">7</div>
                      <div className="text-slate-500">Failed</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-medium">4</div>
                      <div className="text-slate-500">Warning</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                      <Shield size={18} />
                    </div>
                    <h4 className="text-white font-medium">PCI DSS 3.2.1</h4>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Compliance</span>
                      <span className="text-white">65%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-center text-xs">
                    <div>
                      <div className="text-green-400 font-medium">18</div>
                      <div className="text-slate-500">Passed</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-medium">8</div>
                      <div className="text-slate-500">Failed</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-medium">2</div>
                      <div className="text-slate-500">Warning</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Shield size={18} />
                    </div>
                    <h4 className="text-white font-medium">NIST 800-53</h4>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Compliance</span>
                      <span className="text-white">72%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-center text-xs">
                    <div>
                      <div className="text-green-400 font-medium">45</div>
                      <div className="text-slate-500">Passed</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-medium">12</div>
                      <div className="text-slate-500">Failed</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-medium">6</div>
                      <div className="text-slate-500">Warning</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Compliance Checks */}
            <Card title="Failed Compliance Checks" action={
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white">
                <option value="all">All Standards</option>
                <option value="cis">CIS AWS Foundations</option>
                <option value="pci">PCI DSS 3.2.1</option>
                <option value="nist">NIST 800-53</option>
              </select>
            }>
              <div className="space-y-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <ComplianceCheckItem
                    key={idx}
                    check={{
                      id: `check-${idx + 1}`,
                      title: [
                        'Ensure IAM Access Analyzer is enabled',
                        'Ensure CloudTrail logs are encrypted at rest using KMS',
                        'Ensure rotation for customer created CMKs is enabled',
                        'Ensure no security groups allow ingress from 0.0.0.0/0 to port 22',
                        'Ensure VPC flow logging is enabled in all VPCs'
                      ][idx],
                      description: [
                        'IAM Access Analyzer helps you identify potential security risks by identifying resources that are shared with external entities.',
                        'CloudTrail log encryption adds an additional layer of security by ensuring logs cannot be read if access to the storage is compromised.',
                        'Regular key rotation helps reduce the risk if a key is compromised.',
                        'Removing unfettered access to remote server administration ports reduces the risk of brute force password attacks.',
                        'VPC Flow Logs provide visibility into network traffic and can help detect anomalous traffic or security groups.'
                      ][idx],
                      status: 'FAILED'
                    }}
                    onToggleDetails={() => {}}
                  />
                ))}
                
                <div className="pt-2 text-center">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    View All 12 Failed Checks
                  </button>
                </div>
              </div>
            </Card>
            
            {/* Compliance Radar */}
            <Card title="Compliance Matrix">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={complianceData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                    <Radar 
                      name="Current Score" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="Benchmark" 
                      dataKey="benchmark" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3} 
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        );
        
      case 'drift':
        return (
          <div className="space-y-6">
            {/* Drift Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ResourceCard 
                title="Drifted Stacks" 
                value={driftCounts.total} 
                icon={GitBranch} 
                color="bg-purple-500/10 text-purple-400" 
                subtitle={`${cfStacks.length} total stacks`}
              />
              <ResourceCard 
                title="Drifted Resources" 
                value={driftCounts.resources} 
                percentage={20}
                trend="up"
                icon={Server} 
                color="bg-red-500/10 text-red-400" 
                subtitle="Since last check"
              />
              <ResourceCard 
                title="In-Sync Stacks" 
                value={cfStacks.filter(s => s.driftStatus === 'IN_SYNC').length} 
                percentage={-10}
                trend="down"
                icon={CheckCircle} 
                color="bg-green-500/10 text-green-400" 
                subtitle="Since last check"
              />
              <ResourceCard 
                title="Last Drift Check" 
                value="2 hours ago" 
                icon={Clock} 
                color="bg-blue-500/10 text-blue-400" 
                subtitle="2025-04-10 09:45 UTC"
              />
            </div>
            
            {/* Drifted Resources */}
            <Card title="Recently Detected Drift" action={
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2">
                <RotateCw size={14} />
                Run Drift Detection
              </button>
            }>
              <div className="space-y-4">
                <ResourceDrift
                  resource={{
                    id: 'CustomerDatabase',
                    type: 'RDS',
                    physicalId: 'customer-db-prod',
                    propertyDifferences: [
                      {
                        propertyPath: 'PubliclyAccessible',
                        expectedValue: 'false',
                        actualValue: 'true'
                      },
                      {
                        propertyPath: 'DBParameterGroup',
                        expectedValue: 'custom-mysql-params',
                        actualValue: 'default.mysql5.7'
                      }
                    ]
                  }}
                />
                
                <ResourceDrift
                  resource={{
                    id: 'FinanceReportsBucket',
                    type: 'S3',
                    physicalId: 'finance-reports-bucket',
                    propertyDifferences: [
                      {
                        propertyPath: 'BucketPolicy',
                        expectedValue: '{"Statement":[{"Effect":"Deny","Principal":"*","Action":"s3:*","Resource":"arn:aws:s3:::finance-reports-bucket/*","Condition":{"Bool":{"aws:SecureTransport":"false"}}}]}',
                        actualValue: 'null'
                      },
                      {
                        propertyPath: 'PublicAccessBlockConfiguration.BlockPublicAcls',
                        expectedValue: 'true',
                        actualValue: 'false'
                      }
                    ]
                  }}
                />
                
                <div className="pt-2 text-center">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    View All Drifted Resources
                  </button>
                </div>
              </div>
            </Card>
            
            {/* Drift History */}
            <Card title="Drift History" action={
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white">
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            }>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '2025-04-03', drifts: 3 },
                    { date: '2025-04-04', drifts: 3 },
                    { date: '2025-04-05', drifts: 5 },
                    { date: '2025-04-06', drifts: 7 },
                    { date: '2025-04-07', drifts: 7 },
                    { date: '2025-04-08', drifts: 6 },
                    { date: '2025-04-09', drifts: 8 },
                    { date: '2025-04-10', drifts: driftCounts.total }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value) => [`${value} drifted stacks`, ``]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="drifts" 
                      name="Drifted Stacks" 
                      stroke="#a855f7" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            {/* Common Drift Categories */}
            <Card title="Common Drift Categories">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                      <ShieldOff size={18} />
                    </div>
                    <h4 className="text-white font-medium">Security Configuration</h4>
                  </div>
                  <div className="text-sm text-slate-300">
                    <p className="mb-2">Security settings modified outside of CloudFormation including IAM policies, security groups, and encryption settings.</p>
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <span className="text-slate-400">Resources Affected</span>
                      <span className="text-red-400 font-medium">5</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Settings size={18} />
                    </div>
                    <h4 className="text-white font-medium">Parameter Changes</h4>
                  </div>
                  <div className="text-sm text-slate-300">
                    <p className="mb-2">Resource parameter modifications such as instance types, capacities, or configurations in RDS, EC2, or ECS.</p>
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <span className="text-slate-400">Resources Affected</span>
                      <span className="text-blue-400 font-medium">3</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                      <Terminal size={18} />
                    </div>
                    <h4 className="text-white font-medium">Tags & Metadata</h4>
                  </div>
                  <div className="text-sm text-slate-300">
                    <p className="mb-2">Changed or missing resource tags, names, and metadata that weren't updated in the CloudFormation templates.</p>
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <span className="text-slate-400">Resources Affected</span>
                      <span className="text-yellow-400 font-medium">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
        
      case 'recommendation':
        return (
          <div className="space-y-6">
            {/* Best Practice Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResourceCard 
                title="Security Recommendations" 
                value="18" 
                icon={Shield} 
                color="bg-red-500/10 text-red-400" 
                subtitle="High impact findings"
                clickable
              />
              <ResourceCard 
                title="Cost Optimization" 
                value="8" 
                icon={BarChart2} 
                color="bg-green-500/10 text-green-400" 
                subtitle="Potential savings"
                clickable
              />
              <ResourceCard 
                title="CloudFormation Best Practices" 
                value="12" 
                icon={Layers} 
                color="bg-blue-500/10 text-blue-400" 
                subtitle="Template improvements"
                clickable
              />
            </div>
            
            {/* Security Recommendations */}
            <Card title="High Impact Security Recommendations" action={
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2">
                <Filter size={14} />
                Filter
              </button>
            }>
              <div className="space-y-3">
                {[
                  {
                    title: 'Enable S3 Default Encryption for All Buckets',
                    description: 'S3 buckets without default encryption pose a data protection risk. All buckets should have encryption enabled.',
                    impact: 'High',
                    effort: 'Low',
                    affectedResources: 3
                  },
                  {
                    title: 'Remove Public Access from RDS Instances',
                    description: 'Production databases with public accessibility increase attack surface. Use private subnets and VPC endpoints instead.',
                    impact: 'Critical',
                    effort: 'Medium',
                    affectedResources: 1
                  },
                  {
                    title: 'Implement Least Privilege IAM Policies',
                    description: 'Several IAM roles have overly permissive policies. Apply least privilege principles to reduce the risk of privilege escalation.',
                    impact: 'High',
                    effort: 'High',
                    affectedResources: 4
                  }
                ].map((rec, idx) => (
                  <div key={idx} className="bg-slate-800/40 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-red-500/10 text-red-400 mt-1">
                        <AlertTriangle size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium">{rec.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                              {rec.impact} Impact
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {rec.effort} Effort
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{rec.affectedResources} affected resources</span>
                          <button className="text-blue-400 hover:text-blue-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    View All 18 Security Recommendations
                  </button>
                </div>
              </div>
            </Card>
            
            {/* CloudFormation Best Practices */}
            <Card title="CloudFormation Template Improvements" action={
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2">
                <Download size={14} />
                Export Report
              </button>
            }>
              <div className="space-y-3">
                {[
                  {
                    title: 'Add Description Parameters to All Templates',
                    description: 'Templates missing proper descriptions make management difficult. Add detailed descriptions to all templates and resources.',
                    impact: 'Low',
                    effort: 'Low',
                    affectedResources: 5
                  },
                  {
                    title: 'Use !Ref Instead of Hardcoded Values',
                    description: 'Several templates have hardcoded values that should be parameterized for better reusability and maintenance.',
                    impact: 'Medium',
                    effort: 'Medium',
                    affectedResources: 8
                  },
                  {
                    title: 'Implement cfn-lint in CI/CD Pipeline',
                    description: 'Set up automated template validation with cfn-lint to catch errors and best practice violations before deployment.',
                    impact: 'Medium',
                    effort: 'Low',
                    affectedResources: 'All stacks'
                  }
                ].map((rec, idx) => (
                  <div key={idx} className="bg-slate-800/40 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 mt-1">
                        <Code size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium">{rec.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              rec.impact === 'Low' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              rec.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {rec.impact} Impact
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {rec.effort} Effort
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Affects: {rec.affectedResources}</span>
                          <button className="text-blue-400 hover:text-blue-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    View All Template Recommendations
                  </button>
                </div>
              </div>
            </Card>
          </div>
        );
        
      default:
        return <div>Select a tab to view content</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="text-blue-400" />
              OmniCloud Security Dashboard
            </h1>
            <p className="text-slate-400">Monitor security, compliance, and drift across your CloudFormation stacks</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <RefreshCw size={16} />
              Refresh Data
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-slate-800">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: PieChartIcon },
              { id: 'findings', label: 'Security Findings', icon: Shield },
              { id: 'stacks', label: 'CloudFormation Stacks', icon: Layers },
              { id: 'drift', label: 'Resource Drift', icon: GitBranch },
              { id: 'compliance', label: 'Compliance', icon: CheckCircle },
              { id: 'recommendation', label: 'Recommendations', icon: Zap }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 font-medium'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
        
        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 mt-8 text-center text-xs text-slate-500">
          <p>Last updated: April 10, 2025 | Scanning all regions | Compliance framework: AWS Security Hub</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSecurityDashboard;