import React, { useState } from "react";

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const handleShow = () => {
    console.log("show");
    console.log(open);
    setOpen(!open);
  };

  return (
    <>
      <section id="sidebar" className={open ? "hide" : ""}>
        <a href="#" className="brand">
          <img src="images/logo.svg" alt="" /> Trust Account <br />{" "}
          Reconciliation
        </a>
        <ul className="side-menu">
          <li>
            <a href="manage-user.html">
              <img src="images/menu-icons/1.svg" alt="" />
              <span className="text">Manage Users</span>
            </a>
          </li>
          <li className="active">
            <a href="manage-clients-trust-accounts.html">
              <img src="images/menu-icons/2.svg" alt="" />
              <span className="text">Manage Clients Trust Accounts</span>
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-dropdown-btn">
              <img src="images/menu-icons/4.svg" alt="" />
              <span className="text">Manage Firm Accounting</span>
              <img
                src="images/dropdown.svg"
                alt="K"
                className={`sidebar-dropdown-icon ${active ? "active" : ""}`}
                onClick={() => setActive(!active)}
              />
            </a>
          </li>
          <div
            className="sidebar-dropdown-list"
            style={{
              display: active ? "flex" : "none",
              flexDirection: "column",
            }}
          >
            <a href="journal-entry.html">Journal Entry</a>
            <a href="client-ledger.html">Client Ledger</a>
          </div>
          <li>
            <a href="manage-attorneys.html">
              <img src="images/menu-icons/5.svg" alt="" />
              <span className="text">Manage Attorneys</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#logout"
              data-dismiss="modal"
            >
              <img src="images/menu-icons/6.svg" alt="" />
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
};

export default AdminSidebar;
