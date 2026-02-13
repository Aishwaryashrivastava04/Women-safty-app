import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BsTelephone,
  BsWhatsapp,
  BsTrash,
  BsPencilSquare,
} from 'react-icons/bs';

function QuickCall() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        const address = data.display_name || 'Unknown location';
        setLocation({ latitude, longitude, address, link });
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      },
      () => {
        alert("Location access denied.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation();
    const saved = localStorage.getItem("emergencyContacts");
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  }, []);

  const shareWhatsApp = (phone) => {
    if (!location || !phone) return;
    const message = `🚨 I'm in danger! Here's my location: ${location.link}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const broadcastWhatsApp = () => {
    if (!location || contacts.length === 0) return;
    const message = `🚨 Emergency Alert! My current location is:\n${location.link}`;
    contacts.forEach(c => {
      const url = `https://wa.me/${c.phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  };

  const shareManually = () => {
    if (!location) return;
    navigator.clipboard.writeText(location.link);
    alert("Location link copied to clipboard. You can paste and share it manually.");
  };

  const deleteContact = (index) => {
    const confirmDel = window.confirm("Remove this contact?");
    if (!confirmDel) return;
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
  };

  const editContact = (index) => {
    const name = prompt("Update name:", contacts[index].name);
    const phone = prompt("Update phone number:", contacts[index].phone);
    if (!name || !phone) return;
    const updated = [...contacts];
    updated[index] = { name, phone };
    setContacts(updated);
    localStorage.setItem("emergencyContacts", JSON.stringify(updated));
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">📲 Quick Call & Share</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          ⬅ Back
        </button>
      </div>

      <div className="card shadow border-0 p-4 bg-light rounded">
        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" />
            <p>Fetching current location…</p>
          </div>
        ) : (
          <>
            <h5 className="text-primary mb-3">📍 Your Location</h5>
            <p><strong>Address:</strong> {location.address}</p>
            <p><strong>Map Link:</strong> <a href={location.link} target="_blank" rel="noreferrer">{location.link}</a></p>
            <p><strong>Last Updated:</strong> {lastUpdated}</p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <a href="tel:112" className="btn btn-danger px-4">📞 Call Emergency (112)</a>
              <button className="btn btn-outline-primary px-4" onClick={getLocation}>🔄 Refresh Location</button>
              <button className="btn btn-outline-dark px-4" onClick={shareManually}>🔗 Copy Link to Share</button>
              <button className="btn btn-success px-4" onClick={broadcastWhatsApp}>📤 WhatsApp All</button>
            </div>

            {contacts.length > 0 && (
              <>
                <hr />
                <h5 className="mt-4">👤 Your Emergency Contacts</h5>
                <ul className="list-group mt-2">
                  {contacts.map((c, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        <strong>{c.name}</strong> <small className="text-muted">({c.phone})</small>
                      </div>
                      <div className="btn-group">
                        <a href={`tel:${c.phone}`} className="btn btn-sm btn-outline-success">
                          <BsTelephone /> Call
                        </a>
                        <button className="btn btn-sm btn-outline-success" onClick={() => shareWhatsApp(c.phone)}>
                          <BsWhatsapp /> WhatsApp
                        </button>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => editContact(idx)}>
                          <BsPencilSquare />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteContact(idx)}>
                          <BsTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default QuickCall;