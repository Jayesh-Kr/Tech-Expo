import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusIndicator from "./StatusIndicator";

const RecentEvents = () => {
  return (
    <Card className="animate-slide-up [animation-delay:400ms]">
      <CardHeader>
        <CardTitle className="text-lg">Recent Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Math.random() > 0.3 ? (
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <StatusIndicator status="up" size="sm" />
            </div>
            <div>
              <p className="font-medium">All systems operational</p>
              <p className="text-sm text-muted-foreground">No incidents reported in the last 24 hours</p>
              <p className="text-xs text-muted-foreground mt-1">Just now</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <StatusIndicator status="down" size="sm" />
            </div>
            <div>
              <p className="font-medium">Service disruption detected</p>
              <p className="text-sm text-muted-foreground">The service was down for 3 minutes</p>
              <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">
            <StatusIndicator status="warning" size="sm" />
          </div>
          <div>
            <p className="font-medium">Elevated response time</p>
            <p className="text-sm text-muted-foreground">Response time increased by 120ms</p>
            <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEvents;
