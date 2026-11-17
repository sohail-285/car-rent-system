import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CarList.css";

const CarList = ({ onSelectCar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/cars");
      setCars(response.data);
    } catch (error) {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const hardcodedCars = [
    { id: 1, carName: "Hyundai Creta", pricePerDay: 1500, image: "https://tse1.mm.bing.net/th/id/OIP.zwaIq069wzHJEtpT7CgxCQHaE8?pid=Api&P=0&h=180", features: ["Petrol", "Manual", "5 Seats"], specifications: { seats: 5, fuelType: "Petrol", airConditioning: "AC", transmission: "Manual", tollCharges: "₹500/day", parkingCharges: "₹200/day" }, available: true },
    { id: 2, carName: "Maruti Swift", pricePerDay: 1000, image: "https://tse1.mm.bing.net/th/id/OIP.OYUnnJJPJ0wzXmwyr9ZWdgHaE8?pid=Api&P=0&h=180", features: ["Petrol", "Manual", "5 Seats"], specifications: { seats: 5, fuelType: "Petrol", airConditioning: "AC", transmission: "Manual", tollCharges: "₹300/day", parkingCharges: "₹100/day" }, available: true },
    { id: 3, carName: "BMW X5", pricePerDay: 5000, image: "https://tse2.mm.bing.net/th/id/OIP.819BTjrahV4ym3Jq1UJTXQHaFj?pid=Api&P=0&h=180", features: ["Diesel", "Automatic", "5 Seats"], specifications: { seats: 5, fuelType: "Diesel", airConditioning: "AC", transmission: "Automatic", tollCharges: "₹800/day", parkingCharges: "₹300/day" }, available: true },
    { id: 4, carName: "Tata Nexon", pricePerDay: 1200, image: "https://tse3.mm.bing.net/th/id/OIP.NjGRU2-UV9k1AVPE880xuwHaEK?pid=Api&P=0&h=180", features: ["Petrol", "Manual", "5 Seats"], specifications: { seats: 5, fuelType: "Petrol", airConditioning: "AC", transmission: "Manual", tollCharges: "₹400/day", parkingCharges: "₹150/day" }, available: true },
    { id: 5, carName: "Mahindra XUV700", pricePerDay: 2500, image: "https://tse1.mm.bing.net/th/id/OIP.hW0cj1iUU4RXs14zuFtupwHaFj?pid=Api&P=0&h=180", features: ["Diesel", "Automatic", "7 Seats"], specifications: { seats: 7, fuelType: "Diesel", airConditioning: "AC", transmission: "Automatic", tollCharges: "₹600/day", parkingCharges: "₹250/day" }, available: true },
    { id: 6, carName: "Toyota Fortuner", pricePerDay: 3000, image: "https://tse4.mm.bing.net/th/id/OIP.O3spTKoXloGnXc3fLe3_owHaEK?pid=Api&P=0&h=180", features: ["Diesel", "Automatic", "7 Seats"], specifications: { seats: 7, fuelType: "Diesel", airConditioning: "AC", transmission: "Automatic", tollCharges: "₹700/day", parkingCharges: "₹200/day" }, available: true },
    { id: 7, carName: "Honda City", pricePerDay: 1300, image: "https://tse2.mm.bing.net/th/id/OIP.iwOp0wcGsH8WQzLhU4y7lQHaE8?pid=Api&P=0&h=180", features: ["Petrol", "Manual", "5 Seats"], specifications: { seats: 5, fuelType: "Petrol", airConditioning: "AC", transmission: "Manual", tollCharges: "₹400/day", parkingCharges: "₹150/day" }, available: true },
    { id: 8, carName: "Skoda Slavia", pricePerDay: 1800, image: "https://tse3.mm.bing.net/th/id/OIP.x_CK6bE_of-sYVBA_R1f-QHaE8?pid=Api&P=0&h=180", features: ["Petrol", "Automatic", "5 Seats"], specifications: { seats: 5, fuelType: "Petrol", airConditioning: "AC", transmission: "Automatic", tollCharges: "₹500/day", parkingCharges: "₹200/day" }, available: true },
    { id: 9, carName: "Kia Sonet", pricePerDay: 1400, image: "https://tse2.mm.bing.net/th/id/OIP.ZaBzvMELzPxSpB1l4OBV1AHaEK?pid=Api&P=0&h=180", features: ["Petrol", "Manual", "5 Seats"], specifications: { seats: 5, fuelType: "Petrol", airConditioning: "AC", transmission: "Manual", tollCharges: "₹400/day", parkingCharges: "₹150/day" }, available: true },
    { id: 10, carName: "Mercedes-Benz C-Class", pricePerDay: 4500, image: "https://tse2.mm.bing.net/th/id/OIP.1IVG_7bUztMY7jOltC8LqQHaE4?pid=Api&P=0&h=180", features: ["Petrol", "Automatic", "5 Seats"], specifications: { seats: 5, fuelType: "Petrol", airConditioning: "AC", transmission: "Automatic", tollCharges: "₹800/day", parkingCharges: "₹300/day" }, available: true },
  ];

  // Use database cars if available, otherwise fallback to hardcoded
  const availableCars = cars.length > 0 ? cars.map(car => ({
    id: car._id,
    _id: car._id,
    carName: car.carName,
    carModel: car.carModel,
    carType: car.carType,
    pricePerDay: car.pricePerDay,
    imageUrl: car.imageUrl,
    image: car.imageUrl || "https://via.placeholder.com/300x200?text=Car+Image",
    features: [car.fuelType, car.transmission, `${car.seatingCapacity} Seats`],
    specifications: {
      seats: car.seatingCapacity,
      fuelType: car.fuelType,
      airConditioning: "AC",
      transmission: car.transmission,
      tollCharges: "₹500/day",
      parkingCharges: "₹200/day"
    },
    available: car.availability !== false
  })) : hardcodedCars;

  console.log("Available cars to display:", availableCars.length);
  console.log("Using database cars:", cars.length > 0);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      return;
    }
    
    const results = availableCars.filter(car => 
      car.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredCars(results);
    setShowSearchResults(true);
  };

  const displayCars = showSearchResults ? filteredCars : availableCars;

  return (
    <div className="car-list-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          🔍
        </button>
        {showSearchResults && (
          <button 
            onClick={() => {
              setShowSearchResults(false);
              setSearchTerm('');
            }} 
            className="clear-search-btn"
          >
            ✕
          </button>
        )}
      </div>
      
      <h2>🚗 Available Cars ({displayCars.filter(car => car.available).length} cars)</h2>
      
      {loading && <div className="loading">Loading cars...</div>}
      
      {showSearchResults && filteredCars.length === 0 ? (
        <div className="no-results">
          <p>No such car available</p>
        </div>
      ) : (
        <div className="cars-grid">
          {displayCars.map(car => (
            <div key={car.id} className={`car-card ${!car.available ? 'unavailable' : ''}`}>
              <div className="car-image">
                <img 
                  src={car.image || car.imageUrl || `https://via.placeholder.com/400x250/007bff/ffffff?text=${encodeURIComponent(car.carName)}`}
                  alt={car.carName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    // Force reload with cache bypass
                    const originalSrc = e.target.src;
                    if (!originalSrc.includes('placeholder')) {
                      e.target.src = originalSrc + '?t=' + Date.now();
                    } else {
                      e.target.src = `https://via.placeholder.com/400x250/007bff/ffffff?text=${encodeURIComponent(car.carName)}`;
                    }
                  }}
                />
                {!car.available && <div className="unavailable-overlay">UNAVAILABLE</div>}
              </div>
              
              <div className="car-info">
                <h3>{car.carName}</h3>
                <p className="price">₹{car.pricePerDay}/day</p>
                
                <div className="features">
                  {car.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                
                <button 
                  className={`select-btn ${!car.available ? 'disabled' : ''}`}
                  onClick={() => {
                    if (car.available) {
                      const details = `🚗 ${car.carName} Details:\n\n` +
                        `👥 Seats: ${car.specifications.seats}\n` +
                        `⛽ Fuel: ${car.specifications.fuelType}\n` +
                        `❄️ AC: ${car.specifications.airConditioning}\n` +
                        `⚙️ Transmission: ${car.specifications.transmission}\n` +
                        `🛣️ Toll Charges: ${car.specifications.tollCharges}\n` +
                        `🅿️ Parking Charges: ${car.specifications.parkingCharges}\n\n` +
                        `💰 Base Price: ₹${car.pricePerDay}/day\n\n` +
                        `Note: Extra charges apply for locations outside Karnataka state.\n\n` +
                        `Do you want to proceed with booking?`;
                      
                      if (window.confirm(details)) {
                        onSelectCar(car);
                      }
                    }
                  }}
                  disabled={!car.available}
                >
                  {car.available ? 'Select Car' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarList;