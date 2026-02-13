import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import sirenSound from "../assets/siren.mp3"; // Make sure this file exists

function SOS() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [status, setStatus] = useState("");
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts");
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  const startSOS = () => {
    setTimeLeft(10);
    setIsCounting(true);
    setStatus("⏳ Preparing SOS...");
    if (audioRef.current) {
      audioRef.current.play().catch(() => {}); // try play, silently catch errors
    }
  };

  const stopSOS = () => {
    setIsCounting(false);
    setTimeLeft(0);
    setStatus("🚫 SOS Canceled.");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const sendSOS = () => {
    if (contacts.length === 0) {
      setStatus("⚠️ No emergency contacts found!");
      return;
    }

    contacts.forEach((contact) => {
      console.log(`✅ Sending SOS to ${contact.name} at ${contact.phone}`);
    });

    setStatus("✅ SOS Alert Sent to your trusted contacts!");
    setIsCounting(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isCounting && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCounting && timeLeft === 0) {
      sendSOS();
    }
  }, [timeLeft, isCounting]);

  return (
    <div className="container my-5">
      <audio ref={audioRef} src={sirenSound} loop />
      <div className="card shadow-lg border-0 p-4 rounded bg-light">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold text-danger">🚨 SOS Emergency</h2>
          <button
            className="btn btn-outline-dark"
            onClick={() => navigate("/dashboard")}
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        <p className="fs-5 text-muted">
          In case of emergency, you can alert your trusted contacts with one tap.
        </p>

        {/* SOS Buttons */}
        {!isCounting ? (
          <button
            className="btn btn-danger btn-lg w-100 my-3 fw-bold"
            onClick={startSOS}
          >
            🔴 Activate SOS Alert
          </button>
        ) : (
          <>
            <div className="text-center mb-2">
              <div className="fs-1 text-warning fw-bold">{timeLeft}</div>
              <div className="text-warning">Sending SOS in...</div>
            </div>
            <button
              className="btn btn-outline-dark btn-lg w-100 mb-3"
              onClick={stopSOS}
            >
              🛑 Cancel SOS
            </button>
          </>
        )}

        {/* Status Display */}
        {status && (
          <div
            className={`alert text-center ${
              status.includes("✅")
                ? "alert-success"
                : status.includes("⚠️")
                ? "alert-warning"
                : "alert-danger"
            }`}
          >
            {status}
          </div>
        )}

        {/* Contacts List */}
        <div className="mt-4">
          <h5 className="fw-bold mb-2">📇 Emergency Contacts</h5>
          {contacts.length === 0 ? (
            <p className="text-danger">No emergency contacts found.</p>
          ) : (
            <ul className="list-group">
              {contacts.map((c, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-person-fill text-primary me-2" />
                    <strong>{c.name}</strong>
                  </span>
                  <span>{c.phone}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/contacts")}
          >
            ➕ Manage Contacts
          </button>
        </div>
      </div>
    </div>
  );
}

export default SOS;