import React, { useState, useEffect } from 'react';

function Settings() {
  const [locationSharing, setLocationSharing] = useState(localStorage.getItem('locationSharing') !== 'false');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [privacyMode, setPrivacyMode] = useState(localStorage.getItem('privacyMode') === 'true');
  const [autoSOS, setAutoSOS] = useState(localStorage.getItem('autoSOS') === 'true');
  const [soundAlarm, setSoundAlarm] = useState(localStorage.getItem('soundAlarm') === 'true');
  const [biometricLock, setBiometricLock] = useState(localStorage.getItem('biometricLock') === 'true');

  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(localStorage.getItem('appPin') || '');
  const [tempPin, setTempPin] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  /* 🌗 TRUE Dynamic Theme Switching */
  useEffect(() => {
    document.body.style.background = darkMode
      ? 'linear-gradient(135deg,#0f172a,#1e293b)'
      : 'linear-gradient(135deg,#eef2ff,#fdf2f8)';
    document.body.style.color = darkMode ? 'white' : 'black';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('locationSharing', locationSharing);
    localStorage.setItem('privacyMode', privacyMode);
    localStorage.setItem('autoSOS', autoSOS);
    localStorage.setItem('soundAlarm', soundAlarm);
    localStorage.setItem('biometricLock', biometricLock);
  }, [locationSharing, privacyMode, autoSOS, soundAlarm, biometricLock]);

  const showMessage = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 2500);
  };

  /* 🔐 PIN Lock Logic */
  const savePin = () => {
    if (tempPin.length < 4) {
      showMessage('PIN must be 4 digits');
      return;
    }
    localStorage.setItem('appPin', tempPin);
    setPin(tempPin);
    setTempPin('');
    setShowPinModal(false);
    showMessage('PIN Lock Enabled 🔐');
  };

  /* 📊 Safety Score Preview */
  const safetyScore =
    50 +
    (locationSharing ? 10 : 0) +
    (autoSOS ? 15 : 0) +
    (soundAlarm ? 10 : 0) +
    (privacyMode ? 5 : 0) +
    (biometricLock ? 10 : 0);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, system-ui' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
        }}>
          <h2 style={{ fontWeight: 900 }}>⚙ Ultra Elite Security Settings</h2>
          <p>Advanced control center for maximum safety</p>
          <h4 style={{ marginTop: 20 }}>📊 Safety Score: {safetyScore}%</h4>
        </div>

        {/* GLASS CARD */}
        <div style={{
          backdropFilter: 'blur(25px)',
          background: darkMode ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.6)',
          borderRadius: '28px',
          padding: '30px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
        }}>

          <ToggleRow label="📍 Live Location Sharing" checked={locationSharing} onToggle={() => setLocationSharing(!locationSharing)} />
          <ToggleRow label="📩 Auto SOS" checked={autoSOS} onToggle={() => setAutoSOS(!autoSOS)} />
          <ToggleRow label="🔊 Emergency Alarm" checked={soundAlarm} onToggle={() => setSoundAlarm(!soundAlarm)} />
          <ToggleRow label="🔒 Privacy Mode" checked={privacyMode} onToggle={() => setPrivacyMode(!privacyMode)} />
          <ToggleRow label="🌙 Dark Mode" checked={darkMode} onToggle={() => setDarkMode(!darkMode)} />

          <ToggleRow
            label="🔐 PIN Lock"
            checked={!!pin}
            onToggle={() => setShowPinModal(true)}
          />

        </div>

        {statusMsg && (
          <div style={{
            marginTop: 20,
            padding: 12,
            background: '#10b981',
            color: 'white',
            borderRadius: 12,
            textAlign: 'center',
            fontWeight: 700
          }}>
            {statusMsg}
          </div>
        )}

        {/* PIN MODAL */}
        {showPinModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}>
            <div style={{
              background: 'white',
              padding: 30,
              borderRadius: 20,
              width: 320,
              textAlign: 'center'
            }}>
              <h4>Set 4‑Digit PIN</h4>
              <input
                type="password"
                maxLength="4"
                value={tempPin}
                onChange={(e) => setTempPin(e.target.value)}
                style={{ width: '100%', padding: 10, margin: '15px 0', borderRadius: 8 }}
              />
              <button onClick={savePin} style={{ marginRight: 10 }}>Save</button>
              <button onClick={() => setShowPinModal(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onToggle }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 18
    }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <div
        onClick={onToggle}
        style={{
          width: 55,
          height: 28,
          borderRadius: 30,
          background: checked ? '#6366f1' : '#e5e7eb',
          position: 'relative',
          cursor: 'pointer',
          transition: '0.3s'
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: 2,
            left: checked ? 28 : 2,
            transition: '0.3s',
            boxShadow: '0 3px 8px rgba(0,0,0,0.3)'
          }}
        />
      </div>
    </div>
  );
}

export default Settings;