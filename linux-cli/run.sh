#!/bin/bash

# Simple wrapper script to run validator-cli directly
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
CLI_PATH="$SCRIPT_DIR/bin/index.js"

if [ ! -x "$CLI_PATH" ]; then
  echo "Making CLI executable..."
  chmod +x "$CLI_PATH"
fi

# Check if help is needed
if [[ "$1" == "" || "$1" == "-h" || "$1" == "--help" || "$1" == "-help" ]]; then
  echo "Validator CLI for Linux"
  echo "Note: You must have an existing private key to use this validator."
  echo
  echo "Usage: ./run.sh [command] [options]"
  echo
  echo "Common commands:"
  echo "  start <keypath>     - Start the validator with your private key"
  echo "  ping <url>          - Test connectivity to a URL"
  echo "  system              - Show system information"
  echo "  info <keypath>      - Show validator information"
  echo "  --version           - Show version information"
  echo
  echo "For more details, run: ./run.sh [command] --help"
  exit 0
fi

# Run the CLI with all arguments passed to this script
node "$CLI_PATH" "$@" 