import express from "express";
import Car from "../models/Car.js";

const router = express.Router();

// Update GPS location and vehicle data
router.patch("/cars/:carId/location", async (req, res) => {
  try {
    const { carId } = req.params;
    const { latitude, longitude, address, speed, fuelLevel } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Update location and vehicle data
    car.gpsTracking.currentLocation = {
      latitude,
      longitude,
      address,
      lastUpdated: new Date()
    };
    car.gpsTracking.speed = speed || 0;
    car.gpsTracking.fuelLevel = fuelLevel || car.gpsTracking.fuelLevel;

    // Only generate alerts if car is moving
    if (speed > 0) {
      // Check for overspeeding alert
      if (speed > 80) {
        car.gpsTracking.alerts.push({
          type: 'overspeeding',
          message: `Vehicle exceeding speed limit: ${speed} km/h`,
          timestamp: new Date()
        });
      }

      // Check for low fuel alert only when driving
      if (fuelLevel < 20) {
        car.gpsTracking.alerts.push({
          type: 'low_fuel',
          message: `Low fuel level: ${fuelLevel}%`,
          timestamp: new Date()
        });
      }
    }

    await car.save();
    res.json({ message: "Location updated successfully", car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get live tracking data for all cars
router.get("/tracking", async (req, res) => {
  try {
    const cars = await Car.find({})
      .select("carName carModel gpsTracking");
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enable/disable GPS tracking for a car
router.patch("/cars/:carId/tracking", async (req, res) => {
  try {
    const { carId } = req.params;
    const { enabled } = req.body;

    const car = await Car.findByIdAndUpdate(
      carId,
      { "gpsTracking.isEnabled": enabled },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({ message: "GPS tracking updated", car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve alert
router.patch("/cars/:carId/alerts/:alertId", async (req, res) => {
  try {
    const { carId, alertId } = req.params;
    
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const alert = car.gpsTracking.alerts.id(alertId);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    alert.resolved = true;
    await car.save();

    res.json({ message: "Alert resolved", car });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;