import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from 'html5-qrcode';
import CustomerOffers from "./CustomerOffers";
import "./BookingForm.css";

export default function BookingForm({ car, onClose, onBookingSuccess }) {
  // Get customer data from login
  const customerInfo = JSON.parse(localStorage.getItem("customerData") || '{}');
  
  console.log("🔍 Customer Info in Booking Form:", customerInfo);
  console.log("🔍 Customer Name:", customerInfo.name);
  
  const [formData, setFormData] = useState({
    carName: car.carName,
    passengerName: customerInfo.name || "",
    passengerId: "",  // User must enter Aadhar/PAN ID manually (not auto-filled)
    phoneNumber: customerInfo.phoneNumber || "",
    fromLocation: "",
    toLocation: "",
    bookingDate: "",
    returnDate: "",
    drivingLicense: "",
    paymentMethod: "cash",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalRent, setTotalRent] = useState(0);
  const [extraCharges, setExtraCharges] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [finalAmount, setFinalAmount] = useState(0);
  const [showUPIScanner, setShowUPIScanner] = useState(false);
  const [bookingDataForPayment, setBookingDataForPayment] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [qrScannedData, setQrScannedData] = useState(null);
  const [scannerStarted, setScannerStarted] = useState(false);
  const scannerRef = useRef(null);
  const html5ScannerRef = useRef(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check for loyalty discount when passenger name is entered
    if (name === "passengerName" && value.trim()) {
      try {
        const response = await axios.get(`http://localhost:8000/api/bookings`);
        const customerBookings = response.data.filter(booking => 
          booking.passengerName.toLowerCase() === value.toLowerCase()
        );
        
        if (customerBookings.length >= 5) {
          setSelectedOffer({
            title: `Loyalty Discount (${customerBookings.length} bookings)`,
            discount: 50,
            description: `50% off for 5+ bookings`,
            category: 'Premium Customer'
          });
        } else if (customerBookings.length >= 3) {
          setSelectedOffer({
            title: `Loyalty Discount (${customerBookings.length} bookings)`,
            discount: 20,
            description: `20% off for 3+ bookings`,
            category: 'Regular Customer'
          });
        } else {
          setSelectedOffer(null);
        }
      } catch (error) {
        console.log("Could not check loyalty status");
      }
    }

    // Calculate days and rent when dates or locations change
    if (name === "bookingDate" || name === "returnDate" || name === "fromLocation" || name === "toLocation") {
      const updatedData = { ...formData, [name]: value };
      if (updatedData.bookingDate && updatedData.returnDate) {
        const days = calculateDays(updatedData.bookingDate, updatedData.returnDate);
        setTotalDays(days);
        
        // Calculate extra charges for out-of-state travel
        let extra = 0;
        const isOutOfState = checkOutOfStateTravel(updatedData.fromLocation, updatedData.toLocation);
        if (isOutOfState) {
          extra = days * 1000; // ₹1000 per day extra for out-of-state
        }
        setExtraCharges(extra);
        const baseAmount = days * (car.pricePerDay || 0) + extra;
        setTotalRent(baseAmount);
        calculateFinalAmount(baseAmount, selectedOffer);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.passengerName || !formData.passengerId || !formData.phoneNumber || 
        !formData.fromLocation || !formData.toLocation || !formData.bookingDate || !formData.returnDate || !formData.drivingLicense) {
      setError("All fields are required!");
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setError("Invalid number - Phone number must be exactly 10 digits!");
      return;
    }

    if (totalDays <= 0) {
      setError("Return date must be after booking date!");
      return;
    }

    // If UPI is selected, show QR scanner instead of direct booking
    if (formData.paymentMethod === 'upi') {
      const customerInfo = JSON.parse(localStorage.getItem("customerData") || '{}');
      
      const booking = {
        carName: formData.carName,
        passengerName: formData.passengerName,
        passengerId: formData.passengerId,
        customerPassengerId: customerInfo.passengerId || 'CR01',
        phoneNumber: formData.phoneNumber,
        pickupLocation: formData.fromLocation,
        destination: formData.toLocation,
        drivingLicense: formData.drivingLicense,
        bookingDate: formData.bookingDate,
        returnDate: formData.returnDate,
        totalDays: totalDays,
        rent: car.pricePerDay || 0,
        totalRent: finalAmount || totalRent,
        originalAmount: totalRent,
        discountApplied: selectedOffer ? selectedOffer.discount : 0,
        discountAmount: selectedOffer ? Math.round((totalRent * selectedOffer.discount) / 100) : 0,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending'
      };

      setBookingDataForPayment(booking);
      setShowUPIScanner(true);
      return;
    }

    try {
      setLoading(true);

      // Use customer data from login
      const customerInfo = JSON.parse(localStorage.getItem("customerData") || '{}');
      
      const booking = {
        carName: formData.carName,
        passengerName: formData.passengerName,
        passengerId: formData.passengerId,
        customerPassengerId: customerInfo.passengerId || 'CR01',
        phoneNumber: formData.phoneNumber,
        pickupLocation: formData.fromLocation,
        destination: formData.toLocation,
        drivingLicense: formData.drivingLicense,
        bookingDate: formData.bookingDate,
        returnDate: formData.returnDate,
        totalDays: totalDays,
        rent: car.pricePerDay || 0,
        totalRent: finalAmount || totalRent,
        originalAmount: totalRent,
        discountApplied: selectedOffer ? selectedOffer.discount : 0,
        discountAmount: selectedOffer ? Math.round((totalRent * selectedOffer.discount) / 100) : 0,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cash' ? 'pending' : 'completed'
      };

      console.log("📤 Sending booking data:", booking);

      const response = await axios.post("http://localhost:8000/api/bookings", booking);
      
      console.log("✅ Booking created:", response.data);
      
      // Show thank you message with discount info
      const discountInfo = selectedOffer ? `\nDiscount Applied: ${selectedOffer.discount}% OFF\nOriginal Amount: ₹${totalRent}\nFinal Amount: ₹${finalAmount}` : '';
      alert(`🎉 Thank you for booking!\n\n✅ Booking Confirmed Successfully!\n\nCar: ${car.carName}\nPassenger: ${formData.passengerName}\nTotal Days: ${totalDays}${discountInfo}\nTotal Rent: ₹${finalAmount || totalRent}\n\n📱 SMS confirmation sent to ${formData.phoneNumber}\n\nYour booking has been saved. You can view it "My Bookings" section.`);
      
      // Reset form
      setFormData({
        carName: car.carName,
        passengerName: "",
        passengerId: "",
        phoneNumber: "",
        fromLocation: "",
        toLocation: "",
        bookingDate: "",
        returnDate: "",
        drivingLicense: "",
      });

      setTotalDays(0);
      setTotalRent(0);
      setError(null);
      
      // Close form and trigger refresh
      onClose();
      onBookingSuccess();
    } catch (err) {
      console.error("❌ Booking error:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error data:", err.response?.data);
      setError(err.response?.data?.error || err.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const checkOutOfStateTravel = (from, to) => {
    const karnatakaPlaces = [
      // Districts
      'bagalkote', 'ballari', 'bellary', 'belagavi', 'belgaum', 'bengaluru', 'bangalore',
      'bengaluru rural', 'bengaluru urban', 'bidar', 'chamarajanagar', 'chikkaballapura',
      'chikkamagaluru', 'chikmagalur', 'chitradurga', 'dakshina kannada', 'davanagere',
      'dharwad', 'gadag', 'hassan', 'haveri', 'kalaburagi', 'gulbarga', 'kodagu', 'coorg',
      'kolar', 'koppal', 'mandya', 'mysuru', 'mysore', 'raichur', 'ramanagara',
      'shivamogga', 'shimoga', 'tumakuru', 'tumkur', 'udupi', 'uttara kannada', 'karwar',
      'vijayapura', 'bijapur', 'yadgir', 'vijayanagara', 'karnataka',
      // Major cities and towns
      'hubli', 'huballi', 'mangalore', 'mangaluru', 'gulbarga', 'bijapur', 'belgaum',
      'davangere', 'bellary', 'hospet', 'raichur', 'bidar', 'karwar', 'udupi',
      'chikmagalur', 'hassan', 'mandya', 'kolar', 'tumkur', 'chitradurga',
      'shimoga', 'bhadravati', 'sirsi', 'madikeri', 'puttur', 'sullia', 'bantwal',
      'kundapura', 'bhatkal', 'honavar', 'ankola', 'kumta', 'haliyal', 'dandeli',
      'yellapur', 'sagar', 'sorab', 'hosanagar', 'thirthahalli', 'koppa',
      'narasimharajapura', 'tarikere', 'kadur', 'birur', 'arsikere', 'channarayapatna',
      'holenarasipura', 'sakleshpur', 'belur', 'halebid', 'alur', 'arkalgud',
      'pandavapura', 'srirangapatna', 'krishnarajpet', 'nagamangala', 'malavalli',
      'maddur', 'channapatna', 'kanakapura', 'magadi', 'ramanagara', 'closepet',
      'doddaballapur', 'devanahalli', 'hoskote', 'anekal', 'channapatna',
      'mulbagal', 'malur', 'srinivaspur', 'kgf', 'robertsonpet', 'bangarpet',
      'chintamani', 'sidlaghatta', 'shidlaghatta', 'gudibanda', 'bagepalli',
      'chikballapur', 'gouribidanur', 'yelahanka', 'whitefield', 'electronic city',
      'koramangala', 'indiranagar', 'jayanagar', 'rajajinagar', 'malleswaram',
      'basavanagudi', 'chickpet', 'shivajinagar', 'fraser town', 'benson town',
      'rt nagar', 'hebbal', 'marathahalli', 'sarjapur', 'hsr layout', 'btm layout'
    ];
    
    const fromLower = from.toLowerCase().trim();
    const toLower = to.toLowerCase().trim();
    
    const fromInKarnataka = karnatakaPlaces.some(place => 
      fromLower.includes(place) || place.includes(fromLower.split(',')[0].trim())
    );
    const toInKarnataka = karnatakaPlaces.some(place => 
      toLower.includes(place) || place.includes(toLower.split(',')[0].trim())
    );
    
    return !fromInKarnataka || !toInKarnataka;
  };

  const calculateFinalAmount = (baseAmount, offer) => {
    if (offer) {
      const discount = (baseAmount * offer.discount) / 100;
      setFinalAmount(baseAmount - discount);
    } else {
      setFinalAmount(baseAmount);
    }
  };

  const handleOfferSelect = (offer) => {
    setSelectedOffer(offer);
    calculateFinalAmount(totalRent, offer);
  };

  // Handle UPI payment completion
  const handleUPIPaymentComplete = async () => {
    try {
      setPaymentProcessing(true);
      console.log("📤 Processing UPI payment for booking:", bookingDataForPayment);
      
      // Update payment status to completed
      const updatedBooking = {
        ...bookingDataForPayment,
        paymentStatus: 'completed'
      };

      const response = await axios.post("http://localhost:8000/api/bookings", updatedBooking);
      
      console.log("✅ UPI Payment successful! Booking created:", response.data);
      
      const discountInfo = selectedOffer ? `\nDiscount Applied: ${selectedOffer.discount}% OFF\nOriginal Amount: ₹${bookingDataForPayment.originalAmount}\nFinal Amount: ₹${bookingDataForPayment.totalRent}` : '';
      alert(`🎉 Payment Successful!\n\n✅ Booking Confirmed!\n\nCar: ${bookingDataForPayment.carName}\nPassenger: ${bookingDataForPayment.passengerName}\nTotal Days: ${bookingDataForPayment.totalDays}${discountInfo}\nTotal Rent: ₹${bookingDataForPayment.totalRent}\n\n📱 SMS confirmation sent to ${bookingDataForPayment.phoneNumber}\n\nYour booking has been saved!`);
      
      setShowUPIScanner(false);
      setBookingDataForPayment(null);
      onClose();
      onBookingSuccess();
    } catch (err) {
      console.error("❌ Payment failed:", err);
      alert("❌ Payment failed. Please try again.");
      setShowUPIScanner(false);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Initialize QR Scanner when modal opens
  useEffect(() => {
    if (showUPIScanner && scannerRef.current && !html5ScannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-scanner-container",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false
        },
        false
      );

      const onScanSuccess = (decodedText, decodedResult) => {
        console.log("✅ QR Code Scanned:", decodedText);
        setQrScannedData(decodedText);
        
        // Stop scanner
        if (html5ScannerRef.current) {
          html5ScannerRef.current.clear();
          html5ScannerRef.current = null;
        }
      };

      const onScanFailure = (error) => {
        // Ignore errors - scanner will keep trying
      };

      scanner.render(onScanSuccess, onScanFailure);
      html5ScannerRef.current = scanner;
      setScannerStarted(true);
    }

    return () => {
      // Cleanup scanner when component unmounts
      if (html5ScannerRef.current) {
        html5ScannerRef.current.clear();
        html5ScannerRef.current = null;
      }
    };
  }, [showUPIScanner]);

  // UPI QR Code Scanner Modal
  if (showUPIScanner && bookingDataForPayment) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <button 
            onClick={() => {
              setShowUPIScanner(false);
              setBookingDataForPayment(null);
            }}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#333'
            }}
          >✕</button>

          <h2 style={{ color: '#27ae60', marginBottom: '20px' }}>📱 UPI Payment</h2>
          
          {/* Booking Summary */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            textAlign: 'left'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Booking Summary</h3>
            <p><strong>Car:</strong> {bookingDataForPayment.carName}</p>
            <p><strong>Passenger:</strong> {bookingDataForPayment.passengerName}</p>
            <p><strong>Duration:</strong> {bookingDataForPayment.totalDays} days</p>
            <p><strong>Base Amount:</strong> ₹{bookingDataForPayment.originalAmount}</p>
            {bookingDataForPayment.discountAmount > 0 && (
              <p style={{ color: '#27ae60' }}><strong>Discount:</strong> -₹{bookingDataForPayment.discountAmount} ({bookingDataForPayment.discountApplied}%)</p>
            )}
            <hr />
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c', margin: '10px 0 0 0' }}>
              <strong>Total Amount: ₹{bookingDataForPayment.totalRent}</strong>
            </p>
          </div>

          {/* QR Code Display */}
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            marginBottom: '25px',
            overflow: 'hidden',
            border: '3px solid #27ae60',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Scan UPI QR Code</h3>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=carrent@upi&pn=CarRentSystem&am=${bookingDataForPayment.totalRent}&tr=CAR${bookingDataForPayment.totalDays}`}
              alt="UPI QR Code"
              style={{
                width: '250px',
                height: '250px',
                border: '2px solid #27ae60',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            />
            <p style={{ margin: '10px 0', color: '#7f8c8d', fontSize: '14px', textAlign: 'center' }}>
              <strong>Amount: ₹{bookingDataForPayment.totalRent}</strong><br/>
              Use any UPI app to scan and pay
            </p>
            {qrScannedData && (
              <div style={{
                width: '100%',
                backgroundColor: '#27ae60',
                color: 'white',
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                borderRadius: '8px',
                marginTop: '10px'
              }}>
                ✅ Payment Received!
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: '#fff3cd',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#856404',
            fontSize: '13px'
          }}>
            � Ask the customer to scan this QR code with their UPI app to complete the payment
            {qrScannedData && (
              <div style={{ marginTop: '8px', color: '#27ae60', fontWeight: 'bold' }}>
                ✅ Payment Received Successfully!
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => {
                if (html5ScannerRef.current) {
                  html5ScannerRef.current.clear();
                  html5ScannerRef.current = null;
                }
                setShowUPIScanner(false);
                setBookingDataForPayment(null);
                setQrScannedData(null);
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleUPIPaymentComplete}
              disabled={paymentProcessing}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: paymentProcessing ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: paymentProcessing ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {paymentProcessing ? 'Processing Payment...' : '✅ Payment Completed'}
            </button>
          </div>

          <style>{`
            @keyframes pulse {
              0% {
                box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7);
              }
              70% {
                box-shadow: 0 0 0 15px rgba(39, 174, 96, 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgba(39, 174, 96, 0);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-container">
      <button className="close-btn" onClick={onClose}>✕</button>
      
      <div className="form-header">
        <h3>🚗 Book Your Car</h3>
        <p className="car-info">{car.carName} - ₹{car.pricePerDay}/day</p>
      </div>
      
            {selectedOffer && (
              <div style={{
                backgroundColor: '#e8f5e8',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid #27ae60',
                margin: '10px 0'
              }}>
                <h4 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>
                  🎉 {selectedOffer.title}
                </h4>
                <p style={{ margin: '5px 0', color: '#2c3e50' }}>
                  <strong>Category:</strong> {selectedOffer.category}
                </p>
                <p style={{ margin: '5px 0', color: '#555' }}>
                  {selectedOffer.description}
                </p>
                <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#27ae60' }}>
                  You save: ₹{Math.round((totalRent * selectedOffer.discount) / 100)}
                </p>
              </div>
            )}
      
      {error && <div className="error-msg">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Passenger Information */}
        <div className="form-section">
          <h4>👤 Passenger Information</h4>
          
          <div className="form-group">
            <label>Passenger Name *</label>
            <input
              type="text"
              name="passengerName"
              value={formData.passengerName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Aadhar ID / PAN Card ID *</label>
              <input
                type="text"
                name="passengerId"
                value={formData.passengerId}
                onChange={handleChange}
                placeholder="Enter Aadhar ID or PAN Card ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                minLength="10"
                pattern="[0-9]{10}"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
                required
              />
              {formData.phoneNumber && formData.phoneNumber.length !== 10 && (
                <div style={{color: '#d63031', fontSize: '0.9rem', marginTop: '5px'}}>
                  Invalid number - Must be exactly 10 digits
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Driving License Number *</label>
            <input
              type="text"
              name="drivingLicense"
              value={formData.drivingLicense}
              onChange={handleChange}
              placeholder="Enter driving license number"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>From Location *</label>
              <input
                type="text"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                placeholder="Enter pickup location"
                required
              />
            </div>

            <div className="form-group">
              <label>To Location *</label>
              <input
                type="text"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                placeholder="Enter destination"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-section">
          <h4>💳 Payment Method</h4>
          
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange}
              />
              <span>💵 Cash</span>
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === 'upi'}
                onChange={handleChange}
              />
              <span>📱 UPI Payment</span>
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="debit_card"
                checked={formData.paymentMethod === 'debit_card'}
                onChange={handleChange}
              />
              <span>💳 Debit Card</span>
            </label>
            
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={formData.paymentMethod === 'credit_card'}
                onChange={handleChange}
              />
              <span>💳 Credit Card</span>
            </label>
          </div>
        </div>
        <div className="form-section">
          <h4>📅 Booking Dates</h4>
          
          <div className="form-row">
            <div className="form-group">
              <label>Booking Date *</label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Return Date *</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Rent Summary */}
        {totalDays > 0 && (
          <div className="rent-summary">
            <div className="summary-row">
              <span>Price Per Day:</span>
              <strong>₹{car.pricePerDay}</strong>
            </div>
            <div className="summary-row">
              <span>Number of Days:</span>
              <strong>{totalDays} days</strong>
            </div>
            <div className="summary-row">
              <span>Base Amount:</span>
              <strong>₹{totalDays * car.pricePerDay}</strong>
            </div>
            {extraCharges > 0 && (
              <div className="summary-row" style={{ color: '#e74c3c' }}>
                <span>Out-of-State Charges:</span>
                <strong>₹{extraCharges}</strong>
              </div>
            )}
            {selectedOffer && (
              <div className="summary-row" style={{ color: '#27ae60' }}>
                <span>{selectedOffer.title} ({selectedOffer.discount}% OFF):</span>
                <strong>-₹{Math.round((totalRent * selectedOffer.discount) / 100)}</strong>
              </div>
            )}
            <div className="summary-row total">
              <span>Final Amount:</span>
              <strong>₹{finalAmount}</strong>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || totalDays <= 0 || formData.phoneNumber.length !== 10}
        >
          {loading ? "⏳ Processing..." : `✅ Confirm Booking - ₹${finalAmount}`}
        </button>
      </form>
    </div>
  );
}