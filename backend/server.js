// backend/server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookingRoutes from "./routes/bookings.js";  // ✅ Import
import carRoutes from "./routes/cars.js";          // ✅ Import
import adminRoutes from "./routes/admin.js";       // ✅ Import
import statusRoutes from "./routes/status.js";     // ✅ Import
import offersRoutes from "./routes/offers.js";     // ✅ Import
import loyaltyRoutes from "./routes/loyalty.js";   // ✅ Import
import gpsRoutes from "./routes/gps.js";           // ✅ GPS Import
import reviewRoutes from "./routes/reviews.js";    // ✅ Reviews Import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/car_rent")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/bookings", bookingRoutes);  // ✅ Use routes
app.use("/api/cars", carRoutes);
app.use("/api/admin", adminRoutes);       // ✅ Admin routes
app.use("/api/status", statusRoutes);     // ✅ Status routes
app.use("/api/admin/offers", offersRoutes); // ✅ Offers routes
app.use("/api/loyalty", loyaltyRoutes);       // ✅ Loyalty routes
app.use("/api/gps", gpsRoutes);           // ✅ GPS routes
app.use("/api/reviews", reviewRoutes);     // ✅ Reviews routes

// Start server
app.listen(8000, () => {
  console.log("✅ Server running on port 8000");
});

export default app;