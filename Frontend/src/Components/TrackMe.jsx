import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Button,
  Modal,
  Toast,
  ToastContainer,
  Form,
  Card,
} from "react-bootstrap";

function TrackMe() {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const applyTileLayer = () => {
    L.tileLayer(
      darkTheme
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "&copy; OpenStreetMap contributors" }
    ).addTo(mapRef.current);
  };

  useEffect(() => {
    const container = document.getElementById("map");
    if (container && !mapRef.current) {
      mapRef.current = L.map(container).setView([0, 0], 15);
      applyTileLayer();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const updateLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const newLoc = [latitude, longitude];

      L.marker(newLoc).addTo(mapRef.current);

      if (locations.length > 0) {
        const path = [locations[locations.length - 1], newLoc];
        L.polyline(path, { color: "blue" }).addTo(mapRef.current);
      }

      mapRef.current.setView(newLoc);
      setLocations((prev) => [...prev, newLoc]);
    });
  };

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(updateLocation, 5000);
    return () => clearInterval(timer);
  }, [autoRefresh, locations]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.eachLayer((layer) => mapRef.current.removeLayer(layer));
    applyTileLayer();

    locations.forEach((loc, i) => {
      L.marker(loc).addTo(mapRef.current);
      if (i > 0) {
        L.polyline([locations[i - 1], loc], { color: "blue" }).addTo(mapRef.current);
      }
    });
  }, [darkTheme]);

  const handleSendSMS = () => setShowModal(true);

  const confirmSendSMS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const msg = encodeURIComponent(`⚠️ Help! Here's my location: ${link}`);

      const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
      const phones = contacts.map((c) => c.phone).filter(Boolean);

      if (phones.length === 0) return alert("No emergency contacts saved.");
      window.location.href = `sms:${phones.join(",")}?body=${msg}`;
      setToastMsg("Location sent via SMS.");
      setShowToast(true);
    });

    setShowModal(false);
  };

  const shareViaWhatsApp = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const message = `⚠️ Help! Here's my location: ${link}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    });
  };

  return (
    <div className="container py-5">
      <Card className="p-4 shadow-lg border-0" style={{ background: "#fff6f8", borderRadius: "16px" }}>
        <h2 className="text-center text-danger fw-bold mb-4">📍 Real-Time Location Tracker</h2>

        <div className="d-flex justify-content-center flex-wrap gap-3 mb-3">
          <Button variant="primary" onClick={updateLocation}>
            📡 Update Location
          </Button>
          <Button variant="danger" onClick={handleSendSMS}>
            📩 Send Location via SMS
          </Button>
          <Button variant="success" onClick={shareViaWhatsApp}>
            💬 Share via WhatsApp
          </Button>
        </div>

        <Form.Check
          type="switch"
          label="Auto-Refresh Location"
          checked={autoRefresh}
          onChange={() => setAutoRefresh(!autoRefresh)}
          className="mb-2"
        />

        <Form.Check
          type="switch"
          label="Dark Theme Map"
          checked={darkTheme}
          onChange={() => setDarkTheme(!darkTheme)}
          className="mb-4"
        />

        <div
          id="map"
          className="mb-4 shadow-sm"
          style={{ height: "400px", borderRadius: "12px" }}
        />

        <Card className="bg-white border-0 shadow-sm p-3">
          <Card.Body>
            <h5 className="fw-bold">📌 Location History</h5>
            <ol className="list-group list-group-numbered mt-2">
              {locations.map(([lat, lng], i) => (
                <li key={i} className="list-group-item">
                  Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
                </li>
              ))}
            </ol>
          </Card.Body>
        </Card>
      </Card>

      {/* Modal Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Emergency SMS</Modal.Title>
        </Modal.Header>
        <Modal.Body>Send your current location to emergency contacts?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmSendSMS}>
            Send Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Message */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default TrackMe;