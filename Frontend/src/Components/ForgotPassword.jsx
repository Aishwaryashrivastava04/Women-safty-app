// src/Components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong"
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backdropFilter: "blur(15px)",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          🔐 Forgot Password
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            marginBottom: "30px",
            opacity: 0.9,
          }}
        >
          Enter your registered email to reset your password
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "none",
                outline: "none",
                fontSize: "14px",
                background: "rgba(255,255,255,0.9)",
                color: "#333",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg,#ff6ec4,#7873f5)",
              color: "white",
              fontWeight: "600",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s ease",
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "13px",
                textAlign: "center",
                background: message.includes("sent")
                  ? "rgba(34,197,94,0.2)"
                  : "rgba(239,68,68,0.2)",
                border: message.includes("sent")
                  ? "1px solid #22c55e"
                  : "1px solid #ef4444",
              }}
            >
              {message}
            </div>
          )}
        </form>

        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "white",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;