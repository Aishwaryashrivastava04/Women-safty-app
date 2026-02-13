import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './setting.css';

function Settings() {
  const [locationSharing, setLocationSharing] = useState(() => {
    return localStorage.getItem('locationSharing') !== 'false';
  });
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') || 'enabled';
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [privacyMode, setPrivacyMode] = useState(() => {
    return localStorage.getItem('privacyMode') === 'true';
  });
  const [emailAlerts, setEmailAlerts] = useState(() => {
    return localStorage.getItem('emailAlerts') || 'daily';
  });
  const [soundAlarm, setSoundAlarm] = useState(() => {
    return localStorage.getItem('soundAlarm') === 'true';
  });
  const [autoSOS, setAutoSOS] = useState(() => {
    return localStorage.getItem('autoSOS') === 'true';
  });
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const content = document.getElementById('privacy-wrapper');
    if (content) {
      content.style.filter = privacyMode ? 'blur(5px)' : 'none';
    }
  }, [privacyMode]);

  useEffect(() => {
    localStorage.setItem('locationSharing', locationSharing);
    localStorage.setItem('notifications', notifications);
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('privacyMode', privacyMode);
    localStorage.setItem('emailAlerts', emailAlerts);
    localStorage.setItem('soundAlarm', soundAlarm);
    localStorage.setItem('autoSOS', autoSOS);
  }, [
    locationSharing,
    notifications,
    darkMode,
    privacyMode,
    emailAlerts,
    soundAlarm,
    autoSOS
  ]);

  const showMessage = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data?')) {
      localStorage.clear();
      showMessage('🗑️ All local data has been cleared.');
      window.location.reload();
    }
  };

  return (
    <div className="container py-5" id="privacy-wrapper">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white rounded-top">
              <h4 className="mb-0">⚙️ App Settings</h4>
            </div>
            <div className="card-body">

              {/* Location Sharing */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="locationToggle"
                  checked={locationSharing}
                  onChange={() => {
                    setLocationSharing(!locationSharing);
                    showMessage(`📍 Location sharing ${!locationSharing ? 'enabled' : 'disabled'}`);
                  }}
                />
                <label className="form-check-label" htmlFor="locationToggle">
                  Live Location Sharing
                </label>
              </div>

              {/* Notifications */}
              <div className="mb-3">
                <label htmlFor="notificationSelect" className="form-label">🔔 Notifications</label>
                <select
                  id="notificationSelect"
                  className="form-select"
                  value={notifications}
                  onChange={(e) => {
                    setNotifications(e.target.value);
                    showMessage(`🔔 Notifications ${e.target.value}`);
                  }}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Email Alerts */}
              <div className="mb-3">
                <label htmlFor="emailAlert" className="form-label">📧 Email Alerts</label>
                <select
                  id="emailAlert"
                  className="form-select"
                  value={emailAlerts}
                  onChange={(e) => {
                    setEmailAlerts(e.target.value);
                    showMessage(`📧 Email alerts set to ${e.target.value}`);
                  }}
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Privacy Blur */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="privacyMode"
                  checked={privacyMode}
                  onChange={() => {
                    setPrivacyMode(!privacyMode);
                    showMessage(`🔒 Privacy mode ${!privacyMode ? 'enabled' : 'disabled'}`);
                  }}
                />
                <label className="form-check-label" htmlFor="privacyMode">
                  Privacy Mode (Blur Content)
                </label>
              </div>

              {/* Dark Mode */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkMode"
                  checked={darkMode}
                  onChange={() => {
                    setDarkMode(!darkMode);
                    showMessage(`🌙 Dark mode ${!darkMode ? 'enabled' : 'disabled'}`);
                  }}
                />
                <label className="form-check-label" htmlFor="darkMode">
                  Dark Mode (Global)
                </label>
              </div>

              {/* Sound Alarm */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="soundAlarm"
                  checked={soundAlarm}
                  onChange={() => {
                    setSoundAlarm(!soundAlarm);
                    showMessage(`🎵 Sound alarm ${!soundAlarm ? 'enabled' : 'disabled'}`);
                  }}
                />
                <label className="form-check-label" htmlFor="soundAlarm">
                  🎵 Sound Alarm
                </label>
              </div>

              {/* Auto-SOS */}
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoSOS"
                  checked={autoSOS}
                  onChange={() => {
                    setAutoSOS(!autoSOS);
                    showMessage(`📩 Auto-SOS ${!autoSOS ? 'enabled' : 'disabled'}`);
                  }}
                />
                <label className="form-check-label" htmlFor="autoSOS">
                  📩 Auto-SOS (Emergency SMS)
                </label>
              </div>

              {/* Clear Local Data */}
              <div className="text-center">
                <button className="btn btn-outline-danger" onClick={handleClearData}>
                  🗑️ Clear All Data
                </button>
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div className="alert alert-info mt-4 text-center p-2">{statusMsg}</div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;