import express from "express";
import db from "./db/db.js";
import { Website, Validator, WebsiteTick, User } from "./model/model.js";
import { authenticateUser } from './middleware.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// User Creation
app.post("/user", async (req, res) => {
    try {
        const user = await User.create({
            _id: uuidv4(),
            email: req.body.email
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
            _id: uuidv4(),
            url: req.body.url,
            userId: req.user._id
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
            userId: req.user._id
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
        const {name,email,payoutPublicKey, publicKey,location,ip,password} = req.body;
        let hashedPassword = await bcrypt.hash(password,10);
        const validator = await Validator.create({
            name : name,
            email : email,
            publicKey: publicKey,
            location: location,
            ip: ip,
            payoutPublicKey : payoutPublicKey,
            password : hashedPassword
        });
        res.status(201).json(validator);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Website Tick Creation
app.post("/website-tick", authenticateUser, async (req, res) => {
    try {
        const websiteTick = await WebsiteTick.create({
            _id: uuidv4(),
            websiteId: req.body.websiteId,
            validatorId: req.body.validatorId,
            status: req.body.status,
            latency: req.body.latency
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
                latency: req.body.latency
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
            userId: req.user._id
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