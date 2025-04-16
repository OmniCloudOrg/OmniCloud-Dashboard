"use client"

import React from 'react';
import { 
  Shield, X, CheckCircle, AlertTriangle
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend, Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { Card } from '../../components/ui/card-components';
import { ResourceCard } from '../ui-components';
import { ComplianceCheckItem } from '../ui-components';

export const ComplianceTab = (props) => {
  const {
    complianceData
  } = props;
  
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
    }
