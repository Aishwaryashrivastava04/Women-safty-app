import React, { useEffect, useState, useRef } from "react";

function GuardianMonitor() {
  const [position, setPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [distance, setDistance] = useState(0);
  const watchIdRef = useRef(null);

  // calculate distance between two coordinates (meters)
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

  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setPosition({ lat: latitude, lng: longitude });

        setPath((prev) => {
          const updated = [...prev, { lat: latitude, lng: longitude }];

          if (updated.length > 1) {
            const last = updated[updated.length - 2];
            const d = calcDistance(
              last.lat,
              last.lng,
              latitude,
              longitude
            );

            setDistance((prevDist) => prevDist + d);
          }

          return updated;
        });
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const mapSrc = position
    ? `https://www.google.com/maps?q=${position.lat},${position.lng}&z=16&output=embed`
    : null;

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h2>🛰 Guardian Live Monitoring</h2>

      <p>
        This page shares your real-time location with your guardian. The marker
        updates as you move.
      </p>

      {position ? (
        <>
          <div
            style={{
              width: "100%",
              height: "350px",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "20px"
            }}
          >
            <iframe
              title="live-map"
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
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          >
            <strong>📍 Current Location</strong>
            <p style={{ margin: 0 }}>
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
          </div>

          <div
            style={{
              background: "#e0f2fe",
              padding: "15px",
              borderRadius: "10px"
            }}
          >
            <strong>📏 Distance Travelled</strong>
            <p style={{ margin: 0 }}>
              {(distance / 1000).toFixed(2)} km
            </p>
          </div>
        </>
      ) : (
        <p>📡 Getting your location...</p>
      )}
    </div>
  );
}

export default GuardianMonitor;