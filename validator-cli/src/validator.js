const WebSocket = require("ws");
const axios = require("axios");
const nacl = require("tweetnacl");
const naclUtil = require("tweetnacl-util");
const { loadPrivateKey } = require("./auth");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");
const { execSync } = require('child_process');
const http = require('http');
const https = require('https');
const network = require('../utils/network');
const chalk = require('chalk'); // Add chalk import to fix the reference error

let validatorId = null;
let location = "Unknown";
let ipAddress = "Unknown";
let wsConnection = null;
let lastPingTime = null;

const signMessage = (message, keypair) => {
  const messageBytes = naclUtil.decodeUTF8(message);
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  return JSON.stringify(Array.from(signature));
};

const getLocationAndIp = async () => {
  try {
    const response = await axios.get("https://ipinfo.io/json");
    ipAddress = response.data.ip || "Unknown";
    return {
      location: `${response.data.city}, ${response.data.region}, ${response.data.country}`,
      ipAddress
    };
  } catch (error) {
    logger.error(`Failed to get location and IP: ${error.message}`);
    return {
      location: "Unknown",
      ipAddress: "Unknown"
    };
  }
};

const loadConfig = () => {
  const configPath = process.env.CONFIG_PATH || 
    path.resolve(__dirname, "../config/config.json");
  
  if (!fs.existsSync(configPath)) {
    // Create a default config if one doesn't exist
    const defaultConfig = {
      hubServer: "ws://localhost:8081",
      pingInterval: 10000
    };
    
    // Add target URL if specified in environment
    if (process.env.TARGET_URL) {
      defaultConfig.targetURL = process.env.TARGET_URL;
    }
    
    try {
      fs.mkdirSync(path.dirname(configPath), { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      logger.success(`Created default config at: ${configPath}`);
    } catch (error) {
      logger.error(`Failed to create default config: ${error.message}`);
      process.exit(1);
    }
  }
  
  try {
    const config = require(configPath);
    // Override targetURL if set in environment
    if (process.env.TARGET_URL) {
      config.targetURL = process.env.TARGET_URL;
    }
    return config;
  } catch (error) {
    logger.error(`Failed to load config: ${error.message}`);
    process.exit(1);
  }
};

// Function to manually ping a URL
const pingURL = async (url, ws, keypair) => {
  if (!validatorId) {
    logger.warn("Cannot ping until registered with the hub");
    return;
  }
  
  const callbackId = Array.from(nacl.randomBytes(16))
    .map(b => b.toString(16).padStart(2, '0'))
    .join("");
  
  logger.log(`Pinging: ${url}`);
  
  try {
    // Only get network ping, don't calculate HTTP latency
    const results = await network.measureLatency(url, {
      preferNetworkPing: true,
      timeout: 3000
    });
    
    logger.network(`Network latency: ${results.networkPing || 'N/A'}ms`);
    
    // Use only network ping or 0 if unavailable
    const latency = results.networkPing || 0;
    
    const signature = signMessage(`Manual ping for ${callbackId}`, keypair);
    
    // Only show warning for high latency
    if (latency > 200 && latency < 1000) {
      logger.warn(`Moderate latency detected (${latency}ms)`);
    } else if (latency >= 1000) {
      logger.warn(`High latency detected (${latency}ms)`);
    } else if (latency > 0) {
      logger.success(`Good latency: ${latency}ms`);
    }
    
    lastPingTime = Date.now();
    
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          url,
          status: results.status === 200 ? "Good" : "Bad",
          latency: latency,
          networkLatency: results.networkPing,
          validatorId,
          signedMessage: signature,
          location,
          ipAddress,
        },
      })
    );
  } catch (error) {
    logger.error(`Ping failed: ${error.message}`);
    
    const signature = signMessage(`Manual ping for ${callbackId}`, keypair);
    lastPingTime = Date.now();
    
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          url,
          status: "Bad",
          latency: 0,
          validatorId,
          signedMessage: signature,
          location,
          ipAddress,
        },
      })
    );
  }
};

