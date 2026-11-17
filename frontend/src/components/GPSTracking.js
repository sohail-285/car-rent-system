import React, { useState, useEffect } from "react";
import axios from "axios";
import GPSSimulator from "./GPSSimulator";
import "./GPSTracking.css";

export default function GPSTracking({ cars = [] }) {
  const [trackingData, setTrackingData] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    if (cars.length > 0) {
      const mockTrackingData = cars.map((car, index) => ({
        ...car,
        gpsTracking: {
          isEnabled: true,
          currentLocation: {
            latitude: [12.9716, 19.0760, 28.7041, 13.0827, 18.5204][index % 5],
            longitude: [77.5946, 72.8777, 77.1025, 80.2707, 73.8567][index % 5],
            address: ["Bangalore, Karnataka", "Mumbai, Maharashtra", "Delhi", "Chennai, Tamil Nadu", "Pune, Maharashtra"][index % 5],
            lastUpdated: new Date()
          },
          speed: Math.floor(Math.random() * 80),
          fuelLevel: Math.floor(Math.random() * 100),
          alerts: []
        }
      }));
      setTrackingData(mockTrackingData);
    }
  }, [cars]);

  const fetchTrackingData = async () => {
    // Mock function for compatibility
  };

  const toggleTracking = async (carId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/gps/cars/${carId}/tracking`, {
        enabled: !currentStatus
      });
      fetchTrackingData();
    } catch (error) {
      console.error("Error toggling tracking:", error);
    }
  };

  const resolveAlert = async (carId, alertId) => {
    try {
      await axios.patch(`http://localhost:8000/api/gps/cars/${carId}/alerts/${alertId}`);
      fetchTrackingData();
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const getSpeedStatus = (speed) => {
    if (speed > 80) return "danger";
    if (speed > 60) return "warning";
    return "normal";
  };

  const getFuelStatus = (fuel) => {
    if (fuel < 20) return "danger";
    if (fuel < 40) return "warning";
    return "normal";
  };

  return (
    <div className="gps-tracking">
      <h2>GPS TRACKING ({trackingData.length} cars)</h2>
      
      <GPSSimulator />
      
      <div className="tracking-grid">
        {trackingData.map(car => {
          const gpsData = car.gpsTracking || {};
          const isEnabled = gpsData.isEnabled || false;
          
          return (
          <div key={car._id} className="tracking-card">
            <div className="car-header">
              <h3>{car.carName}</h3>
              <span className="model">{car.carModel}</span>
              <button 
                onClick={() => toggleTracking(car._id, isEnabled)}
                className={`tracking-toggle ${isEnabled ? 'enabled' : 'disabled'}`}
              >
                {isEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {isEnabled && (
              <>
                <div className="location-info">
                  <h4>📍 Current Location</h4>
                  {gpsData.currentLocation ? (
                    <div>
                      <p>{gpsData.currentLocation.address || 'Address not available'}</p>
                      <small>
                        Lat: {gpsData.currentLocation.latitude?.toFixed(6)}, 
                        Lng: {gpsData.currentLocation.longitude?.toFixed(6)}
                      </small>
                      <p className="last-updated">
                        Last updated: {new Date(gpsData.currentLocation.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <p>No location data available</p>
                  )}
                </div>

                <div className="vehicle-stats">
                  <div className={`stat speed ${getSpeedStatus(gpsData.speed || 0)}`}>
                    <span className="label">Speed</span>
                    <span className="value">{gpsData.speed || 0} km/h</span>
                  </div>
                  <div className={`stat fuel ${getFuelStatus(gpsData.fuelLevel || 100)}`}>
                    <span className="label">Fuel</span>
                    <span className="value">{gpsData.fuelLevel || 100}%</span>
                  </div>
                </div>

                {gpsData.alerts && gpsData.alerts.length > 0 && (
                  <div className="alerts">
                    <h4>🚨 Alerts</h4>
                    {gpsData.alerts
                      .filter(alert => !alert.resolved)
                      .map(alert => (
                        <div key={alert._id} className={`alert ${alert.type}`}>
                          <span>{alert.message}</span>
                          <button 
                            onClick={() => resolveAlert(car._id, alert._id)}
                            className="resolve-btn"
                          >
                            Resolve
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
          );
        })}
      </div>

      {trackingData.length === 0 && (
        <div className="no-data">
          <p>No cars available for GPS tracking</p>
        </div>
      )}
    </div>
  );
}