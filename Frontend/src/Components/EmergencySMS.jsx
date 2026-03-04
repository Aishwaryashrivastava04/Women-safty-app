import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function EmergencySMS() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(() => JSON.parse(localStorage.getItem('emergencyContacts')) || []);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('sms');
  const [sendingAll, setSendingAll] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [statusMessage, setStatusMessage] = useState("");
  const [retryAttempted, setRetryAttempted] = useState(false);
  const [eventLog, setEventLog] = useState(() => JSON.parse(localStorage.getItem('emergencyEventLog')) || []);
  const [priorityContact, setPriorityContact] = useState(() => JSON.parse(localStorage.getItem('priorityContact')) || null);

  // Default family contacts (Mom & Dad)
  const defaultFamilyContacts = [
    { name: "Mom", phone: "9934811845" },
    { name: "Dad", phone: "6202440330" }
  ];
  const alertAudioRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (err) => {
        console.error("Location error:", err);
        setLocationError(true);
        setLoading(false);
      }
    );
  }, []);

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  // Normalize phone number for SMS / WhatsApp
  const normalizePhone = (phone) => {
    if (!phone) return "";
    return phone.toString().replace(/[^0-9]/g, "");
  };

  const performAction = () => {
    if (!selectedContact || !position) return;

    const { lat, lng } = position;
    const message = `🚨 I need help! My location: https://maps.google.com/?q=${lat},${lng}`;
    const phone = normalizePhone(selectedContact.phone);

    const logEntry = {
      time: new Date().toLocaleString(),
      contact: selectedContact.name,
      type: actionType
    };
    const updatedLog = [logEntry, ...eventLog.slice(0,9)];
    setEventLog(updatedLog);
    localStorage.setItem('emergencyEventLog', JSON.stringify(updatedLog));

    try {
      if (actionType === 'sms') {
        window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
      }

      if (actionType === 'call') {
        window.location.href = `tel:${phone}`;
      }

      if (actionType === 'whatsapp') {
        const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.location.href = whatsappURL;
      }
    } catch (err) {
      console.error("Emergency action failed:", err);
    }

    setShowModal(false);
  };

  const sendToAllContacts = () => {
    if (!position || contacts.length === 0) return;

    const { lat, lng } = position;
    const message = `🚨 EMERGENCY! I need help! My location: https://maps.google.com/?q=${lat},${lng}`;

    // Ensure Mom & Dad are prioritized first
    const orderedContacts = [
      ...defaultFamilyContacts,
      ...contacts.filter(c => c.phone !== "9934811845" && c.phone !== "6202440330")
    ];

    orderedContacts.forEach((contact, index) => {
      const phone = normalizePhone(contact.phone);

      setTimeout(() => {
        window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
      }, index * 1500);
    });

    setStatusMessage("✅ Emergency message triggered for all contacts");

    // Retry once after 10 seconds if needed
    if (!retryAttempted) {
      setRetryAttempted(true);

      setTimeout(() => {
        orderedContacts.forEach((contact, index) => {
          const phone = normalizePhone(contact.phone);

          setTimeout(() => {
            window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
          }, index * 1500);
        });

        setStatusMessage("📡 Retrying emergency message...");
      }, 10000);
    }

    setSendingAll(false);
  };

  useEffect(() => {
    if (!sendingAll) return;

    if (alertAudioRef.current) {
      alertAudioRef.current.currentTime = 0;
      alertAudioRef.current.play().catch(() => {});
    }

    if (countdown === 0) {
      sendToAllContacts();
      setCountdown(5);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sendingAll, countdown]);

  useEffect(() => {
    if (!statusMessage) return;

    const timer = setTimeout(() => {
      setStatusMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)", padding: "20px", fontFamily: "'Inter', system-ui" }}>
      <div style={{ background: "linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)", color: "white", padding: "30px 20px", borderRadius: "24px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(91, 46, 255, 0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>📩 Emergency Communication</h2>
          <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "10px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {loading && (
          <div style={{ background: "white", padding: "24px", borderRadius: "16px", textAlign: "center", color: "#6B7280", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "18px", marginBottom: "8px" }}>📍 Fetching Live Location</div>
            <div style={{ fontSize: "13px" }}>Please allow location permission</div>
          </div>
        )}

        {locationError && (
          <div style={{ background: "#FEE2E2", padding: "16px", borderRadius: "16px", textAlign: "center", color: "#B91C1C", fontWeight: "600" }}>
            ⚠️ Location access denied. Please enable GPS permission.
          </div>
        )}

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

        {contacts.length > 0 && position && (
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <button
              onClick={() => setSendingAll(true)}
              style={{
                background: "linear-gradient(135deg, #E11D48, #BE123C)",
                color: "white",
                padding: "16px 32px",
                border: "none",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(225, 29, 72, 0.4)",
                letterSpacing: "1px"
              }}
            >
              🚨 SEND TO ALL CONTACTS
            </button>
          </div>
        )}

        {sendingAll && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(220,38,38,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            color: "white",
            flexDirection: "column"
          }}>
            <h1 style={{ fontSize: "60px", margin: 0 }}>{countdown}</h1>
            <p style={{ marginTop: "10px", fontSize: "18px" }}>🚨 Sending emergency alerts to all contacts...</p>
            <button
              onClick={() => { setSendingAll(false); setCountdown(5); }}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#E5E7EB",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {statusMessage && (
          <div style={{
            marginTop: "20px",
            background: "#D1FAE5",
            padding: "14px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#065F46",
            fontWeight: "600"
          }}>
            {statusMessage}
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
              {position && (
                <>
                <div style={{ background: "#EFF2FF", padding: "12px", borderRadius: "10px", fontSize: "12px", color: "#6B7280", marginBottom: "10px" }}>
                📍 Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </div>
                <iframe
                  title="map-preview"
                  width="100%"
                  height="180"
                  style={{border:0, borderRadius:'10px', marginBottom:'20px'}}
                  src={`https://www.google.com/maps?q=${position.lat},${position.lng}&z=15&output=embed`}
                />
                </>
              )}
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", background: "#E5E7EB", color: "#111827", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                <button
                  onClick={performAction}
                  disabled={!position}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: position ? "linear-gradient(135deg, #5B2EFF, #7C5CFF)" : "#D1D5DB",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    cursor: position ? "pointer" : "not-allowed"
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{marginTop:'40px', background:'white', padding:'20px', borderRadius:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
      <h3 style={{marginTop:0}}>📊 Emergency Event Log</h3>
      {eventLog.length === 0 ? (
      <p style={{fontSize:'13px', color:'#6B7280'}}>No emergency events yet</p>
      ) : (
       eventLog.map((e,i)=> (
        <div key={i} style={{fontSize:'12px', marginBottom:'6px'}}>
         {e.time} — {e.contact} ({e.type})
        </div>
       ))
      )}
      </div>
      <audio
        ref={alertAudioRef}
        src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
        preload="auto"
      />
    </div>
  );
}

export default EmergencySMS;