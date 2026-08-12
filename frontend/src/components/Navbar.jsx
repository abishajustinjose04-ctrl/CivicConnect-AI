import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          Civic<span>Connect</span>
        </NavLink>

        {/* Hamburger */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <div className={`navbar-content ${menuOpen ? "open" : ""}`}>

          <div className="nav-links">
            <NavLink to="/" className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/complaints" className="nav-link" onClick={closeMenu}>
              Complaints
            </NavLink>

            <NavLink
              to="/track-complaint"
              className="nav-link"
              onClick={closeMenu}
            >
              Track Complaint
            </NavLink>

            <NavLink to="/departments" className="nav-link" onClick={closeMenu}>
              Departments
            </NavLink>

            <NavLink
              to="/announcements"
              className="nav-link"
              onClick={closeMenu}
            >
              Announcements
            </NavLink>

            <NavLink to="/about" className="nav-link" onClick={closeMenu}>
              About
            </NavLink>

            <NavLink to="/contact" className="nav-link" onClick={closeMenu}>
              Contact
            </NavLink>
          </div>

          <div className="nav-actions">
            <NavLink to="/login" className="login-btn" onClick={closeMenu}>
              Login
            </NavLink>

            <NavLink to="/register" className="register-btn" onClick={closeMenu}>
              Register
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;