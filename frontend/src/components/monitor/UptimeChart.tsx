import React from "react";

interface UptimeChartProps {
  statusHistory: {
    status: "up" | "down";
    length: number;
  }[];
}

const UptimeChart: React.FC<UptimeChartProps> = ({ statusHistory }) => {
  return (
    <div className="w-full h-full flex items-end">
      {statusHistory.map((item, index) => (
        <div
          key={index}
          className="flex-1 h-full flex items-end"
          style={{ minWidth: '3px' }}
        >
          <div
            className={`w-full rounded-sm ${
              item.status === "up" ? "bg-green-500/30" : "bg-red-500/30"
            }`}
            style={{
              height: `${item.status === "up" ? "100" : "30"}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default UptimeChart;
