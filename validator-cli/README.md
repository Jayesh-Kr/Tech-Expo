# Validator CLI

A decentralized uptime validator CLI for monitoring website availability.

## Requirements

- Node.js 14 or higher
- npm 6 or higher
- Connection to a validator hub server

## Installation

Since this package is not published to the npm registry, you need to install it locally:

```bash
# Clone or download the repository
# Then navigate to the project directory
cd validator-cli

# Install dependencies
npm install

# Create a global symlink to use the CLI from anywhere
npm link
```

## Getting Started

Here's how to get up and running with the Validator CLI:

1. **Make sure you have completed the installation steps above**

2. **Generate your validator keys** (if you don't already have them)
   ```bash
   validator-cli generate-keys
   ```

3. **Start the validator client**
   ```bash
   validator-cli start ./config/privateKey.txt
   ```

## Usage

### Getting Help

You can display help information using:

```bash
validator-cli -help
# or
validator-cli --help
```

### Available Commands

```bash
validator-cli [command] [options]
```

### Generate Validator Keys

```bash
validator-cli generate-keys
```

This will generate a keypair for your validator in the `config` directory.

### Start the Validator

```bash
validator-cli start /path/to/privateKey.txt
```

Start the validator using the specified private key file.

### View Validator Info

```bash
validator-cli info /path/to/privateKey.txt
```

Display information about your validator, including its public key, IP address, and connection status.

### Check Validator Status

```bash
validator-cli status
```

Show the current status of your validator, including connection state and ID.

### Ping a URL

```bash
validator-cli ping https://example.com
```

Manually ping a URL to check its status and response time.

### Debug Ping

```bash
validator-cli debug-ping https://example.com
```

Perform a detailed latency analysis of a URL with comprehensive information about network conditions.

## Network Testing

The Validator CLI includes advanced network testing capabilities to measure:

- ICMP network ping latency
- DNS resolution time
- TCP connection time
- HTTP/HTTPS response time

These measurements help ensure accurate reporting of website latency and availability.

## Configuration

The validator uses a configuration file located at `config/config.json`. Example:

```json
{
  "hubServer": "ws://localhost:8081",
  "latencySettings": {
    "timeout": 3000,
    "preferNetworkPing": true,
    "useHeadRequest": true
  }
}
```

## Security

- All communications with the hub server are cryptographically signed
- Private keys never leave your machine
- Use secure key storage practices

## Troubleshooting

### WebSocket Connection Issues

If you encounter WebSocket connection errors, ensure that the hub server is running and accessible. Check the `hubServer` URL in your `config/config.json` file and make sure it is correct.

### Ping Command Not Working

If the ping command fails, make sure your system allows ICMP packets. Some networks may block ICMP traffic for security reasons.

## License

ISC
