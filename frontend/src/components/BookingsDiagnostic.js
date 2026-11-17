// Diagnostic component to test if customer details are showing
import React, { useState, useEffect } from "react";
import axios from "axios";

function BookingsDiagnostic() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testFetch = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/bookings");
        console.log("✅ Raw API response:", response.data);
        
        if (response.data.length > 0) {
          const firstBooking = response.data[0];
          console.log("First booking details:");
          console.log("- passengerName:", firstBooking.passengerName);
          console.log("- passengerId:", firstBooking.passengerId);
          console.log("- phoneNumber:", firstBooking.phoneNumber);
          console.log("- pickupLocation:", firstBooking.pickupLocation);
          console.log("- destination:", firstBooking.destination);
        }
        
        setBookings(response.data);
      } catch (err) {
        setError(err.message);
        console.error("❌ Error:", err);
      }
    };
    
    testFetch();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace", backgroundColor: "#f5f5f5" }}>
      <h2>🔍 Bookings Diagnostic</h2>
      
      {error && <p style={{ color: "red" }}>❌ Error: {error}</p>}
      
      <p><strong>Total bookings found:</strong> {bookings.length}</p>
      
      {bookings.length > 0 && (
        <div>
          <h3>First 3 bookings:</h3>
          {bookings.slice(0, 3).map((booking, idx) => (
            <div key={idx} style={{ 
              border: "1px solid #ccc", 
              padding: "10px", 
              marginBottom: "10px",
              backgroundColor: "white"
            }}>
              <p><strong>#{idx + 1}</strong></p>
              <p>🚗 Car: {booking.carName}</p>
              <p>👤 Passenger: {booking.passengerName || <span style={{color: "red"}}>MISSING</span>}</p>
              <p>🆔 ID: {booking.passengerId || <span style={{color: "red"}}>MISSING</span>}</p>
              <p>📱 Phone: {booking.phoneNumber || <span style={{color: "red"}}>MISSING</span>}</p>
              <p>📍 Route: {booking.pickupLocation} → {booking.destination}</p>
            </div>
          ))}
        </div>
      )}
      
      <details style={{ marginTop: "20px" }}>
        <summary>View raw JSON data</summary>
        <pre style={{ backgroundColor: "#eee", padding: "10px", overflow: "auto" }}>
          {JSON.stringify(bookings.slice(0, 3), null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default BookingsDiagnostic;
