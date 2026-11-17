import mongoose from "mongoose";
import Booking from "./models/Booking.js";

mongoose.connect("mongodb://127.0.0.1:27017/car_rent");

async function fixCustomerDetails() {
  try {
    console.log("🔍 Checking bookings with missing customer details...");
    
    const bookings = await Booking.find();
    console.log(`\n📋 Total bookings in database: ${bookings.length}\n`);

    let missingCount = 0;
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.carName}`);
      console.log(`   - Passenger: ${booking.passengerName || '❌ MISSING'}`);
      console.log(`   - ID: ${booking.passengerId || '❌ MISSING'}`);
      console.log(`   - Phone: ${booking.phoneNumber || '❌ MISSING'}`);
      console.log(`   - Pickup: ${booking.pickupLocation || '❌ MISSING'}`);
      console.log(`   - Destination: ${booking.destination || '❌ MISSING'}`);
      
      if (!booking.passengerName || !booking.passengerId || !booking.phoneNumber) {
        missingCount++;
      }
      console.log('');
    });

    console.log(`\n⚠️  Bookings with missing customer details: ${missingCount}`);

    if (missingCount > 0) {
      console.log("\n📝 To fix this, either:");
      console.log("1. Run the seed script: node backend/seeds/seedBookings.js");
      console.log("2. Create new bookings through the UI (they should have all details)");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error checking bookings:", error);
    mongoose.connection.close();
  }
}

fixCustomerDetails();
