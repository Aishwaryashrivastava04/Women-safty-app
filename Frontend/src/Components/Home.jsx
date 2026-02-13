import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#0F172A" : "#FFFFFF",
        minHeight: "100vh",
        color: darkMode ? "#F1F5F9" : "#111827",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        transition: "0.3s ease",
      }}
    >
      {/* PROFESSIONAL HEADER */}
      <div
        style={{
          background: darkMode
            ? "rgba(15, 23, 42, 0.95)"
            : "linear-gradient(135deg, #FFFFFF, #F8FAFF)",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: darkMode ? "1px solid #334155" : "1px solid #E5E7EB",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 style={{ margin: 0, fontWeight: "800", fontSize: "24px" }}>
          🛡️ SafeHere
        </h3>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              border: "none",
              background: "none",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)",
                color: "white",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: `1px solid ${darkMode ? "#475569" : "#E5E7EB"}`,
                  background: "transparent",
                  color: darkMode ? "#F1F5F9" : "#111827",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* HERO SECTION */}
      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
          background: darkMode
            ? "linear-gradient(135deg, #1E293B, #0F172A)"
            : "linear-gradient(135deg, #EDE9FE, #F8F6FF)",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "42px",
            fontWeight: "800",
            marginBottom: "16px",
            lineHeight: "1.2",
            background: "linear-gradient(135deg, #5B2EFF, #E11D48)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Stay Safe, Always.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "16px",
            color: darkMode ? "#94A3B8" : "#6B7280",
            marginBottom: "28px",
            maxWidth: "500px",
            margin: "0 auto 28px auto",
          }}
        >
          Real-time location tracking, instant SOS alerts, and 24/7 emergency support at your fingertips.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: "flex", gap: "12px", justifyContent: "center" }}
        >
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "14px 32px",
              borderRadius: "18px",
              border: "none",
              background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)",
              color: "white",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(91, 46, 255, 0.3)",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(91, 46, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(91, 46, 255, 0.3)";
            }}
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 32px",
              borderRadius: "18px",
              border: `2px solid ${darkMode ? "#475569" : "#E5E7EB"}`,
              background: "transparent",
              color: darkMode ? "#F1F5F9" : "#111827",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? "#1E293B" : "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Login
          </button>
        </motion.div>
      </div>

      {/* STATS SECTION */}
      <div
        style={{
          padding: "40px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {[
          { label: "12K+", desc: "Users Protected" },
          { label: "99%", desc: "Alert Success" },
          { label: "24/7", desc: "Monitoring" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              textAlign: "center",
              padding: "20px",
              background: darkMode ? "#1E293B" : "#F9FAFB",
              borderRadius: "18px",
              border: darkMode ? "1px solid #334155" : "1px solid #E5E7EB",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "28px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #5B2EFF, #E11D48)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.label}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: darkMode ? "#94A3B8" : "#6B7280",
              }}
            >
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* FEATURES SECTION */}
      <div
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "12px",
          }}
        >
          Powerful Features
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "16px",
            color: darkMode ? "#94A3B8" : "#6B7280",
            marginBottom: "40px",
          }}
        >
          Everything you need to stay safe and protected
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              icon: "🚨",
              title: "One-Tap SOS",
              desc: "Instantly alert trusted contacts and emergency services with a single tap",
            },
            {
              icon: "📍",
              title: "Live Location Tracking",
              desc: "Share your real-time location with emergency contacts securely",
            },
            {
              icon: "📞",
              title: "Direct Police Call",
              desc: "Connect with local police authorities instantly with one click",
            },
            {
              icon: "👥",
              title: "Trusted Contacts",
              desc: "Add and manage your emergency contact list easily",
            },
            {
              icon: "🗺️",
              title: "Nearby Safe Zones",
              desc: "Find nearby police stations and safe spaces in real-time",
            },
            {
              icon: "🔔",
              title: "Smart Alerts",
              desc: "Get intelligent safety alerts based on location and time",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              style={{
                padding: "28px",
                borderRadius: "20px",
                background: darkMode ? "#1E293B" : "#FFFFFF",
                border: darkMode ? "1px solid #334155" : "1px solid #E5E7EB",
                boxShadow: darkMode
                  ? "0 8px 20px rgba(0,0,0,0.3)"
                  : "0 6px 20px rgba(0,0,0,0.05)",
                transition: "0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = darkMode
                  ? "0 12px 30px rgba(91, 46, 255, 0.2)"
                  : "0 12px 30px rgba(91, 46, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = darkMode
                  ? "0 8px 20px rgba(0,0,0,0.3)"
                  : "0 6px 20px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {feature.icon}
              </div>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700" }}>
                {feature.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: darkMode ? "#94A3B8" : "#6B7280",
                  lineHeight: "1.6",
                }}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* HELPLINE SECTION */}
      <div
        style={{
          padding: "40px 20px",
          background: darkMode
            ? "linear-gradient(135deg, #1E293B, #0F172A)"
            : "linear-gradient(135deg, #EDE9FE, #F3E8FF)",
          marginTop: "40px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "28px",
              fontWeight: "800",
              marginBottom: "12px",
            }}
          >
            Emergency Helplines
          </h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: darkMode ? "#94A3B8" : "#6B7280",
              marginBottom: "30px",
            }}
          >
            Available 24/7 for immediate assistance
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              { label: "📞 Police", number: "100" },
              { label: "🚑 Ambulance", number: "108" },
              { label: "👩 Women Helpline", number: "181" },
              { label: "🌐 Cyber Help", number: "1930" },
            ].map((help, i) => (
              <div
                key={i}
                style={{
                  padding: "20px",
                  background: darkMode
                    ? "rgba(30, 41, 59, 0.5)"
                    : "rgba(255, 255, 255, 0.5)",
                  borderRadius: "16px",
                  border: darkMode ? "1px solid #334155" : "1px solid #E5E7EB",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                  {help.label}
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#E11D48",
                  }}
                >
                  {help.number}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div
        style={{
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "32px",
            fontWeight: "800",
            marginBottom: "16px",
          }}
        >
          Your Safety is Our Priority
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "16px",
            color: darkMode ? "#94A3B8" : "#6B7280",
            marginBottom: "28px",
            maxWidth: "500px",
            margin: "0 auto 28px auto",
          }}
        >
          Join thousands of women who trust SafeHere for their safety. Start protecting yourself today.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={() => navigate("/register")}
          style={{
            padding: "16px 40px",
            borderRadius: "18px",
            border: "none",
            background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)",
            color: "white",
            fontWeight: "700",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(91, 46, 255, 0.3)",
            transition: "0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(91, 46, 255, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(91, 46, 255, 0.3)";
          }}
        >
          Start Free Trial
        </motion.button>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          padding: "30px 20px",
          background: darkMode
            ? "#0F172A"
            : "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
          borderTop: darkMode ? "1px solid #334155" : "1px solid #E5E7EB",
          textAlign: "center",
          color: darkMode ? "#94A3B8" : "#6B7280",
          fontSize: "13px",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          © 2026 SafeHere • Women Safety Platform
        </p>
        <p style={{ margin: 0, fontSize: "12px" }}>
          Privacy • Terms • Contact
        </p>
      </footer>
    </div>
  );
}

export default Home;