import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { Badge } from "../ui/badge";
import { AlertCircle, TrendingDown, TrendingUp, ArrowRight, Clock } from "lucide-react";

interface ResponseTimeChartProps {
  initialData?: { name: string; responseTime: number }[];
  refreshInterval?: number; // in milliseconds
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ 
  initialData = [],
  refreshInterval = 1200 * 1000 // Exactly 1 minute (60000ms)
}) => {
  const [data, setData] = useState<{ name: string; responseTime: number; timestamp: Date }[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const formatTimeString = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const generateRealisticResponseTime = useCallback((prevValue = 200) => {
    const variation = Math.floor(Math.random() * 40) - 20; // -20 to +20 ms variation
    const hasSpike = Math.random() < 0.1;
    const spikeAmount = hasSpike ? (Math.random() * 100) + 50 : 0;
    return Math.max(50, Math.min(500, prevValue + variation + spikeAmount));
  }, []);
  
  useEffect(() => {
    if (initialData.length > 0) {
      const now = new Date();
      const enhancedData = initialData.map((item, index) => ({
        ...item,
        timestamp: new Date(now.getTime() - (initialData.length - 1 - index) * 60000)
      }));
      setData(enhancedData);
    } 
    else {
      // const now = new Date();
      // let prevValue = 200;
      
      // const initialPoints = Array(10).fill(null).map((_, i) => {
      //   const pointTime = new Date(now.getTime() - (9 - i) * 60000);
      //   prevValue = generateRealisticResponseTime(prevValue);
      //   return {
      //     name: formatTimeString(pointTime),
      //     responseTime: prevValue,
      //     timestamp: pointTime
      //   };
      // });
      
      // setData(initialPoints);
      setData([]);
    }
    // setLastUpdated(new Date());
  }, [initialData, generateRealisticResponseTime]);
  
  // useEffect(() => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }

  //   const updateData = () => {
  //     const now = new Date();
  //     const newResponseTime = generateRealisticResponseTime(
  //       data.length > 0 ? data[data.length - 1].responseTime : 200
  //     );
      
  //     const newPoint = {
  //       name: formatTimeString(now),
  //       responseTime: newResponseTime,
  //       timestamp: now
  //     };
      
  //     setData(prevData => [...prevData.slice(-9), newPoint]);
  //     setLastUpdated(now);
      
  //     console.log(`Chart updated at ${now.toLocaleTimeString()} with value ${newResponseTime}ms`);
  //   };
    
  //   const calculateNextMinute = () => {
  //     const now = new Date();
  //     const secondsToNextMinute = 60 - now.getSeconds();
  //     const msToNextMinute = secondsToNextMinute * 1000 - now.getMilliseconds();
  //     return msToNextMinute;
  //   };
    
  //   const initialTimeoutId = setTimeout(() => {
  //     updateData();
      
  //     const intervalId = setInterval(updateData, refreshInterval);
  //     intervalRef.current = intervalId;
      
  //     console.log(`Set up interval timer: ${refreshInterval}ms`);
  //   }, calculateNextMinute());
    
  //   const initialTimeoutRef = initialTimeoutId;
    
  //   return () => {
  //     clearTimeout(initialTimeoutRef);
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };
  // }, []); // Empty dependency array to run only once on mount
  
  const currentValue = data[data.length - 1]?.responseTime || 0;
  const previousValue = data[data.length - 2]?.responseTime || 0;
  const averageValue = Math.round(data.reduce((sum, item) => sum + item.responseTime, 0) / (data.length || 1));
  const maxValue = Math.max(...data.map(item => item.responseTime), 400);
  
  const threshold = averageValue * 1.5;
  const anomalies = data.filter(item => item.responseTime > threshold);
  const trend = currentValue < previousValue ? 'down' : currentValue > previousValue ? 'up' : 'stable';
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const timestamp = payload[0].payload.timestamp;
      const isAnomaly = value > threshold;
      
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-md p-3 shadow-md">
          <p className="text-sm text-gray-300">
            {`Time: ${formatTimeString(timestamp)}`}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <p className={`text-base font-semibold ${isAnomaly ? 'text-red-400' : 'text-blue-400'}`}>
              {`${value}ms`}
            </p>
            {isAnomaly && <AlertCircle className="h-3.5 w-3.5 text-red-400" />}
          </div>
          {isAnomaly && (
            <p className="text-xs text-red-400 mt-1">Abnormal response time detected</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  const customizedDot = (props: any) => {
    const { cx, cy, index, payload } = props;
    const isAnomaly = payload.responseTime > threshold;
    const isHovered = hoveredPoint === index;
    
    if (isAnomaly) {
      return (
        <circle
          key={`dot-${index}`}
          cx={cx}
          cy={cy}
          r={isHovered ? 6 : 4}
          fill="#f87171"
          stroke="#fef2f2"
          strokeWidth={1}
          className="transition-all duration-200"
        />
      );
    }
    
    return (
      <circle
        key={`dot-${index}`}
        cx={cx}
        cy={cy}
        r={isHovered ? 4 : 3}
        fill="#60a5fa"
        className="transition-all duration-200"
      />
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center">
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-base font-medium text-white">Response Time</h3>
          </div>
          <p className="text-sm text-gray-400">
            Last 10 minutes (updates every minute)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gray-700 border-gray-600 text-gray-300">
            Current: <span className="font-mono ml-1 text-blue-400">{currentValue}ms</span>
          </Badge>
          <Badge className="bg-gray-700 border-gray-600 text-gray-300">
            Average: <span className="font-mono ml-1 text-indigo-400">{averageValue}ms</span>
          </Badge>
        </div>
      </div>
      
      <div className="w-full h-[300px] overflow-hidden">
        <ResponsiveContainer width="99%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
            onMouseMove={(e) => {
              if (e.activeTooltipIndex !== undefined) {
                setHoveredPoint(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="responseTimeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              tick={{ fill: '#9ca3af' }} 
              tickLine={{ stroke: '#4b5563' }}
              tickMargin={8}
            />
            <YAxis 
              stroke="#9ca3af" 
              style={{ fontSize: '12px' }} 
              tick={{ fill: '#9ca3af' }} 
              tickLine={{ stroke: '#4b5563' }}
              domain={[0, (maxValue * 1.2) || 400]}
              tickFormatter={(value) => `${value}ms`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={averageValue} stroke="#818cf8" strokeDasharray="3 3" label={{ value: 'Avg', position: 'left', fill: '#818cf8', fontSize: 12 }} />
            {threshold < maxValue * 1.2 && (
              <ReferenceLine y={threshold} stroke="#f87171" strokeDasharray="3 3" label={{ value: 'Threshold', position: 'right', fill: '#f87171', fontSize: 12 }} />
            )}
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={customizedDot}
              activeDot={{ r: 6, stroke: '#bfdbfe', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="bg-gray-800/50 text-gray-400">
          10-minute window
        </Badge>
        <Badge variant="outline" className="bg-gray-800/50 text-gray-400">
          Next update in: {60 - new Date().getSeconds()}s
        </Badge>
      </div>
    </div>
  );
};

export default ResponseTimeChart;