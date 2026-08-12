import Navbar from "./Navbar";

function Header() {
return ( <header>

  {/* TOP GOVERNMENT BAR */}
  <div
    style={{
      width: "100%",
      background: "#123b5d",
      color: "#ffffff",
    }}
  >
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "8px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >

      <span
        style={{
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Government Civic Services Portal
      </span>

      <a
        href="/admin-login"
        style={{
          color: "#ffffff",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap",
        }}
      >
        🔐 Admin Portal
      </a>

    </div>
  </div>


  {/* BRAND HEADER */}
  <div className="brand-header">
    <div className="brand-container">

      <div className="brand-left">

        <div className="brand-emblem">
          🏛️
        </div>

        <div>
          <h1>CivicConnect</h1>

          <p>
            Smart Public Complaint Management System
          </p>
        </div>

      </div>


      <div className="brand-right">

        <span>
          Citizen Services
        </span>

        <strong>
          Your Voice. Our Responsibility.
        </strong>

      </div>

    </div>
  </div>


  {/* MAIN NAVIGATION */}
  <Navbar />

</header>


);
}

export default Header;
