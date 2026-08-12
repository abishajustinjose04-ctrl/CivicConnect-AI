import { Link } from "react-router-dom";

function About() {
  return (
    <main className="about-page">

      <section className="inner-page-header">
        <div>
          <span>ABOUT CIVICCONNECT</span>
          <h1>Building Better Civic Services</h1>
          <p>
            CivicConnect is a digital public grievance platform designed to
            make it easier for citizens to report civic problems, track
            complaints, and connect with the appropriate government services.
          </p>
        </div>
      </section>


      <section className="about-intro">

        <div className="about-intro-content">
          <span>OUR PURPOSE</span>

          <h2>A Simpler Way to Connect Citizens and Government</h2>

          <p>
            CivicConnect brings essential civic grievance services together
            in one accessible digital platform. Citizens can report issues
            such as damaged roads, water supply problems, waste management,
            drainage, street lighting, and other public-service concerns.
          </p>

          <p>
            The platform is designed around transparency, accessibility,
            accountability, and efficient complaint management.
          </p>

          <Link to="/complaints" className="primary-btn">
            Report a Civic Issue
          </Link>
        </div>

        <div className="about-stat-box">

          <div>
            <strong>01</strong>
            <span>Report</span>
            <p>Submit civic complaints digitally.</p>
          </div>

          <div>
            <strong>02</strong>
            <span>Track</span>
            <p>Monitor complaint progress.</p>
          </div>

          <div>
            <strong>03</strong>
            <span>Resolve</span>
            <p>Connect issues with departments.</p>
          </div>

        </div>

      </section>


      <section className="about-values">

        <div className="section-heading">
          <span>OUR PRINCIPLES</span>
          <h2>What CivicConnect Stands For</h2>
          <p>
            The platform is designed around the needs of citizens and public
            service teams.
          </p>
        </div>


        <div className="values-grid">

          <div className="value-card">
            <div>🔎</div>
            <h3>Transparency</h3>
            <p>
              Citizens should be able to understand the progress of their
              complaints and access important public information.
            </p>
          </div>

          <div className="value-card">
            <div>⚡</div>
            <h3>Efficiency</h3>
            <p>
              Digital complaint management can reduce unnecessary delays and
              help route issues to the appropriate department.
            </p>
          </div>

          <div className="value-card">
            <div>🤝</div>
            <h3>Accessibility</h3>
            <p>
              Civic services should be easy to access and understandable for
              citizens from different backgrounds.
            </p>
          </div>

          <div className="value-card">
            <div>🛡️</div>
            <h3>Accountability</h3>
            <p>
              A structured complaint process helps create clearer
              responsibility and follow-up for reported civic issues.
            </p>
          </div>

        </div>

      </section>


      <section className="about-process">

        <div className="section-heading">
          <span>HOW IT WORKS</span>
          <h2>From Complaint to Resolution</h2>
        </div>

        <div className="process-grid">

          <div className="process-card">
            <strong>01</strong>
            <h3>Citizen Reports</h3>
            <p>
              A citizen submits information about a civic issue through the
              complaint form.
            </p>
          </div>

          <div className="process-card">
            <strong>02</strong>
            <h3>Complaint Review</h3>
            <p>
              The complaint is reviewed and relevant information is recorded
              for processing.
            </p>
          </div>

          <div className="process-card">
            <strong>03</strong>
            <h3>Department Action</h3>
            <p>
              The complaint is directed toward the appropriate government
              department for further action.
            </p>
          </div>

          <div className="process-card">
            <strong>04</strong>
            <h3>Citizen Updates</h3>
            <p>
              Citizens can track the status and progress of their complaint.
            </p>
          </div>

        </div>

      </section>


      <section className="about-cta">

        <div>
          <span>MAKE YOUR VOICE HEARD</span>

          <h2>Have a Civic Issue to Report?</h2>

          <p>
            Help improve your community by reporting problems that require
            attention.
          </p>

          <Link to="/complaints" className="primary-btn">
            Register a Complaint
          </Link>
        </div>

      </section>

    </main>
  );
}

export default About;