import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface StatusHistoryProps {
  statusHistory: { status: "up" | "down" | "warning"; length: number }[];
}

const StatusHistory: React.FC<StatusHistoryProps> = ({ statusHistory }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  const upCount = statusHistory.filter(s => s.status === "up").length;
  const downCount = statusHistory.filter(s => s.status === "down").length;
  const warningCount = statusHistory.filter(s => s.status === "warning").length;
  const uptimePercentage = (upCount / statusHistory.length) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-gray-800 border border-gray-700 text-gray-300 flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 text-green-400" />
            Uptime: <span className="font-medium text-green-400">{uptimePercentage.toFixed(2)}%</span>
          </Badge>
          
          {downCount > 0 && (
            <Badge className="bg-gray-800 border border-gray-700 text-gray-300 flex items-center gap-1.5">
              <XCircle className="h-3 w-3 text-red-400" />
              Outages: <span className="font-medium text-red-400">{downCount}</span>
            </Badge>
          )}
          
          {warningCount > 0 && (
            <Badge className="bg-gray-800 border border-gray-700 text-gray-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-yellow-400" />
              Degraded: <span className="font-medium text-yellow-400">{warningCount}</span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-gray-400 text-sm">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          Last 30 minutes
        </div>
      </div>
      
      <div className="h-24 w-full">
        <div className="flex h-full gap-px">
          {statusHistory.map((segment, idx) => (
            <TooltipProvider key={idx} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`flex-1 relative group cursor-pointer transition-all duration-300 ${
                      hoveredSegment === idx ? 'scale-y-110 z-10' : ''
                    }`}
                    onMouseEnter={() => setHoveredSegment(idx)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div 
                      className={`absolute bottom-0 w-full rounded-t-sm ${
                        segment.status === "up" 
                          ? "bg-gradient-to-t from-green-600 to-green-500" 
                          : segment.status === "warning"
                            ? "bg-gradient-to-t from-yellow-600 to-yellow-500"
                            : "bg-gradient-to-t from-red-600 to-red-500"
                      } ${hoveredSegment === idx ? 'opacity-100' : 'opacity-80'}`}
                      style={{ 
                        height: `${segment.status === "up" ? 100 : segment.status === "warning" ? 60 : 30}%`
                      }}
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 border-gray-700">
                  <div className="p-1 text-sm">
                    <div className="flex items-center mb-1">
                      {segment.status === "up" ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-400 mr-1.5" />
                      ) : segment.status === "warning" ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 mr-1.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-400 mr-1.5" />
                      )}
                      <span className={
                        segment.status === "up" ? "text-green-400" : 
                        segment.status === "warning" ? "text-yellow-400" : 
                        "text-red-400"
                      }>
                        {segment.status === "up" ? "Operational" : segment.status === "warning" ? "Degraded" : "Down"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {30 - idx} min ago
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all group">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Operational</div>
                <div className="text-lg font-medium text-white">{upCount} mins</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-400 group-hover:scale-110 transition-transform origin-right">{(upCount / statusHistory.length * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Degraded</div>
                <div className="text-lg font-medium text-white">{warningCount} mins</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{(warningCount / statusHistory.length * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Outages</div>
                <div className="text-lg font-medium text-white">{downCount} mins</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-400">{(downCount / statusHistory.length * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusHistory;