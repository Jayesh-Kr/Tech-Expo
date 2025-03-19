import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CheckCircle,
  XCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface Event {
  id: number;
  type: 'up' | 'down' | 'warning' | 'info';
  timestamp: Date;
  duration: string | null;
  message: string;
}

interface RecentEventsProps {
  events: Event[];
}

const RecentEvents: React.FC<RecentEventsProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'up':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <Card className="bg-gray-800/40 border-gray-700 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Recent Events
        </CardTitle>
        <CardDescription>Latest incidents and status changes</CardDescription>
      </CardHeader>
      
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">No events to display</p>
            <p className="text-xs text-gray-500 mt-1">Your monitor is running smoothly</p>
          </div>
        ) : (
          <div className="relative space-y-0">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className={`relative pl-8 pt-2 pb-4 ${
                  index !== events.length - 1 ? 'border-l border-gray-700 ml-3' : ''
                }`}
              >
                <div className={`absolute left-[-6px] top-2 h-5 w-5 rounded-full flex items-center justify-center z-10 ${
                  event.type === 'up' ? 'bg-green-500/20' : 
                  event.type === 'down' ? 'bg-red-500/20' : 
                  event.type === 'warning' ? 'bg-yellow-500/20' : 
                  'bg-blue-500/20'
                }`}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="mb-1 flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${
                    event.type === 'up' ? 'text-green-400' : 
                    event.type === 'down' ? 'text-red-400' : 
                    event.type === 'warning' ? 'text-yellow-400' : 
                    'text-blue-400'
                  }`}>
                    {event.type === 'up' ? 'Service Restored' :
                     event.type === 'down' ? 'Service Outage' :
                     event.type === 'warning' ? 'Performance Degraded' :
                     'Maintenance'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-gray-700 bg-gray-800/50 text-gray-400"
                    >
                      {formatTime(event.timestamp)}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-1">{event.message}</p>
                
                {event.duration && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>Duration: {event.duration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-2 mt-2 border-t border-gray-700">
          <Button variant="ghost" size="sm" className="w-full justify-center text-gray-400 hover:text-gray-200 gap-1 text-sm">
            View All Events
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEvents;
