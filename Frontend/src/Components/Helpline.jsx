import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const helplineCategories = [
  {
    category: "🚨 Emergency",
    helplines: [
      { name: "National Emergency", number: "112", description: "All-purpose emergency" },
      { name: "Police Emergency", number: "100", description: "Crime & safety" }
    ]
  },
  {
    category: "👩‍⚕️ Women Safety",
    helplines: [
      { name: "Women Helpline India", number: "1091", description: "24/7 Women's helpline" },
      { name: "Domestic Violence (AHOTLINE)", number: "181", description: "Family violence support" },
      { name: "Women's SOS", number: "1800-180-1111", description: "Harassment & abuse" }
    ]
  },
  {
    category: "🏥 Health & Welfare",
    helplines: [
      { name: "Maternal Healthcare", number: "1553", description: "Pregnancy & maternal care" },
      { name: "Mental Health", number: "9152987821", description: "AASM Mental Health" },
      { name: "Medical Emergency", number: "102", description: "Ambulance services" }
    ]
  },
  {
    category: "👧 Child & Youth",
    helplines: [
      { name: "Child Helpline", number: "1098", description: "Child abuse & welfare" },
      { name: "Missing Child", number: "1639 (CHILDLINE)", description: "Report missing children" }
    ]
  }
];

function Helpline() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number);
    setCopied(number);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F5F7FF 0%, #F0F4FF 100%)", padding: "20px", fontFamily: "'Inter', system-ui" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #DC2626 0%, #E73C0E 100%)", color: "white", padding: "35px 25px", borderRadius: "24px", marginBottom: "35px", boxShadow: "0 12px 35px rgba(220, 38, 38, 0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "900" }}>🆘 Emergency Helplines</h1>
            <p style={{ margin: 0, fontSize: "15px", opacity: 0.95 }}>Critical contacts available 24/7 for immediate assistance</p>
          </div>
          <button 
            onClick={() => navigate("/dashboard")} 
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "11px 22px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {helplineCategories.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "40px" }}>
            {/* Category Title */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1F2937", margin: "0 0 20px 0", paddingBottom: "12px", borderBottom: "3px solid #DC2626" }}>
              {cat.category}
            </h2>

            {/* Helplines Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {cat.helplines.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "18px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                    border: "1px solid #E5E7EB",
                    transition: "0.3s ease",
                    transform: "translateY(0)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(220, 38, 38, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Name & Description */}
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "17px", fontWeight: "800", color: "#111827" }}>
                    {line.name}
                  </h3>
                  <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#6B7280" }}>
                    {line.description}
                  </p>

                  {/* Phone Number */}
                  <div style={{ background: "#F9FAFB", padding: "16px", borderRadius: "12px", marginBottom: "16px", border: "1px solid #E5E7EB" }}>
                    <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px", fontWeight: "600" }}>
                      Phone Number
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: "#DC2626", fontFamily: "monospace" }}>
                      {line.number}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    {/* Call Button */}
                    <a
                      href={`tel:${line.number}`}
                      style={{
                        flex: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                        color: "white",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontWeight: "700",
                        fontSize: "14px",
                        boxShadow: "0 6px 16px rgba(220, 38, 38, 0.3)",
                        transition: "0.2s",
                        border: "none",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 10px 24px rgba(220, 38, 38, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.3)";
                      }}
                    >
                      📞 Call Now
                    </a>

                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(line.number)}
                      style={{
                        flex: 0.8,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: copied === line.number ? "#10B981" : "#F3F4F6",
                        color: copied === line.number ? "white" : "#374151",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        fontSize: "14px",
                        border: "1px solid #E5E7EB",
                        cursor: "pointer",
                        transition: "0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (copied !== line.number) {
                          e.currentTarget.style.background = "#E5E7EB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (copied !== line.number) {
                          e.currentTarget.style.background = "#F3F4F6";
                        }
                      }}
                    >
                      {copied === line.number ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Info Banner */}
        <div style={{ background: "#FEF3C7", color: "#92400E", padding: "24px", borderRadius: "16px", marginTop: "40px", border: "2px solid #FCD34D" }}>
          <div style={{ fontWeight: "800", marginBottom: "10px", fontSize: "16px" }}>💡 Important Information</div>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", lineHeight: "1.8" }}>
            <li>Save these numbers in your phone for emergency access</li>
            <li>All helplines operate 24/7 and are free to call</li>
            <li>In case of immediate danger, always call emergency services (112)</li>
            <li>Share these contacts with friends & family for their safety</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Helpline;