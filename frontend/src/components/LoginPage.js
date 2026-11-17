import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    location: '',
    image: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!formData.email || !formData.password || !formData.mobile || !formData.location) {
        setError('Please fill in all fields');
        return;
      }
      
      if (formData.email === 'admin@carrental.com' && formData.password === 'admin123') {
        onLogin('admin', null);
      } else {
        const userProfile = {
          name: formData.name || formData.email.split('@')[0],
          email: formData.email,
          mobile: formData.mobile,
          location: formData.location,
          image: 'https://via.placeholder.com/150/007bff/ffffff?text=User'
        };
        onLogin('user', userProfile);
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.mobile || !formData.location) {
        setError('Please fill in all fields');
        return;
      }
      
      const userProfile = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        location: formData.location,
        image: formData.image || 'https://via.placeholder.com/150/007bff/ffffff?text=User'
      };
      onLogin('user', userProfile);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="login-header">
          <h2>👤 {isLogin ? 'Login' : 'Sign Up'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>📧 Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <label>📱 Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
            />
          </div>
          
          <div className="form-group">
            <label>📍 Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label>🖼️ Profile Image URL (Optional)</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>
          )}

          <button type="submit" className="login-btn">
            🔑 {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="login-footer">
          <p onClick={() => setIsLogin(!isLogin)} className="toggle-mode">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </p>
          {isLogin && <small>Admin: admin@carrental.com / admin123</small>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;