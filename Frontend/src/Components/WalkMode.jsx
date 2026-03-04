import React, { useState, useEffect, useRef } from "react";

function WalkMode() {
  const [walking, setWalking] = useState(false);
  const [timer, setTimer] = useState(120);
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [guardianLink, setGuardianLink] = useState(null);
  const [dangerAlert, setDangerAlert] = useState(false);

  const maxTime = 120;
  const watchRef = useRef(null);
  const lastPosRef = useRef(null);

  // predefined danger zones
  const dangerZones = [
    { lat: 25.614688, lng: 85.025777, name: "Nargadda Area" },
    { lat: 25.635810, lng: 85.027923, name: "Danapur Cantonment" }
  ];

  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = (v) => (v * Math.PI) / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // check if inside danger zone
  const checkDangerZone = (lat, lng) => {
    for (let zone of dangerZones) {
      const d = calcDistance(lat, lng, zone.lat, zone.lng);

      if (d < 300) {
        setDangerAlert(true);
        alert(`🚨 You entered a danger zone: ${zone.name}`);
        return;
      }
    }

    setDangerAlert(false);
  };

  useEffect(() => {
    let interval;

    if (walking && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (walking && timer === 0) {
      alert("🚨 Safety check failed! Emergency alert would be sent.");
      setWalking(false);
      setTimer(maxTime);
    }

    return () => clearInterval(interval);
  }, [walking, timer]);

  // live location tracking
  useEffect(() => {
    if (!walking) return;

    if (!navigator.geolocation) return;

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setPosition({ lat: latitude, lng: longitude });

        checkDangerZone(latitude, longitude);

        // guardian live link
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setGuardianLink(link);

        if (lastPosRef.current) {
          const d = calcDistance(
            lastPosRef.current.lat,
            lastPosRef.current.lng,
            latitude,
            longitude
          );

          setDistance((prev) => prev + d);
        }

        lastPosRef.current = { lat: latitude, lng: longitude };
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchRef.current) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, [walking]);

  const startWalk = () => {
    setTimer(maxTime);
    setDistance(0);
    lastPosRef.current = null;
    setWalking(true);
  };

  const stopWalk = () => {
    setWalking(false);
    setTimer(maxTime);

    if (watchRef.current) {
      navigator.geolocation.clearWatch(watchRef.current);
    }
  };

  const progress = (timer / maxTime) * 100;

  const mapSrc = position
    ? `https://www.google.com/maps?q=${position.lat},${position.lng}&z=16&output=embed`
    : null;

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "650px",
        margin: "auto",
        background: dangerAlert ? "#fee2e2" : "white"
      }}
    >
      <h2>🚶 Walk With Me Mode</h2>

      <p style={{ color: "#555" }}>
        Safe walking companion. Your location is monitored and emergency alerts
        can trigger if safety checks fail.
      </p>

      {!walking && (
        <button
          onClick={startWalk}
          style={{
            padding: "14px 24px",
            fontSize: "16px",
            background: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          🟢 Start Safe Walk
        </button>
      )}

      {walking && (
        <div style={{ marginTop: "25px" }}>
          <h3>⏳ Safety Timer</h3>

          <div
            style={{
              height: "12px",
              background: "#e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#ef4444",
                transition: "width 1s linear"
              }}
            />
          </div>

          <p style={{ fontSize: "18px", fontWeight: "600" }}>
            {timer} seconds remaining
          </p>

          <button
            onClick={stopWalk}
            style={{
              marginTop: "10px",
              padding: "10px 18px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Stop Walk Mode
          </button>
        </div>
      )}

      {guardianLink && (
        <div
          style={{
            background: "#e0f2fe",
            padding: "12px",
            borderRadius: "10px",
            marginTop: "20px"
          }}
        >
          <strong>👨‍👩‍👧 Guardian Live Link</strong>
          <br />
          <a href={guardianLink} target="_blank" rel="noreferrer">
            Share this link with guardian
          </a>
        </div>
      )}

      {position && (
        <div style={{ marginTop: "30px" }}>
          <h3>📍 Live Location</h3>

          <div
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "15px"
            }}
          >
            <iframe
              title="walk-map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={mapSrc}
            />
          </div>

          <div
            style={{
              background: "#f1f5f9",
              padding: "12px",
              borderRadius: "10px"
            }}
          >
            <strong>Distance Walked</strong>
            <p style={{ margin: 0 }}>{(distance / 1000).toFixed(2)} km</p>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          borderRadius: "12px",
          background: "#f1f5f9"
        }}
      >
        <strong>How it works:</strong>
        <ul>
          <li>Start Safe Walk before leaving.</li>
          <li>Location updates live during walking.</li>
          <li>Guardian can track using shared link.</li>
          <li>Danger zones trigger alerts.</li>
          <li>If timer fails, emergency alert can trigger.</li>
        </ul>
      </div>
    </div>
  );
}

export default WalkMode;