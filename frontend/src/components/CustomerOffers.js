import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CustomerOffers({ customerEmail, onOfferSelect }) {
  const [offers, setOffers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerEmail) {
      fetchOffers();
    }
  }, [customerEmail]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/loyalty/offers/${encodeURIComponent(customerEmail)}`);
      setOffers(response.data.offers);
      setCustomer(response.data.customer);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading offers...</div>;

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      margin: '20px 0'
    }}>
      <h3>🎁 Your Exclusive Offers</h3>
      
      {customer && (
        <div style={{
          background: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <h4>👤 Customer Status</h4>
          <p>Category: <strong>{customer.customerCategory.toUpperCase()}</strong></p>
          <p>Total Bookings: <strong>{customer.totalBookings}</strong></p>
          <p>Loyalty Points: <strong>{customer.loyaltyPoints}</strong></p>
        </div>
      )}

      {offers.length > 0 ? (
        <div>
          <h4>Available Offers:</h4>
          {offers.map((offer, index) => (
            <div key={index} style={{
              background: '#fff',
              border: '2px solid #4caf50',
              borderRadius: '8px',
              padding: '15px',
              margin: '10px 0',
              cursor: 'pointer'
            }} onClick={() => onOfferSelect && onOfferSelect(offer)}>
              <h5 style={{ color: '#4caf50', margin: '0 0 5px 0' }}>
                {offer.title} - {offer.discount}% OFF
              </h5>
              <p style={{ margin: '5px 0', color: '#666' }}>{offer.description}</p>
              <small style={{ color: '#888' }}>Condition: {offer.condition}</small>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <p>🌟 Keep booking with us to unlock exclusive offers!</p>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>5+ bookings → 10% Loyalty Discount</li>
            <li>100+ points → 15% Points Reward</li>
            <li>Premium member → 20% Special Discount</li>
          </ul>
        </div>
      )}
    </div>
  );
}