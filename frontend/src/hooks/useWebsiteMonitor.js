import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook for monitoring websites
 * @param {string} userId - The ID of the current user
 * @returns {Object} - Website monitoring state and functions
 */
export default function useWebsiteMonitor(userId) {
  const [websites, setWebsites] = useState([]);
  const [monitoringData, setMonitoringData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [nextUpdateIn, setNextUpdateIn] = useState(30);
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const timerRef = useRef(null);

  // Initialize with mock data
  useEffect(() => {
    // When using with Clerk, we can use userId to fetch data
    console.log("User ID for monitoring:", userId);
    
    // Mock websites for demo mode
    const mockWebsites = [
      {
        id: 'site1',
        url: 'https://example.com',
        status: 'online',
        latency: 120,
        uptime: '99.9%',
        lastChecked: new Date().toISOString()
      },
      {
        id: 'site2',
        url: 'https://api.example.org',
        status: 'warning',
        latency: 350,
        uptime: '98.7%',
        lastChecked: new Date().toISOString()
      }
    ];
    
    setWebsites(mockWebsites);
    
    // Initialize monitoring data with mock values
    const initialData = {};
    mockWebsites.forEach(site => {
      initialData[site.id] = Array(20).fill().map((_, i) => ({
        time: new Date(Date.now() - (19-i) * 30000).toLocaleTimeString(),
        latency: Math.floor(Math.random() * 200) + 100
      }));
    });
    setMonitoringData(initialData);
    setLastUpdated(new Date());
    
    // Setup mock updates every 30 seconds
    const interval = setInterval(() => {
      updateMockData();
      setLastUpdated(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);

  // Update countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const secondsElapsed = Math.floor((new Date() - lastUpdated) / 1000);
      const secondsRemaining = Math.max(0, 30 - secondsElapsed);
      setNextUpdateIn(secondsRemaining);
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [lastUpdated]);

  // Update mock data for testing without WebSocket
  const updateMockData = () => {
    setMonitoringData(prev => {
      const newData = {...prev};
      websites.forEach(site => {
        if (newData[site.id]) {
          const latency = Math.floor(Math.random() * 200) + 100;
          newData[site.id] = [
            ...newData[site.id].slice(1),
            { time: new Date().toLocaleTimeString(), latency }
          ];
          
          // Also update website status based on latency
          setWebsites(prevWebsites => prevWebsites.map(w => {
            if (w.id === site.id) {
              return {
                ...w,
                latency,
                lastChecked: new Date().toISOString(),
                status: latency > 300 ? 'warning' : 'online'
              };
            }
            return w;
          }));
        }
      });
      return newData;
    });
  };

  const addWebsite = (url) => {
    if (!url) {
      console.error('Cannot add website: URL is empty');
      return;
    }
    
    // Strip any leading/trailing whitespace
    const cleanUrl = url.trim();
    
    // Log for debugging
    console.log('useWebsiteMonitor: Adding website:', cleanUrl);
    
    // Create a new website with a unique ID
    const newId = `site${Date.now()}`;
    const newWebsite = {
      id: newId,
      url: cleanUrl,
      status: 'pending',
      latency: 0,
      uptime: '0%',
      lastChecked: new Date().toISOString()
    };
    
    // Add to websites state
    setWebsites(currentWebsites => {
      return [...currentWebsites, newWebsite];
    });
    
    // Create empty monitoring data
    const emptyData = Array(20).fill().map((_, i) => ({
      time: new Date(Date.now() - (19-i) * 30000).toLocaleTimeString(),
      latency: 0
    }));
    
    // Add to monitoring data state
    setMonitoringData(currentData => {
      const newData = {...currentData};
      newData[newId] = emptyData;
      return newData;
    });
    
    // Simulate immediate check (after a short delay)
    setTimeout(() => {
      // Generate a random latency
      const latency = Math.floor(Math.random() * 450) + 50;
      const status = latency > 300 ? 'warning' : 'online';
      
      console.log(`Website ${newId} checked with latency: ${latency}ms`);
      
      // Update website status in the list
      setWebsites(prev => 
        prev.map(site => 
          site.id === newId 
            ? {
                ...site,
                status,
                latency,
                lastChecked: new Date().toISOString()
              } 
            : site
        )
      );
      
      // Update monitoring chart data
      setMonitoringData(prev => {
        const newData = {...prev};
        if (newData[newId]) {
          newData[newId] = [
            ...newData[newId].slice(1),
            { time: new Date().toLocaleTimeString(), latency }
          ];
        }
        return newData;
      });
      
      // Reset the countdown timer
      setLastUpdated(new Date());
    }, 2000);
  };

  const removeWebsite = (websiteId) => {
    setWebsites(prev => prev.filter(site => site.id !== websiteId));
    
    setMonitoringData(prev => {
      const newData = {...prev};
      delete newData[websiteId];
      return newData;
    });
  };

  return {
    websites,
    monitoringData,
    isConnected,
    lastUpdated,
    nextUpdateIn,
    error,
    addWebsite,
    removeWebsite
  };
}
