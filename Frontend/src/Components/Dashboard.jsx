import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import sirenSound from "../assets/siren.mp3";

function Dashboard({ onLogout = () => {} }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const [autoSent, setAutoSent] = useState(false);
  const [autoCallTriggered, setAutoCallTriggered] = useState(false);
  const [redAlertMode, setRedAlertMode] = useState(false);
  const [stories, setStories] = useState([]);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [locationHistory, setLocationHistory] = useState([]);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [riskHistory, setRiskHistory] = useState([]);
  const [trackingOn, setTrackingOn] = useState(true);
  const [safetyScore, setSafetyScore] = useState(60);
  const [emergencyContacts, setEmergencyContacts] = useState(0);
  const [aiThreatLevel, setAiThreatLevel] = useState("Low");
  const [movementSpeed, setMovementSpeed] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(60);
  const lastPositionRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("userEmail");
    const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    setEmergencyContacts(contacts.length);
  }, [navigate]);

   // 📚 Fetch Community Stories
useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("https://women-safty-app.onrender.com/users/all/stories", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setStories(data.allstories || []);
      }
    })
    .catch((err) => console.log(err));
}, []);

  // 🌙 Night Risk Boost
  const getNightMultiplier = () => {
    const hour = new Date().getHours();
    return hour >= 22 || hour <= 5 ? 1.5 : 1;
  };

  // 📍 Professional Auto Tracking System
  useEffect(() => {
  if (!trackingOn) return;

  const interval = setInterval(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;

        // 🧠 ML SPEED CALCULATION
        if (lastPositionRef.current) {
          const prev = lastPositionRef.current;

          const distance = Math.sqrt(
            Math.pow(latitude - prev.latitude, 2) +
            Math.pow(longitude - prev.longitude, 2)
          );

          const timeDiff = (Date.now() - prev.timestamp) / 1000;

          const speed = timeDiff > 0 ? distance / timeDiff * 100000 : 0;

          setMovementSpeed(speed);

          // 🧠 AI Threat Logic
          if (speed > 8) {
            setAiThreatLevel("High");
            setAiConfidence(92);
            increaseRisk(25);
          } else if (speed > 4) {
            setAiThreatLevel("Medium");
            setAiConfidence(75);
            increaseRisk(10);
          } else {
            setAiThreatLevel("Low");
            setAiConfidence(60);
          }
        }

        lastPositionRef.current = {
          latitude,
          longitude,
          timestamp: Date.now(),
        };

        setLocationHistory((prev) => [
          {
            time: new Date().toLocaleTimeString(),
            link,
          },
          ...prev.slice(0, 4),
        ]);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );
  }, 10000);

  return () => clearInterval(interval);
}, [trackingOn]);

  // 📊 AI Risk System
  const increaseRisk = (value) => {
  const multiplier = getNightMultiplier();

  setRiskScore((prev) => {
    const newScore = prev + value * multiplier;
    setRiskHistory((h) => [...h.slice(-9), newScore]);

    // 🚨 60% → Auto SMS
    if (newScore >= 70 && !autoSent) {
      sendLocationToContacts();
      setAutoSent(true);
    }

    // 📞 70% → Auto Call Police
    if (newScore >= 80 && !autoCallTriggered) {
      window.location.href = "tel:100";
      setAutoCallTriggered(true);
    }

    // 🔴 80% → Red Alert Mode
    if (newScore >= 90 && !redAlertMode) {
      setRedAlertMode(true);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }

    return newScore;
  });
};

  const resetRisk = () => {
    setRiskScore(0);
    setRiskHistory([]);
  };


  // 📩 Send Location to Contacts
  const sendLocationToContacts = () => {
    const contacts =
      JSON.parse(localStorage.getItem("emergencyContacts")) || [];

    if (contacts.length === 0) {
      alert("No emergency contacts found.");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const message = encodeURIComponent(
        `🚨 I need help! My location: https://www.google.com/maps?q=${latitude},${longitude}`
      );

      const numbers = contacts.map((c) => c.phone).join(",");
      window.location.href = `sms:${numbers}?body=${message}`;
    });
  };

  // 🎙 Voice AI
  const toggleVoiceAI = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
      
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (transcript.includes("send my location")) {
        sendLocationToContacts();
      }

      if (transcript.includes("call police")) {
        window.location.href = "tel:100";
      }

      if (transcript.includes("help") || transcript.includes("danger")) {
        increaseRisk(30);
      }
    };

    recognition.start();
  };

  // 🔊 Alarm
  const toggleAlarm = () => {
    if (!audioRef.current) return;

    if (isAlarmPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play();
      increaseRisk(10);
    }

    setIsAlarmPlaying(!isAlarmPlaying);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%, #E8EFFF 100%)",
        fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
        paddingBottom: "100px",
      }}
    >
      <audio ref={audioRef} src={sirenSound} loop />

      {/* STICKY PROFESSIONAL HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)",
          color: "white",
          padding: "28px 20px",
          borderBottomLeftRadius: "32px",
          borderBottomRightRadius: "32px",
          boxShadow: "0 15px 40px rgba(91, 46, 255, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "26px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            🛡️ SafeHere
          </h3>
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "14px",
              fontWeight: "500",
              opacity: 0.95,
            }}
          >
            Welcome back, <strong>{userName}</strong>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              opacity: 0.9,
              fontWeight: "500",
            }}
          >
            <span style={{ width: "8px", height: "8px", background: "#10B981", borderRadius: "50%", display: "inline-block" }}></span>
            AI Safety Monitoring Active
          </div>
        </div>
        <div
          onClick={() => navigate("/profile")}
          style={{
            cursor: "pointer",
            fontSize: "40px",
            transition: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            padding: "12px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08) rotate(5deg)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
        >
          👤
        </div>
      </div>

      <div style={{ padding: "24px 16px" }}>
        {/* 🧠 AI THREAT ANALYSIS */}
