// Test booking script to verify backend connectivity
const axios = require('axios');

const testBooking = {
  carName: "Hyundai Creta",
  passengerName: "John Doe",
  passengerId: "ABCD1234",
  phoneNumber: "9876543210",
  pickupLocation: "Bangalore",
  destination: "Mysore",
  drivingLicense: "DL12345678",
  bookingDate: "2024-12-08",
  returnDate: "2024-12-10",
  totalDays: 2,
  rent: 1500,
  totalRent: 3000
};

async function testBookingAPI() {
  try {
    console.log("🧪 Testing booking API...");
    const response = await axios.post("http://localhost:8000/api/bookings", testBooking);
    console.log("✅ Booking successful:", response.data);
    
    // Test fetching bookings
    const bookings = await axios.get("http://localhost:8000/api/bookings");
    console.log("✅ Fetched bookings:", bookings.data.length, "bookings found");
    
  } catch (error) {
    console.error("❌ Booking failed:", error.response?.data || error.message);
  }
}

testBookingAPI();