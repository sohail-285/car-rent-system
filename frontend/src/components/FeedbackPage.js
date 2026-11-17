import React, { useState } from "react";
import axios from "axios";

export default function FeedbackPage({ booking, onBack }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save feedback and rating directly to the booking
      const feedbackData = {
        feedback: feedback,
        rating: rating,
        feedbackSubmittedAt: new Date()
      };

      await axios.patch(`http://localhost:8000/api/bookings/${booking._id}`, feedbackData);
      
      // Also save to reviews for analytics
      const reviewData = {
        carName: booking.carName,
        customerName: booking.passengerName,
        rating: rating,
        review: feedback,
        bookingId: booking._id
      };

      await axios.post("http://localhost:8000/api/reviews", reviewData).catch(() => {
        // Review save is optional, don't fail if it doesn't work
      });

      alert("✅ Thank you for your feedback!");
      onBack();
    } catch (error) {
      console.error("Feedback submission error:", error);
      alert(`❌ Failed to submit feedback: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back to My Bookings
      </button>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>
          ⭐ Rate Your Experience
        </h2>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Trip Details</h3>
          <p><strong>Car:</strong> {booking.carName}</p>
          <p><strong>From:</strong> {booking.pickupLocation}</p>
          <p><strong>To:</strong> {booking.destination}</p>
          <p><strong>Duration:</strong> {booking.totalDays} days</p>
          <p><strong>Total Amount:</strong> ₹{booking.totalRent}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '15px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              How would you rate this car?
            </label>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: '10px', 
              marginBottom: '10px' 
            }}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: '40px',
                    cursor: 'pointer',
                    color: star <= rating ? '#ffd700' : '#ddd',
                    transition: 'color 0.2s'
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <p style={{ 
              textAlign: 'center', 
              color: '#7f8c8d',
              fontSize: '16px',
              margin: '10px 0'
            }}>
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Share your feedback:
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience with this car..."
              rows="6"
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: loading ? '#95a5a6' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}