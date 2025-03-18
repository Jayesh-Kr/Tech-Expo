import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";
import StatusIndicator from "./monitor/StatusIndicator";

interface MonitorCardProps {
  monitor: {
    id: string;
    name: string;
    url: string;
    status: "up" | "down" | "warning";
    uptimePercentage: number;
    responseTime: number;
    statusHistory: { status: "up" | "down"; length: number }[];
  };
}

const MonitorCard: React.FC<MonitorCardProps> = ({ monitor }) => {
  const statusText = {
    up: "Operational",
    down: "Down",
    warning: "Degraded",
  };

  const statusColor = {
    up: "text-green-500",
    down: "text-red-500",
    warning: "text-yellow-500",
  };

  // Create a simple representation of uptime chart without additional components
  const UptimeChart = ({ statusHistory }: { statusHistory: { status: "up" | "down"; length: number }[] }) => (
    <div className="flex h-full">
      {statusHistory.map((segment, i) => (
        <div 
          key={i}
          className={`flex-1 ${segment.status === "up" ? "bg-green-500/20" : "bg-red-500/20"}`}
        />
      ))}
    </div>
  );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <StatusIndicator status={monitor.status} size="md" pulse={monitor.status !== "up"} />
              <h3 className="text-lg font-semibold ml-2">{monitor.name}</h3>
            </div>
            <span className={`${statusColor[monitor.status]} text-sm font-medium`}>
              {statusText[monitor.status]}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 truncate">{monitor.url}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Uptime</p>
              <p className="text-xl font-medium">{monitor.uptimePercentage.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Response</p>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-blue-400" />
                <p className="text-xl font-medium">{monitor.responseTime}ms</p>
              </div>
            </div>
          </div>

          <div className="h-16 mb-1">
            <UptimeChart statusHistory={monitor.statusHistory} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-3">
        <Link 
          to={`/monitor/${monitor.id}`}
          className="text-sm text-muted-foreground hover:text-foreground w-full flex justify-between items-center transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MonitorCard;
