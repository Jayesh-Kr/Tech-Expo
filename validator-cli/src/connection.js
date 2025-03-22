const WebSocket = require('ws');
const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const axios = require('axios');
const { randomUUID } = require('crypto');
const logger = require('../utils/logger');
const chalk = require('chalk');
const net = require('net');
const http = require('http');
const https = require('https');

// Connection state
let validatorId = null;
let wsConnection = null;
let isValidating = true;
let pendingPayouts = 0;
let location = "Unknown";
let ipAddress = "Unknown";
let lastPingTime = null;

// Fixed value to match hub's COST_PER_VALIDATION
const COST_PER_VALIDATION = 100;

/**
 * Sign a message with the validator's keypair
 * @param {string} message - Message to sign
 * @param {object} keypair - Nacl keypair
 * @returns {string} - JSON stringified signature
 */
const signMessage = (message, keypair) => {
  const messageBytes = naclUtil.decodeUTF8(message);
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  return JSON.stringify(Array.from(signature));
};

/**
 * Measure website latency more accurately using TCP connection
 * @param {string} url - URL to ping
 * @returns {Promise<{time: number, status: number}>} - Latency and status
 */
const measureAccurateLatency = async (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const port = urlObj.protocol === 'https:' ? 443 : 80;
    
    // First try a TCP connection for most accurate network latency
    const tcpLatency = await getTcpLatency(hostname, port);
    
    // Then do a HEAD request to get status code
    const statusCheck = await getStatusCode(url);
    
    return {
      time: tcpLatency || statusCheck.time,
      status: statusCheck.status
    };
  } catch (error) {
    return { time: 0, status: 0 };
  }
};

/**
 * Get TCP connection latency to server
 * @param {string} hostname - Hostname to connect to
 * @param {number} port - Port to connect to
 * @returns {Promise<number>} - TCP latency in ms
 */
const getTcpLatency = (hostname, port) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const socket = new net.Socket();
    
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      const latency = Date.now() - startTime;
      socket.destroy();
      resolve(latency);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(null);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(null);
    });
    
    socket.connect(port, hostname);
  });
};

/**
 * Get HTTP status code using HEAD request
 * @param {string} url - URL to check
 * @returns {Promise<{time: number, status: number}>} - Timing and status code
 */
const getStatusCode = (url) => {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const startTime = Date.now();
    
    const options = {
      method: 'HEAD',
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      timeout: 3000,
      headers: {
        'Cache-Control': 'no-cache',
        'Connection': 'close'
      },
      followRedirects: true, // Allow following redirects
      maxRedirects: 5 // Limit the number of redirects to follow
    };
    
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      const time = Date.now() - startTime;
      res.resume();
      
      // If the response is a redirect, follow it
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        const redirectUrl = new URL(res.headers.location, url);
        return resolve(getStatusCode(redirectUrl.toString()));
      }
      
      resolve({ time, status: res.statusCode });
    });
    
    req.on('error', () => {
      resolve({ time: Date.now() - startTime, status: 0 });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ time: 3000, status: 0 });
    });
    
    req.end();
  });
};

/**
 * Format latency with appropriate color coding
 * @param {number} latency - Latency in ms
 * @returns {string} - Colorized latency string
 */
const formatLatency = (latency) => {
  if (latency < 50) {
    return chalk.green(`${latency}ms`); // Excellent
  } else if (latency < 100) {
    return chalk.greenBright(`${latency}ms`); // Very good
  } else if (latency < 200) {
    return chalk.yellow(`${latency}ms`); // Good
  } else if (latency < 500) {
    return chalk.yellowBright(`${latency}ms`); // Fair
  } else {
    return chalk.red(`${latency}ms`); // Poor
  }
};

/**
 * Connect to the WebSocket hub server
 * @param {string} privateKeyBase64 - Base64 encoded private key
 * @param {string} hubServer - WebSocket server URL
 * @param {object} spinner - Optional ora spinner for UI feedback
 * @returns {object} - WebSocket connection
 */
