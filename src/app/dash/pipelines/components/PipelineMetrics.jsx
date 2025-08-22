import React from 'react';
import { ResourceCard } from '@/app/dash/components/ui';
import { 
  GitBranch, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp 
} from 'lucide-react';

const PipelineMetrics = ({ metrics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-slate-800 rounded-lg p-4 h-24">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Pipelines',
      value: metrics.totalPipelines || 0,
      icon: GitBranch,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: `${metrics.successRate || 0}%`,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Running',
      value: metrics.runningPipelines || 0,
      icon: PlayCircle,
      color: 'yellow'
    },
    {
      title: 'Failed',
      value: metrics.failedPipelines || 0,
      icon: XCircle,
      color: 'red'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <ResourceCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
};

export default PipelineMetrics;
