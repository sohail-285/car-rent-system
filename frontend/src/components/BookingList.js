import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackPage from "./FeedbackPage";
import "./BookingList.css";

function BookingList({ refreshTrigger, isAdminMode, customerData, customerLoggedIn }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInPassenger, setLoggedInPassenger] = useState("");
  const [showFeedbackPage, setShowFeedbackPage] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [showFeedbackDetail, setShowFeedbackDetail] = useState(false);
  const [feedbackDetail, setFeedbackDetail] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update logged in passenger when customerData changes
  useEffect(() => {
    console.log("🔍 CustomerData received:", customerData);
    console.log("🔍 CustomerLoggedIn status:", customerLoggedIn);
    if (customerData && customerData.name) {
      console.log("🔍 Setting logged in passenger:", customerData.name);
      setLoggedInPassenger(customerData.name);
    } else {
      console.log("🔍 No customer data or name found");
      setLoggedInPassenger("");
    }
  }, [customerData, customerLoggedIn]);

  // Refresh when new booking is made
  useEffect(() => {
    if (refreshTrigger) {
      fetchBookings();
    }
  }, [refreshTrigger]);

  // Re-fetch bookings when admin status changes
  useEffect(() => {
    fetchBookings();
  }, [isAdminMode]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/bookings");
      console.log("✅ All bookings fetched:", response.data);
      console.log("📊 Bookings count:", response.data.length);
      
      // Verify customer details exist in first booking
      if (response.data.length > 0) {
        const firstBooking = response.data[0];
        console.log("🔍 First booking customer details:");
        console.log("  - passengerName:", firstBooking.passengerName);
        console.log("  - passengerId:", firstBooking.passengerId);
        console.log("  - phoneNumber:", firstBooking.phoneNumber);
        console.log("  - pickupLocation:", firstBooking.pickupLocation);
      }

      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      setError("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on user type
  const getFilteredBookings = () => {
    if (isAdminMode) {
      return bookings; // Admin sees all
    }
    // User sees only their bookings - match by passenger name
    if (!loggedInPassenger) {
      return [];
    }
    const filtered = bookings.filter(booking => {
      const match = booking.passengerName && booking.passengerName.toLowerCase() === loggedInPassenger.toLowerCase();
      console.log(`🔍 Checking booking: "${booking.passengerName}" === "${loggedInPassenger}" = ${match}`);
      return match;
    });
    console.log(`🔍 Filtered bookings for ${loggedInPassenger}:`, filtered);
    return filtered;
  };

  const filteredBookings = getFilteredBookings();
  
  // Separate active and completed bookings
  const activeBookings = filteredBookings.filter(booking => {
    const returnDate = new Date(booking.returnDate);
    const today = new Date();
    return returnDate >= today || booking.status === 'active';
  });
  
  const completedBookings = filteredBookings.filter(booking => {
    const returnDate = new Date(booking.returnDate);
    const today = new Date();
    return returnDate < today && booking.status !== 'active';
  });

  // Auto-complete bookings that are past return date
  const autoCompleteBookings = async () => {
    const today = new Date();
    const toComplete = activeBookings.filter(booking => {
      const returnDate = new Date(booking.returnDate);
      return returnDate < today;
    });
    
    for (const booking of toComplete) {
      try {
        await axios.patch(`http://localhost:8000/api/bookings/${booking._id}`, {
          status: 'completed'
        });
      } catch (error) {
        console.log('Auto-complete failed for booking:', booking._id);
      }
    }
    
    if (toComplete.length > 0) {
      fetchBookings(); // Refresh to show updated status
    }
  };

  // Auto-complete on load
  useEffect(() => {
    if (filteredBookings.length > 0) {
      autoCompleteBookings();
    }
  }, [bookings]);

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b._id !== bookingId));
      alert("✅ Booking cancelled successfully!");
    } catch (err) {
      console.error("❌ Error deleting booking:", err);
      alert("Failed to cancel booking");
    }
  };

  if (showFeedbackPage && selectedBooking) {
    return (
      <FeedbackPage 
        booking={selectedBooking}
        onBack={() => {
          setShowFeedbackPage(false);
          setSelectedBooking(null);
          fetchBookings(); // Refresh after feedback submission
        }}
      />
    );
  }

  if (showFeedbackDetail && feedbackDetail) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <button
            onClick={() => {
              setShowFeedbackDetail(false);
              setFeedbackDetail(null);
            }}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#333'
            }}
          >
            ✕
          </button>

          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📝 Customer Feedback Details</h2>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Trip Information</h3>
            <p><strong>Car:</strong> {feedbackDetail.carName}</p>
            <p><strong>Customer:</strong> {feedbackDetail.passengerName}</p>
            <p><strong>Route:</strong> {feedbackDetail.pickupLocation} → {feedbackDetail.destination}</p>
            <p><strong>Feedback Submitted:</strong> {new Date(feedbackDetail.feedbackSubmittedAt).toLocaleDateString()}</p>
          </div>

          <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>⭐ Rating</h3>
            <div style={{ fontSize: '24px', color: '#f39c12' }}>
              {'⭐'.repeat(feedbackDetail.rating)}<span style={{ color: '#95a5a6' }}>{'☆'.repeat(5 - feedbackDetail.rating)}</span>
              <p style={{ margin: '10px 0 0 0' }}><strong>{feedbackDetail.rating}/5 Stars</strong></p>
            </div>
          </div>

          <div style={{ backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>💬 Feedback</h3>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {feedbackDetail.feedback}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h2>📋 {isAdminMode ? "👑 All Bookings (ADMIN MODE)" : "My Bookings"}</h2>
        <button 
          onClick={() => setDebugMode(!debugMode)}
          style={{
            padding: "8px 12px",
            fontSize: "12px",
            backgroundColor: debugMode ? "#e74c3c" : "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {debugMode ? "🔴 Debug ON" : "⚪ Debug OFF"}
        </button>
      </div>

      {debugMode && (
        <div style={{
          backgroundColor: "#ecf0f1",
          padding: "10px",
          marginBottom: "15px",
          borderRadius: "5px",
          fontSize: "12px",
          fontFamily: "monospace"
        }}>
          <p><strong>📊 Debug Info:</strong></p>
          <p>Total bookings: {bookings.length}</p>
          <p>Admin mode: {isAdminMode ? "Yes" : "No"}</p>
          <p>Customer logged in (prop): {customerLoggedIn ? "Yes" : "No"}</p>
          <p>Customer data (prop): {customerData ? JSON.stringify(customerData) : "None"}</p>
          <p>Logged in passenger (state): {loggedInPassenger || "None"}</p>
          <p>Filtered bookings: {filteredBookings.length}</p>
          <p>Active bookings: {activeBookings.length}</p>
          <p>Completed bookings: {completedBookings.length}</p>
        </div>
      )}

      {!customerLoggedIn && !isAdminMode && (
        <div className="no-bookings">
          <p>👤 Please login to see your bookings!</p>
        </div>
      )}

      {customerLoggedIn && !isAdminMode && filteredBookings.length === 0 && (
        <div className="no-bookings">
          <p>👤 No bookings yet for {loggedInPassenger}. Book a car to see your reservations!</p>
        </div>
      )}

      {isAdminMode && bookings.length === 0 && (
        <div className="no-bookings">
          <p>📋 No bookings in the system yet.</p>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {/* Active Bookings */}
      {activeBookings.length > 0 && (
        <div>
          <h3 style={{ color: '#27ae60', marginTop: '20px' }}>🚗 Active Trips ({activeBookings.length})</h3>
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Passenger</th>
                  <th>Aadhar/PAN ID</th>
                  <th>Phone</th>
                  <th>Route</th>
                  <th>License</th>
                  <th>Booking Date</th>
                  <th>Return Date</th>
                  <th>Days</th>
                  <th>₹/Day</th>
                  <th>Total</th>
                  <th>Status</th>
                  {isAdminMode && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {activeBookings.map((booking) => {
                  const days = calculateDays(booking.bookingDate, booking.returnDate);
                  const rentPerDay = booking.rent || 0;
                  const totalRent = booking.totalRent || (rentPerDay * days);

                  return (
                    <tr key={booking._id}>
                      <td><strong>{booking.carName}</strong></td>
                      <td>{booking.passengerName || <span style={{color: 'red'}}>MISSING</span>}</td>
                      <td><strong>{booking.passengerId || <span style={{color: 'red'}}>MISSING</span>}</strong></td>
                      <td>{booking.phoneNumber || <span style={{color: 'red'}}>MISSING</span>}</td>
                      <td>{booking.pickupLocation} → {booking.destination}</td>
                      <td>{booking.drivingLicense}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                      <td><strong>{days}</strong></td>
                      <td><strong>₹{rentPerDay}</strong></td>
                      <td><strong style={{ color: '#27ae60' }}>₹{totalRent}</strong></td>
                      <td><span style={{ color: '#f39c12', fontWeight: 'bold' }}>🚗 Active</span></td>
                      {isAdminMode && (
                        <td>
                          <button 
                            onClick={() => deleteBooking(booking._id)}
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            ❌ Cancel
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Completed Bookings */}
      {completedBookings.length > 0 && (
        <div>
          <h3 style={{ color: '#95a5a6', marginTop: '30px' }}>✅ Completed Trips ({completedBookings.length})</h3>
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Passenger</th>
                  <th>Aadhar/PAN ID</th>
                  <th>Phone</th>
                  <th>Route</th>
                  <th>License</th>
                  <th>Booking Date</th>
                  <th>Return Date</th>
                  <th>Days</th>
                  <th>₹/Day</th>
                  <th>Total</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {completedBookings.map((booking) => {
                  const days = calculateDays(booking.bookingDate, booking.returnDate);
                  const rentPerDay = booking.rent || 0;
                  const totalRent = booking.totalRent || (rentPerDay * days);

                  return (
                    <tr key={booking._id} style={{ opacity: 0.7 }}>
                      <td><strong>{booking.carName}</strong></td>
                      <td>{booking.passengerName || <span style={{color: 'red'}}>MISSING</span>}</td>
                      <td>{booking.passengerId || <span style={{color: 'red'}}>MISSING</span>}</td>
                      <td>{booking.phoneNumber || <span style={{color: 'red'}}>MISSING</span>}</td>
                      <td>{booking.pickupLocation} → {booking.destination}</td>
                      <td>{booking.drivingLicense}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                      <td><strong>{days}</strong></td>
                      <td><strong>₹{rentPerDay}</strong></td>
                      <td><strong style={{ color: '#27ae60' }}>₹{totalRent}</strong></td>
                      <td>
                        {booking.feedback ? (
                          <button 
                            onClick={() => {
                              setFeedbackDetail(booking);
                              setShowFeedbackDetail(true);
                            }}
                            style={{
                              padding: '8px 15px',
                              backgroundColor: '#27ae60',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 'bold'
                            }}
                          >
                            ✅ View Feedback
                          </button>
                        ) : !isAdminMode ? (
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowFeedbackPage(true);
                            }}
                            style={{
                              padding: '8px 15px',
                              backgroundColor: '#e67e22',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 'bold'
                            }}
                          >
                            📝 Give Feedback
                          </button>
                        ) : (
                          <span style={{ color: '#95a5a6' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Function to calculate days
const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

// IMPORTANT: Export default
export default BookingList;