<div
  style={{
    background: "#F3F4F6",
    padding: "20px",
    borderRadius: "24px",
    marginBottom: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid rgba(91, 46, 255, 0.1)",
  }}
>
  <h4 style={{ margin: "0 0 10px 0" }}>🧠 AI Threat Analysis</h4>

  <p style={{ margin: "6px 0" }}>
    Threat Level:{" "}
    <strong
      style={{
        color:
          aiThreatLevel === "High"
            ? "#DC2626"
            : aiThreatLevel === "Medium"
            ? "#F59E0B"
            : "#16A34A",
      }}
    >
      {aiThreatLevel}
    </strong>
  </p>

  <p style={{ margin: "6px 0" }}>
    Movement Speed: <strong>{movementSpeed.toFixed(2)} m/s</strong>
  </p>

  <p style={{ margin: "6px 0" }}>
    AI Confidence: <strong>{aiConfidence}%</strong>
  </p>
</div>
        {/* PREMIUM SAFETY METRICS */}
        <div style={{ marginBottom: "28px" }}>
          <h5 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>
            📊 Safety Status
          </h5>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
            }}
          >
            {/* Risk Score Card - Premium */}
            <div
              style={{
                background: riskScore >= 60 
                  ? "linear-gradient(135deg, #E11D48 0%, #BE122D 100%)"
                  : "linear-gradient(135deg, #FFF7ED 0%, #FEE4E2 100%)",
                color: riskScore >= 60 ? "white" : "#92400E",
                padding: "18px 14px",
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: riskScore >= 60
                  ? "0 10px 25px rgba(225, 29, 72, 0.3)"
                  : "0 8px 20px rgba(91, 46, 255, 0.08)",
                border: riskScore >= 60 ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,140,0,0.1)",
                transition: "0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-1px" }}>
                {Math.round(riskScore)}%
              </div>
              <div style={{ fontSize: "11px", marginTop: "6px", fontWeight: "600", opacity: 0.95 }}>
                🎯 Risk Score
              </div>
            </div>

            {/* Safety Score Card - Premium */}
            <div
              style={{
                background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                color: "#065F46",
                padding: "18px 14px",
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                transition: "0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-1px" }}>
                {safetyScore}%
              </div>
              <div style={{ fontSize: "11px", marginTop: "6px", fontWeight: "600", opacity: 0.95 }}>
                ✅ Safety
              </div>
            </div>

            {/* Contacts Card - Premium */}
            <div
              style={{
                background: "linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)",
                color: "#3730A3",
                padding: "18px 14px",
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(91, 46, 255, 0.15)",
                border: "1px solid rgba(91, 46, 255, 0.2)",
                transition: "0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-1px" }}>
                {emergencyContacts}
              </div>
              <div style={{ fontSize: "11px", marginTop: "6px", fontWeight: "600", opacity: 0.95 }}>
                👥 Contacts
              </div>
            </div>
          </div>
        </div>

        {/* ENHANCED RISK CHART */}
        <div
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: "20px",
            border: "1px solid rgba(91, 46, 255, 0.08)",
          }}
        >
          <h6 style={{ margin: "0 0 14px 0", fontSize: "13px", fontWeight: "700", color: "#111827" }}>
            📈 Risk History
          </h6>
          <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "50px", background: "#F9FAFB", padding: "10px", borderRadius: "16px" }}>
            {riskHistory.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "0", fontWeight: "500" }}>
                ✅ No risk events recorded
              </p>
            ) : (
              riskHistory.map((value, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: Math.max((value / 100) * 50, 3),
                    background: value > 60 
                      ? "linear-gradient(180deg, #E11D48, #BE122D)"
                      : "linear-gradient(180deg, #5B2EFF, #7C5CFF)",
                    borderRadius: "4px 4px 0 0",
                    opacity: 0.6 + (index / Math.max(riskHistory.length, 1)) * 0.4,
                    transition: "0.3s ease",
                    position: "relative",
                  }}
                  title={`Risk: ${Math.round(value)}%`}
                />
              ))
            )}
          </div>
        </div>

        {/* PREMIUM EMERGENCY SOS BUTTON */}
        <div
          onClick={() => navigate("/sos")}
          style={{
            background: "linear-gradient(135deg, #E11D48 0%, #BE122D 100%)",
            padding: "28px 20px",
            borderRadius: "28px",
            color: "white",
            textAlign: "center",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 15px 40px rgba(225, 29, 72, 0.35)",
            marginBottom: "24px",
            fontSize: "20px",
            transition: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: "translateY(0)",
            border: "2px solid rgba(255,255,255,0.1)",
            letterSpacing: "0.5px",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 20px 50px rgba(225, 29, 72, 0.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(225, 29, 72, 0.35)";
          }}
        >
          🚨 EMERGENCY SOS 🚨
        </div>

        {/* PREMIUM FEATURE GRID */}
        <div style={{ marginBottom: "24px" }}>
          <h5 style={{ margin: "0 0 14px 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>
            ⚡ Quick Actions
          </h5>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <FeatureCard
              title="Emergency SMS"
              icon="📩"
              color="#E0F2FE"
              accentColor="#0084FF"
              onClick={sendLocationToContacts}
            />
            <FeatureCard
              title="Helpline"
              icon="📞"
              color="#FEF3C7"
              accentColor="#F59E0B"
              onClick={() => navigate("/helpline")}
            />
            <FeatureCard
              title="Track Me"
              icon="📍"
              color="#DCFCE7"
              accentColor="#10B981"
              onClick={() => navigate("/trackme")}
            />
            <FeatureCard
              title={isAlarmPlaying ? "Stop Alarm" : "Sound Alarm"}
              icon="🔊"
              color="#F3E8FF"
              accentColor="#7C5CFF"
              onClick={toggleAlarm}
              isActive={isAlarmPlaying}
            />
            <FeatureCard
              title={isListening ? "Stop Mic AI" : "Start Mic AI"}
              icon="🎙️"
              color="#FEE2E2"
              accentColor="#E11D48"
              onClick={toggleVoiceAI}
              isActive={isListening}
            />
            <FeatureCard
              title="Nearby Police"
              icon="🚔"
              color="#D1FAE5"
              accentColor="#059669"
              onClick={() => navigate("/nearby-police")}
            />
            <FeatureCard
              title="Feedback"
              icon="💬"
              color="#FEF3C7"
              accentColor="#D97706"
              onClick={() => navigate("/feedback")}
            />
            <FeatureCard
              title="Quick Call"
              icon="📲"
              color="#EEF2FF"
              accentColor="#0084FF"
              onClick={() => navigate("/quickcall")}
            />
            <FeatureCard
              title="Settings"
              icon="⚙️"
              color="#F5F3FF"
              accentColor="#7C5CFF"
              onClick={() => navigate("/settings")}
            />
          </div>
        </div>

        {/* SMART AUTO TRACKING CARD */}
        <div
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "24px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            marginBottom: "20px",
            border: "1px solid rgba(91, 46, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h6 style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "700", color: "#111827" }}>
              📍 Location Tracking
            </h6>
            <p
              style={{
                margin: "0",
                fontSize: "12px",
                color: "#6B7280",
                fontWeight: "500",
              }}
            >
              Auto-updates every 10 seconds
            </p>
          </div>
          <button
            onClick={() => setTrackingOn(!trackingOn)}
            style={{
              padding: "10px 18px",
              borderRadius: "14px",
              border: "none",
              background: trackingOn 
                ? "linear-gradient(135deg, #10B981, #059669)"
                : "#E5E7EB",
              color: trackingOn ? "white" : "#111827",
              fontWeight: "700",
              fontSize: "12px",
              cursor: "pointer",
              transition: "0.3s ease",
              boxShadow: trackingOn ? "0 6px 16px rgba(16, 185, 129, 0.3)" : "none",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {trackingOn ? "🟢 ON" : "⭕ OFF"}
          </button>
        </div>

        {/* LOCATION HISTORY */}
        {locationHistory.length > 0 && (
          <div
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              marginBottom: "20px",
              border: "1px solid rgba(91, 46, 255, 0.08)",
            }}
          >
            <h6 style={{ margin: "0 0 14px 0", fontSize: "13px", fontWeight: "700", color: "#111827" }}>
              🗺️ Recent Locations ({locationHistory.length})
            </h6>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {locationHistory.slice(0, 5).map((loc, index) => (
                <a
                  href={loc.link}
                  target="_blank"
                  rel="noreferrer"
                  key={index}
                  style={{
                    padding: "12px 14px",
                    background: "#F9FAFB",
                    borderRadius: "14px",
                    border: "1px solid #E5E7EB",
                    textDecoration: "none",
                    transition: "0.2s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#EEF2FF";
                    e.currentTarget.style.borderColor = "#5B2EFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F9FAFB";
                    e.currentTarget.style.borderColor = "#E5E7EB";
                  }}
                >
                  <div style={{ color: "#6B7280", fontWeight: "500" }}>
                    {loc.time}
                  </div>
                  <div style={{ color: "#5B2EFF", fontWeight: "700" }}>
                    View Map →
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        {/* COMMUNITY STORIES */}
<div
  style={{
    background: "white",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
  }}
>
  <h3 style={{ marginBottom: "12px" }}>📚 Community Stories</h3>

  {stories.length === 0 ? (
    <p>No stories yet</p>
  ) : (
    stories.map((story, index) => (
      <div key={index} style={{ marginBottom: "15px" }}>
        <h4>{story.title}</h4>
        <p>{story.description}</p>
      </div>
    ))
  )}
</div>
        {/* PREMIUM LOGOUT BUTTON */}
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("token");
            onLogout();
            navigate("/login");
          }}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "2px solid #E5E7EB",
            background: "white",
            color: "#6B7280",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            transition: "0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F9FAFB";
            e.currentTarget.style.borderColor = "#D1D5DB";
            e.currentTarget.style.color = "#111827";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#E5E7EB";
            e.currentTarget.style.color = "#6B7280";
          }}
        >
          🚪 LOGOUT
        </button>
      </div>
    </div>
  );
}

const FeatureCard = ({ title, icon, onClick, color = "#F3F4F6", accentColor = "#111827", isActive = false }) => (
  <div
    onClick={onClick}
    style={{
      background: color,
      padding: "22px 16px",
      borderRadius: "22px",
      textAlign: "center",
      cursor: "pointer",
      boxShadow: isActive 
        ? `0 10px 28px rgba(91, 46, 255, 0.2)`
        : "0 6px 20px rgba(0,0,0,0.05)",
      transition: "0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: "translateY(0)",
      border: isActive ? `2px solid ${accentColor}` : `1px solid rgba(0,0,0,0.05)`,
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 16px 32px rgba(91, 46, 255, 0.25)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = isActive 
        ? "0 10px 28px rgba(91, 46, 255, 0.2)"
        : "0 6px 20px rgba(0,0,0,0.05)";
    }}
  >
    <div style={{ fontSize: "32px", marginBottom: "8px", transition: "0.3s ease" }}>{icon}</div>
    <div style={{ fontSize: "12px", fontWeight: "700", color: accentColor, letterSpacing: "0.3px" }}>
      {title}
    </div>
    {isActive && (
      <div style={{ fontSize: "9px", marginTop: "6px", color: accentColor, fontWeight: "600", opacity: 0.8 }}>
        • ACTIVE
      </div>
    )}
  </div>
);

export default Dashboard; 