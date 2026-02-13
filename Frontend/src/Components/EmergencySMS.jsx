import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function EmergencySMS() {
  const contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];

  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('sms');
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      () => {
        alert('⚠️ Location access denied');
      }
    );
  }, []);

  const handleConfirmAction = (contact, type) => {
    setSelectedContact(contact);
    setActionType(type);
    setShowModal(true);
  };

  const performAction = () => {
    if (!selectedContact || !position) return;

    const { lat, lng } = position;
    const message = `🚨 I need help! My location: https://maps.google.com/?q=${lat},${lng}`;

    if (actionType === 'sms') {
      window.location.href = `sms:${selectedContact.phone}?body=${encodeURIComponent(message)}`;
    } else if (actionType === 'call') {
      window.location.href = `tel:${selectedContact.phone}`;
    } else if (actionType === 'whatsapp') {
      const whatsappURL = `https://wa.me/${selectedContact.phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
    }

    setShowModal(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container py-4">
      <div className="bg-white shadow rounded p-4">
        <h2 className="mb-4 fw-bold text-primary text-center">📩 Emergency SMS, Call & WhatsApp</h2>

        {contacts.length === 0 ? (
          <p className="text-danger text-center">
            🚫 No contacts found. Please add contacts from the Contacts page.
          </p>
        ) : (
          <div className="row g-4">
            {contacts.map((contact, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                      style={{ width: 50, height: 50 }}
                    >
                      <span className="fw-bold">{getInitials(contact.name)}</span>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{contact.name}</h5>
                      <p className="mb-0 text-muted">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0 d-flex flex-wrap gap-2 justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleConfirmAction(contact, 'sms')}
                      title="Send SMS"
                    >
                      📤 SMS
                    </button>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleConfirmAction(contact, 'whatsapp')}
                      title="Send via WhatsApp"
                    >
                      🟢 WhatsApp
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleConfirmAction(contact, 'call')}
                      title="Call"
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm {actionType === 'sms' ? 'SMS' : actionType === 'call' ? 'Call' : 'WhatsApp'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to{' '}
            {actionType === 'sms' ? 'send an emergency SMS to' : actionType === 'call' ? 'call' : 'send WhatsApp message to'}{' '}
            <strong>{selectedContact?.name}</strong>?
          </p>
          {position && (
            <div style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
              <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>Your current location</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'sms' ? 'primary' : actionType === 'call' ? 'danger' : 'success'}
            onClick={performAction}
          >
            Yes, {actionType === 'sms' ? 'Send SMS' : actionType === 'call' ? 'Call' : 'Send WhatsApp'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmergencySMS;