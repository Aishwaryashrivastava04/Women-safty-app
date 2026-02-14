// src/Components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = ({ target }) => {
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        formData
      );

      const token = response.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #EDE9FE 0%, #F3E8FF 50%, #E0E7FF 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* CONTAINER */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "800",
              margin: "0 0 8px 0",
              background: "linear-gradient(135deg, #5B2EFF, #E11D48)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🛡️ SafeHere
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Your Safety, Our Priority
          </p>
        </div>

        {/* FORM CARD */}
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "28px",
            boxShadow: "0 20px 60px rgba(91, 46, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.7)",
          }}
        >
          <h3 style={{ fontWeight: "700", marginBottom: "8px", fontSize: "22px" }}>
            Welcome Back 👋
          </h3>
          <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "28px" }}>
            Login to continue your safety journey
          </p>

          <form onSubmit={handleLogin} style={{ marginTop: "0" }}>
            {/* EMAIL */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#111827",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                📧 Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "2px solid #E5E7EB",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#5B2EFF";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(91, 46, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#111827",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                🔐 Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px 14px 16px",
                    borderRadius: "14px",
                    border: "2px solid #E5E7EB",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "0.3s ease",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#5B2EFF";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(91, 46, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "4px 8px",
                  }}
                >
                  {showPass ? "👁️" : "👁️‍🗨️"}

                </button>
              </div>
              {/* FORGOT PASSWORD */}
<div
  style={{
    textAlign: "right",
    marginBottom: "20px",
  }}
>
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    style={{
      background: "none",
      border: "none",
      color: "#5B2EFF",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      padding: 0,
      textDecoration: "underline",
    }}
  >
    Forgot Password?
  </button>
</div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                style={{
                  background: "#FEE2E2",
                  color: "#991B1B",
                  padding: "14px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  marginBottom: "20px",
                  border: "1px solid #FCA5A5",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: loading
                  ? "linear-gradient(135deg, #7C5CFF, #9370FF)"
                  : "linear-gradient(135deg, #5B2EFF, #7C5CFF)",
                color: "white",
                fontWeight: "700",
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
                boxShadow: "0 8px 20px rgba(91, 46, 255, 0.3)",
                transition: "0.3s ease",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(91, 46, 255, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(91, 46, 255, 0.3)";
              }}
            >
              {loading ? "🔄 Logging in..." : "Login"}
            </button>

            {/* REGISTER LINK */}
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#5B2EFF",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "14px",
                  padding: "0",
                  textDecoration: "underline",
                }}
              >
                Register Now
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "12px",
            color: "#6B7280",
          }}
        >
          <p style={{ margin: 0, marginBottom: "4px" }}>
            Need help? Contact us at support@safehere.com
          </p>
          <p style={{ margin: 0 }}>© 2026 SafeHere • Your Safety Matters</p>
        </div>
      </div>
    </div>
  );
}

export default Login;