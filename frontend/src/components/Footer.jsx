
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>CivicConnect</h3>
          <p>
            A smart public complaint management platform designed to connect
            citizens with government services.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/complaints">Register Complaint</a>
          <a href="/track-complaint">Track Complaint</a>
          <a href="/departments">Departments</a>
        </div>

        <div className="footer-section">
          <h3>Citizen Services</h3>
          <a href="/announcements">Announcements</a>
          <a href="/about">About CivicConnect</a>
          <a href="/contact">Help & Support</a>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>📞 Citizen Helpline</p>
          <p>✉️ support@civicconnect.gov</p>
          <p>📍 Public Service Centre</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2026 CivicConnect. All Rights Reserved.
        </p>
        <p>Built for better citizen services.</p>
      </div>
    </footer>
  );
}

export default Footer;

