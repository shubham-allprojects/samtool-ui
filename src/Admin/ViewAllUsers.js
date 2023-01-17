import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import BreadCrumb from "./BreadCrumb";
import CommonSpinner from "../CommonSpinner";

const records_per_page = 4;
let currentPageNumber = 1;
let pagesArray = [];
const ManageUsers = () => {
  const [users, setUsers] = useState({
    individualUsers: [],
    orgUsers: [],
  });

  const [functionalitiesState, setFunctionalitiesState] = useState({
    individualBtnClass: "",
    orgBtnClass: "",
    individualBtnDisabled: false,
    orgBtnDisabled: false,
    individualDisplayClass: "d-none",
    orgDisplayClass: "d-none",
    userType: "",
  });

  const [loading, setLoading] = useState(false);
  const [individualUsersCount, setIndividualUsersCount] = useState(0);
  const [orgUsersCount, setOrgUsersCount] = useState(0);

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

  const data = JSON.parse(localStorage.getItem("data"));

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

  // const deleteUser = (userId, userName) => {
  //   let usersToShow = allUsers.filter((user) => {
  //     return user._id !== userId;
  //   });
  //   toast.success(`User ${userName} deleted successfuly`);
  //   setAllUsers(usersToShow);
  // };

  const setIndividualUsersDetails = async (pageNumber, records_per_page) => {
    const [headers, url] = setHeaderAndUrl();
    const individualBodyData = {
      type: "Individual User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };
    await axios
      .post(url, individualBodyData, { headers: headers })
      .then((res) => {
        setIndividualUsersCount(res.data.count);
        setUsers({ individualUsers: res.data.AllData, orgUsers: [] });
      });
    setLoading(false);
  };

  const setOrgUsersDetails = async (pageNumber, records_per_page) => {
    const [headers, url] = setHeaderAndUrl();
    const orgBodyData = {
      type: "Organizational User",
      page_number: pageNumber,
      number_of_records: records_per_page,
    };
    await axios.post(url, orgBodyData, { headers: headers }).then((res) => {
      setOrgUsersCount(res.data.count);
      setUsers({
        orgUsers: res.data.AllOrganizationData,
        individualUsers: [],
      });
    });
    setLoading(false);
  };

  const getIndividualUsers = (pageNumber, records_per_page) => {
    setPageNumbers(individualUsersCount);
    console.log(individualUsersCount);
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
    setIndividualUsersDetails(pageNumber, records_per_page);
  };

  const getOrgUsers = async (pageNumber, records_per_page) => {
    setPageNumbers(orgUsersCount);
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
    setOrgUsersDetails(pageNumber, records_per_page);
  };

  const onBtnClick = (e) => {
    const { name } = e.target;
    setLoading(true);
    currentPageNumber = 1;
    if (name === "individualBtn") {
      getIndividualUsers(currentPageNumber, records_per_page);
    } else if (name === "orgBtn") {
      getOrgUsers(currentPageNumber, records_per_page);
    }
  };

  const handlePageClick = (e) => {
    let allPageItems = document.querySelectorAll(".individual-pagination");
    let activePageItem = document.querySelector(
      ".individual-pagination.page-item.active"
    );
    let page = e.target.textContent;
    if (page === "Previous") {
      console.log("prev of indi");
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
    getIndividualUsers(currentPageNumber, records_per_page);
  };

  const handlePageClick2 = (e) => {
    let allPageItems = document.querySelectorAll(".org-pagination");
    let activePageItem = document.querySelector(
      ".org-pagination.page-item.active"
    );
    let page = e.target.textContent;
    if (page === "Previous") {
      console.log("prev of org");
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
    getOrgUsers(currentPageNumber, records_per_page);
  };

  // const deleteAllUsers = () => {
  //   toast.success("Deleted all users");
  //   setAllUsers([]);
  //   window.scrollTo(0, 0);
  // };

  useEffect(() => {
    setIndividualUsersDetails(1, 1);
    setOrgUsersDetails(1, 1);
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid admin-users-wrapper section-padding">
        <div className="row min-100vh">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9 users-admin">
            <BreadCrumb userType={userType} />
            <div className="row">
              <div className="col-12">
                <button
                  name="individualBtn"
                  onClick={onBtnClick}
                  className={`btn btn-outline-secondary me-2 users-btn ${individualBtnClass}`}
                  disabled={individualBtnDisabled}
                >
                  Individual Users -{" "}
                  <span id="individualCount">{individualUsersCount}</span>
                </button>
                <button
                  name="orgBtn"
                  onClick={onBtnClick}
                  className={`btn btn-outline-secondary users-btn ${orgBtnClass}`}
                  disabled={orgBtnDisabled}
                >
                  Organizational User -{" "}
                  <span id="orgCount">{orgUsersCount}</span>
                </button>
              </div>
            </div>
            <div className={`${individualDisplayClass} mt-4`}>
              {loading ? (
                <>
                  <CommonSpinner />
                </>
              ) : individualUsers.length <= 0 ? (
                <div className="d-flex align-items-center justify-content-center mt-5">
                  <h1 className="fw-bold custom-heading-color">
                    Sorry ! No Users Found :(
                  </h1>
                </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="table table-bordered table-dark admin-users-table table-striped text-center">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
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
                              <td>{Index + 1}</td>
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
                  </div>
                </>
              )}
            </div>
            <div className={`${orgDisplayClass} mt-4`}>
              {loading ? (
                <>
                  <CommonSpinner />
                </>
              ) : orgUsers.length <= 0 ? (
                <div className="d-flex align-items-center justify-content-center mt-5">
                  <h1 className="fw-bold custom-heading-color">
                    Sorry ! No Users Found :(
                  </h1>
                </div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="table table-bordered table-dark admin-users-table table-striped text-center">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
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
                              <td>{Index + 1}</td>
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
                            if (currentPageNumber !== 1) {
                              handlePageClick2(e);
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
                                handlePageClick2(e);
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
                              handlePageClick2(e);
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
