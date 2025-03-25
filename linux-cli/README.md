# Validator CLI for Linux

A decentralized uptime validator command-line interface optimized for Linux systems. This tool allows you to run a validator node for the DPin network on Linux systems.

## 🚀 Getting Started (Quick Guide)

### Step 1: Clone the Repository

```bash
# Navigate to your desired directory
cd ~/Desktop

# Clone the repository or copy the files
# If you have the files already, skip this step
```

### Step 2: Choose an Installation Method

#### Option A: Run Directly (Easiest, No Installation)

```bash
# Navigate to the validator-cli directory
cd linux-cli/validator-cli

# Make the wrapper script executable
chmod +x run.sh

# Run any command using the wrapper
./run.sh --version
./run.sh system
```

#### Option B: Use the Installation Script

```bash
# Navigate to the validator-cli directory
cd linux-cli/validator-cli

# Make the installation script executable
chmod +x install.sh

# Run the installation script
./install.sh

# Refresh your shell environment
source ~/.bashrc

# Test the installation
validator-cli --version
```

### Step 3: Start Your Validator

```bash
# Start the validator with your existing private key
validator-cli start /path/to/your/privateKey.txt

# OR using the wrapper script
./run.sh start /path/to/your/privateKey.txt
```

## 📋 Detailed Instructions

### System Requirements

- Linux operating system (Debian, Ubuntu, Fedora, Arch, etc.)
- Node.js 14 or higher
- Required Linux utilities: `ping`, `cat`, `grep`, `ps`
- Existing validator private key

### Setup Instructions

1. **Prepare your environment**:
   Make sure Node.js is installed on your system.

   ```bash
   # Check Node.js version
   node --version
   
   # If Node.js is not installed, install it using your package manager
   # For Debian/Ubuntu:
   sudo apt update
   sudo apt install nodejs npm
   
   # For Fedora:
   sudo dnf install nodejs npm
   
   # For Arch Linux:
   sudo pacman -S nodejs npm
   ```

2. **Navigate to the validator-cli directory**:
   ```bash
   cd linux-cli/validator-cli
   ```

3. **Choose your installation method**:

   - **Direct execution** (no installation required):
     ```bash
     chmod +x run.sh
     ./run.sh --help
     ```

   - **Local user installation** (recommended):
     ```bash
     chmod +x install.sh
     ./install.sh
     source ~/.bashrc
     validator-cli --help
     ```

   - **Manual installation**:
     ```bash
     # Install dependencies
     npm install
     
     # Make the CLI executable
     chmod +x bin/index.js
     
     # Create a local symlink
     mkdir -p ~/.local/bin
     ln -sf $(pwd)/bin/index.js ~/.local/bin/validator-cli
     chmod +x ~/.local/bin/validator-cli
     
     # Add to your PATH (add to .bashrc)
     echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
     source ~/.bashrc
     ```

4. **Configure your validator** (optional):
   The default config works for most setups, but you can modify it if needed:
   ```bash
   # Edit the config file
   nano ./config/config.json
   ```

5. **Start your validator**:
   ```bash
   validator-cli start /path/to/your/privateKey.txt
   ```

6. **Check validator status**:
   ```bash
   validator-cli info /path/to/your/privateKey.txt
   ```

### Securing Your Private Key

To ensure your existing private key has the correct permissions:

```bash
# Secure your private key with proper permissions
chmod 600 /path/to/your/privateKey.txt
```

### Troubleshooting Tips

- **If command not found**: Use the wrapper script with `./run.sh` or run `source ~/.bashrc`
- **If permission denied**: Run `chmod +x bin/index.js` and `chmod +x run.sh`
- **If missing utilities**: Install required packages using your package manager
- **If Node.js is outdated**: Update Node.js to version 14 or higher

## 🔧 Available Commands

- `validator-cli start <keypath>`: Start the validator using the specified private key
- `validator-cli ping <url>`: Test connectivity to a website
- `validator-cli info [keypath]`: Show information about your validator
- `validator-cli system`: Display system information (Linux-specific)
- `validator-cli install`: Configure the CLI for Linux
- `validator-cli -help`: Show help information

## 📊 System Monitoring

The Linux validator includes a system monitoring command that shows:

```bash
validator-cli system
```

This displays your:
- CPU information
- Memory usage
- Disk space
- Distribution details
- Kernel version
- Available Linux utilities

## 🛡️ Security Features

- The CLI checks file permissions and warns about insecure settings
- Uses secure file paths and environment handling for Linux

## 📚 Learn More

For more information about DPin and the validator network, refer to the main project documentation.

## 📄 License

ISC
