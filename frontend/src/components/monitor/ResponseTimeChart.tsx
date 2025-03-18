import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResponseTimeChartProps {
  data: { name: string; responseTime: number }[];
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ data }) => {
  return (
    <Card className="animate-slide-up [animation-delay:300ms]">
      <CardHeader>
        <CardTitle className="text-lg">Response Time (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                stroke="hsl(var(--muted-foreground))" 
                domain={['auto', 'auto']}
                label={{ 
                  value: 'ms', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '6px',
                }} 
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                dot={{ r: 3, fill: "hsl(var(--background))", strokeWidth: 2 }}
                name="Response Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseTimeChart;
