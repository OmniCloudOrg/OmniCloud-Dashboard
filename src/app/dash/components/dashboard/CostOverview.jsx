import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, ComposedChart, Area, AreaChart } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, BarChart2, Circle, Activity, Calendar, Layers, ChevronRight } from 'lucide-react';

const CostOverview = () => {
  // State hooks
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('breakdown');
  const [chartView, setChartView] = useState('bar');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('next');
  
  // Sample data with trend information and historical data
  const costData = [
    { name: 'AWS', value: 12500, color: '#FF9900', trend: 8.4, lastPeriod: 11530, id: 'aws' },
    { name: 'GCP', value: 8200, color: '#4285F4', trend: -3.2, lastPeriod: 8470, id: 'gcp' },
    { name: 'Azure', value: 5800, color: '#0078D4', trend: 12.1, lastPeriod: 5175, id: 'azure' },
    { name: 'On-Prem', value: 3500, color: '#6B7280', trend: -5.0, lastPeriod: 3685, id: 'onprem' }
  ];
  
  // Daily data
  const dailyCosts = [
    { day: 'Mon', aws: 520, gcp: 340, azure: 240, onprem: 145, date: '04/14' },
    { day: 'Tue', aws: 580, gcp: 320, azure: 260, onprem: 145, date: '04/15' },
    { day: 'Wed', aws: 620, gcp: 380, azure: 290, onprem: 145, date: '04/16' },
    { day: 'Thu', aws: 540, gcp: 340, azure: 230, onprem: 145, date: '04/17' },
    { day: 'Fri', aws: 490, gcp: 290, azure: 190, onprem: 145, date: '04/18' },
    { day: 'Sat', aws: 420, gcp: 240, azure: 170, onprem: 145, date: '04/19' },
    { day: 'Sun', aws: 380, gcp: 220, azure: 150, onprem: 145, date: '04/20' }
  ];

  // Forecast data for next 3 months
  const forecastData = [
    { month: 'Apr', actual: 30000, forecast: 30000 },
    { month: 'May', actual: null, forecast: 31200 },
    { month: 'Jun', actual: null, forecast: 33500 },
    { month: 'Jul', actual: null, forecast: 34800 }
  ];
  
  // Service breakdown data
  const serviceData = [
    { name: 'Compute', value: 15800, percentage: 52.7, color: '#3b82f6' },
    { name: 'Storage', value: 7400, percentage: 24.7, color: '#a855f7' },
    { name: 'Network', value: 4200, percentage: 14.0, color: '#ec4899' },
    { name: 'Database', value: 2600, percentage: 8.6, color: '#f59e0b' }
  ];
  
  // Monthly historical data for trends
  const historicalData = [
    { month: 'Jan', total: 24500, aws: 10500, gcp: 8000, azure: 4000, onprem: 2000 },
    { month: 'Feb', total: 26300, aws: 11200, gcp: 8300, azure: 4400, onprem: 2400 },
    { month: 'Mar', total: 28100, aws: 11900, gcp: 8700, azure: 5000, onprem: 2500 },
    { month: 'Apr', total: 30000, aws: 12500, gcp: 8200, azure: 5800, onprem: 3500 }
  ];

  // Animation effect for chart transitions
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 0); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Handler for chart type changes with animation
  const handleChartTypeChange = (newType) => {
    if (newType === chartType) return;
    
    // Determine animation direction based on chart type order
    const chartOrder = ['breakdown', 'daily', 'trend', 'services'];
    const currentIndex = chartOrder.indexOf(chartType);
    const newIndex = chartOrder.indexOf(newType);
    
    setAnimationDirection(newIndex > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    
    // Set new chart type after transition starts
    setTimeout(() => {
      setChartType(newType);
    }, 250);
  };

  // Handler for chart view changes
  const handleChartViewChange = (newView) => {
    if (newView === chartView) return;
    setAnimationDirection('fade');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setChartView(newView);
    }, 250);
  };
  
  // Calculated metrics using useMemo for performance
  const {
    totalCost,
    totalTrend,
    formattedTotal,
    previousPeriodTotal,
    forecastTotal,
    forecastPercentage,
    dailyAverage,
    peakDayAmount,
    peakDayName,
    efficiency
  } = useMemo(() => {
    const total = costData.reduce((sum, item) => sum + item.value, 0);
    const prevTotal = costData.reduce((sum, item) => sum + item.lastPeriod, 0);
    const trend = ((total - prevTotal) / prevTotal) * 100;
    
    // Get forecast for next month
    const nextMonth = forecastData.find(item => item.actual === null);
    const forecastValue = nextMonth ? nextMonth.forecast : total;
    const forecastChange = ((forecastValue - total) / total) * 100;
    
    // Find peak day
    let maxDay = { day: '', amount: 0 };
    dailyCosts.forEach(day => {
      const dayTotal = day.aws + day.gcp + day.azure + day.onprem;
      if (dayTotal > maxDay.amount) {
        maxDay = { day: day.day, amount: dayTotal };
      }
    });
    
    // Calculate efficiency
    const prevMonthOverall = historicalData[historicalData.length - 2].total;
    const currentMonthOverall = historicalData[historicalData.length - 1].total;
    const overallGrowth = ((currentMonthOverall - prevMonthOverall) / prevMonthOverall) * 100;
    
    // Simple efficiency calculation - can be replaced with more complex logic
    const efficiency = 4.3; // Placeholder for real calculation
    
    return {
      totalCost: total,
      totalTrend: trend,
      formattedTotal: formatCurrency(total),
      previousPeriodTotal: formatCurrency(prevTotal),
      forecastTotal: formatCurrency(forecastValue),
      forecastPercentage: forecastChange,
      dailyAverage: formatCurrency(total / (period === 'week' ? 7 : 30)),
      peakDayAmount: formatCurrency(maxDay.amount),
      peakDayName: maxDay.day,
      efficiency: efficiency
    };
  }, [costData, forecastData, dailyCosts, period, historicalData]);

  // Daily data with total
  const dailyWithTotal = useMemo(() => {
    return dailyCosts.map(day => ({
      ...day,
      total: day.aws + day.gcp + day.azure + day.onprem
    }));
  }, [dailyCosts]);

  // Format currency with appropriate suffixes
  function formatCurrency(value) {
    if (!value && value !== 0) return '-';
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  }
  
  // Format percentage with +/- sign
  function formatPercentage(value) {
    if (!value && value !== 0) return '-';
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  }
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-lg">
          <p className="text-white text-xs font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex justify-between gap-2 text-xs">
              <span style={{ color: entry.color }}>{entry.name || entry.dataKey}:</span>
              <span className="text-white font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Get chart component based on selected type and view
  const getChart = () => {
    if (chartType === 'breakdown') {
      if (chartView === 'pie') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                animationDuration={500}
                animationBegin={0}
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                iconSize={8}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-slate-300 text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      } else {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={costData} 
              layout="vertical"
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={45} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                barSize={16} 
                radius={[0, 3, 3, 0]}
                animationDuration={500}
                animationBegin={0}
              >
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      }
    } else if (chartType === 'daily') {
      if (chartView === 'line') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={dailyWithTotal} 
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              animationDuration={500}
              animationBegin={0}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="#94a3b8" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="aws" stroke="#FF9900" dot={{ r: 2 }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="gcp" stroke="#4285F4" dot={{ r: 2 }} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="azure" stroke="#0078D4" dot={{ r: 2 }} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      } else if (chartView === 'area') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={dailyWithTotal} 
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              animationDuration={500}
              animationBegin={0}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
              <Area type="monotone" dataKey="aws" stackId="2" stroke="#FF9900" fill="#FF9900" fillOpacity={0.1} />
              <Area type="monotone" dataKey="gcp" stackId="2" stroke="#4285F4" fill="#4285F4" fillOpacity={0.1} />
              <Area type="monotone" dataKey="azure" stackId="2" stroke="#0078D4" fill="#0078D4" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        );
      } else {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={dailyCosts} 
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              animationDuration={500}
              animationBegin={0}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={8} iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              <Bar dataKey="aws" stackId="a" fill="#FF9900" name="AWS" />
              <Bar dataKey="gcp" stackId="a" fill="#4285F4" name="GCP" />
              <Bar dataKey="azure" stackId="a" fill="#0078D4" name="Azure" />
              <Bar dataKey="onprem" stackId="a" fill="#6B7280" name="On-Prem" />
            </BarChart>
          </ResponsiveContainer>
        );
      }
    } else if (chartType === 'trend') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={forecastData} 
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            animationDuration={500}
            animationBegin={0}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={8} iconType="circle" formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
            <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
            <Line type="monotone" dataKey="forecast" stroke="#f97316" name="Forecast" dot={{ r: 2 }} activeDot={{ r: 4 }} strokeWidth={2} />
            <Area type="monotone" dataKey="forecast" fill="#f97316" fillOpacity={0.1} />
          </ComposedChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'services') {
      if (chartView === 'pie') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                animationDuration={500}
                animationBegin={0}
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                iconSize={8}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-slate-300 text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      } else {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={serviceData} 
              layout="vertical" 
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              animationDuration={500}
              animationBegin={0}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={70} tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" barSize={16} radius={[0, 3, 3, 0]}>
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      }
    }
  };
  
  // Get chart type icon and label
  const getChartTypeInfo = () => {
    switch(chartType) {
      case 'breakdown':
        return { icon: <BarChart2 size={14} />, label: 'Providers' };
      case 'daily':
        return { icon: <Activity size={14} />, label: 'Daily' };
      case 'trend':
        return { icon: <Calendar size={14} />, label: 'Forecast' };
      case 'services':
        return { icon: <Layers size={14} />, label: 'Services' };
      default:
        return { icon: <BarChart2 size={14} />, label: 'Providers' };
    }
  };
  
  // Quick stat card component
  const QuickStat = ({ title, value, trend, trendValue, icon, onClick }) => (
    <div 
      className="bg-slate-800/50 rounded-lg p-2 hover:bg-slate-800/80 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-slate-400">{title}</div>
          <div className="text-base font-bold text-white">{value}</div>
        </div>
        {trend !== undefined && (
          <div className={`px-1.5 py-0.5 rounded text-xs ${trend >= 0 ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}>
            {trend >= 0 ? 
              <TrendingUp size={10} className="inline mr-0.5" /> : 
              <TrendingDown size={10} className="inline mr-0.5" />
            }
            {trendValue}
          </div>
        )}
        {icon && <div className="text-blue-400">{icon}</div>}
      </div>
    </div>
  );

  // Chart view button component
  const ViewButton = ({ view, icon, disabled }) => (
    <button 
      onClick={() => handleChartViewChange(view)} 
      disabled={disabled}
      className={`p-1 ${
        disabled 
          ? 'text-slate-600 cursor-not-allowed' 
          : chartView === view 
            ? 'bg-slate-700 text-white' 
            : 'text-slate-400 hover:text-slate-200'
      }`}
      aria-label={`${view} chart view`}
    >
      {icon}
    </button>
  );
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center">
          <DollarSign size={18} className="text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Cost Overview</h3>
        </div>
        <div className="flex items-center gap-1">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs sm:text-sm text-white"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>
      
      <div className="p-3">
        {/* Clickable stats row for switching chart types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <QuickStat 
            title="Total Cost" 
            value={formattedTotal}
            trend={totalTrend}
            trendValue={formatPercentage(totalTrend)}
            onClick={() => handleChartTypeChange('breakdown')}
          />
          <QuickStat 
            title="Daily Trends" 
            value={dailyAverage}
            icon={<Activity size={16} />}
            onClick={() => handleChartTypeChange('daily')}
          />
          <QuickStat 
            title="Forecast" 
            value={forecastTotal}
            trend={forecastPercentage}
            trendValue={formatPercentage(forecastPercentage)}
            onClick={() => handleChartTypeChange('trend')}
          />
          <QuickStat 
            title="Services" 
            value={`${serviceData[0].name}: ${serviceData[0].percentage}%`}
            icon={<Layers size={16} />}
            onClick={() => handleChartTypeChange('services')}
          />
        </div>
        
        {/* Chart area with transition effects and chart type controls in top right */}
        <div className="bg-slate-800/30 rounded-lg p-2 mb-2 relative overflow-hidden">
          {/* Chart controls overlay */}
          <div className="absolute top-2 right-2 z-10 flex items-center">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-1 flex items-center shadow-md">
              <div className="flex items-center gap-1 px-2 py-0.5 text-xs text-white">
                {getChartTypeInfo().icon}
                <span>{getChartTypeInfo().label}</span>
              </div>
              
              {/* Chart view buttons only shown for compatible chart types */}
              {(chartType === 'breakdown' || chartType === 'services') && (
                <div className="border-l border-slate-700 pl-1 ml-1 flex">
                  <ViewButton 
                    view="bar" 
                    icon={<BarChart2 size={14} />} 
                    disabled={false}
                  />
                  <ViewButton 
                    view="pie" 
                    icon={<Circle size={14} />} 
                    disabled={false}
                  />
                </div>
              )}
              
              {chartType === 'daily' && (
                <div className="border-l border-slate-700 pl-1 ml-1 flex">
                  <ViewButton 
                    view="bar" 
                    icon={<BarChart2 size={14} />} 
                    disabled={false}
                  />
                  <ViewButton 
                    view="line" 
                    icon={<Activity size={14} />} 
                    disabled={false}
                  />
                  <ViewButton 
                    view="area" 
                    icon={<Layers size={14} />} 
                    disabled={false}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Chart with animation */}
          <div 
            className={`h-64 ${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            style={{
              transform: isTransitioning 
                ? animationDirection === 'next' 
                  ? 'translateX(10%)' 
                  : animationDirection === 'prev' 
                    ? 'translateX(-10%)' 
                    : 'scale(0.95)'
                : 'translateX(0) scale(1)',
              transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'
            }}
          >
            {getChart()}
          </div>
        </div>
        
        {/* Bottom cards with drillable metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div 
            className="bg-slate-800/50 rounded-lg p-2 cursor-pointer hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            onClick={() => handleChartTypeChange('breakdown')}
          >
            <div>
              <div className="text-xs text-slate-400">Top Provider</div>
              <div className="text-sm font-medium text-white">{costData[0].name}</div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
          
          <div 
            className="bg-slate-800/50 rounded-lg p-2 cursor-pointer hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            onClick={() => handleChartTypeChange('daily')}
          >
            <div>
              <div className="text-xs text-slate-400">Peak Day</div>
              <div className="text-sm font-medium text-white">{peakDayName}</div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
          
          <div 
            className="bg-slate-800/50 rounded-lg p-2 cursor-pointer hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            onClick={() => handleChartTypeChange('services')}
          >
            <div>
              <div className="text-xs text-slate-400">Top Service</div>
              <div className="text-sm font-medium text-white">{serviceData[0].name}</div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
          
          <div 
            className="bg-slate-800/50 rounded-lg p-2 cursor-pointer hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            onClick={() => handleChartTypeChange('trend')}
          >
            <div>
              <div className="text-xs text-slate-400">Efficiency</div>
              <div className="text-sm font-medium text-white">
                <span className="text-green-400">↑ {efficiency}%</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostOverview;