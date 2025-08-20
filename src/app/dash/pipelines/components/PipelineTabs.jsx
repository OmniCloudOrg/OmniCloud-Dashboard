import React from 'react';
import { TabNavigation } from '@/app/dash/components/ui';
import { PIPELINE_TABS } from '@/data/pipelineConstants';

const PipelineTabs = ({
  activeTab,
  onTabChange,
  metrics
}) => {
  // Add counts to tab labels
  const tabsWithCounts = PIPELINE_TABS.map(tab => {
    let count = '';
    
    switch (tab.value) {
      case 'pipelines':
        count = metrics?.totalPipelines || 0;
        break;
      case 'builds':
        count = metrics?.totalBuilds || 0;
        break;
      case 'artifacts':
        count = metrics?.totalArtifacts || 0;
        break;
      case 'environments':
        count = metrics?.totalEnvironments || 0;
        break;
      default:
        count = '';
    }

    return {
      ...tab,
      label: count ? `${tab.label} (${count})` : tab.label
    };
  });

  return (
    <div className="border-b border-slate-700 mb-6">
      <TabNavigation
        tabs={tabsWithCounts}
        activeTab={activeTab}
        setActiveTab={onTabChange}
      />
    </div>
  );
};

export default PipelineTabs;
