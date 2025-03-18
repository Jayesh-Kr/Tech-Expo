
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MonitorHeader from "@/components/monitor/MonitorHeader";
import StatusHistory from "@/components/monitor/StatusHistory";
import MonitorStats from "@/components/monitor/MonitorStats";
import DetailsDashboard from "@/components/monitor/DetailsDashboard";

const generateMockMonitorData = (id: string) => {
  const status = id === "3" ? "down" : id === "4" ? "warning" : "up";
  const uptime = status === "up" ? 99.98 : status === "warning" ? 98.45 : 94.32;
  
  const chartData = Array(24).fill(null).map((_, i) => {
    const baseTime = status === "up" ? 180 : status === "warning" ? 350 : 500;
    const time = baseTime + Math.random() * 200 * (i < 12 ? (12-i)/12 : 0.2);
    return {
      name: `${23-i}h`,
      responseTime: Math.round(time),
    };
  }).reverse();

  return {
    id,
    name: id === "1" ? "API Service" : 
          id === "2" ? "Marketing Website" : 
          id === "3" ? "Database Cluster" : 
          "Payment Service",
    url: id === "1" ? "https://api.example.com" : 
         id === "2" ? "https://www.example.com" : 
         id === "3" ? "db.example.com:5432" : 
         "https://payments.example.com",
    status: status as "up" | "down" | "warning",
    uptimePercentage: uptime,
    responseTime: chartData[chartData.length - 1].responseTime,
    statusHistory: Array(30).fill(null).map(() => ({
      status: Math.random() > (status === "up" ? 0.05 : status === "warning" ? 0.1 : 0.2) 
        ? ("up" as const) 
        : ("down" as const),
      length: 1,
    })),
    chartData,
    lastChecked: new Date().toISOString(),
    certExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    checkFrequency: 60,
    avgResponseTime: chartData.reduce((sum, item) => sum + item.responseTime, 0) / chartData.length,
  };
};

const Monitor = () => {
  const { id = "1" } = useParams<{ id: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  
  const monitor = generateMockMonitorData(id);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleDelete = (monitorId: string) => {
    console.log(`Deleting monitor with ID: ${monitorId}`);
    navigate('/dashboard');
    toast.success(`Monitor "${monitor.name}" has been deleted.`);
  };

  return (
    <div className="min-h-screen pt-16 pb-12 animate-fade-in bg-gradient-to-b from-background to-background/95">
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <MonitorHeader 
          monitor={monitor} 
          isRefreshing={isRefreshing} 
          onRefresh={handleRefresh} 
          onDelete={handleDelete} 
        />

        <StatusHistory statusHistory={monitor.statusHistory} />

        <MonitorStats 
          responseTime={monitor.responseTime} 
          avgResponseTime={monitor.avgResponseTime} 
          uptimePercentage={monitor.uptimePercentage} 
        />

        <DetailsDashboard monitor={monitor} />
      </div>
    </div>
  );
};

export default Monitor;
