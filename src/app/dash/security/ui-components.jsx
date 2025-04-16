"use client"

import React from 'react';
import { 
  ChevronDown, ChevronRight, AlertCircle, AlertTriangle, 
  Clock, Server, Target, CloudSnow, Globe, X, Check, CheckCircle,
  RotateCw, Layers, RefreshCw, Network, Slash
} from 'lucide-react';

// Security vulnerability/finding list item
export const SecurityFinding = ({ finding, expanded, onToggle, onActionClick }) => {
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
            {finding.cfFix ? 'Apply Patch' : 'Mitigate Now'}
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
                  <div className="text-slate-500 mb-1">Logical ID</div>
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
              <div className="text-white font-medium mb-1">OmniCloud Patch:</div>
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

// OmniCloud stack item component
export const StackItem = ({ stack, expanded, onToggle, onViewResources, onViewTemplate }) => {
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
                    Resources were modified outside of OmniCloud and no longer match the template definition.
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
export const ComplianceCheckItem = ({ check, onToggleDetails }) => {
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

// OmniCloud resource drift component
export const ResourceDrift = ({ resource }) => {
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
export const GuidancePanel = ({ finding }) => {
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

// Missing Code component
const Code = ({ size, className }) => {
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
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
};


import { ArrowUpRight, ExternalLink } from 'lucide-react';

// Resource Card Component
export const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle, onClick, clickable = false }) => (
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

// Custom Card component
export const Card = ({ title, children, action, className = "" }) => (
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

// Security Risk Level Badge
export const RiskLevelBadge = ({ level }) => {
  let bgColor, textColor, icon;
  
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

//Stack Status Badge
export const StackStatusBadge = ({ status }) => {
  let bgColor, textColor, icon;
  
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

// Security Stats Item component
export const SecurityStatsItem = ({ label, value, change, icon: Icon, color }) => (
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

// Resource icon component
export const ResourceIcon = ({ type }) => {
  const getIcon = () => {
    const {
      Server, Database, HardDrive, User, Zap, Layers,
      Network, Share2, Terminal, Key, Globe
    } = require('lucide-react');
    
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