import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";

const ViewCurrentUser = () => {
  const { id } = useParams();
  const [otherDetailsOfUser, setOtherDetailsOfUser] = useState({});
  const [categoryWiseUserDetails, setCategoryWiseUserDetails] = useState({});
  const [roles, setRoles] = useState([]);
  const [headers, setHeaders] = useState({});

  const [viewUserDetails, setViewUserDetails] = useState({
    classOnEditClick: "d-none",
    classOnPageLoad: "",
  });

  const editDetails = () => {
    setViewUserDetails({
      classOnEditClick: "",
      classOnPageLoad: "d-none",
    });
  };

  const commonFnForSaveAndCancelClick = () => {
    setViewUserDetails({
      classOnEditClick: "d-none",
      classOnPageLoad: "",
    });
    const roleCheckboxes = document.querySelectorAll(".roles-checkbox");
    roleCheckboxes.forEach((checkbox) => {
      if (!(parseInt(checkbox.id) === role_id)) {
        checkbox.checked = false;
      }
    });
  };

  const cancelEditing = () => {
    commonFnForSaveAndCancelClick();
  };

  const { user_id, role_id, email_address, mobile_number, user_type } =
    otherDetailsOfUser;
  const { classOnEditClick, classOnPageLoad } = viewUserDetails;

  const data = JSON.parse(localStorage.getItem("data"));

  const setCurrentUserData = async () => {
    if (data) {
      let headers = { Authorization: data.logintoken };
      setHeaders({ Authorization: data.logintoken });

      // Get user by Id.
      const currentUser = await axios.get(
        `/sam/v1/user-registration/auth/${id}`,
        { headers: headers }
      );
      console.log(currentUser.data);
      const typeOfUser = Object.keys(currentUser.data)[1];
      setCategoryWiseUserDetails(currentUser.data[typeOfUser]);
      setOtherDetailsOfUser(currentUser.data.user_details);

      // Get all roles.
      const allRoles = await axios.get(
        `/sam/v1/user-registration/auth/all-roles`,
        {
          headers: headers,
        }
      );
      setRoles(allRoles.data);
    }
  };

  let array = [];
  const onRoleSelect = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      array.push(parseInt(value));
    } else {
      array = array.filter((item) => item !== parseInt(value));
    }
  };

  let rolesToPost = [];
  const saveRoles = async () => {
    for (let i of array) {
      rolesToPost.push({ role_id: i });
    }
    await axios
      .post(
        `/sam/v1/user-registration/auth/add-role`,
        { user_id: user_id, roles: rolesToPost },
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.status === 0) {
          toast.success("Roles added successfully");
          commonFnForSaveAndCancelClick();
        }
      });
  };

  useEffect(() => {
    setCurrentUserData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-md-8 mt-4 mt-md-0">
            <BreadCrumb
              typeOfUser={user_type}
              emailOfCurrentUser={email_address}
            />
            <section className="admin-edit-property wrapper">
              <div className="container-fluid">
                <h2 className="text-center mb-4">View/Edit</h2>
                <div className="row justify-content-center">
                  <div className="col-xl-10 col-lg-11">
                    <form
                      action=""
                      className="card shadow p-xl-5 p-lg-4 p-3 position-relative"
                    >
                      {/* <div className="text-end position-absolute admin-property-edit-icon">
                        <i
                          onClick={editDetails}
                          className="bi bi-pencil-square"
                        ></i>
                      </div> */}
                      <div className="row">
                        <div className="col-md-6 col-12 text-center text-md-start">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="user_id"
                            >
                              USER ID:
                            </label>
                            <br />
                            {user_id}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 text-center text-md-start">
                          <div className="form-group mb-3">
                            <label
                              htmlFor="role"
                              className="form-label fw-bold"
                            >
                              Role
                              <span className={`ms-4 ${classOnPageLoad}`}>
                                <i
                                  onClick={editDetails}
                                  className="bi bi-pencil-square"
                                ></i>
                              </span>
                              <span
                                onClick={cancelEditing}
                                className={`ms-4 ${classOnEditClick}`}
                              >
                                <i className="bi bi-x-square-fill text-danger fs-5"></i>
                              </span>
                              <span
                                onClick={saveRoles}
                                className={`ms-3 ${classOnEditClick}`}
                              >
                                <i className="bi bi-check-square-fill text-success fs-5"></i>
                              </span>
                            </label>
                            <span className={`${classOnPageLoad}`}>
                              <br /> {role_id} -
                              {role_id === 1
                                ? " Admin"
                                : role_id === 2
                                ? " Editor"
                                : " Viewer"}
                            </span>

                            <div className={`form-group ${classOnEditClick}`}>
                              {roles.map((data, Index) => {
                                if (data.id === role_id) {
                                  const defaultRole = document.getElementById(
                                    data.id
                                  );
                                  if (defaultRole) {
                                    defaultRole.checked = true;
                                    defaultRole.disabled = true;
                                  }
                                }
                                return (
                                  <div
                                    key={Index}
                                    className="form-check form-check-inline"
                                  >
                                    <input
                                      className="form-check-input roles-checkbox"
                                      type="checkbox"
                                      onChange={(e) => {
                                        onRoleSelect(e);
                                      }}
                                      id={data.id}
                                      value={data.id}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="inlineCheckbox1"
                                    >
                                      {`${data.id} - ${data.role}`}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 text-center text-md-start">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="user_type"
                            >
                              USER TYPE:
                            </label>
                            <br />
                            {user_type}
                          </div>
                        </div>
                        {/* Show Data As Per User Type*/}
                        {user_type === "Individual User" ? (
                          <>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="first_name"
                                >
                                  First Name:
                                </label>
                                <br />
                                {categoryWiseUserDetails.first_name}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="middle_name"
                                >
                                  Middle Name:
                                </label>
                                <br />
                                {categoryWiseUserDetails.middle_name}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="last_name"
                                >
                                  Last Name:
                                </label>
                                <br />
                                {categoryWiseUserDetails.last_name}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="aadhar_number"
                                >
                                  Aadhaar Number:
                                </label>
                                <br />
                                {categoryWiseUserDetails.aadhar_number}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="pan_number"
                                >
                                  PAN Number:
                                </label>
                                <br />
                                {categoryWiseUserDetails.pan_number}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="company_name"
                                >
                                  Company Name:
                                </label>
                                <br />
                                {categoryWiseUserDetails.company_name}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="organization_type"
                                >
                                  Organization Type:
                                </label>
                                <br />
                                {categoryWiseUserDetails.organization_type}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="gst_number"
                                >
                                  GST Number:
                                </label>
                                <br />
                                {categoryWiseUserDetails.gst_number}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="tan_number"
                                >
                                  TAN Number:
                                </label>
                                <br />
                                {categoryWiseUserDetails.tan_number}
                              </div>
                            </div>
                            <div className="col-md-6 col-12 text-center text-md-start">
                              <div className="form-group mb-3">
                                <label
                                  className="form-label fw-bold"
                                  htmlFor="cin_number"
                                >
                                  CIN Number:
                                </label>
                                <br />
                                {categoryWiseUserDetails.cin_number}
                              </div>
                            </div>
                          </>
                        )}

                        <div className="col-md-6 col-12 text-center text-md-start">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="email"
                            >
                              Email:
                            </label>
                            <br />
                            {email_address}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 text-center text-md-start">
                          <div className="form-group mb-3">
                            <label
                              className="form-label fw-bold"
                              htmlFor="phone"
                            >
                              Contact:
                            </label>
                            <br />
                            {mobile_number}
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
