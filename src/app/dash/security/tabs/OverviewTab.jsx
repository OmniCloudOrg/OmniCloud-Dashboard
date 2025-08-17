"use client"

import React from 'react';
import {
    AlertCircle, GitBranch, ShieldOff, Clock, AlertTriangle,
    CheckCircle, Target, Layers, Globe
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import { Card } from '../../../../components/ui';
import { ResourceCard, SecurityStatsItem, ResourceIcon } from '../ui-components';

export const OverviewTab = ({
    severityCounts, driftCounts, cfStacks, riskScore, getRiskTier,
    securityFindings, weeklyTrendData, categoryData, stackData,
    resourceTypeData, templateData, setActiveTab, setSelectedSeverities,
    setShowDriftedOnly, setShowNonCompliantOnly, setExpandedFinding
}) => {
    const renderRiskScore = () => (
        <div className="md:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-lg font-medium text-white">Security Risk Score</h3>
            </div>
            <div className="p-6 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className="text-4xl font-bold text-white">{riskScore}</div>
                        <div className={`text-sm font-medium ${riskScore >= 75 ? 'text-red-400' :
                                riskScore >= 50 ? 'text-orange-400' :
                                    riskScore >= 25 ? 'text-yellow-400' :
                                        'text-green-400'
                            }`}>{getRiskTier(riskScore)} Risk</div>
                    </div>
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="#1e293b" strokeWidth="3" strokeDasharray="100, 100"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
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
                    Based on {securityFindings.length} security findings across {cfStacks.length} OmniCloud stacks
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
    );

    const renderSummaryCards = () => (
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
    );

    const renderSecurityFindings = () => (
        <Card
            title="Top Security Findings"
            action={
                <button
                    onClick={() => setActiveTab('findings')}
                    className="text-sm text-blue-400 hover:text-blue-300"
                >
                    View All
                </button>
            }
        >
            <div className="space-y-4">
                {securityFindings
                    .filter(finding => finding.status !== 'mitigated')
                    .sort((a, b) => {
                        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                        return severityOrder[a.severity] - severityOrder[b.severity]
                            || new Date(b.discovered) - new Date(a.discovered);
                    })
                    .slice(0, 3)
                    .map(finding => (
                        <div key={finding.id} className="bg-slate-800/50 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 p-2 rounded-full ${finding.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                                        finding.severity === 'high' ? 'bg-orange-500/10 text-orange-400' :
                                            finding.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {finding.severity === 'critical' ? <AlertCircle size={16} /> :
                                        finding.severity === 'high' ? <AlertTriangle size={16} /> :
                                            finding.severity === 'medium' ? <AlertTriangle size={16} /> :
                                                <InfoIcon size={16} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="text-sm font-medium text-white">{finding.title}</div>
                                        <div className={`px-2 py-0.5 rounded-full text-xs ${finding.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                finding.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                    finding.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {finding.severity.toUpperCase()}
                                        </div>
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
    );

    const renderCharts = () => (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card
                    title="Weekly Security Trend"
                    action={
                        <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white">
                            <option value="4weeks">Last 4 Weeks</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="12months">Last 12 Months</option>
                        </select>
                    }
                >
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyTrendData}>
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
                                <Area type="monotone" dataKey="critical" name="Critical" stroke="#ef4444" fill="url(#criticalGradient)" stackId="1" />
                                <Area type="monotone" dataKey="high" name="High" stroke="#f97316" fill="url(#highGradient)" stackId="1" />
                                <Area type="monotone" dataKey="medium" name="Medium" stroke="#facc15" fill="url(#mediumGradient)" stackId="1" />
                                <Area type="monotone" dataKey="low" name="Low" stroke="#3b82f6" fill="url(#lowGradient)" stackId="1" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card
                    title="OmniCloud Template Insights"
                    action={
                        <button className="text-sm text-blue-400 hover:text-blue-300">
                            View Report
                        </button>
                    }
                >
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "By Category", data: categoryData },
                    { title: "By OmniCloud Stack", data: stackData },
                    { title: "By Resource Type", data: resourceTypeData }
                ].map(({ title, data }) => (
                    <Card key={title} title={title}>
                        <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        innerRadius={40}
                                        paddingAngle={2}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}
                    ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {data.map((entry, index) => (
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
                ))}
            </div>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {renderRiskScore()}
                {renderSummaryCards()}
            </div>

            <Card
                title="OmniCloud Stacks Status"
                action={
                    <button
                        onClick={() => setActiveTab('stacks')}
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        View All
                    </button>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-white font-medium">Total Stacks</h4>
                            <span className="text-2xl font-semibold text-white">{cfStacks.length}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Active</span>
                                <span className="text-green-400">
                                    {cfStacks.filter(s => !s.status.includes('DELETE')).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">In Progress</span>
                                <span className="text-blue-400">
                                    {cfStacks.filter(s => s.status.includes('IN_PROGRESS')).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Failed</span>
                                <span className="text-red-400">
                                    {cfStacks.filter(s => s.status.includes('FAILED')).length}
                                </span>
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
                                <span className="text-green-400">
                                    {cfStacks.filter(s => s.driftStatus === 'IN_SYNC').length}
                                </span>
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
                                <span className="text-2xl font-semibold text-white">
                                    {cfStacks.reduce((sum, stack) => sum + stack.securityIssues, 0)}
                                </span>
                                <span className="text-xs text-slate-400">issues</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Non-compliant Stacks</span>
                                <span className="text-red-400">
                                    {cfStacks.filter(s => s.securityIssues > 0).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Compliant Stacks</span>
                                <span className="text-green-400">
                                    {cfStacks.filter(s => s.securityIssues === 0).length}
                                </span>
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
                                        <span className={`px-2 py-0.5 rounded-full text-xs 
                      ${stack.status.includes('COMPLETE') ? 'bg-green-500/10 text-green-400' :
                                                stack.status.includes('PROGRESS') ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-red-500/10 text-red-400'}`}>
                                            {stack.status.replace('_', ' ')}
                                        </span>
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

            {renderSecurityFindings()}
            {renderCharts()}
        </div>
    );
};

// Simple info icon component
const InfoIcon = ({ size, className }) => (
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