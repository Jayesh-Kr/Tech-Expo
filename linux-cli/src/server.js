const WebSocket = require("ws");
const figlet = require("figlet");
const chalk = require("chalk");
const logger = require("../utils/logger");

const PORT = process.env.PORT || 8081;

// Display ASCII art banner with updated colors
console.log(chalk.magentaBright(figlet.textSync('Validator Hub', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})));

console.log(chalk.greenBright("Decentralized Uptime Monitoring Hub Server"));
console.log(chalk.greenBright("=========================================\n"));

const wss = new WebSocket.Server({ port: PORT }, () => {
  logger.success(`WebSocket Hub Server running on ws://localhost:${PORT}`);
  logger.log("Waiting for validators to connect...");
  logger.log("Press Ctrl+C to stop the server");
});

// Track connected validators
const validators = new Map();

wss.on("connection", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  logger.log(`New connection from ${clientIp}`);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "signup") {
        const validatorId = `validator-${Math.floor(Math.random() * 10000)}`;
        const publicKey = data.data.publicKey;
        
        validators.set(validatorId, {
          publicKey,
          location: data.data.location || "Unknown",
          connectionTime: new Date(),
          lastActive: new Date(),
          ip: data.data.ip || clientIp, // Use provided IP or connection IP
          clientIp // Also store the connection IP
        });
        
        logger.success(`Validator signed up with ID: ${validatorId}`);
        logger.data(`Public key: ${publicKey.substring(0, 16)}...`);
        logger.data(`IP address: ${data.data.ip || clientIp}`);
        
        ws.send(
          JSON.stringify({
            type: "signup",
            data: { validatorId },
          })
        );
        
        // Log active validators count
        logger.log(`Active validators: ${validators.size}`);
      }

      if (data.type === "validate") {
        const validatorInfo = validators.get(data.data.validatorId);
        if (validatorInfo) {
          validators.set(data.data.validatorId, {
            ...validatorInfo,
            lastActive: new Date(),
            ip: data.data.ipAddress || validatorInfo.ip // Update IP if provided
          });
        }
        
        logger.data(
          `Validator ${data.data.validatorId} (${data.data.ipAddress || "Unknown IP"}) checked ${data.data.url}: ${data.data.status} with network ping: ${data.data.networkLatency || data.data.latency}ms`
        );
      }
    } catch (error) {
      logger.error(`Failed to process message: ${error.message}`);
    }
  });

  ws.on("close", () => {
    // Find and remove the disconnected validator
    for (const [id, info] of validators.entries()) {
      if (info.ip === clientIp) {
        logger.warn(`Validator ${id} disconnected`);
        validators.delete(id);
        break;
      }
    }
    
    logger.log(`Active validators: ${validators.size}`);
  });
});

// Display stats periodically with improved colors
setInterval(() => {
  if (validators.size > 0) {
    console.log(chalk.magentaBright("\n--- Hub Statistics ---"));
    console.log(chalk.cyanBright(`Active validators: ${validators.size}`));
    console.log(chalk.cyanBright("Active connections:"));
    
    validators.forEach((info, id) => {
      const lastActiveTime = Math.round((new Date() - info.lastActive) / 1000);
      console.log(chalk.blueBright(`  - ${id} (${info.location}): IP: ${info.ip}, Last active ${lastActiveTime}s ago`));
    });
  }
}, 30000); // Every 30 seconds