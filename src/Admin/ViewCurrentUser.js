import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import BreadCrumb from "./BreadCrumb";

const ViewCurrentUser = () => {
  const { id } = useParams();
  const [otherDetailsOfUser, setOtherDetailsOfUser] = useState({});
  const [categoryWiseUserDetails, setCategoryWiseUserDetails] = useState({});
  const [userType, setUserType] = useState("");

  const [viewUserDetails, setViewUserDetails] = useState({
    isReadOnly: true,
    isDisabled: false,
    editClassName: "editable-values",
    cancelUpdateBtnClassName: "d-none",
  });

  const editDetails = () => {
    setViewUserDetails({
      isReadOnly: false,
      isDisabled: true,
      editClassName: "",
      cancelUpdateBtnClassName: "",
    });
  };

  const cancelEditing = () => {
    setViewUserDetails({
      isReadOnly: true,
      isDisabled: false,
      editClassName: "editable-values",
      cancelUpdateBtnClassName: "d-none",
    });
  };
  const { user_id, role_id, email_address, mobile_number } = otherDetailsOfUser;
  const { isReadOnly, isDisabled, editClassName, cancelUpdateBtnClassName } =
    viewUserDetails;

  const setCurrentUserData = async () => {
    const token = localStorage.getItem("logintoken");
    const headers = { Authorization: token };
    const currentUser = await axios.get(
      `/sam/v1/user-registration/auth/${id}`,
      { headers: headers }
    );
    const typeOfUser = Object.keys(currentUser.data)[1];
    setUserType(typeOfUser);
    setCategoryWiseUserDetails(currentUser.data[typeOfUser]);
    setOtherDetailsOfUser(currentUser.data.user_details);
    console.log(currentUser.data[typeOfUser]);
  };

  useEffect(() => {
    setCurrentUserData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh">
          <AdminSideBar />
          <div className="col-xl-10 col-md-9">
            <BreadCrumb />
            <section className="admin-edit-property wrapper">
              <div className="container-fluid">
                <h2 className="text-center mb-4">View/Edit</h2>
                <div className="row justify-content-center">
                  <div className="col-xl-10 col-lg-11">
                    <form
                      action=""
                      className="card shadow p-xl-5 p-lg-4 p-3 position-relative"
                    >
                      <div className="text-end position-absolute admin-property-edit-icon">
                        <i
                          onClick={editDetails}
                          className="bi bi-pencil-square"
                        ></i>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="form-group mb-3">
                            <label className="form-label fw-bold" htmlFor="_id">
                              USER ID:
                            </label>
                            <input
                              name="_id"
                              id="_id"
                              className={`form-control ${editClassName}`}
                              type="text"
                              defaultValue={user_id}
                              disabled={isDisabled}
                              readOnly={isReadOnly}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="name"
                            >
                              Role:
                            </label>
                            <input
                              name="name"
                              id="name"
                              className={`form-control ${editClassName}`}
                              type="text"
                              defaultValue={role_id}
                              readOnly={isReadOnly}
                            />
                          </div>
                        </div>
                        {/* Show Data As Per User Type*/}
                        {userType === "individual_user" ? (
                          <>
                            <div className="col-6">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="first_name"
                                >
                                  First Name:
                                </label>
                                <input
                                  name="first_name"
                                  id="first_name"
                                  className={`form-control ${editClassName}`}
                                  type="text"
                                  defaultValue={
                                    categoryWiseUserDetails.first_name
                                  }
                                  readOnly={isReadOnly}
                                  disabled={isDisabled}
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="middle_name"
                                >
                                  Middle Name:
                                </label>
                                <input
                                  name="middle_name"
                                  id="middle_name"
                                  className={`form-control ${editClassName}`}
                                  type="text"
                                  defaultValue={
                                    categoryWiseUserDetails.middle_name
                                  }
                                  readOnly={isReadOnly}
                                  disabled={isDisabled}
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="last_name"
                                >
                                  Last Name:
                                </label>
                                <input
                                  name="last_name"
                                  id="last_name"
                                  className={`form-control ${editClassName}`}
                                  type="text"
                                  defaultValue={
                                    categoryWiseUserDetails.last_name
                                  }
                                  readOnly={isReadOnly}
                                  disabled={isDisabled}
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="aadhar_number"
                                >
                                  Aadhaar Number:
                                </label>
                                <input
                                  name="aadhar_number"
                                  id="aadhar_number"
                                  className={`form-control ${editClassName}`}
                                  type="text"
                                  defaultValue={
                                    categoryWiseUserDetails.aadhar_number
                                  }
                                  readOnly={isReadOnly}
                                  disabled={isDisabled}
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="pan_number"
                                >
                                  PAN Number:
                                </label>
                                <input
                                  name="pan_number"
                                  id="pan_number"
                                  className={`form-control ${editClassName}`}
                                  type="text"
                                  defaultValue={
                                    categoryWiseUserDetails.pan_number
                                  }
                                  readOnly={isReadOnly}
                                  disabled={isDisabled}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}

                        <div className="col-6">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="email"
                            >
                              Email:
                            </label>
                            <input
                              name="email"
                              id="email"
                              className={`form-control ${editClassName}`}
                              type="email"
                              defaultValue={email_address}
                              readOnly={isReadOnly}
                              disabled={isDisabled}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="phone"
                            >
                              Contact:
                            </label>
                            <input
                              name="phone"
                              id="phone"
                              className={`form-control ${editClassName}`}
                              type="text"
                              defaultValue={mobile_number}
                              readOnly={isReadOnly}
                              disabled={isDisabled}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`row mt-4 ${cancelUpdateBtnClassName}`}
                        id="update-cancel"
                      >
                        <div className="col-12">
                          <div className="text-end">
                            <button
                              onClick={cancelEditing}
                              type="button"
                              className="btn btn-secondary me-2"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                              type="submit"
                              className="btn btn-primary"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewCurrentUser;
