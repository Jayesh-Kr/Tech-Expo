const WebSocket = require("ws");
const figlet = require("figlet");
const chalk = require("chalk");
const logger = require("../utils/logger");

const PORT = process.env.PORT || 8081;

// Display ASCII art banner
console.log(figlet.textSync('Validator Hub', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default'
}));

console.log(chalk.cyan("Decentralized Uptime Monitoring Hub Server"));
console.log(chalk.cyan("=========================================\n"));

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
          ip: clientIp
        });
        
        logger.success(`Validator signed up with ID: ${validatorId}`);
        logger.data(`Public key: ${publicKey.substring(0, 16)}...`);
        
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
            lastActive: new Date()
          });
        }
        
        logger.data(
          `Validator ${data.data.validatorId} checked ${data.data.url}: ${data.data.status} with latency: ${data.data.latency}ms`
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

// Display stats periodically
setInterval(() => {
  if (validators.size > 0) {
    console.log(chalk.cyan("\n--- Hub Statistics ---"));
    console.log(chalk.white(`Active validators: ${validators.size}`));
    console.log(chalk.white("Active connections:"));
    
    validators.forEach((info, id) => {
      const lastActiveTime = Math.round((new Date() - info.lastActive) / 1000);
      console.log(chalk.white(`  - ${id} (${info.location}): Last active ${lastActiveTime}s ago`));
    });
  }
}, 30000); // Every 30 seconds