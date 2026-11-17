import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  carName: { type: String, required: true },
  passengerName: { type: String, required: true },
  passengerId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  drivingLicense: { type: String, required: true },
  totalDays: { type: Number, default: 0 },
  rent: { type: Number, default: 0 },
  totalRent: { type: Number, default: 0 },
  extraCharges: { type: Number, default: 0 },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  maintenanceNotes: { type: String, default: "" },
  routeProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

export default mongoose.model("Booking", bookingSchema);