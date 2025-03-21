const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Paths for testing
const configDir = path.resolve(__dirname, '../config');
const privateKeyPath = path.join(configDir, 'privateKey.txt');
const publicKeyPath = path.join(configDir, 'publicKey.txt');

// Helper function to run CLI commands
function runCommand(command) {
  return new Promise((resolve, reject) => {
    logger.log(`Running: validator-cli ${command}`);
    
    exec(`validator-cli ${command}`, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Command failed: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        logger.warn(`Command stderr: ${stderr}`);
      }
      
      logger.success(`Command output: \n${stdout}`);
      resolve(stdout);
    });
  });
}

// Run tests
async function runTests() {
  try {
    logger.log('=== TESTING VALIDATOR CLI ===');
    
    // Test help
    await runCommand('--help');
    
    // Test version
    await runCommand('--version');
    
    // Test generate-keys
    if (fs.existsSync(privateKeyPath)) {
      logger.warn('Keys already exist, skipping key generation test');
    } else {
      await runCommand('generate-keys');
      
      // Verify keys were created
      if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
        logger.success('Keys generated successfully');
      } else {
        logger.error('Key generation failed - files not found');
      }
    }
    
    // Test info command
    await runCommand('info');
    
    // Test start command (will run in background, so we'll time it out)
    logger.log('Testing start command (will timeout after 5 seconds)');
    try {
      await Promise.race([
        runCommand('start'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
    } catch (error) {
      if (error.message === 'Timeout') {
        logger.success('Start command is running as expected (timed out)');
      } else {
        throw error;
      }
    }
    
    logger.success('=== ALL TESTS COMPLETED ===');
  } catch (error) {
    logger.error(`Test suite failed: ${error.message}`);
    process.exit(1);
  }
}

runTests();
