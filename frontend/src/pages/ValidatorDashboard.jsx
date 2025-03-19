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
import naclUtil from "tweetnacl-util";

const ValidatorDashboard = () => {
  const [isSignedIn, setIsSignedIn] = useState(true); // For demo purposes
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState("Validator");
  const [email, setEmail] = useState("validator@example.com");
  const [publicKey, setPublicKey] = useState("0x1234567890abcdef"); // Mock public key
  const [ipAddress, setIpAddress] = useState("192.168.1.1"); // Mock IP address
  const [location, setLocation] = useState("Delhi, India"); // Mock location
  const [averagePayout, setAveragePayout] = useState("0.01 ETH"); // Mock average payout
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  // Start Validating
  const validatorIdRef = useRef(null);

  useEffect(() => {
    let ws = null;
    const connectWebsocket = () => {
      const privateKeyBase64 = localStorage.getItem("privateKey");
      const privateKeyBytes = naclUtil.decodeBase64(privateKeyBase64);
      const keypair = nacl.sign.keyPair.fromSecretKey(privateKeyBytes);

      ws = new WebSocket("ws://localhost:8081");

      ws.onopen = async () => {
        const callbackId = naclUtil.randomBytes(16).toString("hex");
        const signedMessage = await signMessage(
          `Signed message for ${callbackId}, ${naclUtil.encodeBase64(
            keypair.publicKey
          )}`,
          keypair
        );

        ws.send(
          JSON.stringify({
            type: "signup",
            data: {
              callbackId,
              ip: "127.0.0.1",
              publicKey: naclUtil.encodeBase64(keypair.publicKey),
              signedMessage,
            },
          })
        );
      };

      ws.onmessage =async (event) => {
        const data = JSON.parse(event);
        if (data.type === "signup") {
          validatorIdRef.current = data.data.validatorId;
        } else if (data.type === "validate") {
          const { url, callbackId } = data.data;
          const startTime = Date.now();
          let latency = 0;
          const signature = await signMessage(
            `Replying to ${callbackId}`,
            keypair
          );

          try {
            const response = await fetch(url);
            const endTime = Date.now();
            latency = endTime - startTime;
            const status = response.status;

            ws.send(
              JSON.stringify({
                type: "validate",
                data: {
                  callbackId,
                  status: status === 200 ? "Good" : "Bad",
                  latency,
                  validatorId: validatorIdRef.current,
                  signedMessage: signature,
                },
              })
            );
          } catch (error) {
            try {
            const coordinates = await getCurrentLocation();
            ws.send(
              JSON.stringify({
                type: "validate",
                data: {
                  callbackId,
                  status: "Bad",
                  latency: latency,
                  validatorId: validatorIdRef.current,
                  signedMessage: signature,
                  coordinates : coordinates,
                  location : location
                },
              })
            );
          } catch(err) {
            console.log("Error in getting the location");
            console.log(err.message);
          }
            console.error(error);
          }
        }
      };
      ws.onclose = () => {
        // Attempt to reconnect after 5 seconds if still validating
        if (isValidating) {
          console.log("WebSocket disconnected. Reconnecting...");
          setTimeout(connectWebsocket, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close(); // This will trigger onclose and attempt reconnection
      };
    };

    if (isValidating) {
      connectWebsocket();
    }

    return () => {
      if (ws) ws.close();
    };
  }, [isValidating]);

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  // Function for signing msg
  const signMessage = async (message, keypair) => {
    const messageBytes = naclUtil.decodeUTF8(message);
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

  // Mock data for the dashboard
  const mockStats = {
    validations: 1248,
    uptime: "2 hours",
    rewards: "0.025 SOL",
    status: "Active",
  };

  const mockRecentActivity = [
    {
      id: 1,
      type: "Validation",
      status: "Success",
      time: "5 minutes ago",
      website: "example.com",
    },
    {
      id: 2,
      type: "Reward",
      status: "Received",
      time: "2 hours ago",
      amount: "0.003 ETH",
    },
    {
      id: 3,
      type: "Validation",
      status: "Success",
      time: "4 hours ago",
      website: "test-api.io",
    },
    {
      id: 4,
      type: "System",
      status: "Update",
      time: "1 day ago",
      details: "Node software updated",
    },
  ];

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
                  {mockStats.validations}
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
                  {mockStats.rewards}
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
                <p className="text-gray-400 text-sm">Status</p>
                <h3 className="text-2xl font-bold text-green-400">
                  {mockStats.status}
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
                            activity.status === "Success" ||
                            activity.status === "Received"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {activity.website && `Website: ${activity.website}`}
                        {activity.amount && `Amount: ${activity.amount}`}
                        {activity.details && activity.details}
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm">{activity.time}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <button className="text-purple-400 hover:text-purple-300 text-sm">
                  View All Activity
                </button>
              </div>
            </div>

            <div className="relative mt-4 text-center">
  <button
    className={`${
      isValidating ? 'bg-purple-600' : 'bg-purple-500 hover:bg-purple-600'
    } text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 zIndex=10`}
    onClick={() => {
      setIsValidating(!isValidating);
      if (!isValidating) {
        validatorIdRef.current = null; // Reset validatorId when stopping validation
      }
      console.log("Button clicked validating....");
    }}
    disabled={isValidating && !validatorIdRef.current}
  >
    {isValidating ? (validatorIdRef.current ? 'Validating' : 'Connecting...') : 'Start Validating'}
  </button>
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
                    <div>
                      <div className="font-medium text-white">
                        Average Payout
                      </div>
                      <div className="text-sm text-gray-400">
                        {averagePayout}
                      </div>
                    </div>
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
