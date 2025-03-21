import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckCircle, ExternalLink, XCircle, RefreshCw, Clock, AlertCircle } from "lucide-react";

interface MonitorHeaderProps {
  name: string;
  url: string;
  status: "up" | "down" | "warning";
  uptimePercentage: number;
  lastChecked: string;
  disabled: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const MonitorHeader: React.FC<MonitorHeaderProps> = ({
  name,
  url,
  status,
  uptimePercentage,
  lastChecked,
  disabled,
  onRefresh,
  isRefreshing = false
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-xl border border-gray-700 shadow-lg backdrop-blur-sm animate-slide-up">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${
          status === "up" ? "bg-green-500" : 
          status === "warning" ? "bg-amber-500" : 
          "bg-rose-500"
        }`}></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-10 bg-blue-500"></div>
      </div>
      
      <div className="relative p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="relative flex h-4 w-4">
                <span 
                  className={`absolute inline-flex h-full w-full rounded-full ${
                    status === "up" ? "bg-emerald-500" : 
                    status === "warning" ? "bg-amber-500" : 
                    "bg-rose-500"
                  }`}
                />
                {status !== "up" && (
                  <span 
                    className={`absolute inline-flex h-full w-full rounded-full ${
                      status === "warning" ? "bg-amber-500" : 
                      "bg-rose-500"
                    } animate-ping`}
                  />
                )}
              </span>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <Badge 
                className={`${
                  status === "up" 
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30" 
                    : status === "warning"
                    ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30"
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
                }`}
              >
                {status === "up" ? "Operational" : status === "warning" ? "Degraded" : "Down"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition-colors group"
              >
                {url}
                <ExternalLink className="h-3.5 w-3.5 ml-1.5 opacity-50 group-hover:opacity-100 transition-all" />
              </a>
            </div>
            
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-sm">
                <Clock className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
                <span className="text-gray-400">Last checked: </span>
                <span className="text-white ml-1">{lastChecked}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 mr-1.5" />
                <span className="text-gray-400">Alerts: </span>
                <span className="text-white ml-1">{disabled ? "Disabled" : "Enabled"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
            <div className="flex items-center bg-gray-800/70 p-3 px-5 rounded-lg border border-gray-700">
              <div className="flex flex-col items-center px-4 py-1 border-r border-gray-700 last:border-0">
                <span className="text-xs text-gray-400 mb-0.5">Status</span>
                <div className="flex items-center">
                  {status === "up" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />
                  )}
                  <span className="font-medium text-white">
                    {status === "up" ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-center px-4 py-1">
                <span className="text-xs text-gray-400 mb-0.5">Uptime</span>
                <span className="font-medium text-white">{uptimePercentage.toFixed(2)}%</span>
              </div>
            </div>
            
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh} 
                disabled={isRefreshing}
                className="gap-2 h-10 px-4 border-gray-700 hover:bg-gray-700/70 hover:text-white text-gray-200 transition-all"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorHeader;