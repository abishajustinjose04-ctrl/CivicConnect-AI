
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";

const STATUS_OPTIONS = [
  "Submitted",
  "Registered",
  "Assigned to Department",
  "Department Processing",
  "Action Taken",
  "Resolved",
  "Closed",
];

function OfficerDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  // Update panel state
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // -----------------------------------------------------
  // LOAD LOGGED-IN ADMIN + ASSIGNED COMPLAINTS
  // -----------------------------------------------------

  const loadComplaints = async (adminId) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/complaints/${adminId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Unable to load assigned complaints."
        );
        return;
      }

      setComplaints(
        Array.isArray(data.complaints) ? data.complaints : []
      );
    } catch (err) {
      console.error("Officer complaints error:", err);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedAdmin = localStorage.getItem("civicconnect_admin");

    if (!storedAdmin) {
      navigate("/admin-login");
      return;
    }

    let parsedAdmin;

    try {
      parsedAdmin = JSON.parse(storedAdmin);
    } catch (parseError) {
      console.error("Invalid stored admin:", parseError);
      localStorage.removeItem("civicconnect_admin");
      navigate("/admin-login");
      return;
    }

    if (!parsedAdmin.admin_id) {
      navigate("/admin-login");
      return;
    }

    setAdmin(parsedAdmin);
    loadComplaints(parsedAdmin.admin_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------
  // STATS
  // -----------------------------------------------------

  const stats = useMemo(() => {
    const total = complaints.length;

    const resolved = complaints.filter((c) =>
      ["resolved", "closed"].includes(
        (c.status || "").toLowerCase()
      )
    ).length;

    const pending = complaints.filter((c) =>
      ["submitted", "registered", "assigned to department"].includes(
        (c.status || "").toLowerCase()
      )
    ).length;

    const inProgress = total - resolved - pending;

    return { total, resolved, pending, inProgress };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    if (statusFilter === "All") {
      return complaints;
    }

    return complaints.filter(
      (c) => (c.status || "") === statusFilter
    );
  }, [complaints, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // -----------------------------------------------------
  // OPEN / CLOSE UPDATE PANEL
  // -----------------------------------------------------

  const openUpdatePanel = (complaint) => {
    setActiveComplaint(complaint);
    setUpdateStatus(complaint.status || "Submitted");
    setUpdateRemarks(complaint.remarks || "");
    setUpdateError("");
    setUpdateSuccess("");
  };

  const closeUpdatePanel = () => {
    setActiveComplaint(null);
    setUpdateError("");
    setUpdateSuccess("");
  };

  // -----------------------------------------------------
  // SUBMIT UPDATE
  // -----------------------------------------------------

  const submitUpdate = async (e) => {
    e.preventDefault();

    if (!activeComplaint) return;

    setSaving(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/complaint/${activeComplaint.complaint_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: updateStatus,
            remarks: updateRemarks,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUpdateError(
          data.error || data.message || "Unable to update complaint."
        );
        return;
      }

      setUpdateSuccess("Complaint updated. The citizen will see this immediately when tracking.");

      // Reflect the change locally without waiting for a refetch
      setComplaints((previous) =>
        previous.map((c) =>
          c.complaint_id === activeComplaint.complaint_id
            ? { ...c, status: data.new_status, remarks: data.remarks }
            : c
        )
      );
    } catch (err) {
      console.error("Update complaint error:", err);
      setUpdateError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="officer-page">

      {/* HEADER */}
      <section className="officer-header">

        <div>
          <span>OFFICER PORTAL</span>

          <h1>Department Dashboard</h1>

          <p>
            Review citizen complaints, monitor progress, and manage
            department actions.
          </p>
        </div>

        <div className="officer-profile">
          <div className="officer-avatar">
            {admin?.name ? admin.name.charAt(0).toUpperCase() : "O"}
          </div>

          <div>
            <strong>{admin?.name || "Department Officer"}</strong>
            <span>
              {admin?.department_name || "Department"} ·{" "}
              {admin?.municipality_name || "Municipality"}
            </span>
          </div>
        </div>

      </section>


      {/* STATISTICS */}
      <section className="officer-stats">

        <div className="officer-stat">
          <span>Total Assigned</span>
          <strong>{stats.total}</strong>
          <small>Complaints assigned</small>
        </div>

        <div className="officer-stat pending">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
          <small>Awaiting action</small>
        </div>

        <div className="officer-stat progress">
          <span>In Progress</span>
          <strong>{stats.inProgress}</strong>
          <small>Currently processing</small>
        </div>

        <div className="officer-stat resolved">
          <span>Resolved</span>
          <strong>{stats.resolved}</strong>
          <small>Completed complaints</small>
        </div>

      </section>


      {/* MAIN CONTENT */}
      <section className="officer-content">

        <div className="officer-main">

          {/* COMPLAINTS */}
          <div className="officer-section-heading">

            <div>
              <span>COMPLAINT MANAGEMENT</span>

              <h2>Assigned Complaints</h2>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-button"
            >
              <option value="All">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

          </div>

          {error && (
            <div className="auth-message error-message">
              {error}
            </div>
          )}

          <div className="complaint-table-wrapper">

            <table className="complaint-table">

              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {loading && (
                  <tr>
                    <td colSpan="6">
                      <div className="officer-empty">
                        <div>⏳</div>
                        <h3>Loading complaints...</h3>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filteredComplaints.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="officer-empty">
                        <div>📋</div>
                        <h3>No complaints assigned</h3>
                        <p>
                          Complaints assigned to your department will
                          appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.complaint_id}>
                      <td>#{complaint.complaint_id}</td>
                      <td>
                        {complaint.category}
                        {complaint.subcategory
                          ? ` — ${complaint.subcategory}`
                          : ""}
                      </td>
                      <td>{complaint.location || "—"}</td>
                      <td>{formatDate(complaint.created_at)}</td>
                      <td>{complaint.status || "Submitted"}</td>
                      <td>
                        <button
                          type="button"
                          className="filter-button"
                          onClick={() => openUpdatePanel(complaint)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* SIDEBAR */}
        <aside className="officer-sidebar">

          <div className="officer-side-card">

            <span>DEPARTMENT</span>

            <h3>{admin?.department_name || "Municipal Services"}</h3>

            <div className="department-detail">

              <div>
                <small>Officer</small>
                <strong>{admin?.name || "Department Officer"}</strong>
              </div>

              <div>
                <small>Municipality</small>
                <strong>
                  {admin?.municipality_name || "Not assigned"}
                </strong>
              </div>

              <div>
                <small>Today's Date</small>
                <strong>{formatDate(new Date())}</strong>
              </div>

            </div>

          </div>


          <div className="officer-side-card">

            <span>QUICK ACCESS</span>

            <h3>Department Services</h3>

            <Link to="/departments">
              View Department Directory →
            </Link>

            <Link to="/announcements">
              View Public Announcements →
            </Link>

            <Link to="/contact">
              Contact Support →
            </Link>

          </div>


          <div className="officer-side-card officer-note">

            <span>REMINDER</span>

            <h3>Keep complaints updated</h3>

            <p>
              Update complaint status regularly so citizens can see
              the progress of their reported issues immediately when
              tracking.
            </p>

          </div>

        </aside>

      </section>


      {/* UPDATE PANEL */}
      {activeComplaint && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 30, 45, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "16px",
          }}
          onClick={closeUpdatePanel}
        >
          <div
            className="details-card"
            style={{ maxWidth: "480px", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="details-card-header">
              <div>
                <span>COMPLAINT #{activeComplaint.complaint_id}</span>
                <h2>{activeComplaint.title || activeComplaint.category}</h2>
              </div>
            </div>

            <form onSubmit={submitUpdate} className="track-form" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>

              <div>
                <label htmlFor="update-status" style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#526477" }}>
                  Status
                </label>
                <select
                  id="update-status"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d7dee5" }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="update-remarks" style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#526477" }}>
                  Remarks / resolution details
                </label>
                <textarea
                  id="update-remarks"
                  value={updateRemarks}
                  onChange={(e) => setUpdateRemarks(e.target.value)}
                  rows={4}
                  placeholder="What action was taken? This is visible to the citizen."
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d7dee5", resize: "vertical" }}
                />
              </div>

              {updateError && (
                <div className="auth-message error-message">
                  {updateError}
                </div>
              )}

              {updateSuccess && (
                <div className="auth-message success-message">
                  {updateSuccess}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="filter-button"
                  onClick={closeUpdatePanel}
                >
                  Close
                </button>

                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Update"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  );
}

export default OfficerDashboard;
