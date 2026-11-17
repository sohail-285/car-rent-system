import React, { useState } from "react";
import "./CustomerLogin.css";

export default function CustomerLogin({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phoneNumber && formData.email) {
      localStorage.setItem("customerData", JSON.stringify(formData));
      onLogin(formData);
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🚗 CAR RENTAL</h1>
        <p>Welcome! Please enter your details to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'a') {
                  e.stopPropagation();
                }
              }}
            />
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'a') {
                  e.stopPropagation();
                }
              }}
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'a') {
                  e.stopPropagation();
                }
              }}
            />
          </div>
          
          <button type="submit" className="login-btn">
            Continue to Car Selection
          </button>
        </form>
      </div>
    </div>
  );
}