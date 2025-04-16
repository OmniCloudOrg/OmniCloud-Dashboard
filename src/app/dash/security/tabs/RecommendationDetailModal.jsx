import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

export const RecommendationModal = ({ 
  isOpen, 
  onClose, 
  recommendation,
  type 
}) => {
  const [remediationPlan, setRemediationPlan] = useState(null);

  if (!isOpen || !recommendation) return null;

  const generateRemediationPlan = () => {
    // Hardcoded remediation plans based on recommendation type
    const plans = {
      'security': {
        'Enable S3 Default Encryption for All Buckets': [
          {
            step: 'Access AWS S3 Console',
            description: 'Log into AWS Management Console and navigate to S3 service',
            status: 'pending'
          },
          {
            step: 'Enable Default Encryption',
            description: 'For each unencrypted bucket, go to bucket settings and enable default encryption using AWS KMS',
            status: 'pending'
          },
          {
            step: 'Update IAM Policies',
            description: 'Modify IAM policies to enforce encryption for new and existing S3 buckets',
            status: 'pending'
          },
          {
            step: 'Audit Existing Buckets',
            description: 'Review and update encryption settings for all existing S3 buckets',
            status: 'pending'
          }
        ],
        'Remove Public Access from RDS Instances': [
          {
            step: 'Access RDS Instances',
            description: 'Navigate to RDS service in AWS Management Console',
            status: 'pending'
          },
          {
            step: 'Modify Network Settings',
            description: 'Update network configuration to use private subnets and remove public accessibility',
            status: 'pending'
          },
          {
            step: 'Configure VPC Endpoints',
            description: 'Set up VPC endpoints for secure private network access',
            status: 'pending'
          },
          {
            step: 'Update Security Groups',
            description: 'Restrict inbound and outbound traffic to necessary sources',
            status: 'pending'
          }
        ],
        'Implement Least Privilege IAM Policies': [
          {
            step: 'Audit Existing IAM Roles',
            description: 'Review current IAM roles and their attached policies',
            status: 'pending'
          },
          {
            step: 'Remove Unnecessary Permissions',
            description: 'Eliminate overly broad or unused permissions',
            status: 'pending'
          },
          {
            step: 'Create Granular Policies',
            description: 'Develop specific IAM policies with minimal required permissions',
            status: 'pending'
          },
          {
            step: 'Implement Role Separation',
            description: 'Ensure different roles have distinct, limited access scopes',
            status: 'pending'
          }
        ]
      },
      'omnicloud': {
        'Add Description Parameters to All Templates': [
          {
            step: 'Review CloudFormation Templates',
            description: 'Identify templates lacking comprehensive descriptions',
            status: 'pending'
          },
          {
            step: 'Update Template Metadata',
            description: 'Add detailed descriptions for each resource and template',
            status: 'pending'
          },
          {
            step: 'Document Resource Purpose',
            description: 'Clearly explain the purpose and configuration of each resource',
            status: 'pending'
          },
          {
            step: 'Validate Template Readability',
            description: 'Ensure descriptions provide clear context for template understanding',
            status: 'pending'
          }
        ],
        'Use !Ref Instead of Hardcoded Values': [
          {
            step: 'Identify Hardcoded Values',
            description: 'Locate instances of hardcoded configuration values',
            status: 'pending'
          },
          {
            step: 'Create Parameters',
            description: 'Define CloudFormation parameters to replace hardcoded values',
            status: 'pending'
          },
          {
            step: 'Update References',
            description: 'Replace hardcoded values with !Ref or !Sub functions',
            status: 'pending'
          },
          {
            step: 'Test Template Flexibility',
            description: 'Verify templates work with different parameter inputs',
            status: 'pending'
          }
        ],
        'Implement cfn-lint in CI/CD Pipeline': [
          {
            step: 'Install cfn-lint',
            description: 'Add cfn-lint to development environment',
            status: 'pending'
          },
          {
            step: 'Configure CI/CD Pipeline',
            description: 'Integrate cfn-lint validation step in deployment workflow',
            status: 'pending'
          },
          {
            step: 'Set Validation Rules',
            description: 'Configure strict linting rules for template validation',
            status: 'pending'
          },
          {
            step: 'Automated Reporting',
            description: 'Set up automated reporting for template validation failures',
            status: 'pending'
          }
        ]
      }
    };

    // Generate plan based on recommendation
    const plan = plans[type]?.[recommendation.title] || [];
    setRemediationPlan(plan);
  };

  const updateStepStatus = (stepIndex) => {
    if (!remediationPlan) return;

    const updatedPlan = [...remediationPlan];
    updatedPlan[stepIndex].status = 
      updatedPlan[stepIndex].status === 'pending' ? 'completed' : 'pending';
    
    setRemediationPlan(updatedPlan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-lg w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            {recommendation.title}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              recommendation.impact === 'Low' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              recommendation.impact === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
              recommendation.impact === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {recommendation.impact} Impact
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {recommendation.effort} Effort
            </span>
          </div>
          
          <p className="text-slate-300">
            {recommendation.description}
          </p>
          
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Affected Resources</h4>
            <p className="text-slate-300">
              {recommendation.affectedResources} {typeof recommendation.affectedResources === 'number' ? 'resources' : ''}
            </p>
          </div>
          
          {type === 'security' && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Recommended Actions</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Review current S3 bucket encryption settings</li>
                <li>Enable default encryption for all buckets</li>
                <li>Verify encryption keys and access policies</li>
              </ul>
            </div>
          )}
          
          {type === 'omnicloud' && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Implementation Guidelines</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Update CloudFormation templates</li>
                <li>Add comprehensive resource descriptions</li>
                <li>Use parameterization for flexibility</li>
              </ul>
            </div>
          )}

          {remediationPlan && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Remediation Plan</h4>
              <div className="space-y-2">
                {remediationPlan.map((step, index) => (
                  <div 
                    key={index} 
                    className={`
                      p-3 rounded-lg flex items-center justify-between
                      ${step.status === 'completed' 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-slate-700/50'}
                    `}
                  >
                    <div>
                      <h5 className={`
                        font-medium 
                        ${step.status === 'completed' 
                          ? 'text-green-400' 
                          : 'text-white'}
                      `}>
                        {step.step}
                      </h5>
                      <p className="text-xs text-slate-300">{step.description}</p>
                    </div>
                    <button 
                      onClick={() => updateStepStatus(index)}
                      className={`
                        p-1 rounded-full transition-colors
                        ${step.status === 'completed'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}
                      `}
                    >
                      {step.status === 'completed' ? <Check size={16} /> : <AlertTriangle size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-700 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={generateRemediationPlan}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {remediationPlan ? 'Regenerate Plan' : 'Generate Remediation Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;