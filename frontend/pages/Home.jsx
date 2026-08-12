import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // ============================================================
  // LOAD USER + COMPLAINTS
  // ============================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // --------------------------------------------------------
      // GET LOGGED-IN USER
      // --------------------------------------------------------

      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      let loggedUser = null;

      if (storedUser) {
        try {
          loggedUser = JSON.parse(storedUser);
        } catch (error) {
          console.log("User JSON error:", error);
        }
      }

      setUser(loggedUser);

      // --------------------------------------------------------
      // GET COMPLAINTS
      // --------------------------------------------------------

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();

      // --------------------------------------------------------
      // MAKE SURE DATA IS ARRAY
      // --------------------------------------------------------

      const allComplaints = Array.isArray(data)
        ? data
        : data.complaints || [];

      // --------------------------------------------------------
      // GET USER ID
      // --------------------------------------------------------

      const userId =
        loggedUser?.id ||
        loggedUser?.user_id ||
        loggedUser?.userId;

      // --------------------------------------------------------
      // SHOW ONLY LOGGED-IN CITIZEN'S COMPLAINTS
      // --------------------------------------------------------

      let userComplaints = allComplaints;

      if (userId !== undefined && userId !== null) {
        userComplaints = allComplaints.filter(
          (complaint) =>
            String(complaint.user_id) === String(userId)
        );
      }

      // Newest first
      userComplaints.sort(
        (a, b) =>
          Number(b.complaint_id || b.id || 0) -
          Number(a.complaint_id || a.id || 0)
      );

      setComplaints(userComplaints);

      // --------------------------------------------------------
      // CALCULATE STATISTICS
      // --------------------------------------------------------

      const total = userComplaints.length;

      const pending = userComplaints.filter((complaint) => {
        const status = String(complaint.status || "")
          .trim()
          .toLowerCase();

        return (
          status === "pending" ||
          status === "under review"
        );
      }).length;

      const inProgress = userComplaints.filter((complaint) => {
        const status = String(complaint.status || "")
          .trim()
          .toLowerCase();

        return (
          status === "in progress" ||
          status === "department processing"
        );
      }).length;

      const resolved = userComplaints.filter((complaint) => {
        const status = String(complaint.status || "")
          .trim()
          .toLowerCase();

        return status === "resolved";
      }).length;

      setStats({
        total,
        pending,
        inProgress,
        resolved,
      });
    } catch (error) {
      console.error("Dashboard error:", error);

      setComplaints([]);

      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SIGN OUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    navigate("/login");
  };

  // ============================================================
  // USER DETAILS
  // ============================================================

  const userName =
    user?.name ||
    user?.username ||
    user?.full_name ||
    "Abisha";

  const userEmail =
    user?.email ||
    "abisha@example.com";

  const userId =
    user?.id ||
    user?.user_id ||
    user?.userId ||
    1;

  const firstLetter = userName.charAt(0).toUpperCase();

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const getStatusClass = (status) => {
    const value = String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (value === "resolved") {
      return "status-resolved";
    }

    if (
      value === "in-progress" ||
      value === "department-processing"
    ) {
      return "status-progress";
    }

    if (
      value === "under-review" ||
      value === "pending"
    ) {
      return "status-pending";
    }

    return "status-default";
  };

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "Recently";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  // ============================================================
  // RECENT COMPLAINTS
  // ============================================================

  const recentComplaints = complaints.slice(0, 5);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="citizen-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="citizen-header">

        <div className="citizen-brand">
          <div className="brand-icon">C</div>

          <div>
            <h1>CivicConnect</h1>
            <span>Citizen Portal</span>
          </div>
        </div>

        <div className="citizen-user-area">

          <div className="user-mini">
            <div className="user-avatar-small">
              {firstLetter}
            </div>

            <div className="user-mini-details">
              <strong>{userName}</strong>
              <span>{userEmail}</span>
            </div>
          </div>

          <button
            className="header-logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </div>
      </header>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="citizen-main">

        {/* ====================================================
            WELCOME
        ==================================================== */}

        <section className="welcome-section">

          <div>
            <p className="welcome-label">
              CITIZEN PORTAL
            </p>

            <h2>
              Welcome, {userName}
            </h2>

            <p className="welcome-text">
              Manage your civic complaints, track updates,
              and access public services from your dashboard.
            </p>
          </div>

          <div className="welcome-avatar">
            {firstLetter}
          </div>

        </section>

        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <section className="stats-grid">

          <div className="stat-card total-card">
            <div className="stat-icon">📋</div>

            <div>
              <p>Total Complaints</p>

              <h3>
                {loading ? "..." : stats.total}
              </h3>

              <span>
                All submitted complaints
              </span>
            </div>
          </div>

          <div className="stat-card pending-card">
            <div className="stat-icon">⏳</div>

            <div>
              <p>Pending</p>

              <h3>
                {loading ? "..." : stats.pending}
              </h3>

              <span>
                Awaiting action
              </span>
            </div>
          </div>

          <div className="stat-card progress-card">
            <div className="stat-icon">🔄</div>

            <div>
              <p>In Progress</p>

              <h3>
                {loading ? "..." : stats.inProgress}
              </h3>

              <span>
                Currently being handled
              </span>
            </div>
          </div>

          <div className="stat-card resolved-card">
            <div className="stat-icon">✓</div>

            <div>
              <p>Resolved</p>

              <h3>
                {loading ? "..." : stats.resolved}
              </h3>

              <span>
                Successfully resolved
              </span>
            </div>
          </div>

        </section>

        {/* ====================================================
            QUICK ACTIONS
        ==================================================== */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <p className="section-label">
                QUICK ACTIONS
              </p>

              <h2>
                What would you like to do?
              </h2>
            </div>
          </div>

          <div className="quick-actions-grid">

            <Link
              to="/submit-complaint"
              className="action-card"
            >
              <div className="action-icon">
                📝
              </div>

              <div className="action-content">
                <h3>
                  Register Complaint
                </h3>

                <p>
                  Report a civic issue to the
                  concerned department.
                </p>

                <span className="action-arrow">
                  →
                </span>
              </div>
            </Link>

            <Link
              to="/track-complaint"
              className="action-card"
            >
              <div className="action-icon">
                🔎
              </div>

              <div className="action-content">
                <h3>
                  Track Complaint
                </h3>

                <p>
                  Check the status and progress
                  of your complaint.
                </p>

                <span className="action-arrow">
                  →
                </span>
              </div>
            </Link>

            <Link
              to="/departments"
              className="action-card"
            >
              <div className="action-icon">
                🏢
              </div>

              <div className="action-content">
                <h3>
                  Government Departments
                </h3>

                <p>
                  Explore departments and their
                  civic services.
                </p>

                <span className="action-arrow">
                  →
                </span>
              </div>
            </Link>

            <Link
              to="/announcements"
              className="action-card"
            >
              <div className="action-icon">
                📢
              </div>

              <div className="action-content">
                <h3>
                  Public Announcements
                </h3>

                <p>
                  View important government
                  notices and updates.
                </p>

                <span className="action-arrow">
                  →
                </span>
              </div>
            </Link>

          </div>

        </section>

        {/* ====================================================
            ACTIVITY + ACCOUNT
        ==================================================== */}

        <div className="dashboard-columns">

          {/* ==================================================
              RECENT COMPLAINTS
          ================================================== */}

          <section className="dashboard-box">

            <div className="box-header">

              <div>
                <p className="section-label">
                  ACTIVITY
                </p>

                <h2>
                  Recent Complaints
                </h2>
              </div>

              {complaints.length > 0 && (
                <Link
                  to="/track-complaint"
                  className="view-all"
                >
                  View All →
                </Link>
              )}

            </div>

            <div className="complaints-list">

              {loading ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    ⏳
                  </div>

                  <h3>
                    Loading complaints...
                  </h3>
                </div>
              ) : recentComplaints.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon">
                    📋
                  </div>

                  <h3>
                    No complaints yet
                  </h3>

                  <p>
                    Your submitted complaints will
                    appear here once you register
                    an issue.
                  </p>

                  <Link
                    to="/submit-complaint"
                    className="primary-button"
                  >
                    Register Your First Complaint
                  </Link>

                </div>

              ) : (

                recentComplaints.map((complaint) => (

                  <div
                    className="complaint-row"
                    key={
                      complaint.complaint_id ||
                      complaint.id
                    }
                  >

                    <div className="complaint-number">
                      #
                      {complaint.complaint_id ||
                        complaint.id}
                    </div>

                    <div className="complaint-details">

                      <h3>
                        {complaint.title ||
                          complaint.subcategory ||
                          "Civic Complaint"}
                      </h3>

                      <p>
                        {complaint.category ||
                          "General"}
                        {" • "}
                        {formatDate(
                          complaint.created_at
                        )}
                      </p>

                    </div>

                    <span
                      className={`complaint-status ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status ||
                        "Pending"}
                    </span>

                  </div>

                ))

              )}

            </div>

          </section>

          {/* ==================================================
              ACCOUNT
          ================================================== */}

          <section className="dashboard-box account-box">

            <div className="box-header">

              <div>
                <p className="section-label">
                  ACCOUNT
                </p>

                <h2>
                  My Profile
                </h2>
              </div>

            </div>

            <div className="profile-details">

              <div className="profile-avatar">
                {firstLetter}
              </div>

              <div className="profile-row">
                <span>Name</span>
                <strong>{userName}</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>{userEmail}</strong>
              </div>

              <div className="profile-row">
                <span>User ID</span>
                <strong>{userId}</strong>
              </div>

            </div>

          </section>

        </div>

        {/* ====================================================
            HELP + IMPORTANT
        ==================================================== */}

        <div className="bottom-grid">

          <section className="info-card help-card">

            <div className="info-icon">
              💬
            </div>

            <div>
              <p className="section-label">
                NEED HELP?
              </p>

              <h2>
                CivicConnect Support
              </h2>

              <p>
                Need assistance with your complaint
                or account?
              </p>

              <Link
                to="/support"
                className="text-link"
              >
                Contact Support →
              </Link>
            </div>

          </section>

          <section className="info-card important-card">

            <div className="info-icon">
              ℹ️
            </div>

            <div>
              <p className="section-label">
                IMPORTANT
              </p>

              <h2>
                Before submitting
              </h2>

              <p>
                Provide accurate location details
                and a clear description of the civic
                issue to help the department process
                your complaint efficiently.
              </p>
            </div>

          </section>

        </div>

        {/* ====================================================
            SIGN OUT
        ==================================================== */}

        <section className="signout-section">

          <div>
            <p className="section-label">
              ACCOUNT ACTION
            </p>

            <h2>
              Sign Out
            </h2>

            <p>
              Sign out of your CivicConnect citizen
              account.
            </p>
          </div>

          <button
            className="signout-button"
            onClick={handleLogout}
          >
            Sign Out
          </button>

        </section>

      </main>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="citizen-footer">

        <div>
          <strong>CivicConnect</strong>
          <span>
            Smart Public Complaint Management System
          </span>
        </div>

        <p>
          Your Voice. Our Responsibility.
        </p>

      </footer>

    </div>
  );
}

export default Home;