import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import users from "./users.json";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState(users);
  const deleteUser = (userId) => {
    let usersToShow = allUsers.filter((user) => {
      return user._id !== userId;
    });
    setAllUsers(usersToShow);
  };
  return (
    <Layout>
      <div className="container-fluid admin-users-wrapper section-padding">
        <div className="row min-100vh">
          <AdminSideBar />
          {allUsers.length <= 0 ? (
            <div className="col-xl-10 col-md-9 text-center wrapper">
              <h2 className="text-center">Sorry ! No Users Found :(</h2>
            </div>
          ) : (
            <div className="col-xl-10 col-md-9 scrollable-right-div wrapper">
              <h1 className="text-center">Users</h1>
              <div className="table-wrapper">
                <table className="table table-bordered table-dark table-striped text-center">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Company Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user, Index) => {
                      return (
                        <tr key={Index}>
                          <td>{Index + 1}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.company.name}</td>
                          <td>
                            <li className="nav-item dropdown list-unstyled">
                              <span
                                className="nav-link dropdown-toggle"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Select
                              </span>
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="navbarDropdown"
                              >
                                <NavLink
                                  to={`/admin/users/view-user/${user._id}`}
                                  className="dropdown-item"
                                >
                                  <i className="bi bi-eye pe-1"></i> View
                                </NavLink>

                                <span
                                  className="dropdown-item"
                                  onClick={() => {
                                    deleteUser(user._id);
                                  }}
                                >
                                  <i className="bi bi-trash pe-1"></i> Delete
                                </span>
                              </ul>
                            </li>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
