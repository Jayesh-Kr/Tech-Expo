# Validator CLI

A decentralized uptime validator CLI for monitoring website availability.

## Installation

```bash
npm install -g validator-cli
```

Or install locally:

```bash
npm install
```

## Usage

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

## License

ISC
