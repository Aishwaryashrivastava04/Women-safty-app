import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";

function TrackMe() {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  // Add/remove tile layers based on dark theme toggle
  const applyTileLayer = () => {
    L.tileLayer(
      darkTheme
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    ).addTo(mapRef.current);
  };

  // Create the map after DOM is ready
  useEffect(() => {
    const mapContainer = document.getElementById("map");

    if (mapContainer && !mapRef.current) {
      mapRef.current = L.map(mapContainer).setView([0, 0], 15);
      applyTileLayer();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle location updates
  const updateLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const newLocation = [latitude, longitude];

      // Add marker
      L.marker(newLocation).addTo(mapRef.current);

      // Draw path if there's previous location
      if (locations.length > 0) {
        const path = [locations[locations.length - 1], newLocation];
        L.polyline(path, { color: "blue" }).addTo(mapRef.current);
      }

      // Update map and history
      mapRef.current.setView(newLocation);
      setLocations((prev) => [...prev, newLocation]);
    });
  };

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(updateLocation, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, locations]);

  // Update tile layer when dark theme changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.eachLayer((layer) => mapRef.current.removeLayer(layer));
    applyTileLayer();
  }, [darkTheme]);

  const handleSendSMS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const msg = encodeURIComponent(`⚠️ Help! Here's my location: ${link}`);

      const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
      const phones = contacts.map((c) => c.phone).filter(Boolean);

      if (phones.length === 0) return alert("No emergency contacts saved.");
      window.location.href = `sms:${phones.join(",")}?body=${msg}`;
    });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">📍 Track Me</h2>

      <div className="d-flex justify-content-center gap-3 mb-3">
        <button className="btn btn-primary" onClick={updateLocation}>📡 Update Location</button>
        <button className="btn btn-danger" onClick={handleSendSMS}>📩 Send Location via SMS</button>
      </div>

      <div className="form-check form-switch mb-3 d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={autoRefresh}
          onChange={() => setAutoRefresh(!autoRefresh)}
          id="autoRefreshToggle"
        />
        <label htmlFor="autoRefreshToggle" className="form-check-label">
          Auto-Refresh Location
        </label>
      </div>

      <div className="form-check form-switch mb-4 d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={darkTheme}
          onChange={() => setDarkTheme(!darkTheme)}
          id="darkThemeToggle"
        />
        <label htmlFor="darkThemeToggle" className="form-check-label">
          Dark Theme Map
        </label>
      </div>

      <div
        id="map"
        className="mb-4 shadow"
        style={{ height: "400px", width: "100%", borderRadius: "12px" }}
      ></div>

      <div className="bg-light p-3 rounded shadow">
        <h5>📌 Location History</h5>
        <ol className="list-group list-group-numbered mt-2">
          {locations.map(([lat, lng], i) => (
            <li key={i} className="list-group-item">
              Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default TrackMe;
