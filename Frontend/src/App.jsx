import Home from './Components/Home';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import ForgotPassword from "./Components/ForgotPassword";

// Lazy load heavy components (code-splitting for faster initial load)
const Dashboard = React.lazy(() => import('./Components/Dashboard'));
const SOS = React.lazy(() => import('./Components/SOS'));
const Contacts = React.lazy(() => import('./Components/Contacts'));
const Feedback = React.lazy(() => import('./Components/Feedback'));
const Helpline = React.lazy(() => import('./Components/Helpline'));
const TrackMe = React.lazy(() => import('./Components/TrackMe'));
const Profile = React.lazy(() => import('./Components/Profile'));
const Settings = React.lazy(() => import('./Components/setting'));
const About = React.lazy(() => import('./Components/About'));
const NearbyPolice = React.lazy(() => import('./Components/NearbyPolice'));
const SafetyTips = React.lazy(() => import('./Components/SafetyTips'));
const EmergencySMS = React.lazy(() => import('./Components/EmergencySMS'));
const QuickCall = React.lazy(() => import('./Components/QuickCall'));

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: 'linear-gradient(135deg, #EDE9FE 0%, #F3E8FF 50%, #E0E7FF 100%)',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#5B2EFF'
  }}>
    ⏳ Loading...
  </div>
);
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

function DashboardWrapper() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  navigate("/login");
};

  return <Dashboard onLogout={handleLogout} />;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardWrapper />
    </ProtectedRoute>
  } 
/>
          <Route path="/sos" element={<SOS />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/helpline" element={<Helpline />} />
          <Route path="/trackme" element={<TrackMe />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/nearby-police" element={<NearbyPolice />} />
          <Route path="/safetytips" element={<SafetyTips />} />
          <Route path="/emergencysms" element={<EmergencySMS />} />
          <Route path="/quickcall" element={<QuickCall />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;