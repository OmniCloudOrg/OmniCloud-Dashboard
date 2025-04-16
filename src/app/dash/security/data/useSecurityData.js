"use client"

import { useState, useMemo } from 'react';
import { mockSecurityFindings } from './mockSecurityFindings';
import { mockCfStacks } from './mockOCStacks';

export const useSecurityData = (
  searchQuery,
  selectedSeverities,
  selectedRegion,
  selectedResourceType,
  focusArea,
  showDriftedOnly,
  showNonCompliantOnly
) => {
  // Use our mock data - in a real app, you'd fetch this from an API
  const securityFindings = mockSecurityFindings;
  const cfStacks = mockCfStacks;
  
  // Calculate severity counts
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
  
  // OmniCloud templates stats
  const templateData = [
    { name: 'Non-Compliant Resources', value: 15 },
    { name: 'Drift Detected', value: 8 },
    { name: 'Using Default Parameters', value: 12 },
    { name: 'Outdated AMIs', value: 6 }
  ];
  
  // Filter findings based on search query, selected severities, region, etc.
  const filteredFindings = useMemo(() => {
    return securityFindings.filter(finding => 
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
  }, [
    securityFindings, 
    searchQuery, 
    selectedSeverities, 
    selectedRegion, 
    selectedResourceType, 
    focusArea, 
    showDriftedOnly
  ]);
  
  // Filter stacks based on search query, region, etc.
  const filteredStacks = useMemo(() => {
    return cfStacks.filter(stack =>
      (searchQuery === '' ||
        stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stack.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (selectedRegion === 'all' || stack.region === selectedRegion) &&
      (!showDriftedOnly || stack.driftStatus === 'DRIFTED') &&
      (!showNonCompliantOnly || stack.securityIssues > 0)
    );
  }, [
    cfStacks, 
    searchQuery, 
    selectedRegion, 
    showDriftedOnly, 
    showNonCompliantOnly
  ]);
  
  return {
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
  };
};