import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../public/css/dashboard.css";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { isSidebarOpen, setSidebarOpen } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('working')
    localStorage.removeItem("trust-account");
    navigate("/login");
  }

  return (
    <>
      {/* Sidebar */}
      <div className={`dsbrd-sidebar-wrp  ${isSidebarOpen ? "active" : ""}`}>
        <div className="dsbrd-sidebar">
          <div className="dsbrdside-header">
            <div className="logo">
              <Link to="#" onClick={() => window.location.reload()}>
                <img src="./images/logo-white.svg" alt="Logo" />
              </Link>
            </div>
          </div>

          <div className={`dsbrd-sidebar-body ${isSidebarOpen ? "open" : ""}`}>
            <ul>
              {[
                {
                  path: "/user/bank-statement",
                  icon: "ds-side-icon-1.svg",
                  label: "Bank Statement",
                },
                {
                  path: "/user/client-trust-entry",
                  icon: "ds-side-icon-2.svg",
                  label: "Client Trust Entry",
                },
                {
                  path: "/user/trust-account-journal",
                  icon: "ds-side-icon-4.svg",
                  label: "Trust Account Journals",
                },
                {
                  path: "/user/individual-ledger",
                  icon: "ds-side-icon-3.svg",
                  label: "Individual Client Ledger",
                },

                {
                  path: "/user/all-clients",
                  icon: "ds-side-icon-5.svg",
                  label: "All Clients",
                },
                {
                  path: "/user/bank-charges-ledgers",
                  icon: "ds-side-icon-6.svg",
                  label: "Bank Charges Ledgers",
                },
                {
                  path: "/user/outstanding-deposits",
                  icon: "ds-side-icon-7.svg",
                  label: "Outstanding Deposits",
                },
                {
                  path: "/user/outstanding-disbursement",
                  icon: "ds-side-icon-8.svg",
                  label: "Outstanding Disbursement",
                },
                {
                  path: "/user/reconciliation",
                  icon: "ds-side-icon-9.svg",
                  label: "Reconciliation",
                },
                {
                  path: "/user/client-leader-summary",
                  icon: "ds-side-icon-10.svg",
                  label: "Client Ledger Summary",
                },
                {
                  path: "/user/lien-management",
                  icon: "ds-side-icon-11.svg",
                  label: "Lien Management",
                },
                {
                  path: "/user/scheduler-for-reports",
                  icon: "ds-side-icon-11.svg",
                  label: "Scheduler or reports",
                },
              ].map((item, index) => (
                <li
                  key={index}
                  className={
                    location.pathname == item.path ? "current-menu-item" : ""
                  }
                >
                  <Link to={item.path}>
                    <img src={`./images/${item.icon}`} alt="Icon" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className={`ds-panel-header ${isSidebarOpen ? "active" : ""}`}>
        <div className="ds-panel-header-inr-wrp">
          <div className="sidebar-toggler">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <img src="./images/bars.svg" alt="Bars Icon" />
            </button>
          </div>
          <div className="ds-panel-hdr-right">
            <div className="notification">
              <a href="#url" className="notification-btn">
                <img src="./images/bell-icon.svg" alt="Bell icon" />
              </a>
            </div>
            <div className="dspnl-hdr-usr-ctrl">
              <div
                className="dspnlhdrusr-drpdn"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <p>Matt Kirlin</p>
                <i className="fa-solid fa-chevron-down"></i>

                <div className="profile-conrol-menu">
                  <ul>
                    <li>
                      <Link to="/my-profile">My Profile</Link>
                    </li>
                    <li>
                      <Link to="/subscription-plan">My Subscription</Link>
                    </li>
                    <li>
                      <a href="" onClick={handleLogout}>Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
