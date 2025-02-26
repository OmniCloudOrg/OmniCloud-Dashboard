import { ArrowUpRight  } from 'lucide-react';

interface QuickStatCardProps {
  title: string;
  value: number | string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const QuickStatCard: React.FC<QuickStatCardProps> = ({ title, value, trend, trendUp, icon, color }) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
  
    return (
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend}
            <ArrowUpRight size={16} className={!trendUp ? 'rotate-180' : ''} />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-white">{value}</h3>
          <p className="text-sm text-slate-400">{title}</p>
        </div>
      </div>
    );
  };

  export default QuickStatCard;