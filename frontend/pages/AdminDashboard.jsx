import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending_complaints: 0,
    in_progress_complaints: 0,
    resolved_complaints: 0,
    registered_citizens: 0
  });

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ========================================================
  // LOAD ADMIN DATA
  // ========================================================

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const statsResponse = await fetch(
        `${API_BASE_URL}/admin/stats`
      );

      const complaintsResponse = await fetch(
        `${API_BASE_URL}/admin/complaints`
      );

      if (!statsResponse.ok) {
        throw new Error("Unable to load statistics.");
      }

      if (!complaintsResponse.ok) {
        throw new Error("Unable to load complaints.");
      }

      const statsData = await statsResponse.json();
      const complaintsData = await complaintsResponse.json();

      // -------------------------------
      // SET STATISTICS
      // -------------------------------

      setStats({
        total_complaints:
          Number(statsData.total_complaints) || 0,

        pending_complaints:
          Number(statsData.pending_complaints) || 0,

        in_progress_complaints:
          Number(statsData.in_progress_complaints) || 0,

        resolved_complaints:
          Number(statsData.resolved_complaints) || 0,

        registered_citizens:
          Number(statsData.registered_citizens) || 0
      });

      // -------------------------------
      // SET COMPLAINTS
      // -------------------------------

      if (Array.isArray(complaintsData)) {
        setComplaints(complaintsData);
      } else if (Array.isArray(complaintsData.complaints)) {
        setComplaints(complaintsData.complaints);
      } else {
        setComplaints([]);
      }

    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // ========================================================
  // UPDATE COMPLAINT
  // ========================================================

  const updateComplaint = async (
    complaintId,
    status
  ) => {
    try {
      setUpdatingId(complaintId);

      const response = await fetch(
        `${API_BASE_URL}/complaint/${complaintId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          data.message ||
          "Unable to update complaint."
        );

        return;
      }

      alert(
        "Complaint status updated successfully."
      );

      await loadAdminData();

    } catch (error) {
      console.error(
        "UPDATE ERROR:",
        error
      );

      alert(
        "Unable to connect to backend."
      );

    } finally {
      setUpdatingId(null);
    }
  };

  // ========================================================
  // PAGE
  // ========================================================

  return (
    <div className="admin-dashboard">

      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="admin-header">

        <div>

          <span>
            ADMINISTRATION PORTAL
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Monitor CivicConnect complaints,
            citizens, departments, and
            municipal services.
          </p>

        </div>

        <div className="admin-profile">

          <div className="admin-avatar">
            A
          </div>

          <div>

            <strong>
              System Administrator
            </strong>

            <span>
              Administrator
            </span>

          </div>

        </div>

      </section>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <section className="admin-stats">

        {/* TOTAL */}

        <div className="admin-stat">

          <span>
            Total Complaints
          </span>

          <strong>
            {stats.total_complaints}
          </strong>

          <small>
            All submitted complaints
          </small>

        </div>

        {/* PENDING */}

        <div className="admin-stat">

          <span>
            Pending
          </span>

          <strong>
            {stats.pending_complaints}
          </strong>

          <small>
            Awaiting action
          </small>

        </div>

        {/* IN PROGRESS */}

        <div className="admin-stat">

          <span>
            In Progress
          </span>

          <strong>
            {stats.in_progress_complaints}
          </strong>

          <small>
            Currently being handled
          </small>

        </div>

        {/* RESOLVED */}

        <div className="admin-stat">

          <span>
            Resolved
          </span>

          <strong>
            {stats.resolved_complaints}
          </strong>

          <small>
            Successfully completed
          </small>

        </div>

        {/* CITIZENS */}

        <div className="admin-stat">

          <span>
            Registered Citizens
          </span>

          <strong>
            {stats.registered_citizens}
          </strong>

          <small>
            Total citizen accounts
          </small>

        </div>

      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="admin-content">

        <div className="admin-main">

          {/* ==================================================
              MANAGEMENT
          ================================================== */}

          <div className="admin-section-heading">

            <span>
              SYSTEM MANAGEMENT
            </span>

            <h2>
              Administration
            </h2>

          </div>

          <div className="admin-management-grid">

            <Link
              to="/complaints"
              className="admin-management-card"
            >

              <div className="admin-card-icon">
                📋
              </div>

              <div>

                <h3>
                  Complaint Management
                </h3>

                <p>
                  View and manage all
                  citizen complaints.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            <Link
              to="/departments"
              className="admin-management-card"
            >

              <div className="admin-card-icon">
                🏛️
              </div>

              <div>

                <h3>
                  Department Management
                </h3>

                <p>
                  View government
                  departments.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            <Link
              to="/announcements"
              className="admin-management-card"
            >

              <div className="admin-card-icon">
                📢
              </div>

              <div>

                <h3>
                  Announcements
                </h3>

                <p>
                  Manage public
                  announcements.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

            <Link
              to="/dashboard"
              className="admin-management-card"
            >

              <div className="admin-card-icon">
                👥
              </div>

              <div>

                <h3>
                  Citizen Dashboard
                </h3>

                <p>
                  View the citizen portal.
                </p>

              </div>

              <strong>
                →
              </strong>

            </Link>

          </div>

          {/* ==================================================
              ALL COMPLAINTS
          ================================================== */}

          <div className="admin-section-heading admin-activity-heading">

            <span>
              CITIZEN COMPLAINTS
            </span>

            <h2>
              All Complaints
            </h2>

          </div>

          <div className="admin-complaints">

            {loading ? (

              <div className="activity-empty">

                <h3>
                  Loading complaints...
                </h3>

              </div>

            ) : complaints.length === 0 ? (

              <div className="activity-empty">

                <div className="activity-icon">
                  📋
                </div>

                <h3>
                  No complaints yet
                </h3>

                <p>
                  Complaints submitted by
                  citizens will appear here.
                </p>

              </div>

            ) : (

              complaints.map((complaint) => (

                <div
                  className="admin-complaint-card"
                  key={complaint.complaint_id}
                >

                  {/* TOP */}

                  <div className="complaint-top">

                    <div>

                      <span className="complaint-number">
                        Complaint #
                        {complaint.complaint_id}
                      </span>

                      <h3>
                        {complaint.title}
                      </h3>

                    </div>

                    <span className="complaint-status">
                      {complaint.status}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  {/* INFORMATION */}

                  <div className="complaint-info-grid">

                    <div>

                      <small>
                        CITIZEN
                      </small>

                      <strong>
                        {complaint.user_name ||
                          complaint.citizen_name ||
                          "Unknown"}
                      </strong>

                      <span>
                        {complaint.user_email ||
                          complaint.citizen_email ||
                          ""}
                      </span>

                    </div>

                    <div>

                      <small>
                        CATEGORY
                      </small>

                      <strong>
                        {complaint.category ||
                          "Not specified"}
                      </strong>

                    </div>

                    <div>

                      <small>
                        DEPARTMENT
                      </small>

                      <strong>
                        {complaint.department_name ||
                          "Not Assigned"}
                      </strong>

                    </div>

                    <div>

                      <small>
                        MUNICIPALITY
                      </small>

                      <strong>
                        {complaint.municipality_name ||
                          "Not Assigned"}
                      </strong>

                    </div>

                    <div>

                      <small>
                        LOCATION
                      </small>

                      <strong>
                        {complaint.location ||
                          "Not specified"}
                      </strong>

                    </div>

                    <div>

                      <small>
                        PRIORITY
                      </small>

                      <strong>
                        {complaint.priority ||
                          "Normal"}
                      </strong>

                    </div>

                  </div>

                  {/* STATUS UPDATE */}

                  <div className="admin-update">

                    <label>
                      Update Complaint Status
                    </label>

                    <select
                      value={
                        complaint.status || ""
                      }
                      disabled={
                        updatingId ===
                        complaint.complaint_id
                      }
                      onChange={(e) =>
                        updateComplaint(
                          complaint.complaint_id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Department Processing">
                        Department Processing
                      </option>

                      <option value="Under Review">
                        Under Review
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                      <option value="Closed">
                        Closed
                      </option>

                    </select>

                  </div>

                  {/* REMARKS */}

                  {complaint.remarks && (

                    <div className="complaint-remarks">

                      <strong>
                        Admin Remarks:
                      </strong>

                      <span>
                        {complaint.remarks}
                      </span>

                    </div>

                  )}

                </div>

              ))

            )}

          </div>

        </div>

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="admin-sidebar">

          <div className="admin-side-card">

            <span>
              SYSTEM STATUS
            </span>

            <h3>
              CivicConnect System
            </h3>

            <div className="system-status">

              <div>

                <i className="status-dot"></i>

                <span>
                  Frontend
                </span>

                <strong>
                  Online
                </strong>

              </div>

              <div>

                <i className="status-dot"></i>

                <span>
                  Backend
                </span>

                <strong>
                  {loading
                    ? "Checking"
                    : "Online"}
                </strong>

              </div>

              <div>

                <i className="status-dot"></i>

                <span>
                  Database
                </span>

                <strong>
                  {loading
                    ? "Checking"
                    : "Connected"}
                </strong>

              </div>

            </div>

          </div>

          <div className="admin-side-card">

            <span>
              QUICK ACCESS
            </span>

            <h3>
              Portal Links
            </h3>

            <Link to="/dashboard">
              Citizen Dashboard →
            </Link>

            <Link to="/departments">
              Department Directory →
            </Link>

            <Link to="/announcements">
              Public Announcements →
            </Link>

            <Link to="/">
              CivicConnect Home →
            </Link>

          </div>

          <div className="admin-side-card admin-note">

            <span>
              ADMIN NOTE
            </span>

            <h3>
              Complaint Processing
            </h3>

            <p>
              Select a status above to update
              the complaint. The updated
              status is saved in PostgreSQL
              and becomes available to the
              citizen through complaint
              tracking.
            </p>

          </div>

        </aside>

      </section>

    </div>
  );
}

export default AdminDashboard;