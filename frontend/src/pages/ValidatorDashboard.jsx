import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Network,
  Server,
  Activity,
  Bell,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util";
import axios from "axios";
import bs58 from "bs58";
const ValidatorDashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/signin-validator");
  }
  const [isSignedIn, setIsSignedIn] = useState(true); // For demo purposes
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState("Validator");
  const [email, setEmail] = useState("validator@example.com");
  const [publicKey, setPublicKey] = useState("0x1234567890abcdef"); // Mock public key
  const [ipAddress, setIpAddress] = useState("192.168.1.1"); // Mock IP address
  const [location, setLocation] = useState("Delhi, India"); // Mock location
  const [averagePayout, setAveragePayout] = useState("0.01 SOL"); // Mock average payout
  const [withdrawing, setWithDrawing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [mockRecentActivity, setMockRecentActivity] = useState([
    {
      id: 1,
      type: "Validation",
      status: "Good",
      time: "5 minutes ago",
      latency: 100,
    },
  ]);
  const [mockStats, setMockStats] = useState({
    totalValidator: 1248,
    uptime: "2 hours",
    rewards: "0.025 SOL",
    status: "Offline",
  });

  // Start Validating
  useEffect(() => {
    const fetchValidatorDetails = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/validator-detail", {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      const { name, location, payoutPublicKey, pendingPayouts, email } =
        res.data.validator;
      const totalValidator = res.data.totalValidator;
      const averagePayout = Number(res.data.averagePayout).toFixed(2);
      let recentWeb = res.data.recentWebsites;
      const transformedRecentWeb = recentWeb.map((activity) => {
        // Calculate time difference
        const now = new Date();
        const activityTime = new Date(activity.createdAt);
        const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

        let timeAgo;
        if (diffInMinutes < 1) {
          timeAgo = "just now";
        } else if (diffInMinutes === 1) {
          timeAgo = "1 minute ago";
        } else if (diffInMinutes < 60) {
          timeAgo = `${diffInMinutes} minutes ago`;
        } else {
          const hours = Math.floor(diffInMinutes / 60);
          timeAgo = `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        }

        return {
          id: activity._id,
          type: "Validation",
          status: activity.status === "Good" ? "Good" : "Bad",
          time: timeAgo,
          latency: activity.latency,
        };
      });

      setMockRecentActivity(transformedRecentWeb);
      setEmail(email);
      setUserName(name);
      setPublicKey(payoutPublicKey);
      setLocation(location);
      setMockStats((prev) => ({
        ...prev,
        rewards: pendingPayouts || "0",
        totalValidator: totalValidator || 0,
      }));
      setAveragePayout(averagePayout);
    };
    try {
      fetchValidatorDetails();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Simulate loading and auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    setIsSignedIn(false);
    navigate("/signin-validator");
  };

  const handleWithdraw = async () => {
    setWithDrawing(true);
    try {
      console.log("Withdraw function triggered");
      if(mockStats.rewards < 800000) {
        setAlertMessage("Minimum 800,000 Lamports should be there to claim");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
        return;
      }
      const token = localStorage.getItem("token");
      console.log(token);
      const res = await axios.post("http://localhost:3000/getPayout",{}, {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });   
      if(res.status == 200) {
        setAlertMessage("Payment successful");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
      }
      console.log(res);   
    } catch(err) {
      console.log(err)
    } finally {
      setWithDrawing(false);
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
      {/* Enhanced Alert Popup */}
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 to-black border border-purple-500/50 text-white px-8 py-4 rounded-xl shadow-2xl z-50 max-w-lg w-full backdrop-blur-lg"
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-full ${alertMessage.includes("Minimum") ? "bg-yellow-500/20" : "bg-green-500/20"}`}>
              {alertMessage.includes("Minimum") ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${alertMessage.includes("Minimum") ? "text-yellow-400" : "text-green-400"}`}>
                {alertMessage.includes("Minimum") ? "Action Required" : "Success"}
              </h3>
              <p className="text-gray-300 mt-1">{alertMessage}</p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setShowAlert(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
          
          <button 
            onClick={() => setShowAlert(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Auth Status Indicator */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg text-sm flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Authentication successful! You're logged in as {email}</span>
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
            Welcome, {userName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400"
          >
            Your validator node is online and actively contributing to the dPIN
            network.
          </motion.p>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Validations</p>
                <h3 className="text-2xl font-bold text-white">
                  {mockStats.totalValidator}
                </h3>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rewards Earned</p>
                <h3 className="text-2xl font-bold text-white">
                  {mockStats.rewards} Lamports
                </h3>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Averave Payout</p>
                <h3 className="text-2xl font-bold text-green-400">
                  {averagePayout} Lamports
                </h3>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Network className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-white">
                          {activity.type}
                        </span>
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full ${
                            activity.status === "Good"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {activity.latency && `Latency: ${activity.latency}`}
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold text-white mb-4">
                Validator Control Panel
              </h2>

              {/* Removed the node settings, notifications, and security buttons */}

              <div className="mt-4 pt-4 border-t border-white/10 flex-grow">
                <div className="bg-white/5 rounded-lg p-4 h-full">
                  <div className="mb-3">
                    <div>
                      <div className="font-medium text-white">{userName}</div>
                      <div className="text-sm text-gray-400">{email}</div>
                      <div className="text-sm mt-2">
                        <span className="font-medium text-purple-400">Public Key:</span> 
                        <span className="text-gray-300 break-all ml-1">{publicKey}</span>
                      </div>
                      <div className="text-sm mt-2">
                        <span className="font-medium text-purple-400">IP Address:</span> 
                        <span className="text-gray-300 ml-1">{ipAddress}</span>
                      </div>
                      <div className="text-sm mt-2">
                        <span className="font-medium text-purple-400">Location:</span> 
                        <span className="text-gray-300 ml-1">{location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-2 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={handleWithdraw}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg transition-colors text-lg font-medium w-full"
                      disabled={withdrawing}
                    >
                      {withdrawing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin mr-2 h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                          Withdrawing...
                        </div>
                      ) : (
                        "Withdraw Rewards"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CLI Installation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Validator CLI
          </h2>
          <div className="space-y-4">
            <div className="bg-black/50 rounded-lg p-4 border border-white/5">
              <h3 className="text-purple-400 font-medium mb-2">A decentralized uptime validator CLI for monitoring website availability</h3>
              <p className="text-gray-300 mb-4">
                Our Command Line Interface (CLI) tool allows validators to participate in the dPIN network. Follow these steps to get started:
              </p>
              
              <div className="space-y-1 mb-4">
                <h4 className="text-white font-medium">Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-2">
                  <li>Node.js 14 or higher</li>
                  <li>npm 6 or higher</li>
                  <li>Connection to a validator hub server</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-1">Installation</h4>
                  <p className="text-gray-300 text-sm mb-2">Since this package is not published to the npm registry, you need to install it locally:</p>
                  <pre className="bg-black/70 p-3 rounded-md overflow-x-auto text-gray-300 text-sm">
                    <code># Clone or download the repository
# Then navigate to the project directory
cd validator-cli

# Install dependencies
npm install

# Create a global symlink to use the CLI from anywhere
npm link</code>
                  </pre>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-1">Getting Started</h4>
                  <p className="text-gray-300 text-sm mb-2">Here's how to get up and running with the Validator CLI:</p>
                  
                  <div className="pl-2 border-l-2 border-purple-500/30 ml-2">
                    <p className="text-gray-300 text-sm mb-1">1. Make sure you have completed the installation steps above</p>
                    
                    <p className="text-gray-300 text-sm mb-1 mt-2">2. Start the validator client</p>
                    <pre className="bg-black/70 p-2 rounded-md overflow-x-auto text-gray-300 text-sm">
                      <code>validator-cli start ./config/privateKey.txt</code>
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Available Commands</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><code className="bg-black/50 px-1 rounded text-purple-300">validator-cli start /path/to/privateKey.txt</code> - Start the validator</li>
                  <li><code className="bg-black/50 px-1 rounded text-purple-300">validator-cli info /path/to/privateKey.txt</code> - View validator info</li>
                  <li><code className="bg-black/50 px-1 rounded text-purple-300">validator-cli ping https://example.com</code> - Manually ping a URL</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">GitHub Repository</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Clone the repository, report issues, and contribute to the project
                  </p>
                </div>
                <a 
                  href="https://www.github.com/lviffy/dPIN-cli" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ValidatorDashboard;
