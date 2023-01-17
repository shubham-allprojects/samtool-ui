import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/1.CommonLayout/Layout";
import AdminSideBar from "./AdminSideBar";
import BreadCrumb from "./BreadCrumb";

const ViewCurrentUser = () => {
  const { id } = useParams();
  const [otherDetailsOfUser, setOtherDetailsOfUser] = useState([]);
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
    // let samp = document.querySelectorAll("input");
    // for (let i of samp) {
    //   document.getElementById(i.name).value = currentUser[i.name];
    // }
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
    setUserType(Object.keys(currentUser.data)[1]);
    setOtherDetailsOfUser(currentUser.data.user_details);
  };

  useEffect(() => {
    setCurrentUserData();
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
