import express from "express";
import Booking from "../models/Booking.js";
import axios from "axios";

const router = express.Router();

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new booking
router.post("/", async (req, res) => {
  try {
    // Validate phone number before creating booking
    if (!req.body.phoneNumber || !/^[0-9]{10}$/.test(req.body.phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number - must be exactly 10 digits" });
    }
    
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    
    // Update customer loyalty data
    try {
      await axios.post(`http://localhost:8000/api/loyalty/update/${encodeURIComponent(booking.passengerName)}`, {
        bookingAmount: booking.totalRent || 0
      });
    } catch (loyaltyError) {
      console.log("Loyalty update failed:", loyaltyError.message);
    }
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Booking error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE booking status
router.patch("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;