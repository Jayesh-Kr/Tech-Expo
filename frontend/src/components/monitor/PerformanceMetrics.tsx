import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  BarChart3, 
  ArrowUpRight,
  ArrowDownRight,
  Clock, 
  Server
} from "lucide-react";

interface PerformanceMetricsProps {
  responseTime: number;
  previousResponseTime?: number;
  uptime: number;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  responseTime, 
  previousResponseTime, 
  uptime 
}) => {
  const trend = previousResponseTime 
    ? responseTime < previousResponseTime 
      ? { direction: "down", label: "Improved", color: "text-green-400" }
      : responseTime > previousResponseTime 
        ? { direction: "up", label: "Degraded", color: "text-amber-400" }
        : { direction: "same", label: "Stable", color: "text-blue-400" }
    : { direction: "same", label: "Stable", color: "text-blue-400" };

  const getPerformanceRating = () => {
    if (responseTime < 100) return { label: "Excellent", color: "text-green-400" };
    if (responseTime < 300) return { label: "Good", color: "text-blue-400" };
    if (responseTime < 600) return { label: "Average", color: "text-amber-400" };
    return { label: "Poor", color: "text-red-400" };
  };

  const rating = getPerformanceRating();
  
  const percentage = Math.min(100, (responseTime / 1000) * 100);
  
  return (
    <Card className="bg-gray-800/40 border-gray-700 overflow-hidden transition-all hover:border-gray-600">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
              <p className="text-white text-[20px]">Performance Metrics</p>
          </CardTitle>
          <Badge variant="outline" className="bg-gray-700/50 text-gray-300">
            Last checked: 2 min ago
          </Badge>
        </div>
        <CardDescription><p className="text-[#9CA3AF]">Current performance analysis</p></CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-300">Response Time</h3>
              </div>
              <Badge className={`
                ${rating.color} bg-opacity-10 border
                ${rating.label === "Excellent" ? "border-green-500/30" : 
                  rating.label === "Good" ? "border-blue-500/30" : 
                  rating.label === "Average" ? "border-amber-500/30" : 
                  "border-red-500/30"}
              `}>
                {rating.label}
              </Badge>
            </div>
            
            <div className="relative pt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>0ms</span>
                <span>500ms</span>
                <span>1000ms</span>
              </div>
              <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    responseTime < 300 ? "bg-gradient-to-r from-green-500 to-blue-500" :
                    responseTime < 600 ? "bg-gradient-to-r from-blue-500 to-amber-500" :
                    "bg-gradient-to-r from-amber-500 to-red-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-white">{responseTime}ms</div>
                {previousResponseTime && (
                  <div className="flex items-center gap-1 text-sm">
                    {trend.direction === "down" ? (
                      <ArrowDownRight className="h-4 w-4 text-green-400" />
                    ) : trend.direction === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-amber-400" />
                    ) : null}
                    <span className={trend.color}>{trend.label}</span>
                    {trend.direction !== "same" && (
                      <span className="text-gray-400 text-xs">
                        ({Math.abs(responseTime - previousResponseTime)}ms)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Server className="h-4 w-4 text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-300">Uptime</h3>
              </div>
              <Badge className={`
                ${uptime > 99.9 ? "text-green-400 border-green-500/30" : 
                 uptime > 99 ? "text-blue-400 border-blue-500/30" : 
                 uptime > 95 ? "text-amber-400 border-amber-500/30" : 
                 "text-red-400 border-red-500/30"}
                bg-opacity-10 border
              `}>
                {uptime > 99.9 ? "Excellent" : 
                 uptime > 99 ? "Good" : 
                 uptime > 95 ? "Average" : 
                 "Poor"}
              </Badge>
            </div>
            
            <div className="pt-3">
              <div className="relative pt-1">
                <div className="h-32 w-32 mx-auto relative">
                  <svg className="w-32 h-32" viewBox="0 0 36 36">
                    <path 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    
                    <path 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={uptime > 99 ? "#34d399" : uptime > 95 ? "#60a5fa" : "#f59e0b"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${uptime}, 100`}
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{uptime.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;