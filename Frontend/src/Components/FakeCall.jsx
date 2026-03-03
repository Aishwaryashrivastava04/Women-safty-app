import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import momVoice from "../assets/mom-voice.mp3";
import ringtone from "../assets/call-tone.mp3";

function FakeCall() {
  const navigate = useNavigate();
  const ringtoneRef = useRef(null);
  const voiceRef = useRef(null);
  const [callAccepted, setCallAccepted] = useState(false);

useEffect(() => {
    if (ringtoneRef.current) {
  ringtoneRef.current.currentTime = 0;
  ringtoneRef.current.play().catch(() => {});
}
  if (navigator.vibrate) {
    navigator.vibrate([500, 300, 500, 300, 1000]);
  }

  const timer = setTimeout(() => {
    stopAll();
    navigate("/dashboard");
  }, 25000);

  return () => {
    clearTimeout(timer);
  };
}, [navigate]);

  const stopAll = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }

    if (voiceRef.current) {
      voiceRef.current.pause();
      voiceRef.current.currentTime = 0;
    }

    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  };

  const handleAccept = async () => {
  try {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }

    setCallAccepted(true);

    if (voiceRef.current) {
      voiceRef.current.currentTime = 0;
      await voiceRef.current.play();
    }
  } catch (err) {
    console.log("Voice play error:", err);
  }
};

  const handleReject = () => {
    stopAll();
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <audio ref={ringtoneRef} src={ringtone} loop autoPlay playsInline />
<audio ref={voiceRef} src={momVoice} preload="auto" playsInline />

      <div style={{ marginTop: "100px" }}>
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "#444",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "50px",
          }}
        >
          👩
        </div>

        <h2 style={{ fontSize: "30px" }}>Mom Calling...</h2>
        <p style={{ opacity: 0.7 }}>Incoming voice call</p>

        {callAccepted && (
          <p style={{ marginTop: "20px", color: "#22c55e" }}>
            💬 "Sab thik hai na beta?"
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "60px", marginBottom: "80px" }}>
        <button
          onClick={handleReject}
          style={{
            background: "#e11d48",
            borderRadius: "50%",
            width: "90px",
            height: "90px",
            border: "none",
            color: "white",
            fontSize: "20px",
          }}
        >
          ❌
        </button>

        <button
          onClick={handleAccept}
          style={{
            background: "#22c55e",
            borderRadius: "50%",
            width: "90px",
            height: "90px",
            border: "none",
            color: "white",
            fontSize: "20px",
          }}
        >
          📞
        </button>
      </div>
    </div>
  );
}

export default FakeCall;