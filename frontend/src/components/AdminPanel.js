import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [cars, setCars] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('cars');
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [carStats, setCarStats] = useState([]);
  const [formData, setFormData] = useState({
    carName: "",
    carModel: "",
    carType: "Sedan",
    pricePerDay: "",
    color: "",
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    description: "",
    imageUrl: ""
  });


  useEffect(() => {
    fetchCars();
    fetchReviews();
    fetchBookings();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/bookings");
      setBookings(response.data);
      calculateCarStats(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const calculateCarStats = (bookingsData) => {
    console.log("Calculating stats for bookings:", bookingsData);
    const carCounts = {};
    bookingsData.forEach(booking => {
      carCounts[booking.carName] = (carCounts[booking.carName] || 0) + 1;
    });
    
    const stats = Object.entries(carCounts)
      .map(([carName, count]) => ({ carName, bookings: count }))
      .sort((a, b) => b.bookings - a.bookings);
    
    console.log("Car statistics:", stats);
    setCarStats(stats);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/cars", formData);
      alert("Car added successfully!");
      setShowAddForm(false);
      setFormData({
        carName: "",
        carModel: "",
        carType: "Sedan",
        pricePerDay: "",
        color: "",
        fuelType: "Petrol",
        transmission: "Manual",
        seatingCapacity: 5,
        description: "",
        imageUrl: ""
      });
      fetchCars();
    } catch (error) {
      alert("Error adding car: " + (error.response?.data?.error || error.message));
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`http://localhost:8000/api/cars/${carId}`);
        alert("Car deleted successfully!");
        fetchCars();
      } catch (error) {
        alert("Error deleting car");
      }
    }
  };



  return (
    <div className="admin-panel">
      <h2>ADMIN PANEL</h2>
      
      <div className="admin-tabs">
        <button 
          onClick={() => setActiveTab('cars')} 
          className={activeTab === 'cars' ? 'active' : ''}
        >
          🚗 Car Management
        </button>
        <button 
          onClick={() => setActiveTab('stats')} 
          className={activeTab === 'stats' ? 'active' : ''}
        >
          📈 Car Statistics
        </button>
        <button 
          onClick={() => setActiveTab('reviews')} 
          className={activeTab === 'reviews' ? 'active' : ''}
        >
          ⭐ Customer Reviews
        </button>
      </div>
      
      {activeTab === 'cars' && (
        <>
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-car-btn">
            {showAddForm ? "Cancel" : "➕ Add New Car"}
          </button>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="add-car-form">
              <h3>Add New Car</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Car Name"
                  value={formData.carName}
                  onChange={(e) => setFormData({...formData, carName: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Car Model"
                  value={formData.carModel}
                  onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  value={formData.carType}
                  onChange={(e) => setFormData({...formData, carType: e.target.value})}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
                <input
                  type="number"
                  placeholder="Price per day"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Car Color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>
              <div className="form-row">
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
                <input
                  type="number"
                  placeholder="Seating Capacity"
                  value={formData.seatingCapacity}
                  onChange={(e) => setFormData({...formData, seatingCapacity: e.target.value})}
                  min="2"
                  max="8"
                />
              </div>
              <input
                type="url"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
              <textarea
                placeholder="Car Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
              />
              <button type="submit">Add Car</button>
            </form>
          )}

          <div className="cars-grid">
            {cars.map(car => (
              <div key={car._id} className="admin-car-card">
                <h4>{car.carName}</h4>
                <p>{car.carModel} - {car.carType}</p>
                <p>Price: ₹{car.pricePerDay}/day</p>
                <div className="admin-actions">
                  <button 
                    onClick={() => deleteCar(car._id)}
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {activeTab === 'stats' && (
        <div>
          <h3>📈 Car Booking Statistics</h3>
          
          {carStats.length > 0 && (
            <>
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#27ae60' }}>📈 Most Booked Cars</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '15px' 
                }}>
                  {carStats.slice(0, 5).map((stat, index) => (
                    <div key={stat.carName} style={{
                      backgroundColor: '#e8f5e8',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '2px solid #27ae60',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>#{index + 1}</span>
                        <h5 style={{ margin: '5px 0', color: '#2c3e50' }}>{stat.carName}</h5>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                          {stat.bookings}
                        </div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>bookings</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#e74c3c' }}>📉 Least Booked Cars</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '15px' 
                }}>
                  {carStats.slice(-5).reverse().map((stat, index) => (
                    <div key={stat.carName} style={{
                      backgroundColor: '#fdf2f2',
                      padding: '15px',
                      borderRadius: '8px',
                      border: '2px solid #e74c3c',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>#{carStats.length - index}</span>
                        <h5 style={{ margin: '5px 0', color: '#2c3e50' }}>{stat.carName}</h5>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                          {stat.bookings}
                        </div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>bookings</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {carStats.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#777' }}>
              <p>📊 No booking data available yet</p>
              <p>Statistics will appear after customers make bookings</p>
              <p>Total bookings found: {bookings.length}</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'reviews' && (
        <div>
          <h3>⭐ Customer Reviews & Ratings ({reviews.length} reviews)</h3>
          <div className="reviews-grid">
            {reviews.map(review => (
              <div key={review._id} className="review-card" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                margin: '10px 0',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#2c3e50' }}>{review.carName}</h4>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < review.rating ? '#ffd700' : '#ddd', fontSize: '18px' }}>⭐</span>
                    ))}
                    <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>({review.rating}/5)</span>
                  </div>
                </div>
                <p style={{ margin: '10px 0', fontStyle: 'italic', color: '#555' }}>"{review.review}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#777' }}>
                  <span>👤 {review.customerName}</span>
                  <span>📅 {new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          {reviews.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#777' }}>
              <p>No customer reviews yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}