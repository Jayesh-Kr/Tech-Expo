import { Command } from 'commander';
import ping from 'ping';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../utils/logger';

export const pingCommand = new Command('ping')
  .description('Ping a hostname to check connectivity')
  .argument('<hostname>', 'Hostname to ping')
  .option('-c, --count <count>', 'Number of pings to send', '4')
  .action(async (hostname, options) => {
    const count = parseInt(options.count);
    
    const spinner = ora(`Pinging ${hostname}...`).start();
    
    try {
      // Run network ping
      const pingResult = await ping.promise.probe(hostname, {
        min_reply: count,
      });

      spinner.stop();
      
      if (pingResult.alive) {
        logger.info(`${chalk.green('✓')} ${hostname} is reachable`);
        logger.info(`Network Ping: ${chalk.cyan(pingResult.avg + 'ms')}`);
        logger.info(`Packet Loss: ${chalk.cyan(pingResult.packetLoss + '%')}`);
      } else {
        logger.error(`${chalk.red('✗')} ${hostname} is not reachable`);
      }
    } catch (error) {
      spinner.stop();
      logger.error(`Error pinging ${hostname}: ${error.message}`);
    }
  });
