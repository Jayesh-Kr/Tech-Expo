import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AlertCircle, ArrowLeft, Bell, CheckCircle, Clock, Cpu, Globe, Server, Shield, XCircle } from "lucide-react";
import ResponseTimeChart from "./ResponseTimeChart";
import StatusHistory from "./StatusHistory";
import MonitorStats from "./MonitorStats";
import RecentEvents from "./RecentEvents";
import MonitorHeader from "./MonitorHeader";
import PerformanceMetrics from "./PerformanceMetrics";

// Mock data for the monitor (in a real app, this would come from your API)
const generateMockData = (id) => {
  // Create a mock monitor with the given ID
  const isUp = Math.random() > 0.1; // 90% chance of being up
  const uptime = isUp ? 99.8 + (Math.random() * 0.19) : 90 + (Math.random() * 9);
  const responseTime = Math.floor(Math.random() * 200) + 100;
  
  // Generate status history (last 30 days)
  const statusHistory = Array(30).fill(null).map(() => ({
    status: Math.random() > 0.05 ? "up" : "down",
    length: 1
  }));
  
  // Generate response time history (last 24 hours)
  const responseTimeHistory = Array(24).fill(null).map((_, i) => ({
    name: `${i}:00`,
    responseTime: Math.floor(Math.random() * 300) + 80
  }));
  
  // Generate recent events
  const recentEvents = [
    { 
      id: 1, 
      type: "down", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), 
      duration: "3m 24s",
      message: "Connection timeout"
    },
    { 
      id: 2, 
      type: "up", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8 - 1000 * 60 * 3.4), 
      duration: "3m 24s",
      message: "Service restored" 
    },
    { 
      id: 3, 
      type: "warning", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), 
      duration: null,
      message: "Slow response time (432ms)" 
    },
    { 
      id: 4, 
      type: "info", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), 
      duration: null,
      message: "Scheduled maintenance" 
    }
  ];
  
  return {
    id,
    name: "Production API",
    url: "https://api.yourdomain.com",
    status: isUp ? "up" : "down",
    uptimePercentage: uptime,
    responseTime,
    checkFrequency: 60,
    statusHistory,
    responseTimeHistory,
    recentEvents,
    monitoringSince: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
    regions: ["North America", "Europe", "Asia", "Australia"],
    checks: {
      total: 129600, // 90 days * 24 hours * 60 checks
      success: Math.floor(129600 * (uptime / 100)),
      failed: Math.floor(129600 * (1 - uptime / 100))
    },
    alertsEnabled: true,
    alertChannels: ["Email", "Slack", "SMS"]
  };
};

const MonitorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading monitor data
    setLoading(true);
    setTimeout(() => {
      setMonitor(generateMockData(id));
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!monitor) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Monitor Not Found</h2>
          <p className="text-gray-400 mb-8">The monitor you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Format the monitoring since date
  const formatMonitoringSince = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };
  
  const formatUptimePercentage = (percentage) => {
    return percentage.toFixed(3);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Removed back button and page title - Added mt-10 to create more space from navbar */}
      <div className="mb-6">
        <MonitorHeader
          name={monitor.name}
          url={monitor.url}
          status={monitor.status}
          uptimePercentage={monitor.uptimePercentage}
        />
      </div>
      
      {/* Status indicator and quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gray-800/40 border-gray-700 animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400">Status</p>
              <Badge 
                className={`${
                  monitor.status === "up" 
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" 
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                }`}
              >
                {monitor.status === "up" ? "Operational" : "Down"}
              </Badge>
            </div>
            <div className="flex items-center">
              {monitor.status === "up" ? (
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500 mr-3" />
              )}
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatUptimePercentage(monitor.uptimePercentage)}%
                </p>
                <p className="text-xs text-gray-400">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 border-gray-700 animate-slide-up [animation-delay:100ms]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400">Response Time</p>
              <Badge 
                className={`${
                  monitor.responseTime < 200 
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" 
                    : monitor.responseTime < 500 
                    ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                }`}
              >
                {monitor.responseTime < 200 ? "Fast" : monitor.responseTime < 500 ? "Average" : "Slow"}
              </Badge>
            </div>
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">{monitor.responseTime}ms</p>
                <p className="text-xs text-gray-400">Average</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 border-gray-700 animate-slide-up [animation-delay:200ms]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400">Monitoring Since</p>
              <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                Active
              </Badge>
            </div>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">{formatMonitoringSince(monitor.monitoringSince)}</p>
                <p className="text-xs text-gray-400">{monitor.checks.total.toLocaleString()} checks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/40 border-gray-700 animate-slide-up [animation-delay:300ms]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-400">Monitoring Regions</p>
              <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                {monitor.regions.length}
              </Badge>
            </div>
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-500 mr-3" />
              <div className="flex flex-wrap gap-1">
                {monitor.regions.map((region, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content without tabs */}
      <div className="space-y-6">
        {/* Status Timeline */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/70 p-6 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
              Status Timeline
            </h2>
            <p className="text-sm text-gray-400">Last 30 minutes of monitoring data</p>
          </div>
          <StatusHistory statusHistory={monitor.statusHistory} />
        </div>

        {/* Monitor Stats */}
        <MonitorStats 
          responseTime={monitor.responseTime} 
          avgResponseTime={monitor.avgResponseTime || monitor.responseTime}
          uptimePercentage={monitor.uptimePercentage} 
          status={monitor.status}
        />

        {/* Response Time Chart */}
        <Card className="bg-gray-800/40 border-gray-700 hover:border-gray-600 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-400" />
              Response Time Monitor
            </CardTitle>
            <CardDescription>Real-time data refreshing every minute</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponseTimeChart refreshInterval={60000} />
          </CardContent>
        </Card>

        {/* Two-column layout for additional info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentEvents events={monitor.recentEvents} />
          
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Monitor Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Check Frequency</span>
                </div>
                <span className="text-white">{monitor.checkFrequency} seconds</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-400">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Successful Checks</span>
                </div>
                <span className="text-white">{monitor.checks.success.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-400">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>Failed Checks</span>
                </div>
                <span className="text-white">{monitor.checks.failed.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-400">
                  <Server className="h-4 w-4 mr-2" />
                  <span>Nodes</span>
                </div>
                <span className="text-white">12 nodes</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-400">
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Alerts</span>
                </div>
                <span className="flex items-center text-white">
                  {monitor.alertsEnabled ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />
                      Disabled
                    </>
                  )}
                </span>
              </div>
              
              {monitor.alertsEnabled && (
                <div className="pt-2">
                  <p className="text-sm text-gray-400 mb-2">Alert Channels</p>
                  <div className="flex flex-wrap gap-2">
                    {monitor.alertChannels.map((channel, index) => (
                      <Badge key={index} className="bg-gray-700 text-gray-300">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics 
          responseTime={monitor.responseTime}
          previousResponseTime={monitor.avgResponseTime}
          uptime={monitor.uptimePercentage}
        />
      </div>
    </div>
  );
};

export default MonitorDetails;
