import React, { useState } from 'react';

export default function AnimatedLogin({ onLogin, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
      alert("Please fill all fields");
      return;
    }
    if (formData.phoneNumber.length !== 10) {
      alert("❌ Phone number must be exactly 10 digits!");
      return;
    }
    // Pass complete customer data to onLogin
    const customerData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password
    };
    console.log("🔐 Customer logging in:", customerData);
    onLogin(customerData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      margin: 0
    }}>
      <div style={{
        background: '#ffffff',
        border: '2px solid #ffffff',
        padding: '40px',
        width: '360px',
        borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
        animation: 'slideIn 1.1s ease',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: '#333',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >✕</button>
        
        <h2 style={{
          textAlign: 'center',
          marginBottom: '25px',
          color: '#333',
          animation: 'fadeIn 1.4s ease'
        }}>🚗 GO RENT RIDE - Customer Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{
            marginBottom: '20px',
            animation: 'fadeInUp 1.5s ease'
          }}>
            <label style={{
              color: '#333',
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold'
            }}>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                outline: 'none'
              }}
              required 
            />
          </div>

          <div style={{
            marginBottom: '20px',
            animation: 'fadeInUp 1.5s ease'
          }}>
            <label style={{
              color: '#333',
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold'
            }}>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                outline: 'none'
              }}
              required 
            />
          </div>

          <div style={{
            marginBottom: '20px',
            animation: 'fadeInUp 1.5s ease'
          }}>
            <label style={{
              color: '#333',
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold'
            }}>Phone Number (10 digits only)</label>
            <input 
              type="tel" 
              placeholder="Enter exactly 10 digits" 
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 10) {
                  setFormData({...formData, phoneNumber: value});
                }
              }}
              maxLength="10"
              minLength="10"
              style={{
                width: '100%',
                padding: '12px',
                border: formData.phoneNumber && formData.phoneNumber.length !== 10 ? '2px solid #e74c3c' : '1px solid #ddd',
                borderRadius: '8px',
                outline: 'none'
              }}
              required 
            />
            {formData.phoneNumber && formData.phoneNumber.length !== 10 && (
              <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '5px', fontWeight: 'bold' }}>
                ⚠️ Phone number must be exactly 10 digits
              </div>
            )}
          </div>
          
          <div style={{
            marginBottom: '20px',
            animation: 'fadeInUp 1.5s ease'
          }}>
            <label style={{
              color: '#333',
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold'
            }}>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                outline: 'none'
              }}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '12px',
              background: '#27ae60',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              marginTop: '10px',
              cursor: 'pointer',
              transition: '0.3s ease',
              fontSize: '16px'
            }}
          >Login</button>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateY(-60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}