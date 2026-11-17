import express from "express";
import Customer from "../models/Customer.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// Check customer offers by name
router.get("/offers/:name", async (req, res) => {
  try {
    let customer = await Customer.findOne({ name: req.params.name });
    
    if (!customer) {
      customer = new Customer({ 
        email: `${req.params.name.toLowerCase().replace(/\s+/g, '')}@example.com`, 
        name: req.params.name 
      });
      await customer.save();
    }

    const offers = [];
    
    // Loyalty discount (5+ bookings)
    if (customer.totalBookings >= 5) {
      offers.push({
        type: "loyalty",
        title: "Loyalty Discount",
        description: "10% off for loyal customers",
        discount: 10,
        condition: "5+ bookings"
      });
    }
    
    // Weekly discount (booking within 7 days)
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (customer.lastBookingDate && customer.lastBookingDate > lastWeek) {
      offers.push({
        type: "weekly",
        title: "Weekly Discount",
        description: "5% off for booking again this week",
        discount: 5,
        condition: "Booked within 7 days"
      });
    }
    
    // Points-based offers
    if (customer.loyaltyPoints >= 100) {
      offers.push({
        type: "points",
        title: "Points Reward",
        description: "15% off using loyalty points",
        discount: 15,
        condition: "100+ loyalty points"
      });
    }
    
    // Premium customer benefits
    if (customer.customerCategory === 'premium' || customer.customerCategory === 'vip') {
      offers.push({
        type: "premium",
        title: "Premium Member Discount",
        description: "20% off for premium members",
        discount: 20,
        condition: "Premium/VIP member"
      });
    }

    res.json({ customer, offers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer after booking by name
router.post("/update/:name", async (req, res) => {
  try {
    const { bookingAmount } = req.body;
    
    let customer = await Customer.findOne({ name: req.params.name });
    if (!customer) {
      customer = new Customer({ 
        email: `${req.params.name.toLowerCase().replace(/\s+/g, '')}@example.com`, 
        name: req.params.name 
      });
    }
    
    customer.totalBookings += 1;
    customer.loyaltyPoints += Math.floor(bookingAmount / 100); // 1 point per ₹100
    customer.lastBookingDate = new Date();
    
    // Update customer category
    if (customer.totalBookings >= 20) {
      customer.customerCategory = 'vip';
    } else if (customer.totalBookings >= 10) {
      customer.customerCategory = 'premium';
    } else if (customer.totalBookings >= 3) {
      customer.customerCategory = 'regular';
    }
    
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;