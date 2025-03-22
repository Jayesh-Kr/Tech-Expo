import React, { useEffect, useState } from "react";
import { Plus, Search, Filter, BarChart, AlertCircle, Bell, Settings, ArrowRight, Clock, User, Cpu, X, Trash2, Power } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
// Button component (unchanged)
const Button = ({ children, onClick, className = "", variant = "default" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
    ${variant === "default" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg shadow-indigo-500/20" : 
      variant === "outline" ? "border border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white" : 
      variant === "ghost" ? "text-gray-300 hover:bg-gray-800 hover:text-white" : ""} ${className}`}
  >
    {children}
  </button>
);

// MonitorCard component (updated)
const MonitorCard = ({ monitor, onDelete, onToggle, isActive }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(monitor.id);
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle(monitor.id);
  };

  // Ensure averageLatencyPerMinute is defined
  const averageLatencyPerMinute = monitor.averageLatencyPerMinute || [];

  // Determine the status based on the last response
  const lastResponse = averageLatencyPerMinute[averageLatencyPerMinute.length - 1]?.averageLatency;
  const status = lastResponse === 0 ? "down" : "up";

  // Ensure uptimePercentage is defined
  const uptimePercentage = monitor.uptimePercentage || 0;

  return (
    <div className={`rounded-xl border ${isActive ? "border-gray-700 bg-gray-800/80" : "border-gray-700/50 bg-gray-800/40"} text-white shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-600 relative group`}>
      <a 
        href={`/monitor/${monitor.id}`}
        className={`block ${!isActive && "opacity-70"}`}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <span className="relative flex h-3 w-3 mr-3">
                <span 
                  className={`absolute inline-flex h-full w-full rounded-full ${
                    !isActive ? "bg-gray-500" :
                    status === "up" ? "bg-emerald-500" : 
                    "bg-rose-500"
                  }`}
                />
                {isActive && status !== "up" && (
                  <span 
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      "bg-rose-500"
                    } animate-ping`}
                  />
                )}
              </span>
              <h3 className="text-lg font-bold">{monitor.websiteName}</h3>
            </div>
            <span className={`${
              !isActive ? "bg-gray-500/10 text-gray-400 border-gray-500/20" :
              status === "up" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
              "bg-rose-500/10 text-rose-400 border-rose-500/20"
            } text-xs font-medium px-2.5 py-1 rounded-full border`}>
              {!isActive ? "Inactive" :
               status === "up" ? "Operational" : 
               "Down"}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handleDeleteClick}
              className="p-2 bg-gray-700/70 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
              title="Delete monitor"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleToggleClick}
              className={`p-2 rounded-lg transition-all shadow-sm z-10 ${
                isActive 
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300" 
                  : "bg-gray-700/70 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
              }`}
              title={isActive ? "Disable monitor" : "Enable monitor"}
            >
              <Power className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-400 mb-4 truncate">{monitor.url}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-lg bg-gray-900/80 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1 flex items-center">
                <Clock className="h-3 w-3 mr-1.5" />
                Uptime
              </p>
              <p className="text-xl font-bold">{isActive ? uptimePercentage.toFixed(2) : "0.00"}%</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/80 border border-gray-700">
              <p className="text-xs text-gray-400 mb-1 flex items-center">
                <Cpu className="h-3 w-3 mr-1.5" />
                Response
              </p>
              <div className="flex items-center">
                <p className="text-xl font-bold">{isActive ? monitor.response : "—"}ms</p>
              </div>
            </div>
          </div>
          
          <div className="h-16 mb-3 relative">
            <div className="absolute inset-0 flex items-end gap-0.5">
              {isActive ? averageLatencyPerMinute.slice(0, Math.min(50,averageLatencyPerMinute?.length || 0)).map((latencyData, i) => (
                <div 
                  key={i} // Add a unique key for each bar
                  style={{ height: `${latencyData.averageLatency > 0 ? Math.min(latencyData.averageLatency / 10, 100) : 10}%` }}
                  className={`flex-1 ${
                    latencyData.averageLatency === 0 
                      ? "bg-gradient-to-t from-rose-500/90 to-rose-400/50" 
                      : "bg-gradient-to-t from-emerald-500/90 to-emerald-400/50"
                  } rounded-t-sm`}
                />
              )) : (
                Array(30).fill(null).map((_, i) => (
                  <div 
                    key={i} // Add a unique key for each bar
                    style={{ height: `${Math.random() * 30 + 20}%` }}
                    className="flex-1 bg-gradient-to-t from-gray-500/30 to-gray-400/10 rounded-t-sm"
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="bg-gray-900 p-3 border-t border-gray-700 hover:bg-gray-800 transition-colors">
          <div className="text-sm text-gray-300 hover:text-white w-full flex justify-between items-center transition-colors">
            View Details
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </a>
    </div>
  );
};

// StatCard component (unchanged)
const StatCard = ({ title, value, icon, color }) => (
  <div className={`rounded-xl border p-5 shadow-lg backdrop-blur-sm ${
    color === "green" ? "bg-emerald-500/5 border-emerald-500/20" : 
    color === "red" ? "bg-rose-500/5 border-rose-500/20" : 
    color === "blue" ? "bg-indigo-500/5 border-indigo-500/20" : 
    color === "yellow" ? "bg-amber-500/5 border-amber-500/20" : ""}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <div className={`rounded-full p-1.5 ${
        color === "green" ? "bg-emerald-500/20 text-emerald-400" : 
        color === "red" ? "bg-rose-500/20 text-rose-400" : 
        color === "blue" ? "bg-indigo-500/20 text-indigo-400" : 
        color === "yellow" ? "bg-amber-500/20 text-amber-400" : ""
      }`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold text-white mt-2">{value}</p>
  </div>
);

// AddMonitor component (unchanged)
const AddMonitor = ({ isOpen, onClose, onAdd }) => {
  const {getToken} = useAuth();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");
    const token = await getToken();
    try {
      const response = await fetch("http://localhost:3000/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify({ websiteName: name, url }),
      });

      if (!response.ok) {
        throw new Error("Failed to add monitor");
      }

      const newMonitor = await response.json();
      onAdd(newMonitor);
      setName("");
      setUrl("");
      window.location.reload();
      onClose();
    } catch (error) {
      setError("Failed to add monitor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 pointer-events-none"></div>
        <button 
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>
        <form onSubmit={handleSubmit} className="p-8 relative z-10">
          <h2 className="text-2xl font-semibold mb-1 text-white">Add Monitor</h2>
          <p className="mb-6 text-gray-400">Enter the details of the website you want to monitor.</p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Monitor Name</label>
              <input 
                className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                placeholder="My Website" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">URL</label>
              <input 
                className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                placeholder="https://example.com" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-sm"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Monitor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const {getToken} = useAuth();
  const [isAddMonitorOpen, setIsAddMonitorOpen] = useState(false);
  const [monitors, setMonitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [monitorsActive, setMonitorsActive] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, monitorId: null, monitorName: "" });

  // Fetch data from the backend
  const fetchDashboardDetails = async () => {
    const token = await getToken();
    try {
      const response = await fetch("http://localhost:3000/dashboard-details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard details");
      }

      const data = await response.json();
      console.log(data);
      setMonitors(data.websites);
    } catch (error) {
      console.error("Error fetching dashboard details:", error);
    }
  };

  // Poll the backend every 1 minute
  useEffect(() => {
    fetchDashboardDetails(); // Initial fetch
    const interval = setInterval(fetchDashboardDetails, 60000); // Poll every 1 minute
    return () => clearInterval(interval);
  }, []);

  // Handle adding a new monitor
  const handleAddMonitor = (newMonitor) => {
    setMonitors([...monitors, newMonitor]);
  };

  // Handle deleting a monitor
  const handleDeleteMonitor = async (monitorId) => {
    const token = await getToken();
    try {
      const response = await fetch(`http://localhost:3000/website/${monitorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete monitor");
      }

      setMonitors(monitors.filter((monitor) => monitor.id !== monitorId));
      setDeleteDialog({ isOpen: false, monitorId: null, monitorName: "" });
    } catch (error) {
      console.error("Error deleting monitor:", error);
    }
  };

  // Handle toggling a monitor
  const handleToggleMonitor = async (monitorId) => {
    try {
      const token = await getToken();
      console.log(`Monitor id  : ${monitorId}`);
      const response = await fetch(`http://localhost:3000/website-track/${monitorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle monitor");
      }

      const updatedMonitors = monitors.map((monitor) =>
        monitor.id === monitorId ? { ...monitor, disabled: !monitor.disabled } : monitor
      );
      setMonitors(updatedMonitors);
    } catch (error) {
      console.error("Error toggling monitor:", error);
    }
  };

  // Filter monitors based on search query
  const filteredMonitors = monitors.filter((monitor) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      monitor.websiteName.toLowerCase().includes(query) || 
      monitor.url.toLowerCase().includes(query)
    );
  });

  // Calculate statistics for the dashboard
  const totalMonitors = monitors.length;
  const enabledCount = monitors.filter((monitor) => !monitor.disabled).length;
  const disabledCount = monitors.filter((monitor) => monitor.disabled).length;

  return (
    <div className="min-h-screen pt-16 pb-12 animate-fade-in bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Delete confirmation dialog */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-white">Delete Monitor</h2>
              <p className="mb-6 text-gray-300">
                Are you sure you want to delete this monitor? <span className="font-medium text-white">"{deleteDialog.monitorName}"</span> will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  onClick={() => setDeleteDialog({ isOpen: false, monitorId: null, monitorName: "" })}
                  variant="ghost"
                  className="text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleDeleteMonitor(deleteDialog.monitorId)}
                  variant="default"
                  className="text-sm bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-md hover:shadow-lg shadow-red-500/20"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        {/* Header with welcome and quick stats */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent pb-1">Dashboard</h1>
              <p className="text-gray-400 mt-2">
                Welcome back! Here's the current status of your systems.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant={monitorsActive ? "default" : "outline"} 
                className={`gap-1 px-3 ${!monitorsActive ? "text-red-400 border-red-400/50" : ""}`} 
                onClick={() => setMonitorsActive(!monitorsActive)}
              >
                <Power className={`h-4 w-4 ${!monitorsActive ? "text-red-400" : ""}`} />
                <span className="hidden md:inline">{monitorsActive ? "Turn Off All" : "Turn On All"}</span>
              </Button>
              <Button variant="outline" className="gap-1 px-3" onClick={() => {}}>
                <Bell className="h-4 w-4" />
                <span className="hidden md:inline">Notifications</span>
              </Button>
              <Button variant="outline" className="gap-1 px-3" onClick={() => {}}>
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Settings</span>
              </Button>
              <Button onClick={() => setIsAddMonitorOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Monitor</span>
              </Button>
            </div>
          </div>
          
          {/* Stats overview with improved grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
              title="Total Monitors" 
              value={totalMonitors.toString()} 
              icon={<BarChart className="h-5 w-5" />} 
              color="blue" 
            />
            <StatCard 
              title="Operational" 
              value={enabledCount.toString()} 
              icon={<Cpu className="h-5 w-5" />} 
              color="green" 
            />
            <StatCard 
              title="Paused" 
              value={disabledCount.toString()} 
              icon={<AlertCircle className="h-5 w-5" />} 
              color="red" 
            />
          </div>
        </div>
        
        {/* Monitor filters and search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">Your Monitors</h2>
            {!monitorsActive && (
              <span className="bg-red-500/10 text-red-400 text-xs font-medium px-2.5 py-1 rounded-full border border-red-500/20">
                All Monitoring Disabled
              </span>
            )}
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search monitors..." 
                className="pl-9 pr-4 py-2.5 w-full md:w-64 rounded-md border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button variant="outline" className="gap-1" onClick={() => {}}>
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Monitors grid with improved spacing */}
        {!monitorsActive ? (
          <div className="flex flex-col items-center justify-center py-16 border border-gray-700 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/30">
              <Power className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-medium mb-3 text-white">Monitors Are Turned Off</h3>
            <p className="text-gray-400 text-center max-w-md mb-8">
              All monitoring activities are currently disabled. Click the button below to resume monitoring your systems.
            </p>
            <Button 
              onClick={() => setMonitorsActive(true)}
              className="px-6 py-2.5 text-base"
            >
              <Power className="h-5 w-5 mr-2" />
              Turn On All Monitors
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonitors.map((monitor) => (
              <MonitorCard 
                key={monitor.id} // Add a unique key for each monitor
                monitor={monitor} 
                onDelete={(id) => setDeleteDialog({ isOpen: true, monitorId: id, monitorName: monitor.websiteName })}
                onToggle={handleToggleMonitor}
                isActive={!monitor.disabled}
              />
            ))}
          </div>
        )}
        
        {/* Empty state with improved design - show when no monitors or no search results */}
        {monitorsActive && filteredMonitors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border border-gray-700 rounded-xl bg-gray-800/50 backdrop-blur-sm">
            <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/30">
              {searchQuery ? <Search className="h-10 w-10 text-indigo-400" /> : <BarChart className="h-10 w-10 text-indigo-400" />}
            </div>
            <h3 className="text-2xl font-medium mb-3 text-white">
              {searchQuery ? "No matching monitors found" : "No monitors yet"}
            </h3>
            <p className="text-gray-400 text-center max-w-md mb-8">
              {searchQuery 
                ? `No monitors matching "${searchQuery}" were found. Try a different search term or add a new monitor.` 
                : "Get started by adding your first monitor to keep track of your websites and services."}
            </p>
            <div className="flex gap-4">
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="px-6 py-2.5 text-base"
                >
                  Clear Search
                </Button>
              )}
              <Button 
                onClick={() => setIsAddMonitorOpen(true)}
                className="px-6 py-2.5 text-base"
              >
                <Plus className="h-5 w-5 mr-2" />
                {searchQuery ? "Add New Monitor" : "Add Your First Monitor"}
              </Button>
            </div>
          </div>
        )}

        <AddMonitor
          isOpen={isAddMonitorOpen}
          onClose={() => setIsAddMonitorOpen(false)}
          onAdd={handleAddMonitor}
        />
      </div>
    </div>
  );
};

export default Dashboard;