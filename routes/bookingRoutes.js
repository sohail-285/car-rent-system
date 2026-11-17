
import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new booking
router.post("/", async (req, res) => {
  try {
    const {
      carName,
      passengerName,
      passengerId,
      phoneNumber,
      location,
      bookingDate,
      returnDate
    } = req.body;

    // Calculate total days
    const start = new Date(bookingDate);
    const end = new Date(returnDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      return res.status(400).json({ message: "Return date must be after booking date" });
    }

    // Calculate rent (₹1000 per day)
    const rentAmount = totalDays * 1000;

    // Create new booking
    const booking = new Booking({
      carName,
      passengerName,
      passengerId,
      phoneNumber,
      location,
      bookingDate,
      returnDate,
      totalDays,
      rentAmount
    });

    await booking.save();

    res.status(201).json({
      message: "Thank you for booking!",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


