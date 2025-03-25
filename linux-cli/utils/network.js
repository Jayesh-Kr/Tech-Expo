const { execSync } = require('child_process');
const dns = require('dns');
const http = require('http');
const https = require('https');
const net = require('net');
const axios = require('axios');
const logger = require('./logger');

// Force isWindows to be false since we're targeting Linux
const isWindows = false;

/**
 * Measure network latency using system ping
 * @param {string} hostname The hostname to ping
 * @returns {Promise<number|null>} The ping latency in ms, or null if failed
 */
async function getNetworkLatency(hostname) {
  try {
    // Linux-specific ping command
    const pingCmd = `ping -c 3 -q ${hostname}`;
    const pingOutput = execSync(pingCmd, { timeout: 5000 }).toString();
    
    // Primary Linux format pattern: "round-trip min/avg/max/mdev = 20.771/21.076/21.405/0.263 ms"
    const roundTripMatch = pingOutput.match(/min\/avg\/max\/mdev\s*=\s*[\d.]+\/([\d.]+)\/[\d.]+\/[\d.]+\s*ms/);
    if (roundTripMatch && roundTripMatch[1]) {
      return parseFloat(roundTripMatch[1]);
    }
    
    // Alternative Linux format: "time=21.1 ms"
    const timeMatch = pingOutput.match(/time=([\d.]+)\s*ms/);
    if (timeMatch && timeMatch[1]) {
      return parseFloat(timeMatch[1]);
    }
    
    // If no pattern matched, try a more generic approach
    const genericMatch = pingOutput.match(/[=<]([\d.]+)\s*ms/);
    if (genericMatch && genericMatch[1]) {
      return parseFloat(genericMatch[1]);
    }
    
    logger.log(`Could not extract ping time from output: ${pingOutput}`);
    return null;
  } catch (error) {
    // On Linux, we'll log the specific error to help with debugging
    logger.log(`Network ping failed: ${error.message}`);
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
      if (err) {
        logger.log(`DNS resolution failed: ${err.message}`);
        resolve(null);
      } else {
        resolve(resolveTime);
      }
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
    
    socket.on('error', (err) => {
      socket.destroy();
      logger.log(`TCP connection failed: ${err.message}`);
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
async function performHeadRequest(url, timeout = 2000, maxRedirects = 5) {
  const startTime = Date.now();
  try {
    const { protocol, hostname, pathname, search } = new URL(url);
    const port = protocol === 'https:' ? 443 : 80;

    return new Promise((resolve, reject) => {
      const makeRequest = (currentUrl, redirectCount = 0) => {
        const { protocol, hostname, pathname, search } = new URL(currentUrl);
        const options = {
          method: 'HEAD',
          hostname: hostname,
          path: pathname + (search || ''),
          port: protocol === 'https:' ? 443 : 80,
          timeout: timeout,
          headers: {
            'Cache-Control': 'no-cache',
            'Connection': 'close',
            'User-Agent': 'ValidatorCLI/1.0 Linux',
          },
        };

        const req = (protocol === 'https:' ? https : http).request(options, (res) => {
          if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
            if (redirectCount >= maxRedirects) {
              reject(new Error('Too many redirects'));
              return;
            }

            const location = res.headers.location;
            if (!location) {
              reject(new Error('Redirect location missing'));
              return;
            }

            // Resolve the redirect URL relative to the current URL
            const redirectUrl = new URL(location, currentUrl).toString();
            makeRequest(redirectUrl, redirectCount + 1);
          } else {
            resolve({
              time: Date.now() - startTime,
              status: res.statusCode,
              finalUrl: currentUrl, // Include the final URL after redirects
            });
          }
        });

        req.on('error', (e) => {
          reject(e);
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timed out'));
        });

        req.end();
      };

      makeRequest(url);
    });
  } catch (error) {
    return {
      time: Date.now() - startTime,
      status: 0,
      error: error.message,
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
    useHeadRequest: true,
    maxRedirects: 5,
  };

  const config = { ...defaults, ...options };

  try {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    const results = {
      url,
      networkPing: null,
      httpLatency: null,
      dnsTime: null,
      status: null,
      finalUrl: url, // Track the final URL after redirects
    };

    // For speed, run DNS and ping in parallel
    const [networkPing, dnsTime] = await Promise.all([
      getNetworkLatency(hostname),
      config.measureDns ? getDnsResolutionTime(hostname) : Promise.resolve(null),
    ]);

    results.networkPing = networkPing;
    results.dnsTime = dnsTime;

    // Perform a HEAD request for fastest response
    if (config.useHeadRequest) {
      try {
        const headResponse = await performHeadRequest(url, config.timeout, config.maxRedirects);
        results.httpLatency = headResponse.time;
        results.status = headResponse.status;
        results.finalUrl = headResponse.finalUrl; // Update final URL
      } catch (headError) {
        // Fall back to a simple axios check if HEAD fails
        try {
          const startTime = Date.now();
          const response = await axios.get(url, {
            timeout: config.timeout,
            headers: { 
              'Cache-Control': 'no-cache',
              'User-Agent': 'ValidatorCLI/1.0 Linux'
            },
            maxRedirects: config.maxRedirects, // Follow redirects
            validateStatus: () => true,
          });
          results.httpLatency = Date.now() - startTime;
          results.status = response.status;
          results.finalUrl = response.request.res.responseUrl; // Capture final URL
        } catch (getError) {
          results.status = 0;
          logger.log(`HTTP request failed: ${getError.message}`);
        }
      }
    } else {
      // If not using HEAD, fall back to regular GET
      try {
        const startTime = Date.now();
        const response = await axios.get(url, {
          timeout: config.timeout,
          headers: { 
            'Cache-Control': 'no-cache',
            'User-Agent': 'ValidatorCLI/1.0 Linux'
          },
          maxRedirects: config.maxRedirects,
          validateStatus: () => true,
        });
        results.httpLatency = Date.now() - startTime;
        results.status = response.status;
        results.finalUrl = response.request.res.responseUrl;
      } catch (error) {
        results.status = 0;
        logger.log(`HTTP request failed: ${error.message}`);
      }
    }

    return results;
  } catch (error) {
    // Special handling for URL errors - if it's just a domain, try to ping it directly
    if (error instanceof TypeError && error.message.includes('Invalid URL')) {
      try {
        const hostname = url.replace(/^https?:\/\//, '');
        const networkPing = await getNetworkLatency(hostname);
        
        return {
          url: `https://${hostname}`,
          networkPing: networkPing,
          httpLatency: null,
          dnsTime: null,
          status: null,
          error: 'Invalid URL format, but network ping performed'
        };
      } catch (pingError) {
        logger.error(`Failed to measure latency: ${pingError.message}`);
      }
    }
    
    logger.error(`Latency measurement failed: ${error.message}`);
    return {
      url,
      networkPing: null,
      httpLatency: null,
      dnsTime: null,
      status: 0,
      error: error.message,
    };
  }
}

// Linux-specific utility functions
const linuxUtils = {
  /**
   * Get CPU information using Linux commands
   * @returns {Object} CPU information
   */
  getCpuInfo: function() {
    try {
      // Try different methods to get CPU info
      let cpuInfo;
      let cores = 0;
      
      // Method 1: /proc/cpuinfo
      try {
        cpuInfo = execSync('cat /proc/cpuinfo 2>/dev/null | grep "model name" | head -n1').toString().trim();
        const modelMatch = cpuInfo.match(/model name\s*:\s*(.*)/);
        if (modelMatch && modelMatch[1]) {
          cpuInfo = modelMatch[1];
        }
      } catch (error) {
        // Method 2: lscpu
        try {
          cpuInfo = execSync('lscpu 2>/dev/null | grep "Model name"').toString().trim();
          const modelMatch = cpuInfo.match(/Model name\s*:\s*(.*)/);
          if (modelMatch && modelMatch[1]) {
            cpuInfo = modelMatch[1];
          }
        } catch (err) {
          cpuInfo = 'Unknown CPU';
        }
      }
      
      // Try different methods to get CPU cores
      try {
        // Method 1: nproc
        cores = parseInt(execSync('nproc 2>/dev/null').toString().trim());
      } catch (error) {
        // Method 2: /proc/cpuinfo with grep
        try {
          const coreInfo = execSync('grep -c processor /proc/cpuinfo 2>/dev/null').toString().trim();
          cores = parseInt(coreInfo);
        } catch (err) {
          cores = 0;
        }
      }
      
      return {
        model: cpuInfo,
        cores: isNaN(cores) ? 0 : cores
      };
    } catch (error) {
      return { model: 'Unknown CPU', cores: 0 };
    }
  },
  
  /**
   * Get memory information using Linux commands
   * @returns {Object} Memory information
   */
  getMemInfo: function() {
    try {
      let memTotal = 0;
      let totalFormatted = 'Unknown';
      
      // Method 1: /proc/meminfo
      try {
        const memInfo = execSync('grep MemTotal /proc/meminfo 2>/dev/null').toString().trim();
        const totalMatch = memInfo.match(/MemTotal:\s*(\d+)\s*kB/);
        if (totalMatch && totalMatch[1]) {
          memTotal = Math.round(parseInt(totalMatch[1]) / 1024);
          totalFormatted = `${memTotal} MB`;
        }
      } catch (error) {
        // Method 2: free command
        try {
          const freeOutput = execSync('free -m 2>/dev/null | grep Mem').toString().trim();
          const parts = freeOutput.split(/\s+/);
          if (parts.length >= 2) {
            memTotal = parseInt(parts[1]);
            totalFormatted = `${memTotal} MB`;
          }
        } catch (err) {
          // Fallback to default
          totalFormatted = 'Unknown';
        }
      }
      
      // Convert to human-readable GB if large enough
      if (memTotal >= 1024) {
        const gbValue = (memTotal / 1024).toFixed(1);
        totalFormatted = `${gbValue} GB`;
      }
      
      return {
        total: memTotal,
        totalFormatted: totalFormatted
      };
    } catch (error) {
      return { total: 0, totalFormatted: 'Unknown' };
    }
  },
  
  /**
   * Get disk information
   * @returns {Object} Disk information
   */
  getDiskInfo: function() {
    try {
      // Try df command
      const dfOutput = execSync('df -h / 2>/dev/null | tail -n 1').toString().trim();
      const parts = dfOutput.split(/\s+/);
      
      return {
        filesystem: parts[0] || 'Unknown',
        total: parts[1] || 'Unknown',
        used: parts[2] || 'Unknown',
        available: parts[3] || 'Unknown',
        usedPercent: parts[4] || 'Unknown',
        mountPoint: parts[5] || '/'
      };
    } catch (error) {
      return {
        filesystem: 'Unknown',
        total: 'Unknown',
        used: 'Unknown',
        available: 'Unknown',
        usedPercent: 'Unknown',
        mountPoint: '/'
      };
    }
  },
  
  /**
   * Check if a command exists
   * @param {string} command Command to check
   * @returns {boolean} Whether the command exists
   */
  commandExists: function(command) {
    try {
      execSync(`which ${command} 2>/dev/null`);
      return true;
    } catch (error) {
      return false;
    }
  }
};

module.exports = {
  getNetworkLatency,
  getDnsResolutionTime,
  getTcpConnectionTime,
  performHeadRequest,
  measureLatency,
  linuxUtils
};
