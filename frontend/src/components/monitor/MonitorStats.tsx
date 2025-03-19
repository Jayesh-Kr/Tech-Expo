import React from "react";
import { Card } from "../ui/card";
import { 
  Activity, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  Cpu, 
  XCircle, 
  AlertTriangle 
} from "lucide-react";

interface MonitorStatsProps {
  responseTime: number;
  avgResponseTime: number;
  uptimePercentage: number;
  status: "up" | "down" | "warning";
}

const MonitorStats: React.FC<MonitorStatsProps> = ({
  responseTime,
  avgResponseTime,
  uptimePercentage,
  status
}) => {
  const getPerformanceLabel = () => {
    if (responseTime < 200) return { text: "Fast", color: "text-green-400" };
    if (responseTime < 500) return { text: "Good", color: "text-blue-400" };
    if (responseTime < 800) return { text: "Average", color: "text-yellow-400" };
    return { text: "Slow", color: "text-red-400" };
  };

  const getStatusIcon = () => {
    if (status === "up") return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (status === "warning") return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    return <XCircle className="h-5 w-5 text-red-400" />;
  };

  const performance = getPerformanceLabel();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up [animation-delay:100ms]">
      <StatCard 
        title="Status"
        value={status === "up" ? "Operational" : status === "warning" ? "Degraded" : "Down"}
        icon={getStatusIcon()}
        color={status === "up" ? "from-green-500/20 to-green-600/20 border-green-500/30" : 
               status === "warning" ? "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30" : 
               "from-red-500/20 to-red-600/20 border-red-500/30"}
        textColor={status === "up" ? "text-green-400" : 
                  status === "warning" ? "text-yellow-400" : "text-red-400"}
      />
      
      <StatCard 
        title="Response Time"
        value={`${responseTime}ms`}
        subtitle={performance.text}
        subtitleColor={performance.color}
        icon={<Clock className="h-5 w-5 text-blue-400" />}
        color="from-blue-500/20 to-indigo-600/20 border-blue-500/30"
        textColor="text-blue-400"
      />
      
      <StatCard 
        title="Uptime"
        value={`${uptimePercentage.toFixed(2)}%`}
        icon={<Activity className="h-5 w-5 text-purple-400" />}
        color="from-purple-500/20 to-violet-600/20 border-purple-500/30"
        textColor="text-purple-400"
      />
      
      <StatCard 
        title="Performance"
        value={avgResponseTime < responseTime ? "Improving" : "Stable"}
        subtitle={`Avg: ${avgResponseTime}ms`}
        icon={<Cpu className="h-5 w-5 text-emerald-400" />}
        color="from-emerald-500/20 to-teal-600/20 border-emerald-500/30"
        textColor="text-emerald-400"
        indicator={avgResponseTime < responseTime ? <ArrowUpRight className="h-4 w-4 text-green-400" /> : null}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  subtitleColor?: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  indicator?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor = "text-gray-400",
  icon,
  color,
  textColor,
  indicator
}) => {
  return (
    <Card className={`bg-gradient-to-br ${color} backdrop-blur-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] rounded-full -mt-10 -mr-10 group-hover:scale-110 transition-transform duration-500"></div>
      
      {/* Add subtle particle effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute h-1 w-1 rounded-full bg-white/20 animate-float-slow top-1/4 left-1/4"></div>
        <div className="absolute h-1.5 w-1.5 rounded-full bg-white/15 animate-float-medium top-3/4 left-1/3"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white/20 animate-float-fast top-2/4 left-3/4"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="h-8 w-8 rounded-full bg-gray-800/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{title}</h3>
          </div>
          {indicator && (
            <div className="opacity-80 group-hover:opacity-100 transition-opacity">
              {indicator}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-bold mb-0.5 group-hover:scale-105 origin-left transition-transform duration-300 ease-out">
            <span className={textColor}>{value}</span>
          </div>
          {subtitle && (
            <div className={`text-xs ${subtitleColor} group-hover:translate-x-1 transition-transform duration-300`}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MonitorStats;
