import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [admin, setAdmin] = useState(null);

  const [searchId, setSearchId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  // =====================================================
  // LOAD ADMIN
  // =====================================================

  useEffect(() => {
    const storedAdmin = localStorage.getItem(
      "civicconnect_admin"
    );

    if (!storedAdmin) {
      navigate("/admin-login");
      return;
    }

    try {
      const adminData = JSON.parse(storedAdmin);

      if (!adminData.admin_id) {
        navigate("/admin-login");
        return;
      }

      setAdmin(adminData);

      loadComplaints(adminData.admin_id);
    } catch (error) {
      console.error(error);

      localStorage.removeItem(
        "civicconnect_admin"
      );

      navigate("/admin-login");
    }
  }, [navigate]);

  // =====================================================
  // FETCH COMPLAINTS
  // =====================================================

  const loadComplaints = async (adminId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/admin/complaints/${adminId}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Unable to load complaints."
        );
        return;
      }

      setComplaints(data.complaints || []);

      if (data.admin) {
        setAdmin((previous) => ({
          ...previous,
          ...data.admin,
        }));
      }
    } catch (error) {
      console.error(
        "LOAD ADMIN COMPLAINTS ERROR:",
        error
      );

      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // START EDITING
  // =====================================================

  const startEditing = (complaint) => {
    setEditingId(complaint.complaint_id);

    setEditStatus(
      complaint.status ||
        "Department Processing"
    );

    setEditRemarks(
      complaint.remarks || ""
    );

    setSuccessMessage("");
  };

  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const cancelEditing = () => {
    setEditingId(null);
    setEditStatus("");
    setEditRemarks("");
  };

  // =====================================================
  // UPDATE COMPLAINT
  // =====================================================

  const updateComplaint = async (complaintId) => {
    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/complaint/${complaintId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: editStatus,
            remarks: editRemarks,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            data.message ||
            "Unable to update complaint."
        );

        return;
      }

      // Update complaint immediately
      setComplaints((previous) =>
        previous.map((complaint) =>
          complaint.complaint_id === complaintId
            ? {
                ...complaint,

                status: editStatus,

                remarks: editRemarks,

                updated_at:
                  new Date().toISOString(),
              }
            : complaint
        )
      );

      cancelEditing();

      // Show message inside page
      setSuccessMessage(
        `Complaint #${complaintId} updated successfully.`
      );

      // Automatically remove message after 4 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      console.error(
        "UPDATE COMPLAINT ERROR:",
        error
      );

      setError(
        "Unable to connect to the backend."
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem(
      "civicconnect_admin"
    );

    navigate("/admin-login");
  };

  // =====================================================
  // SEARCH BY COMPLAINT ID
  // =====================================================

  const filteredComplaints =
    complaints.filter((complaint) => {
      return (
        searchId.trim() === "" ||
        String(complaint.complaint_id).includes(
          searchId.trim()
        )
      );
    });

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalComplaints =
    complaints.length;

  const resolvedComplaints =
    complaints.filter(
      (complaint) =>
        String(complaint.status || "")
          .toLowerCase() === "resolved"
    ).length;

  const activeComplaints =
    totalComplaints -
    resolvedComplaints;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-dashboard-header">

        <div>
          <span className="admin-label">
            ADMINISTRATION PORTAL
          </span>

          <h1>
            {admin?.name ||
              "Admin Dashboard"}
          </h1>

          <p>
            {admin?.department_name ||
              "Department"}{" "}
            •{" "}
            {admin?.municipality_name ||
              "Municipality"}
          </p>
        </div>

        <button
          className="admin-logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (
        <div className="admin-success-message">
          ✓ {successMessage}
        </div>
      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="admin-statistics">

        <div className="admin-stat-card">

          <strong>
            {totalComplaints}
          </strong>

          <span>
            Total Complaints
          </span>

        </div>


        <div className="admin-stat-card">

          <strong>
            {activeComplaints}
          </strong>

          <span>
            Active Complaints
          </span>

        </div>


        <div className="admin-stat-card">

          <strong>
            {resolvedComplaints}
          </strong>

          <span>
            Resolved Complaints
          </span>

        </div>

      </section>


      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="admin-controls">

        <div className="search-group">

          <label>
            Search Complaint ID
          </label>

          <input
            type="text"
            placeholder="Enter complaint ID..."
            value={searchId}
            onChange={(e) =>
              setSearchId(e.target.value)
            }
          />

        </div>

      </section>


      {/* =================================================
          COMPLAINTS
      ================================================= */}

      <section className="admin-complaints-section">

        <div className="section-title">

          <div>

            <span>
              DEPARTMENT COMPLAINTS
            </span>

            <h2>
              Complaints Assigned to You
            </h2>

          </div>

          <strong>
            {filteredComplaints.length} complaints
          </strong>

        </div>


        {loading ? (

          <div className="admin-empty">
            Loading complaints...
          </div>

        ) : filteredComplaints.length === 0 ? (

          <div className="admin-empty">

            <h3>
              No complaints found
            </h3>

            <p>
              No complaints match your
              current search.
            </p>

          </div>

        ) : (

          <div className="complaints-list">

            {filteredComplaints.map(
              (complaint) => (

                <article
                  className="admin-complaint-card"
                  key={
                    complaint.complaint_id
                  }
                >

                  {/* COMPLAINT HEADER */}

                  <div className="complaint-card-header">

                    <div>

                      <span className="complaint-number">

                        Complaint #
                        {
                          complaint.complaint_id
                        }

                      </span>

                      <h3>
                        {complaint.title}
                      </h3>

                    </div>


                    <span
                      className={`status-badge ${String(
                        complaint.status || ""
                      )
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )}`}
                    >
                      {complaint.status}
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="complaint-details">

                    <div>
                      <strong>
                        Category
                      </strong>

                      <span>
                        {complaint.category ||
                          "Not specified"}
                      </span>
                    </div>


                    <div>
                      <strong>
                        Subcategory
                      </strong>

                      <span>
                        {complaint.subcategory ||
                          "Not specified"}
                      </span>
                    </div>


                    <div>
                      <strong>
                        Citizen
                      </strong>

                      <span>
                        {complaint.user_name ||
                          "Unknown"}
                      </span>
                    </div>


                    <div>
                      <strong>
                        Email
                      </strong>

                      <span>
                        {complaint.user_email ||
                          "Not available"}
                      </span>
                    </div>


                    <div>
                      <strong>
                        Phone
                      </strong>

                      <span>
                        {complaint.user_phone ||
                          "Not available"}
                      </span>
                    </div>


                    <div>
                      <strong>
                        Location
                      </strong>

                      <span>
                        {complaint.location ||
                          "Not specified"}
                      </span>
                    </div>

                  </div>


                  {/* DESCRIPTION */}

                  <div className="complaint-description">

                    <strong>
                      Description
                    </strong>

                    <p>
                      {complaint.description}
                    </p>

                  </div>


                  {/* REMARKS */}

                  {complaint.remarks && (

                    <div className="complaint-remarks">

                      <strong>
                        Current Remarks
                      </strong>

                      <p>
                        {complaint.remarks}
                      </p>

                    </div>

                  )}


                  {/* EDIT AREA */}

                  {editingId ===
                  complaint.complaint_id ? (

                    <div className="complaint-edit-box">

                      <label>
                        Update Condition / Status
                      </label>

                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

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

                        <option value="Rejected">
                          Rejected
                        </option>

                      </select>


                      <label>
                        Remarks
                      </label>

                      <textarea
                        value={editRemarks}
                        onChange={(e) =>
                          setEditRemarks(
                            e.target.value
                          )
                        }
                        placeholder="Enter remarks for the citizen..."
                        rows="4"
                      />


                      <div className="edit-buttons">

                        <button
                          className="save-button"
                          onClick={() =>
                            updateComplaint(
                              complaint.complaint_id
                            )
                          }
                        >
                          Save Update
                        </button>


                        <button
                          className="cancel-button"
                          onClick={
                            cancelEditing
                          }
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    <button
                      className="edit-complaint-button"
                      onClick={() =>
                        startEditing(
                          complaint
                        )
                      }
                    >
                      Update Status / Remarks
                    </button>

                  )}

                </article>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminDashboard;