import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Globe, Clock, Shield, Server, CheckCircle, BellRing, ExternalLink } from "lucide-react";
import StatusHistoryTicks from "./StatusHistoryTicks";
import { Badge } from "../ui/badge";

interface SimpleMonitorDetailsProps {
  name?: string;
  url?: string;
  checkFrequency?: number;
  regions?: string[];
  statusHistory?: { status: "up" | "down" | "warning"; length: number }[];
}

const SimpleMonitorDetails: React.FC<SimpleMonitorDetailsProps> = ({
  name = "Website",
  url = "https://example.com",
  checkFrequency = 20,
  regions = ["US West", "Europe", "Asia"],
  statusHistory = []
}) => {
  return (
    <Card className="bg-gray-800/40 border border-gray-700 h-full hover:border-gray-600 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-75"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-600/30 flex items-center justify-center">
            <Globe className="h-3.5 w-3.5 text-blue-400" />
          </div>
          Monitor Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 hover:border-green-500/30 hover:bg-gray-900/70 transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Current Status
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              <div className="text-green-500 text-sm font-medium">Operational</div>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border border-green-500/30">
              99.98% Uptime
            </Badge>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 text-sm hover:underline flex items-center group transition-all"
            >
              <Globe className="h-3 w-3 mr-1.5" />
              {url}
              <ExternalLink className="h-3 w-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 hover:border-blue-500/30 hover:bg-gray-900/70 transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            24h Timeline
          </h3>
          <StatusHistoryTicks 
            statusHistory={statusHistory}
            hoursToShow={24}
          />
        </div>
        
        <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 hover:border-indigo-500/30 hover:bg-gray-900/70 transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            Monitor Configuration
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400 flex items-center">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                  <Clock className="h-3 w-3 text-blue-400" />
                </div>
                Check Frequency
              </div>
              <Badge variant="outline" className="font-mono bg-blue-500/10 border-blue-500/30 text-blue-400">
                {checkFrequency}s
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400 flex items-center">
                <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center mr-2">
                  <BellRing className="h-3 w-3 text-amber-400" />
                </div>
                Alert Threshold
              </div>
              <Badge variant="outline" className="font-mono bg-amber-500/10 border-amber-500/30 text-amber-400">
                30s
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400 flex items-center">
                <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">
                  <Shield className="h-3 w-3 text-indigo-400" />
                </div>
                SSL Monitoring
              </div>
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                Enabled
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400 flex items-center">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2">
                  <Server className="h-3 w-3 text-emerald-400" />
                </div>
                Check Locations
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {regions.map((region, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-800 text-gray-300 text-xs border border-gray-700">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleMonitorDetails;