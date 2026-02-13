// src/Components/NearbyPolice.jsx
import React, { useEffect, useState } from 'react';
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
  const navigate = useNavigate();

  useEffect(() => {
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
    }, () => alert("Could not fetch location"));
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>👮‍♀️ Nearby Police Stations</h2>
        <button onClick={() => setDarkMode(!darkMode)} className="btn btn-sm btn-outline-dark">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <button className="btn btn-secondary mb-3" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      {userLocation && (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: "300px", borderRadius: '10px', marginBottom: "1rem" }}
        >
          <TileLayer url={mapTile} />
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>You are here</Popup>
          </Marker>
          {stations.map((station, i) => (
            <Marker
              key={i}
              position={[station.lat, station.lon]}
              icon={i === 0 ? nearestIcon : policeIcon}
            >
              <Popup>
                <b>{station.name}</b><br />
                {station.address}<br />
                📍 {station.distance} km
              </Popup>
            </Marker>
          ))}
          {nearestStation && (
            <Polyline
              positions={[
                [userLocation.latitude, userLocation.longitude],
                [nearestStation.lat, nearestStation.lon]
              ]}
              pathOptions={{ color: 'red', dashArray: '5,10' }}
            />
          )}
        </MapContainer>
      )}

      {!userLocation ? (
        <p>Fetching your location...</p>
      ) : stations.length === 0 ? (
        <p>Searching for police stations...</p>
      ) : (
        <ul className="list-group">
          {stations.map((station, i) => (
            <li
              key={i}
              className={`list-group-item ${i === 0 ? 'bg-warning-subtle border-warning' : ''}`}
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