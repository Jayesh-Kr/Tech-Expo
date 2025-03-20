import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Bell, 
  Settings, 
  Edit, 
  MoreHorizontal,
  Share2,
  Trash2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [monitor, setMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading monitor data
    setLoading(true);
    setTimeout(() => {
      setMonitor(generateMockMonitorData(id));
      setLoading(false);
    }, 600);
  }, [id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing monitor data...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Monitor data updated successfully!");
    }, 1500);
  };

  const handleDelete = () => {
    toast.success(`Monitor "${monitor?.name}" has been deleted.`);
    navigate('/dashboard');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-gray-700 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20"></div>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-50"></div>
              <div className="relative rounded-full h-4 w-4 bg-purple-500"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-400">Loading monitor data...</p>
        </div>
      </div>
    );
  }
  
  if (!monitor) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/30">
            <Trash2 className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Monitor Not Found</h2>
          <p className="text-gray-400 mb-8">The monitor you're looking for doesn't exist or has been deleted.</p>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-2"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12 animate-fade-in bg-gradient-to-b from-gray-900 to-black">
      {/* Fixed position background glow effects */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${
          monitor.status === "up" ? "bg-emerald-600" : 
          monitor.status === "warning" ? "bg-amber-600" : 
          "bg-rose-600"
        }`}></div>
        <div className="absolute top-60 -left-40 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-10"></div>
      </div>
      
      <div className="container px-4 py-8 max-w-7xl mx-auto relative z-10 mt-20">
        {/* Header section with improved actions */}
        <div className="flex justify-end gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="gap-2 border-gray-700 hover:bg-gray-800/70 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2 border-gray-700 hover:bg-gray-800/70 transition-all">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2 border-gray-700 hover:bg-gray-800/70 transition-all">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800/70 transition-all">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Monitor Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                  <Share2 className="h-4 w-4 mr-2 text-blue-400" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                  <Settings className="h-4 w-4 mr-2 text-gray-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <MonitorHeader
          name={monitor.name}
          url={monitor.url}
          status={monitor.status}
          uptimePercentage={monitor.uptimePercentage}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <div className="mt-8 mb-6 space-y-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/70 p-6 animate-slide-up">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                Status Timeline
              </h2>
              <p className="text-sm text-gray-400">Last 30 minutes of monitoring data</p>
            </div>
            <StatusHistory statusHistory={monitor.statusHistory} />
          </div>

          <MonitorStats 
            responseTime={monitor.responseTime} 
            avgResponseTime={monitor.avgResponseTime || monitor.responseTime}
            uptimePercentage={monitor.uptimePercentage} 
            status={monitor.status}
          />

          <DetailsDashboard monitor={monitor} />
        </div>
      </div>
    </div>
  );
};

export default Monitor;
