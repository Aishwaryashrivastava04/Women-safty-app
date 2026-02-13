import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuickCall() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modal, setModal] = useState(false);

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLocation({ latitude, longitude, accuracy });
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      },
      () => {
        alert('❌ Location access denied');
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation();
    const saved = localStorage.getItem('emergencyContacts');
    setContacts(saved ? JSON.parse(saved) : []);
  }, []);

  const shareLocation = (phone, type) => {
    if (!location) return;
    const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    if (type === 'call') window.open(`tel:${phone}`);
    else if (type === 'sms') window.open(`sms:${phone}?body=${encodeURIComponent(`🚨 I need help! My location: ${mapsLink}`)}`);
    else if (type === 'whatsapp') window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`🚨 Emergency! I'm at: ${mapsLink}`)}`);
    setModal(false);
  };

  const copyToClipboard = () => {
    const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    navigator.clipboard.writeText(mapsLink);
    alert('✅ Location link copied!');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)',
      padding: '20px 0',
      fontFamily: "'Inter', system-ui, -apple-system"
    },
    wrapper: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 20px'
    },
    header: {
      background: 'linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)',
      color: 'white',
      padding: '24px',
      borderRadius: '20px 20px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    backBtn: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      padding: '32px 28px',
      marginBottom: '20px'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    locationInfo: {
      background: '#F3F4F6',
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '12px',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    },
    btn: {
      padding: '12px 16px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      outline: 'none'
    },
    emergencyBtn: {
      background: 'linear-gradient(135deg, #E11D48, #BE122D)',
      color: 'white'
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)',
      color: 'white'
    },
    secondaryBtn: {
      background: '#E5E7EB',
      color: '#1F2937'
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '16px'
    },
    contactCard: {
      background: 'linear-gradient(135deg, #F8FAFF 0%, #EFF2FF 100%)',
      border: '1px solid #E5E7EB',
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: '700',
      margin: '0 auto 8px'
    },
    name: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '4px'
    },
    phone: {
      fontSize: '12px',
      color: '#6B7280'
    },
    modal: {
      display: modal ? 'flex' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      maxWidth: '380px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: '16px'
    },
    modalText: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '24px'
    },
    modalButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        button:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
        [data-hover]:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(91, 46, 255, 0.2); }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>📲 Quick Call & Share</div>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')} onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'} onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>
            ← Back
          </button>
        </div>

        <div style={styles.card}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📍</div>
              <div style={{ color: '#6B7280' }}>Fetching your location...</div>
            </div>
          ) : location ? (
            <>
              {/* Location Section */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>📍 Your Current Location</div>
                <div style={styles.locationInfo}>
                  <div>🧭 <strong>Latitude:</strong> {location.latitude.toFixed(6)}</div>
                  <div style={{ marginTop: '4px' }}>🧭 <strong>Longitude:</strong> {location.longitude.toFixed(6)}</div>
                  <div style={{ marginTop: '4px' }}>📏 <strong>Accuracy:</strong> ±{Math.round(location.accuracy)}m</div>
                  <div style={{ marginTop: '4px' }}>⏱️ <strong>Last Updated:</strong> {lastUpdated}</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>⚡ Quick Actions</div>
                <div style={styles.grid}>
                  <button style={{ ...styles.btn, ...styles.emergencyBtn }} onClick={() => window.open('tel:112')}>
                    📞 Emergency (112)
                  </button>
                  <button style={{ ...styles.btn, ...styles.primaryBtn }} onClick={getLocation}>
                    🔄 Refresh
                  </button>
                  <button style={{ ...styles.btn, ...styles.secondaryBtn }} onClick={copyToClipboard}>
                    🔗 Copy Link
                  </button>
                </div>
              </div>

              {/* Emergency Contacts */}
              {contacts.length > 0 && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>👥 Emergency Contacts ({contacts.length})</div>
                  <div style={styles.contactGrid}>
                    {contacts.map((contact, idx) => (
                      <div
                        key={idx}
                        style={styles.contactCard}
                        onClick={() => { setSelectedContact(contact); setModal(true); }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <div style={styles.avatar}>{contact.name.charAt(0).toUpperCase()}</div>
                        <div style={styles.name}>{contact.name}</div>
                        <div style={styles.phone}>{contact.phone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal */}
              <div style={styles.modal} onClick={() => setModal(false)}>
                <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.modalTitle}>📲 Contact {selectedContact?.name}</div>
                  <div style={styles.modalText}>How would you like to reach out?</div>
                  <div style={styles.modalButtons}>
                    <button
                      style={{ ...styles.btn, ...styles.emergencyBtn, fontSize: '12px', padding: '10px' }}
                      onClick={() => shareLocation(selectedContact?.phone, 'call')}
                    >
                      📞 Call
                    </button>
                    <button
                      style={{ ...styles.btn, background: '#059669', color: 'white', fontSize: '12px', padding: '10px' }}
                      onClick={() => shareLocation(selectedContact?.phone, 'sms')}
                    >
                      💬 SMS
                    </button>
                    <button
                      style={{ ...styles.btn, background: '#0084FF', color: 'white', fontSize: '12px', padding: '10px' }}
                      onClick={() => shareLocation(selectedContact?.phone, 'whatsapp')}
                    >
                      💚 WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default QuickCall;