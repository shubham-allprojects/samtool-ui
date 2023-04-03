import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import CommonSpinner from "../../CommonSpinner";
import Pagination from "../../Pagination";
import { toast } from "react-toastify";
import BreadCrumb from "../BreadCrumb";

const records_per_page = 2;
let authHeader = "";

const ManageUsers = ({ userType }) => {
  const [users, setUsers] = useState([]);
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }

  const url = `/sam/v1/user-registration/auth`;
  const [loading, setLoading] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [confirmDeleteUserBtnDisabled, setConfirmDeleteUserBtnDisabled] =
    useState(true);
  const confirmDeleteInputRef = useRef();
  const [currentPageNumber, setCurrentPageNumber] = useState(null);

  const getAllUsers = async () => {
    setLoading(true);
    const dataToPost = {
      type: userType,
      page_number: 1,
      number_of_records: records_per_page,
    };
    await axios
      .post(`${url}/get-users`, dataToPost, { headers: authHeader })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      });
    await axios
      .get(`${url}/type-count`, { headers: authHeader })
      .then((res) => {
        let usersCount = null;
        if (userType === "Individual User") {
          usersCount = parseInt(res.data.individual_count);
        } else {
          usersCount = parseInt(res.data.org_count);
        }
        setTotalUsersCount(usersCount);
        setPageCount(Math.ceil(usersCount / records_per_page));
      });
  };

  // This will run when we click any page link in pagination. e.g. prev, 1, 2, 3, 4, next.
  const handlePageClick = async (pageNumber) => {
    window.scrollTo(0, 0);
    let currentPage = pageNumber.selected + 1;
    toggleActivePageClass(currentPage);
    setCurrentPageNumber(currentPage);
    const nextOrPrevPageUsers = await fetchMoreUsers(currentPage);
    setUsers(nextOrPrevPageUsers);
  };

  // Fetch more jobs on page click.
  const fetchMoreUsers = async (currentPage) => {
    const dataToPost = {
      type: userType,
      page_number: currentPage,
      number_of_records: records_per_page,
    };
    const usersRes = await axios.post(`${url}/get-users`, dataToPost, {
      headers: authHeader,
    });
    return usersRes.data;
  };

  const onDeleteBtnClick = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(userName);
    confirmDeleteInputRef.current.value = "";
    setConfirmDeleteUserBtnDisabled(true);
  };

  const toggleActivePageClass = (activePage) => {
    let arr = document.querySelectorAll(".page-item");
    arr.forEach((pageItem) => {
      if (parseInt(pageItem.textContent) === activePage) {
        pageItem.classList.add("active");
      } else {
        pageItem.classList.remove("active");
      }
    });
  };

  const deleteUser = async (userId, userName) => {
    await axios
      .delete(`/sam/v1/user-registration/auth/${userId}`, {
        headers: authHeader,
      })
      .then((res) => {
        if (res.data.status === 0) {
          toast.success(`User ${userName} deleted successfuly`);
          confirmDeleteInputRef.current.value = "";
          setConfirmDeleteUserBtnDisabled(true);
          setTotalUsersCount(totalUsersCount - 1);
          if (totalUsersCount - 1 !== 0) {
            let newPageCount = Math.ceil(
              (totalUsersCount - 1) / records_per_page
            );
            setPageCount(newPageCount);
            if (newPageCount < currentPageNumber) {
              handlePageClick({ selected: currentPageNumber - 2 });
            } else {
              handlePageClick({ selected: currentPageNumber - 1 });
            }
          } else {
            setUsers(false);
          }
        }
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Layout>
      <div className="container-fluid admin-users-wrapper section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 users-admin mt-4 mt-md-0">
            <BreadCrumb userType={userType} />
            <div className="mt-4">
              {loading ? (
                <>
                  <CommonSpinner spinnerColor="primary" />
                </>
              ) : !users ? (
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
                          <th>
                            {userType === "Individual User"
                              ? "Name"
                              : "Company Name"}
                          </th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, Index) => {
                          const { email_address, user_id } = user.user_details;
                          let currentRolesArray = user.role;
                          let roleIdArray = [];
                          let arrayOfRoles = [];
                          currentRolesArray.forEach((obj) => {
                            roleIdArray.push(obj.role_id);
                          });

                          for (let i of roleIdArray) {
                            if (i === 1) {
                              arrayOfRoles.push("Admin");
                            } else if (i === 2) {
                              arrayOfRoles.push("Editor");
                            } else if (i === 3) {
                              arrayOfRoles.push("Viewer");
                            }
                          }
                          return (
                            <tr key={Index}>
                              <td>{user_id}</td>
                              <td>
                                {user.individual_user
                                  ? user.individual_user.first_name
                                  : user.org_user
                                  ? user.org_user.company_name
                                  : ""}
                              </td>
                              <td>{email_address}</td>
                              <td>{arrayOfRoles.join(", ")}</td>
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
                                      to={`/admin/users/${
                                        userType === "Individual User"
                                          ? `individual-users/`
                                          : `organizational-users/`
                                      }${user_id}`}
                                      className="dropdown-item"
                                    >
                                      <i className="bi bi-eye pe-1"></i> View
                                    </NavLink>

                                    <div
                                      data-bs-toggle="modal"
                                      data-bs-target="#confirmDeletedModal"
                                      className={`dropdown-item ${
                                        email_address === data.user
                                          ? "d-none"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        onDeleteBtnClick(
                                          user_id,
                                          email_address
                                        );
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
                  <div className="container mt-4">
                    <div className="row">
                      <Pagination
                        handlePageClick={handlePageClick}
                        pageCount={pageCount}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      <div
        className="modal fade"
        id="confirmDeletedModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm confirm-delete-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Are you sure ?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label htmlFor="confirm-delete-input" className="form-label">
                Please type <span className="fw-bold">{selectedUserEmail}</span>{" "}
                to confirm.
              </label>
              <input
                onChange={(e) => {
                  if (e.target.value === selectedUserEmail) {
                    setConfirmDeleteUserBtnDisabled(false);
                  } else {
                    setConfirmDeleteUserBtnDisabled(true);
                  }
                }}
                ref={confirmDeleteInputRef}
                type="text"
                name="confirm-delete-email"
                id="confirm-delete-input"
                className="form-control"
              />
              <button
                onClick={() => {
                  deleteUser(selectedUserId, selectedUserEmail);
                }}
                data-bs-dismiss="modal"
                disabled={confirmDeleteUserBtnDisabled}
                className="btn btn-danger w-100 mt-3 fw-bold"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
