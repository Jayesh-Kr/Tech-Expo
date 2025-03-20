const { program } = require("commander");
const path = require("path");
const fs = require("fs");
const nacl = require("tweetnacl");
const naclUtil = require("tweetnacl-util");
const axios = require("axios");
const ora = require("ora");
const figlet = require("figlet");
const Table = require('cli-table3');
const { startValidator, getValidatorStatus } = require("./validator");
const logger = require("../utils/logger");
const packageJson = require('../package.json');

// Helper function to display ASCII art banner
function displayBanner() {
  console.log(figlet.textSync('Validator CLI', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));
  console.log(`v${packageJson.version} - A decentralized uptime validator\n`);
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
  $ validator-cli generate-keys         Generate new validator keys
  $ validator-cli start                 Start the validator node
  $ validator-cli info                  Show validator information
  $ validator-cli ping example.com      Manually ping a website
  $ validator-cli dashboard             Show validator dashboard
  `);

program
  .command("generate-keys")
  .description("Generate new validator keypair")
  .option("-o, --output <directory>", "Output directory for keys", "./config")
  .action(async (options) => {
    displayBanner();
    const spinner = ora('Generating new validator keypair...').start();
    
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
      
      spinner.succeed('Keys generated successfully');
      
      // Display key info in a table
      const table = new Table({
        head: ['Key Type', 'Location'],
        colWidths: [15, 60]
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
  .option("-k, --key <path>", "Path to private key file", "./config/privateKey.txt")
  .option("-c, --config <path>", "Path to config file", "./config/config.json")
  .option("-u, --url <url>", "URL to ping (overrides config file)")
  .option("-d, --daemon", "Run in background mode", false)
  .action(async (options) => {
    displayBanner();
    
    const keyPath = path.resolve(options.key);
    const configPath = path.resolve(options.config);

    if (!fs.existsSync(keyPath)) {
      logger.error(`Private key file not found at: ${keyPath}`);
      logger.log("Generate a keypair first using: validator-cli generate-keys");
      process.exit(1);
    }

    if (!fs.existsSync(configPath)) {
      logger.error(`Config file not found at: ${configPath}`);
      process.exit(1);
    }

    logger.log("Starting validator node...");
    logger.log(`Using private key: ${keyPath}`);
    logger.log(`Using config: ${configPath}`);
    
    // Show a nice spinner while connecting
    const spinner = ora('Connecting to hub server...').start();
    
    try {
      // Set the key path in environment for the validator to use
      process.env.PRIVATE_KEY_PATH = keyPath;
      process.env.CONFIG_PATH = configPath;
      
      // Set custom URL if provided
      if (options.url) {
        process.env.TARGET_URL = options.url;
        logger.log(`Using custom URL: ${options.url}`);
      }
      
      // Start the validator with the spinner for feedback
      await startValidator(spinner);
    } catch (error) {
      spinner.fail(`Failed to start validator: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("ping <url>")
  .description("Manually ping a specific URL")
  .option("-k, --key <path>", "Path to private key file", "./config/privateKey.txt")
  .action(async (url, options) => {
    const keyPath = path.resolve(options.key);

    if (!fs.existsSync(keyPath)) {
      logger.error(`Private key file not found at: ${keyPath}`);
      logger.log("Generate a keypair first using: validator-cli generate-keys");
      process.exit(1);
    }

    logger.log(`Pinging URL: ${url}...`);
    
    try {
      const startTime = Date.now();
      const response = await axios.get(url, { timeout: 10000 });
      const endTime = Date.now();
      const latency = endTime - startTime;
      
      logger.success(`Status: ${response.status}`);
      logger.log(`Latency: ${latency}ms`);
    } catch (error) {
      logger.error(`Failed to ping ${url}: ${error.message}`);
    }
  });

program
  .command("info")
  .description("Show validator information")
  .option("-k, --key <path>", "Path to private key file", "./config/privateKey.txt")
  .action((options) => {
    const keyPath = path.resolve(options.key);
    if (!fs.existsSync(keyPath)) {
      logger.error(`Private key file not found at: ${keyPath}`);
      return;
    }
    
    try {
      const privateKeyBase64 = fs.readFileSync(keyPath, "utf-8").trim();
      const privateKeyBytes = naclUtil.decodeBase64(privateKeyBase64);
      const keypair = nacl.sign.keyPair.fromSecretKey(privateKeyBytes);
      const publicKeyBase64 = naclUtil.encodeBase64(keypair.publicKey);
      
      logger.log("Validator information:");
      logger.log(`Public key: ${publicKeyBase64}`);
    } catch (error) {
      logger.error(`Failed to read private key: ${error.message}`);
    }
  });

program
  .command("set-target <url>")
  .description("Set the target URL in the config file")
  .option("-c, --config <path>", "Path to config file", "./config/config.json")
  .action((url, options) => {
    const configPath = path.resolve(options.config);
    
    try {
      let config = {};
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } else {
        config = {
          hubServer: "ws://localhost:8081",
          pingInterval: 10000
        };
      }
      
      config.targetURL = url;
      
      // Ensure directory exists
      const configDir = path.dirname(configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      logger.success(`Target URL set to: ${url}`);
      logger.log(`Updated config saved to: ${configPath}`);
    } catch (error) {
      logger.error(`Failed to set target URL: ${error.message}`);
    }
  });

program
  .command("dashboard")
  .description("Display a real-time dashboard of validator activity")
  .option("-r, --refresh <seconds>", "Refresh interval in seconds", 5)
  .action((options) => {
    displayBanner();
    logger.log("Starting validator dashboard...");
    logger.log("Press Ctrl+C to exit");
    
    // Clear the console
    console.clear();
    
    // Display dashboard header
    console.log("🔍 VALIDATOR DASHBOARD 🔍");
    console.log("------------------------");
    
    // This would be implemented to show real-time stats
    const refreshInterval = parseInt(options.refresh) * 1000;
    const intervalId = setInterval(() => {
      // This would be replaced with actual status fetching
      const now = new Date().toISOString();
      console.log(`Last update: ${now}`);
      // More dashboard implementation would go here
    }, refreshInterval);
    
    // Handle exit
    process.on('SIGINT', () => {
      clearInterval(intervalId);
      console.log("\nDashboard stopped");
      process.exit(0);
    });
  });

program
  .command("status")
  .description("Check the current status of the validator")
  .action(() => {
    displayBanner();
    
    try {
      // This would check if the validator is running
      const configPath = path.resolve("./config/config.json");
      if (!fs.existsSync(configPath)) {
        logger.error("Config file not found. The validator may not be configured yet.");
        return;
      }
      
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      const table = new Table({
        head: ['Property', 'Value'],
        colWidths: [20, 50]
      });
      
      table.push(
        ['Target URL', config.targetURL || 'Not set'],
        ['Hub Server', config.hubServer],
        ['Ping Interval', `${config.pingInterval/1000} seconds`]
      );
      
      console.log(table.toString());
      
      // More status checking logic would be implemented here
      logger.log("Use 'validator-cli start' to start the validator if it's not running");
    } catch (error) {
      logger.error(`Failed to get status: ${error.message}`);
    }
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  displayBanner();
  program.outputHelp();
}