import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  carName: {
    type: String,
    required: true
  },
  carModel: {
    type: String,
    required: true
  },
  carType: {
    type: String,
    required: true,
    enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports']
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  weekendPrice: {
    type: Number,
    default: function() { return this.pricePerDay * 1.2; }
  },
  peakSeasonPrice: {
    type: Number,
    default: function() { return this.pricePerDay * 1.5; }
  },
  imageUrl: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    default: "Petrol"
  },
  transmission: {
    type: String,
    default: "Manual"
  },
  seatingCapacity: {
    type: Number,
    default: 5
  },
  availability: {
    type: Boolean,
    default: true
  },
  lastServiceDate: {
    type: Date
  },
  nextServiceDate: {
    type: Date
  },
  maintenanceNotes: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  gpsTracking: {
    isEnabled: {
      type: Boolean,
      default: false
    },
    currentLocation: {
      latitude: Number,
      longitude: Number,
      address: String,
      lastUpdated: Date
    },
    speed: {
      type: Number,
      default: 0
    },
    fuelLevel: {
      type: Number,
      default: 100
    },
    alerts: [{
      type: {
        type: String,
        enum: ['overspeeding', 'low_fuel', 'maintenance']
      },
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      resolved: {
        type: Boolean,
        default: false
      }
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Car = mongoose.model("Car", carSchema);

export default Car;