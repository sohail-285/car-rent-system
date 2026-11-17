import express from "express";
import Car from "../models/Car.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Add new car
router.post("/cars", upload.single('carImage'), async (req, res) => {
  try {
    const { carName, carModel, carType, pricePerDay, weekendPrice, peakSeasonPrice, color, fuelType, transmission, seatingCapacity, description, imageUrl } = req.body;
    
    // Determine image URL: uploaded file takes priority, then provided URL, then default
    let finalImageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim();
    } else {
      finalImageUrl = "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=250&fit=crop&auto=format";
    }
    
    const newCar = new Car({
      carName,
      carModel,
      carType,
      pricePerDay: Number(pricePerDay),
      weekendPrice: weekendPrice ? Number(weekendPrice) : Number(pricePerDay) * 1.2,
      peakSeasonPrice: peakSeasonPrice ? Number(peakSeasonPrice) : Number(pricePerDay) * 1.5,
      imageUrl: finalImageUrl,
      color,
      fuelType,
      transmission,
      seatingCapacity: Number(seatingCapacity),
      description
    });

    const savedCar = await newCar.save();
    console.log(`✅ Car added: ${carName} with image: ${finalImageUrl}`);
    res.status(201).json(savedCar);
  } catch (error) {
    console.error("❌ Error adding car:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update car availability
router.patch("/cars/:id/availability", async (req, res) => {
  try {
    const { availability } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update car service dates
router.patch("/cars/:id/service", async (req, res) => {
  try {
    const { lastServiceDate, nextServiceDate, maintenanceNotes } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { 
        lastServiceDate: new Date(lastServiceDate),
        nextServiceDate: new Date(nextServiceDate),
        maintenanceNotes
      },
      { new: true }
    );
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update seasonal pricing
router.patch("/cars/:id/pricing", async (req, res) => {
  try {
    const { pricePerDay, weekendPrice, peakSeasonPrice } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { 
        pricePerDay: Number(pricePerDay),
        weekendPrice: Number(weekendPrice),
        peakSeasonPrice: Number(peakSeasonPrice)
      },
      { new: true }
    );
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;