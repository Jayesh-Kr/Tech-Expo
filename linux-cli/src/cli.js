const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const nacl = require("tweetnacl");
const naclUtil = require("tweetnacl-util");
const axios = require("axios");
const ora = require("ora");
const figlet = require("figlet");
const Table = require('cli-table3');
const chalk = require('chalk');
const dns = require('dns');
const { startValidator, getValidatorStatus, loadPrivateKeyFromFile } = require("./validator");
const logger = require("../utils/logger");
const packageJson = require('../package.json');
const { execSync } = require('child_process');
const network = require('../utils/network');

// Helper function to display ASCII art banner
function displayBanner() {
  console.log(chalk.magentaBright(figlet.textSync('Validator CLI', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })));
  console.log(chalk.greenBright(`v${packageJson.version} - Linux Validator CLI\n`));
}

// Helper function to ensure a directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.log(`Created directory: ${dirPath}`);
  }
  return dirPath;
}

// Helper function to verify Linux environment
function verifyLinuxEnvironment() {
  if (process.platform !== 'linux') {
    logger.error('This CLI is designed for Linux systems only');
    process.exit(1);
  }
  
  // Check for required Linux utilities
  try {
    execSync('which ping > /dev/null');
    execSync('which cat > /dev/null');
    execSync('which grep > /dev/null');
  } catch (error) {
    logger.error('Required Linux utilities are missing. Please ensure ping, cat, and grep are installed.');
    process.exit(1);
  }
  
  return true;
}

program
  .name("validator-cli")
  .description("A decentralized uptime validator CLI for Linux")
  .version(packageJson.version)
  .addHelpText('after', `
Examples:
  $ validator-cli start keyfile.txt     Start the validator node with the specified private key
  $ validator-cli info keyfile.txt      Show validator information
  $ validator-cli ping example.com      Manually ping a website
  $ validator-cli system                Display system information
  `);

// Explicitly add help option (Commander already provides -h and --help, but we'll make it more visible)
program
  .option('-help', 'Display help information', false);

program
  .command("start")
  .description("Start the validator node")
  .argument('<keypath>', 'Path to your private key file')
  .option("-c, --config <path>", "Path to config file", "./config/config.json")
  .action(async (keypath, options) => {
    verifyLinuxEnvironment();
    displayBanner();
    
    const keyPath = path.resolve(keypath);
    const configPath = path.resolve(options.config);

    if (!fs.existsSync(keyPath)) {
      logger.error(`Private key file not found at: ${keyPath}`);
      logger.log("Please provide a valid private key file path");
      process.exit(1);
    }

    // Check file permissions for private key
    try {
      const stats = fs.statSync(keyPath);
      const permissions = stats.mode & 0o777;
      if (permissions > 0o600) {
        logger.warn(`Warning: Your private key file has lax permissions (${permissions.toString(8)})`);
        logger.warn(`Consider running: chmod 600 ${keyPath}`);
      }
    } catch (error) {
      logger.warn(`Could not check file permissions: ${error.message}`);
    }

    // Create config file if it doesn't exist
    if (!fs.existsSync(configPath)) {
      const defaultConfig = {
        hubServer: "ws://localhost:8081",
      };
      
      try {
        const configDir = path.dirname(configPath);
        if (!fs.existsSync(configDir)) {
          fs.mkdirSync(configDir, { recursive: true });
        }
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        logger.success(`Created default config at: ${configPath}`);
      } catch (error) {
        logger.error(`Failed to create default config: ${error.message}`);
      }
    }

    logger.log("Starting validator node...");
    logger.log(`Using private key: ${keyPath}`);
    logger.log(`Using config: ${configPath}`);
    
    // Show a nice spinner while connecting
    const spinner = ora({text: 'Connecting to hub server...', color: 'cyan'}).start();
    
    try {
      // Set the config path in environment
      process.env.CONFIG_PATH = configPath;
      
      // Start the validator with the spinner for feedback
      await startValidator(keyPath, spinner);
    } catch (error) {
      spinner.fail(`Failed to start validator: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("ping <url>")
  .description("Manually ping a specific URL")
  .action(async (url) => {
    verifyLinuxEnvironment();
    displayBanner();
    logger.ping(`Pinging URL: ${url}...`);
    
    try {
      const spinner = ora({text: 'Measuring network latency...', color: 'magenta'}).start();
      
      // Use our dedicated network module for network ping only
      const results = await network.measureLatency(url);
      
      spinner.succeed(chalk.greenBright('Ping measurement complete'));
      
      // Display results in a table with improved colors
      const table = new Table({
        head: [chalk.hex('#FF00FF')('Metric'), chalk.hex('#FF00FF')('Value (ms)')],
        colWidths: [30, 15],
        style: { head: [], border: [] }
      });
      
      if (results.networkPing) {
        table.push(['Network Ping (ICMP)', chalk.hex('#00FFFF')(results.networkPing)]);
      } else {
        table.push(['Network Ping (ICMP)', chalk.gray('N/A')]);
      }
      
      if (results.dnsTime) {
        table.push(['DNS Resolution', chalk.cyan(results.dnsTime)]);
      }
      
      console.log(table.toString());
      
      // Show status information
      if (results.status) {
        const statusColor = results.status >= 200 && results.status < 300 ? 'greenBright' : 
                           (results.status >= 300 && results.status < 400 ? 'yellowBright' : 'redBright');
        logger.log(`Status: ${chalk[statusColor](results.status)}`);
      }
      
      // Show recommendation based only on network ping
      if (results.networkPing) {
        if (results.networkPing < 100) {
          logger.network(`Excellent latency: ${results.networkPing}ms`);
        } else if (results.networkPing < 300) {
          logger.network(`Good latency: ${results.networkPing}ms`);
        } else {
          logger.network(`High latency: ${results.networkPing}ms`);
        }
      } else {
        logger.warn('Network ping could not be measured');
      }
    } catch (error) {
      logger.error(`Failed to ping ${url}: ${error.message}`);
    }
  });

program
  .command("info")
  .description("Show validator information")
  .argument('[keypath]', 'Path to your private key file', './config/privateKey.txt')
  .action((keypath) => {
    verifyLinuxEnvironment();
    displayBanner();
    const keyPath = path.resolve(keypath);
    
    if (!fs.existsSync(keyPath)) {
      logger.error(`Private key file not found at: ${keyPath}`);
      return;
    }
    
    try {
      const keypair = loadPrivateKeyFromFile(keyPath);
      const publicKeyBase64 = naclUtil.encodeBase64(keypair.publicKey);
      
      // Let's retrieve the IP separately
      axios.get("https://ipinfo.io/json")
        .then(response => {
          const ip = response.data.ip || "Unknown";
          const location = `${response.data.city || 'Unknown'}, ${response.data.region || 'Unknown'}, ${response.data.country || 'Unknown'}`;
          
          const status = getValidatorStatus();
          
          logger.title("Validator Information");
          
          const table = new Table({
            head: [chalk.cyanBright('Property'), chalk.cyanBright('Value')],
            colWidths: [20, 60],
            style: { head: [], border: [] }
          });
          
          table.push(
            ['Public Key', publicKeyBase64],
            ['IP Address', ip],
            ['Location', location],
            ['Platform', 'Linux']
          );
          
          // Check if server is running by reading /proc filesystem
          let isRunning = false;
          try {
            // Check if there's a process with validator-cli in its name
            execSync('ps aux | grep -v grep | grep validator-cli > /dev/null');
            isRunning = true;
          } catch (error) {
            // Process not found, ignore error
          }
          
          if (status.validatorId) {
            table.push(
              ['Validator ID', status.validatorId],
              ['Connected', status.connected ? chalk.green('Yes') : chalk.red('No')],
              ['Status', status.connected ? chalk.green('Online') : chalk.red('Offline')],
              ['Service', isRunning ? chalk.green('Running') : chalk.red('Stopped')]
            );
          } else {
            table.push(
              ['Status', chalk.yellow('Not Started')],
              ['Service', isRunning ? chalk.green('Running') : chalk.red('Stopped')]
            );
          }
          
          // Add Linux-specific info
          try {
            const hostname = execSync('hostname').toString().trim();
            const kernelVersion = execSync('uname -r').toString().trim();
            
            table.push(
              ['Hostname', hostname],
              ['Kernel', kernelVersion]
            );
          } catch (error) {
            logger.warn(`Could not retrieve system information: ${error.message}`);
          }
          
          console.log(table.toString());
        })
        .catch(error => {
          logger.error(`Failed to retrieve IP information: ${error.message}`);
        });
    } catch (error) {
      logger.error(`Failed to load validator information: ${error.message}`);
    }
  });

// New Linux-specific command
program
  .command("system")
  .description("Display system information")
  .action(() => {
    verifyLinuxEnvironment();
    displayBanner();
    
    try {
      const spinner = ora({text: 'Gathering system information...', color: 'blue'}).start();
      
      // Initialize default values for everything
      let cpuInfo = { model: 'Unknown CPU', cores: 0 };
      let memInfo = { totalFormatted: 'Unknown' };
      let hostname = 'Unknown hostname';
      let kernelVersion = 'Unknown kernel';
      let distroName = 'Unknown Linux distribution';
      let diskTotal = 'Unknown';
      let diskUsed = 'Unknown';
      let diskFree = 'Unknown';
      
      // Get CPU and memory info using our Linux utils - catch errors separately
      try {
        cpuInfo = network.linuxUtils.getCpuInfo();
      } catch (e) {
        logger.log(`Could not get CPU info: ${e.message}`);
      }
      
      try {
        memInfo = network.linuxUtils.getMemInfo();
      } catch (e) {
        logger.log(`Could not get memory info: ${e.message}`);
      }
      
      // Get additional system info - catch errors separately for each command
      try {
        hostname = execSync('hostname 2>/dev/null').toString().trim();
      } catch (e) {
        // Fallback if hostname command not available
        try {
          hostname = execSync('cat /etc/hostname 2>/dev/null').toString().trim();
        } catch (fallbackErr) {
          hostname = 'Unknown hostname';
        }
      }
      
      try {
        kernelVersion = execSync('uname -r 2>/dev/null').toString().trim();
      } catch (e) {
        kernelVersion = 'Unknown kernel';
      }
      
      try {
        const distribution = execSync('cat /etc/os-release 2>/dev/null | grep PRETTY_NAME').toString().trim();
        const distroMatch = distribution.match(/PRETTY_NAME="(.*)"/);
        distroName = distroMatch ? distroMatch[1] : 'Unknown Linux';
      } catch (e) {
        // Fallback detection methods
        try {
          // Try lsb_release if available
          distroName = execSync('lsb_release -d 2>/dev/null').toString().trim().replace('Description:', '').trim();
        } catch (fallbackErr) {
          distroName = 'Unknown Linux';
        }
      }
      
      // Get disk space with fallback
      try {
        const diskInfo = execSync('df -h / 2>/dev/null | tail -n 1').toString().trim().split(/\s+/);
        diskTotal = diskInfo[1] || 'Unknown';
        diskUsed = diskInfo[2] || 'Unknown';
        diskFree = diskInfo[3] || 'Unknown';
      } catch (e) {
        logger.log(`Could not get disk info: ${e.message}`);
      }
      
      spinner.succeed(chalk.greenBright('System information gathered'));
      
      logger.title("Linux System Information");
      
      const table = new Table({
        head: [chalk.blueBright('Component'), chalk.blueBright('Details')],
        colWidths: [20, 60],
        style: { head: [], border: [] }
      });
      
      table.push(
        ['Hostname', hostname],
        ['Distribution', distroName],
        ['Kernel', kernelVersion],
        ['CPU', cpuInfo.model],
        ['CPU Cores', cpuInfo.cores.toString()],
        ['Memory', memInfo.totalFormatted],
        ['Disk Total', diskTotal],
        ['Disk Used', diskUsed],
        ['Disk Free', diskFree]
      );
      
      console.log(table.toString());
      
      // Check for required system utilities with better error handling
      try {
        const requiredUtils = ['ping', 'cat', 'grep', 'ps', 'df', 'hostname', 'uname'];
        const availableUtils = [];
        const missingUtils = [];
        
        for (const util of requiredUtils) {
          try {
            execSync(`which ${util} 2>/dev/null`);
            availableUtils.push(util);
          } catch (error) {
            missingUtils.push(util);
          }
        }
        
        if (missingUtils.length > 0) {
          logger.warn(`Missing recommended utilities: ${missingUtils.join(', ')}`);
          logger.log(`The CLI will work with limited functionality.`);
        } else {
          logger.success('All required system utilities are available');
        }
        
        logger.log(`\nFor optimal performance, ensure your system has: ${requiredUtils.join(', ')}`);
      } catch (error) {
        logger.warn(`Could not check for required utilities: ${error.message}`);
      }
    } catch (error) {
      logger.error(`Failed to gather system information: ${error.message}`);
    }
  });

// Add install command to set up proper permissions and symlinks
program
  .command("install")
  .description("Configure the validator CLI for Linux use")
  .action(() => {
    verifyLinuxEnvironment();
    displayBanner();
    
    try {
      const spinner = ora({text: 'Setting up validator CLI for Linux...', color: 'yellow'}).start();
      
      // Ensure the bin directory has executable permissions
      const binPath = path.resolve(__dirname, '../bin/index.js');
      if (fs.existsSync(binPath)) {
        execSync(`chmod +x ${binPath}`);
      }
      
      // Check if we're running as root
      const isRoot = process.getuid && process.getuid() === 0;
      let globalInstall = false;
      
      if (isRoot) {
        try {
          // Create a symlink in /usr/local/bin if we have permissions
          execSync(`ln -sf ${binPath} /usr/local/bin/validator-cli`);
          globalInstall = true;
        } catch (error) {
          // Fall back to local installation
          execSync('npm link');
        }
      } else {
        // For non-root users, use npm link
        execSync('npm link');
      }
      
      // Create config directory with correct permissions
      const configDir = path.resolve(process.env.HOME || process.env.USERPROFILE, '.validator-cli');
      ensureDirectoryExists(configDir);
      execSync(`chmod 755 ${configDir}`);
      
      spinner.succeed(chalk.greenBright('Validator CLI setup complete'));
      
      if (globalInstall) {
        logger.success('Validator CLI installed globally at /usr/local/bin/validator-cli');
      } else {
        logger.success('Validator CLI linked via npm. You can use it from any terminal.');
      }
      
      logger.log('Configuration directory created at: ' + configDir);
      logger.log(`\nTo start using the CLI, run: ${chalk.cyan('validator-cli -help')}`);
    } catch (error) {
      logger.error(`Failed to set up validator CLI: ${error.message}`);
    }
  });

// Execute the program
program.parse(process.argv);

// Show help if no command provided or if -help flag is used
if (!process.argv.slice(2).length || program.opts().help) {
  displayBanner();
  program.outputHelp();
}