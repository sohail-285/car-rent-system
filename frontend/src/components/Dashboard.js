import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/bookings");
      const bookings = response.data;
      
      const totalBookings = bookings.length;
      const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalRent || 0), 0);
      
      setStats({ totalBookings, activeBookings, totalRevenue });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p>{stats.activeBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}