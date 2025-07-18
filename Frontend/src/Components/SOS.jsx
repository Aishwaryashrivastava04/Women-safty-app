import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SOS() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [status, setStatus] = useState("");
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedContacts = localStorage.getItem("emergencyContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const startSOS = () => {
    setTimeLeft(10);
    setIsCounting(true);
    setStatus("");
  };

  const stopSOS = () => {
    setIsCounting(false);
    setTimeLeft(0);
    setStatus("🚫 SOS Canceled.");
  };

  const sendSOS = () => {
    if (contacts.length === 0) {
      setStatus("⚠️ No emergency contacts found!");
      return;
    }

    contacts.forEach((contact) => {
      console.log(`Sending SOS to ${contact.name} at ${contact.phone}`);
    });

    setStatus("✅ SOS Alert Sent to your trusted contacts!");
    setIsCounting(false);
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
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>🚨 SOS Alert</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/dashboard")}
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        <p className="lead">
          Tap the button below to send an emergency alert to your trusted
          contacts.
        </p>

        {!isCounting ? (
          <button className="btn btn-danger btn-lg w-100 my-3" onClick={startSOS}>
            🔴 Send SOS
          </button>
        ) : (
          <>
            <p className="text-warning fs-5 text-center">
              ⏳ Sending SOS in {timeLeft} seconds...
            </p>
            <button
              className="btn btn-outline-dark btn-lg w-100 my-3"
              onClick={stopSOS}
            >
              🛑 Stop SOS
            </button>
          </>
        )}

        {status && (
          <div
            className={`alert ${
              status.includes("✅")
                ? "alert-success"
                : status.includes("⚠️")
                ? "alert-warning"
                : "alert-danger"
            } text-center`}
          >
            {status}
          </div>
        )}

        <div className="mt-4">
          <h4>📇 Emergency Contacts</h4>
          {contacts.length === 0 ? (
            <p className="text-danger">No contacts saved.</p>
          ) : (
            <ul className="list-group mt-2">
              {contacts.map((c, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between">
                  <span>
                    <strong>{c.name}</strong>
                  </span>
                  <span>{c.phone}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SOS;