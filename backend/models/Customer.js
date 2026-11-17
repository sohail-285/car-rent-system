import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  totalBookings: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  customerCategory: { 
    type: String, 
    enum: ['new', 'regular', 'premium', 'vip'], 
    default: 'new' 
  },
  joinDate: { type: Date, default: Date.now },
  lastBookingDate: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model("Customer", customerSchema);