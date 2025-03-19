import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/techexpo");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connection successful to database");
});

export default db;