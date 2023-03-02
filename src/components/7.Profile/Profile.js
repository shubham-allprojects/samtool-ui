import React, { useState, useEffect } from "react";
import Layout from "../1.CommonLayout/Layout";
import axios from "axios";
import { rootTitle } from "../../CommonFunctions";
import { NavLink } from "react-router-dom";
import profilePic from "../../images/profile-pic.svg";

const Profile = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const [userRole, setUserRole] = useState("");
  // To store updated user details.
  const [commonUserDetails, setCommonUserDetails] = useState({});

  // Object destructuring.
  const { mobile_number, locality, user_type, city, state_name, zip, email } =
    commonUserDetails;

  const [orgUserDetails, setOrgUserDetails] = useState({});

  // Object destructuring.
  const {
    cin_number,
    company_name,
    gst_number,
    organization_type,
    tan_number,
  } = orgUserDetails;

  const [individualUserDetails, setIndividualUserDetails] = useState({});

  // Object destructuring.
  const { first_name, last_name, pan_number, aadhar_number } =
    individualUserDetails;

  // Function will provide login token of user from localStorage and also some urls are stored in this function.
  const setHeaderAndUrl = () => {
    let headers = "";
    let role = "";
    if (data) {
      headers = { Authorization: data.logintoken };
      role = data.roleId;
    }
    let url = `/sam/v1/user-registration/auth`;
    return [headers, url, role];
  };

  // Function will get the data of user whose details are to be edited.
  const getUserProfileDetails = async () => {
    const [headers, url, role] = setHeaderAndUrl();
    if (data) {
      setUserRole(role);
      const userId = data.userId;
      await axios
        .get(`${url}/${userId}`, { headers: headers })
        .then(async (res) => {
          const { individual_user, org_user, user_details } = res.data;
          if (individual_user) {
            const {
              first_name,
              middle_name,
              last_name,
              pan_number,
              aadhar_number,
            } = individual_user;
            setIndividualUserDetails({
              first_name: first_name,
              middle_name: middle_name,
              last_name: last_name,
              pan_number: pan_number,
              aadhar_number: aadhar_number,
            });
          } else if (org_user) {
            const {
              cin_number,
              company_name,
              gst_number,
              organization_type,
              tan_number,
            } = org_user;
            setOrgUserDetails({
              cin_number: cin_number,
              company_name: company_name,
              gst_number: gst_number,
              organization_type: organization_type,
              tan_number: tan_number,
            });
          }
          const {
            user_type,
            mobile_number,
            locality,
            city,
            state_name,
            state_id,
            zip,
            email_address,
            address,
          } = user_details;

          setCommonUserDetails({
            state_id: parseInt(state_id),
            address: address,
            mobile_number: mobile_number,
            locality: locality,
            city: city,
            state_name: state_name,
            zip: zip,
            email: email_address,
            user_type: user_type,
          });
        });
    }
  };

  useEffect(() => {
    rootTitle.textContent = "SAM TOOL - PROFILE";
    getUserProfileDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <section className="profile-wrapper section-padding min-100vh">
        <div className="container-fluid wrapper">
          {/* <div className="row">
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body d-flex justify-content-center flex-column align-items-center">
                  <div className="w-50">
                    <img
                      src={profilePic}
                      alt="Profile Pic"
                      className="img-fluid"
                    />
                  </div>
                  <div>
                    <h3 className="m-0 mt-3">
                      {user_type === "Individual User"
                        ? `${first_name} ${last_name}`
                        : `${company_name} - (${organization_type})`}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="row">
            <div className="col-xl-4 col-lg-6">
              <div className="card p-2 profile-top-cards bg-primary">
                <div className="profile-icon-wrapper text-center">
                  <i className="bi bi-person-square fs-1 text-white"></i>
                </div>
                <h3 className="text-center text-white">User Details</h3>
                <div className="card-body text-center">
                  <div className="row">
                    <div className="col-6">
                      <div className="card py-2 profile-inner-card">
                        {user_type === "Individual User" ? (
                          <>
                            <h6>USER NAME</h6>
                            <small>
                              {first_name} {last_name}
                            </small>
                          </>
                        ) : (
                          <>
                            <h6>COMPANY NAME</h6>
                            <small>{company_name}</small>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card py-2 profile-inner-card">
                        <h6>USER TYPE</h6>
                        <small>{user_type}</small>
                      </div>
                    </div>
                    <div className="col-6 mt-4">
                      <div className="card py-2 profile-inner-card">
                        <h6>USER ROLE</h6>
                        <small>
                          {userRole === 1
                            ? "Admin"
                            : userRole === 2
                            ? "Editor"
                            : "Viewer"}
                        </small>
                      </div>
                    </div>
                    {user_type === "Organizational User" ? (
                      <>
                        <div className="col-6 mt-4">
                          <div className="card py-2 profile-inner-card">
                            <h6>TYPE</h6>
                            <small>{organization_type}</small>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mt-4 mt-lg-0">
              <div className="card p-2 profile-top-cards bg-primary">
                <div className="profile-icon-wrapper text-center">
                  <i className="bi bi-geo-alt-fill fs-1 text-white"></i>
                </div>
                <h3 className="text-center text-white">Address Details</h3>
                <div className="card-body text-center">
                  <div className="row justify-content-center">
                    <div className="col-6">
                      <div className="card py-2 profile-inner-card">
                        <h6>LOCALITY</h6>
                        <small>{locality}</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card py-2 profile-inner-card">
                        <h6>STATE</h6>
                        <small>{state_name}</small>
                      </div>
                    </div>
                    <div className="col-6 mt-4">
                      <div className="card py-2 profile-inner-card">
                        <h6>CITY</h6>
                        <small>{city}</small>
                      </div>
                    </div>
                    <div className="col-6 mt-4">
                      <div className="card py-2 profile-inner-card">
                        <h6>ZIP</h6>
                        <small>{zip}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {user_type === "Individual User" ? (
              <div className="col-xl-4 col-lg-6 mt-xl-0 mt-4">
                <div className="card p-2 profile-top-cards bg-primary">
                  <div className="profile-icon-wrapper text-center">
                    <i className="bi bi-person-vcard fs-1 text-white"></i>
                  </div>
                  <h3 className="text-center text-white">Personal Details</h3>
                  <div className="card-body text-center">
                    <div className="row justify-content-center">
                      <div className="col-6">
                        <div className="card py-2 profile-inner-card">
                          <h6>MOBILE</h6>
                          <small>{mobile_number}</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="card py-2 profile-inner-card">
                          <h6>PAN</h6>
                          <small>{pan_number}</small>
                        </div>
                      </div>
                      <div className="col-6 mt-4">
                        <div className="card py-2 profile-inner-card">
                          <h6>AADHAAR</h6>
                          <small>{aadhar_number}</small>
                        </div>
                      </div>
                      <div className="col-6 mt-4">
                        <div className="card py-2 profile-inner-card">
                          <h6>EMAIL</h6>
                          <small>{email}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-xl-4 col-lg-6 mt-xl-0 mt-4">
                <div className="card p-2 profile-top-cards bg-primary">
                  <div className="profile-icon-wrapper text-center">
                    <i className="bi bi-person-vcard fs-1 text-white"></i>
                  </div>
                  <h3 className="text-center text-white">
                    Organization Details
                  </h3>
                  <div className="card-body text-center">
                    <div className="row justify-content-center">
                      <div className="col-6">
                        <div className="card py-2 profile-inner-card">
                          <h6>CIN</h6>
                          <small>{cin_number}</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="card py-2 profile-inner-card">
                          <h6>TAN</h6>
                          <small>{tan_number}</small>
                        </div>
                      </div>
                      <div className="col-6 mt-4">
                        <div className="card py-2 profile-inner-card">
                          <h6>GST</h6>
                          <small>{gst_number}</small>
                        </div>
                      </div>
                      <div className="col-6 mt-4">
                        <div className="card py-2 profile-inner-card">
                          <h6>EMAIL</h6>
                          <small>{email}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-xl-4 col-lg-6 mt-4">
              <div className="card p-2 profile-top-cards bg-primary">
                <div className="profile-icon-wrapper text-center">
                  <i className="bi bi-globe2 fs-1 text-white"></i>
                </div>
                <h3 className="text-center text-white">Quick Access</h3>
                <div className="card-body text-center">
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <NavLink
                        to="/reset-password"
                        className="card py-2 profile-inner-card text-decoration-none text-dark"
                      >
                        <h6 className="m-0">RESET PASSWORD</h6>
                      </NavLink>
                    </div>
                    <div className="col-md-6 mt-2 mt-md-0">
                      <NavLink
                        to="/edit-details"
                        className="card py-2 profile-inner-card text-decoration-none text-dark"
                      >
                        <h6 className="m-0">EDIT PROFILE</h6>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
