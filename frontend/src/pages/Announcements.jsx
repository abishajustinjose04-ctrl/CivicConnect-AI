
import { Link } from "react-router-dom";

const announcements = [
  {
    date: "09 AUG 2026",
    category: "PUBLIC NOTICE",
    title: "CivicConnect Public Grievance Portal",
    description:
      "Citizens can use CivicConnect to report civic issues, track complaints, and access important public services from one platform.",
    important: true,
  },
  {
    date: "06 AUG 2026",
    category: "WATER SUPPLY",
    title: "Scheduled Water Supply Maintenance",
    description:
      "Residents in selected service areas may experience temporary interruption of water supply due to scheduled maintenance work.",
  },
  {
    date: "03 AUG 2026",
    category: "ROAD & INFRASTRUCTURE",
    title: "Road Maintenance and Repair Works",
    description:
      "Maintenance and repair activities are being carried out in identified areas. Citizens are advised to follow temporary traffic arrangements.",
  },
  {
    date: "30 JUL 2026",
    category: "WASTE MANAGEMENT",
    title: "Community Cleanliness Drive",
    description:
      "Local authorities are conducting cleanliness and waste-management activities in public areas and residential zones.",
  },
  {
    date: "27 JUL 2026",
    category: "PUBLIC HEALTH",
    title: "Public Health Awareness Programme",
    description:
      "Citizens are encouraged to participate in upcoming public health awareness programmes organised by local authorities.",
  },
  {
    date: "24 JUL 2026",
    category: "TRANSPORT",
    title: "Public Transport Service Update",
    description:
      "Citizens are advised to check updated routes and service timings before travelling through affected areas.",
  },
];

function Announcements() {
  return (
    <main className="announcements-page">

      {/* PAGE HEADER */}
      <section className="inner-page-header">
        <div>
          <span>OFFICIAL PUBLIC INFORMATION</span>

          <h1>Announcements & Notices</h1>

          <p>
            Stay informed about government notices, civic services,
            maintenance activities, public programmes, and important updates.
          </p>
        </div>
      </section>


      {/* ANNOUNCEMENTS */}
      <section className="announcements-section">

        <div className="announcements-layout">

          {/* MAIN LIST */}
          <div className="announcement-list">

            <div className="announcement-list-header">
              <div>
                <span>PUBLIC INFORMATION</span>
                <h2>Latest Announcements</h2>
              </div>

              <select defaultValue="all">
                <option value="all">All Notices</option>
                <option value="water">Water Supply</option>
                <option value="roads">Road & Infrastructure</option>
                <option value="waste">Waste Management</option>
                <option value="health">Public Health</option>
                <option value="transport">Transport</option>
              </select>
            </div>


            {announcements.map((announcement, index) => (
              <article
                className={`notice-card ${
                  announcement.important ? "important-notice" : ""
                }`}
                key={index}
              >

                <div className="notice-date">
                  <strong>
                    {announcement.date.split(" ")[0]}
                  </strong>

                  <span>
                    {announcement.date.split(" ").slice(1).join(" ")}
                  </span>
                </div>


                <div className="notice-content">

                  <span className="notice-category">
                    {announcement.category}
                  </span>

                  <h3>{announcement.title}</h3>

                  <p>{announcement.description}</p>

                  <button type="button">
                    Read Full Notice →
                  </button>

                </div>

              </article>
            ))}

          </div>


          {/* SIDEBAR */}
          <aside className="announcement-sidebar">

            <div className="notice-side-card">

              <div className="side-icon">
                📢
              </div>

              <h3>Important Notices</h3>

              <p>
                Check this section regularly for important government
                announcements and public service updates.
              </p>

              <div className="side-divider" />

              <div className="side-stat">
                <strong>24/7</strong>
                <span>Portal Access</span>
              </div>

              <div className="side-stat">
                <strong>8+</strong>
                <span>Service Departments</span>
              </div>

            </div>


            <div className="notice-side-card help-card">

              <div className="side-icon">
                ❓
              </div>

              <h3>Need Assistance?</h3>

              <p>
                If you have a civic issue that requires attention, submit a
                complaint through CivicConnect.
              </p>

              <Link
                to="/complaints"
                className="primary-btn"
              >
                Register Complaint
              </Link>

            </div>

          </aside>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>Can't Find the Information You Need?</h2>

        <p>
          You can contact CivicConnect support or submit a complaint if your
          issue requires attention from a government department.
        </p>

        <Link
          to="/complaints"
          className="primary-btn"
        >
          Submit a Complaint
        </Link>

      </section>

    </main>
  );
}

export default Announcements;

