import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const BOOKINGS_FILE = "./bookings.json";

// Initialize bookings file if it doesn't exist
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
}

// GET all bookings
app.get("/api/bookings", (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new booking
app.post("/api/bookings", (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
    const newBooking = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    
    bookings.push(newBooking);
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    
    console.log("✅ Booking saved:", newBooking.carName);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
app.delete("/api/bookings/:id", (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
    const filteredBookings = bookings.filter(b => b._id !== req.params.id);
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(filteredBookings, null, 2));
    
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on port 5000 (JSON storage)");
});