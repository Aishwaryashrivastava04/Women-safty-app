import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const helplines = [
  { name: "Women Helpline (All India)", number: "1091", icon: "👩‍🦰" },
  { name: "Police Emergency", number: "100", icon: "🚓" },
  { name: "National Emergency Number", number: "112", icon: "🚨" },
  { name: "Domestic Violence Helpline", number: "181", icon: "🛡️" },
  { name: "Child Helpline", number: "1098", icon: "🧒" }
];

function Helpline() {
  const navigate = useNavigate();

  return (
    <div className="container py-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-primary">📞 Emergency Helpline Numbers</h2>
        <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="row g-4">
        {helplines.map((line, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow border-0 rounded-4 hover-shadow transition">
              <div className="card-body text-center">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 60, height: 60, fontSize: 24 }}
                >
                  {line.icon}
                </div>
                <h5 className="card-title fw-semibold">{line.name}</h5>
                <p className="card-text fs-5 text-muted">{line.number}</p>
                <a
                  href={`tel:${line.number}`}
                  className="btn btn-primary px-4 rounded-pill mt-2"
                >
                  📲 Call Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom style for smooth hover effect */}
      <style>{`
        .hover-shadow {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}

export default Helpline;