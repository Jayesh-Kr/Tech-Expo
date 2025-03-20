import React from 'react';
import { AlertTriangle, XCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/button';

interface ErrorNotificationProps {
  type: 'error' | 'warning' | 'success';
  title: string;
  message: string;
  time?: string;
  onDismiss?: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  type,
  title,
  message,
  time = '2 minutes ago',
  onDismiss
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-950/30 border-red-800/30';
      case 'warning':
        return 'bg-amber-950/30 border-amber-800/30';
      case 'success':
        return 'bg-green-950/30 border-green-800/30';
    }
  };
  
  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-amber-400';
      case 'success':
        return 'text-green-400';
    }
  };
  
  return (
    <div className={`rounded-lg border ${getBgColor()} p-4 animate-slide-up`}>
      <div className="flex items-start">
        <div className={`mr-3 mt-0.5 ${getTextColor()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${getTextColor()}`}>{title}</h3>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          <div className="mt-1 text-sm text-gray-300">{message}</div>
        </div>
        
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-3 h-7 w-7 p-0 rounded-full text-gray-400 hover:text-gray-300 hover:bg-gray-700"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorNotification;
