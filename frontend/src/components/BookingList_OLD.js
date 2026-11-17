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

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update logged in passenger when customerData changes
  useEffect(() => {
    if (customerData && customerData.name) {
      console.log("🔍 Setting logged in passenger:", customerData.name);
      setLoggedInPassenger(customerData.name);
    } else {
      console.log("🔍 No customer data or name found");
      setLoggedInPassenger("");
    }
  }, [customerData]);

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
      console.log("🔍 Customer data received:", customerData);
      console.log("🔍 Customer logged in:", customerLoggedIn);

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
        }}
      />
    );
  }

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h2>📋 {isAdminMode ? "👑 All Bookings (ADMIN MODE)" : "My Bookings"}</h2>
      </div>

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

      {error && <div className="error-msg">{error}</div>}

      {/* Active Bookings */}
      {activeBookings.length > 0 && (
        <div>
          <h3 style={{ color: '#27ae60', marginTop: '20px' }}>🚗 Active Trips</h3>
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Passenger</th>
                  <th>Aadhar ID / PAN ID</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>License</th>
                  <th>Booking Date</th>
                  <th>Return Date</th>
                  <th>Days</th>
                  <th>Rent/Day</th>
                  <th>Total Rent</th>
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
                      <td>{booking.passengerName}</td>
                      <td><strong style={{ color: '#3498db' }}>{booking.passengerId}</strong></td>
                      <td>{booking.phoneNumber}</td>
                      <td>{booking.pickupLocation} to {booking.destination}</td>
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
          <h3 style={{ color: '#95a5a6', marginTop: '30px' }}>✅ Completed Trips</h3>
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Passenger</th>
                  <th>Aadhar ID / PAN ID</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>License</th>
                  <th>Booking Date</th>
                  <th>Return Date</th>
                  <th>Days</th>
                  <th>Rent/Day</th>
                  <th>Total Rent</th>
                  <th>{isAdminMode ? 'Status' : 'Feedback'}</th>
                  {!isAdminMode && <th>Status</th>}
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
                      <td>{booking.passengerName}</td>
                      <td>{booking.passengerId}</td>
                      <td>{booking.phoneNumber}</td>
                      <td>{booking.pickupLocation} to {booking.destination}</td>
                      <td>{booking.drivingLicense}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.returnDate).toLocaleDateString()}</td>
                      <td><strong>{days}</strong></td>
                      <td><strong>₹{rentPerDay}</strong></td>
                      <td><strong style={{ color: '#27ae60' }}>₹{totalRent}</strong></td>
                      {!isAdminMode && (
                        <td>
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
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}
                          >
                            📝 Give Feedback
                          </button>
                        </td>
                      )}
                      {isAdminMode && (
                        <td><span style={{ color: '#27ae60', fontWeight: 'bold' }}>✅ Completed</span></td>
                      )}
                      {!isAdminMode && (
                        <td>
                          <span style={{ color: '#27ae60', fontWeight: 'bold' }}>✅ Completed</span>
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