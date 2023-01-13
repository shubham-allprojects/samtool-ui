import axios from "axios";
import React, { useState } from "react";
import { useRef } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import BreadCrumb from "./BreadCrumb";

const records_per_page = 2;
let currentPageNumber = 1;
let pagesArray = [];
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState("");
  const [displayClass, setDisplayClass] = useState("d-none");
  const [counts, setCounts] = useState({
    individualUsersCount: 4,
    orgUsersCount: 3,
  });
  const individualBtnRef = useRef();
  const orgBtnRef = useRef();
  const { individualUsersCount, orgUsersCount } = counts;

  const setHeaderAndUrl = () => {
    const loginToken = localStorage.getItem("logintoken");
    let headers = { Authorization: loginToken };
    let url = `/sam/v1/user-registration/auth/get-users`;
    return [headers, url];
  };

  const setPageNumbers = (totalUsers) => {
    pagesArray = [];
    let pages = Math.ceil(totalUsers / records_per_page);
    for (let i = 1; i <= pages; i++) {
      pagesArray.push(i);
    }
  };

  // const deleteUser = (userId, userName) => {
  //   let usersToShow = allUsers.filter((user) => {
  //     return user._id !== userId;
  //   });
  //   toast.success(`User ${userName} deleted successfuly`);
  //   setAllUsers(usersToShow);
  // };

  const getIndividualUsers = async (pageNumber, records_per_page) => {
    setPageNumbers(individualUsersCount);
    setDisplayClass("");
    individualBtnRef.current.classList.add("active");
    orgBtnRef.current.classList.remove("active");
    setUserType("individual_user");
    const [headers, url] = setHeaderAndUrl();
    const individualBodyData = {
      type: "Individual User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };

    await axios
      .post(url, individualBodyData, { headers: headers })
      .then((res) => {
        setUsers(res.data);
      });
  };

  const getOrgUsers = async (pageNumber, records_per_page) => {
    setPageNumbers(orgUsersCount);
    individualBtnRef.current.classList.remove("active");
    orgBtnRef.current.classList.add("active");
    setDisplayClass("");
    const [headers, url] = setHeaderAndUrl();
    setUserType("org_user");
    const orgBodyData = {
      type: "Organizational User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };
    await axios.post(url, orgBodyData, { headers: headers }).then((res) => {
      setUsers(res.data);
    });
  };

  const handlePageClick = (e) => {
    let page = e.target.textContent;
    if (page === "Previous") {
      currentPageNumber = currentPageNumber - 1;
    } else if (page === "Next") {
      currentPageNumber = currentPageNumber + 1;
    } else {
      currentPageNumber = parseInt(page);
    }
    if (userType === "org_user") {
      getOrgUsers(currentPageNumber, records_per_page);
    } else {
      getIndividualUsers(currentPageNumber, records_per_page);
    }
  };

  // const deleteAllUsers = () => {
  //   toast.success("Deleted all users");
  //   setAllUsers([]);
  //   window.scrollTo(0, 0);
  // };

  return (
    <Layout>
      <div className="container-fluid admin-users-wrapper section-padding">
        <div className="row min-100vh">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9">
            <BreadCrumb />
            <div className="row">
              <div className="col-12">
                <button
                  ref={individualBtnRef}
                  onClick={() => {
                    getIndividualUsers(currentPageNumber, records_per_page);
                  }}
                  className="btn btn-outline-secondary me-2 users-btn"
                >
                  Individual Users
                </button>
                <button
                  ref={orgBtnRef}
                  onClick={() => {
                    getOrgUsers(currentPageNumber, records_per_page);
                  }}
                  className="btn btn-outline-secondary users-btn"
                >
                  Organizational User
                </button>
              </div>
            </div>
            <div className={`${displayClass} mt-4`}>
              {users.length <= 0 ? (
                <div className="d-flex align-items-center justify-content-center mt-5">
                  <h1 className="fw-bold custom-heading-color">
                    Sorry ! No Users Found :(
                  </h1>
                </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="table table-bordered table-dark table-striped text-center">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>
                            {userType === "org_user" ? "Company Name" : "Name"}
                          </th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>State</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, Index) => {
                          const {
                            email_address,
                            role_id,
                            state_name,
                            id,
                            user_type,
                          } = user.user_details;
                          return (
                            <tr key={Index}>
                              <td>{Index + 1}</td>
                              <td>
                                {user_type === "Organizational User"
                                  ? user.org_user.company_name
                                  : user.individual_user.first_name}
                              </td>
                              <td>{email_address}</td>
                              <td>{role_id}</td>
                              <td>{state_name}</td>
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
                                      // to={`/admin/users/view-user/${id}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                      }}
                                      className="dropdown-item"
                                    >
                                      <i className="bi bi-eye pe-1"></i> View
                                    </NavLink>

                                    <span
                                      className="dropdown-item"
                                      // onClick={() => {
                                      //   deleteUser(id, first_name);
                                      // }}
                                    >
                                      <i className="bi bi-trash pe-1"></i>{" "}
                                      Delete
                                    </span>
                                  </ul>
                                </li>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <nav aria-label="Page navigation example">
                      <ul className="pagination" id="pagination">
                        <li
                          onClick={(e) => {
                            handlePageClick(e);
                          }}
                          className={`page-item ${
                            currentPageNumber === 1 ? "disabled" : ""
                          }`}
                        >
                          <span className="page-link">Previous</span>
                        </li>
                        {pagesArray.map((pageNo, Index) => {
                          return (
                            <li
                              onClick={(e) => {
                                handlePageClick(e);
                              }}
                              className="page-item"
                              key={Index}
                            >
                              <span className="page-link">{pageNo}</span>
                            </li>
                          );
                        })}
                        <li
                          onClick={(e) => {
                            handlePageClick(e);
                          }}
                          className={`page-item ${
                            currentPageNumber ===
                            pagesArray[pagesArray.length - 1]
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <span className="page-link">Next</span>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
