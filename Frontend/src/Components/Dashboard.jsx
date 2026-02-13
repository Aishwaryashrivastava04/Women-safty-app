import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sirenSound from '../assets/siren.mp3';
import './Dashboard.css'; // For fade-in animation

function Dashboard({ onLogout = () => {} }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [locationHistory, setLocationHistory] = useState([]);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const address = data.display_name || 'Unknown location';

          setLocationHistory((prev) => [
            {
              latitude,
              longitude,
              address,
              timestamp: new Date().toLocaleTimeString(),
              link: locationLink,
            },
            ...prev.slice(0, 4),
          ]);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSendSMS = () => {
    setIsSendingSOS(true);
    const storedContacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];
    const phoneNumbers = storedContacts.map((c) => c.phone).filter(Boolean);

    if (phoneNumbers.length === 0) {
      alert('No emergency contacts found.');
      setIsSendingSOS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const message = encodeURIComponent(
          `⚠️ I need help! My location: https://www.google.com/maps?q=${latitude},${longitude}`
        );
        const smsLink = `sms:${phoneNumbers.join(',')}?body=${message}`;
        window.location.href = smsLink;
        setIsSendingSOS(false);
      },
      () => {
        alert('Unable to fetch location.');
        setIsSendingSOS(false);
      }
    );
  };

  const toggleAlarm = () => {
    if (!audioRef.current) return;
    if (isAlarmPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play();
    }
    setIsAlarmPlaying(!isAlarmPlaying);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 dashboard-theme p-0">
      <audio ref={audioRef} src={sirenSound} loop />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <span className="navbar-brand fw-bold text-primary">🛡️ Women Safety App</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => navigate('/')}>Home</button></li>
            <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => navigate('/profile')}>Profile</button></li>
            <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => navigate('/setting')}>Settings</button></li>
            <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => navigate('/about')}>About</button></li>
            <li className="nav-item"><button className="btn btn-outline-danger rounded-pill ms-2" onClick={onLogout}>Logout</button></li>
          </ul>
        </div>
      </nav>

      {/* Welcome + Top Buttons */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-secondary">👋 Welcome, {userName}</h3>
          <div>
            <button className="btn btn-outline-primary rounded-pill me-2" onClick={() => navigate('/contacts')}>📇 Contacts</button>
            <button className="btn btn-outline-success rounded-pill" onClick={() => navigate('/feedback')}>📝 Feedback</button>
          </div>
        </div>

        {/* Features */}
        <div className="row g-4 fade-in-up">
          <FeatureCard icon={isSendingSOS ? <div className="spinner-border text-danger" /> : '🚨'} title="SOS Alert" desc="Send emergency alerts instantly" onClick={() => navigate('/sos')} />
          <FeatureCard icon="📩" title="Emergency SMS" desc="Send GPS-based help messages" onClick={() => navigate('/emergencysms')} />
          <FeatureCard icon="📞" title="Helpline" desc="Quick dial national helplines" onClick={() => navigate('/helpline')} />
          <FeatureCard icon="📍" title="Track Me" desc="Share live location with contacts" onClick={() => navigate('/trackme')} />
          <FeatureCard icon="🔊" title={isAlarmPlaying ? 'Stop Alarm' : 'Sound Alarm'} desc={isAlarmPlaying ? 'Tap to stop siren' : 'Play loud siren for attention'} onClick={toggleAlarm} isHighlighted={isAlarmPlaying} />
          <FeatureCard icon="👮‍♀️" title="Nearby Police" desc="Find stations near your location" onClick={() => navigate('/nearby-police')} />
          <FeatureCard icon="📲" title="Quick Call" desc="Call & share location instantly" onClick={() => navigate('/quickcall')} />
          <FeatureCard icon="📝" title="Safety Tips" desc="View essential safety guidelines" onClick={() => navigate('/safetytips')} />
        </div>

        {/* Location History */}
        <div className="mt-5">
          <h4 className="fw-bold text-primary mb-3">📌 Location History</h4>
          <ul className="list-group">
            {locationHistory.length > 0 ? locationHistory.map((loc, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded">
                <div>
                  <strong>{loc.timestamp}</strong><br />
                  <small>{loc.address}</small>
                </div>
                <a href={loc.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary rounded-pill">View</a>
              </li>
            )) : (
              <li className="list-group-item">No locations recorded yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, desc, onClick, isHighlighted }) => (
  <div className="col-md-3 col-sm-6">
    <div className={`card h-100 border-0 shadow rounded-4 text-center p-3 ${isHighlighted ? 'bg-danger text-white' : 'bg-white'} feature-card`} onClick={onClick} role="button">
      <div className="display-4 mb-2">{icon}</div>
      <h5 className="fw-bold">{title}</h5>
      <p className="small text-muted">{desc}</p>
    </div>
  </div>
);

export default Dashboard;