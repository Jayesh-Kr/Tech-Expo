import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Clock, Calendar, Globe, Server } from "lucide-react";

interface MonitorDetailsProps {
  checkFrequency?: number;
}

const MonitorDetails = ({ checkFrequency = 60 }: MonitorDetailsProps) => {
  return (
    <Card className="animate-slide-up [animation-delay:200ms]">
      <CardHeader>
        <CardTitle className="text-lg">Monitor Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>Check Frequency</span>
          </div>
          <span>{checkFrequency} seconds</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Last Checked</span>
          </div>
          <span>Just now</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-muted-foreground">
            <Globe className="h-4 w-4 mr-2" />
            <span>Regions</span>
          </div>
          <span>4 locations</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-muted-foreground">
            <Server className="h-4 w-4 mr-2" />
            <span>Nodes</span>
          </div>
          <span>12 nodes</span>
        </div>
        
        <div className="pt-2">
          <Button variant="outline" className="w-full">
            View Full Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonitorDetails;
