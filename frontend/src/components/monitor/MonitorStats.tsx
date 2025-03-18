import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";

interface MonitorStatsProps {
  responseTime: number;
  avgResponseTime: number;
  uptimePercentage: number;
}

const MonitorStats: React.FC<MonitorStatsProps> = ({ 
  responseTime, 
  avgResponseTime, 
  uptimePercentage 
}) => {
  const isResponseTimeBetter = responseTime <= avgResponseTime;

  return (
    <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-3">
      <Card className="animate-slide-up [animation-delay:150ms]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Response Time</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{responseTime}ms</p>
                <div className={`flex items-center text-xs ${isResponseTimeBetter ? 'text-green-500' : 'text-red-500'}`}>
                  {isResponseTimeBetter ? (
                    <>
                      <ArrowDown className="h-3 w-3" />
                      {Math.abs(avgResponseTime - responseTime).toFixed(0)}ms
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-3 w-3" />
                      {Math.abs(responseTime - avgResponseTime).toFixed(0)}ms
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up [animation-delay:200ms]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Average Response</p>
              <p className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</p>
            </div>
            <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-slide-up [animation-delay:250ms]">
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Uptime</p>
              <p className="text-2xl font-bold">{uptimePercentage.toFixed(2)}%</p>
            </div>
            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <ArrowUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitorStats;
