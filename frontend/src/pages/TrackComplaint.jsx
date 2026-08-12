import { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../services/api";
import "./TrackComplaint.css";

function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!complaintId.trim()) {
      setError("Please enter a complaint ID.");
      setComplaint(null);
      setHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setComplaint(null);
      setHistory([]);

      const response = await fetch(
        `${API_BASE_URL}/complaint/${complaintId.trim()}`
      );

      const contentType =
        response.headers.get("content-type") || "";

      /*
        Check whether backend actually returned JSON.
        This prevents:
        Unexpected token '<', "<!doctype"... is not valid JSON
      */

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        console.error(
          "TRACK COMPLAINT NON-JSON RESPONSE:",
          text
        );

        throw new Error(
          "The server returned an invalid response. Please make sure the backend is running correctly."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Complaint not found."
        );
      }

      setComplaint(data);

      /* ================================
         LOAD COMPLAINT HISTORY
      ================================= */

      try {
        const historyResponse = await fetch(
          `${API_BASE_URL}/complaint_history/${complaintId.trim()}`
        );

        const historyContentType =
          historyResponse.headers.get("content-type") || "";

        if (
          historyResponse.ok &&
          historyContentType.includes("application/json")
        ) {
          const historyData =
            await historyResponse.json();

          if (Array.isArray(historyData)) {
            setHistory(historyData);
          } else if (
            Array.isArray(historyData.history)
          ) {
            setHistory(historyData.history);
          }
        }
      } catch (historyError) {
        console.log(
          "Complaint history could not be loaded:",
          historyError
        );
      }
    } catch (err) {
      console.error(
        "TRACK COMPLAINT ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to find complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     STATUS CLASS
  ================================= */

  const getStatusClass = (status) => {
    if (!status) {
      return "status-default";
    }

    const value = status.toLowerCase();

    if (value.includes("resolved")) {
      return "status-resolved";
    }

    if (
      value.includes("progress") ||
      value.includes("processing")
    ) {
      return "status-progress";
    }

    if (
      value.includes("pending") ||
      value.includes("submitted")
    ) {
      return "status-pending";
    }

    return "status-default";
  };

  return (
    <div className="track-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="track-header">

        <div className="track-header-inner">

          <Link
            to="/"
            className="track-logo"
          >
            CivicConnect
          </Link>

          <nav className="track-nav">

            <Link to="/">
              Home
            </Link>

            <Link to="/departments">
              Departments
            </Link>

            <Link
              to="/track-complaint"
              className="active"
            >
              Track Complaint
            </Link>

            <Link
              to="/login"
              className="track-login"
            >
              Citizen Login
            </Link>

          </nav>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="track-main">

        {/* HERO */}

        <section className="track-hero">

          <span className="track-label">
            CIVICCONNECT
          </span>

          <h1>
            Track Your Complaint
          </h1>

          <p>
            Enter your complaint ID to view the
            current status and progress of your
            complaint.
          </p>

        </section>


        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="track-search-card">

          <form onSubmit={handleTrack}>

            <label htmlFor="complaintId">
              Complaint ID
            </label>

            <div className="track-input-row">

              <input
                id="complaintId"
                type="text"
                value={complaintId}
                onChange={(e) =>
                  setComplaintId(e.target.value)
                }
                placeholder="Enter complaint ID"
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Searching..."
                  : "Track Complaint"}
              </button>

            </div>

          </form>

          {error && (
            <div className="track-error">
              {error}
            </div>
          )}

        </section>


        {/* =================================================
            COMPLAINT RESULT
        ================================================= */}

        {complaint && (

          <section className="complaint-result">

            <div className="result-header">

              <div>

                <span>
                  COMPLAINT DETAILS
                </span>

                <h2>
                  Complaint #
                  {complaint.complaint_id}
                </h2>

              </div>

              <div
                className={`complaint-status ${getStatusClass(
                  complaint.status
                )}`}
              >
                {complaint.status || "Unknown"}
              </div>

            </div>


            {/* DETAILS */}

            <div className="complaint-details">

              <div className="detail-box">

                <small>
                  Complaint ID
                </small>

                <strong>
                  {complaint.complaint_id || "-"}
                </strong>

              </div>


              <div className="detail-box">

                <small>
                  Category
                </small>

                <strong>
                  {complaint.category || "-"}
                </strong>

              </div>


              <div className="detail-box">

                <small>
                  Department
                </small>

                <strong>
                  {complaint.department_name ||
                    complaint.department ||
                    "-"}
                </strong>

              </div>


              <div className="detail-box">

                <small>
                  Submitted On
                </small>

                <strong>
                  {complaint.created_at ||
                    complaint.submitted_at ||
                    "-"}
                </strong>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="complaint-description">

              <h3>
                Complaint Description
              </h3>

              <p>
                {complaint.description ||
                  complaint.complaint_description ||
                  "No description available."}
              </p>

            </div>


            {/* REMARKS */}

            {complaint.remarks && (

              <div className="complaint-remarks">

                <h3>
                  Latest Remarks
                </h3>

                <p>
                  {complaint.remarks}
                </p>

              </div>

            )}

          </section>

        )}


        {/* =================================================
            HISTORY
        ================================================= */}

        {complaint && history.length > 0 && (

          <section className="history-section">

            <div className="history-heading">

              <span>
                PROGRESS
              </span>

              <h2>
                Complaint History
              </h2>

            </div>


            <div className="history-list">

              {history.map((item, index) => (

                <div
                  className="history-item"
                  key={
                    item.history_id ||
                    item.id ||
                    index
                  }
                >

                  <div className="history-number">
                    {index + 1}
                  </div>


                  <div className="history-content">

                    <h3>
                      {item.status ||
                        item.action ||
                        "Status Updated"}
                    </h3>

                    <p>
                      {item.remarks ||
                        item.description ||
                        "No remarks available."}
                    </p>

                    <small>
                      {item.updated_at ||
                        item.created_at ||
                        item.date ||
                        ""}
                    </small>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="track-footer">

        <div className="track-footer-inner">

          <div>

            <strong>
              CivicConnect
            </strong>

            <p>
              Your Voice. Our Responsibility.
            </p>

          </div>


          <div>

            <Link to="/">
              Home
            </Link>

            <Link to="/departments">
              Departments
            </Link>

          </div>

        </div>


        <div className="track-footer-bottom">

          © 2026 CivicConnect. All rights reserved.

        </div>

      </footer>

    </div>
  );
}

export default TrackComplaint;