import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function FakeCall() {
  const navigate = useNavigate();
  const ringtoneRef = useRef(null);

  useEffect(() => {
    // 🔊 Play ringtone
    if (ringtoneRef.current) {
      const playPromise = ringtoneRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Ringtone autoplay blocked:", err);
        });
      }
    }

    // 📳 Vibration pattern
    if (navigator.vibrate) {
      navigator.vibrate([500, 300, 500, 300, 1000]);
    }

    // ⏳ Auto close after 20 sec
    const timer = setTimeout(() => {
      stopAll();
      navigate("/dashboard");
    }, 20000);

    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [navigate]);

  const stopAll = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }

    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  };

  const handleClose = () => {
    stopAll();
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #1e1e1e, #000)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "40px 20px",
        textAlign: "center"
      }}
    >
      <audio
        ref={ringtoneRef}
        src="https://www.soundjay.com/phone/sounds/phone-ring-01a.mp3"
        loop
      />

      <div style={{ marginTop: "80px" }}>
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
            fontSize: "50px"
          }}
        >
          👩
        </div>

        <h2 style={{ fontSize: "30px", marginBottom: "10px" }}>
          Mom Calling...
        </h2>
        <p style={{ opacity: 0.7 }}>Incoming voice call</p>
      </div>

      <div style={{ display: "flex", gap: "60px", marginBottom: "80px" }}>
        <button
          onClick={handleClose}
          style={{
            background: "#e11d48",
            borderRadius: "50%",
            width: "90px",
            height: "90px",
            border: "none",
            color: "white",
            fontSize: "20px",
            boxShadow: "0 0 20px rgba(225,29,72,0.6)"
          }}
        >
          ❌
        </button>

        <button
          onClick={handleClose}
          style={{
            background: "#22c55e",
            borderRadius: "50%",
            width: "90px",
            height: "90px",
            border: "none",
            color: "white",
            fontSize: "20px",
            boxShadow: "0 0 20px rgba(34,197,94,0.6)"
          }}
        >
          📞
        </button>
      </div>
    </div>
  );
}

export default FakeCall;