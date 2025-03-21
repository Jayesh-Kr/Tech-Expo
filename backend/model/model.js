import mongoose from "mongoose";

const websiteStatusEnum = ["Good", "Bad"];

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
});

const websiteSchema = new mongoose.Schema({
  url: { type: String, required: true },
  websiteName: { type: String, required: true },
  userId: { type: String, required: true, ref: "User" },
  createdAt: { type: Date, required: true, default: Date.now },
  disabled: { type: Boolean, default: false },
});

const validatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  publicKey: { type: String, required: true },
  location: { type: String, required: true },
  ip: { type: String, required: true },
  pendingPayouts: { type: Number, default: 0 },
  payoutPublicKey: { type: String, required: true },
  password: { type: String, required: true },
});

const websiteTickSchema = new mongoose.Schema({
  websiteId: { type: String, required: true, ref: "Website" },
  validatorId: { type: String, required: true, ref: "Validator" },
  createdAt: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: websiteStatusEnum, required: true },
  latency: { type: Number, required: true },
});

const downLogSchema = new mongoose.Schema({
  websiteId: { type: String, required: true, ref: "Website" },
  createdAt: { type: Date, required: true, default: Date.now },
  location: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const Website = mongoose.model("Website", websiteSchema);
const Validator = mongoose.model("Validator", validatorSchema);
const WebsiteTick = mongoose.model("WebsiteTick", websiteTickSchema);
const DownLog = mongoose.model("DownLog", downLogSchema);

export { User, Website, Validator, WebsiteTick, DownLog };
