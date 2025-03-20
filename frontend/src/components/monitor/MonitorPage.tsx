import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import StatusHistoryTicks from "./StatusHistoryTicks";
import MonitorStats from "./MonitorStats";
import SimpleMonitorDetails from "./SimpleMonitorDetails";
import ResponseTimeChart from "./ResponseTimeChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  ArrowLeft, 
  CheckCircle, 
  Pause, 
  Pencil, 
  Repeat, 
  Trash2, 
  RefreshCw, 
  Bell, 
  MoreHorizontal,
  Globe,
  Clock,
  Activity,
  Server,
  AlertCircle,
  Cpu,
  ExternalLink,
  Share2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// This component demonstrates the monitor UI similar to the screenshot
const MonitorPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  // Generate mock status history data for the last 30 minutes
  const generateMockStatusHistory = () => {
    const statusHistory = [];
    
    // Using length-based approach instead of timestamp for compatibility
    let currentLength = 0;
    const totalMinutes = 30; // Last 30 minutes
    
    while (currentLength < totalMinutes) {
      // Decide if this segment is "up" or "down"
      const isUp = Math.random() > 0.05; // 5% chance of being down
      
      // Determine length of this segment
      let segmentLength;
      if (isUp) {
        // "Up" segments are between 3-10 minutes
        segmentLength = Math.floor(Math.random() * 7) + 3;
      } else {
        // "Down" segments are shorter (1-3 minutes)
        segmentLength = Math.floor(Math.random() * 3) + 1;
      }
      
      // Make sure we don't exceed total length
      segmentLength = Math.min(segmentLength, totalMinutes - currentLength);
      
      // Add segment to status history
      statusHistory.push({
        status: isUp ? "up" : "down",
        length: segmentLength
      });
      
      currentLength += segmentLength;
    }
    
    return statusHistory;
  };
  
  // Generate mock response time data
  const generateMockResponseTimeData = () => {
    const data = [];
    
    for (let hour = 0; hour < 24; hour++) {
      // Let's create a pattern where it's faster in the morning and slower at night
      let baseResponseTime;
      
      if (hour < 8) {
        baseResponseTime = 300; // Overnight: higher response times
      } else if (hour < 18) {
        baseResponseTime = 200; // Daytime: lower response times
      } else {
        baseResponseTime = 250; // Evening: medium response times
      }
      
      // Add some randomness
      const randomVariation = Math.floor(Math.random() * 100);
      
      data.push({
        name: `${hour}:00`,
        responseTime: baseResponseTime + randomVariation
      });
    }
    
    // Add a more dramatic spike at some point
    const spikeHour = Math.floor(Math.random() * data.length);
    data[spikeHour].responseTime = Math.floor(Math.random() * 600) + 800;
    
    return data;
  };
  
  const statusHistory = generateMockStatusHistory();
  const responseTimeData = generateMockResponseTimeData();
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };
  
  return (
    <div className="min-h-screen pt-16 pb-12 animate-fade-in bg-gradient-to-b from-background/80 to-background/95">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] opacity-70"></div>
        <div className="absolute top-60 -left-40 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] opacity-70"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-6 mt-20">
        {/* Enhanced header card with pulse animation and better visuals */}
        <Card className="bg-gray-800/40 border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-purple-500/10 pointer-events-none"></div>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-500/30 to-emerald-400/20 rounded-full p-3 border border-green-500/20">
                    <Globe className="h-7 w-7 text-green-400" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Rohan</h1>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                      <CheckCircle className="h-3 w-3 mr-1.5" />
                      Operational
                    </Badge>
                  </div>
                  <a 
                    href="https://www.rohanm.tech/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 text-sm hover:underline flex items-center group transition-all"
                  >
                    <Globe className="h-3 w-3 mr-1.5" />
                    https://www.rohanm.tech/
                    <ExternalLink className="h-3 w-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 relative overflow-hidden hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all group"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all group"
                >
                  <Bell className="h-4 w-4 group-hover:text-amber-400 transition-colors" />
                  <span className="group-hover:text-amber-400 transition-colors">Alerts</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all group"
                >
                  <Pause className="h-4 w-4 group-hover:text-rose-400 transition-colors" />
                  <span className="group-hover:text-rose-400 transition-colors">Pause</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:border-gray-600 transition-all">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800/95 backdrop-blur-sm border-gray-700 text-gray-300 shadow-xl">
                    <DropdownMenuLabel>Monitor Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/70 focus:bg-gray-700/70 transition-colors">
                      <Pencil className="h-4 w-4 text-blue-400" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/70 focus:bg-gray-700/70 transition-colors">
                      <Repeat className="h-4 w-4 text-purple-400" />
                      <span>Clone</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/70 focus:bg-gray-700/70 transition-colors">
                      <Share2 className="h-4 w-4 text-indigo-400" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="flex items-center gap-2 text-rose-400 cursor-pointer hover:bg-rose-950/70 focus:bg-rose-950/70 transition-colors">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Enhanced status summary with animations and better layouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800/40 border-gray-700 hover:bg-gray-800/60 transition-colors group animate-fade-in [animation-delay:100ms]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 mb-1">Uptime</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">99.98%</span>
                  </div>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/40 border-gray-700 hover:bg-gray-800/60 transition-colors group animate-fade-in [animation-delay:150ms]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 mb-1">Response Time</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">187</span>
                    <span className="text-sm text-gray-400 ml-1">ms</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/40 border-gray-700 hover:bg-gray-800/60 transition-colors group animate-fade-in [animation-delay:200ms]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 mb-1">Check Frequency</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">20</span>
                    <span className="text-sm text-gray-400 ml-1">sec</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/40 border-gray-700 hover:bg-gray-800/60 transition-colors group animate-fade-in [animation-delay:250ms]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 mb-1">Monitoring Nodes</div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">3</span>
                    <span className="text-sm text-gray-400 ml-1">regions</span>
                  </div>
                </div>
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Server className="h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tab navigation for content sections */}
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg border border-gray-800 animate-fade-in [animation-delay:300ms]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-gray-800 text-white shadow-md' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'performance' 
                ? 'bg-gray-800 text-white shadow-md' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'settings' 
                ? 'bg-gray-800 text-white shadow-md' 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            }`}
          >
            Settings
          </button>
        </div>
        
        {/* Tab content */}
        <div className="space-y-6 animate-fade-in [animation-delay:350ms]">
          {activeTab === 'overview' && (
            <>
              {/* Status Timeline with improved styling */}
              <Card className="bg-gray-800/40 border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Status Timeline
                  </CardTitle>
                  <CardDescription>
                    Last 30 minutes of monitoring data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatusHistoryTicks statusHistory={statusHistory} minutesToShow={30} />
                </CardContent>
              </Card>
              
              {/* Grid layout for charts and details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-gray-800/40 border-gray-700 h-full hover:border-gray-600 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-purple-400" />
                        Response Time
                      </CardTitle>
                      <CardDescription>
                        24-hour response time history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponseTimeChart data={responseTimeData} />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 px-6">
                      <div className="text-xs text-gray-400 flex items-center">
                        <AlertCircle className="h-3.5 w-3.5 mr-1 text-amber-400" />
                        Spike of 812ms detected at 14:00 today - investigating
                      </div>
                    </CardFooter>
                  </Card>
                </div>
                
                <div>
                  <SimpleMonitorDetails 
                    name="Website"
                    url="https://www.rohanm.tech/"
                    checkFrequency={20}
                    regions={["US West", "Europe", "Asia"]}
                    statusHistory={statusHistory}
                  />
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'performance' && (
            <Card className="bg-gray-800/40 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  Performance Breakdown
                </CardTitle>
                <CardDescription>
                  Analysis of request components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-blue-600/50 hover:bg-gray-900/70 transition-all group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        DNS Lookup
                      </span>
                      <span className="text-sm font-medium text-white">12ms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-700 to-blue-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-purple-600/50 hover:bg-gray-900/70 transition-all group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        TCP Connection
                      </span>
                      <span className="text-sm font-medium text-white">28ms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-700 to-purple-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-emerald-600/50 hover:bg-gray-900/70 transition-all group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        TLS Handshake
                      </span>
                      <span className="text-sm font-medium text-white">42ms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-amber-600/50 hover:bg-gray-900/70 transition-all group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        Server Processing
                      </span>
                      <span className="text-sm font-medium text-white">187ms</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-700 to-amber-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-white text-base font-medium mb-4 flex items-center gap-2">
                      <Server className="h-4 w-4 text-blue-400" />
                      Regional Performance
                    </h3>
                    <div className="space-y-4">
                      {['US West', 'Europe', 'Asia'].map((region, index) => (
                        <div key={region} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:bg-gray-900/70 transition-all">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400 flex items-center gap-2">
                              <Globe className="h-4 w-4 text-indigo-400" />
                              {region}
                            </span>
                            <span className="text-sm font-medium text-white">
                              {160 + index * 20}ms
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? "bg-green-500" : 
                                index === 1 ? "bg-blue-500" : 
                                "bg-purple-500"
                              }`} 
                              style={{ width: `${60 - index * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-amber-400" />
                    Alert Settings
                  </CardTitle>
                  <CardDescription>
                    Configure notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Email Notifications</div>
                        <div className="text-xs text-gray-400">Send alerts to your email</div>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        id="emailToggle" 
                        className="sr-only" 
                        defaultChecked 
                      />
                      <label 
                        htmlFor="emailToggle" 
                        className="block bg-gray-700 w-12 h-6 rounded-full cursor-pointer transition-colors after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all peer-checked:after:translate-x-6 peer-checked:after:bg-white peer-checked:bg-amber-600"
                      ></label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Downtime Threshold</div>
                        <div className="text-xs text-gray-400">Alert after 30 seconds of downtime</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/40 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-rose-400">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Destructive actions for this monitor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-rose-900/50 bg-rose-950/20 rounded-lg">
                    <h3 className="text-base font-medium text-white mb-1">Delete this monitor</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Once deleted, all data associated with this monitor will be permanently removed.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Monitor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitorPage;