"use client"

import React, { useState } from 'react';
import { 
  Shield, PieChart as PieChartIcon, Layers, 
  GitBranch, CheckCircle, Zap, RefreshCw, Download
} from 'lucide-react';
import { TabNavigation } from '../components/ui/common-components';

// Import subcomponents
import { OverviewTab } from './tabs/OverviewTab';
import { FindingsTab } from './tabs/FindingsTab';
import { StacksTab } from './tabs/StacksTab';
import { DriftTab } from './tabs/DriftTab';
import { ComplianceTab } from './tabs/ComplianceTab';
import { RecommendationTab } from './tabs/RecommendationTab';

// Import mock data providers
import { useSecurityData } from './data/useSecurityData';

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
  
  // Get data from custom hook
  const {
    securityFindings,
    cfStacks,
    severityCounts,
    statusCounts,
    driftCounts,
    riskScore,
    categories,
    filteredFindings,
    filteredStacks,
    calculateSecurityRisk,
    getRiskTier,
    categoryData,
    resourceTypeData,
    regionData,
    stackData,
    weeklyTrendData,
    complianceData,
    timeToFixData,
    templateData
  } = useSecurityData(
    searchQuery,
    selectedSeverities,
    selectedRegion,
    selectedResourceType,
    focusArea,
    showDriftedOnly,
    showNonCompliantOnly
  );
  
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
  
  // Render active tab content
  const renderTabContent = () => {
    const commonProps = {
      searchQuery,
      setSearchQuery,
      selectedSeverities,
      toggleSeverityFilter,
      focusArea,
      setFocusArea,
      selectedRegion,
      setSelectedRegion,
      selectedResourceType,
      setSelectedResourceType,
      showDriftedOnly,
      setShowDriftedOnly,
      showNonCompliantOnly,
      setShowNonCompliantOnly,
      expandedFinding,
      toggleFindingExpansion,
      expandedStack,
      toggleStackExpansion,
      handleViewStackResources,
      handleViewStackTemplate,
      handleFindingAction,
      securityFindings,
      cfStacks,
      severityCounts,
      statusCounts,
      driftCounts,
      riskScore,
      categories,
      filteredFindings,
      filteredStacks,
      calculateSecurityRisk,
      getRiskTier,
      categoryData,
      resourceTypeData,
      regionData,
      stackData,
      weeklyTrendData,
      complianceData,
      timeToFixData,
      templateData,
      setActiveTab
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...commonProps} />;
      case 'findings':
        return <FindingsTab {...commonProps} />;
      case 'stacks':
        return <StacksTab {...commonProps} />;
      case 'drift':
        return <DriftTab {...commonProps} />;
      case 'compliance':
        return <ComplianceTab {...commonProps} />;
      case 'recommendation':
        return <RecommendationTab {...commonProps} />;
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
            <p className="text-slate-400">Monitor security, compliance, and drift across your OmniCloud stacks</p>
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
        <TabNavigation
          tabs={[
            { id: 'overview', label: 'Overview', icon: PieChartIcon },
            { id: 'findings', label: 'Security Findings', icon: Shield },
            { id: 'stacks', label: 'Application Stacks', icon: Layers },
            { id: 'drift', label: 'Resource Drift', icon: GitBranch },
            { id: 'compliance', label: 'Compliance', icon: CheckCircle },
            { id: 'recommendation', label: 'Recommendations', icon: Zap }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
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