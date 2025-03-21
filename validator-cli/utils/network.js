const { execSync } = require('child_process');
const dns = require('dns');
const http = require('http');
const https = require('https');
const net = require('net');
const axios = require('axios');
const logger = require('./logger');

// Check if we're on Windows to adjust the ping command
const isWindows = process.platform === 'win32';

/**
 * Measure network latency using system ping
 * @param {string} hostname The hostname to ping
 * @returns {Promise<number|null>} The ping latency in ms, or null if failed
 */
async function getNetworkLatency(hostname) {
  try {
    // Adjust ping command based on OS
    const pingCmd = isWindows ? `ping -n 1 ${hostname}` : `ping -c 1 ${hostname}`;
    const pingOutput = execSync(pingCmd, { timeout: 3000 }).toString();
    
    // Different regex patterns for different OS outputs
    let match = null;
    
    if (isWindows) {
      // Windows format: "Minimum = 10ms, Maximum = 10ms, Average = 10ms"
      const avgMatch = pingOutput.match(/Average\s*=\s*(\d+)ms/);
      if (avgMatch && avgMatch[1]) {
        return parseInt(avgMatch[1], 10);
      }
      
      // Alternative Windows format: "time=10ms TTL=54"
      const timeMatch = pingOutput.match(/time[=<](\d+)ms/);
      if (timeMatch && timeMatch[1]) {
        return parseInt(timeMatch[1], 10);
      }
    } else {
      // Unix/Linux/Mac format: "time=10.123 ms"
      const timeMatch = pingOutput.match(/time=(\d+(\.\d+)?)\s*ms/);
      if (timeMatch && timeMatch[1]) {
        return parseFloat(timeMatch[1]);
      }
    }
    
    // If no pattern matched, try a more generic approach
    const genericMatch = pingOutput.match(/[=<](\d+(\.\d+)?)\s*ms/);
    if (genericMatch && genericMatch[1]) {
      return parseFloat(genericMatch[1]);
    }
    
    logger.log(`Could not extract ping time from output: ${pingOutput}`);
    return null;
  } catch (error) {
    // Don't log the error to avoid cluttering the output
    return null;
  }
}

/**
 * Measure DNS resolution time
 * @param {string} hostname The hostname to resolve
 * @returns {Promise<number>} The DNS resolution time in ms
 */
function getDnsResolutionTime(hostname) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    dns.lookup(hostname, (err) => {
      const resolveTime = Date.now() - startTime;
      resolve(err ? null : resolveTime);
    });
  });
}

/**
 * Measure TCP connection time to a host
 * @param {string} hostname The hostname to connect to
 * @param {number} port The port to connect to
 * @returns {Promise<number|null>} The connection time in ms, or null if failed
 */
function getTcpConnectionTime(hostname, port) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const socket = new net.Socket();
    
    socket.setTimeout(2000); // 2 second timeout
    
    socket.on('connect', () => {
      const connectTime = Date.now() - startTime;
      socket.destroy();
      resolve(connectTime);
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
}

/**
 * Perform a simple, fast HTTP HEAD request with accurate timing
 * @param {string} url The URL to request
 * @param {number} timeout Timeout in ms
 * @returns {Promise<{time: number, status: number}>} Time and status
 */
async function performHeadRequest(url, timeout = 2000) {
  const startTime = Date.now();
  try {
    // Use lower-level http/https modules for more consistent timing
    const { protocol, hostname, pathname, search } = new URL(url);
    
    return new Promise((resolve, reject) => {
      const options = {
        method: 'HEAD',
        hostname: hostname,
        path: pathname + (search || ''),
        timeout: timeout,
        headers: {
          'Cache-Control': 'no-cache',
          'Connection': 'close' // Ensure connection is closed after request
        }
      };
      
      const req = (protocol === 'https:' ? require('https') : require('http')).request(options, (res) => {
        // Resolve as soon as we get headers, don't wait for body
        resolve({
          time: Date.now() - startTime,
          status: res.statusCode
        });
        
        // Consume a small amount of the response then end
        res.on('data', () => {});
        res.resume();
      });
      
      req.on('error', (e) => {
        reject(e);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });
      
      // End immediately since we don't need to send body data
      req.end();
    });
  } catch (error) {
    return { 
      time: Date.now() - startTime,
      status: 0,
      error: error.message
    };
  }
}

/**
 * Perform optimized latency measurement to a URL
 * @param {string} url The URL to measure
 * @param {Object} options Configuration options
 * @returns {Promise<Object>} Latency measurements
 */
async function measureLatency(url, options = {}) {
  const defaults = {
    timeout: 3000,
    preferNetworkPing: true,
    measureDns: true,
    useHeadRequest: true
  };
  
  const config = { ...defaults, ...options };
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    const results = {
      url,
      networkPing: null,
      httpLatency: null,
      dnsTime: null,
      status: null
    };
    
    // For speed, run DNS and ping in parallel
    const [networkPing, dnsTime] = await Promise.all([
      getNetworkLatency(hostname),
      config.measureDns ? getDnsResolutionTime(hostname) : Promise.resolve(null)
    ]);
    
    results.networkPing = networkPing;
    results.dnsTime = dnsTime;
    
    // Perform a HEAD request for fastest response
    if (config.useHeadRequest) {
      try {
        const headResponse = await performHeadRequest(url, config.timeout);
        results.httpLatency = headResponse.time;
        results.status = headResponse.status;
      } catch (headError) {
        // Fall back to a simple axios check if HEAD fails
        try {
          const startTime = Date.now();
          const response = await axios.get(url, {
            timeout: config.timeout,
            headers: { 'Cache-Control': 'no-cache' },
            validateStatus: () => true
          });
          results.httpLatency = Date.now() - startTime;
          results.status = response.status;
        } catch (getError) {
          results.status = 0;
        }
      }
    } else {
      // If not using HEAD, fall back to regular GET
      try {
        const startTime = Date.now();
        const response = await axios.get(url, {
          timeout: config.timeout,
          headers: { 'Cache-Control': 'no-cache' },
          validateStatus: () => true
        });
        results.httpLatency = Date.now() - startTime;
        results.status = response.status;
      } catch (error) {
        results.status = 0;
      }
    }
    
    // Choose the best latency measure in this order:
    // 1. Network ping (if available and preferred)
    // 2. HTTP latency (if available)
    results.bestLatency = (config.preferNetworkPing && results.networkPing) ? 
      results.networkPing : results.httpLatency;
    
    return results;
  } catch (error) {
    return {
      url,
      error: error.message,
      networkPing: null,
      httpLatency: null,
      status: 0
    };
  }
}

module.exports = {
  getNetworkLatency,
  getDnsResolutionTime,
  getTcpConnectionTime,
  performHeadRequest,
  measureLatency
};
