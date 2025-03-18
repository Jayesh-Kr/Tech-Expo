import React from "react";
import { ArrowLeft, ExternalLink, MoreVertical, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusIndicator from "./StatusIndicator";

interface MonitorHeaderProps {
  monitor: {
    id: string;
    name: string;
    url: string;
    status: "up" | "down" | "warning";
  };
  isRefreshing: boolean;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

const MonitorHeader: React.FC<MonitorHeaderProps> = ({ 
  monitor, 
  isRefreshing, 
  onRefresh, 
  onDelete 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Link to="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StatusIndicator status={monitor.status} size="lg" pulse />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{monitor.name}</h1>
            <a 
              href={monitor.url.startsWith("http") ? monitor.url : `https://${monitor.url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors text-sm"
            >
              {monitor.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => window.location.href = `/monitor/${monitor.id}/edit`}>
                Edit Monitor
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => window.location.href = `/monitor/${monitor.id}/alerts`}>
                Configure Alerts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500" 
                onSelect={() => onDelete(monitor.id)}
              >
                Delete Monitor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MonitorHeader;
