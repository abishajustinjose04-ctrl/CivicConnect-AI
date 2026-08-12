
import { useState } from "react";
import API_BASE_URL from "../services/api";

function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setComplaint(null);
    setHistory([]);

    const id = complaintId.trim();

    if (!id) {
      setError("Please enter a complaint ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/track_complaint/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            data.error ||
            "Complaint not found."
        );
        return;
      }

      setComplaint(data);

      // Fetch the real, dynamic status history for this complaint.
      // If this fails, tracking still works — the timeline just
      // falls back to inferring progress from the current status.
      try {
        const historyResponse = await fetch(
          `${API_BASE_URL}/complaint_history/${id}`
        );

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();

          setHistory(
            Array.isArray(historyData) ? historyData : []
          );
        }
      } catch (historyErr) {
        console.error("History fetch error:", historyErr);
      }
    } catch (err) {
      console.error("Tracking error:", err);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "";
    }

    const normalizedStatus = status.toLowerCase();

    if (
      normalizedStatus.includes("resolved") ||
      normalizedStatus.includes("completed")
    ) {
      return "resolved";
    }

    if (
      normalizedStatus.includes("progress") ||
      normalizedStatus.includes("processing")
    ) {
      return "in-progress";
    }

    if (
      normalizedStatus.includes("rejected") ||
      normalizedStatus.includes("closed")
    ) {
      return "rejected";
    }

    return "pending";
  };

  return (
    <main>

      {/* PAGE HEADER */}
      <section className="inner-page-header">
        <div>
          <span>COMPLAINT STATUS SERVICE</span>

          <h1>Track Your Complaint</h1>

          <p>
            Enter your complaint ID to check the current status
            and progress of your reported civic issue.
          </p>
        </div>
      </section>


      {/* SEARCH SECTION */}
      <section className="track-section">

        <div className="track-search-card">

          <div className="track-icon">
            🔎
          </div>

          <span>COMPLAINT TRACKING</span>

          <h2>Check Complaint Status</h2>

          <p>
            Enter the complaint ID you received after submitting
            your complaint.
          </p>


          <form
            onSubmit={handleSearch}
            className="track-form"
          >

            <input
              type="number"
              min="1"
              placeholder="Enter complaint ID"
              value={complaintId}
              onChange={(e) => {
                setComplaintId(e.target.value);
                setError("");
                setComplaint(null);
              }}
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Checking..."
                : "Track Complaint"}
            </button>

          </form>


          <small>
            Your complaint ID is provided after successful
            complaint submission.
          </small>


          {/* ERROR MESSAGE */}
          {error && (
            <div className="auth-message error-message">
              {error}
            </div>
          )}

        </div>


        {/* RESULT */}
        {complaint && (
          <div className="complaint-result">

            {/* RESULT HEADER */}
            <div className="result-header">

              <div>
                <span>COMPLAINT ID</span>

                <h2>
                  #{complaint.complaint_id}
                </h2>
              </div>

              <div
                className={`status-badge ${getStatusClass(
                  complaint.status
                )}`}
              >
                {complaint.status || "Pending"}
              </div>

            </div>


            {/* COMPLAINT TITLE */}
            <div className="complaint-title-box">

              <span>COMPLAINT</span>

              <h3>
                {complaint.title}
              </h3>

            </div>


            {/* DETAILS */}
            <div className="result-details">

              <div>
                <span>Category</span>

                <strong>
                  {complaint.category || "Not specified"}
                </strong>
              </div>


              <div>
                <span>Subcategory</span>

                <strong>
                  {complaint.subcategory || "Not specified"}
                </strong>
              </div>


              <div>
                <span>Municipality</span>

                <strong>
                  {complaint.municipality_name ||
                    "Not assigned yet"}
                </strong>
              </div>


              <div>
                <span>Department</span>

                <strong>
                  {complaint.department_name ||
                    "Not assigned yet"}
                </strong>
              </div>


              <div>
                <span>Date Submitted</span>

                <strong>
                  {formatDate(complaint.created_at)}
                </strong>
              </div>


              <div>
                <span>Last Updated</span>

                <strong>
                  {formatDate(complaint.updated_at)}
                </strong>
              </div>


              <div>
                <span>Priority</span>

                <strong>
                  {complaint.priority || "Normal"}
                </strong>
              </div>


              <div>
                <span>Location</span>

                <strong>
                  {complaint.location ||
                    "Not specified"}
                </strong>
              </div>


              <div>
                <span>Citizen ID</span>

                <strong>
                  {complaint.user_id}
                </strong>
              </div>

            </div>


            {/* DESCRIPTION */}
            <div className="tracking-description">

              <span>COMPLAINT DESCRIPTION</span>

              <p>
                {complaint.description}
              </p>

            </div>


            {/* REMARKS */}
            {complaint.remarks && (
              <div className="tracking-description">

                <span>LATEST REMARKS FROM DEPARTMENT</span>

                <p>
                  {complaint.remarks}
                </p>

              </div>
            )}


            {/* TIMELINE */}
            <div className="tracking-timeline">

              <h3>
                Complaint Progress
              </h3>


              <div className="timeline">

                {history.length > 0 ? (

                  // Real, dynamic status history from the backend.
                  history.map((entry, index) => (
                    <div
                      key={entry.history_id}
                      className={`timeline-item ${
                        index === history.length - 1
                          ? "current"
                          : "completed"
                      }`}
                    >

                      <div className="timeline-marker">
                        {index === history.length - 1
                          ? "•"
                          : "✓"}
                      </div>

                      <div>
                        <h4>
                          {entry.new_status}
                        </h4>

                        {entry.remarks && (
                          <p>
                            {entry.remarks}
                          </p>
                        )}

                        <span>
                          {formatDate(entry.updated_at)}
                        </span>
                      </div>

                    </div>
                  ))

                ) : (

                  // Fallback for complaints filed before status
                  // history was tracked, or if the history request
                  // failed — shows current status only.
                  <div className="timeline-item completed">

                    <div className="timeline-marker">
                      ✓
                    </div>

                    <div>
                      <h4>
                        {complaint.status || "Submitted"}
                      </h4>

                      <p>
                        Current status of your complaint.
                      </p>

                      <span>
                        {formatDate(complaint.updated_at)}
                      </span>
                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* HELP */}
            <div className="tracking-help">

              <strong>
                Need help?
              </strong>

              <p>
                If the information displayed is
                incorrect, please contact CivicConnect
                support.
              </p>

            </div>

          </div>
        )}

      </section>

    </main>
  );
}

export default TrackComplaint;