const startValidator = async (spinner) => {
  const keypair = await loadPrivateKey();
  const config = loadConfig();
  
  // Set default latency settings if not specified
  if (!config.latencySettings) {
    config.latencySettings = {
      timeout: 5000,
      maxRedirects: 0,
      disableCache: true
    };
  }
  
  const locationData = await getLocationAndIp();
  location = locationData.location;
  ipAddress = locationData.ipAddress;
  
  if (spinner) {
    spinner.color = 'cyan';
    spinner.text = 'Connecting to hub server...';
  }
  
  logger.log(`Validator location: ${location}`);
  logger.log(`Validator IP address: ${ipAddress}`);
  if (config.targetURL) {
    logger.log(`Target URL: ${config.targetURL}`);
  } else {
    logger.warn("No target URL specified. Use 'validator-cli set-target <url>' to set one.");
  }
  logger.log(`Connecting to hub server: ${config.hubServer}`);
  
  const connect = () => {
    const ws = new WebSocket(config.hubServer);
    wsConnection = ws;

    ws.on("open", async () => {
      if (spinner) {
        spinner.succeed(chalk.greenBright('Connected to WebSocket hub!'));
      } else {
        logger.success("Connected to WebSocket hub!");
      }

      const callbackId = Array.from(nacl.randomBytes(16))
        .map(b => b.toString(16).padStart(2, '0'))
        .join("");
        
      const signedMessage = signMessage(
        `Signed message for ${callbackId}, ${naclUtil.encodeBase64(keypair.publicKey)}`, 
        keypair
      );

      ws.send(
        JSON.stringify({
          type: "signup",
          data: {
            callbackId,
            ip: ipAddress,
            publicKey: naclUtil.encodeBase64(keypair.publicKey),
            signedMessage,
            location,
          },
        })
      );
      
      // If we have a target URL, ping it after signup
      if (config.targetURL) {
        setTimeout(() => {
          if (validatorId) {
            pingURL(config.targetURL, ws, keypair);
          }
        }, 2000); // Wait 2 seconds after connection
      }
    });

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "signup") {
          validatorId = data.data.validatorId;
          logger.success(`Validator registered: ${validatorId}`);
          
          // Ping immediately after signup
          if (config.targetURL) {
            setTimeout(() => {
              pingURL(config.targetURL, ws, keypair);
            }, 1000);
          }
        } else if (data.type === "validate") {
          const { url, callbackId } = data.data;
          logger.ping(`Received validation request for URL: ${url}`);
          
          const signature = signMessage(`Replying to ${callbackId}`, keypair);

          try {
            // Only measure network ping, no HTTP latency
            const results = await network.measureLatency(url, {
              preferNetworkPing: true,
              timeout: 3000
            });
            
            const latency = results.networkPing || 0;
            
            logger.network(`Network latency: ${latency}ms`);
            logger.success(`Validation complete: status ${results.status}`);

            ws.send(
              JSON.stringify({
                type: "validate",
                data: {
                  callbackId,
                  status: results.status >= 200 && results.status < 300 ? "Good" : "Bad",
                  latency: latency,
                  networkLatency: results.networkPing,
                  validatorId,
                  signedMessage: signature,
                  location,
                  ipAddress,
                },
              })
            );
          } catch (error) {
            logger.error(`Website check failed: ${error.message}`);

            ws.send(
              JSON.stringify({
                type: "validate",
                data: {
                  callbackId,
                  status: "Bad",
                  latency: 0,
                  validatorId,
                  signedMessage: signature,
                  location,
                  ipAddress,
                },
              })
            );
          }
        }
      } catch (error) {
        logger.error(`Error processing message: ${error.message}`);
      }
    });

    ws.on("close", () => {
      logger.warn("WebSocket disconnected. Reconnecting in 5 seconds...");
      setTimeout(connect, 5000);
    });

    ws.on("error", (error) => {
      logger.error(`WebSocket error: ${error.message}`);
      ws.close();
    });
    
    return ws;
  };

  // Start initial connection
  connect();
  
  // Set up automatic pinging if specified in config
  if (config.targetURL && config.pingInterval) {
    logger.ping(`Starting automatic pinging of ${config.targetURL} every ${config.pingInterval/1000} seconds`);
    setInterval(() => {
      if (validatorId && wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        logger.ping("Performing scheduled ping...");
        pingURL(config.targetURL, wsConnection, keypair);
      }
    }, config.pingInterval);
  }
};

// Add function to get validator status
const getValidatorStatus = () => {
  return {
    connected: wsConnection && wsConnection.readyState === WebSocket.OPEN,
    validatorId,
    location,
    ipAddress,
    lastPingTime: lastPingTime || null
  };
};

module.exports = { startValidator, getValidatorStatus };