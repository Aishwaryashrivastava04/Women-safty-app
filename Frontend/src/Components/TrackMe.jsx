import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TrackMe() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState(() => JSON.parse(localStorage.getItem("trackingHistory")) || []);
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("");

  const updateLocation = () => {
    setStatus("📍 Getting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const time = new Date().toLocaleTimeString();
        const newLoc = { lat: latitude, lng: longitude, accuracy, time };
        setLocation(newLoc);
        const updated = [...locationHistory, newLoc].slice(-20);
        setLocationHistory(updated);
        localStorage.setItem("trackingHistory", JSON.stringify(updated));
        setStatus("✅ Location updated");
        setTimeout(() => setStatus(""), 3000);
      },
      () => { setStatus("⚠️ Permission denied"); setTimeout(() => setStatus(""), 3000); },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!tracking) return;
    updateLocation();
    const interval = setInterval(updateLocation, 10000);
    return () => clearInterval(interval);
  }, [tracking]);

  const shareVia = (type) => {
    if (!location) { setStatus("⚠️ Get location first"); return; }
    const link = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    const message = `🚨 My Location: ${link}`;
    if (type === 'sms') {
      const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
      const phones = contacts.map(c => c.phone).join(",");
      if (phones) window.location.href = `sms:${phones}?body=${encodeURIComponent(message)}`;
    } else if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const clearHistory = () => {
    setLocationHistory([]);
    localStorage.removeItem("trackingHistory");
    setStatus("✅ History cleared");
    setTimeout(() => setStatus(""), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)", padding: "20px", fontFamily: "'Inter', system-ui" }}>
      <div style={{ background: "linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)", color: "white", padding: "30px 20px", borderRadius: "24px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(91, 46, 255, 0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>📍 Real-Time Tracker</h2>
          <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "10px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* CURRENT LOCATION */}
        <div style={{ background: "white", padding: "28px", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "24px", border: "1px solid rgba(91,46,255,0.08)" }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700" }}>📌 Current Location</h3>
          {location ? (
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ background: "#EFF2FF", padding: "14px", borderRadius: "12px", fontSize: "13px" }}>
                <div style={{ fontWeight: "600", color: "#5B2EFF", marginBottom: "6px" }}>Latitude: {location.lat.toFixed(6)}</div>
                <div style={{ fontWeight: "600", color: "#5B2EFF" }}>Longitude: {location.lng.toFixed(6)}</div>
                <div style={{ color: "#6B7280", marginTop: "6px", fontSize: "12px" }}>Accuracy: ±{location.accuracy.toFixed(0)}m</div>
              </div>
              <a href={`https://maps.google.com/?q=${location.lat},${location.lng}`} target="_blank" rel="noreferrer" style={{ padding: "10px", background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600", cursor: "pointer" }}>🗺️ View on Google Maps</a>
            </div>
          ) : (
            <div style={{ background: "#FEF3C7", color: "#92400E", padding: "14px", borderRadius: "10px", fontSize: "13px", fontWeight: "500" }}>📍 Click "Get Location" to start tracking</div>
          )}
        </div>

        {/* CONTROLS */}
        <div style={{ background: "white", padding: "20px", borderRadius: "20px", marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid rgba(91,46,255,0.08)" }}>
          <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            <button onClick={updateLocation} style={{ padding: "12px", background: "#E0F2FE", color: "#0084FF", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#BAE6FD"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#E0F2FE"; }}>📡 Get Location</button>
            <button onClick={() => setTracking(!tracking)} style={{ padding: "12px", background: tracking ? "#FEE2E2" : "#DCFCE7", color: tracking ? "#E11D48" : "#10B981", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>{tracking ? "⏹️ Stop Tracking" : "▶️ Start Tracking"}</button>
            <button onClick={() => shareVia('sms')} style={{ padding: "12px", background: "#E0F2FE", color: "#0084FF", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#BAE6FD"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#E0F2FE"; }}>📤 Share SMS</button>
            <button onClick={() => shareVia('whatsapp')} style={{ padding: "12px", background: "#DCFCE7", color: "#10B981", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#BBFBDE"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#DCFCE7"; }}>💬 WhatsApp</button>
          </div>
        </div>

        {/* STATUS */}
        {status && <div style={{ background: "#DCFCE7", color: "#15803D", padding: "12px", borderRadius: "10px", marginBottom: "20px", fontWeight: "500", textAlign: "center" }}>{status}</div>}

        {/* HISTORY */}
        {locationHistory.length > 0 && (
          <div style={{ background: "white", padding: "28px", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid rgba(91,46,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>📋 Tracking History ({locationHistory.length})</h3>
              <button onClick={clearHistory} style={{ padding: "8px 12px", background: "#FEE2E2", color: "#E11D48", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "12px" }}>🗑️ Clear</button>
            </div>
            <div style={{ maxHeight: "300px", overflowY: "auto", display: "grid", gap: "10px" }}>
              {locationHistory.slice().reverse().map((loc, i) => (
                <a key={i} href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" style={{ padding: "12px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "10px", textDecoration: "none", color: "#111827", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF2FF"; e.currentTarget.style.borderColor = "#5B2EFF"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.borderColor = "#E5E7EB"; }}>
                  <span style={{ fontSize: "13px" }}>⏰{loc.time}</span>
                  <span style={{ fontSize: "12px", color: "#5B2EFF", fontWeight: "600" }}>View →</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackMe;