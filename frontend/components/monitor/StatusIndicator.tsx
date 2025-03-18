import React from "react";

interface StatusIndicatorProps {
  status: "up" | "down" | "warning";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = "md", 
  pulse = false 
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusClasses = {
    up: "bg-green-500",
    down: "bg-red-500",
    warning: "bg-yellow-500",
  };

  return (
    <span className="relative flex h-3 w-3">
      <span className={`absolute inline-flex h-full w-full rounded-full ${statusClasses[status]} ${sizeClasses[size]}`}/>
      {pulse && (
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${statusClasses[status]} ${sizeClasses[size]} animate-ping`}/>
      )}
    </span>
  );
};

export default StatusIndicator;
