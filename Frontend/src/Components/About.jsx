import React from "react";
import { motion } from "framer-motion";
import aboutImg from "../assets/women_safety_banner.svg";

function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #6E3BFF 0%, #8E54E9 50%, #C471ED 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: "1100px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "50px",
          color: "white",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontWeight: "700", fontSize: "32px" }}>
            🔎 About SafeHere
          </h2>
          <p style={{ opacity: 0.8, marginTop: "10px" }}>
            Smart technology built to protect and empower women.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Left Content */}
          <div>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
              <li>🆘 SOS alert with real-time location sharing</li>
              <li>📩 Emergency SMS to trusted contacts</li>
              <li>📍 Live tracking with reverse geocoding</li>
              <li>📞 One-tap national helpline integration</li>
              <li>🧾 Secure profile & feedback system</li>
            </ul>

            <p style={{ marginTop: "20px", opacity: 0.9 }}>
              Our mission is to build a safer environment through innovation.
              We prioritize <strong>privacy</strong>, <strong>security</strong>,
              and <strong>instant response</strong> when it matters most.
            </p>
          </div>

          {/* Right Image */}
          <div style={{ textAlign: "center" }}>
            <img
              src={aboutImg}
              alt="Women Safety Illustration"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "16px",
              }}
            />
          </div>
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: "50px",
            paddingTop: "30px",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            textAlign: "center",
            fontStyle: "italic",
            opacity: 0.85,
          }}
        >
          <p>
            "Safety is not just a right — it’s a necessity. Technology bridges
            the gap."
          </p>
          <small>— SafeHere Team</small>
        </motion.div>

        {/* Back Button */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "12px 30px",
              borderRadius: "30px",
              border: "none",
              background:
                "linear-gradient(90deg, #FF6FD8 0%, #3813C2 100%)",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            ⬅ Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default About;