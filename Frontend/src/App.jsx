import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import SOS from './Components/SOS';
import Contacts from './Components/Contacts';
import Feedback from './Components/Feedback';
import Helpline from './Components/Helpline'; // 👈 Add this
import TrackMe from './Components/TrackMe'; // 👈 Add this import
import Profile from './Components/profile';
import Settings from './Components/setting';
import About from './Components/About';
import NearbyPolice from './Components/NearbyPolice';
import SafetyTips from './Components/SafetyTips'
import EmergencySMS from './Components/EmergencySMS';
import QuickCall from './Components/QuickCall';
import Register from './Components/Register';


function DashboardWrapper() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login'); // or '/'
  };

  return <Dashboard onLogout={handleLogout} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/helpline" element={<Helpline />} /> // 👈 Add this route
        <Route path="/trackme" element={<TrackMe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/nearby-police" element={<NearbyPolice />} />
        <Route path="/safetytips" element={<SafetyTips />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/emergencysms" element={<EmergencySMS />} />
        <Route path="/quickcall" element={<QuickCall />} />


      </Routes>
    </Router>
  );
  
}

export default App;