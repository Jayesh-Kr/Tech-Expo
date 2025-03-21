const fs = require("fs");
const path = require("path");
const nacl = require("tweetnacl");
const naclUtil = require("tweetnacl-util");
const logger = require("../utils/logger");

const loadPrivateKey = async () => {
  // Use environment variable if set, otherwise use default path
  const privateKeyPath = process.env.PRIVATE_KEY_PATH || 
    path.resolve(__dirname, "../config/privateKey.txt");

  if (!fs.existsSync(privateKeyPath)) {
    logger.error(`Private key file not found! Make sure it's at: ${privateKeyPath}`);
    process.exit(1);
  }

  try {
    const privateKeyBase64 = fs.readFileSync(privateKeyPath, "utf-8").trim();
    const privateKeyBytes = naclUtil.decodeBase64(privateKeyBase64);
    const keypair = nacl.sign.keyPair.fromSecretKey(privateKeyBytes);

    logger.success("Private key loaded successfully.");
    return keypair;
  } catch (error) {
    logger.error(`Failed to load private key: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { loadPrivateKey };