
import React from "react";
import "./Home.css";

const services = [
  {
    icon: "📝",
    title: "Register a Complaint",
    description:
      "Report civic issues to the concerned department quickly and securely.",
    link: "/register-complaint",
  },
  {
    icon: "🔍",
    title: "Track Complaint",
    description:
      "Check the current status and progress of your registered complaint.",
    link: "/track-complaint",
  },
  {
    icon: "🏢",
    title: "Departments",
    description:
      "Find departments and authorities responsible for different civic services.",
    link: "/departments",
  },
  {
    icon: "📢",
    title: "Public Notices",
    description:
      "Stay informed about important announcements and civic updates.",
    link: "/notices",
  },
  {
    icon: "📍",
    title: "Civic Services",
    description:
      "Access important public services and information from one platform.",
    link: "/services",
  },
  {
    icon: "❓",
    title: "Help & Support",
    description:
      "Get assistance with complaints, services and using CivicConnect.",
    link: "/help",
  },
];

const categories = [
  "Roads & Infrastructure",
  "Water Supply",
  "Street Lighting",
  "Sanitation & Waste",
  "Drainage",
  "Public Transport",
  "Electricity",
  "Public Safety",
  "Parks & Public Spaces",
  "Other Civic Issues",
];

const notices = [
  {
    date: "10",
    month: "AUG",
    title: "CivicConnect digital complaint services are now available.",
    description:
      "Citizens can register and track public complaints through the online portal.",
  },
  {
    date: "08",
    month: "AUG",
    title: "Important public service information for citizens.",
    description:
      "Please check the latest announcements from your concerned department.",
  },
  {
    date: "05",
    month: "AUG",
    title: "Department service updates and maintenance schedule.",
    description:
      "Some online services may experience temporary interruptions during maintenance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Submit",
    text: "Register your civic complaint with the required details, location and supporting evidence.",
  },
  {
    number: "02",
    title: "Verify",
    text: "The concerned authority reviews the complaint and verifies the submitted information.",
  },
  {
    number: "03",
    title: "Assign",
    text: "The complaint is forwarded to the responsible department or field officer.",
  },
  {
    number: "04",
    title: "Resolve",
    text: "The concerned department takes appropriate action to address the reported issue.",
  },
  {
    number: "05",
    title: "Track",
    text: "Citizens can monitor the complaint status until the issue is resolved.",
  },
];

function Home() {
  return (
    <div className="civic-home">

      {/* =====================================================
          GOVERNMENT TOP BAR
      ====================================================== */}
      <div className="gov-topbar">
        <div className="container gov-topbar-inner">
          <div className="gov-left">
            <span>Government Public Service Portal</span>
          </div>

          <div className="gov-right">
            <a href="#main-content">Skip to Main Content</a>
            <span className="top-divider">|</span>
            <a href="#accessibility">Accessibility</a>
            <span className="top-divider">|</span>
            <button className="language-button">English ▾</button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
      ====================================================== */}
      <header className="main-header">
        <div className="container header-inner">

          <a href="/" className="brand">
            <div className="brand-emblem">
              <span>CC</span>
            </div>

            <div className="brand-text">
              <h1>CivicConnect</h1>
              <p>Smart Public Complaint Management System</p>
            </div>
          </a>

          <div className="header-actions">
            <button className="search-button" aria-label="Search">
              <span>⌕</span>
              <span>Search</span>
            </button>

            <a href="/login" className="login-button">
              Citizen Login
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="main-nav">
        <div className="container nav-inner">

          <a href="/" className="nav-link active">
            Home
          </a>

          <a href="/about" className="nav-link">
            About CivicConnect
          </a>

          <a href="/register-complaint" className="nav-link">
            Register Complaint
          </a>

          <a href="/track-complaint" className="nav-link">
            Track Complaint
          </a>

          <a href="/departments" className="nav-link">
            Departments
          </a>

          <a href="/services" className="nav-link">
            Citizen Services
          </a>

          <a href="/notices" className="nav-link">
            Notices
          </a>

          <a href="/contact" className="nav-link">
            Contact Us
          </a>

        </div>
      </nav>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main id="main-content">

        {/* =================================================
            HERO
        ================================================== */}
        <section className="hero-section">
          <div className="container hero-grid">

            <div className="hero-content">

              <div className="hero-label">
                <span className="hero-label-line"></span>
                <span>Citizen-Centric Digital Governance</span>
              </div>

              <h2>
                Report. Track.
                <br />
                <span>Resolve.</span>
              </h2>

              <p className="hero-description">
                CivicConnect is a digital public complaint management
                platform that enables citizens to report civic issues,
                monitor their progress and receive transparent updates
                from the concerned authorities.
              </p>

              <div className="hero-buttons">
                <a
                  href="/register-complaint"
                  className="primary-button"
                >
                  Register a Complaint
                  <span>→</span>
                </a>

                <a
                  href="/track-complaint"
                  className="secondary-button"
                >
                  Track Complaint
                </a>
              </div>

              <div className="hero-note">
                <span className="note-icon">✓</span>
                <span>
                  One platform for transparent and accountable civic services.
                </span>
              </div>
            </div>

            {/* HERO INFORMATION PANEL */}
            <div className="hero-panel">

              <div className="panel-heading">
                <div>
                  <span className="panel-small-title">
                    CIVICCONNECT DASHBOARD
                  </span>

                  <h3>Public Complaint Status</h3>
                </div>

                <span className="status-dot"></span>
              </div>

              <div className="hero-stat-grid">

                <div className="hero-stat">
                  <span className="stat-number">12,458</span>
                  <span className="stat-label">Total Complaints</span>
                </div>

                <div className="hero-stat">
                  <span className="stat-number">9,842</span>
                  <span className="stat-label">Resolved</span>
                </div>

                <div className="hero-stat">
                  <span className="stat-number">1,436</span>
                  <span className="stat-label">Under Review</span>
                </div>

                <div className="hero-stat">
                  <span className="stat-number">1,180</span>
                  <span className="stat-label">In Progress</span>
                </div>

              </div>

              <div className="resolution-bar-area">
                <div className="resolution-header">
                  <span>Resolution Progress</span>
                  <strong>79%</strong>
                </div>

                <div className="resolution-bar">
                  <div className="resolution-progress"></div>
                </div>

                <p>
                  Complaints are monitored through a transparent
                  digital workflow.
                </p>
              </div>

              <a href="/dashboard" className="panel-link">
                View Public Dashboard →
              </a>

            </div>
          </div>
        </section>

        {/* =================================================
            QUICK SERVICES
        ================================================== */}
        <section className="services-section">
          <div className="container">

            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  ONLINE SERVICES
                </span>

                <h2>Citizen Services</h2>
              </div>

              <p>
                Access essential civic services and complaint
                management facilities from one convenient platform.
              </p>
            </div>

            <div className="services-grid">

              {services.map((service, index) => (
                <a
                  href={service.link}
                  className="service-card"
                  key={index}
                >
                  <div className="service-icon">
                    {service.icon}
                  </div>

                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>

                    <span className="service-arrow">
                      Access Service →
                    </span>
                  </div>
                </a>
              ))}

            </div>
          </div>
        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================== */}
        <section className="workflow-section">
          <div className="container">

            <div className="center-heading">
              <span className="section-kicker">
                COMPLAINT MANAGEMENT PROCESS
              </span>

              <h2>How CivicConnect Works</h2>

              <p>
                A simple and transparent process for registering,
                managing and resolving public complaints.
              </p>
            </div>

            <div className="workflow">

              {steps.map((step, index) => (
                <div className="workflow-item" key={index}>

                  <div className="workflow-number">
                    {step.number}
                  </div>

                  <div className="workflow-content">
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="workflow-line"></div>
                  )}

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* =================================================
            COMPLAINT CATEGORIES
        ================================================== */}
        <section className="categories-section">
          <div className="container">

            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  CIVIC ISSUES
                </span>

                <h2>Complaint Categories</h2>
              </div>

              <p>
                Select the category that best describes the public
                issue you want to report.
              </p>
            </div>

            <div className="category-grid">

              {categories.map((category, index) => (
                <a
                  href="/register-complaint"
                  className="category-item"
                  key={index}
                >
                  <span className="category-icon">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{category}</span>

                  <span className="category-arrow">→</span>
                </a>
              ))}

            </div>

          </div>
        </section>

        {/* =================================================
            TRANSPARENCY DASHBOARD
        ================================================== */}
        <section className="statistics-section">
          <div className="container">

            <div className="statistics-header">
              <div>
                <span className="section-kicker">
                  TRANSPARENCY & ACCOUNTABILITY
                </span>

                <h2>Public Complaint Statistics</h2>

                <p>
                  CivicConnect provides public-facing information
                  to promote transparency in complaint management.
                </p>
              </div>

              <a href="/dashboard" className="outline-button">
                View Full Dashboard →
              </a>
            </div>

            <div className="statistics-grid">

              <div className="stat-card">
                <span className="big-stat">12,458</span>
                <span>Total Complaints</span>
                <small>Registered through CivicConnect</small>
              </div>

              <div className="stat-card">
                <span className="big-stat">9,842</span>
                <span>Complaints Resolved</span>
                <small>Successfully addressed by departments</small>
              </div>

              <div className="stat-card">
                <span className="big-stat">1,436</span>
                <span>Under Review</span>
                <small>Currently being verified</small>
              </div>

              <div className="stat-card">
                <span className="big-stat">79%</span>
                <span>Resolution Rate</span>
                <small>Overall complaint resolution</small>
              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            NOTICES
        ================================================== */}
        <section className="notices-section">
          <div className="container">

            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  INFORMATION CENTRE
                </span>

                <h2>Latest Notices</h2>
              </div>

              <a href="/notices" className="view-all">
                View All Notices →
              </a>
            </div>

            <div className="notices-list">

              {notices.map((notice, index) => (
                <a
                  href="/notices"
                  className="notice-card"
                  key={index}
                >

                  <div className="notice-date">
                    <strong>{notice.date}</strong>
                    <span>{notice.month}</span>
                  </div>

                  <div className="notice-content">
                    <h3>{notice.title}</h3>
                    <p>{notice.description}</p>
                  </div>

                  <span className="notice-arrow">→</span>

                </a>
              ))}

            </div>

          </div>
        </section>

        {/* =================================================
            WHY CIVICCONNECT
        ================================================== */}
        <section className="why-section">
          <div className="container why-grid">

            <div className="why-intro">

              <span className="section-kicker">
                OUR COMMITMENT
              </span>

              <h2>
                Building a more responsive and accountable community.
              </h2>

              <p>
                CivicConnect uses technology to bring citizens and
                public authorities together through a transparent,
                structured and accessible complaint management system.
              </p>

              <a href="/about" className="primary-button">
                Learn More About CivicConnect
                <span>→</span>
              </a>

            </div>

            <div className="why-features">

              <div className="why-feature">
                <div className="why-icon">01</div>
                <div>
                  <h3>Transparency</h3>
                  <p>
                    Citizens can monitor the progress of complaints
                    and receive status updates.
                  </p>
                </div>
              </div>

              <div className="why-feature">
                <div className="why-icon">02</div>
                <div>
                  <h3>Accountability</h3>
                  <p>
                    Complaints are routed to the appropriate
                    department for action.
                  </p>
                </div>
              </div>

              <div className="why-feature">
                <div className="why-icon">03</div>
                <div>
                  <h3>Accessibility</h3>
                  <p>
                    Essential civic complaint services are
                    available through a single digital platform.
                  </p>
                </div>
              </div>

              <div className="why-feature">
                <div className="why-icon">04</div>
                <div>
                  <h3>Efficiency</h3>
                  <p>
                    Digital workflows help reduce delays and
                    improve complaint management.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            EMERGENCY NOTICE
        ================================================== */}
        <section className="emergency-section">
          <div className="container emergency-inner">

            <div className="emergency-icon">
              !
            </div>

            <div className="emergency-content">
              <span>IMPORTANT INFORMATION</span>

              <h2>Emergency Services</h2>

              <p>
                CivicConnect is intended for civic complaints and
                public service issues. For immediate emergencies,
                please contact the appropriate emergency service.
              </p>
            </div>

            <a href="/emergency" className="emergency-button">
              Emergency Information →
            </a>

          </div>
        </section>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="site-footer">

        <div className="container footer-main">

          <div className="footer-brand">

            <div className="footer-logo">
              CC
            </div>

            <h2>CivicConnect</h2>

            <p>
              Smart Public Complaint Management System
            </p>

            <span>
              A digital platform for transparent,
              accountable and citizen-centric civic services.
            </span>

          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>

            <a href="/">Home</a>
            <a href="/about">About CivicConnect</a>
            <a href="/register-complaint">Register Complaint</a>
            <a href="/track-complaint">Track Complaint</a>
            <a href="/departments">Departments</a>
          </div>

          <div className="footer-column">
            <h3>Citizen Services</h3>

            <a href="/services">Citizen Services</a>
            <a href="/notices">Public Notices</a>
            <a href="/dashboard">Public Dashboard</a>
            <a href="/help">Help Centre</a>
            <a href="/faq">Frequently Asked Questions</a>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>

            <p>📧 support@civicconnect.gov</p>
            <p>☎ Citizen Support: 1800-XXX-XXXX</p>
            <p>📍 Public Service Administration</p>

            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/accessibility">Accessibility</a>
              <a href="/terms">Terms of Use</a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">

            <p>
              © 2026 CivicConnect. All Rights Reserved.
            </p>

            <p>
              Designed for transparent and citizen-centric public service delivery.
            </p>

          </div>
        </div>

      </footer>

    </div>
  );
}

export default Home;

