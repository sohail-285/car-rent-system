import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GPSSimulator() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCar, setSelectedCar] = useState("");

  useEffect(() => {
    fetchCars();
    fetchBookings();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const simulateGPSData = async () => {
    if (!selectedCar) return;

    const selectedCarData = cars.find(car => car._id === selectedCar);
    const carBooking = bookings.find(booking => booking.carName === selectedCarData?.carName);

    let mockData;

    if (carBooking) {
      // Handle both old and new booking formats
      let pickup, destination;
      
      if (carBooking.pickupLocation && carBooking.destination) {
        pickup = carBooking.pickupLocation;
        destination = carBooking.destination;
      } else if (carBooking.location) {
        // Parse old format like "haveri to pune"
        const parts = carBooking.location.toLowerCase().split(' to ');
        pickup = parts[0] || 'bangalore';
        destination = parts[1] || 'pune';
      } else {
        pickup = 'bangalore';
        destination = 'pune';
      }
      
      if (pickup && destination) {
      // Use booking route data
      const cityCoords = {
        "haveri": { lat: 14.7951, lng: 75.4065 },
        "pune": { lat: 18.5204, lng: 73.8567 },
        "bangalore": { lat: 12.9716, lng: 77.5946 },
        "mumbai": { lat: 19.0760, lng: 72.8777 },
        "delhi": { lat: 28.6139, lng: 77.2090 },
        "chennai": { lat: 13.0827, lng: 80.2707 },
        "hyderabad": { lat: 17.3850, lng: 78.4867 },
        "kolkata": { lat: 22.5726, lng: 88.3639 }
      };

      const pickupCoords = cityCoords[pickup.toLowerCase()] || { lat: 12.9716, lng: 77.5946 };
      const destCoords = cityCoords[destination.toLowerCase()] || { lat: 18.5204, lng: 73.8567 };
      
      // Simulate movement along route (0-100% progress)
      const progress = (carBooking.routeProgress || 0) / 100;
      const currentLat = pickupCoords.lat + (destCoords.lat - pickupCoords.lat) * progress;
      const currentLng = pickupCoords.lng + (destCoords.lng - pickupCoords.lng) * progress;
      
      mockData = {
        latitude: currentLat + (Math.random() - 0.5) * 0.005,
        longitude: currentLng + (Math.random() - 0.5) * 0.005,
        address: `En route from ${pickup} to ${destination} (${Math.round(progress * 100)}% complete)`,
        speed: Math.floor(Math.random() * 80) + 20,
        fuelLevel: Math.max(20, 100 - (progress * 60))
      };

      // Route progress simulation (in real system, this would be updated by actual GPS)
      }
    } else {
      // Default random location
      mockData = {
        latitude: 12.9716 + (Math.random() - 0.5) * 0.01,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.01,
        address: "Bangalore, Karnataka (No active booking)",
        speed: Math.floor(Math.random() * 60),
        fuelLevel: Math.floor(Math.random() * 100)
      };
    }

    try {
      await axios.patch(`http://localhost:5001/api/gps/cars/${selectedCar}/location`, mockData);
      alert("GPS data updated successfully!");
    } catch (error) {
      console.error("Error updating GPS data:", error);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", margin: "20px", borderRadius: "8px" }}>
      <h3>🛰️ GPS Simulator (For Testing)</h3>
      <div style={{ marginBottom: "15px" }}>
        <select 
          value={selectedCar} 
          onChange={(e) => setSelectedCar(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", width: "300px" }}
        >
          <option value="">Select a car</option>
          {cars.map(car => {
            const booking = bookings.find(b => b.carName === car.carName);
            let routeInfo = '(No booking)';
            
            if (booking) {
              if (booking.pickupLocation && booking.destination) {
                routeInfo = `(${booking.pickupLocation} → ${booking.destination})`;
              } else if (booking.location) {
                routeInfo = `(${booking.location})`;
              }
            }
            
            return (
              <option key={car._id} value={car._id}>
                {car.carName} - {car.carModel} {routeInfo}
              </option>
            );
          })}
        </select>
        <button 
          onClick={simulateGPSData}
          disabled={!selectedCar}
          style={{
            padding: "8px 16px",
            background: selectedCar ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: selectedCar ? "pointer" : "not-allowed"
          }}
        >
          Simulate GPS Update
        </button>
      </div>
      <p style={{ fontSize: "12px", color: "#666" }}>
        This simulator sends random GPS data for testing. In a real system, this would come from actual GPS devices in the vehicles.
      </p>
    </div>
  );
}