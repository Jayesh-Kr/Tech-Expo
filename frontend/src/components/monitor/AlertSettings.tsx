
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AlertSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alert Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-danger mr-2" />
              <span>Downtime</span>
            </div>
            <span>Enabled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-warning mr-2" />
              <span>Response Time &gt; 500ms</span>
            </div>
            <span>Enabled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-info mr-2" />
              <span>Certificate Expiry &lt; 7 days</span>
            </div>
            <span>Enabled</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-muted mr-2" />
              <span>Status Code Change</span>
            </div>
            <span>Disabled</span>
          </div>
          
          <div className="pt-2">
            <Button variant="outline" className="w-full">
              Manage Alerts
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
