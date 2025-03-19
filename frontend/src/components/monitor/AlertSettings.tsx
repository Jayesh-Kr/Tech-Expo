import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Plus, 
  Clock, 
  AlarmClock,
  Trash2
} from 'lucide-react';

interface AlertSettingsProps {
  alertsEnabled: boolean;
  alertChannels: string[];
}

const AlertSettings: React.FC<AlertSettingsProps> = ({ 
  alertsEnabled, 
  alertChannels = [] 
}) => {
  const [isEnabled, setIsEnabled] = useState(alertsEnabled);
  const [channels, setChannels] = useState(alertChannels);
  
  const handleToggleAlerts = () => {
    setIsEnabled(!isEnabled);
  };
  
  const handleRemoveChannel = (channel: string) => {
    setChannels(channels.filter(c => c !== channel));
  };
  
  const getChannelIcon = (channel: string) => {
    switch(channel.toLowerCase()) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'slack':
        return <MessageSquare className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="bg-gray-800/40 border-gray-700 overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full -mt-20 -mr-20"></div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-amber-400" />
          Alert Settings
        </CardTitle>
        <CardDescription>Configure notifications for this monitor</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlarmClock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="font-medium text-white">Alert Notifications</div>
              <div className="text-sm text-gray-400">Get notified when status changes</div>
            </div>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={handleToggleAlerts} 
            className="data-[state=checked]:bg-amber-600"
          />
        </div>
        
        {isEnabled && (
          <>
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-white">Alert Delay</span>
                </div>
                <Badge className="bg-gray-700 text-gray-300">30 seconds</Badge>
              </div>
              
              <div className="bg-gray-900/70 rounded-lg p-3 text-xs text-gray-400">
                Alerts will be triggered after 30 seconds of continuous downtime to reduce false positives.
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Notification Channels</h3>
                <Button variant="outline" size="sm" className="h-7 gap-1 text-xs border-gray-700 hover:bg-gray-700">
                  <Plus className="h-3 w-3" />
                  Add Channel
                </Button>
              </div>
              
              <div className="space-y-2">
                {channels.map((channel) => (
                  <div 
                    key={channel} 
                    className="flex items-center justify-between py-2 px-3 bg-gray-800/70 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center">
                        {getChannelIcon(channel)}
                      </div>
                      <span className="text-sm text-gray-200">{channel}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => handleRemoveChannel(channel)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {channels.length === 0 && (
                  <div className="text-center py-6 text-gray-500 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
                    <Bell className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notification channels configured</p>
                    <p className="text-xs mt-1">Add channels to receive alerts</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
