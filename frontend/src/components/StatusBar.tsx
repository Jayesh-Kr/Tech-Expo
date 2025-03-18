
import React from "react";

interface StatusBarProps {
  segments: Array<{
    status: "up" | "down";
    length: number;
  }>;
}

const StatusBar = ({ segments }: StatusBarProps) => {
  const totalLength = segments.reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="status-bar w-full">
      <div className="flex h-full items-center justify-between">
        {segments.map((segment, index) => {
          const width = `${(segment.length / totalLength) * 100}%`;
          
          return (
            <div
              key={index}
              className="flex items-center justify-center"
              style={{ width }}
            >
              <div 
                className={`h-5 w-1.5 mx-px rounded-full transition-all duration-300 ${
                  segment.status === "up" ? "bg-success/90" : "bg-danger/90"
                } ${segment.status === "up" ? "shadow-sm shadow-success/30" : "shadow-sm shadow-danger/30"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusBar;
