
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          data.error ||
          "Invalid admin credentials."
        );
        return;
      }

      localStorage.setItem(
        "civicconnect_admin",
        JSON.stringify(data)
      );

     navigate("/admin");

    } catch (error) {
      console.error("Admin Login Error:", error);

      setError(
        "Unable to connect to the server. Please make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* LEFT PANEL */}

      <div className="admin-login-left">

        <div className="admin-brand">

          <div className="admin-shield">
            🛡️
          </div>

          <h1>CIVICCONNECT</h1>

          <p>
            Municipal Administration Portal
          </p>

        </div>

        <div className="admin-welcome">

          <h2>
            Welcome, Administrator
          </h2>

          <p>
            Manage civic complaints, monitor department
            activities, and coordinate municipal services
            from one secure platform.
          </p>

          <div className="admin-features">

            <div>
              <span>✓</span>
              Complaint Management
            </div>

            <div>
              <span>✓</span>
              Department Monitoring
            </div>

            <div>
              <span>✓</span>
              Municipality Operations
            </div>

            <div>
              <span>✓</span>
              Complaint Status Updates
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT PANEL */}

      <div className="admin-login-right">

        <div className="admin-login-box">

          <div className="admin-icon">
            👤
          </div>

          <h2>Admin Sign In</h2>

          <p className="admin-subtitle">
            Access your municipal administration dashboard
          </p>


          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="admin-form-group">

              <label htmlFor="admin-email">
                Official Email
              </label>

             <input
  id="admin-email"
  type="email"
  name="admin-email"
  placeholder="admin@civicconnect.local"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  autoComplete="off"
  required
/>

            </div>


            <div className="admin-form-group">

              <label htmlFor="admin-password">
                Password
              </label>

             <input
  id="admin-password"
  type="password"
  name="admin-password"
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  autoComplete="new-password"
  required
/>
            </div>


            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading
                ? "Authenticating..."
                : "Sign In to Admin Portal"}
            </button>

          </form>


          <div className="admin-security">

            🔒 Secure Municipal Access

          </div>


          <div className="admin-back">

            <Link to="/">
              ← Back to CivicConnect
            </Link>

          </div>


          <div className="citizen-login-link">

            Citizen?

            <Link to="/login">
              Login here
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;

