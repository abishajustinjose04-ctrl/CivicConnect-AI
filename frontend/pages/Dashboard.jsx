import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./api";

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCitizenData();
  }, []);

  const loadCitizenData = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const loggedUser = JSON.parse(storedUser);

      console.log("LOGGED USER:", loggedUser);

      setUser(loggedUser);

      const userId =
        loggedUser.user_id ||
        loggedUser.id;

      if (!userId) {
        console.error("User ID not found:", loggedUser);
        setComplaints([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/my_complaints/${userId}`
      );

      const data = await response.json();

      console.log("MY COMPLAINTS RESPONSE:", data);

      if (!response.ok) {
        console.error("Complaint API error:", data);
        setComplaints([]);
        return;
      }

      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        setComplaints([]);
      }

    } catch (error) {
      console.error(
        "CITIZEN DASHBOARD ERROR:",
        error
      );

      setComplaints([]);

    } finally {
      setLoading(false);
    }
  };

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter((complaint) => {
    const status = String(
      complaint.status || ""
    ).trim().toLowerCase();

    return (
      status === "submitted" ||
      status === "pending" ||
      status === "under review" ||
      status === "department processing"
    );
  }).length;

  const inProgressComplaints = complaints.filter((complaint) => {
    const status = String(
      complaint.status || ""
    ).trim().toLowerCase();

    return status === "in progress";
  }).length;

  const resolvedComplaints = complaints.filter((complaint) => {
    const status = String(
      complaint.status || ""
    ).trim().toLowerCase();

    return status === "resolved";
  }).length;

  const displayName =
    user?.name ||
    "Citizen";

  const displayEmail =
    user?.email ||
    "";

  const displayUserId =
    user?.user_id ||
    user?.id ||
    "";

  if (loading) {
    return (
      <div className="citizen-dashboard">
        <div className="dashboard-container">
          <h2>Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="citizen-dashboard">

      {/* ================= HEADER ================= */}

      <section className="citizen-header">

        <div>

          <span className="portal-label">
            CITIZEN PORTAL
          </span>

          <h1>
            Welcome, {displayName}
          </h1>

          <p>
            Manage your civic complaints, track updates,
            and access public services from your dashboard.
          </p>

        </div>

        <div className="citizen-profile">

          <div className="profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>

            <strong>
              {displayName}
            </strong>

            <p>
              {displayEmail}
            </p>

          </div>

        </div>

      </section>


      {/* ================= STATISTICS ================= */}

      <section className="stats-grid">

        <div className="stat-card">

          <h3>
            Total Complaints
          </h3>

          <strong>
            {totalComplaints}
          </strong>

          <p>
            All submitted complaints
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Pending
          </h3>

          <strong>
            {pendingComplaints}
          </strong>

          <p>
            Awaiting action
          </p>

        </div>


        <div className="stat-card">

          <h3>
            In Progress
          </h3>

          <strong>
            {inProgressComplaints}
          </strong>

          <p>
            Currently being handled
          </p>

        </div>


        <div className="stat-card">

          <h3>
            Resolved
          </h3>

          <strong>
            {resolvedComplaints}
          </strong>

          <p>
            Successfully resolved
          </p>

        </div>

      </section>


      {/* ================= QUICK ACTIONS ================= */}

      <section className="quick-actions">

        <div className="section-heading">

          <span>
            QUICK ACTIONS
          </span>

          <h2>
            What would you like to do?
          </h2>

        </div>


        <div className="action-grid">

          <div
            className="action-card"
            onClick={() => navigate("/submit-complaint")}
          >

            <div className="action-icon">
              📝
            </div>

            <h3>
              Register Complaint
            </h3>

            <p>
              Report a civic issue to the concerned department.
            </p>

            <span>
              →
            </span>

          </div>


          <div
            className="action-card"
            onClick={() => navigate("/track-complaint")}
          >

            <div className="action-icon">
              🔎
            </div>

            <h3>
              Track Complaint
            </h3>

            <p>
              Check the status and progress of your complaint.
            </p>

            <span>
              →
            </span>

          </div>


          <div
            className="action-card"
            onClick={() => navigate("/departments")}
          >

            <div className="action-icon">
              🏢
            </div>

            <h3>
              Government Departments
            </h3>

            <p>
              Explore departments and their civic services.
            </p>

            <span>
              →
            </span>

          </div>


          <div
            className="action-card"
            onClick={() => navigate("/announcements")}
          >

            <div className="action-icon">
              📢
            </div>

            <h3>
              Public Announcements
            </h3>

            <p>
              View important government notices and updates.
            </p>

            <span>
              →
            </span>

          </div>

        </div>

      </section>


      {/* ================= ACTIVITY ================= */}

      <section className="activity-section">

        <div className="section-heading">

          <span>
            ACTIVITY
          </span>

          <h2>
            Recent Complaints
          </h2>

        </div>


        {complaints.length === 0 ? (

          <div className="empty-complaints">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No complaints yet
            </h3>

            <p>
              Your submitted complaints will appear here
              once you register an issue.
            </p>

            <button
              onClick={() =>
                navigate("/submit-complaint")
              }
            >
              Register Your First Complaint
            </button>

          </div>

        ) : (

          <div className="complaints-list">

            {complaints.slice(0, 5).map((complaint) => (

              <div
                className="complaint-row"
                key={complaint.complaint_id}
              >

                <div>

                  <h3>
                    {complaint.title}
                  </h3>

                  <p>
                    {complaint.description}
                  </p>

                  <small>
                    {complaint.department_name ||
                      "Not Assigned"}
                  </small>

                </div>


                <div className="complaint-right">

                  <span
                    className={`status ${
                      String(
                        complaint.status || ""
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {complaint.status}
                  </span>

                  <strong>
                    #{complaint.complaint_id}
                  </strong>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ================= ACCOUNT ================= */}

      <section className="account-section">

        <div className="section-heading">

          <span>
            ACCOUNT
          </span>

          <h2>
            My Profile
          </h2>

        </div>


        <div className="profile-details">

          <div>
            <span>
              Name
            </span>

            <strong>
              {displayName}
            </strong>
          </div>


          <div>
            <span>
              Email
            </span>

            <strong>
              {displayEmail}
            </strong>
          </div>


          <div>
            <span>
              User ID
            </span>

            <strong>
              {displayUserId}
            </strong>
          </div>

        </div>

      </section>


      {/* ================= HELP ================= */}

      <section className="help-section">

        <div>

          <span>
            NEED HELP?
          </span>

          <h2>
            CivicConnect Support
          </h2>

          <p>
            Need assistance with your complaint or account?
          </p>

        </div>

        <button
          onClick={() => navigate("/support")}
        >
          Contact Support →
        </button>

      </section>


      {/* ================= IMPORTANT ================= */}

      <section className="important-section">

        <span>
          IMPORTANT
        </span>

        <h2>
          Before submitting
        </h2>

        <p>
          Provide accurate location details and a clear
          description of the civic issue to help the
          department process your complaint efficiently.
        </p>

      </section>


      {/* ================= SIGN OUT ================= */}

      <section className="logout-section">

        <div>

          <span>
            ACCOUNT ACTION
          </span>

          <h2>
            Sign Out
          </h2>

          <p>
            Sign out of your CivicConnect citizen account.
          </p>

        </div>

        <button
          onClick={() => {

            localStorage.removeItem("user");

            localStorage.removeItem("user_id");

            localStorage.removeItem("token");

            navigate("/login");

          }}
        >
          Sign Out
        </button>

      </section>

    </div>
  );
}

export default Home;