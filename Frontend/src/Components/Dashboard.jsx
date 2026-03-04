import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import sirenSound from "../assets/siren.mp3";

 function Dashboard({ onLogout = () => {} }) {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef(null);
  const [autoSent, setAutoSent] = useState(false);
  const [autoCallTriggered, setAutoCallTriggered] = useState(false);
  const [redAlertMode, setRedAlertMode] = useState(false);
const [screenFlash, setScreenFlash] = useState(false);
const [showPinInput, setShowPinInput] = useState(false);
const [blinkRed, setBlinkRed] = useState(false);
useEffect(() => {
  if (!redAlertMode) return;

  const interval = setInterval(() => {
    setBlinkRed(prev => !prev);
  }, 400);

  return () => clearInterval(interval);
}, [redAlertMode]);
const [enteredPin, setEnteredPin] = useState("");
const SECRET_PIN = "1234";
  const [stories, setStories] = useState([]);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [locationHistory, setLocationHistory] = useState([]);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [riskHistory, setRiskHistory] = useState([]);
  const [trackingOn, setTrackingOn] = useState(true);
  const [safetyScore, setSafetyScore] = useState(60);
  const [emergencyContacts, setEmergencyContacts] = useState(0);
  const [aiThreatLevel, setAiThreatLevel] = useState("Low");
  const [movementSpeed, setMovementSpeed] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(60);
  const lastPositionRef = useRef(null);
  const [fakeCallTriggered, setFakeCallTriggered] = useState(false);
const [lockMode, setLockMode] = useState(false);
const [capturedImage, setCapturedImage] = useState(null);
// 🛰 Safe Zone System (Multiple Safe Places)
const defaultSafeZones = [
  { lat: 25.624614, lng: 85.057381, name: "Aishwarya Home" },
  { lat: 25.611806, lng: 85.051361, name: "Sachin Home" },
  { lat: 25.6159, lng: 85.0823, name: "College" }
];

// ⚠️ Unsafe Area System
const unsafeZones = [
  {
    lat: 25.614688,
    lng: 85.025777,
    name: "Danapur Naubatpur Rd"
  },
  {
    lat: 25.635810,
    lng: 85.027923,
    name: "Danapur Cantonment"
  }
];

const UNSAFE_RADIUS = 0.008;

const [safeZones, setSafeZones] = useState(
  JSON.parse(localStorage.getItem("safeZones")) || defaultSafeZones
);

const SAFE_RADIUS = 0.01;

useEffect(() => {
  const existing = localStorage.getItem("safeZones");

  if (!existing) {
    localStorage.setItem("safeZones", JSON.stringify(defaultSafeZones));
    setSafeZones(defaultSafeZones);
  } else {
    try {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) {
        setSafeZones(parsed);
      }
    } catch (e) {
      setSafeZones(defaultSafeZones);
    }
  }
}, []);

// 🚶 Walk With Me Mode
const [walkMode, setWalkMode] = useState(false);
const [walkCountdown, setWalkCountdown] = useState(120);

// 👨‍👩‍👧 Guardian Live Monitoring
const [guardianMode, setGuardianMode] = useState(false);
const [guardianLink, setGuardianLink] = useState(null);
const [guardianPosition, setGuardianPosition] = useState(null);
const [guardianRoute, setGuardianRoute] = useState([]);
const [lastUpdateTime, setLastUpdateTime] = useState(null);
const [speedSpike, setSpeedSpike] = useState(false);
const [guardianDistance, setGuardianDistance] = useState(0);
const [guardianTotalDistance, setGuardianTotalDistance] = useState(0);
const [guardianStartPoint, setGuardianStartPoint] = useState(null);
const [guardianLiveDistance, setGuardianLiveDistance] = useState(0);
// 🧠 AI Danger Prediction
const [dangerPrediction, setDangerPrediction] = useState("Normal Activity");

// 🚨 Danger Zone Visual System
const [dangerZoneActive, setDangerZoneActive] = useState(false);
const [dangerCoords, setDangerCoords] = useState(null);

// Prevent guardian SMS spam
const [guardianAlertSent, setGuardianAlertSent] = useState(false);

  // 👇 ADD THIS FIRST
