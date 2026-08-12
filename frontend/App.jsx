import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Departments from "./pages/Departments";
import Announcements from "./pages/Announcements";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/complaints"
        element={<SubmitComplaint />}
      />

      <Route
        path="/submit-complaint"
        element={<SubmitComplaint />}
      />

      <Route
        path="/track-complaint"
        element={<TrackComplaint />}
      />

      <Route
        path="/track"
        element={<TrackComplaint />}
      />

      <Route
        path="/complaint/:id"
        element={<ComplaintDetails />}
      />

      <Route
        path="/departments"
        element={<Departments />}
      />

      <Route
        path="/announcements"
        element={<Announcements />}
      />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

    </Routes>
  );
}

export default App;