import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  carName: { 
    type: String, 
    required: true 
  },
  passengerName: { 
    type: String, 
    required: true 
  },
  passengerId: { 
    type: String, 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 digits'
    }
  },
  pickupLocation: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  drivingLicense: { 
    type: String, 
    required: true 
  },
  bookingDate: { 
    type: Date, 
    required: true 
  },
  returnDate: { 
    type: Date, 
    required: true 
  },
  totalDays: { 
    type: Number,
    default: 0
  },
  rent: { 
    type: Number,
    default: 0
  },
  totalRent: { 
    type: Number,
    default: 0
  },
  originalAmount: {
    type: Number,
    default: 0
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'debit_card', 'credit_card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  routeProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedbackSubmittedAt: {
    type: Date,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;