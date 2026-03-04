import React, { useEffect, useRef, useState } from "react";

function GuardianMonitor() {
  const [position, setPosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [distanceFromHome, setDistanceFromHome] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [route, setRoute] = useState([]);
  const [guardianLink, setGuardianLink] = useState(null);
  const [dangerZone, setDangerZone] = useState(null);

  const watchRef = useRef(null);
  const lastPosRef = useRef(null);

  // Home location
  const HOME = { lat: 25.624614, lng: 85.057381 };

  // Danger zones
  const dangerZones = [
    { lat: 25.614688, lng: 85.025777, name: "Nargadda Danger Zone" },
    { lat: 25.63581, lng: 85.027923, name: "Danapur Cantonment Danger Zone" }
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

  const checkDangerZone = (lat, lng) => {
    for (let zone of dangerZones) {
      const d = calcDistance(lat, lng, zone.lat, zone.lng);

      if (d < 300) {
        setDangerZone(zone.name);
        return;
      }
    }

    setDangerZone(null);
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const newPos = { lat: latitude, lng: longitude };

        setPosition(newPos);
        setLastUpdate(new Date().toLocaleTimeString());

        setRoute((prev) => [...prev.slice(-20), newPos]);

        // guardian share link
        setGuardianLink(
          `https://www.google.com/maps?q=${latitude},${longitude}`
        );

        checkDangerZone(latitude, longitude);

        // distance from home
        const homeDist = calcDistance(
          HOME.lat,
          HOME.lng,
          latitude,
          longitude
        );

        setDistanceFromHome(homeDist);

        if (lastPosRef.current) {
          const d = calcDistance(
            lastPosRef.current.lat,
            lastPosRef.current.lng,
            latitude,
            longitude
          );

          setDistance((prev) => prev + d);
        }

        lastPosRef.current = newPos;
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchRef.current) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, []);

  const mapSrc = position
    ? `https://www.google.com/maps?q=${position.lat},${position.lng}&z=16&output=embed`
    : null;

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "750px",
        margin: "auto",
        fontFamily: "sans-serif",
        background: dangerZone ? "#fee2e2" : "white"
      }}
    >
      <h2>🛰 Guardian Live Monitoring</h2>

      <p style={{ color: "#555" }}>
        Live tracking system similar to ride-sharing apps.
      </p>

      {dangerZone && (
        <div
          style={{
            background: "#ef4444",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px"
          }}
        >
          🚨 Entered Danger Zone: {dangerZone}
        </div>
      )}

      {guardianLink && (
        <div
          style={{
            background: "#e0f2fe",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px"
          }}
        >
          👨‍👩‍👧 Guardian Share Link
          <br />
          <a href={guardianLink} target="_blank" rel="noreferrer">
            {guardianLink}
          </a>
        </div>
      )}

      {position && (
        <div>
          <div
            style={{
              width: "100%",
              height: "350px",
              borderRadius: "14px",
              overflow: "hidden",
              border: "2px solid #e5e7eb",
              marginBottom: "15px"
            }}
          >
            <iframe
              title="guardian-map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={mapSrc}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "15px"
            }}
          >
            <div
              style={{
                background: "#f1f5f9",
                padding: "12px",
                borderRadius: "10px"
              }}
            >
              <strong>📏 Travelled</strong>
              <p style={{ margin: 0 }}>{(distance / 1000).toFixed(2)} km</p>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                padding: "12px",
                borderRadius: "10px"
              }}
            >
              <strong>🏠 Distance From Home</strong>
              <p style={{ margin: 0 }}>
                {(distanceFromHome / 1000).toFixed(2)} km
              </p>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                padding: "12px",
                borderRadius: "10px"
              }}
            >
              <strong>⏱ Last Update</strong>
              <p style={{ margin: 0 }}>{lastUpdate}</p>
            </div>
          </div>
        </div>
      )}

      {!position && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f1f5f9",
            borderRadius: "10px"
          }}
        >
          Waiting for live location...
        </div>
      )}

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          borderRadius: "10px",
          background: "#eef2ff"
        }}
      >
        <strong>System Features</strong>
        <ul>
          <li>🚗 Moving marker (live location updates)</li>
          <li>📍 Route tracking</li>
          <li>📏 Distance from home calculation</li>
          <li>🚨 Danger zone detection</li>
          <li>👨‍👩‍👧 Guardian live link</li>
        </ul>
      </div>
    </div>
  );
}

export default GuardianMonitor;