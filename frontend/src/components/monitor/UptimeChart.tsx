import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface UptimeChartProps {
  statusHistory: {
    status: "up" | "down";
    length: number;
  }[];
}

const UptimeChart: React.FC<UptimeChartProps> = ({ statusHistory }) => {
  // Function to determine date from index (assuming each status is one day)
  const getDateFromIndex = (index: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - (statusHistory.length - 1 - index));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative w-full h-full bg-gray-900/50 rounded-lg border border-gray-700 p-4">
      <div className="absolute top-0 left-0 w-full flex justify-between px-4 py-2 text-xs text-gray-400">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
      
      <div className="h-full pt-6 flex items-end gap-1">
        <TooltipProvider>
          {statusHistory.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="group relative flex-1 h-full flex items-end cursor-pointer transition-opacity hover:opacity-80"
                >
                  <div
                    className={`w-full rounded-sm transition-all group-hover:opacity-100 ${
                      item.status === "up" 
                        ? "bg-gradient-to-t from-emerald-500/90 to-emerald-400/40" 
                        : "bg-gradient-to-t from-rose-500/90 to-rose-400/40"
                    }`}
                    style={{
                      height: `${item.status === "up" ? 100 : 30}%`,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-800 border-gray-700 text-white">
                <div className="py-1 px-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        item.status === "up" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <span className="font-medium">
                      {item.status === "up" ? "Operational" : "Down"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-300">{getDateFromIndex(index)}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      
      {/* Add grid lines for better readability */}
      <div className="absolute inset-x-4 bottom-4 border-t border-gray-700/50 h-1/4"></div>
      <div className="absolute inset-x-4 bottom-4 border-t border-gray-700/50 h-2/4"></div>
      <div className="absolute inset-x-4 bottom-4 border-t border-gray-700/50 h-3/4"></div>
    </div>
  );
};

export default UptimeChart;
