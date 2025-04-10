"use client"

import React from 'react';
import { 
  GitBranch, Server, CheckCircle, Clock, RotateCw, 
  ShieldOff, Settings, Terminal
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

import { Card } from '../../components/ui/card-components';
import { ResourceCard } from '../ui-components';
import { ResourceDrift } from '../ui-components';

export const DriftTab = (props) => {
  const {
    driftCounts,
    cfStacks
  } = props;
  
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
              <p className="mb-2">Security settings modified outside of OmniCloud including IAM policies, security groups, and encryption settings.</p>
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
              <p className="mb-2">Changed or missing resource tags, names, and metadata that weren't updated in the OmniCloud templates.</p>
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
};