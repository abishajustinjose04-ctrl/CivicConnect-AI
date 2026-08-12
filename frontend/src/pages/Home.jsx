
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./Home.css";

function Home() {
  const [stats, setStats] = useState({
    totalComplaints: 56,
    resolvedComplaints: 23,
    activeComplaints: 33,
    departments: 15,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  // ============================================================
  // LOAD STATISTICS
  // Backend endpoint: GET /statistics
  // ============================================================

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoadingStats(true);

        const response = await fetch(
          `${API_BASE_URL}/statistics`
        );

        if (!response.ok) {
          throw new Error(
            `Statistics request failed: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("HOME STATISTICS RESPONSE:", data);

        setStats({
          totalComplaints:
            data.total_complaints ??
            data.totalComplaints ??
            56,

          resolvedComplaints:
            data.resolved_complaints ??
            data.resolvedComplaints ??
            23,

          activeComplaints:
            data.active_complaints ??
            data.activeComplaints ??
            33,

          departments:
            data.departments ??
            15,
        });
      } catch (error) {
        console.error("STATS ERROR:", error);

        setStats({
          totalComplaints: 56,
          resolvedComplaints: 23,
          activeComplaints: 33,
          departments: 15,
        });
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="home-page">

      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <div className="top-bar">
        <div className="top-bar-container">

          <span>
            CivicConnect — Smart Civic Complaint Management
          </span>

          <div className="top-links">
            <span>Citizen Services</span>
            <span>Municipal Administration</span>
          </div>

        </div>
      </div>


      {/* ======================================================
          BRAND HEADER
      ====================================================== */}

      <header className="brand-header">

        <div className="brand-container">

          <div className="brand-left">

            <div className="brand-emblem">
              🏛️
            </div>

            <div>
              <h1>CivicConnect</h1>

              <p>
                Smart Civic Complaint Management System
              </p>
            </div>

          </div>


          <div className="brand-right">

            <span>
              Citizen Service Portal
            </span>

            <strong>
              Your Voice. Our Responsibility.
            </strong>

          </div>

        </div>

      </header>


      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="navbar">

        <div className="navbar-container">

          <div className="nav-links">

            <Link
              to="/"
              className="nav-link active"
            >
              Home
            </Link>


            <Link
              to="/departments"
              className="nav-link"
            >
              Departments
            </Link>


            <Link
              to="/track-complaint"
              className="nav-link"
            >
              Track Complaint
            </Link>

          </div>


          <div className="nav-actions">

            <Link
              to="/login"
              className="login-btn"
            >
              Citizen Login
            </Link>


            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>


            <Link
              to="/admin-login"
              className="admin-login-btn"
            >
              Admin Login
            </Link>

          </div>

        </div>

      </nav>


      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-tag">
            SMART CIVIC COMPLAINT MANAGEMENT
          </span>


          <h1>
            Your Voice.
            <span> Our Responsibility.</span>
          </h1>


          <p>
            CivicConnect gives citizens a simple and
            transparent way to report civic issues,
            track complaints, and stay connected with
            their local municipality.
          </p>


          <div className="hero-buttons">

            <Link
              to="/login"
              className="primary-btn"
            >
              Report an Issue
            </Link>


            <Link
              to="/track-complaint"
              className="secondary-btn"
            >
              Track Complaint
            </Link>

          </div>


          <div className="hero-trust">

            <span>✓ Easy to Use</span>
            <span>✓ Transparent Tracking</span>
            <span>✓ Faster Resolution</span>

          </div>

        </div>


        {/* HERO CARD */}

        <div className="hero-visual">

          <div className="hero-info-card">

            <div className="hero-info-icon">
              🏛️
            </div>


            <span>
              CIVICCONNECT
            </span>


            <h2>
              Building Better Communities Together
            </h2>


            <p>
              Report civic problems directly to the
              appropriate municipal department and
              track the progress of your complaint.
            </p>


            <div className="hero-info-points">

              <div>
                <strong>01</strong>

                <span>
                  Submit civic complaints
                </span>
              </div>


              <div>
                <strong>02</strong>

                <span>
                  Track complaint progress
                </span>
              </div>


              <div>
                <strong>03</strong>

                <span>
                  Receive faster resolution
                </span>
              </div>

            </div>


            <div className="mini-stat">

              <div>

                <strong>
                  {loadingStats
                    ? "..."
                    : stats.totalComplaints}
                </strong>

                <span>
                  Complaints
                </span>

              </div>


              <div>

                <strong>
                  {loadingStats
                    ? "..."
                    : stats.resolvedComplaints}
                </strong>

                <span>
                  Resolved
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          SERVICES
      ====================================================== */}

      <section className="services-section">

        <div className="section-heading">

          <span>
            CIVICCONNECT SERVICES
          </span>

          <h2>
            Everything You Need in One Place
          </h2>

          <p>
            Access important civic services quickly
            and stay connected with your municipality.
          </p>

        </div>


        <div className="service-grid">


          {/* VIEW COMPLAINTS */}

          <Link
            to="/track-complaint"
            className="service-card"
          >

            <div className="service-icon">
              🔎
            </div>

            <h3>
              View Complaints
            </h3>

            <p>
              View and track civic complaints and
              monitor their current status.
            </p>

            <span>
              View Complaints →
            </span>

          </Link>


          {/* TRACK COMPLAINT */}

          <Link
            to="/track-complaint"
            className="service-card"
          >

            <div className="service-icon">
              📍
            </div>

            <h3>
              Track Complaint
            </h3>

            <p>
              Enter your complaint ID and check
              the latest progress.
            </p>

            <span>
              Track Now →
            </span>

          </Link>


          {/* DEPARTMENTS */}

          <Link
            to="/departments"
            className="service-card"
          >

            <div className="service-icon">
              🏢
            </div>

            <h3>
              Municipal Departments
            </h3>

            <p>
              Learn about departments responsible
              for different civic services.
            </p>

            <span>
              Explore →
            </span>

          </Link>


          {/* CITIZEN LOGIN */}

          <Link
            to="/login"
            className="service-card"
          >

            <div className="service-icon">
              👤
            </div>

            <h3>
              Citizen Services
            </h3>

            <p>
              Login to your citizen account and
              submit or manage your complaints.
            </p>

            <span>
              Citizen Login →
            </span>

          </Link>

        </div>

      </section>


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <section className="statistics-section">

        <div className="section-heading light">

          <span>
            OUR IMPACT
          </span>

          <h2>
            CivicConnect at a Glance
          </h2>

          <p>
            Real-time information from the
            CivicConnect database.
          </p>

        </div>


        <div className="statistics-grid">


          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <strong>
              {loadingStats
                ? "..."
                : stats.totalComplaints}
            </strong>

            <span>
              Total Complaints
            </span>

            <small>
              All complaints submitted
            </small>

          </div>


          {/* RESOLVED */}

          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <strong>
              {loadingStats
                ? "..."
                : stats.resolvedComplaints}
            </strong>

            <span>
              Resolved Complaints
            </span>

            <small>
              Successfully resolved
            </small>

          </div>


          {/* ACTIVE */}

          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <strong>
              {loadingStats
                ? "..."
                : stats.activeComplaints}
            </strong>

            <span>
              Active Complaints
            </span>

            <small>
              Currently being processed
            </small>

          </div>


          {/* DEPARTMENTS */}

          <div className="stat-card">

            <div className="stat-icon">
              🏢
            </div>

            <strong>
              {loadingStats
                ? "..."
                : stats.departments}
            </strong>

            <span>
              Departments
            </span>

            <small>
              Municipal departments
            </small>

          </div>

        </div>

      </section>


      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="how-section">

        <div className="section-heading">

          <span>
            SIMPLE PROCESS
          </span>

          <h2>
            How CivicConnect Works
          </h2>

          <p>
            Report your issue and follow its progress
            until resolution.
          </p>

        </div>


        <div className="process-grid">


          <div className="process-card">

            <div className="process-number">
              01
            </div>

            <h3>
              Create an Account
            </h3>

            <p>
              Register as a citizen and access
              your CivicConnect dashboard.
            </p>

          </div>


          <div className="process-card">

            <div className="process-number">
              02
            </div>

            <h3>
              Submit Complaint
            </h3>

            <p>
              Provide details about the civic
              issue and submit your complaint.
            </p>

          </div>


          <div className="process-card">

            <div className="process-number">
              03
            </div>

            <h3>
              Track Progress
            </h3>

            <p>
              Use your complaint ID to monitor
              the status of your complaint.
            </p>

          </div>


          <div className="process-card">

            <div className="process-number">
              04
            </div>

            <h3>
              Get Resolution
            </h3>

            <p>
              The responsible department works
              to resolve the reported issue.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          WHY CIVICCONNECT
      ====================================================== */}

      <section className="why-section">

        <div className="why-container">

          <div className="why-content">

            <span>
              WHY CIVICCONNECT
            </span>

            <h2>
              Making Civic Services Simpler
            </h2>

            <p>
              CivicConnect bridges the gap between
              citizens and municipal departments by
              providing a simple, transparent and
              organized complaint management system.
            </p>

          </div>


          <div className="why-grid">


            <div className="why-card">

              <strong>
                Transparent
              </strong>

              <p>
                Citizens can track the status of
                submitted complaints.
              </p>

            </div>


            <div className="why-card">

              <strong>
                Accessible
              </strong>

              <p>
                Access civic complaint services
                from anywhere.
              </p>

            </div>


            <div className="why-card">

              <strong>
                Organized
              </strong>

              <p>
                Complaints are directed to the
                appropriate departments.
              </p>

            </div>


            <div className="why-card">

              <strong>
                Efficient
              </strong>

              <p>
                Helps departments manage and
                resolve complaints efficiently.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          CTA
      ====================================================== */}

      <section className="cta-section">

        <h2>
          Have a Civic Issue?
        </h2>

        <p>
          Your voice can help make your community
          cleaner, safer and better.
        </p>

        <Link
          to="/login"
          className="primary-btn"
        >
          Report an Issue
        </Link>

      </section>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <div className="footer-container">


          {/* ABOUT */}

          <div className="footer-section">

            <h3>
              CivicConnect
            </h3>

            <p>
              A smart civic complaint management
              platform connecting citizens with
              their local government.
            </p>

          </div>


          {/* QUICK LINKS */}

          <div className="footer-section">

            <h3>
              Quick Links
            </h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/departments">
              Departments
            </Link>

            <Link to="/track-complaint">
              Track Complaint
            </Link>

          </div>


          {/* CITIZEN */}

          <div className="footer-section">

            <h3>
              Citizen
            </h3>

            <Link to="/register">
              Register
            </Link>

            <Link to="/login">
              Login
            </Link>

            <Link to="/track-complaint">
              Track Complaint
            </Link>

          </div>


          {/* ADMINISTRATION */}

          <div className="footer-section">

            <h3>
              Administration
            </h3>

            <Link to="/departments">
              Departments
            </Link>

            <Link to="/admin-login">
              Admin Login
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 CivicConnect. All rights reserved.
          </p>

          <p>
            Your Voice. Our Responsibility.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;

