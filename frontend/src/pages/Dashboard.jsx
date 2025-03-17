import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Plus, Globe, Server, Clock, AlertTriangle, Check, X, Trash2, AlertCircle } from 'lucide-react';
import { useAuth, useUser } from "@clerk/clerk-react";
import useWebsiteMonitor from '../hooks/useWebsiteMonitor';

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  
  // Get user information from Clerk
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  // Use our custom hook for website monitoring
  const {
    websites,
    monitoringData,
    nextUpdateIn,
    addWebsite,
    removeWebsite
  } = useWebsiteMonitor(user?.id); // Pass the user ID to the hook

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(clerkLoaded);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [clerkLoaded]);

  // Redirect if not signed in
  useEffect(() => {
    if (clerkLoaded && !isSignedIn) {
      navigate('/sign-in');
    }
  }, [clerkLoaded, isSignedIn, navigate]);

  // Handle adding website
  const handleAddWebsite = (e) => {
    if (e) e.preventDefault();
    
    if (!websiteUrl || websiteUrl.trim() === '') {
      setFeedback({ 
        message: 'Please enter a website URL',
        type: 'error'
      });
      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      return;
    }
    
    if (!websiteUrl.match(/^https?:\/\/.+/)) {
      setFeedback({ 
        message: 'Please enter a valid URL starting with http:// or https://',
        type: 'error'
      });
      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      return;
    }
    
    addWebsite(websiteUrl);
    
    setFeedback({ 
      message: `Added ${websiteUrl} to monitoring!`,
      type: 'success'
    });
    
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    
    setWebsiteUrl('');
    setShowAddModal(false);
  };

  const handleRemoveWebsite = (websiteId) => {
    if (confirm('Are you sure you want to remove this website from monitoring?')) {
      removeWebsite(websiteId);
      
      setFeedback({ 
        message: 'Website removed from monitoring',
        type: 'success'
      });
      
      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      case 'pending': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <Check className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <X className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin mr-2 h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        <span className="text-white text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Feedback Toast */}
      {feedback.message && (
        <div className={`fixed bottom-4 right-4 py-2 px-4 rounded-lg shadow-lg flex items-center z-50 ${
          feedback.type === 'success' ? 'bg-green-600/90' : 'bg-red-600/90'
        }`}>
          {feedback.type === 'success' ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <span className="text-white">{feedback.message}</span>
        </div>
      )}
      
      {/* Auth Status Indicator */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Authentication successful! You're logged in as {user?.emailAddresses?.[0]?.emailAddress || user?.username}</span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header with welcome message */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            Website Monitoring Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 flex items-center"
          >
            Monitor your websites with real-time updates every 30 seconds.
            <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Next update in: {nextUpdateIn}s
            </span>
          </motion.p>
        </div>

        {/* Add Website Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium flex items-center transition-colors shadow-lg hover:shadow-purple-500/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Website to Monitor
          </button>
        </motion.div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 gap-6">
          {websites.map((website) => (
            <motion.div
              key={website.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-purple-400 mr-2" />
                    <h2 className="text-xl font-semibold text-white">{website.url}</h2>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Last checked: {new Date(website.lastChecked).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Server className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-white">Uptime: {website.uptime}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(website.status)}`}>
                    {getStatusIcon(website.status)}
                    <span className="ml-1 capitalize">{website.status}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveWebsite(website.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                    title="Remove Website"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Latency Graph */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">Latency</h3>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-white">{website.latency}ms</span>
                  </div>
                </div>
                <div className="h-[200px] bg-black/20 rounded-lg p-2">
                  {monitoringData[website.id] && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monitoringData[website.id]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="time"
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <YAxis 
                          tick={{ fill: '#9CA3AF', fontSize: 12 }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                          domain={[0, 'dataMax + 100']}
                          label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            color: 'white'
                          }}
                        />
                        <Line 
                          type="monotone"
                          dataKey="latency"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: '#8884d8' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {websites.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6 text-center"
            >
              <p className="text-gray-400">No websites to monitor. Add a website to get started.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Website Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div 
            className="bg-gray-900 rounded-xl border border-white/10 p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Globe className="h-5 w-5 text-purple-400 mr-2" />
              Add Website to Monitor
            </h2>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm mb-2">Website URL</label>
              <input
                type="text"
                placeholder="https://example.com"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddWebsite()}
                autoFocus
              />
              <p className="text-gray-500 text-xs mt-1">Include http:// or https:// in the URL</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-300 bg-transparent hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="button" 
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                onClick={handleAddWebsite}
              >
                Add Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;