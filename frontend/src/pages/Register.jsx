import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_BASE_URL from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
          data.message ||
          "Registration failed. Please try again."
        );

        setLoading(false);
        return;
      }

      setSuccess(
        "Account created successfully!"
      );

      /*
       * Go directly to dashboard.
       * No login page after registration.
       */
      if (data.user_id || data.email) {

        const userData = {
          user_id: data.user_id || "",
          name: data.name || formData.name,
          email: data.email || formData.email,
          phone: data.phone || formData.phone,
        };

        localStorage.setItem(
          "civicconnect_user",
          JSON.stringify(userData)
        );

        localStorage.setItem(
          "user_id",
          userData.user_id
        );

        localStorage.setItem(
          "name",
          userData.name
        );

        localStorage.setItem(
          "email",
          userData.email
        );

        localStorage.setItem(
          "phone",
          userData.phone
        );

        setTimeout(() => {
          navigate("/dashboard");
        }, 700);

      } else {

        /*
         * If backend doesn't return user data,
         * go to login as fallback.
         */
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card register-card">

        <div className="auth-header">

          <div className="auth-logo">
            🏛️
          </div>

          <span>CIVICCONNECT</span>

          <h1>Create Citizen Account</h1>

          <p>
            Register to submit complaints and access
            personalized civic services.
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

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="new-name"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="register-email">
              Email Address
            </label>

            <input
              id="register-email"
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

            <label htmlFor="phone">
              Mobile Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="new-tel"
              required
            />

          </div>

          <div className="auth-form-row">

            <div className="form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

            </div>

          </div>

          {/* PRIVACY + TERMS */}

          <div className="privacy-terms">

            <p>
              By creating an account, you agree to our{" "}
              <Link to="/terms">
                Terms of Service
              </Link>.
            </p>

            <p>
              Please read our{" "}
              <Link to="/privacy">
                Privacy Policy
              </Link>{" "}
              to understand how your information is handled.
            </p>

            <label className="terms-check">

              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) =>
                  setAgreed(e.target.checked)
                }
              />

              <span>
                I agree to the Terms of Service and Privacy Policy.
              </span>

            </label>

          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* NO "ALREADY HAVE ACCOUNT / SIGN IN" HERE */}

        <div className="auth-footer">

          <Link to="/">
            ← Back to Home
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Register;