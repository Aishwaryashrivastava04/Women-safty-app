import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import sirenSound from "../assets/siren.mp3";

function SOS() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [status, setStatus] = useState("");
  const [contacts, setContacts] = useState([]);
  const [progress, setProgress] = useState(0);
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
    setProgress(0);
    setIsCounting(true);
    setStatus("🚨 Emergency sequence initiated...");

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const stopSOS = () => {
    setIsCounting(false);
    setTimeLeft(0);
    setProgress(0);
    setStatus("🛑 SOS Aborted Successfully");

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const sendSOS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      const message = `🚨 EMERGENCY ALERT! I need immediate help. My live location: https://maps.google.com/?q=${latitude},${longitude}`;

      contacts.forEach((c, index) => {
        setTimeout(() => {
          window.location.href = `sms:${c.phone}?body=${encodeURIComponent(message)}`;
        }, index * 1200);
      });

      setStatus("✅ Emergency alerts dispatched!");
      setIsCounting(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    if (isCounting && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        setProgress((prev) => prev + 10);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCounting && timeLeft === 0) {
      sendSOS();
    }
  }, [timeLeft, isCounting]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isCounting
          ? "linear-gradient(135deg, #450a0a, #7f1d1d, #dc2626)"
          : "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)",
        padding: "20px",
        fontFamily: "'Inter', system-ui",
        transition: "0.5s ease",
      }}
    >
      <audio ref={audioRef} src={sirenSound} loop />

      {/* Header */}
      <div
        style={{
          background: isCounting
            ? "rgba(0,0,0,0.2)"
            : "linear-gradient(135deg, #E11D48, #BE122D)",
          color: "white",
          padding: "30px 20px",
          borderRadius: "24px",
          marginBottom: "30px",
          boxShadow: isCounting
            ? "0 0 60px rgba(220,38,38,0.7)"
            : "0 10px 30px rgba(225, 29, 72, 0.2)",
          animation: isCounting ? "flash 1s infinite" : "none",
        }}
      >
        <style>{`
          @keyframes flash {
            0%,100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes pulseCount {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontWeight: "800" }}>🚨 EMERGENCY SOS</h2>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              padding: "8px 14px",
              borderRadius: "10px",
              color: "white",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Countdown + Progress */}
      {isCounting && (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "24px",
            textAlign: "center",
            marginBottom: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "900",
              color: "#dc2626",
              textShadow: "0 0 20px rgba(220,38,38,0.8)",
              animation: "pulseCount 1s infinite"
            }}
          >
            {timeLeft}
          </div>

          <div
            style={{
              height: "12px",
              background: "#fee2e2",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "12px",
                background: "linear-gradient(90deg, #dc2626, #ef4444)",
                borderRadius: "10px",
                transition: "width 1s ease-in-out",
                boxShadow: "0 0 10px rgba(220,38,38,0.6)"
              }}
            />
          </div>

          <div style={{ marginTop: "10px", fontWeight: "600" }}>
            Sending alerts to {contacts.length} contacts...
          </div>
        </div>
      )}

      {/* Main SOS Button */}
      <div
        onClick={isCounting ? stopSOS : startSOS}
        style={{
          background: isCounting
            ? "linear-gradient(135deg, #991b1b, #dc2626)"
            : "linear-gradient(135deg, #E11D48, #BE122D)",
          padding: "50px 20px",
          borderRadius: "28px",
          color: "white",
          textAlign: "center",
          fontWeight: "800",
          cursor: "pointer",
          fontSize: "22px",
          boxShadow: isCounting
            ? "0 0 80px rgba(220,38,38,0.9)"
            : "0 15px 40px rgba(225,29,72,0.35)",
          transition: "0.3s ease",
        }}
      >
        {isCounting ? "🛑 CANCEL EMERGENCY" : "🚨 ACTIVATE EMERGENCY NOW"}
      </div>

      {/* Status */}
      {status && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
            fontWeight: "600",
            background: status.includes("✅")
              ? "#dcfce7"
              : status.includes("⚠️")
              ? "#fef3c7"
              : "#fee2e2",
            color: status.includes("✅")
              ? "#15803d"
              : status.includes("⚠️")
              ? "#92400e"
              : "#991b1b",
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}

export default SOS;