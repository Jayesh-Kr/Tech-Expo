
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UptimeChartProps {
  data: Array<{
    name: string;
    responseTime: number;
  }>;
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-success">{`${payload[0].value} ms`}</p>
      </div>
    );
  }

  return null;
};

const UptimeChart = ({ data, className }: UptimeChartProps) => {
  return (
    <div className={`chart-container ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="name" 
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <YAxis 
            tickCount={7}
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="responseTime"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#responseTimeGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UptimeChart;
