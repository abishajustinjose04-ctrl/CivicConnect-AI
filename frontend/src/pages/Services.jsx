
import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      icon: "📝",
      title: "Register a Complaint",
      description:
        "Report civic issues such as roads, sanitation, drainage, street lights, water supply, and other public service problems.",
      link: "/complaints",
      button: "Register Complaint",
    },
    {
      icon: "🔎",
      title: "Track Complaint",
      description:
        "Check the current status of your complaint and follow its progress from submission to resolution.",
      link: "/track-complaint",
      button: "Track Now",
    },
    {
      icon: "🤖",
      title: "CivicConnect AI",
      description:
        "Get AI-powered guidance about civic services, complaint categories, departments, and reporting procedures.",
      link: "/ai-assistant",
      button: "Ask AI",
    },
    {
      icon: "🏛️",
      title: "Government Departments",
      description:
        "Find information about departments responsible for different civic services and public facilities.",
      link: "/departments",
      button: "View Departments",
    },
    {
      icon: "📢",
      title: "Public Announcements",
      description:
        "Stay informed about government notices, service interruptions, public works, and important civic updates.",
      link: "/announcements",
      button: "View Announcements",
    },
    {
      icon: "📞",
      title: "Citizen Support",
      description:
        "Contact CivicConnect support for assistance with complaints, accounts, and civic service information.",
      link: "/contact",
      button: "Contact Support",
    },
  ];

  return (
    <main className="services-page">

      {/* HERO */}
      <section className="services-hero">

        <div>
          <span>PUBLIC SERVICES</span>

          <h1>Civic Services</h1>

          <p>
            Access essential civic services, report public issues, track
            complaints, and connect with government departments through
            CivicConnect.
          </p>
        </div>

      </section>


      {/* SERVICES */}
      <section className="services-container">

        <div className="services-intro">

          <span>WHAT YOU CAN DO</span>

          <h2>Government Services at Your Fingertips</h2>

          <p>
            CivicConnect brings important civic services together in one
            accessible digital platform.
          </p>

        </div>


        <div className="services-grid">

          {services.map((service, index) => (

            <article
              className="service-card"
              key={index}
            >

              <div className="service-icon">
                {service.icon}
              </div>

              <div className="service-content">

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <Link to={service.link}>
                  {service.button} →
                </Link>

              </div>

            </article>

          ))}

        </div>


        {/* HOW IT WORKS */}
        <section className="services-process">

          <div className="services-intro">

            <span>HOW IT WORKS</span>

            <h2>Report. Track. Resolve.</h2>

          </div>


          <div className="process-grid">

            <div className="process-step">

              <div className="process-number">
                01
              </div>

              <h3>Report</h3>

              <p>
                Submit your civic complaint with the required details,
                location, and supporting information.
              </p>

            </div>


            <div className="process-step">

              <div className="process-number">
                02
              </div>

              <h3>Assign</h3>

              <p>
                Your complaint is directed to the appropriate government
                department for action.
              </p>

            </div>


            <div className="process-step">

              <div className="process-number">
                03
              </div>

              <h3>Track</h3>

              <p>
                Monitor the status of your complaint and receive updates
                throughout the process.
              </p>

            </div>


            <div className="process-step">

              <div className="process-number">
                04
              </div>

              <h3>Resolve</h3>

              <p>
                The responsible department works on the issue and updates
                the complaint when it is resolved.
              </p>

            </div>

          </div>

        </section>


        {/* CTA */}
        <section className="services-cta">

          <div>

            <span>NEED ASSISTANCE?</span>

            <h2>Not sure where to start?</h2>

            <p>
              Ask CivicConnect AI for guidance on the right service or
              department for your civic issue.
            </p>

          </div>

          <Link to="/ai-assistant">
            Ask CivicConnect AI →
          </Link>

        </section>

      </section>

    </main>
  );
}

export default Services;

