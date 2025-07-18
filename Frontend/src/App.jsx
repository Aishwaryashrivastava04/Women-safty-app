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



import './App.css';

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
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/helpline" element={<Helpline />} /> // 👈 Add this route
        <Route path="/trackme" element={<TrackMe />} />
      </Routes>
    </Router>
  );
}

export default App;