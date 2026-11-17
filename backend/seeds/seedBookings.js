import mongoose from "mongoose";
import Booking from "../models/Booking.js";

mongoose.connect("mongodb://127.0.0.1:27017/car_rent");

const bookingsData = [
  {
    carName: "BMW X5",
    passengerName: "Rajesh Kumar",
    passengerId: "AADHAR123456789",
    phoneNumber: "9876543210",
    pickupLocation: "Haveri",
    destination: "Pune",
    drivingLicense: "KA1234567890",
    bookingDate: new Date(),
    returnDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    totalDays: 3,
    rent: 5000,
    totalRent: 15000,
    routeProgress: 25
  },
  {
    carName: "Hyundai Creta",
    passengerName: "Priya Sharma",
    passengerId: "AADHAR987654321",
    phoneNumber: "8765432109",
    pickupLocation: "Bangalore",
    destination: "Chennai",
    drivingLicense: "KA0987654321",
    bookingDate: new Date(),
    returnDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    totalDays: 2,
    rent: 1500,
    totalRent: 3000,
    routeProgress: 60
  },
  {
    carName: "Toyota Fortuner",
    passengerName: "Amit Patel",
    passengerId: "AADHAR456789123",
    phoneNumber: "7654321098",
    pickupLocation: "Mumbai",
    destination: "Delhi",
    drivingLicense: "MH1122334455",
    bookingDate: new Date(),
    returnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    totalDays: 4,
    rent: 3000,
    totalRent: 12000,
    routeProgress: 40
  }
];

async function seedBookings() {
  try {
    await Booking.deleteMany({});
    console.log("🗑️  Cleared existing bookings");

    const result = await Booking.insertMany(bookingsData);
    console.log(`✅ Successfully seeded ${result.length} bookings!`);

    const allBookings = await Booking.find();
    console.log("\n📋 Bookings in database:");
    allBookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.carName} - ${booking.passengerName} (${booking.pickupLocation} → ${booking.destination})`);
    });

    mongoose.connection.close();
    console.log("\n✅ Booking seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding bookings:", error);
    mongoose.connection.close();
  }
}

seedBookings();