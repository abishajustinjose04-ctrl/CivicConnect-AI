import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "./api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [complaintError, setComplaintError] = useState("");

  // ============================================================
  // LOAD USER
  // ============================================================

  useEffect(() => {
    const savedUser = localStorage.getItem("civicconnect_user");

    if (!savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (!parsedUser || !parsedUser.name) {
        localStorage.removeItem("civicconnect_user");
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);

    } catch (error) {
      console.error("Invalid user session:", error);

      localStorage.removeItem("civicconnect_user");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ============================================================
  // LOAD USER COMPLAINTS
  // ============================================================

  useEffect(() => {
    if (!user) return;

    const userId =
      user.user_id ||
      localStorage.getItem("user_id");

    if (!userId) {
      setComplaintError("User ID not found.");
      setLoadingComplaints(false);
      return;
    }

    const loadComplaints = async () => {
      try {
        setLoadingComplaints(true);
        setComplaintError("");

        const response = await fetch(
          `${API_BASE_URL}/my_complaints/${userId}`
        );

        const data = await response.json();

        console.log("User complaints:", data);

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Unable to load complaints."
          );
        }

        // --------------------------------------------------------
        // SUPPORT DIFFERENT BACKEND RESPONSE FORMATS
        // --------------------------------------------------------

        if (Array.isArray(data)) {
          setComplaints(data);
        } else if (Array.isArray(data.complaints)) {
          setComplaints(data.complaints);
        } else if (Array.isArray(data.data)) {
          setComplaints(data.data);
        } else {
          setComplaints([]);
        }

      } catch (error) {
        console.error(
          "Complaint history error:",
          error
        );

        setComplaintError(
          error.message ||
            "Unable to load complaint history."
        );

        setComplaints([]);

      } finally {
        setLoadingComplaints(false);
      }
    };

    loadComplaints();

  }, [user]);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("civicconnect_user");

    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");

    navigate("/login", { replace: true });
  };

  // ============================================================
  // STATUS HELPERS
  // ============================================================

  const getStatus = (complaint) => {
    return String(
      complaint.status ||
      complaint.complaint_status ||
      "Pending"
    ).trim();
  };

  const isStatus = (complaint, status) => {
    return (
      getStatus(complaint).toLowerCase() ===
      status.toLowerCase()
    );
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      isStatus(complaint, "Pending")
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      isStatus(complaint, "In Progress")
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) =>
      isStatus(complaint, "Resolved")
  ).length;

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (complaint) => {
    const date =
      complaint.created_at ||
      complaint.created_on ||
      complaint.date ||
      complaint.submitted_at;

    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (!user) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <main className="citizen-dashboard">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="dashboard-header">

        <div className="dashboard-header-text">

          <span>
            CITIZEN PORTAL
          </span>

          <h1>
            Welcome, {user.name}
          </h1>

          <p>
            Manage your civic complaints, track updates,
            and access public services from your dashboard.
          </p>

        </div>

        <div className="dashboard-profile">

          <div className="profile-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="profile-info">

            <strong>
              {user.name}
            </strong>

            <span>
              {user.email}
            </span>

          </div>

        </div>

      </section>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">

          <span>
            Total Complaints
          </span>

          <strong>
            {totalComplaints}
          </strong>

          <small>
            All submitted complaints
          </small>

        </div>

        <div className="dashboard-stat">

          <span>
            Pending
          </span>

          <strong>
            {pendingComplaints}
          </strong>

          <small>
            Awaiting action
          </small>

        </div>

        <div className="dashboard-stat">

          <span>
            In Progress
          </span>

          <strong>
            {inProgressComplaints}
          </strong>

          <small>
            Currently being handled
          </small>

        </div>

        <div className="dashboard-stat">

          <span>
            Resolved
          </span>

          <strong>
            {resolvedComplaints}
          </strong>

          <small>
            Successfully resolved
          </small>

        </div>

      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <section className="dashboard-content">

        {/* ====================================================
            MAIN
        ==================================================== */}

        <div className="dashboard-main">

          <div className="dashboard-section-title">

            <span>
              QUICK ACTIONS
            </span>

            <h2>
              What would you like to do?
            </h2>

          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="dashboard-actions">

            <Link
              to="/complaints"
              className="dashboard-action"
            >

              <div className="action-icon">
                📝
              </div>

              <div>

                <h3>
                  Register Complaint
                </h3>

                <p>
                  Report a civic issue to the concerned
                  department.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            <Link
              to="/track-complaint"
              className="dashboard-action"
            >

              <div className="action-icon">
                🔎
              </div>

              <div>

                <h3>
                  Track Complaint
                </h3>

                <p>
                  Check the status and progress of your
                  complaint.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            <Link
              to="/departments"
              className="dashboard-action"
            >

              <div className="action-icon">
                🏢
              </div>

              <div>

                <h3>
                  Government Departments
                </h3>

                <p>
                  Explore departments and their civic
                  services.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            <Link
              to="/announcements"
              className="dashboard-action"
            >

              <div className="action-icon">
                📢
              </div>

              <div>

                <h3>
                  Public Announcements
                </h3>

                <p>
                  View important government notices
                  and updates.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

          </div>

          {/* ==================================================
              RECENT COMPLAINTS
          ================================================== */}

          <div className="dashboard-section-title recent-title">

            <span>
              ACTIVITY
            </span>

            <h2>
              Recent Complaints
            </h2>

          </div>

          {complaintError && (
            <div className="complaint-error">
              {complaintError}
            </div>
          )}

          {loadingComplaints ? (

            <div className="empty-complaints">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while we load your complaint
                history.
              </p>

            </div>

          ) : complaints.length === 0 ? (

            <div className="empty-complaints">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No complaints yet
              </h3>

              <p>
                Your submitted complaints will appear
                here once you register an issue.
              </p>

              <Link
                to="/complaints"
                className="primary-btn"
              >
                Register Your First Complaint
              </Link>

            </div>

          ) : (

            <div className="complaint-history">

              {complaints
                .slice()
                .reverse()
                .map((complaint, index) => (

                  <div
                    className="complaint-history-card"
                    key={
                      complaint.complaint_id ||
                      complaint.id ||
                      index
                    }
                  >

                    <div className="complaint-history-top">

                      <div>

                        <span>
                          COMPLAINT ID
                        </span>

                        <strong>
                          {complaint.complaint_id ||
                            complaint.id ||
                            "N/A"}
                        </strong>

                      </div>

                      <span
                        className={`complaint-status ${getStatus(
                          complaint
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {getStatus(complaint)}
                      </span>

                    </div>

                    <h3>
                      {complaint.title ||
                        complaint.complaint_title ||
                        "Civic Complaint"}
                    </h3>

                    <p>
                      {complaint.description ||
                        "No description available."}
                    </p>

                    <div className="complaint-history-details">

                      <div>

                        <small>
                          Department
                        </small>

                        <strong>
                          {complaint.department_name ||
                            complaint.department ||
                            "Not assigned"}
                        </strong>

                      </div>

                      <div>

                        <small>
                          Category
                        </small>

                        <strong>
                          {complaint.category ||
                            "Not specified"}
                        </strong>

                      </div>

                      <div>

                        <small>
                          Submitted
                        </small>

                        <strong>
                          {formatDate(complaint)}
                        </strong>

                      </div>

                    </div>

                    <div className="complaint-history-action">

                      <Link
                        to="/track-complaint"
                        className="dashboard-help-link"
                      >
                        Track Complaint →
                      </Link>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside className="dashboard-sidebar">

          {/* PROFILE */}

          <div className="dashboard-side-card">

            <span>
              ACCOUNT
            </span>

            <h3>
              My Profile
            </h3>

            <div className="profile-details">

              <div>

                <small>
                  Name
                </small>

                <strong>
                  {user.name}
                </strong>

              </div>

              <div>

                <small>
                  Email
                </small>

                <strong>
                  {user.email}
                </strong>

              </div>

              <div>

                <small>
                  Phone
                </small>

                <strong>
                  {user.phone || "Not provided"}
                </strong>

              </div>

              <div>

                <small>
                  User ID
                </small>

                <strong>
                  {user.user_id || "N/A"}
                </strong>

              </div>

            </div>

          </div>

          {/* SUPPORT */}

          <div className="dashboard-side-card">

            <span>
              NEED HELP?
            </span>

            <h3>
              CivicConnect Support
            </h3>

            <p>
              Need assistance with your complaint
              or account?
            </p>

            <Link
              to="/contact"
              className="dashboard-help-link"
            >
              Contact Support →
            </Link>

          </div>

          {/* NOTICE */}

          <div className="dashboard-side-card dashboard-notice">

            <span>
              IMPORTANT
            </span>

            <h3>
              Before submitting
            </h3>

            <p>
              Provide accurate location details and
              a clear description of the civic issue
              to help the department process your
              complaint efficiently.
            </p>

          </div>

          {/* SIGN OUT */}

          <div className="dashboard-side-card">

            <span>
              ACCOUNT ACTION
            </span>

            <h3>
              Sign Out
            </h3>

            <p>
              Sign out of your CivicConnect citizen
              account.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="dashboard-logout-btn"
            >
              Sign Out
            </button>

          </div>

        </aside>

      </section>

    </main>
  );
}

export default Dashboard;