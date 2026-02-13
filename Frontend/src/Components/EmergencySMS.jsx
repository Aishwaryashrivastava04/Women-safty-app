import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmergencySMS() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(() => JSON.parse(localStorage.getItem('emergencyContacts')) || []);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('sms');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const performAction = () => {
    if (!selectedContact || !position) return;
    const { lat, lng } = position;
    const message = `🚨 I need help! My location: https://maps.google.com/?q=${lat},${lng}`;

    if (actionType === 'sms') {
      window.location.href = `sms:${selectedContact.phone}?body=${encodeURIComponent(message)}`;
    } else if (actionType === 'call') {
      window.location.href = `tel:${selectedContact.phone}`;
    } else if (actionType === 'whatsapp') {
      const whatsappURL = `https://wa.me/${selectedContact.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
    }
    setShowModal(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)", padding: "20px", fontFamily: "'Inter', system-ui" }}>
      <div style={{ background: "linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)", color: "white", padding: "30px 20px", borderRadius: "24px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(91, 46, 255, 0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>📩 Emergency Communication</h2>
          <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "10px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {loading && <div style={{ background: "white", padding: "20px", borderRadius: "12px", textAlign: "center", color: "#6B7280" }}>📍 Getting your location...</div>}

        {contacts.length === 0 ? (
          <div style={{ background: "white", padding: "40px", borderRadius: "24px", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: "16px", color: "#6B7280", margin: "0 0 16px 0" }}>👥 No emergency contacts found</p>
            <button onClick={() => navigate("/contacts")} style={{ background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}>+ Add Contacts</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {contacts.map((contact, index) => (
              <div key={index} style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "18px" }}>{getInitials(contact.name)}</div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#111827", fontSize: "15px" }}>{contact.name}</div>
                    <div style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>📱 {contact.phone}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { setSelectedContact(contact); setActionType('sms'); setShowModal(true); }} style={{ padding: "8px 14px", background: "#E0F2FE", color: "#0084FF", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "12px", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#BAE6FD"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#E0F2FE"; }}>📤 SMS</button>
                  <button onClick={() => { setSelectedContact(contact); setActionType('whatsapp'); setShowModal(true); }} style={{ padding: "8px 14px", background: "#DCFCE7", color: "#10B981", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "12px", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#BBFBDE"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#DCFCE7"; }}>💬 WhatsApp</button>
                  <button onClick={() => { setSelectedContact(contact); setActionType('call'); setShowModal(true); }} style={{ padding: "8px 14px", background: "#FEE2E2", color: "#E11D48", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "12px", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#FECACA"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#FEE2E2"; }}>📞 Call</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "white", borderRadius: "20px", padding: "30px", maxWidth: "400px", width: "90%", boxShadow:  "0 20px 60px rgba(0,0,0,0.3)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700" }}>Confirm Action</h3>
              <p style={{ color: "#6B7280", margin: "0 0 24px 0" }}>
                {actionType === 'sms' ? '📤 Send emergency SMS to' : actionType === 'call' ? '📞 Call' : '💬 Send WhatsApp to'} <strong>{selectedContact?.name}</strong>?
              </p>
              {position && <div style={{ background: "#EFF2FF", padding: "12px", borderRadius: "10px", fontSize: "12px", color: "#6B7280", marginBottom: "20px" }}>📍 Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</div>}
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", background: "#E5E7EB", color: "#111827", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                <button onClick={performAction} style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmergencySMS;