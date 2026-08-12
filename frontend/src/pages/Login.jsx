import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_BASE_URL from "../services/api";

import "./Login.css";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          data.error ||
          "Unable to login."
        );
        setLoading(false);
        return;
      }

      const userData = {
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      };

      localStorage.setItem(
        "civicconnect_user",
        JSON.stringify(userData)
      );

      localStorage.setItem("user_id", data.user_id || "");
      localStorage.setItem("name", data.name || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("phone", data.phone || "");

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-logo">
            🏛️
          </div>

          <span>CIVICCONNECT</span>

          <h1>Citizen Login</h1>

          <p>
            Sign in to access your complaints, updates,
            and civic services.
          </p>

        </div>

        {error && (
          <div className="auth-message error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-message success-message">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          autoComplete="off"
        >

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="new-email"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

          </div>

          <div className="auth-options">

            <label className="remember-option">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              <span>Remember me</span>

            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                alert(
                  "Password recovery will be available soon."
                )
              }
            >
              Forgot password?
            </button>

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-register">

          <p>
            Don't have a CivicConnect account?
          </p>

          <Link to="/register">
            Create Citizen Account
          </Link>

        </div>

        <div className="auth-footer">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;