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
  const [averagePayout, setAveragePayout] = useState("0.01 ETH"); // Mock average payout
  const [isValidating, setIsValidating] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [uptimeInterval, setUptimeInterval] = useState(null);

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
  const validatorIdRef = useRef(null);
  useEffect(() => {
    const fetchValidatorDetails = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      const res = await axios.get("http://localhost:3000/validator-detail", {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      console.log(res);
      const { name, location, payoutPublicKey, pendingPayouts, email } =
        res.data.validator;
      const totalValidator = res.data.totalValidator;
      console.log(totalValidator);
      const averagePayout = res.data.averagePayout;
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
  useEffect(() => {
    return () => {
      if (uptimeInterval) {
        clearInterval(uptimeInterval);
      }
    };
  }, [uptimeInterval]);

  const calculateUptime = (startTime) => {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000); // difference in seconds

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Function for signing msg
  const signMessage = async (message, keypair) => {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    return JSON.stringify(Array.from(signature));
  };

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

  const handleWithdraw = () => {
    alert("Withdraw function triggered");
    // Implement the logic to withdraw the amount
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
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
                <p className="text-gray-400 text-sm">Node Uptime</p>
                <h3 className="text-2xl font-bold text-white">
                  {mockStats.uptime}
                </h3>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Server className="h-5 w-5 text-green-400" />
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
            <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Validator Control Panel
              </h2>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-lg text-left">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-white">Node Settings</span>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-lg text-left">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-white">Notifications</span>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-lg text-left">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-white">Security</span>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {userName[0] || "V"}
                    </div>
                    <div>
                      <div className="font-medium text-white">{userName}</div>
                      <div className="text-sm text-gray-400">{email}</div>
                      <div className="text-sm text-gray-400">
                        Public Key: {publicKey}
                      </div>
                      <div className="text-sm text-gray-400">
                        IP Address: {ipAddress}
                      </div>
                      <div className="text-sm text-gray-400">
                        Location: {location}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="w-full mt-2 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={handleWithdraw}
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorDashboard;
