
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrackComplaint from "./pages/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Departments from "./pages/Departments";
import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* CITIZEN */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* CITIZEN DASHBOARD
          Keep this only if Dashboard.jsx exists */}
      <Route
  path="/dashboard"
  element={<Dashboard />}
/>

      {/* COMPLAINT */}
      <Route
        path="/track-complaint"
        element={<TrackComplaint />}
      />

      {/* OLD COMPLAINT LINK */}
      <Route
        path="/complaints"
        element={<TrackComplaint />}
      />

      {/* ADMIN */}
      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* DEPARTMENTS */}
      <Route
        path="/departments"
        element={<Departments />}
      />
      <Route
  path="/submit-complaint"
  element={<SubmitComplaint />}
/>

    </Routes>
  );
}

export default App;

