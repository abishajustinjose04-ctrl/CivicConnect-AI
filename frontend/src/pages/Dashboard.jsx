
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [complaintError, setComplaintError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("civicconnect_user");

    if (!savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      const userId = parsedUser.user_id || parsedUser.id;

      if (!parsedUser || !userId) {
        localStorage.removeItem("civicconnect_user");
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);

      loadComplaints(userId);
    } catch (error) {
      console.error("Invalid user session:", error);

      localStorage.removeItem("civicconnect_user");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ============================================================
  // LOAD LOGGED-IN CITIZEN COMPLAINTS
  // ============================================================

  const loadComplaints = async (userId) => {
    try {
      setLoadingComplaints(true);
      setComplaintError("");

      const response = await fetch(
        `${API_BASE_URL}/my_complaints/${userId}`
      );

      const data = await response.json();

      console.log("MY COMPLAINTS:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load complaints."
        );
      }

      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        setComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error("Dashboard complaint error:", error);

      setComplaintError(
        "Unable to load your complaints."
      );

      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("civicconnect_user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("civicconnect_remember");

    navigate("/login", { replace: true });
  };

  // ============================================================
  // COMPLAINT STATISTICS
  // ============================================================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter((complaint) => {
    const status = String(
      complaint.status || ""
    ).toLowerCase();

    return (
      status === "submitted" ||
      status === "pending" ||
      status === "department processing" ||
      status === "under review"
    );
  }).length;

  const inProgressComplaints = complaints.filter((complaint) => {
    const status = String(
      complaint.status || ""
    ).toLowerCase();

    return status === "in progress";
  }).length;

  const resolvedComplaints = complaints.filter((complaint) => {
    const status = String(
      complaint.status || ""
    ).toLowerCase();

    return (
      status === "resolved" ||
      status === "closed"
    );
  }).length;

  // ============================================================
  // LOADING USER
  // ============================================================

  if (!user) {
    return (
      <main className="dashboard-loading">
        <p>Loading your dashboard...</p>
      </main>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main>

      {/* ================= DASHBOARD HEADER ================= */}

      <section className="dashboard-header">

        <div>

          <span>
            CITIZEN PORTAL
          </span>

          <h1>
            Welcome, {user.name || "Citizen"}
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
              : "C"}
          </div>

          <div>

            <strong>
              {user.name || "Citizen"}
            </strong>

            <span>
              {user.email || ""}
            </span>

          </div>

        </div>

      </section>


      {/* ================= STATISTICS ================= */}

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


      {/* ================= MAIN CONTENT ================= */}

      <section className="dashboard-content">

        <div className="dashboard-main">


          {/* QUICK ACTIONS */}

          <div className="dashboard-section-title">

            <span>
              QUICK ACTIONS
            </span>

            <h2>
              What would you like to do?
            </h2>

          </div>


          <div className="dashboard-actions">

            <Link
              to="/submit-complaint"
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
                  Report a civic issue to the concerned department.
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
                  Check the status and progress of your complaint.
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
                  Explore departments and their civic services.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

          </div>


          {/* RECENT COMPLAINTS */}

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
                Please wait while we fetch your complaints.
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
                Your submitted complaints will appear here once
                you register an issue.
              </p>

              <Link
                to="/submit-complaint"
                className="primary-btn"
              >
                Register Your First Complaint
              </Link>

            </div>

          ) : (

            <div className="dashboard-complaints-list">

              {complaints.slice(0, 5).map((complaint) => (

                <div
                  className="dashboard-complaint-card"
                  key={complaint.complaint_id}
                >

                  <div>

                    <span>
                      Complaint #{complaint.complaint_id}
                    </span>

                    <h3>
                      {complaint.title}
                    </h3>

                    <p>
                      {complaint.description}
                    </p>

                  </div>


                  <div className="dashboard-complaint-status">

                    <strong>
                      {complaint.status ||
                        "Department Processing"}
                    </strong>

                    <small>
                      {complaint.department_name ||
                        "Not Assigned"}
                    </small>

                    <Link
                      to={`/track-complaint?id=${complaint.complaint_id}`}
                    >
                      Track →
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ================= SIDEBAR ================= */}

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
                  {user.name || "Citizen"}
                </strong>

              </div>


              <div>

                <small>
                  Email
                </small>

                <strong>
                  {user.email || "Not available"}
                </strong>

              </div>


              <div>

                <small>
                  User ID
                </small>

                <strong>
                  {user.user_id || user.id || "Citizen"}
                </strong>

              </div>

            </div>

          </div>


          {/* IMPORTANT NOTICE */}

          <div className="dashboard-side-card dashboard-notice">

            <span>
              IMPORTANT
            </span>

            <h3>
              Before submitting
            </h3>

            <p>
              Provide accurate location details and a clear
              description of the civic issue to help the
              department process your complaint efficiently.
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
              Sign out of your CivicConnect citizen account.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="auth-submit"
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

