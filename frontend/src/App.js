import React, { useState, useEffect } from "react";
import CarList from "./components/CarList";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import HamburgerMenu from "./components/HamburgerMenu";
import LoginPage from "./components/LoginPage";
import UserProfile from "./components/UserProfile";
import AdminPanel from "./components/AdminPanel";
import CustomerLogin from "./components/CustomerLogin";
import AnimatedLogin from "./components/AnimatedLogin";
import "./App.css";

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookings, setShowBookings] = useState(false);
  const [refreshBookings, setRefreshBookings] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'admin', or 'booking'
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [showAnimatedLogin, setShowAnimatedLogin] = useState(true);

  useEffect(() => {
    // Always clear any existing login data and force login
    localStorage.removeItem("customerData");
    setCustomerData(null);
    setCustomerLoggedIn(false);
    setLoggedInUser(null);
    setShowAnimatedLogin(true);
  }, []);

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.setItem("isAdmin", "false");
      setCurrentPage('home');
      setShowBookings(false);
      alert("👤 Exited admin mode!");
    } else {
      const password = prompt("🔐 Enter admin password:");
      if (password === "admin123") {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true");
        setCurrentPage('admin');
        setRefreshBookings(prev => prev + 1);
        alert("✅ Admin mode enabled! Redirecting to admin panel.");
      } else if (password !== null) {
        alert("❌ Wrong password!");
      }
    }
  };

  // Booking page
  if (currentPage === 'booking') {
    return (
      <div className="app">
        {/* Booking Header */}
        <header className="app-header" style={{ backgroundColor: '#27ae60' }}>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#229954',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Cars
          </button>
          <h1>📋 BOOK YOUR CAR</h1>
        </header>

        {/* Booking Form */}
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          {selectedCar && (
            <BookingForm 
              car={selectedCar} 
              onClose={() => setCurrentPage('home')}
              onBookingSuccess={() => {
                setCurrentPage('home');
                setShowBookings(true);
                setRefreshBookings(prev => prev + 1);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Render different pages based on currentPage state
  if (currentPage === 'admin') {
    return (
      <div className="app">
        {/* Admin Header */}
        <header className="app-header" style={{ backgroundColor: '#e74c3c' }}>
          <h1>👑 ADMIN PANEL - CAR RENTAL SYSTEM</h1>
          <button 
            onClick={toggleAdminMode}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#c0392b',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            👤 Exit Admin
          </button>
        </header>

        {/* Admin Dashboard */}
        <div style={{ padding: '20px' }}>
          <AdminPanel />
          <BookingList refreshTrigger={refreshBookings} isAdminMode={true} />
        </div>
      </div>
    );
  }





  // Show login first if not logged in
  if (showAnimatedLogin || !customerLoggedIn) {
    return (
      <AnimatedLogin 
        onLogin={(userData) => {
          // Generate passenger ID if not exists
          if (!userData.passengerId) {
            const existingCount = JSON.parse(localStorage.getItem("passengerCount") || "0");
            const newCount = existingCount + 1;
            userData.passengerId = `CR${String(newCount).padStart(2, '0')}`;
            localStorage.setItem("passengerCount", JSON.stringify(newCount));
          }
          
          setLoggedInUser(userData);
          setCustomerData(userData);
          setCustomerLoggedIn(true);
          localStorage.setItem("customerData", JSON.stringify(userData));
          setShowAnimatedLogin(false);
        }}
        onClose={() => {
          // Don't allow closing without login
          alert("Please login to access the car rental system!");
        }}
      />
    );
  }

  // Default home page
  return (
    <div className="app">


      {/* Global Login Buttons - Top Right Corner */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        {customerLoggedIn && customerData ? (
          <>
            <span style={{
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: '#27ae60',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              🆔 ID: {customerData.passengerId} | 👤 {customerData.name}
            </span>
            <button 
              onClick={() => {
                setCustomerLoggedIn(false);
                setCustomerData(null);
                setLoggedInUser(null);
                localStorage.removeItem("customerData");
                setShowAnimatedLogin(true);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: '#e74c3c',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => setShowAnimatedLogin(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#27ae60',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            👤 Login
          </button>
        )}
        <button 
          onClick={toggleAdminMode}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#3498db',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          🔐 Admin Login
        </button>
      </div>

      {/* Header */}
      <header className="app-header">
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h1>GO RENT RIDE</h1>
        </div>
      </header>

      {/* Show CarList (Beautiful Car Cards) */}
      <CarList onSelectCar={(car) => {
        if (!customerLoggedIn) {
          alert("Please login first to book a car!");
          setShowAnimatedLogin(true);
          return;
        }
        setSelectedCar(car);
        setCurrentPage('booking');
      }} />

      {/* My Bookings Button */}
      {customerLoggedIn && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button 
            onClick={() => setShowBookings(!showBookings)}
            style={{
              padding: '12px 24px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: '#3498db',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {showBookings ? '📋 Hide My Bookings' : '📋 View My Bookings'}
          </button>
        </div>
      )}



      {/* Show All Bookings only when booking is made */}
      {showBookings && (
        <div className="bookings-wrapper">
          <BookingList 
            refreshTrigger={refreshBookings} 
            isAdminMode={false} 
            customerData={customerData}
            customerLoggedIn={customerLoggedIn}
          />
          <button 
            className="hide-bookings-btn"
            onClick={() => setShowBookings(false)}
          >
            Hide Bookings ✕
          </button>
        </div>
      )}



      {/* About Us Section */}
      <div className="about-us-section">
        <h2>About Us</h2>
        <p>
          Welcome to GO RENT RIDE - your trusted car rental partner. We provide premium quality vehicles 
          for all your travel needs. With a wide range of cars from economy to luxury, we ensure 
          comfortable and safe journeys at affordable prices. Our 24/7 customer support and 
          transparent pricing make us the preferred choice for car rentals.
        </p>
        <br />
        <p>
          GO RENT RIDE has been serving customers for over 5 years with a fleet of 500+ well-maintained vehicles. 
          We operate across 50+ cities in India, offering doorstep delivery and pickup services. 
          Our experienced drivers and GPS-enabled cars ensure your safety and convenience. 
          We provide flexible rental plans - hourly, daily, weekly, and monthly options to suit your needs. 
          With competitive pricing and no hidden charges, we guarantee the best value for your money. 
          Book now and experience hassle-free car rentals with GO RENT RIDE!
        </p>
      </div>


    </div>
  );
}