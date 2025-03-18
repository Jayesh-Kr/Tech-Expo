import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusHistoryProps {
  statusHistory: {
    status: "up" | "down";
    length: number;
  }[];
}

const StatusHistory: React.FC<StatusHistoryProps> = ({ statusHistory }) => {
  return (
    <Card className="mb-6 animate-slide-up [animation-delay:100ms]">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Status History (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-0.5">
          <TooltipProvider>
            {statusHistory.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={`h-7 w-2 ${
                      item.status === "up" ? "bg-green-500" : "bg-red-500"
                    } rounded-sm`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    {item.status === "up" ? "Online" : "Offline"}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusHistory;