const connectWebsocket = async (privateKeyBase64, hubServer, spinner = null) => {
  try {
    // Create keypair from private key
    const privateKeyBytes = naclUtil.decodeBase64(privateKeyBase64);
    const keypair = nacl.sign.keyPair.fromSecretKey(privateKeyBytes);
    
    // Get location and IP info first
    try {
      if (spinner) {
        spinner.text = 'Fetching location data...';
      }
      
      const ipResponse = await axios.get("https://ipinfo.io/json");
      ipAddress = ipResponse.data.ip || "Unknown";
      location = `${ipResponse.data.city}, ${ipResponse.data.region}, ${ipResponse.data.country}`;
      
      // Display IP address with a clean box design
      console.log(chalk.cyan('\n ┌─────────────────────────────────────┐'));
      console.log(chalk.cyan(' │          VALIDATOR DETAILS          │'));
      console.log(chalk.cyan(' └─────────────────────────────────────┘'));
      console.log(chalk.bold.cyan(`\n   IP Address: `) + chalk.white.bold(ipAddress));
      console.log(chalk.bold.cyan(`   Location:   `) + chalk.white(location));
      console.log(chalk.cyan(' ─────────────────────────────────────\n'));
    } catch (error) {
      logger.warn(`Could not determine location: ${error.message}`);
    }
    
    if (spinner) {
      spinner.color = 'cyan';
      spinner.text = 'Connecting to hub server...';
    }
    
    logger.log(`Connecting to ${chalk.magenta.bold(hubServer)}`);
    
    // Create WebSocket connection
    wsConnection = new WebSocket(hubServer);
    
    // Handle WebSocket open event
    wsConnection.on("open", async () => {
      if (spinner) {
        spinner.succeed(chalk.greenBright('Connected to WebSocket hub!'));
      } else {
        logger.success("Connected to WebSocket hub!");
      }
      
      // Generate a random callback ID using crypto UUID
      const callbackId = randomUUID();
      
      // Sign the signup message with our keypair
      const publicKeyBase64 = naclUtil.encodeBase64(keypair.publicKey);
      const signedMessage = signMessage(
        `Signed message for ${callbackId}, ${publicKeyBase64}`, 
        keypair
      );
      
      // Display styled public key info
      const shortenedKey = publicKeyBase64.substring(0, 12) + '...' + publicKeyBase64.substring(publicKeyBase64.length - 8);
      logger.log(`Public Key: ${chalk.yellowBright(shortenedKey)}`);
      
      if (spinner) {
        spinner.text = 'Registering validator...';
        spinner.color = 'yellow';
      }
      
      // Send signup message
      wsConnection.send(
        JSON.stringify({
          type: "signup",
          data: {
            callbackId,
            ip: ipAddress,
            publicKey: publicKeyBase64,
            signedMessage,
            location,
          },
        })
      );
    });
    
    // Handle WebSocket messages
    wsConnection.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === "signup") {
          validatorId = data.data.validatorId;
          
          // Display styled validator ID
          console.log(chalk.green('\n ┌─────────────────────────────────────┐'));
          console.log(chalk.green(` │       VALIDATOR REGISTERED: ${validatorId.padEnd(10, ' ')} │`));
          console.log(chalk.green(' └─────────────────────────────────────┘\n'));
          
          // Check if pending payouts were included in the signup response
          if (data.data.pendingPayouts !== undefined) {
            pendingPayouts = data.data.pendingPayouts;
            logger.success(`Current rewards: ${chalk.yellowBright(pendingPayouts)} lamports`);
          }
          
          // Show active status message
          console.log(chalk.green(' ✓ ') + chalk.white('Validator is now ') + chalk.green.bold('ACTIVE') + chalk.white(' and ready for validation requests\n'));
        } else if (data.type === "validate") {
          const { url, callbackId } = data.data;
          logger.ping(`Validating URL: ${chalk.cyan(url)}`);
          
          // Sign the validation response
          const signature = signMessage(`Replying to ${callbackId}`, keypair);
          
          try {
            // Get more accurate ping measurements using TCP connection
            const pingResult = await measureAccurateLatency(url);
            
            // As a fallback, we'll still do a full fetch but only for status verification
            let responseStatus = pingResult.status;
            if (responseStatus === 0) {
              try {
                const response = await fetch(url, {
                  method: 'GET',
                  cache: 'no-store',
                  redirect: 'follow',
                  headers: { 'Cache-Control': 'no-cache' },
                  timeout: 5000
                });
                responseStatus = response.status;
              } catch (fetchError) {
                // Keep status as 0 if fetch fails
              }
            }
            
            lastPingTime = Date.now();
            
            // Use the more accurate TCP connection time
            const latency = pingResult.time;
            logger.network(`TCP latency: ${formatLatency(latency)}`);
            
            // Style the response status
            const statusColor = responseStatus >= 200 && responseStatus < 300 ? 
                chalk.green : (responseStatus >= 300 && responseStatus < 400 ? 
                chalk.yellow : chalk.red);
            
            logger.success(`Response status: ${statusColor(responseStatus || 'unknown')}`);
            
            // Increment our rewards counter
            pendingPayouts += COST_PER_VALIDATION;
            logger.success(`Rewards: +${COST_PER_VALIDATION} lamports (Total: ${pendingPayouts})`);
            
            // Send validation result
            if ((responseStatus >= 400 && responseStatus <600) || responseStatus == 0 || responseStatus == "unknown") {
              console.log("Inside if condition")
              // If bad status, get location again to ensure freshness
              let locationInfo = location;
              try {
                const locationResponse = await axios.get("https://ipinfo.io/json");
                locationInfo = `${locationResponse.data.city}, ${locationResponse.data.region}`;
              } catch (err) {
                logger.warn(`Could not update location: ${err.message}`);
              }
              
              wsConnection.send(
                JSON.stringify({
                  type: "validate",
                  data: {
                    callbackId,
                    status: "Bad",
                    latency : 0,
                    validatorId,
                    signedMessage: signature,
                    location: locationInfo,
                    ipAddress,
                  },
                })
              );
            } else {
              // Good status
              wsConnection.send(
                JSON.stringify({
                  type: "validate",
                  data: {
                    callbackId,
                    status: "Good", 
                    latency,
                    validatorId,
                    signedMessage: signature,
                    location,
                    ipAddress,
                  },
                })
              );
            }
          } catch (error) {
            logger.error(`Website check failed: ${error.message}`);
            
            // Still increment our rewards counter
            pendingPayouts += COST_PER_VALIDATION;
            
            // Try to get fresh location data
            let locationInfo = location;
            try {
              const locationResponse = await axios.get("https://ipinfo.io/json");
              locationInfo = `${locationResponse.data.city}, ${locationResponse.data.region}`;
              logger.log(`Location : ${locationInfo}`);
            } catch (err) {
              logger.error(`Error in getting the location: ${err.message}`);
            }
            
            // Send failure result
            wsConnection.send(
              JSON.stringify({
                type: "validate",
                data: {
                  callbackId,
                  status: "Bad",
                  latency: 0,
                  validatorId,
                  signedMessage: signature,
                  location: locationInfo,
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
    
    // Handle WebSocket close
    wsConnection.on("close", () => {
      if (isValidating) {
        console.log(chalk.yellow('\n ┌─────────────────────────────────────┐'));
        console.log(chalk.yellow(' │        CONNECTION INTERRUPTED        │'));
        console.log(chalk.yellow(' └─────────────────────────────────────┘\n'));
        
        logger.warn("Reconnecting in 5 seconds...");
        setTimeout(() => connectWebsocket(privateKeyBase64, hubServer), 5000);
      }
    });
    
    // Handle WebSocket errors
    wsConnection.on("error", (error) => {
      logger.error(`WebSocket error: ${error.message}`);
      wsConnection.close();
    });
    
    return wsConnection;
  } catch (error) {
    if (spinner) spinner.fail(`Connection failed: ${error.message}`);
    logger.error(`Failed to connect: ${error.message}`);
    throw error;
  }
};

/**
 * Get the current validator status
 * @returns {object} - Current validator status
 */
const getValidatorStatus = () => {
  return {
    connected: wsConnection && wsConnection.readyState === WebSocket.OPEN,
    validatorId,
    location,
    ipAddress,
    lastPingTime,
    pendingPayouts
  };
};

/**
 * Stop the validator
 */
const stopValidator = () => {
  isValidating = false;
  if (wsConnection) {
    wsConnection.close();
  }
};

module.exports = { 
  connectWebsocket, 
  getValidatorStatus, 
  stopValidator,
  signMessage
};