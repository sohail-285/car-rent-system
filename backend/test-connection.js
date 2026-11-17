import mongoose from "mongoose";

console.log("Testing MongoDB connection...");

mongoose.connect("mongodb://127.0.0.1:27017/car_rent", {
  serverSelectionTimeoutMS: 3000
})
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    process.exit(0);
  })
  .catch(err => {
    console.log("❌ MongoDB Connection Failed:");
    console.log("Error:", err.message);
    console.log("\nPossible causes:");
    console.log("1. MongoDB is not installed");
    console.log("2. MongoDB service is not running");
    console.log("3. MongoDB is running on a different port");
    process.exit(1);
  });
