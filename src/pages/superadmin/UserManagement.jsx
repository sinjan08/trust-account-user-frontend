import React from "react";
import SuperAdminSidebar from "../../components/sidebar/SuperAdminSidebar";
const UserManagement = () => {
  return (
    <section id="content">
      <SuperAdminSidebar />
      <nav>
        <i className="bx bx-menu">
          <img src="images/menu-icons/hamburger.svg" alt="Menu" />
        </i>
        <div className="notification-in">
          <button type="button">
            <img src="images/menu-icons/notification.svg" alt="Noti" />
          </button>
          {/* Notification Dropdown Here */}
        </div>
        <div className="admin-icon">
          <img src="images/menu-icons/admin.png" alt="Admin" />
        </div>
      </nav>

      {/* MAIN */}
      <main>
        <div className="dashboard-wrap">
          <div className="influ-strip-2">
            <form>
              <div className="influ-search">
                <label>
                  <input type="text" placeholder="Search" />
                  <button>
                    <img src="images/menu-icons/search-icon.svg" alt="Search" />
                  </button>
                </label>
              </div>
              <div className="influ-btns">
                {/* Date Picker */}
                <label className="daterange-btn">
                  <img src="images/menu-icons/calender-icon.svg" alt="" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Sign Up Date Range"
                  />
                </label>

                {/* Export */}
                <button className="influ-btn">
                  <img src="images/menu-icons/export-icon.svg" alt="" />
                  Export CSV
                </button>

                {/* Add User */}
                <button
                  type="button"
                  className="influ-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#create-newuser-popup"
                >
                  <img
                    src="images/jungleballers-imgs/request-icon.svg"
                    alt=""
                  />
                  Add user
                </button>
              </div>
            </form>
          </div>

          {/* Table (You can extract this to another component if it grows too big) */}
          <div className="page-table">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Sign Up Date</th>
                    <th>Assign role</th>
                    <th>Subscription Type</th>
                    <th>Access</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Repeat this row as needed or map from props */}
                  <tr>
                    <td>01</td>
                    <td>Juanita</td>
                    <td>Katona@gmail.com</td>
                    <td>(270) 555-0117</td>
                    <td>04/29/2023</td>
                    <td>Lorem</td>
                    <td>Basic</td>
                    <td>
                      <div className="toggle-wrap">
                        <p>Granted</p>
                        <div className="toggle">
                          <input type="checkbox" />
                          <label></label>
                        </div>
                        <p>Denied</p>
                      </div>
                    </td>
                    <td>
                      <a
                        data-bs-toggle="modal"
                        data-bs-target="#edit-newuser-popup"
                      >
                        <img src="images/menu-icons/edit.svg" alt="Edit" />
                      </a>
                      <a
                        data-bs-toggle="modal"
                        data-bs-target="#actiavte-popup"
                      >
                        <img
                          src="images/menu-icons/checked.svg"
                          alt="Activate"
                        />
                      </a>
                      <a data-bs-toggle="modal" data-bs-target="#delete-popup">
                        <img src="images/menu-icons/trash.svg" alt="Delete" />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="influ-pagi">
            <ul>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-left"></i>
                </a>
              </li>
              <li className="active">
                <a href="#">1</a>
              </li>
              <li>
                <a href="#">2</a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i>
                </a>
              </li>
            </ul>
            <p>Showing 50 of 170 results</p>
          </div>
        </div>
      </main>
    </section>
  );
};
export default UserManagement;
