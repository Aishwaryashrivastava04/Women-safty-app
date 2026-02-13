import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Button } from "react-bootstrap";

function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    bg: darkMode ? "#0F1117" : "#F7F8FC",
    card: darkMode ? "#1A1D26" : "#ffffff",
    soft: darkMode ? "#141720" : "#F0F2F8",
    text: darkMode ? "#ffffff" : "#111827",
    sub: darkMode ? "#9CA3AF" : "#6B7280",
    primary: "#E11D48",
  };

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        minHeight: "100vh",
        color: theme.text,
        transition: "0.3s ease",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "18px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h6 style={{ margin: 0, fontWeight: "700" }}>SafeHere</h6>
        <div onClick={() => setDarkMode(!darkMode)} style={{ cursor: "pointer" }}>
          {darkMode ? "🌞" : "🌙"}
        </div>
      </div>

      <Container style={{ paddingBottom: "100px" }}>

        {/* BIG ACTIVATION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: theme.card,
            borderRadius: "28px",
            padding: "26px",
            boxShadow: darkMode
              ? "0 20px 60px rgba(0,0,0,0.6)"
              : "0 15px 40px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              backgroundColor: theme.primary,
              margin: "0 auto 15px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              color: "white",
            }}
          >
            🛡️
          </div>

          <h5 style={{ fontWeight: "700" }}>
            Activate Your Safety Network
          </h5>

          <p style={{ fontSize: "13px", color: theme.sub }}>
            Enable live tracking & emergency protection instantly.
          </p>

          <Button
            onClick={() => navigate("/register")}
            style={{
              marginTop: "10px",
              backgroundColor: theme.primary,
              border: "none",
              borderRadius: "20px",
              padding: "8px 18px",
            }}
          >
            Get Started
          </Button>
        </motion.div>

        {/* QUICK ACTIONS HORIZONTAL */}
        <h6 style={{ marginTop: "35px" }}>Quick Access</h6>

        <div
          style={{
            display: "flex",
            gap: "14px",
            overflowX: "auto",
            paddingBottom: "10px",
            marginTop: "10px",
          }}
        >
          {["Live Location", "Emergency Call", "Nearby Help", "Trusted Contacts"].map((item, i) => (
            <div
              key={i}
              style={{
                minWidth: "140px",
                backgroundColor: theme.soft,
                padding: "14px",
                borderRadius: "18px",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* FEATURE LIST */}
        <h6 style={{ marginTop: "35px" }}>Features</h6>

        {[
          "One Tap SOS Alert",
          "Real-Time Location Tracking",
          "Guardian Alert System",
          "Police & Helpline Integration",
        ].map((item, index) => (
          <div
            key={index}
            style={{
              marginTop: "12px",
              padding: "16px",
              backgroundColor: theme.card,
              borderRadius: "18px",
              boxShadow: darkMode
                ? "0 8px 25px rgba(0,0,0,0.5)"
                : "0 6px 20px rgba(0,0,0,0.05)",
            }}
          >
            {item}
          </div>
        ))}

        {/* TRUST SECTION */}
        <div
          style={{
            marginTop: "40px",
            padding: "22px",
            backgroundColor: theme.soft,
            borderRadius: "24px",
            textAlign: "center",
          }}
        >
          <h6 style={{ fontWeight: "600" }}>
            Trusted by 12,000+ Women
          </h6>
          <p style={{ fontSize: "13px", color: theme.sub }}>
            24/7 Monitoring • High Alert Accuracy
          </p>
        </div>

      </Container>
    </div>
  );
}

export default Home;