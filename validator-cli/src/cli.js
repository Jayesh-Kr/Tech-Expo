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
  console.log(chalk.greenBright(`v${packageJson.version} - A decentralized uptime validator\n`));
}

// Helper function to ensure a directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.log(`Created directory: ${dirPath}`);
  }
  return dirPath;
}

program
  .name("validator-cli")
  .description("A decentralized uptime validator CLI")
  .version(packageJson.version)
  .addHelpText('after', `
Examples:
  $ validator-cli start keyfile.txt     Start the validator node with the specified private key
  $ validator-cli info keyfile.txt      Show validator information
  $ validator-cli ping example.com      Manually ping a website
  `);

// Explicitly add help option (Commander already provides -h and --help, but we'll make it more visible)
program
  .option('-help', 'Display help information', false);

program
  .command("generate-keys")
  .description("Generate new validator keypair")
  .option("-o, --output <directory>", "Output directory for keys", "./config")
  .action(async (options) => {
    displayBanner();
    const spinner = ora({text: 'Generating new validator keypair...', color: 'cyan'}).start();
    
    try {
      const keyPair = nacl.sign.keyPair();
      const privateKeyBase64 = naclUtil.encodeBase64(keyPair.secretKey);
      const publicKeyBase64 = naclUtil.encodeBase64(keyPair.publicKey);
      
      const outputDir = path.resolve(options.output);
      ensureDirectoryExists(outputDir);
      
      const privateKeyPath = path.join(outputDir, "privateKey.txt");
      const publicKeyPath = path.join(outputDir, "publicKey.txt");
      
      fs.writeFileSync(privateKeyPath, privateKeyBase64);
      fs.writeFileSync(publicKeyPath, publicKeyBase64);
      
      spinner.succeed(chalk.greenBright('Keys generated successfully'));
      
      // Display key info in a table with improved colors
      const table = new Table({
        head: [chalk.cyanBright('Key Type'), chalk.cyanBright('Location')],
        colWidths: [15, 60],
        style: { head: [], border: [] }
      });
      
      table.push(
        ['Private Key', privateKeyPath],
        ['Public Key', publicKeyPath]
      );
      
      console.log(table.toString());
      logger.warn("Keep your private key safe and do not share it with anyone!");
    } catch (error) {
      spinner.fail(`Failed to generate keys: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("start")
  .description("Start the validator node")
  .argument('<keypath>', 'Path to your private key file')
  .option("-c, --config <path>", "Path to config file", "./config/config.json")
  .action(async (keypath, options) => {
    displayBanner();
    
    const keyPath = path.resolve(keypath);
    const configPath = path.resolve(options.config);

    if (!fs.existsSync(keyPath)) {
      logger.error(`Private key file not found at: ${keyPath}`);
      logger.log("Generate a keypair first using: validator-cli generate-keys");
      process.exit(1);
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
          const location = `${response.data.city}, ${response.data.region}, ${response.data.country}`;
          
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
            ['Location', location]
          );
          
          if (status.validatorId) {
            table.push(
              ['Validator ID', status.validatorId],
              ['Connected', status.connected ? chalk.green('Yes') : chalk.red('No')],
              ['Pending Rewards', `${status.pendingPayouts} lamports`]
            );
          }
          
          console.log(table.toString());
          
          if (!status.connected) {
            logger.log(`To start the validator: validator-cli start ${keyPath}`);
          }
        })
        .catch(error => {
          logger.log("Validator information:");
          logger.log(`Public key: ${publicKeyBase64}`);
          logger.log(`IP address: Unknown (${error.message})`);
        });
    } catch (error) {
      logger.error(`Failed to read private key: ${error.message}`);
    }
  });

program
  .command("rewards")
  .description("Show your validator rewards")
  .action(() => {
    displayBanner();
    
    const status = getValidatorStatus();
    
    if (!status.validatorId) {
      logger.warn("Validator is not connected to the hub. Start the validator first.");
      logger.log("Use: validator-cli start <keypath>");
      return;
    }
    
    logger.title("Validator Rewards");
    
    const table = new Table({
      head: [chalk.cyanBright('Property'), chalk.cyanBright('Value')],
      colWidths: [20, 60],
      style: { head: [], border: [] }
    });
    
    table.push(
      ['Validator ID', status.validatorId],
      ['Pending Rewards', `${status.pendingPayouts} lamports`],
      ['Estimated USD', `$${(status.pendingPayouts * 0.000001).toFixed(6)}`]
    );
    
    console.log(table.toString());
    
    if (status.connected) {
      logger.success("Your validator is online and earning rewards!");
    } else {
      logger.warn("Your validator is currently offline.");
      logger.log("Start it again to continue earning rewards.");
    }
  });

program
  .command("status")
  .description("Check the current status of the validator")
  .action(() => {
    displayBanner();
    
    const status = getValidatorStatus();
    
    const table = new Table({
      head: [chalk.cyanBright('Property'), chalk.cyanBright('Value')],
      colWidths: [20, 60],
      style: { head: [], border: [] }
    });
    
    table.push(
      ['Connected', status.connected ? chalk.green('Yes') : chalk.red('No')],
      ['Validator ID', status.validatorId || 'Not registered'],
      ['Location', status.location],
      ['IP Address', status.ipAddress],
      ['Pending Rewards', status.pendingPayouts ? `${status.pendingPayouts} lamports` : 'Not available']
    );
    
    console.log(table.toString());
    
    if (!status.connected) {
      logger.log("Validator is not connected to the hub.");
      logger.log("Start it with: validator-cli start <keypath>");
    }
  });

program
  .command("debug-ping <url>")
  .description("Perform a detailed latency analysis of a URL")
  .action(async (url) => {
    displayBanner();
    
    logger.title("Detailed Latency Analysis");
    logger.ping(`Target URL: ${chalk.hex('#00FFFF')(url)}`);
    
    const spinner = ora({text: 'Analyzing latency components...', color: 'magenta'}).start();
    
    try {
      // Get the hostname from the URL
      const { hostname } = new URL(url);
      
      // First try the Windows-friendly command
      spinner.text = 'Measuring network latency...';
      const isWindows = process.platform === 'win32';
      let pingCmd, pingOutput, networkLatency = null;
      
      try {
        // Try appropriate ping command for the OS
        pingCmd = isWindows ? `ping -n 1 ${hostname}` : `ping -c 1 ${hostname}`;
        pingOutput = execSync(pingCmd, { timeout: 3000 }).toString();
        
        logger.log("Ping output sample:");
        console.log(pingOutput.split('\n').slice(0, 4).join('\n'));
        
        // Extract latency using the correct pattern for the OS
        if (isWindows) {
          const avgMatch = pingOutput.match(/Average\s*=\s*(\d+)ms/);
          if (avgMatch && avgMatch[1]) {
            networkLatency = parseInt(avgMatch[1], 10);
          } else {
            const timeMatch = pingOutput.match(/time[=<](\d+)ms/);
            if (timeMatch && timeMatch[1]) {
              networkLatency = parseInt(timeMatch[1], 10);
            }
          }
        } else {
          const timeMatch = pingOutput.match(/time=(\d+(\.\d+)?)\s*ms/);
          if (timeMatch && timeMatch[1]) {
            networkLatency = parseFloat(timeMatch[1]);
          }
        }
      } catch (pingError) {
        logger.warn(`System ping failed: ${pingError.message}`);
      }
      
      spinner.text = 'Running DNS lookup...';
      // Use our network module for DNS resolution
      const startDns = Date.now();
      await new Promise((resolve, reject) => {
        dns.lookup(hostname, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      const dnsTime = Date.now() - startDns;
      
      // Get status only, no latency measurement
      spinner.text = 'Checking website status...';
      const response = await axios.head(url, { 
        timeout: 3000,
        headers: { 'Cache-Control': 'no-cache' },
        validateStatus: () => true
      });
      
      spinner.succeed('Analysis complete');
      
      // Create a table with OS-specific info, showing only network metrics
      const table = new Table({
        head: [chalk.hex('#FF00FF')('Component'), chalk.hex('#FF00FF')('Time (ms)'), chalk.hex('#FF00FF')('Notes')],
        colWidths: [25, 15, 40],
        style: { head: [], border: [] }
      });
      
      if (networkLatency !== null) {
        table.push([
          'Network Ping', 
          chalk.hex('#00FFFF')(networkLatency), 
          `From ${isWindows ? 'Windows' : 'system'} ping command`
        ]);
      } else {
        table.push([
          'Network Ping', 
          'N/A', 
          'Could not measure network ping'
        ]);
      }
      
      table.push(['DNS Resolution', dnsTime, 'Time to resolve hostname to IP']);
      
      console.log(table.toString());
      
      // Show response details
      logger.log(`Response Status: ${response.status}`);
      
      // Give a clear recommendation
      logger.title("Recommendation");
      
      if (networkLatency !== null) {
        logger.network(`Use network ping (${networkLatency}ms) as your reported latency`);
        logger.log("Network ping is the most accurate measure of network latency");
      } else {
        logger.log("Network ping could not be determined");
        logger.log("Try enabling ICMP on your system or target server");
      }
      
      // Configuration suggestion
      logger.log("\nHere's the optimal config for your environment:");
      console.log(JSON.stringify({
        latencySettings: {
          timeout: 3000,
          preferNetworkPing: true
        }
      }, null, 2));
      
    } catch (error) {
      spinner.fail('Analysis failed');
      logger.error(`Error during analysis: ${error.message}`);
    }
  });

program.parse(process.argv);

// Show help if no command provided or if -help flag is used
if (!process.argv.slice(2).length || program.opts().help) {
  displayBanner();
  program.outputHelp();
}