import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function TrackMe() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState(() => JSON.parse(localStorage.getItem("trackingHistory")) || []);
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState("");
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const lastPositionRef = useRef(null);
  const [speedAlert, setSpeedAlert] = useState(false);
  const mapRef = useRef(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updateLocation = () => {
    setStatus("📡 Fetching live GPS...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const time = new Date().toLocaleTimeString();
        const newLoc = { lat: latitude, lng: longitude, accuracy, time };

        if (lastPositionRef.current) {
          const prev = lastPositionRef.current;
          const dist = calculateDistance(prev.lat, prev.lng, latitude, longitude);
          const timeDiff = (Date.now() - prev.timestamp) / 1000;
          const currentSpeed = timeDiff > 0 ? (dist * 1000) / timeDiff : 0;

          setDistance((d) => d + dist);
          setSpeed(currentSpeed);
          if (currentSpeed > 8) {
            setSpeedAlert(true);
            setTimeout(() => setSpeedAlert(false), 3000);
          }
        }

        lastPositionRef.current = {
          lat: latitude,
          lng: longitude,
          timestamp: Date.now(),
        };

        setLocation(newLoc);
        const updated = [...locationHistory, newLoc].slice(-20);
        setLocationHistory(updated);
        localStorage.setItem("trackingHistory", JSON.stringify(updated));

        setStatus("✅ Live location updated");
        setTimeout(() => setStatus(""), 2000);
      },
      () => {
        setStatus("⚠️ Location permission denied");
        setTimeout(() => setStatus(""), 2000);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!tracking) return;
    updateLocation();
    const interval = setInterval(updateLocation, 8000);
    return () => clearInterval(interval);
  }, [tracking]);

  useEffect(() => {
    if (tracking && window.speechSynthesis) {
      const msg = new SpeechSynthesisUtterance("Live tracking active");
      msg.rate = 1;
      msg.pitch = 1;
      window.speechSynthesis.speak(msg);
    }
  }, [tracking]);

  const shareViaSMS = () => {
    if (!location) return;
    const link = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    const message = `🚨 Live Tracking Location:\n${link}`;
    const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];

    contacts.forEach((c, index) => {
      setTimeout(() => {
        window.location.href = `sms:${c.phone}?body=${encodeURIComponent(message)}`;
      }, index * 1200);
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: tracking
          ? "linear-gradient(135deg, #0f172a, #1e3a8a)"
          : "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)",
        padding: "20px",
        fontFamily: "'Inter', system-ui",
        transition: "0.5s ease",
        border: speedAlert ? "6px solid red" : "6px solid transparent",
        boxShadow: speedAlert ? "0 0 40px red" : "none"
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "white",
          padding: "28px",
          borderRadius: "24px",
          marginBottom: "30px",
          boxShadow: tracking
            ? "0 0 40px rgba(37,99,235,0.6)"
            : "0 10px 30px rgba(37,99,235,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontWeight: "800" }}>🛰️ Advanced Live Tracker</h2>
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

      {location && (
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "20px",
            marginBottom: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h4>📍 Current Position</h4>
          <p><strong>Lat:</strong> {location.lat.toFixed(6)}</p>
          <p><strong>Lng:</strong> {location.lng.toFixed(6)}</p>
          <p><strong>Accuracy:</strong> ±{location.accuracy.toFixed(0)}m</p>
          <p>
            <strong>Speed:</strong>
            <span style={{ color: speed > 8 ? "red" : "black", fontWeight: "700" }}>
              {speed.toFixed(2)} m/s
            </span>
          </p>
          <p><strong>Total Distance:</strong> {distance.toFixed(3)} km</p>
        </div>
      )}

      {location && (
        <div
          style={{
            background: "white",
            padding: "16px",
            borderRadius: "20px",
            marginBottom: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            overflow: "hidden"
          }}
        >
          <h4>🗺 Live Map View</h4>
          <iframe
            ref={mapRef}
            title="Live Map"
            width="100%"
            height="250"
            style={{ borderRadius: "12px", border: "none" }}
            src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            allowFullScreen
          />
        </div>
      )}

      <div style={{ display: "grid", gap: "12px" }}>
        <button
          onClick={updateLocation}
          style={{
            padding: "14px",
            background: "#dbeafe",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          📡 Get Location
        </button>

        <button
          onClick={() => setTracking(!tracking)}
          style={{
            padding: "14px",
            background: tracking ? "#fee2e2" : "#dcfce7",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          {tracking ? "⏹ Stop Tracking" : "▶ Start Tracking"}
        </button>

        <button
          onClick={shareViaSMS}
          style={{
            padding: "14px",
            background: "#e0f2fe",
            border: "none",
            borderRadius: "12px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          📤 Send Live Location (SMS)
        </button>
      </div>

      {status && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "#dcfce7",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          {status}
        </div>
      )}
    </div>
  );
}

export default TrackMe;