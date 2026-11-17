import React, { useState } from "react";
import axios from "axios";

export default function ReviewForm({ booking, onClose, onReviewSubmit }) {
  const [formData, setFormData] = useState({
    rating: 5,
    review: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewData = {
        carName: booking.carName,
        customerName: booking.passengerName,
        rating: formData.rating,
        review: formData.review,
        bookingId: booking._id
      };

      await axios.post("http://localhost:8000/api/reviews", reviewData);
      alert("✅ Review submitted successfully!");
      onReviewSubmit();
      onClose();
    } catch (error) {
      alert("❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '500px',
        maxWidth: '90%'
      }}>
        <h3>⭐ Rate & Review {booking.carName}</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Rating:</label>
            <div style={{ display: 'flex', gap: '5px', margin: '10px 0' }}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  onClick={() => setFormData({...formData, rating: star})}
                  style={{
                    fontSize: '30px',
                    cursor: 'pointer',
                    color: star <= formData.rating ? '#ffd700' : '#ddd'
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Review:</label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData({...formData, review: e.target.value})}
              placeholder="Share your experience with this car..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                marginTop: '5px'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#27ae60',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}