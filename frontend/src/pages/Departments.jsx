
import { Link } from "react-router-dom";
import "./Department.css";
const departments = [
  {
    icon: "🏛️",
    name: "Municipal Corporation",
    description:
      "Handles civic infrastructure, public spaces, local administration, and municipal services.",
    services: [
      "Road maintenance",
      "Public spaces",
      "Civic infrastructure",
      "Municipal services",
    ],
  },
  {
    icon: "💧",
    name: "Water Supply Department",
    description:
      "Responsible for water supply, pipelines, leakage complaints, and related public services.",
    services: [
      "Water supply",
      "Pipeline issues",
      "Water leakage",
      "Supply interruptions",
    ],
  },
  {
    icon: "💡",
    name: "Electricity Department",
    description:
      "Handles street lighting, public electrical infrastructure, and electricity-related civic issues.",
    services: [
      "Street lights",
      "Electrical faults",
      "Public lighting",
      "Infrastructure issues",
    ],
  },
  {
    icon: "🗑️",
    name: "Waste Management",
    description:
      "Manages garbage collection, waste disposal, sanitation, and cleanliness-related complaints.",
    services: [
      "Garbage collection",
      "Waste disposal",
      "Public cleanliness",
      "Sanitation",
    ],
  },
  {
    icon: "🏥",
    name: "Public Health Department",
    description:
      "Responsible for public health services, sanitation concerns, and community health facilities.",
    services: [
      "Public health",
      "Sanitation",
      "Health facilities",
      "Community services",
    ],
  },
  {
    icon: "🚌",
    name: "Transport Department",
    description:
      "Handles public transportation services, transport infrastructure, and related civic concerns.",
    services: [
      "Public transport",
      "Bus services",
      "Transport infrastructure",
      "Traffic-related services",
    ],
  },
  {
    icon: "🌳",
    name: "Parks & Environment",
    description:
      "Manages public parks, green spaces, environmental concerns, and community recreational areas.",
    services: [
      "Public parks",
      "Tree maintenance",
      "Green spaces",
      "Environmental issues",
    ],
  },
  {
    icon: "🚰",
    name: "Drainage & Sewage",
    description:
      "Handles drainage systems, sewage issues, blocked drains, and wastewater concerns.",
    services: [
      "Blocked drains",
      "Sewage issues",
      "Drainage maintenance",
      "Wastewater",
    ],
  },
];

function Departments() {
  return (
    <main className="departments-page">
{/* NAVBAR */}
<nav className="navbar">
  <div className="navbar-container">

    <div className="nav-links">

      <Link
        to="/"
        className="nav-link"
      >
        Home
      </Link>

      <Link
        to="/departments"
        className="nav-link active"
      >
        Departments
      </Link>

      <Link
        to="/login"
        className="nav-link"
      >
        Track Complaint
      </Link>

    </div>

    <div className="nav-actions">

      <Link
        to="/login"
        className="login-btn"
      >
        Citizen Login
      </Link>

      <Link
        to="/register"
        className="register-btn"
      >
        Register
      </Link>

      <Link
        to="/admin-login"
        className="admin-login-btn"
      >
        Admin Login
      </Link>

    </div>

  </div>
</nav>
      {/* HEADER */}
      <section className="inner-page-header">
        <div>
          <span>GOVERNMENT SERVICE DIRECTORY</span>

          <h1>Departments & Services</h1>

          <p>
            Find the appropriate government department for your civic issue
            and learn about the services handled by each department.
          </p>
        </div>
      </section>


      {/* DEPARTMENT CARDS */}
      <section className="departments-section">

        <div className="section-heading">
          <span>PUBLIC SERVICE DIRECTORY</span>

          <h2>Government Departments</h2>

          <p>
            Select a department to understand the services it provides.
          </p>
        </div>


        <div className="department-grid">

          {departments.map((department) => (
            <div
              className="department-card"
              key={department.name}
            >

              <div className="department-icon">
                {department.icon}
              </div>

              <h3>{department.name}</h3>

              <p>{department.description}</p>

              <div className="department-services">
                <strong>Services include:</strong>

                <ul>
                  {department.services.map((service) => (
                    <li key={service}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/login"
                className="department-link"
              >
                Report an Issue →
              </Link>

            </div>
          ))}

        </div>

      </section>


      {/* HELP SECTION */}
      <section className="department-help">

        <div>
          <span>NOT SURE WHERE TO REPORT?</span>

          <h2>We Can Help You Find the Right Department</h2>

          <p>
            If you are unsure which department handles your issue, you can
            submit your complaint with the details you have. The complaint
            can then be reviewed and directed to the appropriate department.
          </p>

          <Link
            to="/login"
            className="primary-btn"
          >
            Report Your Issue
          </Link>
        </div>

        <div className="help-visual">
          🏢
        </div>

      </section>

    </main>
  );
}

export default Departments;

