# Validator CLI

A decentralized uptime validator CLI for monitoring website availability.

## Requirements

- Node.js 14 or higher
- npm 6 or higher
- WebSocket server (for validator hub)

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

2. **Generate your validator keys**
   ```bash
   c
   ```

3. **Start the hub server** (in a separate terminal window)
   ```bash
   # From project directory
   npm start
   # OR
   node src/server.js
   ```

4. **Start the validator client**
   ```bash
   validator-cli start
   ```

## Usage

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
validator-cli start
```

### View Validator Info

```bash
validator-cli info
```

## Configuration

The validator uses a configuration file located at `config/config.json`. Example:

```json
{
  "hubServer": "ws://localhost:8081",
  "pingInterval": 10000,
  "targetURL": "https://example.com"
}
```

## Troubleshooting

### WebSocket Connection Issues

If you encounter WebSocket connection errors, ensure that your WebSocket server is running and accessible. Check the `hubServer` URL in your `config/config.json` file and make sure it is correct.

## License

ISC
