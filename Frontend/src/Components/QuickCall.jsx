import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function QuickCall() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modal, setModal] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [countdown, setCountdown] = useState(5);


  /* 📍 Get Location */
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLocation({ latitude, longitude, accuracy });
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation();
    const saved = localStorage.getItem('emergencyContacts');
    setContacts(saved ? JSON.parse(saved) : []);
  }, []);

  /* 📍 Auto refresh location every 5s in emergency */
  useEffect(() => {
    if (!emergencyMode) return;
    const interval = setInterval(() => {
      getLocation();
    }, 5000);
    return () => clearInterval(interval);
  }, [emergencyMode]);

  /* 🚨 Countdown + SMS + Call + Voice */
  useEffect(() => {
    if (!emergencyMode) return;

    if (countdown > 0) {
      const utter = new SpeechSynthesisUtterance(`Emergency call in ${countdown}`);
      utter.rate = 1;
      speechSynthesis.speak(utter);
    }

    if (countdown === 0) {
      sendSMSAll();
      window.open('tel:112');
      stopEmergency();
      return;
    }

    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [emergencyMode, countdown]);

  const stopEmergency = () => {
    setEmergencyMode(false);
    setCountdown(5);
  };

  /* 📡 Auto SMS to all contacts */
  const sendSMSAll = () => {
    if (!location) return;
    const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;

    contacts.forEach((c, index) => {
      setTimeout(() => {
        window.open(`sms:${c.phone}?body=${encodeURIComponent(`🚨 EMERGENCY! My location: ${mapsLink}`)}`);
      }, index * 1500);
    });
  };

  const shareLocation = (phone, type) => {
    if (!location) return;
    const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    if (type === 'call') window.open(`tel:${phone}`);
    else if (type === 'sms') window.open(`sms:${phone}?body=${encodeURIComponent(`🚨 I need help! My location: ${mapsLink}`)}`);
    else if (type === 'whatsapp') window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`🚨 Emergency! I'm at: ${mapsLink}`)}`);
    setModal(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: emergencyMode
          ? 'linear-gradient(135deg,#7f1d1d,#dc2626)'
          : 'linear-gradient(180deg,#F8FAFF 0%,#EFF2FF 50%)',
        padding: '20px 0',
        fontFamily: 'Inter, system-ui',
        transition: 'all 0.5s ease'
      }}
    >


      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>

        {/* HEADER */}
        <div
          style={{
            background: emergencyMode
              ? 'rgba(255,255,255,0.15)'
              : 'linear-gradient(135deg,#5B2EFF,#7C5CFF)',
            color: 'white',
            padding: '24px',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700 }}>
            📲 Smart Quick Emergency
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            marginTop: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>📍 Getting location...</div>
          ) : location ? (
            <>
              <h4>📍 Live Location</h4>
              <p>Lat: {location.latitude.toFixed(5)}</p>
              <p>Lng: {location.longitude.toFixed(5)}</p>
              <p>Accuracy: ±{Math.round(location.accuracy)}m</p>
              <p>Updated: {lastUpdated}</p>

              {/* 🛰️ Live Google Map Embed */}
              <div style={{ margin: '20px 0' }}>
                <iframe
                  width="100%"
                  height="250"
                  style={{ borderRadius: 12 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                ></iframe>
              </div>

              <button
                onClick={() => setEmergencyMode(true)}
                style={{
                  padding: 14,
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  width: '100%'
                }}
              >
                🚨 Emergency Call (Auto in {emergencyMode ? countdown : 5}s)
              </button>

              {emergencyMode && (
                <button
                  onClick={stopEmergency}
                  style={{
                    marginTop: 10,
                    padding: 10,
                    background: '#111827',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    width: '100%'
                  }}
                >
                  🛑 Cancel Emergency
                </button>
              )}

              {/* CONTACTS */}
              {contacts.length > 0 && (
                <div style={{ marginTop: 30 }}>
                  <h4>👥 Emergency Contacts</h4>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {contacts.map((contact, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setSelectedContact(contact); setModal(true); }}
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          background: '#EEF2FF',
                          cursor: 'pointer'
                        }}
                      >
                        {contact.name} ({contact.phone})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modal && (
                <div
                  onClick={() => setModal(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: 'white',
                      padding: 25,
                      borderRadius: 15
                    }}
                  >
                    <h4>Contact {selectedContact?.name}</h4>
                    <button onClick={() => shareLocation(selectedContact?.phone, 'call')}>📞 Call</button>
                    <button onClick={() => shareLocation(selectedContact?.phone, 'sms')}>💬 SMS</button>
                    <button onClick={() => shareLocation(selectedContact?.phone, 'whatsapp')}>💚 WhatsApp</button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default QuickCall;