import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import FakeCall from "./Components/FakeCall";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fakecall" element={<FakeCall />} />
      </Routes>
    </Router>
  );
}

export default App;