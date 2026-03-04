// src/Components/NearbyPolice.jsx
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const policeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991102.png',
  iconSize: [30, 30],
});

const nearestIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3176/3176364.png',
  iconSize: [35, 35],
});

function NearbyPolice() {
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dashOffset, setDashOffset] = useState(0);
  const [flashNearest, setFlashNearest] = useState(false);
  const [animatedPosition, setAnimatedPosition] = useState(null);
  const [routeDistance, setRouteDistance] = useState(0);
  const [flashBorder, setFlashBorder] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [nearAlertSpoken, setNearAlertSpoken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });

      const overpassQuery = `
        [out:json];
        (
          node["amenity"="police"](around:3000,${latitude},${longitude});
          way["amenity"="police"](around:3000,${latitude},${longitude});
          relation["amenity"="police"](around:3000,${latitude},${longitude});
        );
        out center;
      `;

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
      });

      const data = await response.json();

      const places = await Promise.all(
        data.elements.map(async (el) => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;
          const name = el.tags?.name || "Unnamed Station";

          const addrRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const addrData = await addrRes.json();
          const address = addrData.display_name || "";

          const dist = getDistance(latitude, longitude, lat, lon);

          return {
            name,
            address,
            distance: dist,
            lat,
            lon,
          };
        })
      );

      setStations(places.sort((a, b) => a.distance - b.distance));
      setLoading(false);
    }, () => {
      alert("Could not fetch location");
      setLoading(false);
    });
  }, []);

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  }

  const nearestStation = stations[0];
  const mapTile = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  useEffect(() => {
    const interval = setInterval(() => {
      setDashOffset(prev => (prev > 20 ? 0 : prev + 2));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!nearestStation) return;

    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance("Nearest police station located.");
      msg.rate = 1;
      window.speechSynthesis.speak(msg);
    }

    const flashInterval = setInterval(() => {
      setFlashNearest(prev => !prev);
    }, 500);

    return () => clearInterval(flashInterval);
  }, [nearestStation]);

  useEffect(() => {
    if (!userLocation || !nearestStation) return;

    let progress = 0;

    const easeInOut = (t) => {
      return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    const interval = setInterval(() => {
      progress += 0.015;
      if (progress > 1) progress = 1;

      const eased = easeInOut(progress);

      const lat = userLocation.latitude + (nearestStation.lat - userLocation.latitude) * eased;
      const lon = userLocation.longitude + (nearestStation.lon - userLocation.longitude) * eased;

      setAnimatedPosition([lat, lon]);
      setProgressValue(eased);

      if (progress === 1) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [userLocation, nearestStation]);

  useEffect(() => {
    if (!nearestStation) return;

    const originalDistance = parseFloat(nearestStation.distance);
    const remaining = (originalDistance * (1 - progressValue)).toFixed(2);
    setRouteDistance(remaining < 0 ? 0 : remaining);
  }, [progressValue, nearestStation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlashBorder(prev => !prev);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!routeDistance) return;

    if (parseFloat(routeDistance) <= 1 && !nearAlertSpoken) {
      if ("speechSynthesis" in window) {
        const msg = new SpeechSynthesisUtterance("You are very close to the police station.");
        msg.rate = 1;
        window.speechSynthesis.speak(msg);
      }
      setNearAlertSpoken(true);
    }
  }, [routeDistance, nearAlertSpoken]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👮‍♀️ Nearby Police Stations</h2>
        <div>
          <button onClick={() => setDarkMode(!darkMode)} className="btn btn-sm btn-outline-dark">
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-sm btn-outline-primary ms-2"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <button className="btn btn-secondary mb-3" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      {nearestStation && (
        <button
          className="btn btn-danger mb-3"
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate([300,150,300,150,500]);

            setTimeout(() => {
              window.location.href = "tel:100";
            }, 1000);
          }}
        >
          🚨 Call Police (Nearest)
        </button>
      )}

      {nearestStation && (
        <div style={{
          background: "#111827",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          marginBottom: "8px",
          fontWeight: "600"
        }}>
          📡 Live Route Distance: {routeDistance} km
        </div>
      )}

      {userLocation && (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={14}
          scrollWheelZoom={false}
          style={{
            height: "300px",
            borderRadius: '10px',
            marginBottom: "1rem",
            border: flashBorder ? "4px solid #DC2626" : "4px solid transparent",
            transition: "0.3s ease"
          }}
        >
          <TileLayer url={mapTile} />
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>You are here</Popup>
          </Marker>
          {animatedPosition && (
            <Marker position={animatedPosition} icon={nearestIcon}>
              <Popup>🚓 En route to nearest station</Popup>
            </Marker>
          )}
          {stations.map((station, i) => (
            <Marker
              key={i}
              position={[station.lat, station.lon]}
              icon={
                i === 0
                  ? new L.Icon({
                      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3176/3176364.png',
                      iconSize: pulse ? [45, 45] : [35, 35],
                    })
                  : policeIcon
              }
            >
              <Popup>
                <b>{station.name}</b><br />
                {station.address}<br />
                📍 <span style={{background:'#DC2626',color:'white',padding:'3px 8px',borderRadius:'20px',fontSize:'12px'}}>
                {station.distance} km
                </span>
              </Popup>
            </Marker>
          ))}
          {nearestStation && (
            <Polyline
              positions={[
                [userLocation.latitude, userLocation.longitude],
                [nearestStation.lat, nearestStation.lon]
              ]}
              pathOptions={{
                color: 'red',
                dashArray: '6,10',
                dashOffset: dashOffset
              }}
            />
          )}
        </MapContainer>
      )}

      {loading && (
        <div style={{
          background: "#FEE2E2",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "10px",
          textAlign: "center",
          fontWeight: "600",
          color: "#991B1B"
        }}>
          📡 Detecting your location and nearby stations...
        </div>
      )}

      {!loading && !userLocation ? (
        <p>Fetching your location...</p>
      ) : !loading && stations.length === 0 ? (
        <p>Searching for police stations...</p>
      ) : (
        <ul className="list-group">
          {stations.map((station, i) => (
            <li
              key={i}
              className={`list-group-item ${i === 0 ? (flashNearest ? 'bg-danger text-white border-danger shadow-lg' : 'bg-warning border-warning shadow') : ''}`}
            >
              <h5>
                👮‍♂️ {station.name}
              </h5>
              <p className="mb-1">{station.address}</p>
              <small>📍 {station.distance} km away</small><br />
              <a
                className="btn btn-sm btn-outline-primary me-2 mt-2"
                href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(100);
                }}
              >
                Get Directions
              </a>
              <a
                className="btn btn-sm btn-outline-success mt-2"
                href={`https://wa.me/?text=Police%20Station:%20${encodeURIComponent(station.name)}%0AAddress:%20${encodeURIComponent(station.address)}%0ADistance:%20${station.distance}km`}
                target="_blank"
                rel="noreferrer"
              >
                Share on WhatsApp
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NearbyPolice;