import express from "express";
import db from "./db/db.js";
import { Website, Validator, WebsiteTick, User } from "./model/model.js";
import { authenticateUser } from "./middleware.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { configDotenv } from "dotenv";
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
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Website Creation
app.post("/website", authenticateUser, async (req, res) => {
  try {
    const website = await Website.create({
      url: req.body.url,
      userId: req.user._id,
      websiteName : req.body.websiteName
    });
    res.status(201).json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch Website Details
app.get("/website/:id", authenticateUser, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    res.json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Validator Creation
app.post("/validator", async (req, res) => {
  try {
    const { name, email, payoutPublicKey, publicKey, location, ip, password } =
      req.body;
    const publicKeyDB = Validator.findOne({ publicKey: payoutPublicKey });
    if (publicKeyDB) {
      return res.status(400).json({
        message: "Your public key already exits",
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
    if(!decodedPassword) {
        return res.status(404).json({
            message : "Invalid credentails"
        });
    }
    const token = jwt.sign({ token: getUser }, JWT_SECRET);
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
app.get("/validator-detail", authenticateUser, async (req, res) => {
  try {
    const { _id } = req.user;
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

app.post("/getPayout", authenticateUser, async (req, res) => {
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

    const connection = new Connection(RPC_URL, "confirmed");

    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(ADMIN_PUBLIC_KEY),
        toPubkey: new PublicKey(payoutPublicKey),
        lamports: pendingPayouts,
      })
    );
    const fromKeypair = Keypair.fromSecretKey(ADMIN_PRIVATE_KEY);
    const signature = await sendAndConfirmTransaction(connection, transferTransaction, [
      fromKeypair,
    ]);
    await Validator.findByIdAndUpdate(_id, { pendingPayouts: 0 });
    return res.status(200).json({ message: "Payout successful", signature });
  } catch (err) {
    console.log("Error in Payout");
    return res.status(400).json({
      message: "Error in Payout",
    });
  }
});

// Website Tick Creation
app.post("/website-tick", authenticateUser, async (req, res) => {
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

// Update Website Tick
app.put("/website-tick/:id", authenticateUser, async (req, res) => {
  try {
    const websiteTick = await WebsiteTick.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        latency: req.body.latency,
      },
      { new: true }
    );

    if (!websiteTick) {
      return res.status(404).json({ message: "Website tick not found" });
    }

    res.json(websiteTick);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Website
app.delete("/website/:id", authenticateUser, async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    // Also delete related website ticks
    await WebsiteTick.deleteMany({ websiteId: req.params.id });

    res.json({ message: "Website deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