useEffect(() => {
  const enableMotion = async () => {
    try {
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === "granted") {
          console.log("Motion permission granted");
        }
      }
    } catch (err) {
      console.log("Motion permission not supported", err);
    }
  };

  enableMotion();
}, []);

  useEffect(() => {

  const handleMotion = (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const total =
      Math.abs(acc.x || 0) +
      Math.abs(acc.y || 0) +
      Math.abs(acc.z || 0);

    if (total > 30) {
      increaseRisk(20);
    }
  };

  window.addEventListener("devicemotion", handleMotion);

  return () => {
    window.removeEventListener("devicemotion", handleMotion);
  };

}, []);
 
const handleStealthTap = () => {
  const newCount = tapCount + 1;
  setTapCount(newCount);

  if (tapTimerRef.current) {
    clearTimeout(tapTimerRef.current);
  }

  tapTimerRef.current = setTimeout(() => {
    setTapCount(0);
  }, 2000);

  if (newCount === 3) {
    increaseRisk(50);
    setTapCount(0);
  }
};

const capturePhoto = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("Camera API not supported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" }
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    // Save in localStorage
    localStorage.setItem("lastCapturedImage", imageData);
    setCapturedImage(imageData);

    // Stop camera
    stream.getTracks().forEach(track => track.stop());

    console.log("Photo captured silently");
  } catch (err) {
    console.log("Camera error:", err);
  }
};

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

  useEffect(() => {
    const savedImage = localStorage.getItem("lastCapturedImage");
    if (savedImage) {
      setCapturedImage(savedImage);
    }
  }, []);

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

          // ⚠️ Unsafe Zone Detection
          const insideUnsafe = unsafeZones.some((zone) => {
            const distance = Math.sqrt(
              Math.pow(latitude - zone.lat, 2) +
              Math.pow(longitude - zone.lng, 2)
            );
            return distance <= UNSAFE_RADIUS;
          });

          if (insideUnsafe) {
            increaseRisk(35);
            setDangerZoneActive(true);
            setDangerCoords({ lat: latitude, lng: longitude });
            setScreenFlash(true);

            setTimeout(() => {
              setScreenFlash(false);
            }, 2000);

            if ("speechSynthesis" in window) {
              const msg = new SpeechSynthesisUtterance(
                "Warning. You have entered a high risk area. Please stay alert."
              );
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(msg);
            }
          } else {
            setDangerZoneActive(false);
          }

          // 🌙 Safe Zone Night Check
          if (safeZones && safeZones.length > 0) {
            const hour = new Date().getHours();

            if (hour >= 22 || hour <= 5) {

              const insideSafeZone = safeZones.some((zone) => {
                const distance = Math.sqrt(
                  Math.pow(latitude - zone.lat, 2) +
                  Math.pow(longitude - zone.lng, 2)
                );

                return distance <= SAFE_RADIUS;
              });

              if (!insideSafeZone) {
                if ("speechSynthesis" in window) {
                  const msg = new SpeechSynthesisUtterance(
                    "Warning. You are outside your safe zone at night."
                  );
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(msg);
                } else {
                  alert("⚠ You are outside your safe zone at night.");
                }
              }
            }
          }

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

            // 🧠 AI Threat Logic with Danger Prediction
            if (speed > 8) {
              setAiThreatLevel("High");
              setAiConfidence(92);
              setDangerPrediction("High Risk Movement");
              increaseRisk(25);
            } else if (speed > 4) {
              setAiThreatLevel("Medium");
              setAiConfidence(75);
              setDangerPrediction("Unusual Movement");
              increaseRisk(10);
            } else {
              setAiThreatLevel("Low");
              setAiConfidence(60);
              setDangerPrediction("Normal Activity");
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
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [trackingOn, safeZones]);

