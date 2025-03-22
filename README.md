# 🌐 dPIN Website Monitoring System 

A **decentralized website monitoring system** leveraging **dPIN (Decentralized Public Infrastructure Network)** to ensure **trustless uptime verification, real-time alerts, and transparency** without relying on centralized authorities.  

> With dPIN, experience a truly decentralized, transparent, and reliable website monitoring system.
> 

<div align="center">
  <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/Lviffy/Tech-Expo">
  <img alt="GitHub license" src="https://img.shields.io/github/license/Lviffy/Tech-Expo">
  <a href="https://github.com/Lviffy/Tech-Expo/contributors">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/Lviffy/Tech-Expo">
  </a>
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/Lviffy/Tech-Expo">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Lviffy/Tech-Expo">
</div>

---

## 🔥 Key Features  
🔹 **No Single Point of Failure** – Distributed monitoring across independent validators.  

🔹 **Trustless Transparency** – Website owners can prove uptime without a central entity.  

🔹 **Crypto Incentives** – Validators earn rewards for monitoring and reporting website health.  

🔹 **Decentralized Monitoring** – Multiple nodes check website status instead of a single company.  

🔹 **Real-Time Alerts** – Instant notifications for downtime or performance issues.  

🔹 **Security & Privacy** – No third-party access to website data.  

---

## 🛑 Problem Statement  
Traditional website monitoring systems are **centralized, opaque, and vulnerable** to **downtime, censorship, and manipulation**. They rely on single providers, limiting transparency and control.  

---

## ✅ Solution  

Our **dPIN-based monitoring system** decentralizes website uptime tracking by leveraging independent validators across a global network. Unlike traditional systems, which rely on a single authority, our solution ensures **real-time, trustless, and tamper-proof monitoring** without any central points of failure. Website owners can **prove uptime transparently**, while users receive **instant alerts** for downtime or performance issues. Validators are incentivized with **crypto rewards**, fostering a **self-sustaining, censorship-resistant** ecosystem that enhances reliability, security, and trust in website monitoring.

✨ **Website owners** can verify uptime transparently.  

⚡ **Users** receive **instant alerts** for downtime or performance issues.  

💰 **Validators** are rewarded with **crypto incentives**, fostering a **self-sustaining, censorship-resistant** monitoring ecosystem.  

---

## 🛠️ Tech Stack  
🛡️ **Blockchain** – Solana 

🌍 **dPIN (Decentralized Public Infrastructure Network)** – Distributed monitoring  

🔗 **Database** – MongoDB   

🖥️ **Frontend** – React.js, Radix UI, Tailwind CSS, ShadCN  

📡 **Backend** – Node.js, Express.js

🔒 **Authentication** – Clerk

⚙️ **Validator CLI** – Commander.js, Chalk

---

## ⚙️ Installation & Setup  
```bash
# Clone the repository
git clone https://github.com/Lviffy/Tech-Expo.git
cd Tech-Expo

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your specific configuration

# Run the backend server
node index.js

# Install frontend dependencies
cd ../frontend
npm install

# Set up frontend environment variables
cp .env.example .env
# Edit .env with your Clerk publishable key and other configs

# Run the frontend development server
npm run dev

# Open your browser at http://localhost:5173
```

## 🧠 Project Structure
```
Tech-Expo/
├── backend/               # Express.js server
│   ├── db/                # Database connection
│   ├── model/             # MongoDB schemas
│   ├── utils/             # Helper functions
│   └── index.js           # Main server file
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main application component
│   └── public/            # Static assets
└── validator-cli/         # CLI tool for validators
    ├── src/               # Source code
    └── utils/             # CLI utilities
```

---

## ℹ️ Additional Information  
🔹 **Minimum Validator Balance** – To become a validator, your crypto wallet must have at least **0.05 SOL**. 

🔹 **Wallet Public Key** – Needed for withdrawal of earned rewards. 

🔹 **Key Generation** – Automatically generates a pair of **public & private keys** for enhanced security.  

🔹 **Decentralized Transactions** – Ensures secure and anonymous payment processing.  

---

## ❓ Troubleshooting  
If you face any issues, try these steps:  

⚠️ **Issue:** App not starting  
🔹 **Solution:** Ensure **Node.js** and **npm** are installed, and run `npm install` before starting the application.  

⚠️ **Issue:** Wallet not connecting  
🔹 **Solution:** Make sure **Phantom** or any compatible Solana wallet is installed and connected to the correct network.  

⚠️ **Issue:** No real-time alerts  
🔹 **Solution:** Check if notifications are **enabled** in browser settings.  

⚠️ **Issue:** Transaction failures  
🔹 **Solution:** Ensure your wallet has **sufficient SOL** for transactions.  

⚠️ **Issue:** Authentication problems  
🔹 **Solution:** Verify your Clerk API keys are correctly configured in your environment variables.

---

## 📝 API Endpoints

### User Endpoints
- `POST /user` - Create a new user
- `GET /dashboard-details` - Get user dashboard information

### Website Monitoring Endpoints
- `POST /website` - Register a new website for monitoring
- `GET /website/:id` - Get details for a specific website
- `DELETE /website/:id` - Remove a website from monitoring
- `PUT /website-track/:id` - Enable/disable monitoring for a website
- `GET /website-details:id` - Get detailed metrics for a website

### Validator Endpoints
- `POST /validator-login` - Authenticate as a validator
- `GET /validator-details` - Get validator activity and rewards information

---

## 🙌 Team Members
- **Rohan Kumar Mohanta**
- **Jayesh Krishna**
- **Shivangi Sharma**

---

## 🤝 Contributing  
We welcome contributions! Follow these steps:  

1️⃣ **Fork** the repo  

2️⃣ **Create** a new branch: `git checkout -b feature-branch`  

3️⃣ **Commit** your changes: `git commit -m "Added new feature"`  

4️⃣ **Push** to the branch: `git push origin feature-branch`  

5️⃣ **Submit** a **Pull Request (PR)**  

💡 **Tip:** Always write **clear commit messages** and follow **best coding practices** before submitting a PR!  

---

## 📜 If you found this useful, don't forget to ⭐ star this repo!
---



