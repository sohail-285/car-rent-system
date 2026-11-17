import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onClose, onLogout }) => {
  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="profile-header">
          <div className="profile-image">
            <img src={user.image} alt="Profile" />
          </div>
          <h2>👤 User Profile</h2>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="label">📝 Name:</span>
            <span className="value">{user.name}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">📧 Email:</span>
            <span className="value">{user.email}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">📱 Mobile:</span>
            <span className="value">{user.mobile}</span>
          </div>
          
          <div className="detail-item">
            <span className="label">📍 Location:</span>
            <span className="value">{user.location}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;