import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import sirenSound from "../assets/siren.mp3";

function SOS() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [status, setStatus] = useState("");
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts");
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  const startSOS = () => {
    if (contacts.length === 0) {
      setStatus("⚠️ No emergency contacts found!");
      return;
    }
    setTimeLeft(10);
    setIsCounting(true);
    setStatus("⏳ SOS Activating...");
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };

  const stopSOS = () => {
    setIsCounting(false);
    setTimeLeft(0);
    setStatus("🚫 SOS Canceled");
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  };

  const sendSOS = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;

    const message = `🚨 EMERGENCY! I need help immediately! Location: https://maps.google.com/?q=${latitude},${longitude}`;

    const numbers = contacts.map((c) => c.phone).join(",");

    window.location.href = `sms:${numbers}?body=${encodeURIComponent(message)}`;

    setStatus("✅ SOS Alerts Sent!");
    setIsCounting(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  });
};

  useEffect(() => {
    if (isCounting && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isCounting && timeLeft === 0) {
      sendSOS();
    }
  }, [timeLeft, isCounting]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)", padding: "20px", fontFamily: "'Inter', system-ui" }}>
      <audio ref={audioRef} src={sirenSound} loop />
      
      <div style={{ background: isCounting ? "linear-gradient(135deg, #BE122D, #E11D48)" : "linear-gradient(135deg, #E11D48, #BE122D)", color: "white", padding: "30px 20px", borderRadius: "24px", marginBottom: "30px", boxShadow: isCounting ? "0 0 50px rgba(225, 29, 72, 0.6)" : "0 10px 30px rgba(225, 29, 72, 0.2)", animation: isCounting ? "pulse 1.5s infinite" : "none" }}>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }`}</style>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800", animation: isCounting ? "blink 1s infinite" : "none" }}>🚨 Emergency SOS</h2>
          <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "10px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* COUNTDOWN */}
        {isCounting && (
          <div style={{ background: "white", padding: "40px", borderRadius: "24px", textAlign: "center", marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "72px", fontWeight: "800", color: "#E11D48", animation: "scale 1s infinite" }}>
              {timeLeft}
            </div>
            <div style={{ fontSize: "18px", color: "#6B7280", marginTop: "16px", fontWeight: "600" }}>⏳ SOS alert sending in...</div>
            <div style={{ fontSize: "14px", color: "#9CA3AF", marginTop: "8px" }}>Notifying {contacts.length} emergency contacts</div>
          </div>
        )}

        {/* SOS BUTTON */}
        <div
          onClick={isCounting ? stopSOS : startSOS}
          style={{
            background: isCounting ? "linear-gradient(135deg, #BE122D, #E11D48)" : "linear-gradient(135deg, #E11D48, #BE122D)",
            padding: "50px 20px",
            borderRadius: "28px",
            color: "white",
            textAlign: "center",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: isCounting ? "0 0 50px rgba(225, 29, 72, 0.5)" : "0 15px 40px rgba(225, 29, 72, 0.35)",
            marginBottom: "24px",
            fontSize: "20px",
            transition: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: "2px solid rgba(255,255,255,0.2)",
            transform: "translateY(0)",
            userSelect: "none"
          }}
          onMouseEnter={(e) => {
            if (!isCounting) {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 20px 50px rgba(225, 29, 72, 0.45)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isCounting) {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(225, 29, 72, 0.35)";
            }
          }}
        >
          {isCounting ? "🛑 CANCEL SOS" : "🚨 ACTIVATE SOS NOW 🚨"}
        </div>

        {/* STATUS */}
        {status && (
          <div style={{
            background: status.includes("✅") ? "#DCFCE7" : status.includes("⚠️") ? "#FEF3C7" : "#FEE2E2",
            color: status.includes("✅") ? "#15803D" : status.includes("⚠️") ? "#92400E" : "#991B1B",
            padding: "16px", borderRadius: "12px", marginBottom: "24px", border: `1px solid ${status.includes("✅") ? "#86EFAC" : status.includes("⚠️") ? "#FCD34D" : "#FCA5A5"}`, textAlign: "center", fontWeight: "600"
          }}>
            {status}
          </div>
        )}

        {/* CONTACTS */}
        <div style={{ background: "white", padding: "28px", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid rgba(91,46,255,0.08)" }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700", color: "#111827" }}>👥 Emergency Contacts ({contacts.length})</h3>
          {contacts.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#6B7280" }}>
              <p style={{ fontSize: "16px", margin: 0 }}>📌 No emergency contacts added yet</p>
              <button onClick={() => navigate("/contacts")} style={{ background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", marginTop: "16px" }}>+ Add Contacts</button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ padding: "16px", background: "#F9FAFB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" }}>
                      {c.name[0]?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", color: "#111827" }}>{c.name}</div>
                      <div style={{ fontSize: "13px", color: "#6B7280" }}>📱 {c.phone}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => navigate("/contacts")} style={{ width: "100%", marginTop: "20px", padding: "12px", background: "#F3F4F6", border: "2px solid #E5E7EB", color: "#111827", borderRadius: "12px", fontWeight: "600", cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#E5E7EB"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#F3F4F6"; }}>📋 Manage Contacts</button>
        </div>
      </div>
    </div>
  );
}

export default SOS;