import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (activeModal === 'location' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => setLocation({ error: 'Location access denied.' })
      );
    }
  }, [activeModal]);

  const handleStartClick = () => {
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.toLowerCase();
    if (query.includes('sos')) navigate('/sos');
    else if (query.includes('sms')) navigate('/sms');
    else if (query.includes('track')) navigate('/track');
    else if (query.includes('helpline')) navigate('/helpline');
    else alert('No matching feature found.');
  };

  return (
    <div className="w-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
        <div className="container-fluid px-4">
          <Link className="navbar-brand" to="/">Women Safety</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><span className="nav-link" onClick={() => setActiveModal(null)}>Home</span></li>
              <li className="nav-item"><span className="nav-link" onClick={() => setActiveModal('about')}>About</span></li>
              <li className="nav-item"><span className="nav-link" onClick={() => setActiveModal('location')}>Location</span></li>
              <li className="nav-item"><span className="nav-link" onClick={() => setActiveModal('help')}>Help</span></li>
            </ul>
            <form className="d-flex ms-3" onSubmit={handleSearch}>
              <input className="form-control me-2" type="search" name="search" placeholder="Search" />
              <button className="btn btn-outline-light" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!activeModal && (
        <div className="container-fluid py-5 px-0 mx-0">
          <div className="row align-items-center g-0">
            <div className="col-md-6 p-5 text-center text-md-start">
              <h2><strong>Women Safety</strong> – "SafeHere"</h2>
              <p className="lead">Your safety, our priority. One tap away from help.</p>
              <button className="btn btn-primary btn-lg mt-3" onClick={handleStartClick}>Start Up for Free</button>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="/src/assets/safe-women.jpg"
                className="img-fluid rounded shadow"
                alt="Women safety"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Section */}
      {activeModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {activeModal === 'about' && 'About Women Safety'}
                  {activeModal === 'location' && 'Your Location'}
                  {activeModal === 'help' && 'Helpline Numbers'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
              </div>
              <div className="modal-body">
                {activeModal === 'about' && (
                  <p>
                    Women safety is a vital issue. This app helps ensure quick access to help,
                    emergency alerts, and live location sharing for increased safety and peace of mind.
                  </p>
                )}
                {activeModal === 'location' && (
                  location ? (
                    location.error ? <p>{location.error}</p> :
                      <p>Latitude: {location.lat}<br />Longitude: {location.lng}</p>
                  ) : <p>Fetching location...</p>
                )}
                {activeModal === 'help' && (
                  <ul className="list-group">
                    <li className="list-group-item"><strong>National Women Helpline:</strong> 1091</li>
                    <li className="list-group-item"><strong>Police:</strong> 100</li>
                    <li className="list-group-item"><strong>Child Helpline:</strong> 1098</li>
                    <li className="list-group-item"><strong>Ambulance:</strong> 108</li>
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;