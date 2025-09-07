import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaHospital, FaSchool, FaStore, FaWarehouse, FaHome } from 'react-icons/fa';
import './BuildingSelection.css';

function BuildingSelection({ userData, setUserData }) {
  const navigate = useNavigate();
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const buildings = [
    { id: 1, name: 'Main Office', icon: FaBuilding, price: 50, color: '#4CAF50' },
    { id: 2, name: 'Medical Center', icon: FaHospital, price: 75, color: '#2196F3' },
    { id: 3, name: 'Education Wing', icon: FaSchool, price: 40, color: '#FF9800' },
    { id: 4, name: 'Shopping Complex', icon: FaStore, price: 30, color: '#9C27B0' },
    { id: 5, name: 'Storage Facility', icon: FaWarehouse, price: 25, color: '#795548' },
    { id: 6, name: 'Residential Area', icon: FaHome, price: 60, color: '#E91E63' }
  ];

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
  };

  const proceedToPayment = () => {
    if (selectedBuilding) {
      setUserData({
        ...userData,
        selectedBuilding: selectedBuilding,
        ticketPrice: selectedBuilding.price
      });
      navigate('/payment');
    }
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = () => {
    const date = new Date();
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="building-selection fade-in">
      <div className="selection-container">
        <div className="ticket-preview">
          <div className="ticket">
            <div className="ticket-header">
              <h2>Access Ticket</h2>
              <div className="ticket-date">{formatDate()}</div>
            </div>
            
            <div className="ticket-body">
              {userData.capturedImage && (
                <div className="ticket-photo">
                  <img src={userData.capturedImage} alt="Visitor" />
                </div>
              )}
              
              <div className="ticket-info">
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{userData.name || 'Guest'}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Time:</span>
                  <span className="value">{formatTime()}</span>
                </div>
                
                <div className="info-row">
                  <span className="label">Building:</span>
                  <span className="value">
                    {selectedBuilding ? selectedBuilding.name : 'Not Selected'}
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="label">Access Fee:</span>
                  <span className="value price">
                    ${selectedBuilding ? selectedBuilding.price : '0'}.00
                  </span>
                </div>
              </div>
              
              <div className="ticket-barcode">
                <div className="barcode"></div>
                <div className="barcode-number">TKT-{Date.now().toString().slice(-8)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="buildings-section">
          <h1 className="section-title">Select Building to Access</h1>
          <p className="section-subtitle">Choose your destination and view access fee</p>
          
          <div className="buildings-grid">
            {buildings.map((building) => {
              const Icon = building.icon;
              return (
                <div
                  key={building.id}
                  className={`building-card ${selectedBuilding?.id === building.id ? 'selected' : ''}`}
                  onClick={() => handleBuildingSelect(building)}
                  style={{ '--building-color': building.color }}
                >
                  <Icon className="building-icon" />
                  <h3>{building.name}</h3>
                  <div className="building-price">${building.price}.00</div>
                </div>
              );
            })}
          </div>
          
          <button
            className="payment-button"
            onClick={proceedToPayment}
            disabled={!selectedBuilding}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuildingSelection;
