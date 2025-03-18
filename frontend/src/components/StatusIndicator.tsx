
import React from "react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "up" | "down" | "warning";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator = ({
  status,
  size = "md",
  showLabel = false,
  className,
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const statusClasses = {
    up: "bg-success",
    down: "bg-danger",
    warning: "bg-warning",
  };

  const statusLabel = {
    up: "Up",
    down: "Down",
    warning: "Warning",
  };

  const statusAnimation = {
    up: "animate-pulse-green",
    down: "animate-pulse-red",
    warning: "animate-pulse",
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          statusClasses[status],
          statusAnimation[status],
          className
        )}
      />
      {showLabel && (
        <span
          className={cn("text-sm font-medium", {
            "text-success": status === "up",
            "text-danger": status === "down",
            "text-warning": status === "warning",
          })}
        >
          {statusLabel[status]}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
