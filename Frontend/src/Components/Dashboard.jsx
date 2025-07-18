import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({ onLogout = () => {} }) {
  const navigate = useNavigate();

  const handleSendSMS = () => {
    const storedContacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    const phoneNumbers = storedContacts.map(contact => contact.phone).filter(Boolean);

    if (phoneNumbers.length === 0) {
      alert("No emergency phone numbers found. Please add contacts first.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = encodeURIComponent(`⚠️ I need help! Here's my location: ${locationLink}`);

        const smsLink = `sms:${phoneNumbers.join(',')}?body=${message}`;
        window.location.href = smsLink;
      },
      () => {
        alert("Unable to retrieve your location.");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark text-white rounded">
        <h3 className="mb-0">🔐 <strong>WOMEN SAFETY</strong></h3>
        <div className="d-flex align-items-center gap-2">
          <span className="fs-5">👤 Welcome, User</span>
          <button className="btn btn-outline-light btn-sm" onClick={onLogout}>🔙 Back to Login</button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Your Safety Hub</h2>
        <p className="text-muted">Access all safety features from one place</p>
      </div>

      {/* Feature Cards */}
      <div className="row text-center g-4 mb-5">
        <div className="col-md-3">
          <div className="card h-100 shadow" onClick={() => navigate('/sos')} role="button">
            <div className="card-body">
              <div className="fs-1">🚨</div>
              <h5 className="card-title mt-2">SOS Alert</h5>
              <p className="card-text">Send emergency alerts instantly</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow" onClick={handleSendSMS} role="button">
            <div className="card-body">
              <div className="fs-1">📩</div>
              <h5 className="card-title mt-2">Emergency SMS</h5>
              <p className="card-text">Send GPS-based help messages</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow" onClick={() => navigate('/helpline')} role="button">
            <div className="card-body">
              <div className="fs-1">📞</div>
              <h5 className="card-title mt-2">Helpline</h5>
              <p className="card-text">Quick dial national helplines</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow" onClick={() => navigate('/trackme')} role="button">
            <div className="card-body">
              <div className="fs-1">📍</div>
              <h5 className="card-title mt-2">Track Me</h5>
              <p className="card-text">Share live location with contacts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-center gap-4 mb-5">
        <button className="btn btn-outline-primary" onClick={() => navigate('/contacts')}>
          📇 Manage Emergency Contacts
        </button>
        <button className="btn btn-outline-success" onClick={() => navigate('/feedback')}>
          📝 Give Feedback
        </button>
      </div>

      {/* Key Features */}
      <div className="bg-white p-4 rounded shadow">
        <h4>🔒 Key Features</h4>
        <ul className="list-group list-group-flush mt-3">
          <li className="list-group-item">🔴 SOS Alert System</li>
          <li className="list-group-item">📩 Emergency SMS with GPS</li>
          <li className="list-group-item">📞 National & Local Helpline Access</li>
          <li className="list-group-item">📍 Real-Time Location Tracking</li>
          <li className="list-group-item">📊 Location History (Coming Soon)</li>
          <li className="list-group-item">🛡️ Campus Security Connect</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;