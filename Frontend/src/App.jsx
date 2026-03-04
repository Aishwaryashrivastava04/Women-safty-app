import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import FakeCall from "./Components/FakeCall";

// Lazy loaded components
const Dashboard = React.lazy(() => import("./Components/Dashboard"));
const SOS = React.lazy(() => import("./Components/SOS"));
const Contacts = React.lazy(() => import("./Components/Contacts"));
const Feedback = React.lazy(() => import("./Components/Feedback"));
const Helpline = React.lazy(() => import("./Components/Helpline"));
const TrackMe = React.lazy(() => import("./Components/TrackMe"));
const Profile = React.lazy(() => import("./Components/Profile"));
const Settings = React.lazy(() => import("./Components/setting"));
const About = React.lazy(() => import("./Components/About"));
const NearbyPolice = React.lazy(() => import("./Components/NearbyPolice"));
const SafetyTips = React.lazy(() => import("./Components/SafetyTips"));
const EmergencySMS = React.lazy(() => import("./Components/EmergencySMS"));
const WalkMode = React.lazy(() => import("./Components/WalkMode"));
const GuardianMonitor = React.lazy(() => import("./Components/GuardianMonitor"));
const SafeZone = React.lazy(() => import("./Components/SafeZone"));
const QuickCall = React.lazy(() => import("./Components/QuickCall"));
const SafetyProduct = React.lazy(() => import("./Components/SafetyProduct"));

const Loading = () => (
  <div style={{ textAlign: "center", marginTop: "100px" }}>
    ⏳ Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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

          <Route path="/fake-call" element={<FakeCall />} />
          <Route path="/safety-product" element={<SafetyProduct />} />
          <Route path="/walk-mode" element={<WalkMode />} />
          <Route path="/guardian-monitor" element={<GuardianMonitor />} />
          <Route path="/safe-zone" element={<SafeZone />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;