import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import BreadCrumb from "./BreadCrumb";
import CommonSpinner from "../CommonSpinner";
import { toast } from "react-toastify";

const records_per_page = 4;
let currentPageNumber = 1;
let pagesArray = [];

const ManageUsers = () => {
  const [users, setUsers] = useState({
    individualUsers: [],
    orgUsers: [],
  });
  const data = JSON.parse(localStorage.getItem("data"));
  const localPageNo = parseInt(localStorage.getItem("localPageNo"));
  localPageNo ? (currentPageNumber = localPageNo) : (currentPageNumber = 1);
  const localUserType = localStorage.getItem("localUserType");
  const localIndividualCount = parseInt(
    localStorage.getItem("localIndividualCount")
  );
  const localOrgCount = parseInt(localStorage.getItem("localOrgCount"));
  const [functionalitiesState, setFunctionalitiesState] = useState({
    individualBtnClass: "",
    orgBtnClass: "",
    individualBtnDisabled: false,
    orgBtnDisabled: false,
    individualDisplayClass: "d-none",
    orgDisplayClass: "d-none",
    userType: localUserType ? localUserType : "",
  });

  const [loading, setLoading] = useState(false);
  const [individualUsersCount, setIndividualUsersCount] = useState(
    localIndividualCount ? localIndividualCount : 0
  );
  const [orgUsersCount, setOrgUsersCount] = useState(
    localOrgCount ? localOrgCount : 0
  );

  const { individualUsers, orgUsers } = users;
  const {
    individualBtnClass,
    orgBtnClass,
    individualBtnDisabled,
    orgBtnDisabled,
    individualDisplayClass,
    orgDisplayClass,
    userType,
  } = functionalitiesState;

  const setHeaderAndUrl = () => {
    let headers = "";
    if (data) {
      headers = { Authorization: data.logintoken };
    }
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

  const togglePaginationActiveClass = (userType) => {
    let pageItems = "";
    if (userType === "Individual User") {
      pageItems = document.querySelectorAll(".individual-pagination.page-item");
    } else {
      pageItems = document.querySelectorAll(".org-pagination.page-item");
    }
    pageItems.forEach((item) => {
      if (parseInt(item.textContent) === currentPageNumber) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  const deleteUser = async (userId, userName) => {
    const [headers] = setHeaderAndUrl();
    await axios
      .delete(`/sam/v1/user-registration/auth/${userId}`, { headers: headers })
      .then((res) => {
        if (res.data.status === 0) {
          toast.success(`User ${userName} deleted successfuly`);
          if (userType === "Individual User") {
            setIndividualUsersCount(individualUsersCount - 1);
            if (individualUsersCount - 1 > 0) {
              if (individualUsers.length <= 1) {
                currentPageNumber = currentPageNumber - 1;
                getIndividualUsers(
                  currentPageNumber,
                  records_per_page,
                  individualUsersCount - 1
                );
                togglePaginationActiveClass(userType);
              } else {
                getIndividualUsers(
                  currentPageNumber,
                  records_per_page,
                  individualUsersCount - 1
                );
              }
            }
          } else {
            setOrgUsersCount(orgUsersCount - 1);
            if (orgUsersCount - 1 > 0) {
              if (orgUsers.length <= 1) {
                currentPageNumber = currentPageNumber - 1;
                getOrgUsers(
                  currentPageNumber,
                  records_per_page,
                  orgUsersCount - 1
                );
                togglePaginationActiveClass(userType);
              } else {
                getOrgUsers(
                  currentPageNumber,
                  records_per_page,
                  orgUsersCount - 1
                );
              }
            }
          }
        }
      });
  };

  const saveUsersCount = async (pageNumber, records_per_page) => {
    const [headers, url] = setHeaderAndUrl();

    await axios
      .get(`/sam/v1/user-registration/auth/type-count`, { headers: headers })
      .then((res) => {
        setIndividualUsersCount(parseInt(res.data.individual_count));
        setOrgUsersCount(parseInt(res.data.org_count));
        localStorage.setItem("localIndividualCount", res.data.individual_count);
        localStorage.setItem("localOrgCount", res.data.org_count);
      });
  };

  const getIndividualUsers = async (pageNumber, records_per_page, count) => {
    localStorage.setItem("localPageNo", pageNumber);
    localStorage.setItem("localUserType", "Individual User");
    setPageNumbers(count);
    setFunctionalitiesState({
      ...functionalitiesState,
      individualBtnClass: "active",
      orgBtnClass: "",
      individualBtnDisabled: true,
      orgBtnDisabled: false,
      individualDisplayClass: "",
      orgDisplayClass: "d-none",
      userType: "Individual User",
    });
    const [headers, url] = setHeaderAndUrl();
    const individualBodyData = {
      type: "Individual User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };
    await axios
      .post(url, individualBodyData, { headers: headers })
      .then((res) => {
        setUsers({ individualUsers: res.data, orgUsers: [] });
      });
    setLoading(false);
  };

  const getOrgUsers = async (pageNumber, records_per_page, count) => {
    localStorage.setItem("localPageNo", pageNumber);
    localStorage.setItem("localUserType", "Organizational User");
    setPageNumbers(count);
    setFunctionalitiesState({
      ...functionalitiesState,
      individualBtnClass: "",
      orgBtnClass: "active",
      individualBtnDisabled: false,
      orgBtnDisabled: true,
      individualDisplayClass: "d-none",
      orgDisplayClass: "",
      userType: "Organizational User",
    });
    const [headers, url] = setHeaderAndUrl();
    const orgBodyData = {
      type: "Organizational User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };
    await axios.post(url, orgBodyData, { headers: headers }).then((res) => {
      setUsers({
        orgUsers: res.data,
        individualUsers: [],
      });
    });
    setLoading(false);
  };

  const onBtnClick = (e) => {
    const { name } = e.target;
    setLoading(true);
    currentPageNumber = 1;
    if (name === "individualBtn") {
      getIndividualUsers(
        currentPageNumber,
        records_per_page,
        individualUsersCount
      );
    } else if (name === "orgBtn") {
      getOrgUsers(currentPageNumber, records_per_page, orgUsersCount);
    }
  };

  const handlePageClick = (e) => {
    let className1 = "";
    let className2 = "";
    if (userType === "Individual User") {
      className1 = ".individual-pagination";
      className2 = ".individual-pagination.page-item.active";
    } else {
      className1 = ".org-pagination";
      className2 = ".org-pagination.page-item.active";
    }

    let allPageItems = document.querySelectorAll(className1);
    let activePageItem = document.querySelector(className2);
    let page = e.target.textContent;
    if (page === "Previous") {
      currentPageNumber = currentPageNumber - 1;
      activePageItem.classList.remove("active");
      allPageItems.forEach((item) => {
        if (parseInt(item.textContent) === currentPageNumber) {
          item.classList.add("active");
        }
      });
    } else if (page === "Next") {
      currentPageNumber = currentPageNumber + 1;
      activePageItem.classList.remove("active");
      allPageItems.forEach((item) => {
        if (parseInt(item.textContent) === currentPageNumber) {
          item.classList.add("active");
        }
      });
    } else {
      currentPageNumber = parseInt(page);
      allPageItems.forEach((item) => {
        if (item.textContent === page) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
    if (userType === "Individual User") {
      getIndividualUsers(
        currentPageNumber,
        records_per_page,
        individualUsersCount
      );
    } else {
      getOrgUsers(currentPageNumber, records_per_page, orgUsersCount);
    }
  };

  useEffect(() => {
    if (userType === "Individual User") {
      setPageNumbers(individualUsersCount);
      getIndividualUsers(
        currentPageNumber,
        records_per_page,
        individualUsersCount
      );
    } else if (userType === "Organizational User") {
      setPageNumbers(orgUsersCount);
      getOrgUsers(currentPageNumber, records_per_page, orgUsersCount);
    }
    // eslint-disable-next-line
  }, [orgUsersCount, individualUsersCount]);

  useEffect(() => {
    saveUsersCount(1, 1);
    if (userType) {
      togglePaginationActiveClass(userType);
    }
    // eslint-disable-next-line
  }, [togglePaginationActiveClass, saveUsersCount, setPageNumbers]);

  return (
    <Layout>
      <div className="container-fluid admin-users-wrapper section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9 users-admin mt-4 mt-md-0">
            <BreadCrumb userType={userType} />
            <div className="row">
              <div className="col-12 text-center text-md-start">
                <button
                  name="individualBtn"
                  onClick={onBtnClick}
                  className={`btn btn-outline-secondary me-md-2 users-btn ${individualBtnClass}`}
                  disabled={individualBtnDisabled}
                >
                  Individual Users
                </button>
                <button
                  name="orgBtn"
                  onClick={onBtnClick}
                  className={`btn btn-outline-secondary users-btn ${orgBtnClass} mt-2 mt-md-0`}
                  disabled={orgBtnDisabled}
                >
                  Organizational User
                </button>
              </div>
            </div>
            <div className={`${individualDisplayClass} mt-4`}>
              {loading ? (
                <>
                  <CommonSpinner spinnerColor="primary" />
                </>
              ) : individualUsersCount <= 0 ? (
                <div className="d-flex align-items-center justify-content-center mt-5">
                  <h1 className="fw-bold custom-heading-color">
                    Sorry ! No Users Found :(
                  </h1>
                </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="table table-bordered table-primary admin-users-table table-striped text-center">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {individualUsers.map((user, Index) => {
                          const { first_name } = user.individual_user;
                          const { email_address, role_id, user_id } =
                            user.user_details;
                          return (
                            <tr key={Index}>
                              <td>{user_id}</td>
                              <td>{first_name}</td>
                              <td>{email_address}</td>
                              <td>
                                {role_id === 1
                                  ? "Admin"
                                  : role_id === 2
                                  ? "Editor"
                                  : "Viewer"}
                              </td>
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
                                      to={`/admin/users/view-user/${user_id}`}
                                      className="dropdown-item"
                                    >
                                      <i className="bi bi-eye pe-1"></i> View
                                    </NavLink>

                                    <div
                                      className="dropdown-item"
                                      onClick={() => {
                                        deleteUser(user_id, email_address);
                                      }}
                                    >
                                      <i className="bi bi-trash pe-2"></i>
                                      Delete
                                    </div>
                                  </ul>
                                </li>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <nav aria-label="Page navigation example">
                    <ul className="pagination" id="pagination">
                      <li
                        onClick={(e) => {
                          if (currentPageNumber !== 1) {
                            handlePageClick(e);
                          }
                        }}
                        className={`individual-pagination page-item ${
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
                            className={`individual-pagination page-item ${
                              Index === 0 ? "active" : ""
                            }`}
                            key={Index}
                          >
                            <span className="page-link">{pageNo}</span>
                          </li>
                        );
                      })}
                      <li
                        onClick={(e) => {
                          if (
                            currentPageNumber !==
                            pagesArray[pagesArray.length - 1]
                          ) {
                            handlePageClick(e);
                          }
                        }}
                        className={`individual-pagination page-item ${
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
                </>
              )}
            </div>
            <div className={`${orgDisplayClass} mt-4`}>
              {loading ? (
                <>
                  <CommonSpinner spinnerColor="primary" />
                </>
              ) : orgUsersCount <= 0 ? (
                <div className="d-flex align-items-center justify-content-center mt-5">
                  <h1 className="fw-bold custom-heading-color">
                    Sorry ! No Users Found :(
                  </h1>
                </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="table table-bordered table-primary admin-users-table table-striped text-center">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Company Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgUsers.map((user, Index) => {
                          const { company_name } = user.org_user;
                          const { email_address, role_id, user_id } =
                            user.user_details;
                          return (
                            <tr key={Index}>
                              <td>{user_id}</td>
                              <td>{company_name}</td>
                              <td>{email_address}</td>
                              <td>
                                {role_id === 1
                                  ? "Admin"
                                  : role_id === 2
                                  ? "Editor"
                                  : "Viewer"}
                              </td>
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
                                      to={`/admin/users/view-user/${user_id}`}
                                      className="dropdown-item"
                                    >
                                      <i className="bi bi-eye pe-1"></i> View
                                    </NavLink>

                                    <span
                                      className="dropdown-item"
                                      onClick={() => {
                                        deleteUser(user_id, email_address);
                                      }}
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
                  </div>
                  <nav aria-label="Page navigation example">
                    <ul className="pagination" id="pagination">
                      <li
                        onClick={(e) => {
                          if (currentPageNumber !== 1) {
                            handlePageClick(e);
                          }
                        }}
                        className={`org-pagination page-item ${
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
                            className={`org-pagination page-item ${
                              Index === 0 ? "active" : ""
                            }`}
                            key={Index}
                          >
                            <span className="page-link">{pageNo}</span>
                          </li>
                        );
                      })}
                      <li
                        onClick={(e) => {
                          if (
                            currentPageNumber !==
                            pagesArray[pagesArray.length - 1]
                          ) {
                            handlePageClick(e);
                          }
                        }}
                        className={`org-pagination page-item ${
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
