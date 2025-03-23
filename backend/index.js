import express from "express";
import db from "./db/db.js";
import {
  Website,
  Validator,
  WebsiteTick,
  User,
  DownLog,
} from "./model/model.js";
import { authenticateValidator } from "./middleware.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { configDotenv } from "dotenv";
import bs58 from "bs58";
import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import { verifyIPLocation } from "./utils/script.js";
import { clerkMiddleware, requireAuth } from '@clerk/express'
configDotenv();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const RPC_URL = process.env.RPC_URL;
const ADMIN_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

// User Creation
app.post("/user", async (req, res) => {
  try {
    const user = await User.create({
      email: req.body.email,
      userId : req.body.userId
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Validator Creation
app.post("/validator", async (req, res) => {
  try {
    const { name, email, payoutPublicKey, publicKey, location, ip, password } =
      req.body;
    const publicKeyDB = await Validator.findOne({
      payoutPublicKey: payoutPublicKey,
    }).select("payoutPublicKey");
    const emailDB = await Validator.findOne({ email: email }).select("email");
    console.log("Public key : ", publicKeyDB);
    console.log("Email : ", emailDB);
    if (publicKeyDB) {
      return res.status(400).json({
        message: "Your public key already exits",
      });
    }
    if (emailDB) {
      return res.status(400).json({
        message: "Your email already exits",
      });
    }
    const isValidLocation = await verifyIPLocation(ip, location);
    if (!isValidLocation) {
      return res.status(400).json({
        message: "The provided IP address do not match with your location",
      });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    const validator = await Validator.create({
      name: name,
      email: email,
      publicKey: publicKey,
      location: location,
      ip: ip,
      payoutPublicKey: payoutPublicKey,
      password: hashedPassword,
    });
    res.status(201).json(validator);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Validator SignIn
app.post("/validator-signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const getUser = await Validator.findOne({ email: email });
    if (!getUser) {
      return res.status(400).json({
        message: "Validator not found. SignUp to become a validator",
      });
    }
    const decodedPassword = await bcrypt.compare(password, getUser.password);
    if (!decodedPassword) {
      return res.status(404).json({
        message: "Invalid credentails",
      });
    }
    const token = jwt.sign({ userId: getUser._id }, JWT_SECRET);
    return res.status(200).json({
      token: token,
    });
  } catch (err) {
    console.log("Error in Signin");
    res.status(400).json({
      message: "Error while SignIn",
    });
  }
});

// Fetch Validator Detail
app.get("/validator-detail", authenticateValidator, async (req, res) => {
  try {
    const user = req.user;
    const _id = user._id;
    const validatorDetails = await Validator.findById(_id).select("-password");
    const recentWebsites = await WebsiteTick.find({ validatorId: _id })
      .sort({ createdAt: -1 })
      .limit(5);
    const allValidatorsPendingPayout = await Validator.find().select(
      "pendingPayouts"
    );

    if (!validatorDetails) {
      return res.status(404).json({ message: "Validator not found" });
    }

    const averagePayout =
      allValidatorsPendingPayout.reduce(
        (acc, validator) => acc + (validator.pendingPayouts || 0),
        0
      ) / allValidatorsPendingPayout.length;

    res.status(200).json({
      validator: validatorDetails,
      recentWebsites: recentWebsites,
      averagePayout: averagePayout,
      totalValidator: allValidatorsPendingPayout.length,
    });
  } catch (err) {
    console.log("Error in getting user details");
    res.status(400).json({
      message: "Cannot get the Validator details",
    });
  }
});

app.post("/getPayout", authenticateValidator, async (req, res) => {
  console.log("Getting payout to user");
  try {
    const { _id } = req.user;
    const validator = await Validator.findById(_id).select(
      "pendingPayouts payoutPublicKey"
    );
    if (!validator) {
      return res.status(404).json({ message: "Validator not found" });
    }

    const { pendingPayouts, payoutPublicKey } = validator;
    if (!payoutPublicKey) {
      return res
        .status(400)
        .json({ message: "No payout public key found for the user" });
    }
    if (pendingPayouts <= 0) {
      return res.status(400).json({ message: "No pending payout available" });
    }

    const connection = new Connection("https://api.devnet.solana.com");

    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(ADMIN_PUBLIC_KEY),
        toPubkey: new PublicKey(payoutPublicKey),
        lamports: pendingPayouts,
      })
    );
    const secretKeyBytes = bs58.decode(ADMIN_PRIVATE_KEY);
    const fromKeypair = Keypair.fromSecretKey(secretKeyBytes);
    const balance = await connection.getBalance(fromKeypair.publicKey);
    if(balance < 2000000) {
      return res.status(400).json({message : "Low balance"})
    }
    const signature = await sendAndConfirmTransaction(
      connection,
      transferTransaction,
      [fromKeypair]
    );
    await Validator.findByIdAndUpdate(_id, { pendingPayouts: 0 });
    return res.status(200).json({ message: "Payout successful", signature });
  } catch (err) {
    console.log("Error in Payout");
    console.log(err);
    return res.status(400).json({
      message: "Error in Payout",
      reason : "Atleast 0.0008 SOL is required"
    });
  }
});

// Website Tick Creation
app.post("/website-tick", async (req, res) => {
  try {
    const websiteTick = await WebsiteTick.create({
      websiteId: req.body.websiteId,
      validatorId: req.body.validatorId,
      status: req.body.status,
      latency: req.body.latency,
    });
    res.status(201).json(websiteTick);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use(clerkMiddleware());

// Website Creation
// authenticatUser middleware -> add
app.post("/website", requireAuth(), async (req, res) => {
  try {
    console.log("Reacher cretion of the server");
    const website = await Website.create({
      url: req.body.url,
      userId: req.auth.userId,
      websiteName: req.body.websiteName,
    });
    res.status(201).json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch Website Details
app.get("/website/:id", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId; // Get the user ID from Clerk

    const website = await Website.findOne({
      _id: req.params.id,
      userId: userId, // Use the user ID from Clerk
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    res.json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Website Tracking
app.put("/website-track/:id", requireAuth(), async (req, res) => {
  console.log("Reached the update section");
  try {
    const disabled = await Website.findById({ _id: req.params.id }).select(
      "disabled"
    );
    const website = await Website.findByIdAndUpdate(
      req.params.id,
      {
        disabled: !disabled.disabled,
      },
      { new: true }
    );

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    res.json({ website, message: "Updated successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message, warning: "Update nhi ho raha bhai" });
  }
});

// Get Website details to Frontend
app.get("/website-details:id", requireAuth(), async (req, res) => {
  try {
    let websiteId = req.params.id;
    // Hardcoding website Id
    // websiteId = "67da786fa901e50ce8b6a8c5";
    if (!websiteId) {
      return res.status(400).json({ error: "Website ID is required" });
    }
    const website = await Website.findById({ _id: websiteId });
    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }
    const allValidatorsPendingPayout = await Validator.find().select(
      "pendingPayouts"
    );
    const disabled = website.disabled;
    const dateCreated = website.createdAt;
    const downlog = await DownLog.find({ websiteId }).sort({ createdAt: -1 }).limit(5);
    const websiteDetails = async () => {
      const ticks = await WebsiteTick.find({ websiteId });

      // If no ticks are found, return default values
      if (!ticks.length) {
        return {
          websiteName: website.websiteName,
          url: website.url,
          dateCreated: dateCreated || "0",
          uptimePercentage: 0, // Default uptime percentage
          response: 0, // Default response time
          averageLatencyPerMinute: [], // Empty array for latency data
          disabled,
          downlog: downlog || [],
          totalTicks: 0,
          goodTicks: 0,
          totalValidator: allValidatorsPendingPayout.length,
        };
      }

      // Group by 1-minute intervals
      const groupedTicks = {};
      ticks.forEach((tick) => {
        const minuteKey = new Date(tick.createdAt).setSeconds(0, 0); // Normalize to nearest minute

        if (!groupedTicks[minuteKey]) {
          groupedTicks[minuteKey] = [];
        }
        groupedTicks[minuteKey].push(tick.latency);
      });

      // Calculate average latency per minute interval
      const averageLatencyPerMinute = Object.entries(groupedTicks).map(
        ([timestamp, latencies]) => ({
          timestamp: new Date(parseInt(timestamp)), // Convert back to readable format
          averageLatency:
            latencies.reduce((sum, latency) => sum + latency, 0) /
            latencies.length,
        })
      );

      const totalTicks = ticks.length;
      const goodTicks = ticks.filter((tick) => tick.status === "Good").length;

      // Calculate uptime percentage
      const uptimePercentage =
        totalTicks > 0 ? (goodTicks / totalTicks) * 100 : 0;

      // Get the latest 1-minute latency average
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const recentTicks = ticks.filter(
        (tick) => new Date(tick.createdAt) > oneMinuteAgo
      );
      const avgLatency =
        recentTicks.length > 0
          ? recentTicks.reduce((sum, tick) => sum + tick.latency, 0) /
            recentTicks.length
          : 0;

      return {
        websiteName: website.websiteName,
        url: website.url,
        dateCreated: dateCreated || "0",
        uptimePercentage,
        response: avgLatency.toFixed(2), // Rounds to 2 decimal places
        averageLatencyPerMinute,
        disabled,
        downlog: downlog || [],
        totalTicks,
        goodTicks,
        totalValidator: allValidatorsPendingPayout.length,
      };
    };
    let websites = await websiteDetails();
    res.json(websites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Website
app.delete("/website/:id", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId; // Get the user ID from Clerk
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      userId: userId,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    // Also delete related website ticks
    await WebsiteTick.deleteMany({ websiteId: req.params.id });
    console.log("deleted website succesully");
    res.json({ message: "Website deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/dashboard-details", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId; // Assuming authentication middleware sets `req.user`
    // Fetch all websites monitored by the user
    const websites = await Website.find({ userId });

    const disabledCount = websites.filter((site) => site.disabled).length;
    const enabledCount = websites.length - disabledCount;

    // Prepare response data
    const dashboardDetails = await Promise.all(
      websites.map(async (website) => {
        // Fetch all ticks for the website
        const ticks = await WebsiteTick.find({ websiteId: website._id });
        const disabled = website.disabled;
        const id = website._id;

        // If no ticks are found, return default values
        if (!ticks.length) {
          return {
            websiteName: website.websiteName,
            url: website.url,
            uptimePercentage: 0, // Default uptime percentage
            response: 0, // Default response time
            averageLatencyPerMinute: [], // Empty array for latency data
            disabled,
            id,
          };
        }

        // Group by 1-minute intervals
        const groupedTicks = {};
        ticks.forEach((tick) => {
          const minuteKey = new Date(tick.createdAt).setSeconds(0, 0); // Normalize to nearest minute

          if (!groupedTicks[minuteKey]) {
            groupedTicks[minuteKey] = [];
          }
          groupedTicks[minuteKey].push(tick.latency);
        });

        // Calculate average latency per minute interval
        const averageLatencyPerMinute = Object.entries(groupedTicks).map(
          ([timestamp, latencies]) => ({
            timestamp: new Date(parseInt(timestamp)), // Convert back to readable format
            averageLatency:
              latencies.reduce((sum, latency) => sum + latency, 0) /
              latencies.length,
          })
        );

        const totalTicks = ticks.length;
        const goodTicks = ticks.filter((tick) => tick.status === "Good").length;
        const badTicks = totalTicks - goodTicks;

        // Calculate uptime percentage
        const uptimePercentage =
          totalTicks > 0 ? (goodTicks / totalTicks) * 100 : 0;

        // Get the latest 1-minute latency average
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const recentTicks = ticks.filter(
          (tick) => new Date(tick.createdAt) > oneMinuteAgo
        );
        const avgLatency =
          recentTicks.length > 0
            ? recentTicks.reduce((sum, tick) => sum + tick.latency, 0) /
              recentTicks.length
            : 0;

        return {
          websiteName: website.websiteName,
          url: website.url,
          uptimePercentage,
          response: avgLatency.toFixed(2), // Rounds to 2 decimal places
          averageLatencyPerMinute,
          disabled,
          id,
        };
      })
    );

    res.json({
      websiteCount: websites.length,
      websites: dashboardDetails,
      disabledCount,
      enabledCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
