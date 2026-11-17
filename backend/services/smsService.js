// SMS Service for Car Rental System
const sendBookingConfirmationSMS = async (phoneNumber, bookingDetails) => {
  try {
    const { carName, passengerName, bookingDate, returnDate, totalDays, totalRent } = bookingDetails;
    
    const message = `🎉 Car Booking Confirmed!

Dear ${passengerName},

Your booking is confirmed:
🚗 Car: ${carName}
📅 Pickup: ${new Date(bookingDate).toLocaleDateString()}
📅 Return: ${new Date(returnDate).toLocaleDateString()}
📊 Days: ${totalDays}
💰 Total: ₹${totalRent}

Thank you for choosing our service!

Car Rental System`;

    console.log(`📱 SMS sent to ${phoneNumber}:`);
    console.log(message);
    
    // For production, integrate with SMS providers like Twilio, MSG91, etc.
    
    return { success: true, messageId: 'demo_' + Date.now() };
    
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendBookingConfirmationSMS };