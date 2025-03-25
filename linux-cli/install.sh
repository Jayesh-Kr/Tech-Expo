#!/bin/bash

# Linux installation script for validator-cli
echo "===== Validator CLI Linux Installer ====="
echo "This script will install the validator-cli for Linux systems"
echo

# Check if running as root
if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
  echo "Running as root"
else
  SUDO="sudo"
  echo "You may be asked for sudo password to install global dependencies"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Installing..."
  if command -v apt &> /dev/null; then
    # Debian/Ubuntu
    $SUDO apt update
    $SUDO apt install -y nodejs npm
  elif command -v dnf &> /dev/null; then
    # Fedora/RHEL
    $SUDO dnf install -y nodejs npm
  elif command -v pacman &> /dev/null; then
    # Arch Linux
    $SUDO pacman -Sy --noconfirm nodejs npm
  else
    echo "Could not determine package manager. Please install Node.js manually."
    exit 1
  fi
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 14 ]; then
  echo "Node.js version 14 or higher is required. Please upgrade Node.js."
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Make CLI executable
echo "Setting executable permissions..."
chmod +x bin/index.js

# Create local bin directory in user's home if it doesn't exist
LOCAL_BIN="$HOME/.local/bin"
if [ ! -d "$LOCAL_BIN" ]; then
  mkdir -p "$LOCAL_BIN"
  echo "Created local bin directory: $LOCAL_BIN"
  
  # Add to PATH if not already there
  if [[ ":$PATH:" != *":$LOCAL_BIN:"* ]]; then
    echo "Adding $LOCAL_BIN to your PATH"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
    echo "Please run 'source ~/.bashrc' after installation to update your PATH"
  fi
fi

# Get absolute path of the CLI
CLI_PATH="$(pwd)/bin/index.js"

# Install the CLI
echo "Installing validator-cli..."
if [ "$(id -u)" -eq 0 ]; then
  # If running as root, create symlink in /usr/local/bin
  echo "Creating global symlink in /usr/local/bin"
  ln -sf "$CLI_PATH" /usr/local/bin/validator-cli
  chmod +x /usr/local/bin/validator-cli
  echo "Created symlink in /usr/local/bin/validator-cli"
else
  # Create symlink in user's local bin
  echo "Creating local symlink in $LOCAL_BIN"
  ln -sf "$CLI_PATH" "$LOCAL_BIN/validator-cli"
  chmod +x "$LOCAL_BIN/validator-cli"
  echo "Created symlink in $LOCAL_BIN/validator-cli"
  
  # Try npm link as a fallback, but don't fail if it doesn't work
  echo "Attempting npm link (optional)..."
  npm link || echo "npm link failed, but local installation is still available"
fi

# Create config directory
CONFIG_DIR="$HOME/.validator-cli"
mkdir -p "$CONFIG_DIR"
chmod 755 "$CONFIG_DIR"
echo "Created config directory: $CONFIG_DIR"

# Success message
echo
echo "===== Installation Complete ====="
echo "Validator CLI has been installed successfully!"

# Show where the validator-cli is available
if [ -x "$LOCAL_BIN/validator-cli" ]; then
  echo "Available at: $LOCAL_BIN/validator-cli"
elif [ -x "/usr/local/bin/validator-cli" ]; then
  echo "Available at: /usr/local/bin/validator-cli"
fi

echo "Run 'validator-cli -help' to get started"
echo "Note: You must have an existing private key to use the validator"
echo

# Test the installation
echo "Testing installation..."
if [ -x "$LOCAL_BIN/validator-cli" ]; then
  "$LOCAL_BIN/validator-cli" --version
elif [ -x "/usr/local/bin/validator-cli" ]; then
  validator-cli --version
else
  echo "Please run: source ~/.bashrc"
  echo "Then try: validator-cli --version"
fi 