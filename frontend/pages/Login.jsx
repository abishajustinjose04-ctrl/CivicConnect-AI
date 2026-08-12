
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "./api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      console.log("Login response:", result);

      if (!response.ok) {
        throw new Error(
          result.error ||
          result.message ||
          "Login failed. Please try again."
        );
      }

      // Save user information
      if (result.user_id) {
        localStorage.setItem("user_id", result.user_id);
      }

      if (result.name) {
        localStorage.setItem("name", result.name);
      }

      if (result.email) {
        localStorage.setItem("email", result.email);
      }

      if (result.phone) {
        localStorage.setItem("phone", result.phone);
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      // Go to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <div className="auth-logo">
            🏛️
          </div>

          <span>
            CIVICCONNECT
          </span>

          <h1>
            Citizen Login
          </h1>

          <p>
            Login to submit and track your civic complaints.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="auth-message error-message">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              autoComplete="email"
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

          </div>

          <div className="auth-options">

            <label>
              <input
                type="checkbox"
              />
              Remember me
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={() =>
                setError(
                  "Please contact the administration to reset your password."
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
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="auth-register">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create Citizen Account
          </Link>

        </div>

        {/* FOOTER */}
        <div className="auth-footer">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;
