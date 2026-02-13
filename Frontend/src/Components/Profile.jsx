import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", contact: "", bio: "", instagram: "", facebook: "", twitter: "", photo: "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("username") || "";
    const email = localStorage.getItem("userEmail") || "";
    const saved = JSON.parse(localStorage.getItem("userProfile")) || {};
    setProfile({ name, email, ...saved });
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePhotoUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, photo: reader.result });
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("username", profile.name);
    localStorage.setItem("userEmail", profile.email);
    setSuccess("✅ Profile updated!");
    setTimeout(() => setSuccess(""), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)", padding: "20px", fontFamily: "'Inter', system-ui" }}>
      <div style={{ background: "linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)", color: "white", padding: "30px 20px", borderRadius: "24px", marginBottom: "30px", boxShadow: "0 10px 30px rgba(91, 46, 255, 0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>👤 My Profile</h2>
          <button onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "10px 16px", borderRadius: "12px", cursor: "pointer", fontWeight: "600" }}>← Back</button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "24px", textAlign: "center" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto 20px", background: profile.photo ? `url(${profile.photo}) center/cover` : "linear-gradient(135deg, #5B2EFF, #7C5CFF)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "48px", fontWeight: "800" }}>
            {!profile.photo && (profile.name?.[0] || "U")}
          </div>
          <label style={{ display: "inline-block", background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", boxShadow: "0 6px 16px rgba(91,46,255,0.3)" }}>
            📸 Change Photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
          </label>
        </div>

        <div style={{ background: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "700" }}>📋 Personal Information</h3>
          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>👤 Full Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: "12px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "0.2s" }} onFocus={(e) => { e.target.style.borderColor = "#5B2EFF"; e.target.style.boxShadow = "0 0 0 3px rgba(91,46,255,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>📧 Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: "12px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "0.2s" }} onFocus={(e) => { e.target.style.borderColor = "#5B2EFF"; e.target.style.boxShadow = "0 0 0 3px rgba(91,46,255,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>📱 Contact</label>
              <input type="tel" name="contact" value={profile.contact} onChange={handleChange} style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: "12px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "0.2s" }} onFocus={(e) => { e.target.style.borderColor = "#5B2EFF"; e.target.style.boxShadow = "0 0 0 3px rgba(91,46,255,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>✍️ Bio</label>
              <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Tell us about yourself..." style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: "12px", fontSize: "14px", outline: "none", minHeight: "100px", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", transition: "0.2s" }} onFocus={(e) => { e.target.style.borderColor = "#5B2EFF"; e.target.style.boxShadow = "0 0 0 3px rgba(91,46,255,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
            </div>
          </div>
        </div>

        <div style={{ background: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "700" }}>🔗 Social Links</h3>
          <div style={{ display: "grid", gap: "18px" }}>
            {[
              { name: "instagram", icon: "📷", placeholder: "https://instagram.com/username" },
              { name: "facebook", icon: "👍", placeholder: "https://facebook.com/username" },
              { name: "twitter", icon: "🐦", placeholder: "https://twitter.com/username" }
            ].map(field => (
              <div key={field.name}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>{field.icon} {field.name[0].toUpperCase() + field.name.slice(1)}</label>
                <input type="url" name={field.name} value={profile[field.name]} onChange={handleChange} placeholder={field.placeholder} style={{ width: "100%", padding: "12px 14px", border: "2px solid #E5E7EB", borderRadius: "12px", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "0.2s" }} onFocus={(e) => { e.target.style.borderColor = "#5B2EFF"; e.target.style.boxShadow = "0 0 0 3px rgba(91,46,255,0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
              </div>
            ))}
          </div>
        </div>

        {success && <div style={{ background: "#DCFCE7", color: "#15803D", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #86EFAC", fontWeight: "500" }}>{success}</div>}

        <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "12px 24px", background: "#E5E7EB", color: "#111827", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", transition: "0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#D1D5DB"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#E5E7EB"; }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: "12px 24px", background: "linear-gradient(135deg, #5B2EFF, #7C5CFF)", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", boxShadow: "0 6px 16px rgba(91,46,255,0.3)", transition: "0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(91,46,255,0.4)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(91,46,255,0.3)"; }}>💾 Save</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;