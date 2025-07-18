import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const helplines = [
  { name: "Women Helpline (All India)", number: "1091" },
  { name: "Police Emergency", number: "100" },
  { name: "National Emergency Number", number: "112" },
  { name: "Domestic Violence Helpline", number: "181" },
  { name: "Child Helpline", number: "1098" }
];

function Helpline() {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-danger">📞 Emergency Helpline Numbers</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className="row g-4">
        {helplines.map((line, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-lg border-danger border-2">
              <div className="card-body">
                <h5 className="card-title text-danger">{line.name}</h5>
                <p className="card-text fs-5">📞 {line.number}</p>
                <a href={`tel:${line.number}`} className="btn btn-danger btn-sm">
                  📲 Call Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Helpline;