import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface StatusHistoryTicksProps {
  statusHistory: { status: "up" | "down" | "warning"; length: number }[];
  hoursToShow?: number;
  minutesToShow?: number;
}

const StatusHistoryTicks: React.FC<StatusHistoryTicksProps> = ({
  statusHistory,
  hoursToShow,
  minutesToShow
}) => {
  const formatTime = (index: number, total: number) => {
    if (hoursToShow) {
      const hour = new Date().getHours() - (hoursToShow - Math.floor(index / (total / hoursToShow)));
      return `${hour < 0 ? hour + 24 : hour}:00`;
    } else if (minutesToShow) {
      const now = new Date();
      const minutes = now.getMinutes() - (minutesToShow - Math.floor(index / (total / minutesToShow)));
      const time = new Date(now.setMinutes(minutes));
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  const getStatusIcon = (status: "up" | "down" | "warning") => {
    if (status === "up") return <CheckCircle className="h-3 w-3 text-green-500" />;
    if (status === "warning") return <AlertCircle className="h-3 w-3 text-amber-500" />;
    return <XCircle className="h-3 w-3 text-red-500" />;
  };

  const getStatusText = (status: "up" | "down" | "warning") => {
    if (status === "up") return "Operational";
    if (status === "warning") return "Degraded Performance";
    return "Outage";
  };

  return (
    <div className="w-full">
      <div className="flex h-12 items-end gap-1 mb-1.5">
        {statusHistory.map((segment, i) => (
          <TooltipProvider key={i} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`group flex-1 rounded-t cursor-pointer transition-all hover:scale-y-110 hover:z-10 ${
                    segment.status === "up" 
                      ? "bg-gradient-to-t from-green-600/80 to-green-500/80 hover:from-green-600 hover:to-green-500" 
                      : segment.status === "warning"
                      ? "bg-gradient-to-t from-amber-600/80 to-amber-500/80 hover:from-amber-600 hover:to-amber-500"
                      : "bg-gradient-to-t from-rose-600/80 to-rose-500/80 hover:from-rose-600 hover:to-rose-500"
                  }`} 
                  style={{ 
                    height: `${(segment.status === "up" ? 100 : segment.status === "warning" ? 60 : 30)}%`,
                  }}
                >
                  <div className="w-full h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-200"></div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-800 border-gray-700 text-white">
                <div className="flex items-center gap-2 py-1">
                  {getStatusIcon(segment.status)}
                  <span>{getStatusText(segment.status)}</span>
                  <span className="text-gray-400 text-xs">
                    {formatTime(i, statusHistory.length)}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{hoursToShow ? `${hoursToShow} hours ago` : minutesToShow ? `${minutesToShow} min ago` : ''}</span>
        <span>Now</span>
      </div>
    </div>
  );
};

export default StatusHistoryTicks;