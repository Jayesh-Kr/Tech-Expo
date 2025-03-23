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
  id: string; // Use _id from the backend response
  type: 'up' | 'down' | 'warning' | 'info';
  createdAt: string; // Use createdAt from the backend response
  duration: string | null;
  message: string; // Use location or other fields for the message
}

interface RecentEventsProps {
  events: Event[];
}

const RecentEvents: React.FC<RecentEventsProps> = ({ events }) => {
  
  const formatTime = (dateString: string | undefined | null) => {
    // If the dateString is undefined or null, return "N/A"
    if (!dateString) {
      return "N/A";
    }

    // Try to parse the date string
    const parsedDate = new Date(dateString);
    
    // If the date is invalid, manually extract date and time from the string
    if (isNaN(parsedDate.getTime())) {
      // Extract date and time from the string (format: 2025-03-19T21:07:15.308Z)
      const [datePart, timePart] = dateString.split('T');
      if (!datePart || !timePart) {
        return "Invalid date";
      }
      const time = timePart.split('.')[0]; // Remove milliseconds
      return `${datePart} ${time}`; // Return as "2025-03-19 21:07:15"
    }

    // If the date is valid, calculate the time difference
    const now = new Date();
    const diffMs = now.getTime() - parsedDate.getTime();
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
           <p className='text-white text-[20px]'>Recent Events</p>
        </CardTitle>
        <CardDescription><p className='text-[#9CA3AF]'>Latest incidents and status changes</p></CardDescription>
      </CardHeader>
      
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-white" />
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
                <div className={`absolute left-[-6px] top-2 h-5 w-5 rounded-full flex items-center justify-center z-10 `}>
                  <XCircle className="h-4 w-4 text-red-400" />
                </div>
                
                <div className="mb-1 flex items-center justify-between">
                  <h4 className={`text-sm font-medium text-red-400`}>
                    {event.type === 'up' ? 'Service Restored' :
                     event.type === 'warning' ? 'Service Outage' : "Server Down"
                     }
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs border-gray-700 bg-gray-800/50 text-gray-400"
                    >
                      {formatTime(event.createdAt)}
                      {/* {event.createdAt} */}
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
      </CardContent>
    </Card>
  );
};

export default RecentEvents;