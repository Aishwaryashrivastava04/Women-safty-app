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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFF 0%, #EFF2FF 50%)', fontFamily: "'Inter', system-ui, -apple-system", padding: '24px 0' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #5B2EFF 0%, #7C5CFF 100%)', color: 'white', padding: '20px 24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>⚙️ App Settings</div>
          <div>
            <button onClick={() => { localStorage.setItem('darkMode', !darkMode); setDarkMode(!darkMode); }} style={{ marginRight: 8, background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 10 }}>Toggle Dark</button>
            <button onClick={() => window.location.reload()} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 10 }}>Reload</button>
          </div>
        </div>

        <div style={{ marginTop: 18, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
            <div>
              {/* Location Sharing */}
              <SettingRow label="📍 Live Location Sharing" checked={locationSharing} onToggle={() => { setLocationSharing(!locationSharing); showMessage(`📍 Location sharing ${!locationSharing ? 'enabled' : 'disabled'}`); }} />

              {/* Notifications */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>🔔 Notifications</div>
                <select value={notifications} onChange={(e) => { setNotifications(e.target.value); showMessage(`🔔 Notifications ${e.target.value}`); }} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Email Alerts */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>📧 Email Alerts</div>
                <select value={emailAlerts} onChange={(e) => { setEmailAlerts(e.target.value); showMessage(`📧 Email alerts set to ${e.target.value}`); }} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5E7EB' }}>
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Auto-SOS */}
              <SettingRow label="📩 Auto-SOS (Emergency SMS)" checked={autoSOS} onToggle={() => { setAutoSOS(!autoSOS); showMessage(`📩 Auto-SOS ${!autoSOS ? 'enabled' : 'disabled'}`); }} />

              {/* Sound Alarm */}
              <SettingRow label="🎵 Sound Alarm" checked={soundAlarm} onToggle={() => { setSoundAlarm(!soundAlarm); showMessage(`🎵 Sound alarm ${!soundAlarm ? 'enabled' : 'disabled'}`); }} />

              <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                <button onClick={handleClearData} style={{ background: '#F87171', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 10, fontWeight: 700 }}>🗑️ Clear Local Data</button>
                <button onClick={() => { localStorage.setItem('privacyMode', String(!privacyMode)); setPrivacyMode(!privacyMode); showMessage(`🔒 Privacy mode ${!privacyMode ? 'enabled' : 'disabled'}`); }} style={{ background: '#F3F4F6', border: 'none', padding: '10px 16px', borderRadius: 10 }}>Toggle Privacy</button>
              </div>
            </div>

            <div>
              <div style={{ padding: 16, borderRadius: 12, background: '#FAFAFF', border: '1px solid #EEF2FF' }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Privacy & Display</div>
                <div style={{ color: '#6B7280', marginBottom: 12 }}>Use Privacy Mode to blur sensitive information on screen. Dark Mode toggles global theme.</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Privacy Mode</div>
                    <div style={{ color: '#6B7280' }}>{privacyMode ? 'Enabled' : 'Disabled'}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Dark Mode</div>
                    <div style={{ color: '#6B7280' }}>{darkMode ? 'Enabled' : 'Disabled'}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Account & Alerts</div>
                <div style={{ color: '#6B7280' }}>Configure notification preferences and emergency alert behavior.</div>
              </div>
            </div>
          </div>

          {statusMsg && <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: '#ECFEFF', color: '#064E3B', fontWeight: 700 }}>{statusMsg}</div>}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, checked, onToggle }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={checked} onChange={onToggle} style={{ width: 40, height: 20 }} />
      </label>
    </div>
  );
}
export default Settings;