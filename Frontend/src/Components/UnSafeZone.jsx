import React, { useEffect, useState } from "react";

function UnSafeZone() {
  const [position, setPosition] = useState(null);
  const [nearZone, setNearZone] = useState(null);
  const [distance, setDistance] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [riskHistory, setRiskHistory] = useState([]);
  const [prevPosition, setPrevPosition] = useState(null);
  const [enteredZone, setEnteredZone] = useState(false);

  // predefined unsafe zones
  const unsafeZones = [
    {
      name: "Danapur Naubatpur Rd",
      lat: 25.614688,
      lng: 85.025777
    },
    {
      name: "Danapur Cantonment",
      lat: 25.63581,
      lng: 85.027923
    },
    {
      name: "Rupaspur Area",
      lat: 25.6159,
      lng: 85.0823
    },
    {
      name: "Danapur Station Road",
      lat: 25.6102,
      lng: 85.0415
    }
  ];

  // distance calculation
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

  // watch user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setPosition({ lat: latitude, lng: longitude });
        setPrevPosition((p) => ({ lat: latitude, lng: longitude }));

        let foundZone = null;
        let foundDistance = null;

        unsafeZones.forEach((zone) => {
          const d = calcDistance(latitude, longitude, zone.lat, zone.lng);

          if (d < 300) {
            foundZone = zone.name;
            foundDistance = d;

            setRiskScore((prev) => {
              const newScore = prev + 10;
              setRiskHistory((h) => [...h.slice(-9), newScore]);
              return newScore;
            });

            if (!enteredZone) {
              setEnteredZone(true);

              navigator.geolocation.getCurrentPosition((p) => {
                const { latitude, longitude } = p.coords;
                const msg = encodeURIComponent(
                  `🚨 Danger zone detected. My location: https://maps.google.com/?q=${latitude},${longitude}`
                );

                window.location.href = `sms:?body=${msg}`;
              });
            }
          }
        });

        setNearZone(foundZone);
        setDistance(foundDistance);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  const keyframeStyles = `
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
      50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.4; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
    }

    @keyframes flash {
      0% { background: #fee2e2; }
      50% { background: #ef4444; }
      100% { background: #fee2e2; }
    }
  `;

  return (
    <div
      style={{
        padding: "25px",
        fontFamily: "sans-serif",
        background: nearZone ? "#fee2e2" : "white",
        animation: nearZone ? "flash 1s infinite" : "none",
        minHeight: "100vh"
      }}
    >
      <style>{keyframeStyles}</style>
      <h2>⚠ Unsafe Zone Monitor</h2>

      <p style={{ color: "#555" }}>
        The system detects dangerous areas near your location.
      </p>

      {nearZone && (
        <div
          style={{
            background: "#ef4444",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "15px",
            fontWeight: "700"
          }}
        >
          🚨 You are near a danger zone: {nearZone}
          <br />
          Distance: {distance && (distance / 1000).toFixed(2)} km
        </div>
      )}

      {distance && (
        <p style={{ fontWeight: "600", color: "#b91c1c" }}>
          📍 Live Distance to danger: {(distance / 1000).toFixed(3)} km
        </p>
      )}

      <p style={{ marginTop: "5px", fontWeight: "700" }}>
        🧠 AI Risk Score: {riskScore}
      </p>
      <div style={{ marginTop: "10px", display: "flex", gap: "3px", height: "40px" }}>
        {riskHistory.length === 0 ? (
          <span style={{ fontSize: "12px", color: "#666" }}>No risk events</span>
        ) : (
          riskHistory.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: "red",
                height: `${Math.min(v,100) / 2}px`,
                alignSelf: "flex-end",
                borderRadius: "2px"
              }}
            />
          ))
        )}
      </div>

      {position && (
        <div
          style={{
            width: "100%",
            height: "350px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #e5e7eb",
            marginBottom: "20px",
            position: "relative"
          }}
        >

          {/* Google Map */}
          <iframe
            title="unsafe-map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${position.lat},${position.lng}&z=15&output=embed`}
          />

          {/* USER MARKER */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "blue",
              transform: "translate(-50%, -50%)",
              transition: "all 0.8s ease"
            }}
          />

          {/* DANGER MARKERS */}
          {unsafeZones.map((z, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${40 + i * 5}%`,
                left: `${45 + i * 4}%`,
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "red",
                boxShadow: "0 0 10px red"
              }}
            />
          ))}

          {/* 300m danger radius visual */}
          {nearZone && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "220px",
                height: "220px",
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                border: "4px solid red",
                background: "rgba(255,0,0,0.15)",
                animation: "pulse 1.2s infinite"
              }}
            />
          )}

        </div>
      )}

      <h3>Known Unsafe Areas</h3>

      {unsafeZones.map((zone, index) => (
        <div
          key={index}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "2px solid #FCA5A5",
            background: "#FEF2F2",
            marginBottom: "12px"
          }}
        >
          <strong>🚨 {zone.name}</strong>

          <iframe
            title={`zone-${index}`}
            width="100%"
            height="150"
            style={{ border: "none", borderRadius: "10px", marginTop: "8px" }}
            src={`https://maps.google.com/maps?q=${zone.lat},${zone.lng}&z=15&output=embed`}
          />
        </div>
      ))}
    </div>
  );
}

export default UnSafeZone;