
import { Link } from "react-router-dom";

function ComplaintDetails() {
  return (
    <main className="complaint-details-page">

      {/* HEADER */}
      <section className="complaint-details-header">
        <div>
          <span>COMPLAINT TRACKING</span>

          <h1>Complaint Details</h1>

          <p>
            View the current status and progress of your civic complaint.
          </p>
        </div>

        <Link to="/track-complaint" className="back-track-link">
          ← Back to Track Complaint
        </Link>
      </section>


      {/* CONTENT */}
      <section className="complaint-details-container">

        {/* MAIN */}
        <div className="complaint-details-main">

          {/* COMPLAINT SUMMARY */}
          <div className="details-card">

            <div className="details-card-header">

              <div>
                <span>COMPLAINT ID</span>

                <h2>CC-2026-00001</h2>
              </div>

              <div className="complaint-status">
                In Progress
              </div>

            </div>


            <div className="complaint-summary-grid">

              <div>
                <small>Category</small>
                <strong>Street Light</strong>
              </div>

              <div>
                <small>Submitted On</small>
                <strong>09 August 2026</strong>
              </div>

              <div>
                <small>Department</small>
                <strong>Municipal Services</strong>
              </div>

              <div>
                <small>Priority</small>
                <strong>Normal</strong>
              </div>

            </div>


            <div className="complaint-description">

              <span>COMPLAINT DESCRIPTION</span>

              <p>
                The street light near the main road is not functioning
                properly. The area becomes very dark during the night and
                requires attention from the concerned department.
              </p>

            </div>


            <div className="complaint-location">

              <span>LOCATION</span>

              <p>
                Main Road, Nagercoil, Tamil Nadu
              </p>

            </div>

          </div>


          {/* STATUS PROGRESS */}
          <div className="details-card">

            <div className="details-heading">

              <span>COMPLAINT PROGRESS</span>

              <h2>Status Timeline</h2>

            </div>


            <div className="complaint-timeline">

              <div className="timeline-item completed">

                <div className="timeline-marker">
                  ✓
                </div>

                <div className="timeline-content">

                  <h3>Complaint Submitted</h3>

                  <span>09 August 2026 · 10:25 AM</span>

                  <p>
                    Your complaint was successfully registered in
                    CivicConnect.
                  </p>

                </div>

              </div>


              <div className="timeline-item completed">

                <div className="timeline-marker">
                  ✓
                </div>

                <div className="timeline-content">

                  <h3>Department Assigned</h3>

                  <span>09 August 2026 · 11:10 AM</span>

                  <p>
                    The complaint was assigned to Municipal Services.
                  </p>

                </div>

              </div>


              <div className="timeline-item active">

                <div className="timeline-marker">
                  •
                </div>

                <div className="timeline-content">

                  <h3>Under Review</h3>

                  <span>09 August 2026 · 02:30 PM</span>

                  <p>
                    A department officer is currently reviewing the
                    complaint.
                  </p>

                </div>

              </div>


              <div className="timeline-item">

                <div className="timeline-marker">
                  4
                </div>

                <div className="timeline-content">

                  <h3>Resolution</h3>

                  <span>Pending</span>

                  <p>
                    The complaint will be marked resolved after the issue
                    has been addressed.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* OFFICER UPDATE */}
          <div className="details-card">

            <div className="details-heading">

              <span>DEPARTMENT UPDATE</span>

              <h2>Latest Officer Update</h2>

            </div>

            <div className="officer-update">

              <div className="update-avatar">
                O
              </div>

              <div>

                <strong>Municipal Services Officer</strong>

                <span>09 August 2026 · 02:30 PM</span>

                <p>
                  The reported location has been identified. The issue is
                  currently being reviewed by the responsible maintenance
                  team.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* SIDEBAR */}
        <aside className="complaint-details-sidebar">

          <div className="details-side-card">

            <span>COMPLAINT STATUS</span>

            <div className="large-status">
              In Progress
            </div>

            <p>
              Your complaint is currently being handled by the concerned
              department.
            </p>

          </div>


          <div className="details-side-card">

            <span>ASSIGNED DEPARTMENT</span>

            <h3>Municipal Services</h3>

            <p>
              Responsible for municipal infrastructure and public service
              maintenance.
            </p>

            <Link to="/departments">
              View Department →
            </Link>

          </div>


          <div className="details-side-card">

            <span>NEED HELP?</span>

            <h3>CivicConnect AI</h3>

            <p>
              Ask our AI assistant if you have questions about your
              complaint or the civic service process.
            </p>

            <Link to="/ai-assistant">
              Ask CivicConnect AI →
            </Link>

          </div>


          <div className="details-side-card">

            <span>SUPPORT</span>

            <h3>Need further assistance?</h3>

            <Link to="/contact">
              Contact Support →
            </Link>

          </div>

        </aside>

      </section>

    </main>
  );
}

export default ComplaintDetails;

