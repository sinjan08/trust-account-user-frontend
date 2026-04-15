import React from "react";
import AdminSidebar from "../../../components/sidebar/adminSidebar";

const ManageUsers = () => {
  const users = [
    {
      id: 1,
      name: "Katona Beatrix",
      email: "Katona@gmail.com",
      phone: "(270) 555-0117",
      date: "04/29/2023",
      role: "Lorem",
      access: false,
    },
    {
      id: 2,
      name: "Katona Beatrix",
      email: "Katona@gmail.com",
      phone: "(270) 555-0117",
      date: "04/29/2023",
      role: "Lorem",
      access: true,
    },
    {
      id: 3,
      name: "Katona Beatrix",
      email: "Katona@gmail.com",
      phone: "(270) 555-0117",
      date: "04/29/2023",
      role: "Lorem",
      access: false,
    },
    {
      id: 4,
      name: "Katona Beatrix",
      email: "Katona@gmail.com",
      phone: "(270) 555-0117",
      date: "04/29/2023",
      role: "Lorem",
      access: true,
    },
    {
      id: 5,
      name: "Katona Beatrix",
      email: "Katona@gmail.com",
      phone: "(270) 555-0117",
      date: "04/29/2023",
      role: "Lorem",
      access: false,
    },
    {
      id: 6,
      name: "Katona Beatrix",
      email: "Katona@gmail.com",
      phone: "(270) 555-0117",
      date: "04/29/2023",
      role: "Lorem",
      access: false,
    },
    {
      id: 7,
      name: "Katona Beatrix",
      email: "Katona@gmail.com",
      phone: "(270) 555-0117",
      date: "04/29/2023",
      role: "Lorem",
      access: false,
    },
  ];

  return (
    <>
      <AdminSidebar />
      <section id="content">
        <main>
          <div className="influ-in">
            <div className="influ-strip-2">
              <form>
                <div className="influ-search">
                  <label>
                    <input type="text" placeholder="Search" />
                    <button>
                      <img src="images/search.svg" alt="Search" />
                    </button>
                  </label>
                </div>
                <div className="influ-btns">
                  <label className="daterange-btn">
                    <img src="images/filter-icons/date.svg" alt="" />
                    <input
                      type="text"
                      readOnly
                      className="input"
                      name="datefilter"
                      placeholder="Sign Up Date Range"
                    />
                  </label>
                  <button type="button" className="influ-btn">
                    <img src="images/filter-icons/export.svg" alt="Export" />
                    Export CSV
                  </button>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#add-pop"
                    className="influ-btn"
                  >
                    Add user
                  </button>
                </div>
              </form>
            </div>

            <div className="influ-table">
              <div id="table-responsive-1" className="table-responsive">
                <table>
                  <tbody>
                    <tr>
                      <th>S. No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Sign Up Date</th>
                      <th>Assign role</th>
                      <th>Access</th>
                      <th>Action</th>
                    </tr>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}.</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.date}</td>
                        <td>{user.role}</td>
                        <td>
                          <div className="table-toggle">
                            <h4>Granted</h4>
                            <label className="switch">
                              <input
                                type="checkbox"
                                className="toggleSwitch"
                                defaultChecked={user.access}
                              />
                              <span className="slider round"></span>
                            </label>
                            <h4>Denied</h4>
                          </div>
                        </td>
                        <td>
                          <a
                            href="javascript:void(0);"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-pop"
                          >
                            <img src="images/edit.svg" alt="Edit" />
                          </a>
                          <a
                            href="javascript:void(0);"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-pop"
                          >
                            <img src="images/delete.svg" alt="Delete" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          </div>
        </main>
      </section>
    </>
  );
};

export default ManageUsers;