// 🚶 Walk Mode Logic
useEffect(() => {
  if (!walkMode) return;

  const interval = setInterval(() => {
    setWalkCountdown((prev) => {
      if (prev <= 1) {
        sendLocationToContacts();

        navigator.geolocation.getCurrentPosition((pos) => {
          console.log("Walk Mode Location:", pos.coords);
        });

        alert("🚨 No response detected. Emergency SMS sent.");

        return 120;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [walkMode]);

// 👨‍👩‍👧 Guardian Live Monitoring System
useEffect(() => {
  if (!guardianMode) return;

  const interval = setInterval(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      // 📏 Distance calculation between last two points (meters)
      if (guardianPosition) {
        const R = 6371000;
        const lat1 = guardianPosition.lat * Math.PI / 180;
        const lat2 = latitude * Math.PI / 180;
        const dLat = (latitude - guardianPosition.lat) * Math.PI / 180;
        const dLon = (longitude - guardianPosition.lng) * Math.PI / 180;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        setGuardianDistance(distance);
        setGuardianTotalDistance(prev => prev + distance);
      }

      // Use Google Maps with satellite view for better mobile experience
      const liveLink = `https://maps.google.com/?q=${latitude},${longitude}&t=k`;
      setGuardianLink(liveLink);
      setGuardianPosition({ lat: latitude, lng: longitude });

      // 📍 Set start point for total route distance
      if (!guardianStartPoint) {
        setGuardianStartPoint({ lat: latitude, lng: longitude });
      }

      // 📏 Distance from start point
      if (guardianStartPoint) {
        const R = 6371000;
        const lat1 = guardianStartPoint.lat * Math.PI / 180;
        const lat2 = latitude * Math.PI / 180;
        const dLat = (latitude - guardianStartPoint.lat) * Math.PI / 180;
        const dLon = (longitude - guardianStartPoint.lng) * Math.PI / 180;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        setGuardianLiveDistance(distance);
      }

      setLastUpdateTime(new Date().toLocaleTimeString());

      setGuardianRoute((prev) => [
        ...prev.slice(-20),
        { lat: latitude, lng: longitude }
      ]);

      if (movementSpeed > 8) {
        setSpeedSpike(true);
        setTimeout(() => setSpeedSpike(false), 2000);
      }

      const contacts =
        JSON.parse(localStorage.getItem("emergencyContacts")) || [];

      // Send SMS only once when guardian tracking starts
      if (!guardianAlertSent && contacts.length > 0) {
        contacts.forEach((c, index) => {
          setTimeout(() => {
            window.location.href = `sms:${c.phone}?body=${encodeURIComponent(
              `📍 Live Tracking Started: ${liveLink}`
            )}`;
          }, index * 1500);
        });

        setGuardianAlertSent(true);
      }
    });
  }, 5000);

  return () => clearInterval(interval);
}, [guardianMode, movementSpeed, guardianPosition, guardianStartPoint]);

  // 📊 AI Risk System
  const increaseRisk = (value) => {
    const multiplier = getNightMultiplier();

    setRiskScore((prev) => {
      const newScore = prev + value * multiplier;
      setRiskHistory((h) => [...h.slice(-9), newScore]);

      // 🚨 40% → Auto SMS (lowered threshold for shake)
      if (newScore >= 40 && !autoSent) {
        sendLocationToContacts();
        setAutoSent(true);
      }

      // 📞 70% → Direct Police Call (no confirm)
      if (newScore >= 70 && !autoCallTriggered) {
        window.location.href = "tel:100";
        setAutoCallTriggered(true);
      }

      // 🔴 90% → Full Emergency Mode
      if (newScore >= 90 && !redAlertMode) {
        setRedAlertMode(true);

        // 🤖 AI Voice Warning
        if ("speechSynthesis" in window) {
          const msg = new window.SpeechSynthesisUtterance(
            "Warning. High threat detected. Emergency protocol activated."
          );
          msg.rate = 1;
          msg.pitch = 1;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(msg);
        } else {
          alert("🚨 High threat detected. Emergency protocol activated.");
        }

        setScreenFlash(true);
        setShowPinInput(true);

        if (navigator.vibrate) {
          navigator.vibrate([300, 200, 300, 200, 600]);
        }

        if (audioRef.current) {
          audioRef.current.volume = 1;
          audioRef.current.playbackRate = 1.1;
          audioRef.current.loop = true;
          try {
            audioRef.current.play();
          } catch (err) {
            console.log("Audio autoplay blocked", err);
          }
        }

        // Auto reset flash after 3 sec
        setTimeout(() => {
          setScreenFlash(false);
        }, 3000);
      }

      // 📸 80% → Capture Evidence
      if (newScore >= 80) {
        capturePhoto();
      }

      return newScore;
    });
  };

  const resetRisk = () => {
    setRiskScore(0);
    setRiskHistory([]);
  };

  // 📩 Send Location to Contacts (improved: triggers SMS one-by-one, Android WebView compatible)
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
        `🚨 EMERGENCY! My location: https://www.google.com/maps?q=${latitude},${longitude}`
      );

      // Send SMS one by one with slight delay (important for WebView)
      contacts.forEach((c, index) => {
        setTimeout(() => {
          // Mobile SMS intent, fallback for desktop
          if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = `sms:${c.phone}?body=${message}`;
          } else {
            navigator.clipboard.writeText(
              `🚨 EMERGENCY! Send this to ${c.phone}: https://www.google.com/maps?q=${latitude},${longitude}`
            );
            alert("SMS link copied. Send it manually from your phone.");
          }
        }, index * 1500);
      });
    });
  };


  // 🔊 Alarm
  const toggleAlarm = () => {
    if (!audioRef.current) return;

    if (isAlarmPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      try {
        audioRef.current.play();
      } catch (err) {
        console.log("Audio autoplay blocked", err);
      }
      increaseRisk(10);
    }

    setIsAlarmPlaying(!isAlarmPlaying);
  };

  return (
    <div
     onClick={(e) => {
  if (e.target === e.currentTarget) {
    handleStealthTap();
  }
}}
      style={{
        minHeight: "100vh",
        background: redAlertMode && blinkRed
          ? "#7F1D1D"
          : "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%, #E8EFFF 100%)",
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

      {redAlertMode && (
        <div
          style={{
            background: "#DC2626",
            color: "white",
            textAlign: "center",
            padding: "10px",
            fontWeight: "800",
            letterSpacing: "1px",
            animation: "pulse 1s infinite"
          }}
        >
          🚨 HIGH THREAT DETECTED – EMERGENCY MODE ACTIVE 🚨
        </div>
      )}

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
  Threat Level:
  <span
    style={{
      marginLeft: "8px",
      padding: "4px 10px",
      borderRadius: "10px",
      background:
        aiThreatLevel === "High"
          ? "#DC2626"
          : aiThreatLevel === "Medium"
          ? "#F59E0B"
          : "#16A34A",
      color: "white",
      fontWeight: "600"
    }}
  >
    {aiThreatLevel}
  </span>
</p>

  <p style={{ margin: "6px 0" }}>
    Movement Speed: <strong>{movementSpeed.toFixed(2)} m/s</strong>
  </p>

  <p style={{ margin: "6px 0" }}>
    AI Confidence: <strong>{aiConfidence}%</strong>
  </p>
  <p style={{ margin: "6px 0" }}>
    🧠 Prediction: <strong>{dangerPrediction}</strong>
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
              onClick={() => navigate("/emergencysms")}
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
 title="Guardian Monitor"
 icon="👨‍👩‍👧"
 color="#E0F2FE"
 accentColor="#0369A1"
 onClick={() => navigate("/guardian-monitor")}
/>
            <FeatureCard
 title="Safe Zones"
 icon="🏠"
 color="#DCFCE7"
 accentColor="#059669"
 onClick={() => navigate("/safe-zone")}
/>
<FeatureCard
 title="Unsafe Zones"
 icon="⚠️"
 color="#FEE2E2"
 accentColor="#DC2626"
 onClick={() => navigate("/unsafe-zone")}
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
              title="Nearby Police"
              icon="🚔"
              color="#D1FAE5"
              accentColor="#059669"
              onClick={() => navigate("/nearby-police")}
            />
            <FeatureCard
              title="Safety Tips"
              icon="🛡️"
              color="linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)"
              accentColor="#0369A1"
              onClick={() => navigate("/safetytips")}
            />
           <FeatureCard
 title="Walk Mode"
 icon="🚶‍♀️"
 color="#E0F2FE"
 accentColor="#0369A1"
 onClick={() => navigate("/walk-mode")}
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
            <FeatureCard
  title="Fake Call"
  icon="📞"
  color="#FDE68A"
  accentColor="#B45309"
  onClick={() => {
    setTimeout(() => {
      navigate("/fake-call");
    }, 100);
  }}
/>
                  
                  <FeatureCard
  title="Safety Products"
  icon="🛍️"
  color="linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)"
  accentColor="#BE185D"
  onClick={() => navigate("/safety-product")}
/>
<FeatureCard
 title="Quick Escape"
 icon="🚪"
 color="#FEE2E2"
 accentColor="#DC2626"
 onClick={() => window.location.href="https://google.com"}
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
        {walkMode && (
  <div
    style={{
      background: "#DBEAFE",
      padding: "15px",
      borderRadius: "15px",
      marginBottom: "20px",
      textAlign: "center"
    }}
  >
    <h4>🚶 Walk With Me Active</h4>
    <p>Next safety check in: <strong>{walkCountdown}s</strong></p>

    <button
      onClick={() => setWalkCountdown(120)}
      style={{
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#22c55e",
        color: "white",
        fontWeight: "600"
      }}
    >
      I Am Safe ✅
    </button>
  </div>
)}

        {guardianMode && guardianLink && (
          <div
            style={{
              background: "#E0F2FE",
              padding: "15px",
              borderRadius: "15px",
              marginBottom: "20px",
              textAlign: "center"
            }}
          >
            <h4>👨‍👩‍👧 Guardian Live Monitoring Active</h4>

            <p style={{ fontSize: "12px" }}>
              Your live location is being shared with guardians.
            </p>

            <a
              href={guardianLink}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "8px 14px",
                background: "#0369A1",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              View Live Location
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Live Safety Tracking",
                    text: "Track my live location",
                    url: guardianLink
                  });
                } else {
                  navigator.clipboard.writeText(guardianLink);
                  alert("Live tracking link copied 📍");
                }
              }}
              style={{
                display: "block",
                margin: "10px auto 0",
                padding: "8px 14px",
                background: "#0EA5E9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              🔗 Share Live Tracking
            </button>
            {guardianPosition && (
              <div
                style={{
                  marginTop: "15px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: speedSpike ? "3px solid #DC2626" : "2px solid #0369A1",
                  boxShadow: speedSpike ? "0 0 20px rgba(220,38,38,0.8)" : "none",
                  transition: "0.3s",
                  position: "relative",
                }}
              >
                <iframe
                  key={lastUpdateTime}
                  title="Guardian Live Map"
                  width="100%"
                  height="260"
                  loading="lazy"
                  style={{ border: "none" }}
                  src={
                    guardianRoute.length > 1
                      ? `https://maps.google.com/maps?saddr=${guardianRoute[guardianRoute.length-2].lat},${guardianRoute[guardianRoute.length-2].lng}&daddr=${guardianPosition.lat},${guardianPosition.lng}&output=embed`
                      : `https://maps.google.com/maps?q=${guardianPosition.lat},${guardianPosition.lng}&z=15&output=embed`
                  }
                />
                {/* Moving marker overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "14px",
                    height: "14px",
                    background: "#DC2626",
                    borderRadius: "50%",
                    boxShadow: "0 0 12px rgba(220,38,38,0.9)",
                    animation: "pulse 1s infinite"
                  }}
                />
                {lastUpdateTime && (
                  <div
                    style={{
                      background: "#F1F5F9",
                      padding: "6px 10px",
                      fontSize: "12px",
                      textAlign: "center",
                      borderTop: "1px solid #E2E8F0"
                    }}
                  >
                    ⏱ Last Update: {lastUpdateTime}
                  </div>
                )}
              </div>
            )}
            {guardianRoute.length > 1 && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "11px",
                  color: "#475569",
                  background: "#F8FAFC",
                  padding: "8px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <span>📍 Route points: {guardianRoute.length}</span>
                <span>📏 Last move: {guardianDistance.toFixed(1)} m</span>
                <span>🚗 Total travel: {(guardianTotalDistance/1000).toFixed(2)} km</span>
                <span>📍 Distance from start: {(guardianLiveDistance/1000).toFixed(2)} km</span>
              </div>
            )}
          </div>
        )}
        {dangerZoneActive && dangerCoords && (
          <div
            style={{
              background: "#FEE2E2",
              padding: "16px",
              borderRadius: "20px",
              marginBottom: "20px",
              border: "2px solid #DC2626",
              boxShadow: "0 0 20px rgba(220,38,38,0.4)",
              textAlign: "center"
            }}
          >
            <h4 style={{ color: "#B91C1C", marginBottom: "10px" }}>
              🚨 DANGER ZONE DETECTED
            </h4>

            <iframe
              title="Danger Zone Map"
              width="100%"
              height="220"
              style={{ border: "none", borderRadius: "12px" }}
              src={`https://maps.google.com/maps?q=${dangerCoords.lat},${dangerCoords.lng}&z=16&output=embed`}
            />

            <p style={{ fontSize: "12px", marginTop: "8px", color: "#7F1D1D" }}>
              You are currently inside a high‑risk area. Stay alert.
            </p>
          </div>
        )}
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
        {screenFlash && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(220,38,38,0.6)",
              zIndex: 9998,
              animation: "flash 0.4s alternate 6"
            }}
          />
        )}
        {showPinInput && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.95)",
      color: "white",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    }}
  >
    <h1 style={{ marginBottom: "20px" }}>🔐 Enter PIN to Exit Emergency</h1>

    <input
      type="password"
      value={enteredPin}
      onChange={(e) => setEnteredPin(e.target.value)}
      placeholder="Enter PIN"
      style={{
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "16px",
        textAlign: "center",
        marginBottom: "15px"
      }}
    />

    <button
      onClick={() => {
        if (enteredPin === SECRET_PIN) {
          setShowPinInput(false);
          setEnteredPin("");
          setRedAlertMode(false);
        } else {
          alert("Wrong PIN");
        }
      }}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        background: "#22c55e",
        color: "white",
        fontWeight: "bold"
      }}
    >
      Unlock
    </button>
  </div>
)}
        {capturedImage && (
  <div
    style={{
      background: "white",
      padding: "18px",
      borderRadius: "20px",
      marginBottom: "20px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
    }}
  >
    <h4 style={{ marginBottom: "12px" }}>📸 Captured Evidence</h4>
    <img
      src={capturedImage}
      alt="Captured Evidence"
      style={{
        width: "100%",
        borderRadius: "16px",
        border: "2px solid #E5E7EB"
      }}
    />
    <button
      onClick={() => {
        localStorage.removeItem("lastCapturedImage");
        setCapturedImage(null);
      }}
      style={{
        marginTop: "12px",
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#DC2626",
        color: "white",
        fontWeight: "600",
        cursor: "pointer"
      }}
    >
      Clear Evidence
    </button>
  </div>
        )}
        {/* SAFE & UNSAFE ZONES VIEW */}
<div
  style={{
    background: "white",
    padding: "18px",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    marginBottom: "20px",
    border: "1px solid rgba(91, 46, 255, 0.08)"
  }}
>
  <h4 style={{ marginBottom: "12px" }}>🗺 Saved Safe Places</h4>

  {safeZones.length === 0 ? (
    <p style={{ fontSize: "13px", color: "#6B7280" }}>No safe places saved.</p>
  ) : (
    safeZones.map((zone, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #E5E7EB",
          fontSize: "13px"
        }}
      >
        <span>🏠 {zone.name}</span>

        <a
          href={`https://www.google.com/maps?q=${zone.lat},${zone.lng}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#5B2EFF", fontWeight: "600", textDecoration: "none" }}
        >
          View Map
        </a>
      </div>
    ))
  )}

  <UnsafeZonesPanel
    unsafeZones={unsafeZones}
    UNSAFE_RADIUS={UNSAFE_RADIUS}
  />
</div>
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
      backdropFilter: "blur(10px)",
      padding: "22px 16px",
      borderRadius: "22px",
      textAlign: "center",
      cursor: "pointer",
      boxShadow: isActive
        ? `0 10px 28px rgba(91, 46, 255, 0.2)`
        : "0 6px 20px rgba(0,0,0,0.05)",
      transition: "0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: "translateY(0)",
      border: isActive ? `2px solid ${accentColor}` : `1px solid rgba(0,0,0,0.05)`,
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
      e.currentTarget.style.boxShadow = "0 16px 32px rgba(91, 46, 255, 0.25)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
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

const UnsafeZonesPanel = ({ unsafeZones }) => {
  return (
    <div style={{ marginTop: "16px" }}>
      <h4 style={{ marginBottom: "12px" }}>⚠ Unsafe Areas</h4>

      {unsafeZones.map((zone, index) => (
        <div
          key={index}
          style={{
            padding: "14px",
            marginBottom: "14px",
            borderRadius: "16px",
            border: "2px solid #FCA5A5",
            background: "#FEF2F2",
            boxShadow: "0 4px 12px rgba(220,38,38,0.15)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              fontSize: "13px"
            }}
          >
            <span style={{ color: "#DC2626", fontWeight: "700" }}>
              🚨 {zone.name}
            </span>

            <a
              href={`https://www.google.com/maps?q=${zone.lat},${zone.lng}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#DC2626",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Open Map
            </a>
          </div>

          <iframe
            title={`unsafe-${index}`}
            width="100%"
            height="170"
            style={{ border: "none", borderRadius: "12px" }}
            src={`https://maps.google.com/maps?q=${zone.lat},${zone.lng}&z=15&output=embed`}
          />

          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "#7F1D1D",
              fontWeight: "600"
            }}
          >
            AI Risk Zone — Stay Alert ⚠️
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard; 